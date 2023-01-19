import {join} from "path";
import express from "express";
import {ApiVersion, Shopify} from "@shopify/shopify-api";
import fs from "fs";
import cookieParser from "cookie-parser";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import {setupGDPRWebHooks} from "./gdpr.js";
import {BillingInterval} from "./helpers/ensure-billing.js";

// import {Asset} from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
// import {Theme} from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({path: "../.env"});
const host = process.env.SERVER_URL;
const USE_ONLINE_TOKENS = true;

const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const versionFilePath = "./version.txt";
let templateVersion = "unknown";
if (fs.existsSync(versionFilePath)) {
	templateVersion = fs.readFileSync(versionFilePath, "utf8").trim();
}

const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

Shopify.Context.initialize({
	API_KEY: process.env.SHOPIFY_API_KEY,
	API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
	SCOPES: process.env.SCOPES.split(","),
	HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
	HOST_SCHEME: process.env.HOST.split("://")[0],
	API_VERSION: ApiVersion.April22,
	IS_EMBEDDED_APP: true,
	SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
	USER_AGENT_PREFIX: `Node App Template/${templateVersion}`,
	SERVER_NAME: "verifyRequest",
});
Shopify.Webhooks.Registry.addHandler("APP_SUBSCRIPTIONS_UPDATE", {
	path: "/api/webhooks",
	webhookHandler: async (topic, shop, webhookRequestBody) => {
		let hookObject = JSON.parse(webhookRequestBody);
		const status = hookObject.app_subscription.status;
		const shopId =
			hookObject.app_subscription.admin_graphql_api_shop_id.match(/[0-9]+/)[0];
		const response = await fetch(
			`${host}/bar_collection/get_by_ShopId/${shopId}`,
			{
				headers: {
					"ngrok-skip-browser-warning": true,
				},
			}
		).then(res => res.json());
		const barData = response[0];
		if (status === "ACTIVE") {
			barData.premium_user = true;
		} else if (status === "EXPIRED") {
			barData.premium_user = false;
		} else if (status === "PENDING") {
			barData.premium_user = false;
		} else if (status === "CANCELLED") {
		}
		const data = await fetch(`${host}/bar_collection/update/${barData._id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"ngrok-skip-browser-warning": true,
			},
			body: JSON.stringify(barData),
		});
		const print = await data.json();
		// console.log("PrInT", print);
	},
});
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
	path: "/api/webhooks",
	webhookHandler: async (topic, shop, body) =>
		delete ACTIVE_SHOPIFY_SHOPS[shop],
});

const BILLING_SETTINGS = {
	required: false,
};
setupGDPRWebHooks("/api/webhooks");

export async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === "production",
	billingSettings = BILLING_SETTINGS
) {
	const app = express();
	app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
	app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
	app.set("use-online-tokens", USE_ONLINE_TOKENS);
	app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
	// function excludeShopifyWebhookEndpoint(fn) {
	// 	return function (req, res, next) {
	// 		if (req.path === "/api/webhooks" && req.method === "POST") {
	// 			next();
	// 		} else {
	// 			fn(req, res, next);
	// 		}
	// 	};
	// }

	// app.use(
	// 	excludeShopifyWebhookEndpoint(
	// 		express.json({limit: "1000mb", extended: true})
	// 	)
	// );
	applyAuthMiddleware(app, {
		billing: billingSettings,
	});
	app.get("/api/bar_collection/get_by_ShopId/:id", async (req, res) => {
		try {
			const id = req.params.id;
			const data = await fetch(`${host}/bar_collection/get_by_ShopId/${id}`, {
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
			}).then(resp => resp.json());

			res.json(data);
		} catch (e) {
			res.send(e);
		}
	});
	app.post("/api/bar_collection/update/:id", async (req, res) => {
		try {
			const id = req.params.id;
			await fetch(`${host}/bar_collection/update/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
				body: JSON.stringify(req.body),
			});
			res.sendStatus(200);
		} catch (e) {
			res.send(e);
		}
	});
	app.get("/api/currency-code", async (req, res) => {
		try {
			const response = await fetch(`${host}/currency-code`, {
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
			});
			const data = await response.json();
			res.send(data);
		} catch (e) {
			res.send(e);
		}
	});
	app.post("/api/bar_collection/billing/:id", async (req, res) => {
		try {
			const id = req.params.id;
			await fetch(`${host}/bar_collection/billing/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
				body: JSON.stringify(req.body),
			});
			res.sendStatus(200);
		} catch (e) {
			res.send(e);
		}
	});
	app.post("/api/bar_collection/add", async (req, res) => {
		try {
			await fetch(`${host}/bar_collection/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
				body: JSON.stringify(req.body),
			});
			res.sendStatus(200);
		} catch (e) {
			res.status(500).send(e);
		}
	});
	app.post("/api/webhooks", async (req, res) => {
		try {
			await Shopify.Webhooks.Registry.process(req, res);
			console.log(`Webhook processed, returned status code 200`);
		} catch (error) {
			console.log(`Failed to process webhook: ${error}`);
			if (!res.headersSent) {
				res.status(500).send(error.message);
			}
		}
	});

	// All endpoints after this point will require an active session
	app.use(
		"/api/*",
		verifyRequest(app, {
			billing: billingSettings,
		})
	);

	const getShopData = async (accessToken, shop) => {
		try {
			const url = `https://${shop}/admin/api/2021-04/shop.json`;
			const shopifyHeader = token => ({
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": token,
			});
			const result = await axios.get(url, {
				headers: shopifyHeader(accessToken),
			});
			return result.data;
		} catch (err) {
			console.log("err", err);
		}
	};

	const getCustomerData = async (accessToken, shop) => {
		try {
			const url = `https://${shop}/admin/api/2021-04/customers.json`;
			const shopifyHeader = token => ({
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": token,
			});
			const result = await axios.get(url, {
				headers: shopifyHeader(accessToken),
			});
			return result.data;
		} catch (err) {
			console.log("err", err);
		}
	};

	const getBillingData = async (accessToken, shop) => {
		try {
			const url = `https://${shop}/admin/api/2021-04/recurring_application_charges.json`;
			const shopifyHeader = token => ({
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": token,
			});
			const result = await axios.get(url, {
				headers: shopifyHeader(accessToken),
			});
			return result.data;
		} catch (err) {
			console.log("err", err);
		}
	};

	const createBill = async (accessToken, shop) => {
		try {
			const url = `https://${shop}/admin/api/2021-04/recurring_application_charges.json`;
			const header = token => ({
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": token,
			});
			const body = JSON.stringify({
				recurring_application_charge: {
					name: "AFS",
					price: 10.0,
					return_url: `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/`,
					test: true,
					trial_days: 1,
				},
			});
			await axios
				.post(url, body, {headers: header(accessToken)})
				.then(response => {
					return response.data;
				})
				.catch(error => console.log(error));
		} catch (err) {
			console.log("Error", err);
		}
	};

	const deleteBill = async (accessToken, shop, bill_id) => {
		try {
			const url = `https://${shop}/admin/api/2021-04/recurring_application_charges/${bill_id}.json`;
			const header = token => ({
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": token,
			});
			await axios
				.delete(url, {headers: header(accessToken)})
				.then(response => {
					return response.data;
				})
				.catch(error => console.log(error));
		} catch (err) {
			console.log("Error", err);
		}
	};

	app.get("/api/shop-data", async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const data = await getShopData(session.accessToken, session.shop);
		res.status(200).send(data);
	});

	app.get("/api/billing-data", verifyRequest(app), async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const data = await getBillingData(session.accessToken, session.shop);
		// console.log("data", data);
		res.status(200).send(data);
	});

	app.get("/api/create-billing", verifyRequest(app), async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const createBilling = await createBill(session.accessToken, session.shop);
		res.status(200).send(createBilling);
	});

	app.post("/api/delete-billing", verifyRequest(app), async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const deleteBilling = await deleteBill(
			session.accessToken,
			session.shop,
			req.body.bill_id
		);
		console.log("deleteBill", deleteBilling);
		res.send(deleteBilling);
	});

	app.get("/api/products-count", async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const {Product} = await import(
			`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
		);
		const countData = await Product.count({session});
		res.status(200).send(countData);
	});

	app.get("/api/customer-data", async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		const data = await getCustomerData(session.accessToken, session.shop);
		res.status(200).send(data);
	});

	app.put("/api/post-this-image", async (req, res) => {
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res);
			const {Theme} = await import(
				`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
			);
			const themes = await Theme.all({
				session: session,
			});
			const mainTheme = themes.filter(el => el.role === "main");
			const {Asset} = await import(
				`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
			);
			const asset = new Asset({session: session});
			asset.theme_id = mainTheme[0].id;
			asset.key = `assets/${req.body.name}`;
			asset.attachment = req.body.string;
			await asset.save({});
			const data = await Asset.all({
				session: session,
				theme_id: mainTheme[0].id,
				asset: {key: asset.key},
			});
			res.status(200).send(data);
		} catch (error) {
			res.status(500).send(error.message);
		}
	});

	app.post("/api/graphql", async (req, res) => {
		try {
			const response = await Shopify.Utils.graphqlProxy(req, res);
			res.status(200).send(response.body);
		} catch (error) {
			res.status(500).send(error.message);
		}
	});

	app.use((req, res, next) => {
		const shop = req.query.shop;
		if (Shopify.Context.IS_EMBEDDED_APP && shop) {
			res.setHeader(
				"Content-Security-Policy",
				`frame-ancestors https://${shop} https://admin.shopify.com;`
			);
		} else {
			res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
		}
		next();
	});

	if (isProd) {
		const compression = await import("compression").then(({default: fn}) => fn);
		const serveStatic = await import("serve-static").then(
			({default: fn}) => fn
		);
		app.use(compression());
		app.use(serveStatic(PROD_INDEX_PATH));
	}

	app.use("/*", async (req, res, next) => {
		const shop = req.query.shop;
		// Detect whether we need to reinstall the app, any request from Shopify will
		// include a shop in the query parameters.
		if (app.get("active-shopify-shops")[shop] === undefined && shop) {
			res.redirect(`/api/auth?shop=${shop}`);
		} else {
			// res.set('X-Shopify-App-Nothing-To-See-Here', '1');
			const fs = await import("fs");
			const fallbackFile = join(
				isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
				"index.html"
			);
			res
				.status(200)
				.set("Content-Type", "text/html")
				.send(fs.readFileSync(fallbackFile));
		}
	});

	return {app};
}

if (!isTest) {
	createServer().then(({app}) => app.listen(PORT));
}

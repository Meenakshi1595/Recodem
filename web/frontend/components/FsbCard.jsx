import "./FsbCard.css";

import {
	Button,
	Card,
	Form,
	FormLayout,
	Frame,
	SettingToggle,
	TextStyle,
	Toast,
	VisuallyHidden,
	hsbToHex,
} from "@shopify/polaris";
import {useCallback, useEffect, useState} from "react";

import {ContentConfiguration} from "./ContentConfiguration";
import {CustomerTargeting} from "./CustomerTargeting";
import {LoadingSpinner} from "./LoadingSpinner";
import {Guidelines} from "./Guidelines";
import {PageTargeting} from "./PageTargeting";
import {PreviewBlock} from "./PreviewBlock";
import {StyleConfiguration} from "./StyleConfiguration";
import {Contact} from "./Contact";
import WebFont from "webfontloader";
import getSymbolFromCurrency from "currency-symbol-map";
import hexToHsl from "hex-to-hsl";
import {useAppBridge} from "@shopify/app-bridge-react";
import {useAuthenticatedFetch} from "../hooks/useAuthenticatedFetch";

export function FsbCard() {
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submit1Loading, setSubmit1Loading] = useState(false);
	const [fetchLoading, setFetchLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [fsbText, setFsbText] = useState("My Bar");
	const [active, setActive] = useState(false);
	const [freeShippingGoal, setFreeShippingGoal] = useState(10);
	const [secondaryFreeShippingGoal, setSecondaryFreeShippingGoal] = useState(0);
	const [initialMsgText_1, setInitialMsgText_1] = useState("");
	const [initialMsgText_2, setInitialMsgText_2] = useState("");
	const [progressMsgText_1, setProgressMsgText_1] = useState("");
	const [progressMsgText_2, setProgressMsgText_2] = useState("");
	const [secondaryMsgText_1, setSecondaryMsgText_1] = useState("");
	const [secondaryMsgText_2, setSecondaryMsgText_2] = useState("");
	const [successMsg, setSuccessMsg] = useState(
		"Congratulations,You Got Free Shipping !"
	);
	const [imgUrl, setImgUrl] = useState("");
	const [currencySymbol, setCurrencySymbol] = useState("");
	const [selected, setSelected] = useState("select");
	const [displayAllPage, setDisplayAllPage] = useState(true);
	const [pageTargetValue, setPageTargetValue] = useState("all_page");
	const [pageTarget, setPageTarget] = useState("");
	const [pageTargetPath, setPageTargetPath] = useState("/");
	const [displayAllCust, setDisplayAllCust] = useState(true);
	const [customerTargetValue, setCustomerTargetValue] =
		useState("customer_all");
	const [customerTarget, setCustomerTarget] = useState("");
	const [customerTags, setCustomerTags] = useState("");
	const [customerSpent, setCustomerSpent] = useState();
	const [shop_id, setShop_id] = useState(0);
	const [shop_domain, setShop_domain] = useState("");
	const [shopObjectId, setShopObjectId] = useState("");
	const [userExists, setUserExists] = useState(false);
	const [premiumUser, setPremiumUser] = useState(false);
	const [rejectedFiles, setRejectedFiles] = useState([]);
	const hasError = rejectedFiles.length > 0;
	const [linkURL, setLinkURL] = useState("");
	const [linkSelected, setLinkSelected] = useState("off");
	const [currencySymbolPosition, setCurrencySymbolPosition] =
		useState("before");
	const [countryCurrencyData, setCountryCurrencyData] = useState({});
	const [checkEmptyFields, setCheckEmptyFields] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState("");
	const [backgroundHsl, setBackgroundHsl] = useState({
		hue: 171,
		brightness: 0.95,
		saturation: 0.5375,
	});
	const [textHsl, setTextHsl] = useState({
		hue: 120,
		brightness: 0,
		saturation: 0,
	});
	const [textColor, setTextColor] = useState("");
	const [specialTextColor, setSpecialTextColor] = useState("");
	const [specialTextHsl, setSpecialTextHsl] = useState({
		hue: 221,
		brightness: 63,
		saturation: 0,
	});
	const [font, setFont] = useState("");
	const [fontSize, setFontSize] = useState(20);
	const [bgpressed, setBgPressed] = useState(true);
	const [txtpressed, setTxtPressed] = useState(true);
	const [splTxtpressed, setSplTxtPressed] = useState(true);
	const [billingUrl, setBillingUrl] = useState();
	const [activate, setActivate] = useState(false);
	const app = useAppBridge();
	const newfetch = useAuthenticatedFetch(app);

	const handleToggle = useCallback(
		() => setActivate(activate => !activate),
		[]
	);

	const contentStatus = activate ? "Deactivate" : "Activate";

	const toggleActive = useCallback(() => setActive(active => !active), []);

	let toastMarkup =
		(active && userExists && !checkEmptyFields && (
			<Toast
				content="Free Shipping Bar Updated"
				onDismiss={toggleActive}
				duration={2500}
			/>
		)) ||
		(active && !userExists && !checkEmptyFields && (
			<Toast
				content="Free Shipping Bar Created"
				onDismiss={toggleActive}
				duration={3500}
			/>
		)) ||
		(active && checkEmptyFields && (
			<Toast
				content="Please Enter Valid Credentials"
				error
				onDismiss={toggleActive}
				duration={3500}
			/>
		));

	const handleLinkSelectChange = useCallback(
		value => setLinkSelected(value),
		[]
	);

	const handleLinkURLChange = useCallback(value => setLinkURL(value), []);

	const handleDropZoneDrop = useCallback(
		(_dropFiles, acceptedFiles, _rejectedFiles) => {
			var reader = new FileReader();
			const name = acceptedFiles[0].name.replace(/ /g, "_");
			reader.onload = function () {
				const base64String = reader.result
					.replace("data:", "")
					.replace(/^.+,/, "");
				postImage(base64String, name);
				console.log("print this");
			};
			reader.readAsDataURL(acceptedFiles[0]);
		}
	);

	const postImage = useCallback(async (string, name) => {
		setImageLoading(true);
		const body = JSON.stringify({string: string, name: name});
		const response = await newfetch("/api/post-this-image", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body,
		});
		const data = await response.json();
		console.log("data", data);
		setImgUrl(data[0].public_url);
		setImageLoading(false);
	});

	const postbill = useCallback(async () => {
		const shopId = await newfetch("/api/shop-data").then(async res => {
			const data = await res.json();
			return data.shop.id.toString();
		});
		const bill = await newfetch(`/api/bar_collection/get_by_ShopId/${shopId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(res => res.json())
			.then(data => data[0].billing_ids[0]);
		const body = JSON.stringify({bill_id: bill});
		const response = await newfetch("/api/delete-billing", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body,
		});
		await response.json();
	});

	const fsbTextChange = useCallback(value => setFsbText(value), []);

	const freeShippingGoalChange = useCallback(value => {
		setFreeShippingGoal(value);
	}, []);

	const secondaryFreeShippingGoalChange = useCallback(
		value => setSecondaryFreeShippingGoal(value),
		[]
	);

	const selectedChange = useCallback(value => {
		setCurrencySymbol(getSymbolFromCurrency(value));
		setSelected(value);
	}, []);

	const currencySymbolPositionChange = useCallback(
		value => setCurrencySymbolPosition(value),
		[]
	);

	const currencySymbolChange = useCallback(
		value => setCurrencySymbol(value),
		[]
	);

	const initialMsgText_1Change = useCallback(
		value => setInitialMsgText_1(value),
		[]
	);
	const initialMsgText_2Change = useCallback(
		value => setInitialMsgText_2(value),
		[]
	);
	const progressMsgText_1Change = useCallback(
		value => setProgressMsgText_1(value),
		[]
	);
	const progressMsgText_2Change = useCallback(
		value => setProgressMsgText_2(value),
		[]
	);
	const secondaryMsgText_1Change = useCallback(
		value => setSecondaryMsgText_1(value),
		[]
	);
	const secondaryMsgText_2Change = useCallback(
		value => setSecondaryMsgText_2(value),
		[]
	);
	const successMsgChange = useCallback(value => {
		setSuccessMsg(value);
	}, []);

	const selectFontChange = buttonLabel => {
		setFont(buttonLabel);
	};

	const selectFontSize = useCallback(value => setFontSize(value), []);

	const backgroundChange = useCallback(value => {
		setBackgroundHsl(value);
		const hexCode = hsbToHex(value);
		setBackgroundColor(hexCode);
	}, []);

	const textChange = useCallback(value => {
		setTextHsl(value);
		const hexCode = hsbToHex(value);
		setTextColor(hexCode);
	}, []);

	const specialTextChange = useCallback(value => {
		setSpecialTextHsl(value);
		const hexcode = hsbToHex(value);
		setSpecialTextColor(hexcode);
	});

	function setFontConfig(background_color, text_color, special_text_color) {
		const bg = hexToHsl(background_color);
		const txt = hexToHsl(text_color);
		const spcl = hexToHsl(special_text_color);
		setBackgroundHsl({
			hue: bg[0],
			brightness: bg[1],
			saturation: bg[2],
		});
		setTextHsl({
			hue: txt[0],
			brightness: txt[1],
			saturation: txt[2],
		});
		setSpecialTextHsl({
			hue: spcl[0],
			brightness: spcl[1],
			saturation: spcl[2],
		});
	}

	const pageTargetChange = useCallback((_checked, newValue) => {
		setPageTargetValue(newValue);
		if (newValue !== "all_page") {
			setDisplayAllPage(false);
			if (newValue === "home_page") {
				setPageTargetPath("/");
				setPageTarget("home_page");
			} else if (newValue === "cart_page") {
				setPageTargetPath("/cart");
				setPageTarget("cart_page");
			} else if (newValue === "pdp") {
				setPageTargetPath("/products/");
				setPageTarget("pdp");
			} else {
				console.log("Page Target Error");
			}
		} else if (newValue === "all_page") {
			setDisplayAllPage(true);
			setPageTarget("all_page");
			setPageTargetPath("/");
		}
	}, []);

	const customerTargetChange = useCallback((_checked, newValue) => {
		setCustomerTargetValue(newValue);
		ShowHideDiv(newValue);

		if (newValue !== "customer_all") {
			setDisplayAllCust(false);
			if (newValue === "customer_sub") {
				setCustomerTarget("customer_sub");
			} else if (newValue === "customer_tag") {
				setCustomerTarget("customer_tag");
			} else if (newValue === "customer_spent") {
				setCustomerTarget("customer_spent");
			} else {
				console.log("Page Target Error");
			}
		} else if (newValue === "customer_all") {
			setDisplayAllCust(true);
			setCustomerTarget("customer_all");
		}
	}, []);
	function ShowHideDiv(newValue) {
		if (newValue === "customer_tag") {
			document.getElementById("dvtext-customer_tag").style.display = "block";
			document.getElementById("dvtext-customer_spent").style.display = "none";
		} else if (newValue === "customer_spent") {
			document.getElementById("dvtext-customer_spent").style.display = "block";
			document.getElementById("dvtext-customer_tag").style.display = "none";
		} else {
			document.getElementById("dvtext-customer_tag").style.display = "none";
			document.getElementById("dvtext-customer_spent").style.display = "none";
		}
	}

	const handleSubmit = useCallback(
		async _event => {
			setSubmitLoading(true);

			let requiredFieldArray = [
				"fsb_title",
				"goal_amount",
				"success_msg",
				"currency",
			];
			const newBar = {
				shop_id: shop_id,
				shop_domain: shop_domain,
				fsb_title: fsbText,
				goal_amount: freeShippingGoal,
				secondary_goal_amount: secondaryFreeShippingGoal,
				initial_msg1: initialMsgText_1,
				initial_msg2: initialMsgText_2,
				progress_msg1: progressMsgText_1,
				progress_msg2: progressMsgText_2,
				secondary_msg_text1: secondaryMsgText_1,
				secondary_msg_text2: secondaryMsgText_2,
				success_msg: successMsg,
				img_url: imgUrl,
				currency: currencySymbol,
				country: selected,
				display_in_all_pages: displayAllPage,
				page_target: pageTargetValue,
				page_target_path: pageTargetPath,
				display_to_all_customers: displayAllCust,
				premium_user: false,
				customer_target: customerTargetValue,
				currency_symbol_position: currencySymbolPosition,
				redirectLink: linkURL,
				linkSelected,
				background_color: backgroundColor,
				text_color: textColor,
				special_text_color: specialTextColor,
				font: font,
				font_size: fontSize,
				activate_bar: activate,
				customer_spent: customerSpent,
				customer_tags: customerTags,
			};
			let check = true;
			Object.keys(newBar).map(key => {
				if (requiredFieldArray.includes(key) && !newBar[key]) {
					check = false;
				} else if (newBar["goal_amount"] <= 0) {
					check = false;
				} else if (
					newBar["secondary_goal_amount"] &&
					premiumUser &&
					newBar["secondary_goal_amount"] * 1 <= newBar["goal_amount"] * 1
				) {
					check = false;
				}
			});
			if (!check) {
				setCheckEmptyFields(true);
				return;
			} else {
				setCheckEmptyFields(false);
				try {
					await newfetch(`/api/bar_collection/add`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newBar),
					});
					setUserExists(true);
				} catch (err) {
					console.log(err);
				}
			}
			setSubmitLoading(false);
		},
		[
			fsbText,
			freeShippingGoal,
			secondaryFreeShippingGoal,
			currencySymbol,
			selected,
			initialMsgText_1,
			initialMsgText_2,
			progressMsgText_1,
			progressMsgText_2,
			secondaryMsgText_1,
			secondaryMsgText_2,
			successMsg,
			imgUrl,
			displayAllPage,
			pageTarget,
			pageTargetPath,
			displayAllCust,
			customerTarget,
			customerSpent,
			customerTags,
			currencySymbolPosition,
			checkEmptyFields,
			linkURL,
			linkSelected,
			backgroundColor,
			textColor,
			specialTextColor,
			font,
			fontSize,
			activate,
		]
	);
	const getMerchantsFSBData = async id => {
		setFetchLoading(true);
		try {
			const data = await newfetch(`/api/bar_collection/get_by_ShopId/${id}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const output = await data.json();
			if (output.length > 0) {
				setShopObjectId(output[0]._id);
				if (output[0]?.premium_user) {
					setPremiumUser(true);
				}
				if (output && output?.length > 0) {
					resetForm(output);
				}
				setFetchLoading(false);
			} else {
				setFetchLoading(false);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const resetForm = output => {
		if (output && output?.length > 0) {
			const input = output[0];
			setUserExists(true);
			setFsbText(input.fsb_title);
			setFreeShippingGoal(input.goal_amount);
			setSecondaryFreeShippingGoal(input.secondary_goal_amount);
			setCurrencySymbol(input.currency);
			setSelected(input.country);
			setInitialMsgText_1(input.initial_msg1);
			setInitialMsgText_2(input.initial_msg2);
			setProgressMsgText_1(input.progress_msg1);
			setProgressMsgText_2(input.progress_msg2);
			setSecondaryMsgText_1(input.secondary_msg_text1);
			setSecondaryMsgText_2(input.secondary_msg_text2);
			setSuccessMsg(input.success_msg);
			setImgUrl(input.img_url);
			setDisplayAllPage(input.display_in_all_pages);
			setPageTargetValue(input.page_target);
			setPageTargetPath(input.page_target_path);
			setDisplayAllCust(input.display_to_all_customers);
			setCustomerTargetValue(input.customer_target);
			setCustomerTarget(input.customer_target);
			setCustomerSpent(input.customer_spent);
			setCustomerTags(input.customer_tags);
			setLinkURL(input.redirectLink);
			setLinkSelected(input.linkSelected);
			setCurrencySymbolPosition(input.currency_symbol_position);
			setBackgroundColor(input.background_color);
			setTextColor(input.text_color);
			setSpecialTextColor(input.special_text_color);
			setFontConfig(
				input.background_color,
				input.text_color,
				input.special_text_color
			);
			setFont(input.font);
			setFontSize(input.font_size);
			setActivate(input.activate_bar);
		}
	};

	const handleSubmit1 = useCallback(
		async _event => {
			setSubmit1Loading(true);
			let requiredFieldArray = [
				"fsb_title",
				"goal_amount",
				"success_msg",
				"currency",
			];
			let id = shopObjectId;
			const newBar = {
				shop_id: shop_id,
				shop_domain: shop_domain,
				fsb_title: fsbText,
				goal_amount: freeShippingGoal,
				secondary_goal_amount: secondaryFreeShippingGoal,
				initial_msg1: initialMsgText_1,
				initial_msg2: initialMsgText_2,
				progress_msg1: progressMsgText_1,
				progress_msg2: progressMsgText_2,
				secondary_msg_text1: secondaryMsgText_1,
				secondary_msg_text2: secondaryMsgText_2,
				success_msg: successMsg,
				img_url: imgUrl,
				currency: currencySymbol,
				country: selected,
				display_in_all_pages: displayAllPage,
				page_target: pageTargetValue,
				page_target_path: pageTargetPath,
				display_to_all_customers: displayAllCust,
				customer_target: customerTargetValue,
				customer_spent: customerSpent,
				customer_tags: customerTags,
				redirectLink: linkURL,
				linkSelected,
				currency_symbol_position: currencySymbolPosition,
				background_color: backgroundColor,
				text_color: textColor,
				special_text_color: specialTextColor,
				font: font,
				font_size: fontSize,
				activate_bar: activate,
			};
			let check = true;
			Object.keys(newBar).map(key => {
				if (requiredFieldArray.includes(key) && !newBar[key]) {
					check = false;
				} else if (newBar["goal_amount"] <= 0) {
					check = false;
				} else if (
					newBar["secondary_goal_amount"] &&
					premiumUser &&
					newBar["secondary_goal_amount"] * 1 <= newBar["goal_amount"] * 1
				) {
					check = false;
				}
			});
			if (!check) {
				setCheckEmptyFields(true);
				return;
			} else {
				setCheckEmptyFields(false);
				try {
					await newfetch(`/api/bar_collection/update/${id}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newBar),
					});
				} catch (error) {
					console.log(error);
				}
			}
			setSubmit1Loading(false);
		},
		[
			fsbText,
			freeShippingGoal,
			secondaryFreeShippingGoal,
			currencySymbol,
			selected,
			initialMsgText_1,
			initialMsgText_2,
			progressMsgText_1,
			progressMsgText_2,
			secondaryMsgText_1,
			secondaryMsgText_2,
			successMsg,
			imgUrl,
			activate,
			displayAllPage,
			pageTarget,
			pageTargetPath,
			displayAllCust,
			customerTarget,
			customerSpent,
			customerTags,
			currencySymbolPosition,
			linkURL,
			linkSelected,
			backgroundColor,
			textColor,
			specialTextColor,
			font,
			fontSize,
		]
	);

	const getShopData = useCallback(async () => {
		await newfetch("/api/shop-data").then(async res => {
			const data = await res.json();
			const shopId = data.shop.id.toString();
			const shopDomain = data.shop.myshopify_domain;
			setShop_domain(shopDomain);
			setShop_id(shopId);
			getMerchantsFSBData(shopId);
		});
	});

	const getBillingData = useCallback(async () => {
		await newfetch("/api/billing-data").then(async res => {
			let data = await res.json();
			data = data.recurring_application_charges;

			if (
				data.length < 1 ||
				data[0].status === "expired" ||
				data[0].status === "declined" ||
				data[0].status === "cancelled"
			) {
				await newfetch("/api/create-billing").then(async res => {
					data = await res.json();
					data = data.recurring_application_charges;
				});
			}
			if (data[0].status === "active" || data[0].status === "accepted") {
				let bill_id;
				if (new Date(data[0].trial_days).getTime() > new Date().getTime()) {
					bill_id = {
						billing_id: data[0].id,
						premium_user: true,
						trial_days: true,
					};
				} else {
					bill_id = {
						billing_id: data[0].id,
						premium_user: true,
						trial_days: false,
					};
				}
				await newfetch(`/api/bar_collection/billing/${shopObjectId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bill_id),
				}).catch(err => {
					console.log(err);
				});
			} else if (data[0].status === "pending") {
				let bill_id;
				if (new Date(data[0].trial_days).getTime() > new Date().getTime()) {
					bill_id = {
						billing_id: data[0].id,
						premium_user: true,
						trial_days: true,
					};
				} else {
					bill_id = {
						billing_id: data[0].id,
						premium_user: false,
						trial_days: false,
					};
				}
				await newfetch(`/api/bar_collection/billing/${shopObjectId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bill_id),
				}).catch(err => {
					console.log(err);
				});
				setBillingUrl(data[0].confirmation_url);
			} else {
				setBillingUrl(data[0].confirmation_url);
			}
		});
	});

	const getCountryCurrencyData = async () => {
		const data1 = await newfetch("/api/currency-code");
		const result = await data1.json();
		setCountryCurrencyData(result.currencyCode);
	};

	const out = myObject =>
		Object.keys(myObject).map(function (key, index) {
			return {label: `${myObject[key]} | ${key}`, value: key};
		});

	let countryCurrencyDatas = out(countryCurrencyData);

	const fonts = [
		"Lato",
		"Roboto",
		"Josefin Sans",
		"Lobster",
		"Open Sans",
		"Poiret One",
		"Dancing Script",
		"Bangers",
		"Playfair Display",
		"Chewy",
		"Quicksand",
		"Great Vibes",
		"Righteous",
		"Crafty Girls",
		"Mystery Quest",
		"Montserrat",
		"Oswald",
		"Unica One",
		"Mulish",
		"Raleway",
		"Carter One",
		"Varela Round",
		"Julius Sans One",
	];

	const fontsizes = [
		{label: "18", value: "18px"},
		{label: "19", value: "19px"},
		{label: "20", value: "20px"},
		{label: "21", value: "21px"},
		{label: "22", value: "22px"},
		{label: "23", value: "23px"},
		{label: "24", value: "24px"},
	];

	useEffect(() => {
		WebFont.load(
			{
				google: {
					families: fonts,
				},
			},
			[]
		);
		getShopData();
		getCountryCurrencyData();
		getBillingData();
	}, [shop_id, shopObjectId, userExists]);
	return (
		<Frame>
			{imageLoading || fetchLoading || submit1Loading || submitLoading ? (
				<LoadingSpinner />
			) : (
				<div></div>
			)}
			<Guidelines />
			<br />
			<Card sectioned>
				{toastMarkup}
				<VisuallyHidden>
					<Button onClick={postbill}>Cancel Billing</Button>
				</VisuallyHidden>
				<SettingToggle
					action={{
						content: contentStatus,
						onAction: handleToggle,
					}}
					enabled={activate}
				>
					<TextStyle variation="strong">{fsbText}</TextStyle>.
				</SettingToggle>
				<br />
				<Form onSubmit={userExists ? handleSubmit1 : handleSubmit}>
					<FormLayout>
						<ContentConfiguration
							fsbText={fsbText}
							fsbTextChange={fsbTextChange}
							freeShippingGoal={freeShippingGoal}
							freeShippingGoalChange={freeShippingGoalChange}
							secondaryFreeShippingGoal={secondaryFreeShippingGoal}
							secondaryFreeShippingGoalChange={secondaryFreeShippingGoalChange}
							initialMsgText_1={initialMsgText_1}
							initialMsgText_1Change={initialMsgText_1Change}
							initialMsgText_2={initialMsgText_2}
							initialMsgText_2Change={initialMsgText_2Change}
							progressMsgText_1={progressMsgText_1}
							progressMsgText_1Change={progressMsgText_1Change}
							progressMsgText_2={progressMsgText_2}
							progressMsgText_2Change={progressMsgText_2Change}
							secondaryMsgText_1={secondaryMsgText_1}
							secondaryMsgText_1Change={secondaryMsgText_1Change}
							secondaryMsgText_2={secondaryMsgText_2}
							secondaryMsgText_2Change={secondaryMsgText_2Change}
							countryCurrencyDatas={countryCurrencyDatas}
							currencySymbolPosition={currencySymbolPosition}
							currencySymbolPositionChange={currencySymbolPositionChange}
							successMsg={successMsg}
							successMsgChange={successMsgChange}
							premiumUser={premiumUser}
							selected={selected}
							selectedChange={selectedChange}
							handleDropZoneDrop={handleDropZoneDrop}
							linkSelected={linkSelected}
							handleLinkSelectChange={handleLinkSelectChange}
							currencySymbol={currencySymbol}
							currencySymbolChange={currencySymbolChange}
							imgUrl={imgUrl}
							setImgUrl={setImgUrl}
							linkURL={linkURL}
							handleLinkURLChange={handleLinkURLChange}
							hasError={hasError}
							rejectedFiles={rejectedFiles}
							imageLoading={imageLoading}
							billingUrl={billingUrl}
						/>
						<StyleConfiguration
							selectFontChange={selectFontChange}
							selectFontSize={selectFontSize}
							backgroundChange={backgroundChange}
							textChange={textChange}
							specialTextChange={specialTextChange}
							setBackgroundColor={setBackgroundColor}
							backgroundColor={backgroundColor}
							backgroundHsl={backgroundHsl}
							textHsl={textHsl}
							setTextColor={setTextColor}
							textColor={textColor}
							setSpecialTextColor={setSpecialTextColor}
							specialTextColor={specialTextColor}
							specialTextHsl={specialTextHsl}
							font={font}
							fontSize={fontSize}
							bgpressed={bgpressed}
							txtpressed={txtpressed}
							splTxtpressed={splTxtpressed}
							fonts={fonts}
							fontsizes={fontsizes}
							setBgPressed={setBgPressed}
							setTxtPressed={setTxtPressed}
							setSplTxtPressed={setSplTxtPressed}
						/>
						<Card title="Targeting Configuration" sectioned>
							<PageTargeting
								premiumUser={premiumUser}
								pageTargetValue={pageTargetValue}
								pageTargetChange={pageTargetChange}
								billingUrl={billingUrl}
							/>
							<CustomerTargeting
								premiumUser={premiumUser}
								customerTargetValue={customerTargetValue}
								customerTargetChange={customerTargetChange}
								billingUrl={billingUrl}
								setCustomerTags={setCustomerTags}
								customerTags={customerTags}
								customerSpent={customerSpent}
								setCustomerSpent={setCustomerSpent}
							/>
						</Card>
						{freeShippingGoal > 0 && (
							<PreviewBlock
								initialMsgText_1={initialMsgText_1}
								currencySymbol={currencySymbol}
								freeShippingGoal={freeShippingGoal}
								initialMsgText_2={initialMsgText_2}
								progressMsgText_1={progressMsgText_1}
								progressMsgText_2={progressMsgText_2}
								successMsg={successMsg}
								imgUrl={imgUrl}
								currencySymbolPosition={currencySymbolPosition}
								textColor={textColor}
								specialTextColor={specialTextColor}
								font={font}
								premiumUser={premiumUser}
								fontSize={fontSize}
								backgroundColor={backgroundColor}
							/>
						)}
						<Button submit onClick={toggleActive}>
							{userExists ? "Update" : "Submit"}
						</Button>
					</FormLayout>
				</Form>
			</Card>
			<Contact />
		</Frame>
	);
}

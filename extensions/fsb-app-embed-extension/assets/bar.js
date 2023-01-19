const getFreeShippingBarData = async () => {
	try {
		const getShopJsonData = async () => {
			const data = await fetch("/admin/api/2022-04/shop.json", {
				method: "GET",
				headers: {
					"content-Type": "application/json",
					"ngrok-skip-browser-warning": true,
				},
			});
			const result = await data.json();
			const shopJson = result.shop;
			return shopJson;
		};
		const shopJson = await getShopJsonData();
		const currencyApi = await fetch(`/apps/fsb/currency-api`, {
			headers: {
				"ngrok-skip-browser-warning": true,
			},
		});
		const currency = await currencyApi.json();
		const cartAmount = await fetch(`/cart.js`)
			.then(response => response.json())
			.then(data => data.total_price / 100);

		// let cartValue = cartAmount ;
		const fsbRender = document.getElementById("fsb-render");
		const fsb = document.getElementById("fsb");
		const customer_id = document.getElementById("customer-details");
		const shopId = shopJson.id.toString();
		const data = await fetch(
			`/apps/fsb/bar_collection/get_by_ShopId/${shopId}`,
			{
				method: "GET",
				headers: {
					"content-Type": "application/json",
					"ngrok-skip-browser-warning": true, //the intention of this header is to prevent the 'abuse warning screen' of ngrok, it will be deleted once the server url is updated
				},
			}
		);
		const FSBData = await data.json();
		const myData = FSBData[0];
		console.log("test", myData, FSBData);
		const render = myData => {
			myData.premium_user &&
				myData.img_url &&
				(fsb.style.backgroundImage = `url(${myData.img_url})`) &&
				(fsb.style.backgroundRepeat = "no-repeat") &&
				(fsb.style.backgroundSize = "cover");

			fsbRender.style.fontFamily = myData.font;
			fsbRender.style.fontSize = myData.font_size;
			fsb.style.backgroundColor = myData.background_color;
			fsb.style.color = myData.text_color;
			const shopCurrencyCode = shopJson.currency;
			const merchantCurrencyCode = myData.country;

			const getExchangeRate = (
				shopCurrencyCode,
				merchantCurrencyCode,
				cartAmount
			) => {
				const displayResults = currency => {
					let cartVal;
					if (shopCurrencyCode !== merchantCurrencyCode) {
						let fromRate = currency.rates[shopCurrencyCode];
						let toRate = currency.rates[merchantCurrencyCode];
						cartVal = ((toRate / fromRate) * cartAmount).toFixed(2);
					} else {
						cartVal = cartAmount;
					}
					return cartVal;
				};
				cartValueRes = displayResults(currency);
				return cartValueRes;
			};

			const cartValue = getExchangeRate(
				shopCurrencyCode,
				merchantCurrencyCode,
				cartAmount
			);
			console.log("cartvalue", cartValue);
			let html;

			if (cartValue == 0) {
				html =
					myData.currency_symbol_position === "before"
						? `${myData.initial_msg1} <a style="color: ${myData.special_text_color}"> ${myData.currency} ${myData.goal_amount} </a>${myData.initial_msg2} `
						: `${myData.initial_msg1} <a style="color: ${myData.special_text_color}"> ${myData.goal_amount} ${myData.currency} </a> ${myData.initial_msg2} `;
			} else if (Number(cartValue) < Number(myData.goal_amount)) {
				html =
					myData.currency_symbol_position === "before"
						? `${myData.progress_msg1} <a style="color: ${
								myData.special_text_color
						  }">
 						${myData.currency} ${(Number(myData.goal_amount) - cartValue).toFixed(
								2
						  )} </a>${myData.progress_msg2}`
						: `${myData.progress_msg1} <a style="color: ${
								myData.special_text_color
						  }">
  						${(Number(myData.goal_amount) - cartValue).toFixed(2)} ${
								myData.currency
						  } </a> ${myData.progress_msg2}`;
			} else if (
				myData.premium_user &&
				Number(cartValue) >= myData.goal_amount &&
				(myData.secondary_goal_amount != 0 ||
					myData.secondary_goal_amount != null) &&
				Number(cartValue) < myData.secondary_goal_amount
			) {
				html =
					myData.currency_symbol_position === "before"
						? `${myData.secondary_msg_text1} <a style="color: ${
								myData.special_text_color
						  }">
 							${myData.currency} ${(
								Number(myData.secondary_goal_amount) - cartValue
						  ).toFixed(2)}  </a>${myData.secondary_msg_text2}`
						: `${myData.secondary_msg_text1} <a style="color: ${
								myData.special_text_color
						  }">
  							${(Number(myData.secondary_goal_amount) - cartValue).toFixed(2)} ${
								myData.currency
						  } </a> ${myData.secondary_msg_text2}`;
			} else if (Number(cartValue) >= Number(myData.secondary_goal_amount)) {
				html = myData.success_msg;
			}

			fsb.addEventListener("click", e => {
				e.preventDefault();
				myData.linkSelected === "on" &&
					(document.location.href = myData.redirectLink);
			});
			html ? (fsbRender.innerHTML = html) : (fsb.style.display = "none");
		};

		const pageValidation =
			myData.display_in_all_pages === true ||
			(myData.page_target_path === "/products/" &&
				window.location.pathname.includes(myData.page_target_path)) ||
			window.location.pathname === myData.page_target_path;
		const compare = (arr1, arr2) => {
			const fre2 = {};
			arr2.forEach(e => (fre2[e] = ++fre2[e] || 1));
			const result = arr1.filter(key => {
				if (fre2[key]) {
					return key;
				}
			});
			return result;
		};

		const getShopData = async () => {
			const data2 = await fetch(
				`/admin/api/2022-04/customers/${customer_id.value}.json`,
				{
					method: "GET",
					headers: {
						"content-Type": "application/json",
						"ngrok-skip-browser-warning": true,
					},
				}
			);
			const data1 = await data2.json();
			return data1;
		};
		if (myData.activate_bar && pageValidation) {
			if (myData.display_to_all_customers === true) {
				fsb.style.display = "inline";
				render(myData);
			} else if (
				customer_id?.value &&
				myData.display_to_all_customers === false
			) {
				const data1 = await getShopData();
				switch (myData?.customer_target) {
					case "customer_spent":
						if (
							Number(data1.customer?.total_spent) >
							Number(myData?.customer_spent)
						) {
							fsb.style.display = "inline";
							render(myData);
						}
						break;
					case "customer_tag":
						const str1 = myData?.customer_tags;
						const arr1 = str1.split(",");
						const str2 = data1.customer?.tags;
						const arr2 = str2.split(",");
						const tags_comparison = compare(arr1, arr2);
						if (tags_comparison?.length > 0) {
							fsb.style.display = "inline";
							render(myData);
						}
						break;
					case "customer_sub":
						if (
							data1?.customer.email_marketing_consent.state === "subscribed"
						) {
							fsb.style.display = "inline";
							render(myData);
						}
						break;
					default:
						fsb.style.display = "none";
				}
			} else {
				fsb.style.display = "none";
			}
		} else if (!pageValidation && !myData.premium_user) {
			fsb.style.display = "inline";
			render(myData);
		} else {
			fsb.style.display = "none";
		}
	} catch (e) {
		console.log("error", e);
	}
};

getFreeShippingBarData();

window.onclick = () => {
	setTimeout(getFreeShippingBarData, 3000);
};

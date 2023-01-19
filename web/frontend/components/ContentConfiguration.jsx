import {
	Banner,
	Caption,
	Card,
	DropZone,
	Icon,
	Link,
	List,
	Select,
	Spinner,
	Stack,
	TextField,
} from "@shopify/polaris";

import {DeleteMajor} from "@shopify/polaris-icons";

export const ContentConfiguration = ({
	fsbText,
	fsbTextChange,
	freeShippingGoal,
	freeShippingGoalChange,
	secondaryFreeShippingGoal,
	secondaryFreeShippingGoalChange,
	initialMsgText_1,
	initialMsgText_1Change,
	initialMsgText_2,
	initialMsgText_2Change,
	progressMsgText_1,
	progressMsgText_1Change,
	progressMsgText_2,
	progressMsgText_2Change,
	secondaryMsgText_1,
	secondaryMsgText_1Change,
	secondaryMsgText_2,
	secondaryMsgText_2Change,
	countryCurrencyDatas,
	currencySymbolPosition,
	currencySymbolPositionChange,
	successMsg,
	successMsgChange,
	premiumUser,
	selected,
	selectedChange,
	handleDropZoneDrop,
	linkSelected,
	handleLinkSelectChange,
	currencySymbol,
	currencySymbolChange,
	imgUrl,
	setImgUrl,
	linkURL,
	handleLinkURLChange,
	hasError,
	rejectedFiles,
	imageLoading,
	billingUrl,
}) => {
	const linkOptions = [
		{label: "OFF", value: "off"},
		{label: "ON", value: "on"},
	];
	const options = [
		{label: "Indian Rupees INR", value: "INR"},
		{label: "United States Dollars USD", value: "USD"},
		{label: "EURO EUR", value: "EUR"},
		{label: "JAPAN YEN", value: "JPY"},
	];
	const errorMessage = hasError && (
		<Banner title="This image couldn’t be uploaded:" status="critical">
			<List type="bullet">
				{rejectedFiles.map((file, index) => (
					<List.Item key={index}>
						{`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
					</List.Item>
				))}
			</List>
		</Banner>
	);
	const fileUpload = !imgUrl && (
		<>
			{imageLoading ? (
				<div className="spin-loader">
					{/* <Spinner accessibilityLabel="Spinner example" size="large" /> */}
				</div>
			) : (
				<DropZone.FileUpload />
			)}
		</>
	);

	const ShopifyImage = imgUrl && (
		<div style={{padding: "1px"}}>
			<img
				width="100%"
				height="118px"
				style={{
					border: "none",
				}}
				src={imgUrl}
			/>
		</div>
	);

	return (
		<Card title="Content Configuration" sectioned>
			<div>
				<TextField
					value={fsbText}
					onChange={fsbTextChange}
					label="Title "
					type="text"
					placeholder="My First Free Shipping Bar"
					error={
						fsbText &&
						fsbText.trim() === "" &&
						"FreeShippingBar Title is required"
					}
					maxLength={30}
					helpText={
						<span>For your own internal reference - only you can see it</span>
					}
				/>
				<br />
				<div
					id="sec-goal"
					style={{display: "flex", justifyContent: "space-between"}}
				>
					<TextField
						value={freeShippingGoal}
						onChange={freeShippingGoalChange}
						label="Free Shipping Goal"
						type="number"
						error={
							freeShippingGoal * 1 != 0 && freeShippingGoal * 1 > 0
								? ""
								: "FreeShippingGoal is required"
						}
						placeholder="Enter your Free Shipping Goal"
					/>{" "}
					{premiumUser ? (
						<TextField
							label="Secondary Free Shipping Goal"
							type="number"
							value={secondaryFreeShippingGoal}
							onChange={secondaryFreeShippingGoalChange}
							error={
								secondaryFreeShippingGoal > 0 &&
								secondaryFreeShippingGoal * 1 <= freeShippingGoal * 1 &&
								"Secondary Free Shipping Goal is Invalid"
							}
							placeholder="Secondary Free Shipping Goal"
							helpText={
								<span>
									Secondary Goal needs to be greater than the 1st free shipping
									goal.
									<br />
									Enter 0 to disable secondary free shipping goal.
								</span>
							}
						/>
					) : (
						<TextField
							label="Secondary Goal"
							type="number"
							placeholder="Add Secondary Goal"
							helpText={
								<Link removeUnderline url={billingUrl} dataPrimaryLink>
									Upgrade to Premium
								</Link>
							}
							disabled
						/>
					)}
				</div>
			</div>
			<br />
			<br />
			<table className="input-table">
				<tbody>
					<tr>
						<td>Intial Message</td>
						<td
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<TextField
								value={initialMsgText_1}
								onChange={initialMsgText_1Change}
								type="text "
								placeholder=""
								helpText={<span>Display when cart is empty</span>}
							/>{" "}
							<Caption className="goal_caption">Rs.{freeShippingGoal}</Caption>
							<TextField
								value={initialMsgText_2}
								onChange={initialMsgText_2Change}
								type="text"
							/>{" "}
						</td>
					</tr>
					<tr>
						<td>Progress Message</td>
						<td
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<TextField
								value={progressMsgText_1}
								onChange={progressMsgText_1Change}
								type="text "
								helpText={
									<span>Displays when cart value is less than the goal</span>
								}
							/>{" "}
							<Caption className="goal_caption">
								Rs.{freeShippingGoal - 1}
							</Caption>
							<TextField
								value={progressMsgText_2}
								onChange={progressMsgText_2Change}
								type="text"
								placeholder=""
								helpText={<span></span>}
							/>{" "}
						</td>
					</tr>
					{premiumUser && (
						<tr>
							<td>Secondary Goal Progress Message</td>
							<td
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<TextField
									value={secondaryMsgText_1}
									onChange={secondaryMsgText_1Change}
									type="text "
								/>{" "}
								{secondaryFreeShippingGoal && (
									<Caption className="goal_caption">
										Rs.{secondaryFreeShippingGoal - 1}
									</Caption>
								)}
								<TextField
									value={secondaryMsgText_2}
									onChange={secondaryMsgText_2Change}
									type="text"
									placeholder=""
								/>{" "}
							</td>
						</tr>
					)}

					<tr>
						<td>Goal Achieved Message</td>
						<td>
							<TextField
								value={successMsg}
								onChange={successMsgChange}
								type="text"
								error={!successMsg && "Success Message is required"}
								placeholder=""
								helpText={
									<span>Displays when cart value is greater than goal</span>
								}
							/>{" "}
						</td>
					</tr>
					<tr>
						<td>Currency</td>
						<td>
							<Select
								options={countryCurrencyDatas}
								onChange={selectedChange}
								value={selected}
							/>
						</td>
					</tr>
					{countryCurrencyDatas && (
						<tr>
							<td>Currency Symbol</td>
							<td>
								<TextField
									onChange={currencySymbolChange}
									value={currencySymbol}
									type="text"
									placeholder="Enter your Currency Symbol "
									error={!currencySymbol && "Currency Symbol is required"}
								/>
							</td>
						</tr>
					)}
					<tr>
						<td>Position of Currency Symbol</td>
						<td>
							<Select
								options={[
									{
										label: "Position of Symbol before the Amount",
										value: "before",
									},
									{
										label: "Position of Symbol After the Amount",
										value: "after",
									},
								]}
								onChange={currencySymbolPositionChange}
								value={currencySymbolPosition}
							/>
						</td>
					</tr>
					<tr>
						<td>Add link to the bar</td>
						<td>
							<Select
								label="The bar will be clickable after adding a link"
								options={linkOptions}
								onChange={handleLinkSelectChange}
								value={linkSelected}
							/>
						</td>
					</tr>
					{linkSelected === "on" && (
						<tr>
							<td>Link URL</td>
							<td>
								{" "}
								<TextField
									label="This address will be visited after clicking the bar"
									value={linkURL}
									error={!linkURL && "Please enter valid link URL"}
									onChange={handleLinkURLChange}
									labelAction={{
										content: "",
									}}
									autoComplete="off"
								/>
							</td>
						</tr>
					)}
					<tr>
						<td>
							<span>BackGround Image upload</span>{" "}
						</td>
						<td>
							{premiumUser ? (
								<Stack vertical>
									{errorMessage}
									<DropZone
										accept="image/*"
										type="image"
										allowMultiple={false}
										onDrop={handleDropZoneDrop}
									>
										{fileUpload}
										{ShopifyImage}
									</DropZone>
									imgUrl && (
									<div
										className="delete-icon"
										onClick={() => {
											setImgUrl("");
										}}
									>
										<Icon source={DeleteMajor} color="base" />
									</div>
									)
								</Stack>
							) : (
								<Link removeUnderline url={billingUrl} dataPrimaryLink>
									Upgrade to Premium
								</Link>
							)}
						</td>
					</tr>
				</tbody>
			</table>
		</Card>
	);
};

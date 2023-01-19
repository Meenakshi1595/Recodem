import {Card} from "@shopify/polaris";
import {useEffect} from "react";
export const PreviewBlock = ({
	initialMsgText_1,
	currencySymbol,
	freeShippingGoal,
	initialMsgText_2,
	progressMsgText_1,
	progressMsgText_2,
	successMsg,
	imgUrl,
	currencySymbolPosition,
	font,
	textColor,
	fontSize,
	backgroundColor,
	specialTextColor,
	premiumUser,
}) => {
	return (
		<Card title="Preview Block" sectioned>
			<Card title="Initial Message" sectioned>
				{currencySymbolPosition === "before" ? (
					<div
						className="bg-fsb"
						style={{
							fontFamily: font,
							color: textColor,
							fontSize: parseInt(fontSize),
							backgroundImage: premiumUser ? `url(${imgUrl})` : `none`,
							backgroundColor: premiumUser && imgUrl ? null : backgroundColor,
							backgroundRepeat: premiumUser && imgUrl ? "no-repeat" : "",
							backgroundSize: premiumUser && imgUrl ? "cover" : "",
						}}
					>
						<span>{initialMsgText_1} </span> &nbsp;
						<span id="spl-txt" style={{color: specialTextColor}}>
							{" "}
							{currencySymbol}
							{freeShippingGoal}{" "}
						</span>
						{initialMsgText_2}
					</div>
				) : (
					<div
						className="bg-fsb"
						style={{
							fontFamily: font,
							color: textColor,
							fontSize: parseInt(fontSize),
							backgroundImage: premiumUser ? `url(${imgUrl})` : `none`,
							backgroundColor: premiumUser && imgUrl ? null : backgroundColor,
							backgroundRepeat: premiumUser && imgUrl ? "no-repeat" : "",
							backgroundSize: premiumUser && imgUrl ? "cover" : "",
						}}
					>
						<span>{initialMsgText_1} </span>&nbsp;
						<span id="spl-txt" style={{color: specialTextColor}}>
							{" "}
							{freeShippingGoal} {currencySymbol}
						</span>
						{initialMsgText_2}
					</div>
				)}
			</Card>
			<Card title="In Progress Message" sectioned>
				{currencySymbolPosition === "before" ? (
					<div
						className="bg-fsb"
						style={{
							fontFamily: font,
							color: textColor,
							fontSize: parseInt(fontSize),
							backgroundImage: premiumUser ? `url(${imgUrl})` : `none`,
							backgroundColor: premiumUser && imgUrl ? null : backgroundColor,
							backgroundRepeat: premiumUser && imgUrl ? "no-repeat" : "",
							backgroundSize: premiumUser && imgUrl ? "cover" : "",
						}}
					>
						<span className="text-fsb">
							{progressMsgText_1}
							<span id="spl-txt" style={{color: specialTextColor}}>
								{" "}
								{currencySymbol}
								{freeShippingGoal - 1}{" "}
							</span>
							{progressMsgText_2}
						</span>
					</div>
				) : (
					<div
						className="bg-fsb"
						style={{
							fontFamily: font,
							color: textColor,
							fontSize: parseInt(fontSize),
							backgroundImage: premiumUser ? `url(${imgUrl})` : `none`,
							backgroundColor: premiumUser && imgUrl ? null : backgroundColor,
							backgroundRepeat: premiumUser && imgUrl ? "no-repeat" : "",
							backgroundSize: premiumUser && imgUrl ? "cover" : "",
						}}
					>
						<span className="text-fsb">
							{progressMsgText_1}
							<span id="spl-txt" style={{color: specialTextColor}}>
								{" "}
								{freeShippingGoal - 1} {currencySymbol}
							</span>
							{progressMsgText_2}
						</span>
					</div>
				)}
			</Card>
			<Card title="Success Message" sectioned>
				<div
					className="bg-fsb"
					style={{
						fontFamily: font,
						color: textColor,
						fontSize: parseInt(fontSize),
						backgroundImage: premiumUser ? `url(${imgUrl})` : `none`,
						backgroundColor: premiumUser && imgUrl ? null : backgroundColor,
						backgroundRepeat: premiumUser && imgUrl ? "no-repeat" : "",
						backgroundSize: premiumUser && imgUrl ? "cover" : "",
					}}
				>
					{successMsg}
				</div>
			</Card>
		</Card>
	);
};

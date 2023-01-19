import {
	ButtonGroup,
	Card,
	ColorPicker,
	Popover,
	Select,
	TextField,
} from "@shopify/polaris";

export const StyleConfiguration = ({
	selectFontChange,
	selectFontSize,
	backgroundChange,
	textChange,
	specialTextChange,
	setBackgroundColor,
	backgroundColor,
	backgroundHsl,
	textHsl,
	setTextColor,
	textColor,
	setSpecialTextColor,
	specialTextColor,
	specialTextHsl,
	font,
	fontSize,
	bgpressed,
	txtpressed,
	splTxtpressed,
	fonts,
	fontsizes,
	setBgPressed,
	setTxtPressed,
	setSplTxtPressed,
}) => {
	return (
		<Card title="Style Configuration" sectioned>
			<div style={{display: "flex", justifyContent: "space-between"}}>
				<Card title="Background Color">
					<div className="bg-card" style={{display: "flex"}}>
						<Popover
							active={bgpressed.buttonColorPicker}
							sectioned={true}
							activator={
								<button
									id="btn-pickedcolor"
									onClick={e => {
										e.preventDefault();
										setBgPressed({buttonColorPicker: true});
									}}
									style={{backgroundColor: backgroundColor}}
								></button>
							}
							onClose={e => {
								// e.preventDefault();
								setBgPressed({buttonColorPicker: false});
							}}
						>
							<button
								onClick={() => {
									setBgPressed({buttonColorPicker: false});
								}}
							>
								X
							</button>
							<Popover.Pane fixed>
								<Popover.Section>
									<ColorPicker
										onChange={backgroundChange}
										color={backgroundHsl}
									/>
								</Popover.Section>
							</Popover.Pane>
						</Popover>
						<TextField
							value={backgroundColor}
							onChange={setBackgroundColor}
						></TextField>
					</div>
				</Card>
				<Card title="Text Color">
					<div className="txt-card" style={{display: "flex"}}>
						<Popover
							active={txtpressed.buttonColorPicker}
							sectioned={true}
							activator={
								<button
									id="btn-pickedcolor"
									onClick={e => {
										e.preventDefault();
										setTxtPressed({buttonColorPicker: true});
									}}
									style={{backgroundColor: textColor}}
								></button>
							}
							onClose={() => {
								setTxtPressed({buttonColorPicker: false});
							}}
						>
							<button
								onClick={() => {
									setTxtPressed({buttonColorPicker: false});
								}}
							>
								X
							</button>
							<Popover.Pane fixed>
								<Popover.Section>
									<ColorPicker onChange={textChange} color={textHsl} />
								</Popover.Section>
							</Popover.Pane>
						</Popover>
						<TextField value={textColor} onChange={setTextColor}></TextField>
					</div>
				</Card>
				<Card title="Special Text Color">
					<div className="txt-card" style={{display: "flex"}}>
						<Popover
							active={splTxtpressed.buttonColorPicker}
							sectioned={true}
							activator={
								<button
									id="btn-pickedcolor"
									onClick={e => {
										e.preventDefault();
										setSplTxtPressed({buttonColorPicker: true});
									}}
									style={{backgroundColor: specialTextColor}}
								></button>
							}
							onClose={() => {
								setSplTxtPressed({buttonColorPicker: false});
							}}
						>
							<button
								onClick={() => {
									setSplTxtPressed({buttonColorPicker: false});
								}}
							>
								X
							</button>
							<Popover.Pane fixed>
								<Popover.Section>
									<ColorPicker
										onChange={specialTextChange}
										color={specialTextHsl}
									/>
								</Popover.Section>
							</Popover.Pane>
						</Popover>
						<TextField
							value={specialTextColor}
							onChange={setSpecialTextColor}
						></TextField>{" "}
					</div>
				</Card>
			</div>
			<Card title="Font Family">
				<ButtonGroup>
					{fonts.map(buttonLabel => (
						<button
							key={buttonLabel}
							name={buttonLabel}
							style={{fontFamily: buttonLabel}}
							onClick={e => {
								e.preventDefault();
								selectFontChange(buttonLabel);
							}}
							className={
								buttonLabel === font ? "fontButton active" : "fontButton"
							}
						>
							{buttonLabel}
						</button>
					))}
				</ButtonGroup>
			</Card>
			<Card title="Font Size">
				<div className="font-main">
					<Select
						id="dropdown-fontsize"
						options={fontsizes}
						onChange={selectFontSize}
						value={fontSize}
					/>
				</div>
			</Card>
		</Card>
	);
};

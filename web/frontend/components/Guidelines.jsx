import {Card, Heading, List} from "@shopify/polaris";
export const Guidelines = () => {
	return (
		<Card sectioned>
			<Card sectioned>
				<Heading>SetUp Guidelines</Heading>
				<br />
				<List type="number">
					<List.Item>
						Go to Shopify Admin {">"} Settings {">"} Shipping.
					</List.Item>
					<List.Item>Open the relevant Shipping Profile.</List.Item>
					<List.Item>Add a Shipping Zone to this profile.</List.Item>
					<List.Item>Add Shipping Methods to this zone.</List.Item>
					<List.Item>
						Add a Condition and select "Based on order price".
					</List.Item>
					<List.Item>
						Enter a minimum order price (same as the goal in the AFS App).
					</List.Item>
					<List.Item>Once you complete it, click "Done".</List.Item>
					<List.Item>
						You can create a bar by adding the configurations below.
					</List.Item>
				</List>
			</Card>
			<Card sectioned>
				<Heading>Enable bar in the Store</Heading>
				<br />
				<List type="number">
					<List.Item>
						Go to Shopify Admin {">"} Online Store {">"} Customize.
					</List.Item>
					<List.Item>Go to the app embeds in the left sidebar.</List.Item>
					<List.Item>Enable the AFS button over there.</List.Item>
				</List>
			</Card>
		</Card>
	);
};

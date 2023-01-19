import {Badge, Stack, Card, Link} from "@shopify/polaris";
export const Contact = () => {
	return (
		<Card sectioned>
			<Stack spacing="tight" alignment="center" distribution="center">
				<Badge>
					Feel free to{" "}
					<Link url="https://support.wigostores.com/" external>
						Contact us
					</Link>
				</Badge>
			</Stack>
		</Card>
	);
};

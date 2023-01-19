import {Layout, Page} from "@shopify/polaris";

import {FsbCard} from "../components";
import {TitleBar} from "@shopify/app-bridge-react";

export default function HomePage() {
	return (
		<Page>
			<TitleBar title="Avail Free Shipping" primaryAction={null} />
			<Layout>
				<Layout.Section>
					<FsbCard />
				</Layout.Section>
			</Layout>
		</Page>
	);
}

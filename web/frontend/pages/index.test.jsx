import { expect, it, vi } from "vitest";

import { FsbCard } from "../components";
import Index from "./index";
import { Link } from "@shopify/polaris";
import { mount } from "../test/mount";

vi.mock("components/FsbCard", () => ({
  FsbCard: () => null,
}));

it("renders links to documentation", async () => {
  const component = await mount(<Index />);

  expect(component).toContainReactComponent(Link, {
    url: "https://polaris.shopify.com/",
    external: true,
  });

  expect(component).toContainReactComponent(Link, {
    url: "https://shopify.dev/api/admin-graphql",
    external: true,
  });

  expect(component).toContainReactComponent(Link, {
    url: "https://shopify.dev/apps/tools/app-bridge",
    external: true,
  });

  expect(component).toContainReactComponent(Link, {
    url: "https://shopify.dev/apps/getting-started/add-functionality",
    external: true,
  });
});

it("renders a <FsbCard/>", async () => {
  const component = await mount(<Index />);

  expect(component).toContainReactComponent(FsbCard);
});

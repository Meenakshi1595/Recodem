import { Card, Link, RadioButton } from "@shopify/polaris";
export const PageTargeting = ({
  premiumUser,
  pageTargetValue,
  pageTargetChange,
  billingUrl,
}) => {
  return (
    <Card title="Page Targeting" sectioned>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {premiumUser ? (
          <>
            <RadioButton
              label="All Pages"
              checked={pageTargetValue === "all_page"}
              id="all_page"
              name="all-pages"
              onChange={pageTargetChange}
            />
            <RadioButton
              label="Homepage Only"
              checked={pageTargetValue === "home_page"}
              id="home_page"
              name="home-pages"
              onChange={pageTargetChange}
            />
            <RadioButton
              label="Cartpage Only"
              checked={pageTargetValue === "cart_page"}
              id="cart_page"
              name="cart-pages"
              onChange={pageTargetChange}
            />
            <RadioButton
              label="All Product description pages Only"
              checked={pageTargetValue === "pdp"}
              id="pdp"
              name="pdp"
              onChange={pageTargetChange}
            />
          </>
        ) : (
          <>
            <RadioButton
              label="All Pages"
              checked={pageTargetValue === "all_page" || true}
              id="all_page"
              name="all-pages"
              onChange={pageTargetChange}
            />
            <div className="page-target-buttons" style={{ display: "flex" }}>
              <RadioButton label="Homepage Only" disabled name="all-pages" />
              <span className="Choice__HelpText">
                <Link removeUnderline url={billingUrl}>
                  Upgrade to Premium
                </Link>
              </span>
            </div>
            <div className="page-target-buttons" style={{ display: "flex" }}>
              <RadioButton label="Cartpage Only" disabled name="all-pages" />
              <span className="Choice__HelpText">
                <Link removeUnderline url={billingUrl}>
                  Upgrade to Premium
                </Link>
              </span>
            </div>
            <div className="page-target-buttons" style={{ display: "flex" }}>
              <RadioButton label="Product Page" disabled name="all-pages" />
              <span className="Choice__HelpText">
                <Link removeUnderline url={billingUrl}>
                  Upgrade to Premium
                </Link>
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

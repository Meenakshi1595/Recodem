import { Card, Link, RadioButton } from "@shopify/polaris";
export const CustomerTargeting = ({
  premiumUser,
  customerTargetValue,
  customerTargetChange,
  setCustomerTags,
  setCustomerSpent,
  customerSpent,
  customerTags,
  billingUrl,
}) => {
  return (
    <Card title="Customer Targeting" sectioned>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {premiumUser ? (
          <>
            <RadioButton
              label="All customers"
              checked={customerTargetValue === "customer_all"}
              id="customer_all"
              name="customer-all"
              onChange={customerTargetChange}
            />
            <RadioButton
              label="Target customers based on subscription"
              checked={customerTargetValue === "customer_sub"}
              id="customer_sub"
              name="customer-sub"
              onChange={customerTargetChange}
            />
            <RadioButton
              label="Target customers based on customer tag"
              checked={customerTargetValue === "customer_tag"}
              id="customer_tag"
              name="customer-tag"
              onChange={customerTargetChange}
            />
            {customerTargetValue === "customer_tag" ? (
              <div id="dvtext-customer_tag" style={{ display: "block" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    value={customerTags}
                    className="txtBox"
                    id="txtBox-customer_tag"
                    placeholder="Enter customer tags"
                    onChange={({ target }) => {
                      setCustomerTags(target.value);
                    }}
                  />
                  <span className="helpText">
                    Input the Tag above. Use commas to separate if there are
                    multiple tags.
                    <br />
                    The bar will be displayed to the customers if any tag is
                    matched
                  </span>
                </div>
              </div>
            ) : (
              <div id="dvtext-customer_tag" style={{ display: "none" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    value={customerTags}
                    className="txtBox"
                    id="txtBox-customer_tag"
                    placeholder="Enter customer tags"
                    onChange={({ target }) => {
                      setCustomerTags(target.value);
                    }}
                  />
                  <span className="helpText">
                    Input the Tag above. Use commas to separate if there are
                    multiple tags.
                    <br />
                    The bar will be displayed to the customers if any tag is
                    matched
                  </span>
                </div>
              </div>
            )}
            <RadioButton
              label="Target customers based on total spent"
              checked={customerTargetValue === "customer_spent"}
              id="customer_spent"
              name="customer-spent"
              onChange={customerTargetChange}
            />
            {customerTargetValue === "customer_spent" ? (
              <div id="dvtext-customer_spent" style={{ display: "block" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    value={customerSpent}
                    className="txtBox"
                    id="txtBox-customer_spent"
                    placeholder="Enter target amount"
                    onChange={({ target }) => {
                      setCustomerSpent(target.value);
                    }}
                  />
                  <span className="helpText">
                    Insert the amount. The bar will be displayed to the
                    customers who has spent above the given amount.
                  </span>
                </div>
              </div>
            ) : (
              <div id="dvtext-customer_spent" style={{ display: "none" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    value={customerSpent}
                    className="txtBox"
                    id="txtBox-customer_spent"
                    placeholder="Enter target amount"
                    onChange={({ target }) => {
                      setCustomerSpent(target.value);
                    }}
                  />
                  <span className="helpText">
                    Insert the amount. The bar will be displayed to the
                    customers who has spent above the given amount.
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <RadioButton
              label="All customers"
              checked={customerTargetValue === "customer_all" || true}
              name="customer-all"
            />
            <div
              className="customer-target-buttons"
              style={{ display: "flex" }}
            >
              <RadioButton
                label="Target customers based on subscription"
                disabled
                name="customer-sub"
              />
              <span className="Choice__HelpText">
                <Link removeUnderline url={billingUrl}>
                  Upgrade to Premium
                </Link>
              </span>
            </div>
            <div
              className="customer-target-buttons"
              style={{ display: "flex" }}
            >
              <RadioButton
                label="Target customers based on customer tag"
                disabled
                name="customer-tag"
              />
              <span className="Choice__HelpText">
                <Link removeUnderline url={billingUrl}>
                  Upgrade to Premium
                </Link>
              </span>
            </div>
            <div
              className="customer-target-buttons"
              style={{ display: "flex" }}
            >
              <RadioButton
                label="Target customers based on total spent"
                disabled
                name="customer-spent"
              />
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

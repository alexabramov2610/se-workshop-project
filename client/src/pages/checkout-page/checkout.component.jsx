import React from "react";
import * as api from "../../utils/api";
import { CheckoutItem } from "../../components/checkout-item/checkout-item.component";
import { PayForm } from "../../components/pay-form/pay-form";
import { Divider } from "semantic-ui-react";
import {
  CheckoutPageContainer,
  CheckoutHeaderContainer,
  HeaderBlockContainer,
  TotalContainer,
  WarningContainer,
} from "./checkout.styles";
// { cartItems, total, history }
export class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const { data } = await api.viewCart();
    const total = data.data && data.data.total;

    const items =
      data.data &&
      data.data.cart &&
      data.data.cart.products &&
      mapCartToItems(data.data.cart.products);
    this.setState({ items, total });
  }
  async componentDidUpdate(preProps) {
    if (preProps !== this.props) {
      const { data } = await api.viewCart();
      const total = data.data && data.data.total;
      const items =
        data.data &&
        data.data.cart &&
        data.data.cart.products &&
        mapCartToItems(data.data.cart.products);
      this.setState({ items, total });
    }
  }
  render() {
    return (
      <div>
        <CheckoutPageContainer>
          <CheckoutHeaderContainer>
            <HeaderBlockContainer>
              <span>Product</span>
            </HeaderBlockContainer>
            <HeaderBlockContainer>
              <span>Name</span>
            </HeaderBlockContainer>
            <HeaderBlockContainer>
              <span>Quantity</span>
            </HeaderBlockContainer>
            <HeaderBlockContainer>
              <span>Price</span>
            </HeaderBlockContainer>
            <HeaderBlockContainer>
              <span>Total</span>
            </HeaderBlockContainer>
            <HeaderBlockContainer>
              <span>Remove</span>
            </HeaderBlockContainer>
          </CheckoutHeaderContainer>
          {this.state.items &&
            this.state.items.map((cartItem) => (
              <CheckoutItem key={cartItem.id} cartItem={cartItem} />
            ))}
        </CheckoutPageContainer>
        <Divider style={{ width: "55%", margin: "auto", marginTop: "50px" }} />
        <TotalContainer>TOTAL: ₪ {this.state.total}</TotalContainer>
        <PayForm
          total={this.state.total}
          cartCountUpdater={this.props.cartCountUpdater}
        />
      </div>
    );
  }
}

const mapCartToItems = (items) => {
  const itemsWithStores = items.map((p) =>
    p.bagItems.map((bi) => {
      console.log(bi);
      return {
        store: p.storeName,
        name: bi.product.name,
        price: bi.product.price,
        cn: bi.product.catalogNumber,
        quantity: bi.amount,
        finalPrice: bi.finalPrice,
      };
    })
  );
  return [].concat.apply([], itemsWithStores);
};

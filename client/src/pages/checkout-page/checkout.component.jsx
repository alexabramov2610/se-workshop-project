import React from "react";
import * as api from "../../utils/api";
import { CheckoutItem } from "../../components/checkout-item/checkout-item.component";

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
    const total = data.data.total;
    const items = mapCartToItems(data.data.cart.products);
    this.setState({ items, total });
  }
  async componentDidUpdate(preProps) {
    if (preProps !== this.props) {
      const { data } = await api.viewCart();
      const total = data.data.total;
      const items = mapCartToItems(data.data.cart.products);
      this.setState({ items, total });
    }
  }
  render() {
    return (
      <CheckoutPageContainer>
        <CheckoutHeaderContainer>
          <HeaderBlockContainer>
            <span>Product</span>
          </HeaderBlockContainer>
          <HeaderBlockContainer>
            <span>Description</span>
          </HeaderBlockContainer>
          <HeaderBlockContainer>
            <span>Quantity</span>
          </HeaderBlockContainer>
          <HeaderBlockContainer>
            <span>Price</span>
          </HeaderBlockContainer>
          <HeaderBlockContainer>
            <span>Remove</span>
          </HeaderBlockContainer>
        </CheckoutHeaderContainer>
        {this.state.items &&
          this.state.items.map((cartItem) => (
            <CheckoutItem key={cartItem.id} cartItem={cartItem} />
          ))}
        <TotalContainer>TOTAL: ₪ {this.state.total}</TotalContainer>
        <WarningContainer>
          *Please use the following test credit card for payments*
          <br />
          4242 4242 4242 4242 - Exp: 01/20 - CVV: 123
        </WarningContainer>
      </CheckoutPageContainer>
    );
  }
}

const mapCartToItems = (items) => {
  const itemsWithStores = items.map((p) =>
    p.bagItems.map((bi) => {
      return {
        store: p.storeName,
        name: bi.product._name,
        price: bi.product._price,
        cn: bi.product._catalogNumber,
        quantity: bi.amount,
      };
    })
  );
  return [].concat.apply([], itemsWithStores);
};

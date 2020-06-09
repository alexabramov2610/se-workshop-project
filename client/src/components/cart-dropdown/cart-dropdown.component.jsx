import React from "react";
import { Link } from "react-router-dom";
import CartItem from "../cart-item/cart-item.component";
import {
  CartDropdownContainer,
  CartDropdownButton,
  EmptyMessageContainer,
  CartItemsContainer,
} from "./cart-dropdown.styles";
import { CartCtx } from "../../contexts/cart-context";
import { OutsideAlerter } from "../OutSideAlerter/outsider-click-detector";
const CartDropdown = ({ history, isVisible, items, setItems, hideMe }) => {
  const itemsWithStores =
    items &&
    items.map((p) =>
      p.bagItems.map((bi) => {
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
  const cartItmes = [].concat.apply([], itemsWithStores);

  return isVisible ? (
    <OutsideAlerter handleOutSideClick={hideMe}>
      <CartDropdownContainer>
        <CartItemsContainer>
          {cartItmes && cartItmes.length > 0 ? (
            cartItmes.map((cartItem, index) => (
              <CartItem key={index} setItems={setItems} item={cartItem} />
            ))
          ) : (
            <EmptyMessageContainer>Your cart is empty</EmptyMessageContainer>
          )}
        </CartItemsContainer>
        <Link to="/checkout">
          <CartDropdownButton>GO TO CHECKOUT</CartDropdownButton>
        </Link>
      </CartDropdownContainer>
    </OutsideAlerter>
  ) : null;
};
export default CartDropdown;

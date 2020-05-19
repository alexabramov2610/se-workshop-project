import React from "react";
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
          name: bi.product._name,
          price: bi.product._price,
          cn: bi.product._catalogNumber,
          quantity: bi.amount,
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
        <CartDropdownButton
          onClick={() => {
            history.push("/checkout");
            console.log("droppedown");
          }}
        >
          GO TO CHECKOUT
        </CartDropdownButton>
      </CartDropdownContainer>
    </OutsideAlerter>
  ) : null;
};
export default CartDropdown;

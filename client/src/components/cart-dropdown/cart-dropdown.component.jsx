import React from "react";
import CartItem from "../cart-item/cart-item.component";
import {
  CartDropdownContainer,
  CartDropdownButton,
  EmptyMessageContainer,
  CartItemsContainer,
} from "./cart-dropdown.styles";
import { CartCtx } from "../../contexts/cart-context";
const CartDropdown = ({ history, isVisible }) => (
  <CartCtx.Consumer>
    {(value) =>
      isVisible ? (
        <CartDropdownContainer>
          <CartItemsContainer>
            {value && value.cartItems && value.cartItems.length ? (
              value.cartItems.map((cartItem) => (
                cartItem
                // <CartItem key={cartItem.id} item={cartItem} />
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
      ) : null
    }
  </CartCtx.Consumer>
);

export default CartDropdown;

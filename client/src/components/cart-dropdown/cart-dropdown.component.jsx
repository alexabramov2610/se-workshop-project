import React from "react";
import CartItem from "../cart-item/cart-item.component";
import {
    CartDropdownContainer,
    CartDropdownButton,
    EmptyMessageContainer,
    CartItemsContainer,
} from "./cart-dropdown.styles";

const CartDropdown = ({cartItems, history, isVisible}) => (
    isVisible ?
    <CartDropdownContainer>
        <CartItemsContainer>
            {cartItems && cartItems.length ? (
                cartItems.map((cartItem) => (
                    <CartItem key={cartItem.id} item={cartItem}/>
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
    </CartDropdownContainer>: null
);

export default CartDropdown;

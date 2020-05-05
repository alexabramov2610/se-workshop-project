import React from "react";

import {
  CartItemContainer,
  ItemDetailsContainer,
  CartItemImage,
  RemoveButtonContainer
} from "./cart-item.styles";

const CartItem = ({ item, clearItemFromCart }) => {
  const { imageUrl, price, name, quantity } = item;
  return (
    <CartItemContainer>
      <CartItemImage src={imageUrl} alt="item" />
      <ItemDetailsContainer>
        <span>{name}</span>
        <span>
          {quantity} x {price} &#8362;
        </span>
      </ItemDetailsContainer>
      <RemoveButtonContainer onClick={() => clearItemFromCart(item)}>
        &#10005;
      </RemoveButtonContainer>
    </CartItemContainer>
  );
};

export default CartItem;
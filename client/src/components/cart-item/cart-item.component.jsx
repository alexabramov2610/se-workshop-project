import React from "react";
import * as api from "../../utils/api";
import {
  CartItemContainer,
  ItemDetailsContainer,
  CartItemImage,
  RemoveButtonContainer,
} from "./cart-item.styles";

const CartItem = ({ item, clearItemFromCart, setItems }) => {
  const { price, store, name, quantity, cn } = item;
  return (
    <CartItemContainer>
      <CartItemImage src={""} alt="item" />
      <ItemDetailsContainer>
        <span>{name}</span>
        <span>{store}</span>
        <span>
          {quantity} x {price} &#8362;
        </span>
      </ItemDetailsContainer>
      <RemoveButtonContainer onClick={async () => removeItem(item, setItems)}>
        &#10005;
      </RemoveButtonContainer>
    </CartItemContainer>
  );
};

const removeItem = async (item, setItems) => {
  const req = {
    body: {
      storeName: item.store,
      catalogNumber: item.cn,
      amount: item.quantity,
    },
  };
  await api.removeItemFromCart(req);
  const { data } = await api.viewCart();
  data && data.data && data.data.cart && setItems(data.data.cart.products);
};

export default CartItem;

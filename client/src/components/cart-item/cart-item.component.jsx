import React from "react";
import * as api from "../../utils/api";
import { FiBox } from "react-icons/fi";
import {
  CartItemContainer,
  ItemDetailsContainer,
  CartItemImage,
  RemoveButtonContainer,
} from "./cart-item.styles";
import { CartCtx } from "../../contexts/cart-context";

const CartItem = ({ item, clearItemFromCart, setItems }) => {
  const { price, store, name, quantity, cn, finalPrice } = item;
  console.log(item);
  return (
    <CartItemContainer>
      <FiBox
        style={{ marginRight: "4px", marginTop: "34px", marginBottom: "2px" }}
      />
      <ItemDetailsContainer>
        <span>{name}</span>
        <span>{store}</span>
        <span>
          {quantity} x {price} &#8362;{" "}
          {quantity * price !== finalPrice  ? (
            <span style={{ position: "absolute", right: "75px" }}>
              <span style={{ textDecoration: "line-through",marginRight:"5px" }}>
                {quantity * price}&#8362;
              </span>
              <span>{finalPrice}&#8362;</span>
            </span>
          ) : (
            <span style={{ position: "absolute", right: "75px" }}>
              {" "}
              {quantity * price}&#8362;
            </span>
          )}
        </span>
      </ItemDetailsContainer>

      <CartCtx.Consumer>
        {(value) => (
          <RemoveButtonContainer
            onClick={async () =>
              removeItem(item, setItems, value.cartCountUpdater)
            }
          >
            &#10005;
          </RemoveButtonContainer>
        )}
      </CartCtx.Consumer>
    </CartItemContainer>
  );
};

const removeItem = async (item, setItems, cartCountUpdater) => {
  const req = {
    body: {
      storeName: item.store,
      catalogNumber: item.cn,
      amount: item.quantity,
    },
  };
  await api.removeItemFromCart(req);
  await cartCountUpdater();
  const { data } = await api.viewCart();
  data && data.data && data.data.cart && setItems(data.data.cart.products);
};

export default CartItem;

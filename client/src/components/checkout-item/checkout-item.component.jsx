import React from "react";
import * as api from "../../utils/api";
import { FiBox } from "react-icons/fi";
import { CartCtx } from "../../contexts/cart-context";
import {
  CheckoutItemContainer,
  ImageContainer,
  TextContainer,
  QuantityContainer,
  RemoveButtonContainer,
  TotalContainer,
} from "./checkout-item.styles";

const removeItemH = async (item, cartCountUpdater) => {
  const req = {
    body: {
      storeName: item.store,
      catalogNumber: item.cn,
      amount: item.quantity,
    },
  };
  await api.removeItemFromCart(req);
  await cartCountUpdater();
};

export const CheckoutItem = ({ cartItem }) => {
  const { name, imageUrl, price, quantity, finalPrice } = cartItem;
  return (
    <CheckoutItemContainer>
      <ImageContainer>
        <FiBox style={{ marginRight: "4px", marginBottom: "2px" }} />
      </ImageContainer>
      <TextContainer>{name}</TextContainer>
      <QuantityContainer>
        <span>{quantity}</span>
      </QuantityContainer>
      <TextContainer>
        <span style={{ marginLeft: "-9px" }}>{price}</span> &#8362;
      </TextContainer>
      <TotalContainer>
        {quantity * price !== finalPrice ? (
          <div>
            <span style={{ textDecoration: "line-through" }}>
              {quantity * price} &#8362;
            </span>
            <span style={{ marginLeft: "7px" }}>{finalPrice} &#8362;</span>
          </div>
        ) : (
          <span>{quantity * price} &#8362;</span>
        )}
      </TotalContainer>
      <CartCtx.Consumer>
        {(value) => (
          <RemoveButtonContainer
            onClick={() => removeItemH(cartItem, value.cartCountUpdater)}
          >
            &#10005;
          </RemoveButtonContainer>
        )}
      </CartCtx.Consumer>
    </CheckoutItemContainer>
  );
};

import React from "react";
import * as api from "../../utils/api";
import {FiBox} from "react-icons/fi";
import { CartCtx } from "../../contexts/cart-context";
import {
  CheckoutItemContainer,
  ImageContainer,
  TextContainer,
  QuantityContainer,
  RemoveButtonContainer,
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

export const CheckoutItem = ({
  cartItem,
  clearItem,
  addItemToCart,
  removeItem,
}) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <CheckoutItemContainer>
      <ImageContainer>
      <FiBox style={{marginRight: "4px", marginBottom: "2px"}}/>
      </ImageContainer>
      <TextContainer>{name}</TextContainer>
      <QuantityContainer>
        <span>{quantity}</span>
      </QuantityContainer>
      <TextContainer>{price} &#8362;</TextContainer>
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

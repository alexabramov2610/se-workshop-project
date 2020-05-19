import React from "react";
import CartItem from "../cart-item/cart-item.component";
import {
  CartDropdownContainer,
  CartDropdownButton,
  EmptyMessageContainer,
  CartItemsContainer,
} from "./cart-dropdown.styles";
import { CartCtx } from "../../contexts/cart-context";

// data: {
//     result: boolean;
//     cart?: {
//         products: {
//             storeName: string;
//             bagItems: {
//     product: IProduct;
//     amount: number;
//     finalPrice?: number;
// }[];
//         }
//     }
// };

const CartDropdown = ({ history, isVisible, items }) =>
  isVisible ? (
    <CartDropdownContainer>
      <CartItemsContainer>
        {items && items.length > 0 ? (
          items.map(
            (cartItem) => cartItem
            // <CartItem key={cartItem.id} item={cartItem} />
          )
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
  ) : null;

export default CartDropdown;

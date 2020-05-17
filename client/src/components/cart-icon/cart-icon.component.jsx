import React, { useRef, useState, useEffect } from "react";

import {
  CartContainer,
  ShoppingIcon,
  ItemCountContainer,
} from "./cart-icon.styles";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";

const CartIcon = ({ itemCount }) => {
  const [animate, setAnimate] = useState(false);
  const [dropdown, toggleDropDown] = useState(false);
  const isMounting = useRef(true);

  useEffect(() => {
    if (isMounting.current) {
      isMounting.current = false;
    } else {
      setAnimate(true);
    }
  }, [itemCount]);
  const className = `animated hvr-underline-from-center ${
    animate ? "spin" : ""
  }`;
  return (
    <React.Fragment>
      <div className={className} onAnimationEnd={() => setAnimate(false)}>
        <CartContainer
          onClick={() => {
            toggleDropDown(!dropdown);
          }}
        >
          <ShoppingIcon />
          <ItemCountContainer>{itemCount}</ItemCountContainer>
        </CartContainer>
      </div>
      <CartDropdown isVisible={dropdown} />
    </React.Fragment>
  );
};
export default CartIcon;

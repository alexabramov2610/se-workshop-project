import React, { useRef, useState, useEffect } from "react";

import {
  CartContainer,
  ShoppingIcon,
  ItemCountContainer,
} from "./cart-icon.styles";

// import "../../assets/animations.scss";

const CartIcon = ({ toggleCartHidden, itemCount }) => {
  const [animate, setAnimate] = useState(false);
  const isMounting = useRef(true);

  useEffect(() => {
    if (isMounting.current) {
      isMounting.current = false;
    } else {
      setAnimate(true);
    }
  }, [itemCount]);

  const className = `animated hvr-underline-from-center ${animate ? "spin" : ""}`;
  return (
    <div className={className} onAnimationEnd={() => setAnimate(false)}>
      <CartContainer onClick={toggleCartHidden}>
        <ShoppingIcon />
        <ItemCountContainer>{itemCount}</ItemCountContainer>
      </CartContainer>
    </div>
  );
};
export default CartIcon;

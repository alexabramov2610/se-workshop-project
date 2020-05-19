import React, { useRef, useState, useEffect } from "react";
import * as api from "../../utils/api";
import {
  CartContainer,
  ShoppingIcon,
  ItemCountContainer,
} from "./cart-icon.styles";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";

const CartIcon = ({ itemCount }) => {
  const [animate, setAnimate] = useState(false);
  const [dropdown, toggleDropDown] = useState(false);
  const [itemss, setItems] = useState([]);
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
          onClick={async () => {
            if (!dropdown) {
              const { data } = await api.viewCart();
              data &&
                data.data &&
                data.data.cart &&
                setItems(data.data.cart.products);
              toggleDropDown(!dropdown);
            } else {
              setItems([]);
              toggleDropDown(!dropdown);
            }
          }}
        >
          <ShoppingIcon />
          <ItemCountContainer>{itemCount}</ItemCountContainer>
        </CartContainer>
      </div>
      {dropdown && (
        <CartDropdown
          setItems={(items) => setItems(items)}
          hideMe={() => toggleDropDown(!dropdown)}
          isVisible={dropdown}
          items={itemss}
        />
      )}
    </React.Fragment>
  );
};
export default CartIcon;

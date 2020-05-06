import React, {useRef, useState, useEffect} from "react";

import {
    CartContainer,
    ShoppingIcon,
    ItemCountContainer,
} from "./cart-icon.styles";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";

const CartIcon = () => {
    const [animate, setAnimate] = useState(false);
    const [dropdown, toggleDropDown] = useState(false);
    const [products, setProducts] = useState([]);
    const isMounting = useRef(true);

    useEffect(() => {
        if (isMounting.current) {
            isMounting.current = false;
        } else {
            setAnimate(true);
        }
    }, [products]);

    const className = `animated hvr-underline-from-center ${animate ? "spin" : ""}`;
    return (
        <React.Fragment>
            <div className={className} onAnimationEnd={() => setAnimate(false)}>
                <CartContainer onClick={() => toggleDropDown(!dropdown)}>
                    <ShoppingIcon/>
                    <ItemCountContainer>{products.length}</ItemCountContainer>
                </CartContainer>
            </div>
            <CartDropdown isVisible={dropdown}/>
        </React.Fragment>
    );
};
export default CartIcon;

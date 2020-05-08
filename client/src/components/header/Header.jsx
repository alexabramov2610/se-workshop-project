import React from "react";
import CartIcon from "../cart-icon/cart-icon.component";
import {ReactComponent as Logo} from "../../assets/crown.svg";
import "../../assets/animations.scss";
import "react-notifications/lib/notifications.css";
import {
    HeaderContainer,
    LogoContainer,
    OptionsContainer,
    OptionLink,
} from "./Header-styles";
import BellIcon from "../bell-icon/bell-icon.component";


const underlineAnimation = 'hvr-underline-from-center';

export class Header extends React.Component {

    render() {
        return (
            <React.Fragment>
                <HeaderContainer>
                    <LogoContainer to="/">
                        <Logo className="logo hvr-bounce-in"/>
                    </LogoContainer>
                    <OptionsContainer>
                        <OptionLink as="div" className={underlineAnimation} to="/shop">
                            HOME PAGE
                        </OptionLink>
                        <OptionLink as="div" className={underlineAnimation} to="/contact">
                            CONTACT
                        </OptionLink>
                        {true ? (
                            <OptionLink
                                as="div"
                                className={underlineAnimation}
                                onClick={() => console.log("nothing really")}
                            >
                                SIGN OUT
                            </OptionLink>
                        ) : (
                            <OptionLink as="div" className={underlineAnimation} to="/signin">
                                SIGN IN
                            </OptionLink>
                        )}
                        <BellIcon/>
                        <CartIcon/>
                    </OptionsContainer>
                </HeaderContainer>
            </React.Fragment>
        );
    }
}


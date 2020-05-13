import React from "react";
import CartIcon from "../cart-icon/cart-icon.component";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import "../../assets/animations.scss";
import "react-notifications/lib/notifications.css";
import { logout } from "../../utils/api";
import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
} from "./Header-styles";
import BellIcon from "../bell-icon/bell-icon.component";
import { Link } from "react-router-dom";
const underlineAnimation = "hvr-underline-from-center";

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  onLogout = () =>
    logout().then(({ data }) => {
      console.log("Log Out Recieved: ", data);
      (!data.error || data.error.message === "Already at this state") &&
        this.props.onLogout();
    }); 

  render() {
    
    return (
      <React.Fragment>
        <HeaderContainer>
          <LogoContainer to="/">
            <Logo className="logo hvr-bounce-in" />
          </LogoContainer>
          <OptionsContainer>
            <OptionLink as="div" className={underlineAnimation} to="/shop">
              HOME PAGE
            </OptionLink>
            <OptionLink as="div" className={underlineAnimation} to="/contact">
              CONTACT
            </OptionLink>
            {this.props.isLoggedIn ? (
              <OptionLink
                as="div"
                className={underlineAnimation}
                onClick={() => this.onLogout()}
              >
                SIGN OUT
              </OptionLink>
            ) : (
              <OptionLink as="div" className={underlineAnimation} to="/signin">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/signupsignin"
                >
                  SIGN IN
                </Link>
              </OptionLink>
            )}
            <BellIcon isLoggedIn={this.props.isLoggedIn} />
            <CartIcon />
          </OptionsContainer>
        </HeaderContainer>
      </React.Fragment>
    );
  }
}

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
  SearchContainer,
  LogoSearchContainer,
} from "./Header-styles";
import { Search } from "../search/search";
import BellIcon from "../bell-icon/bell-icon.component";
import { Link } from "react-router-dom";
import * as config from "../../utils/config";
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
            <OptionLink as="div" className={underlineAnimation}>
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to="/search"
              >
                Search
              </Link>
            </OptionLink>

            <OptionLink as="div" className={underlineAnimation}>
              <Link style={{ textDecoration: "none", color: "black" }} to="/">
                HOME PAGE
              </Link>
            </OptionLink>

            {this.props.isLoggedIn ? (
              <div>
                <OptionLink
                  as="div"
                  className={underlineAnimation}
                  onClick={() => this.onLogout()}
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/"
                  >
                    SIGN OUT {config.getLoggedInUser()}
                  </Link>
                </OptionLink>

                <OptionLink as="div" className={underlineAnimation}>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/personalinfo`}
                  >
                    Personal Info
                  </Link>
                </OptionLink>
              </div>
            ) : (
              <OptionLink as="div" className={underlineAnimation}>
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

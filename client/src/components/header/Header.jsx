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
import { CartCtx } from "../../contexts/cart-context";
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
            <Link
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                textDecoration: "none",
                color: "black",
              }}
              to="/search"
              className="hvr-underline-from-center"
            >
              Search
            </Link>

            <Link
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                textDecoration: "none",
                color: "black",
              }}
              className="hvr-underline-from-center"
              to="/"
            >
              HOME PAGE
            </Link>

            {this.props.isLoggedIn ? (
              <div>
                <Link
                  style={{
                    marginLeft: "8px",
                    marginRight: "8px",
                    textDecoration: "none",
                    color: "black",
                  }}
                  className="hvr-underline-from-center"
                  onClick={() => this.onLogout()}
                  to="/"
                >
                  SIGN OUT
                </Link>

                <Link
                  style={{
                    marginLeft: "8px",
                    marginRight: "8px",
                    textDecoration: "none",
                    color: "black",
                  }}
                  to={`/personalinfo`}
                  className="hvr-underline-from-center"
                >
                  PERSONAL INFO
                </Link>
              </div>
            ) : (
              <Link
                style={{
                  marginLeft: "8px",
                  marginRight: "8px",
                  textDecoration: "none",
                  color: "black",
                }}
                to="/signupsignin"
                className="hvr-underline-from-center"
              >
                SIGN IN
              </Link>
            )}
            <BellIcon isLoggedIn={this.props.isLoggedIn} />
            <CartCtx.Consumer>
              {(value) => <CartIcon itemCount={value.cartItemsCounter} />}
            </CartCtx.Consumer>
          </OptionsContainer>
        </HeaderContainer>
      </React.Fragment>
    );
  }
}

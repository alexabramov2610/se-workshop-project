import React from "react";
import CartIcon from "../cart-icon/cart-icon.component";
import {ReactComponent as Logo} from "../../assets/crown.svg";
import "../../assets/animations.scss";
import "react-notifications/lib/notifications.css";
import {logout} from "../../utils/api";
import {
    HeaderContainer,
    LogoContainer,
    OptionsContainer,
} from "./Header-styles";
import BellIcon from "../bell-icon/bell-icon.component";
import {Link} from "react-router-dom";
import {CartCtx} from "../../contexts/cart-context";
import {Dropdown, Menu} from "antd";

const menu = (
    <Menu>
        <Menu.Item>
            <Link
                to="/system/statistics"
            >
                Statistics
            </Link>
        </Menu.Item>
        <Menu.Item>
            <Link
                to="/viewStoresPurchasesHistory"
            >
                View stores purchases history
            </Link>
        </Menu.Item>
        <Menu.Item>
            <Link
                to="/viewUsersPurchasesHistory"
            >
                View users purchases history
            </Link>
        </Menu.Item>
    </Menu>);

const linkStyle = {
    marginLeft: "8px",
    marginRight: "8px",
    textDecoration: "none",
    color: "black",
};

export class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    adminOptions = () => {
        return (
            <Dropdown overlay={menu} style={linkStyle} className="hvr-underline-from-center">
                <div style={{cursor: "pointer"}}>
                    ADMIN
                </div>
            </Dropdown>
        );
    }

    onLogout = () =>
        logout().then(({data}) => {
            console.log("Log Out Recieved: ", data);
            (!data.error || data.error.message === "Already at this state") &&
            this.props.onLogout();
        });

    render() {
        return (
            <React.Fragment>
                <HeaderContainer>
                    <LogoContainer to="/">
                        <Logo className="logo hvr-bounce-in"/>
                    </LogoContainer>
                    <OptionsContainer>
                        <Link
                            style={linkStyle}
                            to="/search"
                            className="hvr-underline-from-center"
                        >
                            SEARCH
                        </Link>
                        {this.props.isAdmin ? this.adminOptions() : null}
                        <Link
                            style={linkStyle}
                            className="hvr-underline-from-center"
                            to="/"
                        >
                            HOME PAGE
                        </Link>

                        {this.props.isLoggedIn ? (
                            <div>
                                <Link
                                    style={linkStyle}
                                    className="hvr-underline-from-center"
                                    onClick={() => this.onLogout()}
                                    to="/"
                                >
                                    SIGN OUT
                                </Link>

                                <Link
                                    style={linkStyle}
                                    to={`/personalinfo`}
                                    className="hvr-underline-from-center"
                                >
                                    PERSONAL INFO
                                </Link>
                            </div>
                        ) : (
                            <Link
                                style={linkStyle}
                                to="/signupsignin"
                                className="hvr-underline-from-center"
                            >
                                SIGN IN
                            </Link>
                        )}
                        <BellIcon isLoggedIn={this.props.isLoggedIn}/>
                        <CartCtx.Consumer>
                            {(value) => <CartIcon itemCount={value.cartItemsCounter}/>}
                        </CartCtx.Consumer>
                    </OptionsContainer>
                </HeaderContainer>
            </React.Fragment>
        );
    }
}

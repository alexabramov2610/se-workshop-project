import React from "react";
import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import "../../assets/animations.scss";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { subscribeToTimer } from "../../utils/api";
import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
} from "./Header-styles";
import BellIcon from "../bell-icon/bell-icon.component";
import NotificationDropdown from "../notifications-dropdown/notification-dropdown.component";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: undefined };
    subscribeToTimer((err, timestamp) =>
      this.setState({
        timestamp,
      })
    );
  }

  componentDidMount() {}

  render(props) {
    return (
      <div>
        <HeaderUI hidden={true} style={{ zIndex: "99999", top: "1200" }} />
        <div style={{ position: "fixed", top: "1200" }}>
          {this.state.timestamp && NotificationManager.info(`REAL TIME ALERTS`)}
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

const underlineAnimation = "hvr-underline-from-center";
const HeaderUI = ({ currentUser = false, hidden = true }) => (
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
      <BellIcon />
      <CartIcon />
    </OptionsContainer>
    {hidden ? null : <CartDropdown />}
  </HeaderContainer>
);

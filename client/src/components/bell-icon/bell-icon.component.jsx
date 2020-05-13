import React, { useRef, useState, useEffect } from "react";

import {
  BellContainer,
  BellIconContainer,
  NotificationCountContainer,
} from "./bell-icon.styles.jsx";
import NotificationDropdown from "../notifications-dropdown/notification-dropdown.component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { startConnection } from "../../utils";

const types = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
};

const BellIcon = ({ isLoggedIn }) => {
  const [animate, setAnimate] = useState(false);
  const [dropdownVisible, toggleDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isMounting = useRef(true);

  useEffect(() => {
    isLoggedIn && startConnection((message) => handleNotification(message));
  }, []);

  useEffect(() => {
    if (isMounting.current) {
      isMounting.current = false;
    } else {
      setAnimate(true);
    }
  }, [notifications]);

  const notifyUser = (payload) => {
    switch (payload.type) {
      case types.INFO: {
        NotificationManager.info(payload.message);
        break;
      }
      case types.ERROR: {
        NotificationManager.error(payload.message);
        break;
      }
      case types.WARNING: {
        NotificationManager.warning(payload.message);
        break;
      }
      case types.SUCCESS: {
        NotificationManager.success(payload.message);
        break;
      }
      default:
        throw new Error("Unknown notification");
    }
  };

  const handleNotification = (payload) => {
    setNotifications((prevNotifications) => [...prevNotifications, payload]);
    notifyUser(payload);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  };

  const className = `animated hvr-underline-from-center ${
    animate ? "shake" : ""
  }`;
  return (
    <React.Fragment>
      <div className={className} onAnimationEnd={() => setAnimate(false)}>
        <BellContainer onClick={() => toggleDropdown(!dropdownVisible)}>
          <BellIconContainer />
          <NotificationCountContainer>
            {notifications.length}
          </NotificationCountContainer>
        </BellContainer>
      </div>
      <NotificationDropdown
        isVisible={dropdownVisible}
        notifications={notifications}
        clearNotifications={() => setNotifications([])}
        removeNotification={removeNotification}
      />
      <NotificationContainer />
    </React.Fragment>
  );
};

export default BellIcon;

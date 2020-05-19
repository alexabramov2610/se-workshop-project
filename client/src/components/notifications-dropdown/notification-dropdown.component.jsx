import React from "react";
import Notification from "../notification/notification.component";
import {
    EmptyMessageContainer,
    NotificationsContainer, NotificationsDropdownButton,
    NotificationsDropdownContainer
} from "../notifications-dropdown/notification-dropdown.styles.jsx";

const NotificationDropdown = ({notifications, isVisible, clearNotifications, removeNotification}) => (
    isVisible ?
        <NotificationsDropdownContainer>
            <NotificationsContainer>
                {notifications && notifications.length
                    ? (
                        notifications.map((notification) => (
                            <Notification key={notification.id} message={notification.message}
                                          removeNotification={() => removeNotification(notification.id)}/>
                        )))
                    : (
                        <EmptyMessageContainer>You don't have notifications yet</EmptyMessageContainer>
                    )}
            </NotificationsContainer>
            <NotificationsDropdownButton
                onClick={() => clearNotifications()}>
                Clear
            </NotificationsDropdownButton>
        </NotificationsDropdownContainer> : null
);

export default NotificationDropdown;

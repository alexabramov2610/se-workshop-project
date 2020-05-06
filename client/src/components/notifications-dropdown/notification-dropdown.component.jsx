import React from "react";
import Notification from "../notification/notification.component";
import {
    EmptyMessageContainer,
    NotificationsContainer, NotificationsDropdownButton,
    NotificationsDropdownContainer
} from "../notifications-dropdown/notification-dropdown.styles.jsx";

const NotificationDropdown = ({ notifications }) => (
    <NotificationsDropdownContainer>
        <NotificationsContainer>
            {notifications && notifications.length ? (
                notifications.map((notification) => (
                    <Notification key={notification.id} message={notification.message} />
                ))
            ) : (
                <EmptyMessageContainer>You don't have notifications yet</EmptyMessageContainer>
            )}
        </NotificationsContainer>
        <NotificationsDropdownButton
            onClick={() => {
                //TODO: clear all notifications
            }}
        >
            Clear notifications
        </NotificationsDropdownButton>
    </NotificationsDropdownContainer>
);

export default NotificationDropdown;

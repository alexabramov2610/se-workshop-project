import React from "react";

import {
    NotificationContainer,
    NotificationDetailsContainer,
    NotificationIconContainer, NotificationMessageContainer,
    RemoveButtonContainer
} from "./notification.styles";

const Notification = ({key, message, removeNotification}) => {
    return (
        <NotificationContainer>
            <NotificationDetailsContainer>
                <NotificationIconContainer/>
                <NotificationMessageContainer>
                    {message}
                </NotificationMessageContainer>
                <RemoveButtonContainer onClick={() => removeNotification(key)}>
                    &#10005;
                </RemoveButtonContainer>
            </NotificationDetailsContainer>
        </NotificationContainer>
    );
};

export default Notification;
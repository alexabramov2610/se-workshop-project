import React from "react";

import {
    NotificationContainer,
    NotificationDetailsContainer,
    NotificationIconContainer, NotificationMessageContainer,
    RemoveButtonContainer
} from "./notification.styles";

const Notification = ({message, clearItemFromCart}) => {
    return (
        <NotificationContainer>
            <NotificationDetailsContainer>
                <NotificationIconContainer/>
                <NotificationMessageContainer>
                    {message}
                </NotificationMessageContainer>
                <RemoveButtonContainer onClick={() => {
                }}>
                    &#10005;
                </RemoveButtonContainer>
            </NotificationDetailsContainer>
        </NotificationContainer>
    );
};

export default Notification;
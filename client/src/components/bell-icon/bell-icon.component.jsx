import React, { useRef, useState, useEffect } from "react";

import {
    BellContainer,
    BellIconContainer,
    NotificationCountContainer,
} from "./bell-icon.styles.jsx";

// import "../../assets/animations.scss";

const BellIcon = ({ toggleNotificationsHidden, notificationsCount }) => {
    const [animate, setAnimate] = useState(false);
    const isMounting = useRef(true);

    useEffect(() => {
        if (isMounting.current) {
            isMounting.current = false;
        } else {
            setAnimate(true);
        }
    }, [notificationsCount]);

    const className = `animated hvr-underline-from-center ${animate ? "shake" : ""}`;
    return (
        <div className={className} onAnimationEnd={() => setAnimate(false)}>
            <BellContainer onClick={toggleNotificationsHidden}>
                <BellIconContainer />
                <NotificationCountContainer>{notificationsCount}</NotificationCountContainer>
            </BellContainer>
        </div>
    );
};

export default BellIcon;

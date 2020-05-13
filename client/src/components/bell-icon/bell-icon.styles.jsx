import styled from 'styled-components';
import { ReactComponent as NotificationsBellIconSvg } from '../../assets/notifications-bell.svg';

export const BellContainer = styled.div`
  width: 45px;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const BellIconContainer = styled(NotificationsBellIconSvg)`
  width: 24px;
  height: 24px;
`;

export const NotificationCountContainer = styled.span`
  position: absolute;
  font-size: 10px;
  font-weight: bold;
  bottom: 12px;
`;

export const PopupNotificationContainer = styled.div`
    position: fixed;
    top: 1200;
`

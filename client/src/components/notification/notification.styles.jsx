import styled from "styled-components";
import {ReactComponent as NotificationIcon} from '../../assets/notificationImage.svg'

export const NotificationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 60px;
  margin-bottom: 15px;
`;

export const NotificationDetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 1px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const RemoveButtonContainer = styled.div`
  ${"" /* align-self: center; */}
  cursor: pointer;
`;

export const NotificationIconContainer = styled(NotificationIcon)`
  width: 25px;
  height: 25px;
`;

export const NotificationMessageContainer = styled.p`
  margin-left: 15px;
  width: 100%;
  overflow-wrap: break-word;
`;

import styled from "styled-components";
import {CustomButton} from "../custom-button/custom-button.component";

export const NotificationsDropdownContainer = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
  top: 90px;
  right: 110px;
  z-index: 5;
  font-weight: lighter;
`;

export const NotificationsDropdownButton = styled(CustomButton)`
  font-size: 1vw;
  margin-top: auto;
`;

export const EmptyMessageContainer = styled.span`
  letter-spacing: 1.3px;
  font-size: 18px;
  margin: 50px 0;
  align-self: center;
`;

export const NotificationsContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  padding-right: 15px;
  ::-webkit-scrollbar {
    width: 10px;
    right: 0px;
}

::-webkit-scrollbar-track-piece {
    background: #eee
}
::-webkit-scrollbar-thumb {
    background: #888
}​

`;

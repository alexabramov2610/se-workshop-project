import styled from "styled-components";
import { CustomButton } from "../custom-button/custom-button.component";

export const CartDropdownContainer = styled.div`
  position: absolute;
  width: 320px;
  height: 440px;
  display: flex;
  flex-direction: column;
  padding: 20px 0px 20px 20px;
  border: 1px solid black;
  background-color: white;
  top: 90px;
  right: 40px;
  z-index: 5;
  font-weight: lighter;
`;

export const CartDropdownButton = styled(CustomButton)`
  font-size: 1vw;
  margin-top: auto;
`;

export const EmptyMessageContainer = styled.span`
  letter-spacing: 1.3px;
  font-size: 18px;
  margin: 50px 0;
  align-self: center;
`;

export const CartItemsContainer = styled.div`
  height: 330px;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
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

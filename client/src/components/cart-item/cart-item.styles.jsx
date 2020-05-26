import styled from "styled-components";

export const CartItemContainer = styled.div`
  width: 100%;
  display: flex;
  height: 80px;
  margin-bottom: 15px;
`;

export const CartItemImage = styled.img`
  width: 30%;
`;

export const ItemDetailsContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 20px;
  letter-spacing: 1px;
  overflow-y: auto;
`;

export const RemoveButtonContainer = styled.div`
  ${"" /* align-self: center; */}
  cursor: pointer;
  margin: auto;
`;

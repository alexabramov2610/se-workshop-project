import styled from "styled-components";
import {CustomButton} from "../custom-button/custom-button.component";

export const ProductContainer = styled.div`
  margin-right: 20px;
  margin-bottom: 20px;
  width: 180px;
  display: flex;
  flex-direction: column;
  height: 250px;
  align-items: center;
  position: relative;
  opacity: ${({isSelected}) => isSelected ? 0.4 : 1}

  &:hover {
    .image {
      opacity: 0.8;
      transition: 300ms ease all;
    }

    button {
      opacity: 0.85;
      display: flex;
    }
  }
`;

export const AddDiscount = styled(CustomButton)`
  width: 80%;
  opacity: 0.7;
  position: absolute;
  top: 150px;
  display: none;
`;

export const BackgroundImage = styled.div`
  width: 100%;
  height: 95%;
  background-size: cover;
  background-position: center;
  margin-bottom: 5px;
  background-image: ${({imageUrl}) => `url(${imageUrl})`};
`;

export const ProductFooterContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  letter-spacing: 1px;
`;

export const NameContainer = styled.span`
  width: 90%;
  margin-bottom: 15px;
`;

export const PriceContainer = styled.span`
  margin-right: 15px;
  width: 10%;
`;


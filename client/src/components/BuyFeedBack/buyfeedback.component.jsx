import React from "react";
import { history } from "../../utils/config";
import {
  BuyFeedkBack,
  BuyFeedkBackInner,
  BuyFeedBackTitle,
} from "./buyfeedback.styles";
import FormInput from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import * as api from "../../utils/api";

const BuySuccess = () => (
  <BuyFeedkBack>
    <BuyFeedkBackInner>
      <BuyFeedBackTitle>Thank you for shopping with us!</BuyFeedBackTitle>
    </BuyFeedkBackInner>
  </BuyFeedkBack>
);

const BuyFail = () => (
  <BuyFeedkBack>
    <BuyFeedkBackInner>
      <BuyFeedBackTitle>Something Went Wrong</BuyFeedBackTitle>
    </BuyFeedkBackInner>
  </BuyFeedkBack>
);

export { BuySuccess };

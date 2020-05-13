import React from "react";
import * as api from "../../utils/api";
import FormInput from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import * as config from "../../utils/config";
import {
  SearchContainer,
  SignInTitle,
  ButtonsBarContainer,
  FiltersContainer,
} from "./search.styles";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saerchQuery: "",
      priceRange: "",
      productRating: "",
      storeRating: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { userName, password } = this.state;
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    console.log(this.props.onLogin);
    return (
      <SearchContainer>
        <SignInTitle>Search Items</SignInTitle>
        <form onSubmit={this.handleSubmit}>
          <FormInput
            name="saerchQuery"
            type="text"
            handleChange={this.handleChange}
            value={this.state.saerchQuery}
            label="Search"
            required
          />
          <FiltersContainer>
            <FormInput
              name="priceRange"
              type="text"
              value={this.state.priceRange}
              handleChange={this.handleChange}
              label="Price Range"
            />
            <FormInput
              name="productRating"
              type="text"
              value={this.state.productRating}
              handleChange={this.handleChange}
              label="Product Rating: 1-5"
            />
            <FormInput
              name="storeRating"
              type="text"
              value={this.state.storeRating}
              handleChange={this.handleChange}
              label="Store Rating"
            />
            <FormInput
              name="productCategory"
              type="text"
              value={this.state.productCategory}
              handleChange={this.handleChange}
              label="Product Category"
            />
          </FiltersContainer>
          <ButtonsBarContainer>
            <CustomButton type="submit"> Search! </CustomButton>
          </ButtonsBarContainer>
        </form>
      </SearchContainer>
    );
  }
}

export { Search };

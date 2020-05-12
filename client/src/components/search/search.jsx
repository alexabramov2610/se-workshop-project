import React from "react";
import { login } from "../../utils/api";
import FormInput from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import * as config from "../../utils/config";
import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer,
} from "./search.styles";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { searchQuery } = this.state;
    config.history.push(`/search/${searchQuery}`);
  };

  handleChange = (event) => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <FormInput
          name="searchQuery"
          type="text"
          handleChange={this.handleChange}
          value={this.state.searchQuery}
          label="Search"
          required
        />
        <ButtonsBarContainer>
          <CustomButton type="submit"> Search </CustomButton>
        </ButtonsBarContainer>
      </div>
    );
  }
}

export default SignIn;

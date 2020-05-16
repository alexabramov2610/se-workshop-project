import React from "react";
import { login } from "../../utils/api";
import FormInput from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import * as config from "../../utils/config";
import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer,
} from "./sign-in.styles";

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      password: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { userName, password } = this.state;

    try {
      login(userName, password).then(({ data }) => {
        if (!data.error || data.error.message === "Already at this state") {
          this.props.onLogin(userName);
          config.history.push("/");
        } else {
          alert("invalid details");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (event) => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    console.log(this.props.onLogin);
    return (
      <SignInContainer>
        <SignInTitle>Already have an account?</SignInTitle>
        <span>Sign in with your user name and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            name="userName"
            type="text"
            handleChange={this.handleChange}
            value={this.state.userName}
            label="User Name"
            required
          />
          <FormInput
            name="password"
            type="password"
            value={this.state.password}
            handleChange={this.handleChange}
            label="Password"
            required
          />
          <ButtonsBarContainer>
            <CustomButton type="submit"> Sign in </CustomButton>
          </ButtonsBarContainer>
        </form>
      </SignInContainer>
    );
  }
}

export default SignIn;

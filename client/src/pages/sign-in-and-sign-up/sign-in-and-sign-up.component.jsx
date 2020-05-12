import React from "react";

import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";
import { history } from "../../utils/config";
import { SignInAndSignUpContainer } from "./sign-in-and-sign-up.styles";

class SignInAndSignUpPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.isLoggedIn && history.push("/");
  }

  render() {
    const { onLogin, isLoggedIn } = this.props;
    return isLoggedIn ? (
      <div />
    ) : (
      <SignInAndSignUpContainer>
        <SignUp />
        <SignIn onLogin={onLogin} />
      </SignInAndSignUpContainer>
    );
  }
}

export { SignInAndSignUpPage };

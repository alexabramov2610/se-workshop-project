import React from "react";
import { history } from "../../utils/config";
import {
  CreateStorePageContainer,
  StoreFormContainer,
  CreateStoreTitle,
} from "./admin-init.component.jsx.styles";
import FormInput from "../../components/form-input/form-input.component";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";

class AdminInit extends React.Component {
  constructor() {
    super();
    this.state = {
      afterInit: false,
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { firstAdminName, firstAdminPassword } = this.state;
    console.log(this.state);
    this.setState({
      firstAdminPassword: "",
      firstAdminName: "",
    });
    await api.adminInit(firstAdminName, firstAdminPassword);
    this.setState({ afterInit: true }, () => window.location.reload());
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { firstAdminName, firstAdminPassword } = this.state;
    const { isLoggedIn } = this.props;
    this.state.afterInit && window.location.reload();
    return (
      <CreateStorePageContainer>
        <StoreFormContainer>
          <CreateStoreTitle>Set Up System Admin</CreateStoreTitle>
          <form className="sign-up-form" onSubmit={this.handleSubmit}>
            <FormInput
              type="text"
              name="firstAdminName"
              value={firstAdminName}
              onChange={this.handleChange}
              label="Admin User Name"
              required
            />
            <FormInput
              type="password"
              name="firstAdminPassword"
              value={firstAdminPassword}
              onChange={this.handleChange}
              label="Admin Password"
              required
            />

            <CustomButton type="submit">Create Admin User</CustomButton>
          </form>
        </StoreFormContainer>
      </CreateStorePageContainer>
    );
  }
}

export { AdminInit };

import React from "react";
import * as config from "../../utils/config";
import {
  CreateStorePageContainer,
  StoreFormContainer,
  CreateStoreTitle,
} from "./admin-init.component.jsx.styles";
import FormInput from "../../components/form-input/form-input.component";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";
import * as Modal from "../../components/modal/modal";
import Button from "antd/es/button";

class AdminInit extends React.Component {
  constructor() {
    super();
    this.state = {
      afterInit: false,
    };
  }


  initFromFile = async (event) => {
    event.preventDefault();
    const { data } = await api.initFromFile();
    console.log(data)
    if (data.data && data.data.result)
      this.setState({afterInit: true}, () => window.location.reload());
    else
      Modal.warning(data.error.message);
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
     // this.setState({ afterInit: true }, () => window.location.reload());
    //  console.log('history push')
    // window.location.reload()
    this.props.changeStatus();
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { firstAdminName, firstAdminPassword } = this.state;
    const { isLoggedIn } = this.props;
    this.state.afterInit && this.props.changeStatus();
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
            <CustomButton  style={{marginTop: "20px"}} onClick={this.initFromFile}>Init from file</CustomButton>

          </form>
        </StoreFormContainer>
      </CreateStorePageContainer>
    );
  }
}

export { AdminInit };

import React from "react";
import { history } from "../../utils/config";
import {
  CreateStorePageContainer,
  StoreFormContainer,
  CreateStoreTitle,
} from "./create-store-page.styles";
import FormInput from "../../components/form-input/form-input.component";
import { CustomButton } from "../../components/custom-button/custom-button.component";
class CreateStorePage extends React.Component {
  constructor() {
    super();
    this.state = {
      storeName: "",
      description: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { storeName, description } = this.state;
    console.log(this.state);
    this.setState({
      storeName: "",
      description: "",
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { storeName, description } = this.state;
    const { isLoggedIn } = this.props;
    return isLoggedIn ? (
      <div />
    ) : (
      <CreateStorePageContainer>
        <StoreFormContainer>
          <CreateStoreTitle>Don't have a Store?</CreateStoreTitle>
          <span>Create New Store And Start Trading</span>
          <form className="sign-up-form" onSubmit={this.handleSubmit}>
            <FormInput
              type="text"
              name="storeName"
              value={storeName}
              onChange={this.handleChange}
              label="Store Name"
              required
            />
            <FormInput
              type="text"
              name="storeDescription"
              value={description}
              onChange={this.handleChange}
              label="Store Description"
            />

            <CustomButton type="submit">Create Store!</CustomButton>
          </form>
        </StoreFormContainer>
      </CreateStorePageContainer>
    );
  }
}

export { CreateStorePage };

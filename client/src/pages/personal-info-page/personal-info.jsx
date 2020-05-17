import React from "react";
import { history } from "../../utils/config";
import * as api from "../../utils/api";
import * as config from "../../utils/config";
import {FiltersContainer, SearchContainer, SignInTitle} from "../../components/search/search.styles";
import FormInput from "../../components/form-input/form-input.component";
class PersonalInfo extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
      this.initPage();
  }

    async initPage() {
        const { data } = await api.getPersonalInfo();
        const { username, cart, managedStores, ownedStores } = data.data;
        this.setState({ username, cart, managedStores, ownedStores });
    }


    render() {
    return (
        <div>
          <SignInTitle>Personal Info</SignInTitle>
            <div style={{ minWidth: "155px" }}>Username: {this.state.username}</div>
            <div style={{ minWidth: "155px" }}>Cart: {JSON.stringify(this.state.cart)}</div>
            <div style={{ minWidth: "155px" }}>Managed Stores: {JSON.stringify(this.state.managedStores)}</div>
            <div style={{ minWidth: "155px" }}>Owned Stores: : {JSON.stringify(this.state.ownedStores)}</div>
        </div>
    );
  }
}

export { PersonalInfo };

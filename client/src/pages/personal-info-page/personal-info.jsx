import React from "react";
import { history } from "../../utils/config";
import * as api from "../../utils/api";
import * as config from "../../utils/config";
class PersonalInfo extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return <div>Personal Page of User {config.getLoggedInUser()}</div>;
  }
}

export { PersonalInfo };

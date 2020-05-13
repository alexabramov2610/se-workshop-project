import React from "react";
import HomePage from "./home-page";
import { HomePageCtx } from "./home-page-ctx";
export default class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.setState({ data: { exampleData: "hello world data" } });
  }

  render() {
    return this.state.data ? (
      <HomePageCtx.Provider value={this.state.data.exampleData}>
        <HomePage isLoggedIn={this.props.isLoggedIn} />
      </HomePageCtx.Provider>
    ) : null;
  }
}

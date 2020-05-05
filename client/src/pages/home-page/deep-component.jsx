import React from "react";
import { HomePageCtx } from "./home-page-ctx";
export default class DeepInside extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <HomePageCtx.Consumer>
        {(value) => <div> {value}</div>}
      </HomePageCtx.Consumer>
    );
  }
}

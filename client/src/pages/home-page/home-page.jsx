import React from "react";
import { Link } from "react-router-dom";
import DeepInside from "./deep-component";
const HomePage = () => {
  return (
    <div>
      <div>
        Home Page
        <br />
        <DeepInside />
        <Link to="/category">Got to category page</Link>
      </div>
    </div>
  );
};

export default HomePage;


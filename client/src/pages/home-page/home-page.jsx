import React from "react";
import { JoinCards } from "../../components/home-products-collection/home-join-cards";
import { CarouselUI } from "../../components/carousel/carousel";
import { StoresGrid } from "../../components/stores-grid/stores-grid";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div>
        <CarouselUI />
        <JoinCards isLoggedIn={isLoggedIn} />
        <StoresGrid />
      </div>
    );
  }
}
export default HomePage;

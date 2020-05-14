import React from "react";
import { JoinCards } from "../../components/home-products-collection/home-join-cards";
import { CarouselUI } from "../../components/carousel/carousel";
import { ProductsGrid } from "../../components/products-grid/products-grid";

 class StorePage extends React.Component {
  render() {
    return (
      <div>
        <ProductsGrid storename={this.props.match.params.storename} />
      </div>
    );
  }
}

export { StorePage };

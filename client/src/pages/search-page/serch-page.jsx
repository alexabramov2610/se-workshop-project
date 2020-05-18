import React from "react";
import { Search } from "../../components/search/search";
import { CarouselUI } from "../../components/carousel/carousel";
import { ProductsGrid } from "../../components/products-grid/products-grid";
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Search />
      </div>
    );
  }
}

export { SearchPage };

import React from "react";
import Card from "react-bootstrap/Card";
import { AiFillStar } from "react-icons/ai";
import { FiBox } from "react-icons/fi";
import { history } from "../../utils/config";
import { ProductBox } from "../product-box/product-box";
import * as api from "../../utils/api";
import { ProductGridContainer } from "./products-grid-container.styles.jsx";

const stores = [];
export class ProductsGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const { data } = await api.getStoreProducts(this.props.storename);
    const products = data.data.products.map((e) => e.product);
    this.setState({ products });
  }

  render() {
    return (
      <div
        style={{
          border: "1px solid gainsboro",
          borderRadius: "4px",
          padding: "20px",
        }}
      >
        <h1>Our Products:</h1>
        <ProductGridContainer>
          {this.state.products &&
            this.state.products.map((p, index) => (
              <ProductBox
                name={p.name}
                price={p.price}
                key={index}
                rating={p.rating}
                store={this.props.storename}
                cn={p.catalogNumber}
              />
            ))}{" "}
        </ProductGridContainer>
      </div>
    );
  }
}

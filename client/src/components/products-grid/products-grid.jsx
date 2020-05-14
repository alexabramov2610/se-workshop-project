import React from "react";
import Card from "react-bootstrap/Card";
import {AiFillStar} from "react-icons/ai";
import {FiBox} from "react-icons/fi";
import {history} from "../../utils/config";
import {ProductBox} from "../product-box/product-box";
import * as api from "../../utils/api";
import {ProductGridContainer} from "./products-grid-container.styles.jsx";

const stores = [];

export class ProductsGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        const {data} = await api.getStoreProducts(this.props.storename);
        const products = data.data.products.map((e) => e.product);
        this.setState({products});
        console.log(products);
    }

    render() {
        return (
            <ProductGridContainer>
                {this.state.products &&
                this.state.products.map((p, index) => (
                    <ProductBox
                        name={p.name}
                        price={p.price}
                        key={index}
                        rating={p.rating}
                    />
                ))}{" "}
            </ProductGridContainer>
        );
    }
}

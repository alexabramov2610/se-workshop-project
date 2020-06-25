import React from "react";
import Card from "react-bootstrap/Card";
import {AiFillStar} from "react-icons/ai";
import {FiBox} from "react-icons/fi";
import {history} from "../../utils/config";
import {ProductBox} from "../product-box/product-box";
import {ManageProductBox} from "../product-box/manage-product-box"
import * as api from "../../utils/api";
import {ProductGridContainer} from "./products-grid-container.styles.jsx";

const stores = [];

export class ProductsGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const {data} = await api.getStoreProducts(this.props.storeName);
        const products = data.data.products.map((e) => e.product);
        this.setState({products});
    }

    render() {
        return (
            <div>
                <ProductGridContainer>
                    {this.state.products &&
                    this.state.products.map((p, index) => {
                        return this.props.manage ? <ManageProductBox
                            name={p.name}
                            category={p.category.toLowerCase()}
                            price={p.price}
                            key={index}
                            rating={p.rating}
                            store={this.props.storeName}
                            cn={p.catalogNumber}
                        /> : <ProductBox
                            name={p.name}
                            category={p.category.toLowerCase()}
                            price={p.price}
                            key={index}
                            rating={p.rating}
                            store={this.props.storeName}
                            cn={p.catalogNumber}
                        />
                    })}
                </ProductGridContainer>
            </div>
        );
    }
}

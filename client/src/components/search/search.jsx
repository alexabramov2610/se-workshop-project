import React from "react";
import * as api from "../../utils/api";
// import { ProductBox } from "../product-box/product-box";
import {ProductBox} from "../../components/product-box/product-box";
import {ProductGridContainer} from "../../components/products-grid/products-grid-container.styles.jsx";
import FormInput from "../form-input/form-input.component";
import {CustomButton} from "../custom-button/custom-button.component";
import {InputGroup, FormControl, Dropdown, Button} from "react-bootstrap";
import * as config from "../../utils/config";
import {SearchWithDropDown} from './search-dropdown'
import {
    SearchContainer,
    SignInTitle,
    ButtonsBarContainer,
    FiltersContainer,
    SearchInputsContainer,
} from "./search.styles";
import {Space} from "antd";

const Category = {
    GENERAL: "GENERAL",
    ELECTRONICS: "ELECTRONICS",
    HOBBIES: "HOBBIES",
    HOME: "HOME",
    CLOTHING: "CLOTHING",
};
Object.freeze(Category);

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productName: "",
            storeName: "",
            productRating: "",
            storeRating: "",
            min: "",
            max: "",
        };
        this.updateRating = this.updateRating.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const {
            productCategory,
            productName,
            storeName,
            productRating,
            storeRating,
            min,
            max,
        } = this.state;
        const req = {
            body: {
                searchQuery: {storeName, productName},
                filters: {
                    priceRange: {min, max},
                    productRating:
                        productRating !== "" ? Number.parseInt(productRating) : "",
                    storeRating:
                        storeRating !== "" ? Number.parseInt(storeRating) : "",
                    productCategory,
                },
            },
        };
        const {data} = await api.search(req);
        const products = data.data.products.map((e) => {
            return {...e.product, store: e.storeName};
        });
        this.setState({products}, () => console.log("abs s", this.state));
    };
    handleChange = (event) => {
        const {value, name} = event.target;
        this.setState({[name]: value});
    };

    updateRating(type, rating) {
        this.setState({[type]: rating}, () => console.log(this.state));
    }

    clearFilters() {
        this.setState({
            // storeName: "",
            // productName: "",
            priceRange: "",
            productRating: "",
            storeRating: "",
            productCategory: undefined,
            min: "",
            max: "",
            q: ""
        });
    }

    dropdownHandleProducts = (value) => {
        console.log("Product", value);
        this.setState({productName: value});
    }

    dropdownHandleStores = (value) => {
        console.log("store", value);
        this.setState({storeName: value});
    }

    render() {
        return (
            <div>
                <SearchContainer>
                    <SignInTitle>Search Items</SignInTitle>
                    <form onSubmit={this.handleSubmit}>
                        <Space style={{padding: "40px"}}>
                            <SearchWithDropDown placeholder={"Select product"} value={this.state.productName} products onChangeCallback={this.dropdownHandleProducts}/>
                            <SearchWithDropDown placeholder={"Select store"} value={this.state.storeName} onChangeCallback={this.dropdownHandleStores}/>
                        </Space>
                        <Space>
                            <div style={{minWidth: "155px"}}>
                                <FilterDropDown
                                    name={this.state.storeRating}
                                    attrName="storeRating"
                                    array={[1, 2, 3, 4, 5]}
                                    handler={this.updateRating}
                                    prefix="Store Rating:"
                                />
                            </div>
                            <div style={{minWidth: "155px"}}>
                                <FilterDropDown
                                    name={this.state.productRating}
                                    attrName="productRating"
                                    array={[1, 2, 3, 4, 5]}
                                    handler={this.updateRating}
                                    prefix="Product Rating:"
                                />
                            </div>
                        </Space>
                        <Space>
                            <div
                                style={{
                                    minWidth: "155px",
                                }}
                            >
                                <FilterDropDown
                                    name={
                                        this.state.productCategory
                                            ? Object.keys(Category)[this.state.productCategory]
                                            : ""
                                    }
                                    attrName="productCategory"
                                    array={Object.keys(Category)}
                                    handler={this.updateRating}
                                    isCategory={true}
                                    prefix="Category:"
                                />
                            </div>
                            <InputGroup className="mb-3" style={{}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text
                                        style={{
                                            backgroundColor: "white",
                                            border: "none",
                                            marginBottom: "",
                                            marginLeft: "-10px",
                                        }}
                                    >
                                        {" "}
                                        Min / Max Price
                                    </InputGroup.Text>
                                </InputGroup.Prepend>

                                <FormControl
                                    name="min"
                                    style={{marginTop: "10px"}}
                                    type="number"
                                    onChange={this.handleChange}
                                    value={this.state.min}
                                />
                                <FormControl
                                    name="max"
                                    style={{marginTop: "10px"}}
                                    type="number"
                                    onChange={this.handleChange}
                                    value={this.state.max}
                                />
                            </InputGroup>
                        </Space>
                        <Button
                            onClick={this.clearFilters}
                            style={{height: "60%", marginTop: "14px"}}
                            variant="dark"
                        >
                            Clear Filters
                        </Button>
                        <ButtonsBarContainer>
                            <CustomButton onClick={this.handleSubmit}> Search! </CustomButton>
                        </ButtonsBarContainer>
                    </form>
                </SearchContainer>
                <ProductGridContainer>
                    {this.state.products &&
                    this.state.products.length > 0 &&
                    this.state.products.map((p, index) => (
                        <ProductBox
                            name={p.name}
                            price={p.price}
                            key={index}
                            rating={p.rating}
                            store={p.store}
                            cn={p.catalogNumber}
                        />
                    ))}{" "}
                </ProductGridContainer>
            </div>
        );
    }
}

const FilterDropDown = ({
                            name,
                            attrName,
                            array,
                            handler,
                            isCategory = false,
                            prefix,
                        }) => {
    return (
        <Dropdown style={{marginTop: "15px", marginBottom: "20px"}}>
            {prefix}
            <Dropdown.Toggle variant="" id="dropdown-basic">
                {name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {array.map((r) => (
                    <Dropdown.Item
                        key={r}
                        onSelect={(ek, e) =>
                            handler(
                                attrName,
                                isCategory
                                    ? Category[e.target.innerText]
                                    : Number.parseInt(e.target.innerText)
                            )
                        }
                    >
                        {" "}
                        {r}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export {Search};

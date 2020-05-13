import React from "react";
import * as api from "../../utils/api";
import FormInput from "../form-input/form-input.component";
import { CustomButton } from "../custom-button/custom-button.component";
import { InputGroup, FormControl, Dropdown, Button } from "react-bootstrap";
import * as config from "../../utils/config";
import {
  SearchContainer,
  SignInTitle,
  ButtonsBarContainer,
  FiltersContainer,
  SearchInputsContainer,
} from "./search.styles";

const Category = {
  GENERAL: 0,
  ELECTRONICS: 1,
  HOBBIES: 2,
  HOME: 3,
  CLOTHING: 4,
};
Object.freeze(Category);
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productName: "",
      storeName: "",
      productRating: "Product Rating",
      storeRating: "Store Rating",
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
        searchQuery: { storeName, productName },
        filters: {
          priceRange: { min, max },
          productRating:
            productRating !== "Product Rating" ? productRating : "",
          storeRating: storeRating !== "Store Rating" ? productRating : "",
          productCategory,
        },
      },
    };
    const { data } = await api.search(req);
    console.log(data);
  };
  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };
  updateRating(type, rating) {
    this.setState({ [type]: rating }, () => console.log(this.state));
  }
  clearFilters() {
    this.setState({
      saerchQuery: "",
      priceRange: "",
      productRating: "Product Rating",
      storeRating: "Store Rating",
      productCategory: undefined,
      min: "",
      max: "",
    });
  }
  render() {
    return (
      <SearchContainer>
        <SignInTitle>Search Items</SignInTitle>
        <form onSubmit={this.handleSubmit}>
          <SearchInputsContainer>
            <FormInput
              name="productName"
              type="text"
              handleChange={this.handleChange}
              value={this.state.productName}
              label="Product Name"
              required
            />
            <FormInput
              name="storeName"
              type="text"
              handleChange={this.handleChange}
              value={this.state.storeName}
              label="Store Name"
              required
            />
          </SearchInputsContainer>
          <FiltersContainer>
            <FilterDropDown
              name={this.state.storeRating}
              attrName="storeRating"
              array={[1, 2, 3, 4, 5]}
              handler={this.updateRating}
            />
            <FilterDropDown
              name={this.state.productRating}
              attrName="productRating"
              array={[1, 2, 3, 4, 5]}
              handler={this.updateRating}
            />
            <FilterDropDown
              name={
                this.state.productCategory
                  ? Object.keys(Category)[this.state.productCategory]
                  : "Category"
              }
              attrName="productCategory"
              array={Object.keys(Category)}
              handler={this.updateRating}
              isCategory={true}
            />
            <InputGroup className="mb-3" style={{ marginTop: "14px" }}>
              <InputGroup.Prepend>
                <InputGroup.Text
                  style={{ backgroundColor: "white", border: "none" }}
                >
                  {" "}
                  Min / Max Price
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                name="min"
                type="number"
                onChange={this.handleChange}
                value={this.state.min}
              />
              <FormControl
                name="max"
                type="number"
                onChange={this.handleChange}
                value={this.state.max}
              />
            </InputGroup>
            <Button
              onClick={this.clearFilters}
              style={{ height: "60%", marginTop: "14px" }}
              variant="dark"
            >
              Clear Filters
            </Button>{" "}
          </FiltersContainer>
          <ButtonsBarContainer>
            <CustomButton onClick={this.handleSubmit}> Search! </CustomButton>
          </ButtonsBarContainer>
        </form>
      </SearchContainer>
    );
  }
}

const FilterDropDown = ({
  name,
  attrName,
  array,
  handler,
  isCategory = false,
}) => {
  return (
    <Dropdown style={{ marginTop: "15px", marginBottom: "20px" }}>
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
                  : Number.parseInt(e.target.innerText) - 1
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

export { Search };

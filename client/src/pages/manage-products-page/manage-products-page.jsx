import React from "react";
import { ProductsGrid } from "../../components/products-grid/products-grid";
import { Divider, Layout } from "antd";
import { Form, FormDropdown } from "semantic-ui-react";
import { ManageProductsPageCtx } from "./manage-products-page-ctx";
import { Title, FormContainer } from "./manage-products-page.styles";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";
import * as Message from '../../components/custom-alert/custom-alert'
const { Header, Content } = Layout;
const Category = {
  GENERAL: 0,
  ELECTRONICS: 1,
  HOBBIES: 2,
  HOME: 3,
  CLOTHING: 4,
};
Object.freeze(Category);
class ManageProductsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catalogNumber: "",
      productName: "",
      productPrice: "",
      category: 0,
    };
    this.updateCat = this.updateCat.bind(this);
  }
  updateCat(value) {
    this.setState({ category: value });
  }
  handleSubmit = async (event,storeName) => {
    event.preventDefault()
    const { catalogNumber, productName, productPrice, category } = this.state;
    this.setState({
      catalogNumber: "",
      productName: "",
      productPrice: "",
      category: 0,
    });
    const addRes = await api.addProduct(
      storeName,
      catalogNumber,
      productName,
      productPrice,
      category
    );
    if(addRes.data.data.result){
      Message.success("Added product!")
      window.location.reload();
    }
    else
      Message.error(addRes.data.error.message)
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    if (!name && !value) {
      this.setState({ category: event.target.innerText });
    } else this.setState({ [name]: value });
  };

  render() {
    return (
      <ManageProductsPageCtx.Consumer>
        {(props) => (
          <Layout className="site-layout" style={{ backgroundColor: "white" }}>
            <Header style={{ backgroundColor: "white", fontSize: "25px" }}>
              <Divider style={{ fontSize: "25px" }} orientation={"left"}>
                Manage Products
              </Divider>
            </Header>
            <Layout>
              <Content
                className="site-layout-background"
                style={{
                  padding: "0px 30px",
                  minHeight: "70vh",
                  backgroundColor: "white",
                }}
              >
                <FormContainer>
                  <Title>Add new product</Title>
                  <Form>
                    <Form.Group>
                      <Form.Input
                        type="text"
                        name="catalogNumber"
                        value={this.state.catalogNumber}
                        onChange={this.handleChange}
                        label="Catalog NO"
                        required
                      />
                      <Form.Input
                        type="text"
                        name="productName"
                        value={this.state.productName}
                        onChange={this.handleChange}
                        label="Product Name"
                        required
                      />
                      <Form.Input
                        type="text"
                        name="productPrice"
                        value={this.state.productPrice}
                        onChange={this.handleChange}
                        label="Price"
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <FormDropdown
                        name="cate"
                        label="category"
                        options={Object.keys(Category).map((c, i) => {
                          return { key: i, text: c, value: c };
                        })}
                        value={this.state.category}
                        onChange={this.handleChange}
                        required={true}
                      />
                    </Form.Group>

                    <CustomButton
                      onClick={(ev) => this.handleSubmit(ev,props.storeName)}
                    >
                      Add product!
                    </CustomButton>
                  </Form>
                </FormContainer>
                <ProductsGrid storeName={props.storeName} manage={true} />
              </Content>
            </Layout>
          </Layout>
        )}
      </ManageProductsPageCtx.Consumer>
    );
  }
}

export { ManageProductsPage };

import React from "react";
import { ItemsGrid } from "../../components/items-grid/items-grid";
import { Divider, Layout, Row } from "antd";
import { FiBox } from "react-icons/fi";
import { Form, FormDropdown } from "semantic-ui-react";
import { ManageProductsPageCtx } from "./manage-products-page-ctx";
import { Title, FormContainer } from "./manage-products-page.styles";
import { CustomButton } from "../../components/custom-button/custom-button.component";
import * as Message from "../../components/custom-alert/custom-alert";
import * as api from "../../utils/api";
import Card from "react-bootstrap/Card";
import { ProductDetails } from "../../components/product-box/products-box.styles";
import { ProductGridContainer } from "../../components/products-grid/products-grid-container.styles";

const { Header, Content } = Layout;

class ManageProductItemsPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.info);
    this.state = {
      catalogNumber: "",
      info: props.info,
      productName: this.props.info.name,
      productPrice: this.props.info.price,
    };
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
  }

  async componentDidMount() {
    const { data } = await api.viewProductInfo(this.props.store, this.props.cn);
    const info = data.data.info;
    const items = await api.getProductItems(this.props.store, this.props.cn);
    this.setState({ info, items });
  }

  submitNewItem = async (event, storeName) => {
    event.preventDefault();
    const { catalogNumber } = this.state;
    this.setState({
      catalogNumber: "",
    });
    console.log("props:", this.props, "val:", event.target);
    await api.addItem(this.props.store, this.props.cn, this.state.itemId);
    const items = await api.getProductItems(this.props.store, this.props.cn);

    this.setState({ itemId: "", items });
  };

  submitEditProduct = async (event, storeName) => {
    event.preventDefault();
    const { productName, productPrice } = this.state;
    let somethingChanged = false;
    if (productName !== this.props.info.name) {
      const nameRes = await api.changeProductName(
        this.props.store,
        this.props.cn,
        productName
      );

      if (nameRes.data.data.result) {
        Message.success("Product name changed!");
        somethingChanged = true;
      } else Message.error(nameRes.data.error.message);
    }
    if (productPrice !== this.props.info.price) {
      const priceRes = await api.changeProductPrice(
        this.props.store,
        this.props.cn,
        productPrice
      );
      if (priceRes.data.data.result) {
        Message.success("Product price changed!");
        somethingChanged = true;
      } else Message.error(priceRes.data.error.message);
    }
    if (!somethingChanged) Message.error("Nothing changed...");
    else window.location.reload();
    //api
  };
  handleRemoveItem = async (id) => {
    await api.removeItem(this.props.store, this.props.cn, id);
    const items = await api.getProductItems(this.props.store, this.props.cn);
    this.setState({ items });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <ManageProductsPageCtx.Consumer>
        {(props) => (
          <Layout className="site-layout" style={{ backgroundColor: "white" }}>
            <Header style={{ backgroundColor: "white", fontSize: "25px" }}>
              <Divider style={{ fontSize: "25px" }} orientation={"left"}>
                Manage Product: {this.state.info.name} in store{" "}
                {this.props.store}
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
                <Row>
                  <FormContainer>
                    <Title>Edit product</Title>
                    <Form>
                      <Form.Group>
                        <Form.Input
                          type="text"
                          name="productName"
                          value={this.state.productName}
                          onChange={this.handleChange}
                          label="Name"
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
                      <CustomButton
                        onClick={(ev) =>
                          this.submitEditProduct(ev, props.storeName)
                        }
                      >
                        EDIT!
                      </CustomButton>
                    </Form>
                  </FormContainer>

                  <FormContainer>
                    <Title>Add new item</Title>
                    <Form>
                      <Form.Group>
                        <Form.Input
                          type="text"
                          name="itemId"
                          value={this.state.itemId}
                          onChange={this.handleChange}
                          label="Item Id"
                          required
                        />
                      </Form.Group>

                      <CustomButton
                        type="submit"
                        onClick={(ev) =>
                          this.submitNewItem(ev, props.storeName)
                        }
                      >
                        Add Item!
                      </CustomButton>
                    </Form>
                  </FormContainer>
                </Row>
                <ProductGridContainer>
                  {this.state.items &&
                    this.state.items.map((i) => (
                      <Item
                        cn={this.props.cn}
                        id={i}
                        onRemove={this.handleRemoveItem}
                      />
                    ))}
                </ProductGridContainer>
              </Content>
            </Layout>
          </Layout>
        )}
      </ManageProductsPageCtx.Consumer>
    );
  }
}

const Item = ({ cn, id, onRemove }) => (
  <Card className="text-center grid-item">
    <Card.Body>
      <ProductDetails>
        <div>Catalog Number: {cn}</div>
        <div>Item Id: {id}</div>
      </ProductDetails>
    </Card.Body>
    <Card.Footer>
      <CustomButton onClick={() => onRemove(id)} style={{ margin: "auto" }}>
        Remove
      </CustomButton>
    </Card.Footer>
  </Card>
);

export default ManageProductItemsPage;

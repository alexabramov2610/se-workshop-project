import React from "react";
import {ItemsGrid} from "../../components/items-grid/items-grid";
import {Divider, Layout, Row} from "antd";
import {Form, FormDropdown} from "semantic-ui-react";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {Title, FormContainer} from "./manage-products-page.styles";
import {CustomButton} from "../../components/custom-button/custom-button.component";

import * as api from "../../utils/api";

const {Header, Content} = Layout;


class ManageProductItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogNumber: "",
          productName: "",
            info: props.info,
        };
    }

    async componentDidMount() {
        const {data} = await api.viewProductInfo(this.props.store, this.props.cn);
        const info = data.data.info;
        this.setState({info});
    }


    submitNewItem = async (event, storeName) => {
        event.preventDefault()
        const {catalogNumber} = this.state;
        this.setState({
            catalogNumber: "",
        });
//api

    };

  submitChangeName = async (event, storeName) => {
    event.preventDefault()
    const {productName} = this.state;
    this.setState({
      productName: "",
    });
//api

  };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    };

    render() {
        return (
            <ManageProductsPageCtx.Consumer>
                {(props) => (
                    <Layout className="site-layout" style={{backgroundColor: "white"}}>
                        <Header style={{backgroundColor: "white", fontSize: "25px"}}>
                            <Divider style={{fontSize: "25px"}} orientation={"left"}>
                                Manage Product: {this.state.info.name} in store {this.props.store}
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
                                    <Title>Change product name</Title>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input
                                                type="text"
                                                name="productName"
                                                value={this.state.productName}
                                                onChange={this.handleChange}
                                                label="Product name"
                                                required
                                            />
                                        </Form.Group>

                                            <CustomButton
                                                onClick={(ev) => this.submitChangeName(ev, props.storeName)}
                                            >
                                                Change name!
                                            </CustomButton>

                                    </Form>
                                </FormContainer>

                              <FormContainer>
                                <Title>Add new item</Title>
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
                                  </Form.Group>

                                  <CustomButton
                                      onClick={(ev) => this.submitNewItem(ev, props.storeName)}
                                  >
                                    Add Item!
                                  </CustomButton>
                                </Form>
                              </FormContainer>
                          </Row>
                                <ItemsGrid storeName={this.props.store} manage={true}/>
                            </Content>
                        </Layout>
                    </Layout>
                )}
            </ManageProductsPageCtx.Consumer>
        );
    }
}

export default ManageProductItemsPage;

import React from "react";
import {ItemsGrid} from "../../components/items-grid/items-grid";
import {Divider, Layout, Row} from "antd";
import {Form, FormDropdown} from "semantic-ui-react";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {Title, FormContainer} from "./manage-products-page.styles";
import {CustomButton} from "../../components/custom-button/custom-button.component";
import * as Message from '../../components/custom-alert/custom-alert'
import * as api from "../../utils/api";

const {Header, Content} = Layout;


class ManageProductItemsPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.info)
        this.state = {
            catalogNumber: "",
            info: props.info,
            productName: this.props.info.name,
            productPrice: this.props.info.price
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

    submitEditProduct = async (event, storeName) => {
        event.preventDefault()
        const {productName, productPrice} = this.state;
        let somethingChanged = false;
        if(productName !== this.props.info.name){
            const nameRes = await api.changeProductName(this.props.store, this.props.cn,productName);
            console.log(nameRes)
            if(nameRes.data.data.result){
                Message.success("Product name changed!")
                somethingChanged= true;
            }
            else
                Message.error(nameRes.data.error.message)
        }
        if(productPrice !== this.props.info.price){
            const priceRes = await api.changeProductPrice(this.props.store, this.props.cn,productPrice);
            if(priceRes.data.data.result){
                Message.success("Product price changed!")
                somethingChanged= true;
            }
            else
                Message.error(priceRes.data.error.message)
        }
        if(!somethingChanged) Message.error("Nothing changed...")
        else
            window.location.reload();
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
                                                onClick={(ev) => this.submitEditProduct(ev, props.storeName)}
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

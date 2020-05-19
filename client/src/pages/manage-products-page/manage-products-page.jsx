import React from "react";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout} from "antd";
import {Form, FormDropdown, FormSelect} from "semantic-ui-react";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {useParams} from "react-router-dom";
import {Title, FormContainer} from "./manage-products-page.styles";
import FormInput from "../../components/form-input/form-input.component";
import {CustomButton} from "../../components/custom-button/custom-button.component";
import * as api from "../../utils/api";


const {Header, Content} = Layout;
const ProductCategory = ["GENERAL", "ELECTRONICS","HOBBIES","HOME","CLOTHING"];
class ManageProductsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: "Manage Products", productName: "", productPrice: "" }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { storeName, description } = this.state;
        console.log(this.state);
        this.setState({
            catalogNumber: "",
            productName: "",
            productPrice: "",
            category: "GENERAL",
        });
        api.createStore(storeName, description);
    };

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    };
    render() {
        return (
            <ManageProductsPageCtx.Consumer>
                {

                    props =>  <Layout className="site-layout" style={{backgroundColor: "white"}}>
                        <Header style={{backgroundColor: "white", fontSize: "25px"}}>
                            {console.log(props)}
                            {this.state.title}
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
                                            required/>
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
                                            <Form.Select required options={ProductCategory.map((c,i)=> { return { key: i, text: c, value: i }})} placeholder='Category' value={this.state.category} />
                                        </Form.Group>

                                        <CustomButton onClick={() => this.handleSubmit()}>Add product!</CustomButton>
                                    </Form>
                                </FormContainer>

                                <ProductsGrid storeName={props.storeName} manage={true} />
                            </Content>
                        </Layout>
                    </Layout>
                }
            </ManageProductsPageCtx.Consumer>
        );
    }
}

export {ManageProductsPage};

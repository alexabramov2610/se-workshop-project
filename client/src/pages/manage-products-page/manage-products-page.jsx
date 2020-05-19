import React from "react";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout} from "antd";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {useParams} from "react-router-dom";


const {Header, Content} = Layout;
const titles = ["Our Products", "Your Discount Policy", "Your Buying Policy", "Manage Permissions"];
const steps = [];


class ManageProductsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: "Manage Products"}
    }

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

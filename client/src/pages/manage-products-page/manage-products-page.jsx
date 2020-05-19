import React from "react";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout} from "antd";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {ManageProudctsPageCtx} from "./manage-proudcts-page-ctx";


const {Sider, Header, Content} = Layout;
const titles = ["Our Products", "Your Discount Policy", "Your Buying Policy", "Manage Permissions"];
const steps = [];

class ManageProductsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title= "Manage Products"}
    }

    render() {
        return (
            <ManageProudctsPageCtx.Consumer>
                {
                    props => <Layout className="site-layout" style={{backgroundColor: "white"}}>
                        <Header style={{backgroundColor: "white", fontSize: "25px"}}>
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
                                <ProductsGrid storeName={props.storeName}/>
                            </Content>
                            <Sider>
                                <StoreMenu onChange={this.onChange} />
                            </Sider>
                        </Layout>
                    </Layout>
                }
            </ManageProudctsPageCtx.Consumer>
        );
    }
}

export {ManageProductsPage};

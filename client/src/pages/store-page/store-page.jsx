import React from "react";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout} from "antd";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {StorePageCtx} from "./store-page-ctx";
import ManageProductsContainer from "../manage-products-page/manage-products-page-container";
import DiscountPageContainer from "../discount-page/discount-page-container";


const {Sider, Header, Content} = Layout;
// const titles = ["Our Products", "Your Discount Policy", "Your Buying Policy", "Manage Permissions"];
const screens = [<ManageProductsContainer/>, <DiscountPageContainer/>];

const layoutStyle = {backgroundColor: "white"};
// const headerStyle = {backgroundColor: "white", fontSize: "25px"};
const contentStyle = {padding: "0px 30px", minHeight: "70vh", backgroundColor: "white",};

class StorePage extends React.Component {

    state = {screen: 0};

    onChange = (e) => {
        const screenIdx = parseInt(e.key) - 1;
        this.setState({screen: screenIdx});
    }

    render() {
        return (
            <StorePageCtx.Consumer>
                {
                    props => {
                        const isManager = props.permissions.length !== 0;
                        return (<Layout className="site-layout" style={layoutStyle}>
                            <Layout>
                                <Content className="site-layout-background" style={contentStyle}>
                                    {isManager
                                        ? screens[this.state.screen]
                                        : <ProductsGrid storeName={props.info.storeName}/>}
                                </Content>
                                {isManager &&
                                <Sider>
                                    <StoreMenu onChange={this.onChange}/>
                                </Sider>}
                            </Layout>
                        </Layout>);
                    }
                }
            </StorePageCtx.Consumer>
        );
    }
}

export {StorePage};

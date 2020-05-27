import React from "react";
import {Layout} from "antd";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {StorePageCtx} from "./store-page-ctx";
import ManageProductsContainer from "../manage-products-page/manage-products-page-container";
import DiscountPageContainer from "../discount-page/discount-page-container";
import StoreOverview from "../../components/store-overview/store-overview.component";
import * as utils from "./store-page-utils";
import ManagePermissionsPageContainer from "../manage-permissions-page/manage-permissions-page-container";
import AddManagerModal from "../../components/add-manager-modal/add-manager-modal.component";


const {Sider, Content} = Layout;
const screens = [
    <StoreOverview/>,
    <div>EDIT STORE INFO</div>,
    <ManageProductsContainer/>,
    <DiscountPageContainer/>,
    <div>MANAGE BUYING POLICY</div>,
    <ManagePermissionsPageContainer/>
];

const layoutStyle = {backgroundColor: "white"};
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
                        return (<Layout className="site-layout" style={layoutStyle}>
                            <Layout>
                                <Content className="site-layout-background" style={contentStyle}>
                                    {screens[this.state.screen]}
                                </Content>
                                {utils.isManager(props) &&
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

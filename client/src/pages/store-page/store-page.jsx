import React from "react";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout} from "antd";
import {StoreMenu} from "../../components/store-menu/store-menu.component";
import {StorePageCtx} from "./store-page-ctx";


const {Sider, Header, Content} = Layout;
const titles = ["Our Products", "Your Discount Policy", "Your Buying Policy", "Manage Permissions"];
const steps = [];

const layoutStyle = {backgroundColor: "white"};
const headerStyle = {backgroundColor: "white", fontSize: "25px"};
const contentStyle = {padding: "0px 30px", minHeight: "70vh", backgroundColor: "white",};

class StorePage extends React.Component {

    state = {title: titles[0]};

    onChange = (e) => {
        const titleIdx = parseInt(e.key) - 1;
        this.setState({title: titles[titleIdx]});
    }

    render() {
        return (
            <StorePageCtx.Consumer>
                {
                    props => <Layout className="site-layout" style={layoutStyle}>
                        <Header style={headerStyle}>
                            {this.state.title}
                        </Header>
                        <Layout>
                            <Content className="site-layout-background" style={contentStyle}>
                                <ProductsGrid storeName={props.storeName}/>
                            </Content>
                            <Sider>
                                <StoreMenu onChange={this.onChange}/>
                            </Sider>
                        </Layout>
                    </Layout>
                }
            </StorePageCtx.Consumer>
        );
    }
}

export {StorePage};

import React from "react";
import {JoinCards} from "../../components/home-products-collection/home-join-cards";
import {CarouselUI} from "../../components/carousel/carousel";
import {ProductsGrid} from "../../components/products-grid/products-grid";
import {Layout, Menu} from "antd";
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined
} from '@ant-design/icons';


const {Sider, Header, Content} = Layout;
const {SubMenu} = Menu;

class StorePage extends React.Component {
    render() {
        return (

            <Layout>
                <Layout className="site-layout" style={{backgroundColor: "white"}}>
                    <Header style={{backgroundColor: "white"}}>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 750,
                            maxHeight: 800,
                            backgroundColor: "white"
                        }}
                    >
                        <ProductsGrid storename={this.props.match.params.storename}/>
                    </Content>
                    <Sider>
                        <Menu
                            mode="vertical"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{height: '100%', borderLeft: "solid 1px black"}}
                        >
                            <Menu.Item key="1">View Products</Menu.Item>
                            <Menu.Item key="2">Manage Discount Policy</Menu.Item>
                            <Menu.Item key="3">Manage Buying Policy</Menu.Item>
                            <Menu.Item key="4">Manage Permissions</Menu.Item>
                            {/*If you need sub menu, this is an example*/}
                            {/*<SubMenu key="sub3" icon={<NotificationOutlined/>} title="subnav 3">*/}
                            {/*    <Menu.Item key="9">option9</Menu.Item>*/}
                            {/*    <Menu.Item key="10">option10</Menu.Item>*/}
                            {/*    <Menu.Item key="11">option11</Menu.Item>*/}
                            {/*    <Menu.Item key="12">option12</Menu.Item>*/}
                            {/*</SubMenu>*/}
                        </Menu>
                    </Sider>
                </Layout>
            </Layout>
        );
    }
}

export {StorePage};

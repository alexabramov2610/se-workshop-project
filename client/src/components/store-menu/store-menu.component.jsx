import React from 'react';
import {Menu} from "antd";
import {
    AppstoreAddOutlined,
    PercentageOutlined,
    ShoppingOutlined,
    UserOutlined,
    AppstoreOutlined,
    EditOutlined,
    UsergroupAddOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import {StorePageCtx} from "../../pages/store-page/store-page-ctx";
import * as utils from "../../pages/store-page/store-page-utils";

const {SubMenu} = Menu;
const menuStyle = {height: '100%', borderLeft: '1px solid', backgroundColor: "white"};

const StoreMenu = ({onChange}) => {

    return (
        <StorePageCtx.Consumer>
            {props => <Menu
                onClick={(e) => onChange(e)}
                mode="inline"
                style={menuStyle}
                defaultSelectedKeys={["1"]}
            >
                <Menu.Item key="1" icon={<AppstoreOutlined/>}>Store Overview</Menu.Item>
                {utils.isManager(props) &&
                <Menu.Item key="2" icon={<HistoryOutlined />}>Store Purchases History</Menu.Item>}
                {utils.hasPermission(utils.permissions.MANAGE_INVENTORY, props.permissions) &&
                <Menu.Item key="3" icon={<AppstoreAddOutlined/>}>Manage Products</Menu.Item>}
                {utils.hasPermission(utils.permissions.MODIFY_DISCOUNT, props.permissions) &&
                <Menu.Item key="4" icon={<PercentageOutlined/>}>Manage Discount Policy</Menu.Item>}
                {utils.hasPermission(utils.permissions.MODIFY_BUYING_METHODS, props.permissions) &&
                <Menu.Item key="5" icon={<ShoppingOutlined/>}>Manage Buying Policy</Menu.Item>}
                {utils.isOwner(props) &&
                <SubMenu icon={<UsergroupAddOutlined/>} title="Manage Stuff">
                    <Menu.Item key="6" icon={<UserOutlined />}>
                        Managers
                    </Menu.Item>
                    <Menu.Item key="7" icon={<UserOutlined />}>
                        Owners
                    </Menu.Item>
                </SubMenu>}
            </Menu>
            }
        </StorePageCtx.Consumer>
    );
}

export {StoreMenu};


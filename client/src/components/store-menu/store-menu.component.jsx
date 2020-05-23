import React from 'react';
import {Menu} from "antd";
import {
    AppstoreAddOutlined,
    PercentageOutlined,
    ShoppingOutlined,
    LockOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import {StorePageCtx} from "../../pages/store-page/store-page-ctx";
import * as utils from "../../pages/store-page/store-page-utils";

const menuStyle = {height: '100%', borderLeft: '1px solid', backgroundColor: "white"};

const StoreMenu = ({onChange}) => {

    return (
        <StorePageCtx.Consumer>
            {props => <Menu
                onClick={(e) => onChange(e)}
                mode="vertical"
                style={menuStyle}
                defaultSelectedKeys={["1"]}
            >
                <Menu.Item key="1" icon={<AppstoreOutlined/>}>Store Overview</Menu.Item>
                {utils.hasPermission(utils.permissions.MANAGE_INVENTORY, props.permissions) &&
                <Menu.Item key="2" icon={<AppstoreAddOutlined/>}>Manage Products</Menu.Item>}
                {utils.hasPermission(utils.permissions.MODIFY_DISCOUNT, props.permissions) &&
                <Menu.Item key="3" icon={<PercentageOutlined/>}>Manage Discount Policy</Menu.Item>}
                {utils.hasPermission(utils.permissions.MODIFY_BUYING_METHODS, props.permissions) &&
                <Menu.Item key="4" icon={<ShoppingOutlined/>}>Manage Buying Policy</Menu.Item>}
                {utils.isOwner(props) && <Menu.Item key="5" icon={<LockOutlined/>}>Manage Permissions</Menu.Item>}
            </Menu>
            }
        </StorePageCtx.Consumer>
    );
}

export {StoreMenu};


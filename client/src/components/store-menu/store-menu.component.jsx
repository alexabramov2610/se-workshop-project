import React from 'react';
import {Menu} from "antd";
import {
    AppstoreAddOutlined,
    PercentageOutlined,
    ShoppingOutlined,
    LockOutlined,
} from '@ant-design/icons';


const {SubMenu} = Menu; //in case you need a sub menu

const StoreMenu = ({onChange}) => {

    return (
        <Menu
            onClick={(e) => onChange(e)}
            mode="vertical"
            style={{height: '100%', borderLeft: '1px solid'}}
        >
            <Menu.Item key="1" icon={<AppstoreAddOutlined />}>Manage Products</Menu.Item>
            <Menu.Item key="2" icon={<PercentageOutlined />}>Manage Discount Policy</Menu.Item>
            <Menu.Item key="3" icon={<ShoppingOutlined />}>Manage Buying Policy</Menu.Item>
            <Menu.Item key="4" icon={<LockOutlined />}>Manage Permissions</Menu.Item>

        </Menu>
    );
}

export {StoreMenu};

// If you need sub menu, this is an example
// <SubMenu key="sub3" icon={<NotificationOutlined/>} title="subnav 3">
//     <Menu.Item key="9">option9</Menu.Item>
// <Menu.Item key="10">option10</Menu.Item>
// <Menu.Item key="11">option11</Menu.Item>
// <Menu.Item key="12">option12</Menu.Item>
// </SubMenu>

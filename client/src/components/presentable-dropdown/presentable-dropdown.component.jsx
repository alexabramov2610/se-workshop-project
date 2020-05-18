import React from 'react';
import 'antd/dist/antd.css';
import {Menu, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';

const PresentableDropdown = ({inputs}) => {

    const menu = (
        <Menu>
            {inputs.map(i => <Menu.Item key={i}>{i}</Menu.Item>)}
        </Menu>
    );

    return (
        <div>
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    conditions<DownOutlined/>
                </a>
            </Dropdown>
        </div>
    );
}


export default PresentableDropdown;
import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Menu, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {DiscountPageCtx} from "../../../pages/discount-page/discount-page-ctx";
import * as utils from "../../../pages/discount-page/discount-page-utils";

const conditionStyle = {display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "14.2%"};

const SelectableDropdownComponent = ({inputs, discountKey, initialValue}) => {

    const [operator, setOperator] = useState(initialValue);

    const handleSelect = (e, props) => {
        setOperator(e.key);
        props.setPolicyDiscounts(prevDiscounts => {
            return prevDiscounts.map(d => {
                console.log(d);
                return d.key === discountKey ? {...d, operator: e.key} : d
            });
        });
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => {
                    const menu = (
                        <Menu onClick={e => handleSelect(e, props)}>
                            {inputs.map(i => <Menu.Item key={i}>{i}</Menu.Item>)}
                        </Menu>
                    );

                    return <div style={conditionStyle}>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                {operator}<DownOutlined/>
                            </a>
                        </Dropdown>
                    </div>
                }
            }
        </DiscountPageCtx.Consumer>
    );
};


export default SelectableDropdownComponent;
import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Menu, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const conditionStyle = {display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "14.2%"};

const SelectableDropdownComponent = ({inputs, discountKey}) => {

    const [operator, setOperator] = useState(inputs[0]);

    const handleClick = (e, props) => {
        setOperator(e.key);
        props.setDiscounts(prevDiscounts => {
            return [...prevDiscounts.map(d => {
                return d.key === discountKey ? {...d, operator: e.key} : d
            })];
        });
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => {
                    const menu = (
                        <Menu onClick={e => handleClick(e, props)}>
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
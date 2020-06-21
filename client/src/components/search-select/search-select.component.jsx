import React from "react";
import {Select} from "antd";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const {Option} = Select;

const SearchSelect = ({size, isMultiple, bordered,onSearch, placeholder, options, onChangeCallback, initialValue, value, width, isLoading}) => {

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <Select
                    size={size}
                    loading={isLoading}
                    mode={isMultiple ? "multiple": undefined}
                    showArrow
                    bordered={bordered}
                    showSearch
                    style={{width: width ? width : 200}}
                    placeholder={placeholder}
                    optionFilterProp="children"
                    onChange={(e) => onChangeCallback(e, props)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={initialValue}
                    value={value}
                >
                    {options ? options.map(option => <Option value={option.value}>{option.value}</Option>) : null};
                </Select>

            }
        </DiscountPageCtx.Consumer>
    );
}

export default SearchSelect;


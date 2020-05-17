import React from "react";
import {Select} from "antd";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const {Option} = Select;

const SearchSelect = ({isMultiple, bordered, placeholder, options, onChangeCallback, initialValue}) => {

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <Select
                    multiple={isMultiple}
                    bordered={bordered}
                    showSearch
                    style={{width: 200}}
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
                >
                    {options ? options.map(option => <Option value={option.value}>{option.value}</Option>) : null};
                </Select>

            }
        </DiscountPageCtx.Consumer>
    );
}

export default SearchSelect;


import React from "react";
import {Select} from "antd";

const {Option} = Select;

const SearchSelect = ({isMultiple, bordered, placeholder, options, onChangeCallback}) => {

    function onChange(value) {
        onChangeCallback(value);
    }

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
        <Select
            multiple={isMultiple}
            bordered={bordered}
            showSearch
            style={{ width: 200 }}
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {options ? options.map(option => <Option value={option.value}>{option.value}</Option>): null};
        </Select>
    );
}

export default SearchSelect;


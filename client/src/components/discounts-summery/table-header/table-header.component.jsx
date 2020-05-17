import React from "react";
import {HeaderContainer} from "./table-header.styles";

const conditionStyle = {display: "flex", flexWrap: "wrap", justifyContent: "canter", width: "14.2%"};
const operatorStyle = {display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "14.2%"};

const TableHeader = () => {
    return (
        <HeaderContainer>
            <span style={conditionStyle}>preform actions</span>
            <span style={conditionStyle}>Subject</span>
            <span style={conditionStyle}>Products</span>
            <span style={conditionStyle}>Discount</span>
            <span style={conditionStyle}>Start Date</span>
            <span style={conditionStyle}>Duration</span>
            <span style={conditionStyle}>Condition</span>
            <span style={conditionStyle}>Coupon</span>
            <span style={operatorStyle}>Operator</span>
        </HeaderContainer>
    );
}

export default TableHeader;
import React from "react";
import {HeaderContainer} from "./table-header.styles";

const conditionStyle = {display: "flex", flexWrap: "wrap", justifyContent: "center", width: "14.5%"};
const actionsStyle = {display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "14.5%"};
const operatorStyle = {display: "flex", flexWrap: "wrap", justifyContent: "center", width: "8%"};

const TableHeader = () => {
    return (
        <HeaderContainer>
            <span style={actionsStyle}>Perform Actions</span>
            <span style={conditionStyle}>Subject</span>
            <span style={conditionStyle}>Product</span>
            <span style={conditionStyle}>Minimum</span>
            <span style={conditionStyle}>Maximum</span>
            <span style={conditionStyle}>Not For Sell Days</span>
            <span style={operatorStyle}>operator</span>
        </HeaderContainer>
    );
}

export default TableHeader;
import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import SelectableDropdownComponent from "../../selectable-dropdown/selectable-dropdown.component";
import moment from "moment";
import PresentableDropdown from "../../presentable-dropdown/presentable-dropdown.component";

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid grey;
  margin-bottom: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;

const basicStyle = {display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "14.2%"};
const emptyField = "--------"

function TableRow({index, discount}) {

    const coupon = discount.coupon ? discount.coupon : emptyField;
    const productsStrings = discount.products.map(catalogNumber => catalogNumber + "");
    const productsWithComma = productsStrings.join(", ");
    const products = productsWithComma.length === 0 ? emptyField : productsWithComma;

    const reducedConditions = discount.condition.reduce((acc, curr) => {
        const currDesc = curr.condition && curr.condition.minPay
            ? `store minimum subtotal: ${curr.condition.minPay} `
            : curr.condition && curr.condition.minAmount
                ? `minimum amount: ${curr.condition.minAmount} for product: ${curr.condition.catalogNumber} `
                : `on discount: ${curr.condition.catalogNumber} `;
        return [...acc, currDesc + curr.operator];
    }, []);
    const conditions = reducedConditions.length === 0 ? [emptyField] : reducedConditions;

    return (
        <Draggable draggableId={discount.key + ""} index={index}>
            {provided => (
                <Row
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <span style={basicStyle}>{products}</span>
                    <span style={basicStyle}>{discount.percentage}%</span>
                    <span style={basicStyle}>{moment(discount.startDate).format('DD-MMM-YYYY')}</span>
                    <span style={basicStyle}>{discount.duration} days</span>
                    <span style={basicStyle}>
                        <PresentableDropdown inputs={conditions}/>
                    </span>
                    <span style={basicStyle}>{coupon}</span>
                    <SelectableDropdownComponent discountKey={discount.key} inputs={["AND", "OR", "XOR"]}/>
                </Row>
            )}
        </Draggable>
    );
}

export default TableRow;



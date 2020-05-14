import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import SelectableDropdownComponent from "../../selectable-dropdown/selectable-dropdown.component";
import moment from "moment";
import PresentableDropdown from "../../presentable-dropdown/presentable-dropdown.component";
import {Button, Popconfirm, Space} from "antd";
import {parseConditions, parseProducts} from "../row-parser";
import {DiscountPageCtx} from "../../../pages/discount-page/discount-page-ctx";

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
    const currDiscount = discount.discount;
    const parsedProducts = parseProducts(currDiscount.products);
    const reducedConditions = parseConditions(currDiscount.condition);

    const products = parsedProducts.length === 0 ? emptyField : parsedProducts;
    const conditions = reducedConditions.length === 0 ? [emptyField] : reducedConditions;
    const coupon = currDiscount.coupon ? currDiscount.coupon : emptyField;

    const handleRemove = (props) => {
        props.setPolicyDiscounts(prevDiscounts => {
            return prevDiscounts.filter(d => d.key !== discount.key);
        });
    };

    return (
        <Draggable draggableId={discount.key} index={index}>
            {provided => (
                <DiscountPageCtx.Consumer>
                    {
                        props => <Row
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                    <span style={basicStyle}>
                        <Space>
                            <Popconfirm title="Are you sure delete this discount from the policy?"
                                        onConfirm={() => handleRemove(props)}><a href="#">delete</a></Popconfirm>
                            <Button type="link">edit</Button>
                        </Space>
                    </span>
                            <span style={basicStyle}>{products}</span>
                            <span style={basicStyle}>{currDiscount.percentage}%</span>
                            <span style={basicStyle}>{moment(currDiscount.startDate).format('DD-MMM-YYYY')}</span>
                            <span style={basicStyle}>{currDiscount.duration} days</span>
                            <span style={basicStyle}>
                        <PresentableDropdown inputs={conditions}/>
                    </span>
                            <span style={basicStyle}>{coupon}</span>
                            <SelectableDropdownComponent discountKey={discount.key} inputs={["AND", "OR", "XOR"]}
                                                         initialValue={discount.operator}/>
                        </Row>
                    }
                </DiscountPageCtx.Consumer>
            )}
        </Draggable>
    );
}

export default TableRow;



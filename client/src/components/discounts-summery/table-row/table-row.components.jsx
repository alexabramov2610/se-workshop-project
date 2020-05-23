import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import SelectableDropdownComponent from "../selectable-dropdown/selectable-dropdown.component";
import moment from "moment";
import PresentableDropdown from "../../presentable-dropdown/presentable-dropdown.component";
import {Button, Popconfirm, Space} from "antd";
import * as rowParser from "../row-parser";
import {DiscountPageCtx} from "../../../pages/discount-page/discount-page-ctx";
import {config} from '../../../pages/discount-page/discount-page-config';
import * as utils from "../../../pages/discount-page/discount-page-utils";


const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid grey;
  margin-bottom: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;
const basicStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "14.2%",
    alignItems: "center"
};

function TableRow({index, discount}) {
    const currDiscount = discount.discount;
    const parsedProducts = rowParser.parseProducts(currDiscount.products);
    const reducedConditions = rowParser.parseConditions(currDiscount.condition);
    const parsedSubject = rowParser.parsedSubject(currDiscount);

    const products = parsedProducts.length === 0 ? utils.emptyField : parsedProducts;
    const conditions = reducedConditions.length === 0 ? [utils.emptyField] : reducedConditions;
    const coupon = currDiscount.coupon ? currDiscount.coupon : utils.emptyField;

    const handleRemove = (props) => {
        props.setPolicyDiscounts(prevDiscounts => {
            return prevDiscounts.filter(d => d.key !== discount.key);
        });
    };

    const handleEditMode = ({moveToScreen, setMode, setCondition}) => {
        setCondition({condition: {}});
        setMode({mode: config.modes.EDIT, editedDiscount: discount.key});
        moveToScreen(config.steps.EDIT_ADD);
    };

    const getActions = (props) => {
        return (
            <Space>
                <Popconfirm title="Are you sure delete this discount from the policy?"
                            onConfirm={() => handleRemove(props)}><a
                    href="#">delete</a></Popconfirm>
                <Button type="link" onClick={() => handleEditMode(props)}>edit</Button>
            </Space>
        );

    }

    return (
        <Draggable draggableId={discount.key} index={index}>
            {provided => (
                <DiscountPageCtx.Consumer>
                    {
                        props =>
                            <Row
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <span style={basicStyle}>{getActions(props)}</span>
                                <span style={basicStyle}>{parsedSubject}</span>
                                <span style={basicStyle}>{products}</span>
                                <span style={basicStyle}>{currDiscount.percentage}%</span>
                                <span style={basicStyle}>{moment(currDiscount.startDate).format('DD-MMM-YYYY')}</span>
                                <span style={basicStyle}>{currDiscount.duration} days</span>
                                <span style={basicStyle}>
                                    <PresentableDropdown inputs={conditions}/>
                                </span>
                                <span style={basicStyle}>{coupon}</span>
                                <SelectableDropdownComponent inputs={["AND", "OR", "XOR"]}
                                                             initialValue={discount.operator}
                                                             discountKey={discount.key}/>
                            </Row>
                    }
                </DiscountPageCtx.Consumer>
            )}
        </Draggable>
    );
}

export default TableRow;



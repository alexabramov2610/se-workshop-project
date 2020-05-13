import React, {useState} from 'react';
import {Table} from "semantic-ui-react";
import CreationRow from "./creation-row/creation-row.component";
import {Popconfirm} from "antd";
import {CreateTableContainer} from "./condition-create-table.styles";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const headerStyle = {border: 'none'};

const ConditionCreateTable = ({disabled}) => {

    const handleRemove = (k, props) => {
        props.setDiscount(prevDiscount => {
            return {...prevDiscount, condition: [...prevDiscount.condition.filter(curr => curr.key !== k)]};
        })
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <CreateTableContainer disabled={disabled}>
                    <Table basic='very' celled>
                        <Table.Header style={headerStyle}>
                            <Table.Row>
                                <Table.HeaderCell>Product</Table.HeaderCell>
                                <Table.HeaderCell>Minimum Amount / On Discount</Table.HeaderCell>
                                <Table.HeaderCell>Operator</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {props.discount.condition.map(cond => {
                                const {condition} = cond;
                                return (
                                    <Table.Row>
                                        <Table.Cell>{condition.catalogNumber}</Table.Cell>
                                        <Table.Cell>{
                                            condition.minAmount
                                                ? `Buy ${condition.minAmount} items, get ${props.discount.percentage}% off selected products`
                                                : `Get ${props.discount.percentage}% off selected products if product: ${condition.catalogNumber} has discount`
                                        }</Table.Cell>
                                        <Table.Cell>{cond.operator}</Table.Cell>
                                        <Table.Cell>
                                            <Popconfirm
                                                title="Are you sure delete this condition?"
                                                onConfirm={() => handleRemove(cond.key, props)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <a href="#">delete</a>
                                            </Popconfirm>

                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                            <CreationRow/>
                        </Table.Body>
                    </Table>
                </CreateTableContainer>

            }
        </DiscountPageCtx.Consumer>
    );
}
export default ConditionCreateTable;
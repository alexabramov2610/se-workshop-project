import React from 'react';
import {Table} from "semantic-ui-react";
import CreationRow from "./creation-row/creation-row.component";
import {Popconfirm, Space} from "antd";
import {CreateTableContainer} from "./condition-create-table.styles";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import * as utils from "../../pages/discount-page/discount-page-utils";
import SearchSelect from "../search-select/search-select.component";
import {ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';

const headerStyle = {border: 'none'};

const ConditionCreateTable = ({disabled}) => {

    const handleRemove = (k, props) => {
        utils.removeConditionFromDiscount(k, props);
    }

    const getConditions = ({mode, policyDiscounts, discount}) => {
        return utils.isEditMode(mode)
            ? utils.getEditedDiscount(policyDiscounts, mode).discount.condition
            : discount.condition;
    }

    const handleProductEdit = (e, cond, props) => {
        utils.editProduct(e, cond, props);
    }

    const handleOperatorEdit = (e, cond, props) => {
        utils.editConditionOperator(e, cond, props);
    }

    const handleMinAmountEditInc = (props, cond) => {
        utils.increaseMinAmount(cond, props);
    }

    const handleMinAmountEditDec = (props, cond) => {
        utils.decreaseMinAmount(cond, props);
    }

    const getEditProductCell = (props, cond) => {
        const {condition} = cond;

        return (
            <Table.Cell>
                <SearchSelect options={utils.getPresentedProducts(props)}
                              initialValue={condition.catalogNumber ? condition.catalogNumber : utils.emptyField}
                              onChangeCallback={(e, props) => handleProductEdit(e, cond, props)}
                              bordered={false}
                />
            </Table.Cell>
        );
    }

    const getConditionEditCell = (props, cond) => {
        const {condition} = cond;

        return (
            <Table.Cell>{
                condition.minAmount
                    ? <Space>
                        {`Buy ${condition.minAmount} items, get ${utils.getPercentage(props)}%
                                                    off selected products`}
                        <ArrowUpOutlined onClick={() => handleMinAmountEditInc(props, cond)}/>
                        <ArrowDownOutlined onClick={() => handleMinAmountEditDec(props, cond)}/>
                    </Space>
                    : `Get ${utils.getPercentage(props)}% off selected products if product: ${condition.catalogNumber} has discount`

            }</Table.Cell>
        );
    }

    const getEditOperatorCell = (cond) => {
        return (
            <Table.Cell>
                <SearchSelect options={utils.basicOperators}
                              initialValue={cond.operator ? cond.operator : utils.emptyField}
                              onChangeCallback={(e, props) => handleOperatorEdit(e, cond, props)}
                              bordered={false}
                />
            </Table.Cell>
        );
    }

    const getDeleteCell = (props, cond) => {
        return (
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
        );
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
                            {getConditions(props).map(cond => {
                                return (
                                    <Table.Row>
                                        {getEditProductCell(props, cond)}
                                        {getConditionEditCell(props, cond)}
                                        {getEditOperatorCell(cond)}
                                        {getDeleteCell(props, cond)}
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
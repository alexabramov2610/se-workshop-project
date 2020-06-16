import React, {useContext} from 'react'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import {Button, Popconfirm, Space} from "antd";
import {BuyingPolicyPageCtx} from "../../../pages/buying-policy-page/buying-policy-ctx";
import * as bpUtils from "../../../pages/buying-policy-page/buying-policy-utils";
import SelectableDropdownComponent from "../../discounts-summery/selectable-dropdown/selectable-dropdown.component";
import SearchSelect from "../../search-select/search-select.component";
import * as generalUtils from "../../../utils/utils";

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid grey;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;
const basicStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "14.5%",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
};

const actionsStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "14.5%",
    justifyContent: "flex-start",
    alignItems: "center"
};

function TableRow({index, row}) {

    const props = useContext(BuyingPolicyPageCtx);

    const handleRemove = () => {
        props.setPolicy(prevPolicy => {
            return prevPolicy.filter(p => p.key !== row.key);
        })
    };

    const getActions = () => {
        return (
            <Popconfirm title="Are you sure delete this discount from the policy?"
                        onConfirm={() => handleRemove()}><a
                href="#">delete</a></Popconfirm>
        );
    }

    const getMinAmount = () => {
        if (row.policy.bagPolicy) {
            return row.policy.bagPolicy.minAmount;
        } else if (row.policy.productPolicy) {
            return row.policy.productPolicy.minAmount;
        }
        return bpUtils.emptyField;
    }

    const getMaxAmount = () => {
        if (row.policy.bagPolicy) {
            return row.policy.bagPolicy.maxAmount;
        } else if (row.policy.productPolicy) {
            return row.policy.productPolicy.maxAmount;
        }
        return bpUtils.emptyField;
    }

    const changeOperator = (e) => {
        props.setPolicy(prevPolicy => {
            return prevPolicy.map(p => {
                return p.key === row.key ? {...row, operator: e} : p;
            });
        })
    }

    const getSubject = () => {
        if(row.policy.bagPolicy) return "Bag"
        else if(row.policy.productPolicy) return "Product"
        else if(row.policy.systemPolicy) return "System"
        else return "User"
    }

    return (
        <Draggable draggableId={row.key} index={index}>
            {provided => (
                <Row
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <span style={actionsStyle}>{getActions()}</span>
                    <span style={basicStyle}>{getSubject()}</span>
                    <span style={basicStyle}>
                        {row.policy.productPolicy
                            ? row.policy.productPolicy.catalogNumber
                            : bpUtils.emptyField}
                    </span>
                    <span style={basicStyle}>{getMinAmount()}</span>
                    <span style={basicStyle}>{getMaxAmount()}</span>
                    <span
                        style={basicStyle}>
                        {row.policy.systemPolicy
                            ? row.policy.systemPolicy.notForSellDays.join(', ')
                            : bpUtils.emptyField}
                    </span>
                    <SearchSelect
                        options={generalUtils.addValueKey(["AND", "OR", "XOR"])}
                        bordered={false}
                        width={"8%"}
                        onChangeCallback={(e) => changeOperator(e)}
                        value={row.operator}
                    />
                </Row>

            )}
        </Draggable>
    );
}

export default TableRow;



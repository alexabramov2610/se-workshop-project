import React, {useState} from "react";
import {Table} from "semantic-ui-react";
import SearchSelect from "../../search-select/search-select.component";
import {Button, InputNumber, Radio, Space} from "antd";
import {DiscountPageCtx} from "../../../pages/discount-page/discount-page-ctx";
import {verifyConditionSetting} from "../../../pages/discount-page/settings-verifier";
import * as utils from "../../../pages/discount-page/discount-page-utils";
import {isEditedDiscount, isEditMode} from "../../../pages/discount-page/discount-page-utils";


const CreationRow = () => {

    const [amountView, setAmountView] = useState(false);

    const handleConditionChange = (e, props) => {
        if (e.target.value === "minAmount") {
            setAmountView(true);
        }
        else {
            props.setCondition(prevCond => {
                return {
                    ...prevCond,
                    condition: {...prevCond.condition, minAmount: 0}
                }
            });
            setAmountView(false);
        }
    }

    const handleOperatorChange = (e, props) => {
        props.setCondition(prevCond => {
            return {
                ...prevCond,
                operator: e
            }
        });
    }

    const handleAddition = (props) => {
        if (!verifyConditionSetting(props)) return;
        isEditMode(props.mode)
            ? props.setPolicyDiscounts(prevPolicyDiscounts => {
                return prevPolicyDiscounts.map(pd => {
                    return isEditedDiscount(pd.key, props.mode)
                        ? {
                            ...pd,
                            discount: {
                                ...pd.discount,
                                condition: [...pd.discount.condition, {key: pd.discount.condition + 1, ...props.condition}]
                            }
                        }
                        : pd
                });
            })
            : props.setDiscount({
                ...props.discount,
                condition: [...props.discount.condition, {key: props.discount.condition.length, ...props.condition}],
            })
        // props.setCondition({condition: {}});
    }

    const handleAmountChange = (e, props) => {
        props.setCondition(prevCond => {
            return {
                ...prevCond,
                condition: {...prevCond.condition, minAmount: e}
            };
        });
    }

    const handleProductSelection = (e, props) => {
        props.setCondition(prevCond => {
            return {
                ...prevCond,
                condition: {...prevCond.condition, catalogNumber: utils.extractCatalogNumber(e)}
            }
        });
    }

    const getProductCell = (presentProducts) => {
        return (
            <Table.Cell style={{width: "33.3%"}}>
                <SearchSelect onChangeCallback={handleProductSelection}
                              placeholder={"product"} bordered={false} options={presentProducts}/>
            </Table.Cell>
        );
    }

    const getConditionsCell = (props) => {
        return (
            <Table.Cell style={{width: "33.3%"}}>
                <Radio.Group buttonStyle="solid" size={"small"}
                             defaultValue="onDiscount"
                             onChange={(e) => handleConditionChange(e, props)}>
                    <Radio.Button value="minAmount">Minimum Amount</Radio.Button>
                    <Space>
                        <Radio.Button value="onDiscount">On Discount</Radio.Button>
                        <InputNumber disabled={!amountView}
                                     size="small"
                                     min={0} defaultValue={0}
                                     onChange={e => handleAmountChange(e, props)}
                        />
                    </Space>
                </Radio.Group>
            </Table.Cell>
        );
    }

    const getOperatorCell = (props) => {
        return (
            <Table.Cell style={{width: "33.3%"}}>
                <SearchSelect placeholder={"operator"}
                              bordered={false} options={utils.basicOperators}
                              onChangeCallback={(e) => handleOperatorChange(e, props)}
                />
            </Table.Cell>
        );
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                (props) => {
                    const presentProducts = utils.getPresentedProducts(props);
                    return <React.Fragment>
                        <Table.Row>
                            {getProductCell(presentProducts)}
                            {getConditionsCell(props)}
                            {getOperatorCell(props)}
                        </Table.Row>
                        <Button size={"small"} type="primary" onClick={() => handleAddition(props)}>
                            Add Condition
                        </Button>
                    </React.Fragment>
                }
            }
        </DiscountPageCtx.Consumer>
    );
}

export default CreationRow;
import React, {useState} from "react";
import {Table} from "semantic-ui-react";
import SearchSelect from "../../search-select/search-select.component";
import {Button, InputNumber, Radio, Space} from "antd";
import {DiscountPageCtx} from "../../../pages/discount-page/discount-page-ctx";
import {verifyConditionSetting} from "../../../utils/settings-verifier";

const basicOperators = ["AND", "OR", "XOR"].map(operator => {
    return {value: operator}
});

const CreationRow = () => {

    const [amountView, setView] = useState(false);

    const handleConditionChange = (e) => {
        e.target.value === "minAmount"
            ? setView(true) : setView(false);
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

        props.setDiscount({
            ...props.discount,
            condition: [...props.discount.condition, {key: props.discount.condition.length, ...props.condition}],
        })
        props.setCondition({condition: {}});
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
                condition: {...prevCond.condition, catalogNumber: extractCatalogNumber(e)}
            }
        });
    }

    const extractCatalogNumber = (e) => {
        const commaIdx = e.indexOf(',');
        const catalogNumber = e.substring(commaIdx + 1);
        return parseInt(catalogNumber);
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                (props) => {
                    const presentProducts = props.products.map(p => {
                        return {value: `${p.name}, ${p.catalogNumber}`};
                    });
                    return <React.Fragment>
                        <Table.Row>
                            <Table.Cell style={{width: "33.3%"}}>
                                <SearchSelect onChangeCallback={(e) => handleProductSelection(e, props)}
                                              placeholder={"product"} bordered={false} options={presentProducts}/>
                            </Table.Cell>
                            <Table.Cell style={{width: "33.3%"}}>
                                <Radio.Group buttonStyle="solid" size={"small"}
                                             defaultValue="onDiscount"
                                             onChange={handleConditionChange}>
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
                            <Table.Cell style={{width: "33.3%"}}>
                                <SearchSelect placeholder={"operator"}
                                              bordered={false} options={basicOperators}
                                              onChangeCallback={(e) => handleOperatorChange(e, props)}
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Button size={"small"} type="primary" onClick={() => handleAddition(props)}>Add
                            Condition</Button>
                    </React.Fragment>
                }
            }
        </DiscountPageCtx.Consumer>
    );
}

export default CreationRow;
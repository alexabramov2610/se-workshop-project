import React from 'react';
import {Divider as SDivider, Grid, Segment} from "semantic-ui-react";
import {Card, Divider, Input, InputNumber, Space} from 'antd';
import DatePicker from "../date-picker/date-picker.component";
import ConditionCreateTable from "../discount-create-table/condition-create-table";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";


const DiscountSettings = () => {

    const handleMinPayChange = (e, props) => {
        props.setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                condition: [{condition: {minPay: e}, operator: "AND"}]
            };
        });
    };

    const handleDiscountChange = (e, props) => {
        props.setDiscount(prevDiscount => {
            return {
                ...prevDiscount,
                percentage: e
            }
        })
    }

    return (
        <DiscountPageCtx.Consumer>
            {(props) => <React.Fragment>
                <Segment raised>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column verticalAlign='middle' textAlign='center'>
                            {
                                props.subject === 'store'
                                    ? <div>
                                        <Space>
                                            <Card size="small">
                                                <h5>Subject</h5>
                                                STORE: {props.storeName.toUpperCase()}
                                            </Card>
                                            <div>
                                                <h5>Sub Total</h5>
                                                <InputNumber
                                                    required
                                                    onChange={e => handleMinPayChange(e, props)}
                                                    size="small"
                                                    formatter={value => `${value}$`}
                                                    min={0} defaultValue={0}
                                                />
                                            </div>
                                        </Space>
                                    </div>

                                    : <Card>
                                        <h5>Subject</h5>
                                        {props.subject === 'category' ? `Category: ${props.discount.category}` : "Products"}
                                    </Card>
                            }
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' textAlign='center'>
                            <Space>
                                <div>
                                    <h5>Dates and durations</h5>
                                    <DatePicker/>
                                </div>
                                <div>
                                    <h5>% Discount</h5>
                                    <InputNumber
                                        defaultValue={0}
                                        min={0}
                                        max={100}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                        onChange={e => handleDiscountChange(e, props)}
                                    />
                                </div>
                                <div>
                                    <h5>Coupon Code</h5>
                                    <Input placeholder={"Your Code"} onChange={e => props.setDiscount({
                                        ...props.discount,
                                        coupon: e.target.value
                                    })}/>
                                </div>
                            </Space>
                        </Grid.Column>
                    </Grid>
                    <SDivider vertical>AND</SDivider>
                </Segment>
                <Divider orientation="left">Your Conditions</Divider>
                <ConditionCreateTable disabled={props.subject === 'store'}/>
            </React.Fragment>
            }
        </DiscountPageCtx.Consumer>
    );
}

export default DiscountSettings;

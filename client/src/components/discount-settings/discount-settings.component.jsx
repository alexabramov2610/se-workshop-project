import React from 'react';
import {Divider as SDivider, Grid, Segment} from "semantic-ui-react";
import {Card, Divider, Input, InputNumber, Space} from 'antd';
import DatePicker from "../date-picker/date-picker.component";
import ConditionCreateTable from "../condition-create-table/condition-create-table";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import * as utils from "../../pages/discount-page/discount-page-utils";


const DiscountSettings = () => {

    const handleMinPayChange = (e, {mode, setPolicyDiscounts, setDiscount}) => {
        if (utils.isEditMode(mode)) {
            setPolicyDiscounts(prevPolicyDiscounts => {
                    let editedDiscount = utils.getEditedDiscount(prevPolicyDiscounts, mode);
                    editedDiscount.discount.condition[0].condition.minPay = e;
                    return prevPolicyDiscounts.map(d => d.key === mode.editedDiscount ? editedDiscount : d);
                }
            );
        } else {
            setDiscount(prevDiscount => {
                return {
                    ...prevDiscount,
                    condition: [{condition: {minPay: e}, operator: "AND"}]
                };
            });
        }
    };

    const handleDiscountChange = (e, {mode, setPolicyDiscounts, setDiscount}) => {
        if (utils.isEditMode(mode)) {
            setPolicyDiscounts(prevPolicyDiscounts => {
                    let editedDiscount = utils.getEditedDiscount(prevPolicyDiscounts, mode);
                    editedDiscount.discount.percentage = e;
                    return prevPolicyDiscounts.map(d => d.key === mode.editedDiscount ? editedDiscount : d);
                }
            );
        } else {
            setDiscount(prevDiscount => {
                return {
                    ...prevDiscount,
                    percentage: e
                }
            })
        }
    }

    const getSubTotal = (props) => {
        if (utils.isStoreSubjectAndEditMode(props)) {
            const editedDiscount = utils.getEditedDiscount(props.policyDiscounts, props.mode);
            return editedDiscount.discount.condition[0].condition.minPay;
        }
        return props.discount.condition[0] ? props.discount.condition[0].condition.minPay : "";
    }

    const getCouponCode = ({mode, policyDiscounts, discount}) => {
        if (utils.isEditMode(mode)) {
            const editedDiscount = utils.getEditedDiscount(policyDiscounts, mode);
            return editedDiscount.discount.coupon ? editedDiscount.discount.coupon : null;
        } else {
            const {coupon} = discount;
            return coupon ? coupon : null;
        }
    }

    const handleCouponCodeChange = (e, {mode, setPolicyDiscounts, setDiscount, discount}) => {
        if (utils.isEditMode(mode)) {
            setPolicyDiscounts(prevPolicyDiscounts => {
                    let editedDiscount = utils.getEditedDiscount(prevPolicyDiscounts, mode);
                    editedDiscount.discount.coupon = e.target.value;
                    return prevPolicyDiscounts.map(d => d.key === mode.editedDiscount ? editedDiscount : d);
                }
            );
        } else {
            setDiscount({
                ...discount,
                coupon: e.target.value
            })
        }
    }

    const getLeftSide = (props) => {
        return props.subject === 'store' || utils.isStoreSubjectAndEditMode(props)
            ? <div>
                <Space>
                    <Card size="small">
                        <h5>Subject</h5>
                        STORE: {props.storeName.toUpperCase()}
                    </Card>
                    <div>
                        <h5>Sub Total</h5>
                        <InputNumber
                            value={getSubTotal(props)}
                            onChange={e => handleMinPayChange(e, props)}
                            size="small"
                            formatter={value => `${value}₪`}
                            min={0}
                        />
                    </div>
                </Space>
            </div>

            : <Card>
                <h5>Subject</h5>
                {props.subject === 'category' ? `Category: ${props.discount.category}` : "Products"}
            </Card>
    }

    const getRightSide = (props) => {
        return <Space>
            <div>
                <h5>Dates and durations</h5>
                <DatePicker/>
            </div>
            <div>
                <h5>% Discount</h5>
                <InputNumber
                    value={utils.getPercentage(props)}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    onChange={e => handleDiscountChange(e, props)}
                />
            </div>
            <div>
                <h5>Coupon Code</h5>
                <Input placeholder={"Your Code"}
                       value={getCouponCode(props)}
                       onChange={e => handleCouponCodeChange(e, props)}/>
            </div>
        </Space>
    }

    return (
        <DiscountPageCtx.Consumer>
            {(props) => <React.Fragment>
                <Segment raised>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column verticalAlign='middle' textAlign='center'>
                            {getLeftSide(props)}
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' textAlign='center'>
                            {getRightSide(props)}
                        </Grid.Column>
                    </Grid>
                    <SDivider vertical>AND</SDivider>
                </Segment>
                <Divider orientation="left">Your Conditions</Divider>
                <ConditionCreateTable disabled={props.subject === 'store' || utils.isStoreSubjectAndEditMode(props)}/>
            </React.Fragment>
            }
        </DiscountPageCtx.Consumer>
    );
}

export default DiscountSettings;
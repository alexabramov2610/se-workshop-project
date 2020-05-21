import React, {useEffect, useState} from 'react';
import {DatePicker as AntDatePicker} from 'antd';
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import {config} from '../../pages/discount-page/discount-page-config';
import * as utils from "../../pages/discount-page/discount-page-utils";
import * as moment from "moment";

const {RangePicker} = AntDatePicker;

const DatePicker = () => {

    const oneDay = 24 * 60 * 60 * 1000;
    const dateFormat = "DD-MM-YYYY";

    const datesDurationInDays = (value) => {
        return value ? Math.round(Math.abs((value[0] - value[1]) / oneDay)) : 0;
    }

    const handleDatesSelection = (value, {setDiscount, setPolicyDiscounts, mode, discount}) => {
        if (utils.isEditMode(mode)) {
            setPolicyDiscounts(prevPolicyDiscounts => {
                    let editedDiscount = utils.getEditedDiscount(prevPolicyDiscounts, mode);
                    editedDiscount.discount.startDate = value ? value[0].toDate() : 0;
                    editedDiscount.discount.duration = datesDurationInDays(value);
                    return prevPolicyDiscounts.map(d => d.key === mode.editedDiscount ? editedDiscount : d);
                }
            );
        } else {
            setDiscount(prevDiscount => {
                return {
                    ...prevDiscount,
                    startDate: value[0] ? value[0].toDate() : 0,
                    duration: datesDurationInDays(value)
                }
            });
        }
    }

    const updateNew = (props) => {
        const newDiscount = props.discount;
        const {startDate, duration} = newDiscount;
        const sd = moment(startDate);
        const ed = moment(startDate).add(duration, 'days');
        return startDate ? [sd, ed] : [];
    }

    const updateEdited = ({policyDiscounts, mode}) => {
        const editedDiscount = utils.getEditedDiscount(policyDiscounts, mode)
        const {startDate, duration} = editedDiscount.discount;
        const sd = moment(startDate);
        const ed = moment(startDate).add(duration, 'days');
        return startDate ? [sd, ed] : [];
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <RangePicker
                    allowClear={false}
                    format={dateFormat}
                    value={props.mode.mode === config.modes.EDIT
                        ? updateEdited(props)
                        : updateNew(props)}
                    onCalendarChange={value => handleDatesSelection(value, props)}
                />
            }
        </DiscountPageCtx.Consumer>
    );
};

export default DatePicker;
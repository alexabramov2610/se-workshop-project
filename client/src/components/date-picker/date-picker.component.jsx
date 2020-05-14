import React from 'react';
import {DatePicker as AntDatePicker} from 'antd';
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const {RangePicker} = AntDatePicker;

const DatePicker = () => {

    const datesDurationInDays = (value) => {
        const oneDay = 24 * 60 * 60 * 1000;
        return value ? Math.round(Math.abs((value[0] - value[1]) / oneDay)) : 0;
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <RangePicker
                    onCalendarChange={value => {
                        props.setDiscount(prevDiscount => {
                            return {
                                ...prevDiscount,
                                startDate: value ? value[0]._d : 0,
                                duration: datesDurationInDays(value)
                            }
                        });
                    }}
                />

            }
        </DiscountPageCtx.Consumer>
    );
};

export default DatePicker;
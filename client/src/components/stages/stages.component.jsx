import React from 'react'
import {Button, Space, Steps} from 'antd';
import 'antd/dist/antd.css';
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import {Button as SButton} from "semantic-ui-react";
import {
    verifyDiscountSetting,
    verifyProductsSetting,
    verifyStoreSetting
} from "../../utils/settings-verifier";

const {Step} = Steps;
const submitStep = 0;
const subjectProductStep = 1;
const submitLocalStep = 2;

const Stages = ({step}) => {

    const handleConfirm = (props) => {
        switch (step) {
            case subjectProductStep: {
                if (verifyProductsSetting(props)) {
                    props.nextStep(pS => ((pS + 1) % props.steps.length));
                }
                break;
            }
            case submitLocalStep: {
                if (verifyDiscountSetting(props)) {
                    if(props.subject === 'store' && !verifyStoreSetting(props)) break;
                    props.setDiscounts(prevDiscounts => {
                        return [...prevDiscounts, {key: props.discounts.length, operator: "AND", ...props.discount}]
                    });
                    props.nextStep(pS => ((pS + 1) % props.steps.length));
                    break;
                }
            }
        }
    }

    const handleNewDiscount = (props) => {
        props.nextStep(pS => ((pS + 1) % props.steps.length));
        props.reset();
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => {
                    return <div style={{display: 'flex', flexDirection: 'column', justifyContent: "flex-end"}}>
                        <Space style={{float: "right"}}>
                            {
                                step === submitStep
                                    ? <SButton onClick={() => handleConfirm(props)} type="primary"
                                               color={"green"} size={"small"}>Submit</SButton>

                                    : null
                            }
                            {step === submitStep
                                ? <Button onClick={() => handleNewDiscount(props)} type="primary">New Discount</Button>
                                : <Button onClick={() => handleConfirm(props)} type="primary">Continue</Button>
                            }
                            <Button ghost type="primary">Cancel</Button>
                        </Space>

                        <Steps size="small" current={step} style={{marginBottom: "10px", marginTop: "20px"}}>
                            <Step title="review and submit"/>
                            <Step title="choose subject and products"/>
                            <Step title="select configurations and discounts"/>
                        </Steps>
                    </div>
                }

            }
        </DiscountPageCtx.Consumer>
    );
}

export default Stages;

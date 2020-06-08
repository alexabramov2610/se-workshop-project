import React from 'react'
import {Button, Space, Steps} from 'antd';
import 'antd/dist/antd.css';
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import * as verifier from "../../pages/discount-page/settings-verifier";
import {config} from '../../pages/discount-page/discount-page-config';
import * as utils from "../../pages/discount-page/discount-page-utils";
import {StagesContainer} from "./stages.styles";

const {Step} = Steps;

const Stages = ({stage}) => {

    const handleConfirm = (props) => {
        switch (stage) {
            case config.steps.SUBJECT_PRODUCTS: {
                verifier.verifyProductsSetting(props) && props.moveToScreen(config.steps.EDIT_ADD);
                break;
            }
            case config.steps.EDIT_ADD: {
                if (verifier.verifyDiscountSetting(props)) {
                    if (utils.isStore(props) && !verifier.verifyStoreSetting(props)) break;
                    if (!utils.isEditMode(props.mode)) {
                        props.setPolicyDiscounts(prevPolicyDiscounts => {
                            console.log("discountToAdd: ", props.discount, prevPolicyDiscounts)
                            return [...prevPolicyDiscounts, {
                                key: (prevPolicyDiscounts.length + 1) + "",
                                discount: props.discount,
                                operator: utils.defaultOperator
                            }]
                        })
                    }

                    props.moveToScreen(config.steps.REVIEW_SUBMIT);
                    break;
                }
            }
        }
    }

    const handleNewDiscount = (props) => {
        props.moveToScreen(config.steps.SUBJECT_PRODUCTS);
        props.reset();
    }

    const handleSubmit = (props) => {
        props.submit();
    }

    const handleCancel = (props) => {
        props.reset();
        props.moveToScreen(config.steps.REVIEW_SUBMIT);

    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => {
                    return <StagesContainer>
                        <Space style={{float: "right"}}>
                            {
                                stage === config.steps.REVIEW_SUBMIT
                                && <Button onClick={() => handleSubmit(props)}
                                           type="primary"
                                           style={{backgroundColor: "#16a085", border: "none"}}
                                           loading={props.isLoading}
                                >
                                    Submit
                                </Button>
                            }
                            {
                                stage === config.steps.REVIEW_SUBMIT
                                    ? <Button onClick={() => handleNewDiscount(props)} type="primary">
                                        New Discount
                                    </Button>
                                    : <Button onClick={() => handleConfirm(props)} type="primary">Continue</Button>
                            }
                            {stage !== config.steps.REVIEW_SUBMIT &&
                            <Button ghost type="primary" onClick={() => handleCancel(props)}>Cancel</Button>}
                        </Space>

                        <Steps size="small" current={stage} style={{marginBottom: "10px", marginTop: "20px"}}>
                            <Step title="review and submit"/>
                            <Step title="choose subject and products"/>
                            <Step title="select configurations and discounts"/>
                        </Steps>
                    </StagesContainer>
                }

            }
        </DiscountPageCtx.Consumer>
    );
}

export default Stages;

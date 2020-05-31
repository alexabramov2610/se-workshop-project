import React, {useContext, useState} from 'react';
import {Modal} from 'antd';
import BuyingPolicySettings from "../buying-policy-settings/buying-policy-settings.component";
import * as Message from '../../components/custom-alert/custom-alert';
import {BuyingPolicyPageCtx} from "../../pages/buying-policy-page/buying-policy-ctx";
import * as bpUtils from '../../pages/buying-policy-page/buying-policy-utils'

const setNewPolicy = (props) => {
    let toAdd = {};
    switch (props.subject) {
        case bpUtils.subjects.product: {
            toAdd.subject = "product";
            toAdd.productPolicy = props.productPolicy;
            break;
        }
        case bpUtils.subjects.bag: {
            toAdd.subject = "bag";
            toAdd.bagPolicy = props.bagPolicy;
            break;
        }
        case bpUtils.subjects.system: {
            toAdd.subject = "system";
            toAdd.systemPolicy = props.systemPolicy;
            break;
        }
        case bpUtils.subjects.user: {
            toAdd.subject = "user";
            toAdd.userPolicy = props.userPolicy;
            break;
        }
    }
    props.setPolicy(prevPolicy => {
        return [...prevPolicy, {key: props.policy.length + "", policy: toAdd, operator: "AND"}];
    });
}

const validateInput = (props) => {
    const {productPolicy, systemPolicy, bagPolicy, userPolicy} = props;
    if (!productPolicy && !systemPolicy && !bagPolicy && !userPolicy) {
        Message.error("Nothing was chosen. please choose at least one subject and try again");
        return false;
    }
    if (productPolicy) {
        const isValid = productPolicy.catalogNumber && productPolicy.minAmount && productPolicy.maxAmount;
        if (!isValid) {
            Message.error("All fields are required, fill them all and try again");
            return false;
        }
        if (productPolicy.minAmount > productPolicy.maxAmount) {
            Message.error("Minimum amount can't be greater than the maximum amount");
            return false;
        }
    } else if (bagPolicy) {
        const isValid = bagPolicy.minAmount && bagPolicy.maxAmount;
        if (!isValid) {
            Message.error("All fields are required, fill them all and try again");
            return false;
        }
        if (bagPolicy.minAmount > bagPolicy.maxAmount) {
            Message.error("Minimum amount can't be greater than the maximum amount");
            return false;
        }
    }
    return true;
};

const AddToPolicyModal = ({visible, onCancel, setVisible}) => {

    const props = useContext(BuyingPolicyPageCtx);

    const onOk = () => {
        if (validateInput(props)) {
            setNewPolicy(props);
            setVisible(false);
        }
    };

    return (
        <Modal title="Add To Policy"
               visible={visible}
               onOk={onOk}
               okText={"Add"}
               onCancel={onCancel}
        >
            <BuyingPolicySettings/>
        </Modal>);
}
export default AddToPolicyModal;
import React, {useContext, useState} from "react";
import BuyingPolicySummery from "../../components/buying-policy-summery/buying-policy-summery.component";
import {BuyingPolicyPageCtx} from "./buying-policy-ctx";
import {Button, Space} from "antd";
import AddToPolicyModal from "../../components/add-to-policy-modal/add-to-policy-modal.component";

const submitButtonStyle = {border: "none", backgroundColor: "#16a085"};
const BuyingPolicyPage = () => {

    const props = useContext(BuyingPolicyPageCtx);
    const [visible, setVisible] = useState(true);

    return <>
        <BuyingPolicySummery/>
        <Space>
            <Button type="primary" style={submitButtonStyle}>Submit</Button>
            <Button type="primary">Add To Policy</Button>
        </Space>
        <AddToPolicyModal visible={visible} onCancel={() => setVisible(false)}/>
    </>;
}

export default BuyingPolicyPage;
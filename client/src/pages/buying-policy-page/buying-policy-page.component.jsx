import React, {useContext, useState} from "react";
import BuyingPolicySummery from "../../components/buying-policy-summery/buying-policy-summery.component";
import {Button, Divider, Space} from "antd";
import AddToPolicyModal from "../../components/add-to-policy-modal/add-to-policy-modal.component";
import {BuyingPolicyPageCtx} from "./buying-policy-ctx";

const submitButtonStyle = {border: "none", backgroundColor: "#16a085"};

const BuyingPolicyPage = () => {

    const props = useContext(BuyingPolicyPageCtx);
    const [visible, setVisible] = useState(false);

    return <>
        <Divider style={{fontSize: "25px"}} orientation={"left"}>Buying Policy</Divider>
        <BuyingPolicySummery/>
        <Space>
            <Button type="primary"
                    style={submitButtonStyle}
                    onClick={props.submit}
                    loading={props.isLoading}>Submit
            </Button>
            <Button type="primary"
                    onClick={() => setVisible(true)}>
                Add To Policy
            </Button>
        </Space>
        <AddToPolicyModal visible={visible}
                          onCancel={() => setVisible(false)}
                          setVisible={setVisible}
        />
    </>;
}

export default BuyingPolicyPage;
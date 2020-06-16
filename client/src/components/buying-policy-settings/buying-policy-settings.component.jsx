import React, {useContext} from "react";
import {InputNumber, Space, Tabs} from "antd";
import SearchSelect from "../search-select/search-select.component";
import {BuyingPolicyPageCtx} from "../../pages/buying-policy-page/buying-policy-ctx";
import * as bpUtils from '../../pages/buying-policy-page/buying-policy-utils'

const {TabPane} = Tabs;

const resetOthers = (subject, props) => {
    switch (subject) {
        case bpUtils.subjects.system: {
            props.setProductPolicy(bpUtils.initialStates.productPolicyInitialState);
            props.setBagPolicy(bpUtils.initialStates.bagPolicyInitialState);
            props.setUserPolicy(bpUtils.initialStates.userPolicyInitialState);
            break;
        }
        case bpUtils.subjects.user: {
            props.setProductPolicy(bpUtils.initialStates.productPolicyInitialState);
            props.setBagPolicy(bpUtils.initialStates.bagPolicyInitialState);
            props.setSystemPolicy(bpUtils.initialStates.systemPolicyInitialState);
            break;
        }
        case bpUtils.subjects.bag: {
            props.setProductPolicy(bpUtils.initialStates.productPolicyInitialState);
            props.setSystemPolicy(bpUtils.initialStates.systemPolicyInitialState);
            props.setUserPolicy(bpUtils.initialStates.userPolicyInitialState);
            break;
        }
        case bpUtils.subjects.product: {
            props.setBagPolicy(bpUtils.initialStates.bagPolicyInitialState);
            props.setSystemPolicy(bpUtils.initialStates.systemPolicyInitialState);
            props.setUserPolicy(bpUtils.initialStates.userPolicyInitialState);
            break;
        }
        default: console.log("got here");
    }
}

const productTab = (props) => {
    return (
        <Space>
            <div>
                <h6>catalog number</h6>
                <SearchSelect
                    placeholder={"Product"}
                    options={props.storeProducts.map(p => {
                        return {value: `${p.product.catalogNumber}, ${p.product.name}`}
                    })}
                    onChangeCallback={(e) => handleProductSelection(e, props)}
                    value={props.productPolicy && props.productPolicy.catalogNumber}
                />
            </div>
            <div>
                <h6>minimum amount</h6>
                <InputNumber placeholder={"min"}
                             min={0}
                             onChange={(e) => handleProductMinAmountChange(e, props)}
                             value={props.productPolicy && props.productPolicy.minAmount}
                />
            </div>
            <div>
                <h6>maximum amount</h6>
                <InputNumber placeholder={"max"}
                             min={0}
                             onChange={(e) => handleProductMaxAmountChange(e, props)}
                             value={props.productPolicy && props.productPolicy.maxAmount}
                />
            </div>
        </Space>
    );
}

const systemTab = (props) => {
    return (
        <div>
            <h6>not for sell weekdays</h6>
            <SearchSelect width={"100%"}
                          placeholder={"weekdays"}
                          isMultiple={true}
                          options={bpUtils.WeekDays.map(d => {
                              return {value: d}
                          })}
                          onChangeCallback={(e) => handleBusinessDaysChange(e, props)}
                          value={props.systemPolicy && props.systemPolicy.notForSellDays}
            />
        </div>
    );
}

const bagTab = (props) => {
    return (
        <Space style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
            <div>
                <h6>minimum amount</h6>
                <InputNumber placeholder={"min"}
                             min={0}
                             onChange={(e) => handleBagMinAmountChange(e, props)}
                             value={props.bagPolicy && props.bagPolicy.minAmount}
                />
            </div>
            <div>
                <h6>maximum amount</h6>
                <InputNumber placeholder={"max"}
                             min={0}
                             onChange={(e) => handleBagMaxAmountChange(e, props)}
                             value={props.bagPolicy && props.bagPolicy.maxAmount}
                />
            </div>
        </Space>
    );
}

const handleProductSelection = (e, props) => {
    const catalogNumber = parseInt(e.substring(0, e.indexOf(",")));
    props.setProductPolicy(prevProductPolicy => {
        return {...prevProductPolicy, catalogNumber: catalogNumber};
    });
};

const handleProductMaxAmountChange = (e, props) => {
    props.setProductPolicy(prevProductPolicy => {
        return {...prevProductPolicy, maxAmount: e};
    });
};

const handleProductMinAmountChange = (e, props) => {
    props.setProductPolicy(prevProductPolicy => {
        return {...prevProductPolicy, minAmount: e};
    });
};

const handleBagMaxAmountChange = (e, props) => {
    props.setBagPolicy(prevBagPolicy => {
        return {...prevBagPolicy, maxAmount: e};
    });
};

const handleBagMinAmountChange = (e, props) => {
    props.setBagPolicy(prevBagPolicy => {
        return {...prevBagPolicy, minAmount: e};
    });
};

const handleBusinessDaysChange = (e, props) => {
    props.setSystemPolicy(prevSystemPolicy => {
        return {...prevSystemPolicy, notForSellDays: e}
    });
};

const BuyingPolicySettings = () => {

    const props = useContext(BuyingPolicyPageCtx);

    const switchTab = (tab) => {
        props.setSubject(tab);
        resetOthers(tab, props);
    };

    return (
        <Tabs defaultActiveKey="1" onChange={switchTab}>
            <TabPane tab="Product" key="1">
                {productTab(props)}
            </TabPane>
            <TabPane tab="System" key="2">
                {systemTab(props)}
            </TabPane>
            <TabPane tab="Bag" key="3">
                {bagTab(props)}
            </TabPane>
        </Tabs>
    );
}

export default BuyingPolicySettings
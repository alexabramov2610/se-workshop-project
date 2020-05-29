import React from "react";
import {InputNumber, Space, Tabs} from "antd";
import SearchSelect from "../search-select/search-select.component";

const {TabPane} = Tabs;
const WeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const productTab = () => {
    return (
        <Space>
            <div>
                <h6>catalog number</h6>
                <SearchSelect
                    placeholder={"Product"}
                    options={[
                        {value: "option1"},
                        {value: "option2"},
                        {value: "option2"},
                        {value: "option2"},
                        {value: "option2"},
                        {value: "option2"}
                    ]}/>
            </div>
            <div>
                <h6>minimum amount</h6>
                <InputNumber placeholder={"0"}/>
            </div>
            <div>
                <h6>maximum amount</h6>
                <InputNumber placeholder={"0"}/>
            </div>
        </Space>
    );
}

const systemTab = () => {
    return (
        <div>
            <SearchSelect width={"100%"}
                          placeholder={"non business weekdays"}
                          multiple={true}
                          options={WeekDays.map(d => {
                              return {value: d}
                          })}/>
        </div>
    );
}

const bagTab = () => {
    return (
        <Space style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
            <div>
                <h6>minimum amount</h6>
                <InputNumber placeholder={"0"}/>
            </div>
            <div>
                <h6>maximum amount</h6>
                <InputNumber placeholder={"0"}/>
            </div>
        </Space>
    );
}

const BuyingPolicySettings = () => {

    const switchTab = (tab) => {
        console.log(tab);
    }

    return (
        <Tabs defaultActiveKey="1" onChange={switchTab}>
            <TabPane tab="Product" key="1">
                {productTab()}
            </TabPane>
            <TabPane tab="System" key="2">
                {systemTab()}
            </TabPane>
            <TabPane tab="Bag" key="3">
                {bagTab()}
            </TabPane>
            <TabPane tab="User" key="4">
                {}
            </TabPane>
        </Tabs>
    );
}

export default BuyingPolicySettings
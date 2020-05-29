import React, {useState} from "react";
import {BuyingPolicyPageCtx} from "./buying-policy-ctx";
import BuyingPolicyPage from "./buying-policy-page.component";

const BuyingPolicyPageContainer = () => {

    const [buyingPolicy, setBuyingPolicy] = useState([]);

    const providerState = {};

    return (
        <BuyingPolicyPageCtx.Provider value={providerState}>
            <BuyingPolicyPage/>
        </BuyingPolicyPageCtx.Provider>
    );
}

export default BuyingPolicyPageContainer;
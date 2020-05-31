import React, {useEffect, useState} from "react";
import {BuyingPolicyPageCtx} from "./buying-policy-ctx";
import BuyingPolicyPage from "./buying-policy-page.component";
import {useParams} from "react-router-dom";
import * as api from "../../utils/api";
import * as Message from '../../components/custom-alert/custom-alert';
import * as bpUtils from "./buying-policy-utils";
import * as generalUtils from "../../utils/utils";

const BuyingPolicyPageContainer = () => {

    const {storename} = useParams();
    const [subject, setSubject] = useState("1");
    const [storeProducts, setStoreProducts] = useState([]);
    const [buyingPolicy, setBuyingPolicy] = useState([]);
    const [productPolicy, setProductPolicy] = useState(bpUtils.initialStates.productPolicyInitialState);
    const [systemPolicy, setSystemPolicy] = useState(bpUtils.initialStates.systemPolicyInitialState);
    const [bagPolicy, setBagPolicy] = useState(bpUtils.initialStates.bagPolicyInitialState);
    const [userPolicy, setUserPolicy] = useState(bpUtils.initialStates.userPolicyInitialState);
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const validateResponse = (buyingPolicyRes) => {
        if (buyingPolicyRes.data.data.policy) {
            const keyedPolicy = buyingPolicyRes.data.data.policy.policy.map((row, index) => {
                return {key: index + "", ...row};
            })
            setBuyingPolicy(keyedPolicy);
        } else
            Message.error(buyingPolicyRes.data.error.message);
    }

    useEffect(() => {
        const fetchData = async () => {
            const buyingPolicyRes = await api.getStoreBuyingPolicy(storename);
            validateResponse(buyingPolicyRes);

            const storeProductsRes = await api.getStoreProducts(storename);
            if (storeProductsRes.data.data.products)
                setStoreProducts(storeProductsRes.data.data.products);
        }

        fetchData();
    }, [fetching]);

    const analyzeResult = (res) => {
        console.log(res);
        setIsLoading(false);
        Message.success("Policy has been successfully updated");
        setFetching(!fetching);
    }

    const submitPolicy = async () => {
        setIsLoading(true);
        await generalUtils.sleep(1000);
        await api.setStoreBuyingPolicy({
            body: {
                storeName: storename,
                policy: {
                    policy: buyingPolicy
                }
            }
        }).then(res => analyzeResult(res));
    }

    let providerState = {
        policy: buyingPolicy,
        setPolicy: setBuyingPolicy,
        productPolicy: productPolicy,
        setProductPolicy: setProductPolicy,
        systemPolicy: systemPolicy,
        setSystemPolicy: setSystemPolicy,
        userPolicy: userPolicy,
        setUserPolicy: setUserPolicy,
        bagPolicy: bagPolicy,
        setBagPolicy: setBagPolicy,
        storeProducts: storeProducts,
        subject: subject,
        setSubject: setSubject,
        isLoading: isLoading,
        submit: submitPolicy
    };

    return (
        <BuyingPolicyPageCtx.Provider value={providerState}>
            <BuyingPolicyPage/>
            {console.log("buyingPolicy:", buyingPolicy)}
        </BuyingPolicyPageCtx.Provider>
    );
}

export default BuyingPolicyPageContainer;
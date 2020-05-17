import React, {useEffect, useState} from "react";
import {DiscountPageCtx} from "./discount-page-ctx";
import DiscountPage from "./discount-page.component";
import {Spin} from "antd";
import {config} from './discount-page-config';
import * as utils from "./discount-page-utils";
import * as api from "../../utils/api";

const spinnerStyle = {textAlign: "center", alignItems: "center", paddingTop: "240px"};

const DiscountPageContainer = () => {

    const [currCondition, setCurrCondition] = useState({condition: {}});
    const [discounts, setDiscounts] = useState([]);
    const [currDiscount, setCurrDiscount] = useState({condition: [], products: [], percentage: 0});
    const [screen, moveToScreen] = useState(0);
    const [products, setProducts] = useState(undefined);
    const [storeName, setStoreName] = useState("");
    const [categories, setCategories] = useState(undefined);
    const [discountSubject, setDiscountSubject] = useState("products");
    const [mode, setMode] = useState({mode: config.modes.ADD, editedDiscount: 0});
    const [policyDiscounts, setPolicyDiscounts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const productsRes = await api.getStoreProducts("store10");
            const categoriesRes = await api.getStoreCategories("store10");
            const store = productsRes.data.data.products[0].storeName;
            setStoreName(store);

            const fetchedProducts = productsRes.data.data.products.map(p => {
                return {key: p.product.catalogNumber, ...p.product};
            });
            const fetchedCategories = categoriesRes.data.data.categories;
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const policyRes = await api.getDiscountPolicy("store10");
            const keyedDiscounts = utils.addKeys(policyRes.data.data.policy.discounts);
            const keyedConditions = keyedDiscounts.map(d => {
                const currConditions = d.discount.condition;
                return currConditions
                    ? utils.addKeys(currConditions)
                    : []
            });
            keyedDiscounts.forEach((d, i) => {
                d.discount.condition = keyedConditions[i];
            });
            setPolicyDiscounts(keyedDiscounts);
        };

        fetchData();

    }, [isFetching]);

    const submitDiscounts = () => {
        api.setDiscountPolicy({
            body: {storeName: "store10", policy: policyDiscounts}
        }).then(r => console.log(JSON.stringify(r)));
        setIsFetching(!isFetching);
    }

    const resetDiscount = () => {
        setCurrDiscount({condition: [], products: [], percentage: 0});
        setCurrCondition({condition: {}});
        setMode({mode: config.modes.ADD, editedDiscount: -1})
    }

    const setCategory = (category) => {
        setCurrDiscount(prevDiscount => {
            return {...prevDiscount, category: category, products: []};
        });
    }

    const switchSubject = (value) => {
        setDiscountSubject(value);
        if (value === "store") {
            setCurrDiscount(prevDiscount => {
                return {...prevDiscount, category: undefined, products: []};
            });
        }
    }

    let providerState = {
        setPolicyDiscounts: setPolicyDiscounts,
        policyDiscounts: policyDiscounts,
        products: products,
        storeName: storeName,
        categories: categories,
        subject: discountSubject,
        setDiscount: setCurrDiscount,
        discount: currDiscount,
        setDiscounts: setDiscounts,
        discounts: discounts,
        condition: currCondition,
        setCondition: setCurrCondition,
        moveToScreen: moveToScreen,
        mode: mode,
        setMode: setMode,
        reset: resetDiscount,
        selectCategory: setCategory,
        switchSubject: switchSubject,
        submit: submitDiscounts
    };

    return (
        <DiscountPageCtx.Provider value={providerState}>
            {currDiscount ? console.log(currDiscount) : null}
            {
                policyDiscounts && products && categories
                    ? <DiscountPage screen={screen}/>
                    : <div style={spinnerStyle}>
                        <Spin tip="Loading..."/>
                    </div>
            }
        </DiscountPageCtx.Provider>
    );
}

export default DiscountPageContainer;
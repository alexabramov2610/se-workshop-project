import React, {useEffect, useState} from "react";
import {DiscountPageCtx} from "./discount-page-ctx";
import DiscountPage from "./discount-page.component";
import {config} from './discount-page-config';
import * as dpUtils from "./discount-page-utils";
import * as api from "../../utils/api";
import Spinner from "../../components/spinner/spinner";
import {useParams} from "react-router-dom";
import * as generalUtils from "../../utils/utils";
import * as Message from "../../components/custom-alert/custom-alert";

const DiscountPageContainer = () => {

    const {storename} = useParams();
    const [currCondition, setCurrCondition] = useState({condition: {}});
    const [discounts, setDiscounts] = useState([]);
    const [currDiscount, setCurrDiscount] = useState({condition: [], products: [], percentage: 0});
    const [screen, moveToScreen] = useState(0);
    const [products, setProducts] = useState(undefined);
    const [storeName, setStoreName] = useState(storename);
    const [categories, setCategories] = useState(undefined);
    const [discountSubject, setDiscountSubject] = useState("products");
    const [mode, setMode] = useState({mode: config.modes.ADD, editedDiscount: 0});
    const [policyDiscounts, setPolicyDiscounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            console.log(storeName);
            const productsRes = await api.getStoreProducts(storeName);
            const categoriesRes = await api.getStoreCategories(storeName);
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
            const policyRes = await api.getDiscountPolicy(storeName);
            const keyedDiscounts = generalUtils.addKeys(policyRes.data.data.policy.discounts);
            const keyedConditions = keyedDiscounts.map(d => {
                const currConditions = d.discount.condition;
                return currConditions
                    ? generalUtils.addKeys(currConditions)
                    : []
            });
            keyedDiscounts.forEach((d, i) => {
                d.discount.condition = keyedConditions[i];
            });
            setPolicyDiscounts(keyedDiscounts);
        };

        fetchData();

    }, [fetching]);

    const submitDiscounts = async () => {
        setIsLoading(true);
        await api.setDiscountPolicy({
            body: {
                storeName: storeName,
                policy: {
                    discounts: policyDiscounts
                }
            }
        }).then(r => {});
        setFetching(!fetching);
        setIsLoading(false);
        Message.success("Discount policy changed successfully");
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
        isLoading: isLoading,
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
            {console.log(policyDiscounts)}
            {
                !policyDiscounts || !products || !categories
                    ? <Spinner message={"Loading..."}/>
                    : <DiscountPage screen={screen}/>
            }
        </DiscountPageCtx.Provider>
    );
}

export default DiscountPageContainer;

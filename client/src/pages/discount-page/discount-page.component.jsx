import React, {useEffect, useState} from 'react';
import DiscountsSummery from "../../components/discounts-summery/discounts-summery.component";
import {DiscountPageBody, DiscountPageContainer, DiscountWrapper} from "./discount-page.styles";
import Stages from "../../components/stages/stages.component";
import SubjectProducts from "../../components/subject-products/subject-products.component";
import DiscountSettings from "../../components/discount-settings/discount-settings.component";
import 'semantic-ui-css/semantic.min.css';
import {Divider, Spin} from "antd";
import {DiscountPageCtx} from "./discount-page-ctx";
// import {success} from "../../components/modal/modal";
// import { getStoreCategories, getStoreProducts, getDiscountPolicy } from "../../utils";
import axios from 'axios';

const spinnerStyle = {textAlign: "center", alignItems: "center", paddingTop: "240px"};
const titles = ["Choose Products", "Please choose your discount configuration", "Review Discounts"];

const steps = [<DiscountsSummery/>, <SubjectProducts/>, <DiscountSettings/>];

const DiscountPage = () => {

    const [currCondition, setCurrCondition] = useState({condition: {}});
    const [discounts, setDiscounts] = useState([]);
    const [currDiscount, setCurrDiscount] = useState({condition: [], products: [], percentage: 0});
    const [step, setStep] = useState(0);
    const [products, setProducts] = useState(undefined);
    const [storeName, setStoreName] = useState("");
    const [categories, setCategories] = useState(undefined);
    const [discountSubject, setDiscountSubject] = useState("products");
    const [isFetching, setFetching] = useState(false);
    const [policyDiscounts, setPolicyDiscounts] = useState([]);

    const client = axios.create({
        headers: {"Access-Control-Allow-Credentials": "*"}
    });

    useEffect(() => {
        const fetchData = async () => {
            const productsRes = await client.get("http://localhost:4000/products");
            const categoriesRes = await client.get("http://localhost:4000/stores/getCategories");
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
            const policyRes = await client.get("http://localhost:4000/stores/getPolicy");
            const fetchedDiscounts = policyRes.data.data.policy.discounts.map((d, index) => {
                return {key: index + "", ...d};
            });
            setPolicyDiscounts(fetchedDiscounts);
        };

        fetchData();

    }, []);

    const submitDiscounts = () => {
        // axiosClient.post("/stores/setDiscountsPolicy", {
        //     body: {
        //         policy: discounts,
        //         storeName: "store-10"
        //     },
        // }).then(r => success("Your policy has been updated"));
    }

    const resetDiscount = () => {
        setCurrDiscount({condition: [], products: [], percentage: 0});
        setCurrCondition({condition: {}});
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
        steps: steps,
        nextStep: setStep,
        reset: resetDiscount,
        selectCategory: setCategory,
        switchSubject: switchSubject,
        submit: submitDiscounts
    };

    return (
        <DiscountPageCtx.Provider value={providerState}>
            <DiscountWrapper>
                <DiscountPageContainer>
                    <Divider style={{fontSize: "20px"}} orientation={"left"}>{titles[step]}</Divider>
                    <DiscountPageBody>
                        {policyDiscounts && products && products
                            ? steps[step]
                            : <div style={spinnerStyle}>
                                <Spin tip="Loading..."/>
                            </div>}
                    </DiscountPageBody>
                    <Stages step={step}/>
                </DiscountPageContainer>
            </DiscountWrapper>
        </DiscountPageCtx.Provider>
    );
}

export default DiscountPage;
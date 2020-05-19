import React, {useEffect, useState} from "react";
import {ManageProudctsPageCtx} from "./manage-proudcts-page-ctx";
import {viewStoreInfo} from "../../utils/api";
import {ManageProductsPage} from "./manage-products-page";
import {Spin} from "antd";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import * as api from "../../utils/api";
import * as utils from "../discount-page/discount-page-utils";


const ManageProudctsPage = ({isLoggedIn}) => {

    const {storename} = useParams();
    const [storeData, setStoreData] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const storeInfo = await viewStoreInfo(storename);
            setStoreData(storeInfo.data.data.info);
        };

        fetchData();

    }, []);

    return storeData
        ? <ManageProudctsPageCtx.Provider value={storeData}>
            <ManageProductsPage isLoggedIn={isLoggedIn}/>
        </ManageProudctsPageCtx.Provider>
        : <Spinner message={"Loading your store"}/>
}

export default ManageProudctsPage;

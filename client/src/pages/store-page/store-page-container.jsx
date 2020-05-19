import React, {useEffect, useState} from "react";
import {StorePageCtx} from "./store-page-ctx";
import {viewStoreInfo} from "../../utils/api";
import {StorePage} from "./store-page";
import {Spin} from "antd";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import * as api from "../../utils/api";
import * as utils from "../discount-page/discount-page-utils";


const StorePageContainer = ({isLoggedIn}) => {

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
        ? <StorePageCtx.Provider value={storeData}>
            <StorePage isLoggedIn={isLoggedIn}/>
        </StorePageCtx.Provider>
        : <Spinner message={"Loading your store"}/>
}

export default StorePageContainer;

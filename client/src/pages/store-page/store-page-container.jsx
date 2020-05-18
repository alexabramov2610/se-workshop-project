import React, {useEffect, useState} from "react";
import {StorePageCtx} from "./store-page-ctx";
import {viewStoreInfo} from "../../utils/api";
import {StorePage} from "./store-page";
import {Spin} from "antd";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";


const StorePageContainer = ({isLoggedIn}) => {

    const {storename} = useParams();
    const [storeData, setStoreData] = useState(undefined);

    useEffect(async () => {
        const storeInfo = await viewStoreInfo(storename);
        setStoreData(storeInfo.data.data.info);
    }, []);

    return storeData
        ? <StorePageCtx.Provider value={storeData}>
            <StorePage isLoggedIn={isLoggedIn}/>
        </StorePageCtx.Provider>
        : <Spinner message={"Loading your store"}/>
}

export default StorePageContainer;

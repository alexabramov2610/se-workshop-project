import React, {useEffect, useState} from "react";
import {ManageProductsPageCtx} from "./manage-products-page-ctx";
import {viewStoreInfo} from "../../utils/api";
import {ManageProductsPage} from "./manage-products-page";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import * as api from "../../utils/api";

const ManageProductsContainer = ({isLoggedIn}) => {

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
        ? <ManageProductsPageCtx.Provider value={storeData}>
            <ManageProductsPage isLoggedIn={isLoggedIn}/>
        </ManageProductsPageCtx.Provider>
        : <Spinner message={"Loading your products"}/>
}

export default ManageProductsContainer;

import React, {useEffect, useState} from "react";
import {StorePageCtx} from "./store-page-ctx";
import {StorePage} from "./store-page.component";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import * as api from "../../utils/api";


const StorePageContainer = ({isLoggedIn}) => {

    const {storename} = useParams();
    const [storeInfo, setStoreInfo] = useState(undefined);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const storeInfo = await api.viewStoreInfo(storename);
            const permissionsRes = await api.getPermissions(storename);
            setStoreInfo(storeInfo.data.data.info);

            if (permissionsRes.data.data.result)
                setPermissions(permissionsRes.data.data.permissions);
        };

        fetchData();

    }, []);

    let providerState = {
        info: storeInfo,
        permissions: permissions
    }

    return (
        storeInfo && permissions
            ? <StorePageCtx.Provider value={providerState}>
                <StorePage isLoggedIn={isLoggedIn}/>
            </StorePageCtx.Provider>
            : <Spinner message={"Loading your store"}/>
    );
}

export default StorePageContainer;

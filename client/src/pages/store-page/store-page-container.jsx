import React, {useEffect, useState} from "react";
import {StorePageCtx} from "./store-page-ctx";
import {getStoreInfo} from "../../utils";
import {StorePage} from "./store-page";
import {Spin} from "antd";


const spinnerStyle = {textAlign: "center", alignItems: "center", paddingTop: "240px"};

const StorePageContainer = ({isLoggedIn}) => {

    const [storeData, setStoreData] = useState(undefined);

    useEffect(async () => {
        const storeInfo = await getStoreInfo("store9");
        setStoreData(storeInfo.data.data.info);
    }, []);

    return storeData
        ? <StorePageCtx.Provider value={storeData}>
            <StorePage isLoggedIn={isLoggedIn} />
        </StorePageCtx.Provider>

        : <div style={spinnerStyle}>
            <Spin tip="Loading..."/>
        </div>
}

export default StorePageContainer;

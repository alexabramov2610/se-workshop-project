import React, {useEffect, useState} from "react";
import * as api from '../../utils/api';
import * as generalUtils from "../../utils/utils";
import ViewStoresPurchaseHistoryPage from "./view-stores-purchase-history-page";

const ViewStoresPurchaseHistoryContainer = (props) => {

    const [fetching, setFetching] = useState(false);
    const [stores, setStores] = useState([]);
    const [storeName, setStoreName] = useState(undefined);
    const [purchasesHistory, setPurchasesHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            await generalUtils.sleep(1000);

            const storesRes = await api.getStores(0, 100);
            const purchasesHistoryRes = await api.viewStorePurchaseHistory(storeName);

            if (purchasesHistoryRes.data.data.result) {
                const receipts = purchasesHistoryRes.data.data.receipts;
                const keyedHistory = generalUtils.addKeys(receipts);
                setPurchasesHistory(keyedHistory);
            }
            console.log(purchasesHistoryRes);
            setStores(storesRes.data.data.stores.map(s => s.storeName));
            setFetching(false);
        }

        fetchData();

    }, [storeName])

    const data = {
        stores: stores,
        storeName: storeName,
        selectStore: setStoreName,
        purchasesHistory: purchasesHistory,
        isLoading: fetching,
    };

    return (
        <ViewStoresPurchaseHistoryPage data={data} isAdmin={props.isAdmin}/>
    );

}

export default ViewStoresPurchaseHistoryContainer;
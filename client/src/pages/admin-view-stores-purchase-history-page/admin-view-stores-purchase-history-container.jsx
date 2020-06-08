import React, {useEffect, useState} from "react";
import * as api from '../../utils/api';

const AdminViewStoresPurchaseHistoryContainer = () => {

    const [stores, setStores] = useState([]);
    const [storeName, setStoreName] = useState("store1");
    const [purchasesHistory, setPurchasesHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // const storesRes = await api.getStores(0, 100);
            const purchasesHistoryRes = await api.viewStorePurchaseHistory("store1");

            // console.log("storesRes: ", storesRes, "purchasesHistoryRes: ", purchasesHistoryRes);
            console.log("purchasesHistoryRes: ", purchasesHistoryRes);
        }

        fetchData();
    }, [])

    return <div>lala</div>;

}

export default AdminViewStoresPurchaseHistoryContainer;
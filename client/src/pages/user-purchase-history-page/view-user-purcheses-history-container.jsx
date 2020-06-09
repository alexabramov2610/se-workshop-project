import React, {useEffect, useState} from "react";
import * as api from '../../utils/api';
import AdminViewUsersPurchaseHistoryPage from "./view-user-purchases-history";
import * as generalUtils from "../../utils/utils";

const ViewUsersPurchaseHistoryContainer = ({isAdmin}) => {

    const [fetching, setFetching] = useState(false);
    const [username, setUsername] = useState(undefined);
    const [purchasesHistory, setPurchasesHistory] = useState([]);
    let users = ["buyer1", "avishai", "alex", "tal", "ron"];

    useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            await generalUtils.sleep(1000);

            // const usersRes = await api.getUsers();
            const purchasesHistoryRes = await api.viewUserPurchaseHistory(username);
            console.log(purchasesHistoryRes);

            if (purchasesHistoryRes.data.data.result) {
                const receipts = purchasesHistoryRes.data.data.receipts;
                const keyedHistory = generalUtils.addKeys(receipts);
                setPurchasesHistory(keyedHistory);
            }
            setFetching(false);
        }

        fetchData();
    }, [username]);

    const data = {
        users: users,
        username: username,
        selectUser: setUsername,
        purchasesHistory: purchasesHistory,
        isLoading: fetching
    };

    return (
        <div>
            {console.log("purchasesHistory: ", purchasesHistory)}
            <AdminViewUsersPurchaseHistoryPage data={data}/>
        </div>
    );
}

export default ViewUsersPurchaseHistoryContainer;
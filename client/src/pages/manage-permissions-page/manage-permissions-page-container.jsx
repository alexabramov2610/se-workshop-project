import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import * as api from "../../utils/api";
import * as generalUtils from "../../utils/utils";
import {ManagePermissionsPageCtx} from "./manage-permissions-page-ctx";
import ManagePermissionsPage from "./manage-permissions-page.component";
import * as Message from '../../components/custom-alert/custom-alert';

const ManagePermissionsPageContainer = () => {

    const {storename} = useParams();
    const [managersPermissions, setManagersPermissions] = useState([]);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingPermissions, setFetchingPermissions] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const managersPermissionsRes = await api.getManagersPermissions(storename);
            const managersPermissionsVal = generalUtils.addKeys(managersPermissionsRes.data.data.permissions);
            setManagersPermissions(managersPermissionsVal);
            setManagers(managersPermissionsVal.map(m => m.managerName));
        }

        fetchData();
    }, [fetchingPermissions])

    const handleSubmit = async () => {
        setIsLoading(true);
        await generalUtils.sleep(1000);
        await api.updateManagersPermissions({
                body: {
                    storeName: storename,
                    permissions: managersPermissions
                }
            }
        ).then((err) => console.log("from here", err));
        setIsLoading(false);
        Message.success("Permissions changed successfully")
    }

    let providerState = {
        fetchingFlag: fetchingPermissions,
        updatePermissions: setFetchingPermissions,
        storeName: storename,
        managersPermissions: managersPermissions,
        setManagersPermissions: setManagersPermissions,
        managers: managers,
        isLoading: isLoading,
        submit: handleSubmit
    }

    return (
        <ManagePermissionsPageCtx.Provider value={providerState}>
            <ManagePermissionsPage/>
        </ManagePermissionsPageCtx.Provider>
    );

}

export default ManagePermissionsPageContainer;
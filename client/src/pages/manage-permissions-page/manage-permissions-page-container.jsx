import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import * as api from "../../utils/api";
import * as generalUtils from "../../utils/utils";
import {ManagePermissionsPageCtx} from "./manage-permissions-page-ctx";
import ManagePermissionsPage from "./manage-permissions-page.component";
import * as Message from '../../components/custom-alert/custom-alert';
import axios from "axios";

const ManagePermissionsPageContainer = () => {

    const {storename} = useParams();
    const [managersPermissions, setManagersPermissions] = useState([]);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const client = axios.create({
        baseURL: "http://localhost:4000",
        headers: {'Access-Control-Allow-Origin': '*'}
    });

    useEffect(() => {
        const fetchData = async () => {
            // const managersPermissionsRes = await api.getManagersPermissions(storename);
            // const managersPermissions = generalUtils.addKeys(managersPermissionsRes.data.data)
            // setManagersPermissions(managersPermissions);

            const mpr = await client.get("/stores/getPermissions");
            const mp = generalUtils.addKeys(mpr.data.data.permissions);
            setManagersPermissions(mp);
            setManagers(mp.map(m => m.managerName))
        }

        fetchData();
    }, [])

    function sleep(ms) { //TODO: remove
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSubmit = async () => { //TODO: handle submit
        setIsLoading(true);
        await sleep(5000);
        setIsLoading(false);
        Message.success("Permissions changed successfully")
    }

    let providerState = {
        managersPermissions: managersPermissions,
        setManagersPermissions: setManagersPermissions,
        managers: managers,
        isLoading: isLoading,
        submit: handleSubmit
    }

    return (
        <ManagePermissionsPageCtx.Provider value={providerState}>
            {console.log(managersPermissions)}
            <ManagePermissionsPage/>
        </ManagePermissionsPageCtx.Provider>
    );

}

export default ManagePermissionsPageContainer;
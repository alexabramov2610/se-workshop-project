import React, {useState} from 'react';
import {Input, Modal, Form} from 'antd';
import * as api from "../../utils/api";
import * as generalUtils from "../../utils/utils";
import BuyingPolicySettings from "../buying-policy-settings/buying-policy-settings.component";

const statuses = {
    success: "success",
    validating: "validating",
    error: "error"
};

const AddToPolicyModal = ({visible, onCancel, storeName, updatePermissions, fetchingFlag}) => {

    const [status, setStatus] = useState("");
    const [newManager, setNewManager] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");

    const analyzeResult = (res) => {
        if (res.data.error) {
            setErrorMessage(res.data.error.message);
            setStatus(statuses.error);
        } else {
            setStatus(statuses.success);
            updatePermissions(!fetchingFlag);
        }
    };

    const onOk = async () => {
        if (!newManager || newManager.length <= 0) {
            setStatus(statuses.error);
            setErrorMessage("username must be 1 characters or more");
        } else {
            setErrorMessage("");
            setStatus(statuses.validating);
            await generalUtils.sleep(1000);
            await api.assignStoreManager({
                body: {
                    storeName: storeName,
                    usernameToAssign: newManager
                }
            }).then(r => analyzeResult(r));
        }
    };

    const handleCancel = () => {
        setErrorMessage("");
        setNewManager(undefined);
        setStatus("");
        onCancel();
    }

    return (
        <Modal title="Add To Policy"
               visible={visible}
               onOk={onOk}
               okText={"Add"}
               onCancel={handleCancel}
        >
            <BuyingPolicySettings/>
        </Modal>);
}
export default AddToPolicyModal;
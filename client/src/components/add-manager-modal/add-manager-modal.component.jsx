import React, {useState} from 'react';
import {Input, Modal, Form} from 'antd';
import * as api from "../../utils/api";
import * as generalUtils from "../../utils/utils";

const statuses = {
    success: "success",
    validating: "validating",
    error: "error"
};

const AddManagerModal = ({visible, onCancel, storeName, updatePermissions, fetchingFlag}) => {

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
        <Modal title="Add Manager"
               visible={visible}
               onOk={onOk}
               okText={"Add"}
               onCancel={handleCancel}
        >
            <h3>{`${storeName} new manager`}</h3>
            <Form.Item
                hasFeedback
                validateStatus={status}
                help={errorMessage}
            >
                <Input value={newManager}
                       onChange={(e) => setNewManager(e.target.value)}
                       placeholder={"Manager Name"}
                />
            </Form.Item>
        </Modal>);
}
export default AddManagerModal;
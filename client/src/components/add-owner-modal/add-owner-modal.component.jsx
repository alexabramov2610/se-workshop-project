import React, {useState} from 'react';
import {Input, Modal, Form} from 'antd';
import * as api from "../../utils/api";
import * as generalUtils from "../../utils/utils";

const statuses = {
    success: "success",
    validating: "validating",
    error: "error"
};

const AddOwnerModal = ({visible, onCancel, storeName, updateOwners, fetchingFlag}) => {

    const [status, setStatus] = useState("");
    const [newOwner, setNewOwner] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");

    const analyzeResult = (res) => {
        if (res.data.error) {
            setErrorMessage(res.data.error.message);
            setStatus(statuses.error);
        } else {
            setStatus(statuses.success);
            updateOwners(!fetchingFlag);
        }
    };

    const onOk = async () => {
        if (!newOwner || newOwner.length <= 0) {
            setStatus(statuses.error);
            setErrorMessage("username must be 1 characters or more");
        } else {
            setErrorMessage("");
            setStatus(statuses.validating);
            await generalUtils.sleep(1000);
            await api.assignStoreOwner({
                body: {
                    storeName: storeName,
                    usernameToAssign: newOwner
                }
            }).then(r => analyzeResult(r));
        }
    };

    const handleCancel = () => {
        setErrorMessage("");
        setNewOwner(undefined);
        setStatus("");
        onCancel();
    }

    return (
        <Modal title="Add Owner"
               visible={visible}
               onOk={onOk}
               okText={"Add"}
               onCancel={handleCancel}
        >
            <h3>{`${storeName} new owner`}</h3>
            <Form.Item
                hasFeedback
                validateStatus={status}
                help={errorMessage}
            >
                <Input value={newOwner}
                       onChange={(e) => setNewOwner(e.target.value)}
                       placeholder={"Owner Name"}
                />
            </Form.Item>
        </Modal>);
}
export default AddOwnerModal;
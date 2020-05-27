import React, {useContext, useState} from 'react';
import {Button, Space, Card, Divider, Popconfirm} from 'antd';
import * as api from "../../utils/api";
import {ManageOwnersPageCtx} from "./manage-owners-page-ctx";
import AddOwnerModal from "../../components/add-owner-modal/add-owner-modal.component";
import * as Message from "../../components/custom-alert/custom-alert";
import {DeleteOutlined} from '@ant-design/icons';


const ManageOwnersPage = () => {
    const props = useContext(ManageOwnersPageCtx);
    const [visible, setVisible] = useState(false);

    const showManagerModal = () => {
        setVisible(true);
    };

    const hideManagerModal = () => {
        setVisible(false);
    };

    const analyzeResult = (result) => {
        if (result.data.error) {
            Message.error(result.data.error.message);
        }
        console.log(result);
    }

    const handleRemove = async (owner) => {
        await api.removeStoreOwner({
            body: {
                storeName: props.storeName,
                usernameToRemove: owner
            }
        }).then(res => analyzeResult(res));
        props.updateOwners(!props.fetchingFlag);
    };

    const gridStyle = {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "30px",
        textAlign: "center",
    };

    return (
        <div>
            <Divider orientation="left" style={{fontSize: "25px"}}>Store Owners</Divider>
            <Space>
                <Button
                    onClick={showManagerModal}
                    type="primary"
                    style={{marginBottom: 16}}
                >
                    Add Owner
                </Button>
            </Space>
            <Card>
                {props.owners.map(owner => {
                    return (
                        <Card.Grid style={gridStyle}>
                            {owner}
                            {props.ownersByMe.includes(owner) && <Popconfirm
                                title={"Are you sure you want to remove this owner?"}
                                onConfirm={() => handleRemove(owner)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={{border: "none", alignSelf: "center"}} icon={<DeleteOutlined />}/>
                            </Popconfirm>}
                        </Card.Grid>
                    );
                })}
            </Card>
            <AddOwnerModal visible={visible}
                           storeName={props.storeName}
                           onCancel={hideManagerModal}
                           updateOwners={props.updateOwners}
                           fetchingFlag={props.fetchingFlag}
            />
        </div>
    );
}


export default ManageOwnersPage;
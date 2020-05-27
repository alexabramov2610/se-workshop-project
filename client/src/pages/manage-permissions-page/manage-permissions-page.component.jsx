import React, {useContext, useState} from 'react';
import {Table, Button, Popconfirm, Space, Input} from 'antd';
import SearchSelect from "../../components/search-select/search-select.component";
import * as spUtils from "../store-page/store-page-utils";
import * as generalUtils from "../../utils/utils";
import {ManagePermissionsPageCtx} from "./manage-permissions-page-ctx";
import AddManagerModal from "../../components/add-manager-modal/add-manager-modal.component";
import * as api from "../../utils/api";


const ManagePermissionsPage = () => {
    const props = useContext(ManagePermissionsPageCtx);
    const [visible, setVisible] = useState(false);

    const showManagerModal = () => {
        setVisible(true);
    };

    const hideManagerModal = () => {
        setVisible(false);
    };

    const managerNameColumn = {
        title: 'Manager Name',
        dataIndex: 'managerName',
        width: '30%',
    };
    const permissionsColumn = {
        title: 'Permissions',
        dataIndex: 'permissions',
        render: (text, record) => {
            const permissions = generalUtils.prettierCollection(getRecord(record.key).permissions);
            const prettyPermissions = generalUtils.prettierCollection(Object.values(spUtils.permissions));
            const options = generalUtils.addValueKey(prettyPermissions);
            return <SearchSelect bordered={false}
                                 isMultiple={true}
                                 placeholder={"Permissions"}
                                 value={permissions}
                                 options={options}
                                 width={500}
                                 onChangeCallback={(e) => handlePermissionsChange(e, record.key)}
            />
        }
    };
    const operationColumn = {
        title: 'Operation',
        dataIndex: 'operation',
        width: '5%',
        render: (text, record) =>
            props.managersPermissions.length >= 1 && (
                <Popconfirm title="Sure you want to delete?" onConfirm={() => handleDelete(record.key)}>
                    <a>Delete</a>
                </Popconfirm>
            )
    }

    const columns = [managerNameColumn, permissionsColumn, operationColumn]

    const getRecord = (key) => {
        const index = props.managersPermissions.findIndex(item => key === item.key);
        return props.managersPermissions[index];
    }

    const handlePermissionsChange = (newPermissions, key) => {
        const capitalPermissions = generalUtils.uglierCollection(newPermissions);
        props.setManagersPermissions(prevManagersPermissions => {
            return prevManagersPermissions.map(mp => mp.key === key ? {...mp, permissions: capitalPermissions} : mp);
        })
    }

    const handleDelete = async (key) => {
        await api.removeStoreManager({
            body: {
                storeName: props.storeName,
                usernameToRemove: getRecord(key).managerName
            }
        });
        props.updatePermissions(!props.fetchingFlag);
    };

    return (
        <div>
            <Space>
                <Button
                    onClick={props.submit}
                    loading={props.isLoading}
                    type="primary"
                    style={{
                        backgroundColor: "#0fa432",
                        marginBottom: 16,
                        border: "none"
                    }}
                >
                    Update Permissions
                </Button>
                <Button
                    onClick={showManagerModal}
                    type="primary"
                    style={{marginBottom: 16}}
                >
                    Add Manager
                </Button>
            </Space>
            <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={props.managersPermissions}
                columns={columns}
                pagination={{pageSize: 7}}
            />
            <AddManagerModal visible={visible}
                             storeName={props.storeName}
                             onCancel={hideManagerModal}
                             updatePermissions={props.updatePermissions}
                             fetchingFlag={props.fetchingFlag}
            />
        </div>
    );
}


export default ManagePermissionsPage;
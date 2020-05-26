import React, {useContext} from 'react';
import {Table, Button, Popconfirm, Space} from 'antd';
import SearchSelect from "../../components/search-select/search-select.component";
import * as spUtils from "../store-page/store-page-utils";
import * as generalUtils from "../../utils/utils";
import {ManagePermissionsPageCtx} from "./manage-permissions-page-ctx";


const ManagePermissionsPage = () => {
    const props = useContext(ManagePermissionsPageCtx);
    const managers = generalUtils.addValueKey(props.managers);

    const managerNameColumn = {
        title: 'Manager Name',
        dataIndex: 'managerName',
        width: '30%',
        render: (text, record) => {
            return <SearchSelect bordered={false}
                                 placeholder={"Manager"}
                                 value={getRecord(record.key).managerName}
                                 options={managers}
                                 onChangeCallback={(e) => handleManagerChange(e, record.key)}
            />
        }
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

    const handleManagerChange = (newName, key) => {
        props.setManagersPermissions(prevManagersPermissions => {
            return prevManagersPermissions.map(mp => mp.key === key ? {...mp, managerName: newName} : mp);
        })
    }

    const handlePermissionsChange = (newPermissions, key) => {
        const capitalPermissions = generalUtils.uglierCollection(newPermissions);
        props.setManagersPermissions(prevManagersPermissions => {
            return prevManagersPermissions.map(mp => mp.key === key ? {...mp, permissions: capitalPermissions} : mp);
        })
    }

    const handleDelete = key => {
        props.setManagersPermissions(prevManagersPermissions => {
            return prevManagersPermissions.filter(item => item.key !== key);
        })
    };

    const handleAdd = () => {
        const newData = {
            key: (props.managersPermissions.length + 1) + "",
            managerName: props.managersPermissions[0].managerName,
            permissions: []
        };
        props.setManagersPermissions(prevManagersPermissions => {
            return [...prevManagersPermissions, newData];
        })
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
                    Submit
                </Button>
                <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{marginBottom: 16}}
                >
                    Add Permissions
                </Button>
            </Space>
            <Table
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={props.managersPermissions}
                columns={columns}
                pagination={{pageSize: 7}}
            />
        </div>
    );
}


export default ManagePermissionsPage;
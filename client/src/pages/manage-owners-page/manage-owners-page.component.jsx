import React, {useContext, useState} from 'react';
import {Button, Space, Card, Divider, Popconfirm, Dropdown, Menu} from 'antd';
import * as api from "../../utils/api";
import {ManageOwnersPageCtx} from "./manage-owners-page-ctx";
import AddOwnerModal from "../../components/add-owner-modal/add-owner-modal.component";
import * as Message from "../../components/custom-alert/custom-alert";
import {AiOutlineLike} from "react-icons/ai";
import {BsTrash} from "react-icons/bs";
import {RiArrowDropDownLine} from "react-icons/ri";
import * as config from "../../utils/config";

const gridStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "30px",
    textAlign: "center",
};

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
        } else {
            Message.success("Approved!");
        }
    }

    const handleRemove = async (ownerName) => {
        await api.removeStoreOwner({
            body: {
                storeName: props.storeName,
                usernameToRemove: ownerName
            }
        }).then(res => analyzeResult(res));
        props.updateOwners(!props.fetchingFlag);
    };

    const getActions = (owner) => {
        return (
            <Space>
                {props.ownersByMe.includes(owner.name) &&
                <Popconfirm
                    title={"Are you sure you want to remove this owner?"}
                    onConfirm={() => handleRemove(owner.name)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary"
                            shape="circle"
                            style={{border: "none", alignSelf: "center"}}
                            icon={<BsTrash/>}
                    />
                </Popconfirm>}
                {owner.pendingForMe &&
                <Button
                    type="primary"
                    shape="circle"
                    style={{border: "none", alignSelf: "center", backgroundColor: "#16a185"}}
                    icon={<AiOutlineLike/>}
                    onClick={() => approveOwner(owner)}
                />}
            </Space>
        );
    }

    const approveOwner = async (owner) => {
        await api.approveStoreOwner(owner.name, props.storeName).then(r => analyzeResult(r));
        props.updateOwners(!props.fetchingFlag);
    }

    const getOwners = () => {
        const approvedOwners = props.owners.map(owner => {
            return {pending: false, name: owner, pendingForMe: false}
        })
        const pendingApprovalOwners = props.agreements.map(agreement => {
            const pendingForMe = isPendingForMe(agreement);
            return {pending: true, name: agreement.newOwner, pendingForMe};
        });
        return [...approvedOwners, ...pendingApprovalOwners];
    }

    const isPendingForMe = (agreement) => {
        const requiredApprove = agreement.requiredApprove;
        const alreadyApproved = agreement.approvedBy;
        const pendingFor = requiredApprove.filter(x => !alreadyApproved.includes(x));

        return pendingFor.includes(config.loggedInUser);
    }

    const getMenu = (owner) => {
        const currOwnerAgreement = props.agreements.filter(agreement => agreement.newOwner === owner.name);
        if (!currOwnerAgreement[0]) return null;
        const requiredApprove = currOwnerAgreement[0] && currOwnerAgreement[0].requiredApprove;
        const alreadyApproved = currOwnerAgreement[0] && currOwnerAgreement[0].approvedBy;
        const pendingFor = requiredApprove.filter(x => !alreadyApproved.includes(x));

        console.log("owner: ", owner.name, "requiredApprove", requiredApprove);
        return (
            <Menu>
                {pendingFor.map((approvedOwner, idx) => {
                    return <Menu.Item key={idx + ""}>{approvedOwner}</Menu.Item>;
                })}
            </Menu>
        );
    };

    const getInfo = (owner) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {owner.name}
                {owner.pending ? <Dropdown overlay={getMenu(owner)}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}
                       style={{fontSize: "18px"}}>
                        Pending for <RiArrowDropDownLine/>
                    </a>
                </Dropdown> : <div style={{fontSize: "18px"}}>Owner</div>}
            </div>
        );
    };

    return (<>
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
            {getOwners().map(owner => {
                return (
                    <Card.Grid style={gridStyle}>
                        {getInfo(owner)}
                        {getActions(owner)}
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
    </>);
}


export default ManageOwnersPage;
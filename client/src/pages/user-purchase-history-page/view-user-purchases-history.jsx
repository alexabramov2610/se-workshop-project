import React, {useEffect} from "react";
import {Descriptions, Divider, Space, Table} from "antd";
import SearchSelect from "../../components/search-select/search-select.component";
import {AiOutlineUser} from "react-icons/ai";
import moment from "moment";
import * as generalUtils from "../../utils/utils";
import * as config from "../../utils/config";
import {useParams} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";

const itemStyle = {borderBottom: "1px solid lightskyblue"};

const getExtended = (record) => {
    console.log(record);
    return (
        <Descriptions bordered size={"small"} column={4} style={{backgroundColor: "#B6E7FF"}}>
            {record.purchases.map(purchase => {
                return (
                    <React.Fragment>
                        <Descriptions.Item style={itemStyle} label={<BsThreeDots/>}></Descriptions.Item>
                        <Descriptions.Item style={itemStyle} label="Store:">{purchase.storeName}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle}
                                           label="Product:">{purchase.item.catalogNumber}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle} label="Price:">{purchase.price + "₪"}</Descriptions.Item>
                    </React.Fragment>
                )
            })}
        </Descriptions>
    );
};

const getValue = (props) => {
    return config.isAdmin && props.data.username;
}

const AdminViewUsersPurchaseHistoryPage = (props) => {

    const {data} = props;
    const users = generalUtils.addValueKey(data.users);
    const tableData = data.purchasesHistory.map(p => {
        const currDate = moment(p.date);
        const pDate = currDate.format('DD/MM/YYYY');
        return {
            key: p.key,
            transactionID: p.payment.transactionID,
            date: pDate,
            user: p.purchases[0].userName,
            last4: p.payment.lastCC4,
            total: p.payment.totalCharged + "₪",
            purchases: p.purchases
        };
    });

    useEffect(() => {
        !config.isAdmin && props.data.selectUser(config.loggedInUser);
    },[]);

    return (
        <React.Fragment>
            <Divider style={{fontSize: "25px"}} orientation={"left"}>View User Purchases History</Divider>
            <Space style={{paddingBottom: "20px"}}>
                <AiOutlineUser/>
                {config.isAdmin
                    ? <SearchSelect
                        size={"large"}
                        isLoading={data.isLoading}
                        value={getValue(props)}
                        onChangeCallback={e => data.selectUser(e)}
                        bordered={false}
                        placeholder={"select a user"}
                        options={users}
                    />
                    : `${config.loggedInUser}`}
            </Space>
            <Table
                expandable={{
                    expandedRowRender: record => getExtended(record),
                }}
                columns={columns}
                dataSource={tableData}
                scroll={{y: 400}}
            />
        </React.Fragment>
    );
};

const columns = [
    {
        title: 'Transaction ID',
        dataIndex: 'transactionID',
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'User',
        dataIndex: 'user',
    },
    {
        title: 'last 4 digits',
        dataIndex: 'last4',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        width: "8%"
    },
];

export default AdminViewUsersPurchaseHistoryPage;
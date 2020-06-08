import React from "react";
import {Descriptions, Divider, Space, Table} from "antd";
import SearchSelect from "../../components/search-select/search-select.component";
import {AiOutlineUser} from "react-icons/ai";
import moment from "moment";

const itemStyle = {borderBottom: "1px solid lightskyblue"};

const getExtended = (record) => {
    console.log(record);
    return (
        <Descriptions bordered size={"small"}>
            {record.purchases.map(purchase => {
                return (
                    <React.Fragment>
                        <Descriptions.Item style={itemStyle} label="Store:">{purchase.storeName}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle} label="Product:">{purchase.item.catalogNumber}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle} label="Price:">{purchase.price + "$"}</Descriptions.Item>
                    </React.Fragment>
                )
            })}
        </Descriptions>
    );
};

const getTotalPrice = (p) => {
    return p.purchases.reduce((acc, curr) => acc += curr.price, 0);
}

const AdminViewUsersPurchaseHistoryPage = (props) => {

    const {data} = props;
    const users = data.users.map(user => {
        return {value: user};
    });
    const tableData = data.purchasesHistory.map(p => {
        const currDate = moment(p.date);
        const pDate = currDate.format('DD/MM/YYYY');

        return {
            date: pDate,
            user: p.purchases[0].userName,
            last4: 1234,
            total: getTotalPrice(p) + "$",
            purchases: p.purchases
        };
    });

    return (
        <React.Fragment>
            <Divider style={{fontSize: "25px"}} orientation={"left"}>View Users Purchases History</Divider>
            <Space style={{paddingBottom: "20px"}}>
                <AiOutlineUser/>
                <SearchSelect
                    size={"large"}
                    isLoading={data.isLoading}
                    value={data.username}
                    onChangeCallback={e => data.selectUser(e)}
                    bordered={false}
                    placeholder={"select a user"}
                    options={users}
                />
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
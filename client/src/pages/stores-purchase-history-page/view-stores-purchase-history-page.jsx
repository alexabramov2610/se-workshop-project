import React, {useEffect} from "react";
import {Descriptions, Divider, Space, Table} from "antd";
import SearchSelect from "../../components/search-select/search-select.component";
import moment from "moment";
import {useParams} from "react-router-dom";
import * as generalUtils from "../../utils/utils";
import {FaStore} from "react-icons/fa";
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
                        <Descriptions.Item style={itemStyle} label="User: ">{purchase.userName}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle}
                                           label="Product:">{purchase.item.catalogNumber}</Descriptions.Item>
                        <Descriptions.Item style={itemStyle} label="Price:">{purchase.price + "₪"}</Descriptions.Item>
                    </React.Fragment>
                )
            })}
        </Descriptions>
    );
};

const getTotalPrice = (p) => {
    return p.purchases.reduce((acc, curr) => acc += curr.price, 0);
}

const getValue = (props, storename) => {
    return !props.isAdmin ? storename : props.data.storeName;
}

const ViewStoresPurchaseHistoryPage = (props) => {

    const {data} = props;
    const {storename} = useParams();
    const stores = generalUtils.addValueKey(data.stores);
    const tableData = data.purchasesHistory.map(p => {
        const currDate = moment(p.date);
        const pDate = currDate.format('DD/MM/YYYY');

        return {
            key: p.key,
            date: pDate,
            user: p.purchases[0].userName,
            last4: p.payment.lastCC4,
            total: p.payment.totalCharged + "₪",
            purchases: p.purchases
        };
    });

    useEffect(() => {
        !props.isAdmin && props.data.selectStore(storename);
    },[]);

    return (
        <React.Fragment>
            <Divider style={{fontSize: "25px"}} orientation={"left"}>View Store Purchases History</Divider>
            <Space style={{paddingBottom: "20px"}}>
                <FaStore/>
                {!props.isAdmin
                    ? `${storename}`
                    : <SearchSelect
                        size={"large"}
                        isLoading={data.isLoading}
                        value={getValue(props, storename)}
                        onChangeCallback={e => data.selectStore(e)}
                        bordered={false}
                        placeholder={"select a store"}
                        options={stores}
                    />}
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

export default ViewStoresPurchaseHistoryPage;
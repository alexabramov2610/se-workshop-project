import React, {useState} from 'react';
import {Table, Radio, Divider, Empty, Space, Card} from 'antd';
import SearchSelect from "../search-select/search-select.component";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";

const columns = [
    {
        title: 'Catalog Number',
        dataIndex: 'catalogNumber',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.price - b.price,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name > b.name,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Price',
        dataIndex: 'price',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.price - b.price,
    },
    {
        title: 'Category',
        dataIndex: 'category',
        filters: [
            {
                text: 'London',
                value: 'London',
            },
            {
                text: 'New York',
                value: 'New York',
            },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.category.indexOf(value) === 0,
        sorter: (a, b) => a.category.length - b.category.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
        filterMultiple: false,
        sorter: (a, b) => a.rating - b.rating,
        sortDirections: ['descend', 'ascend'],
    },
];

function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}

const rowSelection = {
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

const handleRowsPick = (selectedRowKeys, selectedRows, props) => {
    props.setDiscount(prevDiscount => {
        return {...prevDiscount, products: [...selectedRows]};
    })
}

const SubjectProducts = () => {
    const [selectionType, setSelectionType] = useState('checkbox');

    return (
        <DiscountPageCtx.Consumer>
            {
                (props) => {
                    const categories = props.categories.map(category => {
                        return {value: category}
                    });

                    return <div style={{overflow: 'hidden'}}>
                        <Radio.Group onChange={(e) => props.switchSubject(e.target.value)}
                                     value={props.subject}
                                     style={{display: 'flex'}}>
                            <Radio.Button value="store">STORE</Radio.Button>
                            <Radio.Button value="products">PRODUCTS</Radio.Button>
                            <Radio.Button verticalAlign='middle' value="category">
                                CATEGORY
                            </Radio.Button>
                            {props.subject === "category" &&
                            <SearchSelect bordered={false} placeholder={"Pick Category"} options={categories}
                                          onChangeCallback={props.selectCategory}/>}
                        </Radio.Group>
                        <Divider/>
                        {props.subject === 'products'
                            ? <React.Fragment>
                                <Radio.Group
                                    onChange={({target: {value}}) => {
                                        setSelectionType(value);
                                    }}
                                    value={selectionType}
                                >
                                </Radio.Group>
                                <Table rowSelection={{
                                    type: selectionType,
                                    onChange: (selectedRowKeys, selectedRows) => handleRowsPick(selectedRows, selectedRowKeys, props),
                                    ...rowSelection,
                                }} pagination={{pageSize: 10}}
                                       scroll={{y: 420}}
                                       columns={columns}
                                       dataSource={props.products}
                                       onChange={onChange}/>
                            </React.Fragment>
                            : <Empty description={<p>No products needed for store and category</p>}/>}
                    </div>
                }
            }

        </DiscountPageCtx.Consumer>
    );
}


export default SubjectProducts;

const cors = require("cors");

const express = require('express')
const app = express()
const port = 4000
app.use(cors());

const permissions = {
    WATCH_PURCHASES_HISTORY: "WATCH_PURCHASES_HISTORY",
    WATCH_USER_QUESTIONS: "WATCH_USER_QUESTIONS",
    REPLY_USER_QUESTIONS: "REPLY_USER_QUESTIONS",
    MODIFY_BUYING_METHODS: "MODIFY_BUYING_METHODS",
    MODIFY_DISCOUNT: "MODIFY_DISCOUNT",
    MANAGE_INVENTORY: "MANAGE_INVENTORY",
    CLOSE_STORE: "CLOSE_STORE"
}

const mockCategories = {
    data: {
        categories: [
            "Electronics",
            "Home",
            "Clothing",
            "SHIT CATEGORY"
        ]
    }
};

const mockProducts = {
    data: {
        products: [
            {
                storeName: "my cool store",
                product: {
                    catalogNumber: 123, name: "product1", price: 350, category: "Electronics", rating: 2
                }
            },
            {
                storeName: "my cool store",
                product: {
                    catalogNumber: 456, name: "product2", price: 200, category: "Home", rating: 3
                }
            },
            {
                storeName: "my cool store",
                product: {
                    catalogNumber: 789, name: "product3", price: 220, category: "Clothing", rating: 5
                }
            }
        ]
    }
}

let mockPolicy = {
    data: {
        policy: {
            discounts:
                [
                    {
                        // key: "0",
                        discount: {
                            category: "Electronics",
                            startDate: new Date(),
                            duration: 12,
                            products: [123, 789],
                            percentage: 23,
                            coupon: "avishai coupon code",
                            condition: [{
                                condition: {
                                    catalogNumber: 123,
                                    minAmount: 35,
                                },
                                operator: "XOR"
                            }, {
                                condition: {
                                    catalogNumber: 456,
                                    minAmount: 24,
                                },
                                operator: "AND"
                            }],
                        },
                        operator: "AND"
                    },
                    {
                        // key: "1",
                        discount: {
                            startDate: new Date(),
                            duration: 24,
                            products: [456, 789],
                            percentage: 89,
                            condition: [{
                                condition: {
                                    catalogNumber: 456,
                                },
                                operator: "AND"
                            }],
                        },
                        operator: "OR"
                    },
                    {
                        // key: "2",
                        discount: {
                            startDate: new Date(),
                            duration: 19,
                            products: [],
                            percentage: 12,
                            condition: [{
                                condition: {
                                    minPay: 25
                                },
                                operator: "AND"
                            }],
                        },
                        operator: "XOR"
                    },
                ]
        }
    }
}

const mockPermissions = {
    data: {
        permissions: [
            {managerName: "yosi", permissions: [permissions.MODIFY_BUYING_METHODS, permissions.MODIFY_DISCOUNT]},
            {managerName: "dani", permissions: [permissions.REPLY_USER_QUESTIONS, permissions.CLOSE_STORE]},
            {managerName: "dor", permissions: []}
        ]
    }
}

// app.get('/getStores', (req, res) => res.send({add: "ad"}))
// app.get('/products', (req, res) => res.send(mockProducts))
// app.get('/stores/getCategories', (req, res) => res.send(mockCategories))
// app.get('/stores/getPolicy', (req, res) => res.send(mockPolicy))
app.get('/stores/getPermissions', (req, res) => res.send(mockPermissions))
app.get('/stores/getInfo', (req, res) => res.send(mockPermissions))
// app.post('/stores/getPolicy', (res) => mockPolicy.data.policy.discounts.push(res.body));

app.listen(port, () => console.log(`express server is running`))
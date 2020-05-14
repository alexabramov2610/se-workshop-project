
const cors = require("cors");

const express = require('express')
const app = express()
const port = 4000
app.use(cors());

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
                            startDate: new Date(),
                            duration: 12,
                            products: [123, 789],
                            percentage: 23,
                            condition: [{
                                condition: {
                                    catalogNumber: 123,
                                    minAmount: 35,
                                },
                                operator: "XOR"
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
                                    minAmount: 112,
                                },
                                operator: "AND"
                            }],
                        },
                        operator: "OR"
                    },
                ]
        }
    }
}


app.get('/getStores', (req, res) => res.send({add: "ad"}))
app.get('/products', (req, res) => res.send(mockProducts))
app.get('/stores/getCategories', (req, res) => res.send(mockCategories))
app.get('/stores/getPolicy', (req, res) => res.send(mockPolicy))
app.post('/stores/getPolicy', (res) => mockPolicy.data.policy.discounts.push(res.body));

app.listen(port, () => console.log(`express server is running`))
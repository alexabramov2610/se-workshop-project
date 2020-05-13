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


app.get('/getStores', (req, res) => res.send({add: "ad"}))
app.get('/products', (req, res) => res.send(mockProducts))
app.get('/stores/getCategories', (req, res) => res.send(mockCategories))

app.listen(port, () => console.log(`express server is running`))
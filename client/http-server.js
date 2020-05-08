const express = require('express')
const app = express()
const port = 3000


const mockStores = {
    
}



app.get('/getStores', (req, res) => res.send({ add: "ad" }))

app.listen(port, () => console.log(`express server is running`))
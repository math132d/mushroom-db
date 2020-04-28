const express = require('express')
const app = express()

//IMPORT REQUEST HANDLERS

app.get("/mushrooms", (req, res) => {
    res.send('hello world')
})

app.get("/mushroom/:id", () => {
    //...
})

app.post("/mushroom", () => {
    //...
})

app.get("/genus/:genus", () => {
    //...
})

app.get("/family/:family", () => {
    //...
})

app.listen(30030)
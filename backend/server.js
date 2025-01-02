const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (re, res) => {
    return res.json("from backend");
})

app.listen(8081, ()=> {
    console.log("listening");
})
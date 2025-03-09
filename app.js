const express = require('express');
const app = express();
const router = require("./src/router/router")
const port = 8080;
const client = require("./src/connection/conn")

app.use(express.json());
app.use("/user", router);

app.listen(port, () =>{
    console.log(`connection setup at ${port}`)
});
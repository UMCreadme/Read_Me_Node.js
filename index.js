// const express = require('express')   // common JS
import express from 'express'          // ES6
import { testRouter } from './src/test/test.route.js'
import {userRouter} from "./src/users/users.route.js";

const app = express()
const port = 3000

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use('/test', testRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
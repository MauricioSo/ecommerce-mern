const express = require("express");
const app = express();
//import Routes
const authRoute = require('./routes/auth');
const privatRoute = require('./routes/especialRouts')
//import mongoose 
const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config();
//connect to db

mongoose.connect("mongodb+srv://mauricio:mauricio_5@cluster0-kjq20.mongodb.net/test?retryWrites=true&w=majority", () => {
    console.log("connected to db...")
})

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

//middlewares 

app.use(express.json());
//Route Middlewares

app.use('/api/user', authRoute);
app.use('/privat', privatRoute);
app.get('/', (req, res) => {
    res.send("hello");
})

app.listen(3000, () => {
    console.log("server running...");
})
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Setup
mongoose.connect('mongodb://admin:root@ds127899.mlab.com:27899/api_boiler', () => {
	console.log('DB Connected');
});

// routes
const userRoutes = require('./api/routes/user');

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

app.use("/user", userRoutes);

module.exports = app;
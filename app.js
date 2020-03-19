const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const app = express();

const passport = require('passport');

const session = require('express-session');

const db = require('./config/keys').MongoUrl;

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const mongoose = require('mongoose');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Db connected"))
    .catch(err => console.log(err));

app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

const Port = process.env.PORT || 5000;

app.listen(Port, console.log(`Server started on Port ${Port}`))
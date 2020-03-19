const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const app = express();

const passport = require('passport');

const flash = require('connect-flash');

const session = require('express-session');

const db = require('./config/keys').MongoUrl;

app.use(expressLayouts);
require('./config/passport')(passport);

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});


app.use(flash());

const mongoose = require('mongoose');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Db connected"))
    .catch(err => console.log(err));

app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

const Port = process.env.PORT || 9000;

app.listen(Port, console.log(`Server started on Port ${Port}`))
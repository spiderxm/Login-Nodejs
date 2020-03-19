const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => res.render("login"));


const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.get('/register', (req, res) => res.render("register"));

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    console.log(name, email, password2, password);
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (password != password2) {
        errors.push({ msg: 'Passowrds do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Pasword should be atleast 6 character' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {

        User.findOne({ email: email }).then(
            user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    res.redirect('/user/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        });
                    })
                }
            }).catch(err => console.log(err));
    }
});

module.exports = router;
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { db } = require('../Models/User');
const jwt_key = 'aFin!23d5jao83dlT5lOlKDdn2';

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.json({ error: "user not found !", errorCode: 1 });
        }
        bcrypt.compare(password, user.password).then(loggedin => {
            if (!loggedin) {
                return res.json({ error: "wrong credentials!" });
            }
            const token = jwt.sign({ _id: user._id }, jwt_key);
            req.headers.authorization = "Bearer " + token;
            const { _id, name, email } = user;
            return res.json({ message: "Signed in successfully!", token: token, _id: user._id })
        })
    }).catch(err => {
        res.json({ error: "User not found!" });
    })
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }).then(userExist => {
        if (userExist) {
            return res.json({ error: "User already exists!", errorCode: 1 });
        }
        bcrypt.hash(password, 12).then(hashedPsw => {
            const newUser = new User({ name, email, password: hashedPsw });
            newUser.save().then(userSaved => {
                userSaved.password = undefined;
                const token = jwt.sign({ _id: userSaved._id }, jwt_key);
                req.headers.authorization = "Bearer " + token;
                return res.json({ message: "Account created successfully!", token: token, _id: userSaved._id });
            }).catch(err => {
                res.json({ error: 'something went wrong!' });
            })
        }).catch(err => {
            res.json({ error: 'something went wrong!' });
        })
    }).catch(err => {
        res.json({ error: 'something went wrong!' });
    })
})

// for development purpose
router.get('/delete-all-users', (req, res) => {
    User.deleteMany({}).then(val => {
        db.collection('contacts', {}, (err, contacts) => {
            contacts.remove({}, (err, result) => {
                db.close();
            });
        })
        return res.json(val)
    })

})

module.exports = router;
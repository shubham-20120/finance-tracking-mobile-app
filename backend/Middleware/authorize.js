const jwt = require('jsonwebtoken');
const jwt_key = 'aFin!23d5jao83dlT5lOlKDdn2';

const User = require('../Models/User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.json({ error: "please login to create blog" })
    }
    const token = authorization.replace("Bearer ", "");
    console.log('tkn from authorise', authorization);
    jwt.verify(token, jwt_key, (err, payload) => {
        if (err) {
            console.log('err', err);
            return res.json({ error: "please login to handle expenses" })
        }
        const _id = payload;
        User.findOne({ _id }).then(user => {
            req.user = user;
            next()
        }).catch(err => {
            return res.json({ error: "something went wrong! please try again" })
        })
    })
}
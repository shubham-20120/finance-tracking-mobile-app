const express = require('express')
const router = express.Router();
const authenticate = require('../Middleware/authorize');
const Data = require('../Models/Data');
const { db } = require('../Models/Data');


router.post('/create', authenticate, (req, res) => {
    const { title, price, transactionType, description } = req.body;
    const newEntry = new Data({ title, price, transactionType, description, owner: req.user._id });
    newEntry.save().then(entry => {
        if (!entry) {
            return res.json("Something went wrong1!")
        }
        return res.json({ message: "Entry added!", "newEntry": entry });
    }).catch(error => {
        return res.json({ error: "Something went wrong!" });
    })
})

router.post('/get-item-by-id', (req, res) => {
    const { _id } = req.body;
    Data.findOne({ _id }).then(data => {
        return res.json({ 'data': data })
    }).catch(e => {
        return res.json({ "error": 'something went wrong!' })
    })
})

router.get('/get-all-entries', authenticate, (req, res) => {
    const { _id } = req.user;
    Data.find({ owner: _id }).then(data => {
        return res.json({ "data": data });
    }).catch(err => {
        return res.json({ "error": "something went wrong!" });
    })
})

router.post('/delete-item-by-id', (req, res) => {
    const { _id } = req.body;
    Data.deleteOne({ _id }).then(deleted => {
        return res.json(deleted)
    }).catch(e => {
        return res.json({ "error": 'something went wrong!' })
    })
})

// for development purpose
// router.get('/delete-all-data', (req, res) => {
//     Data.deleteMany({}).then(val => {
//         db.collection('contacts', {}, (err, contacts) => {
//             contacts.remove({}, (err, result) => {
//                 if (err) {
//                 }
//                 db.close();
//             });
//         })
//         return res.json(val)
//     })

// })

module.exports = router
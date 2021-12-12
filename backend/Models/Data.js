const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const dataSchema = mongoose.Schema({
    title: { type: String, require: true },
    price: { type: mongoose.Types.Decimal128, require: true },
    transactionType: { type: String, require: true },
    description: { type: String },
    owner: { type: ObjectId, require: true }
})
const Data = mongoose.model("Data", dataSchema, "Data");
module.exports = Data;
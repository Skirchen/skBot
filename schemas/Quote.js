const mongoose = require("mongoose");
const {Schema} = mongoose;

const quoteSchema = new Schema({
    quote: String,
    channel: String,
    date: {type: Date, default:Date.now()}
})

module.exports = mongoose.model('Quote', quoteSchema);
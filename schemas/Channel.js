const mongoose = require("mongoose");
const {Schema} = mongoose;

const channelSchema = new Schema({
    channelName:String
})

module.exports = mongoose.model("Channel", channelSchema);
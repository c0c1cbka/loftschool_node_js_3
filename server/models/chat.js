const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userId: {
        type: String
    },
    messanges: {
        type: Map,
        of: [{
            senderId: String,
            recipientId: String,
            text: String
        }]
    }
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messangeschema = new Schema({
    datetime: {
        type: Date
    },
    recipientId: {
        type: String
    },
    text: {
        type: String
    },
});

const Messanges = mongoose.model('messanges', messangeschema);

module.exports = Messanges;
const { Title } = require('@material-ui/icons');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    created_at: {
        type: Date
    },
    text:{
        type: String
    },
    title:{
        type:String
    },
    user:{
        firstName: String,
        id: String,
        image: String,
        middleName: String,
        surName: String,
        username: String
    }
});

const News = mongoose.model('news',newsSchema);

module.exports = News;
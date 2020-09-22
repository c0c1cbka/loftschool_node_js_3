const mongoose = require('mongoose');
const config = require('../config.json');
const User = require('./user');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,

    user: config.mongo_user,
    pass: config.mongo_pass,
    dbName: config.mongo_dbName
});

mongoose.connection.on('connected', ()=>{
    console.log('Mongoose connected sucess');
});

mongoose.connection.on('error', (err)=>{
    console.log(`Mongoose connected error: ${err}`);
});

mongoose.connection.on('disconnected', (err)=>{
    console.log('Mongoose connected disconnected');
});

module.exports.findUserByName = (username)=>{
    return User.findOne({username});
}

module.exports.findUserById = (id)=>{
    return User.findOne({id});
}
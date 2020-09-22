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

module.exports.createNewUser = async(obj)=>{
    if(!obj.username || !obj.password){
        throw 'Обязательное поле не заполнено';
    }
    try{
        var user = await this.findUserByName(obj.username);
    }catch{
        null;
    }

    if(user){
        throw 'username занят';
    }

    let newUser = new User({
        firstName: obj.firstName,
        image: null,
        middleName: obj.middleName,
        permission: {
            chat: { C: true, R: true, U: true, D: true },
            news: { C: true, R: true, U: true, D: true },
            settings: { C: true, R: true, U: true, D: true }
        },
        surName: obj.surName,
        username: obj.username
    });

    newUser.setPassword(obj.password);

    try{
        await newUser.save();
    }catch(err){
        console.error(err);
        throw 'Обратитесь к администратору';
    }
    
    return newUser;
}
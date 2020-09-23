const { join } = require('lodash');
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

function findUserByName (username){
    return User.findOne({username});
}

const findUserById = (id)=>{
    //return User.findOne({id});
    return User.findById(id);
}

async function createNewUser(obj){
    if(!obj.username || !obj.password){
        throw 'Обязательное поле не заполнено';
    }
    try{
        var user = await findUserByName(obj.username);
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

async function getUserObjById (userId){
    try{
        var user = await findUserById(userId);
    }catch(err){
        throw err;
    }    

    if(!user){
        throw 'Пользователь не найден';
    }

    return {
        firstName: user.firstName,
        id: user._id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username
    };
}

async function updateUserData (userId, obj){
    try{
        var user = await findUserById(userId);
    }catch(err){
        throw err;
    } 

    if(!user.validPassword(obj.oldPassword)){
        throw 'неверный старый пароль';
    }

    let genPassword = new User;
    genPassword.setPassword(obj.newPassword);

    userUpdObj = {
        firstName: obj.firstName,
        image: obj.avatar,
        middleName: obj.middleName,
        surName: obj.surName,
        password: genPassword.password
    }

    try{
        await User.findByIdAndUpdate({_id:userId},userUpdObj);
    }catch(err){
        throw err;
    }

    try{
        userUpd = await getUserObjById(userId);
    }catch(err){
        throw err;
    }   

    return userUpd;
}

async function getAllUsers(){
    try {
        var users = await User.find({});
    } catch (error) {
        throw 'обратитесь к администратору'
    }
    console.log(users);
    return users;
}

async function deleteUser(userId){
    try {
        await User.findOneAndRemove({ id: id });
    } catch (error) {
        throw 'обратитесь к администратору'
    }
}

async function updateUserPermission(userId,permissionObj){
    try{
        await User.findByIdAndUpdate({_id:userId},permissionObj);
    }catch(err){
        throw err;
    }

    try{
        var user = await getUserObjById(userId);
    }catch(err){
        throw err;
    }

    return user;
}

module.exports = {
    findUserByName,
    findUserById,
    createNewUser,
    getUserObjById,
    updateUserData,
    getAllUsers,
    deleteUser,
    updateUserPermission
}
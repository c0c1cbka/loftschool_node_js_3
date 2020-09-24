const { join } = require('lodash');
const mongoose = require('mongoose');
const config = require('../config.json');
const User = require('./user');
const News = require('./news');

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

/*----------------------------------------------------------------*/
/*----------------Работа с User-----------------------------------*/

function findUserByName (username){
    return User.findOne({username});
}

function findUserById (id){
    //return User.findOne({id});
    return User.findById(id);
}

async function createNewUser(obj){
    if(!obj.username || !obj.password){
        throw 'Обязательное поле не заполнено';
    }
    try{
        var user = await findUserByName(obj.username);
    }catch(err){
        console.error(err);
        throw 'Обратитесь к администратору';
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
    return users;
}

async function getAllUsersObj(){
    try {
        var users = await getAllUsers();
    } catch (error) {
        throw 'обратитесь к администратору'
    }

    let usersObjArr = [];

    for(let i=0;i<users.length;i++){
        try{
            userObj = await getUserObjById(users[i]._id);
        }catch(err){
            throw err;
        } 
        usersObjArr.push(userObj);
    }

    return usersObjArr;
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

/*----------------------------------------------------------------*/
/*----------------Работа с News-----------------------------------*/
function findNewsById (id){
    return News.findById(id);
}

async function getNewsObjById(newsId){
    try{
        var news = await findNewsById(newsId);
    }catch(err){
        throw err;
    }    

    if(!news){
        throw 'Пользователь не найден';
    }

    return {
            id: news._id,
            created_at: news.created_at,
            text: news.text,
            title: news.title,
            user: {
                firstName: news.user.firstName,
                id: news.user.id,
                image: news.user.image,
                middleName: news.user.middleName,
                surName: news.user.surName,
                username: news.user.username
            }
    };
}

async function getAllNews(){
    try {
        var news = await News.find({});
    } catch (error) {
        throw 'обратитесь к администратору'
    }
    return news;
}

async function getAllNewsObj(){
    try {
        var news = await getAllNews();
    } catch (error) {
        throw 'обратитесь к администратору'
    }

    let newsObjArr = [];

    for(let i=0;i<news.length;i++){
        try{
            newsObj = await getNewsObjById(news[i]._id);
        }catch(err){
            throw err;
        } 
        newsObjArr.push(newsObj);
    }

    return newsObjArr;
}

async function createNewNews(userId, title, text){
    if(!obj.text || !obj.title ){
        throw 'Обязательые поля не заполнены';
    }

    try {
        var user = await findUserById(userId);
    } catch (error) {
        throw 'обратитесь к администратору'
    }


    let newNews = new News({
        created_at: new Date().toISOString(),
        text: text,
        title: title,
        user:{
            firstName: user.firstName,
            id: user._id,
            image: user.image,
            middleName: user.middleName,
            surName: user.surName,
            username: user.username
        }
    });

    try{
        await newNews.save();
    }catch(err){
        console.error(err);
        throw 'Обратитесь к администратору';
    }
}

async function deleteNews(newsId){
    try {
        await News.findOneAndRemove({ id: newsId });
    } catch (error) {
        throw 'обратитесь к администратору'
    }
}

async function updateNews(newsId, text, title){

    newsUpdObj = {
        text: text,
        title: title
    }

    try{
        await User.findByIdAndUpdate({_id:newsId},newsUpdObj);
    }catch(err){
        throw err;
    }

    try{
        userUpd = await getNewsObjById(newsId);
    }catch(err){
        throw err;
    }   

    return userUpd;
}

/*----------------------------------------------------------------*/
module.exports = {
    findUserByName,
    findUserById,
    createNewUser,
    getUserObjById,
    updateUserData,
    getAllUsersObj,
    deleteUser,
    updateUserPermission,

    getNewsObjById,
    getAllNewsObj,
    createNewNews,
    deleteNews,
    updateNews
}
const passport = require('passport');
const token = require('../auth/token');
const db = require('../models');
const config = require('../config.json');

const auth = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (!user || err) {
            res.status(401).json({
                statusMessage: 'Error',
                data: {
                    status: 401,
                    message: 'Unauthorized'
                }
            });
        } else {
            next();
        }
    })(req, res, next);
};

const login = (req,res,next)=>{
    passport.authenticate('local', {session:false},(err, user, info)=>{
        if(err){
            next(err);
        }
        if(user){
            const tokens = token.createToken(user,config.secret_token);
            res.json({
                firstName: user.firstName,
                id: user._id,
                image: user.image,
                middleName: user.middleName,
                permission: user.permission,
                surName: user.surName,
                username: user.username,
                ...tokens
            });
        }else{
            res.status(400).json({message:"Неверный логин или пароль"});
        }
    })(req,res,next);
};

const registration = async(req,res,next)=>{
    try{
        var user = await db.createNewUser(req.body);
    }catch(err){
        res.status(400).json({message:err});
        return;
    }
    login(req,res,next);
};

const refreshToken = (req,res,next)=>{
    const refresh = req.headers['authorization'];
    const tokens = token.refreshToken(refresh, config.secret_token);
    res.json(tokens);
}

module.exports = {
    login,
    registration,
    refreshToken,
    auth
}
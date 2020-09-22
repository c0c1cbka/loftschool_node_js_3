const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config.json');
const db = require('../models');

const params = {
    secretOrKey: config.JWT_key,
    jwtFromRequest: (req) => {
        let token = null;
        if (req && req.headers) {
            token = req.headers['authorization'];
        }
        return token;
    }
}

passport.use(new LocalStrategy(async (username, password, done) => {
    try{
        var user = await db.findUserByName(username);
    } catch (err){
        return done(err);
    }
    
    if(user && user.validPassword(password)){
        done(null, user);
    }else{
        done(null,false);
    }
}));

passport.use(new JWTStrategy(params, async (payload, done) => {
    try{
        var user = await db.findUserById(payload.id);
    }catch(err){
        return done(err);
    }

    if(user){
        done(null, {id: user.id});
    }else{
        done(null, false);
    }
}));
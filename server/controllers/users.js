const token = require('../auth/token');
const db = require('../models');
const config = require('../config.json');

const getProfile = (req, res, next)=>{
    let token_tmp = req.headers['authorization'];
    let user = db.findUserById(token.getUserIdByToken(token_tmp, config.secret_token));
    console.log(user);
    res.json({status:1});
}

module.exports = {
    getProfile
}
const jwt = require('jsonwebtoken');
const config = require('../config.json');

let createToken = (user, secret)=>{
    const accessToken = jwt.sign({
            user: {
                id: user.id
            }
        },
        secret, {
            expiresIn: `${config.time_live_token}m`
        }
    );

    const refreshToken = jwt.sign({
            user: {
                id: user.id
            }
        },
        secret, {
            expiresIn: `${config.time_live_refresh_token}m`
        }
    );

    const verifyAccess = jwt.verify(accessToken, secret);
    const verifyRefresh = jwt.verify(refreshToken, secret);

    return {
        accessToken,
        refreshToken,
        accessTokenExpiredAt: verifyAccess.exp * 1000,
        refreshTokenExpiredAt: verifyRefresh.exp * 1000
    }
};

let refreshToken = (refreshToken, secret)=>{
    try{
        var user = jwt.verify(refreshToken, secret).user;
    }catch(error){
        return {};
    }

    return createToken(user, secret);
};

module.exports = {
    createToken,
    refreshToken
}
// const formidable = require('formidable');
// const fs = require('fs');
// const path = require('path');

const token = require('../auth/token');
const models = require('../models');
const db = require('../models');

// const upload = path.join(process.cwd(), '/build/assets/img/');

function getAllNews(req, res, next){
    try {
        var news = await db.getAllNewsObj();
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    res.json(news);
}

function createNews(req, res, next){    
    let title = req.body.title;
    let text = req.body.text;

    let token_tmp = req.headers['authorization'];
    let userId = token.getUserIdByToken(token_tmp, config.secret_token);

    try {
        var news = await db.createNewNews(userId,title,text);
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    getAllNews(req, res, next);
}

module.exports = {
    getAllNews,
    createNews
}
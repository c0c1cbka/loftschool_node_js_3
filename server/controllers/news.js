// const formidable = require('formidable');
// const fs = require('fs');
// const path = require('path');

const token = require('../auth/token');
const models = require('../models');
const db = require('../models');
const config = require('../config.json');

// const upload = path.join(process.cwd(), '/build/assets/img/');

async function getAllNews(req, res, next){
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

async function createNews(req, res, next){    
    let title = req.body.title;
    let text = req.body.text;

    let token_tmp = req.headers['authorization'];
    let userId = token.getUserIdByToken(token_tmp, config.secret_token);

    try {
        var news = await db.createNewNews(userId,title,text);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err
        });
        return;
    }

    await getAllNews(req, res, next);
}

async function deleteNews(req, res, next){
    let newsId = req.params.id;

    try {
        var news = await db.deleteNews(newsId);
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    await getAllNews(req, res, next);
}

async function patchNews(req, res, next){
    let newsId = req.params.id;

    let title = req.body.title;
    let text = req.body.text;

    try {
        var news = await db.updateNews(newsId,text,title);
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    await getAllNews(req, res, next);
}


module.exports = {
    getAllNews,
    createNews,
    deleteNews,
    patchNews
}
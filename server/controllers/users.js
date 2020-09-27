const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const token = require('../auth/token');
const db = require('../models');
const config = require('../config.json');

const upload = path.join(process.cwd(), '/build/assets/img/');

const getProfile = async (req, res, next) => {
    let token_tmp = req.headers['authorization'];
    let userId = token.getUserIdByToken(token_tmp, config.secret_token);
    try {
        var userObj = await db.getUserObjById(userId);
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    res.json(userObj);
}

const patchProfile = async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = upload;

    let token_tmp = req.headers['authorization'];
    let userId = token.getUserIdByToken(token_tmp, config.secret_token);

    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
                return;
            }
            let userUpdateObj = {};

            if (fields.newPassword != '' && fields.oldPassword == '') {
                res.status(400).json({
                    message: 'Для изменения пароля введите старый пароль'
                });
                return;
            }

            if(files.avatar){
                if (files.avatar.name != '' && files.avatar.size != 0) {
                    let fileName = path.join(upload, files.avatar.name);
                    fs.renameSync(files.avatar.path, fileName);
                    let fileArrPath = path.join('/assets/img/', files.avatar.name);
    
                    userUpdateObj.avatar = fileArrPath;
                } else {
                    fs.unlinkSync(files.avatar.path);
                }
            }
            
            userUpdateObj.firstName = fields.firstName;
            userUpdateObj.middleName = fields.middleName;
            userUpdateObj.surName = fields.surName;
            userUpdateObj.oldPassword = fields.oldPassword;
            userUpdateObj.newPassword = fields.newPassword;
            
            try{
                var user = await db.updateUserData(userId,userUpdateObj);
            }catch(err){
                return res.status(400).json({
                    message: err
                });
            }
            res.json(user);
        });
    } catch (err) {
        return res.status(400).json({
            message: err
        });
    }

}

const getUsers = async (req, res, next) => {
    try {
        var users = await db.getAllUsersObj();
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    res.json(users);
}

const delUser = async (req, res, next)=>{
    let userId = req.params.id;
    try {
        await db.deleteUser(userId)
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    await getUsers(req, res, next);
}

const patchPermissionUser = async (req, res, next)=>{
    let userId = req.params.id;
    let permis = req.body;

    try {
        var user = await db.updateUserPermission(userId,permis);
    } catch (err) {
        res.status(400).json({
            err
        });
        return;
    }

    res.json(user);
}

module.exports = {
    getProfile,
    patchProfile,
    getUsers,
    delUser,
    patchPermissionUser
}
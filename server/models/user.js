const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    image: {
        type: String
    },
    middleName: {
        type: String
    },
    permission: {
        chat: {
            C: Boolean,
            R: Boolean,
            U: Boolean,
            D: Boolean
        },
        news: {
            C: Boolean,
            R: Boolean,
            U: Boolean,
            D: Boolean
        },
        settings: {
            C: Boolean,
            R: Boolean,
            U: Boolean,
            D: Boolean
        }
    },
    surName: {
        type: String
    },
    username: {
        type: String,
        required: [true, 'username required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password required'],
    }
});

userSchema.methods.setPassword = function (pass){
    this.password = bCrypt.hashSync(pass, bCrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword = function(pass){
    return bCrypt.compareSync(pass, this.password);
}

const User = mongoose.model('user',userSchema);

module.exports = User;
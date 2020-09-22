const { use } = require('passport');
const passport = require('passport');

module.exports = {
    login(req,res,next){
        passport.authenticate('local', {session:false},(err, user, info)=>{
            if(err){
                next(err);
            }
            if(user){
                res.json({
                    firstName: user.firstName,
                    id: user._id,
                    image: user.image,
                    middleName: user.middleName,
                    permission: user.permission,
                    surName: user.surName,
                    username: user.username
                })
            }else{
                res.status(400).json({message:"Неверный логин или пароль"});
            }
        })(req,res,next);
    }
}
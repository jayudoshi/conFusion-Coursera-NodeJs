var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jsonWebToken  = require('jsonwebtoken')

var {SECRET_KEY} = require('./config')

var Users = require('./models/users');

module.exports.localPassport = passport.use(new localStrategy(Users.authenticate()));

module.exports.getToken = (user) => jsonWebToken.sign(user,SECRET_KEY,{expiresIn:3600})

const opts = {};
opts.secretOrKey = SECRET_KEY;
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();

module.exports.jwtPassport = passport.use( new jwtStrategy( opts , (jwt_payload,done) => {

    Users.findOne({_id : jwt_payload._id} , (err,user) => {
        if(err){
            done(err,false);
        }else if(!user){
            done(null,false);
        }else if(user){
            done(null,user);
        }
    })
}))

module.exports.verifyUser = passport.authenticate('jwt',{session:false});

module.exports.verifyAdmin = (req,res,next) => {
    if(req.user.admin){
        return next()
    }else{
        let err = new Error("You are not authenticated to perform operation")
        err.status = 403;
        return next(err);
    }
}
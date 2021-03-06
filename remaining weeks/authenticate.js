var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jsonWebToken  = require('jsonwebtoken')
var facebookStrategy = require('passport-facebook-token');

var {SECRET_KEY , FBClientId , FBClientSecret} = require('./config')

var Users = require('./models/users');

module.exports.localPassport = passport.use(new localStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
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

module.exports.facebookPassport = passport.use(new facebookStrategy({
    clientID: FBClientId,
    clientSecret: FBClientSecret
} , (accessToken , refreshToken , profile , done) => {
    Users.findOne({oAuthId : profile.id} , (err,user) => {
        if(err){
            done(err,false)
        }else if(user){
            done(null,user)
        }else if(!user){
            Users.create({
                oAuthId: profile.id,
                username: profile.displayName,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            } , (err , user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    })
}))
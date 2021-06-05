var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var Users = require('./models/users');

passport.use(new localStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

module.exports = passport;
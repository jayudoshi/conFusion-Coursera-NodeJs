var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');
var {getToken, verifyUser , verifyAdmin} = require('../authenticate');
const cors = require('./cors');

/* GET users listing. */
router.get('/', cors.corsWithOption , verifyUser , verifyAdmin ,function(req, res, next) {
  Users.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(users)
  }, err => next(err))
  .catch(err => console.log(err));
});

router.post('/signup' , cors.corsWithOption , (req,res,next) => {

  Users.register({username:req.body.username} , req.body.password , (err , user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err : err})
    }else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  })
  // Users.findOne({username : req.body.username})
  // .then((user) => {
  //   console.log(user)
  //   if(user == null){
  //     Users.create({
  //       username: req.body.username,
  //       password: req.body.password
  //     })
  //     .then((user) => {
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type','application/json');
  //       req.session.user = "authenticated";
  //       res.send({ status: "User successfully Registered !!" ,user:user});
  //     } , err => next(err))
  //   }else{
  //     let err = new Error('Username: ' + req.body.username + ' already exists');
  //     err.status = 403;
  //     next(err)
  //   }
  // } , err => next(err))
  // .catch(err => next(err))
})

router.options('/login' ,cors.cors , (req,res,next) => {res.sendStatus(200)})

router.post('/login' , cors.corsWithOption , (req,res,next) => {

  passport.authenticate('local',{session:false} , (err , user , info) => {
    console.log("Enter CB");
    if(err){
      console.log("Err");
      return next(err)
    }
    else if(!user){
      console.log("User NF");
      res.statusCode = 401;
      res.setHeader('Content-Type','application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    else if(user){
      console.log("User F");
      req.logIn(user , (err) => {
        if(err){
          console.log("Err: " + err);
          res.statusCode = 401;
          res.setHeader('Content-Type','application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});
        }else{
          console.log("Returning TK");
          let token = getToken({_id : req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({success: true, status: 'Login Successful!', token: token});
        }
      })
    }
  })(req,res,next);
  // if(!req.session.user){
  //   if(!req.headers.authorization){
  //     let err = new Error('Unauthorized User!!');
  //     err.status = 401;
  //     res.setHeader('WWW-Authenticate','Basic');
  //     return next(err);
  //   }else{
  //     const auth = Buffer.from(req.headers.authorization.split(' ')[1] , 'base64').toString().split(':');
  //     const username = auth[0];
  //     const password = auth[1];
  //     Users.findOne({username : username})
  //     .then((user) => {
  //       if(user){
  //         if(user.password != password ){
  //           let err = new Error('Invalid Password!!');
  //           err.status = 401;
  //           next(err);  
  //         }else if(user.password == password && user.username == username){
  //           res.statusCode = 200;
  //           res.setHeader('Content-Type','text/plain');
  //           req.session.user = "authenticated";
  //           res.end("Your are authenticated")
  //         }
  //       }else{
  //         let err = new Error('Invalid Username!!');
  //         err.status = 401;
  //         next(err);
  //       }
  //     } , err => next(err))
  //     .catch(err => next(err))
  //   }
  // }else{
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type','text/plain');
  //   res.end("You are already authenticated !!");
  // }
})

router.get('/logout', cors.corsWithOption , (req,res,next) => {
  if(req.user){
    req.session.destroy();
    res.clearCookie("session_id");
    res.redirect('/')
  }else{
    let err = new Error("Your are not logged in!!");
    err.status = 403;
    return next(err);
  }
})

router.get('/facebook/token' , passport.authenticate('facebook-token' , {session:false}) , (req,res,next) => {
  const token = getToken({_id : req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token ,status: 'You are successfully logged in!'});
})

router.get('/checkJWTToken' , (req,res,next) => {
  passport.authenticate('jwt' , (err , user , info) => {
    if(err){
      return next(err);
    }
    else if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','application/json');
      res.json({success: false , status: 'JWT invalid!' , err : info})
    }
    else if(user){
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({success: true , status: "JWT valid!", user: user});
    }
  })(req,res,next);
})

module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup' , (req,res,next) => {

  Users.register({username:req.body.username} , req.body.password , (err , user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err : err})
    }else{
      console.log(user)
      passport.authenticate('local')(req,res,() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      })
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

router.post('/login' , passport.authenticate('local') , (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
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

router.get('/logout' , (req,res,next) => {
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

module.exports = router;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var {MongoDB_URL} = require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var uploadRouter = require('./routes/uploadRouter');
var favouritesRouter = require('./routes/favourites');
var commentRouter = require('./routes/comments');

const mongoose = require('mongoose');
const commentsRouter = require('./routes/comments');
const url = MongoDB_URL

mongoose.connect(url , { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true , useFindAndModify: true})
.then(()=>{
  console.log("Connected to Database");
},
(err) => {
  throw err;
})
.catch(err => console.log(err));

var app = express();

app.all('*' , (req,res,next) => {
  if(req.secure){
    next();
  }else{
    res.redirect(307 ,"https://" + req.hostname + ":" + app.get('securedPort') + req.url);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// app.use((req,res,next) => {
//   console.log("User: " + JSON.stringify(req.user));
//   if(req.user){
//     next();
//   }else{
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   if(!req.session.user){
//     let err = new Error('Unauthorized Uers');
//     err.status = 401;
//     next(err);
//   }
//   else{
//     if(req.session.user == "authenticated"){
//       next();
//     }else{
//       let err = new Error('Unauthorized User');
//       err.status = 401;
//       next(err);
//     }
//   }    
// })


app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favourites',favouritesRouter);
app.use('/comments',commentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

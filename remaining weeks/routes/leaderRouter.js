const express = require('express');
const bodyParser = require('body-parser');
var {verifyUser,verifyAdmin} = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();

const Leaders = require('../models/leaders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get( cors.cors , (req,res,next) => {
    Leaders.find(req.query)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    } , err => next(err))
    .catch(err => console.log(err));
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Leaders.create(req.body)
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    } , err=> next(err))
    .catch(err => console.log(err));
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    } , err=> next(err))
    .catch(err => console.log(err));
});

leaderRouter.route('/:leadersId')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get( cors.cors , (req,res,next) => {
    Leaders.findById(req.params.leadersId)
    .then((leader) => {
        if(leader){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader)
        }else{
            let err = new Error('Leader ' + req.params.leadersId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leadersId, { $set : req.body} , {new : true})
    .then((leader) => {
        if(leader){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader)
        }else{
            let err = new Error('Leader ' + req.params.leadersId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Leaders.findByIdAndDelete(req.params.leadersId)
    .then((leader) => {
        if(leader){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader)
        }else{
            let err = new Error('Leader ' + req.params.leadersId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
});

module.exports = leaderRouter;
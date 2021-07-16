const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const {verifyUser, verifyAdmin} = require('../authenticate');

const cors = require('./cors');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')

.options(cors.cors , (req,res,next) => {
    res.sendStatus(200);
})

.get( cors.cors , (req,res,next)=>{
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
        // res.json({msg: 'This is CORS-enabled for an allowed domain.'})
    },err => next(err))
    .catch(err => console.log(err));
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) =>{
    Dishes.create(req.body)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => console.log(err));
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next)=>{
    Dishes.remove({})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => console.log(err));
});

dishRouter.route('/:dishId')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get( cors.cors , (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => console.log(err));
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    console.log(req.body)
    Dishes.findByIdAndUpdate(req.params.dishId,{ $set : req.body},{new:true})
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish)
    } , err => next(err))
    .catch(err => console.log(err))
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => console.log(err));
});

module.exports = dishRouter;
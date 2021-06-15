const express = require('express');
const bodyParser = require('body-parser');
var {verifyUser,verifyAdmin} = require('../authenticate');
const promoRouter = express.Router();
const cors = require('./cors');

const Promotions = require('../models/promtions');

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get( cors.cors , (req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    }, err => next(err))
    .catch(err => console.log(err));
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    } , err => next(err))
    .catch(err => console.log(err));
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    } , err => next(err))
    .catch(err => console.log(err));
});

promoRouter.route('/:promosId')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200);
})

.get(cors.cors , (req,res,next) => {
    Promotions.findById(req.params.promosId)
    .then((promo) => {
        if(promo){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }else{
            let err = new Error('Promotion: ' + req.params.promosId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err))
})

.post( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promosId, {$set : req.body} , {new : true})
    .then((promo) => {
        if(promo){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }else{
            let err = new Error('Promotion: ' + req.params.promosId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Promotions.findByIdAndDelete(req.params.promosId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => console.log(err));
});

module.exports = promoRouter;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comments = require('../models/comments');
const {verifyUser, verifyAdmin} = require('../authenticate');
const cors = require('./cors');

const commentsRouter = express.Router();

commentsRouter.route('/')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get( cors.cors , (req,res,next) => {
    Comments.find(req.query)
    .populate('author')
    .then((comments) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(comments);
    }, err => next(err))
    .catch(err => console.log(err))
})

.post( cors.corsWithOption , verifyUser ,(req,res,next) => {
    if(!req.body){
        err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
    }
    req.body.author = req.user._id;
    Comments.create(req.body)
    .then(comment => {
        Comments.findById(comment._id)
        .populate('author')
        .then(comment => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(comment);
        }, err => next(err));
    } , err => next(err))
    .catch(err => console.log(err));
})

.put( cors.corsWithOption , verifyUser ,(req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete( cors.corsWithOption , verifyUser , verifyAdmin ,(req,res,next) => {
    Comments.remove({})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    } , err => next(err))
    .catch(err => next(err));
});


commentsRouter.route('/:commentId')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200); 
})

.get(cors.cors , (req,res,next) => {
    Comments.findById(req.params.commentId)
    .populate('author')
    .then(comment => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(comment)
    } , err => next(err))
    .catch(err => next(err));
})

.post( cors.corsWithOption , verifyUser ,(req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put( cors.corsWithOption , verifyUser ,(req,res,next) => {
    Comments.findById(req.params.dishId)
    .then(comment => {
        if(!comment){
            if(!comment.author.equals(req.user._id)){
                var err = new Error('You are not authorized to update this comment!');
                err.status = 403;
                return next(err);
            }else{
                req.body.author = req.user._id;
                Comments.findByIdAndUpdate(req.params.commentId , {$set: req.body} , {new: true})
                .then(comment => {
                    Comments.findById(comment._id)
                    .populate('author')
                    .then((comment) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(comment); 
                    }, err => next(err))
                })
            }
        }else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => next(err));
})

.delete( cors.corsWithOption , verifyUser ,(req,res,next) => {
    Comments.findById(req.params.commentId)
    .then(comment => {
        if(comment){
            if(!comment.author.equals(req.user._id)){
                var err = new Error('You are not authorized to delete this comment!');
                err.status = 403;
                return next(err);
            }else{
                Comment.findByIdAndDelete(req.params.commentId)
                .then(resp => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(resp);
                } , err => next(err))
                .catch(err => next(err));
            }
        }else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    })
    Comments.findByIdAndDelete(req.params.commentId)
    .then(c)
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            if(dish.comments.id(req.params.commentId)){
                if(req.user._id.toString() == dish.comments.id(req.params.commentId).author.toString()){
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(dish);
                        })
                    } , err => next(err))
                }else{
                    let err = new Error('User is not authenticated to perform this operation');
                    err.status = 403;
                    next(err);
                }
            }else{
                let err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
});

module.exports = commentsRouter;
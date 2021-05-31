const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes')

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')

.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },err => next(err))
    .catch(err => console.log(err));
})

.post((req,res,next) =>{
    Dishes.create(req.body)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => console.log(err));
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete((req,res,next)=>{
    Dishes.remove({})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => console.log(err));
});

dishRouter.route('/:dishId')

.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => console.log(err));
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put((req,res,next) => {
    console.log(req.body)
    Dishes.findByIdAndUpdate(req.params.dishId,{ $set : req.body},{new:true})
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish)
    } , err => next(err))
    .catch(err => console.log(err))
})

.delete((req,res,next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => console.log(err));
});

dishRouter.route('/:dishId/comments')

.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }else{
            let err = new Error('Dish ' + req.params.dishId + 'does not exists');
            err.status = 404;
            return next(err);
        }
    }, err => next(err))
    .catch(err => console.log(err))
})

.post((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            dish.comments.push(req.body)
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish)
            }, err => next(err))
        }else{
            let err = new Error('Dish ' + req.params.dishId + 'does not exists');
            err.status = 404;
            return next(err);
        }   
    }, err => next(err))
    .catch(err => console.log(err))
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            for(var i=0 ; i < (dish.comments.length) ; ){
                dish.comments.id(dish.comments[0]._id).remove();
            }
            // for (var i = (dish.comments.length -1); i >= 0; i--) {
            //     dish.comments.id(dish.comments[i]._id).remove();
            // }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            } , err => next(err));
        }else{
            let err = new Error('Dish ' + req.params.dishId + 'does not exists');
            err.status = 200;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
});

dishRouter.route('/:dishId/comments/:commentId')

.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            if(dish.comments.id(req.params.commentId)){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish.comments.id(req.params.commentId)); 
            }else{
                let err = new Error('Comment ' + req.params.commentId + " not found");
                err.status = 404;
                return next(err);
            }
        }else{
            let err = new Error('Dish ' + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            if(dish.comments.id(req.params.commentId)){
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                } , err => next(err))
            }else{
                let err = new Error('Comment ' + req.params.commentId + " not found");
                err.status = 404;
                return next(err);    
            }
        }else{
            let err = new Error('Dish ' + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        }
    } , err => next(err))
    .catch(err => console.log(err))
})

.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish){
            if(dish.comments.id(req.params.commentId)){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                } , err => next(err))
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

module.exports = dishRouter;
const express = require('express');
const {verifyUser} = require('../authenticate');
const Favourites = require('../models/favourites');
const Dishes = require('../models/dishes');
const cors = require('./cors')

const favouritesRouter = express.Router();

favouritesRouter.route('/')

.options( cors.cors , (req,res,next) => {res.sendStatus(200)})

.get( cors.cors , verifyUser , (req,res,next) => {
    Favourites.findOne({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then(favourites => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favourites)
    } , (err) => next(err))
    .catch(err => console.log(err));
})

.post( cors.corsWithOption , verifyUser , (req,res,next) => {
    Favourites.findOne({user: req.user._id} , (err , favourites) => {
        if(err){
            return next(err);
        }else if(!favourites){
            favourites = new Favourites({
                user: req.user._id,
                dishes: req.body.dishes
            })
        }else if(favourites){
            for(let i = 0 ; i < req.body.dishes.length ; i++){
                if(favourites.dishes.indexOf(req.body.dishes[i]) === -1){
                    favourites.dishes.push(req.body.dishes[i])
                }
            }
        }
        favourites.save()
        .then(favourites => {
            Favourites.findById(favourites._id)
            .populate('user')
            .populate('dishes')
            .then(favourites => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favourites)
            } , (err) => next(err))
            .catch(err => console.log(err));
        } , err => next(err))
        .catch(err => console.log(err));
    })
})

.put( cors.corsWithOption , verifyUser , (req,res,next) => {
    res.statusCode = 403;
    res.send("Actoin is Forbidden");
})

.delete( cors.corsWithOption , verifyUser , (req,res,next) => {
    Favourites.deleteOne({user: req.user._id} , (err,resp) => {
        if(err){
            return next(err)
        }else if(!resp){
            let err = new Error("Document Not Found")
            err.status = 404;
            return next(err);
        }else if(resp){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp)
        }
    })
});

favouritesRouter.route('/:dishId')

.options( cors.cors , (req,res,next) => {res.sendStatus(200)})

.get( cors.cors , verifyUser , (req,res,next) => {
    Favourites.findOne({user: req.user._id} , (err , favourites) => {
        if(err){
            return next(err);
        }else if(!favourites){
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            return res.json({"exists": false, "favorites": favorites});
        }else if(favourites){
            if(favourites.dishes.indexOf(req.params.dishId)  != -1){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists": false, "favorites": favorites});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
        }
    })
})

.post( cors.corsWithOption , verifyUser , (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(!dish){
            let err = new Error("Dish Not Found !!");
            err.status = 404;
            return next(err);
        }else{
            Favourites.findOne({user: req.user._id} , (err , favourites) => {
                if(err){
                    return next(err);
                }else if(!favourites){
                    favourites = new Favourites({
                        user: req.user._id,
                    })
                    favourites.dishes.push(req.params.dishId)
                }else if(favourites){
                    if(favourites.dishes.indexOf(req.params.dishId) === -1){
                        favourites.dishes.push(req.body.dishes[i])
                    }
                }
                favourites.save()
                .then(favourites => {
                    Favourites.findById(favourites._id)
                    .populate('user')
                    .populate('dishes')
                    .then(favourites => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favourites)
                    } , (err) => next(err))
                    .catch(err => console.log(err));
                } , (err) => next(err))
                .catch(err => console.log(err));
            })
        }
    } , err => next(err))
    .catch(err => console.log(err));
})

.delete( cors.corsWithOption , verifyUser , (req,res,next) => {
    Favourites.findOne({user: req.user._id} , (err , favourites) => {
        if(err){
            return next(err);
        }else if(!favourites){
            let err = new Error("Favourites List Not Found !!");
            err.status = 404;
            return next(err)
        }else if(favourites){
            const index = favourites.dishes.indexOf(req.params.dishId)
            if(index !== -1){
                favourites.dishes.splice(index,1)
            }
        }
        favourites.save()
        .then(favourites => {
            Favourites.findById(favourites._id)
            .populate('user')
            .populate('dishes')
            .then(favourites => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favourites)
            } , (err) => next(err))
            .catch(err => console.log(err));
        } , (err) => next(err))
        .catch(err => console.log(err));
    })
})

module.exports = favouritesRouter;
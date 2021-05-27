const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')

.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next)=>{
    res.end("Sending details of all dishes");
})

.post((req,res,next) =>{
    res.end("Adding details of dishes\nName: " + req.body.name + "\nDescription: " + req.body.description)
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete((req,res,next)=>{
    res.end("Deleting All Dishes");
})

dishRouter.route('/:dishId')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("Sending details of dish: " + req.params.dishId);
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put((req,res,next) => {
    res.end("Updated Dish: " + req.params.dishId + "\nName: " + req.body.name + "\nDescription: " + req.body.description);
})

.delete((req,res,next) => {
    res.end("Deleting dish: " + req.params.dishId);
});

module.exports = dishRouter;
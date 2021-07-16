const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("Sending all details of all promtions");
})

.post((req,res,next) => {
    res.end("Adding details of promotion:\n Name:" + req.body.name + "\nDescription:" + req.body.description);
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete((req,res,next) => {
    res.end("Deleting all promotions");
});

promoRouter.route('/:promosId')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("Sending details of promotion: " + req.params.promosId);
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put((req,res,next) => {
    res.end("Updated Promotion: " + req.params.promosId + "\nName: " + req.body.name + "\nDescription: " + req.body.description);
})

.delete((req,res,next) => {
    res.end("Deleting promotion: " + req.params.promosId);
});

module.exports = promoRouter;
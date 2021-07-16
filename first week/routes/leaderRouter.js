const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("Sending all details of all leaders");
})

.post((req,res,next) => {
    res.end("Adding details of leaders:\n Name:" + req.body.name + "\nDescription:" + req.body.description);
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete((req,res,next) => {
    res.end("Deleting all leaders");
});

leaderRouter.route('/:leadersId')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res,next) => {
    res.end("Sending details of leader: " + req.params.leadersId);
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST request is not serviced");
})

.put((req,res,next) => {
    res.end("Updated Leader: " + req.params.leadersId + "\nName: " + req.body.name + "\nDescription: " + req.body.description);
})

.delete((req,res,next) => {
    res.end("Deleting leader: " + req.params.leadersId);
});

module.exports = leaderRouter;
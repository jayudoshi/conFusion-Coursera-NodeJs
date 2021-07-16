const express = require('express');
const bodyParser = require('body-parser');
const {verifyUser , verifyAdmin} = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null , 'public/images'),
    filename: (req,file,cb) => cb(null,file.originalname)
})

const filterFile = (req,file,cb) => {
    if(file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        cb(null , true)
    }else{
        cb(new Error("Invalid File Type !!"),false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filterFile
})

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')

.options(cors.cors , (req,res,next) => { 
    res.sendStatus(200);
})

.get( cors.cors , (req,res,next) => {
    res.statusCode = 403;
    res.end("GET request is not serviced");
})

.post( cors.corsWithOption , verifyUser , verifyAdmin , upload.single('uploadImage') , (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})

.put( cors.corsWithOption ,verifyUser , verifyAdmin , (req,res,next) => {
    res.statusCode = 403;
    res.end("PUT request is not serviced");
})

.delete( cors.corsWithOption ,verifyUser , verifyUser , (req,res,next) => {
    res.statusCode = 403;
    res.end("DELETE request is not serviced");
})

module.exports = uploadRouter
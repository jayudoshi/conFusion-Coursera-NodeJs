const express = require('express');
const http = require('http');
const morgan = require('morgan');

const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

const hostName = "localhost";
const port = 3000;

const app = express();

app.use(morgan('dev'))

app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);

app.use(express.static(__dirname + "/public"))

app.use((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html')
    res.send("<html><body><h1>This is an express server !!</h1></body></html>")
})

const server = http.createServer(app);

server.listen(port,hostName,()=>{
    console.log(`Server is running at http://${hostName}:${port}`);
})
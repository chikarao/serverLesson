// main staring point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');


const app = express();
//creates instance of express, app
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
mongoose.connect('mongodb://localhost/auth');
// mongoose.connect('mongodb://localhost/auth', {
//   useMongoClient: true
// });

// mongoose.Promise = global.Promise;
// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(passport.initialize());
app.use(passport.session()); // works without don't need?
//https://github.com/jaredhanson/passport
// morgan and bodyParser are middleware in express
// any incoming request will be passed to margan and bodyParser
// morgan is a logging framework; mostly for debugging
// bodyParser for parsing incomee request that is json
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
// http is native node library
// creates http server that knows how to receive requrest
//anything that comes in forward it to app

server.listen(port);
console.log('Server listening on:', port);

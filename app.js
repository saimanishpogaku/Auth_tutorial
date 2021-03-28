const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
require('dotenv').config();
require('./config/init_mongodb');

const AuthRoute = require('./Routes/Auth.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/',(req,res,next) => {
    res.send('<h1 style="text-align:center">This is the first root path</h1>');
});

app.use('/auth',AuthRoute);

app.use(async (req,res,next) => {
    /**
     * let error = new Error('Not Found');
       error.status = 404;
       next(error);
     */
    // next(createError.NotFound())//Result same as above result
    next(createError.NotFound('This Route is not Found'));
});

app.use(async (err,req,res,next) => {
    res.status(err.status || 500).json({
        error:{
            status: err.status,
            message: err.message
        }
    })
});

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
})
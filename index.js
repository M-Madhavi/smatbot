const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
var multer = require('multer');
var upload = multer();

require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

mongoose.Promise = global.Promise;

app.set('view-engine','ejs');


//permissions
app.use((req,res,next)=>{
    req.header("Access-Control-Allow-Origin",'*')
    req.header("Access-Control-Allow-Origin","Origin,Content-Type,Accept,Authentication");//header will contain all this.
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Origin','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
const contactRoute = require('./routes/Contact');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


app.use('/contacts',contactRoute);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});


app.use((req,res,next)=>{
    const error = new Error("not found");
    res.status(400);
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
        }
    })
})
module.exports = app;

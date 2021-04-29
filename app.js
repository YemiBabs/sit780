var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');



var indexRouter = require('./routes/index');
var donateRouter = require('./routes/donation');
var successRouter = require('./routes/success');
var canceledRouter = require('./routes/canceled');
var sendemailRouter = require('./routes/email');
//var usersRouter = require('./routes/users');

//api-exposed
var facts = require('covid-facts');
var allFacts = facts.all;
var randomFact = facts.random();

var app = express();
app.use(express.static('public'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/index.html', indexRouter);
app.use('/donation.html', donateRouter);
app.use('/success.html', successRouter);
app.use('/canceled.html', canceledRouter);
app.use('/email.html', sendemailRouter);

//app.use('/users', usersRouter);

//api-exposed
app.get('/Covid_All_facts_API', (req,res) => {
  res.send(allFacts);
});

app.get('/covid19_random_fact_api', (req,res) => {
  res.send(randomFact);
});

// SMTP for email



 


var transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "covid19.restoration@gmail.com",
    pass: "Covid12345"
  }
});

app.get('/',function(req,res){
  res.sendfile('email.html');
})

app.get('/send',function(req,res){
  var mailOptions= {
    //from: 'covid19.restoration@gmail.com',
    to : req.query.to,
    subject : req.query.subject,
    text: req.query.textmessage
  }
  //console.log(mailOptions);
  
  transporter.sendMail(mailOptions)
    .then(function(response) {
      console.log('Email Sent !!!!');
  })
  .catch(function(error) {
      console.log('Error!!_!!');
  });
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

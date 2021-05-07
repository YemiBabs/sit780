var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');

var app = express();
app.use(express.static('public'));



const expressSession = require('express-session')({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession); 

/* Passport setup */ 
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


/* Mongoose setup */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


//mongoose.connect('mongodb://localhost/MyDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://dbuser:dbuser123@cluster0.rktte.mongodb.net/SIT780Database?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const UserDetail = new Schema( {
   username: String,
   password: String
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');




/* PASSPORT Local Authentication */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());






/* non secure page routing begins */

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
//var searchRouter = require('./routes/search');
var donateRouter = require('./routes/donation');
var successRouter = require('./routes/success');
var canceledRouter = require('./routes/canceled');
var sendemailRouter = require('./routes/email');
//var usersRouter = require('./routes/users');

//api-exposed
var facts = require('covid-facts');
var allFacts = facts.all;
var randomFact = facts.random();



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
app.use('/login.html', loginRouter);
app.use('/donation.html', donateRouter);
app.use('/success.html', successRouter);
app.use('/canceled.html', canceledRouter);
app.use('/email.html', sendemailRouter);

//app.use('/users', usersRouter);



/* Secure routing begins */
var connectEnsureLogin = require('connect-ensure-login');
  
  
  
/* user login - POST action  */

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
         return res.redirect('login.html?info=' + info);
      }

      req.login(user, function(err) {
         if (err) {
           console.log(err);
           return next(err);
    }
        return res.redirect('/sindex');
  });

  }) (req, res, next);
});



/* get pages   

app.get('/login',
  (req, res) => res.sendFile('/login.html', { root: __dirname})
  );
*/

  app.get('/sindex', 
       connectEnsureLogin.ensureLoggedIn(), 
       (req, res) => res.sendFile('/views/secureIndex.html', { root: __dirname})
      
  ); 

  app.get('/logout',function(req, res){
      req.logOut();
      res.redirect('/');
  });



 /* route for secure search should be here  */


  app.get('/search',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('views/search.html', { root: __dirname})
  );  


  app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send( { user: req.user })
  );  


/* secure route ends */




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
  res.sendFile('email.html');
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

/* Register some users 
UserDetails.register({username: 'paul', active: false}, 'paul');
UserDetails.register({username: 'tester', active: false}, 'tester');
UserDetails.register({username: 'Dan', active: false}, 'Dan');
*/


module.exports = app;

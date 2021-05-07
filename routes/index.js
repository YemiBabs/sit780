var express = require('express');
var router = express.Router();

/* Added support for app and passport 
const app = express();

app.use(express.static(__dirname));

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(expressSession); 
 */

/* Passport setup  
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
*/

/* Mongoose setup 
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongdb://localhost/MyDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const UserDetail = new Schema( {
   username: String,
   password: String
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

*/


/* PASSPORT Local Authentication 

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());
*/



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
}); 

/* Routes 
const connectEnsureLogin = require('connect-ensure-login');
*/


/* user login - POST action 

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
         return res.redirect('login?info=' + info);
      }

      req.login(user, function(err) {
         if (err) {
           return next(err);
    }

      return res.redirect('/');
  });

  }) (req, res, next);
});

*/

/* get pages 

app.get('/login',
  (req, res) => res.sendFile('/login.html', { root: __dirname})
  );

  app.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('/index.html', { root: __dirname})
  );  


*/

 /* route for secure search should be here 


  app.get('/search',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.sendFile('/search.html', { root: __dirname})
  );  


  app.get('/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send( { user: req.user })
  );  


*/

module.exports = router;

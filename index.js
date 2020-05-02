const express = require('express');
const app = express();
const homepageroutes = require('./controller/homepageroutes.js');
const signuppageroutes = require('./controller/signuppageroutes.js');
const loginpageroutes = require('./controller/loginpageroutes.js');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//Passport Configuration

require('./controller/passport.js')(passport);

//set up view engine

app.set('view engine', 'ejs');

//static files

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));

//Express Session

app.use(session({
	  secret: 'secret',
	  resave: true,
	  saveUninitialized: true
	}));

//Express Messages

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

//Connect flash

app.use(flash());

//Global Variables

app.use((req,res,next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//fire homepageroutes

homepageroutes(app);

//fire signuppageroutes

signuppageroutes(app);

//fire signuppageroutes

loginpageroutes(app);

//listen to port

app.listen( process.env.PORT || 3000, () => {
	console.log('You are listening to Port 3000');
});
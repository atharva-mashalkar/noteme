const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const express = require('express');
const passport = require('passport');

//Passport Configuration
require('./passport.js')(passport);

module.exports = (app) => {
app.use('/car/:id',express.static('./public'));

//Opening home page

app.get('/', (req,res) => {
	res.render('home');
});


//Open signup page

app.get('/signup', (req,res) => {
	res.render('signup');
});

//Open login page

app.get('/login', (req,res) => {
	res.render('login');
});

//Get logout and open home page

app.get('/logout',(req,res) =>{
	req.logout();
	req.flash('success_msg', 'You are now logged out from your account.');
	res.redirect('/');
});

//Post login data and get authenticated

app.post('/login',(req, res, next) => {

	passport.authenticate('local',{
		successRedirect: '/user/:' + req.body.Email,
		failureRedirect: '/login',
		failureFlash: true 
	})(req, res, next);
	
});

//open contact page

app.get('/contact', (req,res) => {
	res.render('contact');
});


}
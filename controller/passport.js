const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Load Signup Model
var Signup = require('../views/signuppages/signupschema.js');

module.exports = function(passport){
	passport.use(
		new LocalStrategy({ usernameField: 'Email',  passwordField: 'Password'}, (Email, Password, done) =>{

			//Match User
			Signup.findOne({Email:Email})
				.then(user => {
					if(!user){
						return done(null, false, {message : "Email is not registered"});
					}
					//If user is not verified using his mail 
					if(user.IsVerified === 'false'){
						Signup.deleteOne({Email : Email},(err,res) => {
						if(err) throw err;
						console.log('Email was unverified and hence was deleted');
						});
						return done(null, false, {message : "Email was not verified. Please Signup again"});
					}
					//Match Password
					bcrypt.compare(Password, user.Password, (err, isMatch) => {
						if(err) throw err;

						if(isMatch){
							return done(null, user);
						}else{
							return done(null, false, {message:'Password incorrect'});
						}
					});				
				})
				.catch(err => console.log(err));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		Signup.findById(id, (err, user) => {
			done(err, user);
		});
	});
}
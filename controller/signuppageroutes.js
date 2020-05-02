const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const NoteMeSignup = require('../views/signuppages/signupschema.js');



mongoose.connect("mongodb+srv://Atharva:Vandana@carsofficial-yewfn.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true });
mongoose.set('useFindAndModify',false);


var urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = (app) => {

	//New user gets signed up

	app.post('/signup', (req,res) => {
		const { FirstName ,LastName ,Email ,Password ,Password2 } = req.body;
		let errors = [];

		//Check required fields
		if(!FirstName || !LastName || !Email || !Password || !Password2){
			errors.push({msg: 'Please fill in all the fields'});
		}

		//Check if passwords match 
		if(Password2 !== Password){
			errors.push({msg: 'Passwords do not match'});
		}

		//Check pass length 
		if(Password.length < 6){
			errors.push({msg:'Password should be atleast 6 characters'});
		}

		if(errors.length > 0){
			res.render('signup',{errors,FirstName ,LastName ,Email ,Password ,Password2});
		}
		else{
			NoteMeSignup.findOne({Email:Email}).then(user => {

			if(user){
				errors.push({msg:'User is already registered'});
				res.render('signup',{errors,FirstName ,LastName ,Email ,Password ,Password2});

			}
			else{
				const newNoteMeSignup = new NoteMeSignup({FirstName ,LastName , Email , Password });

				//Hash Password
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newNoteMeSignup.Password, salt, (err,hash) =>{
						if(err) throw err;

						//Set Password to hashed
						newNoteMeSignup.Password = hash;

						//Save User
						newNoteMeSignup.save().then(user => {
							req.flash('success_msg', 'You are now registered and can now log in');
							res.redirect('/login');
						}).catch(err => console.log(err));

					}));
						
					
			}
			
			});
		}

	});		
	
}
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const NoteMeSignup = require('../views/signuppages/signupschema.js');
const NotesContent = require('../views/signuppages/noteschema.js');
const crypto = require('crypto');
const { ensureAuthenticated } = require('./auth.js');

const conn = mongoose.createConnection("mongodb+srv://Atharva:Vandana@carsofficial-yewfn.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});


mongoose.set('useFindAndModify',false);



module.exports = (app) => {

	app.use('/user/:Email',express.static('./public'));
	app.use('/createnote/:Email',express.static('./public'));
	app.use('/updatenote/:id',express.static('./public'));
	app.use('/deletenote/:id',express.static('./public'));
	app.use('/note/:id',express.static('./public'));
	app.use('/usersearch/:name',express.static('./public'));


	//get user account details

	app.get('/user/:Email',ensureAuthenticated, (req,res) => {
			let Category = 'All'
			NoteMeSignup.findOne({Email : req.params.Email.slice(1)},(err , data) => {
    			if(err) throw err
    			NotesContent.find({Email : req.params.Email.slice(1)},(err,notes) => {
    			res.render('./loginpages/userpage', {user: data, notes : notes , Category : Category});
    			});
			});	
	});

	//Opens create note page

	app.get('/createnote/:Email',ensureAuthenticated, (req,res) => {
		NoteMeSignup.findOne({Email : req.params.Email.slice(1)},function(err,data){
    	if(err) throw err;
    	res.render('./loginpages/userpages/createnotepage', {user: data});
	});
	});

	//Create note

	app.post('/createnote',(req,res) => {
		const { Title ,	Category , Content , Email } = req.body;
		const today = new Date();
		const CurrentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		const newNotesContent = new NotesContent({Title , Category , Content , CurrentDate , Email});
		//Save User
		newNotesContent.save().then(user => {
			req.flash('success_msg', 'New Note Added');
			console.log(`${req.body.Title} created`);
			res.redirect('/user/:' + req.body.Email);
		}).catch(err => console.log(err));
	});

	
	//Opens update note page

	app.get('/updatenote/:id', ensureAuthenticated,(req,res) => {
		NotesContent.findOne({_id : req.params.id.slice(1)},(err,note) => {	
			res.render('./loginpages/userpages/updatenotepage',{note : note });	
		});
	});


	//Updates note

	app.post('/updatenote',(req,res) => {
		NotesContent.updateOne({_id : req.body.NoteId},req.body,(err,car) => {
			if(err) throw err;
			console.log(`${req.body.Title} updated `);
			req.flash('primary',`${req.body.Title} is updated`);
			res.redirect('/user/:'+ req.body.Email);
		});	
	});

	//Delete Note

	app.get('/deletenote/:id', ensureAuthenticated , (req,res) => {
		NotesContent.findOne({_id : req.params.id.slice(1)},(err, note) => {	
			NotesContent.deleteOne({_id : req.params.id.slice(1)},req.body,(err,res1) => {
				if(err) throw err;
				console.log('Note Deleted');
				res.redirect('/user/:'+ note.Email);
				});	
		});
	});	

	//Give a detail information of the selected note

	app.get('/note/:id', (req,res) => {
		NotesContent.findOne({_id : req.params.id.slice(1)},(err,note) => {
				res.render('notepage',{note : note});		
			});
	});

	//Search Routes

	app.post('/usersearch' ,(req,res) => {
		NoteMeSignup.findOne({Email:req.body.Email},(err,data) => {
    		if(err) throw err;
    		let Category = req.body.Category;
    		if(req.body.Category === 'All'){
    			NotesContent.find({ Email : req.body.Email},(err,notes) => {
	    			if(err) throw err;
	    			res.render('./loginpages/userpage', {user: data, notes : notes, Category : Category});
    			});
    		}else{
    			NotesContent.find({Category : req.body.Category , Email : req.body.Email},(err,notes) => {
	    			if(err) throw err;
	    			res.render('./loginpages/userpage', {user: data, notes : notes , Category :Category});
    			});
    		}
    	});	
	});

}
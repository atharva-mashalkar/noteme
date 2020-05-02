const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var signupSchema = new Schema({
	FirstName : String,
	LastName : String,
	Email : String,
	Password : String,
});

var NoteMeSignup = mongoose.model('NoteMeSignup', signupSchema); 

module.exports = NoteMeSignup;
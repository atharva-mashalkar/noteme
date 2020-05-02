const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contentSchema = new Schema({
	Title : String,
	Category : String,
	Content : String,
	CurrentDate : String,
	Email : String,
});



var NotesContent = mongoose.model('NotesContent', contentSchema); 

module.exports = NotesContent;

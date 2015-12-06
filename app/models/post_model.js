//var mongoose = require('mongoose');
var user = require('../models/user_model');
var fs = require('fs');
//var Schema = mongoose.Schema;
var ObjectId = user.Schema.ObjectId;

//mongoose.createConnection('mongodb://localhost/kitty');

//var Schema = mongoose.Schema;
var ObjectId = user.Schema.ObjectId;

var postSchema = new user.Schema({
	id: ObjectId,
	username: {type: String, required: true},
	title: {type: String, required: true},
	description: {type: String, required: false},
	address: {type: String, required: true},
	contact: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	photo: {data: Buffer, contentType: String, required: false},
});

var testSchema = new user.Schema({
	test: {type: Number}
});

var PostModel = mongoose.model('Post', postSchema);
var testModel = mongoose.model('Test', testSchema);
exports.newPost = function(creator, title, description, address, contact, startDate, endDate, inputPhoto, callback){
	if(inputPhoto != null){
		img = {
			data: fs.readFileSync(inputPhoto.path),
			contentType: inputPhoto.type
		}
	}
	post = new PostModel({
		username: creator,
		title: title,
		description: description,
		address: address,
		contact: contact,
		startDate: startDate,
		endDate: endDate,
		photo: img
	});
	post.save(function(err, poster){
		callback(err, poster);
	});
}

// exports.test = function(callback){
// 	tester = new testModel({test: 3});
// 	tester.save(function(err, testttt){
// 		callback(err, testttt);
// 	});
// }
exports.findPost = function(id, callback){
	PostModel.findById(id, function(err, post){
		callback(err, post);
	});
}

exports.deletePost = function(id, callback){
	PostModel.findByIdAndRemove(id, function(err, post){
		callback(err, post);
	});
}

exports.deleteAllPosts = function(callback){
	PostModel.remove({}, function(err, data){
		callback(err, data);
	});
}
exports.allPosts = function(callback){
	PostModel.find(function(err, posts){
		callback(err, posts);
	});
}

exports.getPostByUser = function(username, callback){
	PostModel.find({username: username}, function(err, posts){
		callback(err, posts);
	});
}

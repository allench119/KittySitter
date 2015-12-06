var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/kitty');

var commentSchema = new Schema({
	commenter: {type: String},
	text: {type: String}
});

var userSchema = new Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}, 
	about: {type: String, required: false, default: null},
	comment: {type: [commentSchema]},
	rating: {type: [Number]},
	salt: {type: Number}
});

var UserModel = mongoose.model('User', userSchema);
var CommentModel = mongoose.model('Comment', commentSchema);

// var testSchema = new Schema({
// 	test: {type: Number}
// });

// var testModel = mongoose.model('Test', testSchema);

// exports.test = function(callback){
// 	tester = new testModel({test: 3});
// 	tester.save(function(err, testttt){
// 		callback(err, testttt);
// 	});
// }

exports.addUser = function(username, password, email, callback){
	user = new UserModel({
		username: username,
		password: password,
		email: email,
		about: null,
		comment: null,
		rating: null,
		salt: 0
	});
	user.save(function(err, user){
		callback(err, user);
	});
};

exports.updateSalt = function(username, salt, callback){
	UserModel.findOneAndUpdate(
		{username: username},
		{$set: {salt: salt}},
		{new: true}, function(err, doc){
			callback(err, doc);
	});
}

exports.findUser = function(username, callback){
	query = UserModel.where({username: username});
	query.findOne(function(err, data){
		callback(err, data);
	});
}

exports.findAllUsers = function(callback){
	UserModel.find(function(err, data){
		callback(err, data);
	});
}

exports.deleteUser = function(username, callback){
	query = UserModel.where({username: username});
	query.findOneAndRemove(function(err, data){
		callback(err, data);
	});
}
exports.addComment = function(target, commenter, comment, cb){
	query = UserModel.where({username: target});
	newcomment = new CommentModel({
		commenter: commenter,
		text: comment
	});
	UserModel.findOneAndUpdate(
		query,
		{$push: {comment: newcomment}},
		function(err, data) {
			cb(err, data);
		});
}

exports.newRating = function(username, newrating, callback){
	query = UserModel.where({username: username});
	UserModel.findOneAndUpdate(
		query,
		{$push: {rating: newrating}},
		function(err, data){
			callback(err, data);
		});
}

exports.removeAll = function(callback){
	UserModel.remove({}, function(err, data){
		callback(err, data);
	});
}
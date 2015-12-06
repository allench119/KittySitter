var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user_db = require('../models/user_model');
var post_db = require('../models/post_model');
var auth = require('../helper/auth')
var app = express();

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', function (req, res){
	username = req.body.username;
	password = req.body.password;
	if(username == undefined) {res.render('login'); return;}
	user_db.loginUser(username, password, function(err, status){
		if(err){
			res.send({status: false, error:"Unkown!"});
		}
		else if(status){
			salt = auth.makeSalt();
			user_db.updateSalt(username, salt, function(err, data){
				if(err){
					res.send({status: false, error:"Unkown!"});
				}
				else if(data){
					res.send({status: true, salt: salt, username: username});					
				}
			});
		}
		else if(!status){
			res.send({status: false, error: "Please check your credentials!"});
		}
	});
});

app.post('/signup', function (req, res) {
	username = req.body.username;
	password = req.body.password;
	email = req.body.email;
	user_db.addUser(username, password, email, function(status){
		if(status.name == "ValidationError"){
			res.send({status: false, error: "username is taken"});
		}
		else if(!status){
			salt = auth.makeSalt();
			user_db.updateSalt(username, salt, function(err, data){
				if(err){
					res.send({status: false, error:"Unkown!"});
				}
				else if(data){
					res.send({status: true, salt: salt, username: username});
				}
			});
		}
		else if(status){
			res.send({status: false, error: "Unkown error!"});
		}
	});
});

app.post('/newPost', function(req, res){
	username = req.cookie.username;
	salt = req.cookie.salt;
	title = req.body.title;
	address = req.body.address;
	description = req.body.description;
	contact = req.body.contact;
	startDate = req.body.startDate;
	endDate = req.body.endDate;
	photo = req.body.photo;
	user_db.verifySalt(username, salt, function(err, data){
		if(err || !data){
			res.send({status: false, error: "Please login again!"});
		}
		else if(data){
			post_db.newPost(username, title, address, description, contact, startDate, endDate, photo, function(status){
				if(!status){
					res.send({status: true});
				}
				else if(status){
					res.send({status: false});
				}
			});
		}
		else{
			res.send({status: false, error: "Please login again!"});
		}
	});
});

app.post('/newComment', function(req, res){
	commenter = req.cookie.username;
	salt = req.cookie.salt;
	target = req.body.username;
	text = req.body.text;
	user_db.verifySalt(commenter, salt, function(err, data){
		if(err || !data){
			res.send({status: false, error: "Please login again!"});
		}
		else if(data){
			user.db.addComment(target, commenter, text, function(status){
				if(!status){
					res.send({status: true});
				}
				else{
					res.send({status: false});
				}
			});
		}
	});
});	

app.post('/newRating', function(req, res){
	rating = req.body.rating;
	target = req.body.username;
	user.db.newRating(target, rating, function(status){
		if(!status){
			res.send({status: true});
		}
		else{
			res.send({status: false});
		}
	});
});

app.get('/getAllPosts', function(req, res){
	post_db.allPosts(function(err, posts){
		console.log(1238724387649873264892734);
		if(err){
			res.send({status: false});
		}
		else{
			res.send({status: true, posts: posts});
		}
	});
});

// app.get('/getAllUsers', function(req, res){
// 	res.send({status: true});
// });

app.get('/getUserByUsername', function(req, res){
	username = req.body.username;
	user_db.findUser(username, function(err, user){
		if(err){
			res.send({status: false});
		}
		else if(user){
			res.send({status: true, user: user});
		}
		else if(!user){
			res.send({status: false, error: "The user does not exist"});
		}
	});
});

app.get('/getPostById', function(req, res){
	id = req.body.id;
	post_db.findPost(id, function(err, post){
		if(err){
			res.send({status: false});
		}
		else if(post){
			res.send({status:true, post: post});
		}
		else if(!post){
			res.send({status:false, error: "The post does not exist"});
		}
	});
});

app.post('/avgRating', function(req, res){
	user = req.body.username;
	user_db.avgRating(user, function(err, data){
		if(err){
			res.send({status: false, error: err});
		}
		else if(data){
			res.send({status: true, avg: data});
		}
		else{
			res.send({status: false, error: "Unkown error"});
		}
	});
});

app.post('/getUserPosts', function(req, res){
	user = req.body.username;
	post_db.getPostByUser(user, function(err, posts){
		if(err){
			res.send({status: false, error: err})
		}
		else{
			res.send({status: true, posts: posts});
		}
	})
});

module.exports = app;
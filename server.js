var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var request = require('request');
var moment = require('moment');

app = express();
app.use(bodyParser.json());
var server = require('http').Server(app);

server.listen(8000);
    
app.use(express.static(__dirname + '/app'));

/* Soure requires */
require('./controllers/posts.js');
var config = require('./config');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hotbutton');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mongodb");
});

var UserSchema = new mongoose.Schema({
    displayName: String,
    email: {type: String, unique: true, lowercase: true},
    picture: String,
    google: String,
    posts: mongoose.Schema.Types.Mixed
});
var User = mongoose.model('User', UserSchema);

/* Google Login code *****************************************/

/*
   |--------------------------------------------------------------------------
   | Login Required Middleware - It is not clear to me what this actually does!
   |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    console.log('ensuring authentication')
    if (!req.headers.authorization) {
	return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
	payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
	return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
	return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
   |--------------------------------------------------------------------------
   | Generate JSON Web Token
   |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
	sub: user._id,
	iat: moment().unix(),
	exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
   |--------------------------------------------------------------------------
   | Login with Google - Satellizer redirects here
   |--------------------------------------------------------------------------
 */
app.post('/auth/google', function(req, res) {
    console.log('hit auth/google');
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
	code: req.body.code,
	client_id: req.body.clientId,
	client_secret: config.GOOGLE_SECRET,
	redirect_uri: req.body.redirectUri,
	grant_type: 'authorization_code'
    };
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
	var accessToken = token.access_token;
	var headers = { Authorization: 'Bearer ' + accessToken };

	// Step 2. Retrieve profile information about the current user.
	request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
	    if (profile.error) {
		return res.status(500).send({message: profile.error.message});
	    }
	    // Step 3a. Link user accounts.
	    if (req.headers.authorization) {
		User.findOne({ google: profile.sub }, function(err, existingUser) {
		    if (existingUser) {
			return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
		    }
		    var token = req.headers.authorization.split(' ')[1];
		    var payload = jwt.decode(token, config.TOKEN_SECRET);
		    User.findById(payload.sub, function(err, user) {
			if (!user) {
			    return res.status(400).send({ message: 'User not found' });
			}
			user.google = profile.sub;
			user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
			user.displayName = user.displayName || profile.name;
			user.save(function() {
			    var token = createJWT(user);
			    res.send({ token: token });
			});
		    });
		});
	    } else {
		// Step 3b. Create a new user account or return an existing one.
		    User.findOne({ google: profile.sub }, function(err, existingUser) {
			if (existingUser) {
			    return res.send({ token: createJWT(existingUser) });
			}
			var user = new User();
			user.google = profile.sub;
			user.picture = profile.picture.replace('sz=50', 'sz=200');
			user.displayName = profile.name;
			user.save(function(err) {
			    var token = createJWT(user);
			    res.send({ token: token });
			});
		    });
	    }
	});
    });
});
/************************************************************/

/* API ******************************************************/


app.post('/get_user', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user){
	res.send(user);
    });
});

app.post('/get_posts', ensureAuthenticated, function(req, res){
    User.findById(req.user, function(err, user){
	res.send(user.posts);
    });
});

app.post('/save_posts', ensureAuthenticated, function(req, res){
    User.findById(req.user, function(err, user){	
	user.posts = req.body.posts;
	user.markModified('posts');
	user.save();
	console.log(user);
	res.send(true);
    });
    
});

app.post('/get_candidates', ensureAuthenticated, function(req, res){
    res.send(full_candidates);
});

app.post('/get_issues', ensureAuthenticated, function(req, res){
});

var full_candidates = {
    'Hillary Clinton':{
	name:'Hillary Clinton',
	image:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Secretary_Clinton_8x10_2400_1.jpg/800px-Secretary_Clinton_8x10_2400_1.jpg'
    },         
    'Bernie Sanders':{
	name:'Bernie Sanders',
	image:'https://upload.wikimedia.org/wikipedia/commons/d/de/Bernie_Sanders.jpg'
    },                                  
    'Jeb Bush':{
	name:'Jeb Bush',
	image:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Jeb_Bush_at_Southern_Republican_Leadership_Conference_May_2015_by_Vadon_02.jpg/800px-Jeb_Bush_at_Southern_Republican_Leadership_Conference_May_2015_by_Vadon_02.jpg'
    },
    'Donald Trump':{
	name:'Donald Trump',
	image:'https://upload.wikimedia.org/wikipedia/commons/b/b3/Donald_August_19_%28cropped%29.jpg'
    },
    'Ted Cruz':{
	name:'Ted Cruz',
	image:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ted_Cruz%2C_official_portrait%2C_113th_Congress.jpg/1280px-Ted_Cruz%2C_official_portrait%2C_113th_Congress.jpg'
    }
};                                  
/* 


















































   var BoardSchema = new mongoose.Schema({
   posts: [mongoose.Schema.Types.ObjectId]
   });
   var Board = mongoose.model('Board', BoardSchema);

   var SourceSchema = new mongoose.Schema({
   link: [mongoose.Schema.Types.ObjectId]
   });
   var Source = mongoose.model('Source', SourceSchema);

   var CandidateSchema = new mongoose.Schema({
   name: String,
   picture: String,
   updated: Date
   });
   var Candidate = mongoose.model('Candidate', CandidateSchema); */


/* Fake user for testing db read writes *******************/
/* var fake_post = new Post({
   post_id:"1",
   candidate:"Hillary Clinton",
   issue:"Foreign Policy",
   score:-5,
   parent: null,
   text: "Hillary really screwed up in Benghazi just like she would screw up the rest of the country"
   });
   fake_post.save();

   var fake_board = new Board({posts: [fake_post._id]});
   fake_board.save();

   var fake_user = new User({
   user_id:"007",
   name:"Ronaldo",
   email:"ronaldo@yahoo.com",
   board:fake_board._id
   });
   fake_user.save(function(err, fake_user){
   if(err) return console.error(err);
   console.dir(fake_user);
   }); */
/************************************************************/

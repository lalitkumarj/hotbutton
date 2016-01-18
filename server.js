var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');

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
    user_id: String,
    name: String,
    email: String,
    board: mongoose.Schema.Types.ObjectId
    google: String
});
var User = mongoose.model('User', UserSchema);



var PostSchema = new mongoose.Schema({
    post_id: String,
    name: String,
    candidate: String,
    issue: String,
    score: String,
    parent: String,
    text: String,
});
var Post = mongoose.model('Post', PostSchema);


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
var Candidate = mongoose.model('Candidate', CandidateSchema);

var fake_post = new Post({
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
});

/*
   |--------------------------------------------------------------------------
   | Login Required Middleware
   |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
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
   | Login with Google
   |--------------------------------------------------------------------------
 */
app.post('/auth/google', function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    /* Requires code, clientId and redirectUri 
       These are the params sent to google
     */
    var params = {
	code: req.body.code,
	client_id: req.body.clientId,
	client_secret: config.GOOGLE_SECRET,
	redirect_uri: req.body.redirectUri,
	grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token. The response of this gets a token from google.
    // We send these params off to the server
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
	var accessToken = token.access_token;
	var headers = { Authorization: 'Bearer ' + accessToken };

	// Step 2. Retrieve profile information about the current user.
	request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
	    if (profile.error) {
		//Error message to parse on the server presumably
		return res.status(500).send({message: profile.error.message});
	    }
	    
	    // Step 3a. Link user accounts. Question, do I really need this? I want Google only login.
	    if (req.headers.authorization) {
		//profile.sub is the string we store for a user
		User.findOne({ google: profile.sub }, function(err, existingUser) {
		    if (existingUser) {
			return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
		    }
		    // Need to look into jwt token style. 
		    //Really pull it out of req? I don't understand why
		    var token = req.headers.authorization.split(' ')[1];
		    var payload = jwt.decode(token, config.TOKEN_SECRET);
		    //Why are we getting the user again?
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


/*
   Controllers Below
*/
app.post('/auth/signup', function(req, res){
});


app.post('/get_user_board', function(req, res){
    var user_id = req.body.user_id;
    console.log(req.body);
    User.find({user_id: user_id}, function(err, users){
	console.log(err, users)
	var user = users[0];
	console.log("found users", err, user);
    })
});

app.post('/save_user_board', function(req, res){
    var user = req.user;
    res.send();
});


app.get('/get_candidates', function(req, res){
    res.send();
});

app.get('/get_issues', function(req, res){
    res.send();
});


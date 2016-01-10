var express = require('express');
app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8000);
    
app.use(express.static(__dirname + '/app'));
require('./controllers/posts.js');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hotbutton');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mongodb");
});


var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    state: String,
    board: mongoose.Schema.Types.ObjectId
});
var User = mongoose.model('User', UserSchema);

var FactoidSchema = new mongoose.Schema({
    name: String,
    email: String,
    candidate: String,
    issue: String,
    score: String,
    parent: String,
    text: String,
    sources: [mongoose.Schema.Types.ObjectId],
    updated: Date
});
var Factoid = mongoose.model('Factoid', FactoidSchema);


var BoardSchema = new mongoose.Schema({
    posts: [mongoose.Schema.Types.ObjectId],
    updated: Date
});
var Board = mongoose.model('Board', BoardSchema);


var SourceSchema = new mongoose.Schema({
    link: [mongoose.Schema.Types.ObjectId],
    updated: Date
});
var Source = mongoose.model('Source', SourceSchema);


var CandidateSchema = new mongoose.Schema({
    name: String,
    picture: String
    updated: Date
});
var Source = mongoose.model('Candidate', SourceSchema);



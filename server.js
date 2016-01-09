var express = require('express');
app = express();
app.use(express.static(__dirname + '/app'));
require('./controllers/posts.js');

var io = require('socket.io')(app);

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hotbutton');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.listen(8000, function() {
    console.log('Listening on port 8000...');
});


var UserSchema = new mongoose.Schema({
    name: String;
    email: String;
    state: String;
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
    sources: [ObjectId]
});
var Factoid = mongoose.model('Factoid', FactoidSchema);


var BoardSchema = new mongoose.Schema({

});

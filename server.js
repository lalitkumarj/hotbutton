var express = require('express');
app = express();
app.use(express.static(__dirname + '/app'));
require('./controllers/posts.js');

app.listen(8000, function() {
    console.log('Listening on port 8000...');
});



var express = require("express");

var app = express();

var resource1 = {
	msg: 'Hello'
}

//Express method with Etag. No trailer added
app.get('/r1', function(req, res) {
	res.send(resource1).end();
});

//Trailer setup header declared, but Etag send in header (injected by Express), not in trailer
app.get('/r2', function(req, res) {
	res.set('Trailer', 'ETag')
	   .send(resource1)
	   .end();
});


app.enable('etag');
app.set('etag', 'strong') // same
//app.set('etag', 'weak') // weak etags

var port = process.env.PORT || 5000;


app.listen(port);

console.log("App running at port: " + port);
console.log("Resource at /r1 and /r2");

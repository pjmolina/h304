var express = require("express");

var app = express();

var resource1 = {
	msg: 'Hello'
}

function logRequest(req) {
	console.log('Request: ' + req.method + ' ' + req.originalUrl);
	console.log(req.headers);
	console.log('');
	console.log(req.body);
	console.log('-----');
}

//Reference deployments
//heroku:   http://h304.herokuapp.com/r1
//bluemix:  http://h304.mybluemix.net/r1

//Express method with Etag. No trailer added
app.get('/r1', function(req, res) {
	logRequest(req);
	res.send(resource1).end();
});

//Trailer setup header declared, but Etag send in header (injected by Express), not in trailer
//Will cause a 502 error on Bluemix Router when receiving a server 304 after this call:
//
//   curl -i localhost:5000/r2 -H "If-None-Match: \"f-Ulj/1cfc5QSkTxln+OAWXg"\"
//
app.get('/r2', function(req, res) {
	logRequest(req);
	res.set('Trailer', 'ETag')
	   .send(resource1)
	   .end();
});

//Variant 3. Addding Transfer-Encoding: chunked to try to satisfy bluemix router
app.get('/r3', function(req, res) {
	logRequest(req);
	res.set('Trailer', 'ETag')
	   .set('Transfer-Encoding', 'chunked')
	   .send(resource1)
	   .end();
});



app.enable('etag');
app.set('etag', 'strong') // same
//app.set('etag', 'weak') // weak etags

var port = process.env.PORT || 5000;


app.listen(port);

console.log("App running at port: " + port);
console.log("Resource at /r1 /r2 and /r3");

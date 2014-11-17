var snapchat = require("./snapchat")
var Q = require('q')
,  fs = require('fs')
,  snapchat = require("./snapchat")
,  util = require('util')
, request = require('request')
, caption = require('caption');

var client = new snapchat.Client();
var username = "";
var password = "";
var recipients = [];

var main = function() {
	client.login(username, password)
	.then(function(data) {
		if (typeof data.snaps === 'undefined') {
			console.log(data);
			return;
		}
		data.snaps.forEach(function(snap) {
				if (typeof snap.sn !== 'undefined' && typeof snap.t !== 'undefined' && snap.st == 1) {
					recipients.push(snap.sn);
				if (recipients === []) {
					return;
				}
			}
		});
	})
	.then( function() {
		var blob = fs.createReadStream("doge.jpg");
			return client.upload(blob, 0);
		}, function(err) {
			console.error("Can't login, no doghouse, much sad.");
			console.error(err)
		})
		.then(function(mediaId) {
			return Q.allSettled(recipients.map(function(recipient) {
					return client.send(mediaId, recipient, 10).catch(function(err) {
						console.error("No send, much sad: ", recipient);
						console.error(err);
					});
			}));
		}, function(error) {
			console.error("Failure to upload, much sad. Woof.");
			console.error(error);
		})
		.then(function(statuses) {
			client.clear( function() {
				console.log("Much clear, so clean.");
				recipients = [];
			});
			console.log("Much sent. Many snaps.");
		}, function(err) {
			console.error("Oh no, error. Much sad.")
			console.error(err);
		});
}

setInterval(function(){
	console.log("Digging for snaps, woof woof.");
	main();
}, 120000);

var generateImage = function() { 
	request.get("http://www.cryptocoincharts.info/v2/api/tradingPair/doge_btc", function (err, res, data) {
	if (data != {}) {
	var body = JSON.parse(data);
	var text = body.price + " DOGE/BTC";
	caption.path("doge-base.jpg", {caption: text, outputFile: "doge.jpg"}, function (err, filename) {
	  console.log("Much data, very new.");
	});
	}
	});
}

setInterval(function(){
	console.log("Digging for data, woof woof.");
	generateImage();
}, 110000);


// Add schedule, creates image with new price every 5 minutes
// Add schedule, checks for new snaps every 2 minutes, and replies with generated image

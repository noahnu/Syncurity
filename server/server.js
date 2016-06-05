"use strict";

var fs = require('fs');
var xml = require('xmlhttprequest');

var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
	api_key: 'ef0989879d553b8cf5a33a7ce8ff7644c8c41084',
	version_date: '2016-05-20',
	version: 'v3'
});

var express = require('express');
var httpServer = express();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var twillioClient = require('twilio')('ACa462478122613b84e388c569b2183b09', '05bcde14b90c0fc55c83265e2832457e');

var PORT = 3000;

var core = {
	init: () => {		
		console.log("Syncur.io starting...");
		
		core.http.initRoutes();
		httpServer.listen(PORT, core.http.listening);
		
		core.classify('matt2.jpg');
	},
	
	/* Messages to send to user. */
	messages: [],
	
	http: {
		listening: () => {
			console.log("Now listening on port: " + PORT);
		},
		
		initRoutes: () => {
			
			/* Test to see if server is working. */
			httpServer.get('/test', (req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				res.header('Access-Control-Allow-Headers', 'Content-Type');

				res.setHeader('Content-type', 'application/json');
				res.send(JSON.stringify({ message: "Alive and well!" }));
				
				next();
			});
			
			/* Camera sends image via /image route. */
			httpServer.post('/image', upload.single('frame'), (req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				res.header('Access-Control-Allow-Headers', 'Content-Type');
				
				//req.body?
				
				/*var timeCaptured = req.body.time;
				var deviceLocation = req.body.location;*/
				
				// queue the file if currently waiting for watson
				core.classify(req.file.path, () => {
					// Friend
				}, () => {
					// Foe
					core.messages.push("An intruder has been detected!");
					core.sms.send("An intruder has been detected!");
				}, () => {
					// Error (errors are not our friends)
				});
				
				next();
			});
			
			/* User (front-end) polls for intruder alerts. */
			httpServer.get('/status', (req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				res.header('Access-Control-Allow-Headers', 'Content-Type');
				
				// Flush alerts queue (containing messages).
				var msgs = [];
				
				while (core.messages.length > 0) {
					msgs.push(core.messages.pop());
				}
				
				res.setHeader('Content-type', 'application/json');
				res.send(JSON.stringify({ time: (new Date()).getTime(), message: msgs }));
				
				next();
			});
			
		}
	},
	
	classify: (filePath, onFriend, onFoe, onError) => {
		if (core.recog.isPonderingLife) {
			core.recog.queue.push([filePath, onFriend, onFoe, onError]);
			return;
		}
		
		core.recog.isPonderingLife = true;
		
		visual_recognition.classify({
			images_file: fs.createReadStream(filePath),
			classifier_ids: ['default', 'id1_1175529260', 'id2_1728253810']
		}, function(err, res){
			if (err) {
				console.log('Failed to communicate with API: ');
				console.log(err);
				
				core.recog.afterClassify(() => {lazy.call(onError, err)});
			} else if (res.images && res.images.length > 0) {
				//console.log(JSON.stringify(res, null, 2));
				var classifiers = res.images[0].classifiers || [];
				if (classifiers.length > 0) {
					if (core.recog.search(classifiers, 'default', 'person') > 0.5) {
						var score;
						if ((score = core.recog.search(classifiers, 'id-*', 'friend')) > 0.45) {
							console.log("A friendly person identified with score: "+score+".");
							core.recog.afterClassify(() => {lazy.call(onFriend, err)});
						} else {
							console.log("An unrecognized person identified!");
							
							if ((new Date).getTime() - core.recog.lastFoeTime < 120000) {
								console.log("Too close to last foe. Ignoring.");
								core.recog.afterClassify();
								return;
							}
							
							core.recog.lastFoeTime = (new Date()).getTime();
							
							if (core.recog.lastWasFoe) {
								console.log("Last was foe. Ignoring.");
								core.recog.afterClassify();
								return;
							}
							
							core.recog.lastWasFoe = true;
							
							core.recog.afterClassify(() => {lazy.call(onFoe, err)});
						}
						return;
					}
				}
			}
			
			/* Nothing detected in the image? */
			console.log("No threat detected.");
			core.recog.afterClassify();
		});
	},
	
	recog: {
		/*
			Stores a queue of classify params (waiting for Watson).
			For reference this is queue, not to be confused with "q".
		*/
		queue: [],
		
		/*
			If true, Watson is pondering the meaning of life and is
			not currently open to API requests. Please stand in the queue.
		*/
		isPonderingLife: false,
		
		/*
			Indicates whether last classify pointed out a foe. Prevents multiple
			foes from being sent one after the other.
		*/
		lastFoeTime: 0,
		lastWasFoe: false,
		
		/*
			Executes after classify, before callback. Regardless of callback.
		*/
		afterClassify: (callback) => {
			if (typeof callback === 'function') callback();
			
			if (core.recog.queue.length > 0) {
				setTimeout(() => {
					core.classify.apply(this, core.recog.queue.pop());
				}, 1);
			} else {
				core.recog.isPonderingLife = false;
			}
		},
		
		/* Return score of found class, classifier pair. */
		search: (classifiers, classifier, iclass) => {
			for(let i = 0; i < classifiers.length; i++){
				if (!core.recog.match(classifiers[i].name, classifier)) continue;
				for (let j = 0; j < classifiers[i].classes.length; j++) {
					if (!core.recog.match(classifiers[i].classes[j].class, iclass)) continue;
					return classifiers[i].classes[j].score;
				}
			}
		},
		
		/* Basic string matching with trailing wildcards. */
		match: (haystack, needle) => {
			return ((needle.endsWith('*') &&
					haystack.startsWith(needle.substring(0, needle.indexOf('*')))) ||
				haystack == needle);
		}
	},
	
	sms: {
		send: (message) => {
            twillioClient.sendMessage({
                to: '6476397540',
                from: '+12044003387',
                body: message
            }, (err, responseData) => {
                if (err) console.log(err);
            });
		}
	}
};

/* lazy.call(this, ...params) will call function iff defined. */
var lazy = (...params) => {
	if (typeof this === 'function') {
		this(params);
	}
};

core.init();

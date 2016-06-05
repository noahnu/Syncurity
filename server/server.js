"use strict";

var fs = require('fs');
var xml = require('xmlhttprequest');



var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
	api_key: '2ee99e97dc6199948ff0611bf9f03a52cdc90183',
	version_date: '2016-05-20',
	version: 'v3'
});

var core = {
	init: () => {		
		console.log("Syncur.io starting...");
		
		core.classify(fs.createReadStream('curtischong.jpg'));
	},
	
	classify: (stream, onFriend, onFoe, onError) => {
		visual_recognition.classify({
			images_file: stream
		}, function(err, res){
			if (err) {
				console.log('Failed to communicate with API: ');
				console.log(err);
				
				lazy.call(onError, err);
			} else if (res.images && res.images.length > 0) {
				var classifiers = res.images[0].classifiers || [];
				if (classifiers.length > 0) {
					if (core.recog.search(classifiers, 'default', 'person') > 0.5) {
						if (core.recog.search(classifiers, 'friend', 'id-*') > 0.5) {
							console.log("An friendly person identified.");
							lazy.call(onFriend);
						} else {
							console.log("An unrecognized person identified!");
							lazy.call(onFoe);
						}
						return;
					}
				}
			}
			
			/* Nothing detected in the image? */
			console.log("No threat detected.");
		});
	},
	
	recog: {
		/* Return score of found class, classifier pair. */
		search: (classifiers, classifier, iclass) => {
			for(let i = 0; i < classifiers.length; i++){
				if (classifiers[i].name != classifier) continue;
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
	}
};

/* lazy.call(this, ...params) will call function iff defined. */
var lazy = (...params) => {
	if (typeof this === 'function') {
		this(params);
	}
};

core.init();

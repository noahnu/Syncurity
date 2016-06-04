"use strict";

var mqtt = require('mqtt');
var fs = require('fs');
var xml = require('xmlhttprequest');

var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
	api_key: '2ee99e97dc6199948ff0611bf9f03a52cdc90183',
	version_date: '2016-05-20',
	version: 'v3'
});

var bluemix = {
	client: undefined,
	
	publish: {
		ping: "iot-2/evt/pingFrom/fmt/json"
	},
	
	subscribe: {
		ping: "iot-2/cmd/pingTo/fmt/json"
	},
	
	opts: {
		org: "ziwbp7",
		type: "computer",
		deviceId: "123456789",
		username: 'use-token-auth',
		password: "47@*BY8!CrMmM_3)2o",
		clientId: ""
	},
	
	getUrl: () => {
		return "mqtts://" + bluemix.opts.org + ".messaging.internetofthings.ibmcloud.com:8883";
	},
	
	events: {
		connected: () => {
			console.log("Connected to bluemix.");
			
			bluemix.client.subscribe(bluemix.subscribe.ping, () => {
				bluemix.client.on('message', (topic, message, packet) => {
					console.log("Received '" + message + "' on '" + topic + "'");
				});
			});
			
			core.classify(fs.createReadStream('curtischong.jpg'));
			
			//bluemix.client.publish(bluemix.publish.ping, JSON.stringify(msg));
		}	
	}
};

var core = {
	init: () => {
		bluemix.opts.clientId = "d:" + bluemix.opts.org + ":" + bluemix.opts.type + ":" + bluemix.opts.deviceId;
		
		console.log("Syncur.io starting...");
		
		bluemix.client = mqtt.connect(bluemix.getUrl(), {
			clientId: bluemix.opts.clientId,
			keepalive: 120,
			username: bluemix.opts.username,
			password: bluemix.opts.password
		});
		
		bluemix.client.on('connect', bluemix.events.connected);
	},
	
	classify: (stream) => {
		visual_recognition.classify({
			images_file: stream
		}, function(err, res){
			if (err) {
				console.log('Failed to communicate with API: ');
				console.log(err);
			} else {
				console.log(JSON.stringify(res, null, 2));
			}
		});
	}
};

core.init();

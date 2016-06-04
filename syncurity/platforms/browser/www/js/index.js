/*
	Syncurity Camera App
*/
"use strict";

var dom = {
	status: null,
	image: null
};

var core = {
	init: function() {
		core.bindDom();
		setTimeout(video.start(), 500);
	},
	
	bindDom: function() {
		dom.status = document.getElementById('status');
		dom.image = document.getElementById('preview');
	},
	
	status: function(msg) {
		dom.status.innerHTML = msg;
	},
	
	image: function(url) {
		dom.image.src = url;
	}
};

var video = {
	start: function() {
		core.status("Video starting...");
		
		navigator.device.capture.captureImage(video.captured, video.failed, { limit: 1 });
	},
	
	captured: function(media) {
		if (media.length > 0) {
			core.image(media[0].fullPath);
		}
	},
	
	failed: function(err) {
		console.log(err);
	}
};

document.addEventListener('deviceready', core.init, false);
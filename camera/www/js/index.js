/*
	Syncurity Camera App
*/
"use strict";

var dom = {
	$status: null,
	$image: null
};

var core = {
	init: function() {
		core.bindDom();
		
		video.scheduleNext();
	},
	
	bindDom: function() {
		dom.$status = $('#status');
		dom.$image = $('#preview');
	},
	
	status: function(msg) {
		dom.$status.html(msg);
	},
	
	image: function(url) {
		dom.$image.attr('src', url);
	}
};

var video = {
	tmr: undefined,
	doCapture: () => {
		window.plugins.CameraPictureBackground.takePicture((url) => {
			api.sendImage(url, () => {
				video.scheduleNext();
			});
		}, () => {
			console.log("Error with cam pic.");
			video.scheduleNext();
		}, {
			name: "Image",
			dirName: "CameraPictureBackground",
			orientation: "landscape",
			type: "back"
		});
	},
	scheduleNext: () => {
		clearTimeout(video.tmr);
		video.tmr = setTimeout(() => {
			video.doCapture();
		}, 7500);
	}
};

var api = {
	url: "http://192.168.4.144:3000",
	
	sendImage: function(u, next){
			core.image(u);
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
				var opts = new FileUploadOptions();
				opts.fileKey = 'frame';
				opts.fileName = fileSystem.root.fullPath + '/' + u;
				opts.mimeType = 'image/jpeg';
				
				opts.params = {
					time: (new Date()).getTime()
				};
				
				var ft = new FileTransfer();
				ft.upload(u, encodeURI(api.url + '/image'), (r) => {
					console.log("Response: " + r.responseCode);
					next();
				}, (ex) => {
					console.log("Error: " + ex.code);
					next();
				}, opts);
			});		
	}
};

document.addEventListener('deviceready', core.init, false);
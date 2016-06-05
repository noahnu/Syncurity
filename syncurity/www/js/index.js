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
		
		api.scheduleNext();
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

var api = {
	url: "http://192.168.4.144:3000",
	
	getMessages: function(){
		$.getJSON(api.url + '/status', {}, function(data){
			if(data && data.message && data.message.length > 0){
				core.status("Alert: " + data.message.join("\n\n"));
				if (data.message.join(' ').indexOf('intruder') > 0) {
					try {
						core.image(api.url + '/preview?time=' + (new Date()).getTime());
					} catch (e) {}
				}
			}
			
			api.scheduleNext();
		});
	},
	
	tmr: undefined,
	scheduleNext: () => {
		clearTimeout(api.tmr);
		api.tmr = setTimeout(() => {
			api.getMessages();
		}, 4000);
	}
};

document.addEventListener('deviceready', core.init, false);
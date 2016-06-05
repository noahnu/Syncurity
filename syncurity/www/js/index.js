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
		
		//
		$('#grantAcc').click(api.getMessages);
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
	url: "http://localhost:3000",
	
	getMessages: function(){
		$.getJSON(api.url + '/status', {}, function(data){
			if(data && data.messages && data.messages.length > 0){
				core.status(data.messages.join("\n\n"));
			}
		});
	}
};

document.addEventListener('deviceready', core.init, false);
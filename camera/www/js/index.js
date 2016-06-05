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
	
       /* var options = {
            name: "Image", //image suffix
            dirName: "CameraPictureBackground", //foldername
            orientation: "landscape", //or portrait
            type: "back" //or front
        };

        window.plugins.CameraPictureBackground.takePicture(success, function(){}, options);

        function success(imgurl) {
            console.log("Imgurl = " + imgurl);
        }*/
        
        
        $("#btn").on("click",function(){
           CaptureBCK(); 
        });
        
        function success(imgurl) {
          console.log("Imgurl = " + imgurl);
          //here I added my function to upload the saved pictures
          //on my internet server using file-tranfer plugin
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }

        function CaptureBCK() {
            var options = {
            name: "Image", //image suffix
            dirName: "CameraPictureBackground", //foldername
            orientation: "portrait", //or landscape
            type: "back" //or front
            };

            window.plugins.CameraPictureBackground.takePicture(success, onFail, options);
        }


            
        
        


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
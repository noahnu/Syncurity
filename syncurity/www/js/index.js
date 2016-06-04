/*
	Syncurity Camera App
*/
/*"use strict";

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

document.addEventListener('deviceready', core.init, false);*/
$(document).ready(function(){
    
    var currentAlarm;
    function hideBtns(){
      $("#confirm").hide();
        $("#cancel").hide();
    };
    function showBtns(){
        $("#confirm").show();
        $("#cancel").show(); 
    };
    
    $("#confirm").on("click",function(){

        hideBtns();
        if(currentAlarm == "grantAcc"){
            
        }else if(currentAlarm == "denyAcc"){
            
        }else{
            
        }
        
    });
    $("#cancel").on("click",function(){

        hideBtns();
    });
    
    $("#grantAcc").on("click",function(){
        showBtns();
        currentAlarm = "grantAcc";
    });
    $("#denyAcc").on("click",function(){
        showBtns();
        currentAlarm = "denyAcc";
    });
    $("#denyAlarm").on("click",function(){
        showBtns();
        currentAlarm = "denyAlarm";
    });
    
    
    function retrieveQuery(){
        var data = {};
            data.title = "title";
            data.message = "message";

            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://localhost:3000/',						
                success: function(data) {
                    console.log('success');
                    console.log(JSON.stringify(data));
                }
            });
    }
    //retrieveQuery();
});
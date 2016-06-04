var mqtt = require('mqtt');
var fs = require('fs');
var xml = require('xmlhttprequest');

var PUBLISH_TOPIC = "iot-2/evt/pingFrom/fmt/json";
var SUBSCRIBE_TOPIC = "iot-2/cmd/pingTo/fmt/json";

var mqttClient;

var org = "ziwbp7";
var type = "computer";
var deviceId = "123456789";
var username = 'use-token-auth';
var password = "47@*BY8!CrMmM_3)2o";

var path = '../curtischong.jpg';
//var testImage = base64_encode(path);
//console.log(testImage);

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}



var clientId = "d:" + org + ":" + type + ":" + deviceId;
console.log('MQTT clientId = ' + clientId);


console.log('Waiting for MQTT Connection...');
//mqttClient = mqtt.connect("mqtts://" + org + ".messaging.internetofthings.ibmcloud.com:8883",
mqttClient = mqtt.connect("mqtts://" + org + ".messaging.internetofthings.ibmcloud.com:8883",
{
   clientId : clientId,
   keepalive : 120,
   username : username,
   password : password
});

function readImage (fileName) {
	return fs.readFileSync(fileName);
}

mqttClient.on('connect', function()
{
   console.log('MQTT Connected.');

   mqttClient.subscribe(SUBSCRIBE_TOPIC, function()
   {
      mqttClient.on('message', onMessage);
   });

	var data = { payload: {image: ''} };
  	data.payload.image = ""+testImage;//readImage("../curtischong.jpg");
	console.log(data);

   mqttClient.publish(PUBLISH_TOPIC, JSON.stringify(data));
});


function onMessage(topic, message, packet)
{
   console.log("Received '" + message + "' on '" + topic + "'");
}


function pause()
{
   setTimeout(pause,5000);
}

pause();

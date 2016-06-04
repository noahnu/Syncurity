var mqtt = require('mqtt');
var fs = require('fs');

var PUBLISH_TOPIC = "iot-2/evt/pingFrom/fmt/json";
var SUBSCRIBE_TOPIC = "iot-2/cmd/pingTo/fmt/json";

var mqttClient;

var org = "ziwbp7";
var type = "computer";
var deviceId = "123456789"
var username = 'use-token-auth';
var password = "47@*BY8!CrMmM_3)2o"

var path = '../curtischong.jpg';
var testImage = base64_encode(path);


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

/*

fs.readFile(image_origial, function(err, original_data){
    fs.writeFile('image_orig.jpg', original_data, function(err) {});
    var base64Image = original_data.toString('base64');
    var decodedImage = new Buffer(base64Image, 'base64');
    fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
});
*/


mqttClient.on('connect', function()
{
   console.log('MQTT Connected.');

   mqttClient.subscribe(SUBSCRIBE_TOPIC, function()
   {
      mqttClient.on('message', onMessage);
   });

   var data={};
   data.message="Hello World!";
    data.photo = testImage;

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

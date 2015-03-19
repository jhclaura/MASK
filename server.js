
// SET_UP
// BASIC
var express = require('express');
var app = express();
//var util = require('util');

//
var SensorTag = require('sensortag');
//

var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 8000;


server.listen(port);

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});

console.log('Server started on port ' + port);

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Use WebSocket to send the data to html
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({'server': server});

var mySocket = undefined;

wss.on('connection', function(ws){

	ws.on('message', function(msg){
		var msg = JSON.parse(data);
		socketHandlers(ws,msg);
	});

	ws.on('close', function(){
		mySocket = undefined;
	});

	mySocket = ws;
});

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


/*
	sensorTag Accelerometer example
	
	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag.
	
	Although the sensortag library functions are all asynchronous, 
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to the tag
		3) read its services and characteristics
		4) turn on the sensor you want to use (in this case, accelerometer)
		5) turn on notifications for the sensor
		6) listen for changes from the sensortag
		
	This example does all of those steps in sequence by having each function
	call the next as a callback. Discover calls connect, which calls
	discoverServicesAndCharacteristics, and so forth.
	
	This example is heavily indebted to Sandeep's test for the library, but
	achieves more or less the same thing without using the async library.
	
	created 15 Jan 2014
	by Tom Igoe
*/


var SensorTag = require('sensortag');		// sensortag library
var accelRead = {};
var magRead = {};
var readPeriod = 20;						// period 1 - 2550 ms, default period is 2000 ms 

// listen for tags: 
SensorTag.discover(function(tag) {

	// console.log("!");

	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});
		
	function connectMe() {			// attempt to connect to the tag
		console.log('connect');
		tag.connect(discoverMe);		// when you connect, call discoverMe
		if(mySocket){
			mySocket.send('connect');
		}
	}

   function discoverMe() {			// attempt to discover services
     console.log('discoverServicesAndCharacteristics');
     // when you discover services, enable the accelerometer:
     tag.discoverServicesAndCharacteristics(enableAccelMe);
   }
   
   function enableAccelMe() {		// attempt to enable the accelerometer
     console.log('enableAccelerometer');
     // when you enable the accelerometer, start accelerometer notifications:
     tag.enableAccelerometer( setPeriodA(readPeriod) );
     tag.enableMagnetometer( setPeriodM(readPeriod) );
   }

   function enableMag() {		
     console.log('enableMag');
     tag.enableMagnetometer( setPeriodM(readPeriod) );
   }

   function setPeriodA(p) {
   		console.log('Set period: ' + p);
   		tag.setAccelerometerPeriod(p, notifyMeA);
   }

   function setPeriodM(p) {
   		console.log('Set period: ' + p);
   		tag.setMagnetometerPeriod(p, notifyMeM);
   }
   	
	function notifyMeA() {
   	tag.notifyAccelerometer(listenForAcc);   	// start the accelerometer listener 
		tag.notifySimpleKey(listenForButton);		// start the button listener
   }

	function notifyMeM() {
		tag.notifyMagnetometer(listenForMag);
	}
   
   // When you get an accelermeter change, print it out:
	function listenForAcc() {
		tag.on('accelerometerChange', function(x, y, z) {

		    // console.log('\tx = %d G', x.toFixed(1));
		    // console.log('\ty = %d G', y.toFixed(1));
		    // console.log('\tz = %d G', z.toFixed(1));

		    accelRead.x = x;
		    accelRead.y = y;
		    accelRead.z = z;
		    accelRead.l = 0;


		    if(mySocket){
				mySocket.send( JSON.stringify(accelRead) );
			}
	   });
	}

	var heading;
	// var maxMagX=-10000, minMagX=10000, maxMagY=-10000, minMagY=10000;
	// maxMagX: -0.244140625, minMagX: -22.918701171875, maxMagY: 7.6904296875, minMagY: -9.70458984375
	var magOffsetX = -11.5814209, magOffsetY = -1.007080078;		// offset value after calculation

	function listenForMag() {
		// v1
		tag.on('magnetometerChange', function(x, y, z) {

		    // console.log('\tx = %d G', x.toFixed(1));
		    // console.log('\ty = %d G', y.toFixed(1));
		    // console.log('\tz = %d G', z.toFixed(1));

		    // calculate the offset value!
			    // if(x > maxMagX){
			    // 	maxMagX = x;
			    // }

			    // if(x < minMagX){
			    // 	minMagX = x;
			    // }

			    // if(y > maxMagY){
			    // 	maxMagY = y;
			    // }

			    // if(y < minMagY){
			    // 	minMagY = y;
			    // }

			    // console.log("maxMagX: " + maxMagX + ", minMagX: " + minMagX + ", maxMagY: " + maxMagY + ", minMagY: " + minMagY);

		    var newMagX = x - magOffsetX;
		    var newMagY = y - magOffsetY;

		    // heading = Math.atan2(newMagY, newMagX) * 180 / Math.PI;
		    heading = Math.atan2(newMagY, newMagX);
			// Normalize to 0-360
				if (heading < 0) {
					heading += (Math.PI*2);
				}

			// console.log('heading: ' + heading);
			// console.log('\theading = %d', heading.toFixed(1));

		    // magRead.x = x;
		    // magRead.y = y;
		    // magRead.z = z;
		    magRead.l = 1;
		    magRead.h = heading;

		    if(mySocket){
				mySocket.send( JSON.stringify(magRead) );
			}
	   });
		
		// v2
   //      tag.readMagnetometer(function(x, y, z) {
   //        console.log('\tx = %d μT', x.toFixed(1));
   //        console.log('\ty = %d μT', y.toFixed(1));
   //        console.log('\tz = %d μT', z.toFixed(1));

   //    		magRead.x = x;
		 //    magRead.y = y;
		 //    magRead.z = z;
		 //    magRead.l = 1;

		 //    if(mySocket){
			// 	mySocket.send( JSON.stringify(magRead) );
			// }
   //      });
	}
	
	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			if (left) {
				console.log('left: ' + left);
			} 
			if (right) {
				console.log('right: ' + right);
			}
			// if both buttons are pressed, disconnect:
			if (left && right) {
				tag.disconnect();
			}
	   });
	}
	
	// Now that you've defined all the functions, start the process:
	connectMe();
});



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////



//
var socketHandlers = function(socket,msg){

	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{

			// MEG_FROM_PointerLockControls
			// if(msg.type=='addNewPlayer'){

			// 	//GENERATE_RED_STORK_ONLY_ONCE
			// 	if(msg.camID==0){
			// 		msg.npID = socket.id;
			// 		console.log('newPlayerID -->' + socket.id);
			// 		msg.camID++;
			// 		// console.log('camID -->' + msg.camID);

			// 		redPlayer.push(msg);
			// 	}
			// }

			allSockets[i].send(JSON.stringify(msg));
			// console.log('Server sent a GENERAL thing.');

			// if(msg.type=='addNewPlayer'){
			// 	allSockets[i].send(JSON.stringify(redPlayer));
			// 	// console.log('Server sent a BROADCAST thing.');				
			// 	console.log(redPlayer.length);
			// }

		}
		catch(error){
			console.log('that socket was closed');
		}
	}


	//BROADCAST_HISTORY_OF_PLAYERS
	// for(var i=0; i<allSockets.length; i++){
	// 	try{

	// 		// MEG_FROM_PointerLockControls
	// 		if(msg.type=='addNewPlayer'){

	// 			//console.log('addNewPlayer: #' + );

	// 			// msg.newPlayerID = clientIds[i];
	// 			//msg.newPlayerID = msg.myID;

	// 			//GENERATE_RED_STORK_ONLY_ONCE
	// 			if(msg.camID==0){
	// 				msg.npID = socket.id;
	// 				console.log('newPlayerID -->' + socket.id);


					
	// 				msg.camID++;
	// 				// console.log('camID -->' + msg.camID);


	// 				redPlayer.push(msg);
	// 			}

	// 			// console.log(redPlayer);

	// 			//allSockets[i].send(JSON.stringify(msg));

	// 			allSockets[i].send(JSON.stringify(redPlayer));

	// 			// console.log('Server sent a BROADCAST thing.');				
	// 			console.log(redPlayer.length);
	// 		}
	// 	}
	// 	catch(error){
	// 		console.log('that socket was closed');
	// 	}
	// }

	//RESTORE_AddStork
	// for(var i=0; i<allSockets.length; i++){

	// 	try{
	// 		if(msg.type=='addNewPlayer'){

	// 			if(msg.camID==0){
	// 				redPlayer.push(msg);
	// 				msg.camID++;
	// 			}

	// 			allSockets[i].send(JSON.stringify(redPlayer));				
	// 			console.log(redPlayer.length);
	// 		}
	// 	}
	// 	catch(error){
	// 		console.log('that socket was closed');
	// 	}

	// }
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
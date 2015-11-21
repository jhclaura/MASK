//SET_UP
var express = require('express');
var app = express();
//
var util = require('util');
// var Player = require('./Player').Player;

var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 7000;

//VARIABLES
var players = [];
var maskPlayer = [];
// remotePlayer.type = 'addOldPlayer';

//

server.listen(port);

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});

console.log('Server started on port ' + port);

//

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( {'server': server} );

var allSockets = [];	//for all sockets/clients
var clientIds = [];
var thisId = 0;

var maskIndex = {};
maskIndex.type = "index";

var mySocket = undefined;

//

wss.on('connection', function(ws){
	
	mySocket = ws;

	thisId++;
	clientIds.push(thisId);

	allSockets.push(ws);
	console.log('new player #%d connected!', thisId);

	if(mySocket){
		maskIndex.index = thisId;
		mySocket.send( JSON.stringify(maskIndex) );
	}

	ws.on('message', function(data){
		
		var msg = JSON.parse(data);
		socketHandlers(ws, msg);

	});

	ws.on('close', function(){
		for(var i=0; i<allSockets.length; i++){
			if(allSockets[i]==ws){

				var msg = {
					'type': 'removePlayer',
					'removeID': clientIds[i]
				};

				console.log('Player #%d disconnected.', clientIds[i]);

				allSockets.splice(i,1);
				clientIds.splice(i,1);

				socketHandlers(ws, msg);

				break;
			}
		}
		mySocket = undefined;
	});	
});

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/*
// Ardino Setup
var serialport = require('serialport'),// include the library
    SerialPort = serialport.SerialPort, // make a local instance of it
    portName = '/dev/tty.usbmodemfd121'; 


var myPort = new SerialPort(portName, {
	baudRate: 9600,
	parser: serialport.parsers.readline("\r\n")
});

var lastData=0;

myPort.on('open', showPortOpen);
myPort.on('data', latestDataHandler);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen(){
	console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function latestDataHandler(data){
	// console.log(data);
	lastData = data;

	var msg = {
		'type': 'foot',
		'data': lastData
	};

	socketHandlers(mySocket, msg);
}

function showPortClose(){
	console.log('port cloased.');
}

function showError(error){
	console.log('Serial port error: ' + error);
}
*/

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


// xbee setup
	var serialPort = require('serialport'),		// include the library
	   	SerialPort = serialPort.SerialPort,		// make a local instance of it
	   	// portName = '/dev/tty.usbserial-A901QJFS5';	//of mine
	   	// portName = '/dev/tty.usbserial-A901QJFS';		//of meeting room
	   	portName = '/dev/tty.usbserial-AH01KCNC5';

	var myPort = new SerialPort(portName, {
		baudRate: 9600
	});

	var lastData=0;
	var myPacket = [];
	var sensorA = 0, sensorB = 0, sensorC = 0, sensorD = 0;

//======================================================================

	myPort.on('open', showPortOpen);
	myPort.on('data', latestDataHandler);
	myPort.on('close', showPortClose);
	myPort.on('error', showError);

//======================================================================

function showPortOpen(){
	console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function latestDataHandler(data){

	for (var i=0;i<data.length;i++){
		var thisByte = data[i];

        if (thisByte==126){
            // console.log(myPacket);

			sensorA = myPacket[11];
			// sensorB = myPacket[12];
			// sensorC = myPacket[14];
			// sensorD = myPacket[17];

   //          rNumber = sensorA;
   //          gNumber = sensorB;
   //          bNumber = sensorC;
   //          alphaNumber = sensorD;

   			if(sensorA==1){
   				console.log("Button 1 pressed");
   			}else if(sensorA==2){
   				console.log("Button 2 pressed");
   			}else if(sensorA==3){
   				console.log("Both buttons pressed");
   			}

   			var msg = {
				'type': 'foot',
				'data': sensorA
			};

			socketHandlers(mySocket, msg);

			// console.log(myPacket);			
            myPacket = [];  //clear the packet
        } else {
            myPacket.push(thisByte);
        }
	}
}

function showPortClose(){
	console.log('port cloased.');
}

function showError(error){
	console.log('Serial port error: ' + error);
}


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

var socketHandlers = function(socket,msg){

	// console.log("entered socketHandlers");

	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{
			// ADD_ID_INFO
			// msg.myID = socket.id;

			if(msg.type=='addNewPlayer'){
				//GENERATE_ALL_MASKPLAYERS_ONLY_ONCE
				if(msg.camID==0){
					msg.npID = 100;
					// socket.id = msg.id;	// save id
					console.log('NewPlayerID --> ' + msg.id);
					msg.camID++;

					maskPlayer.push(msg);
				}
			}

			// SERVER_SEND_GENERAL_THING
			allSockets[i].send(JSON.stringify(msg));


			// SERVER_SEND_BROADCAST_THING
			if(msg.type=='addNewPlayer'){
				allSockets[i].send(JSON.stringify(maskPlayer));
				console.log(maskPlayer.length);
			}

		}
		catch(error){
			console.log('that socket was closed');
		}
	}
};

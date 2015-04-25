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
var beeLookAtQueen = [];

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
var thisId = -1;

var hiveIndex = {};
hiveIndex.type = "index";

var mySocket = undefined;

//

wss.on('connection', function(ws){

	// mySocket = ws;

	thisId++;
	clientIds.push(thisId);

	ws.index = thisId;

	allSockets.push(ws);
	console.log('new player #%d connected!', thisId);


	hiveIndex.index = thisId;
	socketHandlers(ws, hiveIndex);
	console.log("hive index sent!");


	ws.on('message', function(data){
		
		// console.log(data);

		var msg = JSON.parse(data);
		socketHandlers(ws, msg);

		if(msg.type == 'hive'){

			var tmpIn = msg.in;
			var tmpOut = msg.out;

			
			if(myPort && myPort.isOpen){
				myPort.write( tmpIn + ',' + tmpOut);	// better end with another ','

				// myPort.write( '0' );
				// console.log( '0' );
				console.log( tmpIn + "," + tmpOut );
			}
		}

	});

	ws.on('close', function(){
		for(var i=0; i<allSockets.length; i++){
			if(allSockets[i]==ws){

				// for turn off the light of HIVE LEDs
					myPort.write( -1 + ',' + clientIds[i]);

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

	mySocket = ws;
});



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


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
	myPort.isOpen = true;
}

function latestDataHandler(data){
	// console.log(data);
	lastData = data;

	var msg = {
		'type': 'button',
		'status': lastData
	};

	// if(mySocket){
	// 	socketHandlers(mySocket, msg);
	// 	console.log("sent from arduino!");
	// }
	
	// if(mySocket){
	// 	mySocket.send(data);
	// }
}

function showPortClose(){
	console.log('port cloased.');
}

function showError(error){
	console.log('Serial port error: ' + error);
}


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



var socketHandlers = function(socket,msg){

	// console.log("entered socketHandlers");

	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{
			// ADD_ID_INFO
			msg.index = socket.index;

			var maskIndex = undefined;

			if(msg.type=='index'){
				//GENERATE_ALL_MASKPLAYERS_ONLY_ONCE
				if(msg.camID==0){
					msg.npID = 100;
					// socket.id = msg.id;	// save id
					console.log('NewPlayerID --> ' + msg.id);
					msg.camID++;

					maskPlayer.push(msg);
				}
			}

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

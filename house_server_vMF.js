var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || 7000;



// peer_server
var ExpressPeerServer = require('peer').ExpressPeerServer;
var peerExpress = require('express');
var peerApp = peerExpress();
var peerServer = require('http').createServer(peerApp);
var options = { debug: true }
var peerPort = 5000;

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});

// peerApp.get('*', function(req, res){
// 	res.sendFile(__dirname + req.url);
// });
peerApp.use('/pp', ExpressPeerServer(peerServer, options));

server.listen(port);
peerServer.listen(peerPort);

console.log('Server started on port ' + port);
console.log('PeerServer started on port ' + peerPort);


// Websocket
var maskPlayer = [];

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
		'type': 'button',
		'status': lastData
	};

	// if(mySocket){
		socketHandlers(mySocket, msg);
		// console.log("send!");
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
*/

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
			console.log('error of socketHandlers: ' + error);
		}
	}
};
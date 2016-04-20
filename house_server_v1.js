//SET_UP
var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || 7000;

app.get('*', function(req, res){
	res.sendFile(__dirname + req.url);
});

server.listen(port);

console.log('Server started on port ' + port);


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
	// clientIds.push(thisId);
	ws.id = thisId;

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
					'removeID': ws.id
				};

				console.log( 'Player #%d disconnected.', ws.id );

				allSockets.splice(i,1);
				maskPlayer.splice(i,1);

				socketHandlers(ws, msg);

				break;
			}
		}
		mySocket = undefined;
	});
});

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
					msg.id = socket.id;	// save id
					msg.camID++;

					console.log('NewPlayerID --> ' + msg.id);

					maskPlayer.push(msg);
				}
			}

			// SERVER_SEND_GENERAL_THING
			allSockets[i].send(JSON.stringify(msg));


			// SERVER_SEND_BROADCAST_THING
			if(msg.type=='addNewPlayer'){
				allSockets[i].send(JSON.stringify(maskPlayer));
				// console.log(maskPlayer.length);
			}

		}
		catch(error){
			console.log('error of socketHandlers: ' + error);
		}
	}
};
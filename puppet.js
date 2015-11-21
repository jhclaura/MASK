

// xbee setup
	var serialPort = require('serialport'),		// include the library
	   SerialPort = serialPort.SerialPort,		// make a local instance of it
	   // portName = '/dev/tty.usbserial-A901QJFS5';	//of mine
	   // portName = '/dev/tty.usbserial-A901QJFS';		//of meeting room
	   portName = '/dev/tty.usbserial-AH01KCNC';		//of meeting room

	var myPort = new SerialPort(portName, {
		baudRate: 9600
	});

	var lastData=0;
	var myPacket = [];
	var sensorA = 0, sensorB = 0, sensorC = 0, sensorD = 0;
	var setLightCountdown = 0;




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
            console.log(myPacket);

			// sensorA = myPacket[11];
			// sensorB = myPacket[12];
			// sensorC = myPacket[14];
			// sensorD = myPacket[17];

   //          rNumber = sensorA;
   //          gNumber = sensorB;
   //          bNumber = sensorC;
   //          alphaNumber = sensorD;

   			// if(sensorA==1){
   			// 	console.log("Wooo pressed!");
   			// }else{
   			// 	console.log("No pressed.");
   			// }
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

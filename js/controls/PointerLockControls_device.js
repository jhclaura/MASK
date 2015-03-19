/**
 * @author mrdoob / http://mrdoob.com/
 */

////////////////////////////////////
//FOR_RIVER_SCENE
//REMEMBER_TO_LOCK_ROTATION
////////////////////////////////////
var camID = -1;
var oldPlayerNum = 0, newPlayerNum = 0;

var newPlayerJoined = false;

var quaternionChanged = false;

var mouseActive = false, keyActive = false, touchActive = false;

THREE.PointerLockControls = function ( camera ) {

	camID ++;
	newPlayerNum ++;

	var scope = this;
	var rotatable = true;
	// var rotatable = false;

	// camera.position.set(0, 3.472, 6.94);
	// camera.rotation.set(-0.463,0,0);
	// camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();

	var playerStartX = -15 + Math.random()*30;
	var playerStartZ = -15 + Math.random()*30;
	var playerStartY = 0;

	yawObject.position.x = playerStartX;
	yawObject.position.y = 6;
	yawObject.position.z = playerStartZ;


	
	// yawObject.rotation.x = 0.2;
	// yawObject.rotation.y = -0.066;

	
	yawObject.add( pitchObject );

	//LOOKAT_CENTER_TWEAK SO HARD!
	var m1 = new THREE.Matrix4();
	var center = new THREE.Vector3(0,yawObject.position.y,0);
	m1.lookAt( yawObject.position, center, yawObject.up );
	yawObject.quaternion.setFromRotationMatrix( m1 );

	// console.log(yawObject.quaternion);		//3
	// console.log(yawObject.rotation);
	// console.log( Math.sin( yawObject.rotation.y / 2 ) + ', ' + Math.cos( yawObject.rotation.y / 2 ) );

	var checkQ = Math.abs( Math.sin( yawObject.rotation.y / 2 ) - yawObject.quaternion.y );
	
	if( checkQ > 0.001 )
		quaternionChanged = true;

	var playerStartRotY = yawObject.rotation.y;

	//

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var onObject = false;
	var canJump = false;
	var start = false;

	var collisionF = false;
	var collisionB = false;
	var collisionR = false;
	var collisionL = false;
	var collisionD = false;

	var distance, fallLocation;

	var show = false;
	var prevTime = performance.now();

	var velocity = new THREE.Vector3();
	var move = new THREE.Vector3();

	var PI_2 = Math.PI / 2;
	var speed = 0.08;

	//TOUCH
	var touchStartLoc = new THREE.Vector2();
	var touchCurrentLoc = new THREE.Vector2();
	var touch2ndStartLoc = new THREE.Vector2();
	var touch2ndCurrentLoc = new THREE.Vector2();


	//WEBSOCKETS
	var msg = {
		'type': 'addNewPlayer',
		'camID': camID,
		'playerStartX': playerStartX,
		'playerStartY': playerStartY,
		'playerStartZ': playerStartZ,
		'playerStartRotY': playerStartRotY,
		'newHex': 0xff0000,
		'qChanged': quaternionChanged
	};

	//console.log('rotY: ' + playerStartRotY/Math.PI*180);

	// if(ws){
		if(oldPlayerNum != newPlayerNum){
			if(ws){
				// ws.send( JSON.stringify(msg) );
				sendMessage(JSON.stringify(msg));
			}
		}
	// }

	var mouseTimeOut;

	var onMouseMove = function ( event ) {

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		mouseActive = true;

		if( quaternionChanged )
			yawObject.rotation.y += movementX * 0.001;
		else
			yawObject.rotation.y -= movementX * 0.001;

		pitchObject.rotation.x -= movementY * 0.001;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		// console.log("movementX: " + movementX + ", movementY: " + movementY);
		// console.log(yawObject.quaternion);
		// console.log(yawObject.rotation);
		//console.log('rotY: ' + yawObject.rotation.y/Math.PI*180);

		//TIMEOUT_detect mouse stop
		clearTimeout(mouseTimeOut);
		mouseTimeOut = setTimeout(function(){
			mouseActive = false;
		}, 50);

	};

	var onKeyDown = function ( event ) {
		keyActive = true;

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; 
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				//JUMP
				if ( canJump === true ) velocity.y += 1;
				canJump = false;
				//TEXT
				show = true;
				break;

		}

	};

	var onKeyUp = function ( event ) {
		keyActive = false;

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

			case 32: // space
				//TEXT
				show = false;
				break;

		}

	};

	var onTouchStart = function ( event ) {
		touchActive = true;

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var touch = event.touches[0];

		var startPointX = touch.clientX;
		var startPointY = touch.clientY;

		touchStartLoc.set(startPointX, startPointY);


		// console.log("start: ");
		// console.log(startPointX + ", " + startPointY);
		// console.log(event);

		if(event.touches.length==2){
			var touch2nd = event.touches[1];

			touch2ndStartLoc.set(touch2nd.clientX, touch2nd.clientY);
		}
	};


	var onTouchMove = function ( event ) {

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var touchFirst = event.touches[0];

		var currentLocX = touchFirst.clientX;
		var currentLocY = touchFirst.clientY;

		touchCurrentLoc.set(currentLocX, currentLocY);

		var movementX = touchCurrentLoc.clone().sub(touchStartLoc).x;
		var movementY = touchCurrentLoc.clone().sub(touchStartLoc).y;

		//adjust_rotY
			mouseActive = true;

			if( quaternionChanged )
				yawObject.rotation.y += movementX * 0.00009;
			else
				yawObject.rotation.y -= movementX * 0.00009;
		//

		// yawObject.rotation.y -= movementX * 0.00009;
		pitchObject.rotation.x -= movementY * 0.00009;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );


		// console.log("move: ");
		// console.log(event);

		// console.log("current: ");
		// console.log(currentLocX + ", " + currentLocY);
		// console.log("movementX: " + movementX + ", movementY: " + movementY);

		//MOVE_AROUND
		if( event.touches.length>=2) {
			var touchSecond = event.touches[1];

			if( (touchStartLoc.x<window.innerWidth/2 && touchSecond.clientX>=window.innerWidth/2)
				|| (touchStartLoc.x>=window.innerWidth/2 && touchSecond.clientX<=window.innerWidth/2) ){

				touch2ndCurrentLoc.set(touchSecond.clientX, touchSecond.clientY);

				var movement2X = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).x;
				var movement2Y = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).y;


				if(movement2X > 15){
					moveRight = true;
				}

				if(movement2X < -15){
					moveLeft = true;
				}

				if(movement2Y > 15){
					moveBackward = true;
				}

				if(movement2Y < -15){
					moveForward = true;
				}

			}
		} else {
			moveLeft = false;
			moveRight = false;
			moveBackward = false;
			moveForward = false;
		}

		// console.log(event.touches.length);

	};

	var onTouchEnd = function ( event ) {
		touchActive = false;

		moveLeft = false;
		moveRight = false;
		moveBackward = false;
		moveForward = false;

	};


	

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	//TOUCH
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchmove', onTouchMove, false );
	document.addEventListener( 'touchend', onTouchEnd, false );


	/*
	window.addEventListener('deviceorientation', function(eventData){
		var tiltFB = eventData.beta;
		var tiltLR = eventData.gamma;

		if(tiltLR > 10){
			moveLeft = true;
			console.log("moveLeft");
		} else {
			moveLeft = false; 
		}

		if(tiltLR < -10){
			moveRight = true;
		} else {
			moveRight = false;
		}

		if(tiltFB > 50){
			moveBackward = true;
		} else {
			moveBackward = false;
		}

		if(tiltFB < 30){
			moveForward = true;
		} else {
			moveForward = false;
		}
	}, false);*/


	this.enabled = false;


	this.rotatable = function(){
		rotatable = true;
	};

	//COLLISION
	this.testCollideF = function(c){
		collisionF = c;
	};
	this.testCollideB = function(c){
		collisionB = c;
	};
	this.testCollideR = function(c){
		collisionR = c;
	};
	this.testCollideL = function(c){
		collisionL = c;
	};
	this.testCollideD = function(c){
		collisionD = c;
	};

	this.moveL = function(m){
		moveLeft = m;
	};
	this.moveR = function(m){
		moveRight = m;
	};
	this.moveB = function(m){
		moveBackward = m;
	};
	this.moveF = function(m){
		moveForward = m;
	};



	this.dirF = function(){
		return moveForward;
	};
	this.dirB = function(){
		return moveBackward;
	};
	this.dirL = function(){
		return moveLeft;
	};
	this.dirR = function(){
		return moveRight;
	};
	this.toShow = function(){
		return show;
	};
	this.onSomething = function(){
		return onObject;
	};



	this.trigger = function(){
		start = true;
	};

	this.getMatrix = function() {
		return pitchObject.matrix;
	}

	this.getPitchObject = function () {
		return pitchObject;
	};


	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		onObject = boolean;
		// canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
		//var v = new THREE.Vector3( 0, 0, -1 );

		return function( v ) {

			var v = new THREE.Vector3( 0, 0, -1 );


			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.posX = function(){
		return yawObject.position.x;
	};

	this.posY = function(){
		return yawObject.position.y;
	};

	this.setDistance = function(_dis) {
		distance = _dis;
	};

	this.setDropLocation = function(_fallLoc) {
		fallLocation = _fallLoc;
	};

	this.setPosX = function(newX){
		yawObject.position.x = newX;
	};

	this.setPosY = function(newY){
		yawObject.position.y = newY;
	};

	this.setPosZ = function(newZ){
		yawObject.position.z = newZ;
	};

	this.setSpeed = function(newS){
		speed = newS;
	};

	this.stopFall = function(){
		velocity.y = Math.max( 0, velocity.y );;
	};

	var changetPosY = function(moveY){
		yawObject.position.y += moveY;
	};

	this.posZ = function(){
		return yawObject.position.z;
	};

	this.rotX = function(){
		return pitchObject.rotation.x;
	};

	this.rotY = function(){
		return yawObject.rotation.y;
	};

	this.rotZ = function(){
		return pitchObject.rotation.z;
	};

	this.dis = function(){
		return distance;
	};

	this.speed = function(){
		return speed;
	};

	this.update = function () {


		if ( scope.enabled === false ) return;
		// if ( start === false ) return;

		// console.log("controls updated!");

		var time = performance.now();
		var delta = speed;

		// velocity.x += ( - velocity.x ) * 0.08 * delta;
		// velocity.z += ( - velocity.z ) * 0.08 * delta;

		//FALLING
		// velocity.y -= 1 * delta;

		if ( moveForward && !collisionF ) velocity.z = -delta;
		else if ( moveBackward && !collisionB ) velocity.z = delta;
		else velocity.z = 0;

		if ( moveLeft && !collisionL ) velocity.x = -delta;
		else if ( moveRight && !collisionR ) velocity.x = delta;
		else velocity.x = 0;


		//JUMP_UP_TO_AIR
		// if ( onObject === true ) {
		// 	velocity.y = Math.max( 0, velocity.y );
		// }

		//FALLING
		// if ( onObject == false ) {
		// 	if(yawObject.position.y > -5)
		// 		velocity.y = -delta;
		// }
		// else {
		// 	velocity.y = 0;
		// }


		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );


		if ( yawObject.position.y < 0 ) {

			velocity.y = 0;
			yawObject.position.y = 0;

			canJump = true;

		}

		//WEB_SOCKET
			var locX = -25 + Math.random()*50;
			var locY = 0;
			var locZ = -25 + Math.random()*50;

			var msg = {
				'type':'updatePlayer',
				'playerID': myID,
				'playerLocX': yawObject.position.x,
				'playerLocZ': yawObject.position.z,
				'playerRotY': yawObject.rotation.y,
				'qChanged': quaternionChanged
			};

			if(ws){
				if(mouseActive || keyActive || touchActive)
					sendMessage( JSON.stringify(msg) );
					// ws.send( JSON.stringify(msg) );
			}


	};

	//UPDATE_FOR_WS
	oldPlayerNum = newPlayerNum;

};

/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Based on 
 * 		THREE.PointerLockControls by mrdoob
 * 		OculusRiftControls by benvanik
 * 		DeviceOrientationControls by	richt / http://richt.me
 * 										WestLangley / http://github.com/WestLangley
 * 										jonobr1 / http://jonobr1.com
 * 										arodic / http://aleksandarrodic.com
 * 										doug / http://github.com/doug
 * @author Laura / http://jhclaura.com
 */

var deviceOrientation = {};
var screenOrientation = window.orientation || 0;

var eyeFinalQ = new THREE.Quaternion();			// for screen in front of eyes
var eyeFinalQ2 = new THREE.Quaternion();		// for others

var up = new THREE.Vector3(0, 1, 0);
var v0 = new THREE.Vector3(0, 0, 0);


function onDeviceOrientationChangeEvent(evt) {
deviceOrientation = evt;
}
window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

function getOrientation() {
switch (window.screen.orientation || window.screen.mozOrientation) {
  case 'landscape-primary':
    return 90;
  case 'landscape-secondary':
    return -90;
  case 'portrait-secondary':
    return 180;
  case 'portrait-primary':
    return 0;
}
// this returns 90 if width is greater then height
// and window orientation is undefined OR 0
// if (!window.orientation && window.innerWidth > window.innerHeight)
//   return 90;
return window.orientation || 0;
}

function onScreenOrientationChangeEvent() {
screenOrientation = getOrientation();
}
window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);

var mouseActive = false, keyActive = false, touchActive = false;
var mouseTimeOut;
var rotatable = true;
var quaternionChanged = false;

var smoothBeta={}, smoothAlpha={}, smoothGamma={};
var betaRecordings=[], gammaRecordings=[], alphaRecordings=[];


var thisIsTouchDevice = false;
if( isTouchDevice() ) thisIsTouchDevice = true;

//
var distance, fallLocation;

// puppet rotate
var eulerPP, matrixPP, quaternionPP;


//
THREE.DeviceControls = function ( camera ) {

	// Use the method of THREE.PointerLockControls
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	var yawObjectOriginal = new THREE.Object3D();

	yawObject.position.y = myStartY;
	yawObject.position.x = myStartX;
	yawObject.position.z = myStartZ;
	yawObject.add( pitchObject );
	yawObjectOriginal.position.copy(yawObject.position);
	//
	this.lookAtCenterQ = new THREE.Quaternion();

	//LOOKAT_CENTER_TWEAK SO HARD!
		var m1 = new THREE.Matrix4();
		var center = new THREE.Vector3(0,0,0);
		m1.lookAt( yawObject.position, center, yawObject.up );

		if(thisIsTouchDevice) {
			this.lookAtCenterQ.setFromRotationMatrix( m1 );
		}
		else {
			var tmpQ = new THREE.Quaternion();
			tmpQ.setFromRotationMatrix(m1);
			var tmpE = new THREE.Euler(0, 0, 0, 'YXZ');
			tmpE.setFromQuaternion(tmpQ);

			tmpE.set(0, tmpE.y, 0);
			yawObject.rotation.copy(tmpE);
			// console.log(yawObject.rotation);
		}

	//
	var playerStartRotY = yawObject.rotation.y;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var onObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	this.moveSpeed = 0.01;
	this.jumpSpeed = 5;

	var _q1 = new THREE.Quaternion();
	var axisX = new THREE.Vector3( 1, 0, 0 );
	var axisZ = new THREE.Vector3( 0, 0, 1 );

	//TOUCH
	var touchStartLoc = new THREE.Vector2();
	var touchCurrentLoc = new THREE.Vector2();
	var touch2ndStartLoc = new THREE.Vector2();
	var touch2ndCurrentLoc = new THREE.Vector2();

	//

	// DEVICE_ORIENTATION_CONTROL
	this.freeze = false;		// origin: true
	this.rollSpeed = 0.005;
	this.autoAlign = true;
	this.autoForward = false;

	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;
	this.orient = 0;

	this.alignQuaternion = new THREE.Quaternion();
	var alignQuaternionPublic = new THREE.Quaternion();
	this.orientationQuaternion = new THREE.Quaternion();
	var orientationQuaternionPublic = new THREE.Quaternion();
	this.finalQ = new THREE.Quaternion();	
	this.finalQ2 = new THREE.Quaternion();		// for rotate things other than eyeScreen

	this.screenOrientationQuaternion = new THREE.Quaternion();


	var quaternion = new THREE.Quaternion(), quaternion2 = new THREE.Quaternion();
	var quaternionLerp = new THREE.Quaternion(), quaternionLerp2 = new THREE.Quaternion();

	var tempVector3 = new THREE.Vector3();
	var tempMatrix4 = new THREE.Matrix4();
	var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
	var tempQuaternion = new THREE.Quaternion();

	var zee = new THREE.Vector3(0, 0, 1);
	var euler = new THREE.Euler();
	var euler2 = new THREE.Euler();
	var screenTransform = new THREE.Quaternion();
	var worldTransform = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
	var worldTransform2 = new THREE.Quaternion( Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
	var minusHalfAngle = 0;

	//
	eulerPP = new THREE.Euler();
	matrixPP = new THREE.Matrix4();
	quaternionPP = new THREE.Quaternion();


	this.calQ = function() {
		this.alpha = deviceOrientation.alpha ? THREE.Math.degToRad(deviceOrientation.alpha) : 0; // Z
		this.beta = deviceOrientation.beta ? THREE.Math.degToRad(deviceOrientation.beta) : 0; // X'
		this.gamma = deviceOrientation.gamma ? THREE.Math.degToRad(deviceOrientation.gamma) : 0; // Y''
		this.orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0; // O

		// console.log("alpha: " +  deviceOrientation.gamma + ", beta: " +  deviceOrientation.beta + ", gamma: " +  deviceOrientation.gamma);


		// The angles alpha, beta and gamma
		// form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

		// 'ZXY' for the device, but 'YXZ' for us
		// euler.set(bTmp, aTmp, - gTmp, 'YXZ');
		euler.set(this.beta, this.alpha, - this.gamma, 'YXZ');

		quaternion.setFromEuler(euler);
		quaternionLerp.slerp(quaternion, 0.5); // interpolate

		// orient the device
		if (this.autoAlign) orientationQuaternionPublic.copy(quaternion); // interpolation breaks the auto alignment
		else orientationQuaternionPublic.copy(quaternionLerp);

		// camera looks out the back of the device, not the top
		orientationQuaternionPublic.multiply(worldTransform);

		// adjust for screen orientation
		orientationQuaternionPublic.multiply(screenTransform.setFromAxisAngle(zee, - this.orient));

		// this.finalQ.copy(this.lookAtCenterQ);
		this.finalQ.copy( alignQuaternionPublic );
		this.finalQ.multiply( orientationQuaternionPublic );


		//
		// for rotate things other than eyeScreen
		euler2.set( this.beta, this.alpha, -this.gamma, 'YXZ');
		quaternion2.setFromEuler(euler2);
		quaternionLerp2.slerp(quaternion2, 0.5); // interpolate

		if (this.autoAlign) orientationQuaternionPublic.copy(quaternion2); // interpolation breaks the auto alignment
		else orientationQuaternionPublic.copy(quaternionLerp2);

		orientationQuaternionPublic.multiply(worldTransform2);
		orientationQuaternionPublic.multiply(screenTransform.setFromAxisAngle(zee, - this.orient));
		this.finalQ2.copy( alignQuaternionPublic );
		this.finalQ2.multiply( orientationQuaternionPublic );


		// console.log( this.finalQ );
		
		if (this.autoAlign && this.alpha !== 0) {
				this.autoAlign = false;
				align();
	 	}
	};

	var align = function() {

		tempQuaternion = new THREE.Quaternion();
		tempVector3.copy(yawObject.position).applyQuaternion( tempQuaternion.copy( orientationQuaternionPublic ).inverse(), 'ZXY' );

		// yawObject.position, center
		tempMatrix4 = new THREE.Matrix4();

		tempEuler.setFromQuaternion(
			tempQuaternion.setFromRotationMatrix(
				// look at center v0
				tempMatrix4.lookAt(tempVector3, v0, up)
			)
		);

		var ttt = tempEuler.y + Math.PI;
		tempEuler.set(0, ttt, 0);
		alignQuaternionPublic.setFromEuler(tempEuler);

		console.log(ttt);
		console.log("aligneddd!");
	};

	//

	var onMouseMove = function ( event ) {

		if ( this.enabled === false ) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		mousemove = true;
		mouseActive = true;

		// yawObject.rotation.y -= movementX * 0.001;
		yawObjectOriginal.rotation.y -= movementX * 0.001;

		if( quaternionChanged )
			yawObject.rotation.y += movementX * 0.001;
		else
			yawObject.rotation.y -= movementX * 0.001;

		pitchObject.rotation.x -= movementY * 0.001;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		if( !thisIsTouchDevice ){
			var tempEuler = new THREE.Euler();
			tempEuler.set(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ');
			eyeFinalQ.setFromEuler(tempEuler);

			tempEuler.set(pitchObject.rotation.x, -yawObject.rotation.y, 0, 'YXZ');
			eyeFinalQ2.setFromEuler(tempEuler);
		}

		//TIMEOUT_detect mouse stop
			clearTimeout(mouseTimeOut);
			mouseTimeOut = setTimeout(function(){
				mouseActive = false;
			}, 50);

		// console.log("aa");
	};
	
	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				// if ( canJump === true ) velocity.y += this.jumpSpeed;
				// canJump = false;
				break;

		}

	}.bind(this);

	var onKeyUp = function ( event ) {

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
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	// DEVICE
	var onTouchStart = function ( event ) {
		touchActive = true;

		if (this.enabled === false) return;
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

		// update pupp direction
			quaternionPP = eyeFinalQ.clone();
			quaternionPP.x = 0;
			quaternionPP.z = 0;
			quaternionPP.normalize();
			pupp.rotation.setFromQuaternion( quaternionPP );
			pupp.rotation.y -= Math.PI;


		console.log(camPos);
	};


	var onTouchMove = function ( event ) {

		if (this.enabled === false) return;
		if (rotatable === false) return;

		var touchFirst = event.touches[0];

		var currentLocX = touchFirst.clientX;
		var currentLocY = touchFirst.clientY;

		touchCurrentLoc.set(currentLocX, currentLocY);

		var movementX = touchCurrentLoc.clone().sub(touchStartLoc).x;
		var movementY = touchCurrentLoc.clone().sub(touchStartLoc).y;

		//HRAD_ROTATION
		// replace by device orientation
		/*	
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
		*/

		//MOVE_AROUND
		if( event.touches.length>=2) {
			var touchSecond = event.touches[1];

			if( (touchStartLoc.x<window.innerWidth/2 && touchSecond.clientX>=window.innerWidth/2)
				|| (touchStartLoc.x>=window.innerWidth/2 && touchSecond.clientX<=window.innerWidth/2) ){

				touch2ndCurrentLoc.set(touchSecond.clientX, touchSecond.clientY);

				var movement2X = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).x;
				var movement2Y = touch2ndCurrentLoc.clone().sub(touch2ndStartLoc).y;

				// console.log("movement2X: " + movement2X + ", movement2Y: " + movement2Y);

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

		console.log(camPos);
	};

	var onTouchEnd = function ( event ) {
		touchActive = false;

		moveLeft = false;
		moveRight = false;
		moveBackward = false;
		moveForward = false;

	};

	//

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	//TOUCH
	if(thisIsTouchDevice) {
		document.addEventListener( 'touchstart', onTouchStart, false );
		document.addEventListener( 'touchmove', onTouchMove, false );
		document.addEventListener( 'touchend', onTouchEnd, false );
	}

	this.enabled = true;

	this.getObject = function () {
		return yawObject;
	};

	this.onSomething = function(){
		return onObject;
	};

	this.isOnObject = function ( boolean ) {

		onObject = boolean;
		// canJump = boolean;

	};

	// FOR_DEBUGGING
	this.getDirection = function() {

		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {
			var v = new THREE.Vector3( 0, 0, -1 );

			if(thisIsTouchDevice) 
				rotation.set( yawObject.rotation.x, yawObject.rotation.y, 0 );
			else
				rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
			v.copy( direction ).applyEuler( rotation );

			return v;
		}

	}();

	this.setDistance = function(_dis) {
		distance = _dis;
	};

	this.setDropLocation = function(_fallLoc) {
		fallLocation = _fallLoc;
	};

	this.rotation = function(){
		var rr = new THREE.Vector3(yawObject.rotation.x, yawObject.rotation.y, yawObject.rotation.z);
		return rr;
	};

	this.setRotation = function(newRotation){
		yawObject.rotation.x = newRotation.x;
		yawObject.rotation.y = newRotation.y;
		yawObject.rotation.z = newRotation.z;
	};

	this.setPosX = function(newPosX){
		yawObject.position.x = newPosX;
		// console.log(newPosX);
	};

	this.setPosY = function(newPosY){
		yawObject.position.y = newPosY;
	};

	this.setPosZ = function(newPosZ){
		yawObject.position.z = newPosZ;
	};

	this.setPosition = function(newPosition){
		yawObject.position.copy(newPosition);
		// console.log(newPosition);
	};

	this.dirF = function(){
		return moveForward;
	};

	this.posX = function(){
		return yawObject.position.x;
	};

	this.posY = function(){
		return yawObject.position.y;
	};

	this.posZ = function(){
		return yawObject.position.z;
	};

	this.position = function(){
		return yawObject.position;
	};

	this.rotX = function(){
		return yawObject.rotation.x;
	};

	this.rotY = function(){
		return yawObject.rotation.y;
	};

	this.rotZ = function(){
		return yawObject.rotation.z;
	};

	// FOR_MOVING
	this.setMoveF = function(moveF){
		moveForward = moveF;
	};

	this.setMoveB = function(moveB){
		moveBackward = moveB;
	};

	this.setMoveL = function(moveL){
		moveLeft = moveL;
	};

	this.setMoveR = function(moveR){
		moveRight = moveR;
	};

	this.stopFall = function(){
		velocity.y = Math.max( 0, velocity.y );;
	};

	//

	this.update = function ( delta ) {

		if (this.enabled === false) return;

		// DEVICE
		if (this.freeze) return;

		
		console.log("moveForward: " + moveForward);

		delta *= 0.5;

		// vr doesn't need velocity
			velocity.x += ( - velocity.x ) * 0.08 * delta;
			velocity.z += ( - velocity.z ) * 0.08 * delta;
			velocity.y += ( - velocity.y ) * 0.08 * delta;

			if ( moveForward ) {
				velocity.z -= this.moveSpeed * delta;
				// console.log("move forward!");
			}
			if ( moveBackward ) velocity.z += this.moveSpeed * delta;

			if ( moveLeft ) velocity.x -= this.moveSpeed * delta;
			if ( moveRight ) velocity.x += this.moveSpeed * delta;


		// Rotate by Device
		if( thisIsTouchDevice ) {
			// calculate the Quaternion
			this.calQ();

			// if (this.autoAlign && this.alpha !== 0) {
			// 	this.autoAlign = false;
			// 	this.align();
	 	// 	}

			eyeFinalQ.copy( this.finalQ.clone() );
			eyeFinalQ2.copy( this.finalQ2.clone() );

	 		yawObject.rotation.setFromQuaternion( this.finalQ );

			// set lookDown max
			// yawObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, yawObject.rotation.x ) );
	 	}


		yawObject.translateY( velocity.y );
		yawObject.translateX( velocity.x );
		yawObject.translateZ( velocity.z );



		yawObject.position.y = myStartY;

		// if ( yawObject.position.y < 1 ) {
		// 	velocity.y = 0;
		// 	yawObject.position.y = 1;
		// 	canJump = true;
		// }


		// if(onObject == true) {
		// 	yawObject.position.y = 153.5-distance;
		// }

	};

	

	this.connect = function() {
		this.freeze = false;
	};

	this.disconnect = function() {
		this.freze = true;
	};

};

function smooth(target, readings, input){

	target.total -= readings[target.index];
	readings[target.index] = input;
	target.total += readings[target.index];
	target.index++;

	if(target.index >= target.sampleNumber)
		target.index = 0;

	target.average = target.total / target.sampleNumber;

	return target.average;
}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}
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
var eyeFinalQ = new THREE.Quaternion();

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

var myStartX = 0, myStartZ = 0;

//
var detectHeadStatus = false, detectHeadPastStatus = false;

THREE.DeviceControls = function ( camera ) {

	// Use the method of THREE.PointerLockControls
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 1;
	yawObject.position.x = myStartX;
	yawObject.position.z = myStartZ;
	yawObject.add( pitchObject );

	//
	this.lookAtCenterQ = new THREE.Quaternion();

	//LOOKAT_CENTER_TWEAK SO HARD!
	var m1 = new THREE.Matrix4();
	var center = new THREE.Vector3(0,yawObject.position.y,0);
	m1.lookAt( yawObject.position, center, yawObject.up );

	if(thisIsTouchDevice)
		this.lookAtCenterQ.setFromRotationMatrix( m1 );
	else
		yawObject.quaternion.setFromRotationMatrix( m1 );


	var checkQ = Math.abs( Math.sin( yawObject.rotation.y / 2 ) - yawObject.quaternion.y );
	
	if( checkQ > 0.001 )
		quaternionChanged = true;

	//

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	this.moveSpeed = 0.12 / 4;
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
	this.orientationQuaternion = new THREE.Quaternion();
	this.finalQ = new THREE.Quaternion();

	this.screenOrientationQuaternion = new THREE.Quaternion();


	var quaternion = new THREE.Quaternion();
	var quaternionLerp = new THREE.Quaternion();

	var tempVector3 = new THREE.Vector3();
	var tempMatrix4 = new THREE.Matrix4();
	var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
	var tempQuaternion = new THREE.Quaternion();

	var zee = new THREE.Vector3(0, 0, 1);
	var up = new THREE.Vector3(0, 1, 0);
	var v0 = new THREE.Vector3(0, 0, 0);
	var euler = new THREE.Euler();
	var screenTransform = new THREE.Quaternion();
	var worldTransform = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
	var minusHalfAngle = 0;


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
		if (this.autoAlign) this.orientationQuaternion.copy(quaternion); // interpolation breaks the auto alignment
		else this.orientationQuaternion.copy(quaternionLerp);

		// camera looks out the back of the device, not the top
		this.orientationQuaternion.multiply(worldTransform);

		// adjust for screen orientation
		this.orientationQuaternion.multiply(screenTransform.setFromAxisAngle(zee, - this.orient));

		// this.finalQ.copy(this.lookAtCenterQ);
		this.finalQ.copy(this.alignQuaternion);
		this.finalQ.multiply(this.orientationQuaternion);


		// console.log( this.finalQ );
		
		// if (this.autoAlign && this.alpha !== 0) {
		// 		this.autoAlign = false;
		// 		this.align();
	 // 	}
	};

	this.align = function() {

		// tempVector3.set(0, 0, -1).applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );
		tempVector3.copy(yawObject.position).applyQuaternion( tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY' );
		
		// yawObject.position, center

		tempEuler.setFromQuaternion(
			tempQuaternion.setFromRotationMatrix(
				tempMatrix4.lookAt(tempVector3, v0, up)
			)
		);

		tempEuler.set(0, tempEuler.y, 0);
		this.alignQuaternion.setFromEuler(tempEuler);
	};

	//
	if( thisIsTouchDevice ) {
		// calculate the Quaternion
		this.calQ();
		
		if (this.autoAlign && this.alpha !== 0) {
			this.autoAlign = false;
			this.align();
 		}
 	}

	//

	var onMouseMove = function ( event ) {

		if ( this.enabled === false ) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
		mousemove = true;

		yawObject.rotation.y -= movementX * 0.001;
		pitchObject.rotation.x -= movementY * 0.001;
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		if( !thisIsTouchDevice ){
			var tempEuler = new THREE.Euler();
			tempEuler.set(pitchObject.rotation.x, yawObject.rotation.y, 0, 'YXZ');
			eyeFinalQ.setFromEuler(tempEuler);

			// console.log(yawObject.rotation.y / Math.PI * 180);
		}

		//TIMEOUT_detect mouse stop
			clearTimeout(mouseTimeOut);
			mouseTimeOut = setTimeout(function(){
				mouseActive = false;
			}, 50);		
	};

	var onMouseDown = function ( event ) {

		if ( this.enabled === false ) return;

		detectHeadStatus = true;

		setTimeout(function(){
			detectHeadStatus = false;
			detectHeadPastStatus = true;
		}, 1000);
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

		// detect head movment
		detectHeadStatus = true;

		setTimeout(function(){
			detectHeadStatus = false;
			detectHeadPastStatus = true;
		}, 1000);


	};


	var onTouchMove = function ( event ) {

		if (this.enabled === false) return;
		if (rotatable === false) return;

		console.log(worldBall.rotation.y / Math.PI * 180);

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

		//


	};

	var onTouchEnd = function ( event ) {
		touchActive = false;

		moveLeft = false;
		moveRight = false;
		moveBackward = false;
		moveForward = false;

		// take pic!
		var jarIndex = takePicTimes%jarsAmount;
		//v1
		// jars[jarIndex].material.map = jarTextures[jarIndex];
		//v2
		jars[jarIndex*3].material.map = jarTextures[jarIndex];
		jars[jarIndex*3+1].material.map = jarTextures[jarIndex];
		jars[jarIndex*3+2].material.map = jarTextures[jarIndex];

		currentPic.material.map = jarTextures[jarIndex];

		jarTextures[jarIndex].flipY = true;
		jarTextures[jarIndex].needsUpdate = true;

		takePicTimes++;

		// console.log("take pic #:" + jarIndex);

	};

	//

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
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

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

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

	//

	this.update = function ( delta ) {

		if (this.enabled === false) return;

		// DEVICE
		if (this.freeze) return;

		

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		// velocity.y -= 0.10 * delta;

		if ( moveForward ) velocity.z -= this.moveSpeed * delta;
		if ( moveBackward ) velocity.z += this.moveSpeed * delta;

		if ( moveLeft ) velocity.x -= this.moveSpeed * delta;
		if ( moveRight ) velocity.x += this.moveSpeed * delta;

		// if ( isOnObject === true ) {
		// 	velocity.y = Math.max( 0, velocity.y );
		// }


		// Rotate by Device
		if( thisIsTouchDevice ) {
			// calculate the Quaternion
			this.calQ();

			if (this.autoAlign && this.alpha !== 0) {
				this.autoAlign = false;
				this.align();
	 		}

			eyeFinalQ.copy( this.finalQ.clone() );
	 		yawObject.rotation.setFromQuaternion( this.finalQ );
	 	}
			


		// Rotate by Oculus
		/*
		if (vrstate) {
			var qq = new THREE.Quaternion(
			    vrstate.hmd.rotation[0],
			    vrstate.hmd.rotation[1],
			    vrstate.hmd.rotation[2],
			    vrstate.hmd.rotation[3]);
			yawObject.rotation.setFromQuaternion( qq );
		}
		*/
		//

		yawObject.translateY( velocity.y );
		yawObject.translateX( velocity.x );
		yawObject.translateZ( velocity.z );

		yawObject.position.y = 1;

		// if ( yawObject.position.y < 1 ) {
		// 	velocity.y = 0;
		// 	yawObject.position.y = 1;
		// 	canJump = true;
		// }
	};

	// //debug
	// window.addEventListener('click', (function(){
	//   this.align();
	// }).bind(this));

	

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
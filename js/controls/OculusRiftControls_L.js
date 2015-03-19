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
 * Based on THREE.PointerLockControls by mrdoob, and OculusRiftControls by benvanik
 * @author Laura
 */

THREE.OculusRiftControls = function ( camera ) {

	var scope = this;

	//

	//ORI
	var moveObject = new THREE.Object3D();
	moveObject.position.y = 10;
	// moveObject.add( camera );

	//MY
	var pitchObject = new THREE.Object3D();
	// pitchObject.rotation.x = -0.463;
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	// yawObject.position.x = 0.3;
	yawObject.position.y = 10;
	// yawObject.position.z = 6.94;
	yawObject.add( pitchObject );

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
	this.jumpSpeed = 10;

	var _q1 = new THREE.Quaternion();
	var axisX = new THREE.Vector3( 1, 0, 0 );
	var axisZ = new THREE.Vector3( 0, 0, 1 );

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		console.log(movementX, movementY);

		_q1.setFromAxisAngle( axisZ, movementX * 0.002 );
		moveObject.quaternion.multiply( _q1 );
		_q1.setFromAxisAngle( axisX, movementY * 0.002 );
		moveObject.quaternion.multiply( _q1 );
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
				if ( canJump === true ) velocity.y += this.jumpSpeed;
				canJump = false;
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

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		// return moveObject;
		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	//
	//MY_WHY_NOT_WORKIING????!!!!
	/*
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

	}();*/

	this.posX = function(){
		return yawObject.position.x;
	};

	this.posY = function(){
		return yawObject.position.y;
	};

	this.posZ = function(){
		return yawObject.position.z;
	};

	// this.rotX = function(){
	// 	return pitchObject.rotation.x;
	// };

	// this.rotY = function(){
	// 	return pitchObject.rotation.y;
	// };

	// this.rotZ = function(){
	// 	return pitchObject.rotation.z;
	// };

	this.rotX = function(){
		return yawObject.rotation.x;
	};

	this.rotY = function(){
		return yawObject.rotation.y;
	};

	this.rotZ = function(){
		return yawObject.rotation.z;
	};

	//

	this.update = function ( delta, vrstate ) {

		//if ( scope.enabled === false ) return;

		//
		// delta *= 0.1;
		delta = 0.1;

		// velocity.x += ( - velocity.x ) * 0.08 * delta;
		// velocity.z += ( - velocity.z ) * 0.08 * delta;

		// velocity.y -= 0.10 * delta;

		if ( moveForward ) velocity.z = -delta;
		else if ( moveBackward ) velocity.z = delta;
		else velocity.z = 0;

		if ( moveLeft ) velocity.x = -delta;
		else if ( moveRight ) velocity.x = delta;
		else velocity.x = 0;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		//ROTATION
		//ORI
		// var rotation = new THREE.Quaternion();
		// var angles = new THREE.Vector3();
		// if (vrstate) {
		// 	rotation.set(
		// 			vrstate.hmd.rotation[0],
		// 			vrstate.hmd.rotation[1],
		// 			vrstate.hmd.rotation[2],
		// 			vrstate.hmd.rotation[3]);
		// 	angles.setEulerFromQuaternion(rotation, 'XYZ');
		// 	angles.z = 0;
		// 	angles.normalize();
		// 	rotation.setFromEuler(angles, 'XYZ');
		// 	rotation.normalize();
		// 	// velocity.applyQuaternion(rotation);
		// }

		//

		//MY
		  if (vrstate) {
		    var qq = new THREE.Quaternion(
		        vrstate.hmd.rotation[0],
		        vrstate.hmd.rotation[1],
		        vrstate.hmd.rotation[2],
		        vrstate.hmd.rotation[3]);

		    // var roTemp = new THREE.Object3D();
		    // var rotMat = new THREE.Matrix4();
		    // rotMat.makeRotationFromQuaternion(qq);
		    // yawObject.quaternion = qq;


		    var roTemp = new THREE.Object3D();

		    yawObject.rotation.setFromQuaternion( qq );

		    // yawObject.rotation.y = roTemp.rotation.y;

			// pitchObject.rotation.x = roTemp.rotation.x;
			// pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		  }

		//

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y );
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 1 ) {

			velocity.y = 0;
			moveObject.position.y = 1;

			canJump = true;

		}

	};

};

/**
 * @original: mrdoob / http://mrdoob.com/
 * @author: jhclaura / http://jhclaura.com/
 */

var mouseActive = false, keyActive = false, touchActive = false;
var mouseTimeOut;

THREE.PointerLockControls = function ( camera ) {

	var scope = this;
	var rotatable = true;
	// var rotatable = false;

	// camera.position.set(0, 3.472, 6.94);
	//0,6,3
	// camera.rotation.set(-0.463,0,0);
	// camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	//
	// pitchObject.rotation.x = -0.463;
	//
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	//
	// yawObject.position.x = 0.3;
	yawObject.position.y = 1;
	yawObject.position.z = 22;
	//

	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();
	var move = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		mousemove = true;

		//
		yawObject.rotation.y -= movementX * 0.001;
		pitchObject.rotation.x -= movementY * 0.001;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		//

		//TIMEOUT_detect mouse stop
		clearTimeout(mouseTimeOut);
		mouseTimeOut = setTimeout(function(){
			mouseActive = false;
		}, 50);

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

			case 9: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;

		}

	};

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
			case 83: // s
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


	this.rotatable = function(){
		rotatable = true;
	};


	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

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

	this.posZ = function(){
		return yawObject.position.z;
	};

	this.position = function(){
		return yawObject.position;
	};

	this.rotX = function(){
		return pitchObject.rotation.x;
	};

	this.rotY = function(){
		return pitchObject.rotation.y;
	};

	this.rotZ = function(){
		return pitchObject.rotation.z;
	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var delta = 0.07;

		// velocity.x += ( - velocity.x ) * 0.08 * delta;
		// velocity.z += ( - velocity.z ) * 0.08 * delta;

		// velocity.y -= 0.25 * delta;

		if ( moveForward ) velocity.z = -delta;
		else if ( moveBackward ) velocity.z = delta;
		else velocity.z = 0;

		if ( moveLeft ) velocity.x = -delta;
		else if ( moveRight ) velocity.x = delta;
		else velocity.x = 0;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 1 ) {

			velocity.y = 0;
			yawObject.position.y = 1;

			canJump = true;

		}

	};

};

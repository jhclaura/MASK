/**
 * @author mrdoob / http://mrdoob.com/
 */


THREE.PointerLockControls = function ( cam ) {

	var scope = this;
	var rotatable = true;
	var camm = cam;

	var boarder = 24;

	var pitchObject = new THREE.Object3D();
	pitchObject.name = "pitchObject";
	pitchObject.add( camm );

	var yawObject = new THREE.Object3D();
	yawObject.name = "yawObject";

	//FOR_forest
	// yawObject.position.x = 100;
	// yawObject.position.z = 100;
	// yawObject.position.y = 3.5;

	//FOR_glitch
	// yawObject.position.x = 10;
	// yawObject.position.y = 3.5;

	//_Intro
	yawObject.position.x = 0;
	yawObject.position.y = 3.5;
	yawObject.position.z = 50;
	// yawObject.rotation.y = Math.PI;

	yawObject.add( pitchObject );



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


	//

	var onMouseMove = function ( event ) {

		if (scope.enabled === false) return;
		if (rotatable === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.001;
		pitchObject.rotation.x -= movementY * 0.001;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		////////////////////////////////////
		//FOR_RIVER_SCENE
		// pitchObject.rotation.x = Math.max( - PI_2*4/7, Math.min( PI_2*4/7, pitchObject.rotation.x ) );
		////////////////////////////////////


		// if(mySlippers)
		// 	console.log(mySlippers.position);

		// console.log( 'rotX: ' + pitchObject.rotation.x + ', rotZ: ' + pitchObject.rotation.z);
	};

	var onKeyDown = function ( event ) {

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

				// //JUMP
				// if ( canJump === true ) velocity.y += 1;
				// canJump = false;

				//TEXT
				show = true;
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

			case 32: // space
				//TEXT
				show = false;
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



	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		onObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

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

	this.position = function(){
		return yawObject.position;
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

	this.setPosition = function(newPosition){
		yawObject.position.copy(newPosition);
		// console.log(newPosition);
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

	this.rotation = function(){
		var rr = new THREE.Vector3(pitchObject.rotation.x, yawObject.rotation.y, pitchObject.rotation.z);
		return rr;
	};

	this.setRotation = function(newRotation){
		pitchObject.rotation.x = newRotation.x;
		yawObject.rotation.y = newRotation.y;
		pitchObject.rotation.z = newRotation.z;
	};

	this.dis = function(){
		return distance;
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

	this.update = function () {

		if ( scope.enabled === false ) return;
		// if ( start === false ) return;

		var time = performance.now();
		// var delta = 0.08;	//OCULUS
		var delta = 0.1;

		// velocity.x += ( - velocity.x ) * 0.08 * delta;
		// velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 1 * delta;

		if ( moveForward && !collisionF ) {
			velocity.z = -delta;
			count_F++;
		}
		else if ( moveBackward && !collisionB ) {
			velocity.z = delta;
			count_B++;
		}
		else 
			velocity.z = 0;

		if ( moveLeft && !collisionL ) {
			velocity.x = -delta;
			count_L++;
		}
		else if ( moveRight && !collisionR ) {
			velocity.x = delta;
			count_R++;
		}
		else 
			velocity.x = 0;

		//Position_translation!
		yawObject.translateY( velocity.y );
		// if(yawObject.position.x<=boarder && yawObject.position.x>=-boarder && yawObject.position.z<=boarder && yawObject.position.z>=-boarder){
			yawObject.translateX( velocity.x );
			yawObject.translateZ( velocity.z );
		// }

		// if(yawObject.position.x>boarder) yawObject.position.x = boarder;
		// if(yawObject.position.x<-boarder) yawObject.position.x = -boarder;
		// if(yawObject.position.z>boarder) yawObject.position.z = boarder;
		// if(yawObject.position.z<-boarder) yawObject.position.z = -boarder;

			
		//Position_height
		if ( yawObject.position.y < 3.5 ) {

			velocity.y = 0;
			yawObject.position.y = 3.5;

			canJump = true;

		}

	};

};

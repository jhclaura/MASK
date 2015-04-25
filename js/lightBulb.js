// Adapted from --> The Nature of Code, by Daniel Shiffman
// http://natureofcode.com

function LightBulb(x,y,z,texture){
	this.position = new THREE.Vector3(x, y, z);
	this.acceleration = new THREE.Vector3(0,0,0);
	this.velocity = new THREE.Vector3(0,0,0);

	this.r = 0.6;
	this.maxSpeed = 0.3;
	this.maxForce = 0.01;
	this.maxForceSelf = 0.0001;
	this.texture = texture;

	//this.spaceLimit = 100;

	this.neighbordist = 10;

	var lightDis = 10;

	this.separateSingleScalar = 0.1;
	this.arriveScalar = 1;

	//CREATE_LIGHT_BULBS
    this.bulbGeo = new THREE.SphereGeometry(0.5, 32, 32);
    this.mat = new THREE.MeshBasicMaterial( {color: 0xffef3b} );
    this.mesh = new THREE.Mesh(this.bulbGeo, this.mat);
    this.pointL = new THREE.PointLight( 0xffef3b, 0.5, lightDis );

    this.pointL.add(this.mesh);

	this.glowMat = new THREE.SpriteMaterial(
	      {
	        map: this.texture,
	        color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending
	      });
	this.glow = new THREE.Sprite(this.glowMat);
	// this.glow.scale.set(6.4, 6.4, 6.4);	//big
	this.glow.scale.set(3,3,3);	//big
	this.pointL.add(this.glow);

	this.pointL.position.copy(this.position);

	scene.add(this.pointL);

}

/*
Lightbulb.prototype.flock = function(lightbulbs) {
	var sep = this.separate(lightbulbs);
	var ali = this.align(lightbulbs);
	var coh = this.cohesion(lightbulbs);

	sep.multiplyScalar(1.5);
	ali.multiplyScalar(1.0);
	coh.multiplyScalar(1.0);

	this.applyForce(sep);
	this.applyForce(ali);
	this.applyForce(coh);
}
*/

LightBulb.prototype.update = function(){
	this.velocity.add(this.acceleration);
	this.velocity.clampScalar(-4,4);
	this.position.add(this.velocity);
	this.acceleration.multiplyScalar(0);

	// Bouncing
	// this.position.y += Math.cos(timeNow*10)*0.01;

	// update real lightBulb
	this.pointL.position.copy(this.position);
}

LightBulb.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

LightBulb.prototype.borders = function(spaceLimit, floor){
	if (this.position.x < -spaceLimit)  this.position.x = spaceLimit;
	if (this.position.z < -spaceLimit)  this.position.z = spaceLimit;
	if (this.position.x > spaceLimit) this.position.x = -spaceLimit;
	if (this.position.z > spaceLimit) this.position.z = -spaceLimit;

	if (this.position.y < floor) this.position.y = floor;
}

LightBulb.prototype.separate = function(lightbulbs) {

	var desiredseparation = this.r*2;
	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<desiredseparation) ){
			diff.subVectors(this.position, lightbulbs[i].position);
			diff.normalize();
			diff.divideScalar(d);
			sum.add(diff);
			count++;
		}
	}

	// average
	if(count>0){
		sum.divideScalar(count);
	}
	if(sum.length() > 0){
		sum.normalize();
		sum.multiplyScalar(this.maxSpeed);

		steer.subVectors(sum, this.velocity);
		steer.clampScalar(-500, this.maxForceSelf);

		// increase intensity
		// steer.multiplyScalar(1.5);

		this.applyForce(steer);
	}
}

LightBulb.prototype.separateSingle = function(lightbulbPos) {

	//var desiredseparation = this.r*40;	//onTheGround
	var desiredseparation = this.r*80;
	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	var d = this.position.distanceToSquared(lightbulbPos);
	
	if( (d<(desiredseparation*desiredseparation)) ){
		diff.subVectors(this.position, lightbulbPos);
		diff.normalize();
	}

	diff.normalize();
	diff.multiplyScalar(this.maxSpeed);

	steer.subVectors(diff, this.velocity);
	steer.clampScalar(-500, this.maxForceSelf);

	steer.multiplyScalar(this.separateSingleScalar);

	this.applyForce(steer);
// }
}

LightBulb.prototype.separateFromFloor = function(floor) {

	var desiredseparation = this.r*6;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	var d = this.position.y - floor.position.y;
	if( (d<desiredseparation) ){
		// diff.subVectors(this.position, floor.position);
		// diff.x = 0;
		// diff.z = 0;
		// diff.normalize();
		// diff.divideScalar(d);

		steer.y = 0.03;
	}

	// diff.normalize();
	// diff.multiplyScalar(this.maxSpeed);

	// steer.subVectors(diff, this.velocity);
	// steer.clampScalar(-500, this.maxForceSelf);

	// increase intensity
	// steer.multiplyScalar(15.0);

	this.applyForce(steer);
}

LightBulb.prototype.seek = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target.position(), this.position);

	desired.setLength(this.maxSpeed);

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	this.applyForce(steer);
}

LightBulb.prototype.returnSeek = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target, this.position);

	desired.setLength(this.maxSpeed);

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	return steer;
}

LightBulb.prototype.arrive = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target.position(), this.position);

	var d = desired.length();

	if(d<5.1) {
		//console.log("too close!");
		sample.trigger(0);
	}

	if(d<10){
		var m = map_range(d, 0, 100, 0, this.maxSpeed);
		desired.setLength(m);
	} else {
		desired.setLength(this.maxSpeed);
	}

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	steer.multiplyScalar(this.arriveScalar);
	this.applyForce(steer);
}

LightBulb.prototype.align = function(lightbulbs){
	
	var sum = new THREE.Vector3();
	var steer = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(lightbulbs[i].velocity);
			count++;
		}
	}

	if (count>0) {
		sum.divideScalar(count);
		sum.normalize();
		sum.multiplyScalar(this.maxSpeed);

		steer.subVectors(sum, this.velocity);
		steer.clampScalar(-500, this.maxForceSelf);
		
		steer.multiplyScalar(0.1);
		this.applyForce(steer);
	} else {
		var tmp = new THREE.Vector3();
		this.applyForce(tmp); 
	}
}

LightBulb.prototype.cohesion = function(lightbulbs) {

	var sum = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(lightbulbs[i].position);
			count++;
		}
	}

	if (count>0) {
		sum.divideScalar(count);
		var tmp = this.returnSeek(sum);

		tmp.multiplyScalar(0.1);
		this.applyForce(tmp);
	} else {
		var zeroV = new THREE.Vector3();
		this.applyForce(zeroV); 
	} 
}

LightBulb.prototype.setArriveScalar = function(strength) {
	this.arriveScalar = strength;
}

LightBulb.prototype.setSeparateSingleScalar = function(strength) {
	this.separateSingleScalar = strength;
}
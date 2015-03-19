
// DETECT
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var element = document.body;

////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect;
var controls, headLight;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;
var keyboard = new KeyboardState();
var nativePixelRatio = window.devicePixelRatio = window.devicePixelRatio ||
  Math.round(window.screen.availWidth / document.documentElement.clientWidth);

var devicePixelRatio = nativePixelRatio;

var littleMe, littleMeTex, littleMeTex2;
var myHead, myBody, myRA, myLA, myRL, myLL;
var myPosY;
var myStartX = 0, myStartZ = 0;

var ground, worldBall, room, roomTexture, roomWidth = 30, roomHeight = 60, roomDepth = 30;
var windowFrame, windowFrame2, windowFrameTexture, windowFrameTexture2, table, woodTexture, lamp, glowTexture;
var guy, guyHead, guyTexture, guyPicAnimator;

var dummy;

var dir, step;

// WAVE
	var timeWs = [
		Math.PI/2, Math.PI, -Math.PI/2, 0,
		Math.PI+0.3, -Math.PI/5, Math.PI/1.1
	];
	var frequencyW = 0.02;
	var amplitudeW = 0.05;
	var offsetW = 0;
	var sinWave;

// rayCast
	var objects = [];
	var ray;
	var projector, eyerayCaster;
	var lookDummy, lookVector;

// WEB_CAM
	var videoImageContext, videoTexture;
	var videoWidth = 480, videoHeight = 320;
	var tvTexture;
	var screens = [];
	var screensR = [];
	var scr;
	var tvs = [];
	var tvsR = [];
	var tvWidth;
	var eye, eyeGeo, eyeDummy, eyePos;
	var eyeGeoSmall;

	var remoteImageContext, remoteTexture;
	var otherEye, otherEyeGeo, otherEyeDummy, otherEyePos;
	var roundEyeGeo;

	var otherEyes=[], otherEyesPos=[], otherEyesRot=[];

	var videoImageScaleUpContext, videoScaleUpTexture, videoScaleMidTexture;

	var windows=[], windowScreens=[];
	var eyeLid, eyeLashUp, eyeLashDown, blinkInterval = [ 2000, 200, 200, 200, 1000 ];
	var timeoutID, timeoutID2, timeoutID3, timeoutID4;
	var eyeMove = false;


// duet Guys
	var firstGuy, firstGuyHead, secondGuy, secondGuyHead;
	var QforBodyRotation;
	var myScreen, remoteScreen;
	var changeView = false, pastChangeView = false;



//WEB_AUDIO_API
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 

	var audioContext = new AudioContext();
	var sample = new SoundsSample(audioContext);


///////////////////////////////////////////////////////////

init();

///////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
			
function init() 
{	
	//Prevent scrolling for Mobile
	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false); 

	time = Date.now();
	clock = new THREE.Clock();
	clock.start();

	dir = 1;
	step = dir*0.02;
	sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

	camRotDeg = new THREE.Vector3( 0,0,0 );

	// RENDERER
		container = document.getElementById('render-canvas');

		renderer = new THREE.WebGLRenderer({
			antialias: true, 
			alpha: true
		});
		renderer.setClearColor(0x000000, 1);
		// renderer.setPixelRatio( window.devicePixelRatio );	//add
		renderer.autoClear = false;
		// renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

	// EFFECT
		effect = new THREE.StereoEffect(renderer);
		effect.separation = 0.2;
	    effect.targetDistance = 50;
	    effect.setSize(window.innerWidth, window.innerHeight);


	// SCENE_SETUP
	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0xf1f1fb, 0.006 );

	// LIGHT
	light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	scene.add(light);

	// CAMERA
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

	// CONTROLS
		// controls = new THREE.DeviceControls(camera);
		controls = new THREE.DeviceControls(camera, true);
		scene.add( controls.getObject() );
		
		window.addEventListener('click', fullscreen, false);

	//TREE
	var tex = THREE.ImageUtils.loadTexture('images/tree.png');
	treeMat = new THREE.MeshLambertMaterial( {map: tex, color: 0xffff76} );
	loadmodelTree("models/trees.js", treeMat);


	// LIGHTBUG
		// geo = new THREE.SphereGeometry(2);
		// mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		// for(var i=0; i<lightBugsNum; i++){
		// 	var lightB = new THREE.Mesh(geo, mat);
		// 	scene.add(lightB);
		// 	lightBugs.push(lightB);

		// 	lightBugsFlyStatus.push( false );
		// }
		

	// MY_CAMERA
		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		videoImageContext.fillRect(0, 0, videoWidth, videoHeight);

		videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
		videoTexture.needsUpdate = true;

	// REMOTE_CAMERA
		remoteImageContext = remoteImage.getContext('2d');
		remoteImageContext.fillStyle = '0xffff00';
		remoteImageContext.fillRect(0,0,videoWidth, videoHeight);

		remoteTexture = new THREE.Texture( remoteImage );
		remoteTexture.minFilter = THREE.LinearFilter;
		remoteTexture.magFilter = THREE.LinearFilter;
		remoteTexture.format = THREE.RGBFormat;
		remoteTexture.generateMipmaps = false;

		remoteTexture.wrapS = remoteTexture.wrapT = THREE.ClampToEdgeWrapping;
		remoteTexture.needsUpdate = true;

		//		
		tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide });
		remoteMat = new THREE.MeshBasicMaterial({map: remoteTexture, overdraw: true, side: THREE.DoubleSide });
		//

		var eyeGeo = new THREE.PlaneGeometry(32, 24, 1, 1);
		eye = new THREE.Mesh(eyeGeo.clone(), tvMat);
		eye.position.z = -60;
		myScreen = new THREE.Object3D();
		myScreen.add(eye);
		scene.add(myScreen);

		var eyeR = new THREE.Mesh(eyeGeo.clone(), remoteMat);
		eyeR.position.z = -60;
		eyeR.position.y = 60;
		remoteScreen = new THREE.Object3D();
		remoteScreen.add(eyeR);
		scene.add(remoteScreen);



	var eyeRotMatrix;
	var eyeRotRadian;
	var tmpM, tmpM2;
	var tmpEyeGeo;


	// LAMP
		lamp = new THREE.Object3D();
		light = new THREE.PointLight(0xffff00, 1, 15);
		// geo = new THREE.SphereGeometry(0.2,6,6);
		// transY(geo, -1);
			glowTexture = new THREE.ImageUtils.loadTexture('images/glow_edit.png');
			mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
			meshTemp = new THREE.Sprite(mat);
			// meshTemp.position.y = -15;
			meshTemp.scale.set(2,2,2);	//big
		light.add(meshTemp);
		light.position.y = -30;
		lamp.add(light);
		lamp.position.set(-6,30,-12);
		scene.add(lamp);

	/*
	// guys in duet
		guyTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
		firstGuy = new THREE.Object3D();
		firstGuyHead = new THREE.Object3D();
		secondGuy = new THREE.Object3D();
		secondGuyHead = new THREE.Object3D();

		eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

		var loader = new THREE.JSONLoader( true );
		
		// v1
			loader.load( "models/Guy.js", function( geometry ) {

				// add body --> children[0]
				var fGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0xff0000 } ) );				
				firstGuy.add(fGuy);

				var sGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0x00ff00 } ) );
				secondGuy.add(sGuy);
				
			} );

			loader.load( "models/GuyH.js", function( geometryB ) {

				var fGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0xff0000 } ) );
				var eyeScreen = new THREE.Mesh( eyeGeo.clone(), tvMat );
				eyeScreen.position.y = 1;
				eyeScreen.position.z = 2;

				firstGuyHead.add(fGuy);
				firstGuyHead.add(eyeScreen);

				// add head --> children[1]
				firstGuy.add(firstGuyHead);
				firstGuy.position.set(0, 0, -7);
				scene.add( firstGuy );

				var sGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0x00ff00 } ) );
				eyeScreen = new THREE.Mesh( eyeGeo.clone(), remoteMat );
				eyeScreen.position.y = 1;
				eyeScreen.position.z = 2;

				secondGuyHead.add(sGuy);
				secondGuyHead.add(eyeScreen);

				secondGuy.add(secondGuyHead);
				secondGuy.position.set(0, 0, 7);
				scene.add( secondGuy );
			} );
	*/	

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);


	// window.addEventListener( 'deviceOrientation', setOrientationControls, true );
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', myKeyPressed, false );

	//
	animate();	
}


// GEOMETRY
function transX(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].x += n;
	}
}

function transZ(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].z += n;
	}
}

function transY(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].y += n;
	}
}

function scaleGeo(geo, s){
	for(var i=0; i<geo.vertices.length; i++){
		var gg = geo.vertices[i];
		// console.log(gg);
		gg.multiplyScalar(s);
	}
	geo.__dirtyVertices = true;
}

function loadModelRig (model, model_B, meshMat) {

	var loader = new THREE.JSONLoader();

	// //CORE
	// loader.load(model_B, function(geometryB, materialB){
	// 	bananaCore = new THREE.Mesh(geometryB, new THREE.MeshLambertMaterial({color: 0xffffff}));
	// 	bananaCore.scale.set(0.5,0.5,0.5);
	// 	console.log("bananaCore!");
	// }, "js");

	//PEEL
	loader.load(model, function(geometry, material){

		for (var i=0; i<material.length; i++) {
			var m = material[ i ];
			m.skinning = true;
		}

		for(var i=0; i<10; i++){
			// var cubeManMat = new THREE.MeshLambertMaterial ({color: 0xaaaa00, skinning: true});
			banana = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(material));

			banana.scale.set(100,100,100);
			// banana.add(bananaCore);

			baPeels.push(banana);
			console.log("banana!");

			baBone = banana.skeleton.bones;
			baBones.push(baBone);
		}

		//CORE
		loader.load(model_B, function(geometryB, materialB){

			for(var i=0; i<10; i++){
				bananaCore = new THREE.Mesh(geometryB, new THREE.MeshLambertMaterial({color: 0xffffff}));
				bananaCore.scale.set(0.5,0.5,0.5);
				bananaCore.position.set(Math.random()*20-10, 0, Math.random()*20-10);

				bananaCore.add(baPeels[i]);
				scene.add(bananaCore);
				bananas.push(bananaCore);

				// console.log("bananaCore!");
			}
		}, "js");
	}, "js");
}

function loadModelTerrain (model, meshMat) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		terrain = new THREE.Mesh(geometry, meshMat);
		scene.add(terrain);			
	}, "js");
}

function loadmodelTree (model, meshMat) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		trees = new THREE.Mesh(geometry, meshMat);
		scene.add(trees);			
	}, "js");
}


function loadModelScreen (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var mayaScreen = new THREE.Mesh(geometry, meshMat);
		scene.add(mayaScreen);			
		// scene.add(mayaScreen);
	}, "js");
}

function loadModelGuy (model, modelB, meshMat) {

	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry){
		guy = new THREE.Mesh(geometry, meshMat);
		guy.position.set(-3.5, 0.2, -14);
		guy.rotation.y=0.4;
		scene.add(guy);
		// mansion.add(guy);

		var loaderrr = new THREE.JSONLoader();
		loaderrr.load(modelB, function(geometryB){

			guyHead = new THREE.Mesh(geometryB, meshMat);
			// guy.add(guyHead);
			guyHead.position.set(-3.5, 0.2, -14);
			// guyHead.rotation.y=0.4;
			scene.add(guyHead);
			// mansion.add(guyHead);
		}, "js");
	}, "js");
}


function myKeyPressed (event) {

	switch ( event.keyCode ) {
		case 79: //O --> right leg
			sample.trigger(0, 1);
			break;

		case 80: //P --> left leg
			sample.trigger(1, 1);
			break;

		case 49: //O --> aniGuy swing
			standUp = false;
			jump = false;
			aniGuy.lookAt(camPos);
			break;

		case 50: //1 --> standUp
			standUp = true;
			jump = false;
			aniGuy.lookAt(camPos);
			break;

		case 51: //2 --> jump
			standUp = false;
			jump = true;
			aniGuy.lookAt(camPos);
			break;

		case 32: //space --> change view
			changeView = !changeView;
			break;

	}
}


function animate() 
{
    requestAnimationFrame(animate);
	update();
	render();
}

var swingSwitch = 0;
var camPos, camRot;

function update()
{	
	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight);

			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}
		}

		if(remote.readyState === remote.HAVE_ENOUGH_DATA){
			remoteImageContext.drawImage(remote, 0, 0, videoWidth, videoHeight);

			if(remoteTexture){
				remoteTexture.flipY = true;
				remoteTexture.needsUpdate = true;
			}
		}

	controls.update( Date.now() - time );
	stats.update();
	var dt = clock.getDelta();
	TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();


	// lamp
	// lamp.rotation.z = sinWave.run()/2;


	myScreen.rotation.setFromQuaternion( eyeFinalQ );
	myScreen.position.copy(camPos);

	remoteScreen.rotation.setFromQuaternion( eyeFinalQ );
	remoteScreen.position.copy(camPos);

	// exchange view
	if( changeView && !pastChangeView ) {
		new TWEEN.Tween(myScreen.children[0].position).to({y: 60}, 700).easing( TWEEN.Easing.Exponential.In).start();
		new TWEEN.Tween(remoteScreen.children[0].position).to({y: 0}, 700).easing( TWEEN.Easing.Exponential.In).start();
		pastChangeView = true;

		console.log("changed!");
	}
	if( !changeView && pastChangeView ) {
		new TWEEN.Tween(myScreen.children[0].position).to({y: 0}, 700).easing( TWEEN.Easing.Exponential.In).start();
		new TWEEN.Tween(remoteScreen.children[0].position).to({y: 60}, 700).easing( TWEEN.Easing.Exponential.In).start();
		pastChangeView = false;

		console.log("changed!");
	}

	//
	time = Date.now();

}

function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
}

function updatePlayer(playerIndex, playerLocX, playerLocZ, playerRotY, playerQ){

	// if(playerID<myID)
	// 	var index = playerID-1+storkPlayers.length;
	// else //playerID>myID
	// 	var index = playerID-2+storkPlayers.length-1;

	if(playerIndex==1){
		// firstGuy.position.x = playerLocX;
		// firstGuy.position.z = playerLocZ;

		// head
		firstGuy.children[1].rotation.setFromQuaternion( playerQ );
		
		// body
		// firstGuy.children[0].rotation.setFromQuaternion( playerQ );
		// firstGuy.children[0].rotation.x = 0;
		// firstGuy.children[0].rotation.z = 0;
		var ahhRotation = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );
		firstGuy.children[0].rotation.y = ahhRotation.y;

	}
	
	if(playerIndex==2){
		// secondGuy.position.x = playerLocX;
		// secondGuy.position.z = playerLocZ;

		//head
		secondGuy.children[1].rotation.setFromQuaternion( playerQ );

		//body
		var ahhRotation2 = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );
		secondGuy.children[0].rotation.y = ahhRotation2.y;
	}
}

// reference from jsfeat
// src: http://inspirit.github.io/jsfeat/sample_grayscale.html
function demo_app(vWidth, vHeight) {
    // canvasWidth  = canvas.width;
    // canvasHeight = canvas.height;
    // ctx = canvas.getContext('2d');

    // ctx.fillStyle = "rgb(0,255,0)";
    // ctx.strokeStyle = "rgb(0,255,0)";

    img_u8 = new jsfeat.matrix_t(vWidth, vHeight, jsfeat.U8_t | jsfeat.C1_t);

    // stat.add("grayscale");
}

// reference from stemkoski
// src: http://stemkoski.github.io/Three.js/Webcam-Motion-Detection-Texture.html
	function differenceAccuracy(target, data1, data2) {

	}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	if (devicePixelRatio) {
		renderer.devicePixelRatio = effect.devicePixelRatio = devicePixelRatio;
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
	effect.setSize(window.innerWidth, window.innerHeight);
}

function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}

function formatFloat(num, pos) {
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
}

// function built based on Stemkoski's
// http://stemkoski.github.io/Three.js/Texture-Animation.html
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, order) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;

	// order of the pic
	this.displayOrder = order;

		
	this.updateLaura = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;

			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;

			// console.log();

			var currentColumn = this.displayOrder[ this.currentTile ] % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.displayOrder[ this.currentTile ] / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};

	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;

			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;


			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;

			console.log('currentTile: ' + this.currentTile + ', offset.x: ' + texture.offset.x);
		}
	};
}	
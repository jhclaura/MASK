
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
// var myStartX = Math.random()*20, myStartZ = Math.random()*20;


var banana, bananaCore, bananaGeo, bananaMat, baBone;
var baBones=[], baPeels=[], bananas=[];

var rabbit, rabbitTexture, rabbits = [];

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
	var tvsets = [];
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

	var myScreens, remoteScreens, myFrames, remoteFrames;


// computer vision
	var debugImage, debugContext;
	var img_u8;
	var lightThreshold = 200;
	var marksArray = [];
	var lightBugs = [], lightBugsNum = 10, lightBugsFlyStatus = [], lightBugFlyCount = 0;

// aniGuy
	var aniGuy;
	var duration = 1600;
	var keyframes = 41 /*16*/, interpolation = duration / keyframes, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;

	var animOffset = 0, standUpOffset = 50, jumpOffset = 100;
	var standUp = false, jump = false;

// WHOLE HOUSE
	var mansion, houseMat, frameMat, tvMat, remoteMat;
	var houses=[], flyWindows=[], myWindow, remoteWindow, eyeWindow;
	var houseFiles = ["models/room/room_1.js", "models/room/room_2.js", "models/room/room_3.js",
					  "models/room/room_4.js", "models/room/room_5.js", "models/room/room_6.js"];
	var frameFiles = ["models/room/flyWindowFrame_1_down_v2.js", "models/room/flyWindowFrame_1_up.js",
					  "models/room/flyWindowFrame_2_down.js", "models/room/flyWindowFrame_2_up.js",
					  "models/room/flyWindowFrame_3_down.js", "models/room/flyWindowFrame_3_up.js",
					  "models/room/flyWindowFrame_4_down.js", "models/room/flyWindowFrame_4_up.js",
					  "models/room/flyWindowFrame_5_down.js", "models/room/flyWindowFrame_5_up.js",
					  "models/room/flyWindowFrame_6_down_v2.js", "models/room/flyWindowFrame_6_up.js"];
	var screenFiles = ["models/room/flyWindowScreen_1_down_v2.js", "models/room/flyWindowScreen_1_up.js",
					   "models/room/flyWindowScreen_2_down.js", "models/room/flyWindowScreen_2_up.js",
					   "models/room/flyWindowScreen_3_down.js", "models/room/flyWindowScreen_3_up.js",
					   "models/room/flyWindowScreen_4_down.js", "models/room/flyWindowScreen_4_up.js",
					   "models/room/flyWindowScreen_5_down.js", "models/room/flyWindowScreen_5_up.js",
					   "models/room/flyWindowScreen_6_down_v2.js", "models/room/flyWindowScreen_6_up.js"];
	var roomExploded = [], pastRoomExploded = [], windowExploded = [], pastWindowExploded = [];

	//v1
	// var explodeDirection = [new THREE.Vector3(0,-1,-1), new THREE.Vector3(0,1,-1), 
	// 						new THREE.Vector3(1,-1,-1), new THREE.Vector3(1,1,-1),
	// 						new THREE.Vector3(1,-1,1), new THREE.Vector3(1,1,1),
	// 						new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,1),
	// 						new THREE.Vector3(-1,-1,1), new THREE.Vector3(-1,1,1),
	// 						new THREE.Vector3(-1,-1,-1), new THREE.Vector3(-1,1,-1)];
	var explodeDirection = [new THREE.Vector3(0,0.5,-1), new THREE.Vector3(0,1,-1), 
							new THREE.Vector3(1.5,0.5,-1), new THREE.Vector3(1,1,-1),
							new THREE.Vector3(1.5,0.5,1), new THREE.Vector3(1,1,1),
							new THREE.Vector3(0,0.5,1), new THREE.Vector3(0,1,1),
							new THREE.Vector3(-1.5,0.5,1), new THREE.Vector3(-1,1,1),
							new THREE.Vector3(-1.5,0.5,-1), new THREE.Vector3(-1,1,-1)];
	var roomExplodeDirection = [new THREE.Vector3(0,0,-1), new THREE.Vector3(1,0,-1), new THREE.Vector3(1,0,1),
								new THREE.Vector3(0,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(-1,0,-1)];
	var tmpWindow;

	var trees, terrain, treeMat, terrainMat;
	var houseLocal, houseRemote, houseLocalMat, houseRemoteMat;



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
		renderer.setClearColor(0xf1f1fb, 1);
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
	scene.fog = new THREE.FogExp2( 0xf1f1fb, 0.006 );

	// LIGHT
	// light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	// scene.add(light);

	// light in the room
	light = new THREE.PointLight( 0xff983c, 1.5, 35 );		//old: 0xff673c
	light.position.set(0, 20, 0);
	scene.add(light);

	// light = new THREE.HemisphereLight(0xffffff, 0xf1f1fb, 1);
	// scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 1, 1);
	light.intensity = 0.7;
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 1, -1);
	light.intensity = 0.7;
	scene.add(light);



	headLight = new THREE.SpotLight(0xfdf646, 1);
	headLight.position.set(2.3, 3, 23);
	headLight.distance = 60;
	scene.add(headLight);


	// CAMERA
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

	// CONTROLS
		// controls = new THREE.DeviceControls(camera);
		controls = new THREE.DeviceControls(camera, true);
		scene.add( controls.getObject() );
		
		window.addEventListener('click', fullscreen, false);

		//
		// controls = new THREE.PointerLockControls(camera);
		// scene.add( controls.getObject() );
	// controls = new THREE.OrbitControls(camera);

	//TERRAIN
	terrainMat = new THREE.MeshLambertMaterial( {color: 0xf1f1fb, shading: THREE.FlatShading} );
	loadModelTerrain("models/terrain.js", terrainMat);
	//TREE
	var tex = THREE.ImageUtils.loadTexture('images/tree.png');
	treeMat = new THREE.MeshLambertMaterial( {map: tex} );
	loadmodelTree("models/trees.js", treeMat);

	// small houses
	tex = THREE.ImageUtils.loadTexture('images/smallHouse.png');
	houseLocalMat = new THREE.MeshLambertMaterial( {map: tex} );
	tex = THREE.ImageUtils.loadTexture('images/smallHouse_2.png');
	houseRemoteMat = new THREE.MeshLambertMaterial( {map: tex} );
	loadmodelHouse("models/houseLocal.js", "models/houseRemote.js", houseLocalMat, houseRemoteMat);


	// MANSION
	mansion = new THREE.Object3D();
	tex = THREE.ImageUtils.loadTexture('images/roomTexture.png');
	// var mat = new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide, shading: THREE.FlatShading });
	houseMat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide, shading: THREE.FlatShading });
	// loadModelScreen("models/room/room_1.js", mat);
	var loader = new THREE.JSONLoader( true );
	for(var i=0; i<houseFiles.length; i++){
		loader.load( houseFiles[i], function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, houseMat );
			houses.push(tmpR);
			scene.add(tmpR);
		} );
	}
		


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

		myWindow = new THREE.Object3D();
		remoteWindow = new THREE.Object3D();

		tex = THREE.ImageUtils.loadTexture('images/window01.png');
		frameMat = new THREE.MeshLambertMaterial({map: tex});

		tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
		remoteMat = new THREE.MeshBasicMaterial({map: remoteTexture, overdraw: true, side: THREE.DoubleSide});

		loader.load( "models/room/myWindowScreen_v2.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, tvMat );
			myWindow.add(tmpR);
		} );
		loader.load( "models/room/myWindowFrame_v2.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, frameMat );
			myWindow.add(tmpR);
		} );
		scene.add(myWindow);

		loader.load( "models/room/remoteWindowScreen.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, remoteMat );
			remoteWindow.add(tmpR);
		} );
		loader.load( "models/room/remoteWindowFrame.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, frameMat );
			remoteWindow.add(tmpR);
		} );
		scene.add(remoteWindow);

		// eye = new THREE.Mesh(eyeGeo.clone(), tvMat);
		// loader.load( "models/room/", function( geometry ) {
		// 	var tmpR = new THREE.Mesh( geometry, tvMat );
		// 	houses.push(tmpR);
		// 	scene.add(tmpR);
		// } );

			//
			// loadModelScreen("models/remoteScreens.js", remoteMat);

			var eyeRotMatrix;
			var eyeRotRadian;
			var tmpM, tmpM2;
			var tmpEyeGeo;

	// WINDOW_FRAME
		for(var i=0; i<6; i++){
			roomExploded.push(false);
			pastRoomExploded.push(false);
		}
		for(var i=0; i<12; i++){
			windowExploded.push(false);
			pastWindowExploded.push(false);
		}
		woodTexture = THREE.ImageUtils.loadTexture('images/wood.png');
		frameMat = new THREE.MeshLambertMaterial({map: woodTexture});

		// for(var i=0; i<frameFiles.length; i++){
			loadModelWindow(frameFiles[0], screenFiles[0], frameMat, tvMat);
			loadModelWindow(frameFiles[1], screenFiles[1], frameMat, tvMat);
			loadModelWindow(frameFiles[2], screenFiles[2], frameMat, tvMat);
			loadModelWindow(frameFiles[3], screenFiles[3], frameMat, tvMat);
			loadModelWindow(frameFiles[4], screenFiles[4], frameMat, tvMat);
			loadModelWindow(frameFiles[5], screenFiles[5], frameMat, tvMat);
			loadModelWindow(frameFiles[6], screenFiles[6], frameMat, tvMat);
			loadModelWindow(frameFiles[7], screenFiles[7], frameMat, tvMat);
			loadModelWindow(frameFiles[8], screenFiles[8], frameMat, tvMat);
			loadModelWindow(frameFiles[9], screenFiles[9], frameMat, tvMat);
			loadModelWindow(frameFiles[10], screenFiles[10], frameMat, tvMat);
			loadModelWindow(frameFiles[11], screenFiles[11], frameMat, tvMat);
		// }

		// for(var i=0; i<frameFiles.length; i++){
		// 	tmpWindow = new THREE.Object3D();

		// 	console.log("outside's " + i);

		// 	// var loader = new THREE.JSONLoader();
		// 	loader.load( frameFiles[i], function( geo ) {
		// 		var tmpR = new THREE.Mesh( geo, frameMat );
		// 		tmpWindow.add(tmpR);
		// 		console.log("create first " + i);
		// 	}, "js");

		// 	loader.load( screenFiles[i], function( geoB ) {
		// 		var tmpR = new THREE.Mesh( geoB, tvMat );
		// 		tmpWindow.add(tmpR);

		// 		flyWindows.push(tmpWindow);
		// 		console.log("create " + i);
		// 		scene.add(tmpWindow);
		// 	}, "js");

		// 	// setTimeout(function(){
				
		// 	// }, 500);
		// }


		// loadModelF("models/window01_uv.js", mat);
		// windowFrameTexture2 = THREE.ImageUtils.loadTexture('images/window02.png');
		// mat = new THREE.MeshLambertMaterial({map: windowFrameTexture2});
		// loadModelF2("models/window02_3.js", "models/eyeLong2.js", mat, tvMat);

	// TABLE
		geo = new THREE.BoxGeometry(9,0.7,3);
		table = new THREE.Mesh(geo, frameMat);
		// table.position.set(1.5, -4, -13.5);
		table.position.set(0, -1.5, -13.5);
		myWindow.add(table);

	// eyeLASH
		loadModelEye("models/eyeLid3.js", "models/eyeLashUp3.js", "models/eyeLashDown3.js", "models/eyeLong2.js", frameMat, tvMat);

	// LAMP
		lamp = new THREE.Object3D();

		geo = new THREE.TetrahedronGeometry(1.5);
		var meshTemp = new THREE.Mesh(geo, frameMat);
		meshTemp.rotation.x = -35 * Math.PI/180;
		meshTemp.rotation.z = 30 * Math.PI/180;
		meshTemp.position.y = -29.3;
		lamp.add(meshTemp);

		geo = new THREE.BoxGeometry(0.2,30,0.2);
		transY(geo, -14.5);
		meshTemp = new THREE.Mesh(geo, frameMat);
		lamp.add(meshTemp);

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

	// GUY
		guyTexture = THREE.ImageUtils.loadTexture('images/guyAni.png');
		guyPicAnimator = new TextureAnimator( guyTexture, 2, 1, 40, 30, [1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] );
		mat = new THREE.MeshBasicMaterial({map: guyTexture});
		loadModelGuy("models/GuySitForward.js", "models/GuySitForwardH.js", mat);

	// ANI_GUY
		guyTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
		var loader = new THREE.JSONLoader( true );
		loader.load( "models/aniGuy.js", function( geometry ) {
			aniGuy = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: guyTexture, morphTargets: true } ) );
			aniGuy.position.set(3, 0.4, 14.3);
			aniGuy.rotation.y = Math.PI;
			scene.add( aniGuy );
		} );

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

	// demo_app(videoImage.width, videoImage.height);

	//
	// scene.add(mansion);

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

function loadmodelHouse (model, modelB, meshMat, meshMatB) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		houseLocal = new THREE.Mesh(geometry, meshMat);
		houseLocal.position.z = -50;
		scene.add(houseLocal);			
	}, "js");
	loader.load(modelB, function(geometryB){
		houseRemote = new THREE.Mesh(geometryB, meshMatB);
		houseRemote.position.z = 50;
		scene.add(houseRemote);			
	}, "js");
}

function loadModelR (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){

		rabbit = new THREE.Mesh(geometry, meshMat);
		// rabbit.scale.set(rabbitScale,rabbitScale,rabbitScale);
		// rabbit.position.x = 20+60*(i+1);
		// rabbit.rotation.x = Math.PI/2;
		rabbit.rotation.y = Math.PI/2;

		rabbits.push(rabbit);
		scene.add(rabbit);			
	}, "js");
}

function loadModelWindow (model, modelB, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();

	var tWindow = new THREE.Object3D();

	loader.load(model, function(geometry){
		var tW = new THREE.Mesh(geometry, meshMat);
		tWindow.add(tW);
	}, "js");

	loader.load(modelB, function(geometryB){
		var tW2 = new THREE.Mesh(geometryB, meshMatB);
		tWindow.add(tW2);

		flyWindows.push(tWindow);
		scene.add(tWindow);		
	}, "js");
}

function loadModelF (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		windowFrame = new THREE.Mesh(geometry, meshMat);
		windowFrame.position.set(0,-3.5,-14.5);
		scene.add(windowFrame);		
		// mansion.add(windowFrame);	
	}, "js");
}

function loadModelF2 (model, model2, meshMat, meshMat2) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		windowFrame2 = new THREE.Mesh(geometry, meshMat);
		scene.add(windowFrame2);
		// mansion.add(windowFrame2);		
	}, "js");

	loader.load(model2, function(geometry){
		windowFrame2 = new THREE.Mesh(geometry, meshMat2);
		scene.add(windowFrame2);	
		// mansion.add(windowFrame2);		
	}, "js");
}

function loadModelEye (model, model2, model3, model4, meshMat, meshMat2) {

	var loader = new THREE.JSONLoader();
	eyeWindow = new THREE.Object3D();

	loader.load(model, function(geometry){
		eyeLid = new THREE.Mesh(geometry, meshMat);
		eyeWindow.add(eyeLid);
	}, "js");

	loader.load(model2, function(geometry){
		eyeLashUp = new THREE.Mesh(geometry, meshMat);
		eyeLashUp.position.y = 3;
		eyeWindow.add(eyeLashUp);		
	}, "js");

	loader.load(model3, function(geometry){
		eyeLashDown = new THREE.Mesh(geometry, meshMat);
		eyeLashDown.position.y = -1;
		eyeWindow.add(eyeLashDown);		
	}, "js");

	loader.load(model4, function(geometry){
		var eyeS = new THREE.Mesh(geometry, meshMat2);
		eyeWindow.add(eyeS);		
	}, "js");

	scene.add(eyeWindow);
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

		case 32: //space --> explode ROOM
			for(var i=0; i<roomExploded.length; i++){
				roomExploded[i] = !roomExploded[i];
			}
			for(var i=0; i<windowExploded.length; i++){
				windowExploded[i] = !windowExploded[i];
			}
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
	keyboard.update();
	stats.update();
	var dt = clock.getDelta();
	TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();

	//
	// eyeRay
		// var directionCam = controls.getDirection().clone();
		// eyerayCaster.set( controls.getObject().position.clone(), directionCam );
		// var eyeIntersects = eyerayCaster.intersectObject( worldBall, true );

		// if ( eyeIntersects.length > 0 ) {
		// 	eyeDummy.position.copy(eyeIntersects[ 0 ].point);
		// }

	// eye.rotation.setFromQuaternion( eyeFinalQ );

		// eyeGeo.verticesNeedUpdate = true;
		// eyeGeo.dynamic = true;


		// if( thisIsTouchDevice ) {
			// eye.rotation.setFromQuaternion( eyeFinalQ );
			// mansion.rotation.setFromQuaternion( eyeFinalQ );
		// }
		// else eye.rotation.copy( camRot );

		// eyePos.setFromMatrixPosition( eye.matrixWorld );

		// lightBugs[0].position.setFromMatrixPosition( eye.matrixWorld );
		// lightBugs[0].position.set( eyePos );

	// eye.position.copy(camPos);
	// mansion.position.copy(camPos);
	//

	// lamp
	lamp.rotation.z = sinWave.run()/2;

	// guy
	guyPicAnimator.updateLaura( 300*dt );
	if(guyHead)
		guyHead.lookAt(camPos);

	// EYELASH
	if(!eyeMove && eyeLashUp && eyeLashDown){
		new TWEEN.Tween(eyeLashUp.position).to({y: 0}, 50).start();
		new TWEEN.Tween(eyeLashDown.position).to({y: 0}, 50).start();

		timeoutID = setTimeout(function(){
			new TWEEN.Tween(eyeLashUp.position).to({y: 3}, 50).start();
			new TWEEN.Tween(eyeLashDown.position).to({y: -1}, 50).start();
		}, 51);

		if(Math.random()>0.3){
			timeoutID2 = setTimeout(function(){
				eyeMove = false;
			}, 4000);
		}else{
			timeoutID2 = setTimeout(function(){
				eyeMove = false;
				console.log("short");
			}, 2000);
		}

		eyeMove = true;
	}

	// ANI_GUY
		if(standUp) {
			downInf = false;
			upInf = false;
			animOffset = standUpOffset;

			if(!downInf && !upInf){
				if(influcence >= 0)
					influcence -= 0.1;
				if(influcence = 0)
					downInf = true;
			}
			if(downInf && !upInf){
				if(influcence <= 1)
					influcence += 0.1;
				if(influcence = 1)
					upInf = true;
			}
			// if(animOffset <= 50)
			// 	animOffset++;
		} else if(jump){

			animOffset = jumpOffset;

		} else {
			downInf = false;
			upInf = false;
			animOffset = 0;

			if(!downInf && !upInf){
				if(influcence >= 0)
					influcence -= 0.01;
				if(influcence = 0)
					downInf = true;
			}
			if(downInf && !upInf){
				if(influcence <= 1)
					influcence += 0.01;
				if(influcence = 1)
					upInf = true;
			}

			// if(animOffset >= 0)
			// 	animOffset--;
		}

		if ( aniGuy ) {

				// Alternate morph targets

				// time = Date.now() % duration + animOffset;
				// keyframe = Math.floor( time / interpolation ) + 1;
				time = Date.now() % duration;
				keyframe = Math.floor( time / interpolation ) + 1 + animOffset;
				// lastKeyframe = 50;
				// currentKeyframe = 50;

				if ( keyframe != currentKeyframe ) {

					aniGuy.morphTargetInfluences[ lastKeyframe ] = 0;
					aniGuy.morphTargetInfluences[ currentKeyframe ] = 1;
					aniGuy.morphTargetInfluences[ keyframe ] = 0;

					lastKeyframe = currentKeyframe;
					currentKeyframe = keyframe;

					// console.log( mesh.morphTargetInfluences );

				}

			// mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
			// mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
		}

	// explode room
		for(var i=0; i<flyWindows.length; i++){
			if(windowExploded[i] && !pastWindowExploded[i]){

				var dir = explodeDirection[i].clone().multiplyScalar(50);
				new TWEEN.Tween(flyWindows[i].position).to({x: dir.x, y: dir.y, z: dir.z}, 1000).easing( TWEEN.Easing.Exponential.In).start();

				pastWindowExploded[i] = true;
			}

			if(!windowExploded[i] && pastWindowExploded[i]){
				// flyWindows[i].position.set(0,0,0);
				new TWEEN.Tween(flyWindows[i].position).to({x: 0, y: 0, z: 0}, 1000).easing( TWEEN.Easing.Exponential.In).start();
				pastWindowExploded[i] = false;
			}
		}
		for(var i=0; i<houses.length; i++){
			if(roomExploded[i] && !pastRoomExploded[i]){

				var dir = roomExplodeDirection[i].clone().multiplyScalar(50);
				new TWEEN.Tween(houses[i].position).to({x: dir.x, y: dir.y, z: dir.z}, 1000).easing( TWEEN.Easing.Exponential.In).start();

				new TWEEN.Tween(houseLocal.position).to({z: 0}, 1000).easing( TWEEN.Easing.Exponential.In).start();
				new TWEEN.Tween(houseRemote.position).to({z: 0}, 1000).easing( TWEEN.Easing.Exponential.In).start();

				pastRoomExploded[i] = true;
			}

			if(!roomExploded[i] && pastRoomExploded[i]){
				// flyWindows[i].position.set(0,0,0);
				new TWEEN.Tween(houses[i].position).to({x: 0, y: 0, z: 0}, 1000).easing( TWEEN.Easing.Exponential.In).start();

				new TWEEN.Tween(houseLocal.position).to({z: -50}, 1000).easing( TWEEN.Easing.Exponential.In).start();
				new TWEEN.Tween(houseRemote.position).to({z: 50}, 1000).easing( TWEEN.Easing.Exponential.In).start();

				pastRoomExploded[i] = false;
			}
		}

	// eye followed when exploded
		// if(roomExploded[0]){
		// 	myWindow.rotation.setFromQuaternion( eyeFinalQ );
		// 	myWindow.position.copy(camPos);
		// }
		// else
		// 	myWindow.rotation.set(0,0,0);

	// headLight
		headLight.position.z = camPos.z + 3*(Math.cos(camRot.y));
		headLight.target.position.z = camPos.z;
		headLight.position.x = camPos.x + 3*(Math.sin(camRot.y));
		headLight.target.position.x = camPos.x;
		headLight.position.y = camPos.y - 5*(Math.sin(camRot.x));
		headLight.target.position.y = camPos.y;

	//
	time = Date.now();

}

function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
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
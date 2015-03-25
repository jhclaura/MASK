
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

	var remoteImageContexts = [], remoteTextures = [];

	var otherEye, otherEyeGeo, otherEyeDummy, otherEyePos;
	var roundEyeGeo;

	var otherEyes=[], otherEyesPos=[], otherEyesRot=[];

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


// Env
	var trees, terrain, treeMat, terrainMat;


// HIVE
	//v1
	/*
	var bigCellFiles = ["models/hive/mid_hive_1.js", "models/hive/mid_hive_2.js", "models/hive/mid_hive_3.js",
						"models/hive/mid_hive_4.js", "models/hive/mid_hive_5.js"];

	var smallCellFiles = ["models/hive/mass_hive_1.js", "models/hive/mass_hive_2.js", "models/hive/mass_hive_3.js",
						  "models/hive/mass_hive_4.js", "models/hive/mass_hive_5.js", "models/hive/mass_hive_6.js",
						  "models/hive/mass_hive_7.js", "models/hive/mass_hive_8.js", "models/hive/mass_hive_9.js",
						  "models/hive/mass_hive_10.js"];

	var cellFiles = [ "models/hive/mid_hive_1.js", "models/hive/mid_hive_2.js", "models/hive/mid_hive_3.js",
					  "models/hive/mid_hive_4.js", "models/hive/mid_hive_5.js", "models/hive/mass_hive_1.js",
					  "models/hive/mass_hive_2.js", "models/hive/mass_hive_3.js", "models/hive/mass_hive_4.js",
					  "models/hive/mass_hive_5.js", "models/hive/mass_hive_6.js", "models/hive/mass_hive_7.js",
					  "models/hive/mass_hive_8.js", "models/hive/mass_hive_9.js", "models/hive/mass_hive_10.js"];
	*/

	//v2
	var cellFiles = [ "models/hive_v3/h_b_0.js", "models/hive_v3/h_b_1.js", "models/hive_v3/h_b_2.js",
					  "models/hive_v3/h_b_3.js", "models/hive_v3/h_b_4.js", "models/hive_v3/h_m_0.js",
					  "models/hive_v3/h_m_1.js", "models/hive_v3/h_m_2.js", "models/hive_v3/h_m_3.js",
					  "models/hive_v3/h_m_4.js", "models/hive_v3/h_m_5.js", "models/hive_v3/h_m_6.js",
					  "models/hive_v3/h_m_7.js", "models/hive_v3/h_m_8.js", "models/hive_v3/h_m_9.js"];


	// var bigCellLocal, bigCellRemotes = [], smallCellRemotes = [];
	// var localMat, BigRemoteMats = [], smallRemoteMats = [];
	var cells = [], smallCells = [];
	var cellMats = [], smallCellMats = [];
	var beehive, beehiveMat;
	var bees = [], beeMat, pastBeeLocation = [], futureBeeLocation = [];
	var beeLightColors = [ 0xffbf00, 0xff6b00, 0xffc000, 0xffea00 ];



//WEB_AUDIO_API
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 

	var audioContext = new AudioContext();
	var sample = new SoundsSample(audioContext);


///////////////////////////////////////////////////////////

// init();

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
	// light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	// scene.add(light);

	// light in the room
	// light = new THREE.PointLight( 0xff983c, 1.5, 35 );		//old: 0xff673c
	// light.position.set(0, 20, 0);
	// scene.add(light);

	light = new THREE.DirectionalLight(0xff8000);
	light.position.set(0, 1, 1);
	light.intensity = 0.4;
	scene.add(light);

	light = new THREE.DirectionalLight(0xffeb00);
	light.position.set(0, 1, -1);
	light.intensity = 0.4;
	scene.add(light);

	// center ball
		// var sp = new THREE.SphereGeometry( 5, 16, 8 );
		// var mesh = new THREE.Mesh(sp, new THREE.MeshBasicMaterial( {color: 0x00ffff, shading: THREE.FlatShading} ));
		// scene.add(mesh);
	
	// beeLight

		//v1
		/*
		sp = new THREE.SphereGeometry( 0.5, 16, 8 );

		light = new THREE.PointLight(0xffbf00, 2, 20);
		light.add( new THREE.Mesh(sp, new THREE.MeshBasicMaterial( {color: 0xffbf00, shading: THREE.FlatShading} )) );
		beeLights.push(light);
		scene.add(light);

		light = new THREE.PointLight(0xff6b00, 2, 20);
		light.add( new THREE.Mesh(sp, new THREE.MeshBasicMaterial( {color: 0xff6b00, shading: THREE.FlatShading} )) );
		beeLights.push(light);
		scene.add(light);

		light = new THREE.PointLight(0xffc000, 2, 20);
		light.add( new THREE.Mesh(sp, new THREE.MeshBasicMaterial( {color: 0xffc000, shading: THREE.FlatShading} )) );
		beeLights.push(light);
		scene.add(light);

		light = new THREE.PointLight(0xffea00, 2, 20);
		light.add( new THREE.Mesh(sp, new THREE.MeshBasicMaterial( {color: 0xffea00, shading: THREE.FlatShading} )) );
		beeLights.push(light);
		scene.add(light);
		*/

		//v2
		var tex = THREE.ImageUtils.loadTexture('images/bee.png');
		beeMat = new THREE.MeshBasicMaterial( {map: tex, shading: THREE.FlatShading} );
		for(var i=0; i<8; i++){
			loadModelBee( 'models/bee.js', beeMat);
			pastBeeLocation.push( new THREE.Vector3() );
			futureBeeLocation.push( new THREE.Vector3() );
		}

	// headLight = new THREE.SpotLight(0xfdf646, 1);
	// headLight.position.set(2.3, 3, 23);
	// headLight.distance = 60;
	// scene.add(headLight);


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
	// terrainMat = new THREE.MeshLambertMaterial( {color: 0xf1f1fb, shading: THREE.FlatShading} );
	// loadModelTerrain("models/terrain.js", terrainMat);
	//TREE
	tex = THREE.ImageUtils.loadTexture('images/tree.png');
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
		for (var i=0; i<remoteImages.length; i++){
			var rImgContext = remoteImages[i].getContext('2d');
			rImgContext.fillStyle = '0xffff00';
			rImgContext.fillRect(0,0,videoWidth, videoHeight);

			remoteImageContexts.push(rImgContext);

			var rTexture = new THREE.Texture( remoteImages[i] );
			rTexture.minFilter = THREE.LinearFilter;
			rTexture.magFilter = THREE.LinearFilter;
			rTexture.format = THREE.RGBFormat;
			rTexture.generateMipmaps = false;

			rTexture.wrapS = rTexture.wrapT = THREE.ClampToEdgeWrapping;
			rTexture.needsUpdate = true;

			remoteTextures.push(rTexture);
		}

	
	// v1
	/*
	// Camera Material

		// BIG CELLS
		for (var i=0; i<bigCellFiles.length; i++){

			var myIndex = whoIamInHive-1;

			// if it's local (whoIamInHive-1) --> localCam
			// e.g. whoIamInHive_#4 --> assign videoTexture --> cellMats_#3
			if ( i==myIndex ) {

				var rMat = new THREE.MeshBasicMaterial({color: 0xff0000, map: videoTexture, overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				console.log(i);

			// if it's remote --> remoteCam
			// if whoIamInHive==5, i here will be 0~3, can safely use remoteTextures
			} else if ( i<myIndex ) {
				// console.log("i: " + i);

				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[i], overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				console.log(i);

			} else {
				var ahhhIndex = i-1;
				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[ahhhIndex], overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				console.log(i + 'hmm');
			}
		}

		// small cells
		for (var i=0; i<smallCellFiles.length; i++){

			var myIndex = whoIamInHive-1;

			// e.g. myIndex = 5 --> i shoud be (i+5)
			if ( (i+5)==myIndex ) {
				console.log('create smallCellMat #' + i + ', which is whoIamInHive: ' + whoIamInHive);
				var mat = new THREE.MeshBasicMaterial({color: 0xff0000, map: videoTexture, overdraw: true, side: THREE.DoubleSide });
				smallCellMats.push(rMat);
			} else {
				var mat = new THREE.MeshBasicMaterial({color: 0x69f7df, overdraw: true, side: THREE.DoubleSide });
				smallCellMats.push(mat);
			}
		}

	// HIVES
		// BIG CELLS
			for(var i=0; i<bigCellFiles.length; i++){
				loadModelBCell(bigCellFiles[i], cellMats[i]);
			}

		// SMALL CELLS
			for(var i=0; i<smallCellFiles.length; i++){
				loadModelSCell(smallCellFiles[i], smallCellMats[i]);
			}
	*/

	// v2
	// Hive Material
		for (var i=0; i<cellFiles.length; i++){

			var myIndex = whoIamInHive-1;

			// if it's local (whoIamInHive-1) --> localCam
			// e.g. whoIamInHive_#15 --> assign videoTexture --> cellMats_#14
			// e.g. whoIamInHive_#4  --> assign videoTexture --> cellMats_#3
			if ( i==myIndex ) {

				var rMat = new THREE.MeshBasicMaterial({color: 0xff0000, map: videoTexture, overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				// console.log(i);

			// if it's remote --> remoteCam
			// because remoteTextures.lenght == 14, there's no remoteTextures[14]
			// so as long as i is smaller than myIndex, it's safe to use remoteTextures[i]
			} else if ( i<myIndex ) {
				// console.log("i: " + i);

				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[i], overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				// console.log(i);

			} else {
				var ahhhIndex = i-1;
				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[ahhhIndex], overdraw: true, side: THREE.DoubleSide });
				cellMats.push(rMat);
				// console.log(i + 'hmm');
			}
		}

	// HIVES
		// BIG CELLS
			for(var i=0; i<cellFiles.length; i++){
				loadModelBCell(cellFiles[i], cellMats[i]);
			}
		// beehive
			tex = THREE.ImageUtils.loadTexture('images/hive_v3.png');
			beehiveMat = new THREE.MeshLambertMaterial( {map: tex, transparent: true, alphaTest: 0.5, side:THREE.DoubleSide, color: 0xffff00 } );
			loadModelHive("models/beehive.js", beehiveMat);


	var eyeRotMatrix;
	var eyeRotRadian;
	var tmpM, tmpM2;
	var tmpEyeGeo;


	// LAMP
		lamp = new THREE.Object3D();

		woodTexture = THREE.ImageUtils.loadTexture('images/beeMic.png');
		frameMat = new THREE.MeshBasicMaterial({map: woodTexture, wireframe: true});

		var loader = new THREE.JSONLoader( true );
		loader.load( "models/beeMic.js", function( geometry ) {
			var meshTemp = new THREE.Mesh(geometry, frameMat);
			meshTemp.scale.set(4,4,4);
			meshTemp.position.y = -29.6;
			lamp.add(meshTemp);
		} );

		// geo = new THREE.BoxGeometry(1,2,1);
		// var meshTemp = new THREE.Mesh(geo, frameMat);
		// meshTemp.position.y = -29.6;
		// lamp.add(meshTemp);

		geo = new THREE.BoxGeometry(0.1,60,0.1);
		transY(geo, 0.2);
		meshTemp = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: 0xffff00}));
		lamp.add(meshTemp);

		light = new THREE.PointLight(0xffff00, 1, 30);
		// geo = new THREE.SphereGeometry(0.2,6,6);
		// transY(geo, -1);
			glowTexture = new THREE.ImageUtils.loadTexture('images/glow_edit.png');
			mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
			meshTemp = new THREE.Sprite(mat);
			// meshTemp.position.y = -15;
			meshTemp.scale.set(4,4,4);	//big
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

function loadModelBCell (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var bCell = new THREE.Mesh(geometry, meshMat);
		bCell.position.y += 15;
		scene.add(bCell);			
		cells.push(bCell);
	}, "js");
}

function loadModelHive (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		beehive = new THREE.Mesh(geometry, meshMat);
		beehive.position.y += 15;
		scene.add(beehive);			
		// scene.add(mayaScreen);
	}, "js");
}


function loadModelBee (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var bb = new THREE.Object3D();
		var bLight = new THREE.PointLight( beeLightColors[i], 2, 20);
		var bbM = new THREE.Mesh(geometry, meshMat);
		bbM.scale.set(4,4,4);
		// bbM.rotation.y = Math.PI;
		bb.add(bLight);
		bb.add(bbM);

		scene.add(bb);			
		bees.push(bb);
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

			// console.log("update!");
		}

		for (var i=0; i<remotes.length; i++) {
			if(remotes[i].readyState === remotes[i].HAVE_ENOUGH_DATA){
				remoteImageContexts[i].drawImage(remotes[i], 0, 0, videoWidth, videoHeight);

				if(remoteTextures[i]){
					remoteTextures[i].flipY = true;
					remoteTextures[i].needsUpdate = true;
				}
			}
		}

		// small cells
		// for (var i=0; i<massRemotes.length; i++) {
		// 	if(massRemotes[i].readyState === massRemotes[i].HAVE_ENOUGH_DATA){
		// 		var newIndex = i+4;
		// 		remoteImageContexts[newIndex].drawImage(massRemotes[i], 0, 0, videoWidth, videoHeight);

		// 		if(remoteTextures[newIndex]){
		// 			remoteTextures[newIndex].flipY = true;
		// 			remoteTextures[newIndex].needsUpdate = true;
		// 		}
		// 	}
		// }
		
	controls.update( Date.now() - time );
	stats.update();
	var dt = clock.getDelta();
	TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();

	// lamp
	lamp.rotation.z = sinWave.run()/2;
	lamp.children[1].position.y = -29+lamp.rotation.z*40;


	// firstGuy.rotation.setFromQuaternion( eyeFinalQ );


	// eye followed when exploded
		// if(roomExploded[0]){
		// 	myWindow.rotation.setFromQuaternion( eyeFinalQ );
		// 	myWindow.position.copy(camPos);
		// }
		// else
		// 	myWindow.rotation.set(0,0,0);

	// headLight
		// headLight.position.z = camPos.z + 3*(Math.cos(camRot.y));
		// headLight.target.position.z = camPos.z;
		// headLight.position.x = camPos.x + 3*(Math.sin(camRot.y));
		// headLight.target.position.x = camPos.x;
		// headLight.position.y = camPos.y - 5*(Math.sin(camRot.x));
		// headLight.target.position.y = camPos.y;

	// beeLight
		for(var i=0; i<bees.length; i++){
			bees[i].position.x = Math.sin( time*(4-i/2)*0.7*0.0004 ) *40;
			bees[i].position.y = Math.cos( time*  i  *0.5*0.0004 ) *30;
			bees[i].position.z = Math.cos( time*(i/2+4)*0.3*0.0004 ) *40;

			futureBeeLocation[i].x = Math.sin( (time+30)*(4-i/2)*0.7*0.0004 ) *40;
			futureBeeLocation[i].y = Math.cos( (time+30)*  i  *0.5*0.0004 ) *30;
			futureBeeLocation[i].z = Math.cos( (time+30)*(i/2+4)*0.3*0.0004 ) *40;

			bees[i].lookAt( futureBeeLocation[i] );
		}

	//
	time = Date.now();

}

function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
}

function updateSmallCellTexture( vidIndex ) {
	var vIndex = vidIndex - (bigCellFiles.length + 1);

	var sImgContext = massRemoteImages[vIndex].getContext('2d');
	sImgContext.fillStyle = '0xffff00';
	sImgContext.fillRect(0,0,videoWidth, videoHeight);

	remoteImageContexts.push(sImgContext);

	var sTexture = new THREE.Texture(  massRemoteImages[vIndex] );
	sTexture.minFilter = THREE.LinearFilter;
	sTexture.magFilter = THREE.LinearFilter;
	sTexture.format = THREE.RGBFormat;
	sTexture.generateMipmaps = false;

	sTexture.wrapS = sTexture.wrapT = THREE.ClampToEdgeWrapping;
	sTexture.needsUpdate = true;

	remoteTextures.push(sTexture);

	smallCellMats[vIndex].map = remoteTextures;
	smallCellMats[vIndex].map.needsUpdate = true;

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
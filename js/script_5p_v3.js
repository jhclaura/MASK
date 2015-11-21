
// DETECT
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var element = document.body;

//PointerLockControls
	var pointerControls, dateTime = Date.now();
	var objects = [];
	var rays = [];
	var blocker = document.getElementById('blocker');
	var instructions = document.getElementById('instructions');

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

	var havePointerLock = 
				'pointerLockElement' in document || 
				'mozPointerLockElement' in document || 
				'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		// console.log("havePointerLock");

		var element = document.body;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				console.log("enable pointerControls");

				controls.enabled = true;
				blocker.style.display = 'none';

			} else {

				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';
			}

		}

		var pointerlockerror = function(event){
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );


		if(isTouchDevice()) {
			console.log("isTouchDevice");
			

			instructions.addEventListener( 'touchend', funToCall, false );
		} else {
			instructions.addEventListener( 'click', funToCall, false );
		}


	} else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	function isTouchDevice() { 
		return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
	}

	function funToCall(event){

		console.log("click or touch!");

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		controls.enabled = true;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}
	}


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
var myStartX = 0, myStartZ = 0, myStartY = 2;
var worldCenter;

var ground, worldBall;
var woodTexture, lamp, glowTexture;
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
	var remoteImageContexts = [], remoteTextures = [];
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

	var trees, terrain, treeMat, terrainMat;
	var houseLocal, houseRemote, houseLocalMat, houseRemoteMat;

// Guysss
	var firstGuy, firstGuyHead, secondGuy, secondGuyHead;
	var guys = [], guysHeads = [], guysRAs = [], guysLAs = [];
	var gguy, gguyBody, gguyHead, guyHandHight = false;
	var QforBodyRotation;
	var camMats = [];
	var guyColors = [ 0xff0000, 0x0000ff, 0x00ffff, 0xffff00, 0x00ff00 ];
	var guyPositions = [ new THREE.Vector3(0,0,-7), new THREE.Vector3(4.5,0,-1.5), 
						 new THREE.Vector3(3,0,4), new THREE.Vector3(-3,0,4), new THREE.Vector3(-4.5,0,-1.5) ];
	var connections = [], connectMat;
	var connectFiles = [ "models/connect/c_0.js", "models/connect/c_1.js", "models/connect/c_2.js", "models/connect/c_3.js",
					     "models/connect/c_4.js", "models/connect/c_5.js", "models/connect/c_6.js",
					     "models/connect/c_7.js", "models/connect/c_8.js", "models/connect/c_9.js" ];

// touches
	var touches = [], threePTouch = false, fourPplTouch = false, fivePplTouch = false, touchCount = 0, touchPastStatus = [];
	var touchLabels = [ 'AB', 'AC', 'AD', 'AE', 'BC', 'BD', 'BE', 'CD', 'CE', 'DE' ];
	var touchStatus = [];
	
	var lightbulbLight, lightbulbs = [], money, starTextures = [], stars = [], starAnimators = [], starSources = [];
	var grasses = [], grassBones = [], grassMat;
	var banana, bananaCore, bananaGeo, bananaMat, baBone, baBones=[], baPeels=[], bananas=[];
	var stripe, stripes=[], stripeMats = [], rainbowGeo, rainbowMat, rainbows = [], donut, cookie, food = [], wave;
	var starFiles = [ "images/sStar_1.png", "images/sStar_2.png", "images/sStar_4.png" ];

	var wave, durationW = 1200, keyframeW = 18, interpolationW = durationW / keyframeW, interpolationW2 = durationW / (keyframeW-1);
	var lastKeyframeW = 0, currentKeyframeW = 0, animOffsetW = 0;

	var horse, resetHorse = false, horseWalking = false, durationH = 1200, keyframeH = 39, gogoHorse = false;
	var timeH, interpolationH = durationH / keyframeH, interpolationH2 = durationH / (keyframeH-1);
	var lastKeyframeH = 0, currentKeyframeH = 0, animOffsetH = 0;

	var bgColor = new THREE.Color( 0,0,0 ), tmpBgColor = new THREE.Color( 0,0,0 );
	var sampleIndex = 0, triggerSources = [];

	var dancingFrank = [], frank, frankMat, totalFrankGeom, totalFrankMats = [];
	var frankFiles = [ "models/frank/f_1.js", "models/frank/f_2.js", "models/frank/f_3.js", "models/frank/f_4.js",
					   "models/frank/f_5.js", "models/frank/f_6.js", "models/frank/f_7.js", "models/frank/f_8.js",
					   "models/frank/f_9.js", "models/frank/f_10.js", "models/frank/f_11.js", "models/frank/f_12.js" ];
	//STROBE_LIGHT
	var coverElement, delay = 0;
	var canvasStrobe, canvasContext;
	var myBody;
	var strobeLightOn = false;




//WEB_AUDIO_API
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 

	var audioContext = new AudioContext();
	var sample = new SoundsSample(audioContext);
	var bufferLoader, audioAllLoaded = false;
	var audioSources = [], gainNodes = [];


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

	// web audio api
		// bufferLoader = new BufferLoader(
		// 	audioContext, [ '../audios/5p/crackles.mp3',
		// 				    '../audios/5p/frank_layAnEgg.mp3' ], 
		// 			  finishedLoading
		// );
		// bufferLoader.load();

	worldCenter = new THREE.Vector3(0,0,0);

	time = Date.now();
	clock = new THREE.Clock();
	clock.start();

	dir = 1;
	step = dir*0.02;
	sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

	camRotDeg = new THREE.Vector3( 0,0,0 );

	// RENDERER
		container = document.getElementById('render-canvas');
		// container = document.createElement( 'div' );
		// document.body.appendChild( container );

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

	// light in the room
	// light = new THREE.PointLight( 0xff983c, 1.5, 35 );		//old: 0xff673c
	// light.position.set(0, 20, 0);
	// scene.add(light);

	// light = new THREE.DirectionalLight(0xffffff);
	// light.position.set(0, 1, 1);
	// light.intensity = 0.7;
	// scene.add(light);

	// light = new THREE.DirectionalLight(0xffffff);
	// light.position.set(0, 1, -1);
	// light.intensity = 0.7;
	// scene.add(light);

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
		//v1
			// remoteImageContext = remoteImage.getContext('2d');
			// remoteImageContext.fillStyle = '0xffff00';
			// remoteImageContext.fillRect(0,0,videoWidth, videoHeight);

			// remoteTexture = new THREE.Texture( remoteImage );
			// remoteTexture.minFilter = THREE.LinearFilter;
			// remoteTexture.magFilter = THREE.LinearFilter;
			// remoteTexture.format = THREE.RGBFormat;
			// remoteTexture.generateMipmaps = false;

			// remoteTexture.wrapS = remoteTexture.wrapT = THREE.ClampToEdgeWrapping;
			// remoteTexture.needsUpdate = true;

		//v2
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


	// Camera Material
		for (var i=0; i<5; i++){

			var myIndex = whoIamInMask-1;

			// if it's local (whoIamInHive-1) --> localCam
			// e.g. whoIamInHive_#15 --> assign videoTexture --> cellMats_#14
			// e.g. whoIamInHive_#4  --> assign videoTexture --> cellMats_#3
			if ( i==myIndex ) {

				var rMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide });
				rMat.name = "local";
				camMats.push(rMat);
				// console.log(i);

			// if it's remote --> remoteCam
			// because remoteTextures.lenght == 5, there's no remoteTextures[5] --> max: remoteTextures[4]
			// so as long as i is smaller than myIndex, it's safe to use remoteTextures[i]
			} else if ( i<myIndex ) {
				// console.log("i: " + i);

				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[i], overdraw: true, side: THREE.DoubleSide });
				rMat.name = "remote";
				camMats.push(rMat);
				// console.log(i);

			} else {
				var ahhhIndex = i-1;
				var rMat = new THREE.MeshBasicMaterial({map: remoteTextures[ahhhIndex], overdraw: true, side: THREE.DoubleSide });
				rMat.name = "remote";
				camMats.push(rMat);
				// console.log(i + 'hmm');
			}
		}

	var eyeRotMatrix;
	var eyeRotRadian;
	var tmpM, tmpM2;
	var tmpEyeGeo;


	// LAMP
		// lamp = new THREE.Object3D();

		// woodTexture = THREE.ImageUtils.loadTexture('images/wood.png');
		// frameMat = new THREE.MeshLambertMaterial({map: woodTexture});

		// geo = new THREE.TetrahedronGeometry(1.5);
		// var meshTemp = new THREE.Mesh(geo, frameMat);
		// meshTemp.rotation.x = -35 * Math.PI/180;
		// meshTemp.rotation.z = 30 * Math.PI/180;
		// meshTemp.position.y = -29.3;
		// lamp.add(meshTemp);

		// geo = new THREE.BoxGeometry(0.2,30,0.2);
		// transY(geo, -14.5);
		// meshTemp = new THREE.Mesh(geo, frameMat);
		// lamp.add(meshTemp);

		// light = new THREE.PointLight(0xffff00, 1, 15);
		// // geo = new THREE.SphereGeometry(0.2,6,6);
		// // transY(geo, -1);
		// 	glowTexture = new THREE.ImageUtils.loadTexture('images/glow_edit.png');
		// 	mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		// 	meshTemp = new THREE.Sprite(mat);
		// 	// meshTemp.position.y = -15;
		// 	meshTemp.scale.set(2,2,2);	//big
		// light.add(meshTemp);
		// light.position.y = -30;
		// lamp.add(light);
		// lamp.position.set(-6,30,-12);
		// scene.add(lamp);

	// guys in duet
		//v1
			// guyTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
			// firstGuy = new THREE.Object3D();
			// firstGuyHead = new THREE.Object3D();
			// secondGuy = new THREE.Object3D();
			// secondGuyHead = new THREE.Object3D();

			// eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

			// var loader = new THREE.JSONLoader( true );
			// loader.load( "models/Guy.js", function( geometry ) {

			// 	// add body --> children[0]
			// 	var fGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0xff0000 } ) );				
			// 	firstGuy.add(fGuy);

			// 	var sGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0x00ff00 } ) );
			// 	secondGuy.add(sGuy);
				
			// } );

			// loader.load( "models/GuyH.js", function( geometryB ) {

			// 	var fGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0xff0000 } ) );
			// 	var eyeScreen = new THREE.Mesh( eyeGeo.clone(), tvMat );
			// 	eyeScreen.position.y = 1;
			// 	eyeScreen.position.z = 2;

			// 	firstGuyHead.add(fGuy);
			// 	firstGuyHead.add(eyeScreen);

			// 	// add head --> children[1]
			// 	firstGuy.add(firstGuyHead);
			// 	firstGuy.position.set(0, 0, -7);
			// 	scene.add( firstGuy );

			// 	var sGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshBasicMaterial( { map: guyTexture, color: 0x00ff00 } ) );
			// 	eyeScreen = new THREE.Mesh( eyeGeo.clone(), remoteMat );
			// 	eyeScreen.position.y = 1;
			// 	eyeScreen.position.z = 2;

			// 	secondGuyHead.add(sGuy);
			// 	secondGuyHead.add(eyeScreen);

			// 	secondGuy.add(secondGuyHead);
			// 	secondGuy.position.set(0, 0, 7);
			// 	scene.add( secondGuy );
			// } );

		//v2
			gguy = new THREE.Object3D();
			gguyBody = new THREE.Object3D();
			gguyHead = new THREE.Object3D();
			eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

			guyTexture = THREE.ImageUtils.loadTexture('images/guyW.png');

			for(var i=0; i<camMats.length; i++){
				var mmm = new THREE.MeshLambertMaterial( { map: guyTexture, color: guyColors[i] } );
				loadModelGuy( "models/Guy2/GuyB.js", "models/Guy2/GuyLA.js", "models/Guy2/GuyRA.js", "models/Guy2/GuyH.js", mmm.clone(), camMats[i], i );
			}

	// connections
		var loader = new THREE.JSONLoader( true );
		tex = THREE.ImageUtils.loadTexture('images/connection.png');
		connectMat = new THREE.MeshLambertMaterial({map: tex, shading: THREE.FlatShading, transparent: true, opacity: 0});
		// var geo = new THREE.BoxGeometry(0.5, 0.5, 4);

		for(var i=0; i<connectFiles.length; i++){
			loadConnections( connectFiles[i], connectMat );
		}
		
		

	// touche: grass on guy's head
		tex = THREE.ImageUtils.loadTexture('images/grass.png');
		grassMat = new THREE.MeshLambertMaterial( { map: tex } );
		loadModelGrass( "models/grass.js", grassMat);

		// banana
		bananaMat = new THREE.MeshFaceMaterial;
		loadModelBanana("models/banana10.js", "models/banCore.js", bananaMat);

	// touches: 13 possibilities
		for(var i=0; i<10; i++){
			touches.push( false );
			touchStatus.push( false );
			touchPastStatus.push( false );
			triggerSources.push( null );
		}

	// lightbulbs
		lightbulbLight = new THREE.PointLight(0xffff00, 1, 15);
		glowTexture = new THREE.ImageUtils.loadTexture('images/glow_edit.png');
		var mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		var tmpMesh = new THREE.Sprite(mat);
		// tmpMesh.scale.set(2,2,2);	//big
		lightbulbLight.add(tmpMesh);

	// money
		var loader = new THREE.JSONLoader( true );
		loader.load( "models/money2.js", function( geometry ) {
			tex = THREE.ImageUtils.loadTexture('images/money.png');
			money = new THREE.Mesh( geometry.clone(), new THREE.MeshBasicMaterial( { map: tex } ) );
		} );

	// stars
		for(var i=0; i<starFiles.length; i++){
			tex = new THREE.ImageUtils.loadTexture( starFiles[i] );
			starTextures.push(tex);
			var starAni = new TextureAnimator( tex, 4, 1, 8, 40, [0,1,2,3,2,1,3,2] );
			starAnimators.push(starAni);

			mat = new THREE.SpriteMaterial({map: tex, color: 0xcccccc, transparent: false, blending: THREE.AdditiveBlending});
			var starrr = new THREE.Sprite(mat);
			starSources.push(starrr);
		}

	// stripes
		stripe = new THREE.Object3D();
		geo = new THREE.BoxGeometry(0.1,0.1,10);
		mat = new THREE.MeshLambertMaterial({color: 0x5cabe0});
		stripeMats.push(mat);
		mat = new THREE.MeshLambertMaterial({color: 0xe05c69});
		stripeMats.push(mat);
		mat = new THREE.MeshLambertMaterial({color: 0x5ce091});
		stripeMats.push(mat);

		for(var k=0; k<3; k++){

			for(var i=0; i<5; i++){
				for(var j=0; j<5; j++){
					var tmpST = new THREE.Mesh(geo.clone(), stripeMats[k]);
					tmpST.position.x = i*1.2-3;
					tmpST.position.y = j*1.2;

					stripe.add(tmpST);
				}
			}

			var tmpStripe = stripe.clone();
			tmpStripe.position.set( 50*Math.cos(Math.PI*k), 0, 50*Math.sin(Math.PI*k) );
			stripes.push(tmpStripe);
			scene.add(tmpStripe);
		}
		
	// rainbow
		tex = new THREE.ImageUtils.loadTexture('images/rainbow.png');
		rainbowMat = new THREE.MeshLambertMaterial({map: tex, side: THREE.DoubleSide});
		rainbowGeo = new THREE.CylinderGeometry( 0.5, 0.5, 5, 8, 2 );
		transY(rainbowGeo, 3);
		for(var i=0; i<5; i++){
			var rainB = new THREE.Mesh(rainbowGeo.clone(), rainbowMat);
			rainB.position.copy(guyPositions[i]);
			rainB.scale.set(0.1,0.01,0.1);
			rainB.rotation.y = Math.PI*2/(i+1);
			scene.add(rainB);
			rainbows.push(rainB);
		}
		
	// food
		loader.load( "models/donut.js", function( geometry ) {
			tex = new THREE.ImageUtils.loadTexture('images/donut.png');
			donut = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: tex } ) );
			food.push(donut);
		} );

		loader.load( "models/cookie.js", function( geometry ) {
			tex = new THREE.ImageUtils.loadTexture('images/cookie.png');
			cookie = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: tex } ) );
			cookie.name = 'cookie';
			// cookie.scale.set(0.3,0.3,0.3);
			food.push(cookie);
		} );

	// wave
		loader.load( "models/waterwave.js", function( geometry ) {
			tex = new THREE.ImageUtils.loadTexture('images/wave.png');
			wave = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: tex, morphTargets: true, transparent: true, opacity: 0 } ) );
			wave.position.y = -2;
			scene.add( wave );
		} );

	// horse
		horse = new THREE.Object3D();
		loader.load( "models/horse.js", function( geometry ) {
			tex = new THREE.ImageUtils.loadTexture('images/horse.png');
			var hos = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: tex, shading: THREE.FlatShading, morphTargets: true, transparent: true, opacity: 0 } ) );
			hos.position.y -= 1.5;
			hos.rotation.y += Math.PI;
			horse.add( hos );			
			horse.position.set( 20 * Math.cos( Math.PI ), 0, 20 * Math.sin( Math.PI ) );
			horse.lookAt(worldCenter);
			scene.add( horse );
			resetHorse = true;
		} );
		
	// frank
		tex = new THREE.ImageUtils.loadTexture('images/frank.png');
		frankMat = new THREE.MeshLambertMaterial({map: tex});
		totalFrankGeom = new THREE.Geometry();

		for(var i=0; i<frankFiles.length; i++){
			loadModelDance( frankFiles[i], frankMat, i );
		}
		// loadModelDance(
		// 	"models/frank/f_1.js", "models/frank/f_2.js", "models/frank/f_3.js", "models/frank/f_4.js",
		// 	"models/frank/f_5.js", "models/frank/f_6.js", "models/frank/f_7.js", "models/frank/f_8.js",
		// 	"models/frank/f_9.js", "models/frank/f_10.js", "models/frank/f_11.js", "models/frank/f_12.js",
		// 	frankMat);

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
	// document.addEventListener( 'keypress', myKeyPressed2, false );
	document.addEventListener( 'keyup', myKeyReleased, false );

	//

	// demo_app(videoImage.width, videoImage.height);

	//
	// scene.add(mansion);

	//
	canvasStrobe = document.getElementsByTagName('canvas')[0];

	//
	animate();	
}

// web audio api
function finishedLoading(bufferList){

	for(var i=0; i<2; i++){
		var s = audioContext.createBufferSource();
		audioSources.push(s);

		var g = audioContext.createGain();
		gainNodes.push(g);

		audioSources[i].buffer = bufferList[i];
		audioSources[i].loop = true;
		audioSources[i].connect(gainNodes[i]);
		gainNodes[i].connect(audioContext.destination);
		
		gainNodes[i].gain.value = 0;
		audioSources[i].start(0);
	}

	audioAllLoaded = true;
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

function loadModelBanana (model, model_B, meshMat) {

	var loader = new THREE.JSONLoader();

	//PEEL
	loader.load(model, function(geometry, material){

		for (var i=0; i<material.length; i++) {
			var m = material[ i ];
			m.skinning = true;
			m.color = new THREE.Color( 0xaaaa00 );
		}

		for(var i=0; i<10; i++){
			// var cubeManMat = new THREE.MeshLambertMaterial ({color: 0xaaaa00, skinning: true});
			banana = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(material));

			banana.scale.set(100,100,100);

			baPeels.push(banana);
			// console.log("banana!");

			baBone = banana.skeleton.bones;
			baBones.push(baBone);
		}

		//CORE
		loader.load(model_B, function(geometryB, materialB){

			for(var i=0; i<10; i++){
				bananaCore = new THREE.Mesh(geometryB, new THREE.MeshLambertMaterial({color: 0xffffff}));
				bananaCore.scale.set(0.001,0.001,0.001);
				bananaCore.position.set(Math.random()*10-5, -2, Math.random()*10-5);

				bananaCore.add(baPeels[i]);
				scene.add(bananaCore);
				bananas.push(bananaCore);
			}
		}, "js");		
	}, "js");
}

function loadModelGrass (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry, material){

		for (var i=0; i<material.length; i++) {
			var m = material[ i ];
			m.skinning = true;
		}

		for(var i=0; i<5; i++){
			// var cubeManMat = new THREE.MeshLambertMaterial ({color: 0xaaaa00, skinning: true});
			var grs = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(material));
			grs.scale.set(0.1,0.1,0.1);
			grs.position.copy( guyPositions[i] );
			grs.position.y+=1.2;

			scene.add(grs);
			grasses.push(grs);
			console.log("grass!");

			var grsBones = grs.skeleton.bones;
			grassBones.push(grsBones);
		}			
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


function loadModelGuy_v0 (model, modelB, meshMat) {

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

function loadModelGuy_v1 (model, modelB, mat, camMat, index) {

	var gguy = new THREE.Object3D();
	var gguyHead = new THREE.Object3D();

	var eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

	var loader = new THREE.JSONLoader();

	// add body --> children[0]
	loader.load(model, function(geometry){
		var g = new THREE.Mesh( geometry.clone(), mat );				
		gguy.add(g);

		// add head --> children[1]
		loader.load(modelB, function( geometryB ) {
			var g = new THREE.Mesh( geometryB.clone(), mat );
			var eyeScreen = new THREE.Mesh( eyeGeo.clone(), camMat );
			eyeScreen.position.y = 1;
			eyeScreen.position.z = 2;

				// add head head --> children[1][0]
				gguyHead.add(g);
				// add screen --> children[1][1]
				gguyHead.add(eyeScreen);

			gguy.add(gguyHead);

			if(index==0)
				gguy.position.set(0, 0, -7);
			else if(index==1)
				gguy.position.set(0, 0, 7);
			else if(index==2)
				gguy.position.set(-7, 0, 0);
			else
				gguy.position.set(7, 0, 0);

			scene.add( gguy );
			guys.push(gguy);
		} );
	} );	
}

// body, LA, RA, HEAD
function loadModelGuy (model, modelB, modelC, modelD, mat, cMat, index) {

	var gguy = new THREE.Object3D();
	var gguyBody = new THREE.Object3D();
	var gguyHead = new THREE.Object3D();
	var eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

	var loader = new THREE.JSONLoader();

	// add body --> children[0]
	loader.load(model, function( geometry ){
		var gb = new THREE.Mesh( geometry.clone(), mat );
		gguyBody.add(gb);
		gguyBody.name = "body";

		// add LA --> children[0][1]
		loader.load(modelB, function( geometryB ){
			var tmpLA = geometryB.clone();
			transY(tmpLA, -0.2);
			transZ(tmpLA, -0.1);

			var gla = new THREE.Mesh( tmpLA, mat );
			gla.name = "LA";
			gla.position.y = 0.2;
			gla.position.z = 0.1;
			gguyBody.add(gla);

			// add RA --> children[0][2]
			loader.load(modelC, function( geometryC ){
				var tmpRA = geometryC.clone();
				transY(tmpRA, -0.2);
				transZ(tmpRA, -0.1);

				var gra = new THREE.Mesh( tmpRA, mat );
				gra.name = "RA";
				gra.position.y = 0.2;
				gra.position.z = 0.1;
				gguyBody.add(gra);

				// add body --> GUY's children[0]
				gguy.add( gguyBody );

				// add head --> children[1]
				loader.load(modelD, function( geometryD ) {
					var gh = new THREE.Mesh( geometryD.clone(), mat );
					var eyeScreen = new THREE.Mesh( eyeGeo.clone(), cMat );
					eyeScreen.scale.set(0.5,0.5,0.5);
					eyeScreen.position.y = 1;
					eyeScreen.position.z = 2;

					// add head head --> children[1][0]
					gguyHead.add(gh);
					// add screen --> children[1][1]
					gguyHead.add(eyeScreen);

					gguyHead.name = "head";
					gguy.add(gguyHead);

					gguy.position.copy( guyPositions[index] );
					console.log(guyPositions[index]);
					gguy.name = index;

					scene.add( gguy );
					guys.push( gguy );

				} );
			} );
		} );
	} );	
}

function loadConnections (model, meshMat) {
	var mmmmm = meshMat.clone();
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var ccc = new THREE.Mesh(geometry, mmmmm);
		scene.add(ccc);			
		connections.push(ccc);
	}, "js");
}

function loadModelDance_v0 (models0, models1, models2, models3, models4, models5, models6, models7, models8, models9, models10, models11, meshMat) {

	var matt = meshMat;
	var loader = new THREE.JSONLoader();
	var danceMesh;

	var totalGeom = new THREE.Geometry();

	var models = [];
	models.push(models0);
	models.push(models1);
	models.push(models2);
	models.push(models3);
	models.push(models4);
	models.push(models5);
	models.push(models6);
	models.push(models7);
	models.push(models8);
	models.push(models9);
	models.push(models10);
	models.push(models11);


	for(var i=0; i<12; i++){
		loader.load(models[i], function(geometry){
			danceMesh = new THREE.Mesh(geometry, matt);

			// danceMesh.scale.set(scaleD,scaleC,scaleC);
			// danceMesh.position.y = posYD;

			// dancingFrank[i].position.x = Math.sin((360/12*i - danceStep)*(Math.PI/180))*40;
			// dancingFrank[i].position.z = Math.sin(Math.PI/2 + (360/12*i - danceStep)*(Math.PI/180))*40;
			// dancingFrank[i].rotation.y = (360/12*i - danceStep)*(Math.PI/180);

			danceMesh.position.x = Math.sin((360/12*i)*(Math.PI/180))*40;
			danceMesh.position.z = Math.sin(Math.PI/2 + (360/12*i)*(Math.PI/180))*40;
			danceMesh.rotation.y = (360/12*i)*(Math.PI/180);
			console.log(i);
			scene.add(danceMesh);
			dancingFrank.push(danceMesh);
				
		}, "js");
	}
}

function loadModelDance (model, meshMat, index) {

	var matt = meshMat;
	totalFrankMats.push( matt );

	var loader = new THREE.JSONLoader();
	var danceMesh;

	loader.load(model, function(geometry){
		danceMesh = new THREE.Mesh(geometry, matt);

		danceMesh.position.x = Math.sin((360/12*index)*(Math.PI/180))*20;
		danceMesh.position.z = Math.sin(Math.PI/2 + (360/12*index)*(Math.PI/180))*20;
		danceMesh.position.y = -1;
		danceMesh.rotation.y = (180+360/12*index)*(Math.PI/180);

		danceMesh.updateMatrix();
		totalFrankGeom.merge( danceMesh.geometry, danceMesh.matrix );

		if(index == 11){
			frank = new THREE.Mesh( totalFrankGeom, new THREE.MeshFaceMaterial(totalFrankMats) );
			scene.add( frank );
		}

		// scene.add(danceMesh);
		// dancingFrank.push(danceMesh);
			
	}, "js");
}



var trigger0_source;

function myKeyPressed (event) {

	sampleIndex = Math.random();
	if(sampleIndex>0.65)
		sampleIndex = 0;
	else if(sampleIndex<=0.3)	//lowest chance
		sampleIndex = 1;
	else
		sampleIndex = 2;

	switch ( event.keyCode ) {
		case 84: //t
			twoTouch = true;
			// console.log("twoTouch!");
			break;

		case 48: //0
			// triggerSources[0] = sample.triggerReturn(0+sampleIndex,0.3);
			// createMoney();
			touches[0] = true;
			break;

		case 49: //1
			// triggerSources[1] = sample.triggerReturn(3+sampleIndex,1);
			// createStar(sampleIndex);
			touches[1] = true;
			break;

		case 50: //2
			// triggerSources[2] = sample.triggerReturn(6+sampleIndex,1);
			// changeBGColor();
			touches[2] = true;
			break;

		case 51: //3
			// triggerSources[3] = sample.triggerReturn(9+sampleIndex,0.3);
			// UpGrass();
			touches[3] = true;
			break;

		case 52: //4
			// triggerSources[4] = sample.triggerReturn(12+sampleIndex,1);
			// createLightbulb();
			touches[4] = true;
			break;

		case 53: //5
			// triggerSources[5] = sample.triggerReturn(15+sampleIndex,0.5);
			// UpBanana();
			touches[5] = true;
			break;

		case 54: //6
			// triggerSources[6] = sample.triggerReturn(18+sampleIndex,1);
			// shootStripe(sampleIndex);
			touches[6] = true;
			break;

		case 55: //7
			// triggerSources[7] = sample.triggerReturn(21+sampleIndex,1);
			// shootRainbow(sampleIndex);
			touches[7] = true;
			break;

		case 56: //8
			// triggerSources[8] = sample.triggerReturn(24+sampleIndex,1);
			// dropFood();
			touches[8] = true;
			break;

		case 57: //9
			// triggerSources[9] = sample.triggerReturn(27+sampleIndex,1);
			// showWave();
			touches[9] = true;
			break;

		case 32: //space
			strobeLightOn = true;
			break;

		// case 72: //h --> lift right hand
		// 	guyHandHight = !guyHandHight;
		// 	if(guyHandHight){
		// 		new TWEEN.Tween(guys[0].children[0].children[2].rotation).to({x: -90 * Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
		// 		new TWEEN.Tween(guys[0].children[0].children[2].scale).to({y: 4}, 800).easing( TWEEN.Easing.Back.Out).start(); 
		// 	} else {
		// 		new TWEEN.Tween(guys[0].children[0].children[2].rotation).to({x: 0}, 800).easing( TWEEN.Easing.Back.Out).start(); 
		// 		new TWEEN.Tween(guys[0].children[0].children[2].scale).to({y: 1}, 800).easing( TWEEN.Easing.Back.Out).start(); 
		// 	}
		// 	break;

		case 72: //h 
			var msg = {
				'type': 'horseStop'
			};
			if(ws){
				sendMessage( JSON.stringify(msg) );
			}
			break;

		case 74: //j
			var msg = {
				'type': 'horse'
			};
			if(ws){
				sendMessage( JSON.stringify(msg) );
			}
			break;

		case 75: //k
			var msg = {
				'type': 'zoetrope'
			};
			if(ws){
				sendMessage( JSON.stringify(msg) );
			}
			break;

		case 76: //l
			var msg = {
				'type': 'zoeStop'
			};
			if(ws){
				sendMessage( JSON.stringify(msg) );
			}
			break;
	}
}

function myKeyReleased (event) {

	switch ( event.keyCode ) {

		case 84: //t
			twoTouch = false;
			break;

		case 48: //0
			touches[0] = false;
			break;

		case 49: //1
			touches[1] = false;
			break;

		case 50: //2
			touches[2] = false;
			break;

		case 51: //3
			touches[3] = false;
			break;

		case 52: //4
			touches[4] = false;
			// sample.stop(trigger0_source);
			break;

		case 53: //5
			touches[5] = false;
			break;

		case 54: //6
			touches[6] = false;
			break;

		case 55: //7
			touches[7] = false;
			break;

		case 56: //8
			touches[8] = false;
			break;

		case 57: //9
			touches[9] = false;
			break;

		case 32: //space
			strobeLightOn = false;
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
var danceStep = 0;

function update()
{	

	danceStep += 2.618;	//3.75, 2.945, 2.4216

	// danceStep += 3.75;

	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight);

			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}
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

	controls.update( Date.now() - time );
	stats.update();
	var dt = clock.getDelta();
	TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();



	// lamp
	// lamp.rotation.z = sinWave.run()/2;


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

	// stars
	for(var i=0; i<starAnimators.length; i++){
		starAnimators[i].updateLaura( 300*dt );
	}

	// touches -> volume
	if( audioAllLoaded ){
		if( touches[2] ){
			if(gainNodes[0].gain.value<1)
				gainNodes[0].gain.value += 0.5;
		}else{
			if(gainNodes[0].gain.value>0.05)
				gainNodes[0].gain.value -= 0.05;
		}

		if( touches[8] ){
			if(gainNodes[1].gain.value<1)
				gainNodes[1].gain.value += 0.5;
		}else{
			if(gainNodes[1].gain.value>0.05)
				gainNodes[1].gain.value -= 0.05;
		}
	}
	

	if(wave){
		time = Date.now() % durationW;
		keyframeW = Math.floor( time / interpolationW ) + 1 + animOffsetW;
		//
		// time = Date.now() % (durationP);
		// if(walking){
		// 	keyframeP = Math.floor( time / interpolationP2 ) + 1 + animOffsetP;
		// } else {
		// 	time = Date.now() % durationP;
		// 	keyframeP = Math.floor( time / interpolationP ) + animOffsetP;
		// }

		if ( keyframeW != currentKeyframeW ) {

			wave.morphTargetInfluences[ lastKeyframeW ] = 0;
			wave.morphTargetInfluences[ currentKeyframeW ] = 1;
			wave.morphTargetInfluences[ keyframeW ] = 0;

			lastKeyframeW = currentKeyframeW;
			currentKeyframeW = keyframeW;
		}
	}

	touchCount = 0;
	// count touches
	// for(var i=0; i<connections.length; i++){
	// 	if(touches[i]) {
	// 		touchCount++;
	// 		// connections[i].material.opacity=1;
	// 	} else {
	// 		// connections[i].material.opacity=0;
	// 	}
	// }

	// horse
		if(horse && horseWalking){
			timeH = Date.now() % durationH;
			keyframeH = Math.floor( timeH / interpolationH ) + 1 + animOffsetH;

			if ( keyframeH != currentKeyframeH ) {

				horse.children[0].morphTargetInfluences[ lastKeyframeH ] = 0;
				horse.children[0].morphTargetInfluences[ currentKeyframeH ] = 1;
				horse.children[0].morphTargetInfluences[ keyframeH ] = 0;

				lastKeyframeH = currentKeyframeH;
				currentKeyframeH = keyframeH;
			}
		}

		if(gogoHorse && resetHorse) {
			console.log("4 ppl are touching!");
			goHorse();
		}

		if (frank && gogoHorse) {
			// for(var i=0; i<dancingFrank.length; i++){
			// 	dancingFrank[i].position.x = Math.sin((360/12*i - danceStep)*(Math.PI/180))*40;
			// 	dancingFrank[i].position.z = Math.sin(Math.PI/2 + (360/12*i - danceStep)*(Math.PI/180))*40;
			// 	dancingFrank[i].rotation.y = (360/12*i - danceStep)*(Math.PI/180);
			// }

			frank.rotation.y = -danceStep;
		}
	
	// zoetrope
	if(touchCount>=5 || strobeLightOn) {
		// console.log("5 ppl or more are touching!");
		changeColor();		
	} else {
		showCanvas();
	}
			

	

		// for(var i=0; i<dancingFrank.length; i++){
		// 	dancingFrank[i].position.x = Math.sin((360/12*i - danceStep)*(Math.PI/180))*40;
		// 	dancingFrank[i].position.z = Math.sin(Math.PI/2 + (360/12*i - danceStep)*(Math.PI/180))*40;
		// 	dancingFrank[i].rotation.y = (360/12*i - danceStep)*(Math.PI/180);
		// }

		

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

	// structures
		// guys 
		//	- body
		//		- LA
		//		- RA
		//	- head
		//		- head
		//		-screen

	var iii = playerIndex-1;

	//head
	guys[iii].children[1].rotation.setFromQuaternion( playerQ );
	//body
	var ahhRotation = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );
	guys[iii].children[0].rotation.y = ahhRotation.y;

	// console.log(iii);

}

// reference from http://stackoverflow.com/questions/4436764/rotating-a-quaternion-on-1-axis
function createFromAxisAngle( _x, _y, _z, _a ) {

	var result = Math.sin( _a / 2.0 );

    // Calculate the x, y and z of the quaternion
    var xx = _x * result;
    var yy = _y * result;
    var zz = _z * result;

    // Calcualte the w value by cos( theta / 2 )
    var ww = Math.cos( _a / 2.0 );

    return ( new THREE.Quaternion(xx, yy, zz, ww).normalize() );
}

function getEulerAngles( q, yaw, pitch, roll ) {

	// var w2 = q.w*q.w;
 //    var x2 = q.x*q.x;
 //    var y2 = q.y*q.y;
 //    var z2 = q.z*q.z;
 //    var unitLength = w2 + x2 + y2 + z2;    // Normalised == 1, otherwise correction divisor.
 //    var abcd = q.w*q.x + q.y*q.z;
 //    var eps = Math.pow(10, -7); 	//1e-7;    // TODO: pick from your math lib instead of hardcoding.
 //    var pi = Math.PI;   // TODO: pick from your math lib instead of hardcoding.

 //    if (abcd > (0.5-eps)*unitLength)
 //    {
 //        yaw = 2 * Math.atan2(q.y, q.w);
 //        pitch = Math.PI;
 //        roll = 0;
 //    }
 //    else if (abcd < (-0.5+eps)*unitLength)
 //    {
 //        yaw = -2 * ::atan2(q.y, q.w);
 //        pitch = -pi;
 //        roll = 0;
 //    }
 //    else
 //    {
 //        const double adbc = q.w*q.z - q.x*q.y;
 //        const double acbd = q.w*q.y - q.x*q.z;
 //        yaw = ::atan2(2*adbc, 1 - 2*(z2+x2));
 //        pitch = ::asin(2*abcd/unitLength);
 //        roll = ::atan2(2*acbd, 1 - 2*(y2+x2));
 //    }
}

function createLightbulb() {
	var newLB = lightbulbLight.clone();
	newLB.position.set( Math.random()*10-5, -5, Math.random()*10-5);
	scene.add(newLB);
	// lightbulbs.push(newLB);

	//v1
	new TWEEN.Tween(newLB.position).to(
		{y: 1}, 2000).easing( TWEEN.Easing.Elastic.Out)
		.chain( new TWEEN.Tween(newLB.position)
					.to({y: [-1,20]}, 5000)
					.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
															scene.remove(newLB);
															console.log("remove lightbulbs!");
														}) ).start();
}

function createStar(index) {

	for(var i=0; i<10; i++){
		var newS = starSources[index].clone();
		newS.position.set( Math.random()*10-5, Math.random()*3-2, Math.random()*10-5);
		newS.scale.set(0.0001,0.0001,0.0001);
		scene.add(newS);
		stars.push(newS);
	}

	new TWEEN.Tween(newS.scale).to(
		{x:1, y:1, z:1}, 2000).easing( TWEEN.Easing.Elastic.Out)
		.chain( new TWEEN.Tween(newS.scale)
					.to({x:0.0001, y: 0.0001, z:0.0001}, 1000)
					.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
															scene.remove(newS);
															console.log("remove money!");
														}) ).start();

}

function createMoney() {
	var newM = money.clone();
	newM.position.set( Math.random()*10-5, 0, Math.random()*10-5);
	newM.rotation.y = Math.random()*Math.PI;
	newM.scale.set(0.5,0.0001,1);
	scene.add(newM);
	// lightbulbs.push(newLB);

	//v1
	new TWEEN.Tween(newM.scale).to(
		{y: 0.5}, 2000).easing( TWEEN.Easing.Elastic.Out)
		.chain( new TWEEN.Tween(newM.scale)
					.to({y: 0.0001}, 1000)
					.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
															scene.remove(newM);
															console.log("remove money!");
														}) ).start();
}


function changeBGColor() {
	var tmpH = 0.6 + 0.4*Math.random()-0.2; 
	// console.log( tmpH );
	// tmpBgColor.setHSL( Math.random(), 1, 1 );
	// console.log( tmpBgColor );

	// tmpBgColor.setHSL( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0x111111 );

	tmpBgColor.setHSL( tmpH, 0.8, 0.1 );
	console.log( tmpBgColor );

	new TWEEN.Tween(bgColor).to({r: tmpBgColor.r, g: tmpBgColor.g, b: tmpBgColor.b}, 100)
		.easing( TWEEN.Easing.Exponential.In).start();
	renderer.setClearColor(bgColor);
}

function UpGrass() {
	var grassIndex = time%5;
	new TWEEN.Tween(grasses[grassIndex].scale).to({x:1, y:1, z:1}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grasses[grassIndex].scale).to({x:0.1, y:0.1, z:0.1}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start(); 
	new TWEEN.Tween(grassBones[grassIndex][1].rotation).to({y: 10*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grassBones[grassIndex][1].rotation).to({y: 0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start(); 
	new TWEEN.Tween(grassBones[grassIndex][3].rotation).to({y: 70*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grassBones[grassIndex][3].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start();
	new TWEEN.Tween(grassBones[grassIndex][4].rotation).to({y: -40*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grassBones[grassIndex][4].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start();
	new TWEEN.Tween(grassBones[grassIndex][6].rotation).to({y: -50*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grassBones[grassIndex][6].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start();
	new TWEEN.Tween(grassBones[grassIndex][7].rotation).to({y: -70*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(grassBones[grassIndex][7].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start();
}

function UpBanana() {
	var bananaIndex = time%10;

	// scale
	new TWEEN.Tween(bananas[bananaIndex].scale).to({x:0.2, y:0.2, z:0.2}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(bananas[bananaIndex].scale).to({x:0.001, y:0.001, z:0.001}, 1000).easing( TWEEN.Easing.Elastic.In).start()
		).start(); 

	// animation
	new TWEEN.Tween(baBones[bananaIndex][1].rotation).to({x: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(baBones[bananaIndex][1].rotation).to({x: 0.12}, 700).easing( TWEEN.Easing.Elastic.In).start()
		).start(); 
	new TWEEN.Tween(baBones[bananaIndex][3].rotation).to({y: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(baBones[bananaIndex][3].rotation).to({y: -0.105}, 700).easing( TWEEN.Easing.Elastic.In).start()
		).start();
	new TWEEN.Tween(baBones[bananaIndex][5].rotation).to({x: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(baBones[bananaIndex][5].rotation).to({x: -0.122}, 700).easing( TWEEN.Easing.Elastic.In).start()
		).start();
	new TWEEN.Tween(baBones[bananaIndex][7].rotation).to({y: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
			new TWEEN.Tween(baBones[bananaIndex][7].rotation).to({y: 0.108}, 700).easing( TWEEN.Easing.Elastic.In).start()
		).start();
}

function shootStripe( index ) {
	
	var rr = Math.random();
	stripes[index].scale.set(1,1,1);

	new TWEEN.Tween(stripes[index].position).to({x: -stripes[index].position.x, z: -stripes[index].position.z}, 3000).easing( TWEEN.Easing.Elastic.Out)
		.onComplete( function(){
			// console.log('old: ' + index);
			// console.log(stripes[index].position );
			stripes[index].position.set( 50 * Math.cos( Math.PI*rr ), 0, 50 * Math.sin( Math.PI*rr ));
			// console.log('new: ' + index);
			// console.log(stripes[index].position );
			stripes[index].lookAt(worldCenter);
			stripes[index].scale.set(0.01, 0.01, 0.01);
		} ).start(); 
}

function shootRainbow( index ) {
	var rainbowIndex = time%5;
	rainbows[rainbowIndex].scale.set( 0.1, 0.01, 0.1);
	rainbows[rainbowIndex].position.y = -0.8;

	new TWEEN.Tween(rainbows[rainbowIndex].scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
	new TWEEN.Tween(rainbows[rainbowIndex].position).to({y: 10}, 5000).easing( TWEEN.Easing.Elastic.Out)
		.onComplete( function(){
			rainbows[rainbowIndex].scale.set( 0.1, 0.01, 0.1);
			rainbows[rainbowIndex].position.y = -0.8;
		} ).start(); 
}

function dropFood() {
	var foodIndex = time%2;
	var newF = food[foodIndex].clone();
	newF.position.set( Math.random()*10-5, 20, Math.random()*10-5);
	newF.rotation.y = Math.random()*Math.PI;
	newF.scale.set(0.001,0.001,0.001);
	scene.add(newF);

	//v1
	if(newF.name == 'cookie')
		new TWEEN.Tween(newF.scale).to({x:0.5, y:0.5, z:0.5}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
	else
		new TWEEN.Tween(newF.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();

	new TWEEN.Tween(newF.position).to({y: -1}, 2000).easing(TWEEN.Easing.Elastic.Out).start();

	setTimeout(function(){
		new TWEEN.Tween(newF.position).to({y: -20}, 2000).easing(TWEEN.Easing.Elastic.Out)
			.onComplete(function(){
				new TWEEN.Tween(newF.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
				scene.remove(newF);
				console.log("remove food!");
			} ).start();
	}, 1500);

}

var waveTweenID;

function showWave() {
	wave.material.opacity=0;
	wave.scale.set(0.001, 0.001, 0.001);
	clearTimeout(waveTweenID)

	new TWEEN.Tween(wave.material).to({opacity:1}, 2000).easing( TWEEN.Easing.Elastic.Out).start();
	new TWEEN.Tween(wave.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();

	waveTweenID = setTimeout(function(){
		new TWEEN.Tween(wave.scale).to({x:10, y:1, z:10}, 4000).easing( TWEEN.Easing.Elastic.Out).start();
		new TWEEN.Tween(wave.material).to({opacity:0}, 4000).easing( TWEEN.Easing.Elastic.Out).start();
	}, 2000);
}

function goHorse() {

	resetHorse = false;
	horseWalking = true;
	horse.children[0].material.opacity = 1;
	
	var rr = time;

	new TWEEN.Tween(horse.position).to({x: -horse.position.x, z: -horse.position.z}, 4000).easing( TWEEN.Easing.Linear.None)
		.onComplete( function(){
			
			horse.lookAt(worldCenter);
			new TWEEN.Tween( horse.children[0].material ).to({opacity: 0}, 1000).easing( TWEEN.Easing.Linear.None).start();

			setTimeout(function(){
				horse.position.set( 20 * Math.cos( rr ), 0, 20 * Math.sin( rr ));
				horse.lookAt(worldCenter);
				resetHorse = true;
				horseWalking = false;
			}, 1500);
			
		} ).start(); 
}

//

function triggerAnimation(index) {

	sampleIndex = Math.random();
	if(sampleIndex>0.65)
		sampleIndex = 0;
	else if(sampleIndex<=0.3)	//lowest chance
		sampleIndex = 1;
	else
		sampleIndex = 2;

	triggerSources[ index ] = sample.triggerReturn( index*3+sampleIndex, 0.3 );

	////////////////////
	////////////////////
	////////////////////

	if(index==0){
		var newM = money.clone();
		newM.position.set( Math.random()*10-5, 0, Math.random()*10-5);
		newM.rotation.y = Math.random()*Math.PI;
		newM.scale.set(0.5,0.0001,1);
		scene.add(newM);
		// lightbulbs.push(newLB);

		//v1
		new TWEEN.Tween(newM.scale).to(
			{y: 0.5}, 2000).easing( TWEEN.Easing.Elastic.Out)
			.chain( new TWEEN.Tween(newM.scale)
						.to({y: 0.0001}, 1000)
						.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
																scene.remove(newM);
																console.log("remove money!");
															}) ).start();
	}

	if(index==1){
		for(var i=0; i<10; i++){
			var newS = starSources[sampleIndex].clone();
			newS.position.set( Math.random()*10-5, Math.random()*3-2, Math.random()*10-5);
			newS.scale.set(0.0001,0.0001,0.0001);
			scene.add(newS);
			stars.push(newS);
		}

		new TWEEN.Tween(newS.scale).to(
			{x:1, y:1, z:1}, 2000).easing( TWEEN.Easing.Elastic.Out)
			.chain( new TWEEN.Tween(newS.scale)
						.to({x:0.0001, y: 0.0001, z:0.0001}, 1000)
						.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
																scene.remove(newS);
																console.log("remove money!");
															}) ).start();
	}

	if(index==2){
		var tmpH = 0.6 + 0.4*Math.random()-0.2; 
		// console.log( tmpH );
		// tmpBgColor.setHSL( Math.random(), 1, 1 );
		// console.log( tmpBgColor );

		// tmpBgColor.setHSL( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0x111111 );

		tmpBgColor.setHSL( tmpH, 0.8, 0.1 );
		// console.log( tmpBgColor );

		new TWEEN.Tween(bgColor).to({r: tmpBgColor.r, g: tmpBgColor.g, b: tmpBgColor.b}, 100)
			.easing( TWEEN.Easing.Exponential.In).start();
		renderer.setClearColor(bgColor);
	}

	if(index==3){
		var grassIndex = time%5;
		new TWEEN.Tween(grasses[grassIndex].scale).to({x:1, y:1, z:1}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grasses[grassIndex].scale).to({x:0.1, y:0.1, z:0.1}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start(); 
		new TWEEN.Tween(grassBones[grassIndex][1].rotation).to({y: 10*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grassBones[grassIndex][1].rotation).to({y: 0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start(); 
		new TWEEN.Tween(grassBones[grassIndex][3].rotation).to({y: 70*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grassBones[grassIndex][3].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start();
		new TWEEN.Tween(grassBones[grassIndex][4].rotation).to({y: -40*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grassBones[grassIndex][4].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start();
		new TWEEN.Tween(grassBones[grassIndex][6].rotation).to({y: -50*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grassBones[grassIndex][6].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start();
		new TWEEN.Tween(grassBones[grassIndex][7].rotation).to({y: -70*Math.PI/180}, 1200).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(grassBones[grassIndex][7].rotation).to({y:0}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start();
	}

	if(index==4){
		var newLB = lightbulbLight.clone();
		newLB.position.set( Math.random()*10-5, -5, Math.random()*10-5);
		scene.add(newLB);
		// lightbulbs.push(newLB);

		//v1
		new TWEEN.Tween(newLB.position).to(
			{y: 1}, 2000).easing( TWEEN.Easing.Elastic.Out)
			.chain( new TWEEN.Tween(newLB.position)
						.to({y: [-1,20]}, 5000)
						.easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
																scene.remove(newLB);
																console.log("remove lightbulbs!");
															}) ).start();
	}

	if(index==5){
		var bananaIndex = time%10;

		// scale
		new TWEEN.Tween(bananas[bananaIndex].scale).to({x:0.2, y:0.2, z:0.2}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(bananas[bananaIndex].scale).to({x:0.001, y:0.001, z:0.001}, 1000).easing( TWEEN.Easing.Elastic.In).start()
			).start(); 

		// animation
		new TWEEN.Tween(baBones[bananaIndex][1].rotation).to({x: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(baBones[bananaIndex][1].rotation).to({x: 0.12}, 700).easing( TWEEN.Easing.Elastic.In).start()
			).start(); 
		new TWEEN.Tween(baBones[bananaIndex][3].rotation).to({y: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(baBones[bananaIndex][3].rotation).to({y: -0.105}, 700).easing( TWEEN.Easing.Elastic.In).start()
			).start();
		new TWEEN.Tween(baBones[bananaIndex][5].rotation).to({x: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(baBones[bananaIndex][5].rotation).to({x: -0.122}, 700).easing( TWEEN.Easing.Elastic.In).start()
			).start();
		new TWEEN.Tween(baBones[bananaIndex][7].rotation).to({y: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).chain(
				new TWEEN.Tween(baBones[bananaIndex][7].rotation).to({y: 0.108}, 700).easing( TWEEN.Easing.Elastic.In).start()
			).start();
	}

	if(index==6){
		var rr = Math.random();
		stripes[sampleIndex].scale.set(1,1,1);

		new TWEEN.Tween(stripes[sampleIndex].position).to({x: -stripes[sampleIndex].position.x, z: -stripes[sampleIndex].position.z}, 3000).easing( TWEEN.Easing.Elastic.Out)
			.onComplete( function(){
				// console.log('old: ' + index);
				// console.log(stripes[index].position );
				stripes[sampleIndex].position.set( 50 * Math.cos( Math.PI*rr ), 0, 50 * Math.sin( Math.PI*rr ));
				// console.log('new: ' + index);
				// console.log(stripes[index].position );
				stripes[sampleIndex].lookAt(worldCenter);
				stripes[sampleIndex].scale.set(0.01, 0.01, 0.01);
			} ).start(); 
	}

	if(index==7){
		var rainbowIndex = time%5;
		rainbows[rainbowIndex].scale.set( 0.1, 0.01, 0.1);
		rainbows[rainbowIndex].position.y = -0.8;

		new TWEEN.Tween(rainbows[rainbowIndex].scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
		new TWEEN.Tween(rainbows[rainbowIndex].position).to({y: 10}, 5000).easing( TWEEN.Easing.Elastic.Out)
			.onComplete( function(){
				rainbows[rainbowIndex].scale.set( 0.1, 0.01, 0.1);
				rainbows[rainbowIndex].position.y = -0.8;
			} ).start(); 
	}

	if(index==8){
		var foodIndex = time%2;
		var newF = food[foodIndex].clone();
		newF.position.set( Math.random()*10-5, 20, Math.random()*10-5);
		newF.rotation.y = Math.random()*Math.PI;
		newF.scale.set(0.001,0.001,0.001);
		scene.add(newF);

		//v1
		if(newF.name == 'cookie')
			new TWEEN.Tween(newF.scale).to({x:0.5, y:0.5, z:0.5}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
		else
			new TWEEN.Tween(newF.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();

		new TWEEN.Tween(newF.position).to({y: -1}, 2000).easing(TWEEN.Easing.Elastic.Out).start();

		setTimeout(function(){
			new TWEEN.Tween(newF.position).to({y: -20}, 2000).easing(TWEEN.Easing.Elastic.Out)
				.onComplete(function(){
					new TWEEN.Tween(newF.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();
					scene.remove(newF);
					console.log("remove food!");
				} ).start();
		}, 1500);
	}

	if(index==9){
		wave.material.opacity=0;
		wave.scale.set(0.001, 0.001, 0.001);
		clearTimeout(waveTweenID)

		new TWEEN.Tween(wave.material).to({opacity:1}, 2000).easing( TWEEN.Easing.Elastic.Out).start();
		new TWEEN.Tween(wave.scale).to({x:1, y:1, z:1}, 1000).easing( TWEEN.Easing.Elastic.Out).start();

		waveTweenID = setTimeout(function(){
			new TWEEN.Tween(wave.scale).to({x:10, y:1, z:10}, 4000).easing( TWEEN.Easing.Elastic.Out).start();
			new TWEEN.Tween(wave.material).to({opacity:0}, 4000).easing( TWEEN.Easing.Elastic.Out).start();
		}, 2000);
	}
}

////////////////////////////////////////////////////////

function changeColor(){
	delay+=0.1;

	if(delay>0.7){
		// canvasStrobe.style.display = "none";
		// document.body.style.backgroundColor = "#FFF";

		canvasStrobe.style.display = "block";
		document.body.style.backgroundColor = "#000";

		delay=0;
	} else {		
		// canvasStrobe.style.display = "block";
		// document.body.style.backgroundColor = "#000";

		canvasStrobe.style.display = "none";
		document.body.style.backgroundColor = "#000";

	}
}

function showCanvas(){
	canvasStrobe.style.display = "block";
	document.body.style.backgroundColor = "#000";
}

/////////////////////
/////////////////////
/////////////////////

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
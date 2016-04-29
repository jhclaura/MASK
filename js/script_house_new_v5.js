
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

	if ( havePointerLock && !isMobile ) {
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

		instructions.addEventListener( 'click', funToCall, false );
	}

	function funToCall(event){

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		controls.enabled = true;

		fullscreen();

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
var vrmanager;
var controls, headLight;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;
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

var textureLoader, jsonLoader;

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


///////////////////////////////////////////////////////////
superInit();
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function superInit()
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
		renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.autoClear = false;
		container.appendChild(renderer.domElement);

	// EFFECT
	if(isMobile){
		effect = new THREE.StereoEffect(renderer);
		effect.separation = 0.2;
	    effect.targetDistance = 50;
	    effect.setSize(window.innerWidth, window.innerHeight);
	}
	    
	// v.2
	 //    effect = new THREE.VREffect(renderer);
		// effect.setSize(window.innerWidth, window.innerHeight);

	// Create a VR manager helper to enter and exit VR mode.
		// var params = {
		//   hideButton: false, // Default: false.
		//   isUndistorted: false // Default: false.
		// };
		// vrmanager = new WebVRManager(renderer, effect, params);


	// SCENE_SETUP
	scene = new THREE.Scene();
	if(!isMobile) {
		scene.fog = new THREE.FogExp2( 0xf1f1fb, 0.004 );
	}

	// LIGHT
	// light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	// scene.add(light);

	// light in the room
	// light = new THREE.PointLight( 0xff983c, 1.5, 35 );		//old: 0xff673c
	// light.position.set(0, 20, 0);
	// scene.add(light);

	light = new THREE.HemisphereLight(0xffffff, 0xf1f1fb, 1);
	scene.add(light);

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
		console.log("controls created!");

	if(isMobile){
		window.addEventListener('click', fullscreen, false);
		fullscreen();
	}
		

	jsonLoader = new THREE.JSONLoader();
	textureLoader = new THREE.TextureLoader();

	//TERRAIN
		terrainMat = new THREE.MeshLambertMaterial( {color: 0xc9c9f0} );
		loadModelTerrain("models/terrain.js", terrainMat);
	
	//TREE
		// var tex = textureLoader.load('images/tree.png');
		// treeMat = new THREE.MeshLambertMaterial( {map: tex} );
		// loadmodelTree("models/trees.js", treeMat);
		LoadModelTrees('images/tree.png', "models/trees.js");

	// small houses
	// v.1
		// tex = textureLoader.load('images/smallHouse.png');
		// houseLocalMat = new THREE.MeshBasicMaterial( {map: tex} );
		// tex = textureLoader.load('images/smallHouse_2.png');
		// houseRemoteMat = new THREE.MeshBasicMaterial( {map: tex} );
		// loadmodelHouse("models/houseLocal.js", "models/houseRemote.js", houseLocalMat, houseRemoteMat);
		loadmodelHouse_v2('images/smallHouse.png', 'images/smallHouse_2.png',
						  'models/houseLocal.js', 'models/houseRemote.js');

	// MANSION
	// mansion = new THREE.Object3D();
	// tex = textureLoader.load('images/roomTexture.png');
	// for(var i=0; i<houseFiles.length; i++){
	// 	jsonLoader.load( houseFiles[i], function( geometry ) {
	// 		var tmpR = new THREE.Mesh( geometry, houseMat );
	// 		houses.push(tmpR);
	// 		scene.add(tmpR);
	// 	} );
	// }
	textureLoader.load('images/roomTexture.png', function(texture){
		houseMat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, shading: THREE.FlatShading });
		//
		for(var i=0; i<houseFiles.length; i++){
			var loader = new THREE.JSONLoader();
			loader.load( houseFiles[i], function( geometry ) {
				var tmpR = new THREE.Mesh( geometry, houseMat );
				houses.push(tmpR);
				scene.add(tmpR);
			} );
		}
	});

	

	// LAMP
		//v.1
		// woodTexture = textureLoader.load('images/wood.png');
		// frameMat = new THREE.MeshLambertMaterial({map: woodTexture});
		// lamp = new THREE.Object3D();

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

		// light = new THREE.PointLight(0xffff00, 0.5, 15);
		// // light = new THREE.Object3D();
		// // geo = new THREE.SphereGeometry(0.2,6,6);
		// // transY(geo, -1);
		// 	glowTexture = textureLoader.load('images/glow_edit.png');
		// 	mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
		// 	meshTemp = new THREE.Sprite(mat);
		// 	// meshTemp.position.y = -15;
		// 	meshTemp.scale.set(2,2,2);	//big
		// light.add(meshTemp);
		// light.position.y = -30;
		// lamp.add(light);
		// lamp.position.set(-6,30,-12);
		// scene.add(lamp);

		//v.2
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load( 'images/wood.png', function(texture){
			woodTexture = texture;

			var textureLoader = new THREE.TextureLoader();
			textureLoader.load( 'images/glow_edit.png', function(textureB){
				glowTexture = textureB;

				frameMat = new THREE.MeshLambertMaterial({map: woodTexture});
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

				light = new THREE.PointLight(0xffff00, 0.5, 15);
				mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
				meshTemp = new THREE.Sprite(mat);
				meshTemp.scale.set(2,2,2);	//big

				light.add(meshTemp);
				light.position.y = -30;
				lamp.add(light);
				lamp.position.set(-6,30,-12);
				scene.add(lamp);
			});
		});


	// GUY
		//v.1
		// guyTexture = textureLoader.load('images/guyAni.png');
		// guyPicAnimator = new TextureAnimator( guyTexture, 2, 1, 40, 30, [1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] );
		// mat = new THREE.MeshBasicMaterial({map: guyTexture});
		// loadModelGuy("models/GuySitForward.js", "models/GuySitForwardH.js", mat);

		//v.2
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load('images/guyAni.png', function(texture){
			guyTexture = texture;
			guyPicAnimator = new TextureAnimator( guyTexture, 2, 1, 40, 30, [1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] );
			mat = new THREE.MeshBasicMaterial({map: guyTexture});
			loadModelGuy("models/GuySitForward.js", "models/GuySitForwardH.js", mat);
		});

	// ANI_GUY
		//v.1
		// guyTexture = textureLoader.load('images/guyW.png');
		// jsonLoader.load( "models/aniGuy.js", function( geometry ) {
		// 	aniGuy = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: guyTexture, morphTargets: true } ) );
		// 	aniGuy.position.set(3, 0.4, 14.3);
		// 	aniGuy.rotation.y = Math.PI;
		// 	scene.add( aniGuy );
		// } );

		//v.2
		// var textureLoader = new THREE.TextureLoader();
		// textureLoader.load('images/guyW.png', function(texture){
		// 	guyTexture = texture;
		// 	var loader = new THREE.JSONLoader();
		// 	loader.load( "models/aniGuy.js", function( geometry ) {
		// 		aniGuy = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: guyTexture, morphTargets: true } ) );
		// 		aniGuy.position.set(3, 0.4, 14.3);
		// 		aniGuy.rotation.y = Math.PI;
		// 		scene.add( aniGuy );
		// 	} );
		// });
		
	//
		eyerayCaster = new THREE.Raycaster();
}

function init() 
{	
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

		// v.1
		// myWindow = new THREE.Object3D();
		// remoteWindow = new THREE.Object3D();

		// textureLoader = new THREE.TextureLoader();
		// tex = textureLoader.load('images/window01.png');
		// frameMat = new THREE.MeshLambertMaterial({map: tex});

		// tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
		// remoteMat = new THREE.MeshBasicMaterial({map: remoteTexture, overdraw: true, side: THREE.DoubleSide});

		// jsonLoader.load( "models/room/myWindowScreen_v2.js", function( geometry ) {
		// 	var tmpR = new THREE.Mesh( geometry, tvMat );
		// 	myWindow.add(tmpR);
		// } );
		// jsonLoader.load( "models/room/myWindowFrame_v3.js", function( geometry ) {
		// 	var tmpR = new THREE.Mesh( geometry, frameMat );
		// 	tmpR.position.set(-1,2.6,0);
		// 	myWindow.add(tmpR);
		// } );
		// scene.add(myWindow);

		// jsonLoader.load( "models/room/remoteWindowScreen.js", function( geometry ) {
		// 	var tmpR = new THREE.Mesh( geometry, remoteMat );
		// 	tmpR.name = "momWindow";
		// 	remoteWindow.add(tmpR);
		// } );
		// jsonLoader.load( "models/room/remoteWindowFrame_v2.js", function( geometry ) {
		// 	var reFrameMat = frameMat.clone();
		// 	reFrameMat.color = new THREE.Color( 0xF27E97 );
		// 	var tmpR = new THREE.Mesh( geometry, reFrameMat );
		// 	remoteWindow.add(tmpR);
		// } );
		// scene.add(remoteWindow);

		// v.2
		LoadeModelMainVideo();

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
		// woodTexture = textureLoader.load('images/wood.png');
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
		// windowFrameTexture2 = textureLoader.load('images/window02.png');
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

	camPos = controls.position().clone();

	if(guyHead)
		guyHead.lookAt(camPos);

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

function LoadeModelMainVideo() {
	myWindow = new THREE.Object3D();
	remoteWindow = new THREE.Object3D();
	tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
	remoteMat = new THREE.MeshBasicMaterial({map: remoteTexture, overdraw: true, side: THREE.DoubleSide});
	//
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load('images/window01.png', function(tex){
		frameMat = new THREE.MeshLambertMaterial({map: tex});

		var loader = new THREE.JSONLoader();
		loader.load( "models/room/myWindowScreen_v2.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, tvMat );
			myWindow.add(tmpR);

			loader.load( "models/room/myWindowFrame_v3.js", function( geometry ) {
				var tmpR = new THREE.Mesh( geometry, frameMat );
				tmpR.position.set(-1,2.6,0);
				myWindow.add(tmpR);
			} );
			scene.add(myWindow);
		} );

		loader.load( "models/room/remoteWindowScreen.js", function( geometry ) {
			var tmpR = new THREE.Mesh( geometry, remoteMat );
			tmpR.name = "momWindow";
			remoteWindow.add(tmpR);
		} );
		loader.load( "models/room/remoteWindowFrame_v2.js", function( geometry ) {
			var reFrameMat = frameMat.clone();
			reFrameMat.color = new THREE.Color( 0xF27E97 );
			var tmpR = new THREE.Mesh( geometry, reFrameMat );
			remoteWindow.add(tmpR);
		} );
		scene.add(remoteWindow);
	});
}

function loadModelTerrain (model, meshMat) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		terrain = new THREE.Mesh(geometry, meshMat);
		scene.add(terrain);
		terrain.position.y = -5;
		loadingCountText("terrain");
	});
}

function loadmodelTree (model, meshMat) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		trees = new THREE.Mesh(geometry, meshMat);
		scene.add(trees);			
	});
}

function LoadModelTrees (tex, model) {
	var texLoader = new THREE.TextureLoader();
	var loader = new THREE.JSONLoader();

	texLoader.load( tex, function(texture){
		var mat = new THREE.MeshLambertMaterial( {map: texture} );

		loader.load(model, function(geometry){
			var meeesh = new THREE.Mesh(geometry, mat);
			meeesh.position.y = -6;
			scene.add(meeesh);
		});
	});	
}

function LoadModelBasicTexture (tex, model) {
	var texLoader = new THREE.TextureLoader();
	var loader = new THREE.JSONLoader();

	texLoader.load( tex, function(texture){
		var mat = new THREE.MeshBasicMaterial( {map: texture} );

		loader.load(model, function(geometry){
			var meeesh = new THREE.Mesh(geometry, mat);
			scene.add(meeesh);			
		});
	});	
}

function loadmodelHouse (model, modelB, meshMat, meshMatB) {
	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		houseLocal = new THREE.Mesh(geometry, meshMat);
		houseLocal.position.z = -50;
		scene.add(houseLocal);			
	});
	loader.load(modelB, function(geometryB){
		houseRemote = new THREE.Mesh(geometryB, meshMatB);
		houseRemote.position.z = 50;
		scene.add(houseRemote);			
	});
}

function loadmodelHouse_v2 (tex, texB, model, modelB) {
	var texLoader = new THREE.TextureLoader();
	var loader = new THREE.JSONLoader();
	texLoader.load( tex, function(texture){
		var mat = new THREE.MeshBasicMaterial( {map: texture} );
		loader.load(model, function(geometry){
			houseLocal = new THREE.Mesh(geometry, mat);
			houseLocal.position.z = -50;
			scene.add(houseLocal);			
		});
	});	
	var texLoaderB = new THREE.TextureLoader();
	var loaderB = new THREE.JSONLoader();
	texLoaderB.load( texB, function(textureB){
		var mat = new THREE.MeshBasicMaterial( {map: textureB} );
		loaderB.load(modelB, function(geometryB){
			houseRemote = new THREE.Mesh(geometryB, mat);
			houseRemote.position.z = 50;
			scene.add(houseRemote);			
		});
	});	
}

function loadModelWindow (model, modelB, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();

	var tWindow = new THREE.Object3D();

	loader.load(model, function(geometry){
		var tW = new THREE.Mesh(geometry, meshMat);
		tWindow.add(tW);

		loader.load(modelB, function(geometryB){
			var tW2 = new THREE.Mesh(geometryB, meshMatB);
			tWindow.add(tW2);

			flyWindows.push(tWindow);
			scene.add(tWindow);		
		});
	});
}

function loadModelF (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		windowFrame = new THREE.Mesh(geometry, meshMat);
		windowFrame.position.set(0,-3.5,-14.5);
		scene.add(windowFrame);		
		// mansion.add(windowFrame);	
	});
}

function loadModelF2 (model, model2, meshMat, meshMat2) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		windowFrame2 = new THREE.Mesh(geometry, meshMat);
		scene.add(windowFrame2);
		// mansion.add(windowFrame2);		
	});

	loader.load(model2, function(geometry){
		windowFrame2 = new THREE.Mesh(geometry, meshMat2);
		scene.add(windowFrame2);	
		// mansion.add(windowFrame2);		
	});
}

function loadModelEye (model, model2, model3, model4, meshMat, meshMat2) {

	var loader = new THREE.JSONLoader();
	eyeWindow = new THREE.Object3D();

	loader.load(model, function(geometry){
		eyeLid = new THREE.Mesh(geometry, meshMat);
		eyeWindow.add(eyeLid);
	});

	loader.load(model2, function(geometry){
		eyeLashUp = new THREE.Mesh(geometry, meshMat);
		eyeLashUp.position.y = 3;
		eyeWindow.add(eyeLashUp);		
	});

	loader.load(model3, function(geometry){
		eyeLashDown = new THREE.Mesh(geometry, meshMat);
		eyeLashDown.position.y = -1;
		eyeWindow.add(eyeLashDown);		
	});

	loader.load(model4, function(geometry){
		var eyeS = new THREE.Mesh(geometry, meshMat2);
		eyeWindow.add(eyeS);		
	});

	scene.add(eyeWindow);
}

function loadModelScreen (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var mayaScreen = new THREE.Mesh(geometry, meshMat);
		scene.add(mayaScreen);			
		// scene.add(mayaScreen);
	});
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
		});
	});
}


function myKeyPressed (event) {

	switch ( event.keyCode ) {

		// case 49: //O --> aniGuy swing
		// 	standUp = false;
		// 	jump = false;
		// 	aniGuy.lookAt(camPos);
		// 	break;

		// case 50: //1 --> standUp
		// 	standUp = true;
		// 	jump = false;
		// 	aniGuy.lookAt(camPos);
		// 	break;

		// case 51: //2 --> jump
		// 	standUp = false;
		// 	jump = true;
		// 	aniGuy.lookAt(camPos);
		// 	break;

		case 32: //space --> explode ROOM
			for(var i=0; i<roomExploded.length; i++){
				roomExploded[i] = !roomExploded[i];
			}
			for(var i=0; i<windowExploded.length; i++){
				windowExploded[i] = !windowExploded[i];
			}
			// v.1
			// var msg = {
			// 	'type': 'button'
			// };

			// if(ws){
			// 	sendMessage( JSON.stringify(msg) );
 			// }

 			// v.2
 			var msg = {
				'type': 'touch',
				'from': whoIamInMask
			};

			if(ws){
				sendMessage( JSON.stringify(msg) );
 			}
			break;

	}
}

var lastRender = 0;

function animate(timestamp) 
{
    requestAnimationFrame(animate);
	update();
	render();

	// var delta = Math.min(timestamp - lastRender, 500);
	// lastRender = timestamp;

	// update();
	
	// // Render the scene through the manager.
	// vrmanager.render(scene, camera, timestamp);
	

	// requestAnimationFrame(animate);
}

var swingSwitch = 0;
var camPos, camRot;

//
var lookAtMom = false, hearMom = false;

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

	stats.update();
	controls.update( Date.now() - time );

	// stats.update();
	var dt = clock.getDelta();
	var elapsedTime = clock.elapsedTime;
	// console.log(elapsedTime);
	TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();

	// lamp
	if(lamp)
		lamp.rotation.z = sinWave.run()/2;

	// guy
	if(guyHead)
		guyPicAnimator.updateLaura( 300*dt );

	// if(guyHead)
	// 	guyHead.lookAt(camPos);

	// EYELASH
	if(!eyeMove && eyeLashUp && eyeLashDown){
		new TWEEN.Tween(eyeLashUp.position).to({y: 0}, 50).repeat(1).yoyo(true).start();
		new TWEEN.Tween(eyeLashDown.position).to({y: 0}, 50).repeat(1).yoyo(true).start();

		// timeoutID = setTimeout(function(){
		// 	new TWEEN.Tween(eyeLashUp.position).to({y: 3}, 50).start();
		// 	new TWEEN.Tween(eyeLashDown.position).to({y: -1}, 50).start();
		// }, 51);

		if(Math.random()>0.3){
			timeoutID2 = setTimeout(function(){
				eyeMove = false;
			}, 5000);
		}else{
			timeoutID2 = setTimeout(function(){
				eyeMove = false;
				// console.log("short");
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

		// if ( aniGuy ) {

		// 		// Alternate morph targets

		// 		// time = Date.now() % duration + animOffset;
		// 		// keyframe = Math.floor( time / interpolation ) + 1;
		// 		time = Date.now() % duration;
		// 		keyframe = Math.floor( time / interpolation ) + 1 + animOffset;
		// 		// lastKeyframe = 50;
		// 		// currentKeyframe = 50;

		// 		if ( keyframe != currentKeyframe ) {

		// 			aniGuy.morphTargetInfluences[ lastKeyframe ] = 0;
		// 			aniGuy.morphTargetInfluences[ currentKeyframe ] = 1;
		// 			aniGuy.morphTargetInfluences[ keyframe ] = 0;

		// 			lastKeyframe = currentKeyframe;
		// 			currentKeyframe = keyframe;

		// 			// console.log( mesh.morphTargetInfluences );

		// 		}

		// 	// mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
		// 	// mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
		// }

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
		// headLight.position.z = camPos.z + 3*(Math.cos(camRot.y));
		// headLight.target.position.z = camPos.z;
		// headLight.position.x = camPos.x + 3*(Math.sin(camRot.y));
		// headLight.target.position.x = camPos.x;
		// headLight.position.y = camPos.y - 5*(Math.sin(camRot.x));
		// headLight.target.position.y = camPos.y;

	// console.log( controls.finalQ );

	// EYE_RAYS!!
		var directionCam = controls.getDirection().clone();
		eyerayCaster.set( controls.getObject().position.clone(), directionCam );
		var eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if ( eyeIntersects.length > 0 ) {
			// console.log('hit');
			// console.log(eyeIntersects[ 0 ].object);

			// 
			if(eyeIntersects[ 0 ].object.name == "momWindow"){
				// console.log('hit');

				lookAtMom = true;

				if(remote.volume<0.9){
					remote.volume += 0.05;
				}
				// toBackStatus = true;
				// toBackStatusPast = true;

				// if( sound_sweet.gainNode ) {
				// 	if( sound_sweet.gainNode.gain.value<1 ){
				// 		sound_sweet.gainNode.gain.value += 0.05;
				// 	}
				// 	if( sampleGain.gain.value>0.2 ){
				// 		sampleGain.gain.value -= 0.05;
				// 	}
				// }
			} else {
				lookAtMom = false;

				if(remote.volume>0.1){
					remote.volume -= 0.05;
				}
			}
		}

	//
	time = Date.now();

	// RELOAD!!!
	// if(isMobile){
		// if(elapsedTime/60>10){
		// 	// darker the page
		// 	renderCanvas.style.opacity = 0;
		// 	// reload
		// 	setTimeout(function(){
		// 		location.reload();
		// 	}, 2000);
		// }
	// }
	
}

function render() 
{	
	if(!isMobile)
		renderer.render( scene, camera );
	else
		effect.render( scene, camera );
}

function onWindowResize() {

	// camera.aspect = window.innerWidth / window.innerHeight;
	// camera.updateProjectionMatrix();
	// if (devicePixelRatio) {
	// 	renderer.devicePixelRatio = effect.devicePixelRatio = devicePixelRatio;
	// }

	if(isMobile){
		effect.setSize( window.innerWidth, window.innerHeight );
		
	}else{
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
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

var loadedCount = 0;

function loadingCountText( itemName ) {
	console.log( "loaded " + itemName );
	loadedCount ++;

	if(loadedCount>=8) {
		// hide the loading gif and display start link
		startLink.style.display = "";
		loadingImg.style.display = "none";
		loadingTxt.style.display = "none";
		readyToStart = true;
	}
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
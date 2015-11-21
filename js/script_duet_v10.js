
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
// LARUA_MATH
////////////////////////////////////////////////////////////

	LauraMath = function(x) {
		this.x = x || 0;
	}

	LauraMath.prototype = {

		constructor: LauraMath,

		lerpValue: function (end, amount) {
			this.x += ((end - this.x) * amount);
			return this.x;
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
var myStartX = 0, myStartZ = 0, myStartY = 2.5; //2


var banana, bananaCore, bananaGeo, bananaMat, baBone;
var baBones=[], baPeels=[], bananas=[];

var rabbit, rabbitTexture, rabbits = [];

var ground, worldBall, room, roomTexture, roomWidth = 30, roomHeight = 60, roomDepth = 30;
var windowFrame, windowFrame2, windowFrameTexture, windowFrameTexture2, table, woodTexture, lamp, glowTexture;
var lamps = [], glowTextures = [];
var glowAnimator;
var guy, guyHead, guyTexture, guyPicAnimator;

var dummy;

var dir, step;

var perlin = new ImprovedNoise(), noiseQuality = 1;

// WAVE
	var timeWs = [
		0, Math.PI/2, Math.PI, -Math.PI/2,
		Math.PI+0.3, -Math.PI/5, Math.PI/1.1
	];
	var frequencyWs = [
		0.02, 0.01
	];
	var frequencyW = 0.02;
	var amplitudeW = 0.1;
	var offsetW = 0;
	var sinWave, sRun;
	var sinWaves = [], cosWaves = [], tanWaves = [];
	var sinWRun = [], cosWRun = [], tanWRun = [];

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
	// var keyframes = 41 /*16*/, interpolation = duration / keyframes, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;

	var animOffset = 0, standUpOffset = 50, jumpOffset = 100;
	var standUp = false, jump = false;

// Envoriment
	var trees, terrain, treeMat, terrainMat;

// duet Guys
	var firstGuy, firstGuyBody, firstGuyHead, secondGuy, secondGuyBody, secondGuyHead;
	var QforBodyRotation;
	var fGuyHandHigh = false, sGuyHandHigh = false;
	var bodyGeo;

// skinthing
	var skinGeo, skinGeoOrigin, skinthing, skinMat, skinParitcle, skinNormalMatrices = [];
	var skinV, skinOriginV, skinV_D, skinSpeed=2;
	var twoTouch = false, twoTouchPast = false;
	var movingSkin = [], skinAttractStrength, skinAwayStrength;

// circle
	var circleMat, circle;
	var circles=[];

// monster
	var monsters = [], monsterTextures = [], monsterMats = [], monster;
	var monsterPicAnimators = [];
	var durationP = 1470, keyframeP = 70, interpolationP = durationP / keyframeP, interpolationP2 = durationP / (keyframeP), lastKeyframeP = 0, currentKeyframeP = 0;
	var downInfP = false, upInfP = false, influcenceP = 1;
	var monsAniStep = 0, monsAniTime = 0, slowMonsAni = 0.6;
	var animOffsetP = 0, holdHandOffset = 70, swingOffset = 95, handBackOffset = 155;
	var durations = [ 1470, 500, 1260, 500 ];
	var animOffsets = [ 0, 70, 95, 155 ];
	var keyframes = [ 70, 25, 60, 25 ], keyduration=0;
	var pat = false, holdHand = false, swing = true, handBack = false;
	var eyeParent = [];

	//v2
	var keyframeMon = [ 0, 0, 0, 0 ], lastKeyframeMon = [ 0, 0, 0, 0 ], currentKeyframeMon = [ 0, 0, 0, 0 ];
	var animOffsetMon = [ 0, 0, 0, 0 ], keydurationMon = [ 0, 0, 0, 0 ];
	var aniStepMon = [ 0, 0, 0, 0 ], aniTimeMon = [ 0, 0, 0, 0 ];
	var keyframeMonSet = [
		[ 70, 25, 60, 25 ],
		[ 60, 45, 20, 20, 60, 14 ],
		[ 25, 25, 25, 60, 25, 19 ],
		[ 40, 25, 60, 24 ]
	];
	var animOffsetMonSet = [
		[ 0, 70, 95, 155 ],
		[ 4, 70, 115, 135, 155, 215 ],
		[ 0, 25, 50, 75, 135, 160 ],
		[ 1, 45, 70, 130 ]
	];

	// monsterA
	// pat, holdhand, swing, handback

	// monsterB
	// swingAlone, swallow, headup, holdhand, swing, handback

	// monsterC
	// benddown, bendup, holdhand, swing, handback, ear

	// monsterD
	// rock, holdhand, swing, handback

// smile
	var smileLevels = [ 0, 0 ], smilePlanes = [], lightLevel=0, smileThreshold=200;
	var smileStatus = [ false, false ], smilePastStatus = [ false, false ], monsterSwallow = false, holdingHands = false;
	var swallowIndex = null, measuringSmile=false, sumOfSmile = 0, measureReset = false;
	var smileTime = [ 0, 0 ], noSmileTime = [ 0, 0 ], noSmileDuration = 2000;
	var seeNoSmile = [false, false], reallySeeNoSmile=[false, false];
	var seeSmile = [false, false], reallySeeSmile=[false, false];

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
		bufferLoader = new BufferLoader(
			audioContext, [ '../audios/duet/nightForest.mp3',
						    '../audios/duet/firecrack.mp3',
						    '../audios/duet/monsters.mp3' ], 
					  finishedLoading
		);
		bufferLoader.load();


	time = Date.now();
	clock = new THREE.Clock();
	clock.start();

	dir = 1;
	step = dir*0.02;
	sinWave = new SinWave(timeWs[0], frequencyWs[0], amplitudeW, offsetW);

	for(var i=0; i<2; i++){
		var sW = new SinWave(timeWs[i], frequencyWs[0], amplitudeW, offsetW);
		var cW = new CosWave(timeWs[i+1], frequencyWs[i], amplitudeW, offsetW);
		var tW = new TanWave(timeWs[i+2], frequencyWs[i], amplitudeW, offsetW);

		sinWaves.push(sW);
		cosWaves.push(cW);
		tanWaves.push(tW);

		sinWRun.push(0);
		cosWRun.push(0);
		tanWRun.push(0);
	}

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
	// scene.add(light);

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
		// if(whoIamInMask==0) myStartZ = 8;
		// else                myStartZ = -8;

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
	// loadmodelTree("models/trees.js", treeMat);

	// small houses
	// tex = THREE.ImageUtils.loadTexture('images/smallHouse.png');
	// houseLocalMat = new THREE.MeshLambertMaterial( {map: tex} );
	// tex = THREE.ImageUtils.loadTexture('images/smallHouse_2.png');
	// houseRemoteMat = new THREE.MeshLambertMaterial( {map: tex} );
	// loadmodelHouse("models/houseLocal.js", "models/houseRemote.js", houseLocalMat, houseRemoteMat);


	// MANSION
	// mansion = new THREE.Object3D();
	// tex = THREE.ImageUtils.loadTexture('images/roomTexture.png');
	// houseMat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide, shading: THREE.FlatShading });
	// var loader = new THREE.JSONLoader( true );
	// for(var i=0; i<houseFiles.length; i++){
	// 	loader.load( houseFiles[i], function( geometry ) {
	// 		var tmpR = new THREE.Mesh( geometry, houseMat );
	// 		houses.push(tmpR);
	// 		scene.add(tmpR);
	// 	} );
	// }
		


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

	var eyeRotMatrix;
	var eyeRotRadian;
	var tmpM, tmpM2;
	var tmpEyeGeo;


	// LAMP
		lamp = new THREE.Object3D();

		woodTexture = THREE.ImageUtils.loadTexture('images/wood.png');
		frameMat = new THREE.MeshLambertMaterial({map: woodTexture});

		geo = new THREE.TetrahedronGeometry(0.7);
		var meshTemp = new THREE.Mesh(geo, frameMat);
		meshTemp.rotation.x = -35 * Math.PI/180;
		meshTemp.rotation.z = 30 * Math.PI/180;
		meshTemp.position.y = -29.6;
		lamp.add(meshTemp);

		geo = new THREE.BoxGeometry(0.2,30,0.2);
		transY(geo, -14.5);
		meshTemp = new THREE.Mesh(geo, frameMat);
		lamp.add(meshTemp);

		// light = new THREE.PointLight(0xffff00, 1, 15);
		light = new THREE.PointLight(0xffab00, 1, 45);
		// geo = new THREE.SphereGeometry(0.2,6,6);
		// transY(geo, -1);
			glowTexture = new THREE.ImageUtils.loadTexture('images/glow.png');
			glowAnimator = new TextureAnimator( glowTexture, 3, 1, 4, 80, [0,2,1,2] );
			mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffab00, transparent: false, blending: THREE.AdditiveBlending});
			meshTemp = new THREE.Sprite(mat);
			meshTemp.position.y = 1.1;
			meshTemp.scale.set(1.5,1.5,1.5);	//big
		light.add(meshTemp);
		light.position.y = -31;

		// 2nd one
		var lamp2 = lamp.clone();
		var light2 = new THREE.PointLight(0xffab00, 1, 45);
			mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffab00, transparent: false, blending: THREE.AdditiveBlending});
			meshTemp = new THREE.Sprite(mat);
			meshTemp.position.y = 1.1;
			meshTemp.scale.set(1.5,1.5,1.5);	//big
			light2.add(meshTemp);
			light2.position.y = -31;

		lamp.add(light);
		lamp.position.set(0,33,2);
		// lamp.position.y = 35;
		scene.add(lamp);
		lamps.push(lamp);

		lamp2.add(light2);
		lamp2.position.set(0,33,-2);
		// lamp2.position.y = 35;
		scene.add(lamp2);
		lamps.push(lamp2);

	// guys in duet
		guyTexture = THREE.ImageUtils.loadTexture('images/guyW.png');
		firstGuy = new THREE.Object3D();
		firstGuyBody = new THREE.Object3D();
		firstGuyHead = new THREE.Object3D();
		secondGuy = new THREE.Object3D();
		secondGuyBody = new THREE.Object3D();
		secondGuyHead = new THREE.Object3D();

		eyeGeo = new THREE.PlaneGeometry(2, 1.5, 1, 1);

		var loader = new THREE.JSONLoader( true );
		skinthing = THREE.ImageUtils.loadTexture( "images/glow_edit.png" );

		// v1
			loader.load( "models/Guy2/GuyB.js", function( geometry ) {

				bodyGeo = geometry.clone();

					// skinthing
						skinGeo = new THREE.Geometry();
						skinGeoOrigin = new THREE.Geometry();

						var tmpS;

						for(var i=0; i<20; i++){
							tmpS = new DS(bodyGeo.vertices[i].x, bodyGeo.vertices[i].y, bodyGeo.vertices[i].z, skinthing);
							movingSkin.push(tmpS);
						}

						// for(var i=0; i<bodyGeo.vertices.length; i++){
						// 	var vertex = bodyGeo.vertices[i].clone();
						// 	vertex.velocity = new THREE.Vector3(0, -Math.random()*2, 0);
						// 	skinGeo.vertices.push(vertex);

						// 	vertex = bodyGeo.vertices[i].clone();	
						// 	skinGeoOrigin.vertices.push(vertex);
						// 	// var normal = skinGeo.vertices.sub( v0 );
						// }

						// skinMat = new THREE.PointCloudMaterial({ size: 0.5, map: skinthing, blending: THREE.AdditiveBlending, transparent: true});
						// skinParticle = new THREE.PointCloud(skinGeo, skinMat);
						// skinParticle.sortParticles = true;
						// scene.add(skinParticle);

				// add body --> body's children[0]
				var fGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0xff0000 } ) );				
				fGuy.name = "body";
				firstGuyBody.add(fGuy);

				var sGuy = new THREE.Mesh( geometry.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0x00ff00 } ) );
				sGuy.name = "body";
				secondGuyBody.add(sGuy);

				loader.load( "models/Guy2/GuyLA.js", function( geometryC ) {
					var tmpLA = geometryC.clone();
					transY(tmpLA, -0.2);
					transZ(tmpLA, -0.1);

					var fGuy = new THREE.Mesh( tmpLA.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0xff0000 } ) );
					fGuy.name = "LA";
					fGuy.position.y = 0.2;
					fGuy.position.z = 0.1;
					// add LA --> body's children[2]
					firstGuyBody.add(fGuy);

					var sGuy = new THREE.Mesh( tmpLA.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0x00ff00 } ) );
					sGuy.name = "LA";
					sGuy.position.y = 0.2;
					sGuy.position.z = 0.1;
					secondGuyBody.add(sGuy);

					loader.load( "models/Guy2/GuyRA.js", function( geometryD ) {
						var tmpRA = geometryD.clone();
						transY(tmpRA, -0.2);
						transZ(tmpRA, -0.1);

						var fGuy = new THREE.Mesh( tmpRA.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0xff0000 } ) );
						fGuy.name = "RA";
						fGuy.position.y = 0.2;
						fGuy.position.z = 0.1;
						// add RA --> body's children[2]
						firstGuyBody.add(fGuy);
						// add body --> GUY's children[0]
						firstGuy.add( firstGuyBody );

						var sGuy = new THREE.Mesh( tmpRA.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0x00ff00 } ) );
						sGuy.name = "RA";
						sGuy.position.y = 0.2;
						sGuy.position.z = 0.1;
						secondGuyBody.add(sGuy);
						secondGuy.add( secondGuyBody );


						loader.load( "models/Guy2/GuyH.js", function( geometryB ) {
							var fGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0xff0000 } ) );

							var eyeScreen = new THREE.Mesh( eyeGeo.clone(), tvMat );
							eyeScreen.scale.set(1.5,1.5,1.5);
							// eyeScreen.position.y = 2;
							eyeScreen.position.z = 3;
							var eyeP = new THREE.Object3D();
							eyeP.add(eyeScreen);
							eyeP.position.y=-1;
							scene.add(eyeP);
							eyeParent.push(eyeP);

							firstGuyHead.add(fGuy);
							// firstGuyHead.add(eyeScreen);
							firstGuyHead.name = "head";

							// add head --> children[1]
							firstGuy.add(firstGuyHead);
							// firstGuy.add(eyeScreen);
							firstGuy.position.z = 3.5;

							scene.add( firstGuy );

							var sGuy = new THREE.Mesh( geometryB.clone(), new THREE.MeshLambertMaterial( { map: guyTexture, color: 0x00ff00 } ) );
							eyeScreen = new THREE.Mesh( eyeGeo.clone(), remoteMat );
							eyeScreen.scale.set(1.5,1.5,1.5);
							// eyeScreen.position.y = 2;
							eyeScreen.position.z = 3;
							var eyeP = new THREE.Object3D();
							eyeP.add(eyeScreen);
							eyeP.position.y=-1;
							scene.add(eyeP);
							eyeParent.push(eyeP);

							secondGuyHead.add(sGuy);
							// secondGuyHead.add(eyeScreen);
							secondGuyHead.name = "head";

							secondGuy.add(secondGuyHead);
							// secondGuy.add(eyeScreen);
							secondGuy.position.z = -3.5;
							scene.add( secondGuy );

						} );
					} );

				} );
				
			} );
	
	// // skinthing!
	// 	var tmpS;
	// 	for(var i=0; i<20; i++){
	// 		tmpS = new DS(skinGeo.vertices[i].x, skinGeo.vertices[i].y, skinGeo.vertices[i].z);
	// 		movingSkin.push(tmpS);
	// 	}

	// CIRCLE
		circleMat = new THREE.MeshLambertMaterial( { wireframe: true } );
		// loader.load( "models/circle.js", function( geometry ) {
		// 	circle = new THREE.Mesh( geometry, circleMat );
		// 	scene.add( circle );
		// } );

		var cLightMat = new THREE.SpriteMaterial({
			map: skinthing,
			color: 0xfee339, transparent: false, blending: THREE.AdditiveBlending
		});
		for(var i=0; i<20; i++){
			var cLight = new THREE.PointLight( 0xfee339, 0.5, 2 );
			var circleLight = new THREE.Sprite( cLightMat.clone() );
			circleLight.scale.set(0.3,0.3,0.3);	//size
			cLight.add( circleLight );

			cLight.position.x = Math.sin((360/20*i*Math.random())*(Math.PI/180))*5;
			cLight.position.x += 5;
			cLight.position.y = 3 + Math.random()*3;
			cLight.position.z = Math.sin((Math.PI/2 + (360/20*i*Math.random())*(Math.PI/180)))*5;
			
			scene.add( cLight );
			circles.push( cLight );
		}

	//
	skinAttractStrength = new LauraMath(1);
	skinAwayStrength = new LauraMath(0);

	// MONSTER
		loader.load( "models/monsterA2.js", function( geometry ) {
			var monTA = THREE.ImageUtils.loadTexture('images/monsterA_ani.png');
			var monAA = new TextureAnimator( monTA, 2, 1, 40, 30, [0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] );
			var monsA = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: monTA, morphTargets: true } ) );
			monsA.position.z = -15;
			scene.add( monsA );
			monsters.push( monsA );
			monsterPicAnimators.push( monAA );

			//B
			loader.load( "models/monsterB3.js", function( geometry ) {
				var monTB = THREE.ImageUtils.loadTexture('images/monsterB_ani.png');
				var monBA = new TextureAnimator( monTB, 2, 1, 40, 30, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0] );
				var monsB = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: monTB, morphTargets: true, side: THREE.DoubleSide } ) );
				monsB.position.x = 15;
				monsB.rotation.y = -Math.PI/2;
				scene.add( monsB );
				monsters.push( monsB );
				monsterPicAnimators.push( monBA );

				//C
				loader.load( "models/monsterC.js", function( geometry ) {
					var monTC = THREE.ImageUtils.loadTexture('images/monsterC_ani.png');
					var monCA = new TextureAnimator( monTC, 2, 1, 40, 30, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] );
					var monsC = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: monTC, morphTargets: true } ) );
					monsC.position.x = -15;
					monsC.rotation.y = Math.PI/2;
					scene.add( monsC );
					monsters.push( monsC );
					monsterPicAnimators.push( monCA );

					//D
					loader.load( "models/monsterD2.js", function( geometry ) {
						var monTD = THREE.ImageUtils.loadTexture('images/monsterD_ani.png');
						var monDA = new TextureAnimator( monTD, 2, 1, 40, 30, [0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] );
						var monsD = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: monTD, morphTargets: true } ) );
						monsD.position.z = 15;
						monsD.rotation.y = Math.PI;
						scene.add( monsD );
						monsters.push( monsD );
						monsterPicAnimators.push( monDA );
					} );
				} );
			} );
		} );

	//

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
	document.addEventListener( 'keyup', myKeyReleased, false );

	//

	// demo_app(videoImage.width, videoImage.height);

	//
	// scene.add(mansion);


	animate();	
}


// web audio api
function finishedLoading(bufferList){

	for(var i=0; i<bufferList.length; i++){
		var s = audioContext.createBufferSource();
		audioSources.push(s);

		var g = audioContext.createGain();
		gainNodes.push(g);

		audioSources[i].buffer = bufferList[i];
		audioSources[i].loop = true;
		audioSources[i].connect(gainNodes[i]);
		gainNodes[i].connect(audioContext.destination);
		
		audioSources[i].start(0);
	}
	gainNodes[0].gain.value = 1;
	gainNodes[1].gain.value = 0.2;
	gainNodes[2].gain.value = 0;

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

		// monsterB
		// swingAlone, swallow, headup, holdhand, swing, handback
		// monsterC
		// benddown, bendup, holdhand, swing, handback, ear
		case 49: //1 --> monster pat
			pat = true;
			holdHand = false;
			swing = false;
			handBack = false;

			changeMonAni( 0, 0 );
			changeMonAni( 1, 0 );
			changeMonAni( 2, 5 );
			changeMonAni( 3, 0 );
			// animOffsetP = animOffsets[0];
			// keyframeP = animOffsets[0];
			// currentKeyframeP = keyframeP;
			// durationP = durations[0];
			// keyduration = keyframes[0];
			// interpolationP2 = durations[0] / (keyframes[0]);
			// monsAniStep = 0;
			break;

		case 50: //2 --> monster holdhand
			pat = false;
			holdHand = true;
			swing = false;
			handBack = false;

			changeMonAni( 0, 1 );
			changeMonAni( 1, 3 );
			changeMonAni( 2, 2 );
			changeMonAni( 3, 1 );
			// animOffsetP = animOffsets[1];
			// keyframeP = animOffsets[1];
			// currentKeyframeP = keyframeP;
			// durationP = durations[1];
			// keyduration = keyframes[1];
			// interpolationP2 = durations[1] / (keyframes[1]);
			// monsAniStep = 0;
			break;

		case 51: //3 --> monster swing
			pat = false;
			holdHand = false;
			swing = true;
			handBack = false;

			changeMonAni( 0, 2 );
			changeMonAni( 1, 4 );
			changeMonAni( 2, 3 );
			changeMonAni( 3, 2 );
			// animOffsetP = animOffsets[2];
			// keyframeP = animOffsets[2];
			// currentKeyframeP = keyframeP;
			// durationP = durations[2];
			// keyduration = keyframes[2];
			// interpolationP2 = durations[2] / (keyframes[2]);
			// monsAniStep = 0;
			break;

		case 52: //4 --> monster handback
			pat = false;
			holdHand = false;
			swing = false;
			handBack = true;

			changeMonAni( 0, 3 );
			changeMonAni( 1, 5 );
			changeMonAni( 2, 4 );
			changeMonAni( 3, 3 );
			// animOffsetP = animOffsets[3];
			// keyframeP = animOffsets[3];
			// currentKeyframeP = keyframeP;
			// durationP = durations[3];
			// keyduration = keyframes[3];
			// interpolationP2 = durations[3] / (keyframes[3]);
			// monsAniStep = 0;
			break;

		case 53: //5
			changeMonAni( 1, 1 );	// swallow
			// monsters[1].position.x = 10;
			new TWEEN.Tween(monsters[1].position).to({x: 10}, 800).easing( TWEEN.Easing.Back.Out).delay(1000).start();
			new TWEEN.Tween(monsters[1].rotation).to({y: (-90+20) * Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
			// monsters[1].rotation.y = (-90+20) * Math.PI/180;
			lamps[0].children[2].intensity = 0;
			lamps[0].children[2].children[0].material.opacity = 0;
			monsterSwallow = true;

			changeMonAni( 2, 0 );	// bend down
			// monsters[2].rotation.y = (90+10)*Math.PI/180;
			new TWEEN.Tween(monsters[2].rotation).to({y: (90+10)*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
			break;

		case 54: //6
			changeMonAni( 1, 2 );
			// monsters[1].position.x = 15;
			new TWEEN.Tween(monsters[1].position).to({x: 15}, 800).easing( TWEEN.Easing.Back.Out).start();
			new TWEEN.Tween(monsters[1].rotation).to({y: -90*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start();
			// monsters[1].rotation.y = -90*Math.PI/180;
			monsterSwallow = false;

			changeMonAni( 2, 1 );
			// monsters[2].rotation.y = 90*Math.PI/180;
			new TWEEN.Tween(monsters[2].rotation).to({y: 90*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
			break;


		case 72: //h --> lift right hand
			// firstGuy.children[3].rotation.z = -1;
			// firstGuy.children[3].rotation.x = 90 * Math.PI/180;
			sGuyHandHigh = !sGuyHandHigh;
			if(sGuyHandHigh){
				new TWEEN.Tween(secondGuy.children[0].children[2].rotation).to({x: -90 * Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
				new TWEEN.Tween(secondGuy.children[0].children[2].scale).to({y: 4}, 800).easing( TWEEN.Easing.Back.Out).start(); 
			} else {
				new TWEEN.Tween(secondGuy.children[0].children[2].rotation).to({x: 0}, 800).easing( TWEEN.Easing.Back.Out).start(); 
				new TWEEN.Tween(secondGuy.children[0].children[2].scale).to({y: 1}, 800).easing( TWEEN.Easing.Back.Out).start(); 
			}

			fGuyHandHigh = !fGuyHandHigh;
			if(fGuyHandHigh){
				new TWEEN.Tween(firstGuy.children[0].children[2].rotation).to({x: -90 * Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
				new TWEEN.Tween(firstGuy.children[0].children[2].scale).to({y: 4}, 800).easing( TWEEN.Easing.Back.Out).start();
			} else {
				new TWEEN.Tween(firstGuy.children[0].children[2].rotation).to({x: 0}, 800).easing( TWEEN.Easing.Back.Out).start();
				new TWEEN.Tween(firstGuy.children[0].children[2].scale).to({y: 1}, 800).easing( TWEEN.Easing.Back.Out).start();
			}
			break;

		case 84: //t
			twoTouch = true;
			break;

	}
}

function myKeyReleased (event) {

	switch ( event.keyCode ) {

		case 84: //t
			twoTouch = false;
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
	sRun = sinWave.run()/5;
	// lamp.rotation.z = sinWave.run()/4;
	// var lightLevel = perlin.noise(time*0.001, smileLevels[0], 1);
	// var lightLevel = map_range( smileLevels[1], 0, 1023, 0.5, 3);
	// lamp.children[2].intensity = 1 + lightLevel/4;
	// lamp.children[2].children[0].material.opacity = 0.7 + lightLevel/2;
	// lamp.children[2].children[0].scale.set( 1.5 + lightLevel/4, 1.5 + lightLevel/4, 1.5 + lightLevel/4);
	// console.log(lightLevel);

	for(var i=0; i<lamps.length; i++){
		lightLevel = map_range( smileLevels[i], 0, 1023, 0.5, 3);
		// lamps[i].children[2].intensity = lightLevel;
		// lamps[i].children[2].children[0].material.opacity = lightLevel;
		lamps[i].children[2].children[0].scale.set( lightLevel, lightLevel, lightLevel);

		if(i==0) lamps[i].rotation.z = sRun;
		else 	 lamps[i].rotation.z = -sRun;
	}
	

	glowAnimator.updateLaura( 300*dt );

	
	// firstGuy.rotation.setFromQuaternion( eyeFinalQ );

	// headLight
		// headLight.position.z = camPos.z + 3*(Math.cos(camRot.y));
		// headLight.target.position.z = camPos.z;
		// headLight.position.x = camPos.x + 3*(Math.sin(camRot.y));
		// headLight.target.position.x = camPos.x;
		// headLight.position.y = camPos.y - 5*(Math.sin(camRot.x));
		// headLight.target.position.y = camPos.y;

	// touch
		// v1
		/*
		if( twoTouch ) {
			for(var i=0; i<skinGeo.vertices.length; i++){
				
				skinV = skinGeo.vertices[ i ];

				if ( skinV.y > -1.5 ) {
					// skinV.x += 1.5 * ( 0.50 - Math.random() ) * skinSpeed * dt;
					skinV.y += 3.0 * ( 0.25 - Math.random() ) * skinSpeed * dt;
					// skinV.z += 1.5 * ( 0.50 - Math.random() ) * skinSpeed * dt;
				}
			}

		} else {
			for(var i=0; i<skinGeo.vertices.length; i++){
				skinV = skinGeo.vertices[ i ];
				skinOriginV = skinGeoOrigin.vertices[ i ];

				skinV_D = Math.abs( skinV.x - skinOriginV.x ) + Math.abs( skinV.y - skinOriginV.y ) + Math.abs( skinV.z - skinOriginV.z );

				if ( skinV_D > 0.1 ) {
					skinV.x += - ( skinV.x - skinOriginV.x ) / skinV_D * skinSpeed * dt * ( 0.85 - Math.random() );
					skinV.y += - ( skinV.y - skinOriginV.y ) / skinV_D * skinSpeed * dt * ( 1 + Math.random() );
					skinV.z += - ( skinV.z - skinOriginV.z ) / skinV_D * skinSpeed * dt * ( 0.85 - Math.random() );
				}
			}
		}
		*/

		//v2
		if( twoTouch ) {
			skinAttractStrength.lerpValue(1.5, 0.1);
			skinAwayStrength.lerpValue(0, 0.1);
		} else {
			skinAttractStrength.lerpValue(0, 0.01);
			skinAwayStrength.lerpValue(1.5, 0.01);
		}

		for(var i=0; i<movingSkin.length; i++){

			movingSkin[i].separate(movingSkin);

			movingSkin[i].setArriveScalar(skinAttractStrength.x);
			movingSkin[i].setSeparateSingleScalar(skinAwayStrength.x);

			if(smileLevels[0]>smileLevels[1]){
				movingSkin[i].arrive( firstGuy.position );
				movingSkin[i].separateSingle( firstGuy.position );
			} else {
				movingSkin[i].arrive( secondGuy.position );
				movingSkin[i].separateSingle( secondGuy.position );
			}

			// movingSkin[i].align(lightSource);
			// movingSkin[i].cohesion(lightSource);
			// movingSkin[i].separateFromFloor(ground);
			movingSkin[i].update();

			// update to point cloud
		}

	// circle
	for(var i=0; i<sinWaves.length; i++){
		sinWRun[i] = sinWaves[i].run();
		cosWRun[i] = cosWaves[i].run();
		tanWRun[i] = tanWaves[i].run();
	}
	for(var i=0; i<20; i++){

		circles[i].position.x -= sinWRun[0]*1;
		circles[i].position.z += sinWRun[1]*1;
		circles[i].position.y += cosWRun[i%2]*1;
	}

	// monsters
		// v3
		if ( monsters.length>0 ) {
			for(var i=0; i<monsters.length; i++){
				
				// Alternate morph targets
				// freeze on certain frames
				if (   (i==0 && keyframeMon[i]!= 69 && keyframeMon[i]!=179) 
					|| (i==1 && keyframeMon[i]!=114 && keyframeMon[i]!=134 && keyframeMon[i]!=229)
					|| (i==2 && keyframeMon[i]!= 24 && keyframeMon[i]!= 49 && keyframeMon[i]!=159)
					|| (i==3 && keyframeMon[i]!=154 ) ){

					aniStepMon[i]++;

					aniTimeMon[i] = aniStepMon[i] * slowMonsAni % (keydurationMon[i]+1);
					keyframeMon[i] = Math.floor( aniTimeMon[i] ) + animOffsetMon[i];

					// if(i==1)
					// 	console.log("keyframe: " + keyframeMon[i]);

					//
					if ( keyframeMon[i] != currentKeyframeMon[i] ) {

						monsters[i].morphTargetInfluences[ lastKeyframeMon[i] ] = 0;
						monsters[i].morphTargetInfluences[ currentKeyframeMon[i] ] = 1;
						monsters[i].morphTargetInfluences[ keyframeMon[i] ] = 0;

						lastKeyframeMon[i] = currentKeyframeMon[i];
						currentKeyframeMon[i] = keyframeMon[i];
					}
				}

				// animate the textures!
				monsterPicAnimators[i].updateLaura( 300*dt );
			}

			// end of holdhand, start to swing
			if ( keyframeMon[0] == (animOffsetMonSet[0][2]-1) ) {
				changeMonAni( 0, 2 );
			}
			if ( keyframeMon[1] == (animOffsetMonSet[1][4]-1) ) {
				changeMonAni( 1, 4 );
			}
			if ( keyframeMon[2] == (animOffsetMonSet[2][3]-1) ) {
				changeMonAni( 2, 3 );
			}
			// end of holdhand, start to swing
			if ( keyframeMon[3] == (animOffsetMonSet[3][2]-1) ) {
				changeMonAni( 3, 2 );
			}
		}
	//

	// react to smile
	if( !holdingHands && smileStatus[0] && smileStatus[1] ){
		changeMonAni( 0, 1 );
		changeMonAni( 1, 3 );
		changeMonAni( 2, 2 );
		changeMonAni( 3, 1 );
		holdingHands = true;
		twoTouch = true;
	}

	if( audioAllLoaded ){
		if( holdingHands || holdHand ){
			if(gainNodes[2].gain.value<1)
				gainNodes[2].gain.value += 0.01;
		}else{
			if(gainNodes[2].gain.value>0)
				gainNodes[2].gain.value -= 0.01;
		}
	}

	//swallow
		//v1
		// if( holdingHands && !monsterSwallow ){
		// 	for(var i=0; i<smileStatus.length; i++){
		// 		if(!smileStatus[i] ){
		// 			monSwallow(i);
		// 			console.log("monster swallowed player " + i);

		// 			swallowIndex = i;
		// 			changeMonAni( 1, 1 );
		// 			changeMonAni( 2, 0 );
		// 			monsterSwallow = true;
		// 			// measuringSmile = true;

		// 			// other Monsters hands back
		// 			changeMonAni( 0, 3 );
		// 			changeMonAni( 3, 3 );
		// 		}
		// 	}
		// }

		//v2
		if( holdingHands && !monsterSwallow ){
			for(var i=0; i<smileStatus.length; i++){

				// no smile
				if( !smileStatus[i] && !seeNoSmile[i] ){

		    		seeNoSmile[i] = true;

		    		noSmileTime[i] = Date.now();
		    		console.log(i + " stops smiling");
		    	}
		    	// fake no smile
		    	if( smileStatus[i] && seeNoSmile[i] && !reallySeeNoSmile[i] ){
		    		seeNoSmile[i] = false;
		    		// noSmileTime[i] = Date.now();
		    		console.log(i + " smiles");
		    	}

		    	if( (noSmileTime[i]+noSmileDuration < Date.now()) && seeNoSmile[i] && !reallySeeNoSmile[i] ){
		    		reallySeeNoSmile[i] = true;
		    		reallySeeSmile[i] = false;

		    		console.log(i + " really no smile");
		    		
		    		//swallow!!
			    		monSwallow(i);
						console.log("monster swallowed player " + i);

						swallowIndex = i;
						changeMonAni( 1, 1 );
						changeMonAni( 2, 0 );
						monsterSwallow = true;
						holdingHands = false;
						twoTouch = false;
						// measuringSmile = true;

						// other Monsters hands back
						changeMonAni( 0, 3 );
						changeMonAni( 3, 3 );
		    	}

		  //   	// smile
				// if( smileStatus[i] && !seeSmile[i] ){

		  //   		seeSmile[i] = true;

		  //   		smileTime[i] = Date.now();
		  //   		console.log(i + " smiles!");
		  //   	}

		  //   	if( (smileTime[i]+noSmileDuration < Date.now()) && seeSmile[i] && !reallySeeSmile[i]){
		  //   		reallySeeSmile[i] = true;
		  //   		reallySeeNoSmile[i] = false;

		  //   		console.log(i + " really smiles");
		  //   		sample.trigger(7, 2);
		  //   	}

			}
		}

	
	//backoff
		if( monsterSwallow ){
			sumOfSmile += smileLevels[Math.abs(swallowIndex-1)];

			if(!measuringSmile){
				setTimeout(function(){
					console.log("sum 0f smile of player" + Math.abs(swallowIndex-1) + ": " + sumOfSmile/180);

					if(sumOfSmile/180>350){
						monBackoff();
						console.log("back to normal");
						sumOfSmile=0;
						measuringSmile=false;
						monsterSwallow=false;
						holdingHands=false;

						reallySeeNoSmile[0] = false;
						reallySeeNoSmile[1] = false;

						sample.trigger(0,1);
						sample.trigger(1,1);
						sample.trigger(2,1);

					} else {
						sumOfSmile=0;
						measuringSmile=false;
					}
					
				}, 3000);
				measuringSmile = true;
			}
		}
	//
	time = Date.now();
}

function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
}

function changeMonAni ( monIndex, aniIndex ) {

	animOffsetMon[ monIndex ] = animOffsetMonSet[ monIndex ][ aniIndex ];
	keyframeMon[ monIndex ] = animOffsetMonSet[ monIndex ][ aniIndex ];
	currentKeyframeMon[ monIndex ] = keyframeMon[ monIndex ];
	keydurationMon[ monIndex ] = keyframeMonSet[ monIndex ][ aniIndex ];
	aniStepMon[ monIndex ] = 0;

	// animOffsetP = animOffsets[2];
	// keyframeP = animOffsets[2];
	// currentKeyframeP = keyframeP;
	// durationP = durations[2];
	// keyduration = keyframes[2];
	// interpolationP2 = durations[2] / (keyframes[2]);
	// monsAniStep = 0;
}

// if swallowed first guy, direction = 1
// if swallowed second guy, direction = -1
var direction=0;
function monSwallow (playerIndex) {
	// var direction=0;
	if(playerIndex==0){
		direction = 1;
	} else {
		direction = -1;
	}

	new TWEEN.Tween(monsters[1].position).to({x: 10}, 800).easing( TWEEN.Easing.Back.Out).delay(1000).start();
	new TWEEN.Tween(monsters[1].rotation).to({y: (-90+20*direction)*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start();

	lamps[playerIndex].children[2].intensity = 0;
	lamps[playerIndex].children[2].children[0].material.opacity = 0;

	// monsterSwallow = true;
	new TWEEN.Tween(monsters[2].rotation).to({y: (90+10*direction)*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start(); 
}

function monBackoff() {
	changeMonAni( 1, 2 );
	new TWEEN.Tween(monsters[1].position).to({x: 15}, 800).easing( TWEEN.Easing.Back.Out).start();
	new TWEEN.Tween(monsters[1].rotation).to({y: -90*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start();
	// monsterSwallow = false;
	changeMonAni( 2, 1 );
	new TWEEN.Tween(monsters[2].rotation).to({y: 90*Math.PI/180}, 800).easing( TWEEN.Easing.Back.Out).start();

	lamps[Math.abs(swallowIndex)].children[2].intensity = 1;
	lamps[Math.abs(swallowIndex)].children[2].children[0].material.opacity = 1;
}

function updatePlayer(playerIndex, playerLocX, playerLocZ, playerRotY, playerQ){

	// if(playerID<myID)
	// 	var index = playerID-1+storkPlayers.length;
	// else //playerID>myID
	// 	var index = playerID-2+storkPlayers.length-1;

	if(playerIndex==1){
		firstGuy.position.x = playerLocX;
		firstGuy.position.z = playerLocZ;

		if(eyeParent[0]){
			eyeParent[0].position.x = playerLocX;
			eyeParent[0].position.z = playerLocZ;
		}

		// head
		if(firstGuy.children[1]){
			firstGuy.children[1].rotation.setFromQuaternion( playerQ );
			eyeParent[0].rotation.setFromQuaternion( playerQ );
		}
		
		// body
		// firstGuy.children[0].rotation.setFromQuaternion( playerQ );
		// firstGuy.children[0].rotation.x = 0;
		// firstGuy.children[0].rotation.z = 0;
		var ahhRotation = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );

		if(firstGuy.children[0])
			firstGuy.children[0].rotation.y = ahhRotation.y;

	}
	
	if(playerIndex==2){
		secondGuy.position.x = playerLocX;
		secondGuy.position.z = playerLocZ;
		
		if(eyeParent[1]){
			eyeParent[1].position.x = playerLocX;
			eyeParent[1].position.z = playerLocZ;
		}

		//head
		if(secondGuy.children[1]){
			secondGuy.children[1].rotation.setFromQuaternion( playerQ );
			eyeParent[1].rotation.setFromQuaternion( playerQ );
		}

		//body
		var ahhRotation2 = new THREE.Euler().setFromQuaternion( playerQ, 'YXZ' );

		if(secondGuy.children[0])
			secondGuy.children[0].rotation.y = ahhRotation2.y;
	}
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

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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
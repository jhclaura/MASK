
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

var scene, camera, container, renderer, effect, mat, geo;
var controls;
var myStartX = 3, myStartZ = 1, myStartY = 154;	//y:154
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock, waveTime;
var keyboard = new KeyboardState();
var nativePixelRatio = window.devicePixelRatio = window.devicePixelRatio ||
  Math.round(window.screen.availWidth / document.documentElement.clientWidth);

var devicePixelRatio = nativePixelRatio;

var ground, worldBall, groundLoaded = false;
var groundLower, groundLowerGeo, uniforms;
var treeTex;

var dummy;

var dir, step;


// WAVE
	var timeWs = [
		Math.PI/2, Math.PI, -Math.PI/2, 0,
		Math.PI+0.3, -Math.PI/5, Math.PI/1.1
	];
	var frequencyW = 0.2;
	var amplitudeW = 0.1;
	var offsetW = 0;
	var sinWave;

// rayCast
	var objects = [];
	var ray;
	var rays = [], downRay, floorRay;
	var projector, eyerayCaster;
	var lookDummy, lookVector;
	var intersections, floorToTerrain;

// ghost
	var ghosts = [];
	var ghostTex, ghostGeo, ghostMat;
	var ghostIDs = [];

// WEB_CAM
	var video, videoImage, videoImageContext, videoTexture;
	var videoWidth = 480, videoHeight = 320;
	var tvsets = [];
	var tvTexture, tvMat;
	var screens = [];
	var screensR = [];
	var scr;
	var tvs = [];
	var tvsR = [];
	var tvWidth;
	var eye, eyeGeo, eyeDummy, eyePos, eyeParent, puppetEye;

// computer vision
	var debugImage, debugContext;
	var img_u8, edg;
	var lightThreshold = 200;
	var marksArray = [];
	var lightBugs = [], lightBugsNum = 1, lightBugsFlyStatus = [], lightBugFlyCount = 0;
	var facePosRatio=[], faceSizeRatio=[], facePosRatioCanvas=[];
	var demo_opt = function(){
	    this.min_scale = 1;
	    this.scale_factor = 1.1;
	    this.use_canny = false;
	    this.edges_density = 0.13;
	    this.equalize_histogram = true;
	}
	var ii_sum,ii_sqsum,ii_tilted,edg,ii_canny;
    // var classifier = jsfeat.haar.frontalface;
    // var classifier = jsfeat.haar.handopen;
    // var classifier = jsfeat.haar.handfist;
    var debugSize = 0.25;
	var max_work_size = 160;

	var seeFace = false, reallySeeFace = false, reallySeeFacePast = false, sayHi = false;
	var noFace = false, reallyNoFace = false, reallyNoFacePast = false;
	var enterConversation = false;
	var seeFaceTime, noFaceTime, enterConversationTime, faceDuration = 500, noFaceDuration = 1000, conversationDuration = 1500;
	var conIndex = 0;
	var detectFaceMode = false;

// gallery guy
	var galleryGuys = [], galleryGuyTex = [], galleryGuyBone;
	var guyFaceTexture;

	var galleryAniGuy, duration = 1600, keyframe = 41 /*16*/, interpolation = duration / keyframe, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;

	var animOffset = 0, standUpOffset = 50, jumpOffset = 100;
	var standUp = false, jump = false;

	var BGColor_a, BGColor_b;

// PUPPET & YOU
	var puppet, puppetTex, puppetMat, you, youTex, youMat;
	var boyOnPuppet, boyOnPuppetTex, boyOnPuppetMat, boyOnBack, pupp;
	var durationP = 1200, keyframeP = 30, interpolationP = durationP / keyframeP, interpolationP2 = durationP / (keyframeP-1), lastKeyframeP = 0, currentKeyframeP = 0;
	var downInfP = false, upInfP = false, influcenceP = 1;

	var animOffsetP = 0, lookOffset = 30, waveOffset = 60, yesOffset = 90, noOffset = 120;
	var walking = true, looking = false, waving = false, yesing = false, noing = false;

	var feetData = [0, 0], feetPastData = [0, 0], feetStatus = [false, false];
	var feetD = 0, feetPastD = 0, feetS = false;

// ENV
	var star, starMat, glowTexture, glowTextures = [], starAnimator, starAnimators = [], stars = [];
	var starFiles = [ "images/sStar_1.png", "images/sStar_2.png", "images/sStar_3.png", "images/sStar_4.png" ];


// device
	var controlAlphaChanged = false, controlBetaChanged = false, controlGammaChanged = false;

// head
	var preHeadData = 0, currentHeadData = 0, headDataDiff = [];
	var preHeadY = 0, currentHeadY = 0, preHeadX = 0, currentHeadX = 0, preHeadZ = 0, currentHeadZ = 0;
	var headYDiff = [], headXDiff = [], headZDiff = [], headDataSum = {};
	var headMovXLevel = 0, headMovYLevel = 0, headMovZLevel = 0;
	var detectHeadStatus = false, detectHeadPastStatus = false;
	var autoDetectHead = false;
	var headDetectObj;

// mushroom
	var mushrooms = [], mushroomBones = [], mushroomMat, mushroomTex;
	var mushroomLoc = [  45,  48,  71,  67,  85,  87,  90, 106, 108, 111, 
						125, 127, 148, 146, 163, 166, 171, 188, 191, 200];

// tessellation!!
	var lightBeam, lightBeamGeo, lightBeamMat, lightBeams=[];
	var lightBeamFiles = [ 'models/lightBeams/lightB_1.js', 'models/lightBeams/lightB_2.js',
						   'models/lightBeams/lightB_3.js', 'models/lightBeams/lightB_4.js'  ];
	var mesh_T, uniforms_T, attributes_T;
	var geo_T, mat_T;
	var nv;
	var perlin = new ImprovedNoise(), noiseQuality = 1;

var rain, rainCount, rainGeo, rainMat, rainParticle, rainVelocity=[];

// Web audio api
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
	if(whoIamInMask!=1){
		bufferLoader = new BufferLoader(
			audioContext, [ '../audios/bruno_theme.mp3' ], 
					  finishedLoading
		);
		bufferLoader.load();
	}

	time = Date.now();
	clock = new THREE.Clock();
	clock.start();

	dir = 1;
	step = dir*0.02;
	sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

	camRotDeg = new THREE.Vector3( 0,0,0 );

	BGColor_a = new THREE.Color("0x7ff622");
	BGColor_b = new THREE.Color("0xcccccc");

	// RENDERER
		container = document.getElementById('render-canvas');
		// document.body.appendChild(container);

		renderer = new THREE.WebGLRenderer({
			antialias: true, 
			alpha: true
		});
		renderer.setClearColor(0x001320, 1);
		// renderer.setPixelRatio( window.devicePixelRatio );	//add
		renderer.autoClear = false;
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

	// EFFECT
		effect = new THREE.StereoEffect(renderer);
		effect.separation = 0.2;
	    effect.targetDistance = 50;
	    effect.setSize(window.innerWidth, window.innerHeight);


	// SCENE_SETUP
	scene = new THREE.Scene();

	// LIGHT
	// light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	// scene.add(light);

	light = new THREE.DirectionalLight( 0xf9ff91 );
	light.position.set(0,20,0);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffbcb8);
	light.position.set(1,1,1);
	// scene.add(light);


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

	// raysss
		downRay = new THREE.Raycaster();
		floorRay = new THREE.Raycaster();

		downRay.ray.direction.set(0,-1,0);
		floorRay.ray.direction.set(0,-1,0);


	// GROUND
		// var mat = new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading });
		// var geo = new THREE.PlaneBufferGeometry(100,100);
		// ground = new THREE.Mesh(geo, mat);
		// ground.rotation.x = -Math.PI/2;
		// ground.position.y = -3;
		// scene.add(ground);

		// mat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true });
		// geo = new THREE.SphereGeometry(100);
		// worldBall = new THREE.Mesh(geo, mat);
		// scene.add(worldBall);

		loadModelGround( 'models/terrain2.js',
						  new THREE.MeshLambertMaterial( {color: 0xcccccc, shading: THREE.FlatShading, side: THREE.DoubleSide, wireframe: true} ),
						  new THREE.MeshBasicMaterial( {color: 0xfa6786, shading: THREE.FlatShading, vertexColors: THREE.FaceColors} ));
		treeTex = THREE.ImageUtils.loadTexture('images/tree2.png');
		loadModelModel( 'models/tree2.js', new THREE.MeshLambertMaterial( {map: treeTex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide} ) );

	// LIGHT_BEAM
		glowTexture = new THREE.ImageUtils.loadTexture('images/beam.png');
		// lightBeamMat = new THREE.MeshLambertMaterial( {map: glowTexture, color: 0xffff00, transparent: true, opacity: 0.3, side: THREE.DoubleSide, vertexColors: THREE.VertexColors} )
		lightBeamMat = new THREE.MeshBasicMaterial({
				map: glowTexture,
				// color: 0xffffff,
				shading: THREE.FlatShading,
				blending: THREE.AdditiveBlending,
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide,
				depthWrite: false,
			    vertexColors: THREE.FaceColors});
		// loadModelMount( 'models/lightBeam_v2.js', lightBeamMat );

		for(var i=0; i<lightBeamFiles.length; i++){
			loadModelLight( lightBeamFiles[i], lightBeamMat );
		}

		var loader = new THREE.JSONLoader( true );
		// loader.load( "models/lightBeam_v2.js", function( geometry ) {
		// 	lightBeamGeo = geometry;
		// 	var tessellateModifier = new THREE.TessellateModifier(2);
		// 	for(var i=0; i<2; i++){
		// 		tessellateModifier.modify(lightBeamGeo);
		// 	}
		// 	lightBeam = new THREE.Mesh( lightBeamGeo, lightBeamMat );
		// 	scene.add( lightBeam );
		// } );

	// STAR
		// star = new THREE.PointLight(0xffff00, 1, 30);
			glowTexture = new THREE.ImageUtils.loadTexture('images/stars2.png');

			//
			starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
			mat = new THREE.SpriteMaterial({map: glowTexture, color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
			// star = new THREE.Sprite(mat);
			// star.position.y = 20;
			// scene.add(star);

			for(var i=0; i<starFiles.length; i++){
				glowTexture = new THREE.ImageUtils.loadTexture( starFiles[i] );
				glowTextures.push(glowTexture);
				starAnimator = new TextureAnimator( glowTexture, 4, 1, 8, 60, [0,1,2,3,2,1,3,2] );
				starAnimators.push(starAnimator);
			}

			for(var i=0; i<100; i++){
				mat = new THREE.SpriteMaterial({map: glowTextures[i%4], color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
				var st = new THREE.Sprite(mat);
				st.position.set( Math.random()*600-300, Math.random()*-100+300, Math.random()*600-300);
				st.rotation.y = Math.random()*Math.PI;
				st.scale.set(5,5,5);
				scene.add(st);
				stars.push(st);
			}


	// HEAD_DETECT
		headDetectObj = new THREE.Object3D();
		scene.add(headDetectObj);


	/*
	// LIGHTBUG
		geo = new THREE.SphereGeometry(2);
		mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		for(var i=0; i<lightBugsNum; i++){
			var lightB = new THREE.Mesh(geo, mat);
			scene.add(lightB);
			lightBugs.push(lightB);

			lightBugsFlyStatus.push( false );
		}
	*/
	
	// face detection!
		for(var i=0; i<5; i++){
			var f1 = new THREE.Vector2(0, 0);
			var f2 = new THREE.Vector2(0, 0);
			var f3 = new THREE.Vector2(0, 0);
			facePosRatio.push(f1);		
			faceSizeRatio.push(f2);			
			facePosRatioCanvas.push(f3);
		}
		

	// WEBCAM
		// debug view
		debugImage = document.getElementById('layerOnVideo');
		debugContext = debugImage.getContext('2d');
		debugContext.fillStyle = '0xffff00';
		debugContext.strokeStyle = 'red';
		debugContext.fillRect(0, 0, videoWidth*debugSize, videoHeight*debugSize);

		// video to show
		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		debugContext.strokeStyle = 'green';
		videoImageContext.fillRect(0,0,videoWidth, videoHeight);

		// texture for 3d - screen
			videoTexture = new THREE.Texture( videoImage );
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBFormat;
			videoTexture.generateMipmaps = false;

			videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
			videoTexture.needsUpdate = true;

		// texture for 3d - head
			// guyFaceTexture = new THREE.Texture( debugImage );
			// guyFaceTexture.minFilter = THREE.LinearFilter;
			// guyFaceTexture.magFilter = THREE.LinearFilter;
			// guyFaceTexture.format = THREE.RGBFormat;
			// guyFaceTexture.generateMipmaps = false;

			// guyFaceTexture.wrapS = guyFaceTexture.wrapT = guyFaceTexture.ClampToEdgeWrapping;
			// guyFaceTexture.needsUpdate = true;

		// front eye screen
			eyePos = new THREE.Vector3();
			eyeGeo = new THREE.PlaneGeometry(3, 2, 1, 1);
			tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
			eye = new THREE.Mesh(eyeGeo, tvMat);
			eye.position.z -= 6;

			eyeParent = new THREE.Object3D();
			eyeParent.add(eye);

			//add a bug inside the eye!
				// geo = new THREE.SphereGeometry(4);
				// mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
				// var lightB = new THREE.Mesh(geo, mat);
				// lightB.position.z -=60;
				// eyeParent.add(lightB);
				// lightBugs.push(lightB);

			scene.add(eyeParent);
			eyeParent.visible = false;

			// transZ(eyeGeo, myStartZ-60);
			eyeGeo.verticesNeedUpdate = true;
			eyeGeo.dynamic = true;
			// var tvGeo = new THREE.SphereGeometry(200, 16, 16);
			
			// eye.position.set(0,0,15);


	var g_tex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
	// PUPPET & YOU
		boyOnPuppetTex = THREE.ImageUtils.loadTexture('images/boyBack.png');	
		pupp = new THREE.Object3D();

		loader.load( "models/puppetBack.js", function( geometry ) {
			puppet = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: g_tex, morphTargets: true } ) );
			// puppet.position.x = 3;
			// puppet.rotation.y = -Math.PI/2;
			puppet.position.z = myStartZ-1.5;
			puppet.name = 'puppet';
			// scene.add( puppet );
			pupp.add(puppet);

			//
			loader.load( "models/boyBack.js", function( geometryB ) {
				boyOnBack = new THREE.Mesh( geometryB, new THREE.MeshBasicMaterial( { map: boyOnPuppetTex, morphTargets: true } ) );
				// boyOnBack.position.x = 3;
				// boyOnBack.rotation.y = -Math.PI/2;
				boyOnBack.position.z = myStartZ-1.5;
				boyOnBack.name = 'boyOnback';
				// scene.add( boyOnBack );

				pupp.add(boyOnBack);
				pupp.position.x = myStartX;
				pupp.rotation.y = -Math.PI/2;
				scene.add(pupp);

				//puppet's eye screen
					puppetEye = new THREE.Mesh(eyeGeo.clone(), tvMat);
					puppetEye.scale.set(0.2,0.2,0.2);
					puppetEye.position.set(0, 3, 0.5);  // for exp: 0, 2, 0.8; for sc: 0, 3, 0.5
					puppetEye.rotation.x = 15*Math.PI/180;
					pupp.add(puppetEye);
			} );
		} );

		//

		// eyerayCaster = new THREE.Raycaster();


	// mushroom!
		mushroomTex = THREE.ImageUtils.loadTexture('images/mushroom2S.png');
		for(var i=0; i<15; i++){
			loadModelMushroom( 'models/mushroom2.js', i );
		}

	//RAIN
		rainCount = 300;
		rainGeo = new THREE.Geometry();
		rain = THREE.ImageUtils.loadTexture( "images/rain.png" );
		for(var i=0; i<rainCount; i++){
			var vertex = new THREE.Vector3();
			vertex.x = Math.random()*100 + 0;
			vertex.y = Math.random()*50 - 25;
			vertex.z = Math.random()*-200+100;
			vertex.velocity = new THREE.Vector3(0, -Math.random()*2, 0);

			rainGeo.vertices.push(vertex);

			rainVelocity.push( -1-Math.random() );
		}
		rainMat = new THREE.PointCloudMaterial({ size: 1.5, map: rain, blending: THREE.AdditiveBlending, depthTest: false, transparent: true});
		rainParticle = new THREE.PointCloud(rainGeo, rainMat);
		rainParticle.sortParticles = true;
		scene.add(rainParticle);


	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "black";
	// stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);


	// window.addEventListener( 'deviceOrientation', setOrientationControls, true );
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', myKeyPressed, false );
	document.addEventListener( 'keyup', myKeyReleased, false );

	//

	// demo_app_hand(videoWidth/2, videoHeight/2);
	demo_app_BBF(videoWidth/2, videoHeight/2);

	animate();	
}


// web audio api
function finishedLoading(bufferList){

	for(var i=0; i<1; i++){
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
	gainNodes[0].gain.value = 0.8;

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

function loadModelModel (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var mod = new THREE.Mesh(geometry, meshMat);
		scene.add(mod);			
	}, "js");
}

function loadModelGround (model, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		ground = new THREE.Mesh(geometry, meshMat);
		scene.add(ground);
		groundLoaded = true;

		//lower ground
		groundLowerGeo = geometry.clone();
		groundLowerGeo.center();
		// groundLowerGeo.dynamic = true;

		var tessellateModifierG = new THREE.TessellateModifier(8);
		for(var i=0; i<3; i++){
			tessellateModifierG.modify(groundLowerGeo);
		}

		var explodeModifier = new THREE.ExplodeModifier();
		explodeModifier.modify(groundLowerGeo);

		var numFaces = groundLowerGeo.faces.length;

		groundLowerGeo = new THREE.BufferGeometry().fromGeometry( groundLowerGeo );

			var colors = new Float32Array( numFaces * 3 * 3 );
			var displacement = new Float32Array( numFaces * 3 * 3 );

			var color = new THREE.Color();

			for ( var f = 0; f < numFaces; f ++ ) {

				var index = 9 * f;

				var h = 0.2 * Math.random();
				var s = 0.5 + 0.5 * Math.random();
				var l = 0.5 + 0.5 * Math.random();

				color.setHSL( h, s, l );

				var d = 10 * ( 0.5 - Math.random() );

				for ( var i = 0; i < 3; i ++ ) {

					colors[ index + ( 3 * i )     ] = color.r;
					colors[ index + ( 3 * i ) + 1 ] = color.g;
					colors[ index + ( 3 * i ) + 2 ] = color.b;

					displacement[ index + ( 3 * i )     ] = d;
					displacement[ index + ( 3 * i ) + 1 ] = d;
					displacement[ index + ( 3 * i ) + 2 ] = d;

				}

			}

			groundLowerGeo.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			groundLowerGeo.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );

			//

			uniforms = {

				amplitude: { type: "f", value: 0.0 }

			};

			var shaderMaterial = new THREE.ShaderMaterial( {

				uniforms:       uniforms,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent

			});

			//

			// mesh = new THREE.Mesh( geometry, shaderMaterial );

			// scene.add( mesh );


		groundLower = new THREE.Mesh(groundLowerGeo, shaderMaterial);
		// groundLower.scale.set(5,5,5);
		groundLower.position.y=-300;
		scene.add(groundLower);

	}, "js");
}


var ghostSize = 0.5;

function loadModelG (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometryG){
		
		transY(geometryG, -5);

		var gh = new THREE.Mesh(geometryG, meshMat);
		ghosts.push(gh);
		scene.add(gh);			
	}, "js");
}

function loadModelMount (model, meshMat) {

	var loader = new THREE.JSONLoader();

	attributes_M = {
		displacement: {type: "v3", value: []},
		customColor: {type: "c", value: []}
	};

	uniforms_M = {
		amplitude: {type: "f", value: 0.0}
	};

	mat_M = new THREE.ShaderMaterial({
		uniforms: uniforms_M,
		attributes: attributes_M,
		vertexShader: document.getElementById('vertexshader_T').textContent,
		fragmentShader: document.getElementById('fragmentshader_T').textContent,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide
	});


	loader.load(model, function(geometry, material){

		lightBeamGeo = geometry;
		lightBeamGeo.dynamic = true;
		// lightBeamGeo.center();

		var tessellateModifier = new THREE.TessellateModifier(3);

		for(var i=0; i<3; i++){
			tessellateModifier.modify(lightBeamGeo);
			console.log( "faces", lightBeamGeo.faces.length );
		}

		var vertices_M = lightBeamGeo.vertices;
		var colors_M = attributes_M.customColor.value;
		var displacement_M = attributes_M.displacement.value;

		var v=0;

		console.log(lightBeamGeo.faces.length);

		for ( var f=0; f<lightBeamGeo.faces.length; f++ ) {

			var face = lightBeamGeo.faces[ f ];

			if ( face instanceof THREE.Face3 ) {
				nv = 3;
			} else {
				nv = 4;
			}

			var h = 0.5 * Math.random();
			var s = 0.5 + 0.5 * Math.random();
			var l = 0.5 + 0.5 * Math.random();

			var d = 10 * ( 0.5 - Math.random() );

			var x = 1 * ( 0.5 - Math.random() );
			var y = 1 * ( 0.5 - Math.random() );
			var z = 1 * ( 0.5 - Math.random() );

			for ( var i = 0; i < nv; i ++ ) {
				colors_M[ v ] = new THREE.Color();
				displacement_M[ v ] = new THREE.Vector3();

				colors_M[ v ].setHSL( h, 0.8, 0.8 );
				colors_M[ v ].convertGammaToLinear();

				displacement_M[ v ].set( x, y, z );

				v += 1;
			}
		}

		mesh_T = new THREE.Mesh(lightBeamGeo, mat_M);
		// mesh_T.scale.set(100,100,100);
		// mesh_T.position.y = 500;

		scene.add(mesh_T);
	});
}

var lightBIndex=0;
function loadModelLight( model, meshMat ) {

	var loader = new THREE.JSONLoader();

	loader.load( model, function( geometry ) {
		lightBeamGeo = geometry;
		lightBeamGeo.center();

		var tessellateModifier = new THREE.TessellateModifier(2);
		for(var i=0; i<2; i++){
			tessellateModifier.modify(lightBeamGeo);
		}
		lightBeam = new THREE.Mesh( lightBeamGeo, lightBeamMat );

			if      (lightBIndex==0) lightBeam.position.set(63,70,-60);
			else if (lightBIndex==1) lightBeam.position.set(97,61,-60);
			else if (lightBIndex==2) lightBeam.position.set(75,47,-24);
			else 					 lightBeam.position.set(13,51,-53);
		scene.add( lightBeam );
		lightBeams.push( lightBeam );

		lightBIndex++;
	} );
}


function loadModelMushroom (model, index) {
	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry, material){
		for(var i=0; i<material.length; i++){
			var m = material[i];
			m.skinning = true;

			// apply it when there's a texture for it
			m.map = mushroomTex;
			m.shadding = THREE.FlatShading;

			// m.transparent = true;
			// m.depthWrite = false;
			// m.opacity = 0.5;
			// m.side = THREE.DoubleSide;
		}

		var mushMat = new THREE.MeshFaceMaterial(material);
		var mush = new THREE.SkinnedMesh(geometry, mushMat);
		scene.add(mush);

		//location
		mush.position.copy( ground.geometry.vertices[(mushroomLoc[index])] );
		var scaleSize = Math.random()*5+3;
		mush.scale.set(scaleSize,scaleSize,scaleSize);
		mushrooms.push(mush);

		// mush.skeleton.bones[2].position.z = -5;

		// get BONES
		mushroomBones.push(mush.skeleton.bones);

		// light
			var mLight = new THREE.PointLight( 0xddfee8, 1, 70 );
			mLight.position.copy( ground.geometry.vertices[(mushroomLoc[index])] );
			mLight.position.y += 2;
			scene.add( mLight );
			mLight = new THREE.PointLight( 0xffff00, 2, 30 );
			mLight.position.copy( ground.geometry.vertices[(mushroomLoc[index])] );
			mLight.position.y += 20;
			scene.add( mLight );


	});
}

function myKeyPressed (event) {

	// console.log(camPos);

	switch ( event.keyCode ) {

		case 52: //4 --> walk
			walking = true;
			looking = false;
			waving = false;
			yesing = false;
			noing = false;
			break;

		case 53: //5 --> look
			walking = false;
			looking = true;
			waving = false;
			yesing = false;
			noing = false;
			break;

		case 54: //6 --> wave
			walking = false;
			looking = false;
			waving = true;
			yesing = false;
			noing = false;
			break;

		case 55: //7 --> yes
			walking = false;
			looking = false;
			waving = false;
			yesing = true;
			noing = false;
			break;

		case 56: //8 --> no
			walking = false;
			looking = false;
			waving = false;
			yesing = false;
			noing = true;
			break;

		case 48: //0 --> freeze
			walking = false;
			looking = false;
			waving = false;
			yesing = false;
			noing = false;
			break;

		case 82: //r --> update puppet rotation
			console.log(camRot.y);
			// puppet.rotation.y = camRot.y - Math.PI;
			// boyOnBack.rotation.y = camRot.y - Math.PI;
			pupp.rotation.y = camRot.y - Math.PI;
			break;

		case 77: //M --> start moving forward
			controls.setMoveF(true);
			// pupp.rotation.y = camRot.y - Math.PI;
			break;

		case 70: //F
			if(detectFaceMode){
				seeFace = false;
				reallyNoFace = true;
	    		reallySeeFace = false;
	    		enterConversation = false;
	    		conIndex = 0;

	    		sample.trigger(15, 2);	    		
			}
			detectFaceMode = !detectFaceMode;
			//
			ground.material.wireframe = !ground.material.wireframe;
			break;

		case 76: //l (-> look)
			eyeParent.visible = !eyeParent.visible;
			puppetEye.visible = !puppetEye.visible;
			break;
	}
}

function myKeyReleased (event) {

	switch ( event.keyCode ) {

		case 77: //M --> stop moving forward
			controls.setMoveF(false);
			break;

	}
}


function animate() {
    requestAnimationFrame(animate);
	update();
	render();
}

var swingSwitch = 0;
var camPos, camRot;

var lightData, lightDataData;

var rects;
var work_canvas;
var work_ctx;

function update() {	
	
	
	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			// videoImageContext.clearRect(0, 0, videoWidth, videoHeight);

			// videoImageContext.drawImage(video, 0, 0);	// before_5/3
			videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight);

			// videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, videoWidth, videoHeight);
			
			debugContext.drawImage(video, 0, 0, videoWidth*debugSize, videoHeight*debugSize);

			if(detectFaceMode){
	            lightData = debugContext.getImageData(0, 0, videoWidth*debugSize, videoHeight*debugSize);
	            lightDataData = lightData.data;

	            // turned greyScale
	            jsfeat.imgproc.grayscale(lightDataData, videoWidth*debugSize, videoHeight*debugSize, img_u8 );

	            // FACE!!
	            	var pyr = jsfeat.bbf.build_pyramid(img_u8, 24*2, 24*2, 4);	//tune with min,max face size

	                var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
	                rects = jsfeat.bbf.group_rectangles(rects, 1);


	                // draw only most confident one
	                	// draw_faces(debugContext, rects, videoWidth/4/img_u8.cols, 1);

	                // draw 5
	                draw_faces(debugContext, rects, videoWidth/4/img_u8.cols, 5);

	            // HAND!
	            	// if(cvOptions.equalize_histogram) {
	             //        jsfeat.imgproc.equalize_histogram(img_u8, img_u8);
	             //        // console.log('equalize histogram');
	             //    }

	            	// jsfeat.imgproc.compute_integral_image(img_u8, ii_sum, ii_sqsum, classifier.tilted ? ii_tilted : null);

	            	// jsfeat.haar.edges_density = cvOptions.edges_density;

	            	// rects = jsfeat.haar.detect_multi_scale(ii_sum, ii_sqsum, ii_tilted, cvOptions.use_canny? ii_canny : null, img_u8.cols, img_u8.rows, classifier, cvOptions.scale_factor, cvOptions.min_scale);
	             //    rects = jsfeat.haar.group_rectangles(rects, 1);

	             //    //draw only most confident one
	             //    draw_hands(debugContext, rects, videoWidth*debugSize/img_u8.cols, 1);


	            // Blur!
	            // jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
	            //  // render result back to canvas
	            //     var data_u32 = new Uint32Array(lightDataData.buffer);
	            //     var alpha = (0xff << 24);
	            //     var i = img_u8.cols*img_u8.rows, pix = 0;
	            //     while(--i >= 0) {
	            //         pix = img_u8.data[i];
	            //         data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
	            //     }
	            //     lightData.data = lightDataData;
	            //     debugContext.putImageData(lightData, 0, 0);
				
	                // to blur face on canvas!
	                var blurFacePosX = facePosRatio.x * videoWidth;
	                var blurFacePosY = facePosRatio.y * videoHeight;
	                var blurFacePosLocX = facePosRatioCanvas.x * videoWidth;
	                var blurFacePosLocY = facePosRatioCanvas.y * videoHeight;
	                var fSizeX = faceSizeRatio.x * videoWidth;
	                var fSizeY = faceSizeRatio.y * videoHeight;

	                // videoImageContext.save();
		                // videoImageContext.globalAlpha = 0.9;
	                // videoImageContext.drawImage(debugImage, blurFacePosLocX/4, blurFacePosLocY/4, fSizeX/4, fSizeY*1.5/4, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5);
		                // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX+10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
		                // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX-10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
		                // videoImageContext.drawImage(debugImage, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5, blurFacePosLocX-10, blurFacePosLocY-10, fSizeX, fSizeY*1.5);
	                // videoImageContext.restore();
            }

            // update texture for 3D
			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}
		}
	

	controls.update( Date.now() - time );
	keyboard.update();
	stats.update();
	var dt = clock.getDelta();
	// TWEEN.update();

	waveTime = clock.getElapsedTime();

	// fallRay
		downRay.ray.origin.copy(controls.getObject().position);
		floorRay.ray.origin.x = downRay.ray.origin.x;
		floorRay.ray.origin.y = 150;
		floorRay.ray.origin.z = downRay.ray.origin.z;


		if(groundLoaded){
			intersections = downRay.intersectObject(ground);
			floorToTerrain = floorRay.intersectObject(ground);

			if(intersections.length>0){
				distance = intersections[0].distance;
				distanceToTerrain = floorToTerrain[0].distance;

				controls.setDistance(distanceToTerrain);

				controls.isOnObject(true);
			}
		}

		

		// update cam pos
			camPos = controls.position().clone();
			camRot = controls.rotation().clone();

	// eyeRay
		// var directionCam = controls.getDirection().clone();
		// eyerayCaster.set( controls.getObject().position.clone(), directionCam );
		// var eyeIntersects = eyerayCaster.intersectObject( worldBall, true );

		// if ( eyeIntersects.length > 0 ) {
		// 	eyeDummy.position.copy(eyeIntersects[ 0 ].point);
		// }
	
	if(whoIamInMask==1){
		eyeParent.rotation.setFromQuaternion( eyeFinalQ );
	}
		eyeParent.position.copy(camPos);
	

	eyeGeo.verticesNeedUpdate = true;
	eyeGeo.dynamic = true;

	// eyePos.setFromMatrixPosition( eye.matrixWorld );
	// lightBugs[0].position.copy( eyePos );

	//face location
		// transfer ratio(0~1) to position(+,-)
		// e.g. ratio: 0 --> position.x: -12, position.y: -16
		// e.g. ratio: 0.5 --> position.x: 0, position.y: 0
		// e.g. ratio: 1 --> position.x: 12, position.y: 16
		var bugX = (facePosRatio.x*2-1)*12;
		var bugY = (facePosRatio.y*2-1)*12;
		// console.log("bug x: " + bugX + "bugY: " + bugY);

		// lightBugs[1].position.x = bugX;
		// lightBugs[1].position.y = bugY;

	// aniGUY
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

		} else if(!standUp && !jump){
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

	// boyOnPuppet
		
		if(looking){
			animOffsetP = lookOffset;

		} else if(waving){
			animOffsetP = waveOffset;

		} else if(yesing){
			animOffsetP = yesOffset;

		} else if(noing){
			animOffsetP = noOffset;

		} else if(walking){
			animOffsetP = 0;
		}

		if ( pupp.children[0] && pupp.children[1] ) {

				// Alternate morph targets

				// time = Date.now() % duration + animOffset;
				// keyframe = Math.floor( time / interpolation ) + 1;
				time = Date.now() % duration;
				keyframe = Math.floor( time / interpolation ) + 1 + animOffset;
				//
				time = Date.now() % (durationP);
				if(walking){
					keyframeP = Math.floor( time / interpolationP2 ) + 1 + animOffsetP;
				} else {
					time = Date.now() % durationP;
					keyframeP = Math.floor( time / interpolationP ) + animOffsetP;
				}

				// if ( keyframe != currentKeyframe ) {

				// 	galleryAniGuy.morphTargetInfluences[ lastKeyframe ] = 0;
				// 	galleryAniGuy.morphTargetInfluences[ currentKeyframe ] = 1;
				// 	galleryAniGuy.morphTargetInfluences[ keyframe ] = 0;

				// 	lastKeyframe = currentKeyframe;
				// 	currentKeyframe = keyframe;

				// 	// console.log( mesh.morphTargetInfluences );

				// }

				//
				if ( keyframeP != currentKeyframeP ) {

					//v1
						// boyOnPuppet.morphTargetInfluences[ lastKeyframeP ] = 0;
						// boyOnPuppet.morphTargetInfluences[ currentKeyframeP ] = 1;
						// boyOnPuppet.morphTargetInfluences[ keyframeP ] = 0;
					//v2
						// puppet.morphTargetInfluences[ lastKeyframeP ] = 0;
						// puppet.morphTargetInfluences[ currentKeyframeP ] = 1;
						// puppet.morphTargetInfluences[ keyframeP ] = 0;
						// boyOnBack.morphTargetInfluences[ lastKeyframeP ] = 0;
						// boyOnBack.morphTargetInfluences[ currentKeyframeP ] = 1;
						// boyOnBack.morphTargetInfluences[ keyframeP ] = 0;
					//v3
						pupp.children[0].morphTargetInfluences[ lastKeyframeP ] = 0;
						pupp.children[0].morphTargetInfluences[ currentKeyframeP ] = 1;
						pupp.children[0].morphTargetInfluences[ keyframeP ] = 0;
						pupp.children[1].morphTargetInfluences[ lastKeyframeP ] = 0;
						pupp.children[1].morphTargetInfluences[ currentKeyframeP ] = 1;
						pupp.children[1].morphTargetInfluences[ keyframeP ] = 0;

					lastKeyframeP = currentKeyframeP;
					currentKeyframeP = keyframeP;
				}

			// mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
			// mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];

			// update location
			// puppet.position.set( camPos.x+0.5, camPos.y-3.5, camPos.z );
			// boyOnBack.position.set( camPos.x+0.5, camPos.y-3.5, camPos.z );

			// if(whoIamInMask==1)
				pupp.position.set( camPos.x, camPos.y-4.5, camPos.z ); // for exp: camPos.x, camPos.y-3.5, camPos.z; for sc: camPos.x, camPos.y-4.5, camPos.z

			// puppet.rotation.y = camRot.y;
			// boyOnBack.rotation.y = camRot.y;
		}


	// STAR
		// starAnimator.updateLaura( 300*dt );
		for(var i=0; i<starAnimators.length; i++){
			starAnimators[i].updateLaura( 300*dt );
		}

	// mushroom
	if(mushrooms.length>0){
		for(var i=0; i<mushrooms.length; i++){
			mushroomBones[i][2].position.z = -1 - Math.sin(i/5 + (waveTime*(i/5)) / 3)/2;
			mushroomBones[i][1].position.z = -2 -Math.sin(i/5 + (waveTime*(i/5)) / 3)/5;
		}
	}

	/*
	////////////////////////
	// detectHeadMovement //
	////////////////////////
		// if not in autoDetectHead mode
		if(!autoDetectHead){
			// start to detect head
			detectHeadStatus = true;

			// detect for 2 sec
			// after 2 sec, stop detectHeadStatus(false)
			// used to be detecting head so detectHeadPastStatus is true
			// --> judge if shaking head or not
			setTimeout(function(){
				detectHeadStatus = false;
				detectHeadPastStatus = true;
			}, 2000);

			autoDetectHead = true;

			console.log('detect head!');
		}

		
		// detect head movement
		if ( detectHeadStatus && !detectHeadPastStatus ) {

			// Y
			currentHeadY = eyeParent.rotation.y / Math.PI * 180;
			var tempYDiff = Math.abs(currentHeadY - preHeadY);
			headYDiff.push(tempYDiff);		// save the difference into headDataDiff
			preHeadY = currentHeadY;

			// X
			currentHeadX = eyeParent.rotation.x / Math.PI * 180;
			var tempXDiff = Math.abs(currentHeadX - preHeadX);
			headXDiff.push(tempXDiff);
			preHeadX = currentHeadX;

			// Z
			currentHeadZ = eyeParent.rotation.z / Math.PI * 180;
			var tempZDiff = Math.abs(currentHeadZ - preHeadZ);
			headZDiff.push(tempZDiff);
			preHeadZ = currentHeadZ;
		}

		// stop detecting and judge result
		if ( !detectHeadStatus && detectHeadPastStatus ){

			console.log("headX: " + eyeParent.rotation.x/ Math.PI * 180 + 
						"headY: " + eyeParent.rotation.y/ Math.PI * 180 +
						"headZ: " + eyeParent.rotation.z/ Math.PI * 180);

			// console.log("head.r.x: " + headDetectObj.rotation.x/ Math.PI * 180 +
			// 			", head.r.y: " + headDetectObj.rotation.y/ Math.PI * 180 +
			// 			", head.r.z: " + headDetectObj.rotation.z/ Math.PI * 180);

			// console.log("alpha: " + controls.alpha +
			// 			", beta: " + controls.beta +
			// 			", gamma: " + controls.gamma);

			headDataSum = { x:0 , y:0, z:0 };

			for(var i=0; i<headXDiff.length; i++){
				headDataSum.x += headXDiff[i];
				headDataSum.y += headYDiff[i];
				headDataSum.z += headZDiff[i];
			}

			headMovXLevel = headDataSum.x/(headXDiff.length-1);
			headMovYLevel = headDataSum.y/(headXDiff.length-1);
			headMovZLevel = headDataSum.z/(headXDiff.length-1);

			console.log("head move x: " + headMovXLevel +
						", head move y: " + headMovYLevel +
						", head move z: " + headMovZLevel);

			if( headMovZLevel > 20 ){
				console.log("head tilt!");
				sample.trigger(4,2);

			} else if( headMovYLevel > 1 ){
				console.log("head shakes!");
				sample.trigger(3,2);

			} else if( headMovYLevel < 0.5 && headMovXLevel > 0.5 ){
				console.log("head nodes!");
				sample.trigger(2,2);

			// } else if ( (eyeParent.rotation.z/ Math.PI * 180)<-20 || (eyeParent.rotation.z/ Math.PI * 180)>20 ) {
			// 	console.log("head tilt!");
			// 	sample.trigger(4,2);

			} else {
				console.log("head not shakes!");
			}

			// only judge head once
			detectHeadPastStatus = false;
			// reset
			headXDiff = [];
			headYDiff = [];
			headZDiff = [];

			//
			autoDetectHead = false;
		}
	*/


	// lightBeam!
	//v1 - shader
		// ccccM = attributes_M.customColor.value;
		// ddddM = attributes_M.displacement.value;

		// var vM=0;
		// if(lightBeamGeo) {

		// 	// if(time%77==0 || time%38==0){
		// 		for ( var f = 0; f < lightBeamGeo.faces.length; f ++ ) {

		// 			// var h = ((( (time*0.0001 % (Math.PI/2) ) + 0.3*Math.random()-0.15 )));
					
		// 			if(f%20==0)
		// 				var h =  perlin.noise(time*0.001, f, 1) % (Math.PI/2);
		// 			// var h = (0.9 + 0.5 * Math.random()) % (Math.PI/2);
		// 			// var s = 0.5 + 0.5 * Math.random();
		// 			// var l = 0.5 + 0.5 * Math.random();

		// 			var x = 10 * ( 0.5 - Math.random() );
		// 			var y = 5 * ( 0.5 - Math.random() );
		// 			var z = 10 * ( 0.5 - Math.random() );

		// 			for ( var i = 0; i < nv; i ++ ) {
		 
		// 				ccccM[ vM ] = new THREE.Color();
		// 				ccccM[ vM ].setHSL( h, 1, 0.8 );
		// 				ccccM[ vM ].convertGammaToLinear();
						
		// 				ddddM[ vM ].set(x, y, z);

		// 				vM += 1;
		// 			}
		// 		}
		// 	// }
		// }

		// if(attributes_M && time%10==0 ) {
		// 	attributes_M.customColor.needsUpdate = true;

		// 	if(seeFace && time%30==0){
		// 		attributes_M.displacement.needsUpdate = true;
		// 	}
		// }

	// v2 - faceColor
		// if(lightBeams.length>0 && (time%50==0 || time%22==0) ){
		// 	for(var j=0; j<lightBeams.length; j++) {

		// 		for(var i=0; i<lightBeams[j].geometry.faces.length; i++){

		// 			if(j==0)
		// 				lightBeams[j].geometry.faces[i].color.setHex( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0xffffff );
		// 			else if(j==1)
		// 				lightBeams[j].geometry.faces[i].color.setHex( ( 0.15 + 0.001*Math.random()-0.0005 ) * 0xffffff );
		// 			else if(j==2)
		// 				lightBeams[j].geometry.faces[i].color.setHex( ( 0.98 + 0.001*Math.random()-0.0005 ) * 0xffffff );
		// 			else
		// 				lightBeams[j].geometry.faces[i].color.setHex( ( 0.3 + 0.001*Math.random()-0.0005 ) * 0xffffff );


		// 			// 0.7:pink, 0.3:green, 1:blue, 0.55
		// 		}

		// 		lightBeams[j].geometry.colorsNeedUpdate = true;
		// 	}
			
		// }

	// v3 - faceColor + spin
		
		for(var j=0; j<lightBeams.length; j++) {

			if(lightBeams.length>0 && (time%50==0 || time%22==0) ){
				for(var i=0; i<lightBeams[j].geometry.faces.length; i++){
					if(j==0)
						lightBeams[j].geometry.faces[i].color.setHex( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0xffffff );
					else if(j==1)
						lightBeams[j].geometry.faces[i].color.setHex( ( 0.15 + 0.001*Math.random()-0.0005 ) * 0xffffff );
					else if(j==2)
						lightBeams[j].geometry.faces[i].color.setHex( ( 0.98 + 0.001*Math.random()-0.0005 ) * 0xffffff );
					else
						lightBeams[j].geometry.faces[i].color.setHex( ( 0.3 + 0.001*Math.random()-0.0005 ) * 0xffffff );

					// 0.7:pink, 0.3:green, 1:blue, 0.55
				}
				lightBeams[j].geometry.colorsNeedUpdate = true;
			}

			lightBeams[j].rotation.y += 0.0005*(j+1);
		}

	//LOWER_GROUND
	// if(groundLower && (time%60==0 || time%32==0)){
	// 	for(var i=0; i<groundLower.geometry.faces.length; i++){
	// 		groundLower.geometry.faces[i].color.setHex( ( 0.46 + 0.001*Math.random()-0.0005 ) * 0xffffff );
	// 		groundLower.geometry.colorsNeedUpdate = true;
	// 	}
	// }

	//RAIN
		// rainParticle.rotation.y += 0.001;
		rainCount = 300;
		while(rainCount--){
			var r = rainGeo.vertices[rainCount];
			if(r.y < -2){
				r.y = Math.random()*-100+300;
				r.velocity.y = 0;
			}
			r.velocity.y = rainVelocity[rainCount];
			r.add(r.velocity);
		}
		rainParticle.geometry.__dirtyVertices = true;

	//FEET
		//v1
		// if(feetData[0] && feetData[1]){
		// 	controls.setMoveF(true);
		// } else {
		// 	controls.setMoveF(false);

		// 	for(var i=0; i<feetData.length; i++) {
		// 		if(feetData[i] != feetPastData[i]){

		// 			if (feetData[i]) puppetMode(i);
		// 			else             console.log( i + " end");

		// 			feetPastData[i] = feetData[i];
		// 		}

		// 	}
		// }

		//v2
		//sensor version
		/*
		if(feetD==3){
			controls.setMoveF(true);

			//disable all the others
				if(detectFaceMode){
					seeFace = false;
					reallyNoFace = true;
					reallySeeFace = false;
					enterConversation = false;
					conIndex = 0;
				}
				detectFaceMode = false;

				eyeParent.visible = false;
				puppetEye.visible = true;

		} else {
			controls.setMoveF(false);

				if(feetD != feetPastD){

					if (feetD) puppetMode(feetD);
					else       console.log( feetD + " end");

					feetPastD = feetD;
				}
		}
		*/

	// puppet location
	if(whoIamInMask==2 && pupp){
		pupp.rotation.y = camRot.y - Math.PI;
	}

	//
	time = Date.now();	

	if(uniforms)
		uniforms.amplitude.value = 1.0 + Math.sin( time * 0.5 );

}

function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
}

function puppetMode(type){
	if(type==1){

		if(detectFaceMode){
			seeFace = false;
			reallyNoFace = true;
			reallySeeFace = false;
			enterConversation = false;
			conIndex = 0;
		}

		detectFaceMode = !detectFaceMode;

	} else if(type==2){
		//switch eyeScreen
		eyeParent.visible = !eyeParent.visible;
		puppetEye.visible = !puppetEye.visible;
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

function demo_app_BBF(vWidth, vHeight){

	// console.log("!");
	// canvasWidth  = canvas.width;
 //    canvasHeight = canvas.height;
 //    ctx = canvas.getContext('2d');

 //    ctx.fillStyle = "rgb(0,255,0)";
 //    ctx.strokeStyle = "rgb(0,255,0)";

    var scale = Math.min(max_work_size/vWidth, max_work_size/vHeight);
    var w = (vWidth*scale)|0;
    var h = (vWidth*scale)|0;

    img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
 //    work_canvas = document.createElement('canvas');
 //    work_canvas.width = w;
 //    work_canvas.height = h;
 //    work_ctx = work_canvas.getContext('2d');

    jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
    // jsfeat.bbf.prepare_cascade(jsfeat.haar.handopen);

 //    stat.add("bbf detector");
}

function draw_faces(ctx, rects, sc, max) {
    var on = rects.length;
    if(on && max) {
        jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
    }
    var n = max || on;
    n = Math.min(n, on);

    	// if(n>0) console.log("see face");
    	// else 	console.log("no face");

    	// AUDIO!!
    		// see face
	    	if(n>0 && !seeFace){
	    		seeFace = true;

	    		seeFaceTime = Date.now();
	    		console.log("see face");
	    	}

	    	if( (seeFaceTime+faceDuration < Date.now()) && seeFace && !reallySeeFace){
	    		reallySeeFace = true;
	    		reallyNoFace = false;

	    		console.log("reallySeeFace");
	    		if (Math.random()<0.35)
		    		sample.trigger(7, 3);
		    	else if (Math.random()<0.7)
		    		sample.trigger(10, 2);
		    	else
		    		sample.trigger(1, 3);

	    		enterConversationTime = Date.now();
	    	}

	    	if( (enterConversationTime+conversationDuration < Date.now()) && reallySeeFace && !enterConversation){
	    		enterConversation = true;

	    		console.log("conversation: " + conIndex);
	    		if(conIndex==0) sample.trigger(8, 2);
	    		else 			sample.trigger((conIndex%4)+11, 2);

	    		conIndex++;

	    		setTimeout(function(){
	    			enterConversation = false;
	    			enterConversationTime = Date.now();
	    		}, conversationDuration);
	    	}

	    	// see no face
	    	if(n==0 && seeFace){
	    		seeFace = false;

	    		noFaceTime = Date.now();
	    		console.log("no face");
	    	}

	    	if( (noFaceTime+noFaceDuration < Date.now()) && !seeFace && !reallyNoFace){
	    		reallyNoFace = true;
	    		reallySeeFace = false;
	    		enterConversation = false;
	    		conIndex = 0;

	    		console.log("reallyNoFace");
	    		sample.trigger(15, 2);
	    	}


    var r;
    for(var i = 0; i < n; ++i) {
        r = rects[i];
        ctx.strokeRect((r.x*sc)|0, (r.y*sc)|0, (r.width*sc)|0, (r.height*sc)|0);

        // get face location, ratio of canvas
        facePosRatioCanvas[i].x = r.x / ctx.canvas.clientWidth;
        facePosRatioCanvas[i].y = r.y / ctx.canvas.clientHeight;
        faceSizeRatio[i].x = r.width / ctx.canvas.clientWidth;
        faceSizeRatio[i].y = r.height / ctx.canvas.clientHeight;

        facePosRatio[i].x = ( r.x + (r.width)/2 ) / ctx.canvas.clientWidth;
        facePosRatio[i].y = ( ctx.canvas.clientHeight - (r.y + (r.height)/2) ) / ctx.canvas.clientHeight;

         // console.log(ctx.canvas.clientWidth);

        // console.log( "facePosRatio.x: " + facePosRatio.x + ", facePosRatio.y: " + facePosRatio.y);
    }

    // Blur!
        jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
         // render result back to canvas
            var data_u32 = new Uint32Array(lightDataData.buffer);
            var alpha = (0xff << 24);
            var i = img_u8.cols*img_u8.rows, pix = 0;
            while(--i >= 0) {
                pix = img_u8.data[i];
                data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
            }
            lightData.data = lightDataData;
            debugContext.putImageData(lightData, 0, 0);
		
            // to blur face on canvas!
            
    for(var i = 0; i < n; ++i) {
    	// var blurFacePosX = facePosRatio[i].x * videoWidth;
     //    var blurFacePosY = facePosRatio[i].y * videoHeight;
        var blurFacePosLocX = facePosRatioCanvas[i].x * videoWidth;
        var blurFacePosLocY = facePosRatioCanvas[i].y * videoHeight;
        var fSizeX = faceSizeRatio[i].x * videoWidth;
        var fSizeY = faceSizeRatio[i].y * videoHeight;
        // videoImageContext.save();
            // videoImageContext.globalAlpha = 0.9;
        videoImageContext.drawImage(debugImage, blurFacePosLocX/4, blurFacePosLocY/4, fSizeX/4, fSizeY*1.5/4, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5);
            // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX+10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
            // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX-10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
            // videoImageContext.drawImage(debugImage, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5, blurFacePosLocX-10, blurFacePosLocY-10, fSizeX, fSizeY*1.5);
        // videoImageContext.restore();
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
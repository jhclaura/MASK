
// DETECT
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var element = document.body;

////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect;
var controls;
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

var ground, worldBall;

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
	var projector, eyerayCaster;
	var lookDummy, lookVector;

// ghost
	var ghosts = [];
	var ghostTex, ghostGeo, ghostMat;
	var ghostIDs = [];

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
	var eye, eyeGeo, eyeDummy, eyePos, eyeParent;

// computer vision
	var debugImage, debugContext;
	var img_u8;
	var lightThreshold = 200;
	var marksArray = [];
	var lightBugs = [], lightBugsNum = 1, lightBugsFlyStatus = [], lightBugFlyCount = 0;
	var facePosRatio=[], faceSizeRatio=[], facePosRatioCanvas=[];

// gallery guy
	var galleryGuys = [], galleryGuyTex = [], galleryGuyBone;
	var guyFaceTexture;

	var galleryAniGuy, duration = 1600, keyframes = 41 /*16*/, interpolation = duration / keyframes, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;

	var animOffset = 0, standUpOffset = 50, jumpOffset = 100;
	var standUp = false, jump = false;

	var BGColor_a, BGColor_b;

	var jars = [], takePicTimes = 0, jarsAmount = 14, jarTextures = [], currentPic;

	var woodMat, jarMat, specimenMat1, specimenMat2, bottleMat, bottleLidMat;


// device
	var controlAlphaChanged = false, controlBetaChanged = false, controlGammaChanged = false;

// detect head movement
	var preHeadData = 0, currentHeadData = 0, headDataDiff = [];


//WEB_AUDIO_API
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 
	var audioContext = new AudioContext();

	// var bufferLoader, convolver, mixer;
	// var source, buffer, audioBuffer, gainNode, convolverGain;
	// var micConvolver, micConvolverGain;
	// var mainVolume;
	// var samples = 1024;
	// var analyzer;
	// var buf, fft;

	// var isPlayingAudio = false;
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

	BGColor_a = new THREE.Color("0x7ff622");
	BGColor_b = new THREE.Color("0xcccccc");

	// RENDERER
		container = document.getElementById('render-canvas');
		// document.body.appendChild(container);

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

	// LIGHT
	// light = new THREE.HemisphereLight( 0xf9ff91, 0xff8956, 1);
	// scene.add(light);

	light = new THREE.DirectionalLight( 0xf9ff91 );
	light.position.set(1,1,1);
	scene.add(light);

	light = new THREE.DirectionalLight( 0xff8956 );
	light.position.set(-1,1,-1);
	scene.add(light);


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


	// GROUND
	var mat = new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading });
	var geo = new THREE.PlaneBufferGeometry(100,100);
	ground = new THREE.Mesh(geo, mat);
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -3;
	// scene.add(ground);


	// GHOST
		ghostTex = THREE.ImageUtils.loadTexture('images/poseMan2.png');
		ghostMat = new THREE.MeshLambertMaterial( {map: ghostTex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide} );
		// loadModelG("models/poseMan_S.js", ghostMat);

	// Gallery guys
		var g_tex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
		var g_mat = new THREE.MeshBasicMaterial( {map: g_tex} );
		for(var i=0; i<1; i++){
			galleryGuyTex.push(g_tex);
			
			loadModelGuy("models/galleryGuy2.js", g_mat);
		}

		g_tex = THREE.ImageUtils.loadTexture('images/galleryGuyTex.png');
		galleryGuyTex.push(g_tex);
		var loader = new THREE.JSONLoader( true );
		loader.load( "models/galleryGuy_ani2.js", function( geometry ) {

			galleryAniGuy = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: g_tex, morphTargets: true } ) );
			galleryAniGuy.position.set(7, 0, 7);
			// galleryAniGuy.rotation.y = Math.PI;
			scene.add( galleryAniGuy );
		} );

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

	// Specimen ROOM
	//v1
	/*
	// room_furniture
	var texture = THREE.ImageUtils.loadTexture('images/wood.png');
	mat = new THREE.MeshLambertMaterial({map: texture});
	loadModelGeneral("models/nonV_furniture3.js", mat);

	texture = THREE.ImageUtils.loadTexture('images/jar2.png');
	mat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0});
	loadModelGeneral("models/jars/jarsss2.js", mat);

	texture = THREE.ImageUtils.loadTexture('images/specimen1.png');
	mat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
	loadModelGeneral("models/specimen1.js", mat);

	texture = THREE.ImageUtils.loadTexture('images/specimen2.png');
	mat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
	loadModelGeneral("models/specimen2.js", mat);

	texture = THREE.ImageUtils.loadTexture('images/bottle.png');
	mat = new THREE.MeshLambertMaterial({color: 0xffff00, wireframe: true});
	loadModelGeneral("models/bottles.js", mat);

	mat = new THREE.MeshLambertMaterial({color: 0x523530});
	loadModelGeneral("models/bottleLids.js", mat);
	*/
	//v2
	var texture = THREE.ImageUtils.loadTexture('images/wood.png');
	woodMat = new THREE.MeshLambertMaterial({map: texture});

	texture = THREE.ImageUtils.loadTexture('images/jar2.png');
	jarMat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0});

	texture = THREE.ImageUtils.loadTexture('images/specimen1.png');
	specimenMat1 = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});

	texture = THREE.ImageUtils.loadTexture('images/specimen2.png');
	specimenMat2 = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});

	texture = THREE.ImageUtils.loadTexture('images/bottle.png');
	bottleMat = new THREE.MeshLambertMaterial({color: 0xffff00, wireframe: true});

	bottleLidMat = new THREE.MeshLambertMaterial({color: 0x523530});

	loadModelSpecimen("models/nonV_furniture3.js", "models/jars/jarsss2.js", "models/specimen1.js", "models/specimen2.js", "models/bottles.js", "models/bottleLids.js", woodMat, jarMat, specimenMat1, specimenMat2, bottleMat, bottleLidMat);

	//
	texture = THREE.ImageUtils.loadTexture('images/cloudGround.png');
	mat = new THREE.MeshBasicMaterial({map: texture});

	for(var i=0; i<jarsAmount; i++){
		texture = THREE.ImageUtils.loadTexture('images/cloudGround.png');
		mat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
		loadModelJar2("models/jars/jar_" + i +".js", mat);
	}

	var currPicGeo = new THREE.PlaneGeometry(4,3);
	


	
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
		debugContext.fillRect(0,0,videoWidth/4, videoHeight/4);

		// video to show
		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		videoImageContext.fillRect(0,0,videoWidth, videoHeight);

		// texture for 3d
			videoTexture = new THREE.VideoTexture( video );
			// videoTexture = new THREE.Texture( videoImage );
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBFormat;
			// videoTexture.generateMipmaps = false;

			// videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
			// videoTexture.needsUpdate = true;

		// texture for Jars
			for(var i=0; i<jarsAmount; i++){
				var jarTex = new THREE.Texture( videoImage );
				jarTex.minFilter = THREE.LinearFilter;
				jarTex.magFilter = THREE.LinearFilter;
				jarTex.format = THREE.RGBFormat;
				jarTex.generateMipmaps = false;
				// jarTex.wrapS = jarTex.wrapT = THREE.ClampToEdgeWrapping;
				// jarTex.needsUpdate = true;

				jarTextures.push(jarTex);
			}

			guyFaceTexture = new THREE.Texture( videoImage );
			guyFaceTexture.minFilter = THREE.LinearFilter;
			guyFaceTexture.magFilter = THREE.LinearFilter;
			guyFaceTexture.format = THREE.RGBFormat;
			guyFaceTexture.generateMipmaps = false;

			guyFaceTexture.wrapS = guyFaceTexture.wrapT = guyFaceTexture.ClampToEdgeWrapping;
			guyFaceTexture.needsUpdate = true;

		// eye screen --> wall ball
			worldBall = new THREE.Object3D();
			mat = new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true, side: THREE.DoubleSide });			
			// geo = new THREE.SphereGeometry(20);
			// worldBall = new THREE.Mesh(geo, mat);
			loader.load( "models/nonV_wall4.js", function( geometry ) {
				var eyeCircle = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true, side: THREE.DoubleSide }) );
				eyeCircle.scale.set(2,2,2);
				eyeCircle.position.z = -50;
				worldBall.add(eyeCircle);

					currentPic = new THREE.Mesh( currPicGeo, new THREE.MeshBasicMaterial({ map: jarTextures[0], side: THREE.DoubleSide }) );
					currentPic.scale.set(2,2,2);
					currentPic.position.set(-8, 8, -48);
					worldBall.add(currentPic);

				scene.add( worldBall );
			} );

			/*
			eyePos = new THREE.Vector3();
			eyeGeo = new THREE.PlaneGeometry(30, 20, 1, 1);
			var tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
			eye = new THREE.Mesh(eyeGeo, tvMat);
			eye.position.z -=60;

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

			// transZ(eyeGeo, myStartZ-60);
			eyeGeo.verticesNeedUpdate = true;
			eyeGeo.dynamic = true;
			// var tvGeo = new THREE.SphereGeometry(200, 16, 16);
			
			// eye.position.set(0,0,15);
			*/
			

		//

		eyerayCaster = new THREE.Raycaster();

		geo = new THREE.SphereGeometry(50);
		mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		eyeDummy = new THREE.Mesh(geo, mat);
		// scene.add(eyeDummy);




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

	//

	demo_app_BBF(videoImage.width/2, videoImage.height/2);

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

function loadModelGeneral (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var generalMesh = new THREE.Mesh(geometry, meshMat);
		scene.add(generalMesh);			
	}, "js");
}

function loadModelSpecimen (model1, model2, model3, model4, model5, model6, mat1, mat2, mat3, mat4, mat5, mat6) {
	var furnitures = [], jarsss = [], specimenA = [], specimenB = [], bottlesss = [], lidsss = [];

	var loader = new THREE.JSONLoader();
	loader.load(model1, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat1);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			furnitures.push(generalMesh);
		}
	}, "js");

	loader.load(model2, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat2);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			jarsss.push(generalMesh);
		}
	}, "js");

	loader.load(model3, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat3);
			// generalMesh.scale.set( i*0.4+1, i*0.4+1, i*0.4+1 );
			// generalMesh.position.y = i*0.5+1;
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			specimenA.push(generalMesh);
		}
	}, "js");

	loader.load(model4, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat4);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			specimenB.push(generalMesh);
		}
	}, "js");

	loader.load(model5, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat5);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			bottlesss.push(generalMesh);
		}
	}, "js");

	loader.load(model6, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat6);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			lidsss.push(generalMesh);
		}
	}, "js");
}

function loadModelJar (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var generalMesh = new THREE.Mesh(geometry, meshMat);
		scene.add(generalMesh);
		jars.push(generalMesh);
	}, "js");
}

function loadModelJar2 (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, meshMat);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			jars.push(generalMesh);
		}
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

//maskGuy_move
	function swing_RL(index_part){
		var indexx = index_part;
		var dir = 1;
		if(indexx%2==1) dir = -1;

		new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({z: -0.5*dir}, 400).easing( TWEEN.Easing.Back.InOut).start(); 
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({z: 0}, 500).easing( TWEEN.Easing.Back.InOut).start();
		}, 400);
	}

	// function swing_FB(index_part){
	// 	var indexx = index_part;

	// 	new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({x: -0.5}, 400).easing( TWEEN.Easing.Back.InOut).start(); 
	// 	setTimeout(function(){
	// 		new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({x: 0.3}, 500).easing( TWEEN.Easing.Back.InOut).start();
	// 	}, 400);
	// }

	function swing_FB(index_part){
		var indexx = index_part;

		new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({x: -0.5}, 200).easing( TWEEN.Easing.Quadratic.In).start(); 
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({x: 0.5}, 500).easing( TWEEN.Easing.Quadratic.In).start();
		}, 200);
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[1].children[ indexx ].rotation).to({x: 0}, 300).easing( TWEEN.Easing.Quadratic.In).start();
		}, 700);
	}

	function swing_head(){
		new TWEEN.Tween(littleMe.children[0].rotation).to({y: -0.5}, 400).easing( TWEEN.Easing.Elastic.Out).start(); 
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[0].rotation).to({y: 0.25}, 700).easing( TWEEN.Easing.Elastic.Out).start();
		}, 200);
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[0].rotation).to({y: 0}, 700).easing( TWEEN.Easing.Elastic.Out).start();
		}, 400);
	}

	function swing_body(){
		new TWEEN.Tween(littleMe.children[1].rotation).to({y: 0.5}, 400).easing( TWEEN.Easing.Elastic.Out).start(); 
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[1].rotation).to({y: -0.25}, 700).easing( TWEEN.Easing.Elastic.Out).start();
		}, 200);
		setTimeout(function(){
			new TWEEN.Tween(littleMe.children[1].rotation).to({y: 0}, 700).easing( TWEEN.Easing.Elastic.Out).start();
		}, 400);
	}


function loadModelGuy (model, meshMat) {

	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry, material){

		console.log(material);
		for(var i=0; i<material.length; i++){
			var m = material[i];
			m.skinning = true;
			m.color = new THREE.Color( 0xffffff );

			m.map = meshMat.map;


			// apply it when there's a texture for it
			// m.map = elmoTex;
			
			// m.shadding = THREE.FlatShading;
		}

		var guy_Mattt = new THREE.MeshFaceMaterial(material);
		var guyyy = new THREE.SkinnedMesh(geometry, guy_Mattt);
		guyyy.position.set(-7, 0, -7);
		scene.add(guyyy);
		galleryGuys.push(guyyy);

		// get BONES
		galleryGuyBone = guyyy.skeleton.bones;
	});
}

function myKeyPressed (event) {

	switch ( event.keyCode ) {

		case 49: //1 --> aniGuy swing
			standUp = false;
			jump = false;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

			break;

		case 50: //2 --> standUp
			standUp = true;
			jump = false;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

			break;

		case 51: //3 --> jump
			standUp = false;
			jump = true;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

			break;

		case 52: //4 --> save pic to jar
			var jarIndex = takePicTimes%jarsAmount;

			jars[jarIndex*3].material.map = jarTextures[jarIndex];
			jars[jarIndex*3+1].material.map = jarTextures[jarIndex];
			jars[jarIndex*3+2].material.map = jarTextures[jarIndex];

			jarTextures[jarIndex].flipY = true;
			jarTextures[jarIndex].needsUpdate = true;

			// galleryGuys[0].material.materials[0].map = jarTextures[jarIndex];
			currentPic.material.map = jarTextures[jarIndex];

			takePicTimes++;

			break;

		case 53: //5
			sample.trigger(0);

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

function update() {
	
	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			// videoImageContext.clearRect(0, 0, videoWidth, videoHeight);
			videoImageContext.drawImage(video, 0, 0);
			// videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight);
			// videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, videoWidth, videoHeight);
			
			/*
			debugContext.drawImage(video, 0, 0, videoWidth/4, videoHeight/4);

            lightData = debugContext.getImageData(0, 0, videoWidth/4, videoHeight/4);
            lightDataData = lightData.data;

            // turned grayscale
            jsfeat.imgproc.grayscale(lightDataData, videoWidth/4, videoHeight/4, img_u8 );
			

            // FACE!!
            	var pyr = jsfeat.bbf.build_pyramid(img_u8, 24*2, 24*2, 4);	//tune with min,max face size

                var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
                rects = jsfeat.bbf.group_rectangles(rects, 1);

                // draw only most confident one
                draw_faces(debugContext, rects, videoWidth/4/img_u8.cols, 5);

            */

            /*
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
			*/

			/*
                // to blur face on canvas!
                var blurFacePosX = facePosRatio.x * videoWidth;
                var blurFacePosY = facePosRatio.y * videoHeight;
                var blurFacePosLocX = facePosRatioCanvas.x * videoWidth;
                var blurFacePosLocY = facePosRatioCanvas.y * videoHeight;
                var fSizeX = faceSizeRatio.x * videoWidth;
                var fSizeY = faceSizeRatio.y * videoHeight;

                videoImageContext.save();
	                // videoImageContext.globalAlpha = 0.9;
                // videoImageContext.drawImage(debugImage, blurFacePosLocX/4, blurFacePosLocY/4, fSizeX/4, fSizeY*1.5/4, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5);
	                // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX+10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
	                // videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX-10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
	                // videoImageContext.drawImage(debugImage, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5, blurFacePosLocX-10, blurFacePosLocY-10, fSizeX, fSizeY*1.5);
                videoImageContext.restore();
            */

            // update texture for 3D
			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}
		}
		

	controls.update( Date.now() - time );
	keyboard.update();
	stats.update();
	// TWEEN.update();

	camPos = controls.position().clone();
	camRot = controls.rotation().clone();


	
	// eyeRay
		// var directionCam = controls.getDirection().clone();
		// eyerayCaster.set( controls.getObject().position.clone(), directionCam );
		// var eyeIntersects = eyerayCaster.intersectObject( worldBall, true );

		// if ( eyeIntersects.length > 0 ) {
		// 	eyeDummy.position.copy(eyeIntersects[ 0 ].point);
		// }

	// eye screen update
		worldBall.rotation.setFromQuaternion( eyeFinalQ );

		// eyeParent.rotation.setFromQuaternion( eyeFinalQ );
		// eyeParent.position.copy(camPos);

		// eyeGeo.verticesNeedUpdate = true;
		// eyeGeo.dynamic = true;

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

		if ( galleryAniGuy ) {

				// Alternate morph targets

				// time = Date.now() % duration + animOffset;
				// keyframe = Math.floor( time / interpolation ) + 1;
				time = Date.now() % duration;
				keyframe = Math.floor( time / interpolation ) + 1 + animOffset;
				// lastKeyframe = 50;
				// currentKeyframe = 50;

				if ( keyframe != currentKeyframe ) {

					galleryAniGuy.morphTargetInfluences[ lastKeyframe ] = 0;
					galleryAniGuy.morphTargetInfluences[ currentKeyframe ] = 1;
					galleryAniGuy.morphTargetInfluences[ keyframe ] = 0;

					lastKeyframe = currentKeyframe;
					currentKeyframe = keyframe;

					// console.log( mesh.morphTargetInfluences );

				}

			// mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
			// mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
		}

	// detect head movement
	if ( detectHeadStatus && !detectHeadPastStatus ) {

		currentHeadData = worldBall.rotation.y / Math.PI * 180;
		var tempDiff = Math.abs(currentHeadData - preHeadData);
		headDataDiff.push(tempDiff);

		preHeadData = currentHeadData;
	}

	if ( !detectHeadStatus && detectHeadPastStatus ){
		var headDataSum = 0;

		for(var i=1; i<headDataDiff.length; i++){
			headDataSum += headDataDiff[i];
		}

		var headMovLevel = headDataSum/(headDataDiff.length-1);
		console.log(headMovLevel);

		if( headMovLevel > 0.5 ){
			console.log("head shakes!");
			sample.trigger(0);
		} else {
			console.log("head not shakes!");
		}

		detectHeadPastStatus = false;
		headDataDiff = [];
	}

	// on Device
	if( thisIsTouchDevice ){

		if( controls.gamma<0 ){
			// renderer.setClearColor(BGColor_a);
			// controlGammaChanged = true;

		} else {
			// renderer.setClearColor(BGColor_b);
			// controlGammaChanged = false;
		}

		// console.log(controls.gamma);
	}


	//
	time = Date.now();
	
}

function render() 
{	
	// renderer.clear();

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

var max_work_size = 160;

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

 //    stat.add("bbf detector");

}

function draw_faces(ctx, rects, sc, max) {
    var on = rects.length;
    if(on && max) {
        jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
    }
    var n = max || on;
    n = Math.min(n, on);
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
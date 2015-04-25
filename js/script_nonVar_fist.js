
// DETECT
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var element = document.body;

////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect;
var controls;
var myStartX = 3, myStartZ = 1, myStartY = 155;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;
var keyboard = new KeyboardState();
var nativePixelRatio = window.devicePixelRatio = window.devicePixelRatio ||
  Math.round(window.screen.availWidth / document.documentElement.clientWidth);

var devicePixelRatio = nativePixelRatio;

var ground, worldBall;
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

// ghost
	var ghosts = [];
	var ghostTex, ghostGeo, ghostMat;
	var ghostIDs = [];

// WEB_CAM
	var video, videoImage, videoImageContext, videoTexture;
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
    var classifier = jsfeat.haar.handfist;
    var debugSize = 0.25;
	var max_work_size = 160;

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

// ENV
	var lightBeam, lightBeamMat;
	var star, starMat, glowTexture, glowTextures = [], starAnimator, starAnimators = [], stars = [];
	var starFiles = [ "images/sStar_1.png", "images/sStar_2.png", "images/sStar_3.png", "images/sStar_4.png" ];


// device
	var controlAlphaChanged = false, controlBetaChanged = false, controlGammaChanged = false;


// JSARToolkit, ref: http://www.html5rocks.com/en/tutorials/webgl/jsartoolkit_webrtc/	
	var arThreshold = 100;
	var raster, param, detectorAR, resultMat;
	var tmpAR, countAR, times = [], markers = {}, lastTime = 0;
	var canvasAR, sceneAR, cameraAR, textureAR;
	var rabbitGeo;
	var flipMatrix, flipVector;
	var tmpMatrix;



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
		renderer.setClearColor(0x001320, 1);
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
	// light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	// scene.add(light);

	light = new THREE.DirectionalLight( 0xf9ff91 );
	light.position.set(0,20,0);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffbcb8);
	light.position.set(1,1,1);
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

	// raysss
		downRay = new THREE.Raycaster();
		floorRay = new THREE.Raycaster();

		downRay.ray.direction.set(0,-1,0);
		floorRay.ray.direction.set(0,-1,0);


	// GROUND
		var mat = new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading });
		var geo = new THREE.PlaneBufferGeometry(100,100);
		ground = new THREE.Mesh(geo, mat);
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -3;
		// scene.add(ground);

		mat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
		geo = new THREE.SphereGeometry(1);
		worldBall = new THREE.Mesh(geo, mat);
		scene.add(worldBall);


		loadModelGround( 'models/terrain2.js', new THREE.MeshLambertMaterial( {color: 0xcccccc, shading: THREE.FlatShading, transparent: true, opacity: 0.01} ) );

		treeTex = THREE.ImageUtils.loadTexture('images/tree2.png');
		loadModelModel( 'models/tree2.js', new THREE.MeshLambertMaterial( {map: treeTex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide} ) );

	// LIGHT_BEAM
		lightBeamMat = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.3, side: THREE.DoubleSide, vertexColors: THREE.VertexColors} )
		loadModelModel( 'models/lightBeam_v2.js', lightBeamMat );

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

			for(var i=0; i<20; i++){
				mat = new THREE.SpriteMaterial({map: glowTextures[i%4], color: 0xffef3b, transparent: false, blending: THREE.AdditiveBlending});
				var st = new THREE.Sprite(mat);
				st.position.set( Math.random()*-40+20, 40, Math.random()*-40+20);
				st.rotation.y = Math.random()*Math.PI;
				scene.add(st);
				stars.push(st);
			}

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
			// galleryAniGuy.position.set(3, 0.4, 14.3);
			// galleryAniGuy.rotation.y = Math.PI;
			scene.add( galleryAniGuy );
		} );

	// PUPPET & YOU
		// loader.load( "models/puppetAni.js", function( geometry ) {
		// 	puppet = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: g_tex, morphTargets: true } ) );
		// 	scene.add( puppet );
		// } );

		// loader.load( "models/boyOnBack.js", function( geometry ) {
		// 	boyOnBack = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ffff, morphTargets: true } ) );
		// 	scene.add( boyOnBack );
		// } );
		
		// v1
		boyOnPuppetTex = THREE.ImageUtils.loadTexture('images/boyBack.png');
		// loader.load( "models/boyOnPuppet3.js", function( geometry ) {
		// 	boyOnPuppet = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: boyOnPuppetTex, morphTargets: true } ) );
		// 	boyOnPuppet.position.x = 3;
		// 	scene.add( boyOnPuppet );
		// } );
	
		// v2
		pupp = new THREE.Object3D();

		loader.load( "models/puppetBack.js", function( geometry ) {
			puppet = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: g_tex, morphTargets: true } ) );
			// puppet.position.x = 3;
			// puppet.rotation.y = -Math.PI/2;
			puppet.position.z = -0.5;
			puppet.name = 'puppet';
			// scene.add( puppet );
			pupp.add(puppet);
		} );

		loader.load( "models/boyBack.js", function( geometry ) {
			boyOnBack = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: boyOnPuppetTex, morphTargets: true } ) );
			// boyOnBack.position.x = 3;
			// boyOnBack.rotation.y = -Math.PI/2;
			boyOnBack.position.z = -0.5;
			boyOnBack.name = 'boyOnback';
			// scene.add( boyOnBack );

			pupp.add(boyOnBack);
			pupp.position.x = 3;
			pupp.rotation.y = -Math.PI/2;
			scene.add(pupp);
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
			guyFaceTexture = new THREE.Texture( debugImage );
			guyFaceTexture.minFilter = THREE.LinearFilter;
			guyFaceTexture.magFilter = THREE.LinearFilter;
			guyFaceTexture.format = THREE.RGBFormat;
			guyFaceTexture.generateMipmaps = false;

			guyFaceTexture.wrapS = guyFaceTexture.wrapT = guyFaceTexture.ClampToEdgeWrapping;
			guyFaceTexture.needsUpdate = true;

		// eye screen
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
			

		//

		eyerayCaster = new THREE.Raycaster();

		geo = new THREE.SphereGeometry(50);
		mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		eyeDummy = new THREE.Mesh(geo, mat);
		// scene.add(eyeDummy);


	// JSARToolkit
		raster = new NyARRgbRaster_Canvas2D(debugImage);	//debugContext
		param = new FLARParam(120, 80);
		resultMat = new NyARTransMatResult();

		// The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
		// It detects multiple ID markers. ID markers are special markers that encode a number.
		detectorAR = new FLARMultiIdMarkerDetector(param, arThreshold);

		// For tracking video set continue mode to true. In continue mode, the detector
		// tracks markers across multiple frames.
		detectorAR.setContinueMode(true);

		tmpAR = new Float32Array(16);

		// Copy the camera perspective matrix from the FLARParam to the WebGL library camera matrix.
		// The second and third parameters determine the zNear and zFar planes for the perspective matrix.
		param.copyCameraMatrix(tmpAR, 10, 10000);
		// worldAR = new THREE.Object3D();
		camera.projectionMatrix.set(tmpAR);

		loader.load( "models/rabbit.js", function( geometry ) {
			rabbitGeo = geometry;
		} );

		flipMatrix = new THREE.Matrix4();
		flipMatrix.identity();
		// flipMatrix.elements[0] = -1;
		flipMatrix.elements[5] = -1;
		// flipMatrix.elements[10] = -1;

		flipVector = new THREE.Vector3(1,-1,-1);
		tmpMatrix = new THREE.Matrix4();

		//
	    // Create scene and quad for the video.
			// textureAR = new THREE.Texture(canvasAR);
		    // var plane = new THREE.Mesh(
		    //   new THREE.PlaneGeometry(2, 2, 0),
		    //   new THREE.MeshBasicMaterial({map: textureAR})
		    // );
		    // plane.material.depthTest = false;
		    // plane.material.depthWrite = false;
		    // cameraAR = new THREE.Camera();
		    // sceneAR = new THREE.Scene();
		    // sceneAR.add(plane);
		    // sceneAR.add(cameraAR);



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

	demo_app_hand(videoWidth/2, videoHeight/2);
	// demo_app_BBF(videoWidth/2, videoHeight/2);

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

function loadModelModel (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		var mod = new THREE.Mesh(geometry, meshMat);
		scene.add(mod);			
	}, "js");
}

function loadModelGround (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		ground = new THREE.Mesh(geometry, meshMat);
		scene.add(ground);			
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

			// galleryGuys[0].material.materials[0].map = guyFaceTexture;
			// galleryAniGuy.material.map = guyFaceTexture;

			// guyFaceTexture.flipY = true;
			// guyFaceTexture.needsUpdate = true;

			break;

		case 50: //2 --> standUp
			standUp = true;
			jump = false;
			galleryAniGuy.lookAt(camPos);

			// galleryGuys[0].material.materials[0].map = guyFaceTexture;
			// galleryAniGuy.material.map = guyFaceTexture;

			// guyFaceTexture.flipY = true;
			// guyFaceTexture.needsUpdate = true;

			break;

		case 51: //3 --> jump
			standUp = false;
			jump = true;
			galleryAniGuy.lookAt(camPos);

			// galleryGuys[0].material.materials[0].map = guyFaceTexture;
			// galleryAniGuy.material.map = guyFaceTexture;

			// guyFaceTexture.flipY = true;
			// guyFaceTexture.needsUpdate = true;

			break;

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


//
THREE.Matrix4.prototype.setFromArray = function(m) {
  return this.set(
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  );
};

//

function update() {	
	
	
	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			
			// canvasAR.getContext('2d').drawImage(video, 0, 0, videoWidth*debugSize, videoHeight*debugSize);

			videoImageContext.drawImage(video, 0, 0);

			debugContext.drawImage(video, 0, 0, videoWidth*debugSize, videoHeight*debugSize);
			// debugContext.drawImage(canvasAR, 0, 0, videoWidth*debugSize, videoHeight*debugSize);

			debugImage.changed = true;
			// textureAR.needsUpdate = true;

			
			// jsfeat computer vision!
	            lightData = debugContext.getImageData(0, 0, videoWidth*debugSize, videoHeight*debugSize);
	            lightDataData = lightData.data;

	            // turned grayscale
	            jsfeat.imgproc.grayscale(lightDataData, videoWidth*debugSize, videoHeight*debugSize, img_u8 );

	            // FACE!!
	            	// var pyr = jsfeat.bbf.build_pyramid(img_u8, 24*2, 24*2, 4);	//tune with min,max face size

	             //    var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
	             //    rects = jsfeat.bbf.group_rectangles(rects, 1);


	                // draw only most confident one
	                	// draw_faces(debugContext, rects, videoWidth/4/img_u8.cols, 1);

	                // draw 5
	                // draw_faces(debugContext, rects, videoWidth/4/img_u8.cols, 5);

	            // HAND!
	            	if(cvOptions.equalize_histogram) {
	                    jsfeat.imgproc.equalize_histogram(img_u8, img_u8);
	                    // console.log('equalize histogram');
	                }

	            	jsfeat.imgproc.compute_integral_image(img_u8, ii_sum, ii_sqsum, classifier.tilted ? ii_tilted : null);

	            	jsfeat.haar.edges_density = cvOptions.edges_density;

	            	rects = jsfeat.haar.detect_multi_scale(ii_sum, ii_sqsum, ii_tilted, cvOptions.use_canny? ii_canny : null, img_u8.cols, img_u8.rows, classifier, cvOptions.scale_factor, cvOptions.min_scale);
	                rects = jsfeat.haar.group_rectangles(rects, 1);

	                //draw only most confident one
	                draw_hands(debugContext, rects, videoWidth*debugSize/img_u8.cols, 1);



	            
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
				
	            //     // to blur face on canvas!
	            //     var blurFacePosX = facePosRatio.x * videoWidth;
	            //     var blurFacePosY = facePosRatio.y * videoHeight;
	            //     var blurFacePosLocX = facePosRatioCanvas.x * videoWidth;
	            //     var blurFacePosLocY = facePosRatioCanvas.y * videoHeight;
	            //     var fSizeX = faceSizeRatio.x * videoWidth;
	            //     var fSizeY = faceSizeRatio.y * videoHeight;

	                // videoImageContext.save();
		               //  videoImageContext.globalAlpha = 0.9;
	                // videoImageContext.drawImage(debugImage, blurFacePosLocX/4, blurFacePosLocY/4, fSizeX/4, fSizeY*1.5/4, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5);
		               //  videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX+10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
		               //  videoImageContext.drawImage(debugImage, blurFacePosLocX-50, blurFacePosLocY-20, fSizeX*2, fSizeY*1.5*2, blurFacePosLocX-10-20, blurFacePosLocY-20, fSizeX*1.5, fSizeY*1.5*1.5);
		               //  videoImageContext.drawImage(debugImage, blurFacePosLocX, blurFacePosLocY, fSizeX, fSizeY*1.5, blurFacePosLocX-10, blurFacePosLocY-10, fSizeX, fSizeY*1.5);
	                // videoImageContext.restore();
    		    
	
            // update texture for 3D
			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}


			/*
			// JSARToolkit
				param.copyCameraMatrix(tmpAR, 1, 10000);
			    camera.projectionMatrix.setFromArray(tmpAR);

				countAR = detectorAR.detectMarkerLite(raster, arThreshold);

				for(var idx=0; idx<countAR; idx++ ) {
				    // Get the ID number of the detected marker.
				    var id = detectorAR.getIdMarkerData(idx);
				    var currId;

				    if (id.packetLength > 4) {
				        currId = -1;
				    } else {
				    	currId = 0;
				    	for (var i = 0; i < id.packetLength; i++ ) {
							currId = (currId << 8) | id.getPacketData(i);
						}
				    }
				    
				    if (!markers[currId]){
				    	markers[currId] = {};
				    }

				    detectorAR.getTransformMatrix(idx, resultMat);
			        markers[currId].age = 0;
			        markers[currId].transform = Object.asCopy(resultMat);

				}

				for (var i in markers) {
					var r = markers[i];
					if (r.age > 1) {
						delete markers[i];
						scene.remove(r.model);
					}
					r.age++;
				}

				for (var i in markers) {
					var m = markers[i];
					if (!m.model) {
						console.log("New catch!");

						m.model = new THREE.Object3D();
						m.model.matrixAutoUpdate = false;

						// var cube = new THREE.Mesh( new THREE.BoxGeometry(200,200,200), new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}) );
						var cube = new THREE.Mesh( rabbitGeo.clone(), new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}) );
						cube.scale.set(200,200,200);
						cube.rotation.z = Math.PI/2;

						m.model.add(cube);
						scene.add(m.model);

						
					}					

					copyMatrix(m.transform, tmpAR);
					// console.log(tmpAR);
					m.model.matrix.setFromArray(tmpAR);
					// console.log(m.model.matrix.elements);
					m.model.matrix.multiply(flipMatrix);
					// console.log(m.model.matrix.elements);

					// m.model.matrix.getInverse();

					m.model.matrixAutoUpdate = false;
				}
			*/
		}
	

	controls.update( Date.now() - time );
	keyboard.update();
	stats.update();
	var dt = clock.getDelta();
	// TWEEN.update();


	// fallRay
		downRay.ray.origin.copy(controls.getObject().position);
		floorRay.ray.origin.x = downRay.ray.origin.x;
		floorRay.ray.origin.y = 150;
		floorRay.ray.origin.z = downRay.ray.origin.z;

		var intersections = downRay.intersectObject(ground);
		var floorToTerrain = floorRay.intersectObject(ground);

		if(intersections.length>0){
			distance = intersections[0].distance;
			distanceToTerrain = floorToTerrain[0].distance;

			controls.setDistance(distanceToTerrain);
			// controls.setDropLocation(distance);

			// if(distance>-50 && distance<50){
				controls.isOnObject(true);
				// console.log("Collide!");
			// } 
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
	
	eyeParent.rotation.setFromQuaternion( eyeFinalQ );
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

		if ( galleryAniGuy && pupp.children[0] && pupp.children[1] ) {

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

				if ( keyframe != currentKeyframe ) {

					galleryAniGuy.morphTargetInfluences[ lastKeyframe ] = 0;
					galleryAniGuy.morphTargetInfluences[ currentKeyframe ] = 1;
					galleryAniGuy.morphTargetInfluences[ keyframe ] = 0;

					lastKeyframe = currentKeyframe;
					currentKeyframe = keyframe;

					// console.log( mesh.morphTargetInfluences );

				}

				//
				if ( keyframeP != currentKeyframeP ) {

					//v1
						// boyOnPuppet.morphTargetInfluences[ lastKeyframeP ] = 0;
						// boyOnPuppet.morphTargetInfluences[ currentKeyframeP ] = 1;
						// boyOnPuppet.morphTargetInfluences[ keyframeP ] = 0;
					//v2
						puppet.morphTargetInfluences[ lastKeyframeP ] = 0;
						puppet.morphTargetInfluences[ currentKeyframeP ] = 1;
						puppet.morphTargetInfluences[ keyframeP ] = 0;
						boyOnBack.morphTargetInfluences[ lastKeyframeP ] = 0;
						boyOnBack.morphTargetInfluences[ currentKeyframeP ] = 1;
						boyOnBack.morphTargetInfluences[ keyframeP ] = 0;
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
			pupp.position.set( camPos.x, camPos.y-3.5, camPos.z );

			// puppet.rotation.y = camRot.y;
			// boyOnBack.rotation.y = camRot.y;
		}


	// STAR
		// starAnimator.updateLaura( 300*dt );
		for(var i=0; i<starAnimators.length; i++){
			starAnimators[i].updateLaura( 300*dt );
		}

	// on Device
	// if( thisIsTouchDevice ){

	// 	if( controls.gamma<0 ){
	// 		renderer.setClearColor(BGColor_a);
	// 		// controlGammaChanged = true;

	// 	} else {
	// 		renderer.setClearColor(BGColor_b);
	// 		// controlGammaChanged = false;
	// 	}

	// 	// console.log(controls.gamma);
	// }


	





	//
	time = Date.now();
	
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// ref:
// https://hacks.mozilla.org/2013/10/an-ar-game-technical-overview/

function copyMatrix(mat, cm) {
	cm[0] = mat.m00;
	cm[1] = -mat.m10;
	cm[2] = mat.m20;
	cm[3] = 0;
	cm[4] = mat.m01;
	cm[5] = -mat.m11;
	cm[6] = mat.m21;
	cm[7] = 0;
	cm[8] = -mat.m02;
	cm[9] = mat.m12;
	cm[10] = -mat.m22;
	cm[11] = 0;
	cm[12] = mat.m03;
	cm[13] = -mat.m13;
	cm[14] = mat.m23;
	cm[15] = 1;
}

var getMarkerNumber = function(idx) {
    var data = detectorAR.getIdMarkerData(idx);
    if (data.packetLength > 4) {
        return -1;
    } 
    
    var result=0;
    for (var i = 0; i < data.packetLength; i++ ) {
        result = (result << 8) | data.getPacketData(i);
    }

    return result;
}

function createMarkerMesh(color) {
    var geometry = new THREE.CubeGeometry( 100,100,100 );
    var material = new THREE.MeshPhongMaterial( {color:color, side:THREE.DoubleSide } );
 
    var mesh = new THREE.Mesh( geometry, material );
 
    //Negative half the height makes the object appear "on top" of the AR Marker.
    mesh.position.z = -50;
 
    return mesh;
}

function createMarkerObject(params) {
    var modelContainer = createContainer();
 
    var modelMesh = createMarkerMesh(params.color);
    modelContainer.add( modelMesh );
 
    function transform(matrix) {
        modelContainer.transformFromArray( matrix );
    }
}



var getTransformMatrix = function(idx) {

	var mat = new NyARTransMatResult();
    detectorAR.getTransformMatrix(idx, mat);

    var cm = new Float32Array(16);
    cm[0] = mat.m00;
    cm[1] = -mat.m10;
    cm[2] = mat.m20;
    cm[3] = 0;
    cm[4] = mat.m01;
    cm[5] = -mat.m11;
    cm[6] = mat.m21;
    cm[7] = 0;
    cm[8] = -mat.m02;
    cm[9] = mat.m12;
    cm[10] = -mat.m22;
    cm[11] = 0;
    cm[12] = mat.m03;
    cm[13] = -mat.m13;
    cm[14] = mat.m23;
    cm[15] = 1;

    return cm;
}

var getCameraMatrix = function(zNear, zFar) {
    var result = new Float32Array(16);
    params.copyCameraMatrix(result, zNear, zFar);
    return result;
}

var persistTime = 1;
var newMarker = function(id, matrix) {
    return {
        id: id,
        matrix: matrix,
        age: persistTime,
    }
}


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



function render() 
{	
	// renderer.render( scene, camera );

	// effect.render( sceneAR, cameraAR );
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


function demo_app_hand(vWidth, vHeight) {

	// console.log('vWidth: ' + vWidth + ', vHeight: ' + vHeight);
	// var tW = max_work_size/vWidth;
	// var tH = max_work_size/vHeight;
	// console.log('tW: ' + tW + ', tH: ' + tH);

    var scale = Math.min(max_work_size/vWidth, max_work_size/vHeight);
    var w = (vWidth*scale)|0;
    var h = (vWidth*scale)|0;

    img_u8 = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);
    edg = new jsfeat.matrix_t(w, h, jsfeat.U8_t | jsfeat.C1_t);

    cvOptions = new demo_opt();

    ii_sum = new Int32Array((w+1)*(h+1));
    ii_sqsum = new Int32Array((w+1)*(h+1));
    ii_tilted = new Int32Array((w+1)*(h+1));
    ii_canny = new Int32Array((w+1)*(h+1));

    // jsfeat.bbf.prepare_cascade(jsfeat.haar.handopen);
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


function draw_hands(ctx, rects, sc, max) {
    var on = rects.length;


    if(on && max) {
        jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
    }

    var n = max || on;
    n = Math.min(n, on);
    var r;

    if(n>0)
        console.log('hand!');

    for(var i = 0; i < n; ++i) {
        r = rects[i];
        ctx.strokeRect((r.x*sc)|0,(r.y*sc)|0,(r.width*sc)|0,(r.height*sc)|0);
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
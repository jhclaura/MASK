
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
var controls;
var myStartX = 3, myStartZ = 1, myStartY = 0;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;
var nativePixelRatio = window.devicePixelRatio = window.devicePixelRatio ||
  Math.round(window.screen.availWidth / document.documentElement.clientWidth);

var devicePixelRatio = nativePixelRatio;

var ground, treeTex;

var dir, step;

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
	
// head
	var preHeadData = 0, currentHeadData = 0, headDataDiff = [];
	var preHeadY = 0, currentHeadY = 0, preHeadX = 0, currentHeadX = 0, preHeadZ = 0, currentHeadZ = 0;
	var headYDiff = [], headXDiff = [], headZDiff = [], headDataSum = {};
	var headMovXLevel = 0, headMovYLevel = 0, headMovZLevel = 0;
	var detectHeadStatus = false, detectHeadPastStatus = false;
	var autoDetectHead = false;
	var headDetectObj;


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

	// RENDERER
		container = document.getElementById('render-canvas');

		renderer = new THREE.WebGLRenderer({
			antialias: true, 
			alpha: true
		});
		renderer.setClearColor(0xfef28e, 1);
		renderer.autoClear = false;
		container.appendChild(renderer.domElement);

	// EFFECT
		effect = new THREE.StereoEffect(renderer);
		effect.separation = 0.2;
	    effect.targetDistance = 50;
	    effect.setSize(window.innerWidth, window.innerHeight);


	// SCENE_SETUP
	scene = new THREE.Scene();

	// LIGHT
	light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	scene.add(light);


	// CAMERA
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

	// CONTROLS
	controls = new THREE.DeviceControls(camera, true);
	scene.add( controls.getObject() );
	
	// enter Fullscreen	
	window.addEventListener('click', fullscreen, false);

	// GROUND
		var mat = new THREE.MeshLambertMaterial({ color: 0x24b572, wireframe: true });
		var geo = new THREE.PlaneBufferGeometry(100,100,10,10);
		ground = new THREE.Mesh(geo, mat);
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -3;
		scene.add(ground);
		
		mat = new THREE.MeshLambertMaterial({ color: 0x8E4A49 });
		ground = new THREE.Mesh(geo, mat);
		ground.scale.set(1.5,1.5,1.5);
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -4;
		scene.add(ground);



	// HEAD_DETECT
		headDetectObj = new THREE.Object3D();
		scene.add(headDetectObj);
		

	// WEBCAM
		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		videoImageContext.fillRect(0,0,videoWidth, videoHeight);

		// texture for 3d - screen
			videoTexture = new THREE.Texture( videoImage );
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBFormat;
			videoTexture.generateMipmaps = false;

			videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
			videoTexture.needsUpdate = true;

		// eye screen
			eyePos = new THREE.Vector3();
			eyeGeo = new THREE.PlaneGeometry(3, 2, 1, 1);
			tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
			eye = new THREE.Mesh(eyeGeo, tvMat);
			eye.position.z -= 6;

			eyeParent = new THREE.Object3D();
			eyeParent.add(eye);
			scene.add(eyeParent);

			eyeGeo.verticesNeedUpdate = true;
			eyeGeo.dynamic = true;

			
	// performance status
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '5px';
		stats.domElement.style.zIndex = 100;
		stats.domElement.children[ 0 ].style.background = "black";
		stats.domElement.children[ 0 ].children[1].style.display = "none";
		container.appendChild(stats.domElement);

	//

	window.addEventListener( 'resize', onWindowResize, false );

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
			videoImageContext.drawImage(video, 0, 0);

            // update texture for 3D
			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
			}
		}
	

	controls.update( Date.now() - time );
	stats.update();


	// update cam pos
		camPos = controls.position().clone();
		camRot = controls.rotation().clone();
	
	eyeParent.rotation.setFromQuaternion( eyeFinalQ );
	eyeParent.position.copy(camPos);

	eyeGeo.verticesNeedUpdate = true;
	eyeGeo.dynamic = true;

	//
	time = Date.now();	
}


function render() 
{	
	// renderer.render( scene, camera );
	effect.render( scene, camera );
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



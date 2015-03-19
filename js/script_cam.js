
// DETECT
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


////////////////////////////////////////////////////////////
// PointerLockControls
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
			// console.log("isTouchDevice");
			instructions.addEventListener( 'touchend', funToCall, false );
		} else {
			instructions.addEventListener( 'click', funToCall, false );
		}


	} else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	// function isTouchDevice() { 
	// 	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
	// }

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
var myStartX = Math.random()*20, myStartZ = Math.random()*20;

var banana, bananaCore, bananaGeo, bananaMat, baBone;
var baBones=[], baPeels=[], bananas=[];

var rabbit, rabbitTexture, rabbits = [];

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

//WEB_CAM
var video, videoImage, videoImageContext, videoTexture;
var tvsets = [];
var tvTexture;
var screens = [];
var screensR = [];
var scr;
var tvs = [];
var tvsR = [];
var tvWidth;


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

	// RENDERER
		container = document.getElementById('render-canvas');
		// document.body.appendChild(container);

		renderer = new THREE.WebGLRenderer({
			antialias: true, 
			alpha: true
		});
		renderer.setClearColor(0xcccccc, 1);
		// renderer.setPixelRatio( window.devicePixelRatio );
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
	light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	scene.add(light);

	// light = new THREE.DirectionalLight( 0xffffff );
	// light.position.set(20,20,20);
	// scene.add(light);


	// CAMERA
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

	// CONTROLS
	// controls = new THREE.OrbitControls(camera);
	// controls.rotateUp(Math.PI/4);
	// controls.noZoom = true;
	// controls.noPan = true;

	// controls = new THREE.DeviceControls(camera);
	controls = new THREE.DeviceControls(camera, true);
	scene.add( controls.getObject() );
	
	window.addEventListener('click', fullscreen, false);

	// window.addEventListener('deviceorientation', setOrientationControls, true);


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
	scene.add(ground);

	mat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true });
	geo = new THREE.SphereGeometry(1000);
	worldBall = new THREE.Mesh(geo, mat);
	scene.add(worldBall);

	// littleMe
		littleMeTex = THREE.ImageUtils.loadTexture('images/monkey.png');
		mat = new THREE.MeshLambertMaterial( {map: littleMeTex} );
		littleMeTex2 = THREE.ImageUtils.loadTexture('images/mask_me.png');
		var mat2 = new THREE.MeshLambertMaterial( {map: littleMeTex2} );
		loadModelMe("models/monkey.js", "models/mask/mask_body2.js", "models/mask/mask_RA2.js",
					  "models/mask/mask_LA2.js", "models/mask/mask_RL.js", "models/mask/mask_LL.js", mat, mat2);

	// BANANA
		bananaMat = new THREE.MeshFaceMaterial;
		loadModelRig("models/banana10.js", "models/banCore.js", bananaMat);

	// RABBIT
		// rabbitTexture = THREE.ImageUtils.loadTexture('images/rabbit.png');
		// mat = new THREE.MeshLambertMaterial( {map: rabbitTexture} );
		// loadModelR("models/rabbit.js", mat);

	// GHOST
		ghostTex = THREE.ImageUtils.loadTexture('images/poseMan2.png');
		ghostMat = new THREE.MeshLambertMaterial( {map: ghostTex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide} );
		loadModelG("models/poseMan_S.js", ghostMat);

	// CAM
		video = document.getElementById('monitor');
		videoImage = document.getElementById('videoImage');

		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		videoImageContext.fillRect(0,0,videoImage.width, videoImage.height);

		videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
		videoTexture.needsUpdate = true;

		var tvGeo = new THREE.BoxGeometry(40, 30, 1);
		var tvMat = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
		var eye = new THREE.Mesh(tvGeo, tvMat);
		eye.position.set(0,5,15);
		scene.add(eye);



	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);


	window.addEventListener( 'deviceOrientation', setOrientationControls, true );
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', myKeyPressed, false );

	//
	animate();	
}

// DEVICE
function setOrientationControls(e) {
	if(!e.alpha){
		return;
	}

	controls = new THREE.DeviceControls(camera, true);
	controls.connect();
	controls.update();
	//
	scene.add( controls.getObject() );

	window.addEventListener('click', fullscreen, false);

	window.removeEventListener('deviceOrientation', setOrientationControls, true);

	// console.log("ohh");
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

function loadModelMe (model_A, model_B, model_C, model_D, model_E, model_F, meshMat, meshMat2) {

	var loader = new THREE.JSONLoader();
	var m_h_geo, m_b_geo, m_ra_geo, m_la_geo, m_rl_geo, m_ll_geo;
	littleMe = new THREE.Object3D();
	var m_mat = meshMat;
	var m_mat2 = meshMat2;
	var headSize = 4;

	loader.load(model_A, function(geometryA){
		geometryA.center();
		m_h_geo = geometryA.clone();
	}, "js");

	loader.load(model_B, function(geometryB){
		geometryB.center();
		m_b_geo = geometryB.clone();
	}, "js");

	loader.load(model_C, function(geometryC){
		geometryC.center();
		m_ra_geo = geometryC.clone();
		transY(m_ra_geo, -1);
	}, "js");

	loader.load(model_D, function(geometryD){
		geometryD.center();
		m_la_geo = geometryD.clone();
		transY(m_la_geo, -1);
	}, "js");	

	loader.load(model_E, function(geometryE){
		geometryE.center();
		m_rl_geo = geometryE.clone();
		transY(m_rl_geo, -1);
	}, "js");

	loader.load(model_F, function(geometryF){
		geometryF.center();
		m_ll_geo = geometryF.clone();
		transY(m_ll_geo, -1);

		myHead = new THREE.Mesh(m_h_geo, m_mat);
		myHead.name = "my_head";
		myHead.scale.set(headSize, headSize, headSize);
		myHead.position.y = 3.3;
		littleMe.add(myHead);

		myBody = new THREE.Mesh(m_b_geo, m_mat);
		myBody.name = "my_body";
		littleMe.add(myBody);

		myRA = new THREE.Mesh(m_ra_geo, m_mat);
		myRA.name = "my_RA";
		myRA.position.set(-1.8,1,0);
		myBody.add(myRA);

		myLA = new THREE.Mesh(m_la_geo, m_mat);
		myLA.name = "my_LA";
		myLA.position.set(1.8,1,0);
		myBody.add(myLA);

		myRL = new THREE.Mesh(m_rl_geo, m_mat);
		myRL.name = "my_RL";
		myRL.position.set(-0.8,-0.9,0);
		myBody.add(myRL);

		myLL = new THREE.Mesh(m_ll_geo, m_mat);
		myLL.name = "my_LL";
		myLL.position.set(0.8,-0.9,0);
		myBody.add(myLL);

		// littleMe.position.set(0,1,10);
		// littleMe.scale.set(0.5, 0.5, 0.5);
		// littleMe.rotation.y = Math.PI;

		scene.add(littleMe);

		console.log("littleMe!");

	}, "js");
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


function myKeyPressed (event) {

	switch ( event.keyCode ) {

		case 77: //M --> swing body
			swing_body();
			break;

		case 72: //H --> swing head
			swing_head();
			break;

		case 74: //J --> right arm
			swing_RL(0);
			break;

		case 75: //K --> left arm
			swing_RL(1);
			break;

		case 76: //L --> right leg
			swing_RL(2);
			break;

		case 186: //; --> left leg
			swing_RL(3);
			break;

		case 85: //U --> right arm
			swing_FB(0);
			break;

		case 73: //I --> left arm
			swing_FB(1);
			break;

		case 79: //O --> right leg
			swing_FB(2);
			break;

		case 80: //P --> left leg
			swing_FB(3);
			break;

		case 49: // 1
			for(var i=0; i<baBones.length; i++){
				new TWEEN.Tween(baBones[i][1].rotation).to({x: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).start(); 
				new TWEEN.Tween(baBones[i][3].rotation).to({y: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).start(); 
				new TWEEN.Tween(baBones[i][5].rotation).to({x: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).start(); 
				new TWEEN.Tween(baBones[i][7].rotation).to({y: -1.5}, 700).easing( TWEEN.Easing.Elastic.Out).start(); 
			}
			break;

		case 50: // 2
			for(var i=0; i<baBones.length; i++){
				new TWEEN.Tween(baBones[i][1].rotation).to({x: 0.12}, 700).easing( TWEEN.Easing.Elastic.Out).start();
				new TWEEN.Tween(baBones[i][3].rotation).to({y: -0.105}, 700).easing( TWEEN.Easing.Elastic.Out).start();
				new TWEEN.Tween(baBones[i][5].rotation).to({x: -0.122}, 700).easing( TWEEN.Easing.Elastic.Out).start();
				new TWEEN.Tween(baBones[i][7].rotation).to({y: 0.108}, 700).easing( TWEEN.Easing.Elastic.Out).start();
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

function update()
{	
	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			videoImageContext.drawImage(video, 0, 0,videoImage.width, videoImage.height);

			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
				// tvset.dynamic = true;
			}
		}

		video.play();

	controls.update( Date.now() - time );
	keyboard.update();
	stats.update();
	TWEEN.update();

	if(littleMe.position.z>10 || littleMe.position.z<-10){
		dir *= -1;

		new TWEEN.Tween(littleMe.children[0].rotation).to({y: Math.PI}, 400).easing( TWEEN.Easing.Back.In).start();
		new TWEEN.Tween(littleMe.children[1].rotation).to({y: Math.PI}, 400).easing( TWEEN.Easing.Back.In).start();

	// 	// littleMe.position.z += 0.02;
	// 	// littleMe.rotation.y = 0;
	}

	if(littleMe.position.z>10){
		new TWEEN.Tween(littleMe.children[0].rotation).to({y: Math.PI}, 600).easing( TWEEN.Easing.Back.In).start();
		new TWEEN.Tween(littleMe.children[1].rotation).to({y: Math.PI}, 600).easing( TWEEN.Easing.Back.In).start();
	}
	if(littleMe.position.z<-10){
		new TWEEN.Tween(littleMe.children[0].rotation).to({y: 0}, 600).easing( TWEEN.Easing.Back.In).start();
		new TWEEN.Tween(littleMe.children[1].rotation).to({y: 0}, 600).easing( TWEEN.Easing.Back.In).start();
	}

	step = dir*0.02;

	littleMe.position.z += step;
	littleMe.position.y = sinWave.run();

	myPosY = formatFloat( littleMe.position.y, 3 );

	if( myPosY == -0.1 ){

		if(swingSwitch==0){
			swing_FB(1);
			swing_FB(2);

			swingSwitch++;
		} else {
			swing_FB(0);
			swing_FB(3);

			swingSwitch=0;
		}
	}


	// console.log(monkeyPosY);

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

function formatFloat(num, pos) {
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
}
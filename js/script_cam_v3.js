
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

// device
	var controlAlphaChanged = false, controlBetaChanged = false, controlGammaChanged = false;




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
		renderer.setClearColor(0xcccccc, 1);
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
	light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	scene.add(light);

	// light = new THREE.DirectionalLight( 0xffffff );
	// light.position.set(20,20,20);
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


	// GROUND
	var mat = new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading });
	var geo = new THREE.PlaneBufferGeometry(100,100);
	ground = new THREE.Mesh(geo, mat);
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -3;
	// scene.add(ground);

	mat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true });
	geo = new THREE.SphereGeometry(100);
	worldBall = new THREE.Mesh(geo, mat);
	// scene.add(worldBall);

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
		debugContext.fillRect(0,0,videoWidth/4, videoHeight/4);

		// video to show
		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffffff';
		videoImageContext.fillRect(0,0,videoWidth, videoHeight);

		// texture for 3d
			videoTexture = new THREE.Texture( videoImage );
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBFormat;
			videoTexture.generateMipmaps = false;

			videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
			videoTexture.needsUpdate = true;

		// texture for 3d
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

		case 49: //O --> aniGuy swing
			standUp = false;
			jump = false;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

			break;

		case 50: //1 --> standUp
			standUp = true;
			jump = false;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

			break;

		case 51: //2 --> jump
			standUp = false;
			jump = true;
			galleryAniGuy.lookAt(camPos);

			galleryGuys[0].material.materials[0].map = guyFaceTexture;
			galleryAniGuy.material.map = guyFaceTexture;

			guyFaceTexture.flipY = true;
			guyFaceTexture.needsUpdate = true;

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

	// on Device
	if( thisIsTouchDevice ){

		if( controls.gamma<0 ){
			renderer.setClearColor(BGColor_a);
			// controlGammaChanged = true;

		} else {
			renderer.setClearColor(BGColor_b);
			// controlGammaChanged = false;
		}

		// console.log(controls.gamma);
	}


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
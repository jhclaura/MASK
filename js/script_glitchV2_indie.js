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

				pointerControls.enabled = true;
				blocker.style.display = 'none';

			} else {

				pointerControls.enabled = false;
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

		pointerControls.enabled = true;

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


var camera, scene, renderer, container;
var sceneA, sceneB;
var cameraA, cameraB, pointerControlsB;
var width = window.innerWidth, height = window.innerHeight;
var geometry, material, mesh;
var ambient, point, shadowLight;
var controls, time = Date.now();
var clock = new THREE.Clock();

var cameraTwo;
var dummy;

var initFinished = false;



////////////////////////////////
///////// LARUA_MATH ///////////
////////////////////////////////

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

////////////////////////////////
////////////////////////////////
////////////////////////////////


var effect; // rift effect

var objects = [];

var ray;

var projector, eyerayCaster;
var lookDummy, lookVector;

var bulbAmount = 20;
var outsideBulb, insideBulb;
var lightBulbMat=[], textGlow;
var lightSource=[];
var glow=[];
var bulbChaseStrength, bulbAwayStrength;
// var lerpTest;

var ground;

// Spherical Harmonics!
	var options = [5.0, 8.0, 3.0, 3.0, 1.0, 7.0, 3.0, 3.0, 7.0];
	// Spherical_Harmonics_options.b = [1.0, 1.0, 2.0, 1.0, 4.0, 1.0, 1.0, 1.0];
	// Spherical_Harmonics_options.c = [1.0, 1.0, 1.0, 1.0, 1.0, 5.0, 6.0, 1.0];

	var mesh_SH, geo_SH, mat_SH;
	var uniforms_SH = {
		time: {	type: 'f', value: 0.0},
		m: { type: 'fv1', value: options },
		m2: { type: 'fv1', value: [1.0, 1.0, 1.0, 1.0, 1.0, 5.0, 6.0, 1.0] },
		hue: { type: 'f', value: Math.random() },
		distortion: { type: 'f', value: 0.5 },
	};


// var trees = [], triTrees = [], triSmallTrees = [], treTrees = [];
// var treeGeo, treeMat, triTreeGeo, triTreeMat, triTreeMat2;
// var owls = [], owl, owlGeo, owlTex, owlMat;
// var eyeGeo, eyeMat;
// var eyeLightRight = [], eyeLightLeft = [];


var creature;
var camCurrPos, camPrevPos, creatureCurrPos, creaturePrevPos;
var dCreaturePos, dCamPos, creatureVelocity, camVelocity;

	
// tessellation!!
	var mesh_T, uniforms_T, attributes_T;
	var geo_T, mat_T;
	var nv;

var slippers = [], mySlippers;
var slipperGeo, slipperTex, slipperMat;
var slipperRigGeo, slipperRig;
var slipperBones, singleSlipperBone;
var mouthStep=1;

var mountain, mountainGeo, mountainTex, mountainMat;
var mountain2, mountainGeo2, mountainTex2, mountainMat2;

var perlin = new ImprovedNoise(), noiseQuality = 1;
//https://gist.github.com/mrdoob/518916


var strings = [], stringGeo, stringMat = [], string, totalStrings;
var quoteTex, quoteMat, quoteGeo, guotes = [];

var stringRoutes = [
		[new THREE.Vector3( 50, 50, 50 ), new THREE.Vector3( 0, 10, -10 ), new THREE.Vector3( -30, -10, -20 )],
		[new THREE.Vector3( 0, 50, 0 ), new THREE.Vector3( 0, 5, 10 ), new THREE.Vector3( -20, -10, 20 )],
		[new THREE.Vector3( -10, 50, -10 ), new THREE.Vector3( 10, 10, 30 ), new THREE.Vector3( 10, -10, 25 )],
		[new THREE.Vector3( -30, 30, 10 ), new THREE.Vector3( 0, 5, -5 ), new THREE.Vector3( 10, -10, 0 )],
		[new THREE.Vector3( 40, 20, -30 ), new THREE.Vector3( 0, 5, 0 ), new THREE.Vector3( -20, -10, 20 )],
		[new THREE.Vector3( 10, 50, 20 ), new THREE.Vector3( 5, 10, -24 ), new THREE.Vector3( -20, -10, -25 )],
		[new THREE.Vector3( -10, 50, -50 ), new THREE.Vector3( 10, 15, 10 ), new THREE.Vector3( 10, -10, 25 )],
		[new THREE.Vector3( 0, 10, -40 ), new THREE.Vector3( 5, 5, -3 ), new THREE.Vector3( 5, -10, 10 )]
	];

var note, noteGeo, noteMat, noteTexts=[], notes=[];
var tape, tapeGeo;

var getNoteStatus = [];

var haveCollision = false;

var bed, bedTex, bedMat, bedGeo;
var showBed = false, bedFoundSound = false;
var inAnotherWorld = false;

// wallPIC
	var wallPics = [], wallPicTexs = [], wallPicMat, wallPicAnimators = [];
	var wallPicOrder_a = [0,1,2,3];
	var wallPicOrder_b = [0,1,2,3,2,3,1,0,0,0];
	var wallPicIndex = 0;

var maskGuy, maskHead, maskRA, maskRL, maskRL, maskLL;
var maskTex, maskMat;

///////////////////////////////////////////////////////////////////////

var insAudios = [], insPlayed = [];
var insConvolver, insConvolverGain;

/*
///////////////////////////////////////////////////////////////////////
// VR_SETUP
	var vrstate = new vr.State();

	if (!vr.isInstalled()) {
		//statusEl.innerText = 'NPVR plugin not installed!';
		alert('NPVR plugin not installed!');
	}

	vr.load(function(error) {
		if (error) {
			//statusEl.innerText = 'Plugin load failed: ' + error.toString();
			alert('Plugin load failed: ' + error.toString());
		}

		init();
		animate();
		// try {
		// 	init();
		// 	animate();
		// }
		// catch (error) {
		// 	//statusEl.innerText = e.toString();
		// 	console.log(error);
		// }
	});
///////////////////////////////////////////////////////////////////////
*/


// INDIE_PART
	var keyboard = new KeyboardState();

//Wave
	var timeWs = [
		Math.PI/2, Math.PI, Math.PI/3, Math.PI/7, Math.PI/21.5,
		Math.PI+0.3, Math.PI/5, Math.PI/1.1, Math.PI/2.7, Math.PI+0.520
	];
	var frequencyW = 0.0005;
	var amplitudeW = 5;
	var offsetW = 0;
	var sinWaves = [];
	var spin;

	var runnings = [];

//WEB_AUDIO_API
	var context, bufferLoader, convolver, mixer, convolverB;
	var source, buffer, audioBuffer, gainNode, convolverGain, convolverBGain;
	var mediaStreamSource;
	var samples = 1024;
	var analyzer;
	var buf, fft;

	// Pitch_detect
	//source: https://github.com/cwilso/pitchdetect
	var rafID = null;
	var tracks = null;
	var buflen = 1024;
	var buf = new Float32Array( buflen );
	var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	var detectorElem,
		pitchElem,
		noteElem,
		detuneElem,
		detuneAmount;
	var MIN_SAMPLES = 0;

	var micConvolver

	var soundLoaded = false;
	var mainVolume;

	var sound_night = {}, sound_creature = {}, sound_musicBox = {};

	//BEAT_DETECT
	//source: http://www.airtightinteractive.com/
	var waveData = [], levelData = [], level, levelHistory = [];
	var bpmTime = 0, ratedBPMTime = 550, bpmStart;
	var BEAT_HOLD_TIME = 15;		//origin: 40
	var BEAT_DECAY_RATE = 0.7;		//decay_rate: 0.98
	var BEAT_MIN = 0.2;

	//BPM
	var count = 0;
	var msecsFirst = 0, msecsPrevious = 0, msecsAvg = 633;
	var timer;
	var gotBeat = false;
	var beatCutOff = 0, beatTime;

	var frequencyByteData;	//0-256. no sound is 0
	var timeByteData;	//0-256. no sound is 128
	var levelCount = 16;

	var binCount, levelBins;

	var isPlayingAudio = false;

	var colorRed = 204;

	// window.addEventListener('load', initAudio, false);
	window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
	if (!AudioContext) {
	  throw new Error("AudioContext not supported!");
	} 
	context = new AudioContext();
	micConvolver = context.createConvolver();

	//get_microphone
		navigator.getUserMedia ||
		      (navigator.getUserMedia = navigator.mozGetUserMedia ||
		      navigator.webkitGetUserMedia || navigator.msGetUserMedia);
		     
		if (navigator.getUserMedia) {
		    navigator.webkitGetUserMedia( {audio: true}, gotStream, onError );
		} else {
		    alert('getUserMedia is not supported in this browser.');
		}
		 
		function onSuccess() {
		    alert('Successful!');
		}
		 
		function onError() {
		    alert('There has been a problem retrieving the streams - did you allow access?');
		}

	var audioBall;
	var beatBall;
	var red, yellow;

	var sample = new SoundsSample(context);

	var theVoice;

	var insAudio = {}, insAudioStatus = {};

	var frequencyReadings = [];
	var frequencySampleNumber = 30;
	var frequencyIndex=0, frequencyTotal=0, frequencyAverage=0;

	var help = {};
	var helpReadings = [];

	var playMusicBox = false;


// Indie_part
////////////////////////////////////////////////////////////////////////////

init();
animate();

////////////////////////////////////////////////////////////////////////////

function init() {

	setTimeout(function(){
		sample.trigger(6);
	}, 4000);

	setTimeout(function(){
		sample.trigger(7);
	}, 8000);


	// WEB_AUDIO_API
		red = new THREE.Color(0xff0000);
		yellow = new THREE.Color(0xffff00);

		insAudio.hi = {};
		insAudio.hey = {};
		insAudio.hmm3toBed = {};
		insAudio.areUsureUrAwake = {};
		insAudio.doUmindClosingUrEyes = {};

		insAudioStatus.openEyes = false;

	    bufferLoader = new BufferLoader(
	    	context, ['../audios/Falter_auf_dem_Klavier.mp3',
	    			  '../audios/IR/h.wav',					//mausoleum
	    			  '../audios/IR/bass.wav',
	    			  '../audios/glitch/glitch_01.mp3',		//#3
	    			  '../audios/glitch/glitch_02.mp3',
	    			  '../audios/glitch/glitch_03.mp3',
	    			  '../audios/glitch/glitch_04.mp3',
	    			  '../audios/ins/hi.mp3',				//#7
	    			  '../audios/ins/hey.mp3',
	    			  '../audios/glitch_clue.mp3',
	    			  '../audios/musicBox.mp3',
	    			  '../audios/IR/bathroom.wav'],				//#11
	    			  finishedLoading
	    	);
	    bufferLoader.load();;

	    // pitch detection
		// detectorElem = document.getElementById( "detector" );
		// canvasElem = document.getElementById( "output" );
		// pitchElem = document.getElementById( "pitch" );
		// noteElem = document.getElementById( "note" );
		// detuneElem = document.getElementById( "detune" );
		// detuneAmount = document.getElementById( "detune_amt" );


		for(var i=0; i<frequencySampleNumber; i++){
			frequencyReadings.push(0);			
		}

		help.sampleNumber = 50;
		help.index = 0;
		help.total = 0;
		help.average = 0;
		for(var i=0; i<help.sampleNumber; i++){
			helpReadings.push(0);
		}



	bulbChaseStrength = new LauraMath(0);
	bulbAwayStrength = new LauraMath(0.5);

	dCreaturePos = new THREE.Vector3();
	dCamPos = new THREE.Vector3();
	creatureVelocity = new THREE.Vector3();
	camVelocity = new THREE.Vector3();
	camCurrPos = new THREE.Vector3();
	camPrevPos = new THREE.Vector3();
	creatureCurrPos = new THREE.Vector3();
	creaturePrevPos = new THREE.Vector3();
 

	// SET_UP
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	sceneA = new THREE.Scene();
	sceneB = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0xfcc9df, 0.006 );

	cameraA = new THREE.PerspectiveCamera( 50, (window.innerWidth/2) / window.innerHeight, 0.1, 100000 );
	cameraB = new THREE.PerspectiveCamera( 50, (window.innerWidth/2) / window.innerHeight, 0.1, 100000 );

	// PointerLockControl
	pointerControls = new THREE.PointerLockControls(cameraA);
	sceneA.add( pointerControls.getObject() );

	pointerControlsB = new THREE.PointerLockControls(cameraB);
	sceneB.add( pointerControlsB.getObject() );

	var dummyGeo = new THREE.CylinderGeometry(2,2,4);
	var dummyMat = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
	dummy = new THREE.Mesh(dummyGeo, dummyMat);
	sceneA.add(dummy);

	// cameraTwo = new THREE.PerspectiveCamera( 50, (window.innerWidth/2) / window.innerHeight, 0.1, 100000 );
	// cameraTwo.position.set(20, 0, 20);
	// scene.add(cameraTwo);

	var light = new THREE.PointLight( 0x800000, 1 );
	light.position.set( 0, 10, 0 );
	sceneA.add( light );

	shadowLight = new THREE.DirectionalLight( 0x800000, 1 );
	shadowLight.position.set( 0, 15, 0 );
	// shadowLight.angle = Math.PI/2;
	// shadowLight.castShadow = true;
	// shadowLight.shadowCameraVisible = true;
	// shadowLight.shadowDarkness = 2;
	// shadowLight.shadowCameraLeft = -30; // or whatever value works for the scale of your scene
	// shadowLight.shadowCameraRight = 30;
	// shadowLight.shadowCameraTop = 30;
	// shadowLight.shadowCameraBottom = -30;
	// sceneA.add( shadowLight );

	light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( -1, -1, 1 ).normalize();
	// sceneA.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( -1, -1, 1 ).normalize();
	sceneB.add( light );


	// oculus_rift
		// controls = new THREE.OculusRiftControls( camera );
		// scene.add( controls.getObject() );
		// ray = new THREE.Raycaster();
		// ray.ray.direction.set( 0, -1, 0 );


	//LIGHT_BULBS
    // var bulbGeo = new THREE.SphereGeometry(1, 32, 32);
    // textGlow = new THREE.ImageUtils.loadTexture('images/glow_edit.png');

    // TOXICLIBS
    	// glitchMat = new THREE.MeshNormalMaterial({color: 0x54d2be, opacity: 1.0, side: THREE.DoubleSide});


	// TRI_TREE
		// var treeTexture = THREE.ImageUtils.loadTexture('images/tree_thin.png');
		// triTreeMat = new THREE.MeshLambertMaterial( {map: treeTexture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide} );
		// loadModelTree("models/tree_four.js", triTreeMat);

    //WAVE
		for(var i=0; i<24; i++){
			var sinW = new SinWave(timeWs[i%10], frequencyW*10, amplitudeW, offsetW);
			sinWaves.push(sinW);
		}


	// LIGHT
		// for(var i=0; i<bulbAmount; i++){

		// 	var ranX = Math.floor( Math.random() * 20 - 10 ) * 2;
		// 	var ranY = Math.floor( Math.random() * 10 ) + 1;
		// 	var ranZ = Math.floor( Math.random() * 20 - 10 ) * 2;

		// 	L = new LightBulb(ranX,ranY,ranZ,textGlow);
		// 	lightSource.push(L);
		// }

	// CREATURE
		// creature = new Creature(0,3,0,0);


    //GROUND
	    var groundGeo = new THREE.PlaneBufferGeometry(500, 500);
	    // groundGeo.computeFaceNormals();  
	    mat  = new THREE.MeshPhongMaterial( {color: 0x4f4f4f, side: THREE.DoubleSide} );	//fcc9df
	    ground = new THREE.Mesh(groundGeo, mat);
	    ground.position.y = -2;
	    ground.rotation.x = Math.PI/2;
	    // ground.receiveShadow = true;
	    sceneA.add(ground);

	    // var roomGeo = new THREE.BoxGeometry(50,40,50);
	    // room = new THREE.Mesh(roomGeo, mat);
	    // room.position.y = 5;
	    // sceneA.add(room);

	//GROUND_B
	    mat  = new THREE.MeshPhongMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );	//fcc9df
	    ground = new THREE.Mesh(groundGeo, mat);
	    ground.position.y = -2;
	    ground.rotation.x = Math.PI/2;
	    sceneB.add(ground);

    //AUDIO_BALL
	    var ballGeo = new THREE.SphereGeometry(2,8,8);
	    audioBall = new THREE.Mesh(ballGeo.clone(), mat);
	    // audioBall.castShadow = true;
	    // sceneA.add(audioBall);

	//BEAT_BALL
		mat  = new THREE.MeshPhongMaterial( {color: 0xffff00} );
		beatBall = new THREE.Mesh(ballGeo.clone(), mat);
		beatBall.position.set(5,0,0);
		// beatBall.castShadow = true;
	    // sceneA.add(beatBall);

	//LANDMARK
		var landGeo = new THREE.TetrahedronGeometry(10);
		mat = new THREE.MeshBasicMaterial( {color: 0x54d2be} );

		var landmark = new THREE.Mesh(landGeo, mat);
		landmark.rotation.z = 45 * (Math.PI/180);
		landmark.position.x = -50;
		landmark.position.z = -50;
		// sceneA.add(landmark);

		landmark = new THREE.Mesh(landGeo, mat);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = 50;
		landmark.position.z = -50;
		// sceneA.add(landmark);

		landmark = new THREE.Mesh(landGeo, mat);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = -50;
		landmark.position.z = 50;
		// sceneA.add(landmark);

		landmark = new THREE.Mesh(landGeo, mat);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = 50;
		landmark.position.z = 50;
		// sceneA.add(landmark);

	//LANDMARK_B
		var matt = new THREE.MeshBasicMaterial( {color: 0xffff00} );

		landmark = new THREE.Mesh(landGeo, matt);
		landmark.rotation.z = 45 * (Math.PI/180);
		landmark.position.x = -50;
		landmark.position.z = -50;
		sceneB.add(landmark);

		landmark = new THREE.Mesh(landGeo, matt);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = 50;
		landmark.position.z = -50;
		sceneB.add(landmark);

		landmark = new THREE.Mesh(landGeo, matt);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = -50;
		landmark.position.z = 50;
		sceneB.add(landmark);

		landmark = new THREE.Mesh(landGeo, matt);
		landmark.rotation.z = 90 * (Math.PI/180);
		landmark.position.x = 50;
		landmark.position.z = 50;
		sceneB.add(landmark);


	// SLIPPERS
		slipperTex = THREE.ImageUtils.loadTexture('images/slipper.png');
		slipperMat = new THREE.MeshLambertMaterial( {map: slipperTex} );
		loadModelSlipper("models/slipper.js", "models/slipperRig.js", slipperMat);

	// notes
		for(var i=0; i<8; i++){
			if(i==0) 		var noteT = THREE.ImageUtils.loadTexture('images/note_life.png');
			else if(i==1) 	var noteT = THREE.ImageUtils.loadTexture('images/note_compossed.png');
			else if(i==2) 	var noteT = THREE.ImageUtils.loadTexture('images/note_lights.png');
			else if(i==3) 	var noteT = THREE.ImageUtils.loadTexture('images/note_shadows.png');
			else if(i==4) 	var noteT = THREE.ImageUtils.loadTexture('images/note_untruthful.png');
			else if(i==5) 	var noteT = THREE.ImageUtils.loadTexture('images/note_insincere.png');
			else if(i==6) 	var noteT = THREE.ImageUtils.loadTexture('images/note_saccharine.png');
			else 		 	var noteT = THREE.ImageUtils.loadTexture('images/note_pretend.png');

			noteTexts.push(noteT);

			if(i!=0) getNoteStatus.push(false);
			else     getNoteStatus.push(true);
		}
		loadModelNote("models/note.js", "models/tape.js", noteTexts);

	// strings
		//routes of the curve


		var pts = [], count = 3;

		//shape of the string--> circle-ish
		pts.push( new THREE.Vector2 ( 0.2, 0 ));
		pts.push( new THREE.Vector2 ( 0.2, 0.1 ));
		pts.push( new THREE.Vector2 ( -0.1, 0.1 ));
		pts.push( new THREE.Vector2 ( -0.2, 0 ));
		pts.push( new THREE.Vector2 ( -0.1, -0.1 ));

		var shape = new THREE.Shape( pts );
		stringMat = new THREE.MeshLambertMaterial( { color: 0xb00000, side: THREE.DoubleSide } );

		var ttStringGeo = new THREE.Geometry();

		for(var i=0; i<stringRoutes.length; i++){
			var curve = new THREE.ClosedSplineCurve3( stringRoutes[i] );
			var extrudeSettings = {
				steps			: 100,
				bevelEnabled	: false,
				extrudePath		: curve
			};
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			string = new THREE.Mesh(geometry, stringMat);

			string.updateMatrix();
			ttStringGeo.merge( string.geometry, string.matrix );
			// strings.push(string);
		}

		ttStringGeo.verticesNeedUpdate = true;
		ttStringGeo.elementsNeedUpdate = true;
		ttStringGeo.normalsNeedUpdate = true;
		ttStringGeo.tangentsNeedUpdate = true;

		totalStrings = new THREE.Mesh(ttStringGeo, stringMat);
		// totalStrings.castShadow = true;
		sceneA.add(totalStrings);

	//BED
		bedTex = THREE.ImageUtils.loadTexture('images/bed.png');
		bedMat = new THREE.MeshBasicMaterial( {map: bedTex} );
		loadModelBed("models/bed.js", bedMat);

	//WALL_PIC
		var wallPicURL = [ 'images/c1.png', 'images/c2.png', 'images/c3.png', 'images/c4.png' ];
		var wallPicLoc = [ new THREE.Vector3(0,10,-24.8), new THREE.Vector3(24.8, 5, 0), new THREE.Vector3(-24.8, 5, 0), new THREE.Vector3(0, 10, 24) ];
		var wallpicGeo = new THREE.PlaneBufferGeometry(4, 3, 1, 1);
		var wallPicAni;
		for(var i=0; i<wallPicURL.length; i++) {		

			var wallPicT = THREE.ImageUtils.loadTexture( wallPicURL[i] );
			wallPicTexs.push(wallPicT);

			if(i==2 || i==3)
				wallPicAni = new TextureAnimator( wallPicT, 4, 1, 10, 100, wallPicOrder_b );
			else
				wallPicAni = new TextureAnimator( wallPicT, 4, 1, 4, 100, wallPicOrder_a );

			wallPicAnimators.push(wallPicAni);
			wallPicMat = new THREE.MeshLambertMaterial( { map: wallPicT, color: 0xffffff, side:THREE.DoubleSide } );
			var wallpicMesh = new THREE.Mesh(wallpicGeo.clone(), wallPicMat);

			if(i==1) 		wallpicMesh.rotation.y = -Math.PI/2;
			else if(i==2)	wallpicMesh.rotation.y = Math.PI/2;
			else if(i==3)	wallpicMesh.rotation.y = Math.PI;

			wallpicMesh.position.copy( wallPicLoc[i] );
			wallpicMesh.scale.set(2,2,2);
			wallPics.push(wallpicMesh);
			sceneA.add(wallpicMesh);
		}

	    mat  = new THREE.MeshPhongMaterial( { map: wallPicTexs[0], color: 0xffffff, side: THREE.DoubleSide} );	//fcc9df

	    var roomGeo = new THREE.BoxGeometry(50,40,50);
	    room = new THREE.Mesh(roomGeo, mat);
	    room.position.y = 5;
	    // room.receiveShadow = true;
	    sceneA.add(room);

	//MASK_GUY
		maskTex = THREE.ImageUtils.loadTexture('images/mask_me.png');
		maskMat = new THREE.MeshBasicMaterial( {map: maskTex} );
		loadModelMask("models/mask/mask_head.js", "models/mask/mask_body.js", "models/mask/mask_RA.js",
					  "models/mask/mask_LA.js", "models/mask/mask_RL.js", "models/mask/mask_LL.js", maskMat);

	//
	//
	//

	// indie part
		renderer = new THREE.WebGLRenderer({
			antialias: true, 
			alpha: false
		});
		renderer.setClearColor(0x000000, 1);
		renderer.setSize( width, height );
		// renderer.shadowMapEnabled = true;


	// oculus rift
		// renderer = new THREE.WebGLRenderer({
		// 	devicePixelRatio: 1,
		// 	alpha: false,
		// 	clearColor: 0xffffff,
		// 	antialias: true
		// });
		// effect = new THREE.OculusRiftEffect( renderer );




	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	//

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', myKeyPressed, false );

	//

	clock.start();

	// indie
		camCurrPos = pointerControls.position();
		camPrevPos.copy(camCurrPos);
	// oculus rift
		// camCurrPos = controls.position();
		// camPrevPos.copy(camCurrPos);

	// creatureCurrPos = creature.mesh.position;
	// creaturePrevPos.copy(creatureCurrPos);

	// updateToxicMesh(100);


	//

	// glitchCreature
		mat_SH = new THREE.ShaderMaterial({
			uniforms: uniforms_SH,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent
		});
		mat_SH.side = THREE.DoubleSide;

		// var glitchGeo = new THREE.TorusKnotGeometry(1, 0.5, 64, 256, 5, 7, 1);	// rose!
		var geo_SH = new THREE.SphereGeometry(1, 512, 64);
		// var glitchGeo = new THREE.TorusGeometry(1, 0.5, 64, 256);
		mesh_SH = new THREE.Mesh(geo_SH, mat_SH);
		mesh_SH.position.set(10,0,10);
		sceneA.add(mesh_SH);


	// three face color changing
		var glitchGeo2 = new THREE.DodecahedronGeometry(5,0);
		gMat = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			shading: THREE.FlatShading,
		    vertexColors: THREE.FaceColors
		});

		gMesh = new THREE.Mesh(glitchGeo2.clone(), gMat);
		gMesh.position.set(-20,5,-20);
		sceneA.add(gMesh);

		gMesh2 = new THREE.Mesh(glitchGeo2.clone(), gMat);
		gMesh2.position.set(-10,5,-30);
		sceneA.add(gMesh2);

		gMesh3 = new THREE.Mesh(glitchGeo2.clone(), gMat);
		gMesh3.position.set(-30,5,-10);
		sceneA.add(gMesh3);



	// MOUNTAIN
		loadModelMount("models/mountain2.js");

		mountainMat2 = new THREE.MeshLambertMaterial({
				color: 0xffffff,
				shading: THREE.FlatShading,
			    vertexColors: THREE.FaceColors
		});
		// loadModelMount2("models/mountain2.js", mountainMat2);



	initFinished = true;

	scene = sceneA;
	camera = cameraA;

	//magical RAYSSS
	for(var i=0; i<4; i++){
		var rayy = new THREE.Raycaster();

		if(i==0) 
			rayy.ray.direction.set(1,0,0);
		else if(i==1) 
			rayy.ray.direction.set(-1,0,0);
		else if(i==2) 
			rayy.ray.direction.set(0,0,1);
		else 
			rayy.ray.direction.set(0,0,-1);

		rays.push(rayy);
	}

	//lookDummy
		// projector = new THREE.Projector();
		eyerayCaster = new THREE.Raycaster();

		var redDot = new THREE.SphereGeometry(1);
		mat = new THREE.MeshBasicMaterial({color: 0x00ffff});
		lookDummy = new THREE.Mesh(redDot, mat);
		sceneA.add(lookDummy);

	// init_instruction
	// sample.trigger(16);
}

// Web Speech API
	var final_transcript = '';
	var reachFinal = false;

	// if(initFinished){
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = function(event) { 
			var transcript = '';

			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					final_transcript += event.results[i][0].transcript.toLowerCase().trim();

					reachFinal = true;
					console.log("event is final.");
				} else {
					transcript += event.results[i][0].transcript;
				}
			}
		  console.log("transcript:" + transcript + ", final_transcript:" + final_transcript);

			if(final_transcript == 'hi'){			  
				sample.trigger(4,4);
			}

			if(final_transcript == 'hey'){			  
				sample.trigger(5,4);
			}

			var stringSplit = final_transcript.split(" ");
			for(var i=0; i<stringSplit.length; i++){
				if(stringSplit[i]=="what"){
					if(inAnotherWorld)
						sample.trigger(22);
					else
						sample.trigger(13);
				}

				if(stringSplit[i]=="how"){
					sample.trigger(12,2);
				}
			}

		}

		recognition.start();
	// }




function onWindowResize() {
	cameraA.aspect = window.innerWidth / window.innerHeight;
	cameraA.updateProjectionMatrix();

	cameraB.aspect = window.innerWidth / window.innerHeight;
	cameraB.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
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



function randomizeHarmonics() {
	options = [ ];

	for(var i=0; i<8; i++) {
		options.push( parseInt(Math.random()*9, 10) );
	}
}

function updateToxicMesh(res) {
	var sh, builder, tMesh, tGeo;

	if(toxicCreature !== undefined) {
		sceneA.remove(toxicCreature);
	}

	// randomizeHarmonics();

	sh = new toxi.geom.mesh.SphericalHarmonics(options);
	builder = new toxi.geom.mesh.SurfaceMeshBuilder(sh);

	tMesh = builder.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);

	tGeo = toxi.THREE.ToxiclibsSupport.createMeshGeometry( tMesh );
	toxicCreature = new THREE.Mesh(tGeo, toxicMat);
	// sceneA.add(toxicCreature);
}


// LIVE
function gotStream(stream){

  //create audioNode from stream
  mediaStreamSource = context.createMediaStreamSource(stream);
  

  fft = context.createAnalyser();
  fft.fftSize = 2048;

  //send to analyser
  mediaStreamSource.connect(fft);

  // fft.connect(micConvolver);
  // micConvolver.connect(context.destination);


  //send to destination --> make sound
  // fft.connect(context.destination);

  // updatePitch();

  // analyserView1 = new AudioAnalyser("view1");
  // analyserView1.initByteBuffer();

  // window.requestAnimationFrame(draw);
}

function noteFromPitch(frequency){
  var noteNum = 12 * (Math.log(frequency/440)/Math.log(2));
  return Math.round(noteNum)+69;
}

function freqencyFromNote(note){
	return 440 * Math.pow(2, (note-69)/12);
	// return 440* Math.pow(2, (note+69)/12);
}

function centsOffFromPitch(frequency){
  return Math.floor( 1200 * Math.log(frequency/freqencyFromNote(note) ) / Math.log(2) );
}

//source: https://github.com/cwilso/pitchdetect
function autoCorrelate(buf, sampleRate) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}

function updatePitch(time){
	var cycles = [];
	fft.getFloatTimeDomainData(buf);
	var ac = autoCorrelate(buf, context.sampleRate);

	if(ac == -1) {
		detectorElem.className = "vague";
	 	pitchElem.innerText = "--";
		noteElem.innerText = "-";
		detuneElem.className = "";
		detuneAmount.innerText = "--";
	} else {
		detectorElem.className = "confident";
	 	pitch = ac;
	 	pitchElem.innerText = Math.round( pitch ) ;
	 	var note =  noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}
	}
}


function myKeyPressed (event) {
	// console.log("keyPressed!");
	switch ( event.keyCode ) {
		case 90: // z
			sample.trigger(0);
			break;

		case 88: // x
			sample.trigger(1);
			break;

		case 67: // c
			sample.trigger(2);
			break;

		case 86: // v
			randomizeHarmonics();
			// for(var i=0; i<8; i++){

			// }
			uniforms_SH.m2.value = uniforms_SH.m.value;
			uniforms_SH.m.value = options;
			uniforms_SH.hue.value = Math.random();
			break;

		case 66: // b
			convolver.disconnect();
			convolver.buffer = bufferStorage[1];
			convolver.connect(convolverGain);
			convolverGain.connect(mainVolume);
			break;

		case 78: // n
			convolver.disconnect();
			convolver.buffer = bufferStorage[2];
			convolver.connect(convolverGain);
			convolverGain.connect(mainVolume);
			break;

		case 77: // m
			convolver.disconnect();
			convolver.buffer = bufferStorage[3];
			convolver.connect(convolverGain);
			convolverGain.connect(mainVolume);
			break;

		case 188: // ,
			convolver.disconnect();
			convolver.buffer = bufferStorage[4];
			convolver.connect(convolverGain);
			convolverGain.connect(mainVolume);
			break;

		case 190: // ,
			convolver.disconnect();
			// convolver.buffer = bufferStorage[5];
			// convolver.connect(convolverGain);
			// convolverGain.connect(mainVolume);
			break;

		case 79: // o
			new TWEEN.Tween(slipperBones[3].rotation).to({y: 0.5}, 700).easing( TWEEN.Easing.Elastic.Out).start(); 
			setTimeout(function(){
				new TWEEN.Tween(slipperBones[3].rotation).to({y: 1.5}, 700).easing( TWEEN.Easing.Elastic.Out).start();
			}, 300);
			setTimeout(function(){
				new TWEEN.Tween(slipperBones[3].rotation).to({y: 1.38}, 700).easing( TWEEN.Easing.Elastic.Out).start();
			}, 600);
			break;

		case 50: // 2
			scene = sceneA;
			camera = cameraA;
			break;

		case 51: // 3
			scene = sceneB;
			camera = cameraB;
			break;


		case 57: // 9
			calibrate();
			break;

		case 70: // f
			if(ws)
	            ws.send(2 + "," + 1000);
		    break;

		case 71: // g
			if(ws)
	            ws.send(9 + "," + 500);
		    break;
	}
}

function keyPressed (event) {

	console.log("pos: " + controls.posX().toFixed(1) + ", " + controls.posY().toFixed(1) + ", " + controls.posZ().toFixed(1) + "; rotY: " + (controls.rotY() *(180/Math.PI) ).toFixed(1));


	// var q = new THREE.Quaternion(
	// 		vrstate.hmd.rotation[0].toFixed(1),
	// 		vrstate.hmd.rotation[1].toFixed(1),
	//  		vrstate.hmd.rotation[2].toFixed(1),
	//  		vrstate.hmd.rotation[3].toFixed(1));
	// console.log(q);


	switch ( event.keyCode ) {
		case 79: // o
			effect.setInterpupillaryDistance(
					effect.getInterpupillaryDistance() - 0.001);
			document.getElementById('ipd').innerHTML =
					effect.getInterpupillaryDistance().toFixed(3);
			break;
		case 80: // p
			effect.setInterpupillaryDistance(
					effect.getInterpupillaryDistance() + 0.001);
			document.getElementById('ipd').innerHTML =
					effect.getInterpupillaryDistance().toFixed(3);
			break;

		case 70: // f
			if (!vr.isFullScreen()) {
				vr.enterFullScreen();
			} else {
				vr.exitFullScreen();
			}
			event.preventDefault();
			break;

		case 32: // space
			vr.resetHmdOrientation();
			event.preventDefault();
			break;

		case 82: // r
			// var q = new THREE.Quaternion(
			// vrstate.hmd.rotation[0],
			// vrstate.hmd.rotation[1],
	 	// 	vrstate.hmd.rotation[2],
	 	// 	vrstate.hmd.rotation[3]);
			// console.log(q);
			// console.log("pos: " + controls.posX() + ", " + controls.posY() + ", " + controls.posZ() + "; rot: " + controls.rotX() + ", " + controls.rotY() + ", " + controls.rotZ());
			break;

		// case 122: // z
		// 	sample.trigger(0);
		// 	break;
	}
}


function loadModelMask(model_A, model_B, model_C, model_D, model_E, model_F, meshMat) {

	var loader = new THREE.JSONLoader();
	var m_h_geo, m_b_geo, m_ra_geo, m_la_geo, m_rl_geo, m_ll_geo;
	maskGuy = new THREE.Object3D();
	var m_mat = meshMat;

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
	}, "js");

	loader.load(model_D, function(geometryD){
		geometryD.center();
		m_la_geo = geometryD.clone();
	}, "js");	

	loader.load(model_E, function(geometryE){
		geometryE.center();
		m_rl_geo = geometryE.clone();
	}, "js");

	loader.load(model_F, function(geometryF){
		geometryF.center();
		m_ll_geo = geometryF.clone();

		mask_head = new THREE.Mesh(m_h_geo, m_mat);
		mask_head.name = "mask_head";
		mask_head.position.y = 4;
		maskGuy.add(mask_head);

		mask_body = new THREE.Mesh(m_b_geo, m_mat);
		mask_body.name = "mask_body";
		maskGuy.add(mask_body);

		mask_RA = new THREE.Mesh(m_ra_geo, m_mat);
		mask_RA.name = "mask_RA";
		mask_RA.position.set(-1.8,0,0);
		maskGuy.add(mask_RA);

		mask_LA = new THREE.Mesh(m_la_geo, m_mat);
		mask_LA.name = "mask_LA";
		mask_LA.position.set(1.8,0,0);
		maskGuy.add(mask_LA);

		mask_RL = new THREE.Mesh(m_rl_geo, m_mat);
		mask_RL.name = "mask_RL";
		mask_RL.position.set(-0.8,-1.9,0);
		maskGuy.add(mask_RL);

		mask_LL = new THREE.Mesh(m_ll_geo, m_mat);
		mask_LL.name = "mask_LL";
		mask_LL.position.set(0.8,-1.9,0);
		maskGuy.add(mask_LL);

		maskGuy.position.set(-5,3,-5);

		// maskGuy.castShadow = true;

		sceneA.add(maskGuy);

		console.log("maskGUY!");

	}, "js");
}


var notePositions = [
	new THREE.Vector3(9, 20, 24), new THREE.Vector3(-15, 10, 24),	//B
	new THREE.Vector3(24, 15, 13), new THREE.Vector3(24, 5, -15),	//R
	new THREE.Vector3(-24, 10, 5), new THREE.Vector3(-24, 5, -14),	//L
	new THREE.Vector3(-5, 15, -24), new THREE.Vector3(10, 10, -24)	//F
];

//B
// notes[i].position.copy( new THREE.Vector3(0, 20, 24) );
// notes[i].rotation.y = Math.PI;

//R
// notes[i].position.copy( new THREE.Vector3(24, 20, 0) );
// notes[i].rotation.y = -Math.PI/2;

//L
// notes[i].position.copy( new THREE.Vector3(-24, 20, 0) );
// notes[i].rotation.y = Math.PI/2;

//F
// notes[i].position.copy( new THREE.Vector3(0, 20, -24) );

function loadModelNote (model, modelB, meshText) {

	var loader = new THREE.JSONLoader();
	var noteTexture = meshText;
	var tapeMat = new THREE.MeshBasicMaterial( {color: 0xffffff} );

	loader.load(model, function(geometry, materials){
		noteGeo = geometry.clone();

		for(var i=0; i<noteTexture.length; i++){
			var tempMat = new THREE.MeshLambertMaterial( {map: noteTexture[i], emissive: 0xffff00} );
			var nM = new THREE.Mesh( noteGeo.clone(), tempMat);
			nM.name = "i";
			nM.scale.set(2,2,2);
			// nM.position.copy(notePositions[i]);
			notes.push(nM);
			// sceneA.add(nM);
		}

		loader.load(modelB, function(geometryB, materialsB){
			tapeGeo = geometryB.clone();

			for(var i=0; i<noteTexture.length; i++){
				tape = new THREE.Mesh( tapeGeo, tapeMat);
				tape.position.y = 0.5;
				// tape.scale.set(2,2,2);
				notes[i].add(tape);

				notes[i].scale.set(4,4,4);
				notes[i].position.copy(notePositions[i]);


				if(i<2) notes[i].rotation.y = Math.PI;			//B
				else if(i<4) notes[i].rotation.y = -Math.PI/2;	//R
				else if(i<6) notes[i].rotation.y = Math.PI/2;	//L
				//B
				// notes[i].position.copy( new THREE.Vector3(0, 20, 24) );
				// notes[i].rotation.y = Math.PI;

				//R
				// notes[i].position.copy( new THREE.Vector3(24, 20, 0) );
				// notes[i].rotation.y = -Math.PI/2;

				//L
				// notes[i].position.copy( new THREE.Vector3(-24, 20, 0) );
				// notes[i].rotation.y = Math.PI/2;

				//F
				// notes[i].position.copy( new THREE.Vector3(0, 20, -24) );

				sceneA.add(notes[i]);
			}


		});

	});

}


function loadModelBed (model, meshMat) {

	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry, material){

		bed = new THREE.Mesh(geometry, meshMat);
		bed.scale.set(0.01,0.01,0.01);
		sceneA.add(bed);
	});
}

function loadModelTree (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry, materials){

		// THREE.GeometryUtils.center( geometry );
		geometry.center();
		triTreeGeo = geometry;

		var tY = 30;

		for(var i=0; i<30; i++){
			var tX = Math.floor( Math.random() * 30 - 15 ) * 2;
			// var tY = Math.floor( Math.random() * 3 ) + 1;
			var tZ = Math.floor( Math.random() * 30 - 15 ) * 2;

			var tS = 6 + Math.floor( Math.random() * 4 - 2 );

			var triT = new THREE.Mesh(triTreeGeo, meshMat);

			triT.scale.set(tS+1, 20, tS+1);
			triT.rotation.x = 180 * (Math.PI/180);

			triT.position.set(tX, tY, tZ);
			triTrees.push(triT);
			sceneA.add(triT);


			// smaller
			var triT = new THREE.Mesh(triTreeGeo, meshMat);
			triT.scale.set(tS, 18, tS);
			triT.rotation.y = 45 * (Math.PI/180);
			triT.rotation.x = 180 * (Math.PI/180);
			
			triT.position.set(tX, tY, tZ);
			triSmallTrees.push(triT);
			sceneA.add(triT);

		}
	});
}

function loadModelMount2 (model, meshMat) {

	var loader = new THREE.JSONLoader();

	loader.load(model, function(geometry, material){

		mountainGeo2 = geometry;
		mountainGeo2.dynamic = true;
		mountainGeo2.center();

		var tessellateModifier = new THREE.TessellateModifier(2);

		for(var i=0; i<2; i++){
			tessellateModifier.modify(mountainGeo2);
		}


		for(var i=0; i<mountainGeo2.vertices.length; i++ ) {
			var mv = mountainGeo2.vertices[i];

			var x = 1 * ( 0.5 - Math.random() );
			var y = 1 * ( 0.5 - Math.random() );
			var z = 1 * ( 0.5 - Math.random() );

			mv.x += x;
			mv.y += y;
			mv.z += z;
		}


		mountainGeo2.verticesNeedUpdate = true;

		mountain2 = new THREE.Mesh(mountainGeo2, meshMat);
		mountain2.scale.set(50,50,50);
		mountain2.position.y = 2000;

		sceneA.add(mountain2);
	});
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

		mountainGeo = geometry;
		mountainGeo.dynamic = true;
		mountainGeo.center();

		var tessellateModifier = new THREE.TessellateModifier(3);

		for(var i=0; i<3; i++){
			tessellateModifier.modify(mountainGeo);
			console.log( "faces", mountainGeo.faces.length );
		}

		var vertices_M = mountainGeo.vertices;
		var colors_M = attributes_M.customColor.value;
		var displacement_M = attributes_M.displacement.value;

		var v=0;

		console.log(mountainGeo.faces.length);

		for ( var f=0; f<mountainGeo.faces.length; f++ ) {

			var face = mountainGeo.faces[ f ];

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

		mesh_T = new THREE.Mesh(mountainGeo, mat_M);
		// mesh_T.rotation.set(0.5, 0.5, 0);
		mesh_T.scale.set(100,100,100);
		mesh_T.position.y = 500;

		sceneB.add(mesh_T);
	});
}

function loadModelSlipper (model, modelB, meshMat) {

	var loader = new THREE.JSONLoader();
	var slpMat = meshMat;

	loader.load(model, function(geometry, material){

		// THREE.GeometryUtils.center( geometry );
		

		// for(var i=0; i<30; i++){
			// var tX = Math.floor( Math.random() * 40 - 20 ) * 2;
			// // var tY = Math.floor( Math.random() * 3 ) + 1;
			// var tZ = Math.floor( Math.random() * 40 - 20 ) * 2;

			// var tS = 6 + Math.floor( Math.random() * 4 - 2 );
			geometry.center();
			slipperGeo = geometry.clone();



			
		// }


		var slipperHeight = 1, slipperWidth = 5;

		// for(var j=0; j<slipperHeight; j++) {
			for(var i=0; i<slipperWidth; i++){
			
				var slp = new THREE.Mesh(geometry.clone(), slpMat);

				slp.position.x = Math.sin((360/slipperWidth*i)*(Math.PI/180))*30;
				slp.position.z = Math.sin((Math.PI/2 + (360/slipperWidth*i)*(Math.PI/180)))*30;

				slp.scale.set(2, 2, 2);
				slp.position.y = 10;

				slp.rotation.z = (90*(Math.PI/180));
				slp.rotation.y = ((360/slipperWidth*i - 90)*(Math.PI/180));


				slippers.push(slp);
				sceneB.add(slp);
			}
		// }


		// transX(slipperGeo, -8);
		transZ(slipperGeo, 8);

		mySlippers = new THREE.Object3D();

		var rightS = new THREE.Mesh(slipperGeo.clone(), slpMat);
		mySlippers.add(rightS);

		transZ(slipperGeo, -16);
		var leftS = new THREE.Mesh(slipperGeo.clone(), slpMat);
		mySlippers.add(leftS);

		mySlippers.scale.set(0.15, 0.15, 0.15);
		mySlippers.rotation.y = Math.PI/2;
		sceneA.add(mySlippers);

	});

	loader.load(modelB, function(geometryB, material){

		console.log(material);

		for(var i=0; i<material.length; i++){
			var m = material[i];
			m.skinning = true;
			m.map = slipperTex;
		}
		
		slipperRig = new THREE.SkinnedMesh(geometryB, new THREE.MeshFaceMaterial(material));

		slipperRig.position.set(5,5,5);
		sceneB.add(slipperRig);

		// BONES_SETUP
			slipperBones = slipperRig.skeleton.bones;


	});
}

function loadModelOwl (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry, materials){

		geometry.center();
		eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
		eyeMat = new THREE.MeshBasicMaterial( {color: 0x10c400} );
		var eyeGlowMat = new THREE.SpriteMaterial(
			      { map: textGlow, color: 0x10c400,
			        transparent: false, blending: THREE.AdditiveBlending });
		var eyeSize = 0.6;

		for(var i=0; i<10; i++){
			var tX = Math.floor( Math.random() * 30 - 15 ) * 2;
			var tY = 15 + Math.floor( Math.random() * 8 - 4 );
			var tZ = Math.floor( Math.random() * 30 - 15 ) * 2;

			owl = new THREE.Mesh(geometry.clone(), meshMat);

			// EYE			
	 		// var eye = new THREE.Mesh(eyeGeo.clone(), eyeMat);
	 		// eye.position.set(0, 0, -0.3);
			// var eyeLight = new THREE.PointLight( 0x10c400, 0.5, 20 );	// double eyes
			var eyeLight = new THREE.PointLight( 0x10c400, 1, 20 );	// single eyes
			// eyeLight.add(eye);
			
			eyeGlow = new THREE.Sprite(eyeGlowMat);
			eyeGlow.scale.set(eyeSize, eyeSize, eyeSize);
			eyeGlow.position.set(0, 0, -0.25);
			eyeLight.add(eyeGlow);
			eyeLight.position.set(0.3, 0.25, 1);	// POS
			eyeLightLeft.push(eyeLight);			
			owl.add(eyeLight);

			// Another EYE
			// // eye = new THREE.Mesh(eyeGeo.clone(), eyeMat);
			// // eye.position.set(0, 0, -0.3);
			// eyeLight = new THREE.PointLight( 0x10c400, 0.5, 20 );
			// // eyeLight.add(eye);
			// eyeGlow = new THREE.Sprite(eyeGlowMat);
			// eyeGlow.scale.set(eyeSize, eyeSize, eyeSize);
			// eyeGlow.position.set(0, 0, -0.25);
			// eyeLight.add(eyeGlow);
			// eyeLight.position.set(-0.3, 0.25, 1);	// POS
			// eyeLightRight.push(eyeLight);	
			// owl.add(eyeLight);

			// new version
			eyeLight = new THREE.Object3D();
			eyeGlow = new THREE.Sprite(eyeGlowMat);
			eyeGlow.scale.set(eyeSize, eyeSize, eyeSize);
			eyeGlow.position.set(0, 0, -0.25);
			eyeLight.add(eyeGlow);
			eyeLight.position.set(-0.3, 0.25, 1);	// POS
			owl.add(eyeLight);

			owl.position.set(tX, tY, tZ);
			// owl.rotation.x = 70 * (Math.PI / 180);

			owls.push(owl);
			sceneA.add(owl);
		}
	});
}

var bufferStorage = [];

// MUSIC
function finishedLoading(bufferList){

	//filter
		// var filter = context.createBiquadFilter();
		// filter.type = 0;
		// filter.frequency.value = 200;


	//analyze
		analyzer = context.createAnalyser();
		analyzer.smoothingTimeConstant = 0.8;
		analyzer.fftSize = samples;
		binCount = analyzer.frequencyBinCount;
		levelBins = Math.floor(binCount/levelCount);

		frequencyByteData = new Uint8Array(binCount);
		timeByteData = new Uint8Array(binCount);

		var length = 256;
		for(var i=0; i<length; i++){
			levelHistory.push(0);
		}

	

	bufferStorage = bufferList;

	convolver = context.createConvolver();
	convolver.buffer = bufferList[2];

	convolverB = context.createConvolver();
	convolverB.buffer = bufferList[1];

	insConvolver = context.createConvolver();
	insConvolver.buffer = bufferList[11];
	
	mixer = context.createGain();

	mainVolume = context.createGain();
	mainVolume.connect(context.destination);

	//

	sound_night.source = context.createBufferSource();
	sound_night.source.buffer = bufferList[0];
	sound_night.source.loop = true;
	sound_night.gainNode = context.createGain();
	sound_night.gainNode.gain.value = 0.5;

	// sound_night.source.connect(sound_night.gainNode);
	sound_night.source.connect(analyzer);
	analyzer.connect(sound_night.gainNode);


	

	// no room effect
	// sound_night.gainNode.connect(mainVolume);

	convolverGain = context.createGain();
	sound_night.gainNode.connect(convolver);	// connect!
	convolver.connect(convolverGain);
	convolverGain.connect(mainVolume);

	//

	// instruction effect
	insConvolverGain = context.createGain();

	// instruction!
		for(var i=3; i<7; i++){
			var insTemp = {};
			insTemp.source = context.createBufferSource();
			insTemp.source.buffer = bufferList[i];
			insTemp.gainNode = context.createGain();
			insTemp.gainNode.gain.value = 3;
			insTemp.source.connect(insTemp.gainNode);
			insTemp.gainNode.connect(insConvolver);

			insAudios.push(insTemp);
		}

	// instruction effect_continued
	insConvolver.connect(insConvolverGain);
	insConvolverGain.connect(mainVolume);

	//

	sound_musicBox.source = context.createBufferSource();
	sound_musicBox.source.buffer = bufferList[10];
	sound_musicBox.source.loop = true;
	sound_musicBox.gainNode = context.createGain();
	sound_musicBox.gainNode.gain.value = 1;
	sound_musicBox.source.connect(sound_musicBox.gainNode);
	// sound_creature.panner = context.createPanner();
	// sound_creature.gainNode.connect(sound_creature.panner);
	sound_musicBox.gainNode.connect(convolverB);

	// effect_for_musicBox
	convolverBGain = context.createGain();
	sound_musicBox.gainNode.connect(convolverB);	// connect!
	convolverB.connect(convolverBGain);
	convolverBGain.connect(mainVolume);


	//

	// start to PLAY!
	sound_night.source.start(context.currentTime);

	setTimeout(function(){
		sample.trigger(13);
	}, 9000);
	
	// sound_creature.source.start(context.currentTime);

	// sound_musicBox.source.start(context.currentTime);
}


function animate() {

	requestAnimationFrame(animate);
	update();

	//vr.requestAnimationFrame(animate);
	// render();
	
}

function render() {

	// WEB_CAM
		/*
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			videoImageContext.drawImage(video, 0, 0,videoImage.width, videoImage.height);

			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
				// tvset.dynamic = true;
			}
		}
		*/

	// renderer.clear();

	// renderer.setViewport( 0, 0, width, height);
	// renderer.setScissor( 0, 0, width, height);
	renderer.render( scene, camera );

	// renderer.setViewport( width/2, 0, width, height);
	// renderer.setScissor( width/2, 0, width, height);
	// renderer.enableScissorTest ( true );

	// if(time%4000 > 300 && time%4000 < 1300){
	// 	renderer.render( scene, cameraTwo );
	// }
}

var timeNow;


var currInTree = false;
var preInTree = false;

var cccc;




function smooth(target, readings, input){

	target.total -= readings[target.index];
	readings[target.index] = input;
	target.total += readings[target.index];
	target.index++;

	if(target.index >= target.sampleNumber)
		target.index = 0;

	target.average = target.total / target.sampleNumber;

	return target.average;
}


var camPos, camRotY, camRot;
var collideF = false;
var collideB = false;
var collideR = false;
var collideL = false;


function update(){


	// CAM
		//indie
			camPos = pointerControls.position();
			camRotY = pointerControls.rotY();
			camRot = pointerControls.rotation();

			
			pointerControlsB.setRotation(camRot);
			pointerControlsB.setPosition(camPos);

			dummy.position.copy(new THREE.Vector3(camPos.x, 1, camPos.z));
			var originPoint = dummy.position.clone();

		//oculus rift
			// var camPos = controls.position();
			// var camRotY = controls.rotY();
	
	//COLLISION_DETECT
	for(var vertexIndex = 0; vertexIndex < dummy.geometry.vertices.length; vertexIndex++){
		var localVertex = dummy.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4(dummy.matrix);
		var directionVector = globalVertex.sub(dummy.position);

		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

		// if(mazeMesh){
			var collisionResults = ray.intersectObject(totalStrings);
			
			if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
				// console.log("Collide!" + " F:" + collideF + " B:" + collideB + " L:" + collideL + " R:" + collideR);
				// console.log(collisionResults[0]);

				if(pointerControls.dirF()){
					haveCollision = true;
				} else {
					haveCollision = false;
				}
				// if(pointerControls.dirB()){
				// 	collideB = true;
				// 	pointerControls.testCollideB(collideB);
				// }
				// if(pointerControls.dirL()){
				// 	collideL = true;
				// 	pointerControls.testCollideL(collideL);
				// }
				// if(pointerControls.dirR()){
				// 	collideR = true;
				// 	pointerControls.testCollideR(collideR);
				// }
				// haveCollision = true;
				
			} else {
				// setTimeout( haveCollision = false, 500 );
			}
			// else {
				// collideF = false;
				// collideB = false;
				// collideR = false;
				// collideL = false;
				// pointerControls.testCollideF(collideF);
				// pointerControls.testCollideB(collideB);
				// pointerControls.testCollideL(collideL);
				// pointerControls.testCollideR(collideR);
				// scene = sceneA;
				// camera = cameraA;
			// }
		// }
	}

	if(haveCollision){
		scene = sceneB;
		camera = cameraB;
		inAnotherWorld = true;

		//change_wallpaper
		wallPicIndex++;
		room.material.map = wallPicTexs[ (wallPicIndex)%4 ];

	} else {
		scene = sceneA;
		camera = cameraA;
		inAnotherWorld = false;
		// console.log("ddd");
	}

	//EYE_RAY!
	var directionCam = pointerControls.getDirection().clone();
	eyerayCaster.set( pointerControls.getObject().position.clone(), directionCam );
	var eyeIntersects = eyerayCaster.intersectObjects( sceneA.children, true );
	//console.log(intersects);

	if ( eyeIntersects.length > 0 ) {
		// console.log('hit');
		// console.log(eyeIntersects[ 0 ].object);

		for(var i=0; i<notes.length; i++){
			if( eyeIntersects[ 0 ].object == notes[i] && getNoteStatus[i]==true ){
				console.log("hit note!");
				notes[i].material.visible = false;

				sample.trigger( (i+14) );

				if(i==(notes.length-1))	showBed=true;
				else 					getNoteStatus[i+1] = true;
			} 
		}

		// if(intersects[ 0 ].object.parent != scene)
			lookDummy.position.copy(eyeIntersects[ 0 ].object.position);
	}

	if(bed){
		if(!showBed)
			bed.scale.set(0.01,0.01,0.01);
		else {
			bed.scale.set(2,2,2);
			if(!bedFoundSound){
				sample.trigger(12,3);
				bedFoundSound = true;
			}
			if(!playMusicBox){
				sound_musicBox.source.start(context.currentTime);
				playMusicBox=true;
			}
		}
	}

	if( playMusicBox && bed.position.distanceTo(camPos)<=4 ){
		window.open('http://localhost:8000/index_finale.html', '_self', false);
	}


	//maskGuy
		// maskGuy.children[0].lookAt(camPos);


	// AUDIO
	////////////////////////////////////////////////////////
		var audioData = new Uint8Array(samples);
		if(fft)
			fft.getByteFrequencyData(audioData);


		frequencyTotal -= frequencyReadings[frequencyIndex];
		frequencyReadings[frequencyIndex] = audioData[500];
		frequencyTotal += frequencyReadings[frequencyIndex];
		frequencyIndex ++;

		if(frequencyIndex >= frequencySampleNumber)
			frequencyIndex = 0;

		frequencyAverage = frequencyTotal / frequencySampleNumber;

		// console.log(audioData[190]);
		//change_rope_color
			var freColor = map_range(audioData[190], 0, 100, 0, 1);
			totalStrings.material.color = new THREE.Color( freColor, 0, 0 );

		// audioBall.position.y = frequencyAverage*0.2;


		var helppp = smooth(help, helpReadings, audioData[400]);
		// console.log(help.total);


		if(reachFinal){
			setTimeout(function(){
				final_transcript = '';
				console.log("clean!");
			}, 1000);
			reachFinal = false;
		}


		// CREATURE_SOUND
			var dt = clock.getDelta();
			// dCreaturePos.subVectors( creatureCurrPos, creaturePrevPos );
			// if(sound_creature.panner) {
			// 	sound_creature.panner.setPosition( creature.position.x, creature.position.y, creature.position.z );				
			// 	dCreaturePos.divideScalar(dt);
			// 	sound_creature.panner.setVelocity( dCreaturePos.x, dCreaturePos.y, dCreaturePos.z );
			// }

		context.listener.setPosition( camPos.x, camPos.y, camPos.z );



		// Pitch detection
		// if(fft)
		// 	updatePitch();


		// Beat_detection!!!
		if(analyzer){
			analyzer.getByteFrequencyData( frequencyByteData );
			analyzer.getByteTimeDomainData( timeByteData );

			//normalize freq data
				for(var i=0; i<binCount; i++){
					waveData[i] = ((timeByteData[i]-128)/128) * 1;
				}

				//normalize levels data from freq
				for(var i=0; i<levelCount; i++){
					var sum=0;
					for(var j=0; j<levelBins; j++){
						sum += frequencyByteData[(i*levelBins) + j];
					}
					levelData[i] = sum/levelBins/256 * 1;
				}

				//get avg level
				var sum = 0;
				for(var i=0; i<levelCount; i++){
					sum += levelData[i];
				}

				level = sum / levelCount;
				levelHistory.push(level);
				levelHistory.shift(1);

				//BEAT detection
				if(level > beatCutOff && level > BEAT_MIN){
					// onBeat();
					gotBeat = true;

					console.log("on beat!");
					beatCutOff = level * 1.1;
					beatTime = 0;

					// beatBall.material.color = red;

				} else {
					gotBeat = false;

					// beatBall.material.color = yellow;

					if(beatTime <= BEAT_HOLD_TIME){	//
						beatTime ++;
					}else{
						beatCutOff *= BEAT_DECAY_RATE;	//
						beatCutOff = Math.max(beatCutOff, BEAT_MIN);
					}
				}

				bpmTime = (new Date().getTime()-bpmStart)/msecsAvg;

				// if(beatTime<30){
				// 	kicking = true;
				// 	waving = false;
				// 	// sphere.scale.set(20,20,20);
				// } else if (levelData[12]>0) {
				// 	kicking = false;
				// 	waving = true;
				// 	// sphere.scale.set(10,10,10);
				// } else {
				// 	kicking = false;
				// 	waving = false;
				// }

				// var scaleS = 15;
				// for(var i=0; i<spheres.length; i++){
				// 	var freqDataKey = i%16;
				// 	spheres[i].scale.set(levelData[freqDataKey]*scaleS+1,levelData[freqDataKey]*scaleS+1,levelData[freqDataKey]*scaleS+1);
				// }

				var bIndex = 10;
				// beatBall.scale.set( levelData[bIndex],levelData[bIndex],levelData[bIndex] );

		}



	// CREATURE
	// creature.seek(pointerControls);
	// creature.update();

	// creatureCurrPos = creature.mesh.position;


	//SLIPPERS
	if(mySlippers) {
		mySlippers.position.set(camPos.x + Math.sin( (camRotY) )*2.2, -1, camPos.z + Math.sin( Math.PI/2 + (camRotY) )*2);
		// mySlippers.position.set(camPos.x + Math.sin( (Math.PI/2+camRotY)*(Math.PI/180) )*5, -1, camPos.z + Math.sin( Math.PI/2 + (Math.PI/2+camRotY)*(Math.PI/180) )*5);		

		mySlippers.rotation.y = camRotY + Math.PI/2;
	}

	// WALL_PIC
		for(var i=0; i<wallPics.length; i++){
			wallPicAnimators[i].updateLaura( 500*dt );
		}
	

	TWEEN.update();


	//controls.isOnObject( false );

	// ray.ray.origin.copy( controls.getObject().position );
	// ray.ray.origin.y -= 10;
	// var intersections = ray.intersectObjects( objects );
	// if ( intersections.length > 0 ) {
	// 	var distance = intersections[ 0 ].distance;
	// 	if ( distance > 0 && distance < 10 ) {
	// 		controls.isOnObject( true );
	// 	}
	// }

	//

	//LIGHT_BULB
	/*
	timeNow = Date.now() * 0.00025;
	for(var i=0; i<lightSource.length; i++){

		//JUMPPING
		// lightSource[i].position.x += Math.sin(timeNow*0.7);
		// lightSource[i].position.z += Math.cos(timeNow*0.3);
		lightSource[i].position.y += Math.cos(timeNow*10)*0.01;	
	}
	*/


	keyboard.update();
	stats.update();
	pointerControls.update();

	//indie
		renderer.render( scene, camera );

	//VR
		// var polled = vr.pollState(vrstate);	// Poll VR, if it's ready
		// controls.update( Date.now() - time, polled ? vrstate : null );
		// effect.render( scene, camera, polled ? vrstate : null );



	time = Date.now();


	// creaturePrevPos.copy( creatureCurrPos );


	// WAVE
	// for(var i=0; i<trees[0].geometry.vertices.length; i++){
	// 	trees[0].geometry.vertices[i].x = sinWaves[i].run();
	// }
	// trees[0].geometry.verticesNeedUpdate = true;

	// for(var i=0; i<eyeLightLeft.length; i++) {
	// 	eyeLightLeft[i].intensity = sinWaves[i].run();
	// }


	// TREES!
	//manupulate vertices example from 
	//https://dl.dropboxusercontent.com/u/43243793/examples/webgl_geometry_grass.html
	// var eTime = clock.getElapsedTime();
	// for(var i=0; i<=triTreeGeo.vertices.length/2-1; i++){
	// 	for(var j=0; j<2; j++){
	// 		triTreeGeo.vertices[ 2*i + j ].z = ((2-i)/2)*Math.sin(eTime)/200;
	// 	}
	// }

	// triTreeGeo.verticesNeedUpdate = true;

	//

	// sh_creature
	// if(haveCollision){
		uniforms_SH.time.value += dt;
		uniforms_SH.time.needsUpdate = true;
	// }

	/*
	// tesse!
		uniforms_T.amplitude.value = 0.125 * Math.sin( time*0.001 * 0.5 );
		cccc = attributes_T.customColor.value;
		dddd = attributes_T.displacement.value;

		var v=0;

		if(geo_T) {

			if(time%60==0 || time%18==0){
				for ( var f = 0; f < glitchGeo3.faces.length; f ++ ) {

					var h = ((( (time*0.0002 % (Math.PI/2) ) + 0.3*Math.random()-0.15 )));
					// var h = (0.9 + 0.5 * Math.random()) % (Math.PI/2);
					// var s = 0.5 + 0.5 * Math.random();
					// var l = 0.5 + 0.5 * Math.random();

					var x = 2 * ( 0.5 - Math.random() );
					var y = 1 * ( 0.5 - Math.random() );
					var z = 2 * ( 0.5 - Math.random() );

					for ( var i = 0; i < nv; i ++ ) {
		 
						cccc[ v ] = new THREE.Color();
						cccc[ v ].setHSL( h, 0.8, 0.8 );
						cccc[ v ].convertGammaToLinear();
						
						// dddd[ v ].set(x, y, z);

						v += 1;
					}
				}
			}
		}

		attributes_T.customColor.needsUpdate = true;
		// attributes_T.displacement.needsUpdate = true;
	*/

	//
	
	// color changing cubes && mountain!
	if(haveCollision){
		if(time%50==0 || time%22==0){
			for(var i=0; i<gMesh.geometry.faces.length; i++){
					// gMesh.geometry.faces[i].color.setRGB( 0.1, 0.1, Math.random() );
				gMesh.geometry.faces[i].color.setHex( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0xffffff );
				gMesh2.geometry.faces[i].color.setHex( ( 0.3 + 0.001*Math.random()-0.0005 ) * 0xffffff );
				gMesh3.geometry.faces[i].color.setHex( ( 1 + 0.001*Math.random()-0.0005 ) * 0xffffff );


				// console.log('aaaa');
			}

			if(mountain2){
				for(var i=0; i<mountain2.geometry.faces.length; i++){
					mountain2.geometry.faces[i].color.setHex( ( 0.7 + 0.001*Math.random()-0.0005 ) * 0xffffff );
				}
			}
		}

		gMesh.geometry.colorsNeedUpdate = true;
		gMesh2.geometry.colorsNeedUpdate = true;
		gMesh3.geometry.colorsNeedUpdate = true;
		if(mountain2)	mountain2.geometry.colorsNeedUpdate = true;
		gMesh.rotation.y = time*0.001;
		gMesh2.rotation.y = time*0.001;
		gMesh3.rotation.y = time*0.001;
	

	// cameraTwo.lookAt(pointerControls.position());

	//

	// Mountain_2


	// Mountain_T

		// uniforms_M.amplitude.value = 0.125 * Math.sin( time*0.001 * 0.5 );
		ccccM = attributes_M.customColor.value;
		ddddM = attributes_M.displacement.value;

		var vM=0;

		if(mountainGeo) {

			// if(time%77==0 || time%38==0){
				for ( var f = 0; f < mountainGeo.faces.length; f ++ ) {

					// var h = ((( (time*0.0001 % (Math.PI/2) ) + 0.3*Math.random()-0.15 )));
					
					if(f%10==0)
						var h =  perlin.noise(time*0.001, f, 1) % (Math.PI/2);
					// var h = (0.9 + 0.5 * Math.random()) % (Math.PI/2);
					// var s = 0.5 + 0.5 * Math.random();
					// var l = 0.5 + 0.5 * Math.random();

					var x = 10 * ( 0.5 - Math.random() );
					var y = 5 * ( 0.5 - Math.random() );
					var z = 10 * ( 0.5 - Math.random() );

					for ( var i = 0; i < nv; i ++ ) {
		 
						ccccM[ vM ] = new THREE.Color();
						ccccM[ vM ].setHSL( h, 0.8, 0.8 );
						ccccM[ vM ].convertGammaToLinear();
						
						ddddM[ vM ].set(x, y, z);

						vM += 1;
					}
				}
			// }
		}

		if(attributes_M) {
			attributes_M.customColor.needsUpdate = true;

			if(gotBeat){
				attributes_M.displacement.needsUpdate = true;
			}
		}


	// skinning Slipper!		
		if(slipperBones){
			if(slipperBones[3].rotation.y<0.5)
				mouthStep = 1;
			else if(slipperBones[3].rotation.y>1.5)
				mouthStep = -1;
		}

		// slipperBones[3].rotation.y += mouthStep*0.05;
	}

	// talking slippers
	// see key function!
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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

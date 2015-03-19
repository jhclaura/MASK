////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, renderer;
var container;
var controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;


var littleMe, littleMeTex, littleMeTex2;
var myHead, myBody, myRA, myLA, myRL, myLL;
var myPosY;

var banana, bananaCore, bananaGeo, bananaMat, baBone;
var baBones=[], baPeels=[], bananas=[]; 

var dir, step;

var timeWs = [
	Math.PI/2, Math.PI, -Math.PI/2, 0,
	Math.PI+0.3, -Math.PI/5, Math.PI/1.1
];
var frequencyW = 0.2;
var amplitudeW = 0.1;
var offsetW = 0;
var sinWave;

init();



///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
			
function init() 
{	
	dir = 1;
	step = dir*0.02;
	sinWave = new SinWave(timeWs[0], frequencyW, amplitudeW, offsetW);

	scene = new THREE.Scene();

	// LIGHT
	// create light for the scene
	light = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 1);
	scene.add(light);


	// CAMERA
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight/3), 0.1, 99999);
	camera.position.z = 2;
	// camera.position.set(0,150,400);
	// scene.add(camera);

	controls = new THREE.OrbitControls(camera);
	// controls.add('change', render);


	// CUBE
	var mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, shading: THREE.FlatShading, wireframe: true });
	var geo = new THREE.TetrahedronGeometry(3);
	var tet = new THREE.Mesh(geo, mat);
	// scene.add(tet);

	// littleMe
		littleMeTex = THREE.ImageUtils.loadTexture('images/monkey.png');
		mat = new THREE.MeshLambertMaterial( {map: littleMeTex} );
		littleMeTex2 = THREE.ImageUtils.loadTexture('images/mask_me.png');
		var mat2 = new THREE.MeshLambertMaterial( {map: littleMeTex2} );
		loadModelMe("models/monkey.js", "models/mask/mask_body2.js", "models/mask/mask_RA2.js",
					  "models/mask/mask_LA2.js", "models/mask/mask_RL.js", "models/mask/mask_LL.js", mat, mat2);

	// banana
		bananaMat = new THREE.MeshFaceMaterial;
		loadModelRig("models/banana10.js", "models/banCore.js", bananaMat);

	// RENDERER
	container = document.createElement('div');
	document.body.appendChild(container);

	renderer = new THREE.WebGLRenderer({
		antialias: true, 
		alpha: true
	});
	renderer.setClearColor(0xcccccc, 1);
	renderer.setSize(window.innerWidth, window.innerHeight/3);
	container.appendChild(renderer.domElement);

	
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', myKeyPressed, false );

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
    requestAnimationFrame( animate );
	render();		
	update();
}

var swingSwitch = 0;

function update()
{		
	controls.update();
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
	
}

function render() 
{	
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / (window.innerHeight/3);
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight/3 );
}

function formatFloat(num, pos) {
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
}
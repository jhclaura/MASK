	



////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

// standard global variables
var scene, camera, renderer;

var light;

var container;
var controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

// custom global variables
var cube;



// kind of like setup()
init();
// kind of like draw()/loop()
animate();





///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
			
function init() 
{
	// SCENE
	// construct environment first
	scene = new THREE.Scene();


	// LIGHT
	// create light for the scene
	light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set(1,1,0);
	scene.add(light);

	light = new THREE.DirectionalLight( 0xffff00, 0.5 );
	light.position.set(0,1,1);
	scene.add(light);


	// CAMERA
	// PerspectiveCamera( field of view, aspect, near, far )
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 100;						//set the position of the camera
	// camera.position.set(0,150,400);				//can also do position.set(x, y, z)
	scene.add(camera);								//add camera into the scene


	// CUBE
	var cubeGeometry = new THREE.BoxGeometry(50,50,50);
	var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cube);





	

	// RENDERER
	container = document.createElement('div');
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	// renderer.setClearColor(0xeff5d5, 1);			//set background color
	renderer.setClearColor(0xffffff, 1);

	container.appendChild(renderer.domElement);

	
	// EVENTS
	// automatically resize renderer
	window.addEventListener( 'resize', onWindowResize, false );

	
	// CONTROLS
	// left click to rotate, middle click/scroll to zoom, right click to pan
	controls = new THREE.OrbitControls( camera, renderer.domElement );
		
}


function animate() 
{
    requestAnimationFrame( animate );				//http://creativejs.com/resources/requestanimationframe/
	render();		
	update();
}

function update()
{		
	controls.update();

	cube.rotation.x += 0.1;
}

function render() 
{	
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

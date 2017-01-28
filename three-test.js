'use strict';
var scene, camera, renderer, sideRenderer;
var geometry, material, mesh;
var startTime;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var KEYS = Object.freeze({
  W:{
    rotateX: -1,
    rotateY: 0,
    rotateZ: 0
  },
  A:{
    rotateX: 0,
    rotateY: -1,
    rotateZ: 0
  },
  S:{
    rotateX: 1,
    rotateY: 0,
    rotateZ: 0
  },
  D:{
    rotateX: 0,
    rotateY: 1,
    rotateZ: 0
  },
  NONE: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  }
});
var currentKey = KEYS.NONE;

document.onkeypress = function(event) {
  switch (event.code) {
    case 'KeyW':
      currentKey = KEYS.W;
      break;
    case 'KeyA': 
      currentKey = KEYS.A;
      break;
    case 'KeyS': 
      currentKey = KEYS.S;
      break;
    case 'KeyD': 
      currentKey = KEYS.D;
      break;
    default:
      currentKey = KEYS.NONE;
  }
};

document.onkeyup = function() {
  currentKey = KEYS.NONE;
};

var riddles = [
  [ // classic L-shape
    {x:0, y:0, z:0},
    {x:1, y:0, z:0},
    {x:2, y:0, z:0},
    {x:2, y:1, z:0}
  ],
  [
    {x:0, y:1, z:0},
    {x:1, y:2, z:0},
    {x:2, y:-1, z:0},
    {x:2, y:1, z:0},
    {x:0, y:0, z:0},
    {x:2, y:1, z:0},
    {x:2, y:0, z:0},
    {x:2, y:1, z:1}
  ],
  [
    {x:0, y:1, z:0},
    {x:1, y:1, z:0},
    {x:2, y:1, z:0},
    {x:2, y:0, z:0},
    {x:2, y:-1, z:0},
    {x:3, y:1, z:0},
    {x:0, y:-1, z:0},
    {x:-1, y:0, z:0},
    {x:-2, y:0, z:-1},
    {x:-2, y:1, z:-1},
    {x:-2, y:0, z:-1},
    {x:-3, y:1, z:-2},
    {x:-3, y:0, z:-2},
  ],
  [
    {x:-1, y:0, z:0},
    {x:0, y:1, z:0},
    {x:0, y:1, z:-1},
    {x:0, y:1, z:-2},
    {x:0, y:1, z:-1},
    {x:1, y:2, z:0}
  ],
]

// TODO: add levels (multiple riddles without refresh)
// TODO: add visual timers
var boxes = riddles[getRandomInt(0,riddles.length-1)];

var gameEnded = false;
// victory is achieved when the sum of the x+y angle differences is below this threshold
var victoryThreshold = 0.05;
function checkVictoryCondition(){
  //NB: threejs rotation is in radians, and it does not clip to [0,PI], so we need to do that manually
  var rotationX = scene.rotation.x;
  var rotationY = scene.rotation.y;
  
  var xFullTurns = Math.floor( rotationX/(Math.PI*2) );
  var yFullTurns = Math.floor( rotationY/(Math.PI*2) );
  
  var normalizedRotationX = rotationX - xFullTurns*(Math.PI*2);
  var normalizedRotationY = rotationY - yFullTurns*(Math.PI*2);
  
  var diffX = normalizedRotationX<Math.PI? normalizedRotationX : (Math.PI*2)-normalizedRotationX;
  var diffY = normalizedRotationY<Math.PI? normalizedRotationY : (Math.PI*2)-normalizedRotationY;

  var difference = diffX+diffY;
  if (!gameEnded && difference < victoryThreshold) {
    var gameDuration = new Date() - startTime;
    //TODO: you're better than this, man...
    alert('Victory! You\'ve completed the puzzle in '+ gameDuration/1000 + ' seconds!');
    gameEnded = true;
    currentKey = KEYS.NONE;
  }
  console.log(diffX, diffY);
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  boxes.forEach(function(box){
    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( box.x*200, box.y*200, box.z*200 );
    scene.add( mesh );
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth-320, window.innerHeight );
  
  // the side renderer is used to diplay the objective in a corner
  sideRenderer = new THREE.WebGLRenderer();
  sideRenderer.setSize( 300, 300 );

  document.getElementById('main-renderer-target').appendChild( renderer.domElement );
  document.getElementById('side-renderer-target').appendChild( sideRenderer.domElement );
}

function animate() {
  requestAnimationFrame( animate );

  scene.rotation.x += 0.01 * currentKey.rotateX;
  scene.rotation.y += 0.01 * currentKey.rotateY;

  renderer.render( scene, camera );
  checkVictoryCondition();
}

// turning the scene randomly initializes the puzzle
function turnSceneRandomly(){
  scene.rotation.x = Math.random()*Math.PI*2;
  scene.rotation.y = Math.random()*Math.PI*2;
}

init();
// it is enough to render the side renderer once
sideRenderer.render( scene, camera );
turnSceneRandomly();
animate();
startTime = new Date();
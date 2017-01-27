'use strict';
var scene, camera, renderer, sideRenderer;
var geometry, material, mesh;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

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

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render( scene, camera );
}

init();
animate();
// it is enough to render the side renderer once
sideRenderer.render( scene, camera );

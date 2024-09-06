// import main threejs library
import * as THREE from 'three';
// to import .gtlf files 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// to move camera around the scene 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//creating a Three.JS Scene
const scene = new THREE.Scene();
//creating a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//to track the mouse position, so we can make the cartoon move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//3D object on a global variable so we can access it later
let object;

//orbitControls allow the camera to move around the scene
let controls;

//setting which object to render
let objToRender = 'cartoon';

//instantiating a loader for the .gltf file
const loader = new GLTFLoader();

//loading the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //if the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //while it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //if an error
    console.error(error);
  }
);

//instantiating a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//adding the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//setting how far the camera will be from the 3D model
camera.position.z = objToRender === "cartoon" ? 5 : 50;

//adding lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "cartoon" ? 5 : 1);
scene.add(ambientLight);

//adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "cartoon") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//render the scene
function animate() {
  requestAnimationFrame(animate);
  //some code to update the scene, adding some automatic movement
  if (object && objToRender === "cartoon") {
    object.rotation.y = -1.5 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//adding a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();

// Import necessary three.js components
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(19, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 0, 2);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Audio setup
const listener = new THREE.AudioListener();
camera.add(listener);

const audio = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

// Load audio (use your generated MP3 file)
audioLoader.load('audio/output.mp3', (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(false);  // Set audio to play only once
    audio.setVolume(0.5);
});

// Audio analysis
const analyser = new THREE.AudioAnalyser(audio, 256);

// Model setup: Load the glTF model
const loader = new GLTFLoader();
let model;
let upperLipMesh;
let lowerLipMesh;

loader.load('/avatar_testglb.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5); // Adjust model scale

    model.position.set(0, -0.7, 0); // Move model lower (increase the negative Y value as needed)

    model.traverse((child) => {
        if (child.name === "Upperlips") {
            upperLipMesh = child;
        }
        if (child.name === "Lowerlips") {
            lowerLipMesh = child;
        }
    });

    scene.add(model);
    console.log('Model loaded successfully');
}, undefined, (error) => {
    console.error('An error occurred while loading the model:', error);
});

// Animation and lip-sync function
function animate() {
    requestAnimationFrame(animate);

    if (upperLipMesh && lowerLipMesh && analyser) {
        const data = analyser.getFrequencyData();
        const averageFrequency = data.reduce((sum, value) => sum + value, 0) / data.length;

        const movementAmount = Math.min(averageFrequency / 128, 1);

        upperLipMesh.position.z = movementAmount * 0.5;
        lowerLipMesh.position.z = -movementAmount * 0.5;
    }

    controls.update();
    renderer.render(scene, camera);
}

// Window resize handler to adjust aspect ratio and renderer size
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Event listener for the "Speak" button
const speakButton = document.getElementById('speakButton');
speakButton.addEventListener('click', () => {
    audio.play();

    
});

const speakButtonx = document.getElementById('speakButtonx');
speakButtonx.addEventListener('click', () => {
    // Set a flag to indicate that the button was clicked
    localStorage.setItem('shouldPlayAudio', 'true');

    // Trigger page reload
    location.reload();
});

animate();
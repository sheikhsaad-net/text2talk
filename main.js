// Import necessary three.js components
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 2, 3);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Increase intensity for better visibility
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increase intensity
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Audio setup
const listener = new THREE.AudioListener();
camera.add(listener);

const audio = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

// Load audio
audioLoader.load('/audio.mp3', (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.setVolume(0.5);
    audio.play();
});

// Audio analysis
const analyser = new THREE.AudioAnalyser(audio, 256); // Frequency data resolution

// Model setup: Load the glTF model
const loader = new GLTFLoader();
let model;
let upperLipMesh;
let lowerLipMesh;

loader.load('/avatar_testglb.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5); // Adjust model scale

    // Position the model lower along the Y-axis
    model.position.set(0, -0.7, 0);  // Move model lower (increase the negative Y value as needed)

    // Search for the "Upper Lips" and "Lower Lips" meshes
    model.traverse((child) => {
        if (child.name === "Upperlips") {
            upperLipMesh = child; // Assign the upper lip mesh
        }
        if (child.name === "Lowerlips") {
            lowerLipMesh = child; // Assign the lower lip mesh
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
        // Get frequency data
        const data = analyser.getFrequencyData();

        // Calculate the average frequency
        const averageFrequency = data.reduce((sum, value) => sum + value, 0) / data.length;

        // Animate the "Upper Lips" mesh based on frequency data
        if (upperLipMesh) {
            // Normalize frequency value to control lip movement
            const movementAmount = Math.min(averageFrequency / 128, 1); // Normalize to range 0-1
            upperLipMesh.position.z = movementAmount * 0.5; // Move lips up (change the multiplier for desired range)
        }

        // Animate the "Lower Lips" mesh based on frequency data
        if (lowerLipMesh) {
            // Normalize frequency value to control lip movement
            const movementAmount = Math.min(averageFrequency / 128, 1); // Normalize to range 0-1
            lowerLipMesh.position.z = -movementAmount * 0.5; // Move lips down (change the multiplier for desired range)
        }
    }

    // Update controls (camera movement)
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}


animate();

// Window resize handler to adjust aspect ratio and renderer size
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

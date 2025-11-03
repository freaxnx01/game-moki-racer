import * as THREE from 'three';
import { createTerrain } from './terrain.js';
import { createPlayer } from './player.js';
import { createNuts } from './nuts.js';
import { GameControls } from './controls.js';

class MokiRacer {
    constructor() {
        this.score = 0;
        this.speed = 0;
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 15);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.createElement('canvas')
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Lighting
        this.setupLighting();

        // Create game elements
        this.terrain = createTerrain();
        this.scene.add(this.terrain);

        this.player = createPlayer();
        this.scene.add(this.player);

        this.nuts = createNuts(20);
        this.nuts.forEach(nut => this.scene.add(nut));

        // Controls
        this.controls = new GameControls();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start game loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(10, 20, 10);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Hemisphere light for warm atmosphere
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 0.3);
        this.scene.add(hemiLight);
    }

    updatePlayer(deltaTime) {
        const moveSpeed = 0.3;
        const gravity = -0.02;
        const jumpForce = 0.5;

        // Horizontal movement
        if (this.controls.left) {
            this.player.position.x -= moveSpeed;
        }
        if (this.controls.right) {
            this.player.position.x += moveSpeed;
        }

        // Keep player on slope
        this.player.position.x = Math.max(-10, Math.min(10, this.player.position.x));

        // Forward movement (automatic)
        this.player.position.z -= 0.3;
        this.speed = Math.abs(0.3 * 60).toFixed(0); // Convert to km/h-like value

        // Simple jump mechanic
        if (this.controls.jump && this.player.userData.onGround) {
            this.player.userData.velocity = jumpForce;
            this.player.userData.onGround = false;
        }

        // Apply gravity
        if (!this.player.userData.onGround) {
            this.player.userData.velocity += gravity;
            this.player.position.y += this.player.userData.velocity;

            // Ground collision (simplified)
            if (this.player.position.y <= 1) {
                this.player.position.y = 1;
                this.player.userData.velocity = 0;
                this.player.userData.onGround = true;
            }
        }

        // Slight rotation for movement feel
        this.player.rotation.z = this.player.position.x * 0.05;
    }

    checkNutCollection() {
        this.nuts.forEach((nut, index) => {
            if (!nut.userData.collected) {
                const distance = this.player.position.distanceTo(nut.position);
                if (distance < 2) {
                    nut.userData.collected = true;
                    this.scene.remove(nut);
                    this.score++;
                    this.updateUI();
                }
            }
        });
    }

    updateCamera() {
        // Camera follows player
        const targetX = this.player.position.x;
        const targetZ = this.player.position.z + 15;
        const targetY = this.player.position.y + 8;

        this.camera.position.x += (targetX - this.camera.position.x) * 0.1;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.1;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.1;

        this.camera.lookAt(this.player.position);
    }

    updateUI() {
        document.getElementById('score').textContent = `Nüsse: ${this.score}`;
        document.getElementById('speed').textContent = `Geschwindigkeit: ${this.speed}`;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update game state
        this.updatePlayer(1/60);
        this.checkNutCollection();
        this.updateCamera();
        this.updateUI();

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new MokiRacer();
});

import * as THREE from 'three';

export function createNuts(count) {
    const nuts = [];

    for (let i = 0; i < count; i++) {
        const nut = createSingleNut();

        // Position nuts along the slope
        const x = (Math.random() - 0.5) * 15; // Spread across slope
        const z = -10 - i * 8; // Spread along the path
        const y = -z * 0.15 + 1; // Match slope height + lift up

        nut.position.set(x, y, z);
        nut.userData.collected = false;
        nut.userData.rotationSpeed = Math.random() * 0.02 + 0.01;

        nuts.push(nut);
    }

    return nuts;
}

function createSingleNut() {
    const nut = new THREE.Group();

    // Hazelnut body
    const nutGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    nutGeometry.scale(1, 1.2, 1); // Make it slightly elongated

    const nutMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // Saddle brown
        roughness: 0.7,
        metalness: 0.1
    });

    const nutMesh = new THREE.Mesh(nutGeometry, nutMaterial);
    nutMesh.castShadow = true;
    nut.add(nutMesh);

    // Cap/top of the nut
    const capGeometry = new THREE.ConeGeometry(0.25, 0.3, 8);
    const capMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.5;
    cap.castShadow = true;
    nut.add(cap);

    // Add glow effect to make nuts more visible
    const glowGeometry = new THREE.SphereGeometry(0.6, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    nut.add(glow);

    return nut;
}

// Animation function for nuts (call this in main game loop)
export function animateNuts(nuts, deltaTime) {
    nuts.forEach(nut => {
        if (!nut.userData.collected) {
            // Rotate the nut
            nut.rotation.y += nut.userData.rotationSpeed;

            // Bob up and down
            nut.position.y += Math.sin(Date.now() * 0.003) * 0.01;
        }
    });
}

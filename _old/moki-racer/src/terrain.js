import * as THREE from 'three';

export function createTerrain() {
    const terrain = new THREE.Group();

    // Create sloped ground
    const groundWidth = 30;
    const groundLength = 200;
    const segments = 50;

    const groundGeometry = new THREE.PlaneGeometry(
        groundWidth,
        groundLength,
        segments,
        segments
    );

    // Create slope by adjusting vertices
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const z = vertices[i + 1]; // y in plane becomes z in our world

        // Create downward slope
        vertices[i + 2] = -z * 0.15; // Adjust height based on z position

        // Add some random variation for natural look
        vertices[i + 2] += (Math.random() - 0.5) * 0.5;
    }
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0, // Snowy white
        roughness: 0.8,
        metalness: 0.1
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    terrain.add(ground);

    // Add trees along the slope
    addTrees(terrain, groundWidth, groundLength);

    // Add rocks/obstacles
    addRocks(terrain, groundWidth, groundLength);

    return terrain;
}

function addTrees(terrain, width, length) {
    const treeCount = 30;

    for (let i = 0; i < treeCount; i++) {
        const tree = new THREE.Group();

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3426
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);

        // Tree foliage (simple cone)
        const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 4;
        foliage.castShadow = true;
        tree.add(foliage);

        // Position trees on the sides
        const side = Math.random() > 0.5 ? 1 : -1;
        const x = (width / 2 + Math.random() * 5) * side;
        const z = -Math.random() * length;
        const y = -z * 0.15; // Match slope

        tree.position.set(x, y, z);
        terrain.add(tree);
    }
}

function addRocks(terrain, width, length) {
    const rockCount = 15;

    for (let i = 0; i < rockCount; i++) {
        const rockGeometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.receiveShadow = true;

        // Position rocks along the slope
        const x = (Math.random() - 0.5) * width * 0.8;
        const z = -Math.random() * length;
        const y = -z * 0.15 + 0.3; // Match slope + lift slightly

        rock.position.set(x, y, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        terrain.add(rock);
    }
}

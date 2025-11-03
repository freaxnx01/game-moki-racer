import * as THREE from 'three';

export function createPlayer() {
    const player = new THREE.Group();
    player.userData = {
        velocity: 0,
        onGround: true
    };

    // Bark sled (Baumrinden-Schlitten)
    const sledGeometry = new THREE.BoxGeometry(1.5, 0.2, 2);
    const sledMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3426,
        roughness: 0.8,
        metalness: 0.2
    });
    const sled = new THREE.Mesh(sledGeometry, sledMaterial);
    sled.castShadow = true;
    sled.receiveShadow = true;

    // Add bark texture appearance with additional details
    const barkDetail = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.25, 2),
        new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            roughness: 0.9
        })
    );
    barkDetail.position.y = 0.1;
    sled.add(barkDetail);

    // Squirrel body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.6, 8, 16);
    const furMaterial = new THREE.MeshStandardMaterial({
        color: 0xd2691e, // Chestnut brown
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, furMaterial);
    body.position.y = 0.7;
    body.rotation.x = Math.PI / 6; // Slight forward lean
    body.castShadow = true;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
    const head = new THREE.Mesh(headGeometry, furMaterial);
    head.position.set(0, 1.3, 0.2);
    head.castShadow = true;

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000
    });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.4, 0.45);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.4, 0.45);

    // Ears with tufts
    const earGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const leftEar = new THREE.Mesh(earGeometry, furMaterial);
    leftEar.position.set(-0.2, 1.6, 0.1);
    leftEar.castShadow = true;
    const rightEar = new THREE.Mesh(earGeometry, furMaterial);
    rightEar.position.set(0.2, 1.6, 0.1);
    rightEar.castShadow = true;

    // Bushy tail
    const tailSegments = 3;
    for (let i = 0; i < tailSegments; i++) {
        const tailGeometry = new THREE.SphereGeometry(0.25 - i * 0.05, 8, 8);
        const tailSegment = new THREE.Mesh(tailGeometry, furMaterial);
        tailSegment.position.set(0, 0.8 + i * 0.2, -0.5 - i * 0.3);
        tailSegment.castShadow = true;
        player.add(tailSegment);
    }

    // Scarf (like in the image)
    const scarfGeometry = new THREE.TorusGeometry(0.25, 0.08, 8, 12);
    const scarfMaterial = new THREE.MeshStandardMaterial({
        color: 0xcc0000, // Red scarf
        roughness: 0.6
    });
    const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
    scarf.position.set(0, 1.1, 0.2);
    scarf.rotation.x = Math.PI / 2;
    scarf.castShadow = true;

    // Assemble player
    player.add(sled);
    player.add(body);
    player.add(head);
    player.add(leftEye);
    player.add(rightEye);
    player.add(leftEar);
    player.add(rightEar);
    player.add(scarf);

    // Starting position
    player.position.set(0, 1, 0);

    return player;
}

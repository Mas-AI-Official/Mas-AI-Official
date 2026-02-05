import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("investor-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(0, 0, 6);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(3, 3, 3);
scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

// resize
function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

// glass panel material
const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
    roughness: 0.1,
    metalness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.9,
    thickness: 0.5,
});

// Create different shapes/panels representing "Decks" or abstract data
function makePanel(x, y, z) {
    const geo = new THREE.PlaneGeometry(3.2, 1.8);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
}

// Layout panels in 3D space to fly by
const panels = [
    makePanel(-2.5, 0.5, -4),
    makePanel(2.5, -0.5, -10),
    makePanel(-2.0, 0.0, -16),
    makePanel(1.8, 0.8, -22),
    makePanel(0.0, -0.5, -28),
];

// Aesthetic Particles / Stars
const starGeo = new THREE.BufferGeometry();
const starCount = 800;
const posArray = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMat = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00bcd4,
    transparent: true,
    opacity: 0.6
});
const starMesh = new THREE.Points(starGeo, starMat);
scene.add(starMesh);

// scroll progress 0..1 based on entire document height
function scrollT() {
    // Use document scrolling
    const max = document.body.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
}

function animate() {
    const t = scrollT();

    // camera moves forward into the scene as you scroll
    // We map the total scroll length to a Z depth in 3D
    const totalDepth = 30; // How deep we go
    camera.position.z = 6 - t * totalDepth;

    // Slight camera sway
    camera.position.x = Math.sin(t * Math.PI * 2) * 0.5;
    camera.lookAt(0, 0, camera.position.z - 10);

    // Rotate stars/panels slightly
    const time = performance.now() * 0.0005;
    starMesh.rotation.y = time * 0.05;
    starMesh.rotation.z = time * 0.02;

    panels.forEach((p, i) => {
        // Subtle floating animation
        p.rotation.y = Math.sin(time + i) * 0.1;
        p.rotation.x = Math.cos(time + i) * 0.05;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

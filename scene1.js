// 01 — Procedural Geometry, Orbit Camera
// A rotating spiral field of primitive geometries, viewable from any angle.

(function () {
  const W = 500, H = 380;
  const container = document.getElementById('three-canvas-1');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14141f);

  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
  camera.position.set(7, 6, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 1, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(6, 10, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xe07a5f, 0.7, 30);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  const palette = [0xe07a5f, 0x81b29a, 0xf2cc8f, 0x3d405b];
  const makers = [
    () => new THREE.SphereGeometry(0.5, 20, 14),
    () => new THREE.ConeGeometry(0.5, 1.1, 18),
    () => new THREE.TorusGeometry(0.42, 0.16, 14, 28),
    () => new THREE.IcosahedronGeometry(0.55, 0),
  ];

  const group = new THREE.Group();
  const N = 48;
  for (let i = 0; i < N; i++) {
    const geo = makers[i % makers.length]();
    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      roughness: 0.45,
      metalness: 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const a = (i / N) * Math.PI * 6;
    const r = 1.2 + (i / N) * 5;
    mesh.position.set(Math.cos(a) * r, Math.sin(i * 0.7) * 1.8 + 1.5, Math.sin(a) * r);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(mesh);
  }
  scene.add(group);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(9, 40),
    new THREE.MeshStandardMaterial({ color: 0x1c1c28, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0025;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();

// 02 — Materials, Lighting & Fog
// A small landscape exploring standard / physical / emissive materials, layered
// lighting, and exponential fog for atmospheric depth.

(function () {
  const W = 500, H = 380;
  const container = document.getElementById('three-canvas-2');
  if (!container) return;

  const scene = new THREE.Scene();
  const skyColor = 0xbfd9e8;
  scene.background = new THREE.Color(skyColor);
  scene.fog = new THREE.FogExp2(skyColor, 0.045);

  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  camera.position.set(9, 4, 11);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);
  controls.maxPolarAngle = Math.PI / 2.05;

  // lighting: hemisphere for sky/ground bounce + directional "sun" + soft point fill
  scene.add(new THREE.HemisphereLight(skyColor, 0x6b8f4e, 0.85));
  const sunLight = new THREE.DirectionalLight(0xfff2d6, 0.9);
  sunLight.position.set(8, 12, 4);
  scene.add(sunLight);
  const fill = new THREE.PointLight(0xffffff, 0.25, 20);
  fill.position.set(-5, 3, -3);
  scene.add(fill);

  // ground — matte standard material
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x6b8f4e, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // water — physical material, glass-like reflectivity/transmission
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x2a6f97,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(3, 0.02, 2);
  scene.add(water);

  // sun — emissive material acting as a visible light source
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 20, 16),
    new THREE.MeshStandardMaterial({
      color: 0xf2cc8f,
      emissive: 0xf2cc8f,
      emissiveIntensity: 0.9,
      roughness: 0.5,
    })
  );
  sun.position.set(-6, 6, -8);
  scene.add(sun);

  // trees — layered cone canopy + cylinder trunk (matte materials)
  function makeTree(x, z, hue) {
    const g = new THREE.Group();
    const trunkH = 1.4;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.18, trunkH, 8),
      new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 })
    );
    trunk.position.y = trunkH / 2;
    g.add(trunk);
    for (let i = 0; i < 3; i++) {
      const r = 0.75 * (1 - i * 0.22);
      const cH = r * 1.3;
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(r, cH, 10),
        new THREE.MeshStandardMaterial({ color: hue, roughness: 0.8 })
      );
      cone.position.y = trunkH + i * cH * 0.55 + cH * 0.4;
      g.add(cone);
    }
    g.position.set(x, 0, z);
    return g;
  }
  const treeHues = [0x4a7a3a, 0x3d6b31, 0x5c8f47];
  const treePositions = [[-2, 2], [-3.2, 3.4], [-1, 3.6], [2, -3], [3.4, -2.2], [1, -3.6], [-4, -1]];
  treePositions.forEach(([x, z], i) => scene.add(makeTree(x, z, treeHues[i % treeHues.length])));

  // rocks — flat-shaded standard material for a faceted look
  function makeRock(x, z, r) {
    const geo = new THREE.IcosahedronGeometry(r, 0);
    const rock = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: 0x8a8478, roughness: 0.9, flatShading: true })
    );
    rock.position.set(x, r * 0.6, z);
    return rock;
  }
  [[-5, 4, 0.5], [4.5, 3.2, 0.4], [-1.5, -1.5, 0.35]].forEach(([x, z, r]) =>
    scene.add(makeRock(x, z, r))
  );

  function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();

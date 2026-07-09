// 05 — Personal Exploration: Sketch-to-Landscape (3D scene generation)
// Reads the `elements` array populated by p5/sketch3.js (loaded before this
// file), and builds a first-person, walkable three.js scene from it.

let renderer3, scene3, camera3, clock3;
let yaw = 0, pitch = 0, dragging3 = false, dragX3 = 0, dragY3 = 0;
let animatedUpdaters = [];

function initThree3() {
  const container = document.getElementById('three-canvas-3');
  container.style.display = 'block';
  container.innerHTML = '';
  scene3 = new THREE.Scene();
  camera3 = new THREE.PerspectiveCamera(65, 480 / 360, 0.1, 500);
  renderer3 = new THREE.WebGLRenderer({ antialias: true });
  renderer3.setSize(480, 360);
  renderer3.setClearColor(0xbfd9e8, 1);
  container.appendChild(renderer3.domElement);
  clock3 = new THREE.Clock();
  animatedUpdaters = [];

  scene3.add(new THREE.HemisphereLight(0xbfd9e8, 0x6b8f4e, 0.9));
  const sunLight = new THREE.DirectionalLight(0xfff2d6, 0.7);
  sunLight.position.set(10, 20, -10);
  scene3.add(sunLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({ color: 0x6b8f4e, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene3.add(ground);

  container.addEventListener('mousedown', e => { dragging3 = true; dragX3 = e.clientX; dragY3 = e.clientY; container.style.cursor = 'grabbing'; });
  window.addEventListener('mouseup', () => { dragging3 = false; container.style.cursor = 'grab'; });
  window.addEventListener('mousemove', e => {
    if (!dragging3) return;
    yaw -= (e.clientX - dragX3) * 0.005;
    pitch -= (e.clientY - dragY3) * 0.005;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    dragX3 = e.clientX; dragY3 = e.clientY;
  });
}

function makeIrregularBlob(r, color) {
  const geo = new THREE.IcosahedronGeometry(r, 1);
  const posAttr = geo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
    const n = v.clone().normalize();
    const disp = 1 + (Math.random() - 0.5) * 0.28;
    v.copy(n.multiplyScalar(v.length() * disp));
    posAttr.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true }));
}
function makeMountain3(color) {
  const group = new THREE.Group();
  const r = randRange(3, 5), h = randRange(7, 12);
  const base = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
  base.position.y = h / 2;
  group.add(base);
  const capH = h * 0.28;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.42, capH, 8), new THREE.MeshStandardMaterial({ color: '#f5f7fa', roughness: 0.7 }));
  cap.position.y = h - capH * 0.42;
  group.add(cap);
  return group;
}
function makeTree3(color) {
  const group = new THREE.Group();
  const trunkH = randRange(2.2, 3.8);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, trunkH, 8), new THREE.MeshStandardMaterial({ color: '#6b4a2f', roughness: 0.9 }));
  trunk.position.y = trunkH / 2;
  group.add(trunk);
  for (let i = 0; i < 3; i++) {
    const r = randRange(1.3, 1.9) * (1 - i * 0.22);
    const cH = r * 1.3;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, cH, 10), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    cone.position.y = trunkH + i * cH * 0.55 + cH * 0.4;
    group.add(cone);
  }
  return group;
}
function makeBush3(color) {
  const group = new THREE.Group();
  const n = 4 + Math.floor(Math.random() * 3);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
  for (let i = 0; i < n; i++) {
    const r = randRange(0.5, 0.9);
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
    s.position.set(randRange(-0.6, 0.6), r * 0.7 + randRange(0, 0.2), randRange(-0.6, 0.6));
    group.add(s);
  }
  return group;
}
function makeFlower3(color) {
  const group = new THREE.Group();
  const stemH = randRange(0.6, 1.1);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, stemH, 6), new THREE.MeshStandardMaterial({ color: '#4a7a3a' }));
  stem.position.y = stemH / 2;
  group.add(stem);
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: '#f2c14e', roughness: 0.6 }));
  center.position.y = stemH;
  group.add(center);
  const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), petalMat);
    petal.position.set(Math.cos(a) * 0.22, stemH, Math.sin(a) * 0.22);
    petal.scale.set(1, 0.5, 1);
    group.add(petal);
  }
  return group;
}
function makeWater3(color) {
  const geo = new THREE.CircleGeometry(randRange(4, 7), 24);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.15, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.03;
  return mesh;
}
function makeStar3(color) {
  return new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }));
}
function makeSun3(color) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.75, roughness: 0.5 }));
  group.add(core);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16 }));
  group.add(glow);
  return group;
}
function makeCloud3(color) {
  const group = new THREE.Group();
  const n = 4 + Math.floor(Math.random() * 3);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
  for (let i = 0; i < n; i++) {
    const r = randRange(0.9, 1.9);
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat);
    puff.position.set(randRange(-1.8, 1.8), randRange(-0.35, 0.35), randRange(-1, 1));
    group.add(puff);
  }
  return group;
}
function makeBird3(color) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
  body.scale.set(1.4, 0.8, 0.9);
  group.add(body);
  const wingGeo = new THREE.BoxGeometry(0.5, 0.03, 0.22);
  const wingMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(-0.28, 0, 0);
  const pivotL = new THREE.Group(); pivotL.add(wingL); pivotL.position.set(-0.05, 0, 0);
  const wingR = new THREE.Mesh(wingGeo, wingMat);
  wingR.position.set(0.28, 0, 0);
  const pivotR = new THREE.Group(); pivotR.add(wingR); pivotR.position.set(0.05, 0, 0);
  group.add(pivotL); group.add(pivotR);
  group.userData.wingL = pivotL;
  group.userData.wingR = pivotR;
  return group;
}

function addGroundObject3(type, color) {
  const angle = randRange(0, Math.PI * 2);
  const radius = randRange(6, 30);
  const x = Math.sin(angle) * radius, z = Math.cos(angle) * radius;
  let obj;
  if (type === 'rock') { obj = makeIrregularBlob(randRange(0.6, 1.3), color); obj.position.set(x, 0.5, z); }
  else if (type === 'hill') { obj = makeIrregularBlob(randRange(2.5, 4.2), color); obj.position.set(x, 1.5, z); }
  else if (type === 'mountain') { obj = makeMountain3(color); obj.position.set(x, 0, z); }
  else if (type === 'tree') { obj = makeTree3(color); obj.position.set(x, 0, z); }
  else if (type === 'bush') { obj = makeBush3(color); obj.position.set(x, 0, z); }
  else if (type === 'flower') { obj = makeFlower3(color); obj.position.set(x, 0, z); }
  else if (type === 'water') {
    obj = makeWater3(color); obj.position.set(x, 0, z);
    const phase = Math.random() * 10;
    animatedUpdaters.push(t => { obj.position.y = 0.03 + Math.sin(t * 1.2 + phase) * 0.02; obj.material.opacity = 0.72 + Math.sin(t * 1.5 + phase) * 0.1; });
  }
  if (obj && (type === 'tree' || type === 'bush' || type === 'flower')) {
    const phase = Math.random() * 10;
    animatedUpdaters.push(t => { obj.rotation.z = Math.sin(t * 0.6 + phase) * 0.025; });
  }
  if (obj) scene3.add(obj);
}
function addSkyObject3(type, color) {
  let obj, updater;
  if (type === 'bird') {
    obj = makeBird3(color);
    const cx = randRange(-15, 15), cz = randRange(-15, 15), r = randRange(4, 9), baseY = randRange(6, 11), speed = randRange(0.3, 0.6), phase = Math.random() * 10, flapSpeed = randRange(6, 9);
    updater = t => {
      const a = t * speed + phase;
      obj.position.set(cx + Math.sin(a) * r, baseY + Math.sin(t * 2 + phase) * 0.4, cz + Math.cos(a) * r);
      obj.rotation.y = -a;
      const flap = Math.sin(t * flapSpeed + phase) * 0.7;
      obj.userData.wingL.rotation.z = flap;
      obj.userData.wingR.rotation.z = -flap;
    };
  } else {
    if (type === 'sun') obj = makeSun3(color);
    else if (type === 'star') obj = makeStar3(color);
    else obj = makeCloud3(color);
    const r = type === 'star' ? randRange(30, 55) : randRange(20, 42);
    const baseY = type === 'star' ? randRange(20, 35) : type === 'sun' ? randRange(16, 24) : randRange(9, 17);
    const speed = type === 'sun' ? randRange(0.02, 0.04) : type === 'star' ? 0 : randRange(0.03, 0.07);
    const phase = Math.random() * Math.PI * 2;
    if (type === 'star') {
      const twinklePhase = Math.random() * 10;
      updater = t => {
        obj.position.set(Math.sin(phase) * r, baseY, Math.cos(phase) * r);
        obj.material.emissiveIntensity = 0.5 + Math.sin(t * 3 + twinklePhase) * 0.4;
      };
    } else {
      updater = t => {
        const a = t * speed + phase;
        obj.position.set(Math.sin(a) * r, baseY, Math.cos(a) * r);
      };
    }
  }
  animatedUpdaters.push(updater);
  scene3.add(obj);
}

function buildScene3() {
  const skyTypes = ['sun', 'cloud', 'star', 'bird'];
  elements.forEach(el => {
    const isSky = skyTypes.includes(el.type);
    const total = el.count * (multiplyMap[el.type] || 1);
    for (let i = 0; i < total; i++) {
      if (isSky) addSkyObject3(el.type, el.color);
      else addGroundObject3(el.type, el.color);
    }
  });
}

function generateScene3() {
  if (elements.length === 0) return;
  initThree3();
  buildScene3();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock3.getElapsedTime();
    animatedUpdaters.forEach(u => u(t));
    camera3.rotation.order = 'YXZ';
    camera3.rotation.y = yaw;
    camera3.rotation.x = pitch;
    camera3.position.set(0, 1.8, 0);
    renderer3.render(scene3, camera3);
  }
  animate();
}

document.getElementById('genBtn2').addEventListener('click', generateScene3);

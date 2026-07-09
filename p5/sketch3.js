// 05 — Personal Exploration: Sketch-to-Landscape (drawing + classification)
// Shared state (elements, mode, etc.) is declared at top level so that
// three/scene3.js, loaded after this file, can read it directly.

let elements = [];
let selectedId = null;
let mode = 'draw';
let currentStroke = null;

const typeLabel = {
  sun: 'Sun', cloud: 'Cloud', star: 'Star', bird: 'Bird',
  rock: 'Rock', hill: 'Hill', mountain: 'Mountain', tree: 'Tree',
  bush: 'Bush', flower: 'Flower', water: 'Water',
};
const multiplyMap = {
  sun: 1, cloud: 5, star: 18, bird: 4,
  rock: 7, hill: 3, mountain: 3, tree: 9, bush: 6, flower: 12, water: 1,
};

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function bbox(points) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(pt => {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  });
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}
function pathLength(points) {
  let L = 0;
  for (let i = 1; i < points.length; i++) L += dist(points[i - 1], points[i]);
  return L;
}
function zigzagCount(points) {
  let count = 0, prevSign = 0;
  for (let i = 1; i < points.length; i++) {
    const dy = points[i].y - points[i - 1].y;
    if (Math.abs(dy) < 1.5) continue;
    const sign = dy > 0 ? 1 : -1;
    if (prevSign !== 0 && sign !== prevSign) count++;
    prevSign = sign;
  }
  return count;
}
function classify(s, canvasH) {
  const pts = s.points, b = bbox(pts), L = pathLength(pts) || 1;
  const major = dist(pts[0], pts[pts.length - 1]);
  const straightness = major / L;
  const size = Math.max(b.w, b.h);
  const topThird = b.cy < canvasH / 3;
  const zz = zigzagCount(pts);
  if (topThird) {
    if (zz >= 2 && size < 130) return 'bird';
    if (straightness < 0.55) {
      if (size < 22) return 'star';
      if (size < 55) return 'sun';
      return 'cloud';
    }
    return 'cloud';
  } else {
    const wide = b.w / Math.max(b.h, 1) > 2.5;
    const bottomArea = b.cy > canvasH * 0.72;
    if (wide && bottomArea && size > 60) return 'water';
    if (straightness < 0.55) {
      if (size < 40) return 'flower';
      if (size < 75) return 'rock';
      if (size < 115) return 'bush';
      return 'hill';
    } else {
      if (size > 130 && b.h >= b.w) return 'tree';
      if (size > 130) return 'mountain';
      if (size < 45) return 'flower';
      return 'rock';
    }
  }
}
function randRange(a, b) { return a + Math.random() * (b - a); }

function renderPalette() {
  const p = document.getElementById('palette2');
  p.innerHTML = '';
  elements.forEach(el => {
    const chip = document.createElement('button');
    chip.className = 'palette-chip' + (el.id === selectedId ? ' selected' : '');
    chip.innerHTML = '<span style="width:12px;height:12px;border-radius:50%;background:' + el.color + ';display:inline-block;"></span><span>' + typeLabel[el.type] + ' x' + el.count + '</span>';
    chip.onclick = () => {
      selectedId = el.id;
      mode = 'stamp';
      document.getElementById('modeBtn2').textContent = 'Stamp mode (' + typeLabel[el.type] + ')';
      renderPalette();
    };
    p.appendChild(chip);
  });
}

const brushSketch = (p) => {
  const W = 480, H = 360;
  p.setup = () => {
    p.createCanvas(W, H);
    p.background('#f7f4ee');
    document.getElementById('modeBtn2').addEventListener('click', () => {
      mode = 'draw';
      selectedId = null;
      document.getElementById('modeBtn2').textContent = 'Draw mode';
      renderPalette();
    });
    document.getElementById('clearBtn2').addEventListener('click', () => {
      p.background('#f7f4ee');
      elements = [];
      selectedId = null;
      mode = 'draw';
      document.getElementById('modeBtn2').textContent = 'Draw mode';
      renderPalette();
      const tw = document.getElementById('three-canvas-3');
      tw.style.display = 'none';
      tw.innerHTML = '';
    });
  };
  // Intentionally empty: keeps p5's internal frame loop running (so
  // pmouseX/pmouseY update correctly between drag events) without
  // clearing or redrawing anything on the canvas each frame.
  p.draw = () => {};
  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;
    if (mode === 'stamp') {
      const el = elements.find(e => e.id === selectedId);
      if (el) {
        el.count++;
        p.noStroke();
        p.fill(el.color);
        p.circle(p.mouseX, p.mouseY, 14);
        renderPalette();
      }
      return false;
    }
    currentStroke = {
      color: document.getElementById('brushColor2').value,
      width: Number(document.getElementById('brushSize2').value),
      points: [{ x: p.mouseX, y: p.mouseY }],
    };
    return false;
  };
  p.mouseDragged = () => {
    if (mode === 'stamp' || !currentStroke) return false;
    p.stroke(document.getElementById('brushColor2').value);
    p.strokeWeight(Number(document.getElementById('brushSize2').value));
    p.strokeCap(p.ROUND);
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
    currentStroke.points.push({ x: p.mouseX, y: p.mouseY });
    return false;
  };
  p.mouseReleased = () => {
    if (mode === 'stamp') return;
    if (currentStroke && currentStroke.points.length > 0) {
      const type = classify(currentStroke, H);
      elements.push({ id: Date.now() + Math.random(), type, color: currentStroke.color, count: 1 });
      renderPalette();
    }
    currentStroke = null;
  };
};
new p5(brushSketch, 'p5-canvas-3');

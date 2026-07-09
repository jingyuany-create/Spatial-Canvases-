// 03 — Static Composition, Primitive Shapes
// A fixed abstract landscape built from circles, arcs, triangles and lines.

const sketch1 = (p) => {
  const W = 500, H = 380;
  const palette = {
    sky: '#EAD9C0',
    sunGlow: '#F2CC8F',
    sun: '#E07A5F',
    hillFar: '#81B29A',
    hillNear: '#3D405B',
    tree: '#2B2926',
  };

  p.setup = () => {
    p.createCanvas(W, H);
    p.noLoop();
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    p.background(palette.sky);

    // sun with glow rings
    p.noStroke();
    for (let r = 160; r > 60; r -= 20) {
      p.fill(palette.sunGlow + hexAlpha(0.12));
      p.circle(360, 110, r);
    }
    p.fill(palette.sun);
    p.circle(360, 110, 70);

    // far hill (arc)
    p.fill(palette.hillFar);
    p.arc(160, 420, 560, 340, 180, 360, p.CHORD);

    // near hill (arc)
    p.fill(palette.hillNear);
    p.arc(420, 460, 620, 300, 180, 360, p.CHORD);

    // scattered triangle trees on the near hill
    p.fill(palette.tree);
    const treeXs = [90, 140, 190, 260, 310, 250];
    treeXs.forEach((x, i) => {
      const y = 330 - (i % 3) * 8;
      drawTree(x, y, 26 + (i % 3) * 6);
    });

    // foreground grass line
    p.stroke(palette.hillNear);
    p.strokeWeight(2);
    for (let x = 0; x < W; x += 14) {
      const h = 6 + (x % 40) / 6;
      p.line(x, H - 4, x, H - 4 - h);
    }
  };

  function drawTree(x, y, s) {
    p.triangle(x, y - s, x - s * 0.6, y, x + s * 0.6, y);
    p.triangle(x, y - s * 1.5, x - s * 0.45, y - s * 0.55, x + s * 0.45, y - s * 0.55);
    p.rect(x - 3, y, 6, 10);
  }

  function hexAlpha(a) {
    const v = Math.round(a * 255).toString(16).padStart(2, '0');
    return v;
  }
};

new p5(sketch1, 'p5-canvas-1');

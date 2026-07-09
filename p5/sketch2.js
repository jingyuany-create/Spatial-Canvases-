// 04 — Interactive / Animated Drawing
// Draw with the mouse; each stroke spawns drifting, fading particles.

const sketch2 = (p) => {
  const W = 500, H = 380;
  let particles = [];
  const palette = ['#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#EAD9C0'];

  p.setup = () => {
    const cnv = p.createCanvas(W, H);
    p.background(20, 18, 24);
    p.colorMode(p.RGB);

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        particles = [];
        p.background(20, 18, 24);
      });
    }
  };

  p.draw = () => {
    p.noStroke();
    p.fill(20, 18, 24, 40);
    p.rect(0, 0, W, H);

    if (p.mouseIsPressed && p.mouseX > 0 && p.mouseX < W && p.mouseY > 0 && p.mouseY < H) {
      for (let i = 0; i < 3; i++) {
        particles.push(makeParticle(p.mouseX, p.mouseY));
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.01;
      pt.life -= 1;

      p.noStroke();
      p.fill(pt.col[0], pt.col[1], pt.col[2], p.map(pt.life, 0, pt.maxLife, 0, 200));
      p.circle(pt.x, pt.y, pt.size);

      if (pt.life <= 0) particles.splice(i, 1);
    }
  };

  function makeParticle(x, y) {
    const c = hexToRgb(palette[Math.floor(p.random(palette.length))]);
    const maxLife = p.random(50, 110);
    return {
      x: x + p.random(-4, 4),
      y: y + p.random(-4, 4),
      vx: p.random(-0.8, 0.8),
      vy: p.random(-1.4, -0.2),
      size: p.random(4, 14),
      col: c,
      life: maxLife,
      maxLife,
    };
  }

  function hexToRgb(hex) {
    const v = hex.replace('#', '');
    return [
      parseInt(v.substring(0, 2), 16),
      parseInt(v.substring(2, 4), 16),
      parseInt(v.substring(4, 6), 16),
    ];
  }
};

new p5(sketch2, 'p5-canvas-2');

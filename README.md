# Spatial Canvases — Assignment 3

## Files
```
index.html          main page (loads everything below)
style.css            page styling
p5/sketch1.js        2D static primitive-shape composition
p5/sketch2.js        2D interactive/animated drawing
three/scene1.js      3D procedural geometry + orbit camera
three/scene2.js      3D materials / lighting / fog composition
```

p5.js and three.js themselves are loaded via CDN links inside `index.html` —
you do not need to download or upload those library files.

## How to put this on GitHub Pages

1. Create a new repository on GitHub (or use your existing course website repo).
2. Copy all the files/folders above into the root of that repository
   (keep the `p5/` and `three/` folders — do not flatten them, since
   `index.html` references `p5/sketch1.js` etc.).
3. Commit and push.
4. In the repo settings → **Pages**, set the source to the branch you pushed
   to (usually `main`) and the folder to `/ (root)`.
5. Wait a minute for it to build, then visit the URL GitHub gives you
   (usually `https://<your-username>.github.io/<repo-name>/`).
6. Open that URL, confirm all four canvases render and the p5 sketches
   respond to interaction, then take your submission screenshot.

## Customizing
- Colors: each sketch/scene has a `palette` array/object near the top —
  edit those hex values to make it your own.
- If your course's "Multiple Canvases" tutorial uses a different p5
  instance-mode pattern or a different three.js canvas-management helper,
  swap the relevant block in `p5/*.js` or `three/*.js` — the constructor
  calls (`new p5(sketch, 'container-id')`) and the IIFE-wrapped three.js
  scenes are both standard patterns and should slot into most course
  templates with minor edits.

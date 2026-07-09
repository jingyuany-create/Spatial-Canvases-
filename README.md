# Spatial Canvases — Assignment 3

## Files
```
index.html          main page (loads everything below)
style.css            page styling
p5/sketch1.js        2D static primitive-shape composition            (canvas 03)
p5/sketch2.js        2D interactive/animated drawing                  (canvas 04)
p5/sketch3.js        2D drawing + shape classification                (canvas 05, drawing half)
three/scene1.js      3D procedural geometry + orbit camera            (canvas 01)
three/scene2.js      3D materials / lighting / fog composition        (canvas 02)
three/scene3.js      3D scene generated live from what you drew       (canvas 05, generated half)
```

p5.js and three.js themselves are loaded via CDN links inside `index.html` —
you do not need to download or upload those library files.

`p5/sketch3.js` and `three/scene3.js` are a pair: sketch3.js declares the
shared drawing state (`elements`, `mode`, etc.) at the top level of the
script, and scene3.js — loaded right after it — reads that same state to
build the 3D scene. Because both are loaded as plain (non-module) `<script>`
tags on the same page, they share one global scope, so this works without
any extra wiring. Keep them loaded in that order (sketch3.js before scene3.js,
both after index.html's DOM), which is already how `index.html` is set up.

## How to put this on GitHub Pages

**The safest way to upload without losing the folder structure:** on your
repo's GitHub page, click "Add file" → "Upload files", then drag the whole
`spatial-canvases-site` folder (not the individual files one by one) from
your computer's file explorer into the browser — modern browsers (Chrome,
Edge) preserve folder structure when you drag a folder in this way. If you
drag individual files instead, the `p5/` and `three/` subfolders will be
lost and the page's script tags (`<script src="p5/sketch1.js">` etc.) will
404 and no canvases will render.

Steps:
1. Create a new repository on GitHub (or use your existing course website repo).
2. Drag the `spatial-canvases-site` folder into the "Upload files" area so
   `index.html`, `style.css`, `p5/`, and `three/` end up at the repo root.
3. Commit and push.
4. In the repo settings → **Pages**, set the source to the branch you pushed
   to (usually `main`) and the folder to `/ (root)`.
5. Wait a minute for it to build, then visit the URL GitHub gives you
   (usually `https://<your-username>.github.io/<repo-name>/`).
6. Open that URL, confirm all five canvases render and respond to
   interaction, then take your submission screenshot.

If you'd rather avoid any risk of the folder structure getting lost during
upload, there is also a single-file version of this same site (everything
inlined into one `index.html`, no subfolders) — ask for it if you want it.

## Customizing
- Colors: each sketch/scene has a `palette` array/object (or, in canvas 05,
  whatever color you pick with the color swatch) near the top — edit those
  hex values to make it your own.
- Canvas 05's shape → object-type rules live in the `classify()` function
  in `p5/sketch3.js`; the size thresholds there are easy to retune if a
  shape you draw keeps getting misclassified.

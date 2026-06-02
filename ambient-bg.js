(function initAmbientBackground() {
  const canvas = document.getElementById("ambientCanvas");
  const spotlight = document.querySelector(".ambient-spotlight");
  const root = document.documentElement;
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowScreen = window.matchMedia("(max-width: 860px)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;
  let running = true;

  let targetX = 0;
  let targetY = 0;
  let displayX = 0;
  let displayY = 0;

  const palette = [
    "rgba(255, 122, 26, 0.85)",
    "rgba(49, 103, 255, 0.75)",
    "rgba(120, 86, 255, 0.7)",
    "rgba(21, 164, 106, 0.65)"
  ];

  const particleCount = reducedMotion || narrowScreen ? 0 : coarsePointer ? 28 : 44;
  const linkDistance = coarsePointer ? 118 : 148;
  const linkDistSq = linkDistance * linkDistance;
  const pointerEase = coarsePointer ? 0.32 : 0.26;

  let mxCache = "";
  let myCache = "";

  function applyPointer(x, y) {
    if (spotlight) {
      spotlight.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    const px = ((x / Math.max(width, 1)) * 100).toFixed(1);
    const py = ((y / Math.max(height, 1)) * 100).toFixed(1);
    const mx = `${px}%`;
    const my = `${py}%`;
    if (mx !== mxCache) {
      mxCache = mx;
      root.style.setProperty("--mx", mx);
    }
    if (my !== myCache) {
      myCache = my;
      root.style.setProperty("--my", my);
    }
  }

  function stepPointer() {
    const dx = targetX - displayX;
    const dy = targetY - displayY;
    if (Math.abs(dx) < 0.35 && Math.abs(dy) < 0.35) {
      displayX = targetX;
      displayY = targetY;
    } else {
      displayX += dx * pointerEase;
      displayY += dy * pointerEase;
    }
    applyPointer(displayX, displayY);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
    targetX = width * 0.5;
    targetY = height * 0.28;
    displayX = targetX;
    displayY = targetY;
    applyPointer(displayX, displayY);
  }

  function seedParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: 1.8 + Math.random() * 2.2,
      color: palette[(Math.random() * palette.length) | 0]
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = width + 20;
      else if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      else if (particle.y > height + 20) particle.y = -20;
    }

    const n = particles.length;
    let hasLinks = false;
    ctx.beginPath();
    for (let i = 0; i < n; i += 1) {
      const a = particles[i];
      for (let j = i + 1; j < n; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > linkDistSq) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        hasLinks = true;
      }
    }
    if (hasLinks) {
      ctx.strokeStyle = "rgba(32, 27, 20, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (const particle of particles) {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    if (!running) return;
    stepPointer();
    if (particleCount > 0) drawParticles();
    rafId = window.requestAnimationFrame(tick);
  }

  function onPointerMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
  }

  function onVisibilityChange() {
    running = document.visibilityState === "visible";
    if (running) {
      window.cancelAnimationFrame(rafId);
      tick();
    }
  }

  resize();

  if (reducedMotion || particleCount === 0) {
    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        displayX = targetX;
        displayY = targetY;
        applyPointer(displayX, displayY);
      },
      { passive: true }
    );
    window.addEventListener("resize", resize);
    return;
  }

  tick();
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibilityChange);
})();

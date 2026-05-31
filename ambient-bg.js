(function initAmbientBackground() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;
  let running = true;

  const palette = [
    "rgba(255, 122, 26, 0.55)",
    "rgba(49, 103, 255, 0.45)",
    "rgba(120, 86, 255, 0.4)",
    "rgba(21, 164, 106, 0.35)"
  ];

  const particleCount = reducedMotion ? 0 : coarsePointer ? 28 : 48;
  const linkDistance = coarsePointer ? 110 : 140;

  function setPointer(x, y) {
    const px = (x / Math.max(width, 1)) * 100;
    const py = (y / Math.max(height, 1)) * 100;
    document.documentElement.style.setProperty("--mx", `${px}%`);
    document.documentElement.style.setProperty("--my", `${py}%`);
    document.documentElement.style.setProperty("--grid-x", `${((px - 50) * 0.18).toFixed(2)}`);
    document.documentElement.style.setProperty("--grid-y", `${((py - 50) * 0.18).toFixed(2)}`);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1.2 + Math.random() * 1.8,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  }

  function draw() {
    if (!running || particleCount === 0) return;
    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > linkDistance) continue;
        const alpha = (1 - dist / linkDistance) * 0.22;
        ctx.strokeStyle = `rgba(32, 27, 22, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const particle of particles) {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(draw);
  }

  function onPointerMove(event) {
    setPointer(event.clientX, event.clientY);
  }

  function onVisibilityChange() {
    running = document.visibilityState === "visible";
    if (running && particleCount > 0) {
      window.cancelAnimationFrame(rafId);
      draw();
    }
  }

  resize();
  setPointer(width * 0.5, height * 0.28);

  if (!reducedMotion && particleCount > 0) {
    draw();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }
})();

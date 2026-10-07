(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.reading-progress');
  let pending = false;
  function update() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0})`;
    pending = false;
  }
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add('visible');
      else observer.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
  }
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let frame;
      card.addEventListener('pointermove', event => {
        if (reduced.matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { card.style.transform = `perspective(1400px) rotateX(${-y * 2.2}deg) rotateY(${x * 2.2}deg)`; });
      });
      card.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); card.style.transform = ''; });
    });
  }
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
})();

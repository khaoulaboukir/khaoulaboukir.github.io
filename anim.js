(() => {
  const mouse = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let layer;
  let lastBubble = -Infinity;

  function clear() {
    layer?.remove();
    layer = null;
    lastBubble = -Infinity;
  }

  function move(event) {
    if (event.pointerType !== 'mouse' || document.hidden) return;
    const now = performance.now();
    if (now - lastBubble < 80) return;
    lastBubble = now;

    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'cursor-bubbles';
      layer.setAttribute('aria-hidden', 'true');
      document.body.append(layer);
    }
    if (layer.childElementCount >= 12) return;

    const bubble = document.createElement('span');
    bubble.className = 'cursor-bubble';
    bubble.style.left = `${event.clientX}px`;
    bubble.style.top = `${event.clientY}px`;
    bubble.style.setProperty('--drift', `${Math.random() * 20 - 10}px`);
    bubble.addEventListener('animationend', () => bubble.remove(), { once: true });
    layer.append(bubble);
  }

  function update() {
    document.removeEventListener('pointermove', move);
    clear();
    if (mouse.matches && !reducedMotion.matches) {
      document.addEventListener('pointermove', move, { passive: true });
    }
  }

  mouse.addEventListener('change', update);
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', clear);
  window.addEventListener('pagehide', clear);
  update();
})();

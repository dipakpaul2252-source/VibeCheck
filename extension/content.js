(() => {
  const SLANG_MAP = {
    'lock in': 'Focus intensely with zero distractions (Twitch/Gaming 2023)',
    'cooked': 'Completely ruined or facing inevitable defeat',
    'crashout': 'Losing temper completely and acting recklessly',
    'aura points': 'Quantified score of personal charisma or public embarrassment',
    'fanum tax': 'Stealing food from a friend without permission',
    'mogging': 'Physically outshining or dominating someone aesthetics',
    'mewing': 'Tongue posture exercise used as a code for silence',
    'delulu': 'Strategic delusion as an optimistic coping mechanism'
  };

  const createTooltip = (text, meaning, x, y) => {
    const existing = document.getElementById('vibecheck-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'vibecheck-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 45}px`;
    tooltip.style.zIndex = '999999';
    tooltip.style.background = '#E2F952';
    tooltip.style.color = '#000000';
    tooltip.style.fontFamily = 'monospace';
    tooltip.style.fontSize = '12px';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.padding = '6px 10px';
    tooltip.style.border = '2px solid #000000';
    tooltip.style.boxShadow = '3px 3px 0px #000000';
    tooltip.innerHTML = `<strong>⚡ ${text.toUpperCase()}:</strong> ${meaning}`;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      if (tooltip && tooltip.parentNode) {
        tooltip.remove();
      }
    }, 3500);
  };

  document.addEventListener('mouseup', (e) => {
    const selected = window.getSelection().toString().trim().toLowerCase();
    if (SLANG_MAP[selected]) {
      createTooltip(selected, SLANG_MAP[selected], e.pageX, e.pageY);
    }
  });
})();

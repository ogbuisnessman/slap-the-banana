(() => {
  const bananaStageEl = document.getElementById('banana-stage');
  const bananaCountEl = document.getElementById('banana-count');
  const bananaCountEl2 = document.getElementById('banana-count-2');
  const ppcEl = document.getElementById('ppc');
  const handEl = document.getElementById('hand');
  const resetBtn = document.getElementById('reset-btn');

  const loadInt = (key, fallback = 0) => {
    const v = parseInt(localStorage.getItem(key));
    return Number.isFinite(v) ? v : fallback;
  };
  const save = (key, value) => localStorage.setItem(key, value);

  let bananas = loadInt('bananas', 0);
  let ppc = loadInt('ppc', 1);

  function updateUI() {
    bananaCountEl.textContent = bananas;
    bananaCountEl2.textContent = bananas;
    ppcEl.textContent = ppc;
  }
  updateUI();

  const handVariants = [
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'><g fill='#ffcc99'><ellipse cx='36' cy='70' rx='20' ry='12'/><rect x='48' y='22' rx='10' ry='10' width='14' height='48'/><rect x='64' y='18' rx='10' ry='10' width='12' height='52'/><rect x='80' y='24' rx='10' ry='10' width='10' height='44'/></g></svg>`)}`,
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'><g fill='#e6e6e6'><rect x='20' y='30' rx='12' ry='12' width='72' height='44'/><circle cx='36' cy='30' r='12'/><circle cx='52' cy='26' r='10'/><circle cx='68' cy='26' r='10'/></g></svg>`)}`,
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'><g fill='#ffb380'><rect x='18' y='36' rx='10' ry='10' width='84' height='36'/><ellipse cx='36' cy='36' rx='14' ry='12'/></g></svg>`)}`,
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'><g fill='#b0c4de'><rect x='14' y='28' rx='8' width='92' height='44'/><rect x='28' y='18' rx='6' width='10' height='22'/><rect x='46' y='14' rx='6' width='12' height='26'/></g></svg>`)}`,
  ];

  function doHandAnimation() {
    const v = handVariants[Math.floor(Math.random() * handVariants.length)];
    handEl.style.backgroundImage = `url("${v}")`;
    handEl.style.left = `50%`;
    handEl.style.top = `50%`;
    handEl.classList.remove('hidden');
    handEl.classList.add('slap');

    setTimeout(() => {
      handEl.classList.remove('slap');
      handEl.classList.add('hidden');
    }, 300);
  }

  // Click anywhere in banana-stage
  bananaStageEl.addEventListener('click', () => {
    bananas += ppc;
    save('bananas', bananas);
    updateUI();
    doHandAnimation();
  });

  resetBtn.addEventListener('click', () => {
    localStorage.clear();
    bananas = 0;
    ppc = 1;
    updateUI();
  });
})();

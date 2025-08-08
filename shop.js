(() => {
  // load helpers
  const loadInt = (k, f=0) => {
    const v = parseInt(localStorage.getItem(k));
    return Number.isFinite(v) ? v : f;
  };
  const save = (k,v) => localStorage.setItem(k,v);

  // DOM
  const bananaCountEl = document.getElementById('banana-count');
  const ppcEl = document.getElementById('ppc');
  const shopItemsContainer = document.getElementById('shop-items');
  const ownedListEl = document.getElementById('owned-list');

  // State
  let bananas = loadInt('bananas', 0);
  let ppc = loadInt('ppc', 1);
  let ownedIndex = loadInt('ownedIndex', -1);

  // Creative clicker names
  const preset = [
    "Bare Hand","Wooden Spoon","Plastic Spatula","Rubber Chicken","Small Shovel","Steel Pan","Slipper",
    "Banana Peeler","Baseball Bat","Laser Pointer","Toy Hammer","Fly Swatter","Broomstick","Fishing Rod",
    "Banana Gun","Slap Glove","Frying Pan","Rubber Chainsaw","Magic Wand","Paint Roller","Feather Duster",
    "Snow Shovel","Soccer Cleat","Ping Pong Paddle","Drumstick","Pizza Cutter","Claw Machine","Sledgehammer",
    "Banana Launcher","Katana","BB Gun","Tennis Racket","Boxing Glove","Banana Drone","Golf Club",
    "Boomerang","Banana Cannon","Mallet","Electric Fan","Banana Blaster","Forklift Glove","Steamroller",
    "Mini Chainsaw","Banana Mech","Banana Satellite","Banana Submarine","Banana Tank","Banana Jet","Banana UFO",
    "Banana Robot","Banana Dragon","Banana Wizard","Banana Phoenix","Banana Knight","Banana Giant","Banana King",
    "Banana Emperor","Banana God","Infinity Slap","Quantum Banana","Atomic Banana","Black Hole Banana",
    "Galaxy Banana","Time Banana","Banana Sun","Banana Moon","Banana Star","Banana Meteor","Banana Planet",
    "Banana Galaxy","Banana Universe","Banana Multiverse","Banana Omniverse","Banana Reality","Banana Dimension",
    "Banana Portal","Banana Wormhole","Banana Singularity","Banana Energy Core","Banana AI","Banana Supernova",
    "Banana Void","Banana Chaos","Banana Infinity","Banana Beyond","Banana Apocalypse","Banana Genesis",
    "Banana Omega","Banana Alpha","Banana Prime","Banana Supreme","Banana Eternal","Banana Immortal",
    "Banana Transcendent","Banana Ultimate","Banana Final","Banana Absolute","Banana Legend"
  ];

  const names = [];
  for (let i=0; i<100; i++){
    names.push(preset[i] || `Mystery Clicker #${i+1}`);
  }

  // Create items with price scaling and PPC increase
  const items = [];
  let price = 100;
  for (let i=0; i<100; i++){
    const ppcGain = 1 + Math.floor(i * 0.18);
    items.push({
      id: i,
      name: names[i],
      price: price,
      ppcGain: ppcGain
    });
    price = Math.floor(price * 1.25) + Math.floor(i*2);
  }

  function updateTopBar() {
    bananaCountEl.textContent = bananas;
    ppcEl.textContent = ppc;
  }

  function renderOwned() {
    if (!ownedListEl) return; // if your HTML doesn't have this element, skip
    if (ownedIndex < 0) {
      ownedListEl.textContent = 'None';
    } else {
      const ownedNames = items.slice(0, ownedIndex+1).map(i => i.name);
      ownedListEl.textContent = ownedNames.join(', ');
    }
  }

  function renderShop() {
    shopItemsContainer.innerHTML = '';
    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      const thumb = document.createElement('div');

      if (idx <= ownedIndex) {
        thumb.className = 'shop-thumb';
        thumb.textContent = 'OWNED';
        thumb.style.background = 'linear-gradient(180deg,#c8ffd3,#9ff2a7)';
        card.classList.add('owned');
      } else if (idx === ownedIndex + 1) {
        thumb.className = 'shop-thumb';
        thumb.textContent = item.name.split(' ')[0];
        thumb.style.background = 'linear-gradient(180deg,#ffd54a,#f1c40f)';
      } else {
        thumb.className = 'silhouette';
        thumb.textContent = item.name.split(' ')[0]; // show name but as silhouette
      }

      const info = document.createElement('div');
      info.className = 'shop-info';

      const title = document.createElement('div');
      title.className = 'shop-title';
      title.textContent = (idx === ownedIndex + 1) ? item.name : (idx <= ownedIndex ? item.name : '???');

      const priceRow = document.createElement('div');
      priceRow.className = 'shop-price';
      priceRow.textContent = `${item.price} 🍌`;

      const ppcNote = document.createElement('div');
      ppcNote.style.color = '#666';
      ppcNote.style.fontSize = '0.9rem';
      ppcNote.textContent = `+${item.ppcGain} Bananas per click`;

      info.appendChild(title);
      info.appendChild(priceRow);
      info.appendChild(ppcNote);

      const action = document.createElement('div');
      action.className = 'buy-row';

      const buyBtn = document.createElement('button');
      buyBtn.className = 'buy-btn';
      buyBtn.textContent = 'Buy';

      buyBtn.disabled = idx !== ownedIndex + 1;
      if (!buyBtn.disabled) {
        buyBtn.addEventListener('click', () => {
          if (bananas >= item.price) {
            bananas -= item.price;
            ppc += item.ppcGain;
            ownedIndex = idx;
            save('bananas', bananas);
            save('ppc', ppc);
            save('ownedIndex', ownedIndex);
            updateTopBar();
            renderShop();
            renderOwned();
            // console.log for less annoyance
            console.log(`You bought ${item.name}! Bananas per click increased by ${item.ppcGain}.`);
          } else {
            alert('Not enough bananas!');
          }
        });
      }

      action.appendChild(buyBtn);
      card.appendChild(thumb);
      card.appendChild(info);
      card.appendChild(action);
      shopItemsContainer.appendChild(card);
    });

    updateTopBar();
    renderOwned();
  }

  function init() {
    bananas = loadInt('bananas', bananas);
    ppc = loadInt('ppc', ppc);
    ownedIndex = loadInt('ownedIndex', ownedIndex);
    renderShop();
  }

  window.addEventListener('storage', (ev) => {
    if (ev.key === 'bananas' || ev.key === 'ppc' || ev.key === 'ownedIndex') {
      bananas = loadInt('bananas', bananas);
      ppc = loadInt('ppc', ppc);
      ownedIndex = loadInt('ownedIndex', ownedIndex);
      updateTopBar();
      renderShop();
    }
  });

  init();
})();

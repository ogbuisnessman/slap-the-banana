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
  let ownedIndex = loadInt('ownedIndex', -1); // highest index purchased; -1 = none, next-to-buy = ownedIndex + 1

  // Build 100 creative names (mix of quirky + generated)
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

  // Ensure exactly 100 names
  const names = [];
  for (let i=0;i<100;i++){
    names.push(preset[i] || `Mystery Clicker #${i+1}`);
  }

  // Create items with price scaling and ppc increment
  const items = [];
  let price = 100;
  for (let i=0;i<100;i++){
    // multiplier: incremental PPC increase. We'll start small and grow gradually.
    // We'll use: ppcGain = 1 + Math.floor(i * 0.2) so early ones give small increases while later give larger boosts.
    const ppcGain = 1 + Math.floor(i * 0.18);
    items.push({
      id: i,
      name: names[i],
      price: price,
      ppcGain: ppcGain
    });
    price = Math.floor(price * 1.25) + Math.floor(i*2); // grows ~25% each step + tiny bump
  }

  // UI update
  function updateTopBar() {
    bananaCountEl.textContent = bananas;
    ppcEl.textContent = ppc;
  }

  // render owned list
  function renderOwned() {
    if (ownedIndex < 0) {
      ownedListEl.textContent = 'None';
    } else {
      const ownedNames = items.slice(0, ownedIndex+1).map(i => i.name);
      ownedListEl.textContent = ownedNames.join(', ');
    }
  }

  // Render shop cards
  function renderShop() {
    shopItemsContainer.innerHTML = '';
    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      const thumb = document.createElement('div');

      // if index <= ownedIndex it is owned -> show small badge
      if (idx <= ownedIndex) {
        thumb.className = 'shop-thumb';
        thumb.textContent = 'OWNED';
        thumb.style.background = 'linear-gradient(180deg,#c8ffd3,#9ff2a7)';
        card.classList.add('owned');
      } else if (idx === ownedIndex + 1) {
        // next-to-buy: reveal fully
        thumb.className = 'shop-thumb';
        thumb.textContent = item.name.split(' ')[0]; // short label
        thumb.style.background = 'linear-gradient(180deg,#ffd54a,#f1c40f)';
      } else {
        // Locked silhouette for future
        thumb.className = 'silhouette';
        thumb.textContent = '???';
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
      ppcNote.textContent = `+${item.ppcGain} PPC`;

      info.appendChild(title);
      info.appendChild(priceRow);
      info.appendChild(ppcNote);

      const action = document.createElement('div');
      action.className = 'buy-row';

      const buyBtn = document.createElement('button');
      buyBtn.className = 'buy-btn';
      buyBtn.textContent = 'Buy';
      // Only enable buy button for the next-to-buy card
      if (idx !== ownedIndex + 1) {
        buyBtn.disabled = true;
      } else {
        // enabled, attach click handler
        buyBtn.addEventListener('click', () => {
          if (bananas >= item.price) {
            // purchase
            bananas -= item.price;
            ppc += item.ppcGain;
            ownedIndex = idx;
            save('bananas', bananas);
            save('ppc', ppc);
            save('ownedIndex', ownedIndex);
            updateTopBar();
            renderShop();
            renderOwned();
            alert(`You bought ${item.name}! PPC increased by ${item.ppcGain}.`);
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

  // initial render
  function init() {
    bananas = loadInt('bananas', bananas);
    ppc = loadInt('ppc', ppc);
    ownedIndex = loadInt('ownedIndex', ownedIndex);
    renderShop();
  }

  // storage listener to update if game page changes bananas
  window.addEventListener('storage', (ev) => {
    if (ev.key === 'bananas' || ev.key === 'ppc' || ev.key === 'ownedIndex') {
      bananas = loadInt('bananas', bananas);
      ppc = loadInt('ppc', ppc);
      ownedIndex = loadInt('ownedIndex', ownedIndex);
      updateTopBar();
      renderShop();
    }
  });

  // save helpers
  function saveState(){ save('bananas',bananas); save('ppc',ppc); save('ownedIndex',ownedIndex); }

  // init
  init();
})();

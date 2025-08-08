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
    "Mini Chains


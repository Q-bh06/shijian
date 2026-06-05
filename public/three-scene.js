import * as THREE from "./vendor/three.module.min.js";

const BLOCK_LENGTH = 24;
const VISIBLE_BLOCKS = 2;

const modules = [
  {
    key: "projects",
    label: "项目库",
    building: "项目展示馆",
    desc: "浏览支教、科创、调研与社区服务项目，选择适合自己的实践方向。",
    href: "#/projects",
    action: "进入项目库",
    color: 0xe96e5f,
    roof: 0xf18a68
  },
  {
    key: "outcomes",
    label: "成果库",
    building: "成果展览馆",
    desc: "查看纪录片、推送文章、调研报告与摄影作品，让实践留下可见回响。",
    href: "#/outcomes",
    action: "进入成果库",
    color: 0xf1c85b,
    roof: 0xf4d16f
  },
  {
    key: "activities",
    label: "活动广场",
    building: "活动中心广场",
    desc: "参加讲座、分享会和传统工艺体验，在交流中找到新的出发点。",
    href: "#/activities",
    action: "进入活动广场",
    color: 0x4c7ea6,
    roof: 0x6ca0c9
  },
  {
    key: "register",
    label: "报名中心",
    building: "实践服务中心",
    desc: "提交姓名、学号、联系方式和意向项目，完成一次实践报名。",
    href: "#/register",
    action: "去报名",
    color: 0x2f7a68,
    roof: 0x4c9a7d
  }
];

export function createPracticeWorld(root) {
  if (!root) return null;

  const canvas = root.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.shadowMap.enabled = false;
  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc8eadf);
  scene.fog = new THREE.Fog(0xc8eadf, 26, 78);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 130);
  camera.position.set(0, 6.8, 10.8);
  camera.lookAt(0, 1.1, -13);

  const world = new THREE.Group();
  scene.add(world);

  const ambient = new THREE.HemisphereLight(0xfff9d7, 0x5b917b, 2.55);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff0bd, 2.8);
  sun.position.set(-8, 16, 10);
  scene.add(sun);

  const materials = makeMaterials();
  const blocks = Array.from({ length: VISIBLE_BLOCKS }, (_, index) => {
    const block = makeBlock(index, materials);
    world.add(block);
    return block;
  });

  const runner = makeRunner(materials);
  scene.add(runner);

  const clouds = makeClouds(materials);
  clouds.forEach((cloud) => scene.add(cloud));

  const skyHills = makeSkyHills(materials);
  scene.add(skyHills);

  const state = {
    distance: 0,
    targetDistance: 0,
    lastBlock: -1,
    lastUiBlock: -1,
    lastFrame: 0,
    rafId: 0,
    running: true
  };

  const controls = bindControls(root, state);
  const resize = () => {
    const width = Math.max(root.clientWidth, 1);
    const height = Math.max(root.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 720 ? 54 : 46;
    camera.updateProjectionMatrix();
  };

  const animate = (time) => {
    if (!state.running) return;
    if (time - state.lastFrame < 42) {
      state.rafId = requestAnimationFrame(animate);
      return;
    }
    state.lastFrame = time;
    const t = time * 0.001;
    state.distance += (state.targetDistance - state.distance) * 0.075;

    const currentBlock = Math.max(0, Math.floor(state.distance / BLOCK_LENGTH));
    if (currentBlock !== state.lastBlock) {
      updateBlocks(blocks, currentBlock, materials);
      state.lastBlock = currentBlock;
    }

    const localProgress = (state.distance % BLOCK_LENGTH) / BLOCK_LENGTH;
    root.style.setProperty("--runner-progress", localProgress.toFixed(3));
    updateUi(root, Math.max(0, Math.floor(state.targetDistance / BLOCK_LENGTH)), state);
    updateCamera(camera, state.distance);
    updateRunner(runner, t, state.distance);
    animateBlocks(blocks, t, state.distance);
    animateClouds(clouds, t, state.distance);
    skyHills.position.z = -state.distance - 44;
    skyHills.position.x = Math.sin(t * 0.18) * 0.25;

    renderer.render(scene, camera);
    state.rafId = requestAnimationFrame(animate);
  };

  resize();
  updateBlocks(blocks, 0, materials);
  updateUi(root, 0, state, true);
  window.addEventListener("resize", resize);
  state.rafId = requestAnimationFrame(animate);

  return {
    dispose() {
      state.running = false;
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      disposeObject(scene);
      renderer.dispose();
    }
  };
}

function bindControls(root, state) {
  const go = (amount) => {
    state.targetDistance = Math.max(0, state.targetDistance + amount);
    const targetBlock = Math.max(0, Math.floor(state.targetDistance / BLOCK_LENGTH));
    const localProgress = (state.targetDistance % BLOCK_LENGTH) / BLOCK_LENGTH;
    root.style.setProperty("--runner-progress", localProgress.toFixed(3));
    updateUi(root, targetBlock, state);
  };

  const wheel = (event) => {
    if (Math.abs(event.deltaY) < 3) return;
    event.preventDefault();
    go(event.deltaY > 0 ? 4.8 : -4.8);
  };

  const keydown = (event) => {
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      go(5.2);
    }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      go(-5.2);
    }
  };

  let dragY = null;
  const pointerDown = (event) => {
    dragY = event.clientY;
    root.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event) => {
    if (dragY === null) return;
    const delta = dragY - event.clientY;
    dragY = event.clientY;
    go(delta * 0.16);
  };
  const pointerUp = () => {
    dragY = null;
  };

  const forwardButton = root.querySelector('[data-runner-action="forward"]');
  const backwardButton = root.querySelector('[data-runner-action="backward"]');
  const forward = () => go(BLOCK_LENGTH);
  const backward = () => go(-BLOCK_LENGTH);

  window.addEventListener("wheel", wheel, { passive: false });
  window.addEventListener("keydown", keydown);
  root.addEventListener("pointerdown", pointerDown);
  root.addEventListener("pointermove", pointerMove);
  root.addEventListener("pointerup", pointerUp);
  root.addEventListener("pointercancel", pointerUp);
  forwardButton?.addEventListener("click", forward);
  backwardButton?.addEventListener("click", backward);

  return {
    dispose() {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keydown);
      root.removeEventListener("pointerdown", pointerDown);
      root.removeEventListener("pointermove", pointerMove);
      root.removeEventListener("pointerup", pointerUp);
      root.removeEventListener("pointercancel", pointerUp);
      forwardButton?.removeEventListener("click", forward);
      backwardButton?.removeEventListener("click", backward);
    }
  };
}

function updateBlocks(blocks, currentBlock, materials) {
  blocks.forEach((block, offset) => {
    const blockIndex = currentBlock + offset;
    const module = modules[blockIndex % modules.length];
    if (block.userData.index !== blockIndex) {
      block.clear();
      buildBlock(block, blockIndex, module, materials);
      block.userData.index = blockIndex;
    }
    block.position.z = -blockIndex * BLOCK_LENGTH;
  });
}

function makeBlock() {
  const block = new THREE.Group();
  block.userData.index = null;
  return block;
}

function buildBlock(block, blockIndex, module, materials) {
  addCampusGround(block, blockIndex, materials);
  addRoad(block, materials);
  addRoadLines(block, materials);
  addModuleBuilding(block, module, materials);
  addModuleDecorations(block, module, blockIndex, materials);
  addTrees(block, blockIndex, materials);
  addWater(block, blockIndex, materials);
  addBlockLabel(block, module);
}

function addCampusGround(block, blockIndex, materials) {
  const base = box(22, 0.34, BLOCK_LENGTH + 0.8, materials.grass);
  base.position.set(0, -0.18, -BLOCK_LENGTH / 2);
  block.add(base);

  const leftPatch = box(5.2, 0.08, 7.2, blockIndex % 2 ? materials.grassLight : materials.grassDark);
  leftPatch.position.set(-6.9, 0.02, -7.2);
  leftPatch.rotation.y = -0.08;
  block.add(leftPatch);

  const rightPatch = box(5.6, 0.08, 6.4, blockIndex % 2 ? materials.grassDark : materials.grassLight);
  rightPatch.position.set(6.6, 0.03, -15.4);
  rightPatch.rotation.y = 0.08;
  block.add(rightPatch);
}

function addRoad(block, materials) {
  const road = box(3.2, 0.11, BLOCK_LENGTH + 1.2, materials.road);
  road.position.set(0, 0.02, -BLOCK_LENGTH / 2);
  block.add(road);

  const leftEdge = box(0.18, 0.14, BLOCK_LENGTH + 1.2, materials.roadEdge);
  leftEdge.position.set(-1.75, 0.08, -BLOCK_LENGTH / 2);
  block.add(leftEdge);

  const rightEdge = box(0.18, 0.14, BLOCK_LENGTH + 1.2, materials.roadEdge);
  rightEdge.position.set(1.75, 0.08, -BLOCK_LENGTH / 2);
  block.add(rightEdge);
}

function addRoadLines(block, materials) {
  for (let i = 0; i < 6; i += 1) {
    const line = box(0.14, 0.05, 1.15, materials.cream);
    line.position.set(0, 0.12, -2.4 - i * 4);
    block.add(line);
  }
}

function addModuleBuilding(block, module, materials) {
  const building = new THREE.Group();
  const side = module.key === "outcomes" || module.key === "register" ? 1 : -1;
  building.position.set(side * 5.1, 0, -10.6);
  building.rotation.y = side > 0 ? -0.34 : 0.34;

  if (module.key === "projects") {
    makeGallery(building, module, materials, 1.14);
  } else if (module.key === "outcomes") {
    makeExhibition(building, module, materials);
  } else if (module.key === "activities") {
    makeActivityPlaza(building, module, materials);
  } else {
    makeServiceCenter(building, module, materials);
  }

  block.add(building);
}

function makeGallery(group, module, materials, scale) {
  const podium = box(4.2, 0.42, 3.2, materials.stone);
  podium.position.y = 0.18;
  group.add(podium);

  const body = box(3.6 * scale, 1.8, 2.35, materials.cream);
  body.position.y = 1.23;
  group.add(body);

  const moduleRoof = box(4.05 * scale, 0.46, 2.72, toon(module.roof));
  moduleRoof.position.y = 2.34;
  moduleRoof.rotation.z = 0.03;
  group.add(moduleRoof);

  for (let i = 0; i < 3; i += 1) {
    const windowMesh = box(0.46, 0.52, 0.08, materials.glass);
    windowMesh.position.set(-0.92 + i * 0.92, 1.32, -1.22);
    group.add(windowMesh);
  }
}

function makeExhibition(group, module, materials) {
  makeGallery(group, module, materials, 1);
  for (let i = 0; i < 4; i += 1) {
    const frame = box(0.52, 0.42, 0.1, i % 2 ? materials.yellow : materials.blue);
    frame.position.set(-1.25 + i * 0.82, 1.42, -1.31);
    group.add(frame);
  }
  const banner = box(3.2, 0.28, 0.08, toon(module.color));
  banner.position.set(0, 2.02, -1.34);
  group.add(banner);
}

function makeActivityPlaza(group, module, materials) {
  const plaza = cylinder(2.6, 2.9, 0.24, materials.stone, 18);
  plaza.position.y = 0.12;
  plaza.scale.z = 0.72;
  group.add(plaza);

  const pavilion = new THREE.Group();
  const deck = box(2.9, 0.2, 2.1, materials.pathLight);
  deck.position.y = 0.32;
  pavilion.add(deck);

  [-1.05, 1.05].forEach((x) => {
    [-0.65, 0.65].forEach((z) => {
      const post = cylinder(0.07, 0.1, 1.35, materials.trunk, 7);
      post.position.set(x, 0.95, z);
      pavilion.add(post);
    });
  });

  const roof = box(3.35, 0.36, 2.5, toon(module.roof));
  roof.position.y = 1.78;
  roof.rotation.z = -0.04;
  pavilion.add(roof);
  pavilion.position.z = -0.1;
  group.add(pavilion);

  for (let i = 0; i < 5; i += 1) {
    const seat = box(0.48, 0.2, 0.26, materials.wood);
    seat.position.set(-1.7 + i * 0.85, 0.3, 1.55);
    group.add(seat);
  }
}

function makeServiceCenter(group, module, materials) {
  const base = box(4.0, 0.4, 3.1, materials.stone);
  base.position.y = 0.18;
  group.add(base);

  const body = box(3.35, 1.65, 2.28, materials.cream);
  body.position.y = 1.1;
  group.add(body);

  const serviceRoof = box(3.85, 0.42, 2.65, toon(module.roof));
  serviceRoof.position.y = 2.12;
  group.add(serviceRoof);

  const door = box(0.58, 0.86, 0.08, materials.green);
  door.position.set(0, 0.76, -1.19);
  group.add(door);

  const flag = makeFlag(toon(module.color), materials);
  flag.position.set(1.82, 1.35, -0.7);
  group.add(flag);
}

function addModuleDecorations(block, module, blockIndex, materials) {
  const side = module.key === "outcomes" || module.key === "register" ? 1 : -1;
  const sign = new THREE.Group();
  const board = box(2.2, 0.78, 0.12, materials.sign);
  board.position.y = 1.28;
  sign.add(board);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 0.56), makeLabelMaterial(module.label, module.color));
  label.position.set(0, 1.29, -0.07);
  label.rotation.y = Math.PI;
  sign.add(label);
  const pole = cylinder(0.06, 0.08, 1.2, materials.trunk, 7);
  pole.position.y = 0.58;
  sign.add(pole);
  sign.position.set(side * 2.75, 0, -6.1);
  sign.rotation.y = side > 0 ? -0.18 : 0.18;
  block.add(sign);

  const flag = makeFlag(toon(module.color), materials);
  flag.position.set(-side * 2.75, 0, -13.5);
  block.add(flag);

  if (blockIndex % 2 === 0) {
    const bench = box(1.55, 0.22, 0.42, materials.wood);
    bench.position.set(-side * 4.15, 0.28, -4.25);
    bench.rotation.y = side * 0.16;
    block.add(bench);
  }
}

function addTrees(block, blockIndex, materials) {
  const treePositions = [
    [-8.8, -3.4, 1.04],
    [8.5, -4.4, 0.82],
    [-7.9, -14.8, 0.9],
    [8.2, -16.4, 1.08],
    [-9.1, -21.2, 0.76],
    [7.4, -22.0, 0.94]
  ];
  treePositions.forEach(([x, z, scale], index) => {
    const tree = makeTree(materials, scale, blockIndex + index);
    tree.position.set(x, 0, z);
    tree.userData.swaySeed = blockIndex * 0.73 + index;
    block.add(tree);
  });
}

function addWater(block, blockIndex, materials) {
  if (blockIndex % 2 === 0) {
    const stream = box(3.6, 0.06, 11.5, materials.water);
    stream.position.set(7.15, 0.04, -10.8);
    stream.rotation.y = -0.1;
    stream.userData.water = true;
    block.add(stream);

    for (let i = 0; i < 5; i += 1) {
      const ripple = makeRipple();
      ripple.position.set(6.3 + Math.sin(i) * 0.7, 0.1, -5.8 - i * 2.2);
      ripple.userData.speed = 0.55 + i * 0.08;
      block.add(ripple);
    }
  } else {
    const pond = cylinder(1.55, 1.85, 0.08, materials.water, 18);
    pond.position.set(-7.1, 0.08, -17.4);
    pond.scale.z = 0.68;
    pond.userData.water = true;
    block.add(pond);
    for (let i = 0; i < 4; i += 1) {
      const ripple = makeRipple();
      ripple.position.set(-7.4 + i * 0.36, 0.14, -17.6 + Math.sin(i) * 0.5);
      ripple.userData.speed = 0.52 + i * 0.1;
      block.add(ripple);
    }
  }
}

function addBlockLabel(block, module) {
  const label = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.78), makeLabelMaterial(module.building, module.color));
  label.position.set(0, 0.07, -11.7);
  label.rotation.x = -Math.PI / 2;
  block.add(label);
}

function animateBlocks(blocks, t, distance) {
  blocks.forEach((block) => {
    const relativeStart = block.userData.index * BLOCK_LENGTH - distance;
    block.traverse((child) => {
      if (child.userData.swaySeed !== undefined) {
        child.rotation.z = Math.sin(t * 1.35 + child.userData.swaySeed) * 0.025;
      }
      if (child.userData.flag) {
        child.scale.x = 1 + Math.sin(t * 4 + child.userData.flagSeed) * 0.08;
        child.position.y = child.userData.baseY + Math.sin(t * 3 + child.userData.flagSeed) * 0.035;
      }
      if (child.userData.water) {
        child.position.y = 0.05 + Math.sin(t * 1.8 + child.position.x) * 0.015;
      }
      if (child.userData.ripple) {
        const pulse = 1 + ((t * child.userData.speed + child.userData.seed) % 1.4);
        child.scale.setScalar(pulse);
        child.material.opacity = Math.max(0.08, 0.46 - (pulse - 1) * 0.28);
      }
    });
    block.visible = relativeStart > -BLOCK_LENGTH * 0.84 && relativeStart < BLOCK_LENGTH * 1.3;
  });
}

function updateUi(root, currentBlock, state, force = false) {
  if (!force && currentBlock === state.lastUiBlock) return;
  state.lastUiBlock = currentBlock;

  const currentModule = modules[currentBlock % modules.length];
  const nextModule = modules[(currentBlock + 1) % modules.length];
  const entry = root.querySelector("[data-runner-entry]");
  const setText = (selector, value) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  entry?.classList.add("is-changing");
  window.setTimeout(() => {
    setText("[data-runner-current]", currentModule.label);
    setText("[data-runner-next]", nextModule.label);
    setText("[data-runner-kicker]", currentModule.building);
    setText("[data-runner-title]", currentModule.label);
    setText("[data-runner-desc]", currentModule.desc);
    const link = root.querySelector("[data-runner-link]");
    if (link) {
      link.href = currentModule.href;
      link.textContent = currentModule.action;
    }
    entry?.classList.remove("is-changing");
  }, force ? 0 : 130);
}

function updateCamera(camera, distance) {
  const currentBlock = Math.floor(distance / BLOCK_LENGTH);
  const localProgress = (distance % BLOCK_LENGTH) / BLOCK_LENGTH;
  const z = -distance + 8.5;
  const x = Math.sin((currentBlock + localProgress) * Math.PI * 0.72) * 0.68;
  camera.position.set(x, 6.8, z);
  camera.lookAt(x * 0.22, 1.08, z - 20);
}

function updateRunner(runner, t, distance) {
  const z = -distance - 1.8;
  runner.position.set(Math.sin(t * 1.1) * 0.05, 0.42 + Math.sin(t * 8) * 0.035, z);
  runner.rotation.y = Math.sin(t * 1.2) * 0.08;
}

function makeRunner(materials) {
  const runner = new THREE.Group();
  const body = box(0.42, 0.62, 0.28, materials.red);
  body.position.y = 0.38;
  runner.add(body);
  const head = cylinder(0.17, 0.17, 0.2, toon(0xf2c6a5), 12);
  head.position.y = 0.86;
  runner.add(head);
  const pack = box(0.2, 0.38, 0.18, materials.blue);
  pack.position.set(0.28, 0.45, 0.02);
  runner.add(pack);
  return runner;
}

function makeTree(materials, scale, seed) {
  const tree = new THREE.Group();
  const trunk = cylinder(0.12 * scale, 0.17 * scale, 1.05 * scale, materials.trunk, 7);
  trunk.position.y = 0.5 * scale;
  tree.add(trunk);
  const crownA = cylinder(0.05, 0.88 * scale, 1.05 * scale, seed % 2 ? materials.leaf : materials.leafLight, 7);
  crownA.position.y = 1.18 * scale;
  tree.add(crownA);
  const crownB = cylinder(0.04, 0.62 * scale, 0.78 * scale, seed % 2 ? materials.leafLight : materials.leaf, 7);
  crownB.position.y = 1.66 * scale;
  tree.add(crownB);
  return tree;
}

function makeFlag(flagMaterial, materials) {
  const flag = new THREE.Group();
  const pole = cylinder(0.04, 0.055, 1.6, materials.trunk, 7);
  pole.position.y = 0.8;
  flag.add(pole);
  const cloth = box(0.72, 0.36, 0.05, flagMaterial);
  cloth.position.set(0.38, 1.35, 0);
  cloth.userData.flag = true;
  cloth.userData.baseY = cloth.position.y;
  cloth.userData.flagSeed = Math.random() * Math.PI * 2;
  flag.add(cloth);
  return flag;
}

function makeClouds(materials) {
  return [-8, 0, 8].map((x, index) => {
    const cloud = new THREE.Group();
    for (let i = 0; i < 5; i += 1) {
      const puff = cylinder(0.36 + i * 0.03, 0.36 + i * 0.03, 0.2, materials.cream, 12);
      puff.rotation.x = Math.PI / 2;
      puff.position.set(i * 0.34, Math.sin(i) * 0.07, 0);
      cloud.add(puff);
    }
    cloud.position.set(x, 8.8 + index * 0.35, -28 - index * 10);
    cloud.userData.speed = 0.14 + index * 0.05;
    return cloud;
  });
}

function animateClouds(clouds, t, distance) {
  clouds.forEach((cloud, index) => {
    cloud.position.x += 0.003 * (index + 1);
    cloud.position.z = -distance - 26 - index * 12 + Math.sin(t * 0.2 + index) * 0.8;
    cloud.position.y += Math.sin(t * 0.7 + index) * 0.001;
    if (cloud.position.x > 12) {
      cloud.position.x = -12;
    }
  });
}

function makeSkyHills(materials) {
  const hills = new THREE.Group();
  [-9, -2, 5, 12].forEach((x, index) => {
    const hill = cylinder(0.16, 4.0 + index * 0.4, 2.1 + index * 0.16, index % 2 ? materials.grassDark : materials.grassLight, 12);
    hill.position.set(x, -0.4, -45 - index * 1.2);
    hill.rotation.x = Math.PI;
    hill.scale.z = 0.34;
    hills.add(hill);
  });
  return hills;
}

function makeRipple() {
  const ripple = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 12),
    new THREE.MeshBasicMaterial({ color: 0xe5fff3, transparent: true, opacity: 0.46 })
  );
  ripple.rotation.x = -Math.PI / 2;
  ripple.userData.ripple = true;
  ripple.userData.seed = Math.random() * Math.PI * 2;
  return ripple;
}

function makeMaterials() {
  return {
    grass: toon(0x7fc679),
    grassDark: toon(0x4f9b68),
    grassLight: toon(0xa7d984),
    road: toon(0xdab67d),
    roadEdge: toon(0xb98556),
    pathLight: toon(0xf0d18c),
    stone: toon(0xd7d2bd),
    cream: toon(0xfff8dc),
    sign: toon(0xfff1bd),
    water: toon(0x61c7cf, 0.78),
    trunk: toon(0x6d4b35),
    wood: toon(0xb77c4c),
    leaf: toon(0x3f8f67),
    leafLight: toon(0x70c77e),
    red: toon(0xe96e5f),
    blue: toon(0x4c7ea6),
    yellow: toon(0xf1c85b),
    green: toon(0x2f7a68),
    glass: toon(0x9bdde3, 0.86)
  };
}

function makeLabelMaterial(text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#fff4c6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#18322f";
  ctx.fillRect(0, 0, canvas.width, 8);
  ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
  ctx.fillRect(0, 0, 8, canvas.height);
  ctx.fillRect(canvas.width - 8, 0, 8, canvas.height);
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.fillRect(22, 24, 22, 72);
  ctx.fillStyle = "#18322f";
  ctx.font = `${text.length > 5 ? "700 34px" : "800 42px"} Microsoft YaHei, Noto Sans SC, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 212, 61);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return new THREE.MeshBasicMaterial({ map: texture });
}

function toon(color, opacity = 1) {
  return new THREE.MeshToonMaterial({
    color,
    transparent: opacity < 1,
    opacity
  });
}

function box(width, height, depth, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  return mesh;
}

function cylinder(radiusTop, radiusBottom, height, material, segments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  return mesh;
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if (material.map) material.map.dispose();
      material.dispose();
    });
  });
}

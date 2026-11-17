(function initLedgerThreeScene() {
  const container = document.getElementById('threeCanvasContainer');
  const canvas = document.getElementById('ledgerCanvas');
  const hudCoords = document.getElementById('hudNodeCoords');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  function getFrustumSize() {
    return window.innerWidth < 640 ? 6.6 : 5.8;
  }

  let frustumSize = getFrustumSize();
  let aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    100
  );

  camera.position.set(8, 7.2, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const shellMat = new THREE.MeshBasicMaterial({
    color: 0xEFF3ED,
    transparent: true,
    opacity: 0.65
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x18221F,
    transparent: true,
    opacity: 0.6
  });

  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xC84B11
  });

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x18221F,
    transparent: true,
    opacity: 0.32
  });

  const baseGrid = new THREE.GridHelper(5.6, 8, 0x99AA98, 0xB8C6B6);
  baseGrid.position.y = -1.45;
  rootGroup.add(baseGrid);

  const nodeSpecs = [
    { pos: [-1.45, 0.65, -1.15], size: [0.95, 0.95, 0.95], core: true },
    { pos: [1.35, 0.85, -1.25], size: [0.85, 0.85, 0.85], core: false },
    { pos: [0.0, 0.15, 0.0], size: [1.25, 1.25, 1.25], core: true },
    { pos: [-1.35, -0.55, 1.25], size: [0.85, 0.85, 0.85], core: false },
    { pos: [1.45, -0.45, 1.15], size: [0.95, 0.95, 0.95], core: true }
  ];

  const nodeMeshes = [];
  nodeSpecs.forEach((spec) => {
    const group = new THREE.Group();
    group.position.set(...spec.pos);

    const boxGeo = new THREE.BoxGeometry(...spec.size);
    const shell = new THREE.Mesh(boxGeo, shellMat);
    group.add(shell);

    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const wireframe = new THREE.LineSegments(edgesGeo, edgeMat);
    group.add(wireframe);

    const coreSize = spec.core ? 0.34 : 0.22;
    const coreGeo = new THREE.BoxGeometry(coreSize, coreSize, coreSize);
    const core = new THREE.Mesh(
      coreGeo,
      spec.core ? coreMat : new THREE.MeshBasicMaterial({ color: 0x3E4D48 })
    );
    group.add(core);

    rootGroup.add(group);
    nodeMeshes.push({ group, baseY: spec.pos[1], offset: Math.random() * Math.PI * 2, isCore: spec.core });
  });

  const routeIndices = [0, 2, 1, 2, 4, 3, 0];
  const routePoints = routeIndices.map((idx) => new THREE.Vector3(...nodeSpecs[idx].pos));
  const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
  const routeLine = new THREE.Line(routeGeo, lineMat);
  rootGroup.add(routeLine);

  const packetGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  const packetMat = new THREE.MeshBasicMaterial({ color: 0xFF7A2F });
  const packetMesh = new THREE.Mesh(packetGeo, packetMat);
  rootGroup.add(packetMesh);

  window.syncKinetixThreeTheme = function syncKinetixThreeTheme(isDark) {
    if (isDark) {
      shellMat.color.setHex(0x1A2623);
      shellMat.opacity = 0.78;
      edgeMat.color.setHex(0xD3DDD2);
      edgeMat.opacity = 0.45;
      coreMat.color.setHex(0xE86327);
      lineMat.color.setHex(0x8FA398);
      lineMat.opacity = 0.4;
      baseGrid.material.color.setHex(0x2F443E);
    } else {
      shellMat.color.setHex(0xEFF3ED);
      shellMat.opacity = 0.65;
      edgeMat.color.setHex(0x18221F);
      edgeMat.opacity = 0.6;
      coreMat.color.setHex(0xC84B11);
      lineMat.color.setHex(0x18221F);
      lineMat.opacity = 0.32;
      baseGrid.material.color.setHex(0x99AA98);
    }
  };

  window.syncKinetixThreeTheme(document.documentElement.getAttribute('data-theme') === 'dark');

  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  container.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetRotY = nx * 0.38;
    targetRotX = ny * 0.24;
    if (hudCoords) {
      hudCoords.textContent = `VEC [${nx.toFixed(2)},${(-ny).toFixed(2)}]`;
    }
  });

  container.addEventListener('pointerleave', () => {
    targetRotX = 0;
    targetRotY = 0;
  });

  window.addEventListener('resize', () => {
    if (!container.clientWidth || !container.clientHeight) return;
    frustumSize = getFrustumSize();
    aspect = container.clientWidth / container.clientHeight;
    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    currentRotX += (targetRotX - currentRotX) * 0.06;
    currentRotY += (targetRotY - currentRotY) * 0.06;

    rootGroup.rotation.y = Math.sin(t * 0.25) * 0.14 + currentRotY;
    rootGroup.rotation.x = currentRotX;

    nodeMeshes.forEach((item) => {
      item.group.position.y = item.baseY + Math.sin(t * 1.4 + item.offset) * 0.055;
    });

    const totalSegments = routePoints.length - 1;
    const progress = (t * 0.42) % totalSegments;
    const segIdx = Math.floor(progress);
    const segT = progress - segIdx;
    const pStart = routePoints[segIdx];
    const pEnd = routePoints[segIdx + 1];

    packetMesh.position.lerpVectors(pStart, pEnd, segT);
    packetMesh.rotation.y = t * 2.4;
    packetMesh.rotation.x = t * 1.8;

    renderer.render(scene, camera);
  }
  animate();
})();
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import * as THREE from 'three';
import { createRibbonContours, createRibbonGeometry } from './createRibbonGeometry.js';
import { EXPERIENCE_SCENE_STATES, FORGE_STATES } from './forgeStates.js';

gsap.registerPlugin(CustomEase);

const CAMERA_EASE = CustomEase.create('forge-camera-ease', 'M0,0 C0.19,1 0.22,1 1,1');
const DEG = Math.PI / 180;
const RIG_KEYS = Object.freeze(Object.keys(FORGE_STATES['CAM-00']));

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function smoothstep(value) {
  const progress = clamp01(value);
  return progress * progress * (3 - 2 * progress);
}

function interpolateState(from, to, progress, target) {
  const eased = smoothstep(progress);
  RIG_KEYS.forEach((key) => {
    const start = from[key];
    const end = to[key];
    target[key] = typeof start !== 'number' || typeof end !== 'number'
      ? (eased < 0.5 ? start : end)
      : start + (end - start) * eased;
  });
  return target;
}

function seededValue(index) {
  const value = Math.sin(index * 91.173 + 17.731) * 43758.5453;
  return value - Math.floor(value);
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 30);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(239,177,116,.95)');
  gradient.addColorStop(0.5, 'rgba(111,124,255,.38)');
  gradient.addColorStop(1, 'rgba(111,124,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(32,42,113,.5)');
  gradient.addColorStop(0.42, 'rgba(15,20,58,.28)');
  gradient.addColorStop(1, 'rgba(2,3,8,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function createRibbons(qualityTier) {
  const group = new THREE.Group();
  const ribbons = [];
  const mobile = qualityTier === 'mobile';
  const count = mobile ? 3 : 5;
  const configs = [
    { radiusX: 2.68, radiusZ: 1.86, yOffset: 0.06, yWave: 0.72, halfWidth: 0.4, phase: 0.1, wave: 0.2, twist: 0.3, rotation: [0.08, 0.04, 0.14], push: [-0.14, 0.12, 0.04] },
    { radiusX: 2.34, radiusZ: 2.05, yOffset: 0.12, yWave: 1.08, halfWidth: 0.5, phase: 1.12, wave: 0.8, twist: 1.3, rotation: [0.72, 0.2, -0.2], push: [0.12, 0.18, -0.06] },
    { radiusX: 2.5, radiusZ: 1.78, yOffset: -0.08, yWave: 0.9, halfWidth: 0.34, phase: 2.45, wave: 1.6, twist: 0.72, rotation: [-0.55, -0.28, 0.36], push: [0.16, -0.08, 0.12] },
    { radiusX: 2.02, radiusZ: 2.26, yOffset: 0.2, yWave: 1.16, halfWidth: 0.46, phase: 3.34, wave: 2.3, twist: 1.8, rotation: [0.28, 0.65, 0.62], push: [-0.12, 0.16, 0.16] },
    { radiusX: 2.74, radiusZ: 1.6, yOffset: -0.18, yWave: 0.58, halfWidth: 0.3, phase: 4.5, wave: 0.4, twist: 2.4, rotation: [-0.24, 0.45, -0.52], push: [0.18, -0.1, -0.08] },
  ];

  for (let index = 0; index < count; index += 1) {
    const config = configs[index];
    const pivot = new THREE.Group();
    const geometry = createRibbonGeometry(config, {
      segments: mobile ? 64 : qualityTier === 'high' ? 96 : 80,
      rows: mobile ? 4 : 6,
    });
    const material = qualityTier === 'high'
      ? new THREE.MeshPhysicalMaterial({
        color: 0x4057ff,
        emissive: 0x101a66,
        emissiveIntensity: 0.94,
        metalness: 0.05,
        roughness: 0.28,
        transmission: 0.18,
        thickness: 0.18,
        opacity: 0.29,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      : new THREE.MeshStandardMaterial({
        color: 0x3e55ff,
        emissive: 0x131d6b,
        emissiveIntensity: 0.78,
        metalness: 0.08,
        roughness: 0.32,
        opacity: mobile ? 0.2 : 0.25,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2 + index;

    const contourGeometry = createRibbonContours(config, {
      segments: mobile ? 64 : 96,
      contours: mobile ? 6 : 9,
    });
    const contourMaterial = new THREE.LineBasicMaterial({
      color: index === 0 ? 0xa8b2ff : 0x8290ff,
      transparent: true,
      opacity: index === 0 ? 0.54 : 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const contours = new THREE.LineSegments(contourGeometry, contourMaterial);
    contours.renderOrder = 8 + index;

    pivot.add(mesh, contours);
    pivot.rotation.set(...config.rotation);
    pivot.userData.baseRotation = [...config.rotation];
    pivot.userData.push = config.push;
    pivot.userData.index = index;
    ribbons.push(pivot);
    group.add(pivot);
  }

  return { group, ribbons };
}

function createCore(qualityTier, glowTexture) {
  const group = new THREE.Group();
  const mobile = qualityTier === 'mobile';
  const count = mobile ? 24 : qualityTier === 'high' ? 54 : 42;
  const pillarGeometry = new THREE.CylinderGeometry(0.058, 0.078, 1, mobile ? 8 : 10, 1);
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x11162d,
    emissive: 0x101944,
    emissiveIntensity: 0.76,
    metalness: 0.9,
    roughness: 0.19,
  });
  const pillars = new THREE.InstancedMesh(pillarGeometry, pillarMaterial, count);
  const tipGeometry = new THREE.SphereGeometry(0.038, mobile ? 8 : 12, mobile ? 6 : 8);
  const tipMaterial = new THREE.MeshBasicMaterial({ color: 0xd8ddff });
  const tips = new THREE.InstancedMesh(tipGeometry, tipMaterial, count);
  const matrix = new THREE.Matrix4();
  const antennaPositions = [];
  const nodePositions = [];
  const activePositions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const radius = 1.15 * Math.sqrt((index + 0.6) / count);
    const angle = index * goldenAngle;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.84;
    const height = 0.54 + 2.05 * (1 - radius / 1.2) * (0.58 + seededValue(index) * 0.5);
    const y = -0.74 + height / 2;

    matrix.compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion(),
      new THREE.Vector3(1, height, 1),
    );
    pillars.setMatrixAt(index, matrix);
    matrix.makeTranslation(x, -0.74 + height + 0.025, z);
    tips.setMatrixAt(index, matrix);

    if (index % (mobile ? 4 : 3) === 0) {
      const top = -0.74 + height;
      const extension = 0.24 + seededValue(index + 90) * 0.76;
      antennaPositions.push(x, top, z, x, top + extension, z);
      nodePositions.push(x, top + extension, z);
      if (activePositions.length < 15) activePositions.push(x, top + extension, z);
    }
  }

  pillars.instanceMatrix.needsUpdate = true;
  tips.instanceMatrix.needsUpdate = true;
  group.add(pillars, tips);

  const antennaGeometry = new THREE.BufferGeometry();
  antennaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(antennaPositions, 3));
  const antennaMaterial = new THREE.LineBasicMaterial({
    color: 0xb8c0ff,
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.LineSegments(antennaGeometry, antennaMaterial));

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0xaab5ff,
    map: glowTexture,
    size: mobile ? 0.24 : 0.2,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(nodeGeometry, nodeMaterial));

  const activeGeometry = new THREE.BufferGeometry();
  activeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(activePositions, 3));
  const activeMaterial = new THREE.PointsMaterial({
    color: 0xffc18a,
    map: glowTexture,
    size: mobile ? 0.34 : 0.31,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const activeNodes = new THREE.Points(activeGeometry, activeMaterial);
  group.add(activeNodes);

  const centerGeometry = new THREE.IcosahedronGeometry(0.42, mobile ? 0 : 1);
  const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0x151d5a,
    emissive: 0x2939a8,
    emissiveIntensity: 0.72,
    metalness: 0.7,
    roughness: 0.22,
    wireframe: true,
  });
  const center = new THREE.Mesh(centerGeometry, centerMaterial);
  center.position.y = -0.08;
  group.add(center);

  for (let index = 0; index < (mobile ? 2 : 3); index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.42 + index * 0.18, 0.009 + index * 0.002, 6, mobile ? 64 : 96),
      new THREE.MeshBasicMaterial({
        color: index === 0 ? 0xefb174 : 0x7181ff,
        transparent: true,
        opacity: 0.42 - index * 0.08,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.set(0.7 + index * 0.52, index * 0.64, 0.12 - index * 0.24);
    group.add(ring);
  }

  return { group, activeMaterial };
}

function createConductors(qualityTier) {
  const group = new THREE.Group();
  const mobile = qualityTier === 'mobile';
  const paths = [
    { color: 0xd98a4a, opacity: 1, points: [[0, -0.05, 0], [0.55, -0.2, 0.2], [1.3, -0.62, 0.28], [2.42, -0.86, 0.12]] },
    { color: 0x6f7cff, opacity: 0.34, points: [[0, -0.05, 0], [-0.2, 0.35, -0.1], [-1.18, 0.62, -0.3], [-2.28, 0.44, -0.08]] },
    { color: 0x947aff, opacity: 0.34, points: [[0, -0.05, 0], [0.08, 0.46, 0.28], [0.62, 1.12, 0.18], [1.18, 1.72, -0.2]] },
  ];
  const conductors = paths.map((path, index) => {
    const curve = new THREE.CatmullRomCurve3(path.points.map((point) => new THREE.Vector3(...point)));
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: path.color,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, mobile ? 40 : 64, index === 0 ? 0.018 : 0.012, 5, false),
      tubeMaterial,
    );
    const points = curve.getPoints(mobile ? 48 : 96);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lineGeometry.setDrawRange(0, 2);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: path.color,
      transparent: true,
      opacity: path.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(tube, line);
    return { line, tubeMaterial, total: points.length, strength: path.opacity };
  });

  return { group, conductors };
}

export function createSignalForgeScene({
  host,
  qualityTier = 'high',
  direction = 'ltr',
  initialState = 'CAM-00',
  onContextLost,
  onFirstFrame,
  onParked,
}) {
  const mobile = qualityTier === 'mobile';
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: qualityTier === 'high',
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setClearColor(0x03050a, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : qualityTier === 'high' ? 1.5 : 1.25));
  renderer.domElement.className = 'forge-webgl-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.tabIndex = -1;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03050a, 0.046);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.up.set(0, 1, 0);

  const framingRoot = new THREE.Group();
  const pointerRoot = new THREE.Group();
  const forgeRoot = new THREE.Group();
  pointerRoot.add(forgeRoot);
  framingRoot.add(pointerRoot);
  scene.add(framingRoot);

  const glowTexture = createGlowTexture();
  const { group: ribbonGroup, ribbons } = createRibbons(qualityTier);
  const { group: coreGroup, activeMaterial } = createCore(qualityTier, glowTexture);
  const { group: conductorGroup, conductors } = createConductors(qualityTier);
  forgeRoot.add(ribbonGroup, coreGroup, conductorGroup);

  const shadowTexture = createShadowTexture();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 5.2),
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.08;
  shadow.position.z = 0.2;
  forgeRoot.add(shadow);

  scene.add(new THREE.HemisphereLight(0x192352, 0x020308, 0.95));
  const keyLight = new THREE.DirectionalLight(0x9ba8ff, 2.45);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x5368ff, 3.2, 13);
  rimLight.position.set(-3, 1.2, -3);
  scene.add(rimLight);
  const copperLight = new THREE.PointLight(0xff9a54, 2.8, 10);
  copperLight.position.set(2.4, -0.8, 2.4);
  scene.add(copperLight);

  const conductorMaterials = new Set();
  conductors.forEach((conductor) => {
    conductorMaterials.add(conductor.line.material);
    conductorMaterials.add(conductor.tubeMaterial);
  });
  const fadingMaterials = new Map();
  forgeRoot.traverse((object) => {
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.filter(Boolean).forEach((material) => {
      material.transparent = true;
      if (
        material !== shadow.material
        && material !== activeMaterial
        && !conductorMaterials.has(material)
        && !fadingMaterials.has(material)
      ) {
        fadingMaterials.set(material, material.opacity);
      }
    });
  });

  let currentDirection = direction;
  let currentState = initialState;
  let stateTween = null;
  let disposed = false;
  let contextLost = false;
  let transitionGeneration = 0;
  let firstFrameSent = false;
  let forcedLossTimer = 0;
  let renderFrameId = 0;
  let diagnosticsTimer = 0;
  let diagnosticsDirty = false;
  let diagnosticSceneKey = initialState;
  let diagnosticSceneProgress = 0;
  const hostDatasetCache = Object.create(null);
  const rig = { ...FORGE_STATES[initialState] };
  const pointerRig = { rotationX: 0, rotationY: 0, positionX: 0, positionY: 0 };
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cameraTarget = new THREE.Vector3();
  const applyPointerAndRender = () => {
    pointerRoot.rotation.set(pointerRig.rotationX, pointerRig.rotationY, 0);
    pointerRoot.position.set(pointerRig.positionX, pointerRig.positionY, 0);
    render();
  };
  const pointerQuick = {
    rotationY: gsap.quickTo(pointerRig, 'rotationY', {
      duration: 0.72,
      ease: 'power3.out',
      onUpdate: applyPointerAndRender,
    }),
    rotationX: gsap.quickTo(pointerRig, 'rotationX', { duration: 0.72, ease: 'power3.out' }),
    positionX: gsap.quickTo(pointerRig, 'positionX', { duration: 0.72, ease: 'power3.out' }),
    positionY: gsap.quickTo(pointerRig, 'positionY', { duration: 0.72, ease: 'power3.out' }),
  };
  const pointerTweens = Object.values(pointerQuick).map((quickTo) => quickTo.tween);

  const writeHostDataset = (property, value) => {
    const formatted = String(value);
    if (hostDatasetCache[property] === formatted) return;
    hostDatasetCache[property] = formatted;
    host.dataset[property] = formatted;
  };

  const flushDiagnostics = () => {
    diagnosticsDirty = false;
    writeHostDataset('drawCalls', renderer.info.render.calls);
    writeHostDataset('triangles', renderer.info.render.triangles);
    writeHostDataset('cameraFov', camera.fov.toFixed(0));
    writeHostDataset('cameraRoll', camera.rotation.z.toFixed(3));
    writeHostDataset('cameraYaw', Number(rig.yaw).toFixed(4));
    writeHostDataset('cameraDolly', Number(rig.dolly).toFixed(4));
    writeHostDataset('forgeScale', Number(rig.forgeScale).toFixed(4));
    writeHostDataset('activeScene', diagnosticSceneKey);
    writeHostDataset('sceneProgress', clamp01(diagnosticSceneProgress).toFixed(4));
  };

  const scheduleDiagnostics = ({ immediate = false } = {}) => {
    diagnosticsDirty = true;
    if (immediate) {
      window.clearTimeout(diagnosticsTimer);
      diagnosticsTimer = 0;
      flushDiagnostics();
      return;
    }
    if (diagnosticsTimer) return;
    diagnosticsTimer = window.setTimeout(() => {
      diagnosticsTimer = 0;
      if (!disposed && !contextLost && diagnosticsDirty) flushDiagnostics();
    }, 96);
  };

  function destinationFor(stateName) {
    const destination = { ...FORGE_STATES[stateName] };
    if (mobile) {
      const fixed = FORGE_STATES['CAM-00'];
      Object.assign(destination, {
        targetX: fixed.targetX,
        targetY: fixed.targetY,
        targetZ: fixed.targetZ,
        yaw: fixed.yaw,
        pitch: fixed.pitch,
        dolly: fixed.dolly,
        anchorX: 0,
        anchorY: 0.14,
        forgeYaw: stateName === 'CAM-00' ? 0.08 : stateName === 'CAM-01' ? 0.28 : -0.2,
      });
      if (stateName === 'CAM-03') destination.opacity = 0;
    }
    return destination;
  }

  function experienceStateForViewport(state) {
    if (!mobile) return state;

    const portrait = FORGE_STATES['CAM-00'];
    return {
      ...state,
      targetX: portrait.targetX,
      targetY: portrait.targetY,
      targetZ: portrait.targetZ,
      yaw: portrait.yaw + (state.yaw - portrait.yaw) * 0.18,
      pitch: portrait.pitch + (state.pitch - portrait.pitch) * 0.16,
      dolly: Math.min(1.24, Math.max(0.9, state.dolly)),
      anchorX: 0,
      anchorY: 0.14,
      forgeScale: Math.min(1.18, Math.max(0.7, state.forgeScale)),
      forgeZ: Math.min(-0.42, Math.max(-1.35, state.forgeZ)),
      opacity: Math.min(0.78, state.opacity),
    };
  }

  function resize() {
    if (disposed || contextLost) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    render();
  }

  function updateSceneGraph() {
    const yaw = rig.yaw * DEG;
    const pitch = rig.pitch * DEG;
    const distance = 9 * rig.dolly;
    cameraTarget.set(rig.targetX, rig.targetY, rig.targetZ);
    camera.position.set(
      cameraTarget.x + Math.sin(yaw) * Math.cos(pitch) * distance,
      cameraTarget.y - Math.sin(pitch) * distance,
      cameraTarget.z + Math.cos(yaw) * Math.cos(pitch) * distance,
    );
    camera.lookAt(cameraTarget);
    camera.rotation.z = 0;
    camera.fov = 34;
    camera.updateProjectionMatrix();
    const directionSign = currentDirection === 'rtl' ? -1 : 1;
    camera.projectionMatrix.elements[8] = -rig.anchorX * directionSign;
    camera.projectionMatrix.elements[9] = -rig.anchorY;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

    forgeRoot.scale.setScalar(rig.forgeScale);
    forgeRoot.rotation.y = rig.forgeYaw;
    forgeRoot.rotation.x = rig.forgePitch || 0;
    forgeRoot.rotation.z = rig.forgeRoll || 0;
    forgeRoot.position.z = rig.forgeZ || 0;
    forgeRoot.visible = rig.opacity > 0.005;

    ribbons.forEach((pivot) => {
      const { baseRotation, push, index } = pivot.userData;
      const variance = 0.72 + index * 0.1;
      pivot.position.set(
        push[0] * rig.ribbonOpen * variance,
        push[1] * rig.ribbonOpen * variance,
        push[2] * rig.ribbonOpen * variance,
      );
      pivot.rotation.set(
        baseRotation[0] + rig.ribbonOpen * (index % 2 ? 0.075 : -0.055),
        baseRotation[1] + rig.ribbonOpen * (index % 2 ? -0.06 : 0.07),
        baseRotation[2] + rig.ribbonOpen * (index % 2 ? 0.048 : -0.064),
      );
    });

    activeMaterial.opacity = 0.92 * rig.activeNodes * rig.opacity;
    conductors.forEach((conductor, index) => {
      const reveal = Math.max(0.02, Math.min(1, rig.conductorReveal));
      conductor.line.geometry.setDrawRange(0, Math.max(2, Math.floor(conductor.total * reveal)));
      const topologyStrength = index === 0 ? 1 : 0.36;
      conductor.line.material.opacity = conductor.strength * topologyStrength * rig.opacity;
      conductor.tubeMaterial.opacity = (index === 0 ? 0.18 : 0.06) * reveal * rig.opacity;
    });
    fadingMaterials.forEach((baseOpacity, material) => {
      material.opacity = baseOpacity * rig.opacity;
    });
    shadow.material.opacity = 0.72 * rig.opacity;
    rimLight.intensity = 3.2 * (rig.blueLight ?? 1);
    copperLight.intensity = 2.8 * (rig.copperLight ?? 1);
    renderer.toneMappingExposure = rig.exposure ?? 1.08;
    scene.fog.density = rig.fogDensity ?? 0.046;
  }

  function renderNow() {
    if (disposed || contextLost || document.hidden) return;
    updateSceneGraph();
    renderer.render(scene, camera);
    scheduleDiagnostics({ immediate: !firstFrameSent });
    if (!firstFrameSent) {
      firstFrameSent = true;
      onFirstFrame?.();
    }
  }

  function render() {
    if (disposed || contextLost || document.hidden || renderFrameId) return;
    renderFrameId = window.requestAnimationFrame(() => {
      renderFrameId = 0;
      renderNow();
    });
  }

  function setState(stateName, { immediate = false } = {}) {
    if (disposed || contextLost || !FORGE_STATES[stateName]) return;
    currentState = stateName;
    const generation = ++transitionGeneration;
    writeHostDataset('transitionGeneration', generation);
    writeHostDataset('activeRafCount', immediate ? '0' : '1');
    stateTween?.kill();
    const destination = destinationFor(stateName);
    const complete = () => {
      if (disposed || contextLost || generation !== transitionGeneration) return;
      writeHostDataset('activeRafCount', '0');
      render();
      if (stateName === 'CAM-03') onParked?.();
    };

    if (immediate) {
      Object.assign(rig, destination);
      render();
      complete();
      return;
    }

    stateTween = gsap.to(rig, {
      ...destination,
      duration: stateName === 'CAM-03' ? 0.9 : 0.72,
      ease: CAMERA_EASE,
      overwrite: true,
      onUpdate: render,
      onComplete: complete,
    });
  }

  function setDirection(nextDirection) {
    currentDirection = nextDirection;
    render();
  }

  function setProgress({ activeId, activePhase, progress = 0, sceneProgress } = {}) {
    if (disposed || contextLost) return;
    const sceneKey = activeId || activePhase || 'hero';
    const states = EXPERIENCE_SCENE_STATES[sceneKey]
      || EXPERIENCE_SCENE_STATES[activePhase]
      || EXPERIENCE_SCENE_STATES.hero;
    const localProgress = Number.isFinite(sceneProgress) ? sceneProgress : progress;
    stateTween?.kill();
    transitionGeneration += 1;
    currentState = sceneKey;
    interpolateState(
      experienceStateForViewport(states[0]),
      experienceStateForViewport(states[1]),
      localProgress,
      rig,
    );
    diagnosticSceneKey = sceneKey;
    diagnosticSceneProgress = localProgress;
    writeHostDataset('activeRafCount', '0');
    render();
  }

  function handlePointerMove(event) {
    if (mobile || disposed || contextLost || !finePointer.matches) return;
    const x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
    const y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    pointerQuick.rotationY(x * 2.4 * DEG);
    pointerQuick.rotationX(-y * 1.4 * DEG);
    pointerQuick.positionX(x * 0.12);
    pointerQuick.positionY(-y * 0.08);
  }

  function handleVisibility() {
    if (document.hidden) {
      stateTween?.pause();
      pointerTweens.forEach((tween) => tween.pause());
      writeHostDataset('activeRafCount', '0');
    } else {
      stateTween?.resume();
      pointerTweens.forEach((tween) => tween.resume());
      render();
    }
  }

  function handleContextLost(event) {
    event.preventDefault();
    contextLost = true;
    if (renderFrameId) window.cancelAnimationFrame(renderFrameId);
    renderFrameId = 0;
    window.clearTimeout(diagnosticsTimer);
    diagnosticsTimer = 0;
    stateTween?.kill();
    pointerTweens.forEach((tween) => tween.kill());
    writeHostDataset('activeRafCount', '0');
    onContextLost?.();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('visibilitychange', handleVisibility);
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
  resize();
  setState(initialState, { immediate: true });
  if (new URLSearchParams(window.location.search).get('scene') === 'context-lost') {
    forcedLossTimer = window.setTimeout(() => {
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext();
    }, 120);
  }

  return {
    get currentState() {
      return currentState;
    },
    render,
    setDirection,
    setProgress,
    setState,
    dispose() {
      if (disposed) return;
      disposed = true;
      transitionGeneration += 1;
      writeHostDataset('activeRafCount', '0');
      stateTween?.kill();
      pointerTweens.forEach((tween) => tween.kill());
      window.clearTimeout(forcedLossTimer);
      window.clearTimeout(diagnosticsTimer);
      diagnosticsTimer = 0;
      if (renderFrameId) window.cancelAnimationFrame(renderFrameId);
      renderFrameId = 0;
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      const geometries = new Set();
      const materials = new Set();
      const textures = new Set([glowTexture, shadowTexture]);
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.filter(Boolean).forEach((material) => {
          materials.add(material);
          Object.values(material).forEach((value) => {
            if (value?.isTexture) textures.add(value);
          });
        });
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

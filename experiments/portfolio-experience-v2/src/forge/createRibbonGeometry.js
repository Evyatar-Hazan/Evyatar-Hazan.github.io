import * as THREE from 'three';

const TAU = Math.PI * 2;

function ribbonPoint(config, u, v, target = new THREE.Vector3()) {
  const theta = u * TAU + config.phase;
  const widthPulse = 0.82 + 0.18 * Math.sin(theta * 3 + config.phase);
  const center = new THREE.Vector3(
    config.radiusX * Math.cos(theta),
    config.yOffset + config.yWave * Math.sin(theta * 2 + config.wave),
    config.radiusZ * Math.sin(theta),
  );
  const side = new THREE.Vector3(
    0.42 * Math.cos(theta + config.twist),
    1,
    0.42 * Math.sin(theta + config.twist),
  ).normalize();

  return target.copy(center).addScaledVector(side, v * config.halfWidth * widthPulse);
}

export function createRibbonGeometry(config, { segments = 96, rows = 6 } = {}) {
  const positions = [];
  const indices = [];

  for (let x = 0; x <= segments; x += 1) {
    const u = x / segments;
    for (let y = 0; y <= rows; y += 1) {
      const v = (y / rows) * 2 - 1;
      const point = ribbonPoint(config, u, v);
      positions.push(point.x, point.y, point.z);
    }
  }

  for (let x = 0; x < segments; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      const a = x * (rows + 1) + y;
      const b = a + rows + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function createRibbonContours(config, { segments = 96, contours = 9 } = {}) {
  const positions = [];

  for (let row = 0; row < contours; row += 1) {
    const v = -1 + (row / (contours - 1)) * 2;
    for (let x = 0; x < segments; x += 1) {
      const start = ribbonPoint(config, x / segments, v);
      const end = ribbonPoint(config, (x + 1) / segments, v);
      positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

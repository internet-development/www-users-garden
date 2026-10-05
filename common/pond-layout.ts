export const POND_PROJECTION = 0.52;
export const POND_ELEVATION = Math.sqrt(1 - POND_PROJECTION * POND_PROJECTION);
export const POND_SHEAR = 0.2;
export const POND_BANK = 0.755;
export const POND_BANK_SLOPE = 0.10;
export const POND_PATCH_COUNT = 6;

export type LilyPart = {
  kind: 'pad' | 'flower';
  x: number;
  z: number;
  radiusX: number;
  radiusZ: number;
  yaw: number;
  lift: number;
  shape: number;
  tint: number;
  openness?: number;
};

export const LILY_PATCHES = [
  [0.16, 0.14, 0.43, -0.32],
  [0.82, 0.18, 0.38, 0.55],
  [0.12, 0.63, 0.25, -0.55],
  [0.85, 0.65, 0.30, 0.4],
  [0.30, 0.44, 0.26, -0.8],
  [0.70, 0.43, 0.25, 0.85],
];

export const LILY_PARTS: LilyPart[][] = [
  [
    { kind: 'pad', x: -0.15, z: -0.06, radiusX: 0.40, radiusZ: 0.34, yaw: -0.6, lift: 0.003, shape: 0.15, tint: 0xd8e6b8 },
    { kind: 'pad', x: 0.24, z: 0.04, radiusX: 0.30, radiusZ: 0.27, yaw: 2.1, lift: 0.006, shape: 0.9, tint: 0xbdd9ba },
    { kind: 'pad', x: -0.05, z: 0.29, radiusX: 0.27, radiusZ: 0.25, yaw: 0.3, lift: 0.009, shape: 0.45, tint: 0xb5cfde },
    { kind: 'pad', x: -0.36, z: 0.29, radiusX: 0.16, radiusZ: 0.13, yaw: 1.4, lift: 0.004, shape: 0.8, tint: 0xcdac9c },
    { kind: 'flower', x: -0.06, z: -0.01, radiusX: 0.29, radiusZ: 0.29, yaw: 0.2, lift: 0.02, shape: 0, tint: 0xfffbdb },
    { kind: 'flower', x: 0.25, z: 0.13, radiusX: 0.16, radiusZ: 0.16, yaw: 1.3, lift: 0.025, shape: 1, tint: 0xffd5e4, openness: 0.6 },
  ],
  [
    { kind: 'pad', x: -0.17, z: 0.06, radiusX: 0.34, radiusZ: 0.29, yaw: 0.8, lift: 0.003, shape: 1, tint: 0xdedda6 },
    { kind: 'pad', x: 0.24, z: 0.19, radiusX: 0.30, radiusZ: 0.26, yaw: -1.1, lift: 0.006, shape: 0.1, tint: 0xaed1bc },
    { kind: 'pad', x: 0.04, z: -0.24, radiusX: 0.22, radiusZ: 0.17, yaw: 2.8, lift: 0.009, shape: 0.65, tint: 0xbaceda },
    { kind: 'flower', x: -0.12, z: 0.08, radiusX: 0.28, radiusZ: 0.28, yaw: -0.7, lift: 0.02, shape: 0.12, tint: 0xffdfb1 },
  ],
  [
    { kind: 'pad', x: -0.14, z: 0.01, radiusX: 0.35, radiusZ: 0.31, yaw: 1.7, lift: 0.003, shape: 0.4, tint: 0xc6d7b5 },
    { kind: 'pad', x: 0.24, z: 0.15, radiusX: 0.27, radiusZ: 0.24, yaw: -0.3, lift: 0.006, shape: 1, tint: 0xaac7d9 },
    { kind: 'pad', x: -0.03, z: -0.28, radiusX: 0.19, radiusZ: 0.15, yaw: 2.4, lift: 0.009, shape: 0.2, tint: 0xbfdca7 },
    { kind: 'flower', x: -0.06, z: 0.02, radiusX: 0.28, radiusZ: 0.28, yaw: 0.4, lift: 0.02, shape: 0.95, tint: 0xffd4e3 },
    { kind: 'flower', x: 0.25, z: 0.19, radiusX: 0.12, radiusZ: 0.12, yaw: 1.8, lift: 0.022, shape: 0.3, tint: 0xfff0be },
  ],
  [
    { kind: 'pad', x: -0.18, z: -0.12, radiusX: 0.36, radiusZ: 0.31, yaw: -1.0, lift: 0.003, shape: 0.2, tint: 0xc1d2bb },
    { kind: 'pad', x: 0.23, z: -0.02, radiusX: 0.32, radiusZ: 0.29, yaw: 1.2, lift: 0.006, shape: 0.75, tint: 0xdedda7 },
    { kind: 'pad', x: -0.04, z: 0.27, radiusX: 0.23, radiusZ: 0.21, yaw: -2.4, lift: 0.009, shape: 1, tint: 0xb0cddd },
    { kind: 'pad', x: 0.35, z: 0.27, radiusX: 0.15, radiusZ: 0.13, yaw: 0.2, lift: 0.005, shape: 0.5, tint: 0xc9b19e },
    { kind: 'flower', x: 0.03, z: -0.05, radiusX: 0.31, radiusZ: 0.31, yaw: -0.4, lift: 0.025, shape: 0.07, tint: 0xeae5ff },
    { kind: 'flower', x: -0.22, z: 0.25, radiusX: 0.14, radiusZ: 0.14, yaw: 1.8, lift: 0.021, shape: 1, tint: 0xffc7dd, openness: 0.48 },
  ],
  [
    { kind: 'pad', x: -0.13, z: -0.04, radiusX: 0.35, radiusZ: 0.30, yaw: 2.0, lift: 0.004, shape: 0.75, tint: 0xb7cfa7 },
    { kind: 'pad', x: 0.27, z: 0.17, radiusX: 0.22, radiusZ: 0.18, yaw: -0.4, lift: 0.009, shape: 0.2, tint: 0xadbcd4 },
    { kind: 'flower', x: -0.08, z: 0.01, radiusX: 0.29, radiusZ: 0.29, yaw: 0.7, lift: 0.023, shape: 0.42, tint: 0xffe8d5 },
  ],
  [
    { kind: 'pad', x: -0.14, z: -0.04, radiusX: 0.34, radiusZ: 0.27, yaw: 1.1, lift: 0.005, shape: 0.8, tint: 0xc3dbaa },
    { kind: 'pad', x: 0.24, z: 0.19, radiusX: 0.21, radiusZ: 0.17, yaw: -1.3, lift: 0.009, shape: 0.15, tint: 0xc4a4a0 },
  ],
];

export const POND_PAD_COUNT = LILY_PARTS.reduce((count, parts) => count + parts.filter((part) => part.kind === 'pad').length, 0);
export const POND_FLOWER_COUNT = LILY_PARTS.reduce((count, parts) => count + parts.filter((part) => part.kind === 'flower').length, 0);

export function pondBankHeight(x: number) {
  return POND_BANK + (x - 0.5) * POND_BANK_SLOPE + Math.sin(x * 5.4 + 0.7) * 0.01;
}

export function updatePondLayout(time: number, patches: Float32Array, pads: Float32Array, flowers: Float32Array) {
  let padIndex = 0, flowerIndex = 0;
  for (let index = 0; index < POND_PATCH_COUNT; index++) {
    const base = LILY_PATCHES[index];
    const phase = index * 1.37;
    const x = base[0] + Math.sin(time * 0.043 + phase) * 0.004;
    const y = base[1] + Math.cos(time * 0.037 + phase) * 0.003;
    const yaw = base[3] + Math.sin(time * 0.041 + phase) * 0.04;
    patches[index * 4] = x;
    patches[index * 4 + 1] = y;
    patches[index * 4 + 2] = base[2];
    patches[index * 4 + 3] = yaw;
    const c = Math.cos(yaw), s = Math.sin(yaw);
    for (const part of LILY_PARTS[index]) {
      const target = part.kind === 'pad' ? pads : flowers;
      const offset = (part.kind === 'pad' ? padIndex++ : flowerIndex++) * 4;
      target[offset] = x + (c * part.x + s * part.z + (-s * part.x + c * part.z) * POND_SHEAR) * base[2];
      target[offset + 1] = y + (-s * part.x + c * part.z) * base[2] * POND_PROJECTION;
      const angle = yaw + part.yaw;
      const pc = Math.cos(angle), ps = Math.sin(angle);
      target[offset + 2] = Math.hypot((pc - ps * POND_SHEAR) * part.radiusX, (ps + pc * POND_SHEAR) * part.radiusZ) * base[2] * 1.28;
      target[offset + 3] = Math.hypot(ps * part.radiusX, pc * part.radiusZ) * base[2] * POND_PROJECTION * 1.28 + part.lift * base[2] * POND_ELEVATION;
    }
  }
}

export function ellipseClearance(x: number, y: number, rx: number, ry: number) {
  const radial = Math.hypot(x / rx, y / ry);
  const gradient = Math.hypot(x / (rx * rx), y / (ry * ry));
  return gradient > 0.000001 ? radial * (radial - 1) / gradient : -Math.min(rx, ry);
}

export function padClearance(x: number, y: number, pads: Float32Array) {
  let nearest = Infinity;
  for (let index = 0; index < pads.length; index += 4) {
    const rx = pads[index + 2], ry = pads[index + 3];
    nearest = Math.min(nearest, ellipseClearance(x - pads[index], y - pads[index + 1], rx, ry));
  }
  return nearest;
}

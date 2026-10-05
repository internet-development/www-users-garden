import { POND_PROJECTION, POND_SHEAR, POND_BANK, POND_BANK_SLOPE, pondBankHeight } from '@common/pond-layout';

export const WATER_RESOLUTION = 256;
export const WATER_EXTENT = 1.8;
export const WATER_ORIGIN = [-0.8, -1.05] as const;
export const WATER_HEIGHT_SCALE = 0.28;

export function pondToScreen(x: number, z: number): [number, number] {
  return [0.5 + x + z * POND_SHEAR, 0.5 + z * POND_PROJECTION];
}

export function screenToPond(x: number, y: number): [number, number] {
  const z = (y - 0.5) / POND_PROJECTION;
  return [x - 0.5 - z * POND_SHEAR, z];
}

export function screenToWater(x: number, y: number): [number, number] {
  const point = screenToPond(x, y);
  return [(point[0] - WATER_ORIGIN[0]) / WATER_EXTENT, (point[1] - WATER_ORIGIN[1]) / WATER_EXTENT];
}

export function isPondWater(x: number, y: number) {
  return x >= 0 && x <= 1 && y >= 0 && y <= pondBankHeight(x);
}

export const POND_PROJECTION_GLSL = `
vec2 pondToScreen(vec2 point) {
  return vec2(0.5 + point.x + point.y * ${POND_SHEAR}, 0.5 + point.y * ${POND_PROJECTION});
}
vec2 screenToPond(vec2 point) {
  float z = (point.y - 0.5) / ${POND_PROJECTION};
  return vec2(point.x - 0.5 - z * ${POND_SHEAR}, z);
}
vec2 pondToWater(vec2 point) {
  return (point - vec2(${WATER_ORIGIN[0]}, ${WATER_ORIGIN[1]})) / ${WATER_EXTENT};
}
vec2 screenToWater(vec2 point) { return pondToWater(screenToPond(point)); }
float bankHeight(float x) {
  return ${POND_BANK} + (x - 0.5) * ${POND_BANK_SLOPE} + sin(x * 5.4 + 0.7) * 0.01;
}
bool isPondWater(vec2 point) {
  return point.x >= 0.0 && point.x <= 1.0 && point.y >= 0.0 && point.y <= bankHeight(point.x);
}
`;

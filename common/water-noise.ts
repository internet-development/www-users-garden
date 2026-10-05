// NOTE(angel) Copyright (c) 2024-2026 Internet Development Studio Company. MIT; retain LICENSE.md when reusing.
export const HASH_GLSL = `
float pondCellRandom(vec3 cell) {
  highp uvec3 coordinates = uvec3(ivec3(cell));
  highp uint state = 0x4752444eu;
  for (int axis = 0; axis < 3; axis++) {
    state += coordinates[axis];
    state = (state << 11u) | (state >> 21u);
    state *= 0x6e624eb7u;
    state ^= state >> 15u;
  }
  return float(state >> 8u) * (1.0 / 16777216.0);
}
`;

export const VALUE_NOISE_GLSL = `
float valueNoise(vec3 p) {
  vec3 cell = floor(p);
  vec3 frac = fract(p);
  vec3 weight = frac * frac * (3.0 - 2.0 * frac);
  float c000 = pondCellRandom(cell + vec3(0.0, 0.0, 0.0));
  float c100 = pondCellRandom(cell + vec3(1.0, 0.0, 0.0));
  float c010 = pondCellRandom(cell + vec3(0.0, 1.0, 0.0));
  float c110 = pondCellRandom(cell + vec3(1.0, 1.0, 0.0));
  float c001 = pondCellRandom(cell + vec3(0.0, 0.0, 1.0));
  float c101 = pondCellRandom(cell + vec3(1.0, 0.0, 1.0));
  float c011 = pondCellRandom(cell + vec3(0.0, 1.0, 1.0));
  float c111 = pondCellRandom(cell + vec3(1.0, 1.0, 1.0));
  float x00 = mix(c000, c100, weight.x);
  float x10 = mix(c010, c110, weight.x);
  float x01 = mix(c001, c101, weight.x);
  float x11 = mix(c011, c111, weight.x);
  float y0 = mix(x00, x10, weight.y);
  float y1 = mix(x01, x11, weight.y);
  return mix(y0, y1, weight.z);
}
`;

export const FBM_GLSL = `
float fbm3(vec3 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 4; octave++) {
    total += valueNoise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}
`;

export const NOISE_LIBRARY_GLSL = `${HASH_GLSL}${VALUE_NOISE_GLSL}${FBM_GLSL}`;

export const HASH_GLSL = `
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
`;

export const VALUE_NOISE_GLSL = `
float valueNoise(vec3 p) {
  vec3 cell = floor(p);
  vec3 frac = fract(p);
  vec3 weight = frac * frac * (3.0 - 2.0 * frac);
  float c000 = hash13(cell + vec3(0.0, 0.0, 0.0));
  float c100 = hash13(cell + vec3(1.0, 0.0, 0.0));
  float c010 = hash13(cell + vec3(0.0, 1.0, 0.0));
  float c110 = hash13(cell + vec3(1.0, 1.0, 0.0));
  float c001 = hash13(cell + vec3(0.0, 0.0, 1.0));
  float c101 = hash13(cell + vec3(1.0, 0.0, 1.0));
  float c011 = hash13(cell + vec3(0.0, 1.0, 1.0));
  float c111 = hash13(cell + vec3(1.0, 1.0, 1.0));
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

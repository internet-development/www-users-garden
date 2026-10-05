import { LILY_PARTS, LILY_PATCHES, POND_PROJECTION, POND_ELEVATION, POND_SHEAR } from '@common/pond-layout';

function color(hex: number) {
  return [hex >> 16, (hex >> 8) & 255, hex & 255].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
}

function mix(a: number[], b: number[], t: number) {
  return a.map((value, index) => value + (b[index] - value) * t);
}

export function createLilyGeometry() {
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let patch = 0; patch < LILY_PATCHES.length; patch++) {
    for (let part = 0; part < LILY_PARTS[patch].length; part++) {
      const recipe = LILY_PARTS[patch][part];
      const shape = recipe.shape;
      const tintColor = color(recipe.tint);
      const cosine = Math.cos(recipe.yaw), sine = Math.sin(recipe.yaw);
      const add = (x: number, y: number, z: number, u: number, v: number, pigment: number[], kind: number) => {
        const id = vertices.length / 13;
        const scale = kind === 0 ? 1 : recipe.openness ?? 1;
        pigment = pigment.map((value, index) => value * tintColor[index]);
        vertices.push(recipe.x + (cosine * x * recipe.radiusX + sine * z * recipe.radiusZ) * scale, recipe.lift + y * recipe.radiusX, recipe.z + (-sine * x * recipe.radiusX + cosine * z * recipe.radiusZ) * scale, 0, 0, 0, u, v, pigment[0], pigment[1], pigment[2], kind, patch);
        return id;
      };

      if (recipe.kind === 'pad') {
        const tint = [1, 1, 1];
        const center = add(0, 0.003, 0, 0.5, 0.5, tint, 0);
        for (let ring = 1; ring <= 6; ring++) {
          const radial = ring / 6;
          for (let segment = 0; segment <= 64; segment++) {
            const notch = 0.14 + shape * 0.13;
            const angle = Math.PI * 0.5 + notch + segment / 64 * (Math.PI * 2 - notch * 2);
            const radius = radial * (1 + Math.sin(angle * 3 + 0.7) * 0.038 + Math.sin(angle * 7) * 0.018 + Math.sin(angle * 13 + 0.4) * 0.006);
            const outline = 1 + shape * (-0.06 + Math.cos(angle * 2) * 0.055 + Math.sin(angle * 5 + 0.8) * 0.025);
            const x = Math.cos(angle) * radius * outline;
            const z = Math.sin(angle) * radius * (1 - shape * 0.14) * outline;
            const y = 0.003 + 0.004 * radial ** 3 + Math.sin(angle * 3) * radial * radial * 0.0015;
            const id = add(x, y, z, x * 0.48 + 0.5, 0.5 - z * 0.48, tint.map((value, channel) => value * (channel < 2 ? 0.91 + radial * 0.09 : 1)), 0);
            if (segment < 64) {
              if (ring === 1) indices.push(center, id + 1, id);
              else indices.push(id - 65, id - 64, id, id - 64, id + 1, id);
            }
          }
        }
        continue;
      }

      const ivory = [0xfff8e7, 0xf2eafa, 0xffe8ed, 0xf8f7ef].map(color);
      const roses = [0xf4b4d4, 0xeaa0cc, 0xf8c5de, 0xe9b8db].map(color);
      const roseBase = color(0xb9578a), roseTip = color(0xffe5ef);
      const open = [[15, 0.75, 0.87, 0.31, 0.11, 0.025], [12, 0.60, 0.69, 0.48, 0.09, 0.05], [10, 0.40, 0.43, 0.43, 0.07, 0.085]];
      const cupped = [[15, 0.79, 0.76, 0.34, 0.10, 0.025], [12, 0.65, 0.47, 0.68, 0.085, 0.06], [10, 0.43, 0.26, 0.76, 0.055, 0.10]];
      for (let ring = 0; ring < 3; ring++) {
        const profile = mix(open[ring], cupped[ring], shape);
        for (let petal = 0; petal < profile[0]; petal++) {
          const angle = petal / profile[0] * Math.PI * 2 + ring * 0.31 + Math.sin(petal * 4.1) * 0.043;
          const variation = 1 + Math.sin(petal * 2.3 + ring) * 0.085;
          const offset = (Math.sin(petal * 5.7 + ring) + 1) * 0.11;
          const start = vertices.length / 13;
          for (let row = 0; row <= 14; row++) {
            const t = row / 14;
            const width = Math.sin(Math.PI * t) ** (0.58 - shape * 0.15) * (0.84 + 0.16 * t);
            for (let column = 0; column <= 8; column++) {
              const s = column / 8 * 2 - 1;
              const x = (s * width * 0.5 + Math.sin(Math.PI * t) * t * 0.035) * profile[1] * variation;
              const y = (0.55 * t ** (2 - shape * 0.45) + 0.11 * s * s * Math.sin(Math.PI * t)) * profile[3] / 0.55 * variation + profile[5];
              const z = t * profile[2] * variation + profile[4];
              const tintIndex = (petal + ring * 2) % ivory.length;
              const pink = mix(mix(roseBase, roses[tintIndex], Math.min(1, t * 2.5)), roseTip, Math.max(0, t - 0.45) * (0.8 + Math.abs(s) * 0.4));
              const tint = mix(ivory[tintIndex], pink, shape);
              const blush = (1 - t) ** 2 * 0.12 + s * s * 0.025;
              tint[1] *= 1 - blush;
              tint[2] *= 1 - blush * 0.3;
              add(Math.cos(angle) * x + Math.sin(angle) * z, y, -Math.sin(angle) * x + Math.cos(angle) * z, offset + column / 8 * 0.78, t, tint, 1);
              if (row < 14 && column < 8) {
                const a = start + row * 9 + column;
                indices.push(a, a + 9, a + 1, a + 9, a + 10, a + 1);
              }
            }
          }
        }
      }

      const heartStart = vertices.length / 13;
      for (let row = 0; row <= 12; row++) {
        const latitude = row / 12 * Math.PI;
        for (let column = 0; column <= 24; column++) {
          const angle = column / 24 * Math.PI * 2;
          add(Math.sin(latitude) * Math.cos(angle) * 0.205, 0.22 - shape * 0.115 + Math.cos(latitude) * (0.115 + shape * 0.115), Math.sin(latitude) * Math.sin(angle) * 0.205, 0.5, 0.5, color(0xffe8a1), 2);
          if (row < 12 && column < 24) {
            const a = heartStart + row * 25 + column;
            indices.push(a, a + 1, a + 25, a + 1, a + 26, a + 25);
          }
        }
      }
      for (let stamen = 0; stamen < 34; stamen++) {
        const angle = stamen * 2.39996323;
        const radius = Math.sqrt((stamen + 0.5) / 34) * 0.205;
        const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
        const height = 0.2 + Math.sin(stamen * 1.7) * 0.025;
        const pigment = mix(color(0xd4a545), color(0xffe8a1), (Math.sin(stamen * 2.1) + 1) * 0.5);
        const tip = add(x + Math.cos(angle) * 0.025, 0.31 + height * 0.5, z + Math.sin(angle) * 0.025, 0.5, 0.5, pigment, 2);
        for (let side = 0; side <= 6; side++) {
          const theta = side / 6 * Math.PI * 2;
          const base = add(x + Math.cos(theta) * 0.019, 0.31 - height * 0.5, z + Math.sin(theta) * 0.019, 0.5, 0.5, pigment, 2);
          if (side < 6) indices.push(tip, base, base + 1);
        }
      }
    }
  }

  for (let index = 0; index < indices.length; index += 3) {
    const a = indices[index] * 13, b = indices[index + 1] * 13, c = indices[index + 2] * 13;
    const ux = vertices[b] - vertices[a], uy = vertices[b + 1] - vertices[a + 1], uz = vertices[b + 2] - vertices[a + 2];
    const vx = vertices[c] - vertices[a], vy = vertices[c + 1] - vertices[a + 1], vz = vertices[c + 2] - vertices[a + 2];
    const normal = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
    for (const start of [a, b, c]) for (let axis = 0; axis < 3; axis++) vertices[start + 3 + axis] += normal[axis];
  }
  for (let index = 0; index < vertices.length; index += 13) {
    const length = Math.hypot(vertices[index + 3], vertices[index + 4], vertices[index + 5]);
    if (length < 1e-10) { vertices[index + 4] = 1; continue; }
    for (let axis = 0; axis < 3; axis++) vertices[index + 3 + axis] /= length;
  }
  return { vertices: new Float32Array(vertices), indices: new Uint32Array(indices) };
}

export const lilyVertexSource = `#version 300 es
precision highp float;
layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 pigmentUv;
layout(location = 3) in vec3 pigmentColor;
layout(location = 4) in float kind;
layout(location = 5) in float patchIndex;
uniform sampler2D water;
uniform vec4 uPatches[6];
out vec2 vUv;
out vec3 vColor;
out vec3 vNormal;
flat out int vKind;
void main() {
  vec4 cluster = uPatches[int(patchIndex)];
  float c = cos(cluster.w), s = sin(cluster.w);
  vec2 offset = vec2(c * position.x + s * position.z, -s * position.x + c * position.z) * cluster.z;
  vec2 point = cluster.xy + vec2(offset.x + offset.y * ${POND_SHEAR}, offset.y * ${POND_PROJECTION});
  vec2 fieldUv = point;
  float height = texture(water, fieldUv).r;
  float dx = texture(water, fieldUv + vec2(0.005, 0.0)).r - height;
  float dz = texture(water, fieldUv + vec2(0.0, 0.005)).r - height;
  float elevation = position.y * cluster.z + height * 0.06;
  point.y += elevation * ${POND_ELEVATION};
  vUv = pigmentUv;
  vColor = pigmentColor;
  vNormal = normalize(vec3(c * normal.x + s * normal.z - dx * 14.0, normal.y, -s * normal.x + c * normal.z - dz * 14.0));
  vKind = int(kind);
  gl_Position = vec4(point * 2.0 - 1.0, 0.3 + cluster.y * 0.12 + offset.y * ${POND_ELEVATION} - elevation * ${POND_PROJECTION}, 1.0);
}`;

export const lilyFragmentSource = `#version 300 es
precision highp float;
uniform sampler2D uLeaf;
uniform sampler2D uPetal;
in vec2 vUv;
in vec3 vColor;
in vec3 vNormal;
flat in int vKind;
out vec4 result;
void main() {
  vec3 normal = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 pigment = vColor;
  if (vKind == 0) pigment *= texture(uLeaf, vUv).rgb * vec3(0.88, 0.9, 0.74);
  if (vKind == 1) pigment *= texture(uPetal, vUv).rgb;
  float brushValue = dot(pigment, vec3(0.2126, 0.7152, 0.0722));
  float light = dot(normal, normalize(vec3(-0.5, 0.62, 0.42))) * 0.5 + 0.5 + (brushValue - 0.65) * 0.12;
  float paintedLight = 0.35 + 0.32 * smoothstep(0.35, 0.6, light) + 0.33 * smoothstep(0.7, 0.92, light);
  vec3 shadow = vKind == 0 ? vec3(0.23, 0.337, 0.429) : vec3(0.445, 0.381, 0.591);
  vec3 shade = mix(vec3(1.0), shadow, (1.0 - paintedLight) * (vKind == 0 ? 0.3 : 0.5));
  vec3 warm = vKind == 0 ? vec3(0.753, 0.799, 0.503) : vec3(1.0, 0.888, 0.665);
  vec3 painted = mix(pigment * shade, pigment * 0.88 + warm * 0.12, paintedLight * 0.24);
  painted = mix(painted * 12.92, 1.055 * pow(max(painted, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), painted));
  result = vec4(painted, 1.0);
}`;

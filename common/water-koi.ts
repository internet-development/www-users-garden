import { padClearance, POND_PROJECTION, POND_SHEAR } from '@common/pond-layout';
import type { PondLife } from '@common/pond-life';

export const KOI_COUNT = 4;

const BODY_SAMPLES = [-0.72, 0, 0.64];

type Koi = { x: number; y: number; angle: number; size: number; targetX: number; targetY: number; remaining: number };

export class KoiSchool {
  readonly fish: Koi[];
  private seed = 97241;

  constructor(pads: Float32Array) {
    this.fish = [[0.47, 0.30, 1.3, 0.14], [0.47, 0.51, -0.25, 0.123], [0.69, 0.56, 2.7, 0.13], [0.50, 0.79, -1.4, 0.12]].map(([x, y, angle, size]) => ({ x, y, angle, size, targetX: 0.5, targetY: 0.5, remaining: 0 }));
    for (const fish of this.fish) this.constrain(fish, pads);
  }

  private random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  private chooseTarget(fish: Koi, life: PondLife, pads: Float32Array) {
    let score = -Infinity;
    for (let index = 0; index < 24; index++) {
      const x = 0.13 + this.random() * 0.74;
      const y = 0.13 + this.random() * 0.74;
      const distance = Math.hypot(x - fish.x, y - fish.y);
      if (padClearance(x, y, pads) < fish.size * 0.8 || distance < 0.12) continue;
      const value = life.sample(x, y) * 2 + this.random() * 0.25 - Math.abs(distance - 0.3) * 0.7;
      if (value > score) { score = value; fish.targetX = x; fish.targetY = y; }
    }
    fish.remaining = 7 + this.random() * 7;
  }

  private fits(x: number, y: number, angle: number, size: number, pads: Float32Array) {
    const margin = size * 1.4 + 0.006;
    if (x < margin || y < margin || x > 1 - margin || y > 1 - margin) return false;
    for (const along of BODY_SAMPLES) {
      if (padClearance(x + Math.cos(angle) * size * along, y + Math.sin(angle) * size * along, pads) < size * 0.34 + 0.002) return false;
    }
    return true;
  }

  private constrain(fish: Koi, pads: Float32Array) {
    const margin = fish.size * 1.4 + 0.006;
    const radius = fish.size * 0.34;
    for (let pass = 0; pass < 5; pass++) {
      let moved = false;
      for (let index = 0; index < pads.length; index += 4) {
        const limit = Math.max(pads[index + 2], pads[index + 3]) + radius;
        for (const along of BODY_SAMPLES) {
          const x = fish.x + Math.cos(fish.angle) * fish.size * along;
          const y = fish.y + Math.sin(fish.angle) * fish.size * along;
          const dx = x - pads[index], dy = y - pads[index + 1];
          const distance = Math.hypot(dx, dy);
          if (distance < limit) {
            moved = true;
            const direction = distance > 0.000001 ? 1 / distance : 0;
            fish.x += (direction ? dx * direction : 1) * (limit - distance + 0.00001);
            fish.y += (direction ? dy * direction : 0) * (limit - distance + 0.00001);
          }
        }
      }
      fish.x = Math.max(margin, Math.min(1 - margin, fish.x));
      fish.y = Math.max(margin, Math.min(1 - margin, fish.y));
      if (!moved) break;
    }
  }

  update(dt: number, life: PondLife, pads: Float32Array, poses: Float32Array) {
    for (let index = 0; index < this.fish.length; index++) {
      const fish = this.fish[index];
      if (dt > 0) {
        fish.remaining -= dt;
        if (fish.remaining <= 0 || Math.hypot(fish.targetX - fish.x, fish.targetY - fish.y) < 0.055) this.chooseTarget(fish, life, pads);
        let fx = fish.targetX - fish.x, fy = fish.targetY - fish.y;
        const targetDistance = Math.max(0.001, Math.hypot(fx, fy));
        fx /= targetDistance; fy /= targetDistance;
        fx += (life.sample(fish.x + 0.04, fish.y) - life.sample(fish.x - 0.04, fish.y)) * 1.4;
        fy += (life.sample(fish.x, fish.y + 0.04) - life.sample(fish.x, fish.y - 0.04)) * 1.4;
        const hx = Math.cos(fish.angle), hy = Math.sin(fish.angle);
        const lookX = fish.x + hx * (fish.size * 1.1 + 0.018);
        const lookY = fish.y + hy * (fish.size * 1.1 + 0.018);
        for (let pad = 0; pad < pads.length; pad += 4) {
          const dx = lookX - pads[pad], dy = lookY - pads[pad + 1];
          const distance = Math.max(0.0001, Math.hypot(dx, dy));
          const limit = Math.max(pads[pad + 2], pads[pad + 3]) + fish.size * 0.34 + 0.055;
          if (distance >= limit) continue;
          const nx = dx / distance, ny = dy / distance;
          const weight = (1 - distance / limit) ** 2 * 14;
          const side = hx * -ny + hy * nx >= 0 ? 1 : -1;
          fx += (nx * 1.9 - ny * side) * weight;
          fy += (ny * 1.9 + nx * side) * weight;
        }
        for (const neighbor of this.fish) {
          if (neighbor === fish) continue;
          const dx = fish.x - neighbor.x, dy = fish.y - neighbor.y;
          const distance = Math.max(0.001, Math.hypot(dx, dy));
          const separation = (fish.size + neighbor.size) * 0.8;
          if (distance < separation) { fx += dx / distance * (1 - distance / separation) * 2; fy += dy / distance * (1 - distance / separation) * 2; }
        }
        const wall = 0.14;
        fx += Math.max(0, wall - fish.x) * 35 - Math.max(0, fish.x - 1 + wall) * 35;
        fy += Math.max(0, wall - fish.y) * 35 - Math.max(0, fish.y - 1 + wall) * 35;
        const angle = Math.atan2(fy, fx);
        const turn = Math.atan2(Math.sin(angle - fish.angle), Math.cos(angle - fish.angle));
        const desiredTurn = Math.max(-1.25 * dt, Math.min(1.25 * dt, turn));
        const speed = (0.018 + index * 0.0015 + life.sample(fish.x, fish.y) * 0.008) * (1 - Math.min(0.35, Math.abs(turn) * 0.12));
        let moved = false;
        for (const direction of [1, 0, -0.6]) {
          for (const rotation of [desiredTurn, 0, 1.25 * dt, -1.25 * dt]) {
            const heading = fish.angle + rotation;
            const x = fish.x + Math.cos(heading) * speed * dt * direction;
            const y = fish.y + Math.sin(heading) * speed * dt * direction;
            if (!this.fits(x, y, heading, fish.size, pads)) continue;
            fish.x = x; fish.y = y; fish.angle = heading;
            moved = true;
            if (direction <= 0) fish.remaining = Math.min(fish.remaining, 0.4);
            break;
          }
          if (moved) break;
        }
        if (!moved) {
          this.constrain(fish, pads);
          fish.remaining = 0;
        }
      }
      poses[index * 4] = fish.x;
      poses[index * 4 + 1] = fish.y;
      poses[index * 4 + 2] = fish.size;
      poses[index * 4 + 3] = fish.angle;
    }
  }
}

export const KOI_GLSL = `
float koiCross(vec2 a, vec2 b) {
  return a.x * b.y - a.y * b.x;
}

float koiTriangle(vec2 p, vec2 a, vec2 b, vec2 c, float softness) {
  float orientation = sign(koiCross(b - a, c - a));
  float ab = koiCross(b - a, p - a) * orientation / length(b - a);
  float bc = koiCross(c - b, p - b) * orientation / length(c - b);
  float ca = koiCross(a - c, p - c) * orientation / length(a - c);
  return smoothstep(-softness, softness, min(ab, min(bc, ca)));
}

vec3 paintedKoi(vec3 waterColor, vec2 screen, vec3 waterNormal, float fresnel) {
  for (int index = 0; index < ${KOI_COUNT}; index++) {
    vec4 pose = uKoi[index];
    vec2 offset = screen - pose.xy;
    if (dot(offset, offset) > pose.z * pose.z * 2.3) continue;
    float seed = float(index) * 3.71 + 0.8;
    vec2 refracted = offset + waterNormal.xz * (0.003 + float(index) * 0.0004);
    refracted = vec2(refracted.x - refracted.y * ${POND_SHEAR} / ${POND_PROJECTION}, refracted.y / ${POND_PROJECTION});
    float heading = atan(sin(pose.w) / ${POND_PROJECTION}, cos(pose.w) - sin(pose.w) * ${POND_SHEAR} / ${POND_PROJECTION});
    float cosine = cos(heading), sine = sin(heading);
    vec2 p = vec2(cosine * refracted.x + sine * refracted.y, -sine * refracted.x + cosine * refracted.y) / pose.z;
    float tailWeight = pow(clamp((0.7 - p.x) / 1.8, 0.0, 1.0), 2.0);
    float stroke = uFishTime * (2.1 + float(index) * 0.16) + seed;
    p.y -= sin(stroke + p.x * 3.7) * tailWeight * 0.17;
    if (uKoiReady) {
      float flutter = sin(stroke * 0.73 + p.x * 2.0) * 0.025;
      vec2 illustration = vec2((p.x + 1.30) / 2.25, 0.5 - (p.y + flutter * smoothstep(0.15, 0.43, abs(p.y))) / 0.88);
      if (illustration.x < 0.0 || illustration.x > 1.0 || illustration.y < 0.0 || illustration.y > 1.0) continue;
      vec2 atlasUv = vec2(illustration.x, 1.0 - (float(index) + illustration.y) / ${KOI_COUNT.toFixed(1)});
      vec4 paint = texture(uKoiPaint, atlasUv, -0.4);
      vec3 underwater = mix(paint.rgb * vec3(0.92, 0.98, 1.0), waterColor, 0.09 + float(index) * 0.01);
      waterColor = mix(waterColor, underwater, paint.a * 0.94 * (1.0 - fresnel * 0.55));
      continue;
    }
    float soft = clamp(max(fwidth(p.x), fwidth(p.y)) * 0.75, 0.012, 0.065);
    float t = clamp((p.x + 0.77) / 1.6, 0.0, 1.0);
    float width = pow(max(sin(t * 3.14159265), 0.0), 0.52) * (0.14 + t * 0.19);
    float body = (1.0 - smoothstep(width - soft, width + soft, abs(p.y))) * smoothstep(-0.79, -0.75, p.x) * (1.0 - smoothstep(0.81, 0.85, p.x));
    float finBeat = sin(stroke * 0.67) * 0.035;
    float fins = koiTriangle(p, vec2(0.24, 0.12), vec2(-0.02, 0.46 + finBeat), vec2(-0.36, 0.23), soft);
    fins = max(fins, koiTriangle(p, vec2(0.24, -0.12), vec2(-0.02, -0.46 - finBeat), vec2(-0.36, -0.23), soft));
    fins = max(fins, koiTriangle(p, vec2(-0.31, 0.10), vec2(-0.57, 0.28), vec2(-0.67, 0.08), soft));
    fins = max(fins, koiTriangle(p, vec2(-0.31, -0.10), vec2(-0.57, -0.28), vec2(-0.67, -0.08), soft));
    float tail = koiTriangle(p, vec2(-0.65, 0.025), vec2(-1.27, 0.31), vec2(-1.08, 0.015), soft);
    tail = max(tail, koiTriangle(p, vec2(-0.65, -0.025), vec2(-1.27, -0.31), vec2(-1.08, -0.015), soft));
    fins = max(fins, tail);
    if (max(body, fins) < 0.001) continue;

    float wash = valueNoise(vec3(p * vec2(4.7, 8.3), seed));
    float mark = smoothstep(0.42, 0.59, wash + sin(p.x * 10.4 + seed) * 0.13);
    vec3 ivory = linearColor(vec3(0.97, 0.93, 0.80));
    vec3 vermilion = linearColor(vec3(0.9, 0.29, 0.105));
    vec3 gold = linearColor(vec3(0.94, 0.67, 0.23));
    vec3 ink = linearColor(vec3(0.14, 0.18, 0.19));
    vec3 pigment = mix(ivory, vermilion, mark);
    if (index == 1) pigment = mix(gold, linearColor(vec3(0.80, 0.40, 0.10)), mark * 0.75);
    if (index == 2) pigment = mix(ivory, ink, smoothstep(0.50, 0.63, wash + sin(p.x * 13.0 + seed) * 0.12));
    if (index == 3) {
      pigment = mix(ivory, vermilion, mark);
      float darkMark = valueNoise(vec3(p * vec2(7.0, 11.0) + 3.7, seed + 8.0));
      pigment = mix(pigment, ink, smoothstep(0.67, 0.77, darkMark));
    }
    float roundness = sqrt(max(0.0, 1.0 - pow(p.y / max(width, 0.01), 2.0)));
    vec4 brush = texture(uPigment, p * vec2(0.27, 0.8) + vec2(seed * 0.31, seed * 0.17));
    pigment *= (0.72 + roundness * 0.28) * (0.90 + brush.a * 0.18);
    vec2 scales = p * vec2(15.0, 23.0);
    scales.x += mod(floor(scales.y), 2.0) * 0.5;
    float scaleEdge = smoothstep(0.40, 0.47, length(fract(scales) - 0.5));
    pigment *= 1.0 - scaleEdge * 0.075 * (1.0 - smoothstep(0.36, 0.55, p.x));
    float dorsal = exp(-pow(p.y / 0.05, 2.0)) * smoothstep(-0.60, -0.36, p.x) * (1.0 - smoothstep(0.04, 0.24, p.x));
    pigment = mix(pigment, pigment * 0.76 + ivory * 0.13, dorsal * 0.5);

    float eyeDistance = min(length(p - vec2(0.59, 0.135)), length(p - vec2(0.59, -0.135)));
    pigment = mix(pigment, linearColor(vec3(0.54, 0.39, 0.16)), (1.0 - smoothstep(0.028, 0.042, eyeDistance)) * 0.8);
    pigment = mix(pigment, ink * 0.28, 1.0 - smoothstep(0.012, 0.025, eyeDistance));
    float mouth = (1.0 - smoothstep(soft * 0.5, soft, abs(p.x - 0.785 - p.y * p.y * 1.2))) * (1.0 - smoothstep(0.035, 0.07, abs(p.y)));
    pigment = mix(pigment, vermilion * 0.35, mouth * 0.5);

    float rays = 0.5 + 0.5 * sin(atan(p.y, -p.x - 0.57) * 27.0);
    vec3 finColor = mix(index == 1 ? gold : ivory, pigment, 0.25) * (0.80 + rays * 0.16);
    vec3 fish = mix(finColor, pigment, body);
    vec3 submerged = mix(fish * vec3(0.78, 0.90, 0.94), waterColor, 0.25 + float(index) * 0.015);
    float visibility = max(body * 0.88, fins * 0.50) * (1.0 - fresnel * 0.65);
    waterColor = mix(waterColor, submerged, visibility);
  }
  return waterColor;
}
`;

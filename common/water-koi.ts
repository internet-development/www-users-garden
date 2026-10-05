import { PondCircuit } from '@common/pond-navigation';
import { pondToScreen } from '@common/pond-projection';
import { POND_PROJECTION, POND_ELEVATION } from '@common/pond-layout';
import type { PondLife } from '@common/pond-life';

export const KOI_COUNT = 4;
export const KOI_SPINE_POINTS = 9;
const SPINE = [-1.30, -1.0, -0.7, -0.4, -0.1, 0.2, 0.5, 0.75, 0.98];
const WIDTHS = [0.02, 0.10, 0.12, 0.18, 0.23, 0.23, 0.21, 0.14, 0.025];

type Koi = { x: number; y: number; angle: number; size: number; arc: number; stroke: number; bend: number; speed: number; laps: number };

export class KoiSchool {
  readonly fish: Koi[];
  readonly motion = new Float32Array(KOI_COUNT * 4);
  readonly spines = new Float32Array(KOI_COUNT * KOI_SPINE_POINTS * 4);
  readonly circuit: PondCircuit;
  readonly hulls: number[][][] = Array.from({ length: KOI_COUNT }, () => []);

  constructor(pads: Float32Array) {
    this.circuit = new PondCircuit(pads, 0.056);
    this.fish = [0.155, 0.14, 0.15, 0.135].map((size, index) => ({ x: 0, y: 0, angle: 0, size, arc: this.circuit.length * (0.09 + index * 0.25), stroke: index * 2.3, bend: 0, speed: 0.036, laps: 0 }));
    this.update(0, { sample: () => 0 }, pads, new Float32Array(KOI_COUNT * 4));
  }

  update(dt: number, life: Pick<PondLife, 'sample'>, _pads: Float32Array, poses: Float32Array) {
    const arcs = this.fish.map((fish) => fish.arc);
    for (let index = 0; index < this.fish.length; index++) {
      const fish = this.fish[index];
      if (dt > 0) {
        let pace = 0.035 + index * 0.001 + life.sample(fish.x, fish.y) * 0.011;
        for (let neighbor = 0; neighbor < arcs.length; neighbor++) {
          if (neighbor === index) continue;
          const ahead = ((arcs[neighbor] - arcs[index]) % this.circuit.length + this.circuit.length) % this.circuit.length;
          if (ahead < fish.size * 2.5) pace *= 0.75 + ahead / (fish.size * 2.5) * 0.25;
        }
        fish.speed += (Math.max(0.025, pace) - fish.speed) * Math.min(1, dt * 1.6);
        fish.arc += fish.speed * dt;
        fish.laps = Math.floor(fish.arc / this.circuit.length);
        fish.stroke += dt * (1.6 + fish.speed * 34);
      }
      const center = this.circuit.sample(fish.arc);
      const before = this.circuit.sample(fish.arc - 0.018), after = this.circuit.sample(fish.arc + 0.018);
      const heading = Math.atan2(after[1] - before[1], after[0] - before[0]);
      const screen = pondToScreen(center[0], center[1]);
      const forward = pondToScreen(center[0] + Math.cos(heading), center[1] + Math.sin(heading));
      const angle = Math.atan2(forward[1] - screen[1], forward[0] - screen[0]);
      if (dt > 0) {
        const turn = Math.atan2(Math.sin(angle - fish.angle), Math.cos(angle - fish.angle));
        fish.bend += (Math.max(-1, Math.min(1, turn / dt)) - fish.bend) * Math.min(1, dt * 3);
      }
      fish.x = screen[0]; fish.y = screen[1]; fish.angle = angle;
      this.hulls[index] = [];
      for (let sample = 0; sample < KOI_SPINE_POINTS; sample++) {
        const along = SPINE[sample];
        const arc = fish.arc + along * fish.size;
        const point = this.circuit.sample(arc);
        const a = this.circuit.sample(arc - 0.006), b = this.circuit.sample(arc + 0.006);
        const length = Math.max(0.00001, Math.hypot(b[0] - a[0], b[1] - a[1]));
        const tailWeight = Math.pow(Math.max(0, (0.7 - along) / 2.0), 2);
        const swing = Math.sin(fish.stroke + along * 3.7) * tailWeight * fish.size * 0.10;
        point[0] -= (b[1] - a[1]) / length * swing;
        point[1] += (b[0] - a[0]) / length * swing;
        const offset = (index * KOI_SPINE_POINTS + sample) * 4;
        this.spines[offset] = point[0]; this.spines[offset + 1] = point[1];
        this.spines[offset + 2] = along; this.spines[offset + 3] = WIDTHS[sample] * fish.size;
        this.hulls[index].push([point[0], point[1], WIDTHS[sample] * fish.size]);
      }
      poses.set([fish.x, fish.y, fish.size, fish.angle], index * 4);
      this.motion.set([fish.stroke, fish.bend, 0.010 + index * 0.004 + Math.sin(fish.stroke * 0.17 + index) * 0.003, fish.speed / 0.045], index * 4);
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
    vec4 motion = uKoiMotion[index];
    vec2 offset = screen - pose.xy;
    if (dot(offset, offset) > pose.z * pose.z * 3.0) continue;
    float seed = float(index) * 3.71 + 0.8;
    vec2 ground = screenToPond(screen) + waterNormal.xz * motion.z * 0.16;
    float nearest = 1000.0;
    vec2 p = vec2(0.0);
    vec2 direction = vec2(1.0, 0.0);
    for (int segment = 0; segment < ${KOI_SPINE_POINTS - 1}; segment++) {
      vec4 a = uKoiSpine[index * ${KOI_SPINE_POINTS} + segment];
      vec4 b = uKoiSpine[index * ${KOI_SPINE_POINTS} + segment + 1];
      vec2 tangent = b.xy - a.xy;
      float lengthSquared = max(dot(tangent, tangent), 0.000001);
      float t = clamp(dot(ground - a.xy, tangent) / lengthSquared, 0.0, 1.0);
      vec2 delta = ground - mix(a.xy, b.xy, t);
      float distance = dot(delta, delta);
      if (distance < nearest) {
        nearest = distance;
        direction = tangent / sqrt(lengthSquared);
        p = vec2(mix(a.z, b.z, t), koiCross(tangent, delta) / sqrt(lengthSquared) / pose.z);
      }
    }
    if (nearest > pose.z * pose.z * 0.25) continue;
    float stroke = motion.x;
    if (uKoiReady) {
      vec2 shadowOffset = vec2(-0.6, 0.4) * motion.z / pose.z;
      vec2 shadow = p + vec2(dot(direction, shadowOffset), koiCross(direction, shadowOffset));
      float silhouette = exp(-pow((shadow.x + 0.10) / 0.72, 4.0) - pow(shadow.y / 0.25, 2.0) * 1.9);
      waterColor *= 1.0 - silhouette * 0.23;
      float flutter = sin(stroke * 0.73 + p.x * 2.0) * 0.025;
      vec2 illustration = vec2((p.x + 1.30) / 2.25, 0.5 - (p.y + flutter * smoothstep(0.15, 0.43, abs(p.y))) / 0.88);
      if (illustration.x < 0.0 || illustration.x > 1.0 || illustration.y < 0.0 || illustration.y > 1.0) continue;
      float center = index == 0 ? 0.152 : index == 1 ? 0.392 : index == 2 ? 0.630 : 0.865;
      float atlasY = center + (illustration.y - 0.5) * 0.25;
      float top = index == 0 ? 0.0 : index == 1 ? 0.274 : index == 2 ? 0.512 : 0.751;
      float bottom = index == 0 ? 0.268 : index == 1 ? 0.508 : index == 2 ? 0.748 : 1.0;
      if (atlasY < top || atlasY > bottom) continue;
      vec2 atlasUv = vec2(illustration.x, 1.0 - atlasY);
      vec4 paint = texture(uKoiPaint, atlasUv, -0.4);
      float girth = mix(0.10, 0.23, smoothstep(-0.72, 0.15, p.x)) * (1.0 - smoothstep(0.53, 1.05, p.x) * 0.62);
      float side = clamp(p.y / max(girth, 0.035), -0.96, 0.96);
      float roundness = sqrt(1.0 - side * side);
      vec3 skinNormal = normalize(vec3(-direction.y * side, roundness, direction.x * side));
      float diffuse = max(dot(skinNormal, normalize(vec3(-0.5, 0.62, 0.42))), 0.0);
      vec3 halfway = normalize(normalize(vec3(-0.5, 0.62, 0.42)) + normalize(vec3(0.0, ${POND_PROJECTION}, -${POND_ELEVATION})));
      float gleam = pow(max(dot(skinNormal, halfway), 0.0), 38.0) * 0.055;
      float caustic = pow(0.5 + 0.5 * sin(p.x * 31.0 + p.y * 18.0 + sin(p.x * 12.0 - uFishTime * 0.8) * 2.0), 10.0);
      vec3 wetColor = paint.rgb * vec3(0.86, 0.97, 0.93) * (0.61 + diffuse * 0.45);
      wetColor += vec3(0.80, 0.88, 0.75) * gleam * smoothstep(-0.65, -0.2, p.x);
      wetColor += vec3(0.07, 0.09, 0.06) * caustic * paint.a;
      vec3 underwater = mix(wetColor, waterColor, 0.12 + motion.z * 2.0);
      float fin = smoothstep(girth * 0.85, girth * 1.55, abs(p.y));
      waterColor = mix(waterColor, underwater, paint.a * (0.97 - fin * 0.23) * (1.0 - fresnel * 0.42));
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

import { NOISE_LIBRARY_GLSL } from '@common/water-noise';
import { KOI_COUNT, KOI_SPINE_POINTS, KOI_GLSL } from '@common/water-koi';
import { POND_PAD_COUNT, POND_FLOWER_COUNT, POND_PROJECTION, POND_ELEVATION, POND_SHEAR } from '@common/pond-layout';
import { POND_PROJECTION_GLSL, WATER_EXTENT, WATER_HEIGHT_SCALE } from '@common/pond-projection';


export const waterSurfaceSource = `#version 300 es
precision highp float;
uniform sampler2D water;
uniform sampler2D uPigment;
uniform sampler2D uTreeLine;
uniform bool uAssetsReady;
uniform vec4 uPads[${POND_PAD_COUNT}];
uniform vec4 uFlowers[${POND_FLOWER_COUNT}];
uniform sampler2D uLife;
uniform sampler2D uKoiPaint;
uniform bool uKoiReady;
uniform vec4 uKoi[${KOI_COUNT}];
uniform vec4 uKoiMotion[${KOI_COUNT}];
uniform vec4 uKoiSpine[${KOI_COUNT * KOI_SPINE_POINTS}];
uniform float uFishTime;
uniform float uTime;
uniform vec2 uResolution;
in vec2 uv;
out vec4 result;

const float uDetailScale = 0.05;
const float uDetailSpeed = 0.65;
const vec3 uSunDirection = vec3(-0.5, 0.62, 0.42);
vec3 vWorldPosition;

${NOISE_LIBRARY_GLSL}
${POND_PROJECTION_GLSL}

float detailHeight(vec2 point, vec2 drift) {
  float coarse = fbm3(vec3(point * uDetailScale + drift, 0.0));
  float fine = valueNoise(vec3(point * uDetailScale * 2.7 + drift * 1.7, 5.0));
  return coarse + 0.5 * fine;
}

vec2 capillaryGradient(vec2 p) {
  vec2 gradient = vec2(0.0);
  float frequency = 0.34;
  float amplitude = 0.045;
  float angle = 0.52;
  for (int wave = 0; wave < 4; wave++) {
    vec2 direction = vec2(cos(angle), sin(angle));
    float omega = sqrt(9.81 * frequency + 0.074 * frequency * frequency * frequency);
    float phase = dot(p, direction) * frequency - uTime * omega;
    float footprint = length(fwidth(p * frequency));
    gradient += direction * amplitude * frequency * cos(phase) * exp(-footprint * footprint);
    angle += 2.39996323;
    frequency *= 1.67;
    amplitude *= 0.52;
  }
  return gradient;
}

float fresnelWater(float cosine) {
  float c = clamp(cosine, 0.0, 1.0);
  float transmitted = sqrt(max(0.0, 1.0 - (1.0 - c * c) / (1.333 * 1.333)));
  float rs = (c - 1.333 * transmitted) / max(c + 1.333 * transmitted, 0.0001);
  float rp = (1.333 * c - transmitted) / max(1.333 * c + transmitted, 0.0001);
  return 0.5 * (rs * rs + rp * rp);
}

vec3 thinFilmFresnel(float cosine, float thickness) {
  float c0 = clamp(cosine, 0.001, 1.0);
  float filmIOR = 1.40;
  float waterIOR = 1.333;
  float c1 = sqrt(1.0 - (1.0 - c0 * c0) / (filmIOR * filmIOR));
  float c2 = sqrt(1.0 - (1.0 - c0 * c0) / (waterIOR * waterIOR));
  float rs0 = (c0 - filmIOR * c1) / (c0 + filmIOR * c1);
  float rs1 = (filmIOR * c1 - waterIOR * c2) / (filmIOR * c1 + waterIOR * c2);
  float rp0 = (filmIOR * c0 - c1) / (filmIOR * c0 + c1);
  float rp1 = (waterIOR * c1 - filmIOR * c2) / (waterIOR * c1 + filmIOR * c2);
  vec3 phase = 12.566370614 * filmIOR * thickness * c1 / vec3(650.0, 530.0, 460.0);
  vec3 interference = cos(phase);
  vec3 rs = (rs0 * rs0 + rs1 * rs1 + 2.0 * rs0 * rs1 * interference)
    / (1.0 + rs0 * rs0 * rs1 * rs1 + 2.0 * rs0 * rs1 * interference);
  vec3 rp = (rp0 * rp0 + rp1 * rp1 + 2.0 * rp0 * rp1 * interference)
    / (1.0 + rp0 * rp0 * rp1 * rp1 + 2.0 * rp0 * rp1 * interference);
  return clamp((rs + rp) * 0.5, vec3(0.0), vec3(1.0));
}

float forwardScattering(float cosine) {
  float g = 0.65;
  return (1.0 - g * g) / (12.566370614 * pow(max(0.001, 1.0 + g * g - 2.0 * g * cosine), 1.5));
}

float sunGGX(vec3 normal, vec3 view, vec3 light, float roughness) {
  vec3 halfway = normalize(view + light);
  float nv = max(dot(normal, view), 0.001);
  float nl = max(dot(normal, light), 0.001);
  float nh = max(dot(normal, halfway), 0.0);
  float alpha = roughness * roughness;
  float alphaSquared = alpha * alpha;
  float denominator = nh * nh * (alphaSquared - 1.0) + 1.0;
  float distribution = alphaSquared / max(3.14159265 * denominator * denominator, 0.00001);
  float smithV = 2.0 * nv / (nv + sqrt(alphaSquared + (1.0 - alphaSquared) * nv * nv));
  float smithL = 2.0 * nl / (nl + sqrt(alphaSquared + (1.0 - alphaSquared) * nl * nl));
  return distribution * smithV * smithL * fresnelWater(dot(view, halfway)) / max(4.0 * nv, 0.001);
}

vec2 brushCoordinates(vec2 point, vec2 flow) {
  vec2 p = point;
  p += vec2(sin(p.y * 0.026 + uTime * 0.07), cos(p.x * 0.018 - uTime * 0.05)) * 2.4;
  p += flow * 12.0;
  return p / vec2(390.0, 230.0) + vec2(uTime * 0.002, -uTime * 0.0007);
}

vec3 paintedWater(vec3 water, vec4 pigment, vec4 scumble, vec3 normal, float ripple) {
  float light = smoothstep(0.22, 0.92, dot(normal, normalize(uSunDirection)));
  float wash = valueNoise(vec3(vWorldPosition.xz * 0.004, 9.2));
  float hue = smoothstep(0.3, 0.72, wash);
  vec3 strokes = mix(pigment.rgb, scumble.rgb, 0.14);
  strokes *= mix(vec3(0.75, 1.09, 0.91), vec3(1.15, 0.92, 1.18), hue);
  strokes *= 0.52 + 0.38 * light;
  float glaze = 0.29 + smoothstep(0.02, 0.14, ripple) * 0.04;
  vec3 painted = mix(water, strokes, glaze);
  float bristle = smoothstep(0.68, 0.84, pigment.a) * smoothstep(0.4, 0.9, light);
  painted += vec3(0.79, 0.81, 0.69) * bristle * (0.018 + ripple * 0.2);
  return painted;
}


vec3 linearColor(vec3 color) {
  return mix(color / 12.92, pow((color + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), color));
}

vec3 displayColor(vec3 color) {
  color *= 1.05;
  color = clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
  return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}

vec3 treeLine(vec2 point) {
  float altitude = (point.y - bankHeight(point.x)) / 0.31;
  float wind = sin(uTime * 6.2 + point.x * 14.0) * 0.001 * smoothstep(0.08, 0.85, altitude);
  vec2 coord = vec2(point.x + wind, 1.0 - altitude);
  float mip = max(0.0, log2(float(textureSize(uTreeLine, 0).x) / uResolution.x));
  if (uAssetsReady) return textureLod(uTreeLine, clamp(coord, 0.0, 1.0), mip).rgb * 0.78;
  return linearColor(vec3(0.42, 0.52, 0.44));
}

vec3 canopyReflection(vec2 point, vec3 normal) {
  float distance = bankHeight(point.x) - point.y;
  vec2 ground = screenToPond(point);
  float ripple = sin(ground.y * 145.0 + sin(ground.x * 24.0) * 1.5 + uTime * 11.0);
  vec2 distortion = pondToScreen(normal.xz * 0.035) - vec2(0.5);
  vec2 mirrored = vec2(point.x + distortion.x + ripple * 0.0015, bankHeight(point.x) + distance * 0.84 + distortion.y);
  return treeLine(mirrored) * vec3(0.73, 0.87, 0.83);
}

float heightAt(vec2 point) {
  return texture(water, clamp(point, 0.0, 1.0)).r;
}

${KOI_GLSL}

vec3 lilyReflections(vec3 color, vec2 point, vec3 normal) {
  if (!uAssetsReady) return color;
  vec2 distortion = vec2(normal.x + normal.z * ${POND_SHEAR}, normal.z * ${POND_PROJECTION});
  for (int index = 0; index < ${POND_PAD_COUNT}; index++) {
    vec4 pad = uPads[index];
    vec2 d = (point - pad.xy + distortion * 0.0015) / pad.zw;
    if (dot(d, d) < 3.5) color *= 1.0 - exp(-dot(d, d) * 1.9) * 0.22;
  }
  for (int index = 0; index < ${POND_FLOWER_COUNT}; index++) {
    vec4 flower = uFlowers[index];
    vec2 d = (point - flower.xy + vec2(0.0, 0.012) + distortion * 0.002) / flower.zw;
    if (dot(d, d) < 3.0) color = mix(color, vec3(0.64, 0.54, 0.57), exp(-dot(d, d) * 2.6) * 0.10);
  }
  return color;
}

void main() {
  float bank = bankHeight(uv.x);
  if (uv.y > bank + 0.002) {
    vec3 trees = treeLine(uv);
    float bankShade = 1.0 - smoothstep(0.0, 0.016, uv.y - bank);
    trees *= 1.0 - bankShade * 0.28;
    result = vec4(displayColor(trees), 1.0);
    return;
  }
  vec2 ground = screenToPond(uv);
  vec2 point = ground * 370.0;
  vec2 waterUv = pondToWater(ground);
  vec2 texel = 1.0 / vec2(textureSize(water, 0));
  float height = heightAt(waterUv);
  vec2 rippleSlope = vec2(heightAt(waterUv + vec2(texel.x, 0.0)) - heightAt(waterUv - vec2(texel.x, 0.0)), heightAt(waterUv + vec2(0.0, texel.y)) - heightAt(waterUv - vec2(0.0, texel.y))) * ${WATER_HEIGHT_SCALE} / (2.0 * texel * ${WATER_EXTENT});
  vec2 flow = rippleSlope;
  vWorldPosition = vec3(point.x, height, point.y);
  vec2 drift = normalize(vec2(1.0, 0.55)) * uTime * uDetailSpeed;
  float center = detailHeight(point, drift);
  vec2 detailGradient = vec2(detailHeight(point + vec2(2.0, 0.0), drift) - center, detailHeight(point + vec2(0.0, 2.0), drift) - center) * 0.18;
  detailGradient += capillaryGradient(point) + flow;
  vec2 brushUv = brushCoordinates(point, flow);
  vec4 pigment = texture(uPigment, brushUv);
  vec4 scumble = texture(uPigment, brushUv * vec2(1.731, 1.371) + vec2(0.37, 0.61));
  float paintDx = texture(uPigment, brushUv + vec2(1.0 / 2048.0, 0.0)).a - pigment.a;
  float paintDz = texture(uPigment, brushUv + vec2(0.0, 1.0 / 2048.0)).a - pigment.a;
  detailGradient += vec2(paintDx, paintDz) * 0.035;
  vec3 normal = normalize(vec3(-detailGradient.x, 1.0, -detailGradient.y));
  vec3 view = normalize(vec3(0.0, ${POND_PROJECTION}, -${POND_ELEVATION}));
  vec3 sun = normalize(uSunDirection);
  float nv = max(dot(normal, view), 0.0);
  float fresnel = fresnelWater(nv);
  float filmThickness = 380.0 + 330.0 * fbm3(vec3(point * 0.008, uTime * 0.025)) + height * 4.0;
  vec3 spectralFresnel = mix(vec3(fresnel), thinFilmFresnel(nv, filmThickness), 0.7);
  vec3 waterColor = linearColor(vec3(0.31, 0.54, 0.51));
  vec3 deepColor = linearColor(vec3(0.08, 0.24, 0.28));
  vec3 scatterColor = linearColor(vec3(0.729, 0.847, 0.835));
  vec3 refractedView = refract(-view, normal, 1.0 / 1.333);
  float depthMix = 0.34 + height * 0.07 + smoothstep(0.12, 0.72, uv.y) * 0.22;
  float depth = 15.0 + 12.0 * (1.0 - depthMix);
  vec3 transmission = exp(-vec3(0.043, 0.022, 0.012) * depth / max(-refractedView.y, 0.28));
  vec3 body = mix(deepColor, waterColor, depthMix) * (0.4 + 0.6 * max(dot(normal, sun), 0.0));
  body = body * transmission + scatterColor * (1.0 - transmission) * (0.24 + forwardScattering(dot(-refractedView, sun)) * 0.36);
  vec3 reflectedDirection = reflect(-view, normal);
  vec3 sky = mix(linearColor(vec3(0.886, 0.89, 0.937)), linearColor(vec3(0.584, 0.706, 0.831)), clamp(reflectedDirection.y, 0.0, 1.0));
  vec3 color = body * (1.0 - spectralFresnel) + sky * spectralFresnel;
  color = paintedWater(color, pigment, scumble, normal, length(rippleSlope));

  float bankDistance = bank - uv.y;
  float reflection = (1.0 - smoothstep(0.015, 0.40, bankDistance)) * (0.50 + pigment.a * 0.14);
  color = mix(color, canopyReflection(uv, normal), reflection);
  float shore = exp(-bankDistance * 95.0);
  color *= 1.0 - shore * 0.38;
  float reflectedLight = pow(0.5 + 0.5 * sin(uv.y * 340.0 + sin(uv.x * 15.0) + uTime * 5.0), 14.0);
  color += linearColor(vec3(0.69, 0.72, 0.52)) * reflectedLight * shore * 0.065;
  float livingWash = texture(uLife, uv).r;
  color += vec3(0.022, 0.028, 0.012) * livingWash;
  color = paintedKoi(color, uv, normal, fresnel);
  float rippleLight = clamp(dot(rippleSlope, normalize(vec2(-0.5, 0.42))), -0.08, 0.12);
  color += linearColor(vec3(0.85, 0.90, 0.78)) * rippleLight * 0.42;
  float crest = smoothstep(0.00012, 0.0018, max(height, 0.0));
  float trough = smoothstep(0.00012, 0.0022, max(-height, 0.0));
  color += linearColor(vec3(0.78, 0.86, 0.80)) * crest * 0.035;
  color *= 1.0 - trough * 0.10;

  float variance = dot(dFdx(normal), dFdx(normal)) + dot(dFdy(normal), dFdy(normal));
  float roughness = clamp(0.115 + sqrt(variance) * 0.15, 0.115, 0.25);
  float specular = sunGGX(normal, view, sun, roughness);
  float nh = max(dot(normal, normalize(sun + view)), 0.0);
  float glint = pow(nh, 320.0);
  float glitter = pow(nh, 38.4);
  float paintedGlint = mix(0.38, 1.0, smoothstep(0.62, 0.86, pigment.a));
  color += linearColor(vec3(1.0, 0.957, 0.863)) * (min(specular, 1.5) * 0.48 + (glint * 0.8 + glitter * 0.08) * (fresnel + 0.035)) * paintedGlint;
  color = max(color * 1.04 - 0.006, vec3(0.0));
  color = lilyReflections(color, uv, normal);
  float shoreBlend = smoothstep(bank - 0.002, bank + 0.002, uv.y);
  result = vec4(mix(displayColor(color), displayColor(treeLine(uv) * 0.72), shoreBlend), 1.0);
}
`;

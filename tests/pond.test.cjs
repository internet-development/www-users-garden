const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const cache = new Map();
function load(name) {
  if (cache.has(name)) return cache.get(name).exports;
  const filename = path.join(__dirname, '..', name.replace('@common/', 'common/') + '.ts');
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  cache.set(name, module);
  new Function('require', 'exports', 'module', source)(load, module.exports, module);
  return module.exports;
}

const { stepLife, PondLife, LIFE_SIZE } = load('@common/pond-life');
const { KoiSchool, KOI_COUNT } = load('@common/water-koi');
const { pondClearance } = load('@common/pond-navigation');
const projection = load('@common/pond-projection');
const layout = load('@common/pond-layout');
const { createLilyGeometry } = load('@common/water-lilies');

function board(size, points) {
  const result = new Uint8Array(size * size);
  for (const [x, y] of points) result[y * size + x] = 1;
  return result;
}

function generation(current, size) {
  const next = new Uint8Array(current.length);
  stepLife(current, next, size);
  return next;
}

test('Conway B3/S23 preserves a block and removes isolated and overcrowded cells', () => {
  const block = board(8, [[3, 3], [4, 3], [3, 4], [4, 4]]);
  assert.deepEqual(generation(block, 8), block);
  assert.equal(generation(board(8, [[3, 3]]), 8).reduce((sum, value) => sum + value), 0);
  const crowded = board(8, [[3, 3], [2, 3], [4, 3], [3, 2], [3, 4]]);
  assert.equal(generation(crowded, 8)[3 * 8 + 3], 0);
});

test('a blinker oscillates and a glider translates after four generations', () => {
  const blinker = board(8, [[2, 3], [3, 3], [4, 3]]);
  const vertical = board(8, [[3, 2], [3, 3], [3, 4]]);
  assert.deepEqual(generation(blinker, 8), vertical);
  assert.deepEqual(generation(vertical, 8), blinker);
  let glider = board(12, [[3, 2], [4, 3], [2, 4], [3, 4], [4, 4]]);
  for (let index = 0; index < 4; index++) glider = generation(glider, 12);
  assert.deepEqual(glider, board(12, [[4, 3], [5, 4], [3, 5], [4, 5], [5, 5]]));
});

test('Life wraps pond edges and recovers from an empty field', () => {
  const edge = board(8, [[7, 3], [0, 3], [1, 3]]);
  assert.deepEqual(generation(edge, 8), board(8, [[0, 2], [0, 3], [0, 4]]));
  const life = new PondLife();
  life.cells.fill(0);
  life.advance(1.2);
  assert.ok(life.cells.some(Boolean));
  assert.equal(life.reseeds, 1);
  assert.ok(life.field.every((value) => Number.isFinite(value) && value >= 0 && value <= 1));
  assert.equal(life.pixels.length, LIFE_SIZE * LIFE_SIZE);
});

test('identical clocks produce identical living fields and zero time pauses Life', () => {
  const a = new PondLife(), b = new PondLife();
  const initial = a.cells.slice();
  a.advance(0);
  assert.deepEqual(a.cells, initial);
  for (let index = 0; index < 600; index++) { a.advance(1 / 60); b.advance(1 / 60); }
  assert.deepEqual(a.cells, b.cells);
  assert.notDeepEqual(a.cells, initial);
  assert.ok(a.generation >= 8);
});

test('lilies have distinct arrangements, bloom scales, colors and finite mesh data', () => {
  assert.equal(layout.POND_PAD_COUNT, 18);
  assert.equal(layout.POND_FLOWER_COUNT, 8);
  assert.ok(new Set(layout.LILY_PARTS.map((parts) => parts.length)).size >= 3);
  const flowers = layout.LILY_PARTS.flat().filter((part) => part.kind === 'flower');
  assert.ok(Math.max(...flowers.map((part) => part.radiusX)) / Math.min(...flowers.map((part) => part.radiusX)) > 2);
  assert.ok(new Set(flowers.map((part) => part.tint)).size >= 5);
  const geometry = createLilyGeometry();
  assert.ok(geometry.vertices.every(Number.isFinite));
  assert.ok(geometry.indices.every((index) => index < geometry.vertices.length / 13));
  const patches = new Float32Array(24), pads = new Float32Array(layout.POND_PAD_COUNT * 4);
  layout.updatePondLayout(0, patches, pads, new Float32Array(layout.POND_FLOWER_COUNT * 4));
  for (let index = 0; index < geometry.vertices.length; index += 13) {
    if (geometry.vertices[index + 11] !== 0) continue;
    const offset = geometry.vertices[index + 12] * 4;
    const c = Math.cos(patches[offset + 3]), s = Math.sin(patches[offset + 3]);
    const vx = geometry.vertices[index], vy = geometry.vertices[index + 1], vz = geometry.vertices[index + 2];
    const x = patches[offset] + (c * vx + s * vz + (-s * vx + c * vz) * layout.POND_SHEAR) * patches[offset + 2];
    const y = patches[offset + 1] + (-s * vx + c * vz) * patches[offset + 2] * layout.POND_PROJECTION + vy * patches[offset + 2] * layout.POND_ELEVATION;
    assert.ok(layout.padClearance(x, y, pads) <= 0.00001, 'Rendered pad lies outside its navigation boundary');
  }
});

test('living activity varies the koi swimming pace', () => {
  const pads = new Float32Array(layout.POND_PAD_COUNT * 4);
  layout.updatePondLayout(0, new Float32Array(24), pads, new Float32Array(layout.POND_FLOWER_COUNT * 4));
  const living = new KoiSchool(pads), quiet = new KoiSchool(pads);
  const life = new PondLife();
  const still = { sample: () => 0 };
  const a = new Float32Array(16), b = new Float32Array(16);
  for (let frame = 0; frame < 1200; frame++) {
    life.advance(1 / 60);
    living.update(1 / 60, life, pads, a);
    quiet.update(1 / 60, still, pads, b);
  }
  assert.notDeepEqual(a, b);
});

test('koi keep completing circuits without stalls, jumps, or lily collisions over thirty minutes', () => {
  const life = new PondLife();
  const patches = new Float32Array(24), pads = new Float32Array(layout.POND_PAD_COUNT * 4), flowers = new Float32Array(layout.POND_FLOWER_COUNT * 4);
  layout.updatePondLayout(0, patches, pads, flowers);
  const school = new KoiSchool(pads);
  const poses = new Float32Array(KOI_COUNT * 4);
  const initial = school.fish.map((fish) => [fish.x, fish.y]);
  const furthest = new Float64Array(KOI_COUNT);
  const previous = school.fish.map((fish) => [fish.x, fish.y]);
  const windows = school.fish.map(() => [Infinity, Infinity, -Infinity, -Infinity]);
  for (let frame = 0; frame < 108000; frame++) {
    const time = frame / 60;
    layout.updatePondLayout(time, patches, pads, flowers);
    life.advance(1 / 60);
    school.update(1 / 60, life, pads, poses);
    for (let index = 0; index < school.fish.length; index++) {
      const fish = school.fish[index];
      assert.ok(Number.isFinite(fish.angle));
      assert.ok(Math.hypot(fish.x - previous[index][0], fish.y - previous[index][1]) < 0.004, 'Koi jumps while turning around a lily');
      previous[index] = [fish.x, fish.y];
      furthest[index] = Math.max(furthest[index], Math.hypot(fish.x - initial[index][0], fish.y - initial[index][1]));
      const window = windows[index];
      window[0] = Math.min(window[0], fish.x); window[1] = Math.min(window[1], fish.y);
      window[2] = Math.max(window[2], fish.x); window[3] = Math.max(window[3], fish.y);
      if (frame % 480 === 479) {
        assert.ok(Math.hypot(window[2] - window[0], window[3] - window[1]) > 0.055, `Fish ${index} stalls near ${fish.x}, ${fish.y} at ${time}s`);
        windows[index] = [Infinity, Infinity, -Infinity, -Infinity];
      }
      for (const [x, z, radius] of school.hulls[index]) {
        assert.ok(pondClearance(x, z, radius, pads), `Fish ${index} crosses a lily or the bank at ${time}s`);
      }
    }
  }
  assert.ok(school.fish.every((fish) => fish.laps >= 8), 'Every fish must complete repeated loops');
  assert.ok(furthest.every((distance) => distance > 0.25), `movement extents: ${Array.from(furthest)}`);
  const before = poses.slice();
  school.update(0, life, pads, poses);
  assert.deepEqual(poses, before);
});

test('pond projection round-trips pointer positions and foreshortens circular ripples', () => {
  for (const point of [[0.1, 0.1], [0.5, 0.45], [0.9, 0.7]]) {
    const ground = projection.screenToPond(...point);
    const screen = projection.pondToScreen(...ground);
    assert.ok(Math.hypot(screen[0] - point[0], screen[1] - point[1]) < 1e-12);
    const field = projection.screenToWater(...point);
    assert.ok(field.every((value) => value > 0 && value < 1));
  }
  const x = projection.pondToScreen(0.1, 0), y = projection.pondToScreen(0, 0.1);
  assert.equal(x[1], 0.5);
  assert.ok(Math.abs((y[1] - 0.5) / (x[0] - 0.5) - layout.POND_PROJECTION) < 1e-12);
  assert.ok(y[0] > 0.5, 'The ripple inherits the pond shear');
  assert.equal(projection.isPondWater(0.5, 0.96), false);
  assert.equal(projection.isPondWater(0.5, 0.3), true);
});

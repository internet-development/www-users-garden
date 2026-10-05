import { POND_PROJECTION, POND_SHEAR, pondBankHeight } from '@common/pond-layout';
import { pondToScreen, screenToPond } from '@common/pond-projection';

type Point = [number, number];
const STEP = 0.012;
const WIDTH = 126;
const HEIGHT = 144;
const ORIGIN: Point = [-0.75, -1.02];
const NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

export function pondClearance(x: number, z: number, radius: number, pads: Float32Array) {
  const [sx, sy] = pondToScreen(x, z);
  const rx = radius * Math.hypot(1, POND_SHEAR), ry = radius * POND_PROJECTION;
  if (sx - rx < 0.008 || sx + rx > 0.992 || sy - ry < 0.008 || sy + ry > pondBankHeight(sx) - 0.012) return false;
  for (let index = 0; index < pads.length; index += 4) {
    if (Math.hypot((sx - pads[index]) / (pads[index + 2] + rx), (sy - pads[index + 1]) / (pads[index + 3] + ry)) < 1) return false;
  }
  return true;
}

export class PondCircuit {
  readonly points: Point[];
  readonly distances: Float64Array;
  readonly length: number;

  constructor(pads: Float32Array, radius: number) {
    const free = new Uint8Array(WIDTH * HEIGHT);
    const position = (id: number): Point => [ORIGIN[0] + (id % WIDTH) * STEP, ORIGIN[1] + Math.floor(id / WIDTH) * STEP];
    for (let id = 0; id < free.length; id++) {
      const point = position(id);
      free[id] = pondClearance(point[0], point[1], radius, pads) ? 1 : 0;
    }
    const nearest = (point: Point, mask: Uint8Array) => {
      let best = -1, distance = Infinity;
      for (let id = 0; id < mask.length; id++) {
        if (!mask[id]) continue;
        const candidate = position(id);
        const next = (candidate[0] - point[0]) ** 2 + (candidate[1] - point[1]) ** 2;
        if (next < distance) { best = id; distance = next; }
      }
      return best;
    };
    const neighbors = (id: number) => {
      const x = id % WIDTH, y = Math.floor(id / WIDTH);
      return NEIGHBORS.flatMap(([dx, dy]) => {
        const nx = x + dx, ny = y + dy, next = ny * WIDTH + nx;
        if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT || !free[next]) return [];
        if (dx && dy && (!free[y * WIDTH + nx] || !free[ny * WIDTH + x])) return [];
        return [next];
      });
    };
    const start = nearest(screenToPond(0.5, 0.4), free);
    if (start < 0) throw new Error('The pond has no open swimming channel.');
    const connected = new Uint8Array(free.length);
    const queue = [start];
    connected[start] = 1;
    for (let index = 0; index < queue.length; index++) {
      for (const next of neighbors(queue[index])) if (!connected[next]) { connected[next] = 1; queue.push(next); }
    }
    const waypoints = [[0.49, 0.09], [0.63, 0.29], [0.91, 0.33], [0.94, 0.46], [0.75, 0.55], [0.48, 0.68], [0.23, 0.55], [0.06, 0.43], [0.10, 0.32], [0.37, 0.27]].map(([x, y]) => nearest(screenToPond(x, y), connected));
    const route: Point[] = [];
    for (let leg = 0; leg < waypoints.length; leg++) {
      const from = waypoints[leg], to = waypoints[(leg + 1) % waypoints.length];
      const parents = new Int32Array(free.length).fill(-1);
      const frontier = [from];
      parents[from] = from;
      for (let index = 0; index < frontier.length && parents[to] < 0; index++) {
        for (const next of neighbors(frontier[index])) if (parents[next] < 0) { parents[next] = frontier[index]; frontier.push(next); }
      }
      const legPoints: Point[] = [];
      for (let id = to; id !== from; id = parents[id]) legPoints.push(position(id));
      route.push(...legPoints.reverse());
    }
    const clear = (a: Point, b: Point) => {
      const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / (STEP * 0.5)));
      for (let index = 0; index <= steps; index++) {
        const t = index / steps;
        if (!pondClearance(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, radius, pads)) return false;
      }
      return true;
    };
    for (let pass = 0; pass < 80; pass++) {
      for (let index = 0; index < route.length; index++) {
        const before = route[(index + route.length - 1) % route.length], after = route[(index + 1) % route.length];
        const candidate: Point = [(before[0] + after[0] + route[index][0] * 2) / 4, (before[1] + after[1] + route[index][1] * 2) / 4];
        if (clear(before, candidate) && clear(candidate, after)) route[index] = candidate;
      }
    }
    this.points = route;
    this.distances = new Float64Array(route.length + 1);
    for (let index = 0; index < route.length; index++) {
      const a = route[index], b = route[(index + 1) % route.length];
      this.distances[index + 1] = this.distances[index] + Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    this.length = this.distances[route.length];
  }

  sample(distance: number): Point {
    const arc = ((distance % this.length) + this.length) % this.length;
    let low = 0, high = this.points.length;
    while (high - low > 1) { const middle = (low + high) >>> 1; if (this.distances[middle] > arc) high = middle; else low = middle; }
    const a = this.points[low], b = this.points[(low + 1) % this.points.length];
    const t = (arc - this.distances[low]) / Math.max(0.000001, this.distances[low + 1] - this.distances[low]);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }
}

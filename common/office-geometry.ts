import * as Constants from '@common/constants';
import * as OfficePlan from '@common/office-plan';

export interface Desk {
  id?: string;
  number: number;
  x_in: number;
  y_in: number;
  rotation: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// NOTE(@caidanw)
// Rotation turns clockwise on screen. At 0 the desk's long side runs left to right and the chair
// sits below it, so at 90 the chair is on the left, at 180 above, and at 270 on the right.
function turn(rect: Rect, rotation: number, cx: number, cy: number): Rect {
  const corners = [
    [rect.x, rect.y],
    [rect.x + rect.width, rect.y + rect.height],
  ].map(([x, y]) => {
    if (rotation === 90) return [-y, x];
    if (rotation === 180) return [-x, -y];
    if (rotation === 270) return [y, -x];
    return [x, y];
  });
  const xs = corners.map((point) => point[0]);
  const ys = corners.map((point) => point[1]);
  return { x: cx + Math.min(...xs), y: cy + Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}

export function deskParts(desk: Desk) {
  const { DESK_WIDTH_IN: width, DESK_DEPTH_IN: depth, CHAIR_IN: chair } = Constants.Office;
  return {
    desk: turn({ x: -width / 2, y: -depth / 2, width, height: depth }, desk.rotation, desk.x_in, desk.y_in),
    chair: turn({ x: -chair / 2, y: depth / 2, width: chair, height: chair }, desk.rotation, desk.x_in, desk.y_in),
  };
}

// Shrinks by an inch so pieces that only touch, like desks pushed together, don't count.
export function overlaps(a: Rect, b: Rect) {
  return a.x + 1 < b.x + b.width && b.x + 1 < a.x + a.width && a.y + 1 < b.y + b.height && b.y + 1 < a.y + a.height;
}

export function crosses(rect: Rect, x1: number, y1: number, x2: number, y2: number) {
  const left = rect.x + 1;
  const right = rect.x + rect.width - 1;
  const top = rect.y + 1;
  const bottom = rect.y + rect.height - 1;
  let start = 0;
  let end = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  for (const [p, q] of [
    [-dx, x1 - left],
    [dx, right - x1],
    [-dy, y1 - top],
    [dy, bottom - y1],
  ]) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) start = Math.max(start, t);
    else end = Math.min(end, t);
    if (start > end) return false;
  }
  return true;
}

const SNAP_IN = 6;
const WALL_SNAP_IN = 12;
const MAX_PUSH_IN = 72;

function axisWalls() {
  const walls = OfficePlan.WALL_SEGMENTS;
  const result: number[][] = [];
  for (let i = 0; i < walls.length; i += 4) {
    const [x1, y1, x2, y2] = [walls[i], walls[i + 1], walls[i + 2], walls[i + 3]];
    if (x1 === x2 || y1 === y2) result.push([Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)]);
  }
  return result;
}

let cachedWalls: number[][] | null = null;

function hitsWall(rect: Rect, wall: number[]) {
  const [x1, y1, x2, y2] = wall;
  if (y1 === y2) return y1 > rect.y + 0.5 && y1 < rect.y + rect.height - 0.5 && x2 > rect.x + 0.5 && x1 < rect.x + rect.width - 0.5;
  return x1 > rect.x + 0.5 && x1 < rect.x + rect.width - 0.5 && y2 > rect.y + 0.5 && y1 < rect.y + rect.height - 0.5;
}

function shift(rect: Rect, dx: number, dy: number): Rect {
  return { x: rect.x + dx, y: rect.y + dy, width: rect.width, height: rect.height };
}

function overlapsOn(axis: 'x' | 'y', a: Rect, b: { x: number; y: number; width: number; height: number }) {
  return axis === 'x' ? a.y + 0.5 < b.y + b.height && b.y + 0.5 < a.y + a.height : a.x + 0.5 < b.x + b.width && b.x + 0.5 < a.x + a.width;
}

// NOTE(@caidanw)
// Settles desks that were just dragged, nudged, or rotated. Selected desks move together, and only
// the desktops count; chair clearance is assessed separately by the planner.
// 1. A desk that ends up across a wall or on another desk is pushed out so it sits flush against
//    it, preferring the way it came from (`moved` is the drag or nudge that brought it there).
// 2. On each axis, a desk already touching a wall or desk stays put. Otherwise it snaps flush to a
//    wall within WALL_SNAP_IN, or else flush to or in line with a desk within SNAP_IN. Arrow-key
//    nudges skip this step (`snap` is false), or a 6 in nudge would snap straight back.
// Returns the move to apply.
export function settle(desks: Array<Desk & { key?: string }>, keys: string[], snap = true, moved = { dx: 0, dy: 0 }): { dx: number; dy: number } {
  const moving = desks.filter((desk) => keys.includes(desk.key as string)).map((desk) => deskParts(desk).desk);
  if (!moving.length) return { dx: 0, dy: 0 };
  const others = desks.filter((desk) => !keys.includes(desk.key as string)).map((desk) => deskParts(desk).desk);

  const left = Math.min(...moving.map((rect) => rect.x)) - MAX_PUSH_IN;
  const top = Math.min(...moving.map((rect) => rect.y)) - MAX_PUSH_IN;
  const right = Math.max(...moving.map((rect) => rect.x + rect.width)) + MAX_PUSH_IN;
  const bottom = Math.max(...moving.map((rect) => rect.y + rect.height)) + MAX_PUSH_IN;
  cachedWalls = cachedWalls || axisWalls();
  const walls = cachedWalls.filter(([x1, y1, x2, y2]) => x2 >= left && x1 <= right && y2 >= top && y1 <= bottom).map(([x1, y1, x2, y2]) => ({ x: x1, y: y1, width: x2 - x1, height: y2 - y1, horizontal: y1 === y2 }));
  const near = others.filter((rect) => rect.x + rect.width >= left && rect.x <= right && rect.y + rect.height >= top && rect.y <= bottom);

  const fits = (dx: number, dy: number) =>
    moving.every((rect) => {
      const next = shift(rect, dx, dy);
      return !walls.some((wall) => hitsWall(next, [wall.x, wall.y, wall.x + wall.width, wall.y + wall.height])) && !near.some((other) => overlaps(next, other));
    });

  // 1. Push out of anything the desks landed on. Moves that put a desk flush against a wall or desk.
  const xs = new Set<number>([0]);
  const ys = new Set<number>([0]);
  for (const rect of moving) {
    for (const wall of walls) {
      if (wall.horizontal) [wall.y - (rect.y + rect.height), wall.y - rect.y].forEach((value) => ys.add(value));
      else [wall.x - (rect.x + rect.width), wall.x - rect.x].forEach((value) => xs.add(value));
    }
    for (const other of near) {
      [other.x - (rect.x + rect.width), other.x + other.width - rect.x].forEach((value) => xs.add(value));
      [other.y - (rect.y + rect.height), other.y + other.height - rect.y].forEach((value) => ys.add(value));
    }
  }
  const within = (values: Set<number>) => [...values].filter((value) => Math.abs(value) <= MAX_PUSH_IN);
  // Going further the way the desk was moving costs extra, so it comes back to the side it came from.
  const cost = (dx: number, dy: number) => Math.abs(dx) + Math.abs(dy) + (dx * moved.dx > 0 ? MAX_PUSH_IN * 4 : 0) + (dy * moved.dy > 0 ? MAX_PUSH_IN * 4 : 0);
  let pushed: { dx: number; dy: number } | null = null;
  let lowest = Infinity;
  for (const dx of within(xs)) {
    for (const dy of within(ys)) {
      const price = cost(dx, dy);
      if (price < lowest && fits(dx, dy)) {
        pushed = { dx, dy };
        lowest = price;
      }
    }
  }
  if (!pushed) return { dx: 0, dy: 0 };
  if (!snap) return pushed;

  // 2. Snap each axis to a wall first, then to a desk, unless it already touches one.
  const result = { ...pushed };
  for (const axis of ['x', 'y'] as const) {
    const wallMoves: number[] = [];
    const deskMoves: number[] = [];
    let touching = false;
    for (const rect of moving) {
      const at = shift(rect, result.dx, result.dy);
      const [start, end] = axis === 'x' ? [at.x, at.x + at.width] : [at.y, at.y + at.height];
      for (const wall of walls) {
        if (wall.horizontal !== (axis === 'y') || !overlapsOn(axis, at, wall)) continue;
        const line = axis === 'x' ? wall.x : wall.y;
        for (const value of [line - end, line - start]) {
          if (value === 0) touching = true;
          else if (Math.abs(value) <= WALL_SNAP_IN) wallMoves.push(value);
        }
      }
      for (const other of near) {
        const [otherStart, otherEnd] = axis === 'x' ? [other.x, other.x + other.width] : [other.y, other.y + other.height];
        const beside = overlapsOn(axis, at, other);
        for (const value of [otherStart - end, otherEnd - start]) {
          if (value === 0 && beside) touching = true;
          else if (value !== 0 && Math.abs(value) <= SNAP_IN) deskMoves.push(value);
        }
        for (const value of [otherStart - start, otherEnd - end]) {
          if (value !== 0 && Math.abs(value) <= SNAP_IN) deskMoves.push(value);
        }
      }
    }
    if (touching) continue;
    const tryMove = (value: number) => (axis === 'x' ? fits(result.dx + value, result.dy) : fits(result.dx, result.dy + value));
    const byDistance = (a: number, b: number) => Math.abs(a) - Math.abs(b);
    const value = wallMoves.sort(byDistance).find(tryMove) ?? deskMoves.sort(byDistance).find(tryMove);
    if (value !== undefined) {
      if (axis === 'x') result.dx += value;
      else result.dy += value;
    }
  }
  return result;
}

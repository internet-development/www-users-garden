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
  const { DESK_WIDTH_IN: width, DESK_DEPTH_IN: depth, CHAIR_IN: chair, WALKWAY_IN: walkway } = Constants.Office;
  return {
    desk: turn({ x: -width / 2, y: -depth / 2, width, height: depth }, desk.rotation, desk.x_in, desk.y_in),
    chair: turn({ x: -chair / 2, y: depth / 2, width: chair, height: chair }, desk.rotation, desk.x_in, desk.y_in),
    walkway: turn({ x: -width / 2, y: depth / 2, width, height: chair + walkway }, desk.rotation, desk.x_in, desk.y_in),
  };
}

// Shrinks by an inch so pieces that only touch, like desks pushed together, don't count.
function overlaps(a: Rect, b: Rect) {
  return a.x + 1 < b.x + b.width && b.x + 1 < a.x + a.width && a.y + 1 < b.y + b.height && b.y + 1 < a.y + a.height;
}

function crosses(rect: Rect, x1: number, y1: number, x2: number, y2: number) {
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

// NOTE(@caidanw)
// Settles desks that were just dragged or nudged. A desk that ends up across a wall or on another
// desk is pushed the shortest way out so it sits flush against it. A desk that lands within
// WALL_SNAP_IN of a wall, or SNAP_IN of another desk, then snaps flush to it, or lines up with the
// desk's edge (skipped for arrow-key nudges, which would otherwise snap straight back). Selected
// desks move together.
// Only the desktops count; walkways are allowed to run into things. Returns the move to apply.
export function settle(desks: Array<Desk & { key?: string }>, keys: string[], snap = true): { dx: number; dy: number } {
  const moving = desks.filter((desk) => keys.includes(desk.key as string)).map((desk) => deskParts(desk).desk);
  if (!moving.length) return { dx: 0, dy: 0 };
  const others = desks.filter((desk) => !keys.includes(desk.key as string)).map((desk) => deskParts(desk).desk);

  const left = Math.min(...moving.map((rect) => rect.x)) - MAX_PUSH_IN;
  const top = Math.min(...moving.map((rect) => rect.y)) - MAX_PUSH_IN;
  const right = Math.max(...moving.map((rect) => rect.x + rect.width)) + MAX_PUSH_IN;
  const bottom = Math.max(...moving.map((rect) => rect.y + rect.height)) + MAX_PUSH_IN;
  cachedWalls = cachedWalls || axisWalls();
  const walls = cachedWalls.filter(([x1, y1, x2, y2]) => x2 >= left && x1 <= right && y2 >= top && y1 <= bottom);
  const near = others.filter((rect) => rect.x + rect.width >= left && rect.x <= right && rect.y + rect.height >= top && rect.y <= bottom);

  const fits = (dx: number, dy: number) =>
    moving.every((rect) => {
      const next = shift(rect, dx, dy);
      return !walls.some((wall) => hitsWall(next, wall)) && !near.some((other) => overlaps(next, other));
    });

  // Moves that put a desk flush against a wall or another desk, on either side.
  const xs = new Set<number>([0]);
  const ys = new Set<number>([0]);
  for (const rect of moving) {
    for (const [x1, y1, x2, y2] of walls) {
      if (y1 === y2) {
        ys.add(y1 - (rect.y + rect.height));
        ys.add(y1 - rect.y);
      } else {
        xs.add(x1 - (rect.x + rect.width));
        xs.add(x1 - rect.x);
      }
    }
    for (const other of near) {
      xs.add(other.x - (rect.x + rect.width));
      xs.add(other.x + other.width - rect.x);
      ys.add(other.y - (rect.y + rect.height));
      ys.add(other.y + other.height - rect.y);
    }
  }
  const xList = [...xs].filter((value) => Math.abs(value) <= MAX_PUSH_IN).sort((a, b) => Math.abs(a) - Math.abs(b));
  const yList = [...ys].filter((value) => Math.abs(value) <= MAX_PUSH_IN).sort((a, b) => Math.abs(a) - Math.abs(b));

  // Push out of anything the desks landed on, as little as possible.
  let best: { dx: number; dy: number } | null = null;
  for (const dx of xList) {
    if (best && Math.abs(dx) >= Math.abs(best.dx) + Math.abs(best.dy)) break;
    for (const dy of yList) {
      if (best && Math.abs(dx) + Math.abs(dy) >= Math.abs(best.dx) + Math.abs(best.dy)) break;
      if (fits(dx, dy)) best = { dx, dy };
    }
  }
  if (!best) return { dx: 0, dy: 0 };
  const pushed = best;
  if (!snap) return pushed;

  // Then pull in to a wall or desk, or line up with a desk, when it is close.
  const snaps = (axis: 'x' | 'y') => {
    const values = new Set<number>();
    for (const rect of moving) {
      const moved = shift(rect, pushed.dx, pushed.dy);
      for (const other of near) {
        const candidates =
          axis === 'x'
            ? [other.x - (moved.x + moved.width), other.x + other.width - moved.x, other.x - moved.x, other.x + other.width - (moved.x + moved.width)]
            : [other.y - (moved.y + moved.height), other.y + other.height - moved.y, other.y - moved.y, other.y + other.height - (moved.y + moved.height)];
        candidates.filter((value) => Math.abs(value) <= SNAP_IN).forEach((value) => values.add(value));
      }
      for (const [x1, y1, x2, y2] of walls) {
        const horizontal = y1 === y2;
        if (axis === 'y' && horizontal && x2 > moved.x && x1 < moved.x + moved.width) {
          [y1 - (moved.y + moved.height), y1 - moved.y].filter((value) => Math.abs(value) <= WALL_SNAP_IN).forEach((value) => values.add(value));
        }
        if (axis === 'x' && !horizontal && y2 > moved.y && y1 < moved.y + moved.height) {
          [x1 - (moved.x + moved.width), x1 - moved.x].filter((value) => Math.abs(value) <= WALL_SNAP_IN).forEach((value) => values.add(value));
        }
      }
    }
    return [...values].filter((value) => value !== 0).sort((a, b) => Math.abs(a) - Math.abs(b));
  };
  const snapX = snaps('x').find((value) => fits(pushed.dx + value, pushed.dy)) || 0;
  const snapY = snaps('y').find((value) => fits(pushed.dx + snapX, pushed.dy + value)) || 0;
  return { dx: pushed.dx + snapX, dy: pushed.dy + snapY };
}

// The desks whose walkway runs into a wall, another desk, or another chair.
export function blockedDesks(desks: Desk[]): Set<number> {
  const parts = desks.map(deskParts);
  const blocked = new Set<number>();
  const walls = OfficePlan.WALL_SEGMENTS;
  parts.forEach((part, index) => {
    for (let other = 0; other < parts.length; other++) {
      if (other !== index && (overlaps(part.walkway, parts[other].desk) || overlaps(part.walkway, parts[other].chair))) {
        blocked.add(index);
        return;
      }
    }
    for (let i = 0; i < walls.length; i += 4) {
      if (crosses(part.walkway, walls[i], walls[i + 1], walls[i + 2], walls[i + 3])) {
        blocked.add(index);
        return;
      }
    }
  });
  return blocked;
}

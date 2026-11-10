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

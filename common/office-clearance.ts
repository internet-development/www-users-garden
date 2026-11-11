import * as Geometry from '@common/office-geometry';
import * as Floor from '@common/office-plan';

export type Conflict = {
  message: string;
  affected: Array<{ index: number; part: 'desk' | 'chair' }>;
};

const MAX_CLEARANCE = 96;
const BUCKET = 96;
const wallBuckets = new Map<string, number[][]>();
for (let i = 0; i < Floor.WALL_SEGMENTS.length; i += 4) {
  const wall = Floor.WALL_SEGMENTS.slice(i, i + 4);
  const [x1, y1, x2, y2] = wall;
  for (let x = Math.floor(Math.min(x1, x2) / BUCKET); x <= Math.floor(Math.max(x1, x2) / BUCKET); x++) {
    for (let y = Math.floor(Math.min(y1, y2) / BUCKET); y <= Math.floor(Math.max(y1, y2) / BUCKET); y++) {
      const key = `${x},${y}`;
      const bucket = wallBuckets.get(key) || [];
      bucket.push(wall);
      wallBuckets.set(key, bucket);
    }
  }
}

const staticCache = new Map<string, boolean>();
function staticFits(rect: Geometry.Rect): boolean {
  const key = `${rect.x},${rect.y},${rect.width},${rect.height}`;
  const cached = staticCache.get(key);
  if (cached !== undefined) return cached;
  let fits = Geometry.insideSuite(rect);
  for (let x = Math.floor(rect.x / BUCKET); fits && x <= Math.floor((rect.x + rect.width) / BUCKET); x++) {
    for (let y = Math.floor(rect.y / BUCKET); fits && y <= Math.floor((rect.y + rect.height) / BUCKET); y++) {
      fits = !(wallBuckets.get(`${x},${y}`) || []).some(([x1, y1, x2, y2]) => Geometry.crosses(rect, x1, y1, x2, y2));
    }
  }
  if (staticCache.size > 60000) staticCache.clear();
  staticCache.set(key, fits);
  return fits;
}

function seatStrip(desk: Geometry.Desk, depth: number): Geometry.Rect {
  const { desk: top, chair } = Geometry.deskParts(desk);
  if (desk.rotation === 90) return { x: top.x - depth, y: chair.y, width: depth, height: chair.height };
  if (desk.rotation === 270) return { x: top.x + top.width, y: chair.y, width: depth, height: chair.height };
  if (desk.rotation === 180) return { x: chair.x, y: top.y - depth, width: chair.width, height: depth };
  return { x: chair.x, y: top.y + top.height, width: chair.width, height: depth };
}

export function measure(desks: Geometry.Desk[]): { issues: Conflict[]; inches: number[] } {
  const parts = desks.map(Geometry.deskParts);
  const issues: Conflict[] = [];
  for (let i = 0; i < desks.length; i++) {
    const { desk, chair } = parts[i];
    if (!staticFits(desk)) issues.push({ message: `Desk ${desks[i].number}: desktop crosses a wall or suite boundary`, affected: [{ index: i, part: 'desk' }] });
    if (!staticFits(chair)) issues.push({ message: `Desk ${desks[i].number}: chair space crosses a wall or suite boundary`, affected: [{ index: i, part: 'chair' }] });
    for (let j = i + 1; j < desks.length; j++) {
      const affected: Conflict['affected'] = [];
      for (const a of ['desk', 'chair'] as const) {
        for (const b of ['desk', 'chair'] as const) {
          if (!Geometry.overlaps(parts[i][a], parts[j][b])) continue;
          if (!affected.some((p) => p.index === i && p.part === a)) affected.push({ index: i, part: a });
          if (!affected.some((p) => p.index === j && p.part === b)) affected.push({ index: j, part: b });
        }
      }
      if (affected.length) issues.push({ message: `Desks ${desks[i].number} and ${desks[j].number}: desktops or chair spaces overlap`, affected });
    }
  }
  const inches = desks.map((d, i) => {
    let low = 0;
    let high = MAX_CLEARANCE;
    for (let step = 0; step < 8; step++) {
      const mid = (low + high) / 2;
      const strip = seatStrip(d, mid);
      const clear = staticFits(strip) && !parts.some((part, j) => j !== i && (Geometry.overlaps(strip, part.desk) || Geometry.overlaps(strip, part.chair)));
      if (clear) low = mid;
      else high = mid;
    }
    // NOTE(@caidanw) Do not report the collision helper's contact tolerance as extra clearance.
    return Math.max(0, Math.floor(low - 1));
  });
  return { issues, inches };
}

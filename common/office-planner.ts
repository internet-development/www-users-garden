import * as Constants from '@common/constants';
import * as Geometry from '@common/office-geometry';
import * as Floor from '@common/office-plan';

export type Desk = Geometry.Desk & { key: string };
export type Zone = Geometry.Rect & { key: string; kind: 'aisle' | 'keep-clear' };
export type Draft = {
  version: 1;
  name: string;
  baseline: Desk[];
  desks: Desk[];
  pods: string[][];
  locked: string[];
  zones: Zone[];
  area: Geometry.Rect | null;
  clearance: number;
};
export type Report = {
  issues: string[];
  clearance: { key: string; number: number; inches: number; loss: number }[];
  belowTarget: number;
  minimum: number;
  moved: number;
};
export type Candidate = { name: string; desks: Desk[]; report: Report };

const MAX_CLEARANCE = 96;
const walls: number[][] = [];
for (let i = 0; i < Floor.WALL_SEGMENTS.length; i += 4) walls.push(Floor.WALL_SEGMENTS.slice(i, i + 4));
const wallBuckets = new Map<string, number[][]>();
const BUCKET = 96;
for (const wall of walls) {
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

function contains(area: Geometry.Rect, rect: Geometry.Rect): boolean {
  return rect.x >= area.x && rect.y >= area.y && rect.x + rect.width <= area.x + area.width && rect.y + rect.height <= area.y + area.height;
}

export function geometry(desks: Array<Geometry.Desk & { key?: string }>): Desk[] {
  return desks.map((d) => ({ key: d.key || d.id || '', number: d.number, x_in: d.x_in, y_in: d.y_in, rotation: d.rotation }));
}

export function fingerprint(desks: Desk[]): string {
  return JSON.stringify([...desks].sort((a, b) => a.key.localeCompare(b.key)).map((d) => [d.key, d.number, d.x_in, d.y_in, d.rotation]));
}

export function detectPods(desks: Desk[]): string[][] {
  const remaining = new Set(desks.map((d) => d.key));
  const pods: string[][] = [];
  for (const desk of desks) {
    if (!remaining.delete(desk.key)) continue;
    const pod = [desk.key];
    for (let i = 0; i < pod.length; i++) {
      const member = desks.find((d) => d.key === pod[i]);
      if (!member) continue;
      const a = Geometry.deskParts(member).desk;
      for (const other of desks) {
        if (!remaining.has(other.key)) continue;
        const b = Geometry.deskParts(other).desk;
        const touch = a.x <= b.x + b.width + 2 && b.x <= a.x + a.width + 2 && a.y <= b.y + b.height + 2 && b.y <= a.y + a.height + 2;
        if (touch) {
          remaining.delete(other.key);
          pod.push(other.key);
        }
      }
    }
    pods.push(pod);
  }
  return pods;
}

export function createDraft(desks: Desk[], name: string): Draft {
  return { version: 1, name, baseline: geometry(desks), desks: geometry(desks), pods: detectPods(desks), locked: [], zones: [], area: null, clearance: Constants.Office.CLEARANCE_TARGET_IN };
}

export function selection(draft: Draft, keys: string[]): string[] {
  return draft.pods.filter((pod) => pod.some((key) => keys.includes(key))).flat();
}

export function transform(desks: Desk[], keys: string[], dx: number, dy: number, rotate = false): Desk[] {
  const moving = desks.filter((d) => keys.includes(d.key));
  if (!moving.length) return desks;
  const cx = (Math.min(...moving.map((d) => d.x_in)) + Math.max(...moving.map((d) => d.x_in))) / 2;
  const cy = (Math.min(...moving.map((d) => d.y_in)) + Math.max(...moving.map((d) => d.y_in))) / 2;
  return desks.map((d) =>
    !keys.includes(d.key)
      ? d
      : {
          ...d,
          x_in: Math.round((rotate ? cx - (d.y_in - cy) : d.x_in) + dx),
          y_in: Math.round((rotate ? cy + (d.x_in - cx) : d.y_in) + dy),
          rotation: rotate ? (d.rotation + 90) % 360 : d.rotation,
        }
  );
}

function seatStrip(desk: Desk, depth: number): Geometry.Rect {
  const { desk: top, chair } = Geometry.deskParts(desk);
  if (desk.rotation === 90) return { x: top.x - depth, y: chair.y, width: depth, height: chair.height };
  if (desk.rotation === 270) return { x: top.x + top.width, y: chair.y, width: depth, height: chair.height };
  if (desk.rotation === 180) return { x: chair.x, y: top.y - depth, width: chair.width, height: depth };
  return { x: chair.x, y: top.y + top.height, width: chair.width, height: depth };
}

function assess(desks: Desk[], zones: Zone[]): { issues: string[]; inches: number[] } {
  const parts = desks.map(Geometry.deskParts);
  const issues: string[] = [];
  zones.forEach((zone, index) => {
    if (zone.kind === 'aisle' && !staticFits(zone)) issues.push(`Aisle ${index + 1}: crosses a wall or suite boundary`);
  });
  for (let i = 0; i < desks.length; i++) {
    const { desk, chair } = parts[i];
    if (!staticFits(desk)) issues.push(`Desk ${desks[i].number}: desktop crosses a wall or suite boundary`);
    if (!staticFits(chair)) issues.push(`Desk ${desks[i].number}: chair crosses a wall or suite boundary`);
    for (const zone of zones) {
      if (Geometry.overlaps(desk, zone) || Geometry.overlaps(chair, zone)) issues.push(`Desk ${desks[i].number}: intrudes on ${zone.kind === 'aisle' ? 'an aisle' : 'a keep-clear zone'}`);
    }
    for (let j = i + 1; j < desks.length; j++) {
      if (Geometry.overlaps(desk, parts[j].desk) || Geometry.overlaps(desk, parts[j].chair) || Geometry.overlaps(chair, parts[j].desk) || Geometry.overlaps(chair, parts[j].chair)) {
        issues.push(`Desks ${desks[i].number} and ${desks[j].number}: desktop or chair overlap`);
      }
    }
  }
  const inches = desks.map((d, i) => {
    let low = 0;
    let high = MAX_CLEARANCE;
    for (let step = 0; step < 8; step++) {
      const mid = (low + high) / 2;
      const strip = seatStrip(d, mid);
      const clear = staticFits(strip) && !parts.some((part, j) => j !== i && (Geometry.overlaps(strip, part.desk) || Geometry.overlaps(strip, part.chair))) && !zones.some((z) => Geometry.overlaps(strip, z));
      if (clear) low = mid;
      else high = mid;
    }
    // The collision helper tolerates touching edges; do not report that tolerance as extra space.
    return Math.max(0, Math.floor(low - 1));
  });
  return { issues, inches };
}

export function analyze(draft: Draft): Report {
  const current = assess(draft.desks, draft.zones);
  const baseline = assess(draft.baseline, draft.zones);
  const before = new Map(draft.baseline.map((d, i) => [d.key, { desk: d, inches: baseline.inches[i] }]));
  return {
    issues: current.issues,
    clearance: draft.desks.map((d, i) => ({ key: d.key, number: d.number, inches: current.inches[i], loss: Math.max(0, (before.get(d.key)?.inches || 0) - current.inches[i]) })),
    belowTarget: current.inches.filter((n) => n < draft.clearance).length,
    minimum: current.inches.length ? Math.min(...current.inches) : 0,
    moved: draft.desks.filter((d) => {
      const old = before.get(d.key)?.desk;
      return old && (old.x_in !== d.x_in || old.y_in !== d.y_in || old.rotation !== d.rotation);
    }).length,
  };
}

function movable(draft: Draft, pod: string[]): boolean {
  const area = draft.area;
  return !!area && !pod.some((key) => draft.locked.includes(key)) && draft.desks.filter((d) => pod.includes(d.key)).every((d) => contains(area, Geometry.deskParts(d).desk));
}

function score(draft: Draft, desks: Desk[], mode: number): number {
  const report = assess(desks, draft.zones);
  const discomfort = report.inches.reduce((sum, n) => sum + Math.pow(Math.max(0, draft.clearance - n), 2), 0);
  const origins = new Map(draft.desks.map((d) => [d.key, d]));
  let distance = 0;
  for (const d of desks) {
    const old = origins.get(d.key);
    if (old) distance += Math.hypot(d.x_in - old.x_in, d.y_in - old.y_in) + (d.rotation !== old.rotation ? 24 : 0);
  }
  const extent = desks.length ? (Math.max(...desks.map((d) => d.x_in)) - Math.min(...desks.map((d) => d.x_in))) * (Math.max(...desks.map((d) => d.y_in)) - Math.min(...desks.map((d) => d.y_in))) : 0;
  return report.issues.length * 1000000 + discomfort * (mode === 1 ? 4 : 1) + distance * (mode === 0 ? 2 : 0.05) + (mode === 2 ? extent * 0.02 : 0);
}

function nextRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// NOTE(@caidanw) Search yields between bounded batches. It never mutates the source draft and
// returns only validated candidates, not the lowest-scoring invalid arrangement.
export async function optimize(draft: Draft, options: { additional: number; signal: AbortSignal; onProgress: (message: string) => void }): Promise<Candidate[]> {
  const area = draft.area;
  if (!area) throw new Error('Draw a search area first.');
  if (!Number.isInteger(options.additional) || options.additional < 0 || options.additional > 8) throw new Error('Choose between 0 and 8 additional desks.');
  const yieldControl = async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (options.signal.aborted) throw new DOMException('Search cancelled', 'AbortError');
  };
  const pods = draft.pods.filter((pod) => movable(draft, pod));
  const movingKeys = new Set(pods.flat());
  const fixed = draft.desks.filter((desk) => !movingKeys.has(desk.key));
  if (assess(fixed, draft.zones).issues.length) throw new Error('Resolve conflicts in locked or out-of-area desks, or in drawn aisles, before searching.');
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  const modes = ['Least disruption', 'More clearance', 'Compact pods'];
  for (let mode = 0; mode < modes.length; mode++) {
    options.onProgress(`Searching: ${modes[mode].toLowerCase()}`);
    await yieldControl();
    const random = nextRandom(1381 + mode * 9701);
    let desks = geometry(draft.desks);
    let currentScore = score(draft, desks, mode);
    let best = desks;
    let bestScore = currentScore;
    for (let step = 0; pods.length && step < 1000; step++) {
      if (step % 16 === 0) await yieldControl();
      const pod = pods[Math.floor(random() * pods.length)];
      const members = desks.filter((d) => pod.includes(d.key));
      const cx = members.reduce((sum, d) => sum + d.x_in, 0) / members.length;
      const cy = members.reduce((sum, d) => sum + d.y_in, 0) / members.length;
      const jump = random() < 0.1;
      const dx = jump ? Math.round((area.x + random() * area.width - cx) / 6) * 6 : (Math.floor(random() * 7) - 3) * 6;
      const dy = jump ? Math.round((area.y + random() * area.height - cy) / 6) * 6 : (Math.floor(random() * 7) - 3) * 6;
      const next = transform(desks, pod, dx, dy, random() < 0.12);
      if (!next.filter((d) => pod.includes(d.key)).every((d) => contains(area, Geometry.deskParts(d).desk))) continue;
      const nextScore = score(draft, next, mode);
      const temperature = 120 * (1 - step / 1000);
      if (nextScore < currentScore || random() < Math.exp((currentScore - nextScore) / Math.max(temperature, 1))) {
        desks = next;
        currentScore = nextScore;
        if (currentScore < bestScore) {
          best = desks;
          bestScore = currentScore;
        }
      }
    }
    desks = best;
    for (let extra = 0; extra < options.additional; extra++) {
      let chosen: Desk | null = null;
      let lowest = Infinity;
      const number = Math.max(0, ...desks.map((d) => d.number)) + 1;
      const parts = desks.map(Geometry.deskParts);
      let visits = 0;
      for (let y = area.y + 15; y < area.y + area.height; y += 12) {
        for (let x = area.x + 15; x < area.x + area.width; x += 12) {
          if (++visits % 64 === 0) await yieldControl();
          for (const rotation of [0, 90, 180, 270]) {
            const d = { key: `new-optimizer-${mode}-${number}`, number, x_in: Math.round(x), y_in: Math.round(y), rotation };
            const part = Geometry.deskParts(d);
            if (!contains(area, part.desk) || !contains(area, part.chair) || !staticFits(part.desk) || !staticFits(part.chair)) continue;
            if (draft.zones.some((z) => Geometry.overlaps(z, part.desk) || Geometry.overlaps(z, part.chair))) continue;
            if (parts.some((p) => Geometry.overlaps(p.desk, part.desk) || Geometry.overlaps(p.chair, part.desk) || Geometry.overlaps(p.desk, part.chair) || Geometry.overlaps(p.chair, part.chair))) continue;
            const value = score(draft, [...desks, d], mode);
            if (value < lowest) {
              chosen = d;
              lowest = value;
            }
          }
        }
      }
      if (!chosen) break;
      desks = [...desks, chosen];
    }
    const report = analyze({ ...draft, desks });
    const signature = fingerprint(desks.map((desk) => ({ ...desk, key: desk.key.startsWith('new-') ? `new-${desk.number}` : desk.key })));
    if (!report.issues.length && !seen.has(signature)) {
      candidates.push({ name: modes[mode], desks, report });
      seen.add(signature);
    }
  }
  return candidates;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}
function identifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 120;
}
function rectangle(value: unknown): value is Geometry.Rect {
  return record(value) && integer(value.x, 0, Floor.WIDTH_IN) && integer(value.y, 0, Floor.HEIGHT_IN) && integer(value.width, 1, Floor.WIDTH_IN) && integer(value.height, 1, Floor.HEIGHT_IN) && value.x + value.width <= Floor.WIDTH_IN && value.y + value.height <= Floor.HEIGHT_IN;
}
function deskList(value: unknown): value is Desk[] {
  return Array.isArray(value) && value.length <= 200 && value.every((d) => record(d) && identifier(d.key) && integer(d.number, 1, 10000) && integer(d.x_in, 0, Floor.WIDTH_IN) && integer(d.y_in, 0, Floor.HEIGHT_IN) && typeof d.rotation === 'number' && [0, 90, 180, 270].includes(d.rotation)) && new Set(value.map((d) => d.key)).size === value.length && new Set(value.map((d) => d.number)).size === value.length;
}

export function parseDraft(value: unknown): Draft {
  if (!record(value) || value.version !== 1 || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80 || !deskList(value.baseline) || !deskList(value.desks) || !integer(value.clearance, 26, 72) || !(value.area === null || rectangle(value.area))) throw new Error('Not a supported layout draft.');
  const desks = geometry(value.desks);
  const baseline = geometry(value.baseline);
  const keys = new Set(desks.map((d) => d.key));
  if (baseline.some((d) => !desks.some((next) => next.key === d.key && next.number === d.number)) || desks.some((d) => !baseline.some((b) => b.key === d.key) && !d.key.startsWith('new-'))) throw new Error('A draft must retain every original desk and number.');
  const pods = value.pods;
  const locked = value.locked;
  if (!Array.isArray(pods) || !pods.every((p) => Array.isArray(p) && p.length && p.every((k) => typeof k === 'string' && keys.has(k))) || pods.flat().length !== keys.size || new Set(pods.flat()).size !== keys.size || !Array.isArray(locked) || !locked.every((k) => typeof k === 'string' && keys.has(k))) throw new Error('Invalid pod or lock membership.');
  const zones = value.zones;
  if (!Array.isArray(zones) || zones.length > 100 || !zones.every((z): z is Zone => rectangle(z) && record(z) && identifier(z.key) && (z.kind === 'aisle' || z.kind === 'keep-clear')) || new Set(zones.map((z) => z.key)).size !== zones.length) throw new Error('Invalid protected zones.');
  return { version: 1, name: value.name.trim(), baseline: geometry(value.baseline), desks, clearance: value.clearance, area: value.area ? { x: value.area.x, y: value.area.y, width: value.area.width, height: value.area.height } : null, pods: pods.map((p) => [...p]), locked: [...locked], zones: zones.map((z) => ({ key: z.key, kind: z.kind, x: z.x, y: z.y, width: z.width, height: z.height })) };
}

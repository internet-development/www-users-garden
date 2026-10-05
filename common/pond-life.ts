export const LIFE_SIZE = 28;
export const LIFE_INTERVAL = 1.2;

export function stepLife(current: Uint8Array, next: Uint8Array, size: number) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) neighbors += current[((y + dy + size) % size) * size + (x + dx + size) % size];
      }
      const index = y * size + x;
      next[index] = neighbors === 3 || (current[index] === 1 && neighbors === 2) ? 1 : 0;
    }
  }
}

export class PondLife {
  cells = new Uint8Array(LIFE_SIZE * LIFE_SIZE);
  private next = new Uint8Array(LIFE_SIZE * LIFE_SIZE);
  private energy = new Float32Array(LIFE_SIZE * LIFE_SIZE);
  private accumulator = 0;
  private quiet = 0;
  field = new Float32Array(LIFE_SIZE * LIFE_SIZE);
  pixels = new Uint8Array(LIFE_SIZE * LIFE_SIZE);
  births = new Uint16Array(LIFE_SIZE * LIFE_SIZE);
  birthCount = 0;
  generation = 0;
  reseeds = 0;

  constructor() {
    for (const [x, y, rotation] of [[3, 3, 0], [21, 6, 1], [8, 19, 2], [20, 22, 3], [13, 12, 0]]) this.seed(x, y, rotation);
    for (const [x, y] of [[15, 5], [16, 5], [14, 6], [15, 6], [15, 7]]) this.cells[y * LIFE_SIZE + x] = 1;
    this.updateField();
  }

  private seed(x: number, y: number, rotation: number) {
    for (const [dx, dy] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) {
      let px = dx - 1, py = dy - 1;
      for (let turn = 0; turn < rotation; turn++) { const nextX = -py; py = px; px = nextX; }
      this.cells[((y + py + LIFE_SIZE) % LIFE_SIZE) * LIFE_SIZE + (x + px + LIFE_SIZE) % LIFE_SIZE] = 1;
    }
  }

  disturb(x: number, y: number) {
    this.seed(Math.floor(x * LIFE_SIZE), Math.floor(y * LIFE_SIZE), this.generation % 4);
    this.updateField();
  }

  advance(dt: number) {
    this.accumulator += dt;
    this.birthCount = 0;
    if (this.accumulator < LIFE_INTERVAL) return false;
    this.accumulator -= LIFE_INTERVAL;
    stepLife(this.cells, this.next, LIFE_SIZE);
    let population = 0, changed = 0;
    for (let index = 0; index < this.cells.length; index++) {
      population += this.next[index];
      if (this.next[index] !== this.cells[index]) changed++;
      if (this.next[index] && !this.cells[index]) this.births[this.birthCount++] = index;
    }
    const previous = this.cells;
    this.cells = this.next;
    this.next = previous;
    this.generation++;
    this.quiet = changed === 0 ? this.quiet + 1 : 0;
    if (population < 6 || this.quiet >= 8) {
      this.seed(3 + (this.generation * 7) % 22, 3 + (this.generation * 11) % 22, this.generation % 4);
      this.quiet = 0;
      this.reseeds++;
    }
    this.updateField();
    return true;
  }

  private updateField() {
    for (let index = 0; index < this.cells.length; index++) this.energy[index] = this.energy[index] * 0.55 + this.cells[index] * 0.45;
    const weights = [1, 4, 6, 4, 1];
    for (let y = 0; y < LIFE_SIZE; y++) for (let x = 0; x < LIFE_SIZE; x++) {
      let total = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) total += this.energy[((y + dy + LIFE_SIZE) % LIFE_SIZE) * LIFE_SIZE + (x + dx + LIFE_SIZE) % LIFE_SIZE] * weights[dx + 2] * weights[dy + 2];
      const value = Math.min(1, total / 128);
      this.field[y * LIFE_SIZE + x] = value;
      this.pixels[y * LIFE_SIZE + x] = Math.round(value * 255);
    }
  }

  sample(x: number, y: number) {
    const px = Math.max(0, Math.min(LIFE_SIZE - 1.001, x * (LIFE_SIZE - 1)));
    const py = Math.max(0, Math.min(LIFE_SIZE - 1.001, y * (LIFE_SIZE - 1)));
    const ix = Math.floor(px), iy = Math.floor(py), tx = px - ix, ty = py - iy;
    const a = this.field[iy * LIFE_SIZE + ix] * (1 - tx) + this.field[iy * LIFE_SIZE + ix + 1] * tx;
    const b = this.field[(iy + 1) * LIFE_SIZE + ix] * (1 - tx) + this.field[(iy + 1) * LIFE_SIZE + ix + 1] * tx;
    return a * (1 - ty) + b * ty;
  }
}

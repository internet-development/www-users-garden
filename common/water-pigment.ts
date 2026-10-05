const SIZE = 2048;
const PIGMENTS = [
  '#3e718a', '#377982', '#488f84', '#589798', '#5383ac', '#728fc5',
  '#7d9fca', '#9bafd9', '#b2b5dc', '#a2a1cf', '#809ac7', '#76a5ae',
  '#adcbd2', '#c4d6d4', '#b2cbc0', '#d0d3b9', '#578d93', '#3e788b',
];

export function createWaterPigment(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to prepare the painted water.');
  let seed = 187409;
  const random = () => {
    seed = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
    return (seed >>> 0) / 4294967296;
  };
  context.fillStyle = '#789cab';
  context.fillRect(0, 0, SIZE, SIZE);
  for (let stroke = 0; stroke < 6200; stroke++) {
    const x = random() * SIZE, y = random() * SIZE;
    const length = 35 + random() * 185;
    const width = 10 + random() * 34;
    const angle = (random() - 0.5) * 0.7;
    const bend = (random() - 0.5) * width * 1.6;
    const pigment = PIGMENTS[Math.floor(random() * PIGMENTS.length)]!;
    const opacity = 0.4 + random() * 0.55;
    const bristles = 5 + Math.floor(random() * 7);
    const margin = length + width;
    const offsetsX = [0], offsetsY = [0];
    if (x < margin) offsetsX.push(SIZE);
    if (x > SIZE - margin) offsetsX.push(-SIZE);
    if (y < margin) offsetsY.push(SIZE);
    if (y > SIZE - margin) offsetsY.push(-SIZE);
    const strands = Array.from({ length: bristles }, () => ({
      start: random() * length * 0.2,
      end: random() * length * 0.25,
      opacity: 0.35 + random() * 0.65,
    }));
    const edges = Array.from({ length: 9 }, (_, index) => {
      const t = index / 8;
      const taper = 0.55 + Math.sin(t * Math.PI) * 0.45;
      return { x: (t - 0.5) * length, y: 2 * bend * t * (1 - t),
        top: width * taper * (0.22 + random() * 0.24),
        bottom: width * taper * (0.22 + random() * 0.24) };
    });
    for (const ox of offsetsX) for (const oy of offsetsY) {
      context.save();
      context.translate(x + ox, y + oy);
      context.rotate(angle);
      context.strokeStyle = pigment;
      context.fillStyle = pigment;
      context.lineCap = 'butt';
      context.globalAlpha = opacity * 0.72;
      context.beginPath();
      context.moveTo(edges[0]!.x, edges[0]!.y - edges[0]!.top);
      for (const edge of edges) context.lineTo(edge.x, edge.y - edge.top);
      for (let index = edges.length - 1; index >= 0; index--) {
        const edge = edges[index]!;
        context.lineTo(edge.x, edge.y + edge.bottom);
      }
      context.closePath();
      context.fill();
      context.lineWidth = width / bristles * 0.8;
      for (let bristle = 0; bristle < bristles; bristle++) {
        const strand = strands[bristle]!;
        const offset = (bristle / (bristles - 1) - 0.5) * width;
        context.globalAlpha = opacity * strand.opacity;
        context.beginPath();
        context.moveTo(-length * 0.5 + strand.start, offset);
        context.quadraticCurveTo(0, bend + offset, length * 0.5 - strand.end, offset);
        context.stroke();
      }
      context.restore();
    }
  }
  const pixels = context.getImageData(0, 0, SIZE, SIZE);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const grain = (random() + random() - 1) * 5;
    const relief = pixels.data[index]! * 0.22 + pixels.data[index + 1]! * 0.55 + pixels.data[index + 2]! * 0.23;
    pixels.data[index] += grain;
    pixels.data[index + 1] += grain;
    pixels.data[index + 2] += grain;
    pixels.data[index + 3] = 100 + relief * 0.52 + grain * 1.4;
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

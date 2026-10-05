const FOLIAGE = ['#718857', '#84985f', '#a6ad6c', '#637b63', '#587971', '#749186', '#8c9b82', '#63758d', '#9a9eb0', '#b8ba8a', '#536d65', '#8c9270'];
const BARK = ['#ae997e', '#bfa58b', '#94869b', '#c0b498', '#897965'];

export function createWaterTrees(leaf: CanvasImageSource, bark: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to paint the tree line.');
  let seed = 49280;
  const random = () => {
    seed += 0x6d2b79f5;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const sky = context.createLinearGradient(0, 0, 0, 768);
  sky.addColorStop(0, '#bdcbd7');
  sky.addColorStop(0.62, '#d9d9db');
  sky.addColorStop(1, '#bbc4b9');
  context.fillStyle = sky;
  context.fillRect(0, 0, 2048, 768);
  context.globalAlpha = 0.055;
  context.drawImage(bark, 0, 0, 2048, 768);
  context.globalAlpha = 1;

  context.save();
  context.beginPath();
  context.moveTo(0, 768);
  for (let x = 0; x <= 2048; x += 8) {
    context.lineTo(x, 364 + Math.sin(x * 0.009) * 35 + Math.sin(x * 0.027 + 0.7) * 18);
  }
  context.lineTo(2048, 768);
  context.closePath();
  context.fillStyle = '#657b68';
  context.fill();
  context.clip();
  context.globalAlpha = 0.42;
  context.drawImage(leaf, 0, 276, 2048, 520);
  context.globalAlpha = 0.28;
  context.globalCompositeOperation = 'multiply';
  context.fillStyle = '#8c9972';
  context.fillRect(0, 276, 2048, 520);
  context.restore();

  function crown(x: number, y: number, width: number, height: number, pigment: string, count: number, distant: boolean, phase: number) {
    context!.save();
    context!.beginPath();
    for (let index = 0; index <= 48; index++) {
      const angle = index / 48 * Math.PI * 2;
      const lobe = 1 + Math.sin(angle * 7 + phase) * 0.075 + Math.sin(angle * 13 - phase) * 0.04;
      const px = x + Math.cos(angle) * width * lobe;
      const py = y + Math.sin(angle) * height * lobe;
      if (index === 0) context!.moveTo(px, py);
      else context!.lineTo(px, py);
    }
    context!.closePath();
    context!.fillStyle = pigment;
    context!.fill();
    context!.clip();
    context!.globalAlpha = distant ? 0.47 : 0.57;
    context!.drawImage(leaf, x - width, y - height, width * 2, height * 2);
    context!.globalCompositeOperation = 'multiply';
    context!.globalAlpha = 0.26;
    context!.fillStyle = pigment;
    context!.fillRect(x - width * 1.2, y - height * 1.2, width * 2.4, height * 2.4);
    context!.restore();

    for (let index = 0; index < count; index++) {
      const vertical = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(1 - vertical * vertical);
      const nx = Math.cos(angle) * radius;
      const nz = Math.sin(angle) * radius;
      const lobe = 1 + Math.sin(nx * 7 + phase) * Math.cos(vertical * 9 + nz * 5) * 0.13 + Math.sin(nz * 11 - nx * 4 + phase) * 0.07;
      const px = x + nx * width * lobe;
      const py = y + vertical * height * lobe + nz * height * 0.12;
      const size = (3 + random() * 5) * (distant ? 0.85 : 1);
      context!.globalAlpha = 0.38 + random() * 0.4;
      context!.fillStyle = FOLIAGE[(Math.floor(random() * 8) + Math.floor(phase)) % FOLIAGE.length];
      context!.beginPath();
      context!.moveTo(px - size * 0.45, py - size * 0.6);
      context!.lineTo(px + size * 0.2, py - size * 0.85);
      context!.lineTo(px + size * 0.55, py + size * 0.15);
      context!.lineTo(px + size * 0.1, py + size * 0.8);
      context!.lineTo(px - size * 0.55, py + size * 0.3);
      context!.fill();
    }
    context!.globalAlpha = 1;
  }

  const layers = [
    { count: 14, base: 595, height: 478, leaves: 480, haze: 0.32 },
    { count: 18, base: 662, height: 506, leaves: 800, haze: 0.16 },
    { count: 22, base: 726, height: 520, leaves: 1600, haze: 0 },
  ];
  for (let layer = 0; layer < layers.length; layer++) {
    const recipe = layers[layer];
    for (let index = 0; index < recipe.count; index++) {
      const x = (index + 0.2 + random() * 0.6) / recipe.count * 2228 - 90;
      const base = recipe.base + Math.sin(x * 0.004 + 0.7) * 12;
      const height = recipe.height * (0.76 + random() * 0.29);
      const width = height * (0.13 + random() * 0.05);
      const lean = (random() - 0.5) * height * 0.14;
      context.strokeStyle = BARK[index % BARK.length];
      context.lineWidth = height * 0.019;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(x, base);
      context.bezierCurveTo(x + lean * 0.3, base - height * 0.4, x + lean * 0.7, base - height * 0.8, x + lean, base - height);
      context.stroke();
      for (let branch = 0; branch < 8; branch++) {
        const t = 0.3 + branch / 8 * 0.54;
        context.lineWidth = height * 0.0045;
        context.beginPath();
        context.moveTo(x + lean * t, base - height * t);
        context.quadraticCurveTo(x + Math.cos(branch * 2.39996 + index) * width * 0.55, base - height * (t + 0.05), x + lean * t + Math.cos(branch * 2.39996 + index) * width * 0.8, base - height * (t + 0.16));
        context.stroke();
      }
      for (let lobe = 0; lobe < 5; lobe++) {
        const t = 0.42 + lobe * 0.12;
        crown(x + lean * t + Math.sin(t * 19 + index) * width * 0.18, base - height * t, width * (lobe === 2 ? 0.94 : lobe === 4 ? 0.65 : 0.83), height * 0.17, FOLIAGE[(index * 3 + 4 + layer) % FOLIAGE.length], recipe.leaves / 5, layer < 2, index * 5 + lobe + layer * 13);
      }
    }
    if (recipe.haze) {
      context.fillStyle = `rgba(171, 181, 185, ${recipe.haze})`;
      context.fillRect(0, 0, 2048, 768);
    }
  }
  for (let index = 0; index < 108; index++) {
    const x = (index % 54) / 53 * 2048;
    const size = index < 54 ? 48 + random() * 42 : 12 + random() * 18;
    const y = index < 54 ? 713 : 750;
    crown(x, y + Math.sin(x * 0.006) * 5, size * 1.2, size * 0.5, FOLIAGE[(index + 4) % FOLIAGE.length], 160, false, index + 128);
  }
  return canvas;
}

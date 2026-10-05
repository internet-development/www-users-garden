import { createWaterPigment } from '@common/water-pigment';
import { createWaterTrees } from '@common/water-trees';
import { KOI_COUNT, KoiSchool } from '@common/water-koi';
import { LIFE_SIZE, PondLife } from '@common/pond-life';
import { LILY_PATCHES, POND_PAD_COUNT, POND_FLOWER_COUNT, updatePondLayout } from '@common/pond-layout';
import { createLilyGeometry, lilyVertexSource, lilyFragmentSource } from '@common/water-lilies';
import { waterSurfaceSource } from '@common/water-surface';

// NOTE(angel) Heightfield integration and cosine drops adapted from Evan Wallace's MIT-licensed WebGL Water (2011). See THIRD_PARTY_NOTICES.md.
const vertexSource = `#version 300 es
in vec2 position;
out vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const simulationSource = `#version 300 es
precision highp float;
uniform sampler2D water;
uniform vec2 drop;
uniform float strength;
uniform float advance;
in vec2 uv;
out vec4 result;
void main() {
  vec2 d = 1.0 / vec2(textureSize(water, 0));
  vec2 state = texture(water, uv).rg;
  float average = (texture(water, uv + vec2(d.x, 0.0)).r + texture(water, uv - vec2(d.x, 0.0)).r + texture(water, uv + vec2(0.0, d.y)).r + texture(water, uv - vec2(0.0, d.y)).r) * 0.25;
  state.g = mix(state.g, (state.g + (average - state.r) * 2.0) * 0.994, advance);
  state.r += state.g * advance;
  float radius = max(0.0, 1.0 - length(uv - drop) / 0.045);
  state.r += (0.5 - cos(radius * 3.14159265) * 0.5) * strength;
  result = vec4(state, 0.0, 1.0);
}`;

export function createWater(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: true, depth: true, powerPreference: 'low-power' });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) throw new Error('Water rendering is unavailable.');
  const programs: WebGLProgram[] = [];
  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  const shaders: WebGLShader[] = [];
  const buffer = gl.createBuffer();
  const quad = gl.createVertexArray();
  const lilyArray = gl.createVertexArray();
  const lilyVertices = gl.createBuffer();
  const lilyIndices = gl.createBuffer();
  const controller = new AbortController();
  const bitmaps = new Set<ImageBitmap>();
  const patches = new Float32Array(LILY_PATCHES.flat());
  const koi = new Float32Array(KOI_COUNT * 4);
  const pads = new Float32Array(POND_PAD_COUNT * 4);
  const flowers = new Float32Array(POND_FLOWER_COUNT * 4);
  const life = new PondLife();
  updatePondLayout(0, patches, pads, flowers);
  const school = new KoiSchool(pads);
  school.update(0, life, pads, koi);
  let lifeDirty = true;
  let dynamicsAccumulator = 0;
  let dynamicsTime = 0;
  let assetsReady = false;
  let koiReady = false;
  let lilyIndexCount = 0;
  let animation = 0;
  let disposed = false;
  let paused = false;
  let visible = true;
  let previous = 0;
  let elapsed = 0;
  let lastDrop = 0;
  let lastPointer = 0;
  let lastLilyWake = 0;
  let current = 0;

  function release() {
    cancelAnimationFrame(animation);
    controller.abort();
    bitmaps.forEach((bitmap) => bitmap.close());
    bitmaps.clear();
    programs.forEach((value) => gl!.deleteProgram(value));
    shaders.forEach((value) => gl!.deleteShader(value));
    textures.forEach((value) => gl!.deleteTexture(value));
    framebuffers.forEach((value) => gl!.deleteFramebuffer(value));
    gl!.deleteBuffer(buffer);
    gl!.deleteBuffer(lilyVertices);
    gl!.deleteBuffer(lilyIndices);
    gl!.deleteVertexArray(quad);
    gl!.deleteVertexArray(lilyArray);
  }

  function program(fragment: string, vertex = vertexSource) {
    const result = gl!.createProgram();
    if (!result) throw new Error('Unable to allocate water program.');
    programs.push(result);
    for (const [type, source] of [[gl!.VERTEX_SHADER, vertex], [gl!.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error('Unable to allocate water shader.');
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error('Unable to compile water shader.');
      gl!.attachShader(result, shader);
    }
    gl!.bindAttribLocation(result, 0, 'position');
    gl!.linkProgram(result);
    if (!gl!.getProgramParameter(result, gl!.LINK_STATUS)) throw new Error('Unable to link water program.');
    return result;
  }

  let simulation: WebGLProgram;
  let surface: WebGLProgram;
  let lilies: WebGLProgram;
  let pigment: WebGLTexture;
  let leaf: WebGLTexture;
  let petal: WebGLTexture;
  let trees: WebGLTexture;
  let lifeTexture: WebGLTexture;
  let koiPainting: WebGLTexture;

  function paintingTexture() {
    const texture = gl!.createTexture();
    if (!texture) throw new Error('Unable to allocate a painted surface.');
    textures.push(texture);
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.SRGB8_ALPHA8, 1, 1, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl!.generateMipmap(gl!.TEXTURE_2D);
    return texture;
  }

  try {
    simulation = program(simulationSource);
    surface = program(waterSurfaceSource);
    lilies = program(lilyFragmentSource, lilyVertexSource);
    if (!buffer || !quad || !lilyArray || !lilyVertices || !lilyIndices) throw new Error('Unable to allocate water geometry.');
    gl.bindVertexArray(quad);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (let index = 0; index < 2; index++) {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      if (texture) textures.push(texture);
      if (framebuffer) framebuffers.push(framebuffer);
      if (!texture || !framebuffer) throw new Error('Unable to allocate water surface.');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 192, 192, 0, gl.RGBA, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Water surface is unsupported.');
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    const paintedTexture = gl.createTexture();
    if (!paintedTexture) throw new Error('Unable to allocate painted water.');
    pigment = paintedTexture;
    textures.push(pigment);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, pigment);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, createWaterPigment());
    gl.generateMipmap(gl.TEXTURE_2D);
    const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
    if (anisotropy) gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    gl.activeTexture(gl.TEXTURE2);
    leaf = paintingTexture();
    gl.activeTexture(gl.TEXTURE3);
    petal = paintingTexture();
    gl.activeTexture(gl.TEXTURE4);
    trees = paintingTexture();
    gl.activeTexture(gl.TEXTURE5);
    const fieldTexture = gl.createTexture();
    if (!fieldTexture) throw new Error('Unable to allocate pond life.');
    lifeTexture = fieldTexture;
    textures.push(lifeTexture);
    gl.bindTexture(gl.TEXTURE_2D, lifeTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, LIFE_SIZE, LIFE_SIZE, 0, gl.RED, gl.UNSIGNED_BYTE, life.pixels);
    gl.activeTexture(gl.TEXTURE6);
    koiPainting = paintingTexture();
    gl.activeTexture(gl.TEXTURE0);
  } catch (error) {
    release();
    throw error;
  }

  const dropLocation = gl.getUniformLocation(simulation, 'drop');
  const strengthLocation = gl.getUniformLocation(simulation, 'strength');
  const advanceLocation = gl.getUniformLocation(simulation, 'advance');
  const pigmentLocation = gl.getUniformLocation(surface, 'uPigment');
  const timeLocation = gl.getUniformLocation(surface, 'uTime');
  const fishTimeLocation = gl.getUniformLocation(surface, 'uFishTime');
  const koiLocation = gl.getUniformLocation(surface, 'uKoi[0]');
  const treesLocation = gl.getUniformLocation(surface, 'uTreeLine');
  const readyLocation = gl.getUniformLocation(surface, 'uAssetsReady');
  const surfacePads = gl.getUniformLocation(surface, 'uPads[0]');
  const surfaceFlowers = gl.getUniformLocation(surface, 'uFlowers[0]');
  const lifeLocation = gl.getUniformLocation(surface, 'uLife');
  const koiPaintingLocation = gl.getUniformLocation(surface, 'uKoiPaint');
  const koiReadyLocation = gl.getUniformLocation(surface, 'uKoiReady');
  const lilyPatches = gl.getUniformLocation(lilies, 'uPatches[0]');
  const leafLocation = gl.getUniformLocation(lilies, 'uLeaf');
  const petalLocation = gl.getUniformLocation(lilies, 'uPetal');

  function step(x = 0, y = 0, strength = 0, advance = 1) {
    gl!.useProgram(simulation);
    gl!.disable(gl!.DEPTH_TEST);
    gl!.bindVertexArray(quad);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, framebuffers[1 - current]);
    gl!.viewport(0, 0, 192, 192);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[current]);
    gl!.uniform2f(dropLocation, x, y);
    gl!.uniform1f(strengthLocation, strength);
    gl!.uniform1f(advanceLocation, advance);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    current = 1 - current;
  }

  function draw() {
    if (disposed || gl!.isContextLost()) return;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.disable(gl!.DEPTH_TEST);
    gl!.bindVertexArray(quad);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.useProgram(surface);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, textures[current]);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, pigment);
    gl!.uniform1i(pigmentLocation, 1);
    gl!.uniform1f(timeLocation, elapsed * 0.00006);
    gl!.activeTexture(gl!.TEXTURE4);
    gl!.bindTexture(gl!.TEXTURE_2D, trees);
    gl!.uniform1i(treesLocation, 4);
    gl!.uniform1i(readyLocation, assetsReady ? 1 : 0);
    const lifeTime = elapsed * 0.001;
    gl!.uniform4fv(koiLocation, koi);
    gl!.uniform1f(fishTimeLocation, lifeTime);
    gl!.uniform4fv(surfacePads, pads);
    gl!.uniform4fv(surfaceFlowers, flowers);
    gl!.activeTexture(gl!.TEXTURE5);
    gl!.bindTexture(gl!.TEXTURE_2D, lifeTexture);
    if (lifeDirty) {
      gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, 0, LIFE_SIZE, LIFE_SIZE, gl!.RED, gl!.UNSIGNED_BYTE, life.pixels);
      lifeDirty = false;
    }
    gl!.uniform1i(lifeLocation, 5);
    gl!.activeTexture(gl!.TEXTURE6);
    gl!.bindTexture(gl!.TEXTURE_2D, koiPainting);
    gl!.uniform1i(koiPaintingLocation, 6);
    gl!.uniform1i(koiReadyLocation, koiReady ? 1 : 0);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (assetsReady) {
      gl!.clear(gl!.DEPTH_BUFFER_BIT);
      gl!.enable(gl!.DEPTH_TEST);
      gl!.depthFunc(gl!.LEQUAL);
      gl!.bindVertexArray(lilyArray);
      gl!.useProgram(lilies);
      gl!.activeTexture(gl!.TEXTURE2);
      gl!.bindTexture(gl!.TEXTURE_2D, leaf);
      gl!.activeTexture(gl!.TEXTURE3);
      gl!.bindTexture(gl!.TEXTURE_2D, petal);
      gl!.uniform1i(leafLocation, 2);
      gl!.uniform1i(petalLocation, 3);
      gl!.uniform4fv(lilyPatches, patches);
      gl!.drawElements(gl!.TRIANGLES, lilyIndexCount, gl!.UNSIGNED_INT, 0);
      gl!.disable(gl!.DEPTH_TEST);
    }
  }

  function resize() {
    const size = Math.min(900, Math.max(1, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5))));
    canvas.width = size;
    canvas.height = Math.round(size * canvas.clientHeight / Math.max(1, canvas.clientWidth));
    draw();
  }

  function tick(time: number) {
    animation = 0;
    if (disposed || paused || !visible || document.hidden) return;
    if (time - previous >= 1000 / 30) {
      const delta = Math.min(time - previous, 50);
      previous = time;
      elapsed += delta;
      dynamicsAccumulator += delta * 0.001;
      while (dynamicsAccumulator >= 1 / 60) {
        dynamicsAccumulator -= 1 / 60;
        dynamicsTime += 1 / 60;
        updatePondLayout(dynamicsTime, patches, pads, flowers);
        if (life.advance(1 / 60)) {
          lifeDirty = true;
          const stride = Math.max(1, Math.floor(life.birthCount / 3));
          for (let index = 0; index < life.birthCount && index < stride * 3; index += stride) {
            const cell = life.births[index];
            step((cell % LIFE_SIZE + 0.5) / LIFE_SIZE, (Math.floor(cell / LIFE_SIZE) + 0.5) / LIFE_SIZE, 0.002, 0);
          }
        }
        school.update(1 / 60, life, pads, koi);
      }
      if (elapsed - lastDrop > 2800) {
        lastDrop = elapsed;
        step(0.5 + Math.sin(elapsed * 0.00043) * 0.32, 0.5 + Math.cos(elapsed * 0.00031) * 0.32, 0.013, 0);
      }
      if (assetsReady && elapsed - lastLilyWake > 1400) {
        lastLilyWake = elapsed;
        for (let index = 0; index < LILY_PATCHES.length; index++) step(patches[index * 4], patches[index * 4 + 1], -0.0008, 0);
      }
      for (let index = 0; index < 4; index++) step();
      draw();
    }
    animation = requestAnimationFrame(tick);
  }

  function schedule() {
    cancelAnimationFrame(animation);
    previous = performance.now();
    animation = !disposed && !paused && visible && !document.hidden ? requestAnimationFrame(tick) : 0;
  }

  function ripple(x = 0.48, y = 0.52) {
    if (disposed || gl!.isContextLost()) return;
    life.disturb(x, y);
    lifeDirty = true;
    step(x, y, 0.025, 0);
    if (paused) for (let index = 0; index < 12; index++) step();
    draw();
  }

  function pointer(event: PointerEvent) {
    if (event.type === 'pointermove' && (!event.buttons || performance.now() - lastPointer < 45)) return;
    lastPointer = performance.now();
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = 1 - (event.clientY - bounds.top) / bounds.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    ripple(x, y);
  }

  step(0.32, 0.61, 0.028, 0);
  step(0.69, 0.36, -0.022, 0);
  for (let index = 0; index < 45; index++) step();
  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    schedule();
  });
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  canvas.addEventListener('pointerdown', pointer);
  canvas.addEventListener('pointermove', pointer);
  document.addEventListener('visibilitychange', schedule);
  resize();
  schedule();

  async function loadPainting(path: string) {
    const response = await fetch(path, { signal: controller.signal });
    if (!response.ok) throw new Error('Unable to load a painted surface.');
    const bitmap = await createImageBitmap(await response.blob(), { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
    if (disposed) { bitmap.close(); throw new Error('Water frame was removed.'); }
    bitmaps.add(bitmap);
    return bitmap;
  }

  const ready = Promise.allSettled([loadPainting('/artwork/lily-pad-monet.png'), loadPainting('/artwork/lily-petal-monet.png'), loadPainting('/artwork/koi-monet-atlas.png')]).then((images) => {
    if (disposed || gl.isContextLost()) return false;
    const leafImage = images[0], petalImage = images[1];
    if (leafImage.status !== 'fulfilled' || petalImage.status !== 'fulfilled') return false;
    try {
      const treePainting = createWaterTrees(leafImage.value, petalImage.value);
      const geometry = createLilyGeometry();
      for (const [unit, texture, source] of [[2, leaf, leafImage.value], [3, petal, petalImage.value], [4, trees, treePainting]] as const) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      const koiImage = images[2];
      if (koiImage.status === 'fulfilled') {
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D, koiPainting);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, koiImage.value);
        gl.generateMipmap(gl.TEXTURE_2D);
        koiReady = true;
      }
      gl.bindVertexArray(lilyArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, lilyVertices);
      gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lilyIndices);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
      for (const [index, size, offset] of [[0, 3, 0], [1, 3, 3], [2, 2, 6], [3, 3, 8], [4, 1, 11], [5, 1, 12]]) {
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, size, gl.FLOAT, false, 13 * 4, offset * 4);
      }
      lilyIndexCount = geometry.indices.length;
      assetsReady = true;
      draw();
      return koiReady;
    } catch {
      return false;
    }
  }).finally(() => {
    bitmaps.forEach((bitmap) => bitmap.close());
    bitmaps.clear();
  });

  return {
    ready,
    ripple,
    setPaused(value: boolean) { paused = value; schedule(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointerdown', pointer);
      canvas.removeEventListener('pointermove', pointer);
      document.removeEventListener('visibilitychange', schedule);
      release();
    },
  };
}

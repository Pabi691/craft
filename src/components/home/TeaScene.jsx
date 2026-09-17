import { useEffect, useRef } from 'react';
import { FRAGMENT, SCENE, VERTEX } from './teaSceneShader';

// Render scale steps: drop resolution if the device can't hold ~30 fps, and
// hand back to the still photo if even the lowest step is too slow.
const QUALITY = [1, 0.75, 0.5];
const INTRO_MS = 4200;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
  }
  return shader;
}

function texture(gl, unit, source, raw) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // The control map is data, not colour: no colour management, no premultiply.
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, raw ? gl.NONE : gl.BROWSER_DEFAULT_WEBGL);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return tex;
}

/**
 * Canvas that plays the tea cinemagraph over the hero frame.
 *   image     — the loaded hero <img> (reused as the texture, no refetch)
 *   frameRef  — the .hero-frame box the photo is fitted to
 *   startAt   — performance.now() time the opening shot may begin
 *   skipIntro — start mid-scene (the still is already showing)
 *   pointerX/Y, scroll — framer-motion values read every frame
 * Calls onReady after the first frame and onFail if WebGL can't carry it.
 */
export default function TeaScene({ image, mapSrc, frameRef, startAt, skipIntro, pointerX, pointerY, scroll, onReady, onFail }) {
  const canvasRef = useRef(null);
  const callbacks = useRef({ onReady, onFail });
  callbacks.current = { onReady, onFail };
  const live = useRef({ pointerX, pointerY, scroll, startAt, skipIntro });
  live.current = { pointerX, pointerY, scroll, startAt, skipIntro };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) {
      callbacks.current.onFail();
      return undefined;
    }

    let disposed = false;
    let raf = 0;
    let level = 0;
    let uniforms = {};
    let resizeObserver;
    let visibilityObserver;
    const fail = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      callbacks.current.onFail();
    };
    const onContextLost = (e) => {
      e.preventDefault();
      fail();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const measure = () => {
      const c = canvas.getBoundingClientRect();
      const f = frameRef.current?.getBoundingClientRect();
      if (!c.width || !c.height || !f?.width) return;
      // No point rendering finer than the photo itself.
      const scale = Math.min(window.devicePixelRatio || 1, (SCENE.size[0] * 1.25) / f.width) * QUALITY[level];
      canvas.width = Math.max(1, Math.round(c.width * scale));
      canvas.height = Math.max(1, Math.round(c.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uCanvas, c.width, c.height);
      gl.uniform2f(uniforms.uFrameOrigin, f.left - c.left, f.top - c.top);
      gl.uniform2f(uniforms.uFrameSize, f.width, f.height);
    };

    const start = async () => {
      const map = new Image();
      await new Promise((resolve, reject) => {
        map.onload = resolve;
        map.onerror = () => reject(new Error(`Could not load ${mapSrc}`));
        map.src = mapSrc;
      });
      if (disposed) return;

      const program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Link failed');
      gl.useProgram(program);

      // One triangle covering the screen.
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const names = ['uImage', 'uMap', 'uCanvas', 'uFrameOrigin', 'uFrameSize', 'uImgSize', 'uTime', 'uIntro', 'uScroll', 'uPointer', 'uFocus', 'uSurfC', 'uSurfR', 'uImpact', 'uStreamTop', 'uStreamBot'];
      uniforms = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)]));

      texture(gl, 0, image, false);
      texture(gl, 1, map, true);
      gl.uniform1i(uniforms.uImage, 0);
      gl.uniform1i(uniforms.uMap, 1);
      gl.uniform2f(uniforms.uImgSize, SCENE.size[0], SCENE.size[1]);
      gl.uniform2f(uniforms.uFocus, ...SCENE.focus);
      gl.uniform2f(uniforms.uSurfC, ...SCENE.surfaceCenter);
      gl.uniform2f(uniforms.uSurfR, ...SCENE.surfaceRadius);
      gl.uniform2f(uniforms.uImpact, ...SCENE.impact);
      gl.uniform2f(uniforms.uStreamTop, ...SCENE.streamTop);
      gl.uniform2f(uniforms.uStreamBot, ...SCENE.streamBottom);

      measure();
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(canvas);

      const t0 = performance.now();
      const begin = live.current.skipIntro ? t0 - INTRO_MS : Math.max(live.current.startAt, t0);
      let ready = false;
      let running = false;
      let last = 0;
      let samples = [];

      const frame = (now) => {
        if (disposed) return;
        raf = requestAnimationFrame(frame);
        const m = live.current;
        gl.uniform1f(uniforms.uTime, ((now - t0) / 1000) % 3600);
        gl.uniform1f(uniforms.uIntro, Math.min(1, Math.max(0, (now - begin) / INTRO_MS)));
        gl.uniform1f(uniforms.uScroll, m.scroll.get());
        gl.uniform2f(uniforms.uPointer, m.pointerX.get(), m.pointerY.get());
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (!ready) {
          ready = true;
          callbacks.current.onReady();
        }

        // Frame-time watchdog (ignores gaps from tab switches).
        const dt = now - last;
        last = now;
        if (dt > 0 && dt < 250) samples.push(dt);
        if (samples.length === 90) {
          const avg = samples.slice(30).reduce((a, b) => a + b, 0) / 60;
          samples = [];
          if (avg > 34) {
            if (level === QUALITY.length - 1) fail();
            else {
              level += 1;
              measure();
            }
          }
        }
      };

      const play = () => {
        if (running || disposed) return;
        running = true;
        last = performance.now();
        samples = [];
        raf = requestAnimationFrame(frame);
      };
      const pause = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
      visibilityObserver.observe(canvas);
      play();
    };

    start().catch((err) => {
      console.warn('Hero scene fell back to the still photo:', err);
      fail();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // The scene is built once per photo; live values are read through refs.
  }, [image, mapSrc, frameRef]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />;
}

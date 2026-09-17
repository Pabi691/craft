// WebGL cinemagraph for the home hero: the photo's own pixels are moved —
// the pour flows, the tea surface ripples, the real steam drifts upward, the
// leaves stir, and a slow virtual camera pushes in with depth parallax.
//
// Everything here is measured from /hero/tea-ritual.jpg (1819×749). Its
// control map /hero/tea-ritual-map.png holds R = pour, G = steam,
// B = depth (near = bright), A = 255 − 55 × leaf. Replace the photo and the
// map and these numbers must be re-measured together.

const W = 1819;
const H = 749;
const unit = (x, y) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};

export const SCENE = {
  size: [W, H],
  focus: [0.69, 0.5],
  surfaceCenter: [1265 / W, 373 / H],
  surfaceRadius: [165 / W, 22 / H],
  impact: [1290 / W, 382 / H],
  // Direction of the pour near the spout and where it meets the tea (px).
  streamTop: unit(-29, 106),
  streamBottom: unit(-13, 86),
};

export const VERTEX = `
attribute vec2 aPos;
varying vec2 vScreen;
void main() {
  vScreen = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D uImage;
uniform sampler2D uMap;
uniform vec2 uCanvas;       // CSS px
uniform vec2 uFrameOrigin;  // photo frame's top-left inside the canvas, CSS px
uniform vec2 uFrameSize;    // photo frame size, CSS px
uniform vec2 uImgSize;      // photo px
uniform float uTime;
uniform float uIntro;       // 0 → 1 over the opening shot
uniform float uScroll;      // 0 → 1 as the hero scrolls away
uniform vec2 uPointer;      // -1 → 1, smoothed
uniform vec2 uFocus;
uniform vec2 uSurfC;
uniform vec2 uSurfR;
uniform vec2 uImpact;
uniform vec2 uStreamTop;
uniform vec2 uStreamBot;

varying vec2 vScreen;

float gBlur;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// Photo sample; during the opening it is defocused (a rack focus).
vec3 img(vec2 p) {
  p = clamp(p, vec2(0.001), vec2(0.999));
  if (gBlur < 0.1) return texture2D(uImage, p).rgb;
  vec2 px = gBlur / uImgSize;
  vec3 c = texture2D(uImage, p).rgb * 0.2;
  c += texture2D(uImage, p + vec2(1.0, 0.0) * px).rgb * 0.1;
  c += texture2D(uImage, p - vec2(1.0, 0.0) * px).rgb * 0.1;
  c += texture2D(uImage, p + vec2(0.0, 1.0) * px).rgb * 0.1;
  c += texture2D(uImage, p - vec2(0.0, 1.0) * px).rgb * 0.1;
  c += texture2D(uImage, p + vec2(0.7, 0.7) * px).rgb * 0.1;
  c += texture2D(uImage, p - vec2(0.7, 0.7) * px).rgb * 0.1;
  c += texture2D(uImage, p + vec2(0.7, -0.7) * px).rgb * 0.1;
  c += texture2D(uImage, p - vec2(0.7, -0.7) * px).rgb * 0.1;
  return c;
}

float depthAt(vec2 p) {
  return texture2D(uMap, clamp(p, vec2(0.001), vec2(0.999))).b;
}

// Virtual camera: near layers scale and slide more than far ones.
vec2 camera(vec2 uv, float d, float zoom, vec2 shift) {
  float k = d - 0.35;
  vec2 p = uFocus + (uv - uFocus) / (zoom * (1.0 + 0.035 * k));
  return p + shift * k;
}

void main() {
  vec2 uv = (vScreen * uCanvas - uFrameOrigin) / uFrameSize;
  float t = uTime;
  float ease = 1.0 - pow(1.0 - uIntro, 3.0);
  gBlur = (1.0 - smoothstep(0.0, 0.7, uIntro)) * 7.0;

  // Opening push from wide, then a slow 26 s breathing dolly; scrolling
  // pushes further in and tilts down.
  float zoom = mix(1.16, 1.06, ease) + 0.018 * (0.5 - 0.5 * cos(t * 0.2417)) + uScroll * 0.07;
  vec2 drift = vec2(sin(t * 0.13), sin(t * 0.083 + 1.7)) * vec2(0.0035, 0.0025);
  vec2 shift = drift + uPointer * vec2(0.009, 0.006) + vec2(0.0, uScroll * 0.02);

  vec2 p = camera(uv, 0.35, zoom, shift);
  p = camera(uv, depthAt(p), zoom, shift);
  p = camera(uv, depthAt(p), zoom, shift);
  p = clamp(p, vec2(0.001), vec2(0.999));

  vec4 m = texture2D(uMap, p);
  float stream = m.r;
  float steam = m.g;
  float leaf = (1.0 - m.a) * 4.636;
  vec2 px = p * uImgSize;
  vec2 q = p;

  // A breeze through the leaves.
  if (leaf > 0.01) {
    vec2 sway = vec2(sin(t * 0.9 + p.y * 9.0) + 0.5 * sin(t * 1.7 + p.x * 13.0), cos(t * 0.75 + p.x * 7.0));
    q += sway * vec2(2.2, 1.4) / uImgSize * leaf;
  }

  // Dappled light on the table drifts, as if the garden outside moves.
  float table = smoothstep(0.37, 0.30, p.x) * smoothstep(0.66, 0.74, p.y);
  if (table > 0.0) {
    q += vec2(sin(t * 0.31 + p.y * 3.0), cos(t * 0.23 + p.x * 4.0)) * vec2(9.0, 4.0) / uImgSize * table;
  }

  // Rings spreading from where the pour meets the tea.
  float ripple = 0.0;
  vec2 se = (p - uSurfC) / uSurfR;
  float surf = 1.0 - smoothstep(0.72, 1.0, length(se));
  if (surf > 0.0) {
    vec2 d = (p - uImpact) / uSurfR;
    float r = length(d);
    float fall = exp(-r * 1.7);
    ripple = sin(r * 16.0 - t * 5.5) * fall * surf;
    vec2 wob = vec2(noise(px * 0.08 + t * 1.3), noise(px * 0.08 - t * 1.1 + 7.0)) - 0.5;
    float foam = exp(-r * 6.0);
    vec2 bubble = vec2(noise(px * 0.3 + t * 4.0), noise(px * 0.3 - t * 3.6 + 3.0)) - 0.5;
    q += ((d / max(r, 0.001)) * ripple * 0.03 + wob * 0.04 * fall) * uSurfR * surf;
    q += bubble * 2.5 * foam * surf / uImgSize;
  }

  vec3 col = img(q);
  col *= 1.0 + ripple * 0.07;

  // The pour: two phases slide down the stream and cross-fade, with glints
  // racing along it.
  if (stream > 0.002) {
    vec2 dirPx = normalize(mix(uStreamTop, uStreamBot, smoothstep(0.08, 0.5, p.y)));
    vec2 sidePx = vec2(dirPx.y, -dirPx.x);
    float along = dot(px, dirPx);
    float across = dot(px, sidePx);
    float ph0 = fract(t * 1.8);
    float ph1 = fract(t * 1.8 + 0.5);
    float w = abs(1.0 - 2.0 * ph0);
    float wobble = (noise(vec2(along * 0.05 - t * 9.0, 3.1)) - 0.5) * 1.0;
    vec2 base = q + sidePx * wobble / uImgSize;
    vec3 flow = mix(img(base - dirPx * ph0 * 40.0 / uImgSize), img(base - dirPx * ph1 * 40.0 / uImgSize), w);
    float glint = smoothstep(0.68, 0.95, noise(vec2(across * 0.35, along * 0.045 - t * 7.0)));
    flow += vec3(1.0, 0.85, 0.58) * glint * 0.28 * smoothstep(0.25, 0.6, dot(flow, vec3(0.333)));
    col = mix(col, flow, stream);
  }

  // The real steam rises and curls, thinned into wisps with gaps drifting
  // up through it; light shafts catch in it.
  if (steam > 0.002) {
    const float STEAM_RISE = 0.45;    // rise speed (0.45 ≈ 55 photo px per second)
    const float STEAM_DENSITY = 0.55; // 1.0 = as thick as in the photo
    vec2 sp = p * vec2(uImgSize.x / uImgSize.y, 1.0) * 6.0;
    vec2 warp = vec2(fbm(sp + vec2(0.0, t * STEAM_RISE)), fbm(sp + vec2(4.3, 1.7 + t * STEAM_RISE))) - 0.5;
    float s0 = fract(t * 0.22);
    float s1 = fract(t * 0.22 + 0.5);
    float sw = abs(1.0 - 2.0 * s0);
    vec2 base = q + warp * vec2(20.0, 8.0) * steam / uImgSize;
    vec2 up = vec2(0.0, 30.0 * steam) / uImgSize;
    vec3 flow = mix(img(base + up * s0), img(base + up * s1), sw);

    // Keep only part of the steam's glow above the dark background.
    vec3 ground = min(flow, vec3(0.13, 0.095, 0.065));
    float gaps = smoothstep(0.3, 0.72, fbm(vec2(sp.x * 2.2 + warp.x * 2.0, sp.y * 0.75 + t * STEAM_RISE)));
    flow = ground + (flow - ground) * STEAM_DENSITY * (0.55 + 0.9 * gaps);

    float shafts = smoothstep(0.35, 0.9, noise(vec2((p.x - p.y * 0.35) * 22.0, t * 0.05)));
    flow += (flow - ground) * shafts * 0.25;
    col = mix(col, flow, steam);
  }

  // Sunlight breathing as clouds pass.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float sun = 0.95 + 0.1 * noise(vec2(t * 0.06, 2.3));
  col *= mix(1.0, sun, smoothstep(0.2, 0.75, lum));

  // Film grain at 24 fps, and the fade up from black.
  col += (hash(gl_FragCoord.xy + fract(floor(t * 24.0) * 0.618) * 500.0) - 0.5) * 0.045;
  col *= smoothstep(0.0, 0.6, uIntro);

  gl_FragColor = vec4(col, 1.0);
}
`;

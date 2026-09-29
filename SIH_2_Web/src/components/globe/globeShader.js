/**
 * Raw WebGL sources for the TerraSRM hero globe.
 *
 * The globe is a procedurally shaded sphere evaluated per pixel (no textures,
 * no 3D library): a full screen quad casts a ray per pixel, intersects a unit
 * sphere and shades the surface with layered value noise. The interface labels
 * it as a procedural illustration - it is decorative artwork, not satellite
 * imagery and not model output.
 */

export const QUAD_VERTEX_SOURCE = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const GLOBE_FRAGMENT_HEADER = `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;
uniform float uSpin;
uniform float uDetail;
uniform float uFrameScale;

const float CAMERA_DISTANCE = 2.62;
const float SPHERE_RADIUS = 1.0;
const vec3  SUN_DIRECTION = vec3(-0.52, 0.38, 0.76);

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float valueNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash13(i);
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));

  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p, float octaves) {
  float amplitude = 0.5;
  float total = 0.0;
  float norm = 0.0;

  for (int i = 0; i < 5; i++) {
    if (float(i) >= octaves) break;
    total += amplitude * valueNoise(p);
    norm += amplitude;
    amplitude *= 0.5;
    p = p * 2.03 + vec3(1.7, 9.2, 4.3);
  }

  return total / max(norm, 0.0001);
}

vec3 rotateY(vec3 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

vec3 rotateX(vec3 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
`;

export const GLOBE_FRAGMENT_MAIN = `
void main() {
  vec2 pixel = 2.0 / uResolution;
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / (0.5 * min(uResolution.x, uResolution.y));
  uv.y = -uv.y;

  vec3 rayOrigin = vec3(uPointer * 0.075, CAMERA_DISTANCE);
  vec3 rayDirection = normalize(vec3(uv * uFrameScale, -1.0));

  float b = dot(rayOrigin, rayDirection);
  float c = dot(rayOrigin, rayOrigin) - SPHERE_RADIUS * SPHERE_RADIUS;
  float discriminant = b * b - c;

  // Silhouette radius measured in the same units as uv, so the limb can be
  // anti-aliased analytically (no derivatives needed in GLSL ES 1.00).
  float limbRadius = SPHERE_RADIUS / (uFrameScale * CAMERA_DISTANCE);
  float feather = max(pixel.x, pixel.y) * (1.0 / uFrameScale) * 1.25;
  float coverage = 1.0 - smoothstep(limbRadius - feather, limbRadius + feather, length(uv));

  vec3 colour = vec3(0.0);
  float alpha = 0.0;

  if (discriminant > 0.0 && coverage > 0.0) {
    float t = -b - sqrt(discriminant);
    vec3 position = rayOrigin + rayDirection * t;
    vec3 normal = normalize(position);

    // Surface coordinates rotate with the planet (slow spin, slight tilt).
    // Lighting keeps using the true geometric normal.
    vec3 surface = rotateY(normal, uSpin);
    surface = rotateX(surface, -0.38);

    float octaves = mix(2.0, 4.0, clamp(uDetail, 0.0, 1.0));
    float relief = fbm(surface * 1.62 + vec3(3.1, 1.7, 5.2), octaves);
    float basin = fbm(surface * 0.78 + vec3(9.4, 2.2, 6.6), 2.0);

    float height = relief * 0.74 + basin * 0.32;
    float land = smoothstep(0.505, 0.585, height);
    float shelf = smoothstep(0.455, 0.525, height) * (1.0 - land);
    float ridged = fbm(surface * 5.4 + vec3(21.0, 7.0, 3.0), 2.0);
    float latitude = surface.y;

    vec3 deepOcean = vec3(0.025, 0.130, 0.240);
    vec3 midOcean = vec3(0.070, 0.310, 0.400);
    vec3 shelfOcean = vec3(0.240, 0.540, 0.590);
    vec3 sand = vec3(0.710, 0.670, 0.490);
    vec3 grass = vec3(0.460, 0.590, 0.390);
    vec3 forest = vec3(0.270, 0.430, 0.310);
    vec3 rock = vec3(0.600, 0.560, 0.450);
    vec3 ice = vec3(0.937, 0.956, 0.972);

    vec3 water = mix(deepOcean, midOcean, smoothstep(0.16, 0.42, height));
    water = mix(water, shelfOcean, shelf);

    vec3 ground = mix(sand, grass, smoothstep(0.55, 0.66, height));
    ground = mix(ground, forest, smoothstep(0.63, 0.76, height));
    ground = mix(ground, rock, smoothstep(0.74, 0.86, height) * (0.45 + ridged * 0.55));

    float iceCap = smoothstep(0.68, 0.92, abs(latitude) + (height - 0.55) * 0.34);
    ground = mix(ground, ice, iceCap);
    water = mix(water, mix(ice, water, 0.25), iceCap * 0.85);

    vec3 surfaceColour = mix(water, ground, land);

    // Fine grain keeps large flat areas from banding.
    surfaceColour += (valueNoise(surface * 190.0 + uTime * 0.05) - 0.5) * 0.035;

    vec3 sun = normalize(SUN_DIRECTION);
    float daylight = smoothstep(-0.22, 0.42, dot(normal, sun));
    float ambient = 0.46 + 0.16 * (0.5 + 0.5 * latitude);
    vec3 shaded = surfaceColour * (ambient + daylight * 0.86);

    vec3 halfway = normalize(sun - rayDirection);
    float specular = pow(max(dot(normal, halfway), 0.0), 44.0);
    shaded += vec3(0.86, 0.93, 1.0) * specular * (1.0 - land) * shelf * 0.6 * daylight;

    float fresnel = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 3.0);
    shaded += vec3(0.55, 0.73, 0.96) * fresnel * 0.42 * (0.35 + daylight * 0.65);

    // Drifting cloud bands, faint enough to keep the light theme dominant.
    float clouds = fbm(surface * 3.3 + vec3(0.0, uTime * 0.014, 0.0), 3.0);
    float cloudMask = smoothstep(0.53, 0.76, clouds) * (0.34 + daylight * 0.42);
    shaded = mix(shaded, vec3(0.988, 0.996, 1.0), cloudMask * 0.72);

    colour = shaded;
    alpha = coverage;
  }

  // Soft atmospheric halo around the limb, visible against the pale page.
  float halo = max(0.0, 1.0 - (length(uv) - limbRadius) / 0.62);
  colour += vec3(0.24, 0.72, 0.88) * pow(halo, 3.0) * 0.54;
  float haloAlpha = pow(halo, 2.7) * 0.3 * (1.0 - coverage);

  gl_FragColor = vec4(colour, clamp(alpha + haloAlpha, 0.0, 1.0));
}
`;

export const GLOBE_FRAGMENT_SOURCE = `${GLOBE_FRAGMENT_HEADER}${GLOBE_FRAGMENT_MAIN}`;

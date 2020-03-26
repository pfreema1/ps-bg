#pragma glslify: inverse = require(glsl-inverse)
#pragma glslify: transpose = require(glsl-transpose)

varying vec3 vNormal;
varying vec3 fragPos;
uniform float u_time;
uniform vec2 mouse;
attribute float positionIndex;

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Any function can go here to distort p
vec3 distorted(vec3 p) {
  float speed = u_time;

  float mainWaveAmp = 0.7 * map(mouse.x, -1.0, 1.0, 0.5, 2.0);
  // main wave
  p.z += sin((speed * 2.0 + p.x) * 0.75) * mainWaveAmp;

  p.z += sin((speed + p.y) * 6.0) * 0.1;

  p.z += sin((speed + p.y) * 2.0) * 0.2 * sin((speed + p.x) * 1.5);
  return p;
}

void main() {
  /*
  vec3 transformed = vec3(position);
  float freq = 0.94;
  float amp = 0.55 * position.y;
  float phase = sin(position.x * position.y) + sin(positionIndex * position.x) * 0.002;
  float angle = (u_time * 2.0 + phase) * freq;
  transformed.z += sin(angle) * (amp);

  // recalculate normals
  vec3 objectNormal = normalize(vec3(-amp * freq * cos(angle),0.0,1.0));
  vNormal = normalMatrix * objectNormal;
  */

  //https://observablehq.com/@k9/calculating-normals-for-distorted-vertices

  float tangentFactor = 0.1;
  vec3 distortedPosition = distorted(position);
  vec3 tangent1 = orthogonal(normal);
  vec3 tangent2 = normalize(cross(normal, tangent1));
  vec3 nearby1 = position + tangent1 * tangentFactor;
  vec3 nearby2 = position + tangent2 * tangentFactor;
  vec3 distorted1 = distorted(nearby1);
  vec3 distorted2 = distorted(nearby2);

  fragPos = vec3(modelMatrix * vec4(distortedPosition, 1.0));

  vNormal = normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition,1.0);
}
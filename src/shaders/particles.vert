attribute float size;

varying vec3 vColor;
uniform float u_time;

void main() {

    vec3 transformed = vec3(position);

    transformed.y += sin(u_time + transformed.x) * 0.2;

    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

    gl_PointSize = size * ( 300.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}
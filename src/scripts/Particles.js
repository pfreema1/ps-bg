import * as THREE from 'three';
import particlesVert from '../shaders/particles.vert';
import particlesFrag from '../shaders/particles.frag';
import glslify from 'glslify';

export default class Particles {
  constructor(bgScene) {
    this.bgScene = bgScene;
    this.particleCount = 800;

    this.initParticles();
  }

  initParticles() {
    this.mat = this.setupMat();
    this.geo = this.setupGeo();
    this.mesh = new THREE.Points(this.geo, this.mat);

    this.bgScene.add(this.mesh);
  }

  setupGeo() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];
    const radius = 200;

    for (let i = 0; i < this.particleCount; i++) {
      positions.push(Math.random() * 10 - 5);
      positions.push(Math.random() * 2 - 1);
      positions.push(Math.random() * 4 - 2);

      sizes.push(2);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      'size',
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(
        THREE.DynamicDrawUsage
      )
    );

    return geometry;
  }

  setupMat() {
    const uniforms = {
      pointTexture: {
        value: new THREE.TextureLoader().load('./spark1.png')
      },
      u_time: {
        value: 0.0
      }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: glslify(particlesVert),
      fragmentShader: glslify(particlesFrag),
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    return shaderMaterial;
  }

  update(time) {
    this.mat.uniforms.u_time.value = time;

    const sizes = this.geo.attributes.size.array;

    for (let i = 0; i < this.particleCount; i++) {
      sizes[i] = 0.05 * (1 + Math.sin(3000.0 * i + time * 10.0));
    }

    this.geo.attributes.size.needsUpdate = true;
  }
}

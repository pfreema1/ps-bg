import * as THREE from 'three';
import fitPlaneToScreen from './utils/fitPlaneToScreen';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';

export default class PsPlane {
  constructor(bgScene, bgCamera) {
    this.bgScene = bgScene;
    this.bgCamera = bgCamera;

    this.initPlane();
  }

  initPlane() {
    this.geo = new THREE.PlaneBufferGeometry(
      this.returnPlaneWidth(),
      3,
      100,
      100
    );

    this.addAttributes();

    console.log(this.geo);

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: null },
        u_lightColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        u_lightPos: {
          value: new THREE.Vector3(-3.0, 1.0, 3.0)
        }
      },
      vertexShader: glslify(basicDiffuseVert),
      fragmentShader: glslify(basicDiffuseFrag),
      transparent: true,
      side: THREE.DoubleSide
    });
    // this.mat.blending = THREE.AdditiveBlending;

    this.mesh = new THREE.Mesh(this.geo, this.mat);

    this.mesh.rotation.x -= Math.PI * 0.4;
    console.log(this.mesh);

    this.bgScene.add(this.mesh);
  }

  addAttributes() {
    // add vertice index attribute
    const verticeIndexArr = [];
    const verticesLength = this.geo.attributes.position.length / 3;
    let positionIndex = 0;

    for (let i = 0; i < verticesLength; i++) {
      verticeIndexArr.push(positionIndex);
      positionIndex++;
    }

    const verticeIndex = new Float32Array(verticeIndexArr);

    this.geo.setAttribute(
      'positionIndex',
      new THREE.BufferAttribute(verticeIndex, 1)
    );
  }

  returnPlaneWidth() {
    const dim = fitPlaneToScreen(
      this.bgCamera,
      0,
      window.innerWidth,
      window.innerHeight
    );

    return dim.width + 2.0;
  }

  update(time) {
    this.mat.uniforms.u_time.value = time;
    return;

    // go through vertices and reposition them
    const targetVertice = 52;
    const farthestIndex = targetVertice / 2;

    for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {
      // current vertices distance from target vertice
      const waveIndex = Math.floor((i % targetVertice) % 6);

      if (i % targetVertice === 0) {
        let p = this.mesh.geometry.vertices[i];
        p.z += Math.sin(time) * 0.005;
      }
    }

    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.normalsNeedUpdate = true;
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}

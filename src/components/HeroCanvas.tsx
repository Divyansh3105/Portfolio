import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // ── Scene & Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5ff, 3, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9b59fc, 2, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffd700, 1.5, 15);
    pointLight3.position.set(0, 4, -2);
    scene.add(pointLight3);

    // ── Icosahedron (main mesh) ──
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat = new THREE.MeshPhongMaterial({
      color: 0x00f5ff,
      wireframe: true,
      emissive: 0x002233,
      transparent: true,
      opacity: 0.85,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(2.5, 0, 0);
    scene.add(icosahedron);

    // ── Torus Knot ──
    const torusGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 120, 12);
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0x9b59fc,
      wireframe: true,
      emissive: 0x220044,
      transparent: true,
      opacity: 0.7,
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(-2.5, 0.5, -1);
    scene.add(torusKnot);

    // ── Floating Particles ──
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Octahedron (small floating) ──
    const octaGeo = new THREE.OctahedronGeometry(0.4);
    const octaMat = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const octahedron = new THREE.Mesh(octaGeo, octaMat);
    octahedron.position.set(-1, 2, -1);
    scene.add(octahedron);

    // ── Mouse Parallax ──
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ──
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ──
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate meshes
      icosahedron.rotation.x = t * 0.3;
      icosahedron.rotation.y = t * 0.5;
      torusKnot.rotation.x = t * 0.2;
      torusKnot.rotation.y = t * 0.35;
      octahedron.rotation.y = t * 0.7;
      octahedron.rotation.x = t * 0.4;
      particles.rotation.y = t * 0.02;

      // Mouse parallax
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Floating bob
      icosahedron.position.y = Math.sin(t * 0.8) * 0.3;
      torusKnot.position.y = 0.5 + Math.sin(t * 0.6 + 1) * 0.4;
      octahedron.position.y = 2 + Math.sin(t * 1.2 + 2) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        transition: 'opacity 0.35s ease',
      }}
    />
  );
}

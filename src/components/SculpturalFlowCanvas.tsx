import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { SculpturePose } from '../utils/flowSculpture';

interface SculpturalFlowCanvasProps {
  poseRef: MutableRefObject<SculpturePose>;
}

interface FlowUniforms {
  uTime: { value: number };
  uFoldFreq: { value: number };
  uAmplitude: { value: number };
  uTwist: { value: number };
  uPhaseOffset: { value: number };
  uZBias: { value: number };
  uPointer: { value: THREE.Vector2 };
  uScrollBoost: { value: number };
}

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') ||
      probeCanvas.getContext('webgl') ||
      (probeCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '') : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererName);
  } catch {
    return false;
  }
}

const FLOW_COMMON_GLSL = /* glsl */ `
uniform float uTime;
uniform float uFoldFreq;
uniform float uAmplitude;
uniform float uTwist;
uniform float uPhaseOffset;
uniform float uZBias;
uniform vec2 uPointer;
uniform float uScrollBoost;

vec3 computeSilkPoint(vec3 p) {
  float t = uTime + uPhaseOffset;
  float freq = uFoldFreq;
  float amp = uAmplitude;

  // Primary sweeping silk fold across the horizontal manifold
  float w1 = sin(p.x * 0.42 * freq + p.y * 0.24 * freq + t * 0.65);

  // Diagonal helical counter-fold governed by chapter twist
  float diag = p.x * 0.31 - p.y * 0.54;
  float w2 = cos(diag * freq * 1.12 - t * 0.48 + p.x * uTwist * 0.22);

  // Fine satin acoustic harmonic overtone
  float w3 = sin((p.x * 0.78 + p.y * 0.62) * freq * 0.92 + t * 0.92) * 0.24;

  // Subtle architectural ridge envelope so folds crest gracefully across center-right
  float envelope = 0.72 + 0.28 * cos(p.y * 0.24);

  // Gentle pointer-reactive local billow
  vec2 ptrPos = vec2(uPointer.x * 4.2, uPointer.y * 2.6);
  float distToPtr = length(p.xy - ptrPos);
  float ptrSwell = exp(-distToPtr * distToPtr * 0.085) * 0.28;

  float zDisp = (w1 * 0.56 + w2 * 0.44 + w3) * amp * envelope + ptrSwell + uScrollBoost * 0.14 * w2;

  // Subtle in-plane lateral silk drapery shear for organic folds
  float yShear = sin(p.x * 0.28 * freq + t * 0.42) * uTwist * 0.36;
  float xShear = cos(p.y * 0.35 * freq - t * 0.36) * uTwist * 0.16;

  return vec3(p.x + xShear, p.y + yShear, p.z + zDisp + uZBias);
}
`;

function applySilkShader(
  material: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial,
  uniforms: FlowUniforms,
  cacheKey: string,
) {
  material.customProgramCacheKey = () => cacheKey;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uFoldFreq = uniforms.uFoldFreq;
    shader.uniforms.uAmplitude = uniforms.uAmplitude;
    shader.uniforms.uTwist = uniforms.uTwist;
    shader.uniforms.uPhaseOffset = uniforms.uPhaseOffset;
    shader.uniforms.uZBias = uniforms.uZBias;
    shader.uniforms.uPointer = uniforms.uPointer;
    shader.uniforms.uScrollBoost = uniforms.uScrollBoost;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${FLOW_COMMON_GLSL}`)
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `
        vec3 basePosForNormal = position;
        float eps = 0.06;
        vec3 pCenter = computeSilkPoint(basePosForNormal);
        vec3 pDx = computeSilkPoint(basePosForNormal + vec3(eps, 0.0, 0.0));
        vec3 pDy = computeSilkPoint(basePosForNormal + vec3(0.0, eps, 0.0));
        vec3 objectNormal = normalize(cross(pDx - pCenter, pDy - pCenter));
        #ifdef USE_TANGENT
          vec3 objectTangent = normalize(pDx - pCenter);
        #endif
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `
        vec3 transformed = computeSilkPoint(position);
        `,
      );
  };
}

function rgbToThreeColor(rgb: { r: number; g: number; b: number }, target: THREE.Color) {
  target.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255, THREE.SRGBColorSpace);
  return target;
}

export function SculpturalFlowCanvas({ poseRef }: SculpturalFlowCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: isSoftwareGl ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color();
    rgbToThreeColor(poseRef.current.bgRgb, bgColor);
    scene.background = bgColor;
    const fog = new THREE.FogExp2(bgColor.getHex(), 0.064);
    scene.fog = fog;

    // Studio IBL environment so silk clearcoat & metallic ribbons catch crisp highlights everywhere
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.85;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / Math.max(1, height), 0.1, 45);
    camera.position.set(poseRef.current.camX, poseRef.current.camY, poseRef.current.camZ);

    // Three-point sculptural studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xeef4ff, 0x1e293b, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ec, 1.95);
    keyLight.position.set(5.8, 6.6, 4.8);
    scene.add(keyLight);

    const backRimLight = new THREE.DirectionalLight(0xc7dcff, 1.05);
    backRimLight.position.set(-5.8, 3.8, -3.4);
    scene.add(backRimLight);

    const accentPointLight = new THREE.PointLight(0x3b82f6, 14, 18, 1.6);
    accentPointLight.position.set(4.5, 2.6, 3.6);
    scene.add(accentPointLight);

    // Composite 5-Part Sculptural Manifold Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);

    const primaryUniforms: FlowUniforms = {
      uTime: { value: 0 },
      uFoldFreq: { value: poseRef.current.foldFreq },
      uAmplitude: { value: poseRef.current.amplitude },
      uTwist: { value: poseRef.current.twist },
      uPhaseOffset: { value: 0 },
      uZBias: { value: 0 },
      uPointer: { value: pointerCurrent },
      uScrollBoost: { value: 0 },
    };

    const veilUniforms: FlowUniforms = {
      uTime: { value: 0 },
      uFoldFreq: { value: poseRef.current.foldFreq * 0.84 },
      uAmplitude: { value: poseRef.current.amplitude * 0.72 },
      uTwist: { value: poseRef.current.twist * -0.65 },
      uPhaseOffset: { value: 1.95 },
      uZBias: { value: -1.75 },
      uPointer: { value: pointerCurrent },
      uScrollBoost: { value: 0 },
    };

    const ribbonUniforms: FlowUniforms = {
      uTime: primaryUniforms.uTime,
      uFoldFreq: primaryUniforms.uFoldFreq,
      uAmplitude: primaryUniforms.uAmplitude,
      uTwist: primaryUniforms.uTwist,
      uPhaseOffset: primaryUniforms.uPhaseOffset,
      uZBias: { value: 0.08 },
      uPointer: pointerCurrent ? { value: pointerCurrent } : { value: new THREE.Vector2() },
      uScrollBoost: primaryUniforms.uScrollBoost,
    };

    const segX = isSoftwareGl ? 76 : 112;
    const segY = isSoftwareGl ? 48 : 68;
    const veilSegX = isSoftwareGl ? 56 : 84;
    const veilSegY = isSoftwareGl ? 34 : 50;

    // 1. Primary Sculpted Silk / Ceramic Manifold
    const primaryGeo = new THREE.PlaneGeometry(16.5, 10.6, segX, segY);
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: rgbToThreeColor(poseRef.current.surfaceRgb, new THREE.Color()),
      roughness: 0.34,
      metalness: 0.14,
      clearcoat: 0.56,
      clearcoatRoughness: 0.3,
      sheen: 0.92,
      sheenRoughness: 0.38,
      sheenColor: rgbToThreeColor(poseRef.current.accentRgb, new THREE.Color()),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96,
    });
    applySilkShader(primaryMat, primaryUniforms, 'silk-primary-v1');
    const primaryMesh = new THREE.Mesh(primaryGeo, primaryMat);
    sculptureGroup.add(primaryMesh);

    // 2. Secondary Counter-Flowing Translucent Silk Veil
    const veilGeo = new THREE.PlaneGeometry(15.8, 8.6, veilSegX, veilSegY);
    const veilMat = new THREE.MeshPhysicalMaterial({
      color: rgbToThreeColor(poseRef.current.veilRgb, new THREE.Color()),
      roughness: 0.5,
      metalness: 0.08,
      clearcoat: 0.28,
      sheen: 0.78,
      sheenColor: rgbToThreeColor(poseRef.current.accentRgb, new THREE.Color()),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.54,
      depthWrite: false,
    });
    applySilkShader(veilMat, veilUniforms, 'silk-veil-v1');
    const veilMesh = new THREE.Mesh(veilGeo, veilMat);
    veilMesh.position.set(0.25, -0.35, 0);
    sculptureGroup.add(veilMesh);

    // 3–5. Three Hair-Fine Precision Brushed-Metallic Contour Filaments riding the silk manifold
    const ribbonGeo = new THREE.PlaneGeometry(15.8, 0.018, segX, 1);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: rgbToThreeColor(poseRef.current.accentRgb, new THREE.Color()),
      roughness: 0.2,
      metalness: 0.9,
      emissive: rgbToThreeColor(poseRef.current.accentRgb, new THREE.Color()),
      emissiveIntensity: 0.26,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.72,
    });
    applySilkShader(ribbonMat, ribbonUniforms, 'silk-ribbon-v1');

    const ribbonOffsets = [-2.25, 0.25, 2.55];
    const ribbonMeshes = ribbonOffsets.map((yOffset) => {
      const geo = ribbonGeo.clone();
      geo.translate(0, yOffset, 0);
      const mesh = new THREE.Mesh(geo, ribbonMat);
      sculptureGroup.add(mesh);
      return mesh;
    });
    ribbonGeo.dispose();

    // Scratch colors (zero per-frame allocations)
    const targetBg = new THREE.Color();
    const targetSurface = new THREE.Color();
    const targetAccent = new THREE.Color();
    const targetVeil = new THREE.Color();
    const targetRibbon = new THREE.Color();
    const silverTint = new THREE.Color(0xeef4ff);
    const lookTarget = new THREE.Vector3(0.45, 0, 0);

    // Smoothed scalar state initialized from initial pose
    const cur = {
      foldFreq: poseRef.current.foldFreq,
      amplitude: poseRef.current.amplitude,
      twist: poseRef.current.twist,
      camX: poseRef.current.camX,
      camY: poseRef.current.camY,
      camZ: poseRef.current.camZ,
      rotX: poseRef.current.rotX,
      rotY: poseRef.current.rotY,
      rotZ: poseRef.current.rotZ,
      presence: poseRef.current.presence,
      darkFactor: poseRef.current.isDark ? 1 : 0,
    };

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollVelocity = Math.min(1.5, scrollVelocity + delta * 0.008);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.set(
        (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1),
      );
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = Math.max(1, window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let stopped = false;
    let rafId = 0;
    let timerId: number | null = null;
    let lastTime = performance.now();
    let elapsed = 0;

    const glContext = renderer.getContext();

    // Fence-sync helper for software WebGL so SwiftShader never builds an unbounded command backlog
    const afterDraw = (next: () => void) => {
      if (stopped) return;
      if (!isSoftwareGl) {
        rafId = requestAnimationFrame(next);
        return;
      }
      if (glContext instanceof WebGL2RenderingContext) {
        const sync = glContext.fenceSync(glContext.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          glContext.flush();
          const poll = () => {
            if (stopped) {
              glContext.deleteSync(sync);
              return;
            }
            const status = glContext.clientWaitSync(sync, 0, 0);
            if (status === glContext.TIMEOUT_EXPIRED) {
              timerId = window.setTimeout(poll, 16);
              return;
            }
            glContext.deleteSync(sync);
            timerId = window.setTimeout(next, 80);
          };
          poll();
          return;
        }
      }
      timerId = window.setTimeout(next, 120);
    };

    const tick = () => {
      if (stopped) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (!reducedMotion) {
        elapsed += dt * (0.62 + scrollVelocity * 0.45);
      }
      scrollVelocity = THREE.MathUtils.damp(scrollVelocity, 0, 5.5, dt);

      const target = poseRef.current;
      const dampSpeed = isSoftwareGl ? 11 : 6.2;

      cur.foldFreq = THREE.MathUtils.damp(cur.foldFreq, target.foldFreq, dampSpeed, dt);
      cur.amplitude = THREE.MathUtils.damp(cur.amplitude, target.amplitude, dampSpeed, dt);
      cur.twist = THREE.MathUtils.damp(cur.twist, target.twist, dampSpeed, dt);
      cur.camX = THREE.MathUtils.damp(cur.camX, target.camX, dampSpeed, dt);
      cur.camY = THREE.MathUtils.damp(cur.camY, target.camY, dampSpeed, dt);
      cur.camZ = THREE.MathUtils.damp(cur.camZ, target.camZ, dampSpeed, dt);
      cur.rotX = THREE.MathUtils.damp(cur.rotX, target.rotX, dampSpeed, dt);
      cur.rotY = THREE.MathUtils.damp(cur.rotY, target.rotY, dampSpeed, dt);
      cur.rotZ = THREE.MathUtils.damp(cur.rotZ, target.rotZ, dampSpeed, dt);
      cur.presence = THREE.MathUtils.damp(cur.presence, target.presence, dampSpeed, dt);
      cur.darkFactor = THREE.MathUtils.damp(cur.darkFactor, target.isDark ? 1 : 0, dampSpeed, dt);

      pointerCurrent.x = THREE.MathUtils.damp(pointerCurrent.x, pointerTarget.x, 4.5, dt);
      pointerCurrent.y = THREE.MathUtils.damp(pointerCurrent.y, pointerTarget.y, 4.5, dt);

      // Update uniforms
      primaryUniforms.uTime.value = elapsed;
      primaryUniforms.uFoldFreq.value = cur.foldFreq;
      primaryUniforms.uAmplitude.value = cur.amplitude;
      primaryUniforms.uTwist.value = cur.twist;
      primaryUniforms.uScrollBoost.value = scrollVelocity;

      veilUniforms.uTime.value = elapsed * 0.85;
      veilUniforms.uFoldFreq.value = cur.foldFreq * 0.84;
      veilUniforms.uAmplitude.value = cur.amplitude * 0.72;
      veilUniforms.uTwist.value = cur.twist * -0.65;
      veilUniforms.uScrollBoost.value = scrollVelocity;

      // Damped chromatic palette transitions
      const colorStep = 1 - Math.exp(-dampSpeed * dt);
      rgbToThreeColor(target.bgRgb, targetBg);
      rgbToThreeColor(target.surfaceRgb, targetSurface);
      rgbToThreeColor(target.accentRgb, targetAccent);
      rgbToThreeColor(target.veilRgb, targetVeil);

      bgColor.lerp(targetBg, colorStep);
      fog.color.copy(bgColor);
      primaryMat.color.lerp(targetSurface, colorStep);
      primaryMat.sheenColor.lerp(targetAccent, colorStep);
      veilMat.color.lerp(targetVeil, colorStep);
      veilMat.sheenColor.lerp(targetAccent, colorStep);

      // Brushed metal contour ribbons mix chapter accent with architectural silver
      targetRibbon.copy(targetAccent).lerp(silverTint, cur.darkFactor > 0.5 ? 0.36 : 0.14);
      ribbonMat.color.lerp(targetRibbon, colorStep);
      ribbonMat.emissive.lerp(targetAccent, colorStep);
      ribbonMat.emissiveIntensity = THREE.MathUtils.lerp(0.08, 0.34, cur.darkFactor);

      // Adapt material presence (recedes gently in Publications so papers stay gallery-clean)
      primaryMat.opacity = THREE.MathUtils.lerp(0.32, 0.96, cur.presence);
      veilMat.opacity = THREE.MathUtils.lerp(0.14, 0.54, cur.presence);
      const ribbonVisibility = cur.presence < 0.7 ? cur.presence * 0.28 : cur.presence * 0.76;
      ribbonMat.opacity = THREE.MathUtils.lerp(ribbonVisibility * 0.65, ribbonVisibility, cur.darkFactor);

      // Adapt lighting exposure & contrast cleanly between Dark Nocturne and Sunlit Alabaster
      accentPointLight.color.lerp(targetAccent, colorStep);
      accentPointLight.intensity = THREE.MathUtils.lerp(5.5, 14.5, cur.darkFactor) * cur.presence;
      hemiLight.intensity = THREE.MathUtils.lerp(1.32, 0.48, cur.darkFactor);
      keyLight.intensity = THREE.MathUtils.lerp(1.75, 2.05, cur.darkFactor);
      backRimLight.intensity = THREE.MathUtils.lerp(0.8, 1.25, cur.darkFactor);
      scene.environmentIntensity = THREE.MathUtils.lerp(0.92, 0.58, cur.darkFactor);

      // Sculpture orientation & desktop framing (biased slightly right so left editorial copy stays uncluttered)
      const isDesktop = window.innerWidth >= 1024;
      sculptureGroup.position.set(isDesktop ? 1.35 : 0.2, -0.15, -0.4);
      sculptureGroup.rotation.set(
        cur.rotX + pointerCurrent.y * 0.06,
        cur.rotY + pointerCurrent.x * 0.08,
        cur.rotZ,
      );

      camera.position.set(
        cur.camX + pointerCurrent.x * 0.24,
        cur.camY + pointerCurrent.y * 0.18,
        cur.camZ,
      );
      lookTarget.set(isDesktop ? 0.55 : 0.0, 0.0, -0.3);
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    tick();

    return () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timerId !== null) clearTimeout(timerId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      primaryGeo.dispose();
      primaryMat.dispose();
      veilGeo.dispose();
      veilMat.dispose();
      ribbonMeshes.forEach((m) => m.geometry.dispose());
      ribbonMat.dispose();
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [poseRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      data-testid="sculptural-flow-canvas"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    // WebGL coordinates: -1 to 1. Convert to 0 to 1 for UVs.
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_scroll;
  uniform vec2 u_resolution;
  uniform vec2 u_texResolution;
  uniform vec3 u_burnColor;
  uniform sampler2D u_image;
  uniform float u_overlayOpacity;

  // Ashima / WebGL noise implementation
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal Brownian Motion for ragged paper fibers
  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 6; i++) { // 6 octaves for extreme detail
      f += amp * snoise(p);
      p *= 2.1;
      amp *= 0.5;
    }
    return f;
  }

  // Object-fit cover logic for UVs
  vec2 getCoverUv(vec2 uv) {
    float rs = u_resolution.x / u_resolution.y;
    float ri = u_texResolution.x / u_texResolution.y;
    vec2 newSize = rs < ri ? vec2(u_texResolution.x * u_resolution.y / u_texResolution.y, u_resolution.y) : vec2(u_resolution.x, u_texResolution.y * u_resolution.x / u_texResolution.x);
    vec2 offset = (rs < ri ? vec2((newSize.x - u_resolution.x) / 2.0, 0.0) : vec2(0.0, (newSize.y - u_resolution.y) / 2.0)) / newSize;
    
    // WebGL images are loaded upside down by default unless pixelStorei is set, 
    // but vUv.y is also bottom-up, so it usually cancels out.
    // If image is upside down, we can do: return vec2(uv.x * u_resolution.x / newSize.x + offset.x, (1.0 - uv.y) * u_resolution.y / newSize.y + offset.y);
    return vec2(uv.x * u_resolution.x / newSize.x + offset.x, uv.y * u_resolution.y / newSize.y + offset.y);
  }

  void main() {
    // Fix aspect ratio for noise scaling
    vec2 uv = vUv;
    uv.x *= u_resolution.x / u_resolution.y;

    // Use a low base frequency for long, sweeping horizontal waves
    float macroNoise = fbm(vec2(uv.x * 3.0, u_scroll * 0.001)); 
    
    // Use a high frequency to generate lots of sharp, ragged paper fibers
    float microNoise = fbm(vec2(uv.x * 40.0, u_scroll * 0.003));

    // Combine them to get long waves that are intensely jagged
    float baseNoise = (macroNoise * 0.6) + (microNoise * 0.4);
    
    // Map noise to roughly 0-1
    float noise = baseNoise * 0.5 + 0.5;

    // Threshold for the tear (y=1 is top). 
    float tearDepth = 0.02; // Start slightly below the top
    
    // Amplitude defines the height of the waves.
    float noiseAmplitude = 0.035; // 3.5% of screen height
    float threshold = 1.0 - tearDepth - (noise * noiseAmplitude); 

    // Variable thickness for the burn edge
    // A lower frequency here makes the thickness change slowly along the edge
    float thicknessNoise = fbm(vec2(uv.x * 8.0, u_scroll * 0.002)) * 0.5 + 0.5;
    float edgeThickness = 0.0015 + (thicknessNoise * 0.005); 

    if (vUv.y > threshold) {
      // Top part is torn away
      discard;
    } else if (vUv.y > threshold - edgeThickness) {
      // Burn edge with porous texture
      float burnTex = fbm(vec2(uv.x * 100.0, uv.y * 100.0));
      // Mix between the base burn color and a much darker version of it
      vec3 finalBurn = mix(u_burnColor, u_burnColor * 0.1, burnTex * 0.8 + 0.2);
      gl_FragColor = vec4(finalBurn, 1.0);
    } else {
      // Main background image
      vec2 texUv = getCoverUv(vUv);
      // Flip Y for texture because WebGL loads images top-down but UV is bottom-up
      texUv.y = 1.0 - texUv.y;
      vec4 texColor = texture2D(u_image, texUv);
      
      // Apply the black overlay (e.g. bg-black/50)
      vec3 finalColor = mix(texColor.rgb, vec3(0.0), u_overlayOpacity);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error: ' + gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [0, 0, 0];
}

interface BurnedEdgeProps {
  imageUrl: string;
  burnColor?: string;
  overlayOpacity?: number;
  className?: string;
}

const BurnedEdge: React.FC<BurnedEdgeProps> = ({
  imageUrl,
  burnColor = '#655513',
  overlayOpacity = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [texSize, setTexSize] = useState({ w: 1, h: 1 });

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Buffers
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Uniforms
    const scrollUniformLocation = gl.getUniformLocation(program, 'u_scroll');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const texResolutionUniformLocation = gl.getUniformLocation(program, 'u_texResolution');
    const burnColorUniformLocation = gl.getUniformLocation(program, 'u_burnColor');
    const overlayOpacityUniformLocation = gl.getUniformLocation(program, 'u_overlayOpacity');

    // Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    let currentTexSize = { w: 1, h: 1 };
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      currentTexSize = { w: image.width, h: image.height };
      // setTexSize(currentTexSize);
      render();
    };
    image.src = imageUrl;

    let scrollValue = window.scrollY;

    const render = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(scrollUniformLocation, scrollValue);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(texResolutionUniformLocation, currentTexSize.w, currentTexSize.h);

      const bColor = hexToRgb(burnColor);
      gl.uniform3f(burnColorUniformLocation, bColor[0], bColor[1], bColor[2]);
      gl.uniform1f(overlayOpacityUniformLocation, overlayOpacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollValue = self.scroll();
        render();
      }
    });

    const handleResize = () => render();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
    };
  }, [imageUrl, burnColor, overlayOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BurnedEdge;

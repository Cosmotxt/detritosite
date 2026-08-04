import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_progress;
  uniform vec2 u_resolution;
  uniform vec3 u_burnColor;
  
  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform sampler2D u_tex2;
  uniform sampler2D u_tex3;
  uniform sampler2D u_tex4;
  uniform vec2 u_texResolutions[5];
  uniform int u_numImages;

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

  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 6; i++) {
      f += amp * snoise(p);
      p *= 2.1;
      amp *= 0.5;
    }
    return f;
  }

  vec2 getCoverUv(vec2 uv, vec2 texRes) {
    if (texRes.x <= 1.0 || texRes.y <= 1.0) return uv;
    float rs = u_resolution.x / u_resolution.y;
    float ri = texRes.x / texRes.y;
    vec2 newSize = rs < ri ? vec2(texRes.x * u_resolution.y / texRes.y, u_resolution.y) : vec2(u_resolution.x, texRes.y * u_resolution.x / texRes.x);
    vec2 offset = (rs < ri ? vec2((newSize.x - u_resolution.x) / 2.0, 0.0) : vec2(0.0, (newSize.y - u_resolution.y) / 2.0)) / newSize;
    vec2 coverUv = vec2(uv.x * u_resolution.x / newSize.x + offset.x, uv.y * u_resolution.y / newSize.y + offset.y);
    coverUv.y = 1.0 - coverUv.y; // Flip Y for WebGL textures
    return coverUv;
  }

  void main() {
    float currentIdx = floor(u_progress);
    float localProgress = fract(u_progress);

    // Clamp to prevent out of bounds
    if (currentIdx >= float(u_numImages - 1)) {
        currentIdx = float(u_numImages - 2);
        localProgress = 1.0;
    }

    vec4 color1;
    vec4 color2;

    if (currentIdx < 0.5) {
       color1 = texture2D(u_tex0, getCoverUv(vUv, u_texResolutions[0]));
       color2 = texture2D(u_tex1, getCoverUv(vUv, u_texResolutions[1]));
    } else if (currentIdx < 1.5) {
       color1 = texture2D(u_tex1, getCoverUv(vUv, u_texResolutions[1]));
       color2 = texture2D(u_tex2, getCoverUv(vUv, u_texResolutions[2]));
    } else if (currentIdx < 2.5) {
       color1 = texture2D(u_tex2, getCoverUv(vUv, u_texResolutions[2]));
       color2 = texture2D(u_tex3, getCoverUv(vUv, u_texResolutions[3]));
    } else if (currentIdx < 3.5) {
       color1 = texture2D(u_tex3, getCoverUv(vUv, u_texResolutions[3]));
       color2 = texture2D(u_tex4, getCoverUv(vUv, u_texResolutions[4]));
    } else {
       color1 = texture2D(u_tex4, getCoverUv(vUv, u_texResolutions[4]));
       color2 = texture2D(u_tex4, getCoverUv(vUv, u_texResolutions[4]));
    }

    // Aspect ratio correction for the circle
    vec2 uv = vUv;
    uv.x *= u_resolution.x / u_resolution.y;
    vec2 center = vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
    
    float dist = distance(uv, center);
    float currentRadius = -0.2 + (localProgress * 1.5);

    // Noise for rugged edges
    float noise = fbm(uv * 15.0) * 0.5 + 0.5;
    float raggedDist = dist + (noise * 0.05); 
    
    // Noise for burn edge thickness (thinner edge)
    float thicknessNoise = fbm(uv * 8.0) * 0.5 + 0.5;
    float edgeThickness = 0.008 + (thicknessNoise * 0.012); 

    if (raggedDist < currentRadius) {
       gl_FragColor = color2;
    } else if (raggedDist < currentRadius + edgeThickness) {
       float burnTex = fbm(uv * 100.0);
       vec3 finalBurn = mix(u_burnColor, u_burnColor * 0.2, burnTex * 0.8 + 0.2);
       gl_FragColor = vec4(finalBurn, 1.0);
    } else {
       gl_FragColor = color1;
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

export interface BurnCarouselRef {
  setProgress: (p: number) => void;
}

interface BurnCarouselProps {
  images: string[];
  burnColor?: string;
  className?: string;
}

const BurnCarousel = forwardRef<BurnCarouselRef, BurnCarouselProps>(({
  images,
  burnColor = '#8D312A',
  className = ''
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const renderRef = useRef<() => void>();
  const progressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setProgress: (p: number) => {
      progressRef.current = p;
      if (renderRef.current) renderRef.current();
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }
    glRef.current = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

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

    const progressUniformLocation = gl.getUniformLocation(program, 'u_progress');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const texResolutionsUniformLocation = gl.getUniformLocation(program, 'u_texResolutions');
    const burnColorUniformLocation = gl.getUniformLocation(program, 'u_burnColor');
    const numImagesUniformLocation = gl.getUniformLocation(program, 'u_numImages');

    const textures: WebGLTexture[] = [];
    const texResolutions = new Float32Array(10); // 5 vec2s

    for (let i = 0; i < 5; i++) {
      const tex = gl.createTexture();
      if (tex) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
        textures.push(tex);
      }
      texResolutions[i * 2] = 1.0;
      texResolutions[i * 2 + 1] = 1.0;
    }

    let isCancelled = false;
    let loadedCount = 0;
    images.forEach((url, i) => {
      if (i >= 5) return;
      const image = new Image();
      image.onload = () => {
        if (isCancelled) return;

        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        texResolutions[i * 2] = image.width;
        texResolutions[i * 2 + 1] = image.height;

        loadedCount++;
        if (loadedCount === Math.min(images.length, 5)) {
          if (renderRef.current) renderRef.current();
        }
      };
      image.src = url;
    });

    renderRef.current = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(progressUniformLocation, progressRef.current);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2fv(texResolutionsUniformLocation, texResolutions);
      gl.uniform1i(numImagesUniformLocation, Math.min(images.length, 5));

      const bColor = hexToRgb(burnColor);
      gl.uniform3f(burnColorUniformLocation, bColor[0], bColor[1], bColor[2]);

      for (let i = 0; i < Math.min(images.length, 5); i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        const loc = gl.getUniformLocation(program, `u_tex${i}`);
        gl.uniform1i(loc, i);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    renderRef.current();

    const handleResize = () => {
      if (renderRef.current) renderRef.current();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', handleResize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      textures.forEach(tex => gl.deleteTexture(tex));
    };
  }, [images, burnColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
});

BurnCarousel.displayName = 'BurnCarousel';
export default BurnCarousel;

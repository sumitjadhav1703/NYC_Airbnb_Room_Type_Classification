// ============================================================
// WEBGL PAGE BACKGROUND
// ============================================================
// These three blocks used to be three separate <script> tags, which meant a
// crash in one could not take down the others. They now share a file, so each
// one guards itself — otherwise a failure here silently kills the form wiring
// and the Build Line further down.
try {
(function () {
  const canvas = document.getElementById('glcanvas');
  const gl = canvas && canvas.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  const vsSource = `
    attribute vec4 aVertexPosition;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = aVertexPosition;
      v_texCoord = aVertexPosition.xy * 0.5 + 0.5;
    }
  `;

  // NOTE: the design export left this as an unresolved template placeholder
  // instead of GLSL. Until real fragment shader source is dropped in, this
  // background cannot compile — bail out rather than throw.
  const fsSource = `{{DATA:ANIMATION:ANIMATION_1}}`;
  if (fsSource.trim().startsWith('{{')) {
    console.warn('Page background shader source is missing — skipping WebGL background.');
    return;
  }

  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) return;

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      u_time: gl.getUniformLocation(shaderProgram, 'u_time'),
      u_resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
      u_mouse: gl.getUniformLocation(shaderProgram, 'u_mouse'),
    },
  };

  const positions = [
     1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  let mouseX = 0;
  let mouseY = 0;
  
  window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      // Invert Y for WebGL coordinates
      mouseY = window.innerHeight - e.clientY;
  });

  function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }

  function renderGl(time) {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (programInfo.program) {
      gl.useProgram(programInfo.program);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      gl.uniform1f(programInfo.uniformLocations.u_time, time * 0.001);
      gl.uniform2f(programInfo.uniformLocations.u_resolution, gl.canvas.width, gl.canvas.height);
      
      if (mouseX === 0 && mouseY === 0) {
          gl.uniform2f(programInfo.uniformLocations.u_mouse, gl.canvas.width/2, gl.canvas.height/2);
      } else {
          gl.uniform2f(programInfo.uniformLocations.u_mouse, mouseX, mouseY);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(renderGl);
  }
  requestAnimationFrame(renderGl);
})();
} catch (err) {
  console.error('WebGL page background failed:', err);
}

// ============================================================
// BUILD LINE SECTION SHADER
// ============================================================
try {
(function() {
  const canvas = document.getElementById('buildLineShaderCanvas');
  if(!canvas) return;

  function syncSize() {
    const w = canvas.clientWidth  || 1280;
    const h = canvas.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
    }
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(syncSize).observe(canvas);
  }
  syncSize();

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
  const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;
    
    vec3 color = vec3(0.0);
    
    // Scanning Pulse Line
    float scan = smoothstep(0.1, 0.0, abs(fract(uv.y * 0.5 - u_time * 0.1) - 0.5));
    color += vec3(0.66, 0.8, 0.91) * scan * 0.1; // Secondary color

    // Data points (Blinking lights)
    for(int i = 0; i < 12; i++) {
        float fi = float(i);
        float t = u_time * (0.2 + fi * 0.02);
        vec2 pos = vec2(
            hash(vec2(fi, 13.0)),
            hash(vec2(fi, 17.0))
        );
        
        float dist = distance(uv, pos);
        float blink = step(0.6, sin(t * 3.0 + fi));
        float glow = 0.001 / pow(dist, 1.5);
        
        vec3 glowCol = (mod(fi, 3.0) == 0.0) ? vec3(1.0, 1.0, 1.0) : vec3(0.66, 0.8, 0.91); // Primary / Secondary
        color += glowCol * glow * blink * 0.5;
    }
    
    gl_FragColor = vec4(color, 1.0);
}`;
  function cs(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');

  function render(t) {
    if (typeof ResizeObserver === 'undefined') syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  render(0);
})();
} catch (err) {
  console.error('Build Line shader failed:', err);
}

// ============================================================
// CONFIG
// ============================================================
const API_BASE_URL = "https://nyc-airbnb-room-type-predictor.onrender.com";
const PREDICT_ENDPOINT = `${API_BASE_URL}/predict`;
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ROOM_CLASSES = [
  { key: "Entire home/apt", label: "Entire home", rows: 6, cols: 2, height: "100%" },
  { key: "Private room", label: "Private room", rows: 4, cols: 2, height: "68%" },
  { key: "Shared room", label: "Shared room", rows: 2, cols: 2, height: "42%" },
];

const EXAMPLES = [
  {
    latitude: 40.7484, longitude: -73.9857, price: 120, minimum_nights: 2,
    number_of_reviews: 84, reviews_per_month: 2.3, calculated_host_listings_count: 1,
    availability_365: 210, neighbourhood_group: "Manhattan", neighbourhood: "Midtown",
  },
  {
    latitude: 40.6782, longitude: -73.9442, price: 55, minimum_nights: 1,
    number_of_reviews: 210, reviews_per_month: 4.1, calculated_host_listings_count: 3,
    availability_365: 300, neighbourhood_group: "Brooklyn", neighbourhood: "Bedford-Stuyvesant",
  },
  {
    latitude: 40.7282, longitude: -73.7949, price: 38, minimum_nights: 3,
    number_of_reviews: 12, reviews_per_month: 0.6, calculated_host_listings_count: 1,
    availability_365: 90, neighbourhood_group: "Queens", neighbourhood: "Flushing",
  },
];
let exampleIndex = 0;

// ============================================================
// FORM WIRING
// ============================================================
const form = document.getElementById("predictForm");
const predictBtn = document.getElementById("predictBtn");
const formError = document.getElementById("formError");
const availabilityInput = document.getElementById("availability_365");
const availabilityValue = document.getElementById("availabilityValue");
const exampleBtn = document.getElementById("exampleBtn");
const toggleDetailsBtn = document.getElementById("toggleDetailsBtn");
const techDetailsPanel = document.getElementById("techDetailsPanel");

availabilityInput.addEventListener("input", () => {
  availabilityValue.textContent = availabilityInput.value;
});

exampleBtn.addEventListener("click", () => {
  const data = EXAMPLES[exampleIndex % EXAMPLES.length];
  exampleIndex++;
  Object.entries(data).forEach(([key, value]) => {
    const el = form.elements[key];
    if (el) el.value = value;
  });
  availabilityValue.textContent = data.availability_365;
  formError.textContent = "";
});

if (toggleDetailsBtn) {
  toggleDetailsBtn.addEventListener("click", () => {
    techDetailsPanel.classList.toggle("hidden");
    const isHidden = techDetailsPanel.classList.contains("hidden");
    toggleDetailsBtn.textContent = isHidden ? "View Technical Details" : "Hide Technical Details";
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";

  if (!form.reportValidity()) return;

  const payload = collectPayload();
  setLoading(true);

  try {
    const res = await fetch(PREDICT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail ? formatDetail(body.detail) : `Request failed (${res.status}).`);
    }

    const result = await res.json();
    renderResult(result);
  } catch (err) {
    formError.textContent = err.message?.includes("fetch")
      ? "Can't reach the prediction API. Make sure the FastAPI server is running and reachable."
      : err.message || "Something went wrong. Check the values and try again.";
  } finally {
    setLoading(false);
  }
});

function collectPayload() {
  const fd = new FormData(form);
  return {
    latitude: parseFloat(fd.get("latitude")),
    longitude: parseFloat(fd.get("longitude")),
    price: parseFloat(fd.get("price")),
    minimum_nights: parseInt(fd.get("minimum_nights"), 10),
    number_of_reviews: parseInt(fd.get("number_of_reviews"), 10),
    reviews_per_month: parseFloat(fd.get("reviews_per_month")),
    calculated_host_listings_count: parseInt(fd.get("calculated_host_listings_count"), 10),
    availability_365: parseInt(fd.get("availability_365"), 10),
    neighbourhood_group: fd.get("neighbourhood_group"),
    neighbourhood: fd.get("neighbourhood"),
  };
}

function formatDetail(detail) {
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || JSON.stringify(d)).join(" ");
  }
  return String(detail);
}

function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  const icon = predictBtn.querySelector('.material-symbols-outlined');
  if(isLoading) {
      icon.textContent = 'hourglass_empty';
      icon.classList.add('animate-spin');
      predictBtn.classList.add('opacity-75');
  } else {
      icon.textContent = 'auto_awesome';
      icon.classList.remove('animate-spin');
      predictBtn.classList.remove('opacity-75');
  }
}

// ============================================================
// RESULT RENDERING
// ============================================================
const resultEmpty = document.getElementById("resultEmpty");
const resultContent = document.getElementById("resultContent");
const predictedName = document.getElementById("predictedName");
const buildingsRow = document.getElementById("buildingsRow");
const probList = document.getElementById("probList");

function renderResult(result) {
  const predicted = result.Predicted_room_type;
  const probs = result.Probability; 

  const paired = ROOM_CLASSES.map((cls, i) => ({
    ...cls,
    prob: typeof probs?.[i] === "number" ? probs[i] : 0,
  }));

  resultEmpty.hidden = true;
  resultContent.hidden = false;
  
  // Fade in animation for content
  resultContent.classList.remove('animate-fade-up');
  void resultContent.offsetWidth; // trigger reflow
  resultContent.classList.add('animate-fade-up');

  predictedName.textContent = predicted;

  buildBuildings(paired, predicted);
  buildProbList(paired, predicted);
}

function buildBuildings(paired, predicted) {
  buildingsRow.innerHTML = "";

  paired.forEach((cls) => {
    const col = document.createElement("div");
    col.className = "building-col";

    const b = document.createElement("div");
    b.className = "building";
    b.style.setProperty("--h", "18%");

    const totalWindows = cls.rows * cls.cols;
    const litCount = Math.round(totalWindows * cls.prob);

    for (let i = 0; i < totalWindows; i++) {
      const win = document.createElement("div");
      win.className = "win";
      b.appendChild(win);
    }

    const caption = document.createElement("div");
    caption.className = "building-caption";
    caption.textContent = cls.label;

    col.appendChild(b);
    col.appendChild(caption);
    buildingsRow.appendChild(col);

    requestAnimationFrame(() => {
      setTimeout(() => {
        b.style.setProperty("--h", cls.height);
        const wins = b.querySelectorAll(".win");
        wins.forEach((w, i) => {
          if (i < litCount) {
            setTimeout(() => w.classList.add("lit"), REDUCE_MOTION ? 0 : 60 * i + 300);
          }
        });
        if (cls.key === predicted) {
          // Glow using primary color
          b.style.boxShadow = "0 -4px 20px -4px rgba(255, 255, 255, 0.2)";
          b.style.borderColor = "rgba(255, 255, 255, 0.4)";
        }
      }, REDUCE_MOTION ? 0 : 80);
    });
  });
}

function buildProbList(paired, predicted) {
  probList.innerHTML = "";
  const sorted = [...paired].sort((a, b) => b.prob - a.prob);

  sorted.forEach((cls) => {
    const row = document.createElement("div");
    row.className = "prob-row" + (cls.key === predicted ? " top" : "");

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = cls.label;

    const value = document.createElement("span");
    value.className = "value";
    value.textContent = "0%";

    const track = document.createElement("div");
    track.className = "prob-track";
    const fill = document.createElement("div");
    fill.className = "prob-fill";
    track.appendChild(fill);

    row.appendChild(name);
    row.appendChild(value);
    row.appendChild(track);
    probList.appendChild(row);

    const pct = Math.round(cls.prob * 100);
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = `${pct}%`;
        animateCountMain(value, pct);
      }, REDUCE_MOTION ? 0 : 150);
    });
  });
}

function animateCountMain(el, target) {
  if (REDUCE_MOTION) {
    el.textContent = `${target}%`;
    return;
  }
  const duration = 700;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(target * eased)}%`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============================================================
// API HEALTH CHECK
// ============================================================
async function checkApiStatus() {
  const statusEl = document.getElementById("apiStatus");
  try {
    const res = await fetch(HEALTH_ENDPOINT, { method: "GET" });
    if (res.ok) {
      statusEl.classList.add("online");
      statusEl.classList.remove("offline");
      statusEl.lastChild.textContent = "API connected";
    } else {
      throw new Error("bad status");
    }
  } catch {
    statusEl.classList.add("offline");
    statusEl.classList.remove("online");
    statusEl.lastChild.textContent = "API unreachable";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkApiStatus();
});

// ============================================================
// BUILD LINE GUIDE LOGIC
// ============================================================
const STOPS = [
  {
    key:"ml",
    label:"Model",
    icon:"🧠",
    color:"#a8cbe8", // secondary
    line:"Line 1 — Understanding the Data",
    title:"Machine Learning",
    tagline:"Before anything talks to anything else, there has to be a brain. This is where we teach it.",
    items:[
      "Load the raw data and look around",
      "Explore it — what patterns, what's messy, what's missing",
      "Clean it up and engineer the features that matter",
      "Split it into a training set and a test set",
      "Try a few algorithms, compare how they perform",
      "Pick the simplest one that does the job well",
      "Test it honestly on data it has never seen",
      "Freeze the finished model into a single reusable artifact"
    ],
    note:"By the end of this stop, we're not writing ML code anymore — we have one saved, trained brain, ready to be used."
  },
  {
    key:"api",
    label:"API",
    icon:"⚡",
    color:"#a8cbe8",
    line:"Line 2 — Giving It a Voice",
    title:"FastAPI",
    tagline:"A trained model sitting on a laptop is useless to the world. FastAPI gives it a door anyone can knock on.",
    items:[
      "Spin up a lightweight web server",
      "Load the saved model into memory, once, at startup",
      "Define exactly what a valid request should look like",
      "Open an endpoint that accepts listing details",
      "Model predicts behind the scenes",
      "Server hands back the answer as clean JSON"
    ],
    note:"This is the layer that turns \"a model in a folder\" into \"a service anything can talk to\" — a website, an app, another API."
  },
  {
    key:"pkl",
    label:"Pickle",
    icon:"🧊",
    color:"#a8cbe8",
    line:"Line 3 — Freezing the Brain",
    title:"Python Pickle / Joblib",
    tagline:"Training takes minutes. Answering a question should take milliseconds. This is why.",
    items:[
      "We never want to retrain the model every single time it's needed",
      "So the trained pipeline gets frozen into one portable file",
      "That frozen file gets loaded instantly when the API starts",
      "Same model, same preprocessing, identical result every time",
      "This is the trick that makes predictions feel instant"
    ],
    note:"Think of it as a photograph of a fully-trained brain — no re-learning, just recall."
  },
  {
    key:"ui",
    label:"UI",
    icon:"🎨",
    color:"#a8cbe8",
    line:"Line 4 — Giving It a Face",
    title:"The Interface",
    tagline:"People don't talk to APIs. They click buttons. So the model needs a face.",
    items:[
      "Build a simple interface with HTML, CSS and JavaScript",
      "As ML engineers, our job isn't to be designers",
      "So we lean on AI to design and build that interface for us",
      "Then we just plug it into the API we already built"
    ],
    note:"Keep this stop short on purpose — the interesting engineering already happened at the first three stops."
  },
  {
    key:"deploy",
    label:"Deploy",
    icon:"🚀",
    color:"#a8cbe8",
    line:"Line 5 — Going Live",
    title:"Deployment on Vercel + Render",
    tagline:"Everything works on localhost. The last stop is making it work for everyone else, too.",
    items:[
      "There are two different pieces, so they get two different homes",
      "The interface (HTML, CSS, JS) deploys to Vercel as a static site",
      "The API and model deploy to Render as a Web Service",
      "Push to the repo, and both platforms build and deploy automatically",
      "The result: a live link — not just something running on your laptop"
    ],
    note:"This is the moment the project stops being \"a notebook\" and becomes \"a product.\""
  }
];

let currentBuildStop = 0;
const checkedState = STOPS.map(s => new Array(s.items.length).fill(false));

function animateCount(el, from, to, suffix){
  const dur = 320;
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now-start)/dur);
    const val = Math.round(from + (to-from)*p);
    el.innerHTML = `<b>${val}</b>${suffix}`;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function emitPuffs(){
  const track = document.querySelector(".track");
  const trainEl = document.getElementById("train");
  let ticks = 0;
  const iv = setInterval(()=>{
    if(!trainEl) return clearInterval(iv);
    const rect = trainEl.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const puff = document.createElement("div");
    puff.className = "puff";
    puff.style.left = (rect.left - trackRect.left + rect.width/2)+"px";
    track.appendChild(puff);
    setTimeout(()=>puff.remove(), 650);
    ticks++;
    if(ticks>5) clearInterval(iv);
  }, 90);
}

const stationsEl = document.getElementById("stations");
if(stationsEl){
STOPS.forEach((s, i)=>{
  const btn = document.createElement("button");
  btn.className = "station";
  btn.innerHTML = `<span class="dot"></span><span class="label">${s.label}</span>`;
  btn.addEventListener("click", ()=> goTo(i));
  stationsEl.appendChild(btn);
});
}

const stage = document.getElementById("stage");
if(stage){
STOPS.forEach((s, i)=>{
  const card = document.createElement("div");
  card.className = "stop-card glass-panel p-8 rounded-xl";
  card.id = "card-"+i;

  const itemsHtml = s.items.map((txt, j)=>`
    <li data-i="${j}" style="animation-delay:${j*0.05}s">
      <span class="check-box"><svg viewBox="0 0 16 16"><polyline points="3,8 6.5,12 13,4"/></svg></span>
      <span class="text">${txt}</span>
    </li>`).join("");

  card.innerHTML = `
    <div class="stop-head">
      <span class="stop-num" style="background:${s.color}">${i+1} / ${STOPS.length}</span>
      <span class="stop-line">${s.line}</span>
    </div>
    <h2 class="stop-title"><span class="icon-float">${s.icon}</span> ${s.title}</h2>
    <p class="stop-tagline">${s.tagline}</p>
    <ul class="checklist" id="list-${i}">${itemsHtml}</ul>
    <div class="aside-note" id="note-${i}">💡 ${s.note}</div>
    <div class="progress-pill" id="pill-${i}">0 / ${s.items.length} checked off</div>
    <div class="stage-nav mt-8 pt-6 border-t border-outline-variant/20">
      <button class="btn-ghost" id="prevBtn-${i}">← Previous stop</button>
      <button class="btn-primary" id="nextBtn-${i}">Next stop →</button>
    </div>
  `;
  stage.appendChild(card);
});

STOPS.forEach((s,i)=>{
  const list = document.getElementById("list-"+i);
  list.querySelectorAll("li").forEach(li=>{
    li.addEventListener("click", ()=>{
      const j = +li.dataset.i;
      checkedState[i][j] = !checkedState[i][j];
      li.classList.toggle("checked", checkedState[i][j]);
      const checkedCount = checkedState[i].filter(Boolean).length;
      const prevCount = checkedState[i][j] ? checkedCount - 1 : checkedCount + 1;
      const pillEl = document.getElementById("pill-"+i);
      animateCount(pillEl, prevCount, checkedCount, ` / ${s.items.length} checked off`);
      if(checkedCount === s.items.length){
        document.getElementById("note-"+i).classList.add("show");
      }
    });
  });
  document.getElementById("prevBtn-"+i).addEventListener("click", ()=> goTo(i-1));
  document.getElementById("nextBtn-"+i).addEventListener("click", ()=>{
    if(i === STOPS.length-1){ showTerminus(); } else { goTo(i+1); }
  });
});
}

function renderBuildGuide(){
  if(!document.getElementById("terminus")) return;
  document.getElementById("terminus").classList.remove("active");
  document.querySelectorAll(".stop-card").forEach((c,idx)=>{
    c.classList.toggle("active", idx===currentBuildStop);
  });
  document.querySelectorAll(".station").forEach((st,idx)=>{
    st.classList.toggle("active", idx===currentBuildStop);
    st.classList.toggle("done", idx<currentBuildStop);
  });
  document.getElementById("prevBtn-"+currentBuildStop) && (document.getElementById("prevBtn-"+currentBuildStop).disabled = currentBuildStop===0);

  const pct = (currentBuildStop/(STOPS.length-1))*100;
  document.getElementById("trackFill").style.width = pct+"%";
  document.getElementById("train").style.left = pct+"%";
  emitPuffs();
}

function goTo(i){
  if(i<0) i=0;
  if(i>STOPS.length-1) i=STOPS.length-1;
  currentBuildStop = i;
  renderBuildGuide();
}

function showTerminus(){
  document.querySelectorAll(".stop-card").forEach(c=>c.classList.remove("active"));
  document.querySelectorAll(".station").forEach(st=>st.classList.add("done"));
  document.getElementById("trackFill").style.width = "100%";
  document.getElementById("train").style.left = "100%";
  document.getElementById("terminus").classList.add("active");
  buildRecap();
  
  // scroll to terminus smoothly
  document.getElementById("terminus").scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function restart(){
  currentBuildStop = 0;
  checkedState.forEach(arr=>arr.fill(false));
  document.querySelectorAll(".checklist li").forEach(li=>li.classList.remove("checked"));
  document.querySelectorAll(".aside-note").forEach(n=>n.classList.remove("show"));
  STOPS.forEach((s,i)=>{
    document.getElementById("pill-"+i).innerHTML = `0 / ${s.items.length} checked off`;
  });
  renderBuildGuide();
  document.getElementById("buildLine").scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildRecap(){
  const grid = document.getElementById("recapGrid");
  grid.innerHTML = STOPS.map((s,i)=>`
    <div class="recap-item flex flex-col items-center justify-center text-center" style="--stop-color:${s.color}; opacity:0; animation:pop-in .4s cubic-bezier(.34,1.56,.64,1) forwards; animation-delay:${0.15 + i*0.09}s">
      <div class="ic">${s.icon}</div>
      <div class="t mt-2">${s.title}</div>
    </div>
  `).join("");
}

// Initial render
if(document.getElementById("terminus")) renderBuildGuide();


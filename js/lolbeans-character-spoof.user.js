// ==UserScript==
// @name       LOLBeans character spoof
// @namespace  https://codetweak.local
// @version    2.1.3
// @description Change your character to anything you want
// @author     MrBlankCoding
// @match      https://lolbeans.io/*
// @run-at     document-start
// @grant      none
// @license    MIT
// ==/UserScript==

(() => {
  'use strict';

  if (document.__rbModelInstalled) return;
  document.__rbModelInstalled = true;

  const DEFAULTS = {
    enabled: true,
    hotkey: 'alt+o',
    panelHotkey: 'Escape',

    useUpload: true,
    colourSource: 'model', // 'model' | 'game-bands' | 'game-flat' | 'game-materials'
    band1: 0.32,
    band2: 0.68,
    softness: 0.04,

    fit: 'height', // 'height' | 'maxdim' | 'diagonal'
    size: 0.75,
    anchor: 'centre', // 'centre' | 'feet'
    matchFacing: true,
    gameHeading: 'inherit', // 'inherit' | 'copy'
    yaw: 0,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,

    shadows: true,
    onlyOwnBean: true,
    allPlayers: false,
  };
  const CFG = Object.assign({}, DEFAULTS);
  const DEG = Math.PI / 180;

  const PALETTE = [
    682687, 2280690, 16775592, 15882100, 12124299, 16730442, 16747566, 16768542, 8191856, 960318, 13458524, 15761536, 16416882, 15308410, 16752762, 14423100, 16711680, 11674146, 9109504, 16761035, 16758465, 16738740, 16716947, 13047173, 14381203, 16752762, 16744272, 16737095, 16729344, 16747520, 16753920, 16766720, 16776960, 16777184, 16775885, 16448210, 15657130, 15787660, 12433259, 15132410, 14204888, 14524637, 15631086, 14315734, 16711935, 16711935, 12211667, 9662683, 6697881, 9055202, 9699539, 10040012, 9109643, 8388736, 4915330, 6970061, 4734347, 8087790, 11403055, 8388352, 8190976, 65280, 3329330, 10025880, 9498256, 64154, 65407, 3978097, 3050327, 2263842, 32768, 25600, 10145074, 7048739, 8421376, 5597999, 6737322, 9419915, 2142890, 35723, 35555, 33023, 255, 65535, 65280, 16711680, 16711935, 16777215, 16776960, 16775168, 16773888, 16772096, 16770560, 16768640, 16766564, 16763770, 16761088, 16757952, 16754704, 16751216, 16748000, 16744544, 16741088, 16737280, 16733792, 16729684, 16726272, 16722724, 16719040, 16715644, 16711935, 16708090, 16704703, 16701086, 16697336, 16693824, 16689840, 16686004, 16682312, 16678632, 16674548, 16670888, 16666748, 16663016, 16658904, 16654864, 16650680, 16646408, 16642424, 16638448, 16634480, 16630376, 16626392, 16622336, 16618392, 16614168, 16610224, 16606040, 16602088, 16597840, 16593880, 16589768, 16585832, 16581752, 16577824, 16573648, 16569560, 16565648, 16561544, 16557616, 16553488, 16549520, 16545592, 16541480, 16537624, 16533544, 16529448, 16525456, 16521472, 16517264, 16513288, 16509184, 16505184, 16500968, 16496984, 16492880, 16488952, 16484864, 16480904, 16476776, 16472720, 16468744, 16464584, 16460552, 16456360, 16452288, 16448216, 16444152, 16439896, 16435904, 16431816, 16427736, 16423584, 16419424, 16415376,
  ];

  const S = (document.__rbModel = {
    T: null,
    beans: new Set(),
    orbs: new Map(),
    scenes: new WeakSet(),
    model: null,
    upload: null,
    sphere: null,
    dirty: true,
    colourKey: '',
    status: 'No model uploaded - showing the built-in sphere.',
    statusBad: false,
  });
  S.CFG = CFG;

  const LS_CFG = 'rbModelCfg';
  const LS_GLB_LEGACY = 'rbModelGlb';

  try {
    const saved = JSON.parse(localStorage.getItem(LS_CFG) || '{}');
    for (const k in saved) if (k in DEFAULTS) CFG[k] = saved[k];
  } catch (e) { /* ignore */ }

  let saveTimer = 0;
  function saveCfg() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(LS_CFG, JSON.stringify(CFG)); } catch (e) { /* ignore */ }
    }, 250);
  }

  const idb = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('rbModel', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }).catch((e) => { dbp = null; throw e; }));
    const run = (mode, fn) => open().then((db) => new Promise((res, rej) => {
      const tx = db.transaction('kv', mode);
      const req = fn(tx.objectStore('kv'));
      tx.oncomplete = () => res(req.result);
      tx.onerror = tx.onabort = () => rej(tx.error);
    }));
    return {
      get: (k) => run('readonly', (s) => s.get(k)),
      set: (k, v) => run('readwrite', (s) => s.put(v, k)),
      del: (k) => run('readwrite', (s) => s.delete(k)),
    };
  })();

  function readLegacyGlb() {
    try {
      const b64 = localStorage.getItem(LS_GLB_LEGACY);
      if (!b64) return null;
      const bin = atob(b64);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out.buffer;
    } catch (e) { return null; }
  }

  const COMP = {
    5120: Int8Array, 5121: Uint8Array, 5122: Int16Array,
    5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array,
  };
  const NUM = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
  const NORM = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };

  function readComponent(dv, off, ct) {
    switch (ct) {
      case 5120: return dv.getInt8(off);
      case 5121: return dv.getUint8(off);
      case 5122: return dv.getInt16(off, true);
      case 5123: return dv.getUint16(off, true);
      case 5125: return dv.getUint32(off, true);
      case 5126: return dv.getFloat32(off, true);
    }
    throw new Error('componentType ' + ct);
  }

  function readAccessor(json, bin, i) {
    const a = json.accessors[i];
    const Ctor = COMP[a.componentType];
    if (!Ctor) throw new Error('unsupported componentType ' + a.componentType);
    const n = NUM[a.type] || 1;
    const size = Ctor.BYTES_PER_ELEMENT;
    let out;

    if (a.bufferView == null) {
      out = new Ctor(a.count * n);
    } else {
      const v = json.bufferViews[a.bufferView];
      const stride = v.byteStride || n * size;
      const abs = bin.byteOffset + (v.byteOffset || 0) + (a.byteOffset || 0);
      if (stride === n * size && abs % size === 0) {
        out = new Ctor(bin.buffer, abs, a.count * n);
      } else {
        out = new Ctor(a.count * n);
        const dv = new DataView(bin.buffer);
        for (let k = 0; k < a.count; k++) {
          for (let c = 0; c < n; c++) {
            out[k * n + c] = readComponent(dv, abs + k * stride + c * size, a.componentType);
          }
        }
      }
    }

    if (a.normalized && Ctor !== Float32Array) {
      const f = new Float32Array(out.length);
      const d = NORM[a.componentType];
      for (let k = 0; k < f.length; k++) f[k] = Math.max(out[k] / d, -1);
      return f;
    }
    return out;
  }

  function imageURI(json, bin, index) {
    const img = json.images && json.images[index];
    if (!img) return null;
    let bytes, mime = img.mimeType || 'image/png';
    if (img.bufferView != null) {
      const v = json.bufferViews[img.bufferView];
      bytes = bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength);
    } else if (img.uri && /^data:/.test(img.uri)) {
      const comma = img.uri.indexOf(',');
      mime = img.uri.slice(5, comma).split(';')[0] || mime;
      const raw = atob(img.uri.slice(comma + 1));
      bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    } else {
      return null;
    }
    let s = '';
    const CH = 0x8000;
    for (let i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return 'data:' + mime + ';base64,' + btoa(s);
  }

  function makeTexture(THREE, uri, srgb, sampler) {
    const tex = new THREE.Texture();
    const img = new Image();
    img.onload = () => { tex.needsUpdate = true; };
    img.src = uri;
    tex.image = img;
    tex.flipY = false;
    const wrap = (w) => (w === 33071 ? THREE.ClampToEdgeWrapping
      : w === 33648 ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping);
    tex.wrapS = wrap(sampler && sampler.wrapS);
    tex.wrapT = wrap(sampler && sampler.wrapT);
    if (srgb) {
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    }
    return tex;
  }

  function buildMaterial(THREE, m, getTex) {
    const isDefault = !m;
    m = m || {};
    const pbr = m.pbrMetallicRoughness || {};
    const base = pbr.baseColorFactor || [1, 1, 1, 1];
    const unlit = !!(m.extensions && m.extensions.KHR_materials_unlit);

    const mat = new (unlit ? THREE.MeshBasicMaterial : THREE.MeshStandardMaterial)({
      side: m.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });
    mat.color.setRGB(base[0], base[1], base[2]);

    const tex = (info, srgb) => (info ? getTex(info.index, srgb) : null);
    const bc = tex(pbr.baseColorTexture, true);
    if (bc) mat.map = bc;

    if (!unlit) {
      mat.metalness = pbr.metallicFactor != null ? pbr.metallicFactor : (isDefault ? 0 : 1);
      mat.roughness = pbr.roughnessFactor != null ? pbr.roughnessFactor : (isDefault ? 0.8 : 1);
      const mr = tex(pbr.metallicRoughnessTexture, false);
      if (mr) { mat.metalnessMap = mr; mat.roughnessMap = mr; }
      const nm = tex(m.normalTexture, false);
      if (nm) {
        mat.normalMap = nm;
        const s = m.normalTexture.scale != null ? m.normalTexture.scale : 1;
        mat.normalScale.set(s, s);
      }
      const ao = tex(m.occlusionTexture, false);
      if (ao) mat.aoMap = ao;
      const ef = m.emissiveFactor || [0, 0, 0];
      mat.emissive.setRGB(ef[0], ef[1], ef[2]);
      const em = tex(m.emissiveTexture, true);
      if (em) mat.emissiveMap = em;
    }

    if (m.alphaMode === 'MASK') {
      mat.alphaTest = m.alphaCutoff != null ? m.alphaCutoff : 0.5;
    } else if (m.alphaMode === 'BLEND') {
      mat.transparent = true;
      mat.depthWrite = false;
      mat.opacity = base[3];
    }

    mat.userData.gltfColor = [base[0], base[1], base[2]];
    return mat;
  }

  function parseGLB(THREE, buffer) {
    if (buffer.byteLength < 20) throw new Error('file is too small to be a GLB');
    const dv = new DataView(buffer);
    if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('not a GLB file');
    if (dv.getUint32(4, true) !== 2) throw new Error('only glTF 2.0 binary (.glb) is supported');

    let off = 12, json = null, bin = new Uint8Array(0);
    while (off + 8 <= buffer.byteLength) {
      const len = dv.getUint32(off, true);
      const type = dv.getUint32(off + 4, true);
      const start = off + 8;
      if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, start, len)));
      else if (type === 0x004e4942) bin = new Uint8Array(buffer, start, len);
      off = start + len + ((4 - (len % 4)) % 4);
    }
    if (!json) throw new Error('no JSON chunk found');

    const required = json.extensionsRequired || [];
    for (const ext of ['KHR_draco_mesh_compression', 'EXT_meshopt_compression']) {
      if (required.includes(ext)) throw new Error('uses ' + ext + ' - re-export without compression');
    }

    const nodes = json.nodes || [];
    const isChild = new Set();
    nodes.forEach((n) => (n.children || []).forEach((c) => isChild.add(c)));
    let roots = ((json.scenes || [])[json.scene || 0] || {}).nodes;
    if (!roots || !roots.length) roots = nodes.map((_, i) => i).filter((i) => !isChild.has(i));

    const local = (n) => (n.matrix
      ? new THREE.Matrix4().fromArray(n.matrix)
      : new THREE.Matrix4().compose(
        new THREE.Vector3().fromArray(n.translation || [0, 0, 0]),
        new THREE.Quaternion().fromArray(n.rotation || [0, 0, 0, 1]),
        new THREE.Vector3().fromArray(n.scale || [1, 1, 1])));

    const world = new Array(nodes.length).fill(null);
    const visit = (i, parent) => {
      world[i] = parent.clone().multiply(local(nodes[i]));
      for (const c of nodes[i].children || []) visit(c, world[i]);
    };
    for (const r of roots) visit(r, new THREE.Matrix4());

    const warnings = [];
    if (json.skins && json.skins.length) warnings.push('skinned - renders in bind pose');
    if (json.animations && json.animations.length) warnings.push('has animations - ignored');

    const texCache = new Map();
    const getTex = (index, srgb) => {
      const key = index + (srgb ? 's' : 'l');
      if (!texCache.has(key)) {
        const t = json.textures && json.textures[index];
        let src = t && t.source;
        if (t && src == null && t.extensions) {
          for (const e of Object.values(t.extensions)) {
            if (e && e.source != null) { src = e.source; break; }
          }
        }
        const uri = src != null ? imageURI(json, bin, src) : null;
        const sampler = t && t.sampler != null && json.samplers ? json.samplers[t.sampler] : null;
        texCache.set(key, uri ? makeTexture(THREE, uri, srgb, sampler) : null);
      }
      return texCache.get(key);
    };

    const matCache = new Map();
    const matFor = (i) => {
      if (!matCache.has(i)) matCache.set(i, buildMaterial(THREE, (json.materials || [])[i], getTex));
      return matCache.get(i);
    };

    const parts = [];
    const v = new THREE.Vector3();
    let verts = 0, tris = 0;

    nodes.forEach((node, ni) => {
      if (node.mesh == null || !world[ni] || !json.meshes || !json.meshes[node.mesh]) return;
      const M = world[ni];
      const NM = new THREE.Matrix3().getNormalMatrix(M);
      const flip = M.determinant() < 0;

      json.meshes[node.mesh].primitives.forEach((p) => {
        if ((p.mode != null && p.mode !== 4) || p.attributes.POSITION == null) return;

        const P = readAccessor(json, bin, p.attributes.POSITION);
        const count = P.length / 3;
        const pos = new Float32Array(count * 3);
        for (let k = 0; k < count; k++) v.fromArray(P, k * 3).applyMatrix4(M).toArray(pos, k * 3);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        if (p.attributes.NORMAL != null) {
          const N = readAccessor(json, bin, p.attributes.NORMAL);
          const nrm = new Float32Array(count * 3);
          for (let k = 0; k < count; k++) v.fromArray(N, k * 3).applyMatrix3(NM).normalize().toArray(nrm, k * 3);
          geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
        }
        if (p.attributes.TEXCOORD_0 != null) {
          const uv = new THREE.BufferAttribute(Float32Array.from(readAccessor(json, bin, p.attributes.TEXCOORD_0)), 2);
          geo.setAttribute('uv', uv);
          geo.setAttribute('uv2', uv);
        }

        const src = p.indices != null ? readAccessor(json, bin, p.indices) : null;
        const Idx = count < 65536 ? Uint16Array : Uint32Array;
        const idx = new Idx(src ? src.length : count);
        if (src) idx.set(src); else for (let k = 0; k < count; k++) idx[k] = k;
        if (flip) {
          for (let k = 0; k + 2 < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
        }
        geo.setIndex(new THREE.BufferAttribute(idx, 1));
        if (!geo.getAttribute('normal')) geo.computeVertexNormals();

        parts.push({ geo, mat: matFor(p.material) });
        verts += count;
        tris += idx.length / 3;
      });
    });

    if (!parts.length) throw new Error('no triangle geometry found');

    const group = new THREE.Group();
    const box = new THREE.Box3();
    for (const part of parts) {
      const mesh = new THREE.Mesh(part.geo, part.mat);
      mesh.castShadow = CFG.shadows;
      group.add(mesh);
      part.geo.computeBoundingBox();
      box.union(part.geo.boundingBox);
    }

    const mats = [...new Set(parts.map((p) => p.mat))];
    return {
      group,
      parts,
      mats,
      textures: [...texCache.values()].filter(Boolean),
      size: box.getSize(new THREE.Vector3()),
      centre: box.getCenter(new THREE.Vector3()),
      min: box.min.clone(),
      verts,
      tris,
      textured: mats.filter((m) => m.map || m.normalMap || m.emissiveMap).length,
      warnings,
    };
  }

  function disposeModel(model) {
    if (!model || model.builtin) return;
    for (const p of model.parts) p.geo.dispose();
    for (const m of model.mats) m.dispose();
    for (const t of model.textures || []) t.dispose();
  }

  function sphereModel(THREE) {
    if (S.sphere) return S.sphere;
    const geo = new THREE.SphereGeometry(1, 48, 32);
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = CFG.shadows;
    const group = new THREE.Group();
    group.add(mesh);
    S.sphere = {
      name: 'built-in sphere',
      builtin: true,
      group,
      parts: [{ geo, mat }],
      mats: [mat],
      size: bb.getSize(new THREE.Vector3()),
      centre: bb.getCenter(new THREE.Vector3()),
      min: bb.min.clone(),
      verts: geo.getAttribute('position').count,
      tris: geo.index.count / 3,
      textured: 0,
      warnings: [],
    };
    return S.sphere;
  }

  const activeModel = (THREE) => (CFG.useUpload && S.upload ? S.upload : sphereModel(THREE));

  function hookThree(T) {
    if (!T || !T.Object3D || !T.WebGLRenderer) return false;
    try {
      if (!T.WebGLRenderer.__rbOrbWrapped) {
        const Orig = T.WebGLRenderer;
        const Wrapped = function (...args) {
          const r = new Orig(...args);
          const render = r.render.bind(r);
          r.render = function (scene, cam) {
            if (!S.scenes.has(scene)) {
              S.scenes.add(scene);
              scene.__rbRenderer = r;
              scene.traverse((o) => { if (o.isMesh && o.name === 'SM_Character') S.beans.add(o); });
            }
            scene.__rbCam = cam;
            return render(scene, cam);
          };
          return r;
        };
        Wrapped.prototype = Orig.prototype;
        Wrapped.__rbOrbWrapped = true;
        T.WebGLRenderer = Wrapped;
      }

      const proto = T.Object3D.prototype;
      if (!proto.__rbOrbAddHooked) {
        const add = proto.add;
        proto.add = function (...objs) {
          const out = add.apply(this, objs);
          for (const o of objs) if (o && o.isMesh && o.name === 'SM_Character') S.beans.add(o);
          return out;
        };
        proto.__rbOrbAddHooked = true;
      }
    } catch (e) {
      console.warn('[model] could not hook three.js', e);
      return false;
    }
    S.T = T;
    return true;
  }

  if (!hookThree(window.THREE)) {
    const iv = setInterval(() => { if (hookThree(window.THREE)) clearInterval(iv); }, 20);
  }

  if (!Storage.prototype.__rbOrbHooked) {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k) {
      const out = set.apply(this, arguments);
      if (typeof k === 'string' && k.indexOf('playerColor') === 0) S.dirty = true;
      return out;
    };
    Storage.prototype.__rbOrbHooked = true;
  }

  const whenThree = () => new Promise((res) => {
    const t = () => (S.T ? res() : setTimeout(t, 50));
    t();
  });

  let K = null;
  const scratch = (THREE) => K || (K = {
    rot: new THREE.Matrix4(),
    scl: new THREE.Matrix4(),
    inv: new THREE.Matrix4(),
    v1: new THREE.Vector3(),
    v2: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    e: new THREE.Euler(),
  });

  function slotColour(THREE, i) {
    const c = new THREE.Color();
    try {
      const n = parseInt(localStorage.getItem('playerColor' + (i > 1 ? i : '')), 10);
      if (PALETTE[n] != null) return c.setHex(PALETTE[n]);
    } catch (e) { /* fall through to the tab */ }
    const el = document.getElementById('custom-color-' + i + '-tab');
    const bg = el && getComputedStyle(el).backgroundColor;
    return bg && bg !== 'rgba(0, 0, 0, 0)' ? c.setStyle(bg) : null;
  }

  const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a || 1)));
    return t * t * (3 - 2 * t);
  };

  function setVertexColours(mat, on) {
    if (mat.vertexColors !== on) { mat.vertexColors = on; mat.needsUpdate = true; }
  }

  function applyColours(THREE, model) {
    if (!model) return;
    const src = model.builtin && CFG.colourSource === 'model' ? 'game-bands' : CFG.colourSource;

    for (const m of model.mats) {
      const g = m.userData.gltfColor || [1, 1, 1];
      m.color.setRGB(g[0], g[1], g[2]);
    }

    if (src === 'model') {
      for (const m of model.mats) setVertexColours(m, false);
      return;
    }

    const c1 = slotColour(THREE, 1) || new THREE.Color(1, 1, 1);
    const c2 = slotColour(THREE, 2) || c1;
    const c3 = slotColour(THREE, 3) || c1;

    if (src === 'game-materials') {
      model.mats.forEach((m, i) => {
        const c = [c1, c2, c3][i % 3];
        m.color.multiply(c);
        setVertexColours(m, false);
      });
      return;
    }

    const flat = src === 'game-flat';
    const minY = model.min.y;
    const h = model.size.y || 1;
    const tmp = new THREE.Color();

    for (const part of model.parts) {
      const geo = part.geo;
      const pos = geo.getAttribute('position');
      let col = geo.getAttribute('color');
      if (!col || col.count !== pos.count) {
        col = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
        geo.setAttribute('color', col);
      }
      for (let i = 0; i < col.count; i++) {
        if (flat) tmp.copy(c1);
        else {
          const t = (pos.getY(i) - minY) / h;
          tmp.copy(c3)
            .lerp(c1, smoothstep(CFG.band1 - CFG.softness, CFG.band1 + CFG.softness, t))
            .lerp(c2, smoothstep(CFG.band2 - CFG.softness, CFG.band2 + CFG.softness, t));
        }
        col.setXYZ(i, tmp.r, tmp.g, tmp.b);
      }
      col.needsUpdate = true;
      setVertexColours(part.mat, true);
    }
  }

  function fitScale(model, bb) {
    const bh = bb.max.y - bb.min.y || 1;
    const bw = bb.max.x - bb.min.x || 1;
    const bd = bb.max.z - bb.min.z || 1;
    let ref = model.size.y;
    let target = bh;
    if (CFG.fit === 'maxdim') {
      ref = Math.max(model.size.x, model.size.y, model.size.z);
      target = Math.max(bh, bw, bd);
    } else if (CFG.fit === 'diagonal') {
      ref = model.size.length();
    }
    return (target * CFG.size) / (ref || 1);
  }

  function updateOffset(THREE, orb) {
    const model = S.model;
    const k = scratch(THREE);
    const g = orb.bean.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    const bb = g.boundingBox;
    const bh = bb.max.y - bb.min.y || 1;
    const s = fitScale(model, bb);

    const cx = (bb.min.x + bb.max.x) / 2 + CFG.offsetX * bh;
    const cz = (bb.min.z + bb.max.z) / 2 + CFG.offsetZ * bh;
    const cy = (CFG.anchor === 'feet' ? bb.min.y + (model.size.y * s) / 2 : bb.min.y + bh / 2)
      + CFG.offsetY * bh;

    const mc = model.centre;
    const cs = Math.cos(orb.yaw), sn = Math.sin(orb.yaw);
    const rx = mc.x * cs + mc.z * sn;
    const rz = -mc.x * sn + mc.z * cs;

    orb.offset
      .makeTranslation(cx - s * rx, cy - s * mc.y, cz - s * rz)
      .multiply(k.rot.makeRotationY(orb.yaw))
      .multiply(k.scl.makeScale(s, s, s));
  }

  function setShadows(orb) {
    orb.shadows = CFG.shadows;
    orb.group.traverse((o) => { if (o.isMesh) o.castShadow = CFG.shadows; });
  }

  function mountModel(orb) {
    if (orb.holder) orb.group.remove(orb.holder);
    orb.holder = S.model.group.clone(true);
    orb.group.add(orb.holder);
    orb.model = S.model;
    setShadows(orb);
  }

  function attachOrb(THREE, bean) {
    if (!bean.parent) return null;
    const k = scratch(THREE);
    const group = new THREE.Group();
    group.matrixAutoUpdate = false;

    const orb = {
      group, bean, parent: bean.parent, holder: null,
      model: null, shadows: null, offset: new THREE.Matrix4(), yaw: 0,
    };
    const base = THREE.Object3D.prototype.updateMatrixWorld;

    group.updateMatrixWorld = function (force) {
      if (bean.matrixAutoUpdate) {
        this.matrix.multiplyMatrices(bean.matrix, orb.offset);
      } else {
        k.inv.copy(orb.parent.matrixWorld).invert();
        this.matrix.multiplyMatrices(k.inv, bean.matrixWorld).multiply(orb.offset);
      }
      this.matrixWorldNeedsUpdate = true;
      bean.visible = false;
      base.call(this, force);
    };

    orb.parent.add(group);
    S.orbs.set(bean, orb);
    return orb;
  }

  function detachOrb(orb) {
    orb.bean.visible = true;
    if (orb.group.parent) orb.group.parent.remove(orb.group);
    S.orbs.delete(orb.bean);
  }

  const releaseAll = () => { for (const o of [...S.orbs.values()]) detachOrb(o); };

  const seen = { root: null, player: false };
  function ancestry(bean) {
    let n = bean.parent;
    seen.player = false;
    for (;;) {
      if (n.isPlayer) seen.player = true;
      if (!n.parent) break;
      n = n.parent;
    }
    seen.root = n;
    return seen;
  }

  function isOwnBean(bean) {
    let n = bean.parent;
    while (n) {
      if (n.isPlayer) return !n.children.some((c) => /^label-/i.test(c.name || ''));
      n = n.parent;
    }
    return true;
  }

  function isOwnPreview(root) {
    const r = root.__rbRenderer;
    return !!(r && r.domElement && r.domElement.id === 'animated-skin-preview');
  }

  function chooseTargets() {
    const out = [];
    let mine = null;
    for (const bean of S.beans) {
      if (!bean.parent) { S.beans.delete(bean); continue; }
      const { root, player } = ancestry(bean);
      if (!S.scenes.has(root)) continue;
      if (player) {
        if (CFG.allPlayers) out.push(bean);
        else if (!mine && isOwnBean(bean)) mine = bean;
      } else if (CFG.allPlayers || !CFG.onlyOwnBean || isOwnPreview(root)) {
        out.push(bean);
      }
    }
    if (mine) out.push(mine);
    return out;
  }

  function headingFor(THREE, bean, info) {
    const user = CFG.yaw * DEG;
    if (!CFG.matchFacing) return user;
    const k = scratch(THREE);
    if (!info.player) {
      const cam = info.root.__rbCam;
      if (!cam) return user;
      bean.getWorldPosition(k.v1);
      cam.getWorldPosition(k.v2);
      return Math.atan2(k.v2.x - k.v1.x, k.v2.z - k.v1.z) + user;
    }
    if (CFG.gameHeading === 'copy') {
      bean.matrixWorld.decompose(k.v1, k.q, k.v2);
      return k.e.setFromQuaternion(k.q, 'YXZ').y + user;
    }
    return user;
  }

  function tick() {
    requestAnimationFrame(tick);
    const THREE = S.T;
    if (!THREE) return;

    if (!CFG.enabled) { releaseAll(); return; }

    const want = activeModel(THREE);
    if (want !== S.model) { S.model = want; S.dirty = true; }

    const ck = [CFG.colourSource, CFG.band1, CFG.band2, CFG.softness].join();
    if (ck !== S.colourKey) { S.colourKey = ck; S.dirty = true; }

    if (S.dirty) {
      S.dirty = false;
      try { applyColours(THREE, S.model); } catch (e) { console.warn('[model] colours', e); }
    }

    const targets = chooseTargets();
    for (const [bean, orb] of S.orbs) if (!targets.includes(bean)) detachOrb(orb);

    for (const bean of targets) {
      const orb = S.orbs.get(bean) || attachOrb(THREE, bean);
      if (!orb) continue;
      if (orb.parent !== bean.parent) {
        orb.parent = bean.parent;
        orb.parent.add(orb.group);
      }
      if (orb.model !== S.model) mountModel(orb);
      else if (orb.shadows !== CFG.shadows) setShadows(orb);

      orb.yaw = headingFor(THREE, bean, ancestry(bean));
      updateOffset(THREE, orb);
    }
  }
  requestAnimationFrame(tick);

  function describe(m, prefix) {
    return prefix + ' ' + m.name + ' - ' + m.verts.toLocaleString() + ' verts, ' +
      Math.round(m.tris).toLocaleString() + ' tris, ' + m.mats.length + ' material(s), ' +
      (m.textured ? m.textured + ' textured' : 'no textures') +
      (m.warnings.length ? '\n' + m.warnings.join(', ') : '');
  }

  function setUpload(buffer, name, activate, prefix) {
    const THREE = S.T;
    if (!THREE) { setStatus('three.js is not ready yet, try again in a moment', true); return false; }
    try {
      const model = parseGLB(THREE, buffer);
      model.name = name;
      const old = S.upload;
      S.upload = model;
      if (activate) CFG.useUpload = true;
      S.dirty = true;
      if (old) setTimeout(() => disposeModel(old), 1000);
      setStatus(describe(model, prefix || 'Loaded'));
      saveCfg();
      syncUI();
      return true;
    } catch (e) {
      setStatus('Could not read that GLB: ' + e.message, true);
      return false;
    }
  }

  async function loadFile(file) {
    const buffer = await file.arrayBuffer();
    if (!setUpload(buffer, file.name, true)) return;
    try {
      await idb.set('glb', { name: file.name, buffer });
    } catch (e) {
      setStatus(S.status + '\n(could not save it - re-upload after a reload)', true);
    }
  }

  async function restore() {
    let saved = null;
    try { saved = await idb.get('glb'); } catch (e) { /* ignore */ }

    let legacy = null;
    if (!saved) {
      legacy = readLegacyGlb();
      if (legacy) saved = { name: 'saved model', buffer: legacy };
    }
    if (!saved) return;

    await whenThree();
    if (!setUpload(saved.buffer, saved.name, false, 'Restored')) return;
    if (legacy) {
      try {
        await idb.set('glb', saved);
        localStorage.removeItem(LS_GLB_LEGACY);
      } catch (e) { /* keep the legacy copy */ }
    }
  }
  restore();

  const UI = [
    [
      { k: 'colourSource', l: 'colours', t: 'select', o: [
        ['model', 'from the model'],
        ['game-bands', 'game colours (bands)'],
        ['game-flat', 'game colours (flat)'],
        ['game-materials', 'game colours (per material)'],
      ] },
      { k: 'band1', l: 'band 1', t: 'range', min: 0, max: 1, step: 0.01, d: 2, when: (c) => c.colourSource === 'game-bands' },
      { k: 'band2', l: 'band 2', t: 'range', min: 0, max: 1, step: 0.01, d: 2, when: (c) => c.colourSource === 'game-bands' },
      { k: 'softness', l: 'softness', t: 'range', min: 0.001, max: 0.3, step: 0.005, d: 3, when: (c) => c.colourSource === 'game-bands' },
    ],
    [
      { k: 'fit', l: 'fit to', t: 'select', o: [
        ['height', 'bean height'],
        ['maxdim', "bean's largest side"],
        ['diagonal', 'model diagonal to bean height'],
      ] },
      { k: 'size', l: 'size', t: 'range', min: 0.1, max: 3, step: 0.01, d: 2 },
      { k: 'anchor', l: 'anchor', t: 'select', o: [['centre', 'centre of bean'], ['feet', 'stand on floor']] },
      { k: 'yaw', l: 'yaw', t: 'range', min: -180, max: 180, step: 1, d: 0 },
      { k: 'offsetX', l: 'offset x', t: 'range', min: -1, max: 1, step: 0.01, d: 2 },
      { k: 'offsetY', l: 'offset y', t: 'range', min: -1, max: 1, step: 0.01, d: 2 },
      { k: 'offsetZ', l: 'offset z', t: 'range', min: -1, max: 1, step: 0.01, d: 2 },
      { k: 'matchFacing', l: 'face the right way', t: 'check' },
      { k: 'gameHeading', l: 'in-game heading', t: 'select', when: (c) => c.matchFacing, o: [
        ['inherit', 'inherit from bean'],
        ['copy', 'add bean heading'],
      ] },
      { k: 'shadows', l: 'cast shadows', t: 'check' },
    ],
    [
      { k: 'onlyOwnBean', l: 'only my own bean', t: 'check' },
      { k: 'allPlayers', l: 'every player', t: 'check' },
      { k: 'enabled', l: 'effect enabled', t: 'check' },
    ],
  ];
  const CONTROLS = UI.flat();

  let panel = null, statusEl = null;

  function setStatus(msg, bad) {
    S.status = msg;
    S.statusBad = !!bad;
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.style.color = bad ? '#ff8a80' : '#cfe3ff';
    }
  }

  function controlHTML(c) {
    const id = 'rb_' + c.k;
    if (c.t === 'select') {
      return `<label class="row" data-k="${c.k}"><span>${c.l}</span><select id="${id}">${
        c.o.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></label>`;
    }
    if (c.t === 'range') {
      return `<label class="row" data-k="${c.k}"><span>${c.l}</span><input type="range" id="${id}" min="${c.min}" max="${c.max}" step="${c.step}"><span class="val" id="${id}_v"></span></label>`;
    }
    return `<label class="row chk" data-k="${c.k}"><input type="checkbox" id="${id}"> ${c.l}</label>`;
  }

  function buildPanel() {
    if (panel) return;
    const style = document.createElement('style');
    style.textContent = `
      #rbPanel{position:fixed;top:0;right:0;width:330px;max-height:100vh;overflow:auto;z-index:2147483000;
        background:rgba(16,18,26,.94);color:#e8eefc;border:1px solid #2b3348;border-left:0;
        font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px;box-shadow:-6px 0 24px rgba(0,0,0,.4)}
      #rbPanel h2{margin:0 0 10px;font-size:13px;letter-spacing:.06em;color:#8fd3ff}
      #rbPanel .grp{border-top:1px solid #262d40;padding-top:9px;margin-top:9px}
      #rbPanel label.row{display:flex;align-items:center;gap:8px;margin:5px 0}
      #rbPanel label.row>span:first-child{flex:0 0 108px;color:#9fb0d0}
      #rbPanel select,#rbPanel input[type=range]{flex:1;min-width:0}
      #rbPanel select{background:#1b2130;color:#dce7ff;border:1px solid #333d55;border-radius:4px;padding:2px}
      #rbPanel input[type=range]{accent-color:#4aa3ff}
      #rbPanel .val{flex:0 0 42px;text-align:right;color:#7fe0b0;font-variant-numeric:tabular-nums}
      #rbPanel .chk{justify-content:flex-start}
      #rbPanel input[type=file]{width:100%;color:#9fb0d0}
      #rbPanel button{background:#243149;color:#dce7ff;border:1px solid #3b4763;border-radius:4px;padding:4px 8px;cursor:pointer}
      #rbPanel button:hover{background:#2e3d5c}
      #rbPanel .btns{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
      #rbStatus{margin-top:9px;white-space:pre-wrap}
    `;
    (document.head || document.documentElement).appendChild(style);

    panel = document.createElement('div');
    panel.id = 'rbPanel';
    panel.style.display = 'none';
    panel.innerHTML = `
      <h2>BEAN MODEL <span style="color:#5f6f8c">${CFG.panelHotkey} to close</span></h2>
      <div class="grp">
        <input type="file" id="rbFile" accept=".glb,model/gltf-binary">
        <div class="btns">
          <button id="rbSphere">use built-in sphere</button>
          <button id="rbForget">forget saved</button>
        </div>
        <div id="rbStatus"></div>
      </div>
      ${UI.map((g) => `<div class="grp">${g.map(controlHTML).join('')}</div>`).join('')}
      <div class="grp"><div class="btns"><button id="rbReset">reset tweaks</button></div></div>
    `;
    (document.body || document.documentElement).appendChild(panel);

    for (const type of ['keydown', 'keyup']) {
      panel.addEventListener(type, (e) => { if (e.key !== CFG.panelHotkey) e.stopPropagation(); });
    }

    statusEl = panel.querySelector('#rbStatus');
    setStatus(S.status, S.statusBad);

    panel.querySelector('#rbFile').addEventListener('change', async (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (f) await loadFile(f);
    });

    for (const c of CONTROLS) {
      const el = panel.querySelector('#rb_' + c.k);
      const onInput = () => {
        CFG[c.k] = c.t === 'check' ? el.checked : c.t === 'range' ? parseFloat(el.value) : el.value;
        saveCfg();
        syncUI();
      };
      el.addEventListener('input', onInput);
      el.addEventListener('change', onInput);
    }

    panel.querySelector('#rbSphere').addEventListener('click', () => {
      CFG.useUpload = false;
      saveCfg();
      setStatus('Using the built-in sphere.');
    });

    panel.querySelector('#rbForget').addEventListener('click', async () => {
      try { await idb.del('glb'); } catch (e) { /* ignore */ }
      try { localStorage.removeItem(LS_GLB_LEGACY); } catch (e) { /* ignore */ }
      const old = S.upload;
      S.upload = null;
      CFG.useUpload = false;
      saveCfg();
      if (old) setTimeout(() => disposeModel(old), 1000);
      setStatus('Saved model cleared.');
    });

    panel.querySelector('#rbReset').addEventListener('click', () => {
      for (const k of ['size', 'fit', 'anchor', 'yaw', 'offsetX', 'offsetY', 'offsetZ', 'matchFacing', 'gameHeading']) {
        CFG[k] = DEFAULTS[k];
      }
      saveCfg();
      syncUI();
      setStatus('Tweaks reset.');
    });

    syncUI();
  }

  function syncUI() {
    if (!panel) return;
    for (const c of CONTROLS) {
      const el = panel.querySelector('#rb_' + c.k);
      const val = CFG[c.k];
      if (c.t === 'check') el.checked = !!val;
      else el.value = val;
      if (c.t === 'range') panel.querySelector('#rb_' + c.k + '_v').textContent = (+val).toFixed(c.d);
      if (c.when) panel.querySelector('[data-k="' + c.k + '"]').style.display = c.when(CFG) ? '' : 'none';
    }
  }

  function togglePanel(force) {
    if (!panel) buildPanel();
    const show = force != null ? force : panel.style.display === 'none';
    panel.style.display = show ? 'block' : 'none';
    if (show) {
      if (document.pointerLockElement && document.exitPointerLock) document.exitPointerLock();
      syncUI();
    }
  }

  function matchesHotkey(e, combo) {
    const parts = combo.toLowerCase().split('+');
    const key = parts.pop();
    if (e.altKey !== parts.includes('alt') || e.ctrlKey !== parts.includes('ctrl') ||
        e.shiftKey !== parts.includes('shift') || e.metaKey !== parts.includes('meta')) return false;
    return e.code === 'Key' + key.toUpperCase() || (e.key || '').toLowerCase() === key;
  }

  addEventListener('keydown', (e) => {
    if (e.key === CFG.panelHotkey) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) togglePanel();
      return;
    }
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.repeat || !matchesHotkey(e, CFG.hotkey)) return;
    CFG.enabled = !CFG.enabled;
    saveCfg();
    syncUI();
    console.log('[model]', CFG.enabled ? 'on' : 'off');
  }, true);
})();
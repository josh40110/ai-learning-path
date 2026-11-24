"use strict";
(function () {
  const HX = 22, HY = 11, HZ = 22;
  const P = (x, y, z = 0) => [(x - y) * HX, (x + y) * HY - z * HZ];
  const f = (n) => Math.round(n * 10) / 10;
  const pts = (a) => a.map(p => `${f(p[0])},${f(p[1])}`).join(" ");
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, html = "") => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };

  
  function kit(L) {                                    
    const col = (c, face) => c.startsWith("#") || c.startsWith("var") ? c : `var(--${c}-${face})`;
    const poly = (p, fill, cls = "e", extra = "") => `<polygon class="${cls}" points="${pts(p)}" fill="${fill}" ${extra}/>`;
    const k = {
      L,
      box(x, y, z, w, d, h, c = L) {
        return poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], col(c, "l")) +
               poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], col(c, "r")) +
               poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], col(c, "t"));
      },
      top(x, y, z, w, d, fill) { return poly([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)], fill); },
      
      ly(y, x0, x1, z0, z1, fill, cls = "e") { return poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], fill, cls); },
      rx(x, y0, y1, z0, z1, fill, cls = "e") { return poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)], fill, cls); },
      cyl(x, y, z, r, h, c = L) {
        const [cx, b] = P(x, y, z), t = b - h * HZ, rx = r * HX * Math.SQRT2, ry = r * HY * Math.SQRT2;
        return `<path class="e" d="M${f(cx - rx)},${f(t)} V${f(b)} A${f(rx)},${f(ry)} 0 0 0 ${f(cx + rx)},${f(b)} V${f(t)} Z" fill="${col(c, "l")}"/>` +
               `<path d="M${f(cx)},${f(t)} V${f(b + ry)} A${f(rx)},${f(ry)} 0 0 0 ${f(cx + rx)},${f(b)} V${f(t)} Z" fill="${col(c, "r")}" opacity=".75"/>` +
               `<ellipse class="e" cx="${f(cx)}" cy="${f(t)}" rx="${f(rx)}" ry="${f(ry)}" fill="${col(c, "t")}"/>`;
      },
      ell(x, y, z, r, fill, extra = "") { const [cx, cy] = P(x, y, z); return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r * HX * Math.SQRT2)}" ry="${f(r * HY * Math.SQRT2)}" fill="${fill}" ${extra}/>`; },
      dot(x, y, z, r, fill, cls = "e") { const [cx, cy] = P(x, y, z); return `<circle class="${cls}" cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}"/>`; },
      line(a, b, stroke, w = 1.4) { const p = P(...a), q = P(...b); return `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`; },
      wire(list, stroke, w = 1.6) { return `<polyline points="${pts(list.map(p => P(...p)))}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; },
      
      man(x, y, z, c = L, s = 1) {
        const [cx, cy] = P(x, y, z), w = 13 * s, h = 22 * s;
        return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w * .62)}" ry="${f(w * .3)}" fill="rgba(0,0,0,.28)"/>` +
               `<rect class="e" x="${f(cx - w / 2)}" y="${f(cy - h)}" width="${f(w)}" height="${f(h)}" rx="${f(w / 2)}" fill="var(--${c}-l)"/>` +
               `<circle class="e" cx="${f(cx)}" cy="${f(cy - h - 3.5 * s)}" r="${f(6.4 * s)}" fill="var(--paper)"/>`;
      },
      bot(x, y, z, c = L, s = 1) {
        const [cx, cy] = P(x, y, z), w = 15 * s, h = 17 * s, hw = 17 * s, hh = 13 * s, hy = cy - h - hh + 1;
        return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w * .62)}" ry="${f(w * .3)}" fill="rgba(0,0,0,.28)"/>` +
               `<rect class="e" x="${f(cx - w / 2)}" y="${f(cy - h)}" width="${f(w)}" height="${f(h)}" rx="${f(5 * s)}" fill="var(--${c}-l)"/>` +
               `<rect class="e" x="${f(cx - hw / 2)}" y="${f(hy)}" width="${f(hw)}" height="${f(hh)}" rx="${f(4.5 * s)}" fill="var(--${c}-t)"/>` +
               `<rect x="${f(cx - hw / 2 + 2.6 * s)}" y="${f(hy + 3 * s)}" width="${f(hw - 5.2 * s)}" height="${f(hh - 6.4 * s)}" rx="${f(2.6 * s)}" fill="var(--glass)"/>` +
               `<circle cx="${f(cx - 3 * s)}" cy="${f(hy + 6.2 * s)}" r="${f(1.35 * s)}" fill="var(--screen)"/><circle cx="${f(cx + 3 * s)}" cy="${f(hy + 6.2 * s)}" r="${f(1.35 * s)}" fill="var(--screen)"/>`;
      },
      legs(x, y, w, d, h, c = "n") { const t = .16; return [[x, y], [x + w - t, y], [x, y + d - t], [x + w - t, y + d - t]].map(([a, b]) => k.box(a, b, 0, t, t, h, c)).join(""); },
      paper(x, y, z, w, d, n = 3) { let s = k.box(x, y, z, w, d, .06, "paper"); for (let i = 0; i < n; i++) s += k.line([x + w * .18, y + d * (.22 + i * .22), z + .06], [x + w * .82, y + d * (.22 + i * .22), z + .06], "var(--ink-mark)", 1); return s; },
      laptop(x, y, z) { return k.box(x, y, z, .95, .8, .07, "n") + k.top(x + .14, y + .3, z + .075, .66, .36, "var(--glass)") +
        poly([P(x, y + .04, z + .07), P(x + .95, y + .04, z + .07), P(x + .95, y - .14, z + .78), P(x, y - .14, z + .78)], "var(--n-l)") +
        poly([P(x + .08, y + .04, z + .13), P(x + .87, y + .04, z + .13), P(x + .87, y - .12, z + .71), P(x + .08, y - .12, z + .71)], "var(--screen)"); },
    };
    return k;
  }

  
  const M = {
    you(k) { return [k.ell(.8, .8, 0, .62, "var(--you-l)", 'opacity=".22"') + k.man(.8, .8, 0, "you", 1.35), 1.6, 1.6, 2]; },
    desk(k) {                                             
      let s = k.man ? k.box(1.1, -.15, 0, .8, .7, .5, "n") : "";
      s += k.bot(1.5, .25, .5, "you", 1.15);
      s += k.legs(0, .9, 3, 1.5, .95) + k.box(-.08, .84, .95, 3.16, 1.62, .14, "n");
      s += k.laptop(1.05, 1.25, 1.09) + k.paper(.18, 1.1, 1.09, .62, .85) + k.paper(.24, 1.2, 1.15, .62, .85, 2);
      s += k.cyl(2.6, 1.35, 1.09, .13, .26, "paper");
      return [s, 3, 2.4, 2.4];
    },
    poster(k) {                                           
      let s = k.box(.1, .5, 0, .14, .5, .1, "n") + k.box(1.76, .5, 0, .14, .5, .1, "n") + k.box(.12, .68, 0, .1, .1, 2.1, "n") + k.box(1.78, .68, 0, .1, .1, 2.1, "n");
      s += k.box(.05, .66, .55, 1.9, .14, 1.7);
      s += k.ly(.805, .17, 1.83, .67, 2.13, "var(--paper)");
      for (let i = 0; i < 6; i++) s += k.ly(.81, .3, i === 0 ? 1.15 : i % 3 === 2 ? 1.35 : 1.66, 1.98 - i * .21, 2.06 - i * .21, i === 0 ? "var(--rules-l)" : "var(--ink-mark)", "");
      return [s, 2, 1.3, 2.3];
    },
    drawers(k) {                                          
      let s = k.box(0, 0, 0, 2.2, 1, 1.7);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        s += k.ly(1.005, .08 + c * .7, .7 + c * .7, .09 + r * .4, .43 + r * .4, (r * 3 + c) % 5 === 2 ? `var(--${k.L}-t)` : `var(--${k.L}-l)`) + k.ly(1.01, .3 + c * .7, .48 + c * .7, .24 + r * .4, .29 + r * .4, "var(--glass)", "");
      }
      s += k.box(.78, 1, .5, .62, .55, .33) + k.paper(.84, 1.06, .8, .48, .4, 2);
      s += k.paper(.25, .2, 1.7, .7, .6);
      return [s, 2.2, 1.6, 1.8];
    },
    gate(k) {                                             
      let s = k.box(0, 0, 0, .3, .3, 2.3) + k.box(0, 0, 2.3, .3, 2.2, .3) + k.box(0, 1.9, 0, .3, .3, 2.3);
      s += k.rx(.305, .35, 1.85, 2.36, 2.54, "var(--paper)") + k.rx(.31, .5, 1.3, 2.42, 2.48, "var(--know-r)", "");
      s += k.line([.15, .3, 1.15], [.15, 1.9, 1.15], "var(--or)", 2.4) + k.dot(.3, 2.05, 1.6, 2.6, "var(--ok)");
      s += k.box(.55, 2.25, 0, .9, .6, .8, "n") + k.paper(.65, 2.32, .8, .5, .4, 2) + k.bot(1.05, 2.2, .78, "know", .72);
      return [s, 1.5, 2.9, 2.6];
    },
    archive(k) {                                          
      let s = "";
      for (let i = 0; i < 3; i++) {
        const y = i * .95; s += k.box(0, y, 0, 2.9, .5, 1.9);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) s += k.ly(y + .505, .1 + c * .46, .5 + c * .46, .1 + r * .6, .55 + r * .6, (c * 5 + r + i) % 4 ? "var(--paper)" : "var(--know-t)") + k.ly(y + .51, .2 + c * .46, .4 + c * .46, .34 + r * .6, .42 + r * .6, "var(--know-r)", "");
      }
      return [s, 2.9, 2.5, 2];
    },
    board(k) {                                            
      let s = k.box(.1, .3, 0, .12, .5, .1, "n") + k.box(2.18, .3, 0, .12, .5, .1, "n") + k.box(.12, .5, 0, .09, .09, 2, "n") + k.box(2.2, .5, 0, .09, .09, 2, "n");
      s += k.box(0, .48, .5, 2.4, .12, 1.6, "n") + k.ly(.605, .08, 2.32, .58, 2.02, "var(--paper)");
      s += k.ly(.61, .18, 2.22, 1.6, 1.92, "var(--you-t)") + k.dot(.4, .62, 1.76, 2.4, "var(--bad)");
      for (let i = 0; i < 4; i++) s += k.ly(.61, .22, 1.2 + (i % 2) * .7, 1.36 - i * .2, 1.42 - i * .2, "var(--ink-mark)", "");
      s += k.box(.5, .62, 0, 1.2, .5, .5, "know") + k.paper(.65, .66, .5, .7, .4, 2);
      return [s, 2.4, 1.2, 2.2];
    },
    cards(k) {                                            
      let s = k.legs(0, 0, 1.5, 1.2, .55) + k.box(-.05, -.05, .55, 1.6, 1.3, .1, "n") + k.box(.2, .15, .65, 1.1, .85, .4);
      for (let i = 0; i < 4; i++) s += k.ly(.25 + i * .19, .28, 1.2, .95, 1.28 + (i % 2) * .1, i === 2 ? "var(--you-t)" : "var(--paper)");
      s += k.ly(1.005, .2, 1.3, .65, 1.05, "var(--know-l)") + k.ly(1.01, .55, .95, .8, .92, "var(--paper)");
      return [s, 1.5, 1.2, 1.5];
    },
    aides(k) {                                            
      let s = "";
      for (const [x, y] of [[0, 0], [1.75, 0], [0, 1.7], [1.75, 1.7]].slice(0, 3)) s += k.bot(x + .55, y + .2, .25, "hand", .85) + k.legs(x, y + .45, 1.15, .7, .6) + k.box(x - .03, y + .42, .6, 1.21, .76, .09, "n") + k.paper(x + .15, y + .55, .69, .42, .46, 2) + k.box(x + .7, y + .6, .69, .3, .34, .22, "hand");
      return [s, 2.95, 2.9, 1.6];
    },
    pegboard(k) {                                         
      let s = k.box(0, 0, 0, 3, .25, 2.2);
      s += k.ly(.255, .12, 2.88, .12, 2.08, "var(--hand-r)");
      const pal = ["var(--paper)", "var(--you-t)", "var(--know-t)", "var(--rules-t)", "var(--face-t)", "var(--out-t)"];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
        const x = .28 + c * .68, z = 1.25 - r * .82; s += k.ly(.26, x, x + .46, z, z + .5, "var(--paper)") + k.dot(x + .14, .27, z + .28, 1.5, "var(--glass)", "") + k.dot(x + .32, .27, z + .28, 1.5, "var(--glass)", "");
        if ((r * 4 + c) % 3 !== 1) { s += k.box(x + .08, .26, z + .12, .3, .22, .26, pal[(r * 4 + c) % 6]); s += k.wire([[x + .23, .48, z + .2], [x + .23, .8, .3 + c * .05], [x + .6, 1.15 + r * .12, 0]], pal[(r * 4 + c) % 6]); }
      }
      return [s, 3, 1.4, 2.2];
    },
    bench(k) {                                            
      let s = k.legs(0, 0, 3, 1.3, .8) + k.box(-.06, -.06, .8, 3.12, 1.42, .14) + k.paper(.2, .3, .94, .75, .8, 3);
      s += k.line([.3, .5, 1.01], [.36, .58, 1.01], "var(--ok)", 2) + k.box(1.3, .35, .94, .62, .62, .5, "out");
      const [mx, my] = P(2.15, .7, 1.75); s += k.line([2.5, .9, .94], [2.3, .75, 1.5], "var(--n-t)", 4) + `<circle class="e" cx="${f(mx)}" cy="${f(my)}" r="13" fill="var(--screen)" opacity=".55"/><circle cx="${f(mx)}" cy="${f(my)}" r="13" fill="none" stroke="var(--guard-l)" stroke-width="4"/>`;
      return [s, 3, 1.3, 2.2];
    },
    vault(k) {                                            
      let s = k.box(0, 0, 0, .7, 2, 2.1, "n") + k.rx(.705, .15, 1.85, .15, 1.95, "var(--guard-l)");
      const [cx, cy] = P(.72, 1, 1.05); s += `<circle class="e" cx="${f(cx)}" cy="${f(cy)}" r="11" fill="var(--guard-t)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="3" fill="var(--glass)"/>`;
      for (let a = 0; a < 3; a++) { const t = a * Math.PI / 3 + .3; s += `<line x1="${f(cx - Math.cos(t) * 10)}" y1="${f(cy - Math.sin(t) * 10)}" x2="${f(cx + Math.cos(t) * 10)}" y2="${f(cy + Math.sin(t) * 10)}" stroke="var(--glass)" stroke-width="1.8"/>`; }
      s += k.box(0, 0, 2.1, .7, 2, .18, "guard") + k.dot(.72, .3, 1.75, 2.6, "var(--bad)") + k.dot(.72, .55, 1.75, 2.6, "var(--ok)");
      return [s, .9, 2, 2.3];
    },
    disks(k) {                                            
      let s = ""; for (let i = 0; i < 5; i++) s += k.cyl(.9, .9, i * .34, .62, .28, i % 2 ? "n" : k.L);
      return [s, 1.8, 1.8, 1.8];
    },
    dock(k) {                                             
      let s = k.box(0, 0, 0, 3.2, 2.2, .3, "n") + k.box(.2, .2, .3, 1, 1, .9) + k.box(1.35, .25, .3, .85, .85, .65) + k.box(.35, .3, 1.2, .7, .7, .55) + k.box(2.35, .3, .3, .7, .8, .45);
      s += k.ly(1.205, .5, .9, .3, 1.2, "var(--paper)") + k.box(1.2, 1.3, .3, .8, .7, .5) + k.box(.25, 1.4, .3, .7, .6, .4);
      s += k.top(2.3, 1.35, .305, .75, .7, "var(--you-l)");
      return [s, 3.2, 2.2, 1.9];
    },
    school(k) {                                           
      let s = k.box(0, 0, 0, 2.8, .16, 2, "face") + k.ly(.165, .12, 2.68, .5, 1.9, "var(--glass)");
      s += k.wire([[.4, .17, 1.0], [.75, .17, 1.5], [1.1, .17, 1.15], [1.6, .17, 1.65]], "var(--know-t)", 2) + k.dot(.75, .17, 1.5, 2.6, "var(--or)", "") + k.dot(1.6, .17, 1.65, 2.6, "var(--or)", "") + k.ly(.17, 1.9, 2.5, 1.5, 1.56, "var(--paper)", "") + k.ly(.17, 1.9, 2.3, 1.3, 1.36, "var(--paper)", "");
      for (const x of [.3, 1.2, 2.1]) s += k.legs(x, .9, .5, .5, .4) + k.box(x - .03, .87, .4, .56, .56, .08, "face");
      return [s, 2.8, 1.6, 2.1];
    },
    wall(k) {                                             
      let s = k.box(.1, .3, 0, .14, .6, .1, "n") + k.box(2.36, .3, 0, .14, .6, .1, "n") + k.box(.12, .5, 0, .1, .1, .6, "n") + k.box(2.38, .5, 0, .1, .1, .6, "n");
      s += k.box(0, .45, .55, 2.6, .16, 1.75);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        const x = .12 + c * .82, z = .68 + r * .8; s += k.ly(.615, x, x + .72, z, z + .68, "var(--glass)") + k.dot(x + .14, .62, z + .54, 1.8, (r * 3 + c) === 4 ? "var(--bad)" : "var(--ok)", "");
        for (let i = 0; i < 3; i++) s += k.ly(.62, x + .12, x + .34 + ((i + c + r) % 3) * .12, z + .34 - i * .13, z + .39 - i * .13, "var(--screen)", "");
      }
      return [s, 2.6, 1, 2.4];
    },
  };

  
  class Scene {
    constructor(host, data, opt = {}) {
      this.host = host; this.D = data; this.opt = opt;
      this.objs = {}; this.paused = false; this.speed = 1; this.flows = []; this.raf = 0; this.cam = null;
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.svg = svgEl("svg", { role: "group", "aria-label": opt.label || "辦公室舞台" });
      this.svg.innerHTML = `<defs>${["ask", "read", "write", "call", "block"].map(k => `<marker id="ar-${k}" viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="6.4" markerHeight="6.4" orient="auto-start-reverse"><path d="M0,0.6 L7.4,4 L0,7.4 Z" fill="var(--k-${k})"/></marker>`).join("")}</defs>`;
      this.gSlab = svgEl("g"); this.gWire = svgEl("g"); this.gPath = svgEl("g"); this.gObj = svgEl("g"); this.gPk = svgEl("g", { "pointer-events": "none" });
      this.svg.append(this.gSlab, this.gWire, this.gPath, this.gObj, this.gPk);
      this.lbls = document.createElement("div"); this.lbls.className = "lbls"; this.lbls.setAttribute("aria-hidden", "true");
      host.prepend(this.svg, this.lbls);
      this.labels = []; this.build();
      this.ro = new ResizeObserver(() => this.applyCam()); this.ro.observe(host);
      matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", e => { this.reduced = e.matches; if (this.state) this.set(this.state); });
    }
    build() {
      for (const z of this.D.zones) {                      
        const [x, y, w, d] = z.rect, t = .22, g = svgEl("g", { class: "slab hid", "data-zone": z.id });
        g.innerHTML = `<polygon points="${pts([P(x, y + d), P(x + w, y + d), P(x + w, y + d, -t), P(x, y + d, -t)])}" fill="var(--slab-l)" stroke="var(--slab-e)" stroke-width=".7"/><polygon points="${pts([P(x + w, y), P(x + w, y + d), P(x + w, y + d, -t), P(x + w, y, -t)])}" fill="var(--slab-r)" stroke="var(--slab-e)" stroke-width=".7"/><polygon points="${pts([P(x, y), P(x + w, y), P(x + w, y + d), P(x, y + d)])}" fill="var(--slab-t)" stroke="var(--slab-e)" stroke-width="1"/>` +
          Array.from({ length: Math.floor(w) - 1 }, (_, i) => { const a = P(x + i + 1, y), b = P(x + i + 1, y + d); return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="var(--grid)"/>`; }).join("") +
          Array.from({ length: Math.floor(d) - 1 }, (_, i) => { const a = P(x, y + i + 1), b = P(x + w, y + i + 1); return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="var(--grid)"/>`; }).join("");
        const [nx, ny] = P(x + .25, y + d - .22);
        g.innerHTML += `<text class="zname" transform="matrix(.894 .447 -.894 .447 ${f(nx)} ${f(ny)})">${z.name}</text>`;
        this.gSlab.append(g); z.el = g;
      }
      const order = [...this.D.objects].sort((a, b) => (a.pos[0] + a.pos[1]) - (b.pos[0] + b.pos[1]));
      const made = order.map(o => {
        const [body, w, d, h] = M[o.model](kit(o.layer)); return { o, body, w, d, h };
      }).sort((a, b) => (a.o.pos[0] + a.w / 2 + a.o.pos[1] + a.d / 2) - (b.o.pos[0] + b.w / 2 + b.o.pos[1] + b.d / 2));
      for (const { o, body, w, d, h } of made) {
        const [tx, ty] = P(...o.pos), g = svgEl("g", { class: "obj hid", "data-id": o.id, transform: `translate(${f(tx)},${f(ty)})`, tabindex: "-1", role: "button", "aria-label": o.name });
        g.innerHTML = `<polygon class="tile" points="${pts([P(-.15, -.15), P(w + .15, -.15), P(w + .15, d + .15), P(-.15, d + .15)])}"/><g class="body">${body}</g>`;
        this.gObj.append(g);
        const [x, y] = o.pos;
        const c = [x + w / 2, y + d / 2], bb = g.lastElementChild.getBBox(), box = bb.width ? [tx + bb.x, ty + bb.y, tx + bb.x + bb.width, ty + bb.y + bb.height] : [P(x, y + d)[0], P(x, y, h)[1], P(x + w, y)[0], P(x + w, y + d)[1]];  
        const lb = document.createElement("div"); lb.className = "lb mini"; lb.textContent = o.short || o.name; this.lbls.append(lb);
        const q = { o, el: g, w, d, h, c, box, lb, anchor: [(box[0] + box[2]) / 2, box[3] + 5] };
        this.objs[o.id] = q;
        g.addEventListener("click", () => this.opt.pick && this.opt.pick(o.id));
        g.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); this.opt.pick && this.opt.pick(o.id); return; }
          const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key]; if (!dir) return;
          e.preventDefault(); e.stopPropagation();
          const me = this.objs[o.id], at = (q) => [(q.box[0] + q.box[2]) / 2, (q.box[1] + q.box[3]) / 2], [mx, my] = at(me);  
          const best = Object.values(this.objs).filter(q => q !== me && !q.el.classList.contains("hid")).map(q => { const [x, y] = at(q), dx = x - mx, dy = (y - my) * 1.6, along = dx * dir[0] + dy * dir[1], off = Math.abs(dx * dir[1]) + Math.abs(dy * dir[0]); return { q, along, s: along + off * 2 }; }).filter(r => r.along > 6).sort((a, b) => a.s - b.s)[0];
          if (best) { this.rove(best.q.o.id); best.q.el.focus(); }
        });
        const show = (on) => { if (!g.classList.contains("hid")) lb.classList.toggle("mini", !on && !q.named); };
        g.addEventListener("mouseenter", () => show(true)); g.addEventListener("mouseleave", () => show(false)); g.addEventListener("focus", () => show(true)); g.addEventListener("blur", () => show(false));
      }
    }
    
    route(a, b) {
      const A = this.objs[a], B = this.objs[b]; if (!A || !B) return [];
      const [ax, ay] = A.c, [bx, by] = B.c, mx = (ax + bx) / 2, my = (ay + by) / 2;
      const cands = [[[ax, ay], [bx, ay], [bx, by]], [[ax, ay], [ax, by], [bx, by]], [[ax, ay], [mx, ay], [mx, by], [bx, by]], [[ax, ay], [ax, my], [bx, my], [bx, by]]];
      const present = Object.values(this.objs).filter(q => !q.el.classList.contains("hid") && q !== A && q !== B);
      const cost = (p) => { let hit = 0, len = 0; for (let i = 1; i < p.length; i++) { const [x0, y0] = p[i - 1], [x1, y1] = p[i], L = Math.abs(x1 - x0) + Math.abs(y1 - y0); len += L; const n = Math.ceil(L * 2); for (let s = 0; s <= n; s++) { const x = x0 + (x1 - x0) * s / (n || 1), y = y0 + (y1 - y0) * s / (n || 1); for (const q of present) { const [qx, qy] = q.o.pos; if (x > qx - .1 && x < qx + q.w + .1 && y > qy - .1 && y < qy + q.d + .1) hit++; } } } return hit * 3 + len + (p.length - 2) * .6; };
      const best = cands.map(p => p.filter((v, i) => !i || v[0] !== p[i - 1][0] || v[1] !== p[i - 1][1])).sort((p, q) => cost(p) - cost(q))[0];
      const trim = (p, q, o) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, r = Math.min(Math.abs(dx) > Math.abs(dy) ? o.w / 2 + .22 : o.d / 2 + .22, L * .8); return [p[0] + dx / L * r, p[1] + dy / L * r]; };
      const out = best.map(v => [...v]); out[0] = trim(best[0], best[1], A); out[out.length - 1] = trim(best[best.length - 1], best[best.length - 2], B);
      return out.map(v => P(v[0], v[1]));
    }
    
    set(state) {
      this.state = state;
      if (state.snap) { this.host.classList.add("snap"); clearTimeout(this.snapT); this.snapT = setTimeout(() => this.host.classList.remove("snap"), 90); }  
      const S = (k) => new Set(state[k] || []), present = S("present"), fresh = S("fresh"), on = S("on"), named = S("named"), off = S("off");
      const flowIds = new Set((state.flows || []).flatMap(fl => fl.hops.flatMap(h => [h.from, h.to])));
      for (const id in this.objs) {
        const q = this.objs[id], here = present.has(id), cl = q.el.classList;
        cl.toggle("hid", !here); cl.toggle("fresh", fresh.has(id)); cl.toggle("on", on.has(id)); cl.toggle("sel", state.sel === id); cl.toggle("off", off.has(id));
        const back = here && !fresh.has(id) && !on.has(id) && !flowIds.has(id) && state.sel !== id; cl.toggle("dim", back && state.dim === "dim"); cl.toggle("calm", back && state.dim === "calm");
        q.named = here && (named.has(id) || fresh.has(id) || flowIds.has(id) || state.sel === id || on.has(id));
        q.lb.className = `lb${q.named ? "" : " mini"}${fresh.has(id) ? " fresh" : ""}${off.has(id) ? " off" : ""}`;
      }
      if (!present.has(this.tab)) this.tab = state.sel || [...present][0];
      this.rove(state.sel || this.tab);
      for (const z of this.D.zones) z.el.classList.toggle("hid", !this.D.objects.some(o => o.zone === z.id && present.has(o.id)));
      this.drawWires(state.wires || []); this.drawFlows(state.flows || [], state);
      this.focus(state.focus && state.focus.length ? state.focus : [...present], state.snap);
    }
    rove(id) { this.tab = id; for (const k in this.objs) this.objs[k].el.setAttribute("tabindex", k === id ? "0" : "-1"); }
    
    hint(id, on) { const q = this.objs[id]; if (!q || q.el.classList.contains("hid")) return; q.el.classList.toggle("hint", on); if (!q.named) q.lb.classList.toggle("mini", !on); }
    drawWires(list) { this.gWire.innerHTML = list.map(e => `<polyline class="wire" points="${pts(this.route(e.from, e.to))}"/>`).join(""); }
    drawFlows(flows, state) {
      this.gPath.innerHTML = ""; this.gPk.innerHTML = ""; this.labels.forEach(l => l.el.remove()); this.labels = []; this.flows = [];
      let n = 0;
      flows.forEach((fl, fi) => {
        const all = [], marks = []; let len = 0;
        fl.hops.forEach((h, hi) => {
          n++; const p = this.route(h.from, h.to); if (p.length < 2) return;
          const wait = h.wait ? " wait" : "";
          this.gPath.append(svgEl("polyline", { class: `path ${h.kind}${wait}`, points: pts(p), "marker-end": `url(#ar-${h.kind})` }));
          if (h.label) { const el = document.createElement("div"); el.className = `lb hop ${h.kind}${wait}`; el.textContent = (this.reduced ? `${n}. ` : "") + h.label; this.lbls.append(el); this.labels.push({ el, at: this.mid(p), dy: 0 }); }
          if (h.wait) return;
          const seg = []; for (let i = 1; i < p.length; i++) { const L = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); seg.push({ a: p[i - 1], b: p[i], L, s: len }); len += L; }
          all.push(...seg.map(s => ({ ...s, kind: h.kind, hi }))); marks.push({ at: len, to: h.to, kind: h.kind, stop: h.stop });
        });
        if (!all.length) return;
        const g = svgEl("g", { class: "pk" }), c = svgEl("circle", { r: 5.2 }); g.append(c); this.gPk.append(g);
        this.flows.push({ seg: all, marks, len, d: -(fi * 60) - 10, wait: 0, mi: 0, g, c, once: fl.once });
      });
      if (state.bubble) { const q = this.objs[state.bubble.at]; if (q) { const el = document.createElement("div"); el.className = "lb bubble"; el.textContent = state.bubble.text; this.lbls.append(el); this.labels.push({ el, at: [(q.box[0] + q.box[2]) / 2, q.box[1] - 4], up: true }); } }
      this.start();
    }
    mid(p) { let L = 0; const s = []; for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); s.push(l); L += l; } let t = L / 2; for (let i = 0; i < s.length; i++) { if (t <= s[i]) { const k = t / (s[i] || 1); return [p[i][0] + (p[i + 1][0] - p[i][0]) * k, p[i][1] + (p[i + 1][1] - p[i][1]) * k]; } t -= s[i]; } return p[0]; }
    posAt(fl, d) { const s = fl.seg.find(x => d <= x.s + x.L) || fl.seg[fl.seg.length - 1], k = Math.max(0, Math.min(1, (d - s.s) / (s.L || 1))); return { x: s.a[0] + (s.b[0] - s.a[0]) * k, y: s.a[1] + (s.b[1] - s.a[1]) * k, kind: s.kind }; }
    place(fl, d) { const p = this.posAt(fl, d); fl.g.setAttribute("transform", `translate(${f(p.x)},${f(p.y)})`); if (fl.kind !== p.kind) { fl.kind = p.kind; fl.g.setAttribute("class", `pk ${p.kind}`); } }
    start() {
      cancelAnimationFrame(this.raf);
      if (this.reduced) { this.flows.forEach(fl => { fl.g.setAttribute("display", "none"); }); return; }
      let last = performance.now();
      const tick = (t) => {
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (!this.paused && this.host.offsetParent !== null) for (const fl of this.flows) {
          if (fl.wait > 0) { fl.wait -= dt * this.speed; continue; }
          if (fl.d >= fl.len) { if (fl.once) continue; fl.d = 0; fl.mi = 0; }
          fl.d += dt * 150 * this.speed; fl.g.setAttribute("display", fl.d < 0 ? "none" : "inline");
          const m = fl.marks[fl.mi];
          if (m && fl.d >= m.at) { fl.d = m.at; fl.mi++; fl.wait = fl.mi >= fl.marks.length ? 1.1 : .32; const q = this.objs[m.to]; if (q) { q.el.classList.remove("beat"); void q.el.getBoundingClientRect(); q.el.classList.add("beat"); } if (fl.mi >= fl.marks.length && this.opt.arrive) this.opt.arrive(fl); }
          this.place(fl, Math.max(0, fl.d));
        }
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    replay() { this.paused = false; this.flows.forEach((fl, i) => { fl.d = -(i * 60) - 10; fl.mi = 0; fl.wait = 0; }); }
    
    focus(ids, snap) {
      const b = [1e9, 1e9, -1e9, -1e9];
      for (const id of ids) { const q = this.objs[id]; if (!q) continue; b[0] = Math.min(b[0], q.box[0]); b[1] = Math.min(b[1], q.box[1]); b[2] = Math.max(b[2], q.box[2]); b[3] = Math.max(b[3], q.box[3] + 20); }
      if (b[0] > b[2]) return;
      const MW = 470, MH = 300, gw = Math.max(0, MW - (b[2] - b[0])) / 2, gh = Math.max(0, MH - (b[3] - b[1])) / 2;  
      const want = { x: b[0] - gw, y: b[1] - gh, w: b[2] - b[0] + gw * 2, h: b[3] - b[1] + gh * 2 };
      cancelAnimationFrame(this.camRaf);
      if (!this.cam || snap || this.reduced) { this.cam = want; this.applyCam(); return; }
      const from = { ...this.cam }, t0 = performance.now(), dur = 780;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); this.cam = {}; for (const a of ["x", "y", "w", "h"]) this.cam[a] = from[a] + (want[a] - from[a]) * e; this.applyCam(); if (k < 1) this.camRaf = requestAnimationFrame(step); };
      this.camRaf = requestAnimationFrame(step);
      clearTimeout(this.camT); this.camT = setTimeout(() => { this.cam = want; this.applyCam(); }, dur + 260);  
    }
    applyCam() {
      const W = this.host.clientWidth, H = this.host.clientHeight; if (!W || !H || !this.cam) return;
      const pad = this.opt.pad ? this.opt.pad(W, H) : [70, 40, 46, 40];       
      const aw = Math.max(80, W - pad[1] - pad[3]), ah = Math.max(80, H - pad[0] - pad[2]);
      const s = Math.min(aw / this.cam.w, ah / this.cam.h, this.opt.maxZoom || 2.5);
      const vw = W / s, vh = H / s, cx = this.cam.x + this.cam.w / 2 + (pad[1] - pad[3]) / 2 / s, cy = this.cam.y + this.cam.h / 2 + (pad[2] - pad[0]) / 2 / s;
      this.svg.setAttribute("viewBox", `${f(cx - vw / 2)} ${f(cy - vh / 2)} ${f(vw)} ${f(vh)}`);
      const X = (x) => (x - cx + vw / 2) * s, Y = (y) => (y - cy + vh / 2) * s;
      const list = Object.values(this.objs).filter(q => !q.el.classList.contains("hid")), placed = [];
      const boxes = list.map(q => ({ q, x: X(q.box[0]), y: Y(q.box[1]), r: X(q.box[2]), b: Y(q.box[3]) }));
      const cover = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
      const bump = (a) => placed.some(r => a.x < r.r + 3 && a.r + 3 > r.x && a.y < r.b + 2 && a.b + 2 > r.y);
      const rect = (x, y, w, h) => { const px = Math.max(4, Math.min(W - w - 4, x)), py = Math.max(2, Math.min(H - h - 2, y)); return { x: px, y: py, r: px + w, b: py + h, off: Math.abs(px - x) + Math.abs(py - y) }; };
      const move = (el, r) => { el.style.transform = `translate(${Math.round(r.x)}px, ${Math.round(r.y)}px)`; };
      
      const flow = (l) => {
        const w = l.el.offsetWidth, h = l.el.offsetHeight; let r = rect(X(l.at[0]) - w / 2, Y(l.at[1]) - (l.up ? h : 11), w, h);
        for (let k = 1; k < 9 && bump(r); k++) r = rect(X(l.at[0]) - w / 2, Y(l.at[1]) - (l.up ? h : 11) + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (h + 3), w, h);
        placed.push(r); move(l.el, r);
      };
      
      const tag = (q, must) => {
        const w = q.lb.offsetWidth, h = q.lb.offsetHeight, b = boxes.find(k => k.q === q), cx = (b.x + b.r) / 2, cy = (b.y + b.b) / 2;
        const tries = [[rect(cx - w / 2, b.b + 4, w, h), 0], [rect(cx - w / 2, b.y - h - 3, w, h), 5], [rect(b.r + 4, cy - h / 2, w, h), 9], [rect(b.x - w - 4, cy - h / 2, w, h), 9], [rect(cx - w / 2, b.b - h * .55, w, h), 12]]
          .map(([r, c]) => ({ r, c: c + r.off + (bump(r) ? 100 : 0) + boxes.reduce((t, k) => k === b ? t : t + cover(r, k), 0) / (w * h) * 16 })).sort((m, n) => m.c - n.c);
        const hide = tries[0].c >= 100 && !must; q.lb.style.visibility = hide ? "hidden" : ""; if (hide) return;  
        placed.push(tries[0].r); move(q.lb, tries[0].r);
      };
      const strong = (q) => q.o.id === this.state.sel || q.el.classList.contains("fresh") || q.el.classList.contains("on");
      list.filter(q => q.named && strong(q)).forEach(q => tag(q, true));
      this.labels.forEach(flow);
      list.filter(q => q.named && !strong(q)).forEach(q => tag(q, false));
      list.filter(q => !q.named).forEach(q => { q.lb.style.visibility = ""; move(q.lb, rect(X(q.anchor[0]) - q.lb.offsetWidth / 2, Y(q.anchor[1]), q.lb.offsetWidth, q.lb.offsetHeight)); });
    }
  }

  
  function thumb(model, layer, cx, by, size) {
    const [body, w, d, h] = M[model](kit(layer)), b = [P(0, d)[0], P(0, 0, h)[1], P(w, 0)[0], P(w, d)[1]], s = Math.min(size / (b[2] - b[0]), size / (b[3] - b[1]));
    return `<g transform="translate(${f(cx - (b[0] + b[2]) / 2 * s)},${f(by - b[3] * s)}) scale(${f(s * 100) / 100})">${body}</g>`;
  }
  window.EnvEngine = { Scene, thumb, svgEl, models: M };
})();

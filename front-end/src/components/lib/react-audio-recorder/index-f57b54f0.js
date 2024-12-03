function oe(o, f) {
  for (var s = 0; s < f.length; s++) {
    const c = f[s];
    if (typeof c != "string" && !Array.isArray(c)) {
      for (const l in c)
        if (l !== "default" && !(l in o)) {
          const p = Object.getOwnPropertyDescriptor(c, l);
          p && Object.defineProperty(o, l, p.get ? p : {
            enumerable: !0,
            get: () => c[l]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(o, Symbol.toStringTag, { value: "Module" }));
}
function ne(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function ie(o) {
  if (o.__esModule)
    return o;
  var f = o.default;
  if (typeof f == "function") {
    var s = function c() {
      return this instanceof c ? Reflect.construct(f, arguments, this.constructor) : f.apply(this, arguments);
    };
    s.prototype = f.prototype;
  } else
    s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(o).forEach(function(c) {
    var l = Object.getOwnPropertyDescriptor(o, c);
    Object.defineProperty(s, c, l.get ? l : {
      enumerable: !0,
      get: function() {
        return o[c];
      }
    });
  }), s;
}
var ae = { exports: {} };
(function(o) {
  var f = function(s) {
    var c = Object.prototype, l = c.hasOwnProperty, p = Object.defineProperty || function(t, e, r) {
      t[e] = r.value;
    }, g, y = typeof Symbol == "function" ? Symbol : {}, m = y.iterator || "@@iterator", O = y.asyncIterator || "@@asyncIterator", k = y.toStringTag || "@@toStringTag";
    function b(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      b({}, "");
    } catch {
      b = function(e, r, a) {
        return e[r] = a;
      };
    }
    function W(t, e, r, a) {
      var n = e && e.prototype instanceof G ? e : G, u = Object.create(n.prototype), E = new d(a || []);
      return p(u, "_invoke", { value: H(t, r, E) }), u;
    }
    s.wrap = W;
    function S(t, e, r) {
      try {
        return { type: "normal", arg: t.call(e, r) };
      } catch (a) {
        return { type: "throw", arg: a };
      }
    }
    var C = "suspendedStart", B = "suspendedYield", R = "executing", N = "completed", w = {};
    function G() {
    }
    function U() {
    }
    function _() {
    }
    var z = {};
    b(z, m, function() {
      return this;
    });
    var Y = Object.getPrototypeOf, D = Y && Y(Y(v([])));
    D && D !== c && l.call(D, m) && (z = D);
    var $ = _.prototype = G.prototype = Object.create(z);
    U.prototype = _, p($, "constructor", { value: _, configurable: !0 }), p(
      _,
      "constructor",
      { value: U, configurable: !0 }
    ), U.displayName = b(
      _,
      k,
      "GeneratorFunction"
    );
    function x(t) {
      ["next", "throw", "return"].forEach(function(e) {
        b(t, e, function(r) {
          return this._invoke(e, r);
        });
      });
    }
    s.isGeneratorFunction = function(t) {
      var e = typeof t == "function" && t.constructor;
      return e ? e === U || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (e.displayName || e.name) === "GeneratorFunction" : !1;
    }, s.mark = function(t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, _) : (t.__proto__ = _, b(t, k, "GeneratorFunction")), t.prototype = Object.create($), t;
    }, s.awrap = function(t) {
      return { __await: t };
    };
    function M(t, e) {
      function r(u, E, j, P) {
        var L = S(t[u], t, E);
        if (L.type === "throw")
          P(L.arg);
        else {
          var J = L.arg, q = J.value;
          return q && typeof q == "object" && l.call(q, "__await") ? e.resolve(q.__await).then(function(T) {
            r("next", T, j, P);
          }, function(T) {
            r("throw", T, j, P);
          }) : e.resolve(q).then(function(T) {
            J.value = T, j(J);
          }, function(T) {
            return r("throw", T, j, P);
          });
        }
      }
      var a;
      function n(u, E) {
        function j() {
          return new e(function(P, L) {
            r(u, E, P, L);
          });
        }
        return a = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        a ? a.then(
          j,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          j
        ) : j();
      }
      p(this, "_invoke", { value: n });
    }
    x(M.prototype), b(M.prototype, O, function() {
      return this;
    }), s.AsyncIterator = M, s.async = function(t, e, r, a, n) {
      n === void 0 && (n = Promise);
      var u = new M(
        W(t, e, r, a),
        n
      );
      return s.isGeneratorFunction(e) ? u : u.next().then(function(E) {
        return E.done ? E.value : u.next();
      });
    };
    function H(t, e, r) {
      var a = C;
      return function(u, E) {
        if (a === R)
          throw new Error("Generator is already running");
        if (a === N) {
          if (u === "throw")
            throw E;
          return F();
        }
        for (r.method = u, r.arg = E; ; ) {
          var j = r.delegate;
          if (j) {
            var P = V(j, r);
            if (P) {
              if (P === w)
                continue;
              return P;
            }
          }
          if (r.method === "next")
            r.sent = r._sent = r.arg;
          else if (r.method === "throw") {
            if (a === C)
              throw a = N, r.arg;
            r.dispatchException(r.arg);
          } else
            r.method === "return" && r.abrupt("return", r.arg);
          a = R;
          var L = S(t, e, r);
          if (L.type === "normal") {
            if (a = r.done ? N : B, L.arg === w)
              continue;
            return {
              value: L.arg,
              done: r.done
            };
          } else
            L.type === "throw" && (a = N, r.method = "throw", r.arg = L.arg);
        }
      };
    }
    function V(t, e) {
      var r = e.method, a = t.iterator[r];
      if (a === g)
        return e.delegate = null, r === "throw" && t.iterator.return && (e.method = "return", e.arg = g, V(t, e), e.method === "throw") || r !== "return" && (e.method = "throw", e.arg = new TypeError(
          "The iterator does not provide a '" + r + "' method"
        )), w;
      var n = S(a, t.iterator, e.arg);
      if (n.type === "throw")
        return e.method = "throw", e.arg = n.arg, e.delegate = null, w;
      var u = n.arg;
      if (!u)
        return e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, w;
      if (u.done)
        e[t.resultName] = u.value, e.next = t.nextLoc, e.method !== "return" && (e.method = "next", e.arg = g);
      else
        return u;
      return e.delegate = null, w;
    }
    x($), b($, k, "Generator"), b($, m, function() {
      return this;
    }), b($, "toString", function() {
      return "[object Generator]";
    });
    function i(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function h(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function d(t) {
      this.tryEntries = [{ tryLoc: "root" }], t.forEach(i, this), this.reset(!0);
    }
    s.keys = function(t) {
      var e = Object(t), r = [];
      for (var a in e)
        r.push(a);
      return r.reverse(), function n() {
        for (; r.length; ) {
          var u = r.pop();
          if (u in e)
            return n.value = u, n.done = !1, n;
        }
        return n.done = !0, n;
      };
    };
    function v(t) {
      if (t) {
        var e = t[m];
        if (e)
          return e.call(t);
        if (typeof t.next == "function")
          return t;
        if (!isNaN(t?.length)) {
          var r = -1, a = function n() {
            for (; ++r < t?.length; )
              if (l.call(t, r))
                return n.value = t[r], n.done = !1, n;
            return n.value = g, n.done = !0, n;
          };
          return a.next = a;
        }
      }
      return { next: F };
    }
    s.values = v;
    function F() {
      return { value: g, done: !0 };
    }
    return d.prototype = {
      constructor: d,
      reset: function(t) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = g, this.done = !1, this.delegate = null, this.method = "next", this.arg = g, this.tryEntries.forEach(h), !t)
          for (var e in this)
            e.charAt(0) === "t" && l.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = g);
      },
      stop: function() {
        this.done = !0;
        var t = this.tryEntries[0], e = t.completion;
        if (e.type === "throw")
          throw e.arg;
        return this.rval;
      },
      dispatchException: function(t) {
        if (this.done)
          throw t;
        var e = this;
        function r(P, L) {
          return u.type = "throw", u.arg = t, e.next = P, L && (e.method = "next", e.arg = g), !!L;
        }
        for (var a = this.tryEntries.length - 1; a >= 0; --a) {
          var n = this.tryEntries[a], u = n.completion;
          if (n.tryLoc === "root")
            return r("end");
          if (n.tryLoc <= this.prev) {
            var E = l.call(n, "catchLoc"), j = l.call(n, "finallyLoc");
            if (E && j) {
              if (this.prev < n.catchLoc)
                return r(n.catchLoc, !0);
              if (this.prev < n.finallyLoc)
                return r(n.finallyLoc);
            } else if (E) {
              if (this.prev < n.catchLoc)
                return r(n.catchLoc, !0);
            } else if (j) {
              if (this.prev < n.finallyLoc)
                return r(n.finallyLoc);
            } else
              throw new Error("try statement without catch or finally");
          }
        }
      },
      abrupt: function(t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var a = this.tryEntries[r];
          if (a.tryLoc <= this.prev && l.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
            var n = a;
            break;
          }
        }
        n && (t === "break" || t === "continue") && n.tryLoc <= e && e <= n.finallyLoc && (n = null);
        var u = n ? n.completion : {};
        return u.type = t, u.arg = e, n ? (this.method = "next", this.next = n.finallyLoc, w) : this.complete(u);
      },
      complete: function(t, e) {
        if (t.type === "throw")
          throw t.arg;
        return t.type === "break" || t.type === "continue" ? this.next = t.arg : t.type === "return" ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : t.type === "normal" && e && (this.next = e), w;
      },
      finish: function(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t)
            return this.complete(r.completion, r.afterLoc), h(r), w;
        }
      },
      catch: function(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var a = r.completion;
            if (a.type === "throw") {
              var n = a.arg;
              h(r);
            }
            return n;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function(t, e, r) {
        return this.delegate = {
          iterator: v(t),
          resultName: e,
          nextLoc: r
        }, this.method === "next" && (this.arg = g), w;
      }
    }, s;
  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    o.exports
  );
  try {
    regeneratorRuntime = f;
  } catch {
    typeof globalThis == "object" ? globalThis.regeneratorRuntime = f : Function("r", "regeneratorRuntime = r")(f);
  }
})(ae);
var se = {
  defaultArgs: [
    /* args[0] is always the binary path */
    "./ffmpeg",
    /* Disable interaction mode */
    "-nostdin",
    /* Force to override output file */
    "-y"
  ],
  baseOptions: {
    /* Flag to turn on/off log messages in console */
    log: !1,
    /*
     * Custom logger to get ffmpeg.wasm output messages.
     * a sample logger looks like this:
     *
     * ```
     * logger = ({ type, message }) => {
     *   console.log(type, message);
     * }
     * ```
     *
     * type can be one of following:
     *
     * info: internal workflow debug messages
     * fferr: ffmpeg native stderr output
     * ffout: ffmpeg native stdout output
     */
    logger: () => {
    },
    /*
     * Progress handler to get current progress of ffmpeg command.
     * a sample progress handler looks like this:
     *
     * ```
     * progress = ({ ratio }) => {
     *   console.log(ratio);
     * }
     * ```
     *
     * ratio is a float number between 0 to 1.
     */
    progress: () => {
    },
    /*
     * Path to find/download ffmpeg.wasm-core,
     * this value should be overwriten by `defaultOptions` in
     * each environment.
     */
    corePath: ""
  }
}, fe = (o, f) => {
  const s = o._malloc(f.length * Uint32Array.BYTES_PER_ELEMENT);
  return f.forEach((c, l) => {
    const p = o.lengthBytesUTF8(c) + 1, g = o._malloc(p);
    o.stringToUTF8(c, g, p), o.setValue(s + Uint32Array.BYTES_PER_ELEMENT * l, g, "i32");
  }), [f.length, s];
};
const ce = "@ffmpeg/ffmpeg", le = "0.11.6", ue = "FFmpeg WebAssembly version", pe = "src/index.js", he = "src/index.d.ts", de = {
  example: "examples"
}, me = {
  start: "node scripts/server.js",
  "start:worker": "node scripts/worker-server.js",
  build: "rimraf dist && webpack --config scripts/webpack.config.prod.js",
  "build:worker": "rimraf dist && webpack --config scripts/webpack.config.worker.prod.js",
  prepublishOnly: "npm run build",
  lint: "eslint src",
  wait: "rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js",
  test: "npm-run-all -p -r start test:all",
  "test:all": "npm-run-all wait test:browser:ffmpeg test:node:all",
  "test:node": "node node_modules/mocha/bin/_mocha --exit --bail --require ./scripts/test-helper.js",
  "test:node:all": "npm run test:node -- ./tests/*.test.js",
  "test:browser": "mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
  "test:browser:ffmpeg": "npm run test:browser -- -f ./tests/ffmpeg.test.html"
}, ge = {
  "./src/node/index.js": "./src/browser/index.js"
}, we = {
  type: "git",
  url: "git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"
}, ve = [
  "ffmpeg",
  "WebAssembly",
  "video"
], ye = "Jerome Wu <jeromewus@gmail.com>", be = "MIT", Fe = {
  url: "https://github.com/ffmpegwasm/ffmpeg.wasm/issues"
}, Ee = {
  node: ">=12.16.1"
}, je = "https://github.com/ffmpegwasm/ffmpeg.wasm#readme", Le = {
  "is-url": "^1.2.4",
  "node-fetch": "^2.6.1",
  "regenerator-runtime": "^0.13.7",
  "resolve-url": "^0.2.1"
}, Oe = {
  "@babel/core": "^7.12.3",
  "@babel/preset-env": "^7.12.1",
  "@ffmpeg/core": "^0.11.0",
  "@types/emscripten": "^1.39.4",
  "babel-eslint": "^10.1.0",
  "babel-loader": "^8.1.0",
  chai: "^4.2.0",
  cors: "^2.8.5",
  eslint: "^7.12.1",
  "eslint-config-airbnb-base": "^14.1.0",
  "eslint-plugin-import": "^2.22.1",
  express: "^4.17.1",
  mocha: "^8.2.1",
  "mocha-headless-chrome": "^2.0.3",
  "npm-run-all": "^4.1.5",
  "wait-on": "^5.3.0",
  webpack: "^5.3.2",
  "webpack-cli": "^4.1.0",
  "webpack-dev-middleware": "^4.0.0"
}, X = {
  name: ce,
  version: le,
  description: ue,
  main: pe,
  types: he,
  directories: de,
  scripts: me,
  browser: ge,
  repository: we,
  keywords: ve,
  author: ye,
  license: be,
  bugs: Fe,
  engines: Ee,
  homepage: je,
  dependencies: Le,
  devDependencies: Oe
}, Pe = typeof process < "u" && process.env.NODE_ENV === "development" ? new URL("/node_modules/@ffmpeg/core/dist/ffmpeg-core.js", self.location).href : `https://unpkg.com/@ffmpeg/core@${X.devDependencies["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`, Se = { corePath: Pe };
let K = !1, ee = () => {
};
const _e = (o) => {
  K = o;
}, ke = (o) => {
  ee = o;
}, $e = (o, f) => {
  ee({ type: o, message: f }), K && console.log(`[${o}] ${f}`);
};
var A = {
  logging: K,
  setLogging: _e,
  setCustomLogger: ke,
  log: $e
};
const Ce = (o) => `
createFFmpegCore is not defined. ffmpeg.wasm is unable to find createFFmpegCore after loading ffmpeg-core.js from ${o}. Use another URL when calling createFFmpeg():

const ffmpeg = createFFmpeg({
  corePath: 'http://localhost:3000/ffmpeg-core.js',
});
`;
var Q = {
  CREATE_FFMPEG_CORE_IS_NOT_DEFINED: Ce
};
const I = async (o, f) => {
  A.log("info", `fetch ${o}`);
  const s = await (await fetch(o)).arrayBuffer();
  A.log("info", `${o} file size = ${s.byteLength} bytes`);
  const c = new Blob([s], { type: f }), l = URL.createObjectURL(c);
  return A.log("info", `${o} blob URL = ${l}`), l;
}, Re = async ({
  corePath: o,
  workerPath: f,
  wasmPath: s
}) => {
  if (typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope) {
    if (typeof o != "string")
      throw Error("corePath should be a string!");
    const y = new URL(o, import.meta.url).href, m = await I(
      y,
      "application/javascript"
    ), O = await I(
      s !== void 0 ? s : y.replace("ffmpeg-core.js", "ffmpeg-core.wasm"),
      "application/wasm"
    ), k = await I(
      f !== void 0 ? f : y.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"),
      "application/javascript"
    );
    return typeof createFFmpegCore > "u" ? new Promise((b) => {
      if (globalThis.importScripts(m), typeof createFFmpegCore > "u")
        throw Error(Q.CREATE_FFMPEG_CORE_IS_NOT_DEFINED(y));
      A.log("info", "ffmpeg-core.js script loaded"), b({
        createFFmpegCore,
        corePath: m,
        wasmPath: O,
        workerPath: k
      });
    }) : (A.log("info", "ffmpeg-core.js script is loaded already"), Promise.resolve({
      createFFmpegCore,
      corePath: m,
      wasmPath: O,
      workerPath: k
    }));
  }
  if (typeof o != "string")
    throw Error("corePath should be a string!");
  const c = new URL(o, import.meta.url).href, l = await I(
    c,
    "application/javascript"
  ), p = await I(
    s !== void 0 ? s : c.replace("ffmpeg-core.js", "ffmpeg-core.wasm"),
    "application/wasm"
  ), g = await I(
    f !== void 0 ? f : c.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"),
    "application/javascript"
  );
  return typeof createFFmpegCore > "u" ? new Promise((y) => {
    const m = document.createElement("script"), O = () => {
      if (m.removeEventListener("load", O), typeof createFFmpegCore > "u")
        throw Error(Q.CREATE_FFMPEG_CORE_IS_NOT_DEFINED(c));
      A.log("info", "ffmpeg-core.js script loaded"), y({
        createFFmpegCore,
        corePath: l,
        wasmPath: p,
        workerPath: g
      });
    };
    m.src = l, m.type = "text/javascript", m.addEventListener("load", O), document.getElementsByTagName("head")[0].appendChild(m);
  }) : (A.log("info", "ffmpeg-core.js script is loaded already"), Promise.resolve({
    createFFmpegCore,
    corePath: l,
    wasmPath: p,
    workerPath: g
  }));
}, Te = (o) => new Promise((f, s) => {
  const c = new FileReader();
  c.onload = () => {
    f(c.result);
  }, c.onerror = ({ target: { error: { code: l } } }) => {
    s(Error(`File could not be read! Code=${l}`));
  }, c.readAsArrayBuffer(o);
}), Ae = async (o) => {
  let f = o;
  return typeof o > "u" ? new Uint8Array() : (typeof o == "string" ? /data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(o) ? f = atob(o.split(",")[1]).split("").map((s) => s.charCodeAt(0)) : f = await (await fetch(new URL(o, import.meta.url).href)).arrayBuffer() : (o instanceof File || o instanceof Blob) && (f = await Te(o)), new Uint8Array(f));
}, Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultOptions: Se,
  fetchFile: Ae,
  getCreateFFmpegCore: Re
}, Symbol.toStringTag, { value: "Module" })), te = /* @__PURE__ */ ie(Ne), { defaultArgs: Ge, baseOptions: Ue } = se, De = fe, { defaultOptions: Me, getCreateFFmpegCore: Ie } = te, { version: We } = X, Z = Error("ffmpeg.wasm is not ready, make sure you have completed load().");
var Be = (o = {}) => {
  const {
    log: f,
    logger: s,
    progress: c,
    ...l
  } = {
    ...Ue,
    ...Me,
    ...o
  };
  let p = null, g = null, y = null, m = null, O = !1, k = () => {
  }, b = f, W = c, S = 0, C = 0, B = !1, R = 0;
  const N = (i) => {
    i === "FFMPEG_END" && y !== null && (y(), y = null, m = null, O = !1);
  }, w = (i, h) => {
    k({ type: i, message: h }), b && console.log(`[${i}] ${h}`);
  }, G = (i) => {
    const [h, d, v] = i.split(":");
    return parseFloat(h) * 60 * 60 + parseFloat(d) * 60 + parseFloat(v);
  }, U = (i, h) => {
    if (typeof i == "string")
      if (i.startsWith("  Duration")) {
        const d = i.split(", ")[0].split(": ")[1], v = G(d);
        h({ duration: v, ratio: R }), (S === 0 || S > v) && (S = v, B = !0);
      } else if (B && i.startsWith("    Stream")) {
        const d = i.match(/([\d.]+) fps/);
        if (d) {
          const v = parseFloat(d[1]);
          C = S * v;
        } else
          C = 0;
        B = !1;
      } else if (i.startsWith("frame") || i.startsWith("size")) {
        const d = i.split("time=")[1].split(" ")[0], v = G(d), F = i.match(/frame=\s*(\d+)/);
        if (C && F) {
          const t = parseFloat(F[1]);
          R = Math.min(t / C, 1);
        } else
          R = v / S;
        h({ ratio: R, time: v });
      } else
        i.startsWith("video:") && (h({ ratio: 1 }), S = 0);
  }, _ = ({ type: i, message: h }) => {
    w(i, h), U(h, W), N(h);
  }, z = async () => {
    if (w("info", "load ffmpeg-core"), p === null) {
      w("info", "loading ffmpeg-core");
      const {
        createFFmpegCore: i,
        corePath: h,
        workerPath: d,
        wasmPath: v
      } = await Ie(l);
      p = await i({
        /*
         * Assign mainScriptUrlOrBlob fixes chrome extension web worker issue
         * as there is no document.currentScript in the context of content_scripts
         */
        mainScriptUrlOrBlob: h,
        printErr: (F) => _({ type: "fferr", message: F }),
        print: (F) => _({ type: "ffout", message: F }),
        /*
         * locateFile overrides paths of files that is loaded by main script (ffmpeg-core.js).
         * It is critical for browser environment and we override both wasm and worker paths
         * as we are using blob URL instead of original URL to avoid cross origin issues.
         */
        locateFile: (F, t) => {
          if (typeof window < "u" || typeof WorkerGlobalScope < "u") {
            if (typeof v < "u" && F.endsWith("ffmpeg-core.wasm"))
              return v;
            if (typeof d < "u" && F.endsWith("ffmpeg-core.worker.js"))
              return d;
          }
          return t + F;
        }
      }), g = p.cwrap(l.mainName || "proxy_main", "number", ["number", "number"]), w("info", "ffmpeg-core loaded");
    } else
      throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");
  }, Y = () => p !== null, D = (...i) => {
    if (w("info", `run ffmpeg command: ${i.join(" ")}`), p === null)
      throw Z;
    if (O)
      throw Error("ffmpeg.wasm can only run one command at a time");
    return O = !0, new Promise((h, d) => {
      const v = [...Ge, ...i].filter((F) => F.length !== 0);
      y = h, m = d, g(...De(p, v));
    });
  }, $ = (i, ...h) => {
    if (w("info", `run FS.${i} ${h.map((d) => typeof d == "string" ? d : `<${d.length} bytes binary file>`).join(" ")}`), p === null)
      throw Z;
    {
      let d = null;
      try {
        d = p.FS[i](...h);
      } catch {
        throw Error(i === "readdir" ? `ffmpeg.FS('readdir', '${h[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')` : i === "readFile" ? `ffmpeg.FS('readFile', '${h[0]}') error. Check if the path exists` : "Oops, something went wrong in FS operation.");
      }
      return d;
    }
  }, x = () => {
    if (p === null)
      throw Z;
    m && m("ffmpeg has exited"), O = !1;
    try {
      p.exit(1);
    } catch (i) {
      w(i.message), m && m(i);
    } finally {
      p = null, g = null, y = null, m = null;
    }
  }, M = (i) => {
    W = i;
  }, H = (i) => {
    k = i;
  }, V = (i) => {
    b = i;
  };
  return w("info", `use ffmpeg.wasm v${We}`), {
    setProgress: M,
    setLogger: H,
    setLogging: V,
    load: z,
    isLoaded: Y,
    run: D,
    exit: x,
    FS: $
  };
};
const ze = Be, { fetchFile: Ye } = te;
var re = {
  /*
   * Create ffmpeg instance.
   * Each ffmpeg instance owns an isolated MEMFS and works
   * independently.
   *
   * For example:
   *
   * ```
   * const ffmpeg = createFFmpeg({
   *  log: true,
   *  logger: () => {},
   *  progress: () => {},
   *  corePath: '',
   * })
   * ```
   *
   * For the usage of these four arguments, check config.js
   *
   */
  createFFmpeg: ze,
  /*
   * Helper function for fetching files from various resource.
   * Sometimes the video/audio file you want to process may located
   * in a remote URL and somewhere in your local file system.
   *
   * This helper function helps you to fetch to file and return an
   * Uint8Array variable for ffmpeg.wasm to consume.
   *
   */
  fetchFile: Ye
};
const qe = /* @__PURE__ */ ne(re), xe = /* @__PURE__ */ oe({
  __proto__: null,
  default: qe
}, [re]);
export {
  xe as i
};

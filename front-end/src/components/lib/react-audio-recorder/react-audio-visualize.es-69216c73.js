import Te, { useState as Y, useRef as De, useEffect as H, useCallback as fr, forwardRef as pr, useImperativeHandle as yr } from "react";
var ne = { exports: {} }, z = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var je;
function dr() {
  if (je)
    return z;
  je = 1;
  var y = Te, m = Symbol.for("react.element"), _ = Symbol.for("react.fragment"), b = Object.prototype.hasOwnProperty, h = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, w = { key: !0, ref: !0, __self: !0, __source: !0 };
  function k(i, s, g) {
    var o, a = {}, d = null, E = null;
    g !== void 0 && (d = "" + g), s.key !== void 0 && (d = "" + s.key), s.ref !== void 0 && (E = s.ref);
    for (o in s)
      b.call(s, o) && !w.hasOwnProperty(o) && (a[o] = s[o]);
    if (i && i.defaultProps)
      for (o in s = i.defaultProps, s)
        a[o] === void 0 && (a[o] = s[o]);
    return { $$typeof: m, type: i, key: d, ref: E, props: a, _owner: h.current };
  }
  return z.Fragment = _, z.jsx = k, z.jsxs = k, z;
}
var q = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pe;
function mr() {
  return Pe || (Pe = 1, process.env.NODE_ENV !== "production" && function() {
    var y = Te, m = Symbol.for("react.element"), _ = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), k = Symbol.for("react.provider"), i = Symbol.for("react.context"), s = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), o = Symbol.for("react.suspense_list"), a = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), C = Symbol.iterator, T = "@@iterator";
    function D(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = C && e[C] || e[T];
      return typeof r == "function" ? r : null;
    }
    var l = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function f(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        j("error", e, t);
      }
    }
    function j(e, r, t) {
      {
        var n = l.ReactDebugCurrentFrame, p = n.getStackAddendum();
        p !== "" && (r += "%s", t = t.concat([p]));
        var v = t.map(function(u) {
          return String(u);
        });
        v.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, v);
      }
    }
    var xe = !1, Fe = !1, Ne = !1, Ae = !1, Ie = !1, oe;
    oe = Symbol.for("react.module.reference");
    function Le(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === b || e === w || Ie || e === h || e === g || e === o || Ae || e === E || xe || Fe || Ne || typeof e == "object" && e !== null && (e.$$typeof === d || e.$$typeof === a || e.$$typeof === k || e.$$typeof === i || e.$$typeof === s || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === oe || e.getModuleId !== void 0));
    }
    function ze(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var p = r.displayName || r.name || "";
      return p !== "" ? t + "(" + p + ")" : t;
    }
    function ae(e) {
      return e.displayName || "Context";
    }
    function $(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && f("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case b:
          return "Fragment";
        case _:
          return "Portal";
        case w:
          return "Profiler";
        case h:
          return "StrictMode";
        case g:
          return "Suspense";
        case o:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case i:
            var r = e;
            return ae(r) + ".Consumer";
          case k:
            var t = e;
            return ae(t._context) + ".Provider";
          case s:
            return ze(e, e.render, "ForwardRef");
          case a:
            var n = e.displayName || null;
            return n !== null ? n : $(e.type) || "Memo";
          case d: {
            var p = e, v = p._payload, u = p._init;
            try {
              return $(u(v));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var F = Object.assign, I = 0, ie, ce, le, se, ue, fe, pe;
    function ye() {
    }
    ye.__reactDisabledLog = !0;
    function We() {
      {
        if (I === 0) {
          ie = console.log, ce = console.info, le = console.warn, se = console.error, ue = console.group, fe = console.groupCollapsed, pe = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ye,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        I++;
      }
    }
    function Me() {
      {
        if (I--, I === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: F({}, e, {
              value: ie
            }),
            info: F({}, e, {
              value: ce
            }),
            warn: F({}, e, {
              value: le
            }),
            error: F({}, e, {
              value: se
            }),
            group: F({}, e, {
              value: ue
            }),
            groupCollapsed: F({}, e, {
              value: fe
            }),
            groupEnd: F({}, e, {
              value: pe
            })
          });
        }
        I < 0 && f("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var X = l.ReactCurrentDispatcher, J;
    function W(e, r, t) {
      {
        if (J === void 0)
          try {
            throw Error();
          } catch (p) {
            var n = p.stack.trim().match(/\n( *(at )?)/);
            J = n && n[1] || "";
          }
        return `
` + J + e;
      }
    }
    var K = !1, M;
    {
      var Ue = typeof WeakMap == "function" ? WeakMap : Map;
      M = new Ue();
    }
    function de(e, r) {
      if (!e || K)
        return "";
      {
        var t = M.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      K = !0;
      var p = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var v;
      v = X.current, X.current = null, We();
      try {
        if (r) {
          var u = function() {
            throw Error();
          };
          if (Object.defineProperty(u.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(u, []);
            } catch (x) {
              n = x;
            }
            Reflect.construct(e, [], u);
          } else {
            try {
              u.call();
            } catch (x) {
              n = x;
            }
            e.call(u.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (x) {
            n = x;
          }
          e();
        }
      } catch (x) {
        if (x && n && typeof x.stack == "string") {
          for (var c = x.stack.split(`
`), O = n.stack.split(`
`), S = c.length - 1, R = O.length - 1; S >= 1 && R >= 0 && c[S] !== O[R]; )
            R--;
          for (; S >= 1 && R >= 0; S--, R--)
            if (c[S] !== O[R]) {
              if (S !== 1 || R !== 1)
                do
                  if (S--, R--, R < 0 || c[S] !== O[R]) {
                    var P = `
` + c[S].replace(" at new ", " at ");
                    return e.displayName && P.includes("<anonymous>") && (P = P.replace("<anonymous>", e.displayName)), typeof e == "function" && M.set(e, P), P;
                  }
                while (S >= 1 && R >= 0);
              break;
            }
        }
      } finally {
        K = !1, X.current = v, Me(), Error.prepareStackTrace = p;
      }
      var A = e ? e.displayName || e.name : "", Oe = A ? W(A) : "";
      return typeof e == "function" && M.set(e, Oe), Oe;
    }
    function Be(e, r, t) {
      return de(e, !1);
    }
    function Ve(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function U(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return de(e, Ve(e));
      if (typeof e == "string")
        return W(e);
      switch (e) {
        case g:
          return W("Suspense");
        case o:
          return W("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case s:
            return Be(e.render);
          case a:
            return U(e.type, r, t);
          case d: {
            var n = e, p = n._payload, v = n._init;
            try {
              return U(v(p), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var B = Object.prototype.hasOwnProperty, me = {}, ge = l.ReactDebugCurrentFrame;
    function V(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        ge.setExtraStackFrame(t);
      } else
        ge.setExtraStackFrame(null);
    }
    function qe(e, r, t, n, p) {
      {
        var v = Function.call.bind(B);
        for (var u in e)
          if (v(e, u)) {
            var c = void 0;
            try {
              if (typeof e[u] != "function") {
                var O = Error((n || "React class") + ": " + t + " type `" + u + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[u] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw O.name = "Invariant Violation", O;
              }
              c = e[u](r, u, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (S) {
              c = S;
            }
            c && !(c instanceof Error) && (V(p), f("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, u, typeof c), V(null)), c instanceof Error && !(c.message in me) && (me[c.message] = !0, V(p), f("Failed %s type: %s", t, c.message), V(null));
          }
      }
    }
    var Ye = Array.isArray;
    function Q(e) {
      return Ye(e);
    }
    function He(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Xe(e) {
      try {
        return ve(e), !1;
      } catch {
        return !0;
      }
    }
    function ve(e) {
      return "" + e;
    }
    function he(e) {
      if (Xe(e))
        return f("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", He(e)), ve(e);
    }
    var L = l.ReactCurrentOwner, Je = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, be, we, Z;
    Z = {};
    function Ke(e) {
      if (B.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Qe(e) {
      if (B.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Ze(e, r) {
      if (typeof e.ref == "string" && L.current && r && L.current.stateNode !== r) {
        var t = $(L.current.type);
        Z[t] || (f('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', $(L.current.type), e.ref), Z[t] = !0);
      }
    }
    function Ge(e, r) {
      {
        var t = function() {
          be || (be = !0, f("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function er(e, r) {
      {
        var t = function() {
          we || (we = !0, f("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var rr = function(e, r, t, n, p, v, u) {
      var c = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: m,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: u,
        // Record the component responsible for creating this element.
        _owner: v
      };
      return c._store = {}, Object.defineProperty(c._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(c, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(c, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: p
      }), Object.freeze && (Object.freeze(c.props), Object.freeze(c)), c;
    };
    function tr(e, r, t, n, p) {
      {
        var v, u = {}, c = null, O = null;
        t !== void 0 && (he(t), c = "" + t), Qe(r) && (he(r.key), c = "" + r.key), Ke(r) && (O = r.ref, Ze(r, p));
        for (v in r)
          B.call(r, v) && !Je.hasOwnProperty(v) && (u[v] = r[v]);
        if (e && e.defaultProps) {
          var S = e.defaultProps;
          for (v in S)
            u[v] === void 0 && (u[v] = S[v]);
        }
        if (c || O) {
          var R = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          c && Ge(u, R), O && er(u, R);
        }
        return rr(e, c, O, p, n, L.current, u);
      }
    }
    var G = l.ReactCurrentOwner, Se = l.ReactDebugCurrentFrame;
    function N(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        Se.setExtraStackFrame(t);
      } else
        Se.setExtraStackFrame(null);
    }
    var ee;
    ee = !1;
    function re(e) {
      return typeof e == "object" && e !== null && e.$$typeof === m;
    }
    function ke() {
      {
        if (G.current) {
          var e = $(G.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function nr(e) {
      {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), t = e.lineNumber;
          return `

Check your code at ` + r + ":" + t + ".";
        }
        return "";
      }
    }
    var Re = {};
    function or(e) {
      {
        var r = ke();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function _e(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = or(r);
        if (Re[t])
          return;
        Re[t] = !0;
        var n = "";
        e && e._owner && e._owner !== G.current && (n = " It was passed a child from " + $(e._owner.type) + "."), N(e), f('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), N(null);
      }
    }
    function Ee(e, r) {
      {
        if (typeof e != "object")
          return;
        if (Q(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            re(n) && _e(n, r);
          }
        else if (re(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var p = D(e);
          if (typeof p == "function" && p !== e.entries)
            for (var v = p.call(e), u; !(u = v.next()).done; )
              re(u.value) && _e(u.value, r);
        }
      }
    }
    function ar(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === s || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === a))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = $(r);
          qe(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !ee) {
          ee = !0;
          var p = $(r);
          f("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", p || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && f("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            N(e), f("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), N(null);
            break;
          }
        }
        e.ref !== null && (N(e), f("Invalid attribute `ref` supplied to `React.Fragment`."), N(null));
      }
    }
    function Ce(e, r, t, n, p, v) {
      {
        var u = Le(e);
        if (!u) {
          var c = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (c += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var O = nr(p);
          O ? c += O : c += ke();
          var S;
          e === null ? S = "null" : Q(e) ? S = "array" : e !== void 0 && e.$$typeof === m ? (S = "<" + ($(e.type) || "Unknown") + " />", c = " Did you accidentally export a JSX literal instead of a component?") : S = typeof e, f("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", S, c);
        }
        var R = tr(e, r, t, p, v);
        if (R == null)
          return R;
        if (u) {
          var P = r.children;
          if (P !== void 0)
            if (n)
              if (Q(P)) {
                for (var A = 0; A < P.length; A++)
                  Ee(P[A], e);
                Object.freeze && Object.freeze(P);
              } else
                f("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ee(P, e);
        }
        return e === b ? ir(R) : ar(R), R;
      }
    }
    function cr(e, r, t) {
      return Ce(e, r, t, !0);
    }
    function lr(e, r, t) {
      return Ce(e, r, t, !1);
    }
    var sr = lr, ur = cr;
    q.Fragment = b, q.jsx = sr, q.jsxs = ur;
  }()), q;
}
process.env.NODE_ENV === "production" ? ne.exports = dr() : ne.exports = mr();
var $e = ne.exports;
const gr = (y, m, _, b) => {
  let h = m / (_ + b), w = Math.floor(y.length / h);
  h > y.length && (h = y.length, w = 1);
  const k = [];
  for (let i = 0; i < h; i++) {
    let s = 0;
    for (let g = 0; g < w && i * w + g < y.length; g++)
      s += y[i * w + g];
    k.push(s / w);
  }
  return k;
}, vr = (y, m, _, b, h, w) => {
  const k = m.height / 2, i = m.getContext("2d");
  i && (i.clearRect(0, 0, m.width, m.height), h !== "transparent" && (i.fillStyle = h, i.fillRect(0, 0, m.width, m.height)), y.forEach((s, g) => {
    i.fillStyle = w;
    const o = g * (_ + b), a = k - s / 2, d = _, E = s || 1;
    i.beginPath(), i.roundRect ? (i.roundRect(o, a, d, E, 50), i.fill()) : i.fillRect(o, a, d, E);
  }));
}, Sr = ({
  mediaRecorder: y,
  width: m = "100%",
  height: _ = "100%",
  barWidth: b = 2,
  gap: h = 1,
  backgroundColor: w = "transparent",
  barColor: k = "rgb(160, 198, 255)",
  fftSize: i = 1024,
  maxDecibels: s = -10,
  minDecibels: g = -90,
  smoothingTimeConstant: o = 0.4
}) => {
  const [a] = Y(() => new AudioContext()), [d, E] = Y(), C = De(null);
  H(() => {
    if (!y.stream)
      return;
    const l = a.createAnalyser();
    E(l), l.fftSize = i, l.minDecibels = g, l.maxDecibels = s, l.smoothingTimeConstant = o, a.createMediaStreamSource(y.stream).connect(l);
  }, [y.stream]), H(() => {
    d && y.state === "recording" && T();
  }, [d, y.state]);
  const T = fr(() => {
    if (!d)
      return;
    const l = new Uint8Array(d == null ? void 0 : d.frequencyBinCount);
    y.state === "recording" ? (d == null || d.getByteFrequencyData(l), D(l), requestAnimationFrame(T)) : y.state === "paused" ? D(l) : y.state === "inactive" && a.state !== "closed" && a.close();
  }, [d, a.state]), D = (l) => {
    if (!C.current)
      return;
    const f = gr(
      l,
      C.current.width,
      b,
      h
    );
    vr(
      f,
      C.current,
      b,
      h,
      w,
      k
    );
  };
  return /* @__PURE__ */ $e.jsx(
    "canvas",
    {
      ref: C,
      width: m,
      height: _,
      style: {
        aspectRatio: "unset"
      }
    }
  );
}, hr = (y, m, _, b, h) => {
  const w = y.getChannelData(0), k = _ / (b + h), i = Math.floor(w.length / k), s = m / 2;
  let g = [], o = 0;
  for (let a = 0; a < k; a++) {
    const d = [];
    let E = 0;
    const C = [];
    let T = 0;
    for (let f = 0; f < i && a * i + f < y.length; f++) {
      const j = w[a * i + f];
      j <= 0 && (d.push(j), E++), j > 0 && (C.push(j), T++);
    }
    const D = d.reduce((f, j) => f + j, 0) / E, l = { max: C.reduce((f, j) => f + j, 0) / T, min: D };
    l.max > o && (o = l.max), Math.abs(l.min) > o && (o = Math.abs(l.min)), g.push(l);
  }
  if (s * 0.8 > o * s) {
    const a = s * 0.8 / o;
    g = g.map((d) => ({
      max: d.max * a,
      min: d.min * a
    }));
  }
  return g;
}, te = (y, m, _, b, h, w, k, i = 0, s = 1) => {
  const g = m.height / 2, o = m.getContext("2d");
  if (!o)
    return;
  o.clearRect(0, 0, m.width, m.height), h !== "transparent" && (o.fillStyle = h, o.fillRect(0, 0, m.width, m.height));
  const a = (i || 0) / s;
  y.forEach((d, E) => {
    const C = E / y.length, T = a > C;
    o.fillStyle = T && k ? k : w;
    const D = E * (_ + b), l = g + d.min, f = _, j = g + d.max - l;
    o.beginPath(), o.roundRect ? (o.roundRect(D, l, f, j, 50), o.fill()) : o.fillRect(D, l, f, j);
  });
}, br = pr(
  ({
    blob: y,
    width: m,
    height: _,
    barWidth: b = 2,
    gap: h = 1,
    currentTime: w,
    style: k,
    backgroundColor: i = "transparent",
    barColor: s = "rgb(184, 184, 184)",
    barPlayedColor: g = "rgb(160, 198, 255)"
  }, o) => {
    const a = De(null), [d, E] = Y([]), [C, T] = Y(0);
    return yr(
      o,
      () => a.current,
      []
    ), H(() => {
      (async () => {
        if (!a.current)
          return;
        if (!y) {
          const l = Array.from({ length: 100 }, () => ({
            max: 0,
            min: 0
          }));
          te(
            l,
            a.current,
            b,
            h,
            i,
            s,
            g
          );
          return;
        }
        const D = await y.arrayBuffer();
        await new AudioContext().decodeAudioData(D, (l) => {
          if (!a.current)
            return;
          T(l.duration);
          const f = hr(
            l,
            _,
            m,
            b,
            h
          );
          E(f), te(
            f,
            a.current,
            b,
            h,
            i,
            s,
            g
          );
        });
      })();
    }, [y, a.current]), H(() => {
      a.current && te(
        d,
        a.current,
        b,
        h,
        i,
        s,
        g,
        w,
        C
      );
    }, [w, C]), /* @__PURE__ */ $e.jsx(
      "canvas",
      {
        ref: a,
        width: m,
        height: _,
        style: {
          ...k
        }
      }
    );
  }
);
br.displayName = "AudioVisualizer";
export {
  br as AudioVisualizer,
  Sr as LiveAudioVisualizer
};

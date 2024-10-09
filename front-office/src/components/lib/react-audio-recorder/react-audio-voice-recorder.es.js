(function(){"use strict";(r=>{try{if(typeof window>"u")return;var e=document.createElement("style");e.appendChild(document.createTextNode(r)),document.head.appendChild(e)}catch(i){console.error("vite-plugin-css-injected-by-js",i)}})(".audio-recorder{background-color:#ebebeb;box-shadow:0 2px 5px #bebebe;border-radius:20px;box-sizing:border-box;color:#000;width:40px;display:flex;align-items:center;transition:all .2s ease-in;-webkit-tap-highlight-color:transparent}.audio-recorder-mic{box-sizing:content-box;cursor:pointer;height:16px;color:#000;padding:12px}.audio-recorder .audio-recorder-mic{border-radius:20px}.audio-recorder.recording .audio-recorder-mic{border-radius:0}.audio-recorder-timer,.audio-recorder-status{color:#000;margin-left:10px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:14px;font-weight:400;line-height:1}.audio-recorder-status{margin-left:15px;display:flex;align-items:baseline;flex-grow:1;animation-name:fading-ar-status;animation-duration:2s;animation-iteration-count:infinite}.audio-recorder-status-dot{background-color:#d00;border-radius:50%;height:10px;width:9px;margin-right:5px}.audio-recorder-options{box-sizing:content-box;height:16px;cursor:pointer;padding:12px 6px 12px 12px}.audio-recorder-options~.audio-recorder-options{padding:12px 12px 12px 6px;border-radius:0 5px 5px 0}.recording{border-radius:12px;width:200px;transition:all .2s ease-out}.display-none{display:none}.audio-recorder-visualizer{margin-left:15px;flex-grow:1;align-self:center;display:flex;align-items:center}@keyframes fading-ar-status{0%{opacity:1}50%{opacity:0}to{opacity:1}}")})();
import ge, { useState as W, useCallback as J, useEffect as sr, Suspense as lr } from "react";
var de = { exports: {} }, H = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _e;
function fr() {
  if (_e)
    return H;
  _e = 1;
  var h = ge, b = Symbol.for("react.element"), O = Symbol.for("react.fragment"), E = Object.prototype.hasOwnProperty, I = h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, C = { key: !0, ref: !0, __self: !0, __source: !0 };
  function y(T, a, i) {
    var d, M = {}, w = null, L = null;
    i !== void 0 && (w = "" + i), a.key !== void 0 && (w = "" + a.key), a.ref !== void 0 && (L = a.ref);
    for (d in a)
      E.call(a, d) && !C.hasOwnProperty(d) && (M[d] = a[d]);
    if (T && T.defaultProps)
      for (d in a = T.defaultProps, a)
        M[d] === void 0 && (M[d] = a[d]);
    return { $$typeof: b, type: T, key: w, ref: L, props: M, _owner: I.current };
  }
  return H.Fragment = O, H.jsx = y, H.jsxs = y, H;
}
var $ = {};
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
function dr() {
  return Pe || (Pe = 1, process.env.NODE_ENV !== "production" && function() {
    var h = ge, b = Symbol.for("react.element"), O = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), I = Symbol.for("react.strict_mode"), C = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), T = Symbol.for("react.context"), a = Symbol.for("react.forward_ref"), i = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), M = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), L = Symbol.for("react.offscreen"), v = Symbol.iterator, k = "@@iterator";
    function _(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = v && e[v] || e[k];
      return typeof r == "function" ? r : null;
    }
    var S = h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function g(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        Z("error", e, t);
      }
    }
    function Z(e, r, t) {
      {
        var n = S.ReactDebugCurrentFrame, u = n.getStackAddendum();
        u !== "" && (r += "%s", t = t.concat([u]));
        var s = t.map(function(c) {
          return String(c);
        });
        s.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var j = !1, R = !1, F = !1, x = !1, X = !1, P;
    P = Symbol.for("react.module.reference");
    function B(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === E || e === C || X || e === I || e === i || e === d || x || e === L || j || R || F || typeof e == "object" && e !== null && (e.$$typeof === w || e.$$typeof === M || e.$$typeof === y || e.$$typeof === T || e.$$typeof === a || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === P || e.getModuleId !== void 0));
    }
    function D(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var u = r.displayName || r.name || "";
      return u !== "" ? t + "(" + u + ")" : t;
    }
    function K(e) {
      return e.displayName || "Context";
    }
    function A(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case E:
          return "Fragment";
        case O:
          return "Portal";
        case C:
          return "Profiler";
        case I:
          return "StrictMode";
        case i:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case T:
            var r = e;
            return K(r) + ".Consumer";
          case y:
            var t = e;
            return K(t._context) + ".Provider";
          case a:
            return D(e, e.render, "ForwardRef");
          case M:
            var n = e.displayName || null;
            return n !== null ? n : A(e.type) || "Memo";
          case w: {
            var u = e, s = u._payload, c = u._init;
            try {
              return A(c(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var z = Object.assign, U = 0, Me, ve, me, we, ye, je, be;
    function Ce() {
    }
    Ce.__reactDisabledLog = !0;
    function ze() {
      {
        if (U === 0) {
          Me = console.log, ve = console.info, me = console.warn, we = console.error, ye = console.group, je = console.groupCollapsed, be = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ce,
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
        U++;
      }
    }
    function Ye() {
      {
        if (U--, U === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: z({}, e, {
              value: Me
            }),
            info: z({}, e, {
              value: ve
            }),
            warn: z({}, e, {
              value: me
            }),
            error: z({}, e, {
              value: we
            }),
            group: z({}, e, {
              value: ye
            }),
            groupCollapsed: z({}, e, {
              value: je
            }),
            groupEnd: z({}, e, {
              value: be
            })
          });
        }
        U < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ae = S.ReactCurrentDispatcher, ie;
    function q(e, r, t) {
      {
        if (ie === void 0)
          try {
            throw Error();
          } catch (u) {
            var n = u.stack.trim().match(/\n( *(at )?)/);
            ie = n && n[1] || "";
          }
        return `
` + ie + e;
      }
    }
    var oe = !1, ee;
    {
      var We = typeof WeakMap == "function" ? WeakMap : Map;
      ee = new We();
    }
    function pe(e, r) {
      if (!e || oe)
        return "";
      {
        var t = ee.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      oe = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = ae.current, ae.current = null, ze();
      try {
        if (r) {
          var c = function() {
            throw Error();
          };
          if (Object.defineProperty(c.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(c, []);
            } catch (Y) {
              n = Y;
            }
            Reflect.construct(e, [], c);
          } else {
            try {
              c.call();
            } catch (Y) {
              n = Y;
            }
            e.call(c.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Y) {
            n = Y;
          }
          e();
        }
      } catch (Y) {
        if (Y && n && typeof Y.stack == "string") {
          for (var o = Y.stack.split(`
`), m = n.stack.split(`
`), l = o.length - 1, f = m.length - 1; l >= 1 && f >= 0 && o[l] !== m[f]; )
            f--;
          for (; l >= 1 && f >= 0; l--, f--)
            if (o[l] !== m[f]) {
              if (l !== 1 || f !== 1)
                do
                  if (l--, f--, f < 0 || o[l] !== m[f]) {
                    var p = `
` + o[l].replace(" at new ", " at ");
                    return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), typeof e == "function" && ee.set(e, p), p;
                  }
                while (l >= 1 && f >= 0);
              break;
            }
        }
      } finally {
        oe = !1, ae.current = s, Ye(), Error.prepareStackTrace = u;
      }
      var Q = e ? e.displayName || e.name : "", ke = Q ? q(Q) : "";
      return typeof e == "function" && ee.set(e, ke), ke;
    }
    function Be(e, r, t) {
      return pe(e, !1);
    }
    function Ve(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function re(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return pe(e, Ve(e));
      if (typeof e == "string")
        return q(e);
      switch (e) {
        case i:
          return q("Suspense");
        case d:
          return q("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case a:
            return Be(e.render);
          case M:
            return re(e.type, r, t);
          case w: {
            var n = e, u = n._payload, s = n._init;
            try {
              return re(s(u), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var te = Object.prototype.hasOwnProperty, Ne = {}, Ie = S.ReactDebugCurrentFrame;
    function ne(e) {
      if (e) {
        var r = e._owner, t = re(e.type, e._source, r ? r.type : null);
        Ie.setExtraStackFrame(t);
      } else
        Ie.setExtraStackFrame(null);
    }
    function Qe(e, r, t, n, u) {
      {
        var s = Function.call.bind(te);
        for (var c in e)
          if (s(e, c)) {
            var o = void 0;
            try {
              if (typeof e[c] != "function") {
                var m = Error((n || "React class") + ": " + t + " type `" + c + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[c] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw m.name = "Invariant Violation", m;
              }
              o = e[c](r, c, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (l) {
              o = l;
            }
            o && !(o instanceof Error) && (ne(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, c, typeof o), ne(null)), o instanceof Error && !(o.message in Ne) && (Ne[o.message] = !0, ne(u), g("Failed %s type: %s", t, o.message), ne(null));
          }
      }
    }
    var Ze = Array.isArray;
    function ce(e) {
      return Ze(e);
    }
    function Fe(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Ue(e) {
      try {
        return Te(e), !1;
      } catch {
        return !0;
      }
    }
    function Te(e) {
      return "" + e;
    }
    function Le(e) {
      if (Ue(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Fe(e)), Te(e);
    }
    var G = S.ReactCurrentOwner, Ge = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Se, De, ue;
    ue = {};
    function Je(e) {
      if (te.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function He(e) {
      if (te.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function $e(e, r) {
      if (typeof e.ref == "string" && G.current && r && G.current.stateNode !== r) {
        var t = A(G.current.type);
        ue[t] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', A(G.current.type), e.ref), ue[t] = !0);
      }
    }
    function Xe(e, r) {
      {
        var t = function() {
          Se || (Se = !0, g("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function Ke(e, r) {
      {
        var t = function() {
          De || (De = !0, g("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var qe = function(e, r, t, n, u, s, c) {
      var o = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: b,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: c,
        // Record the component responsible for creating this element.
        _owner: s
      };
      return o._store = {}, Object.defineProperty(o._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(o, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(o, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: u
      }), Object.freeze && (Object.freeze(o.props), Object.freeze(o)), o;
    };
    function er(e, r, t, n, u) {
      {
        var s, c = {}, o = null, m = null;
        t !== void 0 && (Le(t), o = "" + t), He(r) && (Le(r.key), o = "" + r.key), Je(r) && (m = r.ref, $e(r, u));
        for (s in r)
          te.call(r, s) && !Ge.hasOwnProperty(s) && (c[s] = r[s]);
        if (e && e.defaultProps) {
          var l = e.defaultProps;
          for (s in l)
            c[s] === void 0 && (c[s] = l[s]);
        }
        if (o || m) {
          var f = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          o && Xe(c, f), m && Ke(c, f);
        }
        return qe(e, o, m, u, n, G.current, c);
      }
    }
    var se = S.ReactCurrentOwner, he = S.ReactDebugCurrentFrame;
    function V(e) {
      if (e) {
        var r = e._owner, t = re(e.type, e._source, r ? r.type : null);
        he.setExtraStackFrame(t);
      } else
        he.setExtraStackFrame(null);
    }
    var le;
    le = !1;
    function fe(e) {
      return typeof e == "object" && e !== null && e.$$typeof === b;
    }
    function Ee() {
      {
        if (se.current) {
          var e = A(se.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function rr(e) {
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
    function tr(e) {
      {
        var r = Ee();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function xe(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = tr(r);
        if (Re[t])
          return;
        Re[t] = !0;
        var n = "";
        e && e._owner && e._owner !== se.current && (n = " It was passed a child from " + A(e._owner.type) + "."), V(e), g('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), V(null);
      }
    }
    function Ae(e, r) {
      {
        if (typeof e != "object")
          return;
        if (ce(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            fe(n) && xe(n, r);
          }
        else if (fe(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var u = _(e);
          if (typeof u == "function" && u !== e.entries)
            for (var s = u.call(e), c; !(c = s.next()).done; )
              fe(c.value) && xe(c.value, r);
        }
      }
    }
    function nr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === a || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === M))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = A(r);
          Qe(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !le) {
          le = !0;
          var u = A(r);
          g("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", u || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && g("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ar(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            V(e), g("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), V(null);
            break;
          }
        }
        e.ref !== null && (V(e), g("Invalid attribute `ref` supplied to `React.Fragment`."), V(null));
      }
    }
    function Oe(e, r, t, n, u, s) {
      {
        var c = B(e);
        if (!c) {
          var o = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (o += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var m = rr(u);
          m ? o += m : o += Ee();
          var l;
          e === null ? l = "null" : ce(e) ? l = "array" : e !== void 0 && e.$$typeof === b ? (l = "<" + (A(e.type) || "Unknown") + " />", o = " Did you accidentally export a JSX literal instead of a component?") : l = typeof e, g("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", l, o);
        }
        var f = er(e, r, t, u, s);
        if (f == null)
          return f;
        if (c) {
          var p = r.children;
          if (p !== void 0)
            if (n)
              if (ce(p)) {
                for (var Q = 0; Q < p.length; Q++)
                  Ae(p[Q], e);
                Object.freeze && Object.freeze(p);
              } else
                g("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ae(p, e);
        }
        return e === E ? ar(f) : nr(f), f;
      }
    }
    function ir(e, r, t) {
      return Oe(e, r, t, !0);
    }
    function or(e, r, t) {
      return Oe(e, r, t, !1);
    }
    var cr = or, ur = ir;
    $.Fragment = E, $.jsx = cr, $.jsxs = ur;
  }()), $;
}
process.env.NODE_ENV === "production" ? de.exports = fr() : de.exports = dr();
var N = de.exports;
const gr = (h, b, O) => {
  const [E, I] = W(!1), [C, y] = W(!1), [T, a] = W(0), [i, d] = W(), [M, w] = W(), [L, v] = W(), k = J(() => {
    const j = setInterval(() => {
      a((R) => R + 1);
    }, 1e3);
    w(j);
  }, [a, w]), _ = J(() => {
    M != null && clearInterval(Number(M)), w(void 0);
  }, [M, w]), S = J(() => {
    M == null && navigator.mediaDevices.getUserMedia({ audio: h ?? !0 }).then((j) => {
      I(!0);
      const R = new MediaRecorder(
        j,
        O
      );
      d(R), R.start(), k(), R.addEventListener("dataavailable", (F) => {
        v(F.data), R.stream.getTracks().forEach((x) => x.stop()), d(void 0);
      });
    }).catch((j) => {
      console.log(j.name, j.message, j.cause), b == null || b(j);
    });
  }, [
    M,
    I,
    d,
    k,
    v,
    b,
    O
  ]), g = J(() => {
    i == null || i.stop(), _(), a(0), I(!1), y(!1);
  }, [
    i,
    a,
    I,
    y,
    _
  ]), Z = J(() => {
    C ? (y(!1), i == null || i.resume(), k()) : (y(!0), _(), i == null || i.pause());
  }, [i, y, k, _]);
  return {
    startRecording: S,
    stopRecording: g,
    togglePauseResume: Z,
    recordingBlob: L,
    isRecording: E,
    isPaused: C,
    recordingTime: T,
    mediaRecorder: i
  };
}, Mr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ3MCA0NzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3MCA0NzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KCTxnPgoJCTxwYXRoIGQ9Ik0yMzUsMzAyLjI5NmM0Ny4xNzcsMCw4NS40MjMtMzguMjQ1LDg1LjQyMy04NS40MjNWODUuNDIzQzMyMC40MjMsMzguMjQ1LDI4Mi4xNzcsMCwyMzUsMHMtODUuNDIzLDM4LjI0NS04NS40MjMsODUuNDIzCgkJCXYxMzEuNDUxQzE0OS41NzcsMjY0LjA1MSwxODcuODIzLDMwMi4yOTYsMjM1LDMwMi4yOTZ6Ii8+CgkJPHBhdGggZD0iTTM1MC40MjMsMTM2LjE0OHYzMGgxNXY1MC43MjZjMCw3MS45MTUtNTguNTA4LDEzMC40MjMtMTMwLjQyMywxMzAuNDIzcy0xMzAuNDIzLTU4LjUwNy0xMzAuNDIzLTEzMC40MjN2LTUwLjcyNmgxNXYtMzAKCQkJaC00NXY4MC43MjZDNzQuNTc3LDMwMC4yNzMsMTM4LjU1MSwzNjksMjIwLDM3Ni41ODlWNDQwaC05MC40NDR2MzBoMjEwLjg4OXYtMzBIMjUwdi02My40MTEKCQkJYzgxLjQ0OS03LjU4OSwxNDUuNDIzLTc2LjMxNywxNDUuNDIzLTE1OS43MTZ2LTgwLjcyNkgzNTAuNDIzeiIvPgoJPC9nPgo8L3N2Zz4K", vr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDcuNjA3IDQ3LjYwNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDcuNjA3IDQ3LjYwNzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgoJPGc+CgkJPHBhdGggZD0iTTE3Ljk5MSw0MC45NzZjMCwzLjY2Mi0yLjk2OSw2LjYzMS02LjYzMSw2LjYzMWwwLDBjLTMuNjYyLDAtNi42MzEtMi45NjktNi42MzEtNi42MzFWNi42MzFDNC43MjksMi45NjksNy42OTgsMCwxMS4zNiwwCgkJCWwwLDBjMy42NjIsMCw2LjYzMSwyLjk2OSw2LjYzMSw2LjYzMVY0MC45NzZ6Ii8+CgkJPHBhdGggZD0iTTQyLjg3Nyw0MC45NzZjMCwzLjY2Mi0yLjk2OSw2LjYzMS02LjYzMSw2LjYzMWwwLDBjLTMuNjYyLDAtNi42MzEtMi45NjktNi42MzEtNi42MzFWNi42MzEKCQkJQzI5LjYxNiwyLjk2OSwzMi41ODUsMCwzNi4yNDYsMGwwLDBjMy42NjIsMCw2LjYzMSwyLjk2OSw2LjYzMSw2LjYzMVY0MC45NzZ6Ii8+Cgk8L2c+Cjwvc3ZnPgo=", mr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NC4xNDggNDk0LjE0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk0LjE0OCA0OTQuMTQ4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTQwNS4yODQsMjAxLjE4OEwxMzAuODA0LDEzLjI4QzExOC4xMjgsNC41OTYsMTA1LjM1NiwwLDk0Ljc0LDBDNzQuMjE2LDAsNjEuNTIsMTYuNDcyLDYxLjUyLDQ0LjA0NHY0MDYuMTI0CgkJCQljMCwyNy41NCwxMi42OCw0My45OCwzMy4xNTYsNDMuOThjMTAuNjMyLDAsMjMuMi00LjYsMzUuOTA0LTEzLjMwOGwyNzQuNjA4LTE4Ny45MDRjMTcuNjYtMTIuMTA0LDI3LjQ0LTI4LjM5MiwyNy40NC00NS44ODQKCQkJCUM0MzIuNjMyLDIyOS41NzIsNDIyLjk2NCwyMTMuMjg4LDQwNS4yODQsMjAxLjE4OHoiLz4KCQk8L2c+Cgk8L2c+Cjwvc3ZnPgo=", wr = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTE3Ljg1IDMuMTVsLTIuOTktM0EuNTA4LjUwOCAwIDAgMCAxNC41IDBIMS40QTEuNDE3IDEuNDE3IDAgMCAwIDAgMS40M3YxNS4xNEExLjQxNyAxLjQxNyAwIDAgMCAxLjQgMThoMTUuMmExLjQxNyAxLjQxNyAwIDAgMCAxLjQtMS40M1YzLjVhLjQ3LjQ3IDAgMCAwLS4xNS0uMzV6TTIgNVYzYTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxdjJhMSAxIDAgMCAxLTEgMUgzYTEgMSAwIDAgMS0xLTF6bTcgMTFhNCA0IDAgMSAxIDQtNCA0IDQgMCAwIDEtNCA0eiIvPgo8L3N2Zz4K", yr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDYuNzM0IDQ2LjczNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDYuNzM0IDQ2LjczNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik00MS4zNDYsMEg1LjM4OEMyLjQxNywwLDAsMi40MTcsMCw1LjM4OHYzNS45NThjMCwyLjk3MSwyLjQxNyw1LjM4OCw1LjM4OCw1LjM4OGgzNS45NThjMi45NzEsMCw1LjM4OC0yLjQxNyw1LjM4OC01LjM4OAoJCVY1LjM4OEM0Ni43MzMsMi40MTcsNDQuMzE2LDAsNDEuMzQ2LDB6Ii8+CjwvZz4KPC9zdmc+Cg==";
const jr = ge.lazy(async () => {
  const { LiveAudioVisualizer: h } = await import("./react-audio-visualize.es-69216c73.js");
  return { default: h };
}), Cr = ({
  onRecordingComplete: h,
  onNotAllowedOrFound: b,
  recorderControls: O,
  audioTrackConstraints: E,
  downloadOnSavePress: I = !1,
  downloadFileExtension: C = "webm",
  showVisualizer: y = !1,
  mediaRecorderOptions: T,
  visualizer: a,
  classes: i
}) => {
  const {
    startRecording: d,
    stopRecording: M,
    togglePauseResume: w,
    recordingBlob: L,
    isRecording: v,
    isPaused: k,
    recordingTime: _,
    mediaRecorder: S
  } = O ?? // eslint-disable-next-line react-hooks/rules-of-hooks
  gr(
    E,
    b,
    T
  ), [g, Z] = W(!1), j = (x = !0) => {
    Z(x), M();
  }, R = async (x) => {
    const P = (await import("./index-f57b54f0.js").then((z) => z.i)).createFFmpeg({ log: !1 });
    await P.load();
    const B = "input.webm", D = `output.${C}`;
    P.FS(
      "writeFile",
      B,
      new Uint8Array(await x.arrayBuffer())
    ), await P.run("-i", B, D);
    const K = P.FS("readFile", D);
    return new Blob([K.buffer], {
      type: `audio/${C}`
    });
  }, F = async (x) => {
    !crossOriginIsolated && C !== "webm" && console.warn(
      'This website is not "cross-origin isolated". Audio will be downloaded in webm format, since mp3/wav encoding requires cross origin isolation. Please visit https://web.dev/cross-origin-isolation-guide/ and https://web.dev/coop-coep/ for information on how to make your website "cross-origin isolated"'
    );
    const X = crossOriginIsolated ? await R(x) : x, P = crossOriginIsolated ? C : "webm", B = URL.createObjectURL(X), D = document.createElement("a");
    D.style.display = "none", D.href = B, D.download = `audio.${P}`, document.body.appendChild(D), D.click(), D.remove();
  };
  return sr(() => {
    (g || O) && L != null && h != null && (h(L), I && F(L));
  }, [L]), /* @__PURE__ */ N.jsxs(
    "div",
    {
      className: `audio-recorder ${v ? "recording" : ""} ${(i == null ? void 0 : i.AudioRecorderClass) ?? ""}`,
      "data-testid": "audio_recorder",
      children: [
        /* @__PURE__ */ N.jsx(
          "img",
          {
            src: v ? wr : Mr,
            className: `audio-recorder-mic ${(i == null ? void 0 : i.AudioRecorderStartSaveClass) ?? ""}`,
            onClick: v ? () => j() : d,
            "data-testid": "ar_mic",
            title: v ? "Save recording" : "Start recording"
          }
        ),
        /* @__PURE__ */ N.jsxs(
          "span",
          {
            className: `audio-recorder-timer ${v ? "" : "display-none"} ${(i == null ? void 0 : i.AudioRecorderTimerClass) ?? ""}`,
            "data-testid": "ar_timer",
            children: [
              Math.floor(_ / 60),
              ":",
              String(_ % 60).padStart(2, "0")
            ]
          }
        ),
        y ? /* @__PURE__ */ N.jsx(
          "span",
          {
            className: `audio-recorder-visualizer ${v ? "" : "display-none"}`,
            children: S && /* @__PURE__ */ N.jsx(lr, { fallback: /* @__PURE__ */ N.jsx(N.Fragment, {}), children: /* @__PURE__ */ N.jsx(
              jr,
              {
                mediaRecorder: S,
                barWidth: (a == null ? void 0 : a.barWidth) ?? 2,
                gap: (a == null ? void 0 : a.gap) ?? 2,
                width: (a == null ? void 0 : a.width) ?? 70,
                height: (a == null ? void 0 : a.height) ?? 30,
                fftSize: (a == null ? void 0 : a.fftSize) ?? 512,
                maxDecibels: (a == null ? void 0 : a.maxDecibels) ?? -10,
                minDecibels: (a == null ? void 0 : a.minDecibels) ?? -80,
                smoothingTimeConstant: (a == null ? void 0 : a.smoothingTimeConstant) ?? 0.4
              }
            ) })
          }
        ) : /* @__PURE__ */ N.jsxs(
          "span",
          {
            className: `audio-recorder-status ${v ? "" : "display-none"} ${(i == null ? void 0 : i.AudioRecorderStatusClass) ?? ""}`,
            children: [
              /* @__PURE__ */ N.jsx("span", { className: "audio-recorder-status-dot" }),
              "Recording"
            ]
          }
        ),
        /* @__PURE__ */ N.jsx(
          "img",
          {
            src: k ? mr : vr,
            className: `audio-recorder-options ${v ? "" : "display-none"} ${(i == null ? void 0 : i.AudioRecorderPauseResumeClass) ?? ""}`,
            onClick: w,
            title: k ? "Resume recording" : "Pause recording",
            "data-testid": "ar_pause"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "img",
          {
            src: yr,
            className: `audio-recorder-options ${v ? "" : "display-none"} ${(i == null ? void 0 : i.AudioRecorderDiscardClass) ?? ""}`,
            onClick: () => j(!1),
            title: "Discard Recording",
            "data-testid": "ar_cancel"
          }
        )
      ]
    }
  );
};
export {
  Cr as AudioRecorder,
  gr as useAudioRecorder
};

/* eslint-disable */
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Note: This is a generated file. Do not edit by hand. Instead, run
// components/variations/proto/devtools/update_client_variations.py to update.

const gen = {};

// clang-format off
(function () {
  var f = this || self;
  function l(a, b) {
    a = a.split('.');
    var c = f;
    a[0] in c || 'undefined' == typeof c.execScript || c.execScript('var ' + a[0]);
    for (var d; a.length && (d = a.shift()); )
      a.length || void 0 === b ? (c[d] && c[d] !== Object.prototype[d] ? (c = c[d]) : (c = c[d] = {})) : (c[d] = b);
  }
  function m(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.m = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.base = function (d, e, g) {
      for (var k = Array(arguments.length - 2), h = 2; h < arguments.length; h++) k[h - 2] = arguments[h];
      return b.prototype[e].apply(d, k);
    };
  }
  function n(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, n);
    else {
      const b = Error().stack;
      b && (this.stack = b);
    }
    a && (this.message = String(a));
  }
  m(n, Error);
  n.prototype.name = 'CustomError';
  function p(a, b) {
    a = a.split('%s');
    for (var c = '', d = a.length - 1, e = 0; e < d; e++) c += a[e] + (e < b.length ? b[e] : '%s');
    n.call(this, c + a[d]);
  }
  m(p, n);
  p.prototype.name = 'AssertionError';
  function q(a, b) {
    throw new p('Failure' + (a ? ': ' + a : ''), Array.prototype.slice.call(arguments, 1));
  }
  function r() {
    this.a = '';
  }
  r.prototype.toString = function () {
    return 'SafeScript{' + this.a + '}';
  };
  r.prototype.g = function (a) {
    this.a = a;
  };
  new r().g('');
  function t() {
    this.l = '';
  }
  t.prototype.toString = function () {
    return 'SafeStyle{' + this.l + '}';
  };
  t.prototype.g = function (a) {
    this.l = a;
  };
  new t().g('');
  function u() {
    this.j = '';
  }
  u.prototype.toString = function () {
    return 'SafeStyleSheet{' + this.j + '}';
  };
  u.prototype.g = function (a) {
    this.j = a;
  };
  new u().g('');
  function v() {
    this.a = '';
  }
  v.prototype.toString = function () {
    return 'SafeHtml{' + this.a + '}';
  };
  v.prototype.g = function (a) {
    this.a = a;
  };
  new v().g('<!DOCTYPE html>');
  new v().g('');
  new v().g('<br>');
  var w = null;
  function x(a) {
    var b = a.length,
      c = (3 * b) / 4;
    c % 3 ? (c = Math.floor(c)) : -1 != '=.'.indexOf(a[b - 1]) && (c = -1 != '=.'.indexOf(a[b - 2]) ? c - 2 : c - 1);
    var d = new Uint8Array(c),
      e = 0;
    y(a, function (g) {
      d[e++] = g;
    });
    return d.subarray(0, e);
  }
  function y(a, b) {
    function c(N) {
      for (; d < a.length; ) {
        var z = a.charAt(d++),
          B = w[z];
        if (null != B) return B;
        if (!/^[\s\xa0]*$/.test(z)) throw Error('Unknown base64 encoding at char: ' + z);
      }
      return N;
    }
    A();
    for (var d = 0; ; ) {
      var e = c(-1),
        g = c(0),
        k = c(64),
        h = c(64);
      if (64 === h && -1 === e) break;
      b((e << 2) | (g >> 4));
      64 != k && (b(((g << 4) & 240) | (k >> 2)), 64 != h && b(((k << 6) & 192) | h));
    }
  }
  function A() {
    if (!w) {
      w = {};
      for (
        var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''),
          b = ['+/=', '+/', '-_=', '-_.', '-_'],
          c = 0;
        5 > c;
        c++
      )
        for (var d = a.concat(b[c].split('')), e = 0; e < d.length; e++) {
          var g = d[e];
          void 0 === w[g] && (w[g] = e);
        }
    }
  }
  function C(a) {
    if (a.constructor === Uint8Array) return a;
    if (
      a.constructor === ArrayBuffer ||
      ('undefined' != typeof Buffer && a.constructor === Buffer) ||
      a.constructor === Array
    )
      return new Uint8Array(a);
    if (a.constructor === String) return x(a);
    q('Type not convertible to Uint8Array.');
    return new Uint8Array(0);
  }
  function D(a) {
    this.b = null;
    this.a = this.h = this.i = 0;
    a && E(this, a);
  }
  var F = [];
  function E(a, b) {
    a.b = C(b);
    a.i = 0;
    a.h = a.b.length;
    a.a = a.i;
  }
  D.prototype.reset = function () {
    this.a = this.i;
  };
  D.prototype.f = function () {
    var a = this.b;
    var b = a[this.a];
    var c = b & 127;
    if (128 > b) return (this.a += 1), c;
    b = a[this.a + 1];
    c |= (b & 127) << 7;
    if (128 > b) return (this.a += 2), c;
    b = a[this.a + 2];
    c |= (b & 127) << 14;
    if (128 > b) return (this.a += 3), c;
    b = a[this.a + 3];
    c |= (b & 127) << 21;
    if (128 > b) return (this.a += 4), c;
    b = a[this.a + 4];
    c |= (b & 15) << 28;
    if (128 > b) return (this.a += 5), c >>> 0;
    this.a += 5;
    128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && this.a++;
    return c;
  };
  D.prototype.c = D.prototype.f;
  function G(a) {
    if (F.length) {
      var b = F.pop();
      a && E(b, a);
      a = b;
    } else a = new D(a);
    this.a = a;
    this.h = this.a.a;
    this.b = this.c = -1;
    this.f = !1;
  }
  G.prototype.reset = function () {
    this.a.reset();
    this.b = this.c = -1;
  };
  function H(a) {
    var b = a.a;
    if (b.a == b.h) return !1;
    (b = a.f) || ((b = a.a), (b = 0 > b.a || b.a > b.h));
    if (b) return q('Decoder hit an error'), !1;
    a.h = a.a.a;
    var c = a.a.f();
    b = c >>> 3;
    c &= 7;
    if (0 != c && 5 != c && 1 != c && 2 != c && 3 != c && 4 != c)
      return q('Invalid wire type: %s (at position %s)', c, a.h), (a.f = !0), !1;
    a.c = b;
    a.b = c;
    return !0;
  }
  function I(a) {
    switch (a.b) {
      case 0:
        if (0 != a.b) q('Invalid wire type for skipVarintField'), I(a);
        else {
          for (a = a.a; a.b[a.a] & 128; ) a.a++;
          a.a++;
        }
        break;
      case 1:
        1 != a.b ? (q('Invalid wire type for skipFixed64Field'), I(a)) : ((a = a.a), (a.a += 8));
        break;
      case 2:
        if (2 != a.b) q('Invalid wire type for skipDelimitedField'), I(a);
        else {
          var b = a.a.f();
          a = a.a;
          a.a += b;
        }
        break;
      case 5:
        5 != a.b ? (q('Invalid wire type for skipFixed32Field'), I(a)) : ((a = a.a), (a.a += 4));
        break;
      case 3:
        b = a.c;
        do {
          if (!H(a)) {
            q('Unmatched start-group tag: stream EOF');
            a.f = !0;
            break;
          }
          if (4 == a.b) {
            a.c != b && (q('Unmatched end-group tag'), (a.f = !0));
            break;
          }
          I(a);
        } while (1);
        break;
      default:
        q('Invalid wire encoding for field.');
    }
  }
  function J(a, b) {
    var c = a.a.f();
    c = a.a.a + c;
    for (var d = []; a.a.a < c; ) d.push(b.call(a.a));
    return d;
  }
  function K() {}
  var L = 'function' == typeof Uint8Array,
    M = Object.freeze ? Object.freeze([]) : [];
  function O(a, b) {
    if (b < a.c) {
      b += a.f;
      var c = a.a[b];
      return c === M ? (a.a[b] = []) : c;
    }
    if (a.b) return (c = a.b[b]), c === M ? (a.b[b] = []) : c;
  }
  K.prototype.toString = function () {
    return this.a.toString();
  };
  function P(a) {
    var b = a;
    a = Q;
    b || (b = []);
    this.f = -1;
    this.a = b;
    a: {
      if ((b = this.a.length)) {
        --b;
        var c = this.a[b];
        if (!(null === c || 'object' != typeof c || Array.isArray(c) || (L && c instanceof Uint8Array))) {
          this.c = b - -1;
          this.b = c;
          break a;
        }
      }
      this.c = Number.MAX_VALUE;
    }
    if (a)
      for (b = 0; b < a.length; b++)
        if (((c = a[b]), c < this.c)) (c += -1), (this.a[c] = this.a[c] || M);
        else {
          var d = this.c + -1;
          this.a[d] || (this.b = this.a[d] = {});
          this.b[c] = this.b[c] || M;
        }
  }
  m(P, K);
  var Q = [1, 3];
  function R(a) {
    a = new G(a);
    for (var b = new P(); H(a) && 4 != a.b; )
      switch (a.c) {
        case 1:
          for (var c = 2 == a.b ? J(a, a.a.c) : [a.a.c()], d = 0; d < c.length; d++) {
            var e = c[d];
            O(b, 1).push(e);
          }
          break;
        case 3:
          c = 2 == a.b ? J(a, a.a.c) : [a.a.c()];
          for (d = 0; d < c.length; d++) (e = c[d]), O(b, 3).push(e);
          break;
        default:
          I(a);
      }
    return b;
  }
  l('parseClientVariations', function (a) {
    var b = '';
    try {
      b = atob(a);
    } catch (c) {}
    a = [];
    for (let c = 0; c < b.length; c++) a.push(b.charCodeAt(c));
    b = null;
    try {
      b = R(a);
    } catch (c) {
      b = R([]);
    }
    return { variationIds: O(b, 1), triggerVariationIds: O(b, 3) };
  });
  l(
    'formatClientVariations',
    function (
      a,
      b = 'Active client experiment variation IDs.',
      c = 'Active client experiment variation IDs that trigger server-side behavior.',
    ) {
      const d = a.variationIds;
      a = a.triggerVariationIds;
      const e = ['message ClientVariations {'];
      d.length && e.push(`  // ${b}`, `  repeated int32 variation_id = [${d.join(', ')}];`);
      a.length && e.push(`  // ${c}`, `  repeated int32 trigger_variation_id = [${a.join(', ')}];`);
      e.push('}');
      return e.join('\n');
    },
  );
}).call(gen);
// clang-format on

export function parseClientVariations(data) {
  return gen.parseClientVariations(data);
}
export function formatClientVariations(data) {
  return gen.formatClientVariations(data);
}

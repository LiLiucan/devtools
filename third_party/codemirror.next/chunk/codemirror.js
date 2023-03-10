const t = 1024;
let e = 0;
class i {
  constructor(t, e) {
    (this.from = t), (this.to = e);
  }
}
class n {
  constructor(t = {}) {
    (this.id = e++),
      (this.perNode = !!t.perNode),
      (this.deserialize =
        t.deserialize ||
        (() => {
          throw new Error("This node type doesn't define a deserialize function");
        }));
  }
  add(t) {
    if (this.perNode) throw new RangeError("Can't add per-node props to node types");
    return (
      'function' != typeof t && (t = o.match(t)),
      (e) => {
        let i = t(e);
        return void 0 === i ? null : [this, i];
      }
    );
  }
}
(n.closedBy = new n({ deserialize: (t) => t.split(' ') })),
  (n.openedBy = new n({ deserialize: (t) => t.split(' ') })),
  (n.group = new n({ deserialize: (t) => t.split(' ') })),
  (n.contextHash = new n({ perNode: !0 })),
  (n.lookAhead = new n({ perNode: !0 })),
  (n.mounted = new n({ perNode: !0 }));
class s {
  constructor(t, e, i) {
    (this.tree = t), (this.overlay = e), (this.parser = i);
  }
}
const r = Object.create(null);
class o {
  constructor(t, e, i, n = 0) {
    (this.name = t), (this.props = e), (this.id = i), (this.flags = n);
  }
  static define(t) {
    let e = t.props && t.props.length ? Object.create(null) : r,
      i = (t.top ? 1 : 0) | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (null == t.name ? 8 : 0),
      n = new o(t.name || '', e, t.id, i);
    if (t.props)
      for (let i of t.props)
        if ((Array.isArray(i) || (i = i(n)), i)) {
          if (i[0].perNode) throw new RangeError("Can't store a per-node prop on a node type");
          e[i[0].id] = i[1];
        }
    return n;
  }
  prop(t) {
    return this.props[t.id];
  }
  get isTop() {
    return (1 & this.flags) > 0;
  }
  get isSkipped() {
    return (2 & this.flags) > 0;
  }
  get isError() {
    return (4 & this.flags) > 0;
  }
  get isAnonymous() {
    return (8 & this.flags) > 0;
  }
  is(t) {
    if ('string' == typeof t) {
      if (this.name == t) return !0;
      let e = this.prop(n.group);
      return !!e && e.indexOf(t) > -1;
    }
    return this.id == t;
  }
  static match(t) {
    let e = Object.create(null);
    for (let i in t) for (let n of i.split(' ')) e[n] = t[i];
    return (t) => {
      for (let i = t.prop(n.group), s = -1; s < (i ? i.length : 0); s++) {
        let n = e[s < 0 ? t.name : i[s]];
        if (n) return n;
      }
    };
  }
}
o.none = new o('', Object.create(null), 0, 8);
class a {
  constructor(t) {
    this.types = t;
    for (let e = 0; e < t.length; e++)
      if (t[e].id != e)
        throw new RangeError('Node type ids should correspond to array positions when creating a node set');
  }
  extend(...t) {
    let e = [];
    for (let i of this.types) {
      let n = null;
      for (let e of t) {
        let t = e(i);
        t && (n || (n = Object.assign({}, i.props)), (n[t[0].id] = t[1]));
      }
      e.push(n ? new o(i.name, n, i.id, i.flags) : i);
    }
    return new a(e);
  }
}
const l = new WeakMap(),
  h = new WeakMap();
var c;
!(function (t) {
  (t[(t.ExcludeBuffers = 1)] = 'ExcludeBuffers'),
    (t[(t.IncludeAnonymous = 2)] = 'IncludeAnonymous'),
    (t[(t.IgnoreMounts = 4)] = 'IgnoreMounts'),
    (t[(t.IgnoreOverlays = 8)] = 'IgnoreOverlays');
})(c || (c = {}));
class u {
  constructor(t, e, i, n, s) {
    if (
      ((this.type = t),
      (this.children = e),
      (this.positions = i),
      (this.length = n),
      (this.props = null),
      s && s.length)
    ) {
      this.props = Object.create(null);
      for (let [t, e] of s) this.props['number' == typeof t ? t : t.id] = e;
    }
  }
  toString() {
    let t = this.prop(n.mounted);
    if (t && !t.overlay) return t.tree.toString();
    let e = '';
    for (let t of this.children) {
      let i = t.toString();
      i && (e && (e += ','), (e += i));
    }
    return this.type.name
      ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) +
          (e.length ? '(' + e + ')' : '')
      : e;
  }
  cursor(t = 0) {
    return new x(this.topNode, t);
  }
  cursorAt(t, e = 0, i = 0) {
    let n = l.get(this) || this.topNode,
      s = new x(n);
    return s.moveTo(t, e), l.set(this, s._tree), s;
  }
  get topNode() {
    return new m(this, 0, 0, null);
  }
  resolve(t, e = 0) {
    let i = g(l.get(this) || this.topNode, t, e, !1);
    return l.set(this, i), i;
  }
  resolveInner(t, e = 0) {
    let i = g(h.get(this) || this.topNode, t, e, !0);
    return h.set(this, i), i;
  }
  iterate(t) {
    let { enter: e, leave: i, from: n = 0, to: s = this.length } = t;
    for (let r = this.cursor((t.mode || 0) | c.IncludeAnonymous); ; ) {
      let t = !1;
      if (r.from <= s && r.to >= n && (r.type.isAnonymous || !1 !== e(r))) {
        if (r.firstChild()) continue;
        t = !0;
      }
      for (; t && i && !r.type.isAnonymous && i(r), !r.nextSibling(); ) {
        if (!r.parent()) return;
        t = !0;
      }
    }
  }
  prop(t) {
    return t.perNode ? (this.props ? this.props[t.id] : void 0) : this.type.prop(t);
  }
  get propValues() {
    let t = [];
    if (this.props) for (let e in this.props) t.push([+e, this.props[e]]);
    return t;
  }
  balance(t = {}) {
    return this.children.length <= 8
      ? this
      : $(
          o.none,
          this.children,
          this.positions,
          0,
          this.children.length,
          0,
          this.length,
          (t, e, i) => new u(this.type, t, e, i, this.propValues),
          t.makeTree || ((t, e, i) => new u(o.none, t, e, i)),
        );
  }
  static build(e) {
    return (function (e) {
      var i;
      let { buffer: s, nodeSet: r, maxBufferLength: o = t, reused: a = [], minRepeatType: l = r.types.length } = e,
        h = Array.isArray(s) ? new O(s, s.length) : s,
        c = r.types,
        d = 0,
        p = 0;
      function g(t, e, i, n, s) {
        let { id: u, start: O, end: x, size: v } = h,
          S = p;
        for (; v < 0; ) {
          if ((h.next(), -1 == v)) {
            let e = a[u];
            return i.push(e), void n.push(O - t);
          }
          if (-3 == v) return void (d = u);
          if (-4 == v) return void (p = u);
          throw new RangeError(`Unrecognized record size: ${v}`);
        }
        let k,
          T,
          P = c[u],
          R = O - t;
        if (x - O <= o && (T = y(h.pos - e, s))) {
          let e = new Uint16Array(T.size - T.skip),
            i = h.pos - T.size,
            n = e.length;
          for (; h.pos > i; ) n = w(T.start, e, n);
          (k = new f(e, x - T.start, r)), (R = T.start - t);
        } else {
          let t = h.pos - v;
          h.next();
          let e = [],
            i = [],
            n = u >= l ? u : -1,
            s = 0,
            r = x;
          for (; h.pos > t; )
            n >= 0 && h.id == n && h.size >= 0
              ? (h.end <= r - o && (Q(e, i, O, s, h.end, r, n, S), (s = e.length), (r = h.end)), h.next())
              : g(O, t, e, i, n);
          if (
            (n >= 0 && s > 0 && s < e.length && Q(e, i, O, s, O, r, n, S), e.reverse(), i.reverse(), n > -1 && s > 0)
          ) {
            let t = m(P);
            k = $(P, e, i, 0, e.length, 0, x - O, t, t);
          } else k = b(P, e, i, x - O, S - x);
        }
        i.push(k), n.push(R);
      }
      function m(t) {
        return (e, i, s) => {
          let r,
            o,
            a = 0,
            l = e.length - 1;
          if (l >= 0 && (r = e[l]) instanceof u) {
            if (!l && r.type == t && r.length == s) return r;
            (o = r.prop(n.lookAhead)) && (a = i[l] + r.length + o);
          }
          return b(t, e, i, s, a);
        };
      }
      function Q(t, e, i, n, s, o, a, l) {
        let h = [],
          c = [];
        for (; t.length > n; ) h.push(t.pop()), c.push(e.pop() + i - s);
        t.push(b(r.types[a], h, c, o - s, l - o)), e.push(s - i);
      }
      function b(t, e, i, s, r = 0, o) {
        if (d) {
          let t = [n.contextHash, d];
          o = o ? [t].concat(o) : [t];
        }
        if (r > 25) {
          let t = [n.lookAhead, r];
          o = o ? [t].concat(o) : [t];
        }
        return new u(t, e, i, s, o);
      }
      function y(t, e) {
        let i = h.fork(),
          n = 0,
          s = 0,
          r = 0,
          a = i.end - o,
          c = { size: 0, start: 0, skip: 0 };
        t: for (let o = i.pos - t; i.pos > o; ) {
          let t = i.size;
          if (i.id == e && t >= 0) {
            (c.size = n), (c.start = s), (c.skip = r), (r += 4), (n += 4), i.next();
            continue;
          }
          let h = i.pos - t;
          if (t < 0 || h < o || i.start < a) break;
          let u = i.id >= l ? 4 : 0,
            O = i.start;
          for (i.next(); i.pos > h; ) {
            if (i.size < 0) {
              if (-3 != i.size) break t;
              u += 4;
            } else i.id >= l && (u += 4);
            i.next();
          }
          (s = O), (n += t), (r += u);
        }
        return (e < 0 || n == t) && ((c.size = n), (c.start = s), (c.skip = r)), c.size > 4 ? c : void 0;
      }
      function w(t, e, i) {
        let { id: n, start: s, end: r, size: o } = h;
        if ((h.next(), o >= 0 && n < l)) {
          let a = i;
          if (o > 4) {
            let n = h.pos - (o - 4);
            for (; h.pos > n; ) i = w(t, e, i);
          }
          (e[--i] = a), (e[--i] = r - t), (e[--i] = s - t), (e[--i] = n);
        } else -3 == o ? (d = n) : -4 == o && (p = n);
        return i;
      }
      let x = [],
        v = [];
      for (; h.pos > 0; ) g(e.start || 0, e.bufferStart || 0, x, v, -1);
      let S = null !== (i = e.length) && void 0 !== i ? i : x.length ? v[0] + x[0].length : 0;
      return new u(c[e.topID], x.reverse(), v.reverse(), S);
    })(e);
  }
}
u.empty = new u(o.none, [], [], 0);
class O {
  constructor(t, e) {
    (this.buffer = t), (this.index = e);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new O(this.buffer, this.index);
  }
}
class f {
  constructor(t, e, i) {
    (this.buffer = t), (this.length = e), (this.set = i);
  }
  get type() {
    return o.none;
  }
  toString() {
    let t = [];
    for (let e = 0; e < this.buffer.length; ) t.push(this.childString(e)), (e = this.buffer[e + 3]);
    return t.join(',');
  }
  childString(t) {
    let e = this.buffer[t],
      i = this.buffer[t + 3],
      n = this.set.types[e],
      s = n.name;
    if ((/\W/.test(s) && !n.isError && (s = JSON.stringify(s)), i == (t += 4))) return s;
    let r = [];
    for (; t < i; ) r.push(this.childString(t)), (t = this.buffer[t + 3]);
    return s + '(' + r.join(',') + ')';
  }
  findChild(t, e, i, n, s) {
    let { buffer: r } = this,
      o = -1;
    for (let a = t; a != e && !(d(s, n, r[a + 1], r[a + 2]) && ((o = a), i > 0)); a = r[a + 3]);
    return o;
  }
  slice(t, e, i, n) {
    let s = this.buffer,
      r = new Uint16Array(e - t);
    for (let n = t, o = 0; n < e; )
      (r[o++] = s[n++]), (r[o++] = s[n++] - i), (r[o++] = s[n++] - i), (r[o++] = s[n++] - t);
    return new f(r, n - i, this.set);
  }
}
function d(t, e, i, n) {
  switch (t) {
    case -2:
      return i < e;
    case -1:
      return n >= e && i < e;
    case 0:
      return i < e && n > e;
    case 1:
      return i <= e && n > e;
    case 2:
      return n > e;
    case 4:
      return !0;
  }
}
function p(t, e) {
  let i = t.childBefore(e);
  for (; i; ) {
    let e = i.lastChild;
    if (!e || e.to != i.to) break;
    e.type.isError && e.from == e.to ? ((t = i), (i = e.prevSibling)) : (i = e);
  }
  return t;
}
function g(t, e, i, n) {
  for (var s; t.from == t.to || (i < 1 ? t.from >= e : t.from > e) || (i > -1 ? t.to <= e : t.to < e); ) {
    let e = !n && t instanceof m && t.index < 0 ? null : t.parent;
    if (!e) return t;
    t = e;
  }
  let r = n ? 0 : c.IgnoreOverlays;
  if (n)
    for (let n = t, o = n.parent; o; n = o, o = n.parent)
      n instanceof m &&
        n.index < 0 &&
        (null === (s = o.enter(e, i, r)) || void 0 === s ? void 0 : s.from) != n.from &&
        (t = o);
  for (;;) {
    let n = t.enter(e, i, r);
    if (!n) return t;
    t = n;
  }
}
class m {
  constructor(t, e, i, n) {
    (this._tree = t), (this.from = e), (this.index = i), (this._parent = n);
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(t, e, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: a, positions: l } = o._tree, h = e > 0 ? a.length : -1; t != h; t += e) {
        let h = a[t],
          u = l[t] + o.from;
        if (d(s, i, u, u + h.length))
          if (h instanceof f) {
            if (r & c.ExcludeBuffers) continue;
            let n = h.findChild(0, h.buffer.length, e, i - u, s);
            if (n > -1) return new w(new y(o, h, t, u), null, n);
          } else if (r & c.IncludeAnonymous || !h.type.isAnonymous || v(h)) {
            let a;
            if (!(r & c.IgnoreMounts) && h.props && (a = h.prop(n.mounted)) && !a.overlay)
              return new m(a.tree, u, t, o);
            let l = new m(h, u, t, o);
            return r & c.IncludeAnonymous || !l.type.isAnonymous
              ? l
              : l.nextChild(e < 0 ? h.children.length - 1 : 0, e, i, s);
          }
      }
      if (r & c.IncludeAnonymous || !o.type.isAnonymous) return null;
      if (((t = o.index >= 0 ? o.index + e : e < 0 ? -1 : o._parent._tree.children.length), (o = o._parent), !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(0, 1, 0, 4);
  }
  get lastChild() {
    return this.nextChild(this._tree.children.length - 1, -1, 0, 4);
  }
  childAfter(t) {
    return this.nextChild(0, 1, t, 2);
  }
  childBefore(t) {
    return this.nextChild(this._tree.children.length - 1, -1, t, -2);
  }
  enter(t, e, i = 0) {
    let s;
    if (!(i & c.IgnoreOverlays) && (s = this._tree.prop(n.mounted)) && s.overlay) {
      let i = t - this.from;
      for (let { from: t, to: n } of s.overlay)
        if ((e > 0 ? t <= i : t < i) && (e < 0 ? n >= i : n > i))
          return new m(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, t, e, i);
  }
  nextSignificantParent() {
    let t = this;
    for (; t.type.isAnonymous && t._parent; ) t = t._parent;
    return t;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null;
  }
  cursor(t = 0) {
    return new x(this, t);
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  resolve(t, e = 0) {
    return g(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return g(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return p(this, t);
  }
  getChild(t, e = null, i = null) {
    let n = Q(this, t, e, i);
    return n.length ? n[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return Q(this, t, e, i);
  }
  toString() {
    return this._tree.toString();
  }
  get node() {
    return this;
  }
  matchContext(t) {
    return b(this, t);
  }
}
function Q(t, e, i, n) {
  let s = t.cursor(),
    r = [];
  if (!s.firstChild()) return r;
  if (null != i) for (; !s.type.is(i); ) if (!s.nextSibling()) return r;
  for (;;) {
    if (null != n && s.type.is(n)) return r;
    if ((s.type.is(e) && r.push(s.node), !s.nextSibling())) return null == n ? r : [];
  }
}
function b(t, e, i = e.length - 1) {
  for (let n = t.parent; i >= 0; n = n.parent) {
    if (!n) return !1;
    if (!n.type.isAnonymous) {
      if (e[i] && e[i] != n.name) return !1;
      i--;
    }
  }
  return !0;
}
class y {
  constructor(t, e, i, n) {
    (this.parent = t), (this.buffer = e), (this.index = i), (this.start = n);
  }
}
class w {
  constructor(t, e, i) {
    (this.context = t), (this._parent = e), (this.index = i), (this.type = t.buffer.set.types[t.buffer.buffer[i]]);
  }
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  child(t, e, i) {
    let { buffer: n } = this.context,
      s = n.findChild(this.index + 4, n.buffer[this.index + 3], t, e - this.context.start, i);
    return s < 0 ? null : new w(this.context, this, s);
  }
  get firstChild() {
    return this.child(1, 0, 4);
  }
  get lastChild() {
    return this.child(-1, 0, 4);
  }
  childAfter(t) {
    return this.child(1, t, 2);
  }
  childBefore(t) {
    return this.child(-1, t, -2);
  }
  enter(t, e, i = 0) {
    if (i & c.ExcludeBuffers) return null;
    let { buffer: n } = this.context,
      s = n.findChild(this.index + 4, n.buffer[this.index + 3], e > 0 ? 1 : -1, t - this.context.start, e);
    return s < 0 ? null : new w(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(t) {
    return this._parent ? null : this.context.parent.nextChild(this.context.index + t, t, 0, 4);
  }
  get nextSibling() {
    let { buffer: t } = this.context,
      e = t.buffer[this.index + 3];
    return e < (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length)
      ? new w(this.context, this._parent, e)
      : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: t } = this.context,
      e = this._parent ? this._parent.index + 4 : 0;
    return this.index == e
      ? this.externalSibling(-1)
      : new w(this.context, this._parent, t.findChild(e, this.index, -1, 0, 4));
  }
  cursor(t = 0) {
    return new x(this, t);
  }
  get tree() {
    return null;
  }
  toTree() {
    let t = [],
      e = [],
      { buffer: i } = this.context,
      n = this.index + 4,
      s = i.buffer[this.index + 3];
    if (s > n) {
      let r = i.buffer[this.index + 1],
        o = i.buffer[this.index + 2];
      t.push(i.slice(n, s, r, o)), e.push(0);
    }
    return new u(this.type, t, e, this.to - this.from);
  }
  resolve(t, e = 0) {
    return g(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return g(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return p(this, t);
  }
  toString() {
    return this.context.buffer.childString(this.index);
  }
  getChild(t, e = null, i = null) {
    let n = Q(this, t, e, i);
    return n.length ? n[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return Q(this, t, e, i);
  }
  get node() {
    return this;
  }
  matchContext(t) {
    return b(this, t);
  }
}
class x {
  constructor(t, e = 0) {
    if (
      ((this.mode = e),
      (this.buffer = null),
      (this.stack = []),
      (this.index = 0),
      (this.bufferNode = null),
      t instanceof m)
    )
      this.yieldNode(t);
    else {
      (this._tree = t.context.parent), (this.buffer = t.context);
      for (let e = t._parent; e; e = e._parent) this.stack.unshift(e.index);
      (this.bufferNode = t), this.yieldBuf(t.index);
    }
  }
  get name() {
    return this.type.name;
  }
  yieldNode(t) {
    return !!t && ((this._tree = t), (this.type = t.type), (this.from = t.from), (this.to = t.to), !0);
  }
  yieldBuf(t, e) {
    this.index = t;
    let { start: i, buffer: n } = this.buffer;
    return (
      (this.type = e || n.set.types[n.buffer[t]]),
      (this.from = i + n.buffer[t + 1]),
      (this.to = i + n.buffer[t + 2]),
      !0
    );
  }
  yield(t) {
    return (
      !!t &&
      (t instanceof m
        ? ((this.buffer = null), this.yieldNode(t))
        : ((this.buffer = t.context), this.yieldBuf(t.index, t.type)))
    );
  }
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  enterChild(t, e, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(t < 0 ? this._tree._tree.children.length - 1 : 0, t, e, i, this.mode));
    let { buffer: n } = this.buffer,
      s = n.findChild(this.index + 4, n.buffer[this.index + 3], t, e - this.buffer.start, i);
    return !(s < 0) && (this.stack.push(this.index), this.yieldBuf(s));
  }
  firstChild() {
    return this.enterChild(1, 0, 4);
  }
  lastChild() {
    return this.enterChild(-1, 0, 4);
  }
  childAfter(t) {
    return this.enterChild(1, t, 2);
  }
  childBefore(t) {
    return this.enterChild(-1, t, -2);
  }
  enter(t, e, i = this.mode) {
    return this.buffer ? !(i & c.ExcludeBuffers) && this.enterChild(1, t, e) : this.yield(this._tree.enter(t, e, i));
  }
  parent() {
    if (!this.buffer) return this.yieldNode(this.mode & c.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length) return this.yieldBuf(this.stack.pop());
    let t = this.mode & c.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return (this.buffer = null), this.yieldNode(t);
  }
  sibling(t) {
    if (!this.buffer)
      return (
        !!this._tree._parent &&
        this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + t, t, 0, 4, this.mode))
      );
    let { buffer: e } = this.buffer,
      i = this.stack.length - 1;
    if (t < 0) {
      let t = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != t) return this.yieldBuf(e.findChild(t, this.index, -1, 0, 4));
    } else {
      let t = e.buffer[this.index + 3];
      if (t < (i < 0 ? e.buffer.length : e.buffer[this.stack[i] + 3])) return this.yieldBuf(t);
    }
    return i < 0 && this.yield(this.buffer.parent.nextChild(this.buffer.index + t, t, 0, 4, this.mode));
  }
  nextSibling() {
    return this.sibling(1);
  }
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(t) {
    let e,
      i,
      { buffer: n } = this;
    if (n) {
      if (t > 0) {
        if (this.index < n.buffer.buffer.length) return !1;
      } else for (let t = 0; t < this.index; t++) if (n.buffer.buffer[t + 3] < this.index) return !1;
      ({ index: e, parent: i } = n);
    } else ({ index: e, _parent: i } = this._tree);
    for (; i; { index: e, _parent: i } = i)
      if (e > -1)
        for (let n = e + t, s = t < 0 ? -1 : i._tree.children.length; n != s; n += t) {
          let t = i._tree.children[n];
          if (this.mode & c.IncludeAnonymous || t instanceof f || !t.type.isAnonymous || v(t)) return !1;
        }
    return !0;
  }
  move(t, e) {
    if (e && this.enterChild(t, 0, 4)) return !0;
    for (;;) {
      if (this.sibling(t)) return !0;
      if (this.atLastNode(t) || !this.parent()) return !1;
    }
  }
  next(t = !0) {
    return this.move(1, t);
  }
  prev(t = !0) {
    return this.move(-1, t);
  }
  moveTo(t, e = 0) {
    for (
      ;
      (this.from == this.to || (e < 1 ? this.from >= t : this.from > t) || (e > -1 ? this.to <= t : this.to < t)) &&
      this.parent();

    );
    for (; this.enterChild(1, t, e); );
    return this;
  }
  get node() {
    if (!this.buffer) return this._tree;
    let t = this.bufferNode,
      e = null,
      i = 0;
    if (t && t.context == this.buffer)
      t: for (let n = this.index, s = this.stack.length; s >= 0; ) {
        for (let r = t; r; r = r._parent)
          if (r.index == n) {
            if (n == this.index) return r;
            (e = r), (i = s + 1);
            break t;
          }
        n = this.stack[--s];
      }
    for (let t = i; t < this.stack.length; t++) e = new w(this.buffer, e, this.stack[t]);
    return (this.bufferNode = new w(this.buffer, e, this.index));
  }
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  iterate(t, e) {
    for (let i = 0; ; ) {
      let n = !1;
      if (this.type.isAnonymous || !1 !== t(this)) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (n = !0);
      }
      for (; n && e && e(this), (n = this.type.isAnonymous), !this.nextSibling(); ) {
        if (!i) return;
        this.parent(), i--, (n = !0);
      }
    }
  }
  matchContext(t) {
    if (!this.buffer) return b(this.node, t);
    let { buffer: e } = this.buffer,
      { types: i } = e.set;
    for (let n = t.length - 1, s = this.stack.length - 1; n >= 0; s--) {
      if (s < 0) return b(this.node, t, n);
      let r = i[e.buffer[this.stack[s]]];
      if (!r.isAnonymous) {
        if (t[n] && t[n] != r.name) return !1;
        n--;
      }
    }
    return !0;
  }
}
function v(t) {
  return t.children.some((t) => t instanceof f || !t.type.isAnonymous || v(t));
}
const S = new WeakMap();
function k(t, e) {
  if (!t.isAnonymous || e instanceof f || e.type != t) return 1;
  let i = S.get(e);
  if (null == i) {
    i = 1;
    for (let n of e.children) {
      if (n.type != t || !(n instanceof u)) {
        i = 1;
        break;
      }
      i += k(t, n);
    }
    S.set(e, i);
  }
  return i;
}
function $(t, e, i, n, s, r, o, a, l) {
  let h = 0;
  for (let i = n; i < s; i++) h += k(t, e[i]);
  let c = Math.ceil((1.5 * h) / 8),
    u = [],
    O = [];
  return (
    (function e(i, n, s, o, a) {
      for (let h = s; h < o; ) {
        let s = h,
          f = n[h],
          d = k(t, i[h]);
        for (h++; h < o; h++) {
          let e = k(t, i[h]);
          if (d + e >= c) break;
          d += e;
        }
        if (h == s + 1) {
          if (d > c) {
            let t = i[s];
            e(t.children, t.positions, 0, t.children.length, n[s] + a);
            continue;
          }
          u.push(i[s]);
        } else {
          let e = n[h - 1] + i[h - 1].length - f;
          u.push($(t, i, n, s, h, f, e, null, l));
        }
        O.push(f + a - r);
      }
    })(e, i, n, s, 0),
    (a || l)(u, O, o)
  );
}
class T {
  constructor() {
    this.map = new WeakMap();
  }
  setBuffer(t, e, i) {
    let n = this.map.get(t);
    n || this.map.set(t, (n = new Map())), n.set(e, i);
  }
  getBuffer(t, e) {
    let i = this.map.get(t);
    return i && i.get(e);
  }
  set(t, e) {
    t instanceof w ? this.setBuffer(t.context.buffer, t.index, e) : t instanceof m && this.map.set(t.tree, e);
  }
  get(t) {
    return t instanceof w ? this.getBuffer(t.context.buffer, t.index) : t instanceof m ? this.map.get(t.tree) : void 0;
  }
  cursorSet(t, e) {
    t.buffer ? this.setBuffer(t.buffer.buffer, t.index, e) : this.map.set(t.tree, e);
  }
  cursorGet(t) {
    return t.buffer ? this.getBuffer(t.buffer.buffer, t.index) : this.map.get(t.tree);
  }
}
class P {
  constructor(t, e, i, n, s = !1, r = !1) {
    (this.from = t), (this.to = e), (this.tree = i), (this.offset = n), (this.open = (s ? 1 : 0) | (r ? 2 : 0));
  }
  get openStart() {
    return (1 & this.open) > 0;
  }
  get openEnd() {
    return (2 & this.open) > 0;
  }
  static addTree(t, e = [], i = !1) {
    let n = [new P(0, t.length, t, 0, !1, i)];
    for (let i of e) i.to > t.length && n.push(i);
    return n;
  }
  static applyChanges(t, e, i = 128) {
    if (!e.length) return t;
    let n = [],
      s = 1,
      r = t.length ? t[0] : null;
    for (let o = 0, a = 0, l = 0; ; o++) {
      let h = o < e.length ? e[o] : null,
        c = h ? h.fromA : 1e9;
      if (c - a >= i)
        for (; r && r.from < c; ) {
          let e = r;
          if (a >= e.from || c <= e.to || l) {
            let t = Math.max(e.from, a) - l,
              i = Math.min(e.to, c) - l;
            e = t >= i ? null : new P(t, i, e.tree, e.offset + l, o > 0, !!h);
          }
          if ((e && n.push(e), r.to > c)) break;
          r = s < t.length ? t[s++] : null;
        }
      if (!h) break;
      (a = h.toA), (l = h.toA - h.toB);
    }
    return n;
  }
}
class R {
  startParse(t, e, n) {
    return (
      'string' == typeof t && (t = new C(t)),
      (n = n ? (n.length ? n.map((t) => new i(t.from, t.to)) : [new i(0, 0)]) : [new i(0, t.length)]),
      this.createParse(t, e || [], n)
    );
  }
  parse(t, e, i) {
    let n = this.startParse(t, e, i);
    for (;;) {
      let t = n.advance();
      if (t) return t;
    }
  }
}
class C {
  constructor(t) {
    this.string = t;
  }
  get length() {
    return this.string.length;
  }
  chunk(t) {
    return this.string.slice(t);
  }
  get lineChunks() {
    return !1;
  }
  read(t, e) {
    return this.string.slice(t, e);
  }
}
function W(t) {
  return (e, i, n, s) => new j(e, t, i, n, s);
}
class X {
  constructor(t, e, i, n, s) {
    (this.parser = t), (this.parse = e), (this.overlay = i), (this.target = n), (this.ranges = s);
  }
}
class A {
  constructor(t, e, i, n, s, r, o) {
    (this.parser = t),
      (this.predicate = e),
      (this.mounts = i),
      (this.index = n),
      (this.start = s),
      (this.target = r),
      (this.prev = o),
      (this.depth = 0),
      (this.ranges = []);
  }
}
const Z = new n({ perNode: !0 });
class j {
  constructor(t, e, i, n, s) {
    (this.nest = e),
      (this.input = i),
      (this.fragments = n),
      (this.ranges = s),
      (this.inner = []),
      (this.innerDone = 0),
      (this.baseTree = null),
      (this.stoppedAt = null),
      (this.baseParse = t);
  }
  advance() {
    if (this.baseParse) {
      let t = this.baseParse.advance();
      if (!t) return null;
      if (((this.baseParse = null), (this.baseTree = t), this.startInner(), null != this.stoppedAt))
        for (let t of this.inner) t.parse.stopAt(this.stoppedAt);
    }
    if (this.innerDone == this.inner.length) {
      let t = this.baseTree;
      return (
        null != this.stoppedAt &&
          (t = new u(t.type, t.children, t.positions, t.length, t.propValues.concat([[Z, this.stoppedAt]]))),
        t
      );
    }
    let t = this.inner[this.innerDone],
      e = t.parse.advance();
    if (e) {
      this.innerDone++;
      let i = Object.assign(Object.create(null), t.target.props);
      (i[n.mounted.id] = new s(e, t.overlay, t.parser)), (t.target.props = i);
    }
    return null;
  }
  get parsedPos() {
    if (this.baseParse) return 0;
    let t = this.input.length;
    for (let e = this.innerDone; e < this.inner.length; e++)
      this.inner[e].ranges[0].from < t && (t = Math.min(t, this.inner[e].parse.parsedPos));
    return t;
  }
  stopAt(t) {
    if (((this.stoppedAt = t), this.baseParse)) this.baseParse.stopAt(t);
    else for (let e = this.innerDone; e < this.inner.length; e++) this.inner[e].parse.stopAt(t);
  }
  startInner() {
    let t = new q(this.fragments),
      e = null,
      n = null,
      s = new x(new m(this.baseTree, this.ranges[0].from, 0, null), c.IncludeAnonymous | c.IgnoreMounts);
    t: for (let r, o; null == this.stoppedAt || s.from < this.stoppedAt; ) {
      let a,
        l = !0;
      if (t.hasNode(s)) {
        if (e) {
          let t = e.mounts.find((t) => t.frag.from <= s.from && t.frag.to >= s.to && t.mount.overlay);
          if (t)
            for (let i of t.mount.overlay) {
              let n = i.from + t.pos,
                r = i.to + t.pos;
              n >= s.from &&
                r <= s.to &&
                !e.ranges.some((t) => t.from < r && t.to > n) &&
                e.ranges.push({ from: n, to: r });
            }
        }
        l = !1;
      } else if (n && (o = D(n.ranges, s.from, s.to))) l = 2 != o;
      else if (!s.type.isAnonymous && s.from < s.to && (r = this.nest(s, this.input))) {
        s.tree || M(s);
        let o = t.findMounts(s.from, r.parser);
        if ('function' == typeof r.overlay) e = new A(r.parser, r.overlay, o, this.inner.length, s.from, s.tree, e);
        else {
          let t = E(this.ranges, r.overlay || [new i(s.from, s.to)]);
          t.length &&
            this.inner.push(
              new X(
                r.parser,
                r.parser.startParse(this.input, V(o, t), t),
                r.overlay ? r.overlay.map((t) => new i(t.from - s.from, t.to - s.from)) : null,
                s.tree,
                t,
              ),
            ),
            r.overlay ? t.length && (n = { ranges: t, depth: 0, prev: n }) : (l = !1);
        }
      } else e && (a = e.predicate(s)) && (!0 === a && (a = new i(s.from, s.to)), a.from < a.to && e.ranges.push(a));
      if (l && s.firstChild()) e && e.depth++, n && n.depth++;
      else
        for (; !s.nextSibling(); ) {
          if (!s.parent()) break t;
          if (e && !--e.depth) {
            let t = E(this.ranges, e.ranges);
            t.length &&
              this.inner.splice(
                e.index,
                0,
                new X(
                  e.parser,
                  e.parser.startParse(this.input, V(e.mounts, t), t),
                  e.ranges.map((t) => new i(t.from - e.start, t.to - e.start)),
                  e.target,
                  t,
                ),
              ),
              (e = e.prev);
          }
          n && !--n.depth && (n = n.prev);
        }
    }
  }
}
function D(t, e, i) {
  for (let n of t) {
    if (n.from >= i) break;
    if (n.to > e) return n.from <= e && n.to >= i ? 2 : 1;
  }
  return 0;
}
function z(t, e, i, n, s, r) {
  if (e < i) {
    let o = t.buffer[e + 1],
      a = t.buffer[i - 2];
    n.push(t.slice(e, i, o, a)), s.push(o - r);
  }
}
function M(t) {
  let { node: e } = t,
    i = 0;
  do {
    t.parent(), i++;
  } while (!t.tree);
  let n = 0,
    s = t.tree,
    r = 0;
  for (; (r = s.positions[n] + t.from), !(r <= e.from && r + s.children[n].length >= e.to); n++);
  let a = s.children[n],
    l = a.buffer;
  s.children[n] = (function t(i, n, s, o, h) {
    let c = i;
    for (; l[c + 2] + r <= e.from; ) c = l[c + 3];
    let O = [],
      f = [];
    z(a, i, c, O, f, o);
    let d = l[c + 1],
      p = l[c + 2],
      g = d + r == e.from && p + r == e.to && l[c] == e.type.id;
    return (
      O.push(g ? e.toTree() : t(c + 4, l[c + 3], a.set.types[l[c]], d, p - d)),
      f.push(d - o),
      z(a, l[c + 3], n, O, f, o),
      new u(s, O, f, h)
    );
  })(0, l.length, o.none, 0, a.length);
  for (let n = 0; n <= i; n++) t.childAfter(e.from);
}
class _ {
  constructor(t, e) {
    (this.offset = e), (this.done = !1), (this.cursor = t.cursor(c.IncludeAnonymous | c.IgnoreMounts));
  }
  moveTo(t) {
    let { cursor: e } = this,
      i = t - this.offset;
    for (; !this.done && e.from < i; )
      (e.to >= t && e.enter(i, 1, c.IgnoreOverlays | c.ExcludeBuffers)) || e.next(!1) || (this.done = !0);
  }
  hasNode(t) {
    if ((this.moveTo(t.from), !this.done && this.cursor.from + this.offset == t.from && this.cursor.tree))
      for (let e = this.cursor.tree; ; ) {
        if (e == t.tree) return !0;
        if (!(e.children.length && 0 == e.positions[0] && e.children[0] instanceof u)) break;
        e = e.children[0];
      }
    return !1;
  }
}
class q {
  constructor(t) {
    var e;
    if (((this.fragments = t), (this.curTo = 0), (this.fragI = 0), t.length)) {
      let i = (this.curFrag = t[0]);
      (this.curTo = null !== (e = i.tree.prop(Z)) && void 0 !== e ? e : i.to), (this.inner = new _(i.tree, -i.offset));
    } else this.curFrag = this.inner = null;
  }
  hasNode(t) {
    for (; this.curFrag && t.from >= this.curTo; ) this.nextFrag();
    return this.curFrag && this.curFrag.from <= t.from && this.curTo >= t.to && this.inner.hasNode(t);
  }
  nextFrag() {
    var t;
    if ((this.fragI++, this.fragI == this.fragments.length)) this.curFrag = this.inner = null;
    else {
      let e = (this.curFrag = this.fragments[this.fragI]);
      (this.curTo = null !== (t = e.tree.prop(Z)) && void 0 !== t ? t : e.to), (this.inner = new _(e.tree, -e.offset));
    }
  }
  findMounts(t, e) {
    var i;
    let s = [];
    if (this.inner) {
      this.inner.cursor.moveTo(t, 1);
      for (let t = this.inner.cursor.node; t; t = t.parent) {
        let r = null === (i = t.tree) || void 0 === i ? void 0 : i.prop(n.mounted);
        if (r && r.parser == e)
          for (let e = this.fragI; e < this.fragments.length; e++) {
            let i = this.fragments[e];
            if (i.from >= t.to) break;
            i.tree == this.curFrag.tree && s.push({ frag: i, pos: t.from - i.offset, mount: r });
          }
      }
    }
    return s;
  }
}
function E(t, e) {
  let n = null,
    s = e;
  for (let r = 1, o = 0; r < t.length; r++) {
    let a = t[r - 1].to,
      l = t[r].from;
    for (; o < s.length; o++) {
      let t = s[o];
      if (t.from >= l) break;
      t.to <= a ||
        (n || (s = n = e.slice()),
        t.from < a
          ? ((n[o] = new i(t.from, a)), t.to > l && n.splice(o + 1, 0, new i(l, t.to)))
          : t.to > l
          ? (n[o--] = new i(l, t.to))
          : n.splice(o--, 1));
    }
  }
  return s;
}
function G(t, e, n, s) {
  let r = 0,
    o = 0,
    a = !1,
    l = !1,
    h = -1e9,
    c = [];
  for (;;) {
    let u = r == t.length ? 1e9 : a ? t[r].to : t[r].from,
      O = o == e.length ? 1e9 : l ? e[o].to : e[o].from;
    if (a != l) {
      let t = Math.max(h, n),
        e = Math.min(u, O, s);
      t < e && c.push(new i(t, e));
    }
    if (((h = Math.min(u, O)), 1e9 == h)) break;
    u == h && (a ? ((a = !1), r++) : (a = !0)), O == h && (l ? ((l = !1), o++) : (l = !0));
  }
  return c;
}
function V(t, e) {
  let n = [];
  for (let { pos: s, mount: r, frag: o } of t) {
    let t = s + (r.overlay ? r.overlay[0].from : 0),
      a = t + r.tree.length,
      l = Math.max(o.from, t),
      h = Math.min(o.to, a);
    if (r.overlay) {
      let a = G(
        e,
        r.overlay.map((t) => new i(t.from + s, t.to + s)),
        l,
        h,
      );
      for (let e = 0, i = l; ; e++) {
        let s = e == a.length,
          l = s ? h : a[e].from;
        if ((l > i && n.push(new P(i, l, r.tree, -t, o.from >= i, o.to <= l)), s)) break;
        i = a[e].to;
      }
    } else n.push(new P(l, h, r.tree, -t, o.from >= t, o.to <= a));
  }
  return n;
}
class I {
  constructor() {}
  lineAt(t) {
    if (t < 0 || t > this.length) throw new RangeError(`Invalid position ${t} in document of length ${this.length}`);
    return this.lineInner(t, !1, 1, 0);
  }
  line(t) {
    if (t < 1 || t > this.lines) throw new RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
    return this.lineInner(t, !0, 1, 0);
  }
  replace(t, e, i) {
    let n = [];
    return (
      this.decompose(0, t, n, 2),
      i.length && i.decompose(0, i.length, n, 3),
      this.decompose(e, this.length, n, 1),
      L.from(n, this.length - (e - t) + i.length)
    );
  }
  append(t) {
    return this.replace(this.length, this.length, t);
  }
  slice(t, e = this.length) {
    let i = [];
    return this.decompose(t, e, i, 0), L.from(i, e - t);
  }
  eq(t) {
    if (t == this) return !0;
    if (t.length != this.length || t.lines != this.lines) return !1;
    let e = this.scanIdentical(t, 1),
      i = this.length - this.scanIdentical(t, -1),
      n = new Y(this),
      s = new Y(t);
    for (let t = e, r = e; ; ) {
      if ((n.next(t), s.next(t), (t = 0), n.lineBreak != s.lineBreak || n.done != s.done || n.value != s.value))
        return !1;
      if (((r += n.value.length), n.done || r >= i)) return !0;
    }
  }
  iter(t = 1) {
    return new Y(this, t);
  }
  iterRange(t, e = this.length) {
    return new F(this, t, e);
  }
  iterLines(t, e) {
    let i;
    if (null == t) i = this.iter();
    else {
      null == e && (e = this.lines + 1);
      let n = this.line(t).from;
      i = this.iterRange(n, Math.max(n, e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to));
    }
    return new H(i);
  }
  toString() {
    return this.sliceString(0);
  }
  toJSON() {
    let t = [];
    return this.flatten(t), t;
  }
  static of(t) {
    if (0 == t.length) throw new RangeError('A document must have at least one line');
    return 1 != t.length || t[0] ? (t.length <= 32 ? new N(t) : L.from(N.split(t, []))) : I.empty;
  }
}
class N extends I {
  constructor(
    t,
    e = (function (t) {
      let e = -1;
      for (let i of t) e += i.length + 1;
      return e;
    })(t),
  ) {
    super(), (this.text = t), (this.length = e);
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(t, e, i, n) {
    for (let s = 0; ; s++) {
      let r = this.text[s],
        o = n + r.length;
      if ((e ? i : o) >= t) return new J(n, o, i, r);
      (n = o + 1), i++;
    }
  }
  decompose(t, e, i, n) {
    let s = t <= 0 && e >= this.length ? this : new N(B(this.text, t, e), Math.min(e, this.length) - Math.max(0, t));
    if (1 & n) {
      let t = i.pop(),
        e = U(s.text, t.text.slice(), 0, s.length);
      if (e.length <= 32) i.push(new N(e, t.length + s.length));
      else {
        let t = e.length >> 1;
        i.push(new N(e.slice(0, t)), new N(e.slice(t)));
      }
    } else i.push(s);
  }
  replace(t, e, i) {
    if (!(i instanceof N)) return super.replace(t, e, i);
    let n = U(this.text, U(i.text, B(this.text, 0, t)), e),
      s = this.length + i.length - (e - t);
    return n.length <= 32 ? new N(n, s) : L.from(N.split(n, []), s);
  }
  sliceString(t, e = this.length, i = '\n') {
    let n = '';
    for (let s = 0, r = 0; s <= e && r < this.text.length; r++) {
      let o = this.text[r],
        a = s + o.length;
      s > t && r && (n += i), t < a && e > s && (n += o.slice(Math.max(0, t - s), e - s)), (s = a + 1);
    }
    return n;
  }
  flatten(t) {
    for (let e of this.text) t.push(e);
  }
  scanIdentical() {
    return 0;
  }
  static split(t, e) {
    let i = [],
      n = -1;
    for (let s of t) i.push(s), (n += s.length + 1), 32 == i.length && (e.push(new N(i, n)), (i = []), (n = -1));
    return n > -1 && e.push(new N(i, n)), e;
  }
}
class L extends I {
  constructor(t, e) {
    super(), (this.children = t), (this.length = e), (this.lines = 0);
    for (let e of t) this.lines += e.lines;
  }
  lineInner(t, e, i, n) {
    for (let s = 0; ; s++) {
      let r = this.children[s],
        o = n + r.length,
        a = i + r.lines - 1;
      if ((e ? a : o) >= t) return r.lineInner(t, e, i, n);
      (n = o + 1), (i = a + 1);
    }
  }
  decompose(t, e, i, n) {
    for (let s = 0, r = 0; r <= e && s < this.children.length; s++) {
      let o = this.children[s],
        a = r + o.length;
      if (t <= a && e >= r) {
        let s = n & ((r <= t ? 1 : 0) | (a >= e ? 2 : 0));
        r >= t && a <= e && !s ? i.push(o) : o.decompose(t - r, e - r, i, s);
      }
      r = a + 1;
    }
  }
  replace(t, e, i) {
    if (i.lines < this.lines)
      for (let n = 0, s = 0; n < this.children.length; n++) {
        let r = this.children[n],
          o = s + r.length;
        if (t >= s && e <= o) {
          let a = r.replace(t - s, e - s, i),
            l = this.lines - r.lines + a.lines;
          if (a.lines < l >> 4 && a.lines > l >> 6) {
            let s = this.children.slice();
            return (s[n] = a), new L(s, this.length - (e - t) + i.length);
          }
          return super.replace(s, o, a);
        }
        s = o + 1;
      }
    return super.replace(t, e, i);
  }
  sliceString(t, e = this.length, i = '\n') {
    let n = '';
    for (let s = 0, r = 0; s < this.children.length && r <= e; s++) {
      let o = this.children[s],
        a = r + o.length;
      r > t && s && (n += i), t < a && e > r && (n += o.sliceString(t - r, e - r, i)), (r = a + 1);
    }
    return n;
  }
  flatten(t) {
    for (let e of this.children) e.flatten(t);
  }
  scanIdentical(t, e) {
    if (!(t instanceof L)) return 0;
    let i = 0,
      [n, s, r, o] =
        e > 0
          ? [0, 0, this.children.length, t.children.length]
          : [this.children.length - 1, t.children.length - 1, -1, -1];
    for (; ; n += e, s += e) {
      if (n == r || s == o) return i;
      let a = this.children[n],
        l = t.children[s];
      if (a != l) return i + a.scanIdentical(l, e);
      i += a.length + 1;
    }
  }
  static from(t, e = t.reduce((t, e) => t + e.length + 1, -1)) {
    let i = 0;
    for (let e of t) i += e.lines;
    if (i < 32) {
      let i = [];
      for (let e of t) e.flatten(i);
      return new N(i, e);
    }
    let n = Math.max(32, i >> 5),
      s = n << 1,
      r = n >> 1,
      o = [],
      a = 0,
      l = -1,
      h = [];
    function c(t) {
      let e;
      if (t.lines > s && t instanceof L) for (let e of t.children) c(e);
      else
        t.lines > r && (a > r || !a)
          ? (u(), o.push(t))
          : t instanceof N && a && (e = h[h.length - 1]) instanceof N && t.lines + e.lines <= 32
          ? ((a += t.lines),
            (l += t.length + 1),
            (h[h.length - 1] = new N(e.text.concat(t.text), e.length + 1 + t.length)))
          : (a + t.lines > n && u(), (a += t.lines), (l += t.length + 1), h.push(t));
    }
    function u() {
      0 != a && (o.push(1 == h.length ? h[0] : L.from(h, l)), (l = -1), (a = h.length = 0));
    }
    for (let e of t) c(e);
    return u(), 1 == o.length ? o[0] : new L(o, e);
  }
}
function U(t, e, i = 0, n = 1e9) {
  for (let s = 0, r = 0, o = !0; r < t.length && s <= n; r++) {
    let a = t[r],
      l = s + a.length;
    l >= i &&
      (l > n && (a = a.slice(0, n - s)),
      s < i && (a = a.slice(i - s)),
      o ? ((e[e.length - 1] += a), (o = !1)) : e.push(a)),
      (s = l + 1);
  }
  return e;
}
function B(t, e, i) {
  return U(t, [''], e, i);
}
I.empty = new N([''], 0);
class Y {
  constructor(t, e = 1) {
    (this.dir = e),
      (this.done = !1),
      (this.lineBreak = !1),
      (this.value = ''),
      (this.nodes = [t]),
      (this.offsets = [e > 0 ? 1 : (t instanceof N ? t.text.length : t.children.length) << 1]);
  }
  nextInner(t, e) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1,
        n = this.nodes[i],
        s = this.offsets[i],
        r = s >> 1,
        o = n instanceof N ? n.text.length : n.children.length;
      if (r == (e > 0 ? o : 0)) {
        if (0 == i) return (this.done = !0), (this.value = ''), this;
        e > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((1 & s) == (e > 0 ? 0 : 1)) {
        if (((this.offsets[i] += e), 0 == t)) return (this.lineBreak = !0), (this.value = '\n'), this;
        t--;
      } else if (n instanceof N) {
        let s = n.text[r + (e < 0 ? -1 : 0)];
        if (((this.offsets[i] += e), s.length > Math.max(0, t)))
          return (this.value = 0 == t ? s : e > 0 ? s.slice(t) : s.slice(0, s.length - t)), this;
        t -= s.length;
      } else {
        let s = n.children[r + (e < 0 ? -1 : 0)];
        t > s.length
          ? ((t -= s.length), (this.offsets[i] += e))
          : (e < 0 && this.offsets[i]--,
            this.nodes.push(s),
            this.offsets.push(e > 0 ? 1 : (s instanceof N ? s.text.length : s.children.length) << 1));
      }
    }
  }
  next(t = 0) {
    return t < 0 && (this.nextInner(-t, -this.dir), (t = this.value.length)), this.nextInner(t, this.dir);
  }
}
class F {
  constructor(t, e, i) {
    (this.value = ''),
      (this.done = !1),
      (this.cursor = new Y(t, e > i ? -1 : 1)),
      (this.pos = e > i ? t.length : 0),
      (this.from = Math.min(e, i)),
      (this.to = Math.max(e, i));
  }
  nextInner(t, e) {
    if (e < 0 ? this.pos <= this.from : this.pos >= this.to) return (this.value = ''), (this.done = !0), this;
    t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
    let i = e < 0 ? this.pos - this.from : this.to - this.pos;
    t > i && (t = i), (i -= t);
    let { value: n } = this.cursor.next(t);
    return (
      (this.pos += (n.length + t) * e),
      (this.value = n.length <= i ? n : e < 0 ? n.slice(n.length - i) : n.slice(0, i)),
      (this.done = !this.value),
      this
    );
  }
  next(t = 0) {
    return (
      t < 0 ? (t = Math.max(t, this.from - this.pos)) : t > 0 && (t = Math.min(t, this.to - this.pos)),
      this.nextInner(t, this.cursor.dir)
    );
  }
  get lineBreak() {
    return this.cursor.lineBreak && '' != this.value;
  }
}
class H {
  constructor(t) {
    (this.inner = t), (this.afterBreak = !0), (this.value = ''), (this.done = !1);
  }
  next(t = 0) {
    let { done: e, lineBreak: i, value: n } = this.inner.next(t);
    return (
      e
        ? ((this.done = !0), (this.value = ''))
        : i
        ? this.afterBreak
          ? (this.value = '')
          : ((this.afterBreak = !0), this.next())
        : ((this.value = n), (this.afterBreak = !1)),
      this
    );
  }
  get lineBreak() {
    return !1;
  }
}
'undefined' != typeof Symbol &&
  ((I.prototype[Symbol.iterator] = function () {
    return this.iter();
  }),
  (Y.prototype[Symbol.iterator] =
    F.prototype[Symbol.iterator] =
    H.prototype[Symbol.iterator] =
      function () {
        return this;
      }));
class J {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.number = i), (this.text = n);
  }
  get length() {
    return this.to - this.from;
  }
}
let K =
  'lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o'
    .split(',')
    .map((t) => (t ? parseInt(t, 36) : 1));
for (let t = 1; t < K.length; t++) K[t] += K[t - 1];
function tt(t) {
  for (let e = 1; e < K.length; e += 2) if (K[e] > t) return K[e - 1] <= t;
  return !1;
}
function et(t) {
  return t >= 127462 && t <= 127487;
}
function it(t, e, i = !0, n = !0) {
  return (i ? nt : st)(t, e, n);
}
function nt(t, e, i) {
  if (e == t.length) return e;
  e && rt(t.charCodeAt(e)) && ot(t.charCodeAt(e - 1)) && e--;
  let n = at(t, e);
  for (e += ht(n); e < t.length; ) {
    let s = at(t, e);
    if (8205 == n || 8205 == s || (i && tt(s))) (e += ht(s)), (n = s);
    else {
      if (!et(s)) break;
      {
        let i = 0,
          n = e - 2;
        for (; n >= 0 && et(at(t, n)); ) i++, (n -= 2);
        if (i % 2 == 0) break;
        e += 2;
      }
    }
  }
  return e;
}
function st(t, e, i) {
  for (; e > 0; ) {
    let n = nt(t, e - 2, i);
    if (n < e) return n;
    e--;
  }
  return 0;
}
function rt(t) {
  return t >= 56320 && t < 57344;
}
function ot(t) {
  return t >= 55296 && t < 56320;
}
function at(t, e) {
  let i = t.charCodeAt(e);
  if (!ot(i) || e + 1 == t.length) return i;
  let n = t.charCodeAt(e + 1);
  return rt(n) ? n - 56320 + ((i - 55296) << 10) + 65536 : i;
}
function lt(t) {
  return t <= 65535
    ? String.fromCharCode(t)
    : ((t -= 65536), String.fromCharCode(55296 + (t >> 10), 56320 + (1023 & t)));
}
function ht(t) {
  return t < 65536 ? 1 : 2;
}
const ct = /\r\n?|\n/;
var ut = (function (t) {
  return (
    (t[(t.Simple = 0)] = 'Simple'),
    (t[(t.TrackDel = 1)] = 'TrackDel'),
    (t[(t.TrackBefore = 2)] = 'TrackBefore'),
    (t[(t.TrackAfter = 3)] = 'TrackAfter'),
    t
  );
})(ut || (ut = {}));
class Ot {
  constructor(t) {
    this.sections = t;
  }
  get length() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) t += this.sections[e];
    return t;
  }
  get newLength() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e + 1];
      t += i < 0 ? this.sections[e] : i;
    }
    return t;
  }
  get empty() {
    return 0 == this.sections.length || (2 == this.sections.length && this.sections[1] < 0);
  }
  iterGaps(t) {
    for (let e = 0, i = 0, n = 0; e < this.sections.length; ) {
      let s = this.sections[e++],
        r = this.sections[e++];
      r < 0 ? (t(i, n, s), (n += s)) : (n += r), (i += s);
    }
  }
  iterChangedRanges(t, e = !1) {
    gt(this, t, e);
  }
  get invertedDesc() {
    let t = [];
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++],
        n = this.sections[e++];
      n < 0 ? t.push(i, n) : t.push(n, i);
    }
    return new Ot(t);
  }
  composeDesc(t) {
    return this.empty ? t : t.empty ? this : Qt(this, t);
  }
  mapDesc(t, e = !1) {
    return t.empty ? this : mt(this, t, e);
  }
  mapPos(t, e = -1, i = ut.Simple) {
    let n = 0,
      s = 0;
    for (let r = 0; r < this.sections.length; ) {
      let o = this.sections[r++],
        a = this.sections[r++],
        l = n + o;
      if (a < 0) {
        if (l > t) return s + (t - n);
        s += o;
      } else {
        if (
          i != ut.Simple &&
          l >= t &&
          ((i == ut.TrackDel && n < t && l > t) || (i == ut.TrackBefore && n < t) || (i == ut.TrackAfter && l > t))
        )
          return null;
        if (l > t || (l == t && e < 0 && !o)) return t == n || e < 0 ? s : s + a;
        s += a;
      }
      n = l;
    }
    if (t > n) throw new RangeError(`Position ${t} is out of range for changeset of length ${n}`);
    return s;
  }
  touchesRange(t, e = t) {
    for (let i = 0, n = 0; i < this.sections.length && n <= e; ) {
      let s = n + this.sections[i++];
      if (this.sections[i++] >= 0 && n <= e && s >= t) return !(n < t && s > e) || 'cover';
      n = s;
    }
    return !1;
  }
  toString() {
    let t = '';
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++],
        n = this.sections[e++];
      t += (t ? ' ' : '') + i + (n >= 0 ? ':' + n : '');
    }
    return t;
  }
  toJSON() {
    return this.sections;
  }
  static fromJSON(t) {
    if (!Array.isArray(t) || t.length % 2 || t.some((t) => 'number' != typeof t))
      throw new RangeError('Invalid JSON representation of ChangeDesc');
    return new Ot(t);
  }
  static create(t) {
    return new Ot(t);
  }
}
class ft extends Ot {
  constructor(t, e) {
    super(t), (this.inserted = e);
  }
  apply(t) {
    if (this.length != t.length) throw new RangeError('Applying change set to a document with the wrong length');
    return gt(this, (e, i, n, s, r) => (t = t.replace(n, n + (i - e), r)), !1), t;
  }
  mapDesc(t, e = !1) {
    return mt(this, t, e, !0);
  }
  invert(t) {
    let e = this.sections.slice(),
      i = [];
    for (let n = 0, s = 0; n < e.length; n += 2) {
      let r = e[n],
        o = e[n + 1];
      if (o >= 0) {
        (e[n] = o), (e[n + 1] = r);
        let a = n >> 1;
        for (; i.length < a; ) i.push(I.empty);
        i.push(r ? t.slice(s, s + r) : I.empty);
      }
      s += r;
    }
    return new ft(e, i);
  }
  compose(t) {
    return this.empty ? t : t.empty ? this : Qt(this, t, !0);
  }
  map(t, e = !1) {
    return t.empty ? this : mt(this, t, e, !0);
  }
  iterChanges(t, e = !1) {
    gt(this, t, e);
  }
  get desc() {
    return Ot.create(this.sections);
  }
  filter(t) {
    let e = [],
      i = [],
      n = [],
      s = new bt(this);
    t: for (let r = 0, o = 0; ; ) {
      let a = r == t.length ? 1e9 : t[r++];
      for (; o < a || (o == a && 0 == s.len); ) {
        if (s.done) break t;
        let t = Math.min(s.len, a - o);
        dt(n, t, -1);
        let r = -1 == s.ins ? -1 : 0 == s.off ? s.ins : 0;
        dt(e, t, r), r > 0 && pt(i, e, s.text), s.forward(t), (o += t);
      }
      let l = t[r++];
      for (; o < l; ) {
        if (s.done) break t;
        let t = Math.min(s.len, l - o);
        dt(e, t, -1), dt(n, t, -1 == s.ins ? -1 : 0 == s.off ? s.ins : 0), s.forward(t), (o += t);
      }
    }
    return { changes: new ft(e, i), filtered: Ot.create(n) };
  }
  toJSON() {
    let t = [];
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e],
        n = this.sections[e + 1];
      n < 0 ? t.push(i) : 0 == n ? t.push([i]) : t.push([i].concat(this.inserted[e >> 1].toJSON()));
    }
    return t;
  }
  static of(t, e, i) {
    let n = [],
      s = [],
      r = 0,
      o = null;
    function a(t = !1) {
      if (!t && !n.length) return;
      r < e && dt(n, e - r, -1);
      let i = new ft(n, s);
      (o = o ? o.compose(i.map(o)) : i), (n = []), (s = []), (r = 0);
    }
    return (
      (function t(l) {
        if (Array.isArray(l)) for (let e of l) t(e);
        else if (l instanceof ft) {
          if (l.length != e) throw new RangeError(`Mismatched change set length (got ${l.length}, expected ${e})`);
          a(), (o = o ? o.compose(l.map(o)) : l);
        } else {
          let { from: t, to: o = t, insert: h } = l;
          if (t > o || t < 0 || o > e)
            throw new RangeError(`Invalid change range ${t} to ${o} (in doc of length ${e})`);
          let c = h ? ('string' == typeof h ? I.of(h.split(i || ct)) : h) : I.empty,
            u = c.length;
          if (t == o && 0 == u) return;
          t < r && a(), t > r && dt(n, t - r, -1), dt(n, o - t, u), pt(s, n, c), (r = o);
        }
      })(t),
      a(!o),
      o
    );
  }
  static empty(t) {
    return new ft(t ? [t, -1] : [], []);
  }
  static fromJSON(t) {
    if (!Array.isArray(t)) throw new RangeError('Invalid JSON representation of ChangeSet');
    let e = [],
      i = [];
    for (let n = 0; n < t.length; n++) {
      let s = t[n];
      if ('number' == typeof s) e.push(s, -1);
      else {
        if (!Array.isArray(s) || 'number' != typeof s[0] || s.some((t, e) => e && 'string' != typeof t))
          throw new RangeError('Invalid JSON representation of ChangeSet');
        if (1 == s.length) e.push(s[0], 0);
        else {
          for (; i.length < n; ) i.push(I.empty);
          (i[n] = I.of(s.slice(1))), e.push(s[0], i[n].length);
        }
      }
    }
    return new ft(e, i);
  }
  static createSet(t, e) {
    return new ft(t, e);
  }
}
function dt(t, e, i, n = !1) {
  if (0 == e && i <= 0) return;
  let s = t.length - 2;
  s >= 0 && i <= 0 && i == t[s + 1]
    ? (t[s] += e)
    : 0 == e && 0 == t[s]
    ? (t[s + 1] += i)
    : n
    ? ((t[s] += e), (t[s + 1] += i))
    : t.push(e, i);
}
function pt(t, e, i) {
  if (0 == i.length) return;
  let n = (e.length - 2) >> 1;
  if (n < t.length) t[t.length - 1] = t[t.length - 1].append(i);
  else {
    for (; t.length < n; ) t.push(I.empty);
    t.push(i);
  }
}
function gt(t, e, i) {
  let n = t.inserted;
  for (let s = 0, r = 0, o = 0; o < t.sections.length; ) {
    let a = t.sections[o++],
      l = t.sections[o++];
    if (l < 0) (s += a), (r += a);
    else {
      let h = s,
        c = r,
        u = I.empty;
      for (
        ;
        (h += a),
          (c += l),
          l && n && (u = u.append(n[(o - 2) >> 1])),
          !(i || o == t.sections.length || t.sections[o + 1] < 0);

      )
        (a = t.sections[o++]), (l = t.sections[o++]);
      e(s, h, r, c, u), (s = h), (r = c);
    }
  }
}
function mt(t, e, i, n = !1) {
  let s = [],
    r = n ? [] : null,
    o = new bt(t),
    a = new bt(e);
  for (let t = -1; ; )
    if (-1 == o.ins && -1 == a.ins) {
      let t = Math.min(o.len, a.len);
      dt(s, t, -1), o.forward(t), a.forward(t);
    } else if (a.ins >= 0 && (o.ins < 0 || t == o.i || (0 == o.off && (a.len < o.len || (a.len == o.len && !i))))) {
      let e = a.len;
      for (dt(s, a.ins, -1); e; ) {
        let i = Math.min(o.len, e);
        o.ins >= 0 && t < o.i && o.len <= i && (dt(s, 0, o.ins), r && pt(r, s, o.text), (t = o.i)),
          o.forward(i),
          (e -= i);
      }
      a.next();
    } else {
      if (!(o.ins >= 0)) {
        if (o.done && a.done) return r ? ft.createSet(s, r) : Ot.create(s);
        throw new Error('Mismatched change set lengths');
      }
      {
        let e = 0,
          i = o.len;
        for (; i; )
          if (-1 == a.ins) {
            let t = Math.min(i, a.len);
            (e += t), (i -= t), a.forward(t);
          } else {
            if (!(0 == a.ins && a.len < i)) break;
            (i -= a.len), a.next();
          }
        dt(s, e, t < o.i ? o.ins : 0), r && t < o.i && pt(r, s, o.text), (t = o.i), o.forward(o.len - i);
      }
    }
}
function Qt(t, e, i = !1) {
  let n = [],
    s = i ? [] : null,
    r = new bt(t),
    o = new bt(e);
  for (let t = !1; ; ) {
    if (r.done && o.done) return s ? ft.createSet(n, s) : Ot.create(n);
    if (0 == r.ins) dt(n, r.len, 0, t), r.next();
    else if (0 != o.len || o.done) {
      if (r.done || o.done) throw new Error('Mismatched change set lengths');
      {
        let e = Math.min(r.len2, o.len),
          i = n.length;
        if (-1 == r.ins) {
          let i = -1 == o.ins ? -1 : o.off ? 0 : o.ins;
          dt(n, e, i, t), s && i && pt(s, n, o.text);
        } else
          -1 == o.ins
            ? (dt(n, r.off ? 0 : r.len, e, t), s && pt(s, n, r.textBit(e)))
            : (dt(n, r.off ? 0 : r.len, o.off ? 0 : o.ins, t), s && !o.off && pt(s, n, o.text));
        (t = (r.ins > e || (o.ins >= 0 && o.len > e)) && (t || n.length > i)), r.forward2(e), o.forward(e);
      }
    } else dt(n, 0, o.ins, t), s && pt(s, n, o.text), o.next();
  }
}
class bt {
  constructor(t) {
    (this.set = t), (this.i = 0), this.next();
  }
  next() {
    let { sections: t } = this.set;
    this.i < t.length ? ((this.len = t[this.i++]), (this.ins = t[this.i++])) : ((this.len = 0), (this.ins = -2)),
      (this.off = 0);
  }
  get done() {
    return -2 == this.ins;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: t } = this.set,
      e = (this.i - 2) >> 1;
    return e >= t.length ? I.empty : t[e];
  }
  textBit(t) {
    let { inserted: e } = this.set,
      i = (this.i - 2) >> 1;
    return i >= e.length && !t ? I.empty : e[i].slice(this.off, null == t ? void 0 : this.off + t);
  }
  forward(t) {
    t == this.len ? this.next() : ((this.len -= t), (this.off += t));
  }
  forward2(t) {
    -1 == this.ins ? this.forward(t) : t == this.ins ? this.next() : ((this.ins -= t), (this.off += t));
  }
}
class yt {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.flags = i);
  }
  get anchor() {
    return 16 & this.flags ? this.to : this.from;
  }
  get head() {
    return 16 & this.flags ? this.from : this.to;
  }
  get empty() {
    return this.from == this.to;
  }
  get assoc() {
    return 4 & this.flags ? -1 : 8 & this.flags ? 1 : 0;
  }
  get bidiLevel() {
    let t = 3 & this.flags;
    return 3 == t ? null : t;
  }
  get goalColumn() {
    let t = this.flags >> 5;
    return 33554431 == t ? void 0 : t;
  }
  map(t, e = -1) {
    let i, n;
    return (
      this.empty ? (i = n = t.mapPos(this.from, e)) : ((i = t.mapPos(this.from, 1)), (n = t.mapPos(this.to, -1))),
      i == this.from && n == this.to ? this : new yt(i, n, this.flags)
    );
  }
  extend(t, e = t) {
    if (t <= this.anchor && e >= this.anchor) return wt.range(t, e);
    let i = Math.abs(t - this.anchor) > Math.abs(e - this.anchor) ? t : e;
    return wt.range(this.anchor, i);
  }
  eq(t) {
    return this.anchor == t.anchor && this.head == t.head;
  }
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  static fromJSON(t) {
    if (!t || 'number' != typeof t.anchor || 'number' != typeof t.head)
      throw new RangeError('Invalid JSON representation for SelectionRange');
    return wt.range(t.anchor, t.head);
  }
  static create(t, e, i) {
    return new yt(t, e, i);
  }
}
class wt {
  constructor(t, e) {
    (this.ranges = t), (this.mainIndex = e);
  }
  map(t, e = -1) {
    return t.empty
      ? this
      : wt.create(
          this.ranges.map((i) => i.map(t, e)),
          this.mainIndex,
        );
  }
  eq(t) {
    if (this.ranges.length != t.ranges.length || this.mainIndex != t.mainIndex) return !1;
    for (let e = 0; e < this.ranges.length; e++) if (!this.ranges[e].eq(t.ranges[e])) return !1;
    return !0;
  }
  get main() {
    return this.ranges[this.mainIndex];
  }
  asSingle() {
    return 1 == this.ranges.length ? this : new wt([this.main], 0);
  }
  addRange(t, e = !0) {
    return wt.create([t].concat(this.ranges), e ? 0 : this.mainIndex + 1);
  }
  replaceRange(t, e = this.mainIndex) {
    let i = this.ranges.slice();
    return (i[e] = t), wt.create(i, this.mainIndex);
  }
  toJSON() {
    return { ranges: this.ranges.map((t) => t.toJSON()), main: this.mainIndex };
  }
  static fromJSON(t) {
    if (!t || !Array.isArray(t.ranges) || 'number' != typeof t.main || t.main >= t.ranges.length)
      throw new RangeError('Invalid JSON representation for EditorSelection');
    return new wt(
      t.ranges.map((t) => yt.fromJSON(t)),
      t.main,
    );
  }
  static single(t, e = t) {
    return new wt([wt.range(t, e)], 0);
  }
  static create(t, e = 0) {
    if (0 == t.length) throw new RangeError('A selection needs at least one range');
    for (let i = 0, n = 0; n < t.length; n++) {
      let s = t[n];
      if (s.empty ? s.from <= i : s.from < i) return wt.normalized(t.slice(), e);
      i = s.to;
    }
    return new wt(t, e);
  }
  static cursor(t, e = 0, i, n) {
    return yt.create(
      t,
      t,
      (0 == e ? 0 : e < 0 ? 4 : 8) | (null == i ? 3 : Math.min(2, i)) | ((null != n ? n : 33554431) << 5),
    );
  }
  static range(t, e, i) {
    let n = (null != i ? i : 33554431) << 5;
    return e < t ? yt.create(e, t, 24 | n) : yt.create(t, e, n | (e > t ? 4 : 0));
  }
  static normalized(t, e = 0) {
    let i = t[e];
    t.sort((t, e) => t.from - e.from), (e = t.indexOf(i));
    for (let i = 1; i < t.length; i++) {
      let n = t[i],
        s = t[i - 1];
      if (n.empty ? n.from <= s.to : n.from < s.to) {
        let r = s.from,
          o = Math.max(n.to, s.to);
        i <= e && e--, t.splice(--i, 2, n.anchor > n.head ? wt.range(o, r) : wt.range(r, o));
      }
    }
    return new wt(t, e);
  }
}
function xt(t, e) {
  for (let i of t.ranges) if (i.to > e) throw new RangeError('Selection points outside of document');
}
let vt = 0;
class St {
  constructor(t, e, i, n, s) {
    (this.combine = t),
      (this.compareInput = e),
      (this.compare = i),
      (this.isStatic = n),
      (this.id = vt++),
      (this.default = t([])),
      (this.extensions = 'function' == typeof s ? s(this) : s);
  }
  static define(t = {}) {
    return new St(
      t.combine || ((t) => t),
      t.compareInput || ((t, e) => t === e),
      t.compare || (t.combine ? (t, e) => t === e : kt),
      !!t.static,
      t.enables,
    );
  }
  of(t) {
    return new $t([], this, 0, t);
  }
  compute(t, e) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new $t(t, this, 1, e);
  }
  computeN(t, e) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new $t(t, this, 2, e);
  }
  from(t, e) {
    return e || (e = (t) => t), this.compute([t], (i) => e(i.field(t)));
  }
}
function kt(t, e) {
  return t == e || (t.length == e.length && t.every((t, i) => t === e[i]));
}
class $t {
  constructor(t, e, i, n) {
    (this.dependencies = t), (this.facet = e), (this.type = i), (this.value = n), (this.id = vt++);
  }
  dynamicSlot(t) {
    var e;
    let i = this.value,
      n = this.facet.compareInput,
      s = this.id,
      r = t[s] >> 1,
      o = 2 == this.type,
      a = !1,
      l = !1,
      h = [];
    for (let i of this.dependencies)
      'doc' == i
        ? (a = !0)
        : 'selection' == i
        ? (l = !0)
        : 0 == (1 & (null !== (e = t[i.id]) && void 0 !== e ? e : 1)) && h.push(t[i.id]);
    return {
      create: (t) => ((t.values[r] = i(t)), 1),
      update(t, e) {
        if ((a && e.docChanged) || (l && (e.docChanged || e.selection)) || Pt(t, h)) {
          let e = i(t);
          if (o ? !Tt(e, t.values[r], n) : !n(e, t.values[r])) return (t.values[r] = e), 1;
        }
        return 0;
      },
      reconfigure: (t, e) => {
        let a = i(t),
          l = e.config.address[s];
        if (null != l) {
          let i = Vt(e, l);
          if (
            this.dependencies.every((i) =>
              i instanceof St ? e.facet(i) === t.facet(i) : !(i instanceof Wt) || e.field(i, !1) == t.field(i, !1),
            ) ||
            (o ? Tt(a, i, n) : n(a, i))
          )
            return (t.values[r] = i), 0;
        }
        return (t.values[r] = a), 1;
      },
    };
  }
}
function Tt(t, e, i) {
  if (t.length != e.length) return !1;
  for (let n = 0; n < t.length; n++) if (!i(t[n], e[n])) return !1;
  return !0;
}
function Pt(t, e) {
  let i = !1;
  for (let n of e) 1 & Gt(t, n) && (i = !0);
  return i;
}
function Rt(t, e, i) {
  let n = i.map((e) => t[e.id]),
    s = i.map((t) => t.type),
    r = n.filter((t) => !(1 & t)),
    o = t[e.id] >> 1;
  function a(t) {
    let i = [];
    for (let e = 0; e < n.length; e++) {
      let r = Vt(t, n[e]);
      if (2 == s[e]) for (let t of r) i.push(t);
      else i.push(r);
    }
    return e.combine(i);
  }
  return {
    create(t) {
      for (let e of n) Gt(t, e);
      return (t.values[o] = a(t)), 1;
    },
    update(t, i) {
      if (!Pt(t, r)) return 0;
      let n = a(t);
      return e.compare(n, t.values[o]) ? 0 : ((t.values[o] = n), 1);
    },
    reconfigure(t, s) {
      let r = Pt(t, n),
        l = s.config.facets[e.id],
        h = s.facet(e);
      if (l && !r && kt(i, l)) return (t.values[o] = h), 0;
      let c = a(t);
      return e.compare(c, h) ? ((t.values[o] = h), 0) : ((t.values[o] = c), 1);
    },
  };
}
const Ct = St.define({ static: !0 });
class Wt {
  constructor(t, e, i, n, s) {
    (this.id = t),
      (this.createF = e),
      (this.updateF = i),
      (this.compareF = n),
      (this.spec = s),
      (this.provides = void 0);
  }
  static define(t) {
    let e = new Wt(vt++, t.create, t.update, t.compare || ((t, e) => t === e), t);
    return t.provide && (e.provides = t.provide(e)), e;
  }
  create(t) {
    let e = t.facet(Ct).find((t) => t.field == this);
    return ((null == e ? void 0 : e.create) || this.createF)(t);
  }
  slot(t) {
    let e = t[this.id] >> 1;
    return {
      create: (t) => ((t.values[e] = this.create(t)), 1),
      update: (t, i) => {
        let n = t.values[e],
          s = this.updateF(n, i);
        return this.compareF(n, s) ? 0 : ((t.values[e] = s), 1);
      },
      reconfigure: (t, i) =>
        null != i.config.address[this.id] ? ((t.values[e] = i.field(this)), 0) : ((t.values[e] = this.create(t)), 1),
    };
  }
  init(t) {
    return [this, Ct.of({ field: this, create: t })];
  }
  get extension() {
    return this;
  }
}
const Xt = 4,
  At = 3,
  Zt = 2,
  jt = 1;
function Dt(t) {
  return (e) => new Mt(e, t);
}
const zt = { highest: Dt(0), high: Dt(jt), default: Dt(Zt), low: Dt(At), lowest: Dt(Xt) };
class Mt {
  constructor(t, e) {
    (this.inner = t), (this.prec = e);
  }
}
class _t {
  of(t) {
    return new qt(this, t);
  }
  reconfigure(t) {
    return _t.reconfigure.of({ compartment: this, extension: t });
  }
  get(t) {
    return t.config.compartments.get(this);
  }
}
class qt {
  constructor(t, e) {
    (this.compartment = t), (this.inner = e);
  }
}
class Et {
  constructor(t, e, i, n, s, r) {
    for (
      this.base = t,
        this.compartments = e,
        this.dynamicSlots = i,
        this.address = n,
        this.staticValues = s,
        this.facets = r,
        this.statusTemplate = [];
      this.statusTemplate.length < i.length;

    )
      this.statusTemplate.push(0);
  }
  staticFacet(t) {
    let e = this.address[t.id];
    return null == e ? t.default : this.staticValues[e >> 1];
  }
  static resolve(t, e, i) {
    let n = [],
      s = Object.create(null),
      r = new Map();
    for (let i of (function (t, e, i) {
      let n = [[], [], [], [], []],
        s = new Map();
      function r(t, o) {
        let a = s.get(t);
        if (null != a) {
          if (a <= o) return;
          let e = n[a].indexOf(t);
          e > -1 && n[a].splice(e, 1), t instanceof qt && i.delete(t.compartment);
        }
        if ((s.set(t, o), Array.isArray(t))) for (let e of t) r(e, o);
        else if (t instanceof qt) {
          if (i.has(t.compartment)) throw new RangeError('Duplicate use of compartment in extensions');
          let n = e.get(t.compartment) || t.inner;
          i.set(t.compartment, n), r(n, o);
        } else if (t instanceof Mt) r(t.inner, t.prec);
        else if (t instanceof Wt) n[o].push(t), t.provides && r(t.provides, o);
        else if (t instanceof $t) n[o].push(t), t.facet.extensions && r(t.facet.extensions, Zt);
        else {
          let e = t.extension;
          if (!e)
            throw new Error(
              `Unrecognized extension value in extension set (${t}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`,
            );
          r(e, o);
        }
      }
      return r(t, Zt), n.reduce((t, e) => t.concat(e));
    })(t, e, r))
      i instanceof Wt ? n.push(i) : (s[i.facet.id] || (s[i.facet.id] = [])).push(i);
    let o = Object.create(null),
      a = [],
      l = [];
    for (let t of n) (o[t.id] = l.length << 1), l.push((e) => t.slot(e));
    let h = null == i ? void 0 : i.config.facets;
    for (let t in s) {
      let e = s[t],
        n = e[0].facet,
        r = (h && h[t]) || [];
      if (e.every((t) => 0 == t.type))
        if (((o[n.id] = (a.length << 1) | 1), kt(r, e))) a.push(i.facet(n));
        else {
          let t = n.combine(e.map((t) => t.value));
          a.push(i && n.compare(t, i.facet(n)) ? i.facet(n) : t);
        }
      else {
        for (let t of e)
          0 == t.type
            ? ((o[t.id] = (a.length << 1) | 1), a.push(t.value))
            : ((o[t.id] = l.length << 1), l.push((e) => t.dynamicSlot(e)));
        (o[n.id] = l.length << 1), l.push((t) => Rt(t, n, e));
      }
    }
    let c = l.map((t) => t(o));
    return new Et(t, r, c, o, a, s);
  }
}
function Gt(t, e) {
  if (1 & e) return 2;
  let i = e >> 1,
    n = t.status[i];
  if (4 == n) throw new Error('Cyclic dependency between fields and/or facets');
  if (2 & n) return n;
  t.status[i] = 4;
  let s = t.computeSlot(t, t.config.dynamicSlots[i]);
  return (t.status[i] = 2 | s);
}
function Vt(t, e) {
  return 1 & e ? t.config.staticValues[e >> 1] : t.values[e >> 1];
}
const It = St.define(),
  Nt = St.define({ combine: (t) => t.some((t) => t), static: !0 }),
  Lt = St.define({ combine: (t) => (t.length ? t[0] : void 0), static: !0 }),
  Ut = St.define(),
  Bt = St.define(),
  Yt = St.define(),
  Ft = St.define({ combine: (t) => !!t.length && t[0] });
class Ht {
  constructor(t, e) {
    (this.type = t), (this.value = e);
  }
  static define() {
    return new Jt();
  }
}
class Jt {
  of(t) {
    return new Ht(this, t);
  }
}
class Kt {
  constructor(t) {
    this.map = t;
  }
  of(t) {
    return new te(this, t);
  }
}
class te {
  constructor(t, e) {
    (this.type = t), (this.value = e);
  }
  map(t) {
    let e = this.type.map(this.value, t);
    return void 0 === e ? void 0 : e == this.value ? this : new te(this.type, e);
  }
  is(t) {
    return this.type == t;
  }
  static define(t = {}) {
    return new Kt(t.map || ((t) => t));
  }
  static mapEffects(t, e) {
    if (!t.length) return t;
    let i = [];
    for (let n of t) {
      let t = n.map(e);
      t && i.push(t);
    }
    return i;
  }
}
(te.reconfigure = te.define()), (te.appendConfig = te.define());
class ee {
  constructor(t, e, i, n, s, r) {
    (this.startState = t),
      (this.changes = e),
      (this.selection = i),
      (this.effects = n),
      (this.annotations = s),
      (this.scrollIntoView = r),
      (this._doc = null),
      (this._state = null),
      i && xt(i, e.newLength),
      s.some((t) => t.type == ee.time) || (this.annotations = s.concat(ee.time.of(Date.now())));
  }
  static create(t, e, i, n, s, r) {
    return new ee(t, e, i, n, s, r);
  }
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  annotation(t) {
    for (let e of this.annotations) if (e.type == t) return e.value;
  }
  get docChanged() {
    return !this.changes.empty;
  }
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  isUserEvent(t) {
    let e = this.annotation(ee.userEvent);
    return !(!e || !(e == t || (e.length > t.length && e.slice(0, t.length) == t && '.' == e[t.length])));
  }
}
function ie(t, e) {
  let i = [];
  for (let n = 0, s = 0; ; ) {
    let r, o;
    if (n < t.length && (s == e.length || e[s] >= t[n])) (r = t[n++]), (o = t[n++]);
    else {
      if (!(s < e.length)) return i;
      (r = e[s++]), (o = e[s++]);
    }
    !i.length || i[i.length - 1] < r ? i.push(r, o) : i[i.length - 1] < o && (i[i.length - 1] = o);
  }
}
function ne(t, e, i) {
  var n;
  let s, r, o;
  return (
    i
      ? ((s = e.changes), (r = ft.empty(e.changes.length)), (o = t.changes.compose(e.changes)))
      : ((s = e.changes.map(t.changes)), (r = t.changes.mapDesc(e.changes, !0)), (o = t.changes.compose(s))),
    {
      changes: o,
      selection: e.selection ? e.selection.map(r) : null === (n = t.selection) || void 0 === n ? void 0 : n.map(s),
      effects: te.mapEffects(t.effects, s).concat(te.mapEffects(e.effects, r)),
      annotations: t.annotations.length ? t.annotations.concat(e.annotations) : e.annotations,
      scrollIntoView: t.scrollIntoView || e.scrollIntoView,
    }
  );
}
function se(t, e, i) {
  let n = e.selection,
    s = ae(e.annotations);
  return (
    e.userEvent && (s = s.concat(ee.userEvent.of(e.userEvent))),
    {
      changes: e.changes instanceof ft ? e.changes : ft.of(e.changes || [], i, t.facet(Lt)),
      selection: n && (n instanceof wt ? n : wt.single(n.anchor, n.head)),
      effects: ae(e.effects),
      annotations: s,
      scrollIntoView: !!e.scrollIntoView,
    }
  );
}
function re(t, e, i) {
  let n = se(t, e.length ? e[0] : {}, t.doc.length);
  e.length && !1 === e[0].filter && (i = !1);
  for (let s = 1; s < e.length; s++) {
    !1 === e[s].filter && (i = !1);
    let r = !!e[s].sequential;
    n = ne(n, se(t, e[s], r ? n.changes.newLength : t.doc.length), r);
  }
  let s = ee.create(t, n.changes, n.selection, n.effects, n.annotations, n.scrollIntoView);
  return (function (t) {
    let e = t.startState,
      i = e.facet(Yt),
      n = t;
    for (let s = i.length - 1; s >= 0; s--) {
      let r = i[s](t);
      r && Object.keys(r).length && (n = ne(t, se(e, r, t.changes.newLength), !0));
    }
    return n == t ? t : ee.create(e, t.changes, t.selection, n.effects, n.annotations, n.scrollIntoView);
  })(
    i
      ? (function (t) {
          let e = t.startState,
            i = !0;
          for (let n of e.facet(Ut)) {
            let e = n(t);
            if (!1 === e) {
              i = !1;
              break;
            }
            Array.isArray(e) && (i = !0 === i ? e : ie(i, e));
          }
          if (!0 !== i) {
            let n, s;
            if (!1 === i) (s = t.changes.invertedDesc), (n = ft.empty(e.doc.length));
            else {
              let e = t.changes.filter(i);
              (n = e.changes), (s = e.filtered.mapDesc(e.changes).invertedDesc);
            }
            t = ee.create(
              e,
              n,
              t.selection && t.selection.map(s),
              te.mapEffects(t.effects, s),
              t.annotations,
              t.scrollIntoView,
            );
          }
          let n = e.facet(Bt);
          for (let i = n.length - 1; i >= 0; i--) {
            let s = n[i](t);
            t = s instanceof ee ? s : Array.isArray(s) && 1 == s.length && s[0] instanceof ee ? s[0] : re(e, ae(s), !1);
          }
          return t;
        })(s)
      : s,
  );
}
(ee.time = Ht.define()), (ee.userEvent = Ht.define()), (ee.addToHistory = Ht.define()), (ee.remote = Ht.define());
const oe = [];
function ae(t) {
  return null == t ? oe : Array.isArray(t) ? t : [t];
}
var le = (function (t) {
  return (t[(t.Word = 0)] = 'Word'), (t[(t.Space = 1)] = 'Space'), (t[(t.Other = 2)] = 'Other'), t;
})(le || (le = {}));
const he = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let ce;
try {
  ce = new RegExp('[\\p{Alphabetic}\\p{Number}_]', 'u');
} catch (t) {}
function ue(t) {
  return (e) => {
    if (!/\S/.test(e)) return le.Space;
    if (
      (function (t) {
        if (ce) return ce.test(t);
        for (let e = 0; e < t.length; e++) {
          let i = t[e];
          if (/\w/.test(i) || (i > '' && (i.toUpperCase() != i.toLowerCase() || he.test(i)))) return !0;
        }
        return !1;
      })(e)
    )
      return le.Word;
    for (let i = 0; i < t.length; i++) if (e.indexOf(t[i]) > -1) return le.Word;
    return le.Other;
  };
}
class Oe {
  constructor(t, e, i, n, s, r) {
    (this.config = t),
      (this.doc = e),
      (this.selection = i),
      (this.values = n),
      (this.status = t.statusTemplate.slice()),
      (this.computeSlot = s),
      r && (r._state = this);
    for (let t = 0; t < this.config.dynamicSlots.length; t++) Gt(this, t << 1);
    this.computeSlot = null;
  }
  field(t, e = !0) {
    let i = this.config.address[t.id];
    if (null != i) return Gt(this, i), Vt(this, i);
    if (e) throw new RangeError('Field is not present in this state');
  }
  update(...t) {
    return re(this, t, !0);
  }
  applyTransaction(t) {
    let e,
      i = this.config,
      { base: n, compartments: s } = i;
    for (let e of t.effects)
      e.is(_t.reconfigure)
        ? (i && ((s = new Map()), i.compartments.forEach((t, e) => s.set(e, t)), (i = null)),
          s.set(e.value.compartment, e.value.extension))
        : e.is(te.reconfigure)
        ? ((i = null), (n = e.value))
        : e.is(te.appendConfig) && ((i = null), (n = ae(n).concat(e.value)));
    if (i) e = t.startState.values.slice();
    else {
      (i = Et.resolve(n, s, this)),
        (e = new Oe(
          i,
          this.doc,
          this.selection,
          i.dynamicSlots.map(() => null),
          (t, e) => e.reconfigure(t, this),
          null,
        ).values);
    }
    new Oe(i, t.newDoc, t.newSelection, e, (e, i) => i.update(e, t), t);
  }
  replaceSelection(t) {
    return (
      'string' == typeof t && (t = this.toText(t)),
      this.changeByRange((e) => ({
        changes: { from: e.from, to: e.to, insert: t },
        range: wt.cursor(e.from + t.length),
      }))
    );
  }
  changeByRange(t) {
    let e = this.selection,
      i = t(e.ranges[0]),
      n = this.changes(i.changes),
      s = [i.range],
      r = ae(i.effects);
    for (let i = 1; i < e.ranges.length; i++) {
      let o = t(e.ranges[i]),
        a = this.changes(o.changes),
        l = a.map(n);
      for (let t = 0; t < i; t++) s[t] = s[t].map(l);
      let h = n.mapDesc(a, !0);
      s.push(o.range.map(h)), (n = n.compose(l)), (r = te.mapEffects(r, l).concat(te.mapEffects(ae(o.effects), h)));
    }
    return { changes: n, selection: wt.create(s, e.mainIndex), effects: r };
  }
  changes(t = []) {
    return t instanceof ft ? t : ft.of(t, this.doc.length, this.facet(Oe.lineSeparator));
  }
  toText(t) {
    return I.of(t.split(this.facet(Oe.lineSeparator) || ct));
  }
  sliceDoc(t = 0, e = this.doc.length) {
    return this.doc.sliceString(t, e, this.lineBreak);
  }
  facet(t) {
    let e = this.config.address[t.id];
    return null == e ? t.default : (Gt(this, e), Vt(this, e));
  }
  toJSON(t) {
    let e = { doc: this.sliceDoc(), selection: this.selection.toJSON() };
    if (t)
      for (let i in t) {
        let n = t[i];
        n instanceof Wt && null != this.config.address[n.id] && (e[i] = n.spec.toJSON(this.field(t[i]), this));
      }
    return e;
  }
  static fromJSON(t, e = {}, i) {
    if (!t || 'string' != typeof t.doc) throw new RangeError('Invalid JSON representation for EditorState');
    let n = [];
    if (i)
      for (let e in i)
        if (Object.prototype.hasOwnProperty.call(t, e)) {
          let s = i[e],
            r = t[e];
          n.push(s.init((t) => s.spec.fromJSON(r, t)));
        }
    return Oe.create({
      doc: t.doc,
      selection: wt.fromJSON(t.selection),
      extensions: e.extensions ? n.concat([e.extensions]) : n,
    });
  }
  static create(t = {}) {
    let e = Et.resolve(t.extensions || [], new Map()),
      i = t.doc instanceof I ? t.doc : I.of((t.doc || '').split(e.staticFacet(Oe.lineSeparator) || ct)),
      n = t.selection
        ? t.selection instanceof wt
          ? t.selection
          : wt.single(t.selection.anchor, t.selection.head)
        : wt.single(0);
    return (
      xt(n, i.length),
      e.staticFacet(Nt) || (n = n.asSingle()),
      new Oe(
        e,
        i,
        n,
        e.dynamicSlots.map(() => null),
        (t, e) => e.create(t),
        null,
      )
    );
  }
  get tabSize() {
    return this.facet(Oe.tabSize);
  }
  get lineBreak() {
    return this.facet(Oe.lineSeparator) || '\n';
  }
  get readOnly() {
    return this.facet(Ft);
  }
  phrase(t, ...e) {
    for (let e of this.facet(Oe.phrases))
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        t = e[t];
        break;
      }
    return (
      e.length &&
        (t = t.replace(/\$(\$|\d*)/g, (t, i) => {
          if ('$' == i) return '$';
          let n = +(i || 1);
          return !n || n > e.length ? t : e[n - 1];
        })),
      t
    );
  }
  languageDataAt(t, e, i = -1) {
    let n = [];
    for (let s of this.facet(It))
      for (let r of s(this, e, i)) Object.prototype.hasOwnProperty.call(r, t) && n.push(r[t]);
    return n;
  }
  charCategorizer(t) {
    return ue(this.languageDataAt('wordChars', t).join(''));
  }
  wordAt(t) {
    let { text: e, from: i, length: n } = this.doc.lineAt(t),
      s = this.charCategorizer(t),
      r = t - i,
      o = t - i;
    for (; r > 0; ) {
      let t = it(e, r, !1);
      if (s(e.slice(t, r)) != le.Word) break;
      r = t;
    }
    for (; o < n; ) {
      let t = it(e, o);
      if (s(e.slice(o, t)) != le.Word) break;
      o = t;
    }
    return r == o ? null : wt.range(r + i, o + i);
  }
}
function fe(t, e, i = {}) {
  let n = {};
  for (let e of t)
    for (let t of Object.keys(e)) {
      let s = e[t],
        r = n[t];
      if (void 0 === r) n[t] = s;
      else if (r === s || void 0 === s);
      else {
        if (!Object.hasOwnProperty.call(i, t)) throw new Error('Config merge conflict for field ' + t);
        n[t] = i[t](r, s);
      }
    }
  for (let t in e) void 0 === n[t] && (n[t] = e[t]);
  return n;
}
(Oe.allowMultipleSelections = Nt),
  (Oe.tabSize = St.define({ combine: (t) => (t.length ? t[0] : 4) })),
  (Oe.lineSeparator = Lt),
  (Oe.readOnly = Ft),
  (Oe.phrases = St.define({
    compare(t, e) {
      let i = Object.keys(t),
        n = Object.keys(e);
      return i.length == n.length && i.every((i) => t[i] == e[i]);
    },
  })),
  (Oe.languageData = It),
  (Oe.changeFilter = Ut),
  (Oe.transactionFilter = Bt),
  (Oe.transactionExtender = Yt),
  (_t.reconfigure = te.define());
class de {
  eq(t) {
    return this == t;
  }
  range(t, e = t) {
    return pe.create(t, e, this);
  }
}
(de.prototype.startSide = de.prototype.endSide = 0), (de.prototype.point = !1), (de.prototype.mapMode = ut.TrackDel);
class pe {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.value = i);
  }
  static create(t, e, i) {
    return new pe(t, e, i);
  }
}
function ge(t, e) {
  return t.from - e.from || t.value.startSide - e.value.startSide;
}
class me {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.value = i), (this.maxPoint = n);
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  findIndex(t, e, i, n = 0) {
    let s = i ? this.to : this.from;
    for (let r = n, o = s.length; ; ) {
      if (r == o) return r;
      let n = (r + o) >> 1,
        a = s[n] - t || (i ? this.value[n].endSide : this.value[n].startSide) - e;
      if (n == r) return a >= 0 ? r : o;
      a >= 0 ? (o = n) : (r = n + 1);
    }
  }
  between(t, e, i, n) {
    for (let s = this.findIndex(e, -1e9, !0), r = this.findIndex(i, 1e9, !1, s); s < r; s++)
      if (!1 === n(this.from[s] + t, this.to[s] + t, this.value[s])) return !1;
  }
  map(t, e) {
    let i = [],
      n = [],
      s = [],
      r = -1,
      o = -1;
    for (let a = 0; a < this.value.length; a++) {
      let l,
        h,
        c = this.value[a],
        u = this.from[a] + t,
        O = this.to[a] + t;
      if (u == O) {
        let t = e.mapPos(u, c.startSide, c.mapMode);
        if (null == t) continue;
        if (((l = h = t), c.startSide != c.endSide && ((h = e.mapPos(u, c.endSide)), h < l))) continue;
      } else if (
        ((l = e.mapPos(u, c.startSide)),
        (h = e.mapPos(O, c.endSide)),
        l > h || (l == h && c.startSide > 0 && c.endSide <= 0))
      )
        continue;
      (h - l || c.endSide - c.startSide) < 0 ||
        (r < 0 && (r = l), c.point && (o = Math.max(o, h - l)), i.push(c), n.push(l - r), s.push(h - r));
    }
    return { mapped: i.length ? new me(n, s, i, o) : null, pos: r };
  }
}
class Qe {
  constructor(t, e, i, n) {
    (this.chunkPos = t), (this.chunk = e), (this.nextLayer = i), (this.maxPoint = n);
  }
  static create(t, e, i, n) {
    return new Qe(t, e, i, n);
  }
  get length() {
    let t = this.chunk.length - 1;
    return t < 0 ? 0 : Math.max(this.chunkEnd(t), this.nextLayer.length);
  }
  get size() {
    if (this.isEmpty) return 0;
    let t = this.nextLayer.size;
    for (let e of this.chunk) t += e.value.length;
    return t;
  }
  chunkEnd(t) {
    return this.chunkPos[t] + this.chunk[t].length;
  }
  update(t) {
    let { add: e = [], sort: i = !1, filterFrom: n = 0, filterTo: s = this.length } = t,
      r = t.filter;
    if (0 == e.length && !r) return this;
    if ((i && (e = e.slice().sort(ge)), this.isEmpty)) return e.length ? Qe.of(e) : this;
    let o = new we(this, null, -1).goto(0),
      a = 0,
      l = [],
      h = new be();
    for (; o.value || a < e.length; )
      if (a < e.length && (o.from - e[a].from || o.startSide - e[a].value.startSide) >= 0) {
        let t = e[a++];
        h.addInner(t.from, t.to, t.value) || l.push(t);
      } else
        1 == o.rangeIndex &&
        o.chunkIndex < this.chunk.length &&
        (a == e.length || this.chunkEnd(o.chunkIndex) < e[a].from) &&
        (!r || n > this.chunkEnd(o.chunkIndex) || s < this.chunkPos[o.chunkIndex]) &&
        h.addChunk(this.chunkPos[o.chunkIndex], this.chunk[o.chunkIndex])
          ? o.nextChunk()
          : ((!r || n > o.to || s < o.from || r(o.from, o.to, o.value)) &&
              (h.addInner(o.from, o.to, o.value) || l.push(pe.create(o.from, o.to, o.value))),
            o.next());
    return h.finishInner(
      this.nextLayer.isEmpty && !l.length
        ? Qe.empty
        : this.nextLayer.update({ add: l, filter: r, filterFrom: n, filterTo: s }),
    );
  }
  map(t) {
    if (t.empty || this.isEmpty) return this;
    let e = [],
      i = [],
      n = -1;
    for (let s = 0; s < this.chunk.length; s++) {
      let r = this.chunkPos[s],
        o = this.chunk[s],
        a = t.touchesRange(r, r + o.length);
      if (!1 === a) (n = Math.max(n, o.maxPoint)), e.push(o), i.push(t.mapPos(r));
      else if (!0 === a) {
        let { mapped: s, pos: a } = o.map(r, t);
        s && ((n = Math.max(n, s.maxPoint)), e.push(s), i.push(a));
      }
    }
    let s = this.nextLayer.map(t);
    return 0 == e.length ? s : new Qe(i, e, s || Qe.empty, n);
  }
  between(t, e, i) {
    if (!this.isEmpty) {
      for (let n = 0; n < this.chunk.length; n++) {
        let s = this.chunkPos[n],
          r = this.chunk[n];
        if (e >= s && t <= s + r.length && !1 === r.between(s, t - s, e - s, i)) return;
      }
      this.nextLayer.between(t, e, i);
    }
  }
  iter(t = 0) {
    return xe.from([this]).goto(t);
  }
  get isEmpty() {
    return this.nextLayer == this;
  }
  static iter(t, e = 0) {
    return xe.from(t).goto(e);
  }
  static compare(t, e, i, n, s = -1) {
    let r = t.filter((t) => t.maxPoint > 0 || (!t.isEmpty && t.maxPoint >= s)),
      o = e.filter((t) => t.maxPoint > 0 || (!t.isEmpty && t.maxPoint >= s)),
      a = ye(r, o, i),
      l = new Se(r, a, s),
      h = new Se(o, a, s);
    i.iterGaps((t, e, i) => ke(l, t, h, e, i, n)), i.empty && 0 == i.length && ke(l, 0, h, 0, 0, n);
  }
  static eq(t, e, i = 0, n) {
    null == n && (n = 1e9);
    let s = t.filter((t) => !t.isEmpty && e.indexOf(t) < 0),
      r = e.filter((e) => !e.isEmpty && t.indexOf(e) < 0);
    if (s.length != r.length) return !1;
    if (!s.length) return !0;
    let o = ye(s, r),
      a = new Se(s, o, 0).goto(i),
      l = new Se(r, o, 0).goto(i);
    for (;;) {
      if (a.to != l.to || !$e(a.active, l.active) || (a.point && (!l.point || !a.point.eq(l.point)))) return !1;
      if (a.to > n) return !0;
      a.next(), l.next();
    }
  }
  static spans(t, e, i, n, s = -1) {
    let r = new Se(t, null, s).goto(e),
      o = e,
      a = r.openStart;
    for (;;) {
      let t = Math.min(r.to, i);
      if (
        (r.point
          ? (n.point(o, t, r.point, r.activeForPoint(r.to), a, r.pointRank), (a = r.openEnd(t) + (r.to > t ? 1 : 0)))
          : t > o && (n.span(o, t, r.active, a), (a = r.openEnd(t))),
        r.to > i)
      )
        break;
      (o = r.to), r.next();
    }
    return a;
  }
  static of(t, e = !1) {
    let i = new be();
    for (let n of t instanceof pe
      ? [t]
      : e
      ? (function (t) {
          if (t.length > 1)
            for (let e = t[0], i = 1; i < t.length; i++) {
              let n = t[i];
              if (ge(e, n) > 0) return t.slice().sort(ge);
              e = n;
            }
          return t;
        })(t)
      : t)
      i.add(n.from, n.to, n.value);
    return i.finish();
  }
}
(Qe.empty = new Qe([], [], null, -1)), (Qe.empty.nextLayer = Qe.empty);
class be {
  constructor() {
    (this.chunks = []),
      (this.chunkPos = []),
      (this.chunkStart = -1),
      (this.last = null),
      (this.lastFrom = -1e9),
      (this.lastTo = -1e9),
      (this.from = []),
      (this.to = []),
      (this.value = []),
      (this.maxPoint = -1),
      (this.setMaxPoint = -1),
      (this.nextLayer = null);
  }
  finishChunk(t) {
    this.chunks.push(new me(this.from, this.to, this.value, this.maxPoint)),
      this.chunkPos.push(this.chunkStart),
      (this.chunkStart = -1),
      (this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint)),
      (this.maxPoint = -1),
      t && ((this.from = []), (this.to = []), (this.value = []));
  }
  add(t, e, i) {
    this.addInner(t, e, i) || (this.nextLayer || (this.nextLayer = new be())).add(t, e, i);
  }
  addInner(t, e, i) {
    let n = t - this.lastTo || i.startSide - this.last.endSide;
    if (n <= 0 && (t - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error('Ranges must be added sorted by `from` position and `startSide`');
    return (
      !(n < 0) &&
      (250 == this.from.length && this.finishChunk(!0),
      this.chunkStart < 0 && (this.chunkStart = t),
      this.from.push(t - this.chunkStart),
      this.to.push(e - this.chunkStart),
      (this.last = i),
      (this.lastFrom = t),
      (this.lastTo = e),
      this.value.push(i),
      i.point && (this.maxPoint = Math.max(this.maxPoint, e - t)),
      !0)
    );
  }
  addChunk(t, e) {
    if ((t - this.lastTo || e.value[0].startSide - this.last.endSide) < 0) return !1;
    this.from.length && this.finishChunk(!0),
      (this.setMaxPoint = Math.max(this.setMaxPoint, e.maxPoint)),
      this.chunks.push(e),
      this.chunkPos.push(t);
    let i = e.value.length - 1;
    return (this.last = e.value[i]), (this.lastFrom = e.from[i] + t), (this.lastTo = e.to[i] + t), !0;
  }
  finish() {
    return this.finishInner(Qe.empty);
  }
  finishInner(t) {
    if ((this.from.length && this.finishChunk(!1), 0 == this.chunks.length)) return t;
    let e = Qe.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(t) : t, this.setMaxPoint);
    return (this.from = null), e;
  }
}
function ye(t, e, i) {
  let n = new Map();
  for (let e of t)
    for (let t = 0; t < e.chunk.length; t++) e.chunk[t].maxPoint <= 0 && n.set(e.chunk[t], e.chunkPos[t]);
  let s = new Set();
  for (let t of e)
    for (let e = 0; e < t.chunk.length; e++) {
      let r = n.get(t.chunk[e]);
      null == r ||
        (i ? i.mapPos(r) : r) != t.chunkPos[e] ||
        (null == i ? void 0 : i.touchesRange(r, r + t.chunk[e].length)) ||
        s.add(t.chunk[e]);
    }
  return s;
}
class we {
  constructor(t, e, i, n = 0) {
    (this.layer = t), (this.skip = e), (this.minPoint = i), (this.rank = n);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(t, e = -1e9) {
    return (this.chunkIndex = this.rangeIndex = 0), this.gotoInner(t, e, !1), this;
  }
  gotoInner(t, e, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let e = this.layer.chunk[this.chunkIndex];
      if (!((this.skip && this.skip.has(e)) || this.layer.chunkEnd(this.chunkIndex) < t || e.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, (i = !1);
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let n = this.layer.chunk[this.chunkIndex].findIndex(t - this.layer.chunkPos[this.chunkIndex], e, !0);
      (!i || this.rangeIndex < n) && this.setRangeIndex(n);
    }
    this.next();
  }
  forward(t, e) {
    (this.to - t || this.endSide - e) < 0 && this.gotoInner(t, e, !0);
  }
  next() {
    for (;;) {
      if (this.chunkIndex == this.layer.chunk.length) {
        (this.from = this.to = 1e9), (this.value = null);
        break;
      }
      {
        let t = this.layer.chunkPos[this.chunkIndex],
          e = this.layer.chunk[this.chunkIndex],
          i = t + e.from[this.rangeIndex];
        if (
          ((this.from = i),
          (this.to = t + e.to[this.rangeIndex]),
          (this.value = e.value[this.rangeIndex]),
          this.setRangeIndex(this.rangeIndex + 1),
          this.minPoint < 0 || (this.value.point && this.to - this.from >= this.minPoint))
        )
          break;
      }
    }
  }
  setRangeIndex(t) {
    if (t == this.layer.chunk[this.chunkIndex].value.length) {
      if ((this.chunkIndex++, this.skip))
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else this.rangeIndex = t;
  }
  nextChunk() {
    this.chunkIndex++, (this.rangeIndex = 0), this.next();
  }
  compare(t) {
    return (
      this.from - t.from ||
      this.startSide - t.startSide ||
      this.rank - t.rank ||
      this.to - t.to ||
      this.endSide - t.endSide
    );
  }
}
class xe {
  constructor(t) {
    this.heap = t;
  }
  static from(t, e = null, i = -1) {
    let n = [];
    for (let s = 0; s < t.length; s++)
      for (let r = t[s]; !r.isEmpty; r = r.nextLayer) r.maxPoint >= i && n.push(new we(r, e, i, s));
    return 1 == n.length ? n[0] : new xe(n);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(t, e = -1e9) {
    for (let i of this.heap) i.goto(t, e);
    for (let t = this.heap.length >> 1; t >= 0; t--) ve(this.heap, t);
    return this.next(), this;
  }
  forward(t, e) {
    for (let i of this.heap) i.forward(t, e);
    for (let t = this.heap.length >> 1; t >= 0; t--) ve(this.heap, t);
    (this.to - t || this.value.endSide - e) < 0 && this.next();
  }
  next() {
    if (0 == this.heap.length) (this.from = this.to = 1e9), (this.value = null), (this.rank = -1);
    else {
      let t = this.heap[0];
      (this.from = t.from),
        (this.to = t.to),
        (this.value = t.value),
        (this.rank = t.rank),
        t.value && t.next(),
        ve(this.heap, 0);
    }
  }
}
function ve(t, e) {
  for (let i = t[e]; ; ) {
    let n = 1 + (e << 1);
    if (n >= t.length) break;
    let s = t[n];
    if ((n + 1 < t.length && s.compare(t[n + 1]) >= 0 && ((s = t[n + 1]), n++), i.compare(s) < 0)) break;
    (t[n] = i), (t[e] = s), (e = n);
  }
}
class Se {
  constructor(t, e, i) {
    (this.minPoint = i),
      (this.active = []),
      (this.activeTo = []),
      (this.activeRank = []),
      (this.minActive = -1),
      (this.point = null),
      (this.pointFrom = 0),
      (this.pointRank = 0),
      (this.to = -1e9),
      (this.endSide = 0),
      (this.openStart = -1),
      (this.cursor = xe.from(t, e, i));
  }
  goto(t, e = -1e9) {
    return (
      this.cursor.goto(t, e),
      (this.active.length = this.activeTo.length = this.activeRank.length = 0),
      (this.minActive = -1),
      (this.to = t),
      (this.endSide = e),
      (this.openStart = -1),
      this.next(),
      this
    );
  }
  forward(t, e) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - t || this.active[this.minActive].endSide - e) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(t, e);
  }
  removeActive(t) {
    Te(this.active, t), Te(this.activeTo, t), Te(this.activeRank, t), (this.minActive = Re(this.active, this.activeTo));
  }
  addActive(t) {
    let e = 0,
      { value: i, to: n, rank: s } = this.cursor;
    for (; e < this.activeRank.length && this.activeRank[e] <= s; ) e++;
    Pe(this.active, e, i),
      Pe(this.activeTo, e, n),
      Pe(this.activeRank, e, s),
      t && Pe(t, e, this.cursor.from),
      (this.minActive = Re(this.active, this.activeTo));
  }
  next() {
    let t = this.to,
      e = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null,
      n = 0;
    for (;;) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > t) {
          (this.to = this.activeTo[s]), (this.endSide = this.active[s].endSide);
          break;
        }
        this.removeActive(s), i && Te(i, s);
      } else {
        if (!this.cursor.value) {
          this.to = this.endSide = 1e9;
          break;
        }
        if (this.cursor.from > t) {
          (this.to = this.cursor.from), (this.endSide = this.cursor.startSide);
          break;
        }
        {
          let s = this.cursor.value;
          if (s.point) {
            if (!(e && this.cursor.to == this.to && this.cursor.from < this.cursor.to)) {
              (this.point = s),
                (this.pointFrom = this.cursor.from),
                (this.pointRank = this.cursor.rank),
                (this.to = this.cursor.to),
                (this.endSide = s.endSide),
                this.cursor.from < t && (n = 1),
                this.cursor.next(),
                this.forward(this.to, this.endSide);
              break;
            }
            this.cursor.next();
          } else this.addActive(i), this.cursor.from < t && this.cursor.to > t && n++, this.cursor.next();
        }
      }
    }
    if (i) {
      let e = 0;
      for (; e < i.length && i[e] < t; ) e++;
      this.openStart = e + n;
    }
  }
  activeForPoint(t) {
    if (!this.active.length) return this.active;
    let e = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > t || (this.activeTo[i] == t && this.active[i].endSide >= this.point.endSide)) &&
        e.push(this.active[i]);
    return e.reverse();
  }
  openEnd(t) {
    let e = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > t; i--) e++;
    return e;
  }
}
function ke(t, e, i, n, s, r) {
  t.goto(e), i.goto(n);
  let o = n + s,
    a = n,
    l = n - e;
  for (;;) {
    let e = t.to + l - i.to || t.endSide - i.endSide,
      n = e < 0 ? t.to + l : i.to,
      s = Math.min(n, o);
    if (
      (t.point || i.point
        ? (t.point &&
            i.point &&
            (t.point == i.point || t.point.eq(i.point)) &&
            $e(t.activeForPoint(t.to + l), i.activeForPoint(i.to))) ||
          r.comparePoint(a, s, t.point, i.point)
        : s > a && !$e(t.active, i.active) && r.compareRange(a, s, t.active, i.active),
      n > o)
    )
      break;
    (a = n), e <= 0 && t.next(), e >= 0 && i.next();
  }
}
function $e(t, e) {
  if (t.length != e.length) return !1;
  for (let i = 0; i < t.length; i++) if (t[i] != e[i] && !t[i].eq(e[i])) return !1;
  return !0;
}
function Te(t, e) {
  for (let i = e, n = t.length - 1; i < n; i++) t[i] = t[i + 1];
  t.pop();
}
function Pe(t, e, i) {
  for (let i = t.length - 1; i >= e; i--) t[i + 1] = t[i];
  t[e] = i;
}
function Re(t, e) {
  let i = -1,
    n = 1e9;
  for (let s = 0; s < e.length; s++) (e[s] - n || t[s].endSide - t[i].endSide) < 0 && ((i = s), (n = e[s]));
  return i;
}
function Ce(t, e, i = t.length) {
  let n = 0;
  for (let s = 0; s < i; ) 9 == t.charCodeAt(s) ? ((n += e - (n % e)), s++) : (n++, (s = it(t, s)));
  return n;
}
const We = 'undefined' == typeof Symbol ? '__ͼ' : Symbol.for('ͼ'),
  Xe = 'undefined' == typeof Symbol ? '__styleSet' + Math.floor(1e8 * Math.random()) : Symbol('styleSet'),
  Ae = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : {};
class Ze {
  constructor(t, e) {
    this.rules = [];
    let { finish: i } = e || {};
    function n(t) {
      return /^@/.test(t) ? [t] : t.split(/,\s*/);
    }
    function s(t, e, r, o) {
      let a = [],
        l = /^@(\w+)\b/.exec(t[0]),
        h = l && 'keyframes' == l[1];
      if (l && null == e) return r.push(t[0] + ';');
      for (let i in e) {
        let o = e[i];
        if (/&/.test(i))
          s(
            i
              .split(/,\s*/)
              .map((e) => t.map((t) => e.replace(/&/, t)))
              .reduce((t, e) => t.concat(e)),
            o,
            r,
          );
        else if (o && 'object' == typeof o) {
          if (!l) throw new RangeError('The value of a property (' + i + ') should be a primitive value.');
          s(n(i), o, a, h);
        } else
          null != o && a.push(i.replace(/_.*/, '').replace(/[A-Z]/g, (t) => '-' + t.toLowerCase()) + ': ' + o + ';');
      }
      (a.length || h) && r.push((!i || l || o ? t : t.map(i)).join(', ') + ' {' + a.join(' ') + '}');
    }
    for (let e in t) s(n(e), t[e], this.rules);
  }
  getRules() {
    return this.rules.join('\n');
  }
  static newName() {
    let t = Ae[We] || 1;
    return (Ae[We] = t + 1), 'ͼ' + t.toString(36);
  }
  static mount(t, e) {
    (t[Xe] || new De(t)).mount(Array.isArray(e) ? e : [e]);
  }
}
let je = null;
class De {
  constructor(t) {
    if (!t.head && t.adoptedStyleSheets && 'undefined' != typeof CSSStyleSheet) {
      if (je) return (t.adoptedStyleSheets = [je.sheet].concat(t.adoptedStyleSheets)), (t[Xe] = je);
      (this.sheet = new CSSStyleSheet()),
        (t.adoptedStyleSheets = [this.sheet].concat(t.adoptedStyleSheets)),
        (je = this);
    } else {
      this.styleTag = (t.ownerDocument || t).createElement('style');
      let e = t.head || t;
      e.insertBefore(this.styleTag, e.firstChild);
    }
    (this.modules = []), (t[Xe] = this);
  }
  mount(t) {
    let e = this.sheet,
      i = 0,
      n = 0;
    for (let s = 0; s < t.length; s++) {
      let r = t[s],
        o = this.modules.indexOf(r);
      if ((o < n && o > -1 && (this.modules.splice(o, 1), n--, (o = -1)), -1 == o)) {
        if ((this.modules.splice(n++, 0, r), e)) for (let t = 0; t < r.rules.length; t++) e.insertRule(r.rules[t], i++);
      } else {
        for (; n < o; ) i += this.modules[n++].rules.length;
        (i += r.rules.length), n++;
      }
    }
    if (!e) {
      let t = '';
      for (let e = 0; e < this.modules.length; e++) t += this.modules[e].getRules() + '\n';
      this.styleTag.textContent = t;
    }
  }
}
var ze = {
    8: 'Backspace',
    9: 'Tab',
    10: 'Enter',
    12: 'NumLock',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    44: 'PrintScreen',
    45: 'Insert',
    46: 'Delete',
    59: ';',
    61: '=',
    91: 'Meta',
    92: 'Meta',
    106: '*',
    107: '+',
    108: ',',
    109: '-',
    110: '.',
    111: '/',
    144: 'NumLock',
    145: 'ScrollLock',
    160: 'Shift',
    161: 'Shift',
    162: 'Control',
    163: 'Control',
    164: 'Alt',
    165: 'Alt',
    173: '-',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
  },
  Me = {
    48: ')',
    49: '!',
    50: '@',
    51: '#',
    52: '$',
    53: '%',
    54: '^',
    55: '&',
    56: '*',
    57: '(',
    59: ':',
    61: '+',
    173: '_',
    186: ':',
    187: '+',
    188: '<',
    189: '_',
    190: '>',
    191: '?',
    192: '~',
    219: '{',
    220: '|',
    221: '}',
    222: '"',
  },
  _e = 'undefined' != typeof navigator && /Chrome\/(\d+)/.exec(navigator.userAgent);
'undefined' != typeof navigator && /Gecko\/\d+/.test(navigator.userAgent);
for (
  var qe = 'undefined' != typeof navigator && /Mac/.test(navigator.platform),
    Ee = 'undefined' != typeof navigator && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),
    Ge = qe || (_e && +_e[1] < 57),
    Ve = 0;
  Ve < 10;
  Ve++
)
  ze[48 + Ve] = ze[96 + Ve] = String(Ve);
for (Ve = 1; Ve <= 24; Ve++) ze[Ve + 111] = 'F' + Ve;
for (Ve = 65; Ve <= 90; Ve++) (ze[Ve] = String.fromCharCode(Ve + 32)), (Me[Ve] = String.fromCharCode(Ve));
for (var Ie in ze) Me.hasOwnProperty(Ie) || (Me[Ie] = ze[Ie]);
function Ne(t) {
  let e;
  return (e = 11 == t.nodeType ? (t.getSelection ? t : t.ownerDocument) : t), e.getSelection();
}
function Le(t, e) {
  return !!e && (t == e || t.contains(1 != e.nodeType ? e.parentNode : e));
}
function Ue(t, e) {
  if (!e.anchorNode) return !1;
  try {
    return Le(t, e.anchorNode);
  } catch (t) {
    return !1;
  }
}
function Be(t) {
  return 3 == t.nodeType ? oi(t, 0, t.nodeValue.length).getClientRects() : 1 == t.nodeType ? t.getClientRects() : [];
}
function Ye(t, e, i, n) {
  return !!i && (He(t, e, i, n, -1) || He(t, e, i, n, 1));
}
function Fe(t) {
  for (var e = 0; ; e++) if (!(t = t.previousSibling)) return e;
}
function He(t, e, i, n, s) {
  for (;;) {
    if (t == i && e == n) return !0;
    if (e == (s < 0 ? 0 : Je(t))) {
      if ('DIV' == t.nodeName) return !1;
      let i = t.parentNode;
      if (!i || 1 != i.nodeType) return !1;
      (e = Fe(t) + (s < 0 ? 0 : 1)), (t = i);
    } else {
      if (1 != t.nodeType) return !1;
      if (1 == (t = t.childNodes[e + (s < 0 ? -1 : 0)]).nodeType && 'false' == t.contentEditable) return !1;
      e = s < 0 ? Je(t) : 0;
    }
  }
}
function Je(t) {
  return 3 == t.nodeType ? t.nodeValue.length : t.childNodes.length;
}
const Ke = { left: 0, right: 0, top: 0, bottom: 0 };
function ti(t, e) {
  let i = e ? t.left : t.right;
  return { left: i, right: i, top: t.top, bottom: t.bottom };
}
function ei(t) {
  return { left: 0, right: t.innerWidth, top: 0, bottom: t.innerHeight };
}
class ii {
  constructor() {
    (this.anchorNode = null), (this.anchorOffset = 0), (this.focusNode = null), (this.focusOffset = 0);
  }
  eq(t) {
    return (
      this.anchorNode == t.anchorNode &&
      this.anchorOffset == t.anchorOffset &&
      this.focusNode == t.focusNode &&
      this.focusOffset == t.focusOffset
    );
  }
  setRange(t) {
    this.set(t.anchorNode, t.anchorOffset, t.focusNode, t.focusOffset);
  }
  set(t, e, i, n) {
    (this.anchorNode = t), (this.anchorOffset = e), (this.focusNode = i), (this.focusOffset = n);
  }
}
let ni,
  si = null;
function ri(t) {
  if (t.setActive) return t.setActive();
  if (si) return t.focus(si);
  let e = [];
  for (let i = t; i && (e.push(i, i.scrollTop, i.scrollLeft), i != i.ownerDocument); i = i.parentNode);
  if (
    (t.focus(
      null == si
        ? {
            get preventScroll() {
              return (si = { preventScroll: !0 }), !0;
            },
          }
        : void 0,
    ),
    !si)
  ) {
    si = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++],
        n = e[t++],
        s = e[t++];
      i.scrollTop != n && (i.scrollTop = n), i.scrollLeft != s && (i.scrollLeft = s);
    }
  }
}
function oi(t, e, i = e) {
  let n = ni || (ni = document.createRange());
  return n.setEnd(t, i), n.setStart(t, e), n;
}
function ai(t, e, i) {
  let n = { key: e, code: e, keyCode: i, which: i, cancelable: !0 },
    s = new KeyboardEvent('keydown', n);
  (s.synthetic = !0), t.dispatchEvent(s);
  let r = new KeyboardEvent('keyup', n);
  return (r.synthetic = !0), t.dispatchEvent(r), s.defaultPrevented || r.defaultPrevented;
}
function li(t) {
  for (; t.attributes.length; ) t.removeAttributeNode(t.attributes[0]);
}
class hi {
  constructor(t, e, i = !0) {
    (this.node = t), (this.offset = e), (this.precise = i);
  }
  static before(t, e) {
    return new hi(t.parentNode, Fe(t), e);
  }
  static after(t, e) {
    return new hi(t.parentNode, Fe(t) + 1, e);
  }
}
const ci = [];
class ui {
  constructor() {
    (this.parent = null), (this.dom = null), (this.dirty = 2);
  }
  get editorView() {
    if (!this.parent) throw new Error('Accessing view in orphan content view');
    return this.parent.editorView;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(t) {
    let e = this.posAtStart;
    for (let i of this.children) {
      if (i == t) return e;
      e += i.length + i.breakAfter;
    }
    throw new RangeError('Invalid child in posBefore');
  }
  posAfter(t) {
    return this.posBefore(t) + t.length;
  }
  coordsAt(t, e) {
    return null;
  }
  sync(t) {
    if (2 & this.dirty) {
      let e,
        i = this.dom,
        n = null;
      for (let s of this.children) {
        if (s.dirty) {
          if (!s.dom && (e = n ? n.nextSibling : i.firstChild)) {
            let t = ui.get(e);
            (t && (t.parent || t.constructor != s.constructor)) || s.reuseDOM(e);
          }
          s.sync(t), (s.dirty = 0);
        }
        if (
          ((e = n ? n.nextSibling : i.firstChild),
          t && !t.written && t.node == i && e != s.dom && (t.written = !0),
          s.dom.parentNode == i)
        )
          for (; e && e != s.dom; ) e = Oi(e);
        else i.insertBefore(s.dom, e);
        n = s.dom;
      }
      for (e = n ? n.nextSibling : i.firstChild, e && t && t.node == i && (t.written = !0); e; ) e = Oi(e);
    } else if (1 & this.dirty) for (let e of this.children) e.dirty && (e.sync(t), (e.dirty = 0));
  }
  reuseDOM(t) {}
  localPosFromDOM(t, e) {
    let i;
    if (t == this.dom) i = this.dom.childNodes[e];
    else {
      let n = 0 == Je(t) ? 0 : 0 == e ? -1 : 1;
      for (;;) {
        let e = t.parentNode;
        if (e == this.dom) break;
        0 == n && e.firstChild != e.lastChild && (n = t == e.firstChild ? -1 : 1), (t = e);
      }
      i = n < 0 ? t : t.nextSibling;
    }
    if (i == this.dom.firstChild) return 0;
    for (; i && !ui.get(i); ) i = i.nextSibling;
    if (!i) return this.length;
    for (let t = 0, e = 0; ; t++) {
      let n = this.children[t];
      if (n.dom == i) return e;
      e += n.length + n.breakAfter;
    }
  }
  domBoundsAround(t, e, i = 0) {
    let n = -1,
      s = -1,
      r = -1,
      o = -1;
    for (let a = 0, l = i, h = i; a < this.children.length; a++) {
      let i = this.children[a],
        c = l + i.length;
      if (l < t && c > e) return i.domBoundsAround(t, e, l);
      if ((c >= t && -1 == n && ((n = a), (s = l)), l > e && i.dom.parentNode == this.dom)) {
        (r = a), (o = h);
        break;
      }
      (h = c), (l = c + i.breakAfter);
    }
    return {
      from: s,
      to: o < 0 ? i + this.length : o,
      startDOM: (n ? this.children[n - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: r < this.children.length && r >= 0 ? this.children[r].dom : null,
    };
  }
  markDirty(t = !1) {
    (this.dirty |= 2), this.markParentsDirty(t);
  }
  markParentsDirty(t) {
    for (let e = this.parent; e; e = e.parent) {
      if ((t && (e.dirty |= 2), 1 & e.dirty)) return;
      (e.dirty |= 1), (t = !1);
    }
  }
  setParent(t) {
    this.parent != t && ((this.parent = t), this.dirty && this.markParentsDirty(!0));
  }
  setDOM(t) {
    this.dom && (this.dom.cmView = null), (this.dom = t), (t.cmView = this);
  }
  get rootView() {
    for (let t = this; ; ) {
      let e = t.parent;
      if (!e) return t;
      t = e;
    }
  }
  replaceChildren(t, e, i = ci) {
    this.markDirty();
    for (let i = t; i < e; i++) {
      let t = this.children[i];
      t.parent == this && t.destroy();
    }
    this.children.splice(t, e - t, ...i);
    for (let t = 0; t < i.length; t++) i[t].setParent(this);
  }
  ignoreMutation(t) {
    return !1;
  }
  ignoreEvent(t) {
    return !1;
  }
  childCursor(t = this.length) {
    return new fi(this.children, t, this.children.length);
  }
  childPos(t, e = 1) {
    return this.childCursor().findPos(t, e);
  }
  toString() {
    let t = this.constructor.name.replace('View', '');
    return (
      t +
      (this.children.length
        ? '(' + this.children.join() + ')'
        : this.length
        ? '[' + ('Text' == t ? this.text : this.length) + ']'
        : '') +
      (this.breakAfter ? '#' : '')
    );
  }
  static get(t) {
    return t.cmView;
  }
  get isEditable() {
    return !0;
  }
  merge(t, e, i, n, s, r) {
    return !1;
  }
  become(t) {
    return !1;
  }
  getSide() {
    return 0;
  }
  destroy() {
    this.parent = null;
  }
}
function Oi(t) {
  let e = t.nextSibling;
  return t.parentNode.removeChild(t), e;
}
ui.prototype.breakAfter = 0;
class fi {
  constructor(t, e, i) {
    (this.children = t), (this.pos = e), (this.i = i), (this.off = 0);
  }
  findPos(t, e = 1) {
    for (;;) {
      if (t > this.pos || (t == this.pos && (e > 0 || 0 == this.i || this.children[this.i - 1].breakAfter)))
        return (this.off = t - this.pos), this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function di(t, e, i, n, s, r, o, a, l) {
  let { children: h } = t,
    c = h.length ? h[e] : null,
    u = r.length ? r[r.length - 1] : null,
    O = u ? u.breakAfter : o;
  if (!(e == n && c && !o && !O && r.length < 2 && c.merge(i, s, r.length ? u : null, 0 == i, a, l))) {
    if (n < h.length) {
      let t = h[n];
      t && s < t.length
        ? (e == n && ((t = t.split(s)), (s = 0)),
          !O && u && t.merge(0, s, u, !0, 0, l)
            ? (r[r.length - 1] = t)
            : (s && t.merge(0, s, null, !1, 0, l), r.push(t)))
        : (null == t ? void 0 : t.breakAfter) && (u ? (u.breakAfter = 1) : (o = 1)),
        n++;
    }
    for (
      c &&
      ((c.breakAfter = o),
      i > 0 &&
        (!o && r.length && c.merge(i, c.length, r[0], !1, a, 0)
          ? (c.breakAfter = r.shift().breakAfter)
          : (i < c.length || (c.children.length && 0 == c.children[c.children.length - 1].length)) &&
            c.merge(i, c.length, null, !1, a, 0),
        e++));
      e < n && r.length;

    )
      if (h[n - 1].become(r[r.length - 1])) n--, r.pop(), (l = r.length ? 0 : a);
      else {
        if (!h[e].become(r[0])) break;
        e++, r.shift(), (a = r.length ? 0 : l);
      }
    !r.length && e && n < h.length && !h[e - 1].breakAfter && h[n].merge(0, 0, h[e - 1], !1, a, l) && e--,
      (e < n || r.length) && t.replaceChildren(e, n, r);
  }
}
function pi(t, e, i, n, s, r) {
  let o = t.childCursor(),
    { i: a, off: l } = o.findPos(i, 1),
    { i: h, off: c } = o.findPos(e, -1),
    u = e - i;
  for (let t of n) u += t.length;
  (t.length += u), di(t, h, c, a, l, n, 0, s, r);
}
let gi = 'undefined' != typeof navigator ? navigator : { userAgent: '', vendor: '', platform: '' },
  mi = 'undefined' != typeof document ? document : { documentElement: { style: {} } };
const Qi = /Edge\/(\d+)/.exec(gi.userAgent),
  bi = /MSIE \d/.test(gi.userAgent),
  yi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(gi.userAgent),
  wi = !!(bi || yi || Qi),
  xi = !wi && /gecko\/(\d+)/i.test(gi.userAgent),
  vi = !wi && /Chrome\/(\d+)/.exec(gi.userAgent),
  Si = 'webkitFontSmoothing' in mi.documentElement.style,
  ki = !wi && /Apple Computer/.test(gi.vendor),
  $i = ki && (/Mobile\/\w+/.test(gi.userAgent) || gi.maxTouchPoints > 2);
var Ti = {
  mac: $i || /Mac/.test(gi.platform),
  windows: /Win/.test(gi.platform),
  linux: /Linux|X11/.test(gi.platform),
  ie: wi,
  ie_version: bi ? mi.documentMode || 6 : yi ? +yi[1] : Qi ? +Qi[1] : 0,
  gecko: xi,
  gecko_version: xi ? +(/Firefox\/(\d+)/.exec(gi.userAgent) || [0, 0])[1] : 0,
  chrome: !!vi,
  chrome_version: vi ? +vi[1] : 0,
  ios: $i,
  android: /Android\b/.test(gi.userAgent),
  webkit: Si,
  safari: ki,
  webkit_version: Si ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: null != mi.documentElement.style.tabSize ? 'tab-size' : '-moz-tab-size',
};
class Pi extends ui {
  constructor(t) {
    super(), (this.text = t);
  }
  get length() {
    return this.text.length;
  }
  createDOM(t) {
    this.setDOM(t || document.createTextNode(this.text));
  }
  sync(t) {
    this.dom || this.createDOM(),
      this.dom.nodeValue != this.text &&
        (t && t.node == this.dom && (t.written = !0), (this.dom.nodeValue = this.text));
  }
  reuseDOM(t) {
    3 == t.nodeType && this.createDOM(t);
  }
  merge(t, e, i) {
    return (
      (!i || (i instanceof Pi && !(this.length - (e - t) + i.length > 256))) &&
      ((this.text = this.text.slice(0, t) + (i ? i.text : '') + this.text.slice(e)), this.markDirty(), !0)
    );
  }
  split(t) {
    let e = new Pi(this.text.slice(t));
    return (this.text = this.text.slice(0, t)), this.markDirty(), e;
  }
  localPosFromDOM(t, e) {
    return t == this.dom ? e : e ? this.text.length : 0;
  }
  domAtPos(t) {
    return new hi(this.dom, t);
  }
  domBoundsAround(t, e, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(t, e) {
    return Ci(this.dom, t, e);
  }
}
class Ri extends ui {
  constructor(t, e = [], i = 0) {
    super(), (this.mark = t), (this.children = e), (this.length = i);
    for (let t of e) t.setParent(this);
  }
  setAttrs(t) {
    if ((li(t), this.mark.class && (t.className = this.mark.class), this.mark.attrs))
      for (let e in this.mark.attrs) t.setAttribute(e, this.mark.attrs[e]);
    return t;
  }
  reuseDOM(t) {
    t.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(t), (this.dirty |= 6));
  }
  sync(t) {
    this.dom
      ? 4 & this.dirty && this.setAttrs(this.dom)
      : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))),
      super.sync(t);
  }
  merge(t, e, i, n, s, r) {
    return (
      (!i || !(!(i instanceof Ri && i.mark.eq(this.mark)) || (t && s <= 0) || (e < this.length && r <= 0))) &&
      (pi(this, t, e, i ? i.children : [], s - 1, r - 1), this.markDirty(), !0)
    );
  }
  split(t) {
    let e = [],
      i = 0,
      n = -1,
      s = 0;
    for (let r of this.children) {
      let o = i + r.length;
      o > t && e.push(i < t ? r.split(t - i) : r), n < 0 && i >= t && (n = s), (i = o), s++;
    }
    let r = this.length - t;
    return (this.length = t), n > -1 && ((this.children.length = n), this.markDirty()), new Ri(this.mark, e, r);
  }
  domAtPos(t) {
    return Di(this.dom, this.children, t);
  }
  coordsAt(t, e) {
    return Mi(this, t, e);
  }
}
function Ci(t, e, i) {
  let n = t.nodeValue.length;
  e > n && (e = n);
  let s = e,
    r = e,
    o = 0;
  (0 == e && i < 0) || (e == n && i >= 0)
    ? Ti.chrome || Ti.gecko || (e ? (s--, (o = 1)) : r < n && (r++, (o = -1)))
    : i < 0
    ? s--
    : r < n && r++;
  let a = oi(t, s, r).getClientRects();
  if (!a.length) return Ke;
  let l = a[(o ? o < 0 : i >= 0) ? 0 : a.length - 1];
  return (
    Ti.safari && !o && 0 == l.width && (l = Array.prototype.find.call(a, (t) => t.width) || l),
    o ? ti(l, o < 0) : l || null
  );
}
class Wi extends ui {
  constructor(t, e, i) {
    super(), (this.widget = t), (this.length = e), (this.side = i), (this.prevWidget = null);
  }
  static create(t, e, i) {
    return new (t.customView || Wi)(t, e, i);
  }
  split(t) {
    let e = Wi.create(this.widget, this.length - t, this.side);
    return (this.length -= t), e;
  }
  sync() {
    (this.dom && this.widget.updateDOM(this.dom)) ||
      (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
      (this.prevWidget = null),
      this.setDOM(this.widget.toDOM(this.editorView)),
      (this.dom.contentEditable = 'false'));
  }
  getSide() {
    return this.side;
  }
  merge(t, e, i, n, s, r) {
    return (
      !(
        i &&
        (!(i instanceof Wi && this.widget.compare(i.widget)) || (t > 0 && s <= 0) || (e < this.length && r <= 0))
      ) && ((this.length = t + (i ? i.length : 0) + (this.length - e)), !0)
    );
  }
  become(t) {
    return (
      t.length == this.length &&
      t instanceof Wi &&
      t.side == this.side &&
      this.widget.constructor == t.widget.constructor &&
      (this.widget.eq(t.widget) || this.markDirty(!0),
      this.dom && !this.prevWidget && (this.prevWidget = this.widget),
      (this.widget = t.widget),
      !0)
    );
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  get overrideDOMText() {
    if (0 == this.length) return I.empty;
    let t = this;
    for (; t.parent; ) t = t.parent;
    let e = t.editorView,
      i = e && e.state.doc,
      n = this.posAtStart;
    return i ? i.slice(n, n + this.length) : I.empty;
  }
  domAtPos(t) {
    return 0 == t ? hi.before(this.dom) : hi.after(this.dom, t == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t, e) {
    let i = this.dom.getClientRects(),
      n = null;
    if (!i.length) return Ke;
    for (
      let e = t > 0 ? i.length - 1 : 0;
      (n = i[e]), !(t > 0 ? 0 == e : e == i.length - 1 || n.top < n.bottom);
      e += t > 0 ? -1 : 1
    );
    return (0 == t && e > 0) || (t == this.length && e <= 0) ? n : ti(n, 0 == t);
  }
  get isEditable() {
    return !1;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class Xi extends Wi {
  domAtPos(t) {
    let { topView: e, text: i } = this.widget;
    return e
      ? Ai(
          t,
          0,
          e,
          i,
          (t, e) => t.domAtPos(e),
          (t) => new hi(i, Math.min(t, i.nodeValue.length)),
        )
      : new hi(i, Math.min(t, i.nodeValue.length));
  }
  sync() {
    this.setDOM(this.widget.toDOM());
  }
  localPosFromDOM(t, e) {
    let { topView: i, text: n } = this.widget;
    return i ? Zi(t, e, i, n) : Math.min(e, this.length);
  }
  ignoreMutation() {
    return !1;
  }
  get overrideDOMText() {
    return null;
  }
  coordsAt(t, e) {
    let { topView: i, text: n } = this.widget;
    return i
      ? Ai(
          t,
          e,
          i,
          n,
          (t, e, i) => t.coordsAt(e, i),
          (t, e) => Ci(n, t, e),
        )
      : Ci(n, t, e);
  }
  destroy() {
    var t;
    super.destroy(), null === (t = this.widget.topView) || void 0 === t || t.destroy();
  }
  get isEditable() {
    return !0;
  }
}
function Ai(t, e, i, n, s, r) {
  if (i instanceof Ri) {
    for (let o of i.children) {
      let i = Le(o.dom, n),
        a = i ? n.nodeValue.length : o.length;
      if (t < a || (t == a && o.getSide() <= 0)) return i ? Ai(t, e, o, n, s, r) : s(o, t, e);
      t -= a;
    }
    return s(i, i.length, -1);
  }
  return i.dom == n ? r(t, e) : s(i, t, e);
}
function Zi(t, e, i, n) {
  if (i instanceof Ri)
    for (let s of i.children) {
      let i = 0,
        r = Le(s.dom, n);
      if (Le(s.dom, t)) return i + (r ? Zi(t, e, s, n) : s.localPosFromDOM(t, e));
      i += r ? n.nodeValue.length : s.length;
    }
  else if (i.dom == n) return Math.min(e, n.nodeValue.length);
  return i.localPosFromDOM(t, e);
}
class ji extends ui {
  constructor(t) {
    super(), (this.side = t);
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(t) {
    return t instanceof ji && t.side == this.side;
  }
  split() {
    return new ji(this.side);
  }
  sync() {
    if (!this.dom) {
      let t = document.createElement('img');
      (t.className = 'cm-widgetBuffer'), t.setAttribute('aria-hidden', 'true'), this.setDOM(t);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(t) {
    return hi.before(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t) {
    let e = this.dom.getBoundingClientRect(),
      i = (function (t, e) {
        let i = t.parent,
          n = i ? i.children.indexOf(t) : -1;
        for (; i && n >= 0; )
          if (e < 0 ? n > 0 : n < i.children.length) {
            let t = i.children[n + e];
            if (t instanceof Pi) {
              let i = t.coordsAt(e < 0 ? t.length : 0, e);
              if (i) return i;
            }
            n += e;
          } else {
            if (!(i instanceof Ri && i.parent)) {
              let t = i.dom.lastChild;
              if (t && 'BR' == t.nodeName) return t.getClientRects()[0];
              break;
            }
            (n = i.parent.children.indexOf(i) + (e < 0 ? 0 : 1)), (i = i.parent);
          }
        return;
      })(this, this.side > 0 ? -1 : 1);
    return i && i.top < e.bottom && i.bottom > e.top
      ? { left: e.left, right: e.right, top: i.top, bottom: i.bottom }
      : e;
  }
  get overrideDOMText() {
    return I.empty;
  }
}
function Di(t, e, i) {
  let n = 0;
  for (let s = 0; n < e.length; n++) {
    let r = e[n],
      o = s + r.length;
    if (!(o == s && r.getSide() <= 0)) {
      if (i > s && i < o && r.dom.parentNode == t) return r.domAtPos(i - s);
      if (i <= s) break;
      s = o;
    }
  }
  for (; n > 0; n--) {
    let i = e[n - 1].dom;
    if (i.parentNode == t) return hi.after(i);
  }
  return new hi(t, 0);
}
function zi(t, e, i) {
  let n,
    { children: s } = t;
  i > 0 && e instanceof Ri && s.length && (n = s[s.length - 1]) instanceof Ri && n.mark.eq(e.mark)
    ? zi(n, e.children[0], i - 1)
    : (s.push(e), e.setParent(t)),
    (t.length += e.length);
}
function Mi(t, e, i) {
  for (let n = 0, s = 0; s < t.children.length; s++) {
    let r,
      o = t.children[s],
      a = n + o.length;
    if (
      (i <= 0 || a == t.length || o.getSide() > 0 ? a >= e : a > e) &&
      (e < a || s + 1 == t.children.length || (r = t.children[s + 1]).length || r.getSide() > 0)
    ) {
      let t = 0;
      if (a == n) {
        if (o.getSide() <= 0) continue;
        t = i = -o.getSide();
      }
      let s = o.coordsAt(Math.max(0, e - n), i);
      return t && s ? ti(s, i < 0) : s;
    }
    n = a;
  }
  let n = t.dom.lastChild;
  if (!n) return t.dom.getBoundingClientRect();
  let s = Be(n);
  return s[s.length - 1] || null;
}
function _i(t, e) {
  for (let i in t)
    'class' == i && e.class
      ? (e.class += ' ' + t.class)
      : 'style' == i && e.style
      ? (e.style += ';' + t.style)
      : (e[i] = t[i]);
  return e;
}
function qi(t, e) {
  if (t == e) return !0;
  if (!t || !e) return !1;
  let i = Object.keys(t),
    n = Object.keys(e);
  if (i.length != n.length) return !1;
  for (let s of i) if (-1 == n.indexOf(s) || t[s] !== e[s]) return !1;
  return !0;
}
function Ei(t, e, i) {
  let n = null;
  if (e) for (let s in e) (i && s in i) || t.removeAttribute((n = s));
  if (i) for (let s in i) (e && e[s] == i[s]) || t.setAttribute((n = s), i[s]);
  return !!n;
}
Pi.prototype.children = Wi.prototype.children = ji.prototype.children = ci;
class Gi {
  eq(t) {
    return !1;
  }
  updateDOM(t) {
    return !1;
  }
  compare(t) {
    return this == t || (this.constructor == t.constructor && this.eq(t));
  }
  get estimatedHeight() {
    return -1;
  }
  ignoreEvent(t) {
    return !0;
  }
  get customView() {
    return null;
  }
  destroy(t) {}
}
var Vi = (function (t) {
  return (
    (t[(t.Text = 0)] = 'Text'),
    (t[(t.WidgetBefore = 1)] = 'WidgetBefore'),
    (t[(t.WidgetAfter = 2)] = 'WidgetAfter'),
    (t[(t.WidgetRange = 3)] = 'WidgetRange'),
    t
  );
})(Vi || (Vi = {}));
class Ii extends de {
  constructor(t, e, i, n) {
    super(), (this.startSide = t), (this.endSide = e), (this.widget = i), (this.spec = n);
  }
  get heightRelevant() {
    return !1;
  }
  static mark(t) {
    return new Ni(t);
  }
  static widget(t) {
    let e = t.side || 0,
      i = !!t.block;
    return (e += i ? (e > 0 ? 3e8 : -4e8) : e > 0 ? 1e8 : -1e8), new Ui(t, e, e, i, t.widget || null, !1);
  }
  static replace(t) {
    let e,
      i,
      n = !!t.block;
    if (t.isBlockGap) (e = -5e8), (i = 4e8);
    else {
      let { start: s, end: r } = Bi(t, n);
      (e = (s ? (n ? -3e8 : -1) : 5e8) - 1), (i = 1 + (r ? (n ? 2e8 : 1) : -6e8));
    }
    return new Ui(t, e, i, n, t.widget || null, !0);
  }
  static line(t) {
    return new Li(t);
  }
  static set(t, e = !1) {
    return Qe.of(t, e);
  }
  hasHeight() {
    return !!this.widget && this.widget.estimatedHeight > -1;
  }
}
Ii.none = Qe.empty;
class Ni extends Ii {
  constructor(t) {
    let { start: e, end: i } = Bi(t);
    super(e ? -1 : 5e8, i ? 1 : -6e8, null, t),
      (this.tagName = t.tagName || 'span'),
      (this.class = t.class || ''),
      (this.attrs = t.attributes || null);
  }
  eq(t) {
    return (
      this == t || (t instanceof Ni && this.tagName == t.tagName && this.class == t.class && qi(this.attrs, t.attrs))
    );
  }
  range(t, e = t) {
    if (t >= e) throw new RangeError('Mark decorations may not be empty');
    return super.range(t, e);
  }
}
Ni.prototype.point = !1;
class Li extends Ii {
  constructor(t) {
    super(-2e8, -2e8, null, t);
  }
  eq(t) {
    return t instanceof Li && qi(this.spec.attributes, t.spec.attributes);
  }
  range(t, e = t) {
    if (e != t) throw new RangeError('Line decoration ranges must be zero-length');
    return super.range(t, e);
  }
}
(Li.prototype.mapMode = ut.TrackBefore), (Li.prototype.point = !0);
class Ui extends Ii {
  constructor(t, e, i, n, s, r) {
    super(e, i, s, t),
      (this.block = n),
      (this.isReplace = r),
      (this.mapMode = n ? (e <= 0 ? ut.TrackBefore : ut.TrackAfter) : ut.TrackDel);
  }
  get type() {
    return this.startSide < this.endSide ? Vi.WidgetRange : this.startSide <= 0 ? Vi.WidgetBefore : Vi.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || (!!this.widget && this.widget.estimatedHeight >= 5);
  }
  eq(t) {
    return (
      t instanceof Ui &&
      ((e = this.widget), (i = t.widget), e == i || !!(e && i && e.compare(i))) &&
      this.block == t.block &&
      this.startSide == t.startSide &&
      this.endSide == t.endSide
    );
    var e, i;
  }
  range(t, e = t) {
    if (this.isReplace && (t > e || (t == e && this.startSide > 0 && this.endSide <= 0)))
      throw new RangeError('Invalid range for replacement decoration');
    if (!this.isReplace && e != t) throw new RangeError('Widget decorations can only have zero-length ranges');
    return super.range(t, e);
  }
}
function Bi(t, e = !1) {
  let { inclusiveStart: i, inclusiveEnd: n } = t;
  return (
    null == i && (i = t.inclusive), null == n && (n = t.inclusive), { start: null != i ? i : e, end: null != n ? n : e }
  );
}
function Yi(t, e, i, n = 0) {
  let s = i.length - 1;
  s >= 0 && i[s] + n >= t ? (i[s] = Math.max(i[s], e)) : i.push(t, e);
}
Ui.prototype.point = !0;
class Fi extends ui {
  constructor() {
    super(...arguments),
      (this.children = []),
      (this.length = 0),
      (this.prevAttrs = void 0),
      (this.attrs = null),
      (this.breakAfter = 0);
  }
  merge(t, e, i, n, s, r) {
    if (i) {
      if (!(i instanceof Fi)) return !1;
      this.dom || i.transferDOM(this);
    }
    return n && this.setDeco(i ? i.attrs : null), pi(this, t, e, i ? i.children : [], s, r), !0;
  }
  split(t) {
    let e = new Fi();
    if (((e.breakAfter = this.breakAfter), 0 == this.length)) return e;
    let { i: i, off: n } = this.childPos(t);
    n &&
      (e.append(this.children[i].split(n), 0), this.children[i].merge(n, this.children[i].length, null, !1, 0, 0), i++);
    for (let t = i; t < this.children.length; t++) e.append(this.children[t], 0);
    for (; i > 0 && 0 == this.children[i - 1].length; ) this.children[--i].destroy();
    return (this.children.length = i), this.markDirty(), (this.length = t), e;
  }
  transferDOM(t) {
    this.dom &&
      (this.markDirty(),
      t.setDOM(this.dom),
      (t.prevAttrs = void 0 === this.prevAttrs ? this.attrs : this.prevAttrs),
      (this.prevAttrs = void 0),
      (this.dom = null));
  }
  setDeco(t) {
    qi(this.attrs, t) || (this.dom && ((this.prevAttrs = this.attrs), this.markDirty()), (this.attrs = t));
  }
  append(t, e) {
    zi(this, t, e);
  }
  addLineDeco(t) {
    let e = t.spec.attributes,
      i = t.spec.class;
    e && (this.attrs = _i(e, this.attrs || {})), i && (this.attrs = _i({ class: i }, this.attrs || {}));
  }
  domAtPos(t) {
    return Di(this.dom, this.children, t);
  }
  reuseDOM(t) {
    'DIV' == t.nodeName && (this.setDOM(t), (this.dirty |= 6));
  }
  sync(t) {
    var e;
    this.dom
      ? 4 & this.dirty &&
        (li(this.dom), (this.dom.className = 'cm-line'), (this.prevAttrs = this.attrs ? null : void 0))
      : (this.setDOM(document.createElement('div')),
        (this.dom.className = 'cm-line'),
        (this.prevAttrs = this.attrs ? null : void 0)),
      void 0 !== this.prevAttrs &&
        (Ei(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add('cm-line'), (this.prevAttrs = void 0)),
      super.sync(t);
    let i = this.dom.lastChild;
    for (; i && ui.get(i) instanceof Ri; ) i = i.lastChild;
    if (
      !(
        i &&
        this.length &&
        ('BR' == i.nodeName ||
          0 != (null === (e = ui.get(i)) || void 0 === e ? void 0 : e.isEditable) ||
          (Ti.ios && this.children.some((t) => t instanceof Pi)))
      )
    ) {
      let t = document.createElement('BR');
      (t.cmIgnore = !0), this.dom.appendChild(t);
    }
  }
  measureTextSize() {
    if (0 == this.children.length || this.length > 20) return null;
    let t = 0;
    for (let e of this.children) {
      if (!(e instanceof Pi) || /[^ -~]/.test(e.text)) return null;
      let i = Be(e.dom);
      if (1 != i.length) return null;
      t += i[0].width;
    }
    return t ? { lineHeight: this.dom.getBoundingClientRect().height, charWidth: t / this.length } : null;
  }
  coordsAt(t, e) {
    return Mi(this, t, e);
  }
  become(t) {
    return !1;
  }
  get type() {
    return Vi.Text;
  }
  static find(t, e) {
    for (let i = 0, n = 0; i < t.children.length; i++) {
      let s = t.children[i],
        r = n + s.length;
      if (r >= e) {
        if (s instanceof Fi) return s;
        if (r > e) break;
      }
      n = r + s.breakAfter;
    }
    return null;
  }
}
class Hi extends ui {
  constructor(t, e, i) {
    super(), (this.widget = t), (this.length = e), (this.type = i), (this.breakAfter = 0), (this.prevWidget = null);
  }
  merge(t, e, i, n, s, r) {
    return (
      !(
        i &&
        (!(i instanceof Hi && this.widget.compare(i.widget)) || (t > 0 && s <= 0) || (e < this.length && r <= 0))
      ) && ((this.length = t + (i ? i.length : 0) + (this.length - e)), !0)
    );
  }
  domAtPos(t) {
    return 0 == t ? hi.before(this.dom) : hi.after(this.dom, t == this.length);
  }
  split(t) {
    let e = this.length - t;
    this.length = t;
    let i = new Hi(this.widget, e, this.type);
    return (i.breakAfter = this.breakAfter), i;
  }
  get children() {
    return ci;
  }
  sync() {
    (this.dom && this.widget.updateDOM(this.dom)) ||
      (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
      (this.prevWidget = null),
      this.setDOM(this.widget.toDOM(this.editorView)),
      (this.dom.contentEditable = 'false'));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : I.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(t) {
    return (
      t instanceof Hi &&
      t.type == this.type &&
      t.widget.constructor == this.widget.constructor &&
      (t.widget.eq(this.widget) || this.markDirty(!0),
      this.dom && !this.prevWidget && (this.prevWidget = this.widget),
      (this.widget = t.widget),
      (this.length = t.length),
      (this.breakAfter = t.breakAfter),
      !0)
    );
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class Ji {
  constructor(t, e, i, n) {
    (this.doc = t),
      (this.pos = e),
      (this.end = i),
      (this.disallowBlockEffectsFor = n),
      (this.content = []),
      (this.curLine = null),
      (this.breakAtStart = 0),
      (this.pendingBuffer = 0),
      (this.atCursorPos = !0),
      (this.openStart = -1),
      (this.openEnd = -1),
      (this.text = ''),
      (this.textOff = 0),
      (this.cursor = t.iter()),
      (this.skip = e);
  }
  posCovered() {
    if (0 == this.content.length) return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let t = this.content[this.content.length - 1];
    return !(t.breakAfter || (t instanceof Hi && t.type == Vi.WidgetBefore));
  }
  getLine() {
    return this.curLine || (this.content.push((this.curLine = new Fi())), (this.atCursorPos = !0)), this.curLine;
  }
  flushBuffer(t) {
    this.pendingBuffer && (this.curLine.append(Ki(new ji(-1), t), t.length), (this.pendingBuffer = 0));
  }
  addBlockWidget(t) {
    this.flushBuffer([]), (this.curLine = null), this.content.push(t);
  }
  finish(t) {
    t ? (this.pendingBuffer = 0) : this.flushBuffer([]), this.posCovered() || this.getLine();
  }
  buildText(t, e, i) {
    for (; t > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: e, lineBreak: i, done: n } = this.cursor.next(this.skip);
        if (((this.skip = 0), n)) throw new Error('Ran out of text content when drawing inline views');
        if (i) {
          this.posCovered() || this.getLine(),
            this.content.length ? (this.content[this.content.length - 1].breakAfter = 1) : (this.breakAtStart = 1),
            this.flushBuffer([]),
            (this.curLine = null),
            t--;
          continue;
        }
        (this.text = e), (this.textOff = 0);
      }
      let n = Math.min(this.text.length - this.textOff, t, 512);
      this.flushBuffer(e.slice(0, i)),
        this.getLine().append(Ki(new Pi(this.text.slice(this.textOff, this.textOff + n)), e), i),
        (this.atCursorPos = !0),
        (this.textOff += n),
        (t -= n),
        (i = 0);
    }
  }
  span(t, e, i, n) {
    this.buildText(e - t, i, n), (this.pos = e), this.openStart < 0 && (this.openStart = n);
  }
  point(t, e, i, n, s, r) {
    if (this.disallowBlockEffectsFor[r] && i instanceof Ui) {
      if (i.block) throw new RangeError('Block decorations may not be specified via plugins');
      if (e > this.doc.lineAt(this.pos).to)
        throw new RangeError('Decorations that replace line breaks may not be specified via plugins');
    }
    let o = e - t;
    if (i instanceof Ui)
      if (i.block) {
        let { type: t } = i;
        t != Vi.WidgetAfter || this.posCovered() || this.getLine(),
          this.addBlockWidget(new Hi(i.widget || new tn('div'), o, t));
      } else {
        let r = Wi.create(i.widget || new tn('span'), o, i.startSide),
          a = this.atCursorPos && !r.isEditable && s <= n.length && (t < e || i.startSide > 0),
          l = !r.isEditable && (t < e || i.startSide <= 0),
          h = this.getLine();
        2 != this.pendingBuffer || a || (this.pendingBuffer = 0),
          this.flushBuffer(n),
          a && (h.append(Ki(new ji(1), n), s), (s = n.length + Math.max(0, s - n.length))),
          h.append(Ki(r, n), s),
          (this.atCursorPos = l),
          (this.pendingBuffer = l ? (t < e ? 1 : 2) : 0);
      }
    else this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    o &&
      (this.textOff + o <= this.text.length
        ? (this.textOff += o)
        : ((this.skip += o - (this.text.length - this.textOff)), (this.text = ''), (this.textOff = 0)),
      (this.pos = e)),
      this.openStart < 0 && (this.openStart = s);
  }
  static build(t, e, i, n, s) {
    let r = new Ji(t, e, i, s);
    return (r.openEnd = Qe.spans(n, e, i, r)), r.openStart < 0 && (r.openStart = r.openEnd), r.finish(r.openEnd), r;
  }
}
function Ki(t, e) {
  for (let i of e) t = new Ri(i, [t], t.length);
  return t;
}
class tn extends Gi {
  constructor(t) {
    super(), (this.tag = t);
  }
  eq(t) {
    return t.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(t) {
    return t.nodeName.toLowerCase() == this.tag;
  }
}
const en = St.define(),
  nn = St.define(),
  sn = St.define(),
  rn = St.define(),
  on = St.define(),
  an = St.define(),
  ln = St.define({ combine: (t) => t.some((t) => t) });
class hn {
  constructor(t, e = 'nearest', i = 'nearest', n = 5, s = 5) {
    (this.range = t), (this.y = e), (this.x = i), (this.yMargin = n), (this.xMargin = s);
  }
  map(t) {
    return t.empty ? this : new hn(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin);
  }
}
const cn = te.define({ map: (t, e) => t.map(e) });
function un(t, e, i) {
  let n = t.facet(rn);
  n.length
    ? n[0](e)
    : window.onerror
    ? window.onerror(String(e), i, void 0, void 0, e)
    : i
    ? console.error(i + ':', e)
    : console.error(e);
}
const On = St.define({ combine: (t) => !t.length || t[0] });
let fn = 0;
const dn = St.define();
class pn {
  constructor(t, e, i, n) {
    (this.id = t), (this.create = e), (this.domEventHandlers = i), (this.extension = n(this));
  }
  static define(t, e) {
    const { eventHandlers: i, provide: n, decorations: s } = e || {};
    return new pn(fn++, t, i, (t) => {
      let e = [dn.of(t)];
      return (
        s &&
          e.push(
            bn.of((e) => {
              let i = e.plugin(t);
              return i ? s(i) : Ii.none;
            }),
          ),
        n && e.push(n(t)),
        e
      );
    });
  }
  static fromClass(t, e) {
    return pn.define((e) => new t(e), e);
  }
}
class gn {
  constructor(t) {
    (this.spec = t), (this.mustUpdate = null), (this.value = null);
  }
  update(t) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (((this.mustUpdate = null), this.value.update))
          try {
            this.value.update(t);
          } catch (e) {
            if ((un(t.state, e, 'CodeMirror plugin crashed'), this.value.destroy))
              try {
                this.value.destroy();
              } catch (t) {}
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(t);
      } catch (e) {
        un(t.state, e, 'CodeMirror plugin crashed'), this.deactivate();
      }
    return this;
  }
  destroy(t) {
    var e;
    if (null === (e = this.value) || void 0 === e ? void 0 : e.destroy)
      try {
        this.value.destroy();
      } catch (e) {
        un(t.state, e, 'CodeMirror plugin crashed');
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const mn = St.define(),
  Qn = St.define(),
  bn = St.define(),
  yn = St.define(),
  wn = St.define(),
  xn = St.define();
class vn {
  constructor(t, e, i, n) {
    (this.fromA = t), (this.toA = e), (this.fromB = i), (this.toB = n);
  }
  join(t) {
    return new vn(
      Math.min(this.fromA, t.fromA),
      Math.max(this.toA, t.toA),
      Math.min(this.fromB, t.fromB),
      Math.max(this.toB, t.toB),
    );
  }
  addToSet(t) {
    let e = t.length,
      i = this;
    for (; e > 0; e--) {
      let n = t[e - 1];
      if (!(n.fromA > i.toA)) {
        if (n.toA < i.fromA) break;
        (i = i.join(n)), t.splice(e - 1, 1);
      }
    }
    return t.splice(e, 0, i), t;
  }
  static extendWithRanges(t, e) {
    if (0 == e.length) return t;
    let i = [];
    for (let n = 0, s = 0, r = 0, o = 0; ; n++) {
      let a = n == t.length ? null : t[n],
        l = r - o,
        h = a ? a.fromB : 1e9;
      for (; s < e.length && e[s] < h; ) {
        let t = e[s],
          n = e[s + 1],
          r = Math.max(o, t),
          a = Math.min(h, n);
        if ((r <= a && new vn(r + l, a + l, r, a).addToSet(i), n > h)) break;
        s += 2;
      }
      if (!a) return i;
      new vn(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), (r = a.toA), (o = a.toB);
    }
  }
}
class Sn {
  constructor(t, e, i) {
    (this.view = t),
      (this.state = e),
      (this.transactions = i),
      (this.flags = 0),
      (this.startState = t.state),
      (this.changes = ft.empty(this.startState.doc.length));
    for (let t of i) this.changes = this.changes.compose(t.changes);
    let n = [];
    this.changes.iterChangedRanges((t, e, i, s) => n.push(new vn(t, e, i, s))), (this.changedRanges = n);
    let s = t.hasFocus;
    s != t.inputState.notifiedFocused && ((t.inputState.notifiedFocused = s), (this.flags |= 1));
  }
  static create(t, e, i) {
    return new Sn(t, e, i);
  }
  get viewportChanged() {
    return (4 & this.flags) > 0;
  }
  get heightChanged() {
    return (2 & this.flags) > 0;
  }
  get geometryChanged() {
    return this.docChanged || (10 & this.flags) > 0;
  }
  get focusChanged() {
    return (1 & this.flags) > 0;
  }
  get docChanged() {
    return !this.changes.empty;
  }
  get selectionSet() {
    return this.transactions.some((t) => t.selection);
  }
  get empty() {
    return 0 == this.flags && 0 == this.transactions.length;
  }
}
var kn = (function (t) {
  return (t[(t.LTR = 0)] = 'LTR'), (t[(t.RTL = 1)] = 'RTL'), t;
})(kn || (kn = {}));
const $n = kn.LTR,
  Tn = kn.RTL;
function Pn(t) {
  let e = [];
  for (let i = 0; i < t.length; i++) e.push(1 << +t[i]);
  return e;
}
const Rn = Pn(
    '88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008',
  ),
  Cn = Pn(
    '4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333',
  ),
  Wn = Object.create(null),
  Xn = [];
for (let t of ['()', '[]', '{}']) {
  let e = t.charCodeAt(0),
    i = t.charCodeAt(1);
  (Wn[e] = i), (Wn[i] = -e);
}
const An = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
class Zn {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.level = i);
  }
  get dir() {
    return this.level % 2 ? Tn : $n;
  }
  side(t, e) {
    return (this.dir == e) == t ? this.to : this.from;
  }
  static find(t, e, i, n) {
    let s = -1;
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      if (o.from <= e && o.to >= e) {
        if (o.level == i) return r;
        (s < 0 || (0 != n ? (n < 0 ? o.from < e : o.to > e) : t[s].level > o.level)) && (s = r);
      }
    }
    if (s < 0) throw new RangeError('Index out of range');
    return s;
  }
}
const jn = [];
function Dn(t) {
  return [new Zn(0, t, 0)];
}
let zn = '';
function Mn(t, e, i, n, s) {
  var r;
  let o = n.head - t.from,
    a = -1;
  if (0 == o) {
    if (!s || !t.length) return null;
    e[0].level != i && ((o = e[0].side(!1, i)), (a = 0));
  } else if (o == t.length) {
    if (s) return null;
    let t = e[e.length - 1];
    t.level != i && ((o = t.side(!0, i)), (a = e.length - 1));
  }
  a < 0 && (a = Zn.find(e, o, null !== (r = n.bidiLevel) && void 0 !== r ? r : -1, n.assoc));
  let l = e[a];
  o == l.side(s, i) && ((l = e[(a += s ? 1 : -1)]), (o = l.side(!s, i)));
  let h = s == (l.dir == i),
    c = it(t.text, o, h);
  if (((zn = t.text.slice(Math.min(o, c), Math.max(o, c))), c != l.side(s, i)))
    return wt.cursor(c + t.from, h ? -1 : 1, l.level);
  let u = a == (s ? e.length - 1 : 0) ? null : e[a + (s ? 1 : -1)];
  return u || l.level == i
    ? u && u.level < l.level
      ? wt.cursor(u.side(!s, i) + t.from, s ? 1 : -1, u.level)
      : wt.cursor(c + t.from, s ? -1 : 1, l.level)
    : wt.cursor(s ? t.to : t.from, s ? -1 : 1, i);
}
class _n {
  constructor(t, e) {
    (this.points = t), (this.text = ''), (this.lineSeparator = e.facet(Oe.lineSeparator));
  }
  append(t) {
    this.text += t;
  }
  lineBreak() {
    this.text += '￿';
  }
  readRange(t, e) {
    if (!t) return this;
    let i = t.parentNode;
    for (let n = t; ; ) {
      this.findPointBefore(i, n), this.readNode(n);
      let t = n.nextSibling;
      if (t == e) break;
      let s = ui.get(n),
        r = ui.get(t);
      (s && r ? s.breakAfter : (s ? s.breakAfter : qn(n)) || (qn(t) && ('BR' != n.nodeName || n.cmIgnore))) &&
        this.lineBreak(),
        (n = t);
    }
    return this.findPointBefore(i, e), this;
  }
  readTextNode(t) {
    let e = t.nodeValue;
    for (let i of this.points) i.node == t && (i.pos = this.text.length + Math.min(i.offset, e.length));
    for (let i = 0, n = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s,
        r = -1,
        o = 1;
      if (
        (this.lineSeparator
          ? ((r = e.indexOf(this.lineSeparator, i)), (o = this.lineSeparator.length))
          : (s = n.exec(e)) && ((r = s.index), (o = s[0].length)),
        this.append(e.slice(i, r < 0 ? e.length : r)),
        r < 0)
      )
        break;
      if ((this.lineBreak(), o > 1))
        for (let e of this.points) e.node == t && e.pos > this.text.length && (e.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(t) {
    if (t.cmIgnore) return;
    let e = ui.get(t),
      i = e && e.overrideDOMText;
    if (null != i) {
      this.findPointInside(t, i.length);
      for (let t = i.iter(); !t.next().done; ) t.lineBreak ? this.lineBreak() : this.append(t.value);
    } else
      3 == t.nodeType
        ? this.readTextNode(t)
        : 'BR' == t.nodeName
        ? t.nextSibling && this.lineBreak()
        : 1 == t.nodeType && this.readRange(t.firstChild, null);
  }
  findPointBefore(t, e) {
    for (let i of this.points) i.node == t && t.childNodes[i.offset] == e && (i.pos = this.text.length);
  }
  findPointInside(t, e) {
    for (let i of this.points)
      (3 == t.nodeType ? i.node == t : t.contains(i.node)) && (i.pos = this.text.length + Math.min(e, i.offset));
  }
}
function qn(t) {
  return 1 == t.nodeType && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName);
}
class En {
  constructor(t, e) {
    (this.node = t), (this.offset = e), (this.pos = -1);
  }
}
class Gn extends ui {
  constructor(t) {
    super(),
      (this.view = t),
      (this.compositionDeco = Ii.none),
      (this.decorations = []),
      (this.dynamicDecorationMap = []),
      (this.minWidth = 0),
      (this.minWidthFrom = 0),
      (this.minWidthTo = 0),
      (this.impreciseAnchor = null),
      (this.impreciseHead = null),
      (this.forceSelection = !1),
      (this.lastUpdate = Date.now()),
      this.setDOM(t.contentDOM),
      (this.children = [new Fi()]),
      this.children[0].setParent(this),
      this.updateDeco(),
      this.updateInner([new vn(0, 0, 0, t.state.doc.length)], 0);
  }
  get editorView() {
    return this.view;
  }
  get length() {
    return this.view.state.doc.length;
  }
  update(t) {
    let e = t.changedRanges;
    this.minWidth > 0 &&
      e.length &&
      (e.every(({ fromA: t, toA: e }) => e < this.minWidthFrom || t > this.minWidthTo)
        ? ((this.minWidthFrom = t.changes.mapPos(this.minWidthFrom, 1)),
          (this.minWidthTo = t.changes.mapPos(this.minWidthTo, 1)))
        : (this.minWidth = this.minWidthFrom = this.minWidthTo = 0)),
      this.view.inputState.composing < 0
        ? (this.compositionDeco = Ii.none)
        : (t.transactions.length || this.dirty) &&
          (this.compositionDeco = (function (t, e) {
            let i = In(t);
            if (!i) return Ii.none;
            let { from: n, to: s, node: r, text: o } = i,
              a = e.mapPos(n, 1),
              l = Math.max(a, e.mapPos(s, -1)),
              { state: h } = t,
              c = 3 == r.nodeType ? r.nodeValue : new _n([], h).readRange(r.firstChild, null).text;
            if (l - a < c.length)
              if (h.doc.sliceString(a, Math.min(h.doc.length, a + c.length), '￿') == c) l = a + c.length;
              else {
                if (h.doc.sliceString(Math.max(0, l - c.length), l, '￿') != c) return Ii.none;
                a = l - c.length;
              }
            else if (h.doc.sliceString(a, l, '￿') != c) return Ii.none;
            let u = ui.get(r);
            u instanceof Xi ? (u = u.widget.topView) : u && (u.parent = null);
            return Ii.set(Ii.replace({ widget: new Nn(r, o, u), inclusive: !0 }).range(a, l));
          })(this.view, t.changes)),
      (Ti.ie || Ti.chrome) &&
        !this.compositionDeco.size &&
        t &&
        t.state.doc.lines != t.startState.doc.lines &&
        (this.forceSelection = !0);
    let i = (function (t, e, i) {
      let n = new Un();
      return Qe.compare(t, e, i, n), n.changes;
    })(this.decorations, this.updateDeco(), t.changes);
    return (
      (e = vn.extendWithRanges(e, i)),
      (0 != this.dirty || 0 != e.length) &&
        (this.updateInner(e, t.startState.doc.length), t.transactions.length && (this.lastUpdate = Date.now()), !0)
    );
  }
  updateInner(t, e) {
    (this.view.viewState.mustMeasureContent = !0), this.updateChildren(t, e);
    let { observer: i } = this.view;
    i.ignore(() => {
      (this.dom.style.height = this.view.viewState.contentHeight + 'px'),
        (this.dom.style.flexBasis = this.minWidth ? this.minWidth + 'px' : '');
      let t = Ti.chrome || Ti.ios ? { node: i.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(t),
        (this.dirty = 0),
        t && (t.written || i.selectionRange.focusNode != t.node) && (this.forceSelection = !0),
        (this.dom.style.height = '');
    });
    let n = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let t of this.children) t instanceof Hi && t.widget instanceof Vn && n.push(t.dom);
    i.updateGaps(n);
  }
  updateChildren(t, e) {
    let i = this.childCursor(e);
    for (let e = t.length - 1; ; e--) {
      let n = e >= 0 ? t[e] : null;
      if (!n) break;
      let { fromA: s, toA: r, fromB: o, toB: a } = n,
        {
          content: l,
          breakAtStart: h,
          openStart: c,
          openEnd: u,
        } = Ji.build(this.view.state.doc, o, a, this.decorations, this.dynamicDecorationMap),
        { i: O, off: f } = i.findPos(r, 1),
        { i: d, off: p } = i.findPos(s, -1);
      di(this, d, p, O, f, l, h, c, u);
    }
  }
  updateSelection(t = !1, e = !1) {
    if (
      ((!t && this.view.observer.selectionRange.focusNode) || this.view.observer.readSelectionRange(),
      (!e && !this.mayControlSelection()) || (Ti.ios && this.view.inputState.rapidCompositionStart))
    )
      return;
    let i = this.forceSelection;
    this.forceSelection = !1;
    let n = this.view.state.selection.main,
      s = this.domAtPos(n.anchor),
      r = n.empty ? s : this.domAtPos(n.head);
    if (
      Ti.gecko &&
      n.empty &&
      1 == (o = s).node.nodeType &&
      o.node.firstChild &&
      (0 == o.offset || 'false' == o.node.childNodes[o.offset - 1].contentEditable) &&
      (o.offset == o.node.childNodes.length || 'false' == o.node.childNodes[o.offset].contentEditable)
    ) {
      let t = document.createTextNode('');
      this.view.observer.ignore(() => s.node.insertBefore(t, s.node.childNodes[s.offset] || null)),
        (s = r = new hi(t, 0)),
        (i = !0);
    }
    var o;
    let a = this.view.observer.selectionRange;
    (!i &&
      a.focusNode &&
      Ye(s.node, s.offset, a.anchorNode, a.anchorOffset) &&
      Ye(r.node, r.offset, a.focusNode, a.focusOffset)) ||
      (this.view.observer.ignore(() => {
        Ti.android &&
          Ti.chrome &&
          this.dom.contains(a.focusNode) &&
          (function (t, e) {
            for (let i = t; i && i != e; i = i.assignedSlot || i.parentNode)
              if (1 == i.nodeType && 'false' == i.contentEditable) return !0;
            return !1;
          })(a.focusNode, this.dom) &&
          (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
        let t = Ne(this.view.root);
        if (t)
          if (n.empty) {
            if (Ti.gecko) {
              let t =
                ((e = s.node),
                (i = s.offset),
                1 != e.nodeType
                  ? 0
                  : (i && 'false' == e.childNodes[i - 1].contentEditable ? 1 : 0) |
                    (i < e.childNodes.length && 'false' == e.childNodes[i].contentEditable ? 2 : 0));
              if (t && 3 != t) {
                let e = Ln(s.node, s.offset, 1 == t ? 1 : -1);
                e && (s = new hi(e, 1 == t ? 0 : e.nodeValue.length));
              }
            }
            t.collapse(s.node, s.offset),
              null != n.bidiLevel && null != a.cursorBidiLevel && (a.cursorBidiLevel = n.bidiLevel);
          } else if (t.extend) t.collapse(s.node, s.offset), t.extend(r.node, r.offset);
          else {
            let e = document.createRange();
            n.anchor > n.head && ([s, r] = [r, s]),
              e.setEnd(r.node, r.offset),
              e.setStart(s.node, s.offset),
              t.removeAllRanges(),
              t.addRange(e);
          }
        else;
        var e, i;
      }),
      this.view.observer.setSelectionRange(s, r)),
      (this.impreciseAnchor = s.precise ? null : new hi(a.anchorNode, a.anchorOffset)),
      (this.impreciseHead = r.precise ? null : new hi(a.focusNode, a.focusOffset));
  }
  enforceCursorAssoc() {
    if (this.compositionDeco.size) return;
    let t = this.view.state.selection.main,
      e = Ne(this.view.root);
    if (!(e && t.empty && t.assoc && e.modify)) return;
    let i = Fi.find(this, t.head);
    if (!i) return;
    let n = i.posAtStart;
    if (t.head == n || t.head == n + i.length) return;
    let s = this.coordsAt(t.head, -1),
      r = this.coordsAt(t.head, 1);
    if (!s || !r || s.bottom > r.top) return;
    let o = this.domAtPos(t.head + t.assoc);
    e.collapse(o.node, o.offset), e.modify('move', t.assoc < 0 ? 'forward' : 'backward', 'lineboundary');
  }
  mayControlSelection() {
    let t = this.view.root.activeElement;
    return t == this.dom || (Ue(this.dom, this.view.observer.selectionRange) && !(t && this.dom.contains(t)));
  }
  nearest(t) {
    for (let e = t; e; ) {
      let t = ui.get(e);
      if (t && t.rootView == this) return t;
      e = e.parentNode;
    }
    return null;
  }
  posFromDOM(t, e) {
    let i = this.nearest(t);
    if (!i) throw new RangeError('Trying to find position for a DOM position outside of the document');
    return i.localPosFromDOM(t, e) + i.posAtStart;
  }
  domAtPos(t) {
    let { i: e, off: i } = this.childCursor().findPos(t, -1);
    for (; e < this.children.length - 1; ) {
      let t = this.children[e];
      if (i < t.length || t instanceof Fi) break;
      e++, (i = 0);
    }
    return this.children[e].domAtPos(i);
  }
  coordsAt(t, e) {
    for (let i = this.length, n = this.children.length - 1; ; n--) {
      let s = this.children[n],
        r = i - s.breakAfter - s.length;
      if (
        t > r ||
        (t == r &&
          s.type != Vi.WidgetBefore &&
          s.type != Vi.WidgetAfter &&
          (!n || 2 == e || this.children[n - 1].breakAfter || (this.children[n - 1].type == Vi.WidgetBefore && e > -2)))
      )
        return s.coordsAt(t - r, e);
      i = r;
    }
  }
  measureVisibleLineHeights(t) {
    let e = [],
      { from: i, to: n } = t,
      s = this.view.contentDOM.clientWidth,
      r = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1,
      o = -1,
      a = this.view.textDirection == kn.LTR;
    for (let t = 0, l = 0; l < this.children.length; l++) {
      let h = this.children[l],
        c = t + h.length;
      if (c > n) break;
      if (t >= i) {
        let i = h.dom.getBoundingClientRect();
        if ((e.push(i.height), r)) {
          let e = h.dom.lastChild,
            n = e ? Be(e) : [];
          if (n.length) {
            let e = n[n.length - 1],
              r = a ? e.right - i.left : i.right - e.left;
            r > o && ((o = r), (this.minWidth = s), (this.minWidthFrom = t), (this.minWidthTo = c));
          }
        }
      }
      t = c + h.breakAfter;
    }
    return e;
  }
  textDirectionAt(t) {
    let { i: e } = this.childPos(t, 1);
    return 'rtl' == getComputedStyle(this.children[e].dom).direction ? kn.RTL : kn.LTR;
  }
  measureTextSize() {
    for (let t of this.children)
      if (t instanceof Fi) {
        let e = t.measureTextSize();
        if (e) return e;
      }
    let t,
      e,
      i = document.createElement('div');
    return (
      (i.className = 'cm-line'),
      (i.style.width = '99999px'),
      (i.textContent = 'abc def ghi jkl mno pqr stu'),
      this.view.observer.ignore(() => {
        this.dom.appendChild(i);
        let n = Be(i.firstChild)[0];
        (t = i.getBoundingClientRect().height), (e = n ? n.width / 27 : 7), i.remove();
      }),
      { lineHeight: t, charWidth: e }
    );
  }
  childCursor(t = this.length) {
    let e = this.children.length;
    return e && (t -= this.children[--e].length), new fi(this.children, t, e);
  }
  computeBlockGapDeco() {
    let t = [],
      e = this.view.viewState;
    for (let i = 0, n = 0; ; n++) {
      let s = n == e.viewports.length ? null : e.viewports[n],
        r = s ? s.from - 1 : this.length;
      if (r > i) {
        let n = e.lineBlockAt(r).bottom - e.lineBlockAt(i).top;
        t.push(Ii.replace({ widget: new Vn(n), block: !0, inclusive: !0, isBlockGap: !0 }).range(i, r));
      }
      if (!s) break;
      i = s.to + 1;
    }
    return Ii.set(t);
  }
  updateDeco() {
    let t = this.view.state
      .facet(bn)
      .map((t, e) => ((this.dynamicDecorationMap[e] = 'function' == typeof t) ? t(this.view) : t));
    for (let e = t.length; e < t.length + 3; e++) this.dynamicDecorationMap[e] = !1;
    return (this.decorations = [
      ...t,
      this.compositionDeco,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco,
    ]);
  }
  scrollIntoView(t) {
    let e,
      { range: i } = t,
      n = this.coordsAt(i.head, i.empty ? i.assoc : i.head > i.anchor ? -1 : 1);
    if (!n) return;
    !i.empty &&
      (e = this.coordsAt(i.anchor, i.anchor > i.head ? -1 : 1)) &&
      (n = {
        left: Math.min(n.left, e.left),
        top: Math.min(n.top, e.top),
        right: Math.max(n.right, e.right),
        bottom: Math.max(n.bottom, e.bottom),
      });
    let s = 0,
      r = 0,
      o = 0,
      a = 0;
    for (let t of this.view.state.facet(wn).map((t) => t(this.view)))
      if (t) {
        let { left: e, right: i, top: n, bottom: l } = t;
        null != e && (s = Math.max(s, e)),
          null != i && (r = Math.max(r, i)),
          null != n && (o = Math.max(o, n)),
          null != l && (a = Math.max(a, l));
      }
    let l = { left: n.left - s, top: n.top - o, right: n.right + r, bottom: n.bottom + a };
    !(function (t, e, i, n, s, r, o, a) {
      let l = t.ownerDocument,
        h = l.defaultView;
      for (let c = t; c; )
        if (1 == c.nodeType) {
          let t,
            u = c == l.body;
          if (u) t = ei(h);
          else {
            if (c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
              c = c.parentNode;
              continue;
            }
            let e = c.getBoundingClientRect();
            t = { left: e.left, right: e.left + c.clientWidth, top: e.top, bottom: e.top + c.clientHeight };
          }
          let O = 0,
            f = 0;
          if ('nearest' == s)
            e.top < t.top
              ? ((f = -(t.top - e.top + o)), i > 0 && e.bottom > t.bottom + f && (f = e.bottom - t.bottom + f + o))
              : e.bottom > t.bottom &&
                ((f = e.bottom - t.bottom + o), i < 0 && e.top - f < t.top && (f = -(t.top + f - e.top + o)));
          else {
            let n = e.bottom - e.top,
              r = t.bottom - t.top;
            f =
              ('center' == s && n <= r
                ? e.top + n / 2 - r / 2
                : 'start' == s || ('center' == s && i < 0)
                ? e.top - o
                : e.bottom - r + o) - t.top;
          }
          if (
            ('nearest' == n
              ? e.left < t.left
                ? ((O = -(t.left - e.left + r)), i > 0 && e.right > t.right + O && (O = e.right - t.right + O + r))
                : e.right > t.right &&
                  ((O = e.right - t.right + r), i < 0 && e.left < t.left + O && (O = -(t.left + O - e.left + r)))
              : (O =
                  ('center' == n
                    ? e.left + (e.right - e.left) / 2 - (t.right - t.left) / 2
                    : ('start' == n) == a
                    ? e.left - r
                    : e.right - (t.right - t.left) + r) - t.left),
            O || f)
          )
            if (u) h.scrollBy(O, f);
            else {
              if (f) {
                let t = c.scrollTop;
                (c.scrollTop += f), (f = c.scrollTop - t);
              }
              if (O) {
                let t = c.scrollLeft;
                (c.scrollLeft += O), (O = c.scrollLeft - t);
              }
              e = { left: e.left - O, top: e.top - f, right: e.right - O, bottom: e.bottom - f };
            }
          if (u) break;
          (c = c.assignedSlot || c.parentNode), (n = s = 'nearest');
        } else {
          if (11 != c.nodeType) break;
          c = c.host;
        }
    })(
      this.view.scrollDOM,
      l,
      i.head < i.anchor ? -1 : 1,
      t.x,
      t.y,
      t.xMargin,
      t.yMargin,
      this.view.textDirection == kn.LTR,
    );
  }
}
class Vn extends Gi {
  constructor(t) {
    super(), (this.height = t);
  }
  toDOM() {
    let t = document.createElement('div');
    return this.updateDOM(t), t;
  }
  eq(t) {
    return t.height == this.height;
  }
  updateDOM(t) {
    return (t.style.height = this.height + 'px'), !0;
  }
  get estimatedHeight() {
    return this.height;
  }
}
function In(t) {
  let e = t.observer.selectionRange,
    i = e.focusNode && Ln(e.focusNode, e.focusOffset, 0);
  if (!i) return null;
  let n = t.docView.nearest(i);
  if (!n) return null;
  if (n instanceof Fi) {
    let t = i;
    for (; t.parentNode != n.dom; ) t = t.parentNode;
    let e = t.previousSibling;
    for (; e && !ui.get(e); ) e = e.previousSibling;
    let s = e ? ui.get(e).posAtEnd : n.posAtStart;
    return { from: s, to: s, node: t, text: i };
  }
  {
    for (;;) {
      let { parent: t } = n;
      if (!t) return null;
      if (t instanceof Fi) break;
      n = t;
    }
    let t = n.posAtStart;
    return { from: t, to: t + n.length, node: n.dom, text: i };
  }
}
class Nn extends Gi {
  constructor(t, e, i) {
    super(), (this.top = t), (this.text = e), (this.topView = i);
  }
  eq(t) {
    return this.top == t.top && this.text == t.text;
  }
  toDOM() {
    return this.top;
  }
  ignoreEvent() {
    return !1;
  }
  get customView() {
    return Xi;
  }
}
function Ln(t, e, i) {
  for (;;) {
    if (3 == t.nodeType) return t;
    if (1 == t.nodeType && e > 0 && i <= 0) e = Je((t = t.childNodes[e - 1]));
    else {
      if (!(1 == t.nodeType && e < t.childNodes.length && i >= 0)) return null;
      (t = t.childNodes[e]), (e = 0);
    }
  }
}
class Un {
  constructor() {
    this.changes = [];
  }
  compareRange(t, e) {
    Yi(t, e, this.changes);
  }
  comparePoint(t, e) {
    Yi(t, e, this.changes);
  }
}
function Bn(t, e) {
  return e.left > t ? e.left - t : Math.max(0, t - e.right);
}
function Yn(t, e) {
  return e.top > t ? e.top - t : Math.max(0, t - e.bottom);
}
function Fn(t, e) {
  return t.top < e.bottom - 1 && t.bottom > e.top + 1;
}
function Hn(t, e) {
  return e < t.top ? { top: e, left: t.left, right: t.right, bottom: t.bottom } : t;
}
function Jn(t, e) {
  return e > t.bottom ? { top: t.top, left: t.left, right: t.right, bottom: e } : t;
}
function Kn(t, e, i) {
  let n,
    s,
    r,
    o,
    a,
    l,
    h,
    c,
    u = !1;
  for (let O = t.firstChild; O; O = O.nextSibling) {
    let t = Be(O);
    for (let f = 0; f < t.length; f++) {
      let d = t[f];
      s && Fn(s, d) && (d = Hn(Jn(d, s.bottom), s.top));
      let p = Bn(e, d),
        g = Yn(i, d);
      if (0 == p && 0 == g) return 3 == O.nodeType ? ts(O, e, i) : Kn(O, e, i);
      (!n || o > g || (o == g && r > p)) &&
        ((n = O), (s = d), (r = p), (o = g), (u = !p || (p > 0 ? f < t.length - 1 : f > 0))),
        0 == p
          ? i > d.bottom && (!h || h.bottom < d.bottom)
            ? ((a = O), (h = d))
            : i < d.top && (!c || c.top > d.top) && ((l = O), (c = d))
          : h && Fn(h, d)
          ? (h = Jn(h, d.bottom))
          : c && Fn(c, d) && (c = Hn(c, d.top));
    }
  }
  if ((h && h.bottom >= i ? ((n = a), (s = h)) : c && c.top <= i && ((n = l), (s = c)), !n))
    return { node: t, offset: 0 };
  let O = Math.max(s.left, Math.min(s.right, e));
  return 3 == n.nodeType
    ? ts(n, O, i)
    : u && 'false' != n.contentEditable
    ? Kn(n, O, i)
    : { node: t, offset: Array.prototype.indexOf.call(t.childNodes, n) + (e >= (s.left + s.right) / 2 ? 1 : 0) };
}
function ts(t, e, i) {
  let n = t.nodeValue.length,
    s = -1,
    r = 1e9,
    o = 0;
  for (let a = 0; a < n; a++) {
    let n = oi(t, a, a + 1).getClientRects();
    for (let l = 0; l < n.length; l++) {
      let h = n[l];
      if (h.top == h.bottom) continue;
      o || (o = e - h.left);
      let c = (h.top > i ? h.top - i : i - h.bottom) - 1;
      if (h.left - 1 <= e && h.right + 1 >= e && c < r) {
        let i = e >= (h.left + h.right) / 2,
          n = i;
        if (Ti.chrome || Ti.gecko) {
          oi(t, a).getBoundingClientRect().left == h.right && (n = !i);
        }
        if (c <= 0) return { node: t, offset: a + (n ? 1 : 0) };
        (s = a + (n ? 1 : 0)), (r = c);
      }
    }
  }
  return { node: t, offset: s > -1 ? s : o > 0 ? t.nodeValue.length : 0 };
}
function es(t, { x: e, y: i }, n, s = -1) {
  var r;
  let o,
    a = t.contentDOM.getBoundingClientRect(),
    l = a.top + t.viewState.paddingTop,
    { docHeight: h } = t.viewState,
    c = i - l;
  if (c < 0) return 0;
  if (c > h) return t.state.doc.length;
  for (let e = t.defaultLineHeight / 2, i = !1; (o = t.elementAtHeight(c)), o.type != Vi.Text; )
    for (; (c = s > 0 ? o.bottom + e : o.top - e), !(c >= 0 && c <= h); ) {
      if (i) return n ? null : 0;
      (i = !0), (s = -s);
    }
  i = l + c;
  let u = o.from;
  if (u < t.viewport.from) return 0 == t.viewport.from ? 0 : n ? null : is(t, a, o, e, i);
  if (u > t.viewport.to) return t.viewport.to == t.state.doc.length ? t.state.doc.length : n ? null : is(t, a, o, e, i);
  let O = t.dom.ownerDocument,
    f = t.root.elementFromPoint ? t.root : O,
    d = f.elementFromPoint(e, i);
  d && !t.contentDOM.contains(d) && (d = null),
    d ||
      ((e = Math.max(a.left + 1, Math.min(a.right - 1, e))),
      (d = f.elementFromPoint(e, i)),
      d && !t.contentDOM.contains(d) && (d = null));
  let p,
    g = -1;
  if (d && 0 != (null === (r = t.docView.nearest(d)) || void 0 === r ? void 0 : r.isEditable))
    if (O.caretPositionFromPoint) {
      let t = O.caretPositionFromPoint(e, i);
      t && ({ offsetNode: p, offset: g } = t);
    } else if (O.caretRangeFromPoint) {
      let n = O.caretRangeFromPoint(e, i);
      n &&
        (({ startContainer: p, startOffset: g } = n),
        (!t.contentDOM.contains(p) ||
          (Ti.safari &&
            (function (t, e, i) {
              let n;
              if (3 != t.nodeType || e != (n = t.nodeValue.length)) return !1;
              for (let e = t.nextSibling; e; e = e.nextSibling) if (1 != e.nodeType || 'BR' != e.nodeName) return !1;
              return oi(t, n - 1, n).getBoundingClientRect().left > i;
            })(p, g, e)) ||
          (Ti.chrome &&
            (function (t, e, i) {
              if (0 != e) return !1;
              for (let e = t; ; ) {
                let t = e.parentNode;
                if (!t || 1 != t.nodeType || t.firstChild != e) return !1;
                if (t.classList.contains('cm-line')) break;
                e = t;
              }
              let n =
                1 == t.nodeType
                  ? t.getBoundingClientRect()
                  : oi(t, 0, Math.max(t.nodeValue.length, 1)).getBoundingClientRect();
              return i - n.left > 5;
            })(p, g, e))) &&
          (p = void 0));
    }
  if (!p || !t.docView.dom.contains(p)) {
    let n = Fi.find(t.docView, u);
    if (!n) return c > o.top + o.height / 2 ? o.to : o.from;
    ({ node: p, offset: g } = Kn(n.dom, e, i));
  }
  return t.docView.posFromDOM(p, g);
}
function is(t, e, i, n, s) {
  let r = Math.round((n - e.left) * t.defaultCharacterWidth);
  if (t.lineWrapping && i.height > 1.5 * t.defaultLineHeight) {
    r += Math.floor((s - i.top) / t.defaultLineHeight) * t.viewState.heightOracle.lineLength;
  }
  let o = t.state.sliceDoc(i.from, i.to);
  return (
    i.from +
    (function (t, e, i, n) {
      for (let n = 0, s = 0; ; ) {
        if (s >= e) return n;
        if (n == t.length) break;
        (s += 9 == t.charCodeAt(n) ? i - (s % i) : 1), (n = it(t, n));
      }
      return !0 === n ? -1 : t.length;
    })(o, r, t.state.tabSize)
  );
}
function ns(t, e, i, n) {
  let s = t.state.doc.lineAt(e.head),
    r = t.bidiSpans(s),
    o = t.textDirectionAt(s.from);
  for (let a = e, l = null; ; ) {
    let e = Mn(s, r, o, a, i),
      h = zn;
    if (!e) {
      if (s.number == (i ? t.state.doc.lines : 1)) return a;
      (h = '\n'),
        (s = t.state.doc.line(s.number + (i ? 1 : -1))),
        (r = t.bidiSpans(s)),
        (e = wt.cursor(i ? s.from : s.to));
    }
    if (l) {
      if (!l(h)) return a;
    } else {
      if (!n) return e;
      l = n(h);
    }
    a = e;
  }
}
function ss(t, e, i) {
  let n = t.state.facet(yn).map((e) => e(t));
  for (;;) {
    let t = !1;
    for (let s of n)
      s.between(i.from - 1, i.from + 1, (n, s, r) => {
        i.from > n && i.from < s && ((i = e.from > i.from ? wt.cursor(n, 1) : wt.cursor(s, -1)), (t = !0));
      });
    if (!t) return i;
  }
}
class rs {
  constructor(t) {
    (this.lastKeyCode = 0),
      (this.lastKeyTime = 0),
      (this.lastTouchTime = 0),
      (this.lastFocusTime = 0),
      (this.lastScrollTop = 0),
      (this.lastScrollLeft = 0),
      (this.chromeScrollHack = -1),
      (this.pendingIOSKey = void 0),
      (this.lastSelectionOrigin = null),
      (this.lastSelectionTime = 0),
      (this.lastEscPress = 0),
      (this.lastContextMenu = 0),
      (this.scrollHandlers = []),
      (this.registeredEvents = []),
      (this.customHandlers = []),
      (this.composing = -1),
      (this.compositionFirstChange = null),
      (this.compositionEndedAt = 0),
      (this.rapidCompositionStart = !1),
      (this.mouseSelection = null);
    for (let e in cs) {
      let i = cs[e];
      t.contentDOM.addEventListener(
        e,
        (n) => {
          hs(t, n) &&
            !this.ignoreDuringComposition(n) &&
            (('keydown' == e && this.keydown(t, n)) ||
              (this.mustFlushObserver(n) && t.observer.forceFlush(),
              this.runCustomHandlers(e, t, n) ? n.preventDefault() : i(t, n)));
        },
        us[e],
      ),
        this.registeredEvents.push(e);
    }
    Ti.chrome &&
      102 == Ti.chrome_version &&
      t.scrollDOM.addEventListener(
        'wheel',
        () => {
          this.chromeScrollHack < 0
            ? (t.contentDOM.style.pointerEvents = 'none')
            : window.clearTimeout(this.chromeScrollHack),
            (this.chromeScrollHack = setTimeout(() => {
              (this.chromeScrollHack = -1), (t.contentDOM.style.pointerEvents = '');
            }, 100));
        },
        { passive: !0 },
      ),
      (this.notifiedFocused = t.hasFocus),
      Ti.safari && t.contentDOM.addEventListener('input', () => null);
  }
  setSelectionOrigin(t) {
    (this.lastSelectionOrigin = t), (this.lastSelectionTime = Date.now());
  }
  ensureHandlers(t, e) {
    var i;
    let n;
    this.customHandlers = [];
    for (let s of e)
      if ((n = null === (i = s.update(t).spec) || void 0 === i ? void 0 : i.domEventHandlers)) {
        this.customHandlers.push({ plugin: s.value, handlers: n });
        for (let e in n)
          this.registeredEvents.indexOf(e) < 0 &&
            'scroll' != e &&
            (this.registeredEvents.push(e),
            t.contentDOM.addEventListener(e, (i) => {
              hs(t, i) && this.runCustomHandlers(e, t, i) && i.preventDefault();
            }));
      }
  }
  runCustomHandlers(t, e, i) {
    for (let n of this.customHandlers) {
      let s = n.handlers[t];
      if (s)
        try {
          if (s.call(n.plugin, i, e) || i.defaultPrevented) return !0;
        } catch (t) {
          un(e.state, t);
        }
    }
    return !1;
  }
  runScrollHandlers(t, e) {
    (this.lastScrollTop = t.scrollDOM.scrollTop), (this.lastScrollLeft = t.scrollDOM.scrollLeft);
    for (let i of this.customHandlers) {
      let n = i.handlers.scroll;
      if (n)
        try {
          n.call(i.plugin, e, t);
        } catch (e) {
          un(t.state, e);
        }
    }
  }
  keydown(t, e) {
    if (
      ((this.lastKeyCode = e.keyCode),
      (this.lastKeyTime = Date.now()),
      9 == e.keyCode && Date.now() < this.lastEscPress + 2e3)
    )
      return !0;
    if (Ti.android && Ti.chrome && !e.synthetic && (13 == e.keyCode || 8 == e.keyCode))
      return t.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let i;
    return (
      !(
        !Ti.ios ||
        !(i = os.find((t) => t.keyCode == e.keyCode)) ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.synthetic
      ) && ((this.pendingIOSKey = i), setTimeout(() => this.flushIOSKey(t), 250), !0)
    );
  }
  flushIOSKey(t) {
    let e = this.pendingIOSKey;
    return !!e && ((this.pendingIOSKey = void 0), ai(t.contentDOM, e.key, e.keyCode));
  }
  ignoreDuringComposition(t) {
    return (
      !!/^key/.test(t.type) &&
      (this.composing > 0 ||
        (!!(Ti.safari && !Ti.ios && Date.now() - this.compositionEndedAt < 100) && ((this.compositionEndedAt = 0), !0)))
    );
  }
  mustFlushObserver(t) {
    return ('keydown' == t.type && 229 != t.keyCode) || ('compositionend' == t.type && !Ti.ios);
  }
  startMouseSelection(t) {
    this.mouseSelection && this.mouseSelection.destroy(), (this.mouseSelection = t);
  }
  update(t) {
    this.mouseSelection && this.mouseSelection.update(t),
      t.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
const os = [
    { key: 'Backspace', keyCode: 8, inputType: 'deleteContentBackward' },
    { key: 'Enter', keyCode: 13, inputType: 'insertParagraph' },
    { key: 'Delete', keyCode: 46, inputType: 'deleteContentForward' },
  ],
  as = [16, 17, 18, 20, 91, 92, 224, 225];
class ls {
  constructor(t, e, i, n) {
    (this.view = t), (this.style = i), (this.mustSelect = n), (this.lastEvent = e);
    let s = t.contentDOM.ownerDocument;
    s.addEventListener('mousemove', (this.move = this.move.bind(this))),
      s.addEventListener('mouseup', (this.up = this.up.bind(this))),
      (this.extend = e.shiftKey),
      (this.multiple =
        t.state.facet(Oe.allowMultipleSelections) &&
        (function (t, e) {
          let i = t.state.facet(en);
          return i.length ? i[0](e) : Ti.mac ? e.metaKey : e.ctrlKey;
        })(t, e)),
      (this.dragMove = (function (t, e) {
        let i = t.state.facet(nn);
        return i.length ? i[0](e) : Ti.mac ? !e.altKey : !e.ctrlKey;
      })(t, e)),
      (this.dragging =
        !(
          !(function (t, e) {
            let { main: i } = t.state.selection;
            if (i.empty) return !1;
            let n = Ne(t.root);
            if (!n || 0 == n.rangeCount) return !0;
            let s = n.getRangeAt(0).getClientRects();
            for (let t = 0; t < s.length; t++) {
              let i = s[t];
              if (i.left <= e.clientX && i.right >= e.clientX && i.top <= e.clientY && i.bottom >= e.clientY) return !0;
            }
            return !1;
          })(t, e) || 1 != vs(e)
        ) && null),
      !1 === this.dragging && (e.preventDefault(), this.select(e));
  }
  move(t) {
    if (0 == t.buttons) return this.destroy();
    !1 === this.dragging && this.select((this.lastEvent = t));
  }
  up(t) {
    null == this.dragging && this.select(this.lastEvent), this.dragging || t.preventDefault(), this.destroy();
  }
  destroy() {
    let t = this.view.contentDOM.ownerDocument;
    t.removeEventListener('mousemove', this.move),
      t.removeEventListener('mouseup', this.up),
      (this.view.inputState.mouseSelection = null);
  }
  select(t) {
    let e = this.style.get(t, this.extend, this.multiple);
    (!this.mustSelect && e.eq(this.view.state.selection) && e.main.assoc == this.view.state.selection.main.assoc) ||
      this.view.dispatch({ selection: e, userEvent: 'select.pointer', scrollIntoView: !0 }),
      (this.mustSelect = !1);
  }
  update(t) {
    t.docChanged && this.dragging && (this.dragging = this.dragging.map(t.changes)),
      this.style.update(t) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function hs(t, e) {
  if (!e.bubbles) return !0;
  if (e.defaultPrevented) return !1;
  for (let i, n = e.target; n != t.contentDOM; n = n.parentNode)
    if (!n || 11 == n.nodeType || ((i = ui.get(n)) && i.ignoreEvent(e))) return !1;
  return !0;
}
const cs = Object.create(null),
  us = Object.create(null),
  Os = (Ti.ie && Ti.ie_version < 15) || (Ti.ios && Ti.webkit_version < 604);
function fs(t, e) {
  let i,
    { state: n } = t,
    s = 1,
    r = n.toText(e),
    o = r.lines == n.selection.ranges.length;
  if (null != ks && n.selection.ranges.every((t) => t.empty) && ks == r.toString()) {
    let t = -1;
    i = n.changeByRange((i) => {
      let a = n.doc.lineAt(i.from);
      if (a.from == t) return { range: i };
      t = a.from;
      let l = n.toText((o ? r.line(s++).text : e) + n.lineBreak);
      return { changes: { from: a.from, insert: l }, range: wt.cursor(i.from + l.length) };
    });
  } else
    i = o
      ? n.changeByRange((t) => {
          let e = r.line(s++);
          return { changes: { from: t.from, to: t.to, insert: e.text }, range: wt.cursor(t.from + e.length) };
        })
      : n.replaceSelection(r);
  t.dispatch(i, { userEvent: 'input.paste', scrollIntoView: !0 });
}
function ds(t, e, i, n) {
  if (1 == n) return wt.cursor(e, i);
  if (2 == n)
    return (function (t, e, i = 1) {
      let n = t.charCategorizer(e),
        s = t.doc.lineAt(e),
        r = e - s.from;
      if (0 == s.length) return wt.cursor(e);
      0 == r ? (i = 1) : r == s.length && (i = -1);
      let o = r,
        a = r;
      i < 0 ? (o = it(s.text, r, !1)) : (a = it(s.text, r));
      let l = n(s.text.slice(o, a));
      for (; o > 0; ) {
        let t = it(s.text, o, !1);
        if (n(s.text.slice(t, o)) != l) break;
        o = t;
      }
      for (; a < s.length; ) {
        let t = it(s.text, a);
        if (n(s.text.slice(a, t)) != l) break;
        a = t;
      }
      return wt.range(o + s.from, a + s.from);
    })(t.state, e, i);
  {
    let i = Fi.find(t.docView, e),
      n = t.state.doc.lineAt(i ? i.posAtEnd : e),
      s = i ? i.posAtStart : n.from,
      r = i ? i.posAtEnd : n.to;
    return r < t.state.doc.length && r == n.to && r++, wt.range(s, r);
  }
}
(cs.keydown = (t, e) => {
  t.inputState.setSelectionOrigin('select'),
    27 == e.keyCode
      ? (t.inputState.lastEscPress = Date.now())
      : as.indexOf(e.keyCode) < 0 && (t.inputState.lastEscPress = 0);
}),
  (cs.touchstart = (t, e) => {
    (t.inputState.lastTouchTime = Date.now()), t.inputState.setSelectionOrigin('select.pointer');
  }),
  (cs.touchmove = (t) => {
    t.inputState.setSelectionOrigin('select.pointer');
  }),
  (us.touchstart = us.touchmove = { passive: !0 }),
  (cs.mousedown = (t, e) => {
    if ((t.observer.flush(), t.inputState.lastTouchTime > Date.now() - 2e3 && 1 == vs(e))) return;
    let i = null;
    for (let n of t.state.facet(sn)) if (((i = n(t, e)), i)) break;
    if (
      (i ||
        0 != e.button ||
        (i = (function (t, e) {
          let i = Qs(t, e),
            n = vs(e),
            s = t.state.selection,
            r = i,
            o = e;
          return {
            update(t) {
              t.docChanged && (i && (i.pos = t.changes.mapPos(i.pos)), (s = s.map(t.changes)), (o = null));
            },
            get(e, a, l) {
              let h;
              if (
                (o && e.clientX == o.clientX && e.clientY == o.clientY ? (h = r) : ((h = r = Qs(t, e)), (o = e)),
                !h || !i)
              )
                return s;
              let c = ds(t, h.pos, h.bias, n);
              if (i.pos != h.pos && !a) {
                let e = ds(t, i.pos, i.bias, n),
                  s = Math.min(e.from, c.from),
                  r = Math.max(e.to, c.to);
                c = s < c.from ? wt.range(s, r) : wt.range(r, s);
              }
              return a
                ? s.replaceRange(s.main.extend(c.from, c.to))
                : l && s.ranges.length > 1 && s.ranges.some((t) => t.eq(c))
                ? (function (t, e) {
                    for (let i = 0; ; i++)
                      if (t.ranges[i].eq(e))
                        return wt.create(
                          t.ranges.slice(0, i).concat(t.ranges.slice(i + 1)),
                          t.mainIndex == i ? 0 : t.mainIndex - (t.mainIndex > i ? 1 : 0),
                        );
                  })(s, c)
                : l
                ? s.addRange(c)
                : wt.create([c]);
            },
          };
        })(t, e)),
      i)
    ) {
      let n = t.root.activeElement != t.contentDOM;
      n && t.observer.ignore(() => ri(t.contentDOM)), t.inputState.startMouseSelection(new ls(t, e, i, n));
    }
  });
let ps = (t, e) => t >= e.top && t <= e.bottom,
  gs = (t, e, i) => ps(e, i) && t >= i.left && t <= i.right;
function ms(t, e, i, n) {
  let s = Fi.find(t.docView, e);
  if (!s) return 1;
  let r = e - s.posAtStart;
  if (0 == r) return 1;
  if (r == s.length) return -1;
  let o = s.coordsAt(r, -1);
  if (o && gs(i, n, o)) return -1;
  let a = s.coordsAt(r, 1);
  return a && gs(i, n, a) ? 1 : o && ps(n, o) ? -1 : 1;
}
function Qs(t, e) {
  let i = t.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: i, bias: ms(t, i, e.clientX, e.clientY) };
}
const bs = Ti.ie && Ti.ie_version <= 11;
let ys = null,
  ws = 0,
  xs = 0;
function vs(t) {
  if (!bs) return t.detail;
  let e = ys,
    i = xs;
  return (
    (ys = t),
    (xs = Date.now()),
    (ws =
      !e || (i > Date.now() - 400 && Math.abs(e.clientX - t.clientX) < 2 && Math.abs(e.clientY - t.clientY) < 2)
        ? (ws + 1) % 3
        : 1)
  );
}
function Ss(t, e, i, n) {
  if (!i) return;
  let s = t.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  e.preventDefault();
  let { mouseSelection: r } = t.inputState,
    o = n && r && r.dragging && r.dragMove ? { from: r.dragging.from, to: r.dragging.to } : null,
    a = { from: s, insert: i },
    l = t.state.changes(o ? [o, a] : a);
  t.focus(),
    t.dispatch({
      changes: l,
      selection: { anchor: l.mapPos(s, -1), head: l.mapPos(s, 1) },
      userEvent: o ? 'move.drop' : 'input.drop',
    });
}
(cs.dragstart = (t, e) => {
  let {
      selection: { main: i },
    } = t.state,
    { mouseSelection: n } = t.inputState;
  n && (n.dragging = i),
    e.dataTransfer &&
      (e.dataTransfer.setData('Text', t.state.sliceDoc(i.from, i.to)), (e.dataTransfer.effectAllowed = 'copyMove'));
}),
  (cs.drop = (t, e) => {
    if (!e.dataTransfer) return;
    if (t.state.readOnly) return e.preventDefault();
    let i = e.dataTransfer.files;
    if (i && i.length) {
      e.preventDefault();
      let n = Array(i.length),
        s = 0,
        r = () => {
          ++s == i.length && Ss(t, e, n.filter((t) => null != t).join(t.state.lineBreak), !1);
        };
      for (let t = 0; t < i.length; t++) {
        let e = new FileReader();
        (e.onerror = r),
          (e.onload = () => {
            /[\x00-\x08\x0e-\x1f]{2}/.test(e.result) || (n[t] = e.result), r();
          }),
          e.readAsText(i[t]);
      }
    } else Ss(t, e, e.dataTransfer.getData('Text'), !0);
  }),
  (cs.paste = (t, e) => {
    if (t.state.readOnly) return e.preventDefault();
    t.observer.flush();
    let i = Os ? null : e.clipboardData;
    i
      ? (fs(t, i.getData('text/plain')), e.preventDefault())
      : (function (t) {
          let e = t.dom.parentNode;
          if (!e) return;
          let i = e.appendChild(document.createElement('textarea'));
          (i.style.cssText = 'position: fixed; left: -10000px; top: 10px'),
            i.focus(),
            setTimeout(() => {
              t.focus(), i.remove(), fs(t, i.value);
            }, 50);
        })(t);
  });
let ks = null;
function $s(t) {
  setTimeout(() => {
    t.hasFocus != t.inputState.notifiedFocused && t.update([]);
  }, 10);
}
function Ts(t, e) {
  if (t.docView.compositionDeco.size) {
    t.inputState.rapidCompositionStart = e;
    try {
      t.update([]);
    } finally {
      t.inputState.rapidCompositionStart = !1;
    }
  }
}
(cs.copy = cs.cut =
  (t, e) => {
    let {
      text: i,
      ranges: n,
      linewise: s,
    } = (function (t) {
      let e = [],
        i = [],
        n = !1;
      for (let n of t.selection.ranges) n.empty || (e.push(t.sliceDoc(n.from, n.to)), i.push(n));
      if (!e.length) {
        let s = -1;
        for (let { from: n } of t.selection.ranges) {
          let r = t.doc.lineAt(n);
          r.number > s && (e.push(r.text), i.push({ from: r.from, to: Math.min(t.doc.length, r.to + 1) })),
            (s = r.number);
        }
        n = !0;
      }
      return { text: e.join(t.lineBreak), ranges: i, linewise: n };
    })(t.state);
    if (!i && !s) return;
    ks = s ? i : null;
    let r = Os ? null : e.clipboardData;
    r
      ? (e.preventDefault(), r.clearData(), r.setData('text/plain', i))
      : (function (t, e) {
          let i = t.dom.parentNode;
          if (!i) return;
          let n = i.appendChild(document.createElement('textarea'));
          (n.style.cssText = 'position: fixed; left: -10000px; top: 10px'),
            (n.value = e),
            n.focus(),
            (n.selectionEnd = e.length),
            (n.selectionStart = 0),
            setTimeout(() => {
              n.remove(), t.focus();
            }, 50);
        })(t, i),
      'cut' != e.type || t.state.readOnly || t.dispatch({ changes: n, scrollIntoView: !0, userEvent: 'delete.cut' });
  }),
  (cs.focus = (t) => {
    (t.inputState.lastFocusTime = Date.now()),
      t.scrollDOM.scrollTop ||
        (!t.inputState.lastScrollTop && !t.inputState.lastScrollLeft) ||
        ((t.scrollDOM.scrollTop = t.inputState.lastScrollTop), (t.scrollDOM.scrollLeft = t.inputState.lastScrollLeft)),
      $s(t);
  }),
  (cs.blur = (t) => {
    t.observer.clearSelectionRange(), $s(t);
  }),
  (cs.compositionstart = cs.compositionupdate =
    (t) => {
      null == t.inputState.compositionFirstChange && (t.inputState.compositionFirstChange = !0),
        t.inputState.composing < 0 &&
          ((t.inputState.composing = 0), t.docView.compositionDeco.size && (t.observer.flush(), Ts(t, !0)));
    }),
  (cs.compositionend = (t) => {
    (t.inputState.composing = -1),
      (t.inputState.compositionEndedAt = Date.now()),
      (t.inputState.compositionFirstChange = null),
      setTimeout(() => {
        t.inputState.composing < 0 && Ts(t, !1);
      }, 50);
  }),
  (cs.contextmenu = (t) => {
    t.inputState.lastContextMenu = Date.now();
  }),
  (cs.beforeinput = (t, e) => {
    var i;
    let n;
    if (
      Ti.chrome &&
      Ti.android &&
      (n = os.find((t) => t.inputType == e.inputType)) &&
      (t.observer.delayAndroidKey(n.key, n.keyCode), 'Backspace' == n.key || 'Delete' == n.key)
    ) {
      let e = (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.height) || 0;
      setTimeout(() => {
        var i;
        ((null === (i = window.visualViewport) || void 0 === i ? void 0 : i.height) || 0) > e + 10 &&
          t.hasFocus &&
          (t.contentDOM.blur(), t.focus());
      }, 100);
    }
  });
const Ps = ['pre-wrap', 'normal', 'pre-line', 'break-spaces'];
class Rs {
  constructor() {
    (this.doc = I.empty),
      (this.lineWrapping = !1),
      (this.heightSamples = {}),
      (this.lineHeight = 14),
      (this.charWidth = 7),
      (this.lineLength = 30),
      (this.heightChanged = !1);
  }
  heightForGap(t, e) {
    let i = this.doc.lineAt(e).number - this.doc.lineAt(t).number + 1;
    return (
      this.lineWrapping && (i += Math.ceil((e - t - i * this.lineLength * 0.5) / this.lineLength)), this.lineHeight * i
    );
  }
  heightForLine(t) {
    if (!this.lineWrapping) return this.lineHeight;
    return (1 + Math.max(0, Math.ceil((t - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight;
  }
  setDoc(t) {
    return (this.doc = t), this;
  }
  mustRefreshForWrapping(t) {
    return Ps.indexOf(t) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(t) {
    let e = !1;
    for (let i = 0; i < t.length; i++) {
      let n = t[i];
      n < 0 ? i++ : this.heightSamples[Math.floor(10 * n)] || ((e = !0), (this.heightSamples[Math.floor(10 * n)] = !0));
    }
    return e;
  }
  refresh(t, e, i, n, s) {
    let r = Ps.indexOf(t) > -1,
      o = Math.round(e) != Math.round(this.lineHeight) || this.lineWrapping != r;
    if (((this.lineWrapping = r), (this.lineHeight = e), (this.charWidth = i), (this.lineLength = n), o)) {
      this.heightSamples = {};
      for (let t = 0; t < s.length; t++) {
        let e = s[t];
        e < 0 ? t++ : (this.heightSamples[Math.floor(10 * e)] = !0);
      }
    }
    return o;
  }
}
class Cs {
  constructor(t, e) {
    (this.from = t), (this.heights = e), (this.index = 0);
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Ws {
  constructor(t, e, i, n, s) {
    (this.from = t), (this.length = e), (this.top = i), (this.height = n), (this.type = s);
  }
  get to() {
    return this.from + this.length;
  }
  get bottom() {
    return this.top + this.height;
  }
  join(t) {
    let e = (Array.isArray(this.type) ? this.type : [this]).concat(Array.isArray(t.type) ? t.type : [t]);
    return new Ws(this.from, this.length + t.length, this.top, this.height + t.height, e);
  }
}
var Xs = (function (t) {
  return (
    (t[(t.ByPos = 0)] = 'ByPos'), (t[(t.ByHeight = 1)] = 'ByHeight'), (t[(t.ByPosNoHeight = 2)] = 'ByPosNoHeight'), t
  );
})(Xs || (Xs = {}));
class As {
  constructor(t, e, i = 2) {
    (this.length = t), (this.height = e), (this.flags = i);
  }
  get outdated() {
    return (2 & this.flags) > 0;
  }
  set outdated(t) {
    this.flags = (t ? 2 : 0) | (-3 & this.flags);
  }
  setHeight(t, e) {
    this.height != e && (Math.abs(this.height - e) > 0.001 && (t.heightChanged = !0), (this.height = e));
  }
  replace(t, e, i) {
    return As.of(i);
  }
  decomposeLeft(t, e) {
    e.push(this);
  }
  decomposeRight(t, e) {
    e.push(this);
  }
  applyChanges(t, e, i, n) {
    let s = this;
    for (let r = n.length - 1; r >= 0; r--) {
      let { fromA: o, toA: a, fromB: l, toB: h } = n[r],
        c = s.lineAt(o, Xs.ByPosNoHeight, e, 0, 0),
        u = c.to >= a ? c : s.lineAt(a, Xs.ByPosNoHeight, e, 0, 0);
      for (h += u.to - a, a = u.to; r > 0 && c.from <= n[r - 1].toA; )
        (o = n[r - 1].fromA), (l = n[r - 1].fromB), r--, o < c.from && (c = s.lineAt(o, Xs.ByPosNoHeight, e, 0, 0));
      (l += c.from - o), (o = c.from);
      let O = _s.build(i, t, l, h);
      s = s.replace(o, a, O);
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new js(0, 0);
  }
  static of(t) {
    if (1 == t.length) return t[0];
    let e = 0,
      i = t.length,
      n = 0,
      s = 0;
    for (;;)
      if (e == i)
        if (n > 2 * s) {
          let s = t[e - 1];
          s.break ? t.splice(--e, 1, s.left, null, s.right) : t.splice(--e, 1, s.left, s.right),
            (i += 1 + s.break),
            (n -= s.size);
        } else {
          if (!(s > 2 * n)) break;
          {
            let e = t[i];
            e.break ? t.splice(i, 1, e.left, null, e.right) : t.splice(i, 1, e.left, e.right),
              (i += 2 + e.break),
              (s -= e.size);
          }
        }
      else if (n < s) {
        let i = t[e++];
        i && (n += i.size);
      } else {
        let e = t[--i];
        e && (s += e.size);
      }
    let r = 0;
    return (
      null == t[e - 1] ? ((r = 1), e--) : null == t[e] && ((r = 1), i++),
      new zs(As.of(t.slice(0, e)), r, As.of(t.slice(i)))
    );
  }
}
As.prototype.size = 1;
class Zs extends As {
  constructor(t, e, i) {
    super(t, e), (this.type = i);
  }
  blockAt(t, e, i, n) {
    return new Ws(n, this.length, i, this.height, this.type);
  }
  lineAt(t, e, i, n, s) {
    return this.blockAt(0, i, n, s);
  }
  forEachLine(t, e, i, n, s, r) {
    t <= s + this.length && e >= s && r(this.blockAt(0, i, n, s));
  }
  updateHeight(t, e = 0, i = !1, n) {
    return n && n.from <= e && n.more && this.setHeight(t, n.heights[n.index++]), (this.outdated = !1), this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class js extends Zs {
  constructor(t, e) {
    super(t, e, Vi.Text), (this.collapsed = 0), (this.widgetHeight = 0);
  }
  replace(t, e, i) {
    let n = i[0];
    return 1 == i.length &&
      (n instanceof js || (n instanceof Ds && 4 & n.flags)) &&
      Math.abs(this.length - n.length) < 10
      ? (n instanceof Ds ? (n = new js(n.length, this.height)) : (n.height = this.height),
        this.outdated || (n.outdated = !1),
        n)
      : As.of(i);
  }
  updateHeight(t, e = 0, i = !1, n) {
    return (
      n && n.from <= e && n.more
        ? this.setHeight(t, n.heights[n.index++])
        : (i || this.outdated) &&
          this.setHeight(t, Math.max(this.widgetHeight, t.heightForLine(this.length - this.collapsed))),
      (this.outdated = !1),
      this
    );
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ''}${
      this.widgetHeight ? ':' + this.widgetHeight : ''
    })`;
  }
}
class Ds extends As {
  constructor(t) {
    super(t, 0);
  }
  lines(t, e) {
    let i = t.lineAt(e).number,
      n = t.lineAt(e + this.length).number;
    return { firstLine: i, lastLine: n, lineHeight: this.height / (n - i + 1) };
  }
  blockAt(t, e, i, n) {
    let { firstLine: s, lastLine: r, lineHeight: o } = this.lines(e, n),
      a = Math.max(0, Math.min(r - s, Math.floor((t - i) / o))),
      { from: l, length: h } = e.line(s + a);
    return new Ws(l, h, i + o * a, o, Vi.Text);
  }
  lineAt(t, e, i, n, s) {
    if (e == Xs.ByHeight) return this.blockAt(t, i, n, s);
    if (e == Xs.ByPosNoHeight) {
      let { from: e, to: n } = i.lineAt(t);
      return new Ws(e, n - e, 0, 0, Vi.Text);
    }
    let { firstLine: r, lineHeight: o } = this.lines(i, s),
      { from: a, length: l, number: h } = i.lineAt(t);
    return new Ws(a, l, n + o * (h - r), o, Vi.Text);
  }
  forEachLine(t, e, i, n, s, r) {
    let { firstLine: o, lineHeight: a } = this.lines(i, s);
    for (let l = Math.max(t, s), h = Math.min(s + this.length, e); l <= h; ) {
      let e = i.lineAt(l);
      l == t && (n += a * (e.number - o)), r(new Ws(e.from, e.length, n, a, Vi.Text)), (n += a), (l = e.to + 1);
    }
  }
  replace(t, e, i) {
    let n = this.length - e;
    if (n > 0) {
      let t = i[i.length - 1];
      t instanceof Ds ? (i[i.length - 1] = new Ds(t.length + n)) : i.push(null, new Ds(n - 1));
    }
    if (t > 0) {
      let e = i[0];
      e instanceof Ds ? (i[0] = new Ds(t + e.length)) : i.unshift(new Ds(t - 1), null);
    }
    return As.of(i);
  }
  decomposeLeft(t, e) {
    e.push(new Ds(t - 1), null);
  }
  decomposeRight(t, e) {
    e.push(null, new Ds(this.length - t - 1));
  }
  updateHeight(t, e = 0, i = !1, n) {
    let s = e + this.length;
    if (n && n.from <= e + this.length && n.more) {
      let i = [],
        r = Math.max(e, n.from),
        o = -1,
        a = t.heightChanged;
      for (n.from > e && i.push(new Ds(n.from - e - 1).updateHeight(t, e)); r <= s && n.more; ) {
        let e = t.doc.lineAt(r).length;
        i.length && i.push(null);
        let s = n.heights[n.index++];
        -1 == o ? (o = s) : Math.abs(s - o) >= 0.001 && (o = -2);
        let a = new js(e, s);
        (a.outdated = !1), i.push(a), (r += e + 1);
      }
      r <= s && i.push(null, new Ds(s - r).updateHeight(t, r));
      let l = As.of(i);
      return (
        (t.heightChanged =
          a ||
          o < 0 ||
          Math.abs(l.height - this.height) >= 0.001 ||
          Math.abs(o - this.lines(t.doc, e).lineHeight) >= 0.001),
        l
      );
    }
    return (i || this.outdated) && (this.setHeight(t, t.heightForGap(e, e + this.length)), (this.outdated = !1)), this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class zs extends As {
  constructor(t, e, i) {
    super(t.length + e + i.length, t.height + i.height, e | (t.outdated || i.outdated ? 2 : 0)),
      (this.left = t),
      (this.right = i),
      (this.size = t.size + i.size);
  }
  get break() {
    return 1 & this.flags;
  }
  blockAt(t, e, i, n) {
    let s = i + this.left.height;
    return t < s ? this.left.blockAt(t, e, i, n) : this.right.blockAt(t, e, s, n + this.left.length + this.break);
  }
  lineAt(t, e, i, n, s) {
    let r = n + this.left.height,
      o = s + this.left.length + this.break,
      a = e == Xs.ByHeight ? t < r : t < o,
      l = a ? this.left.lineAt(t, e, i, n, s) : this.right.lineAt(t, e, i, r, o);
    if (this.break || (a ? l.to < o : l.from > o)) return l;
    let h = e == Xs.ByPosNoHeight ? Xs.ByPosNoHeight : Xs.ByPos;
    return a ? l.join(this.right.lineAt(o, h, i, r, o)) : this.left.lineAt(o, h, i, n, s).join(l);
  }
  forEachLine(t, e, i, n, s, r) {
    let o = n + this.left.height,
      a = s + this.left.length + this.break;
    if (this.break)
      t < a && this.left.forEachLine(t, e, i, n, s, r), e >= a && this.right.forEachLine(t, e, i, o, a, r);
    else {
      let l = this.lineAt(a, Xs.ByPos, i, n, s);
      t < l.from && this.left.forEachLine(t, l.from - 1, i, n, s, r),
        l.to >= t && l.from <= e && r(l),
        e > l.to && this.right.forEachLine(l.to + 1, e, i, o, a, r);
    }
  }
  replace(t, e, i) {
    let n = this.left.length + this.break;
    if (e < n) return this.balanced(this.left.replace(t, e, i), this.right);
    if (t > this.left.length) return this.balanced(this.left, this.right.replace(t - n, e - n, i));
    let s = [];
    t > 0 && this.decomposeLeft(t, s);
    let r = s.length;
    for (let t of i) s.push(t);
    if ((t > 0 && Ms(s, r - 1), e < this.length)) {
      let t = s.length;
      this.decomposeRight(e, s), Ms(s, t);
    }
    return As.of(s);
  }
  decomposeLeft(t, e) {
    let i = this.left.length;
    if (t <= i) return this.left.decomposeLeft(t, e);
    e.push(this.left), this.break && (i++, t >= i && e.push(null)), t > i && this.right.decomposeLeft(t - i, e);
  }
  decomposeRight(t, e) {
    let i = this.left.length,
      n = i + this.break;
    if (t >= n) return this.right.decomposeRight(t - n, e);
    t < i && this.left.decomposeRight(t, e), this.break && t < n && e.push(null), e.push(this.right);
  }
  balanced(t, e) {
    return t.size > 2 * e.size || e.size > 2 * t.size
      ? As.of(this.break ? [t, null, e] : [t, e])
      : ((this.left = t),
        (this.right = e),
        (this.height = t.height + e.height),
        (this.outdated = t.outdated || e.outdated),
        (this.size = t.size + e.size),
        (this.length = t.length + this.break + e.length),
        this);
  }
  updateHeight(t, e = 0, i = !1, n) {
    let { left: s, right: r } = this,
      o = e + s.length + this.break,
      a = null;
    return (
      n && n.from <= e + s.length && n.more ? (a = s = s.updateHeight(t, e, i, n)) : s.updateHeight(t, e, i),
      n && n.from <= o + r.length && n.more ? (a = r = r.updateHeight(t, o, i, n)) : r.updateHeight(t, o, i),
      a ? this.balanced(s, r) : ((this.height = this.left.height + this.right.height), (this.outdated = !1), this)
    );
  }
  toString() {
    return this.left + (this.break ? ' ' : '-') + this.right;
  }
}
function Ms(t, e) {
  let i, n;
  null == t[e] &&
    (i = t[e - 1]) instanceof Ds &&
    (n = t[e + 1]) instanceof Ds &&
    t.splice(e - 1, 3, new Ds(i.length + 1 + n.length));
}
class _s {
  constructor(t, e) {
    (this.pos = t),
      (this.oracle = e),
      (this.nodes = []),
      (this.lineStart = -1),
      (this.lineEnd = -1),
      (this.covering = null),
      (this.writtenTo = t);
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(t, e) {
    if (this.lineStart > -1) {
      let t = Math.min(e, this.lineEnd),
        i = this.nodes[this.nodes.length - 1];
      i instanceof js
        ? (i.length += t - this.pos)
        : (t > this.pos || !this.isCovered) && this.nodes.push(new js(t - this.pos, -1)),
        (this.writtenTo = t),
        e > t && (this.nodes.push(null), this.writtenTo++, (this.lineStart = -1));
    }
    this.pos = e;
  }
  point(t, e, i) {
    if (t < e || i.heightRelevant) {
      let n = i.widget ? i.widget.estimatedHeight : 0;
      n < 0 && (n = this.oracle.lineHeight);
      let s = e - t;
      i.block ? this.addBlock(new Zs(s, n, i.type)) : (s || n >= 5) && this.addLineDeco(n, s);
    } else e > t && this.span(t, e);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1) return;
    let { from: t, to: e } = this.oracle.doc.lineAt(this.pos);
    (this.lineStart = t),
      (this.lineEnd = e),
      this.writtenTo < t &&
        ((this.writtenTo < t - 1 || null == this.nodes[this.nodes.length - 1]) &&
          this.nodes.push(this.blankContent(this.writtenTo, t - 1)),
        this.nodes.push(null)),
      this.pos > t && this.nodes.push(new js(this.pos - t, -1)),
      (this.writtenTo = this.pos);
  }
  blankContent(t, e) {
    let i = new Ds(e - t);
    return this.oracle.doc.lineAt(t).to == e && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let t = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (t instanceof js) return t;
    let e = new js(0, -1);
    return this.nodes.push(e), e;
  }
  addBlock(t) {
    this.enterLine(),
      t.type != Vi.WidgetAfter || this.isCovered || this.ensureLine(),
      this.nodes.push(t),
      (this.writtenTo = this.pos = this.pos + t.length),
      t.type != Vi.WidgetBefore && (this.covering = t);
  }
  addLineDeco(t, e) {
    let i = this.ensureLine();
    (i.length += e),
      (i.collapsed += e),
      (i.widgetHeight = Math.max(i.widgetHeight, t)),
      (this.writtenTo = this.pos = this.pos + e);
  }
  finish(t) {
    let e = 0 == this.nodes.length ? null : this.nodes[this.nodes.length - 1];
    !(this.lineStart > -1) || e instanceof js || this.isCovered
      ? (this.writtenTo < this.pos || null == e) && this.nodes.push(this.blankContent(this.writtenTo, this.pos))
      : this.nodes.push(new js(0, -1));
    let i = t;
    for (let t of this.nodes) t instanceof js && t.updateHeight(this.oracle, i), (i += t ? t.length : 1);
    return this.nodes;
  }
  static build(t, e, i, n) {
    let s = new _s(i, t);
    return Qe.spans(e, i, n, s, 0), s.finish(i);
  }
}
class qs {
  constructor() {
    this.changes = [];
  }
  compareRange() {}
  comparePoint(t, e, i, n) {
    (t < e || (i && i.heightRelevant) || (n && n.heightRelevant)) && Yi(t, e, this.changes, 5);
  }
}
function Es(t, e) {
  let i = t.getBoundingClientRect(),
    n = Math.max(0, i.left),
    s = Math.min(innerWidth, i.right),
    r = Math.max(0, i.top),
    o = Math.min(innerHeight, i.bottom),
    a = t.ownerDocument.body;
  for (let e = t.parentNode; e && e != a; )
    if (1 == e.nodeType) {
      let i = e,
        a = window.getComputedStyle(i);
      if ((i.scrollHeight > i.clientHeight || i.scrollWidth > i.clientWidth) && 'visible' != a.overflow) {
        let a = i.getBoundingClientRect();
        (n = Math.max(n, a.left)),
          (s = Math.min(s, a.right)),
          (r = Math.max(r, a.top)),
          (o = e == t.parentNode ? a.bottom : Math.min(o, a.bottom));
      }
      e = 'absolute' == a.position || 'fixed' == a.position ? i.offsetParent : i.parentNode;
    } else {
      if (11 != e.nodeType) break;
      e = e.host;
    }
  return {
    left: n - i.left,
    right: Math.max(n, s) - i.left,
    top: r - (i.top + e),
    bottom: Math.max(r, o) - (i.top + e),
  };
}
function Gs(t, e) {
  let i = t.getBoundingClientRect();
  return { left: 0, right: i.right - i.left, top: e, bottom: i.bottom - (i.top + e) };
}
class Vs {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.size = i);
  }
  static same(t, e) {
    if (t.length != e.length) return !1;
    for (let i = 0; i < t.length; i++) {
      let n = t[i],
        s = e[i];
      if (n.from != s.from || n.to != s.to || n.size != s.size) return !1;
    }
    return !0;
  }
  draw(t) {
    return Ii.replace({ widget: new Is(this.size, t) }).range(this.from, this.to);
  }
}
class Is extends Gi {
  constructor(t, e) {
    super(), (this.size = t), (this.vertical = e);
  }
  eq(t) {
    return t.size == this.size && t.vertical == this.vertical;
  }
  toDOM() {
    let t = document.createElement('div');
    return (
      this.vertical
        ? (t.style.height = this.size + 'px')
        : ((t.style.width = this.size + 'px'), (t.style.height = '2px'), (t.style.display = 'inline-block')),
      t
    );
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Ns {
  constructor(t) {
    (this.state = t),
      (this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }),
      (this.inView = !0),
      (this.paddingTop = 0),
      (this.paddingBottom = 0),
      (this.contentDOMWidth = 0),
      (this.contentDOMHeight = 0),
      (this.editorHeight = 0),
      (this.editorWidth = 0),
      (this.heightOracle = new Rs()),
      (this.scaler = Js),
      (this.scrollTarget = null),
      (this.printing = !1),
      (this.mustMeasureContent = !0),
      (this.defaultTextDirection = kn.RTL),
      (this.visibleRanges = []),
      (this.mustEnforceCursorAssoc = !1),
      (this.stateDeco = t.facet(bn).filter((t) => 'function' != typeof t)),
      (this.heightMap = As.empty().applyChanges(this.stateDeco, I.empty, this.heightOracle.setDoc(t.doc), [
        new vn(0, 0, 0, t.doc.length),
      ])),
      (this.viewport = this.getViewport(0, null)),
      this.updateViewportLines(),
      this.updateForViewport(),
      (this.lineGaps = this.ensureLineGaps([])),
      (this.lineGapDeco = Ii.set(this.lineGaps.map((t) => t.draw(!1)))),
      this.computeVisibleRanges();
  }
  updateForViewport() {
    let t = [this.viewport],
      { main: e } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let n = i ? e.head : e.anchor;
      if (!t.some(({ from: t, to: e }) => n >= t && n <= e)) {
        let { from: e, to: i } = this.lineBlockAt(n);
        t.push(new Ls(e, i));
      }
    }
    (this.viewports = t.sort((t, e) => t.from - e.from)),
      (this.scaler = this.heightMap.height <= 7e6 ? Js : new Ks(this.heightOracle.doc, this.heightMap, this.viewports));
  }
  updateViewportLines() {
    (this.viewportLines = []),
      this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, (t) => {
        this.viewportLines.push(1 == this.scaler.scale ? t : tr(t, this.scaler));
      });
  }
  update(t, e = null) {
    this.state = t.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(bn).filter((t) => 'function' != typeof t);
    let n = t.changedRanges,
      s = vn.extendWithRanges(
        n,
        (function (t, e, i) {
          let n = new qs();
          return Qe.compare(t, e, i, n, 0), n.changes;
        })(i, this.stateDeco, t ? t.changes : ft.empty(this.state.doc.length)),
      ),
      r = this.heightMap.height;
    (this.heightMap = this.heightMap.applyChanges(
      this.stateDeco,
      t.startState.doc,
      this.heightOracle.setDoc(this.state.doc),
      s,
    )),
      this.heightMap.height != r && (t.flags |= 2);
    let o = s.length ? this.mapViewport(this.viewport, t.changes) : this.viewport;
    ((e && (e.range.head < o.from || e.range.head > o.to)) || !this.viewportIsAppropriate(o)) &&
      (o = this.getViewport(0, e));
    let a = !t.changes.empty || 2 & t.flags || o.from != this.viewport.from || o.to != this.viewport.to;
    (this.viewport = o),
      this.updateForViewport(),
      a && this.updateViewportLines(),
      (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) &&
        this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, t.changes))),
      (t.flags |= this.computeVisibleRanges()),
      e && (this.scrollTarget = e),
      !this.mustEnforceCursorAssoc &&
        t.selectionSet &&
        t.view.lineWrapping &&
        t.state.selection.main.empty &&
        t.state.selection.main.assoc &&
        (this.mustEnforceCursorAssoc = !0);
  }
  measure(t) {
    let e = t.contentDOM,
      i = window.getComputedStyle(e),
      n = this.heightOracle,
      s = i.whiteSpace;
    this.defaultTextDirection = 'rtl' == i.direction ? kn.RTL : kn.LTR;
    let r = this.heightOracle.mustRefreshForWrapping(s),
      o = r || this.mustMeasureContent || this.contentDOMHeight != e.clientHeight;
    (this.contentDOMHeight = e.clientHeight), (this.mustMeasureContent = !1);
    let a = 0,
      l = 0,
      h = parseInt(i.paddingTop) || 0,
      c = parseInt(i.paddingBottom) || 0;
    (this.paddingTop == h && this.paddingBottom == c) || ((this.paddingTop = h), (this.paddingBottom = c), (a |= 10)),
      this.editorWidth != t.scrollDOM.clientWidth &&
        (n.lineWrapping && (o = !0), (this.editorWidth = t.scrollDOM.clientWidth), (a |= 8));
    let u = (this.printing ? Gs : Es)(e, this.paddingTop),
      O = u.top - this.pixelViewport.top,
      f = u.bottom - this.pixelViewport.bottom;
    this.pixelViewport = u;
    let d = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if ((d != this.inView && ((this.inView = d), d && (o = !0)), !this.inView)) return 0;
    let p = e.clientWidth;
    if (
      ((this.contentDOMWidth == p && this.editorHeight == t.scrollDOM.clientHeight) ||
        ((this.contentDOMWidth = p), (this.editorHeight = t.scrollDOM.clientHeight), (a |= 8)),
      o)
    ) {
      let e = t.docView.measureVisibleLineHeights(this.viewport);
      if (
        (n.mustRefreshForHeights(e) && (r = !0),
        r || (n.lineWrapping && Math.abs(p - this.contentDOMWidth) > n.charWidth))
      ) {
        let { lineHeight: i, charWidth: o } = t.docView.measureTextSize();
        (r = n.refresh(s, i, o, p / o, e)), r && ((t.docView.minWidth = 0), (a |= 8));
      }
      O > 0 && f > 0 ? (l = Math.max(O, f)) : O < 0 && f < 0 && (l = Math.min(O, f)), (n.heightChanged = !1);
      for (let i of this.viewports) {
        let s = i.from == this.viewport.from ? e : t.docView.measureVisibleLineHeights(i);
        this.heightMap = this.heightMap.updateHeight(n, 0, r, new Cs(i.from, s));
      }
      n.heightChanged && (a |= 2);
    }
    let g =
      !this.viewportIsAppropriate(this.viewport, l) ||
      (this.scrollTarget &&
        (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to));
    return (
      g && (this.viewport = this.getViewport(l, this.scrollTarget)),
      this.updateForViewport(),
      (2 & a || g) && this.updateViewportLines(),
      (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) &&
        this.updateLineGaps(this.ensureLineGaps(r ? [] : this.lineGaps)),
      (a |= this.computeVisibleRanges()),
      this.mustEnforceCursorAssoc && ((this.mustEnforceCursorAssoc = !1), t.docView.enforceCursorAssoc()),
      a
    );
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(t, e) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, t / 1e3 / 2)),
      n = this.heightMap,
      s = this.state.doc,
      { visibleTop: r, visibleBottom: o } = this,
      a = new Ls(
        n.lineAt(r - 1e3 * i, Xs.ByHeight, s, 0, 0).from,
        n.lineAt(o + 1e3 * (1 - i), Xs.ByHeight, s, 0, 0).to,
      );
    if (e) {
      let { head: t } = e.range;
      if (t < a.from || t > a.to) {
        let i,
          r = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top),
          o = n.lineAt(t, Xs.ByPos, s, 0, 0);
        (i =
          'center' == e.y
            ? (o.top + o.bottom) / 2 - r / 2
            : 'start' == e.y || ('nearest' == e.y && t < a.from)
            ? o.top
            : o.bottom - r),
          (a = new Ls(n.lineAt(i - 500, Xs.ByHeight, s, 0, 0).from, n.lineAt(i + r + 500, Xs.ByHeight, s, 0, 0).to));
      }
    }
    return a;
  }
  mapViewport(t, e) {
    let i = e.mapPos(t.from, -1),
      n = e.mapPos(t.to, 1);
    return new Ls(
      this.heightMap.lineAt(i, Xs.ByPos, this.state.doc, 0, 0).from,
      this.heightMap.lineAt(n, Xs.ByPos, this.state.doc, 0, 0).to,
    );
  }
  viewportIsAppropriate({ from: t, to: e }, i = 0) {
    if (!this.inView) return !0;
    let { top: n } = this.heightMap.lineAt(t, Xs.ByPos, this.state.doc, 0, 0),
      { bottom: s } = this.heightMap.lineAt(e, Xs.ByPos, this.state.doc, 0, 0),
      { visibleTop: r, visibleBottom: o } = this;
    return (
      (0 == t || n <= r - Math.max(10, Math.min(-i, 250))) &&
      (e == this.state.doc.length || s >= o + Math.max(10, Math.min(i, 250))) &&
      n > r - 2e3 &&
      s < o + 2e3
    );
  }
  mapLineGaps(t, e) {
    if (!t.length || e.empty) return t;
    let i = [];
    for (let n of t) e.touchesRange(n.from, n.to) || i.push(new Vs(e.mapPos(n.from), e.mapPos(n.to), n.size));
    return i;
  }
  ensureLineGaps(t) {
    let e = [];
    if (this.defaultTextDirection != kn.LTR) return e;
    for (let i of this.viewportLines) {
      if (i.length < 4e3) continue;
      let n,
        s,
        r = Us(i.from, i.to, this.stateDeco);
      if (r.total < 4e3) continue;
      if (this.heightOracle.lineWrapping) {
        let t = (2e3 / this.heightOracle.lineLength) * this.heightOracle.lineHeight;
        (n = Bs(r, (this.visibleTop - i.top - t) / i.height)), (s = Bs(r, (this.visibleBottom - i.top + t) / i.height));
      } else {
        let t = r.total * this.heightOracle.charWidth,
          e = 2e3 * this.heightOracle.charWidth;
        (n = Bs(r, (this.pixelViewport.left - e) / t)), (s = Bs(r, (this.pixelViewport.right + e) / t));
      }
      let o = [];
      n > i.from && o.push({ from: i.from, to: n }), s < i.to && o.push({ from: s, to: i.to });
      let a = this.state.selection.main;
      a.from >= i.from && a.from <= i.to && Fs(o, a.from - 10, a.from + 10),
        !a.empty && a.to >= i.from && a.to <= i.to && Fs(o, a.to - 10, a.to + 10);
      for (let { from: n, to: s } of o)
        s - n > 1e3 &&
          e.push(
            Hs(t, (t) => t.from >= i.from && t.to <= i.to && Math.abs(t.from - n) < 1e3 && Math.abs(t.to - s) < 1e3) ||
              new Vs(n, s, this.gapSize(i, n, s, r)),
          );
    }
    return e;
  }
  gapSize(t, e, i, n) {
    let s = Ys(n, i) - Ys(n, e);
    return this.heightOracle.lineWrapping ? t.height * s : n.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(t) {
    Vs.same(t, this.lineGaps) ||
      ((this.lineGaps = t), (this.lineGapDeco = Ii.set(t.map((t) => t.draw(this.heightOracle.lineWrapping)))));
  }
  computeVisibleRanges() {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let e = [];
    Qe.spans(
      t,
      this.viewport.from,
      this.viewport.to,
      {
        span(t, i) {
          e.push({ from: t, to: i });
        },
        point() {},
      },
      20,
    );
    let i =
      e.length != this.visibleRanges.length ||
      this.visibleRanges.some((t, i) => t.from != e[i].from || t.to != e[i].to);
    return (this.visibleRanges = e), i ? 4 : 0;
  }
  lineBlockAt(t) {
    return (
      (t >= this.viewport.from && t <= this.viewport.to && this.viewportLines.find((e) => e.from <= t && e.to >= t)) ||
      tr(this.heightMap.lineAt(t, Xs.ByPos, this.state.doc, 0, 0), this.scaler)
    );
  }
  lineBlockAtHeight(t) {
    return tr(this.heightMap.lineAt(this.scaler.fromDOM(t), Xs.ByHeight, this.state.doc, 0, 0), this.scaler);
  }
  elementAtHeight(t) {
    return tr(this.heightMap.blockAt(this.scaler.fromDOM(t), this.state.doc, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Ls {
  constructor(t, e) {
    (this.from = t), (this.to = e);
  }
}
function Us(t, e, i) {
  let n = [],
    s = t,
    r = 0;
  return (
    Qe.spans(
      i,
      t,
      e,
      {
        span() {},
        point(t, e) {
          t > s && (n.push({ from: s, to: t }), (r += t - s)), (s = e);
        },
      },
      20,
    ),
    s < e && (n.push({ from: s, to: e }), (r += e - s)),
    { total: r, ranges: n }
  );
}
function Bs({ total: t, ranges: e }, i) {
  if (i <= 0) return e[0].from;
  if (i >= 1) return e[e.length - 1].to;
  let n = Math.floor(t * i);
  for (let t = 0; ; t++) {
    let { from: i, to: s } = e[t],
      r = s - i;
    if (n <= r) return i + n;
    n -= r;
  }
}
function Ys(t, e) {
  let i = 0;
  for (let { from: n, to: s } of t.ranges) {
    if (e <= s) {
      i += e - n;
      break;
    }
    i += s - n;
  }
  return i / t.total;
}
function Fs(t, e, i) {
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    if (s.from < i && s.to > e) {
      let r = [];
      s.from < e && r.push({ from: s.from, to: e }),
        s.to > i && r.push({ from: i, to: s.to }),
        t.splice(n, 1, ...r),
        (n += r.length - 1);
    }
  }
}
function Hs(t, e) {
  for (let i of t) if (e(i)) return i;
}
const Js = { toDOM: (t) => t, fromDOM: (t) => t, scale: 1 };
class Ks {
  constructor(t, e, i) {
    let n = 0,
      s = 0,
      r = 0;
    (this.viewports = i.map(({ from: i, to: s }) => {
      let r = e.lineAt(i, Xs.ByPos, t, 0, 0).top,
        o = e.lineAt(s, Xs.ByPos, t, 0, 0).bottom;
      return (n += o - r), { from: i, to: s, top: r, bottom: o, domTop: 0, domBottom: 0 };
    })),
      (this.scale = (7e6 - n) / (e.height - n));
    for (let t of this.viewports)
      (t.domTop = r + (t.top - s) * this.scale), (r = t.domBottom = t.domTop + (t.bottom - t.top)), (s = t.bottom);
  }
  toDOM(t) {
    for (let e = 0, i = 0, n = 0; ; e++) {
      let s = e < this.viewports.length ? this.viewports[e] : null;
      if (!s || t < s.top) return n + (t - i) * this.scale;
      if (t <= s.bottom) return s.domTop + (t - s.top);
      (i = s.bottom), (n = s.domBottom);
    }
  }
  fromDOM(t) {
    for (let e = 0, i = 0, n = 0; ; e++) {
      let s = e < this.viewports.length ? this.viewports[e] : null;
      if (!s || t < s.domTop) return i + (t - n) / this.scale;
      if (t <= s.domBottom) return s.top + (t - s.domTop);
      (i = s.bottom), (n = s.domBottom);
    }
  }
}
function tr(t, e) {
  if (1 == e.scale) return t;
  let i = e.toDOM(t.top),
    n = e.toDOM(t.bottom);
  return new Ws(t.from, t.length, i, n - i, Array.isArray(t.type) ? t.type.map((t) => tr(t, e)) : t.type);
}
const er = St.define({ combine: (t) => t.join(' ') }),
  ir = St.define({ combine: (t) => t.indexOf(!0) > -1 }),
  nr = Ze.newName(),
  sr = Ze.newName(),
  rr = Ze.newName(),
  or = { '&light': '.' + sr, '&dark': '.' + rr };
function ar(t, e, i) {
  return new Ze(e, {
    finish: (e) =>
      /&/.test(e)
        ? e.replace(/&\w*/, (e) => {
            if ('&' == e) return t;
            if (!i || !i[e]) throw new RangeError(`Unsupported selector: ${e}`);
            return i[e];
          })
        : t + ' ' + e,
  });
}
const lr = ar(
    '.' + nr,
    {
      '&.cm-editor': {
        position: 'relative !important',
        boxSizing: 'border-box',
        '&.cm-focused': { outline: '1px dotted #212121' },
        display: 'flex !important',
        flexDirection: 'column',
      },
      '.cm-scroller': {
        display: 'flex !important',
        alignItems: 'flex-start !important',
        fontFamily: 'monospace',
        lineHeight: 1.4,
        height: '100%',
        overflowX: 'auto',
        position: 'relative',
        zIndex: 0,
      },
      '.cm-content': {
        margin: 0,
        flexGrow: 2,
        flexShrink: 0,
        minHeight: '100%',
        display: 'block',
        whiteSpace: 'pre',
        wordWrap: 'normal',
        boxSizing: 'border-box',
        padding: '4px 0',
        outline: 'none',
        '&[contenteditable=true]': { WebkitUserModify: 'read-write-plaintext-only' },
      },
      '.cm-lineWrapping': {
        whiteSpace_fallback: 'pre-wrap',
        whiteSpace: 'break-spaces',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        flexShrink: 1,
      },
      '&light .cm-content': { caretColor: 'black' },
      '&dark .cm-content': { caretColor: 'white' },
      '.cm-line': { display: 'block', padding: '0 2px 0 4px' },
      '.cm-selectionLayer': { zIndex: -1, contain: 'size style' },
      '.cm-selectionBackground': { position: 'absolute' },
      '&light .cm-selectionBackground': { background: '#d9d9d9' },
      '&dark .cm-selectionBackground': { background: '#222' },
      '&light.cm-focused .cm-selectionBackground': { background: '#d7d4f0' },
      '&dark.cm-focused .cm-selectionBackground': { background: '#233' },
      '.cm-cursorLayer': { zIndex: 100, contain: 'size style', pointerEvents: 'none' },
      '&.cm-focused .cm-cursorLayer': { animation: 'steps(1) cm-blink 1.2s infinite' },
      '@keyframes cm-blink': { '0%': {}, '50%': { opacity: 0 }, '100%': {} },
      '@keyframes cm-blink2': { '0%': {}, '50%': { opacity: 0 }, '100%': {} },
      '.cm-cursor, .cm-dropCursor': {
        position: 'absolute',
        borderLeft: '1.2px solid black',
        marginLeft: '-0.6px',
        pointerEvents: 'none',
      },
      '.cm-cursor': { display: 'none' },
      '&dark .cm-cursor': { borderLeftColor: '#444' },
      '&.cm-focused .cm-cursor': { display: 'block' },
      '&light .cm-activeLine': { backgroundColor: '#f3f9ff' },
      '&dark .cm-activeLine': { backgroundColor: '#223039' },
      '&light .cm-specialChar': { color: 'red' },
      '&dark .cm-specialChar': { color: '#f78' },
      '.cm-gutters': { flexShrink: 0, display: 'flex', height: '100%', boxSizing: 'border-box', left: 0, zIndex: 200 },
      '&light .cm-gutters': { backgroundColor: '#f5f5f5', color: '#6c6c6c', borderRight: '1px solid #ddd' },
      '&dark .cm-gutters': { backgroundColor: '#333338', color: '#ccc' },
      '.cm-gutter': {
        display: 'flex !important',
        flexDirection: 'column',
        flexShrink: 0,
        boxSizing: 'border-box',
        minHeight: '100%',
        overflow: 'hidden',
      },
      '.cm-gutterElement': { boxSizing: 'border-box' },
      '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 3px 0 5px',
        minWidth: '20px',
        textAlign: 'right',
        whiteSpace: 'nowrap',
      },
      '&light .cm-activeLineGutter': { backgroundColor: '#e2f2ff' },
      '&dark .cm-activeLineGutter': { backgroundColor: '#222227' },
      '.cm-panels': { boxSizing: 'border-box', position: 'sticky', left: 0, right: 0 },
      '&light .cm-panels': { backgroundColor: '#f5f5f5', color: 'black' },
      '&light .cm-panels-top': { borderBottom: '1px solid #ddd' },
      '&light .cm-panels-bottom': { borderTop: '1px solid #ddd' },
      '&dark .cm-panels': { backgroundColor: '#333338', color: 'white' },
      '.cm-tab': { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' },
      '.cm-widgetBuffer': { verticalAlign: 'text-top', height: '1em', width: 0, display: 'inline' },
      '.cm-placeholder': { color: '#888', display: 'inline-block', verticalAlign: 'top' },
      '.cm-button': {
        verticalAlign: 'middle',
        color: 'inherit',
        fontSize: '70%',
        padding: '.2em 1em',
        borderRadius: '1px',
      },
      '&light .cm-button': {
        backgroundImage: 'linear-gradient(#eff1f5, #d9d9df)',
        border: '1px solid #888',
        '&:active': { backgroundImage: 'linear-gradient(#b4b4b4, #d0d3d6)' },
      },
      '&dark .cm-button': {
        backgroundImage: 'linear-gradient(#393939, #111)',
        border: '1px solid #888',
        '&:active': { backgroundImage: 'linear-gradient(#111, #333)' },
      },
      '.cm-textfield': {
        verticalAlign: 'middle',
        color: 'inherit',
        fontSize: '70%',
        border: '1px solid silver',
        padding: '.2em .5em',
      },
      '&light .cm-textfield': { backgroundColor: 'white' },
      '&dark .cm-textfield': { border: '1px solid #555', backgroundColor: 'inherit' },
    },
    or,
  ),
  hr = { childList: !0, characterData: !0, subtree: !0, attributes: !0, characterDataOldValue: !0 },
  cr = Ti.ie && Ti.ie_version <= 11;
class ur {
  constructor(t, e, i) {
    (this.view = t),
      (this.onChange = e),
      (this.onScrollChanged = i),
      (this.active = !1),
      (this.selectionRange = new ii()),
      (this.selectionChanged = !1),
      (this.delayedFlush = -1),
      (this.resizeTimeout = -1),
      (this.queue = []),
      (this.delayedAndroidKey = null),
      (this.scrollTargets = []),
      (this.intersection = null),
      (this.resize = null),
      (this.intersecting = !1),
      (this.gapIntersection = null),
      (this.gaps = []),
      (this.parentCheck = -1),
      (this.dom = t.contentDOM),
      (this.observer = new MutationObserver((e) => {
        for (let t of e) this.queue.push(t);
        ((Ti.ie && Ti.ie_version <= 11) || (Ti.ios && t.composing)) &&
        e.some(
          (t) =>
            ('childList' == t.type && t.removedNodes.length) ||
            ('characterData' == t.type && t.oldValue.length > t.target.nodeValue.length),
        )
          ? this.flushSoon()
          : this.flush();
      })),
      cr &&
        (this.onCharData = (t) => {
          this.queue.push({ target: t.target, type: 'characterData', oldValue: t.prevValue }), this.flushSoon();
        }),
      (this.onSelectionChange = this.onSelectionChange.bind(this)),
      (this.onResize = this.onResize.bind(this)),
      (this.onPrint = this.onPrint.bind(this)),
      (this.onScroll = this.onScroll.bind(this)),
      'function' == typeof ResizeObserver &&
        ((this.resize = new ResizeObserver(() => {
          this.view.docView.lastUpdate < Date.now() - 75 && this.onResize();
        })),
        this.resize.observe(t.scrollDOM)),
      (this.win = t.dom.ownerDocument.defaultView),
      this.addWindowListeners(this.win),
      this.start(),
      'function' == typeof IntersectionObserver &&
        ((this.intersection = new IntersectionObserver((t) => {
          this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)),
            t.length > 0 &&
              t[t.length - 1].intersectionRatio > 0 != this.intersecting &&
              ((this.intersecting = !this.intersecting),
              this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent('Event')));
        }, {})),
        this.intersection.observe(this.dom),
        (this.gapIntersection = new IntersectionObserver((t) => {
          t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent('Event'));
        }, {}))),
      this.listenForScroll(),
      this.readSelectionRange();
  }
  onScroll(t) {
    this.intersecting && this.flush(!1), this.onScrollChanged(t);
  }
  onResize() {
    this.resizeTimeout < 0 &&
      (this.resizeTimeout = setTimeout(() => {
        (this.resizeTimeout = -1), this.view.requestMeasure();
      }, 50));
  }
  onPrint() {
    (this.view.viewState.printing = !0),
      this.view.measure(),
      setTimeout(() => {
        (this.view.viewState.printing = !1), this.view.requestMeasure();
      }, 500);
  }
  updateGaps(t) {
    if (this.gapIntersection && (t.length != this.gaps.length || this.gaps.some((e, i) => e != t[i]))) {
      this.gapIntersection.disconnect();
      for (let e of t) this.gapIntersection.observe(e);
      this.gaps = t;
    }
  }
  onSelectionChange(t) {
    if (!this.readSelectionRange() || this.delayedAndroidKey) return;
    let { view: e } = this,
      i = this.selectionRange;
    if (e.state.facet(On) ? e.root.activeElement != this.dom : !Ue(e.dom, i)) return;
    let n = i.anchorNode && e.docView.nearest(i.anchorNode);
    (n && n.ignoreEvent(t)) ||
      (((Ti.ie && Ti.ie_version <= 11) || (Ti.android && Ti.chrome)) &&
      !e.state.selection.main.empty &&
      i.focusNode &&
      Ye(i.focusNode, i.focusOffset, i.anchorNode, i.anchorOffset)
        ? this.flushSoon()
        : this.flush(!1));
  }
  readSelectionRange() {
    let { view: t } = this,
      e =
        (Ti.safari &&
          11 == t.root.nodeType &&
          (function () {
            let t = document.activeElement;
            for (; t && t.shadowRoot; ) t = t.shadowRoot.activeElement;
            return t;
          })() == this.dom &&
          (function (t) {
            let e = null;
            function i(t) {
              t.preventDefault(), t.stopImmediatePropagation(), (e = t.getTargetRanges()[0]);
            }
            if (
              (t.contentDOM.addEventListener('beforeinput', i, !0),
              document.execCommand('indent'),
              t.contentDOM.removeEventListener('beforeinput', i, !0),
              !e)
            )
              return null;
            let n = e.startContainer,
              s = e.startOffset,
              r = e.endContainer,
              o = e.endOffset,
              a = t.docView.domAtPos(t.state.selection.main.anchor);
            Ye(a.node, a.offset, r, o) && ([n, s, r, o] = [r, o, n, s]);
            return { anchorNode: n, anchorOffset: s, focusNode: r, focusOffset: o };
          })(this.view)) ||
        Ne(t.root);
    if (!e || this.selectionRange.eq(e)) return !1;
    let i = Ue(this.dom, e);
    return i &&
      !this.selectionChanged &&
      t.inputState.lastFocusTime > Date.now() - 200 &&
      t.inputState.lastTouchTime < Date.now() - 300 &&
      (function (t, e) {
        let i = e.focusNode,
          n = e.focusOffset;
        if (!i || e.anchorNode != i || e.anchorOffset != n) return !1;
        for (;;)
          if (n) {
            if (1 != i.nodeType) return !1;
            let t = i.childNodes[n - 1];
            'false' == t.contentEditable ? n-- : ((i = t), (n = Je(i)));
          } else {
            if (i == t) return !0;
            (n = Fe(i)), (i = i.parentNode);
          }
      })(this.dom, e)
      ? ((this.view.inputState.lastFocusTime = 0), t.docView.updateSelection(), !1)
      : (this.selectionRange.setRange(e), i && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(t, e) {
    this.selectionRange.set(t.node, t.offset, e.node, e.offset), (this.selectionChanged = !1);
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let t = 0,
      e = null;
    for (let i = this.dom; i; )
      if (1 == i.nodeType)
        !e && t < this.scrollTargets.length && this.scrollTargets[t] == i
          ? t++
          : e || (e = this.scrollTargets.slice(0, t)),
          e && e.push(i),
          (i = i.assignedSlot || i.parentNode);
      else {
        if (11 != i.nodeType) break;
        i = i.host;
      }
    if ((t < this.scrollTargets.length && !e && (e = this.scrollTargets.slice(0, t)), e)) {
      for (let t of this.scrollTargets) t.removeEventListener('scroll', this.onScroll);
      for (let t of (this.scrollTargets = e)) t.addEventListener('scroll', this.onScroll);
    }
  }
  ignore(t) {
    if (!this.active) return t();
    try {
      return this.stop(), t();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active ||
      (this.observer.observe(this.dom, hr),
      cr && this.dom.addEventListener('DOMCharacterDataModified', this.onCharData),
      (this.active = !0));
  }
  stop() {
    this.active &&
      ((this.active = !1),
      this.observer.disconnect(),
      cr && this.dom.removeEventListener('DOMCharacterDataModified', this.onCharData));
  }
  clear() {
    this.processRecords(), (this.queue.length = 0), (this.selectionChanged = !1);
  }
  delayAndroidKey(t, e) {
    this.delayedAndroidKey ||
      requestAnimationFrame(() => {
        let t = this.delayedAndroidKey;
        (this.delayedAndroidKey = null), (this.delayedFlush = -1), this.flush() || ai(this.dom, t.key, t.keyCode);
      }),
      (this.delayedAndroidKey && 'Enter' != t) || (this.delayedAndroidKey = { key: t, keyCode: e });
  }
  flushSoon() {
    this.delayedFlush < 0 &&
      (this.delayedFlush = window.setTimeout(() => {
        (this.delayedFlush = -1), this.flush();
      }, 20));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (window.clearTimeout(this.delayedFlush), (this.delayedFlush = -1)), this.flush();
  }
  processRecords() {
    let t = this.queue;
    for (let e of this.observer.takeRecords()) t.push(e);
    t.length && (this.queue = []);
    let e = -1,
      i = -1,
      n = !1;
    for (let s of t) {
      let t = this.readMutation(s);
      t &&
        (t.typeOver && (n = !0),
        -1 == e ? ({ from: e, to: i } = t) : ((e = Math.min(t.from, e)), (i = Math.max(t.to, i))));
    }
    return { from: e, to: i, typeOver: n };
  }
  flush(t = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey) return;
    t && this.readSelectionRange();
    let { from: e, to: i, typeOver: n } = this.processRecords(),
      s = this.selectionChanged && Ue(this.dom, this.selectionRange);
    if (e < 0 && !s) return;
    (this.view.inputState.lastFocusTime = 0), (this.selectionChanged = !1);
    let r = this.view.state,
      o = this.onChange(e, i, n);
    return this.view.state == r && this.view.update([]), o;
  }
  readMutation(t) {
    let e = this.view.docView.nearest(t.target);
    if (!e || e.ignoreMutation(t)) return null;
    if ((e.markDirty('attributes' == t.type), 'attributes' == t.type && (e.dirty |= 4), 'childList' == t.type)) {
      let i = Or(e, t.previousSibling || t.target.previousSibling, -1),
        n = Or(e, t.nextSibling || t.target.nextSibling, 1);
      return { from: i ? e.posAfter(i) : e.posAtStart, to: n ? e.posBefore(n) : e.posAtEnd, typeOver: !1 };
    }
    return 'characterData' == t.type
      ? { from: e.posAtStart, to: e.posAtEnd, typeOver: t.target.nodeValue == t.oldValue }
      : null;
  }
  setWindow(t) {
    t != this.win && (this.removeWindowListeners(this.win), (this.win = t), this.addWindowListeners(this.win));
  }
  addWindowListeners(t) {
    t.addEventListener('resize', this.onResize),
      t.addEventListener('beforeprint', this.onPrint),
      t.addEventListener('scroll', this.onScroll),
      t.document.addEventListener('selectionchange', this.onSelectionChange);
  }
  removeWindowListeners(t) {
    t.removeEventListener('scroll', this.onScroll),
      t.removeEventListener('resize', this.onResize),
      t.removeEventListener('beforeprint', this.onPrint),
      t.document.removeEventListener('selectionchange', this.onSelectionChange);
  }
  destroy() {
    var t, e, i;
    this.stop(),
      null === (t = this.intersection) || void 0 === t || t.disconnect(),
      null === (e = this.gapIntersection) || void 0 === e || e.disconnect(),
      null === (i = this.resize) || void 0 === i || i.disconnect();
    for (let t of this.scrollTargets) t.removeEventListener('scroll', this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout);
  }
}
function Or(t, e, i) {
  for (; e; ) {
    let n = ui.get(e);
    if (n && n.parent == t) return n;
    let s = e.parentNode;
    e = s != t.dom ? s : i > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function fr(t, e, i, n) {
  let s,
    r,
    o = t.state.selection.main;
  if (e > -1) {
    let n = t.docView.domBoundsAround(e, i, 0);
    if (!n || t.state.readOnly) return !1;
    let { from: a, to: l } = n,
      h =
        t.docView.impreciseHead || t.docView.impreciseAnchor
          ? []
          : (function (t) {
              let e = [];
              if (t.root.activeElement != t.contentDOM) return e;
              let { anchorNode: i, anchorOffset: n, focusNode: s, focusOffset: r } = t.observer.selectionRange;
              i && (e.push(new En(i, n)), (s == i && r == n) || e.push(new En(s, r)));
              return e;
            })(t),
      c = new _n(h, t.state);
    c.readRange(n.startDOM, n.endDOM);
    let u = o.from,
      O = null;
    ((8 === t.inputState.lastKeyCode && t.inputState.lastKeyTime > Date.now() - 100) ||
      (Ti.android && c.text.length < l - a)) &&
      ((u = o.to), (O = 'end'));
    let f = (function (t, e, i, n) {
      let s = Math.min(t.length, e.length),
        r = 0;
      for (; r < s && t.charCodeAt(r) == e.charCodeAt(r); ) r++;
      if (r == s && t.length == e.length) return null;
      let o = t.length,
        a = e.length;
      for (; o > 0 && a > 0 && t.charCodeAt(o - 1) == e.charCodeAt(a - 1); ) o--, a--;
      if ('end' == n) {
        i -= o + Math.max(0, r - Math.min(o, a)) - r;
      }
      if (o < r && t.length < e.length) {
        (r -= i <= r && i >= o ? r - i : 0), (a = r + (a - o)), (o = r);
      } else if (a < r) {
        (r -= i <= r && i >= a ? r - i : 0), (o = r + (o - a)), (a = r);
      }
      return { from: r, toA: o, toB: a };
    })(t.state.doc.sliceString(a, l, '￿'), c.text, u - a, O);
    f &&
      (Ti.chrome &&
        13 == t.inputState.lastKeyCode &&
        f.toB == f.from + 2 &&
        '￿￿' == c.text.slice(f.from, f.toB) &&
        f.toB--,
      (s = { from: a + f.from, to: a + f.toA, insert: I.of(c.text.slice(f.from, f.toB).split('￿')) })),
      (r = (function (t, e) {
        if (0 == t.length) return null;
        let i = t[0].pos,
          n = 2 == t.length ? t[1].pos : i;
        return i > -1 && n > -1 ? wt.single(i + e, n + e) : null;
      })(h, a));
  } else if (t.hasFocus || !t.state.facet(On)) {
    let e = t.observer.selectionRange,
      { impreciseHead: i, impreciseAnchor: n } = t.docView,
      s =
        (i && i.node == e.focusNode && i.offset == e.focusOffset) || !Le(t.contentDOM, e.focusNode)
          ? t.state.selection.main.head
          : t.docView.posFromDOM(e.focusNode, e.focusOffset),
      a =
        (n && n.node == e.anchorNode && n.offset == e.anchorOffset) || !Le(t.contentDOM, e.anchorNode)
          ? t.state.selection.main.anchor
          : t.docView.posFromDOM(e.anchorNode, e.anchorOffset);
    (s == o.head && a == o.anchor) || (r = wt.single(a, s));
  }
  if (!s && !r) return !1;
  if (
    (!s && n && !o.empty && r && r.main.empty
      ? (s = { from: o.from, to: o.to, insert: t.state.doc.slice(o.from, o.to) })
      : s &&
        s.from >= o.from &&
        s.to <= o.to &&
        (s.from != o.from || s.to != o.to) &&
        o.to - o.from - (s.to - s.from) <= 4
      ? (s = {
          from: o.from,
          to: o.to,
          insert: t.state.doc.slice(o.from, s.from).append(s.insert).append(t.state.doc.slice(s.to, o.to)),
        })
      : (Ti.mac || Ti.android) &&
        s &&
        s.from == s.to &&
        s.from == o.head - 1 &&
        '.' == s.insert.toString() &&
        (s = { from: o.from, to: o.to, insert: I.of([' ']) }),
    s)
  ) {
    let e = t.state;
    if (Ti.ios && t.inputState.flushIOSKey(t)) return !0;
    if (
      Ti.android &&
      ((s.from == o.from &&
        s.to == o.to &&
        1 == s.insert.length &&
        2 == s.insert.lines &&
        ai(t.contentDOM, 'Enter', 13)) ||
        (s.from == o.from - 1 && s.to == o.to && 0 == s.insert.length && ai(t.contentDOM, 'Backspace', 8)) ||
        (s.from == o.from && s.to == o.to + 1 && 0 == s.insert.length && ai(t.contentDOM, 'Delete', 46)))
    )
      return !0;
    let i,
      n = s.insert.toString();
    if (t.state.facet(an).some((e) => e(t, s.from, s.to, n))) return !0;
    if (
      (t.inputState.composing >= 0 && t.inputState.composing++,
      s.from >= o.from &&
        s.to <= o.to &&
        s.to - s.from >= (o.to - o.from) / 3 &&
        (!r || (r.main.empty && r.main.from == s.from + s.insert.length)) &&
        t.inputState.composing < 0)
    ) {
      let n = o.from < s.from ? e.sliceDoc(o.from, s.from) : '',
        r = o.to > s.to ? e.sliceDoc(s.to, o.to) : '';
      i = e.replaceSelection(t.state.toText(n + s.insert.sliceString(0, void 0, t.state.lineBreak) + r));
    } else {
      let n = e.changes(s),
        a = r && !e.selection.main.eq(r.main) && r.main.to <= n.newLength ? r.main : void 0;
      if (e.selection.ranges.length > 1 && t.inputState.composing >= 0 && s.to <= o.to && s.to >= o.to - 10) {
        let r = t.state.sliceDoc(s.from, s.to),
          l = In(t) || t.state.doc.lineAt(o.head),
          h = o.to - s.to,
          c = o.to - o.from;
        i = e.changeByRange((i) => {
          if (i.from == o.from && i.to == o.to) return { changes: n, range: a || i.map(n) };
          let u = i.to - h,
            O = u - r.length;
          if (i.to - i.from != c || t.state.sliceDoc(O, u) != r || (l && i.to >= l.from && i.from <= l.to))
            return { range: i };
          let f = e.changes({ from: O, to: u, insert: s.insert }),
            d = i.to - o.to;
          return { changes: f, range: a ? wt.range(Math.max(0, a.anchor + d), Math.max(0, a.head + d)) : i.map(f) };
        });
      } else i = { changes: n, selection: a && e.selection.replaceRange(a) };
    }
    let a = 'input.type';
    return (
      t.composing &&
        ((a += '.compose'),
        t.inputState.compositionFirstChange && ((a += '.start'), (t.inputState.compositionFirstChange = !1))),
      t.dispatch(i, { scrollIntoView: !0, userEvent: a }),
      !0
    );
  }
  if (r && !r.main.eq(o)) {
    let e = !1,
      i = 'select';
    return (
      t.inputState.lastSelectionTime > Date.now() - 50 &&
        ('select' == t.inputState.lastSelectionOrigin && (e = !0), (i = t.inputState.lastSelectionOrigin)),
      t.dispatch({ selection: r, scrollIntoView: e, userEvent: i }),
      !0
    );
  }
  return !1;
}
class dr {
  constructor(t = {}) {
    (this.plugins = []),
      (this.pluginMap = new Map()),
      (this.editorAttrs = {}),
      (this.contentAttrs = {}),
      (this.bidiCache = []),
      (this.destroyed = !1),
      (this.updateState = 2),
      (this.measureScheduled = -1),
      (this.measureRequests = []),
      (this.contentDOM = document.createElement('div')),
      (this.scrollDOM = document.createElement('div')),
      (this.scrollDOM.tabIndex = -1),
      (this.scrollDOM.className = 'cm-scroller'),
      this.scrollDOM.appendChild(this.contentDOM),
      (this.announceDOM = document.createElement('div')),
      (this.announceDOM.style.cssText = 'position: absolute; top: -10000px'),
      this.announceDOM.setAttribute('aria-live', 'polite'),
      (this.dom = document.createElement('div')),
      this.dom.appendChild(this.announceDOM),
      this.dom.appendChild(this.scrollDOM),
      (this._dispatch = t.dispatch || ((t) => this.update([t]))),
      (this.dispatch = this.dispatch.bind(this)),
      (this._root =
        t.root ||
        (function (t) {
          for (; t; ) {
            if (t && (9 == t.nodeType || (11 == t.nodeType && t.host))) return t;
            t = t.assignedSlot || t.parentNode;
          }
          return null;
        })(t.parent) ||
        document),
      (this.viewState = new Ns(t.state || Oe.create(t))),
      (this.plugins = this.state.facet(dn).map((t) => new gn(t)));
    for (let t of this.plugins) t.update(this);
    (this.observer = new ur(
      this,
      (t, e, i) => fr(this, t, e, i),
      (t) => {
        this.inputState.runScrollHandlers(this, t), this.observer.intersecting && this.measure();
      },
    )),
      (this.inputState = new rs(this)),
      this.inputState.ensureHandlers(this, this.plugins),
      (this.docView = new Gn(this)),
      this.mountStyles(),
      this.updateAttrs(),
      (this.updateState = 0),
      this.requestMeasure(),
      t.parent && t.parent.appendChild(this.dom);
  }
  get state() {
    return this.viewState.state;
  }
  get viewport() {
    return this.viewState.viewport;
  }
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  get inView() {
    return this.viewState.inView;
  }
  get composing() {
    return this.inputState.composing > 0;
  }
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  get root() {
    return this._root;
  }
  dispatch(...t) {
    this._dispatch(1 == t.length && t[0] instanceof ee ? t[0] : this.state.update(...t));
  }
  update(t) {
    if (0 != this.updateState)
      throw new Error('Calls to EditorView.update are not allowed while an update is in progress');
    let e,
      i = !1,
      n = !1,
      s = this.state;
    for (let e of t) {
      if (e.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = e.state;
    }
    if (this.destroyed) return void (this.viewState.state = s);
    if ((this.observer.clear(), s.facet(Oe.phrases) != this.state.facet(Oe.phrases))) return this.setState(s);
    e = Sn.create(this, s, t);
    let r = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let e of t) {
        if ((r && (r = r.map(e.changes)), e.scrollIntoView)) {
          let { main: t } = e.state.selection;
          r = new hn(t.empty ? t : wt.cursor(t.head, t.head > t.anchor ? -1 : 1));
        }
        for (let t of e.effects) t.is(cn) && (r = t.value);
      }
      this.viewState.update(e, r),
        (this.bidiCache = mr.update(this.bidiCache, e.changes)),
        e.empty || (this.updatePlugins(e), this.inputState.update(e)),
        (i = this.docView.update(e)),
        this.state.facet(xn) != this.styleModules && this.mountStyles(),
        (n = this.updateAttrs()),
        this.showAnnouncements(t),
        this.docView.updateSelection(
          i,
          t.some((t) => t.isUserEvent('select.pointer')),
        );
    } finally {
      this.updateState = 0;
    }
    if (
      (e.startState.facet(er) != e.state.facet(er) && (this.viewState.mustMeasureContent = !0),
      (i || n || r || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) &&
        this.requestMeasure(),
      !e.empty)
    )
      for (let t of this.state.facet(on)) t(e);
  }
  setState(t) {
    if (0 != this.updateState)
      throw new Error('Calls to EditorView.setState are not allowed while an update is in progress');
    if (this.destroyed) return void (this.viewState.state = t);
    this.updateState = 2;
    let e = this.hasFocus;
    try {
      for (let t of this.plugins) t.destroy(this);
      (this.viewState = new Ns(t)), (this.plugins = t.facet(dn).map((t) => new gn(t))), this.pluginMap.clear();
      for (let t of this.plugins) t.update(this);
      (this.docView = new Gn(this)),
        this.inputState.ensureHandlers(this, this.plugins),
        this.mountStyles(),
        this.updateAttrs(),
        (this.bidiCache = []);
    } finally {
      this.updateState = 0;
    }
    e && this.focus(), this.requestMeasure();
  }
  updatePlugins(t) {
    let e = t.startState.facet(dn),
      i = t.state.facet(dn);
    if (e != i) {
      let n = [];
      for (let s of i) {
        let i = e.indexOf(s);
        if (i < 0) n.push(new gn(s));
        else {
          let e = this.plugins[i];
          (e.mustUpdate = t), n.push(e);
        }
      }
      for (let e of this.plugins) e.mustUpdate != t && e.destroy(this);
      (this.plugins = n), this.pluginMap.clear(), this.inputState.ensureHandlers(this, this.plugins);
    } else for (let e of this.plugins) e.mustUpdate = t;
    for (let t = 0; t < this.plugins.length; t++) this.plugins[t].update(this);
  }
  measure(t = !0) {
    if (this.destroyed) return;
    this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled),
      (this.measureScheduled = 0),
      t && this.observer.forceFlush();
    let e = null,
      { scrollHeight: i, scrollTop: n, clientHeight: s } = this.scrollDOM,
      r = n > i - s - 4 ? i : n;
    try {
      for (let t = 0; ; t++) {
        this.updateState = 1;
        let i = this.viewport,
          n = this.viewState.lineBlockAtHeight(r),
          s = this.viewState.measure(this);
        if (!s && !this.measureRequests.length && null == this.viewState.scrollTarget) break;
        if (t > 5) {
          console.warn(
            this.measureRequests.length ? 'Measure loop restarted more than 5 times' : 'Viewport failed to stabilize',
          );
          break;
        }
        let o = [];
        4 & s || ([this.measureRequests, o] = [o, this.measureRequests]);
        let a = o.map((t) => {
            try {
              return t.read(this);
            } catch (t) {
              return un(this.state, t), gr;
            }
          }),
          l = Sn.create(this, this.state, []),
          h = !1,
          c = !1;
        (l.flags |= s),
          e ? (e.flags |= s) : (e = l),
          (this.updateState = 2),
          l.empty ||
            (this.updatePlugins(l), this.inputState.update(l), this.updateAttrs(), (h = this.docView.update(l)));
        for (let t = 0; t < o.length; t++)
          if (a[t] != gr)
            try {
              let e = o[t];
              e.write && e.write(a[t], this);
            } catch (t) {
              un(this.state, t);
            }
        if (this.viewState.scrollTarget)
          this.docView.scrollIntoView(this.viewState.scrollTarget), (this.viewState.scrollTarget = null), (c = !0);
        else {
          let t = this.viewState.lineBlockAt(n.from).top - n.top;
          (t > 1 || t < -1) && ((this.scrollDOM.scrollTop += t), (c = !0));
        }
        if (
          (h && this.docView.updateSelection(!0),
          this.viewport.from == i.from && this.viewport.to == i.to && !c && 0 == this.measureRequests.length)
        )
          break;
      }
    } finally {
      (this.updateState = 0), (this.measureScheduled = -1);
    }
    if (e && !e.empty) for (let t of this.state.facet(on)) t(e);
  }
  get themeClasses() {
    return nr + ' ' + (this.state.facet(ir) ? rr : sr) + ' ' + this.state.facet(er);
  }
  updateAttrs() {
    let t = Qr(this, mn, { class: 'cm-editor' + (this.hasFocus ? ' cm-focused ' : ' ') + this.themeClasses }),
      e = {
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
        translate: 'no',
        contenteditable: this.state.facet(On) ? 'true' : 'false',
        class: 'cm-content',
        style: `${Ti.tabSize}: ${this.state.tabSize}`,
        role: 'textbox',
        'aria-multiline': 'true',
      };
    this.state.readOnly && (e['aria-readonly'] = 'true'), Qr(this, Qn, e);
    let i = this.observer.ignore(() => {
      let i = Ei(this.contentDOM, this.contentAttrs, e),
        n = Ei(this.dom, this.editorAttrs, t);
      return i || n;
    });
    return (this.editorAttrs = t), (this.contentAttrs = e), i;
  }
  showAnnouncements(t) {
    let e = !0;
    for (let i of t)
      for (let t of i.effects)
        if (t.is(dr.announce)) {
          e && (this.announceDOM.textContent = ''),
            (e = !1),
            (this.announceDOM.appendChild(document.createElement('div')).textContent = t.value);
        }
  }
  mountStyles() {
    (this.styleModules = this.state.facet(xn)), Ze.mount(this.root, this.styleModules.concat(lr).reverse());
  }
  readMeasured() {
    if (2 == this.updateState) throw new Error("Reading the editor layout isn't allowed during an update");
    0 == this.updateState && this.measureScheduled > -1 && this.measure(!1);
  }
  requestMeasure(t) {
    if ((this.measureScheduled < 0 && (this.measureScheduled = requestAnimationFrame(() => this.measure())), t)) {
      if (null != t.key)
        for (let e = 0; e < this.measureRequests.length; e++)
          if (this.measureRequests[e].key === t.key) return void (this.measureRequests[e] = t);
      this.measureRequests.push(t);
    }
  }
  plugin(t) {
    let e = this.pluginMap.get(t);
    return (
      (void 0 === e || (e && e.spec != t)) &&
        this.pluginMap.set(t, (e = this.plugins.find((e) => e.spec == t) || null)),
      e && e.update(this).value
    );
  }
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  elementAtHeight(t) {
    return this.readMeasured(), this.viewState.elementAtHeight(t);
  }
  lineBlockAtHeight(t) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(t);
  }
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  lineBlockAt(t) {
    return this.viewState.lineBlockAt(t);
  }
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  moveByChar(t, e, i) {
    return ss(this, t, ns(this, t, e, i));
  }
  moveByGroup(t, e) {
    return ss(
      this,
      t,
      ns(this, t, e, (e) =>
        (function (t, e, i) {
          let n = t.state.charCategorizer(e),
            s = n(i);
          return (t) => {
            let e = n(t);
            return s == le.Space && (s = e), s == e;
          };
        })(this, t.head, e),
      ),
    );
  }
  moveToLineBoundary(t, e, i = !0) {
    return (function (t, e, i, n) {
      let s = t.state.doc.lineAt(e.head),
        r = n && t.lineWrapping ? t.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head) : null;
      if (r) {
        let e = t.dom.getBoundingClientRect(),
          n = t.textDirectionAt(s.from),
          o = t.posAtCoords({ x: i == (n == kn.LTR) ? e.right - 1 : e.left + 1, y: (r.top + r.bottom) / 2 });
        if (null != o) return wt.cursor(o, i ? -1 : 1);
      }
      let o = Fi.find(t.docView, e.head),
        a = o ? (i ? o.posAtEnd : o.posAtStart) : i ? s.to : s.from;
      return wt.cursor(a, i ? -1 : 1);
    })(this, t, e, i);
  }
  moveVertically(t, e, i) {
    return ss(
      this,
      t,
      (function (t, e, i, n) {
        let s = e.head,
          r = i ? 1 : -1;
        if (s == (i ? t.state.doc.length : 0)) return wt.cursor(s, e.assoc);
        let o,
          a = e.goalColumn,
          l = t.contentDOM.getBoundingClientRect(),
          h = t.coordsAtPos(s),
          c = t.documentTop;
        if (h) null == a && (a = h.left - l.left), (o = r < 0 ? h.top : h.bottom);
        else {
          let e = t.viewState.lineBlockAt(s);
          null == a && (a = Math.min(l.right - l.left, t.defaultCharacterWidth * (s - e.from))),
            (o = (r < 0 ? e.top : e.bottom) + c);
        }
        let u = l.left + a,
          O = null != n ? n : t.defaultLineHeight >> 1;
        for (let i = 0; ; i += 10) {
          let n = o + (O + i) * r,
            h = es(t, { x: u, y: n }, !1, r);
          if (n < l.top || n > l.bottom || (r < 0 ? h < s : h > s)) return wt.cursor(h, e.assoc, void 0, a);
        }
      })(this, t, e, i),
    );
  }
  domAtPos(t) {
    return this.docView.domAtPos(t);
  }
  posAtDOM(t, e = 0) {
    return this.docView.posFromDOM(t, e);
  }
  posAtCoords(t, e = !0) {
    return this.readMeasured(), es(this, t, e);
  }
  coordsAtPos(t, e = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(t, e);
    if (!i || i.left == i.right) return i;
    let n = this.state.doc.lineAt(t),
      s = this.bidiSpans(n);
    return ti(i, (s[Zn.find(s, t - n.from, -1, e)].dir == kn.LTR) == e > 0);
  }
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  textDirectionAt(t) {
    return !this.state.facet(ln) || t < this.viewport.from || t > this.viewport.to
      ? this.textDirection
      : (this.readMeasured(), this.docView.textDirectionAt(t));
  }
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  bidiSpans(t) {
    if (t.length > pr) return Dn(t.length);
    let e = this.textDirectionAt(t.from);
    for (let i of this.bidiCache) if (i.from == t.from && i.dir == e) return i.order;
    let i = (function (t, e) {
      let i = t.length,
        n = e == $n ? 1 : 2,
        s = e == $n ? 2 : 1;
      if (!t || (1 == n && !An.test(t))) return Dn(i);
      for (let e = 0, s = n, o = n; e < i; e++) {
        let i =
          (r = t.charCodeAt(e)) <= 247
            ? Rn[r]
            : 1424 <= r && r <= 1524
            ? 2
            : 1536 <= r && r <= 1785
            ? Cn[r - 1536]
            : 1774 <= r && r <= 2220
            ? 4
            : (8192 <= r && r <= 8203) || 8204 == r
            ? 256
            : 1;
        512 == i ? (i = s) : 8 == i && 4 == o && (i = 16), (jn[e] = 4 == i ? 2 : i), 7 & i && (o = i), (s = i);
      }
      var r;
      for (let t = 0, e = n, s = n; t < i; t++) {
        let n = jn[t];
        if (128 == n) t < i - 1 && e == jn[t + 1] && 24 & e ? (n = jn[t] = e) : (jn[t] = 256);
        else if (64 == n) {
          let n = t + 1;
          for (; n < i && 64 == jn[n]; ) n++;
          let r = (t && 8 == e) || (n < i && 8 == jn[n]) ? (1 == s ? 1 : 8) : 256;
          for (let e = t; e < n; e++) jn[e] = r;
          t = n - 1;
        } else 8 == n && 1 == s && (jn[t] = 1);
        (e = n), 7 & n && (s = n);
      }
      for (let e, r, o, a = 0, l = 0, h = 0; a < i; a++)
        if ((r = Wn[(e = t.charCodeAt(a))]))
          if (r < 0) {
            for (let t = l - 3; t >= 0; t -= 3)
              if (Xn[t + 1] == -r) {
                let e = Xn[t + 2],
                  i = 2 & e ? n : 4 & e ? (1 & e ? s : n) : 0;
                i && (jn[a] = jn[Xn[t]] = i), (l = t);
                break;
              }
          } else {
            if (189 == Xn.length) break;
            (Xn[l++] = a), (Xn[l++] = e), (Xn[l++] = h);
          }
        else if (2 == (o = jn[a]) || 1 == o) {
          let t = o == n;
          h = t ? 0 : 1;
          for (let e = l - 3; e >= 0; e -= 3) {
            let i = Xn[e + 2];
            if (2 & i) break;
            if (t) Xn[e + 2] |= 2;
            else {
              if (4 & i) break;
              Xn[e + 2] |= 4;
            }
          }
        }
      for (let t = 0; t < i; t++)
        if (256 == jn[t]) {
          let e = t + 1;
          for (; e < i && 256 == jn[e]; ) e++;
          let s = 1 == (t ? jn[t - 1] : n),
            r = s == (1 == (e < i ? jn[e] : n)) ? (s ? 1 : 2) : n;
          for (let i = t; i < e; i++) jn[i] = r;
          t = e - 1;
        }
      let o = [];
      if (1 == n)
        for (let t = 0; t < i; ) {
          let e = t,
            n = 1 != jn[t++];
          for (; t < i && n == (1 != jn[t]); ) t++;
          if (n)
            for (let i = t; i > e; ) {
              let t = i,
                n = 2 != jn[--i];
              for (; i > e && n == (2 != jn[i - 1]); ) i--;
              o.push(new Zn(i, t, n ? 2 : 1));
            }
          else o.push(new Zn(e, t, 0));
        }
      else
        for (let t = 0; t < i; ) {
          let e = t,
            n = 2 == jn[t++];
          for (; t < i && n == (2 == jn[t]); ) t++;
          o.push(new Zn(e, t, n ? 1 : 2));
        }
      return o;
    })(t.text, e);
    return this.bidiCache.push(new mr(t.from, t.to, e, i)), i;
  }
  get hasFocus() {
    var t;
    return (
      (document.hasFocus() ||
        (Ti.safari &&
          (null === (t = this.inputState) || void 0 === t ? void 0 : t.lastContextMenu) > Date.now() - 3e4)) &&
      this.root.activeElement == this.contentDOM
    );
  }
  focus() {
    this.observer.ignore(() => {
      ri(this.contentDOM), this.docView.updateSelection();
    });
  }
  setRoot(t) {
    this._root != t &&
      ((this._root = t),
      this.observer.setWindow((9 == t.nodeType ? t : t.ownerDocument).defaultView),
      this.mountStyles());
  }
  destroy() {
    for (let t of this.plugins) t.destroy(this);
    (this.plugins = []),
      this.inputState.destroy(),
      this.dom.remove(),
      this.observer.destroy(),
      this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled),
      (this.destroyed = !0);
  }
  static scrollIntoView(t, e = {}) {
    return cn.of(new hn('number' == typeof t ? wt.cursor(t) : t, e.y, e.x, e.yMargin, e.xMargin));
  }
  static domEventHandlers(t) {
    return pn.define(() => ({}), { eventHandlers: t });
  }
  static theme(t, e) {
    let i = Ze.newName(),
      n = [er.of(i), xn.of(ar(`.${i}`, t))];
    return e && e.dark && n.push(ir.of(!0)), n;
  }
  static baseTheme(t) {
    return zt.lowest(xn.of(ar('.' + nr, t, or)));
  }
  static findFromDOM(t) {
    var e;
    let i = t.querySelector('.cm-content'),
      n = (i && ui.get(i)) || ui.get(t);
    return (null === (e = null == n ? void 0 : n.rootView) || void 0 === e ? void 0 : e.view) || null;
  }
}
(dr.styleModule = xn),
  (dr.inputHandler = an),
  (dr.perLineTextDirection = ln),
  (dr.exceptionSink = rn),
  (dr.updateListener = on),
  (dr.editable = On),
  (dr.mouseSelectionStyle = sn),
  (dr.dragMovesSelection = nn),
  (dr.clickAddsSelectionRange = en),
  (dr.decorations = bn),
  (dr.atomicRanges = yn),
  (dr.scrollMargins = wn),
  (dr.darkTheme = ir),
  (dr.contentAttributes = Qn),
  (dr.editorAttributes = mn),
  (dr.lineWrapping = dr.contentAttributes.of({ class: 'cm-lineWrapping' })),
  (dr.announce = te.define());
const pr = 4096,
  gr = {};
class mr {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.dir = i), (this.order = n);
  }
  static update(t, e) {
    if (e.empty) return t;
    let i = [],
      n = t.length ? t[t.length - 1].dir : kn.LTR;
    for (let s = Math.max(0, t.length - 10); s < t.length; s++) {
      let r = t[s];
      r.dir != n ||
        e.touchesRange(r.from, r.to) ||
        i.push(new mr(e.mapPos(r.from, 1), e.mapPos(r.to, -1), r.dir, r.order));
    }
    return i;
  }
}
function Qr(t, e, i) {
  for (let n = t.state.facet(e), s = n.length - 1; s >= 0; s--) {
    let e = n[s],
      r = 'function' == typeof e ? e(t) : e;
    r && _i(r, i);
  }
  return i;
}
const br = Ti.mac ? 'mac' : Ti.windows ? 'win' : Ti.linux ? 'linux' : 'key';
function yr(t, e, i) {
  return (
    e.altKey && (t = 'Alt-' + t),
    e.ctrlKey && (t = 'Ctrl-' + t),
    e.metaKey && (t = 'Meta-' + t),
    !1 !== i && e.shiftKey && (t = 'Shift-' + t),
    t
  );
}
const wr = zt.default(
    dr.domEventHandlers({
      keydown: (t, e) =>
        (function (t, e, i, n) {
          let s = (function (t) {
              var e =
                (!(
                  (Ge && (t.ctrlKey || t.altKey || t.metaKey)) ||
                  (Ee && t.shiftKey && t.key && 1 == t.key.length) ||
                  'Unidentified' == t.key
                ) &&
                  t.key) ||
                (t.shiftKey ? Me : ze)[t.keyCode] ||
                t.key ||
                'Unidentified';
              return (
                'Esc' == e && (e = 'Escape'),
                'Del' == e && (e = 'Delete'),
                'Left' == e && (e = 'ArrowLeft'),
                'Up' == e && (e = 'ArrowUp'),
                'Right' == e && (e = 'ArrowRight'),
                'Down' == e && (e = 'ArrowDown'),
                e
              );
            })(e),
            r = at(s, 0),
            o = ht(r) == s.length && ' ' != s,
            a = '',
            l = !1;
          Sr &&
            Sr.view == i &&
            Sr.scope == n &&
            ((a = Sr.prefix + ' '), (l = as.indexOf(e.keyCode) < 0) && (Sr = null));
          let h,
            c = (t) => {
              if (t) {
                for (let e of t.commands) if (e(i)) return !0;
                t.preventDefault && (l = !0);
              }
              return !1;
            },
            u = t[n];
          if (u) {
            if (c(u[a + yr(s, e, !o)])) return !0;
            if (o && (e.shiftKey || e.altKey || e.metaKey || r > 127) && (h = ze[e.keyCode]) && h != s) {
              if (c(u[a + yr(h, e, !0)])) return !0;
              if (e.shiftKey && Me[e.keyCode] != h && c(u[a + yr(Me[e.keyCode], e, !1)])) return !0;
            } else if (o && e.shiftKey && c(u[a + yr(s, e, !0)])) return !0;
          }
          return l;
        })(
          (function (t) {
            let e = t.facet(xr),
              i = vr.get(e);
            i ||
              vr.set(
                e,
                (i = (function (t, e = br) {
                  let i = Object.create(null),
                    n = Object.create(null),
                    s = (t, e) => {
                      let i = n[t];
                      if (null == i) n[t] = e;
                      else if (i != e)
                        throw new Error(
                          'Key binding ' + t + ' is used both as a regular binding and as a multi-stroke prefix',
                        );
                    },
                    r = (t, n, r, o) => {
                      let a = i[t] || (i[t] = Object.create(null)),
                        l = n.split(/ (?!$)/).map((t) =>
                          (function (t, e) {
                            const i = t.split(/-(?!$)/);
                            let n,
                              s,
                              r,
                              o,
                              a = i[i.length - 1];
                            'Space' == a && (a = ' ');
                            for (let t = 0; t < i.length - 1; ++t) {
                              const a = i[t];
                              if (/^(cmd|meta|m)$/i.test(a)) o = !0;
                              else if (/^a(lt)?$/i.test(a)) n = !0;
                              else if (/^(c|ctrl|control)$/i.test(a)) s = !0;
                              else if (/^s(hift)?$/i.test(a)) r = !0;
                              else {
                                if (!/^mod$/i.test(a)) throw new Error('Unrecognized modifier name: ' + a);
                                'mac' == e ? (o = !0) : (s = !0);
                              }
                            }
                            return (
                              n && (a = 'Alt-' + a),
                              s && (a = 'Ctrl-' + a),
                              o && (a = 'Meta-' + a),
                              r && (a = 'Shift-' + a),
                              a
                            );
                          })(t, e),
                        );
                      for (let e = 1; e < l.length; e++) {
                        let i = l.slice(0, e).join(' ');
                        s(i, !0),
                          a[i] ||
                            (a[i] = {
                              preventDefault: !0,
                              commands: [
                                (e) => {
                                  let n = (Sr = { view: e, prefix: i, scope: t });
                                  return (
                                    setTimeout(() => {
                                      Sr == n && (Sr = null);
                                    }, 4e3),
                                    !0
                                  );
                                },
                              ],
                            });
                      }
                      let h = l.join(' ');
                      s(h, !1);
                      let c = a[h] || (a[h] = { preventDefault: !1, commands: [] });
                      c.commands.push(r), o && (c.preventDefault = !0);
                    };
                  for (let i of t) {
                    let t = i[e] || i.key;
                    if (t)
                      for (let e of i.scope ? i.scope.split(' ') : ['editor'])
                        r(e, t, i.run, i.preventDefault), i.shift && r(e, 'Shift-' + t, i.shift, i.preventDefault);
                  }
                  return i;
                })(e.reduce((t, e) => t.concat(e), []))),
              );
            return i;
          })(e.state),
          t,
          e,
          'editor',
        ),
    }),
  ),
  xr = St.define({ enables: wr }),
  vr = new WeakMap();
let Sr = null;
const kr = !Ti.ios,
  $r = St.define({
    combine: (t) =>
      fe(
        t,
        { cursorBlinkRate: 1200, drawRangeCursor: !0 },
        { cursorBlinkRate: (t, e) => Math.min(t, e), drawRangeCursor: (t, e) => t || e },
      ),
  });
function Tr(t = {}) {
  return [$r.of(t), Rr, Wr];
}
class Pr {
  constructor(t, e, i, n, s) {
    (this.left = t), (this.top = e), (this.width = i), (this.height = n), (this.className = s);
  }
  draw() {
    let t = document.createElement('div');
    return (t.className = this.className), this.adjust(t), t;
  }
  adjust(t) {
    (t.style.left = this.left + 'px'),
      (t.style.top = this.top + 'px'),
      this.width >= 0 && (t.style.width = this.width + 'px'),
      (t.style.height = this.height + 'px');
  }
  eq(t) {
    return (
      this.left == t.left &&
      this.top == t.top &&
      this.width == t.width &&
      this.height == t.height &&
      this.className == t.className
    );
  }
}
const Rr = pn.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.rangePieces = []),
          (this.cursors = []),
          (this.measureReq = { read: this.readPos.bind(this), write: this.drawSel.bind(this) }),
          (this.selectionLayer = t.scrollDOM.appendChild(document.createElement('div'))),
          (this.selectionLayer.className = 'cm-selectionLayer'),
          this.selectionLayer.setAttribute('aria-hidden', 'true'),
          (this.cursorLayer = t.scrollDOM.appendChild(document.createElement('div'))),
          (this.cursorLayer.className = 'cm-cursorLayer'),
          this.cursorLayer.setAttribute('aria-hidden', 'true'),
          t.requestMeasure(this.measureReq),
          this.setBlinkRate();
      }
      setBlinkRate() {
        this.cursorLayer.style.animationDuration = this.view.state.facet($r).cursorBlinkRate + 'ms';
      }
      update(t) {
        let e = t.startState.facet($r) != t.state.facet($r);
        (e || t.selectionSet || t.geometryChanged || t.viewportChanged) && this.view.requestMeasure(this.measureReq),
          t.transactions.some((t) => t.scrollIntoView) &&
            (this.cursorLayer.style.animationName =
              'cm-blink' == this.cursorLayer.style.animationName ? 'cm-blink2' : 'cm-blink'),
          e && this.setBlinkRate();
      }
      readPos() {
        let { state: t } = this.view,
          e = t.facet($r),
          i = t.selection.ranges
            .map((t) =>
              t.empty
                ? []
                : (function (t, e) {
                    if (e.to <= t.viewport.from || e.from >= t.viewport.to) return [];
                    let i = Math.max(e.from, t.viewport.from),
                      n = Math.min(e.to, t.viewport.to),
                      s = t.textDirection == kn.LTR,
                      r = t.contentDOM,
                      o = r.getBoundingClientRect(),
                      a = Xr(t),
                      l = window.getComputedStyle(r.firstChild),
                      h = o.left + parseInt(l.paddingLeft) + Math.min(0, parseInt(l.textIndent)),
                      c = o.right - parseInt(l.paddingRight),
                      u = Zr(t, i),
                      O = Zr(t, n),
                      f = u.type == Vi.Text ? u : null,
                      d = O.type == Vi.Text ? O : null;
                    t.lineWrapping && (f && (f = Ar(t, i, f)), d && (d = Ar(t, n, d)));
                    if (f && d && f.from == d.from) return g(m(e.from, e.to, f));
                    {
                      let i = f ? m(e.from, null, f) : Q(u, !1),
                        n = d ? m(null, e.to, d) : Q(O, !0),
                        s = [];
                      return (
                        (f || u).to < (d || O).from - 1
                          ? s.push(p(h, i.bottom, c, n.top))
                          : i.bottom < n.top &&
                            t.elementAtHeight((i.bottom + n.top) / 2).type == Vi.Text &&
                            (i.bottom = n.top = (i.bottom + n.top) / 2),
                        g(i).concat(s).concat(g(n))
                      );
                    }
                    function p(t, e, i, n) {
                      return new Pr(t - a.left, e - a.top - 0.01, i - t, n - e + 0.01, 'cm-selectionBackground');
                    }
                    function g({ top: t, bottom: e, horizontal: i }) {
                      let n = [];
                      for (let s = 0; s < i.length; s += 2) n.push(p(i[s], t, i[s + 1], e));
                      return n;
                    }
                    function m(e, i, n) {
                      let r = 1e9,
                        o = -1e9,
                        a = [];
                      function l(e, i, l, u, O) {
                        let f = t.coordsAtPos(e, e == n.to ? -2 : 2),
                          d = t.coordsAtPos(l, l == n.from ? 2 : -2);
                        (r = Math.min(f.top, d.top, r)),
                          (o = Math.max(f.bottom, d.bottom, o)),
                          O == kn.LTR
                            ? a.push(s && i ? h : f.left, s && u ? c : d.right)
                            : a.push(!s && u ? h : d.left, !s && i ? c : f.right);
                      }
                      let u = null != e ? e : n.from,
                        O = null != i ? i : n.to;
                      for (let n of t.visibleRanges)
                        if (n.to > u && n.from < O)
                          for (let s = Math.max(n.from, u), r = Math.min(n.to, O); ; ) {
                            let n = t.state.doc.lineAt(s);
                            for (let o of t.bidiSpans(n)) {
                              let t = o.from + n.from,
                                a = o.to + n.from;
                              if (t >= r) break;
                              a > s &&
                                l(Math.max(t, s), null == e && t <= u, Math.min(a, r), null == i && a >= O, o.dir);
                            }
                            if (((s = n.to + 1), s >= r)) break;
                          }
                      return (
                        0 == a.length && l(u, null == e, O, null == i, t.textDirection),
                        { top: r, bottom: o, horizontal: a }
                      );
                    }
                    function Q(t, e) {
                      let i = o.top + (e ? t.top : t.bottom);
                      return { top: i, bottom: i, horizontal: [] };
                    }
                  })(this.view, t),
            )
            .reduce((t, e) => t.concat(e)),
          n = [];
        for (let i of t.selection.ranges) {
          let s = i == t.selection.main;
          if (i.empty ? !s || kr : e.drawRangeCursor) {
            let t = jr(this.view, i, s);
            t && n.push(t);
          }
        }
        return { rangePieces: i, cursors: n };
      }
      drawSel({ rangePieces: t, cursors: e }) {
        if (t.length != this.rangePieces.length || t.some((t, e) => !t.eq(this.rangePieces[e]))) {
          this.selectionLayer.textContent = '';
          for (let e of t) this.selectionLayer.appendChild(e.draw());
          this.rangePieces = t;
        }
        if (e.length != this.cursors.length || e.some((t, e) => !t.eq(this.cursors[e]))) {
          let t = this.cursorLayer.children;
          if (t.length !== e.length) {
            this.cursorLayer.textContent = '';
            for (const t of e) this.cursorLayer.appendChild(t.draw());
          } else e.forEach((e, i) => e.adjust(t[i]));
          this.cursors = e;
        }
      }
      destroy() {
        this.selectionLayer.remove(), this.cursorLayer.remove();
      }
    },
  ),
  Cr = {
    '.cm-line': {
      '& ::selection': { backgroundColor: 'transparent !important' },
      '&::selection': { backgroundColor: 'transparent !important' },
    },
  };
kr && (Cr['.cm-line'].caretColor = 'transparent !important');
const Wr = zt.highest(dr.theme(Cr));
function Xr(t) {
  let e = t.scrollDOM.getBoundingClientRect();
  return {
    left: (t.textDirection == kn.LTR ? e.left : e.right - t.scrollDOM.clientWidth) - t.scrollDOM.scrollLeft,
    top: e.top - t.scrollDOM.scrollTop,
  };
}
function Ar(t, e, i) {
  let n = wt.cursor(e);
  return {
    from: Math.max(i.from, t.moveToLineBoundary(n, !1, !0).from),
    to: Math.min(i.to, t.moveToLineBoundary(n, !0, !0).from),
    type: Vi.Text,
  };
}
function Zr(t, e) {
  let i = t.lineBlockAt(e);
  if (Array.isArray(i.type))
    for (let t of i.type) if (t.to > e || (t.to == e && (t.to == i.to || t.type == Vi.Text))) return t;
  return i;
}
function jr(t, e, i) {
  let n = t.coordsAtPos(e.head, e.assoc || 1);
  if (!n) return null;
  let s = Xr(t);
  return new Pr(
    n.left - s.left,
    n.top - s.top,
    -1,
    n.bottom - n.top,
    i ? 'cm-cursor cm-cursor-primary' : 'cm-cursor cm-cursor-secondary',
  );
}
function Dr(t, e, i, n, s) {
  e.lastIndex = 0;
  for (let r, o = t.iterRange(i, n), a = i; !o.next().done; a += o.value.length)
    if (!o.lineBreak) for (; (r = e.exec(o.value)); ) s(a + r.index, r);
}
class zr {
  constructor(t) {
    const { regexp: e, decoration: i, decorate: n, boundary: s, maxLength: r = 1e3 } = t;
    if (!e.global) throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (((this.regexp = e), n)) this.addMatch = (t, e, i, s) => n(s, i, i + t[0].length, t, e);
    else {
      if (!i) throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
      {
        let t = 'function' == typeof i ? i : () => i;
        this.addMatch = (e, i, n, s) => s(n, n + e[0].length, t(e, i, n));
      }
    }
    (this.boundary = s), (this.maxLength = r);
  }
  createDeco(t) {
    let e = new be(),
      i = e.add.bind(e);
    for (let { from: e, to: n } of (function (t, e) {
      let i = t.visibleRanges;
      if (1 == i.length && i[0].from == t.viewport.from && i[0].to == t.viewport.to) return i;
      let n = [];
      for (let { from: s, to: r } of i)
        (s = Math.max(t.state.doc.lineAt(s).from, s - e)),
          (r = Math.min(t.state.doc.lineAt(r).to, r + e)),
          n.length && n[n.length - 1].to >= s ? (n[n.length - 1].to = r) : n.push({ from: s, to: r });
      return n;
    })(t, this.maxLength))
      Dr(t.state.doc, this.regexp, e, n, (e, n) => this.addMatch(n, t, e, i));
    return e.finish();
  }
  updateDeco(t, e) {
    let i = 1e9,
      n = -1;
    return (
      t.docChanged &&
        t.changes.iterChanges((e, s, r, o) => {
          o > t.view.viewport.from && r < t.view.viewport.to && ((i = Math.min(r, i)), (n = Math.max(o, n)));
        }),
      t.viewportChanged || n - i > 1e3
        ? this.createDeco(t.view)
        : n > -1
        ? this.updateRange(t.view, e.map(t.changes), i, n)
        : e
    );
  }
  updateRange(t, e, i, n) {
    for (let s of t.visibleRanges) {
      let r = Math.max(s.from, i),
        o = Math.min(s.to, n);
      if (o > r) {
        let i = t.state.doc.lineAt(r),
          n = i.to < o ? t.state.doc.lineAt(o) : i,
          a = Math.max(s.from, i.from),
          l = Math.min(s.to, n.to);
        if (this.boundary) {
          for (; r > i.from; r--)
            if (this.boundary.test(i.text[r - 1 - i.from])) {
              a = r;
              break;
            }
          for (; o < n.to; o++)
            if (this.boundary.test(n.text[o - n.from])) {
              l = o;
              break;
            }
        }
        let h,
          c = [],
          u = (t, e, i) => c.push(i.range(t, e));
        if (i == n)
          for (this.regexp.lastIndex = a - i.from; (h = this.regexp.exec(i.text)) && h.index < l - i.from; )
            this.addMatch(h, t, h.index + i.from, u);
        else Dr(t.state.doc, this.regexp, a, l, (e, i) => this.addMatch(i, t, e, u));
        e = e.update({ filterFrom: a, filterTo: l, filter: (t, e) => t < a || e > l, add: c });
      }
    }
    return e;
  }
}
const Mr = null != /x/.unicode ? 'gu' : 'g',
  _r = new RegExp('[\0-\b\n--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\ufeff￹-￼]', Mr),
  qr = {
    0: 'null',
    7: 'bell',
    8: 'backspace',
    10: 'newline',
    11: 'vertical tab',
    13: 'carriage return',
    27: 'escape',
    8203: 'zero width space',
    8204: 'zero width non-joiner',
    8205: 'zero width joiner',
    8206: 'left-to-right mark',
    8207: 'right-to-left mark',
    8232: 'line separator',
    8237: 'left-to-right override',
    8238: 'right-to-left override',
    8294: 'left-to-right isolate',
    8295: 'right-to-left isolate',
    8297: 'pop directional isolate',
    8233: 'paragraph separator',
    65279: 'zero width no-break space',
    65532: 'object replacement',
  };
let Er = null;
const Gr = St.define({
  combine(t) {
    let e = fe(t, { render: null, specialChars: _r, addSpecialChars: null });
    return (
      (e.replaceTabs = !(function () {
        var t;
        if (null == Er && 'undefined' != typeof document && document.body) {
          let e = document.body.style;
          Er = null != (null !== (t = e.tabSize) && void 0 !== t ? t : e.MozTabSize);
        }
        return Er || !1;
      })()) && (e.specialChars = new RegExp('\t|' + e.specialChars.source, Mr)),
      e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + '|' + e.addSpecialChars.source, Mr)),
      e
    );
  },
});
function Vr(t = {}) {
  return [
    Gr.of(t),
    Ir ||
      (Ir = pn.fromClass(
        class {
          constructor(t) {
            (this.view = t),
              (this.decorations = Ii.none),
              (this.decorationCache = Object.create(null)),
              (this.decorator = this.makeDecorator(t.state.facet(Gr))),
              (this.decorations = this.decorator.createDeco(t));
          }
          makeDecorator(t) {
            return new zr({
              regexp: t.specialChars,
              decoration: (e, i, n) => {
                let { doc: s } = i.state,
                  r = at(e[0], 0);
                if (9 == r) {
                  let t = s.lineAt(n),
                    e = i.state.tabSize,
                    r = Ce(t.text, e, n - t.from);
                  return Ii.replace({ widget: new Lr((e - (r % e)) * this.view.defaultCharacterWidth) });
                }
                return this.decorationCache[r] || (this.decorationCache[r] = Ii.replace({ widget: new Nr(t, r) }));
              },
              boundary: t.replaceTabs ? void 0 : /[^]/,
            });
          }
          update(t) {
            let e = t.state.facet(Gr);
            t.startState.facet(Gr) != e
              ? ((this.decorator = this.makeDecorator(e)), (this.decorations = this.decorator.createDeco(t.view)))
              : (this.decorations = this.decorator.updateDeco(t, this.decorations));
          }
        },
        { decorations: (t) => t.decorations },
      )),
  ];
}
let Ir = null;
class Nr extends Gi {
  constructor(t, e) {
    super(), (this.options = t), (this.code = e);
  }
  eq(t) {
    return t.code == this.code;
  }
  toDOM(t) {
    let e = (function (t) {
        return t >= 32 ? '•' : 10 == t ? '␤' : String.fromCharCode(9216 + t);
      })(this.code),
      i = t.state.phrase('Control character') + ' ' + (qr[this.code] || '0x' + this.code.toString(16)),
      n = this.options.render && this.options.render(this.code, i, e);
    if (n) return n;
    let s = document.createElement('span');
    return (s.textContent = e), (s.title = i), s.setAttribute('aria-label', i), (s.className = 'cm-specialChar'), s;
  }
  ignoreEvent() {
    return !1;
  }
}
class Lr extends Gi {
  constructor(t) {
    super(), (this.width = t);
  }
  eq(t) {
    return t.width == this.width;
  }
  toDOM() {
    let t = document.createElement('span');
    return (t.textContent = '\t'), (t.className = 'cm-tab'), (t.style.width = this.width + 'px'), t;
  }
  ignoreEvent() {
    return !1;
  }
}
const Ur = pn.fromClass(
  class {
    constructor() {
      (this.height = 1e3), (this.attrs = { style: 'padding-bottom: 1000px' });
    }
    update(t) {
      let e = t.view.viewState.editorHeight - t.view.defaultLineHeight;
      e != this.height && ((this.height = e), (this.attrs = { style: `padding-bottom: ${e}px` }));
    }
  },
);
function Br() {
  return [
    Ur,
    Qn.of((t) => {
      var e;
      return (null === (e = t.plugin(Ur)) || void 0 === e ? void 0 : e.attrs) || null;
    }),
  ];
}
class Yr extends Gi {
  constructor(t) {
    super(), (this.content = t);
  }
  toDOM() {
    let t = document.createElement('span');
    return (
      (t.className = 'cm-placeholder'),
      (t.style.pointerEvents = 'none'),
      t.appendChild('string' == typeof this.content ? document.createTextNode(this.content) : this.content),
      'string' == typeof this.content
        ? t.setAttribute('aria-label', 'placeholder ' + this.content)
        : t.setAttribute('aria-hidden', 'true'),
      t
    );
  }
  ignoreEvent() {
    return !1;
  }
}
function Fr(t) {
  return pn.fromClass(
    class {
      constructor(e) {
        (this.view = e), (this.placeholder = Ii.set([Ii.widget({ widget: new Yr(t), side: 1 }).range(0)]));
      }
      get decorations() {
        return this.view.state.doc.length ? Ii.none : this.placeholder;
      }
    },
    { decorations: (t) => t.decorations },
  );
}
class Hr {
  constructor(t, e, i) {
    (this.facet = e),
      (this.createTooltipView = i),
      (this.input = t.state.facet(e)),
      (this.tooltips = this.input.filter((t) => t)),
      (this.tooltipViews = this.tooltips.map(i));
  }
  update(t) {
    let e = t.state.facet(this.facet),
      i = e.filter((t) => t);
    if (e === this.input) {
      for (let e of this.tooltipViews) e.update && e.update(t);
      return !1;
    }
    let n = [];
    for (let e = 0; e < i.length; e++) {
      let s = i[e],
        r = -1;
      if (s) {
        for (let t = 0; t < this.tooltips.length; t++) {
          let e = this.tooltips[t];
          e && e.create == s.create && (r = t);
        }
        if (r < 0) n[e] = this.createTooltipView(s);
        else {
          let i = (n[e] = this.tooltipViews[r]);
          i.update && i.update(t);
        }
      }
    }
    for (let t of this.tooltipViews) n.indexOf(t) < 0 && t.dom.remove();
    return (this.input = e), (this.tooltips = i), (this.tooltipViews = n), !0;
  }
}
function Jr(t = {}) {
  return to.of(t);
}
function Kr() {
  return { top: 0, left: 0, bottom: innerHeight, right: innerWidth };
}
const to = St.define({
    combine: (t) => {
      var e, i, n;
      return {
        position: Ti.ios
          ? 'absolute'
          : (null === (e = t.find((t) => t.position)) || void 0 === e ? void 0 : e.position) || 'fixed',
        parent: (null === (i = t.find((t) => t.parent)) || void 0 === i ? void 0 : i.parent) || null,
        tooltipSpace: (null === (n = t.find((t) => t.tooltipSpace)) || void 0 === n ? void 0 : n.tooltipSpace) || Kr,
      };
    },
  }),
  eo = pn.fromClass(
    class {
      constructor(t) {
        var e;
        (this.view = t), (this.inView = !0), (this.lastTransaction = 0), (this.measureTimeout = -1);
        let i = t.state.facet(to);
        (this.position = i.position),
          (this.parent = i.parent),
          (this.classes = t.themeClasses),
          this.createContainer(),
          (this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }),
          (this.manager = new Hr(t, so, (t) => this.createTooltip(t))),
          (this.intersectionObserver =
            'function' == typeof IntersectionObserver
              ? new IntersectionObserver(
                  (t) => {
                    Date.now() > this.lastTransaction - 50 &&
                      t.length > 0 &&
                      t[t.length - 1].intersectionRatio < 1 &&
                      this.measureSoon();
                  },
                  { threshold: [1] },
                )
              : null),
          this.observeIntersection(),
          null === (e = t.dom.ownerDocument.defaultView) ||
            void 0 === e ||
            e.addEventListener('resize', (this.measureSoon = this.measureSoon.bind(this))),
          this.maybeMeasure();
      }
      createContainer() {
        this.parent
          ? ((this.container = document.createElement('div')),
            (this.container.style.position = 'relative'),
            (this.container.className = this.view.themeClasses),
            this.parent.appendChild(this.container))
          : (this.container = this.view.dom);
      }
      observeIntersection() {
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
          for (let t of this.manager.tooltipViews) this.intersectionObserver.observe(t.dom);
        }
      }
      measureSoon() {
        this.measureTimeout < 0 &&
          (this.measureTimeout = setTimeout(() => {
            (this.measureTimeout = -1), this.maybeMeasure();
          }, 50));
      }
      update(t) {
        t.transactions.length && (this.lastTransaction = Date.now());
        let e = this.manager.update(t);
        e && this.observeIntersection();
        let i = e || t.geometryChanged,
          n = t.state.facet(to);
        if (n.position != this.position) {
          this.position = n.position;
          for (let t of this.manager.tooltipViews) t.dom.style.position = this.position;
          i = !0;
        }
        if (n.parent != this.parent) {
          this.parent && this.container.remove(), (this.parent = n.parent), this.createContainer();
          for (let t of this.manager.tooltipViews) this.container.appendChild(t.dom);
          i = !0;
        } else
          this.parent &&
            this.view.themeClasses != this.classes &&
            (this.classes = this.container.className = this.view.themeClasses);
        i && this.maybeMeasure();
      }
      createTooltip(t) {
        let e = t.create(this.view);
        if ((e.dom.classList.add('cm-tooltip'), t.arrow && !e.dom.querySelector('.cm-tooltip > .cm-tooltip-arrow'))) {
          let t = document.createElement('div');
          (t.className = 'cm-tooltip-arrow'), e.dom.appendChild(t);
        }
        return (
          (e.dom.style.position = this.position),
          (e.dom.style.top = '-10000px'),
          this.container.appendChild(e.dom),
          e.mount && e.mount(this.view),
          e
        );
      }
      destroy() {
        var t, e;
        null === (t = this.view.dom.ownerDocument.defaultView) ||
          void 0 === t ||
          t.removeEventListener('resize', this.measureSoon);
        for (let { dom: t } of this.manager.tooltipViews) t.remove();
        null === (e = this.intersectionObserver) || void 0 === e || e.disconnect(), clearTimeout(this.measureTimeout);
      }
      readMeasure() {
        let t = this.view.dom.getBoundingClientRect();
        return {
          editor: t,
          parent: this.parent ? this.container.getBoundingClientRect() : t,
          pos: this.manager.tooltips.map((t, e) => {
            let i = this.manager.tooltipViews[e];
            return i.getCoords ? i.getCoords(t.pos) : this.view.coordsAtPos(t.pos);
          }),
          size: this.manager.tooltipViews.map(({ dom: t }) => t.getBoundingClientRect()),
          space: this.view.state.facet(to).tooltipSpace(this.view),
        };
      }
      writeMeasure(t) {
        let { editor: e, space: i } = t,
          n = [];
        for (let s = 0; s < this.manager.tooltips.length; s++) {
          let r = this.manager.tooltips[s],
            o = this.manager.tooltipViews[s],
            { dom: a } = o,
            l = t.pos[s],
            h = t.size[s];
          if (
            !l ||
            l.bottom <= Math.max(e.top, i.top) ||
            l.top >= Math.min(e.bottom, i.bottom) ||
            l.right < Math.max(e.left, i.left) - 0.1 ||
            l.left > Math.min(e.right, i.right) + 0.1
          ) {
            a.style.top = '-10000px';
            continue;
          }
          let c = r.arrow ? o.dom.querySelector('.cm-tooltip-arrow') : null,
            u = c ? 7 : 0,
            O = h.right - h.left,
            f = h.bottom - h.top,
            d = o.offset || no,
            p = this.view.textDirection == kn.LTR,
            g =
              h.width > i.right - i.left
                ? p
                  ? i.left
                  : i.right - h.width
                : p
                ? Math.min(l.left - (c ? 14 : 0) + d.x, i.right - O)
                : Math.max(i.left, l.left - O + (c ? 14 : 0) - d.x),
            m = !!r.above;
          !r.strictSide &&
            (m ? l.top - (h.bottom - h.top) - d.y < i.top : l.bottom + (h.bottom - h.top) + d.y > i.bottom) &&
            m == i.bottom - l.bottom > l.top - i.top &&
            (m = !m);
          let Q = m ? l.top - f - u - d.y : l.bottom + u + d.y,
            b = g + O;
          if (!0 !== o.overlap)
            for (let t of n)
              t.left < b &&
                t.right > g &&
                t.top < Q + f &&
                t.bottom > Q &&
                (Q = m ? t.top - f - 2 - u : t.bottom + u + 2);
          'absolute' == this.position
            ? ((a.style.top = Q - t.parent.top + 'px'), (a.style.left = g - t.parent.left + 'px'))
            : ((a.style.top = Q + 'px'), (a.style.left = g + 'px')),
            c && (c.style.left = l.left + (p ? d.x : -d.x) - (g + 14 - 7) + 'px'),
            !0 !== o.overlap && n.push({ left: g, top: Q, right: b, bottom: Q + f }),
            a.classList.toggle('cm-tooltip-above', m),
            a.classList.toggle('cm-tooltip-below', !m),
            o.positioned && o.positioned();
        }
      }
      maybeMeasure() {
        if (
          this.manager.tooltips.length &&
          (this.view.inView && this.view.requestMeasure(this.measureReq),
          this.inView != this.view.inView && ((this.inView = this.view.inView), !this.inView))
        )
          for (let t of this.manager.tooltipViews) t.dom.style.top = '-10000px';
      }
    },
    {
      eventHandlers: {
        scroll() {
          this.maybeMeasure();
        },
      },
    },
  ),
  io = dr.baseTheme({
    '.cm-tooltip': { zIndex: 100 },
    '&light .cm-tooltip': { border: '1px solid #bbb', backgroundColor: '#f5f5f5' },
    '&light .cm-tooltip-section:not(:first-child)': { borderTop: '1px solid #bbb' },
    '&dark .cm-tooltip': { backgroundColor: '#333338', color: 'white' },
    '.cm-tooltip-arrow': {
      height: '7px',
      width: '14px',
      position: 'absolute',
      zIndex: -1,
      overflow: 'hidden',
      '&:before, &:after': {
        content: "''",
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
      },
      '.cm-tooltip-above &': {
        bottom: '-7px',
        '&:before': { borderTop: '7px solid #bbb' },
        '&:after': { borderTop: '7px solid #f5f5f5', bottom: '1px' },
      },
      '.cm-tooltip-below &': {
        top: '-7px',
        '&:before': { borderBottom: '7px solid #bbb' },
        '&:after': { borderBottom: '7px solid #f5f5f5', top: '1px' },
      },
    },
    '&dark .cm-tooltip .cm-tooltip-arrow': {
      '&:before': { borderTopColor: '#333338', borderBottomColor: '#333338' },
      '&:after': { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
    },
  }),
  no = { x: 0, y: 0 },
  so = St.define({ enables: [eo, io] });
function ro(t) {
  var e;
  null === (e = t.plugin(eo)) || void 0 === e || e.maybeMeasure();
}
const oo = St.define({
    combine(t) {
      let e, i;
      for (let n of t) (e = e || n.topContainer), (i = i || n.bottomContainer);
      return { topContainer: e, bottomContainer: i };
    },
  }),
  ao = pn.fromClass(
    class {
      constructor(t) {
        (this.input = t.state.facet(co)),
          (this.specs = this.input.filter((t) => t)),
          (this.panels = this.specs.map((e) => e(t)));
        let e = t.state.facet(oo);
        (this.top = new lo(t, !0, e.topContainer)),
          (this.bottom = new lo(t, !1, e.bottomContainer)),
          this.top.sync(this.panels.filter((t) => t.top)),
          this.bottom.sync(this.panels.filter((t) => !t.top));
        for (let t of this.panels) t.dom.classList.add('cm-panel'), t.mount && t.mount();
      }
      update(t) {
        let e = t.state.facet(oo);
        this.top.container != e.topContainer && (this.top.sync([]), (this.top = new lo(t.view, !0, e.topContainer))),
          this.bottom.container != e.bottomContainer &&
            (this.bottom.sync([]), (this.bottom = new lo(t.view, !1, e.bottomContainer))),
          this.top.syncClasses(),
          this.bottom.syncClasses();
        let i = t.state.facet(co);
        if (i != this.input) {
          let e = i.filter((t) => t),
            n = [],
            s = [],
            r = [],
            o = [];
          for (let i of e) {
            let e,
              a = this.specs.indexOf(i);
            a < 0 ? ((e = i(t.view)), o.push(e)) : ((e = this.panels[a]), e.update && e.update(t)),
              n.push(e),
              (e.top ? s : r).push(e);
          }
          (this.specs = e), (this.panels = n), this.top.sync(s), this.bottom.sync(r);
          for (let t of o) t.dom.classList.add('cm-panel'), t.mount && t.mount();
        } else for (let e of this.panels) e.update && e.update(t);
      }
      destroy() {
        this.top.sync([]), this.bottom.sync([]);
      }
    },
    {
      provide: (t) =>
        dr.scrollMargins.of((e) => {
          let i = e.plugin(t);
          return i && { top: i.top.scrollMargin(), bottom: i.bottom.scrollMargin() };
        }),
    },
  );
class lo {
  constructor(t, e, i) {
    (this.view = t),
      (this.top = e),
      (this.container = i),
      (this.dom = void 0),
      (this.classes = ''),
      (this.panels = []),
      this.syncClasses();
  }
  sync(t) {
    for (let e of this.panels) e.destroy && t.indexOf(e) < 0 && e.destroy();
    (this.panels = t), this.syncDOM();
  }
  syncDOM() {
    if (0 == this.panels.length) return void (this.dom && (this.dom.remove(), (this.dom = void 0)));
    if (!this.dom) {
      (this.dom = document.createElement('div')),
        (this.dom.className = this.top ? 'cm-panels cm-panels-top' : 'cm-panels cm-panels-bottom'),
        (this.dom.style[this.top ? 'top' : 'bottom'] = '0');
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let t = this.dom.firstChild;
    for (let e of this.panels)
      if (e.dom.parentNode == this.dom) {
        for (; t != e.dom; ) t = ho(t);
        t = t.nextSibling;
      } else this.dom.insertBefore(e.dom, t);
    for (; t; ) t = ho(t);
  }
  scrollMargin() {
    return !this.dom || this.container
      ? 0
      : Math.max(
          0,
          this.top
            ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top)
            : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) -
                this.dom.getBoundingClientRect().top,
        );
  }
  syncClasses() {
    if (this.container && this.classes != this.view.themeClasses) {
      for (let t of this.classes.split(' ')) t && this.container.classList.remove(t);
      for (let t of (this.classes = this.view.themeClasses).split(' ')) t && this.container.classList.add(t);
    }
  }
}
function ho(t) {
  let e = t.nextSibling;
  return t.remove(), e;
}
const co = St.define({ enables: ao });
class uo extends de {
  compare(t) {
    return this == t || (this.constructor == t.constructor && this.eq(t));
  }
  eq(t) {
    return !1;
  }
  destroy(t) {}
}
(uo.prototype.elementClass = ''),
  (uo.prototype.toDOM = void 0),
  (uo.prototype.mapMode = ut.TrackBefore),
  (uo.prototype.startSide = uo.prototype.endSide = -1),
  (uo.prototype.point = !0);
const Oo = St.define(),
  fo = {
    class: '',
    renderEmptyElements: !1,
    elementStyle: '',
    markers: () => Qe.empty,
    lineMarker: () => null,
    lineMarkerChange: null,
    initialSpacer: null,
    updateSpacer: null,
    domEventHandlers: {},
  },
  po = St.define();
function go(t) {
  return [Qo(), po.of(Object.assign(Object.assign({}, fo), t))];
}
const mo = St.define({ combine: (t) => t.some((t) => t) });
function Qo(t) {
  let e = [bo];
  return t && !1 === t.fixed && e.push(mo.of(!0)), e;
}
const bo = pn.fromClass(
  class {
    constructor(t) {
      (this.view = t),
        (this.prevViewport = t.viewport),
        (this.dom = document.createElement('div')),
        (this.dom.className = 'cm-gutters'),
        this.dom.setAttribute('aria-hidden', 'true'),
        (this.dom.style.minHeight = this.view.contentHeight + 'px'),
        (this.gutters = t.state.facet(po).map((e) => new vo(t, e)));
      for (let t of this.gutters) this.dom.appendChild(t.dom);
      (this.fixed = !t.state.facet(mo)),
        this.fixed && (this.dom.style.position = 'sticky'),
        this.syncGutters(!1),
        t.scrollDOM.insertBefore(this.dom, t.contentDOM);
    }
    update(t) {
      if (this.updateGutters(t)) {
        let e = this.prevViewport,
          i = t.view.viewport,
          n = Math.min(e.to, i.to) - Math.max(e.from, i.from);
        this.syncGutters(n < 0.8 * (i.to - i.from));
      }
      t.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + 'px'),
        this.view.state.facet(mo) != !this.fixed &&
          ((this.fixed = !this.fixed), (this.dom.style.position = this.fixed ? 'sticky' : '')),
        (this.prevViewport = t.view.viewport);
    }
    syncGutters(t) {
      let e = this.dom.nextSibling;
      t && this.dom.remove();
      let i = Qe.iter(this.view.state.facet(Oo), this.view.viewport.from),
        n = [],
        s = this.gutters.map((t) => new xo(t, this.view.viewport, -this.view.documentPadding.top));
      for (let t of this.view.viewportLineBlocks) {
        let e;
        if (Array.isArray(t.type)) {
          for (let i of t.type)
            if (i.type == Vi.Text) {
              e = i;
              break;
            }
        } else e = t.type == Vi.Text ? t : void 0;
        if (e) {
          n.length && (n = []), wo(i, n, t.from);
          for (let t of s) t.line(this.view, e, n);
        }
      }
      for (let t of s) t.finish();
      t && this.view.scrollDOM.insertBefore(this.dom, e);
    }
    updateGutters(t) {
      let e = t.startState.facet(po),
        i = t.state.facet(po),
        n =
          t.docChanged ||
          t.heightChanged ||
          t.viewportChanged ||
          !Qe.eq(t.startState.facet(Oo), t.state.facet(Oo), t.view.viewport.from, t.view.viewport.to);
      if (e == i) for (let e of this.gutters) e.update(t) && (n = !0);
      else {
        n = !0;
        let s = [];
        for (let n of i) {
          let i = e.indexOf(n);
          i < 0 ? s.push(new vo(this.view, n)) : (this.gutters[i].update(t), s.push(this.gutters[i]));
        }
        for (let t of this.gutters) t.dom.remove(), s.indexOf(t) < 0 && t.destroy();
        for (let t of s) this.dom.appendChild(t.dom);
        this.gutters = s;
      }
      return n;
    }
    destroy() {
      for (let t of this.gutters) t.destroy();
      this.dom.remove();
    }
  },
  {
    provide: (t) =>
      dr.scrollMargins.of((e) => {
        let i = e.plugin(t);
        return i && 0 != i.gutters.length && i.fixed
          ? e.textDirection == kn.LTR
            ? { left: i.dom.offsetWidth }
            : { right: i.dom.offsetWidth }
          : null;
      }),
  },
);
function yo(t) {
  return Array.isArray(t) ? t : [t];
}
function wo(t, e, i) {
  for (; t.value && t.from <= i; ) t.from == i && e.push(t.value), t.next();
}
class xo {
  constructor(t, e, i) {
    (this.gutter = t),
      (this.height = i),
      (this.localMarkers = []),
      (this.i = 0),
      (this.cursor = Qe.iter(t.markers, e.from));
  }
  line(t, e, i) {
    this.localMarkers.length && (this.localMarkers = []), wo(this.cursor, this.localMarkers, e.from);
    let n = i.length ? this.localMarkers.concat(i) : this.localMarkers,
      s = this.gutter.config.lineMarker(t, e, n);
    s && n.unshift(s);
    let r = this.gutter;
    if (0 == n.length && !r.config.renderEmptyElements) return;
    let o = e.top - this.height;
    if (this.i == r.elements.length) {
      let i = new So(t, e.height, o, n);
      r.elements.push(i), r.dom.appendChild(i.dom);
    } else r.elements[this.i].update(t, e.height, o, n);
    (this.height = e.bottom), this.i++;
  }
  finish() {
    let t = this.gutter;
    for (; t.elements.length > this.i; ) {
      let e = t.elements.pop();
      t.dom.removeChild(e.dom), e.destroy();
    }
  }
}
class vo {
  constructor(t, e) {
    (this.view = t),
      (this.config = e),
      (this.elements = []),
      (this.spacer = null),
      (this.dom = document.createElement('div')),
      (this.dom.className = 'cm-gutter' + (this.config.class ? ' ' + this.config.class : ''));
    for (let i in e.domEventHandlers)
      this.dom.addEventListener(i, (n) => {
        let s = t.lineBlockAtHeight(n.clientY - t.documentTop);
        e.domEventHandlers[i](t, s, n) && n.preventDefault();
      });
    (this.markers = yo(e.markers(t))),
      e.initialSpacer &&
        ((this.spacer = new So(t, 0, 0, [e.initialSpacer(t)])),
        this.dom.appendChild(this.spacer.dom),
        (this.spacer.dom.style.cssText += 'visibility: hidden; pointer-events: none'));
  }
  update(t) {
    let e = this.markers;
    if (((this.markers = yo(this.config.markers(t.view))), this.spacer && this.config.updateSpacer)) {
      let e = this.config.updateSpacer(this.spacer.markers[0], t);
      e != this.spacer.markers[0] && this.spacer.update(t.view, 0, 0, [e]);
    }
    let i = t.view.viewport;
    return !Qe.eq(this.markers, e, i.from, i.to) || (!!this.config.lineMarkerChange && this.config.lineMarkerChange(t));
  }
  destroy() {
    for (let t of this.elements) t.destroy();
  }
}
class So {
  constructor(t, e, i, n) {
    (this.height = -1),
      (this.above = 0),
      (this.markers = []),
      (this.dom = document.createElement('div')),
      (this.dom.className = 'cm-gutterElement'),
      this.update(t, e, i, n);
  }
  update(t, e, i, n) {
    this.height != e && (this.dom.style.height = (this.height = e) + 'px'),
      this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + 'px' : ''),
      (function (t, e) {
        if (t.length != e.length) return !1;
        for (let i = 0; i < t.length; i++) if (!t[i].compare(e[i])) return !1;
        return !0;
      })(this.markers, n) || this.setMarkers(t, n);
  }
  setMarkers(t, e) {
    let i = 'cm-gutterElement',
      n = this.dom.firstChild;
    for (let s = 0, r = 0; ; ) {
      let o = r,
        a = s < e.length ? e[s++] : null,
        l = !1;
      if (a) {
        let t = a.elementClass;
        t && (i += ' ' + t);
        for (let t = r; t < this.markers.length; t++)
          if (this.markers[t].compare(a)) {
            (o = t), (l = !0);
            break;
          }
      } else o = this.markers.length;
      for (; r < o; ) {
        let t = this.markers[r++];
        if (t.toDOM) {
          t.destroy(n);
          let e = n.nextSibling;
          n.remove(), (n = e);
        }
      }
      if (!a) break;
      a.toDOM && (l ? (n = n.nextSibling) : this.dom.insertBefore(a.toDOM(t), n)), l && r++;
    }
    (this.dom.className = i), (this.markers = e);
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
const ko = St.define(),
  $o = St.define({
    combine: (t) =>
      fe(
        t,
        { formatNumber: String, domEventHandlers: {} },
        {
          domEventHandlers(t, e) {
            let i = Object.assign({}, t);
            for (let t in e) {
              let n = i[t],
                s = e[t];
              i[t] = n ? (t, e, i) => n(t, e, i) || s(t, e, i) : s;
            }
            return i;
          },
        },
      ),
  });
class To extends uo {
  constructor(t) {
    super(), (this.number = t);
  }
  eq(t) {
    return this.number == t.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function Po(t, e) {
  return t.state.facet($o).formatNumber(e, t.state);
}
const Ro = po.compute([$o], (t) => ({
  class: 'cm-lineNumbers',
  renderEmptyElements: !1,
  markers: (t) => t.state.facet(ko),
  lineMarker: (t, e, i) => (i.some((t) => t.toDOM) ? null : new To(Po(t, t.state.doc.lineAt(e.from).number))),
  lineMarkerChange: (t) => t.startState.facet($o) != t.state.facet($o),
  initialSpacer: (t) => new To(Po(t, Wo(t.state.doc.lines))),
  updateSpacer(t, e) {
    let i = Po(e.view, Wo(e.view.state.doc.lines));
    return i == t.number ? t : new To(i);
  },
  domEventHandlers: t.facet($o).domEventHandlers,
}));
function Co(t = {}) {
  return [$o.of(t), Qo(), Ro];
}
function Wo(t) {
  let e = 9;
  for (; e < t; ) e = 10 * e + 9;
  return e;
}
let Xo = 0;
class Ao {
  constructor(t, e, i) {
    (this.set = t), (this.base = e), (this.modified = i), (this.id = Xo++);
  }
  static define(t) {
    if (null == t ? void 0 : t.base) throw new Error('Can not derive from a modified tag');
    let e = new Ao([], null, []);
    if ((e.set.push(e), t)) for (let i of t.set) e.set.push(i);
    return e;
  }
  static defineModifier() {
    let t = new jo();
    return (e) =>
      e.modified.indexOf(t) > -1
        ? e
        : jo.get(
            e.base || e,
            e.modified.concat(t).sort((t, e) => t.id - e.id),
          );
  }
}
let Zo = 0;
class jo {
  constructor() {
    (this.instances = []), (this.id = Zo++);
  }
  static get(t, e) {
    if (!e.length) return t;
    let i = e[0].instances.find((i) => {
      return i.base == t && ((n = e), (s = i.modified), n.length == s.length && n.every((t, e) => t == s[e]));
      var n, s;
    });
    if (i) return i;
    let n = [],
      s = new Ao(n, t, e);
    for (let t of e) t.instances.push(s);
    let r = (function (t) {
      let e = [[]];
      for (let i = 0; i < t.length; i++) for (let n = 0, s = e.length; n < s; n++) e.push(e[n].concat(t[i]));
      return e.sort((t, e) => e.length - t.length);
    })(e);
    for (let e of t.set) if (!e.modified.length) for (let t of r) n.push(jo.get(e, t));
    return s;
  }
}
function Do(t) {
  let e = Object.create(null);
  for (let i in t) {
    let n = t[i];
    Array.isArray(n) || (n = [n]);
    for (let t of i.split(' '))
      if (t) {
        let i = [],
          s = 2,
          r = t;
        for (let e = 0; ; ) {
          if ('...' == r && e > 0 && e + 3 == t.length) {
            s = 1;
            break;
          }
          let n = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(r);
          if (!n) throw new RangeError('Invalid path: ' + t);
          if ((i.push('*' == n[0] ? '' : '"' == n[0][0] ? JSON.parse(n[0]) : n[0]), (e += n[0].length), e == t.length))
            break;
          let o = t[e++];
          if (e == t.length && '!' == o) {
            s = 0;
            break;
          }
          if ('/' != o) throw new RangeError('Invalid path: ' + t);
          r = t.slice(e);
        }
        let o = i.length - 1,
          a = i[o];
        if (!a) throw new RangeError('Invalid path: ' + t);
        let l = new Mo(n, s, o > 0 ? i.slice(0, o) : null);
        e[a] = l.sort(e[a]);
      }
  }
  return zo.add(e);
}
const zo = new n();
class Mo {
  constructor(t, e, i, n) {
    (this.tags = t), (this.mode = e), (this.context = i), (this.next = n);
  }
  get opaque() {
    return 0 == this.mode;
  }
  get inherit() {
    return 1 == this.mode;
  }
  sort(t) {
    return !t || t.depth < this.depth ? ((this.next = t), this) : ((t.next = this.sort(t.next)), t);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
function _o(t, e) {
  let i = Object.create(null);
  for (let e of t)
    if (Array.isArray(e.tag)) for (let t of e.tag) i[t.id] = e.class;
    else i[e.tag.id] = e.class;
  let { scope: n, all: s = null } = e || {};
  return {
    style: (t) => {
      let e = s;
      for (let n of t)
        for (let t of n.set) {
          let n = i[t.id];
          if (n) {
            e = e ? e + ' ' + n : n;
            break;
          }
        }
      return e;
    },
    scope: n,
  };
}
function qo(t, e, i, n = 0, s = t.length) {
  let r = new Eo(n, Array.isArray(e) ? e : [e], i);
  r.highlightRange(t.cursor(), n, s, '', r.highlighters), r.flush(s);
}
Mo.empty = new Mo([], 2, null);
class Eo {
  constructor(t, e, i) {
    (this.at = t), (this.highlighters = e), (this.span = i), (this.class = '');
  }
  startSpan(t, e) {
    e != this.class && (this.flush(t), t > this.at && (this.at = t), (this.class = e));
  }
  flush(t) {
    t > this.at && this.class && this.span(this.at, t, this.class);
  }
  highlightRange(t, e, i, s, r) {
    let { type: o, from: a, to: l } = t;
    if (a >= i || l <= e) return;
    o.isTop && (r = this.highlighters.filter((t) => !t.scope || t.scope(o)));
    let h = s,
      c =
        (function (t) {
          let e = t.type.prop(zo);
          for (; e && e.context && !t.matchContext(e.context); ) e = e.next;
          return e || null;
        })(t) || Mo.empty,
      u = (function (t, e) {
        let i = null;
        for (let n of t) {
          let t = n.style(e);
          t && (i = i ? i + ' ' + t : t);
        }
        return i;
      })(r, c.tags);
    if (
      (u && (h && (h += ' '), (h += u), 1 == c.mode && (s += (s ? ' ' : '') + u)), this.startSpan(t.from, h), c.opaque)
    )
      return;
    let O = t.tree && t.tree.prop(n.mounted);
    if (O && O.overlay) {
      let n = t.node.enter(O.overlay[0].from + a, 1),
        o = this.highlighters.filter((t) => !t.scope || t.scope(O.tree.type)),
        c = t.firstChild();
      for (let u = 0, f = a; ; u++) {
        let d = u < O.overlay.length ? O.overlay[u] : null,
          p = d ? d.from + a : l,
          g = Math.max(e, f),
          m = Math.min(i, p);
        if (g < m && c)
          for (
            ;
            t.from < m &&
            (this.highlightRange(t, g, m, s, r), this.startSpan(Math.min(i, t.to), h), !(t.to >= p) && t.nextSibling());

          );
        if (!d || p > i) break;
        (f = d.to + a),
          f > e &&
            (this.highlightRange(n.cursor(), Math.max(e, d.from + a), Math.min(i, f), s, o), this.startSpan(f, h));
      }
      c && t.parent();
    } else if (t.firstChild()) {
      do {
        if (!(t.to <= e)) {
          if (t.from >= i) break;
          this.highlightRange(t, e, i, s, r), this.startSpan(Math.min(i, t.to), h);
        }
      } while (t.nextSibling());
      t.parent();
    }
  }
}
const Go = Ao.define,
  Vo = Go(),
  Io = Go(),
  No = Go(Io),
  Lo = Go(Io),
  Uo = Go(),
  Bo = Go(Uo),
  Yo = Go(Uo),
  Fo = Go(),
  Ho = Go(Fo),
  Jo = Go(),
  Ko = Go(),
  ta = Go(),
  ea = Go(ta),
  ia = Go(),
  na = {
    comment: Vo,
    lineComment: Go(Vo),
    blockComment: Go(Vo),
    docComment: Go(Vo),
    name: Io,
    variableName: Go(Io),
    typeName: No,
    tagName: Go(No),
    propertyName: Lo,
    attributeName: Go(Lo),
    className: Go(Io),
    labelName: Go(Io),
    namespace: Go(Io),
    macroName: Go(Io),
    literal: Uo,
    string: Bo,
    docString: Go(Bo),
    character: Go(Bo),
    attributeValue: Go(Bo),
    number: Yo,
    integer: Go(Yo),
    float: Go(Yo),
    bool: Go(Uo),
    regexp: Go(Uo),
    escape: Go(Uo),
    color: Go(Uo),
    url: Go(Uo),
    keyword: Jo,
    self: Go(Jo),
    null: Go(Jo),
    atom: Go(Jo),
    unit: Go(Jo),
    modifier: Go(Jo),
    operatorKeyword: Go(Jo),
    controlKeyword: Go(Jo),
    definitionKeyword: Go(Jo),
    moduleKeyword: Go(Jo),
    operator: Ko,
    derefOperator: Go(Ko),
    arithmeticOperator: Go(Ko),
    logicOperator: Go(Ko),
    bitwiseOperator: Go(Ko),
    compareOperator: Go(Ko),
    updateOperator: Go(Ko),
    definitionOperator: Go(Ko),
    typeOperator: Go(Ko),
    controlOperator: Go(Ko),
    punctuation: ta,
    separator: Go(ta),
    bracket: ea,
    angleBracket: Go(ea),
    squareBracket: Go(ea),
    paren: Go(ea),
    brace: Go(ea),
    content: Fo,
    heading: Ho,
    heading1: Go(Ho),
    heading2: Go(Ho),
    heading3: Go(Ho),
    heading4: Go(Ho),
    heading5: Go(Ho),
    heading6: Go(Ho),
    contentSeparator: Go(Fo),
    list: Go(Fo),
    quote: Go(Fo),
    emphasis: Go(Fo),
    strong: Go(Fo),
    link: Go(Fo),
    monospace: Go(Fo),
    strikethrough: Go(Fo),
    inserted: Go(),
    deleted: Go(),
    changed: Go(),
    invalid: Go(),
    meta: ia,
    documentMeta: Go(ia),
    annotation: Go(ia),
    processingInstruction: Go(ia),
    definition: Ao.defineModifier(),
    constant: Ao.defineModifier(),
    function: Ao.defineModifier(),
    standard: Ao.defineModifier(),
    local: Ao.defineModifier(),
    special: Ao.defineModifier(),
  };
var sa;
_o([
  { tag: na.link, class: 'tok-link' },
  { tag: na.heading, class: 'tok-heading' },
  { tag: na.emphasis, class: 'tok-emphasis' },
  { tag: na.strong, class: 'tok-strong' },
  { tag: na.keyword, class: 'tok-keyword' },
  { tag: na.atom, class: 'tok-atom' },
  { tag: na.bool, class: 'tok-bool' },
  { tag: na.url, class: 'tok-url' },
  { tag: na.labelName, class: 'tok-labelName' },
  { tag: na.inserted, class: 'tok-inserted' },
  { tag: na.deleted, class: 'tok-deleted' },
  { tag: na.literal, class: 'tok-literal' },
  { tag: na.string, class: 'tok-string' },
  { tag: na.number, class: 'tok-number' },
  { tag: [na.regexp, na.escape, na.special(na.string)], class: 'tok-string2' },
  { tag: na.variableName, class: 'tok-variableName' },
  { tag: na.local(na.variableName), class: 'tok-variableName tok-local' },
  { tag: na.definition(na.variableName), class: 'tok-variableName tok-definition' },
  { tag: na.special(na.variableName), class: 'tok-variableName2' },
  { tag: na.definition(na.propertyName), class: 'tok-propertyName tok-definition' },
  { tag: na.typeName, class: 'tok-typeName' },
  { tag: na.namespace, class: 'tok-namespace' },
  { tag: na.className, class: 'tok-className' },
  { tag: na.macroName, class: 'tok-macroName' },
  { tag: na.propertyName, class: 'tok-propertyName' },
  { tag: na.operator, class: 'tok-operator' },
  { tag: na.comment, class: 'tok-comment' },
  { tag: na.meta, class: 'tok-meta' },
  { tag: na.invalid, class: 'tok-invalid' },
  { tag: na.punctuation, class: 'tok-punctuation' },
]);
const ra = new n();
function oa(t) {
  return St.define({ combine: t ? (e) => e.concat(t) : void 0 });
}
class aa {
  constructor(t, e, i = []) {
    (this.data = t),
      Oe.prototype.hasOwnProperty('tree') ||
        Object.defineProperty(Oe.prototype, 'tree', {
          get() {
            return ca(this);
          },
        }),
      (this.parser = e),
      (this.extension = [ya.of(this), Oe.languageData.of((t, e, i) => t.facet(la(t, e, i)))].concat(i));
  }
  isActiveAt(t, e, i = -1) {
    return la(t, e, i) == this.data;
  }
  findRegions(t) {
    let e = t.facet(ya);
    if ((null == e ? void 0 : e.data) == this.data) return [{ from: 0, to: t.doc.length }];
    if (!e || !e.allowsNesting) return [];
    let i = [],
      s = (t, e) => {
        if (t.prop(ra) == this.data) return void i.push({ from: e, to: e + t.length });
        let r = t.prop(n.mounted);
        if (r) {
          if (r.tree.prop(ra) == this.data) {
            if (r.overlay) for (let t of r.overlay) i.push({ from: t.from + e, to: t.to + e });
            else i.push({ from: e, to: e + t.length });
            return;
          }
          if (r.overlay) {
            let t = i.length;
            if ((s(r.tree, r.overlay[0].from + e), i.length > t)) return;
          }
        }
        for (let i = 0; i < t.children.length; i++) {
          let n = t.children[i];
          n instanceof u && s(n, t.positions[i] + e);
        }
      };
    return s(ca(t), 0), i;
  }
  get allowsNesting() {
    return !0;
  }
}
function la(t, e, i) {
  let n = t.facet(ya);
  if (!n) return null;
  let s = n.data;
  if (n.allowsNesting) for (let n = ca(t).topNode; n; n = n.enter(e, i, c.ExcludeBuffers)) s = n.type.prop(ra) || s;
  return s;
}
aa.setState = te.define();
class ha extends aa {
  constructor(t, e) {
    super(t, e), (this.parser = e);
  }
  static define(t) {
    let e = oa(t.languageData);
    return new ha(e, t.parser.configure({ props: [ra.add((t) => (t.isTop ? e : void 0))] }));
  }
  configure(t) {
    return new ha(this.data, this.parser.configure(t));
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function ca(t) {
  let e = t.field(aa.state, !1);
  return e ? e.tree : u.empty;
}
function ua(t, e, i = 50) {
  var n;
  let s = null === (n = t.field(aa.state, !1)) || void 0 === n ? void 0 : n.context;
  return s && (s.isDone(e) || s.work(i, e)) ? s.tree : null;
}
class Oa {
  constructor(t, e = t.length) {
    (this.doc = t), (this.length = e), (this.cursorPos = 0), (this.string = ''), (this.cursor = t.iter());
  }
  syncTo(t) {
    return (
      (this.string = this.cursor.next(t - this.cursorPos).value),
      (this.cursorPos = t + this.string.length),
      this.cursorPos - this.string.length
    );
  }
  chunk(t) {
    return this.syncTo(t), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(t, e) {
    let i = this.cursorPos - this.string.length;
    return t < i || e >= this.cursorPos ? this.doc.sliceString(t, e) : this.string.slice(t - i, e - i);
  }
}
let fa = null;
class da {
  constructor(t, e, i = [], n, s, r, o, a) {
    (this.parser = t),
      (this.state = e),
      (this.fragments = i),
      (this.tree = n),
      (this.treeLen = s),
      (this.viewport = r),
      (this.skipped = o),
      (this.scheduleOn = a),
      (this.parse = null),
      (this.tempSkipped = []);
  }
  static create(t, e, i) {
    return new da(t, e, [], u.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new Oa(this.state.doc), this.fragments);
  }
  work(t, e) {
    return (
      null != e && e >= this.state.doc.length && (e = void 0),
      this.tree != u.empty && this.isDone(null != e ? e : this.state.doc.length)
        ? (this.takeTree(), !0)
        : this.withContext(() => {
            var i;
            if ('number' == typeof t) {
              let e = Date.now() + t;
              t = () => Date.now() > e;
            }
            for (
              this.parse || (this.parse = this.startParse()),
                null != e &&
                  (null == this.parse.stoppedAt || this.parse.stoppedAt > e) &&
                  e < this.state.doc.length &&
                  this.parse.stopAt(e);
              ;

            ) {
              let n = this.parse.advance();
              if (n) {
                if (
                  ((this.fragments = this.withoutTempSkipped(
                    P.addTree(n, this.fragments, null != this.parse.stoppedAt),
                  )),
                  (this.treeLen = null !== (i = this.parse.stoppedAt) && void 0 !== i ? i : this.state.doc.length),
                  (this.tree = n),
                  (this.parse = null),
                  !(this.treeLen < (null != e ? e : this.state.doc.length)))
                )
                  return !0;
                this.parse = this.startParse();
              }
              if (t()) return !1;
            }
          })
    );
  }
  takeTree() {
    let t, e;
    this.parse &&
      (t = this.parse.parsedPos) >= this.treeLen &&
      ((null == this.parse.stoppedAt || this.parse.stoppedAt > t) && this.parse.stopAt(t),
      this.withContext(() => {
        for (; !(e = this.parse.advance()); );
      }),
      (this.treeLen = t),
      (this.tree = e),
      (this.fragments = this.withoutTempSkipped(P.addTree(this.tree, this.fragments, !0))),
      (this.parse = null));
  }
  withContext(t) {
    let e = fa;
    fa = this;
    try {
      return t();
    } finally {
      fa = e;
    }
  }
  withoutTempSkipped(t) {
    for (let e; (e = this.tempSkipped.pop()); ) t = pa(t, e.from, e.to);
    return t;
  }
  changes(t, e) {
    let { fragments: i, tree: n, treeLen: s, viewport: r, skipped: o } = this;
    if ((this.takeTree(), !t.empty)) {
      let e = [];
      if (
        (t.iterChangedRanges((t, i, n, s) => e.push({ fromA: t, toA: i, fromB: n, toB: s })),
        (i = P.applyChanges(i, e)),
        (n = u.empty),
        (s = 0),
        (r = { from: t.mapPos(r.from, -1), to: t.mapPos(r.to, 1) }),
        this.skipped.length)
      ) {
        o = [];
        for (let e of this.skipped) {
          let i = t.mapPos(e.from, 1),
            n = t.mapPos(e.to, -1);
          i < n && o.push({ from: i, to: n });
        }
      }
    }
    return new da(this.parser, e, i, n, s, r, o, this.scheduleOn);
  }
  updateViewport(t) {
    if (this.viewport.from == t.from && this.viewport.to == t.to) return !1;
    this.viewport = t;
    let e = this.skipped.length;
    for (let e = 0; e < this.skipped.length; e++) {
      let { from: i, to: n } = this.skipped[e];
      i < t.to && n > t.from && ((this.fragments = pa(this.fragments, i, n)), this.skipped.splice(e--, 1));
    }
    return !(this.skipped.length >= e) && (this.reset(), !0);
  }
  reset() {
    this.parse && (this.takeTree(), (this.parse = null));
  }
  skipUntilInView(t, e) {
    this.skipped.push({ from: t, to: e });
  }
  static getSkippingParser(t) {
    return new (class extends R {
      createParse(e, i, n) {
        let s = n[0].from,
          r = n[n.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let e = fa;
            if (e) {
              for (let t of n) e.tempSkipped.push(t);
              t && (e.scheduleOn = e.scheduleOn ? Promise.all([e.scheduleOn, t]) : t);
            }
            return (this.parsedPos = r), new u(o.none, [], [], r - s);
          },
          stoppedAt: null,
          stopAt() {},
        };
      }
    })();
  }
  isDone(t) {
    t = Math.min(t, this.state.doc.length);
    let e = this.fragments;
    return this.treeLen >= t && e.length && 0 == e[0].from && e[0].to >= t;
  }
  static get() {
    return fa;
  }
}
function pa(t, e, i) {
  return P.applyChanges(t, [{ fromA: e, toA: i, fromB: e, toB: i }]);
}
class ga {
  constructor(t) {
    (this.context = t), (this.tree = t.tree);
  }
  apply(t) {
    if (!t.docChanged && this.tree == this.context.tree) return this;
    let e = this.context.changes(t.changes, t.state),
      i =
        this.context.treeLen == t.startState.doc.length
          ? void 0
          : Math.max(t.changes.mapPos(this.context.treeLen), e.viewport.to);
    return e.work(20, i) || e.takeTree(), new ga(e);
  }
  static init(t) {
    let e = Math.min(3e3, t.doc.length),
      i = da.create(t.facet(ya).parser, t, { from: 0, to: e });
    return i.work(20, e) || i.takeTree(), new ga(i);
  }
}
aa.state = Wt.define({
  create: ga.init,
  update(t, e) {
    for (let t of e.effects) if (t.is(aa.setState)) return t.value;
    return e.startState.facet(ya) != e.state.facet(ya) ? ga.init(e.state) : t.apply(e);
  },
});
let ma = (t) => {
  let e = setTimeout(() => t(), 500);
  return () => clearTimeout(e);
};
'undefined' != typeof requestIdleCallback &&
  (ma = (t) => {
    let e = -1,
      i = setTimeout(() => {
        e = requestIdleCallback(t, { timeout: 400 });
      }, 100);
    return () => (e < 0 ? clearTimeout(i) : cancelIdleCallback(e));
  });
const Qa =
    'undefined' != typeof navigator &&
    (null === (sa = navigator.scheduling) || void 0 === sa ? void 0 : sa.isInputPending)
      ? () => navigator.scheduling.isInputPending()
      : null,
  ba = pn.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.working = null),
          (this.workScheduled = 0),
          (this.chunkEnd = -1),
          (this.chunkBudget = -1),
          (this.work = this.work.bind(this)),
          this.scheduleWork();
      }
      update(t) {
        let e = this.view.state.field(aa.state).context;
        (e.updateViewport(t.view.viewport) || this.view.viewport.to > e.treeLen) && this.scheduleWork(),
          t.docChanged && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()),
          this.checkAsyncSchedule(e);
      }
      scheduleWork() {
        if (this.working) return;
        let { state: t } = this.view,
          e = t.field(aa.state);
        (e.tree == e.context.tree && e.context.isDone(t.doc.length)) || (this.working = ma(this.work));
      }
      work(t) {
        this.working = null;
        let e = Date.now();
        if (
          (this.chunkEnd < e &&
            (this.chunkEnd < 0 || this.view.hasFocus) &&
            ((this.chunkEnd = e + 3e4), (this.chunkBudget = 3e3)),
          this.chunkBudget <= 0)
        )
          return;
        let {
            state: i,
            viewport: { to: n },
          } = this.view,
          s = i.field(aa.state);
        if (s.tree == s.context.tree && s.context.isDone(n + 1e5)) return;
        let r = Date.now() + Math.min(this.chunkBudget, 100, t && !Qa ? Math.max(25, t.timeRemaining() - 5) : 1e9),
          o = s.context.treeLen < n && i.doc.length > n + 1e3,
          a = s.context.work(() => (Qa && Qa()) || Date.now() > r, n + (o ? 0 : 1e5));
        (this.chunkBudget -= Date.now() - e),
          (a || this.chunkBudget <= 0) &&
            (s.context.takeTree(), this.view.dispatch({ effects: aa.setState.of(new ga(s.context)) })),
          this.chunkBudget > 0 && (!a || o) && this.scheduleWork(),
          this.checkAsyncSchedule(s.context);
      }
      checkAsyncSchedule(t) {
        t.scheduleOn &&
          (this.workScheduled++,
          t.scheduleOn
            .then(() => this.scheduleWork())
            .catch((t) => un(this.view.state, t))
            .then(() => this.workScheduled--),
          (t.scheduleOn = null));
      }
      destroy() {
        this.working && this.working();
      }
      isWorking() {
        return !!(this.working || this.workScheduled > 0);
      }
    },
    {
      eventHandlers: {
        focus() {
          this.scheduleWork();
        },
      },
    },
  ),
  ya = St.define({ combine: (t) => (t.length ? t[0] : null), enables: [aa.state, ba] });
class wa {
  constructor(t, e = []) {
    (this.language = t), (this.support = e), (this.extension = [t, e]);
  }
}
class xa {
  constructor(t, e, i, n, s, r) {
    (this.name = t),
      (this.alias = e),
      (this.extensions = i),
      (this.filename = n),
      (this.loadFunc = s),
      (this.support = r),
      (this.loading = null);
  }
  load() {
    return (
      this.loading ||
      (this.loading = this.loadFunc().then(
        (t) => (this.support = t),
        (t) => {
          throw ((this.loading = null), t);
        },
      ))
    );
  }
  static of(t) {
    let { load: e, support: i } = t;
    if (!e) {
      if (!i) throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
      e = () => Promise.resolve(i);
    }
    return new xa(
      t.name,
      (t.alias || []).concat(t.name).map((t) => t.toLowerCase()),
      t.extensions || [],
      t.filename,
      e,
      i,
    );
  }
  static matchFilename(t, e) {
    for (let i of t) if (i.filename && i.filename.test(e)) return i;
    let i = /\.([^.]+)$/.exec(e);
    if (i) for (let e of t) if (e.extensions.indexOf(i[1]) > -1) return e;
    return null;
  }
  static matchLanguageName(t, e, i = !0) {
    e = e.toLowerCase();
    for (let i of t) if (i.alias.some((t) => t == e)) return i;
    if (i)
      for (let i of t)
        for (let t of i.alias) {
          let n = e.indexOf(t);
          if (n > -1 && (t.length > 2 || (!/\w/.test(e[n - 1]) && !/\w/.test(e[n + t.length])))) return i;
        }
    return null;
  }
}
const va = St.define(),
  Sa = St.define({
    combine: (t) => {
      if (!t.length) return '  ';
      if (!/^(?: +|\t+)$/.test(t[0])) throw new Error('Invalid indent unit: ' + JSON.stringify(t[0]));
      return t[0];
    },
  });
function ka(t) {
  let e = t.facet(Sa);
  return 9 == e.charCodeAt(0) ? t.tabSize * e.length : e.length;
}
function $a(t, e) {
  let i = '',
    n = t.tabSize;
  if (9 == t.facet(Sa).charCodeAt(0)) for (; e >= n; ) (i += '\t'), (e -= n);
  for (let t = 0; t < e; t++) i += ' ';
  return i;
}
function Ta(t, e) {
  t instanceof Oe && (t = new Pa(t));
  for (let i of t.state.facet(va)) {
    let n = i(t, e);
    if (null != n) return n;
  }
  let i = ca(t.state);
  return i
    ? (function (t, e, i) {
        return Wa(e.resolveInner(i).enterUnfinishedNodesBefore(i), i, t);
      })(t, i, e)
    : null;
}
class Pa {
  constructor(t, e = {}) {
    (this.state = t), (this.options = e), (this.unit = ka(t));
  }
  lineAt(t, e = 1) {
    let i = this.state.doc.lineAt(t),
      { simulateBreak: n, simulateDoubleBreak: s } = this.options;
    return null != n && n >= i.from && n <= i.to
      ? s && n == t
        ? { text: '', from: t }
        : (e < 0 ? n < t : n <= t)
        ? { text: i.text.slice(n - i.from), from: n }
        : { text: i.text.slice(0, n - i.from), from: i.from }
      : i;
  }
  textAfterPos(t, e = 1) {
    if (this.options.simulateDoubleBreak && t == this.options.simulateBreak) return '';
    let { text: i, from: n } = this.lineAt(t, e);
    return i.slice(t - n, Math.min(i.length, t + 100 - n));
  }
  column(t, e = 1) {
    let { text: i, from: n } = this.lineAt(t, e),
      s = this.countColumn(i, t - n),
      r = this.options.overrideIndentation ? this.options.overrideIndentation(n) : -1;
    return r > -1 && (s += r - this.countColumn(i, i.search(/\S|$/))), s;
  }
  countColumn(t, e = t.length) {
    return Ce(t, this.state.tabSize, e);
  }
  lineIndent(t, e = 1) {
    let { text: i, from: n } = this.lineAt(t, e),
      s = this.options.overrideIndentation;
    if (s) {
      let t = s(n);
      if (t > -1) return t;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Ra = new n();
function Ca(t) {
  let e = t.type.prop(Ra);
  if (e) return e;
  let i,
    s = t.firstChild;
  if (s && (i = s.type.prop(n.closedBy))) {
    let e = t.lastChild,
      n = e && i.indexOf(e.name) > -1;
    return (t) =>
      Da(
        t,
        !0,
        1,
        void 0,
        n &&
          !(function (t) {
            return t.pos == t.options.simulateBreak && t.options.simulateDoubleBreak;
          })(t)
          ? e.from
          : void 0,
      );
  }
  return null == t.parent ? Xa : null;
}
function Wa(t, e, i) {
  for (; t; t = t.parent) {
    let n = Ca(t);
    if (n) return n(Aa.create(i, e, t));
  }
  return null;
}
function Xa() {
  return 0;
}
class Aa extends Pa {
  constructor(t, e, i) {
    super(t.state, t.options), (this.base = t), (this.pos = e), (this.node = i);
  }
  static create(t, e, i) {
    return new Aa(t, e, i);
  }
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  get baseIndent() {
    let t = this.state.doc.lineAt(this.node.from);
    for (;;) {
      let e = this.node.resolve(t.from);
      for (; e.parent && e.parent.from == e.from; ) e = e.parent;
      if (Za(e, this.node)) break;
      t = this.state.doc.lineAt(e.from);
    }
    return this.lineIndent(t.from);
  }
  continue() {
    let t = this.node.parent;
    return t ? Wa(t, this.pos, this.base) : 0;
  }
}
function Za(t, e) {
  for (let i = e; i; i = i.parent) if (t == i) return !0;
  return !1;
}
function ja({ closing: t, align: e = !0, units: i = 1 }) {
  return (n) => Da(n, e, i, t);
}
function Da(t, e, i, n, s) {
  let r = t.textAfter,
    o = r.match(/^\s*/)[0].length,
    a = (n && r.slice(o, o + n.length) == n) || s == t.pos + o,
    l = e
      ? (function (t) {
          let e = t.node,
            i = e.childAfter(e.from),
            n = e.lastChild;
          if (!i) return null;
          let s = t.options.simulateBreak,
            r = t.state.doc.lineAt(i.from),
            o = null == s || s <= r.from ? r.to : Math.min(r.to, s);
          for (let t = i.to; ; ) {
            let s = e.childAfter(t);
            if (!s || s == n) return null;
            if (!s.type.isSkipped) return s.from < o ? i : null;
            t = s.to;
          }
        })(t)
      : null;
  return l ? (a ? t.column(l.from) : t.column(l.to)) : t.baseIndent + (a ? 0 : t.unit * i);
}
const za = (t) => t.baseIndent;
function Ma({ except: t, units: e = 1 } = {}) {
  return (i) => {
    let n = t && t.test(i.textAfter);
    return i.baseIndent + (n ? 0 : e * i.unit);
  };
}
function _a() {
  return Oe.transactionFilter.of((t) => {
    if (!t.docChanged || (!t.isUserEvent('input.type') && !t.isUserEvent('input.complete'))) return t;
    let e = t.startState.languageDataAt('indentOnInput', t.startState.selection.main.head);
    if (!e.length) return t;
    let i = t.newDoc,
      { head: n } = t.newSelection.main,
      s = i.lineAt(n);
    if (n > s.from + 200) return t;
    let r = i.sliceString(s.from, n);
    if (!e.some((t) => t.test(r))) return t;
    let { state: o } = t,
      a = -1,
      l = [];
    for (let { head: t } of o.selection.ranges) {
      let e = o.doc.lineAt(t);
      if (e.from == a) continue;
      a = e.from;
      let i = Ta(o, e.from);
      if (null == i) continue;
      let n = /^\s*/.exec(e.text)[0],
        s = $a(o, i);
      n != s && l.push({ from: e.from, to: e.from + n.length, insert: s });
    }
    return l.length ? [t, { changes: l, sequential: !0 }] : t;
  });
}
const qa = St.define(),
  Ea = new n();
function Ga(t) {
  let e = t.firstChild,
    i = t.lastChild;
  return e && e.to < i.from ? { from: e.to, to: i.type.isError ? t.to : i.from } : null;
}
function Va(t) {
  let e = t.lastChild;
  return e && e.to == t.to && e.type.isError;
}
function Ia(t, e, i) {
  for (let n of t.facet(qa)) {
    let s = n(t, e, i);
    if (s) return s;
  }
  return (function (t, e, i) {
    let n = ca(t);
    if (n.length < i) return null;
    let s = null;
    for (let r = n.resolveInner(i); r; r = r.parent) {
      if (r.to <= i || r.from > i) continue;
      if (s && r.from < e) break;
      let o = r.type.prop(Ea);
      if (o && (r.to < n.length - 50 || n.length == t.doc.length || !Va(r))) {
        let n = o(r, t);
        n && n.from <= i && n.from >= e && n.to > i && (s = n);
      }
    }
    return s;
  })(t, e, i);
}
function Na(t, e) {
  let i = e.mapPos(t.from, 1),
    n = e.mapPos(t.to, -1);
  return i >= n ? void 0 : { from: i, to: n };
}
const La = te.define({ map: Na }),
  Ua = te.define({ map: Na });
function Ba(t) {
  let e = [];
  for (let { head: i } of t.state.selection.ranges) e.some((t) => t.from <= i && t.to >= i) || e.push(t.lineBlockAt(i));
  return e;
}
const Ya = Wt.define({
  create: () => Ii.none,
  update(t, e) {
    t = t.map(e.changes);
    for (let i of e.effects)
      i.is(La) && !Ha(t, i.value.from, i.value.to)
        ? (t = t.update({ add: [sl.range(i.value.from, i.value.to)] }))
        : i.is(Ua) &&
          (t = t.update({
            filter: (t, e) => i.value.from != t || i.value.to != e,
            filterFrom: i.value.from,
            filterTo: i.value.to,
          }));
    if (e.selection) {
      let i = !1,
        { head: n } = e.selection.main;
      t.between(n, n, (t, e) => {
        t < n && e > n && (i = !0);
      }),
        i && (t = t.update({ filterFrom: n, filterTo: n, filter: (t, e) => e <= n || t >= n }));
    }
    return t;
  },
  provide: (t) => dr.decorations.from(t),
});
function Fa(t, e, i) {
  var n;
  let s = null;
  return (
    null === (n = t.field(Ya, !1)) ||
      void 0 === n ||
      n.between(e, i, (t, e) => {
        (!s || s.from > t) && (s = { from: t, to: e });
      }),
    s
  );
}
function Ha(t, e, i) {
  let n = !1;
  return (
    t.between(e, e, (t, s) => {
      t == e && s == i && (n = !0);
    }),
    n
  );
}
function Ja(t, e) {
  return t.field(Ya, !1) ? e : e.concat(te.appendConfig.of(nl()));
}
function Ka(t, e, i = !0) {
  let n = t.state.doc.lineAt(e.from).number,
    s = t.state.doc.lineAt(e.to).number;
  return dr.announce.of(`${t.state.phrase(i ? 'Folded lines' : 'Unfolded lines')} ${n} ${t.state.phrase('to')} ${s}.`);
}
const tl = [
    {
      key: 'Ctrl-Shift-[',
      mac: 'Cmd-Alt-[',
      run: (t) => {
        for (let e of Ba(t)) {
          let i = Ia(t.state, e.from, e.to);
          if (i) return t.dispatch({ effects: Ja(t.state, [La.of(i), Ka(t, i)]) }), !0;
        }
        return !1;
      },
    },
    {
      key: 'Ctrl-Shift-]',
      mac: 'Cmd-Alt-]',
      run: (t) => {
        if (!t.state.field(Ya, !1)) return !1;
        let e = [];
        for (let i of Ba(t)) {
          let n = Fa(t.state, i.from, i.to);
          n && e.push(Ua.of(n), Ka(t, n, !1));
        }
        return e.length && t.dispatch({ effects: e }), e.length > 0;
      },
    },
    {
      key: 'Ctrl-Alt-[',
      run: (t) => {
        let { state: e } = t,
          i = [];
        for (let n = 0; n < e.doc.length; ) {
          let s = t.lineBlockAt(n),
            r = Ia(e, s.from, s.to);
          r && i.push(La.of(r)), (n = (r ? t.lineBlockAt(r.to) : s).to + 1);
        }
        return i.length && t.dispatch({ effects: Ja(t.state, i) }), !!i.length;
      },
    },
    {
      key: 'Ctrl-Alt-]',
      run: (t) => {
        let e = t.state.field(Ya, !1);
        if (!e || !e.size) return !1;
        let i = [];
        return (
          e.between(0, t.state.doc.length, (t, e) => {
            i.push(Ua.of({ from: t, to: e }));
          }),
          t.dispatch({ effects: i }),
          !0
        );
      },
    },
  ],
  el = { placeholderDOM: null, placeholderText: '…' },
  il = St.define({ combine: (t) => fe(t, el) });
function nl(t) {
  let e = [Ya, ll];
  return t && e.push(il.of(t)), e;
}
const sl = Ii.replace({
    widget: new (class extends Gi {
      toDOM(t) {
        let { state: e } = t,
          i = e.facet(il),
          n = (e) => {
            let i = t.lineBlockAt(t.posAtDOM(e.target)),
              n = Fa(t.state, i.from, i.to);
            n && t.dispatch({ effects: Ua.of(n) }), e.preventDefault();
          };
        if (i.placeholderDOM) return i.placeholderDOM(t, n);
        let s = document.createElement('span');
        return (
          (s.textContent = i.placeholderText),
          s.setAttribute('aria-label', e.phrase('folded code')),
          (s.title = e.phrase('unfold')),
          (s.className = 'cm-foldPlaceholder'),
          (s.onclick = n),
          s
        );
      }
    })(),
  }),
  rl = { openText: '⌄', closedText: '›', markerDOM: null, domEventHandlers: {}, foldingChanged: () => !1 };
class ol extends uo {
  constructor(t, e) {
    super(), (this.config = t), (this.open = e);
  }
  eq(t) {
    return this.config == t.config && this.open == t.open;
  }
  toDOM(t) {
    if (this.config.markerDOM) return this.config.markerDOM(this.open);
    let e = document.createElement('span');
    return (
      (e.textContent = this.open ? this.config.openText : this.config.closedText),
      (e.title = t.state.phrase(this.open ? 'Fold line' : 'Unfold line')),
      e
    );
  }
}
function al(t = {}) {
  let e = Object.assign(Object.assign({}, rl), t),
    i = new ol(e, !0),
    n = new ol(e, !1),
    s = pn.fromClass(
      class {
        constructor(t) {
          (this.from = t.viewport.from), (this.markers = this.buildMarkers(t));
        }
        update(t) {
          (t.docChanged ||
            t.viewportChanged ||
            t.startState.facet(ya) != t.state.facet(ya) ||
            t.startState.field(Ya, !1) != t.state.field(Ya, !1) ||
            ca(t.startState) != ca(t.state) ||
            e.foldingChanged(t)) &&
            (this.markers = this.buildMarkers(t.view));
        }
        buildMarkers(t) {
          let e = new be();
          for (let s of t.viewportLineBlocks) {
            let r = Fa(t.state, s.from, s.to) ? n : Ia(t.state, s.from, s.to) ? i : null;
            r && e.add(s.from, s.from, r);
          }
          return e.finish();
        }
      },
    ),
    { domEventHandlers: r } = e;
  return [
    s,
    go({
      class: 'cm-foldGutter',
      markers(t) {
        var e;
        return (null === (e = t.plugin(s)) || void 0 === e ? void 0 : e.markers) || Qe.empty;
      },
      initialSpacer: () => new ol(e, !1),
      domEventHandlers: Object.assign(Object.assign({}, r), {
        click: (t, e, i) => {
          if (r.click && r.click(t, e, i)) return !0;
          let n = Fa(t.state, e.from, e.to);
          if (n) return t.dispatch({ effects: Ua.of(n) }), !0;
          let s = Ia(t.state, e.from, e.to);
          return !!s && (t.dispatch({ effects: La.of(s) }), !0);
        },
      }),
    }),
    nl(),
  ];
}
const ll = dr.baseTheme({
  '.cm-foldPlaceholder': {
    backgroundColor: '#eee',
    border: '1px solid #ddd',
    color: '#888',
    borderRadius: '.2em',
    margin: '0 1px',
    padding: '0 1px',
    cursor: 'pointer',
  },
  '.cm-foldGutter span': { padding: '0 1px', cursor: 'pointer' },
});
class hl {
  constructor(t, e) {
    let i;
    function n(t) {
      let e = Ze.newName();
      return ((i || (i = Object.create(null)))['.' + e] = t), e;
    }
    const s = 'string' == typeof e.all ? e.all : e.all ? n(e.all) : void 0,
      r = e.scope;
    (this.scope = r instanceof aa ? (t) => t.prop(ra) == r.data : r ? (t) => t == r : void 0),
      (this.style = _o(
        t.map((t) => ({ tag: t.tag, class: t.class || n(Object.assign({}, t, { tag: null })) })),
        { all: s },
      ).style),
      (this.module = i ? new Ze(i) : null),
      (this.themeType = e.themeType);
  }
  static define(t, e) {
    return new hl(t, e || {});
  }
}
const cl = St.define(),
  ul = St.define({ combine: (t) => (t.length ? [t[0]] : null) });
function Ol(t) {
  let e = t.facet(cl);
  return e.length ? e : t.facet(ul);
}
function fl(t, e) {
  let i,
    n = [pl];
  return (
    t instanceof hl && (t.module && n.push(dr.styleModule.of(t.module)), (i = t.themeType)),
    (null == e ? void 0 : e.fallback)
      ? n.push(ul.of(t))
      : i
      ? n.push(cl.computeN([dr.darkTheme], (e) => (e.facet(dr.darkTheme) == ('dark' == i) ? [t] : [])))
      : n.push(cl.of(t)),
    n
  );
}
class dl {
  constructor(t) {
    (this.markCache = Object.create(null)),
      (this.tree = ca(t.state)),
      (this.decorations = this.buildDeco(t, Ol(t.state)));
  }
  update(t) {
    let e = ca(t.state),
      i = Ol(t.state),
      n = i != Ol(t.startState);
    e.length < t.view.viewport.to && !n && e.type == this.tree.type
      ? (this.decorations = this.decorations.map(t.changes))
      : (e != this.tree || t.viewportChanged || n) && ((this.tree = e), (this.decorations = this.buildDeco(t.view, i)));
  }
  buildDeco(t, e) {
    if (!e || !this.tree.length) return Ii.none;
    let i = new be();
    for (let { from: n, to: s } of t.visibleRanges)
      qo(
        this.tree,
        e,
        (t, e, n) => {
          i.add(t, e, this.markCache[n] || (this.markCache[n] = Ii.mark({ class: n })));
        },
        n,
        s,
      );
    return i.finish();
  }
}
const pl = zt.high(pn.fromClass(dl, { decorations: (t) => t.decorations }));
na.meta,
  na.link,
  na.heading,
  na.emphasis,
  na.strong,
  na.strikethrough,
  na.keyword,
  na.atom,
  na.bool,
  na.url,
  na.contentSeparator,
  na.labelName,
  na.literal,
  na.inserted,
  na.string,
  na.deleted,
  na.regexp,
  na.escape,
  na.string,
  na.variableName,
  na.variableName,
  na.typeName,
  na.namespace,
  na.className,
  na.variableName,
  na.macroName,
  na.propertyName,
  na.comment,
  na.invalid;
const gl = dr.baseTheme({
    '&.cm-focused .cm-matchingBracket': { backgroundColor: '#328c8252' },
    '&.cm-focused .cm-nonmatchingBracket': { backgroundColor: '#bb555544' },
  }),
  ml = St.define({
    combine: (t) => fe(t, { afterCursor: !0, brackets: '()[]{}', maxScanDistance: 1e4, renderMatch: yl }),
  }),
  Ql = Ii.mark({ class: 'cm-matchingBracket' }),
  bl = Ii.mark({ class: 'cm-nonmatchingBracket' });
function yl(t) {
  let e = [],
    i = t.matched ? Ql : bl;
  return e.push(i.range(t.start.from, t.start.to)), t.end && e.push(i.range(t.end.from, t.end.to)), e;
}
const wl = Wt.define({
    create: () => Ii.none,
    update(t, e) {
      if (!e.docChanged && !e.selection) return t;
      let i = [],
        n = e.state.facet(ml);
      for (let t of e.state.selection.ranges) {
        if (!t.empty) continue;
        let s =
          kl(e.state, t.head, -1, n) ||
          (t.head > 0 && kl(e.state, t.head - 1, 1, n)) ||
          (n.afterCursor &&
            (kl(e.state, t.head, 1, n) || (t.head < e.state.doc.length && kl(e.state, t.head + 1, -1, n))));
        s && (i = i.concat(n.renderMatch(s, e.state)));
      }
      return Ii.set(i, !0);
    },
    provide: (t) => dr.decorations.from(t),
  }),
  xl = [wl, gl];
function vl(t = {}) {
  return [ml.of(t), xl];
}
function Sl(t, e, i) {
  let s = t.prop(e < 0 ? n.openedBy : n.closedBy);
  if (s) return s;
  if (1 == t.name.length) {
    let n = i.indexOf(t.name);
    if (n > -1 && n % 2 == (e < 0 ? 1 : 0)) return [i[n + e]];
  }
  return null;
}
function kl(t, e, i, n = {}) {
  let s = n.maxScanDistance || 1e4,
    r = n.brackets || '()[]{}',
    o = ca(t),
    a = o.resolveInner(e, i);
  for (let n = a; n; n = n.parent) {
    let s = Sl(n.type, i, r);
    if (s && n.from < n.to) return $l(t, e, i, n, s, r);
  }
  return (function (t, e, i, n, s, r, o) {
    let a = i < 0 ? t.sliceDoc(e - 1, e) : t.sliceDoc(e, e + 1),
      l = o.indexOf(a);
    if (l < 0 || (l % 2 == 0) != i > 0) return null;
    let h = { from: i < 0 ? e - 1 : e, to: i > 0 ? e + 1 : e },
      c = t.doc.iterRange(e, i > 0 ? t.doc.length : 0),
      u = 0;
    for (let t = 0; !c.next().done && t <= r; ) {
      let r = c.value;
      i < 0 && (t += r.length);
      let a = e + t * i;
      for (let t = i > 0 ? 0 : r.length - 1, e = i > 0 ? r.length : -1; t != e; t += i) {
        let e = o.indexOf(r[t]);
        if (!(e < 0 || n.resolve(a + t, 1).type != s))
          if ((e % 2 == 0) == i > 0) u++;
          else {
            if (1 == u) return { start: h, end: { from: a + t, to: a + t + 1 }, matched: e >> 1 == l >> 1 };
            u--;
          }
      }
      i > 0 && (t += r.length);
    }
    return c.done ? { start: h, matched: !1 } : null;
  })(t, e, i, o, a.type, s, r);
}
function $l(t, e, i, n, s, r) {
  let o = n.parent,
    a = { from: n.from, to: n.to },
    l = 0,
    h = null == o ? void 0 : o.cursor();
  if (h && (i < 0 ? h.childBefore(n.from) : h.childAfter(n.to)))
    do {
      if (i < 0 ? h.to <= n.from : h.from >= n.to) {
        if (0 == l && s.indexOf(h.type.name) > -1 && h.from < h.to)
          return { start: a, end: { from: h.from, to: h.to }, matched: !0 };
        if (Sl(h.type, i, r)) l++;
        else if (Sl(h.type, -i, r) && (l--, 0 == l))
          return { start: a, end: h.from == h.to ? void 0 : { from: h.from, to: h.to }, matched: !1 };
      }
    } while (i < 0 ? h.prevSibling() : h.nextSibling());
  return { start: a, matched: !1 };
}
function Tl(t, e, i, n = 0, s = 0) {
  null == e && -1 == (e = t.search(/[^\s\u00a0]/)) && (e = t.length);
  let r = s;
  for (let s = n; s < e; s++) 9 == t.charCodeAt(s) ? (r += i - (r % i)) : r++;
  return r;
}
class Pl {
  constructor(t, e, i) {
    (this.string = t),
      (this.tabSize = e),
      (this.indentUnit = i),
      (this.pos = 0),
      (this.start = 0),
      (this.lastColumnPos = 0),
      (this.lastColumnValue = 0);
  }
  eol() {
    return this.pos >= this.string.length;
  }
  sol() {
    return 0 == this.pos;
  }
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  next() {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  }
  eat(t) {
    let e,
      i = this.string.charAt(this.pos);
    if (((e = 'string' == typeof t ? i == t : i && (t instanceof RegExp ? t.test(i) : t(i))), e)) return ++this.pos, i;
  }
  eatWhile(t) {
    let e = this.pos;
    for (; this.eat(t); );
    return this.pos > e;
  }
  eatSpace() {
    let t = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
    return this.pos > t;
  }
  skipToEnd() {
    this.pos = this.string.length;
  }
  skipTo(t) {
    let e = this.string.indexOf(t, this.pos);
    if (e > -1) return (this.pos = e), !0;
  }
  backUp(t) {
    this.pos -= t;
  }
  column() {
    return (
      this.lastColumnPos < this.start &&
        ((this.lastColumnValue = Tl(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue)),
        (this.lastColumnPos = this.start)),
      this.lastColumnValue
    );
  }
  indentation() {
    return Tl(this.string, null, this.tabSize);
  }
  match(t, e, i) {
    if ('string' == typeof t) {
      let n = (t) => (i ? t.toLowerCase() : t);
      return n(this.string.substr(this.pos, t.length)) == n(t) ? (!1 !== e && (this.pos += t.length), !0) : null;
    }
    {
      let i = this.string.slice(this.pos).match(t);
      return i && i.index > 0 ? null : (i && !1 !== e && (this.pos += i[0].length), i);
    }
  }
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function Rl(t) {
  if ('object' != typeof t) return t;
  let e = {};
  for (let i in t) {
    let n = t[i];
    e[i] = n instanceof Array ? n.slice() : n;
  }
  return e;
}
class Cl extends aa {
  constructor(t) {
    let e,
      i = oa(t.languageData),
      s = {
        token: (r = t).token,
        blankLine: r.blankLine || (() => {}),
        startState: r.startState || (() => !0),
        copyState: r.copyState || Rl,
        indent: r.indent || (() => null),
        languageData: r.languageData || {},
        tokenTable: r.tokenTable || jl,
      };
    var r;
    super(
      i,
      new (class extends R {
        createParse(t, i, n) {
          return new Al(e, t, i, n);
        }
      })(),
      [va.of((t, e) => this.getIndent(t, e))],
    ),
      (this.topNode = (function (t) {
        let e = o.define({ id: Dl.length, name: 'Document', props: [ra.add(() => t)] });
        return Dl.push(e), e;
      })(i)),
      (e = this),
      (this.streamParser = s),
      (this.stateAfter = new n({ perNode: !0 })),
      (this.tokenTable = t.tokenTable ? new ql(s.tokenTable) : El);
  }
  static define(t) {
    return new Cl(t);
  }
  getIndent(t, e) {
    let i = ca(t.state),
      n = i.resolve(e);
    for (; n && n.type != this.topNode; ) n = n.parent;
    if (!n) return null;
    let s,
      r,
      o = Wl(this, i, 0, n.from, e);
    if ((o ? ((r = o.state), (s = o.pos + 1)) : ((r = this.streamParser.startState(t.unit)), (s = 0)), e - s > 1e4))
      return null;
    for (; s < e; ) {
      let i = t.state.doc.lineAt(s),
        n = Math.min(e, i.to);
      if (i.length) {
        let e = new Pl(i.text, t.state.tabSize, t.unit);
        for (; e.pos < n - i.from; ) Zl(this.streamParser.token, e, r);
      } else this.streamParser.blankLine(r, t.unit);
      if (n == e) break;
      s = i.to + 1;
    }
    let { text: a } = t.lineAt(e);
    return this.streamParser.indent(r, /^\s*(.*)/.exec(a)[1], t);
  }
  get allowsNesting() {
    return !1;
  }
}
function Wl(t, e, i, n, s) {
  let r = i >= n && i + e.length <= s && e.prop(t.stateAfter);
  if (r) return { state: t.streamParser.copyState(r), pos: i + e.length };
  for (let r = e.children.length - 1; r >= 0; r--) {
    let o = e.children[r],
      a = i + e.positions[r],
      l = o instanceof u && a < s && Wl(t, o, a, n, s);
    if (l) return l;
  }
  return null;
}
function Xl(t, e, i, n, s) {
  if (s && i <= 0 && n >= e.length) return e;
  s || e.type != t.topNode || (s = !0);
  for (let r = e.children.length - 1; r >= 0; r--) {
    let o,
      a = e.positions[r],
      l = e.children[r];
    if (a < n && l instanceof u) {
      if (!(o = Xl(t, l, i - a, n - a, s))) break;
      return s ? new u(e.type, e.children.slice(0, r).concat(o), e.positions.slice(0, r + 1), a + o.length) : o;
    }
  }
  return null;
}
class Al {
  constructor(t, e, i, n) {
    (this.lang = t),
      (this.input = e),
      (this.fragments = i),
      (this.ranges = n),
      (this.stoppedAt = null),
      (this.chunks = []),
      (this.chunkPos = []),
      (this.chunk = []),
      (this.chunkReused = void 0),
      (this.rangeIndex = 0),
      (this.to = n[n.length - 1].to);
    let s = da.get(),
      r = n[0].from,
      { state: o, tree: a } = (function (t, e, i, n) {
        for (let n of e) {
          let e,
            s = n.from + (n.openStart ? 25 : 0),
            r = n.to - (n.openEnd ? 25 : 0),
            o = s <= i && r > i && Wl(t, n.tree, 0 - n.offset, i, r);
          if (o && (e = Xl(t, n.tree, i + n.offset, o.pos + n.offset, !1))) return { state: o.state, tree: e };
        }
        return { state: t.streamParser.startState(n ? ka(n) : 4), tree: u.empty };
      })(t, i, r, null == s ? void 0 : s.state);
    (this.state = o), (this.parsedPos = this.chunkStart = r + a.length);
    for (let t = 0; t < a.children.length; t++) this.chunks.push(a.children[t]), this.chunkPos.push(a.positions[t]);
    s &&
      this.parsedPos < s.viewport.from - 1e5 &&
      ((this.state = this.lang.streamParser.startState(ka(s.state))),
      s.skipUntilInView(this.parsedPos, s.viewport.from),
      (this.parsedPos = s.viewport.from)),
      this.moveRangeIndex();
  }
  advance() {
    let t = da.get(),
      e = null == this.stoppedAt ? this.to : Math.min(this.to, this.stoppedAt),
      i = Math.min(e, this.chunkStart + 2048);
    for (t && (i = Math.min(i, t.viewport.to)); this.parsedPos < i; ) this.parseLine(t);
    return (
      this.chunkStart < this.parsedPos && this.finishChunk(),
      this.parsedPos >= e
        ? this.finish()
        : t && this.parsedPos >= t.viewport.to
        ? (t.skipUntilInView(this.parsedPos, e), this.finish())
        : null
    );
  }
  stopAt(t) {
    this.stoppedAt = t;
  }
  lineAfter(t) {
    let e = this.input.chunk(t);
    if (this.input.lineChunks) '\n' == e && (e = '');
    else {
      let t = e.indexOf('\n');
      t > -1 && (e = e.slice(0, t));
    }
    return t + e.length <= this.to ? e : e.slice(0, this.to - t);
  }
  nextLine() {
    let t = this.parsedPos,
      e = this.lineAfter(t),
      i = t + e.length;
    for (let t = this.rangeIndex; ; ) {
      let n = this.ranges[t].to;
      if (n >= i) break;
      if (((e = e.slice(0, n - (i - e.length))), t++, t == this.ranges.length)) break;
      let s = this.ranges[t].from,
        r = this.lineAfter(s);
      (e += r), (i = s + r.length);
    }
    return { line: e, end: i };
  }
  skipGapsTo(t, e, i) {
    for (;;) {
      let n = this.ranges[this.rangeIndex].to,
        s = t + e;
      if (i > 0 ? n > s : n >= s) break;
      e += this.ranges[++this.rangeIndex].from - n;
    }
    return e;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; ) this.rangeIndex++;
  }
  emitToken(t, e, i, n, s) {
    if (this.ranges.length > 1) {
      e += s = this.skipGapsTo(e, s, 1);
      let t = this.chunk.length;
      (i += s = this.skipGapsTo(i, s, -1)), (n += this.chunk.length - t);
    }
    return this.chunk.push(t, e, i, n), s;
  }
  parseLine(t) {
    let { line: e, end: i } = this.nextLine(),
      n = 0,
      { streamParser: s } = this.lang,
      r = new Pl(e, t ? t.state.tabSize : 4, t ? ka(t.state) : 2);
    if (r.eol()) s.blankLine(this.state, r.indentUnit);
    else
      for (; !r.eol(); ) {
        let t = Zl(s.token, r, this.state);
        if (
          (t &&
            (n = this.emitToken(
              this.lang.tokenTable.resolve(t),
              this.parsedPos + r.start,
              this.parsedPos + r.pos,
              4,
              n,
            )),
          r.start > 1e4)
        )
          break;
      }
    (this.parsedPos = i), this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let t = u.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: zl,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused,
    });
    (t = new u(t.type, t.children, t.positions, t.length, [
      [this.lang.stateAfter, this.lang.streamParser.copyState(this.state)],
    ])),
      this.chunks.push(t),
      this.chunkPos.push(this.chunkStart - this.ranges[0].from),
      (this.chunk = []),
      (this.chunkReused = void 0),
      (this.chunkStart = this.parsedPos);
  }
  finish() {
    return new u(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
}
function Zl(t, e, i) {
  e.start = e.pos;
  for (let n = 0; n < 10; n++) {
    let n = t(e, i);
    if (e.pos > e.start) return n;
  }
  throw new Error('Stream parser failed to advance stream.');
}
const jl = Object.create(null),
  Dl = [o.none],
  zl = new a(Dl),
  Ml = [],
  _l = Object.create(null);
for (let [t, e] of [
  ['variable', 'variableName'],
  ['variable-2', 'variableName.special'],
  ['string-2', 'string.special'],
  ['def', 'variableName.definition'],
  ['tag', 'typeName'],
  ['attribute', 'propertyName'],
  ['type', 'typeName'],
  ['builtin', 'variableName.standard'],
  ['qualifier', 'modifier'],
  ['error', 'invalid'],
  ['header', 'heading'],
  ['property', 'propertyName'],
])
  _l[t] = Vl(jl, e);
class ql {
  constructor(t) {
    (this.extra = t), (this.table = Object.assign(Object.create(null), _l));
  }
  resolve(t) {
    return t ? this.table[t] || (this.table[t] = Vl(this.extra, t)) : 0;
  }
}
const El = new ql(jl);
function Gl(t, e) {
  Ml.indexOf(t) > -1 || (Ml.push(t), console.warn(e));
}
function Vl(t, e) {
  let i = null;
  for (let n of e.split('.')) {
    let e = t[n] || na[n];
    e
      ? 'function' == typeof e
        ? i
          ? (i = e(i))
          : Gl(n, `Modifier ${n} used at start of tag`)
        : i
        ? Gl(n, `Tag ${n} used as modifier`)
        : (i = e)
      : Gl(n, `Unknown highlighting tag ${n}`);
  }
  if (!i) return 0;
  let n = e.replace(/ /g, '_'),
    s = o.define({ id: Dl.length, name: n, props: [Do({ [n]: i })] });
  return Dl.push(s), s.id;
}
class Il {
  constructor(t, e, i) {
    (this.state = t), (this.pos = e), (this.explicit = i), (this.abortListeners = []);
  }
  tokenBefore(t) {
    let e = ca(this.state).resolveInner(this.pos, -1);
    for (; e && t.indexOf(e.name) < 0; ) e = e.parent;
    return e ? { from: e.from, to: this.pos, text: this.state.sliceDoc(e.from, this.pos), type: e.type } : null;
  }
  matchBefore(t) {
    let e = this.state.doc.lineAt(this.pos),
      i = Math.max(e.from, this.pos - 250),
      n = e.text.slice(i - e.from, this.pos - e.from),
      s = n.search(Fl(t, !1));
    return s < 0 ? null : { from: i + s, to: this.pos, text: n.slice(s) };
  }
  get aborted() {
    return null == this.abortListeners;
  }
  addEventListener(t, e) {
    'abort' == t && this.abortListeners && this.abortListeners.push(e);
  }
}
function Nl(t) {
  let e = Object.keys(t).join(''),
    i = /\w/.test(e);
  return i && (e = e.replace(/\w/g, '')), `[${i ? '\\w' : ''}${e.replace(/[^\w\s]/g, '\\$&')}]`;
}
function Ll(t) {
  let e = t.map((t) => ('string' == typeof t ? { label: t } : t)),
    [i, n] = e.every((t) => /^\w+$/.test(t.label))
      ? [/\w*$/, /\w+$/]
      : (function (t) {
          let e = Object.create(null),
            i = Object.create(null);
          for (let { label: n } of t) {
            e[n[0]] = !0;
            for (let t = 1; t < n.length; t++) i[n[t]] = !0;
          }
          let n = Nl(e) + Nl(i) + '*$';
          return [new RegExp('^' + n), new RegExp(n)];
        })(e);
  return (t) => {
    let s = t.matchBefore(n);
    return s || t.explicit ? { from: s ? s.from : t.pos, options: e, validFor: i } : null;
  };
}
function Ul(t, e) {
  return (i) => {
    for (let e = ca(i.state).resolveInner(i.pos, -1); e; e = e.parent) if (t.indexOf(e.name) > -1) return null;
    return e(i);
  };
}
class Bl {
  constructor(t, e, i) {
    (this.completion = t), (this.source = e), (this.match = i);
  }
}
function Yl(t) {
  return t.selection.main.head;
}
function Fl(t, e) {
  var i;
  let { source: n } = t,
    s = e && '^' != n[0],
    r = '$' != n[n.length - 1];
  return s || r
    ? new RegExp(
        `${s ? '^' : ''}(?:${n})${r ? '$' : ''}`,
        null !== (i = t.flags) && void 0 !== i ? i : t.ignoreCase ? 'i' : '',
      )
    : t;
}
function Hl(t, e) {
  const i = e.completion.apply || e.completion.label;
  let n = e.source;
  var s, r, o, a;
  'string' == typeof i
    ? t.dispatch(
        ((s = t.state),
        (r = i),
        (o = n.from),
        (a = n.to),
        Object.assign(
          Object.assign(
            {},
            s.changeByRange((t) => {
              if (t == s.selection.main)
                return { changes: { from: o, to: a, insert: r }, range: wt.cursor(o + r.length) };
              let e = a - o;
              return !t.empty || (e && s.sliceDoc(t.from - e, t.from) != s.sliceDoc(o, a))
                ? { range: t }
                : { changes: { from: t.from - e, to: t.from, insert: r }, range: wt.cursor(t.from - e + r.length) };
            }),
          ),
          { userEvent: 'input.complete' },
        )),
      )
    : i(t, e.completion, n.from, n.to);
}
const Jl = new WeakMap();
function Kl(t) {
  if (!Array.isArray(t)) return t;
  let e = Jl.get(t);
  return e || Jl.set(t, (e = Ll(t))), e;
}
class th {
  constructor(t) {
    (this.pattern = t), (this.chars = []), (this.folded = []), (this.any = []), (this.precise = []), (this.byWord = []);
    for (let e = 0; e < t.length; ) {
      let i = at(t, e),
        n = ht(i);
      this.chars.push(i);
      let s = t.slice(e, e + n),
        r = s.toUpperCase();
      this.folded.push(at(r == s ? s.toLowerCase() : r, 0)), (e += n);
    }
    this.astral = t.length != this.chars.length;
  }
  match(t) {
    if (0 == this.pattern.length) return [0];
    if (t.length < this.pattern.length) return null;
    let { chars: e, folded: i, any: n, precise: s, byWord: r } = this;
    if (1 == e.length) {
      let n = at(t, 0);
      return n == e[0] ? [0, 0, ht(n)] : n == i[0] ? [-200, 0, ht(n)] : null;
    }
    let o = t.indexOf(this.pattern);
    if (0 == o) return [0, 0, this.pattern.length];
    let a = e.length,
      l = 0;
    if (o < 0) {
      for (let s = 0, r = Math.min(t.length, 200); s < r && l < a; ) {
        let r = at(t, s);
        (r != e[l] && r != i[l]) || (n[l++] = s), (s += ht(r));
      }
      if (l < a) return null;
    }
    let h = 0,
      c = 0,
      u = !1,
      O = 0,
      f = -1,
      d = -1,
      p = /[a-z]/.test(t),
      g = !0;
    for (let n = 0, l = Math.min(t.length, 200), m = 0; n < l && c < a; ) {
      let l = at(t, n);
      o < 0 &&
        (h < a && l == e[h] && (s[h++] = n),
        O < a && (l == e[O] || l == i[O] ? (0 == O && (f = n), (d = n + 1), O++) : (O = 0)));
      let Q,
        b =
          l < 255
            ? (l >= 48 && l <= 57) || (l >= 97 && l <= 122)
              ? 2
              : l >= 65 && l <= 90
              ? 1
              : 0
            : (Q = lt(l)) != Q.toLowerCase()
            ? 1
            : Q != Q.toUpperCase()
            ? 2
            : 0;
      (!n || (1 == b && p) || (0 == m && 0 != b)) &&
        (e[c] == l || (i[c] == l && (u = !0)) ? (r[c++] = n) : r.length && (g = !1)),
        (m = b),
        (n += ht(l));
    }
    return c == a && 0 == r[0] && g
      ? this.result((u ? -200 : 0) - 100, r, t)
      : O == a && 0 == f
      ? [-200 - t.length, 0, d]
      : o > -1
      ? [-700 - t.length, o, o + this.pattern.length]
      : O == a
      ? [-900 - t.length, f, d]
      : c == a
      ? this.result((u ? -200 : 0) - 100 - 700 + (g ? 0 : -1100), r, t)
      : 2 == e.length
      ? null
      : this.result((n[0] ? -700 : 0) - 200 - 1100, n, t);
  }
  result(t, e, i) {
    let n = [t - i.length],
      s = 1;
    for (let t of e) {
      let e = t + (this.astral ? ht(at(i, t)) : 1);
      s > 1 && n[s - 1] == t ? (n[s - 1] = e) : ((n[s++] = t), (n[s++] = e));
    }
    return n;
  }
}
const eh = St.define({
  combine: (t) =>
    fe(
      t,
      {
        activateOnTyping: !0,
        selectOnOpen: !0,
        override: null,
        closeOnBlur: !0,
        maxRenderedOptions: 100,
        defaultKeymap: !0,
        optionClass: () => '',
        aboveCursor: !1,
        icons: !0,
        addToOptions: [],
        compareCompletions: (t, e) => t.label.localeCompare(e.label),
      },
      {
        defaultKeymap: (t, e) => t && e,
        closeOnBlur: (t, e) => t && e,
        icons: (t, e) => t && e,
        optionClass: (t, e) => (i) =>
          (function (t, e) {
            return t ? (e ? t + ' ' + e : t) : e;
          })(t(i), e(i)),
        addToOptions: (t, e) => t.concat(e),
      },
    ),
});
function ih(t, e, i) {
  if (t <= i) return { from: 0, to: t };
  if ((e < 0 && (e = 0), e <= t >> 1)) {
    let t = Math.floor(e / i);
    return { from: t * i, to: (t + 1) * i };
  }
  let n = Math.floor((t - e) / i);
  return { from: t - (n + 1) * i, to: t - n * i };
}
class nh {
  constructor(t, e) {
    (this.view = t),
      (this.stateField = e),
      (this.info = null),
      (this.placeInfo = { read: () => this.measureInfo(), write: (t) => this.positionInfo(t), key: this });
    let i = t.state.field(e),
      { options: n, selected: s } = i.open,
      r = t.state.facet(eh);
    (this.optionContent = (function (t) {
      let e = t.addToOptions.slice();
      return (
        t.icons &&
          e.push({
            render(t) {
              let e = document.createElement('div');
              return (
                e.classList.add('cm-completionIcon'),
                t.type && e.classList.add(...t.type.split(/\s+/g).map((t) => 'cm-completionIcon-' + t)),
                e.setAttribute('aria-hidden', 'true'),
                e
              );
            },
            position: 20,
          }),
        e.push(
          {
            render(t, e, i) {
              let n = document.createElement('span');
              n.className = 'cm-completionLabel';
              let { label: s } = t,
                r = 0;
              for (let t = 1; t < i.length; ) {
                let e = i[t++],
                  o = i[t++];
                e > r && n.appendChild(document.createTextNode(s.slice(r, e)));
                let a = n.appendChild(document.createElement('span'));
                a.appendChild(document.createTextNode(s.slice(e, o))),
                  (a.className = 'cm-completionMatchedText'),
                  (r = o);
              }
              return r < s.length && n.appendChild(document.createTextNode(s.slice(r))), n;
            },
            position: 50,
          },
          {
            render(t) {
              if (!t.detail) return null;
              let e = document.createElement('span');
              return (e.className = 'cm-completionDetail'), (e.textContent = t.detail), e;
            },
            position: 80,
          },
        ),
        e.sort((t, e) => t.position - e.position).map((t) => t.render)
      );
    })(r)),
      (this.optionClass = r.optionClass),
      (this.range = ih(n.length, s, r.maxRenderedOptions)),
      (this.dom = document.createElement('div')),
      (this.dom.className = 'cm-tooltip-autocomplete'),
      this.dom.addEventListener('mousedown', (e) => {
        for (let i, s = e.target; s && s != this.dom; s = s.parentNode)
          if ('LI' == s.nodeName && (i = /-(\d+)$/.exec(s.id)) && +i[1] < n.length)
            return Hl(t, n[+i[1]]), void e.preventDefault();
      }),
      (this.list = this.dom.appendChild(this.createListBox(n, i.id, this.range))),
      this.list.addEventListener('scroll', () => {
        this.info && this.view.requestMeasure(this.placeInfo);
      });
  }
  mount() {
    this.updateSel();
  }
  update(t) {
    t.state.field(this.stateField) != t.startState.field(this.stateField) && this.updateSel();
  }
  positioned() {
    this.info && this.view.requestMeasure(this.placeInfo);
  }
  updateSel() {
    let t = this.view.state.field(this.stateField),
      e = t.open;
    if (
      ((e.selected < this.range.from || e.selected >= this.range.to) &&
        ((this.range = ih(e.options.length, e.selected, this.view.state.facet(eh).maxRenderedOptions)),
        this.list.remove(),
        (this.list = this.dom.appendChild(this.createListBox(e.options, t.id, this.range))),
        this.list.addEventListener('scroll', () => {
          this.info && this.view.requestMeasure(this.placeInfo);
        })),
      this.updateSelectedOption(e.selected))
    ) {
      this.info && (this.info.remove(), (this.info = null));
      let { completion: i } = e.options[e.selected],
        { info: n } = i;
      if (!n) return;
      let s = 'string' == typeof n ? document.createTextNode(n) : n(i);
      if (!s) return;
      'then' in s
        ? s
            .then((e) => {
              e && this.view.state.field(this.stateField, !1) == t && this.addInfoPane(e);
            })
            .catch((t) => un(this.view.state, t, 'completion info'))
        : this.addInfoPane(s);
    }
  }
  addInfoPane(t) {
    let e = (this.info = document.createElement('div'));
    (e.className = 'cm-tooltip cm-completionInfo'),
      e.appendChild(t),
      this.dom.appendChild(e),
      this.view.requestMeasure(this.placeInfo);
  }
  updateSelectedOption(t) {
    let e = null;
    for (let i = this.list.firstChild, n = this.range.from; i; i = i.nextSibling, n++)
      n == t
        ? i.hasAttribute('aria-selected') || (i.setAttribute('aria-selected', 'true'), (e = i))
        : i.hasAttribute('aria-selected') && i.removeAttribute('aria-selected');
    return (
      e &&
        (function (t, e) {
          let i = t.getBoundingClientRect(),
            n = e.getBoundingClientRect();
          n.top < i.top ? (t.scrollTop -= i.top - n.top) : n.bottom > i.bottom && (t.scrollTop += n.bottom - i.bottom);
        })(this.list, e),
      e
    );
  }
  measureInfo() {
    let t = this.dom.querySelector('[aria-selected]');
    if (!t || !this.info) return null;
    let e = this.dom.getBoundingClientRect(),
      i = this.info.getBoundingClientRect(),
      n = t.getBoundingClientRect();
    if (n.top > Math.min(innerHeight, e.bottom) - 10 || n.bottom < Math.max(0, e.top) + 10) return null;
    let s = Math.max(0, Math.min(n.top, innerHeight - i.height)) - e.top,
      r = this.view.textDirection == kn.RTL,
      o = e.left,
      a = innerWidth - e.right;
    return r && o < Math.min(i.width, a) ? (r = !1) : !r && a < Math.min(i.width, o) && (r = !0), { top: s, left: r };
  }
  positionInfo(t) {
    this.info &&
      ((this.info.style.top = (t ? t.top : -1e6) + 'px'),
      t &&
        (this.info.classList.toggle('cm-completionInfo-left', t.left),
        this.info.classList.toggle('cm-completionInfo-right', !t.left)));
  }
  createListBox(t, e, i) {
    const n = document.createElement('ul');
    (n.id = e),
      n.setAttribute('role', 'listbox'),
      n.setAttribute('aria-expanded', 'true'),
      n.setAttribute('aria-label', this.view.state.phrase('Completions'));
    for (let s = i.from; s < i.to; s++) {
      let { completion: i, match: r } = t[s];
      const o = n.appendChild(document.createElement('li'));
      (o.id = e + '-' + s), o.setAttribute('role', 'option');
      let a = this.optionClass(i);
      a && (o.className = a);
      for (let t of this.optionContent) {
        let e = t(i, this.view.state, r);
        e && o.appendChild(e);
      }
    }
    return (
      i.from && n.classList.add('cm-completionListIncompleteTop'),
      i.to < t.length && n.classList.add('cm-completionListIncompleteBottom'),
      n
    );
  }
}
function sh(t) {
  return 100 * (t.boost || 0) + (t.apply ? 10 : 0) + (t.info ? 5 : 0) + (t.type ? 1 : 0);
}
class rh {
  constructor(t, e, i, n, s) {
    (this.options = t), (this.attrs = e), (this.tooltip = i), (this.timestamp = n), (this.selected = s);
  }
  setSelected(t, e) {
    return t == this.selected || t >= this.options.length
      ? this
      : new rh(this.options, lh(e, t), this.tooltip, this.timestamp, t);
  }
  static build(t, e, i, n, s) {
    let r = (function (t, e) {
      let i = [],
        n = 0;
      for (let s of t)
        if (s.hasResult())
          if (!1 === s.result.filter) {
            let t = s.result.getMatch;
            for (let e of s.result.options) {
              let r = [1e9 - n++];
              if (t) for (let i of t(e)) r.push(i);
              i.push(new Bl(e, s, r));
            }
          } else {
            let t,
              n = new th(e.sliceDoc(s.from, s.to));
            for (let e of s.result.options)
              (t = n.match(e.label)) && (null != e.boost && (t[0] += e.boost), i.push(new Bl(e, s, t)));
          }
      let s = [],
        r = null,
        o = e.facet(eh).compareCompletions;
      for (let t of i.sort((t, e) => e.match[0] - t.match[0] || o(t.completion, e.completion)))
        !r ||
        r.label != t.completion.label ||
        r.detail != t.completion.detail ||
        (null != r.type && null != t.completion.type && r.type != t.completion.type) ||
        r.apply != t.completion.apply
          ? s.push(t)
          : sh(t.completion) > sh(r) && (s[s.length - 1] = t),
          (r = t.completion);
      return s;
    })(t, e);
    if (!r.length) return null;
    let o = e.facet(eh).selectOnOpen ? 0 : -1;
    if (n && n.selected != o && -1 != n.selected) {
      let t = n.options[n.selected].completion;
      for (let e = 0; e < r.length; e++)
        if (r[e].completion == t) {
          o = e;
          break;
        }
    }
    return new rh(
      r,
      lh(i, o),
      {
        pos: t.reduce((t, e) => (e.hasResult() ? Math.min(t, e.from) : t), 1e8),
        create: ((a = mh), (t) => new nh(t, a)),
        above: s.aboveCursor,
      },
      n ? n.timestamp : Date.now(),
      o,
    );
    var a;
  }
  map(t) {
    return new rh(
      this.options,
      this.attrs,
      Object.assign(Object.assign({}, this.tooltip), { pos: t.mapPos(this.tooltip.pos) }),
      this.timestamp,
      this.selected,
    );
  }
}
class oh {
  constructor(t, e, i) {
    (this.active = t), (this.id = e), (this.open = i);
  }
  static start() {
    return new oh(hh, 'cm-ac-' + Math.floor(2e6 * Math.random()).toString(36), null);
  }
  update(t) {
    let { state: e } = t,
      i = e.facet(eh),
      n = (i.override || e.languageDataAt('autocomplete', Yl(e)).map(Kl)).map((e) =>
        (this.active.find((t) => t.source == e) || new uh(e, this.active.some((t) => 0 != t.state) ? 1 : 0)).update(
          t,
          i,
        ),
      );
    n.length == this.active.length && n.every((t, e) => t == this.active[e]) && (n = this.active);
    let s =
      t.selection ||
      n.some((e) => e.hasResult() && t.changes.touchesRange(e.from, e.to)) ||
      !(function (t, e) {
        if (t == e) return !0;
        for (let i = 0, n = 0; ; ) {
          for (; i < t.length && !t[i].hasResult; ) i++;
          for (; n < e.length && !e[n].hasResult; ) n++;
          let s = i == t.length,
            r = n == e.length;
          if (s || r) return s == r;
          if (t[i++].result != e[n++].result) return !1;
        }
      })(n, this.active)
        ? rh.build(n, e, this.id, this.open, i)
        : this.open && t.docChanged
        ? this.open.map(t.changes)
        : this.open;
    !s &&
      n.every((t) => 1 != t.state) &&
      n.some((t) => t.hasResult()) &&
      (n = n.map((t) => (t.hasResult() ? new uh(t.source, 0) : t)));
    for (let e of t.effects) e.is(gh) && (s = s && s.setSelected(e.value, this.id));
    return n == this.active && s == this.open ? this : new oh(n, this.id, s);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : ah;
  }
}
const ah = { 'aria-autocomplete': 'list' };
function lh(t, e) {
  let i = { 'aria-autocomplete': 'list', 'aria-haspopup': 'listbox', 'aria-controls': t };
  return e > -1 && (i['aria-activedescendant'] = t + '-' + e), i;
}
const hh = [];
function ch(t) {
  return t.isUserEvent('input.type') ? 'input' : t.isUserEvent('delete.backward') ? 'delete' : null;
}
class uh {
  constructor(t, e, i = -1) {
    (this.source = t), (this.state = e), (this.explicitPos = i);
  }
  hasResult() {
    return !1;
  }
  update(t, e) {
    let i = ch(t),
      n = this;
    i
      ? (n = n.handleUserEvent(t, i, e))
      : t.docChanged
      ? (n = n.handleChange(t))
      : t.selection && 0 != n.state && (n = new uh(n.source, 0));
    for (let e of t.effects)
      if (e.is(fh)) n = new uh(n.source, 1, e.value ? Yl(t.state) : -1);
      else if (e.is(dh)) n = new uh(n.source, 0);
      else if (e.is(ph)) for (let t of e.value) t.source == n.source && (n = t);
    return n;
  }
  handleUserEvent(t, e, i) {
    return 'delete' != e && i.activateOnTyping ? new uh(this.source, 1) : this.map(t.changes);
  }
  handleChange(t) {
    return t.changes.touchesRange(Yl(t.startState)) ? new uh(this.source, 0) : this.map(t.changes);
  }
  map(t) {
    return t.empty || this.explicitPos < 0 ? this : new uh(this.source, this.state, t.mapPos(this.explicitPos));
  }
}
class Oh extends uh {
  constructor(t, e, i, n, s) {
    super(t, 2, e), (this.result = i), (this.from = n), (this.to = s);
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(t, e, i) {
    var n;
    let s = t.changes.mapPos(this.from),
      r = t.changes.mapPos(this.to, 1),
      o = Yl(t.state);
    if ((this.explicitPos < 0 ? o <= s : o < this.from) || o > r || ('delete' == e && Yl(t.startState) == this.from))
      return new uh(this.source, 'input' == e && i.activateOnTyping ? 1 : 0);
    let a,
      l = this.explicitPos < 0 ? -1 : t.changes.mapPos(this.explicitPos);
    return (function (t, e, i, n) {
      if (!t) return !1;
      let s = e.sliceDoc(i, n);
      return 'function' == typeof t ? t(s, i, n, e) : Fl(t, !0).test(s);
    })(this.result.validFor, t.state, s, r)
      ? new Oh(this.source, l, this.result, s, r)
      : this.result.update && (a = this.result.update(this.result, s, r, new Il(t.state, o, l >= 0)))
      ? new Oh(this.source, l, a, a.from, null !== (n = a.to) && void 0 !== n ? n : Yl(t.state))
      : new uh(this.source, 1, l);
  }
  handleChange(t) {
    return t.changes.touchesRange(this.from, this.to) ? new uh(this.source, 0) : this.map(t.changes);
  }
  map(t) {
    return t.empty
      ? this
      : new Oh(
          this.source,
          this.explicitPos < 0 ? -1 : t.mapPos(this.explicitPos),
          this.result,
          t.mapPos(this.from),
          t.mapPos(this.to, 1),
        );
  }
}
const fh = te.define(),
  dh = te.define(),
  ph = te.define({ map: (t, e) => t.map((t) => t.map(e)) }),
  gh = te.define(),
  mh = Wt.define({
    create: () => oh.start(),
    update: (t, e) => t.update(e),
    provide: (t) => [so.from(t, (t) => t.tooltip), dr.contentAttributes.from(t, (t) => t.attrs)],
  });
function Qh(t, e = 'option') {
  return (i) => {
    let n = i.state.field(mh, !1);
    if (!n || !n.open || Date.now() - n.open.timestamp < 75) return !1;
    let s,
      r = 1;
    'page' == e &&
      (s = (function (t, e) {
        let i = t.plugin(eo);
        if (!i) return null;
        let n = i.manager.tooltips.indexOf(e);
        return n < 0 ? null : i.manager.tooltipViews[n];
      })(i, n.open.tooltip)) &&
      (r = Math.max(2, Math.floor(s.dom.offsetHeight / s.dom.querySelector('li').offsetHeight) - 1));
    let { length: o } = n.open.options,
      a = n.open.selected > -1 ? n.open.selected + r * (t ? 1 : -1) : t ? 0 : o - 1;
    return (
      a < 0 ? (a = 'page' == e ? 0 : o - 1) : a >= o && (a = 'page' == e ? o - 1 : 0),
      i.dispatch({ effects: gh.of(a) }),
      !0
    );
  };
}
const bh = (t) => {
    let e = t.state.field(mh, !1);
    return (
      !(t.state.readOnly || !e || !e.open || Date.now() - e.open.timestamp < 75 || e.open.selected < 0) &&
      (Hl(t, e.open.options[e.open.selected]), !0)
    );
  },
  yh = (t) => !!t.state.field(mh, !1) && (t.dispatch({ effects: fh.of(!0) }), !0),
  wh = (t) => {
    let e = t.state.field(mh, !1);
    return !(!e || !e.active.some((t) => 0 != t.state)) && (t.dispatch({ effects: dh.of(null) }), !0);
  };
class xh {
  constructor(t, e) {
    (this.active = t), (this.context = e), (this.time = Date.now()), (this.updates = []), (this.done = void 0);
  }
}
const vh = pn.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.debounceUpdate = -1),
          (this.running = []),
          (this.debounceAccept = -1),
          (this.composing = 0);
        for (let e of t.state.field(mh).active) 1 == e.state && this.startQuery(e);
      }
      update(t) {
        let e = t.state.field(mh);
        if (!t.selectionSet && !t.docChanged && t.startState.field(mh) == e) return;
        let i = t.transactions.some((t) => (t.selection || t.docChanged) && !ch(t));
        for (let e = 0; e < this.running.length; e++) {
          let n = this.running[e];
          if (i || (n.updates.length + t.transactions.length > 50 && Date.now() - n.time > 1e3)) {
            for (let t of n.context.abortListeners)
              try {
                t();
              } catch (t) {
                un(this.view.state, t);
              }
            (n.context.abortListeners = null), this.running.splice(e--, 1);
          } else n.updates.push(...t.transactions);
        }
        if (
          (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate),
          (this.debounceUpdate = e.active.some(
            (t) => 1 == t.state && !this.running.some((e) => e.active.source == t.source),
          )
            ? setTimeout(() => this.startUpdate(), 50)
            : -1),
          0 != this.composing)
        )
          for (let e of t.transactions)
            'input' == ch(e) ? (this.composing = 2) : 2 == this.composing && e.selection && (this.composing = 3);
      }
      startUpdate() {
        this.debounceUpdate = -1;
        let { state: t } = this.view,
          e = t.field(mh);
        for (let t of e.active)
          1 != t.state || this.running.some((e) => e.active.source == t.source) || this.startQuery(t);
      }
      startQuery(t) {
        let { state: e } = this.view,
          i = Yl(e),
          n = new Il(e, i, t.explicitPos == i),
          s = new xh(t, n);
        this.running.push(s),
          Promise.resolve(t.source(n)).then(
            (t) => {
              s.context.aborted || ((s.done = t || null), this.scheduleAccept());
            },
            (t) => {
              this.view.dispatch({ effects: dh.of(null) }), un(this.view.state, t);
            },
          );
      }
      scheduleAccept() {
        this.running.every((t) => void 0 !== t.done)
          ? this.accept()
          : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), 50));
      }
      accept() {
        var t;
        this.debounceAccept > -1 && clearTimeout(this.debounceAccept), (this.debounceAccept = -1);
        let e = [],
          i = this.view.state.facet(eh);
        for (let n = 0; n < this.running.length; n++) {
          let s = this.running[n];
          if (void 0 === s.done) continue;
          if ((this.running.splice(n--, 1), s.done)) {
            let n = new Oh(
              s.active.source,
              s.active.explicitPos,
              s.done,
              s.done.from,
              null !== (t = s.done.to) && void 0 !== t
                ? t
                : Yl(s.updates.length ? s.updates[0].startState : this.view.state),
            );
            for (let t of s.updates) n = n.update(t, i);
            if (n.hasResult()) {
              e.push(n);
              continue;
            }
          }
          let r = this.view.state.field(mh).active.find((t) => t.source == s.active.source);
          if (r && 1 == r.state)
            if (null == s.done) {
              let t = new uh(s.active.source, 0);
              for (let e of s.updates) t = t.update(e, i);
              1 != t.state && e.push(t);
            } else this.startQuery(r);
        }
        e.length && this.view.dispatch({ effects: ph.of(e) });
      }
    },
    {
      eventHandlers: {
        blur() {
          let t = this.view.state.field(mh, !1);
          t && t.tooltip && this.view.state.facet(eh).closeOnBlur && this.view.dispatch({ effects: dh.of(null) });
        },
        compositionstart() {
          this.composing = 1;
        },
        compositionend() {
          3 == this.composing && setTimeout(() => this.view.dispatch({ effects: fh.of(!1) }), 20), (this.composing = 0);
        },
      },
    },
  ),
  Sh = dr.baseTheme({
    '.cm-tooltip.cm-tooltip-autocomplete': {
      '& > ul': {
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        overflow: 'hidden auto',
        maxWidth_fallback: '700px',
        maxWidth: 'min(700px, 95vw)',
        minWidth: '250px',
        maxHeight: '10em',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        '& > li': {
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          padding: '1px 3px',
          lineHeight: 1.2,
        },
      },
    },
    '&light .cm-tooltip-autocomplete ul li[aria-selected]': { background: '#17c', color: 'white' },
    '&dark .cm-tooltip-autocomplete ul li[aria-selected]': { background: '#347', color: 'white' },
    '.cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after': {
      content: '"···"',
      opacity: 0.5,
      display: 'block',
      textAlign: 'center',
    },
    '.cm-tooltip.cm-completionInfo': {
      position: 'absolute',
      padding: '3px 9px',
      width: 'max-content',
      maxWidth: '300px',
    },
    '.cm-completionInfo.cm-completionInfo-left': { right: '100%' },
    '.cm-completionInfo.cm-completionInfo-right': { left: '100%' },
    '&light .cm-snippetField': { backgroundColor: '#00000022' },
    '&dark .cm-snippetField': { backgroundColor: '#ffffff22' },
    '.cm-snippetFieldPosition': {
      verticalAlign: 'text-top',
      width: 0,
      height: '1.15em',
      margin: '0 -0.7px -.7em',
      borderLeft: '1.4px dotted #888',
    },
    '.cm-completionMatchedText': { textDecoration: 'underline' },
    '.cm-completionDetail': { marginLeft: '0.5em', fontStyle: 'italic' },
    '.cm-completionIcon': {
      fontSize: '90%',
      width: '.8em',
      display: 'inline-block',
      textAlign: 'center',
      paddingRight: '.6em',
      opacity: '0.6',
    },
    '.cm-completionIcon-function, .cm-completionIcon-method': { '&:after': { content: "'ƒ'" } },
    '.cm-completionIcon-class': { '&:after': { content: "'○'" } },
    '.cm-completionIcon-interface': { '&:after': { content: "'◌'" } },
    '.cm-completionIcon-variable': { '&:after': { content: "'𝑥'" } },
    '.cm-completionIcon-constant': { '&:after': { content: "'𝐶'" } },
    '.cm-completionIcon-type': { '&:after': { content: "'𝑡'" } },
    '.cm-completionIcon-enum': { '&:after': { content: "'∪'" } },
    '.cm-completionIcon-property': { '&:after': { content: "'□'" } },
    '.cm-completionIcon-keyword': { '&:after': { content: "'🔑︎'" } },
    '.cm-completionIcon-namespace': { '&:after': { content: "'▢'" } },
    '.cm-completionIcon-text': { '&:after': { content: "'abc'", fontSize: '50%', verticalAlign: 'middle' } },
  });
class kh {
  constructor(t, e, i, n) {
    (this.field = t), (this.line = e), (this.from = i), (this.to = n);
  }
}
class $h {
  constructor(t, e, i) {
    (this.field = t), (this.from = e), (this.to = i);
  }
  map(t) {
    let e = t.mapPos(this.from, -1, ut.TrackDel),
      i = t.mapPos(this.to, 1, ut.TrackDel);
    return null == e || null == i ? null : new $h(this.field, e, i);
  }
}
class Th {
  constructor(t, e) {
    (this.lines = t), (this.fieldPositions = e);
  }
  instantiate(t, e) {
    let i = [],
      n = [e],
      s = t.doc.lineAt(e),
      r = /^\s*/.exec(s.text)[0];
    for (let s of this.lines) {
      if (i.length) {
        let i = r,
          o = /^\t*/.exec(s)[0].length;
        for (let e = 0; e < o; e++) i += t.facet(Sa);
        n.push(e + i.length - o), (s = i + s.slice(o));
      }
      i.push(s), (e += s.length + 1);
    }
    let o = this.fieldPositions.map((t) => new $h(t.field, n[t.line] + t.from, n[t.line] + t.to));
    return { text: i, ranges: o };
  }
  static parse(t) {
    let e,
      i = [],
      n = [],
      s = [];
    for (let r of t.split(/\r\n?|\n/)) {
      for (; (e = /[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(r)); ) {
        let t = e[1] ? +e[1] : null,
          o = e[2] || e[3] || '',
          a = -1;
        for (let e = 0; e < i.length; e++) (null != t ? i[e].seq == t : o && i[e].name == o) && (a = e);
        if (a < 0) {
          let e = 0;
          for (; e < i.length && (null == t || (null != i[e].seq && i[e].seq < t)); ) e++;
          i.splice(e, 0, { seq: t, name: o }), (a = e);
          for (let t of s) t.field >= a && t.field++;
        }
        s.push(new kh(a, n.length, e.index, e.index + o.length)),
          (r = r.slice(0, e.index) + o + r.slice(e.index + e[0].length));
      }
      for (let t; (t = /([$#])\\{/.exec(r)); ) {
        r = r.slice(0, t.index) + t[1] + '{' + r.slice(t.index + t[0].length);
        for (let e of s) e.line == n.length && e.from > t.index && (e.from--, e.to--);
      }
      n.push(r);
    }
    return new Th(n, s);
  }
}
let Ph = Ii.widget({
    widget: new (class extends Gi {
      toDOM() {
        let t = document.createElement('span');
        return (t.className = 'cm-snippetFieldPosition'), t;
      }
      ignoreEvent() {
        return !1;
      }
    })(),
  }),
  Rh = Ii.mark({ class: 'cm-snippetField' });
class Ch {
  constructor(t, e) {
    (this.ranges = t),
      (this.active = e),
      (this.deco = Ii.set(t.map((t) => (t.from == t.to ? Ph : Rh).range(t.from, t.to))));
  }
  map(t) {
    let e = [];
    for (let i of this.ranges) {
      let n = i.map(t);
      if (!n) return null;
      e.push(n);
    }
    return new Ch(e, this.active);
  }
  selectionInsideField(t) {
    return t.ranges.every((t) => this.ranges.some((e) => e.field == this.active && e.from <= t.from && e.to >= t.to));
  }
}
const Wh = te.define({ map: (t, e) => t && t.map(e) }),
  Xh = te.define(),
  Ah = Wt.define({
    create: () => null,
    update(t, e) {
      for (let i of e.effects) {
        if (i.is(Wh)) return i.value;
        if (i.is(Xh) && t) return new Ch(t.ranges, i.value);
      }
      return (
        t && e.docChanged && (t = t.map(e.changes)),
        t && e.selection && !t.selectionInsideField(e.selection) && (t = null),
        t
      );
    },
    provide: (t) => dr.decorations.from(t, (t) => (t ? t.deco : Ii.none)),
  });
function Zh(t, e) {
  return wt.create(t.filter((t) => t.field == e).map((t) => wt.range(t.from, t.to)));
}
function jh(t) {
  let e = Th.parse(t);
  return (t, i, n, s) => {
    let { text: r, ranges: o } = e.instantiate(t.state, n),
      a = { changes: { from: n, to: s, insert: I.of(r) }, scrollIntoView: !0 };
    if ((o.length && (a.selection = Zh(o, 0)), o.length > 1)) {
      let e = new Ch(o, 0),
        i = (a.effects = [Wh.of(e)]);
      void 0 === t.state.field(Ah, !1) && i.push(te.appendConfig.of([Ah, _h, Eh, Sh]));
    }
    t.dispatch(t.state.update(a));
  };
}
function Dh(t) {
  return ({ state: e, dispatch: i }) => {
    let n = e.field(Ah, !1);
    if (!n || (t < 0 && 0 == n.active)) return !1;
    let s = n.active + t,
      r = t > 0 && !n.ranges.some((e) => e.field == s + t);
    return i(e.update({ selection: Zh(n.ranges, s), effects: Wh.of(r ? null : new Ch(n.ranges, s)) })), !0;
  };
}
const zh = [
    { key: 'Tab', run: Dh(1), shift: Dh(-1) },
    {
      key: 'Escape',
      run: ({ state: t, dispatch: e }) => !!t.field(Ah, !1) && (e(t.update({ effects: Wh.of(null) })), !0),
    },
  ],
  Mh = St.define({ combine: (t) => (t.length ? t[0] : zh) }),
  _h = zt.highest(xr.compute([Mh], (t) => t.facet(Mh)));
function qh(t, e) {
  return Object.assign(Object.assign({}, e), { apply: jh(t) });
}
const Eh = dr.domEventHandlers({
  mousedown(t, e) {
    let i,
      n = e.state.field(Ah, !1);
    if (!n || null == (i = e.posAtCoords({ x: t.clientX, y: t.clientY }))) return !1;
    let s = n.ranges.find((t) => t.from <= i && t.to >= i);
    return (
      !(!s || s.field == n.active) &&
      (e.dispatch({
        selection: Zh(n.ranges, s.field),
        effects: Wh.of(n.ranges.some((t) => t.field > s.field) ? new Ch(n.ranges, s.field) : null),
      }),
      !0)
    );
  },
});
function Gh(t, e) {
  return new RegExp(e(t.source), t.unicode ? 'u' : '');
}
const Vh = Object.create(null);
function Ih(t, e, i, n, s) {
  for (let r = t.iterLines(), o = 0; !r.next().done; ) {
    let t,
      { value: a } = r;
    for (e.lastIndex = 0; (t = e.exec(a)); )
      if (!n[t[0]] && o + t.index != s && (i.push({ type: 'text', label: t[0] }), (n[t[0]] = !0), i.length >= 2e3))
        return;
    o += a.length + 1;
  }
}
function Nh(t, e, i, n, s) {
  let r = t.length >= 1e3,
    o = r && e.get(t);
  if (o) return o;
  let a = [],
    l = Object.create(null);
  if (t.children) {
    let r = 0;
    for (let o of t.children) {
      if (o.length >= 1e3) for (let t of Nh(o, e, i, n - r, s - r)) l[t.label] || ((l[t.label] = !0), a.push(t));
      else Ih(o, i, a, l, s - r);
      r += o.length + 1;
    }
  } else Ih(t, i, a, l, s);
  return r && a.length < 2e3 && e.set(t, a), a;
}
const Lh = (t) => {
    let e = t.state.languageDataAt('wordChars', t.pos).join(''),
      i = (function (t) {
        let e = t.replace(/[\\[.+*?(){|^$]/g, '\\$&');
        try {
          return new RegExp(`[\\p{Alphabetic}\\p{Number}_${e}]+`, 'ug');
        } catch (t) {
          return new RegExp(`[w${e}]`, 'g');
        }
      })(e),
      n = t.matchBefore(Gh(i, (t) => t + '$'));
    if (!n && !t.explicit) return null;
    let s = n ? n.from : t.pos,
      r = Nh(
        t.state.doc,
        (function (t) {
          return Vh[t] || (Vh[t] = new WeakMap());
        })(e),
        i,
        5e4,
        s,
      );
    return { from: s, options: r, validFor: Gh(i, (t) => '^' + t) };
  },
  Uh = { brackets: ['(', '[', '{', "'", '"'], before: ')]}:;>' },
  Bh = te.define({
    map(t, e) {
      let i = e.mapPos(t, -1, ut.TrackAfter);
      return null == i ? void 0 : i;
    },
  }),
  Yh = te.define({ map: (t, e) => e.mapPos(t) }),
  Fh = new (class extends de {})();
(Fh.startSide = 1), (Fh.endSide = -1);
const Hh = Wt.define({
  create: () => Qe.empty,
  update(t, e) {
    if (e.selection) {
      let i = e.state.doc.lineAt(e.selection.main.head).from,
        n = e.startState.doc.lineAt(e.startState.selection.main.head).from;
      i != e.changes.mapPos(n, -1) && (t = Qe.empty);
    }
    t = t.map(e.changes);
    for (let i of e.effects)
      i.is(Bh)
        ? (t = t.update({ add: [Fh.range(i.value, i.value + 1)] }))
        : i.is(Yh) && (t = t.update({ filter: (t) => t != i.value }));
    return t;
  },
});
function Jh() {
  return [ic, Hh];
}
function Kh(t) {
  for (let e = 0; e < '()[]{}<>'.length; e += 2) if ('()[]{}<>'.charCodeAt(e) == t) return '()[]{}<>'.charAt(e + 1);
  return lt(t < 128 ? t : t + 1);
}
function tc(t, e) {
  return t.languageDataAt('closeBrackets', e)[0] || Uh;
}
const ec = 'object' == typeof navigator && /Android\b/.test(navigator.userAgent),
  ic = dr.inputHandler.of((t, e, i, n) => {
    if ((ec ? t.composing : t.compositionStarted) || t.state.readOnly) return !1;
    let s = t.state.selection.main;
    if (n.length > 2 || (2 == n.length && 1 == ht(at(n, 0))) || e != s.from || i != s.to) return !1;
    let r = (function (t, e) {
      let i = tc(t, t.selection.main.head),
        n = i.brackets || Uh.brackets;
      for (let s of n) {
        let r = Kh(at(s, 0));
        if (e == s) return r == s ? lc(t, s, n.indexOf(s + s + s) > -1) : oc(t, s, r, i.before || Uh.before);
        if (e == r && sc(t, t.selection.main.from)) return ac(t, s, r);
      }
      return null;
    })(t.state, n);
    return !!r && (t.dispatch(r), !0);
  }),
  nc = [
    {
      key: 'Backspace',
      run: ({ state: t, dispatch: e }) => {
        if (t.readOnly) return !1;
        let i = tc(t, t.selection.main.head).brackets || Uh.brackets,
          n = null,
          s = t.changeByRange((e) => {
            if (e.empty) {
              let n = (function (t, e) {
                let i = t.sliceString(e - 2, e);
                return ht(at(i, 0)) == i.length ? i : i.slice(1);
              })(t.doc, e.head);
              for (let s of i)
                if (s == n && rc(t.doc, e.head) == Kh(at(s, 0)))
                  return {
                    changes: { from: e.head - s.length, to: e.head + s.length },
                    range: wt.cursor(e.head - s.length),
                    userEvent: 'delete.backward',
                  };
            }
            return { range: (n = e) };
          });
        return n || e(t.update(s, { scrollIntoView: !0 })), !n;
      },
    },
  ];
function sc(t, e) {
  let i = !1;
  return (
    t.field(Hh).between(0, t.doc.length, (t) => {
      t == e && (i = !0);
    }),
    i
  );
}
function rc(t, e) {
  let i = t.sliceString(e, e + 2);
  return i.slice(0, ht(at(i, 0)));
}
function oc(t, e, i, n) {
  let s = null,
    r = t.changeByRange((r) => {
      if (!r.empty)
        return {
          changes: [
            { insert: e, from: r.from },
            { insert: i, from: r.to },
          ],
          effects: Bh.of(r.to + e.length),
          range: wt.range(r.anchor + e.length, r.head + e.length),
        };
      let o = rc(t.doc, r.head);
      return !o || /\s/.test(o) || n.indexOf(o) > -1
        ? {
            changes: { insert: e + i, from: r.head },
            effects: Bh.of(r.head + e.length),
            range: wt.cursor(r.head + e.length),
          }
        : { range: (s = r) };
    });
  return s ? null : t.update(r, { scrollIntoView: !0, userEvent: 'input.type' });
}
function ac(t, e, i) {
  let n = null,
    s = t.selection.ranges.map((e) => (e.empty && rc(t.doc, e.head) == i ? wt.cursor(e.head + i.length) : (n = e)));
  return n
    ? null
    : t.update({
        selection: wt.create(s, t.selection.mainIndex),
        scrollIntoView: !0,
        effects: t.selection.ranges.map(({ from: t }) => Yh.of(t)),
      });
}
function lc(t, e, i) {
  let n = null,
    s = t.changeByRange((s) => {
      if (!s.empty)
        return {
          changes: [
            { insert: e, from: s.from },
            { insert: e, from: s.to },
          ],
          effects: Bh.of(s.to + e.length),
          range: wt.range(s.anchor + e.length, s.head + e.length),
        };
      let r = s.head,
        o = rc(t.doc, r);
      if (o == e) {
        if (hc(t, r))
          return { changes: { insert: e + e, from: r }, effects: Bh.of(r + e.length), range: wt.cursor(r + e.length) };
        if (sc(t, r)) {
          let n = i && t.sliceDoc(r, r + 3 * e.length) == e + e + e;
          return { range: wt.cursor(r + e.length * (n ? 3 : 1)), effects: Yh.of(r) };
        }
      } else {
        if (i && t.sliceDoc(r - 2 * e.length, r) == e + e && hc(t, r - 2 * e.length))
          return {
            changes: { insert: e + e + e + e, from: r },
            effects: Bh.of(r + e.length),
            range: wt.cursor(r + e.length),
          };
        if (t.charCategorizer(r)(o) != le.Word) {
          let i = t.sliceDoc(r - 1, r);
          if (
            i != e &&
            t.charCategorizer(r)(i) != le.Word &&
            !(function (t, e, i) {
              let n = ca(t).resolveInner(e, -1);
              for (let s = 0; s < 5; s++) {
                if (t.sliceDoc(n.from, n.from + i.length) == i) {
                  let e = n.firstChild;
                  for (; e && e.from == n.from && e.to - e.from > i.length; ) {
                    if (t.sliceDoc(e.to - i.length, e.to) == i) return !1;
                    e = e.firstChild;
                  }
                  return !0;
                }
                let s = n.to == e && n.parent;
                if (!s) break;
                n = s;
              }
              return !1;
            })(t, r, e)
          )
            return {
              changes: { insert: e + e, from: r },
              effects: Bh.of(r + e.length),
              range: wt.cursor(r + e.length),
            };
        }
      }
      return { range: (n = s) };
    });
  return n ? null : t.update(s, { scrollIntoView: !0, userEvent: 'input.type' });
}
function hc(t, e) {
  let i = ca(t).resolveInner(e + 1);
  return i.parent && i.from == e;
}
function cc(t = {}) {
  return [mh, eh.of(t), vh, Oc, Sh];
}
const uc = [
    { key: 'Ctrl-Space', run: yh },
    { key: 'Escape', run: wh },
    { key: 'ArrowDown', run: Qh(!0) },
    { key: 'ArrowUp', run: Qh(!1) },
    { key: 'PageDown', run: Qh(!0, 'page') },
    { key: 'PageUp', run: Qh(!1, 'page') },
    { key: 'Enter', run: bh },
  ],
  Oc = zt.highest(xr.computeN([eh], (t) => (t.facet(eh).defaultKeymap ? [uc] : []))),
  fc = new WeakMap();
function dc(t) {
  var e;
  let i = null === (e = t.field(mh, !1)) || void 0 === e ? void 0 : e.open;
  if (!i) return [];
  let n = fc.get(i.options);
  return n || fc.set(i.options, (n = i.options.map((t) => t.completion))), n;
}
function pc(t) {
  var e;
  let i = null === (e = t.field(mh, !1)) || void 0 === e ? void 0 : e.open;
  return i && i.selected >= 0 ? i.options[i.selected].completion : null;
}
const gc = (t) => {
  let e = yc(t.state);
  return e.line ? Qc(t) : !!e.block && bc(t);
};
function mc(t, e) {
  return ({ state: i, dispatch: n }) => {
    if (i.readOnly) return !1;
    let s = t(e, i);
    return !!s && (n(i.update(s)), !0);
  };
}
const Qc = mc(wc, 0),
  bc = mc(
    (t, e) =>
      (function (t, e, i = e.selection.ranges) {
        let n = i.map((t) => yc(e, t.from).block);
        if (!n.every((t) => t)) return null;
        let s = i.map((t, i) =>
          (function (t, { open: e, close: i }, n, s) {
            let r,
              o,
              a = t.sliceDoc(n - 50, n),
              l = t.sliceDoc(s, s + 50),
              h = /\s*$/.exec(a)[0].length,
              c = /^\s*/.exec(l)[0].length,
              u = a.length - h;
            if (a.slice(u - e.length, u) == e && l.slice(c, c + i.length) == i)
              return { open: { pos: n - h, margin: h && 1 }, close: { pos: s + c, margin: c && 1 } };
            s - n <= 100 ? (r = o = t.sliceDoc(n, s)) : ((r = t.sliceDoc(n, n + 50)), (o = t.sliceDoc(s - 50, s)));
            let O = /^\s*/.exec(r)[0].length,
              f = /\s*$/.exec(o)[0].length,
              d = o.length - f - i.length;
            if (r.slice(O, O + e.length) == e && o.slice(d, d + i.length) == i)
              return {
                open: { pos: n + O + e.length, margin: /\s/.test(r.charAt(O + e.length)) ? 1 : 0 },
                close: { pos: s - f - i.length, margin: /\s/.test(o.charAt(d - 1)) ? 1 : 0 },
              };
            return null;
          })(e, n[i], t.from, t.to),
        );
        if (2 != t && !s.every((t) => t))
          return {
            changes: e.changes(
              i.map((t, e) =>
                s[e]
                  ? []
                  : [
                      { from: t.from, insert: n[e].open + ' ' },
                      { from: t.to, insert: ' ' + n[e].close },
                    ],
              ),
            ),
          };
        if (1 != t && s.some((t) => t)) {
          let t = [];
          for (let e, i = 0; i < s.length; i++)
            if ((e = s[i])) {
              let s = n[i],
                { open: r, close: o } = e;
              t.push(
                { from: r.pos - s.open.length, to: r.pos + r.margin },
                { from: o.pos - o.margin, to: o.pos + s.close.length },
              );
            }
          return { changes: t };
        }
        return null;
      })(
        t,
        e,
        (function (t) {
          let e = [];
          for (let i of t.selection.ranges) {
            let n = t.doc.lineAt(i.from),
              s = i.to <= n.to ? n : t.doc.lineAt(i.to),
              r = e.length - 1;
            r >= 0 && e[r].to > n.from ? (e[r].to = s.to) : e.push({ from: n.from, to: s.to });
          }
          return e;
        })(e),
      ),
    0,
  );
function yc(t, e = t.selection.main.head) {
  let i = t.languageDataAt('commentTokens', e);
  return i.length ? i[0] : {};
}
function wc(t, e, i = e.selection.ranges) {
  let n = [],
    s = -1;
  for (let { from: t, to: r } of i) {
    let i = n.length,
      o = 1e9;
    for (let i = t; i <= r; ) {
      let a = e.doc.lineAt(i);
      if (a.from > s && (t == r || r > a.from)) {
        s = a.from;
        let t = yc(e, i).line;
        if (!t) continue;
        let r = /^\s*/.exec(a.text)[0].length,
          l = r == a.length,
          h = a.text.slice(r, r + t.length) == t ? r : -1;
        r < a.text.length && r < o && (o = r),
          n.push({ line: a, comment: h, token: t, indent: r, empty: l, single: !1 });
      }
      i = a.to + 1;
    }
    if (o < 1e9) for (let t = i; t < n.length; t++) n[t].indent < n[t].line.text.length && (n[t].indent = o);
    n.length == i + 1 && (n[i].single = !0);
  }
  if (2 != t && n.some((t) => t.comment < 0 && (!t.empty || t.single))) {
    let t = [];
    for (let { line: e, token: i, indent: s, empty: r, single: o } of n)
      (!o && r) || t.push({ from: e.from + s, insert: i + ' ' });
    let i = e.changes(t);
    return { changes: i, selection: e.selection.map(i, 1) };
  }
  if (1 != t && n.some((t) => t.comment >= 0)) {
    let t = [];
    for (let { line: e, comment: i, token: s } of n)
      if (i >= 0) {
        let n = e.from + i,
          r = n + s.length;
        ' ' == e.text[r - e.from] && r++, t.push({ from: n, to: r });
      }
    return { changes: t };
  }
  return null;
}
const xc = Ht.define(),
  vc = Ht.define(),
  Sc = St.define(),
  kc = St.define({
    combine: (t) => fe(t, { minDepth: 100, newGroupDelay: 500 }, { minDepth: Math.max, newGroupDelay: Math.min }),
  });
const $c = Wt.define({
  create: () => Gc.empty,
  update(t, e) {
    let i = e.state.facet(kc),
      n = e.annotation(xc);
    if (n) {
      let s = e.docChanged
          ? wt.single(
              (function (t) {
                let e = 0;
                return t.iterChangedRanges((t, i) => (e = i)), e;
              })(e.changes),
            )
          : void 0,
        r = Ac.fromTransaction(e, s),
        o = n.side,
        a = 0 == o ? t.undone : t.done;
      return (
        (a = r ? Zc(a, a.length, i.minDepth, r) : zc(a, e.startState.selection)),
        new Gc(0 == o ? n.rest : a, 0 == o ? a : n.rest)
      );
    }
    let s = e.annotation(vc);
    if ((('full' != s && 'before' != s) || (t = t.isolate()), !1 === e.annotation(ee.addToHistory)))
      return e.changes.empty ? t : t.addMapping(e.changes.desc);
    let r = Ac.fromTransaction(e),
      o = e.annotation(ee.time),
      a = e.annotation(ee.userEvent);
    return (
      r
        ? (t = t.addChanges(r, o, a, i.newGroupDelay, i.minDepth))
        : e.selection && (t = t.addSelection(e.startState.selection, o, a, i.newGroupDelay)),
      ('full' != s && 'after' != s) || (t = t.isolate()),
      t
    );
  },
  toJSON: (t) => ({ done: t.done.map((t) => t.toJSON()), undone: t.undone.map((t) => t.toJSON()) }),
  fromJSON: (t) => new Gc(t.done.map(Ac.fromJSON), t.undone.map(Ac.fromJSON)),
});
function Tc(t = {}) {
  return [
    $c,
    kc.of(t),
    dr.domEventHandlers({
      beforeinput(t, e) {
        let i = 'historyUndo' == t.inputType ? Rc : 'historyRedo' == t.inputType ? Cc : null;
        return !!i && (t.preventDefault(), i(e));
      },
    }),
  ];
}
function Pc(t, e) {
  return function ({ state: i, dispatch: n }) {
    if (!e && i.readOnly) return !1;
    let s = i.field($c, !1);
    if (!s) return !1;
    let r = s.pop(t, i, e);
    return !!r && (n(r), !0);
  };
}
const Rc = Pc(0, !1),
  Cc = Pc(1, !1),
  Wc = Pc(0, !0),
  Xc = Pc(1, !0);
class Ac {
  constructor(t, e, i, n, s) {
    (this.changes = t), (this.effects = e), (this.mapped = i), (this.startSelection = n), (this.selectionsAfter = s);
  }
  setSelAfter(t) {
    return new Ac(this.changes, this.effects, this.mapped, this.startSelection, t);
  }
  toJSON() {
    var t, e, i;
    return {
      changes: null === (t = this.changes) || void 0 === t ? void 0 : t.toJSON(),
      mapped: null === (e = this.mapped) || void 0 === e ? void 0 : e.toJSON(),
      startSelection: null === (i = this.startSelection) || void 0 === i ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((t) => t.toJSON()),
    };
  }
  static fromJSON(t) {
    return new Ac(
      t.changes && ft.fromJSON(t.changes),
      [],
      t.mapped && Ot.fromJSON(t.mapped),
      t.startSelection && wt.fromJSON(t.startSelection),
      t.selectionsAfter.map(wt.fromJSON),
    );
  }
  static fromTransaction(t, e) {
    let i = Dc;
    for (let e of t.startState.facet(Sc)) {
      let n = e(t);
      n.length && (i = i.concat(n));
    }
    return !i.length && t.changes.empty
      ? null
      : new Ac(t.changes.invert(t.startState.doc), i, void 0, e || t.startState.selection, Dc);
  }
  static selection(t) {
    return new Ac(void 0, Dc, void 0, void 0, t);
  }
}
function Zc(t, e, i, n) {
  let s = e + 1 > i + 20 ? e - i - 1 : 0,
    r = t.slice(s, e);
  return r.push(n), r;
}
function jc(t, e) {
  return t.length ? (e.length ? t.concat(e) : t) : e;
}
const Dc = [];
function zc(t, e) {
  if (t.length) {
    let i = t[t.length - 1],
      n = i.selectionsAfter.slice(Math.max(0, i.selectionsAfter.length - 200));
    return n.length && n[n.length - 1].eq(e) ? t : (n.push(e), Zc(t, t.length - 1, 1e9, i.setSelAfter(n)));
  }
  return [Ac.selection([e])];
}
function Mc(t) {
  let e = t[t.length - 1],
    i = t.slice();
  return (i[t.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1))), i;
}
function _c(t, e) {
  if (!t.length) return t;
  let i = t.length,
    n = Dc;
  for (; i; ) {
    let s = qc(t[i - 1], e, n);
    if ((s.changes && !s.changes.empty) || s.effects.length) {
      let e = t.slice(0, i);
      return (e[i - 1] = s), e;
    }
    (e = s.mapped), i--, (n = s.selectionsAfter);
  }
  return n.length ? [Ac.selection(n)] : Dc;
}
function qc(t, e, i) {
  let n = jc(t.selectionsAfter.length ? t.selectionsAfter.map((t) => t.map(e)) : Dc, i);
  if (!t.changes) return Ac.selection(n);
  let s = t.changes.map(e),
    r = e.mapDesc(t.changes, !0),
    o = t.mapped ? t.mapped.composeDesc(r) : r;
  return new Ac(s, te.mapEffects(t.effects, e), o, t.startSelection.map(r), n);
}
const Ec = /^(input\.type|delete)($|\.)/;
class Gc {
  constructor(t, e, i = 0, n) {
    (this.done = t), (this.undone = e), (this.prevTime = i), (this.prevUserEvent = n);
  }
  isolate() {
    return this.prevTime ? new Gc(this.done, this.undone) : this;
  }
  addChanges(t, e, i, n, s) {
    let r = this.done,
      o = r[r.length - 1];
    return (
      (r =
        o &&
        o.changes &&
        !o.changes.empty &&
        t.changes &&
        (!i || Ec.test(i)) &&
        ((!o.selectionsAfter.length &&
          e - this.prevTime < n &&
          (function (t, e) {
            let i = [],
              n = !1;
            return (
              t.iterChangedRanges((t, e) => i.push(t, e)),
              e.iterChangedRanges((t, e, s, r) => {
                for (let t = 0; t < i.length; ) {
                  let e = i[t++],
                    o = i[t++];
                  r >= e && s <= o && (n = !0);
                }
              }),
              n
            );
          })(o.changes, t.changes)) ||
          'input.type.compose' == i)
          ? Zc(
              r,
              r.length - 1,
              s,
              new Ac(t.changes.compose(o.changes), jc(t.effects, o.effects), o.mapped, o.startSelection, Dc),
            )
          : Zc(r, r.length, s, t)),
      new Gc(r, Dc, e, i)
    );
  }
  addSelection(t, e, i, n) {
    let s = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Dc;
    return s.length > 0 &&
      e - this.prevTime < n &&
      i == this.prevUserEvent &&
      i &&
      /^select($|\.)/.test(i) &&
      ((r = s[s.length - 1]),
      (o = t),
      r.ranges.length == o.ranges.length && 0 === r.ranges.filter((t, e) => t.empty != o.ranges[e].empty).length)
      ? this
      : new Gc(zc(this.done, t), this.undone, e, i);
    var r, o;
  }
  addMapping(t) {
    return new Gc(_c(this.done, t), _c(this.undone, t), this.prevTime, this.prevUserEvent);
  }
  pop(t, e, i) {
    let n = 0 == t ? this.done : this.undone;
    if (0 == n.length) return null;
    let s = n[n.length - 1];
    if (i && s.selectionsAfter.length)
      return e.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: xc.of({ side: t, rest: Mc(n) }),
        userEvent: 0 == t ? 'select.undo' : 'select.redo',
        scrollIntoView: !0,
      });
    if (s.changes) {
      let i = 1 == n.length ? Dc : n.slice(0, n.length - 1);
      return (
        s.mapped && (i = _c(i, s.mapped)),
        e.update({
          changes: s.changes,
          selection: s.startSelection,
          effects: s.effects,
          annotations: xc.of({ side: t, rest: i }),
          filter: !1,
          userEvent: 0 == t ? 'undo' : 'redo',
          scrollIntoView: !0,
        })
      );
    }
    return null;
  }
}
Gc.empty = new Gc(Dc, Dc);
const Vc = [
  { key: 'Mod-z', run: Rc, preventDefault: !0 },
  { key: 'Mod-y', mac: 'Mod-Shift-z', run: Cc, preventDefault: !0 },
  { linux: 'Ctrl-Shift-z', run: Cc, preventDefault: !0 },
  { key: 'Mod-u', run: Wc, preventDefault: !0 },
  { key: 'Alt-u', mac: 'Mod-Shift-u', run: Xc, preventDefault: !0 },
];
function Ic(t, e) {
  return wt.create(t.ranges.map(e), t.mainIndex);
}
function Nc(t, e) {
  return t.update({ selection: e, scrollIntoView: !0, userEvent: 'select' });
}
function Lc({ state: t, dispatch: e }, i) {
  let n = Ic(t.selection, i);
  return !n.eq(t.selection) && (e(Nc(t, n)), !0);
}
function Uc(t, e) {
  return wt.cursor(e ? t.to : t.from);
}
function Bc(t, e) {
  return Lc(t, (i) => (i.empty ? t.moveByChar(i, e) : Uc(i, e)));
}
function Yc(t) {
  return t.textDirectionAt(t.state.selection.main.head) == kn.LTR;
}
const Fc = (t) => Bc(t, !Yc(t)),
  Hc = (t) => Bc(t, Yc(t));
function Jc(t, e) {
  return Lc(t, (i) => (i.empty ? t.moveByGroup(i, e) : Uc(i, e)));
}
function Kc(t, e, i) {
  let n = t.state.charCategorizer(e.from);
  return t.moveByChar(e, i, (s) => {
    let r = le.Space,
      o = e.from,
      a = !1,
      l = !1,
      h = !1,
      c = (e) => {
        if (a) return !1;
        o += i ? e.length : -e.length;
        let s,
          c = n(e);
        if ((r == le.Space && (r = c), r != c)) return !1;
        if (r == le.Word)
          if (e.toLowerCase() == e) {
            if (!i && l) return !1;
            h = !0;
          } else if (h) {
            if (i) return !1;
            a = !0;
          } else {
            if (l && i && n((s = t.state.sliceDoc(o, o + 1))) == le.Word && s.toLowerCase() == s) return !1;
            l = !0;
          }
        return !0;
      };
    return c(s), c;
  });
}
function tu(t, e) {
  return Lc(t, (i) => (i.empty ? Kc(t, i, e) : Uc(i, e)));
}
const eu = (t) => tu(t, !0),
  iu = (t) => tu(t, !1);
function nu(t, e) {
  return Lc(t, (i) => {
    if (!i.empty) return Uc(i, e);
    let n = t.moveVertically(i, e);
    return n.head != i.head ? n : t.moveToLineBoundary(i, e);
  });
}
const su = (t) => nu(t, !1),
  ru = (t) => nu(t, !0);
function ou(t) {
  return Math.max(t.defaultLineHeight, Math.min(t.dom.clientHeight, innerHeight) - 5);
}
function au(t, e) {
  let { state: i } = t,
    n = Ic(i.selection, (i) => (i.empty ? t.moveVertically(i, e, ou(t)) : Uc(i, e)));
  if (n.eq(i.selection)) return !1;
  let s,
    r = t.coordsAtPos(i.selection.main.head),
    o = t.scrollDOM.getBoundingClientRect();
  return (
    r &&
      r.top > o.top &&
      r.bottom < o.bottom &&
      r.top - o.top <= t.scrollDOM.scrollHeight - t.scrollDOM.scrollTop - t.scrollDOM.clientHeight &&
      (s = dr.scrollIntoView(n.main.head, { y: 'start', yMargin: r.top - o.top })),
    t.dispatch(Nc(i, n), { effects: s }),
    !0
  );
}
const lu = (t) => au(t, !1),
  hu = (t) => au(t, !0);
function cu(t, e, i) {
  let n = t.lineBlockAt(e.head),
    s = t.moveToLineBoundary(e, i);
  if (
    (s.head == e.head && s.head != (i ? n.to : n.from) && (s = t.moveToLineBoundary(e, i, !1)),
    !i && s.head == n.from && n.length)
  ) {
    let i = /^\s*/.exec(t.state.sliceDoc(n.from, Math.min(n.from + 100, n.to)))[0].length;
    i && e.head != n.from + i && (s = wt.cursor(n.from + i));
  }
  return s;
}
const uu = (t) => Lc(t, (e) => cu(t, e, !0)),
  Ou = (t) => Lc(t, (e) => cu(t, e, !1));
function fu(t, e, i) {
  let n = !1,
    s = Ic(t.selection, (e) => {
      let s =
        kl(t, e.head, -1) ||
        kl(t, e.head, 1) ||
        (e.head > 0 && kl(t, e.head - 1, 1)) ||
        (e.head < t.doc.length && kl(t, e.head + 1, -1));
      if (!s || !s.end) return e;
      n = !0;
      let r = s.start.from == e.head ? s.end.to : s.end.from;
      return i ? wt.range(e.anchor, r) : wt.cursor(r);
    });
  return !!n && (e(Nc(t, s)), !0);
}
const du = ({ state: t, dispatch: e }) => fu(t, e, !1),
  pu = ({ state: t, dispatch: e }) => fu(t, e, !0);
function gu(t, e) {
  let i = Ic(t.state.selection, (t) => {
    let i = e(t);
    return wt.range(t.anchor, i.head, i.goalColumn);
  });
  return !i.eq(t.state.selection) && (t.dispatch(Nc(t.state, i)), !0);
}
function mu(t, e) {
  return gu(t, (i) => t.moveByChar(i, e));
}
const Qu = (t) => mu(t, !Yc(t)),
  bu = (t) => mu(t, Yc(t));
function yu(t, e) {
  return gu(t, (i) => t.moveByGroup(i, e));
}
function wu(t, e) {
  return gu(t, (i) => Kc(t, i, e));
}
const xu = (t) => wu(t, !0),
  vu = (t) => wu(t, !1);
function Su(t, e) {
  return gu(t, (i) => t.moveVertically(i, e));
}
const ku = (t) => Su(t, !1),
  $u = (t) => Su(t, !0);
function Tu(t, e) {
  return gu(t, (i) => t.moveVertically(i, e, ou(t)));
}
const Pu = (t) => Tu(t, !1),
  Ru = (t) => Tu(t, !0),
  Cu = (t) => gu(t, (e) => cu(t, e, !0)),
  Wu = (t) => gu(t, (e) => cu(t, e, !1)),
  Xu = ({ state: t, dispatch: e }) => (e(Nc(t, { anchor: 0 })), !0),
  Au = ({ state: t, dispatch: e }) => (e(Nc(t, { anchor: t.doc.length })), !0),
  Zu = ({ state: t, dispatch: e }) => (e(Nc(t, { anchor: t.selection.main.anchor, head: 0 })), !0),
  ju = ({ state: t, dispatch: e }) => (e(Nc(t, { anchor: t.selection.main.anchor, head: t.doc.length })), !0);
function Du({ state: t, dispatch: e }, i) {
  if (t.readOnly) return !1;
  let n = 'delete.selection',
    s = t.changeByRange((t) => {
      let { from: e, to: s } = t;
      if (e == s) {
        let t = i(e);
        t < e ? (n = 'delete.backward') : t > e && (n = 'delete.forward'), (e = Math.min(e, t)), (s = Math.max(s, t));
      }
      return e == s ? { range: t } : { changes: { from: e, to: s }, range: wt.cursor(e) };
    });
  return (
    !s.changes.empty &&
    (e(
      t.update(s, {
        scrollIntoView: !0,
        userEvent: n,
        effects: 'delete.selection' == n ? dr.announce.of(t.phrase('Selection deleted')) : void 0,
      }),
    ),
    !0)
  );
}
function zu(t, e, i) {
  if (t instanceof dr)
    for (let n of t.state.facet(dr.atomicRanges).map((e) => e(t)))
      n.between(e, e, (t, n) => {
        t < e && n > e && (e = i ? n : t);
      });
  return e;
}
const Mu = (t, e) =>
    Du(t, (i) => {
      let n,
        s,
        { state: r } = t,
        o = r.doc.lineAt(i);
      if (!e && i > o.from && i < o.from + 200 && !/[^ \t]/.test((n = o.text.slice(0, i - o.from)))) {
        if ('\t' == n[n.length - 1]) return i - 1;
        let t = Ce(n, r.tabSize) % ka(r) || ka(r);
        for (let e = 0; e < t && ' ' == n[n.length - 1 - e]; e++) i--;
        s = i;
      } else
        (s = it(o.text, i - o.from, e, e) + o.from), s == i && o.number != (e ? r.doc.lines : 1) && (s += e ? 1 : -1);
      return zu(t, s, e);
    }),
  _u = (t) => Mu(t, !1),
  qu = (t) => Mu(t, !0),
  Eu = (t, e) =>
    Du(t, (i) => {
      let n = i,
        { state: s } = t,
        r = s.doc.lineAt(n),
        o = s.charCategorizer(n);
      for (let t = null; ; ) {
        if (n == (e ? r.to : r.from)) {
          n == i && r.number != (e ? s.doc.lines : 1) && (n += e ? 1 : -1);
          break;
        }
        let a = it(r.text, n - r.from, e) + r.from,
          l = r.text.slice(Math.min(n, a) - r.from, Math.max(n, a) - r.from),
          h = o(l);
        if (null != t && h != t) break;
        (' ' == l && n == i) || (t = h), (n = a);
      }
      return zu(t, n, e);
    }),
  Gu = (t) => Eu(t, !1),
  Vu = (t) =>
    Du(t, (e) => {
      let i = t.lineBlockAt(e).to;
      return zu(t, e < i ? i : Math.min(t.state.doc.length, e + 1), !0);
    });
const Iu = Nu(!1);
function Nu(t) {
  return ({ state: e, dispatch: i }) => {
    if (e.readOnly) return !1;
    let s = e.changeByRange((i) => {
      let { from: s, to: r } = i,
        o = e.doc.lineAt(s),
        a =
          !t &&
          s == r &&
          (function (t, e) {
            if (/\(\)|\[\]|\{\}/.test(t.sliceDoc(e - 1, e + 1))) return { from: e, to: e };
            let i,
              s = ca(t).resolveInner(e),
              r = s.childBefore(e),
              o = s.childAfter(e);
            return r &&
              o &&
              r.to <= e &&
              o.from >= e &&
              (i = r.type.prop(n.closedBy)) &&
              i.indexOf(o.name) > -1 &&
              t.doc.lineAt(r.to).from == t.doc.lineAt(o.from).from
              ? { from: r.to, to: o.from }
              : null;
          })(e, s);
      t && (s = r = (r <= o.to ? o : e.doc.lineAt(r)).to);
      let l = new Pa(e, { simulateBreak: s, simulateDoubleBreak: !!a }),
        h = Ta(l, s);
      for (null == h && (h = /^\s*/.exec(e.doc.lineAt(s).text)[0].length); r < o.to && /\s/.test(o.text[r - o.from]); )
        r++;
      a ? ({ from: s, to: r } = a) : s > o.from && s < o.from + 100 && !/\S/.test(o.text.slice(0, s)) && (s = o.from);
      let c = ['', $a(e, h)];
      return (
        a && c.push($a(e, l.lineIndent(o.from, -1))),
        { changes: { from: s, to: r, insert: I.of(c) }, range: wt.cursor(s + 1 + c[1].length) }
      );
    });
    return i(e.update(s, { scrollIntoView: !0, userEvent: 'input' })), !0;
  };
}
function Lu(t, e) {
  let i = -1;
  return t.changeByRange((n) => {
    let s = [];
    for (let r = n.from; r <= n.to; ) {
      let o = t.doc.lineAt(r);
      o.number > i && (n.empty || n.to > o.from) && (e(o, s, n), (i = o.number)), (r = o.to + 1);
    }
    let r = t.changes(s);
    return { changes: s, range: wt.range(r.mapPos(n.anchor, 1), r.mapPos(n.head, 1)) };
  });
}
const Uu = ({ state: t, dispatch: e }) =>
    !t.readOnly &&
    (e(
      t.update(
        Lu(t, (e, i) => {
          i.push({ from: e.from, insert: t.facet(Sa) });
        }),
        { userEvent: 'input.indent' },
      ),
    ),
    !0),
  Bu = ({ state: t, dispatch: e }) =>
    !t.readOnly &&
    (e(
      t.update(
        Lu(t, (e, i) => {
          let n = /^\s*/.exec(e.text)[0];
          if (!n) return;
          let s = Ce(n, t.tabSize),
            r = 0,
            o = $a(t, Math.max(0, s - ka(t)));
          for (; r < n.length && r < o.length && n.charCodeAt(r) == o.charCodeAt(r); ) r++;
          i.push({ from: e.from + r, to: e.from + n.length, insert: o.slice(r) });
        }),
        { userEvent: 'delete.dedent' },
      ),
    ),
    !0),
  Yu = [
    { key: 'ArrowLeft', run: Fc, shift: Qu, preventDefault: !0 },
    { key: 'Mod-ArrowLeft', mac: 'Alt-ArrowLeft', run: (t) => Jc(t, !Yc(t)), shift: (t) => yu(t, !Yc(t)) },
    { mac: 'Cmd-ArrowLeft', run: Ou, shift: Wu },
    { key: 'ArrowRight', run: Hc, shift: bu, preventDefault: !0 },
    { key: 'Mod-ArrowRight', mac: 'Alt-ArrowRight', run: (t) => Jc(t, Yc(t)), shift: (t) => yu(t, Yc(t)) },
    { mac: 'Cmd-ArrowRight', run: uu, shift: Cu },
    { key: 'ArrowUp', run: su, shift: ku, preventDefault: !0 },
    { mac: 'Cmd-ArrowUp', run: Xu, shift: Zu },
    { mac: 'Ctrl-ArrowUp', run: lu, shift: Pu },
    { key: 'ArrowDown', run: ru, shift: $u, preventDefault: !0 },
    { mac: 'Cmd-ArrowDown', run: Au, shift: ju },
    { mac: 'Ctrl-ArrowDown', run: hu, shift: Ru },
    { key: 'PageUp', run: lu, shift: Pu },
    { key: 'PageDown', run: hu, shift: Ru },
    { key: 'Home', run: Ou, shift: Wu, preventDefault: !0 },
    { key: 'Mod-Home', run: Xu, shift: Zu },
    { key: 'End', run: uu, shift: Cu, preventDefault: !0 },
    { key: 'Mod-End', run: Au, shift: ju },
    { key: 'Enter', run: Iu },
    {
      key: 'Mod-a',
      run: ({ state: t, dispatch: e }) => (
        e(t.update({ selection: { anchor: 0, head: t.doc.length }, userEvent: 'select' })), !0
      ),
    },
    { key: 'Backspace', run: _u, shift: _u },
    { key: 'Delete', run: qu },
    { key: 'Mod-Backspace', mac: 'Alt-Backspace', run: Gu },
    { key: 'Mod-Delete', mac: 'Alt-Delete', run: (t) => Eu(t, !0) },
    {
      mac: 'Mod-Backspace',
      run: (t) =>
        Du(t, (e) => {
          let i = t.lineBlockAt(e).from;
          return zu(t, e > i ? i : Math.max(0, e - 1), !1);
        }),
    },
    { mac: 'Mod-Delete', run: Vu },
  ].concat(
    [
      { key: 'Ctrl-b', run: Fc, shift: Qu, preventDefault: !0 },
      { key: 'Ctrl-f', run: Hc, shift: bu },
      { key: 'Ctrl-p', run: su, shift: ku },
      { key: 'Ctrl-n', run: ru, shift: $u },
      {
        key: 'Ctrl-a',
        run: (t) => Lc(t, (e) => wt.cursor(t.lineBlockAt(e.head).from, 1)),
        shift: (t) => gu(t, (e) => wt.cursor(t.lineBlockAt(e.head).from)),
      },
      {
        key: 'Ctrl-e',
        run: (t) => Lc(t, (e) => wt.cursor(t.lineBlockAt(e.head).to, -1)),
        shift: (t) => gu(t, (e) => wt.cursor(t.lineBlockAt(e.head).to)),
      },
      { key: 'Ctrl-d', run: qu },
      { key: 'Ctrl-h', run: _u },
      { key: 'Ctrl-k', run: Vu },
      { key: 'Ctrl-Alt-h', run: Gu },
      {
        key: 'Ctrl-o',
        run: ({ state: t, dispatch: e }) => {
          if (t.readOnly) return !1;
          let i = t.changeByRange((t) => ({
            changes: { from: t.from, to: t.to, insert: I.of(['', '']) },
            range: wt.cursor(t.from),
          }));
          return e(t.update(i, { scrollIntoView: !0, userEvent: 'input' })), !0;
        },
      },
      {
        key: 'Ctrl-t',
        run: ({ state: t, dispatch: e }) => {
          if (t.readOnly) return !1;
          let i = t.changeByRange((e) => {
            if (!e.empty || 0 == e.from || e.from == t.doc.length) return { range: e };
            let i = e.from,
              n = t.doc.lineAt(i),
              s = i == n.from ? i - 1 : it(n.text, i - n.from, !1) + n.from,
              r = i == n.to ? i + 1 : it(n.text, i - n.from, !0) + n.from;
            return {
              changes: { from: s, to: r, insert: t.doc.slice(i, r).append(t.doc.slice(s, i)) },
              range: wt.cursor(r),
            };
          });
          return !i.changes.empty && (e(t.update(i, { scrollIntoView: !0, userEvent: 'move.character' })), !0);
        },
      },
      { key: 'Ctrl-v', run: hu },
    ].map((t) => ({ mac: t.key, run: t.run, shift: t.shift })),
  );
class Fu {
  constructor(t, e, i, n, s, r, o, a, l, h = 0, c) {
    (this.p = t),
      (this.stack = e),
      (this.state = i),
      (this.reducePos = n),
      (this.pos = s),
      (this.score = r),
      (this.buffer = o),
      (this.bufferBase = a),
      (this.curContext = l),
      (this.lookAhead = h),
      (this.parent = c);
  }
  toString() {
    return `[${this.stack.filter((t, e) => e % 3 == 0).concat(this.state)}]@${this.pos}${
      this.score ? '!' + this.score : ''
    }`;
  }
  static start(t, e, i = 0) {
    let n = t.parser.context;
    return new Fu(t, [], e, i, i, 0, [], 0, n ? new Hu(n, n.start) : null, 0, null);
  }
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  pushState(t, e) {
    this.stack.push(this.state, e, this.bufferBase + this.buffer.length), (this.state = t);
  }
  reduce(t) {
    let e = t >> 19,
      i = 65535 & t,
      { parser: n } = this.p,
      s = n.dynamicPrecedence(i);
    if ((s && (this.score += s), 0 == e))
      return (
        this.pushState(n.getGoto(this.state, i, !0), this.reducePos),
        i < n.minRepeatTerm && this.storeNode(i, this.reducePos, this.reducePos, 4, !0),
        void this.reduceContext(i, this.reducePos)
      );
    let r = this.stack.length - 3 * (e - 1) - (262144 & t ? 6 : 0),
      o = this.stack[r - 2],
      a = this.stack[r - 1],
      l = this.bufferBase + this.buffer.length - a;
    if (i < n.minRepeatTerm || 131072 & t) {
      let t = n.stateFlag(this.state, 1) ? this.pos : this.reducePos;
      this.storeNode(i, o, t, l + 4, !0);
    }
    if (262144 & t) this.state = this.stack[r];
    else {
      let t = this.stack[r - 3];
      this.state = n.getGoto(t, i, !0);
    }
    for (; this.stack.length > r; ) this.stack.pop();
    this.reduceContext(i, o);
  }
  storeNode(t, e, i, n = 4, s = !1) {
    if (0 == t && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let t = this,
        n = this.buffer.length;
      if (
        (0 == n && t.parent && ((n = t.bufferBase - t.parent.bufferBase), (t = t.parent)),
        n > 0 && 0 == t.buffer[n - 4] && t.buffer[n - 1] > -1)
      ) {
        if (e == i) return;
        if (t.buffer[n - 2] >= e) return void (t.buffer[n - 2] = i);
      }
    }
    if (s && this.pos != i) {
      let s = this.buffer.length;
      if (s > 0 && 0 != this.buffer[s - 4])
        for (; s > 0 && this.buffer[s - 2] > i; )
          (this.buffer[s] = this.buffer[s - 4]),
            (this.buffer[s + 1] = this.buffer[s - 3]),
            (this.buffer[s + 2] = this.buffer[s - 2]),
            (this.buffer[s + 3] = this.buffer[s - 1]),
            (s -= 4),
            n > 4 && (n -= 4);
      (this.buffer[s] = t), (this.buffer[s + 1] = e), (this.buffer[s + 2] = i), (this.buffer[s + 3] = n);
    } else this.buffer.push(t, e, i, n);
  }
  shift(t, e, i) {
    let n = this.pos;
    if (131072 & t) this.pushState(65535 & t, this.pos);
    else if (0 == (262144 & t)) {
      let s = t,
        { parser: r } = this.p;
      (i > this.pos || e <= r.maxNode) && ((this.pos = i), r.stateFlag(s, 1) || (this.reducePos = i)),
        this.pushState(s, n),
        this.shiftContext(e, n),
        e <= r.maxNode && this.buffer.push(e, n, i, 4);
    } else (this.pos = i), this.shiftContext(e, n), e <= this.p.parser.maxNode && this.buffer.push(e, n, i, 4);
  }
  apply(t, e, i) {
    65536 & t ? this.reduce(t) : this.shift(t, e, i);
  }
  useNode(t, e) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != t) && (this.p.reused.push(t), i++);
    let n = this.pos;
    (this.reducePos = this.pos = n + t.length),
      this.pushState(e, n),
      this.buffer.push(i, n, this.reducePos, -1),
      this.curContext &&
        this.updateContext(
          this.curContext.tracker.reuse(this.curContext.context, t, this, this.p.stream.reset(this.pos - t.length)),
        );
  }
  split() {
    let t = this,
      e = t.buffer.length;
    for (; e > 0 && t.buffer[e - 2] > t.reducePos; ) e -= 4;
    let i = t.buffer.slice(e),
      n = t.bufferBase + e;
    for (; t && n == t.bufferBase; ) t = t.parent;
    return new Fu(
      this.p,
      this.stack.slice(),
      this.state,
      this.reducePos,
      this.pos,
      this.score,
      i,
      n,
      this.curContext,
      this.lookAhead,
      t,
    );
  }
  recoverByDelete(t, e) {
    let i = t <= this.p.parser.maxNode;
    i && this.storeNode(t, this.pos, e, 4),
      this.storeNode(0, this.pos, e, i ? 8 : 4),
      (this.pos = this.reducePos = e),
      (this.score -= 190);
  }
  canShift(t) {
    for (let e = new Ku(this); ; ) {
      let i = this.p.parser.stateSlot(e.state, 4) || this.p.parser.hasAction(e.state, t);
      if (0 == (65536 & i)) return !0;
      if (0 == i) return !1;
      e.reduce(i);
    }
  }
  recoverByInsert(t) {
    if (this.stack.length >= 300) return [];
    let e = this.p.parser.nextStates(this.state);
    if (e.length > 8 || this.stack.length >= 120) {
      let i = [];
      for (let n, s = 0; s < e.length; s += 2)
        (n = e[s + 1]) != this.state && this.p.parser.hasAction(n, t) && i.push(e[s], n);
      if (this.stack.length < 120)
        for (let t = 0; i.length < 8 && t < e.length; t += 2) {
          let n = e[t + 1];
          i.some((t, e) => 1 & e && t == n) || i.push(e[t], n);
        }
      e = i;
    }
    let i = [];
    for (let t = 0; t < e.length && i.length < 4; t += 2) {
      let n = e[t + 1];
      if (n == this.state) continue;
      let s = this.split();
      s.pushState(n, this.pos),
        s.storeNode(0, s.pos, s.pos, 4, !0),
        s.shiftContext(e[t], this.pos),
        (s.score -= 200),
        i.push(s);
    }
    return i;
  }
  forceReduce() {
    let t = this.p.parser.stateSlot(this.state, 5);
    if (0 == (65536 & t)) return !1;
    let { parser: e } = this.p;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19,
        n = 65535 & t,
        s = this.stack.length - 3 * i;
      if (s < 0 || e.getGoto(this.stack[s], n, !1) < 0) return !1;
      this.storeNode(0, this.reducePos, this.reducePos, 4, !0), (this.score -= 100);
    }
    return (this.reducePos = this.pos), this.reduce(t), !0;
  }
  forceAll() {
    for (; !this.p.parser.stateFlag(this.state, 2); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  get deadEnd() {
    if (3 != this.stack.length) return !1;
    let { parser: t } = this.p;
    return 65535 == t.data[t.stateSlot(this.state, 1)] && !t.stateSlot(this.state, 4);
  }
  restart() {
    (this.state = this.stack[0]), (this.stack.length = 0);
  }
  sameState(t) {
    if (this.state != t.state || this.stack.length != t.stack.length) return !1;
    for (let e = 0; e < this.stack.length; e += 3) if (this.stack[e] != t.stack[e]) return !1;
    return !0;
  }
  get parser() {
    return this.p.parser;
  }
  dialectEnabled(t) {
    return this.p.parser.dialect.flags[t];
  }
  shiftContext(t, e) {
    this.curContext &&
      this.updateContext(this.curContext.tracker.shift(this.curContext.context, t, this, this.p.stream.reset(e)));
  }
  reduceContext(t, e) {
    this.curContext &&
      this.updateContext(this.curContext.tracker.reduce(this.curContext.context, t, this, this.p.stream.reset(e)));
  }
  emitContext() {
    let t = this.buffer.length - 1;
    (t < 0 || -3 != this.buffer[t]) && this.buffer.push(this.curContext.hash, this.reducePos, this.reducePos, -3);
  }
  emitLookAhead() {
    let t = this.buffer.length - 1;
    (t < 0 || -4 != this.buffer[t]) && this.buffer.push(this.lookAhead, this.reducePos, this.reducePos, -4);
  }
  updateContext(t) {
    if (t != this.curContext.context) {
      let e = new Hu(this.curContext.tracker, t);
      e.hash != this.curContext.hash && this.emitContext(), (this.curContext = e);
    }
  }
  setLookAhead(t) {
    t > this.lookAhead && (this.emitLookAhead(), (this.lookAhead = t));
  }
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class Hu {
  constructor(t, e) {
    (this.tracker = t), (this.context = e), (this.hash = t.strict ? t.hash(e) : 0);
  }
}
var Ju;
!(function (t) {
  (t[(t.Insert = 200)] = 'Insert'),
    (t[(t.Delete = 190)] = 'Delete'),
    (t[(t.Reduce = 100)] = 'Reduce'),
    (t[(t.MaxNext = 4)] = 'MaxNext'),
    (t[(t.MaxInsertStackDepth = 300)] = 'MaxInsertStackDepth'),
    (t[(t.DampenInsertStackDepth = 120)] = 'DampenInsertStackDepth');
})(Ju || (Ju = {}));
class Ku {
  constructor(t) {
    (this.start = t), (this.state = t.state), (this.stack = t.stack), (this.base = this.stack.length);
  }
  reduce(t) {
    let e = 65535 & t,
      i = t >> 19;
    0 == i
      ? (this.stack == this.start.stack && (this.stack = this.stack.slice()),
        this.stack.push(this.state, 0, 0),
        (this.base += 3))
      : (this.base -= 3 * (i - 1));
    let n = this.start.p.parser.getGoto(this.stack[this.base - 3], e, !0);
    this.state = n;
  }
}
class tO {
  constructor(t, e, i) {
    (this.stack = t), (this.pos = e), (this.index = i), (this.buffer = t.buffer), 0 == this.index && this.maybeNext();
  }
  static create(t, e = t.bufferBase + t.buffer.length) {
    return new tO(t, e, e - t.bufferBase);
  }
  maybeNext() {
    let t = this.stack.parent;
    null != t && ((this.index = this.stack.bufferBase - t.bufferBase), (this.stack = t), (this.buffer = t.buffer));
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    (this.index -= 4), (this.pos -= 4), 0 == this.index && this.maybeNext();
  }
  fork() {
    return new tO(this.stack, this.pos, this.index);
  }
}
class eO {
  constructor() {
    (this.start = -1),
      (this.value = -1),
      (this.end = -1),
      (this.extended = -1),
      (this.lookAhead = 0),
      (this.mask = 0),
      (this.context = 0);
  }
}
const iO = new eO();
class nO {
  constructor(t, e) {
    (this.input = t),
      (this.ranges = e),
      (this.chunk = ''),
      (this.chunkOff = 0),
      (this.chunk2 = ''),
      (this.chunk2Pos = 0),
      (this.next = -1),
      (this.token = iO),
      (this.rangeIndex = 0),
      (this.pos = this.chunkPos = e[0].from),
      (this.range = e[0]),
      (this.end = e[e.length - 1].to),
      this.readNext();
  }
  resolveOffset(t, e) {
    let i = this.range,
      n = this.rangeIndex,
      s = this.pos + t;
    for (; s < i.from; ) {
      if (!n) return null;
      let t = this.ranges[--n];
      (s -= i.from - t.to), (i = t);
    }
    for (; e < 0 ? s > i.to : s >= i.to; ) {
      if (n == this.ranges.length - 1) return null;
      let t = this.ranges[++n];
      (s += t.from - i.to), (i = t);
    }
    return s;
  }
  peek(t) {
    let e,
      i,
      n = this.chunkOff + t;
    if (n >= 0 && n < this.chunk.length) (e = this.pos + t), (i = this.chunk.charCodeAt(n));
    else {
      let n = this.resolveOffset(t, 1);
      if (null == n) return -1;
      if (((e = n), e >= this.chunk2Pos && e < this.chunk2Pos + this.chunk2.length))
        i = this.chunk2.charCodeAt(e - this.chunk2Pos);
      else {
        let t = this.rangeIndex,
          n = this.range;
        for (; n.to <= e; ) n = this.ranges[++t];
        (this.chunk2 = this.input.chunk((this.chunk2Pos = e))),
          e + this.chunk2.length > n.to && (this.chunk2 = this.chunk2.slice(0, n.to - e)),
          (i = this.chunk2.charCodeAt(0));
      }
    }
    return e >= this.token.lookAhead && (this.token.lookAhead = e + 1), i;
  }
  acceptToken(t, e = 0) {
    let i = e ? this.resolveOffset(e, -1) : this.pos;
    if (null == i || i < this.token.start) throw new RangeError('Token end out of bounds');
    (this.token.value = t), (this.token.end = i);
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: t, chunkPos: e } = this;
      (this.chunk = this.chunk2),
        (this.chunkPos = this.chunk2Pos),
        (this.chunk2 = t),
        (this.chunk2Pos = e),
        (this.chunkOff = this.pos - this.chunkPos);
    } else {
      (this.chunk2 = this.chunk), (this.chunk2Pos = this.chunkPos);
      let t = this.input.chunk(this.pos),
        e = this.pos + t.length;
      (this.chunk = e > this.range.to ? t.slice(0, this.range.to - this.pos) : t),
        (this.chunkPos = this.pos),
        (this.chunkOff = 0);
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length)
      ? (this.next = -1)
      : (this.next = this.chunk.charCodeAt(this.chunkOff));
  }
  advance(t = 1) {
    for (this.chunkOff += t; this.pos + t >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
      (t -= this.range.to - this.pos), (this.range = this.ranges[++this.rangeIndex]), (this.pos = this.range.from);
    }
    return (this.pos += t), this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return (
      (this.pos = this.chunkPos = this.end),
      (this.range = this.ranges[(this.rangeIndex = this.ranges.length - 1)]),
      (this.chunk = ''),
      (this.next = -1)
    );
  }
  reset(t, e) {
    if (
      (e ? ((this.token = e), (e.start = t), (e.lookAhead = t + 1), (e.value = e.extended = -1)) : (this.token = iO),
      this.pos != t)
    ) {
      if (((this.pos = t), t == this.end)) return this.setDone(), this;
      for (; t < this.range.from; ) this.range = this.ranges[--this.rangeIndex];
      for (; t >= this.range.to; ) this.range = this.ranges[++this.rangeIndex];
      t >= this.chunkPos && t < this.chunkPos + this.chunk.length
        ? (this.chunkOff = t - this.chunkPos)
        : ((this.chunk = ''), (this.chunkOff = 0)),
        this.readNext();
    }
    return this;
  }
  read(t, e) {
    if (t >= this.chunkPos && e <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(t - this.chunkPos, e - this.chunkPos);
    if (t >= this.chunk2Pos && e <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(t - this.chunk2Pos, e - this.chunk2Pos);
    if (t >= this.range.from && e <= this.range.to) return this.input.read(t, e);
    let i = '';
    for (let n of this.ranges) {
      if (n.from >= e) break;
      n.to > t && (i += this.input.read(Math.max(n.from, t), Math.min(n.to, e)));
    }
    return i;
  }
}
class sO {
  constructor(t, e) {
    (this.data = t), (this.id = e);
  }
  token(t, e) {
    !(function (t, e, i, n) {
      let s = 0,
        r = 1 << n,
        { parser: o } = i.p,
        { dialect: a } = o;
      t: for (; 0 != (r & t[s]); ) {
        let i = t[s + 1];
        for (let n = s + 3; n < i; n += 2)
          if ((t[n + 1] & r) > 0) {
            let i = t[n];
            if (a.allows(i) && (-1 == e.token.value || e.token.value == i || o.overrides(i, e.token.value))) {
              e.acceptToken(i);
              break;
            }
          }
        let n = e.next,
          l = 0,
          h = t[s + 2];
        if (!(e.next < 0 && h > l && 65535 == t[i + 3 * h - 3])) {
          for (; l < h; ) {
            let r = (l + h) >> 1,
              o = i + r + (r << 1),
              a = t[o],
              c = t[o + 1];
            if (n < a) h = r;
            else {
              if (!(n >= c)) {
                (s = t[o + 2]), e.advance();
                continue t;
              }
              l = r + 1;
            }
          }
          break;
        }
        s = t[i + 3 * h - 1];
      }
    })(this.data, t, e, this.id);
  }
}
sO.prototype.contextual = sO.prototype.fallback = sO.prototype.extend = !1;
class rO {
  constructor(t, e = {}) {
    (this.token = t), (this.contextual = !!e.contextual), (this.fallback = !!e.fallback), (this.extend = !!e.extend);
  }
}
function oO(t, e = Uint16Array) {
  if ('string' != typeof t) return t;
  let i = null;
  for (let n = 0, s = 0; n < t.length; ) {
    let r = 0;
    for (;;) {
      let e = t.charCodeAt(n++),
        i = !1;
      if (126 == e) {
        r = 65535;
        break;
      }
      e >= 92 && e--, e >= 34 && e--;
      let s = e - 32;
      if ((s >= 46 && ((s -= 46), (i = !0)), (r += s), i)) break;
      r *= 46;
    }
    i ? (i[s++] = r) : (i = new e(r));
  }
  return i;
}
const aO = 'undefined' != typeof process && process.env && /\bparse\b/.test(process.env.LOG);
let lO = null;
var hO, cO;
function uO(t, e, i) {
  let n = t.cursor(c.IncludeAnonymous);
  for (n.moveTo(e); ; )
    if (!(i < 0 ? n.childBefore(e) : n.childAfter(e)))
      for (;;) {
        if ((i < 0 ? n.to < e : n.from > e) && !n.type.isError)
          return i < 0 ? Math.max(0, Math.min(n.to - 1, e - 25)) : Math.min(t.length, Math.max(n.from + 1, e + 25));
        if (i < 0 ? n.prevSibling() : n.nextSibling()) break;
        if (!n.parent()) return i < 0 ? 0 : t.length;
      }
}
!(function (t) {
  t[(t.Margin = 25)] = 'Margin';
})(hO || (hO = {}));
class OO {
  constructor(t, e) {
    (this.fragments = t),
      (this.nodeSet = e),
      (this.i = 0),
      (this.fragment = null),
      (this.safeFrom = -1),
      (this.safeTo = -1),
      (this.trees = []),
      (this.start = []),
      (this.index = []),
      this.nextFragment();
  }
  nextFragment() {
    let t = (this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++]);
    if (t) {
      for (
        this.safeFrom = t.openStart ? uO(t.tree, t.from + t.offset, 1) - t.offset : t.from,
          this.safeTo = t.openEnd ? uO(t.tree, t.to + t.offset, -1) - t.offset : t.to;
        this.trees.length;

      )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(t.tree), this.start.push(-t.offset), this.index.push(0), (this.nextStart = this.safeFrom);
    } else this.nextStart = 1e9;
  }
  nodeAt(t) {
    if (t < this.nextStart) return null;
    for (; this.fragment && this.safeTo <= t; ) this.nextFragment();
    if (!this.fragment) return null;
    for (;;) {
      let e = this.trees.length - 1;
      if (e < 0) return this.nextFragment(), null;
      let i = this.trees[e],
        s = this.index[e];
      if (s == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let r = i.children[s],
        o = this.start[e] + i.positions[s];
      if (o > t) return (this.nextStart = o), null;
      if (r instanceof u) {
        if (o == t) {
          if (o < this.safeFrom) return null;
          let t = o + r.length;
          if (t <= this.safeTo) {
            let e = r.prop(n.lookAhead);
            if (!e || t + e < this.fragment.to) return r;
          }
        }
        this.index[e]++,
          o + r.length >= Math.max(this.safeFrom, t) && (this.trees.push(r), this.start.push(o), this.index.push(0));
      } else this.index[e]++, (this.nextStart = o + r.length);
    }
  }
}
class fO {
  constructor(t, e) {
    (this.stream = e),
      (this.tokens = []),
      (this.mainToken = null),
      (this.actions = []),
      (this.tokens = t.tokenizers.map((t) => new eO()));
  }
  getActions(t) {
    let e = 0,
      i = null,
      { parser: n } = t.p,
      { tokenizers: s } = n,
      r = n.stateSlot(t.state, 3),
      o = t.curContext ? t.curContext.hash : 0,
      a = 0;
    for (let n = 0; n < s.length; n++) {
      if (0 == ((1 << n) & r)) continue;
      let l = s[n],
        h = this.tokens[n];
      if (
        (!i || l.fallback) &&
        ((l.contextual || h.start != t.pos || h.mask != r || h.context != o) &&
          (this.updateCachedToken(h, l, t), (h.mask = r), (h.context = o)),
        h.lookAhead > h.end + 25 && (a = Math.max(h.lookAhead, a)),
        0 != h.value)
      ) {
        let n = e;
        if (
          (h.extended > -1 && (e = this.addActions(t, h.extended, h.end, e)),
          (e = this.addActions(t, h.value, h.end, e)),
          !l.extend && ((i = h), e > n))
        )
          break;
      }
    }
    for (; this.actions.length > e; ) this.actions.pop();
    return (
      a && t.setLookAhead(a),
      i ||
        t.pos != this.stream.end ||
        ((i = new eO()),
        (i.value = t.p.parser.eofTerm),
        (i.start = i.end = t.pos),
        (e = this.addActions(t, i.value, i.end, e))),
      (this.mainToken = i),
      this.actions
    );
  }
  getMainToken(t) {
    if (this.mainToken) return this.mainToken;
    let e = new eO(),
      { pos: i, p: n } = t;
    return (
      (e.start = i), (e.end = Math.min(i + 1, n.stream.end)), (e.value = i == n.stream.end ? n.parser.eofTerm : 0), e
    );
  }
  updateCachedToken(t, e, i) {
    if ((e.token(this.stream.reset(i.pos, t), i), t.value > -1)) {
      let { parser: e } = i.p;
      for (let n = 0; n < e.specialized.length; n++)
        if (e.specialized[n] == t.value) {
          let s = e.specializers[n](this.stream.read(t.start, t.end), i);
          if (s >= 0 && i.p.parser.dialect.allows(s >> 1)) {
            0 == (1 & s) ? (t.value = s >> 1) : (t.extended = s >> 1);
            break;
          }
        }
    } else (t.value = 0), (t.end = Math.min(i.p.stream.end, i.pos + 1));
  }
  putAction(t, e, i, n) {
    for (let e = 0; e < n; e += 3) if (this.actions[e] == t) return n;
    return (this.actions[n++] = t), (this.actions[n++] = e), (this.actions[n++] = i), n;
  }
  addActions(t, e, i, n) {
    let { state: s } = t,
      { parser: r } = t.p,
      { data: o } = r;
    for (let t = 0; t < 2; t++)
      for (let a = r.stateSlot(s, t ? 2 : 1); ; a += 3) {
        if (65535 == o[a]) {
          if (1 != o[a + 1]) {
            0 == n && 2 == o[a + 1] && (n = this.putAction(yO(o, a + 2), e, i, n));
            break;
          }
          a = yO(o, a + 2);
        }
        o[a] == e && (n = this.putAction(yO(o, a + 1), e, i, n));
      }
    return n;
  }
}
!(function (t) {
  (t[(t.Distance = 5)] = 'Distance'),
    (t[(t.MaxRemainingPerStep = 3)] = 'MaxRemainingPerStep'),
    (t[(t.MinBufferLengthPrune = 500)] = 'MinBufferLengthPrune'),
    (t[(t.ForceReduceLimit = 10)] = 'ForceReduceLimit'),
    (t[(t.CutDepth = 15e3)] = 'CutDepth'),
    (t[(t.CutTo = 9e3)] = 'CutTo');
})(cO || (cO = {}));
class dO {
  constructor(t, e, i, n) {
    (this.parser = t),
      (this.input = e),
      (this.ranges = n),
      (this.recovering = 0),
      (this.nextStackID = 9812),
      (this.minStackPos = 0),
      (this.reused = []),
      (this.stoppedAt = null),
      (this.stream = new nO(e, n)),
      (this.tokens = new fO(t, this.stream)),
      (this.topTerm = t.top[1]);
    let { from: s } = n[0];
    (this.stacks = [Fu.start(this, t.top[0], s)]),
      (this.fragments = i.length && this.stream.end - s > 4 * t.bufferLength ? new OO(i, t.nodeSet) : null);
  }
  get parsedPos() {
    return this.minStackPos;
  }
  advance() {
    let t,
      e,
      i = this.stacks,
      n = this.minStackPos,
      s = (this.stacks = []);
    for (let r = 0; r < i.length; r++) {
      let o = i[r];
      for (;;) {
        if (((this.tokens.mainToken = null), o.pos > n)) s.push(o);
        else {
          if (this.advanceStack(o, s, i)) continue;
          {
            t || ((t = []), (e = [])), t.push(o);
            let i = this.tokens.getMainToken(o);
            e.push(i.value, i.end);
          }
        }
        break;
      }
    }
    if (!s.length) {
      let e =
        t &&
        (function (t) {
          let e = null;
          for (let i of t) {
            let t = i.p.stoppedAt;
            (i.pos == i.p.stream.end || (null != t && i.pos > t)) &&
              i.p.parser.stateFlag(i.state, 2) &&
              (!e || e.score < i.score) &&
              (e = i);
          }
          return e;
        })(t);
      if (e) return this.stackToTree(e);
      if (this.parser.strict)
        throw (
          (aO &&
            t &&
            console.log(
              'Stuck with token ' + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : 'none'),
            ),
          new SyntaxError('No parse at ' + n))
        );
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && t) {
      let i = null != this.stoppedAt && t[0].pos > this.stoppedAt ? t[0] : this.runRecovery(t, e, s);
      if (i) return this.stackToTree(i.forceAll());
    }
    if (this.recovering) {
      let t = 1 == this.recovering ? 1 : 3 * this.recovering;
      if (s.length > t) for (s.sort((t, e) => e.score - t.score); s.length > t; ) s.pop();
      s.some((t) => t.reducePos > n) && this.recovering--;
    } else if (s.length > 1)
      t: for (let t = 0; t < s.length - 1; t++) {
        let e = s[t];
        for (let i = t + 1; i < s.length; i++) {
          let n = s[i];
          if (e.sameState(n) || (e.buffer.length > 500 && n.buffer.length > 500)) {
            if (!((e.score - n.score || e.buffer.length - n.buffer.length) > 0)) {
              s.splice(t--, 1);
              continue t;
            }
            s.splice(i--, 1);
          }
        }
      }
    this.minStackPos = s[0].pos;
    for (let t = 1; t < s.length; t++) s[t].pos < this.minStackPos && (this.minStackPos = s[t].pos);
    return null;
  }
  stopAt(t) {
    if (null != this.stoppedAt && this.stoppedAt < t) throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = t;
  }
  advanceStack(t, e, i) {
    let s = t.pos,
      { parser: r } = this,
      o = aO ? this.stackID(t) + ' -> ' : '';
    if (null != this.stoppedAt && s > this.stoppedAt) return t.forceReduce() ? t : null;
    if (this.fragments) {
      let e = t.curContext && t.curContext.tracker.strict,
        i = e ? t.curContext.hash : 0;
      for (let a = this.fragments.nodeAt(s); a; ) {
        let s = this.parser.nodeSet.types[a.type.id] == a.type ? r.getGoto(t.state, a.type.id) : -1;
        if (s > -1 && a.length && (!e || (a.prop(n.contextHash) || 0) == i))
          return (
            t.useNode(a, s), aO && console.log(o + this.stackID(t) + ` (via reuse of ${r.getName(a.type.id)})`), !0
          );
        if (!(a instanceof u) || 0 == a.children.length || a.positions[0] > 0) break;
        let l = a.children[0];
        if (!(l instanceof u && 0 == a.positions[0])) break;
        a = l;
      }
    }
    let a = r.stateSlot(t.state, 4);
    if (a > 0)
      return t.reduce(a), aO && console.log(o + this.stackID(t) + ` (via always-reduce ${r.getName(65535 & a)})`), !0;
    if (t.stack.length >= 15e3) for (; t.stack.length > 9e3 && t.forceReduce(); );
    let l = this.tokens.getActions(t);
    for (let n = 0; n < l.length; ) {
      let a = l[n++],
        h = l[n++],
        c = l[n++],
        u = n == l.length || !i,
        O = u ? t : t.split();
      if (
        (O.apply(a, h, c),
        aO &&
          console.log(
            o +
              this.stackID(O) +
              ` (via ${0 == (65536 & a) ? 'shift' : `reduce of ${r.getName(65535 & a)}`} for ${r.getName(h)} @ ${s}${
                O == t ? '' : ', split'
              })`,
          ),
        u)
      )
        return !0;
      O.pos > s ? e.push(O) : i.push(O);
    }
    return !1;
  }
  advanceFully(t, e) {
    let i = t.pos;
    for (;;) {
      if (!this.advanceStack(t, null, null)) return !1;
      if (t.pos > i) return pO(t, e), !0;
    }
  }
  runRecovery(t, e, i) {
    let n = null,
      s = !1;
    for (let r = 0; r < t.length; r++) {
      let o = t[r],
        a = e[r << 1],
        l = e[1 + (r << 1)],
        h = aO ? this.stackID(o) + ' -> ' : '';
      if (o.deadEnd) {
        if (s) continue;
        if (((s = !0), o.restart(), aO && console.log(h + this.stackID(o) + ' (restarted)'), this.advanceFully(o, i)))
          continue;
      }
      let c = o.split(),
        u = h;
      for (let t = 0; c.forceReduce() && t < 10; t++) {
        if ((aO && console.log(u + this.stackID(c) + ' (via force-reduce)'), this.advanceFully(c, i))) break;
        aO && (u = this.stackID(c) + ' -> ');
      }
      for (let t of o.recoverByInsert(a))
        aO && console.log(h + this.stackID(t) + ' (via recover-insert)'), this.advanceFully(t, i);
      this.stream.end > o.pos
        ? (l == o.pos && (l++, (a = 0)),
          o.recoverByDelete(a, l),
          aO && console.log(h + this.stackID(o) + ` (via recover-delete ${this.parser.getName(a)})`),
          pO(o, i))
        : (!n || n.score < o.score) && (n = o);
    }
    return n;
  }
  stackToTree(t) {
    return (
      t.close(),
      u.build({
        buffer: tO.create(t),
        nodeSet: this.parser.nodeSet,
        topID: this.topTerm,
        maxBufferLength: this.parser.bufferLength,
        reused: this.reused,
        start: this.ranges[0].from,
        length: t.pos - this.ranges[0].from,
        minRepeatType: this.parser.minRepeatTerm,
      })
    );
  }
  stackID(t) {
    let e = (lO || (lO = new WeakMap())).get(t);
    return e || lO.set(t, (e = String.fromCodePoint(this.nextStackID++))), e + t;
  }
}
function pO(t, e) {
  for (let i = 0; i < e.length; i++) {
    let n = e[i];
    if (n.pos == t.pos && n.sameState(t)) return void (e[i].score < t.score && (e[i] = t));
  }
  e.push(t);
}
class gO {
  constructor(t, e, i) {
    (this.source = t), (this.flags = e), (this.disabled = i);
  }
  allows(t) {
    return !this.disabled || 0 == this.disabled[t];
  }
}
const mO = (t) => t;
class QO {
  constructor(t) {
    (this.start = t.start),
      (this.shift = t.shift || mO),
      (this.reduce = t.reduce || mO),
      (this.reuse = t.reuse || mO),
      (this.hash = t.hash || (() => 0)),
      (this.strict = !1 !== t.strict);
  }
}
class bO extends R {
  constructor(e) {
    if ((super(), (this.wrappers = []), 14 != e.version))
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let i = e.nodeNames.split(' ');
    this.minRepeatTerm = i.length;
    for (let t = 0; t < e.repeatNodeCount; t++) i.push('');
    let s = Object.keys(e.topRules).map((t) => e.topRules[t][1]),
      r = [];
    for (let t = 0; t < i.length; t++) r.push([]);
    function l(t, e, i) {
      r[t].push([e, e.deserialize(String(i))]);
    }
    if (e.nodeProps)
      for (let t of e.nodeProps) {
        let e = t[0];
        'string' == typeof e && (e = n[e]);
        for (let i = 1; i < t.length; ) {
          let n = t[i++];
          if (n >= 0) l(n, e, t[i++]);
          else {
            let s = t[i + -n];
            for (let r = -n; r > 0; r--) l(t[i++], e, s);
            i++;
          }
        }
      }
    (this.nodeSet = new a(
      i.map((t, i) =>
        o.define({
          name: i >= this.minRepeatTerm ? void 0 : t,
          id: i,
          props: r[i],
          top: s.indexOf(i) > -1,
          error: 0 == i,
          skipped: e.skippedNodes && e.skippedNodes.indexOf(i) > -1,
        }),
      ),
    )),
      e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)),
      (this.strict = !1),
      (this.bufferLength = t);
    let h = oO(e.tokenData);
    (this.context = e.context),
      (this.specializerSpecs = e.specialized || []),
      (this.specialized = new Uint16Array(this.specializerSpecs.length));
    for (let t = 0; t < this.specializerSpecs.length; t++) this.specialized[t] = this.specializerSpecs[t].term;
    (this.specializers = this.specializerSpecs.map(xO)),
      (this.states = oO(e.states, Uint32Array)),
      (this.data = oO(e.stateData)),
      (this.goto = oO(e.goto)),
      (this.maxTerm = e.maxTerm),
      (this.tokenizers = e.tokenizers.map((t) => ('number' == typeof t ? new sO(h, t) : t))),
      (this.topRules = e.topRules),
      (this.dialects = e.dialects || {}),
      (this.dynamicPrecedences = e.dynamicPrecedences || null),
      (this.tokenPrecTable = e.tokenPrec),
      (this.termNames = e.termNames || null),
      (this.maxNode = this.nodeSet.types.length - 1),
      (this.dialect = this.parseDialect()),
      (this.top = this.topRules[Object.keys(this.topRules)[0]]);
  }
  createParse(t, e, i) {
    let n = new dO(this, t, e, i);
    for (let s of this.wrappers) n = s(n, t, e, i);
    return n;
  }
  getGoto(t, e, i = !1) {
    let n = this.goto;
    if (e >= n[0]) return -1;
    for (let s = n[e + 1]; ; ) {
      let e = n[s++],
        r = 1 & e,
        o = n[s++];
      if (r && i) return o;
      for (let i = s + (e >> 1); s < i; s++) if (n[s] == t) return o;
      if (r) return -1;
    }
  }
  hasAction(t, e) {
    let i = this.data;
    for (let n = 0; n < 2; n++)
      for (let s, r = this.stateSlot(t, n ? 2 : 1); ; r += 3) {
        if (65535 == (s = i[r])) {
          if (1 != i[r + 1]) {
            if (2 == i[r + 1]) return yO(i, r + 2);
            break;
          }
          s = i[(r = yO(i, r + 2))];
        }
        if (s == e || 0 == s) return yO(i, r + 1);
      }
    return 0;
  }
  stateSlot(t, e) {
    return this.states[6 * t + e];
  }
  stateFlag(t, e) {
    return (this.stateSlot(t, 0) & e) > 0;
  }
  validAction(t, e) {
    if (e == this.stateSlot(t, 4)) return !0;
    for (let i = this.stateSlot(t, 1); ; i += 3) {
      if (65535 == this.data[i]) {
        if (1 != this.data[i + 1]) return !1;
        i = yO(this.data, i + 2);
      }
      if (e == yO(this.data, i + 1)) return !0;
    }
  }
  nextStates(t) {
    let e = [];
    for (let i = this.stateSlot(t, 1); ; i += 3) {
      if (65535 == this.data[i]) {
        if (1 != this.data[i + 1]) break;
        i = yO(this.data, i + 2);
      }
      if (0 == (1 & this.data[i + 2])) {
        let t = this.data[i + 1];
        e.some((e, i) => 1 & i && e == t) || e.push(this.data[i], t);
      }
    }
    return e;
  }
  overrides(t, e) {
    let i = wO(this.data, this.tokenPrecTable, e);
    return i < 0 || wO(this.data, this.tokenPrecTable, t) < i;
  }
  configure(t) {
    let e = Object.assign(Object.create(bO.prototype), this);
    if ((t.props && (e.nodeSet = this.nodeSet.extend(...t.props)), t.top)) {
      let i = this.topRules[t.top];
      if (!i) throw new RangeError(`Invalid top rule name ${t.top}`);
      e.top = i;
    }
    return (
      t.tokenizers &&
        (e.tokenizers = this.tokenizers.map((e) => {
          let i = t.tokenizers.find((t) => t.from == e);
          return i ? i.to : e;
        })),
      t.specializers &&
        ((e.specializers = this.specializers.slice()),
        (e.specializerSpecs = this.specializerSpecs.map((i, n) => {
          let s = t.specializers.find((t) => t.from == i.external);
          if (!s) return i;
          let r = Object.assign(Object.assign({}, i), { external: s.to });
          return (e.specializers[n] = xO(r)), r;
        }))),
      t.contextTracker && (e.context = t.contextTracker),
      t.dialect && (e.dialect = this.parseDialect(t.dialect)),
      null != t.strict && (e.strict = t.strict),
      t.wrap && (e.wrappers = e.wrappers.concat(t.wrap)),
      null != t.bufferLength && (e.bufferLength = t.bufferLength),
      e
    );
  }
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  getName(t) {
    return this.termNames ? this.termNames[t] : String((t <= this.maxNode && this.nodeSet.types[t].name) || t);
  }
  get eofTerm() {
    return this.maxNode + 1;
  }
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  dynamicPrecedence(t) {
    let e = this.dynamicPrecedences;
    return null == e ? 0 : e[t] || 0;
  }
  parseDialect(t) {
    let e = Object.keys(this.dialects),
      i = e.map(() => !1);
    if (t)
      for (let n of t.split(' ')) {
        let t = e.indexOf(n);
        t >= 0 && (i[t] = !0);
      }
    let n = null;
    for (let t = 0; t < e.length; t++)
      if (!i[t])
        for (let i, s = this.dialects[e[t]]; 65535 != (i = this.data[s++]); )
          (n || (n = new Uint8Array(this.maxTerm + 1)))[i] = 1;
    return new gO(t, i, n);
  }
  static deserialize(t) {
    return new bO(t);
  }
}
function yO(t, e) {
  return t[e] | (t[e + 1] << 16);
}
function wO(t, e, i) {
  for (let n, s = e; 65535 != (n = t[s]); s++) if (n == i) return s - e;
  return -1;
}
function xO(t) {
  if (t.external) {
    let e = t.extend ? 1 : 0;
    return (i, n) => (t.external(i, n) << 1) | e;
  }
  return t.get;
}
const vO = [
  9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233,
  8239, 8287, 12288,
];
function SO(t) {
  return (t >= 65 && t <= 90) || (t >= 97 && t <= 122) || t >= 161;
}
const kO = new rO((t, e) => {
    for (let n = !1, s = 0, r = 0; ; r++) {
      let { next: o } = t;
      if (!(SO(o) || 45 == o || 95 == o || (n && ((i = o), i >= 48 && i <= 57)))) {
        n && t.acceptToken(40 == o ? 94 : 2 == s && e.canShift(2) ? 2 : 95);
        break;
      }
      !n && (45 != o || r > 0) && (n = !0), s === r && 45 == o && s++, t.advance();
    }
    var i;
  }),
  $O = new rO((t) => {
    if (vO.includes(t.peek(-1))) {
      let { next: e } = t;
      (SO(e) || 95 == e || 35 == e || 46 == e || 91 == e || 58 == e || 45 == e) && t.acceptToken(93);
    }
  }),
  TO = new rO((t) => {
    if (!vO.includes(t.peek(-1))) {
      let { next: e } = t;
      if ((37 == e && (t.advance(), t.acceptToken(1)), SO(e))) {
        do {
          t.advance();
        } while (SO(t.next));
        t.acceptToken(1);
      }
    }
  }),
  PO = Do({
    'AtKeyword import charset namespace keyframes media supports': na.definitionKeyword,
    'from to selector': na.keyword,
    NamespaceName: na.namespace,
    KeyframeName: na.labelName,
    TagName: na.tagName,
    ClassName: na.className,
    PseudoClassName: na.constant(na.className),
    IdName: na.labelName,
    'FeatureName PropertyName': na.propertyName,
    AttributeName: na.attributeName,
    NumberLiteral: na.number,
    KeywordQuery: na.keyword,
    UnaryQueryOp: na.operatorKeyword,
    'CallTag ValueName': na.atom,
    VariableName: na.variableName,
    Callee: na.operatorKeyword,
    Unit: na.unit,
    'UniversalSelector NestingSelector': na.definitionOperator,
    MatchOp: na.compareOperator,
    'ChildOp SiblingOp, LogicOp': na.logicOperator,
    BinOp: na.arithmeticOperator,
    Important: na.modifier,
    Comment: na.blockComment,
    ParenthesizedContent: na.special(na.name),
    ColorLiteral: na.color,
    StringLiteral: na.string,
    ':': na.punctuation,
    'PseudoOp #': na.derefOperator,
    '; ,': na.separator,
    '( )': na.paren,
    '[ ]': na.squareBracket,
    '{ }': na.brace,
  }),
  RO = {
    __proto__: null,
    lang: 32,
    'nth-child': 32,
    'nth-last-child': 32,
    'nth-of-type': 32,
    'nth-last-of-type': 32,
    dir: 32,
    'host-context': 32,
    url: 60,
    'url-prefix': 60,
    domain: 60,
    regexp: 60,
    selector: 134,
  },
  CO = {
    __proto__: null,
    '@import': 114,
    '@media': 138,
    '@charset': 142,
    '@namespace': 146,
    '@keyframes': 152,
    '@supports': 164,
  },
  WO = { __proto__: null, not: 128, only: 128, from: 158, to: 160 },
  XO = bO.deserialize({
    version: 14,
    states:
      "7WOYQ[OOOOQP'#Cd'#CdOOQP'#Cc'#CcO!ZQ[O'#CfO!}QXO'#CaO#UQ[O'#ChO#aQ[O'#DPO#fQ[O'#DTOOQP'#Ec'#EcO#kQdO'#DeO$VQ[O'#DrO#kQdO'#DtO$hQ[O'#DvO$sQ[O'#DyO$xQ[O'#EPO%WQ[O'#EROOQS'#Eb'#EbOOQS'#ES'#ESQYQ[OOOOQP'#Cg'#CgOOQP,59Q,59QO!ZQ[O,59QO%_Q[O'#EVO%yQWO,58{O&RQ[O,59SO#aQ[O,59kO#fQ[O,59oO%_Q[O,59sO%_Q[O,59uO%_Q[O,59vO'bQ[O'#D`OOQS,58{,58{OOQP'#Ck'#CkOOQO'#C}'#C}OOQP,59S,59SO'iQWO,59SO'nQWO,59SOOQP'#DR'#DROOQP,59k,59kOOQO'#DV'#DVO'sQ`O,59oOOQS'#Cp'#CpO#kQdO'#CqO'{QvO'#CsO)VQtO,5:POOQO'#Cx'#CxO'nQWO'#CwO)kQWO'#CyOOQS'#Ef'#EfOOQO'#Dh'#DhO)pQ[O'#DoO*OQWO'#EiO$xQ[O'#DmO*^QWO'#DpOOQO'#Ej'#EjO%|QWO,5:^O*cQpO,5:`OOQS'#Dx'#DxO*kQWO,5:bO*pQ[O,5:bOOQO'#D{'#D{O*xQWO,5:eO*}QWO,5:kO+VQWO,5:mOOQS-E8Q-E8QOOQP1G.l1G.lO+yQXO,5:qOOQO-E8T-E8TOOQS1G.g1G.gOOQP1G.n1G.nO'iQWO1G.nO'nQWO1G.nOOQP1G/V1G/VO,WQ`O1G/ZO,qQXO1G/_O-XQXO1G/aO-oQXO1G/bO.VQXO'#CdO.zQWO'#DaOOQS,59z,59zO/PQWO,59zO/XQ[O,59zO/`Q[O'#DOO/gQdO'#CoOOQP1G/Z1G/ZO#kQdO1G/ZO/nQpO,59]OOQS,59_,59_O#kQdO,59aO/vQWO1G/kOOQS,59c,59cO/{Q!bO,59eO0TQWO'#DhO0`QWO,5:TO0eQWO,5:ZO$xQ[O,5:VO$xQ[O'#EYO0mQWO,5;TO0xQWO,5:XO%_Q[O,5:[OOQS1G/x1G/xOOQS1G/z1G/zOOQS1G/|1G/|O1ZQWO1G/|O1`QdO'#D|OOQS1G0P1G0POOQS1G0V1G0VOOQS1G0X1G0XOOQP7+$Y7+$YOOQP7+$u7+$uO#kQdO7+$uO#kQdO,59{O1nQ[O'#EXO1xQWO1G/fOOQS1G/f1G/fO1xQWO1G/fO2QQXO'#EhO2XQWO,59jO2^QtO'#ETO3RQdO'#EeO3]QWO,59ZO3bQpO7+$uOOQS1G.w1G.wOOQS1G.{1G.{OOQS7+%V7+%VO3jQWO1G/PO#kQdO1G/oOOQO1G/u1G/uOOQO1G/q1G/qO3oQWO,5:tOOQO-E8W-E8WO3}QXO1G/vOOQS7+%h7+%hO4UQYO'#CsO%|QWO'#EZO4^QdO,5:hOOQS,5:h,5:hO4lQpO<<HaO4tQtO1G/gOOQO,5:s,5:sO5XQ[O,5:sOOQO-E8V-E8VOOQS7+%Q7+%QO5cQWO7+%QO5kQWO,5;SOOQP1G/U1G/UOOQS-E8R-E8RO#kQdO'#EUO5sQWO,5;POOQT1G.u1G.uOOQP<<Ha<<HaOOQS7+$k7+$kO5{QdO7+%ZOOQO7+%b7+%bOOQS,5:u,5:uOOQS-E8X-E8XOOQS1G0S1G0SOOQPAN={AN={O6SQtO'#EWO#kQdO'#EWO6}QdO7+%ROOQO7+%R7+%ROOQO1G0_1G0_OOQS<<Hl<<HlO7_QdO,5:pOOQO-E8S-E8SOOQO<<Hu<<HuO7iQtO,5:rOOQS-E8U-E8UOOQO<<Hm<<Hm",
    stateData:
      '8j~O#TOSROS~OUWOXWO]TO^TOtUOxVO!Y_O!ZXO!gYO!iZO!k[O!n]O!t^O#RPO#WRO~O#RcO~O]hO^hOpfOtiOxjO|kO!PmO#PlO#WeO~O!RnO~P!`O`tO#QqO#RpO~O#RuO~O#RwO~OQ!QObzOf!QOh!QOn!PO#Q}O#RyO#Z{O~Ob!SO!b!UO!e!VO#R!RO!R#]P~Oh![On!PO#R!ZO~O#R!^O~Ob!SO!b!UO!e!VO#R!RO~O!W#]P~P$VOUWOXWO]TO^TOtUOxVO#RPO#WRO~OpfO!RnO~O`!iO#QqO#RpO~OQ!pOUWOXWO]TO^TOtUOxVO!Y_O!ZXO!gYO!iZO!k[O!n]O!t^O#R!oO#WRO~O!Q!qO~P&^Ob!tO~Ob!uO~Ov!vOz!wO~OP!yObgXjgX!WgX!bgX!egX#RgXagXQgXfgXhgXngXpgX#QgX#ZgXvgX!QgX!VgX~Ob!SOj!zO!b!UO!e!VO#R!RO!W#]P~Ob!}O~Ob!SO!b!UO!e!VO#R#OO~Op#SO!`#RO!R#]X!W#]X~Ob#VO~Oj!zO!W#XO~O!W#YO~Oh#ZOn!PO~O!R#[O~O!RnO!`#RO~O!RnO!W#_O~O]hO^hOtiOxjO|kO!PmO#PlO#WeO~Op!ya!R!yaa!ya~P+_Ov#aOz#bO~O]hO^hOtiOxjO#WeO~Op{i|{i!P{i!R{i#P{ia{i~P,`Op}i|}i!P}i!R}i#P}ia}i~P,`Op!Oi|!Oi!P!Oi!R!Oi#P!Oia!Oi~P,`O]WX]!UX^WXpWXtWXxWX|WX!PWX!RWX#PWX#WWX~O]#cO~O!Q#fO!W#dO~O!Q#fO~P&^Oa#[P~P%_Oa#XP~P#kOa#nOj!zO~O!W#pO~Oh#qOo#qO~O]!^Xa![X!`![X~O]#rO~Oa#sO!`#RO~Op#SO!R#]a!W#]a~O!`#ROp!aa!R!aa!W!aaa!aa~O!W#xO~O!Q#|O!q#zO!r#zO#Z#yO~O!Q!{X!W!{X~P&^O!Q$SO!W#dO~Oa#[X~P!`Oa$VO~Oj!zOQ!wXa!wXb!wXf!wXh!wXn!wXp!wX#Q!wX#R!wX#Z!wX~Op$XOa#XX~P#kOa$ZO~Oj!zOv$[O~Oa$]O~O!`#ROp!|a!R!|a!W!|a~Oa$_O~P+_OP!yO!RgX~O!Q$bO!q#zO!r#zO#Z#yO~Oj!zOv$cO~Oj!zOp$eO!V$gO!Q!Ti!W!Ti~P#kO!Q!{a!W!{a~P&^O!Q$iO!W#dO~OpfOa#[a~Op$XOa#Xa~Oa$lO~P#kOj!zOQ!zXb!zXf!zXh!zXn!zXp!zX!Q!zX!V!zX!W!zX#Q!zX#R!zX#Z!zX~Op$eO!V$oO!Q!Tq!W!Tq~P#kOa!xap!xa~P#kOj!zOQ!zab!zaf!zah!zan!zap!za!Q!za!V!za!W!za#Q!za#R!za#Z!za~Oo#Zj!Pj~',
    goto: ",O#_PPPPP#`P#h#vP#h$U#hPP$[PPP$b$k$kP$}P$kP$k%e%wPPP&a&g#hP&mP#hP&sP#hP#h#hPPP&y']'iPP#`PP'o'o'y'oP'oP'o'oP#`P#`P#`P'|#`P(P(SPP#`P#`(V(e(s(y)T)Z)e)kPPPPPP)q)yP*e*hP+^+a+j]`Obn!s#d$QiWObfklmn!s!t#V#d$QiQObfklmn!s!t#V#d$QQdRR!ceQrTR!ghQ!gtQ!|!OR#`!iq!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jp!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jT#z#[#{q!OXZz!u!w!z#b#c#k#r$O$X$^$e$f$jp!QXZz!u!w!z#b#c#k#r$O$X$^$e$f$jQ![[R#Z!]QsTR!hhQ!gsR#`!hQvUR!jiQxVR!kjQoSQ!fgQ#W!XQ#^!`Q#_!aR$`#zQ!rnQ#g!sQ$P#dR$h$QX!pn!s#d$Qa!WY^_|!S!U#R#SR#P!SR!][R!_]R#]!_QbOU!bb!s$QQ!snR$Q#dQ#k!uU$W#k$^$jQ$^#rR$j$XQ$Y#kR$k$YQgSS!eg$UR$U#hQ$f$OR$n$fQ#e!rS$R#e$TR$T#gQ#T!TR#v#TQ#{#[R$a#{]aObn!s#d$Q[SObn!s#d$QQ!dfQ!lkQ!mlQ!nmQ#h!tR#w#VR#l!uQ|XQ!YZQ!xz[#j!u#k#r$X$^$jQ#m!wQ#o!zQ#}#bQ$O#cS$d$O$fR$m$eR#i!tQ!XYQ!a_R!{|U!TY_|Q!`^Q#Q!SQ#U!UQ#t#RR#u#S",
    nodeNames:
      '⚠ Unit VariableName Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector ClassSelector ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee CallLiteral CallTag ParenthesizedContent , PseudoClassName ArgList IdSelector # IdName ] AttributeSelector [ AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp } { Block Declaration PropertyName Important ; ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList from to SupportsStatement supports AtRule',
    maxTerm: 106,
    nodeProps: [
      ['openedBy', 17, '(', 48, '{'],
      ['closedBy', 18, ')', 49, '}'],
    ],
    propSources: [PO],
    skippedNodes: [0, 3],
    repeatNodeCount: 8,
    tokenData:
      'Ay~R![OX$wX^%]^p$wpq%]qr(crs+}st,otu2Uuv$wvw2rwx2}xy3jyz3uz{3z{|4_|}8U}!O8a!O!P8x!P!Q9Z!Q![;e![!]<Y!]!^<x!^!_$w!_!`=T!`!a=`!a!b$w!b!c>O!c!}$w!}#O?[#O#P$w#P#Q?g#Q#R2U#R#T$w#T#U?r#U#c$w#c#d@q#d#o$w#o#pAQ#p#q2U#q#rA]#r#sAh#s#y$w#y#z%]#z$f$w$f$g%]$g#BY$w#BY#BZ%]#BZ$IS$w$IS$I_%]$I_$I|$w$I|$JO%]$JO$JT$w$JT$JU%]$JU$KV$w$KV$KW%]$KW&FU$w&FU&FV%]&FV~$wW$zQOy%Qz~%QW%VQoWOy%Qz~%Q~%bf#T~OX%QX^&v^p%Qpq&vqy%Qz#y%Q#y#z&v#z$f%Q$f$g&v$g#BY%Q#BY#BZ&v#BZ$IS%Q$IS$I_&v$I_$I|%Q$I|$JO&v$JO$JT%Q$JT$JU&v$JU$KV%Q$KV$KW&v$KW&FU%Q&FU&FV&v&FV~%Q~&}f#T~oWOX%QX^&v^p%Qpq&vqy%Qz#y%Q#y#z&v#z$f%Q$f$g&v$g#BY%Q#BY#BZ&v#BZ$IS%Q$IS$I_&v$I_$I|%Q$I|$JO&v$JO$JT%Q$JT$JU&v$JU$KV%Q$KV$KW&v$KW&FU%Q&FU&FV&v&FV~%Q^(fSOy%Qz#]%Q#]#^(r#^~%Q^(wSoWOy%Qz#a%Q#a#b)T#b~%Q^)YSoWOy%Qz#d%Q#d#e)f#e~%Q^)kSoWOy%Qz#c%Q#c#d)w#d~%Q^)|SoWOy%Qz#f%Q#f#g*Y#g~%Q^*_SoWOy%Qz#h%Q#h#i*k#i~%Q^*pSoWOy%Qz#T%Q#T#U*|#U~%Q^+RSoWOy%Qz#b%Q#b#c+_#c~%Q^+dSoWOy%Qz#h%Q#h#i+p#i~%Q^+wQ!VUoWOy%Qz~%Q~,QUOY+}Zr+}rs,ds#O+}#O#P,i#P~+}~,iOh~~,lPO~+}_,tWtPOy%Qz!Q%Q!Q![-^![!c%Q!c!i-^!i#T%Q#T#Z-^#Z~%Q^-cWoWOy%Qz!Q%Q!Q![-{![!c%Q!c!i-{!i#T%Q#T#Z-{#Z~%Q^.QWoWOy%Qz!Q%Q!Q![.j![!c%Q!c!i.j!i#T%Q#T#Z.j#Z~%Q^.qWfUoWOy%Qz!Q%Q!Q![/Z![!c%Q!c!i/Z!i#T%Q#T#Z/Z#Z~%Q^/bWfUoWOy%Qz!Q%Q!Q![/z![!c%Q!c!i/z!i#T%Q#T#Z/z#Z~%Q^0PWoWOy%Qz!Q%Q!Q![0i![!c%Q!c!i0i!i#T%Q#T#Z0i#Z~%Q^0pWfUoWOy%Qz!Q%Q!Q![1Y![!c%Q!c!i1Y!i#T%Q#T#Z1Y#Z~%Q^1_WoWOy%Qz!Q%Q!Q![1w![!c%Q!c!i1w!i#T%Q#T#Z1w#Z~%Q^2OQfUoWOy%Qz~%QY2XSOy%Qz!_%Q!_!`2e!`~%QY2lQzQoWOy%Qz~%QX2wQXPOy%Qz~%Q~3QUOY2}Zw2}wx,dx#O2}#O#P3d#P~2}~3gPO~2}_3oQbVOy%Qz~%Q~3zOa~_4RSUPjSOy%Qz!_%Q!_!`2e!`~%Q_4fUjS!PPOy%Qz!O%Q!O!P4x!P!Q%Q!Q![7_![~%Q^4}SoWOy%Qz!Q%Q!Q![5Z![~%Q^5bWoW#ZUOy%Qz!Q%Q!Q![5Z![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%Q^6PWoWOy%Qz{%Q{|6i|}%Q}!O6i!O!Q%Q!Q![6z![~%Q^6nSoWOy%Qz!Q%Q!Q![6z![~%Q^7RSoW#ZUOy%Qz!Q%Q!Q![6z![~%Q^7fYoW#ZUOy%Qz!O%Q!O!P5Z!P!Q%Q!Q![7_![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%Q_8ZQpVOy%Qz~%Q^8fUjSOy%Qz!O%Q!O!P4x!P!Q%Q!Q![7_![~%Q_8}S#WPOy%Qz!Q%Q!Q![5Z![~%Q~9`RjSOy%Qz{9i{~%Q~9nSoWOy9iyz9zz{:o{~9i~9}ROz9zz{:W{~9z~:ZTOz9zz{:W{!P9z!P!Q:j!Q~9z~:oOR~~:tUoWOy9iyz9zz{:o{!P9i!P!Q;W!Q~9i~;_QoWR~Oy%Qz~%Q^;jY#ZUOy%Qz!O%Q!O!P5Z!P!Q%Q!Q![7_![!g%Q!g!h5z!h#X%Q#X#Y5z#Y~%QX<_S]POy%Qz![%Q![!]<k!]~%QX<rQ^PoWOy%Qz~%Q_<}Q!WVOy%Qz~%QY=YQzQOy%Qz~%QX=eS|POy%Qz!`%Q!`!a=q!a~%QX=xQ|PoWOy%Qz~%QX>RUOy%Qz!c%Q!c!}>e!}#T%Q#T#o>e#o~%QX>lY!YPoWOy%Qz}%Q}!O>e!O!Q%Q!Q![>e![!c%Q!c!}>e!}#T%Q#T#o>e#o~%QX?aQxPOy%Qz~%Q^?lQvUOy%Qz~%QX?uSOy%Qz#b%Q#b#c@R#c~%QX@WSoWOy%Qz#W%Q#W#X@d#X~%QX@kQ!`PoWOy%Qz~%QX@tSOy%Qz#f%Q#f#g@d#g~%QXAVQ!RPOy%Qz~%Q_AbQ!QVOy%Qz~%QZAmS!PPOy%Qz!_%Q!_!`2e!`~%Q',
    tokenizers: [$O, TO, kO, 0, 1, 2, 3],
    topRules: { StyleSheet: [0, 4] },
    specialized: [
      { term: 94, get: (t) => RO[t] || -1 },
      { term: 56, get: (t) => CO[t] || -1 },
      { term: 95, get: (t) => WO[t] || -1 },
    ],
    tokenPrec: 1078,
  });
let AO = null;
function ZO() {
  if (!AO && 'object' == typeof document && document.body) {
    let t = [];
    for (let e in document.body.style) /[A-Z]|^-|^(item|length)$/.test(e) || t.push(e);
    AO = t.sort().map((t) => ({ type: 'property', label: t }));
  }
  return AO || [];
}
const jO = [
    'active',
    'after',
    'before',
    'checked',
    'default',
    'disabled',
    'empty',
    'enabled',
    'first-child',
    'first-letter',
    'first-line',
    'first-of-type',
    'focus',
    'hover',
    'in-range',
    'indeterminate',
    'invalid',
    'lang',
    'last-child',
    'last-of-type',
    'link',
    'not',
    'nth-child',
    'nth-last-child',
    'nth-last-of-type',
    'nth-of-type',
    'only-of-type',
    'only-child',
    'optional',
    'out-of-range',
    'placeholder',
    'read-only',
    'read-write',
    'required',
    'root',
    'selection',
    'target',
    'valid',
    'visited',
  ].map((t) => ({ type: 'class', label: t })),
  DO = [
    'above',
    'absolute',
    'activeborder',
    'additive',
    'activecaption',
    'after-white-space',
    'ahead',
    'alias',
    'all',
    'all-scroll',
    'alphabetic',
    'alternate',
    'always',
    'antialiased',
    'appworkspace',
    'asterisks',
    'attr',
    'auto',
    'auto-flow',
    'avoid',
    'avoid-column',
    'avoid-page',
    'avoid-region',
    'axis-pan',
    'background',
    'backwards',
    'baseline',
    'below',
    'bidi-override',
    'blink',
    'block',
    'block-axis',
    'bold',
    'bolder',
    'border',
    'border-box',
    'both',
    'bottom',
    'break',
    'break-all',
    'break-word',
    'bullets',
    'button',
    'button-bevel',
    'buttonface',
    'buttonhighlight',
    'buttonshadow',
    'buttontext',
    'calc',
    'capitalize',
    'caps-lock-indicator',
    'caption',
    'captiontext',
    'caret',
    'cell',
    'center',
    'checkbox',
    'circle',
    'cjk-decimal',
    'clear',
    'clip',
    'close-quote',
    'col-resize',
    'collapse',
    'color',
    'color-burn',
    'color-dodge',
    'column',
    'column-reverse',
    'compact',
    'condensed',
    'contain',
    'content',
    'contents',
    'content-box',
    'context-menu',
    'continuous',
    'copy',
    'counter',
    'counters',
    'cover',
    'crop',
    'cross',
    'crosshair',
    'currentcolor',
    'cursive',
    'cyclic',
    'darken',
    'dashed',
    'decimal',
    'decimal-leading-zero',
    'default',
    'default-button',
    'dense',
    'destination-atop',
    'destination-in',
    'destination-out',
    'destination-over',
    'difference',
    'disc',
    'discard',
    'disclosure-closed',
    'disclosure-open',
    'document',
    'dot-dash',
    'dot-dot-dash',
    'dotted',
    'double',
    'down',
    'e-resize',
    'ease',
    'ease-in',
    'ease-in-out',
    'ease-out',
    'element',
    'ellipse',
    'ellipsis',
    'embed',
    'end',
    'ethiopic-abegede-gez',
    'ethiopic-halehame-aa-er',
    'ethiopic-halehame-gez',
    'ew-resize',
    'exclusion',
    'expanded',
    'extends',
    'extra-condensed',
    'extra-expanded',
    'fantasy',
    'fast',
    'fill',
    'fill-box',
    'fixed',
    'flat',
    'flex',
    'flex-end',
    'flex-start',
    'footnotes',
    'forwards',
    'from',
    'geometricPrecision',
    'graytext',
    'grid',
    'groove',
    'hand',
    'hard-light',
    'help',
    'hidden',
    'hide',
    'higher',
    'highlight',
    'highlighttext',
    'horizontal',
    'hsl',
    'hsla',
    'hue',
    'icon',
    'ignore',
    'inactiveborder',
    'inactivecaption',
    'inactivecaptiontext',
    'infinite',
    'infobackground',
    'infotext',
    'inherit',
    'initial',
    'inline',
    'inline-axis',
    'inline-block',
    'inline-flex',
    'inline-grid',
    'inline-table',
    'inset',
    'inside',
    'intrinsic',
    'invert',
    'italic',
    'justify',
    'keep-all',
    'landscape',
    'large',
    'larger',
    'left',
    'level',
    'lighter',
    'lighten',
    'line-through',
    'linear',
    'linear-gradient',
    'lines',
    'list-item',
    'listbox',
    'listitem',
    'local',
    'logical',
    'loud',
    'lower',
    'lower-hexadecimal',
    'lower-latin',
    'lower-norwegian',
    'lowercase',
    'ltr',
    'luminosity',
    'manipulation',
    'match',
    'matrix',
    'matrix3d',
    'medium',
    'menu',
    'menutext',
    'message-box',
    'middle',
    'min-intrinsic',
    'mix',
    'monospace',
    'move',
    'multiple',
    'multiple_mask_images',
    'multiply',
    'n-resize',
    'narrower',
    'ne-resize',
    'nesw-resize',
    'no-close-quote',
    'no-drop',
    'no-open-quote',
    'no-repeat',
    'none',
    'normal',
    'not-allowed',
    'nowrap',
    'ns-resize',
    'numbers',
    'numeric',
    'nw-resize',
    'nwse-resize',
    'oblique',
    'opacity',
    'open-quote',
    'optimizeLegibility',
    'optimizeSpeed',
    'outset',
    'outside',
    'outside-shape',
    'overlay',
    'overline',
    'padding',
    'padding-box',
    'painted',
    'page',
    'paused',
    'perspective',
    'pinch-zoom',
    'plus-darker',
    'plus-lighter',
    'pointer',
    'polygon',
    'portrait',
    'pre',
    'pre-line',
    'pre-wrap',
    'preserve-3d',
    'progress',
    'push-button',
    'radial-gradient',
    'radio',
    'read-only',
    'read-write',
    'read-write-plaintext-only',
    'rectangle',
    'region',
    'relative',
    'repeat',
    'repeating-linear-gradient',
    'repeating-radial-gradient',
    'repeat-x',
    'repeat-y',
    'reset',
    'reverse',
    'rgb',
    'rgba',
    'ridge',
    'right',
    'rotate',
    'rotate3d',
    'rotateX',
    'rotateY',
    'rotateZ',
    'round',
    'row',
    'row-resize',
    'row-reverse',
    'rtl',
    'run-in',
    'running',
    's-resize',
    'sans-serif',
    'saturation',
    'scale',
    'scale3d',
    'scaleX',
    'scaleY',
    'scaleZ',
    'screen',
    'scroll',
    'scrollbar',
    'scroll-position',
    'se-resize',
    'self-start',
    'self-end',
    'semi-condensed',
    'semi-expanded',
    'separate',
    'serif',
    'show',
    'single',
    'skew',
    'skewX',
    'skewY',
    'skip-white-space',
    'slide',
    'slider-horizontal',
    'slider-vertical',
    'sliderthumb-horizontal',
    'sliderthumb-vertical',
    'slow',
    'small',
    'small-caps',
    'small-caption',
    'smaller',
    'soft-light',
    'solid',
    'source-atop',
    'source-in',
    'source-out',
    'source-over',
    'space',
    'space-around',
    'space-between',
    'space-evenly',
    'spell-out',
    'square',
    'start',
    'static',
    'status-bar',
    'stretch',
    'stroke',
    'stroke-box',
    'sub',
    'subpixel-antialiased',
    'svg_masks',
    'super',
    'sw-resize',
    'symbolic',
    'symbols',
    'system-ui',
    'table',
    'table-caption',
    'table-cell',
    'table-column',
    'table-column-group',
    'table-footer-group',
    'table-header-group',
    'table-row',
    'table-row-group',
    'text',
    'text-bottom',
    'text-top',
    'textarea',
    'textfield',
    'thick',
    'thin',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedshadow',
    'to',
    'top',
    'transform',
    'translate',
    'translate3d',
    'translateX',
    'translateY',
    'translateZ',
    'transparent',
    'ultra-condensed',
    'ultra-expanded',
    'underline',
    'unidirectional-pan',
    'unset',
    'up',
    'upper-latin',
    'uppercase',
    'url',
    'var',
    'vertical',
    'vertical-text',
    'view-box',
    'visible',
    'visibleFill',
    'visiblePainted',
    'visibleStroke',
    'visual',
    'w-resize',
    'wait',
    'wave',
    'wider',
    'window',
    'windowframe',
    'windowtext',
    'words',
    'wrap',
    'wrap-reverse',
    'x-large',
    'x-small',
    'xor',
    'xx-large',
    'xx-small',
  ]
    .map((t) => ({ type: 'keyword', label: t }))
    .concat(
      [
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'grey',
        'green',
        'greenyellow',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategray',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'rebeccapurple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen',
      ].map((t) => ({ type: 'constant', label: t })),
    ),
  zO = [
    'a',
    'abbr',
    'address',
    'article',
    'aside',
    'b',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'figcaption',
    'figure',
    'footer',
    'form',
    'header',
    'hgroup',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'main',
    'meter',
    'nav',
    'ol',
    'output',
    'p',
    'pre',
    'ruby',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ].map((t) => ({ type: 'type', label: t })),
  MO = /^[\w-]*/,
  _O = (t) => {
    let { state: e, pos: i } = t,
      n = ca(e).resolveInner(i, -1);
    if ('PropertyName' == n.name) return { from: n.from, options: ZO(), validFor: MO };
    if ('ValueName' == n.name) return { from: n.from, options: DO, validFor: MO };
    if ('PseudoClassName' == n.name) return { from: n.from, options: jO, validFor: MO };
    if ('TagName' == n.name) {
      for (let { parent: t } = n; t; t = t.parent)
        if ('Block' == t.name) return { from: n.from, options: ZO(), validFor: MO };
      return { from: n.from, options: zO, validFor: MO };
    }
    if (!t.explicit) return null;
    let s = n.resolve(i),
      r = s.childBefore(i);
    return r && ':' == r.name && 'PseudoClassSelector' == s.name
      ? { from: i, options: jO, validFor: MO }
      : (r && ':' == r.name && 'Declaration' == s.name) || 'ArgList' == s.name
      ? { from: i, options: DO, validFor: MO }
      : 'Block' == s.name
      ? { from: i, options: ZO(), validFor: MO }
      : null;
  },
  qO = ha.define({
    parser: XO.configure({ props: [Ra.add({ Declaration: Ma() }), Ea.add({ Block: Ga })] }),
    languageData: { commentTokens: { block: { open: '/*', close: '*/' } }, indentOnInput: /^\s*\}$/, wordChars: '-' },
  });
function EO() {
  return new wa(qO, qO.data.of({ autocomplete: _O }));
}
var GO = Object.freeze({ __proto__: null, css: EO, cssCompletionSource: _O, cssLanguage: qO });
const VO = {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    command: !0,
    embed: !0,
    frame: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
    menuitem: !0,
  },
  IO = {
    dd: !0,
    li: !0,
    optgroup: !0,
    option: !0,
    p: !0,
    rp: !0,
    rt: !0,
    tbody: !0,
    td: !0,
    tfoot: !0,
    th: !0,
    tr: !0,
  },
  NO = {
    dd: { dd: !0, dt: !0 },
    dt: { dd: !0, dt: !0 },
    li: { li: !0 },
    option: { option: !0, optgroup: !0 },
    optgroup: { optgroup: !0 },
    p: {
      address: !0,
      article: !0,
      aside: !0,
      blockquote: !0,
      dir: !0,
      div: !0,
      dl: !0,
      fieldset: !0,
      footer: !0,
      form: !0,
      h1: !0,
      h2: !0,
      h3: !0,
      h4: !0,
      h5: !0,
      h6: !0,
      header: !0,
      hgroup: !0,
      hr: !0,
      menu: !0,
      nav: !0,
      ol: !0,
      p: !0,
      pre: !0,
      section: !0,
      table: !0,
      ul: !0,
    },
    rp: { rp: !0, rt: !0 },
    rt: { rp: !0, rt: !0 },
    tbody: { tbody: !0, tfoot: !0 },
    td: { td: !0, th: !0 },
    tfoot: { tbody: !0 },
    th: { td: !0, th: !0 },
    thead: { tbody: !0, tfoot: !0 },
    tr: { tr: !0 },
  };
function LO(t) {
  return 9 == t || 10 == t || 13 == t || 32 == t;
}
let UO = null,
  BO = null,
  YO = 0;
function FO(t, e) {
  let i = t.pos + e;
  if (YO == i && BO == t) return UO;
  let n = t.peek(e);
  for (; LO(n); ) n = t.peek(++e);
  let s = '';
  for (; 45 == (r = n) || 46 == r || 58 == r || (r >= 65 && r <= 90) || 95 == r || (r >= 97 && r <= 122) || r >= 161; )
    (s += String.fromCharCode(n)), (n = t.peek(++e));
  var r;
  return (BO = t), (YO = i), (UO = s ? s.toLowerCase() : n == HO || n == JO ? void 0 : null);
}
const HO = 63,
  JO = 33;
function KO(t, e) {
  (this.name = t), (this.parent = e), (this.hash = e ? e.hash : 0);
  for (let e = 0; e < t.length; e++) this.hash += (this.hash << 4) + t.charCodeAt(e) + (t.charCodeAt(e) << 8);
}
const tf = [4, 8, 5, 6, 7],
  ef = new QO({
    start: null,
    shift: (t, e, i, n) => (tf.indexOf(e) > -1 ? new KO(FO(n, 1) || '', t) : t),
    reduce: (t, e) => (18 == e && t ? t.parent : t),
    reuse(t, e, i, n) {
      let s = e.type.id;
      return 4 == s || 35 == s ? new KO(FO(n, 1) || '', t) : t;
    },
    hash: (t) => (t ? t.hash : 0),
    strict: !1,
  }),
  nf = new rO(
    (t, e) => {
      if (60 != t.next) return void (t.next < 0 && e.context && t.acceptToken(56));
      t.advance();
      let i = 47 == t.next;
      i && t.advance();
      let n = FO(t, 0);
      if (void 0 === n) return;
      if (!n) return t.acceptToken(i ? 12 : 4);
      let s = e.context ? e.context.name : null;
      if (i) {
        if (n == s) return t.acceptToken(9);
        if (s && IO[s]) return t.acceptToken(56, -2);
        if (e.dialectEnabled(0)) return t.acceptToken(10);
        for (let t = e.context; t; t = t.parent) if (t.name == n) return;
        t.acceptToken(11);
      } else {
        if ('script' == n) return t.acceptToken(5);
        if ('style' == n) return t.acceptToken(6);
        if ('textarea' == n) return t.acceptToken(7);
        if (VO.hasOwnProperty(n)) return t.acceptToken(8);
        s && NO[s] && NO[s][n] ? t.acceptToken(56, -1) : t.acceptToken(4);
      }
    },
    { contextual: !0 },
  ),
  sf = new rO((t) => {
    for (let e = 0, i = 0; ; i++) {
      if (t.next < 0) {
        i && t.acceptToken(57);
        break;
      }
      if (45 == t.next) e++;
      else {
        if (62 == t.next && e >= 2) {
          i > 3 && t.acceptToken(57, -2);
          break;
        }
        e = 0;
      }
      t.advance();
    }
  });
function rf(t, e, i) {
  let n = 2 + t.length;
  return new rO((s) => {
    for (let r = 0, o = 0, a = 0; ; a++) {
      if (s.next < 0) {
        a && s.acceptToken(e);
        break;
      }
      if ((0 == r && 60 == s.next) || (1 == r && 47 == s.next) || (r >= 2 && r < n && s.next == t.charCodeAt(r - 2)))
        r++, o++;
      else if ((2 != r && r != n) || !LO(s.next)) {
        if (r == n && 62 == s.next) {
          a > o ? s.acceptToken(e, -o) : s.acceptToken(i, -(o - 2));
          break;
        }
        if ((10 == s.next || 13 == s.next) && a) {
          s.acceptToken(e, 1);
          break;
        }
        r = o = 0;
      } else o++;
      s.advance();
    }
  });
}
const of = rf('script', 53, 1),
  af = rf('style', 54, 2),
  lf = rf('textarea', 55, 3),
  hf = Do({
    'Text RawText': na.content,
    'StartTag StartCloseTag SelfCloserEndTag EndTag SelfCloseEndTag': na.angleBracket,
    TagName: na.tagName,
    'MismatchedCloseTag/TagName': [na.tagName, na.invalid],
    AttributeName: na.attributeName,
    'AttributeValue UnquotedAttributeValue': na.attributeValue,
    Is: na.definitionOperator,
    'EntityReference CharacterReference': na.character,
    Comment: na.blockComment,
    ProcessingInst: na.processingInstruction,
    DoctypeDecl: na.documentMeta,
  }),
  cf = bO.deserialize({
    version: 14,
    states:
      ",xOVOxOOO!WQ!bO'#CoO!]Q!bO'#CyO!bQ!bO'#C|O!gQ!bO'#DPO!lQ!bO'#DRO!qOXO'#CnO!|OYO'#CnO#XO[O'#CnO$eOxO'#CnOOOW'#Cn'#CnO$lO!rO'#DSO$tQ!bO'#DUO$yQ!bO'#DVOOOW'#Dj'#DjOOOW'#DX'#DXQVOxOOO%OQ#tO,59ZO%WQ#tO,59eO%`Q#tO,59hO%hQ#tO,59kO%pQ#tO,59mOOOX'#D]'#D]O%xOXO'#CwO&TOXO,59YOOOY'#D^'#D^O&]OYO'#CzO&hOYO,59YOOO['#D_'#D_O&pO[O'#C}O&{O[O,59YOOOW'#D`'#D`O'TOxO,59YO'[Q!bO'#DQOOOW,59Y,59YOOO`'#Da'#DaO'aO!rO,59nOOOW,59n,59nO'iQ!bO,59pO'nQ!bO,59qOOOW-E7V-E7VO'sQ#tO'#CqOOQO'#DY'#DYO(OQ#tO1G.uOOOX1G.u1G.uO(WQ#tO1G/POOOY1G/P1G/PO(`Q#tO1G/SOOO[1G/S1G/SO(hQ#tO1G/VOOOW1G/V1G/VO(pQ#tO1G/XOOOW1G/X1G/XOOOX-E7Z-E7ZO(xQ!bO'#CxOOOW1G.t1G.tOOOY-E7[-E7[O(}Q!bO'#C{OOO[-E7]-E7]O)SQ!bO'#DOOOOW-E7^-E7^O)XQ!bO,59lOOO`-E7_-E7_OOOW1G/Y1G/YOOOW1G/[1G/[OOOW1G/]1G/]O)^Q&jO,59]OOQO-E7W-E7WOOOX7+$a7+$aOOOY7+$k7+$kOOO[7+$n7+$nOOOW7+$q7+$qOOOW7+$s7+$sO)iQ!bO,59dO)nQ!bO,59gO)sQ!bO,59jOOOW1G/W1G/WO)xO,UO'#CtO*ZO7[O'#CtOOQO1G.w1G.wOOOW1G/O1G/OOOOW1G/R1G/ROOOW1G/U1G/UOOOO'#DZ'#DZO*lO,UO,59`OOQO,59`,59`OOOO'#D['#D[O*}O7[O,59`OOOO-E7X-E7XOOQO1G.z1G.zOOOO-E7Y-E7Y",
    stateData:
      '+h~O!]OS~OSSOTPOUQOVROWTOY]OZ[O[^O^^O_^O`^Oa^Ow^Oz_O!cZO~OdaO~OdbO~OdcO~OddO~OdeO~O!VfOPkP!YkP~O!WiOQnP!YnP~O!XlORqP!YqP~OSSOTPOUQOVROWTOXqOY]OZ[O[^O^^O_^O`^Oa^Ow^O!cZO~O!YrO~P#dO!ZsO!duO~OdvO~OdwO~OfyOj|O~OfyOj!OO~OfyOj!QO~OfyOj!SO~OfyOj!UO~O!VfOPkX!YkX~OP!WO!Y!XO~O!WiOQnX!YnX~OQ!ZO!Y!XO~O!XlORqX!YqX~OR!]O!Y!XO~O!Y!XO~P#dOd!_O~O!ZsO!d!aO~Oj!bO~Oj!cO~Og!dOfeXjeX~OfyOj!fO~OfyOj!gO~OfyOj!hO~OfyOj!iO~OfyOj!jO~Od!kO~Od!lO~Od!mO~Oj!nO~Oi!qO!_!oO!a!pO~Oj!rO~Oj!sO~Oj!tO~O_!uO`!uOa!uO!_!wO!`!uO~O_!xO`!xOa!xO!a!wO!b!xO~O_!uO`!uOa!uO!_!{O!`!uO~O_!xO`!xOa!xO!a!{O!b!xO~O`_a!cwz!c~',
    goto: '%o!_PPPPPPPPPPPPPPPPPP!`!fP!lPP!xPP!{#O#R#X#[#_#e#h#k#q#w!`P!`!`P#}$T$k$q$w$}%T%Z%aPPPPPPPP%gX^OX`pXUOX`pezabcde{}!P!R!TR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ}bQ!PcQ!RdQ!TeZ!e{}!P!R!TQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp',
    nodeNames:
      '⚠ StartCloseTag StartCloseTag StartCloseTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue EndTag ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl',
    maxTerm: 66,
    context: ef,
    nodeProps: [
      ['closedBy', -11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 'EndTag', -4, 19, 29, 32, 35, 'CloseTag'],
      [
        'group',
        -9,
        12,
        15,
        16,
        17,
        18,
        38,
        39,
        40,
        41,
        'Entity',
        14,
        'Entity TextContent',
        -3,
        27,
        30,
        33,
        'TextContent Entity',
      ],
      ['openedBy', 26, 'StartTag StartCloseTag', -4, 28, 31, 34, 36, 'OpenTag'],
    ],
    propSources: [hf],
    skippedNodes: [0],
    repeatNodeCount: 9,
    tokenData:
      "!#b!aR!WOX$kXY)sYZ)sZ]$k]^)s^p$kpq)sqr$krs*zsv$kvw+dwx2yx}$k}!O3f!O!P$k!P!Q7_!Q![$k![!]8u!]!^$k!^!_>b!_!`!!p!`!a8T!a!c$k!c!}8u!}#R$k#R#S8u#S#T$k#T#o8u#o$f$k$f$g&R$g%W$k%W%o8u%o%p$k%p&a8u&a&b$k&b1p8u1p4U$k4U4d8u4d4e$k4e$IS8u$IS$I`$k$I`$Ib8u$Ib$Kh$k$Kh%#t8u%#t&/x$k&/x&Et8u&Et&FV$k&FV;'S8u;'S;:j<t;:j?&r$k?&r?Ah8u?Ah?BY$k?BY?Mn8u?Mn~$k!Z$vc^PiW!``!bpOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g~$k!R&[V^P!``!bpOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&Rq&xT^P!bpOv&qwx'Xx!^&q!^!_'g!_~&qP'^R^POv'Xw!^'X!_~'Xp'lQ!bpOv'gx~'ga'yU^P!``Or'rrs'Xsv'rw!^'r!^!_(]!_~'r`(bR!``Or(]sv(]w~(]!Q(rT!``!bpOr(krs'gsv(kwx(]x~(kW)WXiWOX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!a*O^^P!``!bp!]^OX&RXY)sYZ)sZ]&R]^)s^p&Rpq)sqr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!Z+TT!_h^P!bpOv&qwx'Xx!^&q!^!_'g!_~&q!Z+kbiWa!ROX,sXZ.QZ],s]^.Q^p,sqr,srs.Qst/]tw,swx.Qx!P,s!P!Q.Q!Q!],s!]!^)R!^!a.Q!a$f,s$f$g.Q$g~,s!Z,xbiWOX,sXZ.QZ],s]^.Q^p,sqr,srs.Qst)Rtw,swx.Qx!P,s!P!Q.Q!Q!],s!]!^.i!^!a.Q!a$f,s$f$g.Q$g~,s!R.TTOp.Qqs.Qt!].Q!]!^.d!^~.Q!R.iO_!R!Z.pXiW_!ROX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!Z/baiWOX0gXZ1qZ]0g]^1q^p0gqr0grs1qsw0gwx1qx!P0g!P!Q1q!Q!]0g!]!^)R!^!a1q!a$f0g$f$g1q$g~0g!Z0laiWOX0gXZ1qZ]0g]^1q^p0gqr0grs1qsw0gwx1qx!P0g!P!Q1q!Q!]0g!]!^2V!^!a1q!a$f0g$f$g1q$g~0g!R1tSOp1qq!]1q!]!^2Q!^~1q!R2VO`!R!Z2^XiW`!ROX)RZ])R^p)Rqr)Rsw)Rx!P)R!Q!^)R!a$f)R$g~)R!Z3SU!ax^P!``Or'rrs'Xsv'rw!^'r!^!_(]!_~'r!]3qe^PiW!``!bpOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx}$k}!O5S!O!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g~$k!]5_d^PiW!``!bpOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!`&R!`!a6m!a$f$k$f$g&R$g~$k!T6xV^P!``!bp!dQOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!X7hX^P!``!bpOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_!`&R!`!a8T!a~&R!X8`VjU^P!``!bpOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R!a9U!YfSdQ^PiW!``!bpOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx}$k}!O8u!O!P8u!P!Q&R!Q![8u![!]8u!]!^$k!^!_(k!_!a&R!a!c$k!c!}8u!}#R$k#R#S8u#S#T$k#T#o8u#o$f$k$f$g&R$g$}$k$}%O8u%O%W$k%W%o8u%o%p$k%p&a8u&a&b$k&b1p8u1p4U8u4U4d8u4d4e$k4e$IS8u$IS$I`$k$I`$Ib8u$Ib$Je$k$Je$Jg8u$Jg$Kh$k$Kh%#t8u%#t&/x$k&/x&Et8u&Et&FV$k&FV;'S8u;'S;:j<t;:j?&r$k?&r?Ah8u?Ah?BY$k?BY?Mn8u?Mn~$k!a=Pe^PiW!``!bpOX$kXZ&RZ]$k]^&R^p$kpq&Rqr$krs&qsv$kvw)Rwx'rx!P$k!P!Q&R!Q!^$k!^!_(k!_!a&R!a$f$k$f$g&R$g;=`$k;=`<%l8u<%l~$k!R>iW!``!bpOq(kqr?Rrs'gsv(kwx(]x!a(k!a!bKj!b~(k!R?YZ!``!bpOr(krs'gsv(kwx(]x}(k}!O?{!O!f(k!f!gAR!g#W(k#W#XGz#X~(k!R@SV!``!bpOr(krs'gsv(kwx(]x}(k}!O@i!O~(k!R@rT!``!bp!cPOr(krs'gsv(kwx(]x~(k!RAYV!``!bpOr(krs'gsv(kwx(]x!q(k!q!rAo!r~(k!RAvV!``!bpOr(krs'gsv(kwx(]x!e(k!e!fB]!f~(k!RBdV!``!bpOr(krs'gsv(kwx(]x!v(k!v!wBy!w~(k!RCQV!``!bpOr(krs'gsv(kwx(]x!{(k!{!|Cg!|~(k!RCnV!``!bpOr(krs'gsv(kwx(]x!r(k!r!sDT!s~(k!RD[V!``!bpOr(krs'gsv(kwx(]x!g(k!g!hDq!h~(k!RDxW!``!bpOrDqrsEbsvDqvwEvwxFfx!`Dq!`!aGb!a~DqqEgT!bpOvEbvxEvx!`Eb!`!aFX!a~EbPEyRO!`Ev!`!aFS!a~EvPFXOzPqF`Q!bpzPOv'gx~'gaFkV!``OrFfrsEvsvFfvwEvw!`Ff!`!aGQ!a~FfaGXR!``zPOr(]sv(]w~(]!RGkT!``!bpzPOr(krs'gsv(kwx(]x~(k!RHRV!``!bpOr(krs'gsv(kwx(]x#c(k#c#dHh#d~(k!RHoV!``!bpOr(krs'gsv(kwx(]x#V(k#V#WIU#W~(k!RI]V!``!bpOr(krs'gsv(kwx(]x#h(k#h#iIr#i~(k!RIyV!``!bpOr(krs'gsv(kwx(]x#m(k#m#nJ`#n~(k!RJgV!``!bpOr(krs'gsv(kwx(]x#d(k#d#eJ|#e~(k!RKTV!``!bpOr(krs'gsv(kwx(]x#X(k#X#YDq#Y~(k!RKqW!``!bpOrKjrsLZsvKjvwLowxNPx!aKj!a!b! g!b~KjqL`T!bpOvLZvxLox!aLZ!a!bM^!b~LZPLrRO!aLo!a!bL{!b~LoPMORO!`Lo!`!aMX!a~LoPM^OwPqMcT!bpOvLZvxLox!`LZ!`!aMr!a~LZqMyQ!bpwPOv'gx~'gaNUV!``OrNPrsLosvNPvwLow!aNP!a!bNk!b~NPaNpV!``OrNPrsLosvNPvwLow!`NP!`!a! V!a~NPa! ^R!``wPOr(]sv(]w~(]!R! nW!``!bpOrKjrsLZsvKjvwLowxNPx!`Kj!`!a!!W!a~Kj!R!!aT!``!bpwPOr(krs'gsv(kwx(]x~(k!V!!{VgS^P!``!bpOr&Rrs&qsv&Rwx'rx!^&R!^!_(k!_~&R",
    tokenizers: [of, af, lf, nf, sf, 0, 1, 2, 3, 4, 5],
    topRules: { Document: [0, 13] },
    dialects: { noMatch: 0 },
    tokenPrec: 476,
  });
function uf(t, e) {
  let i = Object.create(null);
  for (let n of t.firstChild.getChildren('Attribute')) {
    let t = n.getChild('AttributeName'),
      s = n.getChild('AttributeValue') || n.getChild('UnquotedAttributeValue');
    t &&
      (i[e.read(t.from, t.to)] = s
        ? 'AttributeValue' == s.name
          ? e.read(s.from + 1, s.to - 1)
          : e.read(s.from, s.to)
        : '');
  }
  return i;
}
function Of(t, e, i) {
  let n;
  for (let s of i) if (!s.attrs || s.attrs(n || (n = uf(t.node.parent, e)))) return { parser: s.parser };
  return null;
}
function ff(t) {
  let e = [],
    i = [],
    n = [];
  for (let s of t) {
    let t = 'script' == s.tag ? e : 'style' == s.tag ? i : 'textarea' == s.tag ? n : null;
    if (!t) throw new RangeError('Only script, style, and textarea tags can host nested parsers');
    t.push(s);
  }
  return W((t, s) => {
    let r = t.type.id;
    return 27 == r ? Of(t, s, e) : 30 == r ? Of(t, s, i) : 33 == r ? Of(t, s, n) : null;
  });
}
const df = [
    9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233,
    8239, 8287, 12288,
  ],
  pf = new QO({ start: !1, shift: (t, e) => (5 == e || 6 == e || 286 == e ? t : 287 == e), strict: !1 }),
  gf = new rO(
    (t, e) => {
      let { next: i } = t;
      (125 == i || -1 == i || e.context) && e.canShift(284) && t.acceptToken(284);
    },
    { contextual: !0, fallback: !0 },
  ),
  mf = new rO(
    (t, e) => {
      let i,
        { next: n } = t;
      df.indexOf(n) > -1 ||
        ((47 != n || (47 != (i = t.peek(1)) && 42 != i)) &&
          125 != n &&
          59 != n &&
          -1 != n &&
          !e.context &&
          e.canShift(281) &&
          t.acceptToken(281));
    },
    { contextual: !0 },
  ),
  Qf = new rO(
    (t, e) => {
      let { next: i } = t;
      if ((43 == i || 45 == i) && (t.advance(), i == t.next)) {
        t.advance();
        let i = !e.context && e.canShift(2);
        t.acceptToken(i ? 2 : 3);
      }
    },
    { contextual: !0 },
  ),
  bf = new rO((t) => {
    for (let e = !1, i = 0; ; i++) {
      let { next: n } = t;
      if (n < 0) {
        i && t.acceptToken(282);
        break;
      }
      if (96 == n) {
        i ? t.acceptToken(282) : t.acceptToken(283, 1);
        break;
      }
      if (123 == n && e) {
        1 == i ? t.acceptToken(4, 1) : t.acceptToken(282, -1);
        break;
      }
      if (10 == n && i) {
        t.advance(), t.acceptToken(282);
        break;
      }
      92 == n && t.advance(), (e = 36 == n), t.advance();
    }
  }),
  yf = new rO((t, e) => {
    if (101 == t.next && e.dialectEnabled(1)) {
      t.advance();
      for (let e = 0; e < 6; e++) {
        if (t.next != 'xtends'.charCodeAt(e)) return;
        t.advance();
      }
      (t.next >= 57 && t.next <= 65) ||
        (t.next >= 48 && t.next <= 90) ||
        95 == t.next ||
        (t.next >= 97 && t.next <= 122) ||
        t.next > 160 ||
        t.acceptToken(1);
    }
  }),
  wf = Do({
    'get set async static': na.modifier,
    'for while do if else switch try catch finally return throw break continue default case': na.controlKeyword,
    'in of await yield void typeof delete instanceof': na.operatorKeyword,
    'let var const function class extends': na.definitionKeyword,
    'import export from': na.moduleKeyword,
    'with debugger as new': na.keyword,
    TemplateString: na.special(na.string),
    super: na.atom,
    BooleanLiteral: na.bool,
    this: na.self,
    null: na.null,
    Star: na.modifier,
    VariableName: na.variableName,
    'CallExpression/VariableName TaggedTemplateExpression/VariableName': na.function(na.variableName),
    VariableDefinition: na.definition(na.variableName),
    Label: na.labelName,
    PropertyName: na.propertyName,
    PrivatePropertyName: na.special(na.propertyName),
    'CallExpression/MemberExpression/PropertyName': na.function(na.propertyName),
    'FunctionDeclaration/VariableDefinition': na.function(na.definition(na.variableName)),
    'ClassDeclaration/VariableDefinition': na.definition(na.className),
    PropertyDefinition: na.definition(na.propertyName),
    PrivatePropertyDefinition: na.definition(na.special(na.propertyName)),
    UpdateOp: na.updateOperator,
    LineComment: na.lineComment,
    BlockComment: na.blockComment,
    Number: na.number,
    String: na.string,
    ArithOp: na.arithmeticOperator,
    LogicOp: na.logicOperator,
    BitOp: na.bitwiseOperator,
    CompareOp: na.compareOperator,
    RegExp: na.regexp,
    Equals: na.definitionOperator,
    Arrow: na.function(na.punctuation),
    ': Spread': na.punctuation,
    '( )': na.paren,
    '[ ]': na.squareBracket,
    '{ }': na.brace,
    'InterpolationStart InterpolationEnd': na.special(na.brace),
    '.': na.derefOperator,
    ', ;': na.separator,
    TypeName: na.typeName,
    TypeDefinition: na.definition(na.typeName),
    'type enum interface implements namespace module declare': na.definitionKeyword,
    'abstract global Privacy readonly override': na.modifier,
    'is keyof unique infer': na.operatorKeyword,
    JSXAttributeValue: na.attributeValue,
    JSXText: na.content,
    'JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag': na.angleBracket,
    'JSXIdentifier JSXNameSpacedName': na.tagName,
    'JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName': na.attributeName,
  }),
  xf = {
    __proto__: null,
    export: 18,
    as: 23,
    from: 29,
    default: 32,
    async: 37,
    function: 38,
    this: 48,
    true: 56,
    false: 56,
    void: 66,
    typeof: 70,
    null: 86,
    super: 88,
    new: 122,
    await: 139,
    yield: 141,
    delete: 142,
    class: 152,
    extends: 154,
    public: 197,
    private: 197,
    protected: 197,
    readonly: 199,
    instanceof: 220,
    in: 222,
    const: 224,
    import: 256,
    keyof: 307,
    unique: 311,
    infer: 317,
    is: 351,
    abstract: 371,
    implements: 373,
    type: 375,
    let: 378,
    var: 380,
    interface: 387,
    enum: 391,
    namespace: 397,
    module: 399,
    declare: 403,
    global: 407,
    for: 428,
    of: 437,
    while: 440,
    with: 444,
    do: 448,
    if: 452,
    else: 454,
    switch: 458,
    case: 464,
    try: 470,
    catch: 474,
    finally: 478,
    return: 482,
    throw: 486,
    break: 490,
    continue: 494,
    debugger: 498,
  },
  vf = {
    __proto__: null,
    async: 109,
    get: 111,
    set: 113,
    public: 161,
    private: 161,
    protected: 161,
    static: 163,
    abstract: 165,
    override: 167,
    readonly: 173,
    new: 355,
  },
  Sf = { __proto__: null, '<': 129 },
  kf = bO.deserialize({
    version: 14,
    states:
      "$8SO`QdOOO'QQ(C|O'#ChO'XOWO'#DVO)dQdO'#D]O)tQdO'#DhO){QdO'#DrO-xQdO'#DxOOQO'#E]'#E]O.]Q`O'#E[O.bQ`O'#E[OOQ(C['#Ef'#EfO0aQ(C|O'#ItO2wQ(C|O'#IuO3eQ`O'#EzO3jQ!bO'#FaOOQ(C['#FS'#FSO3rO#tO'#FSO4QQ&jO'#FhO5bQ`O'#FgOOQ(C['#Iu'#IuOOQ(CW'#It'#ItOOQS'#J^'#J^O5gQ`O'#HpO5lQ(ChO'#HqOOQS'#Ih'#IhOOQS'#Hr'#HrQ`QdOOO){QdO'#DjO5tQ`O'#G[O5yQ&jO'#CmO6XQ`O'#EZO6dQ`O'#EgO6iQ,UO'#FRO7TQ`O'#G[O7YQ`O'#G`O7eQ`O'#G`O7sQ`O'#GcO7sQ`O'#GdO7sQ`O'#GfO5tQ`O'#GiO8dQ`O'#GlO9rQ`O'#CdO:SQ`O'#GyO:[Q`O'#HPO:[Q`O'#HRO`QdO'#HTO:[Q`O'#HVO:[Q`O'#HYO:aQ`O'#H`O:fQ(CjO'#HfO){QdO'#HhO:qQ(CjO'#HjO:|Q(CjO'#HlO5lQ(ChO'#HnO){QdO'#DWOOOW'#Ht'#HtO;XOWO,59qOOQ(C[,59q,59qO=jQtO'#ChO=tQdO'#HuO>XQ`O'#IvO@WQtO'#IvO'dQdO'#IvO@_Q`O,59wO@uQ7[O'#DbOAnQ`O'#E]OA{Q`O'#JROBWQ`O'#JQOBWQ`O'#JQOB`Q`O,5:yOBeQ`O'#JPOBlQaO'#DyO5yQ&jO'#EZOBzQ`O'#EZOCVQpO'#FROOQ(C[,5:S,5:SOC_QdO,5:SOE]Q(C|O,5:^OEyQ`O,5:dOFdQ(ChO'#JOO7YQ`O'#I}OFkQ`O'#I}OFsQ`O,5:xOFxQ`O'#I}OGWQdO,5:vOIWQ&jO'#EWOJeQ`O,5:vOKwQ&jO'#DlOLOQdO'#DqOLYQ7[O,5;PO){QdO,5;POOQS'#Er'#ErOOQS'#Et'#EtO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;RO){QdO,5;ROOQS'#Ex'#ExOLbQdO,5;cOOQ(C[,5;h,5;hOOQ(C[,5;i,5;iONbQ`O,5;iOOQ(C[,5;j,5;jO){QdO'#IPONgQ(ChO,5<TO! RQ&jO,5;RO){QdO,5;fO! kQ!bO'#JVO! YQ!bO'#JVO! rQ!bO'#JVO!!TQ!bO,5;qOOOO,5;{,5;{O!!cQdO'#FcOOOO'#IO'#IOO3rO#tO,5;nO!!jQ!bO'#FeOOQ(C[,5;n,5;nO!#WQ,VO'#CrOOQ(C]'#Cu'#CuO!#kQ`O'#CuO!#pOWO'#CyO!$^Q,VO,5<QO!$eQ`O,5<SO!%tQ&jO'#FrO!&RQ`O'#FsO!&WQ`O'#FsO!&]Q&jO'#FwO!'[Q7[O'#F{O!'}Q,VO'#IqOOQ(C]'#Iq'#IqO!(XQaO'#IpO!(gQ`O'#IoO!(oQ`O'#CqOOQ(C]'#Cs'#CsOOQ(C]'#C|'#C|O!(wQ`O'#DOOJjQ&jO'#FjOJjQ&jO'#FlO!(|Q`O'#FnO!)RQ`O'#FoO!&WQ`O'#FuOJjQ&jO'#FzO!)WQ`O'#E^O!)oQ`O,5<RO`QdO,5>[OOQS'#Ik'#IkOOQS,5>],5>]OOQS-E;p-E;pO!+kQ(C|O,5:UOOQ(CX'#Cp'#CpO!,[Q&kO,5<vOOQO'#Cf'#CfO!,mQ(ChO'#IlO5bQ`O'#IlO:aQ`O,59XO!-OQ!bO,59XO!-WQ&jO,59XO5yQ&jO,59XO!-cQ`O,5:vO!-kQ`O'#GxO!-yQ`O'#JbO){QdO,5;kO!.RQ7[O,5;mO!.WQ`O,5=cO!.]Q`O,5=cO!.bQ`O,5=cO5lQ(ChO,5=cO5tQ`O,5<vO!.pQ`O'#E_O!/UQ7[O'#E`OOQ(CW'#JP'#JPO!/gQ(ChO'#J_O5lQ(ChO,5<zO7sQ`O,5=QOOQP'#Cr'#CrO!/rQ!bO,5<}O!/zQ!cO,5=OO!0VQ`O,5=QO!0[QpO,5=TO:aQ`O'#GnO5tQ`O'#GpO!0dQ`O'#GpO5yQ&jO'#GsO!0iQ`O'#GsOOQS,5=W,5=WO!0nQ`O'#GtO!0vQ`O'#CmO!0{Q`O,59OO!1VQ`O,59OO!3XQdO,59OOOQS,59O,59OO!3fQ(ChO,59OO){QdO,59OO!3qQdO'#G{OOQS'#G|'#G|OOQS'#G}'#G}O`QdO,5=eO!4RQ`O,5=eO){QdO'#DxO`QdO,5=kO`QdO,5=mO!4WQ`O,5=oO`QdO,5=qO!4]Q`O,5=tO!4bQdO,5=zOOQS,5>Q,5>QO){QdO,5>QO5lQ(ChO,5>SOOQS,5>U,5>UO!8cQ`O,5>UOOQS,5>W,5>WO!8cQ`O,5>WOOQS,5>Y,5>YO!8hQpO,59rOOOW-E;r-E;rOOQ(C[1G/]1G/]O!8mQtO,5>aO'dQdO,5>aOOQO,5>f,5>fO!8wQdO'#HuOOQO-E;s-E;sO!9UQ`O,5?bO!9^QtO,5?bO!9eQ`O,5?lOOQ(C[1G/c1G/cO!9mQ!bO'#DTOOQO'#Ix'#IxO){QdO'#IxO!:[Q!bO'#IxO!:yQ!bO'#DcO!;[Q7[O'#DcO!=gQdO'#DcO!=nQ`O'#IwO!=vQ`O,59|O!={Q`O'#EaO!>ZQ`O'#JSO!>cQ`O,5:zO!>yQ7[O'#DcO){QdO,5?mO!?TQ`O'#HzOOQO-E;x-E;xO!9eQ`O,5?lOOQ(CW1G0e1G0eO!@aQ7[O'#D|OOQ(C[,5:e,5:eO){QdO,5:eOIWQ&jO,5:eO!@hQaO,5:eO:aQ`O,5:uO!-OQ!bO,5:uO!-WQ&jO,5:uO5yQ&jO,5:uOOQ(C[1G/n1G/nOOQ(C[1G0O1G0OOOQ(CW'#EV'#EVO){QdO,5?jO!@sQ(ChO,5?jO!AUQ(ChO,5?jO!A]Q`O,5?iO!AeQ`O'#H|O!A]Q`O,5?iOOQ(CW1G0d1G0dO7YQ`O,5?iOOQ(C[1G0b1G0bO!BPQ(C|O1G0bO!CRQ(CyO,5:rOOQ(C]'#Fq'#FqO!CoQ(C}O'#IqOGWQdO1G0bO!EqQ,VO'#IyO!E{Q`O,5:WO!FQQtO'#IzO){QdO'#IzO!F[Q`O,5:]OOQ(C]'#DT'#DTOOQ(C[1G0k1G0kO!FaQ`O1G0kO!HrQ(C|O1G0mO!HyQ(C|O1G0mO!K^Q(C|O1G0mO!KeQ(C|O1G0mO!MlQ(C|O1G0mO!NPQ(C|O1G0mO#!pQ(C|O1G0mO#!wQ(C|O1G0mO#%[Q(C|O1G0mO#%cQ(C|O1G0mO#'WQ(C|O1G0mO#*QQMlO'#ChO#+{QMlO1G0}O#-vQMlO'#IuOOQ(C[1G1T1G1TO#.ZQ(C|O,5>kOOQ(CW-E;}-E;}O#.zQ(C}O1G0mOOQ(C[1G0m1G0mO#1PQ(C|O1G1QO#1pQ!bO,5;sO#1uQ!bO,5;tO#1zQ!bO'#F[O#2`Q`O'#FZOOQO'#JW'#JWOOQO'#H}'#H}O#2eQ!bO1G1]OOQ(C[1G1]1G1]OOOO1G1f1G1fO#2sQMlO'#ItO#2}Q`O,5;}OLbQdO,5;}OOOO-E;|-E;|OOQ(C[1G1Y1G1YOOQ(C[,5<P,5<PO#3SQ!bO,5<POOQ(C],59a,59aOIWQ&jO'#C{OOOW'#Hs'#HsO#3XOWO,59eOOQ(C],59e,59eO){QdO1G1lO!)RQ`O'#IRO#3dQ`O,5<eOOQ(C],5<b,5<bOOQO'#GV'#GVOJjQ&jO,5<pOOQO'#GX'#GXOJjQ&jO,5<rOIWQ&jO,5<tOOQO1G1n1G1nO#3oQqO'#CpO#4SQqO,5<^O#4ZQ`O'#JZO5tQ`O'#JZO#4iQ`O,5<`OJjQ&jO,5<_O#4nQ`O'#FtO#4yQ`O,5<_O#5OQqO'#FqO#5]QqO'#J[O#5gQ`O'#J[OIWQ&jO'#J[O#5lQ`O,5<cOOQ(CW'#Dg'#DgO#5qQ!bO'#F|O!'VQ7[O'#F|O!'VQ7[O'#GOO#6SQ`O'#GPO!&WQ`O'#GSO#6XQ(ChO'#ITO#6dQ7[O,5<gOOQ(C],5<g,5<gO#6kQ7[O'#F|O#6yQ7[O'#F}O#7RQ7[O'#F}OOQ(C],5<u,5<uOJjQ&jO,5?[OJjQ&jO,5?[O#7WQ`O'#IUO#7cQ`O,5?ZO#7kQ`O,59]OOQ(C]'#Ch'#ChO#8[Q,VO,59jOOQ(C],59j,59jO#8}Q,VO,5<UO#9pQ,VO,5<WO#9zQ`O,5<YOOQ(C],5<Z,5<ZO#:PQ`O,5<aO#:UQ,VO,5<fOGWQdO1G1mO#:fQ`O1G1mOOQS1G3v1G3vOOQ(C[1G/p1G/pONbQ`O1G/pOOQS1G2b1G2bOIWQ&jO1G2bO){QdO1G2bOIWQ&jO1G2bO#:kQaO1G2bO#<QQ&jO'#EWOOQ(CW,5?W,5?WO#<[Q(ChO,5?WOOQS1G.s1G.sO:aQ`O1G.sO!-OQ!bO1G.sO!-WQ&jO1G.sO#<mQ`O1G0bO#<rQ`O'#ChO#<}Q`O'#JcO#=VQ`O,5=dO#=[Q`O'#JcO#=aQ`O'#JcO#=iQ`O'#I^O#=wQ`O,5?|O#>PQtO1G1VOOQ(C[1G1X1G1XO5tQ`O1G2}O#>WQ`O1G2}O#>]Q`O1G2}O#>bQ`O1G2}OOQS1G2}1G2}O#>gQ&kO1G2bO7YQ`O'#JQO7YQ`O'#EaO7YQ`O'#IWO#>xQ(ChO,5?yOOQS1G2f1G2fO!0VQ`O1G2lOIWQ&jO1G2iO#?TQ`O1G2iOOQS1G2j1G2jOIWQ&jO1G2jO#?YQaO1G2jO#?bQ7[O'#GhOOQS1G2l1G2lO!'VQ7[O'#IYO!0[QpO1G2oOOQS1G2o1G2oOOQS,5=Y,5=YO#?jQ&kO,5=[O5tQ`O,5=[O#6SQ`O,5=_O5bQ`O,5=_O!-OQ!bO,5=_O!-WQ&jO,5=_O5yQ&jO,5=_O#?{Q`O'#JaO#@WQ`O,5=`OOQS1G.j1G.jO#@]Q(ChO1G.jO#@hQ`O1G.jO#@mQ`O1G.jO5lQ(ChO1G.jO#@uQtO,5@OO#APQ`O,5@OO#A[QdO,5=gO#AcQ`O,5=gO7YQ`O,5@OOOQS1G3P1G3PO`QdO1G3POOQS1G3V1G3VOOQS1G3X1G3XO:[Q`O1G3ZO#AhQdO1G3]O#EcQdO'#H[OOQS1G3`1G3`O#EpQ`O'#HbO:aQ`O'#HdOOQS1G3f1G3fO#ExQdO1G3fO5lQ(ChO1G3lOOQS1G3n1G3nOOQ(CW'#Fx'#FxO5lQ(ChO1G3pO5lQ(ChO1G3rOOOW1G/^1G/^O#IvQpO,5<TO#JOQtO1G3{OOQO1G4Q1G4QO){QdO,5>aO#JYQ`O1G4|O#JbQ`O1G5WO#JjQ`O,5?dOLbQdO,5:{O7YQ`O,5:{O:aQ`O,59}OLbQdO,59}O!-OQ!bO,59}O#JoQMlO,59}OOQO,5:{,5:{O#JyQ7[O'#HvO#KaQ`O,5?cOOQ(C[1G/h1G/hO#KiQ7[O'#H{O#K}Q`O,5?nOOQ(CW1G0f1G0fO!;[Q7[O,59}O#LVQtO1G5XO7YQ`O,5>fOOQ(CW'#ES'#ESO#LaQ(DjO'#ETO!@XQ7[O'#D}OOQO'#Hy'#HyO#L{Q7[O,5:hOOQ(C[,5:h,5:hO#MSQ7[O'#D}O#MeQ7[O'#D}O#MlQ7[O'#EYO#MoQ7[O'#ETO#M|Q7[O'#ETO!@XQ7[O'#ETO#NaQ`O1G0PO#NfQqO1G0POOQ(C[1G0P1G0PO){QdO1G0POIWQ&jO1G0POOQ(C[1G0a1G0aO:aQ`O1G0aO!-OQ!bO1G0aO!-WQ&jO1G0aO#NmQ(C|O1G5UO){QdO1G5UO#N}Q(ChO1G5UO$ `Q`O1G5TO7YQ`O,5>hOOQO,5>h,5>hO$ hQ`O,5>hOOQO-E;z-E;zO$ `Q`O1G5TO$ vQ(C}O,59jO$#xQ(C}O,5<UO$%}Q(C}O,5<WO$(SQ(C}O,5<fOOQ(C[7+%|7+%|O$*_Q(C|O7+%|O$+OQ&jO'#HwO$+YQ`O,5?eOOQ(C]1G/r1G/rO$+bQdO'#HxO$+oQ`O,5?fO$+wQtO,5?fOOQ(C[1G/w1G/wOOQ(C[7+&V7+&VO$,RQMlO,5:^O){QdO7+&iO$,]QMlO,5:UOOQO1G1_1G1_OOQO1G1`1G1`O$,jQ!LQO,5;vOLbQdO,5;uOOQO-E;{-E;{OOQ(C[7+&w7+&wOOOO7+'Q7+'QOOOO1G1i1G1iO$,uQ`O1G1iOOQ(C[1G1k1G1kO$,zQqO,59gOOOW-E;q-E;qOOQ(C]1G/P1G/PO$-RQ(C|O7+'WOOQ(C],5>m,5>mO$-rQ`O,5>mOOQ(C]1G2P1G2PP$-wQ`O'#IRPOQ(C]-E<P-E<PO$.hQ,VO1G2[O$/ZQ,VO1G2^O$/eQqO1G2`OOQ(C]1G1x1G1xO$/lQ`O'#IQO$/zQ`O,5?uO$/zQ`O,5?uO$0SQ`O,5?uO$0_Q`O,5?uOOQO1G1z1G1zO$0mQ,VO1G1yOJjQ&jO1G1yO$0}Q&jO'#ISO$1_Q`O,5?vOIWQ&jO,5?vO$1gQqO,5?vOOQ(C]1G1}1G1}OOQ(CW,5<h,5<hOOQ(CW,5<i,5<iO$1qQ`O,5<iO#5}Q`O,5<iO!-OQ!bO,5<hO$1vQ`O,5<jOOQ(CW,5<k,5<kO$1qQ`O,5<nOOQO,5>o,5>oOOQO-E<R-E<ROOQ(C]1G2R1G2RO!'VQ7[O,5<hO$2OQ`O,5<iO!'VQ7[O,5<jO!'VQ7[O,5<iO$2ZQ,VO1G4vO$2eQ,VO1G4vOOQO,5>p,5>pOOQO-E<S-E<SOOQP1G.w1G.wO!.RQ7[O,59lO){QdO,59lO$2rQ`O1G1tOJjQ&jO1G1{O$2wQ(C|O7+'XOOQ(C[7+'X7+'XOGWQdO7+'XOOQ(C[7+%[7+%[O$3hQqO'#J]O#NaQ`O7+'|O$3rQ`O7+'|O$3zQqO7+'|OOQS7+'|7+'|OIWQ&jO7+'|O){QdO7+'|OIWQ&jO7+'|O$4UQ(CyO'#ChO$4iQ(CyO,5<lO$5ZQ`O,5<lOOQ(CW1G4r1G4rOOQS7+$_7+$_O:aQ`O7+$_O!-OQ!bO7+$_OGWQdO7+%|O$5`Q`O'#I]O$5qQ`O,5?}OOQO1G3O1G3OO5tQ`O,5?}O$5qQ`O,5?}O$5yQ`O,5?}OOQO,5>x,5>xOOQO-E<[-E<[OOQ(C[7+&q7+&qO$6OQ`O7+(iO5lQ(ChO7+(iO5tQ`O7+(iO$6TQ`O7+(iO$6YQaO7+'|OOQ(CW,5>r,5>rOOQ(CW-E<U-E<UOOQS7+(W7+(WO$6hQ(CyO7+(TOIWQ&jO7+(TO$6rQqO7+(UOOQS7+(U7+(UOIWQ&jO7+(UO$6yQ`O'#J`O$7UQ`O,5=SOOQO,5>t,5>tOOQO-E<W-E<WOOQS7+(Z7+(ZO$8OQ7[O'#GqOOQS1G2v1G2vOIWQ&jO1G2vO){QdO1G2vOIWQ&jO1G2vO$8VQaO1G2vO$8eQ&kO1G2vO5lQ(ChO1G2yO#6SQ`O1G2yO5bQ`O1G2yO!-OQ!bO1G2yO!-WQ&jO1G2yO$8vQ`O'#I[O$9RQ`O,5?{O$9ZQ7[O,5?{OOQ(CW1G2z1G2zOOQS7+$U7+$UO$9cQ`O7+$UO5lQ(ChO7+$UO$9hQ`O7+$UO){QdO1G5jO){QdO1G5kO$9mQdO1G3RO$9tQ`O1G3RO$9yQdO1G3RO$:QQ(ChO1G5jOOQS7+(k7+(kO5lQ(ChO7+(uO`QdO7+(wOOQS'#Jf'#JfOOQS'#I_'#I_O$:[QdO,5=vOOQS,5=v,5=vO){QdO'#H]O$:iQ`O'#H_OOQS,5=|,5=|O7YQ`O,5=|OOQS,5>O,5>OOOQS7+)Q7+)QOOQS7+)W7+)WOOQS7+)[7+)[OOQS7+)^7+)^OOQO1G5O1G5OO$:nQMlO1G0gO$:xQ`O1G0gOOQO1G/i1G/iO$;TQMlO1G/iO:aQ`O1G/iOLbQdO'#DcOOQO,5>b,5>bOOQO-E;t-E;tOOQO,5>g,5>gOOQO-E;y-E;yO!-OQ!bO1G/iO:aQ`O,5:iOOQO,5:o,5:oO){QdO,5:oO$;_Q(ChO,5:oO$;jQ(ChO,5:oO!-OQ!bO,5:iOOQO-E;w-E;wOOQ(C[1G0S1G0SO!@XQ7[O,5:iO$;xQ7[O,5:iO$<ZQ(DjO,5:oO$<uQ7[O,5:iO!@XQ7[O,5:oOOQO,5:t,5:tO$<|Q7[O,5:oO$=ZQ(ChO,5:oOOQ(C[7+%k7+%kO#NaQ`O7+%kO#NfQqO7+%kOOQ(C[7+%{7+%{O:aQ`O7+%{O!-OQ!bO7+%{O$=oQ(C|O7+*pO){QdO7+*pOOQO1G4S1G4SO7YQ`O1G4SO$>PQ`O7+*oO$>XQ(C}O1G2[O$@^Q(C}O1G2^O$BcQ(C}O1G1yO$DnQ,VO,5>cOOQO-E;u-E;uO$DxQtO,5>dO){QdO,5>dOOQO-E;v-E;vO$ESQ`O1G5QO$E[QMlO1G0bO$GcQMlO1G0mO$GjQMlO1G0mO$IkQMlO1G0mO$IrQMlO1G0mO$KgQMlO1G0mO$KzQMlO1G0mO$NXQMlO1G0mO$N`QMlO1G0mO%!aQMlO1G0mO%!hQMlO1G0mO%$]QMlO1G0mO%$pQ(C|O<<JTO%%rQMmO1G0mO%'|QMmO'#IqO%)iQMlO1G1QOLbQdO'#F^OOQO'#JX'#JXOOQO1G1b1G1bO%)vQ`O1G1aO%){QMlO,5>kOOOO7+'T7+'TOOOW1G/R1G/ROOQ(C]1G4X1G4XOJjQ&jO7+'zO%*VQ`O,5>lO5tQ`O,5>lOOQO-E<O-E<OO%*eQ`O1G5aO%*eQ`O1G5aO%*mQ`O1G5aO%*xQ,VO7+'eO%+YQqO,5>nO%+dQ`O,5>nOIWQ&jO,5>nOOQO-E<Q-E<QO%+iQqO1G5bO%+sQ`O1G5bOOQ(CW1G2T1G2TO$1qQ`O1G2TOOQ(CW1G2S1G2SO%+{Q`O1G2UOIWQ&jO1G2UOOQ(CW1G2Y1G2YO!-OQ!bO1G2SO#5}Q`O1G2TO%,QQ`O1G2UO%,YQ`O1G2TOJjQ&jO7+*bOOQ(C]1G/W1G/WO%,eQ`O1G/WOOQ(C]7+'`7+'`O%,jQ,VO7+'gO%,zQ(C|O<<JsOOQ(C[<<Js<<JsOIWQ&jO'#IVO%-kQ`O,5?wOOQS<<Kh<<KhOIWQ&jO<<KhO#NaQ`O<<KhO%-sQ`O<<KhO%-{QqO<<KhOIWQ&jO1G2WOOQS<<Gy<<GyO:aQ`O<<GyO%.VQ(C|O<<IhOOQ(C[<<Ih<<IhOOQO,5>w,5>wO%.vQ`O,5>wO%.{Q`O,5>wOOQO-E<Z-E<ZO%/TQ`O1G5iO%/TQ`O1G5iO5tQ`O1G5iO%/]Q`O<<LTOOQS<<LT<<LTO%/bQ`O<<LTO5lQ(ChO<<LTO){QdO<<KhOIWQ&jO<<KhOOQS<<Ko<<KoO$6hQ(CyO<<KoOOQS<<Kp<<KpO$6rQqO<<KpO%/gQ7[O'#IXO%/rQ`O,5?zOLbQdO,5?zOOQS1G2n1G2nO#LaQ(DjO'#ETO!@XQ7[O'#GrOOQO'#IZ'#IZO%/zQ7[O,5=]OOQS,5=],5=]O%0RQ7[O'#ETO%0^Q7[O'#ETO%0uQ7[O'#ETO%1PQ7[O'#GrO%1bQ`O7+(bO%1gQ`O7+(bO%1oQqO7+(bOOQS7+(b7+(bOIWQ&jO7+(bO){QdO7+(bOIWQ&jO7+(bO%1yQaO7+(bOOQS7+(e7+(eO5lQ(ChO7+(eO#6SQ`O7+(eO5bQ`O7+(eO!-OQ!bO7+(eO%2XQ`O,5>vOOQO-E<Y-E<YOOQO'#Gu'#GuO%2dQ`O1G5gO5lQ(ChO<<GpOOQS<<Gp<<GpO%2lQ`O<<GpO%2qQ`O7++UO%2vQ`O7++VOOQS7+(m7+(mO%2{Q`O7+(mO%3QQdO7+(mO%3XQ`O7+(mO){QdO7++UO){QdO7++VOOQS<<La<<LaOOQS<<Lc<<LcOOQS-E<]-E<]OOQS1G3b1G3bO%3^Q`O,5=wOOQS,5=y,5=yO%3cQ`O1G3hOLbQdO7+&ROOQO7+%T7+%TO%3hQMlO1G5XO:aQ`O7+%TOOQO1G0T1G0TO%3rQ(C|O1G0ZOOQO1G0Z1G0ZO){QdO1G0ZO%3|Q(ChO1G0ZO:aQ`O1G0TO!-OQ!bO1G0TO!@XQ7[O1G0TO%4XQ(ChO1G0ZO%4gQ7[O1G0TO%4xQ(ChO1G0ZO%5^Q(DjO1G0ZO%5hQ7[O1G0TO!@XQ7[O1G0ZOOQ(C[<<IV<<IVOOQ(C[<<Ig<<IgO:aQ`O<<IgO%5oQ(C|O<<N[OOQO7+)n7+)nO%6PQ(C}O7+'eO%8[Q(C}O7+'gO%:gQtO1G4OO%:qQMlO7+%|O%;gQMmO,59jO%=hQMmO,5<UO%?lQMmO,5<WO%A[QMmO,5<fO%B}QMlO7+'WO%C[QMlO7+'XO%CiQ`O,5;xOOQO7+&{7+&{O%CnQ,VO<<KfOOQO1G4W1G4WO%CuQ`O1G4WO%DQQ`O1G4WO%D`Q`O7+*{O%D`Q`O7+*{OIWQ&jO1G4YO%DhQqO1G4YO%DrQ`O7+*|OOQ(CW7+'o7+'oO$1qQ`O7+'pO%DzQqO7+'pOOQ(CW7+'n7+'nO$1qQ`O7+'oO%ERQ`O7+'pOIWQ&jO7+'pO#5}Q`O7+'oO%EWQ,VO<<M|OOQ(C]7+$r7+$rO%EbQqO,5>qOOQO-E<T-E<TO#NaQ`OANASOOQSANASANASOIWQ&jOANASO%ElQ(CyO7+'rOOQSAN=eAN=eO5tQ`O1G4cOOQO1G4c1G4cO%E|Q`O1G4cO%FRQ`O7++TO%FRQ`O7++TO5lQ(ChOANAoO%FZQ`OANAoOOQSANAoANAoO%F`Q`OANASO%FhQqOANASOOQSANAZANAZOOQSANA[ANA[O%FrQ`O,5>sOOQO-E<V-E<VO%F}QMlO1G5fO#6SQ`O,5=^O5bQ`O,5=^O!-OQ!bO,5=^OOQO-E<X-E<XOOQS1G2w1G2wO$<ZQ(DjO,5:oO!@XQ7[O,5=^O%GXQ7[O,5=^O%GjQ7[O,5:oOOQS<<K|<<K|OIWQ&jO<<K|O%1bQ`O<<K|O%GtQ`O<<K|O%G|QqO<<K|O){QdO<<K|OIWQ&jO<<K|OOQS<<LP<<LPO5lQ(ChO<<LPO#6SQ`O<<LPO5bQ`O<<LPO%HWQ7[O1G4bO%H`Q`O7++ROOQSAN=[AN=[O5lQ(ChOAN=[OOQS<<Np<<NpOOQS<<Nq<<NqOOQS<<LX<<LXO%HhQ`O<<LXO%HmQdO<<LXO%HtQ`O<<NpO%HyQ`O<<NqOOQS1G3c1G3cO:aQ`O7+)SO%IOQMlO<<ImOOQO<<Ho<<HoOOQO7+%u7+%uO%3rQ(C|O7+%uO){QdO7+%uOOQO7+%o7+%oO:aQ`O7+%oO!-OQ!bO7+%oO%IYQ(ChO7+%uO!@XQ7[O7+%oO%IeQ(ChO7+%uO%IsQ7[O7+%oO%JUQ(ChO7+%uOOQ(C[AN?RAN?RO%JjQMlO<<JTO%JwQMmO1G1yO%MOQMmO1G2[O& SQMmO1G2^O&!rQMlO<<JsO&#PQMlO<<IhOOQO1G1d1G1dOJjQ&jOANAQOOQO7+)r7+)rO&#^Q`O7+)rO&#iQ`O<<NgO&#qQqO7+)tOOQ(CW<<K[<<K[O$1qQ`O<<K[OOQ(CW<<KZ<<KZO&#{QqO<<K[O$1qQ`O<<KZOOQSG26nG26nO#NaQ`OG26nOOQO7+)}7+)}O5tQ`O7+)}O&$SQ`O<<NoOOQSG27ZG27ZO5lQ(ChOG27ZOIWQ&jOG26nOLbQdO1G4_O&$[Q`O7++QO5lQ(ChO1G2xO#6SQ`O1G2xO5bQ`O1G2xO!-OQ!bO1G2xO!@XQ7[O1G2xO%5^Q(DjO1G0ZO&$dQ7[O1G2xO%1bQ`OANAhOOQSANAhANAhOIWQ&jOANAhO&$uQ`OANAhO&$}QqOANAhOOQSANAkANAkO5lQ(ChOANAkO#6SQ`OANAkOOQO'#Gv'#GvOOQO7+)|7+)|OOQSG22vG22vOOQSANAsANAsO&%XQ`OANAsOOQSAND[AND[OOQSAND]AND]OOQS<<Ln<<LnOOQO<<Ia<<IaO%3rQ(C|O<<IaOOQO<<IZ<<IZO:aQ`O<<IZO){QdO<<IaO!-OQ!bO<<IZO&%^Q(ChO<<IaO!@XQ7[O<<IZO&%iQ(ChO<<IaO&%wQMmO7+'eO&'jQMmO7+'gO&)]Q,VOG26lOOQO<<M^<<M^OOQ(CWAN@vAN@vO$1qQ`OAN@vOOQ(CWAN@uAN@uOOQSLD,YLD,YOOQO<<Mi<<MiOOQSLD,uLD,uO#NaQ`OLD,YO&)mQMlO7+)yOOQO7+(d7+(dO5lQ(ChO7+(dO#6SQ`O7+(dO5bQ`O7+(dO!-OQ!bO7+(dO!@XQ7[O7+(dOOQSG27SG27SO%1bQ`OG27SOIWQ&jOG27SOOQSG27VG27VO5lQ(ChOG27VOOQSG27_G27_OOQOAN>{AN>{OOQOAN>uAN>uO%3rQ(C|OAN>{O:aQ`OAN>uO){QdOAN>{O!-OQ!bOAN>uO&)wQ(ChOAN>{O&*SQ(C}OG26lOOQ(CWG26bG26bOOQS!$( t!$( tOOQO<<LO<<LOO5lQ(ChO<<LOO#6SQ`O<<LOO5bQ`O<<LOO!-OQ!bO<<LOOOQSLD,nLD,nO%1bQ`OLD,nOOQSLD,qLD,qOOQOG24gG24gOOQOG24aG24aO%3rQ(C|OG24gO:aQ`OG24aO){QdOG24gO&,pQ!LRO,5:rO&-gQ$ITO'#IqOOQOANAjANAjO5lQ(ChOANAjO#6SQ`OANAjO5bQ`OANAjOOQS!$(!Y!$(!YOOQOLD*RLD*ROOQOLD){LD){O%3rQ(C|OLD*RO&.ZQMmOG26lO&/|Q!LRO,59jO&0pQ!LRO,5<UO&1dQ!LRO,5<WO&2WQ!LRO,5<fOOQOG27UG27UO5lQ(ChOG27UO#6SQ`OG27UOOQO!$'Mm!$'MmO&2}Q!LRO1G2[O&3qQ!LRO1G2^O&4eQ!LRO1G1yOOQOLD,pLD,pO5lQ(ChOLD,pO&5[Q!LRO7+'eO&6RQ!LRO7+'gOOQO!$(![!$(![O&6xQ!LROG26lOLbQdO'#DrO&7oQtO'#ItOLbQdO'#DjO&7vQ(C|O'#ChO&8aQtO'#ChO&8qQdO,5:vO&:qQ&jO'#EWOLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO,5;ROLbQdO'#IPO&<OQ`O,5<TO&=eQ&jO,5;ROLbQdO,5;fO!(wQ`O'#DOO!(wQ`O'#DOO!(wQ`O'#DOOIWQ&jO'#FjO&:qQ&jO'#FjO&<WQ&jO'#FjOIWQ&jO'#FlO&:qQ&jO'#FlO&<WQ&jO'#FlOIWQ&jO'#FzO&:qQ&jO'#FzO&<WQ&jO'#FzOLbQdO,5?mO&8qQdO1G0bO&=lQMlO'#ChOLbQdO1G1lOIWQ&jO,5<pO&:qQ&jO,5<pO&<WQ&jO,5<pOIWQ&jO,5<rO&:qQ&jO,5<rO&<WQ&jO,5<rOIWQ&jO,5<_O&:qQ&jO,5<_O&<WQ&jO,5<_O&8qQdO1G1mOLbQdO7+&iOIWQ&jO1G1yO&:qQ&jO1G1yO&<WQ&jO1G1yOIWQ&jO1G1{O&:qQ&jO1G1{O&<WQ&jO1G1{O&8qQdO7+'XO&8qQdO7+%|O&=vQ`O7+'pOIWQ&jOANAQO&:qQ&jOANAQO&<WQ&jOANAQO&=vQ`O<<K[O&=vQ`OAN@vO&={Q`O'#E[O&>QQ`O'#E[O&>YQ`O'#EzO&>_Q`O'#EgO&>dQ`O'#JRO&>oQ`O'#JPO&>zQ`O,5:vO&?PQ,VO,5<QO&?WQ`O'#FsO&?]Q`O'#FsO&?bQ`O'#FsO&?gQ`O,5<RO&?oQ`O,5:vO&?wQMlO1G0}O&@OQ`O,5<_O&@TQ`O,5<_O&@YQ`O,5<_O&@_Q`O,5<aO&@dQ`O,5<aO&@iQ`O,5<aO&@nQ`O1G1mO&@sQ`O1G0bO&@xQ`O1G2UO&@}Q,VO<<KfO&AUQ,VO<<KfO&A]Q,VO<<KfO&AdQqO7+'pO&AkQ`O7+'pO&ApQqO<<K[O4QQ&jO'#FhO5bQ`O'#FgOBzQ`O'#EZOLbQdO,5;cO!&WQ`O'#FsO!&WQ`O'#FsO!&WQ`O'#FsO!&WQ`O'#FuO!&WQ`O'#FuO!&WQ`O'#FuO&AwQ`O,5<jOJjQ&jO7+'zOJjQ&jO7+'zOJjQ&jO7+'zOIWQ&jO1G2UO&BPQ`O1G2UOIWQ&jO7+'pO!'VQ7[O'#GOO$/eQqO1G2`O$/eQqO1G2`O$/eQqO1G2`O!'VQ7[O,5<jOIWQ&jO,5<tOIWQ&jO,5<tOIWQ&jO,5<t",
    stateData:
      "&B}~O'YOS'ZOSTOSUOS~OQTORTOXyO]cO_hObnOcmOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!TSO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!nlO#dsO#tpO#x^O%PqO%RtO%TrO%UrO%XuO%ZvO%^wO%_wO%axO%nzO%t{O%v|O%x}O%z!OO%}!PO&T!QO&Z!RO&]!SO&_!TO&a!UO&c!VO']PO'fQO'oYO'|aO~OQ[XZ[X_[Xj[Xu[Xv[Xx[X!R[X!a[X!b[X!d[X!j[X!{[X#WdX#[[X#][X#^[X#_[X#`[X#a[X#b[X#c[X#e[X#g[X#i[X#j[X#o[X'W[X'f[X'p[X'w[X'x[X~O!]$lX~P$zOS!WO'U!XO'V!ZO~OQTORTO]cOb!kOc!jOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!T!bO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!n!iO#t!lO#x^O']![O'fQO'oYO'|aO~O!Q!`O!R!]O!O'jP!O'tP~P'dO!S!mO~P`OQTORTO]cOb!kOc!jOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!T!bO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!n!iO#t!lO#x^O']9aO'fQO'oYO'|aO~OQTORTO]cOb!kOc!jOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!T!bO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!n!iO#t!lO#x^O'fQO'oYO'|aO~O!Q!rO#U!uO#V!rO']9bO!c'qP~P+{O#W!vO~O!]!wO#W!vO~OQ#^OZ#dOj#ROu!{Ov!{Ox!|O!R#bO!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO#g#WO#i#YO#j#ZO'fQO'p#[O'w!}O'x#OO~O_'hX'W'hX!c'hX!O'hX!T'hX%Q'hX!]'hX~P.jO!{#eO#o#eOQ'iXZ'iX_'iXj'iXu'iXv'iXx'iX!R'iX!a'iX!b'iX!d'iX!j'iX#['iX#]'iX#^'iX#_'iX#`'iX#a'iX#b'iX#e'iX#g'iX#i'iX#j'iX'f'iX'p'iX'w'iX'x'iX~O#c'iX'W'iX!O'iX!c'iXn'iX!T'iX%Q'iX!]'iX~P0zO!{#eO~O#z#fO$R#jO~O!T#kO#x^O$U#lO$W#nO~O]#qOh$QOj#rOk#qOl#qOq$ROs$SOx#yO!T#zO!_$XO!d#vO#V$YO#t$VO$_$TO$a$UO$d$WO']#pO'b$PO'f#sO'a'cP~O!d$ZO~O!]$]O~O_$^O'W$^O~O']$bO~O!d$ZO']$bO'^$dO'b$PO~Oc$jO!d$ZO']$bO~O#c#TO~O]$sOu$oO!T$lO!d$nO%R$rO']$bO'^$dO^(UP~O!n$tO~Ox$uO!T$vO']$bO~Ox$uO!T$vO%Z$zO']$bO~O']${O~O#dsO%RtO%TrO%UrO%XuO%ZvO%^wO%_wO~Ob%UOc%TO!n%RO%P%SO%c%QO~P7xOb%XOcmO!T%WO!nlO#dsO%PqO%TrO%UrO%XuO%ZvO%^wO%_wO%axO~O`%[O!{%_O%R%YO'^$dO~P8wO!d%`O!g%dO~O!d%eO~O!TSO~O_$^O'T%mO'W$^O~O_$^O'T%pO'W$^O~O_$^O'T%rO'W$^O~OS!WO'U!XO'V%vO~OQ[XZ[Xj[Xu[Xv[Xx[X!R[X!RdX!a[X!b[X!d[X!j[X!{[X!{dX#WdX#[[X#][X#^[X#_[X#`[X#a[X#b[X#c[X#e[X#g[X#i[X#j[X#o[X'f[X'p[X'w[X'x[X~O!O[X!OdX~P;dO!Q%xO!O&iX!O&nX!R&iX!R&nX~P'dO!R%zO!O'jX~OQ#^OZ#dOj#ROu!{Ov!{Ox!|O!R%zO!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO#g#WO#i#YO#j#ZO'fQO'p#[O'w!}O'x#OO~O!O'jX~P>aO!O&PO~Ox&SO!W&^O!X&VO!Y&VO'^$dO~O]&TOk&TO!Q&WO'g&QO!S'kP!S'vP~P@dO!O'sX!R'sX!]'sX!c'sX'p'sX~O!{'sX#W#PX!S'sX~PA]O!{&_O!O'uX!R'uX~O!R&`O!O'tX~O!O&cO~O!{#eO~PA]OP&gO!T&dO!o&fO']$bO~Oc&lO!d$ZO']$bO~Ou$oO!d$nO~O!S&mO~P`Ou!{Ov!{Ox!|O!b!yO!d!zO'fQOQ!faZ!faj!fa!R!fa!a!fa!j!fa#[!fa#]!fa#^!fa#_!fa#`!fa#a!fa#b!fa#c!fa#e!fa#g!fa#i!fa#j!fa'p!fa'w!fa'x!fa~O_!fa'W!fa!O!fa!c!fan!fa!T!fa%Q!fa!]!fa~PCfO!c&nO~O!]!wO!{&pO'p&oO!R'rX_'rX'W'rX~O!c'rX~PFOO!R&tO!c'qX~O!c&vO~Ox$uO!T$vO#V&wO']$bO~OQTORTO]cOb!kOc!jOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!TSO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!n!iO#t!lO#x^O']9aO'fQO'oYO'|aO~O]#qOh$QOj#rOk#qOl#qOq$ROs9tOx#yO!T#zO!_;eO!d#vO#V9}O#t$VO$_9wO$a9zO$d$WO']&{O'b$PO'f#sO~O#W&}O~O]#qOh$QOj#rOk#qOl#qOq$ROs$SOx#yO!T#zO!_$XO!d#vO#V$YO#t$VO$_$TO$a$UO$d$WO']&{O'b$PO'f#sO~O'a'mP~PJjO!Q'RO!c'nP~P){O'g'TO'oYO~OQ9^OR9^O]cOb;`Oc!jOhcOj9^OkcOlcOq9^Os9^OxRO{cO|cO}cO!T!bO!_9`O!dUO!g9^O!h9^O!i9^O!j9^O!k9^O!n!iO#t!lO#x^O']'cO'fQO'oYO'|;^O~O!d!zO~O!R#bO_$]a'W$]a!c$]a!O$]a!T$]a%Q$]a!]$]a~O#d'jO~PIWO!]'lO!T'yX#w'yX#z'yX$R'yX~Ou'mO~P! YOu'mO!T'yX#w'yX#z'yX$R'yX~O!T'oO#w'sO#z'nO$R'tO~O!Q'wO~PLbO#z#fO$R'zO~OP$eXu$eXx$eX!b$eX'w$eX'x$eX~OPfX!RfX!{fX'afX'a$eX~P!!rOk'|O~OS'}O'U(OO'V(QO~OP(ZOu(SOx(TO'w(VO'x(XO~O'a(RO~P!#{O'a([O~O]#qOh$QOj#rOk#qOl#qOq$ROs9tOx#yO!T#zO!_;eO!d#vO#V9}O#t$VO$_9wO$a9zO$d$WO'b$PO'f#sO~O!Q(`O'](]O!c'}P~P!$jO#W(bO~O!d(cO~O!Q(hO'](eO!O(OP~P!$jOj(uOx(mO!W(sO!X(lO!Y(lO!d(cO!x(tO$w(oO'^$dO'g(jO~O!S(rO~P!&jO!b!yOP'eXu'eXx'eX'w'eX'x'eX!R'eX!{'eX~O'a'eX#m'eX~P!'cOP(xO!{(wO!R'dX'a'dX~O!R(yO'a'cX~O']${O'a'cP~O'](|O~O!d)RO~O']&{O~Ox$uO!Q!rO!T$vO#U!uO#V!rO']$bO!c'qP~O!]!wO#W)VO~OQ#^OZ#dOj#ROu!{Ov!{Ox!|O!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO#g#WO#i#YO#j#ZO'fQO'p#[O'w!}O'x#OO~O_!^a!R!^a'W!^a!O!^a!c!^an!^a!T!^a%Q!^a!]!^a~P!)wOP)_O!T&dO!o)^O%Q)]O'b$PO~O!])aO!T'`X_'`X!R'`X'W'`X~O!d$ZO'b$PO~O!d$ZO']$bO'b$PO~O!]!wO#W&}O~O])lO%R)mO'])iO!S(VP~O!R)nO^(UX~O'g'TO~OZ)rO~O^)sO~O!T$lO']$bO'^$dO^(UP~Ox$uO!Q)xO!R&`O!T$vO']$bO!O'tP~O]&ZOk&ZO!Q)yO'g'TO!S'vP~O!R)zO_(RX'W(RX~O!{*OO'b$PO~OP*RO!T#zO'b$PO~O!T*TO~Ou*VO!TSO~O!n*[O~Oc*aO~O'](|O!S(TP~Oc$jO~O%RtO']${O~P8wOZ*gO^*fO~OQTORTO]cObnOcmOhcOjTOkcOlcOqTOsTOxRO{cO|cO}cO!_kO!dUO!gTO!hTO!iTO!jTO!kTO!nlO#x^O%PqO'fQO'oYO'|aO~O!T!bO#t!lO']9aO~P!1_O^*fO_$^O'W$^O~O_*kO#d*mO%T*mO%U*mO~P){O!d%`O~O%t*rO~O!T*tO~O&V*vO&X*wOQ&SaR&SaX&Sa]&Sa_&Sab&Sac&Sah&Saj&Sak&Sal&Saq&Sas&Sax&Sa{&Sa|&Sa}&Sa!T&Sa!_&Sa!d&Sa!g&Sa!h&Sa!i&Sa!j&Sa!k&Sa!n&Sa#d&Sa#t&Sa#x&Sa%P&Sa%R&Sa%T&Sa%U&Sa%X&Sa%Z&Sa%^&Sa%_&Sa%a&Sa%n&Sa%t&Sa%v&Sa%x&Sa%z&Sa%}&Sa&T&Sa&Z&Sa&]&Sa&_&Sa&a&Sa&c&Sa'S&Sa']&Sa'f&Sa'o&Sa'|&Sa!S&Sa%{&Sa`&Sa&Q&Sa~O']*|O~On+PO~O!O&ia!R&ia~P!)wO!Q+TO!O&iX!R&iX~P){O!R%zO!O'ja~O!O'ja~P>aO!R&`O!O'ta~O!RwX!R!ZX!SwX!S!ZX!]wX!]!ZX!d!ZX!{wX'b!ZX~O!]+YO!{+XO!R#TX!R'lX!S#TX!S'lX!]'lX!d'lX'b'lX~O!]+[O!d$ZO'b$PO!R!VX!S!VX~O]&ROk&ROx&SO'g(jO~OQ9^OR9^O]cOb;`Oc!jOhcOj9^OkcOlcOq9^Os9^OxRO{cO|cO}cO!T!bO!_9`O!dUO!g9^O!h9^O!i9^O!j9^O!k9^O!n!iO#t!lO#x^O'fQO'oYO'|;^O~O']:SO~P!;jO!R+`O!S'kX~O!S+bO~O!]+YO!{+XO!R#TX!S#TX~O!R+cO!S'vX~O!S+eO~O]&ROk&ROx&SO'^$dO'g(jO~O!X+fO!Y+fO~P!>hOx$uO!Q+hO!T$vO']$bO!O&nX!R&nX~O_+lO!W+oO!X+kO!Y+kO!r+sO!s+qO!t+rO!u+pO!x+tO'^$dO'g(jO'o+iO~O!S+nO~P!?iOP+yO!T&dO!o+xO~O!{,PO!R'ra!c'ra_'ra'W'ra~O!]!wO~P!@sO!R&tO!c'qa~Ox$uO!Q,SO!T$vO#U,UO#V,SO']$bO!R&pX!c&pX~O_#Oi!R#Oi'W#Oi!O#Oi!c#Oin#Oi!T#Oi%Q#Oi!]#Oi~P!)wOP;tOu(SOx(TO'w(VO'x(XO~O#W!za!R!za!c!za!{!za!T!za_!za'W!za!O!za~P!BpO#W'eXQ'eXZ'eX_'eXj'eXv'eX!a'eX!d'eX!j'eX#['eX#]'eX#^'eX#_'eX#`'eX#a'eX#b'eX#c'eX#e'eX#g'eX#i'eX#j'eX'W'eX'f'eX'p'eX!c'eX!O'eX!T'eXn'eX%Q'eX!]'eX~P!'cO!R,_O'a'mX~P!#{O'a,aO~O!R,bO!c'nX~P!)wO!c,eO~O!O,fO~OQ#^Ou!{Ov!{Ox!|O!b!yO!d!zO!j#^O'fQOZ#Zi_#Zij#Zi!R#Zi!a#Zi#]#Zi#^#Zi#_#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi'W#Zi'p#Zi'w#Zi'x#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~O#[#Zi~P!FfO#[#PO~P!FfOQ#^Ou!{Ov!{Ox!|O!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO'fQOZ#Zi_#Zi!R#Zi!a#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi'W#Zi'p#Zi'w#Zi'x#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~Oj#Zi~P!IQOj#RO~P!IQOQ#^Oj#ROu!{Ov!{Ox!|O!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO'fQO_#Zi!R#Zi#e#Zi#g#Zi#i#Zi#j#Zi'W#Zi'p#Zi'w#Zi'x#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~OZ#Zi!a#Zi#a#Zi#b#Zi#c#Zi~P!KlOZ#dO!a#TO#a#TO#b#TO#c#TO~P!KlOQ#^OZ#dOj#ROu!{Ov!{Ox!|O!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO'fQO_#Zi!R#Zi#g#Zi#i#Zi#j#Zi'W#Zi'p#Zi'x#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~O'w#Zi~P!NdO'w!}O~P!NdOQ#^OZ#dOj#ROu!{Ov!{Ox!|O!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO#g#WO'fQO'w!}O_#Zi!R#Zi#i#Zi#j#Zi'W#Zi'p#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~O'x#Zi~P##OO'x#OO~P##OOQ#^OZ#dOj#ROu!{Ov!{Ox!|O!a#TO!b!yO!d!zO!j#^O#[#PO#]#QO#^#QO#_#QO#`#SO#a#TO#b#TO#c#TO#e#UO#g#WO#i#YO'fQO'w!}O'x#OO~O_#Zi!R#Zi#j#Zi'W#Zi'p#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~P#%jOQ[XZ[Xj[Xu[Xv[Xx[X!a[X!b[X!d[X!j[X!{[X#WdX#[[X#][X#^[X#_[X#`[X#a[X#b[X#c[X#e[X#g[X#i[X#j[X#o[X'f[X'p[X'w[X'x[X!R[X!S[X~O#m[X~P#'}OQ#^OZ9rOj9gOu!{Ov!{Ox!|O!a9iO!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO#`9hO#a9iO#b9iO#c9iO#e9jO#g9lO#i9nO#j9oO'fQO'p#[O'w!}O'x#OO~O#m,hO~P#*XOQ'iXZ'iXj'iXu'iXv'iXx'iX!a'iX!b'iX!d'iX!j'iX#['iX#]'iX#^'iX#_'iX#`'iX#a'iX#b'iX#e'iX#g'iX#i'iX#j'iX'f'iX'p'iX'w'iX'x'iX!R'iX~O!{9sO#o9sO#c'iX#m'iX!S'iX~P#,SO_&sa!R&sa'W&sa!c&san&sa!O&sa!T&sa%Q&sa!]&sa~P!)wOQ#ZiZ#Zi_#Zij#Ziv#Zi!R#Zi!a#Zi!b#Zi!d#Zi!j#Zi#[#Zi#]#Zi#^#Zi#_#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi'W#Zi'f#Zi'p#Zi!O#Zi!c#Zin#Zi!T#Zi%Q#Zi!]#Zi~P!BpO_#ni!R#ni'W#ni!O#ni!c#nin#ni!T#ni%Q#ni!]#ni~P!)wO#z,jO~O#z,kO~O!]'lO!{,lO!T$OX#w$OX#z$OX$R$OX~O!Q,mO~O!T'oO#w,oO#z'nO$R,pO~O!R9pO!S'hX~P#*XO!S,qO~O$R,sO~OS'}O'U(OO'V,vO~O],yOk,yO!O,zO~O!RdX!]dX!cdX!c$eX'pdX~P!!rO!c-QO~P!BpO!R-RO!]!wO'p&oO!c'}X~O!c-WO~O!Q(`O']$bO!c'}P~O#W-YO~O!O$eX!R$eX!]$lX~P!!rO!R-ZO!O(OX~P!BpO!]-]O~O!O-_O~Oj-cO!]!wO!d$ZO'b$PO'p&oO~O!])aO~O_$^O!R-hO'W$^O~O!S-jO~P!&jO!X-kO!Y-kO'^$dO'g(jO~Ox-mO'g(jO~O!x-nO~O']${O!R&xX'a&xX~O!R(yO'a'ca~O'a-sO~Ou-tOv-tOx-uOPra'wra'xra!Rra!{ra~O'ara#mra~P#7pOu(SOx(TOP$^a'w$^a'x$^a!R$^a!{$^a~O'a$^a#m$^a~P#8fOu(SOx(TOP$`a'w$`a'x$`a!R$`a!{$`a~O'a$`a#m$`a~P#9XO]-vO~O#W-wO~O'a$na!R$na!{$na#m$na~P!#{O#W-zO~OP.TO!T&dO!o.SO%Q.RO~O]#qOj#rOk#qOl#qOq$ROs9tOx#yO!T#zO!_;eO!d#vO#V9}O#t$VO$_9wO$a9zO$d$WO'b$PO'f#sO~Oh.VO'].UO~P#:yO!])aO!T'`a_'`a!R'`a'W'`a~O#W.]O~OZ[X!RdX!SdX~O!R.^O!S(VX~O!S.`O~OZ.aO~O].cO'])iO~O!T$lO']$bO^'QX!R'QX~O!R)nO^(Ua~O!c.fO~P!)wO].hO~OZ.iO~O^.jO~OP.TO!T&dO!o.SO%Q.RO'b$PO~O!R)zO_(Ra'W(Ra~O!{.pO~OP.sO!T#zO~O'g'TO!S(SP~OP.}O!T.yO!o.|O%Q.{O'b$PO~OZ/XO!R/VO!S(TX~O!S/YO~O^/[O_$^O'W$^O~O]/]O~O]/^O'](|O~O#c/_O%r/`O~P0zO!{#eO#c/_O%r/`O~O_/aO~P){O_/cO~O%{/gOQ%yiR%yiX%yi]%yi_%yib%yic%yih%yij%yik%yil%yiq%yis%yix%yi{%yi|%yi}%yi!T%yi!_%yi!d%yi!g%yi!h%yi!i%yi!j%yi!k%yi!n%yi#d%yi#t%yi#x%yi%P%yi%R%yi%T%yi%U%yi%X%yi%Z%yi%^%yi%_%yi%a%yi%n%yi%t%yi%v%yi%x%yi%z%yi%}%yi&T%yi&Z%yi&]%yi&_%yi&a%yi&c%yi'S%yi']%yi'f%yi'o%yi'|%yi!S%yi`%yi&Q%yi~O`/mO!S/kO&Q/lO~P`O!TSO!d/oO~O&X*wOQ&SiR&SiX&Si]&Si_&Sib&Sic&Sih&Sij&Sik&Sil&Siq&Sis&Six&Si{&Si|&Si}&Si!T&Si!_&Si!d&Si!g&Si!h&Si!i&Si!j&Si!k&Si!n&Si#d&Si#t&Si#x&Si%P&Si%R&Si%T&Si%U&Si%X&Si%Z&Si%^&Si%_&Si%a&Si%n&Si%t&Si%v&Si%x&Si%z&Si%}&Si&T&Si&Z&Si&]&Si&_&Si&a&Si&c&Si'S&Si']&Si'f&Si'o&Si'|&Si!S&Si%{&Si`&Si&Q&Si~O!R#bOn$]a~O!O&ii!R&ii~P!)wO!R%zO!O'ji~O!R&`O!O'ti~O!O/uO~O!R!Va!S!Va~P#*XO]&ROk&RO!Q/{O'g(jO!R&jX!S&jX~P@dO!R+`O!S'ka~O]&ZOk&ZO!Q)yO'g'TO!R&oX!S&oX~O!R+cO!S'va~O!O'ui!R'ui~P!)wO_$^O!]!wO!d$ZO!j0VO!{0TO'W$^O'b$PO'p&oO~O!S0YO~P!?iO!X0ZO!Y0ZO'^$dO'g(jO'o+iO~O!W0[O~P#MSO!TSO!W0[O!u0^O!x0_O~P#MSO!W0[O!s0aO!t0aO!u0^O!x0_O~P#MSO!T&dO~O!T&dO~P!BpO!R'ri!c'ri_'ri'W'ri~P!)wO!{0jO!R'ri!c'ri_'ri'W'ri~O!R&tO!c'qi~Ox$uO!T$vO#V0lO']$bO~O#WraQraZra_rajra!ara!bra!dra!jra#[ra#]ra#^ra#_ra#`ra#ara#bra#cra#era#gra#ira#jra'Wra'fra'pra!cra!Ora!Tranra%Qra!]ra~P#7pO#W$^aQ$^aZ$^a_$^aj$^av$^a!a$^a!b$^a!d$^a!j$^a#[$^a#]$^a#^$^a#_$^a#`$^a#a$^a#b$^a#c$^a#e$^a#g$^a#i$^a#j$^a'W$^a'f$^a'p$^a!c$^a!O$^a!T$^an$^a%Q$^a!]$^a~P#8fO#W$`aQ$`aZ$`a_$`aj$`av$`a!a$`a!b$`a!d$`a!j$`a#[$`a#]$`a#^$`a#_$`a#`$`a#a$`a#b$`a#c$`a#e$`a#g$`a#i$`a#j$`a'W$`a'f$`a'p$`a!c$`a!O$`a!T$`an$`a%Q$`a!]$`a~P#9XO#W$naQ$naZ$na_$naj$nav$na!R$na!a$na!b$na!d$na!j$na#[$na#]$na#^$na#_$na#`$na#a$na#b$na#c$na#e$na#g$na#i$na#j$na'W$na'f$na'p$na!c$na!O$na!T$na!{$nan$na%Q$na!]$na~P!BpO_#Oq!R#Oq'W#Oq!O#Oq!c#Oqn#Oq!T#Oq%Q#Oq!]#Oq~P!)wO!R&kX'a&kX~PJjO!R,_O'a'ma~O!Q0tO!R&lX!c&lX~P){O!R,bO!c'na~O!R,bO!c'na~P!)wO#m!fa!S!fa~PCfO#m!^a!R!^a!S!^a~P#*XO!T1XO#x^O$P1YO~O!S1^O~On1_O~P!BpO_$Yq!R$Yq'W$Yq!O$Yq!c$Yqn$Yq!T$Yq%Q$Yq!]$Yq~P!)wO!O1`O~O],yOk,yO~Ou(SOx(TO'x(XOP$xi'w$xi!R$xi!{$xi~O'a$xi#m$xi~P$.POu(SOx(TOP$zi'w$zi'x$zi!R$zi!{$zi~O'a$zi#m$zi~P$.rO'p#[O~P!BpO!Q1cO']$bO!R&tX!c&tX~O!R-RO!c'}a~O!R-RO!]!wO!c'}a~O!R-RO!]!wO'p&oO!c'}a~O'a$gi!R$gi!{$gi#m$gi~P!#{O!Q1kO'](eO!O&vX!R&vX~P!$jO!R-ZO!O(Oa~O!R-ZO!O(Oa~P!BpO!]!wO~O!]!wO#c1sO~Oj1vO!]!wO'p&oO~O!R'di'a'di~P!#{O!{1yO!R'di'a'di~P!#{O!c1|O~O_$Zq!R$Zq'W$Zq!O$Zq!c$Zqn$Zq!T$Zq%Q$Zq!]$Zq~P!)wO!R2QO!T(PX~P!BpO!T&dO%Q2TO~O!T&dO%Q2TO~P!BpO!T$eX$u[X_$eX!R$eX'W$eX~P!!rO$u2XOPgXugXxgX!TgX'wgX'xgX_gX!RgX'WgX~O$u2XO~O]2_O%R2`O'])iO!R'PX!S'PX~O!R.^O!S(Va~OZ2dO~O^2eO~O]2hO~OP2jO!T&dO!o2iO%Q2TO~O_$^O'W$^O~P!BpO!T#zO~P!BpO!R2oO!{2qO!S(SX~O!S2rO~Ox;oO!W2{O!X2tO!Y2tO!r2zO!s2yO!t2yO!x2xO'^$dO'g(jO'o+iO~O!S2wO~P$7ZOP3SO!T.yO!o3RO%Q3QO~OP3SO!T.yO!o3RO%Q3QO'b$PO~O'](|O!R'OX!S'OX~O!R/VO!S(Ta~O]3^O'g3]O~O]3_O~O^3aO~O!c3dO~P){O_3fO~O_3fO~P){O#c3hO%r3iO~PFOO`/mO!S3mO&Q/lO~P`O!]3oO~O!R#Ti!S#Ti~P#*XO!{3qO!R#Ti!S#Ti~O!R!Vi!S!Vi~P#*XO_$^O!{3xO'W$^O~O_$^O!]!wO!{3xO'W$^O~O!X3|O!Y3|O'^$dO'g(jO'o+iO~O_$^O!]!wO!d$ZO!j3}O!{3xO'W$^O'b$PO'p&oO~O!W4OO~P$;xO!W4OO!u4RO!x4SO~P$;xO_$^O!]!wO!j3}O!{3xO'W$^O'p&oO~O!R'rq!c'rq_'rq'W'rq~P!)wO!R&tO!c'qq~O#W$xiQ$xiZ$xi_$xij$xiv$xi!a$xi!b$xi!d$xi!j$xi#[$xi#]$xi#^$xi#_$xi#`$xi#a$xi#b$xi#c$xi#e$xi#g$xi#i$xi#j$xi'W$xi'f$xi'p$xi!c$xi!O$xi!T$xin$xi%Q$xi!]$xi~P$.PO#W$ziQ$ziZ$zi_$zij$ziv$zi!a$zi!b$zi!d$zi!j$zi#[$zi#]$zi#^$zi#_$zi#`$zi#a$zi#b$zi#c$zi#e$zi#g$zi#i$zi#j$zi'W$zi'f$zi'p$zi!c$zi!O$zi!T$zin$zi%Q$zi!]$zi~P$.rO#W$giQ$giZ$gi_$gij$giv$gi!R$gi!a$gi!b$gi!d$gi!j$gi#[$gi#]$gi#^$gi#_$gi#`$gi#a$gi#b$gi#c$gi#e$gi#g$gi#i$gi#j$gi'W$gi'f$gi'p$gi!c$gi!O$gi!T$gi!{$gin$gi%Q$gi!]$gi~P!BpO!R&ka'a&ka~P!#{O!R&la!c&la~P!)wO!R,bO!c'ni~O#m#Oi!R#Oi!S#Oi~P#*XOQ#^Ou!{Ov!{Ox!|O!b!yO!d!zO!j#^O'fQOZ#Zij#Zi!a#Zi#]#Zi#^#Zi#_#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi#m#Zi'p#Zi'w#Zi'x#Zi!R#Zi!S#Zi~O#[#Zi~P$EiO#[9eO~P$EiOQ#^Ou!{Ov!{Ox!|O!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO'fQOZ#Zi!a#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi#m#Zi'p#Zi'w#Zi'x#Zi!R#Zi!S#Zi~Oj#Zi~P$GqOj9gO~P$GqOQ#^Oj9gOu!{Ov!{Ox!|O!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO#`9hO'fQO#e#Zi#g#Zi#i#Zi#j#Zi#m#Zi'p#Zi'w#Zi'x#Zi!R#Zi!S#Zi~OZ#Zi!a#Zi#a#Zi#b#Zi#c#Zi~P$IyOZ9rO!a9iO#a9iO#b9iO#c9iO~P$IyOQ#^OZ9rOj9gOu!{Ov!{Ox!|O!a9iO!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO#`9hO#a9iO#b9iO#c9iO#e9jO'fQO#g#Zi#i#Zi#j#Zi#m#Zi'p#Zi'x#Zi!R#Zi!S#Zi~O'w#Zi~P$L_O'w!}O~P$L_OQ#^OZ9rOj9gOu!{Ov!{Ox!|O!a9iO!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO#`9hO#a9iO#b9iO#c9iO#e9jO#g9lO'fQO'w!}O#i#Zi#j#Zi#m#Zi'p#Zi!R#Zi!S#Zi~O'x#Zi~P$NgO'x#OO~P$NgOQ#^OZ9rOj9gOu!{Ov!{Ox!|O!a9iO!b!yO!d!zO!j#^O#[9eO#]9fO#^9fO#_9fO#`9hO#a9iO#b9iO#c9iO#e9jO#g9lO#i9nO'fQO'w!}O'x#OO~O#j#Zi#m#Zi'p#Zi!R#Zi!S#Zi~P%!oO_#ky!R#ky'W#ky!O#ky!c#kyn#ky!T#ky%Q#ky!]#ky~P!)wOP;vOu(SOx(TO'w(VO'x(XO~OQ#ZiZ#Zij#Ziv#Zi!a#Zi!b#Zi!d#Zi!j#Zi#[#Zi#]#Zi#^#Zi#_#Zi#`#Zi#a#Zi#b#Zi#c#Zi#e#Zi#g#Zi#i#Zi#j#Zi#m#Zi'f#Zi'p#Zi!R#Zi!S#Zi~P%%aO!b!yOP'eXu'eXx'eX'w'eX'x'eX!S'eX~OQ'eXZ'eXj'eXv'eX!a'eX!d'eX!j'eX#['eX#]'eX#^'eX#_'eX#`'eX#a'eX#b'eX#c'eX#e'eX#g'eX#i'eX#j'eX#m'eX'f'eX'p'eX!R'eX~P%'eO#m#ni!R#ni!S#ni~P#*XO!S4eO~O!R&sa!S&sa~P#*XO!]!wO'p&oO!R&ta!c&ta~O!R-RO!c'}i~O!R-RO!]!wO!c'}i~O'a$gq!R$gq!{$gq#m$gq~P!#{O!O&va!R&va~P!BpO!]4lO~O!R-ZO!O(Oi~P!BpO!R-ZO!O(Oi~O!O4pO~O!]!wO#c4uO~Oj4vO!]!wO'p&oO~O!O4xO~O'a$iq!R$iq!{$iq#m$iq~P!#{O_$Zy!R$Zy'W$Zy!O$Zy!c$Zyn$Zy!T$Zy%Q$Zy!]$Zy~P!)wO!R2QO!T(Pa~O!T&dO%Q4}O~O!T&dO%Q4}O~P!BpO_#Oy!R#Oy'W#Oy!O#Oy!c#Oyn#Oy!T#Oy%Q#Oy!]#Oy~P!)wOZ5QO~O]5SO'])iO~O!R.^O!S(Vi~O]5VO~O^5WO~O'g'TO!R&{X!S&{X~O!R2oO!S(Sa~O!S5eO~P$7ZOx;sO'g(jO'o+iO~O!W5hO!X5gO!Y5gO!x0_O'^$dO'g(jO'o+iO~O!s5iO!t5iO~P%0^O!X5gO!Y5gO'^$dO'g(jO'o+iO~O!T.yO~O!T.yO%Q5kO~O!T.yO%Q5kO~P!BpOP5pO!T.yO!o5oO%Q5kO~OZ5uO!R'Oa!S'Oa~O!R/VO!S(Ti~O]5xO~O!c5yO~O!c5zO~O!c5{O~O!c5{O~P){O_5}O~O!]6QO~O!c6RO~O!R'ui!S'ui~P#*XO_$^O'W$^O~P!)wO_$^O!{6WO'W$^O~O_$^O!]!wO!{6WO'W$^O~O!X6]O!Y6]O'^$dO'g(jO'o+iO~O_$^O!]!wO!j6^O!{6WO'W$^O'p&oO~O!d$ZO'b$PO~P%4xO!W6_O~P%4gO!R'ry!c'ry_'ry'W'ry~P!)wO#W$gqQ$gqZ$gq_$gqj$gqv$gq!R$gq!a$gq!b$gq!d$gq!j$gq#[$gq#]$gq#^$gq#_$gq#`$gq#a$gq#b$gq#c$gq#e$gq#g$gq#i$gq#j$gq'W$gq'f$gq'p$gq!c$gq!O$gq!T$gq!{$gqn$gq%Q$gq!]$gq~P!BpO#W$iqQ$iqZ$iq_$iqj$iqv$iq!R$iq!a$iq!b$iq!d$iq!j$iq#[$iq#]$iq#^$iq#_$iq#`$iq#a$iq#b$iq#c$iq#e$iq#g$iq#i$iq#j$iq'W$iq'f$iq'p$iq!c$iq!O$iq!T$iq!{$iqn$iq%Q$iq!]$iq~P!BpO!R&li!c&li~P!)wO#m#Oq!R#Oq!S#Oq~P#*XOu-tOv-tOx-uOPra'wra'xra!Sra~OQraZrajra!ara!bra!dra!jra#[ra#]ra#^ra#_ra#`ra#ara#bra#cra#era#gra#ira#jra#mra'fra'pra!Rra~P%;OOu(SOx(TOP$^a'w$^a'x$^a!S$^a~OQ$^aZ$^aj$^av$^a!a$^a!b$^a!d$^a!j$^a#[$^a#]$^a#^$^a#_$^a#`$^a#a$^a#b$^a#c$^a#e$^a#g$^a#i$^a#j$^a#m$^a'f$^a'p$^a!R$^a~P%=SOu(SOx(TOP$`a'w$`a'x$`a!S$`a~OQ$`aZ$`aj$`av$`a!a$`a!b$`a!d$`a!j$`a#[$`a#]$`a#^$`a#_$`a#`$`a#a$`a#b$`a#c$`a#e$`a#g$`a#i$`a#j$`a#m$`a'f$`a'p$`a!R$`a~P%?WOQ$naZ$naj$nav$na!a$na!b$na!d$na!j$na#[$na#]$na#^$na#_$na#`$na#a$na#b$na#c$na#e$na#g$na#i$na#j$na#m$na'f$na'p$na!R$na!S$na~P%%aO#m$Yq!R$Yq!S$Yq~P#*XO#m$Zq!R$Zq!S$Zq~P#*XO!S6hO~O#m6iO~P!#{O!]!wO!R&ti!c&ti~O!]!wO'p&oO!R&ti!c&ti~O!R-RO!c'}q~O!O&vi!R&vi~P!BpO!R-ZO!O(Oq~O!O6oO~P!BpO!O6oO~O!R'dy'a'dy~P!#{O!R&ya!T&ya~P!BpO!T$tq_$tq!R$tq'W$tq~P!BpOZ6vO~O!R.^O!S(Vq~O]6yO~O!T&dO%Q6zO~O!T&dO%Q6zO~P!BpO!{6{O!R&{a!S&{a~O!R2oO!S(Si~P#*XO!X7RO!Y7RO'^$dO'g(jO'o+iO~O!W7TO!x4SO~P%GXO!T.yO%Q7WO~O!T.yO%Q7WO~P!BpO]7_O'g7^O~O!R/VO!S(Tq~O!c7aO~O!c7aO~P){O!c7cO~O!c7dO~O!R#Ty!S#Ty~P#*XO_$^O!{7jO'W$^O~O_$^O!]!wO!{7jO'W$^O~O!X7mO!Y7mO'^$dO'g(jO'o+iO~O_$^O!]!wO!j7nO!{7jO'W$^O'p&oO~O#m#ky!R#ky!S#ky~P#*XOQ$giZ$gij$giv$gi!a$gi!b$gi!d$gi!j$gi#[$gi#]$gi#^$gi#_$gi#`$gi#a$gi#b$gi#c$gi#e$gi#g$gi#i$gi#j$gi#m$gi'f$gi'p$gi!R$gi!S$gi~P%%aOu(SOx(TO'x(XOP$xi'w$xi!S$xi~OQ$xiZ$xij$xiv$xi!a$xi!b$xi!d$xi!j$xi#[$xi#]$xi#^$xi#_$xi#`$xi#a$xi#b$xi#c$xi#e$xi#g$xi#i$xi#j$xi#m$xi'f$xi'p$xi!R$xi~P%LjOu(SOx(TOP$zi'w$zi'x$zi!S$zi~OQ$ziZ$zij$ziv$zi!a$zi!b$zi!d$zi!j$zi#[$zi#]$zi#^$zi#_$zi#`$zi#a$zi#b$zi#c$zi#e$zi#g$zi#i$zi#j$zi#m$zi'f$zi'p$zi!R$zi~P%NnO#m$Zy!R$Zy!S$Zy~P#*XO#m#Oy!R#Oy!S#Oy~P#*XO!]!wO!R&tq!c&tq~O!R-RO!c'}y~O!O&vq!R&vq~P!BpO!O7tO~P!BpO!R.^O!S(Vy~O!R2oO!S(Sq~O!X8QO!Y8QO'^$dO'g(jO'o+iO~O!T.yO%Q8TO~O!T.yO%Q8TO~P!BpO!c8WO~O_$^O!{8]O'W$^O~O_$^O!]!wO!{8]O'W$^O~OQ$gqZ$gqj$gqv$gq!a$gq!b$gq!d$gq!j$gq#[$gq#]$gq#^$gq#_$gq#`$gq#a$gq#b$gq#c$gq#e$gq#g$gq#i$gq#j$gq#m$gq'f$gq'p$gq!R$gq!S$gq~P%%aOQ$iqZ$iqj$iqv$iq!a$iq!b$iq!d$iq!j$iq#[$iq#]$iq#^$iq#_$iq#`$iq#a$iq#b$iq#c$iq#e$iq#g$iq#i$iq#j$iq#m$iq'f$iq'p$iq!R$iq!S$iq~P%%aO'a$|!Z!R$|!Z!{$|!Z#m$|!Z~P!#{O!R&{q!S&{q~P#*XO_$^O!{8oO'W$^O~O#W$|!ZQ$|!ZZ$|!Z_$|!Zj$|!Zv$|!Z!R$|!Z!a$|!Z!b$|!Z!d$|!Z!j$|!Z#[$|!Z#]$|!Z#^$|!Z#_$|!Z#`$|!Z#a$|!Z#b$|!Z#c$|!Z#e$|!Z#g$|!Z#i$|!Z#j$|!Z'W$|!Z'f$|!Z'p$|!Z!c$|!Z!O$|!Z!T$|!Z!{$|!Zn$|!Z%Q$|!Z!]$|!Z~P!BpOP;uOu(SOx(TO'w(VO'x(XO~O!S!za!W!za!X!za!Y!za!r!za!s!za!t!za!x!za'^!za'g!za'o!za~P&,_O!W'eX!X'eX!Y'eX!r'eX!s'eX!t'eX!x'eX'^'eX'g'eX'o'eX~P%'eOQ$|!ZZ$|!Zj$|!Zv$|!Z!a$|!Z!b$|!Z!d$|!Z!j$|!Z#[$|!Z#]$|!Z#^$|!Z#_$|!Z#`$|!Z#a$|!Z#b$|!Z#c$|!Z#e$|!Z#g$|!Z#i$|!Z#j$|!Z#m$|!Z'f$|!Z'p$|!Z!R$|!Z!S$|!Z~P%%aO!Wra!Xra!Yra!rra!sra!tra!xra'^ra'gra'ora~P%;OO!W$^a!X$^a!Y$^a!r$^a!s$^a!t$^a!x$^a'^$^a'g$^a'o$^a~P%=SO!W$`a!X$`a!Y$`a!r$`a!s$`a!t$`a!x$`a'^$`a'g$`a'o$`a~P%?WO!S$na!W$na!X$na!Y$na!r$na!s$na!t$na!x$na'^$na'g$na'o$na~P&,_O!W$xi!X$xi!Y$xi!r$xi!s$xi!t$xi!x$xi'^$xi'g$xi'o$xi~P%LjO!W$zi!X$zi!Y$zi!r$zi!s$zi!t$zi!x$zi'^$zi'g$zi'o$zi~P%NnO!S$gi!W$gi!X$gi!Y$gi!r$gi!s$gi!t$gi!x$gi'^$gi'g$gi'o$gi~P&,_O!S$gq!W$gq!X$gq!Y$gq!r$gq!s$gq!t$gq!x$gq'^$gq'g$gq'o$gq~P&,_O!S$iq!W$iq!X$iq!Y$iq!r$iq!s$iq!t$iq!x$iq'^$iq'g$iq'o$iq~P&,_O!S$|!Z!W$|!Z!X$|!Z!Y$|!Z!r$|!Z!s$|!Z!t$|!Z!x$|!Z'^$|!Z'g$|!Z'o$|!Z~P&,_On'hX~P.jOn[X!O[X!c[X%r[X!T[X%Q[X!][X~P$zO!]dX!c[X!cdX'pdX~P;dOQ9^OR9^O]cOb;`Oc!jOhcOj9^OkcOlcOq9^Os9^OxRO{cO|cO}cO!TSO!_9`O!dUO!g9^O!h9^O!i9^O!j9^O!k9^O!n!iO#t!lO#x^O']'cO'fQO'oYO'|;^O~O]#qOh$QOj#rOk#qOl#qOq$ROs9uOx#yO!T#zO!_;fO!d#vO#V:OO#t$VO$_9xO$a9{O$d$WO']&{O'b$PO'f#sO~O!R9pO!S$]a~O]#qOh$QOj#rOk#qOl#qOq$ROs9vOx#yO!T#zO!_;gO!d#vO#V:PO#t$VO$_9yO$a9|O$d$WO']&{O'b$PO'f#sO~O#d'jO~P&<WO!S[X!SdX~P;dO!]9dO~O#W9cO~O!]!wO#W9cO~O!{9sO~O#c9iO~O!{:QO!R'uX!S'uX~O!{9sO!R'sX!S'sX~O#W:RO~O'a:TO~P!#{O#W:[O~O#W:]O~O#W:^O~O!]!wO#W:_O~O!]!wO#W:RO~O#m:`O~P#*XO#W:aO~O#W:bO~O#W:cO~O#W:dO~O#W:eO~O#W:fO~O#W:gO~O#W:hO~O!O:iO~O#m:jO~P!#{O#m:kO~P!#{O#m:lO~P!#{O!O:mO~P!BpO!O:mO~O!O:nO~P!BpO!]!wO#c;lO~O!]!wO#c;nO~O#x~!b!r!t!u#U#V'|$_$a$d$u%P%Q%R%X%Z%^%_%a%c~UT#x'|#]}'Y'Z#z'Y']'g~",
    goto: "#Kk(ZPPPPPPPP([P(lP*`PPPP-zPP.a3s7o8SP8SPPP8SP:U8SP8SP:YPP:`P:t?VPPPP?ZPPPP?ZA{PPPBRDdP?ZPFwPPPPHp?ZPPPPPJi?ZPPMjNgPPPPNk!!TP!!]!#^PNg?Z?Z!&n!)i!.[!.[!1kPPP!1r!4h?ZPPPPPPPPPP!7_P!8pPP?Z!9}P?ZP?Z?Z?Z?ZP?Z!;dPP!>]P!AQ!AY!A^!A^P!>YP!Ab!AbP!DVP!DZ?Z?Z!Da!GT8SP8SP8S8SP!HW8S8S!Jf8S!M_8S# g8S8S#!T#$c#$c#$g#$c#$oP#$cP8S#%k8S#'X8S8S-zPPP#(yPP#)c#)cP#)cP#)x#)cPP#*OP#)uP#)u#*b!!X#)u#+P#+V#+Y([#+]([P#+d#+d#+dP([P([P([P([PP([P#+j#+mP#+m([P#+qP#+tP([P([P([P([P([P([([#+z#,U#,[#,b#,p#,v#,|#-W#-^#-m#-s#.R#.X#._#.m#/S#0z#1Y#1`#1f#1l#1r#1|#2S#2Y#2d#2v#2|PPPPPPPP#3SPP#3v#7OPP#8f#8m#8uPP#>a#@t#Fp#Fs#Fv#GR#GUPP#GX#G]#Gz#Hq#Hu#IZPP#I_#Ie#IiP#Il#Ip#Is#Jc#Jy#KO#KR#KU#K[#K_#Kc#KgmhOSj}!n$]%c%f%g%i*o*t/g/jQ$imQ$ppQ%ZyS&V!b+`Q&k!jS(l#z(qQ)g$jQ)t$rQ*`%TQ+f&^S+k&d+mQ+}&lQ-k(sQ/U*aY0Z+o+p+q+r+sS2t.y2vU3|0[0^0aU5g2y2z2{S6]4O4RS7R5h5iQ7m6_R8Q7T$p[ORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8o!j'e#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aQ(}$SQ)l$lQ*b%WQ*i%`Q,X9tQ.W)aQ.c)mQ/^*gQ2_.^Q3Z/VQ4^9vQ5S2`R8{9upeOSjy}!n$]%Y%c%f%g%i*o*t/g/jR*d%[&WVOSTjkn}!S!W!k!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k$]$n%[%_%`%c%e%f%g%i%m%z&S&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;`;a[!cRU!]!`%x&WQ$clQ$hmS$mp$rv$wrs!r!u$Z$u&`&t&w)x)y)z*m+Y+h,S,U/o0lQ%PwQ&h!iQ&j!jS(_#v(cS)f$i$jQ)j$lQ)w$tQ*Z%RQ*_%TS+|&k&lQ-V(`Q.[)gQ.b)mQ.d)nQ.g)rQ/P*[S/T*`*aQ0h+}Q1b-RQ2^.^Q2b.aQ2g.iQ3Y/UQ4i1cQ5R2`Q5U2dQ6u5QR7w6vx#xa!y$T$U$Y(W(Y(b(w(x,_-Y-w1a1y6i;^;i;j;k!Y$fm!j$h$i$j&U&j&k&l(k)f)g+]+j+|+}-d.[0Q0W0]0h1u3{4Q6Z7k8^Q)`$cQ*P$|Q*S$}Q*^%TQ.k)wQ/O*ZU/S*_*`*aQ3T/PS3X/T/UQ5b2sQ5t3YS7P5c5fS8O7Q7SQ8f8PQ8u8g#[;b!w#d#v#y&g'}(Z(h)])_)a*O*R+y-Z-].R.T.p.s.{.}1k1s2Q2T2X2j3Q3S4l4u4}5k5p6z7W8T9w9z9}:U:X:[:a:d:j;l;n;t;u;vd;c9d9x9{:O:V:Y:]:b:e:ke;d9r9y9|:P:W:Z:^:c:f:lW#}a$P(y;^S$|t%YQ$}uQ%OvR)}$z%P#|a!w!y#d#v#y$T$U$Y&g'}(W(Y(Z(b(h(w(x)])_)a*O*R+y,_-Y-Z-]-w.R.T.p.s.{.}1a1k1s1y2Q2T2X2j3Q3S4l4u4}5k5p6i6z7W8T9d9r9w9x9y9z9{9|9}:O:P:U:V:W:X:Y:Z:[:]:^:a:b:c:d:e:f:j:k:l;^;i;j;k;l;n;t;u;vT(O#s(PX)O$S9t9u9vU&Z!b$v+cQ'U!{Q)q$oQ.t*TQ1z-tR5^2o&^cORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;a$]#aZ!_!o$a%w%}&y'Q'W'X'Y'Z'[']'^'_'`'a'b'd'g'k'u)p+R+^+g,O,^,d,g,i,w-x/v/y0i0s0w0x0y0z0{0|0}1O1P1Q1R1S1T1W1]2O2[3s3v4W4[4]4b4c5`6S6V6b6f6g7g7z8Z8m8y9_:|T!XQ!Y&_cORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aQ&X!bR/|+`Y&R!b&V&^+`+fS(k#z(qS+j&d+mS-d(l(sQ-e(mQ-l(tQ.v*VU0W+k+o+pU0]+q+r+sS0b+t2xQ1u-kQ1w-mQ1x-nS2s.y2vU3{0Z0[0^Q4P0_Q4Q0aS5c2t2{S5f2y2zU6Z3|4O4RQ6`4SS7Q5g5hQ7S5iS7k6]6_S8P7R7TQ8^7mQ8g8QQ;h;oR;m;slhOSj}!n$]%c%f%g%i*o*t/g/jQ%k!QS&x!v9cQ)d$gQ*X%PQ*Y%QQ+z&iS,]&}:RS-y)V:_Q.Y)eQ.x*WQ/n*vQ/p*wQ/x+ZQ0`+qQ0f+{S2P-z:gQ2Y.ZS2].]:hQ3r/zQ3u0RQ4U0gQ5P2ZQ6T3tQ6X3zQ6a4VQ7e6RQ7h6YQ8Y7iQ8l8[R8x8n$W#`Z!_!o%w%}&y'Q'W'X'Y'Z'[']'^'_'`'a'b'd'g'k'u)p+R+^+g,O,^,d,g,w-x/v/y0i0s0w0x0y0z0{0|0}1O1P1Q1R1S1T1W1]2O2[3s3v4W4[4]4b4c5`6S6V6b6f6g7g7z8Z8m8y9_:|W(v#{&|1V8qT)Z$a,i$W#_Z!_!o%w%}&y'Q'W'X'Y'Z'[']'^'_'`'a'b'd'g'k'u)p+R+^+g,O,^,d,g,w-x/v/y0i0s0w0x0y0z0{0|0}1O1P1Q1R1S1T1W1]2O2[3s3v4W4[4]4b4c5`6S6V6b6f6g7g7z8Z8m8y9_:|Q'f#`S)Y$a,iR-{)Z&^cORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aQ%f{Q%g|Q%i!OQ%j!PR/f*rQ&e!iQ)[$cQ+w&hS.Q)`)wS0c+u+vW2S-}.O.P.kS4T0d0eU4|2U2V2WU6s4{5Y5ZQ7v6tR8b7yT+l&d+mS+j&d+mU0W+k+o+pU0]+q+r+sS0b+t2xS2s.y2vU3{0Z0[0^Q4P0_Q4Q0aS5c2t2{S5f2y2zU6Z3|4O4RQ6`4SS7Q5g5hQ7S5iS7k6]6_S8P7R7TQ8^7mR8g8QS+l&d+mT2u.y2vS&r!q/dQ-U(_Q-b(kS0V+j2sQ1g-VS1p-c-lU3}0]0b5fQ4h1bS4s1v1xU6^4P4Q7SQ6k4iQ6r4vR7n6`Q!xXS&q!q/dQ)W$[Q)b$eQ)h$kQ,Q&rQ-T(_Q-a(kQ-f(nQ.X)cQ/Q*]S0U+j2sS1f-U-VS1o-b-lQ1r-eQ1t-gQ3V/RW3y0V0]0b5fQ4g1bQ4k1gS4o1p1xQ4t1wQ5r3WW6[3}4P4Q7SS6j4h4iS6n4p:iQ6p4sQ6}5aQ7[5sS7l6^6`Q7r6kS7s6o:mQ7u6rQ7|7OQ8V7]Q8_7nS8a7t:nQ8d7}Q8s8eQ9Q8tQ9X9RQ:u:pQ;T:zQ;U:{Q;V;hR;[;m$rWORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%`%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8oS!xn!k!j:o#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aR:u;`$rXORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%`%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8oQ$[b!Y$em!j$h$i$j&U&j&k&l(k)f)g+]+j+|+}-d.[0Q0W0]0h1u3{4Q6Z7k8^S$kn!kQ)c$fQ*]%TW/R*^*_*`*aU3W/S/T/UQ5a2sS5s3X3YU7O5b5c5fQ7]5tU7}7P7Q7SS8e8O8PS8t8f8gQ9R8u!j:p#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aQ:z;_R:{;`$f]OSTjk}!S!W!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%c%e%f%g%i%m%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8oY!hRU!]!`%xv$wrs!r!u$Z$u&`&t&w)x)y)z*m+Y+h,S,U/o0lQ*j%`!h:q#]#k'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aR:t&WS&[!b$vR0O+c$p[ORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8o!j'e#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aR*i%`$roORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%`%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8oQ'U!{!k:r#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;a!h#VZ!_$a%w%}&y'Q'_'`'a'b'g'k)p+R+g,O,^,d,w-x0i0s1T2O2[3v4W4[6V7g8Z8m8y9_!R9k'd'u+^,i/v/y0w1P1Q1R1S1W1]3s4]4b4c5`6S6b6f6g7z:|!d#XZ!_$a%w%}&y'Q'a'b'g'k)p+R+g,O,^,d,w-x0i0s1T2O2[3v4W4[6V7g8Z8m8y9_}9m'd'u+^,i/v/y0w1R1S1W1]3s4]4b4c5`6S6b6f6g7z:|!`#]Z!_$a%w%}&y'Q'g'k)p+R+g,O,^,d,w-x0i0s1T2O2[3v4W4[6V7g8Z8m8y9_Q1a-Px;a'd'u+^,i/v/y0w1W1]3s4]4b4c5`6S6b6f6g7z:|Q;i;pQ;j;qR;k;r&^cORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aS#l`#mR1Y,l&e_ORSTU`jk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k#m$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,l,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aS#g^#nT'n#i'rT#h^#nT'p#i'r&e`ORSTU`jk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#]#b#e#k#m$]$n%[%_%`%c%e%f%g%i%m%x%z&S&W&_&f&p&}'R'w(R)V)^*k*o*t+T+X+[+x,P,b,h,l,m-u-z.S.].|/_/`/a/c/g/j/l/{0T0j0t1X2i2q3R3f3h3i3q3x5o5}6W6{7j8]8o9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;aT#l`#mQ#o`R'y#m$rbORSTUjk}!S!W!]!`!n!v!z!|#P#Q#R#S#T#U#V#W#X#Y#Z#b#e$]$n%[%_%`%c%e%f%g%i%m%x%z&S&_&f&p&}'R(R)V)^*k*o*t+T+x,P,b,h-u-z.S.].|/_/`/a/c/g/j/l0T0j0t2i3R3f3h3i3x5o5}6W7j8]8o!k;_#]#k&W'w+X+[,m/{1X2q3q6{9^9`9c9e9f9g9h9i9j9k9l9m9n9o9p9s:Q:R:T:_:`:g:h;a#RdOSUj}!S!W!n!|#k$]%[%_%`%c%e%f%g%i%m&S&f'w)^*k*o*t+x,m-u.S.|/_/`/a/c/g/j/l1X2i3R3f3h3i5o5}x#{a!y$T$U$Y(W(Y(b(w(x,_-Y-w1a1y6i;^;i;j;k#[&|!w#d#v#y&g'}(Z(h)])_)a*O*R+y-Z-].R.T.p.s.{.}1k1s2Q2T2X2j3Q3S4l4u4}5k5p6z7W8T9w9z9}:U:X:[:a:d:j;l;n;t;u;vQ)S$WQ,x(Sd1V9r9y9|:P:W:Z:^:c:f:le8q9d9x9{:O:V:Y:]:b:e:kx#wa!y$T$U$Y(W(Y(b(w(x,_-Y-w1a1y6i;^;i;j;kQ(d#xS(n#z(qQ)T$XQ-g(o#[:w!w#d#v#y&g'}(Z(h)])_)a*O*R+y-Z-].R.T.p.s.{.}1k1s2Q2T2X2j3Q3S4l4u4}5k5p6z7W8T9w9z9}:U:X:[:a:d:j;l;n;t;u;vd:x9d9x9{:O:V:Y:]:b:e:kd:y9r9y9|:P:W:Z:^:c:f:lQ:};bQ;O;cQ;P;dQ;Q;eQ;R;fR;S;gx#{a!y$T$U$Y(W(Y(b(w(x,_-Y-w1a1y6i;^;i;j;k#[&|!w#d#v#y&g'}(Z(h)])_)a*O*R+y-Z-].R.T.p.s.{.}1k1s2Q2T2X2j3Q3S4l4u4}5k5p6z7W8T9w9z9}:U:X:[:a:d:j;l;n;t;u;vd1V9r9y9|:P:W:Z:^:c:f:le8q9d9x9{:O:V:Y:]:b:e:klfOSj}!n$]%c%f%g%i*o*t/g/jQ(g#yQ*}%pQ+O%rR1j-Z%O#|a!w!y#d#v#y$T$U$Y&g'}(W(Y(Z(b(h(w(x)])_)a*O*R+y,_-Y-Z-]-w.R.T.p.s.{.}1a1k1s1y2Q2T2X2j3Q3S4l4u4}5k5p6i6z7W8T9d9r9w9x9y9z9{9|9}:O:P:U:V:W:X:Y:Z:[:]:^:a:b:c:d:e:f:j:k:l;^;i;j;k;l;n;t;u;vQ*Q$}Q.r*SQ2m.qR5]2nT(p#z(qS(p#z(qT2u.y2vQ)b$eQ-f(nQ.X)cQ/Q*]Q3V/RQ5r3WQ6}5aQ7[5sQ7|7OQ8V7]Q8d7}Q8s8eQ9Q8tR9X9Rp(W#t'O)U-X-o-p0q1h1}4f4w7q:v;W;X;Y!n:U&z'i(^(f+v,[,t-P-^-|.P.o.q0e0p1i1m2W2l2n3O4Y4Z4m4q4y5O5Z5n6m6q7Y8`;Z;];p;q;r[:V8p9O9V9Y9Z9]]:W1U4a6c7o7p8zr(Y#t'O)U,}-X-o-p0q1h1}4f4w7q:v;W;X;Y!p:X&z'i(^(f+v,[,t-P-^-|.P.o.q0e0n0p1i1m2W2l2n3O4Y4Z4m4q4y5O5Z5n6m6q7Y8`;Z;];p;q;r^:Y8p9O9T9V9Y9Z9]_:Z1U4a6c6d7o7p8zpeOSjy}!n$]%Y%c%f%g%i*o*t/g/jQ%VxR*k%`peOSjy}!n$]%Y%c%f%g%i*o*t/g/jR%VxQ*U%OR.n)}qeOSjy}!n$]%Y%c%f%g%i*o*t/g/jQ.z*ZS3P/O/PW5j2|2}3O3TU7V5l5m5nU8R7U7X7YQ8h8SR8v8iQ%^yR*e%YR3^/XR7_5uS$mp$rR.d)nQ%czR*o%dR*u%jT/h*t/jR*y%kQ*x%kR/q*yQjOQ!nST$`j!nQ(P#sR,u(PQ!YQR%u!YQ!^RU%{!^%|+UQ%|!_R+U%}Q+a&XR/}+aQ,`'OR0r,`Q,c'QS0u,c0vR0v,dQ+m&dR0X+mS!eR$uU&a!e&b+VQ&b!fR+V&OQ+d&[R0P+dQ&u!sQ,R&sU,V&u,R0mR0m,WQ'r#iR,n'rQ#m`R'x#mQ#cZU'h#c+Q9qQ+Q9_R9q'uQ-S(_W1d-S1e4j6lU1e-T-U-VS4j1f1gR6l4k$k(U#t&z'O'i(^(f)P)Q)U+v,Y,Z,[,t,}-O-P-X-^-o-p-|.P.o.q0e0n0o0p0q1U1h1i1m1}2W2l2n3O4Y4Z4_4`4a4f4m4q4w4y5O5Z5n6c6d6e6m6q7Y7o7p7q8`8p8z8|8}9O9T9U9V9Y9Z9]:v;W;X;Y;Z;];p;q;rQ-[(fU1l-[1n4nQ1n-^R4n1mQ(q#zR-i(qQ(z$OR-r(zQ2R-|R4z2RQ){$xR.m){Q2p.tS5_2p6|R6|5`Q*W%PR.w*WQ2v.yR5d2vQ/W*bS3[/W5vR5v3^Q._)jW2a._2c5T6wQ2c.bQ5T2bR6w5UQ)o$mR.e)oQ/j*tR3l/jWiOSj!nQ%h}Q)X$]Q*n%cQ*p%fQ*q%gQ*s%iQ/e*oS/h*t/jR3k/gQ$_gQ%l!RQ%o!TQ%q!UQ%s!VQ)v$sQ)|$yQ*d%^Q*{%nQ-h(pS/Z*e*hQ/r*zQ/s*}Q/t+OS0S+j2sQ2f.hQ2k.oQ3U/QQ3`/]Q3j/fY3w0U0V0]0b5fQ5X2hQ5[2lQ5q3VQ5w3_[6U3v3y3}4P4Q7SQ6x5VQ7Z5rQ7`5xW7f6V6[6^6`Q7x6yQ7{6}Q8U7[U8X7g7l7nQ8c7|Q8j8VS8k8Z8_Q8r8dQ8w8mQ9P8sQ9S8yQ9W9QR9[9XQ$gmQ&i!jU)e$h$i$jQ+Z&UU+{&j&k&lQ-`(kS.Z)f)gQ/z+]Q0R+jS0g+|+}Q1q-dQ2Z.[Q3t0QS3z0W0]Q4V0hQ4r1uS6Y3{4QQ7i6ZQ8[7kR8n8^S#ua;^R({$PU$Oa$P;^R-q(yQ#taS&z!w)aQ'O!yQ'i#dQ(^#vQ(f#yQ)P$TQ)Q$UQ)U$YQ+v&gQ,Y9wQ,Z9zQ,[9}Q,t'}Q,}(WQ-O(YQ-P(ZQ-X(bQ-^(hQ-o(wQ-p(xd-|)].R.{2T3Q4}5k6z7W8TQ.P)_Q.o*OQ.q*RQ0e+yQ0n:UQ0o:XQ0p:[Q0q,_Q1U9rQ1h-YQ1i-ZQ1m-]Q1}-wQ2W.TQ2l.pQ2n.sQ3O.}Q4Y:aQ4Z:dQ4_9yQ4`9|Q4a:PQ4f1aQ4m1kQ4q1sQ4w1yQ4y2QQ5O2XQ5Z2jQ5n3SQ6c:^Q6d:WQ6e:ZQ6m4lQ6q4uQ7Y5pQ7o:cQ7p:fQ7q6iQ8`:jQ8p9dQ8z:lQ8|9xQ8}9{Q9O:OQ9T:VQ9U:YQ9V:]Q9Y:bQ9Z:eQ9]:kQ:v;^Q;W;iQ;X;jQ;Y;kQ;Z;lQ;];nQ;p;tQ;q;uR;r;vlgOSj}!n$]%c%f%g%i*o*t/g/jS!pU%eQ%n!SQ%t!WQ'V!|Q'v#kS*h%[%_Q*l%`Q*z%mQ+W&SQ+u&fQ,r'wQ.O)^Q/b*kQ0d+xQ1[,mQ1{-uQ2V.SQ2}.|Q3b/_Q3c/`Q3e/aQ3g/cQ3n/lQ4d1XQ5Y2iQ5m3RQ5|3fQ6O3hQ6P3iQ7X5oR7b5}!vZOSUj}!S!n!|$]%[%_%`%c%e%f%g%i%m&S&f)^*k*o*t+x-u.S.|/_/`/a/c/g/j/l2i3R3f3h3i5o5}Q!_RQ!oTQ$akS%w!]%zQ%}!`Q&y!vQ'Q!zQ'W#PQ'X#QQ'Y#RQ'Z#SQ'[#TQ']#UQ'^#VQ'_#WQ'`#XQ'a#YQ'b#ZQ'd#]Q'g#bQ'k#eW'u#k'w,m1XQ)p$nS+R%x+TS+^&W/{Q+g&_Q,O&pQ,^&}Q,d'RQ,g9^Q,i9`Q,w(RQ-x)VQ/v+XQ/y+[Q0i,PQ0s,bQ0w9cQ0x9eQ0y9fQ0z9gQ0{9hQ0|9iQ0}9jQ1O9kQ1P9lQ1Q9mQ1R9nQ1S9oQ1T,hQ1W9sQ1]9pQ2O-zQ2[.]Q3s:QQ3v0TQ4W0jQ4[0tQ4]:RQ4b:TQ4c:_Q5`2qQ6S3qQ6V3xQ6b:`Q6f:gQ6g:hQ7g6WQ7z6{Q8Z7jQ8m8]Q8y8oQ9_!WR:|;aR!aRR&Y!bS&U!b+`S+]&V&^R0Q+fR'P!yR'S!zT!tU$ZS!sU$ZU$xrs*mS&s!r!uQ,T&tQ,W&wQ.l)zS0k,S,UR4X0l`!dR!]!`$u%x&`)x+hh!qUrs!r!u$Z&t&w)z,S,U0lQ/d*mQ/w+YQ3p/oT:s&W)yT!gR$uS!fR$uS%y!]&`S&O!`)xS+S%x+hT+_&W)yT&]!b$vQ#i^R'{#nT'q#i'rR1Z,lT(a#v(cR(i#yQ-})]Q2U.RQ2|.{Q4{2TQ5l3QQ6t4}Q7U5kQ7y6zQ8S7WR8i8TlhOSj}!n$]%c%f%g%i*o*t/g/jQ%]yR*d%YV$yrs*mR.u*TR*c%WQ$qpR)u$rR)k$lT%az%dT%bz%dT/i*t/j",
    nodeNames:
      '⚠ extends ArithOp ArithOp InterpolationStart LineComment BlockComment Script ExportDeclaration export Star as VariableName String from ; default FunctionDeclaration async function VariableDefinition TypeParamList TypeDefinition ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation VoidType void TypeofType typeof MemberExpression . ?. PropertyName [ TemplateString Interpolation null super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewExpression new TypeArgList CompareOp < ) ( ArgList UnaryExpression await yield delete LogicOp BitOp ParenthesizedExpression ClassExpression class extends ClassBody MethodDeclaration Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression PrivatePropertyName BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof in const CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXStartTag JSXSelfClosingTag JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast ArrowFunction TypeParamList SequenceExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature CallSignature TypePredicate is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody MethodDeclaration AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement',
    maxTerm: 332,
    context: pf,
    nodeProps: [
      [
        'closedBy',
        4,
        'InterpolationEnd',
        40,
        ']',
        51,
        '}',
        66,
        ')',
        132,
        'JSXSelfCloseEndTag JSXEndTag',
        146,
        'JSXEndTag',
      ],
      [
        'group',
        -26,
        8,
        15,
        17,
        58,
        184,
        188,
        191,
        192,
        194,
        197,
        200,
        211,
        213,
        219,
        221,
        223,
        225,
        228,
        234,
        240,
        242,
        244,
        246,
        248,
        250,
        251,
        'Statement',
        -30,
        12,
        13,
        24,
        27,
        28,
        41,
        43,
        44,
        45,
        47,
        52,
        60,
        68,
        74,
        75,
        91,
        92,
        101,
        103,
        119,
        122,
        124,
        125,
        126,
        127,
        129,
        130,
        148,
        149,
        151,
        'Expression',
        -22,
        23,
        25,
        29,
        32,
        34,
        152,
        154,
        156,
        157,
        159,
        160,
        161,
        163,
        164,
        165,
        167,
        168,
        169,
        178,
        180,
        182,
        183,
        'Type',
        -3,
        79,
        85,
        90,
        'ClassItem',
      ],
      [
        'openedBy',
        30,
        'InterpolationStart',
        46,
        '[',
        50,
        '{',
        65,
        '(',
        131,
        'JSXStartTag',
        141,
        'JSXStartTag JSXStartCloseTag',
      ],
    ],
    propSources: [wf],
    skippedNodes: [0, 5, 6],
    repeatNodeCount: 28,
    tokenData:
      "!C}~R!`OX%TXY%cYZ'RZ[%c[]%T]^'R^p%Tpq%cqr'crs(kst0htu2`uv4pvw5ewx6cxy<yyz=Zz{=k{|>k|}?O}!O>k!O!P?`!P!QCl!Q!R!0[!R![!1q![!]!7s!]!^!8V!^!_!8g!_!`!9d!`!a!:[!a!b!<R!b!c%T!c!}2`!}#O!=d#O#P%T#P#Q!=t#Q#R!>U#R#S2`#S#T!>i#T#o2`#o#p!>y#p#q!?O#q#r!?f#r#s!?x#s$f%T$f$g%c$g#BY2`#BY#BZ!@Y#BZ$IS2`$IS$I_!@Y$I_$I|2`$I|$I}!Bq$I}$JO!Bq$JO$JT2`$JT$JU!@Y$JU$KV2`$KV$KW!@Y$KW&FU2`&FU&FV!@Y&FV?HT2`?HT?HU!@Y?HU~2`W%YR$UWO!^%T!_#o%T#p~%T7Z%jg$UW'Y7ROX%TXY%cYZ%TZ[%c[p%Tpq%cq!^%T!_#o%T#p$f%T$f$g%c$g#BY%T#BY#BZ%c#BZ$IS%T$IS$I_%c$I_$JT%T$JT$JU%c$JU$KV%T$KV$KW%c$KW&FU%T&FU&FV%c&FV?HT%T?HT?HU%c?HU~%T7Z'YR$UW'Z7RO!^%T!_#o%T#p~%T$T'jS$UW!j#{O!^%T!_!`'v!`#o%T#p~%T$O'}S#e#v$UWO!^%T!_!`(Z!`#o%T#p~%T$O(bR#e#v$UWO!^%T!_#o%T#p~%T)X(rZ$UW]#eOY(kYZ)eZr(krs*rs!^(k!^!_+U!_#O(k#O#P-b#P#o(k#o#p+U#p~(k&r)jV$UWOr)ers*Ps!^)e!^!_*a!_#o)e#o#p*a#p~)e&r*WR$P&j$UWO!^%T!_#o%T#p~%T&j*dROr*ars*ms~*a&j*rO$P&j)X*{R$P&j$UW]#eO!^%T!_#o%T#p~%T)P+ZV]#eOY+UYZ*aZr+Urs+ps#O+U#O#P+w#P~+U)P+wO$P&j]#e)P+zROr+Urs,Ts~+U)P,[U$P&j]#eOY,nZr,nrs-Vs#O,n#O#P-[#P~,n#e,sU]#eOY,nZr,nrs-Vs#O,n#O#P-[#P~,n#e-[O]#e#e-_PO~,n)X-gV$UWOr(krs-|s!^(k!^!_+U!_#o(k#o#p+U#p~(k)X.VZ$P&j$UW]#eOY.xYZ%TZr.xrs/rs!^.x!^!_,n!_#O.x#O#P0S#P#o.x#o#p,n#p~.x#m/PZ$UW]#eOY.xYZ%TZr.xrs/rs!^.x!^!_,n!_#O.x#O#P0S#P#o.x#o#p,n#p~.x#m/yR$UW]#eO!^%T!_#o%T#p~%T#m0XT$UWO!^.x!^!_,n!_#o.x#o#p,n#p~.x3]0mZ$UWOt%Ttu1`u!^%T!_!c%T!c!}1`!}#R%T#R#S1`#S#T%T#T#o1`#p$g%T$g~1`3]1g]$UW'o3TOt%Ttu1`u!Q%T!Q![1`![!^%T!_!c%T!c!}1`!}#R%T#R#S1`#S#T%T#T#o1`#p$g%T$g~1`7Z2k_$UW#zS']$y'g3SOt%Ttu2`u}%T}!O3j!O!Q%T!Q![2`![!^%T!_!c%T!c!}2`!}#R%T#R#S2`#S#T%T#T#o2`#p$g%T$g~2`[3q_$UW#zSOt%Ttu3ju}%T}!O3j!O!Q%T!Q![3j![!^%T!_!c%T!c!}3j!}#R%T#R#S3j#S#T%T#T#o3j#p$g%T$g~3j$O4wS#^#v$UWO!^%T!_!`5T!`#o%T#p~%T$O5[R$UW#o#vO!^%T!_#o%T#p~%T5b5lU'x5Y$UWOv%Tvw6Ow!^%T!_!`5T!`#o%T#p~%T$O6VS$UW#i#vO!^%T!_!`5T!`#o%T#p~%T)X6jZ$UW]#eOY6cYZ7]Zw6cwx*rx!^6c!^!_8T!_#O6c#O#P:T#P#o6c#o#p8T#p~6c&r7bV$UWOw7]wx*Px!^7]!^!_7w!_#o7]#o#p7w#p~7]&j7zROw7wwx*mx~7w)P8YV]#eOY8TYZ7wZw8Twx+px#O8T#O#P8o#P~8T)P8rROw8Twx8{x~8T)P9SU$P&j]#eOY9fZw9fwx-Vx#O9f#O#P9}#P~9f#e9kU]#eOY9fZw9fwx-Vx#O9f#O#P9}#P~9f#e:QPO~9f)X:YV$UWOw6cwx:ox!^6c!^!_8T!_#o6c#o#p8T#p~6c)X:xZ$P&j$UW]#eOY;kYZ%TZw;kwx/rx!^;k!^!_9f!_#O;k#O#P<e#P#o;k#o#p9f#p~;k#m;rZ$UW]#eOY;kYZ%TZw;kwx/rx!^;k!^!_9f!_#O;k#O#P<e#P#o;k#o#p9f#p~;k#m<jT$UWO!^;k!^!_9f!_#o;k#o#p9f#p~;k&i=QR!d&a$UWO!^%T!_#o%T#p~%Tk=bR!cc$UWO!^%T!_#o%T#p~%T7V=tU'^4V#_#v$UWOz%Tz{>W{!^%T!_!`5T!`#o%T#p~%T$O>_S#[#v$UWO!^%T!_!`5T!`#o%T#p~%T%w>rSj%o$UWO!^%T!_!`5T!`#o%T#p~%T&i?VR!R&a$UWO!^%T!_#o%T#p~%T7Z?gVu5^$UWO!O%T!O!P?|!P!Q%T!Q![@r![!^%T!_#o%T#p~%T!{@RT$UWO!O%T!O!P@b!P!^%T!_#o%T#p~%T!{@iR!Q!s$UWO!^%T!_#o%T#p~%T!{@yZ$UWk!sO!Q%T!Q![@r![!^%T!_!g%T!g!hAl!h#R%T#R#S@r#S#X%T#X#YAl#Y#o%T#p~%T!{AqZ$UWO{%T{|Bd|}%T}!OBd!O!Q%T!Q![CO![!^%T!_#R%T#R#SCO#S#o%T#p~%T!{BiV$UWO!Q%T!Q![CO![!^%T!_#R%T#R#SCO#S#o%T#p~%T!{CVV$UWk!sO!Q%T!Q![CO![!^%T!_#R%T#R#SCO#S#o%T#p~%T7ZCs`$UW#]#vOYDuYZ%TZzDuz{Jl{!PDu!P!Q!-e!Q!^Du!^!_Fx!_!`!.^!`!a!/]!a!}Du!}#OHq#O#PJQ#P#oDu#o#pFx#p~DuXD|[$UW}POYDuYZ%TZ!PDu!P!QEr!Q!^Du!^!_Fx!_!}Du!}#OHq#O#PJQ#P#oDu#o#pFx#p~DuXEy_$UW}PO!^%T!_#Z%T#Z#[Er#[#]%T#]#^Er#^#a%T#a#bEr#b#g%T#g#hEr#h#i%T#i#jEr#j#m%T#m#nEr#n#o%T#p~%TPF}V}POYFxZ!PFx!P!QGd!Q!}Fx!}#OG{#O#PHh#P~FxPGiU}P#Z#[Gd#]#^Gd#a#bGd#g#hGd#i#jGd#m#nGdPHOTOYG{Z#OG{#O#PH_#P#QFx#Q~G{PHbQOYG{Z~G{PHkQOYFxZ~FxXHvY$UWOYHqYZ%TZ!^Hq!^!_G{!_#OHq#O#PIf#P#QDu#Q#oHq#o#pG{#p~HqXIkV$UWOYHqYZ%TZ!^Hq!^!_G{!_#oHq#o#pG{#p~HqXJVV$UWOYDuYZ%TZ!^Du!^!_Fx!_#oDu#o#pFx#p~Du7ZJs^$UW}POYJlYZKoZzJlz{NQ{!PJl!P!Q!,R!Q!^Jl!^!_!!]!_!}Jl!}#O!'|#O#P!+a#P#oJl#o#p!!]#p~Jl7ZKtV$UWOzKoz{LZ{!^Ko!^!_M]!_#oKo#o#pM]#p~Ko7ZL`X$UWOzKoz{LZ{!PKo!P!QL{!Q!^Ko!^!_M]!_#oKo#o#pM]#p~Ko7ZMSR$UWU7RO!^%T!_#o%T#p~%T7RM`ROzM]z{Mi{~M]7RMlTOzM]z{Mi{!PM]!P!QM{!Q~M]7RNQOU7R7ZNX^$UW}POYJlYZKoZzJlz{NQ{!PJl!P!Q! T!Q!^Jl!^!_!!]!_!}Jl!}#O!'|#O#P!+a#P#oJl#o#p!!]#p~Jl7Z! ^_$UWU7R}PO!^%T!_#Z%T#Z#[Er#[#]%T#]#^Er#^#a%T#a#bEr#b#g%T#g#hEr#h#i%T#i#jEr#j#m%T#m#nEr#n#o%T#p~%T7R!!bY}POY!!]YZM]Zz!!]z{!#Q{!P!!]!P!Q!&x!Q!}!!]!}#O!$`#O#P!&f#P~!!]7R!#VY}POY!!]YZM]Zz!!]z{!#Q{!P!!]!P!Q!#u!Q!}!!]!}#O!$`#O#P!&f#P~!!]7R!#|UU7R}P#Z#[Gd#]#^Gd#a#bGd#g#hGd#i#jGd#m#nGd7R!$cWOY!$`YZM]Zz!$`z{!${{#O!$`#O#P!&S#P#Q!!]#Q~!$`7R!%OYOY!$`YZM]Zz!$`z{!${{!P!$`!P!Q!%n!Q#O!$`#O#P!&S#P#Q!!]#Q~!$`7R!%sTU7ROYG{Z#OG{#O#PH_#P#QFx#Q~G{7R!&VTOY!$`YZM]Zz!$`z{!${{~!$`7R!&iTOY!!]YZM]Zz!!]z{!#Q{~!!]7R!&}_}POzM]z{Mi{#ZM]#Z#[!&x#[#]M]#]#^!&x#^#aM]#a#b!&x#b#gM]#g#h!&x#h#iM]#i#j!&x#j#mM]#m#n!&x#n~M]7Z!(R[$UWOY!'|YZKoZz!'|z{!(w{!^!'|!^!_!$`!_#O!'|#O#P!*o#P#QJl#Q#o!'|#o#p!$`#p~!'|7Z!(|^$UWOY!'|YZKoZz!'|z{!(w{!P!'|!P!Q!)x!Q!^!'|!^!_!$`!_#O!'|#O#P!*o#P#QJl#Q#o!'|#o#p!$`#p~!'|7Z!*PY$UWU7ROYHqYZ%TZ!^Hq!^!_G{!_#OHq#O#PIf#P#QDu#Q#oHq#o#pG{#p~Hq7Z!*tX$UWOY!'|YZKoZz!'|z{!(w{!^!'|!^!_!$`!_#o!'|#o#p!$`#p~!'|7Z!+fX$UWOYJlYZKoZzJlz{NQ{!^Jl!^!_!!]!_#oJl#o#p!!]#p~Jl7Z!,Yc$UW}POzKoz{LZ{!^Ko!^!_M]!_#ZKo#Z#[!,R#[#]Ko#]#^!,R#^#aKo#a#b!,R#b#gKo#g#h!,R#h#iKo#i#j!,R#j#mKo#m#n!,R#n#oKo#o#pM]#p~Ko7Z!-lV$UWT7ROY!-eYZ%TZ!^!-e!^!_!.R!_#o!-e#o#p!.R#p~!-e7R!.WQT7ROY!.RZ~!.R$P!.g[$UW#o#v}POYDuYZ%TZ!PDu!P!QEr!Q!^Du!^!_Fx!_!}Du!}#OHq#O#PJQ#P#oDu#o#pFx#p~Du]!/f[#wS$UW}POYDuYZ%TZ!PDu!P!QEr!Q!^Du!^!_Fx!_!}Du!}#OHq#O#PJQ#P#oDu#o#pFx#p~Du!{!0cd$UWk!sO!O%T!O!P@r!P!Q%T!Q![!1q![!^%T!_!g%T!g!hAl!h#R%T#R#S!1q#S#U%T#U#V!3X#V#X%T#X#YAl#Y#b%T#b#c!2w#c#d!4m#d#l%T#l#m!5{#m#o%T#p~%T!{!1x_$UWk!sO!O%T!O!P@r!P!Q%T!Q![!1q![!^%T!_!g%T!g!hAl!h#R%T#R#S!1q#S#X%T#X#YAl#Y#b%T#b#c!2w#c#o%T#p~%T!{!3OR$UWk!sO!^%T!_#o%T#p~%T!{!3^W$UWO!Q%T!Q!R!3v!R!S!3v!S!^%T!_#R%T#R#S!3v#S#o%T#p~%T!{!3}Y$UWk!sO!Q%T!Q!R!3v!R!S!3v!S!^%T!_#R%T#R#S!3v#S#b%T#b#c!2w#c#o%T#p~%T!{!4rV$UWO!Q%T!Q!Y!5X!Y!^%T!_#R%T#R#S!5X#S#o%T#p~%T!{!5`X$UWk!sO!Q%T!Q!Y!5X!Y!^%T!_#R%T#R#S!5X#S#b%T#b#c!2w#c#o%T#p~%T!{!6QZ$UWO!Q%T!Q![!6s![!^%T!_!c%T!c!i!6s!i#R%T#R#S!6s#S#T%T#T#Z!6s#Z#o%T#p~%T!{!6z]$UWk!sO!Q%T!Q![!6s![!^%T!_!c%T!c!i!6s!i#R%T#R#S!6s#S#T%T#T#Z!6s#Z#b%T#b#c!2w#c#o%T#p~%T$u!7|R!]V$UW#m$fO!^%T!_#o%T#p~%T!q!8^R_!i$UWO!^%T!_#o%T#p~%T5w!8rR'bd!a/n#x&s'|P!P!Q!8{!^!_!9Q!_!`!9_W!9QO$WW#v!9VP#`#v!_!`!9Y#v!9_O#o#v#v!9dO#a#v$u!9kT!{$m$UWO!^%T!_!`'v!`!a!9z!a#o%T#p~%T$P!:RR#W#w$UWO!^%T!_#o%T#p~%T%V!:gT'a!R#a#v$RS$UWO!^%T!_!`!:v!`!a!;W!a#o%T#p~%T$O!:}R#a#v$UWO!^%T!_#o%T#p~%T$O!;_T#`#v$UWO!^%T!_!`5T!`!a!;n!a#o%T#p~%T$O!;uS#`#v$UWO!^%T!_!`5T!`#o%T#p~%T*a!<YV'p#{$UWO!O%T!O!P!<o!P!^%T!_!a%T!a!b!=P!b#o%T#p~%T*[!<vRv*S$UWO!^%T!_#o%T#p~%T$O!=WS$UW#j#vO!^%T!_!`5T!`#o%T#p~%T7V!=kRx6}$UWO!^%T!_#o%T#p~%Tk!={R!Oc$UWO!^%T!_#o%T#p~%T$O!>]S#g#v$UWO!^%T!_!`5T!`#o%T#p~%T$a!>pR$UW'f$XO!^%T!_#o%T#p~%T~!?OO!T~5b!?VT'w5Y$UWO!^%T!_!`5T!`#o%T#p#q!=P#q~%T6X!?oR!S5}nQ$UWO!^%T!_#o%T#p~%TX!@PR!kP$UWO!^%T!_#o%T#p~%T7Z!@gr$UW'Y7R#zS']$y'g3SOX%TXY%cYZ%TZ[%c[p%Tpq%cqt%Ttu2`u}%T}!O3j!O!Q%T!Q![2`![!^%T!_!c%T!c!}2`!}#R%T#R#S2`#S#T%T#T#o2`#p$f%T$f$g%c$g#BY2`#BY#BZ!@Y#BZ$IS2`$IS$I_!@Y$I_$JT2`$JT$JU!@Y$JU$KV2`$KV$KW!@Y$KW&FU2`&FU&FV!@Y&FV?HT2`?HT?HU!@Y?HU~2`7Z!CO_$UW'Z7R#zS']$y'g3SOt%Ttu2`u}%T}!O3j!O!Q%T!Q![2`![!^%T!_!c%T!c!}2`!}#R%T#R#S2`#S#T%T#T#o2`#p$g%T$g~2`",
    tokenizers: [yf, mf, Qf, bf, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, gf],
    topRules: { Script: [0, 7] },
    dialects: { jsx: 12107, ts: 12109 },
    dynamicPrecedences: { 149: 1, 176: 1 },
    specialized: [
      { term: 289, get: (t) => xf[t] || -1 },
      { term: 299, get: (t) => vf[t] || -1 },
      { term: 63, get: (t) => Sf[t] || -1 },
    ],
    tokenPrec: 12130,
  }),
  $f = [
    qh('function ${name}(${params}) {\n\t${}\n}', { label: 'function', detail: 'definition', type: 'keyword' }),
    qh('for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}', {
      label: 'for',
      detail: 'loop',
      type: 'keyword',
    }),
    qh('for (let ${name} of ${collection}) {\n\t${}\n}', { label: 'for', detail: 'of loop', type: 'keyword' }),
    qh('do {\n\t${}\n} while (${})', { label: 'do', detail: 'loop', type: 'keyword' }),
    qh('while (${}) {\n\t${}\n}', { label: 'while', detail: 'loop', type: 'keyword' }),
    qh('try {\n\t${}\n} catch (${error}) {\n\t${}\n}', { label: 'try', detail: '/ catch block', type: 'keyword' }),
    qh('if (${}) {\n\t${}\n}', { label: 'if', detail: 'block', type: 'keyword' }),
    qh('if (${}) {\n\t${}\n} else {\n\t${}\n}', { label: 'if', detail: '/ else block', type: 'keyword' }),
    qh('class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}', {
      label: 'class',
      detail: 'definition',
      type: 'keyword',
    }),
    qh('import {${names}} from "${module}"\n${}', { label: 'import', detail: 'named', type: 'keyword' }),
    qh('import ${name} from "${module}"\n${}', { label: 'import', detail: 'default', type: 'keyword' }),
  ],
  Tf = new T(),
  Pf = new Set([
    'Script',
    'Block',
    'FunctionExpression',
    'FunctionDeclaration',
    'ArrowFunction',
    'MethodDeclaration',
    'ForStatement',
  ]);
function Rf(t) {
  return (e, i) => {
    let n = e.node.getChild('VariableDefinition');
    return n && i(n, t), !0;
  };
}
const Cf = ['FunctionDeclaration'],
  Wf = {
    FunctionDeclaration: Rf('function'),
    ClassDeclaration: Rf('class'),
    ClassExpression: () => !0,
    EnumDeclaration: Rf('constant'),
    TypeAliasDeclaration: Rf('type'),
    NamespaceDeclaration: Rf('namespace'),
    VariableDefinition(t, e) {
      t.matchContext(Cf) || e(t, 'variable');
    },
    TypeDefinition(t, e) {
      e(t, 'type');
    },
    __proto__: null,
  };
function Xf(t, e) {
  let i = Tf.get(e);
  if (i) return i;
  let n = [],
    s = !0;
  function r(e, i) {
    let s = t.sliceString(e.from, e.to);
    n.push({ label: s, type: i });
  }
  return (
    e.cursor(c.IncludeAnonymous).iterate((e) => {
      if (s) s = !1;
      else if (e.name) {
        let t = Wf[e.name];
        if ((t && t(e, r)) || Pf.has(e.name)) return !1;
      } else if (e.to - e.from > 8192) {
        for (let i of Xf(t, e.node)) n.push(i);
        return !1;
      }
    }),
    Tf.set(e, n),
    n
  );
}
const Af = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/,
  Zf = [
    'TemplateString',
    'String',
    'RegExp',
    'LineComment',
    'BlockComment',
    'VariableDefinition',
    'TypeDefinition',
    'Label',
    'PropertyDefinition',
    'PropertyName',
    'PrivatePropertyDefinition',
    'PrivatePropertyName',
  ];
function jf(t) {
  let e = ca(t.state).resolveInner(t.pos, -1);
  if (Zf.indexOf(e.name) > -1) return null;
  let i = e.to - e.from < 20 && Af.test(t.state.sliceDoc(e.from, e.to));
  if (!i && !t.explicit) return null;
  let n = [];
  for (let i = e; i; i = i.parent) Pf.has(i.name) && (n = n.concat(Xf(t.state.doc, i)));
  return { options: n, from: i ? e.from : t.pos, validFor: Af };
}
const Df = ha.define({
    parser: kf.configure({
      props: [
        Ra.add({
          IfStatement: Ma({ except: /^\s*({|else\b)/ }),
          TryStatement: Ma({ except: /^\s*({|catch\b|finally\b)/ }),
          LabeledStatement: za,
          SwitchBody: (t) => {
            let e = t.textAfter,
              i = /^\s*\}/.test(e),
              n = /^\s*(case|default)\b/.test(e);
            return t.baseIndent + (i ? 0 : n ? 1 : 2) * t.unit;
          },
          Block: ja({ closing: '}' }),
          ArrowFunction: (t) => t.baseIndent + t.unit,
          'TemplateString BlockComment': () => null,
          'Statement Property': Ma({ except: /^{/ }),
          JSXElement(t) {
            let e = /^\s*<\//.test(t.textAfter);
            return t.lineIndent(t.node.from) + (e ? 0 : t.unit);
          },
          JSXEscape(t) {
            let e = /\s*\}/.test(t.textAfter);
            return t.lineIndent(t.node.from) + (e ? 0 : t.unit);
          },
          'JSXOpenTag JSXSelfClosingTag': (t) => t.column(t.node.from) + t.unit,
        }),
        Ea.add({
          'Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression': Ga,
          BlockComment: (t) => ({ from: t.from + 2, to: t.to - 2 }),
        }),
      ],
    }),
    languageData: {
      closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
      commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
      indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
      wordChars: '$',
    },
  }),
  zf = Df.configure({ dialect: 'ts' }),
  Mf = Df.configure({ dialect: 'jsx' }),
  _f = Df.configure({ dialect: 'jsx ts' }),
  qf =
    'break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield'
      .split(' ')
      .map((t) => ({ label: t, type: 'keyword' }));
function Ef(t = {}) {
  let e = t.jsx ? (t.typescript ? _f : Mf) : t.typescript ? zf : Df;
  return new wa(e, [
    Df.data.of({ autocomplete: Ul(Zf, Ll($f.concat(qf))) }),
    Df.data.of({ autocomplete: jf }),
    t.jsx ? If : [],
  ]);
}
function Gf(t, e, i = t.length) {
  if (!e) return '';
  let n = e.getChild('JSXIdentifier');
  return n ? t.sliceString(n.from, Math.min(n.to, i)) : '';
}
const Vf = 'object' == typeof navigator && /Android\b/.test(navigator.userAgent),
  If = dr.inputHandler.of((t, e, i, n) => {
    if (
      (Vf ? t.composing : t.compositionStarted) ||
      t.state.readOnly ||
      e != i ||
      ('>' != n && '/' != n) ||
      !Df.isActiveAt(t.state, e, -1)
    )
      return !1;
    let { state: s } = t,
      r = s.changeByRange((t) => {
        var e, i, r;
        let o,
          { head: a } = t,
          l = ca(s).resolveInner(a, -1);
        if (('JSXStartTag' == l.name && (l = l.parent), '>' == n && 'JSXFragmentTag' == l.name))
          return { range: wt.cursor(a + 1), changes: { from: a, insert: '><>' } };
        if ('>' == n && 'JSXIdentifier' == l.name) {
          if (
            'JSXEndTag' !=
              (null === (i = null === (e = l.parent) || void 0 === e ? void 0 : e.lastChild) || void 0 === i
                ? void 0
                : i.name) &&
            (o = Gf(s.doc, l.parent, a))
          )
            return { range: wt.cursor(a + 1), changes: { from: a, insert: `></${o}>` } };
        } else if ('/' == n && 'JSXFragmentTag' == l.name) {
          let t = l.parent,
            e = null == t ? void 0 : t.parent;
          if (
            t.from == a - 1 &&
            'JSXEndTag' != (null === (r = e.lastChild) || void 0 === r ? void 0 : r.name) &&
            (o = Gf(s.doc, null == e ? void 0 : e.firstChild, a))
          ) {
            let t = `/${o}>`;
            return { range: wt.cursor(a + t.length), changes: { from: a, insert: t } };
          }
        }
        return { range: t };
      });
    return !r.changes.empty && (t.dispatch(r, { userEvent: 'input.type', scrollIntoView: !0 }), !0);
  });
function Nf(t, e, i, n) {
  return i.line(t + n.line).from + e + (1 == t ? n.col - 1 : -1);
}
function Lf(t, e, i) {
  let n = Nf(t.line, t.column, e, i),
    s = {
      from: n,
      to: null != t.endLine && 1 != t.endColumn ? Nf(t.endLine, t.endColumn, e, i) : n,
      message: t.message,
      source: t.ruleId ? 'eslint:' + t.ruleId : 'eslint',
      severity: 1 == t.severity ? 'warning' : 'error',
    };
  if (t.fix) {
    let { range: e, text: r } = t.fix,
      o = e[0] + i.pos - n,
      a = e[1] + i.pos - n;
    s.actions = [
      {
        name: 'fix',
        apply(t, e) {
          t.dispatch({ changes: { from: e + o, to: e + a, insert: r }, scrollIntoView: !0 });
        },
      },
    ];
  }
  return s;
}
var Uf = Object.freeze({
  __proto__: null,
  autoCloseTags: If,
  esLint: function (t, e) {
    return (
      e ||
        ((e = {
          parserOptions: { ecmaVersion: 2019, sourceType: 'module' },
          env: { browser: !0, node: !0, es6: !0, es2015: !0, es2017: !0, es2020: !0 },
          rules: {},
        }),
        t.getRules().forEach((t, i) => {
          t.meta.docs.recommended && (e.rules[i] = 2);
        })),
      (i) => {
        let { state: n } = i,
          s = [];
        for (let { from: i, to: r } of Df.findRegions(n)) {
          let o = n.doc.lineAt(i),
            a = { line: o.number - 1, col: i - o.from, pos: i };
          for (let o of t.verify(n.sliceDoc(i, r), e)) s.push(Lf(o, n.doc, a));
        }
        return s;
      }
    );
  },
  javascript: Ef,
  javascriptLanguage: Df,
  jsxLanguage: Mf,
  localCompletionSource: jf,
  snippets: $f,
  tsxLanguage: _f,
  typescriptLanguage: zf,
});
const Bf = ['_blank', '_self', '_top', '_parent'],
  Yf = ['ascii', 'utf-8', 'utf-16', 'latin1', 'latin1'],
  Ff = ['get', 'post', 'put', 'delete'],
  Hf = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
  Jf = ['true', 'false'],
  Kf = {},
  td = {
    a: { attrs: { href: null, ping: null, type: null, media: null, target: Bf, hreflang: null } },
    abbr: Kf,
    acronym: Kf,
    address: Kf,
    applet: Kf,
    area: {
      attrs: {
        alt: null,
        coords: null,
        href: null,
        target: null,
        ping: null,
        media: null,
        hreflang: null,
        type: null,
        shape: ['default', 'rect', 'circle', 'poly'],
      },
    },
    article: Kf,
    aside: Kf,
    audio: {
      attrs: {
        src: null,
        mediagroup: null,
        crossorigin: ['anonymous', 'use-credentials'],
        preload: ['none', 'metadata', 'auto'],
        autoplay: ['autoplay'],
        loop: ['loop'],
        controls: ['controls'],
      },
    },
    b: Kf,
    base: { attrs: { href: null, target: Bf } },
    basefont: Kf,
    bdi: Kf,
    bdo: Kf,
    big: Kf,
    blockquote: { attrs: { cite: null } },
    body: Kf,
    br: Kf,
    button: {
      attrs: {
        form: null,
        formaction: null,
        name: null,
        value: null,
        autofocus: ['autofocus'],
        disabled: ['autofocus'],
        formenctype: Hf,
        formmethod: Ff,
        formnovalidate: ['novalidate'],
        formtarget: Bf,
        type: ['submit', 'reset', 'button'],
      },
    },
    canvas: { attrs: { width: null, height: null } },
    caption: Kf,
    center: Kf,
    cite: Kf,
    code: Kf,
    col: { attrs: { span: null } },
    colgroup: { attrs: { span: null } },
    command: {
      attrs: {
        type: ['command', 'checkbox', 'radio'],
        label: null,
        icon: null,
        radiogroup: null,
        command: null,
        title: null,
        disabled: ['disabled'],
        checked: ['checked'],
      },
    },
    data: { attrs: { value: null } },
    datagrid: { attrs: { disabled: ['disabled'], multiple: ['multiple'] } },
    datalist: { attrs: { data: null } },
    dd: Kf,
    del: { attrs: { cite: null, datetime: null } },
    details: { attrs: { open: ['open'] } },
    dfn: Kf,
    dir: Kf,
    div: Kf,
    dl: Kf,
    dt: Kf,
    em: Kf,
    embed: { attrs: { src: null, type: null, width: null, height: null } },
    eventsource: { attrs: { src: null } },
    fieldset: { attrs: { disabled: ['disabled'], form: null, name: null } },
    figcaption: Kf,
    figure: Kf,
    font: Kf,
    footer: Kf,
    form: {
      attrs: {
        action: null,
        name: null,
        'accept-charset': Yf,
        autocomplete: ['on', 'off'],
        enctype: Hf,
        method: Ff,
        novalidate: ['novalidate'],
        target: Bf,
      },
    },
    frame: Kf,
    frameset: Kf,
    h1: Kf,
    h2: Kf,
    h3: Kf,
    h4: Kf,
    h5: Kf,
    h6: Kf,
    head: { children: ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'command'] },
    header: Kf,
    hgroup: Kf,
    hr: Kf,
    html: { attrs: { manifest: null } },
    i: Kf,
    iframe: {
      attrs: {
        src: null,
        srcdoc: null,
        name: null,
        width: null,
        height: null,
        sandbox: ['allow-top-navigation', 'allow-same-origin', 'allow-forms', 'allow-scripts'],
        seamless: ['seamless'],
      },
    },
    img: {
      attrs: {
        alt: null,
        src: null,
        ismap: null,
        usemap: null,
        width: null,
        height: null,
        crossorigin: ['anonymous', 'use-credentials'],
      },
    },
    input: {
      attrs: {
        alt: null,
        dirname: null,
        form: null,
        formaction: null,
        height: null,
        list: null,
        max: null,
        maxlength: null,
        min: null,
        name: null,
        pattern: null,
        placeholder: null,
        size: null,
        src: null,
        step: null,
        value: null,
        width: null,
        accept: ['audio/*', 'video/*', 'image/*'],
        autocomplete: ['on', 'off'],
        autofocus: ['autofocus'],
        checked: ['checked'],
        disabled: ['disabled'],
        formenctype: Hf,
        formmethod: Ff,
        formnovalidate: ['novalidate'],
        formtarget: Bf,
        multiple: ['multiple'],
        readonly: ['readonly'],
        required: ['required'],
        type: [
          'hidden',
          'text',
          'search',
          'tel',
          'url',
          'email',
          'password',
          'datetime',
          'date',
          'month',
          'week',
          'time',
          'datetime-local',
          'number',
          'range',
          'color',
          'checkbox',
          'radio',
          'file',
          'submit',
          'image',
          'reset',
          'button',
        ],
      },
    },
    ins: { attrs: { cite: null, datetime: null } },
    kbd: Kf,
    keygen: {
      attrs: {
        challenge: null,
        form: null,
        name: null,
        autofocus: ['autofocus'],
        disabled: ['disabled'],
        keytype: ['RSA'],
      },
    },
    label: { attrs: { for: null, form: null } },
    legend: Kf,
    li: { attrs: { value: null } },
    link: {
      attrs: {
        href: null,
        type: null,
        hreflang: null,
        media: null,
        sizes: ['all', '16x16', '16x16 32x32', '16x16 32x32 64x64'],
      },
    },
    map: { attrs: { name: null } },
    mark: Kf,
    menu: { attrs: { label: null, type: ['list', 'context', 'toolbar'] } },
    meta: {
      attrs: {
        content: null,
        charset: Yf,
        name: ['viewport', 'application-name', 'author', 'description', 'generator', 'keywords'],
        'http-equiv': ['content-language', 'content-type', 'default-style', 'refresh'],
      },
    },
    meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
    nav: Kf,
    noframes: Kf,
    noscript: Kf,
    object: {
      attrs: {
        data: null,
        type: null,
        name: null,
        usemap: null,
        form: null,
        width: null,
        height: null,
        typemustmatch: ['typemustmatch'],
      },
    },
    ol: {
      attrs: { reversed: ['reversed'], start: null, type: ['1', 'a', 'A', 'i', 'I'] },
      children: ['li', 'script', 'template', 'ul', 'ol'],
    },
    optgroup: { attrs: { disabled: ['disabled'], label: null } },
    option: { attrs: { disabled: ['disabled'], label: null, selected: ['selected'], value: null } },
    output: { attrs: { for: null, form: null, name: null } },
    p: Kf,
    param: { attrs: { name: null, value: null } },
    pre: Kf,
    progress: { attrs: { value: null, max: null } },
    q: { attrs: { cite: null } },
    rp: Kf,
    rt: Kf,
    ruby: Kf,
    s: Kf,
    samp: Kf,
    script: { attrs: { type: ['text/javascript'], src: null, async: ['async'], defer: ['defer'], charset: Yf } },
    section: Kf,
    select: {
      attrs: {
        form: null,
        name: null,
        size: null,
        autofocus: ['autofocus'],
        disabled: ['disabled'],
        multiple: ['multiple'],
      },
    },
    slot: { attrs: { name: null } },
    small: Kf,
    source: { attrs: { src: null, type: null, media: null } },
    span: Kf,
    strike: Kf,
    strong: Kf,
    style: { attrs: { type: ['text/css'], media: null, scoped: null } },
    sub: Kf,
    summary: Kf,
    sup: Kf,
    table: Kf,
    tbody: Kf,
    td: { attrs: { colspan: null, rowspan: null, headers: null } },
    template: Kf,
    textarea: {
      attrs: {
        dirname: null,
        form: null,
        maxlength: null,
        name: null,
        placeholder: null,
        rows: null,
        cols: null,
        autofocus: ['autofocus'],
        disabled: ['disabled'],
        readonly: ['readonly'],
        required: ['required'],
        wrap: ['soft', 'hard'],
      },
    },
    tfoot: Kf,
    th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ['row', 'col', 'rowgroup', 'colgroup'] } },
    thead: Kf,
    time: { attrs: { datetime: null } },
    title: Kf,
    tr: Kf,
    track: {
      attrs: {
        src: null,
        label: null,
        default: null,
        kind: ['subtitles', 'captions', 'descriptions', 'chapters', 'metadata'],
        srclang: null,
      },
    },
    tt: Kf,
    u: Kf,
    ul: { children: ['li', 'script', 'template', 'ul', 'ol'] },
    var: Kf,
    video: {
      attrs: {
        src: null,
        poster: null,
        width: null,
        height: null,
        crossorigin: ['anonymous', 'use-credentials'],
        preload: ['auto', 'metadata', 'none'],
        autoplay: ['autoplay'],
        mediagroup: ['movie'],
        muted: ['muted'],
        controls: ['controls'],
      },
    },
    wbr: Kf,
  },
  ed = {
    accesskey: null,
    class: null,
    contenteditable: Jf,
    contextmenu: null,
    dir: ['ltr', 'rtl', 'auto'],
    draggable: ['true', 'false', 'auto'],
    dropzone: ['copy', 'move', 'link', 'string:', 'file:'],
    hidden: ['hidden'],
    id: null,
    inert: ['inert'],
    itemid: null,
    itemprop: null,
    itemref: null,
    itemscope: ['itemscope'],
    itemtype: null,
    lang: ['ar', 'bn', 'de', 'en-GB', 'en-US', 'es', 'fr', 'hi', 'id', 'ja', 'pa', 'pt', 'ru', 'tr', 'zh'],
    spellcheck: Jf,
    autocorrect: Jf,
    autocapitalize: Jf,
    style: null,
    tabindex: null,
    title: null,
    translate: ['yes', 'no'],
    onclick: null,
    rel: [
      'stylesheet',
      'alternate',
      'author',
      'bookmark',
      'help',
      'license',
      'next',
      'nofollow',
      'noreferrer',
      'prefetch',
      'prev',
      'search',
      'tag',
    ],
    role: 'alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer'.split(
      ' ',
    ),
    'aria-activedescendant': null,
    'aria-atomic': Jf,
    'aria-autocomplete': ['inline', 'list', 'both', 'none'],
    'aria-busy': Jf,
    'aria-checked': ['true', 'false', 'mixed', 'undefined'],
    'aria-controls': null,
    'aria-describedby': null,
    'aria-disabled': Jf,
    'aria-dropeffect': null,
    'aria-expanded': ['true', 'false', 'undefined'],
    'aria-flowto': null,
    'aria-grabbed': ['true', 'false', 'undefined'],
    'aria-haspopup': Jf,
    'aria-hidden': Jf,
    'aria-invalid': ['true', 'false', 'grammar', 'spelling'],
    'aria-label': null,
    'aria-labelledby': null,
    'aria-level': null,
    'aria-live': ['off', 'polite', 'assertive'],
    'aria-multiline': Jf,
    'aria-multiselectable': Jf,
    'aria-owns': null,
    'aria-posinset': null,
    'aria-pressed': ['true', 'false', 'mixed', 'undefined'],
    'aria-readonly': Jf,
    'aria-relevant': null,
    'aria-required': Jf,
    'aria-selected': ['true', 'false', 'undefined'],
    'aria-setsize': null,
    'aria-sort': ['ascending', 'descending', 'none', 'other'],
    'aria-valuemax': null,
    'aria-valuemin': null,
    'aria-valuenow': null,
    'aria-valuetext': null,
  };
class id {
  constructor(t, e) {
    (this.tags = Object.assign(Object.assign({}, td), t)),
      (this.globalAttrs = Object.assign(Object.assign({}, ed), e)),
      (this.allTags = Object.keys(this.tags)),
      (this.globalAttrNames = Object.keys(this.globalAttrs));
  }
}
function nd(t, e, i = t.length) {
  if (!e) return '';
  let n = e.firstChild,
    s = n && n.getChild('TagName');
  return s ? t.sliceString(s.from, Math.min(s.to, i)) : '';
}
function sd(t, e = !1) {
  for (let i = t.parent; i; i = i.parent)
    if ('Element' == i.name) {
      if (!e) return i;
      e = !1;
    }
  return null;
}
function rd(t, e, i) {
  let n = i.tags[nd(t, sd(e, !0))];
  return (null == n ? void 0 : n.children) || i.allTags;
}
function od(t, e) {
  let i = [];
  for (let n = e; (n = sd(n)); ) {
    let s = nd(t, n);
    if (s && 'CloseTag' == n.lastChild.name) break;
    s && i.indexOf(s) < 0 && ('EndTag' == e.name || e.from >= n.firstChild.to) && i.push(s);
  }
  return i;
}
id.default = new id();
const ad = /^[:\-\.\w\u00b7-\uffff]*$/;
function ld(t, e, i, n, s) {
  let r = /\s*>/.test(t.sliceDoc(s, s + 5)) ? '' : '>';
  return {
    from: n,
    to: s,
    options: rd(t.doc, i, e)
      .map((t) => ({ label: t, type: 'type' }))
      .concat(od(t.doc, i).map((t, e) => ({ label: '/' + t, apply: '/' + t + r, type: 'type', boost: 99 - e }))),
    validFor: /^\/?[:\-\.\w\u00b7-\uffff]*$/,
  };
}
function hd(t, e, i, n) {
  let s = /\s*>/.test(t.sliceDoc(n, n + 5)) ? '' : '>';
  return {
    from: i,
    to: n,
    options: od(t.doc, e).map((t, e) => ({ label: t, apply: t + s, type: 'type', boost: 99 - e })),
    validFor: ad,
  };
}
function cd(t, e) {
  let { state: i, pos: n } = e,
    s = ca(i).resolveInner(n),
    r = s.resolve(n, -1);
  for (let t, e = n; s == r && (t = r.childBefore(e)); ) {
    let i = t.lastChild;
    if (!i || !i.type.isError || i.from < i.to) break;
    (s = r = t), (e = i.from);
  }
  return 'TagName' == r.name
    ? r.parent && /CloseTag$/.test(r.parent.name)
      ? hd(i, r, r.from, n)
      : ld(i, t, r, r.from, n)
    : 'StartTag' == r.name
    ? ld(i, t, r, n, n)
    : 'StartCloseTag' == r.name || 'IncompleteCloseTag' == r.name
    ? hd(i, r, n, n)
    : (e.explicit && ('OpenTag' == r.name || 'SelfClosingTag' == r.name)) || 'AttributeName' == r.name
    ? (function (t, e, i, n, s) {
        let r = sd(i),
          o = r ? e.tags[nd(t.doc, r)] : null;
        return {
          from: n,
          to: s,
          options: (o && o.attrs ? Object.keys(o.attrs).concat(e.globalAttrNames) : e.globalAttrNames).map((t) => ({
            label: t,
            type: 'property',
          })),
          validFor: ad,
        };
      })(i, t, r, 'AttributeName' == r.name ? r.from : n, n)
    : 'Is' == r.name || 'AttributeValue' == r.name || 'UnquotedAttributeValue' == r.name
    ? (function (t, e, i, n, s) {
        var r;
        let o,
          a = null === (r = i.parent) || void 0 === r ? void 0 : r.getChild('AttributeName'),
          l = [];
        if (a) {
          let r = t.sliceDoc(a.from, a.to),
            h = e.globalAttrs[r];
          if (!h) {
            let n = sd(i),
              s = n ? e.tags[nd(t.doc, n)] : null;
            h = (null == s ? void 0 : s.attrs) && s.attrs[r];
          }
          if (h) {
            let e = t.sliceDoc(n, s).toLowerCase(),
              i = '"',
              r = '"';
            /^['"]/.test(e)
              ? ((o = '"' == e[0] ? /^[^"]*$/ : /^[^']*$/),
                (i = ''),
                (r = t.sliceDoc(s, s + 1) == e[0] ? '' : e[0]),
                (e = e.slice(1)),
                n++)
              : (o = /^[^\s<>='"]*$/);
            for (let t of h) l.push({ label: t, apply: i + t + r, type: 'constant' });
          }
        }
        return { from: n, to: s, options: l, validFor: o };
      })(i, t, r, 'Is' == r.name ? n : r.from, n)
    : !e.explicit || ('Element' != s.name && 'Text' != s.name && 'Document' != s.name)
    ? null
    : (function (t, e, i, n) {
        let s = [],
          r = 0;
        for (let n of rd(t.doc, i, e)) s.push({ label: '<' + n, type: 'type' });
        for (let e of od(t.doc, i)) s.push({ label: '</' + e + '>', type: 'type', boost: 99 - r++ });
        return { from: n, to: n, options: s, validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
      })(i, t, r, n);
}
function ud(t) {
  let { extraTags: e, extraGlobalAttributes: i } = t,
    n = i || e ? new id(e, i) : id.default;
  return (t) => cd(n, t);
}
const Od = ha.define({
  parser: cf.configure({
    props: [
      Ra.add({
        Element(t) {
          let e = /^(\s*)(<\/)?/.exec(t.textAfter);
          return t.node.to <= t.pos + e[0].length ? t.continue() : t.lineIndent(t.node.from) + (e[2] ? 0 : t.unit);
        },
        'OpenTag CloseTag SelfClosingTag': (t) => t.column(t.node.from) + t.unit,
        Document(t) {
          if (t.pos + /\s*/.exec(t.textAfter)[0].length < t.node.to) return t.continue();
          let e,
            i = null;
          for (let e = t.node; ; ) {
            let t = e.lastChild;
            if (!t || 'Element' != t.name || t.to != e.to) break;
            i = e = t;
          }
          return i && (!(e = i.lastChild) || ('CloseTag' != e.name && 'SelfClosingTag' != e.name))
            ? t.lineIndent(i.from) + t.unit
            : null;
        },
      }),
      Ea.add({
        Element(t) {
          let e = t.firstChild,
            i = t.lastChild;
          return e && 'OpenTag' == e.name ? { from: e.to, to: 'CloseTag' == i.name ? i.from : t.to } : null;
        },
      }),
    ],
    wrap: ff([
      {
        tag: 'script',
        attrs: (t) => !t.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(t.type),
        parser: Df.parser,
      },
      {
        tag: 'style',
        attrs: (t) => (!t.lang || 'css' == t.lang) && (!t.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(t.type)),
        parser: qO.parser,
      },
    ]),
  }),
  languageData: {
    commentTokens: { block: { open: '\x3c!--', close: '--\x3e' } },
    indentOnInput: /^\s*<\/\w+\W$/,
    wordChars: '-._',
  },
});
function fd(t = {}) {
  let e = Od;
  return (
    !1 === t.matchClosingTags && (e = e.configure({ dialect: 'noMatch' })),
    new wa(e, [Od.data.of({ autocomplete: ud(t) }), !1 !== t.autoCloseTags ? dd : [], Ef().support, EO().support])
  );
}
const dd = dr.inputHandler.of((t, e, i, n) => {
  if (t.composing || t.state.readOnly || e != i || ('>' != n && '/' != n) || !Od.isActiveAt(t.state, e, -1)) return !1;
  let { state: s } = t,
    r = s.changeByRange((t) => {
      var e, i, r;
      let o,
        { head: a } = t,
        l = ca(s).resolveInner(a, -1);
      if ((('TagName' != l.name && 'StartTag' != l.name) || (l = l.parent), '>' == n && 'OpenTag' == l.name)) {
        if (
          'CloseTag' !=
            (null === (i = null === (e = l.parent) || void 0 === e ? void 0 : e.lastChild) || void 0 === i
              ? void 0
              : i.name) &&
          (o = nd(s.doc, l.parent, a))
        )
          return { range: wt.cursor(a + 1), changes: { from: a, insert: `></${o}>` } };
      } else if ('/' == n && 'OpenTag' == l.name) {
        let t = l.parent,
          e = null == t ? void 0 : t.parent;
        if (
          t.from == a - 1 &&
          'CloseTag' != (null === (r = e.lastChild) || void 0 === r ? void 0 : r.name) &&
          (o = nd(s.doc, e, a))
        ) {
          let t = `/${o}>`;
          return { range: wt.cursor(a + t.length), changes: { from: a, insert: t } };
        }
      }
      return { range: t };
    });
  return !r.changes.empty && (t.dispatch(r, { userEvent: 'input.type', scrollIntoView: !0 }), !0);
});
var pd = Object.freeze({
  __proto__: null,
  autoCloseTags: dd,
  html: fd,
  htmlCompletionSource: function (t) {
    return cd(id.default, t);
  },
  htmlCompletionSourceWith: ud,
  htmlLanguage: Od,
});
const gd = 'function' == typeof String.prototype.normalize ? (t) => t.normalize('NFKD') : (t) => t;
class md {
  constructor(t, e, i = 0, n = t.length, s) {
    (this.value = { from: 0, to: 0 }),
      (this.done = !1),
      (this.matches = []),
      (this.buffer = ''),
      (this.bufferPos = 0),
      (this.iter = t.iterRange(i, n)),
      (this.bufferStart = i),
      (this.normalize = s ? (t) => s(gd(t)) : gd),
      (this.query = this.normalize(e));
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (((this.bufferStart += this.buffer.length), this.iter.next(), this.iter.done)) return -1;
      (this.bufferPos = 0), (this.buffer = this.iter.value);
    }
    return at(this.buffer, this.bufferPos);
  }
  next() {
    for (; this.matches.length; ) this.matches.pop();
    return this.nextOverlapping();
  }
  nextOverlapping() {
    for (;;) {
      let t = this.peek();
      if (t < 0) return (this.done = !0), this;
      let e = lt(t),
        i = this.bufferStart + this.bufferPos;
      this.bufferPos += ht(t);
      let n = this.normalize(e);
      for (let t = 0, s = i; ; t++) {
        let r = n.charCodeAt(t),
          o = this.match(r, s);
        if (o) return (this.value = o), this;
        if (t == n.length - 1) break;
        s == i && t < e.length && e.charCodeAt(t) == r && s++;
      }
    }
  }
  match(t, e) {
    let i = null;
    for (let n = 0; n < this.matches.length; n += 2) {
      let s = this.matches[n],
        r = !1;
      this.query.charCodeAt(s) == t &&
        (s == this.query.length - 1 ? (i = { from: this.matches[n + 1], to: e + 1 }) : (this.matches[n]++, (r = !0))),
        r || (this.matches.splice(n, 2), (n -= 2));
    }
    return (
      this.query.charCodeAt(0) == t &&
        (1 == this.query.length ? (i = { from: e, to: e + 1 }) : this.matches.push(1, e)),
      i
    );
  }
}
'undefined' != typeof Symbol &&
  (md.prototype[Symbol.iterator] = function () {
    return this;
  });
const Qd = { from: -1, to: -1, match: /.*/.exec('') },
  bd = 'gm' + (null == /x/.unicode ? '' : 'u');
class yd {
  constructor(t, e, i, n = 0, s = t.length) {
    if (((this.to = s), (this.curLine = ''), (this.done = !1), (this.value = Qd), /\\[sWDnr]|\n|\r|\[\^/.test(e)))
      return new vd(t, e, i, n, s);
    (this.re = new RegExp(e, bd + ((null == i ? void 0 : i.ignoreCase) ? 'i' : ''))), (this.iter = t.iter());
    let r = t.lineAt(n);
    (this.curLineStart = r.from), (this.matchPos = n), this.getLine(this.curLineStart);
  }
  getLine(t) {
    this.iter.next(t),
      this.iter.lineBreak
        ? (this.curLine = '')
        : ((this.curLine = this.iter.value),
          this.curLineStart + this.curLine.length > this.to &&
            (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)),
          this.iter.next());
  }
  nextLine() {
    (this.curLineStart = this.curLineStart + this.curLine.length + 1),
      this.curLineStart > this.to ? (this.curLine = '') : this.getLine(0);
  }
  next() {
    for (let t = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = t;
      let e = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (e) {
        let i = this.curLineStart + e.index,
          n = i + e[0].length;
        if (
          ((this.matchPos = n + (i == n ? 1 : 0)),
          i == this.curLine.length && this.nextLine(),
          i < n || i > this.value.to)
        )
          return (this.value = { from: i, to: n, match: e }), this;
        t = this.matchPos - this.curLineStart;
      } else {
        if (!(this.curLineStart + this.curLine.length < this.to)) return (this.done = !0), this;
        this.nextLine(), (t = 0);
      }
    }
  }
}
const wd = new WeakMap();
class xd {
  constructor(t, e) {
    (this.from = t), (this.text = e);
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(t, e, i) {
    let n = wd.get(t);
    if (!n || n.from >= i || n.to <= e) {
      let n = new xd(e, t.sliceString(e, i));
      return wd.set(t, n), n;
    }
    if (n.from == e && n.to == i) return n;
    let { text: s, from: r } = n;
    return (
      r > e && ((s = t.sliceString(e, r) + s), (r = e)),
      n.to < i && (s += t.sliceString(n.to, i)),
      wd.set(t, new xd(r, s)),
      new xd(e, s.slice(e - r, i - r))
    );
  }
}
class vd {
  constructor(t, e, i, n, s) {
    (this.text = t),
      (this.to = s),
      (this.done = !1),
      (this.value = Qd),
      (this.matchPos = n),
      (this.re = new RegExp(e, bd + ((null == i ? void 0 : i.ignoreCase) ? 'i' : ''))),
      (this.flat = xd.get(t, n, this.chunkEnd(n + 5e3)));
  }
  chunkEnd(t) {
    return t >= this.to ? this.to : this.text.lineAt(t).to;
  }
  next() {
    for (;;) {
      let t = (this.re.lastIndex = this.matchPos - this.flat.from),
        e = this.re.exec(this.flat.text);
      if (
        (e && !e[0] && e.index == t && ((this.re.lastIndex = t + 1), (e = this.re.exec(this.flat.text))),
        e && this.flat.to < this.to && e.index + e[0].length > this.flat.text.length - 10 && (e = null),
        e)
      ) {
        let t = this.flat.from + e.index,
          i = t + e[0].length;
        return (this.value = { from: t, to: i, match: e }), (this.matchPos = i + (t == i ? 1 : 0)), this;
      }
      if (this.flat.to == this.to) return (this.done = !0), this;
      this.flat = xd.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + 2 * this.flat.text.length));
    }
  }
}
'undefined' != typeof Symbol &&
  (yd.prototype[Symbol.iterator] = vd.prototype[Symbol.iterator] =
    function () {
      return this;
    });
const Sd = { highlightWordAroundCursor: !1, minSelectionLength: 1, maxMatches: 100, wholeWords: !1 },
  kd = St.define({
    combine: (t) =>
      fe(t, Sd, { highlightWordAroundCursor: (t, e) => t || e, minSelectionLength: Math.min, maxMatches: Math.min }),
  });
function $d(t) {
  let e = [Wd, Cd];
  return t && e.push(kd.of(t)), e;
}
const Td = Ii.mark({ class: 'cm-selectionMatch' }),
  Pd = Ii.mark({ class: 'cm-selectionMatch cm-selectionMatch-main' });
function Rd(t, e, i, n) {
  return !((0 != i && t(e.sliceDoc(i - 1, i)) == le.Word) || (n != e.doc.length && t(e.sliceDoc(n, n + 1)) == le.Word));
}
const Cd = pn.fromClass(
    class {
      constructor(t) {
        this.decorations = this.getDeco(t);
      }
      update(t) {
        (t.selectionSet || t.docChanged || t.viewportChanged) && (this.decorations = this.getDeco(t.view));
      }
      getDeco(t) {
        let e = t.state.facet(kd),
          { state: i } = t,
          n = i.selection;
        if (n.ranges.length > 1) return Ii.none;
        let s,
          r = n.main,
          o = null;
        if (r.empty) {
          if (!e.highlightWordAroundCursor) return Ii.none;
          let t = i.wordAt(r.head);
          if (!t) return Ii.none;
          (o = i.charCategorizer(r.head)), (s = i.sliceDoc(t.from, t.to));
        } else {
          let t = r.to - r.from;
          if (t < e.minSelectionLength || t > 200) return Ii.none;
          if (e.wholeWords) {
            if (
              ((s = i.sliceDoc(r.from, r.to)),
              (o = i.charCategorizer(r.head)),
              !Rd(o, i, r.from, r.to) ||
                !(function (t, e, i, n) {
                  return t(e.sliceDoc(i, i + 1)) == le.Word && t(e.sliceDoc(n - 1, n)) == le.Word;
                })(o, i, r.from, r.to))
            )
              return Ii.none;
          } else if (((s = i.sliceDoc(r.from, r.to).trim()), !s)) return Ii.none;
        }
        let a = [];
        for (let n of t.visibleRanges) {
          let t = new md(i.doc, s, n.from, n.to);
          for (; !t.next().done; ) {
            let { from: n, to: s } = t.value;
            if (
              (!o || Rd(o, i, n, s)) &&
              (r.empty && n <= r.from && s >= r.to
                ? a.push(Pd.range(n, s))
                : (n >= r.to || s <= r.from) && a.push(Td.range(n, s)),
              a.length > e.maxMatches)
            )
              return Ii.none;
          }
        }
        return Ii.set(a);
      }
    },
    { decorations: (t) => t.decorations },
  ),
  Wd = dr.baseTheme({
    '.cm-selectionMatch': { backgroundColor: '#99ff7780' },
    '.cm-searchMatch .cm-selectionMatch': { backgroundColor: 'transparent' },
  });
const Xd = ({ state: t, dispatch: e }) => {
  let { ranges: i } = t.selection;
  if (i.some((t) => t.from === t.to))
    return (({ state: t, dispatch: e }) => {
      let { selection: i } = t,
        n = wt.create(
          i.ranges.map((e) => t.wordAt(e.head) || wt.cursor(e.head)),
          i.mainIndex,
        );
      return !n.eq(i) && (e(t.update({ selection: n })), !0);
    })({ state: t, dispatch: e });
  let n = t.sliceDoc(i[0].from, i[0].to);
  if (t.selection.ranges.some((e) => t.sliceDoc(e.from, e.to) != n)) return !1;
  let s = (function (t, e) {
    let { main: i, ranges: n } = t.selection,
      s = t.wordAt(i.head),
      r = s && s.from == i.from && s.to == i.to;
    for (let i = !1, s = new md(t.doc, e, n[n.length - 1].to); ; ) {
      if ((s.next(), !s.done)) {
        if (i && n.some((t) => t.from == s.value.from)) continue;
        if (r) {
          let e = t.wordAt(s.value.from);
          if (!e || e.from != s.value.from || e.to != s.value.to) continue;
        }
        return s.value;
      }
      if (i) return null;
      (s = new md(t.doc, e, 0, Math.max(0, n[n.length - 1].from - 1))), (i = !0);
    }
  })(t, n);
  return (
    !!s &&
    (e(t.update({ selection: t.selection.addRange(wt.range(s.from, s.to), !1), effects: dr.scrollIntoView(s.to) })), !0)
  );
};
async function Ad() {
  return Cl.define(
    (
      await import('./legacy.js').then(function (t) {
        return t.c;
      })
    ).clojure,
  );
}
async function Zd() {
  return Cl.define(
    (
      await import('./legacy.js').then(function (t) {
        return t.a;
      })
    ).coffeeScript,
  );
}
function jd() {
  return import('./cpp.js');
}
function Dd() {
  return import('./java.js');
}
function zd() {
  return import('./json.js');
}
function Md() {
  return import('./markdown.js');
}
function _d() {
  return import('./php.js');
}
function qd() {
  return import('./python.js');
}
async function Ed() {
  return Cl.define(
    (
      await import('./legacy.js').then(function (t) {
        return t.s;
      })
    ).shell,
  );
}
async function Gd() {
  return (
    await import('./legacy.js').then(function (t) {
      return t.b;
    })
  ).sCSS;
}
function Vd() {
  return import('./wast.js');
}
function Id() {
  return import('./xml.js');
}
export {
  yh as $,
  jd as A,
  Dd as B,
  QO as C,
  zd as D,
  rO as E,
  Md as F,
  _d as G,
  qd as H,
  Ed as I,
  Gd as J,
  Vd as K,
  bO as L,
  Id as M,
  o as N,
  bh as O,
  R as P,
  cc as Q,
  Jh as R,
  nc as S,
  Ao as T,
  wh as U,
  Lh as V,
  Il as W,
  dc as X,
  Ul as Y,
  Qh as Z,
  pc as _,
  ha as a,
  Br as a$,
  du as a0,
  iu as a1,
  eu as a2,
  Tc as a3,
  Vc as a4,
  Bu as a5,
  Uu as a6,
  Iu as a7,
  Cc as a8,
  Xc as a9,
  ft as aA,
  _t as aB,
  Oe as aC,
  St as aD,
  J as aE,
  ut as aF,
  pe as aG,
  Qe as aH,
  be as aI,
  yt as aJ,
  te as aK,
  Kt as aL,
  Wt as aM,
  I as aN,
  ee as aO,
  Ii as aP,
  Tr as aQ,
  dr as aR,
  go as aS,
  uo as aT,
  Qo as aU,
  Vr as aV,
  ko as aW,
  Co as aX,
  zr as aY,
  Fr as aZ,
  ro as a_,
  pu as aa,
  vu as ab,
  xu as ac,
  Yu as ad,
  gc as ae,
  Rc as af,
  Wc as ag,
  GO as ah,
  pd as ai,
  Uf as aj,
  vl as ak,
  nl as al,
  ua as am,
  al as an,
  tl as ao,
  hl as ap,
  _a as aq,
  Sa as ar,
  Cl as as,
  Pl as at,
  fl as au,
  $d as av,
  Xd as aw,
  Ht as ax,
  Jt as ay,
  Ot as az,
  Ea as b,
  co as b0,
  so as b1,
  Jr as b2,
  pn as b3,
  Sn as b4,
  Gi as b5,
  x as b6,
  qo as b7,
  Ze as b8,
  Ma as c,
  ja as d,
  Ga as e,
  za as f,
  wa as g,
  n as h,
  Ra as i,
  a as j,
  u as k,
  aa as l,
  ca as m,
  wt as n,
  zt as o,
  W as p,
  xr as q,
  oa as r,
  Do as s,
  na as t,
  fd as u,
  xa as v,
  da as w,
  ra as x,
  Ad as y,
  Zd as z,
};

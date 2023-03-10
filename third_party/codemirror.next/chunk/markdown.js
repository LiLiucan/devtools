import {
  N as e,
  h as t,
  s as r,
  t as n,
  j as s,
  P as i,
  T as o,
  k as a,
  p as l,
  l as h,
  m as f,
  n as c,
  g as d,
  o as p,
  q as u,
  r as m,
  u as g,
  v as k,
  w as x,
  b,
  i as L,
  x as S,
} from './codemirror.js';
class C {
  constructor(e, r, n, s, i, o, a) {
    (this.type = e),
      (this.value = r),
      (this.from = n),
      (this.hash = s),
      (this.end = i),
      (this.children = o),
      (this.positions = a),
      (this.hashProp = [[t.contextHash, s]]);
  }
  static create(e, t, r, n, s) {
    return new C(e, t, r, (n + (n << 8) + e + (t << 4)) | 0, s, [], []);
  }
  addChild(e, r) {
    e.prop(t.contextHash) != this.hash && (e = new a(e.type, e.children, e.positions, e.length, this.hashProp)),
      this.children.push(e),
      this.positions.push(r);
  }
  toTree(t, r = this.end) {
    let n = this.children.length - 1;
    return (
      n >= 0 && (r = Math.max(r, this.positions[n] + this.children[n].length + this.from)),
      new a(t.types[this.type], this.children, this.positions, r - this.from).balance({
        makeTree: (t, r, n) => new a(e.none, t, r, n, this.hashProp),
      })
    );
  }
}
var y;
!(function (e) {
  (e[(e.Document = 1)] = 'Document'),
    (e[(e.CodeBlock = 2)] = 'CodeBlock'),
    (e[(e.FencedCode = 3)] = 'FencedCode'),
    (e[(e.Blockquote = 4)] = 'Blockquote'),
    (e[(e.HorizontalRule = 5)] = 'HorizontalRule'),
    (e[(e.BulletList = 6)] = 'BulletList'),
    (e[(e.OrderedList = 7)] = 'OrderedList'),
    (e[(e.ListItem = 8)] = 'ListItem'),
    (e[(e.ATXHeading1 = 9)] = 'ATXHeading1'),
    (e[(e.ATXHeading2 = 10)] = 'ATXHeading2'),
    (e[(e.ATXHeading3 = 11)] = 'ATXHeading3'),
    (e[(e.ATXHeading4 = 12)] = 'ATXHeading4'),
    (e[(e.ATXHeading5 = 13)] = 'ATXHeading5'),
    (e[(e.ATXHeading6 = 14)] = 'ATXHeading6'),
    (e[(e.SetextHeading1 = 15)] = 'SetextHeading1'),
    (e[(e.SetextHeading2 = 16)] = 'SetextHeading2'),
    (e[(e.HTMLBlock = 17)] = 'HTMLBlock'),
    (e[(e.LinkReference = 18)] = 'LinkReference'),
    (e[(e.Paragraph = 19)] = 'Paragraph'),
    (e[(e.CommentBlock = 20)] = 'CommentBlock'),
    (e[(e.ProcessingInstructionBlock = 21)] = 'ProcessingInstructionBlock'),
    (e[(e.Escape = 22)] = 'Escape'),
    (e[(e.Entity = 23)] = 'Entity'),
    (e[(e.HardBreak = 24)] = 'HardBreak'),
    (e[(e.Emphasis = 25)] = 'Emphasis'),
    (e[(e.StrongEmphasis = 26)] = 'StrongEmphasis'),
    (e[(e.Link = 27)] = 'Link'),
    (e[(e.Image = 28)] = 'Image'),
    (e[(e.InlineCode = 29)] = 'InlineCode'),
    (e[(e.HTMLTag = 30)] = 'HTMLTag'),
    (e[(e.Comment = 31)] = 'Comment'),
    (e[(e.ProcessingInstruction = 32)] = 'ProcessingInstruction'),
    (e[(e.URL = 33)] = 'URL'),
    (e[(e.HeaderMark = 34)] = 'HeaderMark'),
    (e[(e.QuoteMark = 35)] = 'QuoteMark'),
    (e[(e.ListMark = 36)] = 'ListMark'),
    (e[(e.LinkMark = 37)] = 'LinkMark'),
    (e[(e.EmphasisMark = 38)] = 'EmphasisMark'),
    (e[(e.CodeMark = 39)] = 'CodeMark'),
    (e[(e.CodeText = 40)] = 'CodeText'),
    (e[(e.CodeInfo = 41)] = 'CodeInfo'),
    (e[(e.LinkTitle = 42)] = 'LinkTitle'),
    (e[(e.LinkLabel = 43)] = 'LinkLabel');
})(y || (y = {}));
class w {
  constructor(e, t) {
    (this.start = e), (this.content = t), (this.marks = []), (this.parsers = []);
  }
}
class A {
  constructor() {
    (this.text = ''),
      (this.baseIndent = 0),
      (this.basePos = 0),
      (this.depth = 0),
      (this.markers = []),
      (this.pos = 0),
      (this.indent = 0),
      (this.next = -1);
  }
  forward() {
    this.basePos > this.pos && this.forwardInner();
  }
  forwardInner() {
    let e = this.skipSpace(this.basePos);
    (this.indent = this.countIndent(e, this.pos, this.indent)),
      (this.pos = e),
      (this.next = e == this.text.length ? -1 : this.text.charCodeAt(e));
  }
  skipSpace(e) {
    return E(this.text, e);
  }
  reset(e) {
    for (
      this.text = e, this.baseIndent = this.basePos = this.pos = this.indent = 0, this.forwardInner(), this.depth = 1;
      this.markers.length;

    )
      this.markers.pop();
  }
  moveBase(e) {
    (this.basePos = e), (this.baseIndent = this.countIndent(e, this.pos, this.indent));
  }
  moveBaseColumn(e) {
    (this.baseIndent = e), (this.basePos = this.findColumn(e));
  }
  addMarker(e) {
    this.markers.push(e);
  }
  countIndent(e, t = 0, r = 0) {
    for (let n = t; n < e; n++) r += 9 == this.text.charCodeAt(n) ? 4 - (r % 4) : 1;
    return r;
  }
  findColumn(e) {
    let t = 0;
    for (let r = 0; t < this.text.length && r < e; t++) r += 9 == this.text.charCodeAt(t) ? 4 - (r % 4) : 1;
    return t;
  }
  scrub() {
    if (!this.baseIndent) return this.text;
    let e = '';
    for (let t = 0; t < this.basePos; t++) e += ' ';
    return e + this.text.slice(this.basePos);
  }
}
function I(e, t, r) {
  if (r.pos == r.text.length || (e != t.block && r.indent >= t.stack[r.depth + 1].value + r.baseIndent)) return !0;
  if (r.indent >= r.baseIndent + 4) return !1;
  let n = (e.type == y.OrderedList ? R : O)(r, t, !1);
  return n > 0 && (e.type != y.BulletList || P(r, t, !1) < 0) && r.text.charCodeAt(r.pos + n - 1) == e.value;
}
const T = {
  [y.Blockquote]: (e, t, r) =>
    62 == r.next &&
    (r.markers.push(fe(y.QuoteMark, t.lineStart + r.pos, t.lineStart + r.pos + 1)),
    r.moveBase(r.pos + (B(r.text.charCodeAt(r.pos + 1)) ? 2 : 1)),
    (e.end = t.lineStart + r.text.length),
    !0),
  [y.ListItem]: (e, t, r) =>
    !(r.indent < r.baseIndent + e.value && r.next > -1) && (r.moveBaseColumn(r.baseIndent + e.value), !0),
  [y.OrderedList]: I,
  [y.BulletList]: I,
  [y.Document]: () => !0,
};
function B(e) {
  return 32 == e || 9 == e || 10 == e || 13 == e;
}
function E(e, t = 0) {
  for (; t < e.length && B(e.charCodeAt(t)); ) t++;
  return t;
}
function H(e, t, r) {
  for (; t > r && B(e.charCodeAt(t - 1)); ) t--;
  return t;
}
function M(e) {
  if (96 != e.next && 126 != e.next) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && e.text.charCodeAt(t) == e.next; ) t++;
  if (t < e.pos + 3) return -1;
  if (96 == e.next) for (let r = t; r < e.text.length; r++) if (96 == e.text.charCodeAt(r)) return -1;
  return t;
}
function v(e) {
  return 62 != e.next ? -1 : 32 == e.text.charCodeAt(e.pos + 1) ? 2 : 1;
}
function P(e, t, r) {
  if (42 != e.next && 45 != e.next && 95 != e.next) return -1;
  let n = 1;
  for (let t = e.pos + 1; t < e.text.length; t++) {
    let r = e.text.charCodeAt(t);
    if (r == e.next) n++;
    else if (!B(r)) return -1;
  }
  return (r && 45 == e.next && z(e) > -1 && e.depth == t.stack.length) || n < 3 ? -1 : 1;
}
function N(e, t) {
  for (let r = e.stack.length - 1; r >= 0; r--) if (e.stack[r].type == t) return !0;
  return !1;
}
function O(e, t, r) {
  return (45 != e.next && 43 != e.next && 42 != e.next) ||
    (e.pos != e.text.length - 1 && !B(e.text.charCodeAt(e.pos + 1))) ||
    !(!r || N(t, y.BulletList) || e.skipSpace(e.pos + 2) < e.text.length)
    ? -1
    : 1;
}
function R(e, t, r) {
  let n = e.pos,
    s = e.next;
  for (; s >= 48 && s <= 57; ) {
    if ((n++, n == e.text.length)) return -1;
    s = e.text.charCodeAt(n);
  }
  return n == e.pos ||
    n > e.pos + 9 ||
    (46 != s && 41 != s) ||
    (n < e.text.length - 1 && !B(e.text.charCodeAt(n + 1))) ||
    (r && !N(t, y.OrderedList) && (e.skipSpace(n + 1) == e.text.length || n > e.pos + 1 || 49 != e.next))
    ? -1
    : n + 1 - e.pos;
}
function X(e) {
  if (35 != e.next) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && 35 == e.text.charCodeAt(t); ) t++;
  if (t < e.text.length && 32 != e.text.charCodeAt(t)) return -1;
  let r = t - e.pos;
  return r > 6 ? -1 : r;
}
function z(e) {
  if ((45 != e.next && 61 != e.next) || e.indent >= e.baseIndent + 4) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && e.text.charCodeAt(t) == e.next; ) t++;
  let r = t;
  for (; t < e.text.length && B(e.text.charCodeAt(t)); ) t++;
  return t == e.text.length ? r : -1;
}
const D = /^[ \t]*$/,
  j = /-->/,
  $ = /\?>/,
  q = [
    [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
    [/^\s*<!--/, j],
    [/^\s*<\?/, $],
    [/^\s*<![A-Z]/, />/],
    [/^\s*<!\[CDATA\[/, /\]\]>/],
    [
      /^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i,
      D,
    ],
    [
      /^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i,
      D,
    ],
  ];
function F(e, t, r) {
  if (60 != e.next) return -1;
  let n = e.text.slice(e.pos);
  for (let e = 0, t = q.length - (r ? 1 : 0); e < t; e++) if (q[e][0].test(n)) return e;
  return -1;
}
function U(e, t) {
  let r = e.countIndent(t, e.pos, e.indent),
    n = e.countIndent(e.skipSpace(t), t, r);
  return n >= r + 5 ? r + 1 : n;
}
function Q(e, t, r) {
  let n = e.length - 1;
  n >= 0 && e[n].to == t && e[n].type == y.CodeText ? (e[n].to = r) : e.push(fe(y.CodeText, t, r));
}
const Z = {
  LinkReference: void 0,
  IndentedCode(e, t) {
    let r = t.baseIndent + 4;
    if (t.indent < r) return !1;
    let n = t.findColumn(r),
      s = e.lineStart + n,
      i = e.lineStart + t.text.length,
      o = [],
      a = [];
    for (Q(o, s, i); e.nextLine() && t.depth >= e.stack.length; )
      if (t.pos == t.text.length) {
        Q(a, e.lineStart - 1, e.lineStart);
        for (let e of t.markers) a.push(e);
      } else {
        if (t.indent < r) break;
        {
          if (a.length) {
            for (let e of a) e.type == y.CodeText ? Q(o, e.from, e.to) : o.push(e);
            a = [];
          }
          Q(o, e.lineStart - 1, e.lineStart);
          for (let e of t.markers) o.push(e);
          i = e.lineStart + t.text.length;
          let r = e.lineStart + t.findColumn(t.baseIndent + 4);
          r < i && Q(o, r, i);
        }
      }
    return (
      a.length && ((a = a.filter((e) => e.type != y.CodeText)), a.length && (t.markers = a.concat(t.markers))),
      e.addNode(e.buffer.writeElements(o, -s).finish(y.CodeBlock, i - s), s),
      !0
    );
  },
  FencedCode(e, t) {
    let r = M(t);
    if (r < 0) return !1;
    let n = e.lineStart + t.pos,
      s = t.next,
      i = r - t.pos,
      o = t.skipSpace(r),
      a = H(t.text, t.text.length, o),
      l = [fe(y.CodeMark, n, n + i)];
    o < a && l.push(fe(y.CodeInfo, e.lineStart + o, e.lineStart + a));
    for (let r = !0; e.nextLine() && t.depth >= e.stack.length; r = !1) {
      let n = t.pos;
      if (t.indent - t.baseIndent < 4) for (; n < t.text.length && t.text.charCodeAt(n) == s; ) n++;
      if (n - t.pos >= i && t.skipSpace(n) == t.text.length) {
        for (let e of t.markers) l.push(e);
        l.push(fe(y.CodeMark, e.lineStart + t.pos, e.lineStart + n)), e.nextLine();
        break;
      }
      {
        r || Q(l, e.lineStart - 1, e.lineStart);
        for (let e of t.markers) l.push(e);
        let n = e.lineStart + t.basePos,
          s = e.lineStart + t.text.length;
        n < s && Q(l, n, s);
      }
    }
    return e.addNode(e.buffer.writeElements(l, -n).finish(y.FencedCode, e.prevLineEnd() - n), n), !0;
  },
  Blockquote(e, t) {
    let r = v(t);
    return (
      !(r < 0) &&
      (e.startContext(y.Blockquote, t.pos),
      e.addNode(y.QuoteMark, e.lineStart + t.pos, e.lineStart + t.pos + 1),
      t.moveBase(t.pos + r),
      null)
    );
  },
  HorizontalRule(e, t) {
    if (P(t, e, !1) < 0) return !1;
    let r = e.lineStart + t.pos;
    return e.nextLine(), e.addNode(y.HorizontalRule, r), !0;
  },
  BulletList(e, t) {
    let r = O(t, e, !1);
    if (r < 0) return !1;
    e.block.type != y.BulletList && e.startContext(y.BulletList, t.basePos, t.next);
    let n = U(t, t.pos + 1);
    return (
      e.startContext(y.ListItem, t.basePos, n - t.baseIndent),
      e.addNode(y.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + r),
      t.moveBaseColumn(n),
      null
    );
  },
  OrderedList(e, t) {
    let r = R(t, e, !1);
    if (r < 0) return !1;
    e.block.type != y.OrderedList && e.startContext(y.OrderedList, t.basePos, t.text.charCodeAt(t.pos + r - 1));
    let n = U(t, t.pos + r);
    return (
      e.startContext(y.ListItem, t.basePos, n - t.baseIndent),
      e.addNode(y.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + r),
      t.moveBaseColumn(n),
      null
    );
  },
  ATXHeading(e, t) {
    let r = X(t);
    if (r < 0) return !1;
    let n = t.pos,
      s = e.lineStart + n,
      i = H(t.text, t.text.length, n),
      o = i;
    for (; o > n && t.text.charCodeAt(o - 1) == t.next; ) o--;
    (o != i && o != n && B(t.text.charCodeAt(o - 1))) || (o = t.text.length);
    let a = e.buffer
      .write(y.HeaderMark, 0, r)
      .writeElements(e.parser.parseInline(t.text.slice(n + r + 1, o), s + r + 1), -s);
    o < t.text.length && a.write(y.HeaderMark, o - n, i - n);
    let l = a.finish(y.ATXHeading1 - 1 + r, t.text.length - n);
    return e.nextLine(), e.addNode(l, s), !0;
  },
  HTMLBlock(e, t) {
    let r = F(t, 0, !1);
    if (r < 0) return !1;
    let n = e.lineStart + t.pos,
      s = q[r][1],
      i = [],
      o = s != D;
    for (; !s.test(t.text) && e.nextLine(); ) {
      if (t.depth < e.stack.length) {
        o = !1;
        break;
      }
      for (let e of t.markers) i.push(e);
    }
    o && e.nextLine();
    let a = s == j ? y.CommentBlock : s == $ ? y.ProcessingInstructionBlock : y.HTMLBlock,
      l = e.prevLineEnd();
    return e.addNode(e.buffer.writeElements(i, -n).finish(a, l - n), n), !0;
  },
  SetextHeading: void 0,
};
class _ {
  constructor(e) {
    (this.stage = 0), (this.elts = []), (this.pos = 0), (this.start = e.start), this.advance(e.content);
  }
  nextLine(e, t, r) {
    if (-1 == this.stage) return !1;
    let n = r.content + '\n' + t.scrub(),
      s = this.advance(n);
    return s > -1 && s < n.length && this.complete(e, r, s);
  }
  finish(e, t) {
    return (
      (2 == this.stage || 3 == this.stage) &&
      E(t.content, this.pos) == t.content.length &&
      this.complete(e, t, t.content.length)
    );
  }
  complete(e, t, r) {
    return e.addLeafElement(t, fe(y.LinkReference, this.start, this.start + r, this.elts)), !0;
  }
  nextStage(e) {
    return e
      ? ((this.pos = e.to - this.start), this.elts.push(e), this.stage++, !0)
      : (!1 === e && (this.stage = -1), !1);
  }
  advance(e) {
    for (;;) {
      if (-1 == this.stage) return -1;
      if (0 == this.stage) {
        if (!this.nextStage(Ce(e, this.pos, this.start, !0))) return -1;
        if (58 != e.charCodeAt(this.pos)) return (this.stage = -1);
        this.elts.push(fe(y.LinkMark, this.pos + this.start, this.pos + this.start + 1)), this.pos++;
      } else {
        if (1 != this.stage) {
          if (2 == this.stage) {
            let t = E(e, this.pos),
              r = 0;
            if (t > this.pos) {
              let n = Se(e, t, this.start);
              if (n) {
                let t = V(e, n.to - this.start);
                t > 0 && (this.nextStage(n), (r = t));
              }
            }
            return r || (r = V(e, this.pos)), r > 0 && r < e.length ? r : -1;
          }
          return V(e, this.pos);
        }
        if (!this.nextStage(Le(e, E(e, this.pos), this.start))) return -1;
      }
    }
  }
}
function V(e, t) {
  for (; t < e.length; t++) {
    let r = e.charCodeAt(t);
    if (10 == r) break;
    if (!B(r)) return -1;
  }
  return t;
}
class G {
  nextLine(e, t, r) {
    let n = t.depth < e.stack.length ? -1 : z(t),
      s = t.next;
    if (n < 0) return !1;
    let i = fe(y.HeaderMark, e.lineStart + t.pos, e.lineStart + n);
    return (
      e.nextLine(),
      e.addLeafElement(
        r,
        fe(61 == s ? y.SetextHeading1 : y.SetextHeading2, r.start, e.prevLineEnd(), [
          ...e.parser.parseInline(r.content, r.start),
          i,
        ]),
      ),
      !0
    );
  }
  finish() {
    return !1;
  }
}
const K = { LinkReference: (e, t) => (91 == t.content.charCodeAt(0) ? new _(t) : null), SetextHeading: () => new G() },
  J = [
    (e, t) => X(t) >= 0,
    (e, t) => M(t) >= 0,
    (e, t) => v(t) >= 0,
    (e, t) => O(t, e, !0) >= 0,
    (e, t) => R(t, e, !0) >= 0,
    (e, t) => P(t, e, !0) >= 0,
    (e, t) => F(t, 0, !0) >= 0,
  ],
  W = { text: '', end: 0 };
class Y {
  constructor(e, t, r, n) {
    (this.parser = e),
      (this.input = t),
      (this.ranges = n),
      (this.line = new A()),
      (this.atEnd = !1),
      (this.dontInject = new Set()),
      (this.stoppedAt = null),
      (this.rangeI = 0),
      (this.to = n[n.length - 1].to),
      (this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = n[0].from),
      (this.block = C.create(y.Document, 0, this.lineStart, 0, 0)),
      (this.stack = [this.block]),
      (this.fragments = r.length ? new Ie(r, t) : null),
      this.readLine();
  }
  get parsedPos() {
    return this.absoluteLineStart;
  }
  advance() {
    if (null != this.stoppedAt && this.absoluteLineStart > this.stoppedAt) return this.finish();
    let { line: e } = this;
    for (;;) {
      for (; e.depth < this.stack.length; ) this.finishContext();
      for (let t of e.markers) this.addNode(t.type, t.from, t.to);
      if (e.pos < e.text.length) break;
      if (!this.nextLine()) return this.finish();
    }
    if (this.fragments && this.reuseFragment(e.basePos)) return null;
    e: for (;;) {
      for (let t of this.parser.blockParsers)
        if (t) {
          let r = t(this, e);
          if (0 != r) {
            if (1 == r) return null;
            e.forward();
            continue e;
          }
        }
      break;
    }
    let t = new w(this.lineStart + e.pos, e.text.slice(e.pos));
    for (let e of this.parser.leafBlockParsers)
      if (e) {
        let r = e(this, t);
        r && t.parsers.push(r);
      }
    e: for (; this.nextLine() && e.pos != e.text.length; ) {
      if (e.indent < e.baseIndent + 4) for (let r of this.parser.endLeafBlock) if (r(this, e, t)) break e;
      for (let r of t.parsers) if (r.nextLine(this, e, t)) return null;
      t.content += '\n' + e.scrub();
      for (let r of e.markers) t.marks.push(r);
    }
    return this.finishLeaf(t), null;
  }
  stopAt(e) {
    if (null != this.stoppedAt && this.stoppedAt < e) throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  reuseFragment(e) {
    if (
      !this.fragments.moveTo(this.absoluteLineStart + e, this.absoluteLineStart) ||
      !this.fragments.matches(this.block.hash)
    )
      return !1;
    let t = this.fragments.takeNodes(this);
    if (!t) return !1;
    let r = t,
      n = this.absoluteLineStart + t;
    for (let e = 1; e < this.ranges.length; e++) {
      let t = this.ranges[e - 1].to,
        s = this.ranges[e].from;
      t >= this.lineStart && s < n && (r -= s - t);
    }
    return (
      (this.lineStart += r),
      (this.absoluteLineStart += t),
      this.moveRangeI(),
      this.absoluteLineStart < this.to
        ? (this.lineStart++, this.absoluteLineStart++, this.readLine())
        : ((this.atEnd = !0), this.readLine()),
      !0
    );
  }
  get depth() {
    return this.stack.length;
  }
  parentType(e = this.depth - 1) {
    return this.parser.nodeSet.types[this.stack[e].type];
  }
  nextLine() {
    return (
      (this.lineStart += this.line.text.length),
      this.absoluteLineEnd >= this.to
        ? ((this.absoluteLineStart = this.absoluteLineEnd), (this.atEnd = !0), this.readLine(), !1)
        : (this.lineStart++,
          (this.absoluteLineStart = this.absoluteLineEnd + 1),
          this.moveRangeI(),
          this.readLine(),
          !0)
    );
  }
  moveRangeI() {
    for (; this.rangeI < this.ranges.length - 1 && this.absoluteLineStart >= this.ranges[this.rangeI].to; )
      this.rangeI++, (this.absoluteLineStart = Math.max(this.absoluteLineStart, this.ranges[this.rangeI].from));
  }
  scanLine(e) {
    let t = W;
    if (((t.end = e), e >= this.to)) t.text = '';
    else if (((t.text = this.lineChunkAt(e)), (t.end += t.text.length), this.ranges.length > 1)) {
      let e = this.absoluteLineStart,
        r = this.rangeI;
      for (; this.ranges[r].to < t.end; ) {
        r++;
        let n = this.ranges[r].from,
          s = this.lineChunkAt(n);
        (t.end = n + s.length), (t.text = t.text.slice(0, this.ranges[r - 1].to - e) + s), (e = t.end - t.text.length);
      }
    }
    return t;
  }
  readLine() {
    let { line: e } = this,
      { text: t, end: r } = this.scanLine(this.absoluteLineStart);
    for (this.absoluteLineEnd = r, e.reset(t); e.depth < this.stack.length; e.depth++) {
      let t = this.stack[e.depth],
        r = this.parser.skipContextMarkup[t.type];
      if (!r) throw new Error('Unhandled block context ' + y[t.type]);
      if (!r(t, this, e)) break;
      e.forward();
    }
  }
  lineChunkAt(e) {
    let t,
      r = this.input.chunk(e);
    if (this.input.lineChunks) t = '\n' == r ? '' : r;
    else {
      let e = r.indexOf('\n');
      t = e < 0 ? r : r.slice(0, e);
    }
    return e + t.length > this.to ? t.slice(0, this.to - e) : t;
  }
  prevLineEnd() {
    return this.atEnd ? this.lineStart : this.lineStart - 1;
  }
  startContext(e, t, r = 0) {
    (this.block = C.create(e, r, this.lineStart + t, this.block.hash, this.lineStart + this.line.text.length)),
      this.stack.push(this.block);
  }
  startComposite(e, t, r = 0) {
    this.startContext(this.parser.getNodeType(e), t, r);
  }
  addNode(e, t, r) {
    'number' == typeof e && (e = new a(this.parser.nodeSet.types[e], oe, oe, (null != r ? r : this.prevLineEnd()) - t)),
      this.block.addChild(e, t - this.block.from);
  }
  addElement(e) {
    this.block.addChild(e.toTree(this.parser.nodeSet), e.from - this.block.from);
  }
  addLeafElement(e, t) {
    this.addNode(this.buffer.writeElements(we(t.children, e.marks), -t.from).finish(t.type, t.to - t.from), t.from);
  }
  finishContext() {
    let e = this.stack.pop(),
      t = this.stack[this.stack.length - 1];
    t.addChild(e.toTree(this.parser.nodeSet), e.from - t.from), (this.block = t);
  }
  finish() {
    for (; this.stack.length > 1; ) this.finishContext();
    return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
  }
  addGaps(e) {
    return this.ranges.length > 1 ? ee(this.ranges, 0, e.topNode, this.ranges[0].from, this.dontInject) : e;
  }
  finishLeaf(e) {
    for (let t of e.parsers) if (t.finish(this, e)) return;
    let t = we(this.parser.parseInline(e.content, e.start), e.marks);
    this.addNode(this.buffer.writeElements(t, -e.start).finish(y.Paragraph, e.content.length), e.start);
  }
  elt(e, t, r, n) {
    return 'string' == typeof e ? fe(this.parser.getNodeType(e), t, r, n) : new he(e, t);
  }
  get buffer() {
    return new ae(this.parser.nodeSet);
  }
}
function ee(e, t, r, n, s) {
  if (s.has(r.tree)) return r.tree;
  let i = e[t].to,
    o = [],
    l = [],
    h = r.from + n;
  function f(r, s) {
    for (; s ? r >= i : r > i; ) {
      let s = e[t + 1].from - i;
      (n += s), (r += s), t++, (i = e[t].to);
    }
  }
  for (let a = r.firstChild; a; a = a.nextSibling) {
    f(a.from + n, !0);
    let r,
      c = a.from + n;
    a.to + n > i ? ((r = ee(e, t, a, n, s)), f(a.to + n, !1)) : (r = a.toTree()), o.push(r), l.push(c - h);
  }
  return f(r.to + n, !1), new a(r.type, o, l, r.to + n - h, r.tree ? r.tree.propValues : void 0);
}
class te extends i {
  constructor(e, t, r, n, s, i, o, a, l) {
    super(),
      (this.nodeSet = e),
      (this.blockParsers = t),
      (this.leafBlockParsers = r),
      (this.blockNames = n),
      (this.endLeafBlock = s),
      (this.skipContextMarkup = i),
      (this.inlineParsers = o),
      (this.inlineNames = a),
      (this.wrappers = l),
      (this.nodeTypes = Object.create(null));
    for (let t of e.types) this.nodeTypes[t.name] = t.id;
  }
  createParse(e, t, r) {
    let n = new Y(this, e, t, r);
    for (let s of this.wrappers) n = s(n, e, t, r);
    return n;
  }
  configure(n) {
    let i = ne(n);
    if (!i) return this;
    let { nodeSet: a, skipContextMarkup: l } = this,
      h = this.blockParsers.slice(),
      f = this.leafBlockParsers.slice(),
      c = this.blockNames.slice(),
      d = this.inlineParsers.slice(),
      p = this.inlineNames.slice(),
      u = this.endLeafBlock.slice(),
      m = this.wrappers;
    if (re(i.defineNodes)) {
      l = Object.assign({}, l);
      let n,
        h = a.types.slice();
      for (let r of i.defineNodes) {
        let { name: s, block: i, composite: a, style: f } = 'string' == typeof r ? { name: r } : r;
        if (h.some((e) => e.name == s)) continue;
        a && (l[h.length] = (e, t, r) => a(t, r, e.value));
        let c = h.length,
          d = a
            ? ['Block', 'BlockContext']
            : i
            ? c >= y.ATXHeading1 && c <= y.SetextHeading2
              ? ['Block', 'LeafBlock', 'Heading']
              : ['Block', 'LeafBlock']
            : void 0;
        h.push(e.define({ id: c, name: s, props: d && [[t.group, d]] })),
          f && (n || (n = {}), Array.isArray(f) || f instanceof o ? (n[s] = f) : Object.assign(n, f));
      }
      (a = new s(h)), n && (a = a.extend(r(n)));
    }
    if ((re(i.props) && (a = a.extend(...i.props)), re(i.remove)))
      for (let e of i.remove) {
        let t = this.blockNames.indexOf(e),
          r = this.inlineNames.indexOf(e);
        t > -1 && (h[t] = f[t] = void 0), r > -1 && (d[r] = void 0);
      }
    if (re(i.parseBlock))
      for (let e of i.parseBlock) {
        let t = c.indexOf(e.name);
        if (t > -1) (h[t] = e.parse), (f[t] = e.leaf);
        else {
          let t = e.before ? se(c, e.before) : e.after ? se(c, e.after) + 1 : c.length - 1;
          h.splice(t, 0, e.parse), f.splice(t, 0, e.leaf), c.splice(t, 0, e.name);
        }
        e.endLeaf && u.push(e.endLeaf);
      }
    if (re(i.parseInline))
      for (let e of i.parseInline) {
        let t = p.indexOf(e.name);
        if (t > -1) d[t] = e.parse;
        else {
          let t = e.before ? se(p, e.before) : e.after ? se(p, e.after) + 1 : p.length - 1;
          d.splice(t, 0, e.parse), p.splice(t, 0, e.name);
        }
      }
    return i.wrap && (m = m.concat(i.wrap)), new te(a, h, f, c, u, l, d, p, m);
  }
  getNodeType(e) {
    let t = this.nodeTypes[e];
    if (null == t) throw new RangeError(`Unknown node type '${e}'`);
    return t;
  }
  parseInline(e, t) {
    let r = new ye(this, e, t);
    e: for (let e = t; e < r.end; ) {
      let t = r.char(e);
      for (let n of this.inlineParsers)
        if (n) {
          let s = n(r, t, e);
          if (s >= 0) {
            e = s;
            continue e;
          }
        }
      e++;
    }
    return r.resolveMarkers(0);
  }
}
function re(e) {
  return null != e && e.length > 0;
}
function ne(e) {
  if (!Array.isArray(e)) return e;
  if (0 == e.length) return null;
  let t = ne(e[0]);
  if (1 == e.length) return t;
  let r = ne(e.slice(1));
  if (!r || !t) return t || r;
  let n = (e, t) => (e || oe).concat(t || oe),
    s = t.wrap,
    i = r.wrap;
  return {
    props: n(t.props, r.props),
    defineNodes: n(t.defineNodes, r.defineNodes),
    parseBlock: n(t.parseBlock, r.parseBlock),
    parseInline: n(t.parseInline, r.parseInline),
    remove: n(t.remove, r.remove),
    wrap: s ? (i ? (e, t, r, n) => s(i(e, t, r, n), t, r, n) : s) : i,
  };
}
function se(e, t) {
  let r = e.indexOf(t);
  if (r < 0) throw new RangeError(`Position specified relative to unknown parser ${t}`);
  return r;
}
let ie = [e.none];
for (let r, n = 1; (r = y[n]); n++)
  ie[n] = e.define({
    id: n,
    name: r,
    props: n >= y.Escape ? [] : [[t.group, n in T ? ['Block', 'BlockContext'] : ['Block', 'LeafBlock']]],
  });
const oe = [];
class ae {
  constructor(e) {
    (this.nodeSet = e), (this.content = []), (this.nodes = []);
  }
  write(e, t, r, n = 0) {
    return this.content.push(e, t, r, 4 + 4 * n), this;
  }
  writeElements(e, t = 0) {
    for (let r of e) r.writeTo(this, t);
    return this;
  }
  finish(e, t) {
    return a.build({ buffer: this.content, nodeSet: this.nodeSet, reused: this.nodes, topID: e, length: t });
  }
}
class le {
  constructor(e, t, r, n = oe) {
    (this.type = e), (this.from = t), (this.to = r), (this.children = n);
  }
  writeTo(e, t) {
    let r = e.content.length;
    e.writeElements(this.children, t), e.content.push(this.type, this.from + t, this.to + t, e.content.length + 4 - r);
  }
  toTree(e) {
    return new ae(e).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
  }
}
class he {
  constructor(e, t) {
    (this.tree = e), (this.from = t);
  }
  get to() {
    return this.from + this.tree.length;
  }
  get type() {
    return this.tree.type.id;
  }
  get children() {
    return oe;
  }
  writeTo(e, t) {
    e.nodes.push(this.tree), e.content.push(e.nodes.length - 1, this.from + t, this.to + t, -1);
  }
  toTree() {
    return this.tree;
  }
}
function fe(e, t, r, n) {
  return new le(e, t, r, n);
}
const ce = { resolve: 'Emphasis', mark: 'EmphasisMark' },
  de = { resolve: 'Emphasis', mark: 'EmphasisMark' },
  pe = {},
  ue = {};
class me {
  constructor(e, t, r, n) {
    (this.type = e), (this.from = t), (this.to = r), (this.side = n);
  }
}
const ge = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
let ke = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
  ke = new RegExp('[\\p{Pc}|\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]', 'u');
} catch (e) {}
const xe = {
  Escape(e, t, r) {
    if (92 != t || r == e.end - 1) return -1;
    let n = e.char(r + 1);
    for (let t = 0; t < ge.length; t++) if (ge.charCodeAt(t) == n) return e.append(fe(y.Escape, r, r + 2));
    return -1;
  },
  Entity(e, t, r) {
    if (38 != t) return -1;
    let n = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(e.slice(r + 1, r + 31));
    return n ? e.append(fe(y.Entity, r, r + 1 + n[0].length)) : -1;
  },
  InlineCode(e, t, r) {
    if (96 != t || (r && 96 == e.char(r - 1))) return -1;
    let n = r + 1;
    for (; n < e.end && 96 == e.char(n); ) n++;
    let s = n - r,
      i = 0;
    for (; n < e.end; n++)
      if (96 == e.char(n)) {
        if ((i++, i == s && 96 != e.char(n + 1)))
          return e.append(fe(y.InlineCode, r, n + 1, [fe(y.CodeMark, r, r + s), fe(y.CodeMark, n + 1 - s, n + 1)]));
      } else i = 0;
    return -1;
  },
  HTMLTag(e, t, r) {
    if (60 != t || r == e.end - 1) return -1;
    let n = e.slice(r + 1, e.end),
      s =
        /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(
          n,
        );
    if (s) return e.append(fe(y.URL, r, r + 1 + s[0].length));
    let i = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(n);
    if (i) return e.append(fe(y.Comment, r, r + 1 + i[0].length));
    let o = /^\?[^]*?\?>/.exec(n);
    if (o) return e.append(fe(y.ProcessingInstruction, r, r + 1 + o[0].length));
    let a =
      /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(
        n,
      );
    return a ? e.append(fe(y.HTMLTag, r, r + 1 + a[0].length)) : -1;
  },
  Emphasis(e, t, r) {
    if (95 != t && 42 != t) return -1;
    let n = r + 1;
    for (; e.char(n) == t; ) n++;
    let s = e.slice(r - 1, r),
      i = e.slice(n, n + 1),
      o = ke.test(s),
      a = ke.test(i),
      l = /\s|^$/.test(s),
      h = /\s|^$/.test(i),
      f = !h && (!a || l || o),
      c = !l && (!o || h || a),
      d = f && (42 == t || !c || o),
      p = c && (42 == t || !f || a);
    return e.append(new me(95 == t ? ce : de, r, n, (d ? 1 : 0) | (p ? 2 : 0)));
  },
  HardBreak(e, t, r) {
    if (92 == t && 10 == e.char(r + 1)) return e.append(fe(y.HardBreak, r, r + 2));
    if (32 == t) {
      let t = r + 1;
      for (; 32 == e.char(t); ) t++;
      if (10 == e.char(t) && t >= r + 2) return e.append(fe(y.HardBreak, r, t + 1));
    }
    return -1;
  },
  Link: (e, t, r) => (91 == t ? e.append(new me(pe, r, r + 1, 1)) : -1),
  Image: (e, t, r) => (33 == t && 91 == e.char(r + 1) ? e.append(new me(ue, r, r + 2, 1)) : -1),
  LinkEnd(e, t, r) {
    if (93 != t) return -1;
    for (let t = e.parts.length - 1; t >= 0; t--) {
      let n = e.parts[t];
      if (n instanceof me && (n.type == pe || n.type == ue)) {
        if (!n.side || (e.skipSpace(n.to) == r && !/[(\[]/.test(e.slice(r + 1, r + 2)))) return (e.parts[t] = null), -1;
        let s = e.takeContent(t),
          i = (e.parts[t] = be(e, s, n.type == pe ? y.Link : y.Image, n.from, r + 1));
        if (n.type == pe)
          for (let r = 0; r < t; r++) {
            let t = e.parts[r];
            t instanceof me && t.type == pe && (t.side = 0);
          }
        return i.to;
      }
    }
    return -1;
  },
};
function be(e, t, r, n, s) {
  let { text: i } = e,
    o = e.char(s),
    a = s;
  if ((t.unshift(fe(y.LinkMark, n, n + (r == y.Image ? 2 : 1))), t.push(fe(y.LinkMark, s - 1, s)), 40 == o)) {
    let r,
      n = e.skipSpace(s + 1),
      o = Le(i, n - e.offset, e.offset);
    o && ((n = e.skipSpace(o.to)), (r = Se(i, n - e.offset, e.offset)), r && (n = e.skipSpace(r.to))),
      41 == e.char(n) &&
        (t.push(fe(y.LinkMark, s, s + 1)), (a = n + 1), o && t.push(o), r && t.push(r), t.push(fe(y.LinkMark, n, a)));
  } else if (91 == o) {
    let r = Ce(i, s - e.offset, e.offset, !1);
    r && (t.push(r), (a = r.to));
  }
  return fe(r, n, a, t);
}
function Le(e, t, r) {
  if (60 == e.charCodeAt(t)) {
    for (let n = t + 1; n < e.length; n++) {
      let s = e.charCodeAt(n);
      if (62 == s) return fe(y.URL, t + r, n + 1 + r);
      if (60 == s || 10 == s) return !1;
    }
    return null;
  }
  {
    let n = 0,
      s = t;
    for (let t = !1; s < e.length; s++) {
      let r = e.charCodeAt(s);
      if (B(r)) break;
      if (t) t = !1;
      else if (40 == r) n++;
      else if (41 == r) {
        if (!n) break;
        n--;
      } else 92 == r && (t = !0);
    }
    return s > t ? fe(y.URL, t + r, s + r) : s == e.length && null;
  }
}
function Se(e, t, r) {
  let n = e.charCodeAt(t);
  if (39 != n && 34 != n && 40 != n) return !1;
  let s = 40 == n ? 41 : n;
  for (let n = t + 1, i = !1; n < e.length; n++) {
    let o = e.charCodeAt(n);
    if (i) i = !1;
    else {
      if (o == s) return fe(y.LinkTitle, t + r, n + 1 + r);
      92 == o && (i = !0);
    }
  }
  return null;
}
function Ce(e, t, r, n) {
  for (let s = !1, i = t + 1, o = Math.min(e.length, i + 999); i < o; i++) {
    let o = e.charCodeAt(i);
    if (s) s = !1;
    else {
      if (93 == o) return !n && fe(y.LinkLabel, t + r, i + 1 + r);
      if ((n && !B(o) && (n = !1), 91 == o)) return !1;
      92 == o && (s = !0);
    }
  }
  return null;
}
class ye {
  constructor(e, t, r) {
    (this.parser = e), (this.text = t), (this.offset = r), (this.parts = []);
  }
  char(e) {
    return e >= this.end ? -1 : this.text.charCodeAt(e - this.offset);
  }
  get end() {
    return this.offset + this.text.length;
  }
  slice(e, t) {
    return this.text.slice(e - this.offset, t - this.offset);
  }
  append(e) {
    return this.parts.push(e), e.to;
  }
  addDelimiter(e, t, r, n, s) {
    return this.append(new me(e, t, r, (n ? 1 : 0) | (s ? 2 : 0)));
  }
  addElement(e) {
    return this.append(e);
  }
  resolveMarkers(e) {
    for (let t = e; t < this.parts.length; t++) {
      let r = this.parts[t];
      if (!(r instanceof me && r.type.resolve && 2 & r.side)) continue;
      let n,
        s = r.type == ce || r.type == de,
        i = r.to - r.from,
        o = t - 1;
      for (; o >= e; o--) {
        let e = this.parts[o];
        if (
          e instanceof me &&
          1 & e.side &&
          e.type == r.type &&
          !(s && (1 & r.side || 2 & e.side) && (e.to - e.from + i) % 3 == 0 && ((e.to - e.from) % 3 || i % 3))
        ) {
          n = e;
          break;
        }
      }
      if (!n) continue;
      let a = r.type.resolve,
        l = [],
        h = n.from,
        f = r.to;
      if (s) {
        let e = Math.min(2, n.to - n.from, i);
        (h = n.to - e), (f = r.from + e), (a = 1 == e ? 'Emphasis' : 'StrongEmphasis');
      }
      n.type.mark && l.push(this.elt(n.type.mark, h, n.to));
      for (let e = o + 1; e < t; e++) this.parts[e] instanceof le && l.push(this.parts[e]), (this.parts[e] = null);
      r.type.mark && l.push(this.elt(r.type.mark, r.from, f));
      let c = this.elt(a, h, f, l);
      (this.parts[o] = s && n.from != h ? new me(n.type, n.from, h, n.side) : null),
        (this.parts[t] = s && r.to != f ? new me(r.type, f, r.to, r.side) : null)
          ? this.parts.splice(t, 0, c)
          : (this.parts[t] = c);
    }
    let t = [];
    for (let r = e; r < this.parts.length; r++) {
      let e = this.parts[r];
      e instanceof le && t.push(e);
    }
    return t;
  }
  findOpeningDelimiter(e) {
    for (let t = this.parts.length - 1; t >= 0; t--) {
      let r = this.parts[t];
      if (r instanceof me && r.type == e) return t;
    }
    return null;
  }
  takeContent(e) {
    let t = this.resolveMarkers(e);
    return (this.parts.length = e), t;
  }
  skipSpace(e) {
    return E(this.text, e - this.offset) + this.offset;
  }
  elt(e, t, r, n) {
    return 'string' == typeof e ? fe(this.parser.getNodeType(e), t, r, n) : new he(e, t);
  }
}
function we(e, t) {
  if (!t.length) return e;
  if (!e.length) return t;
  let r = e.slice(),
    n = 0;
  for (let e of t) {
    for (; n < r.length && r[n].to < e.to; ) n++;
    if (n < r.length && r[n].from < e.from) {
      let t = r[n];
      t instanceof le && (r[n] = new le(t.type, t.from, t.to, we(t.children, [e])));
    } else r.splice(n++, 0, e);
  }
  return r;
}
const Ae = [y.CodeBlock, y.ListItem, y.OrderedList, y.BulletList];
class Ie {
  constructor(e, t) {
    (this.fragments = e),
      (this.input = t),
      (this.i = 0),
      (this.fragment = null),
      (this.fragmentEnd = -1),
      (this.cursor = null),
      e.length && (this.fragment = e[this.i++]);
  }
  nextFragment() {
    (this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null),
      (this.cursor = null),
      (this.fragmentEnd = -1);
  }
  moveTo(e, t) {
    for (; this.fragment && this.fragment.to <= e; ) this.nextFragment();
    if (!this.fragment || this.fragment.from > (e ? e - 1 : 0)) return !1;
    if (this.fragmentEnd < 0) {
      let e = this.fragment.to;
      for (; e > 0 && '\n' != this.input.read(e - 1, e); ) e--;
      this.fragmentEnd = e ? e - 1 : 0;
    }
    let r = this.cursor;
    r || ((r = this.cursor = this.fragment.tree.cursor()), r.firstChild());
    let n = e + this.fragment.offset;
    for (; r.to <= n; ) if (!r.parent()) return !1;
    for (;;) {
      if (r.from >= n) return this.fragment.from <= t;
      if (!r.childAfter(n)) return !1;
    }
  }
  matches(e) {
    let r = this.cursor.tree;
    return r && r.prop(t.contextHash) == e;
  }
  takeNodes(e) {
    let t = this.cursor,
      r = this.fragment.offset,
      n = this.fragmentEnd - (this.fragment.openEnd ? 1 : 0),
      s = e.absoluteLineStart,
      i = s,
      o = e.block.children.length,
      a = i,
      l = o;
    for (;;) {
      if (t.to - r > n) {
        if (t.type.isAnonymous && t.firstChild()) continue;
        break;
      }
      if (
        (e.dontInject.add(t.tree),
        e.addNode(t.tree, t.from - r),
        t.type.is('Block') &&
          (Ae.indexOf(t.type.id) < 0
            ? ((i = t.to - r), (o = e.block.children.length))
            : ((i = a), (o = l), (a = t.to - r), (l = e.block.children.length))),
        !t.nextSibling())
      )
        break;
    }
    for (; e.block.children.length > o; ) e.block.children.pop(), e.block.positions.pop();
    return i - s;
  }
}
const Te = r({
    'Blockquote/...': n.quote,
    HorizontalRule: n.contentSeparator,
    'ATXHeading1/... SetextHeading1/...': n.heading1,
    'ATXHeading2/... SetextHeading2/...': n.heading2,
    'ATXHeading3/...': n.heading3,
    'ATXHeading4/...': n.heading4,
    'ATXHeading5/...': n.heading5,
    'ATXHeading6/...': n.heading6,
    'Comment CommentBlock': n.comment,
    Escape: n.escape,
    Entity: n.character,
    'Emphasis/...': n.emphasis,
    'StrongEmphasis/...': n.strong,
    'Link/... Image/...': n.link,
    'OrderedList/... BulletList/...': n.list,
    'BlockQuote/...': n.quote,
    'InlineCode CodeText': n.monospace,
    URL: n.url,
    'HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark': n.processingInstruction,
    'CodeInfo LinkLabel': n.labelName,
    LinkTitle: n.string,
    Paragraph: n.content,
  }),
  Be = new te(
    new s(ie).extend(Te),
    Object.keys(Z).map((e) => Z[e]),
    Object.keys(Z).map((e) => K[e]),
    Object.keys(Z),
    J,
    T,
    Object.keys(xe).map((e) => xe[e]),
    Object.keys(xe),
    [],
  );
function Ee(e, t, r) {
  let n = [];
  for (let s = e.firstChild, i = t; ; s = s.nextSibling) {
    let e = s ? s.from : r;
    if ((e > i && n.push({ from: i, to: e }), !s)) break;
    i = s.to;
  }
  return n;
}
const He = { resolve: 'Strikethrough', mark: 'StrikethroughMark' },
  Me = {
    defineNodes: [
      { name: 'Strikethrough', style: { 'Strikethrough/...': n.strikethrough } },
      { name: 'StrikethroughMark', style: n.processingInstruction },
    ],
    parseInline: [
      {
        name: 'Strikethrough',
        parse(e, t, r) {
          if (126 != t || 126 != e.char(r + 1) || 126 == e.char(r + 2)) return -1;
          let n = e.slice(r - 1, r),
            s = e.slice(r + 2, r + 3),
            i = /\s|^$/.test(n),
            o = /\s|^$/.test(s),
            a = ke.test(n),
            l = ke.test(s);
          return e.addDelimiter(He, r, r + 2, !o && (!l || i || a), !i && (!a || o || l));
        },
        after: 'Emphasis',
      },
    ],
  };
function ve(e, t, r = 0, n, s = 0) {
  let i = 0,
    o = !0,
    a = -1,
    l = -1,
    h = !1,
    f = () => {
      n.push(e.elt('TableCell', s + a, s + l, e.parser.parseInline(t.slice(a, l), s + a)));
    };
  for (let c = r; c < t.length; c++) {
    let r = t.charCodeAt(c);
    124 != r || h
      ? (h || (32 != r && 9 != r)) && (a < 0 && (a = c), (l = c + 1))
      : ((!o || a > -1) && i++,
        (o = !1),
        n && (a > -1 && f(), n.push(e.elt('TableDelimiter', c + s, c + s + 1))),
        (a = l = -1)),
      (h = !h && 92 == r);
  }
  return a > -1 && (i++, n && f()), i;
}
function Pe(e, t) {
  for (let r = t; r < e.length; r++) {
    let t = e.charCodeAt(r);
    if (124 == t) return !0;
    92 == t && r++;
  }
  return !1;
}
const Ne = /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/;
class Oe {
  constructor() {
    this.rows = null;
  }
  nextLine(e, t, r) {
    if (null == this.rows) {
      let n;
      if (((this.rows = !1), (45 == t.next || 58 == t.next || 124 == t.next) && Ne.test((n = t.text.slice(t.pos))))) {
        let s = [];
        ve(e, r.content, 0, s, r.start) == ve(e, n, t.pos) &&
          (this.rows = [
            e.elt('TableHeader', r.start, r.start + r.content.length, s),
            e.elt('TableDelimiter', e.lineStart + t.pos, e.lineStart + t.text.length),
          ]);
      }
    } else if (this.rows) {
      let r = [];
      ve(e, t.text, t.pos, r, e.lineStart),
        this.rows.push(e.elt('TableRow', e.lineStart + t.pos, e.lineStart + t.text.length, r));
    }
    return !1;
  }
  finish(e, t) {
    return !!this.rows && (e.addLeafElement(t, e.elt('Table', t.start, t.start + t.content.length, this.rows)), !0);
  }
}
const Re = {
  defineNodes: [
    { name: 'Table', block: !0 },
    { name: 'TableHeader', style: { 'TableHeader/...': n.heading } },
    'TableRow',
    { name: 'TableCell', style: n.content },
    { name: 'TableDelimiter', style: n.processingInstruction },
  ],
  parseBlock: [
    {
      name: 'Table',
      leaf: (e, t) => (Pe(t.content, 0) ? new Oe() : null),
      endLeaf(e, t, r) {
        if (r.parsers.some((e) => e instanceof Oe) || !Pe(t.text, t.basePos)) return !1;
        let n = e.scanLine(e.absoluteLineEnd + 1).text;
        return Ne.test(n) && ve(e, t.text, t.basePos) == ve(e, n, t.basePos);
      },
      before: 'SetextHeading',
    },
  ],
};
class Xe {
  nextLine() {
    return !1;
  }
  finish(e, t) {
    return (
      e.addLeafElement(
        t,
        e.elt('Task', t.start, t.start + t.content.length, [
          e.elt('TaskMarker', t.start, t.start + 3),
          ...e.parser.parseInline(t.content.slice(3), t.start + 3),
        ]),
      ),
      !0
    );
  }
}
const ze = [
  Re,
  {
    defineNodes: [
      { name: 'Task', block: !0, style: n.list },
      { name: 'TaskMarker', style: n.atom },
    ],
    parseBlock: [
      {
        name: 'TaskList',
        leaf: (e, t) => (/^\[[ xX]\]/.test(t.content) && 'ListItem' == e.parentType().name ? new Xe() : null),
        after: 'SetextHeading',
      },
    ],
  },
  Me,
];
function De(e, t, r) {
  return (n, s, i) => {
    if (s != e || n.char(i + 1) == e) return -1;
    let o = [n.elt(r, i, i + 1)];
    for (let s = i + 1; s < n.end; s++) {
      let a = n.char(s);
      if (a == e) return n.addElement(n.elt(t, i, s + 1, o.concat(n.elt(r, s, s + 1))));
      if ((92 == a && o.push(n.elt('Escape', s, 2 + s++)), B(a))) break;
    }
    return -1;
  };
}
const je = {
    defineNodes: [
      { name: 'Superscript', style: n.special(n.content) },
      { name: 'SuperscriptMark', style: n.processingInstruction },
    ],
    parseInline: [{ name: 'Superscript', parse: De(94, 'Superscript', 'SuperscriptMark') }],
  },
  $e = {
    defineNodes: [
      { name: 'Subscript', style: n.special(n.content) },
      { name: 'SubscriptMark', style: n.processingInstruction },
    ],
    parseInline: [{ name: 'Subscript', parse: De(126, 'Subscript', 'SubscriptMark') }],
  },
  qe = {
    defineNodes: [{ name: 'Emoji', style: n.character }],
    parseInline: [
      {
        name: 'Emoji',
        parse(e, t, r) {
          let n;
          return 58 == t && (n = /^[a-zA-Z_0-9]+:/.exec(e.slice(r + 1, e.end)))
            ? e.addElement(e.elt('Emoji', r, r + 1 + n[0].length))
            : -1;
        },
      },
    ],
  },
  Fe = m({ block: { open: '\x3c!--', close: '--\x3e' } }),
  Ue = Be.configure({
    props: [
      b.add((e) => {
        if (e.is('Block') && !e.is('Document')) return (e, t) => ({ from: t.doc.lineAt(e.from).to, to: e.to });
      }),
      L.add({ Document: () => null }),
      S.add({ Document: Fe }),
    ],
  });
function Qe(e) {
  return new h(Fe, e);
}
const Ze = Qe(Ue),
  _e = Qe(Ue.configure([ze, $e, je, qe]));
function Ve(e, t) {
  return t.sliceString(e.from, e.from + 50);
}
class Ge {
  constructor(e, t, r, n, s, i, o) {
    (this.node = e),
      (this.from = t),
      (this.to = r),
      (this.spaceBefore = n),
      (this.spaceAfter = s),
      (this.type = i),
      (this.item = o);
  }
  blank(e = !0) {
    let t = this.spaceBefore;
    if ('Blockquote' == this.node.name) t += '>';
    else for (let e = this.to - this.from - t.length - this.spaceAfter.length; e > 0; e--) t += ' ';
    return t + (e ? this.spaceAfter : '');
  }
  marker(e, t) {
    let r = 'OrderedList' == this.node.name ? String(+Je(this.item, e)[2] + t) : '';
    return this.spaceBefore + r + this.type + this.spaceAfter;
  }
}
function Ke(e, t, r) {
  let n = [];
  for (let t = e; t && 'Document' != t.name; t = t.parent)
    ('ListItem' != t.name && 'Blockquote' != t.name) || n.push(t);
  let s = [],
    i = 0;
  for (let e = n.length - 1; e >= 0; e--) {
    let o,
      a = n[e],
      l = i;
    if ('Blockquote' == a.name && (o = /^[ \t]*>( ?)/.exec(t.slice(i))))
      (i += o[0].length), s.push(new Ge(a, l, i, '', o[1], '>', null));
    else if (
      'ListItem' == a.name &&
      'OrderedList' == a.parent.name &&
      (o = /^([ \t]*)\d+([.)])([ \t]*)/.exec(Ve(a, r)))
    ) {
      let e = o[3],
        t = o[0].length;
      e.length >= 4 && ((e = e.slice(0, e.length - 4)), (t -= 4)),
        (i += t),
        s.push(new Ge(a.parent, l, i, o[1], e, o[2], a));
    } else if (
      'ListItem' == a.name &&
      'BulletList' == a.parent.name &&
      (o = /^([ \t]*)([-+*])([ \t]{1,4}\[[ xX]\])?([ \t]+)/.exec(Ve(a, r)))
    ) {
      let e = o[4],
        t = o[0].length;
      e.length > 4 && ((e = e.slice(0, e.length - 4)), (t -= 4));
      let r = o[2];
      o[3] && (r += o[3].replace(/[xX]/, ' ')), (i += t), s.push(new Ge(a.parent, l, i, o[1], e, r, a));
    }
  }
  return s;
}
function Je(e, t) {
  return /^(\s*)(\d+)(?=[.)])/.exec(t.sliceString(e.from, e.from + 10));
}
function We(e, t, r, n = 0) {
  for (let s = -1, i = e; ; ) {
    if ('ListItem' == i.name) {
      let e = Je(i, t),
        o = +e[2];
      if (s >= 0) {
        if (o != s + 1) return;
        r.push({ from: i.from + e[1].length, to: i.from + e[0].length, insert: String(s + 2 + n) });
      }
      s = o;
    }
    let e = i.nextSibling;
    if (!e) break;
    i = e;
  }
}
const Ye = ({ state: e, dispatch: t }) => {
  let r = f(e),
    { doc: n } = e,
    s = null,
    i = e.changeByRange((t) => {
      if (!t.empty || !_e.isActiveAt(e, t.from)) return (s = { range: t });
      let i = t.from,
        o = n.lineAt(i),
        a = Ke(r.resolveInner(i, -1), o.text, n);
      for (; a.length && a[a.length - 1].from > i - o.from; ) a.pop();
      if (!a.length) return (s = { range: t });
      let l = a[a.length - 1];
      if (l.to - l.spaceAfter.length > i - o.from) return (s = { range: t });
      let h = i >= l.to - l.spaceAfter.length && !/\S/.test(o.text.slice(l.to));
      if (l.item && h) {
        if (l.node.firstChild.to >= i || (o.from > 0 && !/[^\s>]/.test(n.lineAt(o.from - 1).text))) {
          let e,
            t = a.length > 1 ? a[a.length - 2] : null,
            r = '';
          t && t.item ? ((e = o.from + t.from), (r = t.marker(n, 1))) : (e = o.from + (t ? t.to : 0));
          let s = [{ from: e, to: i, insert: r }];
          return (
            'OrderedList' == l.node.name && We(l.item, n, s, -2),
            t && 'OrderedList' == t.node.name && We(t.item, n, s),
            { range: c.cursor(e + r.length), changes: s }
          );
        }
        {
          let t = '';
          for (let e = 0, r = a.length - 2; e <= r; e++) t += a[e].blank(e < r);
          return (t += e.lineBreak), { range: c.cursor(i + t.length), changes: { from: o.from, insert: t } };
        }
      }
      if ('Blockquote' == l.node.name && h && o.from) {
        let r = n.lineAt(o.from - 1),
          s = />\s*$/.exec(r.text);
        if (s && s.index == l.from) {
          let n = e.changes([
            { from: r.from + s.index, to: r.to },
            { from: o.from + l.from, to: o.to },
          ]);
          return { range: t.map(n), changes: n };
        }
      }
      let f = [];
      'OrderedList' == l.node.name && We(l.item, n, f);
      let d = e.lineBreak,
        p = l.item && l.item.from < o.from;
      if (!p || /^[\s\d.)\-+*>]*/.exec(o.text)[0].length >= l.to)
        for (let e = 0, t = a.length - 1; e <= t; e++) d += e != t || p ? a[e].blank() : a[e].marker(n, 1);
      let u = i;
      for (; u > o.from && /\s/.test(o.text.charAt(u - o.from - 1)); ) u--;
      return f.push({ from: u, to: i, insert: d }), { range: c.cursor(u + d.length), changes: f };
    });
  return !s && (t(e.update(i, { scrollIntoView: !0, userEvent: 'input' })), !0);
};
function et(e) {
  return 'QuoteMark' == e.name || 'ListMark' == e.name;
}
const tt = ({ state: e, dispatch: t }) => {
    let r = f(e),
      n = null,
      s = e.changeByRange((t) => {
        let s = t.from,
          { doc: i } = e;
        if (t.empty && _e.isActiveAt(e, t.from)) {
          let e = i.lineAt(s),
            n = Ke(
              (function (e, t) {
                let r,
                  n = e.resolveInner(t, -1),
                  s = t;
                for (et(n) && ((s = n.from), (n = n.parent)); (r = n.childBefore(s)); )
                  if (et(r)) s = r.from;
                  else {
                    if ('OrderedList' != r.name && 'BulletList' != r.name) break;
                    (n = r.lastChild), (s = n.to);
                  }
                return n;
              })(r, s),
              e.text,
              i,
            );
          if (n.length) {
            let r = n[n.length - 1],
              i = r.to - r.spaceAfter.length + (r.spaceAfter ? 1 : 0);
            if (s - e.from > i && !/\S/.test(e.text.slice(i, s - e.from)))
              return { range: c.cursor(e.from + i), changes: { from: e.from + i, to: s } };
            if (s - e.from == i) {
              let n = e.from + r.from;
              if (r.item && r.node.from < r.item.from && /\S/.test(e.text.slice(r.from, r.to)))
                return { range: t, changes: { from: n, to: e.from + r.to, insert: r.blank() } };
              if (n < s) return { range: c.cursor(n), changes: { from: n, to: s } };
            }
          }
        }
        return (n = { range: t });
      });
    return !n && (t(e.update(s, { scrollIntoView: !0, userEvent: 'delete' })), !0);
  },
  rt = [
    { key: 'Enter', run: Ye },
    { key: 'Backspace', run: tt },
  ],
  nt = g({ matchClosingTags: !1 });
function st(e = {}) {
  let { codeLanguages: t, defaultCodeLanguage: r, addKeymap: n = !0, base: { parser: s } = Ze } = e;
  if (!(s instanceof te)) throw new RangeError('Base parser provided to `markdown` should be a Markdown parser');
  let i,
    o = e.extensions ? [e.extensions] : [],
    a = [nt.support];
  r instanceof d ? (a.push(r.support), (i = r.language)) : r && (i = r);
  let h =
    t || i
      ? ((f = t),
        (c = i),
        (e) => {
          if (e && f) {
            let t = null;
            if (
              ((e = /\S*/.exec(e)[0]),
              (t = 'function' == typeof f ? f(e) : k.matchLanguageName(f, e, !0)),
              t instanceof k)
            )
              return t.support ? t.support.language.parser : x.getSkippingParser(t.load());
            if (t) return t.parser;
          }
          return c ? c.parser : null;
        })
      : void 0;
  var f, c;
  return (
    o.push(
      (function (e) {
        let { codeParser: t, htmlParser: r } = e,
          n = l((e, n) => {
            let s = e.type.id;
            if (!t || (s != y.CodeBlock && s != y.FencedCode)) {
              if (r && (s == y.HTMLBlock || s == y.HTMLTag)) return { parser: r, overlay: Ee(e.node, e.from, e.to) };
            } else {
              let r = '';
              if (s == y.FencedCode) {
                let t = e.node.getChild(y.CodeInfo);
                t && (r = n.read(t.from, t.to));
              }
              let i = t(r);
              if (i) return { parser: i, overlay: (e) => e.type.id == y.CodeText };
            }
            return null;
          });
        return { wrap: n };
      })({ codeParser: h, htmlParser: nt.language.parser }),
    ),
    n && a.push(p.high(u.of(rt))),
    new d(Qe(s.configure(o)), a)
  );
}
export {
  Ze as commonmarkLanguage,
  tt as deleteMarkupBackward,
  Ye as insertNewlineContinueMarkup,
  st as markdown,
  rt as markdownKeymap,
  _e as markdownLanguage,
};

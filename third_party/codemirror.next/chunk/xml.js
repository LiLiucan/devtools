import { C as e, E as t, s as O, t as r, L as n, a, i as o, b as s, g as l, m as d } from './codemirror.js';
function i(e) {
  return 45 == e || 46 == e || 58 == e || (e >= 65 && e <= 90) || 95 == e || (e >= 97 && e <= 122) || e >= 161;
}
let c = null,
  $ = null,
  p = 0;
function u(e, t) {
  let O = e.pos + t;
  if ($ == e && p == O) return c;
  for (; 9 == (r = e.peek(t)) || 10 == r || 13 == r || 32 == r; ) t++;
  var r;
  let n = '';
  for (;;) {
    let O = e.peek(t);
    if (!i(O)) break;
    (n += String.fromCharCode(O)), t++;
  }
  return ($ = e), (p = O), (c = n || null);
}
function m(e, t) {
  (this.name = e), (this.parent = t), (this.hash = t ? t.hash : 0);
  for (let t = 0; t < e.length; t++) this.hash += (this.hash << 4) + e.charCodeAt(t) + (e.charCodeAt(t) << 8);
}
const k = new e({
    start: null,
    shift: (e, t, O, r) => (1 == t ? new m(u(r, 1) || '', e) : e),
    reduce: (e, t) => (11 == t && e ? e.parent : e),
    reuse(e, t, O, r) {
      let n = t.type.id;
      return 1 == n || 13 == n ? new m(u(r, 1) || '', e) : e;
    },
    hash: (e) => (e ? e.hash : 0),
    strict: !1,
  }),
  f = new t(
    (e, t) => {
      if (60 == e.next)
        if ((e.advance(), 47 == e.next)) {
          e.advance();
          let O = u(e, 0);
          if (!O) return e.acceptToken(5);
          if (t.context && O == t.context.name) return e.acceptToken(2);
          for (let r = t.context; r; r = r.parent) if (r.name == O) return e.acceptToken(3, -2);
          e.acceptToken(4);
        } else if (33 != e.next && 63 != e.next) return e.acceptToken(1);
    },
    { contextual: !0 },
  );
function g(e, O) {
  return new t((t) => {
    for (let r = 0, n = 0; ; n++) {
      if (t.next < 0) {
        n && t.acceptToken(e);
        break;
      }
      if (t.next == O.charCodeAt(r)) {
        if ((r++, r == O.length)) {
          n > O.length && t.acceptToken(e, 1 - O.length);
          break;
        }
      } else r = t.next == O.charCodeAt(0) ? 1 : 0;
      t.advance();
    }
  });
}
const T = g(35, '--\x3e'),
  h = g(36, '?>'),
  P = g(37, ']]>'),
  v = O({
    Text: r.content,
    'StartTag StartCloseTag EndTag SelfCloseEndTag': r.angleBracket,
    TagName: r.tagName,
    'MismatchedCloseTag/Tagname': [r.tagName, r.invalid],
    AttributeName: r.attributeName,
    AttributeValue: r.attributeValue,
    Is: r.definitionOperator,
    'EntityReference CharacterReference': r.character,
    Comment: r.blockComment,
    ProcessingInst: r.processingInstruction,
    DoctypeDecl: r.documentMeta,
    Cdata: r.special(r.string),
  }),
  b = n.deserialize({
    version: 14,
    states:
      ",SOQOaOOOrOxO'#CfOzOpO'#CiO!tOaO'#CgOOOP'#Cg'#CgO!{OrO'#CrO#TOtO'#CsO#]OpO'#CtOOOP'#DS'#DSOOOP'#Cv'#CvQQOaOOOOOW'#Cw'#CwO#eOxO,59QOOOP,59Q,59QOOOO'#Cx'#CxO#mOpO,59TO#uO!bO,59TOOOP'#C{'#C{O$TOaO,59RO$[OpO'#CoOOOP,59R,59ROOOQ'#C|'#C|O$dOrO,59^OOOP,59^,59^OOOS'#C}'#C}O$lOtO,59_OOOP,59_,59_O$tOpO,59`O$|OpO,59`OOOP-E6t-E6tOOOW-E6u-E6uOOOP1G.l1G.lOOOO-E6v-E6vO%UO!bO1G.oO%UO!bO1G.oO%dOpO'#CkO%lO!bO'#CyO%zO!bO1G.oOOOP1G.o1G.oOOOP1G.w1G.wOOOP-E6y-E6yOOOP1G.m1G.mO&VOpO,59ZO&_OpO,59ZOOOQ-E6z-E6zOOOP1G.x1G.xOOOS-E6{-E6{OOOP1G.y1G.yO&gOpO1G.zO&gOpO1G.zOOOP1G.z1G.zO&oO!bO7+$ZO&}O!bO7+$ZOOOP7+$Z7+$ZOOOP7+$c7+$cO'YOpO,59VO'bOpO,59VO'jO!bO,59eOOOO-E6w-E6wO'xOpO1G.uO'xOpO1G.uOOOP1G.u1G.uO(QOpO7+$fOOOP7+$f7+$fO(YO!bO<<GuOOOP<<Gu<<GuOOOP<<G}<<G}O'bOpO1G.qO'bOpO1G.qO(eO#tO'#CnOOOO1G.q1G.qO(sOpO7+$aOOOP7+$a7+$aOOOP<<HQ<<HQOOOPAN=aAN=aOOOPAN=iAN=iO'bOpO7+$]OOOO7+$]7+$]OOOO'#Cz'#CzO({O#tO,59YOOOO,59Y,59YOOOP<<G{<<G{OOOO<<Gw<<GwOOOO-E6x-E6xOOOO1G.t1G.t",
    stateData:
      ')Z~OPQOSVOTWOVWOWWOXWOiXOxPO}TO!PUO~OuZOw]O~O^`Oy^O~OPQOQcOSVOTWOVWOWWOXWOxPO}TO!PUO~ORdO~P!SOseO|gO~OthO!OjO~O^lOy^O~OuZOwoO~O^qOy^O~O[vO`sOdwOy^O~ORyO~P!SO^{Oy^O~OseO|}O~OthO!O!PO~O^!QOy^O~O[!SOy^O~O[!VO`sOd!WOy^O~Oa!YOy^O~Oy^O[mX`mXdmX~O[!VO`sOd!WO~O^!]Oy^O~O[!_Oy^O~O[!aOy^O~O[!cO`sOd!dOy^O~O[!cO`sOd!dO~Oa!eOy^O~Oy^Oz!gO~Oy^O[ma`madma~O[!jOy^O~O[!kOy^O~O[!lO`sOd!mO~OW!pOX!pOz!rO{!pO~O[!sOy^O~OW!pOX!pOz!vO{!pO~O',
    goto: '%[wPPPPPPPPPPxxP!OP!UPP!_!iP!oxxxP!u!{#R$Z$j$p$v$|PPPP%SXWORYbXRORYb_t`qru!T!U!bQ!h!YS!o!e!fR!t!nQdRRybXSORYbQYORmYQ[PRn[Q_QQkVjp_krz!R!T!X!Z!^!`!f!i!nQr`QzcQ!RlQ!TqQ!XsQ!ZtQ!^{Q!`!QQ!f!YQ!i!]R!n!eQu`S!UqrU![u!U!bR!b!TQ!q!gR!u!qQbRRxbQfTR|fQiUR!OiSXOYTaRb',
    nodeNames:
      '⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl',
    maxTerm: 47,
    context: k,
    nodeProps: [
      ['closedBy', 1, 'SelfCloseEndTag EndTag', 13, 'CloseTag MissingCloseTag'],
      ['openedBy', 12, 'StartTag StartCloseTag', 19, 'OpenTag', 20, 'StartTag'],
    ],
    propSources: [v],
    skippedNodes: [0],
    repeatNodeCount: 8,
    tokenData:
      "Az~R!WOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs&tsv$kvw'Uw}$k}!O(q!O!P$k!P!Q*n!Q![$k![!]+z!]!^$k!^!_/s!_!`=i!`!a>U!a!b>q!b!c$k!c!}+z!}#P$k#P#Q?}#Q#R$k#R#S+z#S#T$k#T#o+z#o%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U$k4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:j/S;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$kX$rUVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$kP%ZRVPOv%Uw!^%U!_~%UW%iR{WOr%dsv%dw~%d_%{]VP{WyUOX$kXY%rYZ%rZ]$k]^%r^p$kpq%rqr$krs%Usv$kw!^$k!^!_%d!_~$kZ&{RzYVPOv%Uw!^%U!_~%U~'XTOp'hqs'hst(Pt!]'h!^~'h~'kTOp'hqs'ht!]'h!]!^'z!^~'h~(POW~~(SROp(]q!](]!^~(]~(`SOp(]q!](]!]!^(l!^~(]~(qOX~Z(xWVP{WOr$krs%Usv$kw}$k}!O)b!O!^$k!^!_%d!_~$kZ)iWVP{WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a*R!a~$kZ*[U|QVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$k]*uWVP{WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a+_!a~$k]+hUdSVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$k_,V}`S^QVP{WOr$krs%Usv$kw}$k}!O+z!O!P+z!P!Q$k!Q![+z![!]+z!]!^$k!^!_%d!_!c$k!c!}+z!}#R$k#R#S+z#S#T$k#T#o+z#o$}$k$}%O+z%O%W$k%W%o+z%o%p$k%p&a+z&a&b$k&b1p+z1p4U+z4U4d+z4d4e$k4e$IS+z$IS$I`$k$I`$Ib+z$Ib$Je$k$Je$Jg+z$Jg$Kh$k$Kh%#t+z%#t&/x$k&/x&Et+z&Et&FV$k&FV;'S+z;'S;:j/S;:j?&r$k?&r?Ah+z?Ah?BY$k?BY?Mn+z?Mn~$k_/ZWVP{WOr$krs%Usv$kw!^$k!^!_%d!_;=`$k;=`<%l+z<%l~$kX/xU{WOq%dqr0[sv%dw!a%d!a!b=X!b~%dX0aZ{WOr%dsv%dw}%d}!O1S!O!f%d!f!g1x!g!}%d!}#O5s#O#W%d#W#X:k#X~%dX1XT{WOr%dsv%dw}%d}!O1h!O~%dX1oR}P{WOr%dsv%dw~%dX1}T{WOr%dsv%dw!q%d!q!r2^!r~%dX2cT{WOr%dsv%dw!e%d!e!f2r!f~%dX2wT{WOr%dsv%dw!v%d!v!w3W!w~%dX3]T{WOr%dsv%dw!{%d!{!|3l!|~%dX3qT{WOr%dsv%dw!r%d!r!s4Q!s~%dX4VT{WOr%dsv%dw!g%d!g!h4f!h~%dX4kV{WOr4frs5Qsv4fvw5Qw!`4f!`!a5c!a~4fP5TRO!`5Q!`!a5^!a~5QP5cOiPX5jRiP{WOr%dsv%dw~%dX5xV{WOr%dsv%dw!e%d!e!f6_!f#V%d#V#W8w#W~%dX6dT{WOr%dsv%dw!f%d!f!g6s!g~%dX6xT{WOr%dsv%dw!c%d!c!d7X!d~%dX7^T{WOr%dsv%dw!v%d!v!w7m!w~%dX7rT{WOr%dsv%dw!c%d!c!d8R!d~%dX8WT{WOr%dsv%dw!}%d!}#O8g#O~%dX8nR{WxPOr%dsv%dw~%dX8|T{WOr%dsv%dw#W%d#W#X9]#X~%dX9bT{WOr%dsv%dw#T%d#T#U9q#U~%dX9vT{WOr%dsv%dw#h%d#h#i:V#i~%dX:[T{WOr%dsv%dw#T%d#T#U8R#U~%dX:pT{WOr%dsv%dw#c%d#c#d;P#d~%dX;UT{WOr%dsv%dw#V%d#V#W;e#W~%dX;jT{WOr%dsv%dw#h%d#h#i;y#i~%dX<OT{WOr%dsv%dw#m%d#m#n<_#n~%dX<dT{WOr%dsv%dw#d%d#d#e<s#e~%dX<xT{WOr%dsv%dw#X%d#X#Y4f#Y~%dX=`R!PP{WOr%dsv%dw~%dZ=rUaQVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$k_>_U[UVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$kZ>xWVP{WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!a?b!a~$kZ?kU!OQVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$kZ@UWVP{WOr$krs%Usv$kw!^$k!^!_%d!_#P$k#P#Q@n#Q~$kZ@uWVP{WOr$krs%Usv$kw!^$k!^!_%d!_!`$k!`!aA_!a~$kZAhUwQVP{WOr$krs%Usv$kw!^$k!^!_%d!_~$k",
    tokenizers: [f, T, h, P, 0, 1, 2, 3],
    topRules: { Document: [0, 6] },
    tokenPrec: 0,
  });
function W(e, t) {
  let O = t && t.getChild('TagName');
  return O ? e.sliceString(O.from, O.to) : '';
}
function C(e, t) {
  let O = t && t.firstChild;
  return O && 'OpenTag' == O.name ? W(e, O) : '';
}
function w(e) {
  for (let t = e && e.parent; t; t = t.parent) if ('Element' == t.name) return t;
  return null;
}
class x {
  constructor(e, t, O) {
    (this.attrs = t),
      (this.attrValues = O),
      (this.children = []),
      (this.name = e.name),
      (this.completion = Object.assign(Object.assign({ type: 'type' }, e.completion || {}), { label: this.name })),
      (this.openCompletion = Object.assign(Object.assign({}, this.completion), { label: '<' + this.name })),
      (this.closeCompletion = Object.assign(Object.assign({}, this.completion), {
        label: '</' + this.name + '>',
        boost: 2,
      })),
      (this.closeNameCompletion = Object.assign(Object.assign({}, this.completion), { label: this.name + '>' })),
      (this.text = e.textContent ? e.textContent.map((e) => ({ label: e, type: 'text' })) : []);
  }
}
const y = /^[:\-\.\w\u00b7-\uffff]*$/;
function X(e) {
  return Object.assign(Object.assign({ type: 'property' }, e.completion || {}), { label: e.name });
}
function S(e) {
  return 'string' == typeof e
    ? { label: `"${e}"`, type: 'constant' }
    : /^"/.test(e.label)
    ? e
    : Object.assign(Object.assign({}, e), { label: `"${e.label}"` });
}
function z(e, t) {
  let O = [],
    r = [],
    n = Object.create(null);
  for (let e of t) {
    let t = X(e);
    O.push(t), e.global && r.push(t), e.values && (n[e.name] = e.values.map(S));
  }
  let a = [],
    o = [],
    s = Object.create(null);
  for (let t of e) {
    let e = r,
      l = n;
    t.attributes &&
      (e = e.concat(
        t.attributes.map((e) =>
          'string' == typeof e
            ? O.find((t) => t.label == e) || { label: e, type: 'property' }
            : (e.values && (l == n && (l = Object.create(l)), (l[e.name] = e.values.map(S))), X(e)),
        ),
      ));
    let d = new x(t, e, l);
    (s[d.name] = d), a.push(d), t.top && o.push(d);
  }
  o.length || (o = a);
  for (let t = 0; t < a.length; t++) {
    let O = e[t],
      r = a[t];
    if (O.children) for (let e of O.children) s[e] && r.children.push(s[e]);
    else r.children = a;
  }
  return (e) => {
    var t;
    let { doc: O } = e.state,
      l = (function (e, t) {
        var O;
        let r = d(e).resolveInner(t, -1),
          n = null;
        for (let e = r; !n && e.parent; e = e.parent)
          ('OpenTag' != e.name &&
            'CloseTag' != e.name &&
            'SelfClosingTag' != e.name &&
            'MismatchedCloseTag' != e.name) ||
            (n = e);
        if (n && (n.to > t || n.lastChild.type.isError)) {
          let e = n.parent;
          if ('TagName' == r.name)
            return 'CloseTag' == n.name || 'MismatchedCloseTag' == n.name
              ? { type: 'closeTag', from: r.from, context: e }
              : { type: 'openTag', from: r.from, context: w(e) };
          if ('AttributeName' == r.name) return { type: 'attrName', from: r.from, context: n };
          if ('AttributeValue' == r.name) return { type: 'attrValue', from: r.from, context: n };
          let O = r == n || 'Attribute' == r.name ? r.childBefore(t) : r;
          return 'StartTag' == (null == O ? void 0 : O.name)
            ? { type: 'openTag', from: t, context: w(e) }
            : 'StartCloseTag' == (null == O ? void 0 : O.name) && O.to <= t
            ? { type: 'closeTag', from: t, context: e }
            : 'Is' == (null == O ? void 0 : O.name)
            ? { type: 'attrValue', from: t, context: n }
            : O
            ? { type: 'attrName', from: t, context: n }
            : null;
        }
        if ('StartCloseTag' == r.name) return { type: 'closeTag', from: t, context: r.parent };
        for (; r.parent && r.to == t && !(null === (O = r.lastChild) || void 0 === O ? void 0 : O.type.isError); )
          r = r.parent;
        return 'Element' == r.name || 'Text' == r.name || 'Document' == r.name
          ? { type: 'tag', from: t, context: 'Element' == r.name ? r : w(r) }
          : null;
      })(e.state, e.pos);
    if (!l || ('tag' == l.type && !e.explicit)) return null;
    let { type: i, from: c, context: $ } = l;
    if ('openTag' == i) {
      let e = o,
        t = C(O, $);
      if (t) {
        let O = s[t];
        e = (null == O ? void 0 : O.children) || a;
      }
      return { from: c, options: e.map((e) => e.completion), validFor: y };
    }
    if ('closeTag' == i) {
      let r = C(O, $);
      return r
        ? {
            from: c,
            to: e.pos + ('>' == O.sliceString(e.pos, e.pos + 1) ? 1 : 0),
            options: [
              (null === (t = s[r]) || void 0 === t ? void 0 : t.closeNameCompletion) || {
                label: r + '>',
                type: 'type',
              },
            ],
            validFor: y,
          }
        : null;
    }
    if ('attrName' == i) {
      let e = s[W(O, $)];
      return { from: c, options: (null == e ? void 0 : e.attrs) || r, validFor: y };
    }
    if ('attrValue' == i) {
      let t = (function (e, t, O) {
        let r = t && t.getChildren('Attribute').find((e) => e.from <= O && e.to >= O),
          n = r && r.getChild('AttributeName');
        return n ? e.sliceString(n.from, n.to) : '';
      })(O, $, c);
      if (!t) return null;
      let r = s[W(O, $)],
        a = ((null == r ? void 0 : r.attrValues) || n)[t];
      return a && a.length
        ? { from: c, to: e.pos + ('"' == O.sliceString(e.pos, e.pos + 1) ? 1 : 0), options: a, validFor: /^"[^"]*"?$/ }
        : null;
    }
    if ('tag' == i) {
      let t = C(O, $),
        r = s[t],
        n = [],
        l = $ && $.lastChild;
      !t ||
        (l && 'CloseTag' == l.name && W(O, l) == t) ||
        n.push(r ? r.closeCompletion : { label: '</' + t + '>', type: 'type', boost: 2 });
      let d = n.concat(((null == r ? void 0 : r.children) || ($ ? a : o)).map((e) => e.openCompletion));
      if ($ && (null == r ? void 0 : r.text.length)) {
        let t = $.firstChild;
        t.to > e.pos - 20 && !/\S/.test(e.state.sliceDoc(t.to, e.pos)) && (d = d.concat(r.text));
      }
      return { from: c, options: d, validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
    }
    return null;
  };
}
const Q = a.define({
  parser: b.configure({
    props: [
      o.add({
        Element(e) {
          let t = /^\s*<\//.test(e.textAfter);
          return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
        },
        'OpenTag CloseTag SelfClosingTag': (e) => e.column(e.node.from) + e.unit,
      }),
      s.add({
        Element(e) {
          let t = e.firstChild,
            O = e.lastChild;
          return t && 'OpenTag' == t.name ? { from: t.to, to: 'CloseTag' == O.name ? O.from : e.to } : null;
        },
      }),
    ],
  }),
  languageData: { commentTokens: { block: { open: '\x3c!--', close: '--\x3e' } }, indentOnInput: /^\s*<\/$/ },
});
function U(e = {}) {
  return new l(Q, Q.data.of({ autocomplete: z(e.elements || [], e.attributes || []) }));
}
export { z as completeFromSchema, U as xml, Q as xmlLanguage };

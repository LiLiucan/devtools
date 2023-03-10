import { isSingleExpression as i } from './directive-helpers.js';
import { Directive as t, PartType as s } from './directive.js';
export { directive } from './directive.js';
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const e = (i, t) => {
    var s, o;
    const n = i._$AN;
    if (void 0 === n) return !1;
    for (const i of n) null === (o = (s = i)._$AO) || void 0 === o || o.call(s, t, !1), e(i, t);
    return !0;
  },
  o = (i) => {
    let t, s;
    do {
      if (void 0 === (t = i._$AM)) break;
      (s = t._$AN), s.delete(i), (i = t);
    } while (0 === (null == s ? void 0 : s.size));
  },
  n = (i) => {
    for (let t; (t = i._$AM); i = t) {
      let s = t._$AN;
      if (void 0 === s) t._$AN = s = new Set();
      else if (s.has(i)) break;
      s.add(i), l(t);
    }
  };
function r(i) {
  void 0 !== this._$AN ? (o(this), (this._$AM = i), n(this)) : (this._$AM = i);
}
function h(i, t = !1, s = 0) {
  const n = this._$AH,
    r = this._$AN;
  if (void 0 !== r && 0 !== r.size)
    if (t)
      if (Array.isArray(n)) for (let i = s; i < n.length; i++) e(n[i], !1), o(n[i]);
      else null != n && (e(n, !1), o(n));
    else e(this, i);
}
const l = (i) => {
  var t, e, o, n;
  i.type == s.CHILD &&
    ((null !== (t = (o = i)._$AP) && void 0 !== t) || (o._$AP = h),
    (null !== (e = (n = i)._$AQ) && void 0 !== e) || (n._$AQ = r));
};
class d extends t {
  constructor() {
    super(...arguments), (this._$AN = void 0);
  }
  _$AT(i, t, s) {
    super._$AT(i, t, s), n(this), (this.isConnected = i._$AU);
  }
  _$AO(i, t = !0) {
    var s, n;
    i !== this.isConnected &&
      ((this.isConnected = i),
      i
        ? null === (s = this.reconnected) || void 0 === s || s.call(this)
        : null === (n = this.disconnected) || void 0 === n || n.call(this)),
      t && (e(this, i), o(this));
  }
  setValue(t) {
    if (i(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      (i[this._$Ci] = t), this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {}
  reconnected() {}
}
export { d as AsyncDirective };
//# sourceMappingURL=async-directive.js.map

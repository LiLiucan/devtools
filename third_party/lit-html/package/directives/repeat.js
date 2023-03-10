import { noChange as e } from '../lit-html.js';
import { directive as s, Directive as t, PartType as r } from '../directive.js';
import {
  getCommittedValue as l,
  setChildPartValue as o,
  insertPart as i,
  removePart as n,
  setCommittedValue as f,
} from '../directive-helpers.js';
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (e, s, t) => {
    const r = new Map();
    for (let l = s; l <= t; l++) r.set(e[l], l);
    return r;
  },
  c = s(
    class extends t {
      constructor(e) {
        if ((super(e), e.type !== r.CHILD)) throw Error('repeat() can only be used in text expressions');
      }
      dt(e, s, t) {
        let r;
        void 0 === t ? (t = s) : void 0 !== s && (r = s);
        const l = [],
          o = [];
        let i = 0;
        for (const s of e) (l[i] = r ? r(s, i) : i), (o[i] = t(s, i)), i++;
        return { values: o, keys: l };
      }
      render(e, s, t) {
        return this.dt(e, s, t).values;
      }
      update(s, [t, r, c]) {
        var d;
        const a = l(s),
          { values: p, keys: v } = this.dt(t, r, c);
        if (!Array.isArray(a)) return (this.ut = v), p;
        const h = null !== (d = this.ut) && void 0 !== d ? d : (this.ut = []),
          m = [];
        let y,
          x,
          j = 0,
          k = a.length - 1,
          w = 0,
          A = p.length - 1;
        for (; j <= k && w <= A; )
          if (null === a[j]) j++;
          else if (null === a[k]) k--;
          else if (h[j] === v[w]) (m[w] = o(a[j], p[w])), j++, w++;
          else if (h[k] === v[A]) (m[A] = o(a[k], p[A])), k--, A--;
          else if (h[j] === v[A]) (m[A] = o(a[j], p[A])), i(s, m[A + 1], a[j]), j++, A--;
          else if (h[k] === v[w]) (m[w] = o(a[k], p[w])), i(s, a[j], a[k]), k--, w++;
          else if ((void 0 === y && ((y = u(v, w, A)), (x = u(h, j, k))), y.has(h[j])))
            if (y.has(h[k])) {
              const e = x.get(v[w]),
                t = void 0 !== e ? a[e] : null;
              if (null === t) {
                const e = i(s, a[j]);
                o(e, p[w]), (m[w] = e);
              } else (m[w] = o(t, p[w])), i(s, a[j], t), (a[e] = null);
              w++;
            } else n(a[k]), k--;
          else n(a[j]), j++;
        for (; w <= A; ) {
          const e = i(s, m[A + 1]);
          o(e, p[w]), (m[w++] = e);
        }
        for (; j <= k; ) {
          const e = a[j++];
          null !== e && n(e);
        }
        return (this.ut = v), f(s, m), e;
      }
    },
  );
export { c as repeat };
//# sourceMappingURL=repeat.js.map

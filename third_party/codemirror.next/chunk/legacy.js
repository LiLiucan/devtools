var e = ['false', 'nil', 'true'],
  t = [
    '.',
    'catch',
    'def',
    'do',
    'if',
    'monitor-enter',
    'monitor-exit',
    'new',
    'quote',
    'recur',
    'set!',
    'throw',
    'try',
    'var',
  ],
  r = [
    '*',
    "*'",
    '*1',
    '*2',
    '*3',
    '*agent*',
    '*allow-unresolved-vars*',
    '*assert*',
    '*clojure-version*',
    '*command-line-args*',
    '*compile-files*',
    '*compile-path*',
    '*compiler-options*',
    '*data-readers*',
    '*default-data-reader-fn*',
    '*e',
    '*err*',
    '*file*',
    '*flush-on-newline*',
    '*fn-loader*',
    '*in*',
    '*math-context*',
    '*ns*',
    '*out*',
    '*print-dup*',
    '*print-length*',
    '*print-level*',
    '*print-meta*',
    '*print-namespace-maps*',
    '*print-readably*',
    '*read-eval*',
    '*reader-resolver*',
    '*source-path*',
    '*suppress-read*',
    '*unchecked-math*',
    '*use-context-classloader*',
    '*verbose-defrecords*',
    '*warn-on-reflection*',
    '+',
    "+'",
    '-',
    "-'",
    '->',
    '->>',
    '->ArrayChunk',
    '->Eduction',
    '->Vec',
    '->VecNode',
    '->VecSeq',
    '-cache-protocol-fn',
    '-reset-methods',
    '..',
    '/',
    '<',
    '<=',
    '=',
    '==',
    '>',
    '>=',
    'EMPTY-NODE',
    'Inst',
    'StackTraceElement->vec',
    'Throwable->map',
    'accessor',
    'aclone',
    'add-classpath',
    'add-watch',
    'agent',
    'agent-error',
    'agent-errors',
    'aget',
    'alength',
    'alias',
    'all-ns',
    'alter',
    'alter-meta!',
    'alter-var-root',
    'amap',
    'ancestors',
    'and',
    'any?',
    'apply',
    'areduce',
    'array-map',
    'as->',
    'aset',
    'aset-boolean',
    'aset-byte',
    'aset-char',
    'aset-double',
    'aset-float',
    'aset-int',
    'aset-long',
    'aset-short',
    'assert',
    'assoc',
    'assoc!',
    'assoc-in',
    'associative?',
    'atom',
    'await',
    'await-for',
    'await1',
    'bases',
    'bean',
    'bigdec',
    'bigint',
    'biginteger',
    'binding',
    'bit-and',
    'bit-and-not',
    'bit-clear',
    'bit-flip',
    'bit-not',
    'bit-or',
    'bit-set',
    'bit-shift-left',
    'bit-shift-right',
    'bit-test',
    'bit-xor',
    'boolean',
    'boolean-array',
    'boolean?',
    'booleans',
    'bound-fn',
    'bound-fn*',
    'bound?',
    'bounded-count',
    'butlast',
    'byte',
    'byte-array',
    'bytes',
    'bytes?',
    'case',
    'cast',
    'cat',
    'char',
    'char-array',
    'char-escape-string',
    'char-name-string',
    'char?',
    'chars',
    'chunk',
    'chunk-append',
    'chunk-buffer',
    'chunk-cons',
    'chunk-first',
    'chunk-next',
    'chunk-rest',
    'chunked-seq?',
    'class',
    'class?',
    'clear-agent-errors',
    'clojure-version',
    'coll?',
    'comment',
    'commute',
    'comp',
    'comparator',
    'compare',
    'compare-and-set!',
    'compile',
    'complement',
    'completing',
    'concat',
    'cond',
    'cond->',
    'cond->>',
    'condp',
    'conj',
    'conj!',
    'cons',
    'constantly',
    'construct-proxy',
    'contains?',
    'count',
    'counted?',
    'create-ns',
    'create-struct',
    'cycle',
    'dec',
    "dec'",
    'decimal?',
    'declare',
    'dedupe',
    'default-data-readers',
    'definline',
    'definterface',
    'defmacro',
    'defmethod',
    'defmulti',
    'defn',
    'defn-',
    'defonce',
    'defprotocol',
    'defrecord',
    'defstruct',
    'deftype',
    'delay',
    'delay?',
    'deliver',
    'denominator',
    'deref',
    'derive',
    'descendants',
    'destructure',
    'disj',
    'disj!',
    'dissoc',
    'dissoc!',
    'distinct',
    'distinct?',
    'doall',
    'dorun',
    'doseq',
    'dosync',
    'dotimes',
    'doto',
    'double',
    'double-array',
    'double?',
    'doubles',
    'drop',
    'drop-last',
    'drop-while',
    'eduction',
    'empty',
    'empty?',
    'ensure',
    'ensure-reduced',
    'enumeration-seq',
    'error-handler',
    'error-mode',
    'eval',
    'even?',
    'every-pred',
    'every?',
    'ex-data',
    'ex-info',
    'extend',
    'extend-protocol',
    'extend-type',
    'extenders',
    'extends?',
    'false?',
    'ffirst',
    'file-seq',
    'filter',
    'filterv',
    'find',
    'find-keyword',
    'find-ns',
    'find-protocol-impl',
    'find-protocol-method',
    'find-var',
    'first',
    'flatten',
    'float',
    'float-array',
    'float?',
    'floats',
    'flush',
    'fn',
    'fn?',
    'fnext',
    'fnil',
    'for',
    'force',
    'format',
    'frequencies',
    'future',
    'future-call',
    'future-cancel',
    'future-cancelled?',
    'future-done?',
    'future?',
    'gen-class',
    'gen-interface',
    'gensym',
    'get',
    'get-in',
    'get-method',
    'get-proxy-class',
    'get-thread-bindings',
    'get-validator',
    'group-by',
    'halt-when',
    'hash',
    'hash-combine',
    'hash-map',
    'hash-ordered-coll',
    'hash-set',
    'hash-unordered-coll',
    'ident?',
    'identical?',
    'identity',
    'if-let',
    'if-not',
    'if-some',
    'ifn?',
    'import',
    'in-ns',
    'inc',
    "inc'",
    'indexed?',
    'init-proxy',
    'inst-ms',
    'inst-ms*',
    'inst?',
    'instance?',
    'int',
    'int-array',
    'int?',
    'integer?',
    'interleave',
    'intern',
    'interpose',
    'into',
    'into-array',
    'ints',
    'io!',
    'isa?',
    'iterate',
    'iterator-seq',
    'juxt',
    'keep',
    'keep-indexed',
    'key',
    'keys',
    'keyword',
    'keyword?',
    'last',
    'lazy-cat',
    'lazy-seq',
    'let',
    'letfn',
    'line-seq',
    'list',
    'list*',
    'list?',
    'load',
    'load-file',
    'load-reader',
    'load-string',
    'loaded-libs',
    'locking',
    'long',
    'long-array',
    'longs',
    'loop',
    'macroexpand',
    'macroexpand-1',
    'make-array',
    'make-hierarchy',
    'map',
    'map-entry?',
    'map-indexed',
    'map?',
    'mapcat',
    'mapv',
    'max',
    'max-key',
    'memfn',
    'memoize',
    'merge',
    'merge-with',
    'meta',
    'method-sig',
    'methods',
    'min',
    'min-key',
    'mix-collection-hash',
    'mod',
    'munge',
    'name',
    'namespace',
    'namespace-munge',
    'nat-int?',
    'neg-int?',
    'neg?',
    'newline',
    'next',
    'nfirst',
    'nil?',
    'nnext',
    'not',
    'not-any?',
    'not-empty',
    'not-every?',
    'not=',
    'ns',
    'ns-aliases',
    'ns-imports',
    'ns-interns',
    'ns-map',
    'ns-name',
    'ns-publics',
    'ns-refers',
    'ns-resolve',
    'ns-unalias',
    'ns-unmap',
    'nth',
    'nthnext',
    'nthrest',
    'num',
    'number?',
    'numerator',
    'object-array',
    'odd?',
    'or',
    'parents',
    'partial',
    'partition',
    'partition-all',
    'partition-by',
    'pcalls',
    'peek',
    'persistent!',
    'pmap',
    'pop',
    'pop!',
    'pop-thread-bindings',
    'pos-int?',
    'pos?',
    'pr',
    'pr-str',
    'prefer-method',
    'prefers',
    'primitives-classnames',
    'print',
    'print-ctor',
    'print-dup',
    'print-method',
    'print-simple',
    'print-str',
    'printf',
    'println',
    'println-str',
    'prn',
    'prn-str',
    'promise',
    'proxy',
    'proxy-call-with-super',
    'proxy-mappings',
    'proxy-name',
    'proxy-super',
    'push-thread-bindings',
    'pvalues',
    'qualified-ident?',
    'qualified-keyword?',
    'qualified-symbol?',
    'quot',
    'rand',
    'rand-int',
    'rand-nth',
    'random-sample',
    'range',
    'ratio?',
    'rational?',
    'rationalize',
    're-find',
    're-groups',
    're-matcher',
    're-matches',
    're-pattern',
    're-seq',
    'read',
    'read-line',
    'read-string',
    'reader-conditional',
    'reader-conditional?',
    'realized?',
    'record?',
    'reduce',
    'reduce-kv',
    'reduced',
    'reduced?',
    'reductions',
    'ref',
    'ref-history-count',
    'ref-max-history',
    'ref-min-history',
    'ref-set',
    'refer',
    'refer-clojure',
    'reify',
    'release-pending-sends',
    'rem',
    'remove',
    'remove-all-methods',
    'remove-method',
    'remove-ns',
    'remove-watch',
    'repeat',
    'repeatedly',
    'replace',
    'replicate',
    'require',
    'reset!',
    'reset-meta!',
    'reset-vals!',
    'resolve',
    'rest',
    'restart-agent',
    'resultset-seq',
    'reverse',
    'reversible?',
    'rseq',
    'rsubseq',
    'run!',
    'satisfies?',
    'second',
    'select-keys',
    'send',
    'send-off',
    'send-via',
    'seq',
    'seq?',
    'seqable?',
    'seque',
    'sequence',
    'sequential?',
    'set',
    'set-agent-send-executor!',
    'set-agent-send-off-executor!',
    'set-error-handler!',
    'set-error-mode!',
    'set-validator!',
    'set?',
    'short',
    'short-array',
    'shorts',
    'shuffle',
    'shutdown-agents',
    'simple-ident?',
    'simple-keyword?',
    'simple-symbol?',
    'slurp',
    'some',
    'some->',
    'some->>',
    'some-fn',
    'some?',
    'sort',
    'sort-by',
    'sorted-map',
    'sorted-map-by',
    'sorted-set',
    'sorted-set-by',
    'sorted?',
    'special-symbol?',
    'spit',
    'split-at',
    'split-with',
    'str',
    'string?',
    'struct',
    'struct-map',
    'subs',
    'subseq',
    'subvec',
    'supers',
    'swap!',
    'swap-vals!',
    'symbol',
    'symbol?',
    'sync',
    'tagged-literal',
    'tagged-literal?',
    'take',
    'take-last',
    'take-nth',
    'take-while',
    'test',
    'the-ns',
    'thread-bound?',
    'time',
    'to-array',
    'to-array-2d',
    'trampoline',
    'transduce',
    'transient',
    'tree-seq',
    'true?',
    'type',
    'unchecked-add',
    'unchecked-add-int',
    'unchecked-byte',
    'unchecked-char',
    'unchecked-dec',
    'unchecked-dec-int',
    'unchecked-divide-int',
    'unchecked-double',
    'unchecked-float',
    'unchecked-inc',
    'unchecked-inc-int',
    'unchecked-int',
    'unchecked-long',
    'unchecked-multiply',
    'unchecked-multiply-int',
    'unchecked-negate',
    'unchecked-negate-int',
    'unchecked-remainder-int',
    'unchecked-short',
    'unchecked-subtract',
    'unchecked-subtract-int',
    'underive',
    'unquote',
    'unquote-splicing',
    'unreduced',
    'unsigned-bit-shift-right',
    'update',
    'update-in',
    'update-proxy',
    'uri?',
    'use',
    'uuid?',
    'val',
    'vals',
    'var-get',
    'var-set',
    'var?',
    'vary-meta',
    'vec',
    'vector',
    'vector-of',
    'vector?',
    'volatile!',
    'volatile?',
    'vreset!',
    'vswap!',
    'when',
    'when-first',
    'when-let',
    'when-not',
    'when-some',
    'while',
    'with-bindings',
    'with-bindings*',
    'with-in-str',
    'with-loading-context',
    'with-local-vars',
    'with-meta',
    'with-open',
    'with-out-str',
    'with-precision',
    'with-redefs',
    'with-redefs-fn',
    'xml-seq',
    'zero?',
    'zipmap',
  ],
  n = f(e),
  o = f(t),
  a = f(r),
  i = f([
    '->',
    '->>',
    'as->',
    'binding',
    'bound-fn',
    'case',
    'catch',
    'comment',
    'cond',
    'cond->',
    'cond->>',
    'condp',
    'def',
    'definterface',
    'defmethod',
    'defn',
    'defmacro',
    'defprotocol',
    'defrecord',
    'defstruct',
    'deftype',
    'do',
    'doseq',
    'dotimes',
    'doto',
    'extend',
    'extend-protocol',
    'extend-type',
    'fn',
    'for',
    'future',
    'if',
    'if-let',
    'if-not',
    'if-some',
    'let',
    'letfn',
    'locking',
    'loop',
    'ns',
    'proxy',
    'reify',
    'struct-map',
    'some->',
    'some->>',
    'try',
    'when',
    'when-first',
    'when-let',
    'when-not',
    'when-some',
    'while',
    'with-bindings',
    'with-bindings*',
    'with-in-str',
    'with-loading-context',
    'with-local-vars',
    'with-meta',
    'with-open',
    'with-out-str',
    'with-precision',
    'with-redefs',
    'with-redefs-fn',
  ]),
  s = /^(?:[\\\[\]\s"(),;@^`{}~]|$)/,
  l =
    /^(?:[+\-]?\d+(?:(?:N|(?:[eE][+\-]?\d+))|(?:\.?\d*(?:M|(?:[eE][+\-]?\d+))?)|\/\d+|[xX][0-9a-fA-F]+|r[0-9a-zA-Z]+)?(?=[\\\[\]\s"#'(),;@^`{}~]|$))/,
  c =
    /^(?:\\(?:backspace|formfeed|newline|return|space|tab|o[0-7]{3}|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{4}|.)?(?=[\\\[\]\s"(),;@^`{}~]|$))/,
  d =
    /^(?:(?:[^\\\/\[\]\d\s"#'(),;@^`{}~.][^\\\[\]\s"(),;@^`{}~.\/]*(?:\.[^\\\/\[\]\d\s"#'(),;@^`{}~.][^\\\[\]\s"(),;@^`{}~.\/]*)*\/)?(?:\/|[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*(?=[\\\[\]\s"(),;@^`{}~]|$))/;
function p(e, t) {
  if (e.eatSpace() || e.eat(',')) return ['space', null];
  if (e.match(l)) return [null, 'number'];
  if (e.match(c)) return [null, 'string.special'];
  if (e.eat(/^"/)) return (t.tokenize = u)(e, t);
  if (e.eat(/^[(\[{]/)) return ['open', 'bracket'];
  if (e.eat(/^[)\]}]/)) return ['close', 'bracket'];
  if (e.eat(/^;/)) return e.skipToEnd(), ['space', 'comment'];
  if (e.eat(/^[#'@^`~]/)) return [null, 'meta'];
  var r = e.match(d),
    i = r && r[0];
  return i
    ? 'comment' === i && '(' === t.lastToken
      ? (t.tokenize = m)(e, t)
      : h(i, n) || ':' === i.charAt(0)
      ? ['symbol', 'atom']
      : h(i, o) || h(i, a)
      ? ['symbol', 'keyword']
      : '(' === t.lastToken
      ? ['symbol', 'builtin']
      : ['symbol', 'variable']
    : (e.next(),
      e.eatWhile(function (e) {
        return !h(e, s);
      }),
      [null, 'error']);
}
function u(e, t) {
  for (var r, n = !1; (r = e.next()); ) {
    if ('"' === r && !n) {
      t.tokenize = p;
      break;
    }
    n = !n && '\\' === r;
  }
  return [null, 'string'];
}
function m(e, t) {
  for (var r, n = 1; (r = e.next()); )
    if ((')' === r && n--, '(' === r && n++, 0 === n)) {
      e.backUp(1), (t.tokenize = p);
      break;
    }
  return ['space', 'comment'];
}
function f(e) {
  for (var t = {}, r = 0; r < e.length; ++r) t[e[r]] = !0;
  return t;
}
function h(e, t) {
  return t instanceof RegExp ? t.test(e) : t instanceof Object ? t.propertyIsEnumerable(e) : void 0;
}
const g = {
  startState: function () {
    return { ctx: { prev: null, start: 0, indentTo: 0 }, lastToken: null, tokenize: p };
  },
  token: function (e, t) {
    e.sol() && 'number' != typeof t.ctx.indentTo && (t.ctx.indentTo = t.ctx.start + 1);
    var r = t.tokenize(e, t),
      n = r[0],
      o = r[1],
      a = e.current();
    return (
      'space' !== n &&
        ('(' === t.lastToken && null === t.ctx.indentTo
          ? 'symbol' === n && h(a, i)
            ? (t.ctx.indentTo = t.ctx.start + e.indentUnit)
            : (t.ctx.indentTo = 'next')
          : 'next' === t.ctx.indentTo && (t.ctx.indentTo = e.column()),
        (t.lastToken = a)),
      'open' === n
        ? (t.ctx = { prev: t.ctx, start: e.column(), indentTo: null })
        : 'close' === n && (t.ctx = t.ctx.prev || t.ctx),
      o
    );
  },
  indent: function (e) {
    var t = e.ctx.indentTo;
    return 'number' == typeof t ? t : e.ctx.start + 1;
  },
  languageData: {
    closeBrackets: { brackets: ['(', '[', '{', '"'] },
    commentTokens: { line: ';;' },
    autocomplete: [].concat(e, t, r),
  },
};
var b = Object.freeze({ __proto__: null, clojure: g });
function k(e) {
  return new RegExp('^((' + e.join(')|(') + '))\\b');
}
var y =
    /^(?:->|=>|\+[+=]?|-[\-=]?|\*[\*=]?|\/[\/=]?|[=!]=|<[><]?=?|>>?=?|%=?|&=?|\|=?|\^=?|\~|!|\?|(or|and|\|\||&&|\?)=)/,
  w = /^(?:[()\[\]{},:`=;]|\.\.?\.?)/,
  v = /^[_A-Za-z$][_A-Za-z$0-9]*/,
  x = /^@[_A-Za-z$][_A-Za-z$0-9]*/,
  z = k(['and', 'or', 'not', 'is', 'isnt', 'in', 'instanceof', 'typeof']),
  q = ['for', 'while', 'loop', 'if', 'unless', 'else', 'switch', 'try', 'catch', 'finally', 'class'],
  j = k(
    q.concat([
      'break',
      'by',
      'continue',
      'debugger',
      'delete',
      'do',
      'in',
      'of',
      'new',
      'return',
      'then',
      'this',
      '@',
      'throw',
      'when',
      'until',
      'extends',
    ]),
  );
q = k(q);
var T = /^('{3}|\"{3}|['\"])/,
  _ = /^(\/{3}|\/)/,
  P = k(['Infinity', 'NaN', 'undefined', 'null', 'true', 'false', 'on', 'off', 'yes', 'no']);
function O(e, t) {
  if (e.sol()) {
    null === t.scope.align && (t.scope.align = !1);
    var r = t.scope.offset;
    if (e.eatSpace()) {
      var n = e.indentation();
      return n > r && 'coffee' == t.scope.type ? 'indent' : n < r ? 'dedent' : null;
    }
    r > 0 && B(e, t);
  }
  if (e.eatSpace()) return null;
  var o = e.peek();
  if (e.match('####')) return e.skipToEnd(), 'comment';
  if (e.match('###')) return (t.tokenize = K), t.tokenize(e, t);
  if ('#' === o) return e.skipToEnd(), 'comment';
  if (e.match(/^-?[0-9\.]/, !1)) {
    var a = !1;
    if (
      (e.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i) && (a = !0),
      e.match(/^-?\d+\.\d*/) && (a = !0),
      e.match(/^-?\.\d+/) && (a = !0),
      a)
    )
      return '.' == e.peek() && e.backUp(1), 'number';
    var i = !1;
    if (
      (e.match(/^-?0x[0-9a-f]+/i) && (i = !0),
      e.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/) && (i = !0),
      e.match(/^-?0(?![\dx])/i) && (i = !0),
      i)
    )
      return 'number';
  }
  if (e.match(T)) return (t.tokenize = A(e.current(), !1, 'string')), t.tokenize(e, t);
  if (e.match(_)) {
    if ('/' != e.current() || e.match(/^.*\//, !1))
      return (t.tokenize = A(e.current(), !0, 'string.special')), t.tokenize(e, t);
    e.backUp(1);
  }
  return e.match(y) || e.match(z)
    ? 'operator'
    : e.match(w)
    ? 'punctuation'
    : e.match(P)
    ? 'atom'
    : e.match(x) || (t.prop && e.match(v))
    ? 'property'
    : e.match(j)
    ? 'keyword'
    : e.match(v)
    ? 'variable'
    : (e.next(), 'error');
}
function A(e, t, r) {
  return function (n, o) {
    for (; !n.eol(); )
      if ((n.eatWhile(/[^'"\/\\]/), n.eat('\\'))) {
        if ((n.next(), t && n.eol())) return r;
      } else {
        if (n.match(e)) return (o.tokenize = O), r;
        n.eat(/['"\/]/);
      }
    return t && (o.tokenize = O), r;
  };
}
function K(e, t) {
  for (; !e.eol(); ) {
    if ((e.eatWhile(/[^#]/), e.match('###'))) {
      t.tokenize = O;
      break;
    }
    e.eatWhile('#');
  }
  return 'comment';
}
function S(e, t, r = 'coffee') {
  for (var n = 0, o = !1, a = null, i = t.scope; i; i = i.prev)
    if ('coffee' === i.type || '}' == i.type) {
      n = i.offset + e.indentUnit;
      break;
    }
  'coffee' !== r ? ((o = null), (a = e.column() + e.current().length)) : t.scope.align && (t.scope.align = !1),
    (t.scope = { offset: n, type: r, prev: t.scope, align: o, alignOffset: a });
}
function B(e, t) {
  if (t.scope.prev) {
    if ('coffee' === t.scope.type) {
      for (var r = e.indentation(), n = !1, o = t.scope; o; o = o.prev)
        if (r === o.offset) {
          n = !0;
          break;
        }
      if (!n) return !0;
      for (; t.scope.prev && t.scope.offset !== r; ) t.scope = t.scope.prev;
      return !1;
    }
    return (t.scope = t.scope.prev), !1;
  }
}
const $ = {
  startState: function () {
    return { tokenize: O, scope: { offset: 0, type: 'coffee', prev: null, align: !1 }, prop: !1, dedent: 0 };
  },
  token: function (e, t) {
    var r = null === t.scope.align && t.scope;
    r && e.sol() && (r.align = !1);
    var n = (function (e, t) {
      var r = t.tokenize(e, t),
        n = e.current();
      'return' === n && (t.dedent = !0), ((('->' === n || '=>' === n) && e.eol()) || 'indent' === r) && S(e, t);
      var o = '[({'.indexOf(n);
      if (
        (-1 !== o && S(e, t, '])}'.slice(o, o + 1)),
        q.exec(n) && S(e, t),
        'then' == n && B(e, t),
        'dedent' === r && B(e, t))
      )
        return 'error';
      if (-1 !== (o = '])}'.indexOf(n))) {
        for (; 'coffee' == t.scope.type && t.scope.prev; ) t.scope = t.scope.prev;
        t.scope.type == n && (t.scope = t.scope.prev);
      }
      return (
        t.dedent && e.eol() && ('coffee' == t.scope.type && t.scope.prev && (t.scope = t.scope.prev), (t.dedent = !1)),
        'indent' == r || 'dedent' == r ? null : r
      );
    })(e, t);
    return n && 'comment' != n && (r && (r.align = !0), (t.prop = 'punctuation' == n && '.' == e.current())), n;
  },
  indent: function (e, t) {
    if (e.tokenize != O) return 0;
    var r = e.scope,
      n = t && '])}'.indexOf(t.charAt(0)) > -1;
    if (n) for (; 'coffee' == r.type && r.prev; ) r = r.prev;
    var o = n && r.type === t.charAt(0);
    return r.align ? r.alignOffset - (o ? 1 : 0) : (o ? r.prev : r).offset;
  },
  languageData: { commentTokens: { line: '#' } },
};
var E = Object.freeze({ __proto__: null, coffeeScript: $ }),
  C = {};
function W(e, t) {
  for (var r = 0; r < t.length; r++) C[t[r]] = e;
}
var N = ['true', 'false'],
  F = [
    'if',
    'then',
    'do',
    'else',
    'elif',
    'while',
    'until',
    'for',
    'in',
    'esac',
    'fi',
    'fin',
    'fil',
    'done',
    'exit',
    'set',
    'unset',
    'export',
    'function',
  ],
  U = [
    'ab',
    'awk',
    'bash',
    'beep',
    'cat',
    'cc',
    'cd',
    'chown',
    'chmod',
    'chroot',
    'clear',
    'cp',
    'curl',
    'cut',
    'diff',
    'echo',
    'find',
    'gawk',
    'gcc',
    'get',
    'git',
    'grep',
    'hg',
    'kill',
    'killall',
    'ln',
    'ls',
    'make',
    'mkdir',
    'openssl',
    'mv',
    'nc',
    'nl',
    'node',
    'npm',
    'ping',
    'ps',
    'restart',
    'rm',
    'rmdir',
    'sed',
    'service',
    'sh',
    'shopt',
    'shred',
    'source',
    'sort',
    'sleep',
    'ssh',
    'start',
    'stop',
    'su',
    'sudo',
    'svn',
    'tee',
    'telnet',
    'top',
    'touch',
    'vi',
    'vim',
    'wall',
    'wc',
    'wget',
    'who',
    'write',
    'yes',
    'zsh',
  ];
function D(e, t) {
  if (e.eatSpace()) return null;
  var r,
    n = e.sol(),
    o = e.next();
  if ('\\' === o) return e.next(), null;
  if ("'" === o || '"' === o || '`' === o) return t.tokens.unshift(Z(o, '`' === o ? 'quote' : 'string')), H(e, t);
  if ('#' === o) return n && e.eat('!') ? (e.skipToEnd(), 'meta') : (e.skipToEnd(), 'comment');
  if ('$' === o) return t.tokens.unshift(V), H(e, t);
  if ('+' === o || '=' === o) return 'operator';
  if ('-' === o) return e.eat('-'), e.eatWhile(/\w/), 'attribute';
  if ('<' == o) {
    if (e.match('<<')) return 'operator';
    var a = e.match(/^<-?\s*['"]?([^'"]*)['"]?/);
    if (a)
      return (
        t.tokens.unshift(
          ((r = a[1]),
          function (e, t) {
            return e.sol() && e.string == r && t.tokens.shift(), e.skipToEnd(), 'string.special';
          }),
        ),
        'string.special'
      );
  }
  if (/\d/.test(o) && (e.eatWhile(/\d/), e.eol() || !/\w/.test(e.peek()))) return 'number';
  e.eatWhile(/[\w-]/);
  var i = e.current();
  return '=' === e.peek() && /\w+/.test(i) ? 'def' : C.hasOwnProperty(i) ? C[i] : null;
}
function Z(e, t) {
  var r = '(' == e ? ')' : '{' == e ? '}' : e;
  return function (n, o) {
    for (var a, i = !1; null != (a = n.next()); ) {
      if (a === r && !i) {
        o.tokens.shift();
        break;
      }
      if ('$' === a && !i && "'" !== e && n.peek() != r) {
        (i = !0), n.backUp(1), o.tokens.unshift(V);
        break;
      }
      if (!i && e !== r && a === e) return o.tokens.unshift(Z(e, t)), H(n, o);
      if (!i && /['"]/.test(a) && !/['"]/.test(e)) {
        o.tokens.unshift(L(a, 'string')), n.backUp(1);
        break;
      }
      i = !i && '\\' === a;
    }
    return t;
  };
}
function L(e, t) {
  return function (r, n) {
    return (n.tokens[0] = Z(e, t)), r.next(), H(r, n);
  };
}
W('atom', N), W('keyword', F), W('builtin', U);
var V = function (e, t) {
  t.tokens.length > 1 && e.eat('$');
  var r = e.next();
  return /['"({]/.test(r)
    ? ((t.tokens[0] = Z(r, '(' == r ? 'quote' : '{' == r ? 'def' : 'string')), H(e, t))
    : (/\d/.test(r) || e.eatWhile(/\w/), t.tokens.shift(), 'def');
};
function H(e, t) {
  return (t.tokens[0] || D)(e, t);
}
const X = {
  startState: function () {
    return { tokens: [] };
  },
  token: function (e, t) {
    return H(e, t);
  },
  languageData: {
    autocomplete: N.concat(F, U),
    closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
    commentTokens: { line: '#' },
  },
};
var Y = Object.freeze({ __proto__: null, shell: X });
function I(e) {
  var t,
    r,
    n = (e = { ...be, ...e }).inline,
    o = e.tokenHooks,
    a = e.documentTypes || {},
    i = e.mediaTypes || {},
    s = e.mediaFeatures || {},
    l = e.mediaValueKeywords || {},
    c = e.propertyKeywords || {},
    d = e.nonStandardPropertyKeywords || {},
    p = e.fontProperties || {},
    u = e.counterDescriptors || {},
    m = e.colorKeywords || {},
    f = e.valueKeywords || {},
    h = e.allowNested,
    g = e.lineComment,
    b = !0 === e.supportsAtComponent,
    k = !1 !== e.highlightNonStandardPropertyKeywords;
  function y(e, r) {
    return (t = r), e;
  }
  function w(e, t) {
    var r = e.next();
    if (o[r]) {
      var n = o[r](e, t);
      if (!1 !== n) return n;
    }
    return '@' == r
      ? (e.eatWhile(/[\w\\\-]/), y('def', e.current()))
      : '=' == r || (('~' == r || '|' == r) && e.eat('='))
      ? y(null, 'compare')
      : '"' == r || "'" == r
      ? ((t.tokenize = v(r)), t.tokenize(e, t))
      : '#' == r
      ? (e.eatWhile(/[\w\\\-]/), y('atom', 'hash'))
      : '!' == r
      ? (e.match(/^\s*\w*/), y('keyword', 'important'))
      : /\d/.test(r) || ('.' == r && e.eat(/\d/))
      ? (e.eatWhile(/[\w.%]/), y('number', 'unit'))
      : '-' !== r
      ? /[,+>*\/]/.test(r)
        ? y(null, 'select-op')
        : '.' == r && e.match(/^-?[_a-z][_a-z0-9-]*/i)
        ? y('qualifier', 'qualifier')
        : /[:;{}\[\]\(\)]/.test(r)
        ? y(null, r)
        : e.match(/^[\w-.]+(?=\()/)
        ? (/^(url(-prefix)?|domain|regexp)$/i.test(e.current()) && (t.tokenize = x),
          y('variableName.function', 'variable'))
        : /[\w\\\-]/.test(r)
        ? (e.eatWhile(/[\w\\\-]/), y('property', 'word'))
        : y(null, null)
      : /[\d.]/.test(e.peek())
      ? (e.eatWhile(/[\w.%]/), y('number', 'unit'))
      : e.match(/^-[\w\\\-]*/)
      ? (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? y('def', 'variable-definition') : y('variableName', 'variable'))
      : e.match(/^\w+-/)
      ? y('meta', 'meta')
      : void 0;
  }
  function v(e) {
    return function (t, r) {
      for (var n, o = !1; null != (n = t.next()); ) {
        if (n == e && !o) {
          ')' == e && t.backUp(1);
          break;
        }
        o = !o && '\\' == n;
      }
      return (n == e || (!o && ')' != e)) && (r.tokenize = null), y('string', 'string');
    };
  }
  function x(e, t) {
    return e.next(), e.match(/^\s*[\"\')]/, !1) ? (t.tokenize = null) : (t.tokenize = v(')')), y(null, '(');
  }
  function z(e, t, r) {
    (this.type = e), (this.indent = t), (this.prev = r);
  }
  function q(e, t, r, n) {
    return (e.context = new z(r, t.indentation() + (!1 === n ? 0 : t.indentUnit), e.context)), r;
  }
  function j(e) {
    return e.context.prev && (e.context = e.context.prev), e.context.type;
  }
  function T(e, t, r) {
    return O[r.context.type](e, t, r);
  }
  function _(e, t, r, n) {
    for (var o = n || 1; o > 0; o--) r.context = r.context.prev;
    return T(e, t, r);
  }
  function P(e) {
    var t = e.current().toLowerCase();
    r = f.hasOwnProperty(t) ? 'atom' : m.hasOwnProperty(t) ? 'keyword' : 'variable';
  }
  var O = {
    top: function (e, t, n) {
      if ('{' == e) return q(n, t, 'block');
      if ('}' == e && n.context.prev) return j(n);
      if (b && /@component/i.test(e)) return q(n, t, 'atComponentBlock');
      if (/^@(-moz-)?document$/i.test(e)) return q(n, t, 'documentTypes');
      if (/^@(media|supports|(-moz-)?document|import)$/i.test(e)) return q(n, t, 'atBlock');
      if (/^@(font-face|counter-style)/i.test(e)) return (n.stateArg = e), 'restricted_atBlock_before';
      if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(e)) return 'keyframes';
      if (e && '@' == e.charAt(0)) return q(n, t, 'at');
      if ('hash' == e) r = 'builtin';
      else if ('word' == e) r = 'tag';
      else {
        if ('variable-definition' == e) return 'maybeprop';
        if ('interpolation' == e) return q(n, t, 'interpolation');
        if (':' == e) return 'pseudo';
        if (h && '(' == e) return q(n, t, 'parens');
      }
      return n.context.type;
    },
    block: function (e, t, n) {
      if ('word' == e) {
        var o = t.current().toLowerCase();
        return c.hasOwnProperty(o)
          ? ((r = 'property'), 'maybeprop')
          : d.hasOwnProperty(o)
          ? ((r = k ? 'string.special' : 'property'), 'maybeprop')
          : h
          ? ((r = t.match(/^\s*:(?:\s|$)/, !1) ? 'property' : 'tag'), 'block')
          : ((r = 'error'), 'maybeprop');
      }
      return 'meta' == e ? 'block' : h || ('hash' != e && 'qualifier' != e) ? O.top(e, t, n) : ((r = 'error'), 'block');
    },
    maybeprop: function (e, t, r) {
      return ':' == e ? q(r, t, 'prop') : T(e, t, r);
    },
    prop: function (e, t, n) {
      if (';' == e) return j(n);
      if ('{' == e && h) return q(n, t, 'propBlock');
      if ('}' == e || '{' == e) return _(e, t, n);
      if ('(' == e) return q(n, t, 'parens');
      if ('hash' != e || /^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(t.current())) {
        if ('word' == e) P(t);
        else if ('interpolation' == e) return q(n, t, 'interpolation');
      } else r = 'error';
      return 'prop';
    },
    propBlock: function (e, t, n) {
      return '}' == e ? j(n) : 'word' == e ? ((r = 'property'), 'maybeprop') : n.context.type;
    },
    parens: function (e, t, r) {
      return '{' == e || '}' == e
        ? _(e, t, r)
        : ')' == e
        ? j(r)
        : '(' == e
        ? q(r, t, 'parens')
        : 'interpolation' == e
        ? q(r, t, 'interpolation')
        : ('word' == e && P(t), 'parens');
    },
    pseudo: function (e, t, n) {
      return 'meta' == e ? 'pseudo' : 'word' == e ? ((r = 'variableName.constant'), n.context.type) : T(e, t, n);
    },
    documentTypes: function (e, t, n) {
      return 'word' == e && a.hasOwnProperty(t.current()) ? ((r = 'tag'), n.context.type) : O.atBlock(e, t, n);
    },
    atBlock: function (e, t, n) {
      if ('(' == e) return q(n, t, 'atBlock_parens');
      if ('}' == e || ';' == e) return _(e, t, n);
      if ('{' == e) return j(n) && q(n, t, h ? 'block' : 'top');
      if ('interpolation' == e) return q(n, t, 'interpolation');
      if ('word' == e) {
        var o = t.current().toLowerCase();
        r =
          'only' == o || 'not' == o || 'and' == o || 'or' == o
            ? 'keyword'
            : i.hasOwnProperty(o)
            ? 'attribute'
            : s.hasOwnProperty(o)
            ? 'property'
            : l.hasOwnProperty(o)
            ? 'keyword'
            : c.hasOwnProperty(o)
            ? 'property'
            : d.hasOwnProperty(o)
            ? k
              ? 'string.special'
              : 'property'
            : f.hasOwnProperty(o)
            ? 'atom'
            : m.hasOwnProperty(o)
            ? 'keyword'
            : 'error';
      }
      return n.context.type;
    },
    atComponentBlock: function (e, t, n) {
      return '}' == e
        ? _(e, t, n)
        : '{' == e
        ? j(n) && q(n, t, h ? 'block' : 'top', !1)
        : ('word' == e && (r = 'error'), n.context.type);
    },
    atBlock_parens: function (e, t, r) {
      return ')' == e ? j(r) : '{' == e || '}' == e ? _(e, t, r, 2) : O.atBlock(e, t, r);
    },
    restricted_atBlock_before: function (e, t, n) {
      return '{' == e
        ? q(n, t, 'restricted_atBlock')
        : 'word' == e && '@counter-style' == n.stateArg
        ? ((r = 'variable'), 'restricted_atBlock_before')
        : T(e, t, n);
    },
    restricted_atBlock: function (e, t, n) {
      return '}' == e
        ? ((n.stateArg = null), j(n))
        : 'word' == e
        ? ((r =
            ('@font-face' == n.stateArg && !p.hasOwnProperty(t.current().toLowerCase())) ||
            ('@counter-style' == n.stateArg && !u.hasOwnProperty(t.current().toLowerCase()))
              ? 'error'
              : 'property'),
          'maybeprop')
        : 'restricted_atBlock';
    },
    keyframes: function (e, t, n) {
      return 'word' == e ? ((r = 'variable'), 'keyframes') : '{' == e ? q(n, t, 'top') : T(e, t, n);
    },
    at: function (e, t, n) {
      return ';' == e
        ? j(n)
        : '{' == e || '}' == e
        ? _(e, t, n)
        : ('word' == e ? (r = 'tag') : 'hash' == e && (r = 'builtin'), 'at');
    },
    interpolation: function (e, t, n) {
      return '}' == e
        ? j(n)
        : '{' == e || ';' == e
        ? _(e, t, n)
        : ('word' == e ? (r = 'variable') : 'variable' != e && '(' != e && ')' != e && (r = 'error'), 'interpolation');
    },
  };
  return {
    startState: function () {
      return {
        tokenize: null,
        state: n ? 'block' : 'top',
        stateArg: null,
        context: new z(n ? 'block' : 'top', 0, null),
      };
    },
    token: function (e, n) {
      if (!n.tokenize && e.eatSpace()) return null;
      var o = (n.tokenize || w)(e, n);
      return (
        o && 'object' == typeof o && ((t = o[1]), (o = o[0])),
        (r = o),
        'comment' != t && (n.state = O[n.state](t, e, n)),
        r
      );
    },
    indent: function (e, t, r) {
      var n = e.context,
        o = t && t.charAt(0),
        a = n.indent;
      return (
        'prop' != n.type || ('}' != o && ')' != o) || (n = n.prev),
        n.prev &&
          ('}' != o ||
          ('block' != n.type && 'top' != n.type && 'interpolation' != n.type && 'restricted_atBlock' != n.type)
            ? ((')' != o || ('parens' != n.type && 'atBlock_parens' != n.type)) &&
                ('{' != o || ('at' != n.type && 'atBlock' != n.type))) ||
              (a = Math.max(0, n.indent - r.unit))
            : (a = (n = n.prev).indent)),
        a
      );
    },
    languageData: {
      indentOnInput: /^\s*\}$/,
      commentTokens: { line: g, block: { open: '/*', close: '*/' } },
      autocomplete: he,
    },
  };
}
function M(e) {
  for (var t = {}, r = 0; r < e.length; ++r) t[e[r].toLowerCase()] = !0;
  return t;
}
var R = ['domain', 'regexp', 'url', 'url-prefix'],
  G = M(R),
  J = ['all', 'aural', 'braille', 'handheld', 'print', 'projection', 'screen', 'tty', 'tv', 'embossed'],
  Q = M(J),
  ee = [
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'device-width',
    'min-device-width',
    'max-device-width',
    'device-height',
    'min-device-height',
    'max-device-height',
    'aspect-ratio',
    'min-aspect-ratio',
    'max-aspect-ratio',
    'device-aspect-ratio',
    'min-device-aspect-ratio',
    'max-device-aspect-ratio',
    'color',
    'min-color',
    'max-color',
    'color-index',
    'min-color-index',
    'max-color-index',
    'monochrome',
    'min-monochrome',
    'max-monochrome',
    'resolution',
    'min-resolution',
    'max-resolution',
    'scan',
    'grid',
    'orientation',
    'device-pixel-ratio',
    'min-device-pixel-ratio',
    'max-device-pixel-ratio',
    'pointer',
    'any-pointer',
    'hover',
    'any-hover',
    'prefers-color-scheme',
    'dynamic-range',
    'video-dynamic-range',
  ],
  te = M(ee),
  re = [
    'landscape',
    'portrait',
    'none',
    'coarse',
    'fine',
    'on-demand',
    'hover',
    'interlace',
    'progressive',
    'dark',
    'light',
    'standard',
    'high',
  ],
  ne = M(re),
  oe = [
    'align-content',
    'align-items',
    'align-self',
    'alignment-adjust',
    'alignment-baseline',
    'all',
    'anchor-point',
    'animation',
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-fill-mode',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'appearance',
    'azimuth',
    'backdrop-filter',
    'backface-visibility',
    'background',
    'background-attachment',
    'background-blend-mode',
    'background-clip',
    'background-color',
    'background-image',
    'background-origin',
    'background-position',
    'background-position-x',
    'background-position-y',
    'background-repeat',
    'background-size',
    'baseline-shift',
    'binding',
    'bleed',
    'block-size',
    'bookmark-label',
    'bookmark-level',
    'bookmark-state',
    'bookmark-target',
    'border',
    'border-bottom',
    'border-bottom-color',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-bottom-style',
    'border-bottom-width',
    'border-collapse',
    'border-color',
    'border-image',
    'border-image-outset',
    'border-image-repeat',
    'border-image-slice',
    'border-image-source',
    'border-image-width',
    'border-left',
    'border-left-color',
    'border-left-style',
    'border-left-width',
    'border-radius',
    'border-right',
    'border-right-color',
    'border-right-style',
    'border-right-width',
    'border-spacing',
    'border-style',
    'border-top',
    'border-top-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-top-style',
    'border-top-width',
    'border-width',
    'bottom',
    'box-decoration-break',
    'box-shadow',
    'box-sizing',
    'break-after',
    'break-before',
    'break-inside',
    'caption-side',
    'caret-color',
    'clear',
    'clip',
    'color',
    'color-profile',
    'column-count',
    'column-fill',
    'column-gap',
    'column-rule',
    'column-rule-color',
    'column-rule-style',
    'column-rule-width',
    'column-span',
    'column-width',
    'columns',
    'contain',
    'content',
    'counter-increment',
    'counter-reset',
    'crop',
    'cue',
    'cue-after',
    'cue-before',
    'cursor',
    'direction',
    'display',
    'dominant-baseline',
    'drop-initial-after-adjust',
    'drop-initial-after-align',
    'drop-initial-before-adjust',
    'drop-initial-before-align',
    'drop-initial-size',
    'drop-initial-value',
    'elevation',
    'empty-cells',
    'fit',
    'fit-content',
    'fit-position',
    'flex',
    'flex-basis',
    'flex-direction',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'float',
    'float-offset',
    'flow-from',
    'flow-into',
    'font',
    'font-family',
    'font-feature-settings',
    'font-kerning',
    'font-language-override',
    'font-optical-sizing',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-synthesis',
    'font-variant',
    'font-variant-alternates',
    'font-variant-caps',
    'font-variant-east-asian',
    'font-variant-ligatures',
    'font-variant-numeric',
    'font-variant-position',
    'font-variation-settings',
    'font-weight',
    'gap',
    'grid',
    'grid-area',
    'grid-auto-columns',
    'grid-auto-flow',
    'grid-auto-rows',
    'grid-column',
    'grid-column-end',
    'grid-column-gap',
    'grid-column-start',
    'grid-gap',
    'grid-row',
    'grid-row-end',
    'grid-row-gap',
    'grid-row-start',
    'grid-template',
    'grid-template-areas',
    'grid-template-columns',
    'grid-template-rows',
    'hanging-punctuation',
    'height',
    'hyphens',
    'icon',
    'image-orientation',
    'image-rendering',
    'image-resolution',
    'inline-box-align',
    'inset',
    'inset-block',
    'inset-block-end',
    'inset-block-start',
    'inset-inline',
    'inset-inline-end',
    'inset-inline-start',
    'isolation',
    'justify-content',
    'justify-items',
    'justify-self',
    'left',
    'letter-spacing',
    'line-break',
    'line-height',
    'line-height-step',
    'line-stacking',
    'line-stacking-ruby',
    'line-stacking-shift',
    'line-stacking-strategy',
    'list-style',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'margin',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'margin-top',
    'marks',
    'marquee-direction',
    'marquee-loop',
    'marquee-play-count',
    'marquee-speed',
    'marquee-style',
    'mask-clip',
    'mask-composite',
    'mask-image',
    'mask-mode',
    'mask-origin',
    'mask-position',
    'mask-repeat',
    'mask-size',
    'mask-type',
    'max-block-size',
    'max-height',
    'max-inline-size',
    'max-width',
    'min-block-size',
    'min-height',
    'min-inline-size',
    'min-width',
    'mix-blend-mode',
    'move-to',
    'nav-down',
    'nav-index',
    'nav-left',
    'nav-right',
    'nav-up',
    'object-fit',
    'object-position',
    'offset',
    'offset-anchor',
    'offset-distance',
    'offset-path',
    'offset-position',
    'offset-rotate',
    'opacity',
    'order',
    'orphans',
    'outline',
    'outline-color',
    'outline-offset',
    'outline-style',
    'outline-width',
    'overflow',
    'overflow-style',
    'overflow-wrap',
    'overflow-x',
    'overflow-y',
    'padding',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'page',
    'page-break-after',
    'page-break-before',
    'page-break-inside',
    'page-policy',
    'pause',
    'pause-after',
    'pause-before',
    'perspective',
    'perspective-origin',
    'pitch',
    'pitch-range',
    'place-content',
    'place-items',
    'place-self',
    'play-during',
    'position',
    'presentation-level',
    'punctuation-trim',
    'quotes',
    'region-break-after',
    'region-break-before',
    'region-break-inside',
    'region-fragment',
    'rendering-intent',
    'resize',
    'rest',
    'rest-after',
    'rest-before',
    'richness',
    'right',
    'rotate',
    'rotation',
    'rotation-point',
    'row-gap',
    'ruby-align',
    'ruby-overhang',
    'ruby-position',
    'ruby-span',
    'scale',
    'scroll-behavior',
    'scroll-margin',
    'scroll-margin-block',
    'scroll-margin-block-end',
    'scroll-margin-block-start',
    'scroll-margin-bottom',
    'scroll-margin-inline',
    'scroll-margin-inline-end',
    'scroll-margin-inline-start',
    'scroll-margin-left',
    'scroll-margin-right',
    'scroll-margin-top',
    'scroll-padding',
    'scroll-padding-block',
    'scroll-padding-block-end',
    'scroll-padding-block-start',
    'scroll-padding-bottom',
    'scroll-padding-inline',
    'scroll-padding-inline-end',
    'scroll-padding-inline-start',
    'scroll-padding-left',
    'scroll-padding-right',
    'scroll-padding-top',
    'scroll-snap-align',
    'scroll-snap-type',
    'shape-image-threshold',
    'shape-inside',
    'shape-margin',
    'shape-outside',
    'size',
    'speak',
    'speak-as',
    'speak-header',
    'speak-numeral',
    'speak-punctuation',
    'speech-rate',
    'stress',
    'string-set',
    'tab-size',
    'table-layout',
    'target',
    'target-name',
    'target-new',
    'target-position',
    'text-align',
    'text-align-last',
    'text-combine-upright',
    'text-decoration',
    'text-decoration-color',
    'text-decoration-line',
    'text-decoration-skip',
    'text-decoration-skip-ink',
    'text-decoration-style',
    'text-emphasis',
    'text-emphasis-color',
    'text-emphasis-position',
    'text-emphasis-style',
    'text-height',
    'text-indent',
    'text-justify',
    'text-orientation',
    'text-outline',
    'text-overflow',
    'text-rendering',
    'text-shadow',
    'text-size-adjust',
    'text-space-collapse',
    'text-transform',
    'text-underline-position',
    'text-wrap',
    'top',
    'touch-action',
    'transform',
    'transform-origin',
    'transform-style',
    'transition',
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
    'translate',
    'unicode-bidi',
    'user-select',
    'vertical-align',
    'visibility',
    'voice-balance',
    'voice-duration',
    'voice-family',
    'voice-pitch',
    'voice-range',
    'voice-rate',
    'voice-stress',
    'voice-volume',
    'volume',
    'white-space',
    'widows',
    'width',
    'will-change',
    'word-break',
    'word-spacing',
    'word-wrap',
    'writing-mode',
    'z-index',
    'clip-path',
    'clip-rule',
    'mask',
    'enable-background',
    'filter',
    'flood-color',
    'flood-opacity',
    'lighting-color',
    'stop-color',
    'stop-opacity',
    'pointer-events',
    'color-interpolation',
    'color-interpolation-filters',
    'color-rendering',
    'fill',
    'fill-opacity',
    'fill-rule',
    'image-rendering',
    'marker',
    'marker-end',
    'marker-mid',
    'marker-start',
    'paint-order',
    'shape-rendering',
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-rendering',
    'baseline-shift',
    'dominant-baseline',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'text-anchor',
    'writing-mode',
  ],
  ae = M(oe),
  ie = [
    'accent-color',
    'aspect-ratio',
    'border-block',
    'border-block-color',
    'border-block-end',
    'border-block-end-color',
    'border-block-end-style',
    'border-block-end-width',
    'border-block-start',
    'border-block-start-color',
    'border-block-start-style',
    'border-block-start-width',
    'border-block-style',
    'border-block-width',
    'border-inline',
    'border-inline-color',
    'border-inline-end',
    'border-inline-end-color',
    'border-inline-end-style',
    'border-inline-end-width',
    'border-inline-start',
    'border-inline-start-color',
    'border-inline-start-style',
    'border-inline-start-width',
    'border-inline-style',
    'border-inline-width',
    'content-visibility',
    'margin-block',
    'margin-block-end',
    'margin-block-start',
    'margin-inline',
    'margin-inline-end',
    'margin-inline-start',
    'overflow-anchor',
    'overscroll-behavior',
    'padding-block',
    'padding-block-end',
    'padding-block-start',
    'padding-inline',
    'padding-inline-end',
    'padding-inline-start',
    'scroll-snap-stop',
    'scrollbar-3d-light-color',
    'scrollbar-arrow-color',
    'scrollbar-base-color',
    'scrollbar-dark-shadow-color',
    'scrollbar-face-color',
    'scrollbar-highlight-color',
    'scrollbar-shadow-color',
    'scrollbar-track-color',
    'searchfield-cancel-button',
    'searchfield-decoration',
    'searchfield-results-button',
    'searchfield-results-decoration',
    'shape-inside',
    'zoom',
  ],
  se = M(ie),
  le = [
    'font-display',
    'font-family',
    'src',
    'unicode-range',
    'font-variant',
    'font-feature-settings',
    'font-stretch',
    'font-weight',
    'font-style',
  ],
  ce = M(le),
  de = M([
    'additive-symbols',
    'fallback',
    'negative',
    'pad',
    'prefix',
    'range',
    'speak-as',
    'suffix',
    'symbols',
    'system',
  ]),
  pe = [
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
    'darkgrey',
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
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
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
    'lightgrey',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
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
    'slategrey',
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
  ],
  ue = M(pe),
  me = [
    'above',
    'absolute',
    'activeborder',
    'additive',
    'activecaption',
    'afar',
    'after-white-space',
    'ahead',
    'alias',
    'all',
    'all-scroll',
    'alphabetic',
    'alternate',
    'always',
    'amharic',
    'amharic-abegede',
    'antialiased',
    'appworkspace',
    'arabic-indic',
    'armenian',
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
    'binary',
    'bengali',
    'blink',
    'block',
    'block-axis',
    'blur',
    'bold',
    'bolder',
    'border',
    'border-box',
    'both',
    'bottom',
    'break',
    'break-all',
    'break-word',
    'brightness',
    'bullets',
    'button',
    'buttonface',
    'buttonhighlight',
    'buttonshadow',
    'buttontext',
    'calc',
    'cambodian',
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
    'cjk-earthly-branch',
    'cjk-heavenly-stem',
    'cjk-ideographic',
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
    'conic-gradient',
    'contain',
    'content',
    'contents',
    'content-box',
    'context-menu',
    'continuous',
    'contrast',
    'copy',
    'counter',
    'counters',
    'cover',
    'crop',
    'cross',
    'crosshair',
    'cubic-bezier',
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
    'devanagari',
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
    'drop-shadow',
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
    'ethiopic',
    'ethiopic-abegede',
    'ethiopic-abegede-am-et',
    'ethiopic-abegede-gez',
    'ethiopic-abegede-ti-er',
    'ethiopic-abegede-ti-et',
    'ethiopic-halehame-aa-er',
    'ethiopic-halehame-aa-et',
    'ethiopic-halehame-am-et',
    'ethiopic-halehame-gez',
    'ethiopic-halehame-om-et',
    'ethiopic-halehame-sid-et',
    'ethiopic-halehame-so-et',
    'ethiopic-halehame-ti-er',
    'ethiopic-halehame-ti-et',
    'ethiopic-halehame-tig',
    'ethiopic-numeric',
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
    'georgian',
    'grayscale',
    'graytext',
    'grid',
    'groove',
    'gujarati',
    'gurmukhi',
    'hand',
    'hangul',
    'hangul-consonant',
    'hard-light',
    'hebrew',
    'help',
    'hidden',
    'hide',
    'higher',
    'highlight',
    'highlighttext',
    'hiragana',
    'hiragana-iroha',
    'horizontal',
    'hsl',
    'hsla',
    'hue',
    'hue-rotate',
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
    'japanese-formal',
    'japanese-informal',
    'justify',
    'kannada',
    'katakana',
    'katakana-iroha',
    'keep-all',
    'khmer',
    'korean-hangul-formal',
    'korean-hanja-formal',
    'korean-hanja-informal',
    'landscape',
    'lao',
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
    'lower-alpha',
    'lower-armenian',
    'lower-greek',
    'lower-hexadecimal',
    'lower-latin',
    'lower-norwegian',
    'lower-roman',
    'lowercase',
    'ltr',
    'luminosity',
    'malayalam',
    'manipulation',
    'match',
    'matrix',
    'matrix3d',
    'media-play-button',
    'media-slider',
    'media-sliderthumb',
    'media-volume-slider',
    'media-volume-sliderthumb',
    'medium',
    'menu',
    'menulist',
    'menulist-button',
    'menutext',
    'message-box',
    'middle',
    'min-intrinsic',
    'mix',
    'mongolian',
    'monospace',
    'move',
    'multiple',
    'multiple_mask_images',
    'multiply',
    'myanmar',
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
    'octal',
    'opacity',
    'open-quote',
    'optimizeLegibility',
    'optimizeSpeed',
    'oriya',
    'oromo',
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
    'persian',
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
    'repeating-conic-gradient',
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
    'saturate',
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
    'searchfield',
    'searchfield-cancel-button',
    'searchfield-decoration',
    'searchfield-results-button',
    'searchfield-results-decoration',
    'self-start',
    'self-end',
    'semi-condensed',
    'semi-expanded',
    'separate',
    'sepia',
    'serif',
    'show',
    'sidama',
    'simp-chinese-formal',
    'simp-chinese-informal',
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
    'somali',
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
    'square-button',
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
    'tamil',
    'telugu',
    'text',
    'text-bottom',
    'text-top',
    'textarea',
    'textfield',
    'thai',
    'thick',
    'thin',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedshadow',
    'tibetan',
    'tigre',
    'tigrinya-er',
    'tigrinya-er-abegede',
    'tigrinya-et',
    'tigrinya-et-abegede',
    'to',
    'top',
    'trad-chinese-formal',
    'trad-chinese-informal',
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
    'upper-alpha',
    'upper-armenian',
    'upper-greek',
    'upper-hexadecimal',
    'upper-latin',
    'upper-norwegian',
    'upper-roman',
    'uppercase',
    'urdu',
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
  ],
  fe = M(me),
  he = R.concat(J).concat(ee).concat(re).concat(oe).concat(ie).concat(pe).concat(me);
const ge = { properties: oe, colors: pe, fonts: le, values: me, all: he },
  be = {
    documentTypes: G,
    mediaTypes: Q,
    mediaFeatures: te,
    mediaValueKeywords: ne,
    propertyKeywords: ae,
    nonStandardPropertyKeywords: se,
    fontProperties: ce,
    counterDescriptors: de,
    colorKeywords: ue,
    valueKeywords: fe,
    tokenHooks: {
      '/': function (e, t) {
        return !!e.eat('*') && ((t.tokenize = ye), ye(e, t));
      },
    },
  },
  ke = I({});
function ye(e, t) {
  for (var r, n = !1; null != (r = e.next()); ) {
    if (n && '/' == r) {
      t.tokenize = null;
      break;
    }
    n = '*' == r;
  }
  return ['comment', 'comment'];
}
const we = I({
    mediaTypes: Q,
    mediaFeatures: te,
    mediaValueKeywords: ne,
    propertyKeywords: ae,
    nonStandardPropertyKeywords: se,
    colorKeywords: ue,
    valueKeywords: fe,
    fontProperties: ce,
    allowNested: !0,
    lineComment: '//',
    tokenHooks: {
      '/': function (e, t) {
        return e.eat('/')
          ? (e.skipToEnd(), ['comment', 'comment'])
          : e.eat('*')
          ? ((t.tokenize = ye), ye(e, t))
          : ['operator', 'operator'];
      },
      ':': function (e) {
        return !!e.match(/^\s*\{/, !1) && [null, null];
      },
      $: function (e) {
        return (
          e.match(/^[\w-]+/),
          e.match(/^\s*:/, !1) ? ['def', 'variable-definition'] : ['variableName.special', 'variable']
        );
      },
      '#': function (e) {
        return !!e.eat('{') && [null, 'interpolation'];
      },
    },
  }),
  ve = I({
    mediaTypes: Q,
    mediaFeatures: te,
    mediaValueKeywords: ne,
    propertyKeywords: ae,
    nonStandardPropertyKeywords: se,
    colorKeywords: ue,
    valueKeywords: fe,
    fontProperties: ce,
    allowNested: !0,
    lineComment: '//',
    tokenHooks: {
      '/': function (e, t) {
        return e.eat('/')
          ? (e.skipToEnd(), ['comment', 'comment'])
          : e.eat('*')
          ? ((t.tokenize = ye), ye(e, t))
          : ['operator', 'operator'];
      },
      '@': function (e) {
        return e.eat('{')
          ? [null, 'interpolation']
          : !e.match(
              /^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i,
              !1,
            ) &&
              (e.eatWhile(/[\w\\\-]/),
              e.match(/^\s*:/, !1) ? ['def', 'variable-definition'] : ['variableName', 'variable']);
      },
      '&': function () {
        return ['atom', 'atom'];
      },
    },
  }),
  xe = I({
    documentTypes: G,
    mediaTypes: Q,
    mediaFeatures: te,
    propertyKeywords: ae,
    nonStandardPropertyKeywords: se,
    fontProperties: ce,
    counterDescriptors: de,
    colorKeywords: ue,
    valueKeywords: fe,
    supportsAtComponent: !0,
    tokenHooks: {
      '/': function (e, t) {
        return !!e.eat('*') && ((t.tokenize = ye), ye(e, t));
      },
    },
  });
var ze = Object.freeze({ __proto__: null, mkCSS: I, keywords: ge, css: ke, sCSS: we, less: ve, gss: xe });
export { E as a, ze as b, b as c, Y as s };

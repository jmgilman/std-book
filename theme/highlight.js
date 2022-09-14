/*!
  Highlight.js v11.5.1 (git: b8f233c8e2)
  (c) 2006-2022 Ivan Sagalaev and other contributors
  License: BSD-3-Clause
 */
var hljs = (function () {
    "use strict";
    var e = { exports: {} };
    function t(e) {
        return (
            e instanceof Map
                ? (e.clear =
                    e.delete =
                    e.set =
                    () => {
                        throw Error("map is read-only");
                    })
                : e instanceof Set &&
                (e.add =
                    e.clear =
                    e.delete =
                    () => {
                        throw Error("set is read-only");
                    }),
            Object.freeze(e),
            Object.getOwnPropertyNames(e).forEach((n) => {
                var i = e[n];
                "object" != typeof i || Object.isFrozen(i) || t(i);
            }),
            e
        );
    }
    (e.exports = t), (e.exports.default = t);
    var n = e.exports;
    class i {
        constructor(e) {
            void 0 === e.data && (e.data = {}),
                (this.data = e.data),
                (this.isMatchIgnored = !1);
        }
        ignoreMatch() {
            this.isMatchIgnored = !0;
        }
    }
    function r(e) {
        return e
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");
    }
    function s(e, ...t) {
        const n = Object.create(null);
        for (const t in e) n[t] = e[t];
        return (
            t.forEach((e) => {
                for (const t in e) n[t] = e[t];
            }),
            n
        );
    }
    const o = (e) => !!e.kind;
    class a {
        constructor(e, t) {
            (this.buffer = ""), (this.classPrefix = t.classPrefix), e.walk(this);
        }
        addText(e) {
            this.buffer += r(e);
        }
        openNode(e) {
            if (!o(e)) return;
            let t = e.kind;
            (t = e.sublanguage
                ? "language-" + t
                : ((e, { prefix: t }) => {
                    if (e.includes(".")) {
                        const n = e.split(".");
                        return [
                            `${t}${n.shift()}`,
                            ...n.map((e, t) => `${e}${"_".repeat(t + 1)}`),
                        ].join(" ");
                    }
                    return `${t}${e}`;
                })(t, { prefix: this.classPrefix })),
                this.span(t);
        }
        closeNode(e) {
            o(e) && (this.buffer += "</span>");
        }
        value() {
            return this.buffer;
        }
        span(e) {
            this.buffer += `<span class="${e}">`;
        }
    }
    class c {
        constructor() {
            (this.rootNode = {
                children: [],
            }),
                (this.stack = [this.rootNode]);
        }
        get top() {
            return this.stack[this.stack.length - 1];
        }
        get root() {
            return this.rootNode;
        }
        add(e) {
            this.top.children.push(e);
        }
        openNode(e) {
            const t = { kind: e, children: [] };
            this.add(t), this.stack.push(t);
        }
        closeNode() {
            if (this.stack.length > 1) return this.stack.pop();
        }
        closeAllNodes() {
            for (; this.closeNode(););
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4);
        }
        walk(e) {
            return this.constructor._walk(e, this.rootNode);
        }
        static _walk(e, t) {
            return (
                "string" == typeof t
                    ? e.addText(t)
                    : t.children &&
                    (e.openNode(t),
                        t.children.forEach((t) => this._walk(e, t)),
                        e.closeNode(t)),
                e
            );
        }
        static _collapse(e) {
            "string" != typeof e &&
                e.children &&
                (e.children.every((e) => "string" == typeof e)
                    ? (e.children = [e.children.join("")])
                    : e.children.forEach((e) => {
                        c._collapse(e);
                    }));
        }
    }
    class l extends c {
        constructor(e) {
            super(), (this.options = e);
        }
        addKeyword(e, t) {
            "" !== e && (this.openNode(t), this.addText(e), this.closeNode());
        }
        addText(e) {
            "" !== e && this.add(e);
        }
        addSublanguage(e, t) {
            const n = e.root;
            (n.kind = t), (n.sublanguage = !0), this.add(n);
        }
        toHTML() {
            return new a(this, this.options).value();
        }
        finalize() {
            return !0;
        }
    }
    function g(e) {
        return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function d(e) {
        return f("(?=", e, ")");
    }
    function u(e) {
        return f("(?:", e, ")*");
    }
    function h(e) {
        return f("(?:", e, ")?");
    }
    function f(...e) {
        return e.map((e) => g(e)).join("");
    }
    function p(...e) {
        const t = ((e) => {
            const t = e[e.length - 1];
            return "object" == typeof t && t.constructor === Object
                ? (e.splice(e.length - 1, 1), t)
                : {};
        })(e);
        return "(" + (t.capture ? "" : "?:") + e.map((e) => g(e)).join("|") + ")";
    }
    function b(e) {
        return RegExp(e.toString() + "|").exec("").length - 1;
    }
    const m = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function E(e, { joinWith: t }) {
        let n = 0;
        return e
            .map((e) => {
                n += 1;
                const t = n;
                let i = g(e),
                    r = "";
                for (; i.length > 0;) {
                    const e = m.exec(i);
                    if (!e) {
                        r += i;
                        break;
                    }
                    (r += i.substring(0, e.index)),
                        (i = i.substring(e.index + e[0].length)),
                        "\\" === e[0][0] && e[1]
                            ? (r += "\\" + (Number(e[1]) + t))
                            : ((r += e[0]), "(" === e[0] && n++);
                }
                return r;
            })
            .map((e) => `(${e})`)
            .join(t);
    }
    const x = "[a-zA-Z]\\w*",
        w = "[a-zA-Z_]\\w*",
        y = "\\b\\d+(\\.\\d+)?",
        _ =
            "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        k = "\\b(0b[01]+)",
        v = {
            begin: "\\\\[\\s\\S]",
            relevance: 0,
        },
        O = {
            scope: "string",
            begin: "'",
            end: "'",
            illegal: "\\n",
            contains: [v],
        },
        N = {
            scope: "string",
            begin: '"',
            end: '"',
            illegal: "\\n",
            contains: [v],
        },
        M = (e, t, n = {}) => {
            const i = s({ scope: "comment", begin: e, end: t, contains: [] }, n);
            i.contains.push({
                scope: "doctag",
                begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
                end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
                excludeBegin: !0,
                relevance: 0,
            });
            const r = p(
                "I",
                "a",
                "is",
                "so",
                "us",
                "to",
                "at",
                "if",
                "in",
                "it",
                "on",
                /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
                /[A-Za-z]+[-][a-z]+/,
                /[A-Za-z][a-z]{2,}/
            );
            return (
                i.contains.push({
                    begin: f(/[ ]+/, "(", r, /[.]?[:]?([.][ ]|[ ])/, "){3}"),
                }),
                i
            );
        },
        S = M("//", "$"),
        R = M("/\\*", "\\*/"),
        j = M("#", "$");
    var A = Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: /\b\B/,
        IDENT_RE: x,
        UNDERSCORE_IDENT_RE: w,
        NUMBER_RE: y,
        C_NUMBER_RE: _,
        BINARY_NUMBER_RE: k,
        RE_STARTERS_RE:
            "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
        SHEBANG: (e = {}) => {
            const t = /^#![ ]*\//;
            return (
                e.binary && (e.begin = f(t, /.*\b/, e.binary, /\b.*/)),
                s(
                    {
                        scope: "meta",
                        begin: t,
                        end: /$/,
                        relevance: 0,
                        "on:begin": (e, t) => {
                            0 !== e.index && t.ignoreMatch();
                        },
                    },
                    e
                )
            );
        },
        BACKSLASH_ESCAPE: v,
        APOS_STRING_MODE: O,
        QUOTE_STRING_MODE: N,
        PHRASAL_WORDS_MODE: {
            begin:
                /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
        },
        COMMENT: M,
        C_LINE_COMMENT_MODE: S,
        C_BLOCK_COMMENT_MODE: R,
        HASH_COMMENT_MODE: j,
        NUMBER_MODE: { scope: "number", begin: y, relevance: 0 },
        C_NUMBER_MODE: { scope: "number", begin: _, relevance: 0 },
        BINARY_NUMBER_MODE: { scope: "number", begin: k, relevance: 0 },
        REGEXP_MODE: {
            begin: /(?=\/[^/\n]*\/)/,
            contains: [
                {
                    scope: "regexp",
                    begin: /\//,
                    end: /\/[gimuy]*/,
                    illegal: /\n/,
                    contains: [
                        v,
                        { begin: /\[/, end: /\]/, relevance: 0, contains: [v] },
                    ],
                },
            ],
        },
        TITLE_MODE: { scope: "title", begin: x, relevance: 0 },
        UNDERSCORE_TITLE_MODE: { scope: "title", begin: w, relevance: 0 },
        METHOD_GUARD: {
            begin: "\\.\\s*[a-zA-Z_]\\w*",
            relevance: 0,
        },
        END_SAME_AS_BEGIN: (e) =>
            Object.assign(e, {
                "on:begin": (e, t) => {
                    t.data._beginMatch = e[1];
                },
                "on:end": (e, t) => {
                    t.data._beginMatch !== e[1] && t.ignoreMatch();
                },
            }),
    });
    function I(e, t) {
        "." === e.input[e.index - 1] && t.ignoreMatch();
    }
    function T(e, t) {
        void 0 !== e.className && ((e.scope = e.className), delete e.className);
    }
    function L(e, t) {
        t &&
            e.beginKeywords &&
            ((e.begin =
                "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)"),
                (e.__beforeBegin = I),
                (e.keywords = e.keywords || e.beginKeywords),
                delete e.beginKeywords,
                void 0 === e.relevance && (e.relevance = 0));
    }
    function B(e, t) {
        Array.isArray(e.illegal) && (e.illegal = p(...e.illegal));
    }
    function D(e, t) {
        if (e.match) {
            if (e.begin || e.end)
                throw Error("begin & end are not supported with match");
            (e.begin = e.match), delete e.match;
        }
    }
    function H(e, t) {
        void 0 === e.relevance && (e.relevance = 1);
    }
    const P = (e, t) => {
        if (!e.beforeMatch) return;
        if (e.starts) throw Error("beforeMatch cannot be used with starts");
        const n = Object.assign({}, e);
        Object.keys(e).forEach((t) => {
            delete e[t];
        }),
            (e.keywords = n.keywords),
            (e.begin = f(n.beforeMatch, d(n.begin))),
            (e.starts = {
                relevance: 0,
                contains: [Object.assign(n, { endsParent: !0 })],
            }),
            (e.relevance = 0),
            delete n.beforeMatch;
    },
        C = [
            "of",
            "and",
            "for",
            "in",
            "not",
            "or",
            "if",
            "then",
            "parent",
            "list",
            "value",
        ];
    function $(e, t, n = "keyword") {
        const i = Object.create(null);
        return (
            "string" == typeof e
                ? r(n, e.split(" "))
                : Array.isArray(e)
                    ? r(n, e)
                    : Object.keys(e).forEach((n) => {
                        Object.assign(i, $(e[n], t, n));
                    }),
            i
        );
        function r(e, n) {
            t && (n = n.map((e) => e.toLowerCase())),
                n.forEach((t) => {
                    const n = t.split("|");
                    i[n[0]] = [e, U(n[0], n[1])];
                });
        }
    }
    function U(e, t) {
        return t ? Number(t) : ((e) => C.includes(e.toLowerCase()))(e) ? 0 : 1;
    }
    const z = {},
        K = (e) => {
            console.error(e);
        },
        W = (e, ...t) => {
            console.log("WARN: " + e, ...t);
        },
        X = (e, t) => {
            z[`${e}/${t}`] ||
                (console.log(`Deprecated as of ${e}. ${t}`), (z[`${e}/${t}`] = !0));
        },
        G = Error();
    function Z(e, t, { key: n }) {
        let i = 0;
        const r = e[n],
            s = {},
            o = {};
        for (let e = 1; e <= t.length; e++)
            (o[e + i] = r[e]), (s[e + i] = !0), (i += b(t[e - 1]));
        (e[n] = o), (e[n]._emit = s), (e[n]._multi = !0);
    }
    function F(e) {
        ((e) => {
            e.scope &&
                "object" == typeof e.scope &&
                null !== e.scope &&
                ((e.beginScope = e.scope), delete e.scope);
        })(e),
            "string" == typeof e.beginScope &&
            (e.beginScope = {
                _wrap: e.beginScope,
            }),
            "string" == typeof e.endScope && (e.endScope = { _wrap: e.endScope }),
            ((e) => {
                if (Array.isArray(e.begin)) {
                    if (e.skip || e.excludeBegin || e.returnBegin)
                        throw (
                            (K(
                                "skip, excludeBegin, returnBegin not compatible with beginScope: {}"
                            ),
                                G)
                        );
                    if ("object" != typeof e.beginScope || null === e.beginScope)
                        throw (K("beginScope must be object"), G);
                    Z(e, e.begin, { key: "beginScope" }),
                        (e.begin = E(e.begin, { joinWith: "" }));
                }
            })(e),
            ((e) => {
                if (Array.isArray(e.end)) {
                    if (e.skip || e.excludeEnd || e.returnEnd)
                        throw (
                            (K(
                                "skip, excludeEnd, returnEnd not compatible with endScope: {}"
                            ),
                                G)
                        );
                    if ("object" != typeof e.endScope || null === e.endScope)
                        throw (K("endScope must be object"), G);
                    Z(e, e.end, { key: "endScope" }),
                        (e.end = E(e.end, { joinWith: "" }));
                }
            })(e);
    }
    function V(e) {
        function t(t, n) {
            return RegExp(
                g(t),
                "m" +
                (e.case_insensitive ? "i" : "") +
                (e.unicodeRegex ? "u" : "") +
                (n ? "g" : "")
            );
        }
        class n {
            constructor() {
                (this.matchIndexes = {}),
                    (this.regexes = []),
                    (this.matchAt = 1),
                    (this.position = 0);
            }
            addRule(e, t) {
                (t.position = this.position++),
                    (this.matchIndexes[this.matchAt] = t),
                    this.regexes.push([t, e]),
                    (this.matchAt += b(e) + 1);
            }
            compile() {
                0 === this.regexes.length && (this.exec = () => null);
                const e = this.regexes.map((e) => e[1]);
                (this.matcherRe = t(E(e, { joinWith: "|" }), !0)), (this.lastIndex = 0);
            }
            exec(e) {
                this.matcherRe.lastIndex = this.lastIndex;
                const t = this.matcherRe.exec(e);
                if (!t) return null;
                const n = t.findIndex((e, t) => t > 0 && void 0 !== e),
                    i = this.matchIndexes[n];
                return t.splice(0, n), Object.assign(t, i);
            }
        }
        class i {
            constructor() {
                (this.rules = []),
                    (this.multiRegexes = []),
                    (this.count = 0),
                    (this.lastIndex = 0),
                    (this.regexIndex = 0);
            }
            getMatcher(e) {
                if (this.multiRegexes[e]) return this.multiRegexes[e];
                const t = new n();
                return (
                    this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)),
                    t.compile(),
                    (this.multiRegexes[e] = t),
                    t
                );
            }
            resumingScanAtSamePosition() {
                return 0 !== this.regexIndex;
            }
            considerAll() {
                this.regexIndex = 0;
            }
            addRule(e, t) {
                this.rules.push([e, t]), "begin" === t.type && this.count++;
            }
            exec(e) {
                const t = this.getMatcher(this.regexIndex);
                t.lastIndex = this.lastIndex;
                let n = t.exec(e);
                if (this.resumingScanAtSamePosition())
                    if (n && n.index === this.lastIndex);
                    else {
                        const t = this.getMatcher(0);
                        (t.lastIndex = this.lastIndex + 1), (n = t.exec(e));
                    }
                return (
                    n &&
                    ((this.regexIndex += n.position + 1),
                        this.regexIndex === this.count && this.considerAll()),
                    n
                );
            }
        }
        if (
            (e.compilerExtensions || (e.compilerExtensions = []),
                e.contains && e.contains.includes("self"))
        )
            throw Error(
                "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
            );
        return (
            (e.classNameAliases = s(e.classNameAliases || {})),
            (function n(r, o) {
                const a = r;
                if (r.isCompiled) return a;
                [T, D, F, P].forEach((e) => e(r, o)),
                    e.compilerExtensions.forEach((e) => e(r, o)),
                    (r.__beforeBegin = null),
                    [L, B, H].forEach((e) => e(r, o)),
                    (r.isCompiled = !0);
                let c = null;
                return (
                    "object" == typeof r.keywords &&
                    r.keywords.$pattern &&
                    ((r.keywords = Object.assign({}, r.keywords)),
                        (c = r.keywords.$pattern),
                        delete r.keywords.$pattern),
                    (c = c || /\w+/),
                    r.keywords && (r.keywords = $(r.keywords, e.case_insensitive)),
                    (a.keywordPatternRe = t(c, !0)),
                    o &&
                    (r.begin || (r.begin = /\B|\b/),
                        (a.beginRe = t(a.begin)),
                        r.end || r.endsWithParent || (r.end = /\B|\b/),
                        r.end && (a.endRe = t(a.end)),
                        (a.terminatorEnd = g(a.end) || ""),
                        r.endsWithParent &&
                        o.terminatorEnd &&
                        (a.terminatorEnd += (r.end ? "|" : "") + o.terminatorEnd)),
                    r.illegal && (a.illegalRe = t(r.illegal)),
                    r.contains || (r.contains = []),
                    (r.contains = [].concat(
                        ...r.contains.map((e) =>
                            ((e) => (
                                e.variants &&
                                !e.cachedVariants &&
                                (e.cachedVariants = e.variants.map((t) =>
                                    s(
                                        e,
                                        {
                                            variants: null,
                                        },
                                        t
                                    )
                                )),
                                e.cachedVariants
                                    ? e.cachedVariants
                                    : q(e)
                                        ? s(e, {
                                            starts: e.starts ? s(e.starts) : null,
                                        })
                                        : Object.isFrozen(e)
                                            ? s(e)
                                            : e
                            ))("self" === e ? r : e)
                        )
                    )),
                    r.contains.forEach((e) => {
                        n(e, a);
                    }),
                    r.starts && n(r.starts, o),
                    (a.matcher = ((e) => {
                        const t = new i();
                        return (
                            e.contains.forEach((e) =>
                                t.addRule(e.begin, { rule: e, type: "begin" })
                            ),
                            e.terminatorEnd && t.addRule(e.terminatorEnd, { type: "end" }),
                            e.illegal && t.addRule(e.illegal, { type: "illegal" }),
                            t
                        );
                    })(a)),
                    a
                );
            })(e)
        );
    }
    function q(e) {
        return !!e && (e.endsWithParent || q(e.starts));
    }
    class J extends Error {
        constructor(e, t) {
            super(e), (this.name = "HTMLInjectionError"), (this.html = t);
        }
    }
    const Y = r,
        Q = s,
        ee = Symbol("nomatch");
    var te = ((e) => {
        const t = Object.create(null),
            r = Object.create(null),
            s = [];
        let o = !0;
        const a =
            "Could not find the language '{}', did you forget to load/include a language module?",
            c = {
                disableAutodetect: !0,
                name: "Plain text",
                contains: [],
            };
        let g = {
            ignoreUnescapedHTML: !1,
            throwUnescapedHTML: !1,
            noHighlightRe: /^(no-?highlight)$/i,
            languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
            classPrefix: "hljs-",
            cssSelector: "pre code",
            languages: null,
            __emitter: l,
        };
        function b(e) {
            return g.noHighlightRe.test(e);
        }
        function m(e, t, n) {
            let i = "",
                r = "";
            "object" == typeof t
                ? ((i = e), (n = t.ignoreIllegals), (r = t.language))
                : (X("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
                    X(
                        "10.7.0",
                        "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"
                    ),
                    (r = e),
                    (i = t)),
                void 0 === n && (n = !0);
            const s = { code: i, language: r };
            N("before:highlight", s);
            const o = s.result ? s.result : E(s.language, s.code, n);
            return (o.code = s.code), N("after:highlight", o), o;
        }
        function E(e, n, r, s) {
            const c = Object.create(null);
            function l() {
                if (!O.keywords) return void M.addText(S);
                let e = 0;
                O.keywordPatternRe.lastIndex = 0;
                let t = O.keywordPatternRe.exec(S),
                    n = "";
                for (; t;) {
                    n += S.substring(e, t.index);
                    const r = y.case_insensitive ? t[0].toLowerCase() : t[0],
                        s = ((i = r), O.keywords[i]);
                    if (s) {
                        const [e, i] = s;
                        if (
                            (M.addText(n),
                                (n = ""),
                                (c[r] = (c[r] || 0) + 1),
                                c[r] <= 7 && (R += i),
                                e.startsWith("_"))
                        )
                            n += t[0];
                        else {
                            const n = y.classNameAliases[e] || e;
                            M.addKeyword(t[0], n);
                        }
                    } else n += t[0];
                    (e = O.keywordPatternRe.lastIndex), (t = O.keywordPatternRe.exec(S));
                }
                var i;
                (n += S.substr(e)), M.addText(n);
            }
            function d() {
                null != O.subLanguage
                    ? (() => {
                        if ("" === S) return;
                        let e = null;
                        if ("string" == typeof O.subLanguage) {
                            if (!t[O.subLanguage]) return void M.addText(S);
                            (e = E(O.subLanguage, S, !0, N[O.subLanguage])),
                                (N[O.subLanguage] = e._top);
                        } else e = x(S, O.subLanguage.length ? O.subLanguage : null);
                        O.relevance > 0 && (R += e.relevance),
                            M.addSublanguage(e._emitter, e.language);
                    })()
                    : l(),
                    (S = "");
            }
            function u(e, t) {
                let n = 1;
                const i = t.length - 1;
                for (; n <= i;) {
                    if (!e._emit[n]) {
                        n++;
                        continue;
                    }
                    const i = y.classNameAliases[e[n]] || e[n],
                        r = t[n];
                    i ? M.addKeyword(r, i) : ((S = r), l(), (S = "")), n++;
                }
            }
            function h(e, t) {
                return (
                    e.scope &&
                    "string" == typeof e.scope &&
                    M.openNode(y.classNameAliases[e.scope] || e.scope),
                    e.beginScope &&
                    (e.beginScope._wrap
                        ? (M.addKeyword(
                            S,
                            y.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap
                        ),
                            (S = ""))
                        : e.beginScope._multi && (u(e.beginScope, t), (S = ""))),
                    (O = Object.create(e, {
                        parent: {
                            value: O,
                        },
                    })),
                    O
                );
            }
            function f(e, t, n) {
                let r = ((e, t) => {
                    const n = e && e.exec(t);
                    return n && 0 === n.index;
                })(e.endRe, n);
                if (r) {
                    if (e["on:end"]) {
                        const n = new i(e);
                        e["on:end"](t, n), n.isMatchIgnored && (r = !1);
                    }
                    if (r) {
                        for (; e.endsParent && e.parent;) e = e.parent;
                        return e;
                    }
                }
                if (e.endsWithParent) return f(e.parent, t, n);
            }
            function p(e) {
                return 0 === O.matcher.regexIndex ? ((S += e[0]), 1) : ((I = !0), 0);
            }
            function b(e) {
                const t = e[0],
                    i = n.substr(e.index),
                    r = f(O, e, i);
                if (!r) return ee;
                const s = O;
                O.endScope && O.endScope._wrap
                    ? (d(), M.addKeyword(t, O.endScope._wrap))
                    : O.endScope && O.endScope._multi
                        ? (d(), u(O.endScope, e))
                        : s.skip
                            ? (S += t)
                            : (s.returnEnd || s.excludeEnd || (S += t),
                                d(),
                                s.excludeEnd && (S = t));
                do {
                    O.scope && M.closeNode(),
                        O.skip || O.subLanguage || (R += O.relevance),
                        (O = O.parent);
                } while (O !== r.parent);
                return r.starts && h(r.starts, e), s.returnEnd ? 0 : t.length;
            }
            let m = {};
            function w(t, s) {
                const a = s && s[0];
                if (((S += t), null == a)) return d(), 0;
                if (
                    "begin" === m.type &&
                    "end" === s.type &&
                    m.index === s.index &&
                    "" === a
                ) {
                    if (((S += n.slice(s.index, s.index + 1)), !o)) {
                        const t = Error(`0 width match regex (${e})`);
                        throw ((t.languageName = e), (t.badRule = m.rule), t);
                    }
                    return 1;
                }
                if (((m = s), "begin" === s.type))
                    return ((e) => {
                        const t = e[0],
                            n = e.rule,
                            r = new i(n),
                            s = [n.__beforeBegin, n["on:begin"]];
                        for (const n of s)
                            if (n && (n(e, r), r.isMatchIgnored)) return p(t);
                        return (
                            n.skip
                                ? (S += t)
                                : (n.excludeBegin && (S += t),
                                    d(),
                                    n.returnBegin || n.excludeBegin || (S = t)),
                            h(n, e),
                            n.returnBegin ? 0 : t.length
                        );
                    })(s);
                if ("illegal" === s.type && !r) {
                    const e = Error(
                        'Illegal lexeme "' +
                        a +
                        '" for mode "' +
                        (O.scope || "<unnamed>") +
                        '"'
                    );
                    throw ((e.mode = O), e);
                }
                if ("end" === s.type) {
                    const e = b(s);
                    if (e !== ee) return e;
                }
                if ("illegal" === s.type && "" === a) return 1;
                if (A > 1e5 && A > 3 * s.index)
                    throw Error(
                        "potential infinite loop, way more iterations than matches"
                    );
                return (S += a), a.length;
            }
            const y = k(e);
            if (!y)
                throw (K(a.replace("{}", e)), Error('Unknown language: "' + e + '"'));
            const _ = V(y);
            let v = "",
                O = s || _;
            const N = {},
                M = new g.__emitter(g);
            (() => {
                const e = [];
                for (let t = O; t !== y; t = t.parent) t.scope && e.unshift(t.scope);
                e.forEach((e) => M.openNode(e));
            })();
            let S = "",
                R = 0,
                j = 0,
                A = 0,
                I = !1;
            try {
                for (O.matcher.considerAll(); ;) {
                    A++,
                        I ? (I = !1) : O.matcher.considerAll(),
                        (O.matcher.lastIndex = j);
                    const e = O.matcher.exec(n);
                    if (!e) break;
                    const t = w(n.substring(j, e.index), e);
                    j = e.index + t;
                }
                return (
                    w(n.substr(j)),
                    M.closeAllNodes(),
                    M.finalize(),
                    (v = M.toHTML()),
                    {
                        language: e,
                        value: v,
                        relevance: R,
                        illegal: !1,
                        _emitter: M,
                        _top: O,
                    }
                );
            } catch (t) {
                if (t.message && t.message.includes("Illegal"))
                    return {
                        language: e,
                        value: Y(n),
                        illegal: !0,
                        relevance: 0,
                        _illegalBy: {
                            message: t.message,
                            index: j,
                            context: n.slice(j - 100, j + 100),
                            mode: t.mode,
                            resultSoFar: v,
                        },
                        _emitter: M,
                    };
                if (o)
                    return {
                        language: e,
                        value: Y(n),
                        illegal: !1,
                        relevance: 0,
                        errorRaised: t,
                        _emitter: M,
                        _top: O,
                    };
                throw t;
            }
        }
        function x(e, n) {
            n = n || g.languages || Object.keys(t);
            const i = ((e) => {
                const t = {
                    value: Y(e),
                    illegal: !1,
                    relevance: 0,
                    _top: c,
                    _emitter: new g.__emitter(g),
                };
                return t._emitter.addText(e), t;
            })(e),
                r = n
                    .filter(k)
                    .filter(O)
                    .map((t) => E(t, e, !1));
            r.unshift(i);
            const s = r.sort((e, t) => {
                if (e.relevance !== t.relevance) return t.relevance - e.relevance;
                if (e.language && t.language) {
                    if (k(e.language).supersetOf === t.language) return 1;
                    if (k(t.language).supersetOf === e.language) return -1;
                }
                return 0;
            }),
                [o, a] = s,
                l = o;
            return (l.secondBest = a), l;
        }
        function w(e) {
            let t = null;
            const n = ((e) => {
                let t = e.className + " ";
                t += e.parentNode ? e.parentNode.className : "";
                const n = g.languageDetectRe.exec(t);
                if (n) {
                    const t = k(n[1]);
                    return (
                        t ||
                        (W(a.replace("{}", n[1])),
                            W("Falling back to no-highlight mode for this block.", e)),
                        t ? n[1] : "no-highlight"
                    );
                }
                return t.split(/\s+/).find((e) => b(e) || k(e));
            })(e);
            if (b(n)) return;
            if (
                (N("before:highlightElement", { el: e, language: n }),
                    e.children.length > 0 &&
                    (g.ignoreUnescapedHTML ||
                        (console.warn(
                            "One of your code blocks includes unescaped HTML. This is a potentially serious security risk."
                        ),
                            console.warn(
                                "https://github.com/highlightjs/highlight.js/wiki/security"
                            ),
                            console.warn("The element with unescaped HTML:"),
                            console.warn(e)),
                        g.throwUnescapedHTML))
            )
                throw new J(
                    "One of your code blocks includes unescaped HTML.",
                    e.innerHTML
                );
            t = e;
            const i = t.textContent,
                s = n ? m(i, { language: n, ignoreIllegals: !0 }) : x(i);
            (e.innerHTML = s.value),
                ((e, t, n) => {
                    const i = (t && r[t]) || n;
                    e.classList.add("hljs"), e.classList.add("language-" + i);
                })(e, n, s.language),
                (e.result = {
                    language: s.language,
                    re: s.relevance,
                    relevance: s.relevance,
                }),
                s.secondBest &&
                (e.secondBest = {
                    language: s.secondBest.language,
                    relevance: s.secondBest.relevance,
                }),
                N("after:highlightElement", { el: e, result: s, text: i });
        }
        let y = !1;
        function _() {
            "loading" !== document.readyState
                ? document.querySelectorAll(g.cssSelector).forEach(w)
                : (y = !0);
        }
        function k(e) {
            return (e = (e || "").toLowerCase()), t[e] || t[r[e]];
        }
        function v(e, { languageName: t }) {
            "string" == typeof e && (e = [e]),
                e.forEach((e) => {
                    r[e.toLowerCase()] = t;
                });
        }
        function O(e) {
            const t = k(e);
            return t && !t.disableAutodetect;
        }
        function N(e, t) {
            const n = e;
            s.forEach((e) => {
                e[n] && e[n](t);
            });
        }
        "undefined" != typeof window &&
            window.addEventListener &&
            window.addEventListener(
                "DOMContentLoaded",
                () => {
                    y && _();
                },
                !1
            ),
            Object.assign(e, {
                highlight: m,
                highlightAuto: x,
                highlightAll: _,
                highlightElement: w,
                highlightBlock: (e) => (
                    X("10.7.0", "highlightBlock will be removed entirely in v12.0"),
                    X("10.7.0", "Please use highlightElement now."),
                    w(e)
                ),
                configure: (e) => {
                    g = Q(g, e);
                },
                initHighlighting: () => {
                    _(),
                        X(
                            "10.6.0",
                            "initHighlighting() deprecated.  Use highlightAll() now."
                        );
                },
                initHighlightingOnLoad: () => {
                    _(),
                        X(
                            "10.6.0",
                            "initHighlightingOnLoad() deprecated.  Use highlightAll() now."
                        );
                },
                registerLanguage: (n, i) => {
                    let r = null;
                    try {
                        r = i(e);
                    } catch (e) {
                        if (
                            (K(
                                "Language definition for '{}' could not be registered.".replace(
                                    "{}",
                                    n
                                )
                            ),
                                !o)
                        )
                            throw e;
                        K(e), (r = c);
                    }
                    r.name || (r.name = n),
                        (t[n] = r),
                        (r.rawDefinition = i.bind(null, e)),
                        r.aliases &&
                        v(r.aliases, {
                            languageName: n,
                        });
                },
                unregisterLanguage: (e) => {
                    delete t[e];
                    for (const t of Object.keys(r)) r[t] === e && delete r[t];
                },
                listLanguages: () => Object.keys(t),
                getLanguage: k,
                registerAliases: v,
                autoDetection: O,
                inherit: Q,
                addPlugin: (e) => {
                    ((e) => {
                        e["before:highlightBlock"] &&
                            !e["before:highlightElement"] &&
                            (e["before:highlightElement"] = (t) => {
                                e["before:highlightBlock"](Object.assign({ block: t.el }, t));
                            }),
                            e["after:highlightBlock"] &&
                            !e["after:highlightElement"] &&
                            (e["after:highlightElement"] = (t) => {
                                e["after:highlightBlock"](Object.assign({ block: t.el }, t));
                            });
                    })(e),
                        s.push(e);
                },
            }),
            (e.debugMode = () => {
                o = !1;
            }),
            (e.safeMode = () => {
                o = !0;
            }),
            (e.versionString = "11.5.1"),
            (e.regex = {
                concat: f,
                lookahead: d,
                either: p,
                optional: h,
                anyNumberOfTimes: u,
            });
        for (const e in A) "object" == typeof A[e] && n(A[e]);
        return Object.assign(e, A), e;
    })({});
    return te;
})();
"object" == typeof exports &&
    "undefined" != typeof module &&
    (module.exports =
        hljs); /*! `json` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var e = (() => {
        "use strict";
        return (e) => ({
            name: "JSON",
            contains: [
                {
                    className: "attr",
                    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
                    relevance: 1.01,
                },
                {
                    match: /[{}[\],:]/,
                    className: "punctuation",
                    relevance: 0,
                },
                e.QUOTE_STRING_MODE,
                {
                    beginKeywords: "true false null",
                },
                e.C_NUMBER_MODE,
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
            ],
            illegal: "\\S",
        });
    })();
    hljs.registerLanguage("json", e);
})(); /*! `bash` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var e = (() => {
        "use strict";
        return (e) => {
            const s = e.regex,
                t = {},
                n = {
                    begin: /\$\{/,
                    end: /\}/,
                    contains: ["self", { begin: /:-/, contains: [t] }],
                };
            Object.assign(t, {
                className: "variable",
                variants: [
                    {
                        begin: s.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])"),
                    },
                    n,
                ],
            });
            const a = {
                className: "subst",
                begin: /\$\(/,
                end: /\)/,
                contains: [e.BACKSLASH_ESCAPE],
            },
                i = {
                    begin: /<<-?\s*(?=\w+)/,
                    starts: {
                        contains: [
                            e.END_SAME_AS_BEGIN({
                                begin: /(\w+)/,
                                end: /(\w+)/,
                                className: "string",
                            }),
                        ],
                    },
                },
                c = {
                    className: "string",
                    begin: /"/,
                    end: /"/,
                    contains: [e.BACKSLASH_ESCAPE, t, a],
                };
            a.contains.push(c);
            const o = {
                begin: /\$\(\(/,
                end: /\)\)/,
                contains: [
                    { begin: /\d+#[0-9a-f]+/, className: "number" },
                    e.NUMBER_MODE,
                    t,
                ],
            },
                r = e.SHEBANG({
                    binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
                    relevance: 10,
                }),
                l = {
                    className: "function",
                    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
                    returnBegin: !0,
                    contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
                    relevance: 0,
                };
            return {
                name: "Bash",
                aliases: ["sh"],
                keywords: {
                    $pattern: /\b[a-z][a-z0-9._-]+\b/,
                    keyword: [
                        "if",
                        "then",
                        "else",
                        "elif",
                        "fi",
                        "for",
                        "while",
                        "in",
                        "do",
                        "done",
                        "case",
                        "esac",
                        "function",
                    ],
                    literal: ["true", "false"],
                    built_in: [
                        "break",
                        "cd",
                        "continue",
                        "eval",
                        "exec",
                        "exit",
                        "export",
                        "getopts",
                        "hash",
                        "pwd",
                        "readonly",
                        "return",
                        "shift",
                        "test",
                        "times",
                        "trap",
                        "umask",
                        "unset",
                        "alias",
                        "bind",
                        "builtin",
                        "caller",
                        "command",
                        "declare",
                        "echo",
                        "enable",
                        "help",
                        "let",
                        "local",
                        "logout",
                        "mapfile",
                        "printf",
                        "read",
                        "readarray",
                        "source",
                        "type",
                        "typeset",
                        "ulimit",
                        "unalias",
                        "set",
                        "shopt",
                        "autoload",
                        "bg",
                        "bindkey",
                        "bye",
                        "cap",
                        "chdir",
                        "clone",
                        "comparguments",
                        "compcall",
                        "compctl",
                        "compdescribe",
                        "compfiles",
                        "compgroups",
                        "compquote",
                        "comptags",
                        "comptry",
                        "compvalues",
                        "dirs",
                        "disable",
                        "disown",
                        "echotc",
                        "echoti",
                        "emulate",
                        "fc",
                        "fg",
                        "float",
                        "functions",
                        "getcap",
                        "getln",
                        "history",
                        "integer",
                        "jobs",
                        "kill",
                        "limit",
                        "log",
                        "noglob",
                        "popd",
                        "print",
                        "pushd",
                        "pushln",
                        "rehash",
                        "sched",
                        "setcap",
                        "setopt",
                        "stat",
                        "suspend",
                        "ttyctl",
                        "unfunction",
                        "unhash",
                        "unlimit",
                        "unsetopt",
                        "vared",
                        "wait",
                        "whence",
                        "where",
                        "which",
                        "zcompile",
                        "zformat",
                        "zftp",
                        "zle",
                        "zmodload",
                        "zparseopts",
                        "zprof",
                        "zpty",
                        "zregexparse",
                        "zsocket",
                        "zstyle",
                        "ztcp",
                        "chcon",
                        "chgrp",
                        "chown",
                        "chmod",
                        "cp",
                        "dd",
                        "df",
                        "dir",
                        "dircolors",
                        "ln",
                        "ls",
                        "mkdir",
                        "mkfifo",
                        "mknod",
                        "mktemp",
                        "mv",
                        "realpath",
                        "rm",
                        "rmdir",
                        "shred",
                        "sync",
                        "touch",
                        "truncate",
                        "vdir",
                        "b2sum",
                        "base32",
                        "base64",
                        "cat",
                        "cksum",
                        "comm",
                        "csplit",
                        "cut",
                        "expand",
                        "fmt",
                        "fold",
                        "head",
                        "join",
                        "md5sum",
                        "nl",
                        "numfmt",
                        "od",
                        "paste",
                        "ptx",
                        "pr",
                        "sha1sum",
                        "sha224sum",
                        "sha256sum",
                        "sha384sum",
                        "sha512sum",
                        "shuf",
                        "sort",
                        "split",
                        "sum",
                        "tac",
                        "tail",
                        "tr",
                        "tsort",
                        "unexpand",
                        "uniq",
                        "wc",
                        "arch",
                        "basename",
                        "chroot",
                        "date",
                        "dirname",
                        "du",
                        "echo",
                        "env",
                        "expr",
                        "factor",
                        "groups",
                        "hostid",
                        "id",
                        "link",
                        "logname",
                        "nice",
                        "nohup",
                        "nproc",
                        "pathchk",
                        "pinky",
                        "printenv",
                        "printf",
                        "pwd",
                        "readlink",
                        "runcon",
                        "seq",
                        "sleep",
                        "stat",
                        "stdbuf",
                        "stty",
                        "tee",
                        "test",
                        "timeout",
                        "tty",
                        "uname",
                        "unlink",
                        "uptime",
                        "users",
                        "who",
                        "whoami",
                        "yes",
                    ],
                },
                contains: [
                    r,
                    e.SHEBANG(),
                    l,
                    o,
                    e.HASH_COMMENT_MODE,
                    i,
                    { match: /(\/[a-z._-]+)+/ },
                    c,
                    {
                        className: "",
                        begin: /\\"/,
                    },
                    { className: "string", begin: /'/, end: /'/ },
                    t,
                ],
            };
        };
    })();
    hljs.registerLanguage("bash", e);
})(); /*! `shell` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var s = (() => {
        "use strict";
        return (s) => ({
            name: "Shell Session",
            aliases: ["console", "shellsession"],
            contains: [
                {
                    className: "meta.prompt",
                    begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
                    starts: { end: /[^\\](?=\s*$)/, subLanguage: "bash" },
                },
            ],
        });
    })();
    hljs.registerLanguage("shell", s);
})(); /*! `ruby` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var e = (() => {
        "use strict";
        return (e) => {
            const n = e.regex,
                a =
                    "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
                s = n.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/),
                i = n.concat(s, /(::\w+)*/),
                r = {
                    "variable.constant": ["__FILE__", "__LINE__"],
                    "variable.language": ["self", "super"],
                    keyword: [
                        "alias",
                        "and",
                        "attr_accessor",
                        "attr_reader",
                        "attr_writer",
                        "begin",
                        "BEGIN",
                        "break",
                        "case",
                        "class",
                        "defined",
                        "do",
                        "else",
                        "elsif",
                        "end",
                        "END",
                        "ensure",
                        "for",
                        "if",
                        "in",
                        "include",
                        "module",
                        "next",
                        "not",
                        "or",
                        "redo",
                        "require",
                        "rescue",
                        "retry",
                        "return",
                        "then",
                        "undef",
                        "unless",
                        "until",
                        "when",
                        "while",
                        "yield",
                    ],
                    built_in: ["proc", "lambda"],
                    literal: ["true", "false", "nil"],
                },
                c = {
                    className: "doctag",
                    begin: "@[A-Za-z]+",
                },
                t = { begin: "#<", end: ">" },
                b = [
                    e.COMMENT("#", "$", { contains: [c] }),
                    e.COMMENT("^=begin", "^=end", {
                        contains: [c],
                        relevance: 10,
                    }),
                    e.COMMENT("^__END__", e.MATCH_NOTHING_RE),
                ],
                l = {
                    className: "subst",
                    begin: /#\{/,
                    end: /\}/,
                    keywords: r,
                },
                d = {
                    className: "string",
                    contains: [e.BACKSLASH_ESCAPE, l],
                    variants: [
                        { begin: /'/, end: /'/ },
                        { begin: /"/, end: /"/ },
                        { begin: /`/, end: /`/ },
                        { begin: /%[qQwWx]?\(/, end: /\)/ },
                        { begin: /%[qQwWx]?\[/, end: /\]/ },
                        { begin: /%[qQwWx]?\{/, end: /\}/ },
                        { begin: /%[qQwWx]?</, end: />/ },
                        {
                            begin: /%[qQwWx]?\//,
                            end: /\//,
                        },
                        { begin: /%[qQwWx]?%/, end: /%/ },
                        { begin: /%[qQwWx]?-/, end: /-/ },
                        { begin: /%[qQwWx]?\|/, end: /\|/ },
                        { begin: /\B\?(\\\d{1,3})/ },
                        {
                            begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/,
                        },
                        { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
                        {
                            begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/,
                        },
                        {
                            begin: /\B\?\\(c|C-)[\x20-\x7e]/,
                        },
                        { begin: /\B\?\\?\S/ },
                        {
                            begin: n.concat(
                                /<<[-~]?'?/,
                                n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)
                            ),
                            contains: [
                                e.END_SAME_AS_BEGIN({
                                    begin: /(\w+)/,
                                    end: /(\w+)/,
                                    contains: [e.BACKSLASH_ESCAPE, l],
                                }),
                            ],
                        },
                    ],
                },
                g = "[0-9](_?[0-9])*",
                o = {
                    className: "number",
                    relevance: 0,
                    variants: [
                        {
                            begin: `\\b([1-9](_?[0-9])*|0)(\\.(${g}))?([eE][+-]?(${g})|r)?i?\\b`,
                        },
                        {
                            begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b",
                        },
                        { begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
                        { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
                        {
                            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b",
                        },
                        {
                            begin: "\\b0(_?[0-7])+r?i?\\b",
                        },
                    ],
                },
                _ = {
                    variants: [
                        { match: /\(\)/ },
                        {
                            className: "params",
                            begin: /\(/,
                            end: /(?=\))/,
                            excludeBegin: !0,
                            endsParent: !0,
                            keywords: r,
                        },
                    ],
                },
                u = [
                    d,
                    {
                        variants: [
                            { match: [/class\s+/, i, /\s+<\s+/, i] },
                            {
                                match: [/class\s+/, i],
                            },
                        ],
                        scope: { 2: "title.class", 4: "title.class.inherited" },
                        keywords: r,
                    },
                    {
                        relevance: 0,
                        match: [i, /\.new[ (]/],
                        scope: { 1: "title.class" },
                    },
                    {
                        relevance: 0,
                        match: /\b[A-Z][A-Z_0-9]+\b/,
                        className: "variable.constant",
                    },
                    {
                        match: [/def/, /\s+/, a],
                        scope: { 1: "keyword", 3: "title.function" },
                        contains: [_],
                    },
                    {
                        begin: e.IDENT_RE + "::",
                    },
                    {
                        className: "symbol",
                        begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
                        relevance: 0,
                    },
                    {
                        className: "symbol",
                        begin: ":(?!\\s)",
                        contains: [d, { begin: a }],
                        relevance: 0,
                    },
                    o,
                    {
                        className: "variable",
                        begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])",
                    },
                    {
                        className: "params",
                        begin: /\|/,
                        end: /\|/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        relevance: 0,
                        keywords: r,
                    },
                    {
                        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
                        keywords: "unless",
                        contains: [
                            {
                                className: "regexp",
                                contains: [e.BACKSLASH_ESCAPE, l],
                                illegal: /\n/,
                                variants: [
                                    { begin: "/", end: "/[a-z]*" },
                                    { begin: /%r\{/, end: /\}[a-z]*/ },
                                    {
                                        begin: "%r\\(",
                                        end: "\\)[a-z]*",
                                    },
                                    { begin: "%r!", end: "![a-z]*" },
                                    { begin: "%r\\[", end: "\\][a-z]*" },
                                ],
                            },
                        ].concat(t, b),
                        relevance: 0,
                    },
                ].concat(t, b);
            (l.contains = u), (_.contains = u);
            const w = [
                { begin: /^\s*=>/, starts: { end: "$", contains: u } },
                {
                    className: "meta.prompt",
                    begin:
                        "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
                    starts: { end: "$", keywords: r, contains: u },
                },
            ];
            return (
                b.unshift(t),
                {
                    name: "Ruby",
                    aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
                    keywords: r,
                    illegal: /\/\*/,
                    contains: [e.SHEBANG({ binary: "ruby" })]
                        .concat(w)
                        .concat(b)
                        .concat(u),
                }
            );
        };
    })();
    hljs.registerLanguage("ruby", e);
})(); /*! `yaml` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var e = (() => {
        "use strict";
        return (e) => {
            const n = "true false yes no null",
                a = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
                s = {
                    className: "string",
                    relevance: 0,
                    variants: [
                        { begin: /'/, end: /'/ },
                        { begin: /"/, end: /"/ },
                        { begin: /\S+/ },
                    ],
                    contains: [
                        e.BACKSLASH_ESCAPE,
                        {
                            className: "template-variable",
                            variants: [
                                { begin: /\{\{/, end: /\}\}/ },
                                { begin: /%\{/, end: /\}/ },
                            ],
                        },
                    ],
                },
                i = e.inherit(s, {
                    variants: [
                        { begin: /'/, end: /'/ },
                        { begin: /"/, end: /"/ },
                        { begin: /[^\s,{}[\]]+/ },
                    ],
                }),
                l = {
                    end: ",",
                    endsWithParent: !0,
                    excludeEnd: !0,
                    keywords: n,
                    relevance: 0,
                },
                t = {
                    begin: /\{/,
                    end: /\}/,
                    contains: [l],
                    illegal: "\\n",
                    relevance: 0,
                },
                g = {
                    begin: "\\[",
                    end: "\\]",
                    contains: [l],
                    illegal: "\\n",
                    relevance: 0,
                },
                b = [
                    {
                        className: "attr",
                        variants: [
                            {
                                begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)",
                            },
                            { begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' },
                            {
                                begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)",
                            },
                        ],
                    },
                    { className: "meta", begin: "^---\\s*$", relevance: 10 },
                    {
                        className: "string",
                        begin:
                            "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*",
                    },
                    {
                        begin: "<%[%=-]?",
                        end: "[%-]?%>",
                        subLanguage: "ruby",
                        excludeBegin: !0,
                        excludeEnd: !0,
                        relevance: 0,
                    },
                    { className: "type", begin: "!\\w+!" + a },
                    { className: "type", begin: "!<" + a + ">" },
                    { className: "type", begin: "!" + a },
                    { className: "type", begin: "!!" + a },
                    { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
                    { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
                    { className: "bullet", begin: "-(?=[ ]|$)", relevance: 0 },
                    e.HASH_COMMENT_MODE,
                    { beginKeywords: n, keywords: { literal: n } },
                    {
                        className: "number",
                        begin:
                            "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b",
                    },
                    { className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0 },
                    t,
                    g,
                    s,
                ],
                r = [...b];
            return (
                r.pop(),
                r.push(i),
                (l.contains = r),
                { name: "YAML", case_insensitive: !0, aliases: ["yml"], contains: b }
            );
        };
    })();
    hljs.registerLanguage("yaml", e);
})(); /*! `plaintext` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var t = (() => {
        "use strict";
        return (t) => ({
            name: "Plain text",
            aliases: ["text", "txt"],
            disableAutodetect: !0,
        });
    })();
    hljs.registerLanguage("plaintext", t);
})(); /*! `nix` grammar compiled for Highlight.js 11.5.1 */
(() => {
    var e = (() => {
        "use strict";
        return (e) => {
            const n = {
                keyword: [
                    "rec",
                    "with",
                    "let",
                    "in",
                    "inherit",
                    "assert",
                    "if",
                    "else",
                    "then",
                ],
                literal: ["true", "false", "or", "and", "null"],
                built_in: [
                    "import",
                    "abort",
                    "baseNameOf",
                    "dirOf",
                    "isNull",
                    "builtins",
                    "map",
                    "removeAttrs",
                    "throw",
                    "toString",
                    "derivation",
                ],
            },
                i = { className: "subst", begin: /\$\{/, end: /\}/, keywords: n },
                s = {
                    className: "string",
                    contains: [i],
                    variants: [
                        { begin: "''", end: "''" },
                        { begin: '"', end: '"' },
                    ],
                },
                t = [
                    e.NUMBER_MODE,
                    e.HASH_COMMENT_MODE,
                    e.C_BLOCK_COMMENT_MODE,
                    s,
                    {
                        begin: /[a-zA-Z0-9-_]+(\s*=)/,
                        returnBegin: !0,
                        relevance: 0,
                        contains: [
                            {
                                className: "attr",
                                begin: /\S+/,
                                relevance: 0.2,
                            },
                        ],
                    },
                ];
            return (
                (i.contains = t),
                { name: "Nix", aliases: ["nixos"], keywords: n, contains: t }
            );
        };
    })();
    hljs.registerLanguage("nix", e);
})();
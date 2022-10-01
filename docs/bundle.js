/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/cerke_online_api/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/cerke_online_api/lib/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./type__message */ "./node_modules/cerke_online_api/lib/type__message.js"), exports);
__exportStar(__webpack_require__(/*! ./tactics */ "./node_modules/cerke_online_api/lib/tactics.js"), exports);
__exportStar(__webpack_require__(/*! ./other_types */ "./node_modules/cerke_online_api/lib/other_types.js"), exports);


/***/ }),

/***/ "./node_modules/cerke_online_api/lib/other_types.js":
/*!**********************************************************!*\
  !*** ./node_modules/cerke_online_api/lib/other_types.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Theoretically speaking, it is necessary to distinguish x32 and x64
 * because it is possible to score 1 point (3+3-5).
 * Not that it will ever be of use in any real situation.
 */ 


/***/ }),

/***/ "./node_modules/cerke_online_api/lib/tactics.js":
/*!******************************************************!*\
  !*** ./node_modules/cerke_online_api/lib/tactics.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/cerke_online_api/lib/type__message.js":
/*!************************************************************!*\
  !*** ./node_modules/cerke_online_api/lib/type__message.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Profession = exports.Color = void 0;
var Color;
(function (Color) {
    Color[Color["Kok1"] = 0] = "Kok1";
    Color[Color["Huok2"] = 1] = "Huok2";
})(Color = exports.Color || (exports.Color = {}));
var Profession;
(function (Profession) {
    Profession[Profession["Nuak1"] = 0] = "Nuak1";
    Profession[Profession["Kauk2"] = 1] = "Kauk2";
    Profession[Profession["Gua2"] = 2] = "Gua2";
    Profession[Profession["Kaun1"] = 3] = "Kaun1";
    Profession[Profession["Dau2"] = 4] = "Dau2";
    Profession[Profession["Maun1"] = 5] = "Maun1";
    Profession[Profession["Kua2"] = 6] = "Kua2";
    Profession[Profession["Tuk2"] = 7] = "Tuk2";
    Profession[Profession["Uai1"] = 8] = "Uai1";
    Profession[Profession["Io"] = 9] = "Io";
})(Profession = exports.Profession || (exports.Profession = {}));


/***/ }),

/***/ "./node_modules/cerke_online_kiaak_parser/dist/handle_body_element.js":
/*!****************************************************************************!*\
  !*** ./node_modules/cerke_online_kiaak_parser/dist/handle_body_element.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleBodyElement = exports.handleTrailingParameters = exports.munchCiurlEvent = exports.munchWaterEvent = exports.handleYaku = exports.handleTamMove = void 0;
const munchers_1 = __webpack_require__(/*! ./munchers */ "./node_modules/cerke_online_kiaak_parser/dist/munchers.js");
const munch_monad_1 = __webpack_require__(/*! ./munch_monad */ "./node_modules/cerke_online_kiaak_parser/dist/munch_monad.js");
function handleTamMove(s) {
    const try_munch_src = (0, munchers_1.munchCoord)(s);
    if (!try_munch_src) {
        throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
    }
    const { ans: src, rest } = try_munch_src;
    if (rest.charAt(0) !== "皇") {
        throw new Error(`failed to find tam2 while reading \`${s}\``);
    }
    // the format is either:
    // - ZU皇[TO]TU
    // - ZO皇[ZU]ZIZE
    // - TY皇TAI[TAU]ZAU
    const try_munch_bracket_and_nonbracket = (0, munch_monad_1.liftM2)((firstDest, next) => ({ firstDest, next }), munchers_1.munchBracketedCoord, munchers_1.munchCoord)(rest.slice(1));
    if (try_munch_bracket_and_nonbracket) {
        // either:
        // - ZU皇[TO]TU
        // - ZO皇[ZU]ZIZE
        const { ans: { firstDest, next }, rest: rest2 } = try_munch_bracket_and_nonbracket;
        if (rest2 === "") {
            return {
                "type": "tam_move",
                movement: {
                    type: "TamMove",
                    stepStyle: "NoStep",
                    src, firstDest, secondDest: next
                }
            };
        }
        else {
            const try_munch_coord = (0, munchers_1.munchCoord)(rest2);
            if (!try_munch_coord) {
                throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
            }
            const { ans: secondDest, rest: empty } = try_munch_coord;
            if (empty !== "") {
                throw new Error(`Cannot handle trailing \`${empty}\` found within  \`${s}\``);
            }
            return {
                "type": "tam_move",
                movement: { type: "TamMove", stepStyle: "StepsDuringLatter", src, firstDest, step: next, secondDest }
            };
        }
    }
    else {
        // - TY皇TAI[TAU]ZAU
        const munch = (0, munch_monad_1.liftM3)((step, firstDest, secondDest) => ({ step, firstDest, secondDest }), munchers_1.munchCoord, munchers_1.munchBracketedCoord, munchers_1.munchCoord)(rest.slice(1));
        if (!munch) {
            throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
        }
        ;
        const { ans: { step, firstDest, secondDest }, rest: empty } = munch;
        if (empty !== "") {
            throw new Error(`Cannot handle trailing \`${rest}\` found within  \`${s}\``);
        }
        return {
            "type": "tam_move",
            movement: {
                type: "TamMove",
                stepStyle: "StepsDuringFormer",
                src, step, firstDest, secondDest
            }
        };
    }
}
exports.handleTamMove = handleTamMove;
function handleYaku(s) {
    // 或為王加獣
    // 或為王加獣而手八
    const handsSepByAt = (0, munch_monad_1.sepBy1)({ p: munchers_1.munchHand, sep: (0, munch_monad_1.string)("加") });
    const munch = (0, munch_monad_1.liftM2)((_, hands) => hands, (0, munch_monad_1.string)("或為"), handsSepByAt)(s);
    if (!munch) {
        throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
    }
    const { ans: hands, rest } = munch;
    if (rest === "") {
        return { type: "before_tymok", hands };
    }
    const munch2 = (0, munch_monad_1.liftM2)((_, num) => num, (0, munch_monad_1.string)("而手"), munchers_1.munchPekzepNumeral)(rest);
    if (!munch2) {
        throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
    }
    const { ans: score, rest: rest2 } = munch2;
    if (rest2 !== "") {
        throw new Error(`Cannot handle trailing \`${rest}\` found within  \`${s}\``);
    }
    return { type: "before_taxot", hands, score };
}
exports.handleYaku = handleYaku;
const munchWaterEvent = (s) => {
    if (s.startsWith("水")) {
        const t = s.slice(1);
        if (t.startsWith("無此無")) {
            return { ans: 0, rest: t.slice(3) };
        }
        if (t.startsWith("一此無")) {
            return { ans: 1, rest: t.slice(3) };
        }
        if (t.startsWith("二此無")) {
            return { ans: 2, rest: t.slice(3) };
        }
        if (t.startsWith("三")) {
            return { ans: 3, rest: t.slice(1) };
        }
        if (t.startsWith("四")) {
            return { ans: 4, rest: t.slice(1) };
        }
        if (t.startsWith("五")) {
            return { ans: 5, rest: t.slice(1) };
        }
    }
    return null;
};
exports.munchWaterEvent = munchWaterEvent;
const munchCiurlEvent = (s) => {
    if (s.startsWith("無撃裁")) {
        return { ans: { type: "no_ciurl_event" }, rest: s.slice(3) };
    }
    const try_munch_water = (0, exports.munchWaterEvent)(s);
    if (try_munch_water) {
        const { ans, rest } = try_munch_water;
        return { ans: { type: "has_water_entry", water_entry_ciurl: ans }, rest };
    }
    if (s.startsWith("橋")) {
        const t = s.slice(1);
        const stepping_ciurl = t[0] === "無" ? 0 :
            t[0] === "一" ? 1 :
                t[0] === "二" ? 2 :
                    t[0] === "三" ? 3 :
                        t[0] === "四" ? 4 :
                            t[0] === "五" ? 5 : (() => { throw new Error("Unexpected character found after 橋"); })();
        const rest = t.slice(1);
        // Either nothing, 此無, or munchWaterEvent
        const try_munch_water = (0, exports.munchWaterEvent)(rest);
        if (try_munch_water) {
            const { ans: water_entry_ciurl, rest: rest2 } = try_munch_water;
            return { ans: { type: "has_water_entry", stepping_ciurl, water_entry_ciurl }, rest: rest2 };
        }
        else if (rest.startsWith("此無")) {
            return { ans: { type: "only_stepping", stepping_ciurl, infafterstep_success: false }, rest: "" };
        }
        else {
            return { ans: { type: "only_stepping", stepping_ciurl, infafterstep_success: true }, rest };
        }
    }
    else {
        return null;
    }
};
exports.munchCiurlEvent = munchCiurlEvent;
function handleTrailingParameters(s) {
    const try_ciurl_event = (0, exports.munchCiurlEvent)(s);
    if (!try_ciurl_event) {
        throw new Error(`Unparsable ciurl event: \`${s}\``);
    }
    const { ans: ciurl_event, rest } = try_ciurl_event;
    if (rest === "") {
        return { ciurl_event };
    }
    const optional_piece_capture = (0, munchers_1.munchPieceCaptureComment)(rest);
    if (optional_piece_capture) {
        const { ans: piece_capture, rest: rest2 } = optional_piece_capture;
        if (rest2 !== "") {
            throw new Error(`Trailing parameter \`${s}\` has some extra \`${rest2}\` at the end`);
        }
        return { ciurl_event, piece_capture };
    }
    else {
        throw new Error(`Unparsable trailing parameter: \`${s}\``);
    }
}
exports.handleTrailingParameters = handleTrailingParameters;
function handleBodyElement(s) {
    if (s === "春終") {
        return { "type": "season_ends", season: 0 };
    }
    if (s === "夏終") {
        return { "type": "season_ends", season: 1 };
    }
    if (s === "秋終") {
        return { "type": "season_ends", season: 2 };
    }
    if (s === "冬終") {
        return { "type": "season_ends", season: 3 };
    }
    if (s === "終季") {
        return { "type": "end_season" };
    }
    if (s === "再行") {
        return { "type": "go_again" };
    }
    if (s === "星一周") {
        return { "type": "game_set" };
    }
    if (s.includes("為")) {
        return handleYaku(s);
    }
    if (s.includes("皇")) {
        return handleTamMove(s);
    }
    const try_munch_from_hopzuo = (0, munchers_1.munchFromHopZuo)(s);
    if (try_munch_from_hopzuo) {
        const { ans: { color, prof, dest }, rest } = try_munch_from_hopzuo;
        if (rest !== "") {
            throw new Error(`Cannot handle trailing \`${rest}\` found within  \`${s}\``);
        }
        return {
            "type": "from_hopzuo",
            movement: {
                type: "NonTamMove", data: {
                    type: "FromHop1Zuo1",
                    color,
                    prof,
                    dest
                }
            }
        };
    }
    const try_munch_src = (0, munchers_1.munchCoord)(s);
    if (!try_munch_src) {
        throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
    }
    const { ans: src, rest } = try_munch_src;
    if (!["兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "船", "片"].includes(rest.charAt(0))) {
        throw new Error(`failed to find a profession while reading \`${s}\``);
    }
    const try_munch_2nd_coord = (0, munchers_1.munchCoord)(rest.slice(1));
    if (!try_munch_2nd_coord) {
        throw new Error(`failed to find the second coordinate while reading \`${s}\``);
    }
    const { ans: second_coord, rest: rest2 } = try_munch_2nd_coord;
    const try_munch_3rd_coord = (0, munchers_1.munchCoord)(rest2);
    if (!try_munch_3rd_coord) {
        const ciurl_and_capture = handleTrailingParameters(rest2);
        return {
            "type": "normal_move",
            movement: {
                type: "NonTamMove", data: {
                    type: "SrcDst",
                    src,
                    dest: second_coord
                }
            },
            ciurl_and_capture
        };
    }
    else {
        const { ans: third_coord, rest: rest3 } = try_munch_3rd_coord;
        const ciurl_and_capture = handleTrailingParameters(rest3);
        return {
            "type": "normal_move",
            movement: {
                type: "NonTamMove", data: {
                    type: "SrcStepDst",
                    src,
                    step: second_coord,
                    dest: third_coord
                }
            }, ciurl_and_capture
        };
    }
}
exports.handleBodyElement = handleBodyElement;


/***/ }),

/***/ "./node_modules/cerke_online_kiaak_parser/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/cerke_online_kiaak_parser/dist/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseCerkeOnlineKia1Ak1 = void 0;
const handle_body_element_1 = __webpack_require__(/*! ./handle_body_element */ "./node_modules/cerke_online_kiaak_parser/dist/handle_body_element.js");
function parseCerkeOnlineKia1Ak1(s) {
    const lines = s.trim().split("\n").map(l => l.trim());
    const body_starts_at = lines.findIndex(l => 'KLNTZXCMP"'.includes(l[0] ?? '$'));
    const initial_line = lines[0];
    if (initial_line === undefined /* Since we used .split(), this actually can't happen */ || initial_line === "") {
        throw new Error("棋譜がありません");
    }
    else if (/^\{始時:/.test(initial_line)) {
        throw new Error("棋譜が {始時: で始まっています。これは2021年11月末アップデート以前の棋譜であり、まだ対応できていません。");
    }
    else if (!/^\{一位色:/.test(initial_line)) {
        throw new Error("棋譜が {一位色: で始まっていません。");
    }
    const starting_players = initial_line.match(/^\{一位色:([黒赤]+)\}$/)?.[1];
    const starting_time = lines[1]?.match(/^\{始時:([^}]+)\}$/)?.[1];
    const ending_time = lines[2]?.match(/^\{終時:([^}]+)\}$/)?.[1];
    const bodies = lines.slice(body_starts_at).flatMap(line => line.split(/[\s\n]/g)).filter(a => a !== "");
    const parsed_bodies = bodies.map(handle_body_element_1.handleBodyElement);
    return { starting_players, starting_time, ending_time, parsed_bodies };
}
exports.parseCerkeOnlineKia1Ak1 = parseCerkeOnlineKia1Ak1;


/***/ }),

/***/ "./node_modules/cerke_online_kiaak_parser/dist/munch_monad.js":
/*!********************************************************************!*\
  !*** ./node_modules/cerke_online_kiaak_parser/dist/munch_monad.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sepBy1 = exports.many1 = exports.many = exports.liftM3 = exports.string = exports.liftM2 = exports.pure = exports.bind = void 0;
// monad
const bind = (ma, callback) => ((input) => {
    const res1 = ma(input);
    if (res1 === null)
        return null;
    const { ans: a, rest } = res1;
    return callback(a)(rest);
});
exports.bind = bind;
const pure = (a) => (input) => ({ ans: a, rest: input });
exports.pure = pure;
const liftM2 = (f, ma, mb) => (0, exports.bind)(ma, a => (0, exports.bind)(mb, b => (0, exports.pure)(f(a, b))));
exports.liftM2 = liftM2;
const string = (prefix) => (input) => input.startsWith(prefix) ? { ans: undefined, rest: input.slice(prefix.length) } : null;
exports.string = string;
const liftM3 = (f, ma, mb, mc) => (0, exports.bind)(ma, a => (0, exports.bind)(mb, b => (0, exports.bind)(mc, c => (0, exports.pure)(f(a, b, c)))));
exports.liftM3 = liftM3;
const many = (ma) => input => {
    const ans = [];
    let rest = input;
    while (true) {
        const res1 = ma(rest);
        if (res1 === null)
            return { ans, rest };
        const { ans: a, rest: r } = res1;
        ans.push(a);
        rest = r;
    }
};
exports.many = many;
const many1 = (ma) => input => {
    const res1 = ma(input);
    if (res1 === null)
        return null;
    let { ans: a, rest } = res1;
    const ans = [a];
    while (true) {
        const res1 = ma(rest);
        if (res1 === null)
            return { ans, rest };
        const { ans: a, rest: r } = res1;
        ans.push(a);
        rest = r;
    }
};
exports.many1 = many1;
const sepBy1 = ({ p: ma, sep }) => (0, exports.bind)(ma, a => (0, exports.bind)((0, exports.many)((0, exports.bind)(sep, (_) => ma)), as => (0, exports.pure)([a, ...as])));
exports.sepBy1 = sepBy1;


/***/ }),

/***/ "./node_modules/cerke_online_kiaak_parser/dist/munchers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/cerke_online_kiaak_parser/dist/munchers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.munchPekzepNumeral = exports.munchBracketedCoord = exports.munchPieceCaptureComment = exports.munchFromHopZuo = exports.munchCoord = exports.munchHand = void 0;
const munch_monad_1 = __webpack_require__(/*! ./munch_monad */ "./node_modules/cerke_online_kiaak_parser/dist/munch_monad.js");
const read_pekzep_numerals_1 = __webpack_require__(/*! ./read_pekzep_numerals */ "./node_modules/cerke_online_kiaak_parser/dist/read_pekzep_numerals.js");
const munchColor = (s) => {
    if (s.charAt(0) === "赤") {
        return { ans: 0, rest: s.slice(1) };
    }
    if (s.charAt(0) === "黒") {
        return { ans: 1, rest: s.slice(1) };
    }
    return null;
};
const munchProfession = (s) => {
    if (s.charAt(0) === "船") {
        return { ans: 0, rest: s.slice(1) };
    }
    if (s.charAt(0) === "兵") {
        return { ans: 1, rest: s.slice(1) };
    }
    if (s.charAt(0) === "弓") {
        return { ans: 2, rest: s.slice(1) };
    }
    if (s.charAt(0) === "車") {
        return { ans: 3, rest: s.slice(1) };
    }
    if (s.charAt(0) === "虎") {
        return { ans: 4, rest: s.slice(1) };
    }
    if (s.charAt(0) === "馬") {
        return { ans: 5, rest: s.slice(1) };
    }
    if (s.charAt(0) === "筆") {
        return { ans: 6, rest: s.slice(1) };
    }
    if (s.charAt(0) === "巫") {
        return { ans: 7, rest: s.slice(1) };
    }
    if (s.charAt(0) === "将") {
        return { ans: 8, rest: s.slice(1) };
    }
    if (s.charAt(0) === "王") {
        return { ans: 9, rest: s.slice(1) };
    }
    return null;
};
const munchColumn = (s) => {
    const cols = ["K", "L", "N", "T", "Z", "X", "C", "M", "P"];
    for (const col of cols) {
        if (s.charAt(0) === col) {
            return { ans: col, rest: s.slice(1) };
        }
    }
    return null;
};
const munchRow = (s) => {
    const rows = ["AI", "AU", "IA" /* handle the longer ones first */, "A", "E", "I", "U", "O", "Y"];
    for (const row of rows) {
        if (s.startsWith(row)) {
            return { ans: row, rest: s.slice(row.length) };
        }
    }
    return null;
};
const munchHand = (s) => {
    const hands = ["王", "獣", "同色獣", "地心", "同色地心", "馬弓兵", "同色馬弓兵",
        "助友", "同色助友", "戦集", "同色戦集", "行行", "同色行行", "筆兵無傾", "同色筆兵無傾",
        "闇戦之集", "同色闇戦之集", "無抗行処", "同色無抗行処"];
    for (const hand of hands) {
        if (s.startsWith(hand)) {
            return { ans: hand, rest: s.slice(hand.length) };
        }
    }
    return null;
};
exports.munchHand = munchHand;
exports.munchCoord = (0, munch_monad_1.liftM2)((col, row) => {
    const coord = [row, col];
    return coord;
}, munchColumn, munchRow);
exports.munchFromHopZuo = (0, munch_monad_1.liftM3)((color, prof, dest) => ({ color, prof, dest }), munchColor, munchProfession, exports.munchCoord);
exports.munchPieceCaptureComment = (0, munch_monad_1.liftM3)((_, color, prof) => ({ color, prof }), (0, munch_monad_1.string)("手"), munchColor, munchProfession);
exports.munchBracketedCoord = (0, munch_monad_1.liftM3)((_1, coord, _2) => coord, (0, munch_monad_1.string)("["), exports.munchCoord, (0, munch_monad_1.string)("]"));
const munchDigitLinzklar = (s) => {
    const ds = ["無", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "下", "百"];
    for (const d of ds) {
        if (s.startsWith(d)) {
            return { ans: d, rest: s.slice(1) };
        }
    }
    return null;
};
const munchPekzepNumeral = (s) => {
    const t1 = (0, munch_monad_1.many1)(munchDigitLinzklar)(s);
    if (!t1)
        return null;
    const { ans, rest } = t1;
    try {
        const num = (0, read_pekzep_numerals_1.fromDigitsLinzklar)(ans);
        return { ans: num, rest };
    }
    catch (e) {
        return null;
    }
};
exports.munchPekzepNumeral = munchPekzepNumeral;


/***/ }),

/***/ "./node_modules/cerke_online_kiaak_parser/dist/read_pekzep_numerals.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/cerke_online_kiaak_parser/dist/read_pekzep_numerals.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromDigitsLinzklar = void 0;
function fromDigitsLinzklar(i) {
    if (i[0] === "無" && i.length === 1) {
        return 0;
    }
    if (i[0] === "下") {
        return -fromDigitsLinzklar(i.slice(1));
    }
    if (i[0] === "百") {
        if (i.length === 1) {
            return 100;
        }
        return 100 + fromDigitsLinzklar(i.slice(1));
    }
    const index100 = i.indexOf("百");
    if (index100 !== -1) {
        const hundreds = i.slice(0, index100);
        const ones = i.slice(index100 + 1);
        return 100 * fromDigitsLinzklarSub(hundreds) + fromDigitsLinzklarSub(ones);
    }
    if (i[0] === "十") {
        return 10 + parseUnit(i[1]);
    }
    if (i[1] === "十") {
        return 10 * parseUnit(i[0]) + parseUnit(i[2]);
    }
    if (i.length === 1) {
        return parseUnit(i[0]);
    }
    throw new Error(`Cannot parse "${i}" as a pekzep numeral`);
}
exports.fromDigitsLinzklar = fromDigitsLinzklar;
function parseUnit(ones) {
    if (ones === undefined) {
        return 0;
    }
    if (ones === "一") {
        return 1;
    }
    if (ones === "二") {
        return 2;
    }
    if (ones === "三") {
        return 3;
    }
    if (ones === "四") {
        return 4;
    }
    if (ones === "五") {
        return 5;
    }
    if (ones === "六") {
        return 6;
    }
    if (ones === "七") {
        return 7;
    }
    if (ones === "八") {
        return 8;
    }
    if (ones === "九") {
        return 9;
    }
    throw new Error(`Unexpected character "${ones}" while trying to parse pekzep numerals`);
}
function fromDigitsLinzklarSub(i) {
    if (i.length === 0)
        return 0;
    if (i[0] === "十") {
        return 10 + parseUnit(i[1]);
    }
    else if (i[i.length - 1] === "十") {
        return parseUnit(i[0]) * 10;
    }
    else {
        const a = i[0];
        const b = i[1];
        if (b === undefined)
            return parseUnit(a);
        return parseUnit(a) * 10 + parseUnit(b);
    }
}


/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.highlightNthKia1Ak1 = exports.drawGameState = exports.drawFocusSrc = exports.FocusSteppedHTML = exports.FocusPlannedDestHTML = exports.drawEmptyBoard = exports.cell_size = exports.top_margin = exports.left_margin = exports.height = void 0;
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
exports.height = 387;
exports.left_margin = 40;
exports.top_margin = 40;
exports.cell_size = 43;
function drawEmptyBoard() {
    var ctx = document.getElementById("cv").getContext("2d");
    // 皇処
    ctx.fillStyle = "hsl(27, 54.5%, 81.1%)";
    ctx.fillRect(exports.left_margin + 2 * exports.height / 9, exports.top_margin + 2 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 3 * exports.height / 9, exports.top_margin + 3 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 5 * exports.height / 9, exports.top_margin + 5 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 6 * exports.height / 9, exports.top_margin + 6 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 6 * exports.height / 9, exports.top_margin + 2 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 5 * exports.height / 9, exports.top_margin + 3 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 3 * exports.height / 9, exports.top_margin + 5 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.fillRect(exports.left_margin + 2 * exports.height / 9, exports.top_margin + 6 * exports.height / 9, exports.height / 9, exports.height / 9);
    // 皇水
    ctx.fillStyle = "hsl(213, 33.6%, 78.9%)";
    ctx.fillRect(exports.left_margin + 4 * exports.height / 9, exports.top_margin + 2 * exports.height / 9, exports.height / 9, 5 * exports.height / 9);
    ctx.fillRect(exports.left_margin + 2 * exports.height / 9, exports.top_margin + 4 * exports.height / 9, 5 * exports.height / 9, exports.height / 9);
    // 皇山
    ctx.fillStyle = "hsl(129, 38.5%, 45.4%)";
    ctx.fillRect(exports.left_margin + 4 * exports.height / 9, exports.top_margin + 4 * exports.height / 9, exports.height / 9, exports.height / 9);
    ctx.strokeStyle = 'rgb(99, 99, 99)';
    ctx.lineWidth = 0.03 * exports.height / 9;
    for (var i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(exports.left_margin + 0, exports.top_margin + i * exports.height / 9);
        ctx.lineTo(exports.left_margin + exports.height, exports.top_margin + i * exports.height / 9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(exports.left_margin + i * exports.height / 9, exports.top_margin + 0);
        ctx.lineTo(exports.left_margin + i * exports.height / 9, exports.top_margin + exports.height);
        ctx.stroke();
    }
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgb(0,0,0)";
    var columns = ["A", "E", "I", "U", "O", "Y", "AI", "AU", "IA"];
    ctx.textAlign = "left";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(columns[i], exports.left_margin + exports.height + 10, exports.top_margin + 30 + exports.cell_size * i);
    }
    var rows = ["K", "L", "N", "T", "Z", "X", "C", "M", "P"];
    ctx.textAlign = "center";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(rows[i], exports.left_margin + 20 + exports.cell_size * i, exports.top_margin - 10);
    }
    ctx.save();
    ctx.rotate(Math.PI);
    ctx.textAlign = "left";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(columns[i], -exports.left_margin + 10, -(exports.top_margin + 15 + exports.cell_size * i));
    }
    ctx.textAlign = "center";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(rows[i], -(exports.left_margin + 20 + exports.cell_size * i), -(exports.top_margin + exports.height + 10));
    }
    ctx.restore();
}
exports.drawEmptyBoard = drawEmptyBoard;
function get_top_left(coord) {
    var column = {
        K: 0,
        L: 1,
        N: 2,
        T: 3,
        Z: 4,
        X: 5,
        C: 6,
        M: 7,
        P: 8
    }[coord[1]];
    var row = {
        IA: 8,
        AU: 7,
        AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
    }[coord[0]];
    var left = exports.left_margin + exports.cell_size * (column - 0.5);
    var top = exports.top_margin + exports.cell_size * (row - 0.5);
    return { left: left, top: top };
}
function FocusPlannedDestHTML(focus_planned_dest) {
    if (!focus_planned_dest)
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_planned_dest), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 25%; \n        background-color: rgb(178, 255, 255)\n    \"></div>");
}
exports.FocusPlannedDestHTML = FocusPlannedDestHTML;
function FocusSteppedHTML(focus_stepped) {
    if (!focus_stepped)
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_stepped), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(255, 255, 0, 0.3)\n    \"></div>");
}
exports.FocusSteppedHTML = FocusSteppedHTML;
function drawFocusSrc(focus_src) {
    if (!focus_src || focus_src === "a_side_hop1zuo1" || focus_src === "ia_side_hop1zuo1")
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_src), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(0, 0, 0, 0.3)\n    \"></div>");
}
exports.drawFocusSrc = drawFocusSrc;
function PiecesOnBoardHTML(board, focus) {
    var ans = "";
    for (var clm in board) {
        for (var rw in board[clm]) {
            var is_focused = focus ? focus[1] === clm && focus[0] === rw : false;
            ans += PositionedPieceOnBoardHTML(clm, rw, board[clm][rw], is_focused);
        }
    }
    return ans;
}
function Hop1Zuo1HTML(pieces, is_newly_acquired) {
    var ans = "";
    for (var i = 0; i < pieces.length; i++) {
        var _a = pieces[i], color = _a.color, prof = _a.prof;
        var rad = 18 / 0.26;
        ans += "<li>\n            <div style=\"\n                width: 23px; \n                height: ".concat(exports.cell_size, "px; \n                transform: scale(0.26); \n                transform-origin: top left; \n            \">\n                \n                ").concat(is_newly_acquired && i == pieces.length - 1 ? "<div style=\"\n                    position: absolute;\n                    transform: rotate(45deg);\n                    transform-origin: center;\n                    left: ".concat(42 - rad, "px;\n                    top: ").concat(42 - rad, "px;\n                    width: ").concat(rad * 2, "px;\n                    height: ").concat(rad * 2, "px;\n                    border-radius: 25%;\n                    background-color: rgba(0, 60, 50, 0.3);\n                \"></div>") : "", "\n                ").concat(NormalPieceHTML(color, prof, false), "\n            </div>\n        </li>");
    }
    return ans;
}
function drawGameState(STATE) {
    if (STATE.whose_turn === "a_side") {
        document.getElementById("a_side_container").classList.add("turn_active");
        document.getElementById("ia_side_container").classList.remove("turn_active");
    }
    else if (STATE.whose_turn === "ia_side") {
        document.getElementById("a_side_container").classList.remove("turn_active");
        document.getElementById("ia_side_container").classList.add("turn_active");
    }
    else {
        document.getElementById("a_side_container").classList.remove("turn_active");
        document.getElementById("ia_side_container").classList.remove("turn_active");
    }
    document.getElementById("season_text").innerHTML = STATE.game_has_ended ? "星一周" : STATE.season;
    document.getElementById("turn_text").innerHTML = STATE.turn + "";
    document.getElementById("rate_text").innerHTML = STATE.rate + "";
    document.getElementById("ia_side_player_name_short_text").innerHTML = STATE.ia_side.player_name_short;
    document.getElementById("a_side_player_name_short_text").innerHTML = STATE.a_side.player_name_short;
    document.getElementById("a_side_player_name_text").innerHTML = STATE.a_side.player_name;
    document.getElementById("ia_side_player_name_text").innerHTML = STATE.ia_side.player_name;
    document.getElementById("a_side_current_score").innerHTML = STATE.a_side.score + "";
    document.getElementById("ia_side_current_score").innerHTML = STATE.ia_side.score + "";
    document.getElementById("a_side_piece_stand").innerHTML = Hop1Zuo1HTML(STATE.a_side.hop1zuo1, STATE.a_side.is_newly_acquired);
    document.getElementById("ia_side_piece_stand").innerHTML = Hop1Zuo1HTML(STATE.ia_side.hop1zuo1, STATE.ia_side.is_newly_acquired);
    document.getElementById("pieces_inner").innerHTML = FocusSteppedHTML(STATE.focus.stepped) +
        drawFocusSrc(STATE.focus.src) +
        FocusPlannedDestHTML(STATE.focus.initially_planned_dest) +
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_final_dest);
    document.getElementById("yaku_display").innerHTML = OverlayedMessageHTML(STATE.overlayed_message);
}
exports.drawGameState = drawGameState;
function OverlayedMessageHTML(a) {
    if (!a)
        return "";
    var content = (function (a) {
        if (a.type === "before_taxot" || a.type === "before_tymok") {
            return a.hands.join("<br>");
        }
        else if (a.type === "end_season") {
            return "\u7D42\u5B63<br>".concat(a.score);
        }
        else if (a.type === "go_again") {
            return "\u518D\u884C";
        }
        else if (a.type === "game_set") {
            return "\u661F\u4E00\u5468";
        }
        else if (a.type === "season_ends") {
            return "".concat(a.season, "\u7D42");
        }
        else {
            var _ = a;
            throw new Error("Should not reach here: Dat2Display.type is invalid");
        }
    })(a);
    return "<div style=\"position: absolute;\n    width: 469px;\n    height: 256px;\n    top: 131px;\n    left: 44px;\n    background-color: rgba(0,0,0,80%);\n    color: white;\n}\">".concat(content, "</div>");
}
function NormalPieceHTML(color, prof, is_bold) {
    var x = types_1.profs.indexOf(prof) * -100 - 27;
    var y = is_bold ? 0 : -277;
    var color_path = {
        "黒": "ゴシック駒",
        "赤": "ゴシック駒_赤",
    }[color];
    return "<div\n    style=\"width: 87px; height: 87px; background-position-x: ".concat(x, "px; background-position-y: ").concat(y, "px; background-image: url(").concat(color_path, ".svg); \">\n</div>");
}
function PositionedPieceOnBoardHTML(clm, rw, piece, is_bold) {
    var _a = get_top_left([rw, clm]), left = _a.left, top = _a.top;
    if (piece === "皇") {
        return "\n        <div style=\"position: absolute; left: ".concat(left, "px; top: ").concat(top, "px; transform: scale(0.26) ").concat("rotate(90deg)", "\">\n            ").concat(NormalPieceHTML("黒", "皇", is_bold), "\n        </div>");
    }
    else {
        var color = piece.color, prof = piece.prof, is_aside = piece.is_aside;
        return "\n        <div style=\"position: absolute; left: ".concat(left, "px; top: ").concat(top, "px; transform: scale(0.26) ").concat(is_aside ? "rotate(180deg)" : "", "\">\n            ").concat(NormalPieceHTML(color, prof, is_bold), "\n        </div>");
    }
}
function highlightNthKia1Ak1(kiar_ark, n) {
    var lines = kiar_ark.trim().split("\n");
    var body_starts_at = lines.findIndex(function (l) { var _a; return 'KLNTZXCMP"'.includes((_a = l[0]) !== null && _a !== void 0 ? _a : '$'); });
    if (body_starts_at === -1) {
        alert("棋譜が空です。index.html に戻って再入力してください。");
        location.href = "./index.html";
    }
    // when n = 0, nothing should be highlighted
    for (var i = body_starts_at; i < lines.length; i++) {
        if (lines[i].trim() === "")
            continue;
        var elems_length = lines[i].split(/ /g).filter(function (a) { return a !== ""; }).length;
        if (n > elems_length || n <= 0) {
            n -= elems_length;
            continue;
        }
        else {
            // n = 1 => highlight the first element, and so on
            var arr = lines[i].split(/ /g);
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] === "") {
                    continue;
                }
                else {
                    n--;
                    if (n === 0) {
                        arr[j] = "<span style=\"background-color: #cccccc;\">".concat(arr[j], "</span>");
                    }
                }
            }
            lines[i] = arr.join(" ");
        }
    }
    document.getElementById("kia_ak").innerHTML = lines.join("\n");
}
exports.highlightNthKia1Ak1 = highlightNthKia1Ak1;


/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllStatesFromParsed = exports.getNextState = void 0;
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
function getInitialBoard() {
    return {
        K: {
            A: { color: "黒", prof: "筆", is_aside: true },
            E: { color: "赤", prof: "巫", is_aside: true },
            I: { color: "黒", prof: "兵", is_aside: true },
            AI: { color: "黒", prof: "兵", is_aside: false },
            AU: { color: "黒", prof: "巫", is_aside: false },
            IA: { color: "赤", prof: "筆", is_aside: false },
        },
        L: {
            A: { color: "黒", prof: "馬", is_aside: true },
            E: { color: "赤", prof: "弓", is_aside: true },
            I: { color: "赤", prof: "兵", is_aside: true },
            AI: { color: "赤", prof: "兵", is_aside: false },
            AU: { color: "黒", prof: "弓", is_aside: false },
            IA: { color: "赤", prof: "馬", is_aside: false },
        },
        N: {
            A: { color: "黒", prof: "車", is_aside: true },
            I: { color: "黒", prof: "兵", is_aside: true },
            AI: { color: "黒", prof: "兵", is_aside: false },
            IA: { color: "赤", prof: "車", is_aside: false },
        },
        T: {
            A: { color: "黒", prof: "将", is_aside: true },
            E: { color: "赤", prof: "虎", is_aside: true },
            I: { color: "赤", prof: "兵", is_aside: true },
            AI: { color: "赤", prof: "兵", is_aside: false },
            AU: { color: "黒", prof: "虎", is_aside: false },
            IA: { color: "赤", prof: "将", is_aside: false },
        },
        Z: {
            A: { color: "赤", prof: "王", is_aside: true },
            I: { color: "赤", prof: "船", is_aside: true },
            O: "皇",
            AI: { color: "黒", prof: "船", is_aside: false },
            IA: { color: "黒", prof: "王", is_aside: false },
        },
        X: {
            A: { color: "赤", prof: "将", is_aside: true },
            E: { color: "黒", prof: "虎", is_aside: true },
            I: { color: "赤", prof: "兵", is_aside: true },
            AI: { color: "赤", prof: "兵", is_aside: false },
            AU: { color: "赤", prof: "虎", is_aside: false },
            IA: { color: "黒", prof: "将", is_aside: false },
        },
        C: {
            A: { color: "赤", prof: "車", is_aside: true },
            I: { color: "黒", prof: "兵", is_aside: true },
            AI: { color: "黒", prof: "兵", is_aside: false },
            IA: { color: "黒", prof: "車", is_aside: false },
        },
        M: {
            A: { color: "赤", prof: "馬", is_aside: true },
            E: { color: "黒", prof: "弓", is_aside: true },
            I: { color: "赤", prof: "兵", is_aside: true },
            AI: { color: "赤", prof: "兵", is_aside: false },
            AU: { color: "赤", prof: "弓", is_aside: false },
            IA: { color: "黒", prof: "馬", is_aside: false },
        },
        P: {
            A: { color: "赤", prof: "筆", is_aside: true },
            E: { color: "黒", prof: "巫", is_aside: true },
            I: { color: "黒", prof: "兵", is_aside: true },
            AI: { color: "黒", prof: "兵", is_aside: false },
            AU: { color: "赤", prof: "巫", is_aside: false },
            IA: { color: "黒", prof: "筆", is_aside: false },
        }
    };
}
function getInitialState(o) {
    return {
        season: "春",
        game_has_ended: false,
        turn: 0,
        rate: 1,
        whose_turn: null,
        focus: {
            actual_final_dest: null,
            stepped: null,
            src: null,
            initially_planned_dest: null
        },
        board: getInitialBoard(),
        ia_side: {
            player_name_short: o.ia_side.player_name_short,
            hop1zuo1: [],
            player_name: o.ia_side.player_name,
            score: 20,
            is_newly_acquired: false,
        },
        a_side: {
            player_name_short: o.a_side.player_name_short,
            player_name: o.a_side.player_name,
            hop1zuo1: [],
            score: 20,
            is_newly_acquired: false,
        },
        overlayed_message: null,
    };
}
function remove_from(state, coord) {
    var piece = state.board[coord[1]][coord[0]];
    if (!piece) {
        throw new Error("\u30A8\u30E9\u30FC: \u5EA7\u6A19".concat(coord[1]).concat(coord[0], "\u306B\u306F\u99D2\u304C\u3042\u308A\u307E\u305B\u3093"));
    }
    delete state.board[coord[1]][coord[0]];
    return piece;
}
function set_to(state, coord, piece) {
    if (state.board[coord[1]][coord[0]]) {
        var captured_piece = state.board[coord[1]][coord[0]];
        if (captured_piece === "皇") {
            throw new Error("\u30A8\u30E9\u30FC: \u5EA7\u6A19".concat(coord[1]).concat(coord[0], "\u306B\u306F\u7687\u304C\u65E2\u306B\u3042\u308A\u307E\u3059"));
        }
        state.board[coord[1]][coord[0]] = piece;
        return captured_piece;
    }
    else {
        state.board[coord[1]][coord[0]] = piece;
        return undefined;
    }
}
function set_hop1zuo1(state, piece) {
    if (piece.is_aside) {
        state.ia_side.hop1zuo1.push({ color: piece.color, prof: piece.prof, is_aside: false });
        state.ia_side.is_newly_acquired = true;
    }
    else {
        state.a_side.hop1zuo1.push({ color: piece.color, prof: piece.prof, is_aside: true });
        state.a_side.is_newly_acquired = true;
    }
}
function remove_from_hop1zuo1(state, o) {
    var index = state[o.is_aside ? "a_side" : "ia_side"].hop1zuo1.findIndex(function (k) { return k.color === o.color && k.prof === o.prof; });
    if (index === -1) {
        throw new Error("\u30A8\u30E9\u30FC: \u6301\u3061\u99D2\u306B".concat(o.color).concat(o.prof, "\u304C\u3042\u308A\u307E\u305B\u3093"));
    }
    state[o.is_aside ? "a_side" : "ia_side"].hop1zuo1.splice(index, 1);
}
function isSuccessfullyCompleted(ciurl_event) {
    if (ciurl_event.type === "no_ciurl_event") {
        return true;
    }
    else if (ciurl_event.type === "only_stepping") {
        return ciurl_event.infafterstep_success;
    }
    else if (ciurl_event.type === "has_water_entry") {
        return ciurl_event.water_entry_ciurl >= 3;
    }
    else {
        var _ = ciurl_event;
        throw new Error("Should not reach here: invalid value in ciurl_event.type");
    }
}
function getNextState(old_state, body_element, starting_players) {
    var _a, _b;
    var new_state = JSON.parse(JSON.stringify(old_state));
    if (old_state.whose_turn === null) {
        new_state.whose_turn = starting_players[(0, types_1.fromHanziSeason)(old_state.season)] === "赤" ? "a_side" : "ia_side";
    }
    // clear the flags
    new_state.ia_side.is_newly_acquired = false;
    new_state.a_side.is_newly_acquired = false;
    new_state.focus = {
        src: null,
        actual_final_dest: null,
        stepped: null,
        initially_planned_dest: null
    };
    new_state.overlayed_message = null;
    if (body_element.type === "season_ends") {
        if (((_a = old_state.overlayed_message) === null || _a === void 0 ? void 0 : _a.type) !== "end_season") {
            throw new Error("\u30A8\u30E9\u30FC: \u300C".concat(old_state.season, "\u7D42\u300D\u306E\u524D\u306B\u306F\u3001\u300C\u7D42\u5B63\u300D\u304C\u5FC5\u8981\u3067\u3059"));
        }
        if (old_state.whose_turn === "a_side") {
            new_state.a_side.score += old_state.overlayed_message.score;
            new_state.ia_side.score -= old_state.overlayed_message.score;
        }
        else if (old_state.whose_turn === "ia_side") {
            new_state.ia_side.score += old_state.overlayed_message.score;
            new_state.a_side.score -= old_state.overlayed_message.score;
        }
        else {
            throw new Error("\u30A8\u30E9\u30FC: \u3069\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u884C\u70BA\u306B\u3088\u3063\u3066\u5B63\u7BC0\u304C\u7D42\u308F\u3063\u305F\u306E\u304B\u304C\u660E\u3089\u304B\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
        }
        new_state.season =
            old_state.season === "春" ? "夏" :
                old_state.season === "夏" ? "秋" :
                    old_state.season === "秋" ? "冬" :
                        old_state.season === "冬" ? "春" /* dummy */ :
                            (function () { throw new Error("Should not reach here: invalid season"); })();
        new_state.game_has_ended = old_state.season === "冬";
        new_state.turn = 0;
        new_state.whose_turn = null;
        new_state.board = getInitialBoard();
        new_state.overlayed_message = { type: "season_ends", season: old_state.season };
        new_state.a_side.hop1zuo1 = [];
        new_state.ia_side.hop1zuo1 = [];
    }
    else if (body_element.type === "go_again") {
        new_state.overlayed_message = { type: "go_again" };
    }
    else if (body_element.type === "game_set") {
        new_state.overlayed_message = { type: "game_set" };
        new_state.game_has_ended = true;
        new_state.whose_turn = null;
    }
    else if (body_element.type === "before_taxot") {
        new_state.overlayed_message = { type: "before_taxot", hands: body_element.hands, score: body_element.score };
    }
    else if (body_element.type === "before_tymok") {
        new_state.overlayed_message = { type: "before_tymok", hands: body_element.hands };
    }
    else if (body_element.type === "end_season") {
        if (((_b = old_state.overlayed_message) === null || _b === void 0 ? void 0 : _b.type) !== "before_taxot") {
            throw new Error("エラー: 「終季」の前には、獲得した役の一覧が必要です");
        }
        new_state.overlayed_message = { type: "end_season", score: old_state.overlayed_message.score };
    }
    else if (body_element.type === "from_hopzuo") {
        if (old_state.whose_turn === "ia_side") {
            new_state.whose_turn = "a_side";
        }
        else if (old_state.whose_turn === "a_side") {
            new_state.whose_turn = "ia_side";
        }
        new_state.turn++;
        var data = body_element.movement.data;
        var color = (0, types_1.toHanziColor)(data.color);
        var prof = (0, types_1.toHanziProfession)(data.prof);
        var is_aside = new_state.whose_turn === "a_side";
        remove_from_hop1zuo1(new_state, { color: color, prof: prof, is_aside: is_aside });
        set_to(new_state, data.dest, { color: color, prof: prof, is_aside: is_aside });
        new_state.focus = {
            actual_final_dest: data.dest,
            initially_planned_dest: data.dest,
            stepped: null,
            src: is_aside ? "a_side_hop1zuo1" : "ia_side_hop1zuo1"
        };
    }
    else if (body_element.type === "normal_move") {
        if (old_state.whose_turn === "ia_side") {
            new_state.whose_turn = "a_side";
        }
        else if (old_state.whose_turn === "a_side") {
            new_state.whose_turn = "ia_side";
        }
        new_state.turn++;
        if (body_element.movement.data.type === "SrcDst") {
            if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = {
                    src: body_element.movement.data.src,
                    actual_final_dest: body_element.movement.data.dest,
                    stepped: null,
                    initially_planned_dest: body_element.movement.data.dest
                };
            }
            else {
                // failed attempt
                new_state.focus = {
                    src: body_element.movement.data.src,
                    actual_final_dest: body_element.movement.data.src,
                    stepped: null,
                    initially_planned_dest: body_element.movement.data.dest
                };
            }
        }
        else if (body_element.movement.data.type === "SrcStepDst") {
            if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = {
                    actual_final_dest: body_element.movement.data.dest,
                    stepped: body_element.movement.data.step,
                    initially_planned_dest: body_element.movement.data.dest,
                    src: body_element.movement.data.src
                };
            }
            else {
                // failed attempt
                new_state.focus = {
                    actual_final_dest: body_element.movement.data.src,
                    stepped: body_element.movement.data.step,
                    initially_planned_dest: body_element.movement.data.dest, src: body_element.movement.data.src
                };
            }
        }
        else {
            var _ = body_element.movement.data;
            throw new Error("Should not reach here: invalid value in body_element.movement.data.type");
        }
    }
    else if (body_element.type === "tam_move") {
        if (old_state.whose_turn === "ia_side") {
            new_state.whose_turn = "a_side";
        }
        else if (old_state.whose_turn === "a_side") {
            new_state.whose_turn = "ia_side";
        }
        var piece = remove_from(new_state, body_element.movement.src);
        var maybe_captured_piece = set_to(new_state, body_element.movement.secondDest, piece);
        if (maybe_captured_piece) {
            throw new Error("\u30A8\u30E9\u30FC: \u7687\u304C\u884C\u3053\u3046\u3068\u3057\u3066\u3044\u308B".concat(body_element.movement.secondDest[1]).concat(body_element.movement.secondDest[0], "\u306B\u306F").concat(maybe_captured_piece.color).concat(maybe_captured_piece.prof, "\u304C\u65E2\u306B\u3042\u308A\u307E\u3059"));
        }
        new_state.focus = {
            src: body_element.movement.src,
            stepped: body_element.movement.stepStyle === "NoStep" ? null : body_element.movement.step,
            actual_final_dest: body_element.movement.secondDest,
            initially_planned_dest: body_element.movement.firstDest
        };
    }
    else {
        var _ = body_element;
        throw new Error("Should not reach here: invalid value in body_element.type");
    }
    return new_state;
}
exports.getNextState = getNextState;
function getAllStatesFromParsed(parsed) {
    if (!parsed.starting_players) {
        throw new Error("todo: current implementation requires \u4E00\u4F4D\u8272. \n\t\tTo resolve this, I would need to uncomment \"ambiguous_alpha\" | \"ambiguous_beta\"\n\t\tin State.whose_turn \u3057\u3066\u3001\u7687\u4EE5\u5916\u306E\u99D2\u3092\u52D5\u304B\u3057\u305F\u3089\u305D\u308C\u3092\u5143\u306B\u9006\u306B\u8FBF\u3063\u3066\u89E3\u6D88\u3059\u308B\u3001\u307F\u305F\u3044\u306A\u306E\u3092\u5165\u308C\u308B\u5FC5\u8981\u304C\u3042\u308B\u3002");
    }
    var current_state = getInitialState({
        ia_side: { player_name_short: "張", player_name: "張三" },
        a_side: { player_name_short: "李", player_name: "李四" }
    });
    var ans = [current_state];
    var _loop_1 = function (i) {
        var next_state = (function () {
            try {
                return getNextState(current_state, parsed.parsed_bodies[i], parsed.starting_players.split(""));
            }
            catch (e) {
                alert("".concat(i, "\u30B9\u30C6\u30C3\u30D7\u76EE\u3067\u306E").concat(e));
                return current_state;
            }
        })();
        if (!next_state)
            return "break";
        ans.push(next_state);
        current_state = next_state;
    };
    for (var i = 0; i < parsed.parsed_bodies.length; i++) {
        var state_1 = _loop_1(i);
        if (state_1 === "break")
            break;
    }
    return ans;
}
exports.getAllStatesFromParsed = getAllStatesFromParsed;


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toHanziProfession = exports.toHanziColor = exports.fromHanziSeason = exports.profs = void 0;
var cerke_online_api_1 = __webpack_require__(/*! cerke_online_api */ "./node_modules/cerke_online_api/lib/index.js");
exports.profs = [
    "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];
function fromHanziSeason(s) {
    if (s === "春")
        return 0;
    else if (s === "夏")
        return 1;
    else if (s === "秋")
        return 2;
    else if (s === "冬")
        return 3;
    throw new Error("Should not reach here: Unexpected season ".concat(s));
}
exports.fromHanziSeason = fromHanziSeason;
function toHanziColor(c) {
    if (c === cerke_online_api_1.Color.Kok1)
        return "赤";
    return "黒";
}
exports.toHanziColor = toHanziColor;
function toHanziProfession(p) {
    if (p === cerke_online_api_1.Profession.Dau2)
        return "虎";
    if (p === cerke_online_api_1.Profession.Gua2)
        return "弓";
    if (p === cerke_online_api_1.Profession.Io)
        return "王";
    if (p === cerke_online_api_1.Profession.Kauk2)
        return "兵";
    if (p === cerke_online_api_1.Profession.Kaun1)
        return "車";
    if (p === cerke_online_api_1.Profession.Kua2)
        return "筆";
    if (p === cerke_online_api_1.Profession.Maun1)
        return "馬";
    if (p === cerke_online_api_1.Profession.Nuak1)
        return "船";
    if (p === cerke_online_api_1.Profession.Tuk2)
        return "巫";
    if (p === cerke_online_api_1.Profession.Uai1)
        return "将";
    throw new Error("Should not reach here: Unexpected profession ".concat(p));
}
exports.toHanziProfession = toHanziProfession;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var cerke_online_kiaak_parser_1 = __webpack_require__(/*! cerke_online_kiaak_parser */ "./node_modules/cerke_online_kiaak_parser/dist/index.js");
var draw_1 = __webpack_require__(/*! ./draw */ "./src/draw.ts");
var state_1 = __webpack_require__(/*! ./state */ "./src/state.ts");
window.addEventListener('load', function () {
    var param = location.href.match(/\?history=(.*)/);
    if (!param) {
        alert("棋譜がありません。index.html に戻って再入力してください。");
        location.href = "./index.html";
    }
    else {
        var kiar_ark_1 = decodeURIComponent(param[1]).replace(/\t/g, "    ");
        var parsed = (0, cerke_online_kiaak_parser_1.parseCerkeOnlineKia1Ak1)(kiar_ark_1);
        var states_1 = (0, state_1.getAllStatesFromParsed)(parsed);
        document.getElementById("kia_ak").textContent = kiar_ark_1;
        (0, draw_1.drawEmptyBoard)();
        var turn_slider_1 = document.getElementById("turn_slider");
        turn_slider_1.min = "0";
        var max_1 = states_1.length - 1;
        turn_slider_1.max = "".concat(max_1);
        turn_slider_1.value = "0";
        (0, draw_1.drawGameState)(states_1[0]);
        turn_slider_1.oninput = turn_slider_1.onchange = function () {
            var new_value = Number(turn_slider_1.value);
            (0, draw_1.drawGameState)(states_1[new_value]);
            (0, draw_1.highlightNthKia1Ak1)(kiar_ark_1, new_value);
        };
        var button_next = document.getElementById("button_next");
        button_next.onclick = function () {
            turn_slider_1.value = "".concat(Number(turn_slider_1.value) + 1);
            var new_value = Number(turn_slider_1.value); // automatically crops the value appropriately
            (0, draw_1.drawGameState)(states_1[new_value]);
            (0, draw_1.highlightNthKia1Ak1)(kiar_ark_1, new_value);
        };
        var button_previous = document.getElementById("button_previous");
        button_previous.onclick = function () {
            turn_slider_1.value = "".concat(Number(turn_slider_1.value) - 1);
            var new_value = Number(turn_slider_1.value); // automatically crops the value appropriately
            (0, draw_1.drawGameState)(states_1[new_value]);
            (0, draw_1.highlightNthKia1Ak1)(kiar_ark_1, new_value);
        };
        var button_first = document.getElementById("button_first");
        button_first.onclick = function () {
            var new_value = 0;
            turn_slider_1.value = "".concat(new_value);
            (0, draw_1.drawGameState)(states_1[new_value]);
            (0, draw_1.highlightNthKia1Ak1)(kiar_ark_1, new_value);
        };
        var button_last = document.getElementById("button_last");
        button_last.onclick = function () {
            var new_value = max_1;
            turn_slider_1.value = "".concat(new_value);
            (0, draw_1.drawGameState)(states_1[new_value]);
            (0, draw_1.highlightNthKia1Ak1)(kiar_ark_1, new_value);
        };
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFF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R0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsR0FBRztZQUNOLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFB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bm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi9vdGhlcl90eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdGFjdGljcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdHlwZV9fbWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2hhbmRsZV9ib2R5X2VsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoX21vbmFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9yZWFkX3Bla3plcF9udW1lcmFscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlX19tZXNzYWdlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RhY3RpY3NcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3RoZXJfdHlwZXNcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKlxyXG4gKiBUaGVvcmV0aWNhbGx5IHNwZWFraW5nLCBpdCBpcyBuZWNlc3NhcnkgdG8gZGlzdGluZ3Vpc2ggeDMyIGFuZCB4NjRcclxuICogYmVjYXVzZSBpdCBpcyBwb3NzaWJsZSB0byBzY29yZSAxIHBvaW50ICgzKzMtNSkuXHJcbiAqIE5vdCB0aGF0IGl0IHdpbGwgZXZlciBiZSBvZiB1c2UgaW4gYW55IHJlYWwgc2l0dWF0aW9uLlxyXG4gKi8gXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUHJvZmVzc2lvbiA9IGV4cG9ydHMuQ29sb3IgPSB2b2lkIDA7XHJcbnZhciBDb2xvcjtcclxuKGZ1bmN0aW9uIChDb2xvcikge1xyXG4gICAgQ29sb3JbQ29sb3JbXCJLb2sxXCJdID0gMF0gPSBcIktvazFcIjtcclxuICAgIENvbG9yW0NvbG9yW1wiSHVvazJcIl0gPSAxXSA9IFwiSHVvazJcIjtcclxufSkoQ29sb3IgPSBleHBvcnRzLkNvbG9yIHx8IChleHBvcnRzLkNvbG9yID0ge30pKTtcclxudmFyIFByb2Zlc3Npb247XHJcbihmdW5jdGlvbiAoUHJvZmVzc2lvbikge1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiTnVhazFcIl0gPSAwXSA9IFwiTnVhazFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdWsyXCJdID0gMV0gPSBcIkthdWsyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJHdWEyXCJdID0gMl0gPSBcIkd1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdW4xXCJdID0gM10gPSBcIkthdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJEYXUyXCJdID0gNF0gPSBcIkRhdTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIk1hdW4xXCJdID0gNV0gPSBcIk1hdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLdWEyXCJdID0gNl0gPSBcIkt1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIlR1azJcIl0gPSA3XSA9IFwiVHVrMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiVWFpMVwiXSA9IDhdID0gXCJVYWkxXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJJb1wiXSA9IDldID0gXCJJb1wiO1xyXG59KShQcm9mZXNzaW9uID0gZXhwb3J0cy5Qcm9mZXNzaW9uIHx8IChleHBvcnRzLlByb2Zlc3Npb24gPSB7fSkpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IGV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gZXhwb3J0cy5oYW5kbGVZYWt1ID0gZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaGVyc18xID0gcmVxdWlyZShcIi4vbXVuY2hlcnNcIik7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuZnVuY3Rpb24gaGFuZGxlVGFtTW92ZShzKSB7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAocmVzdC5jaGFyQXQoMCkgIT09IFwi55qHXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRhbTIgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgZm9ybWF0IGlzIGVpdGhlcjpcclxuICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICBjb25zdCB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGZpcnN0RGVzdCwgbmV4dCkgPT4gKHsgZmlyc3REZXN0LCBuZXh0IH0pLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAodHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQpIHtcclxuICAgICAgICAvLyBlaXRoZXI6XHJcbiAgICAgICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGZpcnN0RGVzdCwgbmV4dCB9LCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQ7XHJcbiAgICAgICAgaWYgKHJlc3QyID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiTm9TdGVwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLCBmaXJzdERlc3QsIHNlY29uZERlc3Q6IG5leHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyeV9tdW5jaF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgICAgICAgICAgaWYgKCF0cnlfbXVuY2hfY29vcmQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiBzZWNvbmREZXN0LCByZXN0OiBlbXB0eSB9ID0gdHJ5X211bmNoX2Nvb3JkO1xyXG4gICAgICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke2VtcHR5fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7IHR5cGU6IFwiVGFtTW92ZVwiLCBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdMYXR0ZXJcIiwgc3JjLCBmaXJzdERlc3QsIHN0ZXA6IG5leHQsIHNlY29uZERlc3QgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0KSA9PiAoeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSksIG11bmNoZXJzXzEubXVuY2hDb29yZCwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSwgcmVzdDogZW1wdHkgfSA9IG11bmNoO1xyXG4gICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nRm9ybWVyXCIsXHJcbiAgICAgICAgICAgICAgICBzcmMsIHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRhbU1vdmUgPSBoYW5kbGVUYW1Nb3ZlO1xyXG5mdW5jdGlvbiBoYW5kbGVZYWt1KHMpIHtcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo1xyXG4gICAgLy8g5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbiAgICBjb25zdCBoYW5kc1NlcEJ5QXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5zZXBCeTEpKHsgcDogbXVuY2hlcnNfMS5tdW5jaEhhbmQsIHNlcDogKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuWKoFwiKSB9KTtcclxuICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgaGFuZHMpID0+IGhhbmRzLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5oiW54K6XCIpLCBoYW5kc1NlcEJ5QXQpKHMpO1xyXG4gICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGhhbmRzLCByZXN0IH0gPSBtdW5jaDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJiZWZvcmVfdHltb2tcIiwgaGFuZHMgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG11bmNoMiA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKF8sIG51bSkgPT4gbnVtLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi6ICM5omLXCIpLCBtdW5jaGVyc18xLm11bmNoUGVremVwTnVtZXJhbCkocmVzdCk7XHJcbiAgICBpZiAoIW11bmNoMikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNjb3JlLCByZXN0OiByZXN0MiB9ID0gbXVuY2gyO1xyXG4gICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0eXBlOiBcImJlZm9yZV90YXhvdFwiLCBoYW5kcywgc2NvcmUgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZVlha3UgPSBoYW5kbGVZYWt1O1xyXG5jb25zdCBtdW5jaFdhdGVyRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuawtFwiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLnhKHmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIDmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuozmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIlcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLlm5tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkupRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gbXVuY2hXYXRlckV2ZW50O1xyXG5jb25zdCBtdW5jaENpdXJsRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIueEoeaSg+ijgVwiKSkge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm5vX2NpdXJsX2V2ZW50XCIgfSwgcmVzdDogcy5zbGljZSgzKSB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCB3YXRlcl9lbnRyeV9jaXVybDogYW5zIH0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmqYtcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBjb25zdCBzdGVwcGluZ19jaXVybCA9IHRbMF0gPT09IFwi54ShXCIgPyAwIDpcclxuICAgICAgICAgICAgdFswXSA9PT0gXCLkuIBcIiA/IDEgOlxyXG4gICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuoxcIiA/IDIgOlxyXG4gICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LiJXCIgPyAzIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLlm5tcIiA/IDQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkupRcIiA/IDUgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGNoYXJhY3RlciBmb3VuZCBhZnRlciDmqYtcIik7IH0pKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHQuc2xpY2UoMSk7XHJcbiAgICAgICAgLy8gRWl0aGVyIG5vdGhpbmcsIOatpOeEoSwgb3IgbXVuY2hXYXRlckV2ZW50XHJcbiAgICAgICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShyZXN0KTtcclxuICAgICAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiB3YXRlcl9lbnRyeV9jaXVybCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwiaGFzX3dhdGVyX2VudHJ5XCIsIHN0ZXBwaW5nX2NpdXJsLCB3YXRlcl9lbnRyeV9jaXVybCB9LCByZXN0OiByZXN0MiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXN0LnN0YXJ0c1dpdGgoXCLmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwib25seV9zdGVwcGluZ1wiLCBzdGVwcGluZ19jaXVybCwgaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M6IGZhbHNlIH0sIHJlc3Q6IFwiXCIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiB0cnVlIH0sIHJlc3QgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBtdW5jaENpdXJsRXZlbnQ7XHJcbmZ1bmN0aW9uIGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhzKSB7XHJcbiAgICBjb25zdCB0cnlfY2l1cmxfZXZlbnQgPSAoMCwgZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQpKHMpO1xyXG4gICAgaWYgKCF0cnlfY2l1cmxfZXZlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgY2l1cmwgZXZlbnQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBjaXVybF9ldmVudCwgcmVzdCB9ID0gdHJ5X2NpdXJsX2V2ZW50O1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCB9O1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb3B0aW9uYWxfcGllY2VfY2FwdHVyZSA9ICgwLCBtdW5jaGVyc18xLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCkocmVzdCk7XHJcbiAgICBpZiAob3B0aW9uYWxfcGllY2VfY2FwdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBwaWVjZV9jYXB0dXJlLCByZXN0OiByZXN0MiB9ID0gb3B0aW9uYWxfcGllY2VfY2FwdHVyZTtcclxuICAgICAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFpbGluZyBwYXJhbWV0ZXIgXFxgJHtzfVxcYCBoYXMgc29tZSBleHRyYSBcXGAke3Jlc3QyfVxcYCBhdCB0aGUgZW5kYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50LCBwaWVjZV9jYXB0dXJlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgdHJhaWxpbmcgcGFyYW1ldGVyOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnM7XHJcbmZ1bmN0aW9uIGhhbmRsZUJvZHlFbGVtZW50KHMpIHtcclxuICAgIGlmIChzID09PSBcIuaYpee1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAwIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlpI/ntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi56eL57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWGrOe1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAzIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLntYLlraNcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImVuZF9zZWFzb25cIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5YaN6KGMXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJnb19hZ2FpblwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLmmJ/kuIDlkahcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImdhbWVfc2V0XCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi54K6XCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVlha3Uocyk7XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueah1wiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVUYW1Nb3ZlKHMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2Zyb21faG9wenVvID0gKDAsIG11bmNoZXJzXzEubXVuY2hGcm9tSG9wWnVvKShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfZnJvbV9ob3B6dW8pIHtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBjb2xvciwgcHJvZiwgZGVzdCB9LCByZXN0IH0gPSB0cnlfbXVuY2hfZnJvbV9ob3B6dW87XHJcbiAgICAgICAgaWYgKHJlc3QgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImZyb21faG9wenVvXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRnJvbUhvcDFadW8xXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3NyYyA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHMpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfc3JjKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc3JjLCByZXN0IH0gPSB0cnlfbXVuY2hfc3JjO1xyXG4gICAgaWYgKCFbXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLoiLlcIiwgXCLniYdcIl0uaW5jbHVkZXMocmVzdC5jaGFyQXQoMCkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCBhIHByb2Zlc3Npb24gd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfMm5kX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8ybmRfY29vcmQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRoZSBzZWNvbmQgY29vcmRpbmF0ZSB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzZWNvbmRfY29vcmQsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfMm5kX2Nvb3JkO1xyXG4gICAgY29uc3QgdHJ5X211bmNoXzNyZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgIGlmICghdHJ5X211bmNoXzNyZF9jb29yZCkge1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QyKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY0RzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBzZWNvbmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHRoaXJkX2Nvb3JkLCByZXN0OiByZXN0MyB9ID0gdHJ5X211bmNoXzNyZF9jb29yZDtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Myk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNTdGVwRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IHNlY29uZF9jb29yZCxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiB0aGlyZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVCb2R5RWxlbWVudCA9IGhhbmRsZUJvZHlFbGVtZW50O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gdm9pZCAwO1xyXG5jb25zdCBoYW5kbGVfYm9keV9lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9oYW5kbGVfYm9keV9lbGVtZW50XCIpO1xyXG5mdW5jdGlvbiBwYXJzZUNlcmtlT25saW5lS2lhMUFrMShzKSB7XHJcbiAgICBjb25zdCBsaW5lcyA9IHMudHJpbSgpLnNwbGl0KFwiXFxuXCIpLm1hcChsID0+IGwudHJpbSgpKTtcclxuICAgIGNvbnN0IGJvZHlfc3RhcnRzX2F0ID0gbGluZXMuZmluZEluZGV4KGwgPT4gJ0tMTlRaWENNUFwiJy5pbmNsdWRlcyhsWzBdID8/ICckJykpO1xyXG4gICAgY29uc3QgaW5pdGlhbF9saW5lID0gbGluZXNbMF07XHJcbiAgICBpZiAoaW5pdGlhbF9saW5lID09PSB1bmRlZmluZWQgLyogU2luY2Ugd2UgdXNlZCAuc3BsaXQoKSwgdGhpcyBhY3R1YWxseSBjYW4ndCBoYXBwZW4gKi8gfHwgaW5pdGlhbF9saW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM44GC44KK44G+44Gb44KTXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoL15cXHvlp4vmmYI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+Wni+aZgjog44Gn5aeL44G+44Gj44Gm44GE44G+44GZ44CC44GT44KM44GvMjAyMeW5tDEx5pyI5pyr44Ki44OD44OX44OH44O844OI5Lul5YmN44Gu5qOL6K2c44Gn44GC44KK44CB44G+44Gg5a++5b+c44Gn44GN44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIS9eXFx75LiA5L2N6ImyOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvkuIDkvY3oibI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0aW5nX3BsYXllcnMgPSBpbml0aWFsX2xpbmUubWF0Y2goL15cXHvkuIDkvY3oibI6KFvpu5LotaRdKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nX3RpbWUgPSBsaW5lc1sxXT8ubWF0Y2goL15cXHvlp4vmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgZW5kaW5nX3RpbWUgPSBsaW5lc1syXT8ubWF0Y2goL15cXHvntYLmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgYm9kaWVzID0gbGluZXMuc2xpY2UoYm9keV9zdGFydHNfYXQpLmZsYXRNYXAobGluZSA9PiBsaW5lLnNwbGl0KC9bXFxzXFxuXS9nKSkuZmlsdGVyKGEgPT4gYSAhPT0gXCJcIik7XHJcbiAgICBjb25zdCBwYXJzZWRfYm9kaWVzID0gYm9kaWVzLm1hcChoYW5kbGVfYm9keV9lbGVtZW50XzEuaGFuZGxlQm9keUVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIHsgc3RhcnRpbmdfcGxheWVycywgc3RhcnRpbmdfdGltZSwgZW5kaW5nX3RpbWUsIHBhcnNlZF9ib2RpZXMgfTtcclxufVxyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gZXhwb3J0cy5tYW55MSA9IGV4cG9ydHMubWFueSA9IGV4cG9ydHMubGlmdE0zID0gZXhwb3J0cy5zdHJpbmcgPSBleHBvcnRzLmxpZnRNMiA9IGV4cG9ydHMucHVyZSA9IGV4cG9ydHMuYmluZCA9IHZvaWQgMDtcclxuLy8gbW9uYWRcclxuY29uc3QgYmluZCA9IChtYSwgY2FsbGJhY2spID0+ICgoaW5wdXQpID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrKGEpKHJlc3QpO1xyXG59KTtcclxuZXhwb3J0cy5iaW5kID0gYmluZDtcclxuY29uc3QgcHVyZSA9IChhKSA9PiAoaW5wdXQpID0+ICh7IGFuczogYSwgcmVzdDogaW5wdXQgfSk7XHJcbmV4cG9ydHMucHVyZSA9IHB1cmU7XHJcbmNvbnN0IGxpZnRNMiA9IChmLCBtYSwgbWIpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYikpKSk7XHJcbmV4cG9ydHMubGlmdE0yID0gbGlmdE0yO1xyXG5jb25zdCBzdHJpbmcgPSAocHJlZml4KSA9PiAoaW5wdXQpID0+IGlucHV0LnN0YXJ0c1dpdGgocHJlZml4KSA/IHsgYW5zOiB1bmRlZmluZWQsIHJlc3Q6IGlucHV0LnNsaWNlKHByZWZpeC5sZW5ndGgpIH0gOiBudWxsO1xyXG5leHBvcnRzLnN0cmluZyA9IHN0cmluZztcclxuY29uc3QgbGlmdE0zID0gKGYsIG1hLCBtYiwgbWMpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLmJpbmQpKG1jLCBjID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYiwgYykpKSkpO1xyXG5leHBvcnRzLmxpZnRNMyA9IGxpZnRNMztcclxuY29uc3QgbWFueSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBsZXQgcmVzdCA9IGlucHV0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkgPSBtYW55O1xyXG5jb25zdCBtYW55MSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgbGV0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgY29uc3QgYW5zID0gW2FdO1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkxID0gbWFueTE7XHJcbmNvbnN0IHNlcEJ5MSA9ICh7IHA6IG1hLCBzZXAgfSkgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkoKDAsIGV4cG9ydHMubWFueSkoKDAsIGV4cG9ydHMuYmluZCkoc2VwLCAoXykgPT4gbWEpKSwgYXMgPT4gKDAsIGV4cG9ydHMucHVyZSkoW2EsIC4uLmFzXSkpKTtcclxuZXhwb3J0cy5zZXBCeTEgPSBzZXBCeTE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSBleHBvcnRzLm11bmNoRnJvbUhvcFp1byA9IGV4cG9ydHMubXVuY2hDb29yZCA9IGV4cG9ydHMubXVuY2hIYW5kID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaF9tb25hZF8xID0gcmVxdWlyZShcIi4vbXVuY2hfbW9uYWRcIik7XHJcbmNvbnN0IHJlYWRfcGVremVwX251bWVyYWxzXzEgPSByZXF1aXJlKFwiLi9yZWFkX3Bla3plcF9udW1lcmFsc1wiKTtcclxuY29uc3QgbXVuY2hDb2xvciA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LWkXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUHJvZmVzc2lvbiA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6Ii5XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlhbVcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW8k1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LuKXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDMsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLomY5cIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIummrFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi562GXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDYsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlt6tcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWwhlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA4LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi546LXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDksIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaENvbHVtbiA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBjb2xzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgY29scykge1xyXG4gICAgICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gY29sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogY29sLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUm93ID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCJBSVwiLCBcIkFVXCIsIFwiSUFcIiAvKiBoYW5kbGUgdGhlIGxvbmdlciBvbmVzIGZpcnN0ICovLCBcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKHJvdykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiByb3csIHJlc3Q6IHMuc2xpY2Uocm93Lmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hIYW5kID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGhhbmRzID0gW1wi546LXCIsIFwi542jXCIsIFwi5ZCM6Imy542jXCIsIFwi5Zyw5b+DXCIsIFwi5ZCM6Imy5Zyw5b+DXCIsIFwi6aas5byT5YW1XCIsIFwi5ZCM6Imy6aas5byT5YW1XCIsXHJcbiAgICAgICAgXCLliqnlj4tcIiwgXCLlkIzoibLliqnlj4tcIiwgXCLmiKbpm4ZcIiwgXCLlkIzoibLmiKbpm4ZcIiwgXCLooYzooYxcIiwgXCLlkIzoibLooYzooYxcIiwgXCLnrYblhbXnhKHlgr5cIiwgXCLlkIzoibLnrYblhbXnhKHlgr5cIixcclxuICAgICAgICBcIumXh+aIpuS5i+mbhlwiLCBcIuWQjOiJsumXh+aIpuS5i+mbhlwiLCBcIueEoeaKl+ihjOWHplwiLCBcIuWQjOiJsueEoeaKl+ihjOWHplwiXTtcclxuICAgIGZvciAoY29uc3QgaGFuZCBvZiBoYW5kcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoaGFuZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBoYW5kLCByZXN0OiBzLnNsaWNlKGhhbmQubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoSGFuZCA9IG11bmNoSGFuZDtcclxuZXhwb3J0cy5tdW5jaENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoY29sLCByb3cpID0+IHtcclxuICAgIGNvbnN0IGNvb3JkID0gW3JvdywgY29sXTtcclxuICAgIHJldHVybiBjb29yZDtcclxufSwgbXVuY2hDb2x1bW4sIG11bmNoUm93KTtcclxuZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChjb2xvciwgcHJvZiwgZGVzdCkgPT4gKHsgY29sb3IsIHByb2YsIGRlc3QgfSksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbiwgZXhwb3J0cy5tdW5jaENvb3JkKTtcclxuZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfLCBjb2xvciwgcHJvZikgPT4gKHsgY29sb3IsIHByb2YgfSksICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiYtcIiksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbik7XHJcbmV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8xLCBjb29yZCwgXzIpID0+IGNvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiW1wiKSwgZXhwb3J0cy5tdW5jaENvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiXVwiKSk7XHJcbmNvbnN0IG11bmNoRGlnaXRMaW56a2xhciA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBkcyA9IFtcIueEoVwiLCBcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiLCBcIuWNgVwiLCBcIuS4i1wiLCBcIueZvlwiXTtcclxuICAgIGZvciAoY29uc3QgZCBvZiBkcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBkLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUGVremVwTnVtZXJhbCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCB0MSA9ICgwLCBtdW5jaF9tb25hZF8xLm1hbnkxKShtdW5jaERpZ2l0TGluemtsYXIpKHMpO1xyXG4gICAgaWYgKCF0MSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zLCByZXN0IH0gPSB0MTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgbnVtID0gKDAsIHJlYWRfcGVremVwX251bWVyYWxzXzEuZnJvbURpZ2l0c0xpbnprbGFyKShhbnMpO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogbnVtLCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IG11bmNoUGVremVwTnVtZXJhbDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhcihpKSB7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnhKFcIiAmJiBpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5LiLXCIpIHtcclxuICAgICAgICByZXR1cm4gLWZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIueZvlwiKSB7XHJcbiAgICAgICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAxMDAgKyBmcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbmRleDEwMCA9IGkuaW5kZXhPZihcIueZvlwiKTtcclxuICAgIGlmIChpbmRleDEwMCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBodW5kcmVkcyA9IGkuc2xpY2UoMCwgaW5kZXgxMDApO1xyXG4gICAgICAgIGNvbnN0IG9uZXMgPSBpLnNsaWNlKGluZGV4MTAwICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIDEwMCAqIGZyb21EaWdpdHNMaW56a2xhclN1YihodW5kcmVkcykgKyBmcm9tRGlnaXRzTGluemtsYXJTdWIob25lcyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGlmIChpWzFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICogcGFyc2VVbml0KGlbMF0pICsgcGFyc2VVbml0KGlbMl0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIFwiJHtpfVwiIGFzIGEgcGVremVwIG51bWVyYWxgKTtcclxufVxyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IGZyb21EaWdpdHNMaW56a2xhcjtcclxuZnVuY3Rpb24gcGFyc2VVbml0KG9uZXMpIHtcclxuICAgIGlmIChvbmVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4gFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuoxcIikge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiJXCIpIHtcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWbm1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkupRcIikge1xyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWtXCIpIHtcclxuICAgICAgICByZXR1cm4gNjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4g1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDc7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlhatcIikge1xyXG4gICAgICAgIHJldHVybiA4O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LmdXCIpIHtcclxuICAgICAgICByZXR1cm4gOTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgXCIke29uZXN9XCIgd2hpbGUgdHJ5aW5nIHRvIHBhcnNlIHBla3plcCBudW1lcmFsc2ApO1xyXG59XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhclN1YihpKSB7XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlbaS5sZW5ndGggLSAxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSkgKiAxMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGEgPSBpWzBdO1xyXG4gICAgICAgIGNvbnN0IGIgPSBpWzFdO1xyXG4gICAgICAgIGlmIChiID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKSAqIDEwICsgcGFyc2VVbml0KGIpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcbmltcG9ydCB7IE5vblRhbVBpZWNlLCBTdGF0ZSwgSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBwcm9mcywgQm9hcmQsIE92ZXJsYXllZE1lc3NhZ2UgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhlaWdodCA9IDM4NztcclxuZXhwb3J0IGNvbnN0IGxlZnRfbWFyZ2luID0gNDA7XHJcbmV4cG9ydCBjb25zdCB0b3BfbWFyZ2luID0gNDA7XHJcbmV4cG9ydCBjb25zdCBjZWxsX3NpemUgPSA0MztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3RW1wdHlCb2FyZCgpIHtcclxuICAgIGNvbnN0IGN0eCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN2XCIpISBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAvLyDnmoflh6ZcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyNywgNTQuNSUsIDgxLjElKVwiXHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuXHJcbiAgICAvLyDnmofmsLRcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyMTMsIDMzLjYlLCA3OC45JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICAvLyDnmoflsbFcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgxMjksIDM4LjUlLCA0NS40JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoOTksIDk5LCA5OSknO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDAuMDMgKiBoZWlnaHQgLyA5O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgMCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaGVpZ2h0LCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5mb250ID0gXCIyMHB4IHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigwLDAsMClcIjtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIiwgXCJBSVwiLCBcIkFVXCIsIFwiSUFcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCBsZWZ0X21hcmdpbiArIGhlaWdodCArIDEwLCB0b3BfbWFyZ2luICsgMzAgKyBjZWxsX3NpemUgKiBpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByb3dzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpLCB0b3BfbWFyZ2luIC0gMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcblxyXG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJKTtcclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCAtbGVmdF9tYXJnaW4gKyAxMCwgLSh0b3BfbWFyZ2luICsgMTUgKyBjZWxsX3NpemUgKiBpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIC0obGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGkpLCAtKHRvcF9tYXJnaW4gKyBoZWlnaHQgKyAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldF90b3BfbGVmdChjb29yZDogQWJzb2x1dGVDb29yZCkge1xyXG4gICAgY29uc3QgY29sdW1uID0ge1xyXG4gICAgICAgIEs6IDAsXHJcbiAgICAgICAgTDogMSxcclxuICAgICAgICBOOiAyLFxyXG4gICAgICAgIFQ6IDMsXHJcbiAgICAgICAgWjogNCxcclxuICAgICAgICBYOiA1LFxyXG4gICAgICAgIEM6IDYsXHJcbiAgICAgICAgTTogNyxcclxuICAgICAgICBQOiA4XHJcbiAgICB9W2Nvb3JkWzFdXTtcclxuICAgIGNvbnN0IHJvdyA9IHtcclxuICAgICAgICBJQTogOCxcclxuICAgICAgICBBVTogNyxcclxuICAgICAgICBBSTogNiwgWTogNSwgTzogNCwgVTogMywgSTogMiwgRTogMSwgQTogMFxyXG4gICAgfVtjb29yZFswXV07XHJcbiAgICBjb25zdCBsZWZ0ID0gbGVmdF9tYXJnaW4gKyBjZWxsX3NpemUgKiAoY29sdW1uIC0gMC41KTtcclxuICAgIGNvbnN0IHRvcCA9IHRvcF9tYXJnaW4gKyBjZWxsX3NpemUgKiAocm93IC0gMC41KTtcclxuICAgIHJldHVybiB7IGxlZnQsIHRvcCB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb2N1c1BsYW5uZWREZXN0SFRNTChmb2N1c19wbGFubmVkX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfcGxhbm5lZF9kZXN0KSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfcGxhbm5lZF9kZXN0KTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDI1JTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE3OCwgMjU1LCAyNTUpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9jdXNTdGVwcGVkSFRNTChmb2N1c19zdGVwcGVkOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3N0ZXBwZWQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zdGVwcGVkKTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMCwgMC4zKVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdGb2N1c1NyYyhmb2N1c19zcmM6IEFic29sdXRlQ29vcmQgfCBcImFfc2lkZV9ob3AxenVvMVwiIHwgXCJpYV9zaWRlX2hvcDF6dW8xXCIgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfc3JjIHx8IGZvY3VzX3NyYyA9PT0gXCJhX3NpZGVfaG9wMXp1bzFcIiB8fCBmb2N1c19zcmMgPT09IFwiaWFfc2lkZV9ob3AxenVvMVwiKSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfc3JjKTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBQaWVjZXNPbkJvYXJkSFRNTChib2FyZDogQm9hcmQsIGZvY3VzOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAoY29uc3QgY2xtIGluIGJvYXJkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBydyBpbiBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzX2ZvY3VzZWQgPSBmb2N1cyA/IGZvY3VzWzFdID09PSBjbG0gJiYgZm9jdXNbMF0gPT09IHJ3IDogZmFsc2U7XHJcbiAgICAgICAgICAgIGFucyArPSBQb3NpdGlvbmVkUGllY2VPbkJvYXJkSFRNTChcclxuICAgICAgICAgICAgICAgIGNsbSBhcyBBYnNvbHV0ZUNvbHVtbixcclxuICAgICAgICAgICAgICAgIHJ3IGFzIEFic29sdXRlUm93LFxyXG4gICAgICAgICAgICAgICAgYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSFbcncgYXMgQWJzb2x1dGVSb3ddISxcclxuICAgICAgICAgICAgICAgIGlzX2ZvY3VzZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIEhvcDFadW8xSFRNTChwaWVjZXM6IE5vblRhbVBpZWNlW10sIGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuKSB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiB9ID0gcGllY2VzW2ldO1xyXG4gICAgICAgIGNvbnN0IHJhZCA9IDE4IC8gMC4yNjtcclxuICAgICAgICBhbnMgKz0gYDxsaT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDIzcHg7IFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAke2NlbGxfc2l6ZX1weDsgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpOyBcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0OyBcclxuICAgICAgICAgICAgXCI+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICR7aXNfbmV3bHlfYWNxdWlyZWQgJiYgaSA9PSBwaWVjZXMubGVuZ3RoIC0gMSA/IGA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJHs0MiAtIHJhZH1weDtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7cmFkICogMn1weDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7cmFkICogMn1weDtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNSU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCA2MCwgNTAsIDAuMyk7XHJcbiAgICAgICAgICAgICAgICBcIj48L2Rpdj5gIDogXCJcIn1cclxuICAgICAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKGNvbG9yLCBwcm9mLCBmYWxzZSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbGk+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3R2FtZVN0YXRlKFNUQVRFOiBTdGF0ZSkge1xyXG4gICAgaWYgKFNUQVRFLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5hZGQoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICB9IGVsc2UgaWYgKFNUQVRFLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LmFkZChcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXNvbl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5nYW1lX2hhc19lbmRlZCA/IFwi5pif5LiA5ZGoXCIgOiBTVEFURS5zZWFzb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUudHVybiArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhdGVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUucmF0ZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuaWFfc2lkZS5ob3AxenVvMSwgU1RBVEUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpZWNlc19pbm5lclwiKSEuaW5uZXJIVE1MID0gRm9jdXNTdGVwcGVkSFRNTChTVEFURS5mb2N1cy5zdGVwcGVkKSArXHJcbiAgICAgICAgZHJhd0ZvY3VzU3JjKFNUQVRFLmZvY3VzLnNyYykgK1xyXG4gICAgICAgIEZvY3VzUGxhbm5lZERlc3RIVE1MKFNUQVRFLmZvY3VzLmluaXRpYWxseV9wbGFubmVkX2Rlc3QpICtcclxuICAgICAgICBQaWVjZXNPbkJvYXJkSFRNTChTVEFURS5ib2FyZCwgU1RBVEUuZm9jdXMuYWN0dWFsX2ZpbmFsX2Rlc3QpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5YWt1X2Rpc3BsYXlcIikhLmlubmVySFRNTCA9IE92ZXJsYXllZE1lc3NhZ2VIVE1MKFNUQVRFLm92ZXJsYXllZF9tZXNzYWdlKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIE92ZXJsYXllZE1lc3NhZ2VIVE1MKGE6IE92ZXJsYXllZE1lc3NhZ2UgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghYSkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjb250ZW50ID0gKChhOiBPdmVybGF5ZWRNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgaWYgKGEudHlwZSA9PT0gXCJiZWZvcmVfdGF4b3RcIiB8fCBhLnR5cGUgPT09IFwiYmVmb3JlX3R5bW9rXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaGFuZHMuam9pbihcIjxicj5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhLnR5cGUgPT09IFwiZW5kX3NlYXNvblwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBg57WC5a2jPGJyPiR7YS5zY29yZX1gO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYS50eXBlID09PSBcImdvX2FnYWluXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGDlho3ooYxgXHJcbiAgICAgICAgfSBlbHNlIGlmIChhLnR5cGUgPT09IFwiZ2FtZV9zZXRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYOaYn+S4gOWRqGBcclxuICAgICAgICB9IGVsc2UgaWYgKGEudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHthLnNlYXNvbn3ntYJgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgXyA6IG5ldmVyID0gYTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IERhdDJEaXNwbGF5LnR5cGUgaXMgaW52YWxpZGApXHJcbiAgICAgICAgfVxyXG4gICAgfSkoYSk7XHJcbiAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogNDY5cHg7XHJcbiAgICBoZWlnaHQ6IDI1NnB4O1xyXG4gICAgdG9wOiAxMzFweDtcclxuICAgIGxlZnQ6IDQ0cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDgwJSk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cIj4ke2NvbnRlbnR9PC9kaXY+YFxyXG59XHJcblxyXG5mdW5jdGlvbiBOb3JtYWxQaWVjZUhUTUwoY29sb3I6IFwi6buSXCIgfCBcIui1pFwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb25BbmRUYW0sIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHggPSBwcm9mcy5pbmRleE9mKHByb2YpICogLTEwMCAtIDI3O1xyXG4gICAgY29uc3QgeSA9IGlzX2JvbGQgPyAwIDogLTI3NztcclxuICAgIGNvbnN0IGNvbG9yX3BhdGggPSB7XHJcbiAgICAgICAgXCLpu5JcIjogXCLjgrTjgrfjg4Pjgq/pp5JcIixcclxuICAgICAgICBcIui1pFwiOiBcIuOCtOOCt+ODg+OCr+mnkl/otaRcIixcclxuICAgIH1bY29sb3JdO1xyXG4gICAgcmV0dXJuIGA8ZGl2XHJcbiAgICBzdHlsZT1cIndpZHRoOiA4N3B4OyBoZWlnaHQ6IDg3cHg7IGJhY2tncm91bmQtcG9zaXRpb24teDogJHt4fXB4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXk6ICR7eX1weDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7Y29sb3JfcGF0aH0uc3ZnKTsgXCI+XHJcbjwvZGl2PmBcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFBvc2l0aW9uZWRQaWVjZU9uQm9hcmRIVE1MKGNsbTogQWJzb2x1dGVDb2x1bW4sIHJ3OiBBYnNvbHV0ZVJvdywgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIiwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IGdldF90b3BfbGVmdChbcncsIGNsbV0pO1xyXG4gICAgaWYgKHBpZWNlID09PSBcIueah1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtcInJvdGF0ZSg5MGRlZylcIn1cIj5cclxuICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrOiBzdHJpbmcsIG46IG51bWJlcikge1xyXG4gICAgY29uc3QgbGluZXMgPSBraWFyX2Fyay50cmltKCkuc3BsaXQoXCJcXG5cIik7XHJcbiAgICBjb25zdCBib2R5X3N0YXJ0c19hdCA9IGxpbmVzLmZpbmRJbmRleChsID0+ICdLTE5UWlhDTVBcIicuaW5jbHVkZXMobFswXSA/PyAnJCcpKTtcclxuICAgIGlmIChib2R5X3N0YXJ0c19hdCA9PT0gLTEpIHtcclxuICAgICAgICBhbGVydChcIuaji+itnOOBjOepuuOBp+OBmeOAgmluZGV4Lmh0bWwg44Gr5oi744Gj44Gm5YaN5YWl5Yqb44GX44Gm44GP44Gg44GV44GE44CCXCIpO1xyXG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiO1xyXG4gICAgfVxyXG4gICAgLy8gd2hlbiBuID0gMCwgbm90aGluZyBzaG91bGQgYmUgaGlnaGxpZ2h0ZWRcclxuICAgIGZvciAobGV0IGkgPSBib2R5X3N0YXJ0c19hdDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpbmVzW2ldLnRyaW0oKSA9PT0gXCJcIikgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgZWxlbXNfbGVuZ3RoID0gbGluZXNbaV0uc3BsaXQoLyAvZykuZmlsdGVyKGEgPT4gYSAhPT0gXCJcIikubGVuZ3RoO1xyXG4gICAgICAgIGlmIChuID4gZWxlbXNfbGVuZ3RoIHx8IG4gPD0gMCkge1xyXG4gICAgICAgICAgICBuIC09IGVsZW1zX2xlbmd0aDsgY29udGludWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbiA9IDEgPT4gaGlnaGxpZ2h0IHRoZSBmaXJzdCBlbGVtZW50LCBhbmQgc28gb25cclxuICAgICAgICAgICAgY29uc3QgYXJyID0gbGluZXNbaV0uc3BsaXQoLyAvZyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2pdID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG4tLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA9PT0gMCkgeyBhcnJbal0gPSBgPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjY2NjO1wiPiR7YXJyW2pdfTwvc3Bhbj5gOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGluZXNbaV0gPSBhcnIuam9pbihcIiBcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJraWFfYWtcIikhLmlubmVySFRNTCA9IGxpbmVzLmpvaW4oXCJcXG5cIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQsIFBhcnNlZCwgQ2l1cmxFdmVudCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyXCI7XHJcbmltcG9ydCB7IEJvYXJkLCBmcm9tSGFuemlTZWFzb24sIEhhbnppQ29sb3IsIEhhbnppUHJvZmVzc2lvbiwgTm9uVGFtUGllY2UsIFN0YXRlLCB0b0hhbnppQ29sb3IsIHRvSGFuemlQcm9mZXNzaW9uIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuaW1wb3J0IHsgQWJzb2x1dGVDb29yZCwgQ29sb3IsIFByb2Zlc3Npb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbEJvYXJkKCk6IEJvYXJkIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Szoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEw6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHROOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFQ6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRaOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdE86IFwi55qHXCIsXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFg6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRDOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE06IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRQOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUobzoge1xyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nXHJcblx0fSxcclxuXHRhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdH0sXHJcbn0pOiBTdGF0ZSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlYXNvbjogXCLmmKVcIixcclxuXHRcdGdhbWVfaGFzX2VuZGVkOiBmYWxzZSxcclxuXHRcdHR1cm46IDAsXHJcblx0XHRyYXRlOiAxLFxyXG5cdFx0d2hvc2VfdHVybjogbnVsbCxcclxuXHRcdGZvY3VzOiB7XHJcblx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBudWxsLFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IG51bGwsXHJcblx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IG51bGxcclxuXHRcdH0sXHJcblx0XHRib2FyZDogZ2V0SW5pdGlhbEJvYXJkKCksXHJcblx0XHRpYV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBvLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0cGxheWVyX25hbWU6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdFx0YV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBvLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0cGxheWVyX25hbWU6IG8uYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRob3AxenVvMTogW10sXHJcblx0XHRcdHNjb3JlOiAyMCxcclxuXHRcdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGZhbHNlLFxyXG5cdFx0fSxcclxuXHRcdG92ZXJsYXllZF9tZXNzYWdlOiBudWxsLFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XHJcblx0Y29uc3QgcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdGlmICghcGllY2UpIHsgdGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTsgfVxyXG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdHJldHVybiBwaWVjZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X3RvKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQsIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIpOiBOb25UYW1QaWVjZSB8IHVuZGVmaW5lZCB7XHJcblx0aWYgKHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0pIHtcclxuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRcdGlmIChjYXB0dXJlZF9waWVjZSA9PT0gXCLnmodcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+eah+OBjOaXouOBq+OBguOCiuOBvuOBmWApO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIGNhcHR1cmVkX3BpZWNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XHJcblx0aWYgKHBpZWNlLmlzX2FzaWRlKSB7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiBmYWxzZSB9KTtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IHRydWUgfSk7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb21faG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBvOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH0pIHtcclxuXHRjb25zdCBpbmRleCA9IHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLmZpbmRJbmRleChrID0+IGsuY29sb3IgPT09IG8uY29sb3IgJiYgay5wcm9mID09PSBvLnByb2YpO1xyXG5cdGlmIChpbmRleCA9PT0gLTEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDmjIHjgaHpp5Ljgaske28uY29sb3J9JHtvLnByb2Z944GM44GC44KK44G+44Gb44KTYCk7XHJcblx0fVxyXG5cdHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLnNwbGljZShpbmRleCwgMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGNpdXJsX2V2ZW50OiBDaXVybEV2ZW50KTogYm9vbGVhbiB7XHJcblx0aWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwibm9fY2l1cmxfZXZlbnRcIikge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcIm9ubHlfc3RlcHBpbmdcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LmluZmFmdGVyc3RlcF9zdWNjZXNzO1xyXG5cdH0gZWxzZSBpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJoYXNfd2F0ZXJfZW50cnlcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LndhdGVyX2VudHJ5X2NpdXJsID49IDM7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gY2l1cmxfZXZlbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gY2l1cmxfZXZlbnQudHlwZVwiKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRTdGF0ZShvbGRfc3RhdGU6IFJlYWRvbmx5PFN0YXRlPiwgYm9keV9lbGVtZW50OiBCb2R5RWxlbWVudCwgc3RhcnRpbmdfcGxheWVyczogSGFuemlDb2xvcltdKTogU3RhdGUgfCBudWxsIHtcclxuXHRjb25zdCBuZXdfc3RhdGU6IFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvbGRfc3RhdGUpKTtcclxuXHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IG51bGwpIHtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gc3RhcnRpbmdfcGxheWVyc1tmcm9tSGFuemlTZWFzb24ob2xkX3N0YXRlLnNlYXNvbildID09PSBcIui1pFwiID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiO1xyXG5cdH1cclxuXHJcblx0Ly8gY2xlYXIgdGhlIGZsYWdzXHJcblx0bmV3X3N0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSBmYWxzZTtcclxuXHRuZXdfc3RhdGUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0c3JjOiBudWxsLFxyXG5cdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IG51bGwsXHJcblx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogbnVsbFxyXG5cdH07XHJcblx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0gbnVsbDtcclxuXHJcblx0aWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInNlYXNvbl9lbmRzXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2U/LnR5cGUgIT09IFwiZW5kX3NlYXNvblwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDjgIwke29sZF9zdGF0ZS5zZWFzb25957WC44CN44Gu5YmN44Gr44Gv44CB44CM57WC5a2j44CN44GM5b+F6KaB44Gn44GZYCk7XHJcblx0XHR9XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLmFfc2lkZS5zY29yZSArPSBvbGRfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2Uuc2NvcmU7XHJcblx0XHRcdG5ld19zdGF0ZS5pYV9zaWRlLnNjb3JlIC09IG9sZF9zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZS5zY29yZTtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS5pYV9zaWRlLnNjb3JlICs9IG9sZF9zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZS5zY29yZTtcclxuXHRcdFx0bmV3X3N0YXRlLmFfc2lkZS5zY29yZSAtPSBvbGRfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2Uuc2NvcmU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog44Gp44Gu44OX44Os44Kk44Ok44O844Gu6KGM54K644Gr44KI44Gj44Gm5a2j56+A44GM57WC44KP44Gj44Gf44Gu44GL44GM5piO44KJ44GL44Gn44Gv44GC44KK44G+44Gb44KTYCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmV3X3N0YXRlLnNlYXNvbiA9XHJcblx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5pilXCIgPyBcIuWkj1wiIDpcclxuXHRcdFx0XHRvbGRfc3RhdGUuc2Vhc29uID09PSBcIuWkj1wiID8gXCLnp4tcIiA6XHJcblx0XHRcdFx0XHRvbGRfc3RhdGUuc2Vhc29uID09PSBcIueni1wiID8gXCLlhqxcIiA6XHJcblx0XHRcdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5YasXCIgPyBcIuaYpVwiIC8qIGR1bW15ICovIDpcclxuXHRcdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCBzZWFzb25gKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLmdhbWVfaGFzX2VuZGVkID0gb2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIjtcclxuXHRcdG5ld19zdGF0ZS50dXJuID0gMDtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gbnVsbDtcclxuXHRcdG5ld19zdGF0ZS5ib2FyZCA9IGdldEluaXRpYWxCb2FyZCgpO1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogb2xkX3N0YXRlLnNlYXNvbiB9XHJcblx0XHRuZXdfc3RhdGUuYV9zaWRlLmhvcDF6dW8xID0gW107XHJcblx0XHRuZXdfc3RhdGUuaWFfc2lkZS5ob3AxenVvMSA9IFtdO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZ29fYWdhaW5cIikge1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImdvX2FnYWluXCIgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuXHRcdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IHsgdHlwZTogXCJnYW1lX3NldFwiIH07XHJcblx0XHRuZXdfc3RhdGUuZ2FtZV9oYXNfZW5kZWQgPSB0cnVlO1xyXG5cdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBudWxsO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiYmVmb3JlX3RheG90XCIpIHtcclxuXHRcdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IHsgdHlwZTogXCJiZWZvcmVfdGF4b3RcIiwgaGFuZHM6IGJvZHlfZWxlbWVudC5oYW5kcywgc2NvcmU6IGJvZHlfZWxlbWVudC5zY29yZSB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiYmVmb3JlX3R5bW9rXCIpIHtcclxuXHRcdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IHsgdHlwZTogXCJiZWZvcmVfdHltb2tcIiwgaGFuZHM6IGJvZHlfZWxlbWVudC5oYW5kcyB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZW5kX3NlYXNvblwiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlPy50eXBlICE9PSBcImJlZm9yZV90YXhvdFwiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIuOCqOODqeODvDog44CM57WC5a2j44CN44Gu5YmN44Gr44Gv44CB542y5b6X44GX44Gf5b2544Gu5LiA6Kan44GM5b+F6KaB44Gn44GZXCIpO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImVuZF9zZWFzb25cIiwgc2NvcmU6IG9sZF9zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZS5zY29yZSB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZnJvbV9ob3B6dW9cIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUudHVybisrO1xyXG5cdFx0Y29uc3QgZGF0YToge1xyXG5cdFx0XHR0eXBlOiBcIkZyb21Ib3AxWnVvMVwiO1xyXG5cdFx0XHRjb2xvcjogQ29sb3I7XHJcblx0XHRcdHByb2Y6IFByb2Zlc3Npb247XHJcblx0XHRcdGRlc3Q6IEFic29sdXRlQ29vcmQ7XHJcblx0XHR9ID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRjb25zdCBjb2xvciA9IHRvSGFuemlDb2xvcihkYXRhLmNvbG9yKTtcclxuXHRcdGNvbnN0IHByb2YgPSB0b0hhbnppUHJvZmVzc2lvbihkYXRhLnByb2YpO1xyXG5cdFx0Y29uc3QgaXNfYXNpZGUgPSBuZXdfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIjtcclxuXHRcdHJlbW92ZV9mcm9tX2hvcDF6dW8xKG5ld19zdGF0ZSwgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSk7XHJcblx0XHRzZXRfdG8obmV3X3N0YXRlLCBkYXRhLmRlc3QsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBkYXRhLmRlc3QsXHJcblx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdHNyYzogaXNfYXNpZGUgPyBcImFfc2lkZV9ob3AxenVvMVwiIDogXCJpYV9zaWRlX2hvcDF6dW8xXCJcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcIm5vcm1hbF9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLnR1cm4rKztcclxuXHRcdGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY0RzdFwiKSB7XHJcblx0XHRcdGlmIChpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChib2R5X2VsZW1lbnQuY2l1cmxfYW5kX2NhcHR1cmUuY2l1cmxfZXZlbnQpKSB7XHJcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XHJcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XHJcblx0XHRcdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBmYWlsZWQgYXR0ZW1wdFxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY1N0ZXBEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3RlcCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3RlcCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZWApO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRhbV9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3JjKTtcclxuXHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3QsIHBpZWNlKTtcclxuXHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog55qH44GM6KGM44GT44GG44Go44GX44Gm44GE44KLJHtib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdFsxXX0ke2JvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0WzBdfeOBq+OBryR7bWF5YmVfY2FwdHVyZWRfcGllY2UuY29sb3J9JHttYXliZV9jYXB0dXJlZF9waWVjZS5wcm9mfeOBjOaXouOBq+OBguOCiuOBvuOBmWApXHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LnNyYyxcclxuXHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnN0ZXBTdHlsZSA9PT0gXCJOb1N0ZXBcIiA/IG51bGwgOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3RlcCxcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZmlyc3REZXN0XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50O1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC50eXBlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3X3N0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQ6IFJlYWRvbmx5PFBhcnNlZD4pOiBTdGF0ZVtdIHtcclxuXHRpZiAoIXBhcnNlZC5zdGFydGluZ19wbGF5ZXJzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvZG86IGN1cnJlbnQgaW1wbGVtZW50YXRpb24gcmVxdWlyZXMg5LiA5L2N6ImyLiBcclxuXHRcdFRvIHJlc29sdmUgdGhpcywgSSB3b3VsZCBuZWVkIHRvIHVuY29tbWVudCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiXHJcblx0XHRpbiBTdGF0ZS53aG9zZV90dXJuIOOBl+OBpuOAgeeah+S7peWkluOBrumnkuOCkuWLleOBi+OBl+OBn+OCieOBneOCjOOCkuWFg+OBq+mAhuOBq+i+v+OBo+OBpuino+a2iOOBmeOCi+OAgeOBv+OBn+OBhOOBquOBruOCkuWFpeOCjOOCi+W/heimgeOBjOOBguOCi+OAgmApO1xyXG5cdH1cclxuXHRsZXQgY3VycmVudF9zdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSh7XHJcblx0XHRpYV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuW8tVwiLCBwbGF5ZXJfbmFtZTogXCLlvLXkuIlcIiB9LFxyXG5cdFx0YV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuadjlwiLCBwbGF5ZXJfbmFtZTogXCLmnY7lm5tcIiB9XHJcblx0fSk7XHJcblx0Y29uc3QgYW5zOiBTdGF0ZVtdID0gW2N1cnJlbnRfc3RhdGVdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IG5leHRfc3RhdGUgPSAoKCkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0sIHBhcnNlZC5zdGFydGluZ19wbGF5ZXJzLnNwbGl0KFwiXCIpIGFzIEhhbnppQ29sb3JbXSlcclxuXHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XHJcblx0XHRcdFx0YWxlcnQoYCR7aX3jgrnjg4bjg4Pjg5fnm67jgafjga4ke2V9YCk7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfc3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0pKCk7XHJcblx0XHRpZiAoIW5leHRfc3RhdGUpIGJyZWFrO1xyXG5cdFx0YW5zLnB1c2gobmV4dF9zdGF0ZSk7XHJcblx0XHRjdXJyZW50X3N0YXRlID0gbmV4dF9zdGF0ZTtcclxuXHR9XHJcblx0cmV0dXJuIGFucztcclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQsIENvbG9yLCBQcm9mZXNzaW9uLCBTZWFzb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBIYW5kIH0gZnJvbSBcImNlcmtlX2hhbmRzX2FuZF9zY29yZVwiXHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7XHJcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEw6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHROOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFo6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRYOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE06IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRQOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tSGFuemlTZWFzb24oczogSGFuemlTZWFzb24pOiBTZWFzb24ge1xyXG5cdGlmIChzID09PSBcIuaYpVwiKSByZXR1cm4gMDtcclxuXHRlbHNlIGlmIChzID09PSBcIuWkj1wiKSByZXR1cm4gMTtcclxuXHRlbHNlIGlmIChzID09PSBcIueni1wiKSByZXR1cm4gMjtcclxuXHRlbHNlIGlmIChzID09PSBcIuWGrFwiKSByZXR1cm4gMztcclxuXHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogVW5leHBlY3RlZCBzZWFzb24gJHtzfWApXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xyXG5leHBvcnQgdHlwZSBIYW56aUNvbG9yID0gXCLotaRcIiB8IFwi6buSXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hhbnppQ29sb3IoYzogQ29sb3IpOiBIYW56aUNvbG9yIHtcclxuXHRpZiAoYyA9PT0gQ29sb3IuS29rMSkgcmV0dXJuIFwi6LWkXCI7XHJcblx0cmV0dXJuIFwi6buSXCI7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGFuemlQcm9mZXNzaW9uKHA6IFByb2Zlc3Npb24pOiBIYW56aVByb2Zlc3Npb24ge1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkRhdTIpIHJldHVybiBcIuiZjlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkd1YTIpIHJldHVybiBcIuW8k1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLklvKSByZXR1cm4gXCLnjotcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LYXVrMikgcmV0dXJuIFwi5YW1XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS2F1bjEpIHJldHVybiBcIui7ilwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkt1YTIpIHJldHVybiBcIuethlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLk1hdW4xKSByZXR1cm4gXCLppqxcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5OdWFrMSkgcmV0dXJuIFwi6Ii5XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVHVrMikgcmV0dXJuIFwi5berXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVWFpMSkgcmV0dXJuIFwi5bCGXCI7XHJcblx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IFVuZXhwZWN0ZWQgcHJvZmVzc2lvbiAke3B9YClcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgT3ZlcmxheWVkTWVzc2FnZSA9IHsgdHlwZTogXCJiZWZvcmVfdHltb2tcIiwgaGFuZHM6IEhhbmRbXSB9XHJcblx0fCB7IHR5cGU6IFwiYmVmb3JlX3RheG90XCIsIGhhbmRzOiBIYW5kW10sIHNjb3JlOiBudW1iZXIgfVxyXG5cdHwgeyB0eXBlOiBcImdvX2FnYWluXCIgfVxyXG5cdHwgeyB0eXBlOiBcImVuZF9zZWFzb25cIiwgc2NvcmU6IG51bWJlciB9XHJcblx0fCB7IHR5cGU6IFwiZ2FtZV9zZXRcIiB9XHJcblx0fCB7IHR5cGU6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiBIYW56aVNlYXNvbiB9O1xyXG5leHBvcnQgdHlwZSBTdGF0ZSA9IHtcclxuXHRzZWFzb246IEhhbnppU2Vhc29uLFxyXG5cdGdhbWVfaGFzX2VuZGVkOiBib29sZWFuLCAvLyB3aGVuIGB0cnVlYCwgYHNlYXNvbmAgYWJvdmUgc2hvdWxkIGJlIGlnbm9yZWQgYW5kIGluc3RlYWQgc2hvdWxkIGRpc3BsYXkgYOaYn+S4gOWRqGBcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0d2hvc2VfdHVybjogXCJpYV9zaWRlXCIgfCBcImFfc2lkZVwiIC8qfCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiKi8gfCBudWxsLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IHtcclxuXHRcdHN0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdFx0c3JjOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgXCJhX3NpZGVfaG9wMXp1bzFcIixcclxuXHRcdC8vIHwgICAgICAgICAgICAgICAgICAgICAgICB8IFRhbTIgICAgICAgfCB3aGVuIGNpdXJsIGZhaWxzIHwgd2hlbiBvayB8XHJcblx0XHQvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tfFxyXG5cdFx0Ly8gfCBpbml0aWFsbHlfcGxhbm5lZF9kZXN0IHwgZmlyc3REZXN0ICB8IGRlc3QgICAgICAgICAgICAgfCBkZXN0ICAgIHxcclxuXHRcdC8vIHwgYWN0dWFsX2ZpbmFsX2Rlc3QgICAgICB8IHNlY29uZERlc3QgfCBzcmMgICAgICAgICAgICAgIHwgZGVzdCAgICB8XHJcblx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbFxyXG5cdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdH0sXHJcblx0Ym9hcmQ6IEJvYXJkLFxyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogZmFsc2UgfVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogdHJ1ZSB9W10sXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXHJcblx0fSxcclxuXHRvdmVybGF5ZWRfbWVzc2FnZTogT3ZlcmxheWVkTWVzc2FnZSB8IG51bGwsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5vblRhbVBpZWNlID0geyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgcGFyc2VDZXJrZU9ubGluZUtpYTFBazEsIFBhcnNlZCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSwgaGlnaGxpZ2h0TnRoS2lhMUFrMSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW0gPSBsb2NhdGlvbi5ocmVmLm1hdGNoKC9cXD9oaXN0b3J5PSguKikvKTtcclxuICAgIGlmICghcGFyYW0pIHtcclxuICAgICAgICBhbGVydChcIuaji+itnOOBjOOBguOCiuOBvuOBm+OCk+OAgmluZGV4Lmh0bWwg44Gr5oi744Gj44Gm5YaN5YWl5Yqb44GX44Gm44GP44Gg44GV44GE44CCXCIpO1xyXG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBraWFyX2FyayA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSkucmVwbGFjZSgvXFx0L2csIFwiICAgIFwiKTtcclxuICAgICAgICBjb25zdCBwYXJzZWQ6IFBhcnNlZCA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKGtpYXJfYXJrKTtcclxuICAgICAgICBjb25zdCBzdGF0ZXM6IFN0YXRlW10gPSBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2lhX2FrXCIpIS50ZXh0Q29udGVudCA9IGtpYXJfYXJrO1xyXG5cclxuICAgICAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgICAgIGNvbnN0IHR1cm5fc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3NsaWRlclwiKSEgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICB0dXJuX3NsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgICBjb25zdCBtYXggPSBzdGF0ZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB0dXJuX3NsaWRlci5tYXggPSBgJHttYXh9YDtcclxuICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IFwiMFwiO1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzWzBdKTtcclxuICAgICAgICB0dXJuX3NsaWRlci5vbmlucHV0ID0gdHVybl9zbGlkZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7XHJcbiAgICAgICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYnV0dG9uX25leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9uZXh0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b25fbmV4dC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IGAke051bWJlcih0dXJuX3NsaWRlci52YWx1ZSkgKyAxfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBidXR0b25fcHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9wcmV2aW91c1wiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uX3ByZXZpb3VzLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSAtIDF9YDtcclxuICAgICAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKTsgLy8gYXV0b21hdGljYWxseSBjcm9wcyB0aGUgdmFsdWUgYXBwcm9wcmlhdGVseVxyXG4gICAgICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbl9maXJzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2ZpcnN0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b25fZmlyc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gMDtcclxuICAgICAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBidXR0b25fbGFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2xhc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGJ1dHRvbl9sYXN0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IG1heDtcclxuICAgICAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
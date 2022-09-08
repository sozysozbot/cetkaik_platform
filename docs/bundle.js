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
        return { type: "tymok", hands };
    }
    const munch2 = (0, munch_monad_1.liftM2)((_, num) => num, (0, munch_monad_1.string)("而手"), munchers_1.munchPekzepNumeral)(rest);
    if (!munch2) {
        throw new Error(`Unparsable BodyElement encountered: \`${s}\``);
    }
    const { ans: score, rest: rest2 } = munch2;
    if (rest2 !== "") {
        throw new Error(`Cannot handle trailing \`${rest}\` found within  \`${s}\``);
    }
    return { type: "taxot", hands, score };
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
// Very primitive parser that never handles all the edge cases
function parseCerkeOnlineKia1Ak1(s) {
    const lines = s.trim().split("\n").map(l => l.trim());
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
    const bodies = lines.slice(3).flatMap(line => line.split(/[\s\n]/g)).filter(a => a !== "");
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
exports.drawGameState = exports.drawFocusSrc = exports.FocusSteppedHTML = exports.FocusPlannedDestHTML = exports.drawEmptyBoard = exports.cell_size = exports.top_margin = exports.left_margin = exports.height = void 0;
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
    document.getElementById("season_text").innerHTML = STATE.season;
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
        FocusPlannedDestHTML(STATE.focus.planned_dest) +
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_dest);
}
exports.drawGameState = drawGameState;
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
        turn: 0,
        rate: 1,
        whose_turn: null,
        focus: {
            actual_dest: null,
            stepped: null,
            src: null,
            planned_dest: null
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
    var new_state = JSON.parse(JSON.stringify(old_state));
    if (old_state.whose_turn === null) {
        new_state.whose_turn = starting_players[(0, types_1.fromHanziSeason)(old_state.season)] === "赤" ? "a_side" : "ia_side";
    }
    // clear the flags
    new_state.ia_side.is_newly_acquired = false;
    new_state.a_side.is_newly_acquired = false;
    new_state.focus = {
        src: null,
        actual_dest: null,
        stepped: null,
        planned_dest: null
    };
    if (body_element.type === "season_ends") {
        if (old_state.season === "冬") {
            return null;
        }
        new_state.season =
            old_state.season === "春" ? "夏" :
                old_state.season === "夏" ? "秋" :
                    old_state.season === "秋" ? "冬" :
                        (function () { throw new Error(); })();
        new_state.turn = 0;
        new_state.board = getInitialBoard();
        return new_state;
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
            actual_dest: data.dest,
            planned_dest: data.dest,
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
                    actual_dest: body_element.movement.data.dest,
                    stepped: null,
                    planned_dest: body_element.movement.data.dest
                };
            }
            else {
                // failed attempt
                new_state.focus = {
                    src: body_element.movement.data.src,
                    actual_dest: body_element.movement.data.src,
                    stepped: null,
                    planned_dest: body_element.movement.data.dest
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
                    actual_dest: body_element.movement.data.dest,
                    stepped: body_element.movement.data.step,
                    planned_dest: body_element.movement.data.dest,
                    src: body_element.movement.data.src
                };
            }
            else {
                // failed attempt
                new_state.focus = {
                    actual_dest: body_element.movement.data.src,
                    stepped: body_element.movement.data.step,
                    planned_dest: body_element.movement.data.dest, src: body_element.movement.data.src
                };
            }
        }
        else {
            var _ = body_element.movement.data;
            throw new Error("Should not reach here: invalid value in body_element.movement.data.type");
        }
    }
    else if (body_element.type === "end_season") {
    }
    else if (body_element.type === "game_set") {
    }
    else if (body_element.type === "taxot") {
    }
    else if (body_element.type === "tymok") {
    }
    else if (body_element.type === "tam_move") {
        if (old_state.whose_turn === "ia_side") {
            new_state.whose_turn = "a_side";
        }
        else if (old_state.whose_turn === "a_side") {
            new_state.whose_turn = "ia_side";
        }
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
                console.log("".concat(i, "\u30B9\u30C6\u30C3\u30D7\u76EE\u3067\u306E").concat(e));
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
    var case3 = "{\u4E00\u4F4D\u8272:\u8D64\u8D64\u8D64}\n{\u59CB\u6642:2022-04-01T17:00:24.278Z}\n{\u7D42\u6642:2022-04-01T17:59:40.857Z}\nLE\u5F13LILU\u6A4B\u4E8C    XAU\u864EZAITY\u7121\u6483\u88C1\nLU\u5F13LAILAU\u6A4B\u4E00\u624B\u9ED2\u5F13    KAU\u5DEBLAU\u7121\u6483\u88C1\u624B\u8D64\u5F13\nNI\u5175NE\u7121\u6483\u88C1    \u8D64\u5F13NO\nNA\u8ECANI\u7121\u6483\u88C1    KIA\u7B46KAIKY\u6A4B\u4E00\nNE\u5175NINO\u6C34\u4E8C\u6B64\u7121    KY\u7B46KIKE\u6A4B\u4E8C\u624B\u8D64\u5DEB\nKA\u7B46KE\u7121\u6483\u88C1\u624B\u8D64\u7B46    ZO\u7687[TU]ZU\nXE\u864ECIXU\u6A4B\u56DB    NAI\u5175NAU\u7121\u6483\u88C1\nNE\u5175NINO\u6C34\u4E09\u624B\u8D64\u5F13    TY\u864EXU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nTE\u864EZIXU\u6A4B\u56DB\u624B\u8D64\u864E    LAU\u5DEBNAUNAI\u7121\u6483\u88C1\nXU\u864ENAI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB    TAU\u864ENAI\u7121\u6483\u88C1\u624B\u8D64\u864E\nXI\u5175XU\u7121\u6483\u88C1    NAI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175\nZA\u738BXACE\u7121\u6483\u88C1    \u8D64\u5DEBNAI\n\u9ED2\u5F13ZO    ZAI\u8239ZO\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nME\u5F13CEXE\u6A4B\u4E09    ZO\u8239NO\u7121\u6483\u88C1\u624B\u9ED2\u5175\nCE\u738BMIPU\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nNI\u8ECAKA\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nXE\u5F13XUZO\u6A4B\u4E00\u6C34\u4E09    NAI\u5DEBXUCU\u6A4B\u4E8C\nZO\u5F13CAIZIA\u6A4B\u4E09\u624B\u9ED2\u738B\n\n\u6216\u70BA\u5730\u5FC3\u52A0\u738B\u52A0\u7363\u800C\u624B\u5341\u4E94\n\n\u7D42\u5B63    \u6625\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    MAU\u5F13MAIMY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    MY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nMI\u5175MU\u7121\u6483\u88C1\u624B\u8D64\u5F13    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    ZO\u7687[ZY]ZAIZAU\nZI\u8239ZAI\u7121\u6483\u88C1\u624B\u9ED2\u8239    TIA\u5C06TAUZAI\u6C34\u7121\u6B64\u7121\nTE\u864ENITU\u6A4B\u7121\u6B64\u7121    TAU\u864ENAICI\u6A4B\u56DB\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u9ED2\u864E    XIA\u5C06XAUZAI\u6C34\u4E09\u624B\u8D64\u8239\nMA\u99ACXIMO\u7121\u6483\u88C1    XAI\u5175CAI\u7121\u6483\u88C1\nTE\u864ENITU\u6A4B\u4E09    \u9ED2\u5DEBTY\nXI\u5175XU\u7121\u6483\u88C1    TY\u5DEBCIZA\u6A4B\u4E8C\u624B\u8D64\u738B\n\n\u6216\u70BA\u738B\u800C\u624B\u4E94\n\u7D42\u5B63    \u590F\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    XAU\u864ECAIXY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    XY\u864EMUCI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u8D64\u864E    \u9ED2\u5DEBCAI\nMU\u5F13MAICAI\u6A4B\u56DB\u624B\u9ED2\u5DEB    CIA\u8ECACAI\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nXE\u864ECIXU\u6A4B\u4E09    \u9ED2\u5F13CY\nXI\u5175XUCU\u7121\u6483\u88C1    XAI\u5175XY\u7121\u6483\u88C1\nZO\u7687[ZU]ZIZE    ZAI\u8239ZI\u7121\u6483\u88C1\u624B\u8D64\u8239\nTE\u864EZI\u6C34\u4E09\u624B\u9ED2\u8239    XY\u5175XU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nZI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175    TAU\u864ENAITY\u6A4B\u4E8C\nXU\u864ETY\u7121\u6483\u88C1\u624B\u9ED2\u864E    TAI\u5175TY\u7121\u6483\u88C1\u624B\u8D64\u864E\n\u9ED2\u8239ZI    ZE\u7687[XI]ZU\n\u9ED2\u5DEBZO    CAI\u8ECAZO\u6C34\u4E09\u624B\u9ED2\u5DEB\nZU\u7687[XU]ZIZE    ZO\u8ECACIPA\u7121\u6483\u88C1\u624B\u8D64\u7B46\nZI\u8239ZIA\u7121\u6483\u88C1\u624B\u9ED2\u738B\n\n\u6216\u70BA\u738B\u52A0\u540C\u8272\u7363\u800C\u624B\u5341\n\u7D42\u5B63    \u79CB\u7D42\n\n\n\u661F\u4E00\u5468";
    var parsed = (0, cerke_online_kiaak_parser_1.parseCerkeOnlineKia1Ak1)(case3);
    var states = (0, state_1.getAllStatesFromParsed)(parsed);
    (0, draw_1.drawEmptyBoard)();
    var turn_slider = document.getElementById("turn_slider");
    turn_slider.min = "0";
    var max = states.length - 1;
    turn_slider.max = "".concat(max);
    turn_slider.value = "0";
    (0, draw_1.drawGameState)(states[0]);
    turn_slider.oninput = turn_slider.onchange = function () {
        (0, draw_1.drawGameState)(states[Number(turn_slider.value)]);
    };
    var button_next = document.getElementById("button_next");
    button_next.onclick = function () {
        turn_slider.value = "".concat(Number(turn_slider.value) + 1);
        var new_value = Number(turn_slider.value); // automatically crops the value appropriately
        (0, draw_1.drawGameState)(states[new_value]);
    };
    var button_previous = document.getElementById("button_previous");
    button_previous.onclick = function () {
        turn_slider.value = "".concat(Number(turn_slider.value) - 1);
        var new_value = Number(turn_slider.value); // automatically crops the value appropriately
        (0, draw_1.drawGameState)(states[new_value]);
    };
    var button_first = document.getElementById("button_first");
    button_first.onclick = function () {
        var new_value = 0;
        turn_slider.value = "".concat(new_value);
        (0, draw_1.drawGameState)(states[new_value]);
    };
    var button_last = document.getElementById("button_last");
    button_last.onclick = function () {
        var new_value = max;
        turn_slider.value = "".concat(new_value);
        (0, draw_1.drawGameState)(states[new_value]);
    };
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENB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LFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsR0FBRztZQUNOLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVB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Iiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi9vdGhlcl90eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdGFjdGljcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdHlwZV9fbWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2hhbmRsZV9ib2R5X2VsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoX21vbmFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9yZWFkX3Bla3plcF9udW1lcmFscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlX19tZXNzYWdlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RhY3RpY3NcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3RoZXJfdHlwZXNcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKlxyXG4gKiBUaGVvcmV0aWNhbGx5IHNwZWFraW5nLCBpdCBpcyBuZWNlc3NhcnkgdG8gZGlzdGluZ3Vpc2ggeDMyIGFuZCB4NjRcclxuICogYmVjYXVzZSBpdCBpcyBwb3NzaWJsZSB0byBzY29yZSAxIHBvaW50ICgzKzMtNSkuXHJcbiAqIE5vdCB0aGF0IGl0IHdpbGwgZXZlciBiZSBvZiB1c2UgaW4gYW55IHJlYWwgc2l0dWF0aW9uLlxyXG4gKi8gXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUHJvZmVzc2lvbiA9IGV4cG9ydHMuQ29sb3IgPSB2b2lkIDA7XHJcbnZhciBDb2xvcjtcclxuKGZ1bmN0aW9uIChDb2xvcikge1xyXG4gICAgQ29sb3JbQ29sb3JbXCJLb2sxXCJdID0gMF0gPSBcIktvazFcIjtcclxuICAgIENvbG9yW0NvbG9yW1wiSHVvazJcIl0gPSAxXSA9IFwiSHVvazJcIjtcclxufSkoQ29sb3IgPSBleHBvcnRzLkNvbG9yIHx8IChleHBvcnRzLkNvbG9yID0ge30pKTtcclxudmFyIFByb2Zlc3Npb247XHJcbihmdW5jdGlvbiAoUHJvZmVzc2lvbikge1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiTnVhazFcIl0gPSAwXSA9IFwiTnVhazFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdWsyXCJdID0gMV0gPSBcIkthdWsyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJHdWEyXCJdID0gMl0gPSBcIkd1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdW4xXCJdID0gM10gPSBcIkthdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJEYXUyXCJdID0gNF0gPSBcIkRhdTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIk1hdW4xXCJdID0gNV0gPSBcIk1hdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLdWEyXCJdID0gNl0gPSBcIkt1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIlR1azJcIl0gPSA3XSA9IFwiVHVrMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiVWFpMVwiXSA9IDhdID0gXCJVYWkxXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJJb1wiXSA9IDldID0gXCJJb1wiO1xyXG59KShQcm9mZXNzaW9uID0gZXhwb3J0cy5Qcm9mZXNzaW9uIHx8IChleHBvcnRzLlByb2Zlc3Npb24gPSB7fSkpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IGV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gZXhwb3J0cy5oYW5kbGVZYWt1ID0gZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaGVyc18xID0gcmVxdWlyZShcIi4vbXVuY2hlcnNcIik7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuZnVuY3Rpb24gaGFuZGxlVGFtTW92ZShzKSB7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAocmVzdC5jaGFyQXQoMCkgIT09IFwi55qHXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRhbTIgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgZm9ybWF0IGlzIGVpdGhlcjpcclxuICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICBjb25zdCB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGZpcnN0RGVzdCwgbmV4dCkgPT4gKHsgZmlyc3REZXN0LCBuZXh0IH0pLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAodHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQpIHtcclxuICAgICAgICAvLyBlaXRoZXI6XHJcbiAgICAgICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGZpcnN0RGVzdCwgbmV4dCB9LCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQ7XHJcbiAgICAgICAgaWYgKHJlc3QyID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiTm9TdGVwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLCBmaXJzdERlc3QsIHNlY29uZERlc3Q6IG5leHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyeV9tdW5jaF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgICAgICAgICAgaWYgKCF0cnlfbXVuY2hfY29vcmQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiBzZWNvbmREZXN0LCByZXN0OiBlbXB0eSB9ID0gdHJ5X211bmNoX2Nvb3JkO1xyXG4gICAgICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke2VtcHR5fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7IHR5cGU6IFwiVGFtTW92ZVwiLCBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdMYXR0ZXJcIiwgc3JjLCBmaXJzdERlc3QsIHN0ZXA6IG5leHQsIHNlY29uZERlc3QgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0KSA9PiAoeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSksIG11bmNoZXJzXzEubXVuY2hDb29yZCwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSwgcmVzdDogZW1wdHkgfSA9IG11bmNoO1xyXG4gICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nRm9ybWVyXCIsXHJcbiAgICAgICAgICAgICAgICBzcmMsIHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRhbU1vdmUgPSBoYW5kbGVUYW1Nb3ZlO1xyXG5mdW5jdGlvbiBoYW5kbGVZYWt1KHMpIHtcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo1xyXG4gICAgLy8g5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbiAgICBjb25zdCBoYW5kc1NlcEJ5QXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5zZXBCeTEpKHsgcDogbXVuY2hlcnNfMS5tdW5jaEhhbmQsIHNlcDogKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuWKoFwiKSB9KTtcclxuICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgaGFuZHMpID0+IGhhbmRzLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5oiW54K6XCIpLCBoYW5kc1NlcEJ5QXQpKHMpO1xyXG4gICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGhhbmRzLCByZXN0IH0gPSBtdW5jaDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0eW1va1wiLCBoYW5kcyB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgbXVuY2gyID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgbnVtKSA9PiBudW0sICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLogIzmiYtcIiksIG11bmNoZXJzXzEubXVuY2hQZWt6ZXBOdW1lcmFsKShyZXN0KTtcclxuICAgIGlmICghbXVuY2gyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2NvcmUsIHJlc3Q6IHJlc3QyIH0gPSBtdW5jaDI7XHJcbiAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IHR5cGU6IFwidGF4b3RcIiwgaGFuZHMsIHNjb3JlIH07XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVZYWt1ID0gaGFuZGxlWWFrdTtcclxuY29uc3QgbXVuY2hXYXRlckV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmsLRcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi54Sh5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiA5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqM5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiJXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5ZubXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqUXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IG11bmNoV2F0ZXJFdmVudDtcclxuY29uc3QgbXVuY2hDaXVybEV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLnhKHmkoPoo4FcIikpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJub19jaXVybF9ldmVudFwiIH0sIHJlc3Q6IHMuc2xpY2UoMykgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJoYXNfd2F0ZXJfZW50cnlcIiwgd2F0ZXJfZW50cnlfY2l1cmw6IGFucyB9LCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi5qmLXCIpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHMuc2xpY2UoMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcHBpbmdfY2l1cmwgPSB0WzBdID09PSBcIueEoVwiID8gMCA6XHJcbiAgICAgICAgICAgIHRbMF0gPT09IFwi5LiAXCIgPyAxIDpcclxuICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqMXCIgPyAyIDpcclxuICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS4iVwiID8gMyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5ZubXCIgPyA0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqUXCIgPyA1IDogKCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBjaGFyYWN0ZXIgZm91bmQgYWZ0ZXIg5qmLXCIpOyB9KSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3QgPSB0LnNsaWNlKDEpO1xyXG4gICAgICAgIC8vIEVpdGhlciBub3RoaW5nLCDmraTnhKEsIG9yIG11bmNoV2F0ZXJFdmVudFxyXG4gICAgICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocmVzdCk7XHJcbiAgICAgICAgaWYgKHRyeV9tdW5jaF93YXRlcikge1xyXG4gICAgICAgICAgICBjb25zdCB7IGFuczogd2F0ZXJfZW50cnlfY2l1cmwsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfd2F0ZXI7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCBzdGVwcGluZ19jaXVybCwgd2F0ZXJfZW50cnlfY2l1cmwgfSwgcmVzdDogcmVzdDIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzdC5zdGFydHNXaXRoKFwi5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiBmYWxzZSB9LCByZXN0OiBcIlwiIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJvbmx5X3N0ZXBwaW5nXCIsIHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogdHJ1ZSB9LCByZXN0IH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gbXVuY2hDaXVybEV2ZW50O1xyXG5mdW5jdGlvbiBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocykge1xyXG4gICAgY29uc3QgdHJ5X2NpdXJsX2V2ZW50ID0gKDAsIGV4cG9ydHMubXVuY2hDaXVybEV2ZW50KShzKTtcclxuICAgIGlmICghdHJ5X2NpdXJsX2V2ZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIGNpdXJsIGV2ZW50OiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogY2l1cmxfZXZlbnQsIHJlc3QgfSA9IHRyeV9jaXVybF9ldmVudDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQpKHJlc3QpO1xyXG4gICAgaWYgKG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUpIHtcclxuICAgICAgICBjb25zdCB7IGFuczogcGllY2VfY2FwdHVyZSwgcmVzdDogcmVzdDIgfSA9IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmU7XHJcbiAgICAgICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJhaWxpbmcgcGFyYW1ldGVyIFxcYCR7c31cXGAgaGFzIHNvbWUgZXh0cmEgXFxgJHtyZXN0Mn1cXGAgYXQgdGhlIGVuZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCwgcGllY2VfY2FwdHVyZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIHRyYWlsaW5nIHBhcmFtZXRlcjogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzO1xyXG5mdW5jdGlvbiBoYW5kbGVCb2R5RWxlbWVudChzKSB7XHJcbiAgICBpZiAocyA9PT0gXCLmmKXntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5aSP57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDEgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIueni+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAyIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlhqzntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi57WC5a2jXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJlbmRfc2Vhc29uXCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuaYn+S4gOWRqFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZ2FtZV9zZXRcIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLngrpcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlWWFrdShzKTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi55qHXCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVRhbU1vdmUocyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfZnJvbV9ob3B6dW8gPSAoMCwgbXVuY2hlcnNfMS5tdW5jaEZyb21Ib3BadW8pKHMpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF9mcm9tX2hvcHp1bykge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGNvbG9yLCBwcm9mLCBkZXN0IH0sIHJlc3QgfSA9IHRyeV9tdW5jaF9mcm9tX2hvcHp1bztcclxuICAgICAgICBpZiAocmVzdCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZnJvbV9ob3B6dW9cIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJGcm9tSG9wMVp1bzFcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBwcm9mLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAoIVtcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIuiIuVwiLCBcIueJh1wiXS5pbmNsdWRlcyhyZXN0LmNoYXJBdCgwKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIGEgcHJvZmVzc2lvbiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF8ybmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICghdHJ5X211bmNoXzJuZF9jb29yZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGhlIHNlY29uZCBjb29yZGluYXRlIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNlY29uZF9jb29yZCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF8ybmRfY29vcmQ7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfM3JkX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfM3JkX2Nvb3JkKSB7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHNlY29uZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGFuczogdGhpcmRfY29vcmQsIHJlc3Q6IHJlc3QzIH0gPSB0cnlfbXVuY2hfM3JkX2Nvb3JkO1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QzKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY1N0ZXBEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogc2Vjb25kX2Nvb3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHRoaXJkX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gaGFuZGxlQm9keUVsZW1lbnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSB2b2lkIDA7XHJcbmNvbnN0IGhhbmRsZV9ib2R5X2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZV9ib2R5X2VsZW1lbnRcIik7XHJcbi8vIFZlcnkgcHJpbWl0aXZlIHBhcnNlciB0aGF0IG5ldmVyIGhhbmRsZXMgYWxsIHRoZSBlZGdlIGNhc2VzXHJcbmZ1bmN0aW9uIHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKHMpIHtcclxuICAgIGNvbnN0IGxpbmVzID0gcy50cmltKCkuc3BsaXQoXCJcXG5cIikubWFwKGwgPT4gbC50cmltKCkpO1xyXG4gICAgY29uc3QgaW5pdGlhbF9saW5lID0gbGluZXNbMF07XHJcbiAgICBpZiAoaW5pdGlhbF9saW5lID09PSB1bmRlZmluZWQgLyogU2luY2Ugd2UgdXNlZCAuc3BsaXQoKSwgdGhpcyBhY3R1YWxseSBjYW4ndCBoYXBwZW4gKi8gfHwgaW5pdGlhbF9saW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM44GC44KK44G+44Gb44KTXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoL15cXHvlp4vmmYI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+Wni+aZgjog44Gn5aeL44G+44Gj44Gm44GE44G+44GZ44CC44GT44KM44GvMjAyMeW5tDEx5pyI5pyr44Ki44OD44OX44OH44O844OI5Lul5YmN44Gu5qOL6K2c44Gn44GC44KK44CB44G+44Gg5a++5b+c44Gn44GN44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIS9eXFx75LiA5L2N6ImyOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvkuIDkvY3oibI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0aW5nX3BsYXllcnMgPSBpbml0aWFsX2xpbmUubWF0Y2goL15cXHvkuIDkvY3oibI6KFvpu5LotaRdKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nX3RpbWUgPSBsaW5lc1sxXT8ubWF0Y2goL15cXHvlp4vmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgZW5kaW5nX3RpbWUgPSBsaW5lc1syXT8ubWF0Y2goL15cXHvntYLmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgYm9kaWVzID0gbGluZXMuc2xpY2UoMykuZmxhdE1hcChsaW5lID0+IGxpbmUuc3BsaXQoL1tcXHNcXG5dL2cpKS5maWx0ZXIoYSA9PiBhICE9PSBcIlwiKTtcclxuICAgIGNvbnN0IHBhcnNlZF9ib2RpZXMgPSBib2RpZXMubWFwKGhhbmRsZV9ib2R5X2VsZW1lbnRfMS5oYW5kbGVCb2R5RWxlbWVudCk7XHJcbiAgICByZXR1cm4geyBzdGFydGluZ19wbGF5ZXJzLCBzdGFydGluZ190aW1lLCBlbmRpbmdfdGltZSwgcGFyc2VkX2JvZGllcyB9O1xyXG59XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSBwYXJzZUNlcmtlT25saW5lS2lhMUFrMTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXBCeTEgPSBleHBvcnRzLm1hbnkxID0gZXhwb3J0cy5tYW55ID0gZXhwb3J0cy5saWZ0TTMgPSBleHBvcnRzLnN0cmluZyA9IGV4cG9ydHMubGlmdE0yID0gZXhwb3J0cy5wdXJlID0gZXhwb3J0cy5iaW5kID0gdm9pZCAwO1xyXG4vLyBtb25hZFxyXG5jb25zdCBiaW5kID0gKG1hLCBjYWxsYmFjaykgPT4gKChpbnB1dCkgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soYSkocmVzdCk7XHJcbn0pO1xyXG5leHBvcnRzLmJpbmQgPSBiaW5kO1xyXG5jb25zdCBwdXJlID0gKGEpID0+IChpbnB1dCkgPT4gKHsgYW5zOiBhLCByZXN0OiBpbnB1dCB9KTtcclxuZXhwb3J0cy5wdXJlID0gcHVyZTtcclxuY29uc3QgbGlmdE0yID0gKGYsIG1hLCBtYikgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiKSkpKTtcclxuZXhwb3J0cy5saWZ0TTIgPSBsaWZ0TTI7XHJcbmNvbnN0IHN0cmluZyA9IChwcmVmaXgpID0+IChpbnB1dCkgPT4gaW5wdXQuc3RhcnRzV2l0aChwcmVmaXgpID8geyBhbnM6IHVuZGVmaW5lZCwgcmVzdDogaW5wdXQuc2xpY2UocHJlZml4Lmxlbmd0aCkgfSA6IG51bGw7XHJcbmV4cG9ydHMuc3RyaW5nID0gc3RyaW5nO1xyXG5jb25zdCBsaWZ0TTMgPSAoZiwgbWEsIG1iLCBtYykgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMuYmluZCkobWMsIGMgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiLCBjKSkpKSk7XHJcbmV4cG9ydHMubGlmdE0zID0gbGlmdE0zO1xyXG5jb25zdCBtYW55ID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGxldCByZXN0ID0gaW5wdXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueSA9IG1hbnk7XHJcbmNvbnN0IG1hbnkxID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBsZXQgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICBjb25zdCBhbnMgPSBbYV07XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueTEgPSBtYW55MTtcclxuY29uc3Qgc2VwQnkxID0gKHsgcDogbWEsIHNlcCB9KSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKSgoMCwgZXhwb3J0cy5tYW55KSgoMCwgZXhwb3J0cy5iaW5kKShzZXAsIChfKSA9PiBtYSkpLCBhcyA9PiAoMCwgZXhwb3J0cy5wdXJlKShbYSwgLi4uYXNdKSkpO1xyXG5leHBvcnRzLnNlcEJ5MSA9IHNlcEJ5MTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBleHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSBleHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9IGV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gZXhwb3J0cy5tdW5jaENvb3JkID0gZXhwb3J0cy5tdW5jaEhhbmQgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuY29uc3QgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMSA9IHJlcXVpcmUoXCIuL3JlYWRfcGVremVwX251bWVyYWxzXCIpO1xyXG5jb25zdCBtdW5jaENvbG9yID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLotaRcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQcm9mZXNzaW9uID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLoiLlcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWFtVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5byTXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDIsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLou4pcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiZjlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6aasXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDUsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnrYZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW3q1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA3LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5bCGXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDgsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoQ29sdW1uID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGNvbHMgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgaWYgKHMuY2hhckF0KDApID09PSBjb2wpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBjb2wsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hSb3cgPSAocykgPT4ge1xyXG4gICAgY29uc3Qgcm93cyA9IFtcIkFJXCIsIFwiQVVcIiwgXCJJQVwiIC8qIGhhbmRsZSB0aGUgbG9uZ2VyIG9uZXMgZmlyc3QgKi8sIFwiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgocm93KSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHJvdywgcmVzdDogcy5zbGljZShyb3cubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaEhhbmQgPSAocykgPT4ge1xyXG4gICAgY29uc3QgaGFuZHMgPSBbXCLnjotcIiwgXCLnjaNcIiwgXCLlkIzoibLnjaNcIiwgXCLlnLDlv4NcIiwgXCLlkIzoibLlnLDlv4NcIiwgXCLppqzlvJPlhbVcIiwgXCLlkIzoibLppqzlvJPlhbVcIixcclxuICAgICAgICBcIuWKqeWPi1wiLCBcIuWQjOiJsuWKqeWPi1wiLCBcIuaIpumbhlwiLCBcIuWQjOiJsuaIpumbhlwiLCBcIuihjOihjFwiLCBcIuWQjOiJsuihjOihjFwiLCBcIuethuWFteeEoeWCvlwiLCBcIuWQjOiJsuethuWFteeEoeWCvlwiLFxyXG4gICAgICAgIFwi6ZeH5oim5LmL6ZuGXCIsIFwi5ZCM6Imy6ZeH5oim5LmL6ZuGXCIsIFwi54Sh5oqX6KGM5YemXCIsIFwi5ZCM6Imy54Sh5oqX6KGM5YemXCJdO1xyXG4gICAgZm9yIChjb25zdCBoYW5kIG9mIGhhbmRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChoYW5kKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGhhbmQsIHJlc3Q6IHMuc2xpY2UoaGFuZC5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hIYW5kID0gbXVuY2hIYW5kO1xyXG5leHBvcnRzLm11bmNoQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChjb2wsIHJvdykgPT4ge1xyXG4gICAgY29uc3QgY29vcmQgPSBbcm93LCBjb2xdO1xyXG4gICAgcmV0dXJuIGNvb3JkO1xyXG59LCBtdW5jaENvbHVtbiwgbXVuY2hSb3cpO1xyXG5leHBvcnRzLm11bmNoRnJvbUhvcFp1byA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKGNvbG9yLCBwcm9mLCBkZXN0KSA9PiAoeyBjb2xvciwgcHJvZiwgZGVzdCB9KSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uLCBleHBvcnRzLm11bmNoQ29vcmQpO1xyXG5leHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8sIGNvbG9yLCBwcm9mKSA9PiAoeyBjb2xvciwgcHJvZiB9KSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuaJi1wiKSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uKTtcclxuZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXzEsIGNvb3JkLCBfMikgPT4gY29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJbXCIpLCBleHBvcnRzLm11bmNoQ29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJdXCIpKTtcclxuY29uc3QgbXVuY2hEaWdpdExpbnprbGFyID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGRzID0gW1wi54ShXCIsIFwi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCIsIFwi5Y2BXCIsIFwi5LiLXCIsIFwi55m+XCJdO1xyXG4gICAgZm9yIChjb25zdCBkIG9mIGRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQZWt6ZXBOdW1lcmFsID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHQxID0gKDAsIG11bmNoX21vbmFkXzEubWFueTEpKG11bmNoRGlnaXRMaW56a2xhcikocyk7XHJcbiAgICBpZiAoIXQxKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHQxO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBudW0gPSAoMCwgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMS5mcm9tRGlnaXRzTGluemtsYXIpKGFucyk7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiBudW0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gbXVuY2hQZWt6ZXBOdW1lcmFsO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyKGkpIHtcclxuICAgIGlmIChpWzBdID09PSBcIueEoVwiICYmIGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLkuItcIikge1xyXG4gICAgICAgIHJldHVybiAtZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi55m+XCIpIHtcclxuICAgICAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDEwMCArIGZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGluZGV4MTAwID0gaS5pbmRleE9mKFwi55m+XCIpO1xyXG4gICAgaWYgKGluZGV4MTAwICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGh1bmRyZWRzID0gaS5zbGljZSgwLCBpbmRleDEwMCk7XHJcbiAgICAgICAgY29uc3Qgb25lcyA9IGkuc2xpY2UoaW5kZXgxMDAgKyAxKTtcclxuICAgICAgICByZXR1cm4gMTAwICogZnJvbURpZ2l0c0xpbnprbGFyU3ViKGh1bmRyZWRzKSArIGZyb21EaWdpdHNMaW56a2xhclN1YihvbmVzKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKiBwYXJzZVVuaXQoaVswXSkgKyBwYXJzZVVuaXQoaVsyXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pO1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgXCIke2l9XCIgYXMgYSBwZWt6ZXAgbnVtZXJhbGApO1xyXG59XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gZnJvbURpZ2l0c0xpbnprbGFyO1xyXG5mdW5jdGlvbiBwYXJzZVVuaXQob25lcykge1xyXG4gICAgaWYgKG9uZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiAXCIpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6jFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDI7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIlcIikge1xyXG4gICAgICAgIHJldHVybiAzO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5ZubXCIpIHtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6lFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlha1cIikge1xyXG4gICAgICAgIHJldHVybiA2O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiDXCIpIHtcclxuICAgICAgICByZXR1cm4gNztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDg7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuZ1cIikge1xyXG4gICAgICAgIHJldHVybiA5O1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciBcIiR7b25lc31cIiB3aGlsZSB0cnlpbmcgdG8gcGFyc2UgcGVremVwIG51bWVyYWxzYCk7XHJcbn1cclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyU3ViKGkpIHtcclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaVtpLmxlbmd0aCAtIDFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKSAqIDEwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYSA9IGlbMF07XHJcbiAgICAgICAgY29uc3QgYiA9IGlbMV07XHJcbiAgICAgICAgaWYgKGIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpICogMTAgKyBwYXJzZVVuaXQoYik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93LCBBYnNvbHV0ZUNvb3JkIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuaW1wb3J0IHsgTm9uVGFtUGllY2UsIFN0YXRlLCBIYW56aVByb2Zlc3Npb25BbmRUYW0sIHByb2ZzLCBCb2FyZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaGVpZ2h0ID0gMzg3O1xyXG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IHRvcF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IGNlbGxfc2l6ZSA9IDQzO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdFbXB0eUJvYXJkKCkge1xyXG4gICAgY29uc3QgY3R4ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3ZcIikhIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG5cclxuICAgIC8vIOeah+WHplxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDI3LCA1NC41JSwgODEuMSUpXCJcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG5cclxuICAgIC8vIOeah+awtFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDIxMywgMzMuNiUsIDc4LjklKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIC8vIOeah+WxsVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDEyOSwgMzguNSUsIDQ1LjQlKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYig5OSwgOTksIDk5KSc7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMC4wMyAqIGhlaWdodCAvIDk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyAwLCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBoZWlnaHQsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMCk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsMCwwKVwiO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiLCBcIkFJXCIsIFwiQVVcIiwgXCJJQVwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIGxlZnRfbWFyZ2luICsgaGVpZ2h0ICsgMTAsIHRvcF9tYXJnaW4gKyAzMCArIGNlbGxfc2l6ZSAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGksIHRvcF9tYXJnaW4gLSAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICBjdHgucm90YXRlKE1hdGguUEkpO1xyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIC1sZWZ0X21hcmdpbiArIDEwLCAtKHRvcF9tYXJnaW4gKyAxNSArIGNlbGxfc2l6ZSAqIGkpKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgLShsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSksIC0odG9wX21hcmdpbiArIGhlaWdodCArIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0X3RvcF9sZWZ0KGNvb3JkOiBBYnNvbHV0ZUNvb3JkKSB7XHJcbiAgICBjb25zdCBjb2x1bW4gPSB7XHJcbiAgICAgICAgSzogMCxcclxuICAgICAgICBMOiAxLFxyXG4gICAgICAgIE46IDIsXHJcbiAgICAgICAgVDogMyxcclxuICAgICAgICBaOiA0LFxyXG4gICAgICAgIFg6IDUsXHJcbiAgICAgICAgQzogNixcclxuICAgICAgICBNOiA3LFxyXG4gICAgICAgIFA6IDhcclxuICAgIH1bY29vcmRbMV1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W2Nvb3JkWzBdXTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIGNlbGxfc2l6ZSAqIChjb2x1bW4gLSAwLjUpO1xyXG4gICAgY29uc3QgdG9wID0gdG9wX21hcmdpbiArIGNlbGxfc2l6ZSAqIChyb3cgLSAwLjUpO1xyXG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzUGxhbm5lZERlc3RIVE1MKGZvY3VzX3BsYW5uZWRfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19wbGFubmVkX2Rlc3QpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19wbGFubmVkX2Rlc3QpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTc4LCAyNTUsIDI1NSlcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb2N1c1N0ZXBwZWRIVE1MKGZvY3VzX3N0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfc3RlcHBlZCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3N0ZXBwZWQpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAwLCAwLjMpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ZvY3VzU3JjKGZvY3VzX3NyYzogQWJzb2x1dGVDb29yZCB8IFwiYV9zaWRlX2hvcDF6dW8xXCIgfCBcImlhX3NpZGVfaG9wMXp1bzFcIiB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zcmMgfHwgZm9jdXNfc3JjID09PSBcImFfc2lkZV9ob3AxenVvMVwiIHx8IGZvY3VzX3NyYyA9PT0gXCJpYV9zaWRlX2hvcDF6dW8xXCIpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zcmMpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFBpZWNlc09uQm9hcmRIVE1MKGJvYXJkOiBCb2FyZCwgZm9jdXM6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChjb25zdCBjbG0gaW4gYm9hcmQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNfZm9jdXNlZCA9IGZvY3VzID8gZm9jdXNbMV0gPT09IGNsbSAmJiBmb2N1c1swXSA9PT0gcncgOiBmYWxzZTtcclxuICAgICAgICAgICAgYW5zICs9IFBvc2l0aW9uZWRQaWVjZU9uQm9hcmRIVE1MKFxyXG4gICAgICAgICAgICAgICAgY2xtIGFzIEFic29sdXRlQ29sdW1uLFxyXG4gICAgICAgICAgICAgICAgcncgYXMgQWJzb2x1dGVSb3csXHJcbiAgICAgICAgICAgICAgICBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dIVtydyBhcyBBYnNvbHV0ZVJvd10hLFxyXG4gICAgICAgICAgICAgICAgaXNfZm9jdXNlZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gSG9wMVp1bzFIVE1MKHBpZWNlczogTm9uVGFtUGllY2VbXSwgaXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XHJcbiAgICAgICAgY29uc3QgcmFkID0gMTggLyAwLjI2O1xyXG4gICAgICAgIGFucyArPSBgPGxpPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMjNweDsgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7Y2VsbF9zaXplfXB4OyBcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7IFxyXG4gICAgICAgICAgICBcIj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJHtpc19uZXdseV9hY3F1aXJlZCAmJiBpID09IHBpZWNlcy5sZW5ndGggLSAxID8gYDxkaXYgc3R5bGU9XCJcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogJHs0MiAtIHJhZH1weDtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHtyYWQgKiAyfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJHtyYWQgKiAyfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI1JTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDYwLCA1MCwgMC4zKTtcclxuICAgICAgICAgICAgICAgIFwiPjwvZGl2PmAgOiBcIlwifVxyXG4gICAgICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoY29sb3IsIHByb2YsIGZhbHNlKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9saT5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdHYW1lU3RhdGUoU1RBVEU6IFN0YXRlKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXNvbl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5zZWFzb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUudHVybiArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhdGVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUucmF0ZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuaWFfc2lkZS5ob3AxenVvMSwgU1RBVEUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpZWNlc19pbm5lclwiKSEuaW5uZXJIVE1MID0gRm9jdXNTdGVwcGVkSFRNTChTVEFURS5mb2N1cy5zdGVwcGVkKSArXHJcbiAgICAgICAgZHJhd0ZvY3VzU3JjKFNUQVRFLmZvY3VzLnNyYykgK1xyXG4gICAgICAgIEZvY3VzUGxhbm5lZERlc3RIVE1MKFNUQVRFLmZvY3VzLnBsYW5uZWRfZGVzdCkgK1xyXG4gICAgICAgIFBpZWNlc09uQm9hcmRIVE1MKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cy5hY3R1YWxfZGVzdCk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBOb3JtYWxQaWVjZUhUTUwoY29sb3I6IFwi6buSXCIgfCBcIui1pFwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb25BbmRUYW0sIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHggPSBwcm9mcy5pbmRleE9mKHByb2YpICogLTEwMCAtIDI3O1xyXG4gICAgY29uc3QgeSA9IGlzX2JvbGQgPyAwIDogLTI3NztcclxuICAgIGNvbnN0IGNvbG9yX3BhdGggPSB7XHJcbiAgICAgICAgXCLpu5JcIjogXCLjgrTjgrfjg4Pjgq/pp5JcIixcclxuICAgICAgICBcIui1pFwiOiBcIuOCtOOCt+ODg+OCr+mnkl/otaRcIixcclxuICAgIH1bY29sb3JdO1xyXG4gICAgcmV0dXJuIGA8ZGl2XHJcbiAgICBzdHlsZT1cIndpZHRoOiA4N3B4OyBoZWlnaHQ6IDg3cHg7IGJhY2tncm91bmQtcG9zaXRpb24teDogJHt4fXB4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXk6ICR7eX1weDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7Y29sb3JfcGF0aH0uc3ZnKTsgXCI+XHJcbjwvZGl2PmBcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFBvc2l0aW9uZWRQaWVjZU9uQm9hcmRIVE1MKGNsbTogQWJzb2x1dGVDb2x1bW4sIHJ3OiBBYnNvbHV0ZVJvdywgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIiwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IGdldF90b3BfbGVmdChbcncsIGNsbV0pO1xyXG4gICAgaWYgKHBpZWNlID09PSBcIueah1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtcInJvdGF0ZSg5MGRlZylcIn1cIj5cclxuICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQsIFBhcnNlZCwgQ2l1cmxFdmVudCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyXCI7XHJcbmltcG9ydCB7IEJvYXJkLCBmcm9tSGFuemlTZWFzb24sIEhhbnppQ29sb3IsIEhhbnppUHJvZmVzc2lvbiwgTm9uVGFtUGllY2UsIFN0YXRlLCB0b0hhbnppQ29sb3IsIHRvSGFuemlQcm9mZXNzaW9uIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuaW1wb3J0IHsgQWJzb2x1dGVDb29yZCwgQ29sb3IsIFByb2Zlc3Npb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbEJvYXJkKCk6IEJvYXJkIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Szoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEw6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHROOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFQ6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRaOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdE86IFwi55qHXCIsXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFg6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRDOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE06IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRQOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUobzoge1xyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nXHJcblx0fSxcclxuXHRhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdH0sXHJcbn0pOiBTdGF0ZSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlYXNvbjogXCLmmKVcIixcclxuXHRcdHR1cm46IDAsXHJcblx0XHRyYXRlOiAxLFxyXG5cdFx0d2hvc2VfdHVybjogbnVsbCxcclxuXHRcdGZvY3VzOiB7XHJcblx0XHRcdGFjdHVhbF9kZXN0OiBudWxsLFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IG51bGwsXHJcblx0XHRcdHBsYW5uZWRfZGVzdDogbnVsbFxyXG5cdFx0fSxcclxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XHJcblx0Y29uc3QgcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdGlmICghcGllY2UpIHsgdGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTsgfVxyXG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdHJldHVybiBwaWVjZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X3RvKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQsIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIpOiBOb25UYW1QaWVjZSB8IHVuZGVmaW5lZCB7XHJcblx0aWYgKHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0pIHtcclxuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRcdGlmIChjYXB0dXJlZF9waWVjZSA9PT0gXCLnmodcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+eah+OBjOaXouOBq+OBguOCiuOBvuOBmWApO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIGNhcHR1cmVkX3BpZWNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XHJcblx0aWYgKHBpZWNlLmlzX2FzaWRlKSB7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiBmYWxzZSB9KTtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IHRydWUgfSk7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb21faG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBvOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH0pIHtcclxuXHRjb25zdCBpbmRleCA9IHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLmZpbmRJbmRleChrID0+IGsuY29sb3IgPT09IG8uY29sb3IgJiYgay5wcm9mID09PSBvLnByb2YpO1xyXG5cdGlmIChpbmRleCA9PT0gLTEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDmjIHjgaHpp5Ljgaske28uY29sb3J9JHtvLnByb2Z944GM44GC44KK44G+44Gb44KTYCk7XHJcblx0fVxyXG5cdHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLnNwbGljZShpbmRleCwgMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGNpdXJsX2V2ZW50OiBDaXVybEV2ZW50KTogYm9vbGVhbiB7XHJcblx0aWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwibm9fY2l1cmxfZXZlbnRcIikge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcIm9ubHlfc3RlcHBpbmdcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LmluZmFmdGVyc3RlcF9zdWNjZXNzO1xyXG5cdH0gZWxzZSBpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJoYXNfd2F0ZXJfZW50cnlcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LndhdGVyX2VudHJ5X2NpdXJsID49IDM7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gY2l1cmxfZXZlbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gY2l1cmxfZXZlbnQudHlwZVwiKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRTdGF0ZShvbGRfc3RhdGU6IFJlYWRvbmx5PFN0YXRlPiwgYm9keV9lbGVtZW50OiBCb2R5RWxlbWVudCwgc3RhcnRpbmdfcGxheWVyczogSGFuemlDb2xvcltdKTogU3RhdGUgfCBudWxsIHtcclxuXHRjb25zdCBuZXdfc3RhdGU6IFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvbGRfc3RhdGUpKTtcclxuXHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IG51bGwpIHtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gc3RhcnRpbmdfcGxheWVyc1tmcm9tSGFuemlTZWFzb24ob2xkX3N0YXRlLnNlYXNvbildID09PSBcIui1pFwiID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIGNsZWFyIHRoZSBmbGFnc1xyXG5cdG5ld19zdGF0ZS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdHNyYzogbnVsbCxcclxuXHRcdGFjdHVhbF9kZXN0OiBudWxsLFxyXG5cdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdHBsYW5uZWRfZGVzdDogbnVsbFxyXG5cdH07XHJcblxyXG5cdGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5zZWFzb24gPVxyXG5cdFx0XHRvbGRfc3RhdGUuc2Vhc29uID09PSBcIuaYpVwiID8gXCLlpI9cIiA6XHJcblx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlpI9cIiA/IFwi56eLXCIgOlxyXG5cdFx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLnp4tcIiA/IFwi5YasXCIgOlxyXG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLnR1cm4gPSAwO1xyXG5cdFx0bmV3X3N0YXRlLmJvYXJkID0gZ2V0SW5pdGlhbEJvYXJkKCk7XHJcblx0XHRyZXR1cm4gbmV3X3N0YXRlO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZnJvbV9ob3B6dW9cIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUudHVybisrO1xyXG5cdFx0Y29uc3QgZGF0YToge1xyXG5cdFx0XHR0eXBlOiBcIkZyb21Ib3AxWnVvMVwiO1xyXG5cdFx0XHRjb2xvcjogQ29sb3I7XHJcblx0XHRcdHByb2Y6IFByb2Zlc3Npb247XHJcblx0XHRcdGRlc3Q6IEFic29sdXRlQ29vcmQ7XHJcblx0XHR9ID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRjb25zdCBjb2xvciA9IHRvSGFuemlDb2xvcihkYXRhLmNvbG9yKTtcclxuXHRcdGNvbnN0IHByb2YgPSB0b0hhbnppUHJvZmVzc2lvbihkYXRhLnByb2YpO1xyXG5cdFx0Y29uc3QgaXNfYXNpZGUgPSBuZXdfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIjtcclxuXHRcdHJlbW92ZV9mcm9tX2hvcDF6dW8xKG5ld19zdGF0ZSwgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSk7XHJcblx0XHRzZXRfdG8obmV3X3N0YXRlLCBkYXRhLmRlc3QsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRhY3R1YWxfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRwbGFubmVkX2Rlc3Q6IGRhdGEuZGVzdCxcclxuXHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0c3JjOiBpc19hc2lkZSA/IFwiYV9zaWRlX2hvcDF6dW8xXCIgOiBcImlhX3NpZGVfaG9wMXp1bzFcIlxyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwibm9ybWFsX21vdmVcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUudHVybisrO1xyXG5cdFx0aWYgKGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGUgPT09IFwiU3JjRHN0XCIpIHtcclxuXHRcdFx0aWYgKGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZS5jaXVybF9ldmVudCkpIHtcclxuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcclxuXHRcdFx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHBpZWNlKTtcclxuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0XHRcdHBsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0cGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY1N0ZXBEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdGFjdHVhbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3RlcCxcclxuXHRcdFx0XHRcdHBsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBmYWlsZWQgYXR0ZW1wdFxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdGFjdHVhbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zdGVwLFxyXG5cdFx0XHRcdFx0cGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGVgKTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImVuZF9zZWFzb25cIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0YXhvdFwiKSB7XHJcblxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwidHltb2tcIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRhbV9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gYm9keV9lbGVtZW50LnR5cGVcIik7XHJcblx0fVxyXG5cdHJldHVybiBuZXdfc3RhdGU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZDogUmVhZG9ubHk8UGFyc2VkPik6IFN0YXRlW10ge1xyXG5cdGlmICghcGFyc2VkLnN0YXJ0aW5nX3BsYXllcnMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihgdG9kbzogY3VycmVudCBpbXBsZW1lbnRhdGlvbiByZXF1aXJlcyDkuIDkvY3oibIuIFxyXG5cdFx0VG8gcmVzb2x2ZSB0aGlzLCBJIHdvdWxkIG5lZWQgdG8gdW5jb21tZW50IFwiYW1iaWd1b3VzX2FscGhhXCIgfCBcImFtYmlndW91c19iZXRhXCJcclxuXHRcdGluIFN0YXRlLndob3NlX3R1cm4g44GX44Gm44CB55qH5Lul5aSW44Gu6aeS44KS5YuV44GL44GX44Gf44KJ44Gd44KM44KS5YWD44Gr6YCG44Gr6L6/44Gj44Gm6Kej5raI44GZ44KL44CB44G/44Gf44GE44Gq44Gu44KS5YWl44KM44KL5b+F6KaB44GM44GC44KL44CCYCk7XHJcblx0fVxyXG5cdGxldCBjdXJyZW50X3N0YXRlID0gZ2V0SW5pdGlhbFN0YXRlKHtcclxuXHRcdGlhX3NpZGU6IHsgcGxheWVyX25hbWVfc2hvcnQ6IFwi5by1XCIsIHBsYXllcl9uYW1lOiBcIuW8teS4iVwiIH0sXHJcblx0XHRhX3NpZGU6IHsgcGxheWVyX25hbWVfc2hvcnQ6IFwi5p2OXCIsIHBsYXllcl9uYW1lOiBcIuadjuWbm1wiIH1cclxuXHR9KTtcclxuXHRjb25zdCBhbnM6IFN0YXRlW10gPSBbY3VycmVudF9zdGF0ZV07XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQucGFyc2VkX2JvZGllcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgbmV4dF9zdGF0ZSA9ICgoKSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5leHRTdGF0ZShjdXJyZW50X3N0YXRlLCBwYXJzZWQucGFyc2VkX2JvZGllc1tpXSwgcGFyc2VkLnN0YXJ0aW5nX3BsYXllcnMuc3BsaXQoXCJcIikgYXMgSGFuemlDb2xvcltdKVxyXG5cdFx0XHR9IGNhdGNoIChlOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtpfeOCueODhuODg+ODl+ebruOBp+OBriR7ZX1gKTtcclxuXHRcdFx0XHRyZXR1cm4gY3VycmVudF9zdGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkoKTtcclxuXHRcdGlmICghbmV4dF9zdGF0ZSkgYnJlYWs7XHJcblx0XHRhbnMucHVzaChuZXh0X3N0YXRlKTtcclxuXHRcdGN1cnJlbnRfc3RhdGUgPSBuZXh0X3N0YXRlO1xyXG5cdH1cclxuXHRyZXR1cm4gYW5zO1xyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCwgQ29sb3IsIFByb2Zlc3Npb24sIFNlYXNvbiB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7XHJcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEw6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHROOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFo6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRYOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE06IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRQOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tSGFuemlTZWFzb24oczogSGFuemlTZWFzb24pOiBTZWFzb24ge1xyXG5cdGlmIChzID09PSBcIuaYpVwiKSByZXR1cm4gMDsgXHJcblx0ZWxzZSBpZiAocyA9PT0gXCLlpI9cIikgcmV0dXJuIDE7XHJcblx0ZWxzZSBpZiAocyA9PT0gXCLnp4tcIikgcmV0dXJuIDI7XHJcblx0ZWxzZSBpZiAocyA9PT0gXCLlhqxcIikgcmV0dXJuIDM7XHJcblx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IFVuZXhwZWN0ZWQgc2Vhc29uICR7c31gKVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBSYXRlID0gMSB8IDIgfCA0IHwgOCB8IDE2IHwgMzIgfCA2NDtcclxuZXhwb3J0IHR5cGUgSGFuemlDb2xvciA9IFwi6LWkXCIgfCBcIum7klwiO1xyXG5leHBvcnQgZnVuY3Rpb24gdG9IYW56aUNvbG9yKGM6IENvbG9yKTogSGFuemlDb2xvciB7XHJcblx0aWYgKGMgPT09IENvbG9yLktvazEpIHJldHVybiBcIui1pFwiO1xyXG5cdHJldHVybiBcIum7klwiO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hhbnppUHJvZmVzc2lvbihwOiBQcm9mZXNzaW9uKTogSGFuemlQcm9mZXNzaW9uIHtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5EYXUyKSByZXR1cm4gXCLomY5cIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5HdWEyKSByZXR1cm4gXCLlvJNcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5JbykgcmV0dXJuIFwi546LXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS2F1azIpIHJldHVybiBcIuWFtVwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkthdW4xKSByZXR1cm4gXCLou4pcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LdWEyKSByZXR1cm4gXCLnrYZcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5NYXVuMSkgcmV0dXJuIFwi6aasXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uTnVhazEpIHJldHVybiBcIuiIuVwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLlR1azIpIHJldHVybiBcIuW3q1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLlVhaTEpIHJldHVybiBcIuWwhlwiO1xyXG5cdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBVbmV4cGVjdGVkIHByb2Zlc3Npb24gJHtwfWApXHJcbn1cclxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XHJcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0d2hvc2VfdHVybjogXCJpYV9zaWRlXCIgfCBcImFfc2lkZVwiIC8qfCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiKi8gfCBudWxsLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IHtcclxuXHRcdGFjdHVhbF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCxcclxuXHRcdHN0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdFx0c3JjOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgXCJhX3NpZGVfaG9wMXp1bzFcIixcclxuXHRcdHBsYW5uZWRfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGxcclxuXHR9LFxyXG5cdGJvYXJkOiBCb2FyZCxcclxuXHRpYV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0aG9wMXp1bzE6IHsgY29sb3I6IEhhbnppQ29sb3IsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IGZhbHNlIH1bXSxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXHJcblx0fSxcclxuXHRhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0aG9wMXp1bzE6IHsgY29sb3I6IEhhbnppQ29sb3IsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IHRydWUgfVtdLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHRcdGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuLFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBwYXJzZUNlcmtlT25saW5lS2lhMUFrMSwgUGFyc2VkIH0gZnJvbSAnY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlcic7XHJcbmltcG9ydCB7IGRyYXdFbXB0eUJvYXJkLCBkcmF3R2FtZVN0YXRlIH0gZnJvbSAnLi9kcmF3JztcclxuaW1wb3J0IHsgZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZCB9IGZyb20gJy4vc3RhdGUnO1xyXG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXNlMyA9XHJcblx0YHvkuIDkvY3oibI66LWk6LWk6LWkfVxyXG575aeL5pmCOjIwMjItMDQtMDFUMTc6MDA6MjQuMjc4Wn1cclxue+e1guaZgjoyMDIyLTA0LTAxVDE3OjU5OjQwLjg1N1p9XHJcbkxF5byTTElMVeapi+S6jCAgICBYQVXomY5aQUlUWeeEoeaSg+ijgVxyXG5MVeW8k0xBSUxBVeapi+S4gOaJi+m7kuW8kyAgICBLQVXlt6tMQVXnhKHmkoPoo4HmiYvotaTlvJNcclxuTknlhbVOReeEoeaSg+ijgSAgICDotaTlvJNOT1xyXG5OQei7ik5J54Sh5pKD6KOBICAgIEtJQeethktBSUtZ5qmL5LiAXHJcbk5F5YW1TklOT+awtOS6jOatpOeEoSAgICBLWeethktJS0XmqYvkuozmiYvotaTlt6tcclxuS0HnrYZLReeEoeaSg+ijgeaJi+i1pOethiAgICBaT+eah1tUVV1aVVxyXG5YReiZjkNJWFXmqYvlm5sgICAgTkFJ5YW1TkFV54Sh5pKD6KOBXHJcbk5F5YW1TklOT+awtOS4ieaJi+i1pOW8kyAgICBUWeiZjlhV54Sh5pKD6KOB5omL6buS6JmOXHJcblRF6JmOWklYVeapi+Wbm+aJi+i1pOiZjiAgICBMQVXlt6tOQVVOQUnnhKHmkoPoo4FcclxuWFXomY5OQUnnhKHmkoPoo4HmiYvpu5Llt6sgICAgVEFV6JmOTkFJ54Sh5pKD6KOB5omL6LWk6JmOXHJcblhJ5YW1WFXnhKHmkoPoo4EgICAgTkFJ6JmOWFXnhKHmkoPoo4HmiYvotaTlhbVcclxuWkHnjotYQUNF54Sh5pKD6KOBICAgIOi1pOW3q05BSVxyXG7pu5LlvJNaTyAgICBaQUnoiLlaT+eEoeaSg+ijgeaJi+m7kuW8k1xyXG5NReW8k0NFWEXmqYvkuIkgICAgWk/oiLlOT+eEoeaSg+ijgeaJi+m7kuWFtVxyXG5DReeOi01JUFXnhKHmkoPoo4EgICAgTkFJ5berWFVQVeapi+S6jOatpOeEoVxyXG5OSei7iktB54Sh5pKD6KOBICAgIE5BSeW3q1hVUFXmqYvkuozmraTnhKFcclxuWEXlvJNYVVpP5qmL5LiA5rC05LiJICAgIE5BSeW3q1hVQ1XmqYvkuoxcclxuWk/lvJNDQUlaSUHmqYvkuInmiYvpu5LnjotcclxuXHJcbuaIlueCuuWcsOW/g+WKoOeOi+WKoOeNo+iAjOaJi+WNgeS6lFxyXG5cclxu57WC5a2jICAgIOaYpee1glxyXG5cclxuTUXlvJNNSU1V5qmL5LiJICAgIE1BVeW8k01BSU1Z5qmL5LqMXHJcbkNJ5YW1Q0XnhKHmkoPoo4EgICAgTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG5NSeWFtU1V54Sh5pKD6KOB5omL6LWk5byTICAgIENBSeWFtUNBVeeEoeaSg+ijgVxyXG5QReW3q0NFQ0nnhKHmkoPoo4EgICAgWk/nmodbWlldWkFJWkFVXHJcblpJ6Ii5WkFJ54Sh5pKD6KOB5omL6buS6Ii5ICAgIFRJQeWwhlRBVVpBSeawtOeEoeatpOeEoVxyXG5UReiZjk5JVFXmqYvnhKHmraTnhKEgICAgVEFV6JmOTkFJQ0nmqYvlm5vmiYvpu5Llt6tcclxuQ0XlhbVDSeeEoeaSg+ijgeaJi+m7kuiZjiAgICBYSUHlsIZYQVVaQUnmsLTkuInmiYvotaToiLlcclxuTUHppqxYSU1P54Sh5pKD6KOBICAgIFhBSeWFtUNBSeeEoeaSg+ijgVxyXG5UReiZjk5JVFXmqYvkuIkgICAg6buS5berVFlcclxuWEnlhbVYVeeEoeaSg+ijgSAgICBUWeW3q0NJWkHmqYvkuozmiYvotaTnjotcclxuXHJcbuaIlueCuueOi+iAjOaJi+S6lFxyXG7ntYLlraMgICAg5aSP57WCXHJcblxyXG5NReW8k01JTVXmqYvkuIkgICAgWEFV6JmOQ0FJWFnmqYvkuoxcclxuQ0nlhbVDReeEoeaSg+ijgSAgICBDQUnlhbVDQVXnhKHmkoPoo4FcclxuUEXlt6tDRUNJ54Sh5pKD6KOBICAgIFhZ6JmOTVVDSeeEoeaSg+ijgeaJi+m7kuW3q1xyXG5DReWFtUNJ54Sh5pKD6KOB5omL6LWk6JmOICAgIOm7kuW3q0NBSVxyXG5NVeW8k01BSUNBSeapi+Wbm+aJi+m7kuW3qyAgICBDSUHou4pDQUnnhKHmkoPoo4HmiYvpu5LlvJNcclxuWEXomY5DSVhV5qmL5LiJICAgIOm7kuW8k0NZXHJcblhJ5YW1WFVDVeeEoeaSg+ijgSAgICBYQUnlhbVYWeeEoeaSg+ijgVxyXG5aT+eah1taVV1aSVpFICAgIFpBSeiIuVpJ54Sh5pKD6KOB5omL6LWk6Ii5XHJcblRF6JmOWknmsLTkuInmiYvpu5LoiLkgICAgWFnlhbVYVeeEoeaSg+ijgeaJi+m7kuiZjlxyXG5aSeiZjlhV54Sh5pKD6KOB5omL6LWk5YW1ICAgIFRBVeiZjk5BSVRZ5qmL5LqMXHJcblhV6JmOVFnnhKHmkoPoo4HmiYvpu5LomY4gICAgVEFJ5YW1VFnnhKHmkoPoo4HmiYvotaTomY5cclxu6buS6Ii5WkkgICAgWkXnmodbWEldWlVcclxu6buS5berWk8gICAgQ0FJ6LuKWk/msLTkuInmiYvpu5Llt6tcclxuWlXnmodbWFVdWklaRSAgICBaT+i7ikNJUEHnhKHmkoPoo4HmiYvotaTnrYZcclxuWknoiLlaSUHnhKHmkoPoo4HmiYvpu5LnjotcclxuXHJcbuaIlueCuueOi+WKoOWQjOiJsueNo+iAjOaJi+WNgVxyXG7ntYLlraMgICAg56eL57WCXHJcblxyXG5cclxu5pif5LiA5ZGoYDtcclxuXHJcbiAgICBjb25zdCBwYXJzZWQ6IFBhcnNlZCA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKGNhc2UzKTtcclxuICAgIGNvbnN0IHN0YXRlczogU3RhdGVbXSA9IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkKTtcclxuXHJcbiAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgY29uc3QgdHVybl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fc2xpZGVyXCIpISBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdHVybl9zbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICBjb25zdCBtYXggPSBzdGF0ZXMubGVuZ3RoIC0gMTtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke21heH1gO1xyXG4gICAgdHVybl9zbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzWzBdKTtcclxuICAgIHR1cm5fc2xpZGVyLm9uaW5wdXQgPSB0dXJuX3NsaWRlci5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX25leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9uZXh0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9uZXh0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpICsgMX1gO1xyXG4gICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fcHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9wcmV2aW91c1wiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fcHJldmlvdXMub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IGAke051bWJlcih0dXJuX3NsaWRlci52YWx1ZSkgLSAxfWA7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKTsgLy8gYXV0b21hdGljYWxseSBjcm9wcyB0aGUgdmFsdWUgYXBwcm9wcmlhdGVseVxyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1dHRvbl9maXJzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2ZpcnN0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9maXJzdC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IDA7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fbGFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2xhc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgYnV0dG9uX2xhc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBtYXg7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgIH1cclxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
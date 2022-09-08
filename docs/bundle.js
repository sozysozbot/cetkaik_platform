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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
        FocusPlannedDestHTML(STATE.focus.initially_planned_dest) +
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_final_dest) + Dat2ListHTML(STATE.dat2_list_on_display);
}
exports.drawGameState = drawGameState;
function Dat2ListHTML(a) {
    if (!a)
        return "";
    return "<div style=\"    position: absolute;\n    width: 469px;\n    height: 256px;\n    top: 107px;\n    left: 0px;\n    background-color: rgba(0,0,0,80%); color: white\">".concat(__spreadArray(__spreadArray([], a.hands, true), [a.type === "taxot" ? "終季" : "再行"], false).join("<br>"), "</div>");
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
    console.log(lines);
    // when n = 0, nothing should be highlighted
    for (var i = 3; i < lines.length; i++) {
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
        dat2_list_on_display: null,
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
        actual_final_dest: null,
        stepped: null,
        initially_planned_dest: null
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
    else if (body_element.type === "end_season") {
        new_state.dat2_list_on_display = null;
    }
    else if (body_element.type === "game_set") {
    }
    else if (body_element.type === "taxot") {
        new_state.dat2_list_on_display = { type: "taxot", hands: body_element.hands };
    }
    else if (body_element.type === "tymok") {
        new_state.dat2_list_on_display = { type: "tymok", hands: body_element.hands };
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
    var kiar_ark = "{\u4E00\u4F4D\u8272:\u8D64\u8D64\u8D64}\n{\u59CB\u6642:2022-04-01T17:00:24.278Z}\n{\u7D42\u6642:2022-04-01T17:59:40.857Z}\nLE\u5F13LILU\u6A4B\u4E8C    XAU\u864EZAITY\u7121\u6483\u88C1\nLU\u5F13LAILAU\u6A4B\u4E00\u624B\u9ED2\u5F13    KAU\u5DEBLAU\u7121\u6483\u88C1\u624B\u8D64\u5F13\nNI\u5175NE\u7121\u6483\u88C1    \u8D64\u5F13NO\nNA\u8ECANI\u7121\u6483\u88C1    KIA\u7B46KAIKY\u6A4B\u4E00\nNE\u5175NINO\u6C34\u4E8C\u6B64\u7121    KY\u7B46KIKE\u6A4B\u4E8C\u624B\u8D64\u5DEB\nKA\u7B46KE\u7121\u6483\u88C1\u624B\u8D64\u7B46    ZO\u7687[TU]ZU\nXE\u864ECIXU\u6A4B\u56DB    NAI\u5175NAU\u7121\u6483\u88C1\nNE\u5175NINO\u6C34\u4E09\u624B\u8D64\u5F13    TY\u864EXU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nTE\u864EZIXU\u6A4B\u56DB\u624B\u8D64\u864E    LAU\u5DEBNAUNAI\u7121\u6483\u88C1\nXU\u864ENAI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB    TAU\u864ENAI\u7121\u6483\u88C1\u624B\u8D64\u864E\nXI\u5175XU\u7121\u6483\u88C1    NAI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175\nZA\u738BXACE\u7121\u6483\u88C1    \u8D64\u5DEBNAI\n\u9ED2\u5F13ZO    ZAI\u8239ZO\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nME\u5F13CEXE\u6A4B\u4E09    ZO\u8239NO\u7121\u6483\u88C1\u624B\u9ED2\u5175\nCE\u738BMIPU\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nNI\u8ECAKA\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nXE\u5F13XUZO\u6A4B\u4E00\u6C34\u4E09    NAI\u5DEBXUCU\u6A4B\u4E8C\nZO\u5F13CAIZIA\u6A4B\u4E09\u624B\u9ED2\u738B\n\n\u6216\u70BA\u5730\u5FC3\u52A0\u738B\u52A0\u7363\u800C\u624B\u5341\u4E94\n\n\u7D42\u5B63    \u6625\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    MAU\u5F13MAIMY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    MY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nMI\u5175MU\u7121\u6483\u88C1\u624B\u8D64\u5F13    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    ZO\u7687[ZY]ZAIZAU\nZI\u8239ZAI\u7121\u6483\u88C1\u624B\u9ED2\u8239    TIA\u5C06TAUZAI\u6C34\u7121\u6B64\u7121\nTE\u864ENITU\u6A4B\u7121\u6B64\u7121    TAU\u864ENAICI\u6A4B\u56DB\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u9ED2\u864E    XIA\u5C06XAUZAI\u6C34\u4E09\u624B\u8D64\u8239\nMA\u99ACXIMO\u7121\u6483\u88C1    XAI\u5175CAI\u7121\u6483\u88C1\nTE\u864ENITU\u6A4B\u4E09    \u9ED2\u5DEBTY\nXI\u5175XU\u7121\u6483\u88C1    TY\u5DEBCIZA\u6A4B\u4E8C\u624B\u8D64\u738B\n\n\u6216\u70BA\u738B\u800C\u624B\u4E94\n\u7D42\u5B63    \u590F\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    XAU\u864ECAIXY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    XY\u864EMUCI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u8D64\u864E    \u9ED2\u5DEBCAI\nMU\u5F13MAICAI\u6A4B\u56DB\u624B\u9ED2\u5DEB    CIA\u8ECACAI\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nXE\u864ECIXU\u6A4B\u4E09    \u9ED2\u5F13CY\nXI\u5175XUCU\u7121\u6483\u88C1    XAI\u5175XY\u7121\u6483\u88C1\nZO\u7687[ZU]ZIZE    ZAI\u8239ZI\u7121\u6483\u88C1\u624B\u8D64\u8239\nTE\u864EZI\u6C34\u4E09\u624B\u9ED2\u8239    XY\u5175XU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nZI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175    TAU\u864ENAITY\u6A4B\u4E8C\nXU\u864ETY\u7121\u6483\u88C1\u624B\u9ED2\u864E    TAI\u5175TY\u7121\u6483\u88C1\u624B\u8D64\u864E\n\u9ED2\u8239ZI    ZE\u7687[XI]ZU\n\u9ED2\u5DEBZO    CAI\u8ECAZO\u6C34\u4E09\u624B\u9ED2\u5DEB\nZU\u7687[XU]ZIZE    ZO\u8ECACIPA\u7121\u6483\u88C1\u624B\u8D64\u7B46\nZI\u8239ZIA\u7121\u6483\u88C1\u624B\u9ED2\u738B\n\n\u6216\u70BA\u738B\u52A0\u540C\u8272\u7363\u800C\u624B\u5341\n\u7D42\u5B63    \u79CB\u7D42\n\n\n\u661F\u4E00\u5468";
    var parsed = (0, cerke_online_kiaak_parser_1.parseCerkeOnlineKia1Ak1)(kiar_ark);
    var states = (0, state_1.getAllStatesFromParsed)(parsed);
    document.getElementById("kia_ak").textContent = kiar_ark;
    (0, draw_1.drawEmptyBoard)();
    var turn_slider = document.getElementById("turn_slider");
    turn_slider.min = "0";
    var max = states.length - 1;
    turn_slider.max = "".concat(max);
    turn_slider.value = "0";
    (0, draw_1.drawGameState)(states[0]);
    turn_slider.oninput = turn_slider.onchange = function () {
        var new_value = Number(turn_slider.value);
        (0, draw_1.drawGameState)(states[new_value]);
        (0, draw_1.highlightNthKia1Ak1)(kiar_ark, new_value);
    };
    var button_next = document.getElementById("button_next");
    button_next.onclick = function () {
        turn_slider.value = "".concat(Number(turn_slider.value) + 1);
        var new_value = Number(turn_slider.value); // automatically crops the value appropriately
        (0, draw_1.drawGameState)(states[new_value]);
        (0, draw_1.highlightNthKia1Ak1)(kiar_ark, new_value);
    };
    var button_previous = document.getElementById("button_previous");
    button_previous.onclick = function () {
        turn_slider.value = "".concat(Number(turn_slider.value) - 1);
        var new_value = Number(turn_slider.value); // automatically crops the value appropriately
        (0, draw_1.drawGameState)(states[new_value]);
        (0, draw_1.highlightNthKia1Ak1)(kiar_ark, new_value);
    };
    var button_first = document.getElementById("button_first");
    button_first.onclick = function () {
        var new_value = 0;
        turn_slider.value = "".concat(new_value);
        (0, draw_1.drawGameState)(states[new_value]);
        (0, draw_1.highlightNthKia1Ak1)(kiar_ark, new_value);
    };
    var button_last = document.getElementById("button_last");
    button_last.onclick = function () {
        var new_value = max;
        turn_slider.value = "".concat(new_value);
        (0, draw_1.drawGameState)(states[new_value]);
        (0, draw_1.highlightNthKia1Ak1)(kiar_ark, new_value);
    };
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQSxtQ0FBbUMsb0NBQW9DLGdCQUFnQjtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZFQUFpQjtBQUN0QyxhQUFhLG1CQUFPLENBQUMsaUVBQVc7QUFDaEMsYUFBYSxtQkFBTyxDQUFDLHlFQUFlOzs7Ozs7Ozs7OztBQ2R2QjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ05hO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDOzs7Ozs7Ozs7OztBQ0RoRDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0IsR0FBRyxhQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0QkFBNEIsYUFBYSxLQUFLO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDLGtCQUFrQixLQUFLOzs7Ozs7Ozs7OztBQ3BCakQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsZ0NBQWdDLEdBQUcsdUJBQXVCLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcscUJBQXFCO0FBQzdKLG1CQUFtQixtQkFBTyxDQUFDLDZFQUFZO0FBQ3ZDLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxpQkFBaUI7QUFDN0I7QUFDQSwrREFBK0QsRUFBRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0ZBQStGLGlCQUFpQjtBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPLGlCQUFpQixnQkFBZ0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsRUFBRTtBQUMzRTtBQUNBLG9CQUFvQiwrQkFBK0I7QUFDbkQ7QUFDQSw0REFBNEQsTUFBTSxxQkFBcUIsRUFBRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRiw2QkFBNkI7QUFDakg7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8sNkJBQTZCLGdCQUFnQjtBQUNwRTtBQUNBLHdEQUF3RCxLQUFLLHFCQUFxQixFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscURBQXFELDhEQUE4RDtBQUNuSDtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLG1CQUFtQjtBQUMvQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsRUFBRTtBQUNuRTtBQUNBLFlBQVksMEJBQTBCO0FBQ3RDO0FBQ0Esb0RBQW9ELEtBQUsscUJBQXFCLEVBQUU7QUFDaEY7QUFDQSxhQUFhO0FBQ2I7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTyx3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUIsaUJBQWlCLE9BQU8saURBQWlEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Qsd0RBQXdEO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNDQUFzQztBQUMxRCxxQkFBcUIsT0FBTyw0REFBNEQ7QUFDeEY7QUFDQTtBQUNBLHFCQUFxQixPQUFPLG9FQUFvRTtBQUNoRztBQUNBO0FBQ0EscUJBQXFCLE9BQU8sbUVBQW1FO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsRUFBRTtBQUN2RDtBQUNBLFlBQVkseUJBQXlCO0FBQ3JDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQ0FBa0M7QUFDbEQ7QUFDQSxvREFBb0QsRUFBRSxzQkFBc0IsTUFBTTtBQUNsRjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTyxtQkFBbUIsU0FBUztBQUNuRDtBQUNBLHdEQUF3RCxLQUFLLHFCQUFxQixFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxpQkFBaUI7QUFDN0I7QUFDQSx1RUFBdUUsRUFBRTtBQUN6RTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsRUFBRTtBQUNsRjtBQUNBLFlBQVksaUNBQWlDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0NBQWdDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7Ozs7Ozs7Ozs7QUN4UVo7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsK0JBQStCO0FBQy9CLDhCQUE4QixtQkFBTyxDQUFDLG1HQUF1QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQiw4QkFBOEI7QUFDOUI7QUFDQSxrQkFBa0I7QUFDbEIsOEJBQThCO0FBQzlCO0FBQ0Esb0RBQW9ELGFBQWE7QUFDakUsOENBQThDLE9BQU8sS0FBSztBQUMxRCw0Q0FBNEMsT0FBTyxLQUFLO0FBQ3hEO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSwrQkFBK0I7Ozs7Ozs7Ozs7O0FDeEJsQjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxjQUFjLEdBQUcsYUFBYSxHQUFHLFlBQVksR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHLGNBQWMsR0FBRyxZQUFZLEdBQUcsWUFBWTtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxlQUFlO0FBQzNCO0FBQ0EsQ0FBQztBQUNELFlBQVk7QUFDWixrQ0FBa0MscUJBQXFCO0FBQ3ZELFlBQVk7QUFDWjtBQUNBLGNBQWM7QUFDZCxtRUFBbUUsbURBQW1EO0FBQ3RILGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZUFBZTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGtCQUFrQixZQUFZO0FBQzlCLGNBQWM7Ozs7Ozs7Ozs7O0FDbEREO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDBCQUEwQixHQUFHLDJCQUEyQixHQUFHLGdDQUFnQyxHQUFHLHVCQUF1QixHQUFHLGtCQUFrQixHQUFHLGlCQUFpQjtBQUM5SixzQkFBc0IsbUJBQU8sQ0FBQyxtRkFBZTtBQUM3QywrQkFBK0IsbUJBQU8sQ0FBQyxxR0FBd0I7QUFDL0Q7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLENBQUM7QUFDRCx1QkFBdUIsdURBQXVELG1CQUFtQjtBQUNqRyxnQ0FBZ0Msb0RBQW9ELGFBQWE7QUFDakcsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFlBQVk7QUFDeEI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCOzs7Ozs7Ozs7OztBQzFHYjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsRUFBRTtBQUN2QztBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxLQUFLO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsbUVBQStGO0FBRWxGLGNBQU0sR0FBRyxHQUFHLENBQUM7QUFDYixtQkFBVyxHQUFHLEVBQUUsQ0FBQztBQUNqQixrQkFBVSxHQUFHLEVBQUUsQ0FBQztBQUNoQixpQkFBUyxHQUFHLEVBQUUsQ0FBQztBQUU1QixTQUFnQixjQUFjO0lBQzFCLElBQU0sR0FBRyxHQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUF3QixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztJQUVwRixLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx1QkFBdUI7SUFDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FB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Q0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsR0FBRztZQUNOLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUs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bkMsd0JBQWEsRUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQyw4QkFBbUIsRUFBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUF1QixDQUFDO0lBQ2pGLFdBQVcsQ0FBQyxPQUFPLEdBQUc7UUFDbEIsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsVUFBRyxTQUFTLENBQUUsQ0FBQztRQUNuQyx3QkFBYSxFQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLDhCQUFtQixFQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL290aGVyX3R5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi90YWN0aWNzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi90eXBlX19tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaGFuZGxlX2JvZHlfZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hfbW9uYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L3JlYWRfcGVremVwX251bWVyYWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3R5cGVfX21lc3NhZ2VcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdGFjdGljc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdGhlcl90eXBlc1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qXHJcbiAqIFRoZW9yZXRpY2FsbHkgc3BlYWtpbmcsIGl0IGlzIG5lY2Vzc2FyeSB0byBkaXN0aW5ndWlzaCB4MzIgYW5kIHg2NFxyXG4gKiBiZWNhdXNlIGl0IGlzIHBvc3NpYmxlIHRvIHNjb3JlIDEgcG9pbnQgKDMrMy01KS5cclxuICogTm90IHRoYXQgaXQgd2lsbCBldmVyIGJlIG9mIHVzZSBpbiBhbnkgcmVhbCBzaXR1YXRpb24uXHJcbiAqLyBcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5Qcm9mZXNzaW9uID0gZXhwb3J0cy5Db2xvciA9IHZvaWQgMDtcclxudmFyIENvbG9yO1xyXG4oZnVuY3Rpb24gKENvbG9yKSB7XHJcbiAgICBDb2xvcltDb2xvcltcIktvazFcIl0gPSAwXSA9IFwiS29rMVwiO1xyXG4gICAgQ29sb3JbQ29sb3JbXCJIdW9rMlwiXSA9IDFdID0gXCJIdW9rMlwiO1xyXG59KShDb2xvciA9IGV4cG9ydHMuQ29sb3IgfHwgKGV4cG9ydHMuQ29sb3IgPSB7fSkpO1xyXG52YXIgUHJvZmVzc2lvbjtcclxuKGZ1bmN0aW9uIChQcm9mZXNzaW9uKSB7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJOdWFrMVwiXSA9IDBdID0gXCJOdWFrMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS2F1azJcIl0gPSAxXSA9IFwiS2F1azJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkd1YTJcIl0gPSAyXSA9IFwiR3VhMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS2F1bjFcIl0gPSAzXSA9IFwiS2F1bjFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkRhdTJcIl0gPSA0XSA9IFwiRGF1MlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiTWF1bjFcIl0gPSA1XSA9IFwiTWF1bjFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkt1YTJcIl0gPSA2XSA9IFwiS3VhMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiVHVrMlwiXSA9IDddID0gXCJUdWsyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJVYWkxXCJdID0gOF0gPSBcIlVhaTFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIklvXCJdID0gOV0gPSBcIklvXCI7XHJcbn0pKFByb2Zlc3Npb24gPSBleHBvcnRzLlByb2Zlc3Npb24gfHwgKGV4cG9ydHMuUHJvZmVzc2lvbiA9IHt9KSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBleHBvcnRzLmhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyA9IGV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQgPSBleHBvcnRzLmhhbmRsZVlha3UgPSBleHBvcnRzLmhhbmRsZVRhbU1vdmUgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoZXJzXzEgPSByZXF1aXJlKFwiLi9tdW5jaGVyc1wiKTtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5mdW5jdGlvbiBoYW5kbGVUYW1Nb3ZlKHMpIHtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmIChyZXN0LmNoYXJBdCgwKSAhPT0gXCLnmodcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGFtMiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIC8vIHRoZSBmb3JtYXQgaXMgZWl0aGVyOlxyXG4gICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAvLyAtIFRZ55qHVEFJW1RBVV1aQVVcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoZmlyc3REZXN0LCBuZXh0KSA9PiAoeyBmaXJzdERlc3QsIG5leHQgfSksIG11bmNoZXJzXzEubXVuY2hCcmFja2V0ZWRDb29yZCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICh0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCkge1xyXG4gICAgICAgIC8vIGVpdGhlcjpcclxuICAgICAgICAvLyAtIFpV55qHW1RPXVRVXHJcbiAgICAgICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgZmlyc3REZXN0LCBuZXh0IH0sIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldDtcclxuICAgICAgICBpZiAocmVzdDIgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBTdHlsZTogXCJOb1N0ZXBcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdDogbmV4dFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdHJ5X211bmNoX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgICAgICAgICBpZiAoIXRyeV9tdW5jaF9jb29yZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgeyBhbnM6IHNlY29uZERlc3QsIHJlc3Q6IGVtcHR5IH0gPSB0cnlfbXVuY2hfY29vcmQ7XHJcbiAgICAgICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7ZW1wdHl9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHsgdHlwZTogXCJUYW1Nb3ZlXCIsIHN0ZXBTdHlsZTogXCJTdGVwc0R1cmluZ0xhdHRlclwiLCBzcmMsIGZpcnN0RGVzdCwgc3RlcDogbmV4dCwgc2Vjb25kRGVzdCB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICAgICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QpID0+ICh7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9KSwgbXVuY2hlcnNfMS5tdW5jaENvb3JkLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICAgICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9LCByZXN0OiBlbXB0eSB9ID0gbXVuY2g7XHJcbiAgICAgICAgaWYgKGVtcHR5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJUYW1Nb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdGb3JtZXJcIixcclxuICAgICAgICAgICAgICAgIHNyYywgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVGFtTW92ZSA9IGhhbmRsZVRhbU1vdmU7XHJcbmZ1bmN0aW9uIGhhbmRsZVlha3Uocykge1xyXG4gICAgLy8g5oiW54K6546L5Yqg542jXHJcbiAgICAvLyDmiJbngrrnjovliqDnjaPogIzmiYvlhatcclxuICAgIGNvbnN0IGhhbmRzU2VwQnlBdCA9ICgwLCBtdW5jaF9tb25hZF8xLnNlcEJ5MSkoeyBwOiBtdW5jaGVyc18xLm11bmNoSGFuZCwgc2VwOiAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5YqgXCIpIH0pO1xyXG4gICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBoYW5kcykgPT4gaGFuZHMsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiJbngrpcIiksIGhhbmRzU2VwQnlBdCkocyk7XHJcbiAgICBpZiAoIW11bmNoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogaGFuZHMsIHJlc3QgfSA9IG11bmNoO1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiBcInR5bW9rXCIsIGhhbmRzIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBtdW5jaDIgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBudW0pID0+IG51bSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuiAjOaJi1wiKSwgbXVuY2hlcnNfMS5tdW5jaFBla3plcE51bWVyYWwpKHJlc3QpO1xyXG4gICAgaWYgKCFtdW5jaDIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzY29yZSwgcmVzdDogcmVzdDIgfSA9IG11bmNoMjtcclxuICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgdHlwZTogXCJ0YXhvdFwiLCBoYW5kcywgc2NvcmUgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZVlha3UgPSBoYW5kbGVZYWt1O1xyXG5jb25zdCBtdW5jaFdhdGVyRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuawtFwiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLnhKHmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIDmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuozmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIlcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLlm5tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkupRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gbXVuY2hXYXRlckV2ZW50O1xyXG5jb25zdCBtdW5jaENpdXJsRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIueEoeaSg+ijgVwiKSkge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm5vX2NpdXJsX2V2ZW50XCIgfSwgcmVzdDogcy5zbGljZSgzKSB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCB3YXRlcl9lbnRyeV9jaXVybDogYW5zIH0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmqYtcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBjb25zdCBzdGVwcGluZ19jaXVybCA9IHRbMF0gPT09IFwi54ShXCIgPyAwIDpcclxuICAgICAgICAgICAgdFswXSA9PT0gXCLkuIBcIiA/IDEgOlxyXG4gICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuoxcIiA/IDIgOlxyXG4gICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LiJXCIgPyAzIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLlm5tcIiA/IDQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkupRcIiA/IDUgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGNoYXJhY3RlciBmb3VuZCBhZnRlciDmqYtcIik7IH0pKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHQuc2xpY2UoMSk7XHJcbiAgICAgICAgLy8gRWl0aGVyIG5vdGhpbmcsIOatpOeEoSwgb3IgbXVuY2hXYXRlckV2ZW50XHJcbiAgICAgICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShyZXN0KTtcclxuICAgICAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiB3YXRlcl9lbnRyeV9jaXVybCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwiaGFzX3dhdGVyX2VudHJ5XCIsIHN0ZXBwaW5nX2NpdXJsLCB3YXRlcl9lbnRyeV9jaXVybCB9LCByZXN0OiByZXN0MiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXN0LnN0YXJ0c1dpdGgoXCLmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwib25seV9zdGVwcGluZ1wiLCBzdGVwcGluZ19jaXVybCwgaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M6IGZhbHNlIH0sIHJlc3Q6IFwiXCIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiB0cnVlIH0sIHJlc3QgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBtdW5jaENpdXJsRXZlbnQ7XHJcbmZ1bmN0aW9uIGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhzKSB7XHJcbiAgICBjb25zdCB0cnlfY2l1cmxfZXZlbnQgPSAoMCwgZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQpKHMpO1xyXG4gICAgaWYgKCF0cnlfY2l1cmxfZXZlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgY2l1cmwgZXZlbnQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBjaXVybF9ldmVudCwgcmVzdCB9ID0gdHJ5X2NpdXJsX2V2ZW50O1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCB9O1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb3B0aW9uYWxfcGllY2VfY2FwdHVyZSA9ICgwLCBtdW5jaGVyc18xLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCkocmVzdCk7XHJcbiAgICBpZiAob3B0aW9uYWxfcGllY2VfY2FwdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBwaWVjZV9jYXB0dXJlLCByZXN0OiByZXN0MiB9ID0gb3B0aW9uYWxfcGllY2VfY2FwdHVyZTtcclxuICAgICAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFpbGluZyBwYXJhbWV0ZXIgXFxgJHtzfVxcYCBoYXMgc29tZSBleHRyYSBcXGAke3Jlc3QyfVxcYCBhdCB0aGUgZW5kYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50LCBwaWVjZV9jYXB0dXJlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgdHJhaWxpbmcgcGFyYW1ldGVyOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnM7XHJcbmZ1bmN0aW9uIGhhbmRsZUJvZHlFbGVtZW50KHMpIHtcclxuICAgIGlmIChzID09PSBcIuaYpee1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAwIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlpI/ntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi56eL57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWGrOe1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAzIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLntYLlraNcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImVuZF9zZWFzb25cIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5pif5LiA5ZGoXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJnYW1lX3NldFwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueCulwiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVZYWt1KHMpO1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLnmodcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlVGFtTW92ZShzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9mcm9tX2hvcHp1byA9ICgwLCBtdW5jaGVyc18xLm11bmNoRnJvbUhvcFp1bykocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX2Zyb21faG9wenVvKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgY29sb3IsIHByb2YsIGRlc3QgfSwgcmVzdCB9ID0gdHJ5X211bmNoX2Zyb21faG9wenVvO1xyXG4gICAgICAgIGlmIChyZXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJmcm9tX2hvcHp1b1wiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkZyb21Ib3AxWnVvMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2YsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmICghW1wi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi6Ii5XCIsIFwi54mHXCJdLmluY2x1ZGVzKHJlc3QuY2hhckF0KDApKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgYSBwcm9mZXNzaW9uIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoXzJuZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfMm5kX2Nvb3JkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0aGUgc2Vjb25kIGNvb3JkaW5hdGUgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2Vjb25kX2Nvb3JkLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoXzJuZF9jb29yZDtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF8zcmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8zcmRfY29vcmQpIHtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Mik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogc2Vjb25kX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB0aGlyZF9jb29yZCwgcmVzdDogcmVzdDMgfSA9IHRyeV9tdW5jaF8zcmRfY29vcmQ7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjU3RlcERzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBzZWNvbmRfY29vcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogdGhpcmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBoYW5kbGVCb2R5RWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHZvaWQgMDtcclxuY29uc3QgaGFuZGxlX2JvZHlfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vaGFuZGxlX2JvZHlfZWxlbWVudFwiKTtcclxuLy8gVmVyeSBwcmltaXRpdmUgcGFyc2VyIHRoYXQgbmV2ZXIgaGFuZGxlcyBhbGwgdGhlIGVkZ2UgY2FzZXNcclxuZnVuY3Rpb24gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEocykge1xyXG4gICAgY29uc3QgbGluZXMgPSBzLnRyaW0oKS5zcGxpdChcIlxcblwiKS5tYXAobCA9PiBsLnRyaW0oKSk7XHJcbiAgICBjb25zdCBpbml0aWFsX2xpbmUgPSBsaW5lc1swXTtcclxuICAgIGlmIChpbml0aWFsX2xpbmUgPT09IHVuZGVmaW5lZCAvKiBTaW5jZSB3ZSB1c2VkIC5zcGxpdCgpLCB0aGlzIGFjdHVhbGx5IGNhbid0IGhhcHBlbiAqLyB8fCBpbml0aWFsX2xpbmUgPT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgYLjgorjgb7jgZvjgpNcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgvXlxce+Wni+aZgjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75aeL5pmCOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZnjgILjgZPjgozjga8yMDIx5bm0MTHmnIjmnKvjgqLjg4Pjg5fjg4fjg7zjg4jku6XliY3jga7mo4vorZzjgafjgYLjgorjgIHjgb7jgaDlr77lv5zjgafjgY3jgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghL15cXHvkuIDkvY3oibI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+S4gOS9jeiJsjog44Gn5aeL44G+44Gj44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRpbmdfcGxheWVycyA9IGluaXRpYWxfbGluZS5tYXRjaCgvXlxce+S4gOS9jeiJsjooW+m7kui1pF0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdfdGltZSA9IGxpbmVzWzFdPy5tYXRjaCgvXlxce+Wni+aZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBlbmRpbmdfdGltZSA9IGxpbmVzWzJdPy5tYXRjaCgvXlxce+e1guaZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBib2RpZXMgPSBsaW5lcy5zbGljZSgzKS5mbGF0TWFwKGxpbmUgPT4gbGluZS5zcGxpdCgvW1xcc1xcbl0vZykpLmZpbHRlcihhID0+IGEgIT09IFwiXCIpO1xyXG4gICAgY29uc3QgcGFyc2VkX2JvZGllcyA9IGJvZGllcy5tYXAoaGFuZGxlX2JvZHlfZWxlbWVudF8xLmhhbmRsZUJvZHlFbGVtZW50KTtcclxuICAgIHJldHVybiB7IHN0YXJ0aW5nX3BsYXllcnMsIHN0YXJ0aW5nX3RpbWUsIGVuZGluZ190aW1lLCBwYXJzZWRfYm9kaWVzIH07XHJcbn1cclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnNlcEJ5MSA9IGV4cG9ydHMubWFueTEgPSBleHBvcnRzLm1hbnkgPSBleHBvcnRzLmxpZnRNMyA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5saWZ0TTIgPSBleHBvcnRzLnB1cmUgPSBleHBvcnRzLmJpbmQgPSB2b2lkIDA7XHJcbi8vIG1vbmFkXHJcbmNvbnN0IGJpbmQgPSAobWEsIGNhbGxiYWNrKSA9PiAoKGlucHV0KSA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIHJldHVybiBjYWxsYmFjayhhKShyZXN0KTtcclxufSk7XHJcbmV4cG9ydHMuYmluZCA9IGJpbmQ7XHJcbmNvbnN0IHB1cmUgPSAoYSkgPT4gKGlucHV0KSA9PiAoeyBhbnM6IGEsIHJlc3Q6IGlucHV0IH0pO1xyXG5leHBvcnRzLnB1cmUgPSBwdXJlO1xyXG5jb25zdCBsaWZ0TTIgPSAoZiwgbWEsIG1iKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIpKSkpO1xyXG5leHBvcnRzLmxpZnRNMiA9IGxpZnRNMjtcclxuY29uc3Qgc3RyaW5nID0gKHByZWZpeCkgPT4gKGlucHV0KSA9PiBpbnB1dC5zdGFydHNXaXRoKHByZWZpeCkgPyB7IGFuczogdW5kZWZpbmVkLCByZXN0OiBpbnB1dC5zbGljZShwcmVmaXgubGVuZ3RoKSB9IDogbnVsbDtcclxuZXhwb3J0cy5zdHJpbmcgPSBzdHJpbmc7XHJcbmNvbnN0IGxpZnRNMyA9IChmLCBtYSwgbWIsIG1jKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYywgYyA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIsIGMpKSkpKTtcclxuZXhwb3J0cy5saWZ0TTMgPSBsaWZ0TTM7XHJcbmNvbnN0IG1hbnkgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgbGV0IHJlc3QgPSBpbnB1dDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55ID0gbWFueTtcclxuY29uc3QgbWFueTEgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGxldCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIGNvbnN0IGFucyA9IFthXTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55MSA9IG1hbnkxO1xyXG5jb25zdCBzZXBCeTEgPSAoeyBwOiBtYSwgc2VwIH0pID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKCgwLCBleHBvcnRzLm1hbnkpKCgwLCBleHBvcnRzLmJpbmQpKHNlcCwgKF8pID0+IG1hKSksIGFzID0+ICgwLCBleHBvcnRzLnB1cmUpKFthLCAuLi5hc10pKSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gc2VwQnkxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IGV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9IGV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSBleHBvcnRzLm11bmNoQ29vcmQgPSBleHBvcnRzLm11bmNoSGFuZCA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5jb25zdCByZWFkX3Bla3plcF9udW1lcmFsc18xID0gcmVxdWlyZShcIi4vcmVhZF9wZWt6ZXBfbnVtZXJhbHNcIik7XHJcbmNvbnN0IG11bmNoQ29sb3IgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui1pFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFByb2Zlc3Npb24gPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiIuVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5YW1XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlvJNcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui7ilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6JmOXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLppqxcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuethlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA2LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5berXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDcsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlsIZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA5LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hDb2x1bW4gPSAocykgPT4ge1xyXG4gICAgY29uc3QgY29scyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICBpZiAocy5jaGFyQXQoMCkgPT09IGNvbCkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGNvbCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFJvdyA9IChzKSA9PiB7XHJcbiAgICBjb25zdCByb3dzID0gW1wiQUlcIiwgXCJBVVwiLCBcIklBXCIgLyogaGFuZGxlIHRoZSBsb25nZXIgb25lcyBmaXJzdCAqLywgXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChyb3cpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogcm93LCByZXN0OiBzLnNsaWNlKHJvdy5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoSGFuZCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kcyA9IFtcIueOi1wiLCBcIueNo1wiLCBcIuWQjOiJsueNo1wiLCBcIuWcsOW/g1wiLCBcIuWQjOiJsuWcsOW/g1wiLCBcIummrOW8k+WFtVwiLCBcIuWQjOiJsummrOW8k+WFtVwiLFxyXG4gICAgICAgIFwi5Yqp5Y+LXCIsIFwi5ZCM6Imy5Yqp5Y+LXCIsIFwi5oim6ZuGXCIsIFwi5ZCM6Imy5oim6ZuGXCIsIFwi6KGM6KGMXCIsIFwi5ZCM6Imy6KGM6KGMXCIsIFwi562G5YW154Sh5YK+XCIsIFwi5ZCM6Imy562G5YW154Sh5YK+XCIsXHJcbiAgICAgICAgXCLpl4fmiKbkuYvpm4ZcIiwgXCLlkIzoibLpl4fmiKbkuYvpm4ZcIiwgXCLnhKHmipfooYzlh6ZcIiwgXCLlkIzoibLnhKHmipfooYzlh6ZcIl07XHJcbiAgICBmb3IgKGNvbnN0IGhhbmQgb2YgaGFuZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGhhbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogaGFuZCwgcmVzdDogcy5zbGljZShoYW5kLmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0cy5tdW5jaEhhbmQgPSBtdW5jaEhhbmQ7XHJcbmV4cG9ydHMubXVuY2hDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGNvbCwgcm93KSA9PiB7XHJcbiAgICBjb25zdCBjb29yZCA9IFtyb3csIGNvbF07XHJcbiAgICByZXR1cm4gY29vcmQ7XHJcbn0sIG11bmNoQ29sdW1uLCBtdW5jaFJvdyk7XHJcbmV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoY29sb3IsIHByb2YsIGRlc3QpID0+ICh7IGNvbG9yLCBwcm9mLCBkZXN0IH0pLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24sIGV4cG9ydHMubXVuY2hDb29yZCk7XHJcbmV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXywgY29sb3IsIHByb2YpID0+ICh7IGNvbG9yLCBwcm9mIH0pLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5omLXCIpLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24pO1xyXG5leHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfMSwgY29vcmQsIF8yKSA9PiBjb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIltcIiksIGV4cG9ydHMubXVuY2hDb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIl1cIikpO1xyXG5jb25zdCBtdW5jaERpZ2l0TGluemtsYXIgPSAocykgPT4ge1xyXG4gICAgY29uc3QgZHMgPSBbXCLnhKFcIiwgXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIiwgXCLljYFcIiwgXCLkuItcIiwgXCLnmb5cIl07XHJcbiAgICBmb3IgKGNvbnN0IGQgb2YgZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogZCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFBla3plcE51bWVyYWwgPSAocykgPT4ge1xyXG4gICAgY29uc3QgdDEgPSAoMCwgbXVuY2hfbW9uYWRfMS5tYW55MSkobXVuY2hEaWdpdExpbnprbGFyKShzKTtcclxuICAgIGlmICghdDEpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdDE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG51bSA9ICgwLCByZWFkX3Bla3plcF9udW1lcmFsc18xLmZyb21EaWdpdHNMaW56a2xhcikoYW5zKTtcclxuICAgICAgICByZXR1cm4geyBhbnM6IG51bSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBtdW5jaFBla3plcE51bWVyYWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXIoaSkge1xyXG4gICAgaWYgKGlbMF0gPT09IFwi54ShXCIgJiYgaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuS4i1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIC1mcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnmb5cIikge1xyXG4gICAgICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTAwICsgZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5kZXgxMDAgPSBpLmluZGV4T2YoXCLnmb5cIik7XHJcbiAgICBpZiAoaW5kZXgxMDAgIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgaHVuZHJlZHMgPSBpLnNsaWNlKDAsIGluZGV4MTAwKTtcclxuICAgICAgICBjb25zdCBvbmVzID0gaS5zbGljZShpbmRleDEwMCArIDEpO1xyXG4gICAgICAgIHJldHVybiAxMDAgKiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaHVuZHJlZHMpICsgZnJvbURpZ2l0c0xpbnprbGFyU3ViKG9uZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVsxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCAqIHBhcnNlVW5pdChpWzBdKSArIHBhcnNlVW5pdChpWzJdKTtcclxuICAgIH1cclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSBcIiR7aX1cIiBhcyBhIHBla3plcCBudW1lcmFsYCk7XHJcbn1cclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSBmcm9tRGlnaXRzTGluemtsYXI7XHJcbmZ1bmN0aW9uIHBhcnNlVW5pdChvbmVzKSB7XHJcbiAgICBpZiAob25lcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIBcIikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4iVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlm5tcIikge1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDY7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuINcIikge1xyXG4gICAgICAgIHJldHVybiA3O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICByZXR1cm4gODtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS5nVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIFwiJHtvbmVzfVwiIHdoaWxlIHRyeWluZyB0byBwYXJzZSBwZWt6ZXAgbnVtZXJhbHNgKTtcclxufVxyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaSkge1xyXG4gICAgaWYgKGkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpW2kubGVuZ3RoIC0gMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pICogMTA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBhID0gaVswXTtcclxuICAgICAgICBjb25zdCBiID0gaVsxXTtcclxuICAgICAgICBpZiAoYiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSkgKiAxMCArIHBhcnNlVW5pdChiKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBOb25UYW1QaWVjZSwgU3RhdGUsIEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgcHJvZnMsIEJvYXJkLCBEYXQyRGlzcGxheSB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaGVpZ2h0ID0gMzg3O1xyXG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IHRvcF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IGNlbGxfc2l6ZSA9IDQzO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdFbXB0eUJvYXJkKCkge1xyXG4gICAgY29uc3QgY3R4ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3ZcIikhIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG5cclxuICAgIC8vIOeah+WHplxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDI3LCA1NC41JSwgODEuMSUpXCJcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG5cclxuICAgIC8vIOeah+awtFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDIxMywgMzMuNiUsIDc4LjklKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIC8vIOeah+WxsVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDEyOSwgMzguNSUsIDQ1LjQlKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYig5OSwgOTksIDk5KSc7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMC4wMyAqIGhlaWdodCAvIDk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyAwLCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBoZWlnaHQsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMCk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsMCwwKVwiO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiLCBcIkFJXCIsIFwiQVVcIiwgXCJJQVwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIGxlZnRfbWFyZ2luICsgaGVpZ2h0ICsgMTAsIHRvcF9tYXJnaW4gKyAzMCArIGNlbGxfc2l6ZSAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGksIHRvcF9tYXJnaW4gLSAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICBjdHgucm90YXRlKE1hdGguUEkpO1xyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIC1sZWZ0X21hcmdpbiArIDEwLCAtKHRvcF9tYXJnaW4gKyAxNSArIGNlbGxfc2l6ZSAqIGkpKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgLShsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSksIC0odG9wX21hcmdpbiArIGhlaWdodCArIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0X3RvcF9sZWZ0KGNvb3JkOiBBYnNvbHV0ZUNvb3JkKSB7XHJcbiAgICBjb25zdCBjb2x1bW4gPSB7XHJcbiAgICAgICAgSzogMCxcclxuICAgICAgICBMOiAxLFxyXG4gICAgICAgIE46IDIsXHJcbiAgICAgICAgVDogMyxcclxuICAgICAgICBaOiA0LFxyXG4gICAgICAgIFg6IDUsXHJcbiAgICAgICAgQzogNixcclxuICAgICAgICBNOiA3LFxyXG4gICAgICAgIFA6IDhcclxuICAgIH1bY29vcmRbMV1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W2Nvb3JkWzBdXTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIGNlbGxfc2l6ZSAqIChjb2x1bW4gLSAwLjUpO1xyXG4gICAgY29uc3QgdG9wID0gdG9wX21hcmdpbiArIGNlbGxfc2l6ZSAqIChyb3cgLSAwLjUpO1xyXG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzUGxhbm5lZERlc3RIVE1MKGZvY3VzX3BsYW5uZWRfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19wbGFubmVkX2Rlc3QpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19wbGFubmVkX2Rlc3QpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTc4LCAyNTUsIDI1NSlcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb2N1c1N0ZXBwZWRIVE1MKGZvY3VzX3N0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfc3RlcHBlZCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3N0ZXBwZWQpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAwLCAwLjMpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ZvY3VzU3JjKGZvY3VzX3NyYzogQWJzb2x1dGVDb29yZCB8IFwiYV9zaWRlX2hvcDF6dW8xXCIgfCBcImlhX3NpZGVfaG9wMXp1bzFcIiB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zcmMgfHwgZm9jdXNfc3JjID09PSBcImFfc2lkZV9ob3AxenVvMVwiIHx8IGZvY3VzX3NyYyA9PT0gXCJpYV9zaWRlX2hvcDF6dW8xXCIpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zcmMpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFBpZWNlc09uQm9hcmRIVE1MKGJvYXJkOiBCb2FyZCwgZm9jdXM6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChjb25zdCBjbG0gaW4gYm9hcmQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNfZm9jdXNlZCA9IGZvY3VzID8gZm9jdXNbMV0gPT09IGNsbSAmJiBmb2N1c1swXSA9PT0gcncgOiBmYWxzZTtcclxuICAgICAgICAgICAgYW5zICs9IFBvc2l0aW9uZWRQaWVjZU9uQm9hcmRIVE1MKFxyXG4gICAgICAgICAgICAgICAgY2xtIGFzIEFic29sdXRlQ29sdW1uLFxyXG4gICAgICAgICAgICAgICAgcncgYXMgQWJzb2x1dGVSb3csXHJcbiAgICAgICAgICAgICAgICBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dIVtydyBhcyBBYnNvbHV0ZVJvd10hLFxyXG4gICAgICAgICAgICAgICAgaXNfZm9jdXNlZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gSG9wMVp1bzFIVE1MKHBpZWNlczogTm9uVGFtUGllY2VbXSwgaXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XHJcbiAgICAgICAgY29uc3QgcmFkID0gMTggLyAwLjI2O1xyXG4gICAgICAgIGFucyArPSBgPGxpPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMjNweDsgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7Y2VsbF9zaXplfXB4OyBcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7IFxyXG4gICAgICAgICAgICBcIj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJHtpc19uZXdseV9hY3F1aXJlZCAmJiBpID09IHBpZWNlcy5sZW5ndGggLSAxID8gYDxkaXYgc3R5bGU9XCJcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogJHs0MiAtIHJhZH1weDtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHtyYWQgKiAyfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJHtyYWQgKiAyfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI1JTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDYwLCA1MCwgMC4zKTtcclxuICAgICAgICAgICAgICAgIFwiPjwvZGl2PmAgOiBcIlwifVxyXG4gICAgICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoY29sb3IsIHByb2YsIGZhbHNlKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9saT5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdHYW1lU3RhdGUoU1RBVEU6IFN0YXRlKSB7XHJcbiAgICBpZiAoU1RBVEUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LmFkZChcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSBpZiAoU1RBVEUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QuYWRkKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Vhc29uX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnNlYXNvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS50dXJuICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmF0ZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5yYXRlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGllY2Vfc3RhbmRcIikhLmlubmVySFRNTCA9IEhvcDFadW8xSFRNTChTVEFURS5hX3NpZGUuaG9wMXp1bzEsIFNUQVRFLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGllY2Vfc3RhbmRcIikhLmlubmVySFRNTCA9IEhvcDFadW8xSFRNTChTVEFURS5pYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGllY2VzX2lubmVyXCIpIS5pbm5lckhUTUwgPSBGb2N1c1N0ZXBwZWRIVE1MKFNUQVRFLmZvY3VzLnN0ZXBwZWQpICtcclxuICAgICAgICBkcmF3Rm9jdXNTcmMoU1RBVEUuZm9jdXMuc3JjKSArXHJcbiAgICAgICAgRm9jdXNQbGFubmVkRGVzdEhUTUwoU1RBVEUuZm9jdXMuaW5pdGlhbGx5X3BsYW5uZWRfZGVzdCkgK1xyXG4gICAgICAgIFBpZWNlc09uQm9hcmRIVE1MKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cy5hY3R1YWxfZmluYWxfZGVzdCkgKyBEYXQyTGlzdEhUTUwoU1RBVEUuZGF0Ml9saXN0X29uX2Rpc3BsYXkpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gRGF0Mkxpc3RIVE1MKGE6IERhdDJEaXNwbGF5KTogc3RyaW5nIHtcclxuICAgIGlmICghYSkgcmV0dXJuIFwiXCI7XHJcbiAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCIgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDQ2OXB4O1xyXG4gICAgaGVpZ2h0OiAyNTZweDtcclxuICAgIHRvcDogMTA3cHg7XHJcbiAgICBsZWZ0OiAwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDgwJSk7IGNvbG9yOiB3aGl0ZVwiPiR7Wy4uLmEuaGFuZHMsIGEudHlwZSA9PT0gXCJ0YXhvdFwiID8gXCLntYLlraNcIiA6IFwi5YaN6KGMXCJdLmpvaW4oXCI8YnI+XCIpfTwvZGl2PmBcclxufVxyXG5cclxuZnVuY3Rpb24gTm9ybWFsUGllY2VIVE1MKGNvbG9yOiBcIum7klwiIHwgXCLotaRcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcclxuICAgIGNvbnN0IHkgPSBpc19ib2xkID8gMCA6IC0yNzc7XHJcbiAgICBjb25zdCBjb2xvcl9wYXRoID0ge1xyXG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXHJcbiAgICAgICAgXCLotaRcIjogXCLjgrTjgrfjg4Pjgq/pp5Jf6LWkXCIsXHJcbiAgICB9W2NvbG9yXTtcclxuICAgIHJldHVybiBgPGRpdlxyXG4gICAgc3R5bGU9XCJ3aWR0aDogODdweDsgaGVpZ2h0OiA4N3B4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6ICR7eH1weDsgYmFja2dyb3VuZC1wb3NpdGlvbi15OiAke3l9cHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgke2NvbG9yX3BhdGh9LnN2Zyk7IFwiPlxyXG48L2Rpdj5gXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBQb3NpdGlvbmVkUGllY2VPbkJvYXJkSFRNTChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHsgbGVmdCwgdG9wIH0gPSBnZXRfdG9wX2xlZnQoW3J3LCBjbG1dKTtcclxuICAgIGlmIChwaWVjZSA9PT0gXCLnmodcIikge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7XCJyb3RhdGUoOTBkZWcpXCJ9XCI+XHJcbiAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKFwi6buSXCIsIFwi55qHXCIsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0gPSBwaWVjZTtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke2lzX2FzaWRlID8gXCJyb3RhdGUoMTgwZGVnKVwiIDogXCJcIn1cIj5cclxuICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoY29sb3IsIHByb2YsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2Fyazogc3RyaW5nLCBuOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGxpbmVzID0ga2lhcl9hcmsudHJpbSgpLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgY29uc29sZS5sb2cobGluZXMpO1xyXG4gICAgLy8gd2hlbiBuID0gMCwgbm90aGluZyBzaG91bGQgYmUgaGlnaGxpZ2h0ZWRcclxuICAgIGZvciAobGV0IGkgPSAzOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobGluZXNbaV0udHJpbSgpID09PSBcIlwiKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCBlbGVtc19sZW5ndGggPSBsaW5lc1tpXS5zcGxpdCgvIC9nKS5maWx0ZXIoYSA9PiBhICE9PSBcIlwiKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKG4gPiBlbGVtc19sZW5ndGggfHwgbiA8PSAwKSB7XHJcbiAgICAgICAgICAgIG4gLT0gZWxlbXNfbGVuZ3RoOyBjb250aW51ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBuID0gMSA9PiBoaWdobGlnaHQgdGhlIGZpcnN0IGVsZW1lbnQsIGFuZCBzbyBvblxyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBsaW5lc1tpXS5zcGxpdCgvIC9nKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnJbal0gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbi0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuID09PSAwKSB7IGFycltqXSA9IGA8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XCI+JHthcnJbal19PC9zcGFuPmA7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5lc1tpXSA9IGFyci5qb2luKFwiIFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtpYV9ha1wiKSEuaW5uZXJIVE1MID0gbGluZXMuam9pbihcIlxcblwiKTtcclxufVxyXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCwgUGFyc2VkLCBDaXVybEV2ZW50IH0gZnJvbSBcImNlcmtlX29ubGluZV9raWFha19wYXJzZXJcIjtcclxuaW1wb3J0IHsgQm9hcmQsIGZyb21IYW56aVNlYXNvbiwgSGFuemlDb2xvciwgSGFuemlQcm9mZXNzaW9uLCBOb25UYW1QaWVjZSwgU3RhdGUsIHRvSGFuemlDb2xvciwgdG9IYW56aVByb2Zlc3Npb24gfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBBYnNvbHV0ZUNvb3JkLCBDb2xvciwgUHJvZmVzc2lvbiB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsQm9hcmQoKTogQm9hcmQge1xyXG5cdHJldHVybiB7XHJcblx0XHRLOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE46IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0VDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFo6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0TzogXCLnmodcIixcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0WDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEM6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TToge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFA6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShvOiB7XHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmdcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0fSxcclxufSk6IFN0YXRlIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2Vhc29uOiBcIuaYpVwiLFxyXG5cdFx0dHVybjogMCxcclxuXHRcdHJhdGU6IDEsXHJcblx0XHR3aG9zZV90dXJuOiBudWxsLFxyXG5cdFx0Zm9jdXM6IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IG51bGwsXHJcblx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdHNyYzogbnVsbCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogbnVsbFxyXG5cdFx0fSxcclxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdFx0ZGF0Ml9saXN0X29uX2Rpc3BsYXk6IG51bGwsXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVfZnJvbShzdGF0ZTogU3RhdGUsIGNvb3JkOiBBYnNvbHV0ZUNvb3JkKTogTm9uVGFtUGllY2UgfCBcIueah1wiIHtcclxuXHRjb25zdCBwaWVjZSA9IHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XHJcblx0aWYgKCFwaWVjZSkgeyB0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApOyB9XHJcblx0ZGVsZXRlIHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XHJcblx0cmV0dXJuIHBpZWNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRfdG8oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCwgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIik6IE5vblRhbVBpZWNlIHwgdW5kZWZpbmVkIHtcclxuXHRpZiAoc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSkge1xyXG5cdFx0Y29uc3QgY2FwdHVyZWRfcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdFx0aWYgKGNhcHR1cmVkX3BpZWNlID09PSBcIueah1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDluqfmqJkke2Nvb3JkWzFdfSR7Y29vcmRbMF1944Gr44Gv55qH44GM5pei44Gr44GC44KK44G+44GZYCk7XHJcblx0XHR9XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gY2FwdHVyZWRfcGllY2U7XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSBwaWVjZTtcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRfaG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBwaWVjZTogTm9uVGFtUGllY2UpIHtcclxuXHRpZiAocGllY2UuaXNfYXNpZGUpIHtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IGZhbHNlIH0pO1xyXG5cdFx0c3RhdGUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IHRydWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0YXRlLmFfc2lkZS5ob3AxenVvMS5wdXNoKHsgY29sb3I6IHBpZWNlLmNvbG9yLCBwcm9mOiBwaWVjZS5wcm9mLCBpc19hc2lkZTogdHJ1ZSB9KTtcclxuXHRcdHN0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IHRydWU7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVfZnJvbV9ob3AxenVvMShzdGF0ZTogU3RhdGUsIG86IHsgY29sb3I6IEhhbnppQ29sb3IsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IGJvb2xlYW4gfSkge1xyXG5cdGNvbnN0IGluZGV4ID0gc3RhdGVbby5pc19hc2lkZSA/IFwiYV9zaWRlXCIgOiBcImlhX3NpZGVcIl0uaG9wMXp1bzEuZmluZEluZGV4KGsgPT4gay5jb2xvciA9PT0gby5jb2xvciAmJiBrLnByb2YgPT09IG8ucHJvZik7XHJcblx0aWYgKGluZGV4ID09PSAtMSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOaMgeOBoemnkuOBqyR7by5jb2xvcn0ke28ucHJvZn3jgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuXHR9XHJcblx0c3RhdGVbby5pc19hc2lkZSA/IFwiYV9zaWRlXCIgOiBcImlhX3NpZGVcIl0uaG9wMXp1bzEuc3BsaWNlKGluZGV4LCAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoY2l1cmxfZXZlbnQ6IENpdXJsRXZlbnQpOiBib29sZWFuIHtcclxuXHRpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJub19jaXVybF9ldmVudFwiKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9IGVsc2UgaWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwib25seV9zdGVwcGluZ1wiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQuaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcImhhc193YXRlcl9lbnRyeVwiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQud2F0ZXJfZW50cnlfY2l1cmwgPj0gMztcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc3QgXzogbmV2ZXIgPSBjaXVybF9ldmVudDtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBjaXVybF9ldmVudC50eXBlXCIpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFN0YXRlKG9sZF9zdGF0ZTogUmVhZG9ubHk8U3RhdGU+LCBib2R5X2VsZW1lbnQ6IEJvZHlFbGVtZW50LCBzdGFydGluZ19wbGF5ZXJzOiBIYW56aUNvbG9yW10pOiBTdGF0ZSB8IG51bGwge1xyXG5cdGNvbnN0IG5ld19zdGF0ZTogU3RhdGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9sZF9zdGF0ZSkpO1xyXG5cdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gbnVsbCkge1xyXG5cdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBzdGFydGluZ19wbGF5ZXJzW2Zyb21IYW56aVNlYXNvbihvbGRfc3RhdGUuc2Vhc29uKV0gPT09IFwi6LWkXCIgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCI7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gY2xlYXIgdGhlIGZsYWdzXHJcblx0bmV3X3N0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSBmYWxzZTtcclxuXHRuZXdfc3RhdGUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0c3JjOiBudWxsLFxyXG5cdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IG51bGwsXHJcblx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogbnVsbFxyXG5cdH07XHJcblxyXG5cdGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5zZWFzb24gPVxyXG5cdFx0XHRvbGRfc3RhdGUuc2Vhc29uID09PSBcIuaYpVwiID8gXCLlpI9cIiA6XHJcblx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlpI9cIiA/IFwi56eLXCIgOlxyXG5cdFx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLnp4tcIiA/IFwi5YasXCIgOlxyXG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLnR1cm4gPSAwO1xyXG5cdFx0bmV3X3N0YXRlLmJvYXJkID0gZ2V0SW5pdGlhbEJvYXJkKCk7XHJcblx0XHRyZXR1cm4gbmV3X3N0YXRlO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZnJvbV9ob3B6dW9cIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUudHVybisrO1xyXG5cdFx0Y29uc3QgZGF0YToge1xyXG5cdFx0XHR0eXBlOiBcIkZyb21Ib3AxWnVvMVwiO1xyXG5cdFx0XHRjb2xvcjogQ29sb3I7XHJcblx0XHRcdHByb2Y6IFByb2Zlc3Npb247XHJcblx0XHRcdGRlc3Q6IEFic29sdXRlQ29vcmQ7XHJcblx0XHR9ID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRjb25zdCBjb2xvciA9IHRvSGFuemlDb2xvcihkYXRhLmNvbG9yKTtcclxuXHRcdGNvbnN0IHByb2YgPSB0b0hhbnppUHJvZmVzc2lvbihkYXRhLnByb2YpO1xyXG5cdFx0Y29uc3QgaXNfYXNpZGUgPSBuZXdfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIjtcclxuXHRcdHJlbW92ZV9mcm9tX2hvcDF6dW8xKG5ld19zdGF0ZSwgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSk7XHJcblx0XHRzZXRfdG8obmV3X3N0YXRlLCBkYXRhLmRlc3QsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBkYXRhLmRlc3QsXHJcblx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdHNyYzogaXNfYXNpZGUgPyBcImFfc2lkZV9ob3AxenVvMVwiIDogXCJpYV9zaWRlX2hvcDF6dW8xXCJcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcIm5vcm1hbF9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLnR1cm4rKztcclxuXHRcdGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY0RzdFwiKSB7XHJcblx0XHRcdGlmIChpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChib2R5X2VsZW1lbnQuY2l1cmxfYW5kX2NhcHR1cmUuY2l1cmxfZXZlbnQpKSB7XHJcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XHJcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XHJcblx0XHRcdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBmYWlsZWQgYXR0ZW1wdFxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY1N0ZXBEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3RlcCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3RlcCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZWApO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZW5kX3NlYXNvblwiKSB7XHJcblx0XHRuZXdfc3RhdGUuZGF0Ml9saXN0X29uX2Rpc3BsYXkgPSBudWxsO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZ2FtZV9zZXRcIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRheG90XCIpIHtcclxuXHRcdG5ld19zdGF0ZS5kYXQyX2xpc3Rfb25fZGlzcGxheSA9IHsgdHlwZTogXCJ0YXhvdFwiLCBoYW5kczogYm9keV9lbGVtZW50LmhhbmRzIH07XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0eW1va1wiKSB7XHJcblx0XHRuZXdfc3RhdGUuZGF0Ml9saXN0X29uX2Rpc3BsYXkgPSB7IHR5cGU6IFwidHltb2tcIiwgaGFuZHM6IGJvZHlfZWxlbWVudC5oYW5kcyB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwidGFtX21vdmVcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zcmMpO1xyXG5cdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdCwgcGllY2UpO1xyXG5cdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDnmofjgYzooYzjgZPjgYbjgajjgZfjgabjgYTjgoske2JvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0WzFdfSR7Ym9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3RbMF1944Gr44GvJHttYXliZV9jYXB0dXJlZF9waWVjZS5jb2xvcn0ke21heWJlX2NhcHR1cmVkX3BpZWNlLnByb2Z944GM5pei44Gr44GC44KK44G+44GZYClcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3JjLFxyXG5cdFx0XHRzdGVwcGVkOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3RlcFN0eWxlID09PSBcIk5vU3RlcFwiID8gbnVsbCA6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zdGVwLFxyXG5cdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3QsXHJcblx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5maXJzdERlc3RcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gYm9keV9lbGVtZW50LnR5cGVcIik7XHJcblx0fVxyXG5cdHJldHVybiBuZXdfc3RhdGU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZDogUmVhZG9ubHk8UGFyc2VkPik6IFN0YXRlW10ge1xyXG5cdGlmICghcGFyc2VkLnN0YXJ0aW5nX3BsYXllcnMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihgdG9kbzogY3VycmVudCBpbXBsZW1lbnRhdGlvbiByZXF1aXJlcyDkuIDkvY3oibIuIFxyXG5cdFx0VG8gcmVzb2x2ZSB0aGlzLCBJIHdvdWxkIG5lZWQgdG8gdW5jb21tZW50IFwiYW1iaWd1b3VzX2FscGhhXCIgfCBcImFtYmlndW91c19iZXRhXCJcclxuXHRcdGluIFN0YXRlLndob3NlX3R1cm4g44GX44Gm44CB55qH5Lul5aSW44Gu6aeS44KS5YuV44GL44GX44Gf44KJ44Gd44KM44KS5YWD44Gr6YCG44Gr6L6/44Gj44Gm6Kej5raI44GZ44KL44CB44G/44Gf44GE44Gq44Gu44KS5YWl44KM44KL5b+F6KaB44GM44GC44KL44CCYCk7XHJcblx0fVxyXG5cdGxldCBjdXJyZW50X3N0YXRlID0gZ2V0SW5pdGlhbFN0YXRlKHtcclxuXHRcdGlhX3NpZGU6IHsgcGxheWVyX25hbWVfc2hvcnQ6IFwi5by1XCIsIHBsYXllcl9uYW1lOiBcIuW8teS4iVwiIH0sXHJcblx0XHRhX3NpZGU6IHsgcGxheWVyX25hbWVfc2hvcnQ6IFwi5p2OXCIsIHBsYXllcl9uYW1lOiBcIuadjuWbm1wiIH1cclxuXHR9KTtcclxuXHRjb25zdCBhbnM6IFN0YXRlW10gPSBbY3VycmVudF9zdGF0ZV07XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQucGFyc2VkX2JvZGllcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgbmV4dF9zdGF0ZSA9ICgoKSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5leHRTdGF0ZShjdXJyZW50X3N0YXRlLCBwYXJzZWQucGFyc2VkX2JvZGllc1tpXSwgcGFyc2VkLnN0YXJ0aW5nX3BsYXllcnMuc3BsaXQoXCJcIikgYXMgSGFuemlDb2xvcltdKVxyXG5cdFx0XHR9IGNhdGNoIChlOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtpfeOCueODhuODg+ODl+ebruOBp+OBriR7ZX1gKTtcclxuXHRcdFx0XHRyZXR1cm4gY3VycmVudF9zdGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkoKTtcclxuXHRcdGlmICghbmV4dF9zdGF0ZSkgYnJlYWs7XHJcblx0XHRhbnMucHVzaChuZXh0X3N0YXRlKTtcclxuXHRcdGN1cnJlbnRfc3RhdGUgPSBuZXh0X3N0YXRlO1xyXG5cdH1cclxuXHRyZXR1cm4gYW5zO1xyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCwgQ29sb3IsIFByb2Zlc3Npb24sIFNlYXNvbiB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcbmltcG9ydCB7IEhhbmQgfSBmcm9tIFwiY2Vya2VfaGFuZHNfYW5kX3Njb3JlXCJcclxuXHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbiA9IFwi6Ii5XCIgfCBcIueEoVwiIHwgXCLlhbVcIiB8IFwi5byTXCIgfCBcIui7ilwiIHwgXCLomY5cIiB8IFwi6aasXCIgfCBcIuethlwiIHwgXCLlt6tcIiB8IFwi5bCGXCIgfCBcIueOi1wiO1xyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb25BbmRUYW0gPSBIYW56aVByb2Zlc3Npb24gfCBcIueah1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHByb2ZzOiBIYW56aVByb2Zlc3Npb25BbmRUYW1bXSA9IFtcclxuXHRcIuiIuVwiLCBcIueEoVwiLCBcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIueah1wiXHJcbl07XHJcblxyXG5leHBvcnQgdHlwZSBCb2FyZCA9IHtcclxuXHRLOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0TDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE46IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRUOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0WjogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFg6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRDOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0TTogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFA6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIEhhbnppU2Vhc29uID0gXCLmmKVcIiB8IFwi5aSPXCIgfCBcIueni1wiIHwgXCLlhqxcIjtcclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21IYW56aVNlYXNvbihzOiBIYW56aVNlYXNvbik6IFNlYXNvbiB7XHJcblx0aWYgKHMgPT09IFwi5pilXCIpIHJldHVybiAwO1xyXG5cdGVsc2UgaWYgKHMgPT09IFwi5aSPXCIpIHJldHVybiAxO1xyXG5cdGVsc2UgaWYgKHMgPT09IFwi56eLXCIpIHJldHVybiAyO1xyXG5cdGVsc2UgaWYgKHMgPT09IFwi5YasXCIpIHJldHVybiAzO1xyXG5cdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBVbmV4cGVjdGVkIHNlYXNvbiAke3N9YClcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgUmF0ZSA9IDEgfCAyIHwgNCB8IDggfCAxNiB8IDMyIHwgNjQ7XHJcbmV4cG9ydCB0eXBlIEhhbnppQ29sb3IgPSBcIui1pFwiIHwgXCLpu5JcIjtcclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGFuemlDb2xvcihjOiBDb2xvcik6IEhhbnppQ29sb3Ige1xyXG5cdGlmIChjID09PSBDb2xvci5Lb2sxKSByZXR1cm4gXCLotaRcIjtcclxuXHRyZXR1cm4gXCLpu5JcIjtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdG9IYW56aVByb2Zlc3Npb24ocDogUHJvZmVzc2lvbik6IEhhbnppUHJvZmVzc2lvbiB7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uRGF1MikgcmV0dXJuIFwi6JmOXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uR3VhMikgcmV0dXJuIFwi5byTXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uSW8pIHJldHVybiBcIueOi1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkthdWsyKSByZXR1cm4gXCLlhbVcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LYXVuMSkgcmV0dXJuIFwi6LuKXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS3VhMikgcmV0dXJuIFwi562GXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uTWF1bjEpIHJldHVybiBcIummrFwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLk51YWsxKSByZXR1cm4gXCLoiLlcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5UdWsyKSByZXR1cm4gXCLlt6tcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5VYWkxKSByZXR1cm4gXCLlsIZcIjtcclxuXHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogVW5leHBlY3RlZCBwcm9mZXNzaW9uICR7cH1gKVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYXQyRGlzcGxheSA9IHsgdHlwZTogXCJ0eW1va1wiIHwgXCJ0YXhvdFwiLCBoYW5kczogSGFuZFtdIH0gfCBudWxsO1xyXG5leHBvcnQgdHlwZSBTdGF0ZSA9IHtcclxuXHRzZWFzb246IEhhbnppU2Vhc29uLFxyXG5cdHR1cm46IG51bWJlcixcclxuXHR3aG9zZV90dXJuOiBcImlhX3NpZGVcIiB8IFwiYV9zaWRlXCIgLyp8IFwiYW1iaWd1b3VzX2FscGhhXCIgfCBcImFtYmlndW91c19iZXRhXCIqLyB8IG51bGwsXHJcblx0cmF0ZTogUmF0ZSxcclxuXHRmb2N1czoge1xyXG5cdFx0c3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0XHRzcmM6IEFic29sdXRlQ29vcmQgfCBudWxsIHwgXCJpYV9zaWRlX2hvcDF6dW8xXCIgfCBcImFfc2lkZV9ob3AxenVvMVwiLFxyXG5cdFx0Ly8gfCAgICAgICAgICAgICAgICAgICAgICAgIHwgVGFtMiAgICAgICB8IHdoZW4gY2l1cmwgZmFpbHMgfCB3aGVuIG9rIHxcclxuXHRcdC8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS18XHJcblx0XHQvLyB8IGluaXRpYWxseV9wbGFubmVkX2Rlc3QgfCBmaXJzdERlc3QgIHwgZGVzdCAgICAgICAgICAgICB8IGRlc3QgICAgfFxyXG5cdFx0Ly8gfCBhY3R1YWxfZmluYWxfZGVzdCAgICAgIHwgc2Vjb25kRGVzdCB8IHNyYyAgICAgICAgICAgICAgfCBkZXN0ICAgIHxcclxuXHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsXHJcblx0XHRhY3R1YWxfZmluYWxfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0fSxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBmYWxzZSB9W10sXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHRcdGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuLFxyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiB0cnVlIH1bXSxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdGRhdDJfbGlzdF9vbl9kaXNwbGF5OiBEYXQyRGlzcGxheSxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBwYXJzZUNlcmtlT25saW5lS2lhMUFrMSwgUGFyc2VkIH0gZnJvbSAnY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlcic7XHJcbmltcG9ydCB7IGRyYXdFbXB0eUJvYXJkLCBkcmF3R2FtZVN0YXRlLCBoaWdobGlnaHROdGhLaWExQWsxIH0gZnJvbSAnLi9kcmF3JztcclxuaW1wb3J0IHsgZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZCB9IGZyb20gJy4vc3RhdGUnO1xyXG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBraWFyX2FyayA9XHJcblx0YHvkuIDkvY3oibI66LWk6LWk6LWkfVxyXG575aeL5pmCOjIwMjItMDQtMDFUMTc6MDA6MjQuMjc4Wn1cclxue+e1guaZgjoyMDIyLTA0LTAxVDE3OjU5OjQwLjg1N1p9XHJcbkxF5byTTElMVeapi+S6jCAgICBYQVXomY5aQUlUWeeEoeaSg+ijgVxyXG5MVeW8k0xBSUxBVeapi+S4gOaJi+m7kuW8kyAgICBLQVXlt6tMQVXnhKHmkoPoo4HmiYvotaTlvJNcclxuTknlhbVOReeEoeaSg+ijgSAgICDotaTlvJNOT1xyXG5OQei7ik5J54Sh5pKD6KOBICAgIEtJQeethktBSUtZ5qmL5LiAXHJcbk5F5YW1TklOT+awtOS6jOatpOeEoSAgICBLWeethktJS0XmqYvkuozmiYvotaTlt6tcclxuS0HnrYZLReeEoeaSg+ijgeaJi+i1pOethiAgICBaT+eah1tUVV1aVVxyXG5YReiZjkNJWFXmqYvlm5sgICAgTkFJ5YW1TkFV54Sh5pKD6KOBXHJcbk5F5YW1TklOT+awtOS4ieaJi+i1pOW8kyAgICBUWeiZjlhV54Sh5pKD6KOB5omL6buS6JmOXHJcblRF6JmOWklYVeapi+Wbm+aJi+i1pOiZjiAgICBMQVXlt6tOQVVOQUnnhKHmkoPoo4FcclxuWFXomY5OQUnnhKHmkoPoo4HmiYvpu5Llt6sgICAgVEFV6JmOTkFJ54Sh5pKD6KOB5omL6LWk6JmOXHJcblhJ5YW1WFXnhKHmkoPoo4EgICAgTkFJ6JmOWFXnhKHmkoPoo4HmiYvotaTlhbVcclxuWkHnjotYQUNF54Sh5pKD6KOBICAgIOi1pOW3q05BSVxyXG7pu5LlvJNaTyAgICBaQUnoiLlaT+eEoeaSg+ijgeaJi+m7kuW8k1xyXG5NReW8k0NFWEXmqYvkuIkgICAgWk/oiLlOT+eEoeaSg+ijgeaJi+m7kuWFtVxyXG5DReeOi01JUFXnhKHmkoPoo4EgICAgTkFJ5berWFVQVeapi+S6jOatpOeEoVxyXG5OSei7iktB54Sh5pKD6KOBICAgIE5BSeW3q1hVUFXmqYvkuozmraTnhKFcclxuWEXlvJNYVVpP5qmL5LiA5rC05LiJICAgIE5BSeW3q1hVQ1XmqYvkuoxcclxuWk/lvJNDQUlaSUHmqYvkuInmiYvpu5LnjotcclxuXHJcbuaIlueCuuWcsOW/g+WKoOeOi+WKoOeNo+iAjOaJi+WNgeS6lFxyXG5cclxu57WC5a2jICAgIOaYpee1glxyXG5cclxuTUXlvJNNSU1V5qmL5LiJICAgIE1BVeW8k01BSU1Z5qmL5LqMXHJcbkNJ5YW1Q0XnhKHmkoPoo4EgICAgTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG5NSeWFtU1V54Sh5pKD6KOB5omL6LWk5byTICAgIENBSeWFtUNBVeeEoeaSg+ijgVxyXG5QReW3q0NFQ0nnhKHmkoPoo4EgICAgWk/nmodbWlldWkFJWkFVXHJcblpJ6Ii5WkFJ54Sh5pKD6KOB5omL6buS6Ii5ICAgIFRJQeWwhlRBVVpBSeawtOeEoeatpOeEoVxyXG5UReiZjk5JVFXmqYvnhKHmraTnhKEgICAgVEFV6JmOTkFJQ0nmqYvlm5vmiYvpu5Llt6tcclxuQ0XlhbVDSeeEoeaSg+ijgeaJi+m7kuiZjiAgICBYSUHlsIZYQVVaQUnmsLTkuInmiYvotaToiLlcclxuTUHppqxYSU1P54Sh5pKD6KOBICAgIFhBSeWFtUNBSeeEoeaSg+ijgVxyXG5UReiZjk5JVFXmqYvkuIkgICAg6buS5berVFlcclxuWEnlhbVYVeeEoeaSg+ijgSAgICBUWeW3q0NJWkHmqYvkuozmiYvotaTnjotcclxuXHJcbuaIlueCuueOi+iAjOaJi+S6lFxyXG7ntYLlraMgICAg5aSP57WCXHJcblxyXG5NReW8k01JTVXmqYvkuIkgICAgWEFV6JmOQ0FJWFnmqYvkuoxcclxuQ0nlhbVDReeEoeaSg+ijgSAgICBDQUnlhbVDQVXnhKHmkoPoo4FcclxuUEXlt6tDRUNJ54Sh5pKD6KOBICAgIFhZ6JmOTVVDSeeEoeaSg+ijgeaJi+m7kuW3q1xyXG5DReWFtUNJ54Sh5pKD6KOB5omL6LWk6JmOICAgIOm7kuW3q0NBSVxyXG5NVeW8k01BSUNBSeapi+Wbm+aJi+m7kuW3qyAgICBDSUHou4pDQUnnhKHmkoPoo4HmiYvpu5LlvJNcclxuWEXomY5DSVhV5qmL5LiJICAgIOm7kuW8k0NZXHJcblhJ5YW1WFVDVeeEoeaSg+ijgSAgICBYQUnlhbVYWeeEoeaSg+ijgVxyXG5aT+eah1taVV1aSVpFICAgIFpBSeiIuVpJ54Sh5pKD6KOB5omL6LWk6Ii5XHJcblRF6JmOWknmsLTkuInmiYvpu5LoiLkgICAgWFnlhbVYVeeEoeaSg+ijgeaJi+m7kuiZjlxyXG5aSeiZjlhV54Sh5pKD6KOB5omL6LWk5YW1ICAgIFRBVeiZjk5BSVRZ5qmL5LqMXHJcblhV6JmOVFnnhKHmkoPoo4HmiYvpu5LomY4gICAgVEFJ5YW1VFnnhKHmkoPoo4HmiYvotaTomY5cclxu6buS6Ii5WkkgICAgWkXnmodbWEldWlVcclxu6buS5berWk8gICAgQ0FJ6LuKWk/msLTkuInmiYvpu5Llt6tcclxuWlXnmodbWFVdWklaRSAgICBaT+i7ikNJUEHnhKHmkoPoo4HmiYvotaTnrYZcclxuWknoiLlaSUHnhKHmkoPoo4HmiYvpu5LnjotcclxuXHJcbuaIlueCuueOi+WKoOWQjOiJsueNo+iAjOaJi+WNgVxyXG7ntYLlraMgICAg56eL57WCXHJcblxyXG5cclxu5pif5LiA5ZGoYDtcclxuXHJcbiAgICBjb25zdCBwYXJzZWQ6IFBhcnNlZCA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKGtpYXJfYXJrKTtcclxuICAgIGNvbnN0IHN0YXRlczogU3RhdGVbXSA9IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtpYV9ha1wiKSEudGV4dENvbnRlbnQgPSBraWFyX2FyaztcclxuXHJcbiAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgY29uc3QgdHVybl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fc2xpZGVyXCIpISBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdHVybl9zbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICBjb25zdCBtYXggPSBzdGF0ZXMubGVuZ3RoIC0gMTtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke21heH1gO1xyXG4gICAgdHVybl9zbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzWzBdKTtcclxuICAgIHR1cm5fc2xpZGVyLm9uaW5wdXQgPSB0dXJuX3NsaWRlci5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpO1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX25leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9uZXh0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9uZXh0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpICsgMX1gO1xyXG4gICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1dHRvbl9wcmV2aW91cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX3ByZXZpb3VzXCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9wcmV2aW91cy5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSAtIDF9YDtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpOyAvLyBhdXRvbWF0aWNhbGx5IGNyb3BzIHRoZSB2YWx1ZSBhcHByb3ByaWF0ZWx5XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fZmlyc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9maXJzdFwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fZmlyc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSAwO1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7bmV3X3ZhbHVlfWA7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fbGFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2xhc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgYnV0dG9uX2xhc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBtYXg7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgfVxyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
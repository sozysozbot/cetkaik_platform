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
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_final_dest);
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
    var case3 = "{\u4E00\u4F4D\u8272:\u8D64\u8D64\u8D64}\n{\u59CB\u6642:2022-04-01T17:00:24.278Z}\n{\u7D42\u6642:2022-04-01T17:59:40.857Z}\nLE\u5F13LILU\u6A4B\u4E8C    XAU\u864EZAITY\u7121\u6483\u88C1\nLU\u5F13LAILAU\u6A4B\u4E00\u624B\u9ED2\u5F13    KAU\u5DEBLAU\u7121\u6483\u88C1\u624B\u8D64\u5F13\nNI\u5175NE\u7121\u6483\u88C1    \u8D64\u5F13NO\nNA\u8ECANI\u7121\u6483\u88C1    KIA\u7B46KAIKY\u6A4B\u4E00\nNE\u5175NINO\u6C34\u4E8C\u6B64\u7121    KY\u7B46KIKE\u6A4B\u4E8C\u624B\u8D64\u5DEB\nKA\u7B46KE\u7121\u6483\u88C1\u624B\u8D64\u7B46    ZO\u7687[TU]ZU\nXE\u864ECIXU\u6A4B\u56DB    NAI\u5175NAU\u7121\u6483\u88C1\nNE\u5175NINO\u6C34\u4E09\u624B\u8D64\u5F13    TY\u864EXU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nTE\u864EZIXU\u6A4B\u56DB\u624B\u8D64\u864E    LAU\u5DEBNAUNAI\u7121\u6483\u88C1\nXU\u864ENAI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB    TAU\u864ENAI\u7121\u6483\u88C1\u624B\u8D64\u864E\nXI\u5175XU\u7121\u6483\u88C1    NAI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175\nZA\u738BXACE\u7121\u6483\u88C1    \u8D64\u5DEBNAI\n\u9ED2\u5F13ZO    ZAI\u8239ZO\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nME\u5F13CEXE\u6A4B\u4E09    ZO\u8239NO\u7121\u6483\u88C1\u624B\u9ED2\u5175\nCE\u738BMIPU\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nNI\u8ECAKA\u7121\u6483\u88C1    NAI\u5DEBXUPU\u6A4B\u4E8C\u6B64\u7121\nXE\u5F13XUZO\u6A4B\u4E00\u6C34\u4E09    NAI\u5DEBXUCU\u6A4B\u4E8C\nZO\u5F13CAIZIA\u6A4B\u4E09\u624B\u9ED2\u738B\n\n\u6216\u70BA\u5730\u5FC3\u52A0\u738B\u52A0\u7363\u800C\u624B\u5341\u4E94\n\n\u7D42\u5B63    \u6625\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    MAU\u5F13MAIMY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    MY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nMI\u5175MU\u7121\u6483\u88C1\u624B\u8D64\u5F13    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    ZO\u7687[ZY]ZAIZAU\nZI\u8239ZAI\u7121\u6483\u88C1\u624B\u9ED2\u8239    TIA\u5C06TAUZAI\u6C34\u7121\u6B64\u7121\nTE\u864ENITU\u6A4B\u7121\u6B64\u7121    TAU\u864ENAICI\u6A4B\u56DB\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u9ED2\u864E    XIA\u5C06XAUZAI\u6C34\u4E09\u624B\u8D64\u8239\nMA\u99ACXIMO\u7121\u6483\u88C1    XAI\u5175CAI\u7121\u6483\u88C1\nTE\u864ENITU\u6A4B\u4E09    \u9ED2\u5DEBTY\nXI\u5175XU\u7121\u6483\u88C1    TY\u5DEBCIZA\u6A4B\u4E8C\u624B\u8D64\u738B\n\n\u6216\u70BA\u738B\u800C\u624B\u4E94\n\u7D42\u5B63    \u590F\u7D42\n\nME\u5F13MIMU\u6A4B\u4E09    XAU\u864ECAIXY\u6A4B\u4E8C\nCI\u5175CE\u7121\u6483\u88C1    CAI\u5175CAU\u7121\u6483\u88C1\nPE\u5DEBCECI\u7121\u6483\u88C1    XY\u864EMUCI\u7121\u6483\u88C1\u624B\u9ED2\u5DEB\nCE\u5175CI\u7121\u6483\u88C1\u624B\u8D64\u864E    \u9ED2\u5DEBCAI\nMU\u5F13MAICAI\u6A4B\u56DB\u624B\u9ED2\u5DEB    CIA\u8ECACAI\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nXE\u864ECIXU\u6A4B\u4E09    \u9ED2\u5F13CY\nXI\u5175XUCU\u7121\u6483\u88C1    XAI\u5175XY\u7121\u6483\u88C1\nZO\u7687[ZU]ZIZE    ZAI\u8239ZI\u7121\u6483\u88C1\u624B\u8D64\u8239\nTE\u864EZI\u6C34\u4E09\u624B\u9ED2\u8239    XY\u5175XU\u7121\u6483\u88C1\u624B\u9ED2\u864E\nZI\u864EXU\u7121\u6483\u88C1\u624B\u8D64\u5175    TAU\u864ENAITY\u6A4B\u4E8C\nXU\u864ETY\u7121\u6483\u88C1\u624B\u9ED2\u864E    TAI\u5175TY\u7121\u6483\u88C1\u624B\u8D64\u864E\n\u9ED2\u8239ZI    ZE\u7687[XI]ZU\n\u9ED2\u5DEBZO    CAI\u8ECAZO\u6C34\u4E09\u624B\u9ED2\u5DEB\nZU\u7687[XU]ZIZE    ZO\u8ECACIPA\u7121\u6483\u88C1\u624B\u8D64\u7B46\nZI\u8239ZIA\u7121\u6483\u88C1\u624B\u9ED2\u738B\n\n\u6216\u70BA\u738B\u52A0\u540C\u8272\u7363\u800C\u624B\u5341\n\u7D42\u5B63    \u79CB\u7D42\n\n\n\u661F\u4E00\u5468";
    var parsed = (0, cerke_online_kiaak_parser_1.parseCerkeOnlineKia1Ak1)(case3);
    var states = (0, state_1.getAllStatesFromParsed)(parsed);
    document.getElementById("kia_ak").textContent = case3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQSxtQ0FBbUMsb0NBQW9DLGdCQUFnQjtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZFQUFpQjtBQUN0QyxhQUFhLG1CQUFPLENBQUMsaUVBQVc7QUFDaEMsYUFBYSxtQkFBTyxDQUFDLHlFQUFlOzs7Ozs7Ozs7OztBQ2R2QjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ05hO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDOzs7Ozs7Ozs7OztBQ0RoRDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0IsR0FBRyxhQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0QkFBNEIsYUFBYSxLQUFLO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDLGtCQUFrQixLQUFLOzs7Ozs7Ozs7OztBQ3BCakQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsZ0NBQWdDLEdBQUcsdUJBQXVCLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcscUJBQXFCO0FBQzdKLG1CQUFtQixtQkFBTyxDQUFDLDZFQUFZO0FBQ3ZDLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxpQkFBaUI7QUFDN0I7QUFDQSwrREFBK0QsRUFBRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0ZBQStGLGlCQUFpQjtBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPLGlCQUFpQixnQkFBZ0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsRUFBRTtBQUMzRTtBQUNBLG9CQUFvQiwrQkFBK0I7QUFDbkQ7QUFDQSw0REFBNEQsTUFBTSxxQkFBcUIsRUFBRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRiw2QkFBNkI7QUFDakg7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8sNkJBQTZCLGdCQUFnQjtBQUNwRTtBQUNBLHdEQUF3RCxLQUFLLHFCQUFxQixFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscURBQXFELDhEQUE4RDtBQUNuSDtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLG1CQUFtQjtBQUMvQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsRUFBRTtBQUNuRTtBQUNBLFlBQVksMEJBQTBCO0FBQ3RDO0FBQ0Esb0RBQW9ELEtBQUsscUJBQXFCLEVBQUU7QUFDaEY7QUFDQSxhQUFhO0FBQ2I7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTyx3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUIsaUJBQWlCLE9BQU8saURBQWlEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Qsd0RBQXdEO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNDQUFzQztBQUMxRCxxQkFBcUIsT0FBTyw0REFBNEQ7QUFDeEY7QUFDQTtBQUNBLHFCQUFxQixPQUFPLG9FQUFvRTtBQUNoRztBQUNBO0FBQ0EscUJBQXFCLE9BQU8sbUVBQW1FO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsRUFBRTtBQUN2RDtBQUNBLFlBQVkseUJBQXlCO0FBQ3JDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQ0FBa0M7QUFDbEQ7QUFDQSxvREFBb0QsRUFBRSxzQkFBc0IsTUFBTTtBQUNsRjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTyxtQkFBbUIsU0FBUztBQUNuRDtBQUNBLHdEQUF3RCxLQUFLLHFCQUFxQixFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxpQkFBaUI7QUFDN0I7QUFDQSx1RUFBdUUsRUFBRTtBQUN6RTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsRUFBRTtBQUNsRjtBQUNBLFlBQVksaUNBQWlDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0NBQWdDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7Ozs7Ozs7Ozs7QUN4UVo7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsK0JBQStCO0FBQy9CLDhCQUE4QixtQkFBTyxDQUFDLG1HQUF1QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQiw4QkFBOEI7QUFDOUI7QUFDQSxrQkFBa0I7QUFDbEIsOEJBQThCO0FBQzlCO0FBQ0Esb0RBQW9ELGFBQWE7QUFDakUsOENBQThDLE9BQU8sS0FBSztBQUMxRCw0Q0FBNEMsT0FBTyxLQUFLO0FBQ3hEO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSwrQkFBK0I7Ozs7Ozs7Ozs7O0FDeEJsQjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxjQUFjLEdBQUcsYUFBYSxHQUFHLFlBQVksR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHLGNBQWMsR0FBRyxZQUFZLEdBQUcsWUFBWTtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxlQUFlO0FBQzNCO0FBQ0EsQ0FBQztBQUNELFlBQVk7QUFDWixrQ0FBa0MscUJBQXFCO0FBQ3ZELFlBQVk7QUFDWjtBQUNBLGNBQWM7QUFDZCxtRUFBbUUsbURBQW1EO0FBQ3RILGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZUFBZTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGtCQUFrQixZQUFZO0FBQzlCLGNBQWM7Ozs7Ozs7Ozs7O0FDbEREO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDBCQUEwQixHQUFHLDJCQUEyQixHQUFHLGdDQUFnQyxHQUFHLHVCQUF1QixHQUFHLGtCQUFrQixHQUFHLGlCQUFpQjtBQUM5SixzQkFBc0IsbUJBQU8sQ0FBQyxtRkFBZTtBQUM3QywrQkFBK0IsbUJBQU8sQ0FBQyxxR0FBd0I7QUFDL0Q7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLENBQUM7QUFDRCx1QkFBdUIsdURBQXVELG1CQUFtQjtBQUNqRyxnQ0FBZ0Msb0RBQW9ELGFBQWE7QUFDakcsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFlBQVk7QUFDeEI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCOzs7Ozs7Ozs7OztBQzFHYjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsRUFBRTtBQUN2QztBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxLQUFLO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsbUVBQWtGO0FBRXJFLGNBQU0sR0FBRyxHQUFHLENBQUM7QUFDYixtQkFBVyxHQUFHLEVBQUUsQ0FBQztBQUNqQixrQkFBVSxHQUFHLEVBQUUsQ0FBQztBQUNoQixpQkFBUyxHQUFHLEVBQUUsQ0FBQztBQUU1QixTQUFnQixjQUFjO0lBQzFCLElBQU0sR0FBRyxHQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUF3QixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztJQUVwRixLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx1QkFBdUI7SUFDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENB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QUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEdBQUc7WUFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFF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Q0FBQyxLQUFLLEdBQUcsVUFBRyxTQUFTLENBQUUsQ0FBQztRQUNuQyx3QkFBYSxFQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBdUIsQ0FBQztJQUNqRixXQUFXLENBQUMsT0FBTyxHQUFHO1FBQ2xCLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUN0QixXQUFXLENBQUMsS0FBSyxHQUFHLFVBQUcsU0FBUyxDQUFFLENBQUM7UUFDbkMsd0JBQWEsRUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL290aGVyX3R5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi90YWN0aWNzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi90eXBlX19tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaGFuZGxlX2JvZHlfZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hfbW9uYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L3JlYWRfcGVremVwX251bWVyYWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3R5cGVfX21lc3NhZ2VcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdGFjdGljc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdGhlcl90eXBlc1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qXHJcbiAqIFRoZW9yZXRpY2FsbHkgc3BlYWtpbmcsIGl0IGlzIG5lY2Vzc2FyeSB0byBkaXN0aW5ndWlzaCB4MzIgYW5kIHg2NFxyXG4gKiBiZWNhdXNlIGl0IGlzIHBvc3NpYmxlIHRvIHNjb3JlIDEgcG9pbnQgKDMrMy01KS5cclxuICogTm90IHRoYXQgaXQgd2lsbCBldmVyIGJlIG9mIHVzZSBpbiBhbnkgcmVhbCBzaXR1YXRpb24uXHJcbiAqLyBcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5Qcm9mZXNzaW9uID0gZXhwb3J0cy5Db2xvciA9IHZvaWQgMDtcclxudmFyIENvbG9yO1xyXG4oZnVuY3Rpb24gKENvbG9yKSB7XHJcbiAgICBDb2xvcltDb2xvcltcIktvazFcIl0gPSAwXSA9IFwiS29rMVwiO1xyXG4gICAgQ29sb3JbQ29sb3JbXCJIdW9rMlwiXSA9IDFdID0gXCJIdW9rMlwiO1xyXG59KShDb2xvciA9IGV4cG9ydHMuQ29sb3IgfHwgKGV4cG9ydHMuQ29sb3IgPSB7fSkpO1xyXG52YXIgUHJvZmVzc2lvbjtcclxuKGZ1bmN0aW9uIChQcm9mZXNzaW9uKSB7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJOdWFrMVwiXSA9IDBdID0gXCJOdWFrMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS2F1azJcIl0gPSAxXSA9IFwiS2F1azJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkd1YTJcIl0gPSAyXSA9IFwiR3VhMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS2F1bjFcIl0gPSAzXSA9IFwiS2F1bjFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkRhdTJcIl0gPSA0XSA9IFwiRGF1MlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiTWF1bjFcIl0gPSA1XSA9IFwiTWF1bjFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkt1YTJcIl0gPSA2XSA9IFwiS3VhMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiVHVrMlwiXSA9IDddID0gXCJUdWsyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJVYWkxXCJdID0gOF0gPSBcIlVhaTFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIklvXCJdID0gOV0gPSBcIklvXCI7XHJcbn0pKFByb2Zlc3Npb24gPSBleHBvcnRzLlByb2Zlc3Npb24gfHwgKGV4cG9ydHMuUHJvZmVzc2lvbiA9IHt9KSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBleHBvcnRzLmhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyA9IGV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQgPSBleHBvcnRzLmhhbmRsZVlha3UgPSBleHBvcnRzLmhhbmRsZVRhbU1vdmUgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoZXJzXzEgPSByZXF1aXJlKFwiLi9tdW5jaGVyc1wiKTtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5mdW5jdGlvbiBoYW5kbGVUYW1Nb3ZlKHMpIHtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmIChyZXN0LmNoYXJBdCgwKSAhPT0gXCLnmodcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGFtMiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIC8vIHRoZSBmb3JtYXQgaXMgZWl0aGVyOlxyXG4gICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAvLyAtIFRZ55qHVEFJW1RBVV1aQVVcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoZmlyc3REZXN0LCBuZXh0KSA9PiAoeyBmaXJzdERlc3QsIG5leHQgfSksIG11bmNoZXJzXzEubXVuY2hCcmFja2V0ZWRDb29yZCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICh0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCkge1xyXG4gICAgICAgIC8vIGVpdGhlcjpcclxuICAgICAgICAvLyAtIFpV55qHW1RPXVRVXHJcbiAgICAgICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgZmlyc3REZXN0LCBuZXh0IH0sIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldDtcclxuICAgICAgICBpZiAocmVzdDIgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBTdHlsZTogXCJOb1N0ZXBcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdDogbmV4dFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdHJ5X211bmNoX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgICAgICAgICBpZiAoIXRyeV9tdW5jaF9jb29yZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgeyBhbnM6IHNlY29uZERlc3QsIHJlc3Q6IGVtcHR5IH0gPSB0cnlfbXVuY2hfY29vcmQ7XHJcbiAgICAgICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7ZW1wdHl9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHsgdHlwZTogXCJUYW1Nb3ZlXCIsIHN0ZXBTdHlsZTogXCJTdGVwc0R1cmluZ0xhdHRlclwiLCBzcmMsIGZpcnN0RGVzdCwgc3RlcDogbmV4dCwgc2Vjb25kRGVzdCB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICAgICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QpID0+ICh7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9KSwgbXVuY2hlcnNfMS5tdW5jaENvb3JkLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICAgICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9LCByZXN0OiBlbXB0eSB9ID0gbXVuY2g7XHJcbiAgICAgICAgaWYgKGVtcHR5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJUYW1Nb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdGb3JtZXJcIixcclxuICAgICAgICAgICAgICAgIHNyYywgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVGFtTW92ZSA9IGhhbmRsZVRhbU1vdmU7XHJcbmZ1bmN0aW9uIGhhbmRsZVlha3Uocykge1xyXG4gICAgLy8g5oiW54K6546L5Yqg542jXHJcbiAgICAvLyDmiJbngrrnjovliqDnjaPogIzmiYvlhatcclxuICAgIGNvbnN0IGhhbmRzU2VwQnlBdCA9ICgwLCBtdW5jaF9tb25hZF8xLnNlcEJ5MSkoeyBwOiBtdW5jaGVyc18xLm11bmNoSGFuZCwgc2VwOiAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5YqgXCIpIH0pO1xyXG4gICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBoYW5kcykgPT4gaGFuZHMsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiJbngrpcIiksIGhhbmRzU2VwQnlBdCkocyk7XHJcbiAgICBpZiAoIW11bmNoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogaGFuZHMsIHJlc3QgfSA9IG11bmNoO1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiBcInR5bW9rXCIsIGhhbmRzIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBtdW5jaDIgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBudW0pID0+IG51bSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuiAjOaJi1wiKSwgbXVuY2hlcnNfMS5tdW5jaFBla3plcE51bWVyYWwpKHJlc3QpO1xyXG4gICAgaWYgKCFtdW5jaDIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzY29yZSwgcmVzdDogcmVzdDIgfSA9IG11bmNoMjtcclxuICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgdHlwZTogXCJ0YXhvdFwiLCBoYW5kcywgc2NvcmUgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZVlha3UgPSBoYW5kbGVZYWt1O1xyXG5jb25zdCBtdW5jaFdhdGVyRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuawtFwiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLnhKHmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIDmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuozmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIlcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLlm5tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkupRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gbXVuY2hXYXRlckV2ZW50O1xyXG5jb25zdCBtdW5jaENpdXJsRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIueEoeaSg+ijgVwiKSkge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm5vX2NpdXJsX2V2ZW50XCIgfSwgcmVzdDogcy5zbGljZSgzKSB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCB3YXRlcl9lbnRyeV9jaXVybDogYW5zIH0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmqYtcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBjb25zdCBzdGVwcGluZ19jaXVybCA9IHRbMF0gPT09IFwi54ShXCIgPyAwIDpcclxuICAgICAgICAgICAgdFswXSA9PT0gXCLkuIBcIiA/IDEgOlxyXG4gICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuoxcIiA/IDIgOlxyXG4gICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LiJXCIgPyAzIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLlm5tcIiA/IDQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkupRcIiA/IDUgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGNoYXJhY3RlciBmb3VuZCBhZnRlciDmqYtcIik7IH0pKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHQuc2xpY2UoMSk7XHJcbiAgICAgICAgLy8gRWl0aGVyIG5vdGhpbmcsIOatpOeEoSwgb3IgbXVuY2hXYXRlckV2ZW50XHJcbiAgICAgICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShyZXN0KTtcclxuICAgICAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiB3YXRlcl9lbnRyeV9jaXVybCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwiaGFzX3dhdGVyX2VudHJ5XCIsIHN0ZXBwaW5nX2NpdXJsLCB3YXRlcl9lbnRyeV9jaXVybCB9LCByZXN0OiByZXN0MiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXN0LnN0YXJ0c1dpdGgoXCLmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwib25seV9zdGVwcGluZ1wiLCBzdGVwcGluZ19jaXVybCwgaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M6IGZhbHNlIH0sIHJlc3Q6IFwiXCIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiB0cnVlIH0sIHJlc3QgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBtdW5jaENpdXJsRXZlbnQ7XHJcbmZ1bmN0aW9uIGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhzKSB7XHJcbiAgICBjb25zdCB0cnlfY2l1cmxfZXZlbnQgPSAoMCwgZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQpKHMpO1xyXG4gICAgaWYgKCF0cnlfY2l1cmxfZXZlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgY2l1cmwgZXZlbnQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBjaXVybF9ldmVudCwgcmVzdCB9ID0gdHJ5X2NpdXJsX2V2ZW50O1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCB9O1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb3B0aW9uYWxfcGllY2VfY2FwdHVyZSA9ICgwLCBtdW5jaGVyc18xLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCkocmVzdCk7XHJcbiAgICBpZiAob3B0aW9uYWxfcGllY2VfY2FwdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBwaWVjZV9jYXB0dXJlLCByZXN0OiByZXN0MiB9ID0gb3B0aW9uYWxfcGllY2VfY2FwdHVyZTtcclxuICAgICAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFpbGluZyBwYXJhbWV0ZXIgXFxgJHtzfVxcYCBoYXMgc29tZSBleHRyYSBcXGAke3Jlc3QyfVxcYCBhdCB0aGUgZW5kYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50LCBwaWVjZV9jYXB0dXJlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgdHJhaWxpbmcgcGFyYW1ldGVyOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnM7XHJcbmZ1bmN0aW9uIGhhbmRsZUJvZHlFbGVtZW50KHMpIHtcclxuICAgIGlmIChzID09PSBcIuaYpee1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAwIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlpI/ntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi56eL57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWGrOe1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAzIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLntYLlraNcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImVuZF9zZWFzb25cIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5pif5LiA5ZGoXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJnYW1lX3NldFwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueCulwiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVZYWt1KHMpO1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLnmodcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlVGFtTW92ZShzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9mcm9tX2hvcHp1byA9ICgwLCBtdW5jaGVyc18xLm11bmNoRnJvbUhvcFp1bykocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX2Zyb21faG9wenVvKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgY29sb3IsIHByb2YsIGRlc3QgfSwgcmVzdCB9ID0gdHJ5X211bmNoX2Zyb21faG9wenVvO1xyXG4gICAgICAgIGlmIChyZXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJmcm9tX2hvcHp1b1wiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkZyb21Ib3AxWnVvMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2YsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmICghW1wi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi6Ii5XCIsIFwi54mHXCJdLmluY2x1ZGVzKHJlc3QuY2hhckF0KDApKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgYSBwcm9mZXNzaW9uIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoXzJuZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfMm5kX2Nvb3JkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0aGUgc2Vjb25kIGNvb3JkaW5hdGUgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2Vjb25kX2Nvb3JkLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoXzJuZF9jb29yZDtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF8zcmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8zcmRfY29vcmQpIHtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Mik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogc2Vjb25kX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB0aGlyZF9jb29yZCwgcmVzdDogcmVzdDMgfSA9IHRyeV9tdW5jaF8zcmRfY29vcmQ7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjU3RlcERzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBzZWNvbmRfY29vcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogdGhpcmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBoYW5kbGVCb2R5RWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHZvaWQgMDtcclxuY29uc3QgaGFuZGxlX2JvZHlfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vaGFuZGxlX2JvZHlfZWxlbWVudFwiKTtcclxuLy8gVmVyeSBwcmltaXRpdmUgcGFyc2VyIHRoYXQgbmV2ZXIgaGFuZGxlcyBhbGwgdGhlIGVkZ2UgY2FzZXNcclxuZnVuY3Rpb24gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEocykge1xyXG4gICAgY29uc3QgbGluZXMgPSBzLnRyaW0oKS5zcGxpdChcIlxcblwiKS5tYXAobCA9PiBsLnRyaW0oKSk7XHJcbiAgICBjb25zdCBpbml0aWFsX2xpbmUgPSBsaW5lc1swXTtcclxuICAgIGlmIChpbml0aWFsX2xpbmUgPT09IHVuZGVmaW5lZCAvKiBTaW5jZSB3ZSB1c2VkIC5zcGxpdCgpLCB0aGlzIGFjdHVhbGx5IGNhbid0IGhhcHBlbiAqLyB8fCBpbml0aWFsX2xpbmUgPT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgYLjgorjgb7jgZvjgpNcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgvXlxce+Wni+aZgjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75aeL5pmCOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZnjgILjgZPjgozjga8yMDIx5bm0MTHmnIjmnKvjgqLjg4Pjg5fjg4fjg7zjg4jku6XliY3jga7mo4vorZzjgafjgYLjgorjgIHjgb7jgaDlr77lv5zjgafjgY3jgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghL15cXHvkuIDkvY3oibI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+S4gOS9jeiJsjog44Gn5aeL44G+44Gj44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRpbmdfcGxheWVycyA9IGluaXRpYWxfbGluZS5tYXRjaCgvXlxce+S4gOS9jeiJsjooW+m7kui1pF0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdfdGltZSA9IGxpbmVzWzFdPy5tYXRjaCgvXlxce+Wni+aZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBlbmRpbmdfdGltZSA9IGxpbmVzWzJdPy5tYXRjaCgvXlxce+e1guaZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBib2RpZXMgPSBsaW5lcy5zbGljZSgzKS5mbGF0TWFwKGxpbmUgPT4gbGluZS5zcGxpdCgvW1xcc1xcbl0vZykpLmZpbHRlcihhID0+IGEgIT09IFwiXCIpO1xyXG4gICAgY29uc3QgcGFyc2VkX2JvZGllcyA9IGJvZGllcy5tYXAoaGFuZGxlX2JvZHlfZWxlbWVudF8xLmhhbmRsZUJvZHlFbGVtZW50KTtcclxuICAgIHJldHVybiB7IHN0YXJ0aW5nX3BsYXllcnMsIHN0YXJ0aW5nX3RpbWUsIGVuZGluZ190aW1lLCBwYXJzZWRfYm9kaWVzIH07XHJcbn1cclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnNlcEJ5MSA9IGV4cG9ydHMubWFueTEgPSBleHBvcnRzLm1hbnkgPSBleHBvcnRzLmxpZnRNMyA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5saWZ0TTIgPSBleHBvcnRzLnB1cmUgPSBleHBvcnRzLmJpbmQgPSB2b2lkIDA7XHJcbi8vIG1vbmFkXHJcbmNvbnN0IGJpbmQgPSAobWEsIGNhbGxiYWNrKSA9PiAoKGlucHV0KSA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIHJldHVybiBjYWxsYmFjayhhKShyZXN0KTtcclxufSk7XHJcbmV4cG9ydHMuYmluZCA9IGJpbmQ7XHJcbmNvbnN0IHB1cmUgPSAoYSkgPT4gKGlucHV0KSA9PiAoeyBhbnM6IGEsIHJlc3Q6IGlucHV0IH0pO1xyXG5leHBvcnRzLnB1cmUgPSBwdXJlO1xyXG5jb25zdCBsaWZ0TTIgPSAoZiwgbWEsIG1iKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIpKSkpO1xyXG5leHBvcnRzLmxpZnRNMiA9IGxpZnRNMjtcclxuY29uc3Qgc3RyaW5nID0gKHByZWZpeCkgPT4gKGlucHV0KSA9PiBpbnB1dC5zdGFydHNXaXRoKHByZWZpeCkgPyB7IGFuczogdW5kZWZpbmVkLCByZXN0OiBpbnB1dC5zbGljZShwcmVmaXgubGVuZ3RoKSB9IDogbnVsbDtcclxuZXhwb3J0cy5zdHJpbmcgPSBzdHJpbmc7XHJcbmNvbnN0IGxpZnRNMyA9IChmLCBtYSwgbWIsIG1jKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYywgYyA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIsIGMpKSkpKTtcclxuZXhwb3J0cy5saWZ0TTMgPSBsaWZ0TTM7XHJcbmNvbnN0IG1hbnkgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgbGV0IHJlc3QgPSBpbnB1dDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55ID0gbWFueTtcclxuY29uc3QgbWFueTEgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGxldCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIGNvbnN0IGFucyA9IFthXTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55MSA9IG1hbnkxO1xyXG5jb25zdCBzZXBCeTEgPSAoeyBwOiBtYSwgc2VwIH0pID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKCgwLCBleHBvcnRzLm1hbnkpKCgwLCBleHBvcnRzLmJpbmQpKHNlcCwgKF8pID0+IG1hKSksIGFzID0+ICgwLCBleHBvcnRzLnB1cmUpKFthLCAuLi5hc10pKSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gc2VwQnkxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IGV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9IGV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSBleHBvcnRzLm11bmNoQ29vcmQgPSBleHBvcnRzLm11bmNoSGFuZCA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5jb25zdCByZWFkX3Bla3plcF9udW1lcmFsc18xID0gcmVxdWlyZShcIi4vcmVhZF9wZWt6ZXBfbnVtZXJhbHNcIik7XHJcbmNvbnN0IG11bmNoQ29sb3IgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui1pFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFByb2Zlc3Npb24gPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiIuVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5YW1XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlvJNcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui7ilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6JmOXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLppqxcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuethlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA2LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5berXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDcsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlsIZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA5LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hDb2x1bW4gPSAocykgPT4ge1xyXG4gICAgY29uc3QgY29scyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICBpZiAocy5jaGFyQXQoMCkgPT09IGNvbCkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGNvbCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFJvdyA9IChzKSA9PiB7XHJcbiAgICBjb25zdCByb3dzID0gW1wiQUlcIiwgXCJBVVwiLCBcIklBXCIgLyogaGFuZGxlIHRoZSBsb25nZXIgb25lcyBmaXJzdCAqLywgXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChyb3cpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogcm93LCByZXN0OiBzLnNsaWNlKHJvdy5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoSGFuZCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kcyA9IFtcIueOi1wiLCBcIueNo1wiLCBcIuWQjOiJsueNo1wiLCBcIuWcsOW/g1wiLCBcIuWQjOiJsuWcsOW/g1wiLCBcIummrOW8k+WFtVwiLCBcIuWQjOiJsummrOW8k+WFtVwiLFxyXG4gICAgICAgIFwi5Yqp5Y+LXCIsIFwi5ZCM6Imy5Yqp5Y+LXCIsIFwi5oim6ZuGXCIsIFwi5ZCM6Imy5oim6ZuGXCIsIFwi6KGM6KGMXCIsIFwi5ZCM6Imy6KGM6KGMXCIsIFwi562G5YW154Sh5YK+XCIsIFwi5ZCM6Imy562G5YW154Sh5YK+XCIsXHJcbiAgICAgICAgXCLpl4fmiKbkuYvpm4ZcIiwgXCLlkIzoibLpl4fmiKbkuYvpm4ZcIiwgXCLnhKHmipfooYzlh6ZcIiwgXCLlkIzoibLnhKHmipfooYzlh6ZcIl07XHJcbiAgICBmb3IgKGNvbnN0IGhhbmQgb2YgaGFuZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGhhbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogaGFuZCwgcmVzdDogcy5zbGljZShoYW5kLmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0cy5tdW5jaEhhbmQgPSBtdW5jaEhhbmQ7XHJcbmV4cG9ydHMubXVuY2hDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGNvbCwgcm93KSA9PiB7XHJcbiAgICBjb25zdCBjb29yZCA9IFtyb3csIGNvbF07XHJcbiAgICByZXR1cm4gY29vcmQ7XHJcbn0sIG11bmNoQ29sdW1uLCBtdW5jaFJvdyk7XHJcbmV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoY29sb3IsIHByb2YsIGRlc3QpID0+ICh7IGNvbG9yLCBwcm9mLCBkZXN0IH0pLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24sIGV4cG9ydHMubXVuY2hDb29yZCk7XHJcbmV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXywgY29sb3IsIHByb2YpID0+ICh7IGNvbG9yLCBwcm9mIH0pLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5omLXCIpLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24pO1xyXG5leHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfMSwgY29vcmQsIF8yKSA9PiBjb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIltcIiksIGV4cG9ydHMubXVuY2hDb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIl1cIikpO1xyXG5jb25zdCBtdW5jaERpZ2l0TGluemtsYXIgPSAocykgPT4ge1xyXG4gICAgY29uc3QgZHMgPSBbXCLnhKFcIiwgXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIiwgXCLljYFcIiwgXCLkuItcIiwgXCLnmb5cIl07XHJcbiAgICBmb3IgKGNvbnN0IGQgb2YgZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogZCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFBla3plcE51bWVyYWwgPSAocykgPT4ge1xyXG4gICAgY29uc3QgdDEgPSAoMCwgbXVuY2hfbW9uYWRfMS5tYW55MSkobXVuY2hEaWdpdExpbnprbGFyKShzKTtcclxuICAgIGlmICghdDEpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdDE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG51bSA9ICgwLCByZWFkX3Bla3plcF9udW1lcmFsc18xLmZyb21EaWdpdHNMaW56a2xhcikoYW5zKTtcclxuICAgICAgICByZXR1cm4geyBhbnM6IG51bSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBtdW5jaFBla3plcE51bWVyYWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXIoaSkge1xyXG4gICAgaWYgKGlbMF0gPT09IFwi54ShXCIgJiYgaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuS4i1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIC1mcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnmb5cIikge1xyXG4gICAgICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTAwICsgZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5kZXgxMDAgPSBpLmluZGV4T2YoXCLnmb5cIik7XHJcbiAgICBpZiAoaW5kZXgxMDAgIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgaHVuZHJlZHMgPSBpLnNsaWNlKDAsIGluZGV4MTAwKTtcclxuICAgICAgICBjb25zdCBvbmVzID0gaS5zbGljZShpbmRleDEwMCArIDEpO1xyXG4gICAgICAgIHJldHVybiAxMDAgKiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaHVuZHJlZHMpICsgZnJvbURpZ2l0c0xpbnprbGFyU3ViKG9uZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVsxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCAqIHBhcnNlVW5pdChpWzBdKSArIHBhcnNlVW5pdChpWzJdKTtcclxuICAgIH1cclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSBcIiR7aX1cIiBhcyBhIHBla3plcCBudW1lcmFsYCk7XHJcbn1cclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSBmcm9tRGlnaXRzTGluemtsYXI7XHJcbmZ1bmN0aW9uIHBhcnNlVW5pdChvbmVzKSB7XHJcbiAgICBpZiAob25lcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIBcIikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4iVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlm5tcIikge1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDY7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuINcIikge1xyXG4gICAgICAgIHJldHVybiA3O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICByZXR1cm4gODtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS5nVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIFwiJHtvbmVzfVwiIHdoaWxlIHRyeWluZyB0byBwYXJzZSBwZWt6ZXAgbnVtZXJhbHNgKTtcclxufVxyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaSkge1xyXG4gICAgaWYgKGkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpW2kubGVuZ3RoIC0gMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pICogMTA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBhID0gaVswXTtcclxuICAgICAgICBjb25zdCBiID0gaVsxXTtcclxuICAgICAgICBpZiAoYiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSkgKiAxMCArIHBhcnNlVW5pdChiKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBOb25UYW1QaWVjZSwgU3RhdGUsIEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgcHJvZnMsIEJvYXJkIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBoZWlnaHQgPSAzODc7XHJcbmV4cG9ydCBjb25zdCBsZWZ0X21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgdG9wX21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgY2VsbF9zaXplID0gNDM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0VtcHR5Qm9hcmQoKSB7XHJcbiAgICBjb25zdCBjdHggPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdlwiKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgLy8g55qH5YemXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjcsIDU0LjUlLCA4MS4xJSlcIlxyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcblxyXG4gICAgLy8g55qH5rC0XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjEzLCAzMy42JSwgNzguOSUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgLy8g55qH5bGxXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMTI5LCAzOC41JSwgNDUuNCUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDk5LCA5OSwgOTkpJztcclxuICAgIGN0eC5saW5lV2lkdGggPSAwLjAzICogaGVpZ2h0IC8gOTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA5OyBpKyspIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIDAsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGhlaWdodCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAwKTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwwLDApXCI7XHJcbiAgICBjb25zdCBjb2x1bW5zID0gW1wiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCIsIFwiQUlcIiwgXCJBVVwiLCBcIklBXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgbGVmdF9tYXJnaW4gKyBoZWlnaHQgKyAxMCwgdG9wX21hcmdpbiArIDMwICsgY2VsbF9zaXplICogaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm93cyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCBsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSwgdG9wX21hcmdpbiAtIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgLWxlZnRfbWFyZ2luICsgMTAsIC0odG9wX21hcmdpbiArIDE1ICsgY2VsbF9zaXplICogaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCAtKGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpKSwgLSh0b3BfbWFyZ2luICsgaGVpZ2h0ICsgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRfdG9wX2xlZnQoY29vcmQ6IEFic29sdXRlQ29vcmQpIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjb29yZFsxXV07XHJcbiAgICBjb25zdCByb3cgPSB7XHJcbiAgICAgICAgSUE6IDgsXHJcbiAgICAgICAgQVU6IDcsXHJcbiAgICAgICAgQUk6IDYsIFk6IDUsIE86IDQsIFU6IDMsIEk6IDIsIEU6IDEsIEE6IDBcclxuICAgIH1bY29vcmRbMF1dO1xyXG4gICAgY29uc3QgbGVmdCA9IGxlZnRfbWFyZ2luICsgY2VsbF9zaXplICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgY2VsbF9zaXplICogKHJvdyAtIDAuNSk7XHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9jdXNQbGFubmVkRGVzdEhUTUwoZm9jdXNfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3BsYW5uZWRfZGVzdCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3BsYW5uZWRfZGVzdCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAyNSU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNzgsIDI1NSwgMjU1KVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzU3RlcHBlZEhUTUwoZm9jdXNfc3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zdGVwcGVkKSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfc3RlcHBlZCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Rm9jdXNTcmMoZm9jdXNfc3JjOiBBYnNvbHV0ZUNvb3JkIHwgXCJhX3NpZGVfaG9wMXp1bzFcIiB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3NyYyB8fCBmb2N1c19zcmMgPT09IFwiYV9zaWRlX2hvcDF6dW8xXCIgfHwgZm9jdXNfc3JjID09PSBcImlhX3NpZGVfaG9wMXp1bzFcIikgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3NyYyk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zKVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZnVuY3Rpb24gUGllY2VzT25Cb2FyZEhUTUwoYm9hcmQ6IEJvYXJkLCBmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGNvbnN0IGNsbSBpbiBib2FyZCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcncgaW4gYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc19mb2N1c2VkID0gZm9jdXMgPyBmb2N1c1sxXSA9PT0gY2xtICYmIGZvY3VzWzBdID09PSBydyA6IGZhbHNlO1xyXG4gICAgICAgICAgICBhbnMgKz0gUG9zaXRpb25lZFBpZWNlT25Cb2FyZEhUTUwoXHJcbiAgICAgICAgICAgICAgICBjbG0gYXMgQWJzb2x1dGVDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBydyBhcyBBYnNvbHV0ZVJvdyxcclxuICAgICAgICAgICAgICAgIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0hW3J3IGFzIEFic29sdXRlUm93XSEsXHJcbiAgICAgICAgICAgICAgICBpc19mb2N1c2VkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBIb3AxWnVvMUhUTUwocGllY2VzOiBOb25UYW1QaWVjZVtdLCBpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbikge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YgfSA9IHBpZWNlc1tpXTtcclxuICAgICAgICBjb25zdCByYWQgPSAxOCAvIDAuMjY7XHJcbiAgICAgICAgYW5zICs9IGA8bGk+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAyM3B4OyBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJHtjZWxsX3NpemV9cHg7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KTsgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDsgXHJcbiAgICAgICAgICAgIFwiPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAke2lzX25ld2x5X2FjcXVpcmVkICYmIGkgPT0gcGllY2VzLmxlbmd0aCAtIDEgPyBgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgNjAsIDUwLCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgXCI+PC9kaXY+YCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgZmFsc2UpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2xpPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0dhbWVTdGF0ZShTVEFURTogU3RhdGUpIHtcclxuICAgIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QuYWRkKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5hZGQoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmFfc2lkZS5ob3AxenVvMSwgU1RBVEUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEsIFNUQVRFLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IEZvY3VzU3RlcHBlZEhUTUwoU1RBVEUuZm9jdXMuc3RlcHBlZCkgK1xyXG4gICAgICAgIGRyYXdGb2N1c1NyYyhTVEFURS5mb2N1cy5zcmMpICtcclxuICAgICAgICBGb2N1c1BsYW5uZWREZXN0SFRNTChTVEFURS5mb2N1cy5pbml0aWFsbHlfcGxhbm5lZF9kZXN0KSArXHJcbiAgICAgICAgUGllY2VzT25Cb2FyZEhUTUwoU1RBVEUuYm9hcmQsIFNUQVRFLmZvY3VzLmFjdHVhbF9maW5hbF9kZXN0KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIE5vcm1hbFBpZWNlSFRNTChjb2xvcjogXCLpu5JcIiB8IFwi6LWkXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeCA9IHByb2ZzLmluZGV4T2YocHJvZikgKiAtMTAwIC0gMjc7XHJcbiAgICBjb25zdCB5ID0gaXNfYm9sZCA/IDAgOiAtMjc3O1xyXG4gICAgY29uc3QgY29sb3JfcGF0aCA9IHtcclxuICAgICAgICBcIum7klwiOiBcIuOCtOOCt+ODg+OCr+mnklwiLFxyXG4gICAgICAgIFwi6LWkXCI6IFwi44K044K344OD44Kv6aeSX+i1pFwiLFxyXG4gICAgfVtjb2xvcl07XHJcbiAgICByZXR1cm4gYDxkaXZcclxuICAgIHN0eWxlPVwid2lkdGg6IDg3cHg7IGhlaWdodDogODdweDsgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAke3h9cHg7IGJhY2tncm91bmQtcG9zaXRpb24teTogJHt5fXB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtjb2xvcl9wYXRofS5zdmcpOyBcIj5cclxuPC9kaXY+YFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gUG9zaXRpb25lZFBpZWNlT25Cb2FyZEhUTUwoY2xtOiBBYnNvbHV0ZUNvbHVtbiwgcnc6IEFic29sdXRlUm93LCBwaWVjZTogTm9uVGFtUGllY2UgfCBcIueah1wiLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZ2V0X3RvcF9sZWZ0KFtydywgY2xtXSk7XHJcbiAgICBpZiAocGllY2UgPT09IFwi55qHXCIpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke1wicm90YXRlKDkwZGVnKVwifVwiPlxyXG4gICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChcIum7klwiLCBcIueah1wiLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9ID0gcGllY2U7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtpc19hc2lkZSA/IFwicm90YXRlKDE4MGRlZylcIiA6IFwiXCJ9XCI+XHJcbiAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKGNvbG9yLCBwcm9mLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCwgUGFyc2VkLCBDaXVybEV2ZW50IH0gZnJvbSBcImNlcmtlX29ubGluZV9raWFha19wYXJzZXJcIjtcclxuaW1wb3J0IHsgQm9hcmQsIGZyb21IYW56aVNlYXNvbiwgSGFuemlDb2xvciwgSGFuemlQcm9mZXNzaW9uLCBOb25UYW1QaWVjZSwgU3RhdGUsIHRvSGFuemlDb2xvciwgdG9IYW56aVByb2Zlc3Npb24gfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBBYnNvbHV0ZUNvb3JkLCBDb2xvciwgUHJvZmVzc2lvbiB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsQm9hcmQoKTogQm9hcmQge1xyXG5cdHJldHVybiB7XHJcblx0XHRLOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE46IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0VDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFo6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0TzogXCLnmodcIixcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0WDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEM6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TToge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFA6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShvOiB7XHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmdcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0fSxcclxufSk6IFN0YXRlIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2Vhc29uOiBcIuaYpVwiLFxyXG5cdFx0dHVybjogMCxcclxuXHRcdHJhdGU6IDEsXHJcblx0XHR3aG9zZV90dXJuOiBudWxsLFxyXG5cdFx0Zm9jdXM6IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IG51bGwsXHJcblx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdHNyYzogbnVsbCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogbnVsbFxyXG5cdFx0fSxcclxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XHJcblx0Y29uc3QgcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdGlmICghcGllY2UpIHsgdGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTsgfVxyXG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdHJldHVybiBwaWVjZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X3RvKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQsIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIpOiBOb25UYW1QaWVjZSB8IHVuZGVmaW5lZCB7XHJcblx0aWYgKHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0pIHtcclxuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRcdGlmIChjYXB0dXJlZF9waWVjZSA9PT0gXCLnmodcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+eah+OBjOaXouOBq+OBguOCiuOBvuOBmWApO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIGNhcHR1cmVkX3BpZWNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XHJcblx0aWYgKHBpZWNlLmlzX2FzaWRlKSB7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiBmYWxzZSB9KTtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IHRydWUgfSk7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb21faG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBvOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH0pIHtcclxuXHRjb25zdCBpbmRleCA9IHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLmZpbmRJbmRleChrID0+IGsuY29sb3IgPT09IG8uY29sb3IgJiYgay5wcm9mID09PSBvLnByb2YpO1xyXG5cdGlmIChpbmRleCA9PT0gLTEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDmjIHjgaHpp5Ljgaske28uY29sb3J9JHtvLnByb2Z944GM44GC44KK44G+44Gb44KTYCk7XHJcblx0fVxyXG5cdHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLnNwbGljZShpbmRleCwgMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGNpdXJsX2V2ZW50OiBDaXVybEV2ZW50KTogYm9vbGVhbiB7XHJcblx0aWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwibm9fY2l1cmxfZXZlbnRcIikge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcIm9ubHlfc3RlcHBpbmdcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LmluZmFmdGVyc3RlcF9zdWNjZXNzO1xyXG5cdH0gZWxzZSBpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJoYXNfd2F0ZXJfZW50cnlcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LndhdGVyX2VudHJ5X2NpdXJsID49IDM7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gY2l1cmxfZXZlbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gY2l1cmxfZXZlbnQudHlwZVwiKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRTdGF0ZShvbGRfc3RhdGU6IFJlYWRvbmx5PFN0YXRlPiwgYm9keV9lbGVtZW50OiBCb2R5RWxlbWVudCwgc3RhcnRpbmdfcGxheWVyczogSGFuemlDb2xvcltdKTogU3RhdGUgfCBudWxsIHtcclxuXHRjb25zdCBuZXdfc3RhdGU6IFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvbGRfc3RhdGUpKTtcclxuXHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IG51bGwpIHtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gc3RhcnRpbmdfcGxheWVyc1tmcm9tSGFuemlTZWFzb24ob2xkX3N0YXRlLnNlYXNvbildID09PSBcIui1pFwiID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIGNsZWFyIHRoZSBmbGFnc1xyXG5cdG5ld19zdGF0ZS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdHNyYzogbnVsbCxcclxuXHRcdGFjdHVhbF9maW5hbF9kZXN0OiBudWxsLFxyXG5cdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IG51bGxcclxuXHR9O1xyXG5cclxuXHRpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwic2Vhc29uX2VuZHNcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5YasXCIpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuc2Vhc29uID1cclxuXHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxyXG5cdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5aSPXCIgPyBcIueni1wiIDpcclxuXHRcdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi56eLXCIgPyBcIuWGrFwiIDpcclxuXHRcdFx0XHRcdFx0KCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKCkgfSkoKTtcclxuXHRcdG5ld19zdGF0ZS50dXJuID0gMDtcclxuXHRcdG5ld19zdGF0ZS5ib2FyZCA9IGdldEluaXRpYWxCb2FyZCgpO1xyXG5cdFx0cmV0dXJuIG5ld19zdGF0ZTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImZyb21faG9wenVvXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLnR1cm4rKztcclxuXHRcdGNvbnN0IGRhdGE6IHtcclxuXHRcdFx0dHlwZTogXCJGcm9tSG9wMVp1bzFcIjtcclxuXHRcdFx0Y29sb3I6IENvbG9yO1xyXG5cdFx0XHRwcm9mOiBQcm9mZXNzaW9uO1xyXG5cdFx0XHRkZXN0OiBBYnNvbHV0ZUNvb3JkO1xyXG5cdFx0fSA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhO1xyXG5cdFx0Y29uc3QgY29sb3IgPSB0b0hhbnppQ29sb3IoZGF0YS5jb2xvcik7XHJcblx0XHRjb25zdCBwcm9mID0gdG9IYW56aVByb2Zlc3Npb24oZGF0YS5wcm9mKTtcclxuXHRcdGNvbnN0IGlzX2FzaWRlID0gbmV3X3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCI7XHJcblx0XHRyZW1vdmVfZnJvbV9ob3AxenVvMShuZXdfc3RhdGUsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0c2V0X3RvKG5ld19zdGF0ZSwgZGF0YS5kZXN0LCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9KTtcclxuXHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGRhdGEuZGVzdCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IGlzX2FzaWRlID8gXCJhX3NpZGVfaG9wMXp1bzFcIiA6IFwiaWFfc2lkZV9ob3AxenVvMVwiXHJcblx0XHR9XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJub3JtYWxfbW92ZVwiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJhX3NpZGVcIjtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImlhX3NpZGVcIjtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS50dXJuKys7XHJcblx0XHRpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNTdGVwRHN0XCIpIHtcclxuXHRcdFx0aWYgKGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZS5jaXVybF9ldmVudCkpIHtcclxuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcclxuXHRcdFx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHBpZWNlKTtcclxuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIGZhaWxlZCBhdHRlbXB0XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGVgKTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImVuZF9zZWFzb25cIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0YXhvdFwiKSB7XHJcblxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwidHltb2tcIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRhbV9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3JjKTtcclxuXHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3QsIHBpZWNlKTtcclxuXHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog55qH44GM6KGM44GT44GG44Go44GX44Gm44GE44KLJHtib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdFsxXX0ke2JvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0WzBdfeOBq+OBryR7bWF5YmVfY2FwdHVyZWRfcGllY2UuY29sb3J9JHttYXliZV9jYXB0dXJlZF9waWVjZS5wcm9mfeOBjOaXouOBq+OBguOCiuOBvuOBmWApXHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LnNyYyxcclxuXHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnN0ZXBTdHlsZSA9PT0gXCJOb1N0ZXBcIiA/IG51bGwgOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3RlcCxcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZmlyc3REZXN0XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50O1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC50eXBlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3X3N0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQ6IFJlYWRvbmx5PFBhcnNlZD4pOiBTdGF0ZVtdIHtcclxuXHRpZiAoIXBhcnNlZC5zdGFydGluZ19wbGF5ZXJzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvZG86IGN1cnJlbnQgaW1wbGVtZW50YXRpb24gcmVxdWlyZXMg5LiA5L2N6ImyLiBcclxuXHRcdFRvIHJlc29sdmUgdGhpcywgSSB3b3VsZCBuZWVkIHRvIHVuY29tbWVudCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiXHJcblx0XHRpbiBTdGF0ZS53aG9zZV90dXJuIOOBl+OBpuOAgeeah+S7peWkluOBrumnkuOCkuWLleOBi+OBl+OBn+OCieOBneOCjOOCkuWFg+OBq+mAhuOBq+i+v+OBo+OBpuino+a2iOOBmeOCi+OAgeOBv+OBn+OBhOOBquOBruOCkuWFpeOCjOOCi+W/heimgeOBjOOBguOCi+OAgmApO1xyXG5cdH1cclxuXHRsZXQgY3VycmVudF9zdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSh7XHJcblx0XHRpYV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuW8tVwiLCBwbGF5ZXJfbmFtZTogXCLlvLXkuIlcIiB9LFxyXG5cdFx0YV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuadjlwiLCBwbGF5ZXJfbmFtZTogXCLmnY7lm5tcIiB9XHJcblx0fSk7XHJcblx0Y29uc3QgYW5zOiBTdGF0ZVtdID0gW2N1cnJlbnRfc3RhdGVdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IG5leHRfc3RhdGUgPSAoKCkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0sIHBhcnNlZC5zdGFydGluZ19wbGF5ZXJzLnNwbGl0KFwiXCIpIGFzIEhhbnppQ29sb3JbXSlcclxuXHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7aX3jgrnjg4bjg4Pjg5fnm67jgafjga4ke2V9YCk7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfc3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0pKCk7XHJcblx0XHRpZiAoIW5leHRfc3RhdGUpIGJyZWFrO1xyXG5cdFx0YW5zLnB1c2gobmV4dF9zdGF0ZSk7XHJcblx0XHRjdXJyZW50X3N0YXRlID0gbmV4dF9zdGF0ZTtcclxuXHR9XHJcblx0cmV0dXJuIGFucztcclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQsIENvbG9yLCBQcm9mZXNzaW9uLCBTZWFzb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uID0gXCLoiLlcIiB8IFwi54ShXCIgfCBcIuWFtVwiIHwgXCLlvJNcIiB8IFwi6LuKXCIgfCBcIuiZjlwiIHwgXCLppqxcIiB8IFwi562GXCIgfCBcIuW3q1wiIHwgXCLlsIZcIiB8IFwi546LXCI7XHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbkFuZFRhbSA9IEhhbnppUHJvZmVzc2lvbiB8IFwi55qHXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcHJvZnM6IEhhbnppUHJvZmVzc2lvbkFuZFRhbVtdID0gW1xyXG5cdFwi6Ii5XCIsIFwi54ShXCIsIFwi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi55qHXCJcclxuXTtcclxuXHJcbmV4cG9ydCB0eXBlIEJvYXJkID0ge1xyXG5cdEs6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRMOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0TjogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFQ6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRaOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0WDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEM6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRNOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0UDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlTZWFzb24gPSBcIuaYpVwiIHwgXCLlpI9cIiB8IFwi56eLXCIgfCBcIuWGrFwiO1xyXG5leHBvcnQgZnVuY3Rpb24gZnJvbUhhbnppU2Vhc29uKHM6IEhhbnppU2Vhc29uKTogU2Vhc29uIHtcclxuXHRpZiAocyA9PT0gXCLmmKVcIikgcmV0dXJuIDA7IFxyXG5cdGVsc2UgaWYgKHMgPT09IFwi5aSPXCIpIHJldHVybiAxO1xyXG5cdGVsc2UgaWYgKHMgPT09IFwi56eLXCIpIHJldHVybiAyO1xyXG5cdGVsc2UgaWYgKHMgPT09IFwi5YasXCIpIHJldHVybiAzO1xyXG5cdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBVbmV4cGVjdGVkIHNlYXNvbiAke3N9YClcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgUmF0ZSA9IDEgfCAyIHwgNCB8IDggfCAxNiB8IDMyIHwgNjQ7XHJcbmV4cG9ydCB0eXBlIEhhbnppQ29sb3IgPSBcIui1pFwiIHwgXCLpu5JcIjtcclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGFuemlDb2xvcihjOiBDb2xvcik6IEhhbnppQ29sb3Ige1xyXG5cdGlmIChjID09PSBDb2xvci5Lb2sxKSByZXR1cm4gXCLotaRcIjtcclxuXHRyZXR1cm4gXCLpu5JcIjtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdG9IYW56aVByb2Zlc3Npb24ocDogUHJvZmVzc2lvbik6IEhhbnppUHJvZmVzc2lvbiB7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uRGF1MikgcmV0dXJuIFwi6JmOXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uR3VhMikgcmV0dXJuIFwi5byTXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uSW8pIHJldHVybiBcIueOi1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkthdWsyKSByZXR1cm4gXCLlhbVcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LYXVuMSkgcmV0dXJuIFwi6LuKXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS3VhMikgcmV0dXJuIFwi562GXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uTWF1bjEpIHJldHVybiBcIummrFwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLk51YWsxKSByZXR1cm4gXCLoiLlcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5UdWsyKSByZXR1cm4gXCLlt6tcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5VYWkxKSByZXR1cm4gXCLlsIZcIjtcclxuXHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogVW5leHBlY3RlZCBwcm9mZXNzaW9uICR7cH1gKVxyXG59XHJcbmV4cG9ydCB0eXBlIFN0YXRlID0ge1xyXG5cdHNlYXNvbjogSGFuemlTZWFzb24sXHJcblx0dHVybjogbnVtYmVyLFxyXG5cdHdob3NlX3R1cm46IFwiaWFfc2lkZVwiIHwgXCJhX3NpZGVcIiAvKnwgXCJhbWJpZ3VvdXNfYWxwaGFcIiB8IFwiYW1iaWd1b3VzX2JldGFcIiovIHwgbnVsbCxcclxuXHRyYXRlOiBSYXRlLFxyXG5cdGZvY3VzOiB7XHJcblx0XHRzdGVwcGVkOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCxcclxuXHRcdHNyYzogQWJzb2x1dGVDb29yZCB8IG51bGwgfCBcImlhX3NpZGVfaG9wMXp1bzFcIiB8IFwiYV9zaWRlX2hvcDF6dW8xXCIsXHJcblx0XHQvLyB8ICAgICAgICAgICAgICAgICAgICAgICAgfCBUYW0yICAgICAgIHwgd2hlbiBjaXVybCBmYWlscyB8IHdoZW4gb2sgfFxyXG5cdFx0Ly8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLXxcclxuXHRcdC8vIHwgaW5pdGlhbGx5X3BsYW5uZWRfZGVzdCB8IGZpcnN0RGVzdCAgfCBkZXN0ICAgICAgICAgICAgIHwgZGVzdCAgICB8XHJcblx0XHQvLyB8IGFjdHVhbF9maW5hbF9kZXN0ICAgICAgfCBzZWNvbmREZXN0IHwgc3JjICAgICAgICAgICAgICB8IGRlc3QgICAgfFxyXG5cdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGxcclxuXHRcdGFjdHVhbF9maW5hbF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCwgXHJcblx0fSxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBmYWxzZSB9W10sXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHRcdGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuLFxyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiB0cnVlIH1bXSxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5vblRhbVBpZWNlID0geyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgcGFyc2VDZXJrZU9ubGluZUtpYTFBazEsIFBhcnNlZCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FzZTMgPVxyXG5cdGB75LiA5L2N6ImyOui1pOi1pOi1pH1cclxue+Wni+aZgjoyMDIyLTA0LTAxVDE3OjAwOjI0LjI3OFp9XHJcbnvntYLmmYI6MjAyMi0wNC0wMVQxNzo1OTo0MC44NTdafVxyXG5MReW8k0xJTFXmqYvkuowgICAgWEFV6JmOWkFJVFnnhKHmkoPoo4FcclxuTFXlvJNMQUlMQVXmqYvkuIDmiYvpu5LlvJMgICAgS0FV5berTEFV54Sh5pKD6KOB5omL6LWk5byTXHJcbk5J5YW1TkXnhKHmkoPoo4EgICAg6LWk5byTTk9cclxuTkHou4pOSeeEoeaSg+ijgSAgICBLSUHnrYZLQUlLWeapi+S4gFxyXG5OReWFtU5JTk/msLTkuozmraTnhKEgICAgS1nnrYZLSUtF5qmL5LqM5omL6LWk5berXHJcbktB562GS0XnhKHmkoPoo4HmiYvotaTnrYYgICAgWk/nmodbVFVdWlVcclxuWEXomY5DSVhV5qmL5ZubICAgIE5BSeWFtU5BVeeEoeaSg+ijgVxyXG5OReWFtU5JTk/msLTkuInmiYvotaTlvJMgICAgVFnomY5YVeeEoeaSg+ijgeaJi+m7kuiZjlxyXG5UReiZjlpJWFXmqYvlm5vmiYvotaTomY4gICAgTEFV5berTkFVTkFJ54Sh5pKD6KOBXHJcblhV6JmOTkFJ54Sh5pKD6KOB5omL6buS5berICAgIFRBVeiZjk5BSeeEoeaSg+ijgeaJi+i1pOiZjlxyXG5YSeWFtVhV54Sh5pKD6KOBICAgIE5BSeiZjlhV54Sh5pKD6KOB5omL6LWk5YW1XHJcblpB546LWEFDReeEoeaSg+ijgSAgICDotaTlt6tOQUlcclxu6buS5byTWk8gICAgWkFJ6Ii5Wk/nhKHmkoPoo4HmiYvpu5LlvJNcclxuTUXlvJNDRVhF5qmL5LiJICAgIFpP6Ii5Tk/nhKHmkoPoo4HmiYvpu5LlhbVcclxuQ0XnjotNSVBV54Sh5pKD6KOBICAgIE5BSeW3q1hVUFXmqYvkuozmraTnhKFcclxuTknou4pLQeeEoeaSg+ijgSAgICBOQUnlt6tYVVBV5qmL5LqM5q2k54ShXHJcblhF5byTWFVaT+api+S4gOawtOS4iSAgICBOQUnlt6tYVUNV5qmL5LqMXHJcblpP5byTQ0FJWklB5qmL5LiJ5omL6buS546LXHJcblxyXG7miJbngrrlnLDlv4PliqDnjovliqDnjaPogIzmiYvljYHkupRcclxuXHJcbue1guWtoyAgICDmmKXntYJcclxuXHJcbk1F5byTTUlNVeapi+S4iSAgICBNQVXlvJNNQUlNWeapi+S6jFxyXG5DSeWFtUNF54Sh5pKD6KOBICAgIE1Z5byTTVXnhKHmkoPoo4HmiYvpu5LlvJNcclxuTUnlhbVNVeeEoeaSg+ijgeaJi+i1pOW8kyAgICBDQUnlhbVDQVXnhKHmkoPoo4FcclxuUEXlt6tDRUNJ54Sh5pKD6KOBICAgIFpP55qHW1pZXVpBSVpBVVxyXG5aSeiIuVpBSeeEoeaSg+ijgeaJi+m7kuiIuSAgICBUSUHlsIZUQVVaQUnmsLTnhKHmraTnhKFcclxuVEXomY5OSVRV5qmL54Sh5q2k54ShICAgIFRBVeiZjk5BSUNJ5qmL5Zub5omL6buS5berXHJcbkNF5YW1Q0nnhKHmkoPoo4HmiYvpu5LomY4gICAgWElB5bCGWEFVWkFJ5rC05LiJ5omL6LWk6Ii5XHJcbk1B6aasWElNT+eEoeaSg+ijgSAgICBYQUnlhbVDQUnnhKHmkoPoo4FcclxuVEXomY5OSVRV5qmL5LiJICAgIOm7kuW3q1RZXHJcblhJ5YW1WFXnhKHmkoPoo4EgICAgVFnlt6tDSVpB5qmL5LqM5omL6LWk546LXHJcblxyXG7miJbngrrnjovogIzmiYvkupRcclxu57WC5a2jICAgIOWkj+e1glxyXG5cclxuTUXlvJNNSU1V5qmL5LiJICAgIFhBVeiZjkNBSVhZ5qmL5LqMXHJcbkNJ5YW1Q0XnhKHmkoPoo4EgICAgQ0FJ5YW1Q0FV54Sh5pKD6KOBXHJcblBF5berQ0VDSeeEoeaSg+ijgSAgICBYWeiZjk1VQ0nnhKHmkoPoo4HmiYvpu5Llt6tcclxuQ0XlhbVDSeeEoeaSg+ijgeaJi+i1pOiZjiAgICDpu5Llt6tDQUlcclxuTVXlvJNNQUlDQUnmqYvlm5vmiYvpu5Llt6sgICAgQ0lB6LuKQ0FJ54Sh5pKD6KOB5omL6buS5byTXHJcblhF6JmOQ0lYVeapi+S4iSAgICDpu5LlvJNDWVxyXG5YSeWFtVhVQ1XnhKHmkoPoo4EgICAgWEFJ5YW1WFnnhKHmkoPoo4FcclxuWk/nmodbWlVdWklaRSAgICBaQUnoiLlaSeeEoeaSg+ijgeaJi+i1pOiIuVxyXG5UReiZjlpJ5rC05LiJ5omL6buS6Ii5ICAgIFhZ5YW1WFXnhKHmkoPoo4HmiYvpu5LomY5cclxuWknomY5YVeeEoeaSg+ijgeaJi+i1pOWFtSAgICBUQVXomY5OQUlUWeapi+S6jFxyXG5YVeiZjlRZ54Sh5pKD6KOB5omL6buS6JmOICAgIFRBSeWFtVRZ54Sh5pKD6KOB5omL6LWk6JmOXHJcbum7kuiIuVpJICAgIFpF55qHW1hJXVpVXHJcbum7kuW3q1pPICAgIENBSei7ilpP5rC05LiJ5omL6buS5berXHJcblpV55qHW1hVXVpJWkUgICAgWk/ou4pDSVBB54Sh5pKD6KOB5omL6LWk562GXHJcblpJ6Ii5WklB54Sh5pKD6KOB5omL6buS546LXHJcblxyXG7miJbngrrnjovliqDlkIzoibLnjaPogIzmiYvljYFcclxu57WC5a2jICAgIOeni+e1glxyXG5cclxuXHJcbuaYn+S4gOWRqGA7XHJcblxyXG4gICAgY29uc3QgcGFyc2VkOiBQYXJzZWQgPSBwYXJzZUNlcmtlT25saW5lS2lhMUFrMShjYXNlMyk7XHJcbiAgICBjb25zdCBzdGF0ZXM6IFN0YXRlW10gPSBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJraWFfYWtcIikhLnRleHRDb250ZW50ID0gY2FzZTM7XHJcblxyXG4gICAgZHJhd0VtcHR5Qm9hcmQoKTtcclxuICAgIGNvbnN0IHR1cm5fc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3NsaWRlclwiKSEgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHR1cm5fc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgY29uc3QgbWF4ID0gc3RhdGVzLmxlbmd0aCAtIDE7XHJcbiAgICB0dXJuX3NsaWRlci5tYXggPSBgJHttYXh9YDtcclxuICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gXCIwXCI7XHJcbiAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1swXSk7XHJcbiAgICB0dXJuX3NsaWRlci5vbmlucHV0ID0gdHVybl9zbGlkZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1dHRvbl9uZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25fbmV4dFwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fbmV4dC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSArIDF9YDtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpOyAvLyBhdXRvbWF0aWNhbGx5IGNyb3BzIHRoZSB2YWx1ZSBhcHByb3ByaWF0ZWx5XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX3ByZXZpb3VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25fcHJldmlvdXNcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgYnV0dG9uX3ByZXZpb3VzLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpIC0gMX1gO1xyXG4gICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fZmlyc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9maXJzdFwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fZmlyc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSAwO1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7bmV3X3ZhbHVlfWA7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX2xhc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9sYXN0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9sYXN0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gbWF4O1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7bmV3X3ZhbHVlfWA7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICB9XHJcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
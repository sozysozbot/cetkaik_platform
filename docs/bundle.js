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
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_final_dest);
    document.getElementById("yaku_display").innerHTML = Dat2ListHTML(STATE.dat2_list_on_display);
}
exports.drawGameState = drawGameState;
function Dat2ListHTML(a) {
    if (!a)
        return "";
    return "<div style=\"position: absolute;\n    width: 469px;\n    height: 256px;\n    top: 131px;\n    left: 44px;\n    background-color: rgba(0,0,0,80%);\n    color: white;\n}\">".concat(__spreadArray(__spreadArray([], a.hands, true), [a.type === "taxot" ? "終季" : "再行"], false).join("<br>"), "</div>");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FB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RUFBbUk7QUFHbkksU0FBUyxlQUFlO0lBQ3ZCLE9BQU87UUFDTixDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxHQUFHO1lBQ04sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxL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O1FBQ3BCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsVUFBRyxTQUFTLENBQUUsQ0FBQztRQUNuQyx3QkFBYSxFQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLDhCQUFtQixFQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQXVCLENBQUM7SUFDakYsV0FBVyxDQUFDLE9BQU8sR0FBRztRQUNsQixJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDdEIsV0FBVyxDQUFDLEtBQUssR0FBRyxVQUFHLFNBQVMsQ0FBRSxDQUFDO1FBQ25DLHdCQUFhLEVBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDakMsOEJBQW1CLEVBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvb3RoZXJfdHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL3RhY3RpY3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL3R5cGVfX21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9oYW5kbGVfYm9keV9lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaF9tb25hZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvcmVhZF9wZWt6ZXBfbnVtZXJhbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdHlwZV9fbWVzc2FnZVwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90YWN0aWNzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL290aGVyX3R5cGVzXCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLypcclxuICogVGhlb3JldGljYWxseSBzcGVha2luZywgaXQgaXMgbmVjZXNzYXJ5IHRvIGRpc3Rpbmd1aXNoIHgzMiBhbmQgeDY0XHJcbiAqIGJlY2F1c2UgaXQgaXMgcG9zc2libGUgdG8gc2NvcmUgMSBwb2ludCAoMyszLTUpLlxyXG4gKiBOb3QgdGhhdCBpdCB3aWxsIGV2ZXIgYmUgb2YgdXNlIGluIGFueSByZWFsIHNpdHVhdGlvbi5cclxuICovIFxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlByb2Zlc3Npb24gPSBleHBvcnRzLkNvbG9yID0gdm9pZCAwO1xyXG52YXIgQ29sb3I7XHJcbihmdW5jdGlvbiAoQ29sb3IpIHtcclxuICAgIENvbG9yW0NvbG9yW1wiS29rMVwiXSA9IDBdID0gXCJLb2sxXCI7XHJcbiAgICBDb2xvcltDb2xvcltcIkh1b2syXCJdID0gMV0gPSBcIkh1b2syXCI7XHJcbn0pKENvbG9yID0gZXhwb3J0cy5Db2xvciB8fCAoZXhwb3J0cy5Db2xvciA9IHt9KSk7XHJcbnZhciBQcm9mZXNzaW9uO1xyXG4oZnVuY3Rpb24gKFByb2Zlc3Npb24pIHtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIk51YWsxXCJdID0gMF0gPSBcIk51YWsxXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLYXVrMlwiXSA9IDFdID0gXCJLYXVrMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiR3VhMlwiXSA9IDJdID0gXCJHdWEyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLYXVuMVwiXSA9IDNdID0gXCJLYXVuMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiRGF1MlwiXSA9IDRdID0gXCJEYXUyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJNYXVuMVwiXSA9IDVdID0gXCJNYXVuMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS3VhMlwiXSA9IDZdID0gXCJLdWEyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJUdWsyXCJdID0gN10gPSBcIlR1azJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIlVhaTFcIl0gPSA4XSA9IFwiVWFpMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiSW9cIl0gPSA5XSA9IFwiSW9cIjtcclxufSkoUHJvZmVzc2lvbiA9IGV4cG9ydHMuUHJvZmVzc2lvbiB8fCAoZXhwb3J0cy5Qcm9mZXNzaW9uID0ge30pKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5oYW5kbGVCb2R5RWxlbWVudCA9IGV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IGV4cG9ydHMuaGFuZGxlWWFrdSA9IGV4cG9ydHMuaGFuZGxlVGFtTW92ZSA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hlcnNfMSA9IHJlcXVpcmUoXCIuL211bmNoZXJzXCIpO1xyXG5jb25zdCBtdW5jaF9tb25hZF8xID0gcmVxdWlyZShcIi4vbXVuY2hfbW9uYWRcIik7XHJcbmZ1bmN0aW9uIGhhbmRsZVRhbU1vdmUocykge1xyXG4gICAgY29uc3QgdHJ5X211bmNoX3NyYyA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHMpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfc3JjKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc3JjLCByZXN0IH0gPSB0cnlfbXVuY2hfc3JjO1xyXG4gICAgaWYgKHJlc3QuY2hhckF0KDApICE9PSBcIueah1wiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0YW0yIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgLy8gdGhlIGZvcm1hdCBpcyBlaXRoZXI6XHJcbiAgICAvLyAtIFpV55qHW1RPXVRVXHJcbiAgICAvLyAtIFpP55qHW1pVXVpJWkVcclxuICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChmaXJzdERlc3QsIG5leHQpID0+ICh7IGZpcnN0RGVzdCwgbmV4dCB9KSwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0KSB7XHJcbiAgICAgICAgLy8gZWl0aGVyOlxyXG4gICAgICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgICAgICAvLyAtIFpP55qHW1pVXVpJWkVcclxuICAgICAgICBjb25zdCB7IGFuczogeyBmaXJzdERlc3QsIG5leHQgfSwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0O1xyXG4gICAgICAgIGlmIChyZXN0MiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJUYW1Nb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIk5vU3RlcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYywgZmlyc3REZXN0LCBzZWNvbmREZXN0OiBuZXh0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0cnlfbXVuY2hfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICAgICAgICAgIGlmICghdHJ5X211bmNoX2Nvb3JkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB7IGFuczogc2Vjb25kRGVzdCwgcmVzdDogZW1wdHkgfSA9IHRyeV9tdW5jaF9jb29yZDtcclxuICAgICAgICAgICAgaWYgKGVtcHR5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtlbXB0eX1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudDogeyB0eXBlOiBcIlRhbU1vdmVcIiwgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nTGF0dGVyXCIsIHNyYywgZmlyc3REZXN0LCBzdGVwOiBuZXh0LCBzZWNvbmREZXN0IH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyAtIFRZ55qHVEFJW1RBVV1aQVVcclxuICAgICAgICBjb25zdCBtdW5jaCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCkgPT4gKHsgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0IH0pLCBtdW5jaGVyc18xLm11bmNoQ29vcmQsIG11bmNoZXJzXzEubXVuY2hCcmFja2V0ZWRDb29yZCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgICAgICBpZiAoIW11bmNoKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0IH0sIHJlc3Q6IGVtcHR5IH0gPSBtdW5jaDtcclxuICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgIHN0ZXBTdHlsZTogXCJTdGVwc0R1cmluZ0Zvcm1lclwiLFxyXG4gICAgICAgICAgICAgICAgc3JjLCBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gaGFuZGxlVGFtTW92ZTtcclxuZnVuY3Rpb24gaGFuZGxlWWFrdShzKSB7XHJcbiAgICAvLyDmiJbngrrnjovliqDnjaNcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo+iAjOaJi+WFq1xyXG4gICAgY29uc3QgaGFuZHNTZXBCeUF0ID0gKDAsIG11bmNoX21vbmFkXzEuc2VwQnkxKSh7IHA6IG11bmNoZXJzXzEubXVuY2hIYW5kLCBzZXA6ICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLliqBcIikgfSk7XHJcbiAgICBjb25zdCBtdW5jaCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKF8sIGhhbmRzKSA9PiBoYW5kcywgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuaIlueCulwiKSwgaGFuZHNTZXBCeUF0KShzKTtcclxuICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBoYW5kcywgcmVzdCB9ID0gbXVuY2g7XHJcbiAgICBpZiAocmVzdCA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IFwidHltb2tcIiwgaGFuZHMgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG11bmNoMiA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKF8sIG51bSkgPT4gbnVtLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi6ICM5omLXCIpLCBtdW5jaGVyc18xLm11bmNoUGVremVwTnVtZXJhbCkocmVzdCk7XHJcbiAgICBpZiAoIW11bmNoMikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNjb3JlLCByZXN0OiByZXN0MiB9ID0gbXVuY2gyO1xyXG4gICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0eXBlOiBcInRheG90XCIsIGhhbmRzLCBzY29yZSB9O1xyXG59XHJcbmV4cG9ydHMuaGFuZGxlWWFrdSA9IGhhbmRsZVlha3U7XHJcbmNvbnN0IG11bmNoV2F0ZXJFdmVudCA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi5rC0XCIpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHMuc2xpY2UoMSk7XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIueEoeatpOeEoVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHQuc2xpY2UoMykgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIuS4gOatpOeEoVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHQuc2xpY2UoMykgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIuS6jOatpOeEoVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDIsIHJlc3Q6IHQuc2xpY2UoMykgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIuS4iVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDMsIHJlc3Q6IHQuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIuWbm1wiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDQsIHJlc3Q6IHQuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQuc3RhcnRzV2l0aChcIuS6lFwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IDUsIHJlc3Q6IHQuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQgPSBtdW5jaFdhdGVyRXZlbnQ7XHJcbmNvbnN0IG11bmNoQ2l1cmxFdmVudCA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi54Sh5pKD6KOBXCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwibm9fY2l1cmxfZXZlbnRcIiB9LCByZXN0OiBzLnNsaWNlKDMpIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfd2F0ZXIgPSAoMCwgZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQpKHMpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF93YXRlcikge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zLCByZXN0IH0gPSB0cnlfbXVuY2hfd2F0ZXI7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwiaGFzX3dhdGVyX2VudHJ5XCIsIHdhdGVyX2VudHJ5X2NpdXJsOiBhbnMgfSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuapi1wiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBwaW5nX2NpdXJsID0gdFswXSA9PT0gXCLnhKFcIiA/IDAgOlxyXG4gICAgICAgICAgICB0WzBdID09PSBcIuS4gFwiID8gMSA6XHJcbiAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS6jFwiID8gMiA6XHJcbiAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuIlcIiA/IDMgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuWbm1wiID8gNCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS6lFwiID8gNSA6ICgoKSA9PiB7IHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgY2hhcmFjdGVyIGZvdW5kIGFmdGVyIOapi1wiKTsgfSkoKTtcclxuICAgICAgICBjb25zdCByZXN0ID0gdC5zbGljZSgxKTtcclxuICAgICAgICAvLyBFaXRoZXIgbm90aGluZywg5q2k54ShLCBvciBtdW5jaFdhdGVyRXZlbnRcclxuICAgICAgICBjb25zdCB0cnlfbXVuY2hfd2F0ZXIgPSAoMCwgZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQpKHJlc3QpO1xyXG4gICAgICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhbnM6IHdhdGVyX2VudHJ5X2NpdXJsLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJoYXNfd2F0ZXJfZW50cnlcIiwgc3RlcHBpbmdfY2l1cmwsIHdhdGVyX2VudHJ5X2NpdXJsIH0sIHJlc3Q6IHJlc3QyIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlc3Quc3RhcnRzV2l0aChcIuatpOeEoVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJvbmx5X3N0ZXBwaW5nXCIsIHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogZmFsc2UgfSwgcmVzdDogXCJcIiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwib25seV9zdGVwcGluZ1wiLCBzdGVwcGluZ19jaXVybCwgaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M6IHRydWUgfSwgcmVzdCB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IG11bmNoQ2l1cmxFdmVudDtcclxuZnVuY3Rpb24gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHMpIHtcclxuICAgIGNvbnN0IHRyeV9jaXVybF9ldmVudCA9ICgwLCBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCkocyk7XHJcbiAgICBpZiAoIXRyeV9jaXVybF9ldmVudCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBjaXVybCBldmVudDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGNpdXJsX2V2ZW50LCByZXN0IH0gPSB0cnlfY2l1cmxfZXZlbnQ7XHJcbiAgICBpZiAocmVzdCA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50IH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBvcHRpb25hbF9waWVjZV9jYXB0dXJlID0gKDAsIG11bmNoZXJzXzEubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50KShyZXN0KTtcclxuICAgIGlmIChvcHRpb25hbF9waWVjZV9jYXB0dXJlKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHBpZWNlX2NhcHR1cmUsIHJlc3Q6IHJlc3QyIH0gPSBvcHRpb25hbF9waWVjZV9jYXB0dXJlO1xyXG4gICAgICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyYWlsaW5nIHBhcmFtZXRlciBcXGAke3N9XFxgIGhhcyBzb21lIGV4dHJhIFxcYCR7cmVzdDJ9XFxgIGF0IHRoZSBlbmRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQsIHBpZWNlX2NhcHR1cmUgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSB0cmFpbGluZyBwYXJhbWV0ZXI6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycztcclxuZnVuY3Rpb24gaGFuZGxlQm9keUVsZW1lbnQocykge1xyXG4gICAgaWYgKHMgPT09IFwi5pil57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDAgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWkj+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAxIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLnp4vntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5Yas57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDMgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIue1guWto1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZW5kX3NlYXNvblwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLmmJ/kuIDlkahcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImdhbWVfc2V0XCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi54K6XCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVlha3Uocyk7XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueah1wiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVUYW1Nb3ZlKHMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2Zyb21faG9wenVvID0gKDAsIG11bmNoZXJzXzEubXVuY2hGcm9tSG9wWnVvKShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfZnJvbV9ob3B6dW8pIHtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBjb2xvciwgcHJvZiwgZGVzdCB9LCByZXN0IH0gPSB0cnlfbXVuY2hfZnJvbV9ob3B6dW87XHJcbiAgICAgICAgaWYgKHJlc3QgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImZyb21faG9wenVvXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRnJvbUhvcDFadW8xXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3NyYyA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHMpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfc3JjKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc3JjLCByZXN0IH0gPSB0cnlfbXVuY2hfc3JjO1xyXG4gICAgaWYgKCFbXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLoiLlcIiwgXCLniYdcIl0uaW5jbHVkZXMocmVzdC5jaGFyQXQoMCkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCBhIHByb2Zlc3Npb24gd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfMm5kX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8ybmRfY29vcmQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRoZSBzZWNvbmQgY29vcmRpbmF0ZSB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzZWNvbmRfY29vcmQsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfMm5kX2Nvb3JkO1xyXG4gICAgY29uc3QgdHJ5X211bmNoXzNyZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgIGlmICghdHJ5X211bmNoXzNyZF9jb29yZCkge1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QyKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY0RzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBzZWNvbmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHRoaXJkX2Nvb3JkLCByZXN0OiByZXN0MyB9ID0gdHJ5X211bmNoXzNyZF9jb29yZDtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Myk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNTdGVwRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IHNlY29uZF9jb29yZCxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiB0aGlyZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVCb2R5RWxlbWVudCA9IGhhbmRsZUJvZHlFbGVtZW50O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gdm9pZCAwO1xyXG5jb25zdCBoYW5kbGVfYm9keV9lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9oYW5kbGVfYm9keV9lbGVtZW50XCIpO1xyXG4vLyBWZXJ5IHByaW1pdGl2ZSBwYXJzZXIgdGhhdCBuZXZlciBoYW5kbGVzIGFsbCB0aGUgZWRnZSBjYXNlc1xyXG5mdW5jdGlvbiBwYXJzZUNlcmtlT25saW5lS2lhMUFrMShzKSB7XHJcbiAgICBjb25zdCBsaW5lcyA9IHMudHJpbSgpLnNwbGl0KFwiXFxuXCIpLm1hcChsID0+IGwudHJpbSgpKTtcclxuICAgIGNvbnN0IGluaXRpYWxfbGluZSA9IGxpbmVzWzBdO1xyXG4gICAgaWYgKGluaXRpYWxfbGluZSA9PT0gdW5kZWZpbmVkIC8qIFNpbmNlIHdlIHVzZWQgLnNwbGl0KCksIHRoaXMgYWN0dWFsbHkgY2FuJ3QgaGFwcGVuICovIHx8IGluaXRpYWxfbGluZSA9PT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjOOBguOCiuOBvuOBm+OCk1wiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKC9eXFx75aeL5pmCOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvlp4vmmYI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBmeOAguOBk+OCjOOBrzIwMjHlubQxMeaciOacq+OCouODg+ODl+ODh+ODvOODiOS7peWJjeOBruaji+itnOOBp+OBguOCiuOAgeOBvuOBoOWvvuW/nOOBp+OBjeOBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCEvXlxce+S4gOS9jeiJsjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75LiA5L2N6ImyOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydGluZ19wbGF5ZXJzID0gaW5pdGlhbF9saW5lLm1hdGNoKC9eXFx75LiA5L2N6ImyOihb6buS6LWkXSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBzdGFydGluZ190aW1lID0gbGluZXNbMV0/Lm1hdGNoKC9eXFx75aeL5pmCOihbXn1dKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IGVuZGluZ190aW1lID0gbGluZXNbMl0/Lm1hdGNoKC9eXFx757WC5pmCOihbXn1dKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IGJvZGllcyA9IGxpbmVzLnNsaWNlKDMpLmZsYXRNYXAobGluZSA9PiBsaW5lLnNwbGl0KC9bXFxzXFxuXS9nKSkuZmlsdGVyKGEgPT4gYSAhPT0gXCJcIik7XHJcbiAgICBjb25zdCBwYXJzZWRfYm9kaWVzID0gYm9kaWVzLm1hcChoYW5kbGVfYm9keV9lbGVtZW50XzEuaGFuZGxlQm9keUVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIHsgc3RhcnRpbmdfcGxheWVycywgc3RhcnRpbmdfdGltZSwgZW5kaW5nX3RpbWUsIHBhcnNlZF9ib2RpZXMgfTtcclxufVxyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gZXhwb3J0cy5tYW55MSA9IGV4cG9ydHMubWFueSA9IGV4cG9ydHMubGlmdE0zID0gZXhwb3J0cy5zdHJpbmcgPSBleHBvcnRzLmxpZnRNMiA9IGV4cG9ydHMucHVyZSA9IGV4cG9ydHMuYmluZCA9IHZvaWQgMDtcclxuLy8gbW9uYWRcclxuY29uc3QgYmluZCA9IChtYSwgY2FsbGJhY2spID0+ICgoaW5wdXQpID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrKGEpKHJlc3QpO1xyXG59KTtcclxuZXhwb3J0cy5iaW5kID0gYmluZDtcclxuY29uc3QgcHVyZSA9IChhKSA9PiAoaW5wdXQpID0+ICh7IGFuczogYSwgcmVzdDogaW5wdXQgfSk7XHJcbmV4cG9ydHMucHVyZSA9IHB1cmU7XHJcbmNvbnN0IGxpZnRNMiA9IChmLCBtYSwgbWIpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYikpKSk7XHJcbmV4cG9ydHMubGlmdE0yID0gbGlmdE0yO1xyXG5jb25zdCBzdHJpbmcgPSAocHJlZml4KSA9PiAoaW5wdXQpID0+IGlucHV0LnN0YXJ0c1dpdGgocHJlZml4KSA/IHsgYW5zOiB1bmRlZmluZWQsIHJlc3Q6IGlucHV0LnNsaWNlKHByZWZpeC5sZW5ndGgpIH0gOiBudWxsO1xyXG5leHBvcnRzLnN0cmluZyA9IHN0cmluZztcclxuY29uc3QgbGlmdE0zID0gKGYsIG1hLCBtYiwgbWMpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLmJpbmQpKG1jLCBjID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYiwgYykpKSkpO1xyXG5leHBvcnRzLmxpZnRNMyA9IGxpZnRNMztcclxuY29uc3QgbWFueSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBsZXQgcmVzdCA9IGlucHV0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkgPSBtYW55O1xyXG5jb25zdCBtYW55MSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgbGV0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgY29uc3QgYW5zID0gW2FdO1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkxID0gbWFueTE7XHJcbmNvbnN0IHNlcEJ5MSA9ICh7IHA6IG1hLCBzZXAgfSkgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkoKDAsIGV4cG9ydHMubWFueSkoKDAsIGV4cG9ydHMuYmluZCkoc2VwLCAoXykgPT4gbWEpKSwgYXMgPT4gKDAsIGV4cG9ydHMucHVyZSkoW2EsIC4uLmFzXSkpKTtcclxuZXhwb3J0cy5zZXBCeTEgPSBzZXBCeTE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSBleHBvcnRzLm11bmNoRnJvbUhvcFp1byA9IGV4cG9ydHMubXVuY2hDb29yZCA9IGV4cG9ydHMubXVuY2hIYW5kID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaF9tb25hZF8xID0gcmVxdWlyZShcIi4vbXVuY2hfbW9uYWRcIik7XHJcbmNvbnN0IHJlYWRfcGVremVwX251bWVyYWxzXzEgPSByZXF1aXJlKFwiLi9yZWFkX3Bla3plcF9udW1lcmFsc1wiKTtcclxuY29uc3QgbXVuY2hDb2xvciA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LWkXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUHJvZmVzc2lvbiA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6Ii5XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlhbVcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW8k1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LuKXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDMsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLomY5cIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIummrFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi562GXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDYsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlt6tcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWwhlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA4LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi546LXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDksIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaENvbHVtbiA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBjb2xzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgY29scykge1xyXG4gICAgICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gY29sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogY29sLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUm93ID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCJBSVwiLCBcIkFVXCIsIFwiSUFcIiAvKiBoYW5kbGUgdGhlIGxvbmdlciBvbmVzIGZpcnN0ICovLCBcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKHJvdykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiByb3csIHJlc3Q6IHMuc2xpY2Uocm93Lmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hIYW5kID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGhhbmRzID0gW1wi546LXCIsIFwi542jXCIsIFwi5ZCM6Imy542jXCIsIFwi5Zyw5b+DXCIsIFwi5ZCM6Imy5Zyw5b+DXCIsIFwi6aas5byT5YW1XCIsIFwi5ZCM6Imy6aas5byT5YW1XCIsXHJcbiAgICAgICAgXCLliqnlj4tcIiwgXCLlkIzoibLliqnlj4tcIiwgXCLmiKbpm4ZcIiwgXCLlkIzoibLmiKbpm4ZcIiwgXCLooYzooYxcIiwgXCLlkIzoibLooYzooYxcIiwgXCLnrYblhbXnhKHlgr5cIiwgXCLlkIzoibLnrYblhbXnhKHlgr5cIixcclxuICAgICAgICBcIumXh+aIpuS5i+mbhlwiLCBcIuWQjOiJsumXh+aIpuS5i+mbhlwiLCBcIueEoeaKl+ihjOWHplwiLCBcIuWQjOiJsueEoeaKl+ihjOWHplwiXTtcclxuICAgIGZvciAoY29uc3QgaGFuZCBvZiBoYW5kcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoaGFuZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBoYW5kLCByZXN0OiBzLnNsaWNlKGhhbmQubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoSGFuZCA9IG11bmNoSGFuZDtcclxuZXhwb3J0cy5tdW5jaENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoY29sLCByb3cpID0+IHtcclxuICAgIGNvbnN0IGNvb3JkID0gW3JvdywgY29sXTtcclxuICAgIHJldHVybiBjb29yZDtcclxufSwgbXVuY2hDb2x1bW4sIG11bmNoUm93KTtcclxuZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChjb2xvciwgcHJvZiwgZGVzdCkgPT4gKHsgY29sb3IsIHByb2YsIGRlc3QgfSksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbiwgZXhwb3J0cy5tdW5jaENvb3JkKTtcclxuZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfLCBjb2xvciwgcHJvZikgPT4gKHsgY29sb3IsIHByb2YgfSksICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiYtcIiksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbik7XHJcbmV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8xLCBjb29yZCwgXzIpID0+IGNvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiW1wiKSwgZXhwb3J0cy5tdW5jaENvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiXVwiKSk7XHJcbmNvbnN0IG11bmNoRGlnaXRMaW56a2xhciA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBkcyA9IFtcIueEoVwiLCBcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiLCBcIuWNgVwiLCBcIuS4i1wiLCBcIueZvlwiXTtcclxuICAgIGZvciAoY29uc3QgZCBvZiBkcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBkLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUGVremVwTnVtZXJhbCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCB0MSA9ICgwLCBtdW5jaF9tb25hZF8xLm1hbnkxKShtdW5jaERpZ2l0TGluemtsYXIpKHMpO1xyXG4gICAgaWYgKCF0MSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zLCByZXN0IH0gPSB0MTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgbnVtID0gKDAsIHJlYWRfcGVremVwX251bWVyYWxzXzEuZnJvbURpZ2l0c0xpbnprbGFyKShhbnMpO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogbnVtLCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IG11bmNoUGVremVwTnVtZXJhbDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhcihpKSB7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnhKFcIiAmJiBpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5LiLXCIpIHtcclxuICAgICAgICByZXR1cm4gLWZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIueZvlwiKSB7XHJcbiAgICAgICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAxMDAgKyBmcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbmRleDEwMCA9IGkuaW5kZXhPZihcIueZvlwiKTtcclxuICAgIGlmIChpbmRleDEwMCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBodW5kcmVkcyA9IGkuc2xpY2UoMCwgaW5kZXgxMDApO1xyXG4gICAgICAgIGNvbnN0IG9uZXMgPSBpLnNsaWNlKGluZGV4MTAwICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIDEwMCAqIGZyb21EaWdpdHNMaW56a2xhclN1YihodW5kcmVkcykgKyBmcm9tRGlnaXRzTGluemtsYXJTdWIob25lcyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGlmIChpWzFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICogcGFyc2VVbml0KGlbMF0pICsgcGFyc2VVbml0KGlbMl0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIFwiJHtpfVwiIGFzIGEgcGVremVwIG51bWVyYWxgKTtcclxufVxyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IGZyb21EaWdpdHNMaW56a2xhcjtcclxuZnVuY3Rpb24gcGFyc2VVbml0KG9uZXMpIHtcclxuICAgIGlmIChvbmVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4gFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuoxcIikge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiJXCIpIHtcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWbm1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkupRcIikge1xyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWtXCIpIHtcclxuICAgICAgICByZXR1cm4gNjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4g1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDc7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlhatcIikge1xyXG4gICAgICAgIHJldHVybiA4O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LmdXCIpIHtcclxuICAgICAgICByZXR1cm4gOTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgXCIke29uZXN9XCIgd2hpbGUgdHJ5aW5nIHRvIHBhcnNlIHBla3plcCBudW1lcmFsc2ApO1xyXG59XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhclN1YihpKSB7XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlbaS5sZW5ndGggLSAxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSkgKiAxMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGEgPSBpWzBdO1xyXG4gICAgICAgIGNvbnN0IGIgPSBpWzFdO1xyXG4gICAgICAgIGlmIChiID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKSAqIDEwICsgcGFyc2VVbml0KGIpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcbmltcG9ydCB7IE5vblRhbVBpZWNlLCBTdGF0ZSwgSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBwcm9mcywgQm9hcmQsIERhdDJEaXNwbGF5IH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBoZWlnaHQgPSAzODc7XHJcbmV4cG9ydCBjb25zdCBsZWZ0X21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgdG9wX21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgY2VsbF9zaXplID0gNDM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0VtcHR5Qm9hcmQoKSB7XHJcbiAgICBjb25zdCBjdHggPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdlwiKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgLy8g55qH5YemXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjcsIDU0LjUlLCA4MS4xJSlcIlxyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcblxyXG4gICAgLy8g55qH5rC0XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjEzLCAzMy42JSwgNzguOSUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgLy8g55qH5bGxXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMTI5LCAzOC41JSwgNDUuNCUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDk5LCA5OSwgOTkpJztcclxuICAgIGN0eC5saW5lV2lkdGggPSAwLjAzICogaGVpZ2h0IC8gOTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA5OyBpKyspIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIDAsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGhlaWdodCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAwKTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwwLDApXCI7XHJcbiAgICBjb25zdCBjb2x1bW5zID0gW1wiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCIsIFwiQUlcIiwgXCJBVVwiLCBcIklBXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgbGVmdF9tYXJnaW4gKyBoZWlnaHQgKyAxMCwgdG9wX21hcmdpbiArIDMwICsgY2VsbF9zaXplICogaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm93cyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCBsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSwgdG9wX21hcmdpbiAtIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgLWxlZnRfbWFyZ2luICsgMTAsIC0odG9wX21hcmdpbiArIDE1ICsgY2VsbF9zaXplICogaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCAtKGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpKSwgLSh0b3BfbWFyZ2luICsgaGVpZ2h0ICsgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRfdG9wX2xlZnQoY29vcmQ6IEFic29sdXRlQ29vcmQpIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjb29yZFsxXV07XHJcbiAgICBjb25zdCByb3cgPSB7XHJcbiAgICAgICAgSUE6IDgsXHJcbiAgICAgICAgQVU6IDcsXHJcbiAgICAgICAgQUk6IDYsIFk6IDUsIE86IDQsIFU6IDMsIEk6IDIsIEU6IDEsIEE6IDBcclxuICAgIH1bY29vcmRbMF1dO1xyXG4gICAgY29uc3QgbGVmdCA9IGxlZnRfbWFyZ2luICsgY2VsbF9zaXplICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgY2VsbF9zaXplICogKHJvdyAtIDAuNSk7XHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9jdXNQbGFubmVkRGVzdEhUTUwoZm9jdXNfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3BsYW5uZWRfZGVzdCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3BsYW5uZWRfZGVzdCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAyNSU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNzgsIDI1NSwgMjU1KVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzU3RlcHBlZEhUTUwoZm9jdXNfc3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zdGVwcGVkKSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfc3RlcHBlZCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Rm9jdXNTcmMoZm9jdXNfc3JjOiBBYnNvbHV0ZUNvb3JkIHwgXCJhX3NpZGVfaG9wMXp1bzFcIiB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3NyYyB8fCBmb2N1c19zcmMgPT09IFwiYV9zaWRlX2hvcDF6dW8xXCIgfHwgZm9jdXNfc3JjID09PSBcImlhX3NpZGVfaG9wMXp1bzFcIikgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3NyYyk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zKVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZnVuY3Rpb24gUGllY2VzT25Cb2FyZEhUTUwoYm9hcmQ6IEJvYXJkLCBmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGNvbnN0IGNsbSBpbiBib2FyZCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcncgaW4gYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc19mb2N1c2VkID0gZm9jdXMgPyBmb2N1c1sxXSA9PT0gY2xtICYmIGZvY3VzWzBdID09PSBydyA6IGZhbHNlO1xyXG4gICAgICAgICAgICBhbnMgKz0gUG9zaXRpb25lZFBpZWNlT25Cb2FyZEhUTUwoXHJcbiAgICAgICAgICAgICAgICBjbG0gYXMgQWJzb2x1dGVDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBydyBhcyBBYnNvbHV0ZVJvdyxcclxuICAgICAgICAgICAgICAgIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0hW3J3IGFzIEFic29sdXRlUm93XSEsXHJcbiAgICAgICAgICAgICAgICBpc19mb2N1c2VkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBIb3AxWnVvMUhUTUwocGllY2VzOiBOb25UYW1QaWVjZVtdLCBpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbikge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YgfSA9IHBpZWNlc1tpXTtcclxuICAgICAgICBjb25zdCByYWQgPSAxOCAvIDAuMjY7XHJcbiAgICAgICAgYW5zICs9IGA8bGk+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAyM3B4OyBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJHtjZWxsX3NpemV9cHg7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KTsgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDsgXHJcbiAgICAgICAgICAgIFwiPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAke2lzX25ld2x5X2FjcXVpcmVkICYmIGkgPT0gcGllY2VzLmxlbmd0aCAtIDEgPyBgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgNjAsIDUwLCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgXCI+PC9kaXY+YCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgZmFsc2UpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2xpPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0dhbWVTdGF0ZShTVEFURTogU3RhdGUpIHtcclxuICAgIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QuYWRkKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5hZGQoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmFfc2lkZS5ob3AxenVvMSwgU1RBVEUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEsIFNUQVRFLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IEZvY3VzU3RlcHBlZEhUTUwoU1RBVEUuZm9jdXMuc3RlcHBlZCkgK1xyXG4gICAgICAgIGRyYXdGb2N1c1NyYyhTVEFURS5mb2N1cy5zcmMpICtcclxuICAgICAgICBGb2N1c1BsYW5uZWREZXN0SFRNTChTVEFURS5mb2N1cy5pbml0aWFsbHlfcGxhbm5lZF9kZXN0KSArXHJcbiAgICAgICAgUGllY2VzT25Cb2FyZEhUTUwoU1RBVEUuYm9hcmQsIFNUQVRFLmZvY3VzLmFjdHVhbF9maW5hbF9kZXN0KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWFrdV9kaXNwbGF5XCIpIS5pbm5lckhUTUwgPSBEYXQyTGlzdEhUTUwoU1RBVEUuZGF0Ml9saXN0X29uX2Rpc3BsYXkpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gRGF0Mkxpc3RIVE1MKGE6IERhdDJEaXNwbGF5KTogc3RyaW5nIHtcclxuICAgIGlmICghYSkgcmV0dXJuIFwiXCI7XHJcbiAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogNDY5cHg7XHJcbiAgICBoZWlnaHQ6IDI1NnB4O1xyXG4gICAgdG9wOiAxMzFweDtcclxuICAgIGxlZnQ6IDQ0cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDgwJSk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cIj4ke1suLi5hLmhhbmRzLCBhLnR5cGUgPT09IFwidGF4b3RcIiA/IFwi57WC5a2jXCIgOiBcIuWGjeihjFwiXS5qb2luKFwiPGJyPlwiKX08L2Rpdj5gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIE5vcm1hbFBpZWNlSFRNTChjb2xvcjogXCLpu5JcIiB8IFwi6LWkXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeCA9IHByb2ZzLmluZGV4T2YocHJvZikgKiAtMTAwIC0gMjc7XHJcbiAgICBjb25zdCB5ID0gaXNfYm9sZCA/IDAgOiAtMjc3O1xyXG4gICAgY29uc3QgY29sb3JfcGF0aCA9IHtcclxuICAgICAgICBcIum7klwiOiBcIuOCtOOCt+ODg+OCr+mnklwiLFxyXG4gICAgICAgIFwi6LWkXCI6IFwi44K044K344OD44Kv6aeSX+i1pFwiLFxyXG4gICAgfVtjb2xvcl07XHJcbiAgICByZXR1cm4gYDxkaXZcclxuICAgIHN0eWxlPVwid2lkdGg6IDg3cHg7IGhlaWdodDogODdweDsgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAke3h9cHg7IGJhY2tncm91bmQtcG9zaXRpb24teTogJHt5fXB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtjb2xvcl9wYXRofS5zdmcpOyBcIj5cclxuPC9kaXY+YFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gUG9zaXRpb25lZFBpZWNlT25Cb2FyZEhUTUwoY2xtOiBBYnNvbHV0ZUNvbHVtbiwgcnc6IEFic29sdXRlUm93LCBwaWVjZTogTm9uVGFtUGllY2UgfCBcIueah1wiLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZ2V0X3RvcF9sZWZ0KFtydywgY2xtXSk7XHJcbiAgICBpZiAocGllY2UgPT09IFwi55qHXCIpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke1wicm90YXRlKDkwZGVnKVwifVwiPlxyXG4gICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChcIum7klwiLCBcIueah1wiLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9ID0gcGllY2U7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtpc19hc2lkZSA/IFwicm90YXRlKDE4MGRlZylcIiA6IFwiXCJ9XCI+XHJcbiAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKGNvbG9yLCBwcm9mLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcms6IHN0cmluZywgbjogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBsaW5lcyA9IGtpYXJfYXJrLnRyaW0oKS5zcGxpdChcIlxcblwiKTtcclxuICAgIGNvbnNvbGUubG9nKGxpbmVzKTtcclxuICAgIC8vIHdoZW4gbiA9IDAsIG5vdGhpbmcgc2hvdWxkIGJlIGhpZ2hsaWdodGVkXHJcbiAgICBmb3IgKGxldCBpID0gMzsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpbmVzW2ldLnRyaW0oKSA9PT0gXCJcIikgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgZWxlbXNfbGVuZ3RoID0gbGluZXNbaV0uc3BsaXQoLyAvZykuZmlsdGVyKGEgPT4gYSAhPT0gXCJcIikubGVuZ3RoO1xyXG4gICAgICAgIGlmIChuID4gZWxlbXNfbGVuZ3RoIHx8IG4gPD0gMCkge1xyXG4gICAgICAgICAgICBuIC09IGVsZW1zX2xlbmd0aDsgY29udGludWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbiA9IDEgPT4gaGlnaGxpZ2h0IHRoZSBmaXJzdCBlbGVtZW50LCBhbmQgc28gb25cclxuICAgICAgICAgICAgY29uc3QgYXJyID0gbGluZXNbaV0uc3BsaXQoLyAvZyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2pdID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG4tLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA9PT0gMCkgeyBhcnJbal0gPSBgPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjY2NjO1wiPiR7YXJyW2pdfTwvc3Bhbj5gOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGluZXNbaV0gPSBhcnIuam9pbihcIiBcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJraWFfYWtcIikhLmlubmVySFRNTCA9IGxpbmVzLmpvaW4oXCJcXG5cIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQsIFBhcnNlZCwgQ2l1cmxFdmVudCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyXCI7XHJcbmltcG9ydCB7IEJvYXJkLCBmcm9tSGFuemlTZWFzb24sIEhhbnppQ29sb3IsIEhhbnppUHJvZmVzc2lvbiwgTm9uVGFtUGllY2UsIFN0YXRlLCB0b0hhbnppQ29sb3IsIHRvSGFuemlQcm9mZXNzaW9uIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuaW1wb3J0IHsgQWJzb2x1dGVDb29yZCwgQ29sb3IsIFByb2Zlc3Npb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbEJvYXJkKCk6IEJvYXJkIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Szoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEw6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHROOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFQ6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRaOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdE86IFwi55qHXCIsXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFg6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRDOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE06IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRQOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUobzoge1xyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nXHJcblx0fSxcclxuXHRhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdH0sXHJcbn0pOiBTdGF0ZSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlYXNvbjogXCLmmKVcIixcclxuXHRcdHR1cm46IDAsXHJcblx0XHRyYXRlOiAxLFxyXG5cdFx0d2hvc2VfdHVybjogbnVsbCxcclxuXHRcdGZvY3VzOiB7XHJcblx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBudWxsLFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IG51bGwsXHJcblx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IG51bGxcclxuXHRcdH0sXHJcblx0XHRib2FyZDogZ2V0SW5pdGlhbEJvYXJkKCksXHJcblx0XHRpYV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBvLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0cGxheWVyX25hbWU6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdFx0YV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBvLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0cGxheWVyX25hbWU6IG8uYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRob3AxenVvMTogW10sXHJcblx0XHRcdHNjb3JlOiAyMCxcclxuXHRcdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGZhbHNlLFxyXG5cdFx0fSxcclxuXHRcdGRhdDJfbGlzdF9vbl9kaXNwbGF5OiBudWxsLFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XHJcblx0Y29uc3QgcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdGlmICghcGllY2UpIHsgdGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTsgfVxyXG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdHJldHVybiBwaWVjZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X3RvKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQsIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIpOiBOb25UYW1QaWVjZSB8IHVuZGVmaW5lZCB7XHJcblx0aWYgKHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0pIHtcclxuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRcdGlmIChjYXB0dXJlZF9waWVjZSA9PT0gXCLnmodcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+eah+OBjOaXouOBq+OBguOCiuOBvuOBmWApO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIGNhcHR1cmVkX3BpZWNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XHJcblx0aWYgKHBpZWNlLmlzX2FzaWRlKSB7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiBmYWxzZSB9KTtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IHRydWUgfSk7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb21faG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBvOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH0pIHtcclxuXHRjb25zdCBpbmRleCA9IHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLmZpbmRJbmRleChrID0+IGsuY29sb3IgPT09IG8uY29sb3IgJiYgay5wcm9mID09PSBvLnByb2YpO1xyXG5cdGlmIChpbmRleCA9PT0gLTEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDmjIHjgaHpp5Ljgaske28uY29sb3J9JHtvLnByb2Z944GM44GC44KK44G+44Gb44KTYCk7XHJcblx0fVxyXG5cdHN0YXRlW28uaXNfYXNpZGUgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCJdLmhvcDF6dW8xLnNwbGljZShpbmRleCwgMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGNpdXJsX2V2ZW50OiBDaXVybEV2ZW50KTogYm9vbGVhbiB7XHJcblx0aWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwibm9fY2l1cmxfZXZlbnRcIikge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcIm9ubHlfc3RlcHBpbmdcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LmluZmFmdGVyc3RlcF9zdWNjZXNzO1xyXG5cdH0gZWxzZSBpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJoYXNfd2F0ZXJfZW50cnlcIikge1xyXG5cdFx0cmV0dXJuIGNpdXJsX2V2ZW50LndhdGVyX2VudHJ5X2NpdXJsID49IDM7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gY2l1cmxfZXZlbnQ7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gY2l1cmxfZXZlbnQudHlwZVwiKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRTdGF0ZShvbGRfc3RhdGU6IFJlYWRvbmx5PFN0YXRlPiwgYm9keV9lbGVtZW50OiBCb2R5RWxlbWVudCwgc3RhcnRpbmdfcGxheWVyczogSGFuemlDb2xvcltdKTogU3RhdGUgfCBudWxsIHtcclxuXHRjb25zdCBuZXdfc3RhdGU6IFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvbGRfc3RhdGUpKTtcclxuXHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IG51bGwpIHtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gc3RhcnRpbmdfcGxheWVyc1tmcm9tSGFuemlTZWFzb24ob2xkX3N0YXRlLnNlYXNvbildID09PSBcIui1pFwiID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIGNsZWFyIHRoZSBmbGFnc1xyXG5cdG5ld19zdGF0ZS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdHNyYzogbnVsbCxcclxuXHRcdGFjdHVhbF9maW5hbF9kZXN0OiBudWxsLFxyXG5cdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IG51bGxcclxuXHR9O1xyXG5cclxuXHRpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwic2Vhc29uX2VuZHNcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5YasXCIpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuc2Vhc29uID1cclxuXHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxyXG5cdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5aSPXCIgPyBcIueni1wiIDpcclxuXHRcdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi56eLXCIgPyBcIuWGrFwiIDpcclxuXHRcdFx0XHRcdFx0KCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKCkgfSkoKTtcclxuXHRcdG5ld19zdGF0ZS50dXJuID0gMDtcclxuXHRcdG5ld19zdGF0ZS5ib2FyZCA9IGdldEluaXRpYWxCb2FyZCgpO1xyXG5cdFx0cmV0dXJuIG5ld19zdGF0ZTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImZyb21faG9wenVvXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLnR1cm4rKztcclxuXHRcdGNvbnN0IGRhdGE6IHtcclxuXHRcdFx0dHlwZTogXCJGcm9tSG9wMVp1bzFcIjtcclxuXHRcdFx0Y29sb3I6IENvbG9yO1xyXG5cdFx0XHRwcm9mOiBQcm9mZXNzaW9uO1xyXG5cdFx0XHRkZXN0OiBBYnNvbHV0ZUNvb3JkO1xyXG5cdFx0fSA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhO1xyXG5cdFx0Y29uc3QgY29sb3IgPSB0b0hhbnppQ29sb3IoZGF0YS5jb2xvcik7XHJcblx0XHRjb25zdCBwcm9mID0gdG9IYW56aVByb2Zlc3Npb24oZGF0YS5wcm9mKTtcclxuXHRcdGNvbnN0IGlzX2FzaWRlID0gbmV3X3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCI7XHJcblx0XHRyZW1vdmVfZnJvbV9ob3AxenVvMShuZXdfc3RhdGUsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0c2V0X3RvKG5ld19zdGF0ZSwgZGF0YS5kZXN0LCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9KTtcclxuXHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGRhdGEuZGVzdCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IGlzX2FzaWRlID8gXCJhX3NpZGVfaG9wMXp1bzFcIiA6IFwiaWFfc2lkZV9ob3AxenVvMVwiXHJcblx0XHR9XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJub3JtYWxfbW92ZVwiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJhX3NpZGVcIjtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImlhX3NpZGVcIjtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS50dXJuKys7XHJcblx0XHRpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNTdGVwRHN0XCIpIHtcclxuXHRcdFx0aWYgKGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZS5jaXVybF9ldmVudCkpIHtcclxuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcclxuXHRcdFx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHBpZWNlKTtcclxuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIGZhaWxlZCBhdHRlbXB0XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGVgKTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImVuZF9zZWFzb25cIikge1xyXG5cdFx0bmV3X3N0YXRlLmRhdDJfbGlzdF9vbl9kaXNwbGF5ID0gbnVsbDtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0YXhvdFwiKSB7XHJcblx0XHRuZXdfc3RhdGUuZGF0Ml9saXN0X29uX2Rpc3BsYXkgPSB7IHR5cGU6IFwidGF4b3RcIiwgaGFuZHM6IGJvZHlfZWxlbWVudC5oYW5kcyB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwidHltb2tcIikge1xyXG5cdFx0bmV3X3N0YXRlLmRhdDJfbGlzdF9vbl9kaXNwbGF5ID0geyB0eXBlOiBcInR5bW9rXCIsIGhhbmRzOiBib2R5X2VsZW1lbnQuaGFuZHMgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRhbV9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3JjKTtcclxuXHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3QsIHBpZWNlKTtcclxuXHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog55qH44GM6KGM44GT44GG44Go44GX44Gm44GE44KLJHtib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdFsxXX0ke2JvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0WzBdfeOBq+OBryR7bWF5YmVfY2FwdHVyZWRfcGllY2UuY29sb3J9JHttYXliZV9jYXB0dXJlZF9waWVjZS5wcm9mfeOBjOaXouOBq+OBguOCiuOBvuOBmWApXHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LnNyYyxcclxuXHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnN0ZXBTdHlsZSA9PT0gXCJOb1N0ZXBcIiA/IG51bGwgOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3RlcCxcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZmlyc3REZXN0XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50O1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC50eXBlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3X3N0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQ6IFJlYWRvbmx5PFBhcnNlZD4pOiBTdGF0ZVtdIHtcclxuXHRpZiAoIXBhcnNlZC5zdGFydGluZ19wbGF5ZXJzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvZG86IGN1cnJlbnQgaW1wbGVtZW50YXRpb24gcmVxdWlyZXMg5LiA5L2N6ImyLiBcclxuXHRcdFRvIHJlc29sdmUgdGhpcywgSSB3b3VsZCBuZWVkIHRvIHVuY29tbWVudCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiXHJcblx0XHRpbiBTdGF0ZS53aG9zZV90dXJuIOOBl+OBpuOAgeeah+S7peWkluOBrumnkuOCkuWLleOBi+OBl+OBn+OCieOBneOCjOOCkuWFg+OBq+mAhuOBq+i+v+OBo+OBpuino+a2iOOBmeOCi+OAgeOBv+OBn+OBhOOBquOBruOCkuWFpeOCjOOCi+W/heimgeOBjOOBguOCi+OAgmApO1xyXG5cdH1cclxuXHRsZXQgY3VycmVudF9zdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSh7XHJcblx0XHRpYV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuW8tVwiLCBwbGF5ZXJfbmFtZTogXCLlvLXkuIlcIiB9LFxyXG5cdFx0YV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuadjlwiLCBwbGF5ZXJfbmFtZTogXCLmnY7lm5tcIiB9XHJcblx0fSk7XHJcblx0Y29uc3QgYW5zOiBTdGF0ZVtdID0gW2N1cnJlbnRfc3RhdGVdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IG5leHRfc3RhdGUgPSAoKCkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0sIHBhcnNlZC5zdGFydGluZ19wbGF5ZXJzLnNwbGl0KFwiXCIpIGFzIEhhbnppQ29sb3JbXSlcclxuXHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7aX3jgrnjg4bjg4Pjg5fnm67jgafjga4ke2V9YCk7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfc3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0pKCk7XHJcblx0XHRpZiAoIW5leHRfc3RhdGUpIGJyZWFrO1xyXG5cdFx0YW5zLnB1c2gobmV4dF9zdGF0ZSk7XHJcblx0XHRjdXJyZW50X3N0YXRlID0gbmV4dF9zdGF0ZTtcclxuXHR9XHJcblx0cmV0dXJuIGFucztcclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQsIENvbG9yLCBQcm9mZXNzaW9uLCBTZWFzb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBIYW5kIH0gZnJvbSBcImNlcmtlX2hhbmRzX2FuZF9zY29yZVwiXHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7XHJcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEw6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHROOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFo6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRYOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE06IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRQOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tSGFuemlTZWFzb24oczogSGFuemlTZWFzb24pOiBTZWFzb24ge1xyXG5cdGlmIChzID09PSBcIuaYpVwiKSByZXR1cm4gMDtcclxuXHRlbHNlIGlmIChzID09PSBcIuWkj1wiKSByZXR1cm4gMTtcclxuXHRlbHNlIGlmIChzID09PSBcIueni1wiKSByZXR1cm4gMjtcclxuXHRlbHNlIGlmIChzID09PSBcIuWGrFwiKSByZXR1cm4gMztcclxuXHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogVW5leHBlY3RlZCBzZWFzb24gJHtzfWApXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xyXG5leHBvcnQgdHlwZSBIYW56aUNvbG9yID0gXCLotaRcIiB8IFwi6buSXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hhbnppQ29sb3IoYzogQ29sb3IpOiBIYW56aUNvbG9yIHtcclxuXHRpZiAoYyA9PT0gQ29sb3IuS29rMSkgcmV0dXJuIFwi6LWkXCI7XHJcblx0cmV0dXJuIFwi6buSXCI7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGFuemlQcm9mZXNzaW9uKHA6IFByb2Zlc3Npb24pOiBIYW56aVByb2Zlc3Npb24ge1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkRhdTIpIHJldHVybiBcIuiZjlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkd1YTIpIHJldHVybiBcIuW8k1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLklvKSByZXR1cm4gXCLnjotcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LYXVrMikgcmV0dXJuIFwi5YW1XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS2F1bjEpIHJldHVybiBcIui7ilwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkt1YTIpIHJldHVybiBcIuethlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLk1hdW4xKSByZXR1cm4gXCLppqxcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5OdWFrMSkgcmV0dXJuIFwi6Ii5XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVHVrMikgcmV0dXJuIFwi5berXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVWFpMSkgcmV0dXJuIFwi5bCGXCI7XHJcblx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IFVuZXhwZWN0ZWQgcHJvZmVzc2lvbiAke3B9YClcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRGF0MkRpc3BsYXkgPSB7IHR5cGU6IFwidHltb2tcIiB8IFwidGF4b3RcIiwgaGFuZHM6IEhhbmRbXSB9IHwgbnVsbDtcclxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XHJcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0d2hvc2VfdHVybjogXCJpYV9zaWRlXCIgfCBcImFfc2lkZVwiIC8qfCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiKi8gfCBudWxsLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IHtcclxuXHRcdHN0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdFx0c3JjOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgXCJhX3NpZGVfaG9wMXp1bzFcIixcclxuXHRcdC8vIHwgICAgICAgICAgICAgICAgICAgICAgICB8IFRhbTIgICAgICAgfCB3aGVuIGNpdXJsIGZhaWxzIHwgd2hlbiBvayB8XHJcblx0XHQvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tfFxyXG5cdFx0Ly8gfCBpbml0aWFsbHlfcGxhbm5lZF9kZXN0IHwgZmlyc3REZXN0ICB8IGRlc3QgICAgICAgICAgICAgfCBkZXN0ICAgIHxcclxuXHRcdC8vIHwgYWN0dWFsX2ZpbmFsX2Rlc3QgICAgICB8IHNlY29uZERlc3QgfCBzcmMgICAgICAgICAgICAgIHwgZGVzdCAgICB8XHJcblx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbFxyXG5cdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdH0sXHJcblx0Ym9hcmQ6IEJvYXJkLFxyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogZmFsc2UgfVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogdHJ1ZSB9W10sXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXHJcblx0fSxcclxuXHRkYXQyX2xpc3Rfb25fZGlzcGxheTogRGF0MkRpc3BsYXksXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5vblRhbVBpZWNlID0geyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgcGFyc2VDZXJrZU9ubGluZUtpYTFBazEsIFBhcnNlZCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSwgaGlnaGxpZ2h0TnRoS2lhMUFrMSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3Qga2lhcl9hcmsgPVxyXG5cdGB75LiA5L2N6ImyOui1pOi1pOi1pH1cclxue+Wni+aZgjoyMDIyLTA0LTAxVDE3OjAwOjI0LjI3OFp9XHJcbnvntYLmmYI6MjAyMi0wNC0wMVQxNzo1OTo0MC44NTdafVxyXG5MReW8k0xJTFXmqYvkuowgICAgWEFV6JmOWkFJVFnnhKHmkoPoo4FcclxuTFXlvJNMQUlMQVXmqYvkuIDmiYvpu5LlvJMgICAgS0FV5berTEFV54Sh5pKD6KOB5omL6LWk5byTXHJcbk5J5YW1TkXnhKHmkoPoo4EgICAg6LWk5byTTk9cclxuTkHou4pOSeeEoeaSg+ijgSAgICBLSUHnrYZLQUlLWeapi+S4gFxyXG5OReWFtU5JTk/msLTkuozmraTnhKEgICAgS1nnrYZLSUtF5qmL5LqM5omL6LWk5berXHJcbktB562GS0XnhKHmkoPoo4HmiYvotaTnrYYgICAgWk/nmodbVFVdWlVcclxuWEXomY5DSVhV5qmL5ZubICAgIE5BSeWFtU5BVeeEoeaSg+ijgVxyXG5OReWFtU5JTk/msLTkuInmiYvotaTlvJMgICAgVFnomY5YVeeEoeaSg+ijgeaJi+m7kuiZjlxyXG5UReiZjlpJWFXmqYvlm5vmiYvotaTomY4gICAgTEFV5berTkFVTkFJ54Sh5pKD6KOBXHJcblhV6JmOTkFJ54Sh5pKD6KOB5omL6buS5berICAgIFRBVeiZjk5BSeeEoeaSg+ijgeaJi+i1pOiZjlxyXG5YSeWFtVhV54Sh5pKD6KOBICAgIE5BSeiZjlhV54Sh5pKD6KOB5omL6LWk5YW1XHJcblpB546LWEFDReeEoeaSg+ijgSAgICDotaTlt6tOQUlcclxu6buS5byTWk8gICAgWkFJ6Ii5Wk/nhKHmkoPoo4HmiYvpu5LlvJNcclxuTUXlvJNDRVhF5qmL5LiJICAgIFpP6Ii5Tk/nhKHmkoPoo4HmiYvpu5LlhbVcclxuQ0XnjotNSVBV54Sh5pKD6KOBICAgIE5BSeW3q1hVUFXmqYvkuozmraTnhKFcclxuTknou4pLQeeEoeaSg+ijgSAgICBOQUnlt6tYVVBV5qmL5LqM5q2k54ShXHJcblhF5byTWFVaT+api+S4gOawtOS4iSAgICBOQUnlt6tYVUNV5qmL5LqMXHJcblpP5byTQ0FJWklB5qmL5LiJ5omL6buS546LXHJcblxyXG7miJbngrrlnLDlv4PliqDnjovliqDnjaPogIzmiYvljYHkupRcclxuXHJcbue1guWtoyAgICDmmKXntYJcclxuXHJcbk1F5byTTUlNVeapi+S4iSAgICBNQVXlvJNNQUlNWeapi+S6jFxyXG5DSeWFtUNF54Sh5pKD6KOBICAgIE1Z5byTTVXnhKHmkoPoo4HmiYvpu5LlvJNcclxuTUnlhbVNVeeEoeaSg+ijgeaJi+i1pOW8kyAgICBDQUnlhbVDQVXnhKHmkoPoo4FcclxuUEXlt6tDRUNJ54Sh5pKD6KOBICAgIFpP55qHW1pZXVpBSVpBVVxyXG5aSeiIuVpBSeeEoeaSg+ijgeaJi+m7kuiIuSAgICBUSUHlsIZUQVVaQUnmsLTnhKHmraTnhKFcclxuVEXomY5OSVRV5qmL54Sh5q2k54ShICAgIFRBVeiZjk5BSUNJ5qmL5Zub5omL6buS5berXHJcbkNF5YW1Q0nnhKHmkoPoo4HmiYvpu5LomY4gICAgWElB5bCGWEFVWkFJ5rC05LiJ5omL6LWk6Ii5XHJcbk1B6aasWElNT+eEoeaSg+ijgSAgICBYQUnlhbVDQUnnhKHmkoPoo4FcclxuVEXomY5OSVRV5qmL5LiJICAgIOm7kuW3q1RZXHJcblhJ5YW1WFXnhKHmkoPoo4EgICAgVFnlt6tDSVpB5qmL5LqM5omL6LWk546LXHJcblxyXG7miJbngrrnjovogIzmiYvkupRcclxu57WC5a2jICAgIOWkj+e1glxyXG5cclxuTUXlvJNNSU1V5qmL5LiJICAgIFhBVeiZjkNBSVhZ5qmL5LqMXHJcbkNJ5YW1Q0XnhKHmkoPoo4EgICAgQ0FJ5YW1Q0FV54Sh5pKD6KOBXHJcblBF5berQ0VDSeeEoeaSg+ijgSAgICBYWeiZjk1VQ0nnhKHmkoPoo4HmiYvpu5Llt6tcclxuQ0XlhbVDSeeEoeaSg+ijgeaJi+i1pOiZjiAgICDpu5Llt6tDQUlcclxuTVXlvJNNQUlDQUnmqYvlm5vmiYvpu5Llt6sgICAgQ0lB6LuKQ0FJ54Sh5pKD6KOB5omL6buS5byTXHJcblhF6JmOQ0lYVeapi+S4iSAgICDpu5LlvJNDWVxyXG5YSeWFtVhVQ1XnhKHmkoPoo4EgICAgWEFJ5YW1WFnnhKHmkoPoo4FcclxuWk/nmodbWlVdWklaRSAgICBaQUnoiLlaSeeEoeaSg+ijgeaJi+i1pOiIuVxyXG5UReiZjlpJ5rC05LiJ5omL6buS6Ii5ICAgIFhZ5YW1WFXnhKHmkoPoo4HmiYvpu5LomY5cclxuWknomY5YVeeEoeaSg+ijgeaJi+i1pOWFtSAgICBUQVXomY5OQUlUWeapi+S6jFxyXG5YVeiZjlRZ54Sh5pKD6KOB5omL6buS6JmOICAgIFRBSeWFtVRZ54Sh5pKD6KOB5omL6LWk6JmOXHJcbum7kuiIuVpJICAgIFpF55qHW1hJXVpVXHJcbum7kuW3q1pPICAgIENBSei7ilpP5rC05LiJ5omL6buS5berXHJcblpV55qHW1hVXVpJWkUgICAgWk/ou4pDSVBB54Sh5pKD6KOB5omL6LWk562GXHJcblpJ6Ii5WklB54Sh5pKD6KOB5omL6buS546LXHJcblxyXG7miJbngrrnjovliqDlkIzoibLnjaPogIzmiYvljYFcclxu57WC5a2jICAgIOeni+e1glxyXG5cclxuXHJcbuaYn+S4gOWRqGA7XHJcblxyXG4gICAgY29uc3QgcGFyc2VkOiBQYXJzZWQgPSBwYXJzZUNlcmtlT25saW5lS2lhMUFrMShraWFyX2Fyayk7XHJcbiAgICBjb25zdCBzdGF0ZXM6IFN0YXRlW10gPSBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJraWFfYWtcIikhLnRleHRDb250ZW50ID0ga2lhcl9hcms7XHJcblxyXG4gICAgZHJhd0VtcHR5Qm9hcmQoKTtcclxuICAgIGNvbnN0IHR1cm5fc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3NsaWRlclwiKSEgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHR1cm5fc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgY29uc3QgbWF4ID0gc3RhdGVzLmxlbmd0aCAtIDE7XHJcbiAgICB0dXJuX3NsaWRlci5tYXggPSBgJHttYXh9YDtcclxuICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gXCIwXCI7XHJcbiAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1swXSk7XHJcbiAgICB0dXJuX3NsaWRlci5vbmlucHV0ID0gdHVybl9zbGlkZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKTtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1dHRvbl9uZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25fbmV4dFwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fbmV4dC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSArIDF9YDtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpOyAvLyBhdXRvbWF0aWNhbGx5IGNyb3BzIHRoZSB2YWx1ZSBhcHByb3ByaWF0ZWx5XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fcHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9wcmV2aW91c1wiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fcHJldmlvdXMub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IGAke051bWJlcih0dXJuX3NsaWRlci52YWx1ZSkgLSAxfWA7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKTsgLy8gYXV0b21hdGljYWxseSBjcm9wcyB0aGUgdmFsdWUgYXBwcm9wcmlhdGVseVxyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX2ZpcnN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25fZmlyc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgYnV0dG9uX2ZpcnN0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gMDtcclxuICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IGAke25ld192YWx1ZX1gO1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX2xhc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9sYXN0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9sYXN0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gbWF4O1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7bmV3X3ZhbHVlfWA7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
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
    var _a;
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
        if (old_state.season === "冬") {
            return null;
        }
        new_state.season =
            old_state.season === "春" ? "夏" :
                old_state.season === "夏" ? "秋" :
                    old_state.season === "秋" ? "冬" :
                        (function () { throw new Error(); })();
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
    }
    else if (body_element.type === "before_taxot") {
        new_state.overlayed_message = { type: "before_taxot", hands: body_element.hands, score: body_element.score };
    }
    else if (body_element.type === "before_tymok") {
        new_state.overlayed_message = { type: "before_tymok", hands: body_element.hands };
    }
    else if (body_element.type === "end_season") {
        if (((_a = old_state.overlayed_message) === null || _a === void 0 ? void 0 : _a.type) !== "before_taxot") {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQSxtQ0FBbUMsb0NBQW9DLGdCQUFnQjtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZFQUFpQjtBQUN0QyxhQUFhLG1CQUFPLENBQUMsaUVBQVc7QUFDaEMsYUFBYSxtQkFBTyxDQUFDLHlFQUFlOzs7Ozs7Ozs7OztBQ2R2QjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ05hO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDOzs7Ozs7Ozs7OztBQ0RoRDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0IsR0FBRyxhQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0QkFBNEIsYUFBYSxLQUFLO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDLGtCQUFrQixLQUFLOzs7Ozs7Ozs7OztBQ3BCakQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QseUJBQXlCLEdBQUcsZ0NBQWdDLEdBQUcsdUJBQXVCLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcscUJBQXFCO0FBQzdKLG1CQUFtQixtQkFBTyxDQUFDLDZFQUFZO0FBQ3ZDLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxpQkFBaUI7QUFDN0I7QUFDQSwrREFBK0QsRUFBRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0ZBQStGLGlCQUFpQjtBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPLGlCQUFpQixnQkFBZ0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsRUFBRTtBQUMzRTtBQUNBLG9CQUFvQiwrQkFBK0I7QUFDbkQ7QUFDQSw0REFBNEQsTUFBTSxxQkFBcUIsRUFBRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRiw2QkFBNkI7QUFDakg7QUFDQSxxRUFBcUUsRUFBRTtBQUN2RTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8sNkJBQTZCLGdCQUFnQjtBQUNwRTtBQUNBLHdEQUF3RCxLQUFLLHFCQUFxQixFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscURBQXFELDhEQUE4RDtBQUNuSDtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLG1CQUFtQjtBQUMvQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsRUFBRTtBQUNuRTtBQUNBLFlBQVksMEJBQTBCO0FBQ3RDO0FBQ0Esb0RBQW9ELEtBQUsscUJBQXFCLEVBQUU7QUFDaEY7QUFDQSxhQUFhO0FBQ2I7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTyx3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUIsaUJBQWlCLE9BQU8saURBQWlEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Qsd0RBQXdEO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNDQUFzQztBQUMxRCxxQkFBcUIsT0FBTyw0REFBNEQ7QUFDeEY7QUFDQTtBQUNBLHFCQUFxQixPQUFPLG9FQUFvRTtBQUNoRztBQUNBO0FBQ0EscUJBQXFCLE9BQU8sbUVBQW1FO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsRUFBRTtBQUN2RDtBQUNBLFlBQVkseUJBQXlCO0FBQ3JDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixrQ0FBa0M7QUFDbEQ7QUFDQSxvREFBb0QsRUFBRSxzQkFBc0IsTUFBTTtBQUNsRjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPLG1CQUFtQixTQUFTO0FBQ25EO0FBQ0Esd0RBQXdELEtBQUsscUJBQXFCLEVBQUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLGlCQUFpQjtBQUM3QjtBQUNBLHVFQUF1RSxFQUFFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixFQUFFO0FBQ2xGO0FBQ0EsWUFBWSxpQ0FBaUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnQ0FBZ0M7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7Ozs7OztBQzNRWjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCwrQkFBK0I7QUFDL0IsOEJBQThCLG1CQUFPLENBQUMsbUdBQXVCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDhCQUE4QjtBQUM5QjtBQUNBLGtCQUFrQjtBQUNsQiw4QkFBOEI7QUFDOUI7QUFDQSxvREFBb0QsYUFBYTtBQUNqRSw4Q0FBOEMsT0FBTyxLQUFLO0FBQzFELDRDQUE0QyxPQUFPLEtBQUs7QUFDeEQ7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLCtCQUErQjs7Ozs7Ozs7Ozs7QUN4QmxCO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWMsR0FBRyxhQUFhLEdBQUcsWUFBWSxHQUFHLGNBQWMsR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHLFlBQVksR0FBRyxZQUFZO0FBQzlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGVBQWU7QUFDM0I7QUFDQSxDQUFDO0FBQ0QsWUFBWTtBQUNaLGtDQUFrQyxxQkFBcUI7QUFDdkQsWUFBWTtBQUNaO0FBQ0EsY0FBYztBQUNkLG1FQUFtRSxtREFBbUQ7QUFDdEgsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxlQUFlO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2Isa0JBQWtCLFlBQVk7QUFDOUIsY0FBYzs7Ozs7Ozs7Ozs7QUNsREQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsMEJBQTBCLEdBQUcsMkJBQTJCLEdBQUcsZ0NBQWdDLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcsaUJBQWlCO0FBQzlKLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDLCtCQUErQixtQkFBTyxDQUFDLHFHQUF3QjtBQUMvRDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsQ0FBQztBQUNELHVCQUF1Qix1REFBdUQsbUJBQW1CO0FBQ2pHLGdDQUFnQyxvREFBb0QsYUFBYTtBQUNqRywyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksWUFBWTtBQUN4QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7Ozs7Ozs7Ozs7O0FDMUdiO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxFQUFFO0FBQ3ZDO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLEtBQUs7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2xGQSxtRUFBb0c7QUFFdkYsY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGtCQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLGlCQUFTLEdBQUcsRUFBRSxDQUFDO0FBRTVCLFNBQWdCLGNBQWM7SUFDMUIsSUFBTSxHQUFHLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRXBGLEtBQUs7SUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFF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LEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEdBQUc7WUFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtB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QyxDQUFDO0lBRUQsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQXVCLENBQUM7SUFDbkYsWUFBWSxDQUFDLE9BQU8sR0FBRztRQUNuQixJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDcEIsV0FBVyxDQUFDLEtBQUssR0FBRyxVQUFHLFNBQVMsQ0FBRSxDQUFDO1FBQ25DLHdCQUFhLEVBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDakMsOEJBQW1CLEVBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBdUIsQ0FBQztJQUNqRixXQUFXLENBQUMsT0FBTyxHQUFHO1FBQ2xCLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUN0QixXQUFXLENBQUMsS0FBSyxHQUFHLFVBQUcsU0FBUyxDQUFFLENBQUM7UUFDbkMsd0JBQWEsRUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQyw4QkFBbUIsRUFBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi9vdGhlcl90eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdGFjdGljcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvdHlwZV9fbWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2hhbmRsZV9ib2R5X2VsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoX21vbmFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9yZWFkX3Bla3plcF9udW1lcmFscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlX19tZXNzYWdlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RhY3RpY3NcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3RoZXJfdHlwZXNcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKlxyXG4gKiBUaGVvcmV0aWNhbGx5IHNwZWFraW5nLCBpdCBpcyBuZWNlc3NhcnkgdG8gZGlzdGluZ3Vpc2ggeDMyIGFuZCB4NjRcclxuICogYmVjYXVzZSBpdCBpcyBwb3NzaWJsZSB0byBzY29yZSAxIHBvaW50ICgzKzMtNSkuXHJcbiAqIE5vdCB0aGF0IGl0IHdpbGwgZXZlciBiZSBvZiB1c2UgaW4gYW55IHJlYWwgc2l0dWF0aW9uLlxyXG4gKi8gXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUHJvZmVzc2lvbiA9IGV4cG9ydHMuQ29sb3IgPSB2b2lkIDA7XHJcbnZhciBDb2xvcjtcclxuKGZ1bmN0aW9uIChDb2xvcikge1xyXG4gICAgQ29sb3JbQ29sb3JbXCJLb2sxXCJdID0gMF0gPSBcIktvazFcIjtcclxuICAgIENvbG9yW0NvbG9yW1wiSHVvazJcIl0gPSAxXSA9IFwiSHVvazJcIjtcclxufSkoQ29sb3IgPSBleHBvcnRzLkNvbG9yIHx8IChleHBvcnRzLkNvbG9yID0ge30pKTtcclxudmFyIFByb2Zlc3Npb247XHJcbihmdW5jdGlvbiAoUHJvZmVzc2lvbikge1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiTnVhazFcIl0gPSAwXSA9IFwiTnVhazFcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdWsyXCJdID0gMV0gPSBcIkthdWsyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJHdWEyXCJdID0gMl0gPSBcIkd1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIkthdW4xXCJdID0gM10gPSBcIkthdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJEYXUyXCJdID0gNF0gPSBcIkRhdTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIk1hdW4xXCJdID0gNV0gPSBcIk1hdW4xXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLdWEyXCJdID0gNl0gPSBcIkt1YTJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIlR1azJcIl0gPSA3XSA9IFwiVHVrMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiVWFpMVwiXSA9IDhdID0gXCJVYWkxXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJJb1wiXSA9IDldID0gXCJJb1wiO1xyXG59KShQcm9mZXNzaW9uID0gZXhwb3J0cy5Qcm9mZXNzaW9uIHx8IChleHBvcnRzLlByb2Zlc3Npb24gPSB7fSkpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IGV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gZXhwb3J0cy5oYW5kbGVZYWt1ID0gZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaGVyc18xID0gcmVxdWlyZShcIi4vbXVuY2hlcnNcIik7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuZnVuY3Rpb24gaGFuZGxlVGFtTW92ZShzKSB7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAocmVzdC5jaGFyQXQoMCkgIT09IFwi55qHXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRhbTIgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgZm9ybWF0IGlzIGVpdGhlcjpcclxuICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICBjb25zdCB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGZpcnN0RGVzdCwgbmV4dCkgPT4gKHsgZmlyc3REZXN0LCBuZXh0IH0pLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAodHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQpIHtcclxuICAgICAgICAvLyBlaXRoZXI6XHJcbiAgICAgICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGZpcnN0RGVzdCwgbmV4dCB9LCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQ7XHJcbiAgICAgICAgaWYgKHJlc3QyID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiTm9TdGVwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLCBmaXJzdERlc3QsIHNlY29uZERlc3Q6IG5leHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyeV9tdW5jaF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgICAgICAgICAgaWYgKCF0cnlfbXVuY2hfY29vcmQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiBzZWNvbmREZXN0LCByZXN0OiBlbXB0eSB9ID0gdHJ5X211bmNoX2Nvb3JkO1xyXG4gICAgICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke2VtcHR5fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7IHR5cGU6IFwiVGFtTW92ZVwiLCBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdMYXR0ZXJcIiwgc3JjLCBmaXJzdERlc3QsIHN0ZXA6IG5leHQsIHNlY29uZERlc3QgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0KSA9PiAoeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSksIG11bmNoZXJzXzEubXVuY2hDb29yZCwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSwgcmVzdDogZW1wdHkgfSA9IG11bmNoO1xyXG4gICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nRm9ybWVyXCIsXHJcbiAgICAgICAgICAgICAgICBzcmMsIHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRhbU1vdmUgPSBoYW5kbGVUYW1Nb3ZlO1xyXG5mdW5jdGlvbiBoYW5kbGVZYWt1KHMpIHtcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo1xyXG4gICAgLy8g5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbiAgICBjb25zdCBoYW5kc1NlcEJ5QXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5zZXBCeTEpKHsgcDogbXVuY2hlcnNfMS5tdW5jaEhhbmQsIHNlcDogKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuWKoFwiKSB9KTtcclxuICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgaGFuZHMpID0+IGhhbmRzLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5oiW54K6XCIpLCBoYW5kc1NlcEJ5QXQpKHMpO1xyXG4gICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGhhbmRzLCByZXN0IH0gPSBtdW5jaDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJiZWZvcmVfdHltb2tcIiwgaGFuZHMgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG11bmNoMiA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKF8sIG51bSkgPT4gbnVtLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi6ICM5omLXCIpLCBtdW5jaGVyc18xLm11bmNoUGVremVwTnVtZXJhbCkocmVzdCk7XHJcbiAgICBpZiAoIW11bmNoMikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNjb3JlLCByZXN0OiByZXN0MiB9ID0gbXVuY2gyO1xyXG4gICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0eXBlOiBcImJlZm9yZV90YXhvdFwiLCBoYW5kcywgc2NvcmUgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZVlha3UgPSBoYW5kbGVZYWt1O1xyXG5jb25zdCBtdW5jaFdhdGVyRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuawtFwiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLnhKHmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIDmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuozmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIlcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLlm5tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkupRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gbXVuY2hXYXRlckV2ZW50O1xyXG5jb25zdCBtdW5jaENpdXJsRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIueEoeaSg+ijgVwiKSkge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm5vX2NpdXJsX2V2ZW50XCIgfSwgcmVzdDogcy5zbGljZSgzKSB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCB3YXRlcl9lbnRyeV9jaXVybDogYW5zIH0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmqYtcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBjb25zdCBzdGVwcGluZ19jaXVybCA9IHRbMF0gPT09IFwi54ShXCIgPyAwIDpcclxuICAgICAgICAgICAgdFswXSA9PT0gXCLkuIBcIiA/IDEgOlxyXG4gICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuoxcIiA/IDIgOlxyXG4gICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LiJXCIgPyAzIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLlm5tcIiA/IDQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkupRcIiA/IDUgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGNoYXJhY3RlciBmb3VuZCBhZnRlciDmqYtcIik7IH0pKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHQuc2xpY2UoMSk7XHJcbiAgICAgICAgLy8gRWl0aGVyIG5vdGhpbmcsIOatpOeEoSwgb3IgbXVuY2hXYXRlckV2ZW50XHJcbiAgICAgICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShyZXN0KTtcclxuICAgICAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiB3YXRlcl9lbnRyeV9jaXVybCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwiaGFzX3dhdGVyX2VudHJ5XCIsIHN0ZXBwaW5nX2NpdXJsLCB3YXRlcl9lbnRyeV9jaXVybCB9LCByZXN0OiByZXN0MiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXN0LnN0YXJ0c1dpdGgoXCLmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHR5cGU6IFwib25seV9zdGVwcGluZ1wiLCBzdGVwcGluZ19jaXVybCwgaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M6IGZhbHNlIH0sIHJlc3Q6IFwiXCIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiB0cnVlIH0sIHJlc3QgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBtdW5jaENpdXJsRXZlbnQ7XHJcbmZ1bmN0aW9uIGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhzKSB7XHJcbiAgICBjb25zdCB0cnlfY2l1cmxfZXZlbnQgPSAoMCwgZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQpKHMpO1xyXG4gICAgaWYgKCF0cnlfY2l1cmxfZXZlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgY2l1cmwgZXZlbnQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBjaXVybF9ldmVudCwgcmVzdCB9ID0gdHJ5X2NpdXJsX2V2ZW50O1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCB9O1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb3B0aW9uYWxfcGllY2VfY2FwdHVyZSA9ICgwLCBtdW5jaGVyc18xLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCkocmVzdCk7XHJcbiAgICBpZiAob3B0aW9uYWxfcGllY2VfY2FwdHVyZSkge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBwaWVjZV9jYXB0dXJlLCByZXN0OiByZXN0MiB9ID0gb3B0aW9uYWxfcGllY2VfY2FwdHVyZTtcclxuICAgICAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFpbGluZyBwYXJhbWV0ZXIgXFxgJHtzfVxcYCBoYXMgc29tZSBleHRyYSBcXGAke3Jlc3QyfVxcYCBhdCB0aGUgZW5kYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50LCBwaWVjZV9jYXB0dXJlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgdHJhaWxpbmcgcGFyYW1ldGVyOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnM7XHJcbmZ1bmN0aW9uIGhhbmRsZUJvZHlFbGVtZW50KHMpIHtcclxuICAgIGlmIChzID09PSBcIuaYpee1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAwIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlpI/ntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi56eL57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWGrOe1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAzIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLntYLlraNcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImVuZF9zZWFzb25cIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5YaN6KGMXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJnb19hZ2FpblwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLmmJ/kuIDlkahcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImdhbWVfc2V0XCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi54K6XCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVlha3Uocyk7XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueah1wiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVUYW1Nb3ZlKHMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2Zyb21faG9wenVvID0gKDAsIG11bmNoZXJzXzEubXVuY2hGcm9tSG9wWnVvKShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfZnJvbV9ob3B6dW8pIHtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBjb2xvciwgcHJvZiwgZGVzdCB9LCByZXN0IH0gPSB0cnlfbXVuY2hfZnJvbV9ob3B6dW87XHJcbiAgICAgICAgaWYgKHJlc3QgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImZyb21faG9wenVvXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRnJvbUhvcDFadW8xXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX3NyYyA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHMpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfc3JjKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc3JjLCByZXN0IH0gPSB0cnlfbXVuY2hfc3JjO1xyXG4gICAgaWYgKCFbXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLoiLlcIiwgXCLniYdcIl0uaW5jbHVkZXMocmVzdC5jaGFyQXQoMCkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCBhIHByb2Zlc3Npb24gd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfMm5kX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8ybmRfY29vcmQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRoZSBzZWNvbmQgY29vcmRpbmF0ZSB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzZWNvbmRfY29vcmQsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfMm5kX2Nvb3JkO1xyXG4gICAgY29uc3QgdHJ5X211bmNoXzNyZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgIGlmICghdHJ5X211bmNoXzNyZF9jb29yZCkge1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QyKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY0RzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBzZWNvbmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHRoaXJkX2Nvb3JkLCByZXN0OiByZXN0MyB9ID0gdHJ5X211bmNoXzNyZF9jb29yZDtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Myk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNTdGVwRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IHNlY29uZF9jb29yZCxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiB0aGlyZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVCb2R5RWxlbWVudCA9IGhhbmRsZUJvZHlFbGVtZW50O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gdm9pZCAwO1xyXG5jb25zdCBoYW5kbGVfYm9keV9lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9oYW5kbGVfYm9keV9lbGVtZW50XCIpO1xyXG4vLyBWZXJ5IHByaW1pdGl2ZSBwYXJzZXIgdGhhdCBuZXZlciBoYW5kbGVzIGFsbCB0aGUgZWRnZSBjYXNlc1xyXG5mdW5jdGlvbiBwYXJzZUNlcmtlT25saW5lS2lhMUFrMShzKSB7XHJcbiAgICBjb25zdCBsaW5lcyA9IHMudHJpbSgpLnNwbGl0KFwiXFxuXCIpLm1hcChsID0+IGwudHJpbSgpKTtcclxuICAgIGNvbnN0IGluaXRpYWxfbGluZSA9IGxpbmVzWzBdO1xyXG4gICAgaWYgKGluaXRpYWxfbGluZSA9PT0gdW5kZWZpbmVkIC8qIFNpbmNlIHdlIHVzZWQgLnNwbGl0KCksIHRoaXMgYWN0dWFsbHkgY2FuJ3QgaGFwcGVuICovIHx8IGluaXRpYWxfbGluZSA9PT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjOOBguOCiuOBvuOBm+OCk1wiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKC9eXFx75aeL5pmCOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvlp4vmmYI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBmeOAguOBk+OCjOOBrzIwMjHlubQxMeaciOacq+OCouODg+ODl+ODh+ODvOODiOS7peWJjeOBruaji+itnOOBp+OBguOCiuOAgeOBvuOBoOWvvuW/nOOBp+OBjeOBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCEvXlxce+S4gOS9jeiJsjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75LiA5L2N6ImyOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydGluZ19wbGF5ZXJzID0gaW5pdGlhbF9saW5lLm1hdGNoKC9eXFx75LiA5L2N6ImyOihb6buS6LWkXSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBzdGFydGluZ190aW1lID0gbGluZXNbMV0/Lm1hdGNoKC9eXFx75aeL5pmCOihbXn1dKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IGVuZGluZ190aW1lID0gbGluZXNbMl0/Lm1hdGNoKC9eXFx757WC5pmCOihbXn1dKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IGJvZGllcyA9IGxpbmVzLnNsaWNlKDMpLmZsYXRNYXAobGluZSA9PiBsaW5lLnNwbGl0KC9bXFxzXFxuXS9nKSkuZmlsdGVyKGEgPT4gYSAhPT0gXCJcIik7XHJcbiAgICBjb25zdCBwYXJzZWRfYm9kaWVzID0gYm9kaWVzLm1hcChoYW5kbGVfYm9keV9lbGVtZW50XzEuaGFuZGxlQm9keUVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIHsgc3RhcnRpbmdfcGxheWVycywgc3RhcnRpbmdfdGltZSwgZW5kaW5nX3RpbWUsIHBhcnNlZF9ib2RpZXMgfTtcclxufVxyXG5leHBvcnRzLnBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gZXhwb3J0cy5tYW55MSA9IGV4cG9ydHMubWFueSA9IGV4cG9ydHMubGlmdE0zID0gZXhwb3J0cy5zdHJpbmcgPSBleHBvcnRzLmxpZnRNMiA9IGV4cG9ydHMucHVyZSA9IGV4cG9ydHMuYmluZCA9IHZvaWQgMDtcclxuLy8gbW9uYWRcclxuY29uc3QgYmluZCA9IChtYSwgY2FsbGJhY2spID0+ICgoaW5wdXQpID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrKGEpKHJlc3QpO1xyXG59KTtcclxuZXhwb3J0cy5iaW5kID0gYmluZDtcclxuY29uc3QgcHVyZSA9IChhKSA9PiAoaW5wdXQpID0+ICh7IGFuczogYSwgcmVzdDogaW5wdXQgfSk7XHJcbmV4cG9ydHMucHVyZSA9IHB1cmU7XHJcbmNvbnN0IGxpZnRNMiA9IChmLCBtYSwgbWIpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYikpKSk7XHJcbmV4cG9ydHMubGlmdE0yID0gbGlmdE0yO1xyXG5jb25zdCBzdHJpbmcgPSAocHJlZml4KSA9PiAoaW5wdXQpID0+IGlucHV0LnN0YXJ0c1dpdGgocHJlZml4KSA/IHsgYW5zOiB1bmRlZmluZWQsIHJlc3Q6IGlucHV0LnNsaWNlKHByZWZpeC5sZW5ndGgpIH0gOiBudWxsO1xyXG5leHBvcnRzLnN0cmluZyA9IHN0cmluZztcclxuY29uc3QgbGlmdE0zID0gKGYsIG1hLCBtYiwgbWMpID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKG1iLCBiID0+ICgwLCBleHBvcnRzLmJpbmQpKG1jLCBjID0+ICgwLCBleHBvcnRzLnB1cmUpKGYoYSwgYiwgYykpKSkpO1xyXG5leHBvcnRzLmxpZnRNMyA9IGxpZnRNMztcclxuY29uc3QgbWFueSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBsZXQgcmVzdCA9IGlucHV0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkgPSBtYW55O1xyXG5jb25zdCBtYW55MSA9IChtYSkgPT4gaW5wdXQgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgbGV0IHsgYW5zOiBhLCByZXN0IH0gPSByZXMxO1xyXG4gICAgY29uc3QgYW5zID0gW2FdO1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBjb25zdCByZXMxID0gbWEocmVzdCk7XHJcbiAgICAgICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiB7IGFucywgcmVzdCB9O1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiBhLCByZXN0OiByIH0gPSByZXMxO1xyXG4gICAgICAgIGFucy5wdXNoKGEpO1xyXG4gICAgICAgIHJlc3QgPSByO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm1hbnkxID0gbWFueTE7XHJcbmNvbnN0IHNlcEJ5MSA9ICh7IHA6IG1hLCBzZXAgfSkgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkoKDAsIGV4cG9ydHMubWFueSkoKDAsIGV4cG9ydHMuYmluZCkoc2VwLCAoXykgPT4gbWEpKSwgYXMgPT4gKDAsIGV4cG9ydHMucHVyZSkoW2EsIC4uLmFzXSkpKTtcclxuZXhwb3J0cy5zZXBCeTEgPSBzZXBCeTE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSBleHBvcnRzLm11bmNoRnJvbUhvcFp1byA9IGV4cG9ydHMubXVuY2hDb29yZCA9IGV4cG9ydHMubXVuY2hIYW5kID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaF9tb25hZF8xID0gcmVxdWlyZShcIi4vbXVuY2hfbW9uYWRcIik7XHJcbmNvbnN0IHJlYWRfcGVremVwX251bWVyYWxzXzEgPSByZXF1aXJlKFwiLi9yZWFkX3Bla3plcF9udW1lcmFsc1wiKTtcclxuY29uc3QgbXVuY2hDb2xvciA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LWkXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUHJvZmVzc2lvbiA9IChzKSA9PiB7XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6Ii5XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDAsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlhbVcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW8k1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6LuKXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDMsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLomY5cIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIummrFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi562GXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDYsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlt6tcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWwhlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA4LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi546LXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDksIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaENvbHVtbiA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBjb2xzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgY29scykge1xyXG4gICAgICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gY29sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogY29sLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUm93ID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCJBSVwiLCBcIkFVXCIsIFwiSUFcIiAvKiBoYW5kbGUgdGhlIGxvbmdlciBvbmVzIGZpcnN0ICovLCBcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKHJvdykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiByb3csIHJlc3Q6IHMuc2xpY2Uocm93Lmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hIYW5kID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGhhbmRzID0gW1wi546LXCIsIFwi542jXCIsIFwi5ZCM6Imy542jXCIsIFwi5Zyw5b+DXCIsIFwi5ZCM6Imy5Zyw5b+DXCIsIFwi6aas5byT5YW1XCIsIFwi5ZCM6Imy6aas5byT5YW1XCIsXHJcbiAgICAgICAgXCLliqnlj4tcIiwgXCLlkIzoibLliqnlj4tcIiwgXCLmiKbpm4ZcIiwgXCLlkIzoibLmiKbpm4ZcIiwgXCLooYzooYxcIiwgXCLlkIzoibLooYzooYxcIiwgXCLnrYblhbXnhKHlgr5cIiwgXCLlkIzoibLnrYblhbXnhKHlgr5cIixcclxuICAgICAgICBcIumXh+aIpuS5i+mbhlwiLCBcIuWQjOiJsumXh+aIpuS5i+mbhlwiLCBcIueEoeaKl+ihjOWHplwiLCBcIuWQjOiJsueEoeaKl+ihjOWHplwiXTtcclxuICAgIGZvciAoY29uc3QgaGFuZCBvZiBoYW5kcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoaGFuZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBoYW5kLCByZXN0OiBzLnNsaWNlKGhhbmQubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoSGFuZCA9IG11bmNoSGFuZDtcclxuZXhwb3J0cy5tdW5jaENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoY29sLCByb3cpID0+IHtcclxuICAgIGNvbnN0IGNvb3JkID0gW3JvdywgY29sXTtcclxuICAgIHJldHVybiBjb29yZDtcclxufSwgbXVuY2hDb2x1bW4sIG11bmNoUm93KTtcclxuZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChjb2xvciwgcHJvZiwgZGVzdCkgPT4gKHsgY29sb3IsIHByb2YsIGRlc3QgfSksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbiwgZXhwb3J0cy5tdW5jaENvb3JkKTtcclxuZXhwb3J0cy5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfLCBjb2xvciwgcHJvZikgPT4gKHsgY29sb3IsIHByb2YgfSksICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiYtcIiksIG11bmNoQ29sb3IsIG11bmNoUHJvZmVzc2lvbik7XHJcbmV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8xLCBjb29yZCwgXzIpID0+IGNvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiW1wiKSwgZXhwb3J0cy5tdW5jaENvb3JkLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwiXVwiKSk7XHJcbmNvbnN0IG11bmNoRGlnaXRMaW56a2xhciA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBkcyA9IFtcIueEoVwiLCBcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiLCBcIuWNgVwiLCBcIuS4i1wiLCBcIueZvlwiXTtcclxuICAgIGZvciAoY29uc3QgZCBvZiBkcykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBkLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoUGVremVwTnVtZXJhbCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCB0MSA9ICgwLCBtdW5jaF9tb25hZF8xLm1hbnkxKShtdW5jaERpZ2l0TGluemtsYXIpKHMpO1xyXG4gICAgaWYgKCF0MSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHsgYW5zLCByZXN0IH0gPSB0MTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgbnVtID0gKDAsIHJlYWRfcGVremVwX251bWVyYWxzXzEuZnJvbURpZ2l0c0xpbnprbGFyKShhbnMpO1xyXG4gICAgICAgIHJldHVybiB7IGFuczogbnVtLCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IG11bmNoUGVremVwTnVtZXJhbDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhcihpKSB7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnhKFcIiAmJiBpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5LiLXCIpIHtcclxuICAgICAgICByZXR1cm4gLWZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIueZvlwiKSB7XHJcbiAgICAgICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAxMDAgKyBmcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbmRleDEwMCA9IGkuaW5kZXhPZihcIueZvlwiKTtcclxuICAgIGlmIChpbmRleDEwMCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBodW5kcmVkcyA9IGkuc2xpY2UoMCwgaW5kZXgxMDApO1xyXG4gICAgICAgIGNvbnN0IG9uZXMgPSBpLnNsaWNlKGluZGV4MTAwICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIDEwMCAqIGZyb21EaWdpdHNMaW56a2xhclN1YihodW5kcmVkcykgKyBmcm9tRGlnaXRzTGluemtsYXJTdWIob25lcyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGlmIChpWzFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICogcGFyc2VVbml0KGlbMF0pICsgcGFyc2VVbml0KGlbMl0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIFwiJHtpfVwiIGFzIGEgcGVremVwIG51bWVyYWxgKTtcclxufVxyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IGZyb21EaWdpdHNMaW56a2xhcjtcclxuZnVuY3Rpb24gcGFyc2VVbml0KG9uZXMpIHtcclxuICAgIGlmIChvbmVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4gFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuoxcIikge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiJXCIpIHtcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWbm1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkupRcIikge1xyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWtXCIpIHtcclxuICAgICAgICByZXR1cm4gNjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4g1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDc7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlhatcIikge1xyXG4gICAgICAgIHJldHVybiA4O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LmdXCIpIHtcclxuICAgICAgICByZXR1cm4gOTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgXCIke29uZXN9XCIgd2hpbGUgdHJ5aW5nIHRvIHBhcnNlIHBla3plcCBudW1lcmFsc2ApO1xyXG59XHJcbmZ1bmN0aW9uIGZyb21EaWdpdHNMaW56a2xhclN1YihpKSB7XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICBpZiAoaVswXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCArIHBhcnNlVW5pdChpWzFdKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlbaS5sZW5ndGggLSAxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSkgKiAxMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGEgPSBpWzBdO1xyXG4gICAgICAgIGNvbnN0IGIgPSBpWzFdO1xyXG4gICAgICAgIGlmIChiID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKSAqIDEwICsgcGFyc2VVbml0KGIpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcbmltcG9ydCB7IE5vblRhbVBpZWNlLCBTdGF0ZSwgSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBwcm9mcywgQm9hcmQsIE92ZXJsYXllZE1lc3NhZ2UgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhlaWdodCA9IDM4NztcclxuZXhwb3J0IGNvbnN0IGxlZnRfbWFyZ2luID0gNDA7XHJcbmV4cG9ydCBjb25zdCB0b3BfbWFyZ2luID0gNDA7XHJcbmV4cG9ydCBjb25zdCBjZWxsX3NpemUgPSA0MztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3RW1wdHlCb2FyZCgpIHtcclxuICAgIGNvbnN0IGN0eCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN2XCIpISBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAvLyDnmoflh6ZcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyNywgNTQuNSUsIDgxLjElKVwiXHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuXHJcbiAgICAvLyDnmofmsLRcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyMTMsIDMzLjYlLCA3OC45JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICAvLyDnmoflsbFcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgxMjksIDM4LjUlLCA0NS40JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoOTksIDk5LCA5OSknO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDAuMDMgKiBoZWlnaHQgLyA5O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgMCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaGVpZ2h0LCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5mb250ID0gXCIyMHB4IHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigwLDAsMClcIjtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIiwgXCJBSVwiLCBcIkFVXCIsIFwiSUFcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCBsZWZ0X21hcmdpbiArIGhlaWdodCArIDEwLCB0b3BfbWFyZ2luICsgMzAgKyBjZWxsX3NpemUgKiBpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByb3dzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpLCB0b3BfbWFyZ2luIC0gMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcblxyXG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJKTtcclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCAtbGVmdF9tYXJnaW4gKyAxMCwgLSh0b3BfbWFyZ2luICsgMTUgKyBjZWxsX3NpemUgKiBpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIC0obGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGkpLCAtKHRvcF9tYXJnaW4gKyBoZWlnaHQgKyAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldF90b3BfbGVmdChjb29yZDogQWJzb2x1dGVDb29yZCkge1xyXG4gICAgY29uc3QgY29sdW1uID0ge1xyXG4gICAgICAgIEs6IDAsXHJcbiAgICAgICAgTDogMSxcclxuICAgICAgICBOOiAyLFxyXG4gICAgICAgIFQ6IDMsXHJcbiAgICAgICAgWjogNCxcclxuICAgICAgICBYOiA1LFxyXG4gICAgICAgIEM6IDYsXHJcbiAgICAgICAgTTogNyxcclxuICAgICAgICBQOiA4XHJcbiAgICB9W2Nvb3JkWzFdXTtcclxuICAgIGNvbnN0IHJvdyA9IHtcclxuICAgICAgICBJQTogOCxcclxuICAgICAgICBBVTogNyxcclxuICAgICAgICBBSTogNiwgWTogNSwgTzogNCwgVTogMywgSTogMiwgRTogMSwgQTogMFxyXG4gICAgfVtjb29yZFswXV07XHJcbiAgICBjb25zdCBsZWZ0ID0gbGVmdF9tYXJnaW4gKyBjZWxsX3NpemUgKiAoY29sdW1uIC0gMC41KTtcclxuICAgIGNvbnN0IHRvcCA9IHRvcF9tYXJnaW4gKyBjZWxsX3NpemUgKiAocm93IC0gMC41KTtcclxuICAgIHJldHVybiB7IGxlZnQsIHRvcCB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb2N1c1BsYW5uZWREZXN0SFRNTChmb2N1c19wbGFubmVkX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfcGxhbm5lZF9kZXN0KSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfcGxhbm5lZF9kZXN0KTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDI1JTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE3OCwgMjU1LCAyNTUpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9jdXNTdGVwcGVkSFRNTChmb2N1c19zdGVwcGVkOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3N0ZXBwZWQpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zdGVwcGVkKTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMCwgMC4zKVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdGb2N1c1NyYyhmb2N1c19zcmM6IEFic29sdXRlQ29vcmQgfCBcImFfc2lkZV9ob3AxenVvMVwiIHwgXCJpYV9zaWRlX2hvcDF6dW8xXCIgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfc3JjIHx8IGZvY3VzX3NyYyA9PT0gXCJhX3NpZGVfaG9wMXp1bzFcIiB8fCBmb2N1c19zcmMgPT09IFwiaWFfc2lkZV9ob3AxenVvMVwiKSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfc3JjKTtcclxuICAgIHJldHVybiBgXHJcbiAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xyXG4gICAgICAgIHdpZHRoOiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBQaWVjZXNPbkJvYXJkSFRNTChib2FyZDogQm9hcmQsIGZvY3VzOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAoY29uc3QgY2xtIGluIGJvYXJkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBydyBpbiBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzX2ZvY3VzZWQgPSBmb2N1cyA/IGZvY3VzWzFdID09PSBjbG0gJiYgZm9jdXNbMF0gPT09IHJ3IDogZmFsc2U7XHJcbiAgICAgICAgICAgIGFucyArPSBQb3NpdGlvbmVkUGllY2VPbkJvYXJkSFRNTChcclxuICAgICAgICAgICAgICAgIGNsbSBhcyBBYnNvbHV0ZUNvbHVtbixcclxuICAgICAgICAgICAgICAgIHJ3IGFzIEFic29sdXRlUm93LFxyXG4gICAgICAgICAgICAgICAgYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSFbcncgYXMgQWJzb2x1dGVSb3ddISxcclxuICAgICAgICAgICAgICAgIGlzX2ZvY3VzZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIEhvcDFadW8xSFRNTChwaWVjZXM6IE5vblRhbVBpZWNlW10sIGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuKSB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiB9ID0gcGllY2VzW2ldO1xyXG4gICAgICAgIGNvbnN0IHJhZCA9IDE4IC8gMC4yNjtcclxuICAgICAgICBhbnMgKz0gYDxsaT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDIzcHg7IFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAke2NlbGxfc2l6ZX1weDsgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpOyBcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0OyBcclxuICAgICAgICAgICAgXCI+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICR7aXNfbmV3bHlfYWNxdWlyZWQgJiYgaSA9PSBwaWVjZXMubGVuZ3RoIC0gMSA/IGA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJHs0MiAtIHJhZH1weDtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7cmFkICogMn1weDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7cmFkICogMn1weDtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNSU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCA2MCwgNTAsIDAuMyk7XHJcbiAgICAgICAgICAgICAgICBcIj48L2Rpdj5gIDogXCJcIn1cclxuICAgICAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKGNvbG9yLCBwcm9mLCBmYWxzZSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbGk+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3R2FtZVN0YXRlKFNUQVRFOiBTdGF0ZSkge1xyXG4gICAgaWYgKFNUQVRFLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5hZGQoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICB9IGVsc2UgaWYgKFNUQVRFLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LmFkZChcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5yZW1vdmUoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXNvbl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5zZWFzb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUudHVybiArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhdGVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUucmF0ZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBIb3AxWnVvMUhUTUwoU1RBVEUuaWFfc2lkZS5ob3AxenVvMSwgU1RBVEUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpZWNlc19pbm5lclwiKSEuaW5uZXJIVE1MID0gRm9jdXNTdGVwcGVkSFRNTChTVEFURS5mb2N1cy5zdGVwcGVkKSArXHJcbiAgICAgICAgZHJhd0ZvY3VzU3JjKFNUQVRFLmZvY3VzLnNyYykgK1xyXG4gICAgICAgIEZvY3VzUGxhbm5lZERlc3RIVE1MKFNUQVRFLmZvY3VzLmluaXRpYWxseV9wbGFubmVkX2Rlc3QpICtcclxuICAgICAgICBQaWVjZXNPbkJvYXJkSFRNTChTVEFURS5ib2FyZCwgU1RBVEUuZm9jdXMuYWN0dWFsX2ZpbmFsX2Rlc3QpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5YWt1X2Rpc3BsYXlcIikhLmlubmVySFRNTCA9IE92ZXJsYXllZE1lc3NhZ2VIVE1MKFNUQVRFLm92ZXJsYXllZF9tZXNzYWdlKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIE92ZXJsYXllZE1lc3NhZ2VIVE1MKGE6IE92ZXJsYXllZE1lc3NhZ2UgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghYSkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjb250ZW50ID0gKChhOiBPdmVybGF5ZWRNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgaWYgKGEudHlwZSA9PT0gXCJiZWZvcmVfdGF4b3RcIiB8fCBhLnR5cGUgPT09IFwiYmVmb3JlX3R5bW9rXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaGFuZHMuam9pbihcIjxicj5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhLnR5cGUgPT09IFwiZW5kX3NlYXNvblwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBg57WC5a2jPGJyPiR7YS5zY29yZX1gO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYS50eXBlID09PSBcImdvX2FnYWluXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGDlho3ooYxgXHJcbiAgICAgICAgfSBlbHNlIGlmIChhLnR5cGUgPT09IFwiZ2FtZV9zZXRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYOaYn+S4gOWRqGBcclxuICAgICAgICB9IGVsc2UgaWYgKGEudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHthLnNlYXNvbn3ntYJgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgXyA6IG5ldmVyID0gYTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IERhdDJEaXNwbGF5LnR5cGUgaXMgaW52YWxpZGApXHJcbiAgICAgICAgfVxyXG4gICAgfSkoYSk7XHJcbiAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogNDY5cHg7XHJcbiAgICBoZWlnaHQ6IDI1NnB4O1xyXG4gICAgdG9wOiAxMzFweDtcclxuICAgIGxlZnQ6IDQ0cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDgwJSk7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbn1cIj4ke2NvbnRlbnR9PC9kaXY+YFxyXG59XHJcblxyXG5mdW5jdGlvbiBOb3JtYWxQaWVjZUhUTUwoY29sb3I6IFwi6buSXCIgfCBcIui1pFwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb25BbmRUYW0sIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHggPSBwcm9mcy5pbmRleE9mKHByb2YpICogLTEwMCAtIDI3O1xyXG4gICAgY29uc3QgeSA9IGlzX2JvbGQgPyAwIDogLTI3NztcclxuICAgIGNvbnN0IGNvbG9yX3BhdGggPSB7XHJcbiAgICAgICAgXCLpu5JcIjogXCLjgrTjgrfjg4Pjgq/pp5JcIixcclxuICAgICAgICBcIui1pFwiOiBcIuOCtOOCt+ODg+OCr+mnkl/otaRcIixcclxuICAgIH1bY29sb3JdO1xyXG4gICAgcmV0dXJuIGA8ZGl2XHJcbiAgICBzdHlsZT1cIndpZHRoOiA4N3B4OyBoZWlnaHQ6IDg3cHg7IGJhY2tncm91bmQtcG9zaXRpb24teDogJHt4fXB4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXk6ICR7eX1weDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7Y29sb3JfcGF0aH0uc3ZnKTsgXCI+XHJcbjwvZGl2PmBcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFBvc2l0aW9uZWRQaWVjZU9uQm9hcmRIVE1MKGNsbTogQWJzb2x1dGVDb2x1bW4sIHJ3OiBBYnNvbHV0ZVJvdywgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIiwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IGdldF90b3BfbGVmdChbcncsIGNsbV0pO1xyXG4gICAgaWYgKHBpZWNlID09PSBcIueah1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtcInJvdGF0ZSg5MGRlZylcIn1cIj5cclxuICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrOiBzdHJpbmcsIG46IG51bWJlcikge1xyXG4gICAgY29uc3QgbGluZXMgPSBraWFyX2Fyay50cmltKCkuc3BsaXQoXCJcXG5cIik7XHJcbiAgICAvLyB3aGVuIG4gPSAwLCBub3RoaW5nIHNob3VsZCBiZSBoaWdobGlnaHRlZFxyXG4gICAgZm9yIChsZXQgaSA9IDM7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChsaW5lc1tpXS50cmltKCkgPT09IFwiXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIGNvbnN0IGVsZW1zX2xlbmd0aCA9IGxpbmVzW2ldLnNwbGl0KC8gL2cpLmZpbHRlcihhID0+IGEgIT09IFwiXCIpLmxlbmd0aDtcclxuICAgICAgICBpZiAobiA+IGVsZW1zX2xlbmd0aCB8fCBuIDw9IDApIHtcclxuICAgICAgICAgICAgbiAtPSBlbGVtc19sZW5ndGg7IGNvbnRpbnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIG4gPSAxID0+IGhpZ2hsaWdodCB0aGUgZmlyc3QgZWxlbWVudCwgYW5kIHNvIG9uXHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IGxpbmVzW2ldLnNwbGl0KC8gL2cpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycltqXSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuLS07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPT09IDApIHsgYXJyW2pdID0gYDxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2NjY2NjYztcIj4ke2FycltqXX08L3NwYW4+YDsgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpbmVzW2ldID0gYXJyLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2lhX2FrXCIpIS5pbm5lckhUTUwgPSBsaW5lcy5qb2luKFwiXFxuXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IEJvZHlFbGVtZW50LCBQYXJzZWQsIENpdXJsRXZlbnQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlclwiO1xyXG5pbXBvcnQgeyBCb2FyZCwgZnJvbUhhbnppU2Vhc29uLCBIYW56aUNvbG9yLCBIYW56aVByb2Zlc3Npb24sIE5vblRhbVBpZWNlLCBTdGF0ZSwgdG9IYW56aUNvbG9yLCB0b0hhbnppUHJvZmVzc2lvbiB9IGZyb20gXCIuL3R5cGVzXCI7XHJcbmltcG9ydCB7IEFic29sdXRlQ29vcmQsIENvbG9yLCBQcm9mZXNzaW9uIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxCb2FyZCgpOiBCb2FyZCB7XHJcblx0cmV0dXJuIHtcclxuXHRcdEs6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRMOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Tjoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRUOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Wjoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRPOiBcIueah1wiLFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRYOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Qzoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRNOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0UDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKG86IHtcclxuXHRpYV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZ1xyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHR9LFxyXG59KTogU3RhdGUge1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWFzb246IFwi5pilXCIsXHJcblx0XHR0dXJuOiAwLFxyXG5cdFx0cmF0ZTogMSxcclxuXHRcdHdob3NlX3R1cm46IG51bGwsXHJcblx0XHRmb2N1czoge1xyXG5cdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogbnVsbCxcclxuXHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0c3JjOiBudWxsLFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBudWxsXHJcblx0XHR9LFxyXG5cdFx0Ym9hcmQ6IGdldEluaXRpYWxCb2FyZCgpLFxyXG5cdFx0aWFfc2lkZToge1xyXG5cdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogby5pYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRob3AxenVvMTogW10sXHJcblx0XHRcdHBsYXllcl9uYW1lOiBvLmlhX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdHNjb3JlOiAyMCxcclxuXHRcdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGZhbHNlLFxyXG5cdFx0fSxcclxuXHRcdGFfc2lkZToge1xyXG5cdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogby5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQsXHJcblx0XHRcdHBsYXllcl9uYW1lOiBvLmFfc2lkZS5wbGF5ZXJfbmFtZSxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRvdmVybGF5ZWRfbWVzc2FnZTogbnVsbCxcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZV9mcm9tKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQpOiBOb25UYW1QaWVjZSB8IFwi55qHXCIge1xyXG5cdGNvbnN0IHBpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRpZiAoIXBpZWNlKSB7IHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDluqfmqJkke2Nvb3JkWzFdfSR7Y29vcmRbMF1944Gr44Gv6aeS44GM44GC44KK44G+44Gb44KTYCk7IH1cclxuXHRkZWxldGUgc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRyZXR1cm4gcGllY2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldF90byhzdGF0ZTogU3RhdGUsIGNvb3JkOiBBYnNvbHV0ZUNvb3JkLCBwaWVjZTogTm9uVGFtUGllY2UgfCBcIueah1wiKTogTm9uVGFtUGllY2UgfCB1bmRlZmluZWQge1xyXG5cdGlmIChzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dKSB7XHJcblx0XHRjb25zdCBjYXB0dXJlZF9waWVjZSA9IHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XHJcblx0XHRpZiAoY2FwdHVyZWRfcGllY2UgPT09IFwi55qHXCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/nmofjgYzml6LjgavjgYLjgorjgb7jgZlgKTtcclxuXHRcdH1cclxuXHRcdHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSBwaWVjZTtcclxuXHRcdHJldHVybiBjYXB0dXJlZF9waWVjZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldF9ob3AxenVvMShzdGF0ZTogU3RhdGUsIHBpZWNlOiBOb25UYW1QaWVjZSkge1xyXG5cdGlmIChwaWVjZS5pc19hc2lkZSkge1xyXG5cdFx0c3RhdGUuaWFfc2lkZS5ob3AxenVvMS5wdXNoKHsgY29sb3I6IHBpZWNlLmNvbG9yLCBwcm9mOiBwaWVjZS5wcm9mLCBpc19hc2lkZTogZmFsc2UgfSk7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gdHJ1ZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3RhdGUuYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiB0cnVlIH0pO1xyXG5cdFx0c3RhdGUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZV9mcm9tX2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgbzogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9KSB7XHJcblx0Y29uc3QgaW5kZXggPSBzdGF0ZVtvLmlzX2FzaWRlID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiXS5ob3AxenVvMS5maW5kSW5kZXgoayA9PiBrLmNvbG9yID09PSBvLmNvbG9yICYmIGsucHJvZiA9PT0gby5wcm9mKTtcclxuXHRpZiAoaW5kZXggPT09IC0xKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5oyB44Gh6aeS44GrJHtvLmNvbG9yfSR7by5wcm9mfeOBjOOBguOCiuOBvuOBm+OCk2ApO1xyXG5cdH1cclxuXHRzdGF0ZVtvLmlzX2FzaWRlID8gXCJhX3NpZGVcIiA6IFwiaWFfc2lkZVwiXS5ob3AxenVvMS5zcGxpY2UoaW5kZXgsIDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChjaXVybF9ldmVudDogQ2l1cmxFdmVudCk6IGJvb2xlYW4ge1xyXG5cdGlmIChjaXVybF9ldmVudC50eXBlID09PSBcIm5vX2NpdXJsX2V2ZW50XCIpIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0gZWxzZSBpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJvbmx5X3N0ZXBwaW5nXCIpIHtcclxuXHRcdHJldHVybiBjaXVybF9ldmVudC5pbmZhZnRlcnN0ZXBfc3VjY2VzcztcclxuXHR9IGVsc2UgaWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwiaGFzX3dhdGVyX2VudHJ5XCIpIHtcclxuXHRcdHJldHVybiBjaXVybF9ldmVudC53YXRlcl9lbnRyeV9jaXVybCA+PSAzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjb25zdCBfOiBuZXZlciA9IGNpdXJsX2V2ZW50O1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGNpdXJsX2V2ZW50LnR5cGVcIilcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROZXh0U3RhdGUob2xkX3N0YXRlOiBSZWFkb25seTxTdGF0ZT4sIGJvZHlfZWxlbWVudDogQm9keUVsZW1lbnQsIHN0YXJ0aW5nX3BsYXllcnM6IEhhbnppQ29sb3JbXSk6IFN0YXRlIHwgbnVsbCB7XHJcblx0Y29uc3QgbmV3X3N0YXRlOiBTdGF0ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2xkX3N0YXRlKSk7XHJcblx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBudWxsKSB7XHJcblx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IHN0YXJ0aW5nX3BsYXllcnNbZnJvbUhhbnppU2Vhc29uKG9sZF9zdGF0ZS5zZWFzb24pXSA9PT0gXCLotaRcIiA/IFwiYV9zaWRlXCIgOiBcImlhX3NpZGVcIjtcclxuXHR9XHJcblxyXG5cdC8vIGNsZWFyIHRoZSBmbGFnc1xyXG5cdG5ld19zdGF0ZS5pYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XHJcblx0bmV3X3N0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdHNyYzogbnVsbCxcclxuXHRcdGFjdHVhbF9maW5hbF9kZXN0OiBudWxsLFxyXG5cdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IG51bGxcclxuXHR9O1xyXG5cdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IG51bGw7XHJcblxyXG5cdGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5zZWFzb24gPVxyXG5cdFx0XHRvbGRfc3RhdGUuc2Vhc29uID09PSBcIuaYpVwiID8gXCLlpI9cIiA6XHJcblx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLlpI9cIiA/IFwi56eLXCIgOlxyXG5cdFx0XHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLnp4tcIiA/IFwi5YasXCIgOlxyXG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLnR1cm4gPSAwO1xyXG5cdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBudWxsO1xyXG5cdFx0bmV3X3N0YXRlLmJvYXJkID0gZ2V0SW5pdGlhbEJvYXJkKCk7XHJcblx0XHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSB7IHR5cGU6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiBvbGRfc3RhdGUuc2Vhc29uIH1cclxuXHRcdG5ld19zdGF0ZS5hX3NpZGUuaG9wMXp1bzEgPSBbXTtcclxuXHRcdG5ld19zdGF0ZS5pYV9zaWRlLmhvcDF6dW8xID0gW107XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJnb19hZ2FpblwiKSB7XHJcblx0XHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSB7IHR5cGU6IFwiZ29fYWdhaW5cIiB9O1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZ2FtZV9zZXRcIikge1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImdhbWVfc2V0XCIgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImJlZm9yZV90YXhvdFwiKSB7XHJcblx0XHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSB7IHR5cGU6IFwiYmVmb3JlX3RheG90XCIsIGhhbmRzOiBib2R5X2VsZW1lbnQuaGFuZHMsIHNjb3JlOiBib2R5X2VsZW1lbnQuc2NvcmUgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImJlZm9yZV90eW1va1wiKSB7XHJcblx0XHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSB7IHR5cGU6IFwiYmVmb3JlX3R5bW9rXCIsIGhhbmRzOiBib2R5X2VsZW1lbnQuaGFuZHMgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImVuZF9zZWFzb25cIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZT8udHlwZSAhPT0gXCJiZWZvcmVfdGF4b3RcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCLjgqjjg6njg7w6IOOAjOe1guWto+OAjeOBruWJjeOBq+OBr+OAgeeNsuW+l+OBl+OBn+W9ueOBruS4gOimp+OBjOW/heimgeOBp+OBmVwiKTtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IHsgdHlwZTogXCJlbmRfc2Vhc29uXCIsIHNjb3JlOiBvbGRfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2Uuc2NvcmUgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImZyb21faG9wenVvXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLnR1cm4rKztcclxuXHRcdGNvbnN0IGRhdGE6IHtcclxuXHRcdFx0dHlwZTogXCJGcm9tSG9wMVp1bzFcIjtcclxuXHRcdFx0Y29sb3I6IENvbG9yO1xyXG5cdFx0XHRwcm9mOiBQcm9mZXNzaW9uO1xyXG5cdFx0XHRkZXN0OiBBYnNvbHV0ZUNvb3JkO1xyXG5cdFx0fSA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhO1xyXG5cdFx0Y29uc3QgY29sb3IgPSB0b0hhbnppQ29sb3IoZGF0YS5jb2xvcik7XHJcblx0XHRjb25zdCBwcm9mID0gdG9IYW56aVByb2Zlc3Npb24oZGF0YS5wcm9mKTtcclxuXHRcdGNvbnN0IGlzX2FzaWRlID0gbmV3X3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCI7XHJcblx0XHRyZW1vdmVfZnJvbV9ob3AxenVvMShuZXdfc3RhdGUsIHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0pO1xyXG5cdFx0c2V0X3RvKG5ld19zdGF0ZSwgZGF0YS5kZXN0LCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9KTtcclxuXHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGRhdGEuZGVzdCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogZGF0YS5kZXN0LFxyXG5cdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRzcmM6IGlzX2FzaWRlID8gXCJhX3NpZGVfaG9wMXp1bzFcIiA6IFwiaWFfc2lkZV9ob3AxenVvMVwiXHJcblx0XHR9XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJub3JtYWxfbW92ZVwiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJhX3NpZGVcIjtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImlhX3NpZGVcIjtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS50dXJuKys7XHJcblx0XHRpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNEc3RcIikge1xyXG5cdFx0XHRpZiAoaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoYm9keV9lbGVtZW50LmNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50KSkge1xyXG5cdFx0XHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMpO1xyXG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xyXG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHRcdFx0c2V0X2hvcDF6dW8xKG5ld19zdGF0ZSwgbWF5YmVfY2FwdHVyZWRfcGllY2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBudWxsLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNTdGVwRHN0XCIpIHtcclxuXHRcdFx0aWYgKGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZS5jaXVybF9ldmVudCkpIHtcclxuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcclxuXHRcdFx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHBpZWNlKTtcclxuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIGZhaWxlZCBhdHRlbXB0XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXAsXHJcblx0XHRcdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyY1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGE7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGVgKTtcclxuXHRcdH1cclxuXHRcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRhbV9tb3ZlXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJpYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImFfc2lkZVwiO1xyXG5cdFx0fSBlbHNlIGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gXCJhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiaWFfc2lkZVwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBpZWNlID0gcmVtb3ZlX2Zyb20obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3JjKTtcclxuXHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3QsIHBpZWNlKTtcclxuXHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog55qH44GM6KGM44GT44GG44Go44GX44Gm44GE44KLJHtib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdFsxXX0ke2JvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0WzBdfeOBq+OBryR7bWF5YmVfY2FwdHVyZWRfcGllY2UuY29sb3J9JHttYXliZV9jYXB0dXJlZF9waWVjZS5wcm9mfeOBjOaXouOBq+OBguOCiuOBvuOBmWApXHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LnNyYyxcclxuXHRcdFx0c3RlcHBlZDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnN0ZXBTdHlsZSA9PT0gXCJOb1N0ZXBcIiA/IG51bGwgOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc3RlcCxcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0LFxyXG5cdFx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZmlyc3REZXN0XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50O1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBpbnZhbGlkIHZhbHVlIGluIGJvZHlfZWxlbWVudC50eXBlXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3X3N0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQ6IFJlYWRvbmx5PFBhcnNlZD4pOiBTdGF0ZVtdIHtcclxuXHRpZiAoIXBhcnNlZC5zdGFydGluZ19wbGF5ZXJzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvZG86IGN1cnJlbnQgaW1wbGVtZW50YXRpb24gcmVxdWlyZXMg5LiA5L2N6ImyLiBcclxuXHRcdFRvIHJlc29sdmUgdGhpcywgSSB3b3VsZCBuZWVkIHRvIHVuY29tbWVudCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiXHJcblx0XHRpbiBTdGF0ZS53aG9zZV90dXJuIOOBl+OBpuOAgeeah+S7peWkluOBrumnkuOCkuWLleOBi+OBl+OBn+OCieOBneOCjOOCkuWFg+OBq+mAhuOBq+i+v+OBo+OBpuino+a2iOOBmeOCi+OAgeOBv+OBn+OBhOOBquOBruOCkuWFpeOCjOOCi+W/heimgeOBjOOBguOCi+OAgmApO1xyXG5cdH1cclxuXHRsZXQgY3VycmVudF9zdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSh7XHJcblx0XHRpYV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuW8tVwiLCBwbGF5ZXJfbmFtZTogXCLlvLXkuIlcIiB9LFxyXG5cdFx0YV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuadjlwiLCBwbGF5ZXJfbmFtZTogXCLmnY7lm5tcIiB9XHJcblx0fSk7XHJcblx0Y29uc3QgYW5zOiBTdGF0ZVtdID0gW2N1cnJlbnRfc3RhdGVdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IG5leHRfc3RhdGUgPSAoKCkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0sIHBhcnNlZC5zdGFydGluZ19wbGF5ZXJzLnNwbGl0KFwiXCIpIGFzIEhhbnppQ29sb3JbXSlcclxuXHRcdFx0fSBjYXRjaCAoZTogYW55KSB7XHJcblx0XHRcdFx0YWxlcnQoYCR7aX3jgrnjg4bjg4Pjg5fnm67jgafjga4ke2V9YCk7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfc3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0pKCk7XHJcblx0XHRpZiAoIW5leHRfc3RhdGUpIGJyZWFrO1xyXG5cdFx0YW5zLnB1c2gobmV4dF9zdGF0ZSk7XHJcblx0XHRjdXJyZW50X3N0YXRlID0gbmV4dF9zdGF0ZTtcclxuXHR9XHJcblx0cmV0dXJuIGFucztcclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQsIENvbG9yLCBQcm9mZXNzaW9uLCBTZWFzb24gfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBIYW5kIH0gZnJvbSBcImNlcmtlX2hhbmRzX2FuZF9zY29yZVwiXHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7XHJcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEw6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHROOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFo6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRYOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE06IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRQOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tSGFuemlTZWFzb24oczogSGFuemlTZWFzb24pOiBTZWFzb24ge1xyXG5cdGlmIChzID09PSBcIuaYpVwiKSByZXR1cm4gMDtcclxuXHRlbHNlIGlmIChzID09PSBcIuWkj1wiKSByZXR1cm4gMTtcclxuXHRlbHNlIGlmIChzID09PSBcIueni1wiKSByZXR1cm4gMjtcclxuXHRlbHNlIGlmIChzID09PSBcIuWGrFwiKSByZXR1cm4gMztcclxuXHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogVW5leHBlY3RlZCBzZWFzb24gJHtzfWApXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xyXG5leHBvcnQgdHlwZSBIYW56aUNvbG9yID0gXCLotaRcIiB8IFwi6buSXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hhbnppQ29sb3IoYzogQ29sb3IpOiBIYW56aUNvbG9yIHtcclxuXHRpZiAoYyA9PT0gQ29sb3IuS29rMSkgcmV0dXJuIFwi6LWkXCI7XHJcblx0cmV0dXJuIFwi6buSXCI7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGFuemlQcm9mZXNzaW9uKHA6IFByb2Zlc3Npb24pOiBIYW56aVByb2Zlc3Npb24ge1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkRhdTIpIHJldHVybiBcIuiZjlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkd1YTIpIHJldHVybiBcIuW8k1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLklvKSByZXR1cm4gXCLnjotcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LYXVrMikgcmV0dXJuIFwi5YW1XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS2F1bjEpIHJldHVybiBcIui7ilwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkt1YTIpIHJldHVybiBcIuethlwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLk1hdW4xKSByZXR1cm4gXCLppqxcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5OdWFrMSkgcmV0dXJuIFwi6Ii5XCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVHVrMikgcmV0dXJuIFwi5berXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uVWFpMSkgcmV0dXJuIFwi5bCGXCI7XHJcblx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IFVuZXhwZWN0ZWQgcHJvZmVzc2lvbiAke3B9YClcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgT3ZlcmxheWVkTWVzc2FnZSA9IHsgdHlwZTogXCJiZWZvcmVfdHltb2tcIiwgaGFuZHM6IEhhbmRbXSB9XHJcblx0fCB7IHR5cGU6IFwiYmVmb3JlX3RheG90XCIsIGhhbmRzOiBIYW5kW10sIHNjb3JlOiBudW1iZXIgfVxyXG5cdHwgeyB0eXBlOiBcImdvX2FnYWluXCIgfVxyXG5cdHwgeyB0eXBlOiBcImVuZF9zZWFzb25cIiwgc2NvcmU6IG51bWJlciB9XHJcblx0fCB7IHR5cGU6IFwiZ2FtZV9zZXRcIiB9XHJcblx0fCB7IHR5cGU6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiBIYW56aVNlYXNvbiB9O1xyXG5leHBvcnQgdHlwZSBTdGF0ZSA9IHtcclxuXHRzZWFzb246IEhhbnppU2Vhc29uLFxyXG5cdHR1cm46IG51bWJlcixcclxuXHR3aG9zZV90dXJuOiBcImlhX3NpZGVcIiB8IFwiYV9zaWRlXCIgLyp8IFwiYW1iaWd1b3VzX2FscGhhXCIgfCBcImFtYmlndW91c19iZXRhXCIqLyB8IG51bGwsXHJcblx0cmF0ZTogUmF0ZSxcclxuXHRmb2N1czoge1xyXG5cdFx0c3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0XHRzcmM6IEFic29sdXRlQ29vcmQgfCBudWxsIHwgXCJpYV9zaWRlX2hvcDF6dW8xXCIgfCBcImFfc2lkZV9ob3AxenVvMVwiLFxyXG5cdFx0Ly8gfCAgICAgICAgICAgICAgICAgICAgICAgIHwgVGFtMiAgICAgICB8IHdoZW4gY2l1cmwgZmFpbHMgfCB3aGVuIG9rIHxcclxuXHRcdC8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS18XHJcblx0XHQvLyB8IGluaXRpYWxseV9wbGFubmVkX2Rlc3QgfCBmaXJzdERlc3QgIHwgZGVzdCAgICAgICAgICAgICB8IGRlc3QgICAgfFxyXG5cdFx0Ly8gfCBhY3R1YWxfZmluYWxfZGVzdCAgICAgIHwgc2Vjb25kRGVzdCB8IHNyYyAgICAgICAgICAgICAgfCBkZXN0ICAgIHxcclxuXHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsXHJcblx0XHRhY3R1YWxfZmluYWxfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0fSxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBmYWxzZSB9W10sXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHRcdGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuLFxyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiB0cnVlIH1bXSxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdG92ZXJsYXllZF9tZXNzYWdlOiBPdmVybGF5ZWRNZXNzYWdlIHwgbnVsbCxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBIYW56aUNvbG9yLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBwYXJzZUNlcmtlT25saW5lS2lhMUFrMSwgUGFyc2VkIH0gZnJvbSAnY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlcic7XHJcbmltcG9ydCB7IGRyYXdFbXB0eUJvYXJkLCBkcmF3R2FtZVN0YXRlLCBoaWdobGlnaHROdGhLaWExQWsxIH0gZnJvbSAnLi9kcmF3JztcclxuaW1wb3J0IHsgZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZCB9IGZyb20gJy4vc3RhdGUnO1xyXG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBraWFyX2FyayA9XHJcblx0YHvkuIDkvY3oibI66LWk6LWk6LWkfVxyXG575aeL5pmCOjIwMjItMDQtMDFUMTc6MDA6MjQuMjc4Wn1cclxue+e1guaZgjoyMDIyLTA0LTAxVDE3OjU5OjQwLjg1N1p9XHJcbkxF5byTTElMVeapi+S6jCAgICBYQVXomY5aQUlUWeeEoeaSg+ijgVxyXG5MVeW8k0xBSUxBVeapi+S4gOaJi+m7kuW8kyAgICBLQVXlt6tMQVXnhKHmkoPoo4HmiYvotaTlvJNcclxuTknlhbVOReeEoeaSg+ijgSAgICDotaTlvJNOT1xyXG5OQei7ik5J54Sh5pKD6KOBICAgIEtJQeethktBSUtZ5qmL5LiAXHJcbk5F5YW1TklOT+awtOS6jOatpOeEoSAgICBLWeethktJS0XmqYvkuozmiYvotaTlt6tcclxuS0HnrYZLReeEoeaSg+ijgeaJi+i1pOethiAgICBaT+eah1tUVV1aVVxyXG5YReiZjkNJWFXmqYvlm5sgICAgTkFJ5YW1TkFV54Sh5pKD6KOBXHJcbk5F5YW1TklOT+awtOS4ieaJi+i1pOW8kyAgICBUWeiZjlhV54Sh5pKD6KOB5omL6buS6JmOXHJcblRF6JmOWklYVeapi+Wbm+aJi+i1pOiZjiAgICBMQVXlt6tOQVVOQUnnhKHmkoPoo4FcclxuWFXomY5OQUnnhKHmkoPoo4HmiYvpu5Llt6sgICAgVEFV6JmOTkFJ54Sh5pKD6KOB5omL6LWk6JmOXHJcblhJ5YW1WFXnhKHmkoPoo4EgICAgTkFJ6JmOWFXnhKHmkoPoo4HmiYvotaTlhbVcclxuWkHnjotYQUNF54Sh5pKD6KOBICAgIOi1pOW3q05BSVxyXG7pu5LlvJNaTyAgICBaQUnoiLlaT+eEoeaSg+ijgeaJi+m7kuW8k1xyXG5NReW8k0NFWEXmqYvkuIkgICAgWk/oiLlOT+eEoeaSg+ijgeaJi+m7kuWFtVxyXG5DReeOi01JUFXnhKHmkoPoo4EgICAgTkFJ5berWFVQVeapi+S6jOatpOeEoVxyXG5OSei7iktB54Sh5pKD6KOBICAgIE5BSeW3q1hVUFXmqYvkuozmraTnhKFcclxuWEXlvJNYVVpP5qmL5LiA5rC05LiJICAgIE5BSeW3q1hVQ1XmqYvkuoxcclxuWk/lvJNDQUlaSUHmqYvkuInmiYvpu5LnjotcclxuXHJcbuaIlueCuuWcsOW/g+WKoOeOi+WKoOeNo+iAjOaJi+WNgeS6lFxyXG5cclxu57WC5a2jICAgIOaYpee1glxyXG5cclxuTUXlvJNNSU1V5qmL5LiJICAgIE1BVeW8k01BSU1Z5qmL5LqMXHJcbkNJ5YW1Q0XnhKHmkoPoo4EgICAgTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG5NSeWFtU1V54Sh5pKD6KOB5omL6LWk5byTICAgIENBSeWFtUNBVeeEoeaSg+ijgVxyXG5QReW3q0NFQ0nnhKHmkoPoo4EgICAgWk/nmodbWlldWkFJWkFVXHJcblpJ6Ii5WkFJ54Sh5pKD6KOB5omL6buS6Ii5ICAgIFRJQeWwhlRBVVpBSeawtOeEoeatpOeEoVxyXG5UReiZjk5JVFXmqYvnhKHmraTnhKEgICAgVEFV6JmOTkFJQ0nmqYvlm5vmiYvpu5Llt6tcclxuQ0XlhbVDSeeEoeaSg+ijgeaJi+m7kuiZjiAgICBYSUHlsIZYQVVaQUnmsLTkuInmiYvotaToiLlcclxuTUHppqxYSU1P54Sh5pKD6KOBICAgIFhBSeWFtUNBSeeEoeaSg+ijgVxyXG5UReiZjk5JVFXmqYvkuIkgICAg6buS5berVFlcclxuWEnlhbVYVeeEoeaSg+ijgSAgICBUWeW3q0NJWkHmqYvkuozmiYvotaTnjotcclxuXHJcbuaIlueCuueOi+iAjOaJi+S6lFxyXG7ntYLlraMgICAg5aSP57WCXHJcblxyXG5NReW8k01JTVXmqYvkuIkgICAgWEFV6JmOQ0FJWFnmqYvkuoxcclxuQ0nlhbVDReeEoeaSg+ijgSAgICBDQUnlhbVDQVXnhKHmkoPoo4FcclxuUEXlt6tDRUNJ54Sh5pKD6KOBICAgIFhZ6JmOTVVDSeeEoeaSg+ijgeaJi+m7kuW3q1xyXG5DReWFtUNJ54Sh5pKD6KOB5omL6LWk6JmOICAgIOm7kuW3q0NBSVxyXG5NVeW8k01BSUNBSeapi+Wbm+aJi+m7kuW3qyAgICBDSUHou4pDQUnnhKHmkoPoo4HmiYvpu5LlvJNcclxuWEXomY5DSVhV5qmL5LiJICAgIOm7kuW8k0NZXHJcblhJ5YW1WFVDVeeEoeaSg+ijgSAgICBYQUnlhbVYWeeEoeaSg+ijgVxyXG5aT+eah1taVV1aSVpFICAgIFpBSeiIuVpJ54Sh5pKD6KOB5omL6LWk6Ii5XHJcblRF6JmOWknmsLTkuInmiYvpu5LoiLkgICAgWFnlhbVYVeeEoeaSg+ijgeaJi+m7kuiZjlxyXG5aSeiZjlhV54Sh5pKD6KOB5omL6LWk5YW1ICAgIFRBVeiZjk5BSVRZ5qmL5LqMXHJcblhV6JmOVFnnhKHmkoPoo4HmiYvpu5LomY4gICAgVEFJ5YW1VFnnhKHmkoPoo4HmiYvotaTomY5cclxu6buS6Ii5WkkgICAgWkXnmodbWEldWlVcclxu6buS5berWk8gICAgQ0FJ6LuKWk/msLTkuInmiYvpu5Llt6tcclxuWlXnmodbWFVdWklaRSAgICBaT+i7ikNJUEHnhKHmkoPoo4HmiYvotaTnrYZcclxuWknoiLlaSUHnhKHmkoPoo4HmiYvpu5LnjotcclxuXHJcbuaIlueCuueOi+WKoOWQjOiJsueNo+iAjOaJi+WNgVxyXG7ntYLlraMgICAg56eL57WCXHJcblxyXG5cclxu5pif5LiA5ZGoYDtcclxuXHJcbiAgICBjb25zdCBwYXJzZWQ6IFBhcnNlZCA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKGtpYXJfYXJrKTtcclxuICAgIGNvbnN0IHN0YXRlczogU3RhdGVbXSA9IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtpYV9ha1wiKSEudGV4dENvbnRlbnQgPSBraWFyX2FyaztcclxuXHJcbiAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgY29uc3QgdHVybl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fc2xpZGVyXCIpISBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdHVybl9zbGlkZXIubWluID0gXCIwXCI7XHJcbiAgICBjb25zdCBtYXggPSBzdGF0ZXMubGVuZ3RoIC0gMTtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke21heH1gO1xyXG4gICAgdHVybl9zbGlkZXIudmFsdWUgPSBcIjBcIjtcclxuICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzWzBdKTtcclxuICAgIHR1cm5fc2xpZGVyLm9uaW5wdXQgPSB0dXJuX3NsaWRlci5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpO1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnV0dG9uX25leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9uZXh0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9uZXh0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpICsgMX1gO1xyXG4gICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1dHRvbl9wcmV2aW91cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX3ByZXZpb3VzXCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGJ1dHRvbl9wcmV2aW91cy5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSAtIDF9YDtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpOyAvLyBhdXRvbWF0aWNhbGx5IGNyb3BzIHRoZSB2YWx1ZSBhcHByb3ByaWF0ZWx5XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fZmlyc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9maXJzdFwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBidXR0b25fZmlyc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSAwO1xyXG4gICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7bmV3X3ZhbHVlfWA7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidXR0b25fbGFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2xhc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgYnV0dG9uX2xhc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdfdmFsdWUgPSBtYXg7XHJcbiAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgfVxyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
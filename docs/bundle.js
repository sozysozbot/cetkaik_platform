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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFF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LEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEdBQUc7WUFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtB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QUFXLENBQUMsS0FBSyxHQUFHLFVBQUcsTUFBTSxDQUFDLGFBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztZQUN2RCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsYUFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsOENBQThDO1lBQzNGLHdCQUFhLEVBQUMsUUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakMsOEJBQW1CLEVBQUMsVUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBdUIsQ0FBQztRQUNuRixZQUFZLENBQUMsT0FBTyxHQUFHO1lBQ25CLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNwQixhQUFXLENBQUMsS0FBSyxHQUFHLFVBQUcsU0FBUyxDQUFFLENBQUM7WUFDbkMsd0JBQWEsRUFBQyxRQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQyw4QkFBbUIsRUFBQyxVQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUF1QixDQUFDO1FBQ2pGLFdBQVcsQ0FBQyxPQUFPLEdBQUc7WUFDbEIsSUFBTSxTQUFTLEdBQUcsS0FBRyxDQUFDO1lBQ3RCLGFBQVcsQ0FBQyxLQUFLLEdBQUcsVUFBRyxTQUFTLENBQUUsQ0FBQztZQUNuQyx3QkFBYSxFQUFDLFFBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLDhCQUFtQixFQUFDLFVBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBQ0o7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfYXBpL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2FwaS9saWIvb3RoZXJfdHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL3RhY3RpY3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9hcGkvbGliL3R5cGVfX21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9oYW5kbGVfYm9keV9lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaF9tb25hZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvcmVhZF9wZWt6ZXBfbnVtZXJhbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdHlwZV9fbWVzc2FnZVwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90YWN0aWNzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL290aGVyX3R5cGVzXCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLypcclxuICogVGhlb3JldGljYWxseSBzcGVha2luZywgaXQgaXMgbmVjZXNzYXJ5IHRvIGRpc3Rpbmd1aXNoIHgzMiBhbmQgeDY0XHJcbiAqIGJlY2F1c2UgaXQgaXMgcG9zc2libGUgdG8gc2NvcmUgMSBwb2ludCAoMyszLTUpLlxyXG4gKiBOb3QgdGhhdCBpdCB3aWxsIGV2ZXIgYmUgb2YgdXNlIGluIGFueSByZWFsIHNpdHVhdGlvbi5cclxuICovIFxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlByb2Zlc3Npb24gPSBleHBvcnRzLkNvbG9yID0gdm9pZCAwO1xyXG52YXIgQ29sb3I7XHJcbihmdW5jdGlvbiAoQ29sb3IpIHtcclxuICAgIENvbG9yW0NvbG9yW1wiS29rMVwiXSA9IDBdID0gXCJLb2sxXCI7XHJcbiAgICBDb2xvcltDb2xvcltcIkh1b2syXCJdID0gMV0gPSBcIkh1b2syXCI7XHJcbn0pKENvbG9yID0gZXhwb3J0cy5Db2xvciB8fCAoZXhwb3J0cy5Db2xvciA9IHt9KSk7XHJcbnZhciBQcm9mZXNzaW9uO1xyXG4oZnVuY3Rpb24gKFByb2Zlc3Npb24pIHtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIk51YWsxXCJdID0gMF0gPSBcIk51YWsxXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLYXVrMlwiXSA9IDFdID0gXCJLYXVrMlwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiR3VhMlwiXSA9IDJdID0gXCJHdWEyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJLYXVuMVwiXSA9IDNdID0gXCJLYXVuMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiRGF1MlwiXSA9IDRdID0gXCJEYXUyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJNYXVuMVwiXSA9IDVdID0gXCJNYXVuMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiS3VhMlwiXSA9IDZdID0gXCJLdWEyXCI7XHJcbiAgICBQcm9mZXNzaW9uW1Byb2Zlc3Npb25bXCJUdWsyXCJdID0gN10gPSBcIlR1azJcIjtcclxuICAgIFByb2Zlc3Npb25bUHJvZmVzc2lvbltcIlVhaTFcIl0gPSA4XSA9IFwiVWFpMVwiO1xyXG4gICAgUHJvZmVzc2lvbltQcm9mZXNzaW9uW1wiSW9cIl0gPSA5XSA9IFwiSW9cIjtcclxufSkoUHJvZmVzc2lvbiA9IGV4cG9ydHMuUHJvZmVzc2lvbiB8fCAoZXhwb3J0cy5Qcm9mZXNzaW9uID0ge30pKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5oYW5kbGVCb2R5RWxlbWVudCA9IGV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IGV4cG9ydHMuaGFuZGxlWWFrdSA9IGV4cG9ydHMuaGFuZGxlVGFtTW92ZSA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hlcnNfMSA9IHJlcXVpcmUoXCIuL211bmNoZXJzXCIpO1xyXG5jb25zdCBtdW5jaF9tb25hZF8xID0gcmVxdWlyZShcIi4vbXVuY2hfbW9uYWRcIik7XHJcbmZ1bmN0aW9uIGhhbmRsZVRhbU1vdmUocykge1xyXG4gICAgY29uc3QgdHJ5X211bmNoX3NyYyA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHMpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfc3JjKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc3JjLCByZXN0IH0gPSB0cnlfbXVuY2hfc3JjO1xyXG4gICAgaWYgKHJlc3QuY2hhckF0KDApICE9PSBcIueah1wiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0YW0yIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgLy8gdGhlIGZvcm1hdCBpcyBlaXRoZXI6XHJcbiAgICAvLyAtIFpV55qHW1RPXVRVXHJcbiAgICAvLyAtIFpP55qHW1pVXVpJWkVcclxuICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChmaXJzdERlc3QsIG5leHQpID0+ICh7IGZpcnN0RGVzdCwgbmV4dCB9KSwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0KSB7XHJcbiAgICAgICAgLy8gZWl0aGVyOlxyXG4gICAgICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgICAgICAvLyAtIFpP55qHW1pVXVpJWkVcclxuICAgICAgICBjb25zdCB7IGFuczogeyBmaXJzdERlc3QsIG5leHQgfSwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0O1xyXG4gICAgICAgIGlmIChyZXN0MiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJUYW1Nb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIk5vU3RlcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYywgZmlyc3REZXN0LCBzZWNvbmREZXN0OiBuZXh0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0cnlfbXVuY2hfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICAgICAgICAgIGlmICghdHJ5X211bmNoX2Nvb3JkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB7IGFuczogc2Vjb25kRGVzdCwgcmVzdDogZW1wdHkgfSA9IHRyeV9tdW5jaF9jb29yZDtcclxuICAgICAgICAgICAgaWYgKGVtcHR5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtlbXB0eX1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudDogeyB0eXBlOiBcIlRhbU1vdmVcIiwgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nTGF0dGVyXCIsIHNyYywgZmlyc3REZXN0LCBzdGVwOiBuZXh0LCBzZWNvbmREZXN0IH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyAtIFRZ55qHVEFJW1RBVV1aQVVcclxuICAgICAgICBjb25zdCBtdW5jaCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCkgPT4gKHsgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0IH0pLCBtdW5jaGVyc18xLm11bmNoQ29vcmQsIG11bmNoZXJzXzEubXVuY2hCcmFja2V0ZWRDb29yZCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgICAgICBpZiAoIW11bmNoKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0IH0sIHJlc3Q6IGVtcHR5IH0gPSBtdW5jaDtcclxuICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInRhbV9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgIHN0ZXBTdHlsZTogXCJTdGVwc0R1cmluZ0Zvcm1lclwiLFxyXG4gICAgICAgICAgICAgICAgc3JjLCBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gaGFuZGxlVGFtTW92ZTtcclxuZnVuY3Rpb24gaGFuZGxlWWFrdShzKSB7XHJcbiAgICAvLyDmiJbngrrnjovliqDnjaNcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo+iAjOaJi+WFq1xyXG4gICAgY29uc3QgaGFuZHNTZXBCeUF0ID0gKDAsIG11bmNoX21vbmFkXzEuc2VwQnkxKSh7IHA6IG11bmNoZXJzXzEubXVuY2hIYW5kLCBzZXA6ICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLliqBcIikgfSk7XHJcbiAgICBjb25zdCBtdW5jaCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKF8sIGhhbmRzKSA9PiBoYW5kcywgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuaIlueCulwiKSwgaGFuZHNTZXBCeUF0KShzKTtcclxuICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBoYW5kcywgcmVzdCB9ID0gbXVuY2g7XHJcbiAgICBpZiAocmVzdCA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IFwiYmVmb3JlX3R5bW9rXCIsIGhhbmRzIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBtdW5jaDIgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBudW0pID0+IG51bSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuiAjOaJi1wiKSwgbXVuY2hlcnNfMS5tdW5jaFBla3plcE51bWVyYWwpKHJlc3QpO1xyXG4gICAgaWYgKCFtdW5jaDIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzY29yZSwgcmVzdDogcmVzdDIgfSA9IG11bmNoMjtcclxuICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgdHlwZTogXCJiZWZvcmVfdGF4b3RcIiwgaGFuZHMsIHNjb3JlIH07XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVZYWt1ID0gaGFuZGxlWWFrdTtcclxuY29uc3QgbXVuY2hXYXRlckV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmsLRcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi54Sh5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiA5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqM5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiJXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5ZubXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqUXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IG11bmNoV2F0ZXJFdmVudDtcclxuY29uc3QgbXVuY2hDaXVybEV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLnhKHmkoPoo4FcIikpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJub19jaXVybF9ldmVudFwiIH0sIHJlc3Q6IHMuc2xpY2UoMykgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJoYXNfd2F0ZXJfZW50cnlcIiwgd2F0ZXJfZW50cnlfY2l1cmw6IGFucyB9LCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi5qmLXCIpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHMuc2xpY2UoMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcHBpbmdfY2l1cmwgPSB0WzBdID09PSBcIueEoVwiID8gMCA6XHJcbiAgICAgICAgICAgIHRbMF0gPT09IFwi5LiAXCIgPyAxIDpcclxuICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqMXCIgPyAyIDpcclxuICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS4iVwiID8gMyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5ZubXCIgPyA0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqUXCIgPyA1IDogKCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBjaGFyYWN0ZXIgZm91bmQgYWZ0ZXIg5qmLXCIpOyB9KSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3QgPSB0LnNsaWNlKDEpO1xyXG4gICAgICAgIC8vIEVpdGhlciBub3RoaW5nLCDmraTnhKEsIG9yIG11bmNoV2F0ZXJFdmVudFxyXG4gICAgICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocmVzdCk7XHJcbiAgICAgICAgaWYgKHRyeV9tdW5jaF93YXRlcikge1xyXG4gICAgICAgICAgICBjb25zdCB7IGFuczogd2F0ZXJfZW50cnlfY2l1cmwsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfd2F0ZXI7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCBzdGVwcGluZ19jaXVybCwgd2F0ZXJfZW50cnlfY2l1cmwgfSwgcmVzdDogcmVzdDIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzdC5zdGFydHNXaXRoKFwi5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiBmYWxzZSB9LCByZXN0OiBcIlwiIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJvbmx5X3N0ZXBwaW5nXCIsIHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogdHJ1ZSB9LCByZXN0IH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gbXVuY2hDaXVybEV2ZW50O1xyXG5mdW5jdGlvbiBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocykge1xyXG4gICAgY29uc3QgdHJ5X2NpdXJsX2V2ZW50ID0gKDAsIGV4cG9ydHMubXVuY2hDaXVybEV2ZW50KShzKTtcclxuICAgIGlmICghdHJ5X2NpdXJsX2V2ZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIGNpdXJsIGV2ZW50OiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogY2l1cmxfZXZlbnQsIHJlc3QgfSA9IHRyeV9jaXVybF9ldmVudDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQpKHJlc3QpO1xyXG4gICAgaWYgKG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUpIHtcclxuICAgICAgICBjb25zdCB7IGFuczogcGllY2VfY2FwdHVyZSwgcmVzdDogcmVzdDIgfSA9IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmU7XHJcbiAgICAgICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJhaWxpbmcgcGFyYW1ldGVyIFxcYCR7c31cXGAgaGFzIHNvbWUgZXh0cmEgXFxgJHtyZXN0Mn1cXGAgYXQgdGhlIGVuZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCwgcGllY2VfY2FwdHVyZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIHRyYWlsaW5nIHBhcmFtZXRlcjogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzO1xyXG5mdW5jdGlvbiBoYW5kbGVCb2R5RWxlbWVudChzKSB7XHJcbiAgICBpZiAocyA9PT0gXCLmmKXntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5aSP57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDEgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIueni+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAyIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlhqzntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi57WC5a2jXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJlbmRfc2Vhc29uXCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWGjeihjFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZ29fYWdhaW5cIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5pif5LiA5ZGoXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJnYW1lX3NldFwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueCulwiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVZYWt1KHMpO1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLnmodcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlVGFtTW92ZShzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9mcm9tX2hvcHp1byA9ICgwLCBtdW5jaGVyc18xLm11bmNoRnJvbUhvcFp1bykocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX2Zyb21faG9wenVvKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgY29sb3IsIHByb2YsIGRlc3QgfSwgcmVzdCB9ID0gdHJ5X211bmNoX2Zyb21faG9wenVvO1xyXG4gICAgICAgIGlmIChyZXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJmcm9tX2hvcHp1b1wiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkZyb21Ib3AxWnVvMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2YsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmICghW1wi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi6Ii5XCIsIFwi54mHXCJdLmluY2x1ZGVzKHJlc3QuY2hhckF0KDApKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgYSBwcm9mZXNzaW9uIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoXzJuZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfMm5kX2Nvb3JkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0aGUgc2Vjb25kIGNvb3JkaW5hdGUgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2Vjb25kX2Nvb3JkLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoXzJuZF9jb29yZDtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF8zcmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8zcmRfY29vcmQpIHtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Mik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogc2Vjb25kX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB0aGlyZF9jb29yZCwgcmVzdDogcmVzdDMgfSA9IHRyeV9tdW5jaF8zcmRfY29vcmQ7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjU3RlcERzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBzZWNvbmRfY29vcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogdGhpcmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBoYW5kbGVCb2R5RWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHZvaWQgMDtcclxuY29uc3QgaGFuZGxlX2JvZHlfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vaGFuZGxlX2JvZHlfZWxlbWVudFwiKTtcclxuLy8gVmVyeSBwcmltaXRpdmUgcGFyc2VyIHRoYXQgbmV2ZXIgaGFuZGxlcyBhbGwgdGhlIGVkZ2UgY2FzZXNcclxuZnVuY3Rpb24gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEocykge1xyXG4gICAgY29uc3QgbGluZXMgPSBzLnRyaW0oKS5zcGxpdChcIlxcblwiKS5tYXAobCA9PiBsLnRyaW0oKSk7XHJcbiAgICBjb25zdCBpbml0aWFsX2xpbmUgPSBsaW5lc1swXTtcclxuICAgIGlmIChpbml0aWFsX2xpbmUgPT09IHVuZGVmaW5lZCAvKiBTaW5jZSB3ZSB1c2VkIC5zcGxpdCgpLCB0aGlzIGFjdHVhbGx5IGNhbid0IGhhcHBlbiAqLyB8fCBpbml0aWFsX2xpbmUgPT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgYLjgorjgb7jgZvjgpNcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgvXlxce+Wni+aZgjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75aeL5pmCOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZnjgILjgZPjgozjga8yMDIx5bm0MTHmnIjmnKvjgqLjg4Pjg5fjg4fjg7zjg4jku6XliY3jga7mo4vorZzjgafjgYLjgorjgIHjgb7jgaDlr77lv5zjgafjgY3jgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghL15cXHvkuIDkvY3oibI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+S4gOS9jeiJsjog44Gn5aeL44G+44Gj44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRpbmdfcGxheWVycyA9IGluaXRpYWxfbGluZS5tYXRjaCgvXlxce+S4gOS9jeiJsjooW+m7kui1pF0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdfdGltZSA9IGxpbmVzWzFdPy5tYXRjaCgvXlxce+Wni+aZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBlbmRpbmdfdGltZSA9IGxpbmVzWzJdPy5tYXRjaCgvXlxce+e1guaZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBib2RpZXMgPSBsaW5lcy5zbGljZSgzKS5mbGF0TWFwKGxpbmUgPT4gbGluZS5zcGxpdCgvW1xcc1xcbl0vZykpLmZpbHRlcihhID0+IGEgIT09IFwiXCIpO1xyXG4gICAgY29uc3QgcGFyc2VkX2JvZGllcyA9IGJvZGllcy5tYXAoaGFuZGxlX2JvZHlfZWxlbWVudF8xLmhhbmRsZUJvZHlFbGVtZW50KTtcclxuICAgIHJldHVybiB7IHN0YXJ0aW5nX3BsYXllcnMsIHN0YXJ0aW5nX3RpbWUsIGVuZGluZ190aW1lLCBwYXJzZWRfYm9kaWVzIH07XHJcbn1cclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnNlcEJ5MSA9IGV4cG9ydHMubWFueTEgPSBleHBvcnRzLm1hbnkgPSBleHBvcnRzLmxpZnRNMyA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5saWZ0TTIgPSBleHBvcnRzLnB1cmUgPSBleHBvcnRzLmJpbmQgPSB2b2lkIDA7XHJcbi8vIG1vbmFkXHJcbmNvbnN0IGJpbmQgPSAobWEsIGNhbGxiYWNrKSA9PiAoKGlucHV0KSA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIHJldHVybiBjYWxsYmFjayhhKShyZXN0KTtcclxufSk7XHJcbmV4cG9ydHMuYmluZCA9IGJpbmQ7XHJcbmNvbnN0IHB1cmUgPSAoYSkgPT4gKGlucHV0KSA9PiAoeyBhbnM6IGEsIHJlc3Q6IGlucHV0IH0pO1xyXG5leHBvcnRzLnB1cmUgPSBwdXJlO1xyXG5jb25zdCBsaWZ0TTIgPSAoZiwgbWEsIG1iKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIpKSkpO1xyXG5leHBvcnRzLmxpZnRNMiA9IGxpZnRNMjtcclxuY29uc3Qgc3RyaW5nID0gKHByZWZpeCkgPT4gKGlucHV0KSA9PiBpbnB1dC5zdGFydHNXaXRoKHByZWZpeCkgPyB7IGFuczogdW5kZWZpbmVkLCByZXN0OiBpbnB1dC5zbGljZShwcmVmaXgubGVuZ3RoKSB9IDogbnVsbDtcclxuZXhwb3J0cy5zdHJpbmcgPSBzdHJpbmc7XHJcbmNvbnN0IGxpZnRNMyA9IChmLCBtYSwgbWIsIG1jKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYywgYyA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIsIGMpKSkpKTtcclxuZXhwb3J0cy5saWZ0TTMgPSBsaWZ0TTM7XHJcbmNvbnN0IG1hbnkgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgbGV0IHJlc3QgPSBpbnB1dDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55ID0gbWFueTtcclxuY29uc3QgbWFueTEgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGxldCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIGNvbnN0IGFucyA9IFthXTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55MSA9IG1hbnkxO1xyXG5jb25zdCBzZXBCeTEgPSAoeyBwOiBtYSwgc2VwIH0pID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKCgwLCBleHBvcnRzLm1hbnkpKCgwLCBleHBvcnRzLmJpbmQpKHNlcCwgKF8pID0+IG1hKSksIGFzID0+ICgwLCBleHBvcnRzLnB1cmUpKFthLCAuLi5hc10pKSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gc2VwQnkxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IGV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9IGV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSBleHBvcnRzLm11bmNoQ29vcmQgPSBleHBvcnRzLm11bmNoSGFuZCA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5jb25zdCByZWFkX3Bla3plcF9udW1lcmFsc18xID0gcmVxdWlyZShcIi4vcmVhZF9wZWt6ZXBfbnVtZXJhbHNcIik7XHJcbmNvbnN0IG11bmNoQ29sb3IgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui1pFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFByb2Zlc3Npb24gPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiIuVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5YW1XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlvJNcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui7ilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6JmOXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLppqxcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuethlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA2LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5berXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDcsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlsIZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA5LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hDb2x1bW4gPSAocykgPT4ge1xyXG4gICAgY29uc3QgY29scyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICBpZiAocy5jaGFyQXQoMCkgPT09IGNvbCkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGNvbCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFJvdyA9IChzKSA9PiB7XHJcbiAgICBjb25zdCByb3dzID0gW1wiQUlcIiwgXCJBVVwiLCBcIklBXCIgLyogaGFuZGxlIHRoZSBsb25nZXIgb25lcyBmaXJzdCAqLywgXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChyb3cpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogcm93LCByZXN0OiBzLnNsaWNlKHJvdy5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoSGFuZCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kcyA9IFtcIueOi1wiLCBcIueNo1wiLCBcIuWQjOiJsueNo1wiLCBcIuWcsOW/g1wiLCBcIuWQjOiJsuWcsOW/g1wiLCBcIummrOW8k+WFtVwiLCBcIuWQjOiJsummrOW8k+WFtVwiLFxyXG4gICAgICAgIFwi5Yqp5Y+LXCIsIFwi5ZCM6Imy5Yqp5Y+LXCIsIFwi5oim6ZuGXCIsIFwi5ZCM6Imy5oim6ZuGXCIsIFwi6KGM6KGMXCIsIFwi5ZCM6Imy6KGM6KGMXCIsIFwi562G5YW154Sh5YK+XCIsIFwi5ZCM6Imy562G5YW154Sh5YK+XCIsXHJcbiAgICAgICAgXCLpl4fmiKbkuYvpm4ZcIiwgXCLlkIzoibLpl4fmiKbkuYvpm4ZcIiwgXCLnhKHmipfooYzlh6ZcIiwgXCLlkIzoibLnhKHmipfooYzlh6ZcIl07XHJcbiAgICBmb3IgKGNvbnN0IGhhbmQgb2YgaGFuZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGhhbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogaGFuZCwgcmVzdDogcy5zbGljZShoYW5kLmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0cy5tdW5jaEhhbmQgPSBtdW5jaEhhbmQ7XHJcbmV4cG9ydHMubXVuY2hDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGNvbCwgcm93KSA9PiB7XHJcbiAgICBjb25zdCBjb29yZCA9IFtyb3csIGNvbF07XHJcbiAgICByZXR1cm4gY29vcmQ7XHJcbn0sIG11bmNoQ29sdW1uLCBtdW5jaFJvdyk7XHJcbmV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoY29sb3IsIHByb2YsIGRlc3QpID0+ICh7IGNvbG9yLCBwcm9mLCBkZXN0IH0pLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24sIGV4cG9ydHMubXVuY2hDb29yZCk7XHJcbmV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXywgY29sb3IsIHByb2YpID0+ICh7IGNvbG9yLCBwcm9mIH0pLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5omLXCIpLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24pO1xyXG5leHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfMSwgY29vcmQsIF8yKSA9PiBjb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIltcIiksIGV4cG9ydHMubXVuY2hDb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIl1cIikpO1xyXG5jb25zdCBtdW5jaERpZ2l0TGluemtsYXIgPSAocykgPT4ge1xyXG4gICAgY29uc3QgZHMgPSBbXCLnhKFcIiwgXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIiwgXCLljYFcIiwgXCLkuItcIiwgXCLnmb5cIl07XHJcbiAgICBmb3IgKGNvbnN0IGQgb2YgZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogZCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFBla3plcE51bWVyYWwgPSAocykgPT4ge1xyXG4gICAgY29uc3QgdDEgPSAoMCwgbXVuY2hfbW9uYWRfMS5tYW55MSkobXVuY2hEaWdpdExpbnprbGFyKShzKTtcclxuICAgIGlmICghdDEpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdDE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG51bSA9ICgwLCByZWFkX3Bla3plcF9udW1lcmFsc18xLmZyb21EaWdpdHNMaW56a2xhcikoYW5zKTtcclxuICAgICAgICByZXR1cm4geyBhbnM6IG51bSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBtdW5jaFBla3plcE51bWVyYWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXIoaSkge1xyXG4gICAgaWYgKGlbMF0gPT09IFwi54ShXCIgJiYgaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuS4i1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIC1mcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnmb5cIikge1xyXG4gICAgICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTAwICsgZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5kZXgxMDAgPSBpLmluZGV4T2YoXCLnmb5cIik7XHJcbiAgICBpZiAoaW5kZXgxMDAgIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgaHVuZHJlZHMgPSBpLnNsaWNlKDAsIGluZGV4MTAwKTtcclxuICAgICAgICBjb25zdCBvbmVzID0gaS5zbGljZShpbmRleDEwMCArIDEpO1xyXG4gICAgICAgIHJldHVybiAxMDAgKiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaHVuZHJlZHMpICsgZnJvbURpZ2l0c0xpbnprbGFyU3ViKG9uZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVsxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCAqIHBhcnNlVW5pdChpWzBdKSArIHBhcnNlVW5pdChpWzJdKTtcclxuICAgIH1cclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSBcIiR7aX1cIiBhcyBhIHBla3plcCBudW1lcmFsYCk7XHJcbn1cclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSBmcm9tRGlnaXRzTGluemtsYXI7XHJcbmZ1bmN0aW9uIHBhcnNlVW5pdChvbmVzKSB7XHJcbiAgICBpZiAob25lcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIBcIikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4iVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlm5tcIikge1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDY7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuINcIikge1xyXG4gICAgICAgIHJldHVybiA3O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICByZXR1cm4gODtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS5nVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIFwiJHtvbmVzfVwiIHdoaWxlIHRyeWluZyB0byBwYXJzZSBwZWt6ZXAgbnVtZXJhbHNgKTtcclxufVxyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaSkge1xyXG4gICAgaWYgKGkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpW2kubGVuZ3RoIC0gMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pICogMTA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBhID0gaVswXTtcclxuICAgICAgICBjb25zdCBiID0gaVsxXTtcclxuICAgICAgICBpZiAoYiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSkgKiAxMCArIHBhcnNlVW5pdChiKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBOb25UYW1QaWVjZSwgU3RhdGUsIEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgcHJvZnMsIEJvYXJkLCBPdmVybGF5ZWRNZXNzYWdlIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBoZWlnaHQgPSAzODc7XHJcbmV4cG9ydCBjb25zdCBsZWZ0X21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgdG9wX21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgY2VsbF9zaXplID0gNDM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0VtcHR5Qm9hcmQoKSB7XHJcbiAgICBjb25zdCBjdHggPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdlwiKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgLy8g55qH5YemXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjcsIDU0LjUlLCA4MS4xJSlcIlxyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcblxyXG4gICAgLy8g55qH5rC0XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjEzLCAzMy42JSwgNzguOSUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgLy8g55qH5bGxXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMTI5LCAzOC41JSwgNDUuNCUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDk5LCA5OSwgOTkpJztcclxuICAgIGN0eC5saW5lV2lkdGggPSAwLjAzICogaGVpZ2h0IC8gOTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA5OyBpKyspIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIDAsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGhlaWdodCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAwKTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwwLDApXCI7XHJcbiAgICBjb25zdCBjb2x1bW5zID0gW1wiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCIsIFwiQUlcIiwgXCJBVVwiLCBcIklBXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgbGVmdF9tYXJnaW4gKyBoZWlnaHQgKyAxMCwgdG9wX21hcmdpbiArIDMwICsgY2VsbF9zaXplICogaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm93cyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCBsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSwgdG9wX21hcmdpbiAtIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgLWxlZnRfbWFyZ2luICsgMTAsIC0odG9wX21hcmdpbiArIDE1ICsgY2VsbF9zaXplICogaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCAtKGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpKSwgLSh0b3BfbWFyZ2luICsgaGVpZ2h0ICsgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRfdG9wX2xlZnQoY29vcmQ6IEFic29sdXRlQ29vcmQpIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjb29yZFsxXV07XHJcbiAgICBjb25zdCByb3cgPSB7XHJcbiAgICAgICAgSUE6IDgsXHJcbiAgICAgICAgQVU6IDcsXHJcbiAgICAgICAgQUk6IDYsIFk6IDUsIE86IDQsIFU6IDMsIEk6IDIsIEU6IDEsIEE6IDBcclxuICAgIH1bY29vcmRbMF1dO1xyXG4gICAgY29uc3QgbGVmdCA9IGxlZnRfbWFyZ2luICsgY2VsbF9zaXplICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgY2VsbF9zaXplICogKHJvdyAtIDAuNSk7XHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9jdXNQbGFubmVkRGVzdEhUTUwoZm9jdXNfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3BsYW5uZWRfZGVzdCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3BsYW5uZWRfZGVzdCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAyNSU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxNzgsIDI1NSwgMjU1KVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvY3VzU3RlcHBlZEhUTUwoZm9jdXNfc3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zdGVwcGVkKSByZXR1cm4gXCJcIjtcclxuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBnZXRfdG9wX2xlZnQoZm9jdXNfc3RlcHBlZCk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Rm9jdXNTcmMoZm9jdXNfc3JjOiBBYnNvbHV0ZUNvb3JkIHwgXCJhX3NpZGVfaG9wMXp1bzFcIiB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWZvY3VzX3NyYyB8fCBmb2N1c19zcmMgPT09IFwiYV9zaWRlX2hvcDF6dW8xXCIgfHwgZm9jdXNfc3JjID09PSBcImlhX3NpZGVfaG9wMXp1bzFcIikgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3NyYyk7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICAgICAgbGVmdDogJHtsZWZ0ICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcclxuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgaGVpZ2h0OiAke2NpcmNsZV9yYWRpdXMgKiAyfXB4OyBcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zKVxyXG4gICAgXCI+PC9kaXY+YDtcclxufVxyXG5cclxuZnVuY3Rpb24gUGllY2VzT25Cb2FyZEhUTUwoYm9hcmQ6IEJvYXJkLCBmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGNvbnN0IGNsbSBpbiBib2FyZCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcncgaW4gYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc19mb2N1c2VkID0gZm9jdXMgPyBmb2N1c1sxXSA9PT0gY2xtICYmIGZvY3VzWzBdID09PSBydyA6IGZhbHNlO1xyXG4gICAgICAgICAgICBhbnMgKz0gUG9zaXRpb25lZFBpZWNlT25Cb2FyZEhUTUwoXHJcbiAgICAgICAgICAgICAgICBjbG0gYXMgQWJzb2x1dGVDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBydyBhcyBBYnNvbHV0ZVJvdyxcclxuICAgICAgICAgICAgICAgIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0hW3J3IGFzIEFic29sdXRlUm93XSEsXHJcbiAgICAgICAgICAgICAgICBpc19mb2N1c2VkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBIb3AxWnVvMUhUTUwocGllY2VzOiBOb25UYW1QaWVjZVtdLCBpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbikge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YgfSA9IHBpZWNlc1tpXTtcclxuICAgICAgICBjb25zdCByYWQgPSAxOCAvIDAuMjY7XHJcbiAgICAgICAgYW5zICs9IGA8bGk+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAyM3B4OyBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJHtjZWxsX3NpemV9cHg7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KTsgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDsgXHJcbiAgICAgICAgICAgIFwiPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAke2lzX25ld2x5X2FjcXVpcmVkICYmIGkgPT0gcGllY2VzLmxlbmd0aCAtIDEgPyBgPGRpdiBzdHlsZT1cIlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgNjAsIDUwLCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgXCI+PC9kaXY+YCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAke05vcm1hbFBpZWNlSFRNTChjb2xvciwgcHJvZiwgZmFsc2UpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2xpPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0dhbWVTdGF0ZShTVEFURTogU3RhdGUpIHtcclxuICAgIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QuYWRkKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNlIGlmIChTVEFURS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jb250YWluZXJcIikhLmNsYXNzTGlzdC5hZGQoXCJ0dXJuX2FjdGl2ZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY29udGFpbmVyXCIpIS5jbGFzc0xpc3QucmVtb3ZlKFwidHVybl9hY3RpdmVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2NvbnRhaW5lclwiKSEuY2xhc3NMaXN0LnJlbW92ZShcInR1cm5fYWN0aXZlXCIpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5zY29yZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmFfc2lkZS5ob3AxenVvMSwgU1RBVEUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gSG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEsIFNUQVRFLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IEZvY3VzU3RlcHBlZEhUTUwoU1RBVEUuZm9jdXMuc3RlcHBlZCkgK1xyXG4gICAgICAgIGRyYXdGb2N1c1NyYyhTVEFURS5mb2N1cy5zcmMpICtcclxuICAgICAgICBGb2N1c1BsYW5uZWREZXN0SFRNTChTVEFURS5mb2N1cy5pbml0aWFsbHlfcGxhbm5lZF9kZXN0KSArXHJcbiAgICAgICAgUGllY2VzT25Cb2FyZEhUTUwoU1RBVEUuYm9hcmQsIFNUQVRFLmZvY3VzLmFjdHVhbF9maW5hbF9kZXN0KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWFrdV9kaXNwbGF5XCIpIS5pbm5lckhUTUwgPSBPdmVybGF5ZWRNZXNzYWdlSFRNTChTVEFURS5vdmVybGF5ZWRfbWVzc2FnZSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBPdmVybGF5ZWRNZXNzYWdlSFRNTChhOiBPdmVybGF5ZWRNZXNzYWdlIHwgbnVsbCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIWEpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY29udGVudCA9ICgoYTogT3ZlcmxheWVkTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIGlmIChhLnR5cGUgPT09IFwiYmVmb3JlX3RheG90XCIgfHwgYS50eXBlID09PSBcImJlZm9yZV90eW1va1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhLmhhbmRzLmpvaW4oXCI8YnI+XCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYS50eXBlID09PSBcImVuZF9zZWFzb25cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYOe1guWtozxicj4ke2Euc2NvcmV9YDtcclxuICAgICAgICB9IGVsc2UgaWYgKGEudHlwZSA9PT0gXCJnb19hZ2FpblwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBg5YaN6KGMYFxyXG4gICAgICAgIH0gZWxzZSBpZiAoYS50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGDmmJ/kuIDlkahgXHJcbiAgICAgICAgfSBlbHNlIGlmIChhLnR5cGUgPT09IFwic2Vhc29uX2VuZHNcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7YS5zZWFzb25957WCYFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF8gOiBuZXZlciA9IGE7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBEYXQyRGlzcGxheS50eXBlIGlzIGludmFsaWRgKVxyXG4gICAgICAgIH1cclxuICAgIH0pKGEpO1xyXG4gICAgcmV0dXJuIGA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDQ2OXB4O1xyXG4gICAgaGVpZ2h0OiAyNTZweDtcclxuICAgIHRvcDogMTMxcHg7XHJcbiAgICBsZWZ0OiA0NHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCw4MCUpO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG59XCI+JHtjb250ZW50fTwvZGl2PmBcclxufVxyXG5cclxuZnVuY3Rpb24gTm9ybWFsUGllY2VIVE1MKGNvbG9yOiBcIum7klwiIHwgXCLotaRcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcclxuICAgIGNvbnN0IHkgPSBpc19ib2xkID8gMCA6IC0yNzc7XHJcbiAgICBjb25zdCBjb2xvcl9wYXRoID0ge1xyXG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXHJcbiAgICAgICAgXCLotaRcIjogXCLjgrTjgrfjg4Pjgq/pp5Jf6LWkXCIsXHJcbiAgICB9W2NvbG9yXTtcclxuICAgIHJldHVybiBgPGRpdlxyXG4gICAgc3R5bGU9XCJ3aWR0aDogODdweDsgaGVpZ2h0OiA4N3B4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6ICR7eH1weDsgYmFja2dyb3VuZC1wb3NpdGlvbi15OiAke3l9cHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgke2NvbG9yX3BhdGh9LnN2Zyk7IFwiPlxyXG48L2Rpdj5gXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBQb3NpdGlvbmVkUGllY2VPbkJvYXJkSFRNTChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHsgbGVmdCwgdG9wIH0gPSBnZXRfdG9wX2xlZnQoW3J3LCBjbG1dKTtcclxuICAgIGlmIChwaWVjZSA9PT0gXCLnmodcIikge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7XCJyb3RhdGUoOTBkZWcpXCJ9XCI+XHJcbiAgICAgICAgICAgICR7Tm9ybWFsUGllY2VIVE1MKFwi6buSXCIsIFwi55qHXCIsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0gPSBwaWVjZTtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke2lzX2FzaWRlID8gXCJyb3RhdGUoMTgwZGVnKVwiIDogXCJcIn1cIj5cclxuICAgICAgICAgICAgJHtOb3JtYWxQaWVjZUhUTUwoY29sb3IsIHByb2YsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2Fyazogc3RyaW5nLCBuOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGxpbmVzID0ga2lhcl9hcmsudHJpbSgpLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgLy8gd2hlbiBuID0gMCwgbm90aGluZyBzaG91bGQgYmUgaGlnaGxpZ2h0ZWRcclxuICAgIGZvciAobGV0IGkgPSAzOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobGluZXNbaV0udHJpbSgpID09PSBcIlwiKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCBlbGVtc19sZW5ndGggPSBsaW5lc1tpXS5zcGxpdCgvIC9nKS5maWx0ZXIoYSA9PiBhICE9PSBcIlwiKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKG4gPiBlbGVtc19sZW5ndGggfHwgbiA8PSAwKSB7XHJcbiAgICAgICAgICAgIG4gLT0gZWxlbXNfbGVuZ3RoOyBjb250aW51ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBuID0gMSA9PiBoaWdobGlnaHQgdGhlIGZpcnN0IGVsZW1lbnQsIGFuZCBzbyBvblxyXG4gICAgICAgICAgICBjb25zdCBhcnIgPSBsaW5lc1tpXS5zcGxpdCgvIC9nKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnJbal0gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbi0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuID09PSAwKSB7IGFycltqXSA9IGA8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XCI+JHthcnJbal19PC9zcGFuPmA7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5lc1tpXSA9IGFyci5qb2luKFwiIFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtpYV9ha1wiKSEuaW5uZXJIVE1MID0gbGluZXMuam9pbihcIlxcblwiKTtcclxufVxyXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCwgUGFyc2VkLCBDaXVybEV2ZW50IH0gZnJvbSBcImNlcmtlX29ubGluZV9raWFha19wYXJzZXJcIjtcclxuaW1wb3J0IHsgQm9hcmQsIGZyb21IYW56aVNlYXNvbiwgSGFuemlDb2xvciwgSGFuemlQcm9mZXNzaW9uLCBOb25UYW1QaWVjZSwgU3RhdGUsIHRvSGFuemlDb2xvciwgdG9IYW56aVByb2Zlc3Npb24gfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBBYnNvbHV0ZUNvb3JkLCBDb2xvciwgUHJvZmVzc2lvbiB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsQm9hcmQoKTogQm9hcmQge1xyXG5cdHJldHVybiB7XHJcblx0XHRLOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdE46IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0VDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFo6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0TzogXCLnmodcIixcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0WDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdEM6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0TToge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fSxcclxuXHRcdFA6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShvOiB7XHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmdcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0fSxcclxufSk6IFN0YXRlIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2Vhc29uOiBcIuaYpVwiLFxyXG5cdFx0dHVybjogMCxcclxuXHRcdHJhdGU6IDEsXHJcblx0XHR3aG9zZV90dXJuOiBudWxsLFxyXG5cdFx0Zm9jdXM6IHtcclxuXHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IG51bGwsXHJcblx0XHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRcdHNyYzogbnVsbCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogbnVsbFxyXG5cdFx0fSxcclxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdFx0b3ZlcmxheWVkX21lc3NhZ2U6IG51bGwsXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVfZnJvbShzdGF0ZTogU3RhdGUsIGNvb3JkOiBBYnNvbHV0ZUNvb3JkKTogTm9uVGFtUGllY2UgfCBcIueah1wiIHtcclxuXHRjb25zdCBwaWVjZSA9IHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XHJcblx0aWYgKCFwaWVjZSkgeyB0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApOyB9XHJcblx0ZGVsZXRlIHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XHJcblx0cmV0dXJuIHBpZWNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRfdG8oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCwgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIik6IE5vblRhbVBpZWNlIHwgdW5kZWZpbmVkIHtcclxuXHRpZiAoc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSkge1xyXG5cdFx0Y29uc3QgY2FwdHVyZWRfcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdFx0aWYgKGNhcHR1cmVkX3BpZWNlID09PSBcIueah1wiKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDluqfmqJkke2Nvb3JkWzFdfSR7Y29vcmRbMF1944Gr44Gv55qH44GM5pei44Gr44GC44KK44G+44GZYCk7XHJcblx0XHR9XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gY2FwdHVyZWRfcGllY2U7XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSBwaWVjZTtcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRfaG9wMXp1bzEoc3RhdGU6IFN0YXRlLCBwaWVjZTogTm9uVGFtUGllY2UpIHtcclxuXHRpZiAocGllY2UuaXNfYXNpZGUpIHtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IGZhbHNlIH0pO1xyXG5cdFx0c3RhdGUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IHRydWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0YXRlLmFfc2lkZS5ob3AxenVvMS5wdXNoKHsgY29sb3I6IHBpZWNlLmNvbG9yLCBwcm9mOiBwaWVjZS5wcm9mLCBpc19hc2lkZTogdHJ1ZSB9KTtcclxuXHRcdHN0YXRlLmFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IHRydWU7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVfZnJvbV9ob3AxenVvMShzdGF0ZTogU3RhdGUsIG86IHsgY29sb3I6IEhhbnppQ29sb3IsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IGJvb2xlYW4gfSkge1xyXG5cdGNvbnN0IGluZGV4ID0gc3RhdGVbby5pc19hc2lkZSA/IFwiYV9zaWRlXCIgOiBcImlhX3NpZGVcIl0uaG9wMXp1bzEuZmluZEluZGV4KGsgPT4gay5jb2xvciA9PT0gby5jb2xvciAmJiBrLnByb2YgPT09IG8ucHJvZik7XHJcblx0aWYgKGluZGV4ID09PSAtMSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOaMgeOBoemnkuOBqyR7by5jb2xvcn0ke28ucHJvZn3jgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuXHR9XHJcblx0c3RhdGVbby5pc19hc2lkZSA/IFwiYV9zaWRlXCIgOiBcImlhX3NpZGVcIl0uaG9wMXp1bzEuc3BsaWNlKGluZGV4LCAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoY2l1cmxfZXZlbnQ6IENpdXJsRXZlbnQpOiBib29sZWFuIHtcclxuXHRpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJub19jaXVybF9ldmVudFwiKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9IGVsc2UgaWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwib25seV9zdGVwcGluZ1wiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQuaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcImhhc193YXRlcl9lbnRyeVwiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQud2F0ZXJfZW50cnlfY2l1cmwgPj0gMztcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc3QgXzogbmV2ZXIgPSBjaXVybF9ldmVudDtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBjaXVybF9ldmVudC50eXBlXCIpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFN0YXRlKG9sZF9zdGF0ZTogUmVhZG9ubHk8U3RhdGU+LCBib2R5X2VsZW1lbnQ6IEJvZHlFbGVtZW50LCBzdGFydGluZ19wbGF5ZXJzOiBIYW56aUNvbG9yW10pOiBTdGF0ZSB8IG51bGwge1xyXG5cdGNvbnN0IG5ld19zdGF0ZTogU3RhdGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9sZF9zdGF0ZSkpO1xyXG5cdGlmIChvbGRfc3RhdGUud2hvc2VfdHVybiA9PT0gbnVsbCkge1xyXG5cdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBzdGFydGluZ19wbGF5ZXJzW2Zyb21IYW56aVNlYXNvbihvbGRfc3RhdGUuc2Vhc29uKV0gPT09IFwi6LWkXCIgPyBcImFfc2lkZVwiIDogXCJpYV9zaWRlXCI7XHJcblx0fVxyXG5cclxuXHQvLyBjbGVhciB0aGUgZmxhZ3NcclxuXHRuZXdfc3RhdGUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSBmYWxzZTtcclxuXHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRzcmM6IG51bGwsXHJcblx0XHRhY3R1YWxfZmluYWxfZGVzdDogbnVsbCxcclxuXHRcdHN0ZXBwZWQ6IG51bGwsXHJcblx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBudWxsXHJcblx0fTtcclxuXHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSBudWxsO1xyXG5cclxuXHRpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwic2Vhc29uX2VuZHNcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5YasXCIpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUuc2Vhc29uID1cclxuXHRcdFx0b2xkX3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxyXG5cdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi5aSPXCIgPyBcIueni1wiIDpcclxuXHRcdFx0XHRcdG9sZF9zdGF0ZS5zZWFzb24gPT09IFwi56eLXCIgPyBcIuWGrFwiIDpcclxuXHRcdFx0XHRcdFx0KCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKCkgfSkoKTtcclxuXHRcdG5ld19zdGF0ZS50dXJuID0gMDtcclxuXHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gbnVsbDtcclxuXHRcdG5ld19zdGF0ZS5ib2FyZCA9IGdldEluaXRpYWxCb2FyZCgpO1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogb2xkX3N0YXRlLnNlYXNvbiB9XHJcblx0XHRuZXdfc3RhdGUuYV9zaWRlLmhvcDF6dW8xID0gW107XHJcblx0XHRuZXdfc3RhdGUuaWFfc2lkZS5ob3AxenVvMSA9IFtdO1xyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwiZ29fYWdhaW5cIikge1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImdvX2FnYWluXCIgfTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcclxuXHRcdG5ld19zdGF0ZS5vdmVybGF5ZWRfbWVzc2FnZSA9IHsgdHlwZTogXCJnYW1lX3NldFwiIH07XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJiZWZvcmVfdGF4b3RcIikge1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImJlZm9yZV90YXhvdFwiLCBoYW5kczogYm9keV9lbGVtZW50LmhhbmRzLCBzY29yZTogYm9keV9lbGVtZW50LnNjb3JlIH07XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJiZWZvcmVfdHltb2tcIikge1xyXG5cdFx0bmV3X3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlID0geyB0eXBlOiBcImJlZm9yZV90eW1va1wiLCBoYW5kczogYm9keV9lbGVtZW50LmhhbmRzIH07XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJlbmRfc2Vhc29uXCIpIHtcclxuXHRcdGlmIChvbGRfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2U/LnR5cGUgIT09IFwiYmVmb3JlX3RheG90XCIpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwi44Ko44Op44O8OiDjgIzntYLlraPjgI3jga7liY3jgavjga/jgIHnjbLlvpfjgZfjgZ/lvbnjga7kuIDopqfjgYzlv4XopoHjgafjgZlcIik7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUub3ZlcmxheWVkX21lc3NhZ2UgPSB7IHR5cGU6IFwiZW5kX3NlYXNvblwiLCBzY29yZTogb2xkX3N0YXRlLm92ZXJsYXllZF9tZXNzYWdlLnNjb3JlIH07XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJmcm9tX2hvcHp1b1wiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJhX3NpZGVcIjtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImlhX3NpZGVcIjtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS50dXJuKys7XHJcblx0XHRjb25zdCBkYXRhOiB7XHJcblx0XHRcdHR5cGU6IFwiRnJvbUhvcDFadW8xXCI7XHJcblx0XHRcdGNvbG9yOiBDb2xvcjtcclxuXHRcdFx0cHJvZjogUHJvZmVzc2lvbjtcclxuXHRcdFx0ZGVzdDogQWJzb2x1dGVDb29yZDtcclxuXHRcdH0gPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YTtcclxuXHRcdGNvbnN0IGNvbG9yID0gdG9IYW56aUNvbG9yKGRhdGEuY29sb3IpO1xyXG5cdFx0Y29uc3QgcHJvZiA9IHRvSGFuemlQcm9mZXNzaW9uKGRhdGEucHJvZik7XHJcblx0XHRjb25zdCBpc19hc2lkZSA9IG5ld19zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiO1xyXG5cdFx0cmVtb3ZlX2Zyb21faG9wMXp1bzEobmV3X3N0YXRlLCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9KTtcclxuXHRcdHNldF90byhuZXdfc3RhdGUsIGRhdGEuZGVzdCwgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSk7XHJcblx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBkYXRhLmRlc3QsXHJcblx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGRhdGEuZGVzdCxcclxuXHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0c3JjOiBpc19hc2lkZSA/IFwiYV9zaWRlX2hvcDF6dW8xXCIgOiBcImlhX3NpZGVfaG9wMXp1bzFcIlxyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwibm9ybWFsX21vdmVcIikge1xyXG5cdFx0aWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImlhX3NpZGVcIikge1xyXG5cdFx0XHRuZXdfc3RhdGUud2hvc2VfdHVybiA9IFwiYV9zaWRlXCI7XHJcblx0XHR9IGVsc2UgaWYgKG9sZF9zdGF0ZS53aG9zZV90dXJuID09PSBcImFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJpYV9zaWRlXCI7XHJcblx0XHR9XHJcblx0XHRuZXdfc3RhdGUudHVybisrO1xyXG5cdFx0aWYgKGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGUgPT09IFwiU3JjRHN0XCIpIHtcclxuXHRcdFx0aWYgKGlzU3VjY2Vzc2Z1bGx5Q29tcGxldGVkKGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZS5jaXVybF9ldmVudCkpIHtcclxuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcclxuXHRcdFx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsIHBpZWNlKTtcclxuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSB7XHJcblx0XHRcdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyxcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3RcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIGZhaWxlZCBhdHRlbXB0XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0c3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRhY3R1YWxfZmluYWxfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjLFxyXG5cdFx0XHRcdFx0c3RlcHBlZDogbnVsbCxcclxuXHRcdFx0XHRcdGluaXRpYWxseV9wbGFubmVkX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3RcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGUgPT09IFwiU3JjU3RlcERzdFwiKSB7XHJcblx0XHRcdGlmIChpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChib2R5X2VsZW1lbnQuY2l1cmxfYW5kX2NhcHR1cmUuY2l1cmxfZXZlbnQpKSB7XHJcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XHJcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XHJcblx0XHRcdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRcdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3QsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zdGVwLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCxcclxuXHRcdFx0XHRcdHNyYzogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBmYWlsZWQgYXR0ZW1wdFxyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IHtcclxuXHRcdFx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmMsXHJcblx0XHRcdFx0XHRzdGVwcGVkOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zdGVwLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgc3JjOiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zdCBfOiBuZXZlciA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlYCk7XHJcblx0XHR9XHJcblx0XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0YW1fbW92ZVwiKSB7XHJcblx0XHRpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiaWFfc2lkZVwiKSB7XHJcblx0XHRcdG5ld19zdGF0ZS53aG9zZV90dXJuID0gXCJhX3NpZGVcIjtcclxuXHRcdH0gZWxzZSBpZiAob2xkX3N0YXRlLndob3NlX3R1cm4gPT09IFwiYV9zaWRlXCIpIHtcclxuXHRcdFx0bmV3X3N0YXRlLndob3NlX3R1cm4gPSBcImlhX3NpZGVcIjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LnNyYyk7XHJcblx0XHRjb25zdCBtYXliZV9jYXB0dXJlZF9waWVjZSA9IHNldF90byhuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zZWNvbmREZXN0LCBwaWVjZSk7XHJcblx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOeah+OBjOihjOOBk+OBhuOBqOOBl+OBpuOBhOOCiyR7Ym9keV9lbGVtZW50Lm1vdmVtZW50LnNlY29uZERlc3RbMV19JHtib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdFswXX3jgavjga8ke21heWJlX2NhcHR1cmVkX3BpZWNlLmNvbG9yfSR7bWF5YmVfY2FwdHVyZWRfcGllY2UucHJvZn3jgYzml6LjgavjgYLjgorjgb7jgZlgKVxyXG5cdFx0fVxyXG5cdFx0bmV3X3N0YXRlLmZvY3VzID0ge1xyXG5cdFx0XHRzcmM6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zcmMsXHJcblx0XHRcdHN0ZXBwZWQ6IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5zdGVwU3R5bGUgPT09IFwiTm9TdGVwXCIgPyBudWxsIDogYm9keV9lbGVtZW50Lm1vdmVtZW50LnN0ZXAsXHJcblx0XHRcdGFjdHVhbF9maW5hbF9kZXN0OiBib2R5X2VsZW1lbnQubW92ZW1lbnQuc2Vjb25kRGVzdCxcclxuXHRcdFx0aW5pdGlhbGx5X3BsYW5uZWRfZGVzdDogYm9keV9lbGVtZW50Lm1vdmVtZW50LmZpcnN0RGVzdFxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRjb25zdCBfOiBuZXZlciA9IGJvZHlfZWxlbWVudDtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQudHlwZVwiKTtcclxuXHR9XHJcblx0cmV0dXJuIG5ld19zdGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkOiBSZWFkb25seTxQYXJzZWQ+KTogU3RhdGVbXSB7XHJcblx0aWYgKCFwYXJzZWQuc3RhcnRpbmdfcGxheWVycykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGB0b2RvOiBjdXJyZW50IGltcGxlbWVudGF0aW9uIHJlcXVpcmVzIOS4gOS9jeiJsi4gXHJcblx0XHRUbyByZXNvbHZlIHRoaXMsIEkgd291bGQgbmVlZCB0byB1bmNvbW1lbnQgXCJhbWJpZ3VvdXNfYWxwaGFcIiB8IFwiYW1iaWd1b3VzX2JldGFcIlxyXG5cdFx0aW4gU3RhdGUud2hvc2VfdHVybiDjgZfjgabjgIHnmofku6XlpJbjga7pp5LjgpLli5XjgYvjgZfjgZ/jgonjgZ3jgozjgpLlhYPjgavpgIbjgavovr/jgaPjgabop6PmtojjgZnjgovjgIHjgb/jgZ/jgYTjgarjga7jgpLlhaXjgozjgovlv4XopoHjgYzjgYLjgovjgIJgKTtcclxuXHR9XHJcblx0bGV0IGN1cnJlbnRfc3RhdGUgPSBnZXRJbml0aWFsU3RhdGUoe1xyXG5cdFx0aWFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLlvLVcIiwgcGxheWVyX25hbWU6IFwi5by15LiJXCIgfSxcclxuXHRcdGFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLmnY5cIiwgcGxheWVyX25hbWU6IFwi5p2O5ZubXCIgfVxyXG5cdH0pO1xyXG5cdGNvbnN0IGFuczogU3RhdGVbXSA9IFtjdXJyZW50X3N0YXRlXTtcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlZC5wYXJzZWRfYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBuZXh0X3N0YXRlID0gKCgpID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRyZXR1cm4gZ2V0TmV4dFN0YXRlKGN1cnJlbnRfc3RhdGUsIHBhcnNlZC5wYXJzZWRfYm9kaWVzW2ldLCBwYXJzZWQuc3RhcnRpbmdfcGxheWVycy5zcGxpdChcIlwiKSBhcyBIYW56aUNvbG9yW10pXHJcblx0XHRcdH0gY2F0Y2ggKGU6IGFueSkge1xyXG5cdFx0XHRcdGFsZXJ0KGAke2l944K544OG44OD44OX55uu44Gn44GuJHtlfWApO1xyXG5cdFx0XHRcdHJldHVybiBjdXJyZW50X3N0YXRlO1xyXG5cdFx0XHR9XHJcblx0XHR9KSgpO1xyXG5cdFx0aWYgKCFuZXh0X3N0YXRlKSBicmVhaztcclxuXHRcdGFucy5wdXNoKG5leHRfc3RhdGUpO1xyXG5cdFx0Y3VycmVudF9zdGF0ZSA9IG5leHRfc3RhdGU7XHJcblx0fVxyXG5cdHJldHVybiBhbnM7XHJcbn1cclxuIiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93LCBBYnNvbHV0ZUNvb3JkLCBDb2xvciwgUHJvZmVzc2lvbiwgU2Vhc29uIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuaW1wb3J0IHsgSGFuZCB9IGZyb20gXCJjZXJrZV9oYW5kc19hbmRfc2NvcmVcIlxyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uID0gXCLoiLlcIiB8IFwi54ShXCIgfCBcIuWFtVwiIHwgXCLlvJNcIiB8IFwi6LuKXCIgfCBcIuiZjlwiIHwgXCLppqxcIiB8IFwi562GXCIgfCBcIuW3q1wiIHwgXCLlsIZcIiB8IFwi546LXCI7XHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbkFuZFRhbSA9IEhhbnppUHJvZmVzc2lvbiB8IFwi55qHXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcHJvZnM6IEhhbnppUHJvZmVzc2lvbkFuZFRhbVtdID0gW1xyXG5cdFwi6Ii5XCIsIFwi54ShXCIsIFwi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi55qHXCJcclxuXTtcclxuXHJcbmV4cG9ydCB0eXBlIEJvYXJkID0ge1xyXG5cdEs6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRMOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0TjogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFQ6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRaOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0WDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEM6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRNOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0UDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlTZWFzb24gPSBcIuaYpVwiIHwgXCLlpI9cIiB8IFwi56eLXCIgfCBcIuWGrFwiO1xyXG5leHBvcnQgZnVuY3Rpb24gZnJvbUhhbnppU2Vhc29uKHM6IEhhbnppU2Vhc29uKTogU2Vhc29uIHtcclxuXHRpZiAocyA9PT0gXCLmmKVcIikgcmV0dXJuIDA7XHJcblx0ZWxzZSBpZiAocyA9PT0gXCLlpI9cIikgcmV0dXJuIDE7XHJcblx0ZWxzZSBpZiAocyA9PT0gXCLnp4tcIikgcmV0dXJuIDI7XHJcblx0ZWxzZSBpZiAocyA9PT0gXCLlhqxcIikgcmV0dXJuIDM7XHJcblx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IFVuZXhwZWN0ZWQgc2Vhc29uICR7c31gKVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBSYXRlID0gMSB8IDIgfCA0IHwgOCB8IDE2IHwgMzIgfCA2NDtcclxuZXhwb3J0IHR5cGUgSGFuemlDb2xvciA9IFwi6LWkXCIgfCBcIum7klwiO1xyXG5leHBvcnQgZnVuY3Rpb24gdG9IYW56aUNvbG9yKGM6IENvbG9yKTogSGFuemlDb2xvciB7XHJcblx0aWYgKGMgPT09IENvbG9yLktvazEpIHJldHVybiBcIui1pFwiO1xyXG5cdHJldHVybiBcIum7klwiO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hhbnppUHJvZmVzc2lvbihwOiBQcm9mZXNzaW9uKTogSGFuemlQcm9mZXNzaW9uIHtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5EYXUyKSByZXR1cm4gXCLomY5cIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5HdWEyKSByZXR1cm4gXCLlvJNcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5JbykgcmV0dXJuIFwi546LXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uS2F1azIpIHJldHVybiBcIuWFtVwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLkthdW4xKSByZXR1cm4gXCLou4pcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5LdWEyKSByZXR1cm4gXCLnrYZcIjtcclxuXHRpZiAocCA9PT0gUHJvZmVzc2lvbi5NYXVuMSkgcmV0dXJuIFwi6aasXCI7XHJcblx0aWYgKHAgPT09IFByb2Zlc3Npb24uTnVhazEpIHJldHVybiBcIuiIuVwiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLlR1azIpIHJldHVybiBcIuW3q1wiO1xyXG5cdGlmIChwID09PSBQcm9mZXNzaW9uLlVhaTEpIHJldHVybiBcIuWwhlwiO1xyXG5cdHRocm93IG5ldyBFcnJvcihgU2hvdWxkIG5vdCByZWFjaCBoZXJlOiBVbmV4cGVjdGVkIHByb2Zlc3Npb24gJHtwfWApXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE92ZXJsYXllZE1lc3NhZ2UgPSB7IHR5cGU6IFwiYmVmb3JlX3R5bW9rXCIsIGhhbmRzOiBIYW5kW10gfVxyXG5cdHwgeyB0eXBlOiBcImJlZm9yZV90YXhvdFwiLCBoYW5kczogSGFuZFtdLCBzY29yZTogbnVtYmVyIH1cclxuXHR8IHsgdHlwZTogXCJnb19hZ2FpblwiIH1cclxuXHR8IHsgdHlwZTogXCJlbmRfc2Vhc29uXCIsIHNjb3JlOiBudW1iZXIgfVxyXG5cdHwgeyB0eXBlOiBcImdhbWVfc2V0XCIgfVxyXG5cdHwgeyB0eXBlOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogSGFuemlTZWFzb24gfTtcclxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XHJcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0d2hvc2VfdHVybjogXCJpYV9zaWRlXCIgfCBcImFfc2lkZVwiIC8qfCBcImFtYmlndW91c19hbHBoYVwiIHwgXCJhbWJpZ3VvdXNfYmV0YVwiKi8gfCBudWxsLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IHtcclxuXHRcdHN0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdFx0c3JjOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCB8IFwiaWFfc2lkZV9ob3AxenVvMVwiIHwgXCJhX3NpZGVfaG9wMXp1bzFcIixcclxuXHRcdC8vIHwgICAgICAgICAgICAgICAgICAgICAgICB8IFRhbTIgICAgICAgfCB3aGVuIGNpdXJsIGZhaWxzIHwgd2hlbiBvayB8XHJcblx0XHQvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tfFxyXG5cdFx0Ly8gfCBpbml0aWFsbHlfcGxhbm5lZF9kZXN0IHwgZmlyc3REZXN0ICB8IGRlc3QgICAgICAgICAgICAgfCBkZXN0ICAgIHxcclxuXHRcdC8vIHwgYWN0dWFsX2ZpbmFsX2Rlc3QgICAgICB8IHNlY29uZERlc3QgfCBzcmMgICAgICAgICAgICAgIHwgZGVzdCAgICB8XHJcblx0XHRpbml0aWFsbHlfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbFxyXG5cdFx0YWN0dWFsX2ZpbmFsX2Rlc3Q6IEFic29sdXRlQ29vcmQgfCBudWxsLFxyXG5cdH0sXHJcblx0Ym9hcmQ6IEJvYXJkLFxyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogZmFsc2UgfVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogdHJ1ZSB9W10sXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXHJcblx0fSxcclxuXHRvdmVybGF5ZWRfbWVzc2FnZTogT3ZlcmxheWVkTWVzc2FnZSB8IG51bGwsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5vblRhbVBpZWNlID0geyBjb2xvcjogSGFuemlDb2xvciwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgcGFyc2VDZXJrZU9ubGluZUtpYTFBazEsIFBhcnNlZCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSwgaGlnaGxpZ2h0TnRoS2lhMUFrMSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW0gPSBsb2NhdGlvbi5ocmVmLm1hdGNoKC9cXD9oaXN0b3J5PSguKikvKTtcclxuICAgIGlmICghcGFyYW0pIHtcclxuICAgICAgICBhbGVydChcIuaji+itnOOBjOOBguOCiuOBvuOBm+OCk+OAgmluZGV4Lmh0bWwg44Gr5oi744Gj44Gm5YaN5YWl5Yqb44GX44Gm44GP44Gg44GV44GE44CCXCIpO1xyXG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBraWFyX2FyayA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSkucmVwbGFjZSgvXFx0L2csIFwiICAgIFwiKTtcclxuICAgICAgICBjb25zdCBwYXJzZWQ6IFBhcnNlZCA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKGtpYXJfYXJrKTtcclxuICAgICAgICBjb25zdCBzdGF0ZXM6IFN0YXRlW10gPSBnZXRBbGxTdGF0ZXNGcm9tUGFyc2VkKHBhcnNlZCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2lhX2FrXCIpIS50ZXh0Q29udGVudCA9IGtpYXJfYXJrO1xyXG5cclxuICAgICAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgICAgIGNvbnN0IHR1cm5fc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3NsaWRlclwiKSEgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICB0dXJuX3NsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgICBjb25zdCBtYXggPSBzdGF0ZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB0dXJuX3NsaWRlci5tYXggPSBgJHttYXh9YDtcclxuICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IFwiMFwiO1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzWzBdKTtcclxuICAgICAgICB0dXJuX3NsaWRlci5vbmlucHV0ID0gdHVybl9zbGlkZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7XHJcbiAgICAgICAgICAgIGRyYXdHYW1lU3RhdGUoc3RhdGVzW25ld192YWx1ZV0pO1xyXG4gICAgICAgICAgICBoaWdobGlnaHROdGhLaWExQWsxKGtpYXJfYXJrLCBuZXdfdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYnV0dG9uX25leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9uZXh0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b25fbmV4dC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0dXJuX3NsaWRlci52YWx1ZSA9IGAke051bWJlcih0dXJuX3NsaWRlci52YWx1ZSkgKyAxfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSk7IC8vIGF1dG9tYXRpY2FsbHkgY3JvcHMgdGhlIHZhbHVlIGFwcHJvcHJpYXRlbHlcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBidXR0b25fcHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbl9wcmV2aW91c1wiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uX3ByZXZpb3VzLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gYCR7TnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSAtIDF9YDtcclxuICAgICAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKTsgLy8gYXV0b21hdGljYWxseSBjcm9wcyB0aGUgdmFsdWUgYXBwcm9wcmlhdGVseVxyXG4gICAgICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tuZXdfdmFsdWVdKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0TnRoS2lhMUFrMShraWFyX2FyaywgbmV3X3ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbl9maXJzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2ZpcnN0XCIpISBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b25fZmlyc3Qub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3X3ZhbHVlID0gMDtcclxuICAgICAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBidXR0b25fbGFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uX2xhc3RcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGJ1dHRvbl9sYXN0Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld192YWx1ZSA9IG1heDtcclxuICAgICAgICAgICAgdHVybl9zbGlkZXIudmFsdWUgPSBgJHtuZXdfdmFsdWV9YDtcclxuICAgICAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbbmV3X3ZhbHVlXSk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE50aEtpYTFBazEoa2lhcl9hcmssIG5ld192YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
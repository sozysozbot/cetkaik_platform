/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
exports.drawGameState = exports.drawFocusSrc = exports.drawFocusStepped = exports.drawFocusPlannedDest = exports.drawEmptyBoard = exports.cell_size = exports.top_margin = exports.left_margin = exports.height = void 0;
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
function drawFocusPlannedDest(focus_planned_dest) {
    if (!focus_planned_dest)
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_planned_dest), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 25%; \n        background-color: rgb(178, 255, 255)\n    \"></div>");
}
exports.drawFocusPlannedDest = drawFocusPlannedDest;
function drawFocusStepped(focus_stepped) {
    if (!focus_stepped)
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_stepped), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(255, 255, 0, 0.3)\n    \"></div>");
}
exports.drawFocusStepped = drawFocusStepped;
function drawFocusSrc(focus_src) {
    if (!focus_src)
        return "";
    var circle_radius = 18;
    var _a = get_top_left(focus_src), top = _a.top, left = _a.left;
    return "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(0, 0, 0, 0.3)\n    \"></div>");
}
exports.drawFocusSrc = drawFocusSrc;
function drawPiecesOnBoard(board, focus) {
    var ans = "";
    for (var clm in board) {
        for (var rw in board[clm]) {
            var is_focused = focus ? focus[1] === clm && focus[0] === rw : false;
            ans += positionPieceOnBoard(clm, rw, board[clm][rw], is_focused);
        }
    }
    return ans;
}
function getHop1Zuo1HTML(pieces, is_newly_acquired) {
    var ans = "";
    for (var i = 0; i < pieces.length; i++) {
        var _a = pieces[i], color = _a.color, prof = _a.prof;
        var rad = 18 / 0.26;
        ans += "<li>\n            <div style=\"\n                width: 23px; \n                height: ".concat(exports.cell_size, "px; \n                transform: scale(0.26); \n                transform-origin: top left; \n            \">\n                ").concat(renderNormalPiece(color, prof, false), "\n                ").concat(is_newly_acquired && i == pieces.length - 1 ? "<div style=\"\n                    position: absolute;\n                    left: ".concat(42 - rad, "px;\n                    top: ").concat(42 - rad, "px;\n                    width: ").concat(rad * 2, "px;\n                    height: ").concat(rad * 2, "px;\n                    border-radius: 50%;\n                    background-color: rgba(0, 60, 60, 0.3);\n                \"></div>") : "", "\n            </div>\n        </li>");
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
    document.getElementById("a_side_piece_stand").innerHTML = getHop1Zuo1HTML(STATE.a_side.hop1zuo1, STATE.a_side.is_newly_acquired);
    document.getElementById("ia_side_piece_stand").innerHTML = getHop1Zuo1HTML(STATE.ia_side.hop1zuo1, STATE.ia_side.is_newly_acquired);
    document.getElementById("a_side_current_score").innerHTML = STATE.a_side.score + "";
    document.getElementById("ia_side_current_score").innerHTML = STATE.ia_side.score + "";
    document.getElementById("pieces_inner").innerHTML = drawFocusStepped(STATE.focus_stepped) +
        drawFocusSrc(STATE.focus_src) +
        drawFocusPlannedDest(STATE.focus_planned_dest) +
        drawPiecesOnBoard(STATE.board, STATE.focus);
}
exports.drawGameState = drawGameState;
function renderNormalPiece(color, prof, is_bold) {
    var x = types_1.profs.indexOf(prof) * -100 - 27;
    var y = is_bold ? 0 : -277;
    var color_path = {
        "黒": "ゴシック駒",
        "赤": "ゴシック駒_赤",
    }[color];
    return "<div\n    style=\"width: 87px; height: 87px; background-position-x: ".concat(x, "px; background-position-y: ").concat(y, "px; background-image: url(").concat(color_path, ".svg); \">\n</div>");
}
function positionPieceOnBoard(clm, rw, piece, is_bold) {
    var _a = get_top_left([rw, clm]), left = _a.left, top = _a.top;
    if (piece === "皇") {
        return "\n        <div style=\"position: absolute; left: ".concat(left, "px; top: ").concat(top, "px; transform: scale(0.26) ").concat("rotate(90deg)", "\">\n            ").concat(renderNormalPiece("黒", "皇", is_bold), "\n        </div>");
    }
    else {
        var color = piece.color, prof = piece.prof, is_aside = piece.is_aside;
        return "\n        <div style=\"position: absolute; left: ".concat(left, "px; top: ").concat(top, "px; transform: scale(0.26) ").concat(is_aside ? "rotate(180deg)" : "", "\">\n            ").concat(renderNormalPiece(color, prof, is_bold), "\n        </div>");
    }
}


/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllStatesFromParsed = exports.getNextState = void 0;
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
        focus: null,
        focus_stepped: null,
        focus_src: null,
        focus_planned_dest: null,
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
function getNextState(current_state, body_element) {
    var new_state = JSON.parse(JSON.stringify(current_state));
    // clear the flags
    new_state.ia_side.is_newly_acquired = false;
    new_state.a_side.is_newly_acquired = false;
    new_state.focus_src = null;
    new_state.focus = null;
    new_state.focus_stepped = null;
    if (body_element.type === "season_ends") {
        if (current_state.season === "冬") {
            return null;
        }
        new_state.season =
            current_state.season === "春" ? "夏" :
                current_state.season === "夏" ? "秋" :
                    current_state.season === "秋" ? "冬" :
                        (function () { throw new Error(); })();
        new_state.turn = 0;
        return new_state;
    }
    else if (body_element.type === "from_hopzuo") {
    }
    else if (body_element.type === "normal_move") {
        var ciurl_and_capture = body_element.ciurl_and_capture;
        ciurl_and_capture.ciurl_event;
        new_state.turn++;
        new_state.focus_src = body_element.movement.data.src;
        if (body_element.movement.data.type === "SrcDst") {
            if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = body_element.movement.data.dest;
                new_state.focus_stepped = null;
                new_state.focus_planned_dest = body_element.movement.data.dest;
            }
            else {
                // failed attempt
                new_state.focus = body_element.movement.data.src;
                new_state.focus_stepped = null;
                new_state.focus_planned_dest = body_element.movement.data.dest;
            }
        }
        else if (body_element.movement.data.type === "SrcStepDst") {
            if (isSuccessfullyCompleted(body_element.ciurl_and_capture.ciurl_event)) {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = body_element.movement.data.dest;
                new_state.focus_stepped = body_element.movement.data.step;
                new_state.focus_planned_dest = body_element.movement.data.dest;
            }
            else {
                // failed attempt
                new_state.focus = body_element.movement.data.src;
                new_state.focus_stepped = body_element.movement.data.step;
                new_state.focus_planned_dest = body_element.movement.data.dest;
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
    }
    else {
        var _ = body_element;
        throw new Error("Should not reach here: invalid value in body_element.type");
    }
    return new_state;
}
exports.getNextState = getNextState;
function getAllStatesFromParsed(parsed) {
    var current_state = getInitialState({
        ia_side: { player_name_short: "張", player_name: "張三" },
        a_side: { player_name_short: "李", player_name: "李四" }
    });
    var ans = [current_state];
    var _loop_1 = function (i) {
        var next_state = (function () {
            try {
                return getNextState(current_state, parsed.parsed_bodies[i]);
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.profs = void 0;
exports.profs = [
    "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
    var case1 = "{\u4E00\u4F4D\u8272:\u9ED2\u9ED2\u9ED2}\n{\u59CB\u6642:2022-05-31T17:16:02.433Z}\n{\u7D42\u6642:2022-05-31T18:13:52.357Z}\nMAU\u5F13MAIMY\u6A4B\u4E94    PE\u5DEBPIPU\u7121\u6483\u88C1\nCAI\u5175CAU\u7121\u6483\u88C1    ME\u5F13CE\u7121\u6483\u88C1\nPAU\u5DEBCAUCAI\u7121\u6483\u88C1    ZA\u738BZE\u7121\u6483\u88C1\nMY\u5F13MIMA\u6A4B\u4E00\u6B64\u7121    CI\u5175MIMU\u7121\u6483\u88C1\nCAI\u5DEBCAMA\u6A4B\u4E00\u624B\u8D64\u99AC    PA\u7B46MA\u7121\u6483\u88C1\u624B\u8D64\u5DEB\nLAU\u5F13LAILY\u6A4B\u4E09    TE\u864ENITU\u6A4B\u4E00\nLY\u5F13LILE\u6A4B\u4E09\u624B\u8D64\u5F13    KA\u7B46KELE\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nMY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5175\n\n\u6216\u70BA\u99AC\u5F13\u5175\u800C\u624B\u4E94\n\u7D42\u5B63    \u6625\u7D42\n\nMAU\u5F13MAIMY\u6A4B\u4E09    XE\u864EZIXU\u7121\u6483\u88C1\nXAI\u5175XY\u7121\u6483\u88C1    XU\u864EMY\u7121\u6483\u88C1\u624B\u8D64\u5F13\nXAU\u864ECAIMY\u6A4B\u56DB\u624B\u9ED2\u864E    ME\u5F13MIMU\u6A4B\u4E09\nKAU\u5DEBKAIKY\u7121\u6483\u88C1    ZO\u7687[TU]ZIZE\nPAU\u5DEBZAU\u7121\u6483\u88C1    CI\u5175CE\u7121\u6483\u88C1\nZAI\u8239ZI\u7121\u6483\u88C1\u624B\u8D64\u8239    TE\u864EZI\u6C34\u4E8C\u6B64\u7121\nZE\u7687TI[NU]LO    XA\u5C06ZE\u7121\u6483\u88C1\nZI\u8239ZEZA\u6A4B\u56DB\u624B\u8D64\u738B\n\n\u6216\u70BA\u738B\u52A0\u7363\u800C\u624B\u516B\n\u7D42\u5B63    \u590F\u7D42\n\nMAU\u5F13MAIMY\u6A4B\u4E8C    ME\u5F13MIMU\u6A4B\u4E09\nCAI\u5175CAU\u7121\u6483\u88C1    XE\u864EZIXU\u7121\u6483\u88C1\nMY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5F13    MI\u5175MU\u7121\u6483\u88C1\u624B\u8D64\u5F13\nPAU\u5DEBCAUCAI\u7121\u6483\u88C1    ZA\u738BZE\u7121\u6483\u88C1\nCAI\u5DEBCAXA\u6A4B\u4E09\u624B\u8D64\u5C06    ZE\u738BXA\u7121\u6483\u88C1\u624B\u8D64\u5DEB\nPIA\u7B46PAIPY\u6A4B\u4E00    PE\u5DEBZE\u7121\u6483\u88C1\nPY\u7B46PIPA\u6A4B\u4E8C\u624B\u8D64\u7B46    CA\u8ECAPA\u7121\u6483\u88C1\u624B\u9ED2\u7B46\nLAU\u5F13LAILY\u6A4B\u4E00    LE\u5F13LILU\u6A4B\u56DB\nLY\u5F13LU\u7121\u6483\u88C1\u624B\u8D64\u5F13    LI\u5175LU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\n\u9ED2\u5F13CY    \u9ED2\u5F13CU\nCY\u5F13CU\u7121\u6483\u88C1\u624B\u9ED2\u5F13    CI\u5175CU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\n\u9ED2\u5F13MI    XA\u738BCE\u7121\u6483\u88C1\nMI\u5F13MA\u7121\u6483\u88C1\u624B\u8D64\u99AC    CE\u738BMA\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nTAU\u864EZAITY\u7121\u6483\u88C1    NI\u5175NO\u6C34\u4E09\nTY\u864ENOLU\u7121\u6483\u88C1\u624B\u8D64\u5175\n\n\u6216\u70BA\u540C\u8272\u99AC\u5F13\u5175\u800C\u624B\u4E03\n\u7D42\u5B63    \u79CB\u7D42\n\n\n\u661F\u4E00\u5468";
    var parsed = (0, cerke_online_kiaak_parser_1.parseCerkeOnlineKia1Ak1)(case1);
    var states = (0, state_1.getAllStatesFromParsed)(parsed);
    (0, draw_1.drawEmptyBoard)();
    var turn_slider = document.getElementById("turn_slider");
    turn_slider.min = "0";
    turn_slider.max = "".concat(states.length - 1);
    turn_slider.value = "0";
    (0, draw_1.drawGameState)(states[0]);
    turn_slider.oninput = function () {
        (0, draw_1.drawGameState)(states[Number(turn_slider.value)]);
    };
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEcs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QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsR0FBRztZQUNOLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdB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RTtJQUM1QixJQUFNLEtBQUssR0FDZCxtZ0ZBK0NHLENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBVyx1REFBdUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxJQUFNLE1BQU0sR0FBWSxrQ0FBc0IsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUV2RCx5QkFBYyxHQUFFLENBQUM7SUFDakIsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQXNCLENBQUM7SUFDaEYsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDdEIsV0FBVyxDQUFDLEdBQUcsR0FBRyxVQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUM7SUFDekMsV0FBVyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDeEIsd0JBQWEsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixXQUFXLENBQUMsT0FBTyxHQUFHO1FBQ2xCLHdCQUFhLEVBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaGFuZGxlX2JvZHlfZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hfbW9uYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L3JlYWRfcGVremVwX251bWVyYWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IGV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gZXhwb3J0cy5oYW5kbGVZYWt1ID0gZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaGVyc18xID0gcmVxdWlyZShcIi4vbXVuY2hlcnNcIik7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuZnVuY3Rpb24gaGFuZGxlVGFtTW92ZShzKSB7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAocmVzdC5jaGFyQXQoMCkgIT09IFwi55qHXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRhbTIgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgZm9ybWF0IGlzIGVpdGhlcjpcclxuICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICBjb25zdCB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGZpcnN0RGVzdCwgbmV4dCkgPT4gKHsgZmlyc3REZXN0LCBuZXh0IH0pLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAodHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQpIHtcclxuICAgICAgICAvLyBlaXRoZXI6XHJcbiAgICAgICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGZpcnN0RGVzdCwgbmV4dCB9LCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQ7XHJcbiAgICAgICAgaWYgKHJlc3QyID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0YW1fbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiTm9TdGVwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLCBmaXJzdERlc3QsIHNlY29uZERlc3Q6IG5leHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyeV9tdW5jaF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgICAgICAgICAgaWYgKCF0cnlfbXVuY2hfY29vcmQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiBzZWNvbmREZXN0LCByZXN0OiBlbXB0eSB9ID0gdHJ5X211bmNoX2Nvb3JkO1xyXG4gICAgICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke2VtcHR5fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7IHR5cGU6IFwiVGFtTW92ZVwiLCBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdMYXR0ZXJcIiwgc3JjLCBmaXJzdERlc3QsIHN0ZXA6IG5leHQsIHNlY29uZERlc3QgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0KSA9PiAoeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSksIG11bmNoZXJzXzEubXVuY2hDb29yZCwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSwgcmVzdDogZW1wdHkgfSA9IG11bmNoO1xyXG4gICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGFtX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nRm9ybWVyXCIsXHJcbiAgICAgICAgICAgICAgICBzcmMsIHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRhbU1vdmUgPSBoYW5kbGVUYW1Nb3ZlO1xyXG5mdW5jdGlvbiBoYW5kbGVZYWt1KHMpIHtcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo1xyXG4gICAgLy8g5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbiAgICBjb25zdCBoYW5kc1NlcEJ5QXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5zZXBCeTEpKHsgcDogbXVuY2hlcnNfMS5tdW5jaEhhbmQsIHNlcDogKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuWKoFwiKSB9KTtcclxuICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgaGFuZHMpID0+IGhhbmRzLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5oiW54K6XCIpLCBoYW5kc1NlcEJ5QXQpKHMpO1xyXG4gICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGhhbmRzLCByZXN0IH0gPSBtdW5jaDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0eW1va1wiLCBoYW5kcyB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgbXVuY2gyID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgbnVtKSA9PiBudW0sICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLogIzmiYtcIiksIG11bmNoZXJzXzEubXVuY2hQZWt6ZXBOdW1lcmFsKShyZXN0KTtcclxuICAgIGlmICghbXVuY2gyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2NvcmUsIHJlc3Q6IHJlc3QyIH0gPSBtdW5jaDI7XHJcbiAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IHR5cGU6IFwidGF4b3RcIiwgaGFuZHMsIHNjb3JlIH07XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVZYWt1ID0gaGFuZGxlWWFrdTtcclxuY29uc3QgbXVuY2hXYXRlckV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmsLRcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi54Sh5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiA5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqM5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiJXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5ZubXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqUXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IG11bmNoV2F0ZXJFdmVudDtcclxuY29uc3QgbXVuY2hDaXVybEV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLnhKHmkoPoo4FcIikpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJub19jaXVybF9ldmVudFwiIH0sIHJlc3Q6IHMuc2xpY2UoMykgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJoYXNfd2F0ZXJfZW50cnlcIiwgd2F0ZXJfZW50cnlfY2l1cmw6IGFucyB9LCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi5qmLXCIpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHMuc2xpY2UoMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcHBpbmdfY2l1cmwgPSB0WzBdID09PSBcIueEoVwiID8gMCA6XHJcbiAgICAgICAgICAgIHRbMF0gPT09IFwi5LiAXCIgPyAxIDpcclxuICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqMXCIgPyAyIDpcclxuICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS4iVwiID8gMyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5ZubXCIgPyA0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqUXCIgPyA1IDogKCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBjaGFyYWN0ZXIgZm91bmQgYWZ0ZXIg5qmLXCIpOyB9KSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3QgPSB0LnNsaWNlKDEpO1xyXG4gICAgICAgIC8vIEVpdGhlciBub3RoaW5nLCDmraTnhKEsIG9yIG11bmNoV2F0ZXJFdmVudFxyXG4gICAgICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocmVzdCk7XHJcbiAgICAgICAgaWYgKHRyeV9tdW5jaF93YXRlcikge1xyXG4gICAgICAgICAgICBjb25zdCB7IGFuczogd2F0ZXJfZW50cnlfY2l1cmwsIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfd2F0ZXI7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcImhhc193YXRlcl9lbnRyeVwiLCBzdGVwcGluZ19jaXVybCwgd2F0ZXJfZW50cnlfY2l1cmwgfSwgcmVzdDogcmVzdDIgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzdC5zdGFydHNXaXRoKFwi5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogeyB0eXBlOiBcIm9ubHlfc3RlcHBpbmdcIiwgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiBmYWxzZSB9LCByZXN0OiBcIlwiIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgdHlwZTogXCJvbmx5X3N0ZXBwaW5nXCIsIHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogdHJ1ZSB9LCByZXN0IH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gbXVuY2hDaXVybEV2ZW50O1xyXG5mdW5jdGlvbiBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocykge1xyXG4gICAgY29uc3QgdHJ5X2NpdXJsX2V2ZW50ID0gKDAsIGV4cG9ydHMubXVuY2hDaXVybEV2ZW50KShzKTtcclxuICAgIGlmICghdHJ5X2NpdXJsX2V2ZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIGNpdXJsIGV2ZW50OiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogY2l1cmxfZXZlbnQsIHJlc3QgfSA9IHRyeV9jaXVybF9ldmVudDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQpKHJlc3QpO1xyXG4gICAgaWYgKG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUpIHtcclxuICAgICAgICBjb25zdCB7IGFuczogcGllY2VfY2FwdHVyZSwgcmVzdDogcmVzdDIgfSA9IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmU7XHJcbiAgICAgICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJhaWxpbmcgcGFyYW1ldGVyIFxcYCR7c31cXGAgaGFzIHNvbWUgZXh0cmEgXFxgJHtyZXN0Mn1cXGAgYXQgdGhlIGVuZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCwgcGllY2VfY2FwdHVyZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIHRyYWlsaW5nIHBhcmFtZXRlcjogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzO1xyXG5mdW5jdGlvbiBoYW5kbGVCb2R5RWxlbWVudChzKSB7XHJcbiAgICBpZiAocyA9PT0gXCLmmKXntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5aSP57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDEgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIueni+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAyIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlhqzntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi57WC5a2jXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJlbmRfc2Vhc29uXCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuaYn+S4gOWRqFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZ2FtZV9zZXRcIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLngrpcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlWWFrdShzKTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi55qHXCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVRhbU1vdmUocyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfZnJvbV9ob3B6dW8gPSAoMCwgbXVuY2hlcnNfMS5tdW5jaEZyb21Ib3BadW8pKHMpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF9mcm9tX2hvcHp1bykge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGNvbG9yLCBwcm9mLCBkZXN0IH0sIHJlc3QgfSA9IHRyeV9tdW5jaF9mcm9tX2hvcHp1bztcclxuICAgICAgICBpZiAocmVzdCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZnJvbV9ob3B6dW9cIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJGcm9tSG9wMVp1bzFcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBwcm9mLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAoIVtcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIuiIuVwiLCBcIueJh1wiXS5pbmNsdWRlcyhyZXN0LmNoYXJBdCgwKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIGEgcHJvZmVzc2lvbiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF8ybmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICghdHJ5X211bmNoXzJuZF9jb29yZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGhlIHNlY29uZCBjb29yZGluYXRlIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNlY29uZF9jb29yZCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF8ybmRfY29vcmQ7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfM3JkX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfM3JkX2Nvb3JkKSB7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHNlY29uZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGFuczogdGhpcmRfY29vcmQsIHJlc3Q6IHJlc3QzIH0gPSB0cnlfbXVuY2hfM3JkX2Nvb3JkO1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QzKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY1N0ZXBEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogc2Vjb25kX2Nvb3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHRoaXJkX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gaGFuZGxlQm9keUVsZW1lbnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSB2b2lkIDA7XHJcbmNvbnN0IGhhbmRsZV9ib2R5X2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZV9ib2R5X2VsZW1lbnRcIik7XHJcbi8vIFZlcnkgcHJpbWl0aXZlIHBhcnNlciB0aGF0IG5ldmVyIGhhbmRsZXMgYWxsIHRoZSBlZGdlIGNhc2VzXHJcbmZ1bmN0aW9uIHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKHMpIHtcclxuICAgIGNvbnN0IGxpbmVzID0gcy50cmltKCkuc3BsaXQoXCJcXG5cIikubWFwKGwgPT4gbC50cmltKCkpO1xyXG4gICAgY29uc3QgaW5pdGlhbF9saW5lID0gbGluZXNbMF07XHJcbiAgICBpZiAoaW5pdGlhbF9saW5lID09PSB1bmRlZmluZWQgLyogU2luY2Ugd2UgdXNlZCAuc3BsaXQoKSwgdGhpcyBhY3R1YWxseSBjYW4ndCBoYXBwZW4gKi8gfHwgaW5pdGlhbF9saW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM44GC44KK44G+44Gb44KTXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoL15cXHvlp4vmmYI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+Wni+aZgjog44Gn5aeL44G+44Gj44Gm44GE44G+44GZ44CC44GT44KM44GvMjAyMeW5tDEx5pyI5pyr44Ki44OD44OX44OH44O844OI5Lul5YmN44Gu5qOL6K2c44Gn44GC44KK44CB44G+44Gg5a++5b+c44Gn44GN44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIS9eXFx75LiA5L2N6ImyOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvkuIDkvY3oibI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0aW5nX3BsYXllcnMgPSBpbml0aWFsX2xpbmUubWF0Y2goL15cXHvkuIDkvY3oibI6KFvpu5LotaRdKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nX3RpbWUgPSBsaW5lc1sxXT8ubWF0Y2goL15cXHvlp4vmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgZW5kaW5nX3RpbWUgPSBsaW5lc1syXT8ubWF0Y2goL15cXHvntYLmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgYm9kaWVzID0gbGluZXMuc2xpY2UoMykuZmxhdE1hcChsaW5lID0+IGxpbmUuc3BsaXQoL1tcXHNcXG5dL2cpKS5maWx0ZXIoYSA9PiBhICE9PSBcIlwiKTtcclxuICAgIGNvbnN0IHBhcnNlZF9ib2RpZXMgPSBib2RpZXMubWFwKGhhbmRsZV9ib2R5X2VsZW1lbnRfMS5oYW5kbGVCb2R5RWxlbWVudCk7XHJcbiAgICByZXR1cm4geyBzdGFydGluZ19wbGF5ZXJzLCBzdGFydGluZ190aW1lLCBlbmRpbmdfdGltZSwgcGFyc2VkX2JvZGllcyB9O1xyXG59XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSBwYXJzZUNlcmtlT25saW5lS2lhMUFrMTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXBCeTEgPSBleHBvcnRzLm1hbnkxID0gZXhwb3J0cy5tYW55ID0gZXhwb3J0cy5saWZ0TTMgPSBleHBvcnRzLnN0cmluZyA9IGV4cG9ydHMubGlmdE0yID0gZXhwb3J0cy5wdXJlID0gZXhwb3J0cy5iaW5kID0gdm9pZCAwO1xyXG4vLyBtb25hZFxyXG5jb25zdCBiaW5kID0gKG1hLCBjYWxsYmFjaykgPT4gKChpbnB1dCkgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soYSkocmVzdCk7XHJcbn0pO1xyXG5leHBvcnRzLmJpbmQgPSBiaW5kO1xyXG5jb25zdCBwdXJlID0gKGEpID0+IChpbnB1dCkgPT4gKHsgYW5zOiBhLCByZXN0OiBpbnB1dCB9KTtcclxuZXhwb3J0cy5wdXJlID0gcHVyZTtcclxuY29uc3QgbGlmdE0yID0gKGYsIG1hLCBtYikgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiKSkpKTtcclxuZXhwb3J0cy5saWZ0TTIgPSBsaWZ0TTI7XHJcbmNvbnN0IHN0cmluZyA9IChwcmVmaXgpID0+IChpbnB1dCkgPT4gaW5wdXQuc3RhcnRzV2l0aChwcmVmaXgpID8geyBhbnM6IHVuZGVmaW5lZCwgcmVzdDogaW5wdXQuc2xpY2UocHJlZml4Lmxlbmd0aCkgfSA6IG51bGw7XHJcbmV4cG9ydHMuc3RyaW5nID0gc3RyaW5nO1xyXG5jb25zdCBsaWZ0TTMgPSAoZiwgbWEsIG1iLCBtYykgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMuYmluZCkobWMsIGMgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiLCBjKSkpKSk7XHJcbmV4cG9ydHMubGlmdE0zID0gbGlmdE0zO1xyXG5jb25zdCBtYW55ID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGxldCByZXN0ID0gaW5wdXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueSA9IG1hbnk7XHJcbmNvbnN0IG1hbnkxID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBsZXQgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICBjb25zdCBhbnMgPSBbYV07XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueTEgPSBtYW55MTtcclxuY29uc3Qgc2VwQnkxID0gKHsgcDogbWEsIHNlcCB9KSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKSgoMCwgZXhwb3J0cy5tYW55KSgoMCwgZXhwb3J0cy5iaW5kKShzZXAsIChfKSA9PiBtYSkpLCBhcyA9PiAoMCwgZXhwb3J0cy5wdXJlKShbYSwgLi4uYXNdKSkpO1xyXG5leHBvcnRzLnNlcEJ5MSA9IHNlcEJ5MTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBleHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSBleHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9IGV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gZXhwb3J0cy5tdW5jaENvb3JkID0gZXhwb3J0cy5tdW5jaEhhbmQgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuY29uc3QgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMSA9IHJlcXVpcmUoXCIuL3JlYWRfcGVremVwX251bWVyYWxzXCIpO1xyXG5jb25zdCBtdW5jaENvbG9yID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLotaRcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQcm9mZXNzaW9uID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLoiLlcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWFtVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5byTXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDIsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLou4pcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiZjlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6aasXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDUsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnrYZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW3q1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA3LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5bCGXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDgsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoQ29sdW1uID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGNvbHMgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgaWYgKHMuY2hhckF0KDApID09PSBjb2wpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBjb2wsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hSb3cgPSAocykgPT4ge1xyXG4gICAgY29uc3Qgcm93cyA9IFtcIkFJXCIsIFwiQVVcIiwgXCJJQVwiIC8qIGhhbmRsZSB0aGUgbG9uZ2VyIG9uZXMgZmlyc3QgKi8sIFwiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgocm93KSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHJvdywgcmVzdDogcy5zbGljZShyb3cubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaEhhbmQgPSAocykgPT4ge1xyXG4gICAgY29uc3QgaGFuZHMgPSBbXCLnjotcIiwgXCLnjaNcIiwgXCLlkIzoibLnjaNcIiwgXCLlnLDlv4NcIiwgXCLlkIzoibLlnLDlv4NcIiwgXCLppqzlvJPlhbVcIiwgXCLlkIzoibLppqzlvJPlhbVcIixcclxuICAgICAgICBcIuWKqeWPi1wiLCBcIuWQjOiJsuWKqeWPi1wiLCBcIuaIpumbhlwiLCBcIuWQjOiJsuaIpumbhlwiLCBcIuihjOihjFwiLCBcIuWQjOiJsuihjOihjFwiLCBcIuethuWFteeEoeWCvlwiLCBcIuWQjOiJsuethuWFteeEoeWCvlwiLFxyXG4gICAgICAgIFwi6ZeH5oim5LmL6ZuGXCIsIFwi5ZCM6Imy6ZeH5oim5LmL6ZuGXCIsIFwi54Sh5oqX6KGM5YemXCIsIFwi5ZCM6Imy54Sh5oqX6KGM5YemXCJdO1xyXG4gICAgZm9yIChjb25zdCBoYW5kIG9mIGhhbmRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChoYW5kKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGhhbmQsIHJlc3Q6IHMuc2xpY2UoaGFuZC5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hIYW5kID0gbXVuY2hIYW5kO1xyXG5leHBvcnRzLm11bmNoQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChjb2wsIHJvdykgPT4ge1xyXG4gICAgY29uc3QgY29vcmQgPSBbcm93LCBjb2xdO1xyXG4gICAgcmV0dXJuIGNvb3JkO1xyXG59LCBtdW5jaENvbHVtbiwgbXVuY2hSb3cpO1xyXG5leHBvcnRzLm11bmNoRnJvbUhvcFp1byA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKGNvbG9yLCBwcm9mLCBkZXN0KSA9PiAoeyBjb2xvciwgcHJvZiwgZGVzdCB9KSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uLCBleHBvcnRzLm11bmNoQ29vcmQpO1xyXG5leHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8sIGNvbG9yLCBwcm9mKSA9PiAoeyBjb2xvciwgcHJvZiB9KSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuaJi1wiKSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uKTtcclxuZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXzEsIGNvb3JkLCBfMikgPT4gY29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJbXCIpLCBleHBvcnRzLm11bmNoQ29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJdXCIpKTtcclxuY29uc3QgbXVuY2hEaWdpdExpbnprbGFyID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGRzID0gW1wi54ShXCIsIFwi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCIsIFwi5Y2BXCIsIFwi5LiLXCIsIFwi55m+XCJdO1xyXG4gICAgZm9yIChjb25zdCBkIG9mIGRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQZWt6ZXBOdW1lcmFsID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHQxID0gKDAsIG11bmNoX21vbmFkXzEubWFueTEpKG11bmNoRGlnaXRMaW56a2xhcikocyk7XHJcbiAgICBpZiAoIXQxKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHQxO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBudW0gPSAoMCwgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMS5mcm9tRGlnaXRzTGluemtsYXIpKGFucyk7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiBudW0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gbXVuY2hQZWt6ZXBOdW1lcmFsO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyKGkpIHtcclxuICAgIGlmIChpWzBdID09PSBcIueEoVwiICYmIGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLkuItcIikge1xyXG4gICAgICAgIHJldHVybiAtZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi55m+XCIpIHtcclxuICAgICAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDEwMCArIGZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGluZGV4MTAwID0gaS5pbmRleE9mKFwi55m+XCIpO1xyXG4gICAgaWYgKGluZGV4MTAwICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGh1bmRyZWRzID0gaS5zbGljZSgwLCBpbmRleDEwMCk7XHJcbiAgICAgICAgY29uc3Qgb25lcyA9IGkuc2xpY2UoaW5kZXgxMDAgKyAxKTtcclxuICAgICAgICByZXR1cm4gMTAwICogZnJvbURpZ2l0c0xpbnprbGFyU3ViKGh1bmRyZWRzKSArIGZyb21EaWdpdHNMaW56a2xhclN1YihvbmVzKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKiBwYXJzZVVuaXQoaVswXSkgKyBwYXJzZVVuaXQoaVsyXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pO1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgXCIke2l9XCIgYXMgYSBwZWt6ZXAgbnVtZXJhbGApO1xyXG59XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gZnJvbURpZ2l0c0xpbnprbGFyO1xyXG5mdW5jdGlvbiBwYXJzZVVuaXQob25lcykge1xyXG4gICAgaWYgKG9uZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiAXCIpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6jFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDI7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIlcIikge1xyXG4gICAgICAgIHJldHVybiAzO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5ZubXCIpIHtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6lFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlha1cIikge1xyXG4gICAgICAgIHJldHVybiA2O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiDXCIpIHtcclxuICAgICAgICByZXR1cm4gNztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDg7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuZ1cIikge1xyXG4gICAgICAgIHJldHVybiA5O1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciBcIiR7b25lc31cIiB3aGlsZSB0cnlpbmcgdG8gcGFyc2UgcGVremVwIG51bWVyYWxzYCk7XHJcbn1cclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyU3ViKGkpIHtcclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaVtpLmxlbmd0aCAtIDFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKSAqIDEwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYSA9IGlbMF07XHJcbiAgICAgICAgY29uc3QgYiA9IGlbMV07XHJcbiAgICAgICAgaWYgKGIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpICogMTAgKyBwYXJzZVVuaXQoYik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93LCBBYnNvbHV0ZUNvb3JkIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuaW1wb3J0IHsgTm9uVGFtUGllY2UsIFN0YXRlLCBIYW56aVByb2Zlc3Npb25BbmRUYW0sIHByb2ZzLCBCb2FyZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaGVpZ2h0ID0gMzg3O1xyXG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IHRvcF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IGNlbGxfc2l6ZSA9IDQzO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdFbXB0eUJvYXJkKCkge1xyXG4gICAgY29uc3QgY3R4ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3ZcIikhIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG5cclxuICAgIC8vIOeah+WHplxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDI3LCA1NC41JSwgODEuMSUpXCJcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG5cclxuICAgIC8vIOeah+awtFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDIxMywgMzMuNiUsIDc4LjklKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIC8vIOeah+WxsVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDEyOSwgMzguNSUsIDQ1LjQlKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYig5OSwgOTksIDk5KSc7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMC4wMyAqIGhlaWdodCAvIDk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyAwLCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBoZWlnaHQsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMCk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsMCwwKVwiO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiLCBcIkFJXCIsIFwiQVVcIiwgXCJJQVwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIGxlZnRfbWFyZ2luICsgaGVpZ2h0ICsgMTAsIHRvcF9tYXJnaW4gKyAzMCArIGNlbGxfc2l6ZSAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGksIHRvcF9tYXJnaW4gLSAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICBjdHgucm90YXRlKE1hdGguUEkpO1xyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIC1sZWZ0X21hcmdpbiArIDEwLCAtKHRvcF9tYXJnaW4gKyAxNSArIGNlbGxfc2l6ZSAqIGkpKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgLShsZWZ0X21hcmdpbiArIDIwICsgY2VsbF9zaXplICogaSksIC0odG9wX21hcmdpbiArIGhlaWdodCArIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0X3RvcF9sZWZ0KGNvb3JkOiBBYnNvbHV0ZUNvb3JkKSB7XHJcbiAgICBjb25zdCBjb2x1bW4gPSB7XHJcbiAgICAgICAgSzogMCxcclxuICAgICAgICBMOiAxLFxyXG4gICAgICAgIE46IDIsXHJcbiAgICAgICAgVDogMyxcclxuICAgICAgICBaOiA0LFxyXG4gICAgICAgIFg6IDUsXHJcbiAgICAgICAgQzogNixcclxuICAgICAgICBNOiA3LFxyXG4gICAgICAgIFA6IDhcclxuICAgIH1bY29vcmRbMV1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W2Nvb3JkWzBdXTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIGNlbGxfc2l6ZSAqIChjb2x1bW4gLSAwLjUpO1xyXG4gICAgY29uc3QgdG9wID0gdG9wX21hcmdpbiArIGNlbGxfc2l6ZSAqIChyb3cgLSAwLjUpO1xyXG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdGb2N1c1BsYW5uZWREZXN0KGZvY3VzX3BsYW5uZWRfZGVzdDogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19wbGFubmVkX2Rlc3QpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19wbGFubmVkX2Rlc3QpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjUlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTc4LCAyNTUsIDI1NSlcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Rm9jdXNTdGVwcGVkKGZvY3VzX3N0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGlmICghZm9jdXNfc3RlcHBlZCkgcmV0dXJuIFwiXCI7XHJcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3N0ZXBwZWQpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAwLCAwLjMpXHJcbiAgICBcIj48L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ZvY3VzU3JjKGZvY3VzX3NyYzogQWJzb2x1dGVDb29yZCB8IG51bGwpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFmb2N1c19zcmMpIHJldHVybiBcIlwiO1xyXG4gICAgY29uc3QgY2lyY2xlX3JhZGl1cyA9IDE4O1xyXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zcmMpO1xyXG4gICAgcmV0dXJuIGBcclxuICAgIDxkaXYgc3R5bGU9XCJcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxyXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgdG9wOiAke3RvcCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XHJcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxyXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyBcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMylcclxuICAgIFwiPjwvZGl2PmA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdQaWVjZXNPbkJvYXJkKGJvYXJkOiBCb2FyZCwgZm9jdXM6IEFic29sdXRlQ29vcmQgfCBudWxsKTogc3RyaW5nIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChjb25zdCBjbG0gaW4gYm9hcmQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNfZm9jdXNlZCA9IGZvY3VzID8gZm9jdXNbMV0gPT09IGNsbSAmJiBmb2N1c1swXSA9PT0gcncgOiBmYWxzZTtcclxuICAgICAgICAgICAgYW5zICs9IHBvc2l0aW9uUGllY2VPbkJvYXJkKFxyXG4gICAgICAgICAgICAgICAgY2xtIGFzIEFic29sdXRlQ29sdW1uLFxyXG4gICAgICAgICAgICAgICAgcncgYXMgQWJzb2x1dGVSb3csXHJcbiAgICAgICAgICAgICAgICBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dIVtydyBhcyBBYnNvbHV0ZVJvd10hLFxyXG4gICAgICAgICAgICAgICAgaXNfZm9jdXNlZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SG9wMVp1bzFIVE1MKHBpZWNlczogTm9uVGFtUGllY2VbXSwgaXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XHJcbiAgICAgICAgY29uc3QgcmFkID0gMTggLyAwLjI2O1xyXG4gICAgICAgIGFucyArPSBgPGxpPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMjNweDsgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7Y2VsbF9zaXplfXB4OyBcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7IFxyXG4gICAgICAgICAgICBcIj5cclxuICAgICAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoY29sb3IsIHByb2YsIGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICR7aXNfbmV3bHlfYWNxdWlyZWQgJiYgaSA9PSBwaWVjZXMubGVuZ3RoIC0gMSA/IGA8ZGl2IHN0eWxlPVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7NDIgLSByYWR9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAkezQyIC0gcmFkfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke3JhZCAqIDJ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgNjAsIDYwLCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgXCI+PC9kaXY+YCA6IFwiXCJ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbGk+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3R2FtZVN0YXRlKFNUQVRFOiBTdGF0ZSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuaWFfc2lkZS5ob3AxenVvMSwgU1RBVEUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IGRyYXdGb2N1c1N0ZXBwZWQoU1RBVEUuZm9jdXNfc3RlcHBlZCkgK1xyXG4gICAgICAgIGRyYXdGb2N1c1NyYyhTVEFURS5mb2N1c19zcmMpICtcclxuICAgICAgICBkcmF3Rm9jdXNQbGFubmVkRGVzdChTVEFURS5mb2N1c19wbGFubmVkX2Rlc3QpICtcclxuICAgICAgICBkcmF3UGllY2VzT25Cb2FyZChTVEFURS5ib2FyZCwgU1RBVEUuZm9jdXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJOb3JtYWxQaWVjZShjb2xvcjogXCLpu5JcIiB8IFwi6LWkXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgeCA9IHByb2ZzLmluZGV4T2YocHJvZikgKiAtMTAwIC0gMjc7XHJcbiAgICBjb25zdCB5ID0gaXNfYm9sZCA/IDAgOiAtMjc3O1xyXG4gICAgY29uc3QgY29sb3JfcGF0aCA9IHtcclxuICAgICAgICBcIum7klwiOiBcIuOCtOOCt+ODg+OCr+mnklwiLFxyXG4gICAgICAgIFwi6LWkXCI6IFwi44K044K344OD44Kv6aeSX+i1pFwiLFxyXG4gICAgfVtjb2xvcl07XHJcbiAgICByZXR1cm4gYDxkaXZcclxuICAgIHN0eWxlPVwid2lkdGg6IDg3cHg7IGhlaWdodDogODdweDsgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAke3h9cHg7IGJhY2tncm91bmQtcG9zaXRpb24teTogJHt5fXB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtjb2xvcl9wYXRofS5zdmcpOyBcIj5cclxuPC9kaXY+YFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcG9zaXRpb25QaWVjZU9uQm9hcmQoY2xtOiBBYnNvbHV0ZUNvbHVtbiwgcnc6IEFic29sdXRlUm93LCBwaWVjZTogTm9uVGFtUGllY2UgfCBcIueah1wiLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZ2V0X3RvcF9sZWZ0KFtydywgY2xtXSk7XHJcbiAgICBpZiAocGllY2UgPT09IFwi55qHXCIpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke1wicm90YXRlKDkwZGVnKVwifVwiPlxyXG4gICAgICAgICAgICAke3JlbmRlck5vcm1hbFBpZWNlKFwi6buSXCIsIFwi55qHXCIsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YsIGlzX2FzaWRlIH0gPSBwaWVjZTtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke2lzX2FzaWRlID8gXCJyb3RhdGUoMTgwZGVnKVwiIDogXCJcIn1cIj5cclxuICAgICAgICAgICAgJHtyZW5kZXJOb3JtYWxQaWVjZShjb2xvciwgcHJvZiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQsIFBhcnNlZCwgQ2l1cmxFdmVudCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyXCI7XHJcbmltcG9ydCB7IEJvYXJkLCBOb25UYW1QaWVjZSwgU3RhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgeyBBYnNvbHV0ZUNvb3JkIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxCb2FyZCgpOiBCb2FyZCB7XHJcblx0cmV0dXJuIHtcclxuXHRcdEs6IHtcclxuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRMOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Tjoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRUOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Wjoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRPOiBcIueah1wiLFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRYOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0Qzoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdH0sXHJcblx0XHRNOiB7XHJcblx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHR9LFxyXG5cdFx0UDoge1xyXG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKG86IHtcclxuXHRpYV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZ1xyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHR9LFxyXG59KTogU3RhdGUge1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWFzb246IFwi5pilXCIsXHJcblx0XHR0dXJuOiAwLFxyXG5cdFx0cmF0ZTogMSxcclxuXHRcdGZvY3VzOiBudWxsLFxyXG5cdFx0Zm9jdXNfc3RlcHBlZDogbnVsbCxcclxuXHRcdGZvY3VzX3NyYzogbnVsbCxcclxuXHRcdGZvY3VzX3BsYW5uZWRfZGVzdDogbnVsbCxcclxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0XHRpc19uZXdseV9hY3F1aXJlZDogZmFsc2UsXHJcblx0XHR9LFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XHJcblx0Y29uc3QgcGllY2UgPSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdGlmICghcGllY2UpIHsgdGhyb3cgbmV3IEVycm9yKGDjgqjjg6njg7w6IOW6p+aomSR7Y29vcmRbMV19JHtjb29yZFswXX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTsgfVxyXG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xyXG5cdHJldHVybiBwaWVjZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X3RvKHN0YXRlOiBTdGF0ZSwgY29vcmQ6IEFic29sdXRlQ29vcmQsIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIpOiBOb25UYW1QaWVjZSB8IHVuZGVmaW5lZCB7XHJcblx0aWYgKHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0pIHtcclxuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcclxuXHRcdGlmIChjYXB0dXJlZF9waWVjZSA9PT0gXCLnmodcIikge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+eah+OBjOaXouOBq+OBguOCiuOBvuOBmWApO1xyXG5cdFx0fVxyXG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xyXG5cdFx0cmV0dXJuIGNhcHR1cmVkX3BpZWNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gcGllY2U7XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XHJcblx0aWYgKHBpZWNlLmlzX2FzaWRlKSB7XHJcblx0XHRzdGF0ZS5pYV9zaWRlLmhvcDF6dW8xLnB1c2goeyBjb2xvcjogcGllY2UuY29sb3IsIHByb2Y6IHBpZWNlLnByb2YsIGlzX2FzaWRlOiBmYWxzZSB9KTtcclxuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IHRydWUgfSk7XHJcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdWNjZXNzZnVsbHlDb21wbGV0ZWQoY2l1cmxfZXZlbnQ6IENpdXJsRXZlbnQpOiBib29sZWFuIHtcclxuXHRpZiAoY2l1cmxfZXZlbnQudHlwZSA9PT0gXCJub19jaXVybF9ldmVudFwiKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9IGVsc2UgaWYgKGNpdXJsX2V2ZW50LnR5cGUgPT09IFwib25seV9zdGVwcGluZ1wiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQuaW5mYWZ0ZXJzdGVwX3N1Y2Nlc3M7XHJcblx0fSBlbHNlIGlmIChjaXVybF9ldmVudC50eXBlID09PSBcImhhc193YXRlcl9lbnRyeVwiKSB7XHJcblx0XHRyZXR1cm4gY2l1cmxfZXZlbnQud2F0ZXJfZW50cnlfY2l1cmwgPj0gMztcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc3QgXzogbmV2ZXIgPSBjaXVybF9ldmVudDtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBjaXVybF9ldmVudC50eXBlXCIpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFN0YXRlKGN1cnJlbnRfc3RhdGU6IFJlYWRvbmx5PFN0YXRlPiwgYm9keV9lbGVtZW50OiBCb2R5RWxlbWVudCk6IFN0YXRlIHwgbnVsbCB7XHJcblx0Y29uc3QgbmV3X3N0YXRlOiBTdGF0ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY3VycmVudF9zdGF0ZSkpO1xyXG5cclxuXHQvLyBjbGVhciB0aGUgZmxhZ3NcclxuXHRuZXdfc3RhdGUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xyXG5cdG5ld19zdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSBmYWxzZTtcclxuXHRuZXdfc3RhdGUuZm9jdXNfc3JjID0gbnVsbDtcclxuXHRuZXdfc3RhdGUuZm9jdXMgPSBudWxsO1xyXG5cdG5ld19zdGF0ZS5mb2N1c19zdGVwcGVkID0gbnVsbDtcclxuXHJcblx0aWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInNlYXNvbl9lbmRzXCIpIHtcclxuXHRcdGlmIChjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5zZWFzb24gPVxyXG5cdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxyXG5cdFx0XHRcdGN1cnJlbnRfc3RhdGUuc2Vhc29uID09PSBcIuWkj1wiID8gXCLnp4tcIiA6XHJcblx0XHRcdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLnp4tcIiA/IFwi5YasXCIgOlxyXG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLnR1cm4gPSAwO1xyXG5cdFx0cmV0dXJuIG5ld19zdGF0ZTtcclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImZyb21faG9wenVvXCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJub3JtYWxfbW92ZVwiKSB7XHJcblx0XHRjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGJvZHlfZWxlbWVudC5jaXVybF9hbmRfY2FwdHVyZTtcclxuXHRcdGNpdXJsX2FuZF9jYXB0dXJlLmNpdXJsX2V2ZW50O1xyXG5cclxuXHRcdG5ld19zdGF0ZS50dXJuKys7XHJcblx0XHRuZXdfc3RhdGUuZm9jdXNfc3JjID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjO1xyXG5cclxuXHRcdGlmIChib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlID09PSBcIlNyY0RzdFwiKSB7XHJcblx0XHRcdGlmIChpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChib2R5X2VsZW1lbnQuY2l1cmxfYW5kX2NhcHR1cmUuY2l1cmxfZXZlbnQpKSB7XHJcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XHJcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XHJcblx0XHRcdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdDtcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXNfc3RlcHBlZCA9IG51bGw7XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzX3BsYW5uZWRfZGVzdCA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3Q7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmM7XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzX3N0ZXBwZWQgPSBudWxsO1xyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1c19wbGFubmVkX2Rlc3QgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGUgPT09IFwiU3JjU3RlcERzdFwiKSB7XHJcblx0XHRcdGlmIChpc1N1Y2Nlc3NmdWxseUNvbXBsZXRlZChib2R5X2VsZW1lbnQuY2l1cmxfYW5kX2NhcHR1cmUuY2l1cmxfZXZlbnQpKSB7XHJcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XHJcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XHJcblx0XHRcdFx0aWYgKG1heWJlX2NhcHR1cmVkX3BpZWNlKSB7XHJcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzID0gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdDtcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXNfc3RlcHBlZCA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXA7XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzX3BsYW5uZWRfZGVzdCA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3Q7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gZmFpbGVkIGF0dGVtcHRcclxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmM7XHJcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzX3N0ZXBwZWQgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zdGVwO1xyXG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1c19wbGFubmVkX2Rlc3QgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zdCBfOiBuZXZlciA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS50eXBlYCk7XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJlbmRfc2Vhc29uXCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJnYW1lX3NldFwiKSB7XHJcblxyXG5cdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50LnR5cGUgPT09IFwidGF4b3RcIikge1xyXG5cclxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInR5bW9rXCIpIHtcclxuXHJcblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJ0YW1fbW92ZVwiKSB7XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRjb25zdCBfOiBuZXZlciA9IGJvZHlfZWxlbWVudDtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQudHlwZVwiKTtcclxuXHR9XHJcblx0cmV0dXJuIG5ld19zdGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkOiBSZWFkb25seTxQYXJzZWQ+KTogU3RhdGVbXSB7XHJcblx0bGV0IGN1cnJlbnRfc3RhdGUgPSBnZXRJbml0aWFsU3RhdGUoe1xyXG5cdFx0aWFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLlvLVcIiwgcGxheWVyX25hbWU6IFwi5by15LiJXCIgfSxcclxuXHRcdGFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLmnY5cIiwgcGxheWVyX25hbWU6IFwi5p2O5ZubXCIgfVxyXG5cdH0pO1xyXG5cdGNvbnN0IGFuczogU3RhdGVbXSA9IFtjdXJyZW50X3N0YXRlXTtcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlZC5wYXJzZWRfYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBuZXh0X3N0YXRlID0gKCgpID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRyZXR1cm4gZ2V0TmV4dFN0YXRlKGN1cnJlbnRfc3RhdGUsIHBhcnNlZC5wYXJzZWRfYm9kaWVzW2ldKVxyXG5cdFx0XHR9IGNhdGNoIChlOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtpfeOCueODhuODg+ODl+ebruOBp+OBriR7ZX1gKTtcclxuXHRcdFx0XHRyZXR1cm4gY3VycmVudF9zdGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSkoKTtcclxuXHRcdGlmICghbmV4dF9zdGF0ZSkgYnJlYWs7XHJcblx0XHRhbnMucHVzaChuZXh0X3N0YXRlKTtcclxuXHRcdGN1cnJlbnRfc3RhdGUgPSBuZXh0X3N0YXRlO1xyXG5cdH1cclxuXHRyZXR1cm4gYW5zO1xyXG59XHJcbiIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdywgQWJzb2x1dGVDb29yZCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7XHJcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdEw6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHROOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdFo6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRYOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxyXG5cdE06IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcclxuXHRQOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xyXG5cclxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XHJcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0cmF0ZTogUmF0ZSxcclxuXHRmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0Zm9jdXNfc3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwsXHJcblx0Zm9jdXNfc3JjOiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCwgXHJcblx0Zm9jdXNfcGxhbm5lZF9kZXN0OiBBYnNvbHV0ZUNvb3JkIHwgbnVsbCxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiB7IGNvbG9yOiBcIui1pFwiIHwgXCLpu5JcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogZmFsc2UgfVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0XHRpc19uZXdseV9hY3F1aXJlZDogYm9vbGVhbixcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogeyBjb2xvcjogXCLotaRcIiB8IFwi6buSXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IHRydWUgfVtdLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHRcdGlzX25ld2x5X2FjcXVpcmVkOiBib29sZWFuLFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBcIui1pFwiIHwgXCLpu5JcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgcGFyc2VDZXJrZU9ubGluZUtpYTFBazEsIFBhcnNlZCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FzZTEgPVxyXG5cdGB75LiA5L2N6ImyOum7kum7kum7kn1cclxue+Wni+aZgjoyMDIyLTA1LTMxVDE3OjE2OjAyLjQzM1p9XHJcbnvntYLmmYI6MjAyMi0wNS0zMVQxODoxMzo1Mi4zNTdafVxyXG5NQVXlvJNNQUlNWeapi+S6lCAgICBQReW3q1BJUFXnhKHmkoPoo4FcclxuQ0FJ5YW1Q0FV54Sh5pKD6KOBICAgIE1F5byTQ0XnhKHmkoPoo4FcclxuUEFV5berQ0FVQ0FJ54Sh5pKD6KOBICAgIFpB546LWkXnhKHmkoPoo4FcclxuTVnlvJNNSU1B5qmL5LiA5q2k54ShICAgIENJ5YW1TUlNVeeEoeaSg+ijgVxyXG5DQUnlt6tDQU1B5qmL5LiA5omL6LWk6aasICAgIFBB562GTUHnhKHmkoPoo4HmiYvotaTlt6tcclxuTEFV5byTTEFJTFnmqYvkuIkgICAgVEXomY5OSVRV5qmL5LiAXHJcbkxZ5byTTElMReapi+S4ieaJi+i1pOW8kyAgICBLQeethktFTEXnhKHmkoPoo4HmiYvpu5LlvJNcclxuTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuWFtVxyXG5cclxu5oiW54K66aas5byT5YW16ICM5omL5LqUXHJcbue1guWtoyAgICDmmKXntYJcclxuXHJcbk1BVeW8k01BSU1Z5qmL5LiJICAgIFhF6JmOWklYVeeEoeaSg+ijgVxyXG5YQUnlhbVYWeeEoeaSg+ijgSAgICBYVeiZjk1Z54Sh5pKD6KOB5omL6LWk5byTXHJcblhBVeiZjkNBSU1Z5qmL5Zub5omL6buS6JmOICAgIE1F5byTTUlNVeapi+S4iVxyXG5LQVXlt6tLQUlLWeeEoeaSg+ijgSAgICBaT+eah1tUVV1aSVpFXHJcblBBVeW3q1pBVeeEoeaSg+ijgSAgICBDSeWFtUNF54Sh5pKD6KOBXHJcblpBSeiIuVpJ54Sh5pKD6KOB5omL6LWk6Ii5ICAgIFRF6JmOWknmsLTkuozmraTnhKFcclxuWkXnmodUSVtOVV1MTyAgICBYQeWwhlpF54Sh5pKD6KOBXHJcblpJ6Ii5WkVaQeapi+Wbm+aJi+i1pOeOi1xyXG5cclxu5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbue1guWtoyAgICDlpI/ntYJcclxuXHJcbk1BVeW8k01BSU1Z5qmL5LqMICAgIE1F5byTTUlNVeapi+S4iVxyXG5DQUnlhbVDQVXnhKHmkoPoo4EgICAgWEXomY5aSVhV54Sh5pKD6KOBXHJcbk1Z5byTTVXnhKHmkoPoo4HmiYvpu5LlvJMgICAgTUnlhbVNVeeEoeaSg+ijgeaJi+i1pOW8k1xyXG5QQVXlt6tDQVVDQUnnhKHmkoPoo4EgICAgWkHnjotaReeEoeaSg+ijgVxyXG5DQUnlt6tDQVhB5qmL5LiJ5omL6LWk5bCGICAgIFpF546LWEHnhKHmkoPoo4HmiYvotaTlt6tcclxuUElB562GUEFJUFnmqYvkuIAgICAgUEXlt6taReeEoeaSg+ijgVxyXG5QWeethlBJUEHmqYvkuozmiYvotaTnrYYgICAgQ0Hou4pQQeeEoeaSg+ijgeaJi+m7kuethlxyXG5MQVXlvJNMQUlMWeapi+S4gCAgICBMReW8k0xJTFXmqYvlm5tcclxuTFnlvJNMVeeEoeaSg+ijgeaJi+i1pOW8kyAgICBMSeWFtUxV54Sh5pKD6KOB5omL6buS5byTXHJcbum7kuW8k0NZICAgIOm7kuW8k0NVXHJcbkNZ5byTQ1XnhKHmkoPoo4HmiYvpu5LlvJMgICAgQ0nlhbVDVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG7pu5LlvJNNSSAgICBYQeeOi0NF54Sh5pKD6KOBXHJcbk1J5byTTUHnhKHmkoPoo4HmiYvotaTppqwgICAgQ0XnjotNQeeEoeaSg+ijgeaJi+m7kuW8k1xyXG5UQVXomY5aQUlUWeeEoeaSg+ijgSAgICBOSeWFtU5P5rC05LiJXHJcblRZ6JmOTk9MVeeEoeaSg+ijgeaJi+i1pOWFtVxyXG5cclxu5oiW54K65ZCM6Imy6aas5byT5YW16ICM5omL5LiDXHJcbue1guWtoyAgICDnp4vntYJcclxuXHJcblxyXG7mmJ/kuIDlkahgO1xyXG5cclxuICAgIGNvbnN0IHBhcnNlZDogUGFyc2VkID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEoY2FzZTEpO1xyXG4gICAgY29uc3Qgc3RhdGVzOiBTdGF0ZVtdID0gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQpO1xyXG5cclxuICAgIGRyYXdFbXB0eUJvYXJkKCk7XHJcbiAgICBjb25zdCB0dXJuX3NsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybl9zbGlkZXJcIikhIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0dXJuX3NsaWRlci5taW4gPSBcIjBcIjtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke3N0YXRlcy5sZW5ndGggLSAxfWA7XHJcbiAgICB0dXJuX3NsaWRlci52YWx1ZSA9IFwiMFwiO1xyXG4gICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbMF0pO1xyXG4gICAgdHVybl9zbGlkZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpXSk7XHJcbiAgICB9XHJcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
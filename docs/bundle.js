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
                "type": "normal_move",
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
                "type": "normal_move",
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
            "type": "normal_move",
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
        return { ans: {}, rest: s.slice(3) };
    }
    const try_munch_water = (0, exports.munchWaterEvent)(s);
    if (try_munch_water) {
        const { ans, rest } = try_munch_water;
        return { ans: { water_entry_ciurl: ans }, rest };
    }
    if (s.startsWith("橋")) {
        const t = s.slice(1);
        const stepping_ciurl = t[0] === "無" ? 0 :
            t[0] === "一" ? 1 :
                t[0] === "二" ? 2 :
                    t[0] === "三" ? 3 :
                        t[0] === "四" ? 4 :
                            t[0] === "五" ? 5 : (() => { throw new Error("Unexpected character found after 橋"); });
        const rest = t.slice(1);
        // Either nothing, 此無, or munchWaterEvent
        const try_munch_water = (0, exports.munchWaterEvent)(rest);
        if (try_munch_water) {
            const { ans: water_entry_ciurl, rest: rest2 } = try_munch_water;
            return { ans: { stepping_ciurl, water_entry_ciurl }, rest: rest2 };
        }
        else if (rest.startsWith("此無")) {
            return { ans: { stepping_ciurl, infafterstep_success: false }, rest: "" };
        }
        else {
            return { ans: { stepping_ciurl, infafterstep_success: true }, rest };
        }
    }
    else {
        throw new Error(`Unparsable Ciurl event: \`${s}\``);
    }
};
exports.munchCiurlEvent = munchCiurlEvent;
function handleTrailingParameters(s) {
    const try_ciurl_event = (0, exports.munchCiurlEvent)(s);
    if (!try_ciurl_event) {
        throw new Error(`Unparsable trailing parameter: \`${s}\``);
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
            "type": "normal_move",
            movement: {
                type: "NonTamMove", data: {
                    type: "FromHand",
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
                    type: "SrcStepDstFinite",
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
exports.drawGameState = exports.drawPiecesOnBoard = exports.drawEmptyBoard = exports.top_margin = exports.left_margin = exports.height = void 0;
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
exports.height = 387;
exports.left_margin = 40;
exports.top_margin = 40;
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
        ctx.fillText(columns[i], exports.left_margin + exports.height + 10, exports.top_margin + 30 + 43 * i);
    }
    var rows = ["K", "L", "N", "T", "Z", "X", "C", "M", "P"];
    ctx.textAlign = "center";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(rows[i], exports.left_margin + 20 + 43 * i, exports.top_margin - 10);
    }
    ctx.save();
    ctx.rotate(Math.PI);
    ctx.textAlign = "left";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(columns[i], -exports.left_margin + 10, -(exports.top_margin + 15 + 43 * i));
    }
    ctx.textAlign = "center";
    for (var i = 0; i < 9; i++) {
        ctx.fillText(rows[i], -(exports.left_margin + 20 + 43 * i), -(exports.top_margin + exports.height + 10));
    }
    ctx.restore();
}
exports.drawEmptyBoard = drawEmptyBoard;
function drawPiecesOnBoard(board, focus) {
    var ans = "";
    for (var clm in board) {
        for (var rw in board[clm]) {
            var is_focused = focus ? focus[0] == clm && focus[1] == rw : false;
            ans += positionPieceOnBoard(clm, rw, board[clm][rw], is_focused);
        }
    }
    document.getElementById("pieces_inner").innerHTML = ans;
}
exports.drawPiecesOnBoard = drawPiecesOnBoard;
function getHop1Zuo1HTML(pieces) {
    var ans = "";
    for (var i = 0; i < pieces.length; i++) {
        var _a = pieces[i], color = _a.color, prof = _a.prof;
        ans += "<li><div style=\"width: 23px; height: 43px; transform: scale(0.26); transform-origin: top left\">".concat(renderNormalPiece(color, prof, false), "</div></li>");
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
    document.getElementById("a_side_piece_stand").innerHTML = getHop1Zuo1HTML(STATE.a_side.hop1zuo1);
    document.getElementById("ia_side_piece_stand").innerHTML = getHop1Zuo1HTML(STATE.ia_side.hop1zuo1);
    document.getElementById("a_side_current_score").innerHTML = STATE.a_side.score + "";
    document.getElementById("ia_side_current_score").innerHTML = STATE.ia_side.score + "";
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
    }[clm];
    var row = {
        IA: 8,
        AU: 7,
        AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
    }[rw];
    var left = exports.left_margin + 43 * (column - 0.5);
    var top = exports.top_margin + 43 * (row - 0.5);
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
exports.getNthState = exports.getAllStatesFromParsed = exports.getNextState = void 0;
function getInitialState(o) {
    return {
        season: "春",
        turn: 0,
        rate: 1,
        focus: null,
        board: {
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
        },
        ia_side: {
            player_name_short: o.ia_side.player_name_short,
            hop1zuo1: [],
            player_name: o.ia_side.player_name,
            score: 20,
        },
        a_side: {
            player_name_short: o.a_side.player_name_short,
            player_name: o.a_side.player_name,
            hop1zuo1: [],
            score: 20,
        },
    };
}
function getNextState(current_state, body_element) {
    var new_state = JSON.parse(JSON.stringify(current_state));
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
    return new_state;
}
exports.getNextState = getNextState;
function getAllStatesFromParsed(parsed) {
    var ans = [];
    var current_state = getInitialState({
        ia_side: { player_name_short: "張", player_name: "張三" },
        a_side: { player_name_short: "李", player_name: "李四" }
    });
    for (var i = 0; i < parsed.parsed_bodies.length; i++) {
        var next_state = getNextState(current_state, parsed.parsed_bodies[i]);
        if (!next_state)
            break;
        ans.push(next_state);
        current_state = next_state;
    }
    return ans;
}
exports.getAllStatesFromParsed = getAllStatesFromParsed;
function getNthState(n) {
    if (n == 1) {
        return getInitialState({
            ia_side: {
                player_name_short: "筆",
                player_name: "筆墨風"
            },
            a_side: {
                player_name_short: "星",
                player_name: "星享青",
            }
        });
    }
    return {
        season: "秋",
        turn: n,
        rate: 4,
        focus: ["P", "O"],
        board: {
            C: {
                AI: { color: "黒", prof: "車", is_aside: false },
                E: { color: "赤", prof: "将", is_aside: true },
                I: { color: "赤", prof: "車", is_aside: true },
                U: { color: "黒", prof: "兵", is_aside: true },
                Y: { color: "黒", prof: "兵", is_aside: false },
            },
            K: {
                A: { color: "黒", prof: "筆", is_aside: true },
                AI: { color: "黒", prof: "兵", is_aside: false },
                AU: { color: "黒", prof: "巫", is_aside: false },
                E: { color: "赤", prof: "巫", is_aside: true },
                IA: { color: "赤", prof: "筆", is_aside: false },
                U: { color: "黒", prof: "兵", is_aside: true }
            },
            L: {
                AI: { color: "赤", prof: "兵", is_aside: false },
                AU: { color: "黒", prof: "弓", is_aside: false },
                E: { color: "赤", prof: "弓", is_aside: true },
                IA: { color: "赤", prof: "馬", is_aside: false },
                U: { color: "赤", prof: "兵", is_aside: true }
            },
            M: {
                A: { color: "赤", prof: "馬", is_aside: true },
                AU: { color: "赤", prof: "弓", is_aside: false },
                I: { color: "赤", prof: "兵", is_aside: true },
                IA: { color: "黒", prof: "馬", is_aside: false },
                O: { color: "赤", prof: "兵", is_aside: false }
            },
            N: {
                AI: { color: "赤", prof: "将", is_aside: false },
                AU: { color: "赤", prof: "車", is_aside: false },
                I: { color: "黒", prof: "兵", is_aside: true },
                Y: { color: "黒", prof: "兵", is_aside: false }
            },
            P: {
                A: { color: "赤", prof: "筆", is_aside: true },
                AU: { color: "赤", prof: "巫", is_aside: false },
                E: { color: "黒", prof: "巫", is_aside: true },
                I: { color: "黒", prof: "弓", is_aside: true },
                IA: { color: "黒", prof: "筆", is_aside: false },
                U: { color: "黒", prof: "兵", is_aside: true },
                O: { color: "黒", prof: "兵", is_aside: false },
            },
            T: {
                A: { color: "赤", prof: "王", is_aside: true },
                AI: { color: "赤", prof: "兵", is_aside: false },
                AU: { color: "黒", prof: "虎", is_aside: false },
                E: { color: "黒", prof: "車", is_aside: true },
                I: { color: "赤", prof: "兵", is_aside: true }
            },
            X: {
                AU: { color: "赤", prof: "兵", is_aside: true },
                E: { color: "黒", prof: "虎", is_aside: true },
                I: { color: "黒", prof: "将", is_aside: true }
            },
            Z: {
                A: { color: "赤", prof: "虎", is_aside: true },
                AI: { color: "黒", prof: "船", is_aside: false },
                IA: { color: "黒", prof: "王", is_aside: false },
                O: "皇",
                U: { color: "赤", prof: "船", is_aside: true },
                Y: { color: "黒", prof: "将", is_aside: false }
            },
        },
        ia_side: {
            player_name_short: "筆",
            hop1zuo1: [{ color: "黒", prof: "馬", is_aside: false }],
            player_name: "筆墨風",
            score: 28,
        },
        a_side: {
            player_name_short: "星",
            player_name: "星享青",
            hop1zuo1: [{ color: "赤", prof: "兵", is_aside: true }, { color: "赤", prof: "虎", is_aside: true }],
            score: 12,
        },
    };
}
exports.getNthState = getNthState;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxt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LEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDOUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsR0FBRztnQkFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDOUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtn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LEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQzVDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTthQUM1QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDN0M7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDN0M7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDN0M7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQzVDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM3QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7YUFDNUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzdDO1NBQ0Q7UUFDRCxPQUFPLEVBQUU7WUFDUixpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN0RCxXQUFXLEVBQUUsS0FBSztZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNUO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsR0FBRztZQUN0QixXQUFXLEVBQUUsS0FBSztZQUNsQixRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ2hHLEtBQUssRUFBRSxFQUFFO1NBQ1Q7S0FFRCxDQUFDO0FBRUgsQ0FBQztBQW5HRCxrQ0FtR0M7Ozs7Ozs7Ozs7Ozs7O0FDcE9ZLGFBQUssR0FBNEI7SUFDN0MsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO0NBQzFELENBQUM7Ozs7Ozs7VUNQRjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEsaUpBQXlGO0FBQ3pGLGdFQUF1RDtBQUN2RCxtRUFBOEQ7QUFHOUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtJQUM1QixJQUFNLEtBQUssR0FDZCxtZ0ZBK0NHLENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBVyx1REFBdUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxJQUFNLE1BQU0sR0FBWSxrQ0FBc0IsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUV2RCx5QkFBYyxHQUFFLENBQUM7SUFDakIsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQXNCLENBQUM7SUFDaEYsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDdEIsV0FBVyxDQUFDLEdBQUcsR0FBRyxVQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUM7SUFDekMsV0FBVyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDeEIsd0JBQWEsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixXQUFXLENBQUMsT0FBTyxHQUFHO1FBQ2xCLHdCQUFhLEVBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaGFuZGxlX2JvZHlfZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvbXVuY2hfbW9uYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L3JlYWRfcGVremVwX251bWVyYWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gZXhwb3J0cy5oYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMgPSBleHBvcnRzLm11bmNoQ2l1cmxFdmVudCA9IGV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gZXhwb3J0cy5oYW5kbGVZYWt1ID0gZXhwb3J0cy5oYW5kbGVUYW1Nb3ZlID0gdm9pZCAwO1xyXG5jb25zdCBtdW5jaGVyc18xID0gcmVxdWlyZShcIi4vbXVuY2hlcnNcIik7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuZnVuY3Rpb24gaGFuZGxlVGFtTW92ZShzKSB7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAocmVzdC5jaGFyQXQoMCkgIT09IFwi55qHXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHRhbTIgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICAvLyB0aGUgZm9ybWF0IGlzIGVpdGhlcjpcclxuICAgIC8vIC0gWlXnmodbVE9dVFVcclxuICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICBjb25zdCB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGZpcnN0RGVzdCwgbmV4dCkgPT4gKHsgZmlyc3REZXN0LCBuZXh0IH0pLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICBpZiAodHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQpIHtcclxuICAgICAgICAvLyBlaXRoZXI6XHJcbiAgICAgICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgICAgIC8vIC0gWk/nmodbWlVdWklaRVxyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGZpcnN0RGVzdCwgbmV4dCB9LCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX2JyYWNrZXRfYW5kX25vbmJyYWNrZXQ7XHJcbiAgICAgICAgaWYgKHJlc3QyID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlRhbU1vdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiTm9TdGVwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLCBmaXJzdERlc3QsIHNlY29uZERlc3Q6IG5leHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyeV9tdW5jaF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3QyKTtcclxuICAgICAgICAgICAgaWYgKCF0cnlfbXVuY2hfY29vcmQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiBzZWNvbmREZXN0LCByZXN0OiBlbXB0eSB9ID0gdHJ5X211bmNoX2Nvb3JkO1xyXG4gICAgICAgICAgICBpZiAoZW1wdHkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke2VtcHR5fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgICAgIG1vdmVtZW50OiB7IHR5cGU6IFwiVGFtTW92ZVwiLCBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdMYXR0ZXJcIiwgc3JjLCBmaXJzdERlc3QsIHN0ZXA6IG5leHQsIHNlY29uZERlc3QgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIC0gVFnnmodUQUlbVEFVXVpBVVxyXG4gICAgICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0KSA9PiAoeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSksIG11bmNoZXJzXzEubXVuY2hDb29yZCwgbXVuY2hlcnNfMS5tdW5jaEJyYWNrZXRlZENvb3JkLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgICAgIGlmICghbXVuY2gpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QgfSwgcmVzdDogZW1wdHkgfSA9IG11bmNoO1xyXG4gICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RlcFN0eWxlOiBcIlN0ZXBzRHVyaW5nRm9ybWVyXCIsXHJcbiAgICAgICAgICAgICAgICBzcmMsIHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRhbU1vdmUgPSBoYW5kbGVUYW1Nb3ZlO1xyXG5mdW5jdGlvbiBoYW5kbGVZYWt1KHMpIHtcclxuICAgIC8vIOaIlueCuueOi+WKoOeNo1xyXG4gICAgLy8g5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbiAgICBjb25zdCBoYW5kc1NlcEJ5QXQgPSAoMCwgbXVuY2hfbW9uYWRfMS5zZXBCeTEpKHsgcDogbXVuY2hlcnNfMS5tdW5jaEhhbmQsIHNlcDogKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuWKoFwiKSB9KTtcclxuICAgIGNvbnN0IG11bmNoID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgaGFuZHMpID0+IGhhbmRzLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5oiW54K6XCIpLCBoYW5kc1NlcEJ5QXQpKHMpO1xyXG4gICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGhhbmRzLCByZXN0IH0gPSBtdW5jaDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0eW1va1wiLCBoYW5kcyB9O1xyXG4gICAgfVxyXG4gICAgY29uc3QgbXVuY2gyID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoXywgbnVtKSA9PiBudW0sICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLogIzmiYtcIiksIG11bmNoZXJzXzEubXVuY2hQZWt6ZXBOdW1lcmFsKShyZXN0KTtcclxuICAgIGlmICghbXVuY2gyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2NvcmUsIHJlc3Q6IHJlc3QyIH0gPSBtdW5jaDI7XHJcbiAgICBpZiAocmVzdDIgIT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IHR5cGU6IFwidGF4b3RcIiwgaGFuZHMsIHNjb3JlIH07XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVZYWt1ID0gaGFuZGxlWWFrdTtcclxuY29uc3QgbXVuY2hXYXRlckV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLmsLRcIikpIHtcclxuICAgICAgICBjb25zdCB0ID0gcy5zbGljZSgxKTtcclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi54Sh5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiA5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMSwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqM5q2k54ShXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogdC5zbGljZSgzKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LiJXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5ZubXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNCwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodC5zdGFydHNXaXRoKFwi5LqUXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogdC5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5leHBvcnRzLm11bmNoV2F0ZXJFdmVudCA9IG11bmNoV2F0ZXJFdmVudDtcclxuY29uc3QgbXVuY2hDaXVybEV2ZW50ID0gKHMpID0+IHtcclxuICAgIGlmIChzLnN0YXJ0c1dpdGgoXCLnhKHmkoPoo4FcIikpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHt9LCByZXN0OiBzLnNsaWNlKDMpIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfd2F0ZXIgPSAoMCwgZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQpKHMpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF93YXRlcikge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zLCByZXN0IH0gPSB0cnlfbXVuY2hfd2F0ZXI7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHdhdGVyX2VudHJ5X2NpdXJsOiBhbnMgfSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuapi1wiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBwaW5nX2NpdXJsID0gdFswXSA9PT0gXCLnhKFcIiA/IDAgOlxyXG4gICAgICAgICAgICB0WzBdID09PSBcIuS4gFwiID8gMSA6XHJcbiAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS6jFwiID8gMiA6XHJcbiAgICAgICAgICAgICAgICAgICAgdFswXSA9PT0gXCLkuIlcIiA/IDMgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuWbm1wiID8gNCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS6lFwiID8gNSA6ICgoKSA9PiB7IHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgY2hhcmFjdGVyIGZvdW5kIGFmdGVyIOapi1wiKTsgfSk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHQuc2xpY2UoMSk7XHJcbiAgICAgICAgLy8gRWl0aGVyIG5vdGhpbmcsIOatpOeEoSwgb3IgbXVuY2hXYXRlckV2ZW50XHJcbiAgICAgICAgY29uc3QgdHJ5X211bmNoX3dhdGVyID0gKDAsIGV4cG9ydHMubXVuY2hXYXRlckV2ZW50KShyZXN0KTtcclxuICAgICAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5zOiB3YXRlcl9lbnRyeV9jaXVybCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHN0ZXBwaW5nX2NpdXJsLCB3YXRlcl9lbnRyeV9jaXVybCB9LCByZXN0OiByZXN0MiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXN0LnN0YXJ0c1dpdGgoXCLmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogZmFsc2UgfSwgcmVzdDogXCJcIiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiB7IHN0ZXBwaW5nX2NpdXJsLCBpbmZhZnRlcnN0ZXBfc3VjY2VzczogdHJ1ZSB9LCByZXN0IH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIENpdXJsIGV2ZW50OiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gbXVuY2hDaXVybEV2ZW50O1xyXG5mdW5jdGlvbiBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocykge1xyXG4gICAgY29uc3QgdHJ5X2NpdXJsX2V2ZW50ID0gKDAsIGV4cG9ydHMubXVuY2hDaXVybEV2ZW50KShzKTtcclxuICAgIGlmICghdHJ5X2NpdXJsX2V2ZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIHRyYWlsaW5nIHBhcmFtZXRlcjogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IGNpdXJsX2V2ZW50LCByZXN0IH0gPSB0cnlfY2l1cmxfZXZlbnQ7XHJcbiAgICBpZiAocmVzdCA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybiB7IGNpdXJsX2V2ZW50IH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBvcHRpb25hbF9waWVjZV9jYXB0dXJlID0gKDAsIG11bmNoZXJzXzEubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50KShyZXN0KTtcclxuICAgIGlmIChvcHRpb25hbF9waWVjZV9jYXB0dXJlKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHBpZWNlX2NhcHR1cmUsIHJlc3Q6IHJlc3QyIH0gPSBvcHRpb25hbF9waWVjZV9jYXB0dXJlO1xyXG4gICAgICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyYWlsaW5nIHBhcmFtZXRlciBcXGAke3N9XFxgIGhhcyBzb21lIGV4dHJhIFxcYCR7cmVzdDJ9XFxgIGF0IHRoZSBlbmRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQsIHBpZWNlX2NhcHR1cmUgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSB0cmFpbGluZyBwYXJhbWV0ZXI6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycztcclxuZnVuY3Rpb24gaGFuZGxlQm9keUVsZW1lbnQocykge1xyXG4gICAgaWYgKHMgPT09IFwi5pil57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDAgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuWkj+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAxIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLnp4vntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5Yas57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDMgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIue1guWto1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZW5kX3NlYXNvblwiIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLmmJ/kuIDlkahcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcImdhbWVfc2V0XCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi54K6XCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVlha3Uocyk7XHJcbiAgICB9XHJcbiAgICBpZiAocy5pbmNsdWRlcyhcIueah1wiKSkge1xyXG4gICAgICAgIHJldHVybiBoYW5kbGVUYW1Nb3ZlKHMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoX2Zyb21faG9wenVvID0gKDAsIG11bmNoZXJzXzEubXVuY2hGcm9tSG9wWnVvKShzKTtcclxuICAgIGlmICh0cnlfbXVuY2hfZnJvbV9ob3B6dW8pIHtcclxuICAgICAgICBjb25zdCB7IGFuczogeyBjb2xvciwgcHJvZiwgZGVzdCB9LCByZXN0IH0gPSB0cnlfbXVuY2hfZnJvbV9ob3B6dW87XHJcbiAgICAgICAgaWYgKHJlc3QgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7cmVzdH1cXGAgZm91bmQgd2l0aGluICBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRnJvbUhhbmRcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBwcm9mLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfc3JjID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocyk7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF9zcmMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzcmMsIHJlc3QgfSA9IHRyeV9tdW5jaF9zcmM7XHJcbiAgICBpZiAoIVtcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIuiIuVwiLCBcIueJh1wiXS5pbmNsdWRlcyhyZXN0LmNoYXJBdCgwKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIGEgcHJvZmVzc2lvbiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF8ybmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICghdHJ5X211bmNoXzJuZF9jb29yZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGhlIHNlY29uZCBjb29yZGluYXRlIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNlY29uZF9jb29yZCwgcmVzdDogcmVzdDIgfSA9IHRyeV9tdW5jaF8ybmRfY29vcmQ7XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfM3JkX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfM3JkX2Nvb3JkKSB7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjRHN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHNlY29uZF9jb29yZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaXVybF9hbmRfY2FwdHVyZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGFuczogdGhpcmRfY29vcmQsIHJlc3Q6IHJlc3QzIH0gPSB0cnlfbXVuY2hfM3JkX2Nvb3JkO1xyXG4gICAgICAgIGNvbnN0IGNpdXJsX2FuZF9jYXB0dXJlID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzKHJlc3QzKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJOb25UYW1Nb3ZlXCIsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNyY1N0ZXBEc3RGaW5pdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogc2Vjb25kX2Nvb3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IHRoaXJkX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmhhbmRsZUJvZHlFbGVtZW50ID0gaGFuZGxlQm9keUVsZW1lbnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSB2b2lkIDA7XHJcbmNvbnN0IGhhbmRsZV9ib2R5X2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZV9ib2R5X2VsZW1lbnRcIik7XHJcbi8vIFZlcnkgcHJpbWl0aXZlIHBhcnNlciB0aGF0IG5ldmVyIGhhbmRsZXMgYWxsIHRoZSBlZGdlIGNhc2VzXHJcbmZ1bmN0aW9uIHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxKHMpIHtcclxuICAgIGNvbnN0IGxpbmVzID0gcy50cmltKCkuc3BsaXQoXCJcXG5cIikubWFwKGwgPT4gbC50cmltKCkpO1xyXG4gICAgY29uc3QgaW5pdGlhbF9saW5lID0gbGluZXNbMF07XHJcbiAgICBpZiAoaW5pdGlhbF9saW5lID09PSB1bmRlZmluZWQgLyogU2luY2Ugd2UgdXNlZCAuc3BsaXQoKSwgdGhpcyBhY3R1YWxseSBjYW4ndCBoYXBwZW4gKi8gfHwgaW5pdGlhbF9saW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM44GC44KK44G+44Gb44KTXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoL15cXHvlp4vmmYI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+Wni+aZgjog44Gn5aeL44G+44Gj44Gm44GE44G+44GZ44CC44GT44KM44GvMjAyMeW5tDEx5pyI5pyr44Ki44OD44OX44OH44O844OI5Lul5YmN44Gu5qOL6K2c44Gn44GC44KK44CB44G+44Gg5a++5b+c44Gn44GN44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIS9eXFx75LiA5L2N6ImyOi8udGVzdChpbml0aWFsX2xpbmUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GMIHvkuIDkvY3oibI6IOOBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk+OAglwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0aW5nX3BsYXllcnMgPSBpbml0aWFsX2xpbmUubWF0Y2goL15cXHvkuIDkvY3oibI6KFvpu5LotaRdKylcXH0kLyk/LlsxXTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nX3RpbWUgPSBsaW5lc1sxXT8ubWF0Y2goL15cXHvlp4vmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgZW5kaW5nX3RpbWUgPSBsaW5lc1syXT8ubWF0Y2goL15cXHvntYLmmYI6KFtefV0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3QgYm9kaWVzID0gbGluZXMuc2xpY2UoMykuZmxhdE1hcChsaW5lID0+IGxpbmUuc3BsaXQoL1tcXHNcXG5dL2cpKS5maWx0ZXIoYSA9PiBhICE9PSBcIlwiKTtcclxuICAgIGNvbnN0IHBhcnNlZF9ib2RpZXMgPSBib2RpZXMubWFwKGhhbmRsZV9ib2R5X2VsZW1lbnRfMS5oYW5kbGVCb2R5RWxlbWVudCk7XHJcbiAgICByZXR1cm4geyBzdGFydGluZ19wbGF5ZXJzLCBzdGFydGluZ190aW1lLCBlbmRpbmdfdGltZSwgcGFyc2VkX2JvZGllcyB9O1xyXG59XHJcbmV4cG9ydHMucGFyc2VDZXJrZU9ubGluZUtpYTFBazEgPSBwYXJzZUNlcmtlT25saW5lS2lhMUFrMTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXBCeTEgPSBleHBvcnRzLm1hbnkxID0gZXhwb3J0cy5tYW55ID0gZXhwb3J0cy5saWZ0TTMgPSBleHBvcnRzLnN0cmluZyA9IGV4cG9ydHMubGlmdE0yID0gZXhwb3J0cy5wdXJlID0gZXhwb3J0cy5iaW5kID0gdm9pZCAwO1xyXG4vLyBtb25hZFxyXG5jb25zdCBiaW5kID0gKG1hLCBjYWxsYmFjaykgPT4gKChpbnB1dCkgPT4ge1xyXG4gICAgY29uc3QgcmVzMSA9IG1hKGlucHV0KTtcclxuICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soYSkocmVzdCk7XHJcbn0pO1xyXG5leHBvcnRzLmJpbmQgPSBiaW5kO1xyXG5jb25zdCBwdXJlID0gKGEpID0+IChpbnB1dCkgPT4gKHsgYW5zOiBhLCByZXN0OiBpbnB1dCB9KTtcclxuZXhwb3J0cy5wdXJlID0gcHVyZTtcclxuY29uc3QgbGlmdE0yID0gKGYsIG1hLCBtYikgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiKSkpKTtcclxuZXhwb3J0cy5saWZ0TTIgPSBsaWZ0TTI7XHJcbmNvbnN0IHN0cmluZyA9IChwcmVmaXgpID0+IChpbnB1dCkgPT4gaW5wdXQuc3RhcnRzV2l0aChwcmVmaXgpID8geyBhbnM6IHVuZGVmaW5lZCwgcmVzdDogaW5wdXQuc2xpY2UocHJlZml4Lmxlbmd0aCkgfSA6IG51bGw7XHJcbmV4cG9ydHMuc3RyaW5nID0gc3RyaW5nO1xyXG5jb25zdCBsaWZ0TTMgPSAoZiwgbWEsIG1iLCBtYykgPT4gKDAsIGV4cG9ydHMuYmluZCkobWEsIGEgPT4gKDAsIGV4cG9ydHMuYmluZCkobWIsIGIgPT4gKDAsIGV4cG9ydHMuYmluZCkobWMsIGMgPT4gKDAsIGV4cG9ydHMucHVyZSkoZihhLCBiLCBjKSkpKSk7XHJcbmV4cG9ydHMubGlmdE0zID0gbGlmdE0zO1xyXG5jb25zdCBtYW55ID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGxldCByZXN0ID0gaW5wdXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueSA9IG1hbnk7XHJcbmNvbnN0IG1hbnkxID0gKG1hKSA9PiBpbnB1dCA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBsZXQgeyBhbnM6IGEsIHJlc3QgfSA9IHJlczE7XHJcbiAgICBjb25zdCBhbnMgPSBbYV07XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlczEgPSBtYShyZXN0KTtcclxuICAgICAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zLCByZXN0IH07XHJcbiAgICAgICAgY29uc3QgeyBhbnM6IGEsIHJlc3Q6IHIgfSA9IHJlczE7XHJcbiAgICAgICAgYW5zLnB1c2goYSk7XHJcbiAgICAgICAgcmVzdCA9IHI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubWFueTEgPSBtYW55MTtcclxuY29uc3Qgc2VwQnkxID0gKHsgcDogbWEsIHNlcCB9KSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKSgoMCwgZXhwb3J0cy5tYW55KSgoMCwgZXhwb3J0cy5iaW5kKShzZXAsIChfKSA9PiBtYSkpLCBhcyA9PiAoMCwgZXhwb3J0cy5wdXJlKShbYSwgLi4uYXNdKSkpO1xyXG5leHBvcnRzLnNlcEJ5MSA9IHNlcEJ5MTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBleHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSBleHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9IGV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gZXhwb3J0cy5tdW5jaENvb3JkID0gZXhwb3J0cy5tdW5jaEhhbmQgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoX21vbmFkXzEgPSByZXF1aXJlKFwiLi9tdW5jaF9tb25hZFwiKTtcclxuY29uc3QgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMSA9IHJlcXVpcmUoXCIuL3JlYWRfcGVremVwX251bWVyYWxzXCIpO1xyXG5jb25zdCBtdW5jaENvbG9yID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLotaRcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQcm9mZXNzaW9uID0gKHMpID0+IHtcclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLoiLlcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuWFtVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5byTXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDIsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLou4pcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMywgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiZjlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6aasXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDUsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnrYZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuW3q1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA3LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5bCGXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDgsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoQ29sdW1uID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGNvbHMgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgaWYgKHMuY2hhckF0KDApID09PSBjb2wpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiBjb2wsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hSb3cgPSAocykgPT4ge1xyXG4gICAgY29uc3Qgcm93cyA9IFtcIkFJXCIsIFwiQVVcIiwgXCJJQVwiIC8qIGhhbmRsZSB0aGUgbG9uZ2VyIG9uZXMgZmlyc3QgKi8sIFwiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgocm93KSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHJvdywgcmVzdDogcy5zbGljZShyb3cubGVuZ3RoKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaEhhbmQgPSAocykgPT4ge1xyXG4gICAgY29uc3QgaGFuZHMgPSBbXCLnjotcIiwgXCLnjaNcIiwgXCLlkIzoibLnjaNcIiwgXCLlnLDlv4NcIiwgXCLlkIzoibLlnLDlv4NcIiwgXCLppqzlvJPlhbVcIiwgXCLlkIzoibLppqzlvJPlhbVcIixcclxuICAgICAgICBcIuWKqeWPi1wiLCBcIuWQjOiJsuWKqeWPi1wiLCBcIuaIpumbhlwiLCBcIuWQjOiJsuaIpumbhlwiLCBcIuihjOihjFwiLCBcIuWQjOiJsuihjOihjFwiLCBcIuethuWFteeEoeWCvlwiLCBcIuWQjOiJsuethuWFteeEoeWCvlwiLFxyXG4gICAgICAgIFwi6ZeH5oim5LmL6ZuGXCIsIFwi5ZCM6Imy6ZeH5oim5LmL6ZuGXCIsIFwi54Sh5oqX6KGM5YemXCIsIFwi5ZCM6Imy54Sh5oqX6KGM5YemXCJdO1xyXG4gICAgZm9yIChjb25zdCBoYW5kIG9mIGhhbmRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChoYW5kKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGhhbmQsIHJlc3Q6IHMuc2xpY2UoaGFuZC5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hIYW5kID0gbXVuY2hIYW5kO1xyXG5leHBvcnRzLm11bmNoQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChjb2wsIHJvdykgPT4ge1xyXG4gICAgY29uc3QgY29vcmQgPSBbcm93LCBjb2xdO1xyXG4gICAgcmV0dXJuIGNvb3JkO1xyXG59LCBtdW5jaENvbHVtbiwgbXVuY2hSb3cpO1xyXG5leHBvcnRzLm11bmNoRnJvbUhvcFp1byA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKGNvbG9yLCBwcm9mLCBkZXN0KSA9PiAoeyBjb2xvciwgcHJvZiwgZGVzdCB9KSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uLCBleHBvcnRzLm11bmNoQ29vcmQpO1xyXG5leHBvcnRzLm11bmNoUGllY2VDYXB0dXJlQ29tbWVudCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMykoKF8sIGNvbG9yLCBwcm9mKSA9PiAoeyBjb2xvciwgcHJvZiB9KSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuaJi1wiKSwgbXVuY2hDb2xvciwgbXVuY2hQcm9mZXNzaW9uKTtcclxuZXhwb3J0cy5tdW5jaEJyYWNrZXRlZENvb3JkID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXzEsIGNvb3JkLCBfMikgPT4gY29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJbXCIpLCBleHBvcnRzLm11bmNoQ29vcmQsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCJdXCIpKTtcclxuY29uc3QgbXVuY2hEaWdpdExpbnprbGFyID0gKHMpID0+IHtcclxuICAgIGNvbnN0IGRzID0gW1wi54ShXCIsIFwi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCIsIFwi5Y2BXCIsIFwi5LiLXCIsIFwi55m+XCJdO1xyXG4gICAgZm9yIChjb25zdCBkIG9mIGRzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hQZWt6ZXBOdW1lcmFsID0gKHMpID0+IHtcclxuICAgIGNvbnN0IHQxID0gKDAsIG11bmNoX21vbmFkXzEubWFueTEpKG11bmNoRGlnaXRMaW56a2xhcikocyk7XHJcbiAgICBpZiAoIXQxKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHQxO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBudW0gPSAoMCwgcmVhZF9wZWt6ZXBfbnVtZXJhbHNfMS5mcm9tRGlnaXRzTGluemtsYXIpKGFucyk7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiBudW0sIHJlc3QgfTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMubXVuY2hQZWt6ZXBOdW1lcmFsID0gbXVuY2hQZWt6ZXBOdW1lcmFsO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmZyb21EaWdpdHNMaW56a2xhciA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyKGkpIHtcclxuICAgIGlmIChpWzBdID09PSBcIueEoVwiICYmIGkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLkuItcIikge1xyXG4gICAgICAgIHJldHVybiAtZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi55m+XCIpIHtcclxuICAgICAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDEwMCArIGZyb21EaWdpdHNMaW56a2xhcihpLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGluZGV4MTAwID0gaS5pbmRleE9mKFwi55m+XCIpO1xyXG4gICAgaWYgKGluZGV4MTAwICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGh1bmRyZWRzID0gaS5zbGljZSgwLCBpbmRleDEwMCk7XHJcbiAgICAgICAgY29uc3Qgb25lcyA9IGkuc2xpY2UoaW5kZXgxMDAgKyAxKTtcclxuICAgICAgICByZXR1cm4gMTAwICogZnJvbURpZ2l0c0xpbnprbGFyU3ViKGh1bmRyZWRzKSArIGZyb21EaWdpdHNMaW56a2xhclN1YihvbmVzKTtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKiBwYXJzZVVuaXQoaVswXSkgKyBwYXJzZVVuaXQoaVsyXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pO1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgXCIke2l9XCIgYXMgYSBwZWt6ZXAgbnVtZXJhbGApO1xyXG59XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gZnJvbURpZ2l0c0xpbnprbGFyO1xyXG5mdW5jdGlvbiBwYXJzZVVuaXQob25lcykge1xyXG4gICAgaWYgKG9uZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiAXCIpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6jFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDI7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIlcIikge1xyXG4gICAgICAgIHJldHVybiAzO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5ZubXCIpIHtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS6lFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlha1cIikge1xyXG4gICAgICAgIHJldHVybiA2O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LiDXCIpIHtcclxuICAgICAgICByZXR1cm4gNztcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIDg7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuZ1cIikge1xyXG4gICAgICAgIHJldHVybiA5O1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciBcIiR7b25lc31cIiB3aGlsZSB0cnlpbmcgdG8gcGFyc2UgcGVremVwIG51bWVyYWxzYCk7XHJcbn1cclxuZnVuY3Rpb24gZnJvbURpZ2l0c0xpbnprbGFyU3ViKGkpIHtcclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIGlmIChpWzBdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwICsgcGFyc2VVbml0KGlbMV0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaVtpLmxlbmd0aCAtIDFdID09PSBcIuWNgVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChpWzBdKSAqIDEwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYSA9IGlbMF07XHJcbiAgICAgICAgY29uc3QgYiA9IGlbMV07XHJcbiAgICAgICAgaWYgKGIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVW5pdChhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpICogMTAgKyBwYXJzZVVuaXQoYik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93IH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuaW1wb3J0IHsgTm9uVGFtUGllY2UsIFN0YXRlLCBIYW56aVByb2Zlc3Npb25BbmRUYW0sIHByb2ZzLCBCb2FyZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaGVpZ2h0ID0gMzg3O1xyXG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IHRvcF9tYXJnaW4gPSA0MDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3RW1wdHlCb2FyZCgpIHtcclxuICAgIGNvbnN0IGN0eCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN2XCIpISBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAvLyDnmoflh6ZcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyNywgNTQuNSUsIDgxLjElKVwiXHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuXHJcbiAgICAvLyDnmofmsLRcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyMTMsIDMzLjYlLCA3OC45JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICAvLyDnmoflsbFcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgxMjksIDM4LjUlLCA0NS40JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoOTksIDk5LCA5OSknO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDAuMDMgKiBoZWlnaHQgLyA5O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgMCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaGVpZ2h0LCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5mb250ID0gXCIyMHB4IHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigwLDAsMClcIjtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIiwgXCJBSVwiLCBcIkFVXCIsIFwiSUFcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCBsZWZ0X21hcmdpbiArIGhlaWdodCArIDEwLCB0b3BfbWFyZ2luICsgMzAgKyA0MyAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIDQzICogaSwgdG9wX21hcmdpbiAtIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgLWxlZnRfbWFyZ2luICsgMTAsIC0odG9wX21hcmdpbiArIDE1ICsgNDMgKiBpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIC0obGVmdF9tYXJnaW4gKyAyMCArIDQzICogaSksIC0odG9wX21hcmdpbiArIGhlaWdodCArIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3UGllY2VzT25Cb2FyZChib2FyZDogQm9hcmQsIGZvY3VzOiBbQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93XSB8IG51bGwpIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChjb25zdCBjbG0gaW4gYm9hcmQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNfZm9jdXNlZCA9IGZvY3VzID8gZm9jdXNbMF0gPT0gY2xtICYmIGZvY3VzWzFdID09IHJ3IDogZmFsc2U7XHJcbiAgICAgICAgICAgIGFucyArPSBwb3NpdGlvblBpZWNlT25Cb2FyZChcclxuICAgICAgICAgICAgICAgIGNsbSBhcyBBYnNvbHV0ZUNvbHVtbixcclxuICAgICAgICAgICAgICAgIHJ3IGFzIEFic29sdXRlUm93LFxyXG4gICAgICAgICAgICAgICAgYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSFbcncgYXMgQWJzb2x1dGVSb3ddISxcclxuICAgICAgICAgICAgICAgIGlzX2ZvY3VzZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IGFucztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEhvcDFadW8xSFRNTChwaWVjZXM6IE5vblRhbVBpZWNlW10pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XHJcbiAgICAgICAgYW5zICs9IGA8bGk+PGRpdiBzdHlsZT1cIndpZHRoOiAyM3B4OyBoZWlnaHQ6IDQzcHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0XCI+JHtyZW5kZXJOb3JtYWxQaWVjZShjb2xvciwgcHJvZiwgZmFsc2UpfTwvZGl2PjwvbGk+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3R2FtZVN0YXRlKFNUQVRFOiBTdGF0ZSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gZ2V0SG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRyYXdQaWVjZXNPbkJvYXJkKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck5vcm1hbFBpZWNlKGNvbG9yOiBcIum7klwiIHwgXCLotaRcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcclxuICAgIGNvbnN0IHkgPSBpc19ib2xkID8gMCA6IC0yNzc7XHJcbiAgICBjb25zdCBjb2xvcl9wYXRoID0ge1xyXG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXHJcbiAgICAgICAgXCLotaRcIjogXCLjgrTjgrfjg4Pjgq/pp5Jf6LWkXCIsXHJcbiAgICB9W2NvbG9yXTtcclxuICAgIHJldHVybiBgPGRpdlxyXG4gICAgc3R5bGU9XCJ3aWR0aDogODdweDsgaGVpZ2h0OiA4N3B4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6ICR7eH1weDsgYmFja2dyb3VuZC1wb3NpdGlvbi15OiAke3l9cHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgke2NvbG9yX3BhdGh9LnN2Zyk7IFwiPlxyXG48L2Rpdj5gXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwb3NpdGlvblBpZWNlT25Cb2FyZChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjbG1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W3J3XTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIDQzICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgNDMgKiAocm93IC0gMC41KTtcclxuICAgIGlmIChwaWVjZSA9PT0gXCLnmodcIikge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7XCJyb3RhdGUoOTBkZWcpXCJ9XCI+XHJcbiAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke3JlbmRlck5vcm1hbFBpZWNlKGNvbG9yLCBwcm9mLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCwgUGFyc2VkIH0gZnJvbSBcImNlcmtlX29ubGluZV9raWFha19wYXJzZXJcIjtcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKG86IHtcclxuXHRpYV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZ1xyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHR9LFxyXG59KTogU3RhdGUge1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWFzb246IFwi5pilXCIsXHJcblx0XHR0dXJuOiAwLFxyXG5cdFx0cmF0ZTogMSxcclxuXHRcdGZvY3VzOiBudWxsLFxyXG5cdFx0Ym9hcmQ6IHtcclxuXHRcdFx0Szoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRMOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdE46IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0VDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRaOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdE86IFwi55qHXCIsXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0WDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRDOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdE06IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0UDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0aWFfc2lkZToge1xyXG5cdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogby5pYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRob3AxenVvMTogW10sXHJcblx0XHRcdHBsYXllcl9uYW1lOiBvLmlhX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdHNjb3JlOiAyMCxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcblx0XHRcdGhvcDF6dW8xOiBbXSxcclxuXHRcdFx0c2NvcmU6IDIwLFxyXG5cdFx0fSxcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZTogUmVhZG9ubHk8U3RhdGU+LCBib2R5X2VsZW1lbnQ6IEJvZHlFbGVtZW50KTogU3RhdGUgfCBudWxsIHtcclxuXHRjb25zdCBuZXdfc3RhdGU6IFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjdXJyZW50X3N0YXRlKSk7XHJcblx0aWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInNlYXNvbl9lbmRzXCIpIHtcclxuXHRcdGlmIChjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLlhqxcIikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdG5ld19zdGF0ZS5zZWFzb24gPVxyXG5cdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxyXG5cdFx0XHRcdGN1cnJlbnRfc3RhdGUuc2Vhc29uID09PSBcIuWkj1wiID8gXCLnp4tcIiA6XHJcblx0XHRcdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLnp4tcIiA/IFwi5YasXCIgOlxyXG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xyXG5cdFx0bmV3X3N0YXRlLnR1cm4gPSAwO1xyXG5cdFx0cmV0dXJuIG5ld19zdGF0ZTtcclxuXHR9XHJcblx0cmV0dXJuIG5ld19zdGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkOiBSZWFkb25seTxQYXJzZWQ+KTogU3RhdGVbXSB7XHJcblx0Y29uc3QgYW5zOiBTdGF0ZVtdID0gW107XHJcblx0bGV0IGN1cnJlbnRfc3RhdGUgPSBnZXRJbml0aWFsU3RhdGUoe1xyXG5cdFx0aWFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLlvLVcIiwgcGxheWVyX25hbWU6IFwi5by15LiJXCIgfSxcclxuXHRcdGFfc2lkZTogeyBwbGF5ZXJfbmFtZV9zaG9ydDogXCLmnY5cIiwgcGxheWVyX25hbWU6IFwi5p2O5ZubXCIgfVxyXG5cdH0pO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IG5leHRfc3RhdGUgPSBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0pO1xyXG5cdFx0aWYgKCFuZXh0X3N0YXRlKSBicmVhaztcclxuXHRcdGFucy5wdXNoKG5leHRfc3RhdGUpO1xyXG5cdFx0Y3VycmVudF9zdGF0ZSA9IG5leHRfc3RhdGU7XHJcblx0fVxyXG5cdHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROdGhTdGF0ZShuOiBudW1iZXIpOiBTdGF0ZSB7XHJcblx0aWYgKG4gPT0gMSkge1xyXG5cdFx0cmV0dXJuIGdldEluaXRpYWxTdGF0ZSh7XHJcblx0XHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogXCLnrYZcIixcclxuXHRcdFx0XHRwbGF5ZXJfbmFtZTogXCLnrYbloqjpoqhcIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhX3NpZGU6IHtcclxuXHRcdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogXCLmmJ9cIixcclxuXHRcdFx0XHRwbGF5ZXJfbmFtZTogXCLmmJ/kuqvpnZJcIixcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlYXNvbjogXCLnp4tcIixcclxuXHRcdHR1cm46IG4sXHJcblx0XHRyYXRlOiA0LFxyXG5cdFx0Zm9jdXM6IFtcIlBcIiwgXCJPXCJdLFxyXG5cdFx0Ym9hcmQ6IHtcclxuXHRcdFx0Qzoge1xyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0VTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRZOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0Szoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcblx0XHRcdH0sXHJcblx0XHRcdEw6IHtcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdFU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH1cclxuXHRcdFx0fSxcclxuXHRcdFx0TToge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdE86IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9XHJcblx0XHRcdH0sXHJcblx0XHRcdE46IHtcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0WTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH1cclxuXHRcdFx0fSxcclxuXHRcdFx0UDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0VTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRPOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0VDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH1cclxuXHRcdFx0fSxcclxuXHRcdFx0WDoge1xyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRaOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdE86IFwi55qHXCIsXHJcblx0XHRcdFx0VTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRZOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfVxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IFwi562GXCIsXHJcblx0XHRcdGhvcDF6dW8xOiBbeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH1dLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogXCLnrYbloqjpoqhcIixcclxuXHRcdFx0c2NvcmU6IDI4LFxyXG5cdFx0fSxcclxuXHRcdGFfc2lkZToge1xyXG5cdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogXCLmmJ9cIixcclxuXHRcdFx0cGxheWVyX25hbWU6IFwi5pif5Lqr6Z2SXCIsXHJcblx0XHRcdGhvcDF6dW8xOiBbeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSwgeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfV0sXHJcblx0XHRcdHNjb3JlOiAxMixcclxuXHRcdH0sXHJcblxyXG5cdH07XHJcblxyXG59IiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93IH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbiA9IFwi6Ii5XCIgfCBcIueEoVwiIHwgXCLlhbVcIiB8IFwi5byTXCIgfCBcIui7ilwiIHwgXCLomY5cIiB8IFwi6aasXCIgfCBcIuethlwiIHwgXCLlt6tcIiB8IFwi5bCGXCIgfCBcIueOi1wiO1xyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb25BbmRUYW0gPSBIYW56aVByb2Zlc3Npb24gfCBcIueah1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHByb2ZzOiBIYW56aVByb2Zlc3Npb25BbmRUYW1bXSA9IFtcclxuXHRcIuiIuVwiLCBcIueEoVwiLCBcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIueah1wiXHJcbl07XHJcblxyXG5leHBvcnQgdHlwZSBCb2FyZCA9IHsgW2tleSBpbiBBYnNvbHV0ZUNvbHVtbl0/OiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0gfTtcclxuXHJcbmV4cG9ydCB0eXBlIEhhbnppU2Vhc29uID0gXCLmmKVcIiB8IFwi5aSPXCIgfCBcIueni1wiIHwgXCLlhqxcIjtcclxuZXhwb3J0IHR5cGUgUmF0ZSA9IDEgfCAyIHwgNCB8IDggfCAxNiB8IDMyIHwgNjQ7XHJcblxyXG5leHBvcnQgdHlwZSBTdGF0ZSA9IHtcclxuXHRzZWFzb246IEhhbnppU2Vhc29uLFxyXG5cdHR1cm46IG51bWJlcixcclxuXHRyYXRlOiBSYXRlLFxyXG5cdGZvY3VzOiBbQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93XSB8IG51bGwsXHJcblx0Ym9hcmQ6IEJvYXJkLFxyXG5cdGlhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogTm9uVGFtUGllY2VbXSxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiBOb25UYW1QaWVjZVtdLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5vblRhbVBpZWNlID0geyBjb2xvcjogXCLotaRcIiB8IFwi6buSXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IGJvb2xlYW4gfTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEJvZHlFbGVtZW50LCBwYXJzZUNlcmtlT25saW5lS2lhMUFrMSwgUGFyc2VkIH0gZnJvbSAnY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlcic7XHJcbmltcG9ydCB7IGRyYXdFbXB0eUJvYXJkLCBkcmF3R2FtZVN0YXRlIH0gZnJvbSAnLi9kcmF3JztcclxuaW1wb3J0IHsgZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZCwgZ2V0TnRoU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FzZTEgPVxyXG5cdGB75LiA5L2N6ImyOum7kum7kum7kn1cclxue+Wni+aZgjoyMDIyLTA1LTMxVDE3OjE2OjAyLjQzM1p9XHJcbnvntYLmmYI6MjAyMi0wNS0zMVQxODoxMzo1Mi4zNTdafVxyXG5NQVXlvJNNQUlNWeapi+S6lCAgICBQReW3q1BJUFXnhKHmkoPoo4FcclxuQ0FJ5YW1Q0FV54Sh5pKD6KOBICAgIE1F5byTQ0XnhKHmkoPoo4FcclxuUEFV5berQ0FVQ0FJ54Sh5pKD6KOBICAgIFpB546LWkXnhKHmkoPoo4FcclxuTVnlvJNNSU1B5qmL5LiA5q2k54ShICAgIENJ5YW1TUlNVeeEoeaSg+ijgVxyXG5DQUnlt6tDQU1B5qmL5LiA5omL6LWk6aasICAgIFBB562GTUHnhKHmkoPoo4HmiYvotaTlt6tcclxuTEFV5byTTEFJTFnmqYvkuIkgICAgVEXomY5OSVRV5qmL5LiAXHJcbkxZ5byTTElMReapi+S4ieaJi+i1pOW8kyAgICBLQeethktFTEXnhKHmkoPoo4HmiYvpu5LlvJNcclxuTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuWFtVxyXG5cclxu5oiW54K66aas5byT5YW16ICM5omL5LqUXHJcbue1guWtoyAgICDmmKXntYJcclxuXHJcbk1BVeW8k01BSU1Z5qmL5LiJICAgIFhF6JmOWklYVeeEoeaSg+ijgVxyXG5YQUnlhbVYWeeEoeaSg+ijgSAgICBYVeiZjk1Z54Sh5pKD6KOB5omL6LWk5byTXHJcblhBVeiZjkNBSU1Z5qmL5Zub5omL6buS6JmOICAgIE1F5byTTUlNVeapi+S4iVxyXG5LQVXlt6tLQUlLWeeEoeaSg+ijgSAgICBaT+eah1tUVV1aSVpFXHJcblBBVeW3q1pBVeeEoeaSg+ijgSAgICBDSeWFtUNF54Sh5pKD6KOBXHJcblpBSeiIuVpJ54Sh5pKD6KOB5omL6LWk6Ii5ICAgIFRF6JmOWknmsLTkuozmraTnhKFcclxuWkXnmodUSVtOVV1MTyAgICBYQeWwhlpF54Sh5pKD6KOBXHJcblpJ6Ii5WkVaQeapi+Wbm+aJi+i1pOeOi1xyXG5cclxu5oiW54K6546L5Yqg542j6ICM5omL5YWrXHJcbue1guWtoyAgICDlpI/ntYJcclxuXHJcbk1BVeW8k01BSU1Z5qmL5LqMICAgIE1F5byTTUlNVeapi+S4iVxyXG5DQUnlhbVDQVXnhKHmkoPoo4EgICAgWEXomY5aSVhV54Sh5pKD6KOBXHJcbk1Z5byTTVXnhKHmkoPoo4HmiYvpu5LlvJMgICAgTUnlhbVNVeeEoeaSg+ijgeaJi+i1pOW8k1xyXG5QQVXlt6tDQVVDQUnnhKHmkoPoo4EgICAgWkHnjotaReeEoeaSg+ijgVxyXG5DQUnlt6tDQVhB5qmL5LiJ5omL6LWk5bCGICAgIFpF546LWEHnhKHmkoPoo4HmiYvotaTlt6tcclxuUElB562GUEFJUFnmqYvkuIAgICAgUEXlt6taReeEoeaSg+ijgVxyXG5QWeethlBJUEHmqYvkuozmiYvotaTnrYYgICAgQ0Hou4pQQeeEoeaSg+ijgeaJi+m7kuethlxyXG5MQVXlvJNMQUlMWeapi+S4gCAgICBMReW8k0xJTFXmqYvlm5tcclxuTFnlvJNMVeeEoeaSg+ijgeaJi+i1pOW8kyAgICBMSeWFtUxV54Sh5pKD6KOB5omL6buS5byTXHJcbum7kuW8k0NZICAgIOm7kuW8k0NVXHJcbkNZ5byTQ1XnhKHmkoPoo4HmiYvpu5LlvJMgICAgQ0nlhbVDVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG7pu5LlvJNNSSAgICBYQeeOi0NF54Sh5pKD6KOBXHJcbk1J5byTTUHnhKHmkoPoo4HmiYvotaTppqwgICAgQ0XnjotNQeeEoeaSg+ijgeaJi+m7kuW8k1xyXG5UQVXomY5aQUlUWeeEoeaSg+ijgSAgICBOSeWFtU5P5rC05LiJXHJcblRZ6JmOTk9MVeeEoeaSg+ijgeaJi+i1pOWFtVxyXG5cclxu5oiW54K65ZCM6Imy6aas5byT5YW16ICM5omL5LiDXHJcbue1guWtoyAgICDnp4vntYJcclxuXHJcblxyXG7mmJ/kuIDlkahgO1xyXG5cclxuICAgIGNvbnN0IHBhcnNlZDogUGFyc2VkID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEoY2FzZTEpO1xyXG4gICAgY29uc3Qgc3RhdGVzOiBTdGF0ZVtdID0gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQpO1xyXG5cclxuICAgIGRyYXdFbXB0eUJvYXJkKCk7XHJcbiAgICBjb25zdCB0dXJuX3NsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybl9zbGlkZXJcIikhIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0dXJuX3NsaWRlci5taW4gPSBcIjBcIjtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke3N0YXRlcy5sZW5ndGggLSAxfWA7XHJcbiAgICB0dXJuX3NsaWRlci52YWx1ZSA9IFwiMFwiO1xyXG4gICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbMF0pO1xyXG4gICAgdHVybl9zbGlkZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1tOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpXSk7XHJcbiAgICB9XHJcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
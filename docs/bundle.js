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
exports.drawGameState = exports.drawPiecesOnBoard = exports.drawFocusSrc = exports.drawFocusStepped = exports.drawEmptyBoard = exports.cell_size = exports.top_margin = exports.left_margin = exports.height = void 0;
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
function drawFocusStepped(focus_stepped) {
    if (!focus_stepped)
        return;
    var circle_radius = 18;
    var _a = get_top_left(focus_stepped), top = _a.top, left = _a.left;
    document.getElementById("pieces_inner").innerHTML += "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(255, 255, 0, 0.3)\n    \"></div>");
}
exports.drawFocusStepped = drawFocusStepped;
function drawFocusSrc(focus_src) {
    if (!focus_src)
        return;
    var circle_radius = 18;
    var _a = get_top_left(focus_src), top = _a.top, left = _a.left;
    document.getElementById("pieces_inner").innerHTML += "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 50%; \n        background-color: rgba(0, 0, 0, 0.3)\n    \"></div>");
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
    document.getElementById("pieces_inner").innerHTML = ans;
}
exports.drawPiecesOnBoard = drawPiecesOnBoard;
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
    drawPiecesOnBoard(STATE.board, STATE.focus);
    drawFocusStepped(STATE.focus_stepped);
    drawFocusSrc(STATE.focus_src);
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
function getNextState(current_state, body_element) {
    var new_state = JSON.parse(JSON.stringify(current_state));
    new_state.ia_side.is_newly_acquired = false;
    new_state.a_side.is_newly_acquired = false;
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
    else if (body_element.type === "normal_move") {
        if (body_element.movement.type === "NonTamMove") {
            if (body_element.movement.data.type === "SrcDst") {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = body_element.movement.data.dest;
                new_state.focus_stepped = null;
                new_state.focus_src = body_element.movement.data.src;
                new_state.turn++;
            }
            else if (body_element.movement.data.type === "SrcStepDstFinite") {
                var piece = remove_from(new_state, body_element.movement.data.src);
                var maybe_captured_piece = set_to(new_state, body_element.movement.data.dest, piece);
                if (maybe_captured_piece) {
                    set_hop1zuo1(new_state, maybe_captured_piece);
                }
                new_state.focus = body_element.movement.data.dest;
                new_state.focus_stepped = body_element.movement.data.step;
                new_state.focus_src = body_element.movement.data.src;
                new_state.turn++;
            }
            else if (body_element.movement.data.type === "FromHand") {
            }
            else {
                var _ = body_element.movement.data;
                throw new Error("Should not reach here: invalid value in body_element.movement.data.type");
            }
        }
        else if (body_element.movement.type === "TamMove") {
        }
        else {
            var _ = body_element.movement;
            throw new Error("Should not reach here: invalid value in body_element.movement.type");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCx5QkFBeUIsR0FBRyxnQ0FBZ0MsR0FBRyx1QkFBdUIsR0FBRyx1QkFBdUIsR0FBRyxrQkFBa0IsR0FBRyxxQkFBcUI7QUFDN0osbUJBQW1CLG1CQUFPLENBQUMsNkVBQVk7QUFDdkMsc0JBQXNCLG1CQUFPLENBQUMsbUZBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLGlCQUFpQjtBQUM3QjtBQUNBLCtEQUErRCxFQUFFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRkFBK0YsaUJBQWlCO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8saUJBQWlCLGdCQUFnQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxFQUFFO0FBQzNFO0FBQ0Esb0JBQW9CLCtCQUErQjtBQUNuRDtBQUNBLDREQUE0RCxNQUFNLHFCQUFxQixFQUFFO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0ZBQW9GLDZCQUE2QjtBQUNqSDtBQUNBLHFFQUFxRSxFQUFFO0FBQ3ZFO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTyw2QkFBNkIsZ0JBQWdCO0FBQ3BFO0FBQ0Esd0RBQXdELEtBQUsscUJBQXFCLEVBQUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsOERBQThEO0FBQ25IO0FBQ0E7QUFDQSxpRUFBaUUsRUFBRTtBQUNuRTtBQUNBLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0EsWUFBWSwwQkFBMEI7QUFDdEM7QUFDQSxvREFBb0QsS0FBSyxxQkFBcUIsRUFBRTtBQUNoRjtBQUNBLGFBQWE7QUFDYjtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCLGlCQUFpQixPQUFPLHdCQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELHdEQUF3RDtBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQ0FBc0M7QUFDMUQscUJBQXFCLE9BQU8sbUNBQW1DO0FBQy9EO0FBQ0E7QUFDQSxxQkFBcUIsT0FBTyw2Q0FBNkM7QUFDekU7QUFDQTtBQUNBLHFCQUFxQixPQUFPLDRDQUE0QztBQUN4RTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsRUFBRTtBQUN2RDtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxFQUFFO0FBQzlEO0FBQ0EsWUFBWSx5QkFBeUI7QUFDckM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtDQUFrQztBQUNsRDtBQUNBLG9EQUFvRCxFQUFFLHNCQUFzQixNQUFNO0FBQ2xGO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSw0REFBNEQsRUFBRTtBQUM5RDtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPLG1CQUFtQixTQUFTO0FBQ25EO0FBQ0Esd0RBQXdELEtBQUsscUJBQXFCLEVBQUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEVBQUU7QUFDbkU7QUFDQSxZQUFZLGlCQUFpQjtBQUM3QjtBQUNBLHVFQUF1RSxFQUFFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixFQUFFO0FBQ2xGO0FBQ0EsWUFBWSxpQ0FBaUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnQ0FBZ0M7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOzs7Ozs7Ozs7OztBQ3hRWjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCwrQkFBK0I7QUFDL0IsOEJBQThCLG1CQUFPLENBQUMsbUdBQXVCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDhCQUE4QjtBQUM5QjtBQUNBLGtCQUFrQjtBQUNsQiw4QkFBOEI7QUFDOUI7QUFDQSxvREFBb0QsYUFBYTtBQUNqRSw4Q0FBOEMsT0FBTyxLQUFLO0FBQzFELDRDQUE0QyxPQUFPLEtBQUs7QUFDeEQ7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLCtCQUErQjs7Ozs7Ozs7Ozs7QUN4QmxCO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWMsR0FBRyxhQUFhLEdBQUcsWUFBWSxHQUFHLGNBQWMsR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHLFlBQVksR0FBRyxZQUFZO0FBQzlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGVBQWU7QUFDM0I7QUFDQSxDQUFDO0FBQ0QsWUFBWTtBQUNaLGtDQUFrQyxxQkFBcUI7QUFDdkQsWUFBWTtBQUNaO0FBQ0EsY0FBYztBQUNkLG1FQUFtRSxtREFBbUQ7QUFDdEgsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxlQUFlO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2Isa0JBQWtCLFlBQVk7QUFDOUIsY0FBYzs7Ozs7Ozs7Ozs7QUNsREQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsMEJBQTBCLEdBQUcsMkJBQTJCLEdBQUcsZ0NBQWdDLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLEdBQUcsaUJBQWlCO0FBQzlKLHNCQUFzQixtQkFBTyxDQUFDLG1GQUFlO0FBQzdDLCtCQUErQixtQkFBTyxDQUFDLHFHQUF3QjtBQUMvRDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsQ0FBQztBQUNELHVCQUF1Qix1REFBdUQsbUJBQW1CO0FBQ2pHLGdDQUFnQyxvREFBb0QsYUFBYTtBQUNqRywyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksWUFBWTtBQUN4QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7Ozs7Ozs7Ozs7O0FDMUdiO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxFQUFFO0FBQ3ZDO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLEtBQUs7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2xGQSxtRUFBa0Y7QUFFckUsY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGtCQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLGlCQUFTLEdBQUcsRUFBRSxDQUFDO0FBRTVCLFNBQWdCLGNBQWM7SUFDMUIsSUFBTSxHQUFHLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRXBGLEtBQUs7SUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7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R0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsR0FBRztZQUNOLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7U0FDOUM7UUFDRCxDQUFDLEVBQUU7WUFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUM5QztRQUNELENBQUMsRUFBRTtZQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQzlDO1FBQ0QsQ0FBQyxFQUFFO1lBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFB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YSxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLFdBQVcsQ0FBQyxPQUFPLEdBQUc7UUFDbEIsd0JBQWEsRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9oYW5kbGVfYm9keV9lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NlcmtlX29ubGluZV9raWFha19wYXJzZXIvZGlzdC9tdW5jaF9tb25hZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2Vya2Vfb25saW5lX2tpYWFrX3BhcnNlci9kaXN0L211bmNoZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyL2Rpc3QvcmVhZF9wZWt6ZXBfbnVtZXJhbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBleHBvcnRzLmhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyA9IGV4cG9ydHMubXVuY2hDaXVybEV2ZW50ID0gZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQgPSBleHBvcnRzLmhhbmRsZVlha3UgPSBleHBvcnRzLmhhbmRsZVRhbU1vdmUgPSB2b2lkIDA7XHJcbmNvbnN0IG11bmNoZXJzXzEgPSByZXF1aXJlKFwiLi9tdW5jaGVyc1wiKTtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5mdW5jdGlvbiBoYW5kbGVUYW1Nb3ZlKHMpIHtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmIChyZXN0LmNoYXJBdCgwKSAhPT0gXCLnmodcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgdGFtMiB3aGlsZSByZWFkaW5nIFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIC8vIHRoZSBmb3JtYXQgaXMgZWl0aGVyOlxyXG4gICAgLy8gLSBaVeeah1tUT11UVVxyXG4gICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAvLyAtIFRZ55qHVEFJW1RBVV1aQVVcclxuICAgIGNvbnN0IHRyeV9tdW5jaF9icmFja2V0X2FuZF9ub25icmFja2V0ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0yKSgoZmlyc3REZXN0LCBuZXh0KSA9PiAoeyBmaXJzdERlc3QsIG5leHQgfSksIG11bmNoZXJzXzEubXVuY2hCcmFja2V0ZWRDb29yZCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0LnNsaWNlKDEpKTtcclxuICAgIGlmICh0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldCkge1xyXG4gICAgICAgIC8vIGVpdGhlcjpcclxuICAgICAgICAvLyAtIFpV55qHW1RPXVRVXHJcbiAgICAgICAgLy8gLSBaT+eah1taVV1aSVpFXHJcbiAgICAgICAgY29uc3QgeyBhbnM6IHsgZmlyc3REZXN0LCBuZXh0IH0sIHJlc3Q6IHJlc3QyIH0gPSB0cnlfbXVuY2hfYnJhY2tldF9hbmRfbm9uYnJhY2tldDtcclxuICAgICAgICBpZiAocmVzdDIgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVGFtTW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBTdHlsZTogXCJOb1N0ZXBcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdDogbmV4dFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdHJ5X211bmNoX2Nvb3JkID0gKDAsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdDIpO1xyXG4gICAgICAgICAgICBpZiAoIXRyeV9tdW5jaF9jb29yZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgeyBhbnM6IHNlY29uZERlc3QsIHJlc3Q6IGVtcHR5IH0gPSB0cnlfbXVuY2hfY29vcmQ7XHJcbiAgICAgICAgICAgIGlmIChlbXB0eSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHRyYWlsaW5nIFxcYCR7ZW1wdHl9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgbW92ZW1lbnQ6IHsgdHlwZTogXCJUYW1Nb3ZlXCIsIHN0ZXBTdHlsZTogXCJTdGVwc0R1cmluZ0xhdHRlclwiLCBzcmMsIGZpcnN0RGVzdCwgc3RlcDogbmV4dCwgc2Vjb25kRGVzdCB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gLSBUWeeah1RBSVtUQVVdWkFVXHJcbiAgICAgICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChzdGVwLCBmaXJzdERlc3QsIHNlY29uZERlc3QpID0+ICh7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9KSwgbXVuY2hlcnNfMS5tdW5jaENvb3JkLCBtdW5jaGVyc18xLm11bmNoQnJhY2tldGVkQ29vcmQsIG11bmNoZXJzXzEubXVuY2hDb29yZCkocmVzdC5zbGljZSgxKSk7XHJcbiAgICAgICAgaWYgKCFtdW5jaCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IHN0ZXAsIGZpcnN0RGVzdCwgc2Vjb25kRGVzdCB9LCByZXN0OiBlbXB0eSB9ID0gbXVuY2g7XHJcbiAgICAgICAgaWYgKGVtcHR5ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub3JtYWxfbW92ZVwiLFxyXG4gICAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJUYW1Nb3ZlXCIsXHJcbiAgICAgICAgICAgICAgICBzdGVwU3R5bGU6IFwiU3RlcHNEdXJpbmdGb3JtZXJcIixcclxuICAgICAgICAgICAgICAgIHNyYywgc3RlcCwgZmlyc3REZXN0LCBzZWNvbmREZXN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVGFtTW92ZSA9IGhhbmRsZVRhbU1vdmU7XHJcbmZ1bmN0aW9uIGhhbmRsZVlha3Uocykge1xyXG4gICAgLy8g5oiW54K6546L5Yqg542jXHJcbiAgICAvLyDmiJbngrrnjovliqDnjaPogIzmiYvlhatcclxuICAgIGNvbnN0IGhhbmRzU2VwQnlBdCA9ICgwLCBtdW5jaF9tb25hZF8xLnNlcEJ5MSkoeyBwOiBtdW5jaGVyc18xLm11bmNoSGFuZCwgc2VwOiAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5YqgXCIpIH0pO1xyXG4gICAgY29uc3QgbXVuY2ggPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBoYW5kcykgPT4gaGFuZHMsICgwLCBtdW5jaF9tb25hZF8xLnN0cmluZykoXCLmiJbngrpcIiksIGhhbmRzU2VwQnlBdCkocyk7XHJcbiAgICBpZiAoIW11bmNoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIEJvZHlFbGVtZW50IGVuY291bnRlcmVkOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogaGFuZHMsIHJlc3QgfSA9IG11bmNoO1xyXG4gICAgaWYgKHJlc3QgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiBcInR5bW9rXCIsIGhhbmRzIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBtdW5jaDIgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTIpKChfLCBudW0pID0+IG51bSwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIuiAjOaJi1wiKSwgbXVuY2hlcnNfMS5tdW5jaFBla3plcE51bWVyYWwpKHJlc3QpO1xyXG4gICAgaWYgKCFtdW5jaDIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQm9keUVsZW1lbnQgZW5jb3VudGVyZWQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgYW5zOiBzY29yZSwgcmVzdDogcmVzdDIgfSA9IG11bmNoMjtcclxuICAgIGlmIChyZXN0MiAhPT0gXCJcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhbmRsZSB0cmFpbGluZyBcXGAke3Jlc3R9XFxgIGZvdW5kIHdpdGhpbiAgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgdHlwZTogXCJ0YXhvdFwiLCBoYW5kcywgc2NvcmUgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZVlha3UgPSBoYW5kbGVZYWt1O1xyXG5jb25zdCBtdW5jaFdhdGVyRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIuawtFwiKSkge1xyXG4gICAgICAgIGNvbnN0IHQgPSBzLnNsaWNlKDEpO1xyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLnhKHmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIDmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAxLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuozmraTnhKFcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAyLCByZXN0OiB0LnNsaWNlKDMpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkuIlcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLlm5tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA0LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0LnN0YXJ0c1dpdGgoXCLkupRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYW5zOiA1LCByZXN0OiB0LnNsaWNlKDEpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmV4cG9ydHMubXVuY2hXYXRlckV2ZW50ID0gbXVuY2hXYXRlckV2ZW50O1xyXG5jb25zdCBtdW5jaENpdXJsRXZlbnQgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuc3RhcnRzV2l0aChcIueEoeaSg+ijgVwiKSkge1xyXG4gICAgICAgIHJldHVybiB7IGFuczoge30sIHJlc3Q6IHMuc2xpY2UoMykgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF93YXRlciA9ICgwLCBleHBvcnRzLm11bmNoV2F0ZXJFdmVudCkocyk7XHJcbiAgICBpZiAodHJ5X211bmNoX3dhdGVyKSB7XHJcbiAgICAgICAgY29uc3QgeyBhbnMsIHJlc3QgfSA9IHRyeV9tdW5jaF93YXRlcjtcclxuICAgICAgICByZXR1cm4geyBhbnM6IHsgd2F0ZXJfZW50cnlfY2l1cmw6IGFucyB9LCByZXN0IH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5zdGFydHNXaXRoKFwi5qmLXCIpKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHMuc2xpY2UoMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcHBpbmdfY2l1cmwgPSB0WzBdID09PSBcIueEoVwiID8gMCA6XHJcbiAgICAgICAgICAgIHRbMF0gPT09IFwi5LiAXCIgPyAxIDpcclxuICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqMXCIgPyAyIDpcclxuICAgICAgICAgICAgICAgICAgICB0WzBdID09PSBcIuS4iVwiID8gMyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5ZubXCIgPyA0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRbMF0gPT09IFwi5LqUXCIgPyA1IDogKCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBjaGFyYWN0ZXIgZm91bmQgYWZ0ZXIg5qmLXCIpOyB9KTtcclxuICAgICAgICBjb25zdCByZXN0ID0gdC5zbGljZSgxKTtcclxuICAgICAgICAvLyBFaXRoZXIgbm90aGluZywg5q2k54ShLCBvciBtdW5jaFdhdGVyRXZlbnRcclxuICAgICAgICBjb25zdCB0cnlfbXVuY2hfd2F0ZXIgPSAoMCwgZXhwb3J0cy5tdW5jaFdhdGVyRXZlbnQpKHJlc3QpO1xyXG4gICAgICAgIGlmICh0cnlfbXVuY2hfd2F0ZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBhbnM6IHdhdGVyX2VudHJ5X2NpdXJsLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoX3dhdGVyO1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgc3RlcHBpbmdfY2l1cmwsIHdhdGVyX2VudHJ5X2NpdXJsIH0sIHJlc3Q6IHJlc3QyIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlc3Quc3RhcnRzV2l0aChcIuatpOeEoVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiBmYWxzZSB9LCByZXN0OiBcIlwiIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IHsgc3RlcHBpbmdfY2l1cmwsIGluZmFmdGVyc3RlcF9zdWNjZXNzOiB0cnVlIH0sIHJlc3QgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgQ2l1cmwgZXZlbnQ6IFxcYCR7c31cXGBgKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQgPSBtdW5jaENpdXJsRXZlbnQ7XHJcbmZ1bmN0aW9uIGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhzKSB7XHJcbiAgICBjb25zdCB0cnlfY2l1cmxfZXZlbnQgPSAoMCwgZXhwb3J0cy5tdW5jaENpdXJsRXZlbnQpKHMpO1xyXG4gICAgaWYgKCF0cnlfY2l1cmxfZXZlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucGFyc2FibGUgdHJhaWxpbmcgcGFyYW1ldGVyOiBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogY2l1cmxfZXZlbnQsIHJlc3QgfSA9IHRyeV9jaXVybF9ldmVudDtcclxuICAgIGlmIChyZXN0ID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY2l1cmxfZXZlbnQgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaFBpZWNlQ2FwdHVyZUNvbW1lbnQpKHJlc3QpO1xyXG4gICAgaWYgKG9wdGlvbmFsX3BpZWNlX2NhcHR1cmUpIHtcclxuICAgICAgICBjb25zdCB7IGFuczogcGllY2VfY2FwdHVyZSwgcmVzdDogcmVzdDIgfSA9IG9wdGlvbmFsX3BpZWNlX2NhcHR1cmU7XHJcbiAgICAgICAgaWYgKHJlc3QyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJhaWxpbmcgcGFyYW1ldGVyIFxcYCR7c31cXGAgaGFzIHNvbWUgZXh0cmEgXFxgJHtyZXN0Mn1cXGAgYXQgdGhlIGVuZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBjaXVybF9ldmVudCwgcGllY2VfY2FwdHVyZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnBhcnNhYmxlIHRyYWlsaW5nIHBhcmFtZXRlcjogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzID0gaGFuZGxlVHJhaWxpbmdQYXJhbWV0ZXJzO1xyXG5mdW5jdGlvbiBoYW5kbGVCb2R5RWxlbWVudChzKSB7XHJcbiAgICBpZiAocyA9PT0gXCLmmKXntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi5aSP57WCXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJzZWFzb25fZW5kc1wiLCBzZWFzb246IDEgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIueni+e1glwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwic2Vhc29uX2VuZHNcIiwgc2Vhc29uOiAyIH07XHJcbiAgICB9XHJcbiAgICBpZiAocyA9PT0gXCLlhqzntYJcIikge1xyXG4gICAgICAgIHJldHVybiB7IFwidHlwZVwiOiBcInNlYXNvbl9lbmRzXCIsIHNlYXNvbjogMyB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMgPT09IFwi57WC5a2jXCIpIHtcclxuICAgICAgICByZXR1cm4geyBcInR5cGVcIjogXCJlbmRfc2Vhc29uXCIgfTtcclxuICAgIH1cclxuICAgIGlmIChzID09PSBcIuaYn+S4gOWRqFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgXCJ0eXBlXCI6IFwiZ2FtZV9zZXRcIiB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuaW5jbHVkZXMoXCLngrpcIikpIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlWWFrdShzKTtcclxuICAgIH1cclxuICAgIGlmIChzLmluY2x1ZGVzKFwi55qHXCIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZVRhbU1vdmUocyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0cnlfbXVuY2hfZnJvbV9ob3B6dW8gPSAoMCwgbXVuY2hlcnNfMS5tdW5jaEZyb21Ib3BadW8pKHMpO1xyXG4gICAgaWYgKHRyeV9tdW5jaF9mcm9tX2hvcHp1bykge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB7IGNvbG9yLCBwcm9mLCBkZXN0IH0sIHJlc3QgfSA9IHRyeV9tdW5jaF9mcm9tX2hvcHp1bztcclxuICAgICAgICBpZiAocmVzdCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYW5kbGUgdHJhaWxpbmcgXFxgJHtyZXN0fVxcYCBmb3VuZCB3aXRoaW4gIFxcYCR7c31cXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJGcm9tSGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2YsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRyeV9tdW5jaF9zcmMgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShzKTtcclxuICAgIGlmICghdHJ5X211bmNoX3NyYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYXJzYWJsZSBCb2R5RWxlbWVudCBlbmNvdW50ZXJlZDogXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBhbnM6IHNyYywgcmVzdCB9ID0gdHJ5X211bmNoX3NyYztcclxuICAgIGlmICghW1wi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi6Ii5XCIsIFwi54mHXCJdLmluY2x1ZGVzKHJlc3QuY2hhckF0KDApKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGZpbmQgYSBwcm9mZXNzaW9uIHdoaWxlIHJlYWRpbmcgXFxgJHtzfVxcYGApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJ5X211bmNoXzJuZF9jb29yZCA9ICgwLCBtdW5jaGVyc18xLm11bmNoQ29vcmQpKHJlc3Quc2xpY2UoMSkpO1xyXG4gICAgaWYgKCF0cnlfbXVuY2hfMm5kX2Nvb3JkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gZmluZCB0aGUgc2Vjb25kIGNvb3JkaW5hdGUgd2hpbGUgcmVhZGluZyBcXGAke3N9XFxgYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB7IGFuczogc2Vjb25kX2Nvb3JkLCByZXN0OiByZXN0MiB9ID0gdHJ5X211bmNoXzJuZF9jb29yZDtcclxuICAgIGNvbnN0IHRyeV9tdW5jaF8zcmRfY29vcmQgPSAoMCwgbXVuY2hlcnNfMS5tdW5jaENvb3JkKShyZXN0Mik7XHJcbiAgICBpZiAoIXRyeV9tdW5jaF8zcmRfY29vcmQpIHtcclxuICAgICAgICBjb25zdCBjaXVybF9hbmRfY2FwdHVyZSA9IGhhbmRsZVRyYWlsaW5nUGFyYW1ldGVycyhyZXN0Mik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9ybWFsX21vdmVcIixcclxuICAgICAgICAgICAgbW92ZW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiTm9uVGFtTW92ZVwiLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTcmNEc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogc2Vjb25kX2Nvb3JkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNpdXJsX2FuZF9jYXB0dXJlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgYW5zOiB0aGlyZF9jb29yZCwgcmVzdDogcmVzdDMgfSA9IHRyeV9tdW5jaF8zcmRfY29vcmQ7XHJcbiAgICAgICAgY29uc3QgY2l1cmxfYW5kX2NhcHR1cmUgPSBoYW5kbGVUcmFpbGluZ1BhcmFtZXRlcnMocmVzdDMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vcm1hbF9tb3ZlXCIsXHJcbiAgICAgICAgICAgIG1vdmVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIk5vblRhbU1vdmVcIiwgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU3JjU3RlcERzdEZpbml0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBzZWNvbmRfY29vcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogdGhpcmRfY29vcmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgY2l1cmxfYW5kX2NhcHR1cmVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaGFuZGxlQm9keUVsZW1lbnQgPSBoYW5kbGVCb2R5RWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHZvaWQgMDtcclxuY29uc3QgaGFuZGxlX2JvZHlfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vaGFuZGxlX2JvZHlfZWxlbWVudFwiKTtcclxuLy8gVmVyeSBwcmltaXRpdmUgcGFyc2VyIHRoYXQgbmV2ZXIgaGFuZGxlcyBhbGwgdGhlIGVkZ2UgY2FzZXNcclxuZnVuY3Rpb24gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEocykge1xyXG4gICAgY29uc3QgbGluZXMgPSBzLnRyaW0oKS5zcGxpdChcIlxcblwiKS5tYXAobCA9PiBsLnRyaW0oKSk7XHJcbiAgICBjb25zdCBpbml0aWFsX2xpbmUgPSBsaW5lc1swXTtcclxuICAgIGlmIChpbml0aWFsX2xpbmUgPT09IHVuZGVmaW5lZCAvKiBTaW5jZSB3ZSB1c2VkIC5zcGxpdCgpLCB0aGlzIGFjdHVhbGx5IGNhbid0IGhhcHBlbiAqLyB8fCBpbml0aWFsX2xpbmUgPT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgYLjgorjgb7jgZvjgpNcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgvXlxce+Wni+aZgjovLnRlc3QoaW5pdGlhbF9saW5lKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjCB75aeL5pmCOiDjgaflp4vjgb7jgaPjgabjgYTjgb7jgZnjgILjgZPjgozjga8yMDIx5bm0MTHmnIjmnKvjgqLjg4Pjg5fjg4fjg7zjg4jku6XliY3jga7mo4vorZzjgafjgYLjgorjgIHjgb7jgaDlr77lv5zjgafjgY3jgabjgYTjgb7jgZvjgpPjgIJcIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghL15cXHvkuIDkvY3oibI6Ly50ZXN0KGluaXRpYWxfbGluZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYwge+S4gOS9jeiJsjog44Gn5aeL44G+44Gj44Gm44GE44G+44Gb44KT44CCXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRpbmdfcGxheWVycyA9IGluaXRpYWxfbGluZS5tYXRjaCgvXlxce+S4gOS9jeiJsjooW+m7kui1pF0rKVxcfSQvKT8uWzFdO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdfdGltZSA9IGxpbmVzWzFdPy5tYXRjaCgvXlxce+Wni+aZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBlbmRpbmdfdGltZSA9IGxpbmVzWzJdPy5tYXRjaCgvXlxce+e1guaZgjooW159XSspXFx9JC8pPy5bMV07XHJcbiAgICBjb25zdCBib2RpZXMgPSBsaW5lcy5zbGljZSgzKS5mbGF0TWFwKGxpbmUgPT4gbGluZS5zcGxpdCgvW1xcc1xcbl0vZykpLmZpbHRlcihhID0+IGEgIT09IFwiXCIpO1xyXG4gICAgY29uc3QgcGFyc2VkX2JvZGllcyA9IGJvZGllcy5tYXAoaGFuZGxlX2JvZHlfZWxlbWVudF8xLmhhbmRsZUJvZHlFbGVtZW50KTtcclxuICAgIHJldHVybiB7IHN0YXJ0aW5nX3BsYXllcnMsIHN0YXJ0aW5nX3RpbWUsIGVuZGluZ190aW1lLCBwYXJzZWRfYm9kaWVzIH07XHJcbn1cclxuZXhwb3J0cy5wYXJzZUNlcmtlT25saW5lS2lhMUFrMSA9IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnNlcEJ5MSA9IGV4cG9ydHMubWFueTEgPSBleHBvcnRzLm1hbnkgPSBleHBvcnRzLmxpZnRNMyA9IGV4cG9ydHMuc3RyaW5nID0gZXhwb3J0cy5saWZ0TTIgPSBleHBvcnRzLnB1cmUgPSBleHBvcnRzLmJpbmQgPSB2b2lkIDA7XHJcbi8vIG1vbmFkXHJcbmNvbnN0IGJpbmQgPSAobWEsIGNhbGxiYWNrKSA9PiAoKGlucHV0KSA9PiB7XHJcbiAgICBjb25zdCByZXMxID0gbWEoaW5wdXQpO1xyXG4gICAgaWYgKHJlczEgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIHJldHVybiBjYWxsYmFjayhhKShyZXN0KTtcclxufSk7XHJcbmV4cG9ydHMuYmluZCA9IGJpbmQ7XHJcbmNvbnN0IHB1cmUgPSAoYSkgPT4gKGlucHV0KSA9PiAoeyBhbnM6IGEsIHJlc3Q6IGlucHV0IH0pO1xyXG5leHBvcnRzLnB1cmUgPSBwdXJlO1xyXG5jb25zdCBsaWZ0TTIgPSAoZiwgbWEsIG1iKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIpKSkpO1xyXG5leHBvcnRzLmxpZnRNMiA9IGxpZnRNMjtcclxuY29uc3Qgc3RyaW5nID0gKHByZWZpeCkgPT4gKGlucHV0KSA9PiBpbnB1dC5zdGFydHNXaXRoKHByZWZpeCkgPyB7IGFuczogdW5kZWZpbmVkLCByZXN0OiBpbnB1dC5zbGljZShwcmVmaXgubGVuZ3RoKSB9IDogbnVsbDtcclxuZXhwb3J0cy5zdHJpbmcgPSBzdHJpbmc7XHJcbmNvbnN0IGxpZnRNMyA9IChmLCBtYSwgbWIsIG1jKSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYSwgYSA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYiwgYiA9PiAoMCwgZXhwb3J0cy5iaW5kKShtYywgYyA9PiAoMCwgZXhwb3J0cy5wdXJlKShmKGEsIGIsIGMpKSkpKTtcclxuZXhwb3J0cy5saWZ0TTMgPSBsaWZ0TTM7XHJcbmNvbnN0IG1hbnkgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgbGV0IHJlc3QgPSBpbnB1dDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55ID0gbWFueTtcclxuY29uc3QgbWFueTEgPSAobWEpID0+IGlucHV0ID0+IHtcclxuICAgIGNvbnN0IHJlczEgPSBtYShpbnB1dCk7XHJcbiAgICBpZiAocmVzMSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGxldCB7IGFuczogYSwgcmVzdCB9ID0gcmVzMTtcclxuICAgIGNvbnN0IGFucyA9IFthXTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzMSA9IG1hKHJlc3QpO1xyXG4gICAgICAgIGlmIChyZXMxID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4geyBhbnMsIHJlc3QgfTtcclxuICAgICAgICBjb25zdCB7IGFuczogYSwgcmVzdDogciB9ID0gcmVzMTtcclxuICAgICAgICBhbnMucHVzaChhKTtcclxuICAgICAgICByZXN0ID0gcjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tYW55MSA9IG1hbnkxO1xyXG5jb25zdCBzZXBCeTEgPSAoeyBwOiBtYSwgc2VwIH0pID0+ICgwLCBleHBvcnRzLmJpbmQpKG1hLCBhID0+ICgwLCBleHBvcnRzLmJpbmQpKCgwLCBleHBvcnRzLm1hbnkpKCgwLCBleHBvcnRzLmJpbmQpKHNlcCwgKF8pID0+IG1hKSksIGFzID0+ICgwLCBleHBvcnRzLnB1cmUpKFthLCAuLi5hc10pKSk7XHJcbmV4cG9ydHMuc2VwQnkxID0gc2VwQnkxO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLm11bmNoUGVremVwTnVtZXJhbCA9IGV4cG9ydHMubXVuY2hCcmFja2V0ZWRDb29yZCA9IGV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gZXhwb3J0cy5tdW5jaEZyb21Ib3BadW8gPSBleHBvcnRzLm11bmNoQ29vcmQgPSBleHBvcnRzLm11bmNoSGFuZCA9IHZvaWQgMDtcclxuY29uc3QgbXVuY2hfbW9uYWRfMSA9IHJlcXVpcmUoXCIuL211bmNoX21vbmFkXCIpO1xyXG5jb25zdCByZWFkX3Bla3plcF9udW1lcmFsc18xID0gcmVxdWlyZShcIi4vcmVhZF9wZWt6ZXBfbnVtZXJhbHNcIik7XHJcbmNvbnN0IG11bmNoQ29sb3IgPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui1pFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFByb2Zlc3Npb24gPSAocykgPT4ge1xyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuiIuVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAwLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5YW1XCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDEsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlvJNcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogMiwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIui7ilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiAzLCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi6JmOXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDQsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLppqxcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogNSwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIuethlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA2LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICBpZiAocy5jaGFyQXQoMCkgPT09IFwi5berXCIpIHtcclxuICAgICAgICByZXR1cm4geyBhbnM6IDcsIHJlc3Q6IHMuc2xpY2UoMSkgfTtcclxuICAgIH1cclxuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gXCLlsIZcIikge1xyXG4gICAgICAgIHJldHVybiB7IGFuczogOCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgfVxyXG4gICAgaWYgKHMuY2hhckF0KDApID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgYW5zOiA5LCByZXN0OiBzLnNsaWNlKDEpIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuY29uc3QgbXVuY2hDb2x1bW4gPSAocykgPT4ge1xyXG4gICAgY29uc3QgY29scyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICBpZiAocy5jaGFyQXQoMCkgPT09IGNvbCkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBhbnM6IGNvbCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFJvdyA9IChzKSA9PiB7XHJcbiAgICBjb25zdCByb3dzID0gW1wiQUlcIiwgXCJBVVwiLCBcIklBXCIgLyogaGFuZGxlIHRoZSBsb25nZXIgb25lcyBmaXJzdCAqLywgXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChyb3cpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogcm93LCByZXN0OiBzLnNsaWNlKHJvdy5sZW5ndGgpIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbmNvbnN0IG11bmNoSGFuZCA9IChzKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kcyA9IFtcIueOi1wiLCBcIueNo1wiLCBcIuWQjOiJsueNo1wiLCBcIuWcsOW/g1wiLCBcIuWQjOiJsuWcsOW/g1wiLCBcIummrOW8k+WFtVwiLCBcIuWQjOiJsummrOW8k+WFtVwiLFxyXG4gICAgICAgIFwi5Yqp5Y+LXCIsIFwi5ZCM6Imy5Yqp5Y+LXCIsIFwi5oim6ZuGXCIsIFwi5ZCM6Imy5oim6ZuGXCIsIFwi6KGM6KGMXCIsIFwi5ZCM6Imy6KGM6KGMXCIsIFwi562G5YW154Sh5YK+XCIsIFwi5ZCM6Imy562G5YW154Sh5YK+XCIsXHJcbiAgICAgICAgXCLpl4fmiKbkuYvpm4ZcIiwgXCLlkIzoibLpl4fmiKbkuYvpm4ZcIiwgXCLnhKHmipfooYzlh6ZcIiwgXCLlkIzoibLnhKHmipfooYzlh6ZcIl07XHJcbiAgICBmb3IgKGNvbnN0IGhhbmQgb2YgaGFuZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGhhbmQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogaGFuZCwgcmVzdDogcy5zbGljZShoYW5kLmxlbmd0aCkgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuZXhwb3J0cy5tdW5jaEhhbmQgPSBtdW5jaEhhbmQ7XHJcbmV4cG9ydHMubXVuY2hDb29yZCA9ICgwLCBtdW5jaF9tb25hZF8xLmxpZnRNMikoKGNvbCwgcm93KSA9PiB7XHJcbiAgICBjb25zdCBjb29yZCA9IFtyb3csIGNvbF07XHJcbiAgICByZXR1cm4gY29vcmQ7XHJcbn0sIG11bmNoQ29sdW1uLCBtdW5jaFJvdyk7XHJcbmV4cG9ydHMubXVuY2hGcm9tSG9wWnVvID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoY29sb3IsIHByb2YsIGRlc3QpID0+ICh7IGNvbG9yLCBwcm9mLCBkZXN0IH0pLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24sIGV4cG9ydHMubXVuY2hDb29yZCk7XHJcbmV4cG9ydHMubXVuY2hQaWVjZUNhcHR1cmVDb21tZW50ID0gKDAsIG11bmNoX21vbmFkXzEubGlmdE0zKSgoXywgY29sb3IsIHByb2YpID0+ICh7IGNvbG9yLCBwcm9mIH0pLCAoMCwgbXVuY2hfbW9uYWRfMS5zdHJpbmcpKFwi5omLXCIpLCBtdW5jaENvbG9yLCBtdW5jaFByb2Zlc3Npb24pO1xyXG5leHBvcnRzLm11bmNoQnJhY2tldGVkQ29vcmQgPSAoMCwgbXVuY2hfbW9uYWRfMS5saWZ0TTMpKChfMSwgY29vcmQsIF8yKSA9PiBjb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIltcIiksIGV4cG9ydHMubXVuY2hDb29yZCwgKDAsIG11bmNoX21vbmFkXzEuc3RyaW5nKShcIl1cIikpO1xyXG5jb25zdCBtdW5jaERpZ2l0TGluemtsYXIgPSAocykgPT4ge1xyXG4gICAgY29uc3QgZHMgPSBbXCLnhKFcIiwgXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIiwgXCLljYFcIiwgXCLkuItcIiwgXCLnmb5cIl07XHJcbiAgICBmb3IgKGNvbnN0IGQgb2YgZHMpIHtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKGQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGFuczogZCwgcmVzdDogcy5zbGljZSgxKSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5jb25zdCBtdW5jaFBla3plcE51bWVyYWwgPSAocykgPT4ge1xyXG4gICAgY29uc3QgdDEgPSAoMCwgbXVuY2hfbW9uYWRfMS5tYW55MSkobXVuY2hEaWdpdExpbnprbGFyKShzKTtcclxuICAgIGlmICghdDEpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBjb25zdCB7IGFucywgcmVzdCB9ID0gdDE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG51bSA9ICgwLCByZWFkX3Bla3plcF9udW1lcmFsc18xLmZyb21EaWdpdHNMaW56a2xhcikoYW5zKTtcclxuICAgICAgICByZXR1cm4geyBhbnM6IG51bSwgcmVzdCB9O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5tdW5jaFBla3plcE51bWVyYWwgPSBtdW5jaFBla3plcE51bWVyYWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbURpZ2l0c0xpbnprbGFyID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXIoaSkge1xyXG4gICAgaWYgKGlbMF0gPT09IFwi54ShXCIgJiYgaS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGlmIChpWzBdID09PSBcIuS4i1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIC1mcm9tRGlnaXRzTGluemtsYXIoaS5zbGljZSgxKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVswXSA9PT0gXCLnmb5cIikge1xyXG4gICAgICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTAwICsgZnJvbURpZ2l0c0xpbnprbGFyKGkuc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5kZXgxMDAgPSBpLmluZGV4T2YoXCLnmb5cIik7XHJcbiAgICBpZiAoaW5kZXgxMDAgIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgaHVuZHJlZHMgPSBpLnNsaWNlKDAsIGluZGV4MTAwKTtcclxuICAgICAgICBjb25zdCBvbmVzID0gaS5zbGljZShpbmRleDEwMCArIDEpO1xyXG4gICAgICAgIHJldHVybiAxMDAgKiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaHVuZHJlZHMpICsgZnJvbURpZ2l0c0xpbnprbGFyU3ViKG9uZXMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaVsxXSA9PT0gXCLljYFcIikge1xyXG4gICAgICAgIHJldHVybiAxMCAqIHBhcnNlVW5pdChpWzBdKSArIHBhcnNlVW5pdChpWzJdKTtcclxuICAgIH1cclxuICAgIGlmIChpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoaVswXSk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSBcIiR7aX1cIiBhcyBhIHBla3plcCBudW1lcmFsYCk7XHJcbn1cclxuZXhwb3J0cy5mcm9tRGlnaXRzTGluemtsYXIgPSBmcm9tRGlnaXRzTGluemtsYXI7XHJcbmZ1bmN0aW9uIHBhcnNlVW5pdChvbmVzKSB7XHJcbiAgICBpZiAob25lcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuIBcIikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS4iVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLlm5tcIikge1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuWFrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDY7XHJcbiAgICB9XHJcbiAgICBpZiAob25lcyA9PT0gXCLkuINcIikge1xyXG4gICAgICAgIHJldHVybiA3O1xyXG4gICAgfVxyXG4gICAgaWYgKG9uZXMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICByZXR1cm4gODtcclxuICAgIH1cclxuICAgIGlmIChvbmVzID09PSBcIuS5nVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIDk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIFwiJHtvbmVzfVwiIHdoaWxlIHRyeWluZyB0byBwYXJzZSBwZWt6ZXAgbnVtZXJhbHNgKTtcclxufVxyXG5mdW5jdGlvbiBmcm9tRGlnaXRzTGluemtsYXJTdWIoaSkge1xyXG4gICAgaWYgKGkubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgaWYgKGlbMF0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gMTAgKyBwYXJzZVVuaXQoaVsxXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpW2kubGVuZ3RoIC0gMV0gPT09IFwi5Y2BXCIpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VVbml0KGlbMF0pICogMTA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBhID0gaVswXTtcclxuICAgICAgICBjb25zdCBiID0gaVsxXTtcclxuICAgICAgICBpZiAoYiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VVbml0KGEpO1xyXG4gICAgICAgIHJldHVybiBwYXJzZVVuaXQoYSkgKiAxMCArIHBhcnNlVW5pdChiKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3csIEFic29sdXRlQ29vcmQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xuaW1wb3J0IHsgTm9uVGFtUGllY2UsIFN0YXRlLCBIYW56aVByb2Zlc3Npb25BbmRUYW0sIHByb2ZzLCBCb2FyZCB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBoZWlnaHQgPSAzODc7XG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcbmV4cG9ydCBjb25zdCB0b3BfbWFyZ2luID0gNDA7XG5leHBvcnQgY29uc3QgY2VsbF9zaXplID0gNDM7XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3RW1wdHlCb2FyZCgpIHtcbiAgICBjb25zdCBjdHggPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdlwiKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbiAgICAvLyDnmoflh6ZcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjcsIDU0LjUlLCA4MS4xJSlcIlxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xuXG5cbiAgICAvLyDnmofmsLRcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjEzLCAzMy42JSwgNzguOSUpXCI7XG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDkpO1xuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcblxuICAgIC8vIOeah+WxsVxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgxMjksIDM4LjUlLCA0NS40JSlcIjtcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoOTksIDk5LCA5OSknO1xuICAgIGN0eC5saW5lV2lkdGggPSAwLjAzICogaGVpZ2h0IC8gOTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDk7IGkrKykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyAwLCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaGVpZ2h0LCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAwKTtcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgaGVpZ2h0KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5mb250ID0gXCIyMHB4IHNhbnMtc2VyaWZcIjtcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwwLDApXCI7XG4gICAgY29uc3QgY29sdW1ucyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiLCBcIkFJXCIsIFwiQVVcIiwgXCJJQVwiXTtcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIGxlZnRfbWFyZ2luICsgaGVpZ2h0ICsgMTAsIHRvcF9tYXJnaW4gKyAzMCArIGNlbGxfc2l6ZSAqIGkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIGNlbGxfc2l6ZSAqIGksIHRvcF9tYXJnaW4gLSAxMCk7XG4gICAgfVxuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XG5cbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIC1sZWZ0X21hcmdpbiArIDEwLCAtKHRvcF9tYXJnaW4gKyAxNSArIGNlbGxfc2l6ZSAqIGkpKTtcbiAgICB9XG5cbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCAtKGxlZnRfbWFyZ2luICsgMjAgKyBjZWxsX3NpemUgKiBpKSwgLSh0b3BfbWFyZ2luICsgaGVpZ2h0ICsgMTApKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBnZXRfdG9wX2xlZnQoY29vcmQ6IEFic29sdXRlQ29vcmQpIHtcbiAgICBjb25zdCBjb2x1bW4gPSB7XG4gICAgICAgIEs6IDAsXG4gICAgICAgIEw6IDEsXG4gICAgICAgIE46IDIsXG4gICAgICAgIFQ6IDMsXG4gICAgICAgIFo6IDQsXG4gICAgICAgIFg6IDUsXG4gICAgICAgIEM6IDYsXG4gICAgICAgIE06IDcsXG4gICAgICAgIFA6IDhcbiAgICB9W2Nvb3JkWzFdXTtcbiAgICBjb25zdCByb3cgPSB7XG4gICAgICAgIElBOiA4LFxuICAgICAgICBBVTogNyxcbiAgICAgICAgQUk6IDYsIFk6IDUsIE86IDQsIFU6IDMsIEk6IDIsIEU6IDEsIEE6IDBcbiAgICB9W2Nvb3JkWzBdXTtcbiAgICBjb25zdCBsZWZ0ID0gbGVmdF9tYXJnaW4gKyBjZWxsX3NpemUgKiAoY29sdW1uIC0gMC41KTtcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgY2VsbF9zaXplICogKHJvdyAtIDAuNSk7XG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdGb2N1c1N0ZXBwZWQoZm9jdXNfc3RlcHBlZDogQWJzb2x1dGVDb29yZCB8IG51bGwpIHtcbiAgICBpZiAoIWZvY3VzX3N0ZXBwZWQpIHJldHVybjtcbiAgICBjb25zdCBjaXJjbGVfcmFkaXVzID0gMTg7XG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGdldF90b3BfbGVmdChmb2N1c19zdGVwcGVkKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpZWNlc19pbm5lclwiKSEuaW5uZXJIVE1MICs9IGBcbiAgICA8ZGl2IHN0eWxlPVwiXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXG4gICAgICAgIGxlZnQ6ICR7bGVmdCArIGNlbGxfc2l6ZSAtIGNpcmNsZV9yYWRpdXN9cHg7XG4gICAgICAgIHRvcDogJHt0b3AgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xuICAgICAgICB3aWR0aDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXG4gICAgICAgIGhlaWdodDogJHtjaXJjbGVfcmFkaXVzICogMn1weDsgXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDAsIDAuMylcbiAgICBcIj48L2Rpdj5gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ZvY3VzU3JjKGZvY3VzX3NyYzogQWJzb2x1dGVDb29yZCB8IG51bGwpIHtcbiAgICBpZiAoIWZvY3VzX3NyYykgcmV0dXJuO1xuICAgIGNvbnN0IGNpcmNsZV9yYWRpdXMgPSAxODtcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZ2V0X3RvcF9sZWZ0KGZvY3VzX3NyYyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCArPSBgXG4gICAgPGRpdiBzdHlsZT1cIlxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IFxuICAgICAgICBsZWZ0OiAke2xlZnQgKyBjZWxsX3NpemUgLSBjaXJjbGVfcmFkaXVzfXB4O1xuICAgICAgICB0b3A6ICR7dG9wICsgY2VsbF9zaXplIC0gY2lyY2xlX3JhZGl1c31weDtcbiAgICAgICAgd2lkdGg6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxuICAgICAgICBoZWlnaHQ6ICR7Y2lyY2xlX3JhZGl1cyAqIDJ9cHg7IFxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMylcbiAgICBcIj48L2Rpdj5gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd1BpZWNlc09uQm9hcmQoYm9hcmQ6IEJvYXJkLCBmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwpIHtcbiAgICBsZXQgYW5zID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGNsbSBpbiBib2FyZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcbiAgICAgICAgICAgIGNvbnN0IGlzX2ZvY3VzZWQgPSBmb2N1cyA/IGZvY3VzWzFdID09PSBjbG0gJiYgZm9jdXNbMF0gPT09IHJ3IDogZmFsc2U7XG4gICAgICAgICAgICBhbnMgKz0gcG9zaXRpb25QaWVjZU9uQm9hcmQoXG4gICAgICAgICAgICAgICAgY2xtIGFzIEFic29sdXRlQ29sdW1uLFxuICAgICAgICAgICAgICAgIHJ3IGFzIEFic29sdXRlUm93LFxuICAgICAgICAgICAgICAgIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0hW3J3IGFzIEFic29sdXRlUm93XSEsXG4gICAgICAgICAgICAgICAgaXNfZm9jdXNlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGllY2VzX2lubmVyXCIpIS5pbm5lckhUTUwgPSBhbnM7XG59XG5cblxuZnVuY3Rpb24gZ2V0SG9wMVp1bzFIVE1MKHBpZWNlczogTm9uVGFtUGllY2VbXSwgaXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4pIHtcbiAgICBsZXQgYW5zID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XG4gICAgICAgIGNvbnN0IHJhZCA9IDE4IC8gMC4yNjtcbiAgICAgICAgYW5zICs9IGA8bGk+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiXG4gICAgICAgICAgICAgICAgd2lkdGg6IDIzcHg7IFxuICAgICAgICAgICAgICAgIGhlaWdodDogJHtjZWxsX3NpemV9cHg7IFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0OyBcbiAgICAgICAgICAgIFwiPlxuICAgICAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoY29sb3IsIHByb2YsIGZhbHNlKX1cbiAgICAgICAgICAgICAgICAke2lzX25ld2x5X2FjcXVpcmVkICYmIGkgPT0gcGllY2VzLmxlbmd0aCAtIDEgPyBgPGRpdiBzdHlsZT1cIlxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7NDIgLSByYWR9cHg7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogJHs0MiAtIHJhZH1weDtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7cmFkICogMn1weDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke3JhZCAqIDJ9cHg7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCA2MCwgNjAsIDAuMyk7XG4gICAgICAgICAgICAgICAgXCI+PC9kaXY+YCA6IFwiXCJ9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9saT5gO1xuICAgIH1cbiAgICByZXR1cm4gYW5zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd0dhbWVTdGF0ZShTVEFURTogU3RhdGUpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXNvbl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5zZWFzb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmF0ZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5yYXRlICsgXCJcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnBsYXllcl9uYW1lO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xLCBTVEFURS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gZ2V0SG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEsIFNUQVRFLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5zY29yZSArIFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUuc2NvcmUgKyBcIlwiO1xuICAgIGRyYXdQaWVjZXNPbkJvYXJkKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cyk7XG4gICAgZHJhd0ZvY3VzU3RlcHBlZChTVEFURS5mb2N1c19zdGVwcGVkKTtcbiAgICBkcmF3Rm9jdXNTcmMoU1RBVEUuZm9jdXNfc3JjKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTm9ybWFsUGllY2UoY29sb3I6IFwi6buSXCIgfCBcIui1pFwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb25BbmRUYW0sIGlzX2JvbGQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcbiAgICBjb25zdCB5ID0gaXNfYm9sZCA/IDAgOiAtMjc3O1xuICAgIGNvbnN0IGNvbG9yX3BhdGggPSB7XG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXG4gICAgICAgIFwi6LWkXCI6IFwi44K044K344OD44Kv6aeSX+i1pFwiLFxuICAgIH1bY29sb3JdO1xuICAgIHJldHVybiBgPGRpdlxuICAgIHN0eWxlPVwid2lkdGg6IDg3cHg7IGhlaWdodDogODdweDsgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAke3h9cHg7IGJhY2tncm91bmQtcG9zaXRpb24teTogJHt5fXB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtjb2xvcl9wYXRofS5zdmcpOyBcIj5cbjwvZGl2PmBcbn1cblxuXG5mdW5jdGlvbiBwb3NpdGlvblBpZWNlT25Cb2FyZChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZ2V0X3RvcF9sZWZ0KFtydywgY2xtXSk7XG4gICAgaWYgKHBpZWNlID09PSBcIueah1wiKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke1wicm90YXRlKDkwZGVnKVwifVwiPlxuICAgICAgICAgICAgJHtyZW5kZXJOb3JtYWxQaWVjZShcIum7klwiLCBcIueah1wiLCBpc19ib2xkKX1cbiAgICAgICAgPC9kaXY+YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9ID0gcGllY2U7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6ICR7bGVmdH1weDsgdG9wOiAke3RvcH1weDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KSAke2lzX2FzaWRlID8gXCJyb3RhdGUoMTgwZGVnKVwiIDogXCJcIn1cIj5cbiAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoY29sb3IsIHByb2YsIGlzX2JvbGQpfVxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQsIFBhcnNlZCB9IGZyb20gXCJjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyXCI7XG5pbXBvcnQgeyBCb2FyZCwgTm9uVGFtUGllY2UsIFN0YXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IEFic29sdXRlQ29vcmQgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xuXG5mdW5jdGlvbiBnZXRJbml0aWFsQm9hcmQoKTogQm9hcmQge1xuXHRyZXR1cm4ge1xuXHRcdEs6IHtcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHR9LFxuXHRcdEw6IHtcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcblx0XHR9LFxuXHRcdE46IHtcblx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdH0sXG5cdFx0VDoge1xuXHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdH0sXG5cdFx0Wjoge1xuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRPOiBcIueah1wiLFxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdH0sXG5cdFx0WDoge1xuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxuXHRcdH0sXG5cdFx0Qzoge1xuXHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0fSxcblx0XHRNOiB7XG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0fSxcblx0XHRQOiB7XG5cdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxuXHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcblx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXG5cdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShvOiB7XG5cdGlhX3NpZGU6IHtcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmdcblx0fSxcblx0YV9zaWRlOiB7XG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxuXHR9LFxufSk6IFN0YXRlIHtcblx0cmV0dXJuIHtcblx0XHRzZWFzb246IFwi5pilXCIsXG5cdFx0dHVybjogMCxcblx0XHRyYXRlOiAxLFxuXHRcdGZvY3VzOiBudWxsLFxuXHRcdGZvY3VzX3N0ZXBwZWQ6IG51bGwsXG5cdFx0Zm9jdXNfc3JjOiBudWxsLFxuXHRcdGJvYXJkOiBnZXRJbml0aWFsQm9hcmQoKSxcblx0XHRpYV9zaWRlOiB7XG5cdFx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogby5pYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxuXHRcdFx0aG9wMXp1bzE6IFtdLFxuXHRcdFx0cGxheWVyX25hbWU6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZSxcblx0XHRcdHNjb3JlOiAyMCxcblx0XHRcdGlzX25ld2x5X2FjcXVpcmVkOiBmYWxzZSxcblx0XHR9LFxuXHRcdGFfc2lkZToge1xuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxuXHRcdFx0cGxheWVyX25hbWU6IG8uYV9zaWRlLnBsYXllcl9uYW1lLFxuXHRcdFx0aG9wMXp1bzE6IFtdLFxuXHRcdFx0c2NvcmU6IDIwLFxuXHRcdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGZhbHNlLFxuXHRcdH0sXG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlX2Zyb20oc3RhdGU6IFN0YXRlLCBjb29yZDogQWJzb2x1dGVDb29yZCk6IE5vblRhbVBpZWNlIHwgXCLnmodcIiB7XG5cdGNvbnN0IHBpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcblx0aWYgKCFwaWVjZSkgeyB0aHJvdyBuZXcgRXJyb3IoYOOCqOODqeODvDog5bqn5qiZJHtjb29yZFsxXX0ke2Nvb3JkWzBdfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApOyB9XG5cdGRlbGV0ZSBzdGF0ZS5ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuXHRyZXR1cm4gcGllY2U7XG59XG5cbmZ1bmN0aW9uIHNldF90byhzdGF0ZTogU3RhdGUsIGNvb3JkOiBBYnNvbHV0ZUNvb3JkLCBwaWVjZTogTm9uVGFtUGllY2UgfCBcIueah1wiKTogTm9uVGFtUGllY2UgfCB1bmRlZmluZWQge1xuXHRpZiAoc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSkge1xuXHRcdGNvbnN0IGNhcHR1cmVkX3BpZWNlID0gc3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcblx0XHRpZiAoY2FwdHVyZWRfcGllY2UgPT09IFwi55qHXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihg44Ko44Op44O8OiDluqfmqJkke2Nvb3JkWzFdfSR7Y29vcmRbMF1944Gr44Gv55qH44GM5pei44Gr44GC44KK44G+44GZYCk7XG5cdFx0fVxuXHRcdHN0YXRlLmJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSBwaWVjZTtcblx0XHRyZXR1cm4gY2FwdHVyZWRfcGllY2U7XG5cdH0gZWxzZSB7XG5cdFx0c3RhdGUuYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9IHBpZWNlO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0X2hvcDF6dW8xKHN0YXRlOiBTdGF0ZSwgcGllY2U6IE5vblRhbVBpZWNlKSB7XG5cdGlmIChwaWVjZS5pc19hc2lkZSkge1xuXHRcdHN0YXRlLmlhX3NpZGUuaG9wMXp1bzEucHVzaCh7IGNvbG9yOiBwaWVjZS5jb2xvciwgcHJvZjogcGllY2UucHJvZiwgaXNfYXNpZGU6IGZhbHNlIH0pO1xuXHRcdHN0YXRlLmlhX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdHN0YXRlLmFfc2lkZS5ob3AxenVvMS5wdXNoKHsgY29sb3I6IHBpZWNlLmNvbG9yLCBwcm9mOiBwaWVjZS5wcm9mLCBpc19hc2lkZTogdHJ1ZSB9KTtcblx0XHRzdGF0ZS5hX3NpZGUuaXNfbmV3bHlfYWNxdWlyZWQgPSB0cnVlO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZTogUmVhZG9ubHk8U3RhdGU+LCBib2R5X2VsZW1lbnQ6IEJvZHlFbGVtZW50KTogU3RhdGUgfCBudWxsIHtcblx0Y29uc3QgbmV3X3N0YXRlOiBTdGF0ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY3VycmVudF9zdGF0ZSkpO1xuXHRuZXdfc3RhdGUuaWFfc2lkZS5pc19uZXdseV9hY3F1aXJlZCA9IGZhbHNlO1xuXHRuZXdfc3RhdGUuYV9zaWRlLmlzX25ld2x5X2FjcXVpcmVkID0gZmFsc2U7XG5cdGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJzZWFzb25fZW5kc1wiKSB7XG5cdFx0aWYgKGN1cnJlbnRfc3RhdGUuc2Vhc29uID09PSBcIuWGrFwiKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0bmV3X3N0YXRlLnNlYXNvbiA9XG5cdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLmmKVcIiA/IFwi5aSPXCIgOlxuXHRcdFx0XHRjdXJyZW50X3N0YXRlLnNlYXNvbiA9PT0gXCLlpI9cIiA/IFwi56eLXCIgOlxuXHRcdFx0XHRcdGN1cnJlbnRfc3RhdGUuc2Vhc29uID09PSBcIueni1wiID8gXCLlhqxcIiA6XG5cdFx0XHRcdFx0XHQoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoKSB9KSgpO1xuXHRcdG5ld19zdGF0ZS50dXJuID0gMDtcblx0XHRyZXR1cm4gbmV3X3N0YXRlO1xuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcIm5vcm1hbF9tb3ZlXCIpIHtcblx0XHRpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LnR5cGUgPT09IFwiTm9uVGFtTW92ZVwiKSB7XG5cdFx0XHRpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNEc3RcIikge1xuXHRcdFx0XHRjb25zdCBwaWVjZSA9IHJlbW92ZV9mcm9tKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuc3JjKTtcblx0XHRcdFx0Y29uc3QgbWF5YmVfY2FwdHVyZWRfcGllY2UgPSBzZXRfdG8obmV3X3N0YXRlLCBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0LCBwaWVjZSk7XG5cdFx0XHRcdGlmIChtYXliZV9jYXB0dXJlZF9waWVjZSkge1xuXHRcdFx0XHRcdHNldF9ob3AxenVvMShuZXdfc3RhdGUsIG1heWJlX2NhcHR1cmVkX3BpZWNlKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1cyA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLmRlc3Q7XG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1c19zdGVwcGVkID0gbnVsbDtcblx0XHRcdFx0bmV3X3N0YXRlLmZvY3VzX3NyYyA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYztcblx0XHRcdFx0bmV3X3N0YXRlLnR1cm4rKztcblx0XHRcdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZSA9PT0gXCJTcmNTdGVwRHN0RmluaXRlXCIpIHtcblx0XHRcdFx0Y29uc3QgcGllY2UgPSByZW1vdmVfZnJvbShuZXdfc3RhdGUsIGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnNyYyk7XG5cdFx0XHRcdGNvbnN0IG1heWJlX2NhcHR1cmVkX3BpZWNlID0gc2V0X3RvKG5ld19zdGF0ZSwgYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEuZGVzdCwgcGllY2UpO1xuXHRcdFx0XHRpZiAobWF5YmVfY2FwdHVyZWRfcGllY2UpIHtcblx0XHRcdFx0XHRzZXRfaG9wMXp1bzEobmV3X3N0YXRlLCBtYXliZV9jYXB0dXJlZF9waWVjZSlcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXMgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5kZXN0O1xuXHRcdFx0XHRuZXdfc3RhdGUuZm9jdXNfc3RlcHBlZCA9IGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnN0ZXA7XG5cdFx0XHRcdG5ld19zdGF0ZS5mb2N1c19zcmMgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YS5zcmM7XG5cdFx0XHRcdG5ld19zdGF0ZS50dXJuKys7XG5cdFx0XHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC5tb3ZlbWVudC5kYXRhLnR5cGUgPT09IFwiRnJvbUhhbmRcIikge1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQuZGF0YTtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTaG91bGQgbm90IHJlYWNoIGhlcmU6IGludmFsaWQgdmFsdWUgaW4gYm9keV9lbGVtZW50Lm1vdmVtZW50LmRhdGEudHlwZWApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoYm9keV9lbGVtZW50Lm1vdmVtZW50LnR5cGUgPT09IFwiVGFtTW92ZVwiKSB7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgXzogbmV2ZXIgPSBib2R5X2VsZW1lbnQubW92ZW1lbnQ7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQubW92ZW1lbnQudHlwZWApO1xuXHRcdH1cblx0fSBlbHNlIGlmIChib2R5X2VsZW1lbnQudHlwZSA9PT0gXCJlbmRfc2Vhc29uXCIpIHtcblxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcImdhbWVfc2V0XCIpIHtcblxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInRheG90XCIpIHtcblxuXHR9IGVsc2UgaWYgKGJvZHlfZWxlbWVudC50eXBlID09PSBcInR5bW9rXCIpIHtcblxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IF86IG5ldmVyID0gYm9keV9lbGVtZW50O1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZTogaW52YWxpZCB2YWx1ZSBpbiBib2R5X2VsZW1lbnQudHlwZVwiKTtcblx0fVxuXHRyZXR1cm4gbmV3X3N0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU3RhdGVzRnJvbVBhcnNlZChwYXJzZWQ6IFJlYWRvbmx5PFBhcnNlZD4pOiBTdGF0ZVtdIHtcblx0bGV0IGN1cnJlbnRfc3RhdGUgPSBnZXRJbml0aWFsU3RhdGUoe1xuXHRcdGlhX3NpZGU6IHsgcGxheWVyX25hbWVfc2hvcnQ6IFwi5by1XCIsIHBsYXllcl9uYW1lOiBcIuW8teS4iVwiIH0sXG5cdFx0YV9zaWRlOiB7IHBsYXllcl9uYW1lX3Nob3J0OiBcIuadjlwiLCBwbGF5ZXJfbmFtZTogXCLmnY7lm5tcIiB9XG5cdH0pO1xuXHRjb25zdCBhbnM6IFN0YXRlW10gPSBbY3VycmVudF9zdGF0ZV07XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLnBhcnNlZF9ib2RpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBuZXh0X3N0YXRlID0gKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBnZXROZXh0U3RhdGUoY3VycmVudF9zdGF0ZSwgcGFyc2VkLnBhcnNlZF9ib2RpZXNbaV0pXG5cdFx0XHR9IGNhdGNoIChlOiBhbnkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7aX3jgrnjg4bjg4Pjg5fnm67jgafjga4ke2V9YCk7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50X3N0YXRlO1xuXHRcdFx0fVxuXHRcdH0pKCk7XG5cdFx0aWYgKCFuZXh0X3N0YXRlKSBicmVhaztcblx0XHRhbnMucHVzaChuZXh0X3N0YXRlKTtcblx0XHRjdXJyZW50X3N0YXRlID0gbmV4dF9zdGF0ZTtcblx0fVxuXHRyZXR1cm4gYW5zO1xufVxuIiwiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93LCBBYnNvbHV0ZUNvb3JkIH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcblxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uID0gXCLoiLlcIiB8IFwi54ShXCIgfCBcIuWFtVwiIHwgXCLlvJNcIiB8IFwi6LuKXCIgfCBcIuiZjlwiIHwgXCLppqxcIiB8IFwi562GXCIgfCBcIuW3q1wiIHwgXCLlsIZcIiB8IFwi546LXCI7XG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb25BbmRUYW0gPSBIYW56aVByb2Zlc3Npb24gfCBcIueah1wiO1xuXG5leHBvcnQgY29uc3QgcHJvZnM6IEhhbnppUHJvZmVzc2lvbkFuZFRhbVtdID0gW1xuXHRcIuiIuVwiLCBcIueEoVwiLCBcIuWFtVwiLCBcIuW8k1wiLCBcIui7ilwiLCBcIuiZjlwiLCBcIummrFwiLCBcIuethlwiLCBcIuW3q1wiLCBcIuWwhlwiLCBcIueOi1wiLCBcIueah1wiXG5dO1xuXG5leHBvcnQgdHlwZSBCb2FyZCA9IHtcblx0SzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxuXHRMOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXG5cdE46IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcblx0VDogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxuXHRaOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXG5cdFg6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcblx0QzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9LFxuXHRNOiB7IFtrZXkgaW4gQWJzb2x1dGVSb3ddPzogTm9uVGFtUGllY2UgfCBcIueah1wiIH0sXG5cdFA6IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSxcbn07XG5cbmV4cG9ydCB0eXBlIEhhbnppU2Vhc29uID0gXCLmmKVcIiB8IFwi5aSPXCIgfCBcIueni1wiIHwgXCLlhqxcIjtcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xuXG5leHBvcnQgdHlwZSBTdGF0ZSA9IHtcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcblx0dHVybjogbnVtYmVyLFxuXHRyYXRlOiBSYXRlLFxuXHRmb2N1czogQWJzb2x1dGVDb29yZCB8IG51bGwsXG5cdGZvY3VzX3N0ZXBwZWQ6IEFic29sdXRlQ29vcmQgfCBudWxsLFxuXHRmb2N1c19zcmM6IEFic29sdXRlQ29vcmQgfCBudWxsLCBcblx0Ym9hcmQ6IEJvYXJkLFxuXHRpYV9zaWRlOiB7XG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcblx0XHRob3AxenVvMTogeyBjb2xvcjogXCLotaRcIiB8IFwi6buSXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IGZhbHNlIH1bXSxcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxuXHRcdHNjb3JlOiBudW1iZXIsXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXG5cdH0sXG5cdGFfc2lkZToge1xuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcblx0XHRob3AxenVvMTogeyBjb2xvcjogXCLotaRcIiB8IFwi6buSXCIsIHByb2Y6IEhhbnppUHJvZmVzc2lvbiwgaXNfYXNpZGU6IHRydWUgfVtdLFxuXHRcdHNjb3JlOiBudW1iZXIsXG5cdFx0aXNfbmV3bHlfYWNxdWlyZWQ6IGJvb2xlYW4sXG5cdH1cbn1cblxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBcIui1pFwiIHwgXCLpu5JcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IHBhcnNlQ2Vya2VPbmxpbmVLaWExQWsxLCBQYXJzZWQgfSBmcm9tICdjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyJztcbmltcG9ydCB7IGRyYXdFbXB0eUJvYXJkLCBkcmF3R2FtZVN0YXRlIH0gZnJvbSAnLi9kcmF3JztcbmltcG9ydCB7IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQgfSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi90eXBlcyc7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNhc2UxID1cblx0YHvkuIDkvY3oibI66buS6buS6buSfVxue+Wni+aZgjoyMDIyLTA1LTMxVDE3OjE2OjAyLjQzM1p9XG5757WC5pmCOjIwMjItMDUtMzFUMTg6MTM6NTIuMzU3Wn1cbk1BVeW8k01BSU1Z5qmL5LqUICAgIFBF5berUElQVeeEoeaSg+ijgVxuQ0FJ5YW1Q0FV54Sh5pKD6KOBICAgIE1F5byTQ0XnhKHmkoPoo4FcblBBVeW3q0NBVUNBSeeEoeaSg+ijgSAgICBaQeeOi1pF54Sh5pKD6KOBXG5NWeW8k01JTUHmqYvkuIDmraTnhKEgICAgQ0nlhbVNSU1V54Sh5pKD6KOBXG5DQUnlt6tDQU1B5qmL5LiA5omL6LWk6aasICAgIFBB562GTUHnhKHmkoPoo4HmiYvotaTlt6tcbkxBVeW8k0xBSUxZ5qmL5LiJICAgIFRF6JmOTklUVeapi+S4gFxuTFnlvJNMSUxF5qmL5LiJ5omL6LWk5byTICAgIEtB562GS0VMReeEoeaSg+ijgeaJi+m7kuW8k1xuTVnlvJNNVeeEoeaSg+ijgeaJi+m7kuWFtVxuXG7miJbngrrppqzlvJPlhbXogIzmiYvkupRcbue1guWtoyAgICDmmKXntYJcblxuTUFV5byTTUFJTVnmqYvkuIkgICAgWEXomY5aSVhV54Sh5pKD6KOBXG5YQUnlhbVYWeeEoeaSg+ijgSAgICBYVeiZjk1Z54Sh5pKD6KOB5omL6LWk5byTXG5YQVXomY5DQUlNWeapi+Wbm+aJi+m7kuiZjiAgICBNReW8k01JTVXmqYvkuIlcbktBVeW3q0tBSUtZ54Sh5pKD6KOBICAgIFpP55qHW1RVXVpJWkVcblBBVeW3q1pBVeeEoeaSg+ijgSAgICBDSeWFtUNF54Sh5pKD6KOBXG5aQUnoiLlaSeeEoeaSg+ijgeaJi+i1pOiIuSAgICBUReiZjlpJ5rC05LqM5q2k54ShXG5aReeah1RJW05VXUxPICAgIFhB5bCGWkXnhKHmkoPoo4FcblpJ6Ii5WkVaQeapi+Wbm+aJi+i1pOeOi1xuXG7miJbngrrnjovliqDnjaPogIzmiYvlhatcbue1guWtoyAgICDlpI/ntYJcblxuTUFV5byTTUFJTVnmqYvkuowgICAgTUXlvJNNSU1V5qmL5LiJXG5DQUnlhbVDQVXnhKHmkoPoo4EgICAgWEXomY5aSVhV54Sh5pKD6KOBXG5NWeW8k01V54Sh5pKD6KOB5omL6buS5byTICAgIE1J5YW1TVXnhKHmkoPoo4HmiYvotaTlvJNcblBBVeW3q0NBVUNBSeeEoeaSg+ijgSAgICBaQeeOi1pF54Sh5pKD6KOBXG5DQUnlt6tDQVhB5qmL5LiJ5omL6LWk5bCGICAgIFpF546LWEHnhKHmkoPoo4HmiYvotaTlt6tcblBJQeethlBBSVBZ5qmL5LiAICAgIFBF5berWkXnhKHmkoPoo4FcblBZ562GUElQQeapi+S6jOaJi+i1pOethiAgICBDQei7ilBB54Sh5pKD6KOB5omL6buS562GXG5MQVXlvJNMQUlMWeapi+S4gCAgICBMReW8k0xJTFXmqYvlm5tcbkxZ5byTTFXnhKHmkoPoo4HmiYvotaTlvJMgICAgTEnlhbVMVeeEoeaSg+ijgeaJi+m7kuW8k1xu6buS5byTQ1kgICAg6buS5byTQ1VcbkNZ5byTQ1XnhKHmkoPoo4HmiYvpu5LlvJMgICAgQ0nlhbVDVeeEoeaSg+ijgeaJi+m7kuW8k1xu6buS5byTTUkgICAgWEHnjotDReeEoeaSg+ijgVxuTUnlvJNNQeeEoeaSg+ijgeaJi+i1pOmmrCAgICBDReeOi01B54Sh5pKD6KOB5omL6buS5byTXG5UQVXomY5aQUlUWeeEoeaSg+ijgSAgICBOSeWFtU5P5rC05LiJXG5UWeiZjk5PTFXnhKHmkoPoo4HmiYvotaTlhbVcblxu5oiW54K65ZCM6Imy6aas5byT5YW16ICM5omL5LiDXG7ntYLlraMgICAg56eL57WCXG5cblxu5pif5LiA5ZGoYDtcblxuICAgIGNvbnN0IHBhcnNlZDogUGFyc2VkID0gcGFyc2VDZXJrZU9ubGluZUtpYTFBazEoY2FzZTEpO1xuICAgIGNvbnN0IHN0YXRlczogU3RhdGVbXSA9IGdldEFsbFN0YXRlc0Zyb21QYXJzZWQocGFyc2VkKTtcblxuICAgIGRyYXdFbXB0eUJvYXJkKCk7XG4gICAgY29uc3QgdHVybl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fc2xpZGVyXCIpISBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHR1cm5fc2xpZGVyLm1pbiA9IFwiMFwiO1xuICAgIHR1cm5fc2xpZGVyLm1heCA9IGAke3N0YXRlcy5sZW5ndGggLSAxfWA7XG4gICAgdHVybl9zbGlkZXIudmFsdWUgPSBcIjBcIjtcbiAgICBkcmF3R2FtZVN0YXRlKHN0YXRlc1swXSk7XG4gICAgdHVybl9zbGlkZXIub25pbnB1dCA9ICgpID0+IHtcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShzdGF0ZXNbTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKV0pO1xuICAgIH1cbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
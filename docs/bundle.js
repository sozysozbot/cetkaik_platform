/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
exports.getNthState = void 0;
function getInitialState(o) {
    return {
        season: "春",
        turn: 1,
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
var draw_1 = __webpack_require__(/*! ./draw */ "./src/draw.ts");
var state_1 = __webpack_require__(/*! ./state */ "./src/state.ts");
window.addEventListener('load', function () {
    var case1 = "{\u4E00\u4F4D\u8272:\u9ED2\u9ED2\u9ED2}\n{\u59CB\u6642:2022-05-31T17:16:02.433Z}\n{\u7D42\u6642:2022-05-31T18:13:52.357Z}\nMAU\u5F13MAIMY\u6A4B\u4E94    PE\u5DEBPIPU\u7121\u6483\u88C1\nCAI\u5175CAU\u7121\u6483\u88C1    ME\u5F13CE\u7121\u6483\u88C1\nPAU\u5DEBCAUCAI\u7121\u6483\u88C1    ZA\u738BZE\u7121\u6483\u88C1\nMY\u5F13MIMA\u6A4B\u4E00\u6B64\u7121    CI\u5175MIMU\u7121\u6483\u88C1\nCAI\u5DEBCAMA\u6A4B\u4E00\u624B\u8D64\u99AC    PA\u7B46MA\u7121\u6483\u88C1\u624B\u8D64\u5DEB\nLAU\u5F13LAILY\u6A4B\u4E09    TE\u864ENITU\u6A4B\u4E00\nLY\u5F13LILE\u6A4B\u4E09\u624B\u8D64\u5F13    KA\u7B46KELE\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nMY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5175\n\n\u6216\u70BA\u99AC\u5F13\u5175\u800C\u624B\u4E94\n\u7D42\u5B63    \u6625\u7D42\n\nMAU\u5F13MAIMY\u6A4B\u4E09    XE\u864EZIXU\u7121\u6483\u88C1\nXAI\u5175XY\u7121\u6483\u88C1    XU\u864EMY\u7121\u6483\u88C1\u624B\u8D64\u5F13\nXAU\u864ECAIMY\u6A4B\u56DB\u624B\u9ED2\u864E    ME\u5F13MIMU\u6A4B\u4E09\nKAU\u5DEBKAIKY\u7121\u6483\u88C1    ZO\u7687[TU]ZIZE\nPAU\u5DEBZAU\u7121\u6483\u88C1    CI\u5175CE\u7121\u6483\u88C1\nZAI\u8239ZI\u7121\u6483\u88C1\u624B\u8D64\u8239    TE\u864EZI\u6C34\u4E8C\u6B64\u7121\nZE\u7687TI[NU]LO    XA\u5C06ZE\u7121\u6483\u88C1\nZI\u8239ZEZA\u6A4B\u56DB\u624B\u8D64\u738B\n\n\u6216\u70BA\u738B\u52A0\u7363\u800C\u624B\u516B\n\u7D42\u5B63    \u590F\u7D42\n\nMAU\u5F13MAIMY\u6A4B\u4E8C    ME\u5F13MIMU\u6A4B\u4E09\nCAI\u5175CAU\u7121\u6483\u88C1    XE\u864EZIXU\u7121\u6483\u88C1\nMY\u5F13MU\u7121\u6483\u88C1\u624B\u9ED2\u5F13    MI\u5175MU\u7121\u6483\u88C1\u624B\u8D64\u5F13\nPAU\u5DEBCAUCAI\u7121\u6483\u88C1    ZA\u738BZE\u7121\u6483\u88C1\nCAI\u5DEBCAXA\u6A4B\u4E09\u624B\u8D64\u5C06    ZE\u738BXA\u7121\u6483\u88C1\u624B\u8D64\u5DEB\nPIA\u7B46PAIPY\u6A4B\u4E00    PE\u5DEBZE\u7121\u6483\u88C1\nPY\u7B46PIPA\u6A4B\u4E8C\u624B\u8D64\u7B46    CA\u8ECAPA\u7121\u6483\u88C1\u624B\u9ED2\u7B46\nLAU\u5F13LAILY\u6A4B\u4E00    LE\u5F13LILU\u6A4B\u56DB\nLY\u5F13LU\u7121\u6483\u88C1\u624B\u8D64\u5F13    LI\u5175LU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\n\u9ED2\u5F13CY    \u9ED2\u5F13CU\nCY\u5F13CU\u7121\u6483\u88C1\u624B\u9ED2\u5F13    CI\u5175CU\u7121\u6483\u88C1\u624B\u9ED2\u5F13\n\u9ED2\u5F13MI    XA\u738BCE\u7121\u6483\u88C1\nMI\u5F13MA\u7121\u6483\u88C1\u624B\u8D64\u99AC    CE\u738BMA\u7121\u6483\u88C1\u624B\u9ED2\u5F13\nTAU\u864EZAITY\u7121\u6483\u88C1    NI\u5175NO\u6C34\u4E09\nTY\u864ENOLU\u7121\u6483\u88C1\u624B\u8D64\u5175\n\n\u6216\u70BA\u540C\u8272\u99AC\u5F13\u5175\u800C\u624B\u4E03\n\u7D42\u5B63    \u79CB\u7D42\n\n\n\u661F\u4E00\u5468";
    (0, draw_1.drawEmptyBoard)();
    var turn_slider = document.getElementById("turn_slider");
    turn_slider.min = "1";
    turn_slider.max = "45";
    turn_slider.value = "29";
    (0, draw_1.drawGameState)((0, state_1.getNthState)(29));
    turn_slider.oninput = function () {
        (0, draw_1.drawGameState)((0, state_1.getNthState)(Number(turn_slider.value)));
    };
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxtRUFBa0Y7QUFFckUsY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGtCQUFVLEdBQUcsRUFBRSxDQUFDO0FBRTdCLFNBQWdCLGNBQWM7SUFDMUIsSUFBTSxHQUFHLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRXBGLEtBQUs7SUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdB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QUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDOUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsR0FBRztnQkFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDOUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM5QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzlDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDOUM7U0FDRDtRQUNELE9BQU8sRUFBRTtZQUNSLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQzlDLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNsQyxLQUFLLEVBQUUsRUFBRTtTQUNUO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7WUFDN0MsV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNqQyxRQUFRLEVBQUUsRUFBRTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1Q7S0FDRDtBQUNGLENBQUM7QUFFRCxTQUFnQixXQUFXLENBQUMsQ0FBUztJQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDWCxPQUFPLGVBQWUsQ0FBQztZQUN0QixPQUFPLEVBQUU7Z0JBQ1IsaUJBQWlCLEVBQUUsR0FBRztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ1AsaUJBQWlCLEVBQUUsR0FBRztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbEI7U0FDRCxDQUFDO0tBQ0Y7SUFDRCxPQUFPO1FBQ04sTUFBTSxFQUFFLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQztRQUNQLElBQUksRUFBRSxDQUFDO1FBQ1AsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNqQixLQUFLLEVBQUU7WUFDTixDQUFDLEVBQUU7Z0JBQ0YsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQzdDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7YUFDNUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQzVDO1lBQ0QsQ0FBQyxFQUFFO2dCQUNGLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM3QztZQUNELENBQUMsRUFBRTtnQkFDRixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM3QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM3QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7YUFDNUM7WUFDRCxDQUFDLEVBQUU7Z0JBQ0YsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzdDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTthQUM1QztZQUNELENBQUMsRUFBRTtnQkFDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDN0M7U0FDRDtRQUNELE9BQU8sRUFBRTtZQUNSLGlCQUFpQixFQUFFLEdBQUc7WUFDdEIsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ3RELFdBQVcsRUFBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxFQUFFO1NBQ1Q7UUFDRCxNQUFNLEVBQUU7WUFDUCxpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDaEcsS0FBSyxFQUFFLEVBQUU7U0FDVDtLQUVELENBQUM7QUFFSCxDQUFDO0FBbkdELGtDQW1HQzs7Ozs7Ozs7Ozs7Ozs7QUNuTVksYUFBSyxHQUE0QjtJQUM3QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7Q0FDMUQsQ0FBQzs7Ozs7OztVQ1BGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3JCQSxnRUFBdUQ7QUFDdkQsbUVBQXNDO0FBRXRDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7SUFDNUIsSUFBTSxLQUFLLEdBQ2QsbWdGQStDRyxDQUFDO0lBRUQseUJBQWMsR0FBRSxDQUFDO0lBQ2pCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFzQixDQUFDO0lBQ2hGLFdBQVcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLHdCQUFhLEVBQUMsdUJBQVcsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLFdBQVcsQ0FBQyxPQUFPLEdBQUc7UUFDbEIsd0JBQWEsRUFBQyx1QkFBVyxFQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3cgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5pbXBvcnQgeyBOb25UYW1QaWVjZSwgU3RhdGUsIEhhbnppUHJvZmVzc2lvbkFuZFRhbSwgcHJvZnMsIEJvYXJkIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBoZWlnaHQgPSAzODc7XHJcbmV4cG9ydCBjb25zdCBsZWZ0X21hcmdpbiA9IDQwO1xyXG5leHBvcnQgY29uc3QgdG9wX21hcmdpbiA9IDQwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdFbXB0eUJvYXJkKCkge1xyXG4gICAgY29uc3QgY3R4ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3ZcIikhIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG5cclxuICAgIC8vIOeah+WHplxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDI3LCA1NC41JSwgODEuMSUpXCJcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG5cclxuICAgIC8vIOeah+awtFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDIxMywgMzMuNiUsIDc4LjklKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIC8vIOeah+WxsVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiaHNsKDEyOSwgMzguNSUsIDQ1LjQlKVwiO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYig5OSwgOTksIDk5KSc7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMC4wMyAqIGhlaWdodCAvIDk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyAwLCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBoZWlnaHQsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMCk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGkgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsMCwwKVwiO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIlVcIiwgXCJPXCIsIFwiWVwiLCBcIkFJXCIsIFwiQVVcIiwgXCJJQVwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIGxlZnRfbWFyZ2luICsgaGVpZ2h0ICsgMTAsIHRvcF9tYXJnaW4gKyAzMCArIDQzICogaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm93cyA9IFtcIktcIiwgXCJMXCIsIFwiTlwiLCBcIlRcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJNXCIsIFwiUFwiXTtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCBsZWZ0X21hcmdpbiArIDIwICsgNDMgKiBpLCB0b3BfbWFyZ2luIC0gMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5zYXZlKCk7XHJcblxyXG4gICAgY3R4LnJvdGF0ZShNYXRoLlBJKTtcclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCAtbGVmdF9tYXJnaW4gKyAxMCwgLSh0b3BfbWFyZ2luICsgMTUgKyA0MyAqIGkpKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgLShsZWZ0X21hcmdpbiArIDIwICsgNDMgKiBpKSwgLSh0b3BfbWFyZ2luICsgaGVpZ2h0ICsgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdQaWVjZXNPbkJvYXJkKGJvYXJkOiBCb2FyZCwgZm9jdXM6IFtBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3ddIHwgbnVsbCkge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGNvbnN0IGNsbSBpbiBib2FyZCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcncgaW4gYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc19mb2N1c2VkID0gZm9jdXMgPyBmb2N1c1swXSA9PSBjbG0gJiYgZm9jdXNbMV0gPT0gcncgOiBmYWxzZTtcclxuICAgICAgICAgICAgYW5zICs9IHBvc2l0aW9uUGllY2VPbkJvYXJkKFxyXG4gICAgICAgICAgICAgICAgY2xtIGFzIEFic29sdXRlQ29sdW1uLFxyXG4gICAgICAgICAgICAgICAgcncgYXMgQWJzb2x1dGVSb3csXHJcbiAgICAgICAgICAgICAgICBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dIVtydyBhcyBBYnNvbHV0ZVJvd10hLFxyXG4gICAgICAgICAgICAgICAgaXNfZm9jdXNlZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpZWNlc19pbm5lclwiKSEuaW5uZXJIVE1MID0gYW5zO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SG9wMVp1bzFIVE1MKHBpZWNlczogTm9uVGFtUGllY2VbXSkge1xyXG4gICAgbGV0IGFucyA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHByb2YgfSA9IHBpZWNlc1tpXTtcclxuICAgICAgICBhbnMgKz0gYDxsaT48ZGl2IHN0eWxlPVwid2lkdGg6IDIzcHg7IGhlaWdodDogNDNweDsgdHJhbnNmb3JtOiBzY2FsZSgwLjI2KTsgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnRcIj4ke3JlbmRlck5vcm1hbFBpZWNlKGNvbG9yLCBwcm9mLCBmYWxzZSl9PC9kaXY+PC9saT5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdHYW1lU3RhdGUoU1RBVEU6IFN0YXRlKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXNvbl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5zZWFzb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUudHVybiArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhdGVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUucmF0ZSArIFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGllY2Vfc3RhbmRcIikhLmlubmVySFRNTCA9IGdldEhvcDFadW8xSFRNTChTVEFURS5hX3NpZGUuaG9wMXp1bzEpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuaWFfc2lkZS5ob3AxenVvMSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX2N1cnJlbnRfc2NvcmVcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUuc2NvcmUgKyBcIlwiO1xyXG4gICAgZHJhd1BpZWNlc09uQm9hcmQoU1RBVEUuYm9hcmQsIFNUQVRFLmZvY3VzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyTm9ybWFsUGllY2UoY29sb3I6IFwi6buSXCIgfCBcIui1pFwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb25BbmRUYW0sIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHggPSBwcm9mcy5pbmRleE9mKHByb2YpICogLTEwMCAtIDI3O1xyXG4gICAgY29uc3QgeSA9IGlzX2JvbGQgPyAwIDogLTI3NztcclxuICAgIGNvbnN0IGNvbG9yX3BhdGggPSB7XHJcbiAgICAgICAgXCLpu5JcIjogXCLjgrTjgrfjg4Pjgq/pp5JcIixcclxuICAgICAgICBcIui1pFwiOiBcIuOCtOOCt+ODg+OCr+mnkl/otaRcIixcclxuICAgIH1bY29sb3JdO1xyXG4gICAgcmV0dXJuIGA8ZGl2XHJcbiAgICBzdHlsZT1cIndpZHRoOiA4N3B4OyBoZWlnaHQ6IDg3cHg7IGJhY2tncm91bmQtcG9zaXRpb24teDogJHt4fXB4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXk6ICR7eX1weDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7Y29sb3JfcGF0aH0uc3ZnKTsgXCI+XHJcbjwvZGl2PmBcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHBvc2l0aW9uUGllY2VPbkJvYXJkKGNsbTogQWJzb2x1dGVDb2x1bW4sIHJ3OiBBYnNvbHV0ZVJvdywgcGllY2U6IE5vblRhbVBpZWNlIHwgXCLnmodcIiwgaXNfYm9sZDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgY29sdW1uID0ge1xyXG4gICAgICAgIEs6IDAsXHJcbiAgICAgICAgTDogMSxcclxuICAgICAgICBOOiAyLFxyXG4gICAgICAgIFQ6IDMsXHJcbiAgICAgICAgWjogNCxcclxuICAgICAgICBYOiA1LFxyXG4gICAgICAgIEM6IDYsXHJcbiAgICAgICAgTTogNyxcclxuICAgICAgICBQOiA4XHJcbiAgICB9W2NsbV07XHJcbiAgICBjb25zdCByb3cgPSB7XHJcbiAgICAgICAgSUE6IDgsXHJcbiAgICAgICAgQVU6IDcsXHJcbiAgICAgICAgQUk6IDYsIFk6IDUsIE86IDQsIFU6IDMsIEk6IDIsIEU6IDEsIEE6IDBcclxuICAgIH1bcnddO1xyXG4gICAgY29uc3QgbGVmdCA9IGxlZnRfbWFyZ2luICsgNDMgKiAoY29sdW1uIC0gMC41KTtcclxuICAgIGNvbnN0IHRvcCA9IHRvcF9tYXJnaW4gKyA0MyAqIChyb3cgLSAwLjUpO1xyXG4gICAgaWYgKHBpZWNlID09PSBcIueah1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtcInJvdGF0ZSg5MGRlZylcIn1cIj5cclxuICAgICAgICAgICAgJHtyZW5kZXJOb3JtYWxQaWVjZShcIum7klwiLCBcIueah1wiLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mLCBpc19hc2lkZSB9ID0gcGllY2U7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAke2xlZnR9cHg7IHRvcDogJHt0b3B9cHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNikgJHtpc19hc2lkZSA/IFwicm90YXRlKDE4MGRlZylcIiA6IFwiXCJ9XCI+XHJcbiAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoY29sb3IsIHByb2YsIGlzX2JvbGQpfVxyXG4gICAgICAgIDwvZGl2PmA7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFN0YXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShvOiB7XHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmdcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0fSxcclxufSk6IFN0YXRlIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2Vhc29uOiBcIuaYpVwiLFxyXG5cdFx0dHVybjogMSxcclxuXHRcdHJhdGU6IDEsXHJcblx0XHRmb2N1czogbnVsbCxcclxuXHRcdGJvYXJkOiB7XHJcblx0XHRcdEs6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0TDoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHROOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdFQ6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0Wjoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRPOiBcIueah1wiLFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdFg6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fSxcclxuXHRcdFx0Qzoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRNOiB7XHJcblx0XHRcdFx0QTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdFA6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0STogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0QVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGlhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0aG9wMXp1bzE6IFtdLFxyXG5cdFx0XHRwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRzY29yZTogMjAsXHJcblx0XHR9LFxyXG5cdFx0YV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBvLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuXHRcdFx0cGxheWVyX25hbWU6IG8uYV9zaWRlLnBsYXllcl9uYW1lLFxyXG5cdFx0XHRob3AxenVvMTogW10sXHJcblx0XHRcdHNjb3JlOiAyMCxcclxuXHRcdH0sXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnRoU3RhdGUobjogbnVtYmVyKTogU3RhdGUge1xyXG5cdGlmIChuID09IDEpIHtcclxuXHRcdHJldHVybiBnZXRJbml0aWFsU3RhdGUoe1xyXG5cdFx0XHRpYV9zaWRlOiB7XHJcblx0XHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IFwi562GXCIsXHJcblx0XHRcdFx0cGxheWVyX25hbWU6IFwi562G5aKo6aKoXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0YV9zaWRlOiB7XHJcblx0XHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IFwi5pifXCIsXHJcblx0XHRcdFx0cGxheWVyX25hbWU6IFwi5pif5Lqr6Z2SXCIsXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cdHJldHVybiB7XHJcblx0XHRzZWFzb246IFwi56eLXCIsXHJcblx0XHR0dXJuOiBuLFxyXG5cdFx0cmF0ZTogNCxcclxuXHRcdGZvY3VzOiBbXCJQXCIsIFwiT1wiXSxcclxuXHRcdGJvYXJkOiB7XHJcblx0XHRcdEM6IHtcclxuXHRcdFx0XHRBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdFU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0WTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdEs6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0VTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRMOiB7XHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcblx0XHRcdH0sXHJcblx0XHRcdE06IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRPOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHROOiB7XHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdFk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9XHJcblx0XHRcdH0sXHJcblx0XHRcdFA6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0SUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdFU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0TzogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdFQ6IHtcclxuXHRcdFx0XHRBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcblx0XHRcdFx0RTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcblx0XHRcdH0sXHJcblx0XHRcdFg6IHtcclxuXHRcdFx0XHRBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuXHRcdFx0XHRFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG5cdFx0XHRcdEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Wjoge1xyXG5cdFx0XHRcdEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0QUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG5cdFx0XHRcdElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuXHRcdFx0XHRPOiBcIueah1wiLFxyXG5cdFx0XHRcdFU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6Ii5XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcblx0XHRcdFx0WTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH1cclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRpYV9zaWRlOiB7XHJcblx0XHRcdHBsYXllcl9uYW1lX3Nob3J0OiBcIuethlwiLFxyXG5cdFx0XHRob3AxenVvMTogW3sgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9XSxcclxuXHRcdFx0cGxheWVyX25hbWU6IFwi562G5aKo6aKoXCIsXHJcblx0XHRcdHNjb3JlOiAyOCxcclxuXHRcdH0sXHJcblx0XHRhX3NpZGU6IHtcclxuXHRcdFx0cGxheWVyX25hbWVfc2hvcnQ6IFwi5pifXCIsXHJcblx0XHRcdHBsYXllcl9uYW1lOiBcIuaYn+S6q+mdklwiLFxyXG5cdFx0XHRob3AxenVvMTogW3sgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sIHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH1dLFxyXG5cdFx0XHRzY29yZTogMTIsXHJcblx0XHR9LFxyXG5cclxuXHR9O1xyXG5cclxufSIsImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdyB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVByb2Zlc3Npb24gPSBcIuiIuVwiIHwgXCLnhKFcIiB8IFwi5YW1XCIgfCBcIuW8k1wiIHwgXCLou4pcIiB8IFwi6JmOXCIgfCBcIummrFwiIHwgXCLnrYZcIiB8IFwi5berXCIgfCBcIuWwhlwiIHwgXCLnjotcIjtcclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uQW5kVGFtID0gSGFuemlQcm9mZXNzaW9uIHwgXCLnmodcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9mczogSGFuemlQcm9mZXNzaW9uQW5kVGFtW10gPSBbXHJcblx0XCLoiLlcIiwgXCLnhKFcIiwgXCLlhbVcIiwgXCLlvJNcIiwgXCLou4pcIiwgXCLomY5cIiwgXCLppqxcIiwgXCLnrYZcIiwgXCLlt6tcIiwgXCLlsIZcIiwgXCLnjotcIiwgXCLnmodcIlxyXG5dO1xyXG5cclxuZXhwb3J0IHR5cGUgQm9hcmQgPSB7IFtrZXkgaW4gQWJzb2x1dGVDb2x1bW5dPzogeyBba2V5IGluIEFic29sdXRlUm93XT86IE5vblRhbVBpZWNlIHwgXCLnmodcIiB9IH07XHJcblxyXG5leHBvcnQgdHlwZSBIYW56aVNlYXNvbiA9IFwi5pilXCIgfCBcIuWkj1wiIHwgXCLnp4tcIiB8IFwi5YasXCI7XHJcbmV4cG9ydCB0eXBlIFJhdGUgPSAxIHwgMiB8IDQgfCA4IHwgMTYgfCAzMiB8IDY0O1xyXG5cclxuZXhwb3J0IHR5cGUgU3RhdGUgPSB7XHJcblx0c2Vhc29uOiBIYW56aVNlYXNvbixcclxuXHR0dXJuOiBudW1iZXIsXHJcblx0cmF0ZTogUmF0ZSxcclxuXHRmb2N1czogW0Fic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvd10gfCBudWxsLFxyXG5cdGJvYXJkOiBCb2FyZCxcclxuXHRpYV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0aG9wMXp1bzE6IE5vblRhbVBpZWNlW10sXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0c2NvcmU6IG51bWJlcixcclxuXHR9LFxyXG5cdGFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcblx0XHRob3AxenVvMTogTm9uVGFtUGllY2VbXSxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBOb25UYW1QaWVjZSA9IHsgY29sb3I6IFwi6LWkXCIgfCBcIum7klwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IGdldE50aFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGNhc2UxID1cclxuXHRge+S4gOS9jeiJsjrpu5Lpu5Lpu5J9XHJcbnvlp4vmmYI6MjAyMi0wNS0zMVQxNzoxNjowMi40MzNafVxyXG5757WC5pmCOjIwMjItMDUtMzFUMTg6MTM6NTIuMzU3Wn1cclxuTUFV5byTTUFJTVnmqYvkupQgICAgUEXlt6tQSVBV54Sh5pKD6KOBXHJcbkNBSeWFtUNBVeeEoeaSg+ijgSAgICBNReW8k0NF54Sh5pKD6KOBXHJcblBBVeW3q0NBVUNBSeeEoeaSg+ijgSAgICBaQeeOi1pF54Sh5pKD6KOBXHJcbk1Z5byTTUlNQeapi+S4gOatpOeEoSAgICBDSeWFtU1JTVXnhKHmkoPoo4FcclxuQ0FJ5berQ0FNQeapi+S4gOaJi+i1pOmmrCAgICBQQeethk1B54Sh5pKD6KOB5omL6LWk5berXHJcbkxBVeW8k0xBSUxZ5qmL5LiJICAgIFRF6JmOTklUVeapi+S4gFxyXG5MWeW8k0xJTEXmqYvkuInmiYvotaTlvJMgICAgS0HnrYZLRUxF54Sh5pKD6KOB5omL6buS5byTXHJcbk1Z5byTTVXnhKHmkoPoo4HmiYvpu5LlhbVcclxuXHJcbuaIlueCuummrOW8k+WFteiAjOaJi+S6lFxyXG7ntYLlraMgICAg5pil57WCXHJcblxyXG5NQVXlvJNNQUlNWeapi+S4iSAgICBYReiZjlpJWFXnhKHmkoPoo4FcclxuWEFJ5YW1WFnnhKHmkoPoo4EgICAgWFXomY5NWeeEoeaSg+ijgeaJi+i1pOW8k1xyXG5YQVXomY5DQUlNWeapi+Wbm+aJi+m7kuiZjiAgICBNReW8k01JTVXmqYvkuIlcclxuS0FV5berS0FJS1nnhKHmkoPoo4EgICAgWk/nmodbVFVdWklaRVxyXG5QQVXlt6taQVXnhKHmkoPoo4EgICAgQ0nlhbVDReeEoeaSg+ijgVxyXG5aQUnoiLlaSeeEoeaSg+ijgeaJi+i1pOiIuSAgICBUReiZjlpJ5rC05LqM5q2k54ShXHJcblpF55qHVElbTlVdTE8gICAgWEHlsIZaReeEoeaSg+ijgVxyXG5aSeiIuVpFWkHmqYvlm5vmiYvotaTnjotcclxuXHJcbuaIlueCuueOi+WKoOeNo+iAjOaJi+WFq1xyXG7ntYLlraMgICAg5aSP57WCXHJcblxyXG5NQVXlvJNNQUlNWeapi+S6jCAgICBNReW8k01JTVXmqYvkuIlcclxuQ0FJ5YW1Q0FV54Sh5pKD6KOBICAgIFhF6JmOWklYVeeEoeaSg+ijgVxyXG5NWeW8k01V54Sh5pKD6KOB5omL6buS5byTICAgIE1J5YW1TVXnhKHmkoPoo4HmiYvotaTlvJNcclxuUEFV5berQ0FVQ0FJ54Sh5pKD6KOBICAgIFpB546LWkXnhKHmkoPoo4FcclxuQ0FJ5berQ0FYQeapi+S4ieaJi+i1pOWwhiAgICBaReeOi1hB54Sh5pKD6KOB5omL6LWk5berXHJcblBJQeethlBBSVBZ5qmL5LiAICAgIFBF5berWkXnhKHmkoPoo4FcclxuUFnnrYZQSVBB5qmL5LqM5omL6LWk562GICAgIENB6LuKUEHnhKHmkoPoo4HmiYvpu5LnrYZcclxuTEFV5byTTEFJTFnmqYvkuIAgICAgTEXlvJNMSUxV5qmL5ZubXHJcbkxZ5byTTFXnhKHmkoPoo4HmiYvotaTlvJMgICAgTEnlhbVMVeeEoeaSg+ijgeaJi+m7kuW8k1xyXG7pu5LlvJNDWSAgICDpu5LlvJNDVVxyXG5DWeW8k0NV54Sh5pKD6KOB5omL6buS5byTICAgIENJ5YW1Q1XnhKHmkoPoo4HmiYvpu5LlvJNcclxu6buS5byTTUkgICAgWEHnjotDReeEoeaSg+ijgVxyXG5NSeW8k01B54Sh5pKD6KOB5omL6LWk6aasICAgIENF546LTUHnhKHmkoPoo4HmiYvpu5LlvJNcclxuVEFV6JmOWkFJVFnnhKHmkoPoo4EgICAgTknlhbVOT+awtOS4iVxyXG5UWeiZjk5PTFXnhKHmkoPoo4HmiYvotaTlhbVcclxuXHJcbuaIlueCuuWQjOiJsummrOW8k+WFteiAjOaJi+S4g1xyXG7ntYLlraMgICAg56eL57WCXHJcblxyXG5cclxu5pif5LiA5ZGoYDtcclxuXHJcbiAgICBkcmF3RW1wdHlCb2FyZCgpO1xyXG4gICAgY29uc3QgdHVybl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm5fc2xpZGVyXCIpISBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdHVybl9zbGlkZXIubWluID0gXCIxXCI7XHJcbiAgICB0dXJuX3NsaWRlci5tYXggPSBcIjQ1XCI7XHJcbiAgICB0dXJuX3NsaWRlci52YWx1ZSA9IFwiMjlcIjtcclxuICAgIGRyYXdHYW1lU3RhdGUoZ2V0TnRoU3RhdGUoMjkpKTtcclxuICAgIHR1cm5fc2xpZGVyLm9uaW5wdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgZHJhd0dhbWVTdGF0ZShnZXROdGhTdGF0ZShOdW1iZXIodHVybl9zbGlkZXIudmFsdWUpKSk7XHJcbiAgICB9XHJcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
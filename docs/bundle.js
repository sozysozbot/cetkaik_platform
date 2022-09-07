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
window.addEventListener('load', function () {
    (0, draw_1.drawEmptyBoard)();
    var turn_slider = document.getElementById("turn_slider");
    turn_slider.min = "1";
    turn_slider.max = "45";
    turn_slider.value = "29";
    (0, draw_1.drawGameState)(getNthState(29));
    turn_slider.oninput = function () {
        (0, draw_1.drawGameState)(getNthState(Number(turn_slider.value)));
    };
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxtRUFBa0Y7QUFFckUsY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGtCQUFVLEdBQUcsRUFBRSxDQUFDO0FBRTdCLFNBQWdCLGNBQWM7SUFDMUIsSUFBTSxHQUFHLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRXBGLEtBQUs7SUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdB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QUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsR0FBRztnQkFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7U0FDSjtRQUNELE9BQU8sRUFBRTtZQUNMLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQzlDLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNsQyxLQUFLLEVBQUUsRUFBRTtTQUNaO1FBQ0QsTUFBTSxFQUFFO1lBQ0osaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7WUFDN0MsV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNqQyxRQUFRLEVBQUUsRUFBRTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1o7S0FDSjtBQUNMLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxDQUFTO0lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNSLE9BQU8sZUFBZSxDQUFDO1lBQ25CLE9BQU8sRUFBRTtnQkFDTCxpQkFBaUIsRUFBRSxHQUFHO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNyQjtZQUNELE1BQU0sRUFBRTtnQkFDSixpQkFBaUIsRUFBRSxHQUFHO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNyQjtTQUNKLENBQUM7S0FDTDtJQUNELE9BQU87UUFDSCxNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxDQUFDO1FBQ1AsSUFBSSxFQUFFLENBQUM7UUFDUCxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ2pCLEtBQUssRUFBRTtZQUNILENBQUMsRUFBRTtnQkFDQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDaEQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTthQUMvQztZQUNELENBQUMsRUFBRTtnQkFDQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7YUFDL0M7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2hEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2hEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2hEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTthQUMvQztZQUNELENBQUMsRUFBRTtnQkFDQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDN0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQy9DO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNoRDtTQUNKO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsaUJBQWlCLEVBQUUsR0FBRztZQUN0QixRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDdEQsV0FBVyxFQUFFLEtBQUs7WUFDbEIsS0FBSyxFQUFFLEVBQUU7U0FDWjtRQUNELE1BQU0sRUFBRTtZQUNKLGlCQUFpQixFQUFFLEdBQUc7WUFDdEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUNoRyxLQUFLLEVBQUUsRUFBRTtTQUNaO0tBRUosQ0FBQztBQUVOLENBQUM7QUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0lBQzVCLHlCQUFjLEdBQUUsQ0FBQztJQUNqQixJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBc0IsQ0FBQztJQUNoRixXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUN0QixXQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztJQUN2QixXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN6Qix3QkFBYSxFQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLFdBQVcsQ0FBQyxPQUFPLEdBQUc7UUFDbEIsd0JBQWEsRUFBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2RyYXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93IH0gZnJvbSBcImNlcmtlX29ubGluZV9hcGlcIjtcclxuaW1wb3J0IHsgTm9uVGFtUGllY2UsIFN0YXRlLCBIYW56aVByb2Zlc3Npb25BbmRUYW0sIHByb2ZzLCBCb2FyZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaGVpZ2h0ID0gMzg3O1xyXG5leHBvcnQgY29uc3QgbGVmdF9tYXJnaW4gPSA0MDtcclxuZXhwb3J0IGNvbnN0IHRvcF9tYXJnaW4gPSA0MDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3RW1wdHlCb2FyZCgpIHtcclxuICAgIGNvbnN0IGN0eCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN2XCIpISBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAvLyDnmoflh6ZcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyNywgNTQuNSUsIDgxLjElKVwiXHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuXHJcbiAgICAvLyDnmofmsLRcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgyMTMsIDMzLjYlLCA3OC45JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIDUgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICAvLyDnmoflsbFcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImhzbCgxMjksIDM4LjUlLCA0NS40JSlcIjtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNCAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoOTksIDk5LCA5OSknO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDAuMDMgKiBoZWlnaHQgLyA5O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgMCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaGVpZ2h0LCB0b3BfbWFyZ2luICsgaSAqIGhlaWdodCAvIDkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8obGVmdF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5mb250ID0gXCIyMHB4IHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigwLDAsMClcIjtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBbXCJBXCIsIFwiRVwiLCBcIklcIiwgXCJVXCIsIFwiT1wiLCBcIllcIiwgXCJBSVwiLCBcIkFVXCIsIFwiSUFcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChjb2x1bW5zW2ldLCBsZWZ0X21hcmdpbiArIGhlaWdodCArIDEwLCB0b3BfbWFyZ2luICsgMzAgKyA0MyAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBbXCJLXCIsIFwiTFwiLCBcIk5cIiwgXCJUXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiTVwiLCBcIlBcIl07XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQocm93c1tpXSwgbGVmdF9tYXJnaW4gKyAyMCArIDQzICogaSwgdG9wX21hcmdpbiAtIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGN0eC5yb3RhdGUoTWF0aC5QSSk7XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgLWxlZnRfbWFyZ2luICsgMTAsIC0odG9wX21hcmdpbiArIDE1ICsgNDMgKiBpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIC0obGVmdF9tYXJnaW4gKyAyMCArIDQzICogaSksIC0odG9wX21hcmdpbiArIGhlaWdodCArIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3UGllY2VzT25Cb2FyZChib2FyZDogQm9hcmQsIGZvY3VzOiBbQWJzb2x1dGVDb2x1bW4sIEFic29sdXRlUm93XSB8IG51bGwpIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChjb25zdCBjbG0gaW4gYm9hcmQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHJ3IGluIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNfZm9jdXNlZCA9IGZvY3VzID8gZm9jdXNbMF0gPT0gY2xtICYmIGZvY3VzWzFdID09IHJ3IDogZmFsc2U7XHJcbiAgICAgICAgICAgIGFucyArPSBwb3NpdGlvblBpZWNlT25Cb2FyZChcclxuICAgICAgICAgICAgICAgIGNsbSBhcyBBYnNvbHV0ZUNvbHVtbixcclxuICAgICAgICAgICAgICAgIHJ3IGFzIEFic29sdXRlUm93LFxyXG4gICAgICAgICAgICAgICAgYm9hcmRbY2xtIGFzIEFic29sdXRlQ29sdW1uXSFbcncgYXMgQWJzb2x1dGVSb3ddISxcclxuICAgICAgICAgICAgICAgIGlzX2ZvY3VzZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVjZXNfaW5uZXJcIikhLmlubmVySFRNTCA9IGFucztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEhvcDFadW8xSFRNTChwaWVjZXM6IE5vblRhbVBpZWNlW10pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB7IGNvbG9yLCBwcm9mIH0gPSBwaWVjZXNbaV07XHJcbiAgICAgICAgYW5zICs9IGA8bGk+PGRpdiBzdHlsZT1cIndpZHRoOiAyM3B4OyBoZWlnaHQ6IDQzcHg7IHRyYW5zZm9ybTogc2NhbGUoMC4yNik7IHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0XCI+JHtyZW5kZXJOb3JtYWxQaWVjZShjb2xvciwgcHJvZiwgZmFsc2UpfTwvZGl2PjwvbGk+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3R2FtZVN0YXRlKFNUQVRFOiBTdGF0ZSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFzb25fdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuc2Vhc29uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnR1cm4gKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYXRlX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnJhdGUgKyBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3Nob3J0X3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWVfc2hvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9wbGF5ZXJfbmFtZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5hX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuaWFfc2lkZS5wbGF5ZXJfbmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYV9zaWRlX3BpZWNlX3N0YW5kXCIpIS5pbm5lckhUTUwgPSBnZXRIb3AxWnVvMUhUTUwoU1RBVEUuYV9zaWRlLmhvcDF6dW8xKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gZ2V0SG9wMVp1bzFIVE1MKFNUQVRFLmlhX3NpZGUuaG9wMXp1bzEpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfY3VycmVudF9zY29yZVwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9jdXJyZW50X3Njb3JlXCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnNjb3JlICsgXCJcIjtcclxuICAgIGRyYXdQaWVjZXNPbkJvYXJkKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck5vcm1hbFBpZWNlKGNvbG9yOiBcIum7klwiIHwgXCLotaRcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcclxuICAgIGNvbnN0IHkgPSBpc19ib2xkID8gMCA6IC0yNzc7XHJcbiAgICBjb25zdCBjb2xvcl9wYXRoID0ge1xyXG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXHJcbiAgICAgICAgXCLotaRcIjogXCLjgrTjgrfjg4Pjgq/pp5Jf6LWkXCIsXHJcbiAgICB9W2NvbG9yXTtcclxuICAgIHJldHVybiBgPGRpdlxyXG4gICAgc3R5bGU9XCJ3aWR0aDogODdweDsgaGVpZ2h0OiA4N3B4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6ICR7eH1weDsgYmFja2dyb3VuZC1wb3NpdGlvbi15OiAke3l9cHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgke2NvbG9yX3BhdGh9LnN2Zyk7IFwiPlxyXG48L2Rpdj5gXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwb3NpdGlvblBpZWNlT25Cb2FyZChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjbG1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W3J3XTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIDQzICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgNDMgKiAocm93IC0gMC41KTtcclxuICAgIGlmIChwaWVjZSA9PT0gXCLnmodcIikge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7XCJyb3RhdGUoOTBkZWcpXCJ9XCI+XHJcbiAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke3JlbmRlck5vcm1hbFBpZWNlKGNvbG9yLCBwcm9mLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3cgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uID0gXCLoiLlcIiB8IFwi54ShXCIgfCBcIuWFtVwiIHwgXCLlvJNcIiB8IFwi6LuKXCIgfCBcIuiZjlwiIHwgXCLppqxcIiB8IFwi562GXCIgfCBcIuW3q1wiIHwgXCLlsIZcIiB8IFwi546LXCI7XHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbkFuZFRhbSA9IEhhbnppUHJvZmVzc2lvbiB8IFwi55qHXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcHJvZnM6IEhhbnppUHJvZmVzc2lvbkFuZFRhbVtdID0gW1xyXG5cdFwi6Ii5XCIsIFwi54ShXCIsIFwi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi55qHXCJcclxuXTtcclxuXHJcbmV4cG9ydCB0eXBlIEJvYXJkID0geyBba2V5IGluIEFic29sdXRlQ29sdW1uXT86IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSB9O1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlTZWFzb24gPSBcIuaYpVwiIHwgXCLlpI9cIiB8IFwi56eLXCIgfCBcIuWGrFwiO1xyXG5leHBvcnQgdHlwZSBSYXRlID0gMSB8IDIgfCA0IHwgOCB8IDE2IHwgMzIgfCA2NDtcclxuXHJcbmV4cG9ydCB0eXBlIFN0YXRlID0ge1xyXG5cdHNlYXNvbjogSGFuemlTZWFzb24sXHJcblx0dHVybjogbnVtYmVyLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IFtBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3ddIHwgbnVsbCxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiBOb25UYW1QaWVjZVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdHNjb3JlOiBudW1iZXIsXHJcblx0fSxcclxuXHRhX3NpZGU6IHtcclxuXHRcdHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcblx0XHRwbGF5ZXJfbmFtZTogc3RyaW5nLFxyXG5cdFx0aG9wMXp1bzE6IE5vblRhbVBpZWNlW10sXHJcblx0XHRzY29yZTogbnVtYmVyLFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTm9uVGFtUGllY2UgPSB7IGNvbG9yOiBcIui1pFwiIHwgXCLpu5JcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uLCBpc19hc2lkZTogYm9vbGVhbiB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgQm9keUVsZW1lbnQgfSBmcm9tICdjZXJrZV9vbmxpbmVfa2lhYWtfcGFyc2VyJztcclxuaW1wb3J0IHsgZHJhd0VtcHR5Qm9hcmQsIGRyYXdHYW1lU3RhdGUgfSBmcm9tICcuL2RyYXcnO1xyXG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKG86IHtcclxuICAgIGlhX3NpZGU6IHtcclxuICAgICAgICBwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG4gICAgICAgIHBsYXllcl9uYW1lOiBzdHJpbmdcclxuICAgIH0sXHJcbiAgICBhX3NpZGU6IHtcclxuICAgICAgICBwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG4gICAgICAgIHBsYXllcl9uYW1lOiBzdHJpbmcsXHJcbiAgICB9LFxyXG59KTogU3RhdGUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZWFzb246IFwi5pilXCIsXHJcbiAgICAgICAgdHVybjogMSxcclxuICAgICAgICByYXRlOiAxLFxyXG4gICAgICAgIGZvY3VzOiBudWxsLFxyXG4gICAgICAgIGJvYXJkOiB7XHJcbiAgICAgICAgICAgIEs6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgTDoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBOOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVDoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBaOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIE86IFwi55qHXCIsXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFg6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQzoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE06IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUDoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpYV9zaWRlOiB7XHJcbiAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBvLmlhX3NpZGUucGxheWVyX25hbWVfc2hvcnQsXHJcbiAgICAgICAgICAgIGhvcDF6dW8xOiBbXSxcclxuICAgICAgICAgICAgcGxheWVyX25hbWU6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZSxcclxuICAgICAgICAgICAgc2NvcmU6IDIwLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYV9zaWRlOiB7XHJcbiAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBvLmFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuICAgICAgICAgICAgcGxheWVyX25hbWU6IG8uYV9zaWRlLnBsYXllcl9uYW1lLFxyXG4gICAgICAgICAgICBob3AxenVvMTogW10sXHJcbiAgICAgICAgICAgIHNjb3JlOiAyMCxcclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROdGhTdGF0ZShuOiBudW1iZXIpOiBTdGF0ZSB7XHJcbiAgICBpZiAobiA9PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldEluaXRpYWxTdGF0ZSh7XHJcbiAgICAgICAgICAgIGlhX3NpZGU6IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBcIuethlwiLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyX25hbWU6IFwi562G5aKo6aKoXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYV9zaWRlOiB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJfbmFtZV9zaG9ydDogXCLmmJ9cIixcclxuICAgICAgICAgICAgICAgIHBsYXllcl9uYW1lOiBcIuaYn+S6q+mdklwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2Vhc29uOiBcIueni1wiLFxyXG4gICAgICAgIHR1cm46IG4sXHJcbiAgICAgICAgcmF0ZTogNCxcclxuICAgICAgICBmb2N1czogW1wiUFwiLCBcIk9cIl0sXHJcbiAgICAgICAgYm9hcmQ6IHtcclxuICAgICAgICAgICAgQzoge1xyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgWTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEs6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBMOiB7XHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBNOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIE86IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE46IHtcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBZOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBQOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgTzogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFQ6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBYOiB7XHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFo6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBPOiBcIueah1wiLFxyXG4gICAgICAgICAgICAgICAgVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLoiLlcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpYV9zaWRlOiB7XHJcbiAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBcIuethlwiLFxyXG4gICAgICAgICAgICBob3AxenVvMTogW3sgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9XSxcclxuICAgICAgICAgICAgcGxheWVyX25hbWU6IFwi562G5aKo6aKoXCIsXHJcbiAgICAgICAgICAgIHNjb3JlOiAyOCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFfc2lkZToge1xyXG4gICAgICAgICAgICBwbGF5ZXJfbmFtZV9zaG9ydDogXCLmmJ9cIixcclxuICAgICAgICAgICAgcGxheWVyX25hbWU6IFwi5pif5Lqr6Z2SXCIsXHJcbiAgICAgICAgICAgIGhvcDF6dW8xOiBbeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSwgeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfV0sXHJcbiAgICAgICAgICAgIHNjb3JlOiAxMixcclxuICAgICAgICB9LFxyXG5cclxuICAgIH07XHJcblxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGRyYXdFbXB0eUJvYXJkKCk7XHJcbiAgICBjb25zdCB0dXJuX3NsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybl9zbGlkZXJcIikhIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICB0dXJuX3NsaWRlci5taW4gPSBcIjFcIjtcclxuICAgIHR1cm5fc2xpZGVyLm1heCA9IFwiNDVcIjtcclxuICAgIHR1cm5fc2xpZGVyLnZhbHVlID0gXCIyOVwiO1xyXG4gICAgZHJhd0dhbWVTdGF0ZShnZXROdGhTdGF0ZSgyOSkpO1xyXG4gICAgdHVybl9zbGlkZXIub25pbnB1dCA9ICgpID0+IHtcclxuICAgICAgICBkcmF3R2FtZVN0YXRlKGdldE50aFN0YXRlKE51bWJlcih0dXJuX3NsaWRlci52YWx1ZSkpKTtcclxuICAgIH1cclxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
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
            player_name: o.ia_side.player_name
        },
        a_side: {
            player_name_short: o.a_side.player_name_short,
            player_name: o.a_side.player_name,
            hop1zuo1: []
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
            player_name: "筆墨風"
        },
        a_side: {
            player_name_short: "星",
            player_name: "星享青",
            hop1zuo1: [{ color: "赤", prof: "兵", is_aside: true }, { color: "赤", prof: "虎", is_aside: true }]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxtRUFBa0Y7QUFFckUsY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLGtCQUFVLEdBQUcsRUFBRSxDQUFDO0FBRTdCLFNBQWdCLGNBQWM7SUFDMUIsSUFBTSxHQUFHLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRXBGLEtBQUs7SUFDTCxHQUFHLENBQUMsU0FBUyxHQUFHLHVCQUF1QjtJQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLGNBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUdoRyxLQUFLO0lBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQU0sR0FBRyxDQUFDLEVBQUUsa0JBQVUsR0FBRyxDQUFDLEdBQUcsY0FBTSxHQUFHLENBQUMsRUFBRSxjQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBVyxHQUFHLENBQUMsR0FBRyxjQUFNLEdBQUcsQ0FBQyxFQUFFLGtCQUFVLEdB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RSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsR0FBRztnQkFDTixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNqRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2pEO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDakQ7U0FDSjtRQUNELE9BQU8sRUFBRTtZQUNMLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQzlDLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVztTQUNyQztRQUNELE1BQU0sRUFBRTtZQUNKLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCO1lBQzdDLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFDakMsUUFBUSxFQUFFLEVBQUU7U0FDZjtLQUNKO0FBQ0wsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLENBQVM7SUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1IsT0FBTyxlQUFlLENBQUM7WUFDbkIsT0FBTyxFQUFFO2dCQUNMLGlCQUFpQixFQUFFLEdBQUc7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ3JCO1lBQ0QsTUFBTSxFQUFFO2dCQUNKLGlCQUFpQixFQUFFLEdBQUc7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ3JCO1NBQ0osQ0FBQztLQUNMO0lBQ0QsT0FBTztRQUNILE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLEVBQUUsQ0FBQztRQUNQLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDakIsS0FBSyxFQUFFO1lBQ0gsQ0FBQyxFQUFFO2dCQUNDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUNoRDtZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQy9DO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTthQUMvQztZQUNELENBQUMsRUFBRTtnQkFDQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDaEQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzlDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDaEQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDaEQ7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2FBQy9DO1lBQ0QsQ0FBQyxFQUFFO2dCQUNDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUM3QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDNUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7YUFDL0M7WUFDRCxDQUFDLEVBQUU7Z0JBQ0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUM5QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDOUMsQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQzVDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO2FBQ2hEO1NBQ0o7UUFDRCxPQUFPLEVBQUU7WUFDTCxpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN0RCxXQUFXLEVBQUUsS0FBSztTQUNyQjtRQUNELE1BQU0sRUFBRTtZQUNKLGlCQUFpQixFQUFFLEdBQUc7WUFDdEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNuRztLQUVKLENBQUM7QUFFTixDQUFDO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtJQUM1Qix5QkFBYyxHQUFFLENBQUM7SUFDakIsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQXNCLENBQUM7SUFDaEYsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDdEIsV0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDdkIsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDekIsd0JBQWEsRUFBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQixXQUFXLENBQUMsT0FBTyxHQUFHO1FBQ2xCLHdCQUFhLEVBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvdyB9IGZyb20gXCJjZXJrZV9vbmxpbmVfYXBpXCI7XHJcbmltcG9ydCB7IE5vblRhbVBpZWNlLCBTdGF0ZSwgSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBwcm9mcywgQm9hcmQgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGhlaWdodCA9IDM4NztcclxuZXhwb3J0IGNvbnN0IGxlZnRfbWFyZ2luID0gNDA7XHJcbmV4cG9ydCBjb25zdCB0b3BfbWFyZ2luID0gNDA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0VtcHR5Qm9hcmQoKSB7XHJcbiAgICBjb25zdCBjdHggPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdlwiKSEgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgLy8g55qH5YemXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjcsIDU0LjUlLCA4MS4xJSlcIlxyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAzICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDMgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgNSAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgNiAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA2ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuICAgIGN0eC5maWxsUmVjdChsZWZ0X21hcmdpbiArIDUgKiBoZWlnaHQgLyA5LCB0b3BfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIGhlaWdodCAvIDksIGhlaWdodCAvIDkpO1xyXG4gICAgY3R4LmZpbGxSZWN0KGxlZnRfbWFyZ2luICsgMyAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDYgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcblxyXG4gICAgLy8g55qH5rC0XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMjEzLCAzMy42JSwgNzguOSUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDIgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSk7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyAyICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCA1ICogaGVpZ2h0IC8gOSwgaGVpZ2h0IC8gOSk7XHJcblxyXG4gICAgLy8g55qH5bGxXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJoc2woMTI5LCAzOC41JSwgNDUuNCUpXCI7XHJcbiAgICBjdHguZmlsbFJlY3QobGVmdF9tYXJnaW4gKyA0ICogaGVpZ2h0IC8gOSwgdG9wX21hcmdpbiArIDQgKiBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5LCBoZWlnaHQgLyA5KTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDk5LCA5OSwgOTkpJztcclxuICAgIGN0eC5saW5lV2lkdGggPSAwLjAzICogaGVpZ2h0IC8gOTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA5OyBpKyspIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhsZWZ0X21hcmdpbiArIDAsIHRvcF9tYXJnaW4gKyBpICogaGVpZ2h0IC8gOSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhsZWZ0X21hcmdpbiArIGhlaWdodCwgdG9wX21hcmdpbiArIGkgKiBoZWlnaHQgLyA5KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyAwKTtcclxuICAgICAgICBjdHgubGluZVRvKGxlZnRfbWFyZ2luICsgaSAqIGhlaWdodCAvIDksIHRvcF9tYXJnaW4gKyBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZm9udCA9IFwiMjBweCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwwLDApXCI7XHJcbiAgICBjb25zdCBjb2x1bW5zID0gW1wiQVwiLCBcIkVcIiwgXCJJXCIsIFwiVVwiLCBcIk9cIiwgXCJZXCIsIFwiQUlcIiwgXCJBVVwiLCBcIklBXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFRleHQoY29sdW1uc1tpXSwgbGVmdF9tYXJnaW4gKyBoZWlnaHQgKyAxMCwgdG9wX21hcmdpbiArIDMwICsgNDMgKiBpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByb3dzID0gW1wiS1wiLCBcIkxcIiwgXCJOXCIsIFwiVFwiLCBcIlpcIiwgXCJYXCIsIFwiQ1wiLCBcIk1cIiwgXCJQXCJdO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHJvd3NbaV0sIGxlZnRfbWFyZ2luICsgMjAgKyA0MyAqIGksIHRvcF9tYXJnaW4gLSAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICBjdHgucm90YXRlKE1hdGguUEkpO1xyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGNvbHVtbnNbaV0sIC1sZWZ0X21hcmdpbiArIDEwLCAtKHRvcF9tYXJnaW4gKyAxNSArIDQzICogaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChyb3dzW2ldLCAtKGxlZnRfbWFyZ2luICsgMjAgKyA0MyAqIGkpLCAtKHRvcF9tYXJnaW4gKyBoZWlnaHQgKyAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd1BpZWNlc09uQm9hcmQoYm9hcmQ6IEJvYXJkLCBmb2N1czogW0Fic29sdXRlQ29sdW1uLCBBYnNvbHV0ZVJvd10gfCBudWxsKSB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAoY29uc3QgY2xtIGluIGJvYXJkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBydyBpbiBib2FyZFtjbG0gYXMgQWJzb2x1dGVDb2x1bW5dKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzX2ZvY3VzZWQgPSBmb2N1cyA/IGZvY3VzWzBdID09IGNsbSAmJiBmb2N1c1sxXSA9PSBydyA6IGZhbHNlO1xyXG4gICAgICAgICAgICBhbnMgKz0gcG9zaXRpb25QaWVjZU9uQm9hcmQoXHJcbiAgICAgICAgICAgICAgICBjbG0gYXMgQWJzb2x1dGVDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICBydyBhcyBBYnNvbHV0ZVJvdyxcclxuICAgICAgICAgICAgICAgIGJvYXJkW2NsbSBhcyBBYnNvbHV0ZUNvbHVtbl0hW3J3IGFzIEFic29sdXRlUm93XSEsXHJcbiAgICAgICAgICAgICAgICBpc19mb2N1c2VkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGllY2VzX2lubmVyXCIpIS5pbm5lckhUTUwgPSBhbnM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRIb3AxWnVvMUhUTUwocGllY2VzOiBOb25UYW1QaWVjZVtdKSB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiB9ID0gcGllY2VzW2ldO1xyXG4gICAgICAgIGFucyArPSBgPGxpPjxkaXYgc3R5bGU9XCJ3aWR0aDogMjNweDsgaGVpZ2h0OiA0M3B4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpOyB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdFwiPiR7cmVuZGVyTm9ybWFsUGllY2UoY29sb3IsIHByb2YsIGZhbHNlKX08L2Rpdj48L2xpPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0dhbWVTdGF0ZShTVEFURTogU3RhdGUpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Vhc29uX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLnNlYXNvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybl90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS50dXJuICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmF0ZV90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5yYXRlICsgXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWFfc2lkZV9wbGF5ZXJfbmFtZV9zaG9ydF90ZXh0XCIpIS5pbm5lckhUTUwgPSBTVEFURS5pYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGxheWVyX25hbWVfc2hvcnRfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhX3NpZGVfcGxheWVyX25hbWVfdGV4dFwiKSEuaW5uZXJIVE1MID0gU1RBVEUuYV9zaWRlLnBsYXllcl9uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpYV9zaWRlX3BsYXllcl9uYW1lX3RleHRcIikhLmlubmVySFRNTCA9IFNUQVRFLmlhX3NpZGUucGxheWVyX25hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFfc2lkZV9waWVjZV9zdGFuZFwiKSEuaW5uZXJIVE1MID0gZ2V0SG9wMVp1bzFIVE1MKFNUQVRFLmFfc2lkZS5ob3AxenVvMSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlhX3NpZGVfcGllY2Vfc3RhbmRcIikhLmlubmVySFRNTCA9IGdldEhvcDFadW8xSFRNTChTVEFURS5pYV9zaWRlLmhvcDF6dW8xKTtcclxuICAgIGRyYXdQaWVjZXNPbkJvYXJkKFNUQVRFLmJvYXJkLCBTVEFURS5mb2N1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck5vcm1hbFBpZWNlKGNvbG9yOiBcIum7klwiIHwgXCLotaRcIiwgcHJvZjogSGFuemlQcm9mZXNzaW9uQW5kVGFtLCBpc19ib2xkOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB4ID0gcHJvZnMuaW5kZXhPZihwcm9mKSAqIC0xMDAgLSAyNztcclxuICAgIGNvbnN0IHkgPSBpc19ib2xkID8gMCA6IC0yNzc7XHJcbiAgICBjb25zdCBjb2xvcl9wYXRoID0ge1xyXG4gICAgICAgIFwi6buSXCI6IFwi44K044K344OD44Kv6aeSXCIsXHJcbiAgICAgICAgXCLotaRcIjogXCLjgrTjgrfjg4Pjgq/pp5Jf6LWkXCIsXHJcbiAgICB9W2NvbG9yXTtcclxuICAgIHJldHVybiBgPGRpdlxyXG4gICAgc3R5bGU9XCJ3aWR0aDogODdweDsgaGVpZ2h0OiA4N3B4OyBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6ICR7eH1weDsgYmFja2dyb3VuZC1wb3NpdGlvbi15OiAke3l9cHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybCgke2NvbG9yX3BhdGh9LnN2Zyk7IFwiPlxyXG48L2Rpdj5gXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBwb3NpdGlvblBpZWNlT25Cb2FyZChjbG06IEFic29sdXRlQ29sdW1uLCBydzogQWJzb2x1dGVSb3csIHBpZWNlOiBOb25UYW1QaWVjZSB8IFwi55qHXCIsIGlzX2JvbGQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9IHtcclxuICAgICAgICBLOiAwLFxyXG4gICAgICAgIEw6IDEsXHJcbiAgICAgICAgTjogMixcclxuICAgICAgICBUOiAzLFxyXG4gICAgICAgIFo6IDQsXHJcbiAgICAgICAgWDogNSxcclxuICAgICAgICBDOiA2LFxyXG4gICAgICAgIE06IDcsXHJcbiAgICAgICAgUDogOFxyXG4gICAgfVtjbG1dO1xyXG4gICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgIElBOiA4LFxyXG4gICAgICAgIEFVOiA3LFxyXG4gICAgICAgIEFJOiA2LCBZOiA1LCBPOiA0LCBVOiAzLCBJOiAyLCBFOiAxLCBBOiAwXHJcbiAgICB9W3J3XTtcclxuICAgIGNvbnN0IGxlZnQgPSBsZWZ0X21hcmdpbiArIDQzICogKGNvbHVtbiAtIDAuNSk7XHJcbiAgICBjb25zdCB0b3AgPSB0b3BfbWFyZ2luICsgNDMgKiAocm93IC0gMC41KTtcclxuICAgIGlmIChwaWVjZSA9PT0gXCLnmodcIikge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7XCJyb3RhdGUoOTBkZWcpXCJ9XCI+XHJcbiAgICAgICAgICAgICR7cmVuZGVyTm9ybWFsUGllY2UoXCLpu5JcIiwgXCLnmodcIiwgaXNfYm9sZCl9XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcHJvZiwgaXNfYXNpZGUgfSA9IHBpZWNlO1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogJHtsZWZ0fXB4OyB0b3A6ICR7dG9wfXB4OyB0cmFuc2Zvcm06IHNjYWxlKDAuMjYpICR7aXNfYXNpZGUgPyBcInJvdGF0ZSgxODBkZWcpXCIgOiBcIlwifVwiPlxyXG4gICAgICAgICAgICAke3JlbmRlck5vcm1hbFBpZWNlKGNvbG9yLCBwcm9mLCBpc19ib2xkKX1cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3cgfSBmcm9tIFwiY2Vya2Vfb25saW5lX2FwaVwiO1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlQcm9mZXNzaW9uID0gXCLoiLlcIiB8IFwi54ShXCIgfCBcIuWFtVwiIHwgXCLlvJNcIiB8IFwi6LuKXCIgfCBcIuiZjlwiIHwgXCLppqxcIiB8IFwi562GXCIgfCBcIuW3q1wiIHwgXCLlsIZcIiB8IFwi546LXCI7XHJcbmV4cG9ydCB0eXBlIEhhbnppUHJvZmVzc2lvbkFuZFRhbSA9IEhhbnppUHJvZmVzc2lvbiB8IFwi55qHXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcHJvZnM6IEhhbnppUHJvZmVzc2lvbkFuZFRhbVtdID0gW1xyXG5cdFwi6Ii5XCIsIFwi54ShXCIsIFwi5YW1XCIsIFwi5byTXCIsIFwi6LuKXCIsIFwi6JmOXCIsIFwi6aasXCIsIFwi562GXCIsIFwi5berXCIsIFwi5bCGXCIsIFwi546LXCIsIFwi55qHXCJcclxuXTtcclxuXHJcbmV4cG9ydCB0eXBlIEJvYXJkID0geyBba2V5IGluIEFic29sdXRlQ29sdW1uXT86IHsgW2tleSBpbiBBYnNvbHV0ZVJvd10/OiBOb25UYW1QaWVjZSB8IFwi55qHXCIgfSB9O1xyXG5cclxuZXhwb3J0IHR5cGUgSGFuemlTZWFzb24gPSBcIuaYpVwiIHwgXCLlpI9cIiB8IFwi56eLXCIgfCBcIuWGrFwiO1xyXG5leHBvcnQgdHlwZSBSYXRlID0gMSB8IDIgfCA0IHwgOCB8IDE2IHwgMzIgfCA2NDtcclxuXHJcbmV4cG9ydCB0eXBlIFN0YXRlID0ge1xyXG5cdHNlYXNvbjogSGFuemlTZWFzb24sXHJcblx0dHVybjogbnVtYmVyLFxyXG5cdHJhdGU6IFJhdGUsXHJcblx0Zm9jdXM6IFtBYnNvbHV0ZUNvbHVtbiwgQWJzb2x1dGVSb3ddIHwgbnVsbCxcclxuXHRib2FyZDogQm9hcmQsXHJcblx0aWFfc2lkZToge1xyXG5cdFx0cGxheWVyX25hbWVfc2hvcnQ6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiBOb25UYW1QaWVjZVtdLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZ1xyXG5cdH0sXHJcblx0YV9zaWRlOiB7XHJcblx0XHRwbGF5ZXJfbmFtZV9zaG9ydDogc3RyaW5nLFxyXG5cdFx0cGxheWVyX25hbWU6IHN0cmluZyxcclxuXHRcdGhvcDF6dW8xOiBOb25UYW1QaWVjZVtdXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBOb25UYW1QaWVjZSA9IHsgY29sb3I6IFwi6LWkXCIgfCBcIum7klwiLCBwcm9mOiBIYW56aVByb2Zlc3Npb24sIGlzX2FzaWRlOiBib29sZWFuIH07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBCb2R5RWxlbWVudCB9IGZyb20gJ2NlcmtlX29ubGluZV9raWFha19wYXJzZXInO1xyXG5pbXBvcnQgeyBkcmF3RW1wdHlCb2FyZCwgZHJhd0dhbWVTdGF0ZSB9IGZyb20gJy4vZHJhdyc7XHJcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUobzoge1xyXG4gICAgaWFfc2lkZToge1xyXG4gICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcbiAgICAgICAgcGxheWVyX25hbWU6IHN0cmluZ1xyXG4gICAgfSxcclxuICAgIGFfc2lkZToge1xyXG4gICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBzdHJpbmcsXHJcbiAgICAgICAgcGxheWVyX25hbWU6IHN0cmluZyxcclxuICAgIH0sXHJcbn0pOiBTdGF0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNlYXNvbjogXCLmmKVcIixcclxuICAgICAgICB0dXJuOiAxLFxyXG4gICAgICAgIHJhdGU6IDEsXHJcbiAgICAgICAgZm9jdXM6IG51bGwsXHJcbiAgICAgICAgYm9hcmQ6IHtcclxuICAgICAgICAgICAgSzoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBMOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIummrFwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE46IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBUOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFo6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi546LXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgTzogXCLnmodcIixcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgWDoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6JmOXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIui7ilwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgTToge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBQOiB7XHJcbiAgICAgICAgICAgICAgICBBOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGlhX3NpZGU6IHtcclxuICAgICAgICAgICAgcGxheWVyX25hbWVfc2hvcnQ6IG8uaWFfc2lkZS5wbGF5ZXJfbmFtZV9zaG9ydCxcclxuICAgICAgICAgICAgaG9wMXp1bzE6IFtdLFxyXG4gICAgICAgICAgICBwbGF5ZXJfbmFtZTogby5pYV9zaWRlLnBsYXllcl9uYW1lXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhX3NpZGU6IHtcclxuICAgICAgICAgICAgcGxheWVyX25hbWVfc2hvcnQ6IG8uYV9zaWRlLnBsYXllcl9uYW1lX3Nob3J0LFxyXG4gICAgICAgICAgICBwbGF5ZXJfbmFtZTogby5hX3NpZGUucGxheWVyX25hbWUsXHJcbiAgICAgICAgICAgIGhvcDF6dW8xOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE50aFN0YXRlKG46IG51bWJlcik6IFN0YXRlIHtcclxuICAgIGlmIChuID09IDEpIHtcclxuICAgICAgICByZXR1cm4gZ2V0SW5pdGlhbFN0YXRlKHtcclxuICAgICAgICAgICAgaWFfc2lkZToge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyX25hbWVfc2hvcnQ6IFwi562GXCIsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJfbmFtZTogXCLnrYbloqjpoqhcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhX3NpZGU6IHtcclxuICAgICAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBcIuaYn1wiLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyX25hbWU6IFwi5pif5Lqr6Z2SXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZWFzb246IFwi56eLXCIsXHJcbiAgICAgICAgdHVybjogbixcclxuICAgICAgICByYXRlOiA0LFxyXG4gICAgICAgIGZvY3VzOiBbXCJQXCIsIFwiT1wiXSxcclxuICAgICAgICBib2FyZDoge1xyXG4gICAgICAgICAgICBDOiB7XHJcbiAgICAgICAgICAgICAgICBBSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWwhlwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLou4pcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBZOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgSzoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5berXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnrYZcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEw6IHtcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW8k1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5byTXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE06IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSUE6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6aasXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgTzogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IGZhbHNlIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgTjoge1xyXG4gICAgICAgICAgICAgICAgQUk6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgQVU6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlhbVcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIFk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFA6IHtcclxuICAgICAgICAgICAgICAgIEE6IHsgY29sb3I6IFwi6LWkXCIsIHByb2Y6IFwi562GXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBBVTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLlt6tcIiwgaXNfYXNpZGU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICBFOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuW3q1wiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgSTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlvJNcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuethlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIFU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5YW1XCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBPOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVDoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLnjotcIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIEU6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi6LuKXCIsIGlzX2FzaWRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBJOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFg6IHtcclxuICAgICAgICAgICAgICAgIEFVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgRTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEk6IHsgY29sb3I6IFwi6buSXCIsIHByb2Y6IFwi5bCGXCIsIGlzX2FzaWRlOiB0cnVlIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgWjoge1xyXG4gICAgICAgICAgICAgICAgQTogeyBjb2xvcjogXCLotaRcIiwgcHJvZjogXCLomY5cIiwgaXNfYXNpZGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIEFJOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIElBOiB7IGNvbG9yOiBcIum7klwiLCBwcm9mOiBcIueOi1wiLCBpc19hc2lkZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIE86IFwi55qHXCIsXHJcbiAgICAgICAgICAgICAgICBVOiB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiIuVwiLCBpc19hc2lkZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgWTogeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLlsIZcIiwgaXNfYXNpZGU6IGZhbHNlIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlhX3NpZGU6IHtcclxuICAgICAgICAgICAgcGxheWVyX25hbWVfc2hvcnQ6IFwi562GXCIsXHJcbiAgICAgICAgICAgIGhvcDF6dW8xOiBbeyBjb2xvcjogXCLpu5JcIiwgcHJvZjogXCLppqxcIiwgaXNfYXNpZGU6IGZhbHNlIH1dLFxyXG4gICAgICAgICAgICBwbGF5ZXJfbmFtZTogXCLnrYbloqjpoqhcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYV9zaWRlOiB7XHJcbiAgICAgICAgICAgIHBsYXllcl9uYW1lX3Nob3J0OiBcIuaYn1wiLFxyXG4gICAgICAgICAgICBwbGF5ZXJfbmFtZTogXCLmmJ/kuqvpnZJcIixcclxuICAgICAgICAgICAgaG9wMXp1bzE6IFt7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuWFtVwiLCBpc19hc2lkZTogdHJ1ZSB9LCB7IGNvbG9yOiBcIui1pFwiLCBwcm9mOiBcIuiZjlwiLCBpc19hc2lkZTogdHJ1ZSB9XVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfTtcclxuXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgZHJhd0VtcHR5Qm9hcmQoKTtcclxuICAgIGNvbnN0IHR1cm5fc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuX3NsaWRlclwiKSEgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHR1cm5fc2xpZGVyLm1pbiA9IFwiMVwiO1xyXG4gICAgdHVybl9zbGlkZXIubWF4ID0gXCI0NVwiO1xyXG4gICAgdHVybl9zbGlkZXIudmFsdWUgPSBcIjI5XCI7XHJcbiAgICBkcmF3R2FtZVN0YXRlKGdldE50aFN0YXRlKDI5KSk7XHJcbiAgICB0dXJuX3NsaWRlci5vbmlucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgIGRyYXdHYW1lU3RhdGUoZ2V0TnRoU3RhdGUoTnVtYmVyKHR1cm5fc2xpZGVyLnZhbHVlKSkpO1xyXG4gICAgfVxyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
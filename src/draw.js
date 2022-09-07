"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawGameState = exports.drawPiecesOnBoard = exports.drawFocusSrc = exports.drawFocusStepped = exports.drawFocusPlannedDest = exports.drawEmptyBoard = exports.cell_size = exports.top_margin = exports.left_margin = exports.height = void 0;
var types_1 = require("./types");
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
        return;
    var circle_radius = 18;
    var _a = get_top_left(focus_planned_dest), top = _a.top, left = _a.left;
    document.getElementById("pieces_inner").innerHTML += "\n    <div style=\"\n        position: absolute; \n        left: ".concat(left + exports.cell_size - circle_radius, "px;\n        top: ").concat(top + exports.cell_size - circle_radius, "px;\n        width: ").concat(circle_radius * 2, "px; \n        height: ").concat(circle_radius * 2, "px; \n        border-radius: 25%; \n        background-color: rgba(0, 255, 255, 0.3)\n    \"></div>");
}
exports.drawFocusPlannedDest = drawFocusPlannedDest;
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
    drawFocusPlannedDest(STATE.focus_planned_dest);
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
//# sourceMappingURL=draw.js.map
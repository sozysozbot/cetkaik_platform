import { AbsoluteColumn, AbsoluteRow } from "cerke_online_api";
import { NonTamPiece, State, HanziProfessionAndTam, profs, Board } from "./types";

export const height = 387;
export const left_margin = 40;
export const top_margin = 40;

export function drawEmptyBoard() {
    const ctx = (document.getElementById("cv")! as HTMLCanvasElement).getContext("2d")!;

    // 皇処
    ctx.fillStyle = "hsl(27, 54.5%, 81.1%)"
    ctx.fillRect(left_margin + 2 * height / 9, top_margin + 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 3 * height / 9, top_margin + 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 5 * height / 9, top_margin + 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 6 * height / 9, top_margin + 6 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 6 * height / 9, top_margin + 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 5 * height / 9, top_margin + 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 3 * height / 9, top_margin + 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 2 * height / 9, top_margin + 6 * height / 9, height / 9, height / 9);


    // 皇水
    ctx.fillStyle = "hsl(213, 33.6%, 78.9%)";
    ctx.fillRect(left_margin + 4 * height / 9, top_margin + 2 * height / 9, height / 9, 5 * height / 9);
    ctx.fillRect(left_margin + 2 * height / 9, top_margin + 4 * height / 9, 5 * height / 9, height / 9);

    // 皇山
    ctx.fillStyle = "hsl(129, 38.5%, 45.4%)";
    ctx.fillRect(left_margin + 4 * height / 9, top_margin + 4 * height / 9, height / 9, height / 9);

    ctx.strokeStyle = 'rgb(99, 99, 99)';
    ctx.lineWidth = 0.03 * height / 9;

    for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(left_margin + 0, top_margin + i * height / 9);
        ctx.lineTo(left_margin + height, top_margin + i * height / 9);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(left_margin + i * height / 9, top_margin + 0);
        ctx.lineTo(left_margin + i * height / 9, top_margin + height);
        ctx.stroke();
    }

    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgb(0,0,0)";
    const columns = ["A", "E", "I", "U", "O", "Y", "AI", "AU", "IA"];
    ctx.textAlign = "left";
    for (let i = 0; i < 9; i++) {
        ctx.fillText(columns[i], left_margin + height + 10, top_margin + 30 + 43 * i);
    }

    const rows = ["K", "L", "N", "T", "Z", "X", "C", "M", "P"];
    ctx.textAlign = "center"
    for (let i = 0; i < 9; i++) {
        ctx.fillText(rows[i], left_margin + 20 + 43 * i, top_margin - 10);
    }

    ctx.save();

    ctx.rotate(Math.PI);

    ctx.textAlign = "left";
    for (let i = 0; i < 9; i++) {
        ctx.fillText(columns[i], -left_margin + 10, -(top_margin + 15 + 43 * i));
    }

    ctx.textAlign = "center"
    for (let i = 0; i < 9; i++) {
        ctx.fillText(rows[i], -(left_margin + 20 + 43 * i), -(top_margin + height + 10));
    }

    ctx.restore();

}

export function drawPiecesOnBoard(board: Board, focus: [AbsoluteColumn, AbsoluteRow] | null) {
    let ans = "";
    for (const clm in board) {
        for (const rw in board[clm as AbsoluteColumn]) {
            const is_focused = focus ? focus[0] == clm && focus[1] == rw : false;
            ans += positionPieceOnBoard(
                clm as AbsoluteColumn,
                rw as AbsoluteRow,
                board[clm as AbsoluteColumn]![rw as AbsoluteRow]!,
                is_focused
            );
        }
    }

    document.getElementById("pieces_inner")!.innerHTML = ans;
}


function getHop1Zuo1HTML(pieces: NonTamPiece[]) {
    let ans = "";
    for (let i = 0; i < pieces.length; i++) {
        const { color, prof } = pieces[i];
        ans += `<li><div style="width: 23px; height: 43px; transform: scale(0.26); transform-origin: top left">${renderNormalPiece(color, prof, false)}</div></li>`;
    }
    return ans;
}

export function drawGameState(STATE: State) {
    document.getElementById("season_text")!.innerHTML = STATE.season;
    document.getElementById("turn_text")!.innerHTML = STATE.turn + "";
    document.getElementById("rate_text")!.innerHTML = STATE.rate + "";
    document.getElementById("ia_side_player_name_short_text")!.innerHTML = STATE.ia_side.player_name_short;
    document.getElementById("a_side_player_name_short_text")!.innerHTML = STATE.a_side.player_name_short;
    document.getElementById("a_side_player_name_text")!.innerHTML = STATE.a_side.player_name;
    document.getElementById("ia_side_player_name_text")!.innerHTML = STATE.ia_side.player_name;
    document.getElementById("a_side_piece_stand")!.innerHTML = getHop1Zuo1HTML(STATE.a_side.hop1zuo1);
    document.getElementById("ia_side_piece_stand")!.innerHTML = getHop1Zuo1HTML(STATE.ia_side.hop1zuo1);
    drawPiecesOnBoard(STATE.board, STATE.focus);
}

function renderNormalPiece(color: "黒" | "赤", prof: HanziProfessionAndTam, is_bold: boolean) {
    const x = profs.indexOf(prof) * -100 - 27;
    const y = is_bold ? 0 : -277;
    const color_path = {
        "黒": "ゴシック駒",
        "赤": "ゴシック駒_赤",
    }[color];
    return `<div
    style="width: 87px; height: 87px; background-position-x: ${x}px; background-position-y: ${y}px; background-image: url(${color_path}.svg); ">
</div>`
}


function positionPieceOnBoard(clm: AbsoluteColumn, rw: AbsoluteRow, piece: NonTamPiece | "皇", is_bold: boolean) {
    const column = {
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
    const row = {
        IA: 8,
        AU: 7,
        AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
    }[rw];
    const left = left_margin + 43 * (column - 0.5);
    const top = top_margin + 43 * (row - 0.5);
    if (piece === "皇") {
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            ${renderNormalPiece("黒", "皇", is_bold)}
        </div>`;
    } else {
        const { color, prof, is_aside } = piece;
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${is_aside ? "rotate(180deg)" : ""}">
            ${renderNormalPiece(color, prof, is_bold)}
        </div>`;
    }

}

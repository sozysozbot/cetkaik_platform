import { AbsoluteColumn, AbsoluteRow, AbsoluteCoord } from "cerke_online_api";
import { NonTamPiece, State, HanziProfessionAndTam, profs, Board, OverlayedMessage } from "./types";

export const height = 387;
export const left_margin = 40;
export const top_margin = 40;
export const cell_size = 43;

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
        ctx.fillText(columns[i], left_margin + height + 10, top_margin + 30 + cell_size * i);
    }

    const rows = ["K", "L", "N", "T", "Z", "X", "C", "M", "P"];
    ctx.textAlign = "center"
    for (let i = 0; i < 9; i++) {
        ctx.fillText(rows[i], left_margin + 20 + cell_size * i, top_margin - 10);
    }

    ctx.save();

    ctx.rotate(Math.PI);

    ctx.textAlign = "left";
    for (let i = 0; i < 9; i++) {
        ctx.fillText(columns[i], -left_margin + 10, -(top_margin + 15 + cell_size * i));
    }

    ctx.textAlign = "center"
    for (let i = 0; i < 9; i++) {
        ctx.fillText(rows[i], -(left_margin + 20 + cell_size * i), -(top_margin + height + 10));
    }

    ctx.restore();
}

function get_top_left(coord: AbsoluteCoord) {
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
    }[coord[1]];
    const row = {
        IA: 8,
        AU: 7,
        AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
    }[coord[0]];
    const left = left_margin + cell_size * (column - 0.5);
    const top = top_margin + cell_size * (row - 0.5);
    return { left, top }
}

export function FocusPlannedDestHTML(focus_planned_dest: AbsoluteCoord | null): string {
    if (!focus_planned_dest) return "";
    const circle_radius = 18;
    const { top, left } = get_top_left(focus_planned_dest);
    return `
    <div style="
        position: absolute; 
        left: ${left + cell_size - circle_radius}px;
        top: ${top + cell_size - circle_radius}px;
        width: ${circle_radius * 2}px; 
        height: ${circle_radius * 2}px; 
        border-radius: 25%; 
        background-color: rgb(178, 255, 255)
    "></div>`;
}

export function FocusSteppedHTML(focus_stepped: AbsoluteCoord | null): string {
    if (!focus_stepped) return "";
    const circle_radius = 18;
    const { top, left } = get_top_left(focus_stepped);
    return `
    <div style="
        position: absolute; 
        left: ${left + cell_size - circle_radius}px;
        top: ${top + cell_size - circle_radius}px;
        width: ${circle_radius * 2}px; 
        height: ${circle_radius * 2}px; 
        border-radius: 50%; 
        background-color: rgba(255, 255, 0, 0.3)
    "></div>`;
}

export function drawFocusSrc(focus_src: AbsoluteCoord | "a_side_hop1zuo1" | "ia_side_hop1zuo1" | null): string {
    if (!focus_src || focus_src === "a_side_hop1zuo1" || focus_src === "ia_side_hop1zuo1") return "";
    const circle_radius = 18;
    const { top, left } = get_top_left(focus_src);
    return `
    <div style="
        position: absolute; 
        left: ${left + cell_size - circle_radius}px;
        top: ${top + cell_size - circle_radius}px;
        width: ${circle_radius * 2}px; 
        height: ${circle_radius * 2}px; 
        border-radius: 50%; 
        background-color: rgba(0, 0, 0, 0.3)
    "></div>`;
}

function PiecesOnBoardHTML(board: Board, focus: AbsoluteCoord | null): string {
    let ans = "";
    for (const clm in board) {
        for (const rw in board[clm as AbsoluteColumn]) {
            const is_focused = focus ? focus[1] === clm && focus[0] === rw : false;
            ans += PositionedPieceOnBoardHTML(
                clm as AbsoluteColumn,
                rw as AbsoluteRow,
                board[clm as AbsoluteColumn]![rw as AbsoluteRow]!,
                is_focused
            );
        }
    }

    return ans;
}


function Hop1Zuo1HTML(pieces: NonTamPiece[], is_newly_acquired: boolean) {
    let ans = "";
    for (let i = 0; i < pieces.length; i++) {
        const { color, prof } = pieces[i];
        const rad = 18 / 0.26;
        ans += `<li>
            <div style="
                width: 23px; 
                height: ${cell_size}px; 
                transform: scale(0.26); 
                transform-origin: top left; 
            ">
                
                ${is_newly_acquired && i == pieces.length - 1 ? `<div style="
                    position: absolute;
                    transform: rotate(45deg);
                    transform-origin: center;
                    left: ${42 - rad}px;
                    top: ${42 - rad}px;
                    width: ${rad * 2}px;
                    height: ${rad * 2}px;
                    border-radius: 25%;
                    background-color: rgba(0, 60, 50, 0.3);
                "></div>` : ""}
                ${NormalPieceHTML(color, prof, false)}
            </div>
        </li>`;
    }
    return ans;
}

export function drawGameState(STATE: State) {
    if (STATE.whose_turn === "a_side") {
        document.getElementById("a_side_container")!.classList.add("turn_active");
        document.getElementById("ia_side_container")!.classList.remove("turn_active");
    } else if (STATE.whose_turn === "ia_side") {
        document.getElementById("a_side_container")!.classList.remove("turn_active");
        document.getElementById("ia_side_container")!.classList.add("turn_active");
    } else {
        document.getElementById("a_side_container")!.classList.remove("turn_active");
        document.getElementById("ia_side_container")!.classList.remove("turn_active");
    }
    document.getElementById("season_text")!.innerHTML = STATE.game_has_ended ? "星一周" : STATE.season;
    document.getElementById("turn_text")!.innerHTML = STATE.turn + "";
    document.getElementById("rate_text")!.innerHTML = STATE.rate + "";
    document.getElementById("ia_side_player_name_short_text")!.innerHTML = STATE.ia_side.player_name_short;
    document.getElementById("a_side_player_name_short_text")!.innerHTML = STATE.a_side.player_name_short;
    document.getElementById("a_side_player_name_text")!.innerHTML = STATE.a_side.player_name;
    document.getElementById("ia_side_player_name_text")!.innerHTML = STATE.ia_side.player_name;
    document.getElementById("a_side_current_score")!.innerHTML = STATE.a_side.score + "";
    document.getElementById("ia_side_current_score")!.innerHTML = STATE.ia_side.score + "";
    document.getElementById("a_side_piece_stand")!.innerHTML = Hop1Zuo1HTML(STATE.a_side.hop1zuo1, STATE.a_side.is_newly_acquired);
    document.getElementById("ia_side_piece_stand")!.innerHTML = Hop1Zuo1HTML(STATE.ia_side.hop1zuo1, STATE.ia_side.is_newly_acquired);
    document.getElementById("pieces_inner")!.innerHTML = FocusSteppedHTML(STATE.focus.stepped) +
        drawFocusSrc(STATE.focus.src) +
        FocusPlannedDestHTML(STATE.focus.initially_planned_dest) +
        PiecesOnBoardHTML(STATE.board, STATE.focus.actual_final_dest);
    document.getElementById("yaku_display")!.innerHTML = OverlayedMessageHTML(STATE.overlayed_message);

}

function OverlayedMessageHTML(a: OverlayedMessage | null): string {
    if (!a) return "";
    const content = ((a: OverlayedMessage) => {
        if (a.type === "before_taxot" || a.type === "before_tymok") {
            return a.hands.join("<br>");
        } else if (a.type === "end_season") {
            return `終季<br>${a.score}`;
        } else if (a.type === "go_again") {
            return `再行`
        } else if (a.type === "game_set") {
            return `星一周`
        } else if (a.type === "season_ends") {
            return `${a.season}終`
        } else {
            const _ : never = a;
            throw new Error(`Should not reach here: Dat2Display.type is invalid`)
        }
    })(a);
    return `<div style="position: absolute;
    width: 469px;
    height: 256px;
    top: 131px;
    left: 44px;
    background-color: rgba(0,0,0,80%);
    color: white;
}">${content}</div>`
}

function NormalPieceHTML(color: "黒" | "赤", prof: HanziProfessionAndTam, is_bold: boolean) {
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


function PositionedPieceOnBoardHTML(clm: AbsoluteColumn, rw: AbsoluteRow, piece: NonTamPiece | "皇", is_bold: boolean) {
    const { left, top } = get_top_left([rw, clm]);
    if (piece === "皇") {
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            ${NormalPieceHTML("黒", "皇", is_bold)}
        </div>`;
    } else {
        const { color, prof, is_aside } = piece;
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${is_aside ? "rotate(180deg)" : ""}">
            ${NormalPieceHTML(color, prof, is_bold)}
        </div>`;
    }

}

export function highlightNthKia1Ak1(kiar_ark: string, n: number) {
    const lines = kiar_ark.trim().split("\n");
    // when n = 0, nothing should be highlighted
    for (let i = 3; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;
        const elems_length = lines[i].split(/ /g).filter(a => a !== "").length;
        if (n > elems_length || n <= 0) {
            n -= elems_length; continue;
        } else {
            // n = 1 => highlight the first element, and so on
            const arr = lines[i].split(/ /g);
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] === "") {
                    continue;
                } else {
                    n--;
                    if (n === 0) { arr[j] = `<span style="background-color: #cccccc;">${arr[j]}</span>`; }
                }
            }
            lines[i] = arr.join(" ");
        }
    }
    document.getElementById("kia_ak")!.innerHTML = lines.join("\n");
}

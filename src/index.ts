import { BodyElement } from 'cerke_online_kiaak_parser';

const height = 387;
const left_margin = 40;
const top_margin = 40;

function init() {
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



function depict_board(board: { [key in AbsoluteColumn]?: { [key in AbsoluteRow]?: [ColorAndProf, boolean] | "皇" } }, focus: [AbsoluteColumn, AbsoluteRow]) {
    let ans = "";
    for (const clm in board) {
        for (const rw in board[clm as AbsoluteColumn])
            ans += foooo(clm as AbsoluteColumn, rw as AbsoluteRow, board[clm as AbsoluteColumn]![rw as AbsoluteRow]!, focus[0] == clm && focus[1] == rw);
    }

    document.getElementById("pieces_inner")!.innerHTML = ans;
}
type HanziProfession = "船" | "無" | "兵" | "弓" | "車" | "虎" | "馬" | "筆" | "巫" | "将" | "王";
type HanziProfessionAndTam = HanziProfession | "皇"

const profs: HanziProfessionAndTam[] = [
    "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];

function depict_hop1zuo1(pieces: ColorAndProf[]) {
    let ans = "";
    for (let i = 0; i < pieces.length; i++) {
        const { color, prof } = pieces[i];
        ans += `<li><div style="width: 23px; height: 43px; transform: scale(0.26); transform-origin: top left">${renderNormalPiece(color, prof, false)}</div></li>`;
    }
    return ans
}

type HanziSeason = "春" | "夏" | "秋" | "冬";
type Rate = 1 | 2 | 4 | 8 | 16 | 32 | 64;

type State = {
    season: HanziSeason,
    turn: number,
    rate: Rate,
    focus: [AbsoluteColumn, AbsoluteRow],
    board: { [key in AbsoluteColumn]?: { [key in AbsoluteRow]?: [ColorAndProf, boolean] | "皇" } },
    ia_side: {
        player_name_short: string,
        hop1zuo1: ColorAndProf[],
        player_name: string
    },
    a_side: {
        player_name_short: string,
        player_name: string,
        hop1zuo1: ColorAndProf[]
    }
}

function depict_state(STATE: State) {
    document.getElementById("season_text")!.innerHTML = STATE.season;
    document.getElementById("turn_text")!.innerHTML = STATE.turn + "";
    document.getElementById("rate_text")!.innerHTML = STATE.rate + "";
    document.getElementById("ia_side_player_name_short_text")!.innerHTML = STATE.ia_side.player_name_short;
    document.getElementById("a_side_player_name_short_text")!.innerHTML = STATE.a_side.player_name_short;
    document.getElementById("a_side_player_name_text")!.innerHTML = STATE.a_side.player_name;
    document.getElementById("ia_side_player_name_text")!.innerHTML = STATE.ia_side.player_name;
    document.getElementById("a_side_piece_stand")!.innerHTML = depict_hop1zuo1(STATE.a_side.hop1zuo1);
    document.getElementById("ia_side_piece_stand")!.innerHTML = depict_hop1zuo1(STATE.ia_side.hop1zuo1);
    depict_board(STATE.board, STATE.focus);
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


type AbsoluteRow = "A" | "E" | "I" | "U" | "O" | "Y" | "AI" | "AU" | "IA";

type AbsoluteColumn = "K" | "L" | "N" | "T" | "Z" | "X" | "C" | "M" | "P";

type ColorAndProf = { color: "赤" | "黒", prof: HanziProfession };
type ColorAndProfOrTam = ColorAndProf | "皇";

function foooo(clm: AbsoluteColumn, rw: AbsoluteRow, color_and_prof_and_rotated: [ColorAndProf, boolean] | "皇", is_bold: boolean) {
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
    if (color_and_prof_and_rotated === "皇") {
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            ${renderNormalPiece("黒", "皇", is_bold)}
        </div>`;
    } else {
        const [{ color, prof }, rotated] = color_and_prof_and_rotated;
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${rotated ? "rotate(180deg)" : ""}">
            ${renderNormalPiece(color, prof, is_bold)}
        </div>`;
    }

}

function nthState(n: number): State {
    return {
        season: "秋",
        turn: n,
        rate: 4,
        focus: ["P", "O"],
        board: {
            C: {
                AI: [{ color: "黒", prof: "車" }, false],
                E: [{ color: "赤", prof: "将" }, true],
                I: [{ color: "赤", prof: "車" }, true],
                U: [{ color: "黒", prof: "兵" }, true],
                Y: [{ color: "黒", prof: "兵" }, false],
            },
            K: {
                A: [{ color: "黒", prof: "筆" }, true],
                AI: [{ color: "黒", prof: "兵" }, false],
                AU: [{ color: "黒", prof: "巫" }, false],
                E: [{ color: "赤", prof: "巫" }, true],
                IA: [{ color: "赤", prof: "筆" }, false],
                U: [{ color: "黒", prof: "兵" }, true]
            },
            L: {
                AI: [{ color: "赤", prof: "兵" }, false],
                AU: [{ color: "黒", prof: "弓" }, false],
                E: [{ color: "赤", prof: "弓" }, true],
                IA: [{ color: "赤", prof: "馬" }, false],
                U: [{ color: "赤", prof: "兵" }, true]
            },
            M: {
                A: [{ color: "赤", prof: "馬" }, true],
                AU: [{ color: "赤", prof: "弓" }, false],
                I: [{ color: "赤", prof: "兵" }, true],
                IA: [{ color: "黒", prof: "馬" }, false],
                O: [{ color: "赤", prof: "兵" }, false]
            },
            N: {
                AI: [{ color: "赤", prof: "将" }, false],
                AU: [{ color: "赤", prof: "車" }, false],
                I: [{ color: "黒", prof: "兵" }, true],
                Y: [{ color: "黒", prof: "兵" }, false]
            },
            P: {
                A: [{ color: "赤", prof: "筆" }, true],
                AU: [{ color: "赤", prof: "巫" }, false],
                E: [{ color: "黒", prof: "巫" }, true],
                I: [{ color: "黒", prof: "弓" }, true],
                IA: [{ color: "黒", prof: "筆" }, false],
                U: [{ color: "黒", prof: "兵" }, true],
                O: [{ color: "黒", prof: "兵" }, false]
            },
            T: {
                A: [{ color: "赤", prof: "王" }, true],
                AI: [{ color: "赤", prof: "兵" }, false],
                AU: [{ color: "黒", prof: "虎" }, false],
                E: [{ color: "黒", prof: "車" }, true],
                I: [{ color: "赤", prof: "兵" }, true]
            },
            X: {
                AU: [{ color: "赤", prof: "兵" }, true],
                E: [{ color: "黒", prof: "虎" }, true],
                I: [{ color: "黒", prof: "将" }, true]
            },
            Z: {
                A: [{ color: "赤", prof: "虎" }, true],
                AI: [{ color: "黒", prof: "船" }, false],
                IA: [{ color: "黒", prof: "王" }, false],
                O: "皇",
                U: [{ color: "赤", prof: "船" }, true],
                Y: [{ color: "黒", prof: "将" }, false]
            },
        },
        ia_side: {
            player_name_short: "筆",
            hop1zuo1: [{ color: "黒", prof: "馬" }],
            player_name: "筆墨風"
        },
        a_side: {
            player_name_short: "星",
            player_name: "星享青",
            hop1zuo1: [{ color: "赤", prof: "兵" }, { color: "赤", prof: "虎" }]
        },

    };

}

window.addEventListener('load', () => {
    init();
    const turn_slider = document.getElementById("turn_slider")! as HTMLInputElement;
    turn_slider.min = "1";
    turn_slider.max = "45";
    turn_slider.value = "29";
    depict_state(nthState(29));
    turn_slider.onchange = () => {
        depict_state(nthState(Number(turn_slider.value)));
    }
});
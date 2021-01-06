const height = 387;
const left_margin = 40;
const top_margin = 40;

function init() {
    const ctx = document.getElementById("cv").getContext("2d");

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

function depict_board(board, focus) {
    let ans = "";
    for (key in board) {
        ans += fooo(key, ...board[key], focus == key)
    }

    document.getElementById("pieces_inner").innerHTML = ans;
}

const profs = [
    "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];

function depict_hop1zuo1(pieces) {
    let ans = "";
    for (let i = 0; i < pieces.length; i++) {
        const [color, prof] = pieces[i];
        ans += `<li><div style="width: 23px; height: 43px; transform: scale(0.26); transform-origin: top left">${barr(color, prof, false)}</div></li>`;
    }
    return ans
}

function depict_state(STATE) {
    document.getElementById("season_text").innerHTML = STATE.season;
    document.getElementById("turn_text").innerHTML = STATE.turn;
    document.getElementById("rate_text").innerHTML = STATE.rate;
    document.getElementById("ia_side_player_name_short_text").innerHTML = STATE.ia_side_player_name_short;
    document.getElementById("a_side_player_name_short_text").innerHTML = STATE.a_side_player_name_short;
    document.getElementById("a_side_player_name_text").innerHTML = STATE.a_side_player_name;
    document.getElementById("ia_side_player_name_text").innerHTML = STATE.ia_side_player_name;
    document.getElementById("a_side_piece_stand").innerHTML = depict_hop1zuo1(STATE.a_side_hop1zuo1);
    document.getElementById("ia_side_piece_stand").innerHTML = depict_hop1zuo1(STATE.ia_side_hop1zuo1);
    depict_board(STATE.board, STATE.focus);
}

function barr(color, prof, is_bold) {
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

function fooo(coord, color_and_prof, rotated, is_bold) {
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
    }[coord[0]];
    const row = {
        IA: 8,
        AU: 7,
        AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
    }[coord.slice(1)];
    const left = left_margin + 43 * (column - 0.5);
    const top = top_margin + 43 * (row - 0.5);
    if (color_and_prof === "皇") {
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            ${barr("黒", "皇", is_bold)}
        </div>`;
    } else {
        const [color, prof] = color_and_prof;
        return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${rotated ? "rotate(180deg)" : ""}">
            ${barr(color, prof, is_bold)}
        </div>`;
    }

}

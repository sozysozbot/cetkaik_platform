function depict_board(board, focus) {
    for (key in board) {
        fooo(key, ...board[key], focus == key)
    }
}

const profs = [
    "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
];
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
        const x = profs.indexOf("皇") * -100 - 27;
        const y = is_bold ? 0 : -277;
        const color_path = "ゴシック駒";
        document.write(`
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            <div
                style="width: 87px; height: 87px; background-position-x: ${x}px; background-position-y: ${y}px; background-image: url(${color_path}.svg); ">
            </div>
        </div>`);
    } else {
        const [color, prof] = color_and_prof;
        const x = profs.indexOf(prof) * -100 - 27;
        const y = is_bold ? 0 : -277;
        const color_path = {
            "黒": "ゴシック駒",
            "赤": "ゴシック駒_赤",
        }[color];
        document.write(`
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${rotated ? "rotate(180deg)" : ""}">
            <div
                style="width: 87px; height: 87px; background-position-x: ${x}px; background-position-y: ${y}px; background-image: url(${color_path}.svg); ">
            </div>
        </div>`);
    }
}
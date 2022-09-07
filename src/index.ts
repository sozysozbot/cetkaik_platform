import { BodyElement } from 'cerke_online_kiaak_parser';
import { drawEmptyBoard, drawGameState } from './draw';
import { State } from './types';

function getNthState(n: number): State {
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

window.addEventListener('load', () => {
    drawEmptyBoard();
    const turn_slider = document.getElementById("turn_slider")! as HTMLInputElement;
    turn_slider.min = "1";
    turn_slider.max = "45";
    turn_slider.value = "29";
    drawGameState(getNthState(29));
    turn_slider.oninput = () => {
        drawGameState(getNthState(Number(turn_slider.value)));
    }
});
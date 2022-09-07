import { BodyElement } from 'cerke_online_kiaak_parser';
import { drawEmptyBoard, drawGameState, left_margin, top_margin } from './draw';
import { State } from './types';

function getNthState(n: number): State {
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
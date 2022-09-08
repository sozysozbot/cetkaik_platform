import { parseCerkeOnlineKia1Ak1, Parsed } from 'cerke_online_kiaak_parser';
import { drawEmptyBoard, drawGameState, highlightNthKia1Ak1 } from './draw';
import { getAllStatesFromParsed } from './state';
import { State } from './types';

window.addEventListener('load', () => {
    const param = location.href.match(/\?history=(.*)/);
    if (!param) {
        alert("棋譜がありません。index.html に戻って再入力してください。");
        location.href = "./index.html";
    } else {
        const kiar_ark = decodeURIComponent(param[1]).replace(/\t/g, "    ");
        const parsed: Parsed = parseCerkeOnlineKia1Ak1(kiar_ark);
        const states: State[] = getAllStatesFromParsed(parsed);

        document.getElementById("kia_ak")!.textContent = kiar_ark;

        drawEmptyBoard();
        const turn_slider = document.getElementById("turn_slider")! as HTMLInputElement;
        turn_slider.min = "0";
        const max = states.length - 1;
        turn_slider.max = `${max}`;
        turn_slider.value = "0";
        drawGameState(states[0]);
        turn_slider.oninput = turn_slider.onchange = () => {
            const new_value = Number(turn_slider.value);
            drawGameState(states[new_value]);
            highlightNthKia1Ak1(kiar_ark, new_value);
        }

        const button_next = document.getElementById("button_next")! as HTMLButtonElement;
        button_next.onclick = () => {
            turn_slider.value = `${Number(turn_slider.value) + 1}`;
            const new_value = Number(turn_slider.value); // automatically crops the value appropriately
            drawGameState(states[new_value]);
            highlightNthKia1Ak1(kiar_ark, new_value);
        }

        const button_previous = document.getElementById("button_previous")! as HTMLButtonElement;
        button_previous.onclick = () => {
            turn_slider.value = `${Number(turn_slider.value) - 1}`;
            const new_value = Number(turn_slider.value); // automatically crops the value appropriately
            drawGameState(states[new_value]);
            highlightNthKia1Ak1(kiar_ark, new_value);
        }

        const button_first = document.getElementById("button_first")! as HTMLButtonElement;
        button_first.onclick = () => {
            const new_value = 0;
            turn_slider.value = `${new_value}`;
            drawGameState(states[new_value]);
            highlightNthKia1Ak1(kiar_ark, new_value);
        }

        const button_last = document.getElementById("button_last")! as HTMLButtonElement;
        button_last.onclick = () => {
            const new_value = max;
            turn_slider.value = `${new_value}`;
            drawGameState(states[new_value]);
            highlightNthKia1Ak1(kiar_ark, new_value);
        }
    }
});
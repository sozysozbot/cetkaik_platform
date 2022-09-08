import { parseCerkeOnlineKia1Ak1, Parsed } from 'cerke_online_kiaak_parser';
import { drawEmptyBoard, drawGameState } from './draw';
import { getAllStatesFromParsed } from './state';
import { State } from './types';

window.addEventListener('load', () => {
    const case3 =
	`{一位色:赤赤赤}
{始時:2022-04-01T17:00:24.278Z}
{終時:2022-04-01T17:59:40.857Z}
LE弓LILU橋二    XAU虎ZAITY無撃裁
LU弓LAILAU橋一手黒弓    KAU巫LAU無撃裁手赤弓
NI兵NE無撃裁    赤弓NO
NA車NI無撃裁    KIA筆KAIKY橋一
NE兵NINO水二此無    KY筆KIKE橋二手赤巫
KA筆KE無撃裁手赤筆    ZO皇[TU]ZU
XE虎CIXU橋四    NAI兵NAU無撃裁
NE兵NINO水三手赤弓    TY虎XU無撃裁手黒虎
TE虎ZIXU橋四手赤虎    LAU巫NAUNAI無撃裁
XU虎NAI無撃裁手黒巫    TAU虎NAI無撃裁手赤虎
XI兵XU無撃裁    NAI虎XU無撃裁手赤兵
ZA王XACE無撃裁    赤巫NAI
黒弓ZO    ZAI船ZO無撃裁手黒弓
ME弓CEXE橋三    ZO船NO無撃裁手黒兵
CE王MIPU無撃裁    NAI巫XUPU橋二此無
NI車KA無撃裁    NAI巫XUPU橋二此無
XE弓XUZO橋一水三    NAI巫XUCU橋二
ZO弓CAIZIA橋三手黒王

或為地心加王加獣而手十五

終季    春終

ME弓MIMU橋三    MAU弓MAIMY橋二
CI兵CE無撃裁    MY弓MU無撃裁手黒弓
MI兵MU無撃裁手赤弓    CAI兵CAU無撃裁
PE巫CECI無撃裁    ZO皇[ZY]ZAIZAU
ZI船ZAI無撃裁手黒船    TIA将TAUZAI水無此無
TE虎NITU橋無此無    TAU虎NAICI橋四手黒巫
CE兵CI無撃裁手黒虎    XIA将XAUZAI水三手赤船
MA馬XIMO無撃裁    XAI兵CAI無撃裁
TE虎NITU橋三    黒巫TY
XI兵XU無撃裁    TY巫CIZA橋二手赤王

或為王而手五
終季    夏終

ME弓MIMU橋三    XAU虎CAIXY橋二
CI兵CE無撃裁    CAI兵CAU無撃裁
PE巫CECI無撃裁    XY虎MUCI無撃裁手黒巫
CE兵CI無撃裁手赤虎    黒巫CAI
MU弓MAICAI橋四手黒巫    CIA車CAI無撃裁手黒弓
XE虎CIXU橋三    黒弓CY
XI兵XUCU無撃裁    XAI兵XY無撃裁
ZO皇[ZU]ZIZE    ZAI船ZI無撃裁手赤船
TE虎ZI水三手黒船    XY兵XU無撃裁手黒虎
ZI虎XU無撃裁手赤兵    TAU虎NAITY橋二
XU虎TY無撃裁手黒虎    TAI兵TY無撃裁手赤虎
黒船ZI    ZE皇[XI]ZU
黒巫ZO    CAI車ZO水三手黒巫
ZU皇[XU]ZIZE    ZO車CIPA無撃裁手赤筆
ZI船ZIA無撃裁手黒王

或為王加同色獣而手十
終季    秋終


星一周`;

    const parsed: Parsed = parseCerkeOnlineKia1Ak1(case3);
    const states: State[] = getAllStatesFromParsed(parsed);

    drawEmptyBoard();
    const turn_slider = document.getElementById("turn_slider")! as HTMLInputElement;
    turn_slider.min = "0";
    const max = states.length - 1;
    turn_slider.max = `${max}`;
    turn_slider.value = "0";
    drawGameState(states[0]);
    turn_slider.oninput = turn_slider.onchange = () => {
        drawGameState(states[Number(turn_slider.value)]);
    }

    const button_next = document.getElementById("button_next")! as HTMLButtonElement;
    button_next.onclick = () => {
        turn_slider.value = `${Number(turn_slider.value) + 1}`;
        const new_value = Number(turn_slider.value); // automatically crops the value appropriately
        drawGameState(states[new_value]);
    }

    const button_previous = document.getElementById("button_previous")! as HTMLButtonElement;
    button_previous.onclick = () => {
        turn_slider.value = `${Number(turn_slider.value) - 1}`;
        const new_value = Number(turn_slider.value); // automatically crops the value appropriately
        drawGameState(states[new_value]);
    }

    const button_first = document.getElementById("button_first")! as HTMLButtonElement;
    button_first.onclick = () => {
        const new_value = 0;
        turn_slider.value = `${new_value}`;
        drawGameState(states[new_value]);
    }

    const button_last = document.getElementById("button_last")! as HTMLButtonElement;
    button_last.onclick = () => {
        const new_value = max;
        turn_slider.value = `${new_value}`;
        drawGameState(states[new_value]);
    }
});
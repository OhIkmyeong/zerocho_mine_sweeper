import { Game } from "./game.js";

const $form = document.getElementById('ipt-form');
const GAME = new Game();

$form.addEventListener('submit',e => {
    e.preventDefault();
    const target = e.target;
    //지뢰 개수 검사
    const row = parseInt(target["ipt-row"].value);
    const col = parseInt(target["ipt-col"].value);
    const mine = parseInt(target["ipt-mine"].value);

    if(mine >= row * col){
        alert('지뢰의 갯수를 좀 더 적게 조정해주세용');
        target["ipt-mine"].value = row * col - 1;
        return;
    }//if
    
    //시작인지 종료인지 판단
    const $btn = document.getElementById("ipt-btn");
    $btn.value ==  "시작" ? GAME.init(row,col,mine) : GAME.quit(GAME.reason.stop);
});
export class Tbl{
    constructor(GAME){
        this.GAME = GAME;
    }//constructor

    ////////// METHOD //////////
    draw_table(){
        const {row,col} = this.GAME.DATA.NUM;
        const $tbl = document.getElementById('tbl').getElementsByTagName('TBODY')[0];
        const DATA = this.GAME.DATA;
        const ANSWER = DATA.ANSWER;
        const {MINE} = DATA.CODE;

        for(let r=0; r<row; r++){
            const $tr = document.createElement('TR');
            for(let c=0; c<col; c++){
                const $td = document.createElement('TD');
                $tr.appendChild($td);
                // ANSWER[r][c] == MINE && this.developer_mode($td); //개발자 모드
            }
            $tbl.appendChild($tr);
        }//for
    }//draw_table

    reset_table(){ 
        const $tbl = document.getElementById('tbl').getElementsByTagName('TBODY')[0];
        $tbl.innerHTML = '';}//reset_table

    /* 개발자모드 */
    developer_mode($td){$td.textContent = 'X';}

    /* 클래스 달기 */
}//class-Tbl
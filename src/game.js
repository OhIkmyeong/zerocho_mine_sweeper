import { DataField } from "./data.js";
import { Handle } from "./handle.js";
import { Info } from "./info.js";
import { Tbl } from "./tbl.js";
import { Timer } from "./timer.js";

export class Game{
    constructor(){
        this.DATA = new DataField(this);
        this.TBL = new Tbl(this);
        this.HANDLE = new Handle(this);
        this.INFO = new Info(this);
        this.TIMER = new Timer(this);

        this.reason = Object.freeze({
            win : "🍀승리!", lost : "패배..😥", stop:"장비를 정지합니다...😯"
        });

        this.firstClicked = false;
    }//constructor

    ////////// METHOD //////////
    init(row,col,mine){
        this.change_btn();

        //DATA 관련 총괄
        this.DATA.init(row,col,mine);

        //table 그리기
        this.TBL.reset_table();
        this.TBL.draw_table();

        //이벤트 리스너 등록
        this.HANDLE.add_listener();
        
        //인포 지웠다가
        this.INFO.reset();
        //시간 시작
        this.TIMER.start_timer();
        //깃발 표시
        this.INFO.started();
    }//init

    /* form의 버튼을 바꿈 */
    change_btn(){
        const $btn = document.getElementById("ipt-btn");
        $btn.value = $btn.value ==  "시작" ? "정지" : "시작";
        $btn.classList.toggle('started');
    }//change_btn

    /* 승리 판정 */
    is_win(){
        const {row,col,mine} = this.DATA.NUM;
        const opened = document.querySelectorAll('.opened').length;
        if(row * col - mine == opened){ this.quit(this.reason.win);}
    }//is_win

    /* 게임 종료 */
    quit(reason){
        this.change_btn();
        this.firstClicked = false;
        //지뢰 전부 보여주고
        this.DATA.reveal_all_mine();
        //이벤트 제거하고
        this.HANDLE.remove_listener();
        //인포 화면 관련, 타이머...
        this.TIMER.reset_timer();
        this.INFO.display_message(reason);
    }//quit
}//class - Game
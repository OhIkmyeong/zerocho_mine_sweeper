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
            win : "๐์น๋ฆฌ!", lost : "ํจ๋ฐฐ..๐ฅ", stop:"์ฅ๋น๋ฅผ ์ ์งํฉ๋๋ค...๐ฏ"
        });

        this.firstClicked = false;
    }//constructor

    ////////// METHOD //////////
    init(row,col,mine){
        this.change_btn();

        //DATA ๊ด๋ จ ์ด๊ด
        this.DATA.init(row,col,mine);

        //table ๊ทธ๋ฆฌ๊ธฐ
        this.TBL.reset_table();
        this.TBL.draw_table();

        //์ด๋ฒคํธ ๋ฆฌ์ค๋ ๋ฑ๋ก
        this.HANDLE.add_listener();
        
        //์ธํฌ ์ง์ ๋ค๊ฐ
        this.INFO.reset();
        //์๊ฐ ์์
        this.TIMER.start_timer();
        //๊น๋ฐ ํ์
        this.INFO.started();
    }//init

    /* form์ ๋ฒํผ์ ๋ฐ๊ฟ */
    change_btn(){
        const $btn = document.getElementById("ipt-btn");
        $btn.value = $btn.value ==  "์์" ? "์ ์ง" : "์์";
        $btn.classList.toggle('started');
    }//change_btn

    /* ์น๋ฆฌ ํ์  */
    is_win(){
        const {row,col,mine} = this.DATA.NUM;
        const opened = document.querySelectorAll('.opened').length;
        if(row * col - mine == opened){ this.quit(this.reason.win);}
    }//is_win

    /* ๊ฒ์ ์ข๋ฃ */
    quit(reason){
        this.change_btn();
        this.firstClicked = false;
        //์ง๋ขฐ ์ ๋ถ ๋ณด์ฌ์ฃผ๊ณ 
        this.DATA.reveal_all_mine();
        //์ด๋ฒคํธ ์ ๊ฑฐํ๊ณ 
        this.HANDLE.remove_listener();
        //์ธํฌ ํ๋ฉด ๊ด๋ จ, ํ์ด๋จธ...
        this.TIMER.reset_timer();
        this.INFO.display_message(reason);
    }//quit
}//class - Game
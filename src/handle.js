export class Handle{
    constructor(GAME){
        this.GAME = GAME;

        this.$tbl = document.getElementById('tbl').getElementsByTagName('TBODY')[0];

        this.find_unopen = false;
    }//constructor

    ////////// METHOD //////////
    /* 이벤트 등록 */
    add_listener(){
        //우클릭 방지
        this.$tbl.addEventListener('contextmenu', this.on_context);

        //마우스 이벤트 총괄 (좌,우,좌+우)
        this.$tbl.addEventListener('mousedown', this.on_down);

        //마우스 뗄 때 checking 해제
        this.$tbl.addEventListener('mouseup',this.disable_checking);
    }//add_listener

    /* 이벤트 제거 */
    remove_listener(){
        this.$tbl.removeEventListener('contextmenu', this.on_context);
        this.$tbl.removeEventListener('mousedown', this.on_down);
        this.$tbl.removeEventListener('mouseup',this.disable_checking);
    }//remove_listener

    /* 클릭 좌 우 좌+우 */
    on_down = (e) =>{
        //early return
        const target = e.target;
        if(target.tagName !== "TD"){return;}

        const rIdx = target.parentElement.rowIndex;
        const cIdx = target.cellIndex;

        //열린걸 눌렀지만 좌+우 클릭인 경우
        if(target.classList.contains('opened')){
            if(e.buttons == 3){this.left_right(rIdx,cIdx);}
            return;
        }//if


        /* 좌클릭 or 우클릭 */
        switch(e.button){
            case 0 : 
                this.left(target,rIdx,cIdx);
                break;

            case 2 : 
                this.right(target,rIdx,cIdx);
                break;
        }//switch        
    }//on_down

    /* 좌 + 우 클릭 */
    left_right(rIdx,cIdx){
        const ANSWER = this.GAME.DATA.ANSWER;
        //단순한 class toggle
        this.check_3x3(rIdx,cIdx,ANSWER);

        //깃발표시와 mine의 갯수가 일치한다면 open //위치가 틀릴시엔 자폭된다.
        this.GAME.DATA.open_auto_3x3(rIdx,cIdx);
    }//left_right

    /* 좌클릭 */
    left(target,rIdx,cIdx){
        //early return
        if(target.classList.contains('opened')){return;}
        if(target.classList.contains('question')){return;}
        if(target.classList.contains('flag')){return;}

        const DATA = this.GAME.DATA;
        const ANSWER = DATA.ANSWER;
        const {UNOPEN,MINE} = DATA.CODE;
        const clicked = ANSWER[rIdx][cIdx];
        
        switch(clicked){
            case UNOPEN :
                this.GAME.firstClicked = true;
                DATA.fill_number(rIdx,cIdx);
                this.GAME.is_win();
                break;
                
            case MINE :
                //첫클릭이 지뢰였던 경우엔
                if(!this.GAME.firstClicked){
                    this.GAME.firstClicked = true;
                    //지뢰 재귀로 옮기고
                    DATA.transfer_mine(rIdx,cIdx);

                    //숫자로 표기해조
                    ANSWER[rIdx][cIdx] = UNOPEN;
                    DATA.fill_number(rIdx,cIdx);
                    return;
                }
                //그 외엔 얄짤 없는 패배다.
                const {lost} = this.GAME.reason;
                this.GAME.quit(lost);
                break;
        }//switch
    }//left

    /* 우클릭 판정 */
    right(target,rIdx,cIdx){
        //early return
        if(target.classList.contains('opened')){return;}
        
        const DATA = this.GAME.DATA;
        const ANSWER = DATA.ANSWER;
        const {UNOPEN,QUESTION,FLAG,QUESTION_M,FLAG_M,MINE} = DATA.CODE;
        const cell = ANSWER[rIdx][cIdx];
        switch(cell){
            case UNOPEN :
                ANSWER[rIdx][cIdx] = QUESTION;
                this.question(target, true);
                break;

            case QUESTION :
                ANSWER[rIdx][cIdx] = FLAG;
                this.question(target, false);
                this.flag(target, true);
                this.GAME.INFO.display_flag(-1);
                break;

            case FLAG :
                ANSWER[rIdx][cIdx] = UNOPEN;
                this.flag(target, false);
                this.GAME.INFO.display_flag(+1);
                break;

            case MINE :
                ANSWER[rIdx][cIdx] = QUESTION_M;
                this.question(target, true);
                break;

            case QUESTION_M :
                ANSWER[rIdx][cIdx] = FLAG_M;
                this.question(target, false);
                this.flag(target, true);
                this.GAME.INFO.display_flag(-1);
                break;

            case FLAG_M :
                ANSWER[rIdx][cIdx] = MINE;
                this.flag(target, false);
                this.GAME.INFO.display_flag(+1);
                break;
            default:break;
        }//switch
    }//right

    /* 정직한 우클릭시 기본 동작 막기 */
    on_context = (e) =>{e.preventDefault();}

    /* 마우스 up */
    disable_checking = ()=>{
        const all_check = this.$tbl.querySelectorAll('.checking');
        all_check.forEach(td => { this.checking(td,false); });
    }//disable_checking

    /* 클래스 관련 */
    //checking 여러개
    check_3x3(rIdx,cIdx,ANSWER){
        const $allTR = this.$tbl.children;
        ANSWER[rIdx - 1]?.[cIdx-1] && this.check1x1($allTR,rIdx-1,cIdx-1);
        ANSWER[rIdx - 1]?.[cIdx] && this.check1x1($allTR,rIdx-1,cIdx);
        ANSWER[rIdx - 1]?.[cIdx+1] && this.check1x1($allTR,rIdx-1,cIdx+1)

        ANSWER[rIdx][cIdx-1] && this.check1x1($allTR,rIdx,cIdx-1)
        ANSWER[rIdx][cIdx+1] && this.check1x1($allTR,rIdx,cIdx+1)

        ANSWER[rIdx + 1]?.[cIdx-1] && this.check1x1($allTR,rIdx+1,cIdx-1);
        ANSWER[rIdx + 1]?.[cIdx] && this.check1x1($allTR,rIdx+1,cIdx);
        ANSWER[rIdx + 1]?.[cIdx+1] && this.check1x1($allTR,rIdx+1,cIdx+1);
    }//check_3x3

    check1x1($allTR,r,c){
        const $td = $allTR[r].children[c];
        if($td.classList.contains('opened')){return;}
        if($td.classList.contains('question')){return;}
        if($td.classList.contains('flag')){return;}
        this.checking($td,true);
    }//check1x1

    //checking 단일
    checking(td, bool){ td.classList.toggle('checking',bool);}

    //question
    question(td,bool){ td.classList.toggle('question',bool);}

    //flag
    flag(td,bool){ td.classList.toggle('flag',bool);}

    //opened
    opened(td,bool){td.classList.toggle('opened',bool);}
}//class-Handle
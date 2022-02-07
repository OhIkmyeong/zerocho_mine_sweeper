export class DataField{
    constructor(GAME){
        this.GAME = GAME;
        this.NUM = {row:undefined,col:undefined,mine:undefined};
        this.CODE = Object.freeze({
            UNOPEN : -1, QUESTION : -2, FLAG : -3,
            QUESTION_M:-4, FLAG_M:-5, MINE:-999,
            OPENED:0 //0~8
        });

        this.ANSWER = [];
    }//constructor
    /////// METHOD ////////
    /* init */
    init(row,col,mine){
        this.set_num(row,col,mine);
        this.plant_unopen();
        this.plant_mines();

        console.log(this.ANSWER);
    }//init

    /* 초기 정보를 저장한다 */
    set_num(row,col,mine){
        this.NUM.row = row;
        this.NUM.col = col;
        this.NUM.mine = mine;
    }//set_num

    /* 일반 값으로 초기세팅 */
    plant_unopen(){
        const {row,col} = this.NUM;
        const {UNOPEN} = this.CODE;
        this.ANSWER = Array.from(Array(row), ()=>new Array(col).fill(UNOPEN));
    }//plant_unopen

    /* 지뢰 심기 */
    plant_mines(){
        const {row,col,mine} = this.NUM;
        const {MINE} = this.CODE;
        const shuffle = this.get_shuffle(row,col,mine);

        shuffle.forEach(elem => {
            const rIdx = Math.floor(elem / row);
            const cIdx = elem % row;
            this.ANSWER[rIdx][cIdx] = MINE;
        });
    }//plant_mines

    /* 피셔예이츠 셔플 */
    get_shuffle(row,col,mine){
        const candidate = Array(row * col).fill().map((el,idx)=>idx);
        const shuffle = [];
        while(shuffle.length < mine){
            const random = Math.floor(Math.random() * candidate.length);
            const popped = candidate.splice(random,1)[0];
            shuffle.push(popped);
        }//while

        return shuffle;
    }//get_shuffle

    /* 지뢰갯수 세서 숫자넣기 */
    fill_number(rIdx,cIdx){
        const $td = this.GAME.HANDLE.$tbl.children[rIdx].children[cIdx];
        const mineCase = [this.CODE.MINE, this.CODE.FLAG_M, this.CODE.QUESTION_M];

        //early return
        if($td.classList.contains('opened')){return;}
        if(this.ANSWER[rIdx][cIdx] == this.CODE.FLAG){return;}
        if(mineCase.includes(this.ANSWER[rIdx][cIdx])){return;}

        let num_mine = 0;
        
        mineCase.includes(this.ANSWER[rIdx - 1]?.[cIdx-1]) && num_mine++;
        mineCase.includes(this.ANSWER[rIdx - 1]?.[cIdx]) && num_mine++; 
        mineCase.includes(this.ANSWER[rIdx - 1]?.[cIdx+1]) && num_mine++; 

        mineCase.includes(this.ANSWER[rIdx][cIdx-1]) && num_mine++; 
        mineCase.includes(this.ANSWER[rIdx][cIdx+1]) && num_mine++; 

        mineCase.includes(this.ANSWER[rIdx + 1]?.[cIdx-1]) && num_mine++; 
        mineCase.includes(this.ANSWER[rIdx + 1]?.[cIdx]) && num_mine++; 
        mineCase.includes(this.ANSWER[rIdx + 1]?.[cIdx+1]) && num_mine++; 

        $td.textContent = num_mine == 0 ? "" : num_mine;
        this.ANSWER[rIdx][cIdx] = num_mine;
        this.GAME.HANDLE.opened($td, true);

        if(this.ANSWER[rIdx][cIdx] == 0){this.clicked_zero(rIdx,cIdx);}
    }//fill_number

    /* 클릭한 영역이 0일때 */
    clicked_zero(rIdx,cIdx){
        this.ANSWER[rIdx - 1]?.[cIdx-1] && this.fill_number(rIdx-1, cIdx-1); 
        this.ANSWER[rIdx - 1]?.[cIdx] && this.fill_number(rIdx-1, cIdx);
        this.ANSWER[rIdx - 1]?.[cIdx+1] && this.fill_number(rIdx-1, cIdx+1);

        this.ANSWER[rIdx][cIdx-1] && this.fill_number(rIdx, cIdx-1); 
        this.ANSWER[rIdx][cIdx+1] && this.fill_number(rIdx, cIdx+1); 

        this.ANSWER[rIdx + 1]?.[cIdx-1] && this.fill_number(rIdx+1, cIdx-1); 
        this.ANSWER[rIdx + 1]?.[cIdx] && this.fill_number(rIdx+1, cIdx);
        this.ANSWER[rIdx + 1]?.[cIdx+1] && this.fill_number(rIdx+1, cIdx+1);
    }//clicked_zero

    /* 좌클릭 + 우클릭 : open_auto with numbers */
    open_auto_3x3(rIdx,cIdx){
        let bombs = this.ANSWER[rIdx][cIdx];
        let flags = 0;
        const $tr = this.GAME.HANDLE.$tbl.children;

        this.ANSWER[rIdx - 1]?.[cIdx-1] && this.is_flag($tr,rIdx-1,cIdx-1) && flags++;
        this.ANSWER[rIdx - 1]?.[cIdx] && this.is_flag($tr,rIdx-1,cIdx) && flags++;
        this.ANSWER[rIdx - 1]?.[cIdx+1] && this.is_flag($tr,rIdx-1,cIdx+1) && flags++;

        this.ANSWER[rIdx][cIdx-1] && this.is_flag($tr,rIdx,cIdx-1) && flags++;
        this.ANSWER[rIdx][cIdx+1] && this.is_flag($tr,rIdx,cIdx+1) && flags++;

        this.ANSWER[rIdx + 1]?.[cIdx-1] && this.is_flag($tr,rIdx+1,cIdx-1) && flags++;
        this.ANSWER[rIdx + 1]?.[cIdx] && this.is_flag($tr,rIdx+1,cIdx) && flags++;
        this.ANSWER[rIdx + 1]?.[cIdx+1] && this.is_flag($tr,rIdx+1,cIdx+1) && flags++;

        //flag의 갯수가 0이 아니고, 갯수가 같다면
        if(flags!==0 && flags == bombs){
            const rowStart = rIdx - 1 < 0 ? 0 : rIdx - 1;
            const rowEnd = rIdx + 1 >= this.NUM.row ? this.NUM.row -1 : rIdx+1;
            const colStart = cIdx - 1 < 0 ? 0 : cIdx - 1;
            const colEnd = cIdx + 1 >= this.NUM.col ? this.NUM.col -1 : cIdx+1;

            for(let r=rowStart; r<=rowEnd; r++){
                for(let c = colStart; c<=colEnd; c++){
                    console.log(r,c);
                    const target = $tr[r].children[c];
                    this.GAME.HANDLE.left(target,r,c);
                }//for-c
            }//for-r
        }//if
    }//open_auto_3x3

    /* 깃발 가졌는지 확인 */
    is_flag($tr,r,c){
        if($tr[r].children[c].classList.contains('flag')){return true;}
        return false;
    }//is_flag

    /* 지뢰 모두 까기 */
    reveal_all_mine(){
        const mineCase = [this.CODE.MINE, this.CODE.FLAG_M, this.CODE.QUESTION_M];
        const $tr = this.GAME.HANDLE.$tbl.children;

        for(let r = 0; r<this.NUM.row; r++){
            for(let c=0; c<this.NUM.col; c++){
                const cell = this.ANSWER[r][c];
                if(mineCase.includes(cell)){
                    const $td = $tr[r].children[c]; 
                    this.GAME.HANDLE.question($td,false);
                    this.GAME.HANDLE.flag($td,false);
                    $td.classList.add('bomb');
                }//if
            }//for-c
        }//for-r
    }//reveal_all_mine

    transfer_mine(rIdx,cIdx){
        /* early return */
        if(this.GAME.HANDLE.find_upopen){return;}

        const {UNOPEN, MINE} = this.CODE;

        if(this.ANSWER[rIdx][cIdx] == UNOPEN){
            this.GAME.HANDLE.find_upopen = true;
            this.ANSWER[rIdx][cIdx] = MINE;
            //개발자 모드
            // const $td = this.GAME.HANDLE.$tbl.children[rIdx].children[cIdx];
            // this.GAME.TBL.developer_mode($td);
            return;}

        this.ANSWER[rIdx-1]?.[cIdx-1] && this.transfer_mine(rIdx-1, cIdx-1);
        this.ANSWER[rIdx-1]?.[cIdx] && this.transfer_mine(rIdx-1, cIdx);
        this.ANSWER[rIdx-1]?.[cIdx+1] && this.transfer_mine(rIdx-1, cIdx+1);

        this.ANSWER[rIdx-1]?.[cIdx-1] && this.transfer_mine(rIdx, cIdx-1);
        this.ANSWER[rIdx-1]?.[cIdx+1] && this.transfer_mine(rIdx, cIdx+1);

        this.ANSWER[rIdx+1]?.[cIdx-1] && this.transfer_mine(rIdx+1, cIdx-1);
        this.ANSWER[rIdx+1]?.[cIdx] && this.transfer_mine(rIdx+1, cIdx);
        this.ANSWER[rIdx+1]?.[cIdx+1] && this.transfer_mine(rIdx+1, cIdx+1);
    }//transfer_mine
}//DataField

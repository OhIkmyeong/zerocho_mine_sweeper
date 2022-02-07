export class Info{
    constructor(GAME) {
        this.GAME = GAME;
        
        this.$message = document.getElementById('message');
        this.$flag = document.getElementById('flag');
        this.flag = 0;
    }//constructor

    started(){
        this.$message.textContent = `😊`;
        this.flag = this.GAME.DATA.NUM.mine;
        this.display_flag();
    }//started

    /* 깃발표시 */
    display_flag(num){
        this.flag += num ?? 0;
        this.$flag.textContent = this.flag;
    }//display_flag

    /* 메세지 표시 */
    display_message(reason){
        this.$message.textContent = reason;
    }//display_message

    /* 리셋 */
    reset(){
        this.$message.textContent = '';
        this.$flag.textContent = '';
        this.flag = 0;
    }//reset
    
}//class-Info
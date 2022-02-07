export class Timer{
    constructor(GAME){
        this.GAME = GAME;

        this.$timer = document.getElementById('timer');

        this.timer = undefined;
        this.start = null;
        this.passed = null;
        this.end = null;
    }//constructor

    ////////// METHOD //////////
    start_timer(){
        this.start = new Date();
        this.run_timer();
    }//start_timer

    run_timer(){
        this.end = new Date();
        this.passed = Math.floor((this.end - this.start) / 1000);
        this.display_timer();
        this.timer = setTimeout(()=>{
            this.run_timer();
        },1000);
    }//run_timer

    reset_timer(){
        clearTimeout(this.timer);
        this.timer = null;
        this.start = null;
        this.passed = null;
        this.end = null;
    }//reset_timer

    /* 타이머 표시 */
    display_timer(){
        const mm = String(Math.floor(this.passed / 60)).padStart(2,"0");
        const ss = String(this.passed % 60).padStart(2,"0");
        this.$timer.textContent = `${mm}:${ss}`;
    }//display_timer
}//class-Timer
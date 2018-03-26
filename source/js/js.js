/*
* 尋寶遊戲
*
取得 [英文-數字] 的陣列
設定寶藏(太陽)，炸彈(雪花)，愛心(蛋糕)的位置
判斷玩家點擊的目標是否是寶藏，炸彈，愛心，如果是....就...
設定玩家有血量
找到炸彈，減少1條血
找到愛心，增加1條血
找到寶藏，結束遊戲 --> win
血 == 0，結束遊戲 --> game over
點擊 restart 重新開始遊戲
*
*/


//遊戲前的環境準備

//設置可控制的變數，以便更改遊戲設置
//假設列為4*4
const en = {
    0: "a",
    1: "b",
    2: "c",
    3: "d"
};
let hp;
const totalHp = 6; //總血量
const treasureLeng = 1;
const heartLeng = 3;
const bombLeng = 5;
let arr = [];
let treasure;
let heart = [];
let bomb = [];


//控制項
let $board = document.getElementsByClassName("chessboard")[0];
let $grids = document.getElementsByClassName("grid");
let $resault = document.getElementById("result");
let $heartGroup = document.getElementById("heartGroup");
let $hearts = document.getElementsByClassName("hpHeart");
let $emptyHeart = document.getElementsByClassName("isEmpty");
let $restart = document.getElementById("restart");


function init() {

    //初始畫設置
    hp = 3;
    arr = [];
    createHeart(totalHp, heart.length);
    $resault.innerHTML = "Game Start !!";
    $board.classList.remove("gameEnd");

    for (let q = 0; q < $grids.length; q++) {
        $grids[q].classList.remove("open","treasure","heart","bomb");
        $grids[q].innerHTML = "";
    }

    //準備陣列數字
    function getArray() {
        function getMath() {
            let letter = Math.round(Math.random()*3);
            let number = Math.floor((Math.random() * 4) + 1);
            return  en[letter] + "-" + number;
        }

        let same = true;
        let arrLeng = treasureLeng + heartLeng + bombLeng;
        while (arr.length < arrLeng) {
            let str = getMath();
            for (let n in arr) {
                if (str === arr[n]) {
                    same = false;
                }
            }
            if (same) {
                arr.push(str);
            }

            same = true;
        }
        //console.log(arr);
    }

    //取得陣列
    getArray();


    treasure = arr[0];
    heart = [arr[1],arr[2],arr[3]];
    bomb = [arr[4],arr[5],arr[6],arr[7],arr[8]];


//設定寶藏class
    let treasureDiv = document.querySelector("#"+treasure);
    treasureDiv.classList.add("treasure");
    let treasureIcon = document.createElement("i");
    treasureIcon.className = "material-icons";
    treasureIcon.innerHTML = "wb_sunny";
    treasureDiv.appendChild(treasureIcon);

//設定血class
    for (let i=0;i<heart.length;i++){
        document.querySelector("#"+heart[i]).classList.add("heart");
        let heartIcon = document.createElement("i");
        heartIcon.className = "material-icons";
        heartIcon.innerHTML = "cake";
        document.querySelector("#"+heart[i]).appendChild(heartIcon);
    }

//設定炸彈class
    for (let i = 0; i < bomb.length; i++) {
        document.querySelector("#"+bomb[i]).classList.add("bomb");
        let bombIcon = document.createElement("i");
        bombIcon.className = "material-icons";
        bombIcon.innerHTML = "ac_unit";
        document.querySelector("#"+bomb[i]).appendChild(bombIcon);
    }

//設定血條
    function createHeart(total, battle) {
        $heartGroup.innerHTML = "";
        for (let i = 0; i < total; i++) {
            let div = document.createElement("div");
            let icon = document.createElement("span");
            div.className = "hpHeart";
            icon.className = "material-icons";
            icon.innerHTML = "cake";
            div.appendChild(icon);
            $heartGroup.appendChild(div);
        }
        for(let l = battle; l < total; l++) {
            document.getElementsByClassName("hpHeart")[l].classList.add("isEmpty");
        }
    }

    createHeart(totalHp, heart.length);
}


init();


//判斷是否含有class
function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

//開始遊戲
$board.addEventListener("click", function (event) {
    let $target = event.target;
    $target.classList.add("open");
    //遊戲結束
    function gameEnd() {
        $board.classList.add("gameEnd");
    }

    //點擊到treasure
    if (hasClass($target, "treasure")) {
        $resault.innerHTML = "Win !!";
        gameEnd();
    }
    //點擊到heart
    if (hasClass($target, "heart")) {
        if(hp < totalHp && hasClass($emptyHeart[0], "isEmpty")) {
            $emptyHeart[0].classList.remove("isEmpty");
            hp++
        }
    }
    //點擊到bomb
    if (hasClass($target, "bomb")) {
        $hearts[$hearts.length - $emptyHeart.length - 1].classList.add("isEmpty");
        if (hp > 0 && hp <= totalHp) {
            hp --
        }
        if (hp === 0) {
            $resault.innerHTML = "Game over !!";
            gameEnd();
        }
    }

});

//重新開始

$restart.addEventListener("click", function () {

    init();
});

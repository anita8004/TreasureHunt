/*
* 炸彈遊戲
*
取得 [英文-數字] 的陣列
設定寶藏，炸彈，愛心的位置
取得玩家輸入的陣列
判斷陣列的位置是否符合寶藏，炸彈，愛心的位置，如果是....不是...
設定玩家有5條血
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
var en = {
    0: "a",
    1: "b",
    2: "c",
    3: "d"
};
var hp;
var totalHp = 6; //總血量
var treasureLeng = 1;
var heartLeng = 3;
var bombLeng = 5;
var arr = [];
var treasure;
var heart = [];
var bomb = [];




//控制項
var $board = document.getElementsByClassName("chessboard")[0];
var $resault = document.getElementById("result");
var $heartGroup = document.getElementById("heartGroup");
var $hearts = document.getElementsByClassName("hpHeart");
var $emptyHeart = document.getElementsByClassName("isEmpty");
var $restart = document.getElementById("restart");
var $grids = document.getElementsByClassName("grid");


function init() {

    //初始畫設置
    hp = 3;
    arr = [];
    createHeart(totalHp, heart.length);
    $resault.innerHTML = "Game Start !!";
    $board.classList.remove("gameEnd");

    for (var q = 0; q < $grids.length; q++) {
        $grids[q].classList.remove("open","treasure","heart","bomb");
        $grids[q].innerHTML = "";
    }


    //準備陣列數字
    function getArray() {
        function getMath() {
            var letter = Math.round(Math.random()*3);
            var number = Math.floor((Math.random() * 4) + 1);
            return  en[letter] + "-" + number;
        }

        var same = true;
        var arrLeng = treasureLeng + heartLeng + bombLeng;
        while (arr.length < arrLeng) {
            var str = getMath();
            for (var n in arr) {
                if (str === arr[n]) {
                    same = false;
                }
            }
            if (same) {
                arr.push(str);
            }

            same = true;
        }
        arr = arr;
        //console.log(arr);
    }

    //取得陣列
    getArray();


    treasure = arr[0];
    heart = [arr[1],arr[2],arr[3]];
    bomb = [arr[4],arr[5],arr[6],arr[7],arr[8]];


//設定寶藏class
    var treasureDiv = document.querySelector("#"+treasure);
    treasureDiv.classList.add("treasure");
    var treasureIcon = document.createElement("i");
    treasureIcon.className = "material-icons";
    treasureIcon.innerHTML = "wb_sunny";
    treasureDiv.appendChild(treasureIcon);

//設定血class
    for (var i=0;i<heart.length;i++){
        document.querySelector("#"+heart[i]).classList.add("heart");
        var heartIcon = document.createElement("i");
        heartIcon.className = "material-icons";
        heartIcon.innerHTML = "cake";
        document.querySelector("#"+heart[i]).appendChild(heartIcon);
    }

//設定炸彈class
    for (var i = 0; i < bomb.length; i++) {
        document.querySelector("#"+bomb[i]).classList.add("bomb");
        var bombIcon = document.createElement("i");
        bombIcon.className = "material-icons";
        bombIcon.innerHTML = "ac_unit";
        document.querySelector("#"+bomb[i]).appendChild(bombIcon);
    }

//設定血條
    function createHeart(total, battle) {
        $heartGroup.innerHTML = "";
        for (var i = 0; i < total; i++) {
            var div = document.createElement("div");
            var icon = document.createElement("span");
            div.className = "hpHeart";
            icon.className = "material-icons";
            icon.innerHTML = "cake";
            div.appendChild(icon);
            $heartGroup.appendChild(div);
        }
        for(var l = battle; l < total; l++) {
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
    var $target = event.target;
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

/* Treasure Hunt */

const en = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd'
}
let hp
const totalHp = 6 // 總血量

// 控制項

const $board = document.querySelector('.chessboard')
// const $grids = document.querySelectorAll('.grid')
const $resault = document.querySelector('#result')
const $heartGroup = document.querySelector('#heartGroup')
const $hearts = document.querySelectorAll('.hpHeart')
const $emptyHeart = document.querySelectorAll('.isEmpty')
const $restart = document.querySelector('#restart')

// 創建血條

let createHeart = () => {
  let i = 0
  while (i < totalHp) {
    let div = document.createElement('div')
    div.classList.add('hpHeart')
    if (i >= 3) div.classList.add('isEmpty')
    div.innerHTML = '<span class="material-icons">cake</span>'
    $heartGroup.appendChild(div)
    i++
  }
}

// 創建太陽、冰雪、蛋糕棋子

class Chess {
  constructor (sun = 1, cake = 3, snow = 5) {
    this.sunLeng = sun
    this.cakeLeng = cake
    this.snowLeng = snow
    this.arr = []
  }
  getMath () {
    let letter = Math.round(Math.random() * 3)
    let number = Math.floor((Math.random() * 4) + 1)
    return `#${en[letter]}-${number}`
  }
  setLocation () {
    let arrLeng = this.sunLeng + this.cakeLeng + this.snowLeng
    let isdiff = true
    let arr = this.arr
    while (arr.length < arrLeng) {
      let str = this.getMath()
      for (let n in arr) {
        if (str === arr[n]) isdiff = false
      }
      if (isdiff) arr.push(str)
      isdiff = true
    }
    return arr
  }
  getLocation (array, ...index) {
    let arr = array
    let location = []
    for (let i = 0; i < index.length; i++) {
      location.push(arr[index[i]])
    }
    return location
  }
  buildChess (name, location, iconName) {
    let chesses = []
    for (let i = 0; i < location.length; i++) {
      chesses.push(...document.querySelectorAll(location[i]))
    }
    for (let i = 0; i < chesses.length; i++) {
      chesses[i].classList.add(name)
      chesses[i].innerHTML = `<i class="material-icons">${iconName}</i>`
    }
  }
}

/* 初始化 */

let init = () => {
  hp = 3
  // arr = []
  createHeart()
  $resault.innerHTML = 'Game Start !!'
  $board.classList.remove('gameEnd')

  let chess = new Chess()
  let chessLoc = chess.setLocation()

  let sun = new Chess()
  let sunLoc = sun.getLocation(chessLoc, 0)
  sun.buildChess('sun', sunLoc, 'wb_sunny')

  let cake = new Chess()
  let cakeLoc = cake.getLocation(chessLoc, 1, 2, 3)
  cake.buildChess('cake', cakeLoc, 'cake')

  let snow = new Chess()
  let snowLoc = snow.getLocation(chessLoc, 4, 5, 6, 7, 8)
  snow.buildChess('snow', snowLoc, 'ac_unit')
}

init()

// 判斷是否含有class
function hasClass (elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ')
}

// 開始遊戲
$board.addEventListener('click', function (event) {
  let $target = event.target
  $target.classList.add('open')
  // 遊戲結束
  function gameEnd () {
    $board.classList.add('gameEnd')
  }

  // 點擊到treasure
  if (hasClass($target, 'sun')) {
    $resault.innerHTML = 'Win !!'
    gameEnd()
  }
  // 點擊到heart
  if (hasClass($target, 'cake')) {
    if (hp < totalHp && hasClass($emptyHeart[0], 'isEmpty')) {
      $emptyHeart[0].classList.remove('isEmpty')
      hp++
    }
  }
  // 點擊到bomb
  if (hasClass($target, 'snow')) {
    $hearts[$hearts.length - $emptyHeart.length - 1].classList.add('isEmpty')
    if (hp > 0 && hp <= totalHp) {
      hp--
    }
    if (hp === 0) {
      $resault.innerHTML = 'Game over !!'
      gameEnd()
    }
  }
})

// 重新開始

$restart.addEventListener('click', function () {
  init()
})

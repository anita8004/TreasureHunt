/* Treasure Hunt */

const en = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd'
}
let hp
const totalHp = 6 // 總血量
let arr = []

// 控制項

const $board = document.querySelector('.chessboard')
// const $grids = document.querySelectorAll('.grid')
const $resault = document.querySelector('#result')
const $heartGroup = document.querySelector('#heartGroup')
// const $hearts = document.querySelectorAll('.hpHeart')
// const $emptyHeart = document.querySelectorAll('.isEmpty')
const $restart = document.querySelector('#restart')

// #region 創建血條

class LifeCake {
  constructor (hp = 3, totalHp = 6) {
    this.hp = hp
    this.totalHp = totalHp
  }
  createHeart () {
    $heartGroup.innerHTML = ''
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
}

let hpChange = (hp) => {
  let $hearts = document.querySelectorAll('.hpHeart')
  $hearts.forEach(e => {
    e.classList.remove('isEmpty')
  })
  for (let i = hp; i < totalHp; i++) {
    $hearts[i].classList.add('isEmpty')
  }
}

// #endregion

// #region 創建太陽、冰雪、蛋糕棋子

class Chess {
  constructor (sun = 1, cake = 3, snow = 5) {
    this.sunLeng = sun
    this.cakeLeng = cake
    this.snowLeng = snow
  }
  getMath () {
    let letter = Math.round(Math.random() * 3)
    let number = Math.floor((Math.random() * 4) + 1)
    return `#${en[letter]}-${number}`
  }
  setLocation () {
    let arrLeng = this.sunLeng + this.cakeLeng + this.snowLeng
    let isdiff = true
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

// #endregion

/* 初始化 */

let init = () => {
  hp = 3
  let lifecake = new LifeCake()
  lifecake.createHeart()
  // lifecake.hpChange(hp)

  $resault.innerHTML = 'Game Start !!'
  $board.classList.remove('gameEnd')

  arr = []
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
let hasClass = (element, className) => {
  // console.log(element.classList.contains(className))
  return element.classList.contains(className)
}

let playing = {
  gridOpen (ele) {
    ele.classList.add('open')
  },
  clickChess (chess) {
    switch (chess) {
      case 'sun':
        $resault.innerHTML = 'Game win !!'
        $board.classList.add('gameEnd')
        break
      case 'cake':
        if (hp < totalHp) {
          hp++
          hpChange(hp)
          console.log(hp)
        }
        break
      case 'snow':
        if (hp > 0) {
          hp--
          hpChange(hp)
          console.log(hp)
        }
        break
      default:
        console.log('什麼都沒有')
    }
  },
  lose () {
    $resault.innerHTML = 'Game over !!'
    $board.classList.add('gameEnd')
  }
}

// 開始遊戲
$board.addEventListener('click', (e) => {
  let target = e.target
  playing.gridOpen(target)
  if (hasClass(target, 'sun')) {
    playing.clickChess('sun')
  }
  if (hasClass(target, 'cake')) {
    playing.clickChess('cake')
  }
  if (hasClass(target, 'snow')) {
    playing.clickChess('snow')
  }
  if (hp === 0) {
    playing.lose()
  }
})

// 重新開始

$restart.addEventListener('click', function () {
  init()
})

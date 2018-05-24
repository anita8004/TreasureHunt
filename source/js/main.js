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
const $grids = document.querySelectorAll('.grid')
const $resault = document.querySelector('#result')
const $heartGroup = document.querySelector('#heartGroup')
const $restart = document.querySelector('#restart')

// #region 創建血條

class LifeCake {
  constructor (hp = 3, totalHp = 6) {
    this.hp = hp
    this.totalHp = totalHp
  }
  createHeart (ele) {
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
  constructor (sun = 1, cake = 3, snow = 5, arr = []) {
    this.arr = arr
    this.sunLeng = sun
    this.cakeLeng = cake
    this.snowLeng = snow
  }
  getMath () {
    let letter = Math.round(Math.random() * 3)
    let number = Math.floor((Math.random() * 4) + 1)
    return `#${en[letter]}-${number}`
  }
  clearArr () {
    this.arr = []
  }
  setLocation () {
    let arrLeng = this.sunLeng + this.cakeLeng + this.snowLeng
    let thisArr = this.arr
    let isdiff = true
    while (thisArr.length < arrLeng) {
      let str = this.getMath()
      for (let n in thisArr) {
        if (str === thisArr[n]) isdiff = false
      }
      if (isdiff) thisArr.push(str)
      isdiff = true
    }
    return thisArr
  }
  getLocation (index = [0], array = this.setLocation()) {
    let location = []
    for (let i = 0; i < index.length; i++) {
      location.push(array[index[i]])
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

// #region

// 判斷是否含有class
let hasClass = (element, className) => {
  return element.classList.contains(className)
}

// 判斷遊戲動作與狀態

let playing = {
  gridOpen (ele) {
    ele.classList.add('open')
  },
  gridClose (ele) {
    ele.classList.remove('open')
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
        }
        break
      case 'snow':
        if (hp > 0) {
          hp--
          hpChange(hp)
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

// #endregion

/* 初始化 */

let init = () => {
  hp = 3
  $grids.forEach((ele) => {
    playing.gridClose(ele)
    ele.innerHTML = ''
    ele.classList.remove('sun')
    ele.classList.remove('cake')
    ele.classList.remove('snow')
  })
  let lifecake = new LifeCake()
  lifecake.createHeart()

  $resault.innerHTML = 'Game Start !!'
  $board.classList.remove('gameEnd')

  let chess = new Chess()
  let sunLoc = chess.getLocation()
  let cakeLoc = chess.getLocation([1, 2, 3])
  let snowLoc = chess.getLocation([4, 5, 6, 7, 8])

  chess.buildChess('sun', sunLoc, 'wb_sunny')
  chess.buildChess('cake', cakeLoc, 'cake')
  chess.buildChess('snow', snowLoc, 'ac_unit')
  // console.log(sunLoc, cakeLoc, snowLoc)
}

init()

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

import Graph from '../animation/graph.js'
import Animation from '../animation/index.js'
import tree from '../index.js'
import dataGenerate from './data-generate.js'
let graph = new Graph(tree)
window.graph = graph
let nums = 4
let isRandom = true
let datas = dataGenerate(nums, isRandom)
init()
let animation

function init () {
  datas.forEach(key => {
      graph.doInsert(key, false)
  })
  graph.canvas.renderAll()
}

function getNextKey () {
  return window.myKey || datas.shift()
}

function insertBtn () {
  let key = datas.shift()
  if (key) graph.doInsert(key)
}

function nextBtn (action = 'insert') {
  if (!datas.length) return
  if (!animation) {
    animation = new Animation(graph)
    animation[action](getNextKey())
  } else {
    if (animation.flow.next === 'finished') {
      animation[action](getNextKey())
    }
    animation.next()
  }
}
function bindButton (id, fn) {
  document.getElementById(id).addEventListener('click', function (e) {
    // fn('insert')
    fn('remove')
  }, false)
}


bindButton('insert', insertBtn)
bindButton('next', nextBtn)

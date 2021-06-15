import Graph from '../animation/graph.js'
import Animation from '../animation/index.js'
import tree from '../index.js'
import dataGenerate from './data-generate.js'
import Dom from './bind-dom.js'
let graph = new Graph(tree)
let animation = new Animation(graph)
let dom = new Dom(animation)

window.graph = graph
let nums = 40
let isRandom = false
let datas = dataGenerate(nums, isRandom)
graph.generateNodes(datas)
// init()

function init () {
  datas.forEach(key => {
      graph.doInsert(key, false)
  })

  graph.canvas.renderAll()
}

function getNextKey () {
  return window.myKey //|| datas.shift()
}


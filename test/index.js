import Graph from '../animation/graph.js'
import Animation from '../animation/index.js'
import tree from '../index.js'
import dataGenerate from './data-generate.js'
let graph = new Graph(tree)
let animation = new Animation(graph)

window.graph = graph
let nums = 40
let isRandom = false
let datas = dataGenerate(nums, isRandom)
// init()

function init () {
  datas.forEach(key => {
      graph.doInsert(key, false)
  })
  graph.canvas.renderAll()
}

function getNextKey () {
  return window.myKey || datas.shift()
}

function bindEvent (selectorName, fn, eventName = 'click') {
  let doms = document.querySelectorAll(selectorName)
  doms.forEach(function (dom) {
    dom.addEventListener(eventName, function (e) {
      fn(e, this)
    }, false)
  })
}

function setDomStatus (status) {
  let disabled = {next: true, prev: true}
  if (status === 'insert') {
    disabled = {remove: true}
  }
  if (status === 'remove') {
    disabled = {insert: true}
  }
  document.querySelectorAll('button').forEach(function (dom) {
    if (disabled[dom.id]) dom.disabled = true
    else dom.disabled = false
  })
}

bindEvent('#next', function () {
  animation.next()
  if (!animation.inFlow) {
    setDomStatus()
  }
})

bindEvent('.autoplay', function (e, dom) {
  animation.isAutoPlay = !animation.isAutoPlay
}, 'change')
let as = ['insert', 'remove']
as.forEach((action) => {
  bindEvent('#' + action, function () {
    setDomStatus(action)
    let key = getNextKey()
    animation[action](key)
    // let key = datas.shift()
    // if (key) graph.doInsert(key)
  })
})
import Graph from '../graph/index.js'
import Animation from '../animation/index.js'
import tree from '../index.js'
import dataGenerate from './data-generate.js'
let graph = new Graph(tree)
let datas = dataGenerate(35)
datas.forEach(key => {
    graph.doInsert(key, false)
})
graph.canvas.renderAll()

let animation

function insertBtn () {
  let key = datas.shift()
  if (key) graph.doInsert(key)
}

function nextBtn () {
  if (!animation) {
    animation = new Animation(graph, {
      type: 'find',
      findKey: 5
    })
  } else {
    animation.next()
  }
}
function bindButton (id, fn) {
  document.getElementById(id).addEventListener('click', function (e) {
    fn(e)
  }, false)
}


bindButton('insert', insertBtn)
bindButton('next', nextBtn)

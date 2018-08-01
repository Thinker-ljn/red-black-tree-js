import InsertFlow from './insert-flow.js'

class Animation {
  constructor (graph) {
    this.interval = 1000
    this.graph = graph
    this.steps = []

    this.msg = ''
    this.flow = {}
  }

  next () {
    let step = this.flow.execNext()
    if (!step) return false

    this.steps.push(step)
    step.exec(this.graph)

    if (step.msg) {
      this.msg += step.msg + '</br>'
      document.getElementById('msg').innerHTML = this.msg
    }
    this.graph.renderAll()
  }

  prev () {

  }

  find () {

  }

  insert (key) {
    this.flow = new InsertFlow(this.graph.tree, key)
  }
}

export default Animation

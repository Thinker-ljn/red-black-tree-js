import InsertFlow from './flow/normal-insert.js'
import RemoveFlow from './flow/normal-remove.js'

class Animation {
  constructor (graph) {
    this.interval = graph.interval + 500
    this.isAutoPlay = false
    this.graph = graph
    this.steps = []
    this.flow = null

    this.inFlow = false

    this.dom = null
  }

  next () {
    if (!this.flow || !this.inFlow) {
      if (this.timer) window.clearInterval(this.timer)
      return
    }
    let step = this.flow.execNext()
    if (!step) return false

    this.steps.push(step)
    step.exec(this.graph)
    this.dom.msg = `【${step.action}】: ${step.msg}`

    if (step.nextEnd) {
      if (this.dom) this.dom.actionDone()
      window.clearInterval(this.timer)
    }
    this.graph.renderAll()
  }

  prev () {

  }

  find () {

  }

  insert (key) {
    if (!key) {
      key = this.graph.nodeList.shift()
    }
    this.flow = new InsertFlow(this.graph.tree, key)
    this.prepare()
  }

  remove (key) {
    this.flow = new RemoveFlow(this.graph.tree, key)
    this.prepare()
  }

  prepare () {
    this.inFlow = true
    this.dom.msg = this.flow.title
    if (this.isAutoPlay) {
      this.startPlay()
    }
  }

  startPlay () {
    this.timer = window.setInterval(this.next.bind(this), this.interval)
  }
}

export default Animation

import InsertFlow from './flow/normal-insert.js'
import RemoveFlow from './flow/normal-remove.js'

class Animation {
  constructor (graph) {
    this.interval = graph.interval + 500
    this.isAutoPlay = true
    this.graph = graph
    this.steps = []
    this.flow = null

    this.inFlow = false
    this._msg = ''
    this.msgDom = document.getElementById('msg')
  }

  next () {
    if (!this.flow || !this.inFlow) return
    let step = this.flow.execNext()
    if (!step) return false
    if (step.nextEnd) {
      this.inFlow = false
      window.clearInterval(this.timer)
    }

    this.steps.push(step)
    step.exec(this.graph)

    this.msg = `【${step.action}】: ${step.msg}</br>`
    this.graph.renderAll()
  }

  prev () {

  }

  find () {

  }

  insert (key) {
    this.inFlow = true
    this.flow = new InsertFlow(this.graph.tree, key)
    this.msg = `</br>开始插入【${key}】</br></br>`
    if (this.isAutoPlay) {
      this.startPlay()
    }
  }

  remove (key) {
    this.inFlow = true
    this.flow = new RemoveFlow(this.graph.tree, key)
    this.msg = `</br>开始删除【${key}】</br></br>`
  }

  set msg (m) {
    this._msg += m
    this.msgDom.innerHTML = this._msg
    this.msgDom.scrollTop = this.msgDom.scrollHeight
  }

  startPlay () {
    this.timer = window.setInterval(this.next.bind(this), this.interval)
  }
}

export default Animation

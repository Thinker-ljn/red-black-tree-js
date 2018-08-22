import InsertFlow from './flow/normal-insert.js'
import RemoveFlow from './flow/normal-remove.js'

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
      this.msg += `【${step.action}】: ${step.msg}</br>`
      let msgDom = document.getElementById('msg')
      msgDom.innerHTML = this.msg
      msgDom.scrollTop = msgDom.scrollHeight
    }
    this.graph.renderAll()
  }

  prev () {

  }

  find () {

  }

  insert (key) {
    this.flow = new InsertFlow(this.graph.tree, key)
    if (this.msg) this.msg += '</br></br>'
  }

  remove (key) {
    this.flow = new RemoveFlow(this.graph.tree, key)
    if (this.msg) this.msg += `</br></br>`
    else this.msg += `删除【${key}】</br></br>`
  }
}

export default Animation

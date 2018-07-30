import StepFind from './find.js'

class Animation {
  constructor (graph, options) {
    this.interval = 1000
    this.type = options.type
    this.graph = graph
    this.stepFind = new StepFind(graph, null, options.findKey)
  }

  next () {
    this.stepFind.exec()
  }

  prev () {

  }
}

export default Animation

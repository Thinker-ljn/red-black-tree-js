import {
  beforeOfTheNode
} from '../lib/utils.js'
class Step {
  constructor (action, payload, msg) {
    this.isBig = payload.isBig || false

    this.action = action
    this.payload = payload
    this.msg = msg
  }

  exec (graph) {
    if (typeof this[this.action] !== 'function') return
    this[this.action](graph)
  }

  createNode (graph) {
    graph.drawNode(this.payload.node)
  }

  insertFirst (graph) {
    this.payload.node.pos = {x: 20, y: 60}
    let graphNode = graph.move(this.payload.node, {left: 20, top: 60})
    graphNode.__dye('black')
  }

  setCurr (graph) {
    graph.drawCurrNode(this.payload.node)
  }

  preInsert (graph) {
    let {child, node} = this.payload
    let pos = {
      x: node.parent.pos.x,
      y: node.parent.pos.y + 60
    }
    if (child === 'left') {
      pos.x -= 20
    } else {
      pos.x += 20
    }
    graph.clearCurr()
    graph.drawLine(node, node.parent)

    graph.generateTreeData(graph.tree)

    let map = graph.tree.inorderList.reduce((p, c) => {
      p[c.key] = c
      return p
    }, {})
    let objects = graph.canvas._objects
    console.log(objects)
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.__type === 'line') {
        let cp = map[object.__cnodeKey].pos
        let pp = map[object.__pnodeKey].pos

        graph.move(object, {x1: cp.x, y1: cp.y, x2: pp.x, y2: pp.y})
      }
      if (object.__type === 'node') {
        let {x, y} = map[object.__value].pos

        graph.move(object, {left: x, top: y})
      }

    }
  }
}

export default Step

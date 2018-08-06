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
    graph.move(this.payload.node, {left: 20, top: 60})
  }

  setCurr (graph) {
    graph.drawCurrNode(this.payload.node)
  }

  dye (graph) {
    let graphNode = graph.findGraphNode(this.payload.node)
    graphNode.__dye(this.payload.color)
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
    graph.drawLine(node, node.parent)

    graph.generateTreeData(graph.tree)

    let map = graph.tree.inorderList.reduce((p, c) => {
      p[c.key] = c
      return p
    }, {})
    let objects = graph.canvas._objects

    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.__type === 'line') {
        let cp = map[object.__cnodeKey].pos
        let pp = map[object.__pnodeKey].pos

        graph.move(object, {x1: cp.x, y1: cp.y, x2: pp.x, y2: pp.y})
      }
      if (object.__type === 'node') {
        // if (object.__value === node.key) {
        //   object.__dye(node.color)
        //   this.setCurr(graph)
        // }

        let {x, y} = map[object.__value].pos

        graph.move(object, {left: x, top: y})
      }
    }
  }

  rotate (graph) {
    let {direction, node} = this.payload

    let objects = graph.canvas._objects

    let childKey = direction === 'left' ? 'right' : 'left'
    let child = node[childKey]

    if (child) {
      let line1 = graph.findGraphLine(node, child)
      if (line1) {
        line1.__pnodeKey = child.key
        line1.__cnodeKey = node.key
      }
      if (child[direction]) {
        let line2 = graph.findGraphLine(child, child[direction])
        if (line2) {
          line2.__pnodeKey = node.key
        }
      }
    }

    if (node.parent) {
      let line3 = graph.findGraphLine(node.parent, node)
      if (line3) {
        line3.__cnodeKey = child.key
      }
    }

    graph.tree[direction + 'Rotate'](node)
    this.doAnimation(graph)
  }

  doAnimation (graph) {
    graph.generateTreeData(graph.tree)

    let map = graph.tree.inorderList.reduce((p, c) => {
      p[c.key] = c
      return p
    }, {})
    let objects = graph.canvas._objects

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

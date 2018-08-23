class Step {
  constructor (action, payload, msg) {
    this.isBig = payload.isBig || false

    this.action = action
    this.payload = payload
    this.msg = msg
    this.nextEnd = false
  }

  exec (graph) {
    if (typeof this[this.action] === 'function') {
      this[this.action](graph)
    }

    if (this.nextEnd) {
      graph.clearCurr()
    }
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
    let graphNode = this.payload.node.graph
    this.payload.node.color = this.payload.color
    graphNode.__dye(this.payload.color)
  }

  preInsert (graph) {
    let {which, node, parent} = this.payload
    let pos = {
      x: 20,
      y: 60
    }

    if (!parent) {
      graph.tree.root = node
    } else {
      node.parent = parent
      parent[which] = node
      pos.x = node.parent.pos.x,
      pos.y = node.parent.pos.y + 60
    }

    if (which === 'left') {
      pos.x -= 20
    } else {
      pos.x += 20
    }
    if (parent) {
      node.graph.__parent = parent.graph
      let arrow = graph.drawArrow(parent, node)
      node.graph.setRelation(arrow)
    }

    this.doAnimation(graph)
  }

  findBeforeNode (graph) {
    let {bNode, lines} = this.payload
    graph.drawBeforeNode(bNode, lines)
  }

  copyBnToDn (graph) {
    let {bNode, dNode} = this.payload
    let bn = bNode.graph
    let dn = dNode.graph

    dNode.key = bNode.key
    dn.text.set({
      text: bNode.key + '',
      left: bn.left - dn.left,
      top: bn.top - dn.top
    })
    dn.text.moveTo(graph.canvas._objects.length)
    graph.move(dn.text, {left: 0, top: 0})
  }

  remove (graph) {
    let {dNode, child} = this.payload
    if (dNode.parent) {
      let parent = dNode.parent
      let which = dNode.which
      if (child) {
        parent[which] = child
        child.parent = parent

        child.graph.__parent = parent.graph

        let arrow = graph.drawArrow(parent, child)
        child.graph.setRelation(arrow)
      }
    } else {
      graph.tree.root = child || null
    }
    dNode.graph.remove()
    this.doAnimation(graph)
  }

  removeBeforeNode (graph) {
    let {bNode, dNode} = this.payload
    let objects = graph.canvas._objects
    let beforeGraphNode = null
    let childGraphNode = null
    let bChild = bNode.left ? bNode.left : bNode.right
    let bParent = bNode.parent
    let which = bParent.left === bNode ? 'left' : 'right'
    bParent[which] = bChild
    if (bChild) bChild.parent = bParent

    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.constructor.name === 'GraphArrow') {
        object.changeColor('#fff')
      }

      if (object.__type === 'beforeNode') {
        graph.canvas.remove(object)
      }

      if (object.__value === bNode.key) {
        beforeGraphNode = object
      }

      if (bChild && object.__value === bChild.key) {
        childGraphNode = object
      }
    }

    if (childGraphNode) {
      let line1 = graph.findGraphLine(bParent, bNode)
      let line2 = graph.findGraphLine(bNode, bChild)
      line1.__cnodeKey = bChild.key
      graph.canvas.remove(line2)

      let [circle, text] = beforeGraphNode._objects
      circle.set({fill: '#999', stroke: circle.fill})
      graph.move(circle, {
        radius: 18
      })

      beforeGraphNode.remove(text)
      beforeGraphNode.__value = bChild.key
      beforeGraphNode.__type = 'bNode'
      this.doAnimation(graph)
    } else {
      let line3 = graph.findGraphLine(bParent, bNode)
      graph.canvas.remove(beforeGraphNode, line3)
    }
  }

  rotate (graph) {
    let {direction, node} = this.payload

    let objects = graph.canvas._objects

    let childKey = direction === 'left' ? 'right' : 'left'
    let child = node[childKey]

    let arrow1 = node.graph.__parentArrow
    let arrow2 = child.graph.__parentArrow
    if (arrow1) {
      arrow1.changeChild(child)
    }

    if (child) {
      if (child[direction]) {
        child[direction].graph.__parentArrow.changeParent(node)
      }
      arrow2.changeDirection()
    }

    graph.tree[direction + 'Rotate'](node)
    this.doAnimation(graph)
  }

  doAnimation (graph) {
    graph.generateTreeData()

    let objects = graph.canvas._objects

    let currKey = graph.currNode ? graph.currNode.__key : null
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.constructor.name === 'GraphArrow') {
        let {x: x1, y: y1} = object.__pnode.pos
        let {x: x2, y: y2} = object.__cnode.pos

        object.move({x1, y1, x2, y2})
      }
      if (object.constructor.name === 'GraphNode' || object.__type === 'bNode') {
        let {x: left, y: top} = object.__node.pos

        graph.move(object, {left, top})

        if (object.__node.key === currKey) {
          graph.move(graph.currNode, {left, top})
        }
      }
    }
  }
}

export default Step

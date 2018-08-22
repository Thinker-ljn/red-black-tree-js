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

  remove (graph) {
    let {node, child} = this.payload
    if (node.parent) {
      let p = node.parent
      let which = p.left === node ? 'left' : 'right'
      if (child) {
        p[which] = child
        child.parent = p

        let line1 = graph.findGraphLine(p, node)
        line1.__cnodeKey = child.key
        graph.removeGraphLine(node, child)
        graph.removeGraphNode(child)
      }
    } else {
      graph.tree.root = child

      graph.removeGraphLine(node, child)
      graph.removeGraphNode(child)
    }
    this.doAnimation(graph)
  }

  findBeforeNode (graph) {
    let {bNode, lines} = this.payload
    graph.drawBeforeNode(bNode, lines)
  }

  copyBnToDn (graph) {
    let {bNode, dNode} = this.payload
    let bn = null
    let dn = null
    let objects = graph.canvas._objects
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.__type === 'node' && object.__value === bNode.key) {
        bn = object
      }

      if (object.__type === 'node' && object.__value === dNode.key) {
        dn = object
      }
    }
    dNode.key = bNode.key
    let text = new fabric.Text(bNode.key + '', {
      left: bn.left,
      top: bn.top,
      fontSize: 10,
      fill: '#fff',
      originX: 'center',
      originY: 'center'
    })
    text.__type = 'beforeText'
    graph.canvas.add(text)
    graph.move(text, {left: dn.left, top: dn.top})
    let [dc, dt] = dn._objects
    dt.set({fill: dc.fill})
  }

  remove (graph) {
    let {node, child} = this.payload

    let parent = node.parent
    let which = parent.left === node ? 'left' : 'right'
    parent[which] = child
    if (child) {
      child.parent = parent
      let line1 = graph.findGraphLine(parent, node)
      let line2 = graph.findGraphLine(node, child)
      line1.__cnodeKey = child.key
      graph.canvas.remove(line2)

      let graphNode = graph.findGraphNode(node)
      let [circle, text] = graphNode._objects
      circle.set({fill: '#999', stroke: circle.fill})
      graph.move(circle, {
        radius: 18
      })

      graphNode.remove(text)
      graphNode.__value = child.key
      graphNode.__type = 'bNode'
    }
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
      if (object.stroke === 'blue') {
        object.set({stroke: '#fff'})
      }

      if (object.__type === 'beforeNode' || object.__type === 'beforeText') {
        graph.canvas.remove(object)
      }

      if (object.__type === 'node' && object.__value === dNode.key) {
        object._objects[1].set({fill: '#fff'})
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

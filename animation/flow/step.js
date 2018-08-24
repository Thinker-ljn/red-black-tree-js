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
      graph.clearDirty()
    }
  }

  createNode (graph) {
    graph.drawNode(this.payload.node)
  }

  preInsert (graph) {
    let {which, node, parent} = this.payload
    if (!parent) {
      graph.tree.root = node
    } else {
      node.parent = parent
      parent[which] = node
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

    graph.drawNodeStatus(bNode, 'needRemove')
  }

  remove (graph) {
    let node = this.payload.needRemoveNode
    let objects = graph.canvas._objects
    let bChild = node.left ? node.left : node.right

    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.constructor.name === 'GraphArrow') {
        object.changeColor('#fff')
      }

      if (object.__type === 'beforeNode') {
        graph.canvas.remove(object)
      }
    }

    this._remove(graph, node, bChild)
    node.graph.remove()
    this.doAnimation(graph)
  }

  _remove (graph, dNode, child) {
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
  }

  setNeedRemove (graph) {
    let node = this.payload.node
    graph.clearStatus('curr')
    graph.drawNodeStatus(node, 'needRemove')
  }

  setCurr (graph) {
    let node = this.payload.node
    if (node.key === null) {
      let graphNode = graph.drawNode(node)
      graph.nullNode = graphNode
    }
    graph.drawNodeStatus(node, 'curr')
  }

  dye (graph) {
    let graphNode = this.payload.node.graph
    this.payload.node.color = this.payload.color
    graphNode.__dye(this.payload.color)
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

        object.move({x1, y1, x2, y2}, graph.interval)
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

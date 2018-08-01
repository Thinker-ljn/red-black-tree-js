function Graph (tree) {
  this.tree = tree
  this.canvas = new fabric.StaticCanvas('canvas', {
    renderOnAddRemove: false,
    backgroundColor: '#999'
  })

  this.canvas.setHeight(document.body.clientHeight)
  this.canvas.setWidth(document.body.clientWidth)

  this.intervalX = 20
  this.intervalY = 60
  this.origin = {
    x: document.body.clientWidth / 2,
    y: this.intervalY
  }
  this.currNode = null
}

Graph.prototype = {
  renderAll () {
    this.canvas.renderAll()
  },
  draw (autoRender = true) {
    this.canvas.remove(...this.canvas.getObjects())
    this.generateTreeData(this.tree)
    this.tree.traversal('level', this.drawNode.bind(this))
    if (autoRender) this.renderAll()
  },
  drawNode (node) {
    let graphNode = this.drawCircle(node.key, node.pos, node.color)
    if (node.parent) {
      this.drawLine(node, node.parent)
    }

    return graphNode
  },
  drawLine (node, pnode) {
    let line = new fabric.Line([node.pos.x, node.pos.y, pnode.pos.x, pnode.pos.y], {
      strokeWidth: 2,
      stroke: '#fff',
      selectable: false,
      hasBorders: true,
      lockUniScaling: true,
      lockRotation: true,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingFlip: true,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      originX: 'center',
      originY: 'center'
    })
    line.__type = 'line'
    line.__cnodeKey = node.key
    line.__pnodeKey = pnode.key
    this.canvas.add(line)
    line.moveTo(0)
  },
  drawCircle (value, pos, color) {
    let circle = new fabric.Circle({
      radius: 15,
      fill: color || '#999',
      strokeWidth: 1,
      stroke: '#fff',
      originX: 'center',
      originY: 'center'
    })

    let text = new fabric.Text(value + '', {
      fontSize: 10,
      fill: '#fff',
      originX: 'center',
      originY: 'center'
    })

    let group = new fabric.Group([ circle, text ], {
      left: pos.x,
      top: pos.y,
      originX: 'center',
      originY: 'center'
    })
    group.__value = value
    group.__type = 'node'
    // group.on('selected', () => {
    //   this.doRemove(group.value)
    // })
    group.__dye = function (color) {
      circle.set({
        fill: color
      })
    }
    this.canvas.add(group)
    return group
  },
  generateTreeData () {
    let callback = this.getTraversalCallback()
    this.tree.traversal('inorder', callback)
  },
  doInsert (key) {
    this.tree.insert(key)
    this.draw()
  },
  doRemove (key) {
    this.tree.remove(key)
    this.draw()
  },
  getTraversalCallback () {
    let prevLeft = null
    let width = this.canvas.width
    let intervalX = this.intervalX
    let intervalY = this.intervalY
    return function (node, deep) {
      let x
      if (prevLeft === null) {
        x = intervalX
      } else {
        x = prevLeft + intervalX
      }

      let y = deep * intervalY

      node.pos = {
        x: x,
        y: y
      }

      prevLeft = x
    }
  }
}

export default Graph

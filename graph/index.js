function Graph (tree) {
  this.tree = tree
  this.canvas = new fabric.Canvas('canvas', {
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
  draw (autoRender = true) {
    this.canvas.remove(...this.canvas.getObjects())
    this.generateTreeData(this.tree)
    this.tree.traversal('level', this.drawNode.bind(this))
    if (autoRender) this.canvas.renderAll()
  },
  drawNode (node) {
    this.drawCircle(node.key, node.pos, node.color)
    if (node.parent) {
      this.drawLine(node.pos, node.parent.pos)
    }
  },
  drawCurrNode (node) {
    if (!this.currNode) {
      this.currNode = new fabric.Circle({
        radius: 20,
        strokeWidth: 1,
        fill: '#999',
        stroke: 'yellow',
        left: node.pos.x,
        top: node.pos.y,
        originX: 'center',
        originY: 'center'
      })
      this.canvas.add(this.currNode)
      this.currNode.moveTo(0)
      this.canvas.renderAll()
    } else {
      this.currNode.animate('left', node.pos.x, {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: 200
      })

      this.currNode.animate('top', node.pos.y, {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: 200
      })
    }
  },
  drawLine (node1, node2) {
    let line = new fabric.Line([node1.x, node1.y, node2.x, node2.y], {
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
    this.canvas.add(line)
    line.moveTo(0)
  },
  drawCircle (value, pos, color = '#999') {
    let circle = new fabric.Circle({
      radius: 15,
      fill: color,
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
    group.value = value
    group.on('selected', () => {
      this.doRemove(group.value)
    })
    this.canvas.add(group)
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

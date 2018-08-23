import Node from './node.js'
import Arrow from './arrow.js'
function Graph (tree) {
  this.tree = tree
  this.canvas = new fabric.StaticCanvas('canvas', {
    renderOnAddRemove: false,
    backgroundColor: '#999'
  })

  this.canvas.setHeight(document.body.clientHeight)
  this.canvas.setWidth(document.body.clientWidth)

  this.startX = 40
  this.startY = 40
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
    let graphNode = new Node(node)
    this.canvas.add(graphNode)
    if (node.parent) {
      let arrow = this.drawArrow(node.parent, node)
      graphNode.setRelation(arrow)
    }
    return graphNode
  },
  drawArrow (parent, node) {
    let arrow = new Arrow(parent, node)
    this.canvas.add(arrow, arrow.tr)
    arrow.moveTo(0)
    return arrow
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
    let {intervalX, intervalY, startX, startY} = this
    return function (node, deep) {
      let x = prevLeft === null ? startX : prevLeft + intervalX
      let y = deep > 1 ? deep * intervalY : startY

      node.pos = {
        x: x,
        y: y
      }

      prevLeft = x
    }
  },

  print () {
    let objs = this.canvas._objects
    for (let i = 0; i < objs.length; i++) {
      let o = objs[i]

      if (o.constructor.name === 'GraphNode') {
        console.log("")
        console.log("==================")
        console.log(`node: 【 ${o.__node.key} 】`)
        for (let k of ['__parentArrow', '__leftArrow', '__rightArrow']) {
          if (o[k]) {
            let p = o[k]
            console.log(`${k}: 【 ${p.__pnode.key} --- ${p.__cnode.key} 】`)
          }
        }
      }
    }
  }
}

export default Graph

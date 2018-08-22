let FabricLine = fabric.Line

class GraphArrow extends FabricLine {
  constructor (pnode, cnode) {
    let {x: x1, y: y1} = pnode.pos
    let {x: x2, y: y2} = cnode.pos

    super([x1, y1, x2, y2], {
      strokeWidth: 2,
      stroke: '#fff',
      originX: 'center',
      originY: 'center'
    })
    this.r = 15
    this.__pnode = pnode
    this.__cnode = cnode
    this.__parent = null
    this.__child = null

    this.setTr()
  }

  setTr () {
    let {x1, y1, x2, y2} = this
    let tr = new fabric.Triangle({
      angle: 180,
      width: 13,
      height: 10,
      left: 0,
      top: 0,
      fill: '#fff',
      originX: 'center',
      originY: 'center'
    })

    this.tr = tr
    this.setAngle()
  }

  setAngle () {
    let {x1, y1, x2, y2} = this
    let angle = Math.atan2((y2 - y1), (x2 - x1)) / Math.PI * 180

    let [x, y] = this.getTrPos()

    this.tr.set({
      left: x,
      top: y,
      angle: angle + 90
    })
  }

  getTrPos () {
    let {x1, y1, x2, y2} = this
    let x = Math.abs(x2 - x1)
    let y = Math.abs(y2 - y1)
    let z = Math.sqrt(x * x + y * y)

    let rate = (z - this.r - 3) / z

    return [(x2 - x1) * rate + x1, (y2 - y1) * rate + y1]
  }

  setRelation (child, parent) {
    // this.__parent = parent
    // this.__child = child
  }

  // 1
  changeChild (newCNode) {
    this.__cnode.graph.removeArrow('parent')

    newCNode.graph.setArrow('parent', this)
    this.__cnode = newCNode
  }

  // 2
  changeParent (newPNode) {
    let which = this.__cnode.which
    this.__pnode.graph.removeArrow(which)

    which = which === 'left' ? 'right' : 'left'
    newPNode.graph.setArrow(which, this)
    this.__pnode = newPNode
  }

  // 3
  changeDirection () {
    let [cnode, pnode] = [this.__cnode, this.__pnode]
    this.changeParent(cnode)
    this.changeChild(pnode)
  }
  move (props) {
    for (let key in props) {
      this.animate(key, props[key], {
        onChange: () => {
          this.canvas.renderAll.bind(this.canvas)
          this.setAngle()
        },
        duration: 200
      })
    }
  }
}

export default GraphArrow
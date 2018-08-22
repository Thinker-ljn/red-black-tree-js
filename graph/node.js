let FabricNode = fabric.Group

function getObjects ({key, pos, color}) {
  let circle = new fabric.Circle({
    radius: 15,
    // fill: color || '#999',
    strokeWidth: 1,
    stroke: '#fff',
    originX: 'center',
    originY: 'center'
  })

  let text = new fabric.Text(key + '', {
    fontSize: 10,
    fill: '#fff',
    originX: 'center',
    originY: 'center'
  })

  return [circle, text]
}

class GraphNode extends FabricNode {
  constructor (node) {
    let [circle, text] = getObjects(node)
    let {x, y} = node.pos
    super([circle, text], {
      left: x,
      top: y,
      originX: 'center',
      originY: 'center'
    })

    this.circle = circle
    this.text = text
    this.__node = node
    this.__color = node.color
    if (node.parent) {
      this.__parent = node.parent.graph
    }

    this.__parentArrow = null
    this.__leftArrow = null
    this.__rightArrow = null

    this.__left = null
    this.__right = null

    node.graph = this
  }

  setRelation (arrow) {
    this.__parentArrow = arrow

    let which = this.__node.which
    this.__parent.setArrow(which, arrow)
    arrow.setRelation(this, this.__parent)
  }

  setArrow (which, arrow) {
    this['__' + which + 'Arrow'] = arrow
  }

  removeArrow (which) {
    this['__' + which + 'Arrow'] = null
  }

  __dye (color) {
    this.circle.set({
      fill: color
    })
  }
}

export default GraphNode
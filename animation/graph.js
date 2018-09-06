import BaseGraph from '../graph/index.js'
import Node from '../lib/node.js'

class AnimationGraph extends BaseGraph {
  constructor (tree) {
    super(tree)
    this.nullNode = null
    this.statusNode = {
      curr: null,
      needRemove: null
    }
    this.statusColor = {
      curr: 'yellow',
      needRemove: '#ff6666'
    }
  }

  move (node, props) {
    let graphNode = node
    if (graphNode instanceof Node) {
      graphNode = this.findGraphNode(node)
    }
    if (!graphNode) return

    for (let key in props) {
      graphNode.animate(key, props[key], {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: this.interval
      })
    }

    return graphNode
  }

  clearDirty () {
    this.clearStatus()

    if (this.nullNode) {
      let parent = this.nullNode.__node.parent
      this.nullNode.remove()
      this.nullNode = null

      parent.createNullNode()
    }
  }

  clearStatus (status) {
    if (status && this.statusNode[status]) {
      this.canvas.remove(this.statusNode[status])
      this.statusNode[status] = null
    } else {
      for (let k in this.statusNode) {
        if (this.statusNode[k]) {
          this.canvas.remove(this.statusNode[k])
          this.statusNode[k] = null
        }
      }
    }
  }
  drawNodeStatus (node, status) {
    if (this.statusNode[status] === undefined) return
    if (this.statusNode[status]) {
      let snode = this.statusNode[status]
      this.move(snode, {left: node.pos.x,  top: node.pos.y})
    } else {
      let snode = new fabric.Circle({
        radius: 20,
        strokeWidth: 2,
        fill: '',
        stroke: this.statusColor[status],
        left: node.pos.x,
        top: node.pos.y,
        originX: 'center',
        originY: 'center'
      })
      this.canvas.add(snode)
      snode.moveTo(0)
      this.canvas.renderAll()
      this.statusNode[status] = snode
    }
  }

  findGraphNode (node) {
    let objects = this.canvas._objects
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.__type === 'node' && object.__value === node.key) {
        return object
      }
    }

    return null
  }

  findGraphLine (pnode, cnode) {
    let objects = this.canvas._objects
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.__type === 'line' && object.__pnodeKey === pnode.key && object.__cnodeKey === cnode.key) {
        return object
      }
    }

    return null
  }

  removeGraphNode (node) {
    let gn = this.findGraphNode(node)
    if (gn) this.canvas.remove(gn)
  }

  removeGraphLine (pnode, cnode) {
    let gl = this.findGraphLine(pnode, cnode)
    if (gl) this.canvas.remove(gl)
  }

  drawBeforeNode (bNode, lines) {
    let objects = this.canvas._objects
    let bn = null
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i]
      if (object.constructor.name === 'GraphArrow' && lines[object.__pcKey]) {
        object.changeColor('blue')
      }
      if (object.__node === bNode) {
        bn = new fabric.Circle({
          radius: 18,
          strokeWidth: 1,
          fill: '#999',
          stroke: 'blue',
          left: object.left,
          top: object.top,
          originX: 'center',
          originY: 'center'
        })
        bn.__type = 'beforeNode'
      }
    }
    if (bn) {
      this.canvas.add(bn)
      bn.moveTo(0)
    }
  }

  moveNodeList () {
    this.nodeList.forEach((graphNode, i) => {
      let node = graphNode.__node

      node.pos.x = i * 40 + 30
      this.move(graphNode, {
        left: i * 40 + 30
      })
    })
  }
}

export default AnimationGraph

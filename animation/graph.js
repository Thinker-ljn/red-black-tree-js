import BaseGraph from '../graph/index.js'
import Node from '../lib/node.js'

class AnimationGraph extends BaseGraph {
  constructor (tree) {
    super(tree)
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
        duration: 200
      })
    }

    return graphNode
  }

  clearCurr () {
    if (this.currNode) {
      this.canvas.remove(this.currNode)
      this.currNode = null
    }
  }

  drawCurrNode (node) {
    if (!this.currNode) {
      this.currNode = new fabric.Circle({
        radius: 20,
        strokeWidth: 1,
        fill: '',
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
    this.currNode.__key = node.key
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
}

export default AnimationGraph

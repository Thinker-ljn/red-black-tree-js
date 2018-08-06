import Step from './step.js'
import Node from '../../lib/node.js'
import {
  setRed,
  setBlack,
  uncle,
  sibling,
  grandpa
} from '../../lib/utils.js'

const compareMap = {
  left: '待插入节点小于当前节点，',
  right: '待插入节点大于当前节点，'
}
const relationMap = {
  red: '红色',
  black: '黑色',
  grandpa: '当前节点的祖父节点',
  uncle: '当前节点的叔叔节点',
  parent: '当前节点的父节点',
  self: '当前节点',
  insert: '插入节点',
  root: '根节点',
  sibling: '当前节点的兄弟节点',
  left: '当前节点的左子节点',
  right: '当前节点的右子节点'
}

class Base {
  constructor (tree, currNode) {
    this.next = ''
    this.tree = tree
    this.currNode = currNode
  }

  execNext () {
    if (this.next === 'finished') return null
    let execProcess = this[this.next]
    let step
    if (typeof execProcess === 'function') step = execProcess.call(this)
    if (typeof execProcess === 'object') {
      step = execProcess.execNext()
      if (execProcess.next === 'finished') {
        this.next = this.getNext(this.next)
      }
    }
    return step
  }

  setCurr (relation) {
    if (relation instanceof Node) {
      this.currNode = relation
      relation = 'insert'
    } else {
      this.currNode = this.relationParse(relation)
    }

    let msg = `${compareMap[relation] || ''}将${relationMap[relation]}设为新当前节点`
    return this.genStep('setCurr', {node: this.currNode}, msg)
  }

  dye (color, relation = 'self') {
    let msg = ''
    if (relationMap[relation] === void 0) {
      msg = relation
      relation = 'self'
    }

    let node = this.relationParse(relation)

    if (!msg) msg = `将当前节点${relationMap[relation]}染成${relationMap[color]}`

    return this.genStep('dye', {node: node, color: color}, msg)
  }

  rotate () {
    let msg = '以当前节点进行' + (this.rotateDirection === 'left' ? '左' : '右') + '旋'
    return this.genStep('rotate', {direction: this.rotateDirection, node: this.currNode}, msg)
  }

  genStep (action, payload, msg) {
    return new Step(action, payload, msg)
  }

  relationParse (relation) {
    switch (relation) {
      case 'self': return this.currNode
      case 'root': return this.tree.root
      case 'insert': return this.currNode
      case 'parent': return this.currNode.parent
      case 'left': return this.currNode.left
      case 'right': return this.currNode.right
      case 'uncle': return uncle(this.currNode)
      case 'grandpa': return grandpa(this.currNode)
      case 'sibling': return sibling(this.currNode)
    }
  }
}

export default Base

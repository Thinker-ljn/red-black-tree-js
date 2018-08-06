import Step from '../step.js'
import {
  setRed,
  setBlack,
  uncle,
  sibling,
  grandpa
} from '../../../lib/utils.js'
const relationMap = {
  red: '红色',
  black: '黑色',
  grandpa: '的祖父节点',
  uncle: '的叔叔节点',
  parent: '的父节点',
  self: '',
  sibling: '的兄弟节点',
  left: '的左子节点',
  right: '的右子节点'
}

class Dye {
  constructor (node, color, relation = 'self') {
    let msg = ''
    if (relationMap[relation] === void 0) {
      msg = relation
      relation = 'self'
    }

    this.node = relation === 'self' ? node : this[relation](node)
    this.color = color
    this.relation = relation

    this.msg = msg || `将当前节点${relationMap[relation]}染成${relationMap[color]}`
  }

  exec () {
    this[this.color](this.node)
    return new Step('dye', {node: this.node, color: this.color}, this.msg)
  }

  black (node) {
    setBlack(node)
  }

  red (node) {
    setRed(node)
  }

  grandpa (node) {
    return grandpa(node)
  }

  uncle (node) {
    return uncle(node)
  }

  parent (node) {
    return node.parent
  }
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
    let msg = (relation === 'root' ? '将根节点' : `将当前节点${relationMap[relation]}`) + '设为新当前节点'
    this.currNode = this.relationParse(relation)
    return new Step('setCurr', {node: this.currNode}, msg)
  }

  dye (color, relation = 'self') {
    let dyeProcess = new Dye(this.currNode, color, relation)
    return dyeProcess.exec()
  }

  rotate () {
    let msg = '以当前节点进行' + (this.rotateDirection === 'left' ? '左' : '右') + '旋'
    return new Step('rotate', {direction: this.rotateDirection, node: this.currNode}, msg)
  }

  pushStep () {

  }

  relationParse (relation) {
    switch (relation) {
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

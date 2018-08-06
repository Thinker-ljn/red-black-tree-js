import Node from '../../lib/node.js'
import Step from './step.js'
import Fixup from './steps/fixup.js'
import {
  isLeftChild,
  isRightChild,
  isRed,
  isBlack,
  setRed,
  setBlack,
  uncle,
  sibling,
  grandpa
} from '../../lib/utils.js'

class InsertFlow {
  constructor (tree, key) {
    this.bigStepList = ['create', 'insert', 'fixup', 'finished']
    this.next = 'create'

    this.tree = tree
    this.key = key
    this.insertNode = null
    this.currNode = null

    this.fix = null
  }

  execNext () {
    if (this.next === 'finished') return null

    return this[this.next]()
  }

  create () {
    this.insertNode = new Node(this.key)
    this.next = 'isEmpty'
    return new Step('createNode', {node: this.insertNode}, '创建一个待插入节点')
  }

  isEmpty () {
    if (!this.tree.root) {
      this.next = 'setCurrInsert' // finished
      this.tree.root = this.insertNode
      return new Step('insertFirst', {node: this.insertNode}, '当前树为空，直接插入节点')
    } else {
      this.next = 'compare'
      return this.setCurr(this.tree.root, '当前节点指向根节点')
    }
  }

  compare () {
    let cNode = this.currNode
    let insertKey = this.insertNode.key
    if (insertKey < cNode.key) {
      return this.isEmptyChild('left')
    } else if (cNode.key < insertKey) {
      return this.isEmptyChild('right')
    } else {
      this.next = 'finished'
      return new Step('equal', {}, '已有相同节点，不能插入')
    }
  }

  isEmptyChild (child) {
    let cn = {left: '左子节点', right: '右子节点'}
    let cm = {left: '小于', right: '大于'}
    let msg = `待插入节点${cm[child]}当前节点, `

    if (this.currNode[child]) {
      this.next = 'compare'
      this.currNode = this.currNode[child]
      return this.setCurr(this.currNode, msg + '当前节点指向其' + cn[child])
    } else {
      this.next = 'setCurrInsert'
      this.insertNode.parent = this.currNode
      this.currNode[child] = this.insertNode
      this.currNode = this.insertNode
      return new Step(
        'preInsert',
        {child: child, node: this.insertNode},
        msg + `${cn[child]}为空，直接插入`
      )
    }
  }

  // insertNode (node, parent = null, childKey = '') {
  //   if (parent === null) {
  //     this.tree.root = node
  //   } else {
  //     node.parent = this.parent
  //     node.color = 'red'
  //     parent[childKey] = node
  //   }
  //   return this.setCurr(node, '当前节点指向新插入的节点')
  // }
  setCurrInsert () {
    this.next = 'fixup'
    this.currNode = this.insertNode
    return new Step('setCurr', {node: this.currNode}, '将插入节点设为当前节点')
  }

  setCurr (node, msg) {
    this.currNode = node
    return new Step('setCurr', {node: node}, msg)
  }

  fixup () {
    if (!this.fix) this.fix = new Fixup(this.tree, this.currNode)

    let step = this.fix.execNext()

    if (this.fix.next === 'finished') {
      this.next = 'finished'
    }

    return step
  }
}

export default InsertFlow

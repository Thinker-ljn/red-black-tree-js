import Node from '../lib/node.js'
import Step from './step.js'

class InsertFlow {
  constructor (tree, key) {
    this.bigStepList = ['create', 'insert', 'fixup', 'finished']
    this.status = ''

    this.tree = tree
    this.key = key
    this.insertNode = null
    this.compareNode = null
  }

  execNext () {
    if (this.status === 'finished') return null
    if (!this.status) {
      this.status = this.bigStepList.shift()
    }
    return this[this.status]()
  }

  create () {
    this.insertNode = new Node(this.key)
    this.status = ''
    return new Step('createNode', {node: this.insertNode}, '创建一个待插入节点')
  }

  insert () {
    if (this.tree.root === null) {
      this.tree.root = this.insertNode
      this.status = 'finished'
      return new Step('insertFirst', {node: this.insertNode}, '当前树为空，直接设为根')
    }

    if (this.compareNode === null) {
      this.compareNode = this.tree.root
      return new Step('setCurr', {node: this.compareNode}, '当前节点指向根节点，将待插入节点与当前节点比较')
    }

    let cNode = this.compareNode
    let insertKey = this.insertNode.key
    let child = ''
    if (insertKey < cNode.key) {
      child = 'left'
    } else if (cNode.key < insertKey) {
      child = 'right'
    } else {
      return new Step('equal', {}, '已有相同节点，不能插入')
    }

    let cn = {left: '左子节点', right: '右子节点'}
    let cm = {left: '小于', right: '大于'}
    let msg = `待插入节点${cm[child]}当前节点, `
    if (cNode[child]) {
      this.compareNode = cNode[child]
      return new Step('setCurr', {node: this.compareNode}, msg + '当前节点指向其' + cn[child] + '，再次比较')
    } else {
      this.status = 'finished'
      this.insertNode.parent = this.compareNode
      this.compareNode[child] = this.insertNode
      return new Step(
        'preInsert',
        {child: child, node: this.insertNode},
        msg + `${cn[child]}为空，直接插入, 开始调整颜色`)
    }
  }

  fixup () {

  }
}

export default InsertFlow

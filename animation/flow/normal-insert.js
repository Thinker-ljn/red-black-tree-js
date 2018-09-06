import Node from '../../lib/node.js'
import GraphNode from '../../graph/node.js'
import Base from './base.js'
import Fixup from './fixup-insert.js'

class InsertFlow extends Base {
  constructor (tree, key) {
    super(tree, null)
    this.init(key)
  }

  init (key) {
    this.insertNode = null
    this.key = key
    this.next = 'create'

    if (key instanceof GraphNode) {
      this.insertNode = key.__node
      this.key = key.__node.key
      this.next = 'isEmpty'
    }

    this.title = `开始插入【${this.key}】`
    this.fix = null
  }

  create () {
    this.insertNode = new Node(this.key)
    this.next = 'isEmpty'
    return this.genStep('createNode', {node: this.insertNode}, '创建一个待插入节点')
  }

  isEmpty () {
    if (this.tree.root.isNull) {
      this.next = 'setCurrInsert' // finished
      return this.genStep('insert', {node: this.insertNode}, '当前树为空，直接插入节点')
    } else {
      this.next = 'compare'
      return this.setCurr('root')
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
      return this.genStep('equal', {}, '已有相同节点，不能插入')
    }
  }

  isEmptyChild (which) {
    let cm = {left: '小于', right: '大于'}
    let cn = {left: '左子节点', right: '右子节点'}
    let msg = `待插入节点${cm[which]}当前节点, `

    if (!this.currNode[which].isNull) {
      this.next = 'compare'
      return this.setCurr(which)
    } else {
      this.next = 'setCurrInsert'
      return this.genStep(
        'insert',
        {
          node: this.insertNode,
          parent: this.currNode,
          which: which
        },
        msg + `${cn[which]}为空，直接插入`
      )
    }
  }

  setCurrInsert () {
    this.next = 'fixup'
    return this.setCurr(this.insertNode)
  }

  fixup () {
    if (!this.fix) this.fix = new Fixup(this.tree, this.currNode)

    let step = this.fix.execNext()

    if (this.fix.next === 'finished') {
      this.next = 'finished'
      step.nextEnd = true
    }

    return step
  }
}

export default InsertFlow

import Base from './base.js'
import Fixup from './fixup-remove.js'
import {
  isRed
} from '../../lib/utils.js'

class RemoveFlow extends Base {
  constructor (tree, key) {
    super(tree, null)
    this.next = 'isEmpty'

    this.bigFlow = true
    this.key = key
    this.deleteNode = null
    this.theBeforeNode = null

    this.fix = null
  }

  isEmpty () {
    if (this.tree.root.isNull) {
      this.next = 'finished' // finished
      return this.genStep('error', {}, '当前树为空，删除出错！')
    } else {
      this.next = 'findTarget'
      return this.setCurr('root')
    }
  }

  findTarget () {
    let cNode = this.currNode
    let insertKey = this.key
    if (insertKey < cNode.key) {
      return this.isEmptyChild('left')
    } else if (cNode.key < insertKey) {
      return this.isEmptyChild('right')
    } else {
      return this.setNeedRemovedNode(cNode)
    }
  }

  isEmptyChild (child) {
    let cm = {left: '小于', right: '大于'}
    let cn = {left: '左子节点', right: '右子节点'}

    if (!this.currNode[child].isNull) {
      this.next = 'findTarget'
      return this.setCurr(child)
    } else {
      this.next = 'finished'
      return this.genStep('error', {}, `查找值${cm[child]}当前节点, ${cn[child]}为空，删除出错！`)
    }
  }

  setNeedRemovedNode (node) {
    this.next = 'isHasChild'
    this.theNeedRemoveNode = node
    return this.genStep('setNeedRemove', {node: node}, '当前节点等于查找值，设置为待删除节点')
  }

  isHasChild () {
    let node = this.theNeedRemoveNode
    if (!node.left.isNull && !node.right.isNull) {
      return this.findBeforeNode(node)
    } else {
      return this.remove(node)
    }
  }

  findBeforeNode (node) {
    let bNode = node.left
    let lines = {}
    if (!bNode.isNull) lines[node.key + '-' + bNode.key] = true
    while (!bNode.isNull && !bNode.right.isNull) {
      lines[bNode.key + '-' + bNode.right.key] = true
      bNode = bNode.right
    }
    lines[bNode.parent.key + '-' + bNode.key] = true

    this.next = 'copyBnToDn'
    this.theBeforeNode = bNode

    return this.genStep('findBeforeNode', {bNode: bNode, lines: lines}, '待删除节点有两个子节点，需找出其前置节点，前置节点是待删除节点的左子节点的最右子孙节点')
  }

  copyBnToDn () {
    this.next = 'remove'
    let {theBeforeNode, theNeedRemoveNode} = this
    this.theNeedRemoveNode = this.theBeforeNode
    return this.genStep(
      'copyBnToDn',
      {bNode: theBeforeNode, dNode: theNeedRemoveNode},
      '复制前置节点的值到待删除节点, 把待删除节点指向其前置节点'
    )
  }

  remove (node = null) {
    if (!node) node = this.theNeedRemoveNode
    this.whichRemove = node.which
    this.currNode = node.parent
    this.next = 'fixup'
    let s1 = ''
    let s2 = ''
    if (node.left) {
      s1 = '只有左'
      s2 = '，并用左子节点替代自己'
    } else if (node.right) {
      s1 = '只有左'
      s2 = '，并用左子节点替代自己'
    } else {
      s1 = '没有'
    }
    return this.genStep('remove', {needRemoveNode: node}, `待删除节点${s1}子节点，直接删除${s2}`)
  }

  fixup () {
    if (isRed(this.theBeforeNode)) {
      this.next = 'finished'
      return this.genStep('finished', {}, '被删除节点是红色节点，无需调整颜色，删除完成')
    }
    if (!this.fix) this.fix = new Fixup(this.tree, this.currNode, this.whichRemove)

    let step = this.fix.execNext()

    if (this.fix.next === 'finished') {
      this.next = 'finished'
      step.nextEnd = true
    }

    return step
  }
}

export default RemoveFlow
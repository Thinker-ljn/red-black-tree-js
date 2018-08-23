import Base from './base.js'
import Fixup from './fixup-remove.js'
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

class RemoveFlow extends Base {
  constructor (tree, key) {
    super(tree, null)
    this.next = 'isEmpty'

    this.bigFlow = true
    this.key = key
    this.deleteNode = null
    this.beforeNode = null

    this.fix = null
  }

  isEmpty () {
    if (!this.tree.root) {
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
      return this.isHasChild(cNode)
      // this.next = 'isHasChild'
      // this.removeNode = this.currNode
      // return this.genStep('equal', {}, '当前节点为待删除节点')
    }
  }

  isEmptyChild (child) {
    let cm = {left: '小于', right: '大于'}
    let cn = {left: '左子节点', right: '右子节点'}
    let msg = `待插入节点${cm[child]}当前节点, `

    if (this.currNode[child]) {
      this.next = 'findTarget'
      return this.setCurr(child)
    } else {
      this.next = 'finished'
      return this.genStep('error', {}, msg + `${cn[child]}为空，删除出错！`)
    }
  }

  isHasChild (node) {
    this.whichRemove = node.which
    this.currNode = node.parent
    if (node.left && node.right) {
      return this.findBeforeNode(node)
    } else if (node.left) {
      this.next = 'fixup'
      this.bNode = node
      return this.genStep('remove', {dNode: node, child: node.left}, '待删除节点只有左子节点，直接删除，并用左子节点替代自己')
    } else if (node.right) {
      this.next = 'fixup'
      this.bNode = node
      return this.genStep('remove', {dNode: node, child: node.right}, '待删除节点只有右子节点，直接删除，并用右子节点替代自己')
    } else {
      this.next = 'fixup'
      return this.genStep('remove', {dNode: node}, '待删除节点没有子节点，直接删除')
    }
  }

  findBeforeNode (node) {
    let bNode = node.left
    let lines = {}
    if (bNode) lines[node.key + '-' + bNode.key] = true
    while (bNode && bNode.right) {
      lines[bNode.key + '-' + bNode.right.key] = true
      bNode = bNode.right
    }
    lines[bNode.parent.key + '-' + bNode.key] = true

    this.next = 'copyBnToDn'
    this.bNode = bNode
    this.removeNode = node

    this.currNode = bNode.parent
    this.whichRemove = bNode.which
    return this.genStep('findBeforeNode', {bNode: bNode, lines: lines}, '待删除节点有两个子节点，需找出其前置节点，前置节点是待删除节点的左子节点的最右子孙节点')
  }

  copyBnToDn () {
    this.next = 'removeBeforeNode'
    return this.genStep('copyBnToDn', {bNode: this.bNode, dNode: this.removeNode}, '复制前置节点的值到待删除节点')
  }

  removeBeforeNode () {
    if (this.currNode) {
      this.next = 'fixup'
      return this.genStep(
        'removeBeforeNode',
        {bNode: this.bNode, dNode: this.removeNode},
        '删除前置节点，用子节点代替它位置, 并把它的颜色附在它子节点上，此时子节点有双重颜色'
      )
    } else {
      this.next = 'fixup'
      return this.genStep('removeBeforeNode', {bNode: this.bNode, dNode: this.removeNode}, '删除前置节点，没有子节点，删除完成')
    }
  }

  // setChildCurr (which) {
  //   this.next = 'fixup'
  //   return this.setCurr(which, '把子节点设置为当前节点')
  // }

  fixup () {
    if (isRed(this.bNode)) {
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
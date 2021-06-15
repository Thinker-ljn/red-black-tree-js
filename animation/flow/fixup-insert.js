import Base from './base.js'
import {
  isLeftChild,
  isBlack,
  setRed,
  setBlack,
  uncle,
  grandpa
} from '../../lib/utils.js'

class Fixup extends Base {
  constructor (tree, currNode) {
    super(tree, currNode)
    this.next = 'start'

    this.Rpru = Rpru
    this.SameSideRpbu = SameSideRpbu
    this.DiffSideRpbu = DiffSideRpbu
  }

  start () {
    if (this.tree.root === this.currNode) {
      this.next = 'finished'
      return this.dye('black', '当前节点为根，直接染成黑色')
    } else if (isBlack(this.currNode.parent)) {
      this.next = 'finished'
      return this.dye('red', '父结点为黑色，直接染成红色')
    } else if (this.currNode.color === null) {
      return this.dye('red', '将插入节点染成红色')
    } else {
      let [next, msg, childKey] = this.getFixWay()
      this.next = next
      this[next] = new this[next](this.tree, this.currNode, childKey)
      return this.genStep('fix', {}, msg)
    }
  }

  getNext (before) {
    this.currNode = this[this.next].currNode

    this.Rpru = Rpru
    this.SameSideRpbu = SameSideRpbu
    this.DiffSideRpbu = DiffSideRpbu
    return 'start'
  }

  getFixWay () {
    let parent = this.currNode.parent
    let uncleNode = uncle(this.currNode)
    let uColor = uncleNode ? uncleNode.color.slice(0, 1) : 'b'

    if (uColor === 'r') return ['Rpru', '父节点为红色，叔叔节点也为红色，属于情况一，需要调整']

    let childKey = isLeftChild(this.currNode) ? 'left' : 'right'
    let parentKey = isLeftChild(parent) ? 'left' : 'right'
    let msg = '父节点为红色，叔叔节点为黑色, '
    if (childKey === parentKey) {
      msg += '当前节点与父节点都为' + (childKey === 'left' ? '左节点' : '右节点')
      return ['SameSideRpbu', msg + '，属于情况二，需要调整', parentKey]
    } else {
      msg += '当前节点' + (childKey === 'left' ? '左节点' : '右节点')
      msg += '，父节点' + (parentKey === 'left' ? '左节点' : '右节点')
      return ['DiffSideRpbu', msg + '，属于情况三，需要调整', parentKey]
    }
  }
}

class Rpru extends Base {
  constructor (tree, currNode) {
    super(tree, currNode)
    this.next = 'setBlackParent'
  }

  setBlackParent () {
    this.next = 'setBlackUncle'
    return this.dye('black', 'parent')
  }

  setBlackUncle () {
    this.next = 'setRedGrandpa'
    return this.dye('black', 'uncle')
  }

  setRedGrandpa () {
    this.next = 'setCurrGrandpa'
    return this.dye('red', 'grandpa')
  }

  setCurrGrandpa () {
    this.next = 'finished'
    return this.setCurr('grandpa')
  }
}


class SameSideRpbu extends Base {
  constructor (tree, currNode, childKey) {
    super(tree, currNode)
    this.next = 'setBlackParent'
    this.rotateDirection = childKey === 'left' ? 'right' : 'left'
  }

  setBlackParent () {
    this.next = 'setRedGrandpa'
    return this.dye('black', 'parent')
  }

  setRedGrandpa () {
    this.next = 'startRotate'
    return this.dye('red', 'grandpa')
  }

  // setCurrGrandpa () {
  //   this.next = 'startRotate'
  //   return this.setCurr('grandpa')
  // }

  startRotate () {
    this.next = 'finished'
    return this.rotate('grandpa')
  }
}

class DiffSideRpbu extends Base {
  constructor (tree, currNode, childKey) {
    super(tree, currNode)
    this.next = 'setCurrParent'
    this.rotateDirection = childKey
  }

  setCurrParent () {
    this.next = 'startRotate'
    return this.setCurr('parent')
  }

  startRotate () {
    this.next = 'finished'
    return this.rotate()
  }
}

export default Fixup

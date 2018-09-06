import Base from './base.js'
import {
  isLeftChild,
  isBlack,
  isRed,
  sibling,
  grandpa
} from '../../lib/utils.js'

class Fixup extends Base {
  constructor (tree, currNode, which) {
    super(tree, currNode)
    this.next = 'setCurrWhich'
    this.which = which

    this.Rs = Rs
    this.BsBslBsr = BsBslBsr
    this.BsRdBs = BsRdBs  // d diff side, s same side
    this.BsRs = BsRs
  }

  setCurrWhich () {
    this.next = 'start'
    let which = this.which === 'left' ? '左' : '右'
    let msg = `被删除节点是其原父节点的${which}节点, 设置其原父节点的现${which}节点为当前节点, 开始调整`
    return this.setCurr(this.which, msg)
  }

  start () {
    if (this.currNode === this.tree.root) {
      this.next = 'finished'
      return this.dye('black', '当前节点是根结点，直接染黑')
    } else if (isRed(this.currNode)) {
      this.next = 'finished'
      return this.dye('black', '被删除节点是黑色节点，当前节点为红色，直接染黑')
    } else {
      let [next, msg, childKey] = this.getFixWay()
      this.next = next
      this[next] = new this[next](this.tree, this.currNode, childKey)
      return this.genStep('fix', {}, msg)
    }
  }

  getNext (before) {
    this.currNode = this[this.next].currNode

    this.Rs = Rs
    this.BsBslBsr = BsBslBsr
    this.BsRdBs = BsRdBs  // d diff side, s same side
    this.BsRs = BsRs
    return 'start'
  }

  getFixWay () {
    let parent = this.currNode.parent
    let siblingNode = sibling(this.currNode)
    let sColor = siblingNode ? siblingNode.color : 'black'

    let childKey = isLeftChild(this.currNode) ? 'right' : 'left'
    if (sColor === 'red') return ['Rs', '兄弟节点为红色，属于情况一，需要调整', childKey]

    if (!siblingNode) {
      return ['BsBslBsr', '没有兄弟节点，属于情况二，需要调整', childKey]
    }

    if (isBlack(siblingNode.left) && isBlack(siblingNode.right)) {
      return ['BsBslBsr', '兄弟节点为黑色，子节点也都为黑色，属于情况二，需要调整', childKey]
    } else if (isBlack(siblingNode.right)){
      return ['BsRdBs', '兄弟节点为黑色，左子节点为红色，右子节点为黑色，属于情况三，需要调整', childKey]
    } else {
      return ['BsRs', '兄弟节点为黑色，右子节点为红色，属于情况四，需要调整', childKey]
    }
  }
}

class Rs extends Base {
  constructor (tree, currNode, childKey) {
    super(tree, currNode)
    this.next = 'setBlackSibling'
    this.rotateDirection = childKey === 'left' ? 'right' : 'left'
  }

  setBlackSibling () {
    this.next = 'setRedParent'
    return this.dye('black', 'sibling')
  }

  setRedParent () {
    this.next = 'startRotateParent'
    return this.dye('red', 'parent')
  }

  startRotateParent () {
    this.next = 'finished'
    return this.rotate('parent')
  }
}


class BsBslBsr extends Base {
  constructor (tree, currNode) {
    super(tree, currNode)
    this.next = 'setRedSibling'
  }

  setRedSibling () {
    this.next = 'setCurrParent'
    return this.dye('red', 'sibling')
  }

  setCurrParent () {
    this.next = 'finished'
    return this.setCurr('parent')
  }
}

class BsRdBs extends Base {
  constructor (tree, currNode, siblingKey) {
    super(tree, currNode)
    this.next = 'setBlackSiblingChild'
    this.rotateDirection = siblingKey  // siblingNode
    this.childKey = siblingKey === 'left' ? 'left' : 'right'
  }

  setBlackSiblingChild () {
    this.next = 'setRedSibling'
    return this.dye('black', 'sibling-' + this.childKey)
  }

  setRedSibling () {
    this.next = 'startRotate'
    return this.dye('red', 'sibling')
  }

  startRotate () {
    this.next = 'finished'
    return this.rotate('sibling')
  }
}

class BsRs extends Base {
  constructor (tree, currNode, siblingKey) {
    super(tree, currNode)
    this.next = 'setParentColorToSibling'
    this.rotateDirection = siblingKey === 'left' ? 'right' : 'left' // siblingNode
    this.childKey = siblingKey
  }

  setParentColorToSibling () {
    this.next = 'setBlackParent'
    return this.dye(this.currNode.parent.color, 'sibling')
  }

  setBlackParent () {
    this.next = 'setBlackSiblingChild'
    return this.dye('black', 'parent')
  }

  setBlackSiblingChild () {
    this.next = 'startRotate'
    return this.dye('black', 'sibling-' + this.childKey)
  }
  startRotate () {
    this.next = 'setCurrRoot'
    return this.rotate('parent')
  }

  setCurrRoot () {
    this.next = 'finished'
    return this.setCurr('root')
  }
}

export default Fixup

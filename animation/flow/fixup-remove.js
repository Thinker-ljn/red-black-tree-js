import Base from './base.js'
import {
  isLeftChild,
  isBlack,
  setRed,
  setBlack,
  sibling,
  grandpa
} from '../../lib/utils.js'

class Fixup extends Base {
  constructor (tree, currNode) {
    super(tree, currNode)
    this.next = 'start'

    this.Rs = Rs
    this.BsBslBsr = BsBslBsr
    this.BsRslBsr = BsRslBsr
    this.BsRsr = BsRsr
  }

  start () {
    if (isRed(this.currNode)) {
      this.next = 'finished'
      return this.dye('red', '被删除节点是黑色节点，当前节点为红色，直接染黑')
    } else {
      let [next, msg, childKey] = this.getFixWay()
      this.next = next
      this[next] = new this[next](this.tree, this.currNode, childKey)
      return this.genStep('fix', {}, msg)
    }
  }

  getNext (before) {
    if (before === 'BsRs') return 'finished'
    else {
      this.currNode = this[this.next].currNode

      this.Rs = Rs
      this.BsBslBsr = BsBslBsr
      this.BsRdBs = BsRdBs  // d diff side, s same side
      this.BsRs = BsRs
      return 'start'
    }
  }

  getFixWay () {
    let parent = this.currNode.parent
    let siblingNode = sibling(this.currNode)
    let sColor = siblingNode ? siblingNode.color : 'black'

    let childKey = isLeftChild(siblingNode) ? 'left' : 'right'
    if (sColor === 'red') return ['Rs', '兄弟节点为红色，属于情况一，需要调整', childKey]

    if (isBlack(siblingNode.left) && isBlack(siblingNode.right)) {
      return ['BsBslBsr', '兄弟节点为黑色，子节点也都为黑色，属于情况二，需要调整', childKey]
    } else if (isBlack(siblingNode.right)){
      return ['BsRslBsr', '兄弟节点为黑色，左子节点为红色，右子节点为黑色，属于情况三，需要调整', childKey]
    } else {
      return ['BsRsr', '兄弟节点为黑色，右子节点为红色，属于情况四，需要调整', childKey]
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
  constructor (tree, currNode, childKey) {
    super(tree, currNode)
    this.next = 'setRedSibling'
    this.rotateDirection = childKey  // siblingNode
  }

  setRedSibling () {
    this.next = 'setBlackSibling'
    return this.dye('red', 'sibling')
  }

  setBlackSiblingChild () {
    this.next = 'startRotate'
    return this.dye('black', )
  }

  startRotate () {
    this.next = 'finished'
    return this.rotate()
  }
}

class BsRs extends Base {
  constructor (tree, currNode, childKey) {
    super(tree, currNode)
    this.next = 'setSibling'
    this.rotateDirection = childKey === 'left' ? 'right' : 'left' // siblingNode
  }

  setSibling () {
    this.next = 'setBlackParent'
    return this.dye(node.parent.color, 'sibling')
  }

  setBlackParent () {
    this.next = 'setBlackSiblingLeft'
    return this.dye('black', 'parent')
  }

  setBlackSiblingLeft () {
    this.next = 'startRotate'
    return this.dye('black', siblingNode.left)
  }
  startRotate () {
    this.next = 'finished'
//this.rightRotate(node.parent)

//node = this.root
    return this.rotate()
  }
}

export default Fixup

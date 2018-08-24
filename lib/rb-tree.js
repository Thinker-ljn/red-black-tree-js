import Tree from './tree.js'
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
} from './utils.js'

class RbTree extends Tree {
  constructor () {
    super()
  }

  insert (node) {
    node = Tree.prototype.insert.call(this, node)
    node.color = 'red'
    return this.fixInsert(node)
  }

  fixInsert (node) {
    if (this.root === node) {
      node.color = 'black'
      return node
    }

    if (isRed(node.parent) && isRed(uncle(node))) {
      setBlack(node.parent)
      setBlack(uncle(node))
      setRed(grandpa(node))
      node = grandpa(node)
      this.fixInsert(node)
    } else if (isRed(node.parent) && isBlack(uncle(node))) {
      if (isLeftChild(node.parent)) {
        if (isLeftChild(node)) {
          setBlack(node.parent)
          setRed(grandpa(node))
          node = grandpa(node)
          this.rightRotate(node)
        } else {
          node = node.parent
          this.leftRotate(node)
          this.fixInsert(node)
        }
      } else {
        if (isRightChild(node)) {
          setBlack(node.parent)
          setRed(grandpa(node))
          node = grandpa(node)
          this.leftRotate(node)
        } else {
          node = node.parent
          this.rightRotate(node)
          this.fixInsert(node)
        }
      }
    }
  }

  remove (nodeKey) {
    let removedNode = Tree.prototype.remove.call(this, nodeKey)

    if (this.root && isBlack(removedNode)) {
      let childNode = removedNode.left ? removedNode.left : removedNode.right

      this.fixRemove(childNode)
    }

    return !!removedNode
  }

  fixRemove (node) {
    while (this.root !== node && isBlack(node)) {
      let siblingNode = sibling(node)
      if (isRed(siblingNode)) {
        setBlack(siblingNode)
        setRed(node.parent)
        if (isRightChild(siblingNode)) {
          this.leftRotate(node.parent)
        } else {
          this.rightRotate(node.parent)
        }
      } else {
        if (isBlack(siblingNode.left) && isBlack(siblingNode.right)) {
          setRed(siblingNode)
          node = node.parent
        } else if (isLeftChild(siblingNode)) {
          if (isBlack(siblingNode.left)) {
            // isRed(siblingNode.right)
            setRed(siblingNode)
            setBlack(siblingNode.right)
            this.leftRotate(siblingNode)
          } else {
            // isRed(siblingNode.left)
            siblingNode.color = node.parent.color
            setBlack(node.parent)
            setBlack(siblingNode.left)
            this.rightRotate(node.parent)

            node = this.root
          }
        } else {
          if (isBlack(siblingNode.right)) {
            // isRed(siblingNode.left)
            setRed(siblingNode)
            setBlack(siblingNode.left)
            this.rightRotate(siblingNode)
          } else {
            // isRed(siblingNode.right)
            siblingNode.color = node.parent.color
            setBlack(node.parent)
            setBlack(siblingNode.right)
            this.leftRotate(node.parent)

            node = this.root
          }
        }
      }
    }

    setBlack(node)
  }

  leftRotate (node) {
    let y = node.right
    node.right = y.left
    if (y.left.key !== null) {
      y.left.parent = node
    }

    y.parent = node.parent
    if (node.parent === null) {
      this.root = y
    } else if (isLeftChild(node)) {
      node.parent.left = y
    } else if (isRightChild(node)) {
      node.parent.right = y
    }

    node.parent = y
    y.left = node
  }

  rightRotate (node) {
    let x = node.left
    node.left = x.right
    if (x.right.key !== null) {
      x.right.parent = node
    }

    x.parent = node.parent
    if (node.parent === null) {
      this.root = x
    } else if (isLeftChild(node)) {
      node.parent.left = x
    } else if (isRightChild(node)) {
      node.parent.right = x
    }

    node.parent = x
    x.right = node
  }
}

export default RbTree

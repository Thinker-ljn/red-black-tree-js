import Node from './node.js'
import {
  isLeftChild,
  beforeOfTheNode
} from './utils.js'

class Tree {
  constructor () {
    this.root = null
    this.inorderList = []
  }

  insert (node) {
    if (!(node instanceof Node)) node = new Node(node)
    if (this.root === null) {
      this.root = node
      return node
    }

    let currNode = this.find(node.key, true)
    if (currNode.key > node.key) {
      currNode.left = node
      node.parent = currNode
    } else if (currNode.key < node.key) {
      currNode.right = node
      node.parent = currNode
    }

    return node
  }

  find (nodeKey, isInsert = false) {
    if (this.root === null) return null

    let currNode = this.root

    while (currNode) {
      if (nodeKey < currNode.key) {
        if (isInsert && !currNode.left) break
        currNode = currNode.left
      } else if (currNode.key < nodeKey) {
        if (isInsert && !currNode.right) break
        currNode = currNode.right
      } else {
        break
      }
    }

    return currNode
  }

  remove (nodeKey) {
    let node = this.find(nodeKey)
    if (!node) return null

    if (node.left && node.right) {
      let before = beforeOfTheNode(node)
      node.key = before.key
      node = before
    }

    let childNode = node.left ? node.left : node.right

    if (childNode) childNode.parent = node.parent
    if (node.parent === null) {
      this.root = childNode
    } else if (isLeftChild(node)) {
      node.parent.left = childNode
    } else {
      node.parent.right = childNode
    }

    return node
  }

  getDeep (currNode) {
    if (!currNode) currNode = this.root

    if (currNode === null) return 0
    let leftDeep = this.getDeep(currNode.left)
    let rightDeep = this.getDeep(currNode.right)

    return Math.max(leftDeep, rightDeep)
  }

  traversal (type, callback) {
    if (this.root === null) {
      return console.log('no data')
    }

    this[type + 'Traversal'](callback)
  }

  inorderTraversal (callback, node, deep = 1) {
    if (!node) node = this.root

    if (node.left) this.inorderTraversal(callback, node.left, deep + 1)
    callback(node, deep)
    this.inorderList.push(node)
    if (node.right) this.inorderTraversal(callback, node.right, deep + 1)
  }

  levelTraversal (callback) {
    let queue = [this.root]
    while (queue.length) {
      let node = queue.shift()
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
      callback(node)
    }
  }
}

export default Tree

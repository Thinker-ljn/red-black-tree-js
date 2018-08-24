export function beforeOfTheNode (node) {
  let currNode = node.left
  while (currNode.key && currNode.right) {
    currNode = currNode.right
  }
  return currNode
}

export function isLeftChild (node) {
  let parent = node.parent
  return parent.left === node || (parent.left.key === null && parent.right !== node)
}

export function isRightChild (node) {
  let parent = node.parent
  return parent.right === node || (parent.right.key === null && parent.left !== node)
}

export function isBlack (node) {
  return node.key === null || node.color === 'black'
}

export function isRed (node) {
  return node.key !== null && node.color === 'red'
}

export function setBlack (node) {
  if (node.key) node.color = 'black'
}

export function setRed (node) {
  if (node.key) node.color = 'red'
}

export function grandpa (node) {
  return node.parent.parent
}

export function uncle (node) {
  return grandpa(node).left === node.parent ? grandpa(node).right : grandpa(node).left
}

export function sibling (node) {
  return isLeftChild(node) ? node.parent.right : node.parent.left
}

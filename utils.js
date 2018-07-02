export function beforeOfTheNode (node) {
  let currNode = node.left
  while (currNode && currNode.right) {
    currNode = currNode.right
  }
  return currNode
}

export function isLeftChild (node) {
  let parent = node.parent
  return parent.left === node || (parent.left === null && parent.right !== node)
}

export function isRightChild (node) {
  let parent = node.parent
  return parent.right === node || (parent.right === null && parent.left !== node)
}

export function isBlack (node) {
  return node === null || node.color === 'black'
}

export function isRed (node) {
  return node && node.color === 'red'
}

export function setBlack (node) {
  if (node) node.color = 'black'
}

export function setRed (node) {
  if (node) node.color = 'red'
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
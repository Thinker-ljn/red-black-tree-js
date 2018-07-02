class Node {
  constructor (key) {
    this.key = key
    this.color = null
    this.parent = null
    this.left = null
    this.right = null
    this.pos = {
      x: 0,
      y: 0
    }
  }
}

export default Node

class Node {
  constructor (key) {
    this.key = key
    this.color = null
    this.parent = null
    this.left = null
    this.right = null
    this.pos = {
      x: 20,
      y: 20
    }
  }
}

export default Node

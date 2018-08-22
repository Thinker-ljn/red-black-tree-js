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

  get which () {
    if (!this.parent) return null
    return this.parent.left === this ? 'left' : 'right'
  }
}

export default Node

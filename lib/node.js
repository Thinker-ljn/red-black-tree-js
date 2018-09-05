class Node {
  constructor (key = null) {
    this.key = key
    this.color = key === null ? 'black' : null
    this.parent = null
    this.left = null
    this.right = null
    this.pos = {
      x: 20,
      y: 20
    }

    this.graph = null
    if (key) {
      this.createNullNode()
    }
  }

  get which () {
    if (!this.parent) return null
    return this.parent.left === this ? 'left' : 'right'
  }

  get isNull () {
    return this.key === null
  }

  createNullNode () {
    let keys = ['left', 'right']
    keys.forEach((key) => {
      if (this[key] === null) {
        this[key]= new Node
        this[key].parent = this
      }
    })
  }
}

export default Node

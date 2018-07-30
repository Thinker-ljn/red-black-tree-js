function findInsertPos (currNode, nodeKey) {
  if (nodeKey < currNode.key && currNode.left) {
    return currNode.left
  }
  if (currNode.key < nodeKey && currNode.right) {
    return currNode.right
  }

  return null
}

class StepFind {
  constructor (graph, currNode, findKey) {
    this.msgs = {
      start: '当前节点指向根节点，将待查找key与当前节点比较',
      compare: {
        lt: '待查找key小于当前节点key',
        gt: '待查找key大于当前节点key',
        eq: '待查找key等于当前节点key'
      },
      child: {
        left: '当前节点指向其左节点',
        right: '当前节点指向其右节点',
        empty: '找不到所需节点'
      },
      finish: '找到所需节点'
    }
    this.msg = ''

    this.graph = graph
    this.tree = graph.tree
    this.currNode = currNode ? currNode : this.tree.root
    this.findKey = findKey

    this.setStatus('start', null)
  }

  exec () {
    this.clearMsg()
    let currNode = this.currNode
    let nodeKey = this.findKey
    if (nodeKey < currNode.key) {
      this.setStatus('compare', 'lt')
      if (currNode.left) {
        this.currNode = currNode.left
        this.setStatus('child', 'left')
      } else {
        this.setStatus('child', 'empty')
      }
    } else if (currNode.key < nodeKey) {
      this.setStatus('compare', 'gt')
      if (currNode.right) {
        this.currNode = currNode.right
        this.setStatus('child', 'right')
      } else {
        this.setStatus('child', 'empty')
      }
    } else {
      this.setStatus('compare', 'eq')
    }
  }

  setStatus (status, result) {
    this.result = result
    this.status = status

    this.setMsg()

    this.draw()
  }

  draw () {
    this.graph.drawCurrNode(this.currNode)
  }

  clearMsg () {
    this.msg = ''
    document.getElementById('msg').innerHTML = ''
  }

  setMsg (msg) {
    msg = this.msgs[this.status]
    msg = typeof msg === 'string' ? msg : msg[this.result ]
    this.msg += msg + '\n'
    document.getElementById('msg').innerHTML = this.msg
  }
}

export default StepFind

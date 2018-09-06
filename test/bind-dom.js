class Dom {
  constructor (anm) {
    this.state = {
      inFlow: false,
      isAutoPlay: true,
      key: ''
    }

    this._msg = ''
    this.msgDom = document.getElementById('msg')

    this.anm = anm
    this.anm.dom = this
    this.doBind()
    this.setAutoPlay()
  }

  bindEvent (selectorName, fn, eventName = 'click') {
    let doms = document.querySelectorAll(selectorName)
    doms.forEach(function (dom) {
      dom.addEventListener(eventName, function (e) {
        fn(e, this)
      }, false)
    })
  }

  doBind () {
    this.bindEvent('#next', (e) => {
      this.anm.next()
      if (!this.anm.inFlow) {
        // setDomStatus()
      }
    })

    this.bindEvent('.autoplay',(e, dom) => {
      this.setAutoPlay(dom.value == 1)
    }, 'change')

    this.bindEvent('#key', (e, dom) => {
      this.state.key = e.target.value
    }, 'change')

    let as = ['insert', 'remove']
    as.forEach((action) => {
      this.bindEvent('#' + action, (e) => {
        this.actionClick(action)

        this.anm[action](this.state.key)
      })
    })
  }

  actionClick (action) {
    this.state.inFlow = true
    this.anm.inFlow = true
    action = action === 'insert' ? '插入' : '删除'
    document.querySelector('.ready').classList.add('hidden')
    document.querySelector('.running').classList.remove('hidden')
    document.querySelector('.running-key').innerHTML = `${action} ${this.state.key} `
    this.setAutoPlay()
  }

  actionDone () {
    this.state.inFlow = false
    this.anm.inFlow = false
    this.msg = '完成操作<br/>'
    document.querySelector('.ready').classList.remove('hidden')
    document.querySelector('.running').classList.add('hidden')
    document.querySelector('.step-handler').classList.add('hidden')
  }

  setAutoPlay (status) {
    if (status === undefined) {
      status = this.state.isAutoPlay
      this.setChecked(status)
    }
    if (status || !this.state.inFlow) {
      document.querySelector('.step-handler').classList.add('hidden')
    } else {
      document.querySelector('.step-handler').classList.remove('hidden')
    }

    this.state.isAutoPlay = status
    this.anm.isAutoPlay = status
  }

  setChecked (status) {
    let str = status ? '1' : '0'
    document.querySelector(`input[type=radio][value="${str}"]`).checked = true
  }

  set msg (m) {
    this._msg += m + '<br/>'
    this.msgDom.innerHTML = this._msg
    this.msgDom.scrollTop = this.msgDom.scrollHeight
  }
}

export default Dom
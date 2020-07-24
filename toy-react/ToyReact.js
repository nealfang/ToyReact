class ElemnetWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      // 只需要把第一个字母变小写，因为有些时间是需要由大写的
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLocaleLowerCase())
      this.root.addEventListener(eventName, value)
    }
    if (name === 'className') {
      name = 'class'
    }
    this.root.setAttribute(name, value)
  }
  appendChild(vchild) {
    // 后续虚拟dom的改造在这里
    let range = document.createRange()
    if (this.root.children.length) {
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    }else{
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)
    }
    vchild.mountTo(range)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null)
  }
  setAttribute(name, value) {
    // if (name.match(/^on([\s\S]+)$/)) {
    //   console.log(RegExp.$1);
    // } 怎么不是在这里
    // 这里处理的的组件在别的组件内部挂载的时候调用
    this.props[name] = value
    this[name] = value
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update(){
    let placeholder = document.createComment('placeholder')
    let range = document.createRange()
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset)
    range.insertNode(placeholder)

    this.range.deleteContents()
    let vdome = this.render()
    vdome.mountTo(this.range
  }
  appendChild(vchild) {
    this.children.push(vchild)
  }
  setState(state) {
    let merge = (oldState, newState) => {
      for (let p in newState) {
        if (typeof newState[p] === 'object') {
          if (typeof newState[p] !== 'object') {
            oldState[p] = {}
          }
          merge(oldState[p], newsState[p])
        } else {
          oldState[p] = newState[p]
        }
      }
    }

    if (!this.state && state) {
      this.state = {}
    }
    merge(this.state, state)
    this.update()
  }
}

export let ToyReact = {
  createElement(type, attributes, ...children) {
    let element;

    if (typeof type === 'string') {
      element = new ElemnetWrapper(type)
    } else {
      element = new type
    }

    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }

    let insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === 'object' && child instanceof Array) {
          insertChildren(child)
        } else {
          if (!(child instanceof Component) && !(child instanceof ElemnetWrapper) && !(child instanceof TextWrapper)) {
            child = String(child)
          }
          if (typeof child === 'string') {
            child = new TextWrapper(child)
          }
          element.appendChild(child)
        }
      }
    }

    insertChildren(children)

    return element
  },
  render(vdom, element) {
    let range = document.createRange()
    if (element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    }else{
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }
    vdom.mountTo(range)
  }
}
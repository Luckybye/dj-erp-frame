import Sortable from 'sortablejs';
export default function() {
  let addDrag = (el, value, context) => {
    /* eslint-disable no-new */
    new Sortable(el, {
      animation: 150,
      ghostClass: 'dragging-class',
      onEnd: function ({to, from, oldIndex, newIndex}) {
        if (!value.list) return;
        let k = getGroupKey(value.group)
        let listWrap = context[k] || new Map()
        let toValue = listWrap.get(to) || value
        let fromValue = listWrap.get(from) || value
        let toArr = toValue.list
        let fromArr = fromValue.list
        if (!toArr || !fromArr) return;
        if (value.drop && context[value.drop]) return context[value.drop]({toArr, fromArr, oldIndex, newIndex})
        let curr = fromArr.splice(oldIndex, 1)[0]
        curr && toArr.splice(newIndex, 0, curr)
        // console.log(toArr, fromArr, 'toArr, fromArr')
        if (value.dropEnd && context[value.dropEnd]) context[value.dropEnd]({target: curr || {}, toValue, fromValue})
      },
      ...value,
    });
  }
  let getGroupKey = k => {
    return 'drag__' + k + '__drag'
  }

  function addDirecttives (el, data, vnode) {
    let {value} = data
    if (!value) return;
    if (!value.list && !value.list.lengh) return
    if (value.el) el = el.querySelector(value.el) || el
    // console.log('updateupdate', el)
    if (value.group && value.list) {
      let {context} = vnode
      let k = getGroupKey(value.group)
      context[k] = context[k] || new Map()
      context[k].set(el, value)
    }
    if (value.onEnd && vnode.context[value.onEnd]) {
      let funname = value.onEnd
      value.onEnd = (...arg) => {
        vnode.context[funname](...arg)
      }
    }
    addDrag(el, value, vnode.context)
  }
  return {
    id: "drag",
    // update () {
    //   console.log('updateupdateupdate')
    // },
    inserted (el, data, vnode) {
      // console.log('insertedinsertedinserted')
      addDirecttives.call(this, el, data, vnode)
    },
    componentUpdated(el, data, vnode) {
      // console.log('componentUpdatedcomponentUpdated')
      addDirecttives.call(this, el, data, vnode)
    },
    unbind (el, data, vnode) {
      let {value} = data
      if (!value) return;
      let k = getGroupKey(data.value.group)
      vnode.context[k] = null
    },
  };
}

import _ from 'lodash'
export default function() {
  function componentUpdated1 (el, data) {
    // console.log(el, data, 'componentUpdatedcomponentUpdated')
    let value = data.value
    let addEvent = (tag) => {
      tag.draggable = true
      tag.ondragstart = function (e) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
    if (!value) {
      addEvent(el)
    } else {
      value = Array.isArray(value) ? value : value.split(',')
      // console.log(value, 'valuevaluevalue')
      value.forEach(m => {
        let els = [...el.querySelectorAll(m)]
        // console.log(els, 'elselselsels', el)
        els.forEach(tag => {
          addEvent(tag)
        })
      })
    }
  }
  let update = _.debounce(componentUpdated1, 500)
  return {
    id: "no-drag",
    // update () {
    //   console.log('updateupdateupdate')
    // },
    // inserted () {
    //   console.log('insertedinsertedinserted')
    // },
    componentUpdated(el, data) {
      if (data.value === 'nodrag') return
      // console.log('componentUpdatedcomponentUpdated')
      update(el, data)
    }
  };
}

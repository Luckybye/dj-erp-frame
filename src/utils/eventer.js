/**
 * Created by wangmin on 16/12/12.
 */


function Eventer() {
  Eventer.init.call(this);
}
let eventSeq =1
Eventer.init = function() {
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = {};
    this._id = eventSeq ++
    //this._owner = owner
  }
};

Eventer.prototype.addListener = function addListener(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('listener must be a function');
  var events = this._events
  var existing;
  if (!events) {
    events = this._events = {};
  } else {
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = [existing, listener];
    } else {
      // If we've already got an array, just append.
      existing.push(listener);
    }
  }
  return this;
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

Eventer.prototype.emit = function emit(type) {
  var handler, len, args, i, events;
  var self = this
  events = self._events || {};
  handler = events[type];
  var args = Array.prototype.slice.call(arguments).splice(1)
  if (!handler) return false;
  setTimeout(function () {
    if (typeof handler === 'function') {
      handler.apply(self, args)
    } else {
      arrayClone(handler, handler.length).forEach(function(fn){
        fn.apply(self, args)
      })
    }
  })
  return true;
};

Eventer.prototype.removeListener = function removeListener (type, listener) {
  let events = this._events;
  if ( !type || typeof listener !== 'function') return this
  let list = events[type]
  if (!list) return this
  if (listener === list) {
    delete events[type]
    return this
  }
  if (Array.isArray(list)) {
    for (let i =0 ;i < list.length; i++) {
      let handler = list[i]
      if (handler === listener) {
        list.splice(i,1)
        break
      }
    }
    if (!list.length) delete events[type]
  }
  return this
}

Eventer.prototype.on = Eventer.prototype.addListener;
Eventer.prototype.remove = Eventer.prototype.removeListener;
window.dangjia = new Eventer()
export default  Eventer

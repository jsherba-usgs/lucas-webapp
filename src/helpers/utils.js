export function removeClassFromSiblingElements(el, className = 'active') {
  Array.prototype.filter.call(el.parentNode.children, (child) => {
    if (child !== el) {
      child.classList.remove(className);
    }
  });
}

// Adapted from http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
export function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function() {
      handler.call(el);
    });
  }
}

// Adapted from http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
export function triggerEvent(el, eventName, options) {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName, options);
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, options);
  }
  el.dispatchEvent(event);
}


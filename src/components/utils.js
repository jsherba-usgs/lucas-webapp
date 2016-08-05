const module = {};

module.removeClassFromSiblingElements = (el, className = 'active') => {
  Array.prototype.filter.call(el.parentNode.children, (child) => {
    if (child !== el) {
      child.classList.remove(className);
    }
  });
};

export default module;

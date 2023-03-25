const Coloris = (() => {
  <%= contents %>
})();

const _coloris = Coloris.coloris;
const _init = Coloris.init;
const _set = Coloris.set;
const _wrap = Coloris.wrap;
const _close = Coloris.close;
const _setInstance = Coloris.setInstance;
const _removeInstance = Coloris.removeInstance;
const _updatePosition = Coloris.updatePosition;
export default Coloris;
export {
  _coloris as coloris,
  _close as close,
  _init as init,
  _set as set,
  _wrap as wrap,
  _setInstance as setInstance,
  _removeInstance as removeInstance,
  _updatePosition as updatePosition,
}; 

const Coloris = (() => {
  <%= contents %>
})();

const _coloris = Coloris.coloris;
const _init = Coloris.init;
const _set = Coloris.set;
const _wrap = Coloris.wrap;
const _close = Coloris.close;
export default Coloris;
export {
  _coloris as coloris,
  _close as close,
  _init as init,
  _set as set,
  _wrap as wrap,
}; 

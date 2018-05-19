/**
 * @param {Function} dispatcher
 * @return {Function} the multimethod object
 */
function multi(dispatcher){
  /**
   * Map of dispatch values to method implementations
   * @type {Map<*,Function>} _methods
   */
  const _methods = new Map;

  const mm = function(...args){
    const dispatch = dispatcher.apply(null, args);
    const impl = _methods.get(dispatch);

    if(typeof impl === 'undefined'){
      //vintage error type
      throw new EvalError(`no method found for dispatch value ${dispatch}`);
    }
    
    return impl.apply(null, args);
  };

  /**
   * returns a clone of the internal _methods Map
   * (not 100% safe, functions are objects passed by reference)
   */
  function methods(){
    return new Map(_methods);
  }

  /**
   * @param {*} dispatch value to match return value of dispatcher to
   * @param {Function} impl implementation for this dispatch value
   */
  function attach(dispatch, impl){
    _methods.set(dispatch, impl);
    return mm;
  }

  mm.methods = methods;
  mm.attach = attach;
  mm.dispatcher = dispatcher;
  
  return mm;
}

module.exports = {
  multi
};
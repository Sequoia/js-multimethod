const dfault = Symbol('js-multimethods:default');
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
  const _hierarchy = {};

  const mm = function(...args){
    const dispatch = dispatcher.apply(null, args);
    const impl = getMethod(dispatch) || _methods.get(dfault);

    if(typeof impl === 'undefined'){
      //vintage error type
      throw new EvalError(`no method found for dispatch value ${dispatch}`);
    }
    
    return impl.apply(null, args);
  };

  /**
   * @param {*} dispatch a function for this value will be returned if it exists
   * @return {Function|undefined}
   */
  function getMethod(dispatch){
    while(dispatch){
      if(_methods.get(dispatch)){
        return _methods.get(dispatch);
      }
      dispatch = _hierarchy[dispatch];
    }
  }

  /**
   * Returns true if value is *explicitly* handled by this multimethod
   * (not handled by catchall/default method)
   * @param {*} value 
   * @return {Boolean}
   */
  function handles(value){
    return Boolean(getMethod(value));
  }

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

  function detach(dispatch){
    _methods.delete(dispatch);
    return mm;
  }


  /**
   * attach a default impl in case the dispatch value matches no impls
   * Pass null to unset catchall/default
   * @param {Function|null}
   */
  function catchall(impl){
    if(typeof impl === 'function'){
      _methods.set(dfault, impl);
    }else if(impl === null){
      _methods.delete(dfault);
    }

    return mm;
  }

  /**
   * allows values with dispatch of `child` to be handled by impl of `parent`
	 * read like "derive child FROM parent"
	 * Derive works recursively 'til:
	 * a) method is matched for that dispatch value or
	 * b) no method matched and no more derived values --> call catchall
	 *
	 * Note that if derive Z from Y & Y from X, but Y both Y and X have methods
	 * attached, mm(Z) will call the handler attached for X, i.e. the first one
	 * it encounters while walking up the hierarchy
	 *
   * @example
   *  ```
   *  mm(x => x)
   *    .attach('animal', animalHandlerFn)
   *    .derive('cat','animal');
   *  mm('cat');  //handled by animalHandlerFn
   *  ```
   * @param {*} child
   * @param {*} parent
   */
  function derive(child, parent){
    _hierarchy[child] = parent;
  }

  return Object.assign(mm, {
    methods, attach, dispatcher, detach, catchall, derive, handles, getMethod
  });
  
}

module.exports = {
  multi
};

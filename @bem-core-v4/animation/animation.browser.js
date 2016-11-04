/**
 * @module animation
 */

modules.define('animation', ['i-bem-dom'], function(provide, bemDom) {
  /**
   * @exports
   * @class animation
   * @bem
   */
  provide(bemDom.declBlock(this.name, /** @lends animation.prototype */ {

    /**
     * Start animation
     * @param  {String}   type     name of type animation
     * @param  {Function} callback callback for events
     * @param  {Boolean}  hide     flag for hide
     * @return {Bem}               block instance
     */
    start: function(type, callback, hide) {
      this.domElem.show();
      this.setMod('type', type);

      if (callback === undefined) {
        return this;
      }

      if (callback.constructor === Boolean) {
        hide = callback;
      }

      if (callback.constructor === Function) {
        this._singleEvent('AnimationEnd', callback, hide);
        return this;
      }

      if (callback.constructor === Object) {
        if (callback.onStart) {
          this._singleEvent('AnimationStart', callback.onStart, hide);
        }
        if (callback.onEnd) {
          this._singleEvent('AnimationEnd', callback.onEnd, hide);
        }
        if (callback.onIteration) {
          this._singleEvent('AnimationIteration', callback.onIteration, hide);
        }

        return this;
      }

      // default behavior
      this._singleEvent('AnimationEnd', false, hide);
      return this;
    },

    /**
     * Reset all block mods and delete inline styles
     * @return {Bem} this block
     */
    reset: function() {
      for (const mod in this._modCache) {
        if (!this._modCache.hasOwnProperty(mod) || mod === 'js') {
          continue;
        }
        this.delMod(mod);
      }

      this.domElem.css('display', '');
      return this;
    },

    /**
     * Function for run sindle event
     * @param  {String}   event    target event
     * @param  {Function} callback callback function
     * @param  {Boolean}  hide     flag for hide block
     * @return {Bem}               block instance
     */
    _singleEvent: function(event, callback, hide) {
      const prefixedEvent = this._prefixed(event);
      this.domElem.on(event, () => {
        this.domElem.off(event);
        if (hide === true) {
          this.domElem.hide();
        }
        if (callback.constructor === Function) {
          callback();
        }
      });
      return this;
    },

    /**
     * Animation Start Event
     */
    _onStart: function() {
      this._emit('start');
    },

    /**
    * Animation End Event
    */
    _onEnd: function() {
      this._emit('end');
    },

    /**
    * Animation Iteration Event
    */
    _onIteration: function() {
      this._emit('iteration');
    },

    /**
     * Add prefixes for event
     * @param  {String} event event name
     * @return {String} return prefixed events
     */
    _prefixed: function(event) {
      var prefixes = ['webkit', 'moz', 'MS', 'o', ''];
      return prefixes.map(prefix => {
        if (prefix === '') {
          return event.toLowerCase();
        }
        return prefix + event;
      }).join(' ');
    }
  }, /** @lends animation */ {
    lazyInit: true,
    onInit: function() {
      this.__base.apply(this, arguments);
      let ptp = this.prototype;
      this._domEvents()
        .on(ptp._prefixed('AnimationEnd'), this.prototype._onEnd)
        .on(ptp._prefixed('AnimationStart'), this.prototype._onStart)
        .on(ptp._prefixed('AnimationIteration'), this.prototype._onIteration);
    }
  }));
});

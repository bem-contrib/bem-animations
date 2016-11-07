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
     * @param  {String|Object}   decl     name of type animation or decl animate
     * @param  {Function}        callback callback for events
     * @param  {Boolean}         hide     flag for hide
     * @return {Bem}                      block instance
     */
    start: function(decl, callback, hide) {
      this.domElem.show();
      this.duration('').delay('');

      // For declaration animation
      if (decl.constructor === Object) {
        this.setMod('type', decl.type);

        if (decl.duration !== undefined) {
          this.duration(decl.duration);
        }
        if (decl.delay !== undefined) {
          this.delay(decl.delay);
        }
        this._setCallbacks({
          onStart: decl.onStart,
          onEnd: decl.onEnd,
          onIteration: decl.onIteration
        }, decl.hide);
      } else { // For string animation
        this.setMod('type', decl);
      }

      if (callback !== undefined) {
        this._setCallbacks(callback, hide);
      }
      return this;
    },

    /**
     * Queue animations
     * @param  {Array}    list     animations list
     * @param  {Function} callback run function after end queue
     * @return {Bem}               block instance
     */
    queue: function(list, callback) {
      let first = list.shift();
      if (first === undefined) {
        if (callback !== undefined) {
          callback.call();
        }
        return this;
      }

      if (first.constructor === Function) {
        first.call();
        this.queue(list, callback);
        return;
      }

      this.start(first, () => this.queue(list, callback));
      return this;
    },

    /**
     * Set inline css property for duration
     * @param  {String} time duration
     * @return {Bem}         block instance
     */
    duration: function(time) {
      this._cssProperty('animationDuration', time);
      return this;
    },

    /**
     * Set inline css property for delay
     * @param  {String} time delay
     * @return {Bem}         block instance
     */
    delay: function(time) {
      this._cssProperty('animationDelay', time);
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

      this
        .duration('')
        .delay('')
        .domElem.css('display', '');

      return this;
    },

    /**
     * Pause css animation
     * @param  none
     * @return {Bem}         block instance
     */
    pause: function() {
      this.setMod('paused', true);
      return this;
    },

    /**
     * Continue paused css animation
     * @param  none
     * @return {Bem}         block instance
     */
    continue: function() {
      this.delMod('paused');
      return this;
    },

    /**
     * Function for set callbacks on animation points
     * @param  {Object}  callbacks function or object with callbacks
     * @param  {Boolean} hide      flag for hide block after animation
     * @return {Bem}               block instance
     */
    _setCallbacks: function(callbacks, hide) {
      if (callbacks && callbacks.constructor === Boolean) {
        hide = callbacks;
      }

      if (callbacks && callbacks.constructor === Function) {
        this._singleEvent('AnimationEnd', callbacks, hide);
        return this;
      }

      if (callbacks && callbacks.constructor === Object) {
        if (callbacks.onStart) {
          this._singleEvent('AnimationStart', callbacks.onStart);
        }
        if (callbacks.onIteration) {
          this._singleEvent('AnimationIteration', callbacks.onIteration);
        }
        if (callbacks.onEnd) {
          this._singleEvent('AnimationEnd', callbacks.onEnd, hide);
        }
        return this;
      }

      // default behavior
      this._singleEvent('AnimationEnd', false, hide);
      return this;
    },

    /**
     * Set inline css properties with prefixes
     * @param  {String} prop  property name
     * @param  {String} value property value
     * @return {Bem}          block instance
     */
    _cssProperty: function(prop, value) {
      let upperProp = prop.charAt(0).toUpperCase() + prop.slice(1);
      let prefixes = ['webkit', 'moz', 'o', 'ms'];
      prefixes.forEach(prefix => {
        this.domElem[0].style[prefix + upperProp] = value;
      });
      this.domElem[0].style[prop] = value;

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
      const prefixedEvent = this._prefixed(event + '.' + new Date().getTime());
      this.domElem.on(prefixedEvent, () => {
        this.domElem.off(prefixedEvent);
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

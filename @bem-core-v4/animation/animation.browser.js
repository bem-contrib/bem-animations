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
    }
  }, /** @lends animation */ {
    lazyInit: true,
    onInit: function() {
      let animationEnd = [
        'animationend',
        'oanimationend',
        'webkitAnimationEnd',
        'MSAnimationEnd'
      ];
      let animationStart = [
        'animationstart',
        'oanimationstart',
        'webkitAnimationStart',
        'MSAnimationStart'
      ];
      let animationIteration = [
        'animationiteration',
        'oanimationiteration',
        'webkitAnimationIteration',
        'MSAnimationIteration'
      ];

      this._domEvents()
        .on(animationEnd.join(' '), this.prototype._onEnd)
        .on(animationStart.join(' '), this.prototype._onStart)
        .on(animationIteration.join(' '), this.prototype._onIteration);
      return this.__base.apply(this, arguments);
    }
  }));
});

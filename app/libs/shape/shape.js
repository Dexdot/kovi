//
// these easing functions are based on the code of glsl-easing module.
// https://github.com/glslify/glsl-easings
//


var ease = {
  exponentialIn: function exponentialIn(t) {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
  },
  exponentialOut: function exponentialOut(t) {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
  },
  exponentialInOut: function exponentialInOut(t) {
    return t == 0.0 || t == 1.0 ? t : t < 0.5 ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0) : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
  },
  sineOut: function sineOut(t) {
    var HALF_PI = 1.5707963267948966;
    return Math.sin(t * HALF_PI);
  },
  circularInOut: function circularInOut(t) {
    return t < 0.5 ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t)) : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
  },
  cubicIn: function cubicIn(t) {
    return t * t * t;
  },
  cubicOut: function cubicOut(t) {
    var f = t - 1.0;
    return f * f * f + 1.0;
  },
  cubicInOut: function cubicInOut(t) {
    return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  },
  quadraticOut: function quadraticOut(t) {
    return -t * (t - 2.0);
  },
  quarticOut: function quarticOut(t) {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  }
};


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShapeOverlays = function () {
  function ShapeOverlays(elm) {
    _classCallCheck(this, ShapeOverlays);

    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 2;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPointsMax = 0;
    this.delayPerPath = 200;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }

  _createClass(ShapeOverlays, [{
    key: 'toggle',
    value: function toggle() {
      this.isAnimating = true;
      for (var i = 0; i < this.numPoints; i++) {
        this.delayPointsArray[i] = 0;
      }
      if (this.isOpened === false) {
        this.open();
      } else {
        this.close();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this.isOpened = true;
      this.elm.classList.add('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
  }, {
    key: 'close',
    value: function close() {
      this.isOpened = false;
      this.elm.classList.remove('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
  }, {
    key: 'updatePath',
    value: function updatePath(time) {
      var points = [];
      for (var i = 0; i < this.numPoints; i++) {
        var thisEase = this.isOpened ? i == 1 ? ease.cubicOut : ease.cubicInOut : i == 1 ? ease.cubicInOut : ease.cubicOut;
        points[i] = thisEase(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100;
      }

      var str = '';
      str += this.isOpened ? 'M 0 0 V ' + points[0] + ' ' : 'M 0 ' + points[0] + ' ';
      for (var i = 0; i < this.numPoints - 1; i++) {
        var p = (i + 1) / (this.numPoints - 1) * 100;
        var cp = p - 1 / (this.numPoints - 1) * 100 / 2;
        str += 'C ' + cp + ' ' + points[i] + ' ' + cp + ' ' + points[i + 1] + ' ' + p + ' ' + points[i + 1] + ' ';
      }
      str += this.isOpened ? 'V 0 H 0' : 'V 100 H 0';
      return str;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.isOpened) {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
        }
      } else {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
        }
      }
    }
  }, {
    key: 'renderLoop',
    value: function renderLoop() {
      var _this = this;

      this.render();
      if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
        requestAnimationFrame(function () {
          _this.renderLoop();
        });
      } else {
        this.isAnimating = false;
      }
    }
  }]);

  return ShapeOverlays;
}();


(function () {
  var elmHamburger = document.querySelector('.hamburger');
  var gNavItems = document.querySelectorAll('.global-menu__item');
  var elmOverlay = document.querySelector('.shape-overlays');
  var overlay = new ShapeOverlays(elmOverlay);

  elmHamburger.addEventListener('click', function () {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    if (overlay.isOpened === true) {
      elmHamburger.classList.add('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.add('is-opened');
      }
    } else {
      elmHamburger.classList.remove('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.remove('is-opened');
      }
    }
  });

  $('.global-menu__item').on('click', function() {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    elmHamburger.classList.remove('is-opened-navi');
    for (var i = 0; i < gNavItems.length; i++) {
      gNavItems[i].classList.remove('is-opened');
    }
  });

  // document.querySelectorAll('.global-menu__item').addEventListener('click', function () {
  //   if (overlay.isAnimating) {
  //     return false;
  //   }
  //   overlay.toggle();
  //   elmHamburger.classList.remove('is-opened-navi');
  //   for (var i = 0; i < gNavItems.length; i++) {
  //     gNavItems[i].classList.remove('is-opened');
  //   }
  // });

})();
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({18:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function LightBoxGallery(opt) {
    if (!opt.container) console.warn('LightBoxGallery - You need to declare a node as parameter');
    var self = this;
    this.node = opt.container;
    this.captions = [];
    this.imgsUrl = [];
    this.totalWidth = 0;
    this.itemWidth = 0;
    this.sliderIndex = 0;
    this.translate = 0;
    this.isLightboxOpened = false;
    this.galleryContainer = this.node.querySelector('.Gallery');
    this.galleryContainerSelector = this.node.querySelector('.GalleryContainer');
    this.galleryRowSelector = this.node.querySelectorAll('.GalleryRow');
    this.imgList = this.node.getElementsByTagName('img');
    this.captionsSelector = this.node.querySelector('.GalleryCaptions');
    this.indexSelector = this.node.querySelector('.GalleryIndex');
    this.lightboxSelector = this.node.querySelector('.Lightbox');
    this.lightBoxImg = this.lightboxSelector.getElementsByTagName('img')[0];
    this.lightboxCloseSelector = this.lightboxSelector.querySelector('.LightBoxClose');
    this.moveSlider = this.moveSlider.bind(this);
    this.manageCaptions = this.manageCaptions.bind(this);
    this.manageIndex = this.manageIndex.bind(this);
    this.openLightBox = this.openLightBox.bind(this);
    this.displayArrows = this.displayArrows.bind(this);
    //////////////////////////////////////////////////////////
    this.galleryContainerSelector.style.width = this.galleryContainerSelector.getBoundingClientRect().width * this.imgList.length + "px";
    for (var i = 0; i < this.imgList.length - 1; i++) {
        this.captions.push(this.imgList[i].getAttribute("alt"));
        this.imgsUrl.push(this.imgList[i].getAttribute("src"));
        this.galleryRowSelector[i].style.width = this.galleryContainer.getBoundingClientRect().width + "px";
    }
    this.arrowsItems = {
        arrowNext: this.node.querySelector('.ArrowNext'),
        arrowPrev: this.node.querySelector('.ArrowPrev')
    };
    this.lightBoxArrowsItems = {
        arrowNext: this.lightboxSelector.querySelector('.ArrowNext'),
        arrowPrev: this.lightboxSelector.querySelector('.ArrowPrev')
    };
    if (this.galleryRowSelector.length > 1) {
        this.prevNext = this.prevNext.bind(this);
        this.prevNext();
    } else {
        this.arrowsItems.arrowNext.classList.add('ArrowIsHidden');
        this.arrowsItems.arrowPrev.classList.add('ArrowIsHidden');
        this.lightBoxArrowsItems.arrowNext.classList.add('ArrowIsHidden');
        this.lightBoxArrowsItems.arrowPrev.classList.add('ArrowIsHidden');
    }
    this.manageCaptions();
    this.manageIndex();
    this.node.querySelector('.GalleryOpenLightbox').addEventListener('click', function () {
        self.openLightBox();
    });
}

LightBoxGallery.prototype.init = function () {
    var self = this;
    //TODO : set a preloader
    setTimeout(function () {
        self.itemWidth = self.node.querySelector('img').getBoundingClientRect().width;
        self.totalWidth = self.itemWidth * self.imgList.length;
        self.node.addEventListener('click', self.moveSlider, false);
        console.warn('galleryReady - preload fix will ensue');
    }, 1000);
};

LightBoxGallery.prototype.moveSlider = function (status) {
    if (status === "next") {
        this.sliderIndex++;
        this.translate += this.itemWidth;
        this.galleryContainerSelector.style.transform = "translateX(-" + this.translate + "px)";
        this.lightBoxImg.setAttribute('src', this.imgsUrl[this.sliderIndex]);
    } else if (status === "prev") {
        this.sliderIndex--;
        this.translate -= this.itemWidth;
        this.galleryContainerSelector.style.transform = "translateX(-" + this.translate + "px)";
        this.lightBoxImg.setAttribute('src', this.imgsUrl[this.sliderIndex]);
    }
};

LightBoxGallery.prototype.prevNext = function () {
    var self = this;
    this.galleryNextBtn = this.arrowsItems.arrowNext;
    this.galleryPrevBtn = this.arrowsItems.arrowPrev;
    this.displayArrows();
    this.galleryNextBtn.addEventListener('click', function () {
        self.moveSlider("next");
        self.displayArrows();
        self.manageCaptions();
        self.manageIndex();
    });
    this.galleryPrevBtn.addEventListener('click', function () {
        self.moveSlider("prev");
        self.displayArrows();
        self.manageCaptions();
        self.manageIndex();
    });
};

LightBoxGallery.prototype.displayArrows = function () {
    //TODO : bug here. Why we need to do - 2 ?
    if (this.sliderIndex === this.imgList.length - 2) {
        this.galleryNextBtn.classList.add('ArrowIsHidden');
    } else if (this.sliderIndex === 0) {
        this.galleryPrevBtn.classList.add('ArrowIsHidden');
    } else if (this.sliderIndex >= 1) {
        if (this.galleryNextBtn.classList.contains('ArrowIsHidden')) {
            this.galleryNextBtn.classList.remove('ArrowIsHidden');
        }
        if (this.galleryPrevBtn.classList.contains('ArrowIsHidden')) {
            this.galleryPrevBtn.classList.remove('ArrowIsHidden');
        }
    }
};

LightBoxGallery.prototype.manageCaptions = function () {
    this.captionsSelector.firstElementChild.innerHTML = this.captions[this.sliderIndex];
};

LightBoxGallery.prototype.manageIndex = function () {
    this.indexSelector.firstElementChild.innerHTML = parseInt(this.sliderIndex + 1).toString();
};

///////////////////////////////////////////////////////////////
LightBoxGallery.prototype.openLightBox = function () {
    var self = this;
    init();

    var next = self.lightBoxArrowsItems.arrowNext;
    var prev = self.lightBoxArrowsItems.arrowPrev;

    function init() {
        self.isLightboxOpened = true;
        self.lightboxSelector.classList.add('LightboxIsVisible');
        self.lightboxCloseSelector.addEventListener('click', closeLightBox, false);
        prevNext();
    }

    function prevNext() {
        displayLightboxArrows(self.lightBoxArrowsItems.arrowPrev, self.lightBoxArrowsItems.arrowNext);
        self.lightBoxArrowsItems.arrowNext.addEventListener('click', nextSlide);
        self.lightBoxArrowsItems.arrowPrev.addEventListener('click', prevSlide);
    }

    function nextSlide() {
        self.moveSlider("next");
        self.manageIndex();
        self.displayArrows();
        displayLightboxArrows(self.lightBoxArrowsItems.arrowPrev, self.lightBoxArrowsItems.arrowNext);
        self.manageCaptions();
    }

    function prevSlide() {
        self.moveSlider("prev");
        self.manageIndex();
        self.displayArrows();
        displayLightboxArrows(self.lightBoxArrowsItems.arrowPrev, self.lightBoxArrowsItems.arrowNext);
        self.manageCaptions();
    }

    function displayLightboxArrows(prevBtn, nextBtn) {
        if (self.sliderIndex === self.imgList.length - 2) {
            nextBtn.classList.add('ArrowIsHidden');
        } else if (self.sliderIndex === 0) {
            prevBtn.classList.add('ArrowIsHidden');
        } else if (self.sliderIndex >= 1) {
            if (nextBtn.classList.contains('ArrowIsHidden')) {
                nextBtn.classList.remove('ArrowIsHidden');
            }
            if (prevBtn.classList.contains('ArrowIsHidden')) {
                prevBtn.classList.remove('ArrowIsHidden');
            }
        }
    }

    function closeLightBox() {
        destroyLightbox();
        self.isLightboxOpened = false;
        self.lightboxSelector.classList.remove('LightboxIsVisible');
    }

    function destroyLightbox() {
        next.removeEventListener('click', nextSlide, false);
        prev.removeEventListener('click', prevSlide, false);
    }
};

exports.default = LightBoxGallery;
},{}],8:[function(require,module,exports) {
'use strict';

var _LightboxGallery = require('../src/LightboxGallery');

var _LightboxGallery2 = _interopRequireDefault(_LightboxGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import LightBoxGallery from './build/bundle';

window.addEventListener('DOMContentLoaded', function () {
  var instanceGallery = new _LightboxGallery2.default({
    container: document.querySelector('.myGalleryExample')
  });
  // instanceGallery.init();
});
},{"../src/LightboxGallery":18}],16:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '51197' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[16,8])
//# sourceMappingURL=/dist/214bc5ad47eb6709ad1135248e84e205.map
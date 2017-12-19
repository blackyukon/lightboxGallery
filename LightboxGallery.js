'use strict';

function LightBoxGallery(node, options) {
    this.node = node;
    this.options = options;
    this.captions = [];
    this.totalWidth = 0;
    this.itemWidth = 0;
    this.sliderIndex = 0;
    this.gallerySelector = node.querySelector('.GalleryContainer');
    this.imgList = node.getElementsByTagName('img');
    for (var i = 0; i < this.imgList.length; i++) {
        this.captions.push(this.imgList[i].getAttribute("alt"));
    }
    this.moveSlider = this.moveSlider.bind(this);

    //We initialize the arrows if theres more than one slide
    if (this.imgList.length > 1) {
        //TODO : refactor cleanup this part
        this.arrows = this.arrows.bind(this);
        this.arrowsItems = {
            arrowNext: this.node.querySelector('.ArrowNext'),
            arrowPrev: this.node.querySelector('.ArrowPrev')
        };
        this.arrowsItems.arrowNext.classList.add('ArrowIsVisible');
        this.arrowsItems.arrowPrev.classList.add('ArrowIsVisible');
        this.arrows();
    }
}

LightBoxGallery.prototype.init = function () {
    var self = this;
    //TODO : set a preloader
    setTimeout(function () {
        self.itemWidth = self.node.querySelector('img').getBoundingClientRect().width;
        self.totalWidth = self.itemWidth * self.imgList.length;
        self.node.addEventListener('click', self.moveSlider, false);
        console.log('galleryReady')
    }, 1000);
};

LightBoxGallery.prototype.moveSlider = function (status) {
    // var factorPlus = this.itemWidth;
    // var factorMinus = -this.itemWidth;
    // (this.sliderIndex >= this.imgList.length) ? console.log('vous etes au bout') : console.log('encore du chemin a faire');
    // this.gallerySelector.style.transform = "translateX(-" + factorPlus + "px)";
    if (status === "next") {
        console.log('move next')
    } else if (status === "prev") {
        console.log('move prev')
    }
};

LightBoxGallery.prototype.arrows = function () {
    console.log(this);
    var self = this;
    var a = this.arrowsItems.arrowNext;
    var b = this.arrowsItems.arrowPrev;
    a.addEventListener('click', function () {
        self.moveSlider("next");
        self.setSliderIndex("next");
        if (self.sliderIndex === self.imgList.length) a.classList.remove('ArrowIsVisible');
    });
    b.addEventListener('click', function () {
        self.moveSlider("prev");
        self.setSliderIndex("prev");
        if (self.sliderIndex === 0) b.classList.remove('ArrowIsVisible');
    })
};

LightBoxGallery.prototype.setSliderIndex = function (status) {
    if(status === "next") {
        return this.sliderIndex++;
    } else if(status === "prev") {
        return this.sliderIndex--;
    }
};



















'use strict';

function LightBoxGallery(node) {
    var self = this;
    this.node = node;
    this.captions = [];
    this.totalWidth = 0;
    this.itemWidth = 0;
    this.sliderIndex = 0;
    this.translate = 0;
    this.gallerySelector = node.querySelector('.GalleryContainer');
    this.imgList = node.getElementsByTagName('img');
    this.captionsSelector = node.querySelector('.GalleryCaptions');
    this.indexSelector = node.querySelector('.GalleryIndex');
    this.moveSlider = this.moveSlider.bind(this);
    this.manageCaptions = this.manageCaptions.bind(this);
    this.manageIndex = this.manageIndex.bind(this);
    //////////////////////////////////////////////////////////
    for (var i = 0; i < this.imgList.length; i++) {
        this.captions.push(this.imgList[i].getAttribute("alt"));
    }
    if (this.imgList.length > 1) {
        this.prevNext = this.prevNext.bind(this);
        this.arrowsItems = {
            arrowNext: this.node.querySelector('.ArrowNext'),
            arrowPrev: this.node.querySelector('.ArrowPrev')
        };
        this.prevNext();
    }
    this.manageCaptions();
    this.manageIndex();
    // node.querySelector('.GalleryOpenLightbox').addEventListener('click', function () {
    //     self.openLightBox();
    // });
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
    if (status === "next") {
        this.translate += this.itemWidth;
        this.gallerySelector.style.transform = "translateX(-" + this.translate + "px)";
    } else if (status === "prev") {
        this.translate -= this.itemWidth;
        this.gallerySelector.style.transform = "translateX(-" + this.translate + "px)";
    }
};

LightBoxGallery.prototype.prevNext = function () {
    var self = this;
    var a = this.arrowsItems.arrowNext;
    var b = this.arrowsItems.arrowPrev;
    displayArrows();
    a.addEventListener('click', function () {
        self.moveSlider("next");
        self.setSliderIndex("next");
        displayArrows();
        self.manageCaptions();
        self.manageIndex();
    });
    b.addEventListener('click', function () {
        self.moveSlider("prev");
        self.setSliderIndex("prev");
        displayArrows();
        self.manageCaptions();
        self.manageIndex();
    });

    function displayArrows() {
        if (self.sliderIndex === self.imgList.length - 1) {
            a.classList.add('ArrowIsHidden');
        } else if (self.sliderIndex === 0) {
            b.classList.add('ArrowIsHidden');
        } else if (self.sliderIndex >= 1) {
            if (a.classList.contains('ArrowIsHidden')) {
                a.classList.remove('ArrowIsHidden')
            }
            if (b.classList.contains('ArrowIsHidden')) {
                b.classList.remove('ArrowIsHidden')
            }
        }
    }
};

LightBoxGallery.prototype.setSliderIndex = function (status) {
    if (status === "next") {
        return this.sliderIndex++;
    } else if (status === "prev") {
        return this.sliderIndex--;
    }
};

LightBoxGallery.prototype.manageCaptions = function () {
    this.captionsSelector.firstElementChild.innerHTML = this.captions[this.sliderIndex];
};

LightBoxGallery.prototype.manageIndex = function () {
    this.indexSelector.firstElementChild.innerHTML = parseInt(this.sliderIndex + 1).toString();
};

LightBoxGallery.prototype.openLightBox = function () {
    console.log('openLightBox')
};



















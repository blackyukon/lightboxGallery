'use strict';

function LightBoxGallery(node) {
    if (!node) console.warn('LightBoxGallery - You need to declare a node as parameter');
    var self = this;
    this.node = node;
    this.captions = [];
    this.imgsUrl = [];
    this.totalWidth = 0;
    this.itemWidth = 0;
    this.sliderIndex = 0;
    this.translate = 0;
    this.isLightboxOpened = false;
    this.galleryContainer = node.querySelector('.Gallery');
    this.galleryContainerSelector = node.querySelector('.GalleryContainer');
    this.galleryRowSelector = node.querySelectorAll('.GalleryRow');
    this.imgList = node.getElementsByTagName('img');
    this.captionsSelector = node.querySelector('.GalleryCaptions');
    this.indexSelector = node.querySelector('.GalleryIndex');
    this.lightboxSelector = node.querySelector('.Lightbox');
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
    node.querySelector('.GalleryOpenLightbox').addEventListener('click', function () {
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
        console.warn('galleryReady - preload fix will ensue')
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
            this.galleryNextBtn.classList.remove('ArrowIsHidden')
        }
        if (this.galleryPrevBtn.classList.contains('ArrowIsHidden')) {
            this.galleryPrevBtn.classList.remove('ArrowIsHidden')
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
                nextBtn.classList.remove('ArrowIsHidden')
            }
            if (prevBtn.classList.contains('ArrowIsHidden')) {
                prevBtn.classList.remove('ArrowIsHidden')
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



















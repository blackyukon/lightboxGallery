'use strict';

window.addEventListener('DOMContentLoaded', function() {
    var domGalleryNode = document.querySelector('.myGalleryExample');
    var instanceGallery = new LightBoxGallery(domGalleryNode);
    instanceGallery.init();
});
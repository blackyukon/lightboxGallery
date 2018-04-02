import LightBoxGallery from '../src/LightboxGallery';
// import LightBoxGallery from './build/bundle';

window.addEventListener('DOMContentLoaded', () => {
  const instanceGallery = new LightBoxGallery({
    container: document.querySelector('.myGalleryExample')
  });
  // instanceGallery.init();
});
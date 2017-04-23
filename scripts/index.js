/**
 * NOTE --
 * Implicit dependencies on Slidebox.js, dataServices.js, thumbnailUtils.js, constants.js, utils.js
 */

(function ({ dataServices, Slidebox, thumbnailUtils, constants, utils }) {
  
  let imageAPI       = constants.IMAGE_APIS.FLICKR,
      numberOfImages = utils.getNumberOfImagesFromUrl() || 4,
      testImagesUrl  = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=21e5e4a88d2aa2bd5a12c929f7647cb7&photoset_id=72157627669341535&per_page=${ numberOfImages }&page=8&format=json&nojsoncallback=1`;

  dataServices.getImageDataFrom(imageAPI, testImagesUrl)
    .then(initSlidebox)
    .then(thumbnailUtils.renderThumbnailsTo(document.querySelector('.thumbnails')));

  function initSlidebox (slidesData) {
    // Need to return these in order to allow thumbnails to show the Slidebox
    // TODO : build thumbnails into the Slidebox
    return {
      slidesData,
      slidebox : new Slidebox(slidesData)
    };
  }

})({
  dataServices   : window.yoshow.dataServices,
  Slidebox       : window.yoshow.Slidebox,
  thumbnailUtils : window.yoshow.thumbnailUtils,
  constants      : window.yoshow.constants,
  utils          : window.yoshow.utils
});

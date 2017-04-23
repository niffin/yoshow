(function () {
  
  function renderThumbnailsTo (thumbsContainerEl) {
    // wishlist : include thumbnails as part of SlideBox
    return ({ slidesData, slidebox }) => {
      slidesData.forEach((image, index) => {
        const thumbWrapEl = document.createElement('div'),
              thumbEl     = document.createElement('img');

        thumbEl.src = image.src;
        thumbWrapEl.classList.add('thumbnail');

        thumbWrapEl.addEventListener('click', showSlideboxWithImgAt(index, slidebox));

        thumbWrapEl.appendChild(thumbEl);
        thumbsContainerEl.appendChild(thumbWrapEl);
      });
    };
  }

  function showSlideboxWithImgAt (index, slidebox) {
    return e => {
      e.stopPropagation();
      slidebox.showSlideAtIndex(index);
      slidebox.show();
    };
  }

  window.yoshow.thumbnailUtils = {
    renderThumbnailsTo
  };
})();

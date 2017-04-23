(function () {
  getImageSources()
    .then(renderThumbnailsTo(document.querySelector('.thumbnails')));

  function getImageSources () {
    const url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=1800104bf8400142b341d84f76471c7a&photoset_id=72157627669341535&per_page=4&page=3&format=json&nojsoncallback=1';
    return fetch(url)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(json => {
        try {
          return json.photoset.photo.map(extractImageSource);
        } catch (e) {
          console.error('Uh oh, looks like Flikr changed the shape of their API response!');
          return [];
        }
      })
      .catch(console.error);
  }

  function extractImageSource (rawImageAPIResponse) {
    try {
      return {
        title : rawImageAPIResponse.title,
        src   : `https://farm${ rawImageAPIResponse.farm }.staticflickr.com/${ rawImageAPIResponse.server }/${ rawImageAPIResponse.id }_${ rawImageAPIResponse.secret }.jpg`
      };
    } catch (e) {
      console.warn('Couldn\'t extract the URL from ', rawImageAPIResponse);
      return {};
    }
  }

  function renderThumbnailsTo (thumbsContainerEl) {
    return images => {
      images.forEach(image => {
        const thumbWrapEl = document.createElement('div'),
              thumbEl     = document.createElement('img');

        thumbEl.src = image.src;
        thumbWrapEl.classList.add('thumbnail');

        thumbWrapEl.addEventListener('click', showLightboxWithImg(image.src));

        thumbWrapEl.appendChild(thumbEl);
        thumbsContainerEl.appendChild(thumbWrapEl);
      });
    };
  }

  function showLightboxWithImg (imgSrc) {
    return e => {
      e.stopPropagation();
      setLightboxImg(imgSrc);
      document.body.classList.add('lightboxed');
      document.body.addEventListener('click', hideLightbox);
    };
  }

  function setLightboxImg (imgSrc) {
    document.querySelector('.lightbox img').src = imgSrc;
  }

  function hideLightbox () {
    document.body.classList.remove('lightboxed');
    document.body.removeEventListener('click', hideLightbox);
  }
})();

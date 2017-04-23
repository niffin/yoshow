(function () {
  const IMAGE_APIS = {
    FLICKR : 'flickr',
    GIPHY  : 'giphy',
    GOOGLE : 'google'
  };
  
  // kick off mini app
  let testImagesUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=1800104bf8400142b341d84f76471c7a&photoset_id=72157627669341535&per_page=4&page=8&format=json&nojsoncallback=1',
      imageAPI  = IMAGE_APIS.FLICKR;

  getImageDataFrom(imageAPI, testImagesUrl)
    .then(initSlideBox)
    .then(renderThumbnailsTo(document.querySelector('.thumbnails')));

  // application code
  function getImageDataFrom (imageAPI, imagesUrl) {
    return fetch(imagesUrl) 
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(json => {
        try {
          switch (imageAPI) {
            case IMAGE_APIS.FLICKR :
              return json.photoset.photo.map(extractFlickrImageData);
            default :
              console.log('This image API (' + imageAPI + ') is not supported at this time. Maybe one day?');
              return [];
          }
        } catch (e) {
          console.error('Uh oh, looks like Flikr changed the shape of their API response!');
          return [];
        }
      })
      .catch(console.error);
  }

  function extractFlickrImageData (rawImageAPIResponse) {
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

  function initSlideBox (slidesData) {
    return {
      slidesData,
      slideBox : new SlideBox(slidesData),
    };
  }

  class SlideBox {
    constructor (slides, selector) {
      this.el = document.querySelector(selector || '.slidebox.container');
      
      this.img   = this.el.querySelector('img');
      this.title = this.el.querySelector('.slide-title');

      this.controls = {
        prev : this.el.querySelector('.control.prev'),
        next : this.el.querySelector('.control.next')
      };

      this.state = {
        slides            : slides,
        currentSlideIndex : 0
      };

      this.controls.next.addEventListener('click', this.showNext.bind(this));
      this.controls.prev.addEventListener('click', this.showPrev.bind(this));
    }

    showSlideAtIndex (index) {
      this.state.currentSlideIndex = index;
      this.img.src                 = this.state.slides[index].src;
      this.title.textContent       = this.state.slides[index].title;
    }

    showNext (e) {
      e.stopPropagation();
      const { currentSlideIndex, slides } = this.state;
      this.showSlideAtIndex((currentSlideIndex + 1) % slides.length);
    }

    showPrev (e) {
      e.stopPropagation();
      const { currentSlideIndex, slides } = this.state,
            prevIndex = currentSlideIndex === 0 ? (slides.length - 1) : currentSlideIndex - 1;
      this.showSlideAtIndex(prevIndex);
    }

    show () {
      document.body.classList.add('slideboxed');
      document.body.addEventListener('click', this.hide);
      document.body.addEventListener('keydown', this.keyBoardNavigation.bind(this));
    }

    keyBoardNavigation (e) {
      e.stopPropagation();
      switch (e.key) {
        case 'ArrowLeft' :
          this.showPrev(e);
          break;
        case 'ArrowRight' :
          this.showNext(e);
          break;
        case 'Escape' :
          this.hide();
          break;
        default :
      }
    }

    hide () {
      document.body.classList.remove('slideboxed');
      document.body.removeEventListener('click', this.hide);
      document.body.removeEventListener('keydown', this.keyBoardNavigation);
    }
  }

  function renderThumbnailsTo (thumbsContainerEl) {
    // wishlist : get rid of slideBox dependency 
    return ({ slidesData, slideBox }) => {
      slidesData.forEach((image, index) => {
        const thumbWrapEl = document.createElement('div'),
              thumbEl     = document.createElement('img');

        thumbEl.src = image.src;
        thumbWrapEl.classList.add('thumbnail');

        thumbWrapEl.addEventListener('click', showSlideBoxWithImgAt(index, slideBox));

        thumbWrapEl.appendChild(thumbEl);
        thumbsContainerEl.appendChild(thumbWrapEl);
      });
    };
  }

  function showSlideBoxWithImgAt (index, slideBox) {
    return e => {
      e.stopPropagation();
      slideBox.showSlideAtIndex(index);
      slideBox.show();
    };
  }

})();

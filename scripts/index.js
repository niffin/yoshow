(function () {
  const IMAGE_APIS = {
    FLICKR : 'flickr',
    GIPHY  : 'giphy',
    GOOGLE : 'google'
  };
  
  /**
   * Kick off mini app
   */
  let testImagesUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=21e5e4a88d2aa2bd5a12c929f7647cb7&photoset_id=72157627669341535&per_page=4&page=8&format=json&nojsoncallback=1',
      imageAPI      = IMAGE_APIS.FLICKR;

  getImageDataFrom(imageAPI, testImagesUrl)
    .then(initSlideBox)
    .then(renderThumbnailsTo(document.querySelector('.thumbnails')));

  /**
   * Application code
   */
  
  // Data services
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
              alert('This image API (' + imageAPI + ') is not supported at this time. Maybe one day?');
              return [];
          }
        } catch (e) {
          alert('Uh oh, looks like Flikr changed the shape of their API response! Or maybe the API key went bad?');
          return [];
        }
      })
      .catch(err => alert(err + '\n\n url - ' + imagesUrl));
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

  // SlideBox component
  function initSlideBox (slidesData) {
    // Need to return these in order to link between SlideBox and thumbnails
    return {
      slidesData,
      slideBox : new SlideBox(slidesData),
    };
  }

  class SlideBox {
    constructor (slides = [], selector) {
      // SlideBox expects an array of slides in the following shape:
      // {
      //    src   : String,
      //    title : String
      // }
      this.el = document.querySelector(selector || '.slidebox.container');
      
      this.img   = this.el.querySelector('.slide-image');
      this.title = this.el.querySelector('.slide-title');

      this.controls = {
        prev : this.el.querySelector('.control.prev'),
        next : this.el.querySelector('.control.next')
      };

      this.state = {
        slides            : slides,
        currentSlideIndex : 0
      };

      this.keyBoardNavigation = this.keyBoardNavigation.bind(this);
      this.show               = this.show.bind(this);
      this.hide               = this.hide.bind(this);
      this.showNext           = this.showNext.bind(this);
      this.showPrev           = this.showPrev.bind(this);

      this.controls.next.addEventListener('click', this.showNext);
      this.controls.prev.addEventListener('click', this.showPrev);
    }

    showSlideAtIndex (index) {
      const currentSlide = this.state.slides[index];
      
      this.state.currentSlideIndex   = index;
      this.img.style.backgroundImage = `url(${ currentSlide.src })`;
      this.title.textContent         = currentSlide.title;
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
      document.body.addEventListener('keydown', this.keyBoardNavigation);
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
    // wishlist : include thumbnails as part of SlideBox
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

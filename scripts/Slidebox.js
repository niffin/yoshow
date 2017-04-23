(function () {
  
  class Slidebox {
    constructor (slides = [], selector) {
      // Slidebox expects an array of slides in the following shape:
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

  window.yoshow.Slidebox = Slidebox;
})();

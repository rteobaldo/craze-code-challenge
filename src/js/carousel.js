const Carousel = (selector) => {
  const slider = document.querySelector(selector);
  const sliderContainer = slider.querySelector('.carousel__container');
  const slides = sliderContainer.querySelectorAll('.carousel__slide');
  const pagination = slider.querySelector('.carousel__pagination');
  let autoRotateObj = {};

  const getActiveSlide = () => {
    return sliderContainer.querySelector('.is-active');
  };

  /**
   * Changes position of slider
   */
  const moveSlider = (movesTo) => {
    let slideWidth = parseFloat(window.getComputedStyle(slides[0]).getPropertyValue('width'));
    let activeSlide = getActiveSlide().dataset.slideIndex;
    let total = ((slideWidth * movesTo) * -1);

    sliderContainer.setAttribute('style', `transform: translate3d(${total}px, 0, 0)`);
    slides[activeSlide].classList.remove('is-active');
    slides[movesTo].classList.add('is-active');
  };

  /**
   * Handles event listeners
   */
  const changeSlide = (slideId) => {
    moveSlider(slideId);
    updatePagination(slideId);
  };

  /**
   * Creates pagination based on number of slides
   */
  const createPagination = () => {
    let paginationSize = slides.length;
    let paginationItems = [];

    let frag = document.createDocumentFragment();

    for (let i = 0; i < paginationSize; ++i) {
      let el = document.createElement('button');
      el.dataset.slideIndex = i;
      el.classList.add('carousel__pagination__item');

      frag.appendChild(el);
    }

    // Add class is-active for the first element
    frag.childNodes[0].classList.add('is-active');
    pagination.appendChild(frag);

    addPaginationEventListener();
  };

  /**
   * Starts pagination event listener
   */
  const addPaginationEventListener = () => {
    pagination.addEventListener('click', function(e) {
      let target = e.target;

      if (target.classList.contains('carousel__pagination__item')) {
        changeSlide(target.dataset.slideIndex);
        pagination.querySelector('.is-active').classList.remove('is-active');
        target.classList.add('is-active');
      }

      // Stops auto rotate after user interacts
      stopAutoRotate();
    });
  };

  const updatePagination = (activeSlide) => {
    pagination.querySelector('.is-active').classList.remove('is-active');
    pagination.childNodes[activeSlide].classList.add('is-active');
  };

  const autoRotate = () => {
    let activeSlide = parseInt(getActiveSlide().dataset.slideIndex);
    let slidesLength = slides.length - 1;

    if (activeSlide < slidesLength) {
      changeSlide(activeSlide + 1);
    } else {
      changeSlide(0);
    }
  };

  const startAutoRotate = () => {
    autoRotateObj = requestInterval(autoRotate, 4000);
  }

  const stopAutoRotate = () => {
    autoRotateObj.clear();
  };

  // Set slide index on each slide
  for (let i = 0; i < slides.length; i++) {
    slides[i].dataset.slideIndex = i;
  }

  createPagination();
  startAutoRotate();
};

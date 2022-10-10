$(".hp-slider-section__inner.js-slider").slick({
  slidesToShow: 2,
  slidesToScroll: 2,
  arrows: true,
  dots: false,
  infinite: true,
  // speed: 3000,
  // autoplay: true,
  prevArrow:
    '<button class="slider__btn slider__btnprev"><img src="images/ico/hp-left-slider.svg" alt="" ></button> ',
  nextArrow:
    ' <button class="slider__btn  slider__btnnext"><img src="images/ico/hp-right-slider.svg" alt = "" ></button>',
  responsive: [
    {
      breakpoint: 1321,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
  ],
});

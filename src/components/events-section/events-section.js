$(".c-events-section .js-slider").slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  infinite: true,

  prevArrow:
    '<button class="slider__btn slider__btnprev"><img src="/images/ico/left-slider.svg" alt="" ></button> ',
  nextArrow:
    ' <button class="slider__btn  slider__btnnext"><img src="/images/ico/right-slider.svg" alt = "" ></button>',
  responsive: [
    {
      breakpoint: 1641,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
    {
      breakpoint: 1201,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
    {
      breakpoint: 641,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
      },
    },
  ],
});

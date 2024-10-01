// Light Gallery
$("#animated-thumbnail").lightGallery({
  thumbnail: true,
  getCaptionFromTitleOrAlt: true,
  selector: "a[style]",
});
// Image Transition
var scroll = "yes",
  Fscroll = scroll.replace(/(\r\n|\n|\r)/gm, " ");

if (Fscroll === "yes") {
  $(document).ready(function () {
    // Проверяем, существует ли элемент с id shops-map-page
    if ($("#shops-map-page").length) {
      $("body").removeClass("imgani"); // Удаляем класс imgani
    } else {
      $("body").addClass("imgani"); // Добавляем класс imgani
    }
  });

  $(window).bind("load resize scroll", function () {
    var o = $(this).height();
    $("img").each(function () {
      var s = 0.1 * $(this).height() - o + $(this).offset().top;
      if ($(document).scrollTop() > s) {
        $(this).addClass("anime");
      }
    });
  });
}

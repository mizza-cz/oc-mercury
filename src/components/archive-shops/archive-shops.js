$(".c-archive-shops__form-filter").on("click", function () {
  $(this).toggleClass("c-archive-shops__form-filter--closed");
  $(this).next().slideToggle();
});
document
  .querySelectorAll(".c-archive-shops__form input[type=checkbox]")
  .forEach((input) =>
    input.addEventListener("change", () => input.form.submit())
  );

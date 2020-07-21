import $ from "jquery";

$('.btn--modal').on('click', function () {
  $('.modal').fadeIn(200);
  $('body').addClass('body-lock');
});

$('.modal__close').on('click', function () {
  $('.modal').fadeOut(200);
  $('body').removeClass('body-lock');
});

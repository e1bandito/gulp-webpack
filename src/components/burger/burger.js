import $ from "jquery";

$('.burger').on('click', function () {
  $(this).toggleClass('burger--open');
  $('.nav').toggleClass('nav--open');
  $('body').toggleClass('body-lock');
});

$('.nav__link').on('click', function () {
  if ('nav--open') {
    $('.nav').removeClass('nav--open');
    $('.burger').removeClass('burger--open');
    $('body').removeClass('body-lock');
  }
});

import $ from 'jquery';

$('.accordion__title').on('click', function () {
  $(this).toggleClass('open').next().slideToggle(200);
  $('.accordion__title').not(this).removeClass('open').next().slideUp(200);
});

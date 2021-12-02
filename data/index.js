let interval;
let timeData = [];

$(document).ready(function (e) {
  setXmlData();

  $('.body-player__slide-list').on('click', ".slide", switchOnClickSlide)

  $('.body-player__video-wrapper video').on('play', switchSlideOnPlaying);
  $('.body-player__video-wrapper video').on('pause', () => clearInterval(interval));
});

const setXmlData = () => {
  $.ajax({
    url: "./index.xml",
    success: function(xml){
      let video = '';
      $(xml).find('video').each(function () {
        video = $(this).attr('label');
      })

      $('.body-player__video-wrapper video').attr('src', video);


      $(xml).find('slide').each(function(){
        const time = $(this).attr('time');
        const file = $(this).attr('file');


        const minute = +time.split(':')[0];
        const second = +time.split(':')[1].split('.')[0];
        const timeSeconds = minute * 60 + second;
        timeData.push(timeSeconds);

        $('.body-player__slide-list').append('<img src="' + file + '" alt="slide" class="slide" data-time="' + time + '" data-second="' + timeSeconds + '">')
      });
    }

  });
}

function switchOnClickSlide (e) {
  let current = '';

  $(this).each(function () {
    current = $(this).attr('data-time');
  })

  const video = $('.body-player__video-wrapper video')[0];

  const minute = +current.split(':')[0];
  const second = +current.split(':')[1].split('.')[0];
  const time = minute * 60 + second;

  video.currentTime = time;
  video.play();

  $('.body-player__slide-list .slide').removeClass('active-slide');
  $(this).addClass('active-slide');

  $('html, body').animate({
    scrollTop: $(".active-slide").offset().top - 300
  }, 1000);
}

function switchSlideOnPlaying (e) {
  const video = $('.body-player__video-wrapper video')[0];

  interval = setInterval(() => {
    let needIndex = 0;
    let index = 0;
    timeData.forEach(time => {
      if(time < video.currentTime) {
        needIndex = index;
      }
      index++;
    })


    if(!$('.body-player__slide-list .slide')[needIndex].classList.contains('active-slide')) {
      $('.body-player__slide-list .slide').removeClass('active-slide');
      $('.body-player__slide-list .slide')[needIndex].classList.add('active-slide')

      $('html, body').animate({
        scrollTop: $(".active-slide").offset().top - 300
      }, 1000);
    }
  }, 1000)
}
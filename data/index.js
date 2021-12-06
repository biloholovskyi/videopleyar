let interval;
let timeData = [];

const thumbnail = $('.video-thumbnail');
const progressBar = $('.video-progress-bar');
const videoWrapper = $('.body-player__video-wrapper');

$(document).ready(function (e) {
  setXmlData();

  const video = $('.body-player__video-wrapper video');

  // $('.body-player__slide-list').on('click', ".slide", switchOnClickSlide)

  video.on('play', () => switchSlideOnPlaying());
  video.on('pause', () => {
    clearInterval(interval);
    videoWrapper.attr('data-status', 'stop');
  });
  video.on('timeupdate', () => {
    if(videoWrapper.attr('data-status') === 'stop') {
      video[0].play()
    }
  })
  $('.slide-buttons').on('click', '.slide-button', switchOnButton)
  progressBar.on('mousemove', (e) => showThumbnail(e))
  progressBar.on('mouseleave', () => hiddenThumbnail())

});

// get data from xml
const setXmlData = () => {
  $.ajax({
    url: "./index.xml",
    success: function (xml) {
      let video = '';
      $(xml).find('video').each(function () {
        video = $(this).attr('label');
      })

      // set video from xml
      $('.body-player__video-wrapper video').attr('src', video);


      // render all slides and buttons
      let count = 1;
      $(xml).find('slide').each(function () {
        const time = $(this).attr('time');
        const file = $(this).attr('file');


        const minute = +time.split(':')[0];
        const second = +time.split(':')[1].split('.')[0];
        const timeSeconds = minute * 60 + second;
        timeData.push(timeSeconds);

        // render slides
        $('.body-player__slide-list').append(`<img src="${file}" alt="slide" class="slide ${count === 1 && "active-slide"}" data-time="${time}" data-second="${timeSeconds}">`)

        // render buttons
        $('.slide-buttons').append(`<div class="slide-button ${count === 1 && "slide-button--active"}" data-time="${time}" data-second="${timeSeconds}">${count}</div>`)
        count++;
      });
    }
  })
    .catch(e => console.error(e));
}

// switch video on slide click
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
    scrollTop: $(".active-slide").offset().top - 360
  }, 1000);
}

// switch slide on video playing
function switchSlideOnPlaying (e) {
  const video = $('.body-player__video-wrapper video')[0];
  const slides = $('.body-player__slide-list .slide');
  const buttons = $('.slide-buttons .slide-button');

  $('.body-player__video-wrapper').attr('data-status', 'play');

  interval = setInterval(() => {
    let needIndex = 0;
    let index = 0;
    timeData.forEach(time => {
      if(time < video.currentTime) {
        needIndex = index;
      }
      index++;
    })


    if(!slides[needIndex].classList.contains('active-slide')) {
      slides.removeClass('active-slide');
      slides[needIndex].classList.add('active-slide')
    }

    if(!buttons[needIndex].classList.contains('slide-button--active')) {
      buttons.removeClass('slide-button--active');
      buttons[needIndex].classList.add('slide-button--active')
    }
  }, 1000)
}

// switch video on button click
function switchOnButton (e) {
  let current = '';
  console.log($(this));

  $(this).each(function () {
    current = $(this).attr('data-second');
  })

  const video = $('.body-player__video-wrapper video')[0];

  video.currentTime = current;
  video.play();

  $('.body-player__slide-list .slide').removeClass('active-slide');

  $('.slide-buttons .slide-button').removeClass('slide-button--active');
  $(this).addClass('slide-button--active');
}

// show thumbnail on progress bar hover
function showThumbnail (e) {
  thumbnail.fadeIn('fast');

  thumbnail.css({
    left: `${e.pageX}px`,
  })
}

// hidden thumbnail
function hiddenThumbnail () {
  thumbnail.fadeOut('fast');
}
// Check is on screen
(function ($) {
  const $window = $(window);

  $.fn.isOnScreen = function (percent = 1) {
    const $el = $(this);
    let scrollTop = $window.scrollTop();
    let screenHeight = $window.outerHeight();
    let offsetTop = $el.offset().top;
    let height = $el.outerHeight();

    return scrollTop > offsetTop - screenHeight + percent * height && scrollTop < offsetTop + (1 - percent) * height;
  };
})(jQuery);

// count To
// js-count-to(data-count-to="1000")
(function ($) {
  $.fn.countTo = function (options) {
    // merge the default plugin settings with the custom options
    options = $.extend({}, $.fn.countTo.defaults, options || {});

    // how many times to update the value, and how much to increment the value on each update
    var loops = Math.ceil(options.speed / options.refreshInterval),
        increment = (options.to - options.from) / loops;

    return $(this).each(function () {
      var _this = this,
          loopCount = 0,
          value = options.from,
          interval = setInterval(updateTimer, options.refreshInterval);

      function updateTimer() {
        value += increment;
        loopCount++;
        // $(_this).html(value.toFixed(options.decimals));
        $(_this).html(Math.floor(value).toLocaleString("en"));

        if (typeof options.onUpdate == "function") {
          options.onUpdate.call(_this, value);
        }

        if (loopCount >= loops) {
          clearInterval(interval);
          value = options.to;

          $(_this).html(Math.floor(value).toLocaleString("en"));

          if (typeof options.onComplete == "function") {
            options.onComplete.call(_this, value);
          }
        }
      }
    });
  };

  $.fn.countTo.defaults = {
    from: 0, // the number the element should start at
    to: 100, // the number the element should end at
    speed: 1000, // how long it should take to count between the target numbers
    refreshInterval: 100, // how often the element should be updated
    decimals: 0, // the number of decimal places to show
    onUpdate: null, // callback method for every time the element is updated,
    onComplete: null // callback method for when the element finishes updating
  };
})(jQuery);

jQuery(function ($) {
  // requirement
  if (!$.fn.isOnScreen) {
    console.warn("Jquery.isOnScreen function is required!");
    return;
  }

  const $window = $(window);
  const $count = $(".js-count-to");

  count();

  $(window).on("scroll", count);

  function count() {
    let vh = $window.outerHeight();
    let scrollTop = $window.scrollTop();

    $count.not(".actived").each(function () {
      let $el = $(this);
      let count = $(this).data("countTo");

      if ($el.isOnScreen(1)) {
        $el.addClass("actived").countTo({
          from: 0,
          to: count,
          speed: 2000,
          refreshInterval: 5
        });
      }
    });
  }
});

// Toggle Video
$(function () {
  $(".welcome-video__overlay").on("click", function () {
    const $frame = $(this).parent().find("iframe");
    $(this).detach().remove();
    $frame.attr("src", $frame.data("src") + "?autoplay=1");
  });
});

// countdown timer

// .js-countdown(data-countdown="2021-1-24T12:45:04")

$(function () {
  $(".js-countdown").each(function () {
    let countdown = $(this).data("countdown");

    if (!countdown) return;

    let endTime = parseDate(countdown);

    let interval;

    const buildClock = () => {
      let thisTime = new Date().getTime();

      let duration = endTime - thisTime;

      if (duration < 0 && interval) {
        clearInterval(interval);

        return;
      }

      let seconds = Math.floor(duration / 1000 % 60);

      let minutes = Math.floor(duration / (1000 * 60) % 60);

      let hours = Math.floor(duration / (1000 * 60 * 60) % 24);

      let days = Math.floor(duration / (1000 * 60 * 60 * 24));

      let ampm = hours >= 12 ? "pm" : "am";

      // hours = hours * 12;

      seconds = ("0" + seconds).slice(-2);

      minutes = ("0" + minutes).slice(-2);

      hours = hours >= 10 ? hours : ("0" + hours).slice(-2);

      $(this).html(getCountDownTemplate({
        seconds,

        minutes,

        hours,

        days,

        ampm
      }));
    };

    buildClock();

    interval = setInterval(buildClock, 1000);
  });

  function parseDate(s) {
    var dateTime = s.split("T");

    var dateBits = dateTime[0].split("-");

    var timeBits = dateTime[1].split(":");

    return new Date(dateBits[0], parseInt(dateBits[1]) - 1, dateBits[2], timeBits[0], timeBits[1], timeBits[2]).valueOf();
  }

  function getCountDownTemplate(timer = {}) {
    return `
<div class="countdown__item">
    <div class="countdown__number">${timer.days}</div>
    <div class="countdown__label">Ngày</div>
</div>
<div class="countdown__item">
    <div class="countdown__number">${timer.hours}</div>
    <div class="countdown__label">Giờ</div>
</div>
<div class="countdown__item">
    <div class="countdown__number">${timer.minutes}</div>
    <div class="countdown__label">Phút</div>
</div>
<div class="countdown__item">
    <div class="countdown__number">${timer.seconds}</div>
    <div class="countdown__label">Giây</div>
</div>
    `;
  }
});
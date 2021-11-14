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

/**
 * Thiết lập trò chơi vòng quay may mắn
 */
$(function () {
  const $circle = $(".m-game__bg");
  const $light = $(".m-game__light");

  var turn = 0; // Số lượt quay
  var token = true;
  var totalGift = 12;
  var oneGiftDeg = 360 / totalGift;

  $(".js-game-start").on("click", function () {
    /**
     *  Kiểm tra token (đang quay thì không được ấn thêm)
     */
    if (!token) return;
    token = false;

    // Chặn chỉ cho quay 1 lượt
    if (turn >= 1) {
      // Thông báo hết lượt quay
      console.log("Bạn đã hết lượt chơi!");
      return;
    }
    turn++;

    $light.hide();

    var giftIndex = randomGift();
    var oldDeg = $circle.data("rotate") ? $circle.data("rotate") : 0;
    var deg = giftIndex * oneGiftDeg + 3 * 360 + oldDeg + oldDeg % 360;

    $circle.data("rotate", deg);
    $circle.css("transform", `rotate(${deg}deg)`);

    /**
     * Sau thời gian quay
     * Cần tạo 1 hàm tên showGameResult(giftIndex) để
     * tính toán đưa ra phần thưởng tương ứng
     * Truyền vào tham số 'giftIndex' là số thứ tự phần thưởng (tính từ 0 - 15)
     *
     * Nếu chưa tạo hàm này sẽ chạy code show sản phẩm demo
     */
    setTimeout(() => {
      token = true;
      if (window.showGameResult && typeof window.showGameResult == "function") {
        showGameResult(giftIndex);
      } else {
        // Hiển thị phần thưởng demo
        $light.fadeIn();
        $(".lucky-rotation__info").hide();
        $(".js-game-gift").eq(giftIndex).addClass("show");
        console.log(giftIndex);
      }
    }, 7000);
  });
});

/**
 * Lấy random 1 sản phẩm dựa theo tỉ lệ cho sẵn;
 * @returns index sản phẩm đếm từ 0->15
 */
function randomGift() {
  var ratios = Array.from(document.querySelectorAll(".js-game-gift"), item => {
    return parseFloat($(item).data("scale") || 0);
  });
  var length = ratios.length;
  var rand = Math.random() * 100;
  var total = 0;
  var giftIndex = 0;

  do {
    total += ratios[giftIndex++];
  } while (giftIndex < length && (ratios[giftIndex - 1] == 0 || total <= rand));

  return giftIndex - 1;
}

/**
 * Preview image input when uploaded
 */
$(function () {
  $(".js-input-preview").on("change", function () {
    let input = this;
    let parent = $(input).data("parent");
    let target = $(input).data("target");
    let multiple = $(input).prop("multiple");
    let $target;

    if (!target) return;

    if (parent) {
      $target = $(input).closest(parent).find(target);
    } else {
      $target = $(target);
    }

    if (!multiple) {
      $target.empty();
    }

    if (input.files) {
      let filesAmount = input.files.length;

      for (i = 0; i < filesAmount; i++) {
        let reader = new FileReader();

        reader.onload = function (event) {
          $($.parseHTML("<img>")).attr("src", event.target.result).appendTo($target);
        };

        reader.readAsDataURL(input.files[i]);
      }
    }
  });
});

/**
 * Download image
 *
 */
$(function () {
  const $previewInput = $(".js-input-preview");

  if (!$previewInput.length) return;

  const $hiddenInput = $(".js-image-value");
  const $section = $(".uploads");

  $previewInput.on("change", function () {
    const el = document.querySelector(".uploads__image-outer");
    const scale = 3;

    setTimeout(() => {
      domtoimage.toJpeg(el, {
        width: el.clientWidth * scale,
        height: el.clientHeight * scale,
        style: {
          transform: "scale(" + scale + ")",
          "transform-origin": "top left"
        }
      }).then(dataUrl => {
        $section.addClass("active");
        $hiddenInput.val(dataUrl);
      });
    }, 300);
  });

  $(".js-download-image").on("click", function (e) {
    e.preventDefault();

    var imgData = $hiddenInput.val();

    if (imgData) {
      download([imgData]);
      return;
    }

    console.log("No image data!");
  });
});

function download(images) {
  images.map(function (image) {
    let link = document.createElement("a");
    link.href = image;
    link.download = "Download.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/**
 * Calc and run progress bar
 * Change progress number
 */
$(function () {
  const $progress = $(".n-progress");

  if (!$progress.length) return;

  const duration = $progress.data("duration") || 2000;
  const $number = $(".n-progress__number");
  const $rotateImgs = $(".n-progress__img-2, .n-progress__img-3, .n-progress__light");

  $number.find("span").countTo({
    from: 0,
    to: 100,
    speed: duration,
    refreshInterval: 5,
    onUpdate: val => {
      let deg = val * 360 / 100;

      val = Math.ceil(val);

      $rotateImgs.css("transform", `rotate(${deg}deg)`);

      if (val >= 50) {
        $progress.addClass("over-half");
      }
    },
    onComplete: () => {
      $progress.addClass("is-completed");
    }
  });
});

// toggle share btns
$(function () {
  $(".share-btns__toggle").on("click", function (e) {
    e.preventDefault();

    $(this).siblings(".share-btns__dropdown").fadeToggle("fast");
  });
});
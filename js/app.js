/**
 * Chỉnh kích thước khung video vừa với màn hình
 */
$(function () {
  resizeVideoContainer();
});

function resizeVideoContainer() {
  const $videoContainer = $(".video-container");
  const $content = $(".page__content");

  if (!$content.length) return;

  calcVideoWidth();

  $(window).on("resize", calcVideoWidth);

  function calcVideoWidth() {
    const paddingLeft = parseInt($content.css("padding-left") || 0);
    const paddingRight = parseInt($content.css("padding-right") || 0);
    let width = $content.innerWidth() - paddingLeft - paddingRight;
    let height = $content.innerHeight();

    if (height > width * 16 / 9) return;

    width = height / 9 * 16;

    $videoContainer.css("maxWidth", width);
  }
}

/**
 * Thiết lập trò chơi vòng quay may mắn
 */
$(function () {
  const $circle = $(".m-game__bg");
  const $light = $(".m-game__light");
  const $gift = $(".js-game-gift");
  var token = true;
  var totalGift = 16;
  var oneGiftDeg = 360 / 16;

  $(".js-game-start").on("click", function () {
    /**
     *  Kiểm tra token (đang quay thì không được ấn thêm)
     */
    if (!token) return;
    token = false;

    $light.hide();

    /**
     * Random quay thêm >3 vòng
     * Bằng: Số random 0-360* + số vòng quay cũ + 3 * 360
     * Quay vòng tròn với số vòng tương ứng
     */
    var rand = Math.random();
    var oldDeg = $circle.data("rotate") ? $circle.data("rotate") : 0;

    var deg = Math.floor(rand * 360) + 3 * 360 + oldDeg;

    $circle.data("rotate", deg);
    $circle.css("transform", `rotate(${deg}deg)`);

    /**
     * Tính góc lệch của vòng quay để chiếu sáng ô phần thưởng
     */
    deg2 = (deg - oneGiftDeg / 2) % oneGiftDeg - 90 - oneGiftDeg;
    $light.css("transform", `rotateZ(${deg2}deg) skewX(68deg)`);

    /**
     * Sau thời gian quay
     * Cần tạo 1 hàm tên showGameResult(deg) để
     * tính toán đưa ra phần thưởng tương ứng
     * Truyền vào tham số 'deg' là số góc quay của vòng tròn
     *
     * Nếu chưa tạo hàm này sẽ chạy code show sản phẩm demo
     */
    setTimeout(() => {
      token = true;
      if (window.showGameResult && typeof window.showGameResult == "function") {
        showGameResult(giftIndex);
      } else {
        // Hiển thị phần thưởng demo
        $gift.addClass("show");
        $light.fadeIn();
      }
    }, 7000);
  });
});

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
  $(".js-download-image").on("click", async function () {
    image = await domtoimage.toJpeg(document.querySelector(".uploads__image-outer"));

    download([image]);
  });
});

function convert2Image(cb) {
  if (!design) {
    return;
  }

  (async function () {
    let images = await Promise.all(design.boards.map(function (board) {
      return domtoimage.toJpeg(board.bodyEl);
    }));

    cb(images);
  })();
}

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
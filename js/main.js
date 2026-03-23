var web_url = "";
var $body = window.opera ? document.compatMode == "CSS1Compat" ? $("html") : $("body") : $("html,body");
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbFiUInEdLs3dLDjeSQMug-8qXknbt1lDQgMO1-8jKrEbGs7YiExCScXlENtaiPg2AJYra7sDaUvFJ/pub?output=csv";


//Marquee
function Marquee(selector, speed) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;
  let marqueeInterval;

  parentSelector.insertAdjacentHTML('beforeend', clone);
  parentSelector.insertAdjacentHTML('beforeend', clone);

  function startMarquee() {
    marqueeInterval = setInterval(function () {
      firstElement.style.marginLeft = `-${i}px`;
      if (i > firstElement.clientWidth) {
        i = 0;
      }
      i = i + speed;
    }, 0);
  }

  function stopMarquee() {
    clearInterval(marqueeInterval);
  }

  parentSelector.addEventListener('mouseenter', stopMarquee);
  parentSelector.addEventListener('mouseleave', startMarquee);

  startMarquee();
}
$(function () {



  // loading
  Pace.on('done', function () {
    var $container = $("#progress");
    $container.addClass("dispear");
    $(".kv").addClass("active");
    initSpiralAnimation();
    Marquee('.marquee', 0.1);
  });

  //gallery swipe
  const silderArry = [];
  let mySwiper = null;

  async function getSheetData() {
    try {
      const response = await fetch(sheetUrl);
      const csvText = await response.text();

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      silderArry.length = 0;

      result.data.forEach((row, index) => {
        const displayIndex = index + 1;

        silderArry.push({
          name: (row.name || '').trim(),
          title: (row.title || '').trim(),
          intro: (row.introduction || '').trim(),
          image: `./images/keyman/keyman-${displayIndex}.jpg`
        });
      });
      //console.log(silderArry)
      renderSlides();
      initSwiper();

    } catch (error) {
      console.error('抓取失敗：', error);
    }
  }

  function renderSlides() {
    const container = document.querySelector('.mySwiper .swiper-wrapper');
    if (!container) {
      console.error('找不到 .mySwiper .swiper-wrapper');
      return;
    }

    const html = silderArry.map(item => {
      return `
      <div class="swiper-slide">
        <div class="keymen_photo">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="keymen_txt">
          <h3><span>${item.name}</span>${item.title}</h3>
          <p>${item.intro}</p>
        </div>
      </div>
    `;
    }).join('');

    container.innerHTML = html;
  }

  function initSwiper() {
    if (mySwiper) {
      mySwiper.destroy(true, true);
    }

    mySwiper = new Swiper('.mySwiper', {
      slidesPerView: 1.25,
      centeredSlides: true,
      loop: true,
      speed: 500,
      autoHeight: true,
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
      on: {
        init: function () {
          updateActiveClass(this);
        },
        slideChangeTransitionEnd: function () {
          updateActiveClass(this);
        }
      },
      breakpoints: {
        640: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 5,
        }
      },
    });
  }
  function updateActiveClass(swiper) {
    const slides = swiper.slides;

    slides.forEach(slide => {
      slide.classList.remove('is-active-slide');
    });

    const activeSlide = swiper.slides[swiper.activeIndex];
    if (activeSlide) {
      activeSlide.classList.add('is-active-slide');
    }
  }

  getSheetData();

  $(".hambuger").on("click", function (e) {
    $(this).addClass('active')
    $('.menu').addClass('active')
  });
  $(".close").on("click", function (e) {
    $('.menu').removeClass('active')
    $('.hambuger').removeClass('active')
  });

  //scroll to anchor
  $(".is-anchor").click(function () {
    var $target = $(this).attr("href");
    var $targetX = $($target).offset().top;
    $("body,html").animate({ scrollTop: $targetX }, 300);
    $('.menu').removeClass('active')
    $('.hambuger').removeClass('active')
    return false;

  });
  //foreword txt
  $(window).scroll(function () {
    $('.photo_left h2,.photo_left p').each(function () {
      if ($(this).isOnScreen(0, 0.01) == true) {
        $(this).addClass("is-show");
      } else {
        $(this).removeClass("is-show");
      }
    });
  });


  //foreword photo
  const SPIRAL_CONFIG = {
    photos: [
      './images/foreword/foreword-img-8.jpg',
      './images/foreword/foreword-img-7.jpg',
      './images/foreword/foreword-img-6.jpg',
      './images/foreword/foreword-img-5.jpg',
      './images/foreword/foreword-img-4.jpg',
      './images/foreword/foreword-img-3.jpg',
      './images/foreword/foreword-img-2.jpg',
      './images/foreword/foreword-img-1.jpg',
      './images/foreword/foreword-img-9.jpg',
      './images/foreword/foreword-img-10.jpg',
      './images/foreword/foreword-img-11.jpg',
      './images/foreword/foreword-img-12.jpg',
      './images/foreword/foreword-img-4.jpg',
      './images/foreword/foreword-img-3.jpg',
      './images/foreword/foreword-img-2.jpg',
    ],
    desktop: {
      count: 14,
      verticalStep: 120,
      radius: 350,
      speed: 280,
      opacityFront: 1.0,
      opacityBack: 0.35,
    },
    mobile: {
      count: 15,
      verticalStep: 70,
      radius: 200,
      speed: 200,
      opacityFront: 1.0,
      opacityBack: 0.2,
    },
  };

  SPIRAL_CONFIG.count = SPIRAL_CONFIG.photos.length;

  function initSpiralAnimation() {
    const carousel = document.getElementById('spiralCarousel');
    if (!carousel) return;

    const isMobile = window.innerWidth < 768;
    const cfg = isMobile ? SPIRAL_CONFIG.mobile : SPIRAL_CONFIG.desktop;

    document.documentElement.style.setProperty(
      '--spiral-anim-speed',
      `${cfg.speed}s`,
    );

    const totalHeight = cfg.count * cfg.verticalStep;
    const cards = [];

    for (let i = 0; i < cfg.count; i++) {
      const item = document.createElement('div');
      item.className = 'spiral-item';

      const photoUrl = SPIRAL_CONFIG.photos[i % SPIRAL_CONFIG.photos.length];
      item.innerHTML = `<img src="${photoUrl}" alt="Photo ${i + 1}">`;

      const initialAngle = (i / cfg.count) * 360;
      const delay = (i / cfg.count) * -cfg.speed;

      item.style.setProperty('--angle', `${initialAngle}deg`);
      item.style.setProperty('--radius', `${cfg.radius}px`);
      item.style.setProperty('--start-y', `${totalHeight / 2}px`);
      item.style.setProperty('--end-y', `${-totalHeight / 2}px`);
      item.style.animationDelay = `${delay}s`;

      carousel.appendChild(item);

      cards.push({
        element: item,
        img: item.querySelector('img'),
        index: i,
      });
    }

    function getRotateYFromMatrix(element) {
      const style = window.getComputedStyle(element);
      const matrix = style.transform;

      if (matrix === 'none' || !matrix) return 0;

      const values = matrix.match(/matrix3d\((.+)\)/);
      if (values) {
        const matrixValues = values[1].split(', ').map(parseFloat);
        const m11 = matrixValues[0];
        const m13 = matrixValues[2];
        const angleRad = Math.atan2(-m13, m11);
        let angleDeg = angleRad * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;
        return angleDeg;
      }

      return 0;
    }

    function getOpacityFromAngle(angle) {
      const normalized = ((angle % 360) + 360) % 360;
      const cosValue = Math.cos((normalized * Math.PI) / 180);
      const t = (1 - cosValue) / 2;
      return cfg.opacityFront + (cfg.opacityBack - cfg.opacityFront) * t;
    }

    function updateCardOpacities() {
      const isMobile = window.innerWidth < 768;

      function getTranslateY(element) {
        const style = window.getComputedStyle(element);
        const matrix = style.transform;

        if (!matrix || matrix === 'none') return 0;

        const values = matrix.match(/matrix3d\((.+)\)/);
        if (values) {
          return parseFloat(values[1].split(', ')[13]);
        }
        return 0;
      }

      const cardWithY = cards.map((card) => ({
        card,
        translateY: getTranslateY(card.element),
      }));

      if (isMobile) {
        const sorted = [...cardWithY].sort((a, b) => a.translateY - b.translateY);
        const visibleSet = new Set(sorted.slice(0, 9).map((c) => c.card));

        cards.forEach((card) => {
          card.element.style.visibility = visibleSet.has(card)
            ? 'visible'
            : 'hidden';
        });
      } else {
        cards.forEach((card) => {
          card.element.style.visibility = 'visible';
        });
      }

      cards.forEach((card) => {
        const actualAngle = getRotateYFromMatrix(card.element);
        const opacity = getOpacityFromAngle(actualAngle);
        card.img.style.opacity = opacity;
      });

      requestAnimationFrame(updateCardOpacities);
    }

    setTimeout(() => {
      updateCardOpacities();
    }, 100);
  }
});



$(function() {
	// Navigation
		$('.hamburger, .global-menu__item').on('click', function() {
			$(this).toggleClass('is-opened-navi');
			$('.global-menu').toggleClass('is-opened');
			$('.global-menu__item').toggleClass('is-opened');
		});

		$('.nav__link, .global-menu__item, .hero__btn').on('click', function() {
			$('.nav__link, .global-menu__item, .hero__btn').removeClass('is-scroll')
			$(this).toggleClass('is-scroll');
		});

		var smoothScroll = new SmoothScroll('.nav__link, .global-menu__item, .hero__btn', {
			offset: function() {
				var target = $('.is-scroll').attr('href');
				var top = parseInt($(target).css('padding-top'));
				return -top + 10;
			},
			speed: 800
		});

		$('.hero__btn').on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('data-target');
			var top = $(target).offset().top + parseInt($(target).css('padding-top'));
			$('html, body').animate({
				scrollTop: top - 10},
				1000)
		});

	// WOW
		new WOW().init();

	// Tilt
		$('[data-tilt]').tilt({
			reset: true,
			scale: 1.1
		})

	// MixItUp
		var mixerConfig = {
			animation: {
				enable: false
			},
			callbacks: {
				onMixEnd: function(state) {
					$('.works__video').height(Math.floor( +$('.works__video').width() / 1.775 ));
				}
			}
		};
		var mixer = mixitup('.works__videos', mixerConfig);
		$('.works__tab').on('click', function() {
			$('.works__tab').removeClass('is-active');
			$(this).addClass('is-active');
			$('.works__video iframe').each(function() {
				$(this)[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
			});
			$('.works__video iframe').css('opacity', '0');
			$('.works__video-overlay, .works__video-play').fadeIn();
		});

	// Works videos
		$('.works__video-overlay, .works__video-play').on('click', function() {
			$('.works__video iframe').each(function() {
				$(this)[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
			});
			$('.works__video iframe').css('opacity', '0');
			$('.works__video-overlay, .works__video-play').fadeIn();
			$(this).parent().find('.works__video-overlay, .works__video-play').fadeOut();
			$(this).parent().find('iframe').css('opacity', '1').each(function() {
				$(this)[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
			});
		});

		$('.works__video').height(Math.floor( +$('.works__video').width() / 1.775 ));
			window.addEventListener('resize', function () {
				$('.works__video').height(Math.floor( +$('.works__video').width() / 1.775 ));
			});

	// Blogers

		var siema = new Siema({
			selector: '.blogers',
			perPage: {
				0: 1,
				480: 2,
				767: 3,
				991: 4
			},
			easing: 'ease-out',
			multipleDrag: true
		});

		$('.blogers__prev').on('click', function() {
			siema.prev();
		});
		$('.blogers__next').on('click', function() {
			siema.next();
		});

	// Particles
		particlesJS.load('body', '../libs/particles/particlesjs-config.json', function() {
			console.log('config loaded');
		});
});
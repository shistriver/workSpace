/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'
    }
});

define(["jquery"],
	function($) {
		var
			toTop = function() {
				var speed = 300,
					win_h = $(window).height(); //窗口高度  不用等所有内容加载完毕后就可获得
				$(window).scroll(function(event) {
					var st = $(window).scrollTop();
					if (st > win_h) {
						$('#to_top').stop().animate({
							bottom: '66px',
							opacity: 1
						}, speed);
					} else {
						$('#to_top').stop().animate({
							bottom: 0,
							opacity: 0
						}, speed);
					}
				});

				$('#to_top').click(function(event) {
					$('html,body').stop().animate({
						scrollTop: 0
					}, speed);
				});
			};

		return {
			toTop: toTop
		};
	}
);
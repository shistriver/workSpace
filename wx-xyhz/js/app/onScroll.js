/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

difine([],
	function() {
		var
			getClientHeight = function(){
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					return (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
				} else {
					return (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
				}
			},

			// 取得当前页面显示所占用的高度  
			getPageHeight = function() {
				return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			},
			// 判断滚动条是否到达底部  
			reachBottom = function() {
				var scrollTop = 0;
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if (document.body) {
					scrollTop = document.body.scrollTop;
				}
				if ((scrollTop > 0) && (scrollTop + getClientHeight() == getPageHeight())) {
					return true;
				} else {
					return false;
				}
			},
			// 检测事件，检测滚动条是否接近或到达页面的底部区域，0.8是为了更接近底部时  
			isOnScroll = function () {
				var iTop = document.documentElement.scrollTop + document.body.scrollTop;
				return ((iTop + getClientHeight()) > parseInt(getPageHeight() * 0.8)) || reachBottom() ;
			};

		return {
			isOnScroll: isOnScroll
		};
	}
);
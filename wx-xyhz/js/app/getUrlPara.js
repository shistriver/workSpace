/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

define([],
	function() {
		var
			getUrlPara = function(sParam) {
				var sPageURL = decodeURIComponent(window.location.search.substring(1)),
					sURLVariables = sPageURL.split('&'),
					sParameterName,
					i;
				for (i = 0; i < sURLVariables.length; i++) {
					sParameterName = sURLVariables[i].split('=');
					if (sParameterName[0] === sParam) {
						return sParameterName[1] === undefined ? true : sParameterName[1];
					}
				}
			};

		return {
			getUrlPara: getUrlPara
		};
	}
);
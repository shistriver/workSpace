/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        'getUrlPara' : 'getUrlPara'
    }
});
difine(["jquery","getUrlPara"],
	function($,getUrlPara) {
		var
			xzLog = function () { //下载日志
				var h = window.location.href;
				var str = 'functon_id:download_function_name:' + h;
				$.get('http://app.xinyihezi.com:8888/promote/?serv_type=6&function_info=' + str, function(data) {});
			},

			toDownload = function() {
				if (getUrlPara.getUrlPara('show_invite') == '1') {
					$('#downloadBox').show();
				} else {
					$('#downloadBox').remove();
				}
				$('#downloadBox').on('click', '.open', function(event) {
					xzLog();
					location.href = 'http://app.xinyihezi.com:8881/download/html/index.html';
				});
				$('#downloadBox').on('click', '.close', function(event) {
					$('#downloadBox').remove();
				});
			};

		(function() { //访问日志
			var h = window.location.href;
			var str = 'functon_id:visite_function_name:' + h;
			$.get('http://app.xinyihezi.com:8888/promote/?serv_type=6&function_info=' + str, function(data) {});
		})();

		return {
			toDownload: toDownload
		};
	}
);


/**
 * Created by guixin on 2016/3/29.
 */
//页面消息显示
require.config({
	paths: {
		'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
		'dataService': 'dataService'
	}
});

define(['jquery', 'dataService'],
	function($, dataService) {
		var
			beforeSend = function(){
				$('#loader').show();
			},

			showMessage = function(id) {
				dataservice.getData(id, function(ret) {
					$("#messagebox").html(ret);
				});
			};

		return {
			getData: getData
		};
	}
);
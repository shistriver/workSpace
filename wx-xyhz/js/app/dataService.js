/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        'config' : 'config'
    }
});
define(['jquery','config'],
	function($,config) {
		var
            callApi = function (url, type, beforeSend, callback) {
                $.ajax({
                    url: url,
                    type: type,
                    dataType: 'json',
                    beforeSend: beforeSend,
                    success: function (data) {
                        return callback(data);
                    }
                });
            },

            getData = function (id, beforeSend, callback) {
                url = config.baseUrl + id;
                return callApi(url, 'GET', beforeSend, callback);
            },

            postData = function (id, beforeSend, callback) {
                url = config.baseUrl + id;
                return callApi(url, 'post', beforeSend, callback);
            };

        return {
            getData: getData,
            postData: postData
        };
	}
);


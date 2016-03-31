/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务

define(['jquery', 'config'],
    function($, config) {
        var
            callApi = function(url, type, beforeSend, callback) {
                $.ajax({
                    url: url,
                    type: type,
                    dataType: 'json',
                    beforeSend: beforeSend,
                    success: function(data) {
                        callback(data);
                    }
                });
            },

            getData = function(id, beforeSend, callback) {
                url = config.baseUrl + id;
                callApi(url, 'GET', beforeSend, callback);
            },

            postData = function(id, beforeSend, callback) {
                url = config.baseUrl + id;
                callApi(url, 'post', beforeSend, callback);
            };

        return {
            getData: getData,
            postData: postData
        };
    }
);
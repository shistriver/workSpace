/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务

define(['jquery', 'config'],
    function($, config) {
        var
            callApi = function(url, type, beforeSend, callback, data) {
                console.log(data, callback);
                type = type || 'GET';
                data = data || null;
                $.ajax({
                    url: url,
                    type: type,
                    dataType: 'json',
                    data: data,
                    beforeSend: beforeSend,
                    success: function(ret) {
                        callback(ret);
                    }
                });
            },

            getData = function(id, beforeSend, callback, data) {
               // url = config.baseUrl + id;
               url = id;
                callApi(url, 'GET', beforeSend, callback, data);
            },

            postData = function(id, beforeSend, callback, data) {
                //url = config.baseUrl + id;
                url = id;
                callApi(url, 'post', beforeSend, callback, data);
            };

        return {
            getData: getData,
            postData: postData
        };
    }
);
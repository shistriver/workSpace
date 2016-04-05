/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

define([],
      function() {
            var
                  baseUrl = 'http://app.xinyihezi.com:8888/',
                  label_count = 0,
                  loadFlag = true,
                  pageIndex = 1, // 当前页数，默认设为第 1 页 
                  pageSize = 10, // 每页显示的数量
                  timestamp = function(str){
                      var str = parseInt(str) * 1000;
                      var date = new Date(str);
                      var Y = date.getFullYear() + '-';
                      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                      var D = date.getDate() + ' ';
                      var h = date.getHours() + ':';
                      var m = date.getMinutes() + ':';
                      var s = date.getSeconds();
                      var time = Y+M+D+h+m+s;
                      return time;
                  };
            return {
                  baseUrl: baseUrl,
                  label_count: label_count,
                  loadFlag: loadFlag,
                  pageIndex: pageIndex,
                  pageSize: pageSize,
                timestamp:timestamp
            };
      }
);
/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

define(['jquery','jquery.cookie'],
    function ($) {
        var
            addCoo = function(key) {
                var history,
                    json = "[",
                    json1,
                    canAdd = true;
                if (!$.cookie("history")) {
                    history = $.cookie("history", "{name:\"" + key + "\"}", {
                        expires: 1
                    })
                } else {
                    history = $.cookie("history");
                    console.log("222" + history);
                    json1 = eval("(" + history + ")");
                    console.log("json1:" + json1);
                    $(json1).each(function() {
                        if (this.name == key) {
                            canAdd = false;
                            return false
                        }
                    });
                    if (canAdd) {
                        $(json1).each(function() {
                            json = json + "{\"name\":\"" + this.name + "\"},"
                        });
                        json = json + "{\"name\":\"" + key + "\"}]";
                        $.cookie("history", json, {
                            expires: 1
                        })
                    }
                }
            },

            getCoo = function() {
                if ($.cookie("history")) {
                    var json = eval("(" + $.cookie("history") + ")"),
                        list = [];
                    $(json).each(function() {
                        list.push(this.name)
                    });
                    return list
                } else {
                    return []
                }
            },

            clearCoo = function() {
                $.cookie("history", null)
            }
        return {
            clearCoo: clearCoo, //清空cookie
            addCoo: addCoo, //添加
            getCoo: getCoo //获取
        };
    }
);



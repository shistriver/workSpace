/**
 * Created by xinyi on 2016/3/22.
 */
//cookie操作
var objCoo = {
        clearCoo: clearCoo,//清空cookie
        addCoo: addCoo,//添加
        getCoo: getCoo//获取
    };
    console.log(objCoo.getCoo());

    function addCoo(key) {
        var history;
        var json = "[";
        var json1;
        var canAdd = true;
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
    }

    function getCoo() {
        if ($.cookie("history")) {
            var json = eval("(" + $.cookie("history") + ")");
            var list = [];
            $(json).each(function() {
                list.push(this.name)
            });
            return list
        } else {
            return []
        }
    }

    function clearCoo() {
        $.cookie("history", null)
    }

//返回顶部
$(function() {
    (function() { //返回顶部
    var speed = 300;
    var win_h = $(window).height(); //窗口高度  不用等所有内容加载完毕后就可获得
    $(window).scroll(function(event) {
        var st = $(window).scrollTop();
        if (st > win_h) {
            $('#to_top').stop().animate({
                bottom: '66px',
                opacity:1
            }, speed);
        } else {
            $('#to_top').stop().animate({
                bottom: 0,
                opacity:0
            }, speed);
        }
    });
    $('#to_top').click(function(event) {
        $('html,body').stop().animate({
            scrollTop: 0
        }, speed);
    });
})();
});
$(function(){
    //下载按钮点击事件
    if(getUrlParameter('show_invite')=='1'){
        $('#downloadBox').show();
    }else{
        $('#downloadBox').remove();
    }
    console.log(getUrlParameter('show_invite')=='1');
    $('#downloadBox').on('click', '.open', function(event) {
        xzLog();
        location.href='http://app.xinyihezi.com:8881/download/html/index.html';
    });
    $('#downloadBox').on('click', '.close', function(event) {
        $('#downloadBox').remove();
    });
    function xzLog(){//下载日志
        var h=window.location.href;
        var str='functon_id:download_function_name:'+h;
        $.get('http://app.xinyihezi.com:8888/promote/?serv_type=6&function_info='+str, function(data) {
        });
    }
    (function(){//访问日志
        var h=window.location.href;
        var str='functon_id:visite_function_name:'+h;
        $.get('http://app.xinyihezi.com:8888/promote/?serv_type=6&function_info='+str, function(data) {
        });
    })();
});


//获取链接中src_key字段的值
function getUrlParameter(sParam) {
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
}


/**
 * Created by xinyi on 2016/3/22.
 */



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


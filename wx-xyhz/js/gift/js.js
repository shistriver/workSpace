/* 
 * @Author: xin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-03-22 17:51:50
 */

//'use strict';

$(function() {
    var postUrl = "http://app.xinyihezi.com:8888/bonus/?";
    //定义浏览器类型
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    //判断从哪里进入此页面
    var h = getUrlParameter("show_invite");
    if(h=='1'){
        $('#download').show(); 
    }
   var wel_id=getUrlParameter("wel_id");
    //获取页面参数
    var 
        rest_start_time=[],
        rest_end_time=[],
        store=[];

    $.ajax({ 
        url: 'http://app.xinyihezi.com:8888/activity/?search_type=8&wel_id='+wel_id, 
        type: 'GET',
        dataType: 'json',
        timeout: 6000,
        cache: false,
        success: function(tt){
            //document.title=tt.data.welfare[0].title;
            //////////////////////////////////////////////
            //需要jQuery
            var $body = $('body');
            document.title = tt.data.welfare[0].title;
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="http://7xlen1.com2.z0.glb.qiniucdn.com/favicon.ico"></iframe>');
            $iframe.on('load',function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
            //////////////////////////////////////////////
            $('.top_bg img').attr('src', tt.data.welfare[0].header_url);
            try { // no bonus_url
              $('.content .bonus img').attr('src', tt.data.bonus_url[0]);
              $('div.bonus, div.rec').show();
              if(h=='1'){
                $('.lingqu').show();
              }else{
                $('.get').show();
              }
            } catch(e) {
            }
            try { // no goods
            for(var i=1;i<tt.data.goods.length;i++){
                $('.ui-con .item:eq(0)').clone().appendTo('.ui-con .item-box');
            }
            for(var i=0;i<tt.data.goods.length;i++){
                 
            $('.ui-con .item:eq(' + i + ') .layer').css('backgroundImage', 'url(' + tt.data.goods[i].image_url + ')');
            $('.ui-con .item:eq(' + i + ') .goods-name').html(tt.data.goods[i].short_name);
            $('.ui-con .item:eq(' + i + ') .goods_id').html(tt.data.goods[i].goods_id);
            try{
                $('.ui-con .item:eq(' + i + ') .special_txt span').html(tt.data.goods[i].special_price_text);
            }catch(e){
                $('.ui-con .item:eq(' + i + ') .special_txt').remove();
            }
            
            $('.ui-con .item:eq(' + i + ') .price .nowPrice').html(tt.data.goods[i].p_price);
            
            $('.ui-con .item:eq(' + i + ') .lth del').html(tt.data.goods[i].price);
            rest_start_time[i]=parseInt(tt.data.goods[i].rest_start_time);
            rest_end_time[i]=parseInt(tt.data.goods[i].rest_end_time);
            store[i]=tt.data.goods[i].store;
            //rest_end_time[0]=21324;
            //alert(rest_end_time>0);
            
            $('.ui-con').delegate('.item:eq('+i+')', 'click', function(event) {
                     var h = window.location.href;
                    if (h.indexOf('show_invite=1') > 0 || h.indexOf('from_type') > 0){
                        location.href='http://app.xinyihezi.com:8881/download/html/index.html';
                    }else{
                        var goodsid = $(this).find('.goods_id').html();
                        if (browser.versions.ios == true) {
                            toProductDetail(goodsid);
                        } else {
                            window.android_interface.navProductDetail(goodsid);
                        }
                    }
                });
            }
            $('.ui-con').show();
            } catch (e) {
               $('.ui-con').remove();
            }

            //分类
            if (tt.data.search_key_list.length < 2) {// 分类数量 < 2 隐藏浮动分类
                //$('.chosed_area').hide();
            }
            for (var i = 0; i < tt.data.search_key_list.length; i++) {
                $('.chosed_area').after('<ul class="ui-fall ui-clearfix"></ul>');
                $('.chosed_wrap').append('<span><i>'+tt.data.search_key_list[i].name+'</i></span>')
            }
            $('ul.ui-fall:eq(0)').addClass('cur_ul');
            $('.chosed_wrap span:eq(0)').addClass('cur');
            
            for(var i=0;i<tt.data.search_key_list.length;i++){
                var welfare_id = tt.data.search_key_list[i].welfare_id;
                var search_key = tt.data.search_key_list[i].search_key;
                list_url='http://app.xinyihezi.com:8888/good/?search_type=13&wel_cat_id='+welfare_id+'&goods_search_code='+search_key;
                pagingList(list_url,'ui_fall',i);//分页展示商品列表
            }
            var span_width=(100/(tt.data.search_key_list.length))+'%';
            $('.chosed_wrap span').css('width', span_width);
            //分类end
           
            
        } 
    });
    setInterval(changeStyle, 1000);

    function changeStyle() {
        // alert(rest_end_time[0]);
        for (var i = 0; i < $('.ui-con .item').length; i++) {
            if (store[i] == '0') {
                $('.ui-con .item:eq(' + i + ') .ui-btn-main')
                    .html('抢光了')
                    .addClass('con-guang');
                $('.ui-con .item:eq(' + i + ') .layer .time').remove();

            } else if (rest_start_time[i] > 0) {
                $('.ui-con .item:eq(' + i + ') .ui-btn-main')
                    .html('即将开始')
                    .addClass('con-comming');
                //setInterval(function(){
                $('.ui-con .item:eq(' + i + ') .layer .time').html('距开始:' + formatSeconds(rest_start_time[i]));
                rest_start_time[i]--;
                // }, 1000);
            } else if (rest_end_time[i] > 0) {
                //alert( $('.ui-con .item:eq(' + i + ') .layer .time').html());
                $('.ui-con .item:eq(' + i + ') .ui-btn-main')
                    .html('立即抢购');
                // setInterval(function(){
                $('.ui-con .item:eq(' + i + ') .layer .time').html('距结束:' + formatSeconds(rest_end_time[i]));
                rest_end_time[i]--;
                //}, 1000);
            }
        }
    }
   
    function formatSeconds(value) {
        var theTime = parseInt(value); // 秒 
        var theTime1 = 0; // 分 
        var theTime2 = 0; // 小时 
        // alert(theTime); 
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            // alert(theTime1+"-"+theTime); 
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime);
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + ":" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + ":" + result;
        }
        if(theTime2>=24){
            result=parseInt((theTime2/24))+1+'天'
        }
        return result;
    }
         
    //下载按钮点击事件
    if(getUrlParameter('show_invite')=='1'){
        $('#download').show();
    }else{
        $('#download').remove();
    }
    $('#download').on('click', '.open', function(event) {
        xzLog();
       location.href='http://app.xinyihezi.com:8881/download/html/index.html';
    });
    $('#download').on('click', '.close', function(event) {
       $(this).parent('#download').remove();
       $('.content').css('marginBottom', '0px');
       $('#to_top').css('bottom', '10px');
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
    $('#to_search').click(function(event) {
       location.href='search.html';
    });


});


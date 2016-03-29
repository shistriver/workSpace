/* 
 * @Author: xin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-03-25 17:51:03
 */

function pagingList(get_url, style,flag) { //载入商品列表
    var iHeight = 0;
    var iTop = 0;
    var clientHeight = 0;
    var iIntervalId = null;
    var itemOffset = 0;
    var page = 1; // 当前页数，默认设为第 1 页  
    var page_size = 10; // 每页显示的数量
    var data_len = 0;
    getPageHeight();
    loadData(get_url);
    // 添加定时检测事件，每2秒检测一次  
    iIntervalId = setInterval(_onScroll, 1000);
    // 取得当前页面显示所占用的高度  
    function getPageHeight() {
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
            clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }

        iHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    function loadData(url) {
        $.ajax({
            url: url + '&page_size=' + page_size + '&page=' + page,
            type: 'GET',
            dataType: 'json',
            timeout: 6000,
            beforeSend: showLoadingImg,
            success: showListData, //成功执行方法    
            complete:function(){
                $('.ui-fall li').on('click', function(event) {
                    var goodsid = $(this).attr('data-goodsid');
                    location.href = 'http://app.xinyihezi.com:8881/index.html#/goods/' + goodsid;
                });
            }  
        });
        page++;
    }

    function showListData(li) {
        //document.title=flag;
        data_len = ''; //列表总长度
        try{
            var liLen = li.data.length;
            if (liLen < page_size) {
                $('#loader').hide();
                clearInterval(iIntervalId);
                get_url = '';
            }
        }catch(e){
                $('#loader').hide();
                clearInterval(iIntervalId);
                get_url = '';
        }
        
        if (style == 'ui_fall') {
            var nextpagehtml='';
            for (var i = 0; i < li.data.length; i++) {
                var price = parseFloat(li.data[i].p_price).toFixed(2);
                nextpagehtml += '<li class="item" data-goodsid="'+li.data[i].goods_id+'">';
                nextpagehtml += '<div class="img-c" style="background-image: url(' + li.data[i].image_url + ')">';
                nextpagehtml += li.data[i].logo_image == '' ? '' : '<img class="bq-icon" src="'+li.data[i].logo_image+'" alt="">';
                nextpagehtml += li.data[i].store == '0' ? '<span class="guang">卖光了</span>' : '';
                nextpagehtml += '</div>';
                nextpagehtml += '<div class="info-c">';
                nextpagehtml += '<h3>' + li.data[i].short_name + '</h3>';
                nextpagehtml += '<span class="price">¥<strong>' + price + '</strong></span>';
                nextpagehtml += '<span class="love">' + li.data[i].like_count + '</span>';
                nextpagehtml += '</div></li>';
            }
            $('.ui-fall:eq('+flag+')').html($('.ui-fall:eq('+flag+')').html() + nextpagehtml);
        } else if (style == 'ui_con') {}
    }

    function showLoadingImg() {
        $('#loader').show();
    }
    // 判断滚动条是否到达底部  
    function reachBottom() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        if ((scrollTop > 0) && (scrollTop + clientHeight == iHeight)) {
            return true;
        } else {
            return false;
        }
    }

    // 检测事件，检测滚动条是否接近或到达页面的底部区域，0.99是为了更接近底部时  
    function _onScroll() {
        iTop = document.documentElement.scrollTop + document.body.scrollTop;
        getPageHeight();
        if (((iTop + clientHeight) > parseInt(iHeight * 0.8)) || reachBottom()) {
            loadData(get_url);
        }
    }
    //return data_len;
}

     
///////////////////【所有公用方法 E】/////////////////////////////////////////////

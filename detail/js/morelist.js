/* 
 * @Author: guixin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2015-11-25 11:58:43
 */
//'use strict';
$(function() {
    //////////////////////////【页面初始化 开始】//////////////////////////////////////////////
    function finLoadMoreList() {
        var labelid = $('#labelid').html();
        var setIn = setInterval(getLabelId, 100);

        function getLabelId() {
            if (labelid) {
                loadMoreList(labelid);
                clearInterval(setIn);
                return;
            }
            labelid = $('#labelid').html();
        }

        function loadMoreList(labelid) {
            //定义浏览器类型
            var page_size = 5;
            var page = 1;
            var get_list_url = 'http://test.xinyihezi.com:8888/good/?label=' + labelid + '&page_size=' + page_size + '&page=' + page;
            //alert(get_list_url);
            showComplexList(get_list_url);
            //showComplexList('http://test.xinyihezi.com:8888/good/?label=311&page_size=5&page=1'); 
            function showComplexList(get_list_url) {
                $.ajax({
                    url: get_list_url,
                    type: 'GET',
                    dataType: 'json',
                    timeout: 6000,
                    cache: false,
                    success: function(li) {
                        if($('#ui-fall li').length>0){
                            $('#ui-fall').html('');
                        }
                        for (var i = 1; i < page_size; i++) {
                            try {
                                var price = parseFloat(li.data[i].p_price).toFixed(2);
                                var nextpagehtml = '<li class="item"><div class="img-c ui-box"><a data-goodsid="' + li.data[i].goods_id;
                                nextpagehtml += '" style="background-image: url(' + li.data[i].image_url + ')"></a>';
                                nextpagehtml += '<span class="guang"><div class="wp"><div>送光了！</div></div></span></div><div class="info-c">';
                                nextpagehtml += '<h3>' + li.data[i].short_name + '</h3>';
                                nextpagehtml += '<span class="price">¥<strong>' + price + '</strong></span>';
                                nextpagehtml += '<span class="love">' + li.data[i].like_count + '</span></div></li>';
                                $('.items-box').html($('.items-box').html() + nextpagehtml);
                                var g = li.data[i].store;
                                //g=0;
                                if (g == 0) {
                                    $('#ui-fall li:eq(' + (i - 1) + ') .guang ').show();
                                } else {
                                    $('#ui-fall li:eq(' + (i - 1) + ') .guang').remove();
                                }
                            } catch (e) {

                            }

                        }

                    }, //成功执行方法    
                    error: function(li) {
                        // $('#more').remove();
                    }
                });
            }
        }
    };
 
    finLoadMoreList();
    $('ul.ui-fall').delegate('li', 'click', function(event) {
      var goods_detail_url = 'http://test.xinyihezi.com:8888/good/?goodid='+$(this).find('a').attr('data-goodsid'); 
      var url_url='http://test.xinyihezi.com:8881/test-html/detail/html/index.html#/goods/'+$(this).find('a').attr('data-goodsid'); 
       window.location.replace(url_url);
      loadDetailData(goods_detail_url);
      finLoadMoreList();
      $('html,body').scrollTop(0);
    });
});
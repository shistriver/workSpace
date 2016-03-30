/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'
    }
});
difine(['jquery'],
    function($) {
        var
            showGoodsListData = function(li) {
                if (li.status == '0') {
                    if (li.data == null || li.data.length == 0) {
                        $('.no-data').show();
                        $('#loader').hide();
                        $('.ui-fall').html('').hide();
                        return false;
                    } else if (li.data.length < page_size) {
                        $('#loader').hide();
                        return false;
                    }

                    var nextpagehtml = '';
                    for (var i = 0; i < li.data.length; i++) {
                        var price = parseFloat(li.data[i].p_price).toFixed(2);
                        nextpagehtml += '<li class="item" data-goodsid="' + li.data[i].goods_id + '">';
                        nextpagehtml += '<div class="img-c" style="background-image: url(' + li.data[i].image_url + ')">';
                        nextpagehtml += li.data[i].logo_image == '' ? '' : '<img class="bq-icon" src="' + li.data[i].logo_image + '" alt="">';
                        nextpagehtml += li.data[i].store == '0' ? '<span class="guang">卖光了</span>' : '';
                        nextpagehtml += '</div>';
                        nextpagehtml += '<div class="info-c">';
                        nextpagehtml += '<h3>' + li.data[i].short_name + '</h3>';
                        nextpagehtml += '<span class="price">¥<strong>' + price + '</strong></span>';
                        nextpagehtml += '<span class="love">' + li.data[i].like_count + '</span>';
                        nextpagehtml += '</div></li>';
                    }
                    $('.ui-fall').html($('.ui-fall').html() + nextpagehtml);
                    return true;
                } else {
                    $('.no-data').show();
                    $('#loader').hide();
                    $('.ui-fall').html('').hide();
                    return false;
                }
            };

        return {
            showGoodsListData: showGoodsListData
        };
    }
);
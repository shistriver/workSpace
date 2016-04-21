/**
 * Created by xyhz on 2016/3/28.
 */
/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作
(function() {
    require.config({
        paths: {
            'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min',
            'doDom': 'app/doDom',
            'jquery.cookie': 'lib/jquery.cookie',
            'config': 'app/config',
            'cookieCrud': 'app/cookieCrud',
            'beforeSend': 'app/beforeSend',
            'callback': 'app/callback',
            'dataService': 'app/dataService',
            'paging': 'app/paging',
            'onScroll': 'app/onScroll',
            'limitChar': 'app/limitChar',
            'checkedBtn': 'app/checkedBtn',
            'goodsModify': 'app/goodsModify',
            'getUrlPara': 'app/getUrlPara',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'wxShare': 'app/wxShare'
        }
    });

    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara', 'limitChar', 'wxShare'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara, limitChar, wxShare) {
            wxShare.wxShare(false); //不可分享
            var
                goodsId = getUrlPara.getUrlPara('goodsId'),
                urlId = config.baseUrlCpp + '/good/?goodid=' + goodsId,
                addrUrl = config.baseUrlPython + '/wallet/h5/order/address?';
            //cookieCrud.add('edeb9886b1df444dbe700077798ad063');
            if (!cookieCrud.checkCoo()) { //如果未登录
                var url = location.protocol + '//' + location.host + location.port + location.pathname;
                if (config.getUrlPara('jumpLogin')) {} else {
                    location.href = config.baseUrl + '/wallet/h5/login' + location.search + '&url=' + url + '&jumpLogin=1';
                }
            }
            
            if (config.getUrlPara('order_type') == '0') { //送礼订单，不显示地址、购买形式和留言
                $('.giving-no').hide();
            } else {
                dataService.postData(addrUrl, beforeSend.showLoadImg, callback.showDefaultAddr, null); //请求地址 
                //限制数字
                limitChar.limit('#order_area', false, '', 100);
            }
            dataService.getData(urlId, beforeSend.showKeyListLoading, callback.showOrderConfirmData, null); //请求商品 
        }
    );
})();
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
            'data': 'app/data',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'wxShare': 'app/wxShare'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara', 'data', 'wxShare'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara, data, wxShare) {
            wxShare.wxShare(false);//不可分享
            var
                postData = {
                    gift_type: config.getUrlPara('gift_type'),//0收礼 1送礼  2凑份子
                    single_order: 1,
                    order_id: config.getUrlPara('order_id')
                },
                url = config.baseUrlPython + '/wallet/h5/order/search?';

            dataService.postData(url, beforeSend.showKeyListLoading, callback.showOrderDetail, postData);
        }
    );
})();
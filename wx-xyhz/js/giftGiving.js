/**
 * Created by xyhz on 2016/4/5.
 */
(function(){
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
            'tabNav': 'app/tabNav',
            'sentenceChange': 'app/sentenceChange',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'wxShare': 'app/wxShare'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'paging', 'config', 'getUrlPara', 'tabNav', 'checkedBtn', 'limitChar', 'sentenceChange'],
        function($, cookieCrud, beforeSend, callback, dataService, paging, config, getUrlPara, tabNav, checkedBtn, limitChar, sentenceChange) {
            checkedBtn.tabCheck();
            limitChar.limit('#txt_area',true,null,70);
            sentenceChange.sentence();

            var
                postData = {
                    gift_type: config.getUrlPara('gift_type'),
                    single_order: 1,
                    order_id: config.getUrlPara('order_id')
                },
                urlId = config.baseUrlPython + '/wallet/h5/order/search?';

            dataService.postData(urlId, beforeSend.showKeyListLoading, callback.showGiftGiving, postData);
        }
    );
})();
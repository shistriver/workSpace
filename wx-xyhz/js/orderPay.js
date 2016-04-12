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
            'paging': 'app/paging',
            'tabSwitch': 'app/tabSwitch',
            'cookieCrud': 'app/cookieCrud',
            'beforeSend': 'app/beforeSend',
            'callback': 'app/callback',
            'dataService': 'app/dataService',
            'onScroll': 'app/onScroll',
            'checkedBtn': 'app/checkedBtn',
            'goodsModify': 'app/goodsModify',
            'getUrlPara': 'app/getUrlPara',
            'payModal': 'app/payModal',
            'sha1': 'http://www.xinyihezi.com/wallet/static/js/sha1',
            'jquery.md5': 'http://www.xinyihezi.com/wallet/static/js/jquery.md5',
            'pay': 'http://www.xinyihezi.com/wallet/static/js/pay'
        },
        skim: {

        }
    });

    require(['jquery','cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'tabSwitch', 'getUrlPara'],
        function($, cookieCrud, beforeSend, callback, dataService, config, tabSwitch, getUrlPara) {
            tabSwitch.tabBar('#payment .item-list');
            var
                postData = {
                },
                urlId = config.baseUrlPython + '/wallet/h5/order/request?';

            dataService.postData(urlId, beforeSend.showKeyListLoading, callback.showPay, postData);

            $('#total_price .money').text('¥'+getUrlPara.getUrlPara('final_amount'));
        }
    );
})();
/**
 * Created by xyhz on 2016/3/28.
 */
/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作
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
            'tabSwitch': 'app/tabSwitch'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara','tabSwitch','limitChar'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara,tabSwitch,limitChar) {
            var 
                goodsId=getUrlPara.getUrlPara('goodsId'),
                urlId = config.baseUrlCpp + '/good/?goodid='+goodsId,
                addrUrl = config.baseUrlPython + '/wallet/h5/order/address?';
            cookieCrud.add('edeb9886b1df444dbe700077798ad063');
            dataService.postData(addrUrl, beforeSend.showKeyListLoading, callback.showDefaultAddr, null);   
            dataService.getData(urlId, beforeSend.showKeyListLoading, callback.showOrderConfirmData, null);
            //购买形式
            tabSwitch.tabBar('#payStyle .item-list');
            //限制数字
            limitChar.limit('#order_area',false,'',100);

        }
    );
})();

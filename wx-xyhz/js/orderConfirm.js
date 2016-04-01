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
            'getUrlPara': 'app/getUrlPara'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara) {
            var 
                
                goodsId=getUrlPara.getUrlPara('goodsId'),
                urlId = 'good/?goodid='+goodsId;
            //console.log(productId+'|||'+productNum+'|||||'+goodsId);
            dataService.getData(urlId, beforeSend.showKeyListLoading, callback.showOrderConfirmData)

        }
    );
})();

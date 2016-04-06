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
            'payModal': 'app/payModal',
            'tabSwitch': 'app/tabSwitch'
        }
    });
    require(['jquery','cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'tabSwitch', 'getUrlPara'],
        function($, cookieCrud, beforeSend, callback, dataService, config, tabSwitch, getUrlPara) {
            tabSwitch.tabBar('#payment .item-list');
            var
                postData = {
                    'address_id': getUrlPara.getUrlPara('address_id'),
                    'customer_memo': getUrlPara.getUrlPara('customer_memo'),
                    'good_spec': getUrlPara.getUrlPara('good_spec'),
                    'order_type': getUrlPara.getUrlPara('order_type'), //生成订单类型--0：送礼订单， 1：凑份子 2： 自买
                    'product_id': getUrlPara.getUrlPara('product_id'), //货品id
                    'quantity': getUrlPara.getUrlPara('quantity'), //购买数量
                    'source': getUrlPara.getUrlPara('source'), //购买来源-- 写死为3即可
                    'total_price': getUrlPara.getUrlPara('total_price') // 前段验证的商品总额--这部分写错也没关系，因为后端会自己算价钱--但是字段必须有
                },
                urlId = 'http://test.xinyihezi.com/wallet/h5/order/request?';

            dataService.postData(urlId, beforeSend.showKeyListLoading, callback.showPay, postData);
            $('#total_price .money').text('¥'+postData.total_price); 
        }
    );
})();
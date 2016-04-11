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
            'tabNav': 'app/tabNav'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara', 'tabNav'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara, tabNav) {
            var 
                url = config.baseUrlPython + '/wallet/h5/order/search?',
                postData = {
                    gift_type: 0, //0：查询收礼订单 1： 查询送礼订单 2：查询凑份子订单
                    order_status_type:5//表示查询订单的状态，比如说查待接收的订单5表示查全部，这次写死为5就ok
                };

                $('.chosed_wrap span').click(function() {
                    var 
                        index = $(this).index(),
                        $curClass = $(this);

                        if(index == 0){
                            postData.gift_type = 1;
                        }else if(index ==1){
                            postData.gift_type = 0;
                        }else{
                            postData.gift_type = 2;
                        }
                    config.gift_type = postData.gift_type;//全局变量，供回调函数判断用    
                    tabNav.tab_nav(index, $curClass, '.order-list');//导航切换
                    
                    dataService.postData(url, beforeSend.showKeyListLoading, callback.showMyGift, postData);
                });

        }
    );
})();

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
            'sha1': 'lib/sha1',
            'jquery.md5': 'http://www.xinyihezi.com/static/js/jquery.md5',
            'pay': 'http://www.xinyihezi.com/static/js/pay',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'rpWxPay': 'app/rpWxPay'
        },
        skim: {
            //sha1: ['jquery'],
            rpWxPay: {
                deps: ['jquery', 'jquery.md5', 'sha1', 'pay', 'jweixin'],
                exports: ''
            }
        }
    });

    require(['jquery','cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'tabSwitch', 'getUrlPara', 'sha1', 'jquery.md5', 'pay', 'rpWxPay'],
        function($, cookieCrud, beforeSend, callback, dataService, config, tabSwitch, getUrlPara, sha1, md5, pay, rpWxPay) {
           $('#total_price .money').text('¥'+getUrlPara.getUrlPara('final_amount'));
            var
                paraData = {
                    order_id: config.getUrlPara('order_id'),
                    order_money: config.getUrlPara('final_amount'),
                    payment_fee: config.getUrlPara('final_amount'),
                    paySuccCallback: paySuccCallback,
                    payCancelCallback: payCancelCallback,
                    payFailCallback: payFailCallback
                };

            $('.zhifu-btn').click(function(event) {
                if (config.btnLock === 0) {
                    config.btnLock = 1;
                    $('.zhifu-btn').css('background', '#c9c9c9');
                    rpWxPay.rpWxPay(paraData.order_id, paraData.order_money, paraData.payment_fee, paraData.paySuccCallback, paraData.payCancelCallback, paraData.payFailCallback);
                }else{}
            });

            function paySuccCallback(res){
                setTimeout(function(){
                     config.btnLock = 0;
                 }, 500);
                $('#loadImg').fadeOut();
                $('.zhifu-btn').attr('style', '');
            }

            function payCancelCallback(){
                $('#loadImg').fadeOut();
                config.btnLock = 0;
                $('.zhifu-btn').attr('style', '');
                $('#statusTip').html('您取消了支付').fadeIn(500).delay(1000).fadeOut(500);
            }

            function payFailCallback(){
                $('#loadImg').fadeOut();
                config.btnLock = 0;
                $('.zhifu-btn').attr('style', '');
            }


            
        }
    );
})();
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
            'cookieCrud': 'app/cookieCrud',
            'beforeSend': 'app/beforeSend',
            'callback': 'app/callback',
            'dataService': 'app/dataService',
            'onScroll': 'app/onScroll',
            'checkedBtn': 'app/checkedBtn',
            'limitChar': 'app/limitChar',
            'goodsModify': 'app/goodsModify',
            'getUrlPara': 'app/getUrlPara',
            'payModal': 'app/payModal',
            'sha1': 'lib/sha1',
            'jquery.md5': 'http://www.xinyihezi.com/static/js/jquery.md5',
            'pay': 'http://www.xinyihezi.com/static/js/pay',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'rpWxPay': 'app/rpWxPay',
            'wxShare': 'app/wxShare'
        },
        skim: {
            //sha1: ['jquery'],
            rpWxPay: {
                deps: ['jquery', 'jquery.md5', 'sha1', 'pay', 'jweixin'],
                exports: ''
            }
        }
    });

    require(['jquery','cookieCrud', 'beforeSend', 'callback', 'dataService', 'config', 'getUrlPara', 'sha1', 'jquery.md5', 'pay', 'rpWxPay', 'wxShare'],
        function($, cookieCrud, beforeSend, callback, dataService, config, getUrlPara, sha1, md5, pay, rpWxPay, wxShare) {
            wxShare.wxShare(false);//不可分享
            var final_amount = Number(getUrlPara.getUrlPara('final_amount')).toFixed(2);
           $('#total_price .money').text('¥ '+final_amount);
            var
                paraData = {
                    order_id: config.getUrlPara('order_id'),
                    order_money: final_amount,
                    payment_fee: final_amount,
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
            function paySuccCallback(res){//支付成功 跳订单列表
                setTimeout(function(){
                     config.btnLock = 0;
                 }, 500);
                $('#loadImg').fadeOut();
                $('.zhifu-btn').attr('style', '');

                var gift_type = config.getUrlPara('gift_type'); //礼物类型：0收到，1送出，2凑份子
                if(gift_type == '1'){//送出的话，跳送礼页
                    location.href = 'giftGiving.html?order_id=' + paraData.order_id +'&gift_type=1&single_order=1';
                }else{//否则跳订单列表
                    location.href = 'myGift.html?gift_type=' + config.getUrlPara('gift_type'); /////////////
                }
                
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
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
            'tabNav': 'app/tabNav',
            'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
            'wxShare': 'app/wxShare'
        }
    });
    require(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'paging', 'config', 'getUrlPara', 'tabNav', 'wxShare'],
        function($, cookieCrud, beforeSend, callback, dataService, paging, config, getUrlPara, tabNav, wxShare) {
            config.requireLogin(); // 需要登陆
            wxShare.wxShare(false);//不可分享
            var 
                url = config.baseUrlPython + '/wallet/h5/order/search?',
                postData = {
                    gift_type: Number(config.getUrlPara('gift_type')) || 1, //0：查询收礼订单 1： 查询送礼订单 2：查询凑份子订单 [默认送礼订单]
                    order_status_type:5//表示查询订单的状态，比如说查待接收的订单5表示查全部，这次写死为5就ok
                };
                //根据url参数显示订单列表，默认显示送礼订单
                showCurOrderList(postData.gift_type);

                $('.chosed_wrap span').click(function() {
                    var 
                        navIndex = $(this).index();
                        if ($('.chosed_wrap span.cur').index() == navIndex) return;
                        
                        if(navIndex == 0){//
                            postData.gift_type = 1;
                        }else if(navIndex ==1){
                            postData.gift_type = 0;
                        }else{
                            postData.gift_type = 2;
                        }

                        showCurOrderList(postData.gift_type);                    
                });

                var orderObj = {
                        receive: function(ret){//收到
                            for (var i = 0; i < ret.data.length; i++) {
                                var
                                    iRet = {
                                        avatar: ret.data[i].avatar, //头像
                                        create_time: config.timestamp(ret.data[i].create_time), //订单生成时间
                                        final_amount: Number(ret.data[i].final_amount).toFixed(2), //订单价格
                                        goods_id: ret.data[i].goods_id, //商品id
                                        goods_spec: ret.data[i].goods_spec, //商品标签
                                        order_id: ret.data[i].order_id, //订单id
                                        order_message: ret.data[i].order_message,
                                        order_num: ret.data[i].order_num, //订单编号
                                        order_status: ret.data[i].order_status, //订单状态
                                        product_image_url: ret.data[i].product_image_url, //商品url
                                        product_name: ret.data[i].product_name, //货品名称
                                        quantity: ret.data[i].quantity, //购买数量
                                        show_index: ret.data[i].show_index, //是否显示价格
                                        status_message: ret.data[i].status_message, //订单状态文字
                                        from_user: ret.data[i].from_user //送礼订单这个字段表示送给谁
                                    },
                                    nexthtml = '<li data-gift_type="0" data-actual_payment="' + iRet.final_amount + '" data-order_id="' + iRet.order_id + '"><h2 class="status"><img src="' + iRet.avatar + '"alt=""><p>来自：' + iRet.from_user + '</p><span>' + iRet.status_message + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.final_amount + '</i><span>实付款：</span></p><div class="btn-box">' + config.orderStatus(iRet.order_status, config.gift_type) + '</div></li>';
                                
                                $('#receive').append(nexthtml);
                            }
                        },
                        send: function(ret){//送出
                            for (var i = 0; i < ret.data.length; i++) {
                                var
                                    iRet = {
                                        avatar: ret.data[i].avatar, //头像
                                        bonus_money: Number(ret.data[i].bonus_money).toFixed(2), //红包钱数
                                        create_time: config.timestamp(ret.data[i].create_time), //订单生成时间
                                        actual_payment: Number(ret.data[i].actual_payment).toFixed(2), //订单价格
                                        goods_id: ret.data[i].goods_id, //商品id
                                        goods_spec: ret.data[i].goods_spec, //商品标签
                                        order_id: ret.data[i].order_id, //订单id
                                        order_message: ret.data[i].order_message,
                                        order_num: ret.data[i].order_num, //订单编号
                                        order_status: ret.data[i].order_status, //订单状态
                                        product_image_url: ret.data[i].product_image_url, //商品url
                                        product_name: ret.data[i].product_name, //货品名称
                                        quantity: ret.data[i].quantity, //购买数量
                                        show_index: ret.data[i].show_index, //是否显示价格
                                        status_message: ret.data[i].status_message, //订单状态文字
                                        to_user: (ret.data[i].to_user || '未知的Ta') //送礼订单这个字段表示送给谁
                                    },
                                    nexthtml = '<li data-gift_type="1" data-actual_payment="' + iRet.actual_payment + '" data-order_id="' + iRet.order_id + '"><h2 class="status"><img src="' + iRet.avatar + '"alt=""><p>送给：' + iRet.to_user + '</p><span>' + iRet.status_message + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.actual_payment + '</i><span>实付款：</span></p><div class="btn-box">' + config.orderStatus(iRet.order_status, config.gift_type) + '</div></li>';
                                    
                                $('#sendOut').append(nexthtml);
                            }
                        },
                        coufenzi: function(ret){//凑份子
                            for (var i = 0; i < ret.data.length; i++) {
                                var
                                    iRet = {
                                        avatar: ret.data[i].avatar, //头像
                                        bonus_money: Number(ret.data[i].bonus_money).toFixed(2), //红包钱数
                                        create_time: config.timestamp(ret.data[i].create_time), //订单生成时间
                                        final_amount: Number(ret.data[i].final_amount).toFixed(2), //订单价格
                                        goods_id: ret.data[i].goods_id, //商品id
                                        goods_spec: ret.data[i].goods_spec, //商品标签
                                        order_id: ret.data[i].order_id, //订单id
                                        order_message: ret.data[i].order_message,
                                        order_num: ret.data[i].order_num, //订单编号
                                        order_status: ret.data[i].order_status, //订单状态
                                        product_image_url: ret.data[i].product_image_url, //商品url
                                        product_name: ret.data[i].product_name, //货品名称
                                        quantity: ret.data[i].quantity, //购买数量
                                        show_index: ret.data[i].show_index, //是否显示价格
                                        status_message: ret.data[i].status_message, //订单状态文字
                                        complete_percent: ret.data[i].complete_percent,//已完成百分比，如80
                                        rest: (Number(ret.data[i].final_amount) * (100 - Number(ret.data[i].complete_percent))/100).toFixed(2)//还差钱数10.90
                                    },
                                    nexthtml = '<li data-gift_type="2" data-actual_payment="' + iRet.final_amount + '" data-order_id="' + iRet.order_id + '"><h2 class="status"><img src="' + iRet.avatar + '"alt=""><p>还差' + iRet.rest + '元(已完成：' + iRet.complete_percent + '%)</p><span>' + iRet.status_message + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.final_amount + '</i><span>实付款：</span></p><div class="btn-box">' + config.orderStatus(iRet.order_status, config.gift_type) + '</div></li>';
                                    
                                $('#coufenzi').append(nexthtml);
                            }
                        }
                    };

                function showCurOrderList(gift_type) {
                    var navIndex = 0;//导航index默认第一个，即为0
                    //导航navIndex与gift_type之间的对应关系
                    //gift_type 0收  1送  2凑份子
                    //navIndex 0送  1收 2凑份子
                    if(gift_type == 0){
                        navIndex = 1;
                    }else if(gift_type == 1){
                        navIndex = 0;
                    }else{
                        navIndex = 2;
                    }

                    $('.order-list').eq(navIndex).html('');//列表内容清空
                    $('.no-data').hide();//列表内容清空
                    config.interval.forEach(function(i) { clearInterval(i); }); // 清除所有定分页定时器
                    config.interval = [];
                    config.pageIndex = 1;//请求起始页置1
                    config.loadFlag = true;//可否继续请求标记置true
                    config.gift_type = gift_type;//全局变量，供回调函数判断用    
                    tabNav.tab_nav(navIndex);//导航切换

                    var fList = [
                        function(ret) {callback.showMyGift(ret, orderObj.receive)},
                        function(ret) {callback.showMyGift(ret, orderObj.send)},
                        function(ret) {callback.showMyGift(ret, orderObj.coufenzi)},
                        ];

                    var isDataRight = [
                        function(pageIndex,pageSize){return $('#receive li').length == (pageIndex-1)*pageSize;},
                        function(pageIndex,pageSize){return $('#sendOut li').length == (pageIndex-1)*pageSize;},
                        function(pageIndex,pageSize){return $('#coufenzi li').length == (pageIndex-1)*pageSize;},
                        ];

                    console.log(gift_type, fList[gift_type]);
                    paging.pagePostData(url, beforeSend.showGoodsListDataLoading, fList[gift_type], {gift_type:gift_type,order_status_type:5}, isDataRight[gift_type]);
                    
                }

        }
    );
})();

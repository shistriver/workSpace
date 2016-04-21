/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务

define(['jquery', 'cookieCrud', 'beforeSend', 'paging', 'config', 'getUrlPara', 'goodsModify', 'dataService', 'wxShare', 'limitChar'],
    function($, cookieCrud, beforeSend, paging, config, getUrlPara, goodsModify, dataService, wxShare, limitChar) {
        //setTimeout(wxShare.wxShare,1000);//注册分享事件，要等到分享信息获取到才可以，所以加个延时
        var
            showGoodsListData = function(li) {
                if (li.status == '0') {
                    if (config.pageIndex == 1 && (li.data == null || li.data.length == 0)) {
                        $('.no-data').show();
                        $('#loader').hide();
                        $('.ui-fall').html('').hide();
                        config.loadFlag = false;
                    } else if (li.data.length < config.pageSize) {
                        $('#loader').hide();
                        config.loadFlag = false;
                    } else {
                        var nextpagehtml = '';
                        for (var i = 0; i < li.data.length; i++) {
                            var price = parseFloat(li.data[i].p_price).toFixed(2);
                            nextpagehtml += '<li class="item" data-goodsid="' + li.data[i].goods_id + '">';
                            nextpagehtml += '<div class="img-c" style="background-image: url(' + li.data[i].image_url + ')">';
                            nextpagehtml += li.data[i].logo_image == '' ? '' : '<img class="bq-icon" src="' + li.data[i].logo_image + '" alt="">';
                            nextpagehtml += li.data[i].store == '0' ? '<span class="guang">卖光了</span>' : '';
                            nextpagehtml += '</div>';
                            nextpagehtml += '<div class="info-c">';
                            nextpagehtml += '<h3>' + li.data[i].short_name + '</h3>';
                            nextpagehtml += '<span class="price">¥<strong>' + price + '</strong></span>';
                            nextpagehtml += '<span class="love">' + li.data[i].like_count + '</span>';
                            nextpagehtml += '</div></li>';
                        }
                        $('.ui-fall').html($('.ui-fall').html() + nextpagehtml);
                        $('.ui-fall li').on('click', function(event) {
                            var goodsid = $(this).attr('data-goodsid');
                            location.href = config.goodsDetailBaseUrl + goodsid;
                        });
                        config.loadFlag = true;
                    }
                } else {
                    $('.no-data').show();
                    $('#loader').hide();
                    $('.ui-fall').html('').hide();
                    config.loadFlag = false;
                }
            },
            showKeyListData = function(ret) {
                if (ret.status == '0') {
                    config.label_count = ret.data.label_count;
                    var label = ret.data.label;
                    if (label == null || label.length == 0) {
                        $('.hs-area').hide();
                        $('#statusTip').html('没有了').fadeIn(500).delay(1000).fadeOut(500);
                    } else {
                        var len = label.length < 10 ? label.length : 10;
                        var nexthtml = '';
                        for (var i = 0; i < len; i++) {
                            nexthtml += '<li><span class="txt">' + label[i].hot_word + '</span>';
                            nexthtml += label[i].label_info == '' ? '' : '<span class="tag" style="background-color:' + label[i].label_color + '">' + label[i].label_info + '</span></li>'
                        }
                        $('#loadImg').hide();
                        $('.hs-area ul').html(nexthtml).show();
                    }
                    $('.hs-area ul li').on('click', function(event) {
                        var key = $(this).find('.txt').text();
                        $('.hs-area').hide();
                        $('.history-area').hide();
                        $('.search-ret-area').show();
                        cookieCrud.addCoo(key);
                        doSearch(key);
                    });
                    //点选历史记录
                    $('.history-area ul').on('click', 'li', function(event) {
                        $('.history-area').hide();
                        $('.history-area').hide();
                        $('.search-ret-area').show();
                        var key = $(this).text();
                        doSearch(key);
                    });
                } else {
                    $('.hs-area').hide();
                    $('#statusTip').html('没有了').fadeIn(500).delay(1000).fadeOut(500);
                }

                function doSearch(key) {
                    var url = encodeURI('good/?search_type=1&name=' + key);
                    console.log(key);
                    paging.pageGetData(url, beforeSend.showGoodsListDataLoading, showGoodsListData);
                }
            },

            showOrderConfirmData = function(ret) { // 获取商品详情数据成功
                if (ret.status == '0') {
                    var
                        tagId = getUrlPara.getUrlPara('tagId'),
                        productNum = Number(getUrlPara.getUrlPara('productNum')),
                        styleIndex = config.getUrlPara('order_type') || 0, //购买形式 默认为0,0：自买   1：凑份子 2：送礼
                        specName = (function(tagId) { //规格名
                            for (var p in ret.data.products[tagId].spec) {
                                return p;
                            }
                        })(tagId);
                    console.log(tagId);
                    var
                        iRet = {
                            product_id: ret.data.products[tagId].product_id,
                            image_url: ret.data.products[tagId].image_url,
                            short_name: ret.data.short_name,
                            specName: specName,
                            spec: ret.data.products[tagId].spec[specName],
                            p_price: Number(ret.data.products[tagId].p_price).toFixed(2),
                            price: Number(ret.data.products[tagId].price).toFixed(2),
                            fre_rule_enable: ret.data.products[tagId].fre_rule_enable,
                            freight: ret.data.products[tagId].freight,
                            store: ret.data.products[tagId].store
                        },
                        totalPrice = function(index, productNum) { //0：自买   1：凑份子 2：送礼
                            index = index || 0;
                            var curfreight = 0;
                            if (iRet.fre_rule_enable != '0') {
                                iRet.gift_cut_freight = Number(ret.data.products[tagId].gift_freight_rule[0].cut_freight).toFixed(2); //2
                                iRet.raise_cut_freight = Number(ret.data.products[tagId].raise_freight_rule[0].cut_freight).toFixed(2); //1
                                iRet.self_buy_cut_freight = Number(ret.data.products[tagId].self_buy_freight_rule[0].cut_freight).toFixed(2); //0

                                if (index == 0) {
                                    curfreight = iRet.self_buy_cut_freight;
                                } else if (index == 1) {
                                    curfreight = iRet.raise_cut_freight;
                                } else if (index == 2) {
                                    curfreight = iRet.gift_cut_freight;
                                } else {}

                            } else {
                                curfreight = iRet.freight;
                            }
                            return {
                                freight: curfreight,
                                totalPrice: computeFreight(curfreight)
                            };

                            function computeFreight(curfreight) {
                                curfreight = parseFloat(curfreight);
                                return Number(iRet.p_price * productNum + curfreight).toFixed(2);
                            }
                        },
                        commodityBox = '<div class="info-left"><img src="' + iRet.image_url + '"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">' + iRet.short_name + '</h3></div><div class="taste_wrap"><div class="weight">' + iRet.specName + '：<span>' + iRet.spec + '</span></div><p class="taste-name"><span>￥' + iRet.p_price + '</span></p><span class="number">×<i>' + productNum + '</i></span></div></div>';

                    $('.commodity_box').html(commodityBox);
                    $('#goodsNum').val(productNum);
                    //totalPrice(0);//默认自买
                    runtimeTotalPrice(styleIndex, productNum);

                    $('#payStyle .item-list').on('click', function() { //选择付款方式

                        $(this).find('.choose-ic').removeClass('pay_check')
                            .parent().siblings().find('.choose-ic').addClass('pay_check');

                        styleIndex = $(this).index();
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsAdd').on('click', function() { //点加
                        productNum = goodsModify.numAdd(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsDec').on('click', function() { //点减
                        productNum = goodsModify.numDec(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsNum').keyup(function() { //输入
                        productNum = goodsModify.keyNum(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });


                    /* 确认订单, 需求提供order_type 参数表示订单类型
                        送礼: order_type == 0, gift_type == 1
                        凑份子: order_type == 1, gift_type = 2
                        收礼(自买): order_type == 2, gift_type = 0
                        styleIndex: 0: 自己买, 1: 凑份子
                     */
                    $('.order-confirm .order-right').click(function(event) { //点确认订单
                        if (config.btnLock === 0) {
                            config.btnLock = 1; //进来先锁住

                            // order_type 检测
                            var order_type = config.getUrlPara("order_type");
                            if (order_type === undefined) { // 为给出时说明是自买或凑份子，根据styleIndex判断
                                if (styleIndex === 0) order_type = 2;
                                else if (styleIndex === 1) order_type = 1;
                                else order_type = 2; // 默认为自买
                            }                      

                            if ($('.add_address').is(':visible')) { //如果没地址
                                config.btnLock = 0; //解锁
                                $('.user-info').trigger('click');
                            } else {
                                var
                                    postData = {
                                        address_id: $('.info-top').attr('data-address_id'),
                                        customer_memo: $('#order_area').val(), //客户留言
                                        good_spec: iRet.specName + ': ' + iRet.spec,
                                        order_type: order_type, //生成订单类型--0：送礼订单， 1：凑份子 2： 自买
                                        product_id: iRet.product_id, //货品id
                                        quantity: productNum, //购买数量
                                        source: "3", //购买来源-- 写死为3即可
                                        total_price: totalPrice(styleIndex, productNum).totalPrice // 前段验证的商品总额--这部分写错也没关系，因为后端会自己算价钱--但是字段必须有
                                    },
                                    urlId = config.baseUrlPython + '/wallet/h5/order/request?';

                                dataService.postData(urlId, beforeSend.fullScreenLoadImg, orderGener, postData);

                                function orderGener(curret) { // 下单成功的回调函数
                                    $('#fullScreenLoadImg').hide();
                                    config.btnLock = 0; //解锁
                                    var ret = curret;
                                    console.log('orderGener:' + ret.status);
                                    if (ret.status == '0') {
                                        var
                                            iRet = {
                                                create_time: config.timestamp(ret.data.create_time), //订单生成时间时间戳是以秒为单位
                                                final_amount: ret.data.final_amount, //订单成交价格
                                                order_id: ret.data.order_id,
                                                order_num: ret.data.order_num, // 订单号
                                                order_status: ret.data.order_status, //订单状态
                                                share_url: ret.data.share_url, // 分享链接
                                                status_message: ret.data.status_message //前段显示在我的订单里面的订单状态信息
                                            };

                                        var
                                            myWishPara = {
                                                gift_type: postData.order_type,
                                                single_order: 1,
                                                order_id: iRet.order_id
                                            };

                                        /*
                                        order_type 与 gift_type 的关系
                                        送礼: order_type == 0, gift_type == 1
                                        凑份子: order_type == 1, gift_type = 2
                                        收礼(自买): order_type == 2, gift_type = 0
                                        */
                                        if (postData.order_type == 0) {
                                            myWishPara.gift_type = 1;
                                        } else if (postData.order_type == 1) {
                                            myWishPara.gift_type = 2;
                                        } else {
                                            myWishPara.gift_type = 0;
                                        }

                                        //////////////app/////////////////////
                                        if(cookieCrud.checkIsInApp()){
                                            if(!cookieCrud.checkCoo()){//未登录
                                                if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                                                    toLogin();
                                                } else {
                                                    window.android_interface.navLogin();
                                                }
                                            }else{
                                                //{"order_id": 订单id, "type": 订单类型：0、普通订单 1、百宝箱订单 }
                                                var opts = {
                                                    order_id: iRet.order_id,
                                                    type: 0
                                                };

                                                if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                                                    toPay(opts);
                                                } else {
                                                    window.android_interface.navPay(opts);
                                                }
                                            }
                                            config.btnLock = 0
                                            return;
                                        }else{}

                                        ///////////////app///////////////////
                                        
                                        /////////////////h5/////////////////////////
                                        if (styleIndex == 0) { //自付
                                            location.href = 'orderPay.html?' + config.jsonToKeyvalue(iRet);
                                        } else if (styleIndex == 1) { //凑份子
                                            location.href = 'myWish.html?' + config.jsonToKeyvalue(myWishPara);
                                        } else { //送礼
                                            location.href = 'giftGiving.html?' + config.jsonToKeyvalue(myWishPara);
                                        }
                                        //////////////////h5/////////////////////////
                                    } else {
                                        alert('参数错误');
                                    }
                                }
                            }
                        } else {}
                    });

                    function runtimeTotalPrice(index, productNum) { //实时总需支付
                        var runtimeTxt = {};
                        if (index == 1) { //凑份子
                            runtimeTxt.txt = '自己需支付:';
                            runtimeTxt.integer = '0';
                            runtimeTxt.point = '00';
                            runtimeTxt.freight = totalPrice(index, productNum).freight == 0 ? '包邮' : ('¥' + totalPrice(index, productNum).freight);
                        } else if (index == 0) { //自付
                            runtimeTxt.txt = '需支付:';
                            runtimeTxt.integer = totalPrice(index, productNum).totalPrice.split('.')[0];
                            runtimeTxt.point = totalPrice(index, productNum).totalPrice.split('.')[1];
                            runtimeTxt.freight = totalPrice(index, productNum).freight == 0 ? '包邮' : ('¥' + totalPrice(index, productNum).freight);
                        } else {}

                        $('.order-confirm') //自己需要支付的金额
                            .find('.pay-txt').text(runtimeTxt.txt).end()
                            .find('.integer').text(runtimeTxt.integer).end()
                            .find('.point').text('.' + runtimeTxt.point);

                        $('#freight').html(runtimeTxt.freight);
                    }
                } else {}
            },

            showDefaultAddr = function(ret) {
                $('#loadImg').hide();
                if (ret.status == '0') {
                    var
                        iRet = {
                            address_id: '0'
                        }, //存放地址
                        address_id = config.getUrlPara('address_id');

                    if (ret.data == null || !(ret.data instanceof Array) || ret.data.length == 0) { //无数据的情况
                        $('.add_address').show();
                    } else {
                        for (var i = 0; i < ret.data.length; i++) {
                            if (ret.data[i].address_id == address_id) {
                                evalOpt(ret.data[i]);
                                break;
                            } else if (ret.data[i].is_default == 1) {
                                evalOpt(ret.data[i]);
                            }
                        }

                        if (!iRet.hasOwnProperty('name')) { //如果address_id==0 并且没有取到给定的地址，取第一个地址
                            evalOpt(ret.data[0]);
                        }

                        var userAddr = '<div class="info-top" data-address_id="' + iRet.address_id + '"><div class="name">' + iRet.name + '</div><div class="iphone">' + iRet.mobile + '</div></div><div class="arrow"></div><div class="address">' + iRet.addr + '</div>';
                        $('.user-info').prepend(userAddr);
                    }

                    $('.user-info').click(function(event) {
                        location.href = config.baseUrl + '/wallet/gift/addr/edit' + location.search + '&address_id=' + iRet.address_id + '&gift_type=wx_xyhz';
                    });

                } else if (ret.status != '0' && ret.errcode == '80005') {
                    config.requireLogin(ret.errcode);
                } else {
                    $('.add_address').show(); //新增地址
                }

                function evalOpt(data) {
                    iRet.address_id = data.address_id;
                    iRet.name = data.name;
                    iRet.mobile = data.mobile;
                    iRet.addr = data.country + data.province + data.city + data.city + data.detail;
                }
            },

            showOrderDetail = function(ret) {
                if (ret.status == '0' && ret.data != null) {
                    var orderObj = {
                        receive: function(ret){//收到
                                var
                                    iRet = {
                                        order_status: ret.data.order_status, //订单状态 编号
                                        status_message: ret.data.status_message, //订单状态文字////
                                        goods_id: ret.data.goods_id, //商品id
                                        product_image_url: ret.data.product_image_url, //商品url
                                        product_name: ret.data.product_name, //货品名称
                                        quantity: ret.data.quantity, //购买数量
                                        show_index: ret.data.show_index, //是否显示价格
                                        mkprice: Number(ret.data.mkprice).toFixed(2),//原价
                                        price: Number(ret.data.price).toFixed(2),//现价
                                        goods_spec: ret.data.goods_spec, //商品标签//////
                                        address_id: ret.data.address_id,//地址id
                                        user_name: ret.data.user_name,//收件人名字
                                        mobile: ret.data.mobile,//收件人手机号
                                        addr: ret.data.province + ret.data.city + ret.data.city + ret.data.detail,//详细地址////
                                        order_id: ret.data.order_id, //订单id
                                        order_num: ret.data.order_num, //订单编号
                                        create_time: config.timestamp(ret.data.create_time), //订单生成时间
                                    },
                                    nexthtml = '<div class="status-msg">'+iRet.status_message+'</div><!--商品信息--><div class="commodity_wrap" data-goods_id="'+iRet.goods_id+'"><div class="commodity_box"><div class="info-left"><img src="'+iRet.product_image_url+'"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.product_name+'</h3><div class="price_wrap"><span class="price"><span>￥'+iRet.price+'</span></span><span class="price_old"><span>￥'+iRet.mkprice+'</span></span></div></div></div><div class="arrow"></div><div class="taste_wrap"><p class="taste-name">'+iRet.goods_spec+'</p><span class="number">×'+iRet.quantity+'</span></div></div></div><!--地址--><div class="addr-title">收货信息<span></span></div><div class="user-info giving-no"><div class="info-top"data-address_id="'+iRet.address_id+'"><div class="name">'+iRet.user_name+'</div><div class="iphone">'+iRet.mobile+'</div></div><div class="arrow" style="display:none;"></div><div class="address">'+iRet.addr+'</div></div><div class="item list-line"><div class="item-list"><span class="static">订单编号</span><span class="money"id="orderId">'+iRet.order_num+'</span></div><div class="item-list"><span class="static">确认订单时间</span><span class="money"id="orderTime">'+iRet.create_time+'</span></div></div>';
                                
                                $('#container').prepend(nexthtml);
                        },
                        send: function(ret){//送出
                                var
                                    iRet = {
                                        status_message: ret.data.status_message, //订单状态文字////
                                        avatar: ret.data.avatar,
                                        to_user: (ret.data.to_user || '未知的Ta'), //送礼订单这个字段表示送给谁
                                        order_message: ret.data.order_message,//留言////
                                        total_freight: Number(ret.data.total_freight).toFixed(2), //运费
                                        final_amount: Number(ret.data.final_amount).toFixed(2), //订单价格/////
                                        order_num: ret.data.order_num, //订单编号
                                        create_time: config.timestamp(ret.data.create_time), //订单生成时间////
                                        actual_payment: Number(ret.data.actual_payment).toFixed(2), //订单价格
                                        order_id: ret.data.order_id, //订单id
                                        order_status: ret.data.order_status, //订单状态////
                                        goods_id: ret.data.goods_id, //商品id
                                        product_image_url: ret.data.product_image_url, //商品url
                                        product_name: ret.data.product_name, //货品名称
                                        mkprice: Number(ret.data.mkprice).toFixed(2),//原价
                                        price: Number(ret.data.price).toFixed(2),//现价
                                        quantity: ret.data.quantity, //购买数量
                                        goods_spec: ret.data.goods_spec, //商品标签
                                        show_index: ret.data.show_index, //是否显示价格
                                    },
                                    nexthtml = '<div class="status-msg">'+iRet.status_message+'</div><!--商品信息--><div class="commodity_wrap" data-goods_id="'+iRet.goods_id+'"><div class="commodity_box"><div class="info-left"><img src="'+iRet.product_image_url+'"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.product_name+'</h3><div class="price_wrap"><span class="price"><span>￥'+iRet.price+'</span></span><span class="price_old"><span>￥'+iRet.mkprice+'</span></span></div></div></div><div class="arrow"></div><div class="taste_wrap"><p class="taste-name">'+iRet.goods_spec+'</p><span class="number">×'+iRet.quantity+'</span></div></div></div><div class="item"><div class="item-list"><span class="static">运费</span><span class="money">￥'+iRet.total_freight+'</span></div><div class="item-list"><span class="static">实付款</span><span class="money">￥'+iRet.final_amount+'</span></div></div><div class="item list-line"><div class="item-list"><span class="static">订单编号</span><span class="money"id="orderId">'+iRet.order_num+'</span></div><div class="item-list"><span class="static">确认订单时间</span><span class="money"id="orderTime">'+iRet.create_time+'</span></div></div>';

                                $('#container').prepend(nexthtml);
                        },
                        coufenzi: function(ret){//凑份子
                                var
                                    iRet = {
                                        order_id: ret.data.order_id, //订单id
                                        order_status: ret.data.order_status, //订单状态编号
                                        status_message: ret.data.status_message, //订单状态文字////
                                        address_id: ret.data.address_id,//地址id
                                        user_name: ret.data.user_name,//地址名字
                                        mobile: ret.data.mobile,//地址手机号
                                        addr: ret.data.province + ret.data.city + ret.data.city + ret.data.detail,//详细地址////
                                        goods_id: ret.data.goods_id, //商品id
                                        product_image_url: ret.data.product_image_url, //商品url
                                        product_name: ret.data.product_name, //货品名称
                                        mkprice: Number(ret.data.mkprice).toFixed(2),//原价
                                        price: Number(ret.data.price).toFixed(2),//现价
                                        quantity: ret.data.quantity, //购买数量
                                        goods_spec: ret.data.goods_spec, //商品标签//////
                                        total_freight: Number(ret.data.total_freight).toFixed(2), //运费
                                        final_amount: Number(ret.data.final_amount).toFixed(2), //订单价格/////
                                        order_num: ret.data.order_num, //订单编号
                                        create_time: config.timestamp(ret.data.create_time) //订单生成时间
                                    },
                                    nexthtml = '<div class="status-msg">'+iRet.status_message+'</div><!--商品信息--><div class="commodity_wrap" data-goods_id="'+iRet.goods_id+'"><div class="commodity_box"><div class="info-left"><img src="'+iRet.product_image_url+'"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.product_name+'</h3><div class="price_wrap"><span class="price"><span>￥'+iRet.price+'</span></span><span class="price_old"><span>￥'+iRet.mkprice+'</span></span></div></div></div><div class="arrow"></div><div class="taste_wrap"><p class="taste-name">'+iRet.goods_spec+'</p><span class="number">×'+iRet.quantity+'</span></div></div></div><!--地址--><div class="addr-title">收货信息<span></span></div><div class="user-info giving-no"><div class="info-top"data-address_id="'+iRet.address_id+'"><div class="name">'+iRet.user_name+'</div><div class="iphone">'+iRet.mobile+'</div></div><div class="arrow" style="display:none;"></div><div class="address">'+iRet.addr+'</div></div><div class="item"><div class="item-list"><span class="static">运费</span><span class="money">￥'+iRet.total_freight+'</span></div><div class="item-list"><span class="static">实付款</span><span class="money">￥'+iRet.final_amount+'</span></div></div><div class="item list-line"><div class="item-list"><span class="static">订单编号</span><span class="money"id="orderId">'+iRet.order_num+'</span></div><div class="item-list"><span class="static">确认订单时间</span><span class="money"id="orderTime">'+iRet.create_time+'</span></div></div>';

                                $('#container').prepend(nexthtml);
                        }
                    };

                    var gift_type = config.getUrlPara('gift_type');//0收 1送 2凑份子
                    if(gift_type == '0'){
                        orderObj.receive(ret);
                    }else if(gift_type == '1'){
                        orderObj.send(ret);
                    }else if(gift_type == '2'){
                        orderObj.coufenzi(ret);
                    }else{}

                    var order_status = ret.data.order_status;
                    if (order_status == 0) { //待支付  立即支付
                        $('.zhifu-btn').text('立即支付').show().addClass('toPay');
                    } else if (order_status == 1) { //待送出 立即送出
                        $('.zhifu-btn').text('立即送出').show().addClass('toGive');
                    } else if (order_status == 8) { ////8：凑份子中
                        $('.coufenzi').show();
                    } else {}

                    var
                        urlPara = {
                            order_id: config.getUrlPara('order_id'),
                            final_amount: config.getUrlPara('final_amount'),
                            gift_type: config.getUrlPara('gift_type')
                        };

                    $('#container').on('click', '.toPay', function(event) { //点击立即支付gd
                        location.href = 'orderPay.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('#container').on('click', '.toGive', function(event) { //点击立即送出gd
                        location.href = 'giftGiving.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('#container').on('click', '.toPool', function(event) { //点击找人帮付
                        location.href = 'myWish.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('#container').on('click', '.commodity_wrap', function(event) {//点击条商品详情
                        location.href = config.goodsDetailBaseUrl + $(this).attr('data-goods_id');
                    });

                    // $('.user-info').click(function(event) {
                    //     location.href = config.baseUrl + '/wallet/gift/addr/edit' + location.search + '&address_id=' + iRet.address_id + '&gift_type=wx_xyhz';
                    // });

                } else {}
            },
            //废弃不用 调微信支付
            showOrderPay = function(ret) { //自买支付页
                if (ret.status == '0' && ret.data != null) {
                    var
                        iRet = {

                        };

                    $('.zhifu-btn').click(function(event) {
                        alert('支付');
                    });

                } else {}
            },

            showMyWish = function(ret) { //我的愿望
                if (ret.status == '0' && ret.data != null) {
                    var
                        iRet = {
                            product_image_url: ret.data.product_image_url,
                            product_name: ret.data.product_name,
                            goods_spec: ret.data.goods_spec,
                            price: (ret.data.show_index == '1' ? ('¥' + Number(ret.data.price).toFixed(2)) : ''),
                            share_url: ret.data.share_url,
                        },
                        shareInfo = { //分享信息
                            title: ($('#wish_area').val() == '' ? (function() {
                            var str = '钱不够？情来凑！有情人来帮人家凑份子嘛~';
                            return str;
                        })() : $('#wish_area').val()), //留言内容
                            desc: iRet.product_name, //商品名称
                            link: iRet.share_url, //share_url
                            imgUrl: iRet.product_image_url //商品图片
                        },
                        nexthtml = '<div class="info-left"><img src="' + iRet.product_image_url + '"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">' + iRet.product_name + '</h3></div><div class="gift_det_wrap"><div class="gift-color float_l"><span>' + iRet.goods_spec + '</span></div><p class="gift_price float_r no_margin"><span>' + iRet.price + '</span></p></div></div>';

                    $('.gift_giving_box').html(nexthtml);

                    getShareInfo();//如果没有编辑留言内容，执行分享参数

                    limitChar.limit('#wish_area', true, '.limit_min', 70, getShareInfo); //留言.留言改变时要触发分享

                    function getShareInfo() {
                        var title = $('#wish_area').val();
                        shareInfo.title = (title == '' ? (function() {
                            var str = '钱不够？情来凑！有情人来帮人家凑份子嘛~';
                            return str;
                        })() : title); //留言标题
                        wxShare.wxShare(true, shareInfo, toLeaveWord); //微信分享 
                    }

                    function toLeaveWord(){//留言
                        var 
                            url = config.baseUrl + '/wallet/h5/order/leaveMessage?',
                            postData = {
                                message: shareInfo.title,//--留言信息，可以为空
                                order_id: config.getUrlPara('order_id'),//订单id 非空
                                update_type: "5" //写死为5 表示留言
                            };

                        dataService.postData(url, beforeSend.showKeyListLoading, afterLeaveMessage, postData);

                        function afterLeaveMessage(ret){
                            //alert(ret.status);
                            if(ret.status == '0'){
                                location.href = 'myGift.html?gift_type=2';//留言成功跳凑份子订单列表
                            }else{
                                alert('留言失败');
                            }
                        }
                    }

                    $('.btn-share').click(function(event) {
                        $('#fuceng').fadeIn();  
                    });

                    $('#fuceng').click(function(event) {
                        $(this).fadeOut();
                    });

                } else {}
            },

            showGiftGiving = function(ret) { //送礼
                if (ret.status == '0' && ret.data != null) {
                    var
                        iRet = {
                            product_image_url: ret.data.product_image_url,
                            product_name: ret.data.product_name,
                            goods_spec: ret.data.goods_spec,
                            price: Number(ret.data.price).toFixed(2),
                            show_index: ret.data.show_index,
                            share_url: ret.data.share_url,
                            avatar: ret.data.avatar//用户头像
                        },
                        shareInfo = { //分享信息
                            title: '我用心意盒子送了一份礼物给你，钱已付过，赶快接收吧', //用户名+用心意盒子送了一份礼物给你，钱已付过，赶快接收吧
                            desc: iRet.product_name, //商品名称
                            link: iRet.share_url, //share_url
                            imgUrl: iRet.product_image_url //商品图片
                        },
                        nexthtml = '<div class="gift_giving_box"><div class="info-left"><img src="' + iRet.product_image_url + '"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">' + iRet.product_name + '</h3></div><div class="gift_det_wrap"><div class="gift-color"><span>' + iRet.goods_spec + '</span></div><p class="gift_price"><span>￥11.9</span><span class="icon_price"></span></p><span class="gift_num">×1</span></div></div></div>';

                    $('.gift_giving_wrap').html(nexthtml);
                    $('.bless_box .head_portrait img').attr('src', iRet.avatar);//用户头像

                    getShareInfo();//如果没有编辑留言内容，执行分享参数

                    limitChar.limit('#txt_area', true, '.limit_min', 70, getShareInfo); //留言.留言改变时要触发分享

                    function getShareInfo() {//分享+留言
                        var message = $('#txt_area').val() || $('#txt_area').attr('placeholder');
                        wxShare.wxShare(true, shareInfo, function(){
                            toLeaveWord(message);
                        }); //微信分享 
                    }

                    function toLeaveWord(message){//留言

                        var 
                            url = config.baseUrl + '/wallet/h5/order/leaveMessage?',
                            postData = {
                                is_secret: "0", //是否送出神秘礼物-非必填， 1 是  0- 否
                                message: message,//--留言信息，可以为空
                                order_id: config.getUrlPara('order_id'),//订单id 非空
                                show_index: ($('.icon_price').is(':visible') ? 0 : 1), //是否显示商品价格-0 否 1 可以显示商品价格
                                update_type: "5" //写死为5 表示留言
                            };

                        dataService.postData(url, beforeSend.showKeyListLoading, afterLeaveMessage, postData);

                         function afterLeaveMessage(ret){
                            alert(ret.status);
                            if(ret.status == '0'){
                                location.href = 'myGift.html?gift_type=1';//留言成功跳送礼订单列表
                            }else{
                                alert('留言失败');
                            }
                        }
                    }

                    $('.btn-share').click(function(event) { //分享到好友或朋友圈等等
                        $('#fuceng').fadeIn();
                    });

                    $('#fuceng').click(function(event) {
                        $(this).fadeOut();
                    });

                } else {}
            },

            showMyGift = function(ret, dataHandler) { //我的订单列表
                ///////////////////////////////
                if (ret.status == '0') {
                    if (config.pageIndex == 1 && (ret.data == null || !(ret.data instanceof Array) || ret.data.length == 0)) {
                        $('.no-data').show();
                        $('#loader').hide();
                        //$('.ui-fall').html('').hide();
                        config.loadFlag = false;
                    } else if (ret.data.length < config.pageSize) {
                        $('#loader').hide();
                        config.loadFlag = false;
                    } else {
                        config.loadFlag = true;
                    }
                
                    dataHandler(ret);
                    
                    $('.order-list').on('click', '.toPay', function(event) { //点击立即支付gd
                        var
                            $thisLi = $(this).parent('div').parent('li'),
                            urlPara = {
                                order_id: $thisLi.attr('data-order_id'),
                                final_amount: $thisLi.attr('data-actual_payment')
                            };

                        location.href = 'orderPay.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('.order-list').on('click', '.toGive', function(event) { //点击立即送出gd
                        var
                            $thisLi = $(this).parent('div').parent('li'),
                            urlPara = {
                                order_id: $thisLi.attr('data-order_id'),
                                gift_type: $thisLi.attr('data-gift_type')
                            };

                        location.href = 'giftGiving.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('.order-list').on('click', '.toPool', function(event) { //点击找人帮付
                        var
                            $thisLi = $(this).parent('div').parent('li'),
                            urlPara = {
                                gift_type: $thisLi.attr('data-gift_type'),
                                order_id: $thisLi.attr('data-order_id')
                            };

                        location.href = 'myWish.html?' + config.jsonToKeyvalue(urlPara);
                    });

                    $('.order-list').on('click', '.toOrderDetail', function(event) { //点击订单详情gd
                        var
                            $thisLi = $(this).parent('div').parent('li'),
                            urlPara = {
                                gift_type: $thisLi.attr('data-gift_type'),
                                order_id: $thisLi.attr('data-order_id'),
                                final_amount: $thisLi.attr('data-actual_payment') //用于订单详情中点击立即付款用
                            };

                        location.href = 'orderDetail.html?' + config.jsonToKeyvalue(urlPara);
                    });

                } else if ( ret.status != '0' && ret.errcode == '80005') {
                    config.requireLogin(ret.errcode);
                } else  {
                   // $('.no-data').show();
                    $('#loader').hide();
                    //$('.ui-fall').html('').hide();
                    config.loadFlag = false;
                }
                //////////////////////////////
                //根据订单状态判断显示什么按钮待定写
            };

        return {
            showGoodsListData: showGoodsListData,
            showKeyListData: showKeyListData,
            showOrderConfirmData: showOrderConfirmData, //确认订单
            showDefaultAddr: showDefaultAddr, //获取用户地址
            showOrderDetail: showOrderDetail, //订单详情
            showOrderPay: showOrderPay, //支付货款
            showMyGift: showMyGift, //订单列表
            showMyWish: showMyWish, //我的愿望  凑份子页
            showGiftGiving: showGiftGiving //赠送礼物
        };
    }
);
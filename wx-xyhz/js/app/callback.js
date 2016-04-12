/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务

define(['jquery', 'cookieCrud', 'beforeSend', 'paging', 'config', 'getUrlPara', 'goodsModify', 'dataService'],
    function($, cookieCrud, beforeSend, paging, config, getUrlPara, goodsModify, dataService) {
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
                            location.href = config.baseUrlPage + '/index.html#/goods/' + goodsid;
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
            showOrderConfirmData = function(ret) {
                if (ret.status == '0') {
                    var
                        tagId = getUrlPara.getUrlPara('tagId'),
                        productNum = Number(getUrlPara.getUrlPara('productNum'));
                        styleIndex = 0, //购买形式 默认为0,0：自买   1：凑份子 2：送礼
                        specName = (function() { //规格名
                            for (var p in ret.data.products[0].spec) {
                                return p;
                            }
                        })();
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

                    var check_img = ['url(img/ic_pay_checked.png)', 'url(img/ic_pay_check.png)'];

                    $('#payStyle .item-list').on('click', function() {
                        $(this).find('.pay_check_com').css({
                            'background-image': check_img[0]
                        }).parent().siblings().find('.pay_check_com').css({
                            'background-image': check_img[1]
                        });

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


                    $('.order-confirm .order-right').click(function(event) { //点确认订单
                        if ($('.add_address').is(':visible')) { //如果没地址
                            $('.user-info').trigger('click');
                        } else {
                            var
                                postData = {
                                    address_id: $('.info-top').attr('data-address_id'),
                                    customer_memo: $('#order_area').val(),
                                    good_spec: iRet.spec,
                                    order_type: (2 - styleIndex), //生成订单类型--0：送礼订单， 1：凑份子 2： 自买
                                    product_id: iRet.product_id, //货品id
                                    quantity: productNum, //购买数量
                                    source: "3", //购买来源-- 写死为3即可
                                    total_price: totalPrice(styleIndex, productNum).totalPrice // 前段验证的商品总额--这部分写错也没关系，因为后端会自己算价钱--但是字段必须有
                                },
                                urlId = config.baseUrlPython + '/wallet/h5/order/request?';

                            dataService.postData(urlId, beforeSend.showKeyListLoading, orderGener, postData);

                            function orderGener(curret){
                                var ret = curret;
                                if(ret.status == '0'){
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
                                    if(styleIndex == 0){//自付
                                        location.href = 'pay.html?' + jsonToKeyvalue(iRet);
                                    }else{//凑份子
                                        location.href = 'myWish.html?' + jsonToKeyvalue(iRet);
                                    }
                                    
                                }else{
                                   alert('参数错误'); 
                                }

                                function jsonToKeyvalue(json){//作用相当于ajax请求参数放到请求地址后面
                                    var keyValue = '';
                                    for(key in iRet){
                                        keyValue += '&'+ key + '=' + iRet[key];
                                    }
                                    return keyValue.substring(1);//首字母不是'&'
                                }
                                
                            }

                            
                        }

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
                if (ret.status == '0') {
                    var
                        iRet = {
                            address_id: '0'
                        }, //存放地址
                        address_id = config.getUrlPara('address_id');

                    if (ret.data == null || !(ret.data instanceof Array) || ret.data.length == 0) {
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
                        location.href = config.baseUrlPage + '/wallet/gift/addr/edit' + location.search + '&address_id=' + iRet.address_id + '&gift_type=wx_xyhz';
                    });

                } else {}

                function evalOpt(data) {
                    iRet.address_id = data.address_id;
                    iRet.name = data.name;
                    iRet.mobile = data.mobile;
                    iRet.addr = data.country + data.province + data.city + data.city + data.detail;
                }
            },
            showOrderDetail = function(ret) {
                if (ret.status == '0' && ret.data != null) {
                    var
                        iRet = {
                            total_price: getUrlPara.getUrlPara('total_price')
                        };
                    console.log(iRet.total_price);
                    $('#total_price .money').text(iRet.total_price);
                    $('.zhifu-btn').click(function(event) {
                        alert('支付');
                    });

                } else {}
            },
            showPay = function(ret) {
                if (ret.status == '0' && ret.data != null) {
                    var
                        iRet = {
                            
                        };

                    $('.zhifu-btn').click(function(event) {
                        alert('支付');
                    });

                } else {}
            },
            showMyGift = function(ret) {
                ///////////////////////////////
                if (ret.status == '0') {
                    if (config.pageIndex == 1 && (ret.data == null || ret.data.length == 0)) {
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
                    for (var i = 0; i < ret.data.length; i++) {
                        var
                            iRet = {
                                actual_payment: ret.data[i].actual_payment, //真实付的钱数
                                avatar: ret.data[i].avatar, //头像
                                bonus_money: ret.data[i].bonus_money, //红包钱数
                                create_time: config.timestamp(ret.data[i].create_time), //订单生成时间
                                //delay_time: ret.data.delay_time,//还有多长时间超时
                                //discount: ret.data.discount,//优惠价格
                                //final_amount: ret.data.final_amount,//订单价格
                                goods_id: ret.data[i].goods_id, //商品id
                                goods_spec: ret.data[i].goods_spec, //商品标签
                                //is_secret: ret.data.is_secret,//是否是神秘礼物
                                //mkprice: ret.data.mkprice, //市场价
                                //order_exchange_type: ret.data.order_exchange_type,
                                order_id: ret.data[i].order_id, //订单id
                                order_message: ret.data[i].order_message,
                                order_num: ret.data[i].order_num, //订单编号
                                order_status: ret.data[i].order_status, //订单状态
                                //pic_images: ret.data.pic_images, //上传的图片列表
                                //price: ret.data.price, //货品价格
                                //product_id: ret.data.product_id, //货品id
                                product_image_url: ret.data[i].product_image_url, //商品url
                                product_name: ret.data[i].product_name, //货品名称
                                quantity: ret.data[i].quantity, //购买数量
                                share_url: ret.data[i].share_url, //分享链接
                                show_index: ret.data[i].show_index, //是否显示价格
                                status_message: ret.data.status_message, //订单状态文字
                                to_user: ret.data[i].to_user //送礼订单这个字段表示送给谁
                                    //total_freight: ret.data.total_freight //运费多少钱
                            },
                            nexthtml = '';

                        if (config.gift_type == 0) { //收到
                            nexthtml = '<li><h2 class="status"><img src="' + iRet.avatar + '"alt=""><p>送给：' + iRet.to_user + '</p><span>' + iRet.order_status + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.actual_payment + '</i><span>实付款：</span></p><div class="btn-box"><button class="color-red">立即送出</button><button class="mr10">订单详情</button><button class="mr10">立即付款</button></div></li>';
                        } else if (config.gift_type == 1) { //送出
                            nexthtml = '<li><h2 class="status"><img src="' + iRet.avatar + '"alt=""><p>来自：' + iRet.to_user + '</p><span>' + iRet.order_status + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.actual_payment + '</i><span>实付款：</span></p><div class="btn-box"><button class="color-red">立即送出</button><button class="mr10">订单详情</button><button class="mr10">立即付款</button></div></li>';
                        } else { //凑份子
                            nexthtml = '<li><h2 class="status"><p style="margin-left:0;">送给：' + iRet.to_user + '</p><span>' + iRet.order_status + '</span></h2><div class="gift"><img src="' + iRet.product_image_url + '"alt=""><div class="right"><p>' + iRet.product_name + '</p><span>' + iRet.goods_spec + '</span><i>×1</i></div></div><p class="money"><i>¥' + iRet.actual_payment + '</i><span>实付款：</span></p><div class="btn-box"><button class="color-red">立即送出</button><button class="mr10">立即付款</button><button class="mr10">订单详情</button></div></li>';
                        }

                        $('.order-list:visible').append(nexthtml);
                    }
                } else {
                    //$('.no-data').show();
                    //$('#loader').hide();
                    //$('.ui-fall').html('').hide();
                    config.loadFlag = false;
                }
                //////////////////////////////



                //根据订单状态判断显示什么按钮待定写
            };

        return {
            showGoodsListData: showGoodsListData,
            showKeyListData: showKeyListData,
            showOrderConfirmData: showOrderConfirmData,
            showDefaultAddr: showDefaultAddr,
            showOrderDetail: showOrderDetail,
            showPay: showPay,
            showMyGift: showMyGift
        };
    }
);
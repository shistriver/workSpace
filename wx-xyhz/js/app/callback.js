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
                        styleIndex = 0,//购买形式 默认为0,0：自买   1：凑份子 2：送礼
                        specName = (function() {//规格名
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
                        totalPrice = function(index, productNum){//0：自买   1：凑份子 2：送礼
                            index = index || 0;
                            if(iRet.fre_rule_enable != '0'){
                                iRet.gift_cut_freight = Number(ret.data.products[tagId].gift_freight_rule[0].cut_freight).toFixed(2);//2
                                iRet.raise_cut_freight = Number(ret.data.products[tagId].raise_freight_rule[0].cut_freight).toFixed(2);//1
                                iRet.self_buy_cut_freight = Number(ret.data.products[tagId].self_buy_freight_rule[0].cut_freight).toFixed(2);//0

                                if(index == 0){
                                    return computeFreight(iRet.self_buy_cut_freight);
                                }else if(index == 1){
                                    return computeFreight(iRet.raise_cut_freight);
                                }else if(index == 2){
                                    return computeFreight(iRet.gift_cut_freight);
                                }else{}
                            }else{
                                return computeFreight(iRet.freight);
                            }

                            function computeFreight(cut){
                                return Number(iRet.p_price * productNum - cut).toFixed(2);
                            }
                        },
                        commodityBox = '<div class="info-left"><img src="'+iRet.image_url+'"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.short_name+'</h3></div><div class="taste_wrap"><div class="weight">'+iRet.specName+'：<span>'+iRet.spec+'</span></div><p class="taste-name"><span>￥'+iRet.p_price+'</span></p><span class="number">×<i>'+productNum+'</i></span></div></div>';

                    $('.commodity_box').html(commodityBox);
                    $('#goodsNum').val(productNum);
                    //totalPrice(0);//默认自买
                     runtimeTotalPrice(styleIndex, productNum);

                    var check_img = ['url(img/ic_pay_checked.png)', 'url(img/ic_pay_check.png)']
                    $('#payStyle .item-list').on('click', function() {
                        $(this).find('.pay_check_com').css({
                            'background-image': check_img[0]
                        }).parent().siblings().find('.pay_check_com').css({
                            'background-image': check_img[1]
                        });

                        styleIndex = $(this).index();
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsAdd').on('click', function() {//点加
                        productNum = goodsModify.numAdd(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsDec').on('click', function() {//点减
                        productNum = goodsModify.numDec(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });

                    $('#goodsNum').keyup(function() {//输入
                        productNum = goodsModify.keyNum(iRet.store);
                        runtimeTotalPrice(styleIndex, productNum);
                    });
                    

                    $('.order-confirm .order-right').click(function(event) {//确认订单
                       var 
                            iPara = {
                                address_id: $('.info-top').attr('data-address_id'), 
                                customer_memo: $('#order_area').val(),
                                good_spec: iRet.spec,
                                order_type: (2-styleIndex), //生成订单类型--0：送礼订单， 1：凑份子 2： 自买
                                product_id: iRet.product_id, //货品id
                                quantity: productNum, //购买数量
                                source: "3", //购买来源-- 写死为3即可
                                total_price: totalPrice(styleIndex, productNum)// 前段验证的商品总额--这部分写错也没关系，因为后端会自己算价钱--但是字段必须有
                            },
                            paraStr = '&total_price='+iPara.total_price+'&address_id='+iPara.address_id+'&customer_memo='+iPara.customer_memo+'&good_spec='+iPara.good_spec+'&order_type='+iPara.order_type+
                            '&product_id='+iPara.product_id+'&quantity='+iPara.quantity+'&source='+iPara.source+'&total_price='+iPara.total_price;
                        
                        location.href = 'pay.html?'+paraStr;
                    });

                    function runtimeTotalPrice(index, productNum){//实时总需支付
                        var txt = index == 1 ? '自己需支付:' : '需支付:';
                        productNum = index == 1 ? 0 : productNum;
                        $('.order-confirm')
                        .find('.pay-txt').text(txt).end()
                        .find('.integer').text(totalPrice(index, productNum).split('.')[0]).end()
                        .find('.point').text('.'+totalPrice(index, productNum).split('.')[1]);
                    }
                } else {}
            },
            showDefaultAddr = function(ret) {
                if (ret.status == '0') {
                    if(ret.data == null || ret.data.length == 0){
                        $('.add_address').show();
                    }else{
                        var
                            iRet = {};
                        for(var i=0; i<ret.data.length; i++){
                            if(ret.data[i].is_default == 1){
                                iRet.name = ret.data[i].name;
                                iRet.mobile = ret.data[i].mobile;
                                iRet.addr = ret.data[i].country + ret.data[i].province + ret.data[i].city + ret.data[i].city + ret.data[i].detail;
                                iRet.address_id = ret.data[i].address_id;
                                break;
                            }
                        }
                        if(i ==ret.data.length){
                            iRet.address_id = ret.data[0].address_id;
                            iRet.name = ret.data[0].name;
                            iRet.mobile = ret.data[0].mobile;
                            iRet.addr = ret.data[0].country + ret.data[0].province + ret.data[0].city + ret.data[0].city + ret.data[0].detail;
                        }
                        var userAddr = '<div class="info-top" data-address_id="'+iRet.address_id+'"><div class="name">'+iRet.name+'</div><div class="iphone">'+ iRet.mobile+'</div></div><div class="arrow"></div><div class="address">'+iRet.addr+'</div>';
                        $('.user-info').prepend(userAddr);
                    }

                    $('.user-info').click(function(event) {
                        location.href = 'http://www.xinyihezi.com/wallet/gift/addr/edit?order_id=EDE763E4AA5B2301FE8712A7AA369C3EB828C29AA9C405215201101A5E151030AE23A2E3FFA8BDCB6E0AFB435C66C2BC&address_id=148774';
                    });

                } else {}
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
                            create_time: config.timestamp("1458647137"), //订单生成时间
                            final_amount: ret.data.final_amount, //订单成交价格
                            order_id: ret.data.order_id,
                            order_num: ret.data.order_num,// 订单号
                            order_status: ret.data.order_status, //订单状态
                            share_url: ret.data.share_url,// 分享链接
                            status_message: ret.data.status_message //前段显示在我的订单里面的订单状态信息
                        };
                        console.log(iRet.total_price);
                   
                    $('.zhifu-btn').click(function(event) {
                        alert('支付');
                    });

                } else {}
            },
            showMyGift = function(ret){
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
            showMyGift:showMyGift
        };
    }
);

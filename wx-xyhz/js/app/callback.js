/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务

define(['jquery', 'cookieCrud', 'beforeSend', 'paging', 'config', 'getUrlPara', 'goodsModify'],
    function($, cookieCrud, beforeSend, paging, config, getUrlPara, goodsModify) {
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
                            location.href = 'http://app.xinyihezi.com:8881/index.html#/goods/' + goodsid;
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
                        productId = getUrlPara.getUrlPara('productId'),
                        productNum = Number(getUrlPara.getUrlPara('productNum')).toFixed(2);
                        styleIndex = 0,//购买形式 默认为0,0：自买   1：凑份子 2：送礼
                        specName = (function() {//规格名
                        for (var p in ret.data.products[0].spec) {
                            return p;
                        }
                    })();
                    console.log(productId);
                    var
                        iRet = {
                            image_url: ret.data.products[productId].image_url,
                            short_name: ret.data.short_name,
                            specName: specName,
                            spec: ret.data.products[productId].spec[specName],
                            p_price: Number(ret.data.products[productId].p_price).toFixed(2),
                            price: Number(ret.data.products[productId].price).toFixed(2),
                            fre_rule_enable: ret.data.products[productId].fre_rule_enable,
                            freight: ret.data.products[productId].freight,
                            store: ret.data.products[productId].store
                        },
                        totalPrice = function(index, productNum){//0：自买   1：凑份子 2：送礼
                            index = index || 0;
                            if(iRet.fre_rule_enable != '0'){
                                iRet.gift_cut_freight = Number(ret.data.products[productId].gift_freight_rule[0].cut_freight).toFixed(2);//2
                                iRet.raise_cut_freight = Number(ret.data.products[productId].raise_freight_rule[0].cut_freight).toFixed(2);//1
                                iRet.self_buy_cut_freight = Number(ret.data.products[productId].self_buy_freight_rule[0].cut_freight).toFixed(2);//0

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
                        commodityBox = '<div class="info-left"><img src="'+iRet.image_url+'"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.short_name+'</h3></div><div class="taste_wrap"><div class="weight">'+iRet.specName+'：<span>'+iRet.spec+'</span></div><p class="taste-name"><span>￥'+iRet.p_price+'</span></p><span class="number">×<i>1</i></span></div></div>';

                    $('.commodity_box').html(commodityBox);

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

                    $('.order-confirm .order-right').click(function(event) {
                       var 
                            iPara = {
                                short_name: iRet.short_name,
                                specName: iRet.specName,
                                spec: iRet.spec,
                                p_price: iRet.p_price,
                                price: iRet.price,
                                product_num: parseInt($('#goodsNum').val()),
                                freight: totalPrice(styleIndex, productNum) - this.p_price * this.product_num,
                                total_price: totalPrice(styleIndex, productNum)
                            },
                            paraStr = 'short_name='+iPara.short_name+'&specName='+iPara.specName+'&spec='+iPara.spec+'&p_price='+iPara.p_price+'&price='+iPara.price+'&product_num='+iPara.product_num+'&freight='+iPara.freight+'&total_price='+iPara.total_price;
                        location.href = 'orderDetail.html?'+paraStr;
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
                    if(ret.data = null || ret.data.length == 0){
                        $('.add_address').show();
                    }else{
                        var
                            iRet = {};
                        for(var i=0; i<ret.data.length; i++){
                            if(ret.data[i].is_default == 1){
                                iRet.name = ret.data[i].name;
                                iRet.mobile = ret.data[i].mobile;
                                iRet.addr = ret.data[i].country + ret.data.province + ret.data.city + ret.data.city + detail;
                            }
                        }
                        var userAddr = '<div class="info-top"><div class="name">'+iRet.name+'</div><div class="iphone">'+ iRet.mobile+'</div></div><div class="arrow"></div><div class="address">'+iRet.addr+'</div>';
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
                            order_num: ret.data.order_num,
                            create_time: ret.data.create_time,
                            short_name: getUrlPara.getUrlPara('short_name'),
                            specName: getUrlPara.getUrlPara('specName'),
                            spec: getUrlPara.getUrlPara('spec'),
                            p_price: getUrlPara.getUrlPara('p_price'),
                            price: getUrlPara.getUrlPara('price'),
                            product_num: getUrlPara.getUrlPara('product_num'),
                            freight: getUrlPara.getUrlPara('freight'),
                            total_price: getUrlPara.getUrlPara('total_price')
                        }
                        orderDetailInfo = '<div class="commodity_wrap"><div class="commodity_box"><div class="info-left"><img src="img/20160218135537_29463.jpg"alt=""></div><div class="info-right"><div class="detailed"><h3 class="det-title">'+iRet.short_name+'</h3><div class="price_wrap"><span class="price"><span>￥'+iRet.p_price+'</span></span><span class="price_old"><span>￥16.80</span></span></div></div></div><div class="arrow"></div><div class="taste_wrap"><p class="taste-name">'+iRet.specName+'：<span>'+iRet.spec+'</span></p><span class="number">×1</span></div></div></div><div class="item"><div class="item-list"><span class="static">运费</span><span class="money">￥0.00</span></div><div class="item-list"><span class="static">实付款</span><span class="money">￥9.90</span></div></div>';
                        ;

                    $('#orderId').text(iRet.order_num);
                    $('#orderTime').text(iRet.create_time);

                    $('.commodity_wrap').click(function(event) {
                        location.href = 'http://www.xinyihezi.com/wallet/gift/addr/edit?order_id=EDE763E4AA5B2301FE8712A7AA369C3EB828C29AA9C405215201101A5E151030AE23A2E3FFA8BDCB6E0AFB435C66C2BC&address_id=148774';
                    });

                } else {}
            };

        return {
            showGoodsListData: showGoodsListData,
            showKeyListData: showKeyListData,
            showOrderConfirmData: showOrderConfirmData,
            showDefaultAddr: showDefaultAddr
        };
    }
);

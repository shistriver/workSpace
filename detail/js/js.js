/* 
 * @Author: guixin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-04-11 17:37:58
 */
//'use strict';
$(function() {
            var 
                goodid = location.href.substring(location.href.lastIndexOf('/') + 1).match(/^[0-9]*/)[0],//商品id
                btnFlag = null;//标记刚点击的是我想要还是送给他，默认为空
            //////////////////////////【页面初始化 开始】//////////////////////////////////////////////
            if (navigator.userAgent.match(/android/i)) { //修改Android手机样式
                $('.tip_red').addClass('tip_for_andriod');
            }
            //alert(getUrlParameter('show_invite'));
            if (getUrlParameter('show_invite') == '1') {
                $('#download').show();
                $('.event').css('paddingTop', '15vw');
            } else {
                $('#download').remove();
            }
            $('#download').on('click', '.open', function(event) {
                location.href = 'http://app.xinyihezi.com:8881/download/html/index.html';
            });
            $('#download').on('click', '.close', function(event) {
                $(this).parent('#download').remove();
                $('.event').css('paddingTop', '0');
            });


            //////////////////////////【页面初始化 结束】//////////////////////////////////////////////
            //////////////////////////【选择商品规格 开始】//////////////////////////////////////////////
            $('.chosed_box').click(function(event) {
                showChosedBox($('.choose_box').height(), 'show');
            });

            $('.choose_area .close,.full_grey').click(function(event) {
                showChosedBox(0, 'hide');
            });

            $('.choose_area .choose_btn').click(function(event) {
                if (!$('.tag_wrap .tag_list li').hasClass('chosed')){//如果没选规格
                    warnTip('请选择商品规格~');
                }else{
                    showChosedBox(0, 'hide');
                    if (btnFlag == 'iwant') {
                        isInstalled('iwant');
                    } else if (btnFlag == 'tota') {
                        isInstalled('tota');
                    }
                }
                
            });

            $('.chosed_box .chosed').html($('.choose_area li.chosed').html()); 
            $('.choose_box .chosed_txt i').html($('.choose_area li.chosed').html());

                function showChosedBox(iH, showFlag) {
                    $('.choose_box').animate({
                        bottom: iH
                    }, 200);
                    if (showFlag == 'show') {
                        $('.full_grey').fadeIn();
                    } else {
                        $('.full_grey').fadeOut();
                    }
                }
                //////////////////////////【选择商品规格 结束】//////////////////////////////////////////////
                var storeCon = $('#store').html();
                var setIn = setInterval(getStore, 100);

                function getStore() {
                    if (storeCon) {
                        if ('0' == storeCon) { //库存为0时进行的一系列操作
                            $('.want .iwant,.want .tota,.tip_red').addClass('bg_grey');
                            $('.want .iwant,.want .tota').unbind('click');
                        } else {
                            $('.want .iwant').bind('click', function(event) {
                                btnFlag = 'iwant';
                                isInstalled(btnFlag);
                            });

                            $('.want .tota').bind('click', function(event) {
                                btnFlag = 'tota';
                                isInstalled(btnFlag);
                            });
                        }
                        clearInterval(setIn);
                        return;
                    }
                    storeCon = $('#store').html();
                };
                ///////////////////////////【我想要 送给Ta S】///////////////////////////////////////////////
                function isInstalled(btnFlag) {
                    var
                        tagId = $('.tag_wrap .tag_list .chosed').index(), //货品标签id
                        productNum = $("#goodsNum").val(), //货品数量
                        goodsId = goodid; //商品id
                    if (!$('.tag_wrap .tag_list li').hasClass('chosed')) { //如果多个规格中一个都没选，去选去
                        showChosedBox($('.choose_box').height(), 'show');
                    } else {
                        if(btnFlag == 'iwant'){
                            location.href = '../../wx-xyhz/orderConfirml.html?tagId=' + tagId + '&productNum=' + productNum + '&goodsId=' + goodsId;
                        }else if(btnFlag == 'tota'){//order_type值 0 送礼，1凑份子，2自买
                            location.href = '../../wx-xyhz/orderConfirml.html?tagId=' + tagId + '&productNum=' + productNum + '&goodsId=' + goodsId + '&order_type=0';
                        }
                    }
                };

                $('#fuceng').click(function(event) {
                    $(this).hide();
                });

                function is_weixin() { //判断是否在微信中 
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        return true;
                    } else {
                        return false;
                    }
                };


                (function() { //返回顶部
                    var speed = 300;
                    var win_h = $(window).height(); //窗口高度  不用等所有内容加载完毕后就可获得
                    $(window).scroll(function(event) {
                        var st = $(window).scrollTop();
                        if (st > win_h) {
                            $('#to_top').stop().animate({
                                bottom: '66px',
                                opacity: 1
                            }, speed);
                        } else {
                            $('#to_top').stop().animate({
                                bottom: '-40px',
                                opacity: 0
                            }, speed);
                        }
                    });
                    $('#to_top').click(function(event) {
                        $('html,body').stop().animate({
                            scrollTop: 0
                        }, speed);
                    });
                })();


                ///////////////////////////【我想要 送给Ta E】///////////////////////////////////////////////

                function getUrlParameter(sParam) {
                    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                        sURLVariables = sPageURL.split('&'),
                        sParameterName,
                        i;
                    for (i = 0; i < sURLVariables.length; i++) {
                        sParameterName = sURLVariables[i].split('=');
                        if (sParameterName[0] === sParam) {
                            return sParameterName[1] === undefined ? true : sParameterName[1];
                        }
                    }
                };

                function warnTip(maxNum) {
                    var warn = '';
                    if (isNaN(maxNum)) {
                        warn = '<p>' + maxNum + '</p>';
                    } else {
                        warn = '<p>范围是：1~' + maxNum + '</p>';
                    }

                    if (!$('.Warning').length) {

                        $('body').append('<div class="Warning">' + warn + '</div>');
                    } else {
                        $('.Warning').html(warn);
                    }
                    $('.Warning').show().delay(1000).fadeOut();
                }
            });


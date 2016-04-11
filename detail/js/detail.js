/* 
 * @Author: guixin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-04-11 17:26:59
 */
//'use strict';
    //////////////////////////【页面初始化 开始】//////////////////////////////////////////////
    var 
        goodid = location.href.substring(location.href.lastIndexOf('/') + 1).match(/^[0-9]*/)[0],
        goods_detail_url = 'http://test.xinyihezi.com:8888/good/?goodid=' + goodid;

    loadDetailData(goods_detail_url);
    //载入页面数据
    function loadDetailData(goods_detail_url){
        $.ajax({
            url: goods_detail_url,
            type: 'GET',
            dataType: 'json',
            timeout: 6000,
            success: showGoodsDetailData //成功执行方法    
        });
    }
        
    function showGoodsDetailData(tt) {
             
        var rotation_images_len = tt.data.rotation_images.length;
        //有数据的话清空
        if($('#slideBox .bd ul').length>0){
            $('#slideBox .bd').html('<ul></ul>');
        }
        for (var i = 0; i < rotation_images_len; i++) {
            var nextimghtml = '<li><a class="pic"href="#"><img src="' + tt.data.rotation_images[i] + '" /></a></li>';
            $('#slideBox .bd ul').html($('#slideBox .bd ul').html() + nextimghtml);
        }
        if($('#slideBox .hd ul').length>0){
            $('#slideBox .hd').html('<ul></ul>');
        }
        //商品名称描述
        $('.buy_area .fn').html(tt.data.name);
        
        //////////////title////////////////////////////////
            //需要jQuery
            var $body = $('body');
            document.title=tt.data.name; 
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="http://7xlen1.com2.z0.glb.qiniucdn.com/favicon.ico"></iframe>');
            $iframe.on('load',function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
            //////////////////////////////////////////////
        //规格列表和标签列表的长度
        var products_len = tt.data.products.length;
        var label_list_len = tt.data.label_list.length;

        //选择商品图片预览
        var imgs = [];

        //价格
        var prices = {
            a: [],
            z: [],
            f: []
        };
        //parseFloat(tt.data.products[0].p_price).toFixed(2);
        for (var i = 0; i < products_len; i++) {
            prices.a[i] = parseFloat(tt.data.products[i].p_price).toFixed(2);
            prices.z[i] = prices.a[i].split('.')[0];
            prices.f[i] = prices.a[i].split('.')[1];
            imgs.push(tt.data.products[i].image_url);
        }
        //所有规格中价格最低的商品【初始化页面】 价格(原价、现价)、运费、热销标签
        var min_price = prices.a[0];
        var min_price_old = tt.data.products[0].price;
        var min_special_price_text = tt.data.products[0].special_price_text;
        var min_freight = tt.data.products[0].freight;
        for (var i = 0; i < products_len; i++) {
            if (min_price > prices.a[i]) {
                min_price = prices.a[i];
                min_price_old = tt.data.products[i].price;
                min_special_price_text = tt.data.products[i].special_price_text;
                min_freight = tt.data.products[0].freight;
            }
        }

        var store = 0;
        for (var i = 0; i < products_len; i++) {
            store += parseInt(tt.data.products[i].store);
        }
        //清空store
        if($('#store').html()){
            $('#store').html('');
        }
        $('#store').html(store);
        var setSpecialPriceTag = function(tag) { //限时促销标签
            switch (tag) {
                case '':
                    $('.tip_red').remove();
                    break;
                default:
                    $('.tip_red').html(tag);
                    break;
            }
        }
        setSpecialPriceTag(min_special_price_text);
        $('.buy_area .price_wrap .price b').html(min_price.split('.')[0]);
        $('.buy_area .price_wrap i.f').html('.' + min_price.split('.')[1]);
        $('.choose_area .price b').html(min_price.split('.')[0]);
        $('.choose_area .price i.f').html('.' + min_price.split('.')[1]);
        $('.buy_area .price_wrap .price_old span').html(min_price_old);
        $('.choose_area .image img').attr('src', imgs[0]);
        //$('.buy_area .tip_red').
        //限时促销标签

        //快递费、送出和收藏数目
        $('.buy_area .express_wrap .left i').html(min_freight);
        $('.choose_area .express  i').html(min_freight);
        $('.buy_area .express_wrap .center i').html(tt.data.sale_count);
        $('.buy_area .express_wrap .right i').html(tt.data.like_count);
        //第三方
        try{
            if(tt.data.store_name==''){

            }else{
               $('.service_wrap .three i').html(tt.data.store_name); 
            }
            
        }catch(e){}
        
        //选择标题
        var choose_tit = (function() {
            for (var p in tt.data.products[0].spec) {
                return p;
            }
        })();
        $('.chosed_box .chosed').html(choose_tit);

        //规格列表
        //清空
        if($('.choose_area .tag_list li').length>0){
            $('.choose_area .tag_list').html('');
        }
        for (var i = 0; i < products_len; i++) {
            var products_next_html = $('<li>' + tt.data.products[i].spec[choose_tit] + '</li>');
            products_next_html.appendTo('.choose_area .tag_list');
        }

        //标签列表
        //清空
        if($('.buy_area .tag_wrap .tag_list li').length>0){
            $('.buy_area .tag_wrap .tag_list').html('');
        }
        for (var i = 0; i < label_list_len; i++) {
            var label_list_next_html = $('<li>' + tt.data.label_list[i].label_name + '</li>');
            label_list_next_html.appendTo('.buy_area .tag_wrap .tag_list');
        }

        //商品图片展示
        //有数据的话清空
        if($('.img_list img').length>0){
            $('.img_list').html('');
        }
        $('.img_list').html(tt.data.description);
        //
        $('.chosed_txt span').html('未选择');
        $('.chosed_txt i').html('');

        var maxNum = 0;
        //注册规格选择点击事件
        if(products_len == 1){
            chooseEve(0, $('.choose_box .tag_list li'));
        }else{
            $('.choose_box .tag_list').unbind('click').on('click', 'li', function(event) {
                var 
                    index = $(this).index(),
                    $curLi = $(this);
                chooseEve(index, $curLi);
            });
        }

       function chooseEve(index, $curLi){
            maxNum = tt.data.products[index].store;
            $curLi.addClass('chosed').siblings().removeClass('chosed');
            $('.buy_area .chosed_wrap .static,.choose_area .chosed_txt span').html('已选择：');
            $('.chosed_box .chosed,.choose_box .chosed_txt i').html($curLi.html());
            $('.choose_area .price b').html(prices.z[index]);
            $('.choose_area .price i.f').html('.' + prices.f[index]);
            $('.buy_area .price_wrap .price b').html(prices.z[index]);
            $('.buy_area .price_wrap i.f').html('.' + prices.f[index]);
            $('choose_area .image img').attr('src', imgs[index]);
            $('.buy_area .price_wrap .price_old span').html(tt.data.products[index].price);
            $('.buy_area .express_wrap .left i').html(tt.data.products[index].freight);
            $('.choose_area .express i').html(tt.data.products[index].freight);
            setSpecialPriceTag(tt.data.products[index].special_price_text);
       }

        //轮播
        TouchSlide({
            slideCell: "#slideBox",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "leftLoop",
            autoPage: true, //自动分页
            autoPlay: true, //自动播放
            interTime: 4000
        });
        //相关商品列表请求链接label
        try{
            var label = tt.data.label_list[0].label_id;
            $('#labelid').html(label);
        }catch(e){
            $('#more').remove();
        }

        $('#goodsAdd').on('click', function(){
            var 
                isChosed = $('.tag_list li').hasClass('chosed');
            if(isChosed){
                console.log(maxNum);
                numAdd(maxNum);
            }else{
                warnTip('请选择商品规格~');
            }
        });

        $('#goodsDec').on('click', function(){
            var 
                isChosed = $('.tag_list li').hasClass('chosed');
            if(isChosed){
                 numDec();
            }else{
                warnTip('请选择商品规格~');
            }
           
        });

        //商品数量增减
        var btns = ['url(../img/ic_shuliang_1.png)','url(../img/ic_shuliang_2.png)','url(../img/ic_shuliang_3.png)','url(../img/ic_shuliang_4.png)'];
        
        function warnTip(maxNum){
            var warn = '';

            if(isNaN(maxNum)){
                warn = '<p>'+maxNum+'</p>';
            }else{
                warn = '<p>范围是：1~'+maxNum+'</p>';
            }
            
            if(!$('.Warning').length){

               $('body').append('<div class="Warning">' + warn + '</div>');
            }else{
               $('.Warning').html(warn); 
            }
            $('.Warning').show().delay(1000).fadeOut(); 
        }
        
        $("#goodsNum").keyup(function(){
            if(isNaN($(this).val()) || parseInt($(this).val())<1 || parseInt($(this).val()) > maxNum){
                warnTip(maxNum);
            }
            if(isNaN($(this).val()) || parseInt($(this).val())<=1) {
                $(this).val("1");
                $('.reduce-btn').css({'background-image': btns[1]});
                $('.plus-btn').css({'background-image': btns[2]});
                return;
            }else if(parseInt($(this).val()) >= maxNum){
                $(this).val(maxNum);
                $('.reduce-btn').css({'background-image': btns[0]});
                $('.plus-btn').css({'background-image': btns[3]});
                return;
            }else{
                $('.reduce-btn').css({'background-image': btns[0]});
                $('.plus-btn').css({'background-image': btns[2]});
            }
        });

        /*商品数量+1*/
        function numAdd(maxNum){
            var curr_num = $('#goodsNum').val();
            var num_add = parseInt(curr_num);
            num_add++;
            if(num_add == maxNum){
                $('.plus-btn').css({'background-image':btns[3]});
            }else if(num_add > maxNum){
                warnTip(maxNum);
                num_add = maxNum;
            }else{
                $('.reduce-btn').css({'background-image': btns[0]});
            }
            $('#goodsNum').val(num_add);

        }

        /*商品数量-1*/
        function numDec(){
            var curr_num = $('#goodsNum').val();
            var num_dec = parseInt(curr_num);
            num_dec--;
            if(num_dec == 1){
                $('.reduce-btn').css({'background-image':btns[1]});
            }else if(num_dec < 1){
                warnTip(maxNum);
                num_dec = 1;
            }else{
                $('.plus-btn').css({'background-image':btns[2]});
            }
            $('#goodsNum').val(num_dec);

        }
    };


    //////////////////////////【页面初始化 结束】//////////////////////////////////////////////
    
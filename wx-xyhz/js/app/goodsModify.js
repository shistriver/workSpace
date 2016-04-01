/**
 * Created by xyhz on 2016/3/31.
 */
define(['jquery'],function($) {
    //商品增加减少
    var goodsModify = function(){
        var btns = ['url(img/ic_shuliang_1.png)','url(img/ic_shuliang_2.png)','url(img/ic_shuliang_3.png)','url(img/ic_shuliang_4.png)'];
        console.log(btns[3])
        var warn = '<div class="Warning"><p>范围是：1~178</p></div>';
        $('body').append(warn);
        $("#goodsNum").keyup(function(){
            if(isNaN($(this).val()) || parseInt($(this).val())<1 || parseInt($(this).val()) >10){
                $('.Warning').show().delay(1000).fadeOut();
            }
            if(isNaN($(this).val()) || parseInt($(this).val())<=1) {
                $(this).val("1");
                $('.reduce-btn').css({'background-image': btns[1]});
                $('.plus-btn').css({'background-image': btns[2]});
                return;
            }else if(parseInt($(this).val()) >= 10){
                $(this).val("10");
                $('.reduce-btn').css({'background-image': btns[0]});
                $('.plus-btn').css({'background-image': btns[3]});
                return;
            }else{
                $('.reduce-btn').css({'background-image': btns[0]});
                $('.plus-btn').css({'background-image': btns[2]});
            }
        });

        $('#goodsAdd').on('click', function(){
            numAdd();
        });
        $('#goodsDec').on('click', function(){
            numDec();
        });
        /*商品数量+1*/
        function numAdd(){
            var curr_num = $('#goodsNum').val();
            var num_add = parseInt(curr_num);
            num_add++;
            if(num_add == 10){
                $('.plus-btn').css({'background-image':btns[3]});
            }else if(num_add > 10){
                $('.Warning').show().delay(1000).fadeOut();
                num_add = 10;
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
                $('.Warning').show().delay(1000).fadeOut();
                num_dec = 1;
            }else{
                $('.plus-btn').css({'background-image':btns[2]});
            }
            $('#goodsNum').val(num_dec);

        }
    }
    return {
        goodsModify:goodsModify
    }
});
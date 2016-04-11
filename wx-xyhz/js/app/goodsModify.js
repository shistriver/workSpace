/**
 * Created by xyhz on 2016/3/31.
 */
define(['jquery'], function($) {

    var
        btns = ['url(img/ic_shuliang_1.png)', 'url(img/ic_shuliang_2.png)', 'url(img/ic_shuliang_3.png)', 'url(img/ic_shuliang_4.png)'],
        numAdd = function(maxNum) {
            maxNum = parseInt(maxNum);
            //商品增加
            var curr_num = $('#goodsNum').val();
            var num_add = parseInt(curr_num);
            num_add++;
            if (num_add == maxNum) {
                $('.plus-btn').css({
                    'background-image': btns[3]
                });
            } else if (num_add > maxNum) {
                warnTip(maxNum);
                num_add = maxNum;
            } else {
                $('.reduce-btn').css({
                    'background-image': btns[0]
                });
            }
            $('#goodsNum').val(num_add);
            $('.taste_wrap .number i').html(num_add);
            return num_add;
        },

        keyNum = function(maxNum) {
            maxNum = parseInt(maxNum);
            var inputVal = $('#goodsNum').val();
            if (inputVal == '' || isNaN(inputVal) || parseInt(inputVal) < 1 || parseInt(inputVal) > maxNum) {
                warnTip(maxNum);
                inputVal = 1; //非法则重置为1
            } else if (isNaN(inputVal) || parseInt(inputVal) == 1) {
                $('#goodsNum').val("1");
                $('.reduce-btn').css({
                    'background-image': btns[1]
                });
                $('.plus-btn').css({
                    'background-image': btns[2]
                });
            } else if (parseInt(inputVal) == maxNum) {
                $('#goodsNum').val(maxNum);
                $('.reduce-btn').css({
                    'background-image': btns[0]
                });
                $('.plus-btn').css({
                    'background-image': btns[3]
                });
            } else {
                $('.reduce-btn').css({
                    'background-image': btns[0]
                });
                $('.plus-btn').css({
                    'background-image': btns[2]
                });
            }

            $('.taste_wrap .number i').html(inputVal);
            $('#goodsNum').val(inputVal);
            return inputVal;
        },

        numDec = function(maxNum) {
            maxNum = parseInt(maxNum);
            /*商品数量-1*/
            var curr_num = $('#goodsNum').val();
            var num_dec = parseInt(curr_num);
            num_dec--;
            if (num_dec == 1) {
                $('.reduce-btn').css({
                    'background-image': btns[1]
                });
            } else if (num_dec < 1) {
                warnTip(maxNum);
                num_dec = 1;
            } else {
                $('.plus-btn').css({
                    'background-image': btns[2]
                });
            }
            $('#goodsNum').val(num_dec);
            $('.taste_wrap .number i').html(num_dec);
            return num_dec;
        };

    function warnTip(maxNum) {
        var warn = '<div class="Warning"><p>范围是：1~' + maxNum + '</p></div>';
        if ($('.Warning').length > 0) {
            $('.Warning').find('p').html('范围是：1~' + maxNum).end()
                .show().delay(1000).fadeOut();
        } else {
            $('body').append(warn);
            $('.Warning').show().delay(1000).fadeOut();
        }
    }

    return {
        numAdd: numAdd,
        numDec: numDec,
        keyNum: keyNum
    }
});
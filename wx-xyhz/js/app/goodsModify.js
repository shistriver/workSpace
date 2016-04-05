/**
 * Created by xyhz on 2016/3/31.
 */
define(['jquery'], function($) {
    
    var btns = ['url(img/ic_shuliang_1.png)', 'url(img/ic_shuliang_2.png)', 'url(img/ic_shuliang_3.png)', 'url(img/ic_shuliang_4.png)'],
        warn = '<div class="Warning"><p>范围是：1~1</p></div>',
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
                $('.Warning').text('范围是：1~' + maxNum).show().delay(1000).fadeOut();
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
            $('#goodsNum').keyup(function() {
                if (isNaN($(this).val()) || parseInt($(this).val()) < 1 || parseInt($(this).val()) > maxNum) {
                     $('.Warning').text('范围是：1~' + maxNum).show().delay(1000).fadeOut();
                } else if (isNaN($(this).val()) || parseInt($(this).val()) == 1) {
                    $(this).val("1");
                    $('.reduce-btn').css({
                        'background-image': btns[1]
                    });
                    $('.plus-btn').css({
                        'background-image': btns[2]
                    });
                    return;
                } else if (parseInt($(this).val()) == maxNum) {
                    $(this).val(maxNum);
                    $('.reduce-btn').css({
                        'background-image': btns[0]
                    });
                    $('.plus-btn').css({
                        'background-image': btns[3]
                    });
                    return;
                } else {
                    $('.reduce-btn').css({
                        'background-image': btns[0]
                    });
                    $('.plus-btn').css({
                        'background-image': btns[2]
                    });
                }
            });
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
                $('.Warning').text('范围是：1~' + maxNum).show().delay(1000).fadeOut();
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
         $('body').append(warn);

    return {
        numAdd: numAdd,
        numDec: numDec,
        keyNum: keyNum
    }
});
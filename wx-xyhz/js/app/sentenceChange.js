/**
 * Created by xyhz on 2016/4/5.
 */
define([],
    function() {
        var
            sentence = function(){
                var str = [
                '我为你选了一份礼物，希望你会喜欢!',
                '打赏你的，还不领取谢恩!',
                '我就想跟你说一句：嘿，朋友，想你了……',
                '礼物是要送的，万一你正好喜欢呢~',
                '据说这是时下最流行的搭讪方式……',
                '不送个礼物怎么好意思说我想你！',
                '千挑万选才选出这个礼物，希望你会喜欢~',
                '想念的话，说不完，挂念的心，永不变。礼物虽小，心意满满！',
                '这份礼物，绝对适合high bigger的你！！',
                '礼物！拿好不谢！别问为什么，有钱任性！',
                '这个礼物承载了我对你满满的喜欢，你感受到了吗？',
                '省吃俭用给你送了份礼物，你可别说不喜欢~'
                ];
                var num = 0;
                $('#txt_area').attr('placeholder',str[num]);
                $('.bless_btn').on('click', function(){
                    num++;
                    if(num > str.length-1){
                        num = 0;
                    }
                    $('#txt_area').attr('placeholder',str[num]);
                })
            }
        return {
            sentence: sentence
        };
    }
);
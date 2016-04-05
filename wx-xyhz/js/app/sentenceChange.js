/**
 * Created by xyhz on 2016/4/5.
 */
define([],
    function() {
        var
            sentence = function(){
                var str = ['送给未知的他Ta','奉上祝福','不显示礼物价格'];
                var num = 0;
                $('#txt_area').val(str[num]);
                $('.bless_btn').on('click', function(){
                    num++;
                    if(num > str.length-1){
                        num = 0;
                    }
                    $('#txt_area').val(str[num]);
                })
            }
        return {
            sentence: sentence
        };
    }
);
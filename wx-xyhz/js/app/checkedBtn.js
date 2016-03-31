/**
 * Created by xyhz on 2016/3/31.
 */
define(['jquery'],function($) {
    var tabCheck = function(){
        //限制输入框字数
        $(id).bind('input propertychange', function() {
            $('#checkbox_c').on('click',function(){
                var check = $('#checkbox_c').is(':checked');
                if(check){
                    $('.gift_price .icon_price').css({"display":"inline-block"});
                }else{
                    $('.gift_price .icon_price').css({"display":"none"});
                }
            });
        });
    }
    return {
        tabCheck:tabCheck
    }
});
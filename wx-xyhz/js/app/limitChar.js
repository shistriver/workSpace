/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

define(['jquery'],function($) {
    var limit = function(id,booleanV,className,max){
        //限制输入框字数
        $(id).bind('input propertychange', function() {
            var curLength = $(this).val().length;
            if(curLength > max){
                var oValue = $(this).val().substr(0,max);
                $(this).val(oValue);
                if(booleanV){
                    $(className).html(max);
                }
            }else{
                if(booleanV){
                    $(className).text(curLength);
                }
            }
        });
    }
    return {
        limit:limit
    }
});




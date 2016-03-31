/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

define(['jquery'],function($) {
    var limit = function(id,booleanV,className,max){
        //限制输入框字数
        $(id).bind('input propertychange', function() {
            var num = Math.ceil(getLength($(id).val())/2);
            var oValue = $(this).val();
            if(oValue=='' || num >max){
                oValue = oValue.substr(0,max);
                if(booleanV){
                    $(className).html(70);
                }
                $(this).val(oValue);
            }else{
                $(this).val(oValue);
                if(booleanV){
                    $(className).html(num);
                }
            }
        });
        function getLength(str){
            return String(str).replace(/[^\x00-\xff]/g,'aa').length;
        }
    }
    return {
        limit:limit
    }
});




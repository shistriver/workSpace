/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

define(['jquery'],function($) {
    var limit = function(id,booleanV,className,max){
        //限制输入框字数
/*
        $(id).bind('input propertychange', function() {
            var oValue = $(this).val();
            var num = Math.ceil(getLength($(id).val())/2);
            console.log(num);
            if(oValue=='' || num > max){
                oValue = oValue.substr(0,max);
                $(this).val(oValue);
                if(booleanV){
                    $(className).html(max);
                }
                return;
            }else{
                if(booleanV){
                    $(className).html(num);
                }
            }
        });
*/
        $(id).bind('input propertychange', function() {
            var oValue = $(this).val();
            var num = Math.ceil(getLength(oValue)/2);
            console.log(num);
            if(oValue=='' || num > max){
                oValue = oValue.substr(0,max);
                $(this).val(oValue);
                if(booleanV){
                    $(className).html(max);
                }
                return;
            }else{
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




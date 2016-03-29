/**
 * Created by xyhz on 2016/3/29.
 */
$(function(){
    //限制输入框字数
    $('#wish_area').bind('input propertychange', function() {
        var num = Math.ceil(getLength($('#wish_area').val())/2);
        var oValue = $(this).val();
        if(oValue=='' || num >70){
            oValue = oValue.substr(0,70);
            $('.limit_min').html(70);
            $(this).val(oValue);
        }else{
            $(this).val(oValue);
            $('.limit_min').html(num);
        }
    });
    function getLength(str){
        return String(str).replace(/[^\x00-\xff]/g,'aa').length;
    }
})
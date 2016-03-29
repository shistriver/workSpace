/**
 * Created by xyhz on 2016/3/28.
 */
$(function(){
    $('#checkbox_c').on('click',function(){
        var check = $('#checkbox_c').is(':checked');
        if(check){
            $('.gift_price .icon_price').css({"display":"inline-block"});
        }else{
            $('.gift_price .icon_price').css({"display":"none"});
        }
    });
    //限制输入框字数
    $('#txt_area').bind('input propertychange', function() {
        var num = Math.ceil(getLength($('#txt_area').val())/2);
        var oValue = $(this).val();
        if(oValue=='' || num >10){
            oValue = oValue.substr(0,50);
            $(this).val(oValue);
        }
    });
    function getLength(str){
        return String(str).replace(/[^\x00-\xff]/g,'aa').length;
    }
})
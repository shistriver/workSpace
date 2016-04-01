/**
 * Created by xyhz on 2016/4/1.
 */
define(["jquery"],
    function($) {
        var
            tabBar = function() {
                var check_img = ['url(img/ic_pay_checked.png)','url(img/ic_pay_check.png)']
                /*$(className).on('click',function(){
                    var check = $(className).is(':checked');
                    if(check){
                        $(this).css({'background-image':check_img[0]});
                        $(this).attr("checked", true);
                    }else{
                        $(this).css({'background-image':check_img[1]});
                        $(this).attr("checked", false);
                    }
                });*/
                $('.item-list .pay_check_com').on('click',function(){
                    $(this).css({'background-image':check_img[0]}).parent().siblings().find('.pay_check_com').css({'background-image':check_img[1]})
                });
            };
        return {
            tabBar: tabBar
        };
    }
);
/**
 * Created by xyhz on 2016/4/1.
 */
define(["jquery"],
    function($) {
        var
            tabBar = function() {
                var check_img = ['url(img/ic_pay_checked.png)','url(img/ic_pay_check.png)']
                $('#payStyle .item-list').on('click',function(){
                    $(this).find('.pay_check_com').css({'background-image':check_img[0]}).parent().siblings().find('.pay_check_com').css({'background-image':check_img[1]})
                });
            };
        return {
            tabBar: tabBar
        };
    }
);
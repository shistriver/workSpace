/**
 * Created by xyhz on 2016/4/1.
 */
define(["jquery"],
    function($) {
        var
            tabBar = function(className,checked) {
                $('').is(':checked')
                $(":checkbox").attr("checked", true);
                var check_img = ['url(img/ic_pay_checked.png)','url(img/ic_pay_check.png)']



                /*var checked = checked;
                 var check_img = ['url(img/ic_pay_checked.png)','url(img/ic_pay_check.png)']
                 var check_img = ['url(img/ic_pay_checked.png)','url(img/ic_pay_check.png)']
                 $(className).on('click', function(){
                 if(checked){
                 $(this).css({'background-image':check_img[1]});
                 checked = false;
                 }else{
                 $(this).css({'background-image':check_img[0]});
                 checked = true;
                 }
                 })*/
            };

        return {
            tabBar: tabBar
        };
    }
);
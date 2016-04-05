/**
 * Created by xyhz on 2016/4/1.
 */
define(["jquery"],
    function($) {
        var
            tabBar = function() {
                $('#payStyle .item-list').on('click',function(){
                    var isChecked = $(this).find('.choose-ic').hasClass('pay_check');
                    if(isChecked){
                        $(this).find('.choose-ic').removeClass('pay_check');
                        $(this).find('.choose-ic').parent().siblings().find('.choose-ic').addClass('pay_check')

                    }else{
                        $(this).find('.choose-ic').addClass('pay_check');
                        $(this).find('.choose-ic').parent().siblings().find('.choose-ic').removeClass('pay_check')
                    }
                });
            };
        return {
            tabBar: tabBar
        };
    }
);
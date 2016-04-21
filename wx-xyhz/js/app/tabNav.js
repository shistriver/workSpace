/**
 * Created by xyhz on 2016/4/6.
 */
define([],
    function() {
        var
            tab_nav = function(navIndex){
                $('.chosed_wrap span').eq(navIndex).addClass('cur').siblings().removeClass('cur');
                $('.order-list').eq(navIndex).addClass('cur-ul').siblings().removeClass('cur-ul');
            };
        return {
            tab_nav: tab_nav
        };
    }
);
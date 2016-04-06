/**
 * Created by xyhz on 2016/4/6.
 */
define([],
    function() {
        var
            tab_nav = function(index,$curClass,listClass){
                $curClass.addClass('cur').siblings().removeClass('cur');
                $(listClass).eq(index).addClass('cur-ul').siblings().removeClass('cur-ul');
            };
        return {
            tab_nav: tab_nav
        };
    }
);
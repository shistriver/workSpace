/* 
 * @Author: xin
 * @Date:   2015-08-05 13:30:10
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-03-28 18:03:18
 */

//'use strict';
/////////////////////////////////////////////////////
        
        var ot_top=0;
         var setIn = setInterval(getLoadFlag, 1000);
         function getLoadFlag() {
             if ($('.chosed_area .chosed_wrap').html()) {
                ot_top=$('.chosed_wrap').offset().top;
                toNav(ot_top);
                clearInterval(setIn);
                return;
             }
         };
 
             $(window).scroll(function(event) {
                 var num = $(window).scrollTop();
                 if(ot_top==0)
                    return;
                 if (num >= ot_top && $('.chosed_area span').length > 1) {
                     $('.chosed_wrap').addClass('fixed');
                 } else {
                     $('.chosed_wrap').removeClass('fixed');
                 }
             });
             function toNav(ot_top) {
                 $('.chosed_wrap span').each(function(i, el) {
                     $(el).click(function(event) {
                       // ot_top=$('.chosed_wrap').offset().top;
                       // alert(ot_top);
                         $(window).scrollTop(ot_top);
                         $(this).addClass('cur').siblings('span').removeClass('cur');
                         $('ul.order-list:eq(' + i + ')').addClass('cur-ul').siblings('ul').removeClass('cur-ul');
                     });
                 });
             };
             
            

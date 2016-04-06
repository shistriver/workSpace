/**
 * Created by xyhz on 2016/4/6.
 */
(function(){
    require.config({
        paths: {
            'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min',
            'doDom': 'app/doDom',
            'jquery.cookie': 'lib/jquery.cookie',
            'config': 'app/config',
            'cookieCrud': 'app/cookieCrud',
            'beforeSend': 'app/beforeSend',
            'callback': 'app/callback',
            'dataService': 'app/dataService',
            'onScroll': 'app/onScroll',
            'tabNav': 'app/tabNav'
        }
    });
    require(['jquery','tabNav','config'],
        function($,tabNav) {
            $('.chosed_wrap span').click(function(){
                var index = $(this).index();
                var $curClass = $(this);
                tabNav.tab_nav(index,$curClass,'.order-list');
            });
        }
    );
})();
/*
 * @Author: xinyi
 * @Date:   2016-03-22 16:08:07
 * @Last Modified by:   xinyi
 * @Last Modified time: 2016-03-31 11:05:03
 */
(function() {
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
            'paging': 'app/paging',
            'onScroll': 'app/onScroll',
            'limitChar': 'app/limitChar',
            'checkedBtn': 'app/checkedBtn',
            'goodsModify': 'app/goodsModify',
            'tabSwitch': 'app/tabSwitch'
        }
	});
	require(['doDom', 'cookieCrud'],
		function(doDom,cookieCrud) {
            
            doDom.doDom(true);
		}
	);
    require(['limitChar'],
        function(limitChar) {
            limitChar.limit('#wish_area',true,'.limit_min',10);
        }
    );
    require(['limitChar','checkedBtn'],
        function(limitChar,checkedBtn) {
            checkedBtn.tabCheck;
            limitChar.limit('#txt_area',false,'',70);
        }
    );
    require(['goodsModify'],
        function(goodsModify) {
            goodsModify.goodsModify();
        }
    );
    require(['tabSwitch'],
        function(tabSwitch) {
            tabSwitch.tabBar();
        }
    );
})()
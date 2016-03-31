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
            'cookieCrud': 'app/cookieCrud',
            'myWish': 'app/myWish',
            'checkedBtn': 'app/checkedBtn'
        }
	});
	require(['doDom', 'cookieCrud'],
		function(doDom,cookieCrud) {
            cookieCrud.getCoo();
            cookieCrud.addCoo();
            cookieCrud.clearCoo();
            doDom.doDom();
		}
	);
    require(['app/limitChar'],
        function(myWish) {
            myWish.limit('#wish_area',true,'.limit_min',70);
        }
    );
    require(['app/limitChar','checkedBtn'],
        function(myWish,checkedBtn) {
            checkedBtn.tabCheck;
            myWish.limit('#txt_area',false,'',70);
        }
    );
})();
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
            'test': 'app/test'
		}
	});
	require(['doDom, test'],
		function(doDom,test) {
            test.fff();
//			doDom.doDom();
		}
	);
})();
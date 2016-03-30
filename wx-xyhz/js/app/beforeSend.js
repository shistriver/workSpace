/**
 * Created by guixin on 2016/3/29.
 */
//请求数据服务
require.config({
    paths: {
        'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'
    }
});
difine(['jquery'],
    function($) {
        var
            showGoodsListDataLoading = function() {
                $('#loader').show();
            };

        return {
            showGoodsListDataLoading: showGoodsListDataLoading
        };
    }
);
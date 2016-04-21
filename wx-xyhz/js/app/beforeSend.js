/**
 * Created by guixin on 2016/3/29.
 */
//请求数据之前显示loading

define(['jquery'],
    function($) {
        var
            showGoodsListDataLoading = function() {
                $('#loader').show();
            },

            showKeyListLoading = function(){
                $('#loadImg').show();
                $('.hs-area ul').hide();
            },

            showFullScreenLoadImg = function(){
                $('#fullScreenLoadImg').show();
            },

            showLoadImg = function(){
                $('#loadImg').fadeIn();
            };


        return {
            showGoodsListDataLoading: showGoodsListDataLoading,
            showKeyListLoading: showKeyListLoading,
            showLoadImg: showLoadImg,
            showFullScreenLoadImg: showFullScreenLoadImg
        };
    }
);
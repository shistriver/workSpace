/**
 * Created by xyhz on 2016/4/5.
 */
(function(){
    require.config({
        paths: {
            'jquery': 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min',
            'limitChar': 'app/limitChar',
            'checkedBtn': 'app/checkedBtn',
            'sentenceChange': 'app/sentenceChange'
        }
    });
    require(['jquery','checkedBtn','limitChar','sentenceChange'],
        function($,checkedBtn,limitChar,sentenceChange) {
            checkedBtn.tabCheck();
            limitChar.limit('#txt_area',false,null,70);
            sentenceChange.sentence();
        }
    );
})();
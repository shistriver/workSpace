/*
* @Author: xinyi
* @Date:   2016-03-22 16:08:07
* @Last Modified by:   xinyi
* @Last Modified time: 2016-03-24 18:55:27
*/

'use strict';
$(function() {
	//进行搜索操作
		function doSearch(key){
			var url = encodeURI('http://app.xinyihezi.com:8888/good/?search_type=1&name=' + key);
			console.log(key);
			pagingList(url);
		}
		
	//获取焦点
	$('.input-area input').focus(function(event) {
		$('.input-area').addClass('input-area-focus');
		$('.search-ret-area').hide();
		$('.hs-area').hide();
		showCooInHtml();//历史记录
	});

	//取消
	/**
	 * 如果当前页面不是热搜，显示热搜
	 * 如果是热搜，返回上一页
	 */
	$('.input-area .cancle').click(function(event) {
		// if($('.search-ret-area').is(":hidden") && $('.search-ret-area li').length > 0 ){
		// 	$('.input-area').removeClass('input-area-focus');
		// 	$('.search-ret-area').show();//商品列表
		// 	$('.hs-area').hide();//热搜
		// 	$('.history-area').hide();//搜索历史记录
		//}else 
		if($(".hs-area").is(":hidden")){
			$('.input-area').addClass('input-area-focus');
			$('.search-ret-area').hide();//商品列表
			$('.hs-area').show();//热搜
			$('.history-area').hide();//搜索历史记录
		}else{
			history.go(-1);
		}
	});
	

	//回车
	$('.input-area input').bind('keypress',function(event) {
		 if (event.keyCode == "13") {
            //回车执行查询
            var key=$.trim($(this).val());
            if(key.match(/\s+/) || key==''){
            	$('#statusTip').html('请输入有效的搜索内容').fadeIn(500).delay(1000).fadeOut(500);
            }else{
            	$('.hs-area').hide();
            	$('.history-area').hide();
            	$('.search-ret-area').show();
            	objCoo.addCoo(key);
            	doSearch(key);
            }
        }
	});

	//清空历史记录
	$('.history-area .clear').click(function(event) {
		objCoo.clearCoo();
		showCooInHtml();
	});

	//显示历史记录
	function showCooInHtml(){
		$('.history-area').fadeIn();
		var len=objCoo.getCoo().length;
		var cooData=objCoo.getCoo();
		if(len==0){//无搜索历史
			$('.history-area ul').hide();
			$('.history-no').show();
			$('.history-area .clear').hide();
		}else{//有
			var nexthtml='';
			if(len > 10){
				len = 10;
			}else{}
			for (var i = 0; i < len; i++) {
				nexthtml += '<li>' + cooData[i]+ '</li>';
			}
			$('.history-area ul').html(nexthtml).show();
			$('.history-no').hide();
			$('.history-area .clear').show();
		}
	}

	

	var pageIndex=1;
	var hotKeyUrl='http://app.xinyihezi.com:8888/good/?search_type=8';
	loadKeyList(hotKeyUrl+ '&page_size=9&page=' + pageIndex);

	$('.hs-area .change').click(function(event) {
		pageIndex++;

		var url= hotKeyUrl + '&page_size=9&page=' + pageIndex;
		loadKeyList(url);
	});

	function loadKeyList(url){
		$.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){
            	$('#loadImg').show();
            	$('.hs-area ul').hide();
            },
            success: showKeyListData, //成功执行方法
            complete:function(){
				$('.hs-area ul li').on('click', function(event) {
					var key = $(this).find('.txt').text();
					$('.hs-area').hide();
            		$('.history-area').hide();
            		$('.search-ret-area').show();
            		objCoo.addCoo(key);
					doSearch(key);
				});
            }  
        });

        

		//点选历史记录
		$('.history-area ul').on('click', 'li', function(event) {
			$('.history-area').hide();
            $('.history-area').hide();
            $('.search-ret-area').show();
			var key = $(this).text();
			doSearch(key);
		});
		//显示热搜列表
       function showKeyListData(ret){
       	if (ret.status == '0') {
       		if(pageIndex >= ret.data.label_count/9){
       			pageIndex=0;
       		}
       		var label=ret.data.label;
       		if(label==null || label.length==0){
       			$('.hs-area').hide();
       			$('#statusTip').html('没有了').fadeIn(500).delay(1000).fadeOut(500);
       		}else{
       			var len = label.length < 10 ? label.length : 10;
       			var nexthtml='';
       			for(var i=0;i<len;i++){
       				 nexthtml += '<li><span class="txt">'+label[i].hot_word+'</span>';
       				 nexthtml += label[i].label_info=='' ? '' : '<span class="tag" style="background-color:'+label[i].label_color+'">'+label[i].label_info+'</span></li>'
       			}
       			$('#loadImg').hide();
       			$('.hs-area ul').html(nexthtml).show();
       		}
       	}else{
       		$('.hs-area').hide();
       		$('#statusTip').html('没有了').fadeIn(500).delay(1000).fadeOut(500);
       	}
       }
	}

	
});
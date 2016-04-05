/**
 * Created by guixin on 2016/3/29.
 */
//cookie操作

define(['jquery', 'cookieCrud', 'beforeSend', 'callback', 'dataService', 'paging', 'config'],
	function($, cookieCrud, beforeSend, callback, dataService, paging, config) {

		var
			doDom = function(eee) {
				console.log(eee)

				//热搜
				var pageIndex = 1;
				var hotKeyUrl = 'http://app.xinyihezi.com:8888/good/?search_type=8';
				dataService.getData(hotKeyUrl + '&page_size=9&page=' + pageIndex, beforeSend.showKeyListLoading, callback.showKeyListData, null);
				$('.hs-area .change').click(function(event) {
					if (pageIndex >= config.label_count / 9) {
						pageIndex = 0;
					}
					pageIndex++;
					var url = hotKeyUrl + '&page_size=9&page=' + pageIndex;
					dataService.getData(url, beforeSend.showKeyListLoading, callback.showKeyListData, null)
					//loadKeyList(url);
				});

				//进行搜索操作
				function doSearch(key) {
					var url = encodeURI('http://app.xinyihezi.com:8888/good/?search_type=1&name=' + key);
					console.log(key);
					paging.pageGetData(url, beforeSend.showGoodsListDataLoading, callback.showGoodsListData);
				}

				//获取焦点
				$('.input-area input').focus(function(event) {
					$('.input-area').addClass('input-area-focus');
					$('.search-ret-area').hide();
					$('.search-ret-area .ui-fall').html('');
					config.loadFlag = false;
					config.pageIndex = 1;
					$('.hs-area').hide();
					showCooInHtml(); //历史记录
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
					if ($(".hs-area").is(":hidden")) {
						$('.input-area').addClass('input-area-focus');
						$('.search-ret-area').hide(); //商品列表
						$('.search-ret-area .ui-fall').html('');
						config.loadFlag = false;
						config.pageIndex = 1;
						$('.hs-area').show(); //热搜
						$('.history-area').hide(); //搜索历史记录
					} else {
						history.go(-1);
					}
				});


				//回车
				$('.input-area input').bind('keypress', function(event) {
					if (event.keyCode == "13") {
						//回车执行查询
						var key = $.trim($(this).val());
						if (key.match(/\s+/) || key == '') {
							$('#statusTip').html('请输入有效的搜索内容').fadeIn(500).delay(1000).fadeOut(500);
						} else {
							$('.hs-area').hide();
							$('.history-area').hide();
							$('.search-ret-area').show();
							cookieCrud.addCoo(key);
							doSearch(key);
						}
					}
				});

				//清空历史记录
				$('.history-area .clear').click(function(event) {
					cookieCrud.clearCoo();
					showCooInHtml();
				});

				//显示历史记录
				function showCooInHtml() {
					$('.history-area').fadeIn();
					var len = cookieCrud.getCoo().length;
					var cooData = cookieCrud.getCoo();
					if (len == 0) { //无搜索历史
						$('.history-area ul').hide();
						$('.history-no').show();
						$('.history-area .clear').hide();
					} else { //有
						var nexthtml = '';
						if (len > 10) {
							len = 10;
						} else {}
						for (var i = 0; i < len; i++) {
							nexthtml += '<li>' + cooData[i] + '</li>';
						}
						$('.history-area ul').html(nexthtml).show();
						$('.history-no').hide();
						$('.history-area .clear').show();
					}
				}
			};

		return {
			doDom: doDom
		};
	}
);
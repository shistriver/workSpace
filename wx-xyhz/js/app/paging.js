/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

define(['jquery', 'onScroll', 'dataService', 'callback', 'beforeSend'],
	function($, onScroll, dataService, beforeSend,callback) {
		var
			pageIndex = 1, // 当前页数，默认设为第 1 页  
			pageSize = 10, // 每页显示的数量
			pageGetData = function(id){
				var 
					iIntervalId = setInterval(function(){
						if (onScroll.isOnScroll) {
							id += id + '&page_size=' + pageSize + '&page=' + pageIndex
							if (dataService.getData(id, beforeSend.showGoodsListDataLoading, callback.showGoodsListData)) {
								pageIndex++;
							}else{
								clearInterval(iIntervalId);
							}
						} else {}
					}, 1000);
				
			};

		return {
			pageGetData: pageGetData
		};
	}
);
/**
 * Created by guixin on 2016/3/29.
 */
//分页
/**
 * 逻辑是这样的：
 * 1、如果满足滑到底部
 * @param  {[type]} onScroll    [description]
 * @param  {[type]} dataService [description]
 * @param  {[type]} config)     {		var			pageGetData [description]
 * @return {[type]}             [description]
 */
define(['jquery', 'onScroll', 'dataService', 'config'],
	function($, onScroll, dataService, config) {
		var
			pageGetData = function(id, beforeSendFn, callbackFn) {
				var
					iIntervalId = setInterval(function() {
						if(onScroll.isOnScroll()){
							if (config.pageIndex == 1 || config.loadFlag) {
								urlId = id + '&page_size=' + config.pageSize + '&page=' + config.pageIndex;
								dataService.getData(urlId, beforeSendFn, callbackFn);
								config.pageIndex++;
							} else {
								clearInterval(iIntervalId);
							}
						}else{}
						
						console.log('config.loadFlag:'+config.loadFlag + '<br>onScroll.isOnScroll():'+onScroll.isOnScroll());
					}, 1000);

			};

		return {
			pageGetData: pageGetData
		};
	}
);
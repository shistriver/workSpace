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
			pageGetData = function(id, beforeSendFn, callbackFn, isDataRight) {
				isDataRight = typeof(isDataRight) == "function" ? isDataRight : function() {return true;}; 

				getData(id, beforeSendFn, callbackFn);//定时器运行之前先请求一次，防止延时

				var
					iIntervalId = setInterval(function() {
						if (onScroll.isOnScroll() && isDataRight(config.pageIndex, config.pageSize)) {
							if (config.loadFlag) {
								getData(id, beforeSendFn, callbackFn);
							} else {
								clearInterval(iIntervalId);
							}
						} else {}

						//console.log('config.loadFlag:'+config.loadFlag + '<br>onScroll.isOnScroll():'+onScroll.isOnScroll());
					}, 1000);

				config.interval.push(iIntervalId);

				function getData(id, beforeSendFn, callbackFn){
					urlId = id + '&page_size=' + config.pageSize + '&page=' + config.pageIndex;
					dataService.getData(urlId, beforeSendFn, callbackFn);
					config.pageIndex++;
				}
			},
			pagePostData = function(id, beforeSendFn, callbackFn, data, isDataRight) {
				isDataRight = typeof(isDataRight) == "function" ? isDataRight : function() {return true;}; 

				postData(id, beforeSendFn, callbackFn, data);//定时器运行之前先请求一次，防止延时

				var
					iIntervalId = setInterval(function() {
						if (onScroll.isOnScroll() && isDataRight(config.pageIndex, config.pageSize)) {
							if (config.loadFlag) {
								postData(id, beforeSendFn, callbackFn, data);
							} else {
								clearInterval(iIntervalId);
							}
						} else {}

						//console.log('config.loadFlag:'+config.loadFlag + '<br>onScroll.isOnScroll():'+onScroll.isOnScroll());
					}, 1000);

				config.interval.push(iIntervalId);

				function postData(id, beforeSendFn, callbackFn, data){
					data.page_index = config.pageIndex;
					data.page_size = config.pageSize;
					dataService.postData(id, beforeSendFn, callbackFn, data);
					config.pageIndex++;
				}
			};

		return {
			pageGetData: pageGetData,
			pagePostData: pagePostData
		};
	}
);
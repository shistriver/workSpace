/**
 * Created by guixin on 2016/3/29.
 */
//分页

define(['jquery', 'onScroll', 'dataService', 'config'],
	function($, onScroll, dataService, config) {
		var
			pageGetData = function(id, beforeSendFn, callbackFn) {
				var
					iIntervalId = setInterval(function() {
						if ((config.pageIndex == 1 || onScroll.isOnScroll()) && config.loadFlag) {
							urlId = id + '&page_size=' + config.pageSize + '&page=' + config.pageIndex;
							dataService.getData(urlId, beforeSendFn, callbackFn);
							config.pageIndex++;
						} else {
							clearInterval(iIntervalId);
						}
						console.log(config.loadFlag + 'gggg'+onScroll.isOnScroll());
					}, 1000);

			};

		return {
			pageGetData: pageGetData
		};
	}
);
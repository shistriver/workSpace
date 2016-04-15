/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

define(['jquery'],
  function($) {

    var
      baseUrl = 'http://test.xinyihezi.com', //默认域名      正式服: http://www.xinyihezi.com
      // baseUrl = 'http://www.xinyihezi.com', //默认域名      正式服: http://www.xinyihezi.com
      baseUrlWap = 'http://test.xinyihezi.com', //默认域名      正式服: http://wap.xinyihezi.com
      // baseUrlWap = 'http://wap.xinyihezi.com', //默认域名      正式服: http://wap.xinyihezi.com
      baseUrlApp = 'http://test.xinyihezi.com', //默认域名    正式服: http://app.xinyihezi.com
      // baseUrlApp = 'http://app.xinyihezi.com', //默认域名    正式服: http://app.xinyihezi.com

      baseUrlCpp = baseUrlApp + ':8888', //c++服务， 正式服为 baseUrlApp
      baseUrlPython = baseUrl, // python服务
      baseUrlPage = baseUrlApp + "/static/detail/html", //页面协议域名端口号  商品详情地址前缀 test
      //baseUrlPage = baseUrlApp + ":8881", //页面协议域名端口号   商品详情地址前缀 online
      label_count = 0,
      loadFlag = true, //分页需要，true表示当前可以继续加载
      pageIndex = 1, // 当前页数，默认设为第 1 页 
      pageSize = 10, // 每页显示的数量
      gift_type = 0, //礼物类型：0收到，1送出，2凑份子
      btnLock = 0; //按钮锁 默认0表示没锁
    timestamp = function(str) { //时间戳
        var str = parseInt(str) * 1000;
        var date = new Date(str);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        var time = Y + M + D + h + m + s;
        return time;
      },

      orderStatus = function(order_status, gift_type) {
        var
          btn = '<button>订单详情</button>',
          btns = '';

        if (order_status == 0) { //0：待支付
          btns = '<button class="color-red" id="toPay">立即付款</button>';
        } else if (order_status == 1) { //1：待送出
          btns = '<button class="color-red" id="toGive">立即送出</button>';
        } else if (order_status == 2) { //2：待发货
          btns = '';
        } else if (order_status == 3) { //3：待签收
          btns = '';
        } else if (order_status == 4) { //4：已发货/以送达
          if (gift_type == 1) { //已送达 送礼
            btns = '';
          } else { //已发货 自买 凑份子
            btns = '';
          }
        } else if (order_status == 5) { //5：订单已完成
          btns = '';
        } else if (order_status == 6) { //6：订单已取消
          btns = '';
        } else if (order_status == 7) { //7：退款
          btns = '';
        } else if (order_status == 8) { //8：凑份子中
          btns = '<button class="color-red" id="toPool">找人帮付</button><button id="toPay">立即付款</button>';
        } else if (order_status == 9) { //9：活动订单
          btns = '';
        }
        btns += btn;
        return btns;
      },

      getUrlPara = function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
          }
        }
      },

      isWeixin = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      },

      jsonToKeyvalue = function(json) { //作用相当于ajax请求参数放到请求地址后面
        var keyValue = '';
        for (key in json) {
          keyValue += '&' + key + '=' + json[key];
        }
        return keyValue.substring(1); //首字母不是'&'
      },

      statusTip = '<button id="statusTip" style="position:fixed;z-index:10000;left:50%;top:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);width:60%;height:60px;background-color:rgba(0,0,0,.8);color:#fff;font-size:16px;border-radius:5px;display: none"></button>';

    $(statusTip).appendTo('body');

    return {
      baseUrlCpp: baseUrlCpp,
      baseUrlPython: baseUrlPython,
      baseUrlPage: baseUrlPage,
      label_count: label_count,
      loadFlag: loadFlag,
      pageIndex: pageIndex,
      pageSize: pageSize,
      timestamp: timestamp,
      gift_type: gift_type,
      orderStatus: orderStatus,
      getUrlPara: getUrlPara,
      isWeixin: isWeixin,
      baseUrl: baseUrl,
      btnLock: btnLock,
      jsonToKeyvalue: jsonToKeyvalue
    };


  }
);
/**
 * Created by guixin on 2016/3/29.
 */
//获取链接中search字段的值

define([],
      function() {
            var
                  baseUrlCpp = 'http://test.xinyihezi.com:8888',//c++服务
                  baseUrlPython = 'http://test.xinyihezi.com',//python服务
                  baseUrlPage = 'http://app.xinyihezi.com:8881',//页面协议域名端口号
                  label_count = 0,
                  loadFlag = true,//分页需要，true表示当前可以继续加载
                  pageIndex = 1, // 当前页数，默认设为第 1 页 
                  pageSize = 10, // 每页显示的数量
                  gift_type = 0, //礼物类型：0收到，1送出，2凑份子
                  timestamp = function(str){//时间戳
                      var str = parseInt(str) * 1000;
                      var date = new Date(str);
                      var Y = date.getFullYear() + '-';
                      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                      var D = date.getDate() + ' ';
                      var h = date.getHours() + ':';
                      var m = date.getMinutes() + ':';
                      var s = date.getSeconds();
                      var time = Y+M+D+h+m+s;
                      return time;
                  },
                  orderStatus = function(order_status, gift_type) {
                    var
                      btn = '<button>订单详情</button><button class="color-red">立即付款</button>',
                      btns = '';

                    if (order_status == 0) { //0：待支付
                      btns = '<button class="color-red">立即付款</button>';
                    } else if (order_status == 1) { //1：待送出
                      btns = '<button class="color-red">立即送出</button>';
                    } else if (order_status == 2) { //2：待发货
                      btns = '<button class="color-red">提醒发货</button>';
                    } else if (order_status == 3) { //3：待签收
                      btns = '<button class="color-red">确认收货</button>';
                    } else if (order_status == 4) { //4：已发货/以送达
                      if (gift_type == 1) { //已送达 送礼
                        btns = '';
                      } else { //已发货 自买 凑份子
                        btns = '<button class="color-red">确认收货</button>';
                      }
                    } else if (order_status == 5) { //5：订单已完成
                      btns = '';
                    } else if (order_status == 6) { //6：订单已取消
                      btn = '<button>删除订单</button>';
                      btns = '';
                    } else if (order_status == 7) { //7：退款
                      btns = '';
                    } else if (order_status == 8) { //8：凑份子中
                      btns = '<button class="color-red">找人帮付</button><button>自己支付</button><button>取消订单</button>';
                    } else if (order_status == 9) { //9：活动订单
                      btns = '';
                    }
                    btns += btn;
                    return btns;
                  };
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
                  orderStatus: orderStatus
            };
      }
);

/**
 * 商品信获取、商品初始化、商品选择
 * @param {Array} groups 分组内容
 * @param {Array} products 商品内容
 * @module.exports = Merchs;
 */
// 'http://9d37b373.ngrok.io'
var Merchs = function () {
  this.customerId = undefined;
  this.products = [];
  this.checkId = opId;
  this.rightItem = {};
  this.leftItem = {};
  this.activeClickItem = undefined;
  this.pay = undefined;
  this.source_flag = 2;
  this.orderId = undefined;
  this.order_type = 4;
  this.payType = payType;
  this.vm_id = vmId;
  this.winnerItem = undefined;
  this.telPhone = undefined;
  this.hostname = MquJS.getDomain();
}

Merchs.prototype.getAppId = function () {
  var that = this;
  $('body').append(loading)
  $.ajax({
    type: 'get',
    url: that.hostname + '/m/consumer/getAppId.jsonp?vmId=' + that.vm_id + '&payType=' + payType,
    jsonp: 'callback',
    dataType: 'jsonp',
    success: function (response) {
      if (response.code == 0) {
        //运营商id
        that.customerId = MquJS.getCookie(response.result.appId);
        that.getMerch();
        that.getVmAndProductById();
      } else {
        loading.remove()
        toast.set(response.message);
      }
    },
    error: function () {
      loading.remove()
      no_wifi.render();
    }
  });
}

Merchs.prototype.getMerch = function () {
  var that = this;
  var questData = {
    vmId: that.vm_id,
    payType: payType
  }
  $.ajax({
    type: 'post',
    url: that.hostname + '/m/consumer/getPkProduct',
    data: JSON.stringify(questData),
    contentType: "application/json;charset=utf-8",
    dataType: 'json',
    success: function (response) {
      loading.remove()
      if (response.code == 0) {
        $('body').append(PK_body)
        that.responseData = response.result;

        response.result.products.sort(sortDiscountPriced)
        that.products = response.result.products;

        that.initPkItem();
        that.bindClick();
      } else {
        toast.set(response.message)
      }
    },
    error: function () {
      no_wifi.render();
    }
  });
}

Merchs.prototype.bindClick = function () {
  var that = this;
  $('.change-btn').unbind();

  $('.change-btn').on({
    click: function () {
      if ($(this).attr('id') == 'left_merch') {
        that.activeClickItem = 'left'
      } else {
        that.activeClickItem = 'right'
      }
      selectPanel.set(that.responseData)
      selectPanel.render()
    }
  })

  $('.pk-btn').on({
    click: function () {
      if ($(this).hasClass('sold')) {
        return;
      }
      
      that.purchaseUnifiedOrder();
    }
  })

  $('.xieyi').on({
    click: function () {
      xieyi.render();
    }
  })

  $('.guize').on({
    click: function () {
      guize.render();
    }
  })
}

Merchs.prototype.initPkItem = function () {
  var products = this.products;
  this.leftItem = products[0];
  for (var x in products) {
    if (products[x].opeProductId == this.checkId) {
      this.rightItem = products[x];
    }
  }
  this.showPkInfo();
}

Merchs.prototype.showPkInfo = function () {
  var leftItem = this.leftItem;
  var rightItem = this.rightItem;

  showMerch($('.vs-box .left'), leftItem)
  showMerch($('.vs-box .right'), rightItem)

  this.pay = computePay(leftItem.discountPrice, rightItem.discountPrice);

  this.pay = Math.ceil(this.pay * 100) / 100  //向上取整保留两位小数显示
  $('.pk-btn p').html('支付￥' + this.pay.toFixed(2))

  var leftProbability = computeProbability(leftItem.discountPrice, rightItem.discountPrice, this.pay)
  var leftP = leftProbability.toFixed(3)
  var rightProbability = 1 - leftProbability;
  var rightP = rightProbability.toFixed(3)

  $('.circle-left').html((leftP * 100).toFixed(1) + '%')
  $('.circle-right').html((rightP * 100).toFixed(1) + '%')

  $('.bloods-right').css('width', rightProbability * 100 + '%')
  $('.bloods-left').css('width', leftProbability * 100 + '%')

  $('.bloods-center').css('left', (leftProbability - 0.04) * 100 + '%')

}


Merchs.prototype.purchaseUnifiedOrder = function () {

  if (DEBUG) {
    this.customerId = 631254;
    let winArr = [0,1]
      merch.winningFlag = winArr[parseInt(winArr.length*Math.random())];
      animation.start();
      this.winnerItem = this.leftItem;
      return;
  }

  console.log('预下订单');
  var that = this;

  if (localStorage.pk_xieyi == undefined || localStorage.pk_xieyi == 'undefined' || localStorage.pk_xieyi == false || localStorage.pk_xieyi == 'false') {
    xieyi.render(true)
    return;
  }

  var questUrl = that.hostname + '/m/consumer/purchaseUnifiedOrder.jsonp'

  if (MquJS_AliPay.isAliPay()) {
    toast.set('主人，PK吧暂不支持支付宝，可使用微信继续PK～')
    return;
  }

  that.orderId = undefined;
  that.winningFlag = undefined;
  that.winnerItem = undefined;

  that.timeCount = 12;
  that.checkWinningCount = 50;

  that.productList = [];

  that.productList.push({ id: that.leftItem.opeProductId, discount_price: that.leftItem.discountPrice })
  that.productList.push({ id: that.rightItem.opeProductId, discount_price: that.rightItem.discountPrice })

  var questData = {
    'customerId': that.customerId,
    'vm_id': that.vm_id,
    'productList': that.productList,
    'source_flag': that.source_flag,
    'payType': that.payType,
    'quantity': 2,
    'order_type': that.order_type,
    'duang_money': that.pay,
    'box_id': that.box_id
  }

  console.log(questData);



  $('body').append(loading)
  $.ajax({
    type: 'post',
    url: questUrl,
    data: JSON.stringify(questData),
    contentType: "application/json;charset=utf-8",
    dataType: 'json',
    success: function (response) {
      loading.remove();
      console.log('预下订单response', response);
      if (response.code == 0) {
        var info = response.result;
        that.orderId = info.orderId;

        MquJS.setCookie('orderId', decodeURI(info.orderId), 24 * 3600);
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": info.appId, //公众号名称，由商户传入
            "timeStamp": info.timestamp, //时间戳，自1970年以来的秒数
            "nonceStr": info.nonce, //随机串
            "package": info.packageName,
            "signType": "MD5", //微信签名方式：
            "paySign": info.signature //微信签名
          },
          function (res) {
            setTimeout(function () {
              if (DEBUG) {
                //支付成功,动画开始
                animation.start();
                //查询中奖信息
                that.checkWinningInfo();
                return;
              }
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //支付成功,动画开始
                animation.start();
                //查询中奖信息
                that.checkWinningInfo();
              }
            }, 0);
          }
        );
      } else if (response.code == -2) {
        //售罄
        that.soldOutProHandle(response.result);
        toast.set('所选商品已售罄');
      } else {
        toast.set(response.message)
      }
    },
    error: function () {
      loading.remove()
      no_wifi.render();
    }
  })

}

//获取运营商信息
Merchs.prototype.getVmAndProductById = function () {
  var that = this;
  if (DEBUG) {
    this.customerId = 518522;
  }
  $.ajax({
    type: 'get',
    url: that.hostname + '/m/consumer/findOperatorPropertyByVmId.jsonp',
    data: {
      'vmId': that.vm_id,
    },
    jsonp: 'callback',
    dataType: 'jsonp',
    success: function (response) {
      if (response.code == 0) {
        that.telPhone = response.result.aft_sell_cont_way
      }
    }
  });
}

//获取订单中奖信息
Merchs.prototype.checkWinningInfo = function () {
  var that = this;
  that.checkWinningCount--;
  if (DEBUG) {
    that.orderId = 'MQ18220180610191922318851533'
  }
  var questUrl = that.hostname + '/m/consumer/checkWinningInfo.jsonp?orderId=' + that.orderId;
  $.ajax({
    type: 'get',
    url: questUrl,
    contentType: "application/json;charset=utf-8",
    dataType: 'json',
    success: function (response) {
      if (DEBUG) {
        that.winnerItem = that.leftItem;
        that.winningFlag = 0;
        return;
      }
      console.log('获取订单中奖信息', response);
      if (response.code == -4 && that.checkWinningCount >= 0) {
        setTimeout(function () {
          that.checkWinningInfo();
        }, 300);
        return;
      }

      if (response.code == 0) {
        var winId = response.result.duangProductVo.id;
        if (that.leftItem.opeProductId == winId) {
          that.winnerItem = that.leftItem;
          that.winningFlag = 0;
          return;
        }

        if (that.rightItem.opeProductId == winId) {
          that.winnerItem = that.rightItem;
          that.winningFlag = 1;
          return
        }

        that.winningFlag = 2;
      } else {
        toast.set(response.message)
        that.winningFlag = 2;
      }

    },
    error: function (error) {
      toast.set('网络故障请重试')
    }
  });
}


//获取订单详情信息
Merchs.prototype.notifyPayStatus = function () {
  var that = this;
  that.timeCount--;

  if (DEBUG) {
    that.orderId = 'MQ20620180611160558105858042'
  }

  var questUrl = that.hostname + '/m/consumer/notifyPayStatus.jsonp?orderId=' + that.orderId + '&vm_id=' + that.vm_id;
  console.log('notifyPayStatus questUrl:', questUrl);
  $.ajax({
    type: 'get',
    url: questUrl,
    contentType: "application/json;charset=utf-8",
    dataType: 'jsonp',
    success: function (response) {
      if (response.code == -4 && that.timeCount >= 0) {
        setTimeout(function () {
          that.notifyPayStatus();
        }, 3 * 1000);
        return;
      }

      if (response.code == 0) {
        chBox.set({ state: 2, result: that.winnerItem })
      } else {
        if (response.result.isAlreadySendRedPacket) {
          //红包
          that.winnerItem.red = true;
          chBox.set({ state: 3, result: that.winnerItem })
          return;
        }
        that.winnerItem.red = false;
        chBox.set({ state: 3, result: that.winnerItem })
      }
    },
    error: function (error) {
      toast.set('网络故障请重试')
    }
  });
}


Merchs.prototype.soldOutProHandle = function (arg) {
  var that = this;
  //售罄
  if (arg && arg.length > 0) {
    for (var i = 0; i < arg.length; i++) {
      if (arg[i].id == that.leftItem.opeProductId) {
        $('.vs-box .left').append('<div class="sold-out">售罄</div>')
      } else if (arg[i].id == that.rightItem.opeProductId) {
        $('.vs-box .right').append('<div class="sold-out">售罄</div>')
      }
    }
    $('.pk-btn').addClass('sold')
  }
}

Merchs.prototype.showWin = function () {
  var win = new Win()
  win.set(this.winnerItem);
  win.render();
}

var merch = new Merchs()
merch.getAppId()


//计算概率
var computeProbability = function (a, b, p) {
  if (a < b) {
    if (b > p) {
      return (b - p) / (b - a)
    } else {
      return (p - b) / (b - a)
    }
  } else if (a > b) {
    if (b > p) {
      return (b - p) / (a - b)
    } else {
      return (p - b) / (a - b)
    }
  } else {
    return 0.5
  }
}

//计算支付金额
var computePay = function (left, right) {
  if (left <= right) {
    if (right - left <= left * 0.2) {
      return (left + right) / 2
    } else {
      return left * 1.2
    }
  } else {
    if (left - right <= right * 0.2) {
      return (left + right) / 2
    } else {
      return right * 1.2
    }
  }
}

//展示商品
var showMerch = function ($node, arg) {
  $node.find('.merch-name').text(arg.productName)
  $node.find('.merch-price').text('￥' + arg.discountPrice.toFixed(2))

  arg.stock >= 0 && $node.find('.sold-out').remove();

  var Img = new Image();
  Img.onload = function () {
    $node.find('.merch-img').html(Img);
    Img.width > Img.height && $node.find('.merch-img img').css({ 'width': '1.05rem', 'height': 'auto' })
  }
  Img.onerror = function () {
    Img.src = './img/default_btn_uploadpic.png'
  }
  Img.src = arg.imageUrl + '@100w_1e_1c.png'
}

function sortDiscountPriced(a,b){  
  return a.discountPrice-b.discountPrice  
}


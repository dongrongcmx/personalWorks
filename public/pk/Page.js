

/**
 * 首页
 * @module.exports = PK_body;
 */

var  PK_body = '<div class="main-container">'+
  '<header>'+
    '<img src="./pk/img/title@3x.png" alt="">'+
  '</header>'+
  '<div class="vs-box">'+
    '<div class="left vs-goods">'+
      '<div class="merch-img">'+
        '<img src="" alt="">'+
      '</div>'+
      '<div class="merch-name"></div>'+
      '<div class="merch-price"></div>'+
      '<div class="change-btn" id="left_merch"></div>'+
      '<div class="sold-out">售罄</div>'+
    '</div>'+
    '<div class="right vs-goods">'+
      '<div class="merch-img"></div>'+
      '<div class="merch-name"></div>'+
      '<div class="merch-price"></div>'+
      '<div class="change-btn" id="right_merch"></div>'+
      '<div class="sold-out">售罄</div>'+
    '</div>'+
    '<div class="icon-vs"></div>'+
  '</div>'+
  '<div class="bloods-slot">'+
    '<div class="bloods">'+
      '<div class="bloods-left"></div>'+
      '<div class="bloods-right"></div>'+
      '<div class="bloods-center"></div>'+
    '</div>'+
    '<div class="bloods-master">'+
      '<img src="./pk/img/bloods_master.png" alt="">'+
    '</div>'+
    '<div class="circle circle-left"></div>'+
    '<div class="circle circle-right"></div>'+
  '</div>'+
  '<footer>'+
    '<div class="pk-btn">'+
      '<p></p>'+
    '</div>'+
    '<p class="guize btn">规则</p>'+
  '</footer>'+
'</div>'

/**
 * loading
 * @module.exports = loading;
 */

var loading = $('<div id="loading"><img src="./img/uloading.gif" alt=""></div>')

/**
 * No_wifi页面
 * @module.exports = no_wifi;
 */

var No_wifi = function(){
  this.dom = $('<div id="no-wifi">'+
    '<img src="./img/default_icon_fault@3x.png" alt="">'+
    '<p>哎呀，您访问的页面出错啦</p>'+
    '<div class="refresh">刷新</div>'+
  '</div>')

  this.render = function(){
    $('body').append(this.dom)
    this.bindClick()
  }
  this.bindClick = function(){
    this.dom.find('.refresh').on({
      click:function(){
        location.reload();
      }
    })
  }
}

var no_wifi = new No_wifi()


/**
 * Toast页面
 * @module.exports = toast;
 */

var Toast = function(){
  this.dom = $('<div id="toast"><p></p></div>')
  this.set = function(text){
    var that = this;
    this.dom.find('p').html(text)
    $('body').append(this.dom)
    setTimeout(function () {
      that.dom.remove();
    }, 2000);
  }
}
var toast = new Toast();


/**
 * 协议页面
 * @module.exports = xieyi;
 */

var Xieyi = function(){
  this.check = true;
  this.showText = false;
  this.dom = $('<div class="alert-xieyi" >'+
    '<div class="xieyi-box slideIn alert-box">'+
      '<div class="btn_closed">'+
        '<img src="./pk/img/icon_closed@3x.png" alt="">'+
      '</div>'+
      '<div class="title">'+
        '<img src="./pk/img/xieyi@3x.png" alt="">'+
      '</div>'+
      '<div  class="textarea" hidden></div>'+
      '<div class="checkbox">'+
        '<div class="check">'+
          '<img src="./pk/img/check.png" alt="">'+
        '</div>'+
        '<p>我已阅读并同意<span>《用户协议》</span></p>'+
      '</div>'+
      '<div class="btn-certain">'+
        '<img src="./pk/img/btn_wan@3x.png" alt="">'+
      '</div>'+
    '</div>'+
  '</div>')

  this.render = function(purchase){
    $('body').append(this.dom);
    this.check = true;
    this.showText = false;
    this.dom.find('.textarea').hide()
    this.dom.find('.check img').show()
    this.bindClick(purchase)
  }
  this.bindClick = function(purchase){
    var that = this;
    this.dom.find('.btn_closed').unbind();
    this.dom.find('.btn_closed').on({
      click:function(){
        that.remove();
      }
    })


    this.dom.find('.check').unbind();
    this.dom.find('.check').on({
      click:function(){
        that.check = !that.check;
        if(that.check){
          that.dom.find('.check img').show()
        }else{
          that.dom.find('.check img').hide()
        }
      }
    })

    this.dom.find('.checkbox span').unbind();
    this.dom.find('.checkbox span').on({
      click:function(){
        that.showText = !that.showText;
        if(that.showText){
          that.dom.find('.textarea').show()
          that.dom.find('.textarea').html(xieyi_text)
        }else{
          that.dom.find('.textarea').hide()
        }
      }
    })

    this.dom.find('.btn-certain').unbind()
    this.dom.find('.btn-certain').on({
      click:function(){
        localStorage.pk_xieyi = that.check;
        if(purchase && that.check){
          merch.purchaseUnifiedOrder();
        }
        that.remove();
      }
    })

  }

  this.remove = function(){
    var that = this;
    that.dom.find('.xieyi-box').removeClass('slideIn');
    this.dom.find('.xieyi-box').addClass('slideOut');
    setTimeout(function(){
      that.dom.find('.xieyi-box').removeClass('slideOut');
      that.dom.find('.xieyi-box').addClass('slideIn');
      that.dom.remove();
    },300)
  }
}

var xieyi = new Xieyi();

/**
 * 规则页面
 * @module.exports = guize;
 */

var Guize = function(){
  this.dom = $('<div class="alert-guize">'+
    '<div class="guize-box slideIn alert-box">'+
      '<div class="btn_closed">'+
        '<img src="./pk/img/icon_closed@3x.png" alt="">'+
      '</div>'+
      '<div class="title">'+
        '<img src="./pk/img/guize.png" alt="">'+
      '</div>'+
      '<div class="textarea">'+
        '<img src="./pk/img/Guize_img.png" alt="">'+
      '</div>'+
      '<div class="btn-certain">'+
        '<img src="./pk/img/know.png" alt="">'+
      '</div>'+
    '</div>'+
  '</div>')

  this.render = function(){
    $('body').append(this.dom);
    this.bindClick()
  }

  this.bindClick = function(){
    var that = this;
    this.dom.find('.btn_closed').unbind();
    this.dom.find('.btn_closed').on({
      click:function(){
        that.remove();
      }
    })

    this.dom.find('.btn-certain').unbind()
    this.dom.find('.btn-certain').on({
      click:function(){
        that.remove();
      }
    })

  }

  this.remove = function(){
    var that = this;
    that.dom.find('.guize-box').removeClass('slideIn');
    this.dom.find('.guize-box').addClass('slideOut');
    setTimeout(function(){
      that.dom.find('.guize-box').removeClass('slideOut');
      that.dom.find('.guize-box').addClass('slideIn');
      that.dom.remove();
    },300)
  }
}

var guize = new Guize();

/**
 * 中奖页面
 * @param {string} imageUrl 商品图片
 * @module.exports = Win;
 */

var Win = function(){
  var that = this;
  this.dom = $('<div class="alert-win">'+
    '<div class="win-container">'+
    '<div class="win-box alert-box slideIn">'+
    '<div class="btn_closed">'+
      '<img src="./pk/img/icon_closed@3x.png" alt="">'+
    '</div>'+
      '<div class="merch-box">'+
        '<div class="merch-img"></div>'+
        '<div class="win-text">'+
          '<div class="win-img"><img src="./pk/img/sc_light.png" alt=""></div>'+
          '<p>请从取货口取走您的商品</p>'+
        '</div>'+
      '</div>'+
      '<div class="btn-box">'+
        '<div class="btn btn-left jixu">'+
          '<img src="./pk/img/btn_jixu.png" alt="">'+
        '</div>'+
        '<div class="btn btn-right wc">'+
          '<img src="./pk/img/btn_wancheng.png" alt="">'+
        '</div>'+
      '</div>'+
      '<p class="no-chuhuo">没出货？立即处理</p>'+
      '<div class="ad-box">'+
        '<img src="./pk/img/Bitmap@3x.png" alt="">'+
        '<p>100万优惠券免费抢</p>'+
        '<div class="btn">查看</div>'+
      '</div>'+
    '</div>'+
   '</div>'+
  '</div>')

  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh()
  }

  this.refresh = function(){
    var data = this.data;
    if(!data){
      return;
    }

    if(is_add_ad){
      $('.ad-box p').text(getRandomText())
    }else{
      $('.ad-box').remove();
    }

    var Img = new Image();
    Img.onload = function(){
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && that.dom.find('.merch-img img').css({'width':'100%','height':'auto'})
    }
    Img.onerror = function(){
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = data.imageUrl + '@100w_1e_1c.png'
  }

  this.render = function(){
    $('body').append(this.dom);
    this.bindClick()
  }

  this.bindClick = function(){
    var that = this;

    this.dom.find('.btn_closed').on({
      click:function(){
        that.remove();
      }
    })

    this.dom.find('.btn-left').on({
      click:function(){
        that.dom.find('.win-box').removeClass('slideIn');
        that.dom.addClass('winHide');

        merch.purchaseUnifiedOrder()
        setTimeout(function(){
          that.dom.removeClass('winHide');
          that.dom.find('.win-box').addClass('slideIn');
          that.dom.remove();
        },300)
      }
    })

    this.dom.find('.btn-right').on({
      click:function(){
        if(is_add_ad){
          showAd(merch.orderId,merch.winnerItem.discountPrice*100)
          that.remove();
        }else{
          that.remove();
        }
      }
    })

    if(is_add_ad){
      this.dom.find('.ad-box').on({
        click:function(){
          showAd(merch.orderId,merch.winnerItem.discountPrice*100)
          that.remove();
        }
      })
    }

    this.dom.find('.no-chuhuo').on({
      click:function(){

        that.dom.remove();

      	chBox.set({state:1,result:merch.winnerItem})
      	chBox.render();

        merch.notifyPayStatus();
      }
    })

  }

  this.remove = function(){
    var that = this;
    that.dom.find('.win-box').removeClass('slideIn');
    this.dom.find('.win-box').addClass('slideOut');
    setTimeout(function(){
      that.dom.find('.win-box').removeClass('slideOut');
      that.dom.find('.win-box').addClass('slideIn');
      that.dom.remove();
    },300)
  }
}



var Waiting = function(){
  this.dom = $('<div class="waiting content-box"><div class="merch-img"></div><img  class="circle" src="./pk/img/circle.png" alt=""></div>')
  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;

    var Img = new Image();
    Img.onload = function(){
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && that.dom.find('.merch-img img').css({'width':'100%','height':'auto'})
    }
    Img.onerror = function(){
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = data.imageUrl + '@100w_1e_1c.png'

  }
  this.render = function(parent){
    parent.append(this.dom)
  }
}


var CHSuc = function(){
  this.dom = $('<div class="chuhuo-suc content-box">'+
    '<div class="merch-img"></div>'+
    '<div class="title">'+
      '<div class="ch-chenggong"></div>'+
      '<p>请从取货口取走您的商品</p>'+
    '</div>'+
    '<div class="btn-box">'+
      '<div class="btn btn-left jixu">'+
        '<img src="./pk/img/btn_jixu.png" alt="">'+
      '</div>'+
      '<div class="btn btn-right wc">'+
        '<img src="./pk/img/btn_wancheng.png" alt="">'+
      '</div>'+
    '</div>'+
    '<p class="kefu">没出货？联系客服</p>'+
  '</div>')

  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh();
  }

  this.refresh = function(){
    var data = this.data;
    var that = this;

    var Img = new Image();
    Img.onload = function(){
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && that.dom.find('.merch-img img').css({'width':'100%','height':'auto'})
    }
    Img.onerror = function(){
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = data.imageUrl + '@100w_1e_1c.png'

  }

  this.render = function(parent){
    parent.append(this.dom)
    this.bindClick();
  }

  this.bindClick = function(){
    this.dom.find('.btn-left').unbind()
    this.dom.find('.btn-left').on({
      click:function(){
        chBox.remove();
        merch.purchaseUnifiedOrder()
      }
    })

    this.dom.find('.btn-right').unbind()
    this.dom.find('.btn-right').on({
      click:function(){
        if(is_add_ad){
          showAd(merch.orderId,merch.winnerItem.discountPrice*100)
          chBox.remove();
        }
      }
    })

    this.dom.find('.kefu').unbind()
    this.dom.find('.kefu').on({
      click:function(){
        var tel = "tel:" + merch.telPhone;
  			if(merch.telPhone == undefined){
  				return;
  			}
  			window.location.href = tel;
      }
    })
  }
}

var CHFail = function(){
  this.dom = $('<div class="chuhuo-fail content-box">'+
    '<div class="merch-img"></div>'+
    '<div class="title">'+
      '<div class="ch-shibai"></div>'+
    '</div>'+
    '<div class="btn">'+
      '<img src="./pk/img/btn_tuikuan.png" alt="">'+
    '</div>'+
    '<p class="kefu">联系客服</p>'+
  '</div>')
  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh()
  }
  this.refresh = function(){
    var data = this.data;
    var that = this;
    if(!data){
      return;
    }

    if(data.red){
      this.dom.find('.title').append('<p>已领取￥'+data.discountPrice.toFixed(2)+'红包</p>')
      this.dom.find('.title p').unbind();
      this.dom.find('.title p').on({
        click:function(){
          window.location.href = 'redPacketList.html?v='+ pageversion;
        }
      })
      this.dom.find('.btn img').attr('src','./pk/img/btn_shiyong.png')
      this.dom.find('.kefu').remove();
      this.dom.find('.btn').css('margin-top','0.42rem')
    }else{
      this.dom.find('.btn').css('margin-top','0.3rem')
      this.dom.find('.btn img').attr('src','./pk/img/btn_tuikuan.png')
    }

    var Img = new Image();
    Img.onload = function(){
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && that.dom.find('.merch-img img').css({'width':'100%','height':'auto'})
    }
    Img.onerror = function(){
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = data.imageUrl + '@100w_1e_1c.png'

  }

  this.render = function(parent){
    parent.append(this.dom)
    this.bindClick();
  }

  this.bindClick = function(){
    this.dom.find('.btn').unbind();
    if(this.data.red){
      this.dom.find('.btn').on({
        click:function(){
          // console.log('toPay.html?vmId=' + merch.vm_id + '&opId=' + merch.winnerItem.opeProductId  + '&sourceFlag=2&v=' + pageversion);
          window.location.href = 'toPay.html?vmId=' + merch.vm_id + '&opId=' + merch.winnerItem.opeProductId  + '&sourceFlag=2&v=' + pageversion;
        }
      })
    }else{
      this.dom.find('.btn').on({
        click:function(){
          window.location.href = 'refundProcess.html?orderId=' + merch.orderId + '&v=' + pageversion ;
        }
      })
    }

    this.dom.find('.kefu').unbind()
    this.dom.find('.kefu').on({
      click:function(){
        var tel = "tel:" + merch.telPhone;
  			if(merch.telPhone == undefined){
  				return;
  			}
  			window.location.href = tel;
      }
    })
  }
}


var CHBox = function(){
  this.dom = $('<div class="alert-chuhuo">'+
    '<div class="chuhuo-box alert-box slideIn">'+
      '<div class="btn_closed">'+
        '<img src="./pk/img/icon_closed@3x.png" alt="">'+
      '</div>'+
    '</div>'+
  '</div>')

  this.data = undefined;
  this.set = function(data){
    this.data = data;
    this.refresh()
  }
  this.refresh = function(){
    var data = this.data;
    var that = this;
    if(!data){
      return;
    }

    this.dom.find('.content-box').remove()

    if(data.state == 1){
      var waiting = new Waiting();
      waiting.set(data.result);
      waiting.render(this.dom.find('.chuhuo-box'))
    }else if (data.state == 2) {
      var chSuc = new CHSuc()
      chSuc.set(data.result);
      chSuc.render(this.dom.find('.chuhuo-box'))
    }
    else if (data.state == 3) {
      var chFail = new CHFail()
      chFail.set(data.result);
      chFail.render(this.dom.find('.chuhuo-box'))
    }
  }

  this.render = function(){
    $('body').append(this.dom);
    this.bindClick();
  }

  this.remove = function(){
    var that = this;
    that.dom.find('.chuhuo-box').removeClass('slideIn');
    this.dom.find('.chuhuo-box').addClass('slideOut');
    setTimeout(function(){
      that.dom.find('.chuhuo-box').removeClass('slideOut');
      that.dom.find('.chuhuo-box').addClass('slideIn');
      that.dom.remove();
    },300)
  }

  this.bindClick = function(){
    var that = this;
    this.dom.find('.btn_closed').unbind();
    this.dom.find('.btn_closed').on({
      click:function(){
        that.remove();
      }
    })
  }
}

var chBox = new CHBox()

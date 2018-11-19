
var eggBlueImg = new Image();
eggBlueImg.src = './tantan/img/egg_blue.png';

var eggGreenImg = new Image();
eggGreenImg.src = './tantan/img/egg_green.png';

var eggRedImg = new Image();
eggRedImg.src = './tantan/img/egg_red.png';

var ball_2 = new Image();
ball_2.src = './tantan/img/ball_2.png';

var ball_3 = new Image();
ball_3.src = './tantan/img/ball_3.png';

var ball_5 = new Image();
ball_5.src = './tantan/img/ball_5.png';

var MerchColor = {
  colorArr : [{
    //红色
    out_style: 'tantan/img/icon_selct_3.png',
    egg:eggRedImg,
    select:false,
    index:0,
    exit:undefined
  },
  //绿色
  {
    out_style: 'tantan/img/icon_selct_2.png',
    egg:eggGreenImg,
    select:false,
    index:1,
    exit:undefined
  },
  //蓝色
  {
    out_style:'tantan/img/icon_selct_1.png',
    egg:eggBlueImg,
    select:false,
    index:2,
    exit:undefined
  }],
  selectColor:undefined,
  getColor:function(){
    for (var x in this.colorArr) {
      if ( !this.colorArr[x].select) {
        this.colorArr[x].select = true;
        var exit = Map.pushEggImg(this.colorArr[x].egg,x)
        this.colorArr[x].exit = exit;
        return this.colorArr[x]
      }
    }
  },
  backtrack:function(index){
    this.colorArr[index].select = false;
    Map.backtrackEmptyIndex(index)
  }
 
}

var YinDao = function(){
  this.dom = $('<div class="yindao"></div>')
  this.render = function(){
    $('body').append(this.dom)
  }
  this.remove = function(){
    this.dom.remove()
  }
}
var yinDao = new YinDao()

var CanvasBox = function(){
  var CanvasBoxHtml = $('<div class="canvas-box">'+
  '<div class="canvas">'+
  '<canvas id="canvas"></canvas>'+
  '</div>'+
  '</div>'+
  '<div class="biubiu-box">'+
  '<div class="mask">'+
  '<div class="btn-biubiu"></div>'+
  '</div>'+
  '<div class="blood-box">'+
  '<div class="blood"></div>'+
  '</div>'+
  '</div>')

  this.dom = $(CanvasBoxHtml)
  this.render = function(){
    $('#container').append(this.dom)
  }

}

var canvasBox = new CanvasBox()


/**
 * 
 * @param {string} price 支付价格
 * @param {string} products 商品列表
 * @param {string} productList 选择商品列表
 * @param {string} id 商品Id
 * @param {string} price 商品价格
 * @param {string} box_id 商品格子Id
 * @param {string} url 商品图片
 * @param {string} product_name 商品名称
 * @param {string} short_name 商品短名称
 * @param {string} discount_price 折扣价
 * @param {string} purchase_price 商品进价
 * @param {string} sold_out 是否售罄true是 false否
 * 
 */
var MerchAndMultiple = function(){
  this.multipleArr = [{
    select:true,
    mul:'2',
    ball:ball_2
  },{
    select:false,
    mul:'3',
    ball:ball_3
  },{
    select:false,
    mul:'5',
    ball:ball_5
  }]
  
  this.dom = $('<div class="select-merch-multiple"><ul class="select-merch"></ul>'+
  '<ul class="select-multiple">'+
  '<li><div class="mul-img"><img src="./tantan/img/two.png" alt=""></div></li>'+
  '<li><div class="mul-img"><img src="./tantan/img/three.png" alt=""></div></li>'+
  '<li><div class="mul-img"><img src="./tantan/img/five.png" alt=""></div></li>'+
  '</ul></div>')

  this.data = undefined;

  this.price = undefined;
  this.productList = [];
  this.mul = undefined;
  this.totalPrice = 0;
  this.active_ball = undefined


  this.set = function(data){
    if(data){
      this.data = data
      this.refresh()
    }
  }

  this.multipleRefresh = function(){
    var index 
    for(var i = 0;i<this.multipleArr.length;i++){
      if(this.multipleArr[i].select){
        this.mul = this.multipleArr[i].mul;
        this.active_ball = this.multipleArr[i].ball;
        this.dom.find('.select-multiple li:eq('+i+')').addClass('active')
        index = i
      }else{
        this.dom.find('.select-multiple li:eq('+i+')').removeClass('active')
      }
    }

    this.price = this.mul * this.productList.length;
    if(this.productList.length > 0){
      this.probability = this.price /this.totalPrice;
    }else{
      this.probability = 0
    }

    console.log(this.probability);
    
    Map.getMap(this.probability)
    

    btnGo.set(this.price.toFixed(2))
    
  }

  this.productsRefresh = function (param) {
    var products = this.data.products;

    if (!products) {
      return
    }

    this.productList = []
    this.totalPrice = 0;

    $('.icon-soldOut').remove()
    $('.icon-select').remove()

    //点击商品背景改变
    for (var i = 0; i < products.length; i++) {
      if (products[i].isSelect && !products[i].sold_out) {
        if (!products[i].bgImgSrc) {
          products[i].bgImgSrc = MerchColor.getColor()
        }
        this.dom.find('.select-merch li:eq(' + i + ')').append('<div class="icon-select"><img src="'+products[i].bgImgSrc.out_style+'" alt=""></div>')
        this.dom.find('.select-merch li:eq(' + i + ')').css({
          'background': '#301B8D',
          'opacity': '1'
        })
        this.productList.push(products[i])
        this.totalPrice += products[i].discount_price;
        
      } else {
        this.dom.find('.select-merch li:eq(' + i + ')').css({
          'background': '#fff',
          'opacity': '1'
        })
        if (products[i].bgImgSrc) {
          MerchColor.backtrack(products[i].bgImgSrc.index)
          products[i].bgImgSrc = undefined;
        }
      }

      if(products[i].sold_out){
        this.dom.find('.select-merch li:eq(' + i + ')').append('<div class="icon-soldOut"></div>')
        this.dom.find('.select-merch li:eq(' + i + ') .merch-img').css({
          'opacity': '0.5'
        })
      }else{
        this.dom.find('.select-merch li:eq(' + i + ') .icon-soldOut').remove()
        this.dom.find('.select-merch li:eq(' + i + ') .merch-img').css({
          'opacity': '1'
        })
      }

    }

    //最多选择3个商品
    if (this.productList.length >= 3) {
      for (var x in products) {
        if (!products[x].isSelect) {
          this.dom.find('.select-merch li:eq(' + x + ')').css({
            'opacity': '0.5'
          })
        }
      }
    }

    this.priceRefresh()
  }

  // 最小商品价格必须大于等于倍率×商品数量。根据所选商品显示或隐藏倍率
  this.priceRefresh = function(){
    this.dom.find('.select-multiple li').show();
    
    if(!this.productList.length){
      this.multipleRefresh()
      return;
    }

    this.productList.sort(sortDiscountPriced)


    //隐藏3倍和5倍
    if(this.productList[0].discount_price < this.productList.length * 3){
      this.dom.find('.select-multiple li:eq(1)').hide()
      this.dom.find('.select-multiple li:eq(2)').hide()
      this.multipleArr[0].select = true;
      this.multipleArr[1].select = false;
      this.multipleArr[2].select = false;
      this.multipleRefresh()
      return;
    }

    //隐藏5倍
    if(this.productList[0].discount_price < this.productList.length * 5){
      this.dom.find('.select-multiple li:eq(2)').hide()
      this.multipleArr[0].select = true;
      this.multipleArr[1].select = false;
      this.multipleArr[2].select = false;
      this.multipleRefresh()
      return;
    }

    this.multipleRefresh()
  }




  this.refresh = function(){
    var data = this.data;
    console.log(data);

    if(data.products && data.products.length > 0){
      this.dom.find('.select-merch').empty();
      this.productDomList = [];

      for (let j = 0; j < data.products.length; j++) {
        let liDom = $('<li><div class="merch-img"></div></li>')

        let Img = new Image();
        Img.onload = function () {
          liDom.find('.merch-img').html(Img);
          Img.width > Img.height && liDom.find('.merch-img img').css({
            'width': '100%',
            'height': 'auto'
          })
        }
        Img.onerror = function () {
          Img.src = './img/default_btn_uploadpic.png'
        }
        Img.src = data.products[j].url + '@100w_1e_1c.png'

        this.dom.find('.select-merch').append(liDom)
      }
      
    }
    this.multipleRefresh()
    this.productsRefresh()
    // this.multipleRefresh()

  }

  this.render = function(){
    $('#container').append(this.dom)
    this.clickEvent()
  }

  this.clickEvent = function(){
    var that = this;

    this.dom.find('.select-multiple li').unbind();
    this.dom.find('.select-multiple li').on({
      click:function(e){

        for(var i = 0;i<that.multipleArr.length;i++){
          that.multipleArr[i].select = false;
        }
        
        var index = $(this).index();

        that.multipleArr[index].select = true;

        that.multipleRefresh();
        
      }
    })

    this.dom.find('.select-merch li').unbind();
    this.dom.find('.select-merch li').on({
      click:function(e){
        var index = $(this).index();

        if(that.productList.length>=3 && !that.data.products[index].isSelect){
          return;
        }
        
        that.data.products[index].isSelect = !that.data.products[index].isSelect;
        

        var param = {
          index:index
        }

        that.productsRefresh(param)
      }
    })
  }
}

var merchAndMultiple = new MerchAndMultiple()


var BtnGo = function(){
  this.dom = $('<div class="btn_go"><p>￥2.00</p></div>');
  this.hide = false;
  this.isClick = true;

  this.set = function(data){
    this.data = data
    this.refresh();
  }
  this.refresh = function(){
    
    if(this.data){
      this.dom.find('p').text('￥'+this.data)
      this.isClick = true
    }
    if(this.data == 0){
      this.isClick = false
    }

    if(this.isClick){
      this.dom.css({
        // 'background': 'url('+'"tantan/img/btn_go_pre.png"'+') no-repeat center center',
        // 'background-size': '100% auto'
        // opacity: 1
      })
      // this.dom.find('p').css({'color':'#301B8D'})
    }else{
      this.dom.css({
        // 'background': 'url('+'"tantan/img/btn_go_pre.png"'+') no-repeat center center',
        // 'background-size': '100% auto'
        // opacity: 0.5
      })
      // this.dom.find('p').css({'color':'#C2B1B1'})
    }
  }

  this.render = function(){
    this.refresh()
    $('body').append(this.dom)
    this.clickEvent()
  }

  this.clickEvent = function(){
    var that = this;
    that.dom.unbind()
    that.dom.on({
      click:function(){
        if(!that.isClick){
          return;
        }

        orders.purchaseUnifiedOrder()
      }
    })
  }
}

var btnGo = new BtnGo()


var BtnGuize = function(){
  this.dom = $('<div class="guize">规则</div>');
  this.render = function(){
    $('body').append(this.dom)
    this.clickEvent()
  }

  this.clickEvent = function(){
    this.dom.on({
      click:function(){
        console.log('规则');
        
      }
    })
  }
}

var btnGuize = new BtnGuize()

var AlertBox = function(){
  this.WinnerdDom = $('<div class="winner-box alert-box"><div class="slideIn isSlideOut winner-container"><div class="btn-hide"></div>'+
    '<div class="merch-img"></div><div class="btn-hanlde"></div><div class="btn-go-again"></div></div></div>')
  
  this.LoadingDom = $('<div class="alert-box"><div class="loading-container isSlideOut"><div class="btn-hide"></div>'+
  '<div class="merch-img"></div><div class="loading"></div></div></div>')

  this.SucDom = $('<div class="alert-box"><div class="suc-container isSlideOut"><div class="btn-hide"></div>'+
    '<div class="merch-img"></div><div class="btn-kefu"></div><div class="btn-go-again"></div></div></div>')
  
  this.ErrRedDom = $('<div class="alert-box"><div class="err-red-container isSlideOut"><div class="btn-hide"></div>'+
    '<div class="merch-img"></div><div class="after-use"></div><div class="use-now"></div><p></p></div></div>')


  this.ErrTuiKuanDom = $('<div class="alert-box"><div class="err-tuikuan-container isSlideOut"><div class="btn-hide"></div>'+
    '<div class="merch-img"></div><div class="btn-kefu"></div><div class="btn-tuikuan"></div></div></div>')

  this.data = undefined;

  this.set = function(data){
    this.data = data
    this.refresh()
  }

  this.refresh = function(){
    if(!this.data){
      return
    }
    var that = this

    let Img = new Image();
    Img.onload = function () {
      that.dom.find('.merch-img').html(Img);
      Img.width > Img.height && liDom.find('.merch-img img').css({
        'width': '100%',
        'height': 'auto'
      })
    }
    Img.onerror = function () {
      Img.src = './img/default_btn_uploadpic.png'
    }
    Img.src = this.data.url + '@100w_1e_1c.png'

    if(this.data.redPrice){
      this.dom.find('p').text('￥'+this.data.redPrice)
    }

  }

  this.render = function(num){
    this.WinnerdDom.find('.winner-container').addClass('slideIn')

    if(num == 1){
      $('body').append(this.WinnerdDom)
      this.dom = this.WinnerdDom
    }

    if(num == 2){
      $('body').append(this.LoadingDom)
      this.dom = this.LoadingDom
    }

    if(num == 3){
      $('body').append(this.SucDom)
      this.dom = this.SucDom
    }

    if(num == 4){
      $('body').append(this.ErrRedDom)
      this.dom = this.ErrRedDom
    }

    if(num == 5){
      $('body').append(this.ErrTuiKuanDom)
      this.dom = this.ErrTuiKuanDom
    }
    this.dom.css('background','rgba(0, 0, 0, 0.7)')
    this.dom.find('.isSlideOut').removeClass('slideOut')
    this.clickEvent()
  }

  this.clickEvent = function(){
    var that = this;

    that.dom.find('.btn-hide').on({
      click:function(){
        that.remove()
      }
    })

    that.dom.find('.btn-hanlde').on({
      click:function(){
        that.dom.remove();
        that.render(2)
        that.refresh()
        orders.getOrderInfoByOrderId();
      }
    })

    that.dom.find('.btn-go-again').on({
      click:function(){
        that.dom.remove();
        orders.purchaseUnifiedOrder();
      }
    })

    that.dom.find('.btn-kefu').on({
      click:function(){
        var tel = "tel:" + orders.telPhone;
  			if(orders.telPhone == undefined){
  				return;
  			}
  			window.location.href = tel;
      }
    })

    that.dom.find('.after-use').on({
      click:function(){
        that.remove();
      }
    })

    that.dom.find('.use-now').on({
      click:function(){
        //立即使用红包
        window.location.href = 'toPay.html?vmId=' + orders.vm_id + '&opId=' + orders.duangProductVo.id  + '&sourceFlag=2&v=' + pageversion;
      }
    })

    that.dom.find('.btn-tuikuan').on({
      click:function(){
        //退款
        window.location.href = 'refundProcess.html?orderId=' + orders.orderId + '&v=' + pageversion ;
      }
    })
  }

  this.remove = function(){
    var that = this;
    this.dom.find('.isSlideOut').addClass('slideOut')
    this.dom.find('.slideIn').removeClass('slideIn')
    this.dom.css('background','none')
    setTimeout(function(){
      that.dom.remove()
    }, 320);
  }
}


var alertBox = new AlertBox()


var NotWin = function(){
  this.dom = $('<div class="alert-box"><div class="not-win-container slideIn"><div class="btn-hide"></div>'+
    '<div class="btn-go-again"></div>'+
    '<div class="btn btn-go-ad go-ad"></div><div class="ad-box go-ad"></div></div></div>')

  this.render = function(){
    $('body').append(this.dom)
    this.dom.find('.not-win-container').addClass('slideIn')
    this.dom.css('background','rgba(0, 0, 0, 0.7)')
    this.dom.find('.slideOut').removeClass('slideOut')
    this.clickEvent()
  }

  this.clickEvent = function(){
    var that = this;

    that.dom.find('.btn-go-again').on({
      click:function(){
        orders.purchaseUnifiedOrder()
        that.dom.remove()
      }
    })

    that.dom.find('.btn-hide').on({
      click:function(){
        that.remove();
      }
    })

    that.dom.find('.go-ad').on({
      click:function(){
        if(is_add_ad){
          showAd(orders.orderId,merchAndMultiple.productList[0].discount_price*100,orders.openId)
          that.remove();
        }else{
          that.remove();
        }
      }
    })

  }

  this.remove = function(){
    var that = this;
    this.dom.find('.slideIn').addClass('slideOut')
    this.dom.find('.slideIn').removeClass('slideIn')
    this.dom.css('background','none')
    setTimeout(function(){
      that.dom.remove()
    }, 320);
  }
}

var notWin = new NotWin()

var XieYi = function(){
  this.minDom = $('<div class="xieyi-mini-container"><div class="btn-select"></div>'+
            '<div class="btn-show-xieyi"></div><div class="btn-queding"></div></div')

  this.maxDom = $('<div class="xieyi-max-container"><textarea name="" readonly></textarea><div class="btn-select"></div>'+
    '<div class="btn-show-xieyi"></div><div class="btn-queding"></div></div>')
  
  this.dom = $('<div class="alert-box"></div>')

  this.select = true
  this.click = true

  this.show = false;

  this.refresh = function(){
    if(this.select){
      this.dom.find('.btn-select').css({
        'background': 'url('+'tantan/img/xieyi_select_pre.png'+') no-repeat center center',
        'background-size': '100% 100%'
      })
      this.dom.find('.btn-queding').css({
        'opacity': '1'
      })
    }else{
      this.dom.find('.btn-select').css({
        'background': 'url('+'tantan/img/xieyi_select.png'+') no-repeat center center',
        'background-size': '100% 100%'
      })
      this.dom.find('.btn-queding').css({
        'opacity': '0.3'
      })
    }

    this.click = this.select;
  }

  this.render = function(){
    this.minDom.addClass('slideIn')
    this.dom.html(this.minDom)
    $('body').append(this.dom)
    this.clickEvent()
  }

  this.clickEvent = function(){
    var that = this;
    $('.btn-select').on({
      click:function(){
        that.select = !that.select
        that.refresh();
      }
    })

    $('.btn-show-xieyi').on({
      click:function(){
        that.show = !that.show
        if(that.show){
          that.minDom.removeClass('slideIn')
          that.dom.html(that.maxDom)
          that.dom.find('textarea').val(protocolText)
        }else{
          that.dom.html(that.minDom)
        }

        that.clickEvent()
      }
    })

    $('.btn-queding').unbind()
    $('.btn-queding').on({
      click:function(){
        if(!that.click){
          return;
        }
        localStorage.tantanXieYi = that.select;
        
        orders.purchaseUnifiedOrder();
        that.dom.remove()
      }
    })
  }

}


var Gonglve = function(){
  this.dom = $('<div class="alert-box"><div class="gonglve-container slideIn"><div class="btn-queding"></div></div</div>')

  this.render = function(){
    this.dom.find('.gonglve-container').addClass('slideIn')
    this.dom.css('background','rgba(0, 0, 0, 0.7)')
    this.dom.find('.slideOut').removeClass('slideOut')
    $('body').append(this.dom)
    this.clickEvent()
  }

  this.clickEvent = function(){

    var that = this;
    $('.btn-queding').unbind()
    $('.btn-queding').on({
      click:function(){
        that.remove()
      }
    })
  }

  this.remove = function(){
    var that = this;
    this.dom.find('.slideIn').addClass('slideOut')
    this.dom.find('.slideIn').removeClass('slideIn')
    this.dom.css('background','none')
    setTimeout(function(){
      that.dom.remove()
    }, 320);
  }
}

var gonglve = new Gonglve()

var Page = function(){}

Page.prototype.init = function(){
  canvasBox.render()
  merchAndMultiple.render()
  btnGo.render()

  // btnGuize.render();

  animation = new Animation()
  animation.MinInit()
  // animation.MaxInit()
}

var page = new Page();





/**
 * Loading
 * @module.exports = loading;
 */

var Loading = function(){
  this.dom = $('<div id="loading"><img src="img/uloading.gif" alt=""></div>')
  this.render = function(){
    $('body').append(this.dom)
  }

  this.remove = function(){
    this.dom.remove();
  }
}

var loading = new Loading()



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


function sortDiscountPriced(a,b){  
  return a.discount_price-b.discount_price  
}